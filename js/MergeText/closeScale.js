MergeText.prototype.closeScale=function(text_imgs,w,h){
	var closeScaleInner=function(text_imgs,w,h,scale){
		var x=0;
		var y=0;
		var text_imgs=Object.assign({}, text_imgs);
		this.resize_text_imgs(text_imgs,scale);
		for(var i in text_imgs){
			var img=text_imgs[i];
			if(img.width>w){//單個寬超過
				return false;
			}
			if((x+img.width)>w){
				x=0;
				y+=img.height;
			}
			x+=img.width;
		}
		return ((y+img.height) <= h);//全部加總的高
	}.bind(this)
	
	var area=w*h;
	var real_area=text_imgs.reduce(function(sum,c){return sum+c.width*c.height},1)
	var scale=Math.sqrt(area/real_area);//估算縮放
	if(scale>1){//放大不動作
		scale=1;
	}
	var count=0;
	var mix_scale=0;
	var max_scale=scale;
	
	while(Math.floor((max_scale-mix_scale)*100)){
		var scale=(max_scale+mix_scale)/2
		var result=closeScaleInner(text_imgs,w,h,scale);
		if(result){
			mix_scale=scale;
		}else{
			max_scale=scale;
		}
		if(count++>100){
			console.log("計算太多次break")
			break;
		}
	}
	if(mix_scale>1){//放大不動作
		mix_scale=1;
	}
	return mix_scale;
}