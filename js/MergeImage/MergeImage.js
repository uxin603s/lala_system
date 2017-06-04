function MergeImage(w,h){
	this.w=w;
	this.h=h;
	this.canvas=new Canvas(w,h);    
	this.ctx=this.canvas.getContext('2d');
	this.option={
		whxy:false,
		boder:false,
	}
	this.whxys=[];
	this.scale=1;
	this.select=undefined;
	this.p={};
	this.listen();
	this.key_control_obj={
		count:1,
		timer:null,
		timer1:null,
	};
	this.key_control();
	this.mergeTextFunc=new MergeText;
	this.level_canvas={};
}

MergeImage.prototype.setOption=function(key,value){		
	this.option[key]=value;
	return this;
}
MergeImage.prototype.watch=function(callback){		
	this.callback=callback;
	return this;
}
MergeImage.prototype.getData=function(callback){
	callback && callback(this.whxys)
}
MergeImage.prototype.getDom=function(list){
	return this.canvas;
}
MergeImage.prototype.rotate=function(canvas,rotate){
	
	var w=canvas.width;
	var h=canvas.height;
	
	var rotate_width=Math.sqrt(w*w+h*h);//畢氏定理取斜邊，旋轉圖不會切到
	
	var x=(rotate_width-w)/2;//將圖定位到中心
	var y=(rotate_width-h)/2;
	var c=new Canvas(rotate_width,rotate_width).getContext("2d");
	c.translate(rotate_width/2,rotate_width/2);//改變中心點
	c.rotate(rotate*Math.PI/180);//依中心點旋轉
	c.translate(-rotate_width/2,-rotate_width/2);//改變中心點
	c.drawImage(canvas,x,y,w,h);
	return {canvas:c.canvas,x:x,y:y,w:rotate_width,h:rotate_width};
}

MergeImage.prototype.resize=function(){
	this.scale=this.canvas.parentElement.clientWidth/this.w;
	this.canvas.width=this.w*this.scale;
	this.canvas.height=this.h*this.scale;
}
MergeImage.prototype.key_control=function(){
	document.addEventListener("mousemove",function(e){
		if(!this.select)return
		clearTimeout(this.key_control_obj.timer);
		this.key_control_obj.timer=setTimeout(function(e){
			var p={};
			if(e.type=="mousemove"){
				p.x=e.pageX;
				p.y=e.pageY;
			}					
			var tmp=this.canvas.getBoundingClientRect()
			p.x-=(tmp.left+document.body.scrollLeft)
			p.y-=(tmp.top+document.body.scrollTop)
			if(0 <= p.x && p.x<=this.canvas.width && 0 <= p.y && p.y<=this.canvas.height){
				if(this.select){
					this.select.stop_watch=false;
					this.key_control_obj.count=1;
				}
			}else{
				if(this.select){
					this.select.stop_watch=true;
					this.key_control_obj.count=1;
				}
			}
		}.bind(this,e),0)	
	}.bind(this))
	
	
	document.addEventListener("keypress",function(e){
		if(!this.select)return;
		if(this.select.stop_watch)return;
		this.key_control_obj.count*=1.05;
		clearTimeout(this.key_control_obj.timer1);
		this.key_control_obj.timer1=setTimeout(function(){
			this.key_control_obj.count=1;
		}.bind(this),50)
		var whxy=this.whxys[this.select.i];

		if(whxy){
			console.log(e.keyCode)
			if(e.keyCode==97){//左
				whxy.x-=this.key_control_obj.count
			}else if(e.keyCode==100){//右
				whxy.x+=this.key_control_obj.count
			}else if(e.keyCode==119){//上
				whxy.y-=this.key_control_obj.count
			}else if(e.keyCode==115){//下
				whxy.y+=this.key_control_obj.count
			}
			whxy.x=(whxy.x) >> 0;
			whxy.y=(whxy.y) >> 0;
			this.callback && this.callback(this.whxys)
			this.draw()
		}
	}.bind(this))
}
