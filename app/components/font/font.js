angular.module('app').component("font",{
bindings:{
	
},
templateUrl:'/app/components/font/font.html',
controller:["$scope","$http","$timeout","$element",function($scope,$http,$timeout,$element){
	$scope.upload=function(){
		var f=new FormData;
		f.append('func_name',"font::insert")
		f.append('arg[data]',data)
		f.append('arg[name]',$scope.name)
		var xhr=new XMLHttpRequest();
		xhr.open("POST","/ajax.php", true);
		xhr.onreadystatechange = function(e){
			if(this.readyState == 4 && this.status == 200) {
		        console.log(this.responseText);
		    }
		};
		xhr.send(f);
	}
	$scope.get=function(){
		var post_data={
			func_name:"font::insert",
			arg:{
				name:123,
			},
		};
		$http.post("/ajax.php",post_data)
		.then(function(res){
			console.log(res)
		})
	}
	$scope.get();
	$scope.add=function(data){
		
	}
	$scope.ch=function(id,name){
		var post_data={
			func_name:"font::update",
			arg:{
				update:{name:name},
				where:{id:id},
			},
		}
		$http.post("/ajax.php",post_data,function(res){

		})
	}
	$scope.del=function(id){
		var post_data={
			func_name:"font::del",
			arg:{
				id:id,
			},
		}
		$http.post("/ajax.php",post_data,function(res){

		})
	}
}]
})