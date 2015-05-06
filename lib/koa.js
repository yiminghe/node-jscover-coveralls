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
      var shifted = 0;
      //console.log(lcov);
      if (process.argv[0] === 'node') {
        process.argv.shift();
        shifted = 1;
      }
      try {
        yield coverall(lcov);
      } catch (e) {
        this.throw(e);
      }
      if (shifted) {
        process.argv.unshift('node');
      }
      this.body = 'ok';
    } else {
      yield *next;
    }
  };
};
