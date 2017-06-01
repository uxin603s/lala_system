function canvas_whxy(whxys,width,height,scale,callback){
	this.scale=scale;
	this.whxys=whxys;
	this.callback=callback;
	this.canvas=document.createElement("canvas");
	this.canvas.width=width;//1200;
	this.canvas.height=height;//630;
	this.tmp_whxys=[];
	this.watch={};
	this.draw_all();
	this.watch_control();
	this.watch_key();//監看鍵盤
	this.shift_scale();//監看shift保持比例縮放
	
	return this;
}

canvas_whxy.prototype.draw_all=function(){
	// var time=Date.now();
	
	let whxys=this.whxys;
	let canvas = this.canvas;
	let scale = this.scale;
	let ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,canvas.width,canvas.height);
	let len=(whxys.length-1)
	var cut={};
	for(let i=len;i>=0;i--){
		let whxy=whxys[i];
		let x=whxy.x*scale >> 0;
		let y=whxy.y*scale >> 0;
		let w=whxy.w*scale >> 0;
		let h=whxy.h*scale >> 0;
		// console.log(whxy.type)
		
		switch(whxy.type){
			case 'image':
				cut.source=whxy.source;
				cut.x=x;
				cut.y=y;
				cut.w=w;
				cut.h=h;
				ctx.drawImage(whxy.source,x,y,w,h)
				break;
			case 'color':
				ctx.fillStyle = whxy.source;
				ctx.fillRect(x, y, w, h)
				break;
			case 'cut':
				// console.log(cut)
				ctx.drawImage(cut.source,(x-cut.x)/scale,(y-cut.y)/scale,w/scale,h/scale,x,y,w,h);//,,cut.y,cut.w,cut.h)
				break;
			default:
				// this.callback && this.callback()
				break;
			
		}
		if(!whxy.lock){
			this.control(whxy,i);
		}
	}
	// console.log((Date.now()-time)/1000)
}

canvas_whxy.prototype.control=function(whxy,i){
	let scale = this.scale;
	let canvas = this.canvas;	
	let ctx = canvas.getContext('2d');
	// ctx.fillStyle="rgb(0,0,0)";
	// ctx.strokeStyle="rgb(123,123,123)";
	ctx.lineWidth=10;
	let x=whxy.x*scale >> 0;
	let y=whxy.y*scale >> 0;
	let w=whxy.w*scale >> 0;
	let h=whxy.h*scale >> 0;
	this.tmp_whxys.unshift({x:x,y:y,w:w,h:h,i:i});
	// console.log(this.watch)
	if(this.watch.i==i){
		let c=this.draw_rect(w,h,ctx.lineWidth)
		ctx.drawImage(c,x,y)
		let wh_len=3;

		wh=50;
		for(let j=0;j<wh_len;j++){
			for(let k=0;k<wh_len;k++){
				if(j==1 && k==1)continue;
				let wh_x=(w)*j/(wh_len-1)-wh/2+x;
				let wh_y=(h)*k/(wh_len-1)-wh/2+y;				
				let c=this.draw_rect(wh,wh,ctx.lineWidth);
				ctx.drawImage(c,wh_x,wh_y)
				this.tmp_whxys.unshift({x:wh_x,y:wh_y,w:wh,h:wh,i:i,wh:{x:j,y:k}});
			}
		}
	}	
}
canvas_whxy.prototype.draw_rect=function (w,h,line){
	var canvas = document.createElement("canvas");
	canvas.width=w
	canvas.height=h
	var ctx = canvas.getContext('2d');
	ctx.fillStyle="rgb(123,123,123)";
	ctx.fillRect(0,0,w,h);
	ctx.globalCompositeOperation="destination-out";
	ctx.fillRect(line,line,w-line*2,h-line*2);
	return canvas
}
canvas_whxy.prototype.shift_scale=function(){
	document.addEventListener("keydown",function(e){
		if(e.keyCode==16 && this.whxys[this.watch.i]){
			if(this.whxys[this.watch.i].lock_scale)return;
			this.whxys[this.watch.i].scale=this.whxys[this.watch.i].w/this.whxys[this.watch.i].h;
		}
	}.bind(this));
	document.addEventListener("keyup",function(e){
		// console.log(e);
		
		if(e.keyCode==16 && this.whxys[this.watch.i]){
			if(this.whxys[this.watch.i].lock_scale)return;
			delete this.whxys[this.watch.i].scale;
		}
	}.bind(this));	
}
canvas_whxy.prototype.watch_control=function(){
	var start=function(e){
		
		var canvas = this.canvas;
		var page={};
		if(e.type=="mousedown"){
			page.x=e.pageX;
			page.y=e.pageY;
		}else if(e.type=="touchstart"){
			page.x=e.touches[0].pageX;
			page.y=e.touches[0].pageY;
		}
		
		var tmp=canvas.getBoundingClientRect()
		// var x=
		// var y=
		// console.log(this.watch,tmp)
		this.watch.x=page.x-(tmp.left+document.body.scrollLeft);
		this.watch.y=page.y-(tmp.top+document.body.scrollTop);
		var scale=this.scale
		
		delete this.watch.i;
		var len=this.tmp_whxys.length
		for(var j=0;j<len;j++){
			var tmp_whxy=this.tmp_whxys[j];
			var x=tmp_whxy.x;//*scale >> 0;
			var y=tmp_whxy.y;//*scale >> 0;
			var w=tmp_whxy.w;//*scale >> 0;
			var h=tmp_whxy.h;//*scale >> 0;
			var i=tmp_whxy.i;
			var wh=tmp_whxy.wh;
			// console.log(this.tmp_whxys,this.watch,tmp_whxy)
			var flag={};
			flag.x=this.watch.x>=x && this.watch.x<=(x+w);
			flag.y=this.watch.y>=y && this.watch.y<=(y+h);
			
			if(flag.x && flag.y){
				if(wh){
					var func=function(whxys,wh,i,plus){
						
						if(whxys[i].scale && (wh.x==1 || wh.y==1)){
							return
						}

						
						// if(whxys[i].y<0){
						// 	whxys[i].y=0;
						// }
						// if((whxys[i].x+whxys[i].w)>()){
						// 	whxys[i].x=(this.canvas.width/this.scale)-whxys[i].w;
						// }
						// if((whxys[i].y+whxys[i].h)>(this.canvas.width/this.scale)){
						// 	whxys[i].y=(this.canvas.width/this.scale)-whxys[i].h;
						// }

						if(wh.x==0){
							if(whxys[i].x+plus.w<0){
								return 
							}
							if(whxys[i].w-plus.w>0){
								whxys[i].x+=plus.w
								whxys[i].w-=plus.w
							}
						}else if(wh.x==2){
							if((whxys[i].x+whxys[i].w+plus.w) > (this.canvas.width/this.scale)){
								return 
							}
							if(whxys[i].w+plus.w>0){
								whxys[i].w+=plus.w
							}
						}
						
						if(wh.y==0){
							if(whxys[i].y+plus.h<0){
								return 
							}
							if(whxys[i].h-plus.h>0){
								whxys[i].y+=plus.h
								whxys[i].h-=plus.h
							}
						}else if(wh.y==2){
							if((whxys[i].y+whxys[i].h+plus.h) > (this.canvas.height/this.scale)){
								return 
							}
							if(whxys[i].h+plus.h>0){
								whxys[i].h+=plus.h
							}
						}
					
						
						var tmp={};
						tmp.w=whxys[i].w;
						tmp.h=whxys[i].h;
						if(whxys[i].scale){
							whxys[i].w=(whxys[i].h*whxys[i].scale) >> 0;
							if(wh.x==0){
								whxys[i].x-=whxys[i].w-tmp.w
							}
						}
					}.bind(this,this.whxys,wh,i)
				}else{
					var func=function(whxys,i,plus){
						whxys[i].x+=plus.w
						whxys[i].y+=plus.h
						
						if(whxys[i].x<0){
							whxys[i].x=0;
						}
						if(whxys[i].y<0){
							whxys[i].y=0;
						}
						if((whxys[i].x+whxys[i].w)>(this.canvas.width/this.scale)){
							whxys[i].x=(this.canvas.width/this.scale)-whxys[i].w;
						}
						if((whxys[i].y+whxys[i].h)>(this.canvas.width/this.scale)){
							whxys[i].y=(this.canvas.width/this.scale)-whxys[i].h;
						}
					}.bind(this,this.whxys,i)
				}
				this.watch.move=i;
				this.watch.i=i;
				break;
			}
		}
		
		this.tmp_whxys.length=0;
		this.watch.func=func;
		this.draw_all()
	}
	var timer;
	var move=function(e){
		e.preventDefault();
		var watch=this.watch
		var canvas=this.canvas;
		if(isNaN(watch.move))return;
		
		var page={};
		if(e.type=="mousemove"){
			page.x=e.pageX;
			page.y=e.pageY;
		}else if(e.type=="touchmove"){
			page.x=e.touches[0].pageX;
			page.y=e.touches[0].pageY;
			if(e.touches.length==2){
				this.whxys[this.watch.move].w
				this.whxys[this.watch.move].h
				return
			}
		}
						
		var tmp=canvas.getBoundingClientRect()
		var x=page.x-(tmp.left+document.body.scrollLeft);
		var y=page.y-(tmp.top+document.body.scrollTop);
		var range={
			x:(x-watch.x),
			y:(y-watch.y),
		}

		watch.x+=range.x;
		watch.y+=range.y;
		var plus={};
		plus.w=range.x/this.scale >> 0;
		plus.h=range.y/this.scale >> 0;
		
		watch.func && watch.func(plus)
								
		var canvas = this.canvas;
		var w=canvas.width;
		var h=canvas.height;
		clearTimeout(timer)
		timer=setTimeout(function(e){
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0,0,w,h);
			this.draw_all()
		}.bind(this,e),5);
	}
	var end=function(e){
		delete this.watch.move;
	}
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		document.addEventListener("touchstart",start.bind(this));
		document.addEventListener("touchend",end.bind(this));
		document.addEventListener("touchmove",move.bind(this));
	}else{
		document.addEventListener("mousedown",start.bind(this));
		document.addEventListener("mouseup",end.bind(this));
		document.addEventListener("mousemove",move.bind(this));
	}
}
canvas_whxy.prototype.watch_key=function(){
	var count=1;
	var timer;
	document.addEventListener("keypress",function(e){
		count*=1.05;
		clearTimeout(timer);
		timer=setTimeout(function(){
			count=1;
		},50)
		var whxys=this.whxys;
		var watch=this.watch;
		if(whxys[watch.i]){
			if(e.keyCode==97){//左
				whxys[watch.i].x-=count
			}else if(e.keyCode==100){//右
				whxys[watch.i].x+=count
			}else if(e.keyCode==119){//上
				whxys[watch.i].y-=count
			}else if(e.keyCode==115){//下
				whxys[watch.i].y+=count
			}
			whxys[watch.i].x=(whxys[watch.i].x) >> 0;
			whxys[watch.i].y=(whxys[watch.i].y) >> 0;
			this.draw_all()
		}
	}.bind(this))
}