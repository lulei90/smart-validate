import { expect } from 'chai';
import Validate from '../src';

const { number, email, url, name, phone, bank, string, postcode, password, idcard } = Validate.ruleType;

describe('number规则测试', () => {
  it('当值是数字时，应该是有效的', () => {
    expect(1).to.match(number);
    expect(0).to.match(number);
    expect(-1).to.match(number);
    expect(-12.34).to.match(number);
    expect(12.3456).to.match(number);
    expect('12.3456').to.match(number);
  });
  it('当值不是数字时，应该是无效的', () => {
    expect('abc').to.not.match(number);
    expect('张三').to.not.match(number);
    expect('&').to.not.match(number);
    expect('11klj').to.not.match(number);
  });
});

describe('email规则测试', () => {
  it('当值是邮箱时，应该是有效的', () => {
    expect('a@b.c').to.match(email);
    expect('lulei90@qq.com').to.match(email);
  });
  it('当值不是邮箱时，应该是无效的', () => {
    expect('').to.not.match(email);
    expect('abc').to.not.match(email);
    expect('a@b').to.not.match(email);
    expect('@b.c').to.not.match(email);
  });
});

describe('url规则测试', () => {
  it('当值是url时，应该是有效的', () => {
    expect('https://www.github.com').to.match(url);
    expect('https://github.com').to.match(url);
    expect('github.com').to.match(url);
    expect('htttp://github.com:8080/home#order?search=123').to.match(url);
  });
  it('当值url时，应该是无效的', () => {
    expect('').to.not.match(url);
    expect('http:/:/').to.not.match(url);
    expect('https:/github.com').to.not.match(url);
    expect('ftp//ft.com').to.not.match(url);
  });
});

describe('name规则测试', () => {
  it('当值是中文姓名时，应该是有效的', () => {
    expect('张三').to.match(name);
    expect('爱新觉罗').to.match(name);
    expect('爱新觉罗·玄烨').to.match(name);
    expect('尼格买提.热合曼').to.match(name);
    expect('迪丽热巴 迪力木拉提').to.match(name);
  });
  it('当值不是中文姓名时，应该是无效的', () => {
    expect('张').to.not.match(name);
    expect('jack').to.not.match(name);
    expect('张1234').to.not.match(name);
    expect('·张山').to.not.match(name);
    expect('李·123123四').to.not.match(name);
  });
});

describe('phone规则测试', () => {
  it('当值是手机号时，应该是有效的', () => {
    expect('12345678901').to.match(phone);
    expect('13123132131').to.match(phone);
  });
  it('当值不是手机号时，应该是无效的', () => {
    expect('01231231231').to.not.match(phone);
    expect('1381231231').to.not.match(phone);
    expect('138123123111').to.not.match(phone);
  });
});

describe('bank规则测试', () => {
  it('当值是银行卡号时，应该是有效的', () => {
    expect('6225365271562822').to.match(bank);
    expect('1234567890123456789').to.match(bank);
  });
  it('当值不是银行卡号时，应该是无效的', () => {
    expect('622536527156282').to.not.match(bank);
    expect('12313132123991238123123').to.not.match(bank);
  });
});

describe('string规则测试', () => {
  it('当值是不带特殊字符的字符串时，应该是有效的', () => {
    expect('zndqeirnmasnv').to.match(string);
    expect('中文字符串测试').to.match(string);
    expect('12312asdf').to.match(string);
    expect('带点.').to.match(string);
    expect('带空格 测试').to.match(string);
  });
  it('当值是带特殊字符当字符串时，应该是无效当', () => {
    expect('klsdfjkslam,kajsfdlajsdf').to.not.match(string);
    expect('&中文').to.not.match(string);
  });
});

describe('postcode规则测试', () => {
  it('当值是邮政编码时，应该是有效的', () => {
    expect('434400').to.match(postcode);
    expect('100000').to.match(postcode);
  });
  it('当值不是邮政编码时，应该是无效的', () => {
    expect('4344000').to.not.match(postcode);
  });
});
describe('password规则测试', () => {
  it('密码长度6-12位，由数字、小写字符和大写字母组成，但必须至少包括2种字符', () => {
    expect('ABCDEF234').to.match(password);
    expect('abcdEF234').to.match(password);
  });
  it('当密码为纯数字，纯小写字母，纯大写字母时无效', () => {
    expect('1234567').to.not.match(password);
    expect('abcdef').to.not.match(password);
    expect('ABCDEFGH').to.not.match(password);
  });
});
describe('idcard规则测试', () => {
  it('当值是身份证号时，因该是有效的', () => {
    expect(idcard('141181198011175052')).to.equal(true);
    expect(idcard('15020019840112606X')).to.equal(true);
  });
  it('当值不是身份证号时，因该是无效的', () => {
    expect(idcard('141181198011175051')).to.equal(false);
    expect(idcard('15020019840112602X')).to.equal(false);
    expect(idcard('42102288100622')).to.equal(false);
    expect(idcard('15020019840112606X1')).to.equal(false);
    expect(idcard('4306261985 9025247')).to.equal(false);
  });
});
