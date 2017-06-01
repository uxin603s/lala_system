var MergeText=function(){
	this.wait_family={}
}

MergeText.prototype.fontLoad=function(families,callback){
	var remove=function(family){
		if(this.wait_family[family]){	
			document.body.removeChild(this.wait_family[family]);
			delete this.wait_family[family];		
			return true;
		}else{
			return false;
		}
	}.bind(this)
	for(var i in families){
		var family=families[i];
		if(document.fonts.check("16px "+family)){
			// console.log("有")
		}else{
			// console.log("沒有")
			if(!this.wait_family[family]){
				var div=document.createElement("div");
				var style="";
				style+="font-size:16px;";
				style+="font-family:'"+family+"';";
				style+="opacity:0;";
				style+="position:absolute;";
				div.setAttribute("style",style)
				div.innerText=family;
				this.wait_family[family]=div;
				document.body.appendChild(div);
				var sec=5;
				setTimeout(function(family){
					if(remove(family)){
						callback && callback();
						// console.log("等待"+sec+"秒，"+family+"字形未載入，執行程式")
					}
				}.bind(this,family,sec,div),sec*1000)
			}
		}
	}
	if(Object.keys(this.wait_family).length){
		document.fonts.onloadingdone=function(e){
			for(var i in e.fontfaces){
				var family=e.fontfaces[i].family;
				remove(family);
				// console.log(family+"字形載入成功")
				if(Object.keys(this.wait_family).length==0){
					callback && callback();
					// console.log("執行程式")
				}
			}
		}.bind(this)
	}else{
		callback && callback();
	}
}
MergeText.prototype.draw_text_img=function(font_object,text){
	var w=font_object.size*1
	var h=font_object.size*1
	var size=font_object.size*1
	if(text.match(new RegExp("[a-zA-Zａ-ｚＡ-Ｚ]"))){
		var size=font_object.size*.77;
		//英文字需要縮小不然jqQ會超過邊界
	}else{
		var size=font_object.size*1
	}
	var family=font_object.family || "arial";
	if(font_object.bg.size>10){
		var bg_size=10;
	}else{
		var bg_size=font_object.bg.size;
	}			
	bg_size*=(size/100)
	
	var c=(new Canvas(w,h)).getContext("2d");
	var x=0;
	var y=h/2;
	if(bg_size){
		x+=bg_size/2;
		if(["j","ｊ"].indexOf(text)!=-1){
			x+=bg_size;
		}
	}
	var real_size=size
	if(bg_size){
		real_size-=bg_size;
	}
	
	while(1){
		c.fillStyle=font_object.color;
		c.font=real_size+"px '"+family+"' "; 
		c.textBaseline="middle";
		if(bg_size){
			c.lineWidth=bg_size;
			c.strokeStyle=font_object.bg.color;	
			c.strokeText(text,x,y);	
		}
		c.fillText(text,x,y);
		var real_w=Math.ceil(c.measureText(text).width)
		if(bg_size){
			real_w+=x*2
		}
		var w=c.canvas.width
		
		if(w>real_w){
			c.canvas.width=real_w;//調整大小需要重新繪製
		}else{
			c.canvas.text=text;
			c.canvas.x=x;
			c.canvas.y=y;
			return c.canvas;
		}
	}
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
MergeText.prototype.count_break_scale=function(text_imgs,w,h,w_func,h_func){
	var scale=1;
	var tmp={
		w:text_imgs.reduce(w_func,0),
		h:text_imgs.reduce(h_func,0),
	};
	if(tmp.w>w){
		scale*=w/tmp.w;
	}
	if(tmp.h>h){
		scale*=h/tmp.h;
	}
	return scale;
}
MergeText.prototype.count_scale=function(text_imgs,w,h){
	var count_scale_inner=function(text_imgs,w,h,scale){
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
		var result=count_scale_inner(text_imgs,w,h,scale);
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

MergeText.prototype.merge_single_line_img=function(text_imgs){
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
MergeText.prototype.draw_text_line=function(object,canvas){
	var c=canvas.getContext("2d");
	var w=canvas.width;
	var h=canvas.height;
	var bg_size=object.bg_size*1
	var line=object.line*1
	var bg_color=object.bg_color
	var color=object.color
	var start_x=0;
	var end_x=w;
	
	var line_weight=Math.floor(h/15)
	if(line){
		if(line==1){
			h-=line_weight;
		}else{
			h*=.5;
		}
		if(bg_size){
			c.strokeStyle=bg_color;
			c.lineWidth=line_weight*2;
			c.beginPath();
			c.moveTo(start_x,h);
			c.lineTo(end_x,h);
			c.stroke();
		}
		
		// var c=c.canvas.getContext("2d");
		c.strokeStyle=color;
		c.lineWidth=line_weight;
		var amount=line_weight/2;
		start_x+=amount
		end_x-=amount
		c.beginPath();
		c.moveTo(start_x,h);
		c.lineTo(end_x,h);
		c.stroke();
		// console.log(Math.floor(object.size/20))
		// console.log(start_x+10)
	}
}
MergeText.prototype.check_repeat_range=function(range,texts_string,match_result,color){
	var count_start=0;
	for(var i in match_result){
		var start=texts_string.indexOf(match_result[i])
		
		var count=match_result[i].length;
		var real_start=start+count_start;
		
		var ed={
			start:real_start,
			end:real_start+count,
		}
		var check_flag=true;
		
		for(var j in range){
			var main={
				start:range[j].start,
				end:range[j].start+range[j].count,
			}
			
			if(ed.start>=main.start && ed.end<=main.end){//範圍內直接忽略
				// console.log("範圍內直接忽略",ed,JSON.stringify(range))
				check_flag=false;
				break;
			}
			if(main.start >= ed.start){//排列
				var a=ed;
				var b=main;
			}else{
				var a=main;
				var b=ed;
			}
			if(a.end>b.start){//頭尾有無交集
				if(JSON.stringify(ed)==JSON.stringify(a)){
					ed.end=main.start
					// console.log("------fix end------",JSON.stringify(ed),JSON.stringify(range))
				}else{
					ed.start=main.end
					// console.log("------fix start------",ed,JSON.stringify(range))
				}
			}
			if((ed.end-ed.start)>0){
				check_flag=true;
				// console.log("------ok------",ed,JSON.stringify(range))
				break;
			}
		}
		
		
		if(check_flag){					
			range.push({start:ed.start,count:ed.end-ed.start,color:color});
			clear_start=start+count-1
			texts_string=texts_string.substr(clear_start);
			count_start+=clear_start;
		}
	}
}
MergeText.prototype.replace_color=function(canvas,relace_array){
	var check_obj={};
	for(var i in relace_array){
		for(var j in relace_array[i]){
			var match_check=relace_array[i][j].match(/rgb\(([\s\S]+)\)/g)
			if(match_check){
				relace_array[i][j]=RegExp.$1
			}else if(relace_array[i][j].indexOf("#")==0){
				var tmp=[];
				for(var k=0;k<3;k++){
					tmp.push(parseInt(relace_array[i][j].substr(k*2+1,2),16));
				}
				relace_array[i][j]=tmp.join(",")
			}
		}
		var origin=relace_array[i].origin;
		var object=relace_array[i].object;
		check_obj[origin]=object;
	}
	var c=canvas.getContext("2d")
	var imageData =c.getImageData(0, 0,canvas.width,canvas.height);
	for(var i=0;i<imageData.data.length;i+=4){
		var tmp=imageData.data.slice(i,i+3).join(",");
		if(check_obj[tmp]){
			var tmp_arr=check_obj[tmp].split(",");
			for(var j in tmp_arr){
				imageData.data[i*1+j*1]=tmp_arr[j];
			}
		}
	}
	c.putImageData(imageData,0,0);
}
MergeText.prototype.merge_continuous_text=function(text_imgs,font_object){
	var continuous_text=font_object.continuous_text
	var texts_array=text_imgs.map(function(val){return val.text});//.join("")
	var range=[];
	for(var i in continuous_text){
		var texts_string=texts_array.join("");
		var text=continuous_text[i].text
		var escape=continuous_text[i].escape
		var color=continuous_text[i].color
		if(escape){
			text=text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
		}
		var match_result=texts_string.match(new RegExp(text,"g"));
		this.check_repeat_range(range,texts_string,match_result,color);
	}
	// console.log(JSON.stringify(range));
	if(!range.length)return false;
	range.sort(function(a,b){ return a.start-b.start})
	var count_start=0;
	for(var i in range){
		var start=range[i].start;
		var count=range[i].count;
		var color=range[i].color;
		
		var texts_string=texts_array.join("").substr(start,count)
		if((start-count_start)<0)continue;
		start-=count_start
		
		var tmp=text_imgs.splice(start,count);
		if(color){
			for(var i in tmp){
				var c=tmp[i].getContext("2d");
				var x=tmp[i].x;
				var y=tmp[i].y;
				
				var text=tmp[i].text;
				c.clearRect(0,0,tmp[i].width,tmp[i].height);
				if(font_object.bg.size){
					c.strokeStyle=font_object.bg.color;	
					c.strokeText(text,x,y);	
				}
				c.fillStyle=color;
				c.fillText(text,x,y);
				
			}
		}
		var single_line_img=this.merge_single_line_img(tmp);
		
		text_imgs.splice(start,0,single_line_img);
		count_start+=count-1;
	}
	// console.log(text_imgs.map(function(val){return val.text}));
	return true;
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
MergeText.prototype.merge=function(font_object){
	if(font_object.size>font_object.w){
		font_object.size=font_object.w
	}
	if(font_object.size>font_object.h){
		font_object.size=font_object.h
	}
	if(font_object.size<=20){
		var c=(new Canvas(font_object.w,font_object.h)).getContext("2d");
		return c.canvas;
	}
	var text=font_object.text;
	var type=font_object.type;
	var text_arr=text.split("");
	var text_imgs=[];
	while(text_arr.length){//合成單個文字圖
		text_imgs.push(this.draw_text_img(font_object,text_arr.shift()));
	}
	
	if(type==0){					
		var w=font_object.w;
		var h=font_object.h;
		//連續字合成文字圖
		this.merge_continuous_text(text_imgs,font_object);			
		this.resize_text_imgs(text_imgs,this.count_scale(text_imgs,w,h));
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
				
				var tmp=this.merge_single_line_img(merge_tmp);
				if(tmp){
					result.push(tmp);
				}
				x=0;
			}
			merge_tmp.push(img)
			x+=img.width;
		}
		if(merge_tmp.length){
			var tmp=this.merge_single_line_img(merge_tmp);
			if(tmp){
				result.push(tmp);
			}
		}
		var text_imgs=result;
		// console.log(text_imgs)			
		var c=(new Canvas(w,h)).getContext("2d");
		var x=0;
		var y=0;
		for(var i in text_imgs){
			var img=text_imgs[i];
			var img_w=img.width;
			var img_h=img.height;
			this.draw_text_line(font_object,img);
			var x=this.align_count(font_object.align.h,w,img_w);
			c.drawImage(img,x,y);
			y+=img_h;
		}
		return c.canvas;
	}else if(type==1){
		this.merge_continuous_text(text_imgs,font_object);
		var w=font_object.w;
		var h=font_object.h;
		
		var w_func=function(sum,c){
			return sum+c.width;
		}
		var h_func=function(max,c){
			var h=c.height;
			if(h>max){
				return h;
			}else{
				return max;
			}
		}	
		this.resize_text_imgs(text_imgs,this.count_break_scale(text_imgs,w,h,w_func,h_func));
		var c=(new Canvas(w,h)).getContext("2d");
		var result_c=this.merge_single_line_img(text_imgs);
	
		var x=this.align_count(font_object.align.h,w,result_c.width);
		var y=this.align_count(font_object.align.v,h,result_c.height);
		this.draw_text_line(font_object,result_c);
		c.drawImage(result_c,x,y);
		return c.canvas;
	}else if(type==2){
		var w=font_object.w;
		var h=font_object.h;
		
		var w_func=function(max,c){
			var w=c.width;
			if(w>max){
				return w;
			}else{
				return max;
			}
		}
		var h_func=function(val,c){
			return val+c.height;
		}
		this.resize_text_imgs(text_imgs,this.count_break_scale(text_imgs,w,h,w_func,h_func));
		var c=(new Canvas(w,h)).getContext("2d");
		var y=0;
		for(var i in text_imgs){
			var img=text_imgs[i];
			this.draw_text_line(font_object,img);
			var x=this.align_count(font_object.align.h,w,img.width);
			c.drawImage(img,x,y);
			y+=img.height
		}
		return c.canvas;
	}
}