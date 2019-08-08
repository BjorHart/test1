TW.IDE.Widgets.ProgressBarWidget = function(){

    this.widgetIconUrl = function(){
        return '../Common/extensions/ThingWorxProgressBarWidget_Extension/ui/ProgressBarWidget/ProgressBarWidget.ide.png';
    };

    var thisWidget = this;
    thisWidget.ProgressBar = null;
    this.widgetProperties = function(){
        return {
          'name': 'ProgressBarWidget',
          'description': 'A customizable progress bar widget.',
          'category': ['Common'],
          'supportsAutoResize': true,
          'properties':{
              'ValueFormat': {
                  'description': TW.IDE.I18NController.translate('tw.valuedisplay-ide.properties.value-format.description'),
                  'baseType': 'STATEFORMATTING',
                  'baseTypeInfotableProperty': 'Data'    // which property's datashape to use and require being bound in order to configure the renderer, etc.
              },
            'Width':{
              'defaultValue': 100,
              'isEditable': true
            },
            'Height':{
              'defaultValue': 100,
              'isEditable': true
            },
              'DisplayStyle': {
                  'baseType': 'NUMBER',
                  'defaultValue': 1,
                  'selectOptions': [
                      { value: 0, text: 'Bar' },
                      { value: 1, text: 'Circle' },
                      { value: 2, text: 'SemiCircle' }
                  ]
              },
              'PrimaryShapeStyle':{
                  'description':'Progress bar shape color scheme',
                  'baseType':'STYLEDEFINITION',
                  'defaultValue': 'DefaultProgressBarStyle'
              },
              'SecondaryShapeStyle':{
                  'description':'Trail shape color scheme',
                  'baseType':'STYLEDEFINITION',
                  'defaultValue': 'DefaultProgressBarEmptyStyle'
              },
              'ValueTextStyle':{
                  'description':'Value text style options',
                  'baseType':'STYLEDEFINITION',
                  'defaultValue': 'DefaultProgressBarValueStyle'
              },
              'InfoTextStyle':{
                  'description':'Info text style options',
                  'baseType':'STYLEDEFINITION',
                  'defaultValue': 'DefaultProgressBarLabelStyle'
              },
              'Data':{
                  'baseType':'NUMBER',
                  'isEditable':true,
                  'isBindingTarget':true
              },
              'MaxValue':{
                  'baseType': 'NUMBER',
                  'isEditable': true,
                  'isBindingTarget': true,
                  'defaultValue': 100
              },
              'MinValue':{
                  'baseType': 'NUMBER',
                  'isEditable': true,
                  'isBindingTarget': true,
                  'defaultValue': 0
              },
              'DisplaySymbol':{
                  'baseType': 'STRING',
                  'isEditable': true,
                  'isBindingTarget': true,
                  'defaultValue': ''
              },
              'NumberOfDecimals':{
                  'baseType': 'NUMBER',
                  'description': '',
                  'defaultValue': 1,
                  'isEditable': true
              },
              'TransitionInSeconds':{
                  'baseType': 'NUMBER',
                  'description': '',
                  'defaultValue': 0.5,
                  'isEditable': true
              },
              'ValueFontWeight':{
                  'baseType': 'NUMBER',
                  'description': '',
                  'defaultValue': 600,
                  'isEditable': true
              },
              'InfoFontWeight':{
                  'baseType': 'NUMBER',
                  'description': '',
                  'defaultValue': 600,
                  'isEditable': true
              },
              'ValueInformationText':{
                  'baseType': 'STRING',
                  'defaultValue': '',
                  'isEditable': true,
                  'isBindingTarget': true
              },
              'DisplayLabel':{
                  'baseType':'BOOLEAN',
                  'defaultValue': true,
                  'isEditable': true
              },'DisplayValue':{
                  'baseType':'BOOLEAN',
                  'defaultValue': true,
                  'isEditable': true
              }

          }
        };
    };

    this.widgetEvents = function(){
        return {
          'Clicked':{ 'warnIfNotBoundAsTarget':true },
          'Hover':{}
        };
    };

    this.renderHtml = function(){
        var html = '';
        html+='<div class="widget-content widget-progress-bar">';
        html+='</div>';
        return html;
    };

    this.afterRender = function(){

        var primaryShapeStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('PrimaryShapeStyle'));
        var trailShapeStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('SecondaryShapeStyle'));
        var valueTextStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('ValueTextStyle'));
        var infoTextStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('InfoTextStyle'));





        // var textSize = thisWidget.getProperty('TextSize') + 'px';
        // var textColor = colorScheme.foregroundColor;


        var opts = {
            color: primaryShapeStyle.lineColor,
            strokeWidth: primaryShapeStyle.lineThickness,
            trailColor: trailShapeStyle.lineColor,
            trailWidth: trailShapeStyle.lineThickness,
            maxValue: thisWidget.getProperty('MaxValue'),
            minValue: thisWidget.getProperty('MinValue'),
            displaySymbol: thisWidget.getProperty('DisplaySymbol'),
            transitionDuration: thisWidget.getProperty('TransitionInSeconds'),
            //autoStyleText: true,
            // text: {
            //     color: textColor,
            //     fontSize: textSize,
            //     position: 'absolute',
            //     transform: 'translate(-50%, -50%)',
            //     fontFamily: 'Raleway, Helvetica, sans-serif',
            //     left: '50%',
            //     top: '50%',
            //     padding: '0px',
            //     margin: '0px'
            // },
            svgStyle: {
                display: 'block',
                width: '100%',
                height: '100%'
            },
            warnings: false
        };


        var container = thisWidget.jqElement[0];
        switch(this.getProperty('DisplayStyle')){
            case 0:
                thisWidget.progressBar = ProgressBar.Line.init(container, opts);
                break;
            case 1:
                thisWidget.progressBar = ProgressBar.Circle.init(container, opts);
                break;
            case 2:
                thisWidget.progressBar = ProgressBar.SemiCircle.init(container, opts);
                break
        }
        updateValue(14.35);

    };


    this.afterSetProperty = function (name, value) {
        var result = false;
        switch (name) {
            case 'DisplayStyle':
                thisWidget.removeChild(thisWidget.progressBar);
                break;
            default:
                break;
        }
        return result;

    };

    this.afterAddBindingSource = function (bindingInfo){

    };

    this.beforeDestroy = function(){

    };

    return this;

    function updateValue(newValue){
        var nDecimals = thisWidget.getProperty('NumberOfDecimals');
        thisWidget.progressBar.setValue(newValue);
        thisWidget.progressBar.setText(newValue+thisWidget.opts.displaySymbol);
    }
    

};
