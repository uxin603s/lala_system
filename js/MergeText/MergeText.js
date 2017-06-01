var MergeText=function(){
	this.wait_family={}
}

MergeText.prototype.merge=function(object,callback){
	var w=object.w;
	var h=object.h;
	var old_size=object.size;
	if(object.size>w){
		object.size=w
	}
	if(object.size>h){
		object.size=h
	}
	if(object.size<=20){
		object.size=old_size
		return false;
	}
	var text=object.text;
	var type=object.type;
	// console.log(object)
	var text_arr=text.split("");
	// console.log(text_arr)

	var text_imgs=[];
	while(text_arr.length){//合成單個文字圖
		let text=text_arr.shift();
		text_imgs.push(this.oneTextToImg(text,object));
	}
	// this.merge_continuous_text(text_imgs,font_object);
	if(type==0){
		this.merge_continuous_text(text_imgs,object);
		var c=this.type0(text_imgs,w,h,object.align.h,object.align.v);
	}else if(type==1){
		this.merge_continuous_text(text_imgs,object);
		var c=this.type1(text_imgs,w,h,object.align.h,object.align.v);
	}else if(type==2){
		var c=this.type2(text_imgs,w,h,object.align.h,object.align.v);
	}
	
	callback && callback(c);
	object.size=old_size
}


MergeText.prototype.count_break_scale=function(text_imgs,w,h,total_w,total_h){
	var scale=1;
	if(total_w>w){
		scale*=w/total_w;
	}
	if(total_h>h){
		scale*=h/total_h;
	}
	return scale;
}
MergeText.prototype.merge_line=function(text_imgs){
	if(text_imgs.length){
		var merge_tmp_w=text_imgs.reduce(function(sum,c){return sum+c.width},0)
		var	merge_tmp_h=text_imgs[0].height;
		
		var c=(new Canvas(merge_tmp_w,merge_tmp_h)).getContext("2d");
		var x=0;
		var y=0;
		
		for(var i in text_imgs){
			var img=text_imgs[i]
			c.drawImage(img,x,y);
			x+=img.width;
		}
		
		c.canvas.text=text_imgs.map(function(val){return val.text}).join("")
		text_imgs.length=0;
		return c.canvas;
	}else{
		return false;
	}
}
MergeText.prototype.align_count=function(align,amount,inner_amount){
	var result=0;
	switch(align){
		case 1:
			result=amount/2-inner_amount/2;
			break;
		case 2:
			result=amount-inner_amount;
			break;
	}
	return result;
}