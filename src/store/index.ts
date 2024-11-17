
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { 
      count: 0,
      userId:'',// 患者id
      userName:'',//患者名字
      userBirthTimeAndAge:'',//患者出生日期和性别
      institutionName:'',//机构名称
      description:'',//研究描述
      studyNumber:'',//研究编号
      SeriesDescription:'',//系列说明
      acquisitionTime:'',//采集日期时间
    }
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
  },
})