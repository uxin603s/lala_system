MergeText.prototype.type1=function(text_imgs,w,h,align_h,align_v){
	var total={
		w:text_imgs.reduce(function(sum,c){
			return sum+c.width;
		},0),
		h:text_imgs[0].height,
	}
	
	var scale=this.count_break_scale(text_imgs,w,h,total.w,total.h);
	this.resize_text_imgs(text_imgs,scale);
	var c=(new Canvas(w,h))
	var ctx=c.getContext("2d");
	var result_c=this.merge_line(text_imgs);
	var x=this.align_count(align_h,w,result_c.width);
	var y=this.align_count(align_v,h,result_c.height);
	// this.draw_text_line(font_object,result_c);
	ctx.drawImage(result_c,x,y);	
	return c;
}