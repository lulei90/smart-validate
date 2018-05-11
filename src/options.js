const defaultRules={
  required: /\S+/,
  number:/^(-?\d+)(.\d+)?$/,
  email: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  url: /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
  name:/^[\u4E00-\u9FA5]+(·| |.)?[\u4e00-\u9fa5]+$/,
  phone: /^1[0-9]{10}$/,
  bank:/^[0-9]{16,19}$/,
  string: /^[\u4E00-\u9FA5\uf900-\ufa2d\w\s.]+$/,
  postcode: /^[0-9]{6}$/,
  ignore:()=>true,
  idcard:(value)=>{
    const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子;
    const ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值，10代表X;
    if (value.length === 18) {
      const a_idCard = value.split(""); // 得到身份证数组
      let sum = 0; // 声明加权求和变量
      if (a_idCard[17].toLowerCase() === 'x') {
        a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
      }
      for (let i = 0; i < 17; i++) {
        sum += Wi[i] * a_idCard[i]; // 加权求和
      }
      const valCodePosition = sum % 11; // 得到验证码所位置
      if (parseInt(a_idCard[17],10) === ValideCode[valCodePosition]) {
        return true;
      }
    }
    return false;
  }
};
const defaultErrorTip={
  required: "不能为空",
  number:'请输入正确的数字',
  email: "邮箱输入有误",
  url: "网址输入有误",
  name: "姓名格式为2-12位的汉字",
  phone: "手机号输入有误",
  bank: "银行卡号输入有误",
  string: "不能输入特殊字符",
  postcode: "请填写邮政编码",
  idcard:"身份证号输入有误",
  def:'请填写正确信息'
};
const defaultNullTip ={
  def:"数据不能为空",
};
export {defaultRules,defaultErrorTip,defaultNullTip}
