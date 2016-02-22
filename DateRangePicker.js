define(["qlik", "jquery", "./lib/moment.min","./CalendarSettings", "css!./css/scoped-bootstrap.css", "css!./lib/daterangepicker.css", "./lib/daterangepicker"
],
    function (qlik, $, moment,CalendarSettings) {
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
						qSortByState:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by State",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByState",
							options : [{
								value : 1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : -1,
								label : "Descending"
							}],
                            show: false,
							defaultValue : 1
							
						},
						qSortByNumeric:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by Numeric",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByNumeric",
							options : [{
								value : 1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : -1,
								label : "Descending"
							}],
                            show: false,
							defaultValue : 1							
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
                var isFirstPaint = $element.children().attr("id") !== parentElement;
   window.self = this;        
   window.layout = layout;     
                moment.locale(layout.props.locale);
                    
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
              
                var config = {
                        singleDatePicker: layout.props.isSingleDate,                        
                        "locale": {
                            "format": layout.props.format,
                            "separator": layout.props.separator
                        },
                        "parentEl": parentElement,
                        "autoUpdateInput": false,
                        "autoApply": true
                 };
                    
                 var rangesLiteral = {};
                 if(layout.props.CustomRangesEnabled){                  
                       config.locale.customRangeLabel = layout.props.customRangeLabel;
                       config.ranges = rangesLiteral;
                       rangesLiteral[layout.props.today] = [moment(), moment()];
                       rangesLiteral[layout.props.yesterday] =[moment().subtract(1, 'days'), moment().subtract(1, 'days')];
                       rangesLiteral[layout.props.lastXDays.replace("$","7")] = [moment().subtract(6, 'days'), moment()];
                       rangesLiteral[layout.props.lastXDays.replace("$","30")] = [moment().subtract(29, 'days'), moment()];
                       rangesLiteral[layout.props.thisMonth] = [moment().startOf('month'), moment().endOf('month')];          
                       rangesLiteral[layout.props.lastMonth] = [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];
                  }

                  $('#' + dateRangeId).daterangepicker(config,
                   function (start, end, label) {
                       if (start.isValid() && end.isValid()) {
                            SelectRange(start, end)
                        }
                   });
                
            
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

                     while ( layout.qListObject.qDataPages.length) {
                         layout.qListObject.qDataPages.pop();
                    }
       
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
                            $('#' + dateRangeId + ' span').html(start.locale(layout.props.locale).format(layout.props.format) + layout.props.separator + end.locale(layout.props.local).format(layout.props.format));
                        }
                        else{
                            $('#' + dateRangeId + ' span').html(start.locale(layout.props.locale).format(layout.props.format));
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
                        jO = new Date(((msDate - 25569 + (tz / (60 * 24))) * 86400000));
                    return moment(jO);
                };
                


            }



        };

    });