TW.Runtime.Widgets.googlelocation = function () {
    var thisWidget = this;
    this.DEFAULT_ZOOM = 3;
    var defaultValue = undefined;
    this.mapOpen = false;
    this.mapEl = undefined;
    
    this.map = undefined;
    this.mapMarker = undefined;
    
    this.haveGoogleMaps = false;

    this.renderHtml = function () {
        var html = '<div class="widget-content widget-location widget-google-location-picker" >' +
	    	'<div class="coreLocationPicker">' +
	        	'<label>Longitude</label>' +
				'<input class="longitudeField" type="text" value="' + ((this.getProperty('Longitude') !== undefined) ? this.getProperty('Longitude') : '') + '" tabindex="' + thisWidget.getProperty('TabSequence') + '"></input>' +
				'<label>Latitude</label>' +
				'<input class="latitudeField" type="text" value="' + ((this.getProperty('Latitude') !== undefined) ? this.getProperty('Latitude') : '') + '" tabindex="' + thisWidget.getProperty('TabSequence') + '"></input>' +
				(this.getProperty('ShowElevation') === true ? '<label>Elevation</label><input class="elevationField" type="text" value="' + ((this.getProperty('Elevation') !== undefined) ? this.getProperty('Elevation') : '') + '" tabindex="' + thisWidget.getProperty('TabSequence') + '"></input>' : '') +
				(this.getProperty('ShowUnits') === true ? '<label>Units</label><p>WGS84</p>' : '') +
			'</div>';

        html = html + '<div class="placeholderLocationMap"></div>';
        html = html + '</div>';
        return html;
    };
    
    function scriptLoaded(data, textStatus, jqxhr) {
        try {
            if (jqxhr.status >= 200 && jqxhr.status < 400 ) {
                if (google !== undefined && google !== null) {
                    thisWidget.haveGoogleMaps = true;
                }
            
                var appendLocationMapBtn = '';
                if(thisWidget.getProperty('UseMap') && thisWidget.haveGoogleMaps === true) {
                    appendLocationMapBtn = '<div class="locationMapButton"><img align="left" src="../Common/extensions/GoogleWidgets_ExtensionPackage/ui/googlemap/googlemap.ide.png"/><span>Map</span></div>'
                }
                $( "div.placeholderLocationMap" ).replaceWith(appendLocationMapBtn);
            }
        }
        catch (errmsg) {
             TW.log.error("Not able to instantiate google");
        }
        
        var domElementId = thisWidget.jqElementId;
        var widgetElement = thisWidget.jqElement;
        var widgetProperties = thisWidget.properties;
        var widgetReference = thisWidget;
        
        var formatResult = TW.getStyleFromStyleDefinition(widgetReference.getProperty('Style', 'DefaultGoogleLocationStyle'));
    
        var cssGoogleLocationBackground = TW.getStyleCssGradientFromStyle(formatResult);
        var cssGoogleLocationText = TW.getStyleCssTextualNoBackgroundFromStyle(formatResult);
        var cssGoogleLocationBorder = TW.getStyleCssBorderFromStyle(formatResult);
        
        var styleBlock = 
            '<style>' +
                '#' + widgetReference.jqElementId + '{'+ cssGoogleLocationBackground  + cssGoogleLocationBorder + cssGoogleLocationText + '}' +
            '</style>';
        
        $(styleBlock).prependTo(widgetElement);
        
        
        var locationMapId = domElementId + '-location-map';

        if (widgetReference.haveGoogleMaps) {
            $('body').append('<div id="' + locationMapId + '" class="locationMap"  style="display:none;position:absolute;height:' + thisWidget.getProperty('MapHeight') + 'px;width:' + thisWidget.getProperty('MapWidth') + 'px;"/>');
            thisWidget.mapEl = $('#' + locationMapId);
            thisWidget.mapEl.css('z-index', 20000);

            widgetElement.find('.locationMapButton').on('click', function () {
                var locationPickerOffset = widgetElement.offset();
                if (widgetReference.mapOpen === true) {
                    // get the div where the map will go
                    widgetReference.mapOpen = false;
                    widgetReference.mapEl.hide();
                } else {
                    widgetReference.mapEl.show();
                    widgetReference.mapEl.css('top', (locationPickerOffset.top + widgetElement.outerHeight()) + 'px');
                    widgetReference.mapEl.css('left', locationPickerOffset.left + 'px');
                    
                    // commenting out to fix https://thingworx.jira.com/browse/TWEXTENSIONS-3
                    // appears to work ok. not sure why the if statement was here ROE 6/7/13
                    //if(widgetReference.map === undefined) {
                        widgetReference.configureAndDisplayMap();
                    //}
                    
                    widgetReference.mapOpen = true;
                }
            });
        }

        // change handlers for each editable field
        // get the Latitude field
        var latitudeField = widgetElement.find('.latitudeField');
        
        latitudeField.change(function (event) {

            // check the source of the event. If it's the map, do nothing
            if (event.currentTarget === latitudeField.get(0)) {
                if (TW.isNumber(latitudeField.val())) {
                    widgetReference.setProperty('Latitude', latitudeField.val());

                    var newLatLocation = null;

                    // has the location object been set?
                    if (widgetProperties['Location'] !== undefined) {
                        // get the location object that exists
                        newLatLocation = widgetProperties['Location'];
                    } else {
                        // create a new location object
                        newLatLocation = new Object();
                        newLatLocation.longitude = widgetProperties['Longitude'];
                    }

                    // set the new latitude on the location object
                    newLatLocation.latitude = latitudeField.val();
                    // reset the location property
                    widgetReference.setProperty('Location', newLatLocation);
                    // change the map
                    if (widgetReference.haveGoogleMaps) {
                        if (widgetReference.mapMarker !== undefined) {
                            widgetReference.mapMarker.setPosition(new google.maps.LatLng(newLatLocation.latitude, newLatLocation.longitude));
                            widgetReference.mapMarker.setMap(widgetReference.map);
                            widgetReference.map.setCenter(widgetReference.mapMarker.getPosition());
                        }
                    }
                } else {
                    TW.log.info('googlelocation: afterrender: latitude change handler: user entered invalid data: \'' + latitudeField.val() + '\' resetting to previous value');
                    latitudeField.val(widgetProperties['Latitude']);
                }
            }
        });

        // get the Longitude field
        var longitudeField = widgetElement.find('.longitudeField');
        longitudeField.change(function (event) {

            // check the source of the event. If it's the map, do nothing
            if (event.currentTarget === longitudeField.get(0)) {
                if (TW.isNumber(longitudeField.val())) {
                    widgetReference.setProperty('Longitude', longitudeField.val());

                    var newLngLocation = null;

                    // has the location object been set?
                    if (widgetProperties['Location'] !== undefined) {
                        // get the existing location
                        newLngLocation = widgetProperties['Location'];
                    } else {
                        // create a new location
                        newLngLocation = new Object();
                        newLngLocation.latitude = widgetProperties['Latitude'];
                    }

                    // set the new longitude on the location object
                    newLngLocation.longitude = longitudeField.val();
                    // reset the location property
                    widgetReference.setProperty('Location', newLngLocation);

                    // change the map
                    if (widgetReference.haveGoogleMaps) {
                        if (widgetReference.mapMarker !== undefined) {
                            widgetReference.mapMarker.setPosition(new google.maps.LatLng(newLngLocation.latitude, newLngLocation.longitude));
                            widgetReference.mapMarker.setMap(widgetReference.map);
                            widgetReference.map.setCenter(widgetReference.mapMarker.getPosition());
                        }
                    }
                } else {
                    TW.log.info('googlelocation: afterrender: longitude change handler: user entered invalid data: \'' + longitudeField.val() + '\' resetting to previous value');
                    latitudeField.val(widgetProperties['Latitude']);
                }
            }
        });

        // Elevation change handler
        var elevationField = widgetElement.find('.elevationField');
        elevationField.change(function (event) {
            if (event.currentTarget === elevationField.get(0)) {
                if (TW.isNumber(elevationField.val())) {
                    widgetReference.setProperty('Elevation', elevationField.val());
                    // has the location object been set?
                    if (widgetProperties['Location'] !== undefined) {
                        var newEleLocation = widgetProperties['Location'];
                        // set the new elevation on the location object
                        newEleLocation.elevation = elevationField.val();
                        // reset the location property
                        widgetReference.setProperty('Location', newEleLocation);
                    }
                } else {
                    TW.log.info('googlelocation: afterrender: elevation change handler: user entered invalid data: \'' + elevationField.val() + '\' resetting to previous value');
                    elevationField.val(widgetProperties['Latitude']);
                }
            }
        });

    }

    this.afterRender = function () {
        
        var googleMapsConnectionString = "";

        var invoker = new ThingworxInvoker({
            entityType: 'Subsystems',
            entityName: 'PlatformSubsystem',
            characteristic: 'Services',
            target: 'GetGoogleMapsConnectionString',
            apiMethod: 'post',
            isAsync: false
        });

        invoker.invokeService(function(invoker){
            if (invoker.result && invoker.result.rows && invoker.result.rows.length > 0) {
                googleMapsConnectionString = invoker.result.rows[0].GetGoogleMapsConnectionString;
            }
        },
        function (invoker, xhr) {
            TW.log.error('Unable to get the Google maps API Url: "' + JSON.stringify(xhr) + '"');
        },false);
        if(thisWidget.getProperty('UseMap')) {
            if(!googleMapsConnectionString) {
                TW.log.error("Google maps connection String is not present");
            }
            window.loadingGoogleApi = window.loadingGoogleApi || $.getScript(googleMapsConnectionString);
            window.loadingGoogleApi.then(scriptLoaded);
            window.loadingGoogleApi.fail(function (jqxhr, settings, exception ) {
                TW.log.error("Connection with Google cannot be established");
            });
        } else {
            scriptLoaded();
        }
        
    };  // After render ends here

    // handles the map configuration, display and event handling
    this.configureAndDisplayMap = function () {

        var domElementId = this.jqElementId;
        var widgetElement = this.jqElement;
        var widgetProperties = this.properties;
        var widgetReference = this;
        
        //    	widgetElement.css('z-index', 999);
        // get the div where the map will go
        var mapDiv = this.mapEl;
        // default if no other location is defined
        var defaultLocation = { 'latitude': 38, 'longitude': -96 };
        // flag to indicate no location was set
        var defaultLocationReset = false;
        var myZoom = widgetReference.DEFAULT_ZOOM;

        // has the user obtained a Location
        if (widgetProperties['Location'] !== undefined) {
            defaultLocation.latitude = widgetProperties['Location']['latitude'];
            defaultLocation.longitude = widgetProperties['Location']['longitude'];
            myZoom = 11;
            defaultLocationReset = true;
        } else if (widgetProperties['Latitude'] !== undefined && widgetProperties['Latitude'] !== '' &&
				widgetProperties['Longitude'] !== undefined && widgetProperties['Longitude'] !== '') {

            defaultLocation.latitude = widgetProperties['Latitude'];
            defaultLocation.longitude = widgetProperties['Longitude'];
            myZoom = 11;
            defaultLocationReset = true;
        }

        // set the map Latitude and Longitude
        var latlng = new google.maps.LatLng(defaultLocation.latitude, defaultLocation.longitude);

        // set the map options
        var myOptions = {
            zoom: myZoom,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // create the map
        widgetReference.map = new google.maps.Map(mapDiv.get(0), myOptions);

        // create a marker for the location
        widgetReference.mapMarker = new google.maps.Marker({
            position: latlng
            //draggable: true
        });

        // create listener for map click to update location
        google.maps.event.addListener(this.map, 'click', function (event) {

            var googleLocation = {
                latitude: event.latLng.lat(),
                longitude: event.latLng.lng()
            };
            
            widgetReference.mapMarker.setPosition(event.latLng);
            widgetReference.mapMarker.setMap(widgetReference.map);
            widgetReference.setMyLocation(googleLocation);

        });

        // add the marker to the map if a location was identified;
        if (defaultLocationReset === true) {
            widgetReference.mapMarker.setMap(widgetReference.map);
        }
    };

    this.updateProperty = function (updatePropertyInfo) {
        var domElementId = this.jqElementId;
        var widgetElement = this.jqElement;
        var widgetProperties = this.properties;
        var widgetReference = this;

        if (updatePropertyInfo.TargetProperty === 'Location' && updatePropertyInfo.RawSinglePropertyValue !== undefined) {
            var location = updatePropertyInfo.RawSinglePropertyValue;
            // When passed as mashup parameter location comes as string and needs to be parsed
            if (location && typeof location === 'string') {
                location = JSON.parse(location);
            }
            this.setMyLocation(location);
			
			// close the map if the location has been updated 
			if (widgetReference.mapOpen !== undefined && widgetReference.mapOpen === true) {
				widgetReference.mapOpen = false;
				widgetReference.mapEl.hide();
			}
            
            // RAB: Not sure what this is all about
            widgetElement.val(updatePropertyInfo.RawSinglePropertyValue);
        } else if (updatePropertyInfo.TargetProperty === 'Location') {
			// if the updated property is Location, yet it's null reset to default
			this.resetInputToDefault();
		}
    };

    // used by map and location binding
    this.setMyLocation = function (location) {
        var domElementId = this.jqElementId;
        var widgetElement = this.jqElement;
        var widgetProperties = this.properties;
        var widgetReference = this;

        if (location !== undefined && location !== null) {
            if(location.latitude != undefined && location.longitude != undefined) {
	        	
	            widgetReference.setProperty('Latitude', location.latitude);
	            widgetElement.find('.latitudeField').val(location.latitude);
	            
	            widgetReference.setProperty('Longitude', location.longitude);
	            widgetElement.find('.longitudeField').val(location.longitude);
	            
	            if (location.elevation !== undefined) {
	            	widgetReference.setProperty('Elevation', location.elevation);
	                widgetElement.find('.elevationField').val(location.elevation);
	            } else {
	                location.elevation = 0;
	            }
	            
	            if (location.units === undefined) {
	                location.units = 'WGS84';
	            }
	            
	            widgetReference.setProperty('Location', location);
				
            }
        }
    };
	
	this.resetInputToDefault = function () {
		var widgetElement = this.jqElement;
		widgetElement.find('.longitudeField').val(defaultValue === undefined ? '' : defaultValue);
		widgetElement.find('.latitudeField').val(defaultValue === undefined ? '' : defaultValue);
		
		thisWidget.setProperty('Longitude', defaultValue);
		thisWidget.setProperty('Latitude', defaultValue);
		thisWidget.setProperty('Location', defaultValue);
		
		thisWidget.setProperty('Elevation', defaultValue);
		widgetElement.find('.elevationField').val(defaultValue === undefined ? '' : defaultValue);
		
		if (thisWidget.mapOpen !== undefined && thisWidget.mapOpen === true) {
			thisWidget.mapOpen = false;
            thisWidget.mapEl.hide();
		}
		
    };

    this.beforeDestroy = function () {
        try {
            if (this.mapMarker !== undefined) {
            	google.maps.event.clearInstanceListeners(this.mapMarker);
                this.mapMarker.setMap(null);
                this.mapMarker = null;
                delete this.mapMarker;
            }
            
        }
        catch (destroyErr) {
        }
        
    	try {
        	google.maps.event.clearInstanceListeners(this.map);
        }
        catch(destroyErr) {
        	
        }
        
    	this.map = null;
    	delete this.map;
    	
        if (this.mapEl !== undefined) {
            try {
                this.mapEl.remove();
                delete this.mapEl;
            }
            catch (destroyErr) {
            }

        }

        thisWidget = null;
    };
};