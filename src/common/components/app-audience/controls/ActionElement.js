import React from "react"
import { Button } from 'antd';

export default class ActionElement extends React.Component {

	render() {
		const {label, className, handleOnClick} = this.props;

		return (
			<Button
				className={className}
				label={label}
				onClick={e => handleOnClick(e)}/>
		);
	}
}
