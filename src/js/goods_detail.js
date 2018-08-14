$(function(){
    //定义一个全局变量
    var GoodsObj;
    init();
    function init(){
        getDetailData();
        eventList();
        
    }

    function getDetailData(){
        $.get("goods/detail",{
            goods_id:$.getUrlValue("goods_id")
        },function(res){
            // console.log(res);

            //把商品信息赋值给全局变量
            GoodsObj= res.data;
            // console.log(GoodsObj);
            // debugger;

            var html = template("tempDetail",{data:res.data});
            $(".pyg_view").html(html);


            //获得slider插件对象
            var gallery = mui('.mui-slider');
            gallery.slider({
            interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
        });

        })
    }

    function eventList(){
        $(".add_btn").on("tap",function(){
            
            // $.post("my/cart/add",{},function(res){
            //     console.log(res);
            //     if(res.meta.status == 401){
            //         mui.toast("未登录");

            //         //把当前页面地址存储到会话存储中
            //         sessionStorage.setItem("pageName",location.href);
            //         // debugger;
            //         //跳转到登录页面
            //         setTimeout(function(){
            //             location.href = "/pages/login.html";
            //         },1000)
            //     }
            // })

            // 判断永久存储中有没有userinfo
            if(!localStorage.getItem("userinfo")){
                // 没有用户信息 肯定未登录过
                mui.toast("未登录");
                sessionStorage.setItem("pageName", location.href);
                setTimeout(function () {
                  location.href = "/pages/login.html";
                }, 1000);
                return; 
            }
            // debugger;

            /* 
            发送到后台的参数分为两种
            1.常规参数：$.ajax({data:obj})
            2.token 登录验证使用，放置在请求头中 发送到后台
            */

           var token = JSON.parse(localStorage.getItem("userinfo")).token;
          //  console.log(token);

            var obj = {
                cat_id: GoodsObj.cat_id,
                goods_id: GoodsObj.goods_id,
                goods_name: GoodsObj.goods_name,
                goods_number: GoodsObj.goods_number,
                goods_price: GoodsObj.goods_price,
                goods_weight: GoodsObj.goods_weight,
                goods_small_logo: GoodsObj.goods_small_logo
            };

            //获取永久存储中的token
            

            $.ajax({
                url: "my/cart/add",
                type: "post",
                data: { info: JSON.stringify(obj) },
                headers: {
                Authorization: token
                },
                success:function(res){
                    console.log(res);
                    if(res.meta.status == 401){
                        mui.toast("未登录");
    
                        //把当前页面地址存储到会话存储中
                        sessionStorage.setItem("pageName",location.href);
                        // debugger;
                        //跳转到登录页面
                        setTimeout(function(){
                            location.href = "/pages/login.html";
                        },1000)
                    }else if(res.meta.status == 200){
                        /* 
                        添加成功
                            弹出一个提示框
                                跳转到购物车页面还是留在当前页面
                        */
                        mui.confirm("是否跳转到购物车页面","添加成功",["确认","取消"],function(type){
                            console.log(type);
                            if(type.index == 0){
                                //跳转到购物车页面
                                location.href = "/pages/cart.html";
                            }else if(type.index == 1){
                                //不做跳转，留在当前页面
                            }
                        })
                    }
                }
            })
        })
    }

   
})