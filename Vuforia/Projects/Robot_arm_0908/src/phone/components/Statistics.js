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


// Chart settings -----------------------------------------------------

// Chart Legends
Chart.defaults.global.legend.position="bottom";
Chart.defaults.global.legend.labels.fontColor="#000000";
Chart.defaults.global.defaultFontColor="#0000ff";
Chart.defaults.global.defaultFontSize=10;
Chart.defaults.global.title.display=true;

//For timeseries LINES
Chart.defaults.global.elements.line.backgroundColor="#ffffff";
Chart.defaults.global.elements.line.borderColor='rgba(0, 50, 255, 0.7)';

// for time series POINTS
Chart.defaults.global.elements.point.backgroundColor="#ffffff";
Chart.defaults.global.elements.point.borderColor="#007777";
Chart.defaults.global.elements.point.radius=2;