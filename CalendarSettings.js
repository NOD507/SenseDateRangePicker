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
								defaultValue: "en"
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
								defaultValue: "Range"
                            },
						    defaultText: {
								type: "string",  
                                ref: "props.defaultText",
								label: "Default Text",
								defaultValue: "Select date range"
							},
                            Today:{
                                type: "string",  
                                ref: "props.today",
								label: "Today",
								defaultValue: "Today"
                            },
                            Yesterday:{
                                type: "string",  
                                ref: "props.yesterday",
								label: "Yesterday",
								defaultValue: "Yesterday"
                            },
                            LastDays:{
                                type: "string",  
                                ref: "props.lastXDays",
								label: "Last $ days",
								defaultValue: "Last $ days"
                            },
                            ThisMonth:{
                                type: "string",  
                                ref: "props.thisMonth",
								label: "This Month",
								defaultValue: "This Month"
                            },
                            LastMonth:{
                                type: "string",  
                                ref: "props.lastMonth",
								label: "Last Month",
								defaultValue: "Last Month"
                            }
                            
					}
				}
			}
		};
		return 	CalendarSettings;
})