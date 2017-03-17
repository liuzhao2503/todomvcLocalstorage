/*
* @Author: huoqishi
* @Date:   2016-07-29 10:43:09
* @Last Modified by:   huoqishi
* @Last Modified time: 2016-07-29 11:54:05
*/

(function(angular){
  'use strict';

  // 创建服务模块
  var app = angular.module('todoApp.service',[]);



 // 创建服务(自定义服务)
 // service
 // 第一个参数， 一个名字，这个名字是这个服务的名字
 // 第二个参数是一个数组，和控制器的第二个参数类似，也可以注入一个东西
 // 注意：这里数组中的function是一个构建函数,angular会帮助我们new这个构建函数
 app.service('MyService',['$log','$window',function($log,$window){
    
    var storage =  $window.localStorage;
    var str = storage.getItem('todos');
    var todos = JSON.parse(str||'[]');

    // 1.得到数据
    this.get=function(){
      // console.log($window==window);
      return todos;
    }

    // 2.添加数据
    this.add=function(newTask){
        var id;
        if(todos.length==0){
          id=1;
        }else{
          id = todos[todos.length-1].id + 1;
        }
        todos.push({id:id,name:newTask,completed:false})
        this.save();
    }

    // 3.删除数据
    this.remove=function(id){
      // 遍历数据，判断id是否与某条元素的id相等，相等就删除
        for (var i = 0; i < todos.length; i++) {
          var item = todos[i];
          if(item.id==id){
            // 从数组中删除一个元素
            todos.splice(i,1);
            this.save();
            return;// 删除完之后就没有必要继续循环了，直接退出。

          }
      }
    }
    // 4.保存数据
    this.save=function(){
       storage.setItem('todos',JSON.stringify(todos));
    }

    // 6.批量任务状态
    this.toggleAll=function(flag){
      for (var i = 0; i < todos.length; i++) {
         var item = todos[i];
         item.completed=flag;
       }

      this.save();
    }

    // 7.删除所有已完成任务
    this.clearAllCompleted=function(){
      var temp =[];// $scope.tasks
      for (var i = 0; i < todos.length; i++) {
        var item = todos[i];
        if(!item.completed){
          temp.push(item);
        }
      }
      todos= temp; // 这句话之后我们的todos重新指向了一个新的数组，不再和$scope.task指向同一个值
      this.save();
      return todos;
    }

    // 8.显示未完成的任务数
    this.showActiveCount=function(newValue){
      var leftNumber=0;
        for (var i = 0; i < newValue.length; i++) {
          var item = newValue[i];
          if(!item.completed){
            leftNumber++;
          }
        }
        return leftNumber;
    }
 }])
})(angular)