import { Upload, Button, Icon } from 'antd';
import { ParamsContext } from '../../../Context';
import '../../../project-bootstap';
import { getToken } from '../../../libs/storage/tokenStorage';
import React from 'react'

function UploadFile(props, ref) {

    const { botId } = React.useContext(ParamsContext) || {};
    const [file, setFile] = React.useState([])
    const {value} = props

    React.useEffect(() => {
        if(!value) return setFile([])
    }, [value])

    const handleChange = ({file, fileList}) => {
        if(file.status === 'done' && file.response && file.response.fileUrl){
            props.onChange(file.response.fileUrl)
            return
        }
        props.onChange(undefined)
        setFile(fileList)
    }

    const config = {
        name: 'upload',
        action: `${process.env.REACT_APP_BASE_URL}api/bots/${botId}/uploads`,
        headers: {
            authorization: getToken(),
        },
        listType: 'picture',
    };

    const UploadButton = () => (
        <Button>
            <Icon type="upload" /> Upload
        </Button>
    )

    return(
        <Upload ref={ref} {...config} onChange={handleChange} fileList={file}  >
            {value ? null : <UploadButton />  }
        </Upload>
    )
}

export default React.forwardRef(UploadFile);