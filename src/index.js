/**
 * @author luyunjun <lulei90@qq.com>
 * @class
 */
class Validate {
  /**
   * @constructor
   * @param {Object} scheme - 验证计划
   * @param {String|Function|Array} scheme[].rule - 验证规则
   * @param {Boolean} scheme[].required=true - 是否为必填项，默认为true
   * @param {String} scheme[].nullTip=数据不能为空 - 当验证为空时的为空提示语
   * @param {String} scheme[].errorTip=请填写正确信息 - 当验证不通过时的错误提示语
   */
  constructor(scheme = {}) {
    this.scheme = scheme;
  }
  check(rule, key, values) {
    const type = Object.prototype.toString.call(rule);
    if (type === '[object Array]') {
      return rule.every(item => this.check(item, key, values));
    }
    const ruleType = Validate.ruleType[rule] || rule;
    const _check = (ruleType.test && ruleType.test.bind(ruleType)) || ruleType;
    if (typeof _check !== 'function') {
      throw new TypeError(`${_check} not in default rules and custom rules`);
    }
    const flag = _check(values[key], values, key);
    //错误提示 可以是方法返回的字符串，初始化定义或默认
    if (typeof flag === 'string') {
      this.error[key] = flag;
    } else if (!flag) {
      this.error[key] = this.scheme[key].errorTip || '请填写正确信息';
    }
    return flag === true;
  }

  /**
   * @param values - 需要进行验证的字段值，将更具之前定义的验证计划匹配去进行对应验证
   * @returns {Object} error - 返回根据验证计划验证不通过的对应字段的提示信息
   */
  validator = values => {
    const { scheme } = this;
    this.error = {};
    Object.keys(scheme).forEach(key => {
      const { rule, nullTip, required = true } = scheme[key];
      //当值非空时去验证值是否满足规则，否则如果required为true则进行非空提示
      if (values[key] !== void 0) {
        rule !== void 0 && this.check(rule, key, values);
      } else {
        required && (this.error[key] = nullTip || '数据不能为空');
      }
    });
    return this.error;
  };
}

Validate.ruleType = {
  number: /^(-?\d+)(.\d+)?$/,
  email: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  url: /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
  name: /^[\u4E00-\u9FA5]+(·| |.)?[\u4e00-\u9fa5]+$/,
  phone: /^1[0-9]{10}$/,
  bank: /^[0-9]{16,19}$/,
  string: /^[\u4E00-\u9FA5\uf900-\ufa2d\w\s.]+$/,
  postcode: /^[0-9]{6}$/,
  idcard: value => {
    const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子;
    const ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值，10代表X;
    if (value.length === 18) {
      const a_idCard = value.split(''); // 得到身份证数组
      let sum = 0; // 声明加权求和变量
      if (a_idCard[17].toLowerCase() === 'x') {
        a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
      }
      for (let i = 0; i < 17; i++) {
        sum += Wi[i] * a_idCard[i]; // 加权求和
      }
      const valCodePosition = sum % 11; // 得到验证码所位置
      if (parseInt(a_idCard[17], 10) === ValideCode[valCodePosition]) {
        return true;
      }
    }
    return false;
  },
};

Validate.addRule = function(rule) {
  Validate.ruleType = { ...rule, ...Validate.ruleType };
};

export default Validate;
