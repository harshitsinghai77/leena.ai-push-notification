import React from 'react';
import each from "lodash/each";

export default class Rule extends React.Component {
  static get defaultProps() {
    return {
      _id     :null,
      parentId:null,
      field   :null,
      operator:null,
      value   :null,
      schema  :null
    };
  }

  render() {
    const { operand, operator, value, schema: { operands, operators, controls, getOperators, classNames } } = this.props;

    let show = true;
    each(operators, currOperator => {
      if (currOperator.name === operator) {
        if (currOperator.operands == 1) {
          show = false;
          return false;
        }
      }
    });

    return (
      <div style={{ paddingBottom:10 }}>
        <div style={{ display:"flex", marginLeft:50 }}>
          <span style={{ width:180 }}> Output </span>
          <span style={{ width:200 }}> Condition </span>
          { show && <span style={{ width:100 }}>Value</span> }
        </div>
        <div className={`rule ${classNames.rule}`}>
          {
            React.createElement(controls.fieldSelector,
              {
                options       :operands,
                value         :operand,
                className     :`rule-fields ${classNames.fields}`,
                handleOnChange:this.onFieldChanged
              }
            )
          }
          {
            React.createElement(controls.operatorSelector,
              {
                options       :getOperators(operand),
                value         :operator,
                className     :`rule-operators ${classNames.operators}`,
                handleOnChange:this.onOperatorChanged
              }
            )
          }
          {
            React.createElement(controls.valueEditor,
              {
                field         :operand,
                operator      :operator,
                value         :value,
                className     :`rule-value ${classNames.value}`,
                handleOnChange:this.onValueChanged,
              }
            )
          }
          {
            React.createElement(controls.removeRuleAction,
              {
                label        :'x',
                className    :`rule-remove ${classNames.removeRule}`,
                handleOnClick:this.removeRule
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
