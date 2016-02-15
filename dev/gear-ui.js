angular.module('gearUi', [])
.provider('gear', function(){
	this.$get = function(){
		return {
			menu: function(){
				return {

				}
			}
		}
	}
})
.directive('gearFormControl', function(){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			ctrl.$parsers.push(function(value){
				!angular.isUndefined(value) && value !== null && value !== '' ? attrs.$addClass('gear-not-null') : attrs.$removeClass('gear-not-null');
				return value;
			});

			ctrl.$formatters.push(function(value){
				!angular.isUndefined(value) && value !== null && value !== '' ? attrs.$addClass('gear-not-null') : attrs.$removeClass('gear-not-null');
				return value;
			});
		}
	}
})
.directive('gearOnlyNumber', function(){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			var _formatNumber = function(number){
				if (number != 0 && !number) return;
				number = number.toString().replace(/[^0-9]+/g, '');
				return isNaN(number) ? '' : number;
			},
			startPosition = 0;

			element.bind('keyup keydown keypress focusout', function(){
				ctrl.$setViewValue(_formatNumber(ctrl.$viewValue));
				ctrl.$render();
			});

			ctrl.$parsers.push(function(value){
				return _formatNumber(value);
			});

			ctrl.$formatters.push(function(value){
				return _formatNumber(value);
			});
		}
	}
})
.directive('gearMaskCnpj', function(gearCnpjFilter){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {

			element.bind('keyup keydown keypress focusout', function(){
				ctrl.$setViewValue(gearCnpjFilter(ctrl.$viewValue));
				ctrl.$render();
			});

			element.bind('keypress', function(e){
				if (ctrl.$viewValue && ctrl.$viewValue.length == 18 && element[0].selectionStart == element[0].selectionEnd)
					return false;
			});

			ctrl.$formatters.push(function(value){
				return gearCnpjFilter(value)
			});
		}
	}
})
.directive('gearMaskCep', function(gearCepFilter){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {

			element.bind('keyup keydown keypress focusout', function(){
				ctrl.$setViewValue(gearCepFilter(ctrl.$viewValue));
				ctrl.$render();
			});

			element.bind('keypress', function(e){
				if (ctrl.$viewValue && ctrl.$viewValue.length == 9 && element[0].selectionStart == element[0].selectionEnd)
					return false;
			});

			ctrl.$formatters.push(function(value){
				return gearCepFilter(value)
			});
		}
	}
})
.directive('gearMaskPhone', function(gearPhoneFilter){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {

			element.bind('keyup keydown keypress focusout', function(){
				ctrl.$setViewValue(gearPhoneFilter(ctrl.$viewValue));
				ctrl.$render();
			});

			element.bind('keypress', function(e){
				if (ctrl.$viewValue && ctrl.$viewValue.length == 15 && element[0].selectionStart == element[0].selectionEnd)
					return false;
			});

			ctrl.$formatters.push(function(value){
				return gearPhoneFilter(value);
			});
		}
	}
})
.directive('gearMaskDate', function($filter){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {

			var _formatDate = function(date){
				if (!date) return '';
				date = date.toString().replace(/[^0-9]+/g, '');
				if (date.length > 2)
					date = date.substring(0,2) + '/' + date.substring(2);
				if (date.length > 5)
					date = date.substring(0,5) + '/' + date.substring(5);
				if (date.length > 10)
					date = date.substring(0,10);
				return date;
			}

			element.bind('keyup keydown keypress focusout', function(){
				ctrl.$setViewValue(_formatDate(ctrl.$viewValue));
				ctrl.$render();
			});

			element.bind('keypress', function(e){
				if (ctrl.$viewValue && ctrl.$viewValue.length == 10 && element[0].selectionStart == element[0].selectionEnd)
					return false;
			});

			ctrl.$parsers.push(function(value){
				return _formatDate(value);
			});

			ctrl.$formatters.push(function(value){
				return _formatDate(value);
			});
		}
	}
})
.directive('gearMaskTime', function($filter){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {

			var _formatTime = function(date){
				if (!date) return '';
				date = date.toString().replace(/[^0-9]+/g, '');
				if (date.length > 2)
					date = date.substring(0,2) + ':' + date.substring(2);
				if (date.length > 5)
					date = date.substring(0,5);
				return date;
			}

			element.bind('keyup keydown keypress focusout', function(){
				ctrl.$setViewValue(_formatTime(ctrl.$viewValue));
				ctrl.$render();
			});

			element.bind('keypress', function(e){
				if (ctrl.$viewValue && ctrl.$viewValue.length == 5 && element[0].selectionStart == element[0].selectionEnd)
					return false;
			});

			ctrl.$parsers.push(function(value){
				return _formatTime(value);
			});

			ctrl.$formatters.push(function(value){
				return _formatTime(value);
			});
		}
	}
})
.directive('gearFormatDate', function($filter){
	return {
		require: 'ngModel',
		scope: {
			'ngModel': '=',
			'gearFormatDate': '=?',
			'gearFormatError': '=?',
			'gearMax': '=?',
			'gearMin': '=?'
		},
		link: function(scope, element, attrs, ctrl) {
			var dateMax, dateMin;

			ctrl.$parsers.push(function(value){
				isValidDateInput(value);
				return value;
			});

			ctrl.$formatters.push(function(value){
				value = adaptDate(value);
				isValidDateInput(value);
				return value;
			});

			scope.$watch('gearMax', function(value, oldValue){
				dateMax = scope.gearMax;
				isValidDate(dateMax) && dateMax.setHours(0,0,0,0);
				var value;
				value = adaptDate(scope.ngModel);
				isValidDateInput(scope.ngModel);
			});

			scope.$watch('gearMin', function(value, oldValue){
				dateMin = scope.gearMin;
				isValidDate(dateMin) && dateMin.setHours(0,0,0,0);
				var value;
				value = adaptDate(scope.ngModel);
				isValidDateInput(scope.ngModel);
			});

			function adaptDate(date) {
				if (isValidDate(date)) {
					date = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
					return date;
				}
				return date;
			}

			function isValidDateInput(date) {
				var dateLength = date ? date.length : 0,
					dateArray = dateLength == 10 ? date.split('/') : undefined,
					daysInMonth = dateArray ? new Date(dateArray[2], dateArray[1], 0).getDate() : undefined;
					months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
					valid = true;
				date = dateArray ? new Date(dateArray[2], dateArray[1] - 1, dateArray[0]) : date;
				scope.gearFormatError = {};
				switch (true) {
					case (dateLength && dateLength < 10):
						scope.gearFormatError = { type: 'length', message: 'Digite no mínimo 8 caracteres' };
						valid = false;
						break;
					case (dateArray && (dateArray[1] < 1 || dateArray[1] > 12)):
						scope.gearFormatError = { type: 'month', message: 'Mês inválido' };
						valid = false;
						break;
					case (dateArray && dateArray[0] > daysInMonth):
						scope.gearFormatError = { type: 'days', message: months[dateArray[1] - 1] + ' possui apenas ' + daysInMonth + ' dias' };
						valid = false;
						break;
					case (dateMax && isValidDate(dateMax) && date && date.getTime() > dateMax.getTime()):
						scope.gearFormatError = { type: 'maxDate', message: 'Data maior do que ' + $filter('date')(dateMax, 'dd/MM/yyyy') };
						valid = false;
						break;
					case (dateMin && isValidDate(dateMin) && date && date.getTime() < dateMin.getTime()):
						scope.gearFormatError = { type: 'minDate', message: 'Data menor do que ' + $filter('date')(dateMin, 'dd/MM/yyyy') };
						valid = false;
						break;
					// case (isValidDate(dateMin) && date.getTime() < dateMin.getTime())
					// 	scope.gearFormatError = 'Data menor do que ' + $filter('date')(dateMin, 'dd/MM/yyyy');
					// 	valid = false;
					// 	break;
					default:
						delete scope.gearFormatError;
				}
				ctrl.$setValidity('gearError', valid);
			}

			function isValidDate(d) {
				if (Object.prototype.toString.call(d) !== '[object Date]' || typeof d === 'boolean')
					return false;
				return !isNaN(d.getTime());
			}
		}
	}
})
.directive('gearFormatTime', function($filter){
	return {
		require: 'ngModel',
		scope: {
			'ngModel': '=',
			'gearFormatTime': '=?',
			'gearFormatError': '=?'
		},
		link: function(scope, element, attrs, ctrl) {

			ctrl.$parsers.push(function(value){
				value = adaptTime(value);
				isValidTimeInput(value);
				return value;
			});

			ctrl.$formatters.push(function(value){
				value = adaptTime(value);
				isValidTimeInput(value);
				return value;
			});

			function adaptTime(time) {
				time = isValidTime(time) ? time.getHours() + ':' + time.getMinutes() : time;
				return time;
			}

			function isValidTimeInput(time) {
				var timeLength = time ? time.length : 0,
					timeArray = timeLength == 5 ? time.split(':') : undefined,
					valid = true;
				scope.gearFormatError = {};
				switch (true) {
					case (timeLength && timeLength < 5):
						scope.gearFormatError = 'Digite no mínimo 4 caracteres';
						valid = false;
						break;
					case (timeArray && (timeArray[0] > 23)):
						scope.gearFormatError = 'Hora inválida';
						valid = false;
						break;
					case (timeArray && (timeArray[1] > 59)):
						scope.gearFormatError = 'Minuto inválido';
						valid = false;
						break;
					default:
						delete scope.gearFormatError;
				}
				ctrl.$setValidity('gearError', valid);
			}

			function isValidTime(d) {
				if (Object.prototype.toString.call(d) !== '[object Date]' || typeof d === 'boolean')
					return false;
				return !isNaN(d.getTime());
			}
		}
	}
})
.directive('gear', function(){
	return {
		restrict: 'A',
		scope: {},
		controller: function($scope, $element, $attrs){
			$scope.$parent.gear = {
				author: 'Gelson M. Rodrigues',
				email: 'GelsonMRodrigues@hotmail.com',
				version: '0.1'
			}
		}
	}
})
.directive('gearDialogGroup', function(){
	return {
		restrict: 'E',
		require: '^gear',
		replace: true,
		transclude: true,
		template: '<div class="gear-dialog-group" ng-class="{\'gear-active\':hasOpenDialog()}" ng-transclude></div>',
		scope: {},
		controller: function($scope, $element, $attrs){
			$scope.lol = true;
			$scope.dialogs = {};
			this.openDialogs = {};
			$scope.openDialogs = this.openDialogs;
			$scope.focusedDialog = {};
			this.register = function(dialog){
				dialog.order = 0;
				$scope.dialogs[dialog.id] = dialog;
			}
			this.registerOpen = function(dialog){
				this.unfocusAll();
				if (!$scope.openDialogs[dialog.id]) {
					$scope.openDialogs[dialog.id] = dialog;
				}
				if ($scope.hasOpenDialog()) {
					for (var dialogId in $scope.openDialogs) {
						$scope.openDialogs[dialogId].order++;
					}

				}
			}
			this.unregisterOpen = function(dialog){
				$scope.openDialogs[dialog.id].order = 0;
				delete $scope.openDialogs[dialog.id];
				if ($scope.hasOpenDialog()) {
					for (var dialogId in $scope.openDialogs) {
						$scope.openDialogs[dialogId].order--;
						if ($scope.dialogs[dialogId].order === 1)
							$scope.dialogs[dialogId].focus();
					}
				}
			}
			$scope.hasOpenDialog = function(){
				return Object.keys($scope.openDialogs).length;
			}
			$scope.dialogs.closeAll = function(){
				for (var dialogId in $scope.openDialogs) {
					$scope.openDialogs[dialogId].isFocused = false;
					$scope.openDialogs[dialogId].isOpened = false;
					$scope.openDialogs[dialogId].order = 0;
					delete $scope.openDialogs[dialogId];
				}
			}
			this.unfocusAll = function(){
				for (var dialogId in $scope.dialogs) {
					$scope.dialogs[dialogId].isFocused = false;
				}
			}
			$scope.$parent.gear.dialogs = $scope.dialogs;
		}

	}
})
.directive('gearDialog', function(){
	return {
		restrict: 'E',
		require: '^gearDialogGroup',
		replace: true,
		transclude: true,
		template: '<div class="gear-dialog-wrap" ng-class="{\'gear-open\': isOpened, \'gear-focus\': isFocused}" ng-click="close($event)"><div class="gear-mt gear-dialog" ng-style="{\'width\': gearWidth}"><div class="gear-dialog-title">{{gearTitle}}</div><div class="gear-dialog-content" ng-transclude></div></div></div>',
		scope: {
			'id': '@',
			'gearWidth': '@',
			'gearTitle': '@'
		},
		link: function(scope, element, attrs, ctrl) {
			ctrl.register(scope);
			scope.isOpened = false;
			scope.isFocused = false;
			scope.open = function(){
				ctrl.registerOpen(scope);
				scope.isOpened = true;
				scope.isFocused = true;
			}
			scope.focus = function(){
				scope.isFocused = true;
			}
			scope.close = function($event){
				if (!$event || $event.target.classList.contains('gear-dialog-wrap')) {
					ctrl.unregisterOpen(scope);
					scope.isOpened = false;
					scope.isFocused = false;
				}
			}
		}
	}
})
.directive('gearPanel', function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		template: '<div class="gear-mt gear-panel"><h2 class="gear-panel-title" ng-if="gearTitle">{{gearTitle}}</h2><div class="gear-panel-content" ng-transclude></div></div>',
		scope: {
			'id': '@',
			'gearTitle': '@'
		},
		link: function(scope, element, attrs, ctrl) {
		}
	}
})
.directive('gearTooltip', function(){
	return {
		restrict: 'A',
		scope: {
			'gearTooltip': '@',
			'gearColor': '@',
			'gearWidth': '@'
		},
		link: function(scope, element, attrs, ctrl) {
			var config = { content: scope.gearTooltip };
			config.color = scope.gearColor || 'blue';
			if (scope.gearWidth)
				config.width = scope.gearWidth;
			Gear(element).tooltip(config);
		}
	}
})
.directive('gearColorPickerGroup', function($timeout){
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		require: ['^form','ngModel'],
		scope: {
			'ngModel': '=',
			'gearId': '@',
			'gearName': '@',
			'gearClass': '=?',
			'gearShape': '@',
			'gearPrimaryInfo': '@'
		},
		templateUrl: 'gear-template/color-picker-group',
		link: function(scope, element, attrs, ctrls, transclude) {
			element.find('gear-form-transclude').replaceWith(transclude());
			scope.colorTypes = ['red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue', 'cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber', 'orange', 'deepOrange', 'brown', 'grey', 'blueGrey'];
			scope.colorVariations = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'A100', 'A200', 'A400', 'A700'],
			scope.switchOpened = false;
			scope.colorTypeSelected = undefined;
			scope.colorSelected = undefined;
			scope.switchOpen = function(){
				scope.colorTypeSelected = undefined;
				scope.switchOpened = true;
			};
			scope.switchClose = function(){
				scope.switchOpened = false;
			};
			scope.switchVarTop = undefined;
			scope.switchVarArrowLeft = undefined;
			scope.setColorType = function($event, color){
				scope.colorTypeSelected = color;
				if (color == undefined) {
					scope.selectColor();
					return;
				}
				scope.switchVarTop = angular.element($event.currentTarget).offset().top - angular.element(element.find('.switch-color')).offset().top - 50;
				scope.switchVarArrowLeft = angular.element($event.currentTarget).offset().left - angular.element(element.find('.switch-color')).offset().left + (angular.element($event.currentTarget).width() / 2) - 6;
			};
			scope.colorClass = function(color){
				return color;
			};
			scope.checkAccentColor = function(variation){
				if (scope.colorTypeSelected == 'brown' || scope.colorTypeSelected == 'grey' || scope.colorTypeSelected == 'blueGrey') {
					if (variation == 'A100' || variation == 'A200' || variation == 'A400' ||  variation == 'A700')
						return false;
				}
				return true;
			};
			// $(document).on('click', function(e){
			// 	if (!$(element).find(e.target).length && !$(e.target).is(element)) {
			// 		scope.switchOpened = false;
			// 		scope.colorTypeSelected = undefined;
			// 		scope.$apply();
			// 	}
			// });

			angular.element(document).bind('mousedown focusin', function(e){
				if (!angular.element(element).find(e.target).length && scope.switchOpened) {
					scope.switchClose();
					scope.$apply();
				}
			});
			scope.selectColor = function($event) {
				scope.colorSelected = $event ? rgb2hex($($event.currentTarget).css('background-color')).toUpperCase() : undefined;
				ctrls[1].$setViewValue(scope.colorSelected ? scope.colorSelected : 'Nenhuma cor selecionada')
				ctrls[1].$render();
				ctrls[0][scope.gearName].$setDirty();
				scope.switchClose();
			}

			ctrls[1].$formatters.push(function(value){
				scope.colorSelected = value;
				ctrls[1].$setViewValue(value ? value : 'Nenhuma cor selecionada');
				ctrls[0].$setPristine(); // Dentro do formatters, faz o campo nascer como pristine, caso contrário ele perde a propriedade
				return value;
			});

			function rgb2hex(rgb) {
				var hexDigits = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
				rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				function hex(x) {
					return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
				}
				return '#' + (hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
			}

		}
	}
})
.directive('gearFormAutoComplete', function($timeout){
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		require: ['^form','ngModel'],
		scope: {
			'ngModel': '=',
			'gearId': '@',
			'gearRequired': '=?',
			'gearLabel': '@',
			'gearList': '=?',
			'gearListHide': '=?',
			'gearError': '=?',
			'gearPrimaryInfo': '@',
			'gearActiveItem': '=?',
			'gearSelectedItem': '=?',
			'gearNoFindMessage': '@',
			'gearKey': '@'
		},
		template:	'<div class="gear-form-group">' +
						// '<div class="gear-message">{{gearSelectedItem}}</div>' +
						'<i class="material-icons gear-icon">search</i>' +
						'<input type="text" ng-class="{\'gear-error\': showList && !filteredList.length && ngModel}" ng-model="ngModel" ng-class class="gear-form-control txt-data-list-search" ng-focus="open()" gear-form-control>' +
						'<label class="gear-form-floating-label">{{gearLabel}}</label>' +
						'<div class="gear-message" ng-if="showList && !filteredList.length && ngModel">{{gearNoFindMessage}}</div>' +
						// '<div class="gear-message">{{gearSelectedItem}}</div>' +
						'<gear-form-transclude></gear-form-transclude>' +
						'<div class="data-list-search" ng-show="filteredList.length && showList">' +
							'<ul>' +
								'<li ng-class="{\'selected\':item.selected}" ng-repeat="item in (filteredList = (gearList | filter:criterioHideFilter() | filter:ngModel))" ng-click="selectItem(item)"><span class="primary-info">{{item[gearPrimaryInfo]}}</span></li>' + //track by $index
							'</ul>' +
						'</div>' +
					'</div>',
		link: function(scope, element, attrs, ctrls, transclude) {
			element.find('gear-form-transclude').replaceWith(transclude());
			scope.showList = false;
			scope.filteredList = [];
			scope.gearError = function(){
				return scope.showList && !scope.filteredList.length && scope.ngModel;
			}
			scope.open = function(){
				scope.showList = true;
				if (scope.filteredList.length)
					scope.activateItem(scope.filteredList[0]);
			}
			scope.close = function(){
				scope.showList = false;
				scope.deactivateAll();
			}
			scope.deactivateAll = function (item){
				scope.gearList.forEach(function(item){
					if (item.selected)
						delete item.selected;
				});
				delete scope.gearActiveItem;
			}
			scope.activateItem = function (item){
				scope.deactivateAll();
				scope.gearList.forEach(function(originalItem){
					if (item[scope.gearKey] == originalItem[scope.gearKey]) {
						originalItem.selected = true;
						scope.gearActiveItem = originalItem;
					}
				});
			}
			scope.selectItem = function (item){
				scope.deactivateAll();
				scope.gearList.forEach(function(originalItem){
					if (item[scope.gearKey] == originalItem[scope.gearKey]) {
						scope.gearSelectedItem = originalItem;
						scope.ngModel = originalItem[scope.gearPrimaryInfo];
					}
				});
				scope.close();
			}
			scope.criterioHideFilter = function(){
				if (!scope.gearListHide)
					return true;
				return function(item) {
					for (i = 0; i < scope.gearListHide.length; i++) {
						if (item[scope.gearKey] === scope.gearListHide[i][scope.gearKey])
							return false;
					}
					return true;
				}
			}

			angular.element(document).bind('mousedown focusin', function(e){
				$timeout(function(){
					if (!angular.element(element).find(e.target).length && scope.showList) {
						scope.close();
						scope.$apply();
					}
				})
			});

			element.find('input').on('keydown', function(e){
				if (scope.gearActiveItem)
					scope.activateItem(scope.gearActiveItem)
				var filteredList = scope.filteredList,
					filteredListLength = filteredList.length,
					filteredLISelected, filteredLISelectedIndex,
					fullList = scope.gearList,
					fullListLength = fullList.length,
					fullLISelected, fullLISelectedIndex,
					LIToSelect, LIToSelectIndex;
				function activateItem(direction) {
					if (direction) {
						if (direction == 'next')
							direction = 1;
						else if (direction == 'prev')
							direction = -1;
					} else
						direction = 0;
					for (i = 0; i < filteredListLength; i++) {
						if (filteredList[i].selected) {
							filteredLISelected = filteredList[i];
							filteredLISelectedIndex = i;
							continue;
						}
					}
					if (filteredLISelectedIndex + direction === -1) {
						// Item é o primeiro da lista filtrada e quer selecionar o anterior, portanto tem que ir ao último
						LIToSelect = filteredList[filteredListLength - 1];
					} else if (filteredLISelectedIndex + direction === filteredListLength) {
						// Item é o último da lista filtrada e quer selecionar o próximo, portanto tem que voltar ao primeiro
						LIToSelect = filteredList[0];
					} else {
						LIToSelect = filteredList[filteredLISelectedIndex + direction];
					}
					if (filteredLISelected) {
						for (i = 0; i < fullListLength; i++) {
							if (fullList[i][scope.gearKey] == LIToSelect[scope.gearKey]) {
								fullLISelected = fullList[i];
								fullLISelectedIndex = i;
								continue;
							}
						}
						scope.activateItem(fullLISelected);
						scope.$digest();
					}
				};
				switch (e.which) {
					case 38:
						// Seta pra cima
						activateItem('prev');
						break;
					case 40:
						// Seta pra baixo
						activateItem('next');
						break;
					case 13:
						// Enter
						if (scope.gearActiveItem && !scope.gearSelectedItem) {
							scope.selectItem(scope.gearActiveItem);
							scope.$apply();
						}
				}
				scope.$digest();
			});
			element.find('input').on('keyup', function(e){
				if (!scope.showList) {
					scope.open();
					scope.$digest();
				}
			});
			element.find('input').on('input', function(e){
				delete scope.gearSelectedItem;
				delete scope.gearActiveItem;
				if (scope.filteredList.length)
					scope.activateItem(scope.filteredList[0]);
				if (!scope.showList)
					scope.open();
				if (scope.gearActiveItem) {
					if (scope.ngModel && (scope.gearActiveItem[scope.gearPrimaryInfo].toUpperCase() == scope.ngModel.toUpperCase())) {
						scope.ngModel = scope.gearActiveItem[scope.gearPrimaryInfo];
						scope.selectItem(scope.gearActiveItem);
					}
				}
				scope.$apply();
			});
		}
	}
})
.directive('gearDatePicker', function($timeout){
	return {
		restrict: 'E',
		require: 'ngModel',
		scope: {
			'ngModel': '=',
			'dateSelected': '=?',
			'gearSelect': '&?',
			'gearError': '=?',
			'gearErrorMessage': '=?',
			'gearMin': '=?',
			'gearMax': '=?'
		},
		templateUrl: 'gear-template/date-picker',
		link: function(scope, element, attrs, ctrl) {

			scope.$watch('gearError', function(value){
				scope.gearError ? element.addClass('gear-error') : element.removeClass('gear-error');
			});

			function isValidDate(d) {
				if (Object.prototype.toString.call(d) !== '[object Date]' || typeof d === 'boolean')
					return false;
				return !isNaN(d.getTime());
			}

			scope.weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
			scope.daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			scope.months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

			scope.activeMonth = scope.ngModel;
			scope.weeks = [];
			scope.goTo = function(date){
				if (scope.weeks.length && scope.activeMonth && scope.activeMonth.getMonth() == date.getMonth() && scope.activeMonth.getFullYear() == date.getFullYear())
					return;
				scope.activeMonth = date;
				scope.weeks = _generateWeeks(date.getMonth(), date.getFullYear());
			};
			scope.goToSelected = function(){
				scope.ngModel && scope.goTo(scope.ngModel);
			};
			scope.goToday = function(){
				scope.goTo(new Date());
			};
			ctrl.$parsers.push(function(value){
				if (isValidDate(value)) {
					scope.goToSelected();
					return value;
				}
				return null;
			});
			ctrl.$formatters.push(function(value){
				if (isValidDate(value)) {
					scope.goToSelected();
					return value;
				}
				return null;
			});
			if (!isValidDate(scope.ngModel))
				scope.ngModel = '';
			scope.ngModel ? scope.goToSelected() : scope.goToday();
			scope.goNext = function(){
				var date = scope.activeMonth;
				scope.goTo(new Date(date.getFullYear(), date.getMonth() + 1));
			}
			scope.goPrev = function(){
				var date = scope.activeMonth;
				scope.goTo(new Date(date.getFullYear(), date.getMonth() - 1));
			}
			function _generateWeeks(month, year){
				var currentMonth = new Date(year, month + 1, 0),
					daysInMonth = currentMonth.getDate(),
					firstDay = new Date(year, month, 1),
					counterDay = -firstDay.getDay(),
					weeksLength = Math.ceil((firstDay.getDay() + currentMonth.getDate()) / 7),
					weeks = [];
				for (i = 0; i < weeksLength; i++) {
					weeks[i] = [];
					for (j = 0; j < 7; j++) {
						counterDay++;
						weeks[i][j] = new Date(year, month, counterDay);
					}
				}
				return weeks;
			}
			scope.selectedDate = function(){
				if (!scope.ngModel)
					return '';
				var fullDate,
					dayWeekName = scope.weekDays[scope.ngModel.getDay()],
					dayWeek = dayWeekName,
					dayNumber = scope.ngModel.getDate(),
					monthName = scope.months[scope.ngModel.getMonth()];
				fullDate = dayWeek;
				return fullDate + ', ' + dayNumber + ' de ' + monthName;
			}
			scope.selectedYear = function(){
				if (scope.ngModel)
					return scope.ngModel.getFullYear();
				else return false;
			}
			scope.getViewCalendar = function(){
				return scope.months[scope.activeMonth.getMonth()] + ' de ' + scope.activeMonth.getFullYear();
			}
			scope.year = function(){
				return scope.ngModel.getFullYear();
			}
			scope.selectDay = function(day){
				scope.ngModel = day;
				if (scope.activeMonth.getMonth() != day.getMonth() || scope.activeMonth.getFullYear() != day.getFullYear())
					scope.goToSelected();
				$timeout(function(){ scope.gearSelect(day); });
			}
			scope.isSelectedDay = function(day){
				var tmpDay = day,
					tmpModel = scope.ngModel;
				tmpDay.setHours(0,0,0,0);
				if (scope.ngModel) {
					tmpModel.setHours(0,0,0,0);
					return (tmpDay.getTime() === tmpModel.getTime());
				} else return false;
			}
			scope.isToday = function(day){
				var tmpDay = day,
					today = new Date();
				tmpDay.setHours(0,0,0,0);
				today.setHours(0,0,0,0);
				return (tmpDay.getTime() === today.getTime())
			}
			scope.monthControl = function(e){
				switch (e.which) {
					case 37:
						scope.goPrev();
						e.preventDefault();
						break;
					case 39:
						scope.goNext();
						e.preventDefault();
						break;
					case 40:
						element.find('.day.current-month:first button')[0].focus();
						e.preventDefault();
				}
			}
			scope.dayControl = function(e){
				var parent = angular.element(e.target).parent(),
					prev = parent.prev(),
					next = parent.next(),
					week = parent.parent(),
					prevWeek = week.prev(),
					nextWeek = week.next(),
					upperTarget = prevWeek.children().eq(parent.index()),
					belowTarget = nextWeek.children().eq(parent.index());
				switch (e.which) {
					case 37:
						if ((prev && prev.is('.last-month')) || (parent.is(':first-child') && week.is(':first-child'))) {
							scope.goPrev();
							$timeout(function(){
								element.find('.day.current-month:last button').focus();
							});
						} else {
							if (prev.length)
								prev.children('button').focus();
							else 
								week.prev().find(':last-child button').focus();
						}
						e.preventDefault();
						break;
					case 38:
						if (week.is(':first-child'))
							element.find('.month-control').focus();
						else {
							if (upperTarget.is('.current-month'))
								upperTarget.children('button').focus();
							else
								prevWeek.find('.current-month:first button').focus();
						}
						e.preventDefault();
						break;
					case 39:
						if ((next && next.is('.next-month')) || (parent.is(':last-child') && week.is(':last-child'))) {
							scope.goNext();
							$timeout(function(){
								element.find('.day.current-month:first button').focus();
							});
						} else {
							if (next.length)
								next.children('button').focus();
							else 
								week.next().find(':first-child button').focus();
						}
						e.preventDefault();
						break;
					case 40:
						if (week.is(':last-child')) {
							scope.goNext();
							element.find('.month-control').focus();
						} else {
							if (belowTarget.is('.current-month'))
								belowTarget.children('button').focus();
							else
								nextWeek.find('.current-month:last button').focus();
						}
						e.preventDefault();
				}
			}
			scope.invalidDate = function(day) {
				var tmpDay, tmpMinDate, tmpMaxDate;
				tmpDay = day;
				tmpMinDate = scope.gearMin;
				tmpMaxDate = scope.gearMax;
				tmpDay && tmpDay.setHours(0,0,0,0);
				tmpMinDate && tmpMinDate.setHours(0,0,0,0);
				tmpMaxDate && tmpMaxDate.setHours(0,0,0,0);
				return ((tmpMinDate && tmpDay.getTime() < tmpMinDate.getTime()) || (tmpMaxDate && tmpDay.getTime() > tmpMaxDate.getTime()));
			}
		}
	}
})
.directive('gearDatePickerGroup', function($filter, $timeout){
	return {
		restrict: 'E',
		require: ['^form', 'ngModel'],
		scope: {
			'ngModel': '=',
			'gearId': '@',
			'gearLabel': '@',
			'gearFormat': '@',
			'gearName': '@',
			'gearShow': '=?',
			'gearErrorMessage': '=?',
			'gearMin': '=?',
			'gearMax': '=?'
		},
		templateUrl: 'gear-template/date-picker-group',
		replace: true,
		link: function(scope, element, attrs, ctrls) {
			'autocomplete' in attrs && element.find('input:first').attr('autocomplete', attrs.autocomplete);
			scope.required = 'required' in attrs;

			function isValidDate(d) {
				if (Object.prototype.toString.call(d) !== '[object Date]' || typeof d === 'boolean')
					return false;
				return !isNaN(d.getTime());
			}

			scope.isInvalid = function(){
				return scope.picker.invalid && scope.input.$dirty;
			}
			scope.input = ctrls[0][scope.gearName];
			scope.required = 'required' in attrs;
			scope.gearFormat = scope.gearFormat || 'dd/MM/yyyy';
			scope.picker = {model: scope.ngModel};

			scope.openPicker = function(){
				scope.gearShow = true;
			};

			scope.closePicker = function(){
				scope.gearShow = false;
				scope.picker.text = $filter('date')(scope.ngModel, scope.gearFormat);
			};

			scope.$watch('picker.text', function(value, oldValue) {
				if (!value) {
					scope.picker.model = scope.picker.text;
					return;
				}
				if (scope.picker.text && (!scope.picker.invalid || scope.picker.invalid.type == 'minDate' || scope.picker.invalid.type == 'maxDate')) {
					value = value.split('/');
					scope.picker.model = new Date(value[2], value[1] - 1, value[0]);
				} else
					scope.picker.model = false;
			});

			scope.$watch('picker.model', function() {
				scope.ngModel = scope.picker.model;
			});

			scope.$watchCollection('picker.invalid', function(value) {
				if (scope.picker.text && (!value || value.type == 'minDate' || value.type == 'maxDate')) {
					var goku = scope.picker.text;
					goku = goku.split('/');
					goku = new Date(goku[2], goku[1] - 1, goku[0]);
					scope.picker.model = goku;
				}
			});

			ctrls[1].$formatters.push(function(value){
				if (value)
					scope.picker.text = $filter('date')(value, scope.gearFormat);
				else if (value != false)
					scope.picker.text = '';
				return value;
			});

			element.find('input').bind('focus', function(){
				scope.openPicker();
				scope.$digest();
			});

			angular.element(document).bind('mousedown focusin', function(e){
				$timeout(function(){
					if (!angular.element(element).find(e.target).length && scope.gearShow) {
						scope.gearShow = false;
						scope.$apply();
					}
				})
			});
		}
	}
})
.directive('gearHoverCopy', function($timeout, gearCopyButton){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			element.bind('mousemove', function(e){
				$timeout.cancel(gearCopyButton.timeout)
				gearCopyButton.setTarget(element, e);
			});
			element.bind('mouseout', function(e){
				$timeout.cancel(gearCopyButton.timeout);
				gearCopyButton.timeout = $timeout(function(){
					gearCopyButton.resetTarget();
				},500)
			});
		}
	}
})
.directive('gearCopyButton', function($timeout, gearCopyButton){
	return {
		restrict: 'E',
		replace: true,
		template: '<button type="button" class="gear-hover-copy-button" ng-click="$parent.click()" ng-mouseover="$parent.mouseover()" ng-mouseout="$parent.mouseout()" ng-if="show" ng-style="{\'top\': $parent.location.y, \'left\': $parent.location.x}" title="Copiar para a área de transferência"><i class="material-icons">content_copy</i></button>',
		scope: {
			'gearTarget': '=?'
		},
		link: function(scope, element, attrs){
			var actualTarget;
			scope.show = false;
			scope.showButton = function(){
				scope.show = true;
			}
			scope.hideButton = function(){
				scope.show = false;
			}
			var actualTarget;
			gearCopyButton.targetChanged(function(event){
				actualTarget = gearCopyButton.getTarget();
				if (actualTarget) {
					scope.showButton();
					$timeout(function(){
						scope.location = {
							// x: angular.element(actualTarget).offset().left - (window.pageXOffset || document.documentElement.scrollLeft) + (angular.element(actualTarget).outerWidth() / 2),
							x: event.pageX,
							y: angular.element(actualTarget).offset().top - (window.pageYOffset || document.documentElement.scrollTop)
						};
					});
					scope.showButton();
				} else {
					scope.location = {};
					scope.hideButton();
				}
				scope.$digest();
			});
			scope.click = function(){
				clipBoard(actualTarget[0]);
				$timeout(function(){
					gearCopyButton.resetTarget();
				});
			}

			function clipBoard(target) {
				if (target.select)
					target.select();
				else {
					var range = document.createRange();
					range.selectNodeContents(target);
					var selection = window.getSelection();
					selection.removeAllRanges();
					selection.addRange(range);
				}
				document.execCommand('copy');
				window.getSelection().removeAllRanges();
			}
			scope.mouseover = function(e){
				$timeout.cancel(gearCopyButton.timeout);
			};
			scope.mouseout = function(e){
				$timeout.cancel(gearCopyButton.timeout);
				gearCopyButton.timeout = $timeout(function(){
					gearCopyButton.resetTarget();
				},500);
			};
		}
	}
})
.provider('gearCopyButton', function(){
	this.$get = function(){
		return {
			getTarget: function(){
				return this.target;
			},
			resetTarget: function(){
				this.target = undefined;
				this.changed && this.changed();
			},
			targetChanged: function(action){
				this.changed = action;
			},
			setTarget: function(target, event){
				this.target = target;
				this.changed && this.changed(event);
			},
			timeout: undefined
		}
	}
})
.provider('gearSkeleton', function(){
	this.$get = function(){
		var target;
		return {
			// login: {
			// 	element: function(element){
			// 		this.login = element;
			// 	},
			// 	setElement: function(element){
			// 		this.element = element;
			// 	}
			// },
			// login: function(){
			// 	target.login();
			// },
			// logout: function(){
			// 	target.logout();
			// }
		};
	}
})
.directive('gearSkeleton', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: function($scope, $element, $attrs){
			//
		}
	}
})
.directive('gearLogin', function(gearLogin, $compile, $animate, $timeout, $q){
	return {
		restrict: 'E',
		link: function(scope, element, attrs, ctrl, transclude){
			var parent = element.parent(),
				login; // Variável de controle, para evitar que ao chamar o login e o logout ao logo um após o outro, o primeiro sobressaia o segundo.
			scope.login = function(){
				login = true;
				return $q(function(resolve){
					$animate.addClass(element, 'turn-toolbar').then(function(){
						if (login)
							$animate.leave(element).then(function(){
								resolve();
							});
					});
					element.children().removeClass('gear-show');
				})
			}
			scope.logout = function(){
				login = false;
				return $q(function(resolve){
					$animate.enter(element, parent).then(function(){
						if (!login) {
							element.children().addClass('gear-show');
							resolve();
						}
					});
					$timeout(function(){
						if (!login) {
							element.removeClass('turn-toolbar');
							$compile(element.contents())(scope);
						}
					});
				});
			}
			gearLogin.login = scope.login;
			gearLogin.logout = scope.logout;
		}
	}
})
.provider('gearLogin', function(){
	this.$get = function(){
		var target;
		return {};
	}
})
.directive('gearToolbar', function(gearSidenav, $timeout){
	return {
		restrict: 'E',
		scope: {},
		transclude: true,
		template: '<button ng-click="toggleMenu()" class="gear-mt gear-btn gear-flat gear-dark-theme gear-icon gear-btn-main-menu"><div class="gear-menu-icon" ng-class="{\'back\': openMenu}"><div class="bar"></div><div class="bar"></div><div class="bar"></div></div></button>',
		link: function(scope, element, attrs, ctrl, transclude){
			transclude(function(clone, scope){
				element.append(clone);
			});
			scope.openMenu = undefined;
			gearSidenav.change(function(side, open){
				scope.openMenu = side === 'left' ? open : false;
				$timeout(function(){ scope.$digest(); });
			});
			scope.toggleMenu = function(){
				gearSidenav.left.toggle();
			}
		}
	}
})
.directive('gearSidenav', function($animate, $timeout, gearSidenav){
	return {
		restrict: 'E',
		require: '^gearSkeleton',
		scope: {
			'gearSide': '@',
			'gearOpen': '=?'
		},
		link: function(scope, element, attrs, ctrl){
			gearSidenav.set(scope, scope.gearSide);
			scope.toggle = function(){
				scope.gearOpen ? scope.close() : scope.open();
			}
			scope.open = function(){
				gearSidenav.setOpen(scope);
				scope.gearOpen = true;
				element.addClass('gear-open');
				gearSidenav.onchange && gearSidenav.onchange(scope.gearSide, scope.gearOpen);
			}
			scope.close = function(){
				scope.gearOpen = false;
				element.removeClass('gear-open');
				gearSidenav.onchange && gearSidenav.onchange(scope.gearSide, scope.gearOpen);
				
			}
			// if (scope.gearSide === 'left')
			// 	scope.open()
		}
	}
})
.provider('gearSidenav', function(){
	// var bataaaaata;
	// this.open = function(){
	// 	return bataaaaata;
	// }
	this.$get = function(){
		var actionChange;
		return {
			set: function(scope, side){
				this[side || 'left'] = scope;
			},
			setOpen: function(scope){
				this.open && this.open.close(actionChange);
				this.open = scope;
			},
			closeOpen: function(){
				this.open && this.open.close(actionChange);
				// delete bataaaaata;
			},
			change: function(method){
				this.onchange = method;
			}
		};
	}
})
.directive('gearSidenavBackground', function(gearSidenav, $compile){
	return {
		restrict: 'E',
		require: '^gearSkeleton',
		scope: {},
		link: function(scope, element, attrs){
			element.bind('click', function(){
				gearSidenav.open.close();
			});
		}
	}
})
.directive('gearUserArea', function($timeout){
	return {
		restrict: 'E',
		scope: {
			'gearPrimaryInfo': '=?',
			'gearSecondaryInfo': '=?',
			'gearBackgroundColor': '=?',
			'gearOptions': '=?'
		},
		templateUrl: 'gear-template/user-area',
		link: function(scope, element, attrs){
			element.bind('click', function(){
				scope.openMenu = !scope.openMenu;
				scope.$apply();
			});
			angular.element(document).bind('mousedown focusin', function(e){
				$timeout(function(){
					if (!angular.element(element).find(e.target).length && scope.openMenu) {
						scope.openMenu = false;
						scope.$apply();
					}
				})
			});
		}
	}
})
.directive('gearExpandRows', function(){
	return {
		restrict: 'A',
		controller: function($scope, $element, $attrs){
			this.toggle = undefined;
			this.open = undefined;
			this.close = undefined;
		}
	}
})
.directive('gearExpandRowsParent', function($compile){
	return {
		restrict: 'A',
		require: '^gearExpandRows',
		transclude: true,
		replace: true,
		template: '<tr ng-class="{\'gear-active\':gearActive}"><td><button type="button" class="gear-mt gear-btn gear-icon gear-smlr gear-flat gear-switch" ng-click="switch()"><i class="material-icons">arrow_drop_down</i></button></td></tr>',
		scope: {
			'gearActive': '=?'
		},
		link: function(scope, element, attrs, ctrl, transclude){
			transclude(function(clone, scope){
				element.append(clone);
			});
			scope.$watch('gearActive', function(value){
				value ? ctrl.open() : ctrl.close();
			});
			scope.switch = function(){
				scope.gearActive = !scope.gearActive;
			};
		}
	}
})
.directive('gearExpandRowsChild', function($compile){
	return {
		restrict: 'A',
		require: '^gearExpandRows',
		transclude: true,
		replace: true,
		scope: {},
		template: '<tr class="gear-expand" ng-show="gearShow"><td></td></tr>',
		link: function(scope, element, attrs, ctrl, transclude) {
			element.closest('table').find('thead:first tr:not(:has(.gear-expand-offset))').prepend('<th class="gear-expand-offset"/>');
			transclude(function(clone, scope){
				element.append(clone);
			});
			element.find('> td:last').children().wrap('<div class="gear-content gear-slide" ng-show="gearShow"/>');
			scope.gearShow = false;
			ctrl.open = function(){
				scope.gearShow = true;
			};
			ctrl.close = function(){
				scope.gearShow = false;
			};
			ctrl.toggle = function(){
				scope.gearShow = !scope.gearShow;
				return scope.gearShow;
			};
			$compile(element.contents())(scope);
		}
	}
})
.provider('gearSnack', function(){
	var _hideDelay = 5000,
		_newAdded,
		_hide
		_bars = [],
		_defaults = {
			delay: 1000,
			actionText: 'Ok'
		};
	this.getDelay = function(){
		return _hideDelay;
	}
	this.setDelay = function(time){
		_hideDelay = time;
	}
	this.$get = function(){
		return {
			show: function(bar){
				_newAdded && _newAdded(bar);
			},
			hide: function(){
				_hide && _hide();
			},
			onHide: function(action){
				_hide = action;
			},
			newAdded: function(action){
				_newAdded = action;
			},
			getDefaults: function(){
				return _defaults;
			}
		}
	}
})
.directive('gearSnackContainer', function(gearSnack, gearColor, $timeout){
	return {
		restrict: 'E',
		templateUrl: 'gear-template/snack-container',
		link: function(scope, element, attrs) {
			var timeout;
			scope.activeBar;
			scope.bars = [];
			gearSnack.newAdded(function(bar){
				// TENTAR TROCAR O NG-REPEAT POR INSERIR UM ELEMENTO
				// USANDO O $animate.enter PRA USAR OS CALLBACK -~
				var bar = angular.extend({}, gearSnack.getDefaults(), bar);
				scope.bars.push(bar);
				if (scope.bars.length == 1)
					timerBar();
			});
			function finishTimeout(){
				scope.bars.shift();
				if (scope.bars.length)
					timerBar();
			};
			function timerBar(){
				if (scope.bars.length && scope.bars[0].delay)
					timeout = $timeout(finishTimeout, scope.bars[0].delay);
			}
			gearSnack.onHide(function(){
				if (timeout)
					$timeout.cancel(timeout);
				finishTimeout();
			});
		}
	}
})
.directive('gearSnackBar', function(gearSnack){
	return {
		restrict: 'E',
		templateUrl: 'gear-template/snack-bar',
		scope: {
			'gearBar': '='
		},
		link: function(scope, element, attrs) {
			// $animate.on('enter', element, function(){
			// 	console.log('Entrooou')
			// })
			// $animate.on('leave', element, function(e){
			// 	console.log(e)
			// 	console.log('Saiuuuu')
			// })
		}
	}
})
.directive('gearTimePicker', function($timeout){
	return {
		restrict: 'E',
		require: 'ngModel',
		scope: {
			'ngModel': '=',
			'dateSelected': '=?',
			'gearSelectHour': '&?',
			'gearSelectMinute': '&?',
			'gearError': '=?',
			'gearErrorMessage': '=?',
			'activeSelecion': '=?'
		},
		templateUrl: 'gear-template/time-picker',
		link: function(scope, element, attrs, ctrl) {
			scope.hourType = 24;
			scope.activeSelection = !scope.activeSelection ? 'hours' : scope.activeSelection;
			scope.ngModel = scope.ngModel ? new Date(scope.ngModel) : '';

			ctrl.$parsers.push(function(value){
				value = isValidDate(value) ? new Date(value) : '';
				scope.date = value ? value : '';
				if (isValidDate(value))
					scope.actualRotate = selectedDegree(scope.activeSelection == 'hours' ? value.getHours() : value.getMinutes(), scope.activeSelection);
				return value;
			});
			ctrl.$formatters.push(function(value){
				value = isValidDate(value) ? new Date(value) : '';
				scope.date = value ? value : '';
				if (isValidDate(value))
					scope.actualRotate = selectedDegree(scope.activeSelection == 'hours' ? value.getHours() : value.getMinutes(), scope.activeSelection);
				return value;
			});
			if (!isValidDate(scope.ngModel))
				scope.ngModel = '';

			scope.activeHours = function() {
				scope.activeSelection = 'hours';
				if (scope.ngModel)
					scope.actualRotate = selectedDegree(scope.ngModel.getHours(), 'hours');
			}
			scope.activeMinutes = function() {
				scope.activeSelection = 'minutes';
				scope.actualRotate = selectedDegree(scope.ngModel.getMinutes(), 'minutes');
			}
			scope.getHoursList = function(){
				var hoursList = [];
				if (scope.hourType == 24) {
					for (i = 0; i < 12; i++) {
						if (i != 11)
							hoursList.push(i + 13);
						else
							hoursList.push(0);
					}
				}
				for (i = 0; i < 12; i++) {
					hoursList.push(i + 1);
				}
				return hoursList;
			};
			scope.getMinutesList = function(){
				var minutesList = [];
				for (i = 0; i < 60; i += 5) {
					minutesList.push(i);
				}
				return minutesList;
			};
			scope.isSelectedHour = function(hour){
				return (scope.ngModel && scope.ngModel.getHours() === hour);
			}
			scope.isSelectedMinute = function(minute){
				return (scope.ngModel && scope.ngModel.getMinutes() === minute);
			}
			scope.selectHour = function(hour, e) {
				if (!scope.date) {
					scope.date = new Date();
					scope.date.setHours(0,0,0,0);
					scope.gearErrorMessage = '';
				}
				scope.date.setHours(hour);
				scope.ngModel = scope.date;
				scope.actualRotate = selectedDegree(hour, 'hours');
				if (e) {
					scope.activeMinutes();
					$timeout(function(){
						scope.focusMinute();
						scope.gearSelectHour && scope.gearSelectHour();
					});
				}
			}
			scope.focusHour = function() {
				element.find('.selected-hour').focus();
				scope.activeSelection = 'hours';
			}
			scope.changeHour = function(e) {
				var changeTo;
				switch (e.which) {
					case 38:
						changeTo = scope.date.getHours() + 1;
						scope.selectHour(changeTo == 24 ? 0 : changeTo);
						e.preventDefault();
						break;
					case 39:
						scope.focusMinute();
						e.preventDefault();
						break;
					case 40:
						changeTo = scope.date.getHours() - 1;
						scope.selectHour(changeTo == -1 ? 23 : changeTo);
						e.preventDefault();
						break;
				}
			}
			scope.selectMinute = function(minute, e) {
				if (!scope.date) {
					scope.date = new Date();
					scope.date.setHours(0,0,0,0);
				}
				scope.date.setMinutes(minute);
				scope.ngModel = scope.date;
				scope.actualRotate = selectedDegree(minute, 'minutes');
				if (e) {
					$timeout(function(){
						scope.gearSelectMinute && scope.gearSelectMinute();
					});
				}
			}
			scope.focusMinute = function() {
				element.find('.selected-minute').focus();
				scope.activeSelection = 'minutes';
			}
			scope.changeMinute = function(e) {
				var changeTo;
				switch (e.which) {
					case 37:
						scope.focusHour();
						e.preventDefault();
						break;
					case 38:
						changeTo = scope.date.getMinutes() + 1;
						scope.selectMinute(changeTo == 60 ? 0 : changeTo);
						e.preventDefault();
						break;
					case 40:
						changeTo = scope.date.getMinutes() - 1;
						scope.selectMinute(changeTo == -1 ? 59 : changeTo);
						e.preventDefault();
						break;
				}
			}
			scope.actualRotate = 0;
			if (scope.ngModel)
				scope.actualRotate = selectedDegree(scope.ngModel.getHours(), 'hours');
			function selectedDegree(value, active){
				var actualRotate, rotateTo, amountRotate, oldRotate, offsetRotate;
				actualRotate = scope.actualRotate;
				rotateTo = active == 'hours' ? 30 * (value >= 12 ? value - 12 : value) : 6 * value;
				oldRotate = actualRotate;
				oldRotate = oldRotate >= 360 ? oldRotate - (Math.floor(oldRotate / 360) * 360) : (oldRotate <= -360 ? oldRotate + (Math.floor(Math.abs(oldRotate) / 360) * 360) : oldRotate);
				// console.log('')
				// console.log('')
				// console.log(oldRotate)
				// console.log(rotateTo - oldRotate)
				if (rotateTo - oldRotate < -180) {
					// Mais de meia volta pra frente
					amountRotate = 360 - oldRotate + rotateTo;
					// console.log('VOLTA FRENTE')
				} else if (rotateTo - oldRotate > 180) {
					// console.log('VOLTA TRÁS - ' + value + ': ', 360 - rotateTo + oldRotate)
					// console.log(rotateTo, oldRotate)
					// Mais de meia volta pra trás
					// TEM BUG AQUI, SE TIVER QUE VOLTAR MENOS QUE -360º ELE VAI PELO CAMINHO MAIS LONGE
					amountRotate = -(360 - rotateTo + oldRotate);
				// 	// console.log((Math.floor(oldRotate / 360) * 360))
				// 	amountRotate = amountRotate > 180 ? amountRotate - 360 : amountRotate;
				// 	// console.log(amountRotate, rotateTo, oldRotate)
				// 	console.log('VOLTA TRÁS')
					// amountRotate = rotateTo - oldRotate;
				} else {
					amountRotate = rotateTo - oldRotate;
					// console.log('DE BOAS')
				}
				if (Math.abs(amountRotate) == 180)
					amountRotate = rotateTo > oldRotate ? Math.abs(amountRotate) : -amountRotate;
				actualRotate += amountRotate;
				return actualRotate;
			}
			scope.selectedHourTop = function(hour){
				return hour > 0 && hour < 13 && scope.hourType == 24 ? '42px' : '';
			}
			scope.isHourInside = function(hour){
				return hour > 0 && hour < 13 && scope.hourType == 24;
			}
			// scope.ngModel ? scope.goToSelected() : scope.goToday();

			// scope.$watch('ngModel', function(value){
			// 	scope.gearError ? el.addClass('gear-error') : el.removeClass('gear-error');
			// })

			function isValidDate(d) {
				if (Object.prototype.toString.call(d) !== '[object Date]' || typeof d === 'boolean')
					return false;
				return !isNaN(d.getTime());
			}

		}
	}
})
.directive('gearTimePickerGroup', function($filter, $timeout){
	return {
		restrict: 'E',
		require: ['^form', 'ngModel'],
		scope: {
			'ngModel': '=',
			'gearId': '@',
			'gearLabel': '@',
			'gearFormat': '@',
			'gearName': '@',
			'gearShow': '=?',
			'gearErrorMessage': '=?',
			'gearMin': '=?',
			'gearMax': '=?'
		},
		templateUrl: 'gear-template/time-picker-group',
		replace: true,
		link: function(scope, element, attrs, ctrls) {
			'autocomplete' in attrs && element.find('input:first').attr('autocomplete', attrs.autocomplete);
			scope.required = 'required' in attrs;
			scope.isInvalid = function(){
				return scope.picker.invalid && scope.input.$dirty;
			}
			scope.input = ctrls[0][scope.gearName];
			scope.gearFormat = scope.gearFormat || 'HH:mm';
			scope.picker = {model: scope.ngModel};

			scope.openPicker = function(){
				if (!scope.gearShow) {
					scope.gearShow = true;
					// $timeout(function(){ element.find('.time-part.selected-hour').focus(); });
				}
			};

			scope.closePicker = function(){
				scope.gearShow = false;
				scope.picker.text = $filter('date')(scope.ngModel, scope.gearFormat);
			};

			scope.$watch('picker.text', function(value, oldValue) {
				// if (!value) {
				// 	scope.picker.model = scope.picker.text;
				// 	return;
				// }

				if (scope.picker.invalid)
					scope.picker.model = false;
				else if (value != oldValue) {
					value = value.split(':');
					scope.picker.model = new Date();
					scope.picker.model.setHours(value[0]);
					scope.picker.model.setMinutes(value[1]);
				}
			});

			scope.$watch('picker.model', function(value) {
				scope.ngModel = scope.picker.model;
			});


			ctrls[1].$parsers.push(function(value){
				if (!scope.picker.invalid)
					scope.picker.text = $filter('date')(value, scope.gearFormat);
				return value;
			});

			ctrls[1].$formatters.push(function(value){
				value = !value && value != false ? '' : value;
				scope.picker.text = isValidDate(value) ? $filter('date')(value, scope.gearFormat) : '';
				return value;
			});

			element.find('input').bind('focus', function(){
				scope.openPicker();
				scope.$digest();
			});

			angular.element(document).bind('mousedown focusin', function(e){
				$timeout(function(){
					if (!angular.element(element).find(e.target).length && scope.gearShow) {
						scope.gearShow = false;
						scope.$apply();
					}
				})
			});

			function isValidDate(d) {
				if (Object.prototype.toString.call(d) !== '[object Date]' || typeof d === 'boolean')
					return false;
				return !isNaN(d.getTime());
			}
		}
	}
})
.directive('gearMainMenu', function(){
	return {
		restrict: 'E',
		replace: true,
		scope: {
			'gearList': '=',
			'gearType': '@',
			'gearOrder': '@',
			'gearMainProp': '@',
			'gearPrimInfo': '@',
			'gearEmptyMessage': '@',
			'gearReturnList': '=?',
			'gearFavList': '=?',
			'gearOnFavorite': '=?',
			'gearOnSelect': '=?'
		},
		templateUrl: 'gear-template/main-menu',
		controller: function($scope){
			$scope.gearType = $scope.gearType ? $scope.gearType : 'tree';
			this.favorite = function(target){
				if ($scope.gearOnFavorite)
					$scope.gearOnFavorite(target, true);
				else
					target.favorite = true;
			}
			this.unfavorite = function(target){
				// console.log($scope.gearOnFavorite())
				if ($scope.gearOnFavorite)
					$scope.gearOnFavorite(target, false);
				else
					target.favorite = false;
			}
		}
	}
})
.directive('gearMainMenuList', function(){
	return {
		restrict: 'E',
		replace: true,
		scope: {
			'gearList': '=',
			'gearType': '=?',
			'gearOrder': '=?',
			'gearMainProp': '=?',
			'gearPrimInfo': '=?',
			'gearEmptyMessage': '=?',
			'gearReturnList': '=?',
			'gearFavList': '=?',
			'gearOnSelect': '=?'
		},
		templateUrl: 'gear-template/main-menu-list',
		link: function(scope, element, attrs) {
			scope.filteredList = [];
			if (scope.gearType == 'history') {
				scope.$watch('gearFavList', function(value){
					var list = scope.gearList;
					for (var i = 0; i < list.length; i++) {
						if (value) {
							var found = value.some(function(item){
								return item.id === list[i].id;
							});
							list[i].favorite = !!found;
						} else
							list[i].favorite = false;
					}
				});
			}
			scope.$watch('filteredList', function(value){
				scope.gearReturnList = value;
			}, true);
		}
	}
})
.directive('gearMainMenuItem', function($compile){
	return {
		restrict: 'E',
		replace: true,
		require: '^gearMainMenu',
		scope: {
			'gearItem': '=',
			'gearType': '=?',
			'gearMainProp': '=?',
			'gearPrimInfo': '=?',
			'gearOnSelect': '=?'
		},
		templateUrl: 'gear-template/main-menu-item',
		link: function(scope, element, attrs, ctrl) {
			if (scope.gearItem && scope.gearItem.list) {
				element.append('<gear-main-menu-list class="gear-slide" gear-list="gearItem.list" gear-type="gearType" ng-hide="!isOpen" gear-on-select="gearOnSelect" style="transition-duration: 200ms"></gear-main-menu-list>');
				element.find('a').attr('ng-click', 'toggleSubMenu()')
				$compile(element.contents())(scope);
				scope.isOpen = false;
				scope.toggleSubMenu = function(){
					scope.isOpen = !scope.isOpen;
				}
			} else {
				scope.toggleFavorite = function(item){
					if (item.favorite)
						ctrl.unfavorite(item);
					else
						ctrl.favorite(item);
				}
				scope.removeFavorite = function(item){
					ctrl.unfavorite(item);
				}
			}
			scope.itemClick = function(){
				if (scope.gearItem && scope.gearItem.list)
					scope.toggleSubMenu();
				else
					scope.gearOnSelect && scope.gearOnSelect();
			}
			scope.checkItemTitle = function(){
				var el = element.find('.gear-item-name')[0];
				scope.itemTitle = el.offsetWidth < el.scrollWidth ? scope.gearItem.name : '';
			}
		}
	}
})
.filter('gearMainMenu', function($filter){
	return function(list, type, prop){
		var newList,
			favorites = [],
			top10 = [],
			history = [];
		function iterateTreeFavorite(tree) {
			for (var i = 0; i < tree.length; i++) {
				if (tree[i][prop])
					favorites.push(tree[i]);
				else if (tree[i].list)
					iterateTreeFavorite(tree[i].list);
			}
		}
		function iterateTreeTop10(tree) {
			for (var i = 0; i < tree.length; i++) {
				if (tree[i][prop])
					top10.push(tree[i]);
				else if (tree[i].list)
					iterateTreeTop10(tree[i].list);
			}
			top10 = $filter('orderBy')(top10, prop);
		}
		function iterateTreeHistory(tree) {
			var groupDate, groupLabel,
				hoje = new Date(),
				ontem;
			hoje.setHours(0,0,0,0);
			ontem = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1);;
			tree = $filter('orderBy')(tree, prop, true);
			for (var i = 0; i < tree.length; i++) {
				var loopEl = angular.copy(tree[i]),
					loopDate = angular.copy(loopEl[prop]);
				loopDate.setHours(0,0,0,0);
				if (!groupDate || groupDate.getTime() != loopDate.getTime()) {
					// var toPush = {};
					groupDate = loopDate;
					var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
						weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
						sevenDaysInMil = 1000 * 60 * 60 * 24 * 7;
					groupLabel = groupDate.getDate() + ' de ' + months[groupDate.getMonth()].toLowerCase() + ' de ' + groupDate.getFullYear();
					if (hoje.getTime() === groupDate.getTime())
						groupLabel = 'Hoje';
					else if (ontem.getTime() === groupDate.getTime())
						groupLabel = 'Ontem';
					else if (hoje.getTime() - sevenDaysInMil <= groupDate.getTime()) {
						groupLabel = weekDays[groupDate.getDay()];
					}
					// toPush.gearType = 'label';
					// toPush[prop] = angular.copy(groupDate);
					// toPush[prop].setHours(23,59,59,999);
					// history.push(toPush);
					tree[i].gearLabel = groupLabel;
				}
				loopEl[prop] = $filter('date')(loopEl[prop], 'HH:mm')
				history.push(tree[i]);
			}
			// history = $filter('orderBy')(tree, prop, true);;
		}
		switch (type) {
			case 'favorites':
				iterateTreeFavorite(list);
				newList = favorites;
				break;
			case 'top10':
				iterateTreeTop10(list);
				newList = top10;
				break;
			case 'history':
				iterateTreeHistory(list);
				newList = history;
				break;
			default:
				newList = $filter('orderBy')(list, prop);
		}
		return newList;
	}
})
.provider('gearColor', function(){
	var _material = {
		red: {
			50: '#FFEBEE',
			100: '#FFCDD2',
			200: '#EF9A9A',
			300: '#E57373',
			400: '#EF5350',
			500: '#F44336',
			600: '#E53935',
			700: '#D32F2F',
			800: '#C62828',
			900: '#B71C1C',
			A100: '#FF8A80',
			A200: '#FF5252',
			A400: '#FF1744',
			A700: '#D50000'
		},
		pink: {
			50: '#FCE4EC',
			100: '#F8BBD0',
			200: '#F48FB1',
			300: '#F06292',
			400: '#EC407A',
			500: '#E91E63',
			600: '#D81B60',
			700: '#C2185B',
			800: '#AD1457',
			900: '#880E4F',
			A100: '#FF80AB',
			A200: '#FF4081',
			A400: '#F50057',
			A700: '#C51162'
		},
		purple: {
			50: '#F3E5F5',
			100: '#E1BEE7',
			200: '#CE93D8',
			300: '#BA68C8',
			400: '#AB47BC',
			500: '#9C27B0',
			600: '#8E24AA',
			700: '#7B1FA2',
			800: '#6A1B9A',
			900: '#4A148C',
			A100: '#EA80FC',
			A200: '#E040FB',
			A400: '#D500F9',
			A700: '#AA00FF'
		},
		deepPurple: {
			50: '#EDE7F6',
			100: '#D1C4E9',
			200: '#B39DDB',
			300: '#9575CD',
			400: '#7E57C2',
			500: '#673AB7',
			600: '#5E35B1',
			700: '#512DA8',
			800: '#4527A0',
			900: '#311B92',
			A100: '#B388FF',
			A200: '#7C4DFF',
			A400: '#651FFF',
			A700: '#6200EA'
		},
		indigo: {
			50: '#E8EAF6',
			100: '#C5CAE9',
			200: '#9FA8DA',
			300: '#7986CB',
			400: '#5C6BC0',
			500: '#3F51B5',
			600: '#3949AB',
			700: '#303F9F',
			800: '#283593',
			900: '#1A237E',
			A100: '#8C9EFF',
			A200: '#536DFE',
			A400: '#3D5AFE',
			A700: '#304FFE'
		},
		blue: {
			50: '#E3F2FD',
			100: '#BBDEFB',
			200: '#90CAF9',
			300: '#64B5F6',
			400: '#42A5F5',
			500: '#2196F3',
			600: '#1E88E5',
			700: '#1976D2',
			800: '#1565C0',
			900: '#0D47A1',
			A100: '#82B1FF',
			A200: '#448AFF',
			A400: '#2979FF',
			A700: '#2962FF'
		},
		lightBlue: {
			50: '#E1F5FE',
			100: '#B3E5FC',
			200: '#81D4FA',
			300: '#4FC3F7',
			400: '#29B6F6',
			500: '#03A9F4',
			600: '#039BE5',
			700: '#0288D1',
			800: '#0277BD',
			900: '#01579B',
			A100: '#80D8FF',
			A200: '#40C4FF',
			A400: '#00B0FF',
			A700: '#0091EA'
		},
		cyan: {
			50: '#E0F7FA',
			100: '#B2EBF2',
			200: '#80DEEA',
			300: '#4DD0E1',
			400: '#26C6DA',
			500: '#00BCD4',
			600: '#00ACC1',
			700: '#0097A7',
			800: '#00838F',
			900: '#006064',
			A100: '#84FFFF',
			A200: '#18FFFF',
			A400: '#00E5FF',
			A700: '#00B8D4'
		},
		teal: {
			50: '#E0F2F1',
			100: '#B2DFDB',
			200: '#80CBC4',
			300: '#4DB6AC',
			400: '#26A69A',
			500: '#009688',
			600: '#00897B',
			700: '#00796B',
			800: '#00695C',
			900: '#004D40',
			A100: '#A7FFEB',
			A200: '#64FFDA',
			A400: '#1DE9B6',
			A700: '#00BFA5'
		},
		green: {
			50: '#E8F5E9',
			100: '#C8E6C9',
			200: '#A5D6A7',
			300: '#81C784',
			400: '#66BB6A',
			500: '#4CAF50',
			600: '#43A047',
			700: '#388E3C',
			800: '#2E7D32',
			900: '#1B5E20',
			A100: '#B9F6CA',
			A200: '#69F0AE',
			A400: '#00E676',
			A700: '#00C853'
		},
		lightGreen: {
			50: '#F1F8E9',
			100: '#DCEDC8',
			200: '#C5E1A5',
			300: '#AED581',
			400: '#9CCC65',
			500: '#8BC34A',
			600: '#7CB342',
			700: '#689F38',
			800: '#558B2F',
			900: '#33691E',
			A100: '#CCFF90',
			A200: '#B2FF59',
			A400: '#76FF03',
			A700: '#64DD17'
		},
		lime: {
			50: '#F9FBE7',
			100: '#F0F4C3',
			200: '#E6EE9C',
			300: '#DCE775',
			400: '#D4E157',
			500: '#CDDC39',
			600: '#C0CA33',
			700: '#AFB42B',
			800: '#9E9D24',
			900: '#827717',
			A100: '#F4FF81',
			A200: '#EEFF41',
			A400: '#C6FF00',
			A700: '#AEEA00'
		},
		yellow: {
			50: '#FFFDE7',
			100: '#FFF9C4',
			200: '#FFF59D',
			300: '#FFF176',
			400: '#FFEE58',
			500: '#FFEB3B',
			600: '#FDD835',
			700: '#FBC02D',
			800: '#F9A825',
			900: '#F57F17',
			A100: '#FFFF8D',
			A200: '#FFFF00',
			A400: '#FFEA00',
			A700: '#FFD600'
		},
		amber: {
			50: '#FFF8E1',
			100: '#FFECB3',
			200: '#FFE082',
			300: '#FFD54F',
			400: '#FFCA28',
			500: '#FFC107',
			600: '#FFB300',
			700: '#FFA000',
			800: '#FF8F00',
			900: '#FF6F00',
			A100: '#FFE57F',
			A200: '#FFD740',
			A400: '#FFC400',
			A700: '#FFAB00'
		},
		orange: {
			50: '#FFF3E0',
			100: '#FFE0B2',
			200: '#FFCC80',
			300: '#FFB74D',
			400: '#FFA726',
			500: '#FF9800',
			600: '#FB8C00',
			700: '#F57C00',
			800: '#EF6C00',
			900: '#E65100',
			A100: '#FFD180',
			A200: '#FFAB40',
			A400: '#FF9100',
			A700: '#FF6D00'
		},
		deepOrange: {
			50: '#FBE9E7',
			100: '#FFCCBC',
			200: '#FFAB91',
			300: '#FF8A65',
			400: '#FF7043',
			500: '#FF5722',
			600: '#F4511E',
			700: '#E64A19',
			800: '#D84315',
			900: '#BF360C',
			A100: '#FF9E80',
			A200: '#FF6E40',
			A400: '#FF3D00',
			A700: '#DD2C00'
		},
		brown: {
			50: '#EFEBE9',
			100: '#D7CCC8',
			200: '#BCAAA4',
			300: '#A1887F',
			400: '#8D6E63',
			500: '#795548',
			600: '#6D4C41',
			700: '#5D4037',
			800: '#4E342E',
			900: '#3E2723'
		},
		grey: {
			50: '#FAFAFA',
			100: '#F5F5F5',
			200: '#EEEEEE',
			300: '#E0E0E0',
			400: '#BDBDBD',
			500: '#9E9E9E',
			600: '#757575',
			700: '#616161',
			800: '#424242',
			900: '#212121'
		},
		blueGrey: {
			50: '#ECEFF1',
			100: '#CFD8DC',
			200: '#B0BEC5',
			300: '#90A4AE',
			400: '#78909C',
			500: '#607D8B',
			600: '#546E7A',
			700: '#455A64',
			800: '#37474F',
			900: '#263238'
		},
		black: '#000000',
		white: '#FFFFFF'
	}
	this.$get = function(){
		return {
			material: _material
		};
	}
})
.filter('gearCpf', function(){
	return function(cpf){
		if (!cpf) return;
		cpf = cpf.toString().replace(/[^0-9]+/g, '');
		if (cpf.length > 3)
			cpf = cpf.substring(0,3) + '.' + cpf.substring(3);
		if (cpf.length > 7)
			cpf = cpf.substring(0,7) + '.' + cpf.substring(7);
		if (cpf.length > 11)
			cpf = cpf.substring(0,11) + '-' + cpf.substring(11);
		if (cpf.length > 14)
			cpf = cpf.substring(0,14);
		return cpf;
	}
})
.filter('gearCnpj', function(){
	return function(cnpj){
		if (!cnpj) return;
		cnpj = cnpj.toString().replace(/[^0-9]+/g, '');
		if (cnpj.length > 2)
			cnpj = cnpj.substring(0,2) + '.' + cnpj.substring(2);
		if (cnpj.length > 6)
			cnpj = cnpj.substring(0,6) + '.' + cnpj.substring(6);
		if (cnpj.length > 10)
			cnpj = cnpj.substring(0,10) + '/' + cnpj.substring(10);
		if (cnpj.length > 15)
			cnpj = cnpj.substring(0,15) + '-' + cnpj.substring(15);
		if (cnpj.length > 18)
			cnpj = cnpj.substring(0,18);
		return cnpj;
	}
})
.filter('gearPhone', function(){
	return function(phone){
		if (!phone) return;
		phone = phone.toString().replace(/[^0-9]+/g, '');
		if (phone.length > 0)
			phone = phone.substring(0,0) + '(' + phone.substring(0);
		if (phone.length > 3)
			phone = phone.substring(0,3) + ') ' + phone.substring(3);
		if (phone.length > 9) {
			if (phone.length < 14)
				phone = phone.substring(0,9) + '-' + phone.substring(9);
			else
				phone = phone.substring(0,10) + '-' + phone.substring(10);
		}
		if (phone.length > 15)
			phone = phone.substring(0,15);
		return phone;
	}
})
.filter('gearCep', function(){
	return function(cep){
		if (!cep) return;
		cep = cep.toString().replace(/[^0-9]+/g, '');
		if (cep.length > 5)
			cep = cep.substring(0,5) + '-' + cep.substring(5);
		return cep;
	}
})
.filter('gearMoney', function(){
	return function(value, prefix, decimalSeparator, thousandSeparator, decimalPlaces){
		if (isNaN(value)) return NaN;
		// round = (round === undefined) ? true : round;
		decimalPlaces = (decimalPlaces === undefined) ? 2 : decimalPlaces;
		thousandSeparator = thousandSeparator || '.';
		decimalSeparator = decimalSeparator || ',';
		value = value.toString();
		splitted = value.split('.');
		intValue = splitted[0];
		decimalValue = splitted[1] ? splitted[1].toString() : '';
		// if (decimalPlaces != 0) {
		// 	if (decimalValue.length > decimalPlaces) {
		// 		if (round) {
		// 			decimalValue = decimalValue.slice(0, decimalPlaces) + '.' + decimalValue.slice(decimalPlaces);
		// 			decimalValue = parseFloat(decimalValue).toFixed(0);
		// 			if (decimalValue.length > decimalPlaces) {
		// 				decimalValue = decimalValue.slice(1);
		// 				intValue = (parseInt(intValue) + 1).toString();
		// 			}
		// 		} else
		// 			decimalValue = decimalValue.slice(0, decimalPlaces);
		// 	} else
		if (decimalValue.length < decimalPlaces) {
			for (i = decimalValue.length; i < decimalPlaces; i++) {
				decimalValue = decimalValue + '0';
			}
		} else
			decimalValue = decimalValue.slice(0, decimalPlaces);
		var separatorCount = 0,
			intLength = intValue.length;
		for (i = 3; i < intLength; i += 3) {
			intValue = intValue.slice(0,-(i + separatorCount)) + thousandSeparator + intValue.slice(-(i + separatorCount));
			separatorCount++;
		}
		value = intValue + decimalSeparator + decimalValue;
		value = prefix ? prefix + ' ' + value : value;
		return value;
	}
})
.animation('.gear-slide', ['$animateCss', function($animateCss) {
	var lastId = 0;
	var _cache = {};

	function getId(el) {
		var id = el[0].getAttribute('gear-slide-toggle');
		if (!id) {
			id = ++lastId;
			el[0].setAttribute('gear-slide-toggle', id);
		}
		return id;
	}
	function getState(id) {
		var state = _cache[id];
		if (!state) {
			state = {};
			_cache[id] = state;
		}
		return state;
	}

	function generateRunner(closing, state, animator, element, doneFn) {
		return function() {
			state.animating = true;
			state.animator = animator;
			state.doneFn = doneFn;
			animator.start().finally(function() {
				// closing && 
				if (state.doneFn === doneFn) {
					element[0].style.height = '';
					element[0].style.paddingTop = '';
					element[0].style.paddingBottom = '';
					element[0].style.overflow = '';
				}
				state.animating = false;
				state.animator = undefined;
				state.doneFn();
			});
		}
	}

	return {
		addClass: function(element, className, doneFn) {
			if (className == 'ng-hide') {
				var state = getState(getId(element)),
				    height = (state.animating && state.height) ? state.height : element[0].offsetHeight,
					paddingTop = (state.animating && state.paddingTop) ? state.paddingTop : parseInt(element.css('padding-top')),
					paddingBottom = (state.animating && state.paddingBottom) ? state.paddingBottom : parseInt(element.css('padding-bottom'));

				var animator = $animateCss(element, {
					from: {height: height + 'px', paddingTop: paddingTop + 'px', paddingBottom: paddingBottom + 'px', overflow: 'hidden'},
					to: {height: '0px', paddingTop: '0px', paddingBottom: '0px'}
				});
				if (animator) {
					if (state.animating) {
						state.doneFn = 
						  generateRunner(true,
										 state,
										 animator,
										 element,
										 doneFn);
						return state.animator.end();
					} else {
						state.height = height;
						state.paddingTop = paddingTop;
						state.paddingBottom = paddingBottom;
						return generateRunner(true,
											  state,
											  animator,
											  element,
											  doneFn)();
					}
				}
			}
			doneFn();
		},
		removeClass: function(element, className, doneFn) {
			if (className == 'ng-hide') {
				var state = getState(getId(element));
				var height = (state.animating && state.height) ? state.height : element[0].offsetHeight,
					paddingTop = (state.animating && state.paddingTop) ? state.paddingTop : parseInt(element.css('padding-top')),
					paddingBottom = (state.animating && state.paddingBottom) ? state.paddingBottom : parseInt(element.css('padding-bottom'));

				var animator = $animateCss(element, {
					from: {height: '0px', paddingTop: '0px', paddingBottom: '0px', overflow: 'hidden'},
					to: {height: height + 'px', paddingTop: paddingTop + 'px', paddingBottom: paddingBottom + 'px'}
				});

				if (animator) {
					if (state.animating) {
						state.doneFn = generateRunner(false, 
													  state, 
													  animator, 
													  element, 
													  doneFn);
						return state.animator.end();
					} else {
						state.height = height;
						state.paddingTop = paddingTop;
						state.paddingBottom = paddingBottom;
						return generateRunner(false, 
											  state, 
											  animator, 
											  element, 
											  doneFn)();
					}
				}
			}
			doneFn();
		}
	};
}]);