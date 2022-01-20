const _ = require('./utils')

test('render', async () => {
  const componentId = _.load('flat-list/index')
  const component = _.render(componentId, {
    height: 120, width: 100
  })

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)
  expect(_.match(component.dom, '<wx-view><wx-scroll-view class="main--content" style="height:120px;width:100px;"></wx-scroll-view></wx-view>')).toBe(true)

  component.addEventListener('scrolltolower', evt => {

  })

  component.addEventListener('scroll', evt => {

  })

  component.addEventListener('scrolltoupper', evt => {

  })

  component.instance.lower({

  })

  component.instance.upper({

  })

  component.instance.scroll({

  })

  component.instance.setContext({
    destroy() {
    }
  })

  component.instance.setPage({
    _scroll() {
    }
  })

  component.detach()
  expect(component.instance.context).toBe(null)
  expect(component.instance.page).toBe(null)
})
