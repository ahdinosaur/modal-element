var yo = require('yo-yo')
var assign = require('object-assign')
var document = require('global/document')
var onload = require('on-load')

module.exports = function modalElement (contents) {
  var modal = null
  var el = render(contents)
  function modalShow (newContents) {
    if (newContents) contents = newContents
    el = yo.update(el, render(contents))
  }
  function modalHide () {
    el = yo.update(el, document.createTextNode(''))
  }
  function modalToggle (newContents) {
    if (!el || el.nodeName === '#text') {
      modalShow(newContents)
    } else {
      modalHide()
    }
  }
  function didClickOut (e) {
    var source = e.target
    while (source.parentNode) {
      // HACK (@ahdinosaur)
      // clicking on the modal after a
      // re-render was not working with
      // `source === modal`
      // for some unknown reason.
      // this works for now... :)
      if (source.className === 'modal') {
        return true
      }
      source = source.parentNode
    }
    modalHide()
  }
  el.show = modalShow
  el.hide = modalHide
  el.toggle = modalToggle
  return el

  function render (contents) {
    modal = yo`<div class="modal">${contents}</div>`
    var overlay = yo`<div class="modal-overlay">${modal}</div>`
    onload(overlay, function () {
      document.addEventListener('mousedown', didClickOut, false)
    }, function () {
      document.removeEventListener('mousedown', didClickOut, false)
    })
    assign(overlay.style, {
      position: 'fixed',
      height: '100%',
      width: '100%',
      top: 0,
      left: 0,
      'z-index': '9999'
    })
    return overlay
  }
}
