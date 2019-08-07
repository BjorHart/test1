TW.IDE.Widgets.googlelocation = function () {
    this.widgetProperties = function () {
        return {
            'name': 'Google Location Picker',
            'description': 'Enables the user to enter a location using Google\'s location services',
            'category': ['Common', 'Data'],
            'isResizable': false,
            'supportsLabel': false,
			'isExtension':true,
			'borderWidth': 1,
			'supportsResetInputToDefault': true,
            'defaultBindingTargetProperty': 'Location',
            'iconImage': 'location.ide.png',
            'properties': {
                'Longitude': {
                    'description': 'The location longitude.',
                    'isEditable': true,
                    'isVisible': true,
                    //'defaultValue': '',
                    'baseType': 'NUMBER'
                },
                'Latitude': {
                    'description': 'The location latitude.',
                    'isEditable': true,
                    'isVisible': true,
                    //'defaultValue': '',
                    'baseType': 'NUMBER'
                },
                'Elevation': {
                    'description': 'The location elevation.',
                    'isEditable': true,
                    'isVisible': true,
                    'defaultValue': 0,
                    'baseType': 'NUMBER'
                },
                'Units': {
                    'description': 'The location units.',
                    'isEditable': false,
                    'isVisible': true,
                    'defaultValue': 'WGS84',
                    'baseType': 'STRING'
                },
                'Location': {
                    'description': 'The location value.',
                    'isBindingTarget': true,
                    'isBindingSource': true,
                    'isEditable': false,
                    'isVisible': true,
                    'defaultValue': undefined,
                    'baseType': 'LOCATION'
                },
                'ShowElevation': {
                    'description': 'Display elevation or not.',
                    'defaultValue': true,
                    'baseType': 'BOOLEAN'
                },
                'ShowUnits': {
                    'description': 'Display units or not.',
                    'defaultValue': true,
                    'isEditable': true,
                    'isVisible': true,
                    'baseType': 'BOOLEAN'
                },
                'UseMap': {
                    'description': 'Enable location selection via Google Maps.',
                    'defaultValue': true,
                    'isEditable': true,
                    'isVisible': true,
                    'baseType': 'BOOLEAN'
                },
                'MapWidth': {
                    'description': 'width of map widget',
                    'isEditable': true,
                    'baseType': 'NUMBER',
                    'defaultValue': 600
                },
                'MapHeight': {
                    'description': 'height of map widget',
                    'isEditable': true,
                    'baseType': 'NUMBER',
                    'defaultValue': 400
                },
                'Width': {
                    'description': 'width of widget',
                    'baseType': 'NUMBER',
                    'defaultValue': 175
                },
                'Height': {
                    'description': 'height of widget',
                    'baseType': 'NUMBER',
                    'defaultValue': 213
                },
                'TabSequence': {
                    'description': 'Tab sequence index',
                    'baseType': 'NUMBER',
                    'defaultValue': 0
                },
				'Style' : {
					'baseType': 'STYLEDEFINITION',
					'defaultValue': 'DefaultGoogleLocationStyle'
				}
            }
        };
    };

    this.renderHtml = function () {
        var html = '';
        html += '<div class="widget-content widget-location widget-google-location-picker">' +
        	'<div class="coreLocationPicker">' +
	        	'<label>Longitude</label>' +
				'<input class="longitudeField" type="text" value="' + ((this.getProperty('Longitude') !== undefined) ? this.getProperty('Longitude') : '') + '"></input>' +
				'<label>Latitude</label>' +
				'<input class="latitudeField" type="text" value="' + ((this.getProperty('Latitude') !== undefined) ? this.getProperty('Latitude') : '') + '"></input>' +
				(this.getProperty('ShowElevation') === true ? '<label>Elevation</label><input class="elevationField" type="text" value="' + ((this.getProperty('Elevation') !== undefined) ? this.getProperty('Elevation') : '') + '"></input>' : '') +
				(this.getProperty('ShowUnits') === true ? '<label>Units</label><p>WGS84</p>' : '') +
			'</div>' +
				(this.getProperty('UseMap') === true ? '<div class="locationMapButton"><img align="left" src="../Common/extensions/GoogleWidgets_ExtensionPackage/ui/googlemap/googlemap.ide.png"/><span>Map</span></div>' : '') +
			'</div>';
        return html;
    };
	
	   this.widgetIconUrl = function() {
            return  "../Common/extensions/GoogleWidgets_ExtensionPackage/ui/googlelocation/location.ide.png";
    }

    this.afterSetProperty = function (name, value) {
        var result = false;
        switch (name) {
            case 'Width':
	        case 'Height':
	        case 'Longitude':
	        case 'Latitude':
	        case 'Elevation':
			case 'Style':
                result = true;
                break;
            case 'UseMap':
                var allWidgetProps = this.allWidgetProperties();
                if (value === true) {
                    allWidgetProps['properties']['MapWidth']['isEditable'] = true;
                    allWidgetProps['properties']['MapHeight']['isEditable'] = true;
                    this.properties['MapWidth'] = 600;
                    this.properties['MapHeight'] = 400;
                } else if (value === false) {
                    this.properties['MapWidth'] = 0;
                    this.properties['MapHeight'] = 0;
                    allWidgetProps['properties']['MapWidth']['isEditable'] = false;
                    allWidgetProps['properties']['MapHeight']['isEditable'] = false;
                }
                this.updatedProperties();
                result = true;
                break;
            case 'ShowUnits':
                if (value === true) {
                    this.properties['Height'] = (this.properties['Height'] + 20);
                } else if (value === false) {
                    this.properties['Height'] = (this.properties['Height'] - 20);
                }
                this.updatedProperties();
                result = true;
                break;
            case 'ShowElevation':
                if (value === true) {
                    this.properties['Height'] = (this.properties['Height'] + 50);
                } else if (value === false) {
                    this.properties['Height'] = (this.properties['Height'] - 50);
                }
                this.updatedProperties();
                result = true;
                break;
        }

        return result;
    };
	this.afterRender = function() {
        var widgetReference = this;
        var widgetElement = this.jqElement;
		
  	  	var formatResult = TW.getStyleFromStyleDefinition(widgetReference.getProperty('Style'));
	
		var cssGoogleLocationBackground = TW.getStyleCssGradientFromStyle(formatResult);
		var cssGoogleLocationText = TW.getStyleCssTextualNoBackgroundFromStyle(formatResult);
		var cssGoogleLocationBorder = TW.getStyleCssBorderFromStyle(formatResult);
		
		var resource = TW.IDE.getMashupResource();
		var widgetStyles = '#' + widgetReference.jqElementId + '{'+ cssGoogleLocationBackground  + cssGoogleLocationBorder + cssGoogleLocationText + '}';
		resource.styles.append(widgetStyles);
		
	}

    this.validate = function () {
        var result = [];
        if (!this.isPropertyBoundAsSource('Location')) {
            result.push({ severity: 'warning', message: 'Location for {target-id} is not bound to any target' });
        }

        return result;
    };

};