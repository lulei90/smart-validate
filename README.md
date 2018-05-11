# redux-form-validating
[![Build Status](https://travis-ci.org/lulei90/redux-form-validating.svg?branch=master)](https://travis-ci.org/lulei90/redux-form-validating)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/lulei90/redux-form-validating/pulls)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lulei90/redux-form-validating/blob/master/LICENSE)
[![codebeat badge](https://codebeat.co/badges/16727cff-eabe-4eed-91e4-2bb8c1832a3b)](https://codebeat.co/projects/github-com-lulei90-redux-form-validating-master)


[![NPM](https://nodei.co/npm/redux-form-validating.png)](https://nodei.co/npm/redux-form-validating/)

**基于[redux-form](https://github.com/erikras/redux-form)的表单验证工具**

## 开始
```
npm install --save redux-form-validating
```

## 基本使用
```js
import React,{Component} from 'react';
import {reduxForm ,Field} from 'redux-form';
import validate from 'redux-form-validating';

const syncValidate = validate({
  schema:{
    userphone:'phone',
    userpwd:'required'
  },
  errorTip:{
    userphone:'手机号格式有误'
  }
  nullTip:{
    userphone:'手机号不能为空',
    userpwd:'密码不能为空',
  }
})
@reduxForm({
  form:'login',
  validate: syncValidate
 })
export default class Form extends Component{
  submitForm=(values)=>{
    const {error} = this.props;
    if(error){
       //... 错误处理
    }else{
      //... 提交
    }
  }
  render(){
    const {handleSubmit} = this.props;
    return(<form>
      <label>
        <span>用户名:</span>
        <Field component="input" type="tel" name="userphone" placeholder="请输入手机号" maxLength={11}/>
      </label>
      <label>
        <span>密码:</span>
        <Field component="input" type='password' name="userpwd" placeholder="请输入密码"/>
      </label>
      <button onClick={handleSubmit(this.submitForm)}>登录</button>
    </form>)
  }
}
```


