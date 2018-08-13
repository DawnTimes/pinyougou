$(function(){
    // http://api.pyg.ak48.xyz/ + api/public/v1/ +  home/swiperdata
    var baseUrl = "http://api.pyg.ak48.xyz/";
    var baseUrl2 = "api/public/v1/";

    //导入模板变量
    template.defaults.imports.tmpBaseUrl = baseUrl;


    // 修改接口的使用方式
    // 拦截器
    // 在每一次发送请求 之前对请求做一些处理 
    // 发送请求之前,提前对于 接口的url进行处理 
    // var oobj={};
    // $.ajax(oobj);


    /* 
    发送请求之前，显示遮罩层和等待加载样式
    最后一个请求数据回来后，隐藏遮罩层和等待加载样式
    */
    
    //发送请求的个数
    var ajaxNums = 0;

    $.ajaxSettings.beforeSend = function(xhl,obj){
        obj.url = baseUrl + baseUrl2 + obj.url;
        // console.log(obj.url);

        //发送一次请求，数量加1
        ajaxNums++;
        $("body").addClass("wait");
    }

    //请求返回来之后
    $.ajaxSettings.complete = function(){
        //如：发送3个请求，需要等3个请求全部回来了，再隐藏
        console.log('请求回来了');
        ajaxNums--;
        if(ajaxNums == 0){
            //最后一个请求回来了
            $("body").removeClass("wait");
        }
    }


    // 拓展zepto-> 给$对象添加自定义的属性或者方法,可以全局调用
    $.extend($,{
        // 根据url上的key来获取值
        getUrlValue:function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        //验证手机号码合法性
        checkPhone: function (phone) {
            if (!(/^1[34578]\d{9}$/.test(phone))) {
              return false;
            } else {
              return true;
            }
          },
          //验证邮箱的合法性
          checkEmail:function (myemail) {　　
            var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
            if (myReg.test(myemail)) {　　　　
                return true;　　
            } else {　　　　
                return false;
            }
        }
    })
})