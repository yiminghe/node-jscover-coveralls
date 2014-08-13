# node-jscover-coveralls

a middleware to send coverage data on phantomjs by node-jscover to coveralls

## example

``` javascript
var app = express();
app.use(express.bodyParser());
app.use(require('node-jscover-coveralls')({
    base: '/code/lib/'
}));
```

base is related to [node-jscover-handler](https://github.com/yiminghe/node-jscover-handler)'s paths config
