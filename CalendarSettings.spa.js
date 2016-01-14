define([], function() {
		var CalendarSettings = {
			component: "expandable-items",
			label: "Calendar Settings",
			items: {
				CalendarSwitch: {
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
								defaultValue: "MMMM D, YYYY"
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
								defaultValue: "Click para seleccionar un rango"
							},
                            Today:{
                                type: "string",  
                                ref: "props.today",
								label: "Today",
								defaultValue: "Hoy"
                            },
                            Yesterday:{
                                type: "string",  
                                ref: "props.yesterday",
								label: "Yesterday",
								defaultValue: "Ayer"
                            },
                            LastDays:{
                                type: "string",  
                                ref: "props.lastXDays",
								label: "Last $ days",
								defaultValue: "Últimos $ días"
                            },
                            ThisMonth:{
                                type: "string",  
                                ref: "props.thisMonth",
								label: "This Month",
								defaultValue: "Mes Actual"
                            },
                            LastMonth:{
                                type: "string",  
                                ref: "props.lastMonth",
								label: "Last Month",
								defaultValue: "Mes Anterior"
                            }
                            
					}
				}
			}
		};
		return 	CalendarSettings;
})