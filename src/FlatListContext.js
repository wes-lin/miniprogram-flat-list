const throttle = (fn, delay, ...args) => {
  let startTime = new Date()
  return function () {
    const context = this
    const endTime = new Date()
    const resTime = endTime - startTime
    // 判断大于等于我们给的时间采取执行函数;
    if (resTime >= delay) {
      fn.apply(context, args)
      // 执行完函数之后重置初始时间，等于最后一次触发的时间
      startTime = endTime
    }
  }
}

function FlatListContext({id, dataKey, page}) {
  if (!id || !dataKey || !page) {
    throw new Error('parameter id, dataKey, page is required')
  }
  this.id = id
  this.dataKey = dataKey
  this.page = page

  this.comp = page.selectComponent(`#${id}`)
  if (this.comp) {
    this.comp.setContext(this)
    this.comp.setPage(page)
  }

  this._initPageData()

  // 组件滚动处理
  page._scroll = (e) => {
    throttle(this.onPageScroll(e), 500)
  }
}
FlatListContext.prototype.setHeight = function () {
  const that = this
  const wholePageIndex = this.wholePageIndex
  const query = wx.createSelectorQuery()
  query.selectAll(`#${this.id}>>> .flat-list-wrap`).boundingClientRect()
  query.exec(function (res) {
    that.pageHeightArr[wholePageIndex] = res[0][wholePageIndex] && res[0][wholePageIndex].height
  })
}
FlatListContext.prototype._initPageData = function () {
  this.wholePageIndex = -1
  this.wholeList = [] // 用来装所有屏的数据
  this.currentRenderIndex = -1 // 当前正在渲染哪一屏
  this.pageHeightArr = [] // 用来装每一屏的高度
}
FlatListContext.prototype.appendList = function (list, cb) {
  if (!list) {
    return
  }
  const dataKey = this.dataKey
  this.wholePageIndex = this.wholePageIndex + 1
  const wholePageIndex = this.wholePageIndex
  this.currentRenderIndex = wholePageIndex
  this.wholeList[wholePageIndex] = list
  const datas = {}
  const tempList = new Array(wholePageIndex + 1).fill(0)
  if (wholePageIndex > 2) {
    tempList.forEach((item, index) => {
      if (index < tempList.length - 2) {
        tempList[index] = {height: this.pageHeightArr[index]}
      } else {
        tempList[index] = this.wholeList[index]
      }
    })
    datas[dataKey] = tempList
  } else {
    datas[`${dataKey}[${wholePageIndex}]`] = list
  }
  this.page.setData(datas, () => {
    this.setHeight()
    if (cb) {
      cb()
    }
  })
}
FlatListContext.prototype.clearList = function (cb) {
  this._initPageData()
  const dataKey = this.dataKey
  const datas = {}
  datas[dataKey] = []
  this.page.setData(datas, () => {
    if (cb) {
      cb()
    }
  })
}
FlatListContext.prototype.getAllList = function () {
  return this.wholeList
}
FlatListContext.prototype.onPageScroll = function (e) {
  const realScrollTop = e.detail.scrollTop
  const windowHeight = this.comp.data.height
  // 滚动的时候需要实时去计算当然应该在哪一屏幕
  let tempScrollTop = 0
  const wholePageIndex = this.wholePageIndex

  for (let i = 0; i < this.pageHeightArr.length; i++) {
    tempScrollTop += this.pageHeightArr[i]
    if (tempScrollTop > realScrollTop + windowHeight) {
      this.computedCurrentIndex = i
      break
    }
  }
  const currentRenderIndex = this.currentRenderIndex
  const that = this
  if (this.computedCurrentIndex !== currentRenderIndex) {
    // 这里给不渲染的元素占位
    const tempList = new Array(wholePageIndex + 1).fill(0)
    tempList.forEach((item, index) => {
      if (this.computedCurrentIndex - 1 <= index && index <= this.computedCurrentIndex + 1) {
        tempList[index] = that.wholeList[index]
      } else {
        tempList[index] = {height: that.pageHeightArr[index]}
      }
    })
    this.currentRenderIndex = this.computedCurrentIndex
    const datas = {}
    const dataKey = this.dataKey
    datas[dataKey] = tempList
    this.page.setData(datas)
  }
}
FlatListContext.prototype.getCurrentRenderIndex = function () {
  return this.currentRenderIndex
}
FlatListContext.prototype.destroy = function () {
  this.page = null
  this.comp = null
  this._initPageData()
}

module.exports = FlatListContext
