$(function(){
    init();
    function init(){
        //判断是否有登录
        if(!localStorage.getItem("userinfo")){
            mui.toast("您还未登录");
            //保存页面地址到会话存储中
            sessionStorage.setItem("pageName",location.href);
            //跳转到登录页面
            location.href = "/pages/login.html";
            return;
        }else{
            $("body").fadeIn();
        }

        queryOrders();
    }

    //查询订单
    function queryOrders(){
        $.ajax({
            url:"my/orders/all",
            type:"get",
            data: {type:1},
            headers: {
                Authorization: $.token()
            },
            success:function(res){
                console.log(res);
                if(res.meta.status == 200){
                    //渲染数据
                    var html = template("tmpOrder",{data:res.data});
                    $("#item1 ul").html(html);
                }
            }
        })
    }
})