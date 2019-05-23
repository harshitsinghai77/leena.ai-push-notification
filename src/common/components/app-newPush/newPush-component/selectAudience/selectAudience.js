import React, { forwardRef  } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

function SelectAudience(props , ref) {

    return (
        <div ref={ref}>
            <Select {...props}>
                    {props.options.map((value, key) => {
                        return(
                            <Option key = {key} value = {value}>{value.charAt(0).toUpperCase() + value.slice(1)}</Option>
                        )
                    })}
            </Select>
        </div>
    );
}

export default forwardRef(SelectAudience);