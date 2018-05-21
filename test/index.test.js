import { expect } from 'chai';
import { defaultNullTip, defaultErrorTip } from '../src/options';
import validate from '../src';

let schema = {
  name: 'name',
  age: /^([1-9]+[0-9]?){1,2}$/,
  email: 'email',
  github: 'url',
  bio: [
    'ignore',
    ({ length }) => {
      if (length <= 0 || length > 10) {
        return false;
      }
      return true;
    },
  ],
};
let errorValues = {
  name: 'zh',
  age: 100,
  email: 'a@baskdjf',
  github: 'github/lulei90',
  bio: '这是一句将要超过10个长度的简介',
};
let errorTip = {
  name: '填正常的中文姓名才行啊',
  age: '这里支持的年龄必须在1-99之间哦',
  email: '伙计邮箱格式填的不正确啊',
  github: '很显然你的url格式错了',
  bio: '简短介绍下就算了，不要超过10个长度',
  _error: '填正常的中文姓名才行啊',
};
let nullTip = {
  name: '姓名不能空着不填啊',
  age: '年龄不能空着不填啊',
  email: '邮箱不能空着不填啊',
  github: 'github不能空着不填啊',
  _error: '姓名不能空着不填啊',
};
let values = {
  name: '卢云俊',
  age: 28,
  email: 'lulei90@qq.com',
  github: 'https://github.com/lulei90',
  bio: '武汉的一名前端开发',
};
describe('正确值测试', () => {
  const error = validate({ schema })(values);
  it('当值全都满足定义当规则时，应该返回的错误对象为空对象', () => {
    expect(error).to.eql({});
  });
});
describe('默认值提示验证测试', () => {
  const syncValidate = validate({ schema });
  it('默认空值提示测试', () => {
    const error = syncValidate({});
    for (const key in error) {
      expect(error[key]).to.equal(defaultNullTip.def);
    }
  });
  it('默认错误提示验证测试', () => {
    const error = syncValidate(errorValues);
    const errorLength = Object.keys(error).length;
    const schemaLength = Object.keys(schema).length;
    expect(errorLength).to.be.at.least(schemaLength);
    for (const key in error) {
      if (key === '_error') continue;
      if (typeof schema[key] === 'string') {
        expect(error[key]).to.equal(defaultErrorTip[schema[key]]);
      } else {
        expect(error[key]).to.equal(defaultErrorTip.def);
      }
    }
  });
});

describe('自定义提示测试', () => {
  const syncValidate = validate({
    schema,
    errorTip,
    nullTip,
  });
  it('自定义空值测试', () => {
    const error = syncValidate({});
    expect(error).to.eql(nullTip);
  });
  it('自定义错误提示测试', () => {
    const error = syncValidate(errorValues);
    expect(error).to.eql(errorTip);
  });
});

describe('覆盖默认规则测试', () => {
  const syncValidate = validate({
    schema: {
      name: 'name',
    },
    errorTip: {
      name: '只能填英文了哦',
    },
    rules: {
      name: /^[A-Za-z]+$/,
    },
  });
  it('默认规则失效', () => {
    const error = syncValidate({ name: '卢云俊' });
    expect(error.name).to.equal('只能填英文了哦');
  });
  it('新规则有效', () => {
    const error = syncValidate({ name: 'lulei' });
    expect(error).to.eql({});
  });
});

describe('函数返回值的提示', () => {
  const syncValidate = validate({
    schema: {
      money: value => {
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
    const error1 = syncValidate({
      money: 101,
    });
    expect(error1.money).to.equal('金额不能大于100');
    const error2 = syncValidate({
      money: -1,
    });
    expect(error2.money).to.equal('金额不能小于0');
  });
});
describe('当规则格式不正确，或是不存在于默认规则和自定义规则时，应当报错', () => {
  it('当规则格式有误时', () => {
    const syncValidate = validate({
      schema: {
        name: {
          key: 1,
        },
      },
    });
    const errorFn = syncValidate.bind(syncValidate, { name: '123123' });
    expect(errorFn).to.throw('规则不在默认和自定义的规则中');
  });
  it('当验证规则是字符串，并且不存在于默认规则和自定义规则', () => {
    const syncValidate = validate({
      schema: {
        name: 'null',
      },
    });
    const errorFn = syncValidate.bind(syncValidate, { name: '123123' });
    expect(errorFn).to.throw('规则不在默认和自定义的规则中');
  });
  it('当验证规则里面存在数组嵌套时', () => {
    const syncValidate = validate({
      schema: {
        name: [
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
    const error = syncValidate({ name: '一二三四五六七' });
    expect(error).to.eql({ name: '姓名有点长', _error: '姓名有点长' });
  });
  it('嵌套数组包含ignore时', () => {
    const syncValidate = validate({
      schema: {
        name: [
          [
            'ignore',
            'name',
            value => {
              return value.length > 0;
            },
          ],
          value => {
            return value.length <= 6;
          },
        ],
      },
    });
    const error = syncValidate({});
    expect(error).to.eql({});
  });
});
describe('当初始参数不对时', () => {
  it('当初始参数为空时，默认验证不包含任何信息', () => {
    const syncValidate = validate();
    const error = syncValidate(errorValues);
    expect(error).to.eql({});
  });
  it('当初始参数类型不是预定类型时，默认验证不包含任何信息', () => {
    const syncValidate = validate('123123');
    const error = syncValidate(errorValues);
    expect(error).to.eql({});
  });
  it('当初始参数内部字段不是预定类型时', () => {
    const syncValidate = validate({
      schema: 1234,
      nullTip: 'abcd',
      errorTip: () => {},
      rules: [],
    });
    const error = syncValidate(errorValues);
    expect(error).to.eql({});
  });
});
