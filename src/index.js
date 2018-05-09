import { defaultRules,defaultErrorTip,defaultNullTip } from './defaultOptions'
/***
 *
 * @param scheme 需要验证的计划
 * @param rules 自定义的验证规则
 * @param errorTip 自定义的错误提示
 * @param nullTip 自定义的为空提示
 * @returns {Function} 返回一个加工好的验证方法 接受values对象用之前配置的验证计划来验证
 */
function validate({scheme={},rules={},errorTip={},nullTip={}}){
  const _rules=Object.assign({},defaultRules,rules);
  const _errorTip=Object.assign({},defaultErrorTip,errorTip);
  const _nullTip=Object.assign({},defaultNullTip,nullTip);
  function check(rule,key,values,error){
    const ruleType = _rules[rule] || ((typeof rule === 'function')? rule:/[\s\S]+/);
    const _check = (ruleType.test && ruleType.test.bind(ruleType)) || ruleType;
    let flag = _check(values[key],values,key);
    if(flag === true) return true;
    //错误提示 可以是方法返回的字符串，初始化定义或默认
    error[key] = flag || _errorTip[key] || _errorTip[rule] || _errorTip.def;
    return false;
  }
  return function(values){
    let error = {};
    for(const key in scheme){
      if(values[key] === undefined && (typeof rules !=='function') && !(rules.indexOf('ignore')!== -1)){
        error[key] = _nullTip[key] || _nullTip.def ;
        continue
      }
      const rules =scheme[key];
      switch (Object.prototype.toString.call(rules)){
        case '[object String]':
        case '[object Function]':
          check(rules,key,values,error);
          break;
        case '[object Array]':
          rules.every((rule)=>check(rule,key,values,error));
          break;
        default:
          break;
      }
      let errorArry = Object.values(error);
      if(errorArry.length>0){
        error._error = errorArry[0];
      }
    }
    return  error;
  }
}
export default validate;
