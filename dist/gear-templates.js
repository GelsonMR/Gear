angular.module('gearUi').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('gear-templates/color-picker-group.html',
    "<div class=gear-form-group><div class=\"gear-icon left\" ng-style=\"{'width': gearShape == 'round-rectangle' && 'auto'}\"><div class=\"switch-color-preview gear-mt gear-color{{gearShape && ' ' + gearShape}}\" ng-class=\"{'no-color': !colorSelected}\" ng-style=\"{'background-color': colorSelected ? colorSelected : '#D01716'}\" data-color-range=300></div></div><input id={{gearId}} ng-class=gearClass name={{gearName}} ng-readonly=switchOpened ng-pattern=/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ class=\"gear-form-control txt-color-switch gear-not-empty\" ng-model=ngModel ng-focus=switchOpen() autocomplete=off ng-style=\"{'color': gearShape == 'round-rectangle' && 'transparent', 'font-size': gearShape == 'round-rectangle' && '0px'}\"><label for={{gearId}}>Cor</label><gear-form-transclude></gear-form-transclude><div class=switch-color ng-if=switchOpened><div class=no-color ng-click=setColorType(null)></div><div ng-repeat=\"colorType in colorTypes\" class=\"gear-mt gear-color\" ng-class=colorClass(colorType) ng-click=\"setColorType($event, colorType)\" ng-dblclick=selectColor($event)></div><div class=switch-var ng-class=\"{'gear-show':colorTypeSelected}\" ng-style=\"{'top': switchVarTop}\" style=\"top: -47px\"><div class=\"gear-mt gear-color{{colorTypeSelected != null ? ' ' + colorTypeSelected : ''}}\" ng-repeat=\"colorVariation in colorVariations\" ng-class=\"{'gear-show':checkAccentColor(colorVariation)}\" data-color-range={{colorVariation}} ng-click=selectColor($event)></div><div class=arrow ng-style=\"{'margin-left': switchVarArrowLeft}\" style=\"margin-left: 57px\"></div></div></div></div>"
  );


  $templateCache.put('gear-templates/date-picker-group.html',
    "<div class=gear-form-group><input id={{gearId}} class=gear-form-control ng-class=\"{'gear-error': input.$dirty && input.$error.required || input.$error.gearError}\" ng-model=picker.text ng-focus=openPicker() gear-form-control gear-mask-date gear-format-date=picker.model gear-min=gearMin gear-max=gearMax gear-format-error=picker.invalid name={{gearName}} ng-required=required><label for={{gearId}} class=gear-form-floating-label>{{gearLabel}}</label><div class=gear-message ng-if=\"input.$dirty && input.$error.required || input.$error.gearError\"><span ng-if=\"input.$dirty && input.$error.required\">Campo obrigatório</span> <span ng-if=\"input.$error.gearError && !input.$error.required\">{{picker.invalid.message}}</span></div><gear-date-picker ng-model=picker.model gear-select=closePicker() gear-error=\"input.$dirty && input.$error.required || input.$error.gearError\" gear-error-message=picker.invalid.message gear-min=gearMin gear-max=gearMax ng-class=\"{'gear-error': input.$dirty && input.$error.required || input.$error.gearError}\" ng-if=gearShow></gear-date-picker></div>"
  );


  $templateCache.put('gear-templates/date-picker.html',
    "<div class=header><div class=error-message ng-if=\"gearError || !ngModel\">{{gearErrorMessage || 'Selecione uma data'}}</div><div class=date-info ng-if=!gearError><div class=year ng-if=selectedYear()>{{selectedYear()}}</div><div class=date><span ng-click=goToSelected()>{{selectedDate()}}</span></div></div></div><div class=body><div class=calendar><div class=month-control tabindex=0 ng-keydown=monthControl($event)><div class=last-month><button type=button class=\"gear-mt gear-btn gear-smlr gear-flat gear-icon\" ng-click=goPrev() tabindex=-1><i class=material-icons>navigate_before</i></button></div><div class=month-label>{{getViewCalendar()}}</div><div class=next-month><button type=button class=\"gear-mt gear-btn gear-smlr gear-flat gear-icon\" ng-click=goNext() tabindex=-1><i class=material-icons>navigate_next</i></button></div></div><div class=week-label><div ng-repeat=\"dayLabel in weekDays track by $index\">{{dayLabel.substring(0,1)}}</div></div><div class=month-weeks><div class=week ng-repeat=\"week in weeks\"><div class=day ng-class=\"{'current-month': day.getMonth() == activeMonth.getMonth(), 'last-month': day.getFullYear() < activeMonth.getFullYear() || (day.getMonth() < activeMonth.getMonth() && day.getFullYear() == activeMonth.getFullYear()), 'next-month': day.getFullYear() > activeMonth.getFullYear() ||  (day.getMonth() > activeMonth.getMonth() && day.getFullYear() == activeMonth.getFullYear())}\" ng-repeat=\"day in week track by $index\"><button type=button ng-class=\"{'today': isToday(day), 'selected': isSelectedDay(day)}\" class=day-button ng-click=selectDay(day) ng-if=\"day.getMonth() == activeMonth.getMonth()\" ng-keydown=dayControl($event) ng-disabled=invalidDate(day) tabindex=-1>{{day.getDate()}}</button></div></div></div></div></div>"
  );


  $templateCache.put('gear-templates/main-menu-item.html',
    "<li ng-class=\"{'submenu': gearItem.list && gearItem.list.length, 'gear-active': isOpen, 'with-label': gearItem.gearLabel}\"><div class=\"group-label his-date\" ng-if=gearItem.gearLabel>{{gearItem.gearLabel}}</div><button title=\"Adicionar favorito\" class=\"gear-mt gear-btn gear-flat gear-icon gear-fav gear-smlr\" ng-class=\"{'gear-fav-add': gearItem.favorite, 'right': gearType == 'top10' || gearType == 'history'}\" ng-if=\"(!gearItem.list || (gearItem.list && !gearItem.list.length)) && (gearType == 'tree' || gearType == 'top10' || (gearType == 'history' && gearItem.gearType != 'label') || !gearType)\" ng-click=toggleFavorite(gearItem)><i class=material-icons>{{gearItem.favorite ? 'star' : 'star_border'}}</i></button> <span ng-if=\"gearItem.gearType && gearItem.gearType == 'label'\">{{gearItem.name}}</span> <a ng-href={{gearItem.link}} ng-click=itemClick() ng-if=!gearItem.gearType><div ng-if=gearPrimInfo class=menu-prim-info ng-class=\"{'his-hour': gearType == 'history'}\" ng-attr-title=\"{{gearType == 'history' ? (gearPrimInfo | date:'dd/MM/yyyy HH:mm') : ''}}\">{{gearType == 'history' ? (gearPrimInfo | date:'HH:mm') : gearPrimInfo}}</div><div class=gear-item-name ng-attr-title={{itemTitle}} ng-mouseover=checkItemTitle()>{{gearItem.name}}</div></a> <button title=\"Remover favorito\" class=\"gear-mt gear-btn gear-flat gear-icon gear-smlr gear-danger gear-delete\" ng-if=\"(!gearItem.list || (gearItem.list && !gearItem.list.length)) && (gearType == 'favorites')\" ng-click=removeFavorite(gearItem)><i class=material-icons>delete</i></button></li>"
  );


  $templateCache.put('gear-templates/main-menu-list.html',
    "<ul><li style=\"padding: 6px 10px\" ng-if=!filteredList.length>{{gearEmptyMessage || 'Nenhum item encontrado'}}</li><gear-main-menu-item ng-repeat=\"item in filteredList = (gearList | gearMainMenu:gearType:gearMainProp | orderBy:gearOrder:(gearType == 'history'))\" gear-item=item class=menu-prim-info gear-type=gearType gear-prim-info=\"gearType == 'top10' ? $index + 1 : item[gearPrimInfo]\" gear-on-select=gearOnSelect></gear-main-menu-item></ul>"
  );


  $templateCache.put('gear-templates/main-menu.html',
    "<div class=\"gear-menu-list {{gearType}}\"><gear-main-menu-list gear-list=gearList gear-type=gearType gear-order=gearOrder gear-main-prop=gearMainProp gear-prim-info=gearPrimInfo gear-empty-message=gearEmptyMessage gear-return-list=gearReturnList gear-fav-list=gearFavList gear-on-select=gearOnSelect></gear-main-menu-list></div>"
  );


  $templateCache.put('gear-templates/snack-bar.html',
    "<div class=gear-snack-text>{{gearBar.text}}</div><button class=\"gear-mt gear-btn gear-flat gear-dark-theme\" ng-style=\"{'color': gearBar.actionColor}\" ng-click=gearBar.action() ng-if=gearBar.action>{{gearBar.actionText}}</button>"
  );


  $templateCache.put('gear-templates/snack-container.html',
    "<gear-snack-bar ng-repeat=\"bar in bars\" gear-bar=bar ng-if=\"$index == 0\"></gear-snack-bar>"
  );


  $templateCache.put('gear-templates/time-picker-group.html',
    "<div class=gear-form-group><input id={{gearId}} class=gear-form-control ng-class=\"{'gear-error': isInvalid() || input.$dirty && input.$error.required}\" ng-model=picker.text ng-focus=openPicker() gear-form-control gear-mask-time gear-format-time=picker.model gear-format-error=picker.invalid name={{gearName}} ng-required=required><label for={{gearId}} class=gear-form-floating-label>{{gearLabel}}</label><div class=gear-message ng-if=\"input.$dirty && input.$error\"><span ng-if=\"input.$dirty && input.$error.required\">Campo obrigatório</span> <span ng-if=\"input.$dirty && input.$error.gearError && !input.$error.required\">{{picker.invalid}}</span></div><gear-time-picker ng-model=picker.model gear-select-minute=closePicker() gear-error=isInvalid() gear-error-message=picker.invalid ng-class=\"{'gear-error': isInvalid() || input.$dirty && input.$error.required}\" ng-if=gearShow></gear-time-picker></div>"
  );


  $templateCache.put('gear-templates/time-picker.html',
    "<div class=\"header\">\r" +
    "\n" +
    "	<div class=\"error-message\" ng-if=\"gearError\" style=\"font-size: 16px;\">{{gearErrorMessage}}</div>\r" +
    "\n" +
    "	<div ng-if=\"!gearError && !date\" style=\"font-size: 20px;\">\r" +
    "\n" +
    "		Selecione uma hora\r" +
    "\n" +
    "	</div>\r" +
    "\n" +
    "	<div class=\"time-info\" ng-if=\"!gearError && !!date\">\r" +
    "\n" +
    "		<div class=\"time\">\r" +
    "\n" +
    "			<div class=\"time-part selected-hour\" ng-class=\"{'active': activeSelection == 'hours'}\" ng-focus=\"activeHours()\" ng-keydown=\"changeHour($event)\" tabindex=\"0\">{{date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}}</div>\r" +
    "\n" +
    "			<span>:</span>\r" +
    "\n" +
    "			<div class=\"time-part selected-minute\" ng-class=\"{'active': activeSelection == 'minutes'}\" ng-focus=\"activeMinutes()\" ng-keydown=\"changeMinute($event)\" tabindex=\"0\">{{date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}}</div>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "	</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"body\">\r" +
    "\n" +
    "	<div class=\"clock {{activeSelection}}\" ng-class=\"hourType == 12 ? 'hour-12' : 'hour-24'\">\r" +
    "\n" +
    "		<div class=\"sel-cont\" ng-style=\"{'transform': 'rotate(' + actualRotate + 'deg)', 'top': (activeSelection == 'hours' ? selectedHourTop(date.getHours()) : '')}\" ng-if=\"!gearError && !!date\">\r" +
    "\n" +
    "			<div class=\"sel-cont-ball\" ng-class=\"{'precise-minute': date.getMinutes() % 5 != 0 && activeSelection == 'minutes'}\"></div>\r" +
    "\n" +
    "			<div class=\"sel-cont-stick\"></div>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "		<div class=\"hours-wrap clock-inner-wrap\" ng-click=\"focusHour()\" ng-if=\"activeSelection == 'hours' || !date\">\r" +
    "\n" +
    "			<div ng-repeat=\"hour in getHoursList()\" class=\"segment-cont\" ng-style=\"{'transform': 'rotate(' + (30 * (hour >= 12 ? hour - 12 : hour)) + 'deg)'}\">\r" +
    "\n" +
    "				<button type=\"button\" class=\"hour\" ng-click=\"selectHour(hour, $event)\" ng-class=\"{'selected': isSelectedHour(hour)}\" ng-style=\"{'transform': 'rotate(-' + (30 * (hour >= 12 ? hour - 12 : hour)) + 'deg)'}\" ng-focus=\"focusHour()\" tabindex=\"-1\">{{hour || '00'}}</button>\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "		<div class=\"minutes-wrap clock-inner-wrap\" ng-click=\"focusMinute()\" ng-if=\"activeSelection == 'minutes' && date\">\r" +
    "\n" +
    "			<div ng-repeat=\"minute in getMinutesList()\" class=\"segment-cont\" ng-style=\"{'transform': 'rotate(' + (30 * ($index >= 12 ? $index - 12 : $index)) + 'deg)'}\">\r" +
    "\n" +
    "				<button type=\"button\" class=\"minute\" ng-click=\"selectMinute(minute, $event)\" ng-class=\"{'selected': isSelectedMinute(minute)}\" ng-style=\"{'transform': 'rotate(-' + (30 * ($index >= 12 ? $index - 12 : $index)) + 'deg)'}\" ng-focus=\"focusMinute()\" tabindex=\"-1\">{{minute || '00'}}</button>\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "	</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('gear-templates/user-area.html',
    "<div class=gear-user-name>{{gearPrimaryInfo}}<div class=cod-filial>{{gearSecondaryInfo}}</div></div><i class=\"material-icons down-arrow\">arrow_drop_down</i><div class=gear-user-pic>{{gearPrimaryInfo.slice(0,1)}}</div><div class=gear-custom-select ng-class=\"{'gear-open': openMenu}\"><ul ng-repeat=\"list in gearOptions\"><li ng-repeat=\"option in list\"><div id=option-fav class=gear-select-option ng-click=\"option.action && option.action()\"><i class=\"material-icons gear-icon\">{{option.icon}}</i> {{option.name}}</div></li></ul></div>"
  );

}]);
