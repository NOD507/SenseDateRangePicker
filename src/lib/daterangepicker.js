/**
* @version: 2.1.13
* @author: Dan Grossman http://www.dangrossman.info/
* @copyright: Copyright (c) 2012-2015 Dan Grossman. All rights reserved.
* @license: Licensed under the MIT license. See http://www.opensource.org/licenses/mit-license.php
* @website: https://www.improvely.com/
***
*Sense Extension
*Nodier Torres
*Added a few changes to the html template 
**Added  if (this.endDate?this.endDate._isValid:false) at udpdateFormInputs. when clear selections endDate will be set to null to make default calendar without range selected
***
*/

(function(root, factory) {

    if (typeof define === 'function' && define.amd ) {  
      define(['./moment.min', 'jquery', 'exports'], function(momentjs, $, exports) {   
        root.qlikdaterangepicker = factory(root, exports, momentjs, $);
      });
  
    } else if (typeof exports !== 'undefined') {
        var momentjs = require('moment');
        var jQuery = (typeof window != 'undefined') ? window.jQuery : undefined;  //isomorphic issue
        if (!jQuery) {
            try {
                jQuery = require('jquery');
                if (!jQuery.fn) jQuery.fn = {}; //isomorphic issue
            } catch (err) {
                if (!jQuery) throw new Error('jQuery dependency not found');
            }
        }
  
      factory(root, exports, momentjs, jQuery);
  
    // Finally, as a browser global.
    } else { 
      root.qlikdaterangepicker = factory(root, {}, root.moment || moment, (root.jQuery || root.Zepto || root.ender || root.$));
    }
  
  }(this || {}, function(root, qlikdaterangepicker, moment, $) { // 'this' doesn't exist on a server
  
      var DateRangePicker = function(element, options, cb) {
  
          //default settings for options
          this.parentEl = 'body';
          this.element = $(element);
          this.startDate = moment().startOf('day');
          this.endDate = moment().endOf('day');
          this.minDate = false;
          this.maxDate = false;
          this.dateLimit = false;
          this.autoApply = false;
          this.singleDatePicker = false;
          this.showDropdowns = false;
          this.showWeekNumbers = false;
          this.timePicker = false;
          this.timePicker24Hour = false;
          this.timePickerIncrement = 1;
          this.timePickerSeconds = false;
          this.linkedCalendars = true;
          this.autoUpdateInput = true;
          this.ranges = {};
  
          this.opens = 'right';
          if (this.element.hasClass('pull-right'))
              this.opens = 'left';
          this.drops = options.top;
          if (this.element.hasClass('dropup'))
              this.drops = 'up';
  
          this.buttonClasses = 'btn btn-sm';
          this.applyClass = 'btn-success';
          this.cancelClass = 'btn-default';
  
          this.locale = {
              format: 'MM/DD/YYYY',
              separator: ' - ',
              applyLabel: 'Apply',
              cancelLabel: 'Cancel',
              weekLabel: 'W',
              customRangeLabel: 'Custom Range',
              daysOfWeek: moment.weekdaysMin(),
              monthNames: moment.monthsShort(),
              firstDay: moment.localeData().firstDayOfWeek()
          };
  
          this.callback = function() { };
  
          //some state information
          this.isShowing = false;
          this.leftCalendar = {};
          this.rightCalendar = {};
  
          this.preventSelections = false;
          //custom options from user
          if (typeof options !== 'object' || options === null)
              options = {};
  
          //allow setting options with data attributes
          //data-api options will be overwritten with custom javascript options
          options = $.extend(this.element.data(), options);
          error_nodata = "No data available for the range selected. Please select again."
  
          //html template for the picker UI
          if (typeof options.template !== 'string')
              options.template = '<div id= "dropDown_' + options.id + '" div class="qlik-daterangepicker dropdown-menu" style="display:none">' +
              '<div class="error_nodata" style="display:none">' + error_nodata + '</div>' +
                  '<div class="calendar dpleft">' +
                      '<div class="qlik-daterangepicker_input">' +
                        '<input class="input-mini" type="text" name="qlik-daterangepicker_start" value="" />' +
                        '<i class="lui-icon lui-icon--calendar"></i>' +
                        '<div class="calendar-time">' +
                          '<div></div>' +
                          '<i class="fa fa-clock-o glyphicon glyphicon-time"></i>' +
                        '</div>' +
                      '</div>' +
                      '<div class="calendar-table"></div>' +
                  '</div>' +
                  '<div class="calendar dpright">' +
                      '<div class="qlik-daterangepicker_input">' +
                        '<input class="input-mini" type="text" name="qlik-daterangepicker_end" value="" />' +
                        '<i class="lui-icon lui-icon--calendar"></i>' +
                        '<div class="calendar-time">' +
                          '<div></div>' +
                          '<i class="fa fa-clock-o glyphicon glyphicon-time"></i>' +
                        '</div>' +
                      '</div>' +
                      '<div class="calendar-table"></div>' +
                  '</div>' +
                  '<div class="ranges">' +
                      '<div class="range_inputs">' +
                          '<button class="applyBtn" disabled="disabled" type="button"></button> ' +
                          '<button class="cancelBtn" type="button"></button>' +
                      '</div>' +
                  '</div>' +
              '</div>';
  
          this.parentEl = (options.parentEl && $(options.parentEl).length) ? $(options.parentEl) : $(this.parentEl);
          
          this.container = $(options.template).appendTo(this.parentEl);
  
          //
          // handle all the possible options overriding defaults
          //
  
          if (typeof options.locale === 'object') {
  
              if (typeof options.locale.format === 'string')
                  this.locale.format = options.locale.format;
  
              if (typeof options.locale.separator === 'string')
                  this.locale.separator = options.locale.separator;
  
              if (typeof options.locale.daysOfWeek === 'object')
                  this.locale.daysOfWeek = options.locale.daysOfWeek.slice();
  
              if (typeof options.locale.monthNames === 'object')
                this.locale.monthNames = options.locale.monthNames.slice();
  
              if (typeof options.locale.firstDay === 'number')
                this.locale.firstDay = options.locale.firstDay;
  
              if (typeof options.locale.applyLabel === 'string')
                this.locale.applyLabel = options.locale.applyLabel;
  
              if (typeof options.locale.cancelLabel === 'string')
                this.locale.cancelLabel = options.locale.cancelLabel;
  
              if (typeof options.locale.weekLabel === 'string')
                this.locale.weekLabel = options.locale.weekLabel;
  
              if (typeof options.locale.customRangeLabel === 'string')
                this.locale.customRangeLabel = options.locale.customRangeLabel;
  
          }
  
          if (typeof options.startDate === 'string')
              this.startDate = moment(options.startDate, this.locale.format);
  
          if (typeof options.endDate === 'string')
              this.endDate = moment(options.endDate, this.locale.format);
  
          if (typeof options.minDate === 'string')
              this.minDate = moment(options.minDate, this.locale.format);
  
          if (typeof options.maxDate === 'string')
              this.maxDate = moment(options.maxDate, this.locale.format);
  
          if (typeof options.startDate === 'object')
              this.startDate = moment(options.startDate);
  
          if (typeof options.endDate === 'object')
              this.endDate = moment(options.endDate);
  
          if (typeof options.minDate === 'object')
              this.minDate = moment(options.minDate);
  
          if (typeof options.maxDate === 'object')
              this.maxDate = moment(options.maxDate);
  
          // sanity check for bad options
          if (this.minDate && this.startDate.isBefore(this.minDate))
              this.startDate = this.minDate.clone();
  
          // sanity check for bad options
          if (this.maxDate && this.endDate.isAfter(this.maxDate))
              this.endDate = this.maxDate.clone();
  
          if (typeof options.applyClass === 'string')
              this.applyClass = options.applyClass;
  
          if (typeof options.cancelClass === 'string')
              this.cancelClass = options.cancelClass;
  
          if (typeof options.dateLimit === 'object')
              this.dateLimit = options.dateLimit;
  
          if (typeof options.opens === 'string')
              this.opens = options.opens;

          if (typeof options.top === 'string')
              this.top = options.top;
  
          if (typeof options.drops === 'string')
              this.drops = options.drops;
  
          if (typeof options.showWeekNumbers === 'boolean')
              this.showWeekNumbers = options.showWeekNumbers;
  
          if (typeof options.buttonClasses === 'string')
              this.buttonClasses = options.buttonClasses;
  
          if (typeof options.buttonClasses === 'object')
              this.buttonClasses = options.buttonClasses.join(' ');
  
          if (typeof options.showDropdowns === 'boolean')
              this.showDropdowns = options.showDropdowns;
  
          if (typeof options.singleDatePicker === 'boolean') {
              this.singleDatePicker = options.singleDatePicker;
              if (this.singleDatePicker)
                  this.endDate = this.startDate.clone();
          }
  
          if (typeof options.timePicker === 'boolean')
              this.timePicker = options.timePicker;
  
          if (typeof options.timePickerSeconds === 'boolean')
              this.timePickerSeconds = options.timePickerSeconds;
  
          if (typeof options.timePickerIncrement === 'number')
              this.timePickerIncrement = options.timePickerIncrement;
  
          if (typeof options.timePicker24Hour === 'boolean')
              this.timePicker24Hour = options.timePicker24Hour;
  
          if (typeof options.autoApply === 'boolean')
              this.autoApply = options.autoApply;
  
          if (typeof options.autoUpdateInput === 'boolean')
              this.autoUpdateInput = options.autoUpdateInput;
  
          if (typeof options.linkedCalendars === 'boolean')
              this.linkedCalendars = options.linkedCalendars;
  
          if (typeof options.isInvalidDate === 'function')
              this.isInvalidDate = options.isInvalidDate;
          
          if (typeof options.getClass === 'function')
              this.getClass = options.getClass;
  
          if (typeof options.preventSelections === 'boolean')
              this.preventSelections = options.preventSelections;
  
          // update day names order to firstDay
          if (this.locale.firstDay != 0) {
              var iterator = this.locale.firstDay;
              while (iterator > 0) {
                  this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                  iterator--;
              }
          }
  
          var start, end, range;
  
          //if no start/end dates set, check if an input element contains initial values
          if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
              if ($(this.element).is('input[type=text]')) {
                  var val = $(this.element).val(),
                      split = val.split(this.locale.separator);
  
                  start = end = null;
  
                  if (split.length == 2) {
                      start = moment(split[0], this.locale.format);
                      end = moment(split[1], this.locale.format);
                  } else if (this.singleDatePicker && val !== "") {
                      start = moment(val, this.locale.format);
                      end = moment(val, this.locale.format);
                  }
                  if (start !== null && end !== null) {
                      this.setStartDate(start);
                      this.setEndDate(end);
                  }
              }
          }
  
          if (typeof options.ranges === 'object') {
              for (range in options.ranges) {
  
                  if (typeof options.ranges[range][0] === 'string')
                      start = moment(options.ranges[range][0], this.locale.format);
                  else
                      start = moment(options.ranges[range][0]);
  
                  if (typeof options.ranges[range][1] === 'string')
                      end = moment(options.ranges[range][1], this.locale.format);
                  else
                      end = moment(options.ranges[range][1]);
  
                  // If the start or end date exceed those allowed by the minDate or dateLimit
                  // options, shorten the range to the allowable period.
                  if (this.minDate && start.isBefore(this.minDate))
                      start = this.minDate.clone();
  
                  var maxDate = this.maxDate;
                  if (this.dateLimit && start.clone().add(this.dateLimit).isAfter(maxDate))
                      maxDate = start.clone().add(this.dateLimit);
                  if (maxDate && end.isAfter(maxDate))
                      end = maxDate.clone();
  
                  // If the end of the range is before the minimum or the start of the range is
                  // after the maximum, disable this range option .
                  var disabled = (this.minDate && end.isBefore(this.minDate)) || (maxDate && start.isAfter(maxDate));

                  var elem = document.createElement('textarea');
                  elem.innerHTML = range;
                  var rangeHtml = elem.value;
  
                  this.ranges[rangeHtml] = [start, end, disabled];
              }
  
              var list = '<div class="header"></div><ul>';
              for (range in this.ranges) {
                  list += this.ranges[range][2] ? '<li class="disabled">' :'<li>';
                  list += range + '</li>';
              }
              list += '<li>' + this.locale.customRangeLabel + '</li>';
              list += '</ul>';
              this.container.find('.ranges').prepend(list);
          }
  
          if (typeof cb === 'function') {
              this.callback = cb;
          }
  
          if (!this.timePicker) {
              this.startDate = this.startDate.startOf('day');
              this.endDate = this.endDate.endOf('day');
              this.container.find('.calendar-time').hide();
          }
  
          //can't be used together for now
          if (this.timePicker && this.autoApply)
              this.autoApply = false;
  
          if (this.autoApply && typeof options.ranges !== 'object') {
              this.container.find('.ranges').hide();
          } else if (this.autoApply) {
              this.container.find('.applyBtn, .cancelBtn').addClass('hide');
          }
  
          if (this.singleDatePicker) {
              this.container.addClass('single');
              this.container.find('.calendar.dpleft').addClass('single');
              this.container.find('.calendar.dpleft').show();
              this.container.find('.calendar.dpright').hide();
              this.container.find('.qlik-daterangepicker_input input, .qlik-daterangepicker_input i').hide();
              if (!this.timePicker) {
                  this.container.find('.ranges').hide();
              }
          }
  
          if (typeof options.ranges === 'undefined' && !this.singleDatePicker) {
              this.container.addClass('show-calendar');
          }
  
          this.container.addClass('opens' + this.opens);
  
          if (this.isQlikCloud()) {
          //swap the position of the predefined ranges if opens right
            if (typeof options.ranges !== 'undefined' && this.opens == 'right') {
                var ranges = this.container.find('.ranges');
                var html = ranges.clone();
                ranges.remove();
                this.container.find('.calendar.dpleft').parent().prepend(html);
            }
          }
  
          //apply CSS classes and labels to buttons
          this.container.find('.applyBtn, .cancelBtn').addClass(this.buttonClasses);
          if (this.applyClass.length)
              this.container.find('.applyBtn').addClass(this.applyClass);
          if (this.cancelClass.length)
              this.container.find('.cancelBtn').addClass(this.cancelClass);
          this.container.find('.applyBtn').html(this.locale.applyLabel);
          this.container.find('.cancelBtn').html(this.locale.cancelLabel);
  
          //
          // event listeners
          //
          this.container.find('.calendar')
              .on('click.qlik-daterangepicker', '.prev.available', $.proxy(this.clickPrev, this))
              .on('click.qlik-daterangepicker', '.next.available', $.proxy(this.clickNext, this))
              .on('click.qlik-daterangepicker', 'td.available', $.proxy(this.clickDate, this))
              .on('mouseenter.qlik-daterangepicker', 'td.available', $.proxy(this.hoverDate, this))
              .on('mouseleave.qlik-daterangepicker', 'td.available', $.proxy(this.updateFormInputs, this))
              .on('change.qlik-daterangepicker', 'select.yearselect', $.proxy(this.monthOrYearChanged, this))
              .on('change.qlik-daterangepicker', 'select.monthselect', $.proxy(this.monthOrYearChanged, this))
              .on('change.qlik-daterangepicker', 'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect', $.proxy(this.timeChanged, this))
              .on('click.qlik-daterangepicker', '.qlik-daterangepicker_input input', $.proxy(this.showCalendars, this))
              //.on('keyup.qlik-daterangepicker', '.qlik-daterangepicker_input input', $.proxy(this.formInputsChanged, this))
              .on('change.qlik-daterangepicker', '.qlik-daterangepicker_input input', $.proxy(this.formInputsChanged, this));
  
          this.container.find('.ranges')
              .on('click.qlik-daterangepicker', 'button.applyBtn', $.proxy(this.clickApply, this))
              .on('click.qlik-daterangepicker', 'button.cancelBtn', $.proxy(this.clickCancel, this))
              .on('click.qlik-daterangepicker', 'li', $.proxy(this.clickRange, this))
              .on('mouseenter.qlik-daterangepicker', 'li', $.proxy(this.hoverRange, this))
              .on('mouseleave.qlik-daterangepicker', 'li', $.proxy(this.updateFormInputs, this));
  
          if (this.element.is('input')) {
              this.element.on({
                  'click.qlik-daterangepicker': $.proxy(this.show, this),
                  'focus.qlik-daterangepicker': $.proxy(this.show, this),
                  'keyup.qlik-daterangepicker': $.proxy(this.elementChanged, this),
                  'keydown.qlik-daterangepicker': $.proxy(this.keydown, this)
              });
          } else {
              this.element.on('click.qlik-daterangepicker', $.proxy(this.toggle, this));
          }
  
          //
          // if attached to a text input, set the initial value
          //
  
          if (this.element.is('input') && !this.singleDatePicker && this.autoUpdateInput) {
              this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
              this.element.trigger('change');
          } else if (this.element.is('input') && this.autoUpdateInput) {
              this.element.val(this.startDate.format(this.locale.format));
              this.element.trigger('change');
          }
  
      };
  
      DateRangePicker.prototype = {
  
          constructor: DateRangePicker,
    
          setStartDate: function(startDate) {
              if (typeof startDate === 'string')
                  this.startDate = moment(startDate, this.locale.format);
  
              if (typeof startDate === 'object')
                  this.startDate = moment(startDate);
  
              if (!this.timePicker)
                  this.startDate = this.startDate.startOf('day');
  
              if (this.timePicker && this.timePickerIncrement)
                  this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
  
              if (this.minDate && this.startDate.isBefore(this.minDate))
                  this.startDate = this.minDate;
  
              if (this.maxDate && this.startDate.isAfter(this.maxDate))
                  this.startDate = this.maxDate;
  
              if (!this.isShowing)
                  this.updateElement();
  
              this.container.addClass('in-selection');
              this.updateMonthsInView();
          },
  
          setEndDate: function(endDate) {
              if (typeof endDate === 'string')
                  this.endDate = moment(endDate, this.locale.format);
  
              if (typeof endDate === 'object')
                  this.endDate = moment(endDate);
  
              if (!this.timePicker)
                  this.endDate = this.endDate.endOf('day');
  
              if (this.timePicker && this.timePickerIncrement)
                  this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
  
              if (this.endDate.isBefore(this.startDate))
                  this.endDate = this.startDate.clone();
  
              if (this.maxDate.endOf('day') && this.endDate.isAfter(this.maxDate))
                  this.endDate = this.maxDate;
  
              if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate))
                  this.endDate = this.startDate.clone().add(this.dateLimit);
  
              if (!this.isShowing)
                  this.updateElement();
                  
              this.updateMonthsInView();
          },
  
          isInvalidDate: function() {
              return false;
          },
  
          updateView: function() {
              if (this.timePicker) {
                  this.renderTimePicker('left');
                  this.renderTimePicker('right');
                  if (!this.endDate) {
                      this.container.find('.dpright .calendar-time select').attr('disabled', 'disabled').addClass('disabled');
                  } else {
                      this.container.find('.dpright .calendar-time select').removeAttr('disabled').removeClass('disabled');
                  }
              }
              this.container.find('.calendar.active').removeClass('active');
                  
              if (this.endDate) {
                  this.container.find('input[name=qlik-daterangepicker_start]').closest('.calendar').addClass('active');
              } else {
                  this.container.find('input[name=qlik-daterangepicker_end]').closest('.calendar').addClass('active');
              }
              this.updateMonthsInView();
              this.updateCalendars();
              this.updateFormInputs();
          },
  
  
          updateMonthsInView: function() {
              if (this.endDate) {
  
                  //if both dates are visible already, do nothing
                  if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
                      (this.startDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.startDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))
                      &&
                      (this.endDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.endDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))
                      ) {
                      return;
                  }
  
                  this.leftCalendar.month = this.startDate.clone().date(2);
                  if (!this.linkedCalendars && (this.endDate.month() != this.startDate.month() || this.endDate.year() != this.startDate.year())) {
                      this.rightCalendar.month = this.endDate.clone().date(2);
                  } else {
                      this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                  }
                  
              } else {
                  if (this.leftCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM') && this.rightCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM')) {
                      this.leftCalendar.month = this.startDate.clone().date(2);
                      this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                  }
              }
          },
  
          updateCalendars: function() {
  
              if (this.timePicker) {
                  var hour, minute, second;
                  if (this.endDate) { 
                      hour = parseInt(this.container.find('.dpleft .hourselect').val(), 10);
                      minute = parseInt(this.container.find('.dpleft .minuteselect').val(), 10);
                      second = this.timePickerSeconds ? parseInt(this.container.find('.dpleft .secondselect').val(), 10) : 0;
                      if (!this.timePicker24Hour) {
                          var ampm = this.container.find('.dpleft .ampmselect').val();
                          if (ampm === 'PM' && hour < 12)
                              hour += 12;
                          if (ampm === 'AM' && hour === 12)
                              hour = 0;
                      }
                  } else {
                      hour = parseInt(this.container.find('.dpright .hourselect').val(), 10);
                      minute = parseInt(this.container.find('.dpright .minuteselect').val(), 10);
                      second = this.timePickerSeconds ? parseInt(this.container.find('.dpright .secondselect').val(), 10) : 0;
                      if (!this.timePicker24Hour) {
                          var ampm = this.container.find('.dpright .ampmselect').val();
                          if (ampm === 'PM' && hour < 12)
                              hour += 12;
                          if (ampm === 'AM' && hour === 12)
                              hour = 0;
                      }
                  }
                  this.leftCalendar.month.hour(hour).minute(minute).second(second);
                  this.rightCalendar.month.hour(hour).minute(minute).second(second);
              }
  
              this.renderCalendar('left');
              this.renderCalendar('right');
  
              // looks like we don't do anything with active ranges
              this.showCalendars();
          },

          isQlikCloud: function() {
            const qlikCloudRegEx = /\.(qlik-stage|qlikcloud)\.com/;
            const matcher = window.location.hostname.match(qlikCloudRegEx) || [];
            return matcher.length;
          },

          renderCalendar: function(side) {
              //
              // Build the matrix of dates that will populate the calendar
              //
              var calendar = side == 'left' ? this.leftCalendar : this.rightCalendar;
              var month = calendar.month.month();
              var year = calendar.month.year();
              var hour = calendar.month.hour();
              var minute = calendar.month.minute();
              var second = calendar.month.second();
              var daysInMonth = moment([year, month]).daysInMonth();
              var firstDay = moment([year, month, 1]);
              var lastDay = moment([year, month, daysInMonth]);
              var lastMonth = moment(firstDay).subtract(1, 'month').month();
              var lastYear = moment(firstDay).subtract(1, 'month').year();
              var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
              var dayOfWeek = firstDay.day();
              //initialize a 6 rows x 7 columns array for the calendar
              var calendar = [];
              calendar.firstDay = firstDay;
              calendar.lastDay = lastDay;
  
              for (var i = 0; i < 6; i++) {
                  calendar[i] = [];
              }
  
              //populate the calendar with date objects
              var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
              if (startDay > daysInLastMonth)
                  startDay -= 7;
  
              var curDate
              if (dayOfWeek == this.locale.firstDay){
                startDay = 1;
                curDate = moment([year, month, startDay, 12, minute, second]);
              } else {
                curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
              }
  
              var col, row;
              for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
                  if (i > 0 && col % 7 === 0) {
                      col = 0;
                      row++;
                  }
                  calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
                  curDate.hour(12);
  
                  if (this.minDate && calendar[row][col].format('YYYY-MM-DD') == this.minDate.format('YYYY-MM-DD') && calendar[row][col].isBefore(this.minDate)) {
                      calendar[row][col] = this.minDate.clone();
                  }
  
                  if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') == this.maxDate.format('YYYY-MM-DD') && calendar[row][col].isAfter(this.maxDate)) {
                      calendar[row][col] = this.maxDate.clone();
                  }
  
              }
  
              //make the calendar object available to hoverDate/clickDate
              if (side == 'left') {
                  this.leftCalendar.calendar = calendar;
              } else {
                  this.rightCalendar.calendar = calendar;
              }
  
              //
              // Display the calendar
              //
              var minDate = side == 'left' ? this.minDate : this.startDate;
              var maxDate = this.maxDate;
              var selected = side == 'left' ? this.startDate : this.endDate;
  
              var html = '<table class="table-condensed">';
              html += '<thead>';
              html += '<tr>';
  
              // add empty cell for week number
              if (this.showWeekNumbers)
                  html += '<th></th>';
  
              if ( (!this.linkedCalendars || side == 'left')) {
                  html += '<th class="prev ';
                  html += (!minDate || minDate.isBefore(calendar.firstDay)) ? 'available': 'disabled';
                  html += '"><button type="button" class="btn btn-default btn-xs" aria-label="Left Align"><i class="lui-icon lui-icon--previous lui-icon--small"></i></button></th>';
              } else {
                  html += '<th></th>';
              }
  
              var dateHtml = this.locale.monthNames[calendar[1][1].month()] + calendar[1][1].format(" YYYY");
  
              if (this.showDropdowns) {
                  var currentMonth = calendar[1][1].month();
                  var currentYear = calendar[1][1].year();
                  var maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
                  var minYear = (minDate && minDate.year()) || (currentYear - 50);
                  var inMinYear = currentYear == minYear;
                  var inMaxYear = currentYear == maxYear;
  
                  var monthHtml = '<select class="monthselect">';
                  for (var m = 0; m < 12; m++) {
                      if ((!inMinYear || m >= minDate.month()) && (!inMaxYear || m <= maxDate.month())) {
                          monthHtml += "<option value='" + m + "'" +
                              (m === currentMonth ? " selected='selected'" : "") +
                              ">" + this.locale.monthNames[m] + "</option>";
                      } else {
                          monthHtml += "<option value='" + m + "'" +
                              (m === currentMonth ? " selected='selected'" : "") +
                              " disabled='disabled'>" + this.locale.monthNames[m] + "</option>";
                      }
                  }
                  monthHtml += "</select>";
  
                  var yearHtml = '<select class="yearselect">';
                  for (var y = minYear; y <= maxYear; y++) {
                      yearHtml += '<option value="' + y + '"' +
                          (y === currentYear ? ' selected="selected"' : '') +
                          '>' + y + '</option>';
                  }
                  yearHtml += '</select>';
  
                  dateHtml = monthHtml + yearHtml;
              }
  
              html += '<th colspan="5" class="month">' + dateHtml + '</th>';
              if ((!this.linkedCalendars || side == 'right' || this.singleDatePicker)) {
                  html += '<th class="next ';
                  html += (!maxDate || maxDate.isAfter(calendar.lastDay))? 'available' : 'disabled';
                  html += '"><button type="button" class="btn btn-default btn-xs" aria-label="Left Align"><i class="lui-icon lui-icon--next lui-icon--small"></i></button></th>';
              } else {
                  html += '<th></th>';
              }
  
              html += '</tr>';
              html += '<tr>';
  
              // add week number label
              if (this.showWeekNumbers)
                  html += '<th class="week">' + this.locale.weekLabel + '</th>';
  
              $.each(this.locale.daysOfWeek, function(index, dayOfWeek) {
                  html += '<th>' + dayOfWeek + '</th>';
              });
  
              html += '</tr>';
              html += '</thead>';
              html += '<tbody>';
  
              //adjust maxDate to reflect the dateLimit setting in order to
              //grey out end dates beyond the dateLimit
              if (this.endDate == null && this.dateLimit) {
                  var maxLimit = this.startDate.clone().add(this.dateLimit).endOf('day');
                  if (!maxDate || maxLimit.isBefore(maxDate)) {
                      maxDate = maxLimit;
                  }
              }
  
              for (var row = 0; row < 6; row++) {
                  html += '<tr>';
  
                  // add week number
                  if (this.showWeekNumbers)
                      html += '<td class="week">' + calendar[row][0].week() + '</td>';
  
                  for (var col = 0; col < 7; col++) {
  
                      var classes = [];
                      //grey out the dates in other months displayed at beginning and end of this calendar
                      if (calendar[row][col].month() != calendar[1][1].month()){
                          classes.push('empty');
                      }else{
                          //highlight today's date
                          if (calendar[row][col].isSame(new Date(), "day"))
                              classes.push('today');
  
                          //highlight weekends
                          if (calendar[row][col].isoWeekday() > 5)
                              classes.push('weekend');
                      
                          //don't allow selection of dates before the minimum date
                          if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day'))
                              classes.push('off', 'disabled');
  
                          //don't allow selection of dates after the maximum date
                          if (maxDate && calendar[row][col].isAfter(maxDate, 'day'))
                              classes.push('off', 'disabled');
  
                          //don't allow selection of date if a custom function decides it's invalid
                          if (this.isInvalidDate(calendar[row][col]))
                              classes.push('off', 'disabled');
  
                          if(this.getClass)
                              classes.push(this.getClass(calendar[row][col]));
                              
                          //highlight the currently selected start date
                          if (calendar[row][col].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD'))
                              classes.push('active', 'start-date');
  
                          //highlight the currently selected end date
                          if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD'))
                              classes.push('active', 'end-date');
  
                      //highlight dates in-between the selected dates
                      //if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate)
                      //    classes.push('in-range');
                      }
                      var cname = '', disabled = false;
                      for (var i = 0; i < classes.length; i++) {
                          cname += classes[i] + ' ';
                          if ( this.isQlikCloud() ) {
                            if ( ['disabled','nodata','empty'].indexOf(classes[i]) > -1) {
                                disabled = true;
                            }
                          } else {
                            if ( ['disabled','empty'].indexOf(classes[i]) > -1) {
                                disabled = true;
                            }
                          }    
                      }
                      if (!disabled)
                          cname += 'available';
  
                      html += '<td class="' + cname.replace(/^\s+|\s+$/g, '') + '" data-title="' + 'r' + row + 'c' + col + '">' + calendar[row][col].date() + '</td>';
  
                  }
                  html += '</tr>';
              }
  
              html += '</tbody>';
              html += '</table>';
  
              this.container.find('.calendar.dp' + side + ' .calendar-table').html(html);
  
          },
  
          renderTimePicker: function(side) {
  
              var html, selected, minDate, maxDate = this.maxDate;
  
              if (this.dateLimit && (!this.maxDate || this.startDate.clone().add(this.dateLimit).isAfter(this.maxDate)))
                  maxDate = this.startDate.clone().add(this.dateLimit);
  
              if (side == 'left') {
                  selected = this.startDate.clone();
                  minDate = this.minDate;
              } else if (side == 'right') {
                  selected = this.endDate ? this.endDate.clone() : this.startDate.clone();
                  minDate = this.startDate;
              }
  
              //
              // hours
              //
  
              html = '<select class="hourselect">';
  
              var start = this.timePicker24Hour ? 0 : 1;
              var end = this.timePicker24Hour ? 23 : 12;
  
              for (var i = start; i <= end; i++) {
                  var i_in_24 = i;
                  if (!this.timePicker24Hour)
                      i_in_24 = selected.hour() >= 12 ? (i == 12 ? 12 : i + 12) : (i == 12 ? 0 : i);
  
                  var time = selected.clone().hour(i_in_24);
                  var disabled = false;
                  if (minDate && time.minute(59).isBefore(minDate))
                      disabled = true;
                  if (maxDate && time.minute(0).isAfter(maxDate))
                      disabled = true;
  
                  if (i_in_24 == selected.hour() && !disabled) {
                      html += '<option value="' + i + '" selected="selected">' + i + '</option>';
                  } else if (disabled) {
                      html += '<option value="' + i + '" disabled="disabled" class="disabled">' + i + '</option>';
                  } else {
                      html += '<option value="' + i + '">' + i + '</option>';
                  }
              }
  
              html += '</select> ';
  
              //
              // minutes
              //
  
              html += ': <select class="minuteselect">';
  
              for (var i = 0; i < 60; i += this.timePickerIncrement) {
                  var padded = i < 10 ? '0' + i : i;
                  var time = selected.clone().minute(i);
  
                  var disabled = false;
                  if (minDate && time.second(59).isBefore(minDate))
                      disabled = true;
                  if (maxDate && time.second(0).isAfter(maxDate))
                      disabled = true;
  
                  if (selected.minute() == i && !disabled) {
                      html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
                  } else if (disabled) {
                      html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
                  } else {
                      html += '<option value="' + i + '">' + padded + '</option>';
                  }
              }
  
              html += '</select> ';
  
              //
              // seconds
              //
  
              if (this.timePickerSeconds) {
                  html += ': <select class="secondselect">';
  
                  for (var i = 0; i < 60; i++) {
                      var padded = i < 10 ? '0' + i : i;
                      var time = selected.clone().second(i);
  
                      var disabled = false;
                      if (minDate && time.isBefore(minDate))
                          disabled = true;
                      if (maxDate && time.isAfter(maxDate))
                          disabled = true;
  
                      if (selected.second() == i && !disabled) {
                          html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
                      } else if (disabled) {
                          html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
                      } else {
                          html += '<option value="' + i + '">' + padded + '</option>';
                      }
                  }
  
                  html += '</select> ';
              }
  
              //
              // AM/PM
              //
  
              if (!this.timePicker24Hour) {
                  html += '<select class="ampmselect">';
  
                  var am_html = '';
                  var pm_html = '';
  
                  if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate))
                      am_html = ' disabled="disabled" class="disabled"';
  
                  if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate))
                      pm_html = ' disabled="disabled" class="disabled"';
  
                  if (selected.hour() >= 12) {
                      html += '<option value="AM"' + am_html + '>AM</option><option value="PM" selected="selected"' + pm_html + '>PM</option>';
                  } else {
                      html += '<option value="AM" selected="selected"' + am_html + '>AM</option><option value="PM"' + pm_html + '>PM</option>';
                  }
  
                  html += '</select>';
              }
  
              this.container.find('.calendar.dp' + side + ' .calendar-time div').html(html);
  
          },
  
          updateFormInputs: function() {
              //ignore mouse movements while an above-calendar text input has focus
              if (this.container.find('input[name=qlik-daterangepicker_start]').is(":focus") || this.container.find('input[name=qlik-daterangepicker_end]').is(":focus"))
                  return;
  
              this.container.find('input[name=qlik-daterangepicker_start]').val(this.startDate.format(this.locale.format));
  
              if (this.endDate?this.endDate._isValid:false){
                   this.container.find('input[name=qlik-daterangepicker_end]').val(this.endDate.format(this.locale.format));
              }
              else{
                   this.container.find('input[name=qlik-daterangepicker_end]').val("")
              }
              
  
              if (this.singleDatePicker || (this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate)))) {
                  this.container.find('button.applyBtn').removeAttr('disabled');
              } else {
                  this.container.find('button.applyBtn').attr('disabled', 'disabled');
              }
  
          },
  
          move: function() {
              var parentOffset = { top: 0, left: 0 },
                  containerTop;
              var parentRightEdge = $(window).width();
              if (!this.parentEl.is('body')) {
                  parentOffset = {
                      top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                      left: this.parentEl.offset().left - this.parentEl.scrollLeft()
                  };
                  parentRightEdge = this.parentEl[0].clientWidth + this.parentEl.offset().left;
              }
  
              if (this.drops == 'up')
                  containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
              else
                  containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
              this.container[this.drops == 'up' ? 'addClass' : 'removeClass']('dropup');
  
              if (this.opens == 'left') {
                  this.container.css({
                      top: containerTop,
                      right: parentRightEdge - this.element.offset().left - this.element.outerWidth(),
                      left: 'auto'
                  });
                  if (this.container.offset().left < 0) {
                      this.container.css({
                          right: 'auto',
                          left: 9
                      });
                  }
              } else if (this.opens == 'center') {
                  this.container.css({
                      top: containerTop,
                      left: this.element.offset().left - parentOffset.left + this.element.outerWidth() / 2
                              - this.container.outerWidth() / 2,
                      right: 'auto'
                  });
                  if (this.container.offset().left < 0) {
                      this.container.css({
                          right: 'auto',
                          left: 9
                      });
                  }
              } else {
                  this.container.css({
                      top: containerTop,
                      left: this.element.offset().left - parentOffset.left,
                      right: 'auto'
                  });
                  if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
                      this.container.css({
                          left: 'auto',
                          right: 0
                      });
                  }
              }
          },
  
          show: function(e) {
              if (this.isShowing) return;
              // Create a click proxy that is private to this instance of datepicker, for unbinding
              this._outsideClickProxy = $.proxy(function(e) { this.outsideClick(e); }, this);
  
              // Bind global datepicker mousedown for hiding and
              $(document)
                .on('mousedown.qlik-daterangepicker', this._outsideClickProxy)
                // also support mobile devices
                .on('touchend.qlik-daterangepicker', this._outsideClickProxy)
                // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
                .on('click.qlik-daterangepicker', '[data-toggle=dropdown]', this._outsideClickProxy)
                // and also close when focus changes to outside the picker (eg. tabbing between controls)
                .on('focusin.qlik-daterangepicker', this._outsideClickProxy);
  
              // Reposition the picker if the window is resized while it's open
             $(window).on('resize.qlik-daterangepicker', $.proxy(function(e) { this.move(e); }, this));
  
              this.oldStartDate = this.startDate.clone();
              this.oldEndDate = this.endDate.clone();
  
              this.updateView();
              this.container.show();
              this.move();
              this.element.trigger('show.qlik-daterangepicker', this);
              this.isShowing = true;
          },
  
          hide: function(e) {
              if (!this.isShowing) return;
  
              //incomplete date selection, revert to last values
              if (!this.endDate) {
                  this.startDate = this.oldStartDate.clone();
                  this.endDate = this.oldEndDate.clone();
              }
  
              //if a new date range was selected, invoke the user callback function
              //or if applyclicked
              if (this.applyClicked || (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate)))
                  this.callback(this.startDate, this.endDate, this.chosenLabel);
  
              //if picker is attached to a text input, update it
              this.updateElement();
  
              $(document).off('.qlik-daterangepicker');
              $(window).off('.qlik-daterangepicker');
              this.container.removeClass('in-selection');
              this.applyClicked = false;
              this.container.hide();
              this.element.trigger('hide.qlik-daterangepicker', this);
              this.isShowing = false;
          },
  
          toggle: function(e) {
             if (this.isShowing) {
                  this.hide();
              } else {
                  this.show();
              }
          },
  
          outsideClick: function(e) {
              var target = $(e.target);
              // if the page is clicked anywhere except within the daterangerpicker/button
              // itself then call this.hide()
              if (
                  // ie modal dialog fix
                  e.type == "focusin" ||
                  target.closest(this.element).length ||
                  target.closest(this.container).length ||
                  target.closest('.calendar-table').length
                  ) return;
              this.hide();
          },

          showCalendars: function() {
              this.container.addClass('show-calendar');
              this.move();
              this.element.trigger('showCalendar.qlik-daterangepicker', this);
          },
  
          hideCalendars: function() {
              this.container.removeClass('show-calendar');
              this.element.trigger('hideCalendar.qlik-daterangepicker', this);
          },
  
          hoverRange: function(e) {
              //ignore mouse movements while an above-calendar text input has focus
              if (this.container.find('input[name=qlik-daterangepicker_start]').is(":focus") || this.container.find('input[name=qlik-daterangepicker_end]').is(":focus"))
                  return;
  
              var label = e.target.innerHTML;
              if (label == this.locale.customRangeLabel) {
                  this.updateView();
              } else {
                  var dates = this.ranges[label];
                  this.container.find('input[name=qlik-daterangepicker_start]').val(dates[0].format(this.locale.format));
  
                  if (this.endDate) {
                      this.container.find('input[name=qlik-daterangepicker_end]').val(dates[1].format(this.locale.format));
                  }
              }
              
          },
  
          clickRange: function(e) {
              if (this.preventSelections) return;
  
              var label = e.target.innerHTML;
              this.chosenLabel = label;
              if (label == this.locale.customRangeLabel) {
                  this.showCalendars();
              } else {
                  var dates = this.ranges[label];
                  this.startDate = dates[0];
                  this.endDate = dates[1];
  
                  if (!this.timePicker) {
                      this.startDate.startOf('day');
                      this.endDate.endOf('day');
                  }
  
                  this.hideCalendars();
                  this.clickApply();
              }
          },
  
          clickPrev: function(e) {
              if (this.preventSelections) return;
              var cal = $(e.target).parents('.calendar');
              if (cal.hasClass('dpleft')) {
                  this.leftCalendar.month.subtract(1, 'month');
                  if (this.linkedCalendars)
                      this.rightCalendar.month.subtract(1, 'month');
              } else {
                  this.rightCalendar.month.subtract(1, 'month');
              }
              this.updateCalendars();
          },
  
          clickNext: function(e) {
              if (this.preventSelections) return;
  
              var cal = $(e.target).parents('.calendar');
              if (cal.hasClass('dpleft')) {
                  this.leftCalendar.month.add(1, 'month');
              } else {
                  this.rightCalendar.month.add(1, 'month');
                  if (this.linkedCalendars)
                      this.leftCalendar.month.add(1, 'month');
              }
              this.updateCalendars();
          },
  
          hoverDate: function(e) {
              //ignore mouse movements while an above-calendar text input has focus
              if (this.container.find('input[name=qlik-daterangepicker_start]').is(":focus") || this.container.find('input[name=qlik-daterangepicker_end]').is(":focus"))
                  return;
  
              //ignore dates that can't be selected
              if (!$(e.target).hasClass('available')) return;
  
              //have the text inputs above calendars reflect the date being hovered over
              var title = $(e.target).attr('data-title');
              var row = title.substr(1, 1);
              var col = title.substr(3, 1);
              var cal = $(e.target).parents('.calendar');
              var date = cal.hasClass('dpleft') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
  
              if (this.endDate) {
                  this.container.find('input[name=qlik-daterangepicker_start]').val(date.format(this.locale.format));
              } else {
                  this.container.find('input[name=qlik-daterangepicker_end]').val(date.format(this.locale.format));
              }
  
              //highlight the dates between the start date and the date being hovered as a potential end date
              var leftCalendar = this.leftCalendar;
              var rightCalendar = this.rightCalendar;
              var startDate = this.startDate;
              if (!this.endDate) {
                  this.container.find('.calendar td').each(function(index, el) {
  
                      //skip week numbers, only look at dates
                      if ($(el).hasClass('week')) return;
                      //skip empty cells
                      if ($(el).hasClass('empty')) return;
  
                      var title = $(el).attr('data-title');
                      var row = title.substr(1, 1);
                      var col = title.substr(3, 1);
                      var cal = $(el).parents('.calendar');
                      var dt = cal.hasClass('dpleft') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];
  
                      if (dt.isAfter(startDate) && dt.isBefore(date)) {
                          $(el).addClass('in-range');
                      } else {
                          $(el).removeClass('in-range');
                      }
  
                  });
              }
  
          },
  
          clickDate: function(e) {
              if (this.preventSelections) return;
              if (!$(e.target).hasClass('available')) return;
  
              var title = $(e.target).attr('data-title');
              var row = title.substr(1, 1);
              var col = title.substr(3, 1);
              var cal = $(e.target).parents('.calendar');
              var date = cal.hasClass('dpleft') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
  
              //
              // this function needs to do a few things:
              // * alternate between selecting a start and end date for the range,
              // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
              // * if autoapply is enabled, and an end date was chosen, apply the selection
              // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
              //
  
              if (this.endDate || date.isBefore(this.startDate)) {
                  if (this.timePicker) {
                      var hour = parseInt(this.container.find('.dpleft .hourselect').val(), 10);
                      if (!this.timePicker24Hour) {
                          var ampm = cal.find('.ampmselect').val();
                          if (ampm === 'PM' && hour < 12)
                              hour += 12;
                          if (ampm === 'AM' && hour === 12)
                              hour = 0;
                      }
                      var minute = parseInt(this.container.find('.dpleft .minuteselect').val(), 10);
                      var second = this.timePickerSeconds ? parseInt(this.container.find('.dpleft .secondselect').val(), 10) : 0;
                      date = date.clone().hour(hour).minute(minute).second(second);
                  }
                  this.endDate = null;
                  this.setStartDate(date.clone());
              } else {
                  if (this.timePicker) {
                      var hour = parseInt(this.container.find('.dpright .hourselect').val(), 10);
                      if (!this.timePicker24Hour) {
                          var ampm = this.container.find('.dpright .ampmselect').val();
                          if (ampm === 'PM' && hour < 12)
                              hour += 12;
                          if (ampm === 'AM' && hour === 12)
                              hour = 0;
                      }
                      var minute = parseInt(this.container.find('.dpright .minuteselect').val(), 10);
                      var second = this.timePickerSeconds ? parseInt(this.container.find('.dpright .secondselect').val(), 10) : 0;
                      date = date.clone().hour(hour).minute(minute).second(second);
                  }
                  this.setEndDate(date.clone());
                  if (this.autoApply) {
                    if (this.isQlikCloud()) {
                        this.clickApply()
                    } else {
                        this.clickApplyNoData(e);
                    }
                  }
              }
  
              if (this.singleDatePicker) {
                  this.setEndDate(this.startDate);
                  if (!this.timePicker) {
                    if (this.isQlikCloud()) {
                      this.clickApply()
                    } else {
                      this.clickApplyNoData(e);
                    }
                  }
                }
  
              this.updateView();  
          },
          
          clickApplyNoData: function(e) {
            if (this.container.find(".in-range").hasClass("stateO") || 
                this.container.find(".in-range").hasClass("stateA") || 
                this.container.find(".in-range").hasClass("stateX") || 
                this.container.find(".in-range").hasClass("stateS")) 
            {
                this.clickApply();                
            } else if (this.container.find(".start-date").hasClass("nodata")) {
                if ($(e.target).hasClass('nodata')) {                   
                    this.container.find(".error_nodata").css("display", "block");
                } else {
                    this.clickApply();
                }
            } else {
                this.clickApply();
            }
          },
  
          clickApply: function(e) {
              if (this.preventSelections) return;
              // set applyClicked to true so we know if 
              // startdate and enddate are selected or being set to default if nothing selected
              // or we hide the date picker when clicking outside to cancel
              this.applyClicked = true;
              this.hide();
              this.element.trigger('apply.qlik-daterangepicker', this);             
          },
  
          clickCancel: function(e) {
              if (this.preventSelections) return;
              this.startDate = this.oldStartDate;
              this.endDate = this.oldEndDate;
              this.hide();
              this.element.trigger('cancel.qlik-daterangepicker', this);
          },
  
          monthOrYearChanged: function(e) {
              var isLeft = $(e.target).closest('.calendar').hasClass('dpleft'),
                  leftOrRight = isLeft ? 'left' : 'right',
                  cal = this.container.find('.calendar.'+leftOrRight);
  
              // Month must be Number for new moment versions
              var month = parseInt(cal.find('.monthselect').val(), 10);
              var year = cal.find('.yearselect').val();
  
              if (!isLeft) {
                  if (year < this.startDate.year() || (year == this.startDate.year() && month < this.startDate.month())) {
                      month = this.startDate.month();
                      year = this.startDate.year();
                  }
              }
  
              if (this.minDate) {
                  if (year < this.minDate.year() || (year == this.minDate.year() && month < this.minDate.month())) {
                      month = this.minDate.month();
                      year = this.minDate.year();
                  }
              }
  
              if (this.maxDate) {
                  if (year > this.maxDate.year() || (year == this.maxDate.year() && month > this.maxDate.month())) {
                      month = this.maxDate.month();
                      year = this.maxDate.year();
                  }
              }
  
              if (isLeft) {
                  this.leftCalendar.month.month(month).year(year);
                  if (this.linkedCalendars)
                      this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
              } else {
                  this.rightCalendar.month.month(month).year(year);
                  if (this.linkedCalendars)
                      this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
              }
              this.updateCalendars();
          },
  
          timeChanged: function(e) {
  
              var cal = $(e.target).closest('.calendar'),
                  isLeft = cal.hasClass('dpleft');
  
              var hour = parseInt(cal.find('.hourselect').val(), 10);
              var minute = parseInt(cal.find('.minuteselect').val(), 10);
              var second = this.timePickerSeconds ? parseInt(cal.find('.secondselect').val(), 10) : 0;
  
              if (!this.timePicker24Hour) {
                  var ampm = cal.find('.ampmselect').val();
                  if (ampm === 'PM' && hour < 12)
                      hour += 12;
                  if (ampm === 'AM' && hour === 12)
                      hour = 0;
              }
  
              if (isLeft) {
                  var start = this.startDate.clone();
                  start.hour(hour);
                  start.minute(minute);
                  start.second(second);
                  this.setStartDate(start);
                  if (this.singleDatePicker) {
                      this.endDate = this.startDate.clone();
                  } else if (this.endDate && this.endDate.format('YYYY-MM-DD') == start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
                      this.setEndDate(start.clone());
                  }
              } else if (this.endDate) {
                  var end = this.endDate.clone();
                  end.hour(hour);
                  end.minute(minute);
                  end.second(second);
                  this.setEndDate(end);
              }
  
              //update the calendars so all clickable dates reflect the new time component
              this.updateCalendars();
  
              //update the form inputs above the calendars with the new time
              this.updateFormInputs();
  
              //re-render the time pickers because changing one selection can affect what's enabled in another
              this.renderTimePicker('left');
              this.renderTimePicker('right');
          },
  
          formInputsChanged: function(e) {
              var isRight = $(e.target).closest('.calendar').hasClass('dpright');
              var start = moment(this.container.find('input[name=qlik-daterangepicker_start]').val(), this.locale.format);
              var end = moment(this.container.find('input[name=qlik-daterangepicker_end]').val(), this.locale.format);
  
              if (start.isValid() && end.isValid()) {
  
                  if (isRight && end.isBefore(start))
                      start = end.clone();
  
                  this.setStartDate(start);
                  this.setEndDate(end);
  
                  if (isRight) {
                      this.container.find('input[name=qlik-daterangepicker_start]').val(this.startDate.format(this.locale.format));
                  } else {
                      this.container.find('input[name=qlik-daterangepicker_end]').val(this.endDate.format(this.locale.format));
                  }
  
              }
  
              this.updateCalendars();
              if (this.timePicker) {
                  this.renderTimePicker('left');
                  this.renderTimePicker('right');
              }
          },
  
          elementChanged: function() {
              if (!this.element.is('input')) return;
              if (!this.element.val().length) return;
              if (this.element.val().length < this.locale.format.length) return;
  
              var dateString = this.element.val().split(this.locale.separator),
                  start = null,
                  end = null;
  
              if (dateString.length === 2) {
                  start = moment(dateString[0], this.locale.format);
                  end = moment(dateString[1], this.locale.format);
              }
  
              if (this.singleDatePicker || start === null || end === null) {
                  start = moment(this.element.val(), this.locale.format);
                  end = start;
              }
  
              if (!start.isValid() || !end.isValid()) return;
  
              this.setStartDate(start);
              this.setEndDate(end);
              this.updateView();
          },
  
          keydown: function(e) {
              //hide on tab or enter
              if ((e.keyCode === 9) || (e.keyCode === 13)) {
                  this.hide();
              }
          },
  
          updateElement: function() {
              if (this.element.is('input') && !this.singleDatePicker && this.autoUpdateInput) {
                  this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                  this.element.trigger('change');
              } else if (this.element.is('input') && this.autoUpdateInput) {
                  this.element.val(this.startDate.format(this.locale.format));
                  this.element.trigger('change');
              }
          },
  
          remove: function() {
              this.container.remove();
              this.element.off('.qlik-daterangepicker');
              this.element.removeData();
          }
  
      };
  
      $.fn.qlikdaterangepicker = function(options, callback) {
          this.each(function() {
              var el = $(this);
              if (el.data('qlik-daterangepicker'))
                  el.data('qlik-daterangepicker').remove();
              el.data('qlik-daterangepicker', new DateRangePicker(el, options, callback));
          });
          return this;
      };
      
      return DateRangePicker;
  
  }));
  