var $lbtSlider = function(p,opening){
	var T = this;
	this.createElement = function(element){
		return document.createElement(element);
	};
	this.timer;
	this.setTimer = function(timer){
		this.timer = timer;
	};
	this.getTimer = function(timer){
		return this.timer || null;
	}
    /**
     * 幻灯片
     * @type {*}
     */
	this.$SD = $.extend(true,{},{
		path:"/",
		className:"",
		id:new Date().getTime(),
		bigId:undefined,
		appendId:undefined,//追加的容器id
		onFunction:undefined,
		showNext:false,
		showPrev:false,
		showGroup:false,
		showNum:1,//显示多少个
		showIndex:0,//现在显示的下标
		width:0,
		height:0,
		margin:0,
		padding:0,
		style:0,//可有一个以上数字组成，第一个（横向0/纵向1）；第二个（定时1不定时0）；第三个（以一个0一组1）；第四个（非动画0动画1）；之后表示定时时间（毫秒）
		animstyle:'041000',//动画属性，//第一个（移上移下停止或开始动画：否0/是1）；第二个（动画方向，1：往上，2：往右，3，往下，4：往左）；之后表示执行动画速度（毫秒）
		size:0,//图片集合大小
		other:0,//不是图片信息，而是内容信息
		sItems:[],//小图片集合
		mItems:[],//中图片集合
		bItems:[],//大图片集合
		
		//////////// 内定变量 /////////////
		allDiv:null,
		prevDiv:null,
		nextDiv:null,
		centDiv:null,
		clearDiv:null,
		isFirst:true,
		
		fn:{
			_style:{
				M:1,// 设置鼠标移上移下停止/启动动画 ，由animstyle指定
				F:4,// 根据动画方向不同，添加到容器的方式也不同 ，由animstyle指定
				H:true,// 设置图片属性：是否横向，由style指定
				D:false,// 设置图片属性：是否定时，由style指定
				G:true,// 设置图片属性：是否单个出现，由style指定
				A:false,// 设置图片属性：是否动画，由style指定
				T:1000,// 设置图片定时器属性，由style指定
				AT:1000// 设置动画时间 ，由animstyle指定
			},
		    init:function(){
				Function()
				{
					if(T.$SD.animstyle){
						var s = T.$SD.animstyle;
						if(s.length>0)
							T.$SD.fn._style.M = s.toString().substring(0,1);
						if(s.length>1)
							T.$SD.fn._style.F = s.toString().substring(1,2);
						if(s.length>2)
							T.$SD.fn._style.AT = new Number(s.toString().substring(2));
					}
					if(T.$SD.style){
						var s = T.$SD.style;
						if(s.length>0)
							T.$SD.fn._style.H = "0"==s.toString().substring(0,1);
						if(s.length>1)
							T.$SD.fn._style.D = "1"==s.toString().substring(1,2);
						if(s.length>2)
							T.$SD.fn._style.G = "0"==s.toString().substring(2,3);
						if(s.length>3)
							T.$SD.fn._style.A = "1"==s.toString().substring(3,4);
						if(s.length>4)
							T.$SD.fn._style.T = new Number(s.toString().substring(4));
					}
					
					if(T.$SD.fn._style.D){
						T.setTimer(setTimeout(function(){T.$SD.fn.doTimer();}, T.$SD.fn._style.T));
					}
				};
				var PNw = 0;//10;//上下张图片所占的位置大小
				var pW = 0;
				var pm = T.$SD.margin+T.$SD.padding;
				if(T.$SD.showPrev)pW = PNw+2*T.$SD.margin;
				if(T.$SD.showNext)pW = 2*pW;
				
				T.$SD.allDiv = T.createElement("div");
				T.$SD.allDiv.className = "slide_all_center_lbt " + T.$SD.className;
				T.$SD.allDiv.style.cssText = "overflow: hidden;margin:0;padding:0;position:relative;" +
					(T.$SD.fn._style.H?"height:"+(T.$SD.height+pm)+"px;":"") +
					"width:"+(T.$SD.fn._style.H?(T.$SD.width+2*(pm))*T.$SD.showNum+pW:T.$SD.width+pm)+"px";
				
				T.$SD.prevDiv = jQuery("<div style=\""+(T.$SD.fn._style.H?"":"")+"cursor: pointer;margin: "+T.$SD.margin+"px;position: absolute;top: 40%;left: 0;z-index: 5;width: 10px;height: 45px;background: url('../image/left_btn.gif') no-repeat;\" " +
											"class=\"slide_prev_"+T.$SD.className+"\" " +
											"title=\"上一张\">" +
									    "</div>")[0];
				T.$SD.prevDiv.onclick = function(event){
					T.$SD.fn.prev(this,event);
				}
				
				T.$SD.centDiv = jQuery("<div class=\"slide_img_all_"+T.$SD.className+"\"></div> ")[0];
				T.$SD.centDiv.style.cssText =(T.$SD.fn._style.H?"float: left;":"") +
					(T.$SD.fn._style.H?"height:"+(T.$SD.height+pm)+"px;":"") +
					"width:"+(T.$SD.fn._style.H?(T.$SD.width+2*(pm))*T.$SD.showNum:T.$SD.width+pm)+"px";
				
				T.$SD.fn._setImgHtml($(T.$SD.centDiv), T.$SD.sItems, T.$SD.showIndex, T.$SD.showNum-1);
				
				
				T.$SD.nextDiv = jQuery("<div style=\""+(T.$SD.fn._style.H?"":"")+"cursor: pointer;margin: "+T.$SD.margin+"px;position: absolute;top: 40%;right: 0;z-index: 5;width: 10px;height: 45px;background: url('../image/right_btn.gif') no-repeat;\" " +
											"class=\"slide_next_"+T.$SD.className+"\" " +
											"title=\"下一张\">" +
										"</div>")[0];
				T.$SD.nextDiv.onclick = function(event){
					T.$SD.fn.next(this,event);
				}
								
				if(T.$SD.appendId){
					document.getElementById(T.$SD.appendId).appendChild(T.$SD.allDiv);
				}else{
					document.body.appendChild(T.$SD.allDiv);
				}
				
				var m = T.$SD.height+pm;
				var ph = $(T.$SD.prevDiv).height();
				var th = (m - ph)/2/m*100;
				if(T.$SD.showPrev){
					$(T.$SD.prevDiv).css({'top':th+"%"});
					T.$SD.allDiv.appendChild(T.$SD.prevDiv);
				}
				T.$SD.allDiv.appendChild(T.$SD.centDiv);
				if(T.$SD.showNext){
					$(T.$SD.nextDiv).css({'top':th+"%"});
					T.$SD.allDiv.appendChild(T.$SD.nextDiv);
				}
				if(T.$SD.fn._style.H || T.$SD.fn._style.A){
					T.$SD.clearDiv = jQuery("<div style=\"clear: both;\"></div>")[0];
					T.$SD.allDiv.appendChild(T.$SD.clearDiv);
				}
		    },
			next:function(r){
		    	if(T.$SD.fn._style.G){
					var next = $(T.$SD.centDiv);
					var show_index = new Number(T.$SD.showIndex);
					var show_num = new Number(T.$SD.showNum);
					var items_size = new Number(T.$SD.size);
					var array = T.$SD.sItems;
					if ((show_index + show_num) <= (items_size - 1)) {
						T.$SD.fn._setImgHtml(next, array, show_index + 1, show_index + show_num);
					}
		    	}else{
		    		T.$SD.fn.nextGroup(r);
		    	}
			},
			prev:function(r) {
				if(T.$SD.fn._style.G){
					var prev = $(T.$SD.centDiv);
					var show_index = new Number(T.$SD.showIndex);
					var show_num = new Number(T.$SD.showNum);
					var items_size = new Number(T.$SD.size);
					var array = T.$SD.sItems;
					if (show_index > 0) {
						var start = show_index - 1;
						var end = show_index + show_num - 2;
						T.$SD.fn._setImgHtml(prev, array, start, (end < items_size ? end : items_size - 1));
					}
				}else{
					T.$SD.fn.prevGroup(r);
				}
			},
			nextGroup:function(r) {
				var next = $(T.$SD.centDiv);
				var show_index = new Number(T.$SD.showIndex);
				var show_num = new Number(T.$SD.showNum);
				var items_size = new Number(T.$SD.size);
				var array = T.$SD.sItems;
				if ((show_index + show_num) <= (items_size - 1)) {
					var html = "";
					var start = show_index + show_num;
					var end = start + show_num - 1;
					T.$SD.fn._setImgHtml(next, array, start, (end < items_size ? end : items_size - 1));
				}
			},
			prevGroup:function(r) {
				var prev = $(T.$SD.centDiv);
				var show_index = new Number(T.$SD.showIndex);
				var show_num = new Number(T.$SD.showNum);
				var items_size = new Number(T.$SD.size);
				var array = T.$SD.sItems;
				if (show_index > 0) {
					var html = "";
					var start = show_index - show_num;
					start = start <= 0 ? 0 : start;
					var end = start + show_num - 1;
					T.$SD.fn._setImgHtml(prev, array, start, end);
				}
			},
			_setImgHtml:function($div, array, start, end) {
				var big_id = T.$SD.bigId;
				big_id = big_id == undefined ? "" : big_id;
				var onFunction = T.$SD.onFunction;
				onFunction = onFunction == undefined ? null : onFunction;
				var list = T.$SD.bItems;
				var _W = undefined; 
				var _H = undefined;
				var _NW = undefined;
				var _NH = undefined;
				var I = 1;
				var J = 2;
				if((T.$SD.showPrev || T.$SD.showNext)&&T.$SD.isFirst){
					I = 0;
					J = 1;
				}
				if(T.$SD.fn._style.G){
					_W = (T.$SD.showNum+I)*T.$SD.width;
					_H = (T.$SD.showNum+I)*T.$SD.height;
					_NW = (T.$SD.isFirst && start == 0) ? 0 : T.$SD.width;
					_NH = (T.$SD.isFirst && start == 0) ? 0 : T.$SD.height;
				}else{
					_W = T.$SD.showNum*T.$SD.width*J;
					_H = T.$SD.showNum*T.$SD.height*J;
					_NW = (T.$SD.isFirst && start == 0) ? 0 : T.$SD.showNum*T.$SD.width ;
					_NH = (T.$SD.isFirst && start == 0) ? 0 : T.$SD.showNum*T.$SD.height ;
				}
				if(!T.$SD.fn._style.A){
					$div.empty();
				}else{
					if(T.$SD.fn._style.H){
						$div.width(_W);
					}else{
						$div.height(_H);
						$(T.$SD.allDiv).height((T.$SD.height+2*(T.$SD.margin+T.$SD.padding))*T.$SD.showNum);
					}
					
				}
				var fw = 0;// 前置图片
				var fh = 0;// 顶置图片
				for ( var i = start; i <= end; i++) {
					var new_path = T.$SD.path + $.trim(array[i]);
					var alt = new_path.substring(new_path.toString().lastIndexOf("/") + 1)
					var h = jQuery("<div index=\""+i+"\" class=\"slide_img_div_"+T.$SD.className+"\" " 
							+ "style=\"margin: "+T.$SD.margin+"px;padding: "+T.$SD.padding+"px;width: "+T.$SD.width+"px;height: "+T.$SD.height+"px;"+(T.$SD.fn._style.H?"float: left;":"")+"cursor: pointer;\" >"
							+ (T.$SD.other == 1 ? array[i] : "<img width=\""+T.$SD.width+"\" height=\""+T.$SD.height+"\" alt=\"" + alt + "\" src=\"" + new_path + "\"/>" )
							+ "</div>")[0];
					
					/**
					 *  点击图片方法
					 * @memberOf {TypeName} 
					 */
					h.onclick = function(){
						T.$SD.fn._onclick(this,T,big_id,onFunction);
					}
					/**
					 *  设置鼠标移上移下停止/启动动画
					 */
					if(T.$SD.fn._style.D && T.$SD.fn._style.M == 1){
						h.onmouseover = function(){
							if (T.getTimer() !== null) {
								clearTimeout(T.getTimer());
								T.setTimer(null);
							}
						};
						h.onmouseout = function(){
							T.setTimer(setTimeout(function(){T.$SD.fn.doTimer();}, T.$SD.fn._style.T));
						}
						
					}
					/**
					 *  根据动画方向不同，添加到容器的方式也不同
					 */
					if(T.$SD.fn._style.F == 2 || T.$SD.fn._style.F == 3){
						if(T.$SD.fn._style.H){
							fw += T.$SD.width;
							if(!T.$SD.isFirst)$div.css({left:-fw});
						}else{
							fh += T.$SD.height;
							if(!T.$SD.isFirst)$div.css({top:-fh});
						}
						$div.prepend(h);
					}else{
						$div.append(h);
					}
				}
				/**
				 *  设置动画
				 */
				if(T.$SD.fn._style.A){
					if(T.$SD.fn._style.H && (T.$SD.fn._style.F == 2 || T.$SD.fn._style.F == 4)){
						_NW = (T.$SD.fn._style.F == 4 ? -_NW : 0);
						$div.css({position:'relative'})
							.animate({left:_NW},T.$SD.fn._style.AT,function(){
								T.$SD.fn._AfterAnimate($div);
							});
					}else if(T.$SD.fn._style.F == 1 || T.$SD.fn._style.F == 3){
						_NH = (T.$SD.fn._style.F == 1 ? -_NH : 0);
						$div.css({position:'relative'})
							.animate({top:_NH},T.$SD.fn._style.AT,function(){
								T.$SD.fn._AfterAnimate($div);
							});
					}
				}
				T.$SD.showIndex = start;
				T.$SD.isFirst = false;
			},
			/**
			 *  设置定时器
			 */
			doTimer:function(){
				var start = T.$SD.showIndex;
				var end = T.$SD.showIndex + T.$SD.showNum;
				if (end <= T.$SD.size - 1) {
					if(T.$SD.fn._style.G){
						start ++;
					}else{
						start += T.$SD.showNum;
						end += T.$SD.showNum - 1;
					}
				}else{
					start = T.$SD.showIndex = 0;
					end = T.$SD.showIndex + T.$SD.showNum - 1;
				}
				end = end >= T.$SD.size ? T.$SD.size - 1 : end;
				T.$SD.fn._setImgHtml($(T.$SD.centDiv), T.$SD.sItems, start, end);
				
				T.setTimer(setTimeout(function(){T.$SD.fn.doTimer();}, T.$SD.fn._style.T));
			},
			/**
			 *  点击小图执行的方法
			 * @param {Object} r
			 * @param {Object} path
			 * @param {Object} fun 用户自定义方法，可以不传，否则必须带有三个参数，1：点击的当前对象this,2：$lbtSlider对象，3：图片路径
			 * @memberOf {TypeName} 
			 * @return {TypeName} fun 为空或者不是functions时，返回图片路径
			 */
			_onclick:function(r,t,id,fun) {
				var src = t.$SD.path + t.$SD.bItems[$(r).attr("index")];
				if(id != undefined && id != ""){
					$("#"+id).attr("src",src);
				}
				if($.isFunction(fun)){
					return fun.call(this,r,t,src);
				}
				return src;
			},
			/**
			 *  动画结束调用
			 * @param {Object} $div
			 */
			_AfterAnimate:function($div){
				var _ALL = $("[class^=slide_img_div_]",$div);
				var size = _ALL.size();
				if(size>T.$SD.showNum){
					if(T.$SD.fn._style.F == 2 || T.$SD.fn._style.F == 3){
						$("[class^=slide_img_div_]:gt("+(size-T.$SD.showNum-1)+")",$div).remove();
					}else{
						$("[class^=slide_img_div_]:lt("+(size-T.$SD.showNum)+")",$div).remove();
						if(T.$SD.fn._style.H)$div.css({left:0})
						else $div.css({top:0})
					}
					/*if(T.$SD.showPrev || T.$SD.showNext){
						$div.width($div.width()/2);
					}*/
				}
			},
			/**
			 *  重组图片集合
			 * @param {Object} items
			 * @param {Object} showNum
			 * @return {TypeName} 
			 */
			CzI:function(items,showNum){
				var gbs = T.$SD.fn.GBS(items.length,showNum);
				var array = new Array();
				var size = items.length > showNum ? items.length : showNum;
				for(var i=0;i<gbs/size;i++){
					array = array.concat(items);
				}
				return array;
			},
			/**
			 *  求N和M的最小公倍数
			 * @param {Object} N
			 * @param {Object} M
			 * @return {TypeName} 
			 */
			GBS:function(N,M){
				for(var i=1;i<=N*M;i++){
					var N1 = N*i;
					if(N1%M==0){
						return N1;
					}
				}
			}
		}
	},p);

    /**
     * 跑马灯
     */
    this.$LEDAnimalModule = function(){
        this.size = 0;//总数量
        this.showNum = 1,//显示多少个
        this.height = 35;//单个高度
        this.pid = "slide_context_all_";
        this.child_class = "[class*=running_children]";
        this.speed = 30;//执行速度
        this.down_top = undefined;
        this.up_top = undefined;
        this.timer;

        this.isNull = function(taget){
            return (taget == undefined || taget == null || taget == '');
        };
        this.init = function(size,showNum,height,speed,pid,child_class){
            if(!this.isNull(size))this.size = size;
            if(!this.isNull(showNum))this.showNum = showNum;
            if(!this.isNull(height))this.height = height;
            if(!this.isNull(pid))this.pid = pid;
            if(!this.isNull(child_class))this.child_class = child_class;
            if(!this.isNull(speed))this.speed = speed;

            try{
                var liDom = $("#"+this.pid+" " + this.child_class)[0];
                if(!this.isNull(liDom)){
                    this.height = liDom.offsetHeight;
                }
            }catch (e){
                console.error(e);
            }
            return this;
        }
        this.setTimer = function(timer){
            this.timer = timer;
        };
        this.getTimer = function(){
            return this.timer || null;
        }

        /**
         *  求N和M的最小公倍数
         * @param {Object} N
         * @param {Object} M
         * @return {TypeName}
         */
        this.GBS = function(N,M){
            for(var i=1;i<=N*M;i++){
                var N1 = N*i;
                if(N1%M==0){
                    return N1;
                }
            }
        }

        this.start = function(is_down){
            var self = this;
            if(self.size<=0)return;

            if(is_down==true){
                self.animal_down();
            }else{
                self.animal_up();
            }
            /*setInterval(self.getTimer(),self.speed);*/
            return this;
        }

        this.stop = function(){
            var self = this;
            clearInterval(self.getTimer());
            return this;
        }

        this.animal_down = function(){
            var self = this;

            var _Dom = $("#"+self.pid);
            if(self.size==self.showNum){
                _Dom.prepend($(self.child_class,_Dom).clone(true));
                self.size = self.size*2;
            }else if(self.size < self.showNum){
                var gbs = self.GBS(self.size,self.showNum);
                if(gbs==self.showNum) gbs = self.showNum * 2;
                var _chils = $(self.child_class,_Dom);
                if(self.isNull(_chils)||_chils.size()<=0)return this;
                var j=0;
                for(var i = 0; i < (gbs - _chils.size()); i ++){
                    _Dom.prepend(_chils.eq(j).clone(true));
                    j++;
                    if(j>=_chils.size())j=0;
                }
                /*var _clone = $(self.child_class,_Dom).clone(true);
                for(var i = 0 ;i < (gbs/self.size-1);i++){
                    _Dom.prepend(_clone);
                }*/
                self.size = gbs;
            }

            if(self.isNull(self.down_top)){
                self.down_top = -((self.size-self.showNum)*self.height);
                self.init_top = self.down_top;
            }
            _Dom.css({top:self.down_top});

            self.setTimer(
                setInterval(function(){
                    if(self.down_top>=0){
                        /**将前排后置到后排*/
                        var _befor_copy = $(self.child_class+':gt('+(self.showNum-1)+')',_Dom);/**此处减一*/
                        var _copy = _befor_copy.clone(true);
                        _befor_copy.remove();
                        _Dom.prepend(_copy);/**前置*/
                        self.down_top = self.init_top;
                    }
                    ++self.down_top;
                    _Dom.css({top:self.down_top});
                },self.speed)
            );

            return this;
        }

        this.animal_up = function(){
            var self = this;

            if(self.isNull(self.up_top)){
                self.up_top = 0;
            }
            var _Dom = $("#"+self.pid);
            if(self.size==self.showNum){
                _Dom.append($(self.child_class,_Dom).clone(true));
                self.size = self.size*2;
            }else if(self.size<self.showNum){
                var gbs = self.GBS(self.size,self.showNum);
                if(gbs==self.showNum) gbs = self.showNum * 2;
                var _chils = $(self.child_class,_Dom);
                if(self.isNull(_chils)||_chils.size()<=0)return this;
                var j=0;
                for(var i = 0; i < (gbs - _chils.size()); i ++){
                    _Dom.append(_chils.eq(j));
                    j++;
                    if(j>=_chils.size())j=0;
                }
                /*var _clone = $(self.child_class,_Dom).clone(true);
                for(var i = 0 ;i<(gbs/self.size-1);i++){
                    _Dom.append(_clone);
                }
                */
                self.size = gbs;
            }
            self.setTimer(
                setInterval(function(){
                    if(self.up_top<=(-((self.size-self.showNum)*self.height))){
                        /**将前排后置到后排*/
                        var _befor_copy = $(self.child_class+':lt('+(self.size-self.showNum)+')',_Dom);
                        var _copy = _befor_copy.clone(true);
                        _befor_copy.remove();
                        _Dom.append(_copy);/**后置*/
                        self.up_top = 0;
                    }
                    --self.up_top;
                    _Dom.css({top:self.up_top});
                },self.speed)
            );

            return this;
        }
    }
	/**
	 *  初始化对象需要的值
	 */
	Function:{
		this.setTimer(null);
		T.$SD.showIndex = new Number(T.$SD.showIndex);
		T.$SD.showNum = new Number(T.$SD.showNum);
		T.$SD.size = new Number(T.$SD.sItems.length);
		if(T.$SD.sItems){
			T.$SD.sItems = T.$SD.fn.CzI(T.$SD.sItems,T.$SD.showNum);
			T.$SD.size = new Number(T.$SD.sItems.length);
		}
		if(T.$SD.mItems){
			T.$SD.mItems = T.$SD.fn.CzI(T.$SD.mItems,T.$SD.showNum);
		}
		if(T.$SD.bItems){
			T.$SD.bItems = T.$SD.fn.CzI(T.$SD.bItems,T.$SD.showNum);
		}
		if(opening){
			T.$SD.fn.init();
		}
	}
}

