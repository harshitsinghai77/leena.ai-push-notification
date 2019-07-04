import React from 'react';
import { Select } from 'antd';
import '../../../project-bootstap';
import { ParamsContext } from '../../../Context';

function CustomAudience(props, ref) {
  const [option, setOption] = React.useState([]);
  const { botId } = React.useContext(ParamsContext) || {};
  const [loading, setLoading] = React.useState(true);
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    window.axiosInstance.get(`api/bots/${botId}/notifications/audiences`)
      .then((response) => {
        const { audiences } = response.data;
        setOption(audiences);
        setLoading(false);
        if (Array.isArray(audiences) && audiences[0]) return onChange(audiences[0]._id);
      });
  }, []);


  const Options = option.map(value => (
    <Select.Option key={value._id} value={value._id}>
      {value.name}
      {' '}
      (
      {value.numTotal}
      )
    </Select.Option>
  ));

  const onChange = (value) => {
    setValue(value);
    props.onChange(value);
  };

  return (
    <Select
      ref={ref}
      placeholder="Select a Audience"
      onChange={onChange}
      loading={loading}
      value={value}
    >
      {Options}
    </Select>
  );
}

export default React.forwardRef(CustomAudience);
