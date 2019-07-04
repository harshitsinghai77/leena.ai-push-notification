import React from 'react';
import { Select } from 'antd';


function ValueSelector(props) {
  let { value, options = [], className, handleOnChange: onChange } = props;
  if (!value && options && options[0]) {
    value = options[0].name;
  }

  const renderOptions = options.map((option) => {
    const { _id, name, displayName, operator } = option;
    const key = _id || name;
    const label = displayName || name;
    const value = displayName ? name : operator;
    return <Select.Option {...{ key, value }}>{label}</Select.Option>;
  });

  return (
    <Select
      {...{ onChange, className, defaultValue: value }}
      showSearch
      dropdownMatchSelectWidth={false}
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
		}
    >
      {renderOptions}
    </Select>
  );
}

export default React.memo(ValueSelector);
