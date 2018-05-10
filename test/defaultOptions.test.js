import {expect} from 'chai';
import {defaultRules} from '../src/defaultOptions';
const {required,number,email,url,name,phone,bank,string,postcode,ignore,idcard} = defaultRules;

describe('required规则测试',()=>{
  it(`全由空字符组成的值，应该是无效的`,()=>{
    expect(required.test(' ')).to.be.false;
    expect(required.test('  ')).to.be.false;
    expect(required.test('\n')).to.be.false;
    expect(required.test('\t')).to.be.false;
  });
  it(`任何非空字符值，应该是有效的`,()=>{
    expect(required.test(' 1')).to.be.true;
    expect(required.test(' abc  ')).to.be.true;
    expect(required.test(' 张三 ')).to.be.true;
    expect(required.test('%')).to.be.true;
    expect(required.test('^')).to.be.true;
    expect(required.test('*')).to.be.true;
    expect(required.test('$')).to.be.true;
    expect(required.test(true)).to.be.true;
    expect(required.test(false)).to.be.true;
  })
});

describe('number规则测试',()=>{
  it('当值是数字时，应该是有效的',()=>{
    expect(number.test(1)).to.be.true;
    expect(number.test(0)).to.be.true;
    expect(number.test(-1)).to.be.true;
    expect(number.test(-12.34)).to.be.true;
    expect(number.test(12.3456)).to.be.true;
    expect(number.test('12.3456')).to.be.true;
  })
  it('当值不是数字时，应该是无效的',()=>{
    expect(number.test('abc')).to.be.false;
    expect(number.test('张三')).to.be.false;
    expect(number.test('&')).to.be.false;
    expect(number.test('11klj')).to.be.false;
  })
})

describe('email规则测试',()=>{
  it('当值是邮箱时，应该是有效的',()=>{
    expect(email.test('a@b.c')).to.be.true;
    expect(email.test('lulei90@qq.com')).to.be.true;
  })
  it('当值不是邮箱时，应该是无效的',()=>{
    expect(email.test('')).to.be.false;
    expect(email.test('abc')).to.be.false;
    expect(email.test('a@b')).to.be.false;
    expect(email.test('@b.c')).to.be.false;
  })
})

describe('url规则测试',()=>{
  it('当值是url时，应该是有效的',()=>{
    expect(url.test('https://www.github.com')).to.be.true;
    expect(url.test('https://github.com')).to.be.true;
    expect(url.test('github.com')).to.be.true;
    expect(url.test('htttp://github.com:8080/home#order?search=123')).to.be.true;
  })
  it('当值url时，应该是无效的',()=>{
    expect(url.test('')).to.be.false;
    expect(url.test('http:/:/')).to.be.false;
    expect(url.test('https:/github.com')).to.be.false;
    expect(url.test('ftp//ft.com')).to.be.false;
  })
})

describe('name规则测试',()=>{
  it('当值是中文姓名时，应该是有效的',()=>{
    expect(name.test('张三')).to.be.true;
    expect(name.test('爱新觉罗')).to.be.true;
    expect(name.test('爱新觉罗·玄烨')).to.be.true;
    expect(name.test('尼格买提.热合曼')).to.be.true;
    expect(name.test('迪丽热巴 迪力木拉提')).to.be.true;
  })
  it('当值不是中文姓名时，应该是无效的',()=>{
    expect(name.test('张')).to.be.false;
    expect(name.test('jack')).to.be.false;
    expect(name.test('张1234')).to.be.false;
    expect(name.test('·张山')).to.be.false;
    expect(name.test('李·123123四')).to.be.false;
  })
})

describe('phone规则测试',()=>{
  it('当值是手机号时，应该是有效的',()=>{
    expect(phone.test('12345678901')).to.be.true;
    expect(phone.test('13123132131')).to.be.true;
  })
  it('当值不是手机号时，应该是无效的',()=>{
    expect(phone.test('01231231231')).to.be.false;
    expect(phone.test('1381231231')).to.be.false;
    expect(phone.test('138123123111')).to.be.false;
  })
})

describe('bank规则测试',()=>{
  it('当值是银行卡号时，应该是有效的',()=>{
    expect(bank.test('6225365271562822')).to.be.true;
    expect(bank.test('1234567890123456789')).to.be.true;
  })
  it('当值不是银行卡号时，应该是无效的',()=>{
    expect(bank.test('622536527156282')).to.be.false;
    expect(bank.test('12313132123991238123123')).to.be.false;
  })
})

describe('string规则测试',()=>{
  it('当值是不带特殊字符的字符串时，应该是有效的',()=>{
    expect(string.test('zndqeirnmasnv')).to.be.true;
    expect(string.test('中文字符串测试')).to.be.true;
    expect(string.test('带点.')).to.be.true;
    expect(string.test('带空格 测试')).to.be.true;
  })
  it('当值是带特殊字符当字符串时，应该是无效当',()=>{
    expect(string.test('klsdfjkslam,kajsfdlajsdf')).to.be.false;
    expect(string.test('&中文')).to.be.false;
  })
})

describe('postcode规则测试',()=>{
  it('当值是邮政编码时，应该是有效的',()=>{
    expect(postcode.test('434400')).to.be.true;
    expect(postcode.test('100000')).to.be.true;
  })
  it('当值不是邮政编码时，应该是无效的',()=>{
    expect(postcode.test('4344000')).to.be.false;
  })
})
describe('ignore规则测试',()=>{
  it('无论值是什么，应该都有效',()=>{
    expect(ignore(true)).to.be.true
    expect(ignore(false)).to.be.true
    expect(ignore(undefined)).to.be.true
    expect(ignore(null)).to.be.true
    expect(ignore('')).to.be.true
    expect(ignore('abcd')).to.be.true
    expect(ignore(1231)).to.be.true
  })
})
describe('idcard规则测试',()=>{
  it('当值是身份证号时，因该是有效的',()=>{
    expect(idcard('141181198011175052')).to.be.true;
    expect(idcard('15020019840112606X')).to.be.true;
  })
  it('当值不是身份证号时，因该是无效的',()=>{
    expect(idcard('141181198011175051')).to.be.false;
    expect(idcard('15020019840112602X')).to.be.false;
    expect(idcard('42102288100622')).to.be.false;
    expect(idcard('15020019840112606X1')).to.be.false;
  })
})
;
