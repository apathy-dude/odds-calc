var assert = require('assert');
var main = require('../main');

describe('Calculate', function() {
    describe('#1d6', function() {
        it('should return {"1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1 }', function() {
            var odds = {
                '1': 1,
                '2': 1,
                '3': 1,
                '4': 1,
                '5': 1,
                '6': 1,
            };

            var calc = main.Calculate(odds, 1);

            var testOdds = {
                '1': 1,
                '2': 1,
                '3': 1,
                '4': 1,
                '5': 1,
                '6': 1,
            };


            for(var o in testOdds)
                assert.equal(testOdds[o], calc[o]);

            for(o in calc)
                assert.equal(testOdds[o], calc[o]);

        });
    });
});
