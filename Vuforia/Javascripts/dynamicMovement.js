// $scope, $element, $attrs, $injector, $sce, $timeout, $http, $ionicPopup, and $ionicPopover services are available

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
