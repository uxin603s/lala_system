MergeText.prototype.oneTextToImg=function(text,object){
	var w=object.size*1
	var h=object.size*1
	if(text.match(new RegExp("[a-zA-Z]"))){//英文字需要縮小不然jqQ會超過邊界
		var size=object.size*.77;
	}else{
		var size=object.size*1
	}
	var family=object.family || "arial";
	if(object.bg.size>10){
		var bg_size=10;
	}else{
		var bg_size=object.bg.size;
	}	
	bg_size*=(size/100)
	var color=object.color;
	var bg_color=object.bg.color;
	var c=(new Canvas(w,h))
	var ctx=c.getContext("2d");
	var x=0;
	var y=h/2;
	// console.log(bg_size)
	if(bg_size){

		x+=bg_size/2;
		if(["j"].indexOf(text)!=-1){//英文字特例
			x+=bg_size*2;
			y-=bg_size
			// console.log(bg_size)
		}
	}
	var real_size=size
	if(bg_size){
		real_size-=bg_size;
	}
	
	while(1){		
		ctx.font=real_size+"px '"+family+"' "; 
		ctx.textBaseline="middle";
		if(bg_size){
			ctx.lineWidth=bg_size;
			ctx.strokeStyle=bg_color;	
		}
		if(bg_size){
			ctx.strokeText(text,x,y);
		}
		ctx.globalCompositeOperation="destination-out";
		ctx.fillText(text,x,y);
		ctx.fillStyle=color
		ctx.globalCompositeOperation="source-over";
		ctx.fillText(text,x,y);
		var real_w=Math.ceil(ctx.measureText(text).width)
		if(bg_size){
			real_w+=x*2
		}
		var w=c.width
		
		if(w>real_w){
			c.width=real_w;//調整大小需要重新繪製
		}else{
			c.text=text;
			c.x=x;
			c.y=y;
			return c;
		}
	}
}
