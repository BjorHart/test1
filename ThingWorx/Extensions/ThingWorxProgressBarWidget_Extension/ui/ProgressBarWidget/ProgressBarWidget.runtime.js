(function () {
    'use strict';


    //todo put position absolute on svg;

    TW.Runtime.Widgets.ProgressBarWidget = function () {

        var thisWidget = this;

        // var textColor = colorScheme.foregroundColor;
        // var textSize = thisWidget.getProperty('TextSize') + 'px';


        this.runtimeProperties = function () {
            return {
                'needsError': true,
                'supportsAutoResize': true
            };
        };

        this.renderHtml = function () {
            return '<div class="widget-content widget-progress-bar" style="height: 100%; width: 100%;"></div>';
            // style="margin:20px; width: '+width+';height: '+height+'"
        };

        this.afterRender = function () {

            var primaryShapeStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('PrimaryShapeStyle'));
            var trailShapeStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('SecondaryShapeStyle'));
            thisWidget.boundingBox[0].style.height = '50%';
            thisWidget.boundingBox[0].style.overflow = 'hidden';

            thisWidget.opts = {
                color: primaryShapeStyle.lineColor,
                strokeWidth: primaryShapeStyle.lineThickness,
                trailColor: trailShapeStyle.lineColor,
                trailWidth: trailShapeStyle.lineThickness,
                maxValue: thisWidget.getProperty('MaxValue'),
                minValue: thisWidget.getProperty('MinValue'),
                displaySymbol: thisWidget.getProperty('DisplaySymbol'),
                transitionDuration: thisWidget.getProperty('TransitionInSeconds'),
                // text: {
                //     // color: textColor,
                //     // fontSize: textSize,
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
            container.style.position = 'relative';
            container.style.display = 'flex';
            container.style.justifyContent = 'center';
            container.style.height = '100%';
            switch (this.getProperty('DisplayStyle')) {
                case 0:
                    thisWidget.progressBar = ProgressBar.Line.init(container, thisWidget.opts);
                    createCustomTextElementForLine();
                    break;
                case 1:
                    thisWidget.progressBar = ProgressBar.Circle.init(container, thisWidget.opts);
                    createCustomTextElementForCircle();
                    break;
                case 2:
                    thisWidget.progressBar = ProgressBar.SemiCircle.init(container, thisWidget.opts);
                    createCustomTextElementForSemiCircle();
                    break
            }



        };

        this.updateProperty = function (updatePropertyInfo) {

            if (updatePropertyInfo.TargetProperty === 'Data') {
                thisWidget.setProperty('Data', updatePropertyInfo.SinglePropertyValue);
                updateValue(thisWidget.getProperty('Data'));

                var shapeStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('PrimaryShapeStyle'));
                var hasFormatting = thisWidget.getProperty('ValueFormat') !== undefined;
                var row = updatePropertyInfo.ActualDataRows[0];
                var stateFormating = thisWidget.getProperty('ValueFormat');

                if (hasFormatting) {
                    shapeStyle = TW.getStyleFromStateFormatting({ DataRow: row, StateFormatting: stateFormating });
                }
                var svg = document.getElementById(thisWidget.jqElementId);
                thisWidget.progressBar.path = svg.getElementsByTagName('path')[1];
                thisWidget.progressBar.setShapeStyle(shapeStyle);
                var style = { transition: thisWidget.getProperty('TransitionInSeconds') + "s all ease-in-out" };
                thisWidget.progressBar.setAnimationStyle(style)
            }
            if (updatePropertyInfo.TargetProperty === 'ValueInformationText') {
                thisWidget.setProperty('ValueInformationText', updatePropertyInfo.SinglePropertyValue);
                //updateValue(thisWidget.getProperty('Value'));
            } if (updatePropertyInfo.TargetProperty === 'MaxValue') {
                thisWidget.setProperty('MaxValue', updatePropertyInfo.SinglePropertyValue);
                updateValue(thisWidget.getProperty('Data'));
            }


        };
        this.beforeDestroy = function () {

        };


        function calculateLargerFontAndAddStylesToSVG(fontsize1, fontsize2) {
            var svg = document.getElementById(thisWidget.jqElementId);

            var x = fontsize1.split(' ')[1];
            x = x.substr(0, x.length - 3);
            var y = fontsize2.split(' ')[1];
            y = y.substr(0, y.length - 3);

            var larger = (x > y) ? x : y;

            svg.children[0].style.fontSize = larger + 'px';
            svg.children[0].style.marginTop = '1.3em';

        }

        function updateValue(newValue) {
            //reinit variables for specific instance of widget.
            var svg = document.getElementById(thisWidget.jqElementId);
            thisWidget.progressBar.path = svg.getElementsByTagName('path')[1];
            thisWidget.progressBar.trail = svg.getElementsByTagName('path')[0];
            thisWidget.progressBar.text = svg.getElementsByTagName('div')[0];
            var valueText = thisWidget.progressBar.text.children[0];
            var infoText = thisWidget.progressBar.text.children[1];

            thisWidget.progressBar.opts.maxValue = thisWidget.getProperty('MaxValue');

            thisWidget.progressBar.setValue(newValue);
            valueText.innerHTML = newValue + thisWidget.opts.displaySymbol;
            infoText.innerHTML = thisWidget.getProperty('ValueInformationText');

            //thisWidget.progressBar.setText(newValue+thisWidget.opts.displaySymbol);
        }


        function createCustomTextElementForCircle() {
            var container = document.createElement('div');
            var valueText = document.createElement('div');
            var valueInfoText = document.createElement('div');

            var valueTextStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('ValueTextStyle'));
            var infoTextStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('InfoTextStyle'));

            container.setAttribute('style', "flex-direction:column;" +
                "text-align:center;" +
                "position:absolute;" +
                "left:0;" +
                "top:0;" +
                "right:0;" +
                "bottom:0;" +
                "width:100%;" +
                "height:100%;" +
                "overflow:visible;" +
                "margin:auto;" +
                "display:flex");

            valueText.style.fontWeight = thisWidget.getProperty('FontWeight');

            valueText.style = TW.getTextSize(valueTextStyle.textSize);
            if (!thisWidget.getProperty('DisplayValue')) valueText.style.display = 'none';
            else valueText.style.display = 'flex';
            valueText.style.height = '50%';
            valueText.style.alignSelf = 'center';
            valueText.style.alignItems = 'flex-end';
            valueText.style.padding = '5px';
            valueText.style.lineHeight = '0.5em';
            valueText.style.color = valueTextStyle.foregroundColor;
            valueText.style.fontWeight = thisWidget.getProperty('ValueFontWeight');
            valueText.innerHTML = '0';

            valueInfoText.style = TW.getTextSize(infoTextStyle.textSize);
            if (!thisWidget.getProperty('DisplayLabel')) valueInfoText.style.display = 'none';
            else valueInfoText.style.display = 'flex';
            valueInfoText.style.height = '50%';
            valueInfoText.style.alignSelf = 'center';
            valueInfoText.style.alignItems = 'flex-start';
            valueInfoText.style.padding = '5px';
            valueInfoText.style.lineHeight = '1em';
            valueInfoText.style.color = infoTextStyle.foregroundColor;
            valueInfoText.style.fontWeight = thisWidget.getProperty('InfoFontWeight');
            valueInfoText.innerHTML = thisWidget.getProperty('ValueInformationText');
            if (valueInfoText.innerHTML === '') {
                valueText.style.marginTop = '0.9em';
            }

            container.appendChild(valueText);
            container.appendChild(valueInfoText);

            thisWidget.progressBar.setCustomTextDisplay(container);
        };

        function createCustomTextElementForSemiCircle() {
            var container = document.createElement('div');
            var valueText = document.createElement('div');
            var valueInfoText = document.createElement('div');

            var valueTextStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('ValueTextStyle'));
            var infoTextStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('InfoTextStyle'));

            container.setAttribute('style', "flex-direction:column;" +
                "text-align:center;" +
                "position:absolute;" +
                "left:0;" +
                "top:0;" +
                "right:0;" +
                "bottom:0;" +
                "width:100%;" +
                "height:50%;" +
                "overflow:visible;" +
                "margin:auto;" +
                "display:flex");

            valueText.style.fontWeight = thisWidget.getProperty('FontWeight');

            valueText.style = TW.getTextSize(valueTextStyle.textSize);
            if (!thisWidget.getProperty('DisplayValue')) valueText.style.display = 'none';
            else valueText.style.display = 'flex';
            valueText.style.height = '65%';
            valueText.style.alignSelf = 'center';
            valueText.style.alignItems = 'flex-end';
            valueText.style.padding = '5px';
            valueText.style.lineHeight = '0.5em';
            valueText.style.color = valueTextStyle.foregroundColor;
            valueText.style.fontWeight = thisWidget.getProperty('ValueFontWeight');
            valueText.innerHTML = '0';

            valueInfoText.style = TW.getTextSize(infoTextStyle.textSize);
            if (!thisWidget.getProperty('DisplayLabel')) valueInfoText.style.display = 'none';
            else valueInfoText.style.display = 'flex';
            valueInfoText.style.height = '35%';
            valueInfoText.style.alignSelf = 'center';
            valueInfoText.style.alignItems = 'flex-start';
            valueInfoText.style.padding = '5px';
            valueInfoText.style.lineHeight = '1em';
            valueInfoText.style.color = infoTextStyle.foregroundColor;
            valueInfoText.style.fontWeight = thisWidget.getProperty('InfoFontWeight');
            valueInfoText.innerHTML = thisWidget.getProperty('ValueInformationText');
            if (valueInfoText.innerHTML === '') {
                valueText.style.marginTop = '1.4em';
            }

            container.appendChild(valueText);
            container.appendChild(valueInfoText);

            thisWidget.progressBar.setCustomTextDisplay(container);
        };


        function createCustomTextElementForLine() {
            var container = document.createElement('div');
            var valueText = document.createElement('div');
            var valueInfoText = document.createElement('div');

            var valueTextStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('ValueTextStyle'));
            var infoTextStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('InfoTextStyle'));

            container.setAttribute('style', "text-align:center;" +
                "position:absolute;" +
                "left:0;" +
                "top:0;" +
                "right:0;" +
                "bottom:0;" +
                "width:100%;" +
                "overflow:visible;" +
                "margin:auto;" +
                "flex-direction:row-reverse;" +
                "justify-content:space-between;" +
                "display:flex");

            valueText.style.fontWeight = thisWidget.getProperty('FontWeight');

            valueText.style = TW.getTextSize(valueTextStyle.textSize);
            if (!thisWidget.getProperty('DisplayValue')) valueText.style.display = 'none';
            else valueText.style.display = 'flex';
            valueText.style.color = valueTextStyle.foregroundColor;
            valueText.style.fontWeight = thisWidget.getProperty('ValueFontWeight');
            valueText.innerHTML = '0';

            valueInfoText.style = TW.getTextSize(infoTextStyle.textSize);
            if (!thisWidget.getProperty('DisplayLabel')) valueInfoText.style.display = 'none';
            else valueInfoText.style.display = 'flex';
            valueInfoText.style.color = infoTextStyle.foregroundColor;
            valueInfoText.style.fontWeight = thisWidget.getProperty('InfoFontWeight');
            valueInfoText.innerHTML = '';

            container.appendChild(valueText);
            container.appendChild(valueInfoText);

            calculateLargerFontAndAddStylesToSVG(TW.getTextSize(valueTextStyle.textSize), TW.getTextSize(infoTextStyle.textSize));

            thisWidget.progressBar.setCustomTextDisplay(container);
        };



    };



})();
