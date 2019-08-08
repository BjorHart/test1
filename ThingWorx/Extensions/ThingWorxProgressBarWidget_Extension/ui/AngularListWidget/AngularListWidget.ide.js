TW.IDE.Widgets.AngularListWidget = function(){

    this.widgetIconUrl = function(){
        return '../Common/extensions/AngularListWidget_ExtensionPackage/ui/AngularListWidget/AngularListWidget.ide.png';
    }


    var thisWidget = this;
    this.widgetProperties = function(){
        return {
          'name': 'AngularListWidget',
          'description': 'An angular implementation of a basic list',
          'category': ['Common'],
          'defaultBindingTargetProperty': 'Data',
          'properties':{
            'Width':{
              'defaultValue': 140,
              'isEditable': true
            },
            'Height':{
              'defaultValue': 240,
              'isEditable': true
            },
            'Data':{
              'isBindingTarget':true,
              'isEditable': false,
              'baseType': 'INFOTABLE',
              'warnIfNotBoundAsTarget': true
            },
            'RowHeight':{
              'defaultValue':30,
              'baseType':'NUMBER'
            },
            'DisplayField':{
              'defaultValue':'name',
              'baseType':'STRING',
              'isEditable': true
            }
          }
        };
    };

    this.widgetEvents = function(){
        return {
          'DoubleClicked':{}
        };
    };

    this.renderHtml = function(){

        var html = '';
        html+='<div class="widget-content widget-angular-list">';
        html+='</div>';
        return html;
    };

    this.afterRender = function(){
      angular.module(thisWidget.jqElementId, []).controller('listCtrl', function($scope){
        $scope.items = ['item1','item2','item3'];
      });

      var jqElement = this.jqElement;
      jqElement.html(
          '<div ng-controller="listCtrl">'+
              '<ul><li ng-repeat="i in items"><span>{{i}}</span></li></ul>'+
          '</div>');

      angular.bootstrap(jqElement[0], [thisWidget.jqElementId]);


    }
    this.afterSetProperty = function (name, value) {
        var result = false;
        switch (name) {
            default:
                break;
        }
        return result;

    };

    this.afterAddBindingSource = function (bindingInfo){
        var scope = angular.element(this.jqElement.find('div[ng-controller]')[0]).scope();
        if(bindingInfo['targetProperty']==='Data'){
            scope.$apply(
              function(){
                  scope.items = ['boundData1','boundData2','boundData3','dataIsBoundToWidget'];

              }
            );
        }

    }

    this.beforeDestroy = function(){

    };

    return this;
}
