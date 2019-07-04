import React from 'react';
import { Select } from 'antd';

const SelectAudience = (props, ref) => (
  <div ref={ref}>
    <Select {...props}>
      {props.options.map((value, key) => (
        <Select.Option key={key} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</Select.Option>
      ))}
    </Select>
  </div>
);

export default React.forwardRef(SelectAudience);
