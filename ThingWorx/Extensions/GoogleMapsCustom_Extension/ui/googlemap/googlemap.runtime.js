TW.Runtime.Widgets.googlemap = function () {

    var infoWindow = undefined;
	var userHasPannedOrZoomedSinceAutoZoom = false;
	var initialData = true;
	var weAreChangingBounds = false;
	var autoZoomBehavior = 'every-data-change';
    var regionInfoWindow = undefined;
    var lastRegionNumber = undefined;
    var lastData = undefined;
    var lastRegionData = undefined;
    var infoId = 'MapInfoWindow' + TW.uniqueId();
    var tooltipMashupWidth = 100;
    var tooltipMashupHeight = 100;
    var isMashupTooltipConfigured = false;
    var isRegionTooltipConfigured = false;
    var dataInfotable = undefined;
    var clusterImageLocation = '../Common/extensions/GoogleWidgets_ExtensionPackage/ui/googlemap/images/m';
    var lastSetLocation;
    var lastSelectedRowIndices = [];
    var autoCenterBehavior = this.getProperty('AutoCenterBehavior', 'last-selected');
    var updatePropertyCallCache = [];
    this.runtimeProperties = function () {
        return {
	        'supportsAutoResize': true,
            'needsDataLoadingAndError': true,
            'propertyAttributes': {
                'TooltipLabel1': {'isLocalizable': true},
                'TooltipLabel2': {'isLocalizable': true},
                'TooltipLabel3': {'isLocalizable': true},
                'TooltipLabel4': {'isLocalizable': true},
                'RegionTooltipLabel1': {'isLocalizable': true},
                'RegionTooltipLabel2': {'isLocalizable': true},
                'RegionTooltipLabel3': {'isLocalizable': true},
                'RegionTooltipLabel4': {'isLocalizable': true}
            }
        };
    };

	this.resize = function(width,height) {
		try {
            google.maps.event.trigger(this.map, 'resize');
		} catch(err) {}
	};

    this.renderHtml = function () {

        tooltipMashupWidth = thisWidget.getProperty('TooltipMashupWidth');
        tooltipMashupHeight = thisWidget.getProperty('TooltipMashupHeight');
	    var oldAutoZoom = this.getProperty('AutoZoom');
	    autoZoomBehavior =  this.getProperty('AutoZoomBehavior');
	    switch( autoZoomBehavior ) {
		    case 'disable-on-user-pan-zoom':
		    case 'only-when-autozoom-invoked':
	        case 'only-initial-data':
			    // leave these alone
			    break;
		    default:
			    // anything else, default to our old behavior
			    if( oldAutoZoom === undefined || oldAutoZoom === true )  {
				    autoZoomBehavior = 'every-data-change';
			    } else if( oldAutoZoom === false ) {
				    autoZoomBehavior = 'only-when-autozoom-invoked';
			    } else {
				    autoZoomBehavior = 'every-data-change';
			    }
			    break;
	    }

        var mashupName = thisWidget.getProperty('TooltipMashupName');
        if (mashupName !== undefined && mashupName.length > 0) {
            isMashupTooltipConfigured = true;
        }

        return '<div class="widget-content widget-map-runtime"></div>';
    };

    var thisWidget = this;
    
    this.haveGoogleMaps = false;
    this.ignoreSelectionEvent = false;
    this.ignoreRegionSelectionEvent = false;
    this.map = undefined;
    this.selectionMarker = null;
    this.startMarker = null;
    this.endMarker = null;
    this.polyline = null;
    this.routePolyline = null;
    this.plannedRoutePolyline = null;
    this.dataBounds;
    this.plannedRouteDataBounds;
    this.routeDataBounds;
    this.regionDataBounds;
    this.lastBounds;
    this.lastZoom;
    this.markerLookup = new Array();
    this.currentMarkers = new Array();
    this.selectedRows = new Array();
    this.currentRegions = new Array();
    this.selectedRegionRows = new Array();
    this.markerStyle;
    this.selectedMarkerStyle;
    this.selectionMarkerStyle;
    this.startMarkerStyle;
    this.endMarkerStyle;
    this.pathStyle;
    this.routeStyle;
    this.plannedRouteStyle;
    this.regionStyle;

    this.handleResponsiveWidgets = function (doItNow) {
        // only update to the last center location if doItNow is true.
        // layout widget calls this and sets this to true, resize events have it set to undefined.
        // removing this check will cause resize events to reset the location also.
        if (doItNow) {
            google.maps.event.trigger(thisWidget.map, 'resize');
            thisWidget.autoCenterMap(lastSetLocation);
        }
    };


    function scriptLoaded(data, textStatus, jqxhr) {
        try {
            if(google !== undefined && google !== null) {
                thisWidget.haveGoogleMaps = true;
            }
        }
        catch (errmsg) {
        	 TW.log.error("Not able to instantiate google");
        }
        if(!thisWidget.haveGoogleMaps){
            $( "div.widget-map-runtime" ).replaceWith( '<div class="widget-content widget-map-runtime"><span class="textsize-large">Google Maps Are Not Available</span></div>');
        }
        TW.Runtime.google = google;
        thisWidget.markerStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('MarkerStyle'));
        thisWidget.selectionMarkerStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('SelectionMarkerStyle'));
        thisWidget.selectedMarkerStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('SelectedMarkerStyle'));
        thisWidget.startMarkerStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('StartMarkerStyle'));
        thisWidget.endMarkerStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('EndMarkerStyle'));
        thisWidget.pathStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('PathStyle'));
        thisWidget.plannedRouteStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('PlannedRouteStyle'));
        thisWidget.routeStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('RouteStyle'));
        thisWidget.regionStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('RegionStyle'));
        thisWidget.selectedRegionStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('SelectedRegionStyle'));
        
        if (thisWidget.haveGoogleMaps) {
            var zoom = parseInt(thisWidget.getProperty('Zoom'));

            var centerPosition = new google.maps.LatLng(TW.clientPosition.coords.latitude, TW.clientPosition.coords.longitude);

            if (thisWidget.getProperty('SelectedLocation') !== undefined) {
                centerPosition = new google.maps.LatLng(thisWidget.getProperty('SelectedLocation').latitude, thisWidget.getProperty('SelectedLocation').longitude);
            }

            var options = {
                zoom: zoom,
                center: centerPosition,
                disableDefaultUI: true,
                mapTypeId: thisWidget.getProperty('MapType')
            };

	        switch( thisWidget.getProperty('MapSkin','normal') ) {
		        case 'normal':
			        break;
		        case 'premium':
			        options['styles'] = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#5D5F70"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#F0F0F7"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#cfcfd1"},{"lightness":-37}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#a6a6ab"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#a6a6ab"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#575c5e"},{"weight":2},{"gamma":0.84}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#a6abad"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#e4e4ed"}]}];
			        break;
		        case 'gray':
			        options['styles'] = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
					break;
	        }

            if (thisWidget.getProperty('EnableLocationSelection')) {
                options["disableDoubleClickZoom"] = true;
            }
            else {
                options["disableDoubleClickZoom"] = false;
            }

            thisWidget.map = new google.maps.Map(document.getElementById(thisWidget.jqElementId), options);
            //if (TW.Runtime.globalMap === undefined) {
            //    $('body').append(
            //                '<div id="global-map" style="top:0px;left:0px;width:200px;height:200px;">' +
            //                '</div>');
            //    TW.Runtime.globalMap = new google.maps.Map(document.getElementById('global-map'), options);
            //}


            if(thisWidget.getProperty('ClusterLocations', false)){
                thisWidget.markerCluster = new MarkerClusterer(thisWidget.map, thisWidget.currentMarkers,
                    {imagePath: clusterImageLocation, zoomOnClick: false}
                );
            }

            infoWindow = new google.maps.InfoWindow();
            regionInfoWindow = new google.maps.InfoWindow();
            


            if(thisWidget.getProperty('ShowTraffic')) {
                thisWidget.trafficLayer = new google.maps.TrafficLayer(); 
                thisWidget.trafficLayer.setMap(thisWidget.map);
            }
            var currentZoom = thisWidget.map.getZoom();
            thisWidget.setProperty('CurrentZoom', currentZoom);
            google.maps.event.addListener(thisWidget.map, 'idle', function (event) {
            	var bounds = thisWidget.map.getBounds();
            	
            	var changed = false;

            	if(thisWidget.lastBounds !== undefined) {
            		if(thisWidget.lastBounds.getNorthEast().lat() != bounds.getNorthEast().lat())
            			changed = true;
            		if(thisWidget.lastBounds.getNorthEast().lng() != bounds.getNorthEast().lng())
            			changed = true;
            		if(thisWidget.lastBounds.getSouthWest().lat() != bounds.getSouthWest().lat())
            			changed = true;
            		if(thisWidget.lastBounds.getSouthWest().lng() != bounds.getSouthWest().lng())
            			changed = true;
            	}
            	else {
            		changed = true;
            	}
            	
            	if(changed) {

		            // ignore this if it's just getting the initial bearings
		            if( thisWidget.lastBounds !== undefined ) {
			            if( !weAreChangingBounds ) {
				            userHasPannedOrZoomedSinceAutoZoom = true;
			            }
			            weAreChangingBounds = false;
		            }

                    var nelocation = new Object();
                    nelocation.units = "WGS84";
                    nelocation.elevation = 0.0;
                    nelocation.latitude = bounds.getNorthEast().lat();
                    nelocation.longitude = bounds.getNorthEast().lng();

                    thisWidget.setProperty('NEBoundary', nelocation);

                    var swlocation = new Object();
                    swlocation.units = "WGS84";
                    swlocation.elevation = 0.0;
                    swlocation.latitude = bounds.getSouthWest().lat();
                    swlocation.longitude = bounds.getSouthWest().lng();

                    thisWidget.setProperty('SWBoundary', swlocation);
                    
                    var nelocation = new Object();
                    nelocation.units = "WGS84";
                    nelocation.elevation = 0.0;
                    nelocation.latitude = bounds.getSouthWest().lat();
                    nelocation.longitude = bounds.getNorthEast().lng();

                    thisWidget.setProperty('SEBoundary', nelocation);

                    var swlocation = new Object();
                    swlocation.units = "WGS84";
                    swlocation.elevation = 0.0;
                    swlocation.latitude = bounds.getNorthEast().lat();
                    swlocation.longitude = bounds.getSouthWest().lng();

                    thisWidget.setProperty('NWBoundary', swlocation);
                    
                    thisWidget.lastBounds = bounds;
                    
                    thisWidget.jqElement.triggerHandler('BoundsChanged');
                    
            	}
            	
            	var zoomChanged = false;
            	
            	currentZoom = thisWidget.map.getZoom();
            	
            	if(thisWidget.lastZoom !== undefined) {
            		if(thisWidget.lastZoom != currentZoom)
            			zoomChanged = true;
            	}
            	else {
            		zoomChanged = true;
            	}
            	
            	if(zoomChanged) {

                    thisWidget.setProperty('CurrentZoom', currentZoom);
                    
                    thisWidget.lastZoom = currentZoom;
            	}
            });

            if (thisWidget.getProperty('EnableLocationSelection')) {
                if (thisWidget.getProperty('ShowSelectionMarker') === true) {
                    thisWidget.selectionMarker = new google.maps.Marker({
                        map: thisWidget.map,
                        position: centerPosition,
                        title: "Selection",
                        icon: thisWidget.selectionMarkerStyle.image
                    });
                    thisWidget.selectionMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 3);
                }

                google.maps.event.addListener(thisWidget.map, 'dblclick', function (event) {
                    var location = new Object();
                    location.units = "WGS84";
                    location.elevation = 0.0;
                    location.latitude = event.latLng.lat();
                    location.longitude = event.latLng.lng();

                    thisWidget.moveSelectionMarker(location);

                    thisWidget.setProperty('SelectedLocation', location);

                    thisWidget.jqElement.triggerHandler('Changed');
                    
                });

                google.maps.event.trigger(thisWidget.map, 'resize');

	            weAreChangingBounds = true;
                thisWidget.map.setZoom(thisWidget.map.getZoom() - 1);
	            weAreChangingBounds = true;
                thisWidget.map.setZoom(thisWidget.map.getZoom() + 1);
            }
            var firstLoadListener = thisWidget.map.addListener('tilesloaded', function(){
                google.maps.event.removeListener(firstLoadListener);
                thisWidget.autoCenterMap(lastSetLocation);
            });
        }
        // When a map widget is loaded inside a static mashup inside a popup it fails to re-render when the mashup is re-opened.
        // This will check if we are inside a popup and if we are not a responsive widget before resizing/refreshing.
        // If we are a responsive widget it'll be refreshed anyways.
        var popupDiv = thisWidget.jqElement.closest('.mashup-popup');
        if (popupDiv.length === 1 && !thisWidget.getProperty('ResponsiveLayout')) {
            setTimeout(function(){
                var center = thisWidget.map.getCenter();
                thisWidget.resize();
                thisWidget.autoCenterMap([center]);
            },1);
        }
        thisWidget.updatePropertiesFromcache();
    
    };

    // This function is to maintain the updateproperties call cache before the Google script gets loaded
    // Should only be called from scriptLoaded once
    this.updatePropertiesFromcache =  function () {
        for(var i = 0; i<updatePropertyCallCache.length; i++){
            thisWidget.updateProperty(updatePropertyCallCache[i]);
        }
        updatePropertyCallCache.length = 0;
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
        if(!googleMapsConnectionString) {
            TW.log.error("Google maps connection String is not present");
        }
        window.loadingGoogleApi = window.loadingGoogleApi || $.getScript(googleMapsConnectionString);
        window.loadingGoogleApi.then(scriptLoaded);
        window.loadingGoogleApi.fail(function (jqxhr, settings, exception ) {
            TW.log.error("Connection with Google cannot be established");
        });
    };
    this.moveSelectionMarker = function (newLocation) {
        if (this.haveGoogleMaps) {
            if (newLocation !== undefined) {
                var latlng = new google.maps.LatLng(newLocation.latitude, newLocation.longitude);

                if (this.getProperty('ShowSelectionMarker') === true) {
                    if (this.selectionMarker !== null) {
                        this.selectionMarker.setMap(this.map);
                    	this.selectionMarker.setPosition(latlng);
                    } else {
	                    this.selectionMarker = new google.maps.Marker({
	                        position: latlng,
	                        map: this.map,
	                        title: "Selection",
	                        icon: this.selectionMarkerStyle.image
	                    });
	                    this.selectionMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 3);
                    }
                }

	            weAreChangingBounds = true;
                if(autoCenterBehavior !== 'none'){
                    thisWidget.autoCenterMap([latlng]);
                }
            }
        }
    };

    this.clearSelectedRegions = function () {

        thisWidget.selectedRegionRows = [];

        for (var regionNo = 0; regionNo < thisWidget.currentRegions.length; regionNo++) {
            var currentRegion = thisWidget.currentRegions[regionNo];
            currentRegion.setOptions( { fillColor: currentRegion._assignedFillColor, strokeColor : currentRegion._assignedStrokeColor, strokeWeight : currentRegion._assignedStrokeWeight }); 
            currentRegion._isSelected = false;
        }
    };

    this.clearSelectedMarkers = function () {

        thisWidget.selectedRows = [];

        for (var markerNo = 0; markerNo < thisWidget.currentMarkers.length; markerNo++) {
            var currentMarker = thisWidget.currentMarkers[markerNo];
            currentMarker._isSelected = false;
            currentMarker.setIcon(currentMarker._assignedIcon);
            currentMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
        }
    };

    this.setSelectedMarker = function (selectedRow) {

        var isMultiselect = thisWidget.properties['MultiSelect'];

        var selectedMarker;

        for (var markerNo = 0; markerNo < thisWidget.currentMarkers.length; markerNo++) {
            var currentMarker = thisWidget.currentMarkers[markerNo];
            if (currentMarker.rowNumber === selectedRow) {
                selectedMarker = currentMarker;
                break;
            }
        }

        if (selectedMarker !== undefined) {
            if (selectedMarker._isSelected) {
                if (isMultiselect) {
                    TW.removeElementFromArray(thisWidget.selectedRows, selectedRow);
                    selectedMarker._isSelected = false;
                    selectedMarker.setIcon(selectedMarker._assignedIcon);
                    selectedMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
                    if (!thisWidget.ignoreSelectionEvent) {
                        thisWidget.updateSelection('Data', thisWidget.selectedRows);
                    }
                }
            }
            else {
                if (!isMultiselect) {
                    thisWidget.clearSelectedMarkers();
                    thisWidget.selectedRows = [selectedRow];
                }
                else
                    thisWidget.selectedRows.push(selectedRow);

                selectedMarker.setIcon(thisWidget.selectedMarkerStyle.image);
                selectedMarker._isSelected = true;
                selectedMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 2);

                if (!thisWidget.ignoreSelectionEvent) {
                    thisWidget.updateSelection('Data', thisWidget.selectedRows);
                }
            }
        }
    };

    this.setSelectedRegion = function (selectedRow) {

        var isMultiselect = thisWidget.properties['RegionMultiSelect'];

        var selectedRegion;

        for (var regionNo = 0; regionNo < thisWidget.currentRegions.length; regionNo++) {
            var currentRegion = thisWidget.currentRegions[regionNo];
            if (currentRegion.rowNumber === selectedRow) {
                selectedRegion = currentRegion;
                break;
            }
        }

        if (selectedRegion !== undefined) {
            if (selectedRegion._isSelected) {
                if (isMultiselect) {
                    TW.removeElementFromArray(thisWidget.selectedRegionRows, selectedRow);
                    selectedRegion._isSelected = false;
                    selectedRegion.setOptions( { fillColor: selectedRegion._assignedFillColor, strokeColor : selectedRegion._assignedStrokeColor, strokeWeight : selectedRegion._assignedStrokeWeight }); 
                    if (!thisWidget.ignoreRegionSelectionEvent) {
                        thisWidget.updateSelection('RegionData', thisWidget.selectedRegionRows);
                    }
                }
            }
            else {
                if (!isMultiselect) {
                    thisWidget.clearSelectedRegions();
                    thisWidget.selectedRegionRows = [selectedRow];
                }
                else
                    thisWidget.selectedRegionRows.push(selectedRow);

                selectedRegion._isSelected = true;
                selectedRegion.setOptions( { fillColor: thisWidget.selectedRegionStyle.backgroundColor, strokeColor : thisWidget.selectedRegionStyle.lineColor, strokeWeight : parseInt(thisWidget.selectedRegionStyle.lineThickness) }); 

                if (!thisWidget.ignoreRegionSelectionEvent) {
                    thisWidget.updateSelection('RegionData', thisWidget.selectedRegionRows);
                }
            }
        }
    };

    this.handleSelectionUpdate = function (propertyName, selectedRows, selectedRowIndices) {

        if (propertyName == "Data") {
            thisWidget.ignoreSelectionEvent = true;

            thisWidget.clearSelectedMarkers();

            var nSelectedRows = selectedRowIndices.length;

            for (var selectedRowIndex = 0; selectedRowIndex < nSelectedRows;selectedRowIndex++) {
                thisWidget.setSelectedMarker(selectedRowIndices[selectedRowIndex]);
            }
            
            thisWidget.ignoreSelectionEvent = false;
        }

        if (propertyName == "RegionData") {	
            thisWidget.ignoreRegionSelectionEvent = true;

            thisWidget.clearSelectedRegions();

            var nSelectedRows = selectedRowIndices.length;

            for (var selectedRowIndex = 0; selectedRowIndex < nSelectedRows;selectedRowIndex++) {
                thisWidget.setSelectedRegion(selectedRowIndices[selectedRowIndex]);
            }
            
            thisWidget.ignoreRegionSelectionEvent = false;
        }

    };

    this.mouseOverEventListener = function (e) {
        var latlng = e.latLng;

        if (!isMashupTooltipConfigured) {
            return;
        }


        var markerCount = thisWidget.markerLookup.length;
        for (var i = 0; i < markerCount; i++) {
            var markerInfo = thisWidget.markerLookup[i];
            if (latlng.lat() == markerInfo.latlng.lat() && latlng.lng() == markerInfo.latlng.lng()) {
                var selectedMarker = markerInfo.marker;

                var selectedRowNo = selectedMarker.rowNumber;

                TW.log.info('Should display info for Row #' + selectedRowNo);
                //thisWidget.setSelectedMarker(selectedRowNo);

                thisWidget.cleanupTooltipMashup();

                infoWindow.setContent('<div id="' + infoId + '" style="width:' + tooltipMashupWidth + 'px;height:' + tooltipMashupHeight + 'px;">Loading Tooltip Mashup...</div>');
                //infoWindow.setContent('<div id="' + infoId + '" style="">Hello there, selected Row #' + selectedRowNo + ', "' + lastData[selectedRowNo]['name'] + '"</div>');
                //infoWindow.setContent('Hello there, selected Row #' + selectedRowNo + '');
                infoWindow.setPosition(markerInfo.latlng);
                infoWindow.open(this.map, markerInfo.marker);
                setTimeout(function () {
                    var mashupSpec = {};
                    mashupSpec.mashupName = thisWidget.getProperty('TooltipMashupName');
                    mashupSpec.mashupParameters = {};

                    var mashupParameters = thisWidget.properties['MashupParameters'];
                    if (mashupParameters === undefined)
                        mashupParameters = [];

                    var nParams = mashupParameters.length;

                    for (var paramNo = 0; paramNo < nParams; paramNo++) {
                        var paramInfo = mashupParameters[paramNo],
                            propName = paramInfo.ParameterName,
                            fldName = thisWidget.getProperty(propName),
                            propValue;
                        if (fldName === 'ALL_FIELDS') {
                            propValue = JSON.parse(JSON.stringify(dataInfotable));
                            propValue.rows.push(lastData[selectedRowNo]);
                        } else {
                            propValue = lastData[selectedRowNo][thisWidget.getProperty(propName)];
                        }
                        if (propValue !== undefined) {
                            mashupSpec.mashupParameters[propName] = propValue;
                        }
                    }

                    $('#' + infoId).mashup(mashupSpec);
                }, 100);
                return;
            }
        }
    };

    this.regionMouseOverEventListener = function (e) {
    	if(this.rowNumber != lastRegionNumber) {
        	regionInfoWindow.setContent(this.title);
            regionInfoWindow.open(this.map);
            regionInfoWindow.setPosition(this._tooltipCenter);
            lastRegionNumber = this.rowNumber;
    	}
    };

    this.clickEventListener = function (e) {
        var latlng = e.latLng;

        var markerCount = thisWidget.markerLookup.length;
        for (var i = 0; i < markerCount; i++) {
            var markerInfo = thisWidget.markerLookup[i];
            if (latlng.lat() == markerInfo.latlng.lat() && latlng.lng() == markerInfo.latlng.lng()) {
                var selectedMarker = markerInfo.marker;

                var selectedRowNo = selectedMarker.rowNumber;

                thisWidget.setSelectedMarker(selectedRowNo);

                return;
            }
        }
    };

    this.regionClickEventListener = function (e) {
        thisWidget.setSelectedRegion(this.rowNumber);
    };

    this.dblclickEventListener = function (e) {
        
        thisWidget.jqElement.triggerHandler('DoubleClicked');
    };
    
    this.cleanupRouteOverlays = function () {
        try {
            if (this.routePolyline !== undefined && this.routePolyline !== null) {
            	google.maps.event.clearInstanceListeners(this.routePolyline);
                this.routePolyline.setMap(null);
                this.routePolyline = null;
                delete this.routePolyline;
            }
        }
        catch (destroyErr) {
//        	alert('error in destroy routePolyline');
        }
    };
    
    this.cleanupPlannedRouteOverlays = function () {
        try {
            if (this.plannedRoutePolyline !== undefined && this.plannedRoutePolyline !== null) {
            	google.maps.event.clearInstanceListeners(this.plannedRoutePolyline);
                this.plannedRoutePolyline.setMap(null);
                this.plannedRoutePolyline = null;
                delete this.plannedRoutePolyline;
            }
        }
        catch (destroyErr) {
//        	alert('error in destroy plannedRoutePolyline');
        }
    };
    
    this.cleanupRegionOverlays = function () {
        try {
            if (this.currentRegions !== undefined && this.currentRegions !== null) {
                for (var x = 0; x < this.currentRegions.length; x++) {
                    google.maps.event.clearListeners(this.currentRegions[x], 'click');
                    google.maps.event.clearListeners(this.currentRegions[x], 'mouseover');
                	google.maps.event.clearInstanceListeners(this.currentRegions[x]);
                	this.currentRegions[x].setMap(null);
                	this.currentRegions[x] = null;
                }
                
                this.currentRegions = {};
            }
        }
        catch (err) {
	        TW.log.error('error cleanupRegionOverlays', err);
//        	alert('error in destroy routePolyline');
        }
    };
    
    this.cleanupMapOverlays = function () {
        try {
            if (this.polyline !== undefined && this.polyline !== null) {
            	google.maps.event.clearInstanceListeners(this.polyline);
                this.polyline.setMap(null);
                this.polyline = null;
                delete this.polyline;
            }
        }
        catch (destroyErr) {
//        	alert('error in destroy polyline');
        }
        
        try {
            if (this.currentMarkers !== undefined) {
                for (var x = 0; x < this.currentMarkers.length; x++) {
                    if (isMashupTooltipConfigured) {
                        google.maps.event.clearListeners(this.currentMarkers[x], 'mouseover');
                    }
                    google.maps.event.clearListeners(this.currentMarkers[x], 'click');
                    google.maps.event.clearListeners(this.currentMarkers[x], 'dblclick');
                	google.maps.event.clearInstanceListeners(this.currentMarkers[x]);

                	delete this.markerLookup[x].latlng;
                	this.markerLookup[x].marker = null;
                	delete this.markerLookup[x];

                	this.currentMarkers[x].setMap(null);

                	this.currentMarkers[x].rowNumber = null;
                	this.currentMarkers[x].row = null;
                	this.currentMarkers[x]._isSelected = null;
                	this.currentMarkers[x]._assignedIcon = null;
                	
                	delete this.currentMarkers[x].rowNumber;
                	delete this.currentMarkers[x].row;
                	delete this.currentMarkers[x]._isSelected;
                	delete this.currentMarkers[x]._assignedIcon;
                	
                    delete this.currentMarkers[x];
                }
                if(this.markerCluster){
                    this.markerCluster.clearMarkers();
                }
                this.currentMarkers = [];
                this.markerLookup = [];
            }
        }
        catch (destroyErr) {
//        	alert('error in destroy markers');
        }

        try {
            if (this.startMarker !== null && this.startMarker !== undefined) {
                if (isMashupTooltipConfigured) {
                    google.maps.event.clearListeners(this.startMarker, 'mouseover');
                }
                google.maps.event.clearListeners(this.startMarker, 'click');
                google.maps.event.clearListeners(this.startMarker, 'dblclick');
            	google.maps.event.clearInstanceListeners(this.startMarker);
                this.startMarker.setMap(null);
                this.startMarker = null;
                delete this.startMarker;
            }
            
            if (this.endMarker !== null && this.endMarker !== undefined) {
                if (isMashupTooltipConfigured) {
                    google.maps.event.clearListeners(this.endMarker, 'mouseover');
                }
                google.maps.event.clearListeners(this.endMarker, 'click');
                google.maps.event.clearListeners(this.endMarker, 'dblclick');
            	google.maps.event.clearInstanceListeners(this.endMarker);
                this.endMarker.setMap(null);
                this.endMarker = null;
                delete this.endMarker;
            }
        }
        catch (destroyErr) {
//        	alert('error in destroy start/end');
        }
        
        this.selectedRows = [];
    };
    
    this.cleanupMapContent = function () {
    	this.cleanupMapOverlays();
    	this.cleanupRouteOverlays();
    	this.cleanupPlannedRouteOverlays();
    	this.cleanupRegionOverlays();
    	
    	try {
            if(this.trafficLayer !== null && this.trafficLayer !== undefined) {
            	google.maps.event.clearInstanceListeners(this.trafficLayer);
                this.trafficLayer.setMap(null);
                this.trafficLayer = null;
                delete this.trafficLayer;
            }
        }
        catch (destroyErr) {
        }
        
        try {
            if (this.selectionMarker !== null && this.selectionMarker !== undefined) {
            	google.maps.event.clearInstanceListeners(this.selectionMarker);
                this.selectionMarker.setMap(null);
                this.selectionMarker = null;
                delete this.selectionMarker;
            }
            
        }
        catch (destroyErr) {
        }
    };
    
    this.cleanupTooltipMashup = function () {
        try {
            var mashupTooltips = $('#' + infoId);
            if (mashupTooltips.length > 0) {
                mashupTooltips.mashup('destroy');
                TW.purgeJqElement(mashupTooltips);
            }
        }
        catch (destroyErr) {

        }
    };

    this.serviceInvoked = function (serviceName) {
        var widgetReference = this;
        if (serviceName === 'AutoZoom') {
            setTimeout(function () {
	            weAreChangingBounds = true;
                thisWidget.autoCenterMapToBounds();
	            userHasPannedOrZoomedSinceAutoZoom = false;
            }, 100);
        } else {
            TW.log.error('Google map widget, unexpected serviceName invoked "' + serviceName + '"');
        }
    };

    this.beforeDestroy = function () {
    	this.cleanupMapContent();

    	try {
    	    google.maps.event.clearInstanceListeners(this.map);
        }
        catch(destroyErr) {
        	
        }
        
    	this.cleanupTooltipMashup();

        //// put the map back in the body to be reused
    	//$('body').append($('#global-map'));
    	//$('#global-map').hide();

    	dataInfotable = null;

    	thisWidget = null;
    	this.map = null;
    	delete this.map;
    };

    /**
     * Automatically center the map to the provided location(s)
     * @param LatLngList
     */
    this.autoCenterMap = function(LatLngList) {
        if (LatLngList === undefined) {
            return;
        }
        if (LatLngList === null || LatLngList.length > 1) {
            thisWidget.autoCenterMapToBounds();
        }
        else if(LatLngList.length === 1) {
            thisWidget.autoCenterMapToSingleLocation(LatLngList[0]);
        }
    };

    /**
     * Auto center the map to display a single location.
     * @param location
     */
    this.autoCenterMapToSingleLocation = function(location) {
        weAreChangingBounds = true;
        this.map.setCenter(location);
        lastSetLocation = [location];
        weAreChangingBounds = true;
        this.map.setZoom(this.map.getZoom());
    };

    /**
     * Auto center the map to fit multiple locations
     */
    this.autoCenterMapToBounds = function() {
        var effectiveBounds = new google.maps.LatLngBounds();

        if(this.plannedRouteDataBounds !== undefined) {
            effectiveBounds.union(this.plannedRouteDataBounds);
        }

        if(this.routeDataBounds !== undefined) {
            effectiveBounds.union(this.routeDataBounds);
        }

        if(this.regionDataBounds !== undefined) {
            effectiveBounds.union(this.regionDataBounds);
        }

        if(this.dataBounds !== undefined) {
            effectiveBounds.union(this.dataBounds);
        }

        this.map.fitBounds(effectiveBounds);
        lastSetLocation = null;
    };

    this.updateProperty = function (updatePropertyInfo) {

        if (this.haveGoogleMaps) {

	        var zoomOnDataRefresh = true;
	        switch( autoZoomBehavior )  {
		        case 'disable-on-user-pan-zoom':
	                if( userHasPannedOrZoomedSinceAutoZoom === true ) {
		                zoomOnDataRefresh = false;
	                }
			        break;
		        case 'only-when-autozoom-invoked':
			        zoomOnDataRefresh = false;
			        break;
		        case 'only-initial-data':
			        zoomOnDataRefresh = initialData;
			        initialData = false;
			        break;
		        default:
			        zoomOnDataRefresh = true;
	        }

            if (updatePropertyInfo.TargetProperty === 'Zoom') {
                var zoom = parseInt(updatePropertyInfo.RawSinglePropertyValue);
	            weAreChangingBounds = true;
                this.map.setZoom(zoom);
                return;
            }

            if (updatePropertyInfo.TargetProperty === 'ShowTraffic') {
                this.setProperty('ShowTraffic', updatePropertyInfo.RawSinglePropertyValue);
                
                if(this.getProperty('ShowTraffic')) {
                	if(this.trafficLayer === undefined || this.trafficLayer === null) {
                        this.trafficLayer = new google.maps.TrafficLayer(); 
                	}
                    this.trafficLayer.setMap(this.map);
                }
                else{
                	if(this.trafficLayer !== undefined) {
                        this.trafficLayer.setMap(null);
                        this.trafficLayer = null;
                	}
                }
            }
            
            if (updatePropertyInfo.TargetProperty === 'SelectedLocation') {
                // AutoCenterBehavior
                // none, last-selected, all-selected
                var location = updatePropertyInfo.RawSinglePropertyValue;
                // when location is passed as mashup parameter it comes as string
                if (location && typeof location === 'string') {
                    location = JSON.parse(location);
                }
                var lastSelected = _.difference(updatePropertyInfo.SelectedRowIndices, lastSelectedRowIndices);

                // Get the data for the last selected location
                // The data provided in RawSinglePropertyValue is the first item in the array, not the first item selected.
                if(lastSelected.length>0){
                    location = lastData[lastSelected[0]][thisWidget.getProperty('LocationField')];
                }

                if (location != undefined && location.latitude != undefined && location.longitude != undefined) {
                    this.moveSelectionMarker(location);
                    weAreChangingBounds = true;
                    if(autoCenterBehavior === 'last-selected'){
                        thisWidget.autoCenterMap([this.map.getCenter()]);
                    }else if(autoCenterBehavior === 'all-selected'){
                        var bounds = new google.maps.LatLngBounds();
                        var position;
                        var zoom = thisWidget.map.getZoom();
                        for( var i = 0 ; i < updatePropertyInfo.SelectedRowIndices.length ; i++ ){
                            position = lastData[updatePropertyInfo.SelectedRowIndices[i]][thisWidget.getProperty('LocationField')];
                            bounds.extend(new google.maps.LatLng(position.latitude, position.longitude));
                        }
                        thisWidget.map.fitBounds(bounds);
                        if(thisWidget.map.getZoom() > zoom){
                            thisWidget.map.setZoom(zoom);
                        }
                    }
                    thisWidget.setProperty('SelectedLocation', location);
                } else {
                    if(this.selectionMarker !== null && this.selectionMarker !== undefined){
                        this.selectionMarker.setMap(null);
                    }
                    this.selectionMarker = null;
                    thisWidget.setProperty('SelectedLocation', undefined);
                }
                lastSelectedRowIndices = updatePropertyInfo.SelectedRowIndices;
                return;
            }

            var redrawRoute = function() {
                var showRoute = this.getProperty('ShowRoute');
                
                if(showRoute) {
                    this.routeDataBounds = new google.maps.LatLngBounds();

                    var dataRows = updatePropertyInfo.ActualDataRows;

                    this.cleanupRouteOverlays();
                    
                    var locationField = this.getProperty('RouteLocationField');

                    var LatLngList = [];
                    var nRows = dataRows.length;

                    for (var rowNumber = 0; rowNumber < nRows; rowNumber++) {
                        var row = dataRows[rowNumber];
                        var thisLocation = row[locationField];
                        if (thisLocation !== undefined && thisLocation.latitude !== undefined && thisLocation.longitude !== undefined) {
                            var latlng = new google.maps.LatLng(thisLocation.latitude, thisLocation.longitude);
                            LatLngList.push(latlng);
                            this.routeDataBounds.extend(latlng);
                        }
                    }

                    if (LatLngList.length > 1) {
                        this.routePolyline = new google.maps.Polyline({
                            path: LatLngList,
                            strokeColor: thisWidget.routeStyle.lineColor,
                            strokeOpacity: 1.0,
                            strokeWeight: parseInt(thisWidget.routeStyle.lineThickness)
                        });

                        this.routePolyline.setMap(thisWidget.map);

                    }

                    if(zoomOnDataRefresh ) {
	                    google.maps.event.trigger(this.map, 'resize');
	
			            weAreChangingBounds = true;
	                    this.map.setZoom(this.map.getZoom() - 1);
			            weAreChangingBounds = true;
	                    this.map.setZoom(this.map.getZoom() + 1);
                    
	                    // Autofit if we have more than one data point
                        thisWidget.autoCenterMap(LatLngList);
                    }
                }
                
                return;
            };

            if (updatePropertyInfo.TargetProperty === 'RouteData') {
                redrawRoute.call(this);
            }

            var redrawPlannedRoute = function() {
                var showRoute = this.getProperty('ShowPlannedRoute');
                
                if(showRoute) {
                    this.plannedRouteDataBounds = new google.maps.LatLngBounds();

                    var dataRows = updatePropertyInfo.ActualDataRows;

                    this.cleanupPlannedRouteOverlays();
                    
                    var locationField = this.getProperty('PlannedRouteLocationField');

                    var LatLngList = [];
                    var nRows = dataRows.length;

                    for (var rowNumber = 0; rowNumber < nRows; rowNumber++) {
                        var row = dataRows[rowNumber];
                        var thisLocation = row[locationField];
                        if (thisLocation !== undefined && thisLocation.latitude !== undefined && thisLocation.longitude !== undefined) {
                            var latlng = new google.maps.LatLng(thisLocation.latitude, thisLocation.longitude);
                            LatLngList.push(latlng);
                            this.plannedRouteDataBounds.extend(latlng);
                        }
                    }

                    if (LatLngList.length > 1) {
                        this.plannedRoutePolyline = new google.maps.Polyline({
                            path: LatLngList,
                            strokeColor: thisWidget.plannedRouteStyle.lineColor,
                            strokeOpacity: 1.0,
                            strokeWeight: parseInt(thisWidget.plannedRouteStyle.lineThickness)
                        });

                        this.plannedRoutePolyline.setMap(thisWidget.map);

                    }

                    if(zoomOnDataRefresh ) {
	                    google.maps.event.trigger(this.map, 'resize');
	
			            weAreChangingBounds = true;
	                    this.map.setZoom(this.map.getZoom() - 1);
			            weAreChangingBounds = true;
	                    this.map.setZoom(this.map.getZoom() + 1);
                    
	                    // Autofit if we have more than one data point
	                    thisWidget.autoCenterMap(LatLngList);
                    }
                }
                
                return;
            };

            if (updatePropertyInfo.TargetProperty === 'PlannedRouteData') {
                redrawPlannedRoute.call(this);
            }

            var redrawRegions = function() {
                var tooltipField1 = this.getProperty('RegionTooltipField1');
                var tooltipLabel1 = this.getProperty('RegionTooltipLabel1');
                var tooltipField2 = this.getProperty('RegionTooltipField2');
                var tooltipLabel2 = this.getProperty('RegionTooltipLabel2');
                var tooltipField3 = this.getProperty('RegionTooltipField3');
                var tooltipLabel3 = this.getProperty('RegionTooltipLabel3');
                var tooltipField4 = this.getProperty('RegionTooltipField4');
                var tooltipLabel4 = this.getProperty('RegionTooltipLabel4');

                var showRegions = this.getProperty('ShowRegions');
                var showRegionTooltips = this.getProperty('ShowRegionTooltips');
                
                if(showRegions) {
                    this.regionDataBounds = new google.maps.LatLngBounds();

                    var dataRows = updatePropertyInfo.ActualDataRows;

                    var enableRegionSelection = this.getProperty('EnableRegionSelection');
                    
                    this.cleanupRegionOverlays();
                    
                    var locationsField = this.getProperty('RegionLocationsField');
                    var locationField = this.getProperty('RegionLocationField');
                    var fillOpacity = this.getProperty('RegionFillOpacity');

                    this.currentRegions = [];
                    var LatLngList = [];
                    
                    var nRows = dataRows.length;

                    for (var rowNumber = 0; rowNumber < nRows; rowNumber++) {
                        var row = dataRows[rowNumber];
                        var locationTable = row[locationsField];
                        if(locationTable !== undefined) {
                            var RegionLatLngList = [];
                            var regionDataRows = locationTable.rows;
                            var nRegionRows = regionDataRows.length;
                            
                            var polygonBounds = new google.maps.LatLngBounds();
                            
                            for (var regionRowNumber = 0; regionRowNumber < nRegionRows; regionRowNumber++) {
                                var regionRow = regionDataRows[regionRowNumber];
                                var thisLocation = regionRow[locationField];
	                            if (thisLocation !== undefined && thisLocation.latitude !== undefined && thisLocation.longitude !== undefined) {
	                                var latlng = new google.maps.LatLng(thisLocation.latitude, thisLocation.longitude);
	                                RegionLatLngList.push(latlng);
	                                LatLngList.push(latlng);
	                                this.regionDataBounds.extend(latlng);
	                                polygonBounds.extend(latlng);
	                            }
                            }
                            
                            if (RegionLatLngList.length > 1) {
                            	
                                var hasRegionFormatting = thisWidget.properties['RegionFormatting'] !== undefined;

                                var formatStyle = thisWidget.regionStyle;
                                
                                if (hasRegionFormatting) {
                                    formatStyle = TW.getStyleFromStateFormatting({ DataRow: row, StateFormatting: thisWidget.properties['RegionFormatting'] });
                                }

                                var regionProps = {
                                        paths: RegionLatLngList,
                                        strokeColor: formatStyle.lineColor,
                                        strokeOpacity: 1.0,
                                        strokeWeight: parseInt(formatStyle.lineThickness),
                                        fillColor: formatStyle.backgroundColor,
                                        fillOpacity: fillOpacity
                                    };
                                
                                
                                var regionPolygon = new google.maps.Polygon(regionProps);

                                var regionLayerField = thisWidget.properties['RegionLayerField'];
                                
                                if( regionPolygon['setZIndex'] !== undefined ) {
	                                if(regionLayerField !== undefined && regionLayerField !== '') {
	                                    var regionLayer = row[regionLayerField];

	                                    if(regionLayer !== undefined)
	                                        regionPolygon.setZIndex(google.maps.Marker.MAX_ZINDEX + regionLayer);
	                                    else
	                                        regionPolygon.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
	                                }
	                                else {
	                                    regionPolygon.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
	                                }
                                }

                                regionPolygon._assignedFillColor = formatStyle.backgroundColor;
                                regionPolygon._assignedStrokeColor = formatStyle.lineColor;
                                regionPolygon._assignedStrokeWeight = parseInt(formatStyle.lineThickness);
                                
                                regionPolygon.rowNumber = rowNumber;
                                regionPolygon.rowData = row;
                                regionPolygon._isSelected = false;
                                regionPolygon._tooltipCenter = polygonBounds.getCenter();
                                regionPolygon.setMap(thisWidget.map);

                                if(enableRegionSelection) {
                                    google.maps.event.addListener(regionPolygon, 'click', this.regionClickEventListener);
                                }
                                
                                this.currentRegions.push(regionPolygon);

                                if(showRegionTooltips) {
                                    var title = '';

                                    if (tooltipField1 !== undefined && tooltipField1 !== '') {
                                        if (tooltipLabel1 !== undefined && tooltipLabel1 !== '')
                                            title = title + tooltipLabel1 + ' : ';
                                        else
                                            title = title + tooltipField1 + ' : ';

                                        title = title + row[tooltipField1];
                                    }

                                    if (tooltipField2 !== undefined && tooltipField2 !== '') {
                                        if (title.length > 0)
                                            title = title + '<BR>';

                                        if (tooltipLabel2 !== undefined && tooltipLabel2 !== '')
                                            title = title + tooltipLabel2 + ' : ';
                                        else
                                            title = title + tooltipField2 + ' : ';

                                        title = title + row[tooltipField2];
                                    }

                                    if (tooltipField3 !== undefined && tooltipField3 !== '') {
                                        if (title.length > 0)
                                            title = title + '<BR>';

                                        if (tooltipLabel3 !== undefined && tooltipLabel3 !== '')
                                            title = title + tooltipLabel3 + ' : ';
                                        else
                                            title = title + tooltipField3 + ' : ';

                                        title = title + row[tooltipField3];
                                    }

                                    if (tooltipField4 !== undefined && tooltipField4 !== '') {
                                        if (title.length > 0)
                                            title = title + '<BR>';

                                        if (tooltipLabel4 !== undefined && tooltipLabel4 !== '')
                                            title = title + tooltipLabel4 + ' : ';
                                        else
                                            title = title + tooltipField4 + ' : ';

                                        title = title + row[tooltipField4];
                                    }

                                    if (title.length > 0) {
                                        regionPolygon.title = title;
                                        google.maps.event.addListener(regionPolygon, 'mouseover', this.regionMouseOverEventListener);
                                    }
                                }

                            }

                        }
                    }

                    // Autofit if we have more than one data point

                    if(zoomOnDataRefresh) {
	                    google.maps.event.trigger(this.map, 'resize');
	
			            weAreChangingBounds = true;
	                    this.map.setZoom(this.map.getZoom() - 1);
			            weAreChangingBounds = true;
	                    this.map.setZoom(this.map.getZoom() + 1);
	
	                    // Autofit if we have more than one data point
                        thisWidget.autoCenterMap(LatLngList);
                    }
                }
                
                return;
            };

            if (updatePropertyInfo.TargetProperty === 'RegionData') {
                redrawRegions.call(this);
            }

            var redrawMap = function() {
                dataInfotable = {
                    dataShape: {
                        fieldDefinitions: updatePropertyInfo.DataShape
                    },
                    rows: []
                };
                this.dataBounds = new google.maps.LatLngBounds();

                this.selectedRows = [];

                var dataRows = updatePropertyInfo.ActualDataRows;

                lastData = dataRows;

                this.cleanupMapOverlays();
                
                var locationField = this.getProperty('LocationField');

                var tooltipField1 = this.getProperty('TooltipField1');
                var tooltipLabel1 = this.getProperty('TooltipLabel1');
                var tooltipField2 = this.getProperty('TooltipField2');
                var tooltipLabel2 = this.getProperty('TooltipLabel2');
                var tooltipField3 = this.getProperty('TooltipField3');
                var tooltipLabel3 = this.getProperty('TooltipLabel3');
                var tooltipField4 = this.getProperty('TooltipField4');
                var tooltipLabel4 = this.getProperty('TooltipLabel4');

                var LatLngList = [];

                var showMarkers = this.getProperty('ShowMarkers');
                var showMarkerTooltips = this.getProperty('ShowMarkerTooltips');
                
                if(showMarkerTooltips == null || showMarkerTooltips == undefined)
                	showMarkerTooltips = true;
                
                var enableMarkerSelection = this.getProperty('EnableMarkerSelection');

                var nRows = dataRows.length;

                for (var rowNumber = 0; rowNumber < nRows; rowNumber++) {
                    var row = dataRows[rowNumber];
                    var thisLocation = row[locationField];
                    if (thisLocation !== undefined && thisLocation.latitude !== undefined && thisLocation.longitude !== undefined) {
                        var latlng = new google.maps.LatLng(thisLocation.latitude, thisLocation.longitude);
                        LatLngList.push(latlng);

                        if (showMarkers) {

                            var markerProps = {
                                position: latlng
                            };

                            if(!thisWidget.markerCluster){
                                markerProps.map = thisWidget.map;
                            }

                            if(showMarkerTooltips) {
	                            var title = '';
	
	                            if (tooltipField1 !== undefined && tooltipField1 !== '') {
	                                if (tooltipLabel1 !== undefined && tooltipLabel1 !== '')
	                                    title = title + tooltipLabel1 + ' : ';
	                                else
	                                    title = title + tooltipField1 + ' : ';

	                                title = title + row[tooltipField1];
	                            }

	                            if (tooltipField2 !== undefined && tooltipField2 !== '') {
	                                if (title.length > 0)
	                                    title = title + '\n';

	                                if (tooltipLabel2 !== undefined && tooltipLabel2 !== '')
	                                    title = title + tooltipLabel2 + ' : ';
	                                else
	                                    title = title + tooltipField2 + ' : ';

	                                title = title + row[tooltipField2];
	                            }

	                            if (tooltipField3 !== undefined && tooltipField3 !== '') {
	                                if (title.length > 0)
	                                    title = title + '\n';

	                                if (tooltipLabel3 !== undefined && tooltipLabel3 !== '')
	                                    title = title + tooltipLabel3 + ' : ';
	                                else
	                                    title = title + tooltipField3 + ' : ';

	                                title = title + row[tooltipField3];
	                            }

	                            if (tooltipField4 !== undefined && tooltipField4 !== '') {
	                                if (title.length > 0)
	                                    title = title + '\n';

	                                if (tooltipLabel4 !== undefined && tooltipLabel4 !== '')
	                                    title = title + tooltipLabel4 + ' : ';
	                                else
	                                    title = title + tooltipField4 + ' : ';

	                                title = title + row[tooltipField4];
	                            }
	
	                            if (title.length > 0 && !isMashupTooltipConfigured) {
	                                markerProps.title = title;
	                            }
                            }
                            
                            var markerField = thisWidget.properties['MarkerField'];
                            
                            var hasFormatting = thisWidget.properties['MarkerFormatting'] !== undefined;

                            if (hasFormatting) {
                                var formatStyle = TW.getStyleFromStateFormatting({ DataRow: row, StateFormatting: thisWidget.properties['MarkerFormatting'] });
                                if (formatStyle.styleDefinitionName !== undefined) {
                                    markerProps.icon = formatStyle.image;
                                } else {
                                    markerProps.icon = thisWidget.markerStyle.image;
                                }
                            }
                            else
                                markerProps.icon = thisWidget.markerStyle.image;

                            if(markerField !== undefined && markerField !== '') {
                            	var markerImagePath = row[markerField];
                                if(markerImagePath !== undefined && markerImagePath !== '') {
                                	markerProps.icon = markerImagePath;
                                }
                            }
                            
                            var marker = new google.maps.Marker(markerProps);
                            marker.rowNumber = rowNumber;
                            marker.rowData = row;
                            marker._isSelected = false;
                            marker._assignedIcon = markerProps.icon;
                            
                            var markerLayerField = thisWidget.properties['MarkerLayerField'];
                            
                            if(markerLayerField !== undefined && markerLayerField !== '') {
                            	var markerLayer = row[markerLayerField];
                            	
                            	if(markerLayer !== undefined)
                            		marker.setZIndex(google.maps.Marker.MAX_ZINDEX + markerLayer);
                            	else
                            		marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
                            }
                            else
                            	marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);

                            this.currentMarkers.push(marker);

                            this.markerLookup.push({ latlng : latlng, marker : marker});
                            
                            // This funky code is because we are in a loop and need to do some closure magic

                            if (isMashupTooltipConfigured) {
                                google.maps.event.addListener(marker, 'mouseover', this.mouseOverEventListener);
                            }
                            
                            if (enableMarkerSelection) {
                                google.maps.event.addListener(marker, 'click', this.clickEventListener);
                                google.maps.event.addListener(marker, 'dblclick', this.dblclickEventListener);
                            }
                        }

                        this.dataBounds.extend(latlng);
                    }
                }

                if(this.markerCluster){
                    this.markerCluster.addMarkers(this.currentMarkers);
                }

                var showPathBetweenMarkers = this.getProperty('ShowPathBetweenMarkers');
                if (LatLngList.length > 1 && showPathBetweenMarkers) {
                    this.polyline = new google.maps.Polyline({
                        path: LatLngList,
                        strokeColor: thisWidget.pathStyle.lineColor,
                        strokeOpacity: 1.0,
                        strokeWeight: parseInt(thisWidget.pathStyle.lineThickness)
                    });

                    this.polyline.setMap(thisWidget.map);

                    if (this.getProperty('ShowEndMarker')) {
                        this.endMarker = new google.maps.Marker({
                            map: this.map,
                            position: LatLngList[LatLngList.length - 1],
                            title: "End",
                            icon: this.endMarkerStyle.image
                        });
                        this.endMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 2);
                    }

                    if (this.getProperty('ShowStartMarker')) {
                        this.startMarker = new google.maps.Marker({
                            map: this.map,
                            position: LatLngList[0],
                            title: "Start",
                            icon: this.startMarkerStyle.image
                        });
                        this.startMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 2);
                    }

                }

                // Autofit if we have more than one data point

                if(zoomOnDataRefresh) {
	                google.maps.event.trigger(this.map, 'resize');
	
		            weAreChangingBounds = true;
	                this.map.setZoom(this.map.getZoom() - 1);
		            weAreChangingBounds = true;
	                this.map.setZoom(this.map.getZoom() + 1);
	
	                // Autofit if we have more than one data point
                    thisWidget.autoCenterMap(LatLngList);
                }
                
                // Finally, handle any pre-selected markers

                thisWidget.clearSelectedMarkers();
                var selectedRowIndices = updatePropertyInfo.SelectedRowIndices;

                if (selectedRowIndices !== undefined) {
                    var nSelectedRows = selectedRowIndices.length;

                    for (var selectedRowIndex = 0; selectedRowIndex < nSelectedRows; selectedRowIndex++) {
                        thisWidget.setSelectedMarker(selectedRowIndices[selectedRowIndex]);
                    }
                }
            };

            if (updatePropertyInfo.TargetProperty === 'Data') {
                redrawMap.call(this);
            }

            switch (updatePropertyInfo.TargetProperty) {
                case 'ShowPathBetweenMarkers':
                case 'ShowStartMarker':
                case 'ShowEndMarker':
                case 'ShowMarkers':
                    thisWidget.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
                    redrawMap.call(this);
                    break;
                case 'ShowRoute':
                    thisWidget.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
                    redrawRoute.call(this);
                    break;
                case 'ShowPlannedRoute':
                    thisWidget.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
                    redrawPlannedRoute.call(this);
                    break;
                case 'ShowRegions':
                    thisWidget.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
                    redrawRegions.call(this);
                    break;
            }
        } else {
            updatePropertyCallCache.push(updatePropertyInfo);
        }
    };
};
