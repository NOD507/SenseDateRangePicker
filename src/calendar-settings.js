define(["qlik"], function (qlik) {
    var fieldList, fieldListPromise, CalendarSettings;   

    function getPromise() {
            fieldListPromise = qlik.currApp().createGenericObject({
                qFieldListDef: {
                    qType: 'variable'
                }
            }).then(function (reply) {
                fieldList = reply.layout.qFieldList.qItems.filter(function (item) {
                    return item.qTags && item.qTags.indexOf('$date') > -1;
                }).map(function (item) {
                    return {
                        value: item.qName,
                        label: item.qName
                    };
                });
                return fieldList;
            });
        return fieldListPromise;
    }
    function isQlikCloud(){
        const qlikCloudRegEx = /\.(qlik-stage|qlikcloud)\.com/;
        const matcher = window.location.hostname.match(qlikCloudRegEx) || [];
        return matcher.length;
    }

    var dimension = {
        type: "items",
        label: "Field",
        min: 1,
        max: 1,
        items: {
            field: {
                type: "string",
                ref: "qListObjectDef.qDef.qFieldDefs.0",
                label: "Date field",
                component: 'dropdown',
                options: function () {                    
                    return getPromise();
                },
                show: function (data) {
                    return !data.advanced;
                },
                change: function (data) {
                    var field = data.qListObjectDef.qDef.qFieldDefs[0];
                    data.props.minDate = { qStringExpression: '=Min( {1} [' + field + '])' };
                    data.props.maxDate = { qStringExpression: '=Max( {1} [' + field + '])' };
                    data.props.startDate = { qStringExpression: '=Min([' + field + '])' };
                    data.props.endDate = { qStringExpression: '=Max([' + field + '])' };
                }
            },
            fieldAdvanced: {
                type: "string",
                ref: "qListObjectDef.qDef.qFieldDefs.0",
                label: "Date field",
                expression: "always",
                expressionType: "dimension",
                show: function (data) {
                    return data.advanced;
                }
            },
            SingleDateSwitch: {
                type: "boolean",
                component: "switch",
                label: "Single date / interval",
                ref: "props.isSingleDate",
                options: [{
                    value: true,
                    label: "Single date"
                }, {
                    value: false,
                    label: "Date interval"
                }],
                defaultValue: false
            },
            advanced: {
                type: "boolean",
                component: "switch",
                label: "Advanced setup",
                ref: "advanced",
                options: [{
                    value: true,
                    translation: "properties.on"
                }, {
                    value: false,
                    translation: "properties.off"
                }],
                defaultValue: false,
                show: function (data) {
                    return data.qListObjectDef.qDef.qFieldDefs.length > 0 &&
                    data.qListObjectDef.qDef.qFieldDefs[0].length > 0;
                }
            },
            minDate: {
                ref: "props.minDate",
                label: "Min date",
                type: "string",
                expression: "optional",
                show: function (data) {
                    return data.advanced;
                }
            },
            maxDate: {
                ref: "props.maxDate",
                label: "Max date",
                type: "string",
                expression: "optional",
                show: function (data) {
                    return data.advanced;
                }
            },
            startDate: {
                ref: "props.startDate",
                label: "Start date",
                type: "string",
                expression: "optional",
                show: function (data) {
                    return data.advanced;
                }
            },
            endDate: {
                ref: "props.endDate",
                label: "End date",
                type: "string",
                expression: "optional",
                show: function (data) {
                    return data.advanced;
                }
            }
        }
    };
    // This creates a divider in the property panel without showing any warnings
    var divider = {
        type: 'items',
        grouped: true,
        items: { divider: { type: 'items' } },
  };
  if( !isQlikCloud() ) {
    CalendarSettings = {
        component: "expandable-items",
        label: "Calendar Settings",
        items: {
            ranges: {
                type: "items",
                label: "Predefined ranges",
                grouped: true,
                items: {
                    showPredefinedRanges: {
                        type: 'items',
                        items: {
                            CustomRangesSwitch: {
                                type: "boolean",
                                component: "switch",
                                label: "Show predefined ranges",
                                ref: "props.CustomRangesEnabled",
                                options: [{
                                    value: true,
                                    translation: "properties.on"
                                }, {
                                    value: false,
                                    translation: "properties.off"
                                }],
                                defaultValue: true
                            },
                            CustomRange: {
                            type: "string",
                            ref: "props.customRangeLabel",
                            label: "Custom Range",
                            defaultValue: "Range",
                            expression: "optional",
                            show: function (data) {
                                return data.props.CustomRangesEnabled;
                            }
                            },
                            Today: {
                            type: "string",
                            ref: "props.today",
                            label: "Today",
                            defaultValue: "Today",
                            expression: "optional",
                            show: function (data) {
                                return data.props.CustomRangesEnabled;
                            }
                            },                    
                            Yesterday: {
                            type: "string",
                            ref: "props.yesterday",
                            label: "Yesterday",
                            defaultValue: "Yesterday",
                            expression: "optional",
                            show: function (data) {
                                return data.props.CustomRangesEnabled;
                            }
                            },
                            LastDays: {
                            type: "string",
                            ref: "props.lastXDays",
                            label: "Last $ days",
                            defaultValue: "Last $ days",
                            expression: "optional",
                            show: function (data) {
                                return data.props.CustomRangesEnabled;
                            }
                            },
                        },
                    },
                    showCustomRangeThis: {
                        type: 'items',
                        items: {        
                            ThisMonthDropDown: {
                            type: "string",                        
                            ref: "props.this",
                            label: "This",                        
                            component: "dropdown", 
                            defaultValue: 'm',                                           
                            show: function (data) {
                                return data.props.CustomRangesEnabled;
                            },
                            change: function (data) {                                    
                                if (data.props.this === 'd') {
                                    data.props.thisLabel = "This Day";
                                } else if(data.props.this === 'm') {
                                    data.props.thisLabel = "This Month";
                                } else if(data.props.this === 'q') {
                                    data.props.thisLabel = "This Quarter";
                                } else if(data.props.this === 'y') {
                                    data.props.thisLabel = "This Year";
                                } else if(data.props.this === 'n') {
                                    data.props.thisLabel = "";
                                }
                            },
                            options: [{
                                value: 'd',
                                label: 'Day'
                            }, {
                                value: 'm',
                                label: 'Month'
                            }, {
                                value: 'q',
                                label: 'Quarter'
                            }, {
                                value: 'y',
                                label: 'Year'
                            },{
                                value: 'n',
                                label: 'None'
                            }],
                            },
                            ThisMonth: {
                                type: "string",
                                ref: "props.thisLabel",
                                defaultValue: "This Month",
                                expression: 'optional',
                                show: function (data) {
                                    return data.props.CustomRangesEnabled;
                                },
                                change: function (data) {                                    
                                    if (data.props.this === 'd' && data.props.thisLabel === '') {
                                        data.props.thisLabel = "This Day";
                                    } else if(data.props.this === 'm' && data.props.thisLabel === '') {
                                        data.props.thisLabel = "This Month";
                                    } else if(data.props.this === 'q' && data.props.thisLabel === '') {
                                        data.props.thisLabel = "This Quarter";
                                    } else if(data.props.this === 'y' && data.props.thisLabel === '') {
                                        data.props.thisLabel = "This Year";
                                    } else if(data.props.this === 'n') {
                                        data.props.thisLabel = "";
                                    }
                                },                               
                            },
                        },
                    },
                    showCustomRangeLast: {
                        type: 'items',
                        items: {     
                            LastMonthDropDown: {
                            type: "string",                        
                            ref: "props.last",
                            label: "Last",
                            component: "dropdown",
                            defaultValue: 'm',                                               
                            show: function (data) {
                                return data.props.CustomRangesEnabled;
                            },
                            change: function (data) {                                    
                                if (data.props.last === 'd') {
                                    data.props.lastLabel = "Last Day";
                                } else if(data.props.last === 'm') {
                                    data.props.lastLabel = "Last Month";
                                } else if(data.props.last === 'q') {
                                    data.props.lastLabel = "Last Quarter";
                                } else if(data.props.last === 'y') {
                                    data.props.lastLabel = "Last Year";
                                } else if(data.props.last === 'n') {
                                    data.props.lastLabel = "";
                                }
                            },
                            options: [{
                                value: 'd',
                                label: 'Day'
                            }, {
                                value: 'm',
                                label: 'Month'
                            }, {
                                value: 'q',
                                label: 'Quarter'
                            }, {
                                value: 'y',
                                label: 'Year'
                            },{
                                value: 'n',
                                label: 'None'
                            }],
                            },
                            LastMonth: {
                                type: "string",
                                ref: "props.lastLabel",
                                defaultValue: "Last Month",
                                expression: 'optional',
                                show: function (data) {
                                    return data.props.CustomRangesEnabled;
                                },
                                change: function (data) {                                    
                                    if (data.props.last === 'd' && data.props.lastLabel === '') {
                                        data.props.lastLabel = "Last Day";
                                    } else if(data.props.last === 'm' && data.props.lastLabel === '') {
                                        data.props.lastLabel = "Last Month";
                                    } else if(data.props.last === 'q' && data.props.lastLabel === '') {
                                        data.props.lastLabel = "Last Quarter";
                                    } else if(data.props.last === 'y' && data.props.lastLabel === '') {
                                        data.props.lastLabel = "Last Year";
                                    } else if(data.props.last === 'n') {
                                        data.props.lastLabel = "";
                                    }
                                },
                            },
                            numberOf: {
                                type: 'number',
                                ref: 'props.numberOf',
                                label: 'Last number of', 
                                defaultValue: 1,
                                show: function (data) {
                                    return data.props.CustomRangesEnabled && ['d','m','q','y'].indexOf(data.props.last) > -1;
                                }
                            },                        
                            previousOrLastValues: {
                            ref: 'props.previousOrLast',
                            type: 'boolean',
                            label: 'Include current',
                            component: 'checkbox',
                            defaultValue: false,
                            show: function (data) {
                                return data.props.CustomRangesEnabled && ['d','m','q','y'].indexOf(data.props.last) > -1;
                            }   
                            },
                        },
                    },  
                },
            },
            header1: {
                type: "items",
                label: "Language and labels",
                items: {
                    Language: {
                        type: "string",
                        ref: "props.locale",
                        label: "Locale",
                        defaultValue: "en",
                        expression: "optional"
                    },
                    Format: {
                        type: "string",
                        ref: "props.format",
                        label: "Format",
                        defaultValue: "YYYY-MM-DD",
                        expression: "optional"
                    },
                    Separator: {
                        type: "string",
                        ref: "props.separator",
                        label: "Separator",
                        defaultValue: " - ",
                        expression: "optional"
                    },
                    defaultText: {
                        type: "string",
                        ref: "props.defaultText",
                        label: "Default Text",
                        expression: "optional",
                        defaultValue: "Select date range"
                    }
                }
            }
        }
    };
  } else {
    CalendarSettings = {
        component: "expandable-items",
        label: "Calendar Settings",
        items: {
            ranges: {
                type: "items",
                label: "Predefined ranges",
                items: {
                    CustomRangesSwitch: {
                        type: "boolean",
                        component: "switch",
                        label: "Show predefined ranges",
                        ref: "props.CustomRangesEnabled",
                        options: [{
                            value: true,
                            translation: "properties.on"
                        }, {
                            value: false,
                            translation: "properties.off"
                        }],
                        defaultValue: true
                    },
                    CustomRange: {
                        type: "string",
                        ref: "props.customRangeLabel",
                        label: "Custom Range",
                        defaultValue: "Range",
                        expression: "optional",
                        show: function (data) {
                            return data.props.CustomRangesEnabled;
                        }
                    },
                    Today: {
                        type: "string",
                        ref: "props.today",
                        label: "Today",
                        defaultValue: "Today",
                        expression: "optional",
                        show: function (data) {
                            return data.props.CustomRangesEnabled;
                        }
                    },
                    Yesterday: {
                        type: "string",
                        ref: "props.yesterday",
                        label: "Yesterday",
                        defaultValue: "Yesterday",
                        expression: "optional",
                        show: function (data) {
                            return data.props.CustomRangesEnabled;
                        }
                    },
                    LastDays: {
                        type: "string",
                        ref: "props.lastXDays",
                        label: "Last $ days",
                        defaultValue: "Last $ days",
                        expression: "optional",
                        show: function (data) {
                            return data.props.CustomRangesEnabled;
                        }
                    },
                    ThisMonth: {
                        type: "string",
                        ref: "props.thisMonth",
                        label: "This Month",
                        defaultValue: "This Month",
                        expression: "optional",
                        show: function (data) {
                            return data.props.CustomRangesEnabled;
                        }
                    },
                    LastMonth: {
                        type: "string",
                        ref: "props.lastMonth",
                        label: "Last Month",
                        defaultValue: "Last Month",
                        expression: "optional",
                        show: function (data) {
                            return data.props.CustomRangesEnabled;
                        }
                    }
                }
            },
            header1: {
                type: "items",
                label: "Language and labels",
                items: {
                    Language: {
                        type: "string",
                        ref: "props.locale",
                        label: "Locale",
                        defaultValue: "en",
                        expression: "optional"
                    },
                    Format: {
                        type: "string",
                        ref: "props.format",
                        label: "Format",
                        defaultValue: "YYYY-MM-DD",
                        expression: "optional"
                    },
                    Separator: {
                        type: "string",
                        ref: "props.separator",
                        label: "Separator",
                        defaultValue: " - ",
                        expression: "optional"
                    },
                    defaultText: {
                        type: "string",
                        ref: "props.defaultText",
                        label: "Default Text",
                        expression: "optional",
                        defaultValue: "Select date range"
                    }
                }
            }
        }
    };
   }
    var about = {
		label: "About",
		component: "items",
		items: {
			header: {
				label: 'Date picker',
				style: 'header',
				component: 'text'
			},
			paragraph1: {
				label: 'A calendar object that allows a user to make selections in a date field.',
				component: 'text'
            },
            paragraph2: {
				label: 'Date picker is based upon an extension created by Nodier Torres.',
				component: 'text'
			}
		}
    };
    var appearance = {
		uses: "settings",
		items: {
			general: {
				items: {
					details: {
						show: false
					}
				}
			},
		}
	};
    return {
        type: "items",
        component: "accordion",
        items: {
            dimension: dimension,
            settings: appearance,
            CalSettings: CalendarSettings,
            about: about
        }
    }
})