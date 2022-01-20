const systemInfo = wx.getSystemInfoSync()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  relations: {
    '../flat-list-item': {
      type: 'child', // 关联的目标节点应为子节点
      linked() {

      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: Number,
      value: systemInfo.windowHeight,
      public: true
    },
    width: {
      type: Number,
      value: systemInfo.windowWidth,
      public: true
    },
    useAfterSlot: {
      type: Boolean,
      value: false,
      public: true
    },
    useBeforeSlot: {
      type: Boolean,
      value: false,
      public: true
    },
    refresherEnabled: {
      type: Boolean,
      value: false,
      public: true
    },
    refresherTriggered: {
      type: Boolean,
      value: false,
      public: true
    },
    refresherThreshold: {
      type: Number,
      value: 45,
      public: true
    },
    refresherDefaultStyle: {
      type: String,
      value: 'black',
      public: true
    },
    refresherBackground: {
      type: String,
      value: '#FFF',
      public: true
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
  },
  lifetimes: {
    detached() {
      this.page = null
      if (this.context) {
        this.context.destroy()
        this.context = null
      }
    }
  },
  methods: {
    setPage(page) {
      this.page = page
    },
    setContext(context) {
      this.context = context
    },
    lower(e) {
      this.triggerEvent('scrolltolower', e)
    },
    scroll(e) {
      if (this.page && this.page._scroll) {
        this.page._scroll(e)
      }
      this.triggerEvent('scroll', e)
    },
    upper(e) {
      this.triggerEvent('scrolltoupper', e)
    },
    refresherrefresh(e) {
      this.triggerEvent('refresherrefresh', e)
    }
  }
})
