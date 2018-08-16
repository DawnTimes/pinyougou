$(function(){
    init();
    function init(){

        //判断是否已经登录
        if(!$.checkLogin()){
            //把当前页面地址存放到 会话地址 中
            $.setPage();
            //重新跳转到登录页面
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

                /* 
                1.判断有没有商品
                2.获取所有的li标签
                3.循环li标签
                    1 获取li身上的obj
                    2 改变 obj 里面的obj.amount(要购买的数量) = 所在li标签的里面的input标签的值
                    3 再去构造请求的参数 info:{}
                */
               var lis = $(".cart_content li");
               //判断有没有商品
               if(lis.length == 0){
                   mui.toast("您还没有购买的商品");
                   return;
               }

               //需要发送后台的 info 对象
               var infos = {};
               for (var i = 0; i < lis.length; i++) {
                    var li = lis[i];
                    //商品的对象
                    var obj = $(li).data("obj");
                    //获取购买的商品的数量,并赋值给obj.amount
                    obj.amount = $(li).find(".mui-numbox-input").val();
                    infos[obj.goods_id] = obj;
               }

               //同步数据
               syncCart(infos);
            }
        })


        //点击删除
        $("#delete_btn").on("tap",function(){
            /* 
            1.获取已选中的复选框的个数
                如果长度为0，则没有选中的
            2.如果有选中的，则弹出提示框  提示用户是否删除
            3.确定 删除  接口-同步购物车，获取数据
                方式1. 如 有5个商品，选中1个，则发送被选中的商品的id到后台
                方式2. 如有5个商品，选中1个，发送未选中的那4个商品带后台
            4.根据文档要求 用方式2 
                获取未删除的li标签，构造函数 方式请求
            5.方式请求
                删除失败 弹出提示信息
                删除成功 重新发送请求 渲染页面
            */

            //获取被选中的复选框
            var checkeds = $(".cart_content input[name='g_ckb']:checked");
            // console.log(checkeds);
            //如果长度为0 提示：没有选中任何商品
            if(checkeds.length == 0){
                mui.toast("还没有选中任何商品");
                return;
            }

            //有选中的 弹出提示  确定 或 取消
            mui.confirm("确定要删除吗？","警告",["确定", "取消"],function(etype){
                //确定
                if(etype.index == 0){
                    //获取未被选中的复选框的父元素 li 标签
                    var unCheckedList = $(".cart_content input[name='g_ckb']").not(":checked").parents("li");
                    console.log(unCheckedList);

                    //被删除的对象字段
                    var infos = {};
                    for (var i = 0; i < unCheckedList.length; i++) {
                        var li = unCheckedList[i];
                        // var obj = li.dataset.obj;
                        var obj = $(li).data("obj");
                        console.log(obj);
                        infos[obj.goods_id] = obj;
                    }
                    console.log(infos);

                    // console.log($.token());

                    //发送请求删除数据
                    syncCart(infos);

                } else if(etype.index == 1){
                    //取消
                    console.log('取消');
                }
            })
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


    //同步数据
    function syncCart(infos){
        //发送请求删除数据
        $.ajax({
            url:"my/cart/sync",
            type:"post",
            data:{
                infos:JSON.stringify(infos)
            },
            headers: {
                Authorization: $.token()
            },
            success: function(res){
                console.log(res);
                //成功
                if(res.meta.status == 200){
                    mui.toast(res.meta.msg);
                    //重新渲染数据
                    getCartData();
                }else{
                    //失败
                    mui.toast(res.meta.msg);
                }
            }
        })
    }
})