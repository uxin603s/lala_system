MergeText.prototype.resize_text_imgs=function(text_imgs,scale){
	if(scale==1)return false
	for(var i in text_imgs){
		var img=text_imgs[i];
		var c=this.resize_img(img,scale)
		c.text=img.text
		c.scale=scale
		text_imgs[i]=c;
	}
	return true;
}
MergeText.prototype.resize_img=function(img,scale){
	if(typeof scale =="number"){
		var w=Math.floor(img.width*scale)
		var h=Math.floor(img.height*scale);
	}else{
		var w=scale.w;
		var h=scale.h;
	}
	var c=(new Canvas(w,h)).getContext("2d");
	
	c.drawImage(img,0,0,w,h);
	return c.canvas;
}