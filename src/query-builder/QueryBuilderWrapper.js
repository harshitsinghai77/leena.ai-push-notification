import React from 'react';
import { Button, Icon } from 'antd';
import update from 'immutability-helper';
import _ from 'lodash/core';
import uniqueId from 'uuid/v4';
import QueryBuilder from './QueryBuilder';
import './index.css';

export const combinators = [
  { name: 'and', label: 'AND' },
  { name: 'or', label: 'OR' },
];

export const controlClassnames = {
  queryBuilder: 'queryBuilder',

  ruleGroup: 'ruleGroup',
  combinators: 'combinators',
  addRule: 'addRule',
  addGroup: 'addGroup',
  removeGroup: 'removeGroup',

  rule: 'rule',
  fields: 'fields',
  operators: 'operators',
  value: 'value',
  removeRule: 'removeRule',
};

export default class QueryBuilderWrapper extends React.Component {
	state = {
	  operands: this.props.operands,
	  queries: {},
	};

	componentWillMount() {
	  const { query, operands } = this.props;
	  if (operands) {
	    this.setState({ operands });
	  }
	  if (query) {
	    const childrenWithIds = _.map(query.children, child => ({
	      ...child,
	      _id: `${uniqueId()}`,
	      children: _.map(child.children, innerChild => ({ ...innerChild, _id: `${uniqueId()}` })),
	    }));
	    this.setState({ queries: { ...query, children: childrenWithIds } });
	  } else {
	    this.setState({
	      queries: {
	        combinator: 'OR',
	        children: [{
	          _id: `${uniqueId()}`,
	          children: [{
	            _id: `${uniqueId()}`,
	            operand: this.props.operands[0].name,
	            value: '',
	            operator: this.props.operators[0].operator,
	          }],
	          combinator: 'AND',
	        }],
	      },
	    });
	  }
	}

	appendChildrenWithOr = () => {
	  const { queries } = this.state;
	  const newQueries = update(queries, {
	    children: {
	      $push: [{
	        _id: `${uniqueId()}`,
	        children: [{
	          _id: `${uniqueId()}`,
	          operand: this.state.operands[0].name,
	          value: '',
	          operator: this.props.operators[0].operator,
	        }],
	        combinator: 'AND',
	      }],
	    },
	  });
	  // this.props.finalQuery(queries);
	  this.setState({ queries: newQueries });
	};

	removeGroup = (id) => {
	  const orginalQuery = this.state.queries;
	  let newQueries = orginalQuery.children || [];
	  const deleteIdx = newQueries.findIndex(query => query._id === id);
	  if (deleteIdx !== -1) {
	    newQueries = update(newQueries, {
	      $splice: [[deleteIdx, 1]],
	    });
	  }
	  orginalQuery.children = newQueries;
	  this.setState({ queries: orginalQuery });
	  this.props.finalQuery(orginalQuery);
	};

	renderRuleGroup() {
	  const { queries } = this.state;
	  const returnData = [];

	  _.map(queries.children, (query, index) => {
	    const controlElements = {
	      removeGroupAction: customRemoveGroup({ index, removeGroup: this.removeGroup, id: query._id }),
	    };

	    returnData.push(
  <div key={query._id}>
    <QueryBuilder
      query={query}
      totalQuery={queries.children.length}
      operands={this.state.operands}
      operators={this.props.operators}
      removeGroup={() => this.removeGroup(index)}
      onQueryChange={query => this.logQuery({ index, query })}
      {...{ controlClassnames, combinators, controlElements }}
    />
    {
						queries.children.length !== index + 1
						  ? <span key={`orKey${index}`}>OR</span>
						  : null
					}
  </div>,
	    );
	  });
	  return returnData;
	}

	render() {
	  return (
  <div>
    {this.renderRuleGroup()}
    <Button
      style={{ marginTop: 20 }}
      onClick={this.appendChildrenWithOr}
    >
      {' '}
OR
    </Button>
  </div>
	  );
	}

	logQuery = (options) => {
	  const { index, query } = options;
	  const { queries } = this.state;
	  const newQueries = update(queries, {
	    children: {
	      [index]: {
	        $set: query,
	      },
	    },
	  });
	  this.setState({ queries: newQueries });
	  // pass query to parent component
	  this.props.finalQuery(newQueries);
	};

	componentWillReceiveProps(nextProps, nextContext) {
	  if (nextProps.operands) {
	    this.setState({ operands: nextProps.operands });
	  }
	}
}

let customRemoveGroup = function (options) {
  return class RemoveGroup extends React.Component {
    render() {
      const { id, removeGroup } = options;
      return (
        <span
          key={id}
          className="close"
          onClick={() => {
				  removeGroup(id);
          }}
        >
          <Icon style={{ float: 'right' }} type="delete" />
        </span>
      );
    }
  };
};
