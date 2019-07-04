import React from 'react';
import { Input } from 'antd';

function ValueEditor(props) {
  const { value, handleOnChange } = props;
  return (
    <Input
      placeholder="Value"
      value={value}
      onChange={e => handleOnChange(e.target.value)}
    />
  );
}
export default React.memo(ValueEditor);
