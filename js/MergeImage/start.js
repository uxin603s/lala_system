MergeImage.prototype.start=function(e){	
	
	this.resize();
	if(e.type=="mousedown"){
		this.p.x=e.pageX;
		this.p.y=e.pageY;		
		document.addEventListener("mousemove",this.move_bind);		
	}else if(e.type=="touchstart"){
		this.p.x=e.touches[0].pageX;
		this.p.y=e.touches[0].pageY;
		document.addEventListener("touchmove",this.move_bind);		
	}


	var tmp=this.canvas.getBoundingClientRect();
	this.p.x-=(tmp.left+document.body.scrollLeft)
	this.p.y-=(tmp.top+document.body.scrollTop)

	
	
	var len=this.whxys.length;
	var find_flag=true;
	for(let i=0;i<len;i++){

		let whxy=this.whxys[i];
		let lock=whxy.lock;
		if(lock){
			if(lock.hide){
				continue;
			}
		}
		
		let x=whxy.x*this.scale >> 0;
		let y=whxy.y*this.scale >> 0;
		let w=whxy.w*this.scale >> 0;
		let h=whxy.h*this.scale >> 0;;
		let x1=x+w;
		let y1=y+h;

		let wh_len=2;
		if(whxy.w>whxy.h){
			var wh=whxy.h
		}else{
			var wh=whxy.w
		}
		wh*=this.scale/3;
		if(0 <= this.p.x && this.p.x<=this.canvas.width && 0 <= this.p.y && this.p.y<=this.canvas.height){
			
			for(let j=0;j<=wh_len;j++){
				for(let k=0;k<=wh_len;k++){
					if(j==1 && k==1)continue;
					let x2=(w)*j/(wh_len)-wh/2+x;
					let y2=(h)*k/(wh_len)-wh/2+y;
					let x3=x2+wh;
					let y3=y2+wh;
					if(find_flag && this.p.x>=x2 && this.p.x<=x3 && this.p.y>=y2 && this.p.y<=y3){
						// console.log('ijk',i,j,k)
						find_flag=false;
						this.select={i:i,j:j,k:k};
						break;
					}
				}
			}	
		}
		if(find_flag && this.p.x>=x && this.p.x<=x1 && this.p.y>=y && this.p.y<=y1){//畫正方形
			this.select={i:i};
			find_flag=false;
			break;
		}
	}
	
	if(find_flag){
		if(0 <= this.p.x && this.p.x<=this.canvas.width && 0 <= this.p.y && this.p.y<=this.canvas.height){
			delete this.select;
		}		
	}else{		
		var whxy=this.whxys[this.select.i];
		if(whxy.lock && whxy.lock.whxy){
			delete this.select;
		}else{
			this.select.x=whxy.x;
			this.select.y=whxy.y;
			this.select.w=whxy.w;
			this.select.h=whxy.h;
		}	
	}
	this.callback && this.callback(this.whxys)
	
	this.draw();
	
}