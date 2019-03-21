/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Turn off ESLint for this file because it's sent down to users as-is.
/* eslint-disable */
window.addEventListener('load', function() {
  // add event listener for all tab
  document.querySelectorAll('.nav-link').forEach(function(el) {
    el.addEventListener('click', function(e) {
      const groupId = e.target.getAttribute('data-group');
      document
        .querySelectorAll(`.nav-link[data-group=${groupId}]`)
        .forEach(function(el) {
          el.classList.remove('active');
        });
      document
        .querySelectorAll(`.tab-pane[data-group=${groupId}]`)
        .forEach(function(el) {
          el.classList.remove('active');
        });
      e.target.classList.add('active');
      document
        .querySelector(`#${e.target.getAttribute('data-tab')}`)
        .classList.add('active');
    });
  });
  // 中英文站切换----手动添加代码
  document.querySelector('.navigationWrapper ul.nav-site').addEventListener('click', function (e) {
    if (e.target.href === 'javascript:(0);') {
      var currentPath = window.location.pathname
      if (currentPath.split('/')[1] === 'cn') { // 当前为中文站-跳转至英文站
        window.location.href = window.location.origin + currentPath.slice(3)
      } else { // 当前为英文站-跳转至中文站
        window.location.href = window.location.origin + '/cn' + currentPath
      }
    }
  })
});
