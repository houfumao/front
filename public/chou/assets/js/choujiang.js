$(function(){

    var winW = $(window).width();
    var winH = $(window).height();
    //计算变大后位置：这里以大图宽600，高750计算；
    var bigLeft = (winW-600)/2;
    var bigTop = 180;//大图距离顶部写死180


    //大图内容
    var $focuseName = $("#focusName");
    var $focuseImg = $("#focusImg");

    var interval = setInterval(function(){
        var num = parseInt(Math.random()*10);
        showBigImg(num)
    },4000);

    function showBigImg(id){
        var $showItem = $("#id"+id);
        var src = $showItem.find('img').attr('src');
        var name = $showItem.find('.name').text();
        var w = $showItem.width();
        var h = $showItem.height();
        //比例
        var posX = $showItem.offset().left;
        var posY = $showItem.offset().top;
        var transX = bigLeft-posX;
        var transY = bigTop-posY;
        $focuseName.text(name);
        $focuseImg.attr('src',src);
        $focuseImg.css({
            'width': w + 'px',
            'height': h + 'px',
            'left': posX + 'px',
            'top': posY + 'px'
        });
        $focuseName.addClass('show');
        $focuseImg.fadeIn(200).css({
            '-webkit-transform': 'translate('+transX+'px,'+transY+'px)',
            'transform': 'translate('+transX+'px,'+transY+'px)',
            'transition': 'all 1s',
            'width': 600 + 'px',
            'height': 750 + 'px'
        })

        setTimeout(function(){

            $focuseImg.css({
                'transition': 'none'
            }).fadeOut(500,function(){
                $focuseImg.css({
                    '-webkit-transform': 'none',
                    'transform': 'none',
                })
                $focuseName.removeClass('show');
            })
        },3000)
    }

});