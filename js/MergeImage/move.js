MergeImage.prototype.move=function(e){
	if(!this.select || isNaN(this.select.i))return;	
	if(this.select.stop_watch)return;
	var p={};
	if(e.type=="mousemove"){
		p.x=e.pageX;
		p.y=e.pageY;
	}else if(e.type=="touchmove"){
		p.x=e.touches[0].pageX;
		p.y=e.touches[0].pageY;
	}
				
	var tmp=this.canvas.getBoundingClientRect();
	p.x-=(tmp.left+document.body.scrollLeft)
	p.y-=(tmp.top+document.body.scrollTop)
	
	var range={
		x:(p.x-this.p.x)/this.scale,
		y:(p.y-this.p.y)/this.scale,
	}
	
	let whxy=this.whxys[this.select.i];
	let x=whxy.x;
	let y=whxy.y;
	let w=whxy.w;
	let h=whxy.h;
	let limit={
		w:{
			min:0,
			max:this.w,
		},
		h:{
			min:0,
			max:this.h,
		}
	}
	if(isNaN(this.select.j) || isNaN(this.select.k)){
		if(this.option.boder && (this.select.x+range.x)<=limit.w.min){
			whxy.x=limit.w.min;
		}else if(this.option.boder && (this.select.w+this.select.x+range.x)>limit.w.max){
			whxy.x=limit.w.max-this.select.w;
		}else{
			whxy.x=this.select.x+range.x;
		}

		if(this.option.boder && (this.select.y+range.y)<=limit.h.min){
			whxy.y=limit.h.min;
		}else if(this.option.boder && (this.select.h+this.select.y+range.y)>limit.h.max){
			whxy.y=limit.h.max-this.select.h;
		}else{
			whxy.y=this.select.y+range.y;
		}
				
	}else{	
		if(whxy.lock && whxy.lock.scale){
			var scale=this.select.w/this.select.h
		}
		
		var total={
			x:(this.select.x+this.select.w),
			y:(this.select.y+this.select.h),
		}
		
		var tmp_limit=20;	
		if(this.select.j==0){
			if((range.x+this.select.x)>=limit.w.min || !this.option.boder){
				if(this.select.w-range.x>=tmp_limit){					
					whxy.w=this.select.w-range.x
					whxy.x=total.x-whxy.w;					
				}else{					
					whxy.w=tmp_limit
					whxy.x=total.x-whxy.w;					
				}
			}else{
				whxy.x=limit.w.min;
				whxy.w=total.x-whxy.x;
			}
		}else if(this.select.j==2){
			if((this.select.w+range.x+this.select.x)<limit.w.max || !this.option.boder){
				if((this.select.w+range.x)>=tmp_limit){
					whxy.w=this.select.w+range.x
				}else{
					whxy.w=tmp_limit
				}
			}else{
				whxy.w=limit.w.max-this.select.x;
			}
		}
		if(this.select.k==0){
			if((range.y+this.select.y)>=limit.h.min || !this.option.boder){
				if(this.select.h-range.y>=tmp_limit){
					whxy.h=this.select.h-range.y

					whxy.y=total.y-whxy.h;
				}else{
					whxy.h=tmp_limit
					whxy.y=total.y-whxy.h;
				}		
			}else{
				whxy.y=limit.h.min;
				whxy.h=total.y-whxy.y;
			}
		}else if(this.select.k==2){
			if((this.select.h+range.y+this.select.y)<limit.h.max || !this.option.boder){
				if(this.select.h+range.y>=tmp_limit){
					whxy.h=this.select.h+range.y
				}else{
					whxy.h=tmp_limit
				}
			}else{
				whxy.h=limit.h.max-this.select.y;
			}
		}	

		if(whxy.lock && whxy.lock.scale){
			if(this.select.j!=1 && this.select.k!=1){
				whxy.h=whxy.w/scale;
				if(this.select.k!=2){
					whxy.y=total.y-whxy.h;
				}
				if(whxy.h+whxy.y>=limit.h.max){
					whxy.h=limit.h.max-whxy.y;
					whxy.w=whxy.h*scale
					whxy.x=total.x-whxy.w
				}
				if(whxy.y<=limit.h.min){
					whxy.h+=whxy.y;
					whxy.y=limit.h.min;
					whxy.w=whxy.h*scale
					whxy.x=total.x-whxy.w
				}
			}else{
				whxy.w=this.select.w
				whxy.h=this.select.h
				whxy.x=this.select.x
				whxy.y=this.select.y
				return
			}
		}
	}
	

	whxy.x=whxy.x>>0;
	whxy.y=whxy.y>>0;
	whxy.w=whxy.w>>0;
	whxy.h=whxy.h>>0;
	
	this.callback && this.callback(this.whxys)

	this.draw();
	if(whxy.source.type=="font"){
		if(!(whxy.w==whxy.source.src.w && whxy.h==whxy.source.src.h)){
			delete this.level_canvas[this.select.i]
		}
	}
}