$(function(){
    init();

    //设置全局变量
    var lis = [];
    var myScroll;
    var index=0;
    var tmpData;

    function init(){
        setHtmlFontsize();
        getCategoriesData();
        
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

    //发送请求获取数据
    function getCategoriesData() {
        $.get("categories",function(res){
            // console.log(res);
            // console.log(res.data);
            tmpData = res.data;

            //渲染左边的菜单
            var html = template("tempMenu",{data:res.data});
            $(".cat_menu").html(html);

            //获取li元素
            lis = document.querySelectorAll('.cat_menu li');
            // console.log(lis);

            //默认给第一个li添加一个样式
            $(".cat_menu li:nth-child(1)").addClass("active");

            //开始加载页面的时候，右边渲染显示第0 项数据
            renderData(0);

            myScroll = new IScroll('.pv_left',{
                //是否开启鼠标滚轮支持
                mouseWheel: true,
                //是否开启滚动条支持
                // scrollbars: true
            });


            //滚动条
            // iScroll();

            eventList();

            
        })
    }

    //滚动条初始化
    // function iScroll(){
    //     myScroll = new IScroll('.pv_left',{
    //         //是否开启鼠标滚轮支持
    //         mouseWheel: true,
    //         //是否开启滚动条支持
    //         // scrollbars: true
    //     });

    // }

    //点击左侧菜单事件
    function eventList(){
        //动态生成的元素，用委托的方式注册事件
        $(".cat_menu").on("tap",'li',function(e){
            // console.log(e);
            //获取当前点击的li
            var liDom = e.target;
    
            //获取当前点击的li的index
            //JQ的方法
            // index = $(this).data("index");

            //原生的方法,this是DOM对象, dom.dataset.属性名  获取自定义属性的值
            index = this.dataset.index;
            // console.log(index);
    
            //添加插件的方法，让当前li滚动到左上角
            myScroll.scrollToElement(liDom);
    
            //给当前点击的li添加样式
            // addActive(liDom);

            //用JQ的方法给当前点击的li添加样式
            $(this).addClass("active").siblings().removeClass("active");
            
            //点击当前的li，右边渲染对应的数据
            renderData(index);
        })
            
    }

    // 右侧渲染数据
    function renderData(index){
        var arr = tmpData[index].children;
        // console.log(arr);

        var html2 = template("tempRight",{arr:arr});
        $(".pv_right").html(html2);

        //给右侧内容也添加滚动效果
        /* 
        标签加载完了，图片不一定加载完，图片没加载完，就没有高度，初始化滚动没有效果
        需要等最后一张图片加载完的时候再初始化
        */
       //获取有多少张图片
       var lengths = $(".pv_right img").length;
        console.log(lengths);

        /* 
        $(selector).load(function)
            当指定的元素（及子元素）已加载时，会发生 load() 事件。
            该事件适用于任何带有 URL 的元素（比如图像、脚本、框架、内联框架）。
            根据不同的浏览器（Firefox 和 IE），如果图像已被缓存，则也许不会触发 load 事件。
            function	必需。规定当指定元素加载完成时运行的函数。
        */
        $(".pv_right img").on("load",function(){
            lengths--;
            if(lengths == 0){
                console.log('图片加载完了');
                var RightIScroll = new IScroll('.pv_right',{
                    //是否开启鼠标滚轮支持
                    mouseWheel: true,
                    // 是否开启滚动条支持
                     scrollbars: true
                });
            }
        })
        
    }


    function addActive(dom){
        for (var i = 0; i < lis.length; i++) {
            lis[i].classList.remove("active");
            // lis[i].style.className = "";
        }
        dom.classList.add("active");
        // dom.style.className = "active";
    }
})
