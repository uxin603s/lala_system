var MergeImage=function(){
	this.cache={
		url:{},
	}
}
MergeImage.prototype.merge=function(w,h,list,callback){

	var c=new Canvas(w,h).getContext("2d");
	this.check_onload(list,function(list){
		for(var i in list){
			var item=list[i];
			this.padding(item);
			this.rotate(item);
			var canvas=item.canvas;
			var x=item.x;
			var y=item.y;
			var w=item.w;
			var h=item.h;
			c.drawImage(canvas,x,y,w,h);
		}
		callback && callback(c.canvas);
	}.bind(this))
}
MergeImage.prototype.getblob=function(url,callback,times){	
	var tmp=this;
	var xhr = new XMLHttpRequest();
	xhr.responseType = "blob";
	xhr.onload=function(){
		var blob=this.response;
		if(blob.size){
			var url=URL.createObjectURL(blob);
			var load=function(){
				callback && callback(this)
				tmp.cache.url[url]=this;
			}
			if(url){
				var img=new Image;
				
				img.onload=load.bind(img);
				img.src=url;
			}else{
				callback && callback()
			}
		}else{
			callback && callback()
		}
		
	}
	xhr.onerror=function(res){
		var backend_url="getBlob.php?url=";//後端取得blob
		if(times){
			this.getblob(backend_url+url,callback);
		}else{
			callback && callback()
		}
	}.bind(this)
	xhr.open("get",url,true);
	xhr.send();
}
MergeImage.prototype.check_onload=function(list,callback){
	var result=[];
	var check_object={finish_count:list.length}
	var merge_text=new MergeText;
	for(var i in list){
		var source=list[i].source;				
		if(typeof source =="object"){
			list[i].canvas=merge_text.merge(source);
			list[i].index=i
			result.push(list[i]);
			if(check_object.finish_count==result.length){
				result.sort(function(a,b){
					return b.index-a.index;
				})
				callback && callback(result);
			}
		}else{
			var getBlobHandler=function(item,i,canvas){
				if(canvas){
					item.canvas=canvas;
					item.index=i
					result.push(item)
				}else{
					check_object.finish_count--;
				}
				if(check_object.finish_count==result.length){
					result.sort(function(a,b){
						return b.index-a.index;
					})
					callback && callback(result);
				}
			}.bind(this,list[i],i)
			
			if(this.cache.url[source]){
				getBlobHandler(this.cache.url[source]);
			}else{
				this.getblob(source,getBlobHandler,1);
			}
		}
	}
}
MergeImage.prototype.padding=function(img_object,canvas){
	if(!img_object.bg || !img_object.bg.padding)return canvas;
	var bg=img_object.bg;
	var canvas=img_object.canvas;
	var padding=bg.padding;
	var radius=bg.radius;
	var color=bg.color;
	var w=img_object.w+padding*2;
	var h=img_object.h+padding*2;
	var x=0;
	var y=0;
	var c=new Canvas(w,h).getContext("2d");
	if(radius){
		var cr=radius*2;
		c.lineJoin="round";
		c.lineWidth=cr;
		c.strokeStyle=color;
		x+=cr/2;
		y+=cr/2;
		w-=cr;
		h-=cr;
		c.strokeRect(x,y,w,h);
	}
	c.fillStyle=color;
	c.fillRect(x,y,w,h);
	
	c.drawImage(canvas,padding,padding,img_object.w,img_object.h);
	
	img_object.x-=padding;
	img_object.y-=padding;
	img_object.w=w;
	img_object.h=h;
	img_object.canvas=c.canvas
}
MergeImage.prototype.rotate=function(img_object){
	if(!img_object.rotate || img_object.rotate==0)return;
	var rotate=img_object.rotate;
	var w=img_object.w;
	var h=img_object.h;
	var canvas=img_object.canvas;
	var rotate_width=Math.sqrt(w*w+h*h);//畢氏定理取斜邊，旋轉圖不會切到
	
	var x=(rotate_width-w)/2;//將圖定位到中心
	var y=(rotate_width-h)/2;
	var c=new Canvas(rotate_width,rotate_width).getContext("2d");
	c.translate(rotate_width/2,rotate_width/2);//改變中心點
	c.rotate(rotate*Math.PI/180);//依中心點旋轉
	c.translate(-rotate_width/2,-rotate_width/2);//還原中心點
	c.drawImage(canvas,x,y,w,h);
	img_object.canvas=c.canvas;
	img_object.x-=x;//修正座標
	img_object.y-=y;//修正座標
	img_object.w=rotate_width;//修正寬
	img_object.h=rotate_width;//修正高
}