var request = require('request');
var fs = require('fs');
var path = require('path');
var jobId = process.env.TRAVIS_JOB_ID;
module.exports = function (config) {
    return function (req, res, next) {
        if (req.path === '/node-jscover-coveralls') {
            if (jobId) {
                var postData = {
                    'service_name': 'travis-ci',
                    'service_job_id': jobId,
                    'sourceFiles': []
                };
                var report = req.param('report');
                var jsonReport = JSON.parse(report);
                var sourceFiles = postData.sourceFiles;
                for (var f in jsonReport) {
                    var detail = jsonReport[f];
                    // coveralls.io does not need first data
                    detail.lineData.shift();
                    var name = f;
                    var source = fs.readFileSync(path.join(config.base, f), 'utf8');
                    sourceFiles.push({
                        name: name,
                        source: source,
                        coverage: detail.lineData
                    });
                }
                var str = JSON.stringify(postData);
                var url = 'https://coveralls.io/api/v1/jobs';
                request.post({url: url, form: { json: str}}, function (error, response, body) {
                    if (error) {
                        res.send('error occurs:');
                        console.log('error occurs when sending to coveralls.io');
                        console.log(error);
                        res.end(error);
                        return;
                    }
                    res.end('sending to coveralls.io successful!  Server responded with:', body);
                });
            } else {
                res.send('no effect');
            }
        } else {
            next();
        }
    };
};