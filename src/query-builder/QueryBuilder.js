import uniqueId from 'uuid/v4';
import cloneDeep from 'lodash/cloneDeep';
import React, { Component } from 'react';
import RuleGroup from './RuleGroup';
import { ActionElement, ValueEditor, ValueSelector, RemoveRule } from './controls';

const defaultCombinators = [
  { name: 'and', label: 'AND' },
  { name: 'or', label: 'OR' },
];

const defaultOperators = [
  { name: 'null', label: 'Is Null' },
  { name: 'notNull', label: 'Is Not Null' },
  { name: 'in', label: 'In' },
  { name: 'notIn', label: 'Not In' },
  { name: '=', label: '=' },
  { name: '!=', label: '!=' },
  { name: '<', label: '<' },
  { name: '>', label: '>' },
  { name: '<=', label: '<=' },
  { name: '>=', label: '>=' },
];

export default class QueryBuilder extends Component {
	static defaultProps = {
	  query: null,
	  operands: [],
	  operators: defaultOperators,
	  combinators: defaultCombinators,
	  controlElements: null,
	  getOperators: null,
	  onQueryChange: null,
	  controlClassnames: null,
	};

	// static propTypes = {
	// 	query            : PropTypes.object,
	// 	operands         : PropTypes.array.isRequired,
	// 	operators        : PropTypes.array,
	// 	combinators      : PropTypes.array,
	// 	controlElements  : PropTypes.shape({
	// 		addGroupAction    : PropTypes.func,
	// 		removeGroupAction : PropTypes.func,
	// 		addRuleAction     : PropTypes.func,
	// 		removeRuleAction  : PropTypes.func,
	// 		combinatorSelector: PropTypes.func,
	// 		fieldSelector     : PropTypes.func,
	// 		operatorSelector  : PropTypes.func,
	// 		valueEditor       : PropTypes.func
	// 	}),
	// 	getOperators     : PropTypes.func,
	// 	onQueryChange    : PropTypes.func,
	// 	controlClassnames: PropTypes.object
	// };

	state = {
	  root: {},
	  schema: {},
	};

	static defaultControlClassnames = {
	  queryBuilder: '',

	  ruleGroup: '',
	  combinators: '',
	  addRule: '',
	  addGroup: '',
	  removeGroup: '',

	  rule: '',
	  operands: '',
	  operators: '',
	  value: '',
	  removeRule: '',
	};

	static defaultControlElements = {
	  addGroupAction: ActionElement,
	  removeGroupAction: ActionElement,
	  addRuleAction: ActionElement,
	  removeRuleAction: RemoveRule,
	  combinatorSelector: ValueSelector,
	  fieldSelector: ValueSelector,
	  operatorSelector: ValueSelector,
	  valueEditor: ValueEditor,
	};

	componentWillMount() {
	  const { operands, operators, combinators, controlElements, controlClassnames } = this.props;
	  const classNames = Object.assign({}, QueryBuilder.defaultControlClassnames, controlClassnames);
	  const controls = Object.assign({}, QueryBuilder.defaultControlElements, controlElements);

	  this.setState({
	    root: this.getInitialQuery(),
	    schema: {
	      operands,
	      operators,
	      combinators,

	      classNames,

	      createRule: this.createRule.bind(this),
	      createRuleGroup: this.createRuleGroup.bind(this),
	      onRuleAdd: this._notifyQueryChange.bind(this, this.onRuleAdd),
	      onGroupAdd: this._notifyQueryChange.bind(this, this.onGroupAdd),
	      onRuleRemove: this._notifyQueryChange.bind(this, this.onRuleRemove),
	      onGroupRemove: this._notifyQueryChange.bind(this, this.onGroupRemove),
	      onPropChange: this._notifyQueryChange.bind(this, this.onPropChange),
	      isRuleGroup: this.isRuleGroup.bind(this),
	      controls,
	      getOperators: (...args) => this.getOperators(...args),
	    },
	  });
	}

	getInitialQuery() {
	  return this.props.query || this.createRuleGroup();
	}

	componentDidMount() {
	  this._notifyQueryChange(null);
	}

	render() {
	  const { root: { _id, children, combinator }, schema } = this.state;
	  const { totalQuery } = this.props;

	  const className = `queryBuilder ${schema.classNames.queryBuilder}`;
	  return (
  <div className={className}>
    <RuleGroup
      totalQuery={totalQuery}
      children={children}
      combinator={combinator}
      schema={schema}
      _id={_id}
      parentId={null}
    />
  </div>
	  );
	}

	isRuleGroup(rule) {
	  return !!(rule.combinator && rule.children);
	}

	createRule() {
	  const { operands, operators } = this.state.schema;

	  return {
	    _id: `${uniqueId()}`,
	    operand: operands[0].name,
	    value: '',
	    // operator: operators[0].name,
	    operator: operators[0].operator,
	  };
	}

	createRuleGroup() {
	  return {
	    _id: `${uniqueId()}`,
	    children: [],
	    operator: this.props.combinators[0].name,
	  };
	}

	getOperators(operands) {
	  if (this.props.operators) {
	    return this.props.operators;
	  }
	  return defaultOperators;
	}

	onRuleAdd(rule, parentId) {
	  const parent = this.state.root; // this._findRule(parentId, this.state.root);
	  parent.children.push(rule);
	  this.setState({ root: this.state.root });
	}

	onGroupAdd(group, parentId) {
	  const parent = this._findRule(parentId, this.state.root);
	  parent.children.push(group);

	  this.setState({ root: this.state.root });
	}

	onPropChange(prop, value, ruleId) {
	  const rule = this._findRule(ruleId, this.state.root);
	  Object.assign(rule, { [prop]: value });
	  this.setState({ root: this.state.root });
	}

	onRuleRemove(ruleId, parentId) {
	  const parent = this.state.root; // this._findRule(parentId, this.state.root);
	  const index = parent.children.findIndex(x => x._id === ruleId);
	  parent.children.splice(index, 1);
	  this.setState({ root: this.state.root });
	}

	onGroupRemove(groupId, parentId) {
	  const { removeGroup } = this.props;
	  if (removeGroup) {
	    removeGroup();
	  }
	}

	_findRule(_id, parent) {
	  const { isRuleGroup } = this.state.schema;

	  if (parent._id === _id) {
	    return parent;
	  }

	  for (const rule of parent.children) {
	    if (rule._id === _id) {
	      return rule;
	    } if (isRuleGroup(rule)) {
	      const subRule = this._findRule(_id, rule);
	      if (subRule) {
	        return subRule;
	      }
	    }
	  }
	}

	_notifyQueryChange(fn, ...args) {
	  if (fn) {
	    fn.call(this, ...args);
	  }
	  if (fn && fn.name == 'onGroupRemove') {
	    return;
	  }
	  const { onQueryChange } = this.props;
	  // if (onQueryChange && !this.throttlesQueryChange) {
	  //   this.throttlesQueryChange = debounce(onQueryChange, 500);
	  // }
	  // const query = cloneDeep(this.state.root);
	  // this.throttlesQueryChange(query);

	  if (onQueryChange) {
	    const query = cloneDeep(this.state.root);
	    onQueryChange(query);
	  }
	}

	componentWillReceiveProps(nextProps, nextContext) {
	  if (nextProps.operands && this.props.operands != nextProps.operands) {
	    this.setState({
	      schema: {
	        ...this.state.schema, operands: nextProps.operands,
	      },
	    });
	  }
	}
}
