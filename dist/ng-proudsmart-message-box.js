(function (root, factory) {
  if (typeof root.angular !== "object") {
    throw new Error("angularjs is a must!")
  }
  if (typeof root._MessageBox !== "function") {
    throw new Error("message-box is a must!")
  }
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module !== "undefined" && typeof module.exports === "function") {
    module.exports = factory();
  } else {
    factory();
  }
})(this, function () {
  var ngMsgBox = angular.module("proudsmartMessageBox", []);

  var _MessageBox = this._MessageBox;

  ngMsgBox.factory('psMessageBox', [function () {
    var factory = {};

    var toArray = function (arg) {
      return Array.prototype.slice.call(arg);
    }

    // __instance__是一个比较private的属性，禁止删除或者重写
    Object.defineProperty(factory, '__instance__', {
      configurable: false,
      writable: false,
      enumerable: false,
      value: new _MessageBox()
    });

    factory.prompt = function () {
      factory.__instance__.prompt.apply(factory.__instance__, toArray(arguments));
    };

    factory.confirm = function () {
      factory.__instance__.confirm.apply(factory.__instance__, toArray(arguments));
    };

    factory.alert = function () {
      factory.__instance__.alert.apply(factory.__instance__, toArray(arguments));
    };

    factory.dismiss = function () {
      factory.__instance__.dismiss.apply(factory.__instance__, toArray(arguments));
    };

    return factory;
  }]);

  return ngMsgBox;
});