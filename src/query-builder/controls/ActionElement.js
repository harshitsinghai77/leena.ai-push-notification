import React from 'react';
import { Button } from 'antd';

function ActionElement(props) {
  const { label, className, handleOnClick } = props;
  return (
    <Button
      className={className}
      onClick={e => handleOnClick(e)}
    >
      {label}
    </Button>
  );
}

export default React.memo(ActionElement);
