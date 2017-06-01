MergeText.prototype.type0=function(text_imgs,w,h,align_h,align_v){
	var scale=this.closeScale(text_imgs,w,h)
	this.resize_text_imgs(text_imgs,scale);
	var x=0;		
	var merge_tmp=[];
	var result=[];

	for(var i in text_imgs){
		var img=text_imgs[i];
		
		if((x+img.width)>w){//超過就換行
			while(1){//空白去除
				if(merge_tmp.map(function(val){return val.text}).join("").indexOf(" ")==0){
					merge_tmp.shift();
				}else{
					break;
				}
			}
			
			var tmp=this.merge_line(merge_tmp);
			if(tmp){
				result.push(tmp);
			}
			x=0;
		}
		merge_tmp.push(img)
		x+=img.width;
	}
	if(merge_tmp.length){
		var tmp=this.merge_line(merge_tmp);
		if(tmp){
			result.push(tmp);
		}
	}
	var text_imgs=result;
		
	var c=(new Canvas(w,h))
	var ctx=c.getContext("2d");
	var total_h=text_imgs[0].height*text_imgs.length
	var y=this.align_count(align_v,h,total_h);
	for(var i in text_imgs){
		var img=text_imgs[i];
		var img_w=img.width;
		var img_h=img.height;
		// this.draw_text_line(font_object,img);
		var x=this.align_count(align_h,w,img_w);
		ctx.drawImage(img,x,y);
		y+=img_h;
	}
	return c;
}