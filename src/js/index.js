$(function(){
    init();

    function init(){
        getSwiperData();
        getCatItems();
        getGoodsLit();
    }

    // 获取轮播图数据
    function getSwiperData(){
        $.get("home/swiperdata",function(res){
            // console.log(res);
            // console.log(res.data);
            var html = template("tempSlide",{data:res.data});
            $('.mui-slider').html(html);

            //获得slider插件对象
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
            });
        })
    }

    // 获取首页分类菜单数据
    function getCatItems(){
        $.get("home/catitems",function(res){
            // console.log(res);
            // console.log(res.data);

            var html = template("tempNav",{data:res.data});
            $(".index_nav").html(html);
        })
    }

    //获取商品列表数据
    function getGoodsLit(){
        $.get("home/goodslist",function(res){
            // console.log(res);
            console.log(res.data);

            var html = template("tempGoddsList",{data:res.data});
            $(".index_goodslist").html(html);
        })
    }
})