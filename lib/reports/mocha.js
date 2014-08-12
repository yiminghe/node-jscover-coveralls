window.nodeJsCoverCoveralls = function (runner) {
    var SEP = '&',
        EQ = '=';

    var isArray = Array.isArray || function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    function isValidParamValue(val) {
        var t = typeof val;
        // If the type of val is null, undefined, number, string, boolean, return TRUE.
        return val == null || (t !== 'object' && t !== 'function');
    }

    function param(o, sep, eq, serializeArray) {
        sep = sep || SEP;
        eq = eq || EQ;
        if (serializeArray === undefined) {
            serializeArray = 1;
        }
        var buf = [], key, i, v, len, val,
            encode = encodeURIComponent;
        for (key in o) {

            val = o[key];
            key = encode(key);

            // val is valid non-array value
            if (isValidParamValue(val)) {
                buf.push(key);
                if (val !== undefined) {
                    buf.push(eq, encode(val + ''));
                }
                buf.push(sep);
            } else if (isArray(val) && val.length) {
                // val is not empty array
                for (i = 0, len = val.length; i < len; ++i) {
                    v = val[i];
                    if (isValidParamValue(v)) {
                        buf.push(key, (serializeArray ? encode('[]') : ''));
                        if (v !== undefined) {
                            buf.push(eq, encode(v + ''));
                        }
                        buf.push(sep);
                    }
                }
            }
            // ignore other cases, including empty array, Function, RegExp, Date etc.

        }
        buf.pop();
        return buf.join('');
    }

    function createRequest() {
        if (window.ActiveXObject) {
            return new window.ActiveXObject('Microsoft.XMLHTTP');
        }
        else {
            return new XMLHttpRequest();
        }
    }

    runner.on('end', function () {
        if (window._$jscoverage && window.jscoverage_serializeCoverageToJSON) {
            var json = window.jscoverage_serializeCoverageToJSON();
            var request = createRequest();
            request.open('post', '/node-jscover-coveralls', true);
            request.setRequestHeader('content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send(param({
                report: json
            }));
        }
    });
};