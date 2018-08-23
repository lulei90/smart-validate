# smart-validate

[![Build Status](https://travis-ci.org/lulei90/smart-validate.svg?branch=master)](https://travis-ci.org/lulei90/smart-validate)
[![Coverage Status](https://coveralls.io/repos/github/lulei90/smart-validate/badge.svg?branch=master)](https://coveralls.io/github/lulei90/smart-validate?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/lulei90/smart-validate/pulls)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lulei90/smart-validate/blob/master/LICENSE)
[![codebeat badge](https://codebeat.co/badges/16727cff-eabe-4eed-91e4-2bb8c1832a3b)](https://codebeat.co/projects/github-com-lulei90-smart-validate-master)

[![NPM](https://nodei.co/npm/smart-validate.png)](https://nodei.co/npm/smart-validate/)

**简单快捷的数据建模及数据验证工具，可以配合[redux-form](https://github.com/erikras/redux-form)、[formik](https://github.com/jaredpalmer/formik)等完成快速表单验证**

## 开始

```
npm install --save smart-validate
```

## 基础使用

```js
//配合redux-form
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import Validate from 'smart-validate';

const syncValidate = new Validate({
  userphone: {
    rule: 'phone',
    errorTip: '手机号格式有误',
    nullTip: '手机号不能为空',
  },
  userpwd: {
    nullTip: '密码不能为空',
  },
}).validator;
@reduxForm({
  form: 'login',
  validate: syncValidate,
})
export default class Form extends Component {
  submitForm = values => {
    const { valid } = this.props;
    if (valid) {
      //... 提交
    } else {
      //... 错误处理
    }
  };
  render() {
    const { handleSubmit } = this.props;
    return (
      <form>
        <label>
          <span>用户名:</span>
          <Field
            component="input"
            type="tel"
            name="userphone"
            placeholder="请输入手机号"
            maxLength={11}
          />
        </label>
        <label>
          <span>密码:</span>
          <Field component="input" type="password" name="userpwd" placeholder="请输入密码" />
        </label>
        <button onClick={handleSubmit(this.submitForm)}>登录</button>
      </form>
    );
  }
}
```

## API

### `const syncValidate = new Validate (scheme)`

接收验证计划并创建验证，返回验证对象

_`scheme`_ <a name="scheme"></a> 为一个`key:value`组合的对象，`key`为需要验证的字段名，`value`包含以下 4 种属性:

- `rule`: 字段值的[验证规则](#rule)
- `errorTip`: 自定义的错误提示 默认值为 `请填写正确信息`
- `nullTip`: 自定义的为空提示 默认值为 `数据不能为空`
- `required`: 是否为必填项 默认值为 `true` 当`required`为`false`时，验证方法将会在此项字段的值不为空的情况下才会去验证，为空将会忽略验证

**示例：**

```js
const { validator } = new Validate({
  username:{
    rule:'email',
    errorTip:'用户名格式必须为邮箱',
    nullTip:'请输入用户名'
  }
  password:{
    nullTip:'请输入密码'
  }
});
const error = validator({
  name: 'a@baskdjf',
});
console.log(error);

// 返回结果如下
// { username: '用户名格式必须为邮箱',password: '请输入密码'}
```

> 更多示例请参考:[test/index.test.js](https://github.com/lulei90/smart-validate/blob/master/test/index.test.js)

#### `rule` <a name="rule"></a>

`rule` 为对应字段需要验证的规则，可以包含以下几种类型：

| 类型     | 描述                                                                                                                                                                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| String   | String 值为默认规则集或是在 rules 里面传入的自定义规则集的 key 值（参照 [默认规则](#rules)）                                                                                                                                                                                          |
| RegExp   | 将会根据传入的正则表达式去验证对应的字段值                                                                                                                                                                                                                                            |
| Function | 自定义的方法将被传入 3 个参数:`(value,values,key)`，`value`为当前验证的字段值，`values`为所有字段的键值对，`key`为当前验证字段的 key 值。会根据验证方法的返回值去判断此验证是否通过，当返回值仅为`true`时，验证通过，其它类型，验证失败。当返回值的类型为`string`时将被用作为错误提示 |
| Array    | 接收一组验证规则，数组中的每一项可以是以上 3 种类型之一。内部验证方法将会依次调用数组当中每一项的验证规则，当且仅当前一项验证规则通过时，才会去验证后续规则。                                                                                                                         |

> 只要是在*scheme*定义过的字段，默认内部验证方法都会去验证字段的值是否`=== undefined`,当且仅当字段的值不等于`undefined`时，内部验证方法才会去验证对应在*scheme*中定义的规则。

**示例:**

```js
const syncValidate = new Validate({
  username:{
    rule:'email',
    errorTip:'用户名格式必须为邮箱',
    nullTip:'请输入用户名'
  },
  age:{
    rule:/^([1-9]+[0-9]?){1,2}$/,
    errorTip:'年龄有误',
    required:false
  }
  password:{
    rule:({ length }) => {
      if (length >= 6 && length <= 20) {
        return true;
      }
      return '密码长度必须大于等于6，小于等于20';
    },
    nullTip:'请输入密码'
  },
  repassword:{
    rule:(value, values) => {
      if (value === values['password']) {
        return true;
      }
      return '两次密码不一致';
    },
    nullTip:'请输入确认密码'
  },
  bio:{
    rule:['string',({ length }) => {
      if (length <= 20) {
        return true;
      }
      return false;
    }],
    errorTip:'请输入20个字符以内的字符串',
    required:false,
  }
  //...
});
```

### 默认配置

为了方便快速创建验证，默认内置了部分验证规则、错误提示和为空提示。详见[options.js](https://github.com/lulei90/smart-validate/blob/master/src/options.js)

> 默认配置可以通过在初始化验证规则[validate(options)](#options)中的`rules`、`errorTip`、`nullTip`参数给覆盖

**<a name="rules"></a>默认规则包含如下:**

| 规则     | 说明                                                                         |
| -------- | ---------------------------------------------------------------------------- |
| number   | 数字类型包含正数、负数、整数、小数                                           |
| email    | 电子邮箱格式                                                                 |
| url      | 验证值是否为网址                                                             |
| name     | 中文姓名格式，包含少数名族姓名中间的 **`·`**                                 |
| phone    | 为**1**开头的手机号（注：号段变化太快这里仅校验是否为 1 开头的 11 位手机号） |
| bank     | 验证是否为银行卡号（注：仅校验位数）                                         |
| string   | 不包含特殊字符                                                               |
| postcode | 邮箱格式                                                                     |
| idcard   | 身份证号                                                                     |
