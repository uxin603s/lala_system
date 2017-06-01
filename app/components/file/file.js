angular.module('app').component("file",{
bindings:{
	format:'=',
	callback:'=',
},
templateUrl:'/app/components/file/file.html',
controller:["$scope","$http","$timeout","$element",function($scope,$http,$timeout,$element){
	$element[0].querySelector('[type=file]').addEventListener('change',function(e){
		var files=e.target.files;
		for(var i in files){
			var file=files[i];
			if(file instanceof File){
				console.log($scope.$ctrl.format)
				var reader = new FileReader();					
				reader.onload=function(e){
					// console.log(e)
					var data=e.target.result;
					if($scope.$ctrl.format=="json"){
						if(data){
							data=JSON.parse(data);
						}
					}
					$scope.$ctrl.callback && $scope.$ctrl.callback(data);
					$scope.$apply();
				}
				
				if($scope.$ctrl.format=="json"){
					reader.readAsText(file);	
				}else if($scope.$ctrl.format=="image"){
					reader.readAsDataURL(file);	
				}			
			}
		}
		this.value=''
	})

}],
})

// .directive('file',[function(){
// 	return {
// 		templateUrl:'/app/directives/?t='+Date.now(),
// 		restrict: 'E',
// 		scope:{
// 			multiple:'=',
// 			data:'=',
// 			name:'=',
// 			text:'@',
// 			type:'@',
// 			format:'@',
// 		},
// 		link:function($scope,$element){
// 			$scope.load_file=function (file,callback){
// 				var reader = new FileReader();					
// 				reader.onload=function(e){
// 					var data=e.target.result;
// 					if($scope.format=="json"){
// 						if(data){
// 							data=JSON.parse(data);
// 						}
// 					}
// 					callback && callback(data);
// 					$scope.$apply();
// 				}
				
// 				if($scope.format=="json"){
// 					reader.readAsText(file);	
// 				}else if($scope.format=="image"){
// 					reader.readAsDataURL(file);	
// 				}
// 			}
// 			$scope.finish=function(result){
// 				if(!$scope.multiple)result=result.pop();
// 				// console.log(result);
// 				if(typeof $scope.data=="function"){
// 					$scope.data(result)
// 				}else{
// 					for(var i in $scope.data){
// 						delete $scope.data[i];
// 					}
// 					for(var i in result){
// 						$scope.data[i]=result[i];
// 					}	
// 				}
// 			}
			
// 			// console.log($scope,$element)
// 			if($scope.type==1){//存檔
// 				$scope.$watch("data",function(data){
// 					window.URL.revokeObjectURL($scope.href)
// 					var json=JSON.stringify(angular.copy(data));		
// 					var blob = new Blob([json],{type: "octet/stream"});
// 					$scope.href = window.URL.createObjectURL(blob);
// 				},1)
				
// 			}else if($scope.type==2){//讀檔
// 				$scope.$watch("multiple",function(multiple){
// 					// $element[0].querySelector('[type=file]').prop("multiple",multiple);
					
// 				},1)

// 				$element[0].querySelector('[type=file]').addEventListener('change',function(){
// 					var files=e.target.files;
// 					var start_count=0;
// 					var result=[];
// 					for(var i in files){
// 						if(files[i] instanceof File){
// 							start_count++;
// 							// console.log(files[i].size)
// 							$scope.load_file(files[i],function(data){
// 								result.push(data);
// 								if(start_count==result.length){
// 									$scope.finish(result);
// 								}
// 							});
// 						}
// 					}
// 					$(this).val('')
// 				})
				
// 			}
			
// 		}
// 	}
// }])