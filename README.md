# miniprogram-flat-list

<p align="center">
  <a href="https://github.com/wes-lin/miniprogram-flat-list/actions/workflows/preview-build.yml">
    <img src="https://github.com/wes-lin/miniprogram-flat-list/actions/workflows/preview-build.yml/badge.svg">
  </a>
  <a href="https://www.npmjs.org/package/miniprogram-flat-list">
    <img src="https://img.shields.io/npm/v/miniprogram-flat-list.svg">
  </a>
  <a href="https://npmcharts.com/compare/miniprogram-flat-list?minimal=true">
    <img src="http://img.shields.io/npm/dm/miniprogram-flat-list.svg">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

微信小程序版FlatList：

* 支持下拉刷新

## 背景

电商小程序往往需要展示很多商品，当一个页面展示很多的商品信息的时候，会造成小程序页面的卡顿以及白屏。微信官方有出一个recycle-view来解决这个问题，但是其仍然有许多不足之处。
* item高度必须严格计算，不然下一页会渲染不完整，或者会出现闪屏
* item高度发生变动时候，重新渲染无效（可能是我的写法不对，我需要旋转屏幕的时候更新布局）

## 实现思路

1. 将渲染列表的数组list改成二维数组
2. 只渲染当然可视区域的那一屏以及它前后一屏的元素。其他用空白div占位  

**具体解释可以参考这篇文章**  
[小程序长列表渲染优化另一种解决方案](https://zhuanlan.zhihu.com/p/146791824)，该组件就是按照他的思路完成的。

## 包结构
FlatList组件由2个自定义组件 flat-list、flat-list-item和一组API组成，对应的代码结构如下
```yaml
├── miniprogram-flat-list/
    └── flat-list 组件
    └── flat-list-item 组件
    └── index.js
```
包结构详细描述如下：

| 目录/文件          | 描述                     |
| ----------------- | ------------------------ |
| flat-list 组件 | 长列表组件                |
| flat-list-item 组件 | 长列表每一页组件     |
| index.js          | 提供操作长列表数据的API    |

## 使用方法

1. 安装组件

```
npm install --save miniprogram-flat-list
```
2. 在页面的 json 配置文件中添加 flat-list 和 flat-list-item 自定义组件的配置

```json
{
    "usingComponents": {
    "flat-list": "miniprogram-flat-list/flat-list/index",
    "flat-list-item": "miniprogram-flat-list/flat-list-item/index"
    }
}
```

3. WXML 文件中引用 flat-list

```xml
<flat-list id="flatList" 
  bindscrolltolower="scrolltolower" 
  width="{{windowWidth}}" 
  height="{{windowHeight}}"
  use-after-slot="{{true}}"
  use-before-slot="{{true}}"
  refresher-enabled="{{true}}"
  refresher-triggered="{{trigger}}"
  bindrefresherrefresh="refresherrefresh">
  <view slot="before" class="after">
    我来组成头部
  </view>
  <flat-list-item wx:for="{{list}}" wx:for-item="item" wx:for-index="pageIndex" item="{{item}}" wx:key="item">
    <block>
      <view class="page">这是第 {{pageIndex}} 页面数据</view>
      <view class="item" wx:for="{{ item }}" wx:for-index="index" wx:for-item="listItem" wx:key="index">
        第{{index}}条数据
      </view>
    </block> 
  </flat-list-item>
  <view slot="after" class="after">
    <view wx:if="{{loading}}">
      数据加载中
    </view>
    <view wx:elif="{{over}}">
      我可是有底线的
    </view>
  </view>
</flat-list>
```
**flat-list 的属性介绍如下：**

| 字段名                | 类型    | 必填 | 描述                                      |
| --------------------- | ------- | ---- | ----------------------------------------- |
| id                    | String  | 是   | id必须是页面唯一的字符串                  |
| height                | Number  | 否   | 设置flat-list的高度，默认为页面高度    |
| width                 | Number  | 否   | 设置flat-list的宽度，默认是页面的宽度  |
| use-before-slot       | Boolean | 否   | 默认为false，是否使用头部插槽        |
| use-after-slot        | Boolean | 否   | 默认为false，是否使用尾部插槽         |
| refresher-enabled     | Boolean | 否   | 默认为false，同scroll-view同名字段        |
| refresher-triggered   | Boolean | 否   | 默认为false，同scroll-view同名字段        |
| refreshe-threshold    | Number  | 否   | 默认为45，同scroll-view同名字段        |
| refresher-default-style       | String  | 否   | 默认为black，同scroll-view同名字段                      |
| refresher-background     | String  | 否   | 默认为#FFF，同scroll-view同名字段 |
| bindscroll            | 事件    | 否   | 同scroll-view同名字段                     |
| bindscrolltolower     | 事件    | 否   | 同scroll-view同名字段                     |
| bindscrolltoupper     | 事件    | 否   | 同scroll-view同名字段                     |
| bindrefresherrefresh     | 事件    | 否   | 同scroll-view同名字段                     |

**flat-list 包含3个 slot，具体介绍如下：**

| 名称      | 描述                                                      |
| --------- | --------------------------------------------------------- |
| before    | 默认 slot 的前面的非回收区域                              |
| 默认 slot | 长列表的列表展示区域，flat-list-item 必须定义在默认 slot 中 |
| after     | 默认 slot 的后面的非回收区域                              |

​  长列表的内容实际是在一个 flat-list 滚动区域里面的，当长列表里面的内容，不止是单独的一个列表的时候，例如我们页面底部都会有一个 copyright 的声明，我们就可以把这部分的内容放在 before 和 after 这2个 slot 里面。

**flat-list-item 的介绍如下：**  

| 字段名                | 类型    | 必填 | 描述                                      |
| --------------------- | ------- | ---- | ----------------------------------------- |
| item                    | Object  | 是   | 一屏的页面数据                  |

​  需要注意的是，flat-list-item 中必须定义 wx:for 列表循环，不应该通过 setData 来设置 wx:for 绑定的变量，而是通过`createFlatListContext`方法创建`FlatListContext`对象来管理数据，`createFlatListContext`在 index.js 文件里面定义。建议同时设置 wx:key，以提升列表的渲染性能
   
4. 页面 JS 管理 flat-list 的数据

```javascript
const createRecycleContext = require('miniprogram-flat-list')
Page({
    onReady: function() {
      var ctx = createFlatListContext({
      id: 'flatList',
      dataKey: 'list',
      page: this
    })

    const arry = this.loadData()
    ctx.appendList(arry)
})
```
​  id 和dataKey page是必填项，其中id要和页面flat-list组件id一致，dataKey为绑定页面data的key，方便页面进行数据的渲染，page是组件所在的页面

FlatListContext 对象提供的方法有：

| 方法                  | 参数                         | 说明                                                         |
| --------------------- | ---------------------------- | ------------------------------------------------------------ |
| appendList                | list, callback               | 在当前的长列表数据上追加list数据，callback是渲染完成的回调函数 |
| clearList                | callback | 清空所有数据，callback是清除完成的回调函数 |
| getAllList                |         | 获取所有数据 |
| destroy               | 无                           | 销毁FlatListContext对象，在flat-list销毁的时候调用此方法   |
| getCurrentRenderIndex           | 无        | 获取当前渲染屏幕索引 |

 ## Tips
[一个完整的测试demo](./tools/demo)  
![demo](https://cdn.jsdelivr.net/gh/wes-lin/miniprogram-flat-list/doc/demo.gif)
