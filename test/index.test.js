import { expect } from 'chai';
import Validate from '../src';

const scheme = {
  name: {
    rule: 'name',
    errorTip: '姓名格式有误',
    nullTip: '请输入姓名',
  },
  age: {
    rule: /^([1-9]+[0-9]?){1,2}$/,
    errorTip: '年龄格式有误',
    nullTip: '请输入年龄',
  },
  email: {
    rule: 'email',
    errorTip: '邮箱格式有误',
    nullTip: '请输入邮箱',
  },
  bio: {
    rule: ({ length }) => {
      return length >= 0 && length <= 10;
    },
    required: false,
    errorTip: '请输入0到10个长度内到简介',
  },
};
const values = {
  name: '卢云俊',
  age: 28,
  email: 'lulei90@qq.com',
  github: 'https://github.com/lulei90',
  bio: '武汉的一名前端开发',
};
const errorValues = {
  name: 'zh',
  age: 100,
  email: 'a@baskdjf',
  github: 'github/lulei90',
  bio: '这是一句将要超过10个长度的简介',
};
describe('正确值测试', () => {
  const syncValidate = new Validate(scheme);
  it('当值全都满足定义当规则时，应该返回的错误对象为空对象', () => {
    expect(syncValidate.pristine).to.equal(true);
    syncValidate.validator(values);
    expect(syncValidate.error).to.eql({});
    expect(syncValidate.tip).to.equal('');
    expect(syncValidate.valid).to.equal(true);
    expect(syncValidate.pristine).to.equal(false);
  });
});
describe('默认值提示验证测试', () => {
  const syncValidate = new Validate({
    name: {
      rule: 'name',
    },
    age: {
      rule: /^([1-9]+[0-9]?){1,2}$/,
    },
    email: {
      rule: 'email',
    },
    bio: {
      rule: ({ length }) => {
        return length >= 0 && length <= 10;
      },
    },
  });
  it('默认空值提示测试', () => {
    syncValidate.validator({});
    expect(syncValidate.valid).to.equal(false);
    expect(syncValidate.tip).to.equal('数据不能为空');
    for (const key in syncValidate.error) {
      expect(syncValidate.error[key]).to.equal('数据不能为空');
    }
  });
  it('默认错误提示验证测试', () => {
    syncValidate.validator(errorValues);
    const errorLength = Object.keys(syncValidate.error).length;
    const schemeLength = Object.keys(syncValidate.scheme).length;
    expect(errorLength).to.equal(schemeLength);
    for (const key in syncValidate.error) {
      expect(syncValidate.error[key]).to.equal('请填写正确信息');
    }
  });
});
describe('自定义提示测试', () => {
  const syncValidate = new Validate(scheme);
  it('自定义空值测试', () => {
    syncValidate.validator({});
    Object.keys(syncValidate.error).forEach(key => {
      expect(syncValidate.error[key]).to.eql(syncValidate.scheme[key].nullTip);
    });
  });
  it('自定义错误提示测试', () => {
    syncValidate.validator(errorValues);
    Object.keys(syncValidate.error).forEach(key => {
      expect(syncValidate.error[key]).to.eql(syncValidate.scheme[key].errorTip);
    });
  });
});
describe('函数返回值的提示', () => {
  const syncValidate = new Validate({
    money: {
      rule: value => {
        if (value > 100) {
          return '金额不能大于100';
        }
        if (value < 0) {
          return '金额不能小于0';
        }
        return true;
      },
    },
  });
  it('当验证规则是函数时，如果验证失败并且函数返回值不等于false时提示信息为函数的返回值', () => {
    const error1 = syncValidate.validator({
      money: 101,
    });
    expect(error1.money).to.equal('金额不能大于100');
    expect(syncValidate.tip).to.equal('金额不能大于100');
    const error2 = syncValidate.validator({
      money: -1,
    });
    expect(error2.money).to.equal('金额不能小于0');
    expect(syncValidate.tip).to.equal('金额不能小于0');
  });
});
describe('当规则格式不正确，或是不存在于默认规则和自定义规则时，应当报错', () => {
  const errorTip = 'not in default rules and custom rules';
  it('当规则格式有误时', () => {
    const syncValidate = new Validate({
      name: {
        rule: {
          key: 1,
        },
      },
    }).validator;
    const errorFn = syncValidate.bind(syncValidate, { name: '123123' });
    expect(errorFn).to.throw(errorTip);
  });
  it('当验证规则是字符串，并且不存在于默认规则和自定义规则', () => {
    const syncValidate = new Validate({
      name: {
        rule: 'null',
      },
    }).validator;
    const errorFn = syncValidate.bind(syncValidate, { name: '123123' });
    expect(errorFn).to.throw(errorTip);
  });
  it('当验证规则里面存在数组嵌套时', () => {
    const syncValidate = new Validate({
      name: {
        rule: [
          [
            'name',
            value => {
              return value.length > 0;
            },
          ],
          value => {
            return value.length <= 6 || '姓名有点长';
          },
        ],
      },
    });
    syncValidate.validator({ name: '一二三四五六七' });
    expect(syncValidate.error).to.eql({ name: '姓名有点长' });
  });
});
describe('当初始scheme参数为空时', () => {
  it('当初始参数为空时，后续添加scheme', () => {
    const syncValidate = new Validate();
    syncValidate.validator({});
    expect(syncValidate.scheme).to.eql({});
    syncValidate.scheme = scheme;
    syncValidate.validator(errorValues);
    for (const key in syncValidate.error) {
      expect(syncValidate.error[key]).to.equal(syncValidate.scheme[key].errorTip);
    }
  });
});
describe('当初始参数不对时', () => {
  it('当初始参数为空时，默认验证不包含任何信息', () => {
    const syncValidate = new Validate();
    syncValidate.validator(errorValues);
    expect(syncValidate.error).to.eql({});
  });
  it('当初始参数类型不包含rule', () => {
    const syncValidate = new Validate('123123');
    syncValidate.validator(errorValues);
    Object.keys(syncValidate.error).forEach(key => {
      expect(syncValidate.error[key]).to.eql('数据不能为空');
    });
  });
  it('当初始参数类型不包含rule,并且required不为false', () => {
    const syncValidate = new Validate({
      test: {
        nullTip: '空提示',
      },
    });
    syncValidate.validator({});
    expect(syncValidate.error).to.eql({
      test: '空提示',
    });
  });
  it('当初始参数不包含rule，并且required为false', () => {
    const syncValidate = new Validate({
      test: {
        required: false,
      },
    }).validator;
    const error = syncValidate({});
    expect(error).to.eql({});
  });
});
describe('添加默认规则测试', () => {
  Validate.addRule({
    englishName: /^[A-Za-z]+$/,
  });
  const syncValidate = new Validate({
    name: {
      rule: 'englishName',
      errorTip: '填写英文哦',
    },
  });
  it('默认规则失效', () => {
    syncValidate.validator({ name: '卢云俊' });
    expect(syncValidate.error.name).to.equal('填写英文哦');
  });
  it('新规则有效', () => {
    syncValidate.validator({ name: 'lulei' });
    expect(syncValidate.error).to.eql({});
  });
});
