// $scope, $element, $attrs, $injector, $sce, $timeout, $http, $ionicPopup, and $ionicPopover services are available


// function to redirect to edr home page
$scope.goToEDR = function () {
	window.location.href = 'https://edrmedeso.com/'	  
}



//------------------------------------------------------ Highlight individual parts -------------------------------

var yellow = 'rgba(238,238,0,1)';
var orange = 'rgba(211,84,0,1)'

$scope.highlightLowerPart = function() {
  
  //Making spec images non-visible
  $scope.view.wdg['servo_specs']['visible'] = false;
  $scope.view.wdg['servo2_specs']['visible'] = false;

  //If part is clicked and already highlighted - non-highlight it
  if ($scope.view.wdg['lower-arm-separate'].color == yellow) {
    
    $scope.view.wdg['base'].opacity = 1;
    $scope.view.wdg['upper-arm'].opacity = 1;
    $scope.view.wdg['middle-arm-separate'].opacity = 1;
    $scope.view.wdg['lower-arm-separate'].opacity = 1;
    $scope.view.wdg['lower-arm-separate'].color = orange;

  }
  
  // Highlight arm
  else {
    
	$scope.view.wdg['base'].opacity = 0.2;
    $scope.view.wdg['base'].color = orange;
    $scope.view.wdg['upper-arm'].opacity = 0.2;
    $scope.view.wdg['upper-arm'].color = orange;    
    $scope.view.wdg['middle-arm-separate'].opacity = 0.2;
    $scope.view.wdg['middle-arm-separate'].color = orange;    
    $scope.view.wdg['lower-arm-separate'].color = yellow;
    $scope.view.wdg['lower-arm-separate'].opacity = 1;
  }
}

$scope.highlightMiddlePart = function() {
	$scope.view.wdg['servo_specs']['visible'] = false;

  if ($scope.view.wdg['middle-arm-separate'].color == yellow) {
    $scope.view.wdg['base'].opacity = 1;
    $scope.view.wdg['upper-arm'].opacity = 1;
    $scope.view.wdg['lower-arm-separate'].opacity = 1;
    $scope.view.wdg['middle-arm-separate'].color = orange;
    $scope.view.wdg['middle-arm-separate'].opacity = 1;

  }

  else {
	
	$scope.view.wdg['base'].opacity = 0.2;
    $scope.view.wdg['base'].color = orange;
	$scope.view.wdg['upper-arm'].opacity = 0.2;
    $scope.view.wdg['upper-arm'].color = orange;
	$scope.view.wdg['lower-arm-separate'].opacity = 0.2;
    $scope.view.wdg['lower-arm-separate'].color = orange;   
    $scope.view.wdg['middle-arm-separate'].color = yellow;
    $scope.view.wdg['middle-arm-separate'].opacity = 1;
  }
}

$scope.highlightUpperPart = function() {
  $scope.view.wdg['servo2_specs']['visible'] = false;
  if ($scope.view.wdg['upper-arm'].color == yellow) {
    $scope.view.wdg['base'].opacity = 1;
    $scope.view.wdg['middle-arm-separate'].opacity = 1;
    $scope.view.wdg['lower-arm-separate'].opacity = 1;
    $scope.view.wdg['upper-arm'].opacity = 1;
    $scope.view.wdg['upper-arm'].color = orange;

  }

  else {
    

	$scope.view.wdg['base'].opacity = 0.2;
    $scope.view.wdg['base'].color = orange;
	$scope.view.wdg['middle-arm-separate'].opacity = 0.2;
    $scope.view.wdg['middle-arm-separate'].color = orange;
	$scope.view.wdg['lower-arm-separate'].opacity = 0.2;
    $scope.view.wdg['lower-arm-separate'].color = orange;
    $scope.view.wdg['upper-arm'].color = yellow;
    $scope.view.wdg['upper-arm'].opacity = 1;
  }
}

$scope.highlightBasePart = function() {
  $scope.view.wdg['servo_specs']['visible'] = false;
  $scope.view.wdg['servo2_specs']['visible'] = false;

  if ($scope.view.wdg['base'].color == yellow) {
    $scope.view.wdg['lower-arm-separate'].opacity = 1;
    $scope.view.wdg['middle-arm-separate'].opacity = 1;
    $scope.view.wdg['upper-arm'].opacity = 1;
    $scope.view.wdg['base'].opacity = 1;
    $scope.view.wdg['base'].color = orange;

  }

  else {
    
	$scope.view.wdg['lower-arm-separate'].opacity = 0.2;
    $scope.view.wdg['lower-arm-separate'].color = orange;
	$scope.view.wdg['middle-arm-separate'].opacity = 0.2;
    $scope.view.wdg['middle-arm-separate'].color = orange;
	$scope.view.wdg['upper-arm'].opacity = 0.2;
    $scope.view.wdg['upper-arm'].color = orange;
    $scope.view.wdg['base'].opacity = 1;
    $scope.view.wdg['base'].color = yellow;
  }
}


// ------------------------------- Gauges ----------------------------------------------------------------------


// Example functions for adding text to image/gauge
$scope.gaugeText = function() {
  
 $scope.app.params.labelText2= "Green lantern"; 
}

$scope.angleParameter = function() {
  
 $scope.app.params.angle1= 999; 
}

// Make degree gauge visible/non visible
$scope.showAngle = function() {
  if ($scope.view.wdg['angle']['visible']) {                                            
  $scope.view.wdg['angle']['visible'] = false;
    
  } 
  else {
    // If one gauge is set visible, set all the others non-visible
    $scope.view.wdg['angle']['visible'] = true;
    $scope.view.wdg['angle1']['visible'] = false;
    $scope.view.wdg['angle2']['visible'] = false;
    $scope.view.wdg['angle3']['visible'] = false;

  }
}


$scope.showAngle1 = function() {
  if ($scope.view.wdg['angle1']['visible']) {                                            
  $scope.view.wdg['angle1']['visible'] = false;
    
  } 
  else {
    $scope.view.wdg['angle1']['visible'] = true;
    $scope.view.wdg['angle2']['visible'] = false;
    $scope.view.wdg['angle3']['visible'] = false;
    $scope.view.wdg['angle']['visible'] = false;


  }
}

$scope.showAngle2 = function() {
  if ($scope.view.wdg['angle2']['visible']) {                                            
  $scope.view.wdg['angle2']['visible'] = false;
  } 
  else {
    $scope.view.wdg['angle2']['visible'] = true;
    $scope.view.wdg['angle1']['visible'] = false;
    $scope.view.wdg['angle3']['visible'] = false;
    $scope.view.wdg['angle']['visible'] = false;


    
  }
}

$scope.showAngle3 = function() {
  if ($scope.view.wdg['angle3']['visible']) {                                            
  $scope.view.wdg['angle3']['visible'] = false;
  } 
  else {
    $scope.view.wdg['angle3']['visible'] = true;
    $scope.view.wdg['angle1']['visible'] = false;
    $scope.view.wdg['angle2']['visible'] = false;
    $scope.view.wdg['angle']['visible'] = false;

    
  }
}



// Make spec image visible
$scope.showSpecs = function() {
 
  
  if ($scope.view.wdg['servo_specs']['visible']) {                                            
  $scope.view.wdg['servo_specs']['visible'] = false;
  } 
  else {
    $scope.view.wdg['servo_specs']['visible'] = true;
  }
 
 }


$scope.showSpecs2 = function() {
  if ($scope.view.wdg['servo2_specs']['visible']) {                                            
  $scope.view.wdg['servo2_specs']['visible'] = false;
  } 
  else {
    $scope.view.wdg['servo2_specs']['visible'] = true;
  }
}










//----------------------- Animation code ----------------------------------------------------------------------





// variables used for animation
var timerId = -1;
var timingInterval = 30; // milliseconds

// variables used for moving the robot
var delta_base_ry = 0;
var delta_lowerArm_rx = 0;
var delta_middleArm_rx = 0;
var delta_upperArm_rx = 0;

// invoked by Power button 'Pressed' event
$scope.startRobot = function() {
    if (timerId > -1) { clearInterval(timerId); }

    // evaluates the function at intervals specified by the timingInterval variable
    timerId = setInterval(function() {
        // ensure parameter values
        if (!$scope.app.params.base_ry) { $scope.app.params.base_ry = 0; }
        if (!$scope.app.params.lowerArm_rx) { $scope.app.params.lowerArm_rx = 0; }
        if (!$scope.app.params.middleArm_rx) { $scope.app.params.middleArm_rx = 0; }
        if (!$scope.app.params.upperArm_rx) { $scope.app.params.upperArm_rx = 0; }

        // animates the robot
        $scope.$apply(function() {
            // move
            $scope.app.params.base_ry += delta_base_ry;
            $scope.app.params.lowerArm_rx += delta_lowerArm_rx;
            $scope.app.params.middleArm_rx += delta_middleArm_rx;
            $scope.app.params.upperArm_rx += delta_upperArm_rx;
        });

    }, timingInterval);
}


// functions used by toggling the 'Pressed' and 'Unpressed' events
$scope.rotBaseLeft  = function() { delta_base_ry = 0.5; }
$scope.rotBaseRight = function() { delta_base_ry = -0.5; }
$scope.stopBase     = function() { delta_base_ry = 0; }

$scope.rotLowerArmLeft  = function() { delta_lowerArm_rx = 0.5; }
$scope.rotLowerArmRight = function() { delta_lowerArm_rx = -0.5; }
$scope.stopLowerArm     = function() { delta_lowerArm_rx = 0; }


$scope.rotMiddleArmLeft  = function() { delta_middleArm_rx = 0.5; }
$scope.rotMiddleArmRight = function() { delta_middleArm_rx = -0.5; }
$scope.stopMiddleArm     = function() { delta_middleArm_rx = 0; }


$scope.rotUpperArmLeft  = function() { delta_upperArm_rx = 0.5; }
$scope.rotUpperArmRight = function() { delta_upperArm_rx = -0.5; }
$scope.stopUpperArm     = function() { delta_upperArm_rx = 0; }


//----------------------------------------------------------------------------------------------------------

// function to nav between tabs
$scope.navType = function (type) {
  	// Make all nav labels unselected
    $scope.setWidgetProp('home', 'class', 'label_nav');
    $scope.setWidgetProp('statistics', 'class', 'label_nav');
    $scope.setWidgetProp('explore', 'class', 'label_nav');
  	// Make statistics label selected
    $scope.setWidgetProp(type, 'class', 'label_nav_selected');	
  	
  	// Make correct display visible
  	if (type == 'statistics') {
           $scope.setWidgetProp('display_statistics', 'visible', 'true'); 
        } 
    else {
	     $scope.setWidgetProp('display_statistics', 'visible', 'false');
    	}
      
}


// function navigate statistics displays
$scope.navStatisticsStress = function () {
    // Mark Stress label as selected
    $scope.setWidgetProp('stress', 'class', 'label_nav_statistics_selected');
    // Mark Operation label as unselected
    $scope.setWidgetProp('operation', 'class', 'label_nav_statistics');
}

$scope.navStatisticsOperation = function () {
    // Mark Stress label as unselected
    $scope.setWidgetProp('stress', 'class', 'label_nav_statistics');
    // Mark Operation label as selected
    $scope.setWidgetProp('operation', 'class', 'label_nav_statistics_selected');
}

$scope.navStatisticsType = function (type) {
    // Mark all type labels unselected
    $scope.setWidgetProp('day', 'class', 'label_nav_statistics2');
    $scope.setWidgetProp('week', 'class', 'label_nav_statistics2');
    $scope.setWidgetProp('month', 'class', 'label_nav_statistics2');
    $scope.setWidgetProp('all_time', 'class', 'label_nav_statistics2');
    // Mark type label selected
    $scope.setWidgetProp(type, 'class', 'label_nav_statistics2_selected');
}





