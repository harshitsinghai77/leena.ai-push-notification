import React from 'react';
import Content from './Content'
import PieChart from './PieChart'
import Analytics from './Analytics'
import {Card} from 'antd'

function CreateView(props) {
  const { data } = props;

  const DisplayPieChart = () => {
    if(data && data.isPoll) {
      return (
         <PieChart data = {data} />
      )
    }
    return null
  }
  
  return (
    <div>
      <Card>
         <Content data = {data} />
      </Card>
      <Card bodyStyle = {{display : 'flex', flexDirection: 'row'}}>
        <Analytics data = {data} />
        <DisplayPieChart />
      </Card>
    </div>
  );
}

export default CreateView;
