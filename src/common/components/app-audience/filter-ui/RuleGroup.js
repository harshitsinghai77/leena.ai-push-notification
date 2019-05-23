import React from "react"
import _ from "lodash/core"
import Rule from "./Rule"

export default class RuleGroup extends React.Component {
	static get defaultProps() {
		return {
			_id       : null,
			parentId  : null,
			children  : [],
			combinator: 'and',
			schema    : {},
		};
	}

	render() {
		const {combinator, children, schema: {combinators, controls, onRuleRemove, isRuleGroup, classNames}} = this.props;
		return (
			<div className={`ruleGroup ${classNames.ruleGroup}`}>
				{
					React.createElement(controls.removeGroupAction,
						{
							label        : 'x',
							className    : `ruleGroup-remove ${classNames.removeGroup}`,
							handleOnClick: this.removeGroup
						}
					)
				}
				{
					_.map(children, (childInfo, index) => {
						return (
							<div key={index}>
								<Rule key={childInfo._id}
											_id={childInfo._id}
											operand={childInfo.operand}
											value={childInfo.value}
											operator={childInfo.operator}
											schema={this.props.schema}
											parentId={this.props._id}
											onRuleRemove={onRuleRemove}/>
								{
									index + 1 != children.length ?
										<span key={`andKey${index}`}> AND </span>
										: null
								}
							</div>
						);
					})
				}
				<div style={{display: "flex", height: 36, paddingTop: 10}}>
					{
						React.createElement(controls.addRuleAction,
							{
								label        : '+ AND',
								className    : `ruleGroup-addRule ${classNames.addRule}`,
								handleOnClick: this.addRule
							}
						)
					}
				</div>
			</div>
		);
	}

	hasParentGroup() {
		return this.props.parentId;
	}

	onCombinatorChange = (value) => {
		const {onPropChange} = this.props.schema;
		onPropChange('combinator', value, this.props._id);
	};

	addRule = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const {createRule, onRuleAdd} = this.props.schema;

		const newRule = createRule();
		onRuleAdd(newRule, this.props._id)
	};

	addGroup = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const {createRuleGroup, onGroupAdd} = this.props.schema;
		const newGroup = createRuleGroup();
		onGroupAdd(newGroup, this.props._id)
	};

	removeGroup = (event) => {
		event.preventDefault();
		event.stopPropagation();

		this.props.schema.onGroupRemove(this.props._id, this.props.parentId);
	}

}
