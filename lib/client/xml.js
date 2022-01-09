const oFetch = window.fetch,
  XHR = window.XMLHttpRequest,
  oXHR = window.XMLHttpRequest.prototype.open,
  oPMessage = window.postMessage,
  oSBeacon = window.Navigator.prototype.sendBeacon;

var ctx = {
  prefix: config.prefix,
  url: config.url,
  config: {
    encode: config.encode,
  },
  encode: config.encode,
  getRequestUrl: (req) => {return this.encoding.decode(req.url.split(this.prefix)[1].replace(/\/$/g, ''))},
}

ctx.encoding = encoding(ctx)

window.fetch = function(url, opts) {
  if (typeof url == 'object') {
    opts = url
    url = url.url
    return oFetch.apply(this, arguments)
  }
  if (url) url = new Base(ctx).url(url)
  return oFetch.apply(this, arguments)
}

window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
  if (url) url = new Base(ctx).url(url)
  return oXHR.apply(this, arguments)
}

window.postMessage = function(msg, origin, transfer) {
  if (origin) origin = location.origin;
  return oPMessage.apply(this, arguments);
};
window.Navigator.prototype.sendBeacon = function(url, data) {
  if (url) url = new Base(ctx).url(url);
  return oSBeacon.apply(this, arguments);
};

window.WebSocket = new Proxy(window.WebSocket, {
  construct(target, args) {
    if (args[0].includes('?')) var todo = '&'; else var todo = '?'
    args[0] = (location.protocol=='https:' ? 'wss:' : 'ws:') + '//' + location.origin.split('/').splice(2).join('/') + config.prefix + '?ws='+args[0].replace(location.origin.split('/').splice(2).join('/'), pLocation.origin.split('/').splice(2).join('/'))+ todo+'origin=' + new URL(config.url).origin;
    return Reflect.construct(target, args);
  }
});

window.Worker = new Proxy(window.Worker, {
  construct: (target, args) => {
    if (args[0])  {
      if (args[0].trim().startsWith(`blob:${pLocation.origin}`)) {
        const xhr = new XHR
        xhr.open('GET', args[0], false);
        xhr.send();
        const script = new JSRewriter(ctx)(xhr.responseText, ctx.location.origin + args[0].trim().slice(`blob:${ctx.window.location.origin}`.length), ctx);
        const blob = new Blob([ script ], { type: 'application/javascript' });
        args[0] = URL.createObjectURL(blob);
      } else {
        args[0] = new Base(ctx).url(args[0]);
      };
    };
    return Reflect.construct(target, args);
  },
}); 