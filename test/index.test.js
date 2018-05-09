import {expect} from 'chai';
import validate from '../src/index.js'

const synValidate = validate({
  scheme:{
    name:'name',
    email:'email',
    github:'url'
  }
})
describe('验证测试',()=>{
})
