$(function(){

    init();
    function init(){
        eventList();
    }

    function eventList(){

        //获取验证码
        $("#code_btn").on("tap",function(){
            /* 
            获取手机的值，验证合法性
            验证不通过，return
            验证通过，方式请求
                发送请求成功，禁用按钮，
                设置时间，开启定时器，一段时间后重新启用按钮
            */

            //获取手机的值 , 去掉两边的空格
            var mobile_txt = $.trim($("input[name='mobile']").val()); 
            console.log(mobile_txt);

            //验证合法性
            if(!$.checkPhone(mobile_txt)){
                //提示错误信息
                mui.toast("手机非法");
                return;
            }
            //验证通过，发送验证码post请求
            $.post("users/get_reg_code",{mobile:mobile_txt},function(res){
                console.log(res);
                if(res.meta.status == 200){
                    //禁用按钮
                    $("#code_btn").attr("disabled","disabled");

                    //设置倒计时
                    var times = 5;
                    $("#code_btn").text(times + "秒后再次获取");
                    var timeId = setInterval(function(){
                        times--;
                        $("#code_btn").text(times + "秒后再次获取");

                        if(times == 0){
                            clearInterval(timeId);
                            $("#code_btn").text("获取验证码");
                            //取消按钮禁用  removeAttr() 方法从被选元素中移除属性。
                            $("#code_btn").removeAttr("disabled");
                        }
                    },1000)
                }else{
                    //请求失败,提示信息
                    mui.toast(res.meta.msg);
                }
            })
        })

        //点击注册
        $("#reg_btn").on("tap",function(){
            /* 
            1.获取一堆输入框的值，挨个去验证合法性
            2.验证不通过，提示错误信息，return
            3.验证通过，发送请求
            4.请求成功，提示注册成功
            5.请求失败，提示注册失败
            */

            //获取各个输入框的值
            var mobile_txt = $.trim($("input[name='mobile']").val());
            var code_txt = $.trim($("input[name='code']").val());
            var email_txt = $.trim($("input[name='email']").val());
            var pwd_txt = $.trim($("input[name='pwd']").val());
            var pwd2_txt = $.trim($("input[name='pwd2']").val());
            var gender_txt=$.trim($("input[name='gender']:checked").val());
            //打断点
            // debugger;

            //验证手机合法性
            if(!$.checkPhone(mobile_txt)){
                mui.toast("手机非法");
                return;
            }

            //验证验证码合法性 长度不为4 就是非法
            if(code_txt.length != 4){
                mui.toast("验证码非法");
                return;
            }

            //验证邮箱的合法性
            if(!$.checkEmail(email_txt)){
                mui.toast("邮箱非法");
                return;
            }

            //验证密码合法性  不少于6位数
            if(pwd_txt.length < 6){
                mui.toast("密码非法");
                return;
            }
            //验证两次密码是否一致
            if(pwd_txt != pwd2_txt){
                mui.toast("两次密码不一致");
                return;
            }

            //全部验证通过，发送请求
            $.post("users/reg",{
                mobile:mobile_txt,
                code:code_txt,
                email:email_txt,
                pwd:pwd_txt,
                gender:gender_txt
            },function(res){
                // console.log(res);
                if(res.meta.status == 200){
                    //提示用户注册成功
                    mui.toast(res.meta.msg);
                    //注册成功，1s后跳转页面
                    setTimeout(function(){
                        location.href = "/pages/login.html";
                    },1000)
                    //清空输入框
                    // $(".mui-input-row input").val("");
                }else{
                    //提示用户注册失败
                    mui.toast(res.meta.msg);
                }
            })
        })
    }
})