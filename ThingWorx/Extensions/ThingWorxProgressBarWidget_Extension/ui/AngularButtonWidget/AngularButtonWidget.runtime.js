(function () {
    'use strict';


    TW.Runtime.Widgets.AngularButtonWidget = function(){
        var thisWidget = this;

        var AngularButtonCtrl =function($scope){
            $scope.count = thisWidget.getProperty('hoverCount');
            if($scope.count===undefined) $scope.count=999;

            $scope.doActionOnHover = function(){
                $scope.count++;
                thisWidget.setProperty('hoverCount', $scope.count);
                thisWidget.jqElement.triggerHandler('Hover');
            };

            $scope.doActionOnClick = function(){
                thisWidget.jqElement.triggerHandler('Clicked');
            };

            $scope.doActionOnDoubleClick = function(){
                thisWidget.jqElement.triggerHandler('DoubleClicked');
            };



        };
        this.runtimeProperties = function(){
            return{
              'needsError':true,
              'angularSupport':true
            };
        };

        this.renderHtml = function(){
          return '<div class="widget-content widget-angular-button" style="border-radius: 2px;" ></div>';
        };

        this.afterRender = function(){

            angular.module(thisWidget.jqElementId, []).controller('AngularButtonCtrl', AngularButtonCtrl);
            var jqElement = thisWidget.jqElement; //you can use thisWidget or this, they both refer to the TW.Runtime.Widgets.AngularButtonWidget context;
            var html = '<div ng-controller="AngularButtonCtrl" >'+
                       '<span style="line-height:'+thisWidget.getProperty("Height")+'px" ng-mousemove="doActionOnHover()" ng-click="doActionOnClick()">{{count}}</span>'+
                       '</div>'
            jqElement.html(html);

            angular.bootstrap(jqElement[0], [thisWidget.jqElementId]);
        };

        this.updateProperty = function(updatePropertyInfo){

        };
        this.beforeDestroy = function(){

        };
    };

})();
