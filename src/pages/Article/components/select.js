import React, { Component } from 'react';
import {
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Card,
    InputNumber,
    Radio,
    Icon,
    Tooltip,
    Upload,
  } from 'antd';
import axios from 'axios';
import {ROOT_PATH} from '../../pathrouter'
const Option = Select.Option;


var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
export default class CateSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
        categoryOptionList:[]
    }
  }


    handleChange = value => {
    console.log(`selected ${value}`);
    }

    handleBlur = e => {
        console.log('blur');
    }

    handleFocus = e => {
    console.log('focus');
    }

  componentDidMount() {


    axios(
        {
          url: ROOT_PATH + '/api/backend/v1/article/categories',
          method: 'get',
          params: { },
        },
        {}
      ).then(result => {
        if (result.data.error == 0) {
          this.setState({
            categoryOptionList: result.data.data.categories,
          });

        }
      });
   
  }
  render() {
    return (
            <Select
            placeholder='请选择'
            showSearch
            // style={{ width: 200 }}
            optionFilterProp="children"
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
            {
                this.state.categoryOptionList.map((item,i)=>{
                    return (<option key={item.category_id} value={item.category_id}>{item.name}</option>)
                })
            }
            </Select>

    )
  }
}
