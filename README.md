# SenseDateRangePicker
A calendar object that allows a user to make selections in a date field. This extension is a part of dashboard bundle, first delivered with Qlik Sense November 2018.

Based on http://www.daterangepicker.com/

# Get Started

## Installation
1. Download the extension zip, `qlik-date-picker.zip`, from the latest release (https://github.com/qlik-oss/SenseDateRangePicker/releases/latest)
2. Install the extension:

    a. **Qlik Sense Desktop**: unzip to a directory under [My Documents]/Qlik/Sense/Extensions.
    
    b. **Qlik Sense Server**: import the zip file in the QMC.

# Developing the extension

If you want to do code changes to the extension follow these simple steps to get going.

1. Get Qlik Sense Desktop
1. Create a new app and add qsVariable to a sheet.
2. Clone the repository
3. Run `npm install`
4. Change the path to `/dist` folder in `gulpfile.js(row 8)` to be your local extensions folder. It will be something like `C:/Users/<user>/Documents/Qlik/Sense/Extensions/qlik-date-picker`.
5. Run `npm run build:debug` - this command should output unminified code to the path configured in step four.

```
// Minified output to /dist folder.
$ npm run build
```

```
// Outputs a .zip file to /dist folder.
$ npm run build:zip
```

# Original Author
[NOD507](https://github.com/NOD507)