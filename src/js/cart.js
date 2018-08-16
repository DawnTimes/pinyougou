$(function(){
    init();
    function init(){

        //判断是否已经登录
        if(!$.checkLogin()){
            //重新跳转到登录页面
            sessionStorage.setItem("pageName",location.href);
            location.href = "/pages/login.html";
            return;
        }else{
            $("body").fadeIn();
        }

        getCartData();
        eventList();
    }

    //查询购物车数据
    function getCartData(){
        //获取token
        var token = $.token();
        // console.log(token);

        //检测永久存储有没有 userinfo
        $.ajax({
            url: "my/cart/all",
            headers: {
                Authorization: token
            },
            success: function(res){
                // console.log(res);
                //判断token是否有效
                if(res.meta.status == 200){
                    var cart_info = JSON.parse(res.data.cart_info);
                    console.log(cart_info);

                    var html = template("tempCart",{obj:cart_info});
                    $(".pyg_cart ul").html(html);

                    //初始化数字输入框，需在元素动态生成之后初始化才有用
                    mui(".mui-numbox").numbox();

                    //计算总价格
                    countAll();
                }else{
                    console.log(res.meta.msg);
                }
            }
        })
    }

    //点击事件
    function eventList(){
        //给+ - 号添加 tap事件  =>计算出总价格
        $(".cart_content").on("tap",".mui-btn",function(){
            //计算总价格
            countAll();
        });

        //点击编辑 => 完成 按钮
        $("#edit_btn").on("tap",function(){
            //给body切换样式
            $("body").toggleClass("edit_status");

            //动态切换编辑按钮的文字
            if($("body").hasClass("edit_status")){
                $("#edit_btn").text("完成");
            }else{
                $("#edit_btn").text("编辑");
            }
        })
    }

    //计算总价格
    function countAll(){
        /* 
        1.获取所有的li标签
        2.循环
            1.计算每一个li标签的商品的总价格(单价*数量)
            2.累加所有li标签的总价格
        3.拿到总价格 => 赋值给总价格标签
        */
       var lis = $(".cart_content ul li");
        //console.log(lis);
        //总价格
        var total = 0;
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            //获取li标签中自定义属性的值
            var obj = $(li).data("obj");
            // console.log(obj);
            //单价
            var tmp_goods_price = obj.goods_price;
            //获取购买的数量
            var nums = $(li).find(".mui-numbox-input").val();
            //计算总价格(每一个li标签的总价格累加起来)
            total += tmp_goods_price * nums;
        }
        console.log(total);
        //赋值
        $(".total_pirce .pirce").text(total);
        
    }
})