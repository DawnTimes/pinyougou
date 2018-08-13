$(function(){

    init();
    function init(){

    }

    //点击登录确认
    $("#login_btn").on("tap",function(){
        //获取输入框的value值
        var mobile_txt = $.trim($("input[name='mobile']").val());
        var password_txt = $.trim($("input[name='password']").val());

        //验证手机合法性
        if(!$.checkPhone(mobile_txt)){
            mui.toast("手机非法");
            return;
        }

        //验证密码合法性 不少于6位数
        if(password_txt.length < 6){
            mui.toast("密码非法");
            return;
        }

        //通过验证 方式请求
        $.post("login",{
            username:mobile_txt,
            password:password_txt
        },function(res){
            console.log(res);
            if(res.meta.status == 200){
                //提示登录成功
                mui.toast(res.meta.msg);
                //登录成功，跳转页面
                setTimeout(function(){
                    location.href = "/index.html";
                },1000)
            }else{
                //提示登录失败
                mui.toast(res.meta.msg);
            }
        })

    })

})