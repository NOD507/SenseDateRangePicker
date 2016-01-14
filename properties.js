define( [], function () {
    'use strict';

    // *****************************************************************************
    // Dimensions & Measures
    // *****************************************************************************
    var dimensions = {
        uses: "dimensions",
        min: 1,
        max: 1
    };


    // *****************************************************************************
    // Appearance Section
    // *****************************************************************************
    var appearanceSection = {
        uses: "settings"
    };

    // *****************************************************************************
    // Main property panel definition
    // ~~
    // Only what's defined here will be returned from properties.js
    // *****************************************************************************

    return {

        initialProperties: {
            qListObjectDef: {
                qShowAlternatives: false,
                qFrequencyMode: "V",
                qInitialDataFetch: [{
                    qWidth: 2,
                    qHeight: 50
                }]
            },
        },
        type: "items",
        component: "accordion",
        items: {
            // dimensions: dimensions,
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
							show: true
						},
						libraryId: {
							type: "string",
							component: "library-item",
							libraryItemType: "dimension",
							ref: "qListObjectDef.qLibraryId",
							label: "Dimension",
							show: function ( data ) {
								return data.qListObjectDef && data.qListObjectDef.qLibraryId;
							}
						},
						field: {
							type: "string",
							expression: "always",
							expressionType: "dimension",
							ref: "qListObjectDef.qDef.qFieldDefs.0",
							label: "Field",
							show: function ( data ) {
								return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
							}
						},
						frequency: {
							type: "string",
							component: "dropdown",
							label: "Frequency mode",
							ref: "qListObjectDef.qFrequencyMode",
							options: [{
								value: "N",
								label: "No frequency"
							}, {
								value: "V",
								label: "Absolute value"
							}, {
								value: "P",
								label: "Percent"
							}, {
								value: "R",
								label: "Relative"
							}],
							defaultValue: "V"
						}
					}
				},
            appearance: appearanceSection

        }
    };

});