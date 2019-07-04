import React from 'react';
import { Select } from 'antd';

const SelectOption = (props, ref) => (
    <Select mode="tags" style={{ maxWidth: '400px' }} placeholder="Add options" dropdownStyle = {{display: "none"}} onChange={props.onChange} />
)

export default React.forwardRef(SelectOption)