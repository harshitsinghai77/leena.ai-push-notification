import React from 'react';
import { Icon } from 'antd';

const RemoveRule = (props) => {
  const { index } = props;

  return (
    <Icon
      type="delete"
      key={`deleteRule${index}`}
      className=""
      style={{ paddingTop: 10, marginLeft: '15px' }}
      color="#b7bbc4"
      onClick={props.handleOnClick}
    />
  );
};

export default RemoveRule;
