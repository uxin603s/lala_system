MergeImage.prototype.listen=function(){
	this.move_bind=this.move.bind(this)
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		document.addEventListener("touchstart",this.start.bind(this));		
		document.addEventListener("touchend",function(){
			document.removeEventListener("touchmove",this.move_bind);
		}.bind(this));
	}else{
		document.addEventListener("mousedown",this.start.bind(this));
		document.addEventListener("mouseup",function(){
			document.removeEventListener("mousemove",this.move_bind);
		}.bind(this));
	}
	window.onresize=function(){
		this.resize();
		this.draw();
	}.bind(this)
}