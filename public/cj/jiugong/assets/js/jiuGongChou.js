$(function(){
    creatUc();
    setArc();

    //设置字体
    function creatUc(){
        var uc = window.uc = {};
/*        uc.getWinHeight = function () {
            return document.body.clientHeight;
        }*/
        uc.getWinWidth = function () {
            return document.body.clientWidth;
        }
        var winWidth =  uc.getWinWidth();
        if (winWidth < 640) {
            $('html').css('font-size', (winWidth / 32) + 'px');
        } else {
            $('html').css('font-size', '20px');
        }
    }

    //设置弧形文字 做兼容
    function setArc(){
        $("#arcText1").arctext({radius: 580});
        $("#arcText2").arctext({radius: 550});
        var a = uc.getWinWidth()/375;
        $("#arcTextWrap").css({
            '-webkit-transform':'scale('+a+','+a+')',
            '-ms-transform':'scale('+a+','+a+')',
            'transform':'scale('+a+','+a+')'
        })
    }

    //以下为抽奖
    var lottery={
        index:-1,    //当前转动到哪个位置，起点位置
        count:0,    //总共有多少个位置
        timer:0,    //setTimeout的ID，用clearTimeout清除
        speed:20,    //初始转动速度
        times:0,    //转动次数
        cycle:50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
        prize:-1,    //中奖位置
        init:function(id){
            if ($("#"+id).find(".lottery-unit").length>0) {
                $lottery = $("#"+id);
                $units = $lottery.find(".lottery-unit");
                this.obj = $lottery;
                this.count = $units.length;
                $lottery.find(".lottery-unit-"+this.index).addClass("active");
            };
        },
        roll:function(){
            var index = this.index;
            var count = this.count;
            var lottery = this.obj;
            $(lottery).find(".lottery-unit-"+index).removeClass("active");
            index += 1;
            if (index>count-1) {
                index = 0;
            };
            $(lottery).find(".lottery-unit-"+index).addClass("active");
            this.index=index;
            return false;
        },
        stop:function(index){
            this.prize=index;
            return false;
        }
    };
    function roll(){
        lottery.times += 1;
        lottery.roll();//转动过程调用的是lottery的roll方法，这里是第一次调用初始化
        if (lottery.times > lottery.cycle+10 && lottery.prize==lottery.index) {
            //结束
            console.log('end');
            console.log(lottery);
            //显示id = cover1 的1弹出框
            showCover(1);
            clearTimeout(lottery.timer);
            lottery.prize=-1;
            lottery.times=0;
            click=false;
        }else{
            if (lottery.times<lottery.cycle) {
                lottery.speed -= 10;
            }else if(lottery.times==lottery.cycle) {
                //*********中奖物品通过一个随机数生成**********
                var index = Math.random()*(lottery.count)|0;
                lottery.prize = index;
            }else{
                if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
                    lottery.speed += 110;
                }else{
                    lottery.speed += 20;
                }
            }
            if (lottery.speed<40) {
                lottery.speed=40;
            };
            console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
            lottery.timer = setTimeout(roll,lottery.speed);//循环调用
        }
        return false;
    }

    /**
     * 显示弹出框
     * @param id
     */
    function showCover(id){
        $("#cover"+id).fadeIn(200);
    }
    /**
     * 关闭弹出框
     */
    $(".cover .close").click(function(){
        $(this).closest(".cover").fadeOut(200)
    })

    var click=false;
    lottery.init('lottery');
    $("#startClick").click(function(){
        if (click) {//click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
            return false;
        }else{
            lottery.speed=100;
            roll();    //转圈过程不响应click事件，会将click置为false
            click=true; //一次抽奖完成后，设置click为true，可继续抽奖
            return false;
        }
    });




    //*****************************滚动****************
    //	size 是数据长度；
    var size = 10;
    var showNum = 50;
    if($("#slider li").length>0){
        var height = $("#slider li")[0].offsetHeight;
        var SD = new (new $lbtSlider()).$LEDAnimalModule();
        SD.init(size, showNum, height, 50, 'slider', 'li').start(true);
    }
    //*****************************滚动****************



});