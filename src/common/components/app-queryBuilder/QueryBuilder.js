import axios from 'axios';
import React from 'react';

import '../../../project-bootstap';
import QueryBuilderWrapper from '../../../query-builder';
import { ParamsContext } from '../../../Context';

function QueryBuilder(props, ref) {
  const { botId } = React.useContext(ParamsContext) || {};
  const [operator, setOperator] = React.useState([]);
  const [operands, setOperands] = React.useState([]);

  const [defaultValue, setDefaultValue] = React.useState(null);

  const getOperands = () => window.axiosInstance.get(`api/bots/${botId}/operands?app=notification`);

  const getOperators = () => window.axiosInstance.get('api/operators?app=notification');

  const finalQuery = (value) => {
    props.onChange(value);
  };

  React.useEffect(() => {
    const { value } = props;
    if (value && typeof value === 'object' && 'children' in value) {
      setDefaultValue(value);
    }
    axios.all([getOperands(), getOperators()])
      .then(axios.spread((acct, perms) => {
        setOperands(acct.data.operands);
        setOperator(perms.data.operators);
      }));
  }, []);

  return (
    <div ref={ref}>
      {operands.length && operator.length
        ? (
          <QueryBuilderWrapper
            query={defaultValue}
            finalQuery={finalQuery}
            operands={operands}
            operators={operator}
          />
        ) : 'Loading...'}
    </div>
  );
}

export default React.forwardRef(QueryBuilder);
