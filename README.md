# SenseDateRangePicker
A date range picker extension for qliksense

Based on http://www.daterangepicker.com/

Can be turned into a single date picker in the Calendar Settings.
Also at Calendar Settings can choose all language locales that moment.js supports.


#### 1.0.1
* Fixed range check: Using qElemNumber only worked if the dates where loaded ordered. -> now the data is ordered and validated with qNum
* Start date not clearing if there was no date to select.

Still works better with a date field with all dates loaded.
