import React from 'react';
import { Input } from 'antd';


export default class ValueEditor extends React.Component {
	
	render() {
		const {field, operator, value, handleOnChange} = this.props;

		if (operator === 'null' || operator === 'notNull') {
			return null;
		}

		return (
			<Input
				hintText="Hint Text"
				value={value}
				onChange={e => handleOnChange(e.target.value)}/>
		);
	}
}
