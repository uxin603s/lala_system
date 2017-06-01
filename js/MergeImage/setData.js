MergeImage.prototype.setData=function(list){
	this.whxys=list

	// return this
	// var len=this.whxys.length;
	// var count=0;
	for(let i in this.whxys){
		delete this.whxys[i].source.canvas
	}
	this.resize();
	this.draw();
	return this
}