MergeText.prototype.type2=function(text_imgs,w,h,align_h,align_v){

	var total={
		w:0,
		h:0,
	}
	for(let i in text_imgs){
		var c=text_imgs[i]
		if(c.width>total.w){
			total.w=c.width;
		}
		total.h+=c.height
	}
	var scale=this.count_break_scale(text_imgs,w,h,total.w,total.h);
	this.resize_text_imgs(text_imgs,scale);
	var c=(new Canvas(w,h))
	var ctx=c.getContext("2d");
	var y=0;
	for(var i in text_imgs){
		var img=text_imgs[i];
		// this.draw_text_line(object,img);
		var x=this.align_count(align_h,w,img.width);
		ctx.drawImage(img,x,y);
		y+=img.height
	}
	return c;
}