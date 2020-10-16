'use strict';

define(['chai',
    '../../../src/calendar-settings',
    '../../../src/qlik-date-picker'],
    function (chai, calendarSettings, dateRangePicker) {
        const expect = chai.expect;

        describe('properties', function () {
            it('should have items', function () {
                expect(calendarSettings).to.have.a.property('items');
            });
        });
        describe('dateRangePicker', function () {
            it('should have a paint method', function () {
                expect(dateRangePicker).to.have.a.property('paint');
            });
        });
        describe('getFieldName', function () {
            it('should strip leading =', function () {
                var result = dateRangePicker.methods.getFieldName("=XXX");
                expect(result).to.equal('XXX');
            });
        });
        describe('createDate', function () {
            it('should convert a day number to a date string', function () {
                var result = dateRangePicker.methods.createDate(41276);
                expect(result).to.equal('20130102');
            });
        });
        describe('createMoment', function () {
            it('should create a Moment object from a day number', function () {
                var result = dateRangePicker.methods.createMoment(41276);
                expect(result.format).to.be.a('function');
            });
        });
        describe('createRanges', function () {
            it('should create a ranges object', function () {
                var result = dateRangePicker.methods.createRanges({
                    today: 'Idag',
                    yesterday: 'Igår',
                    lastXDays: 'Senaste $ dagarna',
                    thisMonth: 'Denna månad',
                    lastMonth: 'Föregående månad'
                });
                expect(result).to.have.a.property('Idag');
            });
        });
        describe('createDateStates', function () {
            it('should map date states', function () {
                var testData = [{
                    "qMatrix": [[{ "qText": "1/2/2013", "qNum": 41276, "qElemNumber": 132, "qState": "A" }],
                    [{ "qText": "1/3/2013", "qNum": 41277, "qElemNumber": 499, "qState": "A" }],
                    [{ "qText": "1/4/2013", "qNum": 41278, "qElemNumber": 501, "qState": "A" }],
                    [{ "qText": "1/5/2013", "qNum": 41279, "qElemNumber": 502, "qState": "A" }],
                    [{ "qText": "1/6/2013", "qNum": 41280, "qElemNumber": 500, "qState": "A" }],
                    [{ "qText": "1/7/2013", "qNum": 41281, "qElemNumber": 130, "qState": "A" }],
                    [{ "qText": "1/8/2013", "qNum": 41282, "qElemNumber": 142, "qState": "A" }],
                    [{ "qText": "1/9/2013", "qNum": 41283, "qElemNumber": 335, "qState": "A" }],
                    [{ "qText": "1/10/2013", "qNum": 41284, "qElemNumber": 433, "qState": "A" }],
                    [{ "qText": "1/11/2013", "qNum": 41285, "qElemNumber": 414, "qState": "A" }],
                    [{ "qText": "1/14/2013", "qNum": 41288, "qElemNumber": 406, "qState": "S", "qFrequency": "211" }],
                    [{ "qText": "1/15/2013", "qNum": 41289, "qElemNumber": 394, "qState": "S", "qFrequency": "265" }],
                    [{ "qText": "1/16/2013", "qNum": 41290, "qElemNumber": 386, "qState": "S", "qFrequency": "177" }],
                    [{ "qText": "1/17/2013", "qNum": 41291, "qElemNumber": 348, "qState": "S", "qFrequency": "350" }],
                    [{ "qText": "1/18/2013", "qNum": 41292, "qElemNumber": 108, "qState": "S", "qFrequency": "327" }],
                    [{ "qText": "1/21/2013", "qNum": 41295, "qElemNumber": 99, "qState": "A" }],
                    [{ "qText": "1/22/2013", "qNum": 41296, "qElemNumber": 365, "qState": "A" }],
                    [{ "qText": "1/23/2013", "qNum": 41297, "qElemNumber": 34, "qState": "A" }],
                    [{ "qText": "1/24/2013", "qNum": 41298, "qElemNumber": 426, "qState": "A" }]],
                    "qTails": [],
                    "qArea": { "qLeft": 0, "qTop": 0, "qWidth": 1, "qHeight": 505 }
                }];
                var result = dateRangePicker.methods.createDateStates(testData);
                expect(result).to.have.a.property('rangeStart');
                expect(result.rangeStart).to.be.equals(41288);
                expect(result['20130114']).to.be.equal('S');
            });
        });
        describe('createHtml', function () {
            it('should use defaultText if no range is available', function () {
                var defaultText = 'DEFAULT TEXT';
                var result = dateRangePicker.methods.createHtml({}, 'YYYY-MM-DD',
                    { separator: '-', defaultText: defaultText });
                expect(result).to.include(defaultText);
            });
        });

    });