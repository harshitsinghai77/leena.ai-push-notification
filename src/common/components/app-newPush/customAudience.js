import React, {useState , useEffect, forwardRef} from 'react';
import { Select } from 'antd';
import '../../../project-bootstap'
import {ParamsContext} from '../../../Context'
const Option = Select.Option;

function CustomAudience(props , ref) {

    const [option, setOption] = useState([])
    const { botId } = React.useContext(ParamsContext) || {};

    useEffect(() => {
        window.axiosInstance.get(`bots/${botId}/notifications/audiences`)
        .then(response =>  {
          setOption(response.data.audiences)
        })
        .catch(error => {
          console.log(error);
      });
    },[])

    const getOptions = option.map((value) => {
      return(
        <Option key = {value._id} value = {value._id}>{value.name}</Option>
      )
  })
  
    return (
        <div ref={ref}>
          <Select
            showSearch
            placeholder="Select a Audience"
            optionFilterProp="children"
            onChange={props.onChange}
            filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {getOptions}
          </Select>
        </div>
    )
}

export default forwardRef(CustomAudience);