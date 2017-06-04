angular.module('app').component("imageLevelEdit",{
bindings:{
	id:"=",
},
templateUrl:'/app/components/imageLevel/imageLevelEdit.html',
controller:["$scope","$http","$timeout","$element",function($scope,$http,$timeout,$element){
	

	// $scope.$ctrl.$onInit=function(){
	// }
	// return 
	$scope.data=[{"x":799,"y":466,"w":200,"h":80,"rotate":0,
	"bg":{"padding":10,"radius":5,"color":"rgba(0,0,0,0.5)"},
	"lock":{"scale":false},
	"source":{"type":"font",
	"src":{"size":50,"family":"微軟正黑體","color":"#000000",
	"bg":{"color":"#ff00ff","size":5},
	"align":{"h":1,"v":1},
	"text":"無知","type":1,
	"continuous_text":[{"text":"[A-Za-z]+","escape":false,"color":"#000000"}],
	"w":200,"h":80},"canvas":{}}},
	{"x":800,"y":329,"w":200,"h":80,"rotate":0,"bg":{"padding":10,"radius":5,"color":"#ff0000"},"lock":{"scale":false,"whxy":false,"hide":false},"source":{"type":"font","src":{"size":50,"family":"微軟正黑體","color":"#000000","bg":{"color":"#ff00ff","size":5},"align":{"h":1,"v":1},"text":"無助1234564878978","type":0,"continuous_text":[{"text":"[A-Za-z]+","escape":false,"color":"#000000"}],"w":200,"h":80},"canvas":{}}},{"x":800,"y":200,"w":200,"h":80,"rotate":0,"bg":{"padding":10,"radius":5,"color":"#ff0000"},"lock":{"scale":false},"source":{"type":"font","src":{"size":50,"family":"微軟正黑體","color":"#000000","bg":{"color":"#ff00ff","size":5},"align":{"h":1,"v":1},"text":"帥氣","type":1,"continuous_text":[{"text":"[A-Za-z]+","escape":false,"color":"#000000"}],"w":200,"h":80},"canvas":{}}},{"x":800,"y":67,"w":200,"h":80,"rotate":0,"bg":{"padding":10,"radius":5,"color":"#ff0000"},"lock":{"scale":false},"source":{"type":"font","src":{"size":50,"family":"微軟正黑體","color":"#000000","bg":{"color":"#ff00ff","size":5},"align":{"h":1,"v":1},"text":"可愛","type":1,"continuous_text":[{"text":"[A-Za-z]+","escape":false,"color":"#000000"}],"w":200,"h":80},"canvas":{}}},{"x":0,"y":0,"w":1200,"h":630,"rotate":0,"bg":{"padding":30,"radius":20,"color":"#ff0000"},"source":{"type":"image","src":"http://img1.funfunquiz.com/2017/05/19/9cIcuSf4xKRo.jpg","canvas":{}}}]
	

	
	
	var c=new MergeImage(1200,630);
	$element[0].querySelector("#canvas_block").appendChild(c.getDom())
	
	c.setOption('whxy',true);
	c.setOption('boder',true);
	
	c.setData($scope.data)
	.watch(function(){
		$scope.$apply();
	})

	$scope.$watch("data",function(n,o){
		if(n.length==o.length){
			for(var i in n){
				if(!angular.equals(n[i].source.src,o[i].source.src)){
					delete c.level_canvas[i];
				}
			}
		}
		c.draw();
	},1)
	
	$scope.control=c;

	
	$scope.swap=function(index,swap_index){
		var tmp=$scope.data[index];
		$scope.data[index]=$scope.data[swap_index];
		$scope.data[swap_index]=tmp;
		if(c.select){
			if(c.select.i==swap_index){
				c.select.i=index
			}else if(c.select.i==index){
				c.select.i=swap_index
			}
			let whxy=$scope.data[c.select.i];
			c.select.x=whxy.x;
			c.select.y=whxy.y;
			c.select.w=whxy.w;
			c.select.h=whxy.h;
		}
		c.draw();
	};
	
	$scope.del=function(){
		if(!confirm("確認刪除?")){
			return;
		}
		var index=$scope.control.select.i
		$scope.data.splice(index,1)
		$scope.draw();
	}
	$scope.copy=function(){
		var index=$scope.control.select.i
		var clone=angular.copy($scope.data[index])
		
		$scope.data.unshift(clone)
		$scope.control.select.i=0
		alert("複製成功，移動到新圖層")	
	}
	window.data=$scope.data;
	$scope.read=function(base64){
		$scope.data[$scope.control.select.i].source.src=base64
	}
	$scope.back={
		wh:function(){
			var w=$scope.data[$scope.control.select.i].source.canvas.naturalWidth
			var h=$scope.data[$scope.control.select.i].source.canvas.naturalHeight
			$scope.data[$scope.control.select.i].w=w
			$scope.data[$scope.control.select.i].h=h
			$scope.draw();
		},
		scale:function(){
			var w=$scope.data[$scope.control.select.i].source.canvas.naturalWidth
			var h=$scope.data[$scope.control.select.i].source.canvas.naturalHeight
			var scale=w/h;
			
			$scope.data[$scope.control.select.i].h=$scope.data[$scope.control.select.i].w/scale >> 0;
			$scope.draw();
		},
	}
	$scope.change_type=function(whxy,name){
		if(whxy.source.type){
			if(!confirm('確認變換類型?資料會清空'))return;
		}
		whxy.source={}
		if(name=="font"){
			whxy.source.type="font";
			whxy.source.src={
				"size":20,"family":"微軟正黑體","color":"#000000",
				"bg":{"color":"#000000","size":0},
				"align":{"h":1,"v":1},
				"text":"新圖層",
				"type":1,
				"continuous_text":[{"text":"[A-Za-z]+","escape":false,}],
				"w":whxy.w,"h":whxy.h,
			}
		}else if(name=="image"){
			whxy.source.type="image";
		}	
		$scope.draw();			
	}
	$scope.add=function(){
		$scope.data.unshift({
			"x":0,"y":0,
			"w":500,"h":500,
			"rotate":0,
			"bg":{"padding":0,"radius":0,"color":"rgba(255,255,255,1)"},
			"lock":{},
			source:{},
		})
	}
}],
})