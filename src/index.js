import { defaultRules, defaultErrorTip, defaultNullTip } from './options';
/***
 *
 * @param schema 需要验证的模型
 * @param rules 自定义的验证规则
 * @param errorTip 自定义的错误提示
 * @param nullTip 自定义的为空提示
 * @returns {Function} 返回一个加工好的验证方法 接受values对象用之前配置的验证计划来验证
 */
function validate(options = {}) {
  const { schema = {}, rules = {}, errorTip = {}, nullTip = {} } = options;
  const _rules = Object.assign({}, defaultRules, rules);
  const _errorTip = Object.assign({}, defaultErrorTip, errorTip);
  const _nullTip = Object.assign({}, defaultNullTip, nullTip);
  function check(rule, key, values, error) {
    const type = Object.prototype.toString.call(rule);
    if (type === '[object Array]') {
      return rule.every(item => check(item, key, values, error));
    }
    const ruleType = _rules[rule] || rule;
    const _check = (ruleType.test && ruleType.test.bind(ruleType)) || ruleType;
    if (typeof _check !== 'function') {
      throw new TypeError(`${_check}规则不在默认和自定义的规则中`);
    }
    const flag = _check(values[key], values, key);
    if (flag === true) return true;
    //错误提示 可以是方法返回的字符串，初始化定义或默认
    if (typeof flag === 'string') {
      error[key] = flag;
    } else {
      error[key] = _errorTip[key] || _errorTip[rule] || _errorTip.def;
    }
    return false;
  }
  return function(values) {
    const error = {};
    for (const key in schema) {
      const rules = schema[key];
      if (values[key] !== undefined) {
        check(rules, key, values, error);
      } else if (rules.toString().indexOf('ignore') === -1) {
        //当验证规则里面不包含ignore时，取为空提示
        error[key] = _nullTip[key] || _nullTip.def;
      }
    }
    const errorArry = Object.values(error);
    //当存在错误提示时，把第一条提示赋值给_error属性（这里便于从redux-form装饰当组件props中取出）
    if (errorArry.length > 0) {
      [error._error] = errorArry;
    }
    return error;
  };
}
export default validate;
