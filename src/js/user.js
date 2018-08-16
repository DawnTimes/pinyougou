$(function(){
    init();
    function init(){
        //先判断是否有登录
        if(!localStorage.getItem("userinfo")){
            //提示未登录
            mui.toast("您还未登录");
            //保存页面的地址到会话存储中
            sessionStorage.setItem("pageName",location.href);
            //跳转到登录页面
            location.href = "/pages/login.html";
            return;
        }else{
            //显示页面,原本是隐藏的
            $("body").fadeIn();
        }


        getUserInfo();
        eventList();
    }

    function getUserInfo(){
        $.ajax({
            url:"my/users/userinfo",
            type:"get",
            headers: {
                Authorization: $.token()
            },
            success: function(res){
                console.log(res);
                if(res.meta.status == 200){
                    var html = template("tmpUserInfo",{data:res.data});
                    $(".pyg_userinfo").html(html);
                }else{
                    mui.toast(res.meta.msg);
                }
            }
,        })
    }

    //退出登录
    function eventList(){
        $("#loginOutBtn").on("tap",function(){
            /* 
            1.弹出确认框
            2.手动删除永久存储的信息
            3.跳转回登录页面
            */

            mui.confirm("确定退出么？","提示信息",["确认","取消"],function(etype){
                if(etype.index == 0){
                    
                    //手动删除永久存储的信息
                    localStorage.removeItem("userinfo");
                    //保存当前页面地址到会话存储中
                    $.setPage();
                    mui.toast("退出成功");
                    setTimeout(function(){
                        location.href = "/pages/login.html";
                    },1000)

                }else if(etype.index == 1){
                    // mui.toast("退出失败");
                }
            })
        })
    }
})