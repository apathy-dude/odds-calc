var _ = require('lodash');

function multi(odds1, odds2) {
    var probability = {};

    for(var k1 in odds1) {
        var val1 = odds1[k1];
        var key1 = Number.parseFloat(k1);
        for(var k2 in odds2) {
            var val2 = odds2[k2];
            var key2 = Number.parseFloat(k2);
            var value = key1 + key2;
            var count = val1 * val2;
            if(probability[value] === undefined)
                probability[value] = count;
            else
                probability[value] += count;
        }
    }

    return probability;
}

function calc(odds, count) {
    var cache = { 1: odds };
    var num = 1;

    function max(k) {
        k = Number.parseFloat(k);
        return k + num <= count ? k : undefined;
    }

    while(num * 2 < count) {
        var val = cache[num];
        num = num * 2;
        cache[num] = multi(val, val);
    }

    while(num < count) {
        var keys = Object.keys(cache);
        var c = _.max(keys, max);
        c = Number.parseFloat(c);
        cache[c + num] = multi(cache[num], cache[c]);
        num += c;
    }

    return cache[count];
}

function percent(odds) {
    var sum = odds.total || _.reduce(odds, function(sum, n) {
        return sum += n;
    }, 0);

    var pOdds = {};

    for(var o in odds)
        pOdds[o] = odds[o] / sum * 100;

    return pOdds;
}

function predicate(odds, func, total) {
    var sum = total || _.reduce(odds, function(sum, n) {
        return sum += n;
    }, 0);

    var keys = Object.keys(odds);

    var valid = _.reduce(keys, function(sum, n) {
        return sum += func(n) ? odds[n] : 0;
    }, 0);

    return { valid: valid, invalid: sum - valid, total: sum };
}

function greaterThanOrEqual(odds) {
    function pred(val) {
        val = Number.parseFloat(val);
        return function(n) {
            n = Number.parseFloat(n);
            return n >= val;
        }
    }

    var sum = _.reduce(odds, function(sum, n) {
        return sum += n;
    }, 0);

    var gtOdds = {};

    for(var o in odds)
        gtOdds[o] = predicate(odds, pred(o), sum).valid;

    gtOdds.total = sum;

    return gtOdds;
}

function lessThanOrEqual(odds, val) {
    function pred(val) {
        return function(n) {
            return n <= val;
        }
    }

    var sum = _.reduce(odds, function(sum, n) {
        return sum += n;
    }, 0);

    var ltOdds = {};

    for(var o in odds)
        ltOdds[o] = predicate(odds, pred(o), sum).valid;

    ltOdds.total = sum;

    return gtOdds;
}

module.exports = { 
    Calculate: calc,
    Percent: percent,
    GreaterOrEqual: greaterThanOrEqual,
    LessOrEqual: lessThanOrEqual,
    Predicate: predicate
};

