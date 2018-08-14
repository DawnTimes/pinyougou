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

                //把用户信息存储到永久存储中,需先转为JSON字符串格式
                localStorage.setItem("userinfo",JSON.stringify(res.data));

                //获取会话存储中的保存的页面地址
                var pageName = sessionStorage.getItem("pageName");
                // console.log(pageName);

                setTimeout(function(){
                    //判断有没有页面来源
                    if(pageName){
                        //有，则跳转到该页面地址
                        location.href = pageName;
                    }else{
                        //没有，则跳转到首页
                        location.href = "/index.html";
                    }
                },1000)
                // debugger;
                
            }else{
                //提示登录失败
                mui.toast(res.meta.msg);
            }
        })

    })

})