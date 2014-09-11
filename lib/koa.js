var coveralls = require('coveralls');

function coverall(lcov) {
    return function (done) {
        coveralls.handleInput(lcov, function (err) {
            done(err);
        });
    };
}

module.exports = function () {
    return function *(next) {
        if (this.path === '/node-jscover-coveralls') {
            if (!process.env.TRAVIS_JOB_ID) {
                this.body = ('no effect');
                return;
            }
            var lcov = this.request.body.lcov;
            try {
                yield coverall(lcov);
            } catch (e) {
                this.throw(e);
            }
            this.body = 'ok';
        } else {
            yield *next;
        }
    };
};