import React from 'react';
import each from 'lodash/each';

export default class Rule extends React.Component {
  static get defaultProps() {
    return {
      _id: null,
      parentId: null,
      field: null,
      operator: null,
      value: null,
      schema: null,
    };
  }

  render() {
    const { operand, operator, value, schema: { operands, operators, controls, getOperators, classNames }, totalQuery } = this.props;
    let show = true;
    each(operators, (currOperator) => {
      if (currOperator.name === operator) {
        if (currOperator.operands == 1) {
          show = false;
          return false;
        }
      }
    });

    return (
      <div style={{ paddingBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <span text="Output">Output</span>
          <span text="Condition">Condition</span>
          { show && <span text="Value">Value</span> }
        </div>
        <div className={`rule ${classNames.rule}`}>
          {
            React.createElement(controls.fieldSelector,
              {
                options: operands,
                value: operand,
                className: `rule-fields ${classNames.fields}`,
                handleOnChange: this.onFieldChanged,
                label: 'Output',
              })
          }
          {
            React.createElement(controls.operatorSelector,
              {
                options: getOperators(operand),
                value: operator,
                operands,
                className: `rule-operators ${classNames.operators}`,
                handleOnChange: this.onOperatorChanged,
                label: 'Condition',
              })
          }
          {
            operators.findIndex(item => item.operands === '1' && item.operator === operator) === -1
            && React.createElement(controls.valueEditor,
              {
                operands,
                value,
                className: `rule-value ${classNames.value}`,
                handleOnChange: this.onValueChanged,
                label: 'Value',
              })
          }
          { totalQuery > 1
            && React.createElement(controls.removeRuleAction,
              {
                label: 'x',
                className: `rule-remove ${classNames.removeRule}`,
                handleOnClick: this.removeRule,
              })
          }
        </div>
      </div>
    );
  }

  onFieldChanged = (value) => {
    this.onElementChanged('operand', value);
  }

  onOperatorChanged = (value) => {
    this.onElementChanged('operator', value);
  }

  onValueChanged = (value) => {
    this.onElementChanged('value', value);
  }

  onElementChanged = (property, value) => {
    const { _id, schema: { onPropChange } } = this.props;

    onPropChange(property, value, _id);
  }

  removeRule = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.schema.onRuleRemove(this.props._id, this.props.parentId);
  }
}
