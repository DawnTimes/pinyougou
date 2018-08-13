$(function(){
    init();
    function init(){
        getDetailData();

        
    }

    function getDetailData(){
        $.get("goods/detail",{
            goods_id:$.getUrlValue("goods_id")
        },function(res){
            console.log(res);
            var html = template("tempDetail",{data:res.data});
            $(".pyg_view").html(html);

            //获得slider插件对象
            var gallery = mui('.mui-slider');
            gallery.slider({
            interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
        });

        })
    }
})