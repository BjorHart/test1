(function () {
    'use strict';

    angular.module('AngularListWidget', []).directive('angularList',angularList);

    function angularList() {
        return{
          restrict: 'EA',
          template: '<ul><li ng-repeat="i in items">{{i}}</li></ul>'
        };
    }

    TW.Runtime.Widgets.AngularListWidget = function(){
        var thisWidget = this;
        var defaultItems = [];

        this.runtimeProperties = function(){
            return{
              'needsError':true,
              'angularSupport':true
            };
        };

        this.renderHtml = function(){
          return '<div class="widget-content widget-angular-list"></div>';
        };

        this.afterRender = function(){
            angular.module(thisWidget.jqElementId, ['AngularListWidget']);
            angular.module(thisWidget.jqElementId).controller('angularListCtrl', function($scope){
                $scope.items = ['Item1','Item2','Item3','Item4'];
                $scope.updateItems = function (items){
                  $scope.$apply(
                    function(){
                        $scope.items = items;
                    });
                };
            });

            var jqElement = this.jqElement;
            jqElement.html('<div ng-controller="angularListCtrl"><angular-list></angular-list></div>');
            angular.bootstrap(jqElement[0], [thisWidget.jqElementId]);

            var scope = angular.element(jqElement.find('div[ng-controller]')[0]).scope();
            scope.updateItems(undefined);
        };

        this.updateProperty = function(updatePropertyInfo){
              this.setProperty('Data', updatePropertyInfo.ActualDataRows);
              var myDataShape = updatePropertyInfo.ActualDataRows;
              var jqElement = this.jqElement;
              var scope = angular.element(jqElement.find('div[ng-controller]')[0]).scope();
              var rowsToDisplay = new Array();
              var displayField = this.getProperty('DisplayField')
              if(this.getProperty('DisplayField')!==undefined){
                myDataShape.forEach(function(entry){
                  if (entry.hasOwnProperty(displayField)) {
                      rowsToDisplay.push(entry[displayField]);
                  }
                });
              }
              scope.updateItems(rowsToDisplay);
        };
        this.beforeDestroy = function(){

        };
    };

})();
