import _ from "lodash/core"
import React, {Component} from "react"

export default class ValueSelector extends Component {
	render() {
		let {value, options, className, handleOnChange} = this.props;

		if (!value && options && options[0]) {
			value = options[0].name;
		}

		return (
			<select className={className}
							value={value}
							onChange={e => handleOnChange(e.target.value)}>
				{
					_.map(options, option => {
						let itemKey = option._id || option.name;
						return (
							<option key={itemKey} value={option.name}>{option.label}</option>
						);
					})
				}
			</select>
		);
	}
}
