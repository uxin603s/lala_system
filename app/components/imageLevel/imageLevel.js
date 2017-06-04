angular.module('app').component("imageLevel",{
bindings:{
	
},
templateUrl:'/app/components/imageLevel/imageLevel.html',
controller:["$scope","$http","$timeout","$element",function($scope,$http,$timeout,$element){
	
	$scope.list=[];
	$scope.get=function(){
		var post_data={
			func_name:"ImageLevel::getList",
			arg:{}
		};
		$http.post('/ajax.php',post_data)
		.then(function(res){
			$scope.list=res.data.list
			// console.log(res.data)
		})
		// console.log('get')
	};
	$scope.add=function(){
		//新增資料庫
		//新增圖層json
		//新增合成圖當封面
	};
	$scope.ch=function(){};
	$scope.del=function(){};
	$scope.upload=function(data){
		return
		var f=new FormData;
		f.append('func_name',"ImageLevel::upload")
		f.append('arg[id]',1)
		f.append('file',new Blob([JSON.stringify(angular.copy($scope.data))]));

		var xhr=new XMLHttpRequest;
		xhr.open("post","/ajax.php");
		xhr.onloadend=function(){
			console.log(this.response)
		}
		xhr.send(f)
		return
		var post_data={
			func_name:"ImageLevel::upload",
			arg:{
				// file:,
			}
		}
		$http.post("/ajax.php",post_data).then(function(res){
			console.log(res.data)
		})
		return
	}
	$scope.$ctrl.$onInit=function(){
		$scope.get();
	}
	
}],
})