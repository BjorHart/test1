TW.IDE.Widgets.googlemap = function () {
    this.widgetIconUrl = function() {
        return  "../Common/extensions/GoogleWidgets_ExtensionPackage/ui/googlemap/googlemap.ide.png";
    }
    var thisWidget = this;

    this.widgetProperties = function () {
        return {
            'name': 'Google Map',
            'description': 'Displays a series of location data points on a map',
            'category': ['Data'],
            'iconImage': 'googlemap.ide.png',
			'isExtension':true,
	        'supportsAutoResize': true,
            'defaultBindingTargetProperty': 'Data',
            'properties': {
                'MapType': {
                    'isBindingTarget': false,
                    'description' : 'The type of map content to display (road, satellite, etc.)',
                    'baseType': 'STRING',
                    'defaultValue': 'roadmap',
                    'selectOptions': [
                        { value: 'roadmap', text: 'Roads' },
                        { value: 'satellite', text: 'Satellite' },
                        { value: 'hybrid', text: 'Hybrid' },
                        { value: 'terrain', text: 'Terrain' }
                    ]
                },
                'MapSkin': {
                    'isBindingTarget': false,
                    'description' : 'A few options on the look of the map',
                    'baseType': 'STRING',
                    'defaultValue': 'normal',
                    'selectOptions': [
                        { value: 'normal', text: 'Normal' },
                        { value: 'blue', text: 'Blue' },
                        { value: 'gray', text: 'Gray' }
                    ]
                },
                'ShowTraffic': {
                    'description': 'Show traffic',
                    'isBindingTarget': true,
                    'defaultValue': false,
                    'baseType': 'BOOLEAN'
                },
                'Data': {
                    'description' : 'Data source',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'baseType': 'INFOTABLE',
                    'warnIfNotBoundAsTarget': true
                },
                'LocationField': {
                    'description' : 'Field which will provide location information for markers/tracks',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'defaultValue': 'location',
                    'sourcePropertyName': 'Data',
                    'baseTypeRestriction': 'LOCATION',
                    'baseType': 'FIELDNAME'
                },
                'MarkerField': {
                    'description' : 'Field which will provide icon information for markers',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'defaultValue': '',
                    'sourcePropertyName': 'Data',
                    'baseTypeRestriction': 'IMAGELINK',
                    'baseType': 'FIELDNAME'
                },
                'MarkerLayerField': {
                    'description' : 'Field which will provide layer information for markers/tracks',
                    'isVisible': true,
                    'isEditable': true,
                    'sourcePropertyName': 'Data',
                    'baseTypeRestriction': 'NUMBER',
                    'baseType': 'FIELDNAME'
                },
                'ShowMarkerTooltips': {
                    'description': 'Show marker tooltips',
                    'defaultValue': true,
                    'isBindingTarget': true,
                    'baseType': 'BOOLEAN'
                },
                'TooltipField1': {
                    'description' : 'Field which will provide 1st tooltip data',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'sourcePropertyName': 'Data',
                    'baseType': 'FIELDNAME'
                },
                'TooltipLabel1': {
                    'description': 'Optional 1st tooltip label',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'baseType': 'STRING',
                    'isLocalizable': true
                },
                'TooltipField2': {
                    'description': 'Field which will provide 2nd tooltip data',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'sourcePropertyName': 'Data',
                    'baseType': 'FIELDNAME'
                },
                'TooltipLabel2': {
                    'description': 'Optional 2nd tooltip label',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'baseType': 'STRING',
                    'isLocalizable': true
                },
                'TooltipField3': {
                    'description': 'Field which will provide 3rd tooltip data',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'sourcePropertyName': 'Data',
                    'baseType': 'FIELDNAME'
                },
                'TooltipLabel3': {
                    'description': 'Optional 3rd tooltip label',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'baseType': 'STRING',
                    'isLocalizable': true
                },
                'TooltipField4': {
                    'description': 'Field which will provide 4th tooltip data',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'sourcePropertyName': 'Data',
                    'baseType': 'FIELDNAME'
                },
                'TooltipLabel4': {
                    'description': 'Optional 4th tooltip label',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'baseType': 'STRING',
                    'isLocalizable': true
                },
                'RouteData': {
                    'description' : 'Route data source',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'baseType': 'INFOTABLE',
                    'warnIfNotBoundAsTarget': false
                },
                'RouteLocationField': {
                    'description' : 'Field which will provide location information for route',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'defaultValue': 'location',
                    'sourcePropertyName': 'RouteData',
                    'baseTypeRestriction': 'LOCATION',
                    'baseType': 'FIELDNAME'
                },
                'PlannedRouteData': {
                    'description' : 'Planned route data source',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'baseType': 'INFOTABLE',
                    'warnIfNotBoundAsTarget': false
                },
                'PlannedRouteLocationField': {
                    'description' : 'Field which will provide location information for the planned route',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'defaultValue': 'location',
                    'sourcePropertyName': 'PlannedRouteData',
                    'baseTypeRestriction': 'LOCATION',
                    'baseType': 'FIELDNAME'
                },
                'RegionData': {
                    'description' : 'Region data source',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'baseType': 'INFOTABLE',
                    'warnIfNotBoundAsTarget': false
                },
                'RegionLocationData': {
                    'description' : 'Region location data source',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'baseType': 'INFOTABLE',
                    'warnIfNotBoundAsTarget': false
                },
                'RegionLocationField': {
                    'description' : 'Field which will provide location information for region',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'defaultValue': 'location',
                    'sourcePropertyName': 'RegionLocationData',
                    'baseTypeRestriction': 'LOCATION',
                    'baseType': 'FIELDNAME'
                },
                'RegionLocationsField': {
                    'description' : 'Field which will provide location table information for region',
                    'isBindingTarget': false,
                    'isVisible': true,
                    'isEditable': true,
                    'defaultValue': 'locations',
                    'sourcePropertyName': 'RegionData',
                    'baseTypeRestriction': 'INFOTABLE',
                    'baseType': 'FIELDNAME'
                },
                'RegionLayerField': {
                    'description' : 'Field which will provide layer information for regions',
                    'isVisible': true,
                    'isEditable': true,
                    'sourcePropertyName': 'RegionData',
                    'baseTypeRestriction': 'NUMBER',
                    'baseType': 'FIELDNAME'
                },
                'ShowRegionTooltips': {
                    'description': 'Show region tooltips',
                    'defaultValue': false,
                    'isBindingTarget': true,
                    'baseType': 'BOOLEAN'
                },
                'RegionTooltipField1': {
                    'description' : 'Region field which will provide 1st tooltip data',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'sourcePropertyName': 'RegionData',
                    'baseType': 'FIELDNAME'
                },
                'RegionTooltipLabel1': {
                    'description': 'Optional 1st tooltip label',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'baseType': 'STRING',
                    'isLocalizable': true
                },
                'RegionTooltipField2': {
                    'description': 'Region field which will provide 2nd tooltip data',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'sourcePropertyName': 'RegionData',
                    'baseType': 'FIELDNAME'
                },
                'RegionTooltipLabel2': {
                    'description': 'Optional 2nd tooltip label',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'baseType': 'STRING',
                    'isLocalizable': true
                },
                'RegionTooltipField3': {
                    'description': 'Region field which will provide 3rd tooltip data',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'sourcePropertyName': 'RegionData',
                    'baseType': 'FIELDNAME'
                },
                'RegionTooltipLabel3': {
                    'description': 'Optional 3rd tooltip label',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'baseType': 'STRING',
                    'isLocalizable': true
                },
                'RegionTooltipField4': {
                    'description': 'Region field which will provide 4th tooltip data',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'sourcePropertyName': 'RegionData',
                    'baseType': 'FIELDNAME'
                },
                'RegionTooltipLabel4': {
                    'description': 'Optional 4th tooltip label',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'baseType': 'STRING',
                    'isLocalizable': true
                },
                'RegionFillOpacity': {
                    'description' : 'Field which will provide opacity for region',
                    'isBindingTarget': true,
                    'isVisible': true,
                    'isEditable': true,
                    'defaultValue': 1.0,
                    'baseType': 'NUMBER'
                },
                'SelectedLocation': {
                    'description': 'Currently selected location',
                    'isEditable': true,
                    'isBindingSource': true,
                    'isBindingTarget': true,
                    'baseType': 'LOCATION'
                },
                'CurrentZoom': {
                    'description': 'Map zoom level (ranges from 1 to 15)',
                    'isBindingSource': true,
                    'baseType': 'NUMBER'
                },
                'Zoom': {
                    'description': 'Map zoom level (ranges from 1 to 15)',
                    'isBindingTarget': true,
                    'baseType': 'NUMBER',
                    'defaultValue': 8
                },
                'AutoCenterBehavior': {
                    'isBindingTarget': false,
                    'description': 'When to trigger AutoCenter',
                    'baseType': 'STRING',
                    'defaultValue': 'last-selected',
                    'selectOptions': [
                        { value: 'none', text: 'Don\'t center on selected locations' },
                        { value: 'last-selected', text: 'Center on the last selected location' },
                        { value: 'all-selected', text: 'Center on all selected locations' }
                    ]
                },
                'AutoZoomBehavior': {
                    'isBindingTarget': false,
                    'description' : 'When to trigger AutoZoom',
                    'baseType': 'STRING',
                    'defaultValue': 'every-data-change',
                    'selectOptions': [
                        { value: 'every-data-change', text: 'AutoZoom every time any data refreshes' },
                        { value: 'only-when-autozoom-invoked', text: 'AutoZoom only when AutoZoom widget service is invoked' },
                        { value: 'disable-on-user-pan-zoom', text: 'AutoZoom on data refresh, but disable AutoZoom if user manually pans or zooms' },
                        { value: 'only-initial-data', text: 'AutoZoom on initial data only (useful if you use BoundsChanged to retrieve new data)' }
                    ]
                },
                'ClusterLocations': {
                    'description': 'Cluster nearby markers to improve performance.',
                    'baseType': 'BOOLEAN',
                    'defaultValue': false
                },
                'MarkerFormatting': {
                    'description': 'Optional rules for dynamic formatting of map markers',
                    'baseType': 'STATEFORMATTING',
                    'baseTypeInfotableProperty': 'Data',
                    'isVisible': true
                },
                'MarkerStyle': {
                    'description': 'Style formatting of map markers',
                    'baseType': 'STYLEDEFINITION',
                    'isVisible': true,
                    'defaultValue': 'DefaultMapMarkerStyle'
                },
                'SelectedMarkerStyle': {
                    'description': 'Style formatting of selected map markers',
                    'baseType': 'STYLEDEFINITION',
                    'defaultValue': 'DefaultMapSelectedStyle'
                },
                'SelectionMarkerStyle': {
                    'description': 'Style formatting of current map selection',
                    'baseType': 'STYLEDEFINITION',
                    'defaultValue': 'DefaultMapSelectionStyle'
                },
                'StartMarkerStyle': {
                    'description': 'Style formatting of starting map marker for paths/tracks',
                    'baseType': 'STYLEDEFINITION',
                    'defaultValue': 'DefaultMapStartStyle'
                },
                'EndMarkerStyle': {
                    'description': 'Style formatting of ending map marker for paths/tracks',
                    'baseType': 'STYLEDEFINITION',
                    'defaultValue': 'DefaultMapEndStyle'
                },
                'PathStyle': {
                    'description': 'Style formatting of line for paths/tracks',
                    'baseType': 'STYLEDEFINITION',
                    'isVisible': true,
                    'defaultValue': 'DefaultMapPathStyle'
                },
                'RouteStyle': {
                    'description': 'Style formatting of line for routes',
                    'baseType': 'STYLEDEFINITION',
                    'isVisible': true,
                    'defaultValue': 'DefaultMapRouteStyle'
                },
                'PlannedRouteStyle': {
                    'description': 'Style formatting of line for planned routes',
                    'baseType': 'STYLEDEFINITION',
                    'isVisible': true,
                    'defaultValue': 'DefaultMapRouteStyle'
                },
                'RegionFormatting': {
                    'description': 'Optional rules for dynamic formatting of map regions',
                    'baseType': 'STATEFORMATTING',
                    'baseTypeInfotableProperty': 'RegionData',
                    'isVisible': true
                },
                'RegionStyle': {
                    'description': 'Style formatting of line for regions',
                    'baseType': 'STYLEDEFINITION',
                    'isVisible': true,
                    'defaultValue': 'DefaultMapRegionStyle'
                },
                'SelectedRegionStyle': {
                    'description': 'Style formatting of selected regions',
                    'baseType': 'STYLEDEFINITION',
                    'defaultValue': 'DefaultMapRegionSelectedStyle'
                },
                'ShowMarkers': {
                    'description': 'Show map markers',
                    'defaultValue': true,
                    'isBindingTarget': true,
                    'baseType': 'BOOLEAN'
                },
                'ShowPathBetweenMarkers': {
                    'description': 'Show path/tracks between markers (ordered by the order in the underlying data)',
                    'isBindingTarget': true,
                    'defaultValue': false,
                    'baseType': 'BOOLEAN'
                },
                'ShowStartMarker': {
                    'description': 'Show special marker for first map data point',
                    'isBindingTarget': true,
                    'defaultValue': true,
                    'baseType': 'BOOLEAN'
                },
                'ShowEndMarker': {
                    'description': 'Show special marker for last map data point',
                    'isBindingTarget': true,
                    'defaultValue': true,
                    'baseType': 'BOOLEAN'
                },
                'ShowRoute': {
                    'description': 'Show route',
                    'defaultValue': false,
                    'isBindingTarget': true,
                    'baseType': 'BOOLEAN'
                },
                'ShowPlannedRoute': {
                    'description': 'Show planned route',
                    'defaultValue': false,
                    'isBindingTarget': true,
                    'baseType': 'BOOLEAN'
                },
                'ShowRegions': {
                    'description': 'Show regions',
                    'defaultValue': false,
                    'isBindingTarget': true,
                    'baseType': 'BOOLEAN'
                },
                'EnableLocationSelection': {
                    'description': 'Enable location selection mode',
                    'defaultValue': false,
                    'baseType': 'BOOLEAN'
                },
                'ShowSelectionMarker': {
                    'description': 'Show the current selection marker',
                    'defaultValue': false,
                    'baseType': 'BOOLEAN'
                },
                'EnableMarkerSelection': {
                    'description': 'Enable marker selection mode',
                    'defaultValue': true,
                    'baseType': 'BOOLEAN'
                },
                'EnableRegionSelection': {
                    'description': 'Enable regionselection mode',
                    'defaultValue': false,
                    'baseType': 'BOOLEAN'
                },
                'MultiSelect': {
                    'description': 'Enable multiple marker selection',
                    'defaultValue': false,
                    'baseType': 'BOOLEAN'
                },
                'RegionMultiSelect': {
                    'description': 'Enable multiple region selection',
                    'defaultValue': false,
                    'baseType': 'BOOLEAN'
                },
                'MashupParameters': {
                    isVisible: false,
                    'baseType': 'VALUES'
                },
                'TooltipMashupName': {
                    'isBindingTarget': true,
                    'defaultValue': '',
                    'baseType': 'MASHUPNAME'
                },
                'TooltipMashupWidth': {
                    //isVisible: false,
                    'defaultValue': 400,
                    'baseType': 'NUMBER'
                },
                'TooltipMashupHeight': {
                    //isVisible: false,
                    'defaultValue': 300,
                    'baseType': 'NUMBER'
                },
        		'NEBoundary': {
        			'description':'The northeast boundary location - Longitude, Latitude, Elevation, and Units in WGS84',
                    'isBindingSource': true,
                    'isEditable':false,
                    'isVisible':true,
                    'defaultValue': undefined,
                    'baseType': 'LOCATION'
                },
        		'NWBoundary': {
        			'description':'The northwest boundary location - Longitude, Latitude, Elevation, and Units in WGS84',
                    'isBindingSource': true,
                    'isEditable':false,
                    'isVisible':true,
                    'defaultValue': undefined,
                    'baseType': 'LOCATION'
                },
        		'SEBoundary': {
        			'description':'The southeast boundary location - Longitude, Latitude, Elevation, and Units in WGS84',
                    'isBindingSource': true,
                    'isEditable':false,
                    'isVisible':true,
                    'defaultValue': undefined,
                    'baseType': 'LOCATION'
                },
        		'SWBoundary': {
        			'description':'The southwest boundary location - Longitude, Latitude, Elevation, and Units in WGS84',
                    'isBindingSource': true,
                    'isEditable':false,
                    'isVisible':true,
                    'defaultValue': undefined,
                    'baseType': 'LOCATION'
                },
                'Width': {
                    'description': 'Widget width',
                    'defaultValue': 400
                },
                'Height': {
                    'description': 'Widget height',
                    'defaultValue': 200
                }
            }
        };
    };

    this.widgetServices = function () {
        return {
            'AutoZoom': { 'warnIfNotBound': false }
        };
    };

    this.widgetEvents = function () {
        return {
            'Changed': {},
        	'DoubleClicked': {},
            'BoundsChanged': {}
        };
    };
	
    this.renderHtml = function () {
        var html = '';
        html += '<div class="widget-content widget-map-designer"></div>';
        return html;
    };


    this.afterAddBindingSource = function (bindingInfo) {
        if (bindingInfo['targetProperty'] === 'Data') {
            this.resetPropertyToDefaultValue('MarkerFormatting');
        }
    };

    this.afterLoad = function () {
	    if( this.getProperty('EnableAutoZoom') !== undefined )  {
		    if( this.getProperty('EnableAutoZoom') === false ) {
			    this.setProperty('AutoZoomBehavior','only-when-autozoom-invoked');
		    } else {
			    this.setProperty('AutoZoomBehavior','every-data-change');
		    }
		    delete this.properties['EnableAutoZoom'];
	    }
        setTimeout(function () {
            var mashupName = thisWidget.getProperty('TooltipMashupName');
            thisWidget.loadMashupParameters(mashupName, false /* isManuallyBeingSetNow */);
        }, 1000);
    };

    this.afterSetProperty = function (name, value) {
        var refreshHtml = false;
        switch (name) {
            case 'TooltipMashupName':
                if (value === undefined || value.length === 0) {
                    var allWidgetProps = thisWidget.allWidgetProperties();
                    var existingParmDefs = thisWidget.properties['MashupParameters'] || [];
                    // delete existing parameters from currentParameterDefs, widgetProperties and properties
                    for (var i = 0; i < existingParmDefs.length; i++) {
                        delete allWidgetProps.properties[existingParmDefs[i].ParameterName];
                    }

                    thisWidget.properties['MashupParameters'] = [];
                    thisWidget.properties['TooltipMashupWidth'] = undefined;
                    thisWidget.properties['TooltipMashupHeight'] = undefined;
                    thisWidget.updatedProperties();
                    refreshHtml = true;
                } else {
                    thisWidget.loadMashupParameters(value,true /* isManuallyBeingSetNow */);
                    thisWidget.updatedProperties();
                    refreshHtml = true;
                }
                break;
            default:
                break;
        }
        return refreshHtml;
    };

    this.loadMashupParameters = function (mashupName,isManuallyBeingSetNow) {
        $.ajax({
            url: "/Thingworx/Mashups/" + thisWidget.getProperty('TooltipMashupName') + '?Accept=application/json',
            type: "GET",
            datatype: "json",
            cache: false,
            async: false
        }).done(function (data) {

                var allWidgetProps = thisWidget.allWidgetProperties();
                var parmDefsForThisMashup = data.parameterDefinitions;

                var existingParmDefs = thisWidget.properties['MashupParameters'] || [];
                // delete existing parameters from currentParameterDefs, widgetProperties and properties
                for (var i = 0; i < existingParmDefs.length; i++) {
                    delete allWidgetProps.properties[existingParmDefs[i].ParameterName];
                }

                thisWidget.properties['MashupParameters'] = [];

                if (parmDefsForThisMashup !== undefined) {
                    // add the new ones in to currentParameterDefs, widgetProperties and properties
                    for (var x in parmDefsForThisMashup) {
                        parmDef = parmDefsForThisMashup[x];

                        var name = parmDef.name;
                        var description = parmDef.description;
                        var basetype = parmDef.baseType;
                        var defaultValue = parmDef.aspects.defaultValue;

                        allWidgetProps.properties[name] = {
                            'type': "property",
                            'description': description,
                            'isVisible': true,
                            'defaultValue': defaultValue,
                            'sourcePropertyName': 'Data',
                            //'baseTypeRestriction': basetype,
                            'baseType': 'FIELDNAME',
                            'showAllFieldsOption': true
                        };

                        thisWidget.properties['MashupParameters'].push(
                                {
                                    ParameterName: name,
                                    Description: description,
                                    BaseType: basetype,
                                    DefaultValue: defaultValue
                                }
                            );

                    }
                }

                // Per MASHUP-3223, this is pretty dangerous to do ...
                //  Also, it shouldn't be done only if the mashup has parameters (although it doesn't actually make sense otherwise, does it?)

	            if( isManuallyBeingSetNow === true ) {
		            try {
			            var mashupDef = JSON.parse(data.mashupContent, TW.dateReviver);

			            thisWidget.properties['TooltipMashupWidth'] = mashupDef.UI.Properties.Width;
			            thisWidget.properties['TooltipMashupHeight'] = mashupDef.UI.Properties.Height;

		            }
		            catch (err) {
			            TW.log.error('An error occurred in TW.IDE.Widgets.repeater.loadMashupParameters()', err);
		            }
	            }

	            try {
		            switch( data.aspects.mashupType )  {
			            case 'thingtemplatemashup':
			            case 'thingshapemashup':
				            if( allWidgetProps.properties['Entity'] === undefined ) {
		                        allWidgetProps.properties['Entity'] = {
		                            'baseType': 'THINGNAME',
		                            'defaultValue': undefined,
		                            //'isBaseProperty': false,
		                            'isVisible': true,
		                            'name': 'Entity',
		                            'type': "property",
		                            'isBindingTarget': true,
		                            'isBindingSource': true
		                        };
		                        thisWidget.properties['MashupParameters'].push(
		                                {
		                                    ParameterName: 'Entity',
		                                    Description: 'Entity For Mashup',
		                                    BaseType: 'THINGNAME',
		                                    DefaultValue: undefined,
		                                    ParmDef: {}
		                                }
		                            );
				            }
				            break;
		            }
	            } catch( err ) {}
        }).fail(function (xhr, status) {
                TW.log.error('could not load mashup "' + thisWidget.getProperty('TooltipMashupName') + '"');
        }).always(function (xhr, status) {
                xhr.onreadystatechange = null;
                xhr.abort = null;
                delete xhr.onreadystatechange;
                delete xhr.abort;
                xhr = null;
        });
    };
};
