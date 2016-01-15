define(["qlik", "jquery", "./lib/moment.min", "./properties","./CalendarSettings", "css!./css/scoped-bootstrap.css", "css!./lib/daterangepicker.css", "./lib/daterangepicker"
],
    function (qlik, $, moment, props,CalendarSettings) {
        var isFirstPaint = true,
         isSingleDate,lang,format,separator,rangeLabel,
         today,yesterday,last7,last30,thisMonth,lastMonth;
         
        return {  
            //definition: props,
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
                var dateRangeId = 'DateRangePicker'+layout.qInfo.qId;
                var parentElement = 'Container' +layout.qInfo.qId;
                   
                if (isFirstPaint || isSingleDate !== layout.props.isSingleDate || lang !== layout.props.locale || format !== layout.props.format || separator !== layout.props.separator || 
                    rangeLabel !== layout.props.customRangeLabel || today !== layout.props.today || yesterday !== layout.props.yesterday ||  last7 !== layout.props.lastXDays.replace("$","7") ||
                    last30 !== layout.props.lastXDays.replace("$","30") || thisMonth !== layout.props.thisMonth || lastMonth !== layout.props.lastMonth
                     ) 
                  {
                        
                    isSingleDate = layout.props.isSingleDate;
                    lang = layout.props.locale;
                    format = layout.props.format;
                    separator = layout.props.separator; 
                    rangeLabel = layout.props.customRangeLabel;
                    today = layout.props.today;
                    yesterday = layout.props.yesterday;
                    last7 = layout.props.lastXDays.replace("$","7");
                    last30 = layout.props.lastXDays.replace("$","30");
                    thisMonth = layout.props.thisMonth;
                    lastMonth = layout.props.lastMonth;
                    moment.locale(lang);
                    
                    if(!isFirstPaint){ 
                        $('#'+dateRangeId).remove();
                    }
                   html = "";
                   html +=' <div id ="' + parentElement +'">'
                   html +='<div id="'+ dateRangeId +'" class="bootstrap_inside pull-right" style="background: #fff; cursor: pointer; padding: 0px 0px; border: 0px solid #ccc; width: 100%"; height 100%>'
                   html +='   <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp'
                   html +='  <span></span> <b class="caret"></b>'
                   html +='</div>'
                   html +='</div>'
                   
                   $element.html(html);
                   
                   var rangesLiteral = {};
                   
                   rangesLiteral[today] = [moment(), moment()];
                   rangesLiteral[yesterday] =[moment().subtract(1, 'days'), moment().subtract(1, 'days')];
                   rangesLiteral[last7] = [moment().subtract(6, 'days'), moment()];
                   rangesLiteral[last30] = [moment().subtract(29, 'days'), moment()];
                   rangesLiteral[thisMonth] = [moment().startOf('month'), moment().endOf('month')];          
                   rangesLiteral[lastMonth] = [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];


                    $('#' + dateRangeId).daterangepicker({
                        singleDatePicker: isSingleDate,
                        ranges: rangesLiteral,
                        "locale": {
                            "format": format,
                            "separator": separator,                          
                            "customRangeLabel": rangeLabel
                        },
                        "parentEl": parentElement,
                        "autoUpdateInput": false,
                        "autoApply": true

                    }, function (start, end, label) {

                        if (start.isValid() && end.isValid()) {
                            SelectRange(start, end)
                        }
                    });
                }
            
               checkSelections();
                

                function SelectRange(start, end) {
                    self.backendApi.search(">=" + start.format(layout.qListObject.qDimensionInfo.qNumFormat.qFmt) + "<=" + end.format(layout.qListObject.qDimensionInfo.qNumFormat.qFmt))
                        .then(
                            function (x) {
                                self.backendApi.acceptSearch(false);
                            })
                };

                function checkSelections() {
                    var requestPage = [{
                        qTop: 0,
                        qLeft: 0,
                        qWidth: 2, 
                        qHeight: layout.qListObject.qDimensionInfo.qStateCounts.qSelected
                    }];                    
                                
                    layout.qListObject.qDataPages.pop();

                    self.backendApi.getData(requestPage).then(function (dataPages) {
                        var _start, _end;  
                        var datesMap = dataPages[0].qMatrix.map(
                            function (x) {
                                return x[0].qNum;
                            }
                            );
                         var isRange = datesMap.every(function (element, index, array) {
                                var _isRange = true;
                                if (index > 0) {
                                    _isRange = element === array[index - 1] + 1;
                                }

                                return _isRange;
                            });
           
                        if (isRange && datesMap.length > 0){
                            _start = fromOADate(dataPages[0].qMatrix[0][0].qNum);
                            _end =  fromOADate(dataPages[0].qMatrix[datesMap.length - 1][0].qNum);
                        }
                                                     
                        UpdateText(_start, _end);
                    });

                };

                function UpdateText(start, end) {
                    var _dummy = {};
                    _dummy._i = "Invalid Date";

                    var _start = start || _dummy;
                    var _end = end || _dummy;

                    if (_start._i.toString() !== 'Invalid Date' && _end._i.toString() !== 'Invalid Date') {

                        $('#' + dateRangeId).data('daterangepicker').setStartDate(start._i);
                        $('#' + dateRangeId).data('daterangepicker').setEndDate(end._i);
                        
                        if(_start._i.toString() !== _end._i.toString()){
                            $('#' + dateRangeId + ' span').html(start.locale(lang).format(format) + separator + end.locale(lang).format(format));
                        }
                        else{
                            $('#' + dateRangeId + ' span').html(start.locale(lang).format(format));
                        }
                        
                    }
                    else {
                        $('#' + dateRangeId).data('daterangepicker').setStartDate(moment());
                        $('#' + dateRangeId).data('daterangepicker').setEndDate(null);
                        $('#' + dateRangeId + ' span').html(layout.props.defaultText)
                    }
                };
       
                // from moment-msdate.js
                function fromOADate(msDate) {
                    var jO = new Date(((msDate - 25569) * 86400000));
                    var tz = jO.getTimezoneOffset();
                    var jO = new Date(((msDate - 25569 + (tz / (60 * 24))) * 86400000));
                    return moment(jO);
                };

                isFirstPaint = false;
            }



        };

    });