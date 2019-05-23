import React, {useState , useEffect, forwardRef} from 'react';
import { Select } from 'antd';
import '../../../../../project-bootstap'

const Option = Select.Option;

function onSearch(val) {
    console.log('search:', val);
}

function CustomAudience(props , ref) {

    const [option, setOption] = useState([])

    useEffect(() => {
        window.axiosInstance.get('https://dev.chatteron.io/api/bots/5ce100ae6d951400100308b9/notifications/audiences')
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
            style={{ width: 200 }}
            placeholder="Select a Audience"
            optionFilterProp="children"
            onChange={props.onChange}
            onSearch={onSearch}
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