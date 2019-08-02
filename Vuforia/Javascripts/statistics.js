// $scope, $element, $attrs, $injector, $sce, $timeout, $http, $ionicPopup, and $ionicPopover services are available


// function to redirect to edr home page
$scope.goToEDR = function () {
	window.location.href = 'https://edrmedeso.com/'	  
};



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