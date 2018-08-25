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
                            label: "Calendario de una fecha",
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
                        CustomRangesSwitch:{
                            type: "boolean",
                            component: "switch",
                            label: "Activar rangos",
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
								defaultValue: "es"
                            },
                           Format:{
		                        type: "string",  
                                ref: "props.format",
								label: "Format",
								defaultValue: "DD/MM/YYYY"
                            },
                            Separator:{
		                        type: "string",  
                                ref: "props.separator",
								label: "Separator",
								defaultValue: " - "
                            },
                            CustomRange:{
		                        type: "string",  
                                ref: "props.customRangeLabel",
								label: "Custom Range",
								defaultValue: "Rango"
                            },
						    defaultText: {
								type: "string",  
                                ref: "props.defaultText",
								label: "Default Text",
								defaultValue: "Seleccione un rango"
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
                                                defaultValue: "Hoy",
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
                                                defaultValue: "Ayer",
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
                                                defaultValue: "Últimos $ días",
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
                                                defaultValue: "Mes Actual",
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
                                                defaultValue: "Mes Anterior",
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
                                                defaultValue: "Trimestre Actual",
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
                                                defaultValue: "Trimestre Anterior",
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
                                                defaultValue: "Año Actual",
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
                                                defaultValue: "Año Anterior",
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
                                                defaultValue: "Trimestre Hasta Ahora",
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
                                                defaultValue: "Año Hasta Ahora",
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
                                                defaultValue: "Rodando 12 Meses",
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
                                                defaultValue: "Rodando 12 Meses Completos",
                                                expression: "optional"
                                            }
                                        }
                                    }
                                },
                            }
                                                        
					}
				},
				header2: {
					type: "items",
					label: "Miscellaneous",
					items: {
                            DateSelectionStatus:{
		                        type: "boolean",
                                component: "switch",
                                label: "Mostrar detalles de selección",
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
                                label: "Mostrar rangos inválidos y gritarlos",
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
                                label: "Desactivar campos de fecha de entrada",
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