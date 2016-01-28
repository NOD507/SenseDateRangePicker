# SenseDateRangePicker
A date range picker extension for qliksense

Based on http://www.daterangepicker.com/

Can be turned into a single date picker in the Calendar Settings.
Also at Calendar Settings can choose all language locales that moment.js supports.


![preview](https://raw.githubusercontent.com/NOD507/SenseDateRangePicker/master/dateRangePicker.gif) 

#### 1.0.5
 * Fixed: Clear qDataPages in checkSelections
 
#### 1.0.4
 * Check date format in app layout if there is no data at layout.qListObject.qDimensionInfo.qNumFormat.qFmt
 
#### 1.0.3
 * Fixed firstPaint check
 
#### 1.0.2
 * Fixed variable conflict with multiple instances of the extension.

#### 1.0.1
* Fixed range check: Using qElemNumber only worked if the dates where loaded ordered. -> now the data is ordered and validated with qNum
* Start date not clearing if there was no date to select.

Still works better with a date field with all dates loaded.


### TODO
 * include dates made available only up to the actual dates available
 * add user defined ranges past 6 or 12 months, etc?