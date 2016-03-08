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
                            Today:{
                                type: "string",  
                                ref: "props.today",
								label: "Today",
								defaultValue: "Today",
                                expression: "optional"
                            },
                            Yesterday:{
                                type: "string",  
                                ref: "props.yesterday",
								label: "Yesterday",
								defaultValue: "Yesterday",
                                expression: "optional"
                            },
                            LastDays:{
                                type: "string",  
                                ref: "props.lastXDays",
								label: "Last $ days",
								defaultValue: "Last $ days",
                                expression: "optional"
                            },
                            ThisMonth:{
                                type: "string",  
                                ref: "props.thisMonth",
								label: "This Month",
								defaultValue: "This Month",
                                expression: "optional"
                            },
                            LastMonth:{
                                type: "string",  
                                ref: "props.lastMonth",
								label: "Last Month",
								defaultValue: "Last Month",
                                expression: "optional"
                            }
                            
					}
				}
			}
		};
		return 	CalendarSettings;
})