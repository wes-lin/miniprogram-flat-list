Component({
  relations: {
    '../flat-list': {
      type: 'parent', // 关联的目标节点应为子节点
      linked() {}
    }
  },
  /**
  * 组件的属性列表
  */
  properties: {
    item: {
      type: Object,
      value: null,
      public: true
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  }
})
