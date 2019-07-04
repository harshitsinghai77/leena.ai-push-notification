import React from 'react';
import { Typography } from 'antd';

function Analytics(props) {
  const { data } = props;
  
  const Option = data.option.map((value, key) => (<li key = {key}> <a >{value}</a> </li>))

  return (
      <Typography style = {{marginRight: '10%'}}>
          <Typography.Paragraph>
            <Typography.Text>
              <Typography.Text strong>Total no. of recipients -  {data.recipients}</Typography.Text> <br />
              <Typography.Text strong>Successful - {data.numSuccess}</Typography.Text> <br />
              <Typography.Text strong>Failure - {data.numFailed}</Typography.Text>
            </Typography.Text>
          </Typography.Paragraph>

          <Typography.Paragraph>
            <Typography.Text>
              <Typography.Text code>Time: {data.time}</Typography.Text>
            </Typography.Text>
          </Typography.Paragraph>

         {data.option && data.option.length > 0 ?  
            <Typography.Paragraph>
              <Typography.Title level={3}>Poll Options</Typography.Title>
              <ul>
                {Option}
              </ul>
            </Typography.Paragraph> : null}

      </Typography>
  );
}

export default Analytics;
