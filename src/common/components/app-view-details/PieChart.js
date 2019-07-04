import React from 'react'
import ReactEcharts from 'echarts-for-react';
import { ParamsContext } from '../../../Context';

function PieChart(props) {
    const {data} = props
    const { botId } = React.useContext(ParamsContext) || {};
    const [option, setOption] = React.useState([])

    React.useEffect(() => {
        window.axiosInstance.get(`api/bots/${botId}/notifications/${data.id}/poll`)
            .then(res =>{
                setOption(res.data.poll.options)
            })
    }, [])

    const GetData = () => {
        const data = []
        for (const key of Object.keys(option)) {
            data.push({
                name: key,
                value: option[key]
            })
        }
        return data
    }

    const config = {
        backgroundColor: '#2c343c',
    
        title: {
            text: 'Response Pie Chart',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },
    
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
    
        visualMap: {
            show: false,
        },

        series : [
            {
                name:'Option',
                type:'pie',
                radius : '55%',
                center: ['50%', '50%'],
                data: GetData()
                        .sort(function (a, b) { return a.value - b.value; }),
                roseType: 'radius',
                label: {
                    normal: {
                        textStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#c23531',
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
    
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };

    return(
        <ReactEcharts style = {{width: '70%'}} option={config} />
    )

}

export default PieChart;