MergeImage.prototype.draw=function(callback){
	// clearTimeout(this.draw_timer)
	// this.draw_timer=setTimeout(function(){
		this.resize();
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
		let len=(this.whxys.length)-1;
		
		for(let i=len;i>=0;i--){
			let whxy=this.whxys[i]
			let lock=whxy.lock;
			if(lock){
				if(lock.hide){
					continue;
				}
			}		
			let source_canvas=whxy.source.canvas;
			if(source_canvas){	
				this.drawInner(whxy,source_canvas)			
			}else{
				if(whxy.source.type=="font"){
					this.drawFont(whxy);
				}
				else if(whxy.source.type=="image" ){
					var img=new Image;
					img.onload=function(i,img,whxy){
						whxy.source.canvas=img;					
						this.draw();
						this.callback && this.callback(this.whxys)				
					}.bind(this,i,img,whxy)
					img.src=whxy.source.src
				}
			}
			if(this.select && this.select.i==i){
				var x=whxy.x*this.scale;
				var y=whxy.y*this.scale;
				var w=whxy.w*this.scale;
				var h=whxy.h*this.scale;

				this.ctx.drawImage(this.draw_rect(w,h,10),x,y)
				var wh_len=2;
				if(whxy.w>whxy.h){
					var wh=whxy.h
				}else{
					var wh=whxy.w
				}
				wh*=this.scale/3;
				for(var j=0;j<=wh_len;j++){
					for(var k=0;k<=wh_len;k++){
						if(j==1 && k==1)continue;
						var x2=(w)*j/(wh_len)-wh/2+x;
						var y2=(h)*k/(wh_len)-wh/2+y;
						this.ctx.drawImage(this.draw_rect(wh,wh,10),x2,y2)	
					}
				}	
			}
		}
		callback && callback();
	// }.bind(this),5)	
}

MergeImage.prototype.cloneCanvas=function (oldCanvas) {
    var c =new Canvas(oldCanvas.width,oldCanvas.height);
    var ctx = newCanvas.getContext('2d');
    ctx.drawImage(oldCanvas, 0, 0);
    return c;
}
MergeImage.prototype.drawInner=function(whxy,source_canvas){

	var x=whxy.x*this.scale;
	var y=whxy.y*this.scale;
	var w=whxy.w*this.scale;
	var h=whxy.h*this.scale;
	var color=whxy.bg.color;			
	var padding=whxy.bg.padding*this.scale;
	var radius=whxy.bg.radius;//1-10
	if(radius>=10){
		radius=10
	}
	radius=radius/10*padding;

	var tmp_ctx=new Canvas(w+padding*2,h+padding*2).getContext('2d');
	
	tmp_ctx.fillStyle=color;
	tmp_ctx.strokeStyle=color;
	
	this.fillRect(tmp_ctx,0,0,w+padding*2,h+padding*2,radius);

	tmp_ctx.drawImage(source_canvas,padding,padding,w,h);
	
	if(whxy.rotate){
		var obj=this.rotate(tmp_ctx.canvas,whxy.rotate);
		this.ctx.drawImage(obj.canvas,x-padding-obj.x,y-padding-obj.y,obj.canvas.width,obj.canvas.height);	
	}else{
		this.ctx.drawImage(tmp_ctx.canvas,x-padding,y-padding,tmp_ctx.canvas.width,tmp_ctx.canvas.height);
	}
}

MergeImage.prototype.draw_rect=function (w,h,line){
	var ctx = new Canvas(w,h).getContext('2d');
	ctx.fillStyle="rgba(0,0,0,0.5)";
	ctx.fillRect(0,0,w,h);
	ctx.fillStyle="rgba(0,0,0,1)";
	ctx.globalCompositeOperation="destination-out";
	ctx.fillRect(line,line,w-line*2,h-line*2);
	return ctx.canvas
}	
MergeImage.prototype.fillRect=function(ctx,x,y,w,h,r){
	if(r){

	}else{
		r=0
	}
	var radius={
		tl:r,
		tr:r,
		bl:r,
		br:r,
	}	
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + w - radius.tr, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + radius.tr);
	ctx.lineTo(x + w, y + h - radius.br);
	ctx.quadraticCurveTo(x + w, y + h, x + w - radius.br, y + h);
	ctx.lineTo(x + radius.bl, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	ctx.fill();
}