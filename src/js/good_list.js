$(function(){
    
    setHtmlFontsize();
    // search();
    var QueryObj = {
        query:"",
        cid: $.getUrlValue("cid"),
        pagenum:1,
        pagesize:6
    }
    // console.log(QueryObj);

    //总页数
    var totalPages = 1;


    init();
    function init(){
        eventLink();

        mui.init({
            pullRefresh : {
              container:".pyg_view",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
              down : {
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                callback : function(){
                    console.log('下拉触发了');
                    //模拟下拉结束
                    // setTimeout(function(){
                    //     // 结束下拉刷新
                    //     mui('.pyg_view').pullRefresh().endPulldownToRefresh();
                    // },2000)

                    //下拉发送请求前，先把原来的数据清空，不让他累加
                    $(".pyg_view ul").html("");
                    //重置页码
                    QueryObj.pagenum = 1;
                    //发送ajax请求
                    search(function(){
                        //等待请求回来 在结束下拉刷新
                        mui('.pyg_view').pullRefresh().endPulldownToRefresh(); //refresh completed
                        //重置上拉加载
                        mui('.pyg_view').pullRefresh().refresh(true);
                    });
                    
                }
              },
              up : {
                // auto: true, //可选,默认false.首次加载自动上拉加载一次
                callback : function(){
                    console.log('上拉触发了');

                    //模拟上拉结束
                    // setTimeout(function(){
                    //     // 结束上拉刷新
                    //     mui('.pyg_view').pullRefresh().endPullupToRefresh();
                    // },2000)

                    /* 
                    判断是否还有下一页，如果有 QueryObj.pagenum++
                    */
                   if(QueryObj.pagenum >= totalPages){
                       console.log('没有更多数据了');
                       //没有数据了 结束加载更多 ，传入ture,否则传入false
                        mui('.pyg_view').pullRefresh().endPullupToRefresh(true);
                        return;
                   } else{
                        QueryObj.pagenum++;
                        //发送ajax请求
                        search(function(){
                            console.log($('.pyg_view li').length);
                        //等待请求回来 在结束上拉加载
                        mui('.pyg_view').pullRefresh().endPullupToRefresh();
                    });
                   }

                }
              }
            }
          });
    }

    //根据屏幕的宽度动态设置html标签的fontsize
    function setHtmlFontsize(){
        var baseval = 100;
        var pageWidth = 414;
        var screenWidth = document.querySelector("html").offsetWidth;
        var fontsize = baseval * screenWidth / pageWidth;
        document.querySelector("html").style.fontSize = fontsize+"px";
    }
    //屏幕大小发生变化时,重新加载
    onresize = function(){
        setHtmlFontsize();
    }




    function search(callback){
        $.get("goods/search",QueryObj,function(res){
            console.log(res);
            // console.log(res.data);

            //计算出总页数 = 数据总条数/每页显示的数据条数  向上取整
            totalPages = Math.ceil(res.data.total / QueryObj.pagesize);
            console.log(totalPages);

            var html = template("tempList",{data:res.data.goods});
            // console.log(html);
            //为了加载下一页，用append(),数据加在原来数据最后一项的后面，用html()会把全来的覆盖
            $(".goods_info").append(html);

            callback && callback();
        })
    }

    //MUI插件阻止了a标签的默认行为，需要用js手动设置跳转链接
    function eventLink(){
        //需用委托的方式注册事件
        $(".pyg_view").on("tap","a",function(){
            //获取a标签上的url
            var href = this.href;
            console.log(href);
            //跳转页面
            location.href = href;
        })
    }
})