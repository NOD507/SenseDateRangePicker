/**
 * @license
 * Copyright 2018 Nodier Torres. All rights reserved.
 * 
 * Copyrights licensed under the terms of the MIT license.
 * Original source <https://github.com/NOD507/SenseDateRangePicker>
 */
define(["qlik", "jquery", "./lib/moment.min", "./calendar-settings", "./lib/encoder", "css!./lib/daterangepicker.css", "./lib/daterangepicker" 
],
    function (qlik, $, moment, CalendarSettings, encoder) {
        'use strict';
        function createDate(num) {
            return moment((num - 25569) * 86400 * 1000).utc().format("YYYYMMDD").toString();
        }
        function createMoment(str, format) {
            if (isNaN(str)) {
                return moment.utc(str, format);
            }
            return moment.utc(createDate(str), 'YYYYMMDD');
        }
        function createRanges(props) {
            var ranges = {};
            var numberOf = props.numberOf;
            var includeCurrent = props.previousOrLast;
            ranges[props.today] = [moment().startOf('day'), moment().startOf('day')];
            ranges[props.yesterday] = [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').startOf('day')];
            ranges[props.lastXDays.replace("$", "7")] = [moment().subtract(6, 'days').startOf('day'), moment().startOf('day')];
            ranges[props.lastXDays.replace("$", "30")] = [moment().subtract(29, 'days').startOf('day'), moment().startOf('day')];
            if (props.this === "d") {
                ranges[props.thisLabel] = [moment().startOf('day'), moment().startOf('day')];
            } else if (props.this === "m") {
                ranges[props.thisLabel] = [moment().startOf('month').startOf('day'), moment().endOf('month').startOf('day')];
            } else if (props.this === "q") {
                ranges[props.thisLabel] = [moment().startOf('quarter').startOf('day'), moment().endOf('quarter').startOf('day')];
            } else if (props.this === "y") {
                ranges[props.thisLabel] = [moment().startOf('year').startOf('day'), moment().endOf('year').startOf('day')];
            }
            if(!includeCurrent) {
                if (props.last === "d") {
                    ranges[props.lastLabel] = [moment().subtract(numberOf, 'days').startOf('day'), moment().subtract(1, 'days').startOf('day')];
                } else if (props.last === "m") {
                    ranges[props.lastLabel] = [moment().subtract(numberOf, 'months').startOf('month').startOf('day'), moment().subtract(1, 'months').endOf('month').startOf('day')];
                } else if (props.last === "q") {
                    ranges[props.lastLabel] = [moment().subtract(numberOf,'quarters').startOf('quarter').startOf('day'), moment().subtract(1, 'quarters').endOf('quarter').startOf('day')];
                } else if (props.last === "y") {
                    ranges[props.lastLabel] = [moment().subtract(numberOf,'years').startOf('year').startOf('day'), moment().subtract(1,'years').endOf('year').startOf('day')];
                }
            } else {
                if (props.last === "d") {
                    ranges[props.lastLabel] = [moment().subtract(numberOf -1, 'days').startOf('day'), moment().startOf('day')];
                } else if (props.last === "m") {
                    ranges[props.lastLabel] = [moment().subtract(numberOf - 1, 'months').startOf('month').startOf('day'), moment().endOf('month').startOf('day')];
                } else if (props.last === "q") {
                    ranges[props.lastLabel] = [moment().subtract(numberOf -1,'quarters').startOf('quarter').startOf('day'), moment().endOf('quarter').startOf('day')];
                } else if (props.last === "y") {
                    ranges[props.lastLabel] = [moment().subtract(numberOf -1,'years').startOf('year').startOf('day'), moment().endOf('year').startOf('day')];
                }

            }          
            return ranges;
        }
        function createDateStates(pages) {
            var dateStates = {};
            pages.forEach(function (page) {
                page.qMatrix.forEach(function (row) {
                    var d = createDate(row[0].qNum);
                    dateStates[d] = row[0].qState;
                    //based on order numerically
                    if (row[0].qState === 'S') {                        
                        dateStates.rangeEnd = dateStates.rangeEnd || row[0].qNum;
                        dateStates.rangeStart = row[0].qNum;                        
                    }
                });
            });
            return dateStates;
        }
        function isEmpty(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }
        function createHtml(dateStates, DateFormat, props, sortAscending) {
            var html = '<div>', startRange, endRange;
            if( !isEmpty (dateStates) ) {                
                html += '<div class="bootstrap_inside pull-right show-range" >';
                html += '   <i class="lui-icon lui-icon--calendar"></i>&nbsp;<span>';
                if (dateStates.rangeStart) {
                    startRange = createMoment(dateStates.rangeStart).format(DateFormat);
                    endRange = (dateStates.rangeEnd && (dateStates.rangeEnd !== dateStates.rangeStart)) ? createMoment(dateStates.rangeEnd).format(DateFormat) : null;
                if( !sortAscending ) {
                    html += startRange;
                    if (endRange !== null) {
                        html += props.separator + endRange;
                    }
                } else {
                    if( endRange!== null) {
                        html += endRange + props.separator + startRange;
                    } else {
                        html += startRange;
                    }
                    }
                } else {
                html += encoder.encodeForHTML(props.defaultText);
                }
                html += '</span> <b class="lui-button__caret lui-caret"></b>';
                html += '</div>';               
            } else {
                html += '   <i class="lui-icon lui-icon--calendar"></i>&nbsp;&nbsp;&nbsp;<span>';
                html += 'Add Date Field' + '</span>';
            }
            html += '</div>';
            return html;
        }
        function getPosition( element ) {
            if (element.offset().left < 600) {
                return "right";
            }
            else if (element.offset().right < 600) {
                return "left";
            }
            else {
                "left";
            }
        }
        return {
            methods: { //for testability
                createDate: createDate,
                createMoment: createMoment,
                createRanges: createRanges,
                createDateStates: createDateStates,
                createHtml:createHtml
            },
            initialProperties: {
                version: 1.0,
                qListObjectDef: {
                    qDef: {
                        autoSort: false,
                        qSortCriterias: [
                            {qSortByNumeric: -1},
                            {qSortByState: 1},    
                        ],
                    },
                    qShowAlternatives: true,
                    qFrequencyMode: "V",
                    qInitialDataFetch: [{
                        qWidth: 1,
                        qHeight: 10000
                    }]
                },
                advanced: false
            },
            // Prevent conversion from and to this object
            exportProperties: null,
            importProperties: null,
            definition: CalendarSettings,
            support: {
                snapshot: false,
                export: false,
                exportData: false
            },
            paint: function ($element, layout) {
                var self = this;
                var interactionState = this._interactionState;
                var noSelections = this.options.noSelections === true;

                // old sort order was ascending, check to see if the object was created before the change
                // to calcuate the range start and end dates in the createDateStates
                var sortAscending = layout && layout.qListObject && layout.qListObject.qSortCriterias &&
                     layout.qListObject.qSortCriterias.qSortByNumeric == "1";

                function canInteract() {
                    return interactionState === 1;
                }

                function isQlikCloud(){
                    const qlikCloudRegEx = /\.(qlik-stage|qlikcloud)\.com/;
                    const matcher = window.location.hostname.match(qlikCloudRegEx) || [];
                    return matcher.length;
                }
                this.dateStates = createDateStates(layout.qListObject.qDataPages);
                if (!self.app) {
                    self.app = qlik.currApp(this);
                }

                var qlikDateFormat = layout.qListObject.qDimensionInfo.qNumFormat.qFmt
                    || self.app.model.layout.qLocaleInfo.qDateFmt;
                var outDateFormat = layout.props.format || qlikDateFormat;
                moment.locale(layout.props.locale);
                var minDate = createMoment(layout.props.minDate, qlikDateFormat);
                var maxDate = createMoment(layout.props.maxDate, qlikDateFormat);
                var startDate = createMoment(layout.props.startDate, qlikDateFormat);
                var endDate = createMoment(layout.props.endDate, qlikDateFormat);

                $('#dropDown_' + layout.qInfo.qId).remove();

                $element.html(createHtml(this.dateStates, outDateFormat, layout.props, sortAscending));

                var config = {
                    singleDatePicker: layout.props.isSingleDate,
                    preventSelections: noSelections,
                    "locale": {
                        "format": outDateFormat,
                        "separator": layout.props.separator
                    },
                    "parentEl": "#grid",
                    "autoUpdateInput": false,
                    "autoApply": true,
                    "opens": getPosition($element),
                    "id": layout.qInfo.qId,
                    getClass: function (date) {
                        var d = date.format('YYYYMMDD');
                        if (self.dateStates[d]) {
                            return 'state' + self.dateStates[d];
                        }
                        return 'nodata';
                    }
                };

                if (minDate.isValid()) {
                    config.minDate = minDate;
                }

                if (maxDate.isValid()) {
                    config.maxDate = maxDate;
                }

                if (startDate.isValid()) {
                    config.startDate = startDate;
                } else {
                    config.startDate = config.minDate;
                }

                if (endDate.isValid()) {
                    config.endDate = endDate;
                } else {
                    config.endDate = config.maxDate;
                }

                if (layout.props.CustomRangesEnabled) {
                    config.locale.customRangeLabel = layout.props.customRangeLabel;
                    config.ranges = createRanges(layout.props);
                }

                if (!isQlikCloud()) {
                   // alert('Not in Cloud')
                }
                if (canInteract()) {
                    $element.find('.show-range').qlikdaterangepicker(config, function (pickStart, pickEnd, label) {
                        if (!noSelections && pickStart.isValid() && pickEnd.isValid()) {
                            
                            var pickStartString, pickEndString,lastIndex, lowIndex, highIndex, qElemNumbers;                            
                            // The conversion to UTC below doesn't work correctly for Timestamp, 
                            // so checking the format which is '###0' for timestamps and doing different conversion formats.
                            if (qlikDateFormat.indexOf('#') === -1) { 
                                //To support various time zones, converting dates to a UTC format so they can be compared correctly.
                                pickStartString = moment.utc(pickStart.format("YYYYMMDD").toString(), "YYYYMMDD").format(qlikDateFormat),
                                pickEndString = moment.utc(pickEnd.format("YYYYMMDD").toString(), "YYYYMMDD").format(qlikDateFormat),
                                pickStart = createMoment(pickStartString, qlikDateFormat),
                                pickEnd = createMoment(pickEndString, qlikDateFormat);
                            } else {
                                // Handling timestamp case separately
                                pickStart = moment.utc(pickStart.format("YYYYMMDD").toString(), "YYYYMMDD"),
                                pickEnd = moment.utc(pickEnd.format("YYYYMMDD").toString(), "YYYYMMDD");
                            }                            
                            var dateBinarySearch = function(seachDate, lowIndex, highIndex) {
                                if (lowIndex === highIndex) {
                                    return lowIndex;
                                }
                                var middleIndex = lowIndex + Math.ceil((highIndex - lowIndex) / 2);                                
                                var middleDate = createMoment(
                                    layout.qListObject.qDataPages[0].qMatrix[middleIndex][0].qText,
                                    qlikDateFormat);    
                                // If the date object is created prior to September 2019, the order 
                                //of dates shall be ascending and needs to be handled separately
                                if (sortAscending) {
                                   if (seachDate.isBefore(middleDate)) {
                                       return dateBinarySearch(seachDate, lowIndex, middleIndex - 1); 
                                    }
                                } 
                                // From September 2019, The matrix stores the dates from latest to earliest, so if the
                                // sought date is after the middle date, pick the lower index span
                                else {                   
                                   if (seachDate.isAfter(middleDate)) {
                                       return dateBinarySearch(seachDate, lowIndex, middleIndex - 1);
                                   }
                                }
                                return dateBinarySearch(seachDate, middleIndex, highIndex);
                            };
                            if (sortAscending) {
                                lastIndex = layout.qListObject.qDataPages[0].qMatrix.length - 1;
                                // Elements are stored in ascending order, so pick out index of start first
                                lowIndex = dateBinarySearch(pickStart, 0, lastIndex);
                                // Index of end is guaranteed to be >= index of start
                                highIndex = dateBinarySearch(pickEnd, lowIndex, lastIndex);
                                qElemNumbers = layout.qListObject.qDataPages[0].qMatrix
                                .slice(lowIndex, highIndex + 1).map(function (fieldValue) {
                                    return fieldValue[0].qElemNumber;
                                });                            
                            } else {
                                lastIndex = layout.qListObject.qDataPages[0].qMatrix.length - 1;
                                // Elements are stored in reverse order, so pick out index of end first
                                lowIndex = dateBinarySearch(pickEnd, 0, lastIndex);
                                // Index of start is guaranteed to be >= index of end
                                highIndex = dateBinarySearch(pickStart, lowIndex, lastIndex);
                                qElemNumbers = layout.qListObject.qDataPages[0].qMatrix
                                .slice(lowIndex, highIndex + 1).map(function (fieldValue) {
                                    var date = createMoment(fieldValue[0].qText, qlikDateFormat);                                    
                                    if(date.isSame(pickEnd) || date.isSame(pickStart)) {
                                            return fieldValue[0].qElemNumber;
                                    } else if(date.isBefore(pickEnd) && date.isAfter(pickStart)) {
                                        return fieldValue[0].qElemNumber;
                                    } else {
                                        return -1;
                                    }                                                             
                                });
                            }
                            self.backendApi.selectValues(0, qElemNumbers, false);
                        }
                    });
                }
            }
        };
    });