var mainCtrl = {
    // 父容器
    el: "#mainPage",
    className: "sw-page",
    noCheckLogin:1,
    // 页面渲染之前执行
    beforeRender: function() {
        return true;
    },
    // 页面渲染
    renderer: {
        // #sweetRoot 为最顶层。可设置成其他容器，如#frameMain
        container: '#sweetRoot',
        // flase 为替换模式，true为追加模式
        mode: false,
        // 是否启用ajax模式   
        isAjax: false,
        // 开启ajax模式时，所需的jquery ajax 参数
        ajaxParams: {
            url: "",
        },
        // 手动设置初始数据
        data: {},
        // html模板
        template: require('./index.html')
    },
    init: function() {
        
    }
};

module.exports = mainCtrl;