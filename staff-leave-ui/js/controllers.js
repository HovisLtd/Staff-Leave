// ANGULAR CONTROLLERS

'use strict';


var CompanyCarsControllers = angular.module('CompanyCarsControllers', []);

CompanyCarsControllers.controller('CompanyCarRequest', ['$scope', '$modal', '$http', '$location',
	function($scope, $modal, $http, $location){

		// read URL

		$scope.urlPath = $location.search();

		if ($scope.urlPath.req) {

			var request = $scope.urlPath.req;

			if (Number.isInteger(parseInt(request),10)) {

				$scope.httpSuccess = false;
				$scope.httpError = false;
				$scope.errorMessage = "";
				$scope.errorSuggestion = "";

				$scope.httpInProgress = true;
				$scope.waitMessage = "Finding request...";

				var addModal = $modal({
					title: "",
					show: true,
					html: true,
					animation: 'am-fade-and-scale',
					template: 'simpleAlertModal.html',
					backdrop: 'static',
					keyboard: false,
					scope: $scope
				});

				$http({
					url: '/process',
					params: {
						req: request
					},
					method: 'GET'
				}).success(function(data){

					$scope.httpInProgress = false;
					$scope.httpSuccess = true;
					$scope.successMessage = "Employee record retrieved."
					addModal.hide();

					$scope.unpackRequestData(data);

					// has the request been submitted already? ie. workflow[0].passed etc

					if (!$scope.workflow[0].passed) {
						if ($scope.authorisedUser) {
							$scope.fetchedRecord = true; $scope.editRequest = true; $scope.requestSubmitted = false;
						}
						else {
							$scope.fetchedRecord = true; $scope.editRequest = false; $scope.requestSubmitted = true;							
						}
					}
					else {	
						$scope.fetchedRecord = true; $scope.editRequest = false; $scope.requestSubmitted = true;							
					}

				}).error(function(data){

					$scope.httpInProgress = false;
					$scope.httpError = true;
					$scope.errorMessage = data.error;
					$scope.errorSuggestion = " - try reloading or contact the apps administrator.";

				});
			}
		}

		// the workflow object

		var resetWorkflow = [{
			// submitted request begins here
			stageNumber: 0,
			label: "Request Submitted",
			passed: false,
			failed: false,
			returned: false,
			comment: "",
			assignedTo: null,
			assignedToEmail: null,
			notified: false,
			inSummary: true,
			opened: new Date().toISOString(),
			openCondition: true
		},{
			stageNumber: 1,
			label: "Authorisation by Head of Department",
			passed: false,
			failed: false,
			returned: false,			
			comment: "",
			assignedTo: null,
			assignedToEmail: null,
			notified: false,
			inSummary: true,
			opened: null,
			openCondition: "$scope.workflow[0].passed"
				
		},{
			stageNumber: 2,
			label: "Authorisation by Functional Director",
			passed: false,
			failed: false,
			returned: false,
			comment: "",
			assignedTo: null,
			assignedToEmail: null,
			notified: false,
			inSummary: true,
			opened: null,
			openCondition: "$scope.workflow[1].passed"

		},{
			stageNumber: 3,
			label: "Authorisation by HR Business Partner",
			passed: false,
			failed: false,
			returned: false,
			comment: "",
			assignedTo: null,
			assignedToEmail: null,
			notified: false,
			inSummary: true,
			opened: null,
			openCondition: "$scope.workflow[2].passed"

		},{
			// end stage - all done
			stageNumber: 4,
			label: "Request Authorisation Completed",
			passed: false,
			failed: false,
			returned: false,
			comment: "",
			assignedTo: null,
			assignedToEmail: null,
			notified: false,
			inSummary: false,
			opened: null,
			openCondition: "$scope.workflow[3].passed"

		}];

		$scope.workflow = resetWorkflow;

		// workflow roles assigned according to record

		$scope.$watch("employee", function(){

			$scope.workflow[0].assignedTo = $scope.requestOwner;
			$scope.workflow[0].assignedToEmail = $scope.requestOwnerEmail;			
			$scope.workflow[1].assignedTo = $scope.employee.headOfDeptEmail;
			$scope.workflow[1].assignedToEmail = $scope.employee.headOfDeptEmail;
			$scope.workflow[2].assignedTo = $scope.employee.functionalDirEmail;
			$scope.workflow[2].assignedToEmail = $scope.employee.functionalDirEmail;
			$scope.workflow[3].assignedTo = $scope.employee.hrBusinessPartnerEmail;
			$scope.workflow[3].assignedToEmail = $scope.employee.hrBusinessPartnerEmail;

		}, true);

		// workflow destination set according to workflow owner 
		// (ie. determined once request submitted - allows anybody to submit a request but only admin can close etc)
		// (although this might not be final destination)

		// authorised user checks

		$scope.$watch('workflow', function(){

			var workflow = $scope.workflow;
			var authed = [];

			workflow.forEach(function(v){
				if (v.assignedToEmail) {
					authed.push(v.assignedToEmail);
				}
			});

			$scope.authorisedEmails = authed;

		});

		$scope.$watch('authorisedEmails', function(){

			var id = $scope.urlPath.id;
			var authorisedEmails = $scope.authorisedEmails;
			authorisedEmails.push("ADMIN");
			var authorised = false;
	
			authorisedEmails.forEach(function(v){ 				
				if ( hex_md5(v) == id ) { authorised = true; }
			});

			$scope.authorisedUser = authorised;

		});

		$scope.$watch('urlPath.id', function(){

			if ($scope.urlPath.id)
				if ($scope.urlPath.id == hex_md5("ADMIN")) {
					$scope.isAdmin = true;
				}

		});

		$scope.isUser = function(email) {

			if (!email) {return false;}

			if ($scope.urlPath.id)
				if ($scope.urlPath.id == hex_md5(email)) {
					return true;
				}

		}

		// set up

		$scope.employee = {};

		$scope.carInputFields = ["monthlyWLCEntitlement", "actualMonthlyWLCCost", "currentMileage", "anticipatedMileage", "vehicleMake", "vehicleModel", "vehicleType", "vehicleEngineSize", "vehicleP11D" ]; // these fields are reset-able
		$scope.carCalcFields = ["diffPaidBY", "diffPaidTO", "NIRate"]; // these fields not directly input-able

		$scope.currentMileage = null;
		$scope.anticipatedMileage = null;

		$scope.activePanel = "details";

		$scope.activate = function(tab) {
			$scope.activePanel = tab;
		}

		// set up if admin

		if ($scope.urlPath.id == hex_md5("ADMIN")) {

			$scope.noPending = "<div class='alert alert-warning'>There are no open requests.</div>"

			$http({
				url: '/pending',
				method: 'GET'

			}).success(function(data,status,headers,config){

				$scope.pendingRequests = data;

			}).error(function(data,status,headers,config){

				$scope.noPending = "<div class'alert alert-danger'>There was an error retrieving open requests. Please reload or contact an apps administrator.</div>";

			});

		}

		// app flags

		$scope.fetchedRecord = false; // has an employee record been fetched to pop form?
		$scope.editRequest = false; // are request details editable?
		$scope.requestSubmitted = false; // request has been submitted

		$scope.actualMonthlyWLCCost = 0;

		// calculators

		$scope.differencePaidBY = function() {
			var diff = $scope.monthlyWLCEntitlement - $scope.actualMonthlyWLCCost;
			if (diff > 0) { 
				return diff; 
			}
			else { 
				return 0; 
			};
		}

		$scope.differencePaidTO = function() {
			var diff = $scope.actualMonthlyWLCCost - $scope.monthlyWLCEntitlement;
			if (diff > 0) {
				return diff - ( diff * ($scope.NIRate) );
			}
			else {
				return 0;
			}
		}

		$scope.$watch('actualMonthlyWLCCost', function(){
			$scope.diffPaidTO = $scope.differencePaidTO();
			$scope.diffPaidBY = $scope.differencePaidBY();
		});

		// reference info (car makes, NI, entitlement levels)

		$scope.vehicleMake = "";
		$scope.vehicleModel = "";
		$scope.vehicleType = "";

		$scope.vehicleMakes = ["", "Fiat", "Renault", "Ford", "Jaguar"];
		$scope.vehicleTypes = ["", "Diesel", "Unleaded", "Hybrid", "Electric"];

		$scope.modelDB = {
			Fiat: ["Punto","Quinto"],
			Ford: ["Focus","Ka"],
			Renault: ["Clio","Laguna"],
			Jaguar: ["X1","X2","E-Type"]
		};

		$scope.vehicleModels = function(){
			return $scope.modelDB[$scope.vehicleMake];
		}

		$scope.monthlyWLCValue = 200;

		$scope.monthlyWLCValues = [
			{
				value: 100,
				label: "100.00"
			},{
				value: 200,
				label: "200.00"
			}
		];

		$scope.NIRate = 0.138;

		// validation

		$scope.strictNumeric = /^\d+$/;

		$scope.error = function(name) {
			var s = $scope.carRequest[name];
			return s.$invalid && s.$dirty ? "has-error" : "";
		}

		$scope.errorButton = function(name) {
			var s = $scope.carRequest[name];
			return s.$invalid || s.$pristine ? true : false;
		}

		$scope.errorButtonClass = function(name) {
			if ($scope.errorButton(name)) {
				return "";
			}
			else {
				return "btn-primary";
			}
		}

		// button actions

		$scope.resetForm = function() {

			var s = $scope.carRequest;

			$scope.employee = {};

			$scope.workflow = resetWorkflow;

			var carInputFields = $scope.carInputFields;

			carInputFields.forEach(function(v){

				$scope[v] = null;

			});

			$location.search('req', null);
			$scope.editRequest = false;
			$scope.requestSubmitted = false;
			s.$setPristine(true);

		}

		$scope.findEmployee = function(findBy) {

			$scope.httpSuccess = false;
			$scope.httpError = false;
			$scope.errorMessage = "";
			$scope.errorSuggestion = "";

			$scope.httpInProgress = true;
			$scope.waitMessage = "Querying database...";

			var addModal = $modal({
				title: "",
				show: true,
				html: true,
				animation: 'am-fade-and-scale',
				template: 'simpleAlertModal.html',
				backdrop: 'static',
				keyboard: false,
				scope: $scope
			});

			var url = "http://localhost:11080/user/" + $scope.employee[findBy];

			$http({
				method: 'GET',
				url: url
			}).success(function(data, status, headers, config){

				$scope.httpInProgress = false;
				$scope.httpSuccess = true;
				$scope.successMessage = "Employee record retrieved."
				$scope.employee = data;
				$scope.fetchedRecord = true;
				$scope.editRequest = true;
				addModal.hide();

			}).error(function(data, status, headers, config){

				$scope.httpInProgress = false;
				$scope.httpError = true;
				$scope.errorMessage = data.error;
				$scope.errorSuggestion = " - try reloading or contact the apps administrator.";

			});

		};

		$scope.packUpRequest = function() {

			var requestToGo = {};

			var employee = $scope.employee;
			var carInputFields = $scope.carInputFields;
			var carCalcFields = $scope.carCalcFields;

			// add req (will have this if a loaded request, submitted or not)

			if ($scope.req) {
				requestToGo.req = $scope.req;
			}

			// all employee object fields prefixed with 'employee_'

			for (var field in employee) {
				if (employee.hasOwnProperty(field)) {
					requestToGo["employee_"+field] = employee[field];
				}
			}

			// other fields as are

			carInputFields.forEach(function(v){
				if ($scope[v]) {
					requestToGo[v] = $scope[v];
				}
			});

			carCalcFields.forEach(function(v){
				if ($scope[v]) {
					requestToGo[v] = $scope[v];
				}
			});

			// workflow is sent as a JSON string in entirety

			var workflow = JSON.stringify($scope.workflow);
			requestToGo["workflow"] =  workflow;

			return requestToGo;

		}

		$scope.unpackRequestData = function(data) {

			var skip = ["workflow"];

			for (var field in data) {
				if (skip.indexOf(field) != -1) {
					continue;
				}
				if (field.substr(0,9) == "employee_") {
					$scope.employee[field.replace("employee_", "")] = data[field];
				}
				else {

					// that's numberwang!

					var value = data[field];

					if (!(Number.isNaN(parseFloat(value)))) {
						value = parseFloat(value);
					}
					else if (!(Number.isNaN(parseInt(value,10)))) {
						value = parseInt(value,10);
					}

					$scope[field] = value;
				}
			}


			if (data.workflow) {

				$scope.workflow = JSON.parse(data.workflow);

			}

		}

		$scope.submitNewRequest = function() {

			$scope.postSuccess = false;
			$scope.postError = false;

			var preview = $scope.packUpRequest();

			var previewContent = "<p>Confirm these details as a new car request for " + preview.employee_name + "? (undefined fields not listed)</p>";
			previewContent += "<table class='table table-condensed table-bordered table-striped'><tbody>";

			var previewFields = ["email","employeeNumber","firstName","lastName","mobNumber","telNumber","department","division","location","headOfDeptEmail","functionalDirEmail","hrBusinessPartnerEmail","monthlyWLCEntitlement","actualMonthlyWLCCost","diffPaidBY","diffPaidTO","currentMileage","anticipatedMileage","vehicleMake","vehicleModel","vehicleType","vehicleEngineSize","vehicleP11D"];

			for (var key in preview) {
				if (previewFields.indexOf(key) == -1) {continue;}
				previewContent += "<tr><td><strong>" + key + "</strong></td><td>";
				previewContent += preview[key];
				previewContent += "</td>";
			}

			previewContent += "</tbody></table>";

			var addModal = $modal({
				title: "Confirm New Car Request",
				content: previewContent,
				show: true,
				html: true,
				animation: 'am-fade-and-scale',
				template: 'confirmAddModal.html',
				backdrop: 'static',
				keyboard: false,
				scope: $scope
			});

		}

		$scope.saveUnsubmittedRequest = function(){

			$scope.postSuccess = false;
			$scope.postError = false;

			var addModal = $modal({
				title: "Save New Car Request",
				content: "",
				show: true,
				html: true,
				animation: 'am-fade-and-scale',
				template: 'confirmAddModal.html',
				backdrop: 'static',
				keyboard: false,
				scope: $scope
			});

			$scope.writeNewRequest();

		}

		$scope.writeNewRequest = function(confirm) {

			// if 'confirm' then commit changes to workflow

			if (confirm) {

				$scope.workflow[0].passed = new Date().toISOString();

				$scope.runWorkflow($scope.workflow);

				$scope.editRequest = false;
				$scope.requestSubmitted = true;

			}

			// set form to pristine

			var s = $scope.carRequest;
			s.$setPristine(true);

			$scope.postInProgress = true;

			var formToGo = new FormData();
			var data = $scope.packUpRequest();

			for (var field in data) {
				formToGo.append(field, data[field]);
			}

			$http({
				
				url: "/process",
				method: "POST",
				data: formToGo,
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity

			}).success(function(data, status, headers, config){

				if (data.success) {

					$scope.postInProgress = false;
					$scope.postSuccess = true;

					$location.search('req', data.req);

				}
				else {

					$scope.postInProgress = false;
					$scope.postError = true;
					if (data.error) {
						$scope.errorReason = data.error;
					}
					else {
						$scope.errorReason = status;
					}					

				}

			}).error(function(data, status, headers, config){

				$scope.postInProgress = false;
				$scope.postError = true;
				$scope.errorReason = data.error;

			});

		};

		// loop to passively check for necessary notfications as an indirect result of user action

		$scope.runWorkflow = function(workflow, action){

			workflow.forEach(function(stage){

				console.log ( "stage " + stage.stageNumber );

				// stage has been opened

				if (stage.opened) {

					if (stage.passed || stage.returned || stage.failed) {
						return;
					}
					else if (stage.notified) {

						if (action != "renotify") {
							return;
						}

						$scope.notify(stage);
						return;

					}
					else {

						$scope.notify(stage);
						return;

					}

				}

				// stage not yet open

				else {

					if ( eval(stage.openCondition) ) {

						stage.opened = new Date().toISOString();

						if (stage.notified && (action != "renotify") ) {

							return;

						}
						else {

							$scope.notify(stage);
							return;

						}

					}
					else {

						return;

					}

				}

			});

		};

		$scope.notify = function(stage, toBeNotified) {

			if (!toBeNotified) { toBeNotified = stage.assignedToEmail };

			alert("Imma gonna email " + toBeNotified);

		};

		

}]);