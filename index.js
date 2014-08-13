var coveralls = require('coveralls');
module.exports = function () {
    return function (req, res, next) {
        if (req.path === '/node-jscover-coveralls') {
            if (!process.env.TRAVIS_JOB_ID) {
                res.end('no effect');
                return;
            }
            var lcov = req.param('lcov');
            coveralls.handleInput(lcov, function (err) {
                console.log('coveralls:', err || 'ok');
                res.end(JSON.stringify(err) || 'ok');
            });
        } else {
            next();
        }
    };
};