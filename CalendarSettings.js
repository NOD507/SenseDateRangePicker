define([], function() {
		var CalendarSettings = {
			component: "expandable-items",
			label: "Calendar Settings",
			items: {
                Options: {
                    type: "items",
                    label: "Options",
                    items:{
                        SingleDateSwitch: {
                            type: "boolean",
                            component: "switch",
                            label: "Single date Switch",
                            ref: "props.isSingleDate",
                            options: [{
                                value: true,
                                translation: "properties.on"
                            }, {
                                value: false,
                                translation: "properties.off"
                            }],
                            defaultValue: false
					    },
                        minDate:  {
                            ref: "props.minDate",
                            label: "min Date MM/DD/YYYY",
                            type: "string",
                            expression: "optional"
                        },
                        maxDate: {
                            ref: "props.maxDate",
                            label: "max Date MM/DD/YYYY",
                            type: "string",
                            expression: "optional"
                        },
                        startDate: {
                            ref: "props.startDate",
                            label: "start Date MM/DD/YYYY",
                            type: "string",
                            expression: "optional"
                        },
                        CustomRangesSwitch:{
                            type: "boolean",
                            component: "switch",
                            label: "Ranges Switch",
                            ref: "props.CustomRangesEnabled",
                            options: [{
                                value: true,
                                translation: "properties.on"
                            }, {
                                value: false,
                                translation: "properties.off"
                            }],
                            defaultValue: true
                            
                        }
                        
                    }                    
                },
				header1: {
					type: "items",
					label: "Language and labels",
					items: {
                            Language:{
		                        type: "string",  
                                ref: "props.locale",
								label: "Locale",
								defaultValue: "en",
                                expression: "optional"
                            },
                           Format:{
		                        type: "string",  
                                ref: "props.format",
								label: "Format",
								defaultValue: "DD/MM/YYYY",
                                expression: "optional"
                            },
                            Separator:{
		                        type: "string",  
                                ref: "props.separator",
								label: "Separator",
								defaultValue: " - ",
                                expression: "optional"
                            },
                            CustomRange:{
		                        type: "string",  
                                ref: "props.customRangeLabel",
								label: "Custom Range",
								defaultValue: "Range",
                                expression: "optional"
                            },
						    defaultText: {
								type: "string",  
                                ref: "props.defaultText",
								label: "Default Text",
                                expression: "optional",
								defaultValue: "Select date range"
                            },
                            Ranges:{
                                label: "Ranges",
                                component: "expandable-items",
                                items:{
                                    Today:{
                                        type:"items",
                                        label: "Today",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableToday",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.today",
                                                label: "Label",
                                                defaultValue: "Today",
                                                expression: "optional"
                                            }
                                        }
                                    },
                                    Yesterday:{
                                        type:"items",
                                        label: "Yesterday",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableYesterday",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.yesterday",
                                                label: "Yesterday",
                                                defaultValue: "Yesterday",
                                                expression: "optional"
                                            }
                                        }
                                    },
                                    LastXDays:{
                                        type:"items",
                                        label: "Last X Days",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableLastXDays",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.lastXDays",
                                                label: "Last $ days",
                                                defaultValue: "Last $ days",
                                                expression: "optional"
                                            }
                                        }
                                    },
                                    ThisMonth:{
                                        type:"items",
                                        label: "This Month",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableThisMonth",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.thisMonth",
                                                label: "This Month",
                                                defaultValue: "This Month",
                                                expression: "optional"
                                            }
                                        }
                                    },
                                    LastMonth:{
                                        type:"items",
                                        label: "Last Month",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableLastMonth",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.lastMonth",
                                                label: "Last Month",
                                                defaultValue: "Last Month",
                                                expression: "optional"
                                            }
                                        }
                                    },
                                    CurrentQuarter:{
                                        type:"items",
                                        label: "Current Quarter",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableCurrentQuarter",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.currentQuarter",
                                                label: "Current Quarter",
                                                defaultValue: "Current Quarter",
                                                expression: "optional"
                                            }
                                        }
                                    },
                                    LastQuarter:{
                                        type:"items",
                                        label: "Last Quarter",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableLastQuarter",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.lastQuarter",
                                                label: "Last Quarter",
                                                defaultValue: "Last Quarter",
                                                expression: "optional"
                                            }
                                        }
                                    },
                                    CurrentYear:{
                                        type:"items",
                                        label: "Current Year",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableCurrentYear",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.currentYear",
                                                label: "Current Year",
                                                defaultValue: "Current Year",
                                                expression: "optional"
                                            }
                                        }
                                    },
                                    LastYear:{
                                        type:"items",
                                        label: "Last Year",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableLastYear",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.lastYear",
                                                label: "Last Year",
                                                defaultValue: "Last Year",
                                                expression: "optional"
                                            }
                                        }
                                    },
                                    QuarterToDate:{
                                        type:"items",
                                        label: "Quarter To Date",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableQuarterToDate",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.quarterToDate",
                                                label: "Quarter To Date",
                                                defaultValue: "Quarter To Date",
                                                expression: "optional"
                                            }
                                        }
                                    },
                                    YearToDate:{
                                        type:"items",
                                        label: "Year To Date",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableYearToDate",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.yearToDate",
                                                label: "Year To Date",
                                                defaultValue: "Year To Date",
                                                expression: "optional"
                                            }
                                        }
                                    },
                                    Rolling12Months:{
                                        type:"items",
                                        label: "Rolling 12 Months",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableRolling12Months",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.rolling12Months",
                                                label: "Rolling 12 Months",
                                                defaultValue: "Rolling 12 Months",
                                                expression: "optional"
                                            }
                                        }
                                    },
                                    Rolling12MonthsFull:{
                                        type:"items",
                                        label: "Rolling 12 Months Full",
                                        items: {
                                            EnableRange: {
                                                type: "boolean",
                                                component: "switch",
                                                label: "Show",
                                                ref: "props.enableRolling12MonthsFull",
                                                options: [{
                                                    value: true,
                                                    translation: "properties.on"
                                                }, {
                                                    value: false,
                                                    translation: "properties.off"
                                                }],
                                                defaultValue: true
                                            },
                                            Text: {
                                                type: "string",  
                                                ref: "props.rolling12MonthsFull",
                                                label: "Rolling 12 Months Full",
                                                defaultValue: "Rolling 12 Months Full",
                                                expression: "optional"
                                            }
                                        }
                                    }
                                },
                            },
					}
				},
				header2: {
					type: "items",
					label: "Miscellaneous",
					items: {
                            DateSelectionStatus: {
		                        type: "boolean",
                                component: "switch",
                                label: "Show Selections Details",
                                ref: "props.isSelectionDetailsEnabled",
                                options: [{
                                    value: true,
                                    translation: "properties.on"
                                }, {
                                    value: false,
                                    translation: "properties.off"
                                }],
                                defaultValue: true
                            },
                            ShowInvalidRanges: {
		                        type: "boolean",
                                component: "switch",
                                label: "Show Invalid Ranges and Grey them out",
                                ref: "props.showInvalidRanges",
                                options: [{
                                    value: true,
                                    translation: "properties.on"
                                }, {
                                    value: false,
                                    translation: "properties.off"
                                }],
                                defaultValue: false
                            },
                            DisableDateInputFields: {
		                        type: "boolean",
                                component: "switch",
                                label: "Disable date input fields",
                                ref: "props.disableDateInputFields",
                                options: [{
                                    value: true,
                                    translation: "properties.on"
                                }, {
                                    value: false,
                                    translation: "properties.off"
                                }],
                                defaultValue: false
                            },
                        
                    }
                }
			}
		};
		return 	CalendarSettings;
})