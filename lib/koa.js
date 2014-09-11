var coveralls = require('coveralls');
module.exports = function () {
    return function *(next) {
        if (this.path === '/node-jscover-coveralls') {
            if (!process.env.TRAVIS_JOB_ID) {
                this.body = 'no effect';
                return;
            }
            var lcov = this.request.body.lcov;
            var context = this;
            coveralls.handleInput(lcov, function (err) {
                console.log('coveralls:', err || 'ok');
                context.body = (JSON.stringify(err) || 'ok');
            });
        } else {
            yield *next;
        }
    };
};