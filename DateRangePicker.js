define(["qlik", "jquery", "./lib/moment.min", "./CalendarSettings", "css!./css/scoped-bootstrap.css", "css!./lib/daterangepicker.css", "./lib/daterangepicker"
],
    function (qlik, $, moment, CalendarSettings) {
        'use strict';
        return {
            initialProperties: {
                version: 1.0,
                qListObjectDef: {
                    qShowAlternatives: false,
                    qFrequencyMode: "V",
                    qSortCriterias: {
                        qSortByNumeric: 1,
                        qSortByState: 1
                    }
                },
                fixed: true,
                width: 25,
                percent: true,
                selectionMode: "CONFIRM"
            },
            definition: {
                type: "items",
                component: "accordion",
                items: {
                    dimension: {
                        type: "items",
                        label: "Dimensions",
                        ref: "qListObjectDef",
                        min: 1,
                        max: 1,
                        items: {
                            label: {
                                type: "string",
                                ref: "qListObjectDef.qDef.qFieldLabels.0",
                                label: "Label",
                                show: false
                            },
                            libraryId: {
                                type: "string",
                                component: "library-item",
                                libraryItemType: "dimension",
                                ref: "qListObjectDef.qLibraryId",
                                label: "Dimension",
                                show: function (data) {
                                    return data.qListObjectDef && data.qListObjectDef.qLibraryId;
                                }
                            },
                            field: {
                                type: "string",
                                expression: "always",
                                expressionType: "dimension",
                                ref: "qListObjectDef.qDef.qFieldDefs.0",
                                label: "Field",
                                show: function (data) {
                                    return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
                                }
                            },
                            qSortByState: {
                                type: "numeric",
                                component: "dropdown",
                                label: "Sort by State",
                                ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByState",
                                options: [{
                                    value: 1,
                                    label: "Ascending"
                                }, {
                                        value: 0,
                                        label: "No"
                                    }, {
                                        value: -1,
                                        label: "Descending"
                                    }],
                                show: false,
                                defaultValue: 1

                            },
                            qSortByNumeric: {
                                type: "numeric",
                                component: "dropdown",
                                label: "Sort by Numeric",
                                ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByNumeric",
                                options: [{
                                    value: 1,
                                    label: "Ascending"
                                }, {
                                        value: 0,
                                        label: "No"
                                    }, {
                                        value: -1,
                                        label: "Descending"
                                    }],
                                show: false,
                                defaultValue: 1
                            }
                        }
                    },
                    settings: {
                        uses: "settings"
                    },
                    CalSettings: CalendarSettings
                }
            },
            snapshot: {
                canTakeSnapshot: true
            },
            paint: function ($element, layout) {
                var html;
                var self = this;
                var dateRangeId = 'DateRangePicker' + layout.qInfo.qId;
                var parentElement = 'Container' + layout.qInfo.qId;
                var isFirstPaint = $element.children().attr("id") !== parentElement;
                var minDate = moment(layout.props.minDate,"MM/DD/YYYY");
                var maxDate = moment(layout.props.maxDate,"MM/DD/YYYY");
                var startDate = moment(layout.props.startDate,"MM/DD/YYYY");

                moment.locale(layout.props.locale);

                if (!isFirstPaint) {
                    $('#' + dateRangeId).remove();
                    $('#dropDown_' + layout.qInfo.qId).remove();
                }

                html = "";
                html += ' <div id ="' + parentElement + '">'
                html += '<div id="' + dateRangeId + '" class="bootstrap_inside pull-right" style="background: #fff; cursor: pointer; padding: 0px 0px; border: 0px solid #ccc; width: 100%; height 100%">'
                html += '   <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp'
                html += '  <span></span> <b class="caret"></b>'
                html += '</div>'
                html += '</div>'

                $element.html(html);

                var config = {
                    singleDatePicker: layout.props.isSingleDate,
                    "locale": {
                        "format": layout.props.format,
                        "separator": layout.props.separator
                    },
                    "parentEl": "#grid",
                    "autoUpdateInput": false,
                    "autoApply": true,
                    "id": layout.qInfo.qId
                };

                var rangesLiteral = {};
                
                if(minDate.isValid()){
                    config.minDate = minDate                 
                }
                
                if(maxDate.isValid()){
                  config.maxDate = maxDate
                }
                
                if(startDate.isValid()){
                  config.startDate = startDate
                }
               
                if (layout.props.CustomRangesEnabled) {
                    config.locale.customRangeLabel = layout.props.customRangeLabel;
                    config.ranges = rangesLiteral;
                    rangesLiteral[layout.props.today] = [moment(), moment()];
                    rangesLiteral[layout.props.yesterday] = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
                    rangesLiteral[layout.props.lastXDays.replace("$", "7")] = [moment().subtract(6, 'days'), moment()];
                    rangesLiteral[layout.props.lastXDays.replace("$", "30")] = [moment().subtract(29, 'days'), moment()];
                    rangesLiteral[layout.props.thisMonth] = [moment().startOf('month'), moment().endOf('month')];
                    rangesLiteral[layout.props.lastMonth] = [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];
                }

                $('#' + dateRangeId).daterangepicker(config,
                    function (start, end, label) {
                        if (start.isValid() && end.isValid()) {
                            SelectRange(start, end)
                        }
                    });

                UpdateText(null, null)

                checkSelections();

                function SelectRange(start, end) {
                    qlik.currApp().getAppLayout().then(function (x) {
                        var DateFormat = layout.qListObject.qDimensionInfo.qNumFormat.qFmt || x.qLocaleInfo.qDateFmt;

                        self.backendApi.search(">=" + start.format(DateFormat) + "<=" + end.format(DateFormat))
                            .then(
                                function (x) {
                                    self.backendApi.acceptSearch(false);
                                })
                    });

                };

                function checkSelections() {
                    var requestPage = [{
                        qTop: 0,
                        qLeft: 0,
                        qWidth: 2,
                        qHeight: layout.qListObject.qDimensionInfo.qStateCounts.qSelected
                    }];

                    while (layout.qListObject.qDataPages.length) {
                        layout.qListObject.qDataPages.pop();
                    }

                    if (layout.qListObject.qDimensionInfo.qStateCounts.qSelected > 0) {
                        self.backendApi.getData(requestPage).then(function (dataPages) {
                            var start = fromOADate(dataPages[0].qMatrix[0][0].qNum),
                                end = fromOADate(dataPages[0].qMatrix[dataPages[0].qMatrix.length - 1][0].qNum),
                                rows = dataPages[0].qMatrix.length;

                            UpdateText(start, end);

                            if (rows !== end.diff(start, 'days') + 1) {
                                $('#' + dateRangeId + ' span').html($('#' + dateRangeId + ' span').html() + ' [' + rows + ' / ' + (end.diff(start, 'days') + 1) + ']')
                            }
                        });
                    }

                };

                function UpdateText(start, end) {
                    var _dummy = {};
                    _dummy._i = "Invalid Date";

                    var _start = start || _dummy;
                    var _end = end || _dummy;
                    var _startDate = moment();
                    
                    if(startDate.isValid()){
                        _startDate = startDate;
                    }

                    if (_start._i.toString() !== 'Invalid Date' && _end._i.toString() !== 'Invalid Date') {

                        $('#' + dateRangeId).data('daterangepicker').setStartDate(start._i);
                        $('#' + dateRangeId).data('daterangepicker').setEndDate(end._i);

                        if (_start._i.toString() !== _end._i.toString()) {
                            $('#' + dateRangeId + ' span').html(start.locale(layout.props.locale).format(layout.props.format) + layout.props.separator + end.locale(layout.props.locale).format(layout.props.format));
                        }
                        else {
                            $('#' + dateRangeId + ' span').html(start.locale(layout.props.locale).format(layout.props.format));
                        }

                    }
                    else {
                        $('#' + dateRangeId).data('daterangepicker').setStartDate(_startDate);
                        $('#' + dateRangeId).data('daterangepicker').setEndDate(null);
                        $('#' + dateRangeId + ' span').html(layout.props.defaultText)
                    }
                };
       
                // from moment-msdate.js
                function fromOADate(msDate) {
                    var jO = new Date(((msDate - 25569) * 86400000));
                    var tz = jO.getTimezoneOffset();
                    jO = new Date(((msDate - 25569 + (tz / (60 * 24))) * 86400000));
                    return moment(jO);
                };

            }

        };

    });