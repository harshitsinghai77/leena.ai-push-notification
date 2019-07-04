import React from 'react';
import { Typography } from 'antd';

function Content(props) {
  const { data } = props;
  
  const Option = data.option.map((value, key) => (<li key = {key}> <a >{value}</a> </li>))

  return (
      <Typography>
          <Typography.Paragraph>
            <Typography.Title level={3}>Subject</Typography.Title>
            <Typography.Text strong> {data.subject} </Typography.Text>
            <Typography.Title level={3}>Message</Typography.Title>
            <Typography.Text strong> {data.completeMessage} </Typography.Text>
          </Typography.Paragraph>

          {data.url ? 
              <img src = {data.url} width = '350px' /> : null
          }
      </Typography>
  );
}

export default Content;
