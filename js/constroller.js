/*
* @Author: huoqishi
* @Date:   2016-07-29 10:40:40
* @Last Modified by:   huoqishi
* @Last Modified time: 2016-07-29 15:51:16
*/


(function(angular){
  'use strict';

  // 因为我们要在控制器中使用这个服务，所有我们要在控制器的模块中引入这个服务模块
  var app = angular.module('todoApp.controller',['todoApp.service']);

  // 2.创建控制器
  app.controller('todoController',['$scope','$location',
    'MyService',
    // 我们注入的这样一个MyService服务其实就是那个构建函数的对象.
    function($scope,$location,MyService){
    // MyService.get();
      // console.log($location.url());
     // 功能1 展示数据列表
     $scope.tasks=MyService.get();

     // 功能2 添加任务
     // 暴露一个数据模型，用来绑定文本框的值
     $scope.newTask='';
     $scope.add=function(){

        if(!$scope.newTask){
          return;
        }
        // 为了确定id唯一,我们使用数组中最后一个元素的id+1;
        // 数组的长度-1，就是数组最后一个元素的索引.
        
        // 标记
        MyService.add($scope.newTask);

        $scope.newTask='';
     }


     // 功能3.删除任务
     $scope.remove=function(id){
        // 标记
        MyService.remove(id);
     }

     // 功能4 修改任务
     $scope.isEditingId=-1;   // isEditingId==item.id
     $scope.edit=function(id){
       // 编辑功能并不需要手动操作数组，因为这双向数据绑定
      $scope.isEditingId=id;
     }

     // 保存
     $scope.save=function(){
       $scope.isEditingId=-1;
       // 标记
       MyService.save();
     }

     // 功能5 切换任务状态
     // 该功能已完成



     // 功能6 批量切换任务状态
     var flag=true;
     $scope.toggleAll=function(){
       // 遍历数组，让数组中每个元素的每个completed属性为true
       // 标记
       MyService.toggleAll(flag);
       flag=!flag;
     }

     // 功能7 删除所有已完成任务
     $scope.clearAllCompleted=function(){

       // 遍历数组删除,所有已完成任务
       // 不要在循环中改变数组长度,在循环中改变数组长度会导致循环条件发生变化，可以后面的循环就不执行。
       // for (var i = 0; i < $scope.tasks.length; i++) {
       //   var item =$scope.tasks[i];
       //   if(item.completed){
       //      $scope.tasks.splice(i,1);
       //      i--;
       //   }
       //  
       // }
      
      // var temp =[afaf]
      // 我们可以遍历数组，把所有未完成的任务放到临时数组，然后遍历结束后把把数组重新指向临时数组

      // 标记
       $scope.tasks = MyService.clearAllCompleted();
      // $scope.tasks=MyService.get();
      // $scope.tasks=temp;
     }

     // 控制删除按钮的显示或隐藏
     $scope.isShow=function(){
       // 遍历数组，判断数组中的元素有没有complete为true，只要有就返回true,一个都没有返回false
       
       for (var i = 0; i < $scope.tasks.length; i++) {
           var item = $scope.tasks[i];
           if(item.completed){
               return true;
           }
       }
       return false;
     }

     // 8.显示未完成任务数
     // 使用$watch监视数据模型的变化
     $scope.leftNumber=0;

     // 想监视的数据模型的字符形式的名字,
     $scope.$watch('tasks',function(newValue,oldValue){
        $scope.leftNumber=MyService.showActiveCount(newValue);
        MyService.save();
     },true);// 为true是表示深度监听,为监视数组中每个元素的每个属性的变化。


     // 功能9 切换不同状态任务的显示
     $scope.isCompleted={};

     // // 显示未完成的任务
     // $scope.active=function(){
     //    $scope.isCompleted={completed:false};
     // }

     // // 显示已完成的任务
     // $scope.completed=function(){
     //   $scope.isCompleted={completed:true}
     // }

     // // 显示所有任务
     // $scope.all=function(){
     //   $scope.isCompleted={};
     // }

     // 根据页面url中的锚点动态的显示不同状态的任务
     var hash = $location.url();
     
    
     // 我们只能够使用$watch监视$scope的属性值,不能监视不变的值
     // $scope.myhash = $location.url();// 不能够直接监视myhash,因为$location.url()执行一遍之后就是一个固定的字符串了，它是不变的。

     $scope.loca = $location;
     // 我们的$watch也可以监视一个方法，但是必须是$scope的属性。
     $scope.$watch('loca.url()',function(newValue,oldValue){
        ///window.addEventListener('hashchange')
        // console.log(newValue);
        // console.log(oldValue);
        switch(newValue){
         case '/active':
           $scope.isCompleted={completed:false};
           break;
         case '/completed':
          $scope.isCompleted={completed:true};
           break;
         default :
          $scope.isCompleted={};
           break
       }
     });
  }])

})(angular)