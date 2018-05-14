# redux-form-validating
[![Build Status](https://travis-ci.org/lulei90/redux-form-validating.svg?branch=master)](https://travis-ci.org/lulei90/redux-form-validating)
[![Coverage Status](https://coveralls.io/repos/github/lulei90/redux-form-validating/badge.svg?branch=master)](https://coveralls.io/github/lulei90/redux-form-validating?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/lulei90/redux-form-validating/pulls)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lulei90/redux-form-validating/blob/master/LICENSE)
[![codebeat badge](https://codebeat.co/badges/16727cff-eabe-4eed-91e4-2bb8c1832a3b)](https://codebeat.co/projects/github-com-lulei90-redux-form-validating-master)


[![NPM](https://nodei.co/npm/redux-form-validating.png)](https://nodei.co/npm/redux-form-validating/)

**基于[redux-form](https://github.com/erikras/redux-form)的数据建模及数据验证工具**

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
  },
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
## API
### `const syncValidate = validate (options)`

创建验证，返回同步验证方法，返回的方法接收一个对象，对象包含需要验证的字段名和对应的值

*`options`* <a name="options"></a> 包含以下4种属性:

* `schema`: 需要验证的模型 默认值为 `{}`
* `rules`: 自定义的验证规则 默认值为 `{}`
* `errorTip`: 自定义的错误提示 默认值为 `{}`
* `nullTip`: 自定义的为空提示 默认值为 `{}`

**示例：**

```js
const syncValidate = validate({
  schema:{
    username:'email',
    password:'required'
  },
  errorTip:{
    username:'用户名格式必须为邮箱'
  },
  nullTip:{
    username:'请输入用户名',
    password:'请输入密码'
  }
})
const error = syncValidate({
  name:'a@baskdjf',
})
console.log(error);

// 返回结果如下
// { username: '用户名格式必须为邮箱',password: '请输入密码',_error: '用户名格式必须为邮箱' }
// 其中 _error 始终返回第一个错误，将被传递到redux-form装饰的组件上的props.error上
```

> 更多示例请参考:[test/index.test.js](https://github.com/lulei90/redux-form-validating/blob/master/test/index.test.js)

#### `schema`

schema 接收一个对应于表单验证字段的键值对`{key:value}`

* `key`为需要验证的字段名
* `value`为对应字段需要验证的规则，可以包含以下几种类型：


类型      | 描述
-------- | --------
String   | String值为默认规则集或是在rules里面传入的自定义规则集的key值（参照*[默认规则](#rules)*）
RegExp   | 将会根据传入的正则表达式去验证对应的字段值
Function | 自定义的方法将被传入3个参数:`(value,values,key)`，`value`为当前验证的字段值，`values`为所有字段的键值对，`key`为当前验证字段的key值。会根据验证方法的返回值去判断此验证是否通过，当返回值仅为`true`时，验证通过，其它类型，验证失败。当返回值的类型为`string`时将被用作为错误提示
Array    | 接收一组验证规则，数组中的每一项可以是以上3种类型之一。内部验证方法将会依次调用数组当中每一项的验证规则，当且仅当前一项验证规则通过时，才会去验证后续规则。当验证项中包含**'ignore'**时，内部验证方法将会在此项的值不为空的情况下才会去验证，为空将会忽略验证

> 只要是在*schema*定义过的字段，默认内部验证方法都会去验证字段的值是否`=== undefined`,当且仅当字段的值不等于`undefined`时，内部验证方法才会去验证对应在*schema*中定义的规则。如果想先跳过`=== undefined`验证，请在定义的验证规则中包含`'ignore'`

**示例:**

```js
const syncValidate = validate({
  schema:{
    username：'email',
    age: /^([1-9]+[0-9]?){1,2}$/,
    password:({length})=>{
     if(length>=6 && length<=20){
       return true;
     }
     return '密码长度必须大于等于6，小于等于20';
    },
    repassword:(value,values)=>{
    	if(value === values['password']){
    	  return true;
    	}
    	return '两次密码不一致';
    },
    bio:['ignore',({length})=>{
      if(length<=20){
        return true;
      }
      return false;
    }]
  }
  //...
})
```

### 默认配置
为了方便快速创建验证，默认内置了部分验证规则、错误提示和为空提示。详见[options.js](https://github.com/lulei90/redux-form-validating/blob/master/src/options.js)
> 默认配置可以通过在初始化验证规则[validate(options)](#options)中的`rules`、`errorTip`、`nullTip`参数给覆盖 

**<a name="rules"></a>默认规则包含如下:**  

规则      | 说明
-------- | --------
required | 不能为空并且不能全由空字符组成
number   | 数字类型包含正数、负数、整数、小数
email    | 电子邮箱格式
url      | 验证值是否为网址
name     | 中文姓名格式，包含少数名族姓名中间的 **`·`**
phone    | 为**1**开头的手机号（注：号段变化太快这里仅校验是否为1开头的11位手机号）
bank     | 验证是否为银行卡号（注：仅校验位数）
string   | 不包含特殊字符
postcode | 邮箱格式
ignore   | 忽略改项字段的为空验证
idcard   | 身份证号
