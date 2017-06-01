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
MergeText.prototype.merge_continuous_text=function(text_imgs,font_object){
	var continuous_text=font_object.continuous_text
	var texts_array=text_imgs.map(function(val){return val.text});//.join("")
	var range=[];
	for(var i in continuous_text){
		var texts_string=texts_array.join("");
		var text=continuous_text[i].text
		var escape=continuous_text[i].escape
		// var color=continuous_text[i].color
		if(escape){
			text=text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
		}
		var match_result=texts_string.match(new RegExp(text,"g"));
		// console.log(text,JSON.stringify(match_result));
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
		// if(color){
		// 	for(var i in tmp){
		// 		var c=tmp[i].getContext("2d");
		// 		var x=tmp[i].x;
		// 		var y=tmp[i].y;
				
		// 		var text=tmp[i].text;
		// 		c.clearRect(0,0,tmp[i].width,tmp[i].height);
		// 		if(font_object.bg.size){
		// 			c.strokeStyle=font_object.bg.color;	
		// 			c.strokeText(text,x,y);	
		// 		}
		// 		c.fillStyle=color;
		// 		c.fillText(text,x,y);
				
		// 	}
		// }
		var single_line_img=this.merge_line(tmp);
		
		text_imgs.splice(start,0,single_line_img);
		count_start+=count-1;
	}
	return true;
}