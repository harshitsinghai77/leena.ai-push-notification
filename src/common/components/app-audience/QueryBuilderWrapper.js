import React, { Component } from "react"
import update from "immutability-helper"
import _ from "lodash/core"
import QueryBuilder from "./QueryBuilder"
import {combinators, controlClassnames} from "./queryBuilderData"
import each from "lodash/each"
import uniqueId from "uuid/v4"
import { Button, Input, Icon } from 'antd';

import Operators from './operators.json'
import Operands from  './operands.json'


class QueryBuilderWrapper extends Component {

	state = {
		operands: Operands,
		operators: Operators,
		queries : {}
	};

	componentWillMount() {
		let {query, operands} = this.props;
		if (operands) {
			this.setState({operands});
		}
		if (query) {
			const childrenWithIds = _.map(query.children, (child) => {
				return {
					...child,
					_id: `${uniqueId()}`,
                    children: _.map(child.children, (innerChild) => ({ ...innerChild, _id: `${uniqueId()}`}))
				};
            });
			this.setState({queries: { ...query, children: childrenWithIds}});
		} else {
			this.setState({
				queries: {
					operator: "OR",
					children: [{
						_id     : `${uniqueId()}`,
						children: [{
							_id     : `${uniqueId()}`,
							operand : this.state.operands[0].name,
							value   : "",
							operator: this.state.operators[0].name,
						}],
						operator: "AND",
					}]
				}
			});
		}
	}

	appendChildrenWithOr = () => {
		let {queries} = this.state;
		let newQueries = update(queries, {
			children: {
				$push: [{
					_id     : `${uniqueId()}`,
					children: [{
						_id     : `${uniqueId()}`,
						operand : this.state.operands[0].name,
						value   : "",
						operator: this.props.operators[0].name,
					}],
					operator: "AND",
				}]
			}
		});
		// this.props.finalQuery(queries);
		this.setState({queries: newQueries});
	};

	removeGroup = (id) => {
		let newQueries = this.state.queries || [];
		let deleteIdx = newQueries.findIndex((query)=> {
			return query._id === id;
		});
		if (deleteIdx !== -1) {
			newQueries = update(newQueries, {
				$splice: [[deleteIdx, 1]]
			})
		}
		this.setState({queries: newQueries});
		// pass query to parent component
		this.props.finalQuery(newQueries);
	};

	renderRuleGroup() {
		let {queries} = this.state;
		let returnData = [];

		_.map(queries.children, (query, index) => {

			let controlElements = {
				removeRuleAction : customRemoveRule({index: index, id: query._id}),
				removeGroupAction: customRemoveGroup({index: index, removeGroup: this.removeGroup, id: query._id}),
				valueEditor      : customValueEditor({index: index, operators: this.props.operators, id: query._id}),
			};

			returnData.push(
				<div key={query._id}>
					<QueryBuilder
						query={query}
						operands={this.state.operands}
						operators={this.props.operators}
						controlElements={controlElements}
						combinators={combinators}
						controlClassnames={controlClassnames}
						removeGroup={() => this.removeGroup(index)}
						onQueryChange={(query) => this.logQuery({index: index, query: query})}
					/>
					{
						queries.children.length !== index + 1 ?
							<span key={`orKey${index}`}> OR </span>
							: null
					}
				</div>
			);
		});
		return returnData;
	};

	render() {
		return (
			<div>
				{this.renderRuleGroup()}
				<Button type="primary" 
					style={{marginTop: 20}}
					label="OR"
					onClick={this.appendChildrenWithOr}
					icon={<Icon type="file-add" />}>OR
				</Button>
			</div>
		);
	}

	logQuery = (options) => {
		let {index, query} = options;
		let {queries} = this.state;
		let newQueries = update(queries, {
			children: {
				[index]: {
					$set: query
				}
			}
		});
		this.setState({queries: newQueries});
		// pass query to parent component
		this.props.finalQuery(newQueries);
	};

	componentWillReceiveProps(nextProps, nextContext) {
		if (nextProps.operands) {
			this.setState({operands: nextProps.operands});
		}
	}

}

let customRemoveRule = function (options) {
	let {index} = options;
	return class RemoveRule extends React.Component {
		render() {
			return (
				<Icon type="delete" key={`deleteRule${index}`} className="deleteBtn" style={{paddingTop: 10}} color="#b7bbc4"
								onClick={this.props.handleOnClick}/>
			);
		}
	};
};

let customRemoveGroup = function (options) {
	return class RemoveGroup extends React.Component {
		render() {
			let {id, index, removeGroup} = options;
			return (
				<span key={id } className="close" onClick={() => {
					removeGroup(id);
				}}>&times;</span>
			);
		}
	};
};

let customValueEditor = function (options) {
	let {index, hintText = "Value", operators} = options;
	return class ValueEditor extends React.Component {
		render() {
			let show = true;
			//TODO reduce this loop by getting operands from owner component instead of iterating
			each(operators, operator => {
				if (operator.name === this.props.operator) {
					if (operator.operands == 1) {
						show = false;
						return false;
					}
				}
			});
			if (show)
				return (
					<Input
						key={`textField${index}`}
						hintText={hintText}
						value={this.props.value}
						onChange={(event, value) => this.props.handleOnChange(value)}
					/>
				);
			else
				return <div style={{width: 256}}></div >;
		}
	};
};

export default QueryBuilderWrapper;

