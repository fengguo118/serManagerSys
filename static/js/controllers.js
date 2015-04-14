/**
 * 这里是书籍列表模块
 * @type {[type]}
 */
var bookListModule = angular.module("BookListModule", []);
bookListModule.controller('BookListCtrl', function($scope, $http, $location, $state, $stateParams) {
	
	$scope.login=function(userInfo){
		console.log(userInfo);
		$http.post('/login', userInfo).success(function(data){
			console.log(data + $location.url());
			 if (data == "login success"){
				 $location.path("/0");
			 }
		}).error(function(error){
			console.log(error);
		});
	};
		
	$scope.saveData = function(userInfo){
		console.log(userInfo);
		if (window.needUploadFile) {
			console.log("upload image file!");
			document.getElementById("uploadFormsub").action = "/upload";
			$('#uploadFormsub').ajaxSubmit({
				error: function (error) {
					console.log("============================");
					window.needUploadFile = false;
					window.document.querySelector('#uploadFormsub').outerHTML = window.document.querySelector('#uploadFormsub').outerHTML;
					document.querySelector('#uploadFileNameLabel').innerText = '';
					console.log(error);
					alert('文件上传失败');
				},
				success: function (uploadFileData) {
					console.log("=============+++++++===============");
					window.needUploadFile = false;
					window.document.querySelector('#uploadFormsub').outerHTML = window.document.querySelector('#uploadFormsub').outerHTML;
					userInfo.imageUrl = "image/"+uploadFileData.filename;
					console.log(userInfo);
					$http.post('/addProduct', userInfo).success(function(data){
						alert('添加信息成功');
						$location.path("/0");
					}).error(function(error){
						console.log(error);
					});
				}
			})
		}
	};
	
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 20],
        pageSize: 5,
        currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.books = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    //这里可以根据路由上传递过来的bookType参数加载不同的数据
    console.log($stateParams);
    $scope.getPagedDataAsync = function(pageSize, page, searchText) {
        setTimeout(function() {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.post('/webProduct', {"productType":$stateParams.bookType})
                    .success(function(largeLoad) {
						console.log(largeLoad);
                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
						console.log(data);
                        $scope.setPagingData(data, page, pageSize);
                    });
            } else {
                $http.post('/webProduct', {"productType":$stateParams.bookType})
                    .success(function(largeLoad) {
						console.log(largeLoad);
                        $scope.setPagingData(largeLoad, page, pageSize);
                    });
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function(newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {
        data: 'books',
        rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
            '<div ng-cell></div>' +
            '</div></div>',
        multiSelect: false,
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEdit: true,
        enablePinning: true,
        columnDefs: [{
            field: 'Id',
            displayName: 'Id',
            width: 60,
            pinnable: false,
            sortable: false
        }, {
            field: 'name',
            displayName: 'Product Model',
            enableCellEdit: true
        }, {
            field: 'configure',
            displayName: 'Config Code',
            enableCellEdit: true,
            width: 220
        }, {
            field: 'skin',
            displayName: 'Skin Class',
            enableCellEdit: true,
            width: 120
        }, {
            field: 'price',
            displayName: 'Price',
            enableCellEdit: true,
            width: 120,
            cellFilter: 'currency:"￥"'
        }, {
            field: 'productID',
            displayName: 'Details',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<div><a ui-sref="bookdetail({bookId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">Details</a></div>'
        }],
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };
});


/**
 * 这里是书籍详情模块
 * @type {[type]}
 */
var bookDetailModule = angular.module("BookDetailModule", []);
bookDetailModule.controller('BookDetailCtrl', function($scope, $http, $state, $stateParams) {
    console.log($stateParams);
    //请模仿上面的代码，用$http到后台获取数据，把这里的例子实现完整
    
});


window.needUploadFile = false;
window.markUploadFileFlag = function (o) {
  //限制上传文件大小
  var limitFileSize = 200 * 1024 ; //200kb
  if (document.querySelector('#fileUpload').files[0].size > limitFileSize) {
    return alert('上传文件大小不得超过200kb');
  }
  window.needUploadFile = true;
// myform = document.createElement("form");
// myform.action="/upload";
// myform.method ="post";
// myform.enctype = "multipart/form-data";
// myform.id = "uploadFormsub";
// document.getElementById("uploadForm").appendChild(myform);
// $(o).parent().find("input:file").eq(0).appendTo($(myform));
  // console.log(window.needUploadFile)
}
