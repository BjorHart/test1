TW.IDE.Widgets.AngularButtonWidget = function(){

    this.widgetIconUrl = function(){
        return '../Common/extensions/AngularButtonWidget_ExtensionPackage/ui/AngularButtonWidget/AngularButtonWidget.ide.png';
    }

    var thisWidget = this;
    this.widgetProperties = function(){
        return {
          'name': 'AngularButtonWidget',
          'description': 'An angular implementation of a basic button',
          'category': ['Common'],
          'properties':{
            'Width':{
              'defaultValue': 80,
              'isEditable': true
            },
            'Height':{
              'isEditable': true
            },
            'hoverCount':{
              'defaultValue': 0,
              'isBindingSource': true,
              'isEditable': true,
              'baseType': 'NUMBER',
            }
          }
        };
    };

    this.widgetEvents = function(){
        return {
          'DoubleClicked':{},
          'Clicked':{ 'warnIfNotBoundAsTarget':true },
          'Hover':{}
        };
    };

    this.renderHtml = function(){
        var html = '';
        html+='<div class="widget-content widget-angular-button">A button';
        html+='</div>';
        return html;
    };

    this.afterRender = function(){


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

    }

    this.beforeDestroy = function(){

    };

    return this;
}
