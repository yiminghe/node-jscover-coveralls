var coveralls = require('coveralls');

function coverall(lcov) {
  return function (done) {
    coveralls.handleInput(lcov, function (err) {
      done(err);
    });
  };
}

var path = require('path');
var fs = require('fs');
var cwd = process.cwd();

function checkJsx(str) {
  return str.replace(/SF\:([^\n]+)/g, function (m, m1) {
    var file = path.join(cwd, m1);
    if (path.extname(file) === '.js') {
      if (!fs.existsSync(file)) {
        file = file.replace(/\.js$/, '.jsx');
      }
    }
    // transform to absolute path to avoid coveralls resolve
    return 'SF:' + file + '\n';
  });
}

module.exports = function (option) {
  option = option || {};
  return function *(next) {
    if (this.path === '/node-jscover-coveralls') {
      if (!process.env.TRAVIS_JOB_ID) {
        this.body = ('no effect');
        return;
      }
      var lcov = this.request.body.lcov;
      if (option.lcovFilter) {
        lcov = option.lcovFilter(this, lcov);
      } else {
        lcov = checkJsx(lcov);
      }
      var shifted = 0;
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
  }
};
