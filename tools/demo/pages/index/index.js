const createFlatListContext = require('../../components/index.js')

let ctx
Page({
  data: {
    loading: false,
    count: 0,
    over: false,
    trigger: true
  },
  onLoad() {
    wx.getSystemInfo({
      success: (res) => {
        const {windowWidth, windowHeight} = res
        this.setData({
          windowWidth,
          windowHeight
        })
      }
    })

    ctx = createFlatListContext({
      id: 'flatList',
      dataKey: 'list',
      page: this
    })

    const arry = this.loadData()
    ctx.appendList(arry)
  },
  scrolltolower() {
    if (this.data.over) {
      console.log('数据加载完毕')
      return
    }
    if (this.data.loading) {
      console.log('数据加载中')
      return
    }
    this.setData({
      loading: true
    })
    setTimeout(() => {
      const arry = this.loadData()
      ctx.appendList(arry)
      this.setData({loading: false})
    }, 500)
  },
  loadData() {
    this.setData({
      count: this.data.count + 1,
      over: this.data.count > 5
    })
    return [{
      idx: 1
    }, {
      idx: 2
    }, {
      idx: 3
    }, {
      idx: 4
    }, {
      idx: 5
    }]
  },
  refresherrefresh() {
    setTimeout(() => {
      ctx.clearList()
      this.setData({
        trigger: false,
        loading: false,
        count: 0,
        over: false,
      })
      const arry = this.loadData()
      ctx.appendList(arry)
    }, 1000)
  }
})
