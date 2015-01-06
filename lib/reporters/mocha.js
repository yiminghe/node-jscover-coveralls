(function () {
  function createRequest() {
    if (window.ActiveXObject) {
      return new window.ActiveXObject('Microsoft.XMLHTTP');
    }
    else {
      return new XMLHttpRequest();
    }
  }

  // https://github.com/StevenLooman/mocha-lcov-reporter/blob/master/lib/lcov.js
  function reportFile(filename, data) {
    var lcov = '';
    lcov += ('SF:' + filename + '\n');

    data.forEach(function (count, num) {
      if (count !== null) {
        lcov += ('DA:' + num + ',' + count + '\n');
      }
    });

    lcov += 'end_of_record\n';

    return lcov;
  }

  var OriginalReporter = mocha._reporter;

  function CoverallsReporter(runner) {
    OriginalReporter.apply(this, arguments);
    runner.on('end', function () {
      if (window._$jscoverage) {
        var cov = window._$jscoverage;
        var lcov = '';
        for (var filename in cov) {
          var data = cov[filename];
          lcov += reportFile(filename, data.lineData);
        }
        var request = createRequest();
        console.log('send.... coverage data to coveralls.io');
        request.open('post', '/node-jscover-coveralls', false);
        request.setRequestHeader('content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
            console.log('coveralls.io returns: ' + request.responseText);
          }
        };
        request.send('lcov=' + encodeURIComponent(lcov));
      }
    });
  }

  CoverallsReporter.prototype = OriginalReporter.prototype;

  if (typeof module !== 'undefined') {
    module.exports = CoverallsReporter;
  } else {
    mocha.reporter(CoverallsReporter);
  }
})();