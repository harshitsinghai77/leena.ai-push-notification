import React from 'react';
import TimeInput from 'material-ui-time-picker';
import { Input } from 'antd';

const InputComponent = props => (
  <Input {...props} placeholder="Select Time" />
);

const Time = (props, ref) => (
  <TimeInput disabled={props.disabletime} inputComponent={InputComponent} ref={ref} {...props} mode="12h" />
);

export default React.forwardRef(Time);
