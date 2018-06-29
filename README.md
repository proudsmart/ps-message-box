# proudsmart-message-box #
一个提示框插件，兼容AMD规范，既可以直接使用script标签引用，也可以使用requirejs等引入

### MessageBox的主要方法 ###

##### alert(options, [confirmFn]) #####

* options类型是字符串或对象，当options为对象时，第二个参数将被自动忽略
* 当options为字符串时，options将作为信息内容显示在弹出框内。
* `confirmFn`作为点击确定按钮时的回调，其默认行为是关闭弹窗。点击事件作为该函数的参数，可调用`preventDefault`阻止默认行为
* 当options为对象时，则必须包含`message`属性，否则会抛出错误。
* 当options为对象时，可以包含`confirmFn`属性，作为点击确定按钮时的回调。

```
MessageBox.alert('这是一条提示信息！', function (e) {
    //点击确定按钮时触发此回调函数，此回调的参数是事件对象
    //调用事件对象的preventDefault方法，可阻止默认的关闭事件
    //e.preventDefault();
    console.log('> _ <')
});
```
```
MessageBox.alert({
    message: '这是一条提示信息！'，
    confirmFn: function (e) {
        e.preventDefault();
    }
});
```


##### confirm(options, [confirmFn, cancelFn]) #####
* `cancelFn`为点击取消按钮时触发的回调函数，默认行为是关闭弹窗。函数的参数是事件对象，调用`preventDefault`阻止其默认行为
```
MessageBox.confirm({
    message: '这是一条确认信息！'，
    confirmFn: function (e) {
        e.preventDefault();
        // doSomething
    },
    cancelFn: function (e) {
        //e.preventDefault();
        // ...
    }
});
```

##### prompt(options, [confirmFn, cancelFn]) #####
* `confirmFn`作为点击确定按钮的回调函数，有两个参数，
* 第一个参数是事件对象，该对象的`inputValue`是输入框的值
* 第二个参数是input中输入的值
```
MessageBox.prompt('请输入姓名', function (e, value) {
    console.log(value); // 在控制台打印输入框的值
    console.log(e.inputValue); // 在控制台打印输入框的值
}, function (e) {
    e.preventDefault();
    // doSomething
});
```
* `placeholder` 可选，输入框的plactholder，默认为空
* `reg` 可选，输入框的输入规则，应该是一个正则表达式
* `errorTip` 可选，输入错误时的提示文字，当reg为空时，该属性不起作用
* `defaultValue` 可选，输入框的默认文字
```
MessageBox.prompt({
    message: '输入一个数字',
    placeholder: '输入数字，长度为1到5',
    reg: /[0-9]{1,5}/,
    errorTip: '请输入数字',
    confirmFn: function (e, value) {
        // do something...
    }
});
```
##### 其他参数 ####
以上三个方法，还可设置下述参数
* `cancelButtonText` 取消按钮的文字，默认为 "确定"
* `confirmButtonText` 确定按钮的文字，默认为 "取消"
* `disableAnimation` 是否禁用动画，默认为 false

##### dismiss() #####
* 关闭弹窗，需要手动关闭弹窗时调用
```
MessageBox.prompt('请输入姓名', function (e) {
    console.log(e.inputValue);
}, function (e) {
    e.preventDefault();
    MessageBox.dismiss();//手动关闭弹窗
    //this.dismiss();//也可以关闭弹窗~
});
```