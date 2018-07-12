const path = require('path');
const url = require('url');
const fs = require('fs');
const http = require('http');

function lookup(pathname) {
    if (pathname.endsWith('.js')) {
        return 'application/javascript; charset=utf-8;';
    } else if (pathname.endsWith('.css')) {
        return 'text/css';
    }
}

const cache = [];
http.ServerResponse.prototype.render = function (viewname) {
    var res = this;
    if (!cache[viewname]) {
      var text;
      try {
        text = fs.readFileSync(path.join(__dirname, '../front' , viewname), 'utf8');
      } catch (ex) {
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.end('模版文件错误');
        return;
      }
      cache[viewname] = text;
    }
    const html = cache[viewname];
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
};
const express = function (req, res) {
    var index = -1;
    express.makeResponse(res)
    var next = function () {
      index++;
      var middleware = express.stack[index];
      if (!middleware) return;

      if (middleware.route === null || url.parse(req.url).pathname === middleware.route) {
        middleware.handle(req, res, next);
      } else {
          next()
      }
    };
    next();
};

express.makeResponse = (res) => {
    res.send = function(data){
        switch(typeof data){
            case 'string': res.end(data);
            break;
            case 'object': res.end(JSON.stringify(data));
            break;
            case 'number': res.writeHead(data), res.end(arguments[1]);
            break;
            default: res.setHeader(500, 'server error'), res.end('server error');
        }
    }
}

express.staticFile = function (root) {
    return function (req, res, next) {
      var pathname = url.parse(req.url).pathname;
      fs.readFile(path.join(root, pathname), function (err, file) {
        if (err) {
          if (err.code === 'ENOENT') {
            return next();
          } else {
            return next(err);
          }
        }
        res.writeHead(200, {'Content-Type': lookup(pathname)});
        res.end(file);
      });
    };
};
  
express.stack = [];

express.use = function (route, handle) {
    if (typeof route === 'function') {
      handle = route;
      route = '/';
    }
    express.stack.push({route: route, handle: handle});
};

module.exports = function() {
    return express;
}