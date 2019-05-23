import React, { Component } from 'react';
import {Query, Builder, Utils as QbUtils} from 'react-awesome-query-builder';
import config from './config'; //see below 'Config format'

import 'react-awesome-query-builder/css/styles.scss';
import 'react-awesome-query-builder/css/compact_styles.scss';
import 'react-awesome-query-builder/css/denormalize.scss';
const { mongodbFormat} = QbUtils;
const transit = require('transit-immutable-js');
var stringify = require('json-stringify-safe');

class QueryBuilder extends Component {

    getChildren(props) {
        return (
            <div>
                <div className="query-builder">
                    <Builder {...props} />
                </div>
                <div>Mongodb query: {stringify(mongodbFormat(props.tree, props.config), undefined, 2)}</div>
            </div>
        )
    }

    onChange(tree) {
    //here you can save tree object: 
        var treeJSON = transit.toJSON(tree)
    }

    render(){
        return (
            <div>
                <Query 
                  {...config} 
                  //you can pass object here, see treeJSON at onChange
                  get_children={this.getChildren}
                  onChange={this.onChange}
                ></Query>
            </div>
        );
    }
}

export default QueryBuilder;