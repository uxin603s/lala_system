angular.module('app').component("index",{
bindings:{
	
},
templateUrl:'/app/components/index/index.html',
controller:["$scope","$http","$timeout","$element",function($scope,$http,$timeout,$element){
	$scope.data=[{"x":799,"y":466,"w":200,"h":80,"rotate":0,"bg":{"padding":10,"radius":5,"color":"rgba(0,0,0,0.5)"},"lock":{"scale":false},"source":{"type":"font","src":{"size":50,"family":"微軟正黑體","color":"#000000","bg":{"color":"#ff00ff","size":5},"align":{"h":1,"v":1},"text":"無知","type":1,"continuous_text":[{"text":"[A-Za-z]+","escape":false,"color":"#000000"}],"w":200,"h":80},"canvas":{}}},{"x":800,"y":329,"w":200,"h":80,"rotate":0,"bg":{"padding":10,"radius":5,"color":"#ff0000"},"lock":{"scale":false,"whxy":false,"hide":false},"source":{"type":"font","src":{"size":50,"family":"微軟正黑體","color":"#000000","bg":{"color":"#ff00ff","size":5},"align":{"h":1,"v":1},"text":"無助1234564878978","type":0,"continuous_text":[{"text":"[A-Za-z]+","escape":false,"color":"#000000"}],"w":200,"h":80},"canvas":{}}},{"x":800,"y":200,"w":200,"h":80,"rotate":0,"bg":{"padding":10,"radius":5,"color":"#ff0000"},"lock":{"scale":false},"source":{"type":"font","src":{"size":50,"family":"微軟正黑體","color":"#000000","bg":{"color":"#ff00ff","size":5},"align":{"h":1,"v":1},"text":"帥氣","type":1,"continuous_text":[{"text":"[A-Za-z]+","escape":false,"color":"#000000"}],"w":200,"h":80},"canvas":{}}},{"x":800,"y":67,"w":200,"h":80,"rotate":0,"bg":{"padding":10,"radius":5,"color":"#ff0000"},"lock":{"scale":false},"source":{"type":"font","src":{"size":50,"family":"微軟正黑體","color":"#000000","bg":{"color":"#ff00ff","size":5},"align":{"h":1,"v":1},"text":"可愛","type":1,"continuous_text":[{"text":"[A-Za-z]+","escape":false,"color":"#000000"}],"w":200,"h":80},"canvas":{}}},{"x":0,"y":0,"w":1200,"h":630,"rotate":0,"bg":{"padding":30,"radius":20,"color":"#ff0000"},"source":{"type":"image","src":"http://img1.funfunquiz.com/2017/05/19/9cIcuSf4xKRo.jpg","canvas":{}}}]
	var c=new MergeImage(1200,630);
	$element[0].querySelector("#canvas_block").appendChild(c.getDom())
	
	c.setOption('whxy',true);
	c.setOption('boder',true);
	
	c.setData($scope.data)
	.watch(function(data){
		$scope.$apply();
	})
	
	$scope.control=c;

	$scope.draw=function(){
		$timeout.cancel($scope.timer)
		$scope.timer=$timeout(function(){
			c.draw();
		},50)
	};
	$scope.swap=function(index,swap_index){
		c.swap(index,swap_index)
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
		delete clone.source.canvas;
		delete clone.source.src.w
		delete clone.source.src.h
		console.log(clone)
		$scope.data.unshift(clone)
		$scope.control.select.i=0
		$scope.draw();		
		alert("複製成功，移動到新圖層")	
	}
	window.data=$scope.data;
	$scope.read=function(base64){
		$scope.data[$scope.control.select.i].source.src=base64
		delete $scope.data[$scope.control.select.i].source.canvas;
		$scope.draw();
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
}],
})