(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module !== "undefined" && typeof module.exports === "function") {
    module.exports = factory();
  } else {
    factory();
  }
}(this, function () {

  function createElement(tagName, className, htmlKey) {
    var el = document.createElement(tagName);
    el.setAttribute("class", className);
    this.html[htmlKey] = el;
    return el;
  }

  var _MessageBox = function () {
    this.html = {};
  };

  _MessageBox.prototype.open = function (type, option) {
    this.checkParameter(type, option);
    this.buildHtml(type, option);
    this.bindEvent(option);
  };

  _MessageBox.prototype.checkParameter = function () {
    var type = arguments[0];
    var option = arguments[1];
    var flag = false;
    if (typeof option.message !== 'string' && typeof option.message !== 'number') {
      flag = true;
    }
    if (option.confirmFn && typeof option.confirmFn !== 'function') {
      flag = true;
    }
    if (type !== 'alert') {
      if (option.cancelFn && typeof option.cancelFn !== 'function') {
        flag = true;
      }
    }
    if (flag) {
      throw new Error('参数错误。');
    }
  };

  _MessageBox.prototype.buildHtml = function (type, option) {
    this.disableAnimation = !!option.disableAnimation;
    var backDrop = createElement.call(this, 'div', '_message_box-back-drop', 'backDrop');
    var modalBack = createElement.call(this, 'div', '_message_box-modal-back', 'modalBack');
    var container = createElement.call(this, 'div', '_message_box-message-box', 'container');
    var header = createElement.call(this, 'div', '_message_box-header', 'header');
    var title = createElement.call(this, 'p', '_message_box-title', 'title');
    var body = createElement.call(this, 'div', '_message_box-body', 'body');
    var message = createElement.call(this, 'p', '_message_box-message', 'message');
    var message_span = createElement.call(this, 'span', '', 'message_span');
    var footer = createElement.call(this, 'div', '_message_box-footer', 'footer');
    var confirmButton = createElement.call(this, 'button', '_message_box-confirm-button', 'confirmButton');
    title.innerText = option.title || '提示';
    message_span.innerText = option.message;
    confirmButton.innerText = option.confirmButtonText || '确认';
    container.appendChild(header);
    container.appendChild(body);
    container.appendChild(footer);
    header.appendChild(title);
    body.appendChild(message);
    message.appendChild(message_span);
    footer.appendChild(confirmButton);
    modalBack.appendChild(container);
    if (type === 'prompt') {
      var message_input = createElement.call(this, 'input', '_message_box-message-input', 'message_input');
      message_input.value = option.defaultValue || '';
      message_input.placeholder = option.placeholder || '';
      message.appendChild(message_input);
      // 如果传入正则表达式，就加入一个tip提示文字
      if (option.reg) {
        var message_input_tip = createElement.call(this, 'div', '_message_box-message-input-tip', 'message_input_tip');
        message_input_tip.innerText = option.errorTip || '输入不正确，请重新输入';
        message.appendChild(message_input_tip);
      }
    }
    if (type !== 'alert') {
      var cancelButton = createElement.call(this, 'button', '_message_box-cancel-button', 'cancelButton');
      cancelButton.innerText = option.cancelButtonText || '取消';
      footer.appendChild(cancelButton);
    }

    document.body.appendChild(backDrop);
    document.body.appendChild(modalBack);

    // 动画相关
    if (!option.disableAnimation) {
      container.classList.add('_message_box-animate');
      container.style.cssText = 'opacity: 0;-webkit-transform: translateY(-30px);-moz-transform: translateY(-30px);-ms-transform: translateY(-30px);-o-transform: translateY(-30px);transform: translateY(-30px);';
      setTimeout(function () {
        container.style.cssText = 'opacity: 1;-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);transform: translateY(0);';
      });
    }
  };

  _MessageBox.prototype.bindEvent = function (option) {
    var _this = this;
    var confirmButton = this.html.confirmButton;
    var cancelButton = this.html.cancelButton;
    var message_input = this.html.message_input;
    var message_input_tip = this.html.message_input_tip;
    // 用最外层的container做事件代理
    this.html.container.addEventListener('click', function (e) {
      _this.html.container._clickEvent = arguments.callee;
      _this.event = e;
      if (e.target == confirmButton) {
        if (option.confirmFn) {
          if (message_input) {
            var message_input_value = message_input.value;
            if (option.reg && !option.reg.test(message_input_value)) {
              message_input_tip.style.display = 'block';
              return;
            } else {
              e.inputValue = message_input.value || '';
              option.confirmFn.call(_this, e, message_input.value || '');
            }
          } else {
            option.confirmFn.call(_this, e);
          }
        }
        if (!e.defaultPrevented) {
          _this.dismiss();
        }
      }
      if (e.target == cancelButton) {
        if (option.cancelFn) {
          option.cancelFn.call(_this, e);
        }
        if (!e.defaultPrevented) {
          _this.dismiss();
        }
      }
    });
    // 如果是prompt的话，且传入正则表达式，则为输入框绑定focus事件
    if (message_input && message_input_tip) {
      message_input.addEventListener('focus', function () {
        message_input._focusEvent = arguments.callee;
        message_input_tip.style.display = 'none';
      });
    }
  };

  _MessageBox.prototype.dismiss = function () {
    var _this = this;
    if (this.disableAnimation) {
      document.body.removeChild(_this.html.backDrop);
      document.body.removeChild(_this.html.modalBack);
      this.html = {};
    } else {
      this.html.container.style.cssText = 'opacity: 0;-webkit-transform: translateY(-30px);-moz-transform: translateY(-30px);-ms-transform: translateY(-30px);-o-transform: translateY(-30px);transform: translateY(-30px);';
      this.html.container.addEventListener('transitionend', function () {
        _this.html.container.removeEventListener('transitionend', arguments.callee);
        document.body.removeChild(_this.html.backDrop);
        document.body.removeChild(_this.html.modalBack);
        _this.html = {};
      });
    }

    // 解除弹窗绑定的点击事件
    this.html.container.removeEventListener('click', this.html.container._clickEvent);
    // 解除输入框的focus事件
    this.html.message_input.removeEventListener('focus', this.html.container._focusEvent);

  };

  _MessageBox.prototype.alert = function (option, confirmFn) {
    var obj = {};
    if (typeof option === 'string' || typeof option === 'number') {
      obj = {
        message: option,
        confirmFn: confirmFn
      };
    } else if (typeof option === 'object') {
      obj = option;
    }
    this.open('alert', obj);
  };

  _MessageBox.prototype.confirm = function (option, confirmFn, cancelFn) {
    var obj = {};
    if (typeof option === 'string' || typeof option === 'number') {
      obj = {
        message: option,
        confirmFn: confirmFn,
        cancelFn: cancelFn
      };
    } else if (typeof option === 'object') {
      obj = option;
    }
    this.open('confirm', obj);
  };

  _MessageBox.prototype.prompt = function (option, confirmFn, cancelFn) {
    var obj = {};
    if (typeof option === 'string' || typeof option === 'number') {
      obj = {
        message: option,
        confirmFn: confirmFn,
        cancelFn: cancelFn
      };
    } else if (typeof option === 'object') {
      obj = option;
    }
    this.open('prompt', obj);
  };

  this._MessageBox = _MessageBox;

  return _MessageBox;

}));
