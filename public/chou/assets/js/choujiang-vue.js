
$(function(){


    var vm = new Vue({
        el: '#mainwrap',
        data: {
            showItem:{}
        },
        computed:{
            //员工
            staffs: function(){
                var temp = [];
                for(var i = 0;i < 60;i++){
                    var person = {
                        name: '英雄' + i,
                        id: 'id' + i
                    }
                    var ran = Math.random();
                    person.src = ran > 0.5 ? 'assets/img/boy.jpg' : 'assets/img/girl.jpg';
                    temp.push(person)
                }
                return temp;
            },
            screen: function(){
                var temp = {};
                temp.w = window.innerWidth || document.documentElement.clientWidth  || document.body.clientWidth,
                temp.h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                return temp;
            },
            bigP: function(){
                var temp = {};
                temp.left = (this.screen.w - 600) / 2;
                temp.top = 180;
                return temp
            }
        },
        methods: {
            creatShowItem: function(){
                var self = this;
                var i = parseInt(Math.random() * self.staffs.length);
                return self.staffs[i]
            }
        },
        watch: {
            showItem: function (item) {
                var $focuseName = $("#focusName");
                var $focuseImg = $("#focusImg");
                var $showItem = $("#"+item.id);
                var w = $showItem.width();
                var h = $showItem.height();
                var posX = $showItem.offset().left;
                var posY = $showItem.offset().top;
                var scaleX = w/600;
                var scaleY = h/750;
                var transX = this.bigP.left-posX;
                var transY = this.bigP.top-posY;

                $focuseImg.css({
                    'transform':'scale('+scaleX+','+scaleY+')'

                });

            }
        },
        created: function(){
            var self = this;
            self.showItem = self.creatShowItem();
            setInterval(function(){
                self.showItem = self.creatShowItem();
                console.log(self.showItem.name)
            },4000)
        }
    })



})



