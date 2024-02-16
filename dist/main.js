"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/universal-user-agent/dist-node/index.js
  var require_dist_node = __commonJS({
    "node_modules/universal-user-agent/dist-node/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function getUserAgent6() {
        if (typeof navigator === "object" && "userAgent" in navigator) {
          return navigator.userAgent;
        }
        if (typeof process === "object" && process.version !== void 0) {
          return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
        }
        return "<environment undetectable>";
      }
      exports.getUserAgent = getUserAgent6;
    }
  });

  // node_modules/before-after-hook/lib/register.js
  var require_register = __commonJS({
    "node_modules/before-after-hook/lib/register.js"(exports, module) {
      module.exports = register;
      function register(state, name, method, options) {
        if (typeof method !== "function") {
          throw new Error("method for before hook must be a function");
        }
        if (!options) {
          options = {};
        }
        if (Array.isArray(name)) {
          return name.reverse().reduce(function(callback, name2) {
            return register.bind(null, state, name2, callback, options);
          }, method)();
        }
        return Promise.resolve().then(function() {
          if (!state.registry[name]) {
            return method(options);
          }
          return state.registry[name].reduce(function(method2, registered) {
            return registered.hook.bind(null, method2, options);
          }, method)();
        });
      }
    }
  });

  // node_modules/before-after-hook/lib/add.js
  var require_add = __commonJS({
    "node_modules/before-after-hook/lib/add.js"(exports, module) {
      module.exports = addHook;
      function addHook(state, kind, name, hook5) {
        var orig = hook5;
        if (!state.registry[name]) {
          state.registry[name] = [];
        }
        if (kind === "before") {
          hook5 = function(method, options) {
            return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
          };
        }
        if (kind === "after") {
          hook5 = function(method, options) {
            var result;
            return Promise.resolve().then(method.bind(null, options)).then(function(result_) {
              result = result_;
              return orig(result, options);
            }).then(function() {
              return result;
            });
          };
        }
        if (kind === "error") {
          hook5 = function(method, options) {
            return Promise.resolve().then(method.bind(null, options)).catch(function(error) {
              return orig(error, options);
            });
          };
        }
        state.registry[name].push({
          hook: hook5,
          orig
        });
      }
    }
  });

  // node_modules/before-after-hook/lib/remove.js
  var require_remove = __commonJS({
    "node_modules/before-after-hook/lib/remove.js"(exports, module) {
      module.exports = removeHook;
      function removeHook(state, name, method) {
        if (!state.registry[name]) {
          return;
        }
        var index = state.registry[name].map(function(registered) {
          return registered.orig;
        }).indexOf(method);
        if (index === -1) {
          return;
        }
        state.registry[name].splice(index, 1);
      }
    }
  });

  // node_modules/before-after-hook/index.js
  var require_before_after_hook = __commonJS({
    "node_modules/before-after-hook/index.js"(exports, module) {
      var register = require_register();
      var addHook = require_add();
      var removeHook = require_remove();
      var bind = Function.bind;
      var bindable = bind.bind(bind);
      function bindApi(hook5, state, name) {
        var removeHookRef = bindable(removeHook, null).apply(
          null,
          name ? [state, name] : [state]
        );
        hook5.api = { remove: removeHookRef };
        hook5.remove = removeHookRef;
        ["before", "error", "after", "wrap"].forEach(function(kind) {
          var args = name ? [state, kind, name] : [state, kind];
          hook5[kind] = hook5.api[kind] = bindable(addHook, null).apply(null, args);
        });
      }
      function HookSingular() {
        var singularHookName = "h";
        var singularHookState = {
          registry: {}
        };
        var singularHook = register.bind(null, singularHookState, singularHookName);
        bindApi(singularHook, singularHookState, singularHookName);
        return singularHook;
      }
      function HookCollection() {
        var state = {
          registry: {}
        };
        var hook5 = register.bind(null, state);
        bindApi(hook5, state);
        return hook5;
      }
      var collectionHookDeprecationMessageDisplayed = false;
      function Hook() {
        if (!collectionHookDeprecationMessageDisplayed) {
          console.warn(
            '[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'
          );
          collectionHookDeprecationMessageDisplayed = true;
        }
        return HookCollection();
      }
      Hook.Singular = HookSingular.bind();
      Hook.Collection = HookCollection.bind();
      module.exports = Hook;
      module.exports.Hook = Hook;
      module.exports.Singular = Hook.Singular;
      module.exports.Collection = Hook.Collection;
    }
  });

  // node_modules/@octokit/endpoint/dist-web/index.js
  function lowercaseKeys(object) {
    if (!object) {
      return {};
    }
    return Object.keys(object).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = object[key];
      return newObj;
    }, {});
  }
  function isPlainObject(value) {
    if (typeof value !== "object" || value === null)
      return false;
    if (Object.prototype.toString.call(value) !== "[object Object]")
      return false;
    const proto = Object.getPrototypeOf(value);
    if (proto === null)
      return true;
    const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
  }
  function mergeDeep(defaults, options) {
    const result = Object.assign({}, defaults);
    Object.keys(options).forEach((key) => {
      if (isPlainObject(options[key])) {
        if (!(key in defaults))
          Object.assign(result, { [key]: options[key] });
        else
          result[key] = mergeDeep(defaults[key], options[key]);
      } else {
        Object.assign(result, { [key]: options[key] });
      }
    });
    return result;
  }
  function removeUndefinedProperties(obj) {
    for (const key in obj) {
      if (obj[key] === void 0) {
        delete obj[key];
      }
    }
    return obj;
  }
  function merge(defaults, route, options) {
    if (typeof route === "string") {
      let [method, url] = route.split(" ");
      options = Object.assign(url ? { method, url } : { url: method }, options);
    } else {
      options = Object.assign({}, route);
    }
    options.headers = lowercaseKeys(options.headers);
    removeUndefinedProperties(options);
    removeUndefinedProperties(options.headers);
    const mergedOptions = mergeDeep(defaults || {}, options);
    if (options.url === "/graphql") {
      if (defaults && defaults.mediaType.previews?.length) {
        mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(
          (preview) => !mergedOptions.mediaType.previews.includes(preview)
        ).concat(mergedOptions.mediaType.previews);
      }
      mergedOptions.mediaType.previews = (mergedOptions.mediaType.previews || []).map((preview) => preview.replace(/-preview/, ""));
    }
    return mergedOptions;
  }
  function addQueryParameters(url, parameters) {
    const separator = /\?/.test(url) ? "&" : "?";
    const names = Object.keys(parameters);
    if (names.length === 0) {
      return url;
    }
    return url + separator + names.map((name) => {
      if (name === "q") {
        return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
      }
      return `${name}=${encodeURIComponent(parameters[name])}`;
    }).join("&");
  }
  function removeNonChars(variableName) {
    return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
  }
  function extractUrlVariableNames(url) {
    const matches = url.match(urlVariableRegex);
    if (!matches) {
      return [];
    }
    return matches.map(removeNonChars).reduce((a4, b3) => a4.concat(b3), []);
  }
  function omit(object, keysToOmit) {
    const result = { __proto__: null };
    for (const key of Object.keys(object)) {
      if (keysToOmit.indexOf(key) === -1) {
        result[key] = object[key];
      }
    }
    return result;
  }
  function encodeReserved(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
      if (!/%[0-9A-Fa-f]/.test(part)) {
        part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
      }
      return part;
    }).join("");
  }
  function encodeUnreserved(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c3) {
      return "%" + c3.charCodeAt(0).toString(16).toUpperCase();
    });
  }
  function encodeValue(operator, value, key) {
    value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
    if (key) {
      return encodeUnreserved(key) + "=" + value;
    } else {
      return value;
    }
  }
  function isDefined(value) {
    return value !== void 0 && value !== null;
  }
  function isKeyOperator(operator) {
    return operator === ";" || operator === "&" || operator === "?";
  }
  function getValues(context, operator, key, modifier) {
    var value = context[key], result = [];
    if (isDefined(value) && value !== "") {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        value = value.toString();
        if (modifier && modifier !== "*") {
          value = value.substring(0, parseInt(modifier, 10));
        }
        result.push(
          encodeValue(operator, value, isKeyOperator(operator) ? key : "")
        );
      } else {
        if (modifier === "*") {
          if (Array.isArray(value)) {
            value.filter(isDefined).forEach(function(value2) {
              result.push(
                encodeValue(operator, value2, isKeyOperator(operator) ? key : "")
              );
            });
          } else {
            Object.keys(value).forEach(function(k3) {
              if (isDefined(value[k3])) {
                result.push(encodeValue(operator, value[k3], k3));
              }
            });
          }
        } else {
          const tmp = [];
          if (Array.isArray(value)) {
            value.filter(isDefined).forEach(function(value2) {
              tmp.push(encodeValue(operator, value2));
            });
          } else {
            Object.keys(value).forEach(function(k3) {
              if (isDefined(value[k3])) {
                tmp.push(encodeUnreserved(k3));
                tmp.push(encodeValue(operator, value[k3].toString()));
              }
            });
          }
          if (isKeyOperator(operator)) {
            result.push(encodeUnreserved(key) + "=" + tmp.join(","));
          } else if (tmp.length !== 0) {
            result.push(tmp.join(","));
          }
        }
      }
    } else {
      if (operator === ";") {
        if (isDefined(value)) {
          result.push(encodeUnreserved(key));
        }
      } else if (value === "" && (operator === "&" || operator === "?")) {
        result.push(encodeUnreserved(key) + "=");
      } else if (value === "") {
        result.push("");
      }
    }
    return result;
  }
  function parseUrl(template) {
    return {
      expand: expand.bind(null, template)
    };
  }
  function expand(template, context) {
    var operators = ["+", "#", ".", "/", ";", "?", "&"];
    template = template.replace(
      /\{([^\{\}]+)\}|([^\{\}]+)/g,
      function(_2, expression, literal) {
        if (expression) {
          let operator = "";
          const values = [];
          if (operators.indexOf(expression.charAt(0)) !== -1) {
            operator = expression.charAt(0);
            expression = expression.substr(1);
          }
          expression.split(/,/g).forEach(function(variable) {
            var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
            values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
          });
          if (operator && operator !== "+") {
            var separator = ",";
            if (operator === "?") {
              separator = "&";
            } else if (operator !== "#") {
              separator = operator;
            }
            return (values.length !== 0 ? operator : "") + values.join(separator);
          } else {
            return values.join(",");
          }
        } else {
          return encodeReserved(literal);
        }
      }
    );
    if (template === "/") {
      return template;
    } else {
      return template.replace(/\/$/, "");
    }
  }
  function parse(options) {
    let method = options.method.toUpperCase();
    let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
    let headers = Object.assign({}, options.headers);
    let body;
    let parameters = omit(options, [
      "method",
      "baseUrl",
      "url",
      "headers",
      "request",
      "mediaType"
    ]);
    const urlVariableNames = extractUrlVariableNames(url);
    url = parseUrl(url).expand(parameters);
    if (!/^http/.test(url)) {
      url = options.baseUrl + url;
    }
    const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
    const remainingParameters = omit(parameters, omittedParameters);
    const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
    if (!isBinaryRequest) {
      if (options.mediaType.format) {
        headers.accept = headers.accept.split(/,/).map(
          (format) => format.replace(
            /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
            `application/vnd$1$2.${options.mediaType.format}`
          )
        ).join(",");
      }
      if (url.endsWith("/graphql")) {
        if (options.mediaType.previews?.length) {
          const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
          headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
            const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
            return `application/vnd.github.${preview}-preview${format}`;
          }).join(",");
        }
      }
    }
    if (["GET", "HEAD"].includes(method)) {
      url = addQueryParameters(url, remainingParameters);
    } else {
      if ("data" in remainingParameters) {
        body = remainingParameters.data;
      } else {
        if (Object.keys(remainingParameters).length) {
          body = remainingParameters;
        }
      }
    }
    if (!headers["content-type"] && typeof body !== "undefined") {
      headers["content-type"] = "application/json; charset=utf-8";
    }
    if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
      body = "";
    }
    return Object.assign(
      { method, url, headers },
      typeof body !== "undefined" ? { body } : null,
      options.request ? { request: options.request } : null
    );
  }
  function endpointWithDefaults(defaults, route, options) {
    return parse(merge(defaults, route, options));
  }
  function withDefaults(oldDefaults, newDefaults) {
    const DEFAULTS2 = merge(oldDefaults, newDefaults);
    const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
    return Object.assign(endpoint2, {
      DEFAULTS: DEFAULTS2,
      defaults: withDefaults.bind(null, DEFAULTS2),
      merge: merge.bind(null, DEFAULTS2),
      parse
    });
  }
  var import_universal_user_agent, VERSION, userAgent, DEFAULTS, urlVariableRegex, endpoint;
  var init_dist_web = __esm({
    "node_modules/@octokit/endpoint/dist-web/index.js"() {
      import_universal_user_agent = __toESM(require_dist_node());
      VERSION = "9.0.4";
      userAgent = `octokit-endpoint.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`;
      DEFAULTS = {
        method: "GET",
        baseUrl: "https://api.github.com",
        headers: {
          accept: "application/vnd.github.v3+json",
          "user-agent": userAgent
        },
        mediaType: {
          format: ""
        }
      };
      urlVariableRegex = /\{[^}]+\}/g;
      endpoint = withDefaults(null, DEFAULTS);
    }
  });

  // node_modules/deprecation/dist-node/index.js
  var require_dist_node2 = __commonJS({
    "node_modules/deprecation/dist-node/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var Deprecation2 = class extends Error {
        constructor(message) {
          super(message);
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          }
          this.name = "Deprecation";
        }
      };
      exports.Deprecation = Deprecation2;
    }
  });

  // node_modules/wrappy/wrappy.js
  var require_wrappy = __commonJS({
    "node_modules/wrappy/wrappy.js"(exports, module) {
      module.exports = wrappy;
      function wrappy(fn, cb) {
        if (fn && cb)
          return wrappy(fn)(cb);
        if (typeof fn !== "function")
          throw new TypeError("need wrapper function");
        Object.keys(fn).forEach(function(k3) {
          wrapper[k3] = fn[k3];
        });
        return wrapper;
        function wrapper() {
          var args = new Array(arguments.length);
          for (var i4 = 0; i4 < args.length; i4++) {
            args[i4] = arguments[i4];
          }
          var ret = fn.apply(this, args);
          var cb2 = args[args.length - 1];
          if (typeof ret === "function" && ret !== cb2) {
            Object.keys(cb2).forEach(function(k3) {
              ret[k3] = cb2[k3];
            });
          }
          return ret;
        }
      }
    }
  });

  // node_modules/once/once.js
  var require_once = __commonJS({
    "node_modules/once/once.js"(exports, module) {
      var wrappy = require_wrappy();
      module.exports = wrappy(once2);
      module.exports.strict = wrappy(onceStrict);
      once2.proto = once2(function() {
        Object.defineProperty(Function.prototype, "once", {
          value: function() {
            return once2(this);
          },
          configurable: true
        });
        Object.defineProperty(Function.prototype, "onceStrict", {
          value: function() {
            return onceStrict(this);
          },
          configurable: true
        });
      });
      function once2(fn) {
        var f3 = function() {
          if (f3.called)
            return f3.value;
          f3.called = true;
          return f3.value = fn.apply(this, arguments);
        };
        f3.called = false;
        return f3;
      }
      function onceStrict(fn) {
        var f3 = function() {
          if (f3.called)
            throw new Error(f3.onceError);
          f3.called = true;
          return f3.value = fn.apply(this, arguments);
        };
        var name = fn.name || "Function wrapped with `once`";
        f3.onceError = name + " shouldn't be called more than once";
        f3.called = false;
        return f3;
      }
    }
  });

  // node_modules/@octokit/request-error/dist-web/index.js
  var dist_web_exports = {};
  __export(dist_web_exports, {
    RequestError: () => RequestError
  });
  var import_deprecation, import_once, logOnceCode, logOnceHeaders, RequestError;
  var init_dist_web2 = __esm({
    "node_modules/@octokit/request-error/dist-web/index.js"() {
      import_deprecation = __toESM(require_dist_node2());
      import_once = __toESM(require_once());
      logOnceCode = (0, import_once.default)((deprecation) => console.warn(deprecation));
      logOnceHeaders = (0, import_once.default)((deprecation) => console.warn(deprecation));
      RequestError = class extends Error {
        constructor(message, statusCode, options) {
          super(message);
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          }
          this.name = "HttpError";
          this.status = statusCode;
          let headers;
          if ("headers" in options && typeof options.headers !== "undefined") {
            headers = options.headers;
          }
          if ("response" in options) {
            this.response = options.response;
            headers = options.response.headers;
          }
          const requestCopy = Object.assign({}, options.request);
          if (options.request.headers.authorization) {
            requestCopy.headers = Object.assign({}, options.request.headers, {
              authorization: options.request.headers.authorization.replace(
                / .*$/,
                " [REDACTED]"
              )
            });
          }
          requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
          this.request = requestCopy;
          Object.defineProperty(this, "code", {
            get() {
              logOnceCode(
                new import_deprecation.Deprecation(
                  "[@octokit/request-error] `error.code` is deprecated, use `error.status`."
                )
              );
              return statusCode;
            }
          });
          Object.defineProperty(this, "headers", {
            get() {
              logOnceHeaders(
                new import_deprecation.Deprecation(
                  "[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."
                )
              );
              return headers || {};
            }
          });
        }
      };
    }
  });

  // node_modules/@octokit/request/dist-web/index.js
  var dist_web_exports2 = {};
  __export(dist_web_exports2, {
    request: () => request
  });
  function isPlainObject2(value) {
    if (typeof value !== "object" || value === null)
      return false;
    if (Object.prototype.toString.call(value) !== "[object Object]")
      return false;
    const proto = Object.getPrototypeOf(value);
    if (proto === null)
      return true;
    const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
  }
  function getBufferResponse(response) {
    return response.arrayBuffer();
  }
  function fetchWrapper(requestOptions) {
    const log = requestOptions.request && requestOptions.request.log ? requestOptions.request.log : console;
    const parseSuccessResponseBody = requestOptions.request?.parseSuccessResponseBody !== false;
    if (isPlainObject2(requestOptions.body) || Array.isArray(requestOptions.body)) {
      requestOptions.body = JSON.stringify(requestOptions.body);
    }
    let headers = {};
    let status;
    let url;
    let { fetch } = globalThis;
    if (requestOptions.request?.fetch) {
      fetch = requestOptions.request.fetch;
    }
    if (!fetch) {
      throw new Error(
        "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
      );
    }
    return fetch(requestOptions.url, {
      method: requestOptions.method,
      body: requestOptions.body,
      headers: requestOptions.headers,
      signal: requestOptions.request?.signal,
      // duplex must be set if request.body is ReadableStream or Async Iterables.
      // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
      ...requestOptions.body && { duplex: "half" }
    }).then(async (response) => {
      url = response.url;
      status = response.status;
      for (const keyAndValue of response.headers) {
        headers[keyAndValue[0]] = keyAndValue[1];
      }
      if ("deprecation" in headers) {
        const matches = headers.link && headers.link.match(/<([^>]+)>; rel="deprecation"/);
        const deprecationLink = matches && matches.pop();
        log.warn(
          `[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${headers.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`
        );
      }
      if (status === 204 || status === 205) {
        return;
      }
      if (requestOptions.method === "HEAD") {
        if (status < 400) {
          return;
        }
        throw new RequestError(response.statusText, status, {
          response: {
            url,
            status,
            headers,
            data: void 0
          },
          request: requestOptions
        });
      }
      if (status === 304) {
        throw new RequestError("Not modified", status, {
          response: {
            url,
            status,
            headers,
            data: await getResponseData(response)
          },
          request: requestOptions
        });
      }
      if (status >= 400) {
        const data = await getResponseData(response);
        const error = new RequestError(toErrorMessage(data), status, {
          response: {
            url,
            status,
            headers,
            data
          },
          request: requestOptions
        });
        throw error;
      }
      return parseSuccessResponseBody ? await getResponseData(response) : response.body;
    }).then((data) => {
      return {
        status,
        url,
        headers,
        data
      };
    }).catch((error) => {
      if (error instanceof RequestError)
        throw error;
      else if (error.name === "AbortError")
        throw error;
      let message = error.message;
      if (error.name === "TypeError" && "cause" in error) {
        if (error.cause instanceof Error) {
          message = error.cause.message;
        } else if (typeof error.cause === "string") {
          message = error.cause;
        }
      }
      throw new RequestError(message, 500, {
        request: requestOptions
      });
    });
  }
  async function getResponseData(response) {
    const contentType = response.headers.get("content-type");
    if (/application\/json/.test(contentType)) {
      return response.json().catch(() => response.text()).catch(() => "");
    }
    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }
    return getBufferResponse(response);
  }
  function toErrorMessage(data) {
    if (typeof data === "string")
      return data;
    let suffix;
    if ("documentation_url" in data) {
      suffix = ` - ${data.documentation_url}`;
    } else {
      suffix = "";
    }
    if ("message" in data) {
      if (Array.isArray(data.errors)) {
        return `${data.message}: ${data.errors.map(JSON.stringify).join(", ")}${suffix}`;
      }
      return `${data.message}${suffix}`;
    }
    return `Unknown error: ${JSON.stringify(data)}`;
  }
  function withDefaults2(oldEndpoint, newDefaults) {
    const endpoint2 = oldEndpoint.defaults(newDefaults);
    const newApi = function(route, parameters) {
      const endpointOptions = endpoint2.merge(route, parameters);
      if (!endpointOptions.request || !endpointOptions.request.hook) {
        return fetchWrapper(endpoint2.parse(endpointOptions));
      }
      const request2 = (route2, parameters2) => {
        return fetchWrapper(
          endpoint2.parse(endpoint2.merge(route2, parameters2))
        );
      };
      Object.assign(request2, {
        endpoint: endpoint2,
        defaults: withDefaults2.bind(null, endpoint2)
      });
      return endpointOptions.request.hook(request2, endpointOptions);
    };
    return Object.assign(newApi, {
      endpoint: endpoint2,
      defaults: withDefaults2.bind(null, endpoint2)
    });
  }
  var import_universal_user_agent2, VERSION2, request;
  var init_dist_web3 = __esm({
    "node_modules/@octokit/request/dist-web/index.js"() {
      init_dist_web();
      import_universal_user_agent2 = __toESM(require_dist_node());
      init_dist_web2();
      VERSION2 = "8.2.0";
      request = withDefaults2(endpoint, {
        headers: {
          "user-agent": `octokit-request.js/${VERSION2} ${(0, import_universal_user_agent2.getUserAgent)()}`
        }
      });
    }
  });

  // node_modules/@octokit/graphql/dist-node/index.js
  var require_dist_node3 = __commonJS({
    "node_modules/@octokit/graphql/dist-node/index.js"(exports, module) {
      "use strict";
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export2 = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var dist_src_exports = {};
      __export2(dist_src_exports, {
        GraphqlResponseError: () => GraphqlResponseError,
        graphql: () => graphql2,
        withCustomRequest: () => withCustomRequest
      });
      module.exports = __toCommonJS2(dist_src_exports);
      var import_request32 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      var import_universal_user_agent6 = require_dist_node();
      var VERSION12 = "7.0.2";
      var import_request22 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      var import_request4 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      function _buildMessageForResponseErrors(data) {
        return `Request failed due to following response errors:
` + data.errors.map((e3) => ` - ${e3.message}`).join("\n");
      }
      var GraphqlResponseError = class extends Error {
        constructor(request2, headers, response) {
          super(_buildMessageForResponseErrors(response));
          this.request = request2;
          this.headers = headers;
          this.response = response;
          this.name = "GraphqlResponseError";
          this.errors = response.errors;
          this.data = response.data;
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          }
        }
      };
      var NON_VARIABLE_OPTIONS = [
        "method",
        "baseUrl",
        "url",
        "headers",
        "request",
        "query",
        "mediaType"
      ];
      var FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
      var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
      function graphql(request2, query, options) {
        if (options) {
          if (typeof query === "string" && "query" in options) {
            return Promise.reject(
              new Error(`[@octokit/graphql] "query" cannot be used as variable name`)
            );
          }
          for (const key in options) {
            if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key))
              continue;
            return Promise.reject(
              new Error(
                `[@octokit/graphql] "${key}" cannot be used as variable name`
              )
            );
          }
        }
        const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
        const requestOptions = Object.keys(
          parsedOptions
        ).reduce((result, key) => {
          if (NON_VARIABLE_OPTIONS.includes(key)) {
            result[key] = parsedOptions[key];
            return result;
          }
          if (!result.variables) {
            result.variables = {};
          }
          result.variables[key] = parsedOptions[key];
          return result;
        }, {});
        const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
        if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
          requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
        }
        return request2(requestOptions).then((response) => {
          if (response.data.errors) {
            const headers = {};
            for (const key of Object.keys(response.headers)) {
              headers[key] = response.headers[key];
            }
            throw new GraphqlResponseError(
              requestOptions,
              headers,
              response.data
            );
          }
          return response.data.data;
        });
      }
      function withDefaults3(request2, newDefaults) {
        const newRequest = request2.defaults(newDefaults);
        const newApi = (query, options) => {
          return graphql(newRequest, query, options);
        };
        return Object.assign(newApi, {
          defaults: withDefaults3.bind(null, newRequest),
          endpoint: newRequest.endpoint
        });
      }
      var graphql2 = withDefaults3(import_request32.request, {
        headers: {
          "user-agent": `octokit-graphql.js/${VERSION12} ${(0, import_universal_user_agent6.getUserAgent)()}`
        },
        method: "POST",
        url: "/graphql"
      });
      function withCustomRequest(customRequest) {
        return withDefaults3(customRequest, {
          method: "POST",
          url: "/graphql"
        });
      }
    }
  });

  // node_modules/@octokit/auth-token/dist-web/index.js
  var dist_web_exports3 = {};
  __export(dist_web_exports3, {
    createTokenAuth: () => createTokenAuth
  });
  async function auth(token) {
    const isApp = token.split(/\./).length === 3;
    const isInstallation = REGEX_IS_INSTALLATION_LEGACY.test(token) || REGEX_IS_INSTALLATION.test(token);
    const isUserToServer = REGEX_IS_USER_TO_SERVER.test(token);
    const tokenType = isApp ? "app" : isInstallation ? "installation" : isUserToServer ? "user-to-server" : "oauth";
    return {
      type: "token",
      token,
      tokenType
    };
  }
  function withAuthorizationPrefix(token) {
    if (token.split(/\./).length === 3) {
      return `bearer ${token}`;
    }
    return `token ${token}`;
  }
  async function hook(token, request2, route, parameters) {
    const endpoint2 = request2.endpoint.merge(
      route,
      parameters
    );
    endpoint2.headers.authorization = withAuthorizationPrefix(token);
    return request2(endpoint2);
  }
  var REGEX_IS_INSTALLATION_LEGACY, REGEX_IS_INSTALLATION, REGEX_IS_USER_TO_SERVER, createTokenAuth;
  var init_dist_web4 = __esm({
    "node_modules/@octokit/auth-token/dist-web/index.js"() {
      REGEX_IS_INSTALLATION_LEGACY = /^v1\./;
      REGEX_IS_INSTALLATION = /^ghs_/;
      REGEX_IS_USER_TO_SERVER = /^ghu_/;
      createTokenAuth = function createTokenAuth2(token) {
        if (!token) {
          throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
        }
        if (typeof token !== "string") {
          throw new Error(
            "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
          );
        }
        token = token.replace(/^(token|bearer) +/i, "");
        return Object.assign(auth.bind(null, token), {
          hook: hook.bind(null, token)
        });
      };
    }
  });

  // node_modules/@octokit/core/dist-node/index.js
  var require_dist_node4 = __commonJS({
    "node_modules/@octokit/core/dist-node/index.js"(exports, module) {
      "use strict";
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export2 = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var dist_src_exports = {};
      __export2(dist_src_exports, {
        Octokit: () => Octokit2
      });
      module.exports = __toCommonJS2(dist_src_exports);
      var import_universal_user_agent6 = require_dist_node();
      var import_before_after_hook = require_before_after_hook();
      var import_request4 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      var import_graphql = require_dist_node3();
      var import_auth_token = (init_dist_web4(), __toCommonJS(dist_web_exports3));
      var VERSION12 = "5.1.0";
      var noop2 = () => {
      };
      var consoleWarn = console.warn.bind(console);
      var consoleError = console.error.bind(console);
      var userAgentTrail = `octokit-core.js/${VERSION12} ${(0, import_universal_user_agent6.getUserAgent)()}`;
      var Octokit2 = class {
        static {
          this.VERSION = VERSION12;
        }
        static defaults(defaults) {
          const OctokitWithDefaults = class extends this {
            constructor(...args) {
              const options = args[0] || {};
              if (typeof defaults === "function") {
                super(defaults(options));
                return;
              }
              super(
                Object.assign(
                  {},
                  defaults,
                  options,
                  options.userAgent && defaults.userAgent ? {
                    userAgent: `${options.userAgent} ${defaults.userAgent}`
                  } : null
                )
              );
            }
          };
          return OctokitWithDefaults;
        }
        static {
          this.plugins = [];
        }
        /**
         * Attach a plugin (or many) to your Octokit instance.
         *
         * @example
         * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
         */
        static plugin(...newPlugins) {
          const currentPlugins = this.plugins;
          const NewOctokit = class extends this {
            static {
              this.plugins = currentPlugins.concat(
                newPlugins.filter((plugin) => !currentPlugins.includes(plugin))
              );
            }
          };
          return NewOctokit;
        }
        constructor(options = {}) {
          const hook5 = new import_before_after_hook.Collection();
          const requestDefaults = {
            baseUrl: import_request4.request.endpoint.DEFAULTS.baseUrl,
            headers: {},
            request: Object.assign({}, options.request, {
              // @ts-ignore internal usage only, no need to type
              hook: hook5.bind(null, "request")
            }),
            mediaType: {
              previews: [],
              format: ""
            }
          };
          requestDefaults.headers["user-agent"] = options.userAgent ? `${options.userAgent} ${userAgentTrail}` : userAgentTrail;
          if (options.baseUrl) {
            requestDefaults.baseUrl = options.baseUrl;
          }
          if (options.previews) {
            requestDefaults.mediaType.previews = options.previews;
          }
          if (options.timeZone) {
            requestDefaults.headers["time-zone"] = options.timeZone;
          }
          this.request = import_request4.request.defaults(requestDefaults);
          this.graphql = (0, import_graphql.withCustomRequest)(this.request).defaults(requestDefaults);
          this.log = Object.assign(
            {
              debug: noop2,
              info: noop2,
              warn: consoleWarn,
              error: consoleError
            },
            options.log
          );
          this.hook = hook5;
          if (!options.authStrategy) {
            if (!options.auth) {
              this.auth = async () => ({
                type: "unauthenticated"
              });
            } else {
              const auth6 = (0, import_auth_token.createTokenAuth)(options.auth);
              hook5.wrap("request", auth6.hook);
              this.auth = auth6;
            }
          } else {
            const { authStrategy, ...otherOptions } = options;
            const auth6 = authStrategy(
              Object.assign(
                {
                  request: this.request,
                  log: this.log,
                  // we pass the current octokit instance as well as its constructor options
                  // to allow for authentication strategies that return a new octokit instance
                  // that shares the same internal state as the current one. The original
                  // requirement for this was the "event-octokit" authentication strategy
                  // of https://github.com/probot/octokit-auth-probot.
                  octokit: this,
                  octokitOptions: otherOptions
                },
                options.auth
              )
            );
            hook5.wrap("request", auth6.hook);
            this.auth = auth6;
          }
          const classConstructor = this.constructor;
          for (let i4 = 0; i4 < classConstructor.plugins.length; ++i4) {
            Object.assign(this, classConstructor.plugins[i4](this, options));
          }
        }
      };
    }
  });

  // node_modules/bottleneck/light.js
  var require_light = __commonJS({
    "node_modules/bottleneck/light.js"(exports, module) {
      (function(global2, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.Bottleneck = factory();
      })(exports, function() {
        "use strict";
        var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
        function getCjsExportFromNamespace(n4) {
          return n4 && n4["default"] || n4;
        }
        var load = function(received, defaults, onto = {}) {
          var k3, ref, v3;
          for (k3 in defaults) {
            v3 = defaults[k3];
            onto[k3] = (ref = received[k3]) != null ? ref : v3;
          }
          return onto;
        };
        var overwrite = function(received, defaults, onto = {}) {
          var k3, v3;
          for (k3 in received) {
            v3 = received[k3];
            if (defaults[k3] !== void 0) {
              onto[k3] = v3;
            }
          }
          return onto;
        };
        var parser = {
          load,
          overwrite
        };
        var DLList;
        DLList = class DLList {
          constructor(incr, decr) {
            this.incr = incr;
            this.decr = decr;
            this._first = null;
            this._last = null;
            this.length = 0;
          }
          push(value) {
            var node;
            this.length++;
            if (typeof this.incr === "function") {
              this.incr();
            }
            node = {
              value,
              prev: this._last,
              next: null
            };
            if (this._last != null) {
              this._last.next = node;
              this._last = node;
            } else {
              this._first = this._last = node;
            }
            return void 0;
          }
          shift() {
            var value;
            if (this._first == null) {
              return;
            } else {
              this.length--;
              if (typeof this.decr === "function") {
                this.decr();
              }
            }
            value = this._first.value;
            if ((this._first = this._first.next) != null) {
              this._first.prev = null;
            } else {
              this._last = null;
            }
            return value;
          }
          first() {
            if (this._first != null) {
              return this._first.value;
            }
          }
          getArray() {
            var node, ref, results;
            node = this._first;
            results = [];
            while (node != null) {
              results.push((ref = node, node = node.next, ref.value));
            }
            return results;
          }
          forEachShift(cb) {
            var node;
            node = this.shift();
            while (node != null) {
              cb(node), node = this.shift();
            }
            return void 0;
          }
          debug() {
            var node, ref, ref1, ref2, results;
            node = this._first;
            results = [];
            while (node != null) {
              results.push((ref = node, node = node.next, {
                value: ref.value,
                prev: (ref1 = ref.prev) != null ? ref1.value : void 0,
                next: (ref2 = ref.next) != null ? ref2.value : void 0
              }));
            }
            return results;
          }
        };
        var DLList_1 = DLList;
        var Events;
        Events = class Events {
          constructor(instance) {
            this.instance = instance;
            this._events = {};
            if (this.instance.on != null || this.instance.once != null || this.instance.removeAllListeners != null) {
              throw new Error("An Emitter already exists for this object");
            }
            this.instance.on = (name, cb) => {
              return this._addListener(name, "many", cb);
            };
            this.instance.once = (name, cb) => {
              return this._addListener(name, "once", cb);
            };
            this.instance.removeAllListeners = (name = null) => {
              if (name != null) {
                return delete this._events[name];
              } else {
                return this._events = {};
              }
            };
          }
          _addListener(name, status, cb) {
            var base;
            if ((base = this._events)[name] == null) {
              base[name] = [];
            }
            this._events[name].push({ cb, status });
            return this.instance;
          }
          listenerCount(name) {
            if (this._events[name] != null) {
              return this._events[name].length;
            } else {
              return 0;
            }
          }
          async trigger(name, ...args) {
            var e3, promises;
            try {
              if (name !== "debug") {
                this.trigger("debug", `Event triggered: ${name}`, args);
              }
              if (this._events[name] == null) {
                return;
              }
              this._events[name] = this._events[name].filter(function(listener) {
                return listener.status !== "none";
              });
              promises = this._events[name].map(async (listener) => {
                var e4, returned;
                if (listener.status === "none") {
                  return;
                }
                if (listener.status === "once") {
                  listener.status = "none";
                }
                try {
                  returned = typeof listener.cb === "function" ? listener.cb(...args) : void 0;
                  if (typeof (returned != null ? returned.then : void 0) === "function") {
                    return await returned;
                  } else {
                    return returned;
                  }
                } catch (error) {
                  e4 = error;
                  {
                    this.trigger("error", e4);
                  }
                  return null;
                }
              });
              return (await Promise.all(promises)).find(function(x3) {
                return x3 != null;
              });
            } catch (error) {
              e3 = error;
              {
                this.trigger("error", e3);
              }
              return null;
            }
          }
        };
        var Events_1 = Events;
        var DLList$1, Events$1, Queues;
        DLList$1 = DLList_1;
        Events$1 = Events_1;
        Queues = class Queues {
          constructor(num_priorities) {
            var i4;
            this.Events = new Events$1(this);
            this._length = 0;
            this._lists = function() {
              var j2, ref, results;
              results = [];
              for (i4 = j2 = 1, ref = num_priorities; 1 <= ref ? j2 <= ref : j2 >= ref; i4 = 1 <= ref ? ++j2 : --j2) {
                results.push(new DLList$1(() => {
                  return this.incr();
                }, () => {
                  return this.decr();
                }));
              }
              return results;
            }.call(this);
          }
          incr() {
            if (this._length++ === 0) {
              return this.Events.trigger("leftzero");
            }
          }
          decr() {
            if (--this._length === 0) {
              return this.Events.trigger("zero");
            }
          }
          push(job) {
            return this._lists[job.options.priority].push(job);
          }
          queued(priority) {
            if (priority != null) {
              return this._lists[priority].length;
            } else {
              return this._length;
            }
          }
          shiftAll(fn) {
            return this._lists.forEach(function(list) {
              return list.forEachShift(fn);
            });
          }
          getFirst(arr = this._lists) {
            var j2, len, list;
            for (j2 = 0, len = arr.length; j2 < len; j2++) {
              list = arr[j2];
              if (list.length > 0) {
                return list;
              }
            }
            return [];
          }
          shiftLastFrom(priority) {
            return this.getFirst(this._lists.slice(priority).reverse()).shift();
          }
        };
        var Queues_1 = Queues;
        var BottleneckError;
        BottleneckError = class BottleneckError extends Error {
        };
        var BottleneckError_1 = BottleneckError;
        var BottleneckError$1, DEFAULT_PRIORITY, Job, NUM_PRIORITIES, parser$1;
        NUM_PRIORITIES = 10;
        DEFAULT_PRIORITY = 5;
        parser$1 = parser;
        BottleneckError$1 = BottleneckError_1;
        Job = class Job {
          constructor(task, args, options, jobDefaults, rejectOnDrop, Events2, _states, Promise2) {
            this.task = task;
            this.args = args;
            this.rejectOnDrop = rejectOnDrop;
            this.Events = Events2;
            this._states = _states;
            this.Promise = Promise2;
            this.options = parser$1.load(options, jobDefaults);
            this.options.priority = this._sanitizePriority(this.options.priority);
            if (this.options.id === jobDefaults.id) {
              this.options.id = `${this.options.id}-${this._randomIndex()}`;
            }
            this.promise = new this.Promise((_resolve, _reject) => {
              this._resolve = _resolve;
              this._reject = _reject;
            });
            this.retryCount = 0;
          }
          _sanitizePriority(priority) {
            var sProperty;
            sProperty = ~~priority !== priority ? DEFAULT_PRIORITY : priority;
            if (sProperty < 0) {
              return 0;
            } else if (sProperty > NUM_PRIORITIES - 1) {
              return NUM_PRIORITIES - 1;
            } else {
              return sProperty;
            }
          }
          _randomIndex() {
            return Math.random().toString(36).slice(2);
          }
          doDrop({ error, message = "This job has been dropped by Bottleneck" } = {}) {
            if (this._states.remove(this.options.id)) {
              if (this.rejectOnDrop) {
                this._reject(error != null ? error : new BottleneckError$1(message));
              }
              this.Events.trigger("dropped", { args: this.args, options: this.options, task: this.task, promise: this.promise });
              return true;
            } else {
              return false;
            }
          }
          _assertStatus(expected) {
            var status;
            status = this._states.jobStatus(this.options.id);
            if (!(status === expected || expected === "DONE" && status === null)) {
              throw new BottleneckError$1(`Invalid job status ${status}, expected ${expected}. Please open an issue at https://github.com/SGrondin/bottleneck/issues`);
            }
          }
          doReceive() {
            this._states.start(this.options.id);
            return this.Events.trigger("received", { args: this.args, options: this.options });
          }
          doQueue(reachedHWM, blocked) {
            this._assertStatus("RECEIVED");
            this._states.next(this.options.id);
            return this.Events.trigger("queued", { args: this.args, options: this.options, reachedHWM, blocked });
          }
          doRun() {
            if (this.retryCount === 0) {
              this._assertStatus("QUEUED");
              this._states.next(this.options.id);
            } else {
              this._assertStatus("EXECUTING");
            }
            return this.Events.trigger("scheduled", { args: this.args, options: this.options });
          }
          async doExecute(chained, clearGlobalState, run, free) {
            var error, eventInfo, passed;
            if (this.retryCount === 0) {
              this._assertStatus("RUNNING");
              this._states.next(this.options.id);
            } else {
              this._assertStatus("EXECUTING");
            }
            eventInfo = { args: this.args, options: this.options, retryCount: this.retryCount };
            this.Events.trigger("executing", eventInfo);
            try {
              passed = await (chained != null ? chained.schedule(this.options, this.task, ...this.args) : this.task(...this.args));
              if (clearGlobalState()) {
                this.doDone(eventInfo);
                await free(this.options, eventInfo);
                this._assertStatus("DONE");
                return this._resolve(passed);
              }
            } catch (error1) {
              error = error1;
              return this._onFailure(error, eventInfo, clearGlobalState, run, free);
            }
          }
          doExpire(clearGlobalState, run, free) {
            var error, eventInfo;
            if (this._states.jobStatus(this.options.id === "RUNNING")) {
              this._states.next(this.options.id);
            }
            this._assertStatus("EXECUTING");
            eventInfo = { args: this.args, options: this.options, retryCount: this.retryCount };
            error = new BottleneckError$1(`This job timed out after ${this.options.expiration} ms.`);
            return this._onFailure(error, eventInfo, clearGlobalState, run, free);
          }
          async _onFailure(error, eventInfo, clearGlobalState, run, free) {
            var retry2, retryAfter;
            if (clearGlobalState()) {
              retry2 = await this.Events.trigger("failed", error, eventInfo);
              if (retry2 != null) {
                retryAfter = ~~retry2;
                this.Events.trigger("retry", `Retrying ${this.options.id} after ${retryAfter} ms`, eventInfo);
                this.retryCount++;
                return run(retryAfter);
              } else {
                this.doDone(eventInfo);
                await free(this.options, eventInfo);
                this._assertStatus("DONE");
                return this._reject(error);
              }
            }
          }
          doDone(eventInfo) {
            this._assertStatus("EXECUTING");
            this._states.next(this.options.id);
            return this.Events.trigger("done", eventInfo);
          }
        };
        var Job_1 = Job;
        var BottleneckError$2, LocalDatastore, parser$2;
        parser$2 = parser;
        BottleneckError$2 = BottleneckError_1;
        LocalDatastore = class LocalDatastore {
          constructor(instance, storeOptions, storeInstanceOptions) {
            this.instance = instance;
            this.storeOptions = storeOptions;
            this.clientId = this.instance._randomIndex();
            parser$2.load(storeInstanceOptions, storeInstanceOptions, this);
            this._nextRequest = this._lastReservoirRefresh = this._lastReservoirIncrease = Date.now();
            this._running = 0;
            this._done = 0;
            this._unblockTime = 0;
            this.ready = this.Promise.resolve();
            this.clients = {};
            this._startHeartbeat();
          }
          _startHeartbeat() {
            var base;
            if (this.heartbeat == null && (this.storeOptions.reservoirRefreshInterval != null && this.storeOptions.reservoirRefreshAmount != null || this.storeOptions.reservoirIncreaseInterval != null && this.storeOptions.reservoirIncreaseAmount != null)) {
              return typeof (base = this.heartbeat = setInterval(() => {
                var amount, incr, maximum, now, reservoir;
                now = Date.now();
                if (this.storeOptions.reservoirRefreshInterval != null && now >= this._lastReservoirRefresh + this.storeOptions.reservoirRefreshInterval) {
                  this._lastReservoirRefresh = now;
                  this.storeOptions.reservoir = this.storeOptions.reservoirRefreshAmount;
                  this.instance._drainAll(this.computeCapacity());
                }
                if (this.storeOptions.reservoirIncreaseInterval != null && now >= this._lastReservoirIncrease + this.storeOptions.reservoirIncreaseInterval) {
                  ({
                    reservoirIncreaseAmount: amount,
                    reservoirIncreaseMaximum: maximum,
                    reservoir
                  } = this.storeOptions);
                  this._lastReservoirIncrease = now;
                  incr = maximum != null ? Math.min(amount, maximum - reservoir) : amount;
                  if (incr > 0) {
                    this.storeOptions.reservoir += incr;
                    return this.instance._drainAll(this.computeCapacity());
                  }
                }
              }, this.heartbeatInterval)).unref === "function" ? base.unref() : void 0;
            } else {
              return clearInterval(this.heartbeat);
            }
          }
          async __publish__(message) {
            await this.yieldLoop();
            return this.instance.Events.trigger("message", message.toString());
          }
          async __disconnect__(flush) {
            await this.yieldLoop();
            clearInterval(this.heartbeat);
            return this.Promise.resolve();
          }
          yieldLoop(t3 = 0) {
            return new this.Promise(function(resolve, reject) {
              return setTimeout(resolve, t3);
            });
          }
          computePenalty() {
            var ref;
            return (ref = this.storeOptions.penalty) != null ? ref : 15 * this.storeOptions.minTime || 5e3;
          }
          async __updateSettings__(options) {
            await this.yieldLoop();
            parser$2.overwrite(options, options, this.storeOptions);
            this._startHeartbeat();
            this.instance._drainAll(this.computeCapacity());
            return true;
          }
          async __running__() {
            await this.yieldLoop();
            return this._running;
          }
          async __queued__() {
            await this.yieldLoop();
            return this.instance.queued();
          }
          async __done__() {
            await this.yieldLoop();
            return this._done;
          }
          async __groupCheck__(time) {
            await this.yieldLoop();
            return this._nextRequest + this.timeout < time;
          }
          computeCapacity() {
            var maxConcurrent, reservoir;
            ({ maxConcurrent, reservoir } = this.storeOptions);
            if (maxConcurrent != null && reservoir != null) {
              return Math.min(maxConcurrent - this._running, reservoir);
            } else if (maxConcurrent != null) {
              return maxConcurrent - this._running;
            } else if (reservoir != null) {
              return reservoir;
            } else {
              return null;
            }
          }
          conditionsCheck(weight) {
            var capacity;
            capacity = this.computeCapacity();
            return capacity == null || weight <= capacity;
          }
          async __incrementReservoir__(incr) {
            var reservoir;
            await this.yieldLoop();
            reservoir = this.storeOptions.reservoir += incr;
            this.instance._drainAll(this.computeCapacity());
            return reservoir;
          }
          async __currentReservoir__() {
            await this.yieldLoop();
            return this.storeOptions.reservoir;
          }
          isBlocked(now) {
            return this._unblockTime >= now;
          }
          check(weight, now) {
            return this.conditionsCheck(weight) && this._nextRequest - now <= 0;
          }
          async __check__(weight) {
            var now;
            await this.yieldLoop();
            now = Date.now();
            return this.check(weight, now);
          }
          async __register__(index, weight, expiration) {
            var now, wait2;
            await this.yieldLoop();
            now = Date.now();
            if (this.conditionsCheck(weight)) {
              this._running += weight;
              if (this.storeOptions.reservoir != null) {
                this.storeOptions.reservoir -= weight;
              }
              wait2 = Math.max(this._nextRequest - now, 0);
              this._nextRequest = now + wait2 + this.storeOptions.minTime;
              return {
                success: true,
                wait: wait2,
                reservoir: this.storeOptions.reservoir
              };
            } else {
              return {
                success: false
              };
            }
          }
          strategyIsBlock() {
            return this.storeOptions.strategy === 3;
          }
          async __submit__(queueLength, weight) {
            var blocked, now, reachedHWM;
            await this.yieldLoop();
            if (this.storeOptions.maxConcurrent != null && weight > this.storeOptions.maxConcurrent) {
              throw new BottleneckError$2(`Impossible to add a job having a weight of ${weight} to a limiter having a maxConcurrent setting of ${this.storeOptions.maxConcurrent}`);
            }
            now = Date.now();
            reachedHWM = this.storeOptions.highWater != null && queueLength === this.storeOptions.highWater && !this.check(weight, now);
            blocked = this.strategyIsBlock() && (reachedHWM || this.isBlocked(now));
            if (blocked) {
              this._unblockTime = now + this.computePenalty();
              this._nextRequest = this._unblockTime + this.storeOptions.minTime;
              this.instance._dropAllQueued();
            }
            return {
              reachedHWM,
              blocked,
              strategy: this.storeOptions.strategy
            };
          }
          async __free__(index, weight) {
            await this.yieldLoop();
            this._running -= weight;
            this._done += weight;
            this.instance._drainAll(this.computeCapacity());
            return {
              running: this._running
            };
          }
        };
        var LocalDatastore_1 = LocalDatastore;
        var BottleneckError$3, States;
        BottleneckError$3 = BottleneckError_1;
        States = class States {
          constructor(status1) {
            this.status = status1;
            this._jobs = {};
            this.counts = this.status.map(function() {
              return 0;
            });
          }
          next(id) {
            var current, next;
            current = this._jobs[id];
            next = current + 1;
            if (current != null && next < this.status.length) {
              this.counts[current]--;
              this.counts[next]++;
              return this._jobs[id]++;
            } else if (current != null) {
              this.counts[current]--;
              return delete this._jobs[id];
            }
          }
          start(id) {
            var initial;
            initial = 0;
            this._jobs[id] = initial;
            return this.counts[initial]++;
          }
          remove(id) {
            var current;
            current = this._jobs[id];
            if (current != null) {
              this.counts[current]--;
              delete this._jobs[id];
            }
            return current != null;
          }
          jobStatus(id) {
            var ref;
            return (ref = this.status[this._jobs[id]]) != null ? ref : null;
          }
          statusJobs(status) {
            var k3, pos, ref, results, v3;
            if (status != null) {
              pos = this.status.indexOf(status);
              if (pos < 0) {
                throw new BottleneckError$3(`status must be one of ${this.status.join(", ")}`);
              }
              ref = this._jobs;
              results = [];
              for (k3 in ref) {
                v3 = ref[k3];
                if (v3 === pos) {
                  results.push(k3);
                }
              }
              return results;
            } else {
              return Object.keys(this._jobs);
            }
          }
          statusCounts() {
            return this.counts.reduce((acc, v3, i4) => {
              acc[this.status[i4]] = v3;
              return acc;
            }, {});
          }
        };
        var States_1 = States;
        var DLList$2, Sync;
        DLList$2 = DLList_1;
        Sync = class Sync {
          constructor(name, Promise2) {
            this.schedule = this.schedule.bind(this);
            this.name = name;
            this.Promise = Promise2;
            this._running = 0;
            this._queue = new DLList$2();
          }
          isEmpty() {
            return this._queue.length === 0;
          }
          async _tryToRun() {
            var args, cb, error, reject, resolve, returned, task;
            if (this._running < 1 && this._queue.length > 0) {
              this._running++;
              ({ task, args, resolve, reject } = this._queue.shift());
              cb = await async function() {
                try {
                  returned = await task(...args);
                  return function() {
                    return resolve(returned);
                  };
                } catch (error1) {
                  error = error1;
                  return function() {
                    return reject(error);
                  };
                }
              }();
              this._running--;
              this._tryToRun();
              return cb();
            }
          }
          schedule(task, ...args) {
            var promise, reject, resolve;
            resolve = reject = null;
            promise = new this.Promise(function(_resolve, _reject) {
              resolve = _resolve;
              return reject = _reject;
            });
            this._queue.push({ task, args, resolve, reject });
            this._tryToRun();
            return promise;
          }
        };
        var Sync_1 = Sync;
        var version = "2.19.5";
        var version$1 = {
          version
        };
        var version$2 = /* @__PURE__ */ Object.freeze({
          version,
          default: version$1
        });
        var require$$2 = () => console.log("You must import the full version of Bottleneck in order to use this feature.");
        var require$$3 = () => console.log("You must import the full version of Bottleneck in order to use this feature.");
        var require$$4 = () => console.log("You must import the full version of Bottleneck in order to use this feature.");
        var Events$2, Group, IORedisConnection$1, RedisConnection$1, Scripts$1, parser$3;
        parser$3 = parser;
        Events$2 = Events_1;
        RedisConnection$1 = require$$2;
        IORedisConnection$1 = require$$3;
        Scripts$1 = require$$4;
        Group = function() {
          class Group2 {
            constructor(limiterOptions = {}) {
              this.deleteKey = this.deleteKey.bind(this);
              this.limiterOptions = limiterOptions;
              parser$3.load(this.limiterOptions, this.defaults, this);
              this.Events = new Events$2(this);
              this.instances = {};
              this.Bottleneck = Bottleneck_1;
              this._startAutoCleanup();
              this.sharedConnection = this.connection != null;
              if (this.connection == null) {
                if (this.limiterOptions.datastore === "redis") {
                  this.connection = new RedisConnection$1(Object.assign({}, this.limiterOptions, { Events: this.Events }));
                } else if (this.limiterOptions.datastore === "ioredis") {
                  this.connection = new IORedisConnection$1(Object.assign({}, this.limiterOptions, { Events: this.Events }));
                }
              }
            }
            key(key = "") {
              var ref;
              return (ref = this.instances[key]) != null ? ref : (() => {
                var limiter;
                limiter = this.instances[key] = new this.Bottleneck(Object.assign(this.limiterOptions, {
                  id: `${this.id}-${key}`,
                  timeout: this.timeout,
                  connection: this.connection
                }));
                this.Events.trigger("created", limiter, key);
                return limiter;
              })();
            }
            async deleteKey(key = "") {
              var deleted, instance;
              instance = this.instances[key];
              if (this.connection) {
                deleted = await this.connection.__runCommand__(["del", ...Scripts$1.allKeys(`${this.id}-${key}`)]);
              }
              if (instance != null) {
                delete this.instances[key];
                await instance.disconnect();
              }
              return instance != null || deleted > 0;
            }
            limiters() {
              var k3, ref, results, v3;
              ref = this.instances;
              results = [];
              for (k3 in ref) {
                v3 = ref[k3];
                results.push({
                  key: k3,
                  limiter: v3
                });
              }
              return results;
            }
            keys() {
              return Object.keys(this.instances);
            }
            async clusterKeys() {
              var cursor, end, found, i4, k3, keys, len, next, start;
              if (this.connection == null) {
                return this.Promise.resolve(this.keys());
              }
              keys = [];
              cursor = null;
              start = `b_${this.id}-`.length;
              end = "_settings".length;
              while (cursor !== 0) {
                [next, found] = await this.connection.__runCommand__(["scan", cursor != null ? cursor : 0, "match", `b_${this.id}-*_settings`, "count", 1e4]);
                cursor = ~~next;
                for (i4 = 0, len = found.length; i4 < len; i4++) {
                  k3 = found[i4];
                  keys.push(k3.slice(start, -end));
                }
              }
              return keys;
            }
            _startAutoCleanup() {
              var base;
              clearInterval(this.interval);
              return typeof (base = this.interval = setInterval(async () => {
                var e3, k3, ref, results, time, v3;
                time = Date.now();
                ref = this.instances;
                results = [];
                for (k3 in ref) {
                  v3 = ref[k3];
                  try {
                    if (await v3._store.__groupCheck__(time)) {
                      results.push(this.deleteKey(k3));
                    } else {
                      results.push(void 0);
                    }
                  } catch (error) {
                    e3 = error;
                    results.push(v3.Events.trigger("error", e3));
                  }
                }
                return results;
              }, this.timeout / 2)).unref === "function" ? base.unref() : void 0;
            }
            updateSettings(options = {}) {
              parser$3.overwrite(options, this.defaults, this);
              parser$3.overwrite(options, options, this.limiterOptions);
              if (options.timeout != null) {
                return this._startAutoCleanup();
              }
            }
            disconnect(flush = true) {
              var ref;
              if (!this.sharedConnection) {
                return (ref = this.connection) != null ? ref.disconnect(flush) : void 0;
              }
            }
          }
          Group2.prototype.defaults = {
            timeout: 1e3 * 60 * 5,
            connection: null,
            Promise,
            id: "group-key"
          };
          return Group2;
        }.call(commonjsGlobal);
        var Group_1 = Group;
        var Batcher, Events$3, parser$4;
        parser$4 = parser;
        Events$3 = Events_1;
        Batcher = function() {
          class Batcher2 {
            constructor(options = {}) {
              this.options = options;
              parser$4.load(this.options, this.defaults, this);
              this.Events = new Events$3(this);
              this._arr = [];
              this._resetPromise();
              this._lastFlush = Date.now();
            }
            _resetPromise() {
              return this._promise = new this.Promise((res, rej) => {
                return this._resolve = res;
              });
            }
            _flush() {
              clearTimeout(this._timeout);
              this._lastFlush = Date.now();
              this._resolve();
              this.Events.trigger("batch", this._arr);
              this._arr = [];
              return this._resetPromise();
            }
            add(data) {
              var ret;
              this._arr.push(data);
              ret = this._promise;
              if (this._arr.length === this.maxSize) {
                this._flush();
              } else if (this.maxTime != null && this._arr.length === 1) {
                this._timeout = setTimeout(() => {
                  return this._flush();
                }, this.maxTime);
              }
              return ret;
            }
          }
          Batcher2.prototype.defaults = {
            maxTime: null,
            maxSize: null,
            Promise
          };
          return Batcher2;
        }.call(commonjsGlobal);
        var Batcher_1 = Batcher;
        var require$$4$1 = () => console.log("You must import the full version of Bottleneck in order to use this feature.");
        var require$$8 = getCjsExportFromNamespace(version$2);
        var Bottleneck2, DEFAULT_PRIORITY$1, Events$4, Job$1, LocalDatastore$1, NUM_PRIORITIES$1, Queues$1, RedisDatastore$1, States$1, Sync$1, parser$5, splice = [].splice;
        NUM_PRIORITIES$1 = 10;
        DEFAULT_PRIORITY$1 = 5;
        parser$5 = parser;
        Queues$1 = Queues_1;
        Job$1 = Job_1;
        LocalDatastore$1 = LocalDatastore_1;
        RedisDatastore$1 = require$$4$1;
        Events$4 = Events_1;
        States$1 = States_1;
        Sync$1 = Sync_1;
        Bottleneck2 = function() {
          class Bottleneck3 {
            constructor(options = {}, ...invalid) {
              var storeInstanceOptions, storeOptions;
              this._addToQueue = this._addToQueue.bind(this);
              this._validateOptions(options, invalid);
              parser$5.load(options, this.instanceDefaults, this);
              this._queues = new Queues$1(NUM_PRIORITIES$1);
              this._scheduled = {};
              this._states = new States$1(["RECEIVED", "QUEUED", "RUNNING", "EXECUTING"].concat(this.trackDoneStatus ? ["DONE"] : []));
              this._limiter = null;
              this.Events = new Events$4(this);
              this._submitLock = new Sync$1("submit", this.Promise);
              this._registerLock = new Sync$1("register", this.Promise);
              storeOptions = parser$5.load(options, this.storeDefaults, {});
              this._store = function() {
                if (this.datastore === "redis" || this.datastore === "ioredis" || this.connection != null) {
                  storeInstanceOptions = parser$5.load(options, this.redisStoreDefaults, {});
                  return new RedisDatastore$1(this, storeOptions, storeInstanceOptions);
                } else if (this.datastore === "local") {
                  storeInstanceOptions = parser$5.load(options, this.localStoreDefaults, {});
                  return new LocalDatastore$1(this, storeOptions, storeInstanceOptions);
                } else {
                  throw new Bottleneck3.prototype.BottleneckError(`Invalid datastore type: ${this.datastore}`);
                }
              }.call(this);
              this._queues.on("leftzero", () => {
                var ref;
                return (ref = this._store.heartbeat) != null ? typeof ref.ref === "function" ? ref.ref() : void 0 : void 0;
              });
              this._queues.on("zero", () => {
                var ref;
                return (ref = this._store.heartbeat) != null ? typeof ref.unref === "function" ? ref.unref() : void 0 : void 0;
              });
            }
            _validateOptions(options, invalid) {
              if (!(options != null && typeof options === "object" && invalid.length === 0)) {
                throw new Bottleneck3.prototype.BottleneckError("Bottleneck v2 takes a single object argument. Refer to https://github.com/SGrondin/bottleneck#upgrading-to-v2 if you're upgrading from Bottleneck v1.");
              }
            }
            ready() {
              return this._store.ready;
            }
            clients() {
              return this._store.clients;
            }
            channel() {
              return `b_${this.id}`;
            }
            channel_client() {
              return `b_${this.id}_${this._store.clientId}`;
            }
            publish(message) {
              return this._store.__publish__(message);
            }
            disconnect(flush = true) {
              return this._store.__disconnect__(flush);
            }
            chain(_limiter) {
              this._limiter = _limiter;
              return this;
            }
            queued(priority) {
              return this._queues.queued(priority);
            }
            clusterQueued() {
              return this._store.__queued__();
            }
            empty() {
              return this.queued() === 0 && this._submitLock.isEmpty();
            }
            running() {
              return this._store.__running__();
            }
            done() {
              return this._store.__done__();
            }
            jobStatus(id) {
              return this._states.jobStatus(id);
            }
            jobs(status) {
              return this._states.statusJobs(status);
            }
            counts() {
              return this._states.statusCounts();
            }
            _randomIndex() {
              return Math.random().toString(36).slice(2);
            }
            check(weight = 1) {
              return this._store.__check__(weight);
            }
            _clearGlobalState(index) {
              if (this._scheduled[index] != null) {
                clearTimeout(this._scheduled[index].expiration);
                delete this._scheduled[index];
                return true;
              } else {
                return false;
              }
            }
            async _free(index, job, options, eventInfo) {
              var e3, running;
              try {
                ({ running } = await this._store.__free__(index, options.weight));
                this.Events.trigger("debug", `Freed ${options.id}`, eventInfo);
                if (running === 0 && this.empty()) {
                  return this.Events.trigger("idle");
                }
              } catch (error1) {
                e3 = error1;
                return this.Events.trigger("error", e3);
              }
            }
            _run(index, job, wait2) {
              var clearGlobalState, free, run;
              job.doRun();
              clearGlobalState = this._clearGlobalState.bind(this, index);
              run = this._run.bind(this, index, job);
              free = this._free.bind(this, index, job);
              return this._scheduled[index] = {
                timeout: setTimeout(() => {
                  return job.doExecute(this._limiter, clearGlobalState, run, free);
                }, wait2),
                expiration: job.options.expiration != null ? setTimeout(function() {
                  return job.doExpire(clearGlobalState, run, free);
                }, wait2 + job.options.expiration) : void 0,
                job
              };
            }
            _drainOne(capacity) {
              return this._registerLock.schedule(() => {
                var args, index, next, options, queue;
                if (this.queued() === 0) {
                  return this.Promise.resolve(null);
                }
                queue = this._queues.getFirst();
                ({ options, args } = next = queue.first());
                if (capacity != null && options.weight > capacity) {
                  return this.Promise.resolve(null);
                }
                this.Events.trigger("debug", `Draining ${options.id}`, { args, options });
                index = this._randomIndex();
                return this._store.__register__(index, options.weight, options.expiration).then(({ success, wait: wait2, reservoir }) => {
                  var empty;
                  this.Events.trigger("debug", `Drained ${options.id}`, { success, args, options });
                  if (success) {
                    queue.shift();
                    empty = this.empty();
                    if (empty) {
                      this.Events.trigger("empty");
                    }
                    if (reservoir === 0) {
                      this.Events.trigger("depleted", empty);
                    }
                    this._run(index, next, wait2);
                    return this.Promise.resolve(options.weight);
                  } else {
                    return this.Promise.resolve(null);
                  }
                });
              });
            }
            _drainAll(capacity, total = 0) {
              return this._drainOne(capacity).then((drained) => {
                var newCapacity;
                if (drained != null) {
                  newCapacity = capacity != null ? capacity - drained : capacity;
                  return this._drainAll(newCapacity, total + drained);
                } else {
                  return this.Promise.resolve(total);
                }
              }).catch((e3) => {
                return this.Events.trigger("error", e3);
              });
            }
            _dropAllQueued(message) {
              return this._queues.shiftAll(function(job) {
                return job.doDrop({ message });
              });
            }
            stop(options = {}) {
              var done, waitForExecuting;
              options = parser$5.load(options, this.stopDefaults);
              waitForExecuting = (at) => {
                var finished;
                finished = () => {
                  var counts;
                  counts = this._states.counts;
                  return counts[0] + counts[1] + counts[2] + counts[3] === at;
                };
                return new this.Promise((resolve, reject) => {
                  if (finished()) {
                    return resolve();
                  } else {
                    return this.on("done", () => {
                      if (finished()) {
                        this.removeAllListeners("done");
                        return resolve();
                      }
                    });
                  }
                });
              };
              done = options.dropWaitingJobs ? (this._run = function(index, next) {
                return next.doDrop({
                  message: options.dropErrorMessage
                });
              }, this._drainOne = () => {
                return this.Promise.resolve(null);
              }, this._registerLock.schedule(() => {
                return this._submitLock.schedule(() => {
                  var k3, ref, v3;
                  ref = this._scheduled;
                  for (k3 in ref) {
                    v3 = ref[k3];
                    if (this.jobStatus(v3.job.options.id) === "RUNNING") {
                      clearTimeout(v3.timeout);
                      clearTimeout(v3.expiration);
                      v3.job.doDrop({
                        message: options.dropErrorMessage
                      });
                    }
                  }
                  this._dropAllQueued(options.dropErrorMessage);
                  return waitForExecuting(0);
                });
              })) : this.schedule({
                priority: NUM_PRIORITIES$1 - 1,
                weight: 0
              }, () => {
                return waitForExecuting(1);
              });
              this._receive = function(job) {
                return job._reject(new Bottleneck3.prototype.BottleneckError(options.enqueueErrorMessage));
              };
              this.stop = () => {
                return this.Promise.reject(new Bottleneck3.prototype.BottleneckError("stop() has already been called"));
              };
              return done;
            }
            async _addToQueue(job) {
              var args, blocked, error, options, reachedHWM, shifted, strategy;
              ({ args, options } = job);
              try {
                ({ reachedHWM, blocked, strategy } = await this._store.__submit__(this.queued(), options.weight));
              } catch (error1) {
                error = error1;
                this.Events.trigger("debug", `Could not queue ${options.id}`, { args, options, error });
                job.doDrop({ error });
                return false;
              }
              if (blocked) {
                job.doDrop();
                return true;
              } else if (reachedHWM) {
                shifted = strategy === Bottleneck3.prototype.strategy.LEAK ? this._queues.shiftLastFrom(options.priority) : strategy === Bottleneck3.prototype.strategy.OVERFLOW_PRIORITY ? this._queues.shiftLastFrom(options.priority + 1) : strategy === Bottleneck3.prototype.strategy.OVERFLOW ? job : void 0;
                if (shifted != null) {
                  shifted.doDrop();
                }
                if (shifted == null || strategy === Bottleneck3.prototype.strategy.OVERFLOW) {
                  if (shifted == null) {
                    job.doDrop();
                  }
                  return reachedHWM;
                }
              }
              job.doQueue(reachedHWM, blocked);
              this._queues.push(job);
              await this._drainAll();
              return reachedHWM;
            }
            _receive(job) {
              if (this._states.jobStatus(job.options.id) != null) {
                job._reject(new Bottleneck3.prototype.BottleneckError(`A job with the same id already exists (id=${job.options.id})`));
                return false;
              } else {
                job.doReceive();
                return this._submitLock.schedule(this._addToQueue, job);
              }
            }
            submit(...args) {
              var cb, fn, job, options, ref, ref1, task;
              if (typeof args[0] === "function") {
                ref = args, [fn, ...args] = ref, [cb] = splice.call(args, -1);
                options = parser$5.load({}, this.jobDefaults);
              } else {
                ref1 = args, [options, fn, ...args] = ref1, [cb] = splice.call(args, -1);
                options = parser$5.load(options, this.jobDefaults);
              }
              task = (...args2) => {
                return new this.Promise(function(resolve, reject) {
                  return fn(...args2, function(...args3) {
                    return (args3[0] != null ? reject : resolve)(args3);
                  });
                });
              };
              job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
              job.promise.then(function(args2) {
                return typeof cb === "function" ? cb(...args2) : void 0;
              }).catch(function(args2) {
                if (Array.isArray(args2)) {
                  return typeof cb === "function" ? cb(...args2) : void 0;
                } else {
                  return typeof cb === "function" ? cb(args2) : void 0;
                }
              });
              return this._receive(job);
            }
            schedule(...args) {
              var job, options, task;
              if (typeof args[0] === "function") {
                [task, ...args] = args;
                options = {};
              } else {
                [options, task, ...args] = args;
              }
              job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
              this._receive(job);
              return job.promise;
            }
            wrap(fn) {
              var schedule, wrapped;
              schedule = this.schedule.bind(this);
              wrapped = function(...args) {
                return schedule(fn.bind(this), ...args);
              };
              wrapped.withOptions = function(options, ...args) {
                return schedule(options, fn, ...args);
              };
              return wrapped;
            }
            async updateSettings(options = {}) {
              await this._store.__updateSettings__(parser$5.overwrite(options, this.storeDefaults));
              parser$5.overwrite(options, this.instanceDefaults, this);
              return this;
            }
            currentReservoir() {
              return this._store.__currentReservoir__();
            }
            incrementReservoir(incr = 0) {
              return this._store.__incrementReservoir__(incr);
            }
          }
          Bottleneck3.default = Bottleneck3;
          Bottleneck3.Events = Events$4;
          Bottleneck3.version = Bottleneck3.prototype.version = require$$8.version;
          Bottleneck3.strategy = Bottleneck3.prototype.strategy = {
            LEAK: 1,
            OVERFLOW: 2,
            OVERFLOW_PRIORITY: 4,
            BLOCK: 3
          };
          Bottleneck3.BottleneckError = Bottleneck3.prototype.BottleneckError = BottleneckError_1;
          Bottleneck3.Group = Bottleneck3.prototype.Group = Group_1;
          Bottleneck3.RedisConnection = Bottleneck3.prototype.RedisConnection = require$$2;
          Bottleneck3.IORedisConnection = Bottleneck3.prototype.IORedisConnection = require$$3;
          Bottleneck3.Batcher = Bottleneck3.prototype.Batcher = Batcher_1;
          Bottleneck3.prototype.jobDefaults = {
            priority: DEFAULT_PRIORITY$1,
            weight: 1,
            expiration: null,
            id: "<no-id>"
          };
          Bottleneck3.prototype.storeDefaults = {
            maxConcurrent: null,
            minTime: 0,
            highWater: null,
            strategy: Bottleneck3.prototype.strategy.LEAK,
            penalty: null,
            reservoir: null,
            reservoirRefreshInterval: null,
            reservoirRefreshAmount: null,
            reservoirIncreaseInterval: null,
            reservoirIncreaseAmount: null,
            reservoirIncreaseMaximum: null
          };
          Bottleneck3.prototype.localStoreDefaults = {
            Promise,
            timeout: null,
            heartbeatInterval: 250
          };
          Bottleneck3.prototype.redisStoreDefaults = {
            Promise,
            timeout: null,
            heartbeatInterval: 5e3,
            clientTimeout: 1e4,
            Redis: null,
            clientOptions: {},
            clusterNodes: null,
            clearDatastore: false,
            connection: null
          };
          Bottleneck3.prototype.instanceDefaults = {
            datastore: "local",
            connection: null,
            id: "<no-id>",
            rejectOnDrop: true,
            trackDoneStatus: false,
            Promise
          };
          Bottleneck3.prototype.stopDefaults = {
            enqueueErrorMessage: "This limiter has been stopped and cannot accept new jobs.",
            dropWaitingJobs: true,
            dropErrorMessage: "This limiter has been stopped."
          };
          return Bottleneck3;
        }.call(commonjsGlobal);
        var Bottleneck_1 = Bottleneck2;
        var lib = Bottleneck_1;
        return lib;
      });
    }
  });

  // node_modules/btoa-lite/btoa-browser.js
  var require_btoa_browser = __commonJS({
    "node_modules/btoa-lite/btoa-browser.js"(exports, module) {
      module.exports = function _btoa(str) {
        return btoa(str);
      };
    }
  });

  // node_modules/@octokit/oauth-authorization-url/dist-web/index.js
  var dist_web_exports4 = {};
  __export(dist_web_exports4, {
    oauthAuthorizationUrl: () => oauthAuthorizationUrl
  });
  function oauthAuthorizationUrl(options) {
    const clientType = options.clientType || "oauth-app";
    const baseUrl = options.baseUrl || "https://github.com";
    const result = {
      clientType,
      allowSignup: options.allowSignup === false ? false : true,
      clientId: options.clientId,
      login: options.login || null,
      redirectUrl: options.redirectUrl || null,
      state: options.state || Math.random().toString(36).substr(2),
      url: ""
    };
    if (clientType === "oauth-app") {
      const scopes = "scopes" in options ? options.scopes : [];
      result.scopes = typeof scopes === "string" ? scopes.split(/[,\s]+/).filter(Boolean) : scopes;
    }
    result.url = urlBuilderAuthorize(`${baseUrl}/login/oauth/authorize`, result);
    return result;
  }
  function urlBuilderAuthorize(base, options) {
    const map = {
      allowSignup: "allow_signup",
      clientId: "client_id",
      login: "login",
      redirectUrl: "redirect_uri",
      scopes: "scope",
      state: "state"
    };
    let url = base;
    Object.keys(map).filter((k3) => options[k3] !== null).filter((k3) => {
      if (k3 !== "scopes")
        return true;
      if (options.clientType === "github-app")
        return false;
      return !Array.isArray(options[k3]) || options[k3].length > 0;
    }).map((key) => [map[key], `${options[key]}`]).forEach(([key, value], index) => {
      url += index === 0 ? `?` : "&";
      url += `${key}=${encodeURIComponent(value)}`;
    });
    return url;
  }
  var init_dist_web5 = __esm({
    "node_modules/@octokit/oauth-authorization-url/dist-web/index.js"() {
    }
  });

  // node_modules/@octokit/oauth-methods/dist-node/index.js
  var require_dist_node5 = __commonJS({
    "node_modules/@octokit/oauth-methods/dist-node/index.js"(exports, module) {
      "use strict";
      var __create2 = Object.create;
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf2 = Object.getPrototypeOf;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export2 = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var dist_src_exports = {};
      __export2(dist_src_exports, {
        VERSION: () => VERSION12,
        checkToken: () => checkToken2,
        createDeviceCode: () => createDeviceCode2,
        deleteAuthorization: () => deleteAuthorization2,
        deleteToken: () => deleteToken2,
        exchangeDeviceCode: () => exchangeDeviceCode2,
        exchangeWebFlowCode: () => exchangeWebFlowCode2,
        getWebFlowAuthorizationUrl: () => getWebFlowAuthorizationUrl,
        refreshToken: () => refreshToken2,
        resetToken: () => resetToken2,
        scopeToken: () => scopeToken
      });
      module.exports = __toCommonJS2(dist_src_exports);
      var VERSION12 = "4.0.1";
      var import_oauth_authorization_url = (init_dist_web5(), __toCommonJS(dist_web_exports4));
      var import_request4 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      var import_request_error3 = (init_dist_web2(), __toCommonJS(dist_web_exports));
      function requestToOAuthBaseUrl(request2) {
        const endpointDefaults = request2.endpoint.DEFAULTS;
        return /^https:\/\/(api\.)?github\.com$/.test(endpointDefaults.baseUrl) ? "https://github.com" : endpointDefaults.baseUrl.replace("/api/v3", "");
      }
      async function oauthRequest(request2, route, parameters) {
        const withOAuthParameters = {
          baseUrl: requestToOAuthBaseUrl(request2),
          headers: {
            accept: "application/json"
          },
          ...parameters
        };
        const response = await request2(route, withOAuthParameters);
        if ("error" in response.data) {
          const error = new import_request_error3.RequestError(
            `${response.data.error_description} (${response.data.error}, ${response.data.error_uri})`,
            400,
            {
              request: request2.endpoint.merge(
                route,
                withOAuthParameters
              ),
              headers: response.headers
            }
          );
          error.response = response;
          throw error;
        }
        return response;
      }
      function getWebFlowAuthorizationUrl({
        request: request2 = import_request4.request,
        ...options
      }) {
        const baseUrl = requestToOAuthBaseUrl(request2);
        return (0, import_oauth_authorization_url.oauthAuthorizationUrl)({
          ...options,
          baseUrl
        });
      }
      var import_request22 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      async function exchangeWebFlowCode2(options) {
        const request2 = options.request || /* istanbul ignore next: we always pass a custom request in tests */
        import_request22.request;
        const response = await oauthRequest(
          request2,
          "POST /login/oauth/access_token",
          {
            client_id: options.clientId,
            client_secret: options.clientSecret,
            code: options.code,
            redirect_uri: options.redirectUrl
          }
        );
        const authentication = {
          clientType: options.clientType,
          clientId: options.clientId,
          clientSecret: options.clientSecret,
          token: response.data.access_token,
          scopes: response.data.scope.split(/\s+/).filter(Boolean)
        };
        if (options.clientType === "github-app") {
          if ("refresh_token" in response.data) {
            const apiTimeInMs = new Date(response.headers.date).getTime();
            authentication.refreshToken = response.data.refresh_token, authentication.expiresAt = toTimestamp(
              apiTimeInMs,
              response.data.expires_in
            ), authentication.refreshTokenExpiresAt = toTimestamp(
              apiTimeInMs,
              response.data.refresh_token_expires_in
            );
          }
          delete authentication.scopes;
        }
        return { ...response, authentication };
      }
      function toTimestamp(apiTimeInMs, expirationInSeconds) {
        return new Date(apiTimeInMs + expirationInSeconds * 1e3).toISOString();
      }
      var import_request32 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      async function createDeviceCode2(options) {
        const request2 = options.request || /* istanbul ignore next: we always pass a custom request in tests */
        import_request32.request;
        const parameters = {
          client_id: options.clientId
        };
        if ("scopes" in options && Array.isArray(options.scopes)) {
          parameters.scope = options.scopes.join(" ");
        }
        return oauthRequest(request2, "POST /login/device/code", parameters);
      }
      var import_request42 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      async function exchangeDeviceCode2(options) {
        const request2 = options.request || /* istanbul ignore next: we always pass a custom request in tests */
        import_request42.request;
        const response = await oauthRequest(
          request2,
          "POST /login/oauth/access_token",
          {
            client_id: options.clientId,
            device_code: options.code,
            grant_type: "urn:ietf:params:oauth:grant-type:device_code"
          }
        );
        const authentication = {
          clientType: options.clientType,
          clientId: options.clientId,
          token: response.data.access_token,
          scopes: response.data.scope.split(/\s+/).filter(Boolean)
        };
        if ("clientSecret" in options) {
          authentication.clientSecret = options.clientSecret;
        }
        if (options.clientType === "github-app") {
          if ("refresh_token" in response.data) {
            const apiTimeInMs = new Date(response.headers.date).getTime();
            authentication.refreshToken = response.data.refresh_token, authentication.expiresAt = toTimestamp2(
              apiTimeInMs,
              response.data.expires_in
            ), authentication.refreshTokenExpiresAt = toTimestamp2(
              apiTimeInMs,
              response.data.refresh_token_expires_in
            );
          }
          delete authentication.scopes;
        }
        return { ...response, authentication };
      }
      function toTimestamp2(apiTimeInMs, expirationInSeconds) {
        return new Date(apiTimeInMs + expirationInSeconds * 1e3).toISOString();
      }
      var import_request5 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      var import_btoa_lite4 = __toESM2(require_btoa_browser());
      async function checkToken2(options) {
        const request2 = options.request || /* istanbul ignore next: we always pass a custom request in tests */
        import_request5.request;
        const response = await request2("POST /applications/{client_id}/token", {
          headers: {
            authorization: `basic ${(0, import_btoa_lite4.default)(
              `${options.clientId}:${options.clientSecret}`
            )}`
          },
          client_id: options.clientId,
          access_token: options.token
        });
        const authentication = {
          clientType: options.clientType,
          clientId: options.clientId,
          clientSecret: options.clientSecret,
          token: options.token,
          scopes: response.data.scopes
        };
        if (response.data.expires_at)
          authentication.expiresAt = response.data.expires_at;
        if (options.clientType === "github-app") {
          delete authentication.scopes;
        }
        return { ...response, authentication };
      }
      var import_request6 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      async function refreshToken2(options) {
        const request2 = options.request || /* istanbul ignore next: we always pass a custom request in tests */
        import_request6.request;
        const response = await oauthRequest(
          request2,
          "POST /login/oauth/access_token",
          {
            client_id: options.clientId,
            client_secret: options.clientSecret,
            grant_type: "refresh_token",
            refresh_token: options.refreshToken
          }
        );
        const apiTimeInMs = new Date(response.headers.date).getTime();
        const authentication = {
          clientType: "github-app",
          clientId: options.clientId,
          clientSecret: options.clientSecret,
          token: response.data.access_token,
          refreshToken: response.data.refresh_token,
          expiresAt: toTimestamp3(apiTimeInMs, response.data.expires_in),
          refreshTokenExpiresAt: toTimestamp3(
            apiTimeInMs,
            response.data.refresh_token_expires_in
          )
        };
        return { ...response, authentication };
      }
      function toTimestamp3(apiTimeInMs, expirationInSeconds) {
        return new Date(apiTimeInMs + expirationInSeconds * 1e3).toISOString();
      }
      var import_request7 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      var import_btoa_lite22 = __toESM2(require_btoa_browser());
      async function scopeToken(options) {
        const {
          request: optionsRequest,
          clientType,
          clientId,
          clientSecret,
          token,
          ...requestOptions
        } = options;
        const request2 = optionsRequest || /* istanbul ignore next: we always pass a custom request in tests */
        import_request7.request;
        const response = await request2(
          "POST /applications/{client_id}/token/scoped",
          {
            headers: {
              authorization: `basic ${(0, import_btoa_lite22.default)(`${clientId}:${clientSecret}`)}`
            },
            client_id: clientId,
            access_token: token,
            ...requestOptions
          }
        );
        const authentication = Object.assign(
          {
            clientType,
            clientId,
            clientSecret,
            token: response.data.token
          },
          response.data.expires_at ? { expiresAt: response.data.expires_at } : {}
        );
        return { ...response, authentication };
      }
      var import_request8 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      var import_btoa_lite32 = __toESM2(require_btoa_browser());
      async function resetToken2(options) {
        const request2 = options.request || /* istanbul ignore next: we always pass a custom request in tests */
        import_request8.request;
        const auth6 = (0, import_btoa_lite32.default)(`${options.clientId}:${options.clientSecret}`);
        const response = await request2(
          "PATCH /applications/{client_id}/token",
          {
            headers: {
              authorization: `basic ${auth6}`
            },
            client_id: options.clientId,
            access_token: options.token
          }
        );
        const authentication = {
          clientType: options.clientType,
          clientId: options.clientId,
          clientSecret: options.clientSecret,
          token: response.data.token,
          scopes: response.data.scopes
        };
        if (response.data.expires_at)
          authentication.expiresAt = response.data.expires_at;
        if (options.clientType === "github-app") {
          delete authentication.scopes;
        }
        return { ...response, authentication };
      }
      var import_request9 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      var import_btoa_lite42 = __toESM2(require_btoa_browser());
      async function deleteToken2(options) {
        const request2 = options.request || /* istanbul ignore next: we always pass a custom request in tests */
        import_request9.request;
        const auth6 = (0, import_btoa_lite42.default)(`${options.clientId}:${options.clientSecret}`);
        return request2(
          "DELETE /applications/{client_id}/token",
          {
            headers: {
              authorization: `basic ${auth6}`
            },
            client_id: options.clientId,
            access_token: options.token
          }
        );
      }
      var import_request10 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      var import_btoa_lite5 = __toESM2(require_btoa_browser());
      async function deleteAuthorization2(options) {
        const request2 = options.request || /* istanbul ignore next: we always pass a custom request in tests */
        import_request10.request;
        const auth6 = (0, import_btoa_lite5.default)(`${options.clientId}:${options.clientSecret}`);
        return request2(
          "DELETE /applications/{client_id}/grant",
          {
            headers: {
              authorization: `basic ${auth6}`
            },
            client_id: options.clientId,
            access_token: options.token
          }
        );
      }
    }
  });

  // node_modules/@octokit/auth-oauth-device/dist-web/index.js
  async function getOAuthAccessToken(state, options) {
    const cachedAuthentication = getCachedAuthentication(state, options.auth);
    if (cachedAuthentication)
      return cachedAuthentication;
    const { data: verification } = await (0, import_oauth_methods.createDeviceCode)({
      clientType: state.clientType,
      clientId: state.clientId,
      request: options.request || state.request,
      // @ts-expect-error the extra code to make TS happy is not worth it
      scopes: options.auth.scopes || state.scopes
    });
    await state.onVerification(verification);
    const authentication = await waitForAccessToken(
      options.request || state.request,
      state.clientId,
      state.clientType,
      verification
    );
    state.authentication = authentication;
    return authentication;
  }
  function getCachedAuthentication(state, auth22) {
    if (auth22.refresh === true)
      return false;
    if (!state.authentication)
      return false;
    if (state.clientType === "github-app") {
      return state.authentication;
    }
    const authentication = state.authentication;
    const newScope = ("scopes" in auth22 && auth22.scopes || state.scopes).join(
      " "
    );
    const currentScope = authentication.scopes.join(" ");
    return newScope === currentScope ? authentication : false;
  }
  async function wait(seconds) {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
  }
  async function waitForAccessToken(request2, clientId, clientType, verification) {
    try {
      const options = {
        clientId,
        request: request2,
        code: verification.device_code
      };
      const { authentication } = clientType === "oauth-app" ? await (0, import_oauth_methods.exchangeDeviceCode)({
        ...options,
        clientType: "oauth-app"
      }) : await (0, import_oauth_methods.exchangeDeviceCode)({
        ...options,
        clientType: "github-app"
      });
      return {
        type: "token",
        tokenType: "oauth",
        ...authentication
      };
    } catch (error) {
      if (!error.response)
        throw error;
      const errorType = error.response.data.error;
      if (errorType === "authorization_pending") {
        await wait(verification.interval);
        return waitForAccessToken(request2, clientId, clientType, verification);
      }
      if (errorType === "slow_down") {
        await wait(verification.interval + 5);
        return waitForAccessToken(request2, clientId, clientType, verification);
      }
      throw error;
    }
  }
  async function auth2(state, authOptions) {
    return getOAuthAccessToken(state, {
      auth: authOptions
    });
  }
  async function hook2(state, request2, route, parameters) {
    let endpoint2 = request2.endpoint.merge(
      route,
      parameters
    );
    if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint2.url)) {
      return request2(endpoint2);
    }
    const { token } = await getOAuthAccessToken(state, {
      request: request2,
      auth: { type: "oauth" }
    });
    endpoint2.headers.authorization = `token ${token}`;
    return request2(endpoint2);
  }
  function createOAuthDeviceAuth(options) {
    const requestWithDefaults = options.request || request.defaults({
      headers: {
        "user-agent": `octokit-auth-oauth-device.js/${VERSION7} ${(0, import_universal_user_agent3.getUserAgent)()}`
      }
    });
    const { request: request2 = requestWithDefaults, ...otherOptions } = options;
    const state = options.clientType === "github-app" ? {
      ...otherOptions,
      clientType: "github-app",
      request: request2
    } : {
      ...otherOptions,
      clientType: "oauth-app",
      request: request2,
      scopes: options.scopes || []
    };
    if (!options.clientId) {
      throw new Error(
        '[@octokit/auth-oauth-device] "clientId" option must be set (https://github.com/octokit/auth-oauth-device.js#usage)'
      );
    }
    if (!options.onVerification) {
      throw new Error(
        '[@octokit/auth-oauth-device] "onVerification" option must be a function (https://github.com/octokit/auth-oauth-device.js#usage)'
      );
    }
    return Object.assign(auth2.bind(null, state), {
      hook: hook2.bind(null, state)
    });
  }
  var import_universal_user_agent3, import_oauth_methods, VERSION7;
  var init_dist_web6 = __esm({
    "node_modules/@octokit/auth-oauth-device/dist-web/index.js"() {
      import_universal_user_agent3 = __toESM(require_dist_node());
      init_dist_web3();
      import_oauth_methods = __toESM(require_dist_node5());
      VERSION7 = "6.0.1";
    }
  });

  // node_modules/@octokit/auth-oauth-user/dist-web/index.js
  var dist_web_exports5 = {};
  __export(dist_web_exports5, {
    createOAuthUserAuth: () => createOAuthUserAuth2,
    requiresBasicAuth: () => requiresBasicAuth
  });
  async function getAuthentication(state) {
    if ("code" in state.strategyOptions) {
      const { authentication } = await (0, import_oauth_methods2.exchangeWebFlowCode)({
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        clientType: state.clientType,
        onTokenCreated: state.onTokenCreated,
        ...state.strategyOptions,
        request: state.request
      });
      return {
        type: "token",
        tokenType: "oauth",
        ...authentication
      };
    }
    if ("onVerification" in state.strategyOptions) {
      const deviceAuth = createOAuthDeviceAuth({
        clientType: state.clientType,
        clientId: state.clientId,
        onTokenCreated: state.onTokenCreated,
        ...state.strategyOptions,
        request: state.request
      });
      const authentication = await deviceAuth({
        type: "oauth"
      });
      return {
        clientSecret: state.clientSecret,
        ...authentication
      };
    }
    if ("token" in state.strategyOptions) {
      return {
        type: "token",
        tokenType: "oauth",
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        clientType: state.clientType,
        onTokenCreated: state.onTokenCreated,
        ...state.strategyOptions
      };
    }
    throw new Error("[@octokit/auth-oauth-user] Invalid strategy options");
  }
  async function auth3(state, options = {}) {
    if (!state.authentication) {
      state.authentication = state.clientType === "oauth-app" ? await getAuthentication(state) : await getAuthentication(state);
    }
    if (state.authentication.invalid) {
      throw new Error("[@octokit/auth-oauth-user] Token is invalid");
    }
    const currentAuthentication = state.authentication;
    if ("expiresAt" in currentAuthentication) {
      if (options.type === "refresh" || new Date(currentAuthentication.expiresAt) < /* @__PURE__ */ new Date()) {
        const { authentication } = await (0, import_oauth_methods3.refreshToken)({
          clientType: "github-app",
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          refreshToken: currentAuthentication.refreshToken,
          request: state.request
        });
        state.authentication = {
          tokenType: "oauth",
          type: "token",
          ...authentication
        };
      }
    }
    if (options.type === "refresh") {
      if (state.clientType === "oauth-app") {
        throw new Error(
          "[@octokit/auth-oauth-user] OAuth Apps do not support expiring tokens"
        );
      }
      if (!currentAuthentication.hasOwnProperty("expiresAt")) {
        throw new Error("[@octokit/auth-oauth-user] Refresh token missing");
      }
      await state.onTokenCreated?.(state.authentication, {
        type: options.type
      });
    }
    if (options.type === "check" || options.type === "reset") {
      const method = options.type === "check" ? import_oauth_methods3.checkToken : import_oauth_methods3.resetToken;
      try {
        const { authentication } = await method({
          // @ts-expect-error making TS happy would require unnecessary code so no
          clientType: state.clientType,
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          token: state.authentication.token,
          request: state.request
        });
        state.authentication = {
          tokenType: "oauth",
          type: "token",
          // @ts-expect-error TBD
          ...authentication
        };
        if (options.type === "reset") {
          await state.onTokenCreated?.(state.authentication, {
            type: options.type
          });
        }
        return state.authentication;
      } catch (error) {
        if (error.status === 404) {
          error.message = "[@octokit/auth-oauth-user] Token is invalid";
          state.authentication.invalid = true;
        }
        throw error;
      }
    }
    if (options.type === "delete" || options.type === "deleteAuthorization") {
      const method = options.type === "delete" ? import_oauth_methods3.deleteToken : import_oauth_methods3.deleteAuthorization;
      try {
        await method({
          // @ts-expect-error making TS happy would require unnecessary code so no
          clientType: state.clientType,
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          token: state.authentication.token,
          request: state.request
        });
      } catch (error) {
        if (error.status !== 404)
          throw error;
      }
      state.authentication.invalid = true;
      return state.authentication;
    }
    return state.authentication;
  }
  function requiresBasicAuth(url) {
    return url && ROUTES_REQUIRING_BASIC_AUTH.test(url);
  }
  async function hook3(state, request2, route, parameters = {}) {
    const endpoint2 = request2.endpoint.merge(
      route,
      parameters
    );
    if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint2.url)) {
      return request2(endpoint2);
    }
    if (requiresBasicAuth(endpoint2.url)) {
      const credentials = (0, import_btoa_lite.default)(`${state.clientId}:${state.clientSecret}`);
      endpoint2.headers.authorization = `basic ${credentials}`;
      return request2(endpoint2);
    }
    const { token } = state.clientType === "oauth-app" ? await auth3({ ...state, request: request2 }) : await auth3({ ...state, request: request2 });
    endpoint2.headers.authorization = "token " + token;
    return request2(endpoint2);
  }
  function createOAuthUserAuth2({
    clientId,
    clientSecret,
    clientType = "oauth-app",
    request: request2 = request.defaults({
      headers: {
        "user-agent": `octokit-auth-oauth-app.js/${VERSION8} ${(0, import_universal_user_agent4.getUserAgent)()}`
      }
    }),
    onTokenCreated,
    ...strategyOptions
  }) {
    const state = Object.assign({
      clientType,
      clientId,
      clientSecret,
      onTokenCreated,
      strategyOptions,
      request: request2
    });
    return Object.assign(auth3.bind(null, state), {
      // @ts-expect-error not worth the extra code needed to appease TS
      hook: hook3.bind(null, state)
    });
  }
  var import_universal_user_agent4, import_oauth_methods2, import_oauth_methods3, import_btoa_lite, VERSION8, ROUTES_REQUIRING_BASIC_AUTH;
  var init_dist_web7 = __esm({
    "node_modules/@octokit/auth-oauth-user/dist-web/index.js"() {
      import_universal_user_agent4 = __toESM(require_dist_node());
      init_dist_web3();
      init_dist_web6();
      import_oauth_methods2 = __toESM(require_dist_node5());
      import_oauth_methods3 = __toESM(require_dist_node5());
      import_btoa_lite = __toESM(require_btoa_browser());
      VERSION8 = "4.0.1";
      ROUTES_REQUIRING_BASIC_AUTH = /\/applications\/[^/]+\/(token|grant)s?/;
      createOAuthUserAuth2.VERSION = VERSION8;
    }
  });

  // node_modules/@octokit/auth-oauth-app/dist-web/index.js
  var dist_web_exports6 = {};
  __export(dist_web_exports6, {
    createOAuthAppAuth: () => createOAuthAppAuth,
    createOAuthUserAuth: () => createOAuthUserAuth2
  });
  async function auth4(state, authOptions) {
    if (authOptions.type === "oauth-app") {
      return {
        type: "oauth-app",
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        clientType: state.clientType,
        headers: {
          authorization: `basic ${(0, import_btoa_lite2.default)(
            `${state.clientId}:${state.clientSecret}`
          )}`
        }
      };
    }
    if ("factory" in authOptions) {
      const { type, ...options } = {
        ...authOptions,
        ...state
      };
      return authOptions.factory(options);
    }
    const common = {
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      request: state.request,
      ...authOptions
    };
    const userAuth = state.clientType === "oauth-app" ? await createOAuthUserAuth2({
      ...common,
      clientType: state.clientType
    }) : await createOAuthUserAuth2({
      ...common,
      clientType: state.clientType
    });
    return userAuth();
  }
  async function hook4(state, request2, route, parameters) {
    let endpoint2 = request2.endpoint.merge(
      route,
      parameters
    );
    if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint2.url)) {
      return request2(endpoint2);
    }
    if (state.clientType === "github-app" && !requiresBasicAuth(endpoint2.url)) {
      throw new Error(
        `[@octokit/auth-oauth-app] GitHub Apps cannot use their client ID/secret for basic authentication for endpoints other than "/applications/{client_id}/**". "${endpoint2.method} ${endpoint2.url}" is not supported.`
      );
    }
    const credentials = (0, import_btoa_lite3.default)(`${state.clientId}:${state.clientSecret}`);
    endpoint2.headers.authorization = `basic ${credentials}`;
    try {
      return await request2(endpoint2);
    } catch (error) {
      if (error.status !== 401)
        throw error;
      error.message = `[@octokit/auth-oauth-app] "${endpoint2.method} ${endpoint2.url}" does not support clientId/clientSecret basic authentication.`;
      throw error;
    }
  }
  function createOAuthAppAuth(options) {
    const state = Object.assign(
      {
        request: request.defaults({
          headers: {
            "user-agent": `octokit-auth-oauth-app.js/${VERSION9} ${(0, import_universal_user_agent5.getUserAgent)()}`
          }
        }),
        clientType: "oauth-app"
      },
      options
    );
    return Object.assign(auth4.bind(null, state), {
      hook: hook4.bind(null, state)
    });
  }
  var import_universal_user_agent5, import_btoa_lite2, import_btoa_lite3, VERSION9;
  var init_dist_web8 = __esm({
    "node_modules/@octokit/auth-oauth-app/dist-web/index.js"() {
      import_universal_user_agent5 = __toESM(require_dist_node());
      init_dist_web3();
      import_btoa_lite2 = __toESM(require_btoa_browser());
      init_dist_web7();
      import_btoa_lite3 = __toESM(require_btoa_browser());
      init_dist_web7();
      init_dist_web7();
      VERSION9 = "7.0.1";
    }
  });

  // node_modules/universal-github-app-jwt/dist-web/index.bundled.js
  var index_bundled_exports = {};
  __export(index_bundled_exports, {
    githubAppJwt: () => o
  });
  function t(t3, n4, r3, e3, i4, a4, o4) {
    try {
      var u4 = t3[a4](o4), c3 = u4.value;
    } catch (t4) {
      return void r3(t4);
    }
    u4.done ? n4(c3) : Promise.resolve(c3).then(e3, i4);
  }
  function n(n4) {
    return function() {
      var r3 = this, e3 = arguments;
      return new Promise(function(i4, a4) {
        var o4 = n4.apply(r3, e3);
        function u4(n5) {
          t(o4, i4, a4, u4, c3, "next", n5);
        }
        function c3(n5) {
          t(o4, i4, a4, u4, c3, "throw", n5);
        }
        u4(void 0);
      });
    };
  }
  function r(t3) {
    for (var n4 = new ArrayBuffer(t3.length), r3 = new Uint8Array(n4), e3 = 0, i4 = t3.length; e3 < i4; e3++)
      r3[e3] = t3.charCodeAt(e3);
    return n4;
  }
  function e(t3) {
    return t3.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  function i(t3) {
    return e(btoa(JSON.stringify(t3)));
  }
  function o(t3) {
    return u.apply(this, arguments);
  }
  function u() {
    return (u = n(function* (t3) {
      var { id: n4, privateKey: r3, now: e3 = Math.floor(Date.now() / 1e3) } = t3, i4 = e3 - 30, o4 = i4 + 600, u4 = { iat: i4, exp: o4, iss: n4 };
      return { appId: n4, expiration: o4, token: yield a({ privateKey: r3, payload: u4 }) };
    })).apply(this, arguments);
  }
  var a;
  var init_index_bundled = __esm({
    "node_modules/universal-github-app-jwt/dist-web/index.bundled.js"() {
      a = function() {
        var t3 = n(function* (t4) {
          var { privateKey: n4, payload: a4 } = t4;
          if (/BEGIN RSA PRIVATE KEY/.test(n4))
            throw new Error("[universal-github-app-jwt] Private Key is in PKCS#1 format, but only PKCS#8 is supported. See https://github.com/gr2m/universal-github-app-jwt#readme");
          var o4, u4 = { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } }, c3 = (o4 = n4.trim().split("\n").slice(1, -1).join(""), r(atob(o4))), p3 = yield crypto.subtle.importKey("pkcs8", c3, u4, false, ["sign"]), f3 = function(t5, n5) {
            return "".concat(i(t5), ".").concat(i(n5));
          }({ alg: "RS256", typ: "JWT" }, a4), l3 = r(f3), s3 = function(t5) {
            for (var n5 = "", r3 = new Uint8Array(t5), i4 = r3.byteLength, a5 = 0; a5 < i4; a5++)
              n5 += String.fromCharCode(r3[a5]);
            return e(btoa(n5));
          }(yield crypto.subtle.sign(u4.name, p3, l3));
          return "".concat(f3, ".").concat(s3);
        });
        return function(n4) {
          return t3.apply(this, arguments);
        };
      }();
    }
  });

  // node_modules/lru-cache/dist/commonjs/index.js
  var require_commonjs = __commonJS({
    "node_modules/lru-cache/dist/commonjs/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LRUCache = void 0;
      var perf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
      var warned = /* @__PURE__ */ new Set();
      var PROCESS = typeof process === "object" && !!process ? process : {};
      var emitWarning = (msg, type, code, fn) => {
        typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
      };
      var AC = globalThis.AbortController;
      var AS = globalThis.AbortSignal;
      if (typeof AC === "undefined") {
        AS = class AbortSignal {
          onabort;
          _onabort = [];
          reason;
          aborted = false;
          addEventListener(_2, fn) {
            this._onabort.push(fn);
          }
        };
        AC = class AbortController {
          constructor() {
            warnACPolyfill();
          }
          signal = new AS();
          abort(reason) {
            if (this.signal.aborted)
              return;
            this.signal.reason = reason;
            this.signal.aborted = true;
            for (const fn of this.signal._onabort) {
              fn(reason);
            }
            this.signal.onabort?.(reason);
          }
        };
        let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1";
        const warnACPolyfill = () => {
          if (!printACPolyfillWarning)
            return;
          printACPolyfillWarning = false;
          emitWarning("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", warnACPolyfill);
        };
      }
      var shouldWarn = (code) => !warned.has(code);
      var TYPE = Symbol("type");
      var isPosInt = (n4) => n4 && n4 === Math.floor(n4) && n4 > 0 && isFinite(n4);
      var getUintArray = (max) => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
      var ZeroArray = class extends Array {
        constructor(size) {
          super(size);
          this.fill(0);
        }
      };
      var Stack = class _Stack {
        heap;
        length;
        // private constructor
        static #constructing = false;
        static create(max) {
          const HeapCls = getUintArray(max);
          if (!HeapCls)
            return [];
          _Stack.#constructing = true;
          const s3 = new _Stack(max, HeapCls);
          _Stack.#constructing = false;
          return s3;
        }
        constructor(max, HeapCls) {
          if (!_Stack.#constructing) {
            throw new TypeError("instantiate Stack using Stack.create(n)");
          }
          this.heap = new HeapCls(max);
          this.length = 0;
        }
        push(n4) {
          this.heap[this.length++] = n4;
        }
        pop() {
          return this.heap[--this.length];
        }
      };
      var LRUCache = class _LRUCache {
        // properties coming in from the options of these, only max and maxSize
        // really *need* to be protected. The rest can be modified, as they just
        // set defaults for various methods.
        #max;
        #maxSize;
        #dispose;
        #disposeAfter;
        #fetchMethod;
        /**
         * {@link LRUCache.OptionsBase.ttl}
         */
        ttl;
        /**
         * {@link LRUCache.OptionsBase.ttlResolution}
         */
        ttlResolution;
        /**
         * {@link LRUCache.OptionsBase.ttlAutopurge}
         */
        ttlAutopurge;
        /**
         * {@link LRUCache.OptionsBase.updateAgeOnGet}
         */
        updateAgeOnGet;
        /**
         * {@link LRUCache.OptionsBase.updateAgeOnHas}
         */
        updateAgeOnHas;
        /**
         * {@link LRUCache.OptionsBase.allowStale}
         */
        allowStale;
        /**
         * {@link LRUCache.OptionsBase.noDisposeOnSet}
         */
        noDisposeOnSet;
        /**
         * {@link LRUCache.OptionsBase.noUpdateTTL}
         */
        noUpdateTTL;
        /**
         * {@link LRUCache.OptionsBase.maxEntrySize}
         */
        maxEntrySize;
        /**
         * {@link LRUCache.OptionsBase.sizeCalculation}
         */
        sizeCalculation;
        /**
         * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
         */
        noDeleteOnFetchRejection;
        /**
         * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
         */
        noDeleteOnStaleGet;
        /**
         * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
         */
        allowStaleOnFetchAbort;
        /**
         * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
         */
        allowStaleOnFetchRejection;
        /**
         * {@link LRUCache.OptionsBase.ignoreFetchAbort}
         */
        ignoreFetchAbort;
        // computed properties
        #size;
        #calculatedSize;
        #keyMap;
        #keyList;
        #valList;
        #next;
        #prev;
        #head;
        #tail;
        #free;
        #disposed;
        #sizes;
        #starts;
        #ttls;
        #hasDispose;
        #hasFetchMethod;
        #hasDisposeAfter;
        /**
         * Do not call this method unless you need to inspect the
         * inner workings of the cache.  If anything returned by this
         * object is modified in any way, strange breakage may occur.
         *
         * These fields are private for a reason!
         *
         * @internal
         */
        static unsafeExposeInternals(c3) {
          return {
            // properties
            starts: c3.#starts,
            ttls: c3.#ttls,
            sizes: c3.#sizes,
            keyMap: c3.#keyMap,
            keyList: c3.#keyList,
            valList: c3.#valList,
            next: c3.#next,
            prev: c3.#prev,
            get head() {
              return c3.#head;
            },
            get tail() {
              return c3.#tail;
            },
            free: c3.#free,
            // methods
            isBackgroundFetch: (p3) => c3.#isBackgroundFetch(p3),
            backgroundFetch: (k3, index, options, context) => c3.#backgroundFetch(k3, index, options, context),
            moveToTail: (index) => c3.#moveToTail(index),
            indexes: (options) => c3.#indexes(options),
            rindexes: (options) => c3.#rindexes(options),
            isStale: (index) => c3.#isStale(index)
          };
        }
        // Protected read-only members
        /**
         * {@link LRUCache.OptionsBase.max} (read-only)
         */
        get max() {
          return this.#max;
        }
        /**
         * {@link LRUCache.OptionsBase.maxSize} (read-only)
         */
        get maxSize() {
          return this.#maxSize;
        }
        /**
         * The total computed size of items in the cache (read-only)
         */
        get calculatedSize() {
          return this.#calculatedSize;
        }
        /**
         * The number of items stored in the cache (read-only)
         */
        get size() {
          return this.#size;
        }
        /**
         * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
         */
        get fetchMethod() {
          return this.#fetchMethod;
        }
        /**
         * {@link LRUCache.OptionsBase.dispose} (read-only)
         */
        get dispose() {
          return this.#dispose;
        }
        /**
         * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
         */
        get disposeAfter() {
          return this.#disposeAfter;
        }
        constructor(options) {
          const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
          if (max !== 0 && !isPosInt(max)) {
            throw new TypeError("max option must be a nonnegative integer");
          }
          const UintArray = max ? getUintArray(max) : Array;
          if (!UintArray) {
            throw new Error("invalid max value: " + max);
          }
          this.#max = max;
          this.#maxSize = maxSize;
          this.maxEntrySize = maxEntrySize || this.#maxSize;
          this.sizeCalculation = sizeCalculation;
          if (this.sizeCalculation) {
            if (!this.#maxSize && !this.maxEntrySize) {
              throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
            }
            if (typeof this.sizeCalculation !== "function") {
              throw new TypeError("sizeCalculation set to non-function");
            }
          }
          if (fetchMethod !== void 0 && typeof fetchMethod !== "function") {
            throw new TypeError("fetchMethod must be a function if specified");
          }
          this.#fetchMethod = fetchMethod;
          this.#hasFetchMethod = !!fetchMethod;
          this.#keyMap = /* @__PURE__ */ new Map();
          this.#keyList = new Array(max).fill(void 0);
          this.#valList = new Array(max).fill(void 0);
          this.#next = new UintArray(max);
          this.#prev = new UintArray(max);
          this.#head = 0;
          this.#tail = 0;
          this.#free = Stack.create(max);
          this.#size = 0;
          this.#calculatedSize = 0;
          if (typeof dispose === "function") {
            this.#dispose = dispose;
          }
          if (typeof disposeAfter === "function") {
            this.#disposeAfter = disposeAfter;
            this.#disposed = [];
          } else {
            this.#disposeAfter = void 0;
            this.#disposed = void 0;
          }
          this.#hasDispose = !!this.#dispose;
          this.#hasDisposeAfter = !!this.#disposeAfter;
          this.noDisposeOnSet = !!noDisposeOnSet;
          this.noUpdateTTL = !!noUpdateTTL;
          this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
          this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
          this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
          this.ignoreFetchAbort = !!ignoreFetchAbort;
          if (this.maxEntrySize !== 0) {
            if (this.#maxSize !== 0) {
              if (!isPosInt(this.#maxSize)) {
                throw new TypeError("maxSize must be a positive integer if specified");
              }
            }
            if (!isPosInt(this.maxEntrySize)) {
              throw new TypeError("maxEntrySize must be a positive integer if specified");
            }
            this.#initializeSizeTracking();
          }
          this.allowStale = !!allowStale;
          this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
          this.updateAgeOnGet = !!updateAgeOnGet;
          this.updateAgeOnHas = !!updateAgeOnHas;
          this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
          this.ttlAutopurge = !!ttlAutopurge;
          this.ttl = ttl || 0;
          if (this.ttl) {
            if (!isPosInt(this.ttl)) {
              throw new TypeError("ttl must be a positive integer if specified");
            }
            this.#initializeTTLTracking();
          }
          if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
            throw new TypeError("At least one of max, maxSize, or ttl is required");
          }
          if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
            const code = "LRU_CACHE_UNBOUNDED";
            if (shouldWarn(code)) {
              warned.add(code);
              const msg = "TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.";
              emitWarning(msg, "UnboundedCacheWarning", code, _LRUCache);
            }
          }
        }
        /**
         * Return the remaining TTL time for a given entry key
         */
        getRemainingTTL(key) {
          return this.#keyMap.has(key) ? Infinity : 0;
        }
        #initializeTTLTracking() {
          const ttls = new ZeroArray(this.#max);
          const starts = new ZeroArray(this.#max);
          this.#ttls = ttls;
          this.#starts = starts;
          this.#setItemTTL = (index, ttl, start = perf.now()) => {
            starts[index] = ttl !== 0 ? start : 0;
            ttls[index] = ttl;
            if (ttl !== 0 && this.ttlAutopurge) {
              const t3 = setTimeout(() => {
                if (this.#isStale(index)) {
                  this.delete(this.#keyList[index]);
                }
              }, ttl + 1);
              if (t3.unref) {
                t3.unref();
              }
            }
          };
          this.#updateItemAge = (index) => {
            starts[index] = ttls[index] !== 0 ? perf.now() : 0;
          };
          this.#statusTTL = (status, index) => {
            if (ttls[index]) {
              const ttl = ttls[index];
              const start = starts[index];
              if (!ttl || !start)
                return;
              status.ttl = ttl;
              status.start = start;
              status.now = cachedNow || getNow();
              const age = status.now - start;
              status.remainingTTL = ttl - age;
            }
          };
          let cachedNow = 0;
          const getNow = () => {
            const n4 = perf.now();
            if (this.ttlResolution > 0) {
              cachedNow = n4;
              const t3 = setTimeout(() => cachedNow = 0, this.ttlResolution);
              if (t3.unref) {
                t3.unref();
              }
            }
            return n4;
          };
          this.getRemainingTTL = (key) => {
            const index = this.#keyMap.get(key);
            if (index === void 0) {
              return 0;
            }
            const ttl = ttls[index];
            const start = starts[index];
            if (!ttl || !start) {
              return Infinity;
            }
            const age = (cachedNow || getNow()) - start;
            return ttl - age;
          };
          this.#isStale = (index) => {
            const s3 = starts[index];
            const t3 = ttls[index];
            return !!t3 && !!s3 && (cachedNow || getNow()) - s3 > t3;
          };
        }
        // conditionally set private methods related to TTL
        #updateItemAge = () => {
        };
        #statusTTL = () => {
        };
        #setItemTTL = () => {
        };
        /* c8 ignore stop */
        #isStale = () => false;
        #initializeSizeTracking() {
          const sizes = new ZeroArray(this.#max);
          this.#calculatedSize = 0;
          this.#sizes = sizes;
          this.#removeItemSize = (index) => {
            this.#calculatedSize -= sizes[index];
            sizes[index] = 0;
          };
          this.#requireSize = (k3, v3, size, sizeCalculation) => {
            if (this.#isBackgroundFetch(v3)) {
              return 0;
            }
            if (!isPosInt(size)) {
              if (sizeCalculation) {
                if (typeof sizeCalculation !== "function") {
                  throw new TypeError("sizeCalculation must be a function");
                }
                size = sizeCalculation(v3, k3);
                if (!isPosInt(size)) {
                  throw new TypeError("sizeCalculation return invalid (expect positive integer)");
                }
              } else {
                throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
              }
            }
            return size;
          };
          this.#addItemSize = (index, size, status) => {
            sizes[index] = size;
            if (this.#maxSize) {
              const maxSize = this.#maxSize - sizes[index];
              while (this.#calculatedSize > maxSize) {
                this.#evict(true);
              }
            }
            this.#calculatedSize += sizes[index];
            if (status) {
              status.entrySize = size;
              status.totalCalculatedSize = this.#calculatedSize;
            }
          };
        }
        #removeItemSize = (_i) => {
        };
        #addItemSize = (_i, _s, _st) => {
        };
        #requireSize = (_k, _v, size, sizeCalculation) => {
          if (size || sizeCalculation) {
            throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
          }
          return 0;
        };
        *#indexes({ allowStale = this.allowStale } = {}) {
          if (this.#size) {
            for (let i4 = this.#tail; true; ) {
              if (!this.#isValidIndex(i4)) {
                break;
              }
              if (allowStale || !this.#isStale(i4)) {
                yield i4;
              }
              if (i4 === this.#head) {
                break;
              } else {
                i4 = this.#prev[i4];
              }
            }
          }
        }
        *#rindexes({ allowStale = this.allowStale } = {}) {
          if (this.#size) {
            for (let i4 = this.#head; true; ) {
              if (!this.#isValidIndex(i4)) {
                break;
              }
              if (allowStale || !this.#isStale(i4)) {
                yield i4;
              }
              if (i4 === this.#tail) {
                break;
              } else {
                i4 = this.#next[i4];
              }
            }
          }
        }
        #isValidIndex(index) {
          return index !== void 0 && this.#keyMap.get(this.#keyList[index]) === index;
        }
        /**
         * Return a generator yielding `[key, value]` pairs,
         * in order from most recently used to least recently used.
         */
        *entries() {
          for (const i4 of this.#indexes()) {
            if (this.#valList[i4] !== void 0 && this.#keyList[i4] !== void 0 && !this.#isBackgroundFetch(this.#valList[i4])) {
              yield [this.#keyList[i4], this.#valList[i4]];
            }
          }
        }
        /**
         * Inverse order version of {@link LRUCache.entries}
         *
         * Return a generator yielding `[key, value]` pairs,
         * in order from least recently used to most recently used.
         */
        *rentries() {
          for (const i4 of this.#rindexes()) {
            if (this.#valList[i4] !== void 0 && this.#keyList[i4] !== void 0 && !this.#isBackgroundFetch(this.#valList[i4])) {
              yield [this.#keyList[i4], this.#valList[i4]];
            }
          }
        }
        /**
         * Return a generator yielding the keys in the cache,
         * in order from most recently used to least recently used.
         */
        *keys() {
          for (const i4 of this.#indexes()) {
            const k3 = this.#keyList[i4];
            if (k3 !== void 0 && !this.#isBackgroundFetch(this.#valList[i4])) {
              yield k3;
            }
          }
        }
        /**
         * Inverse order version of {@link LRUCache.keys}
         *
         * Return a generator yielding the keys in the cache,
         * in order from least recently used to most recently used.
         */
        *rkeys() {
          for (const i4 of this.#rindexes()) {
            const k3 = this.#keyList[i4];
            if (k3 !== void 0 && !this.#isBackgroundFetch(this.#valList[i4])) {
              yield k3;
            }
          }
        }
        /**
         * Return a generator yielding the values in the cache,
         * in order from most recently used to least recently used.
         */
        *values() {
          for (const i4 of this.#indexes()) {
            const v3 = this.#valList[i4];
            if (v3 !== void 0 && !this.#isBackgroundFetch(this.#valList[i4])) {
              yield this.#valList[i4];
            }
          }
        }
        /**
         * Inverse order version of {@link LRUCache.values}
         *
         * Return a generator yielding the values in the cache,
         * in order from least recently used to most recently used.
         */
        *rvalues() {
          for (const i4 of this.#rindexes()) {
            const v3 = this.#valList[i4];
            if (v3 !== void 0 && !this.#isBackgroundFetch(this.#valList[i4])) {
              yield this.#valList[i4];
            }
          }
        }
        /**
         * Iterating over the cache itself yields the same results as
         * {@link LRUCache.entries}
         */
        [Symbol.iterator]() {
          return this.entries();
        }
        /**
         * A String value that is used in the creation of the default string description of an object.
         * Called by the built-in method Object.prototype.toString.
         */
        [Symbol.toStringTag] = "LRUCache";
        /**
         * Find a value for which the supplied fn method returns a truthy value,
         * similar to Array.find().  fn is called as fn(value, key, cache).
         */
        find(fn, getOptions = {}) {
          for (const i4 of this.#indexes()) {
            const v3 = this.#valList[i4];
            const value = this.#isBackgroundFetch(v3) ? v3.__staleWhileFetching : v3;
            if (value === void 0)
              continue;
            if (fn(value, this.#keyList[i4], this)) {
              return this.get(this.#keyList[i4], getOptions);
            }
          }
        }
        /**
         * Call the supplied function on each item in the cache, in order from
         * most recently used to least recently used.  fn is called as
         * fn(value, key, cache).  Does not update age or recenty of use.
         * Does not iterate over stale values.
         */
        forEach(fn, thisp = this) {
          for (const i4 of this.#indexes()) {
            const v3 = this.#valList[i4];
            const value = this.#isBackgroundFetch(v3) ? v3.__staleWhileFetching : v3;
            if (value === void 0)
              continue;
            fn.call(thisp, value, this.#keyList[i4], this);
          }
        }
        /**
         * The same as {@link LRUCache.forEach} but items are iterated over in
         * reverse order.  (ie, less recently used items are iterated over first.)
         */
        rforEach(fn, thisp = this) {
          for (const i4 of this.#rindexes()) {
            const v3 = this.#valList[i4];
            const value = this.#isBackgroundFetch(v3) ? v3.__staleWhileFetching : v3;
            if (value === void 0)
              continue;
            fn.call(thisp, value, this.#keyList[i4], this);
          }
        }
        /**
         * Delete any stale entries. Returns true if anything was removed,
         * false otherwise.
         */
        purgeStale() {
          let deleted = false;
          for (const i4 of this.#rindexes({ allowStale: true })) {
            if (this.#isStale(i4)) {
              this.delete(this.#keyList[i4]);
              deleted = true;
            }
          }
          return deleted;
        }
        /**
         * Get the extended info about a given entry, to get its value, size, and
         * TTL info simultaneously. Like {@link LRUCache#dump}, but just for a
         * single key. Always returns stale values, if their info is found in the
         * cache, so be sure to check for expired TTLs if relevant.
         */
        info(key) {
          const i4 = this.#keyMap.get(key);
          if (i4 === void 0)
            return void 0;
          const v3 = this.#valList[i4];
          const value = this.#isBackgroundFetch(v3) ? v3.__staleWhileFetching : v3;
          if (value === void 0)
            return void 0;
          const entry = { value };
          if (this.#ttls && this.#starts) {
            const ttl = this.#ttls[i4];
            const start = this.#starts[i4];
            if (ttl && start) {
              const remain = ttl - (perf.now() - start);
              entry.ttl = remain;
              entry.start = Date.now();
            }
          }
          if (this.#sizes) {
            entry.size = this.#sizes[i4];
          }
          return entry;
        }
        /**
         * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
         * passed to cache.load()
         */
        dump() {
          const arr = [];
          for (const i4 of this.#indexes({ allowStale: true })) {
            const key = this.#keyList[i4];
            const v3 = this.#valList[i4];
            const value = this.#isBackgroundFetch(v3) ? v3.__staleWhileFetching : v3;
            if (value === void 0 || key === void 0)
              continue;
            const entry = { value };
            if (this.#ttls && this.#starts) {
              entry.ttl = this.#ttls[i4];
              const age = perf.now() - this.#starts[i4];
              entry.start = Math.floor(Date.now() - age);
            }
            if (this.#sizes) {
              entry.size = this.#sizes[i4];
            }
            arr.unshift([key, entry]);
          }
          return arr;
        }
        /**
         * Reset the cache and load in the items in entries in the order listed.
         * Note that the shape of the resulting cache may be different if the
         * same options are not used in both caches.
         */
        load(arr) {
          this.clear();
          for (const [key, entry] of arr) {
            if (entry.start) {
              const age = Date.now() - entry.start;
              entry.start = perf.now() - age;
            }
            this.set(key, entry.value, entry);
          }
        }
        /**
         * Add a value to the cache.
         *
         * Note: if `undefined` is specified as a value, this is an alias for
         * {@link LRUCache#delete}
         */
        set(k3, v3, setOptions = {}) {
          if (v3 === void 0) {
            this.delete(k3);
            return this;
          }
          const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
          let { noUpdateTTL = this.noUpdateTTL } = setOptions;
          const size = this.#requireSize(k3, v3, setOptions.size || 0, sizeCalculation);
          if (this.maxEntrySize && size > this.maxEntrySize) {
            if (status) {
              status.set = "miss";
              status.maxEntrySizeExceeded = true;
            }
            this.delete(k3);
            return this;
          }
          let index = this.#size === 0 ? void 0 : this.#keyMap.get(k3);
          if (index === void 0) {
            index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
            this.#keyList[index] = k3;
            this.#valList[index] = v3;
            this.#keyMap.set(k3, index);
            this.#next[this.#tail] = index;
            this.#prev[index] = this.#tail;
            this.#tail = index;
            this.#size++;
            this.#addItemSize(index, size, status);
            if (status)
              status.set = "add";
            noUpdateTTL = false;
          } else {
            this.#moveToTail(index);
            const oldVal = this.#valList[index];
            if (v3 !== oldVal) {
              if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
                oldVal.__abortController.abort(new Error("replaced"));
                const { __staleWhileFetching: s3 } = oldVal;
                if (s3 !== void 0 && !noDisposeOnSet) {
                  if (this.#hasDispose) {
                    this.#dispose?.(s3, k3, "set");
                  }
                  if (this.#hasDisposeAfter) {
                    this.#disposed?.push([s3, k3, "set"]);
                  }
                }
              } else if (!noDisposeOnSet) {
                if (this.#hasDispose) {
                  this.#dispose?.(oldVal, k3, "set");
                }
                if (this.#hasDisposeAfter) {
                  this.#disposed?.push([oldVal, k3, "set"]);
                }
              }
              this.#removeItemSize(index);
              this.#addItemSize(index, size, status);
              this.#valList[index] = v3;
              if (status) {
                status.set = "replace";
                const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
                if (oldValue !== void 0)
                  status.oldValue = oldValue;
              }
            } else if (status) {
              status.set = "update";
            }
          }
          if (ttl !== 0 && !this.#ttls) {
            this.#initializeTTLTracking();
          }
          if (this.#ttls) {
            if (!noUpdateTTL) {
              this.#setItemTTL(index, ttl, start);
            }
            if (status)
              this.#statusTTL(status, index);
          }
          if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while (task = dt?.shift()) {
              this.#disposeAfter?.(...task);
            }
          }
          return this;
        }
        /**
         * Evict the least recently used item, returning its value or
         * `undefined` if cache is empty.
         */
        pop() {
          try {
            while (this.#size) {
              const val = this.#valList[this.#head];
              this.#evict(true);
              if (this.#isBackgroundFetch(val)) {
                if (val.__staleWhileFetching) {
                  return val.__staleWhileFetching;
                }
              } else if (val !== void 0) {
                return val;
              }
            }
          } finally {
            if (this.#hasDisposeAfter && this.#disposed) {
              const dt = this.#disposed;
              let task;
              while (task = dt?.shift()) {
                this.#disposeAfter?.(...task);
              }
            }
          }
        }
        #evict(free) {
          const head = this.#head;
          const k3 = this.#keyList[head];
          const v3 = this.#valList[head];
          if (this.#hasFetchMethod && this.#isBackgroundFetch(v3)) {
            v3.__abortController.abort(new Error("evicted"));
          } else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
              this.#dispose?.(v3, k3, "evict");
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([v3, k3, "evict"]);
            }
          }
          this.#removeItemSize(head);
          if (free) {
            this.#keyList[head] = void 0;
            this.#valList[head] = void 0;
            this.#free.push(head);
          }
          if (this.#size === 1) {
            this.#head = this.#tail = 0;
            this.#free.length = 0;
          } else {
            this.#head = this.#next[head];
          }
          this.#keyMap.delete(k3);
          this.#size--;
          return head;
        }
        /**
         * Check if a key is in the cache, without updating the recency of use.
         * Will return false if the item is stale, even though it is technically
         * in the cache.
         *
         * Will not update item age unless
         * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
         */
        has(k3, hasOptions = {}) {
          const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
          const index = this.#keyMap.get(k3);
          if (index !== void 0) {
            const v3 = this.#valList[index];
            if (this.#isBackgroundFetch(v3) && v3.__staleWhileFetching === void 0) {
              return false;
            }
            if (!this.#isStale(index)) {
              if (updateAgeOnHas) {
                this.#updateItemAge(index);
              }
              if (status) {
                status.has = "hit";
                this.#statusTTL(status, index);
              }
              return true;
            } else if (status) {
              status.has = "stale";
              this.#statusTTL(status, index);
            }
          } else if (status) {
            status.has = "miss";
          }
          return false;
        }
        /**
         * Like {@link LRUCache#get} but doesn't update recency or delete stale
         * items.
         *
         * Returns `undefined` if the item is stale, unless
         * {@link LRUCache.OptionsBase.allowStale} is set.
         */
        peek(k3, peekOptions = {}) {
          const { allowStale = this.allowStale } = peekOptions;
          const index = this.#keyMap.get(k3);
          if (index === void 0 || !allowStale && this.#isStale(index)) {
            return;
          }
          const v3 = this.#valList[index];
          return this.#isBackgroundFetch(v3) ? v3.__staleWhileFetching : v3;
        }
        #backgroundFetch(k3, index, options, context) {
          const v3 = index === void 0 ? void 0 : this.#valList[index];
          if (this.#isBackgroundFetch(v3)) {
            return v3;
          }
          const ac = new AC();
          const { signal } = options;
          signal?.addEventListener("abort", () => ac.abort(signal.reason), {
            signal: ac.signal
          });
          const fetchOpts = {
            signal: ac.signal,
            options,
            context
          };
          const cb = (v4, updateCache = false) => {
            const { aborted } = ac.signal;
            const ignoreAbort = options.ignoreFetchAbort && v4 !== void 0;
            if (options.status) {
              if (aborted && !updateCache) {
                options.status.fetchAborted = true;
                options.status.fetchError = ac.signal.reason;
                if (ignoreAbort)
                  options.status.fetchAbortIgnored = true;
              } else {
                options.status.fetchResolved = true;
              }
            }
            if (aborted && !ignoreAbort && !updateCache) {
              return fetchFail(ac.signal.reason);
            }
            const bf2 = p3;
            if (this.#valList[index] === p3) {
              if (v4 === void 0) {
                if (bf2.__staleWhileFetching) {
                  this.#valList[index] = bf2.__staleWhileFetching;
                } else {
                  this.delete(k3);
                }
              } else {
                if (options.status)
                  options.status.fetchUpdated = true;
                this.set(k3, v4, fetchOpts.options);
              }
            }
            return v4;
          };
          const eb = (er) => {
            if (options.status) {
              options.status.fetchRejected = true;
              options.status.fetchError = er;
            }
            return fetchFail(er);
          };
          const fetchFail = (er) => {
            const { aborted } = ac.signal;
            const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
            const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
            const noDelete = allowStale || options.noDeleteOnFetchRejection;
            const bf2 = p3;
            if (this.#valList[index] === p3) {
              const del = !noDelete || bf2.__staleWhileFetching === void 0;
              if (del) {
                this.delete(k3);
              } else if (!allowStaleAborted) {
                this.#valList[index] = bf2.__staleWhileFetching;
              }
            }
            if (allowStale) {
              if (options.status && bf2.__staleWhileFetching !== void 0) {
                options.status.returnedStale = true;
              }
              return bf2.__staleWhileFetching;
            } else if (bf2.__returned === bf2) {
              throw er;
            }
          };
          const pcall = (res, rej) => {
            const fmp = this.#fetchMethod?.(k3, v3, fetchOpts);
            if (fmp && fmp instanceof Promise) {
              fmp.then((v4) => res(v4 === void 0 ? void 0 : v4), rej);
            }
            ac.signal.addEventListener("abort", () => {
              if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
                res(void 0);
                if (options.allowStaleOnFetchAbort) {
                  res = (v4) => cb(v4, true);
                }
              }
            });
          };
          if (options.status)
            options.status.fetchDispatched = true;
          const p3 = new Promise(pcall).then(cb, eb);
          const bf = Object.assign(p3, {
            __abortController: ac,
            __staleWhileFetching: v3,
            __returned: void 0
          });
          if (index === void 0) {
            this.set(k3, bf, { ...fetchOpts.options, status: void 0 });
            index = this.#keyMap.get(k3);
          } else {
            this.#valList[index] = bf;
          }
          return bf;
        }
        #isBackgroundFetch(p3) {
          if (!this.#hasFetchMethod)
            return false;
          const b3 = p3;
          return !!b3 && b3 instanceof Promise && b3.hasOwnProperty("__staleWhileFetching") && b3.__abortController instanceof AC;
        }
        async fetch(k3, fetchOptions = {}) {
          const {
            // get options
            allowStale = this.allowStale,
            updateAgeOnGet = this.updateAgeOnGet,
            noDeleteOnStaleGet = this.noDeleteOnStaleGet,
            // set options
            ttl = this.ttl,
            noDisposeOnSet = this.noDisposeOnSet,
            size = 0,
            sizeCalculation = this.sizeCalculation,
            noUpdateTTL = this.noUpdateTTL,
            // fetch exclusive options
            noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
            allowStaleOnFetchRejection = this.allowStaleOnFetchRejection,
            ignoreFetchAbort = this.ignoreFetchAbort,
            allowStaleOnFetchAbort = this.allowStaleOnFetchAbort,
            context,
            forceRefresh = false,
            status,
            signal
          } = fetchOptions;
          if (!this.#hasFetchMethod) {
            if (status)
              status.fetch = "get";
            return this.get(k3, {
              allowStale,
              updateAgeOnGet,
              noDeleteOnStaleGet,
              status
            });
          }
          const options = {
            allowStale,
            updateAgeOnGet,
            noDeleteOnStaleGet,
            ttl,
            noDisposeOnSet,
            size,
            sizeCalculation,
            noUpdateTTL,
            noDeleteOnFetchRejection,
            allowStaleOnFetchRejection,
            allowStaleOnFetchAbort,
            ignoreFetchAbort,
            status,
            signal
          };
          let index = this.#keyMap.get(k3);
          if (index === void 0) {
            if (status)
              status.fetch = "miss";
            const p3 = this.#backgroundFetch(k3, index, options, context);
            return p3.__returned = p3;
          } else {
            const v3 = this.#valList[index];
            if (this.#isBackgroundFetch(v3)) {
              const stale = allowStale && v3.__staleWhileFetching !== void 0;
              if (status) {
                status.fetch = "inflight";
                if (stale)
                  status.returnedStale = true;
              }
              return stale ? v3.__staleWhileFetching : v3.__returned = v3;
            }
            const isStale = this.#isStale(index);
            if (!forceRefresh && !isStale) {
              if (status)
                status.fetch = "hit";
              this.#moveToTail(index);
              if (updateAgeOnGet) {
                this.#updateItemAge(index);
              }
              if (status)
                this.#statusTTL(status, index);
              return v3;
            }
            const p3 = this.#backgroundFetch(k3, index, options, context);
            const hasStale = p3.__staleWhileFetching !== void 0;
            const staleVal = hasStale && allowStale;
            if (status) {
              status.fetch = isStale ? "stale" : "refresh";
              if (staleVal && isStale)
                status.returnedStale = true;
            }
            return staleVal ? p3.__staleWhileFetching : p3.__returned = p3;
          }
        }
        /**
         * Return a value from the cache. Will update the recency of the cache
         * entry found.
         *
         * If the key is not found, get() will return `undefined`.
         */
        get(k3, getOptions = {}) {
          const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
          const index = this.#keyMap.get(k3);
          if (index !== void 0) {
            const value = this.#valList[index];
            const fetching = this.#isBackgroundFetch(value);
            if (status)
              this.#statusTTL(status, index);
            if (this.#isStale(index)) {
              if (status)
                status.get = "stale";
              if (!fetching) {
                if (!noDeleteOnStaleGet) {
                  this.delete(k3);
                }
                if (status && allowStale)
                  status.returnedStale = true;
                return allowStale ? value : void 0;
              } else {
                if (status && allowStale && value.__staleWhileFetching !== void 0) {
                  status.returnedStale = true;
                }
                return allowStale ? value.__staleWhileFetching : void 0;
              }
            } else {
              if (status)
                status.get = "hit";
              if (fetching) {
                return value.__staleWhileFetching;
              }
              this.#moveToTail(index);
              if (updateAgeOnGet) {
                this.#updateItemAge(index);
              }
              return value;
            }
          } else if (status) {
            status.get = "miss";
          }
        }
        #connect(p3, n4) {
          this.#prev[n4] = p3;
          this.#next[p3] = n4;
        }
        #moveToTail(index) {
          if (index !== this.#tail) {
            if (index === this.#head) {
              this.#head = this.#next[index];
            } else {
              this.#connect(this.#prev[index], this.#next[index]);
            }
            this.#connect(this.#tail, index);
            this.#tail = index;
          }
        }
        /**
         * Deletes a key out of the cache.
         * Returns true if the key was deleted, false otherwise.
         */
        delete(k3) {
          let deleted = false;
          if (this.#size !== 0) {
            const index = this.#keyMap.get(k3);
            if (index !== void 0) {
              deleted = true;
              if (this.#size === 1) {
                this.clear();
              } else {
                this.#removeItemSize(index);
                const v3 = this.#valList[index];
                if (this.#isBackgroundFetch(v3)) {
                  v3.__abortController.abort(new Error("deleted"));
                } else if (this.#hasDispose || this.#hasDisposeAfter) {
                  if (this.#hasDispose) {
                    this.#dispose?.(v3, k3, "delete");
                  }
                  if (this.#hasDisposeAfter) {
                    this.#disposed?.push([v3, k3, "delete"]);
                  }
                }
                this.#keyMap.delete(k3);
                this.#keyList[index] = void 0;
                this.#valList[index] = void 0;
                if (index === this.#tail) {
                  this.#tail = this.#prev[index];
                } else if (index === this.#head) {
                  this.#head = this.#next[index];
                } else {
                  const pi = this.#prev[index];
                  this.#next[pi] = this.#next[index];
                  const ni = this.#next[index];
                  this.#prev[ni] = this.#prev[index];
                }
                this.#size--;
                this.#free.push(index);
              }
            }
          }
          if (this.#hasDisposeAfter && this.#disposed?.length) {
            const dt = this.#disposed;
            let task;
            while (task = dt?.shift()) {
              this.#disposeAfter?.(...task);
            }
          }
          return deleted;
        }
        /**
         * Clear the cache entirely, throwing away all values.
         */
        clear() {
          for (const index of this.#rindexes({ allowStale: true })) {
            const v3 = this.#valList[index];
            if (this.#isBackgroundFetch(v3)) {
              v3.__abortController.abort(new Error("deleted"));
            } else {
              const k3 = this.#keyList[index];
              if (this.#hasDispose) {
                this.#dispose?.(v3, k3, "delete");
              }
              if (this.#hasDisposeAfter) {
                this.#disposed?.push([v3, k3, "delete"]);
              }
            }
          }
          this.#keyMap.clear();
          this.#valList.fill(void 0);
          this.#keyList.fill(void 0);
          if (this.#ttls && this.#starts) {
            this.#ttls.fill(0);
            this.#starts.fill(0);
          }
          if (this.#sizes) {
            this.#sizes.fill(0);
          }
          this.#head = 0;
          this.#tail = 0;
          this.#free.length = 0;
          this.#calculatedSize = 0;
          this.#size = 0;
          if (this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while (task = dt?.shift()) {
              this.#disposeAfter?.(...task);
            }
          }
        }
      };
      exports.LRUCache = LRUCache;
    }
  });

  // node_modules/@octokit/auth-app/dist-node/index.js
  var require_dist_node6 = __commonJS({
    "node_modules/@octokit/auth-app/dist-node/index.js"(exports, module) {
      "use strict";
      var __create2 = Object.create;
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf2 = Object.getPrototypeOf;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export2 = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var dist_src_exports = {};
      __export2(dist_src_exports, {
        createAppAuth: () => createAppAuth4,
        createOAuthUserAuth: () => import_auth_oauth_user22.createOAuthUserAuth
      });
      module.exports = __toCommonJS2(dist_src_exports);
      var import_universal_user_agent6 = require_dist_node();
      var import_request4 = (init_dist_web3(), __toCommonJS(dist_web_exports2));
      var import_auth_oauth_app = (init_dist_web8(), __toCommonJS(dist_web_exports6));
      var import_deprecation2 = require_dist_node2();
      var OAuthAppAuth = __toESM2((init_dist_web8(), __toCommonJS(dist_web_exports6)));
      var import_universal_github_app_jwt = (init_index_bundled(), __toCommonJS(index_bundled_exports));
      async function getAppAuthentication({
        appId,
        privateKey,
        timeDifference
      }) {
        try {
          const appAuthentication = await (0, import_universal_github_app_jwt.githubAppJwt)({
            id: +appId,
            privateKey,
            now: timeDifference && Math.floor(Date.now() / 1e3) + timeDifference
          });
          return {
            type: "app",
            token: appAuthentication.token,
            appId: appAuthentication.appId,
            expiresAt: new Date(appAuthentication.expiration * 1e3).toISOString()
          };
        } catch (error) {
          if (privateKey === "-----BEGIN RSA PRIVATE KEY-----") {
            throw new Error(
              "The 'privateKey` option contains only the first line '-----BEGIN RSA PRIVATE KEY-----'. If you are setting it using a `.env` file, make sure it is set on a single line with newlines replaced by '\n'"
            );
          } else {
            throw error;
          }
        }
      }
      var import_lru_cache = require_commonjs();
      function getCache() {
        return new import_lru_cache.LRUCache({
          // cache max. 15000 tokens, that will use less than 10mb memory
          max: 15e3,
          // Cache for 1 minute less than GitHub expiry
          ttl: 1e3 * 60 * 59
        });
      }
      async function get2(cache, options) {
        const cacheKey = optionsToCacheKey(options);
        const result = await cache.get(cacheKey);
        if (!result) {
          return;
        }
        const [
          token,
          createdAt,
          expiresAt,
          repositorySelection,
          permissionsString,
          singleFileName
        ] = result.split("|");
        const permissions = options.permissions || permissionsString.split(/,/).reduce((permissions2, string) => {
          if (/!$/.test(string)) {
            permissions2[string.slice(0, -1)] = "write";
          } else {
            permissions2[string] = "read";
          }
          return permissions2;
        }, {});
        return {
          token,
          createdAt,
          expiresAt,
          permissions,
          repositoryIds: options.repositoryIds,
          repositoryNames: options.repositoryNames,
          singleFileName,
          repositorySelection
        };
      }
      async function set2(cache, options, data) {
        const key = optionsToCacheKey(options);
        const permissionsString = options.permissions ? "" : Object.keys(data.permissions).map(
          (name) => `${name}${data.permissions[name] === "write" ? "!" : ""}`
        ).join(",");
        const value = [
          data.token,
          data.createdAt,
          data.expiresAt,
          data.repositorySelection,
          permissionsString,
          data.singleFileName
        ].join("|");
        await cache.set(key, value);
      }
      function optionsToCacheKey({
        installationId,
        permissions = {},
        repositoryIds = [],
        repositoryNames = []
      }) {
        const permissionsString = Object.keys(permissions).sort().map((name) => permissions[name] === "read" ? name : `${name}!`).join(",");
        const repositoryIdsString = repositoryIds.sort().join(",");
        const repositoryNamesString = repositoryNames.join(",");
        return [
          installationId,
          repositoryIdsString,
          repositoryNamesString,
          permissionsString
        ].filter(Boolean).join("|");
      }
      function toTokenAuthentication({
        installationId,
        token,
        createdAt,
        expiresAt,
        repositorySelection,
        permissions,
        repositoryIds,
        repositoryNames,
        singleFileName
      }) {
        return Object.assign(
          {
            type: "token",
            tokenType: "installation",
            token,
            installationId,
            permissions,
            createdAt,
            expiresAt,
            repositorySelection
          },
          repositoryIds ? { repositoryIds } : null,
          repositoryNames ? { repositoryNames } : null,
          singleFileName ? { singleFileName } : null
        );
      }
      async function getInstallationAuthentication(state, options, customRequest) {
        const installationId = Number(options.installationId || state.installationId);
        if (!installationId) {
          throw new Error(
            "[@octokit/auth-app] installationId option is required for installation authentication."
          );
        }
        if (options.factory) {
          const { type, factory, oauthApp, ...factoryAuthOptions } = {
            ...state,
            ...options
          };
          return factory(factoryAuthOptions);
        }
        const optionsWithInstallationTokenFromState = Object.assign(
          { installationId },
          options
        );
        if (!options.refresh) {
          const result = await get2(
            state.cache,
            optionsWithInstallationTokenFromState
          );
          if (result) {
            const {
              token: token2,
              createdAt: createdAt2,
              expiresAt: expiresAt2,
              permissions: permissions2,
              repositoryIds: repositoryIds2,
              repositoryNames: repositoryNames2,
              singleFileName: singleFileName2,
              repositorySelection: repositorySelection2
            } = result;
            return toTokenAuthentication({
              installationId,
              token: token2,
              createdAt: createdAt2,
              expiresAt: expiresAt2,
              permissions: permissions2,
              repositorySelection: repositorySelection2,
              repositoryIds: repositoryIds2,
              repositoryNames: repositoryNames2,
              singleFileName: singleFileName2
            });
          }
        }
        const appAuthentication = await getAppAuthentication(state);
        const request2 = customRequest || state.request;
        const {
          data: {
            token,
            expires_at: expiresAt,
            repositories,
            permissions: permissionsOptional,
            repository_selection: repositorySelectionOptional,
            single_file: singleFileName
          }
        } = await request2("POST /app/installations/{installation_id}/access_tokens", {
          installation_id: installationId,
          repository_ids: options.repositoryIds,
          repositories: options.repositoryNames,
          permissions: options.permissions,
          mediaType: {
            previews: ["machine-man"]
          },
          headers: {
            authorization: `bearer ${appAuthentication.token}`
          }
        });
        const permissions = permissionsOptional || {};
        const repositorySelection = repositorySelectionOptional || "all";
        const repositoryIds = repositories ? repositories.map((r3) => r3.id) : void 0;
        const repositoryNames = repositories ? repositories.map((repo) => repo.name) : void 0;
        const createdAt = (/* @__PURE__ */ new Date()).toISOString();
        await set2(state.cache, optionsWithInstallationTokenFromState, {
          token,
          createdAt,
          expiresAt,
          repositorySelection,
          permissions,
          repositoryIds,
          repositoryNames,
          singleFileName
        });
        return toTokenAuthentication({
          installationId,
          token,
          createdAt,
          expiresAt,
          repositorySelection,
          permissions,
          repositoryIds,
          repositoryNames,
          singleFileName
        });
      }
      async function auth6(state, authOptions) {
        switch (authOptions.type) {
          case "app":
            return getAppAuthentication(state);
          case "oauth":
            state.log.warn(
              // @ts-expect-error `log.warn()` expects string
              new import_deprecation2.Deprecation(
                `[@octokit/auth-app] {type: "oauth"} is deprecated. Use {type: "oauth-app"} instead`
              )
            );
          case "oauth-app":
            return state.oauthApp({ type: "oauth-app" });
          case "installation":
            authOptions;
            return getInstallationAuthentication(state, {
              ...authOptions,
              type: "installation"
            });
          case "oauth-user":
            return state.oauthApp(authOptions);
          default:
            throw new Error(`Invalid auth type: ${authOptions.type}`);
        }
      }
      var import_auth_oauth_user4 = (init_dist_web7(), __toCommonJS(dist_web_exports5));
      var import_request_error3 = (init_dist_web2(), __toCommonJS(dist_web_exports));
      var PATHS = [
        "/app",
        "/app/hook/config",
        "/app/hook/deliveries",
        "/app/hook/deliveries/{delivery_id}",
        "/app/hook/deliveries/{delivery_id}/attempts",
        "/app/installations",
        "/app/installations/{installation_id}",
        "/app/installations/{installation_id}/access_tokens",
        "/app/installations/{installation_id}/suspended",
        "/marketplace_listing/accounts/{account_id}",
        "/marketplace_listing/plan",
        "/marketplace_listing/plans",
        "/marketplace_listing/plans/{plan_id}/accounts",
        "/marketplace_listing/stubbed/accounts/{account_id}",
        "/marketplace_listing/stubbed/plan",
        "/marketplace_listing/stubbed/plans",
        "/marketplace_listing/stubbed/plans/{plan_id}/accounts",
        "/orgs/{org}/installation",
        "/repos/{owner}/{repo}/installation",
        "/users/{username}/installation"
      ];
      function routeMatcher2(paths) {
        const regexes = paths.map(
          (p3) => p3.split("/").map((c3) => c3.startsWith("{") ? "(?:.+?)" : c3).join("/")
        );
        const regex2 = `^(?:${regexes.map((r3) => `(?:${r3})`).join("|")})$`;
        return new RegExp(regex2, "i");
      }
      var REGEX = routeMatcher2(PATHS);
      function requiresAppAuth(url) {
        return !!url && REGEX.test(url.split("?")[0]);
      }
      var FIVE_SECONDS_IN_MS = 5 * 1e3;
      function isNotTimeSkewError(error) {
        return !(error.message.match(
          /'Expiration time' claim \('exp'\) must be a numeric value representing the future time at which the assertion expires/
        ) || error.message.match(
          /'Issued at' claim \('iat'\) must be an Integer representing the time that the assertion was issued/
        ));
      }
      async function hook5(state, request2, route, parameters) {
        const endpoint2 = request2.endpoint.merge(route, parameters);
        const url = endpoint2.url;
        if (/\/login\/oauth\/access_token$/.test(url)) {
          return request2(endpoint2);
        }
        if (requiresAppAuth(url.replace(request2.endpoint.DEFAULTS.baseUrl, ""))) {
          const { token: token2 } = await getAppAuthentication(state);
          endpoint2.headers.authorization = `bearer ${token2}`;
          let response;
          try {
            response = await request2(endpoint2);
          } catch (error) {
            if (isNotTimeSkewError(error)) {
              throw error;
            }
            if (typeof error.response.headers.date === "undefined") {
              throw error;
            }
            const diff = Math.floor(
              (Date.parse(error.response.headers.date) - Date.parse((/* @__PURE__ */ new Date()).toString())) / 1e3
            );
            state.log.warn(error.message);
            state.log.warn(
              `[@octokit/auth-app] GitHub API time and system time are different by ${diff} seconds. Retrying request with the difference accounted for.`
            );
            const { token: token3 } = await getAppAuthentication({
              ...state,
              timeDifference: diff
            });
            endpoint2.headers.authorization = `bearer ${token3}`;
            return request2(endpoint2);
          }
          return response;
        }
        if ((0, import_auth_oauth_user4.requiresBasicAuth)(url)) {
          const authentication = await state.oauthApp({ type: "oauth-app" });
          endpoint2.headers.authorization = authentication.headers.authorization;
          return request2(endpoint2);
        }
        const { token, createdAt } = await getInstallationAuthentication(
          state,
          // @ts-expect-error TBD
          {},
          request2
        );
        endpoint2.headers.authorization = `token ${token}`;
        return sendRequestWithRetries(
          state,
          request2,
          endpoint2,
          createdAt
        );
      }
      async function sendRequestWithRetries(state, request2, options, createdAt, retries = 0) {
        const timeSinceTokenCreationInMs = +/* @__PURE__ */ new Date() - +new Date(createdAt);
        try {
          return await request2(options);
        } catch (error) {
          if (error.status !== 401) {
            throw error;
          }
          if (timeSinceTokenCreationInMs >= FIVE_SECONDS_IN_MS) {
            if (retries > 0) {
              error.message = `After ${retries} retries within ${timeSinceTokenCreationInMs / 1e3}s of creating the installation access token, the response remains 401. At this point, the cause may be an authentication problem or a system outage. Please check https://www.githubstatus.com for status information`;
            }
            throw error;
          }
          ++retries;
          const awaitTime = retries * 1e3;
          state.log.warn(
            `[@octokit/auth-app] Retrying after 401 response to account for token replication delay (retry: ${retries}, wait: ${awaitTime / 1e3}s)`
          );
          await new Promise((resolve) => setTimeout(resolve, awaitTime));
          return sendRequestWithRetries(state, request2, options, createdAt, retries);
        }
      }
      var VERSION12 = "6.0.3";
      var import_auth_oauth_user22 = (init_dist_web7(), __toCommonJS(dist_web_exports5));
      function createAppAuth4(options) {
        if (!options.appId) {
          throw new Error("[@octokit/auth-app] appId option is required");
        }
        if (!Number.isFinite(+options.appId)) {
          throw new Error(
            "[@octokit/auth-app] appId option must be a number or numeric string"
          );
        }
        if (!options.privateKey) {
          throw new Error("[@octokit/auth-app] privateKey option is required");
        }
        if ("installationId" in options && !options.installationId) {
          throw new Error(
            "[@octokit/auth-app] installationId is set to a falsy value"
          );
        }
        const log = Object.assign(
          {
            warn: console.warn.bind(console)
          },
          options.log
        );
        const request2 = options.request || import_request4.request.defaults({
          headers: {
            "user-agent": `octokit-auth-app.js/${VERSION12} ${(0, import_universal_user_agent6.getUserAgent)()}`
          }
        });
        const state = Object.assign(
          {
            request: request2,
            cache: getCache()
          },
          options,
          options.installationId ? { installationId: Number(options.installationId) } : {},
          {
            log,
            oauthApp: (0, import_auth_oauth_app.createOAuthAppAuth)({
              clientType: "github-app",
              clientId: options.clientId || "",
              clientSecret: options.clientSecret || "",
              request: request2
            })
          }
        );
        return Object.assign(auth6.bind(null, state), {
          hook: hook5.bind(null, state)
        });
      }
    }
  });

  // node_modules/@octokit/auth-unauthenticated/dist-node/index.js
  var require_dist_node7 = __commonJS({
    "node_modules/@octokit/auth-unauthenticated/dist-node/index.js"(exports, module) {
      "use strict";
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export2 = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var dist_src_exports = {};
      __export2(dist_src_exports, {
        createUnauthenticatedAuth: () => createUnauthenticatedAuth2
      });
      module.exports = __toCommonJS2(dist_src_exports);
      async function auth6(reason) {
        return {
          type: "unauthenticated",
          reason
        };
      }
      var import_request_error3 = (init_dist_web2(), __toCommonJS(dist_web_exports));
      function isRateLimitError(error) {
        if (error.status !== 403) {
          return false;
        }
        if (!error.response) {
          return false;
        }
        return error.response.headers["x-ratelimit-remaining"] === "0";
      }
      var import_request_error22 = (init_dist_web2(), __toCommonJS(dist_web_exports));
      var REGEX_ABUSE_LIMIT_MESSAGE = /\babuse\b/i;
      function isAbuseLimitError(error) {
        if (error.status !== 403) {
          return false;
        }
        return REGEX_ABUSE_LIMIT_MESSAGE.test(error.message);
      }
      async function hook5(reason, request2, route, parameters) {
        const endpoint2 = request2.endpoint.merge(
          route,
          parameters
        );
        return request2(endpoint2).catch((error) => {
          if (error.status === 404) {
            error.message = `Not found. May be due to lack of authentication. Reason: ${reason}`;
            throw error;
          }
          if (isRateLimitError(error)) {
            error.message = `API rate limit exceeded. This maybe caused by the lack of authentication. Reason: ${reason}`;
            throw error;
          }
          if (isAbuseLimitError(error)) {
            error.message = `You have triggered an abuse detection mechanism. This maybe caused by the lack of authentication. Reason: ${reason}`;
            throw error;
          }
          if (error.status === 401) {
            error.message = `Unauthorized. "${endpoint2.method} ${endpoint2.url}" failed most likely due to lack of authentication. Reason: ${reason}`;
            throw error;
          }
          if (error.status >= 400 && error.status < 500) {
            error.message = error.message.replace(
              /\.?$/,
              `. May be caused by lack of authentication (${reason}).`
            );
          }
          throw error;
        });
      }
      var createUnauthenticatedAuth2 = function createUnauthenticatedAuth22(options) {
        if (!options || !options.reason) {
          throw new Error(
            "[@octokit/auth-unauthenticated] No reason passed to createUnauthenticatedAuth"
          );
        }
        return Object.assign(auth6.bind(null, options.reason), {
          hook: hook5.bind(null, options.reason)
        });
      };
    }
  });

  // node_modules/@octokit/oauth-app/dist-node/index.js
  var require_dist_node8 = __commonJS({
    "node_modules/@octokit/oauth-app/dist-node/index.js"(exports, module) {
      "use strict";
      var __create2 = Object.create;
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf2 = Object.getPrototypeOf;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export2 = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var dist_src_exports = {};
      __export2(dist_src_exports, {
        OAuthApp: () => OAuthApp3,
        createAWSLambdaAPIGatewayV2Handler: () => createAWSLambdaAPIGatewayV2Handler,
        createNodeMiddleware: () => createNodeMiddleware,
        createWebWorkerHandler: () => createWebWorkerHandler,
        handleRequest: () => handleRequest,
        sendNodeResponse: () => sendResponse,
        unknownRouteResponse: () => unknownRouteResponse
      });
      module.exports = __toCommonJS2(dist_src_exports);
      var import_auth_oauth_app = (init_dist_web8(), __toCommonJS(dist_web_exports6));
      var VERSION12 = "6.1.0";
      function addEventHandler(state, eventName, eventHandler) {
        if (Array.isArray(eventName)) {
          for (const singleEventName of eventName) {
            addEventHandler(state, singleEventName, eventHandler);
          }
          return;
        }
        if (!state.eventHandlers[eventName]) {
          state.eventHandlers[eventName] = [];
        }
        state.eventHandlers[eventName].push(eventHandler);
      }
      var import_core3 = require_dist_node4();
      var import_universal_user_agent6 = require_dist_node();
      var OAuthAppOctokit = import_core3.Octokit.defaults({
        userAgent: `octokit-oauth-app.js/${VERSION12} ${(0, import_universal_user_agent6.getUserAgent)()}`
      });
      var import_auth_oauth_user4 = (init_dist_web7(), __toCommonJS(dist_web_exports5));
      async function emitEvent(state, context) {
        const { name, action } = context;
        if (state.eventHandlers[`${name}.${action}`]) {
          for (const eventHandler of state.eventHandlers[`${name}.${action}`]) {
            await eventHandler(context);
          }
        }
        if (state.eventHandlers[name]) {
          for (const eventHandler of state.eventHandlers[name]) {
            await eventHandler(context);
          }
        }
      }
      async function getUserOctokitWithState(state, options) {
        return state.octokit.auth({
          type: "oauth-user",
          ...options,
          async factory(options2) {
            const octokit2 = new state.Octokit({
              authStrategy: import_auth_oauth_user4.createOAuthUserAuth,
              auth: options2
            });
            const authentication = await octokit2.auth({
              type: "get"
            });
            await emitEvent(state, {
              name: "token",
              action: "created",
              token: authentication.token,
              scopes: authentication.scopes,
              authentication,
              octokit: octokit2
            });
            return octokit2;
          }
        });
      }
      var OAuthMethods = __toESM2(require_dist_node5());
      function getWebFlowAuthorizationUrlWithState(state, options) {
        const optionsWithDefaults = {
          clientId: state.clientId,
          request: state.octokit.request,
          ...options,
          allowSignup: state.allowSignup ?? options.allowSignup,
          redirectUrl: options.redirectUrl ?? state.redirectUrl,
          scopes: options.scopes ?? state.defaultScopes
        };
        return OAuthMethods.getWebFlowAuthorizationUrl({
          clientType: state.clientType,
          ...optionsWithDefaults
        });
      }
      var OAuthAppAuth = __toESM2((init_dist_web8(), __toCommonJS(dist_web_exports6)));
      async function createTokenWithState(state, options) {
        const authentication = await state.octokit.auth({
          type: "oauth-user",
          ...options
        });
        await emitEvent(state, {
          name: "token",
          action: "created",
          token: authentication.token,
          scopes: authentication.scopes,
          authentication,
          octokit: new state.Octokit({
            authStrategy: OAuthAppAuth.createOAuthUserAuth,
            auth: {
              clientType: state.clientType,
              clientId: state.clientId,
              clientSecret: state.clientSecret,
              token: authentication.token,
              scopes: authentication.scopes,
              refreshToken: authentication.refreshToken,
              expiresAt: authentication.expiresAt,
              refreshTokenExpiresAt: authentication.refreshTokenExpiresAt
            }
          })
        });
        return { authentication };
      }
      var OAuthMethods2 = __toESM2(require_dist_node5());
      async function checkTokenWithState(state, options) {
        const result = await OAuthMethods2.checkToken({
          // @ts-expect-error not worth the extra code to appease TS
          clientType: state.clientType,
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          request: state.octokit.request,
          ...options
        });
        Object.assign(result.authentication, { type: "token", tokenType: "oauth" });
        return result;
      }
      var OAuthMethods3 = __toESM2(require_dist_node5());
      var import_auth_oauth_user22 = (init_dist_web7(), __toCommonJS(dist_web_exports5));
      async function resetTokenWithState(state, options) {
        const optionsWithDefaults = {
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          request: state.octokit.request,
          ...options
        };
        if (state.clientType === "oauth-app") {
          const response2 = await OAuthMethods3.resetToken({
            clientType: "oauth-app",
            ...optionsWithDefaults
          });
          const authentication2 = Object.assign(response2.authentication, {
            type: "token",
            tokenType: "oauth"
          });
          await emitEvent(state, {
            name: "token",
            action: "reset",
            token: response2.authentication.token,
            scopes: response2.authentication.scopes || void 0,
            authentication: authentication2,
            octokit: new state.Octokit({
              authStrategy: import_auth_oauth_user22.createOAuthUserAuth,
              auth: {
                clientType: state.clientType,
                clientId: state.clientId,
                clientSecret: state.clientSecret,
                token: response2.authentication.token,
                scopes: response2.authentication.scopes
              }
            })
          });
          return { ...response2, authentication: authentication2 };
        }
        const response = await OAuthMethods3.resetToken({
          clientType: "github-app",
          ...optionsWithDefaults
        });
        const authentication = Object.assign(response.authentication, {
          type: "token",
          tokenType: "oauth"
        });
        await emitEvent(state, {
          name: "token",
          action: "reset",
          token: response.authentication.token,
          authentication,
          octokit: new state.Octokit({
            authStrategy: import_auth_oauth_user22.createOAuthUserAuth,
            auth: {
              clientType: state.clientType,
              clientId: state.clientId,
              clientSecret: state.clientSecret,
              token: response.authentication.token
            }
          })
        });
        return { ...response, authentication };
      }
      var OAuthMethods4 = __toESM2(require_dist_node5());
      var import_auth_oauth_user32 = (init_dist_web7(), __toCommonJS(dist_web_exports5));
      async function refreshTokenWithState(state, options) {
        if (state.clientType === "oauth-app") {
          throw new Error(
            "[@octokit/oauth-app] app.refreshToken() is not supported for OAuth Apps"
          );
        }
        const response = await OAuthMethods4.refreshToken({
          clientType: "github-app",
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          request: state.octokit.request,
          refreshToken: options.refreshToken
        });
        const authentication = Object.assign(response.authentication, {
          type: "token",
          tokenType: "oauth"
        });
        await emitEvent(state, {
          name: "token",
          action: "refreshed",
          token: response.authentication.token,
          authentication,
          octokit: new state.Octokit({
            authStrategy: import_auth_oauth_user32.createOAuthUserAuth,
            auth: {
              clientType: state.clientType,
              clientId: state.clientId,
              clientSecret: state.clientSecret,
              token: response.authentication.token
            }
          })
        });
        return { ...response, authentication };
      }
      var OAuthMethods5 = __toESM2(require_dist_node5());
      var import_auth_oauth_user42 = (init_dist_web7(), __toCommonJS(dist_web_exports5));
      async function scopeTokenWithState(state, options) {
        if (state.clientType === "oauth-app") {
          throw new Error(
            "[@octokit/oauth-app] app.scopeToken() is not supported for OAuth Apps"
          );
        }
        const response = await OAuthMethods5.scopeToken({
          clientType: "github-app",
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          request: state.octokit.request,
          ...options
        });
        const authentication = Object.assign(response.authentication, {
          type: "token",
          tokenType: "oauth"
        });
        await emitEvent(state, {
          name: "token",
          action: "scoped",
          token: response.authentication.token,
          authentication,
          octokit: new state.Octokit({
            authStrategy: import_auth_oauth_user42.createOAuthUserAuth,
            auth: {
              clientType: state.clientType,
              clientId: state.clientId,
              clientSecret: state.clientSecret,
              token: response.authentication.token
            }
          })
        });
        return { ...response, authentication };
      }
      var OAuthMethods6 = __toESM2(require_dist_node5());
      var import_auth_unauthenticated2 = require_dist_node7();
      async function deleteTokenWithState(state, options) {
        const optionsWithDefaults = {
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          request: state.octokit.request,
          ...options
        };
        const response = state.clientType === "oauth-app" ? await OAuthMethods6.deleteToken({
          clientType: "oauth-app",
          ...optionsWithDefaults
        }) : (
          // istanbul ignore next
          await OAuthMethods6.deleteToken({
            clientType: "github-app",
            ...optionsWithDefaults
          })
        );
        await emitEvent(state, {
          name: "token",
          action: "deleted",
          token: options.token,
          octokit: new state.Octokit({
            authStrategy: import_auth_unauthenticated2.createUnauthenticatedAuth,
            auth: {
              reason: `Handling "token.deleted" event. The access for the token has been revoked.`
            }
          })
        });
        return response;
      }
      var OAuthMethods7 = __toESM2(require_dist_node5());
      var import_auth_unauthenticated22 = require_dist_node7();
      async function deleteAuthorizationWithState(state, options) {
        const optionsWithDefaults = {
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          request: state.octokit.request,
          ...options
        };
        const response = state.clientType === "oauth-app" ? await OAuthMethods7.deleteAuthorization({
          clientType: "oauth-app",
          ...optionsWithDefaults
        }) : (
          // istanbul ignore next
          await OAuthMethods7.deleteAuthorization({
            clientType: "github-app",
            ...optionsWithDefaults
          })
        );
        await emitEvent(state, {
          name: "token",
          action: "deleted",
          token: options.token,
          octokit: new state.Octokit({
            authStrategy: import_auth_unauthenticated22.createUnauthenticatedAuth,
            auth: {
              reason: `Handling "token.deleted" event. The access for the token has been revoked.`
            }
          })
        });
        await emitEvent(state, {
          name: "authorization",
          action: "deleted",
          token: options.token,
          octokit: new state.Octokit({
            authStrategy: import_auth_unauthenticated22.createUnauthenticatedAuth,
            auth: {
              reason: `Handling "authorization.deleted" event. The access for the app has been revoked.`
            }
          })
        });
        return response;
      }
      function unknownRouteResponse(request2) {
        return {
          status: 404,
          headers: { "content-type": "application/json" },
          text: JSON.stringify({
            error: `Unknown route: ${request2.method} ${request2.url}`
          })
        };
      }
      async function handleRequest(app, { pathPrefix = "/api/github/oauth" }, request2) {
        if (request2.method === "OPTIONS") {
          return {
            status: 200,
            headers: {
              "access-control-allow-origin": "*",
              "access-control-allow-methods": "*",
              "access-control-allow-headers": "Content-Type, User-Agent, Authorization"
            }
          };
        }
        let { pathname } = new URL(request2.url, "http://localhost");
        if (!pathname.startsWith(`${pathPrefix}/`)) {
          return void 0;
        }
        pathname = pathname.slice(pathPrefix.length + 1);
        const route = [request2.method, pathname].join(" ");
        const routes = {
          getLogin: `GET login`,
          getCallback: `GET callback`,
          createToken: `POST token`,
          getToken: `GET token`,
          patchToken: `PATCH token`,
          patchRefreshToken: `PATCH refresh-token`,
          scopeToken: `POST token/scoped`,
          deleteToken: `DELETE token`,
          deleteGrant: `DELETE grant`
        };
        if (!Object.values(routes).includes(route)) {
          return unknownRouteResponse(request2);
        }
        let json;
        try {
          const text = await request2.text();
          json = text ? JSON.parse(text) : {};
        } catch (error) {
          return {
            status: 400,
            headers: {
              "content-type": "application/json",
              "access-control-allow-origin": "*"
            },
            text: JSON.stringify({
              error: "[@octokit/oauth-app] request error"
            })
          };
        }
        const { searchParams } = new URL(request2.url, "http://localhost");
        const query = Object.fromEntries(searchParams);
        const headers = request2.headers;
        try {
          if (route === routes.getLogin) {
            const { url } = app.getWebFlowAuthorizationUrl({
              state: query.state,
              scopes: query.scopes ? query.scopes.split(",") : void 0,
              allowSignup: query.allowSignup ? query.allowSignup === "true" : void 0,
              redirectUrl: query.redirectUrl
            });
            return { status: 302, headers: { location: url } };
          }
          if (route === routes.getCallback) {
            if (query.error) {
              throw new Error(
                `[@octokit/oauth-app] ${query.error} ${query.error_description}`
              );
            }
            if (!query.code) {
              throw new Error('[@octokit/oauth-app] "code" parameter is required');
            }
            const {
              authentication: { token: token2 }
            } = await app.createToken({
              code: query.code
            });
            return {
              status: 200,
              headers: {
                "content-type": "text/html"
              },
              text: `<h1>Token created successfully</h1>

<p>Your token is: <strong>${token2}</strong>. Copy it now as it cannot be shown again.</p>`
            };
          }
          if (route === routes.createToken) {
            const { code, redirectUrl } = json;
            if (!code) {
              throw new Error('[@octokit/oauth-app] "code" parameter is required');
            }
            const result = await app.createToken({
              code,
              redirectUrl
            });
            delete result.authentication.clientSecret;
            return {
              status: 201,
              headers: {
                "content-type": "application/json",
                "access-control-allow-origin": "*"
              },
              text: JSON.stringify(result)
            };
          }
          if (route === routes.getToken) {
            const token2 = headers.authorization?.substr("token ".length);
            if (!token2) {
              throw new Error(
                '[@octokit/oauth-app] "Authorization" header is required'
              );
            }
            const result = await app.checkToken({
              token: token2
            });
            delete result.authentication.clientSecret;
            return {
              status: 200,
              headers: {
                "content-type": "application/json",
                "access-control-allow-origin": "*"
              },
              text: JSON.stringify(result)
            };
          }
          if (route === routes.patchToken) {
            const token2 = headers.authorization?.substr("token ".length);
            if (!token2) {
              throw new Error(
                '[@octokit/oauth-app] "Authorization" header is required'
              );
            }
            const result = await app.resetToken({ token: token2 });
            delete result.authentication.clientSecret;
            return {
              status: 200,
              headers: {
                "content-type": "application/json",
                "access-control-allow-origin": "*"
              },
              text: JSON.stringify(result)
            };
          }
          if (route === routes.patchRefreshToken) {
            const token2 = headers.authorization?.substr("token ".length);
            if (!token2) {
              throw new Error(
                '[@octokit/oauth-app] "Authorization" header is required'
              );
            }
            const { refreshToken: refreshToken2 } = json;
            if (!refreshToken2) {
              throw new Error(
                "[@octokit/oauth-app] refreshToken must be sent in request body"
              );
            }
            const result = await app.refreshToken({ refreshToken: refreshToken2 });
            delete result.authentication.clientSecret;
            return {
              status: 200,
              headers: {
                "content-type": "application/json",
                "access-control-allow-origin": "*"
              },
              text: JSON.stringify(result)
            };
          }
          if (route === routes.scopeToken) {
            const token2 = headers.authorization?.substr("token ".length);
            if (!token2) {
              throw new Error(
                '[@octokit/oauth-app] "Authorization" header is required'
              );
            }
            const result = await app.scopeToken({
              token: token2,
              ...json
            });
            delete result.authentication.clientSecret;
            return {
              status: 200,
              headers: {
                "content-type": "application/json",
                "access-control-allow-origin": "*"
              },
              text: JSON.stringify(result)
            };
          }
          if (route === routes.deleteToken) {
            const token2 = headers.authorization?.substr("token ".length);
            if (!token2) {
              throw new Error(
                '[@octokit/oauth-app] "Authorization" header is required'
              );
            }
            await app.deleteToken({
              token: token2
            });
            return {
              status: 204,
              headers: { "access-control-allow-origin": "*" }
            };
          }
          const token = headers.authorization?.substr("token ".length);
          if (!token) {
            throw new Error(
              '[@octokit/oauth-app] "Authorization" header is required'
            );
          }
          await app.deleteAuthorization({
            token
          });
          return {
            status: 204,
            headers: { "access-control-allow-origin": "*" }
          };
        } catch (error) {
          return {
            status: 400,
            headers: {
              "content-type": "application/json",
              "access-control-allow-origin": "*"
            },
            text: JSON.stringify({ error: error.message })
          };
        }
      }
      function parseRequest(request2) {
        const { method, url, headers } = request2;
        async function text() {
          const text2 = await new Promise((resolve, reject) => {
            let bodyChunks = [];
            request2.on("error", reject).on("data", (chunk) => bodyChunks.push(chunk)).on("end", () => resolve(Buffer.concat(bodyChunks).toString()));
          });
          return text2;
        }
        return { method, url, headers, text };
      }
      function sendResponse(octokitResponse, response) {
        response.writeHead(octokitResponse.status, octokitResponse.headers);
        response.end(octokitResponse.text);
      }
      function createNodeMiddleware(app, options = {}) {
        return async function(request2, response, next) {
          const octokitRequest = await parseRequest(request2);
          const octokitResponse = await handleRequest(app, options, octokitRequest);
          if (octokitResponse) {
            sendResponse(octokitResponse, response);
            return true;
          } else {
            next?.();
            return false;
          }
        };
      }
      function parseRequest2(request2) {
        const headers = Object.fromEntries(request2.headers.entries());
        return {
          method: request2.method,
          url: request2.url,
          headers,
          text: () => request2.text()
        };
      }
      function sendResponse2(octokitResponse) {
        return new Response(octokitResponse.text, {
          status: octokitResponse.status,
          headers: octokitResponse.headers
        });
      }
      function createWebWorkerHandler(app, options = {}) {
        return async function(request2) {
          const octokitRequest = await parseRequest2(request2);
          const octokitResponse = await handleRequest(app, options, octokitRequest);
          return octokitResponse ? sendResponse2(octokitResponse) : void 0;
        };
      }
      function parseRequest3(request2) {
        const { method } = request2.requestContext.http;
        let url = request2.rawPath;
        const { stage } = request2.requestContext;
        if (url.startsWith("/" + stage))
          url = url.substring(stage.length + 1);
        if (request2.rawQueryString)
          url += "?" + request2.rawQueryString;
        const headers = request2.headers;
        const text = async () => request2.body || "";
        return { method, url, headers, text };
      }
      function sendResponse3(octokitResponse) {
        return {
          statusCode: octokitResponse.status,
          headers: octokitResponse.headers,
          body: octokitResponse.text
        };
      }
      function createAWSLambdaAPIGatewayV2Handler(app, options = {}) {
        return async function(event) {
          const request2 = parseRequest3(event);
          const response = await handleRequest(app, options, request2);
          return response ? sendResponse3(response) : void 0;
        };
      }
      var OAuthApp3 = class {
        static {
          this.VERSION = VERSION12;
        }
        static defaults(defaults) {
          const OAuthAppWithDefaults = class extends this {
            constructor(...args) {
              super({
                ...defaults,
                ...args[0]
              });
            }
          };
          return OAuthAppWithDefaults;
        }
        constructor(options) {
          const Octokit2 = options.Octokit || OAuthAppOctokit;
          this.type = options.clientType || "oauth-app";
          const octokit2 = new Octokit2({
            authStrategy: import_auth_oauth_app.createOAuthAppAuth,
            auth: {
              clientType: this.type,
              clientId: options.clientId,
              clientSecret: options.clientSecret
            }
          });
          const state = {
            clientType: this.type,
            clientId: options.clientId,
            clientSecret: options.clientSecret,
            // @ts-expect-error defaultScopes not permitted for GitHub Apps
            defaultScopes: options.defaultScopes || [],
            allowSignup: options.allowSignup,
            baseUrl: options.baseUrl,
            redirectUrl: options.redirectUrl,
            log: options.log,
            Octokit: Octokit2,
            octokit: octokit2,
            eventHandlers: {}
          };
          this.on = addEventHandler.bind(null, state);
          this.octokit = octokit2;
          this.getUserOctokit = getUserOctokitWithState.bind(null, state);
          this.getWebFlowAuthorizationUrl = getWebFlowAuthorizationUrlWithState.bind(
            null,
            state
          );
          this.createToken = createTokenWithState.bind(
            null,
            state
          );
          this.checkToken = checkTokenWithState.bind(
            null,
            state
          );
          this.resetToken = resetTokenWithState.bind(
            null,
            state
          );
          this.refreshToken = refreshTokenWithState.bind(
            null,
            state
          );
          this.scopeToken = scopeTokenWithState.bind(
            null,
            state
          );
          this.deleteToken = deleteTokenWithState.bind(null, state);
          this.deleteAuthorization = deleteAuthorizationWithState.bind(null, state);
        }
      };
    }
  });

  // node_modules/indent-string/index.js
  var require_indent_string = __commonJS({
    "node_modules/indent-string/index.js"(exports, module) {
      "use strict";
      module.exports = (string, count = 1, options) => {
        options = {
          indent: " ",
          includeEmptyLines: false,
          ...options
        };
        if (typeof string !== "string") {
          throw new TypeError(
            `Expected \`input\` to be a \`string\`, got \`${typeof string}\``
          );
        }
        if (typeof count !== "number") {
          throw new TypeError(
            `Expected \`count\` to be a \`number\`, got \`${typeof count}\``
          );
        }
        if (typeof options.indent !== "string") {
          throw new TypeError(
            `Expected \`options.indent\` to be a \`string\`, got \`${typeof options.indent}\``
          );
        }
        if (count === 0) {
          return string;
        }
        const regex2 = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
        return string.replace(regex2, options.indent.repeat(count));
      };
    }
  });

  // (disabled):os
  var require_os = __commonJS({
    "(disabled):os"() {
    }
  });

  // node_modules/clean-stack/index.js
  var require_clean_stack = __commonJS({
    "node_modules/clean-stack/index.js"(exports, module) {
      "use strict";
      var os = require_os();
      var extractPathRegex = /\s+at.*(?:\(|\s)(.*)\)?/;
      var pathRegex = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:babel-polyfill|pirates)\/.*)?\w+)\.js:\d+:\d+)|native)/;
      var homeDir = typeof os.homedir === "undefined" ? "" : os.homedir();
      module.exports = (stack, options) => {
        options = Object.assign({ pretty: false }, options);
        return stack.replace(/\\/g, "/").split("\n").filter((line) => {
          const pathMatches = line.match(extractPathRegex);
          if (pathMatches === null || !pathMatches[1]) {
            return true;
          }
          const match = pathMatches[1];
          if (match.includes(".app/Contents/Resources/electron.asar") || match.includes(".app/Contents/Resources/default_app.asar")) {
            return false;
          }
          return !pathRegex.test(match);
        }).filter((line) => line.trim() !== "").map((line) => {
          if (options.pretty) {
            return line.replace(extractPathRegex, (m3, p1) => m3.replace(p1, p1.replace(homeDir, "~")));
          }
          return line;
        }).join("\n");
      };
    }
  });

  // node_modules/aggregate-error/index.js
  var require_aggregate_error = __commonJS({
    "node_modules/aggregate-error/index.js"(exports, module) {
      "use strict";
      var indentString = require_indent_string();
      var cleanStack = require_clean_stack();
      var cleanInternalStack = (stack) => stack.replace(/\s+at .*aggregate-error\/index.js:\d+:\d+\)?/g, "");
      var AggregateError4 = class extends Error {
        constructor(errors) {
          if (!Array.isArray(errors)) {
            throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
          }
          errors = [...errors].map((error) => {
            if (error instanceof Error) {
              return error;
            }
            if (error !== null && typeof error === "object") {
              return Object.assign(new Error(error.message), error);
            }
            return new Error(error);
          });
          let message = errors.map((error) => {
            return typeof error.stack === "string" ? cleanInternalStack(cleanStack(error.stack)) : String(error);
          }).join("\n");
          message = "\n" + indentString(message, 4);
          super(message);
          this.name = "AggregateError";
          Object.defineProperty(this, "_errors", { value: errors });
        }
        *[Symbol.iterator]() {
          for (const error of this._errors) {
            yield error;
          }
        }
      };
      module.exports = AggregateError4;
    }
  });

  // node_modules/highcharts/highcharts.js
  var require_highcharts = __commonJS({
    "node_modules/highcharts/highcharts.js"(exports, module) {
      !function(t3, e3) {
        "object" == typeof module && module.exports ? (e3.default = e3, module.exports = t3 && t3.document ? e3(t3) : e3) : "function" == typeof define && define.amd ? define("highcharts/highcharts", function() {
          return e3(t3);
        }) : (t3.Highcharts && t3.Highcharts.error(16, true), t3.Highcharts = e3(t3));
      }("undefined" != typeof window ? window : exports, function(t3) {
        "use strict";
        var e3 = {};
        function i4(e4, i5, s3, o4) {
          e4.hasOwnProperty(i5) || (e4[i5] = o4.apply(null, s3), "function" == typeof CustomEvent && t3.dispatchEvent(new CustomEvent("HighchartsModuleLoaded", { detail: { path: i5, module: e4[i5] } })));
        }
        return i4(e3, "Core/Globals.js", [], function() {
          var e4, i5;
          return (i5 = e4 || (e4 = {})).SVG_NS = "http://www.w3.org/2000/svg", i5.product = "Highcharts", i5.version = "11.3.0", i5.win = void 0 !== t3 ? t3 : {}, i5.doc = i5.win.document, i5.svg = i5.doc && i5.doc.createElementNS && !!i5.doc.createElementNS(i5.SVG_NS, "svg").createSVGRect, i5.userAgent = i5.win.navigator && i5.win.navigator.userAgent || "", i5.isChrome = -1 !== i5.userAgent.indexOf("Chrome"), i5.isFirefox = -1 !== i5.userAgent.indexOf("Firefox"), i5.isMS = /(edge|msie|trident)/i.test(i5.userAgent) && !i5.win.opera, i5.isSafari = !i5.isChrome && -1 !== i5.userAgent.indexOf("Safari"), i5.isTouchDevice = /(Mobile|Android|Windows Phone)/.test(i5.userAgent), i5.isWebKit = -1 !== i5.userAgent.indexOf("AppleWebKit"), i5.deg2rad = 2 * Math.PI / 360, i5.hasBidiBug = i5.isFirefox && 4 > parseInt(i5.userAgent.split("Firefox/")[1], 10), i5.hasTouch = !!i5.win.TouchEvent, i5.marginNames = ["plotTop", "marginRight", "marginBottom", "plotLeft"], i5.noop = function() {
          }, i5.supportsPassiveEvents = function() {
            let t4 = false;
            if (!i5.isMS) {
              let e5 = Object.defineProperty({}, "passive", { get: function() {
                t4 = true;
              } });
              i5.win.addEventListener && i5.win.removeEventListener && (i5.win.addEventListener("testPassive", i5.noop, e5), i5.win.removeEventListener("testPassive", i5.noop, e5));
            }
            return t4;
          }(), i5.charts = [], i5.composed = [], i5.dateFormats = {}, i5.seriesTypes = {}, i5.symbolSizes = {}, i5.chartCount = 0, e4;
        }), i4(e3, "Core/Utilities.js", [e3["Core/Globals.js"]], function(t4) {
          let e4;
          let { charts: i5, doc: s3, win: o4 } = t4;
          function r3(e5, i6, s4, n5) {
            let a5 = i6 ? "Highcharts error" : "Highcharts warning";
            32 === e5 && (e5 = `${a5}: Deprecated member`);
            let h4 = p3(e5), l4 = h4 ? `${a5} #${e5}: www.highcharts.com/errors/${e5}/` : e5.toString();
            if (void 0 !== n5) {
              let t5 = "";
              h4 && (l4 += "?"), k3(n5, function(e6, i7) {
                t5 += `
 - ${i7}: ${e6}`, h4 && (l4 += encodeURI(i7) + "=" + encodeURI(e6));
              }), l4 += t5;
            }
            C3(t4, "displayError", { chart: s4, code: e5, message: l4, params: n5 }, function() {
              if (i6)
                throw Error(l4);
              o4.console && -1 === r3.messages.indexOf(l4) && console.warn(l4);
            }), r3.messages.push(l4);
          }
          function n4(t5, e5) {
            return parseInt(t5, e5 || 10);
          }
          function a4(t5) {
            return "string" == typeof t5;
          }
          function h3(t5) {
            let e5 = Object.prototype.toString.call(t5);
            return "[object Array]" === e5 || "[object Array Iterator]" === e5;
          }
          function l3(t5, e5) {
            return !!t5 && "object" == typeof t5 && (!e5 || !h3(t5));
          }
          function d3(t5) {
            return l3(t5) && "number" == typeof t5.nodeType;
          }
          function c3(t5) {
            let e5 = t5 && t5.constructor;
            return !!(l3(t5, true) && !d3(t5) && e5 && e5.name && "Object" !== e5.name);
          }
          function p3(t5) {
            return "number" == typeof t5 && !isNaN(t5) && t5 < 1 / 0 && t5 > -1 / 0;
          }
          function u4(t5) {
            return null != t5;
          }
          function g3(t5, e5, i6) {
            let s4;
            let o5 = a4(e5) && !u4(i6), r4 = (e6, i7) => {
              u4(e6) ? t5.setAttribute(i7, e6) : o5 ? (s4 = t5.getAttribute(i7)) || "class" !== i7 || (s4 = t5.getAttribute(i7 + "Name")) : t5.removeAttribute(i7);
            };
            return a4(e5) ? r4(i6, e5) : k3(e5, r4), s4;
          }
          function f3(t5) {
            return h3(t5) ? t5 : [t5];
          }
          function m3(t5, e5) {
            let i6;
            for (i6 in t5 || (t5 = {}), e5)
              t5[i6] = e5[i6];
            return t5;
          }
          function x3() {
            let t5 = arguments, e5 = t5.length;
            for (let i6 = 0; i6 < e5; i6++) {
              let e6 = t5[i6];
              if (null != e6)
                return e6;
            }
          }
          function y3(e5, i6) {
            t4.isMS && !t4.svg && i6 && u4(i6.opacity) && (i6.filter = `alpha(opacity=${100 * i6.opacity})`), m3(e5.style, i6);
          }
          function b3(t5) {
            return Math.pow(10, Math.floor(Math.log(t5) / Math.LN10));
          }
          function v3(t5, e5) {
            return t5 > 1e14 ? t5 : parseFloat(t5.toPrecision(e5 || 14));
          }
          (r3 || (r3 = {})).messages = [], Math.easeInOutSine = function(t5) {
            return -0.5 * (Math.cos(Math.PI * t5) - 1);
          };
          let S3 = Array.prototype.find ? function(t5, e5) {
            return t5.find(e5);
          } : function(t5, e5) {
            let i6;
            let s4 = t5.length;
            for (i6 = 0; i6 < s4; i6++)
              if (e5(t5[i6], i6))
                return t5[i6];
          };
          function k3(t5, e5, i6) {
            for (let s4 in t5)
              Object.hasOwnProperty.call(t5, s4) && e5.call(i6 || t5[s4], t5[s4], s4, t5);
          }
          function M2(t5, e5, i6) {
            function s4(e6, i7) {
              let s5 = t5.removeEventListener;
              s5 && s5.call(t5, e6, i7, false);
            }
            function o5(i7) {
              let o6, r5;
              t5.nodeName && (e5 ? (o6 = {})[e5] = true : o6 = i7, k3(o6, function(t6, e6) {
                if (i7[e6])
                  for (r5 = i7[e6].length; r5--; )
                    s4(e6, i7[e6][r5].fn);
              }));
            }
            let r4 = "function" == typeof t5 && t5.prototype || t5;
            if (Object.hasOwnProperty.call(r4, "hcEvents")) {
              let t6 = r4.hcEvents;
              if (e5) {
                let r5 = t6[e5] || [];
                i6 ? (t6[e5] = r5.filter(function(t7) {
                  return i6 !== t7.fn;
                }), s4(e5, i6)) : (o5(t6), t6[e5] = []);
              } else
                o5(t6), delete r4.hcEvents;
            }
          }
          function C3(e5, i6, o5, r4) {
            let n5;
            if (o5 = o5 || {}, s3.createEvent && (e5.dispatchEvent || e5.fireEvent && e5 !== t4))
              (n5 = s3.createEvent("Events")).initEvent(i6, true, true), o5 = m3(n5, o5), e5.dispatchEvent ? e5.dispatchEvent(o5) : e5.fireEvent(i6, o5);
            else if (e5.hcEvents) {
              o5.target || m3(o5, { preventDefault: function() {
                o5.defaultPrevented = true;
              }, target: e5, type: i6 });
              let t5 = [], s4 = e5, r5 = false;
              for (; s4.hcEvents; )
                Object.hasOwnProperty.call(s4, "hcEvents") && s4.hcEvents[i6] && (t5.length && (r5 = true), t5.unshift.apply(t5, s4.hcEvents[i6])), s4 = Object.getPrototypeOf(s4);
              r5 && t5.sort((t6, e6) => t6.order - e6.order), t5.forEach((t6) => {
                false === t6.fn.call(e5, o5) && o5.preventDefault();
              });
            }
            r4 && !o5.defaultPrevented && r4.call(e5, o5);
          }
          k3({ map: "map", each: "forEach", grep: "filter", reduce: "reduce", some: "some" }, function(e5, i6) {
            t4[i6] = function(t5) {
              return r3(32, false, void 0, { [`Highcharts.${i6}`]: `use Array.${e5}` }), Array.prototype[e5].apply(t5, [].slice.call(arguments, 1));
            };
          });
          let w3 = function() {
            let t5 = Math.random().toString(36).substring(2, 9) + "-", i6 = 0;
            return function() {
              return "highcharts-" + (e4 ? "" : t5) + i6++;
            };
          }();
          o4.jQuery && (o4.jQuery.fn.highcharts = function() {
            let e5 = [].slice.call(arguments);
            if (this[0])
              return e5[0] ? (new t4[a4(e5[0]) ? e5.shift() : "Chart"](this[0], e5[0], e5[1]), this) : i5[g3(this[0], "data-highcharts-chart")];
          });
          let T2 = { addEvent: function(e5, i6, s4, o5 = {}) {
            let r4 = "function" == typeof e5 && e5.prototype || e5;
            Object.hasOwnProperty.call(r4, "hcEvents") || (r4.hcEvents = {});
            let n5 = r4.hcEvents;
            t4.Point && e5 instanceof t4.Point && e5.series && e5.series.chart && (e5.series.chart.runTrackerClick = true);
            let a5 = e5.addEventListener;
            a5 && a5.call(e5, i6, s4, !!t4.supportsPassiveEvents && { passive: void 0 === o5.passive ? -1 !== i6.indexOf("touch") : o5.passive, capture: false }), n5[i6] || (n5[i6] = []);
            let h4 = { fn: s4, order: "number" == typeof o5.order ? o5.order : 1 / 0 };
            return n5[i6].push(h4), n5[i6].sort((t5, e6) => t5.order - e6.order), function() {
              M2(e5, i6, s4);
            };
          }, arrayMax: function(t5) {
            let e5 = t5.length, i6 = t5[0];
            for (; e5--; )
              t5[e5] > i6 && (i6 = t5[e5]);
            return i6;
          }, arrayMin: function(t5) {
            let e5 = t5.length, i6 = t5[0];
            for (; e5--; )
              t5[e5] < i6 && (i6 = t5[e5]);
            return i6;
          }, attr: g3, clamp: function(t5, e5, i6) {
            return t5 > e5 ? t5 < i6 ? t5 : i6 : e5;
          }, clearTimeout: function(t5) {
            u4(t5) && clearTimeout(t5);
          }, correctFloat: v3, createElement: function(t5, e5, i6, o5, r4) {
            let n5 = s3.createElement(t5);
            return e5 && m3(n5, e5), r4 && y3(n5, { padding: "0", border: "none", margin: "0" }), i6 && y3(n5, i6), o5 && o5.appendChild(n5), n5;
          }, css: y3, defined: u4, destroyObjectProperties: function(t5, e5) {
            k3(t5, function(i6, s4) {
              i6 && i6 !== e5 && i6.destroy && i6.destroy(), delete t5[s4];
            });
          }, diffObjects: function(t5, e5, i6, s4) {
            let o5 = {};
            return function t6(e6, o6, r4, n5) {
              let a5 = i6 ? o6 : e6;
              k3(e6, function(i7, d4) {
                if (!n5 && s4 && s4.indexOf(d4) > -1 && o6[d4]) {
                  i7 = f3(i7), r4[d4] = [];
                  for (let e7 = 0; e7 < Math.max(i7.length, o6[d4].length); e7++)
                    o6[d4][e7] && (void 0 === i7[e7] ? r4[d4][e7] = o6[d4][e7] : (r4[d4][e7] = {}, t6(i7[e7], o6[d4][e7], r4[d4][e7], n5 + 1)));
                } else
                  l3(i7, true) && !i7.nodeType ? (r4[d4] = h3(i7) ? [] : {}, t6(i7, o6[d4] || {}, r4[d4], n5 + 1), 0 !== Object.keys(r4[d4]).length || "colorAxis" === d4 && 0 === n5 || delete r4[d4]) : (e6[d4] !== o6[d4] || d4 in e6 && !(d4 in o6)) && (r4[d4] = a5[d4]);
              });
            }(t5, e5, o5, 0), o5;
          }, discardElement: function(t5) {
            t5 && t5.parentElement && t5.parentElement.removeChild(t5);
          }, erase: function(t5, e5) {
            let i6 = t5.length;
            for (; i6--; )
              if (t5[i6] === e5) {
                t5.splice(i6, 1);
                break;
              }
          }, error: r3, extend: m3, extendClass: function(t5, e5) {
            let i6 = function() {
            };
            return i6.prototype = new t5(), m3(i6.prototype, e5), i6;
          }, find: S3, fireEvent: C3, getClosestDistance: function(t5, e5) {
            let i6, s4, o5;
            let r4 = !e5;
            return t5.forEach((t6) => {
              if (t6.length > 1)
                for (o5 = t6.length - 1; o5 > 0; o5--)
                  (s4 = t6[o5] - t6[o5 - 1]) < 0 && !r4 ? (e5?.(), e5 = void 0) : s4 && (void 0 === i6 || s4 < i6) && (i6 = s4);
            }), i6;
          }, getMagnitude: b3, getNestedProperty: function(t5, e5) {
            let i6 = t5.split(".");
            for (; i6.length && u4(e5); ) {
              let t6 = i6.shift();
              if (void 0 === t6 || "__proto__" === t6)
                return;
              if ("this" === t6) {
                let t7;
                return l3(e5) && (t7 = e5["@this"]), t7 ?? e5;
              }
              let s4 = e5[t6];
              if (!u4(s4) || "function" == typeof s4 || "number" == typeof s4.nodeType || s4 === o4)
                return;
              e5 = s4;
            }
            return e5;
          }, getStyle: function t5(e5, i6, s4) {
            let r4;
            if ("width" === i6) {
              let i7 = Math.min(e5.offsetWidth, e5.scrollWidth), s5 = e5.getBoundingClientRect && e5.getBoundingClientRect().width;
              return s5 < i7 && s5 >= i7 - 1 && (i7 = Math.floor(s5)), Math.max(0, i7 - (t5(e5, "padding-left", true) || 0) - (t5(e5, "padding-right", true) || 0));
            }
            if ("height" === i6)
              return Math.max(0, Math.min(e5.offsetHeight, e5.scrollHeight) - (t5(e5, "padding-top", true) || 0) - (t5(e5, "padding-bottom", true) || 0));
            let a5 = o4.getComputedStyle(e5, void 0);
            return a5 && (r4 = a5.getPropertyValue(i6), x3(s4, "opacity" !== i6) && (r4 = n4(r4))), r4;
          }, inArray: function(t5, e5, i6) {
            return r3(32, false, void 0, { "Highcharts.inArray": "use Array.indexOf" }), e5.indexOf(t5, i6);
          }, insertItem: function(t5, e5) {
            let i6;
            let s4 = t5.options.index, o5 = e5.length;
            for (i6 = t5.options.isInternal ? o5 : 0; i6 < o5 + 1; i6++)
              if (!e5[i6] || p3(s4) && s4 < x3(e5[i6].options.index, e5[i6]._i) || e5[i6].options.isInternal) {
                e5.splice(i6, 0, t5);
                break;
              }
            return i6;
          }, isArray: h3, isClass: c3, isDOMElement: d3, isFunction: function(t5) {
            return "function" == typeof t5;
          }, isNumber: p3, isObject: l3, isString: a4, keys: function(t5) {
            return r3(32, false, void 0, { "Highcharts.keys": "use Object.keys" }), Object.keys(t5);
          }, merge: function() {
            let t5, e5 = arguments, i6 = {}, s4 = function(t6, e6) {
              return "object" != typeof t6 && (t6 = {}), k3(e6, function(i7, o6) {
                "__proto__" !== o6 && "constructor" !== o6 && (!l3(i7, true) || c3(i7) || d3(i7) ? t6[o6] = e6[o6] : t6[o6] = s4(t6[o6] || {}, i7));
              }), t6;
            };
            true === e5[0] && (i6 = e5[1], e5 = Array.prototype.slice.call(e5, 2));
            let o5 = e5.length;
            for (t5 = 0; t5 < o5; t5++)
              i6 = s4(i6, e5[t5]);
            return i6;
          }, normalizeTickInterval: function(t5, e5, i6, s4, o5) {
            let r4, n5 = t5;
            i6 = x3(i6, b3(t5));
            let a5 = t5 / i6;
            for (!e5 && (e5 = o5 ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], false === s4 && (1 === i6 ? e5 = e5.filter(function(t6) {
              return t6 % 1 == 0;
            }) : i6 <= 0.1 && (e5 = [1 / i6]))), r4 = 0; r4 < e5.length && (n5 = e5[r4], (!o5 || !(n5 * i6 >= t5)) && (o5 || !(a5 <= (e5[r4] + (e5[r4 + 1] || e5[r4])) / 2))); r4++)
              ;
            return v3(n5 * i6, -Math.round(Math.log(1e-3) / Math.LN10));
          }, objectEach: k3, offset: function(t5) {
            let e5 = s3.documentElement, i6 = t5.parentElement || t5.parentNode ? t5.getBoundingClientRect() : { top: 0, left: 0, width: 0, height: 0 };
            return { top: i6.top + (o4.pageYOffset || e5.scrollTop) - (e5.clientTop || 0), left: i6.left + (o4.pageXOffset || e5.scrollLeft) - (e5.clientLeft || 0), width: i6.width, height: i6.height };
          }, pad: function(t5, e5, i6) {
            return Array((e5 || 2) + 1 - String(t5).replace("-", "").length).join(i6 || "0") + t5;
          }, pick: x3, pInt: n4, pushUnique: function(t5, e5) {
            return 0 > t5.indexOf(e5) && !!t5.push(e5);
          }, relativeLength: function(t5, e5, i6) {
            return /%$/.test(t5) ? e5 * parseFloat(t5) / 100 + (i6 || 0) : parseFloat(t5);
          }, removeEvent: M2, splat: f3, stableSort: function(t5, e5) {
            let i6, s4;
            let o5 = t5.length;
            for (s4 = 0; s4 < o5; s4++)
              t5[s4].safeI = s4;
            for (t5.sort(function(t6, s5) {
              return 0 === (i6 = e5(t6, s5)) ? t6.safeI - s5.safeI : i6;
            }), s4 = 0; s4 < o5; s4++)
              delete t5[s4].safeI;
          }, syncTimeout: function(t5, e5, i6) {
            return e5 > 0 ? setTimeout(t5, e5, i6) : (t5.call(0, i6), -1);
          }, timeUnits: { millisecond: 1, second: 1e3, minute: 6e4, hour: 36e5, day: 864e5, week: 6048e5, month: 24192e5, year: 314496e5 }, uniqueKey: w3, useSerialIds: function(t5) {
            return e4 = x3(t5, e4);
          }, wrap: function(t5, e5, i6) {
            let s4 = t5[e5];
            t5[e5] = function() {
              let t6 = arguments, e6 = this;
              return i6.apply(this, [function() {
                return s4.apply(e6, arguments.length ? arguments : t6);
              }].concat([].slice.call(arguments)));
            };
          } };
          return T2;
        }), i4(e3, "Core/Chart/ChartDefaults.js", [], function() {
          return { alignThresholds: false, panning: { enabled: false, type: "x" }, styledMode: false, borderRadius: 0, colorCount: 10, allowMutatingData: true, ignoreHiddenSeries: true, spacing: [10, 10, 15, 10], resetZoomButton: { theme: {}, position: {} }, reflow: true, type: "line", zooming: { singleTouch: false, resetButton: { theme: { zIndex: 6 }, position: { align: "right", x: -10, y: 10 } } }, width: null, height: null, borderColor: "#334eff", backgroundColor: "#ffffff", plotBorderColor: "#cccccc" };
        }), i4(e3, "Core/Color/Palettes.js", [], function() {
          return { colors: ["#2caffe", "#544fc5", "#00e272", "#fe6a35", "#6b8abc", "#d568fb", "#2ee0ca", "#fa4b42", "#feb56a", "#91e8e1"] };
        }), i4(e3, "Core/Time.js", [e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          let { win: i5 } = t4, { defined: s3, error: o4, extend: r3, isNumber: n4, isObject: a4, merge: h3, objectEach: l3, pad: d3, pick: c3, splat: p3, timeUnits: u4 } = e4, g3 = t4.isSafari && i5.Intl && i5.Intl.DateTimeFormat.prototype.formatRange, f3 = t4.isSafari && i5.Intl && !i5.Intl.DateTimeFormat.prototype.formatRange;
          return class {
            constructor(t5) {
              this.options = {}, this.useUTC = false, this.variableTimezone = false, this.Date = i5.Date, this.getTimezoneOffset = this.timezoneOffsetFunction(), this.update(t5);
            }
            get(t5, e5) {
              if (this.variableTimezone || this.timezoneOffset) {
                let i6 = e5.getTime(), s4 = i6 - this.getTimezoneOffset(e5);
                e5.setTime(s4);
                let o5 = e5["getUTC" + t5]();
                return e5.setTime(i6), o5;
              }
              return this.useUTC ? e5["getUTC" + t5]() : e5["get" + t5]();
            }
            set(t5, e5, i6) {
              if (this.variableTimezone || this.timezoneOffset) {
                if ("Milliseconds" === t5 || "Seconds" === t5 || "Minutes" === t5 && this.getTimezoneOffset(e5) % 36e5 == 0)
                  return e5["setUTC" + t5](i6);
                let s4 = this.getTimezoneOffset(e5), o5 = e5.getTime() - s4;
                e5.setTime(o5), e5["setUTC" + t5](i6);
                let r4 = this.getTimezoneOffset(e5);
                return o5 = e5.getTime() + r4, e5.setTime(o5);
              }
              return this.useUTC || g3 && "FullYear" === t5 ? e5["setUTC" + t5](i6) : e5["set" + t5](i6);
            }
            update(t5 = {}) {
              let e5 = c3(t5.useUTC, true);
              this.options = t5 = h3(true, this.options, t5), this.Date = t5.Date || i5.Date || Date, this.useUTC = e5, this.timezoneOffset = e5 && t5.timezoneOffset || void 0, this.getTimezoneOffset = this.timezoneOffsetFunction(), this.variableTimezone = e5 && !!(t5.getTimezoneOffset || t5.timezone);
            }
            makeTime(t5, e5, i6, s4, o5, r4) {
              let n5, a5, h4;
              return this.useUTC ? (n5 = this.Date.UTC.apply(0, arguments), a5 = this.getTimezoneOffset(n5), n5 += a5, a5 !== (h4 = this.getTimezoneOffset(n5)) ? n5 += h4 - a5 : a5 - 36e5 !== this.getTimezoneOffset(n5 - 36e5) || f3 || (n5 -= 36e5)) : n5 = new this.Date(t5, e5, c3(i6, 1), c3(s4, 0), c3(o5, 0), c3(r4, 0)).getTime(), n5;
            }
            timezoneOffsetFunction() {
              let t5 = this, e5 = this.options, i6 = e5.getTimezoneOffset;
              return this.useUTC ? e5.timezone ? (t6) => {
                try {
                  let [i7, s4, o5, r4, a5 = 0] = Intl.DateTimeFormat("en", { timeZone: e5.timezone, timeZoneName: "shortOffset" }).format(t6).split(/(GMT|:)/).map(Number), h4 = -(36e5 * (o5 + a5 / 60));
                  if (n4(h4))
                    return h4;
                } catch (t7) {
                  o4(34);
                }
                return 0;
              } : this.useUTC && i6 ? (t6) => 6e4 * i6(t6.valueOf()) : () => 6e4 * (t5.timezoneOffset || 0) : (t6) => 6e4 * new Date(t6.toString()).getTimezoneOffset();
            }
            dateFormat(e5, i6, o5) {
              if (!s3(i6) || isNaN(i6))
                return t4.defaultOptions.lang && t4.defaultOptions.lang.invalidDate || "";
              e5 = c3(e5, "%Y-%m-%d %H:%M:%S");
              let n5 = this, a5 = new this.Date(i6), h4 = this.get("Hours", a5), p4 = this.get("Day", a5), u5 = this.get("Date", a5), g4 = this.get("Month", a5), f4 = this.get("FullYear", a5), m3 = t4.defaultOptions.lang, x3 = m3 && m3.weekdays, y3 = m3 && m3.shortWeekdays, b3 = r3({ a: y3 ? y3[p4] : x3[p4].substr(0, 3), A: x3[p4], d: d3(u5), e: d3(u5, 2, " "), w: p4, b: m3.shortMonths[g4], B: m3.months[g4], m: d3(g4 + 1), o: g4 + 1, y: f4.toString().substr(2, 2), Y: f4, H: d3(h4), k: h4, I: d3(h4 % 12 || 12), l: h4 % 12 || 12, M: d3(this.get("Minutes", a5)), p: h4 < 12 ? "AM" : "PM", P: h4 < 12 ? "am" : "pm", S: d3(this.get("Seconds", a5)), L: d3(Math.floor(i6 % 1e3), 3) }, t4.dateFormats);
              return l3(b3, function(t5, s4) {
                for (; -1 !== e5.indexOf("%" + s4); )
                  e5 = e5.replace("%" + s4, "function" == typeof t5 ? t5.call(n5, i6) : t5);
              }), o5 ? e5.substr(0, 1).toUpperCase() + e5.substr(1) : e5;
            }
            resolveDTLFormat(t5) {
              return a4(t5, true) ? t5 : { main: (t5 = p3(t5))[0], from: t5[1], to: t5[2] };
            }
            getTimeTicks(t5, e5, i6, o5) {
              let n5, a5, h4, l4;
              let d4 = this, p4 = d4.Date, g4 = [], f4 = {}, m3 = new p4(e5), x3 = t5.unitRange, y3 = t5.count || 1;
              if (o5 = c3(o5, 1), s3(e5)) {
                d4.set("Milliseconds", m3, x3 >= u4.second ? 0 : y3 * Math.floor(d4.get("Milliseconds", m3) / y3)), x3 >= u4.second && d4.set("Seconds", m3, x3 >= u4.minute ? 0 : y3 * Math.floor(d4.get("Seconds", m3) / y3)), x3 >= u4.minute && d4.set("Minutes", m3, x3 >= u4.hour ? 0 : y3 * Math.floor(d4.get("Minutes", m3) / y3)), x3 >= u4.hour && d4.set("Hours", m3, x3 >= u4.day ? 0 : y3 * Math.floor(d4.get("Hours", m3) / y3)), x3 >= u4.day && d4.set("Date", m3, x3 >= u4.month ? 1 : Math.max(1, y3 * Math.floor(d4.get("Date", m3) / y3))), x3 >= u4.month && (d4.set("Month", m3, x3 >= u4.year ? 0 : y3 * Math.floor(d4.get("Month", m3) / y3)), a5 = d4.get("FullYear", m3)), x3 >= u4.year && (a5 -= a5 % y3, d4.set("FullYear", m3, a5)), x3 === u4.week && (l4 = d4.get("Day", m3), d4.set("Date", m3, d4.get("Date", m3) - l4 + o5 + (l4 < o5 ? -7 : 0))), a5 = d4.get("FullYear", m3);
                let t6 = d4.get("Month", m3), r4 = d4.get("Date", m3), c4 = d4.get("Hours", m3);
                e5 = m3.getTime(), (d4.variableTimezone || !d4.useUTC) && s3(i6) && (h4 = i6 - e5 > 4 * u4.month || d4.getTimezoneOffset(e5) !== d4.getTimezoneOffset(i6));
                let p5 = m3.getTime();
                for (n5 = 1; p5 < i6; )
                  g4.push(p5), x3 === u4.year ? p5 = d4.makeTime(a5 + n5 * y3, 0) : x3 === u4.month ? p5 = d4.makeTime(a5, t6 + n5 * y3) : h4 && (x3 === u4.day || x3 === u4.week) ? p5 = d4.makeTime(a5, t6, r4 + n5 * y3 * (x3 === u4.day ? 1 : 7)) : h4 && x3 === u4.hour && y3 > 1 ? p5 = d4.makeTime(a5, t6, r4, c4 + n5 * y3) : p5 += x3 * y3, n5++;
                g4.push(p5), x3 <= u4.hour && g4.length < 1e4 && g4.forEach(function(t7) {
                  t7 % 18e5 == 0 && "000000000" === d4.dateFormat("%H%M%S%L", t7) && (f4[t7] = "day");
                });
              }
              return g4.info = r3(t5, { higherRanks: f4, totalRange: x3 * y3 }), g4;
            }
            getDateFormat(t5, e5, i6, s4) {
              let o5 = this.dateFormat("%m-%d %H:%M:%S.%L", e5), r4 = "01-01 00:00:00.000", n5 = { millisecond: 15, second: 12, minute: 9, hour: 6, day: 3 }, a5 = "millisecond", h4 = a5;
              for (a5 in u4) {
                if (t5 === u4.week && +this.dateFormat("%w", e5) === i6 && o5.substr(6) === r4.substr(6)) {
                  a5 = "week";
                  break;
                }
                if (u4[a5] > t5) {
                  a5 = h4;
                  break;
                }
                if (n5[a5] && o5.substr(n5[a5]) !== r4.substr(n5[a5]))
                  break;
                "week" !== a5 && (h4 = a5);
              }
              return this.resolveDTLFormat(s4[a5]).main;
            }
          };
        }), i4(e3, "Core/Defaults.js", [e3["Core/Chart/ChartDefaults.js"], e3["Core/Globals.js"], e3["Core/Color/Palettes.js"], e3["Core/Time.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3, o4) {
          let { isTouchDevice: r3, svg: n4 } = e4, { merge: a4 } = o4, h3 = { colors: i5.colors, symbols: ["circle", "diamond", "square", "triangle", "triangle-down"], lang: { loading: "Loading...", months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], decimalPoint: ".", numericSymbols: ["k", "M", "G", "T", "P", "E"], resetZoom: "Reset zoom", resetZoomTitle: "Reset zoom level 1:1", thousandsSep: " " }, global: {}, time: { Date: void 0, getTimezoneOffset: void 0, timezone: void 0, timezoneOffset: 0, useUTC: true }, chart: t4, title: { style: { color: "#333333", fontWeight: "bold" }, text: "Chart title", align: "center", margin: 15, widthAdjust: -44 }, subtitle: { style: { color: "#666666", fontSize: "0.8em" }, text: "", align: "center", widthAdjust: -44 }, caption: { margin: 15, style: { color: "#666666", fontSize: "0.8em" }, text: "", align: "left", verticalAlign: "bottom" }, plotOptions: {}, legend: { enabled: true, align: "center", alignColumns: true, className: "highcharts-no-tooltip", layout: "horizontal", itemMarginBottom: 2, itemMarginTop: 2, labelFormatter: function() {
            return this.name;
          }, borderColor: "#999999", borderRadius: 0, navigation: { style: { fontSize: "0.8em" }, activeColor: "#0022ff", inactiveColor: "#cccccc" }, itemStyle: { color: "#333333", cursor: "pointer", fontSize: "0.8em", textDecoration: "none", textOverflow: "ellipsis" }, itemHoverStyle: { color: "#000000" }, itemHiddenStyle: { color: "#666666", textDecoration: "line-through" }, shadow: false, itemCheckboxStyle: { position: "absolute", width: "13px", height: "13px" }, squareSymbol: true, symbolPadding: 5, verticalAlign: "bottom", x: 0, y: 0, title: { style: { fontSize: "0.8em", fontWeight: "bold" } } }, loading: { labelStyle: { fontWeight: "bold", position: "relative", top: "45%" }, style: { position: "absolute", backgroundColor: "#ffffff", opacity: 0.5, textAlign: "center" } }, tooltip: { enabled: true, animation: n4, borderRadius: 3, dateTimeLabelFormats: { millisecond: "%A, %e %b, %H:%M:%S.%L", second: "%A, %e %b, %H:%M:%S", minute: "%A, %e %b, %H:%M", hour: "%A, %e %b, %H:%M", day: "%A, %e %b %Y", week: "Week from %A, %e %b %Y", month: "%B %Y", year: "%Y" }, footerFormat: "", headerShape: "callout", hideDelay: 500, padding: 8, shape: "callout", shared: false, snap: r3 ? 25 : 10, headerFormat: '<span style="font-size: 0.8em">{point.key}</span><br/>', pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>', backgroundColor: "#ffffff", borderWidth: void 0, shadow: true, stickOnContact: false, style: { color: "#333333", cursor: "default", fontSize: "0.8em" }, useHTML: false }, credits: { enabled: true, href: "https://www.highcharts.com?credits", position: { align: "right", x: -10, verticalAlign: "bottom", y: -5 }, style: { cursor: "pointer", color: "#999999", fontSize: "0.6em" }, text: "Highcharts.com" } };
          h3.chart.styledMode = false;
          let l3 = new s3(h3.time);
          return { defaultOptions: h3, defaultTime: l3, getOptions: function() {
            return h3;
          }, setOptions: function(t5) {
            return a4(true, h3, t5), (t5.time || t5.global) && (e4.time ? e4.time.update(a4(h3.global, h3.time, t5.global, t5.time)) : e4.time = l3), h3;
          } };
        }), i4(e3, "Core/Color/Color.js", [e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          let { isNumber: i5, merge: s3, pInt: o4 } = e4;
          class r3 {
            static parse(t5) {
              return t5 ? new r3(t5) : r3.None;
            }
            constructor(e5) {
              let i6, s4, o5, n4;
              this.rgba = [NaN, NaN, NaN, NaN], this.input = e5;
              let a4 = t4.Color;
              if (a4 && a4 !== r3)
                return new a4(e5);
              if ("object" == typeof e5 && void 0 !== e5.stops)
                this.stops = e5.stops.map((t5) => new r3(t5[1]));
              else if ("string" == typeof e5) {
                if (this.input = e5 = r3.names[e5.toLowerCase()] || e5, "#" === e5.charAt(0)) {
                  let t5 = e5.length, i7 = parseInt(e5.substr(1), 16);
                  7 === t5 ? s4 = [(16711680 & i7) >> 16, (65280 & i7) >> 8, 255 & i7, 1] : 4 === t5 && (s4 = [(3840 & i7) >> 4 | (3840 & i7) >> 8, (240 & i7) >> 4 | 240 & i7, (15 & i7) << 4 | 15 & i7, 1]);
                }
                if (!s4)
                  for (o5 = r3.parsers.length; o5-- && !s4; )
                    (i6 = (n4 = r3.parsers[o5]).regex.exec(e5)) && (s4 = n4.parse(i6));
              }
              s4 && (this.rgba = s4);
            }
            get(t5) {
              let e5 = this.input, o5 = this.rgba;
              if ("object" == typeof e5 && void 0 !== this.stops) {
                let i6 = s3(e5);
                return i6.stops = [].slice.call(i6.stops), this.stops.forEach((e6, s4) => {
                  i6.stops[s4] = [i6.stops[s4][0], e6.get(t5)];
                }), i6;
              }
              return o5 && i5(o5[0]) ? "rgb" !== t5 && (t5 || 1 !== o5[3]) ? "a" === t5 ? `${o5[3]}` : "rgba(" + o5.join(",") + ")" : "rgb(" + o5[0] + "," + o5[1] + "," + o5[2] + ")" : e5;
            }
            brighten(t5) {
              let e5 = this.rgba;
              if (this.stops)
                this.stops.forEach(function(e6) {
                  e6.brighten(t5);
                });
              else if (i5(t5) && 0 !== t5)
                for (let i6 = 0; i6 < 3; i6++)
                  e5[i6] += o4(255 * t5), e5[i6] < 0 && (e5[i6] = 0), e5[i6] > 255 && (e5[i6] = 255);
              return this;
            }
            setOpacity(t5) {
              return this.rgba[3] = t5, this;
            }
            tweenTo(t5, e5) {
              let s4 = this.rgba, o5 = t5.rgba;
              if (!i5(s4[0]) || !i5(o5[0]))
                return t5.input || "none";
              let r4 = 1 !== o5[3] || 1 !== s4[3];
              return (r4 ? "rgba(" : "rgb(") + Math.round(o5[0] + (s4[0] - o5[0]) * (1 - e5)) + "," + Math.round(o5[1] + (s4[1] - o5[1]) * (1 - e5)) + "," + Math.round(o5[2] + (s4[2] - o5[2]) * (1 - e5)) + (r4 ? "," + (o5[3] + (s4[3] - o5[3]) * (1 - e5)) : "") + ")";
            }
          }
          return r3.names = { white: "#ffffff", black: "#000000" }, r3.parsers = [{ regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/, parse: function(t5) {
            return [o4(t5[1]), o4(t5[2]), o4(t5[3]), parseFloat(t5[4], 10)];
          } }, { regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/, parse: function(t5) {
            return [o4(t5[1]), o4(t5[2]), o4(t5[3]), 1];
          } }], r3.None = new r3(""), r3;
        }), i4(e3, "Core/Animation/Fx.js", [e3["Core/Color/Color.js"], e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          let { parse: s3 } = t4, { win: o4 } = e4, { isNumber: r3, objectEach: n4 } = i5;
          class a4 {
            constructor(t5, e5, i6) {
              this.pos = NaN, this.options = e5, this.elem = t5, this.prop = i6;
            }
            dSetter() {
              let t5 = this.paths, e5 = t5 && t5[0], i6 = t5 && t5[1], s4 = this.now || 0, o5 = [];
              if (1 !== s4 && e5 && i6) {
                if (e5.length === i6.length && s4 < 1)
                  for (let t6 = 0; t6 < i6.length; t6++) {
                    let n5 = e5[t6], a5 = i6[t6], h3 = [];
                    for (let t7 = 0; t7 < a5.length; t7++) {
                      let e6 = n5[t7], i7 = a5[t7];
                      r3(e6) && r3(i7) && !("A" === a5[0] && (4 === t7 || 5 === t7)) ? h3[t7] = e6 + s4 * (i7 - e6) : h3[t7] = i7;
                    }
                    o5.push(h3);
                  }
                else
                  o5 = i6;
              } else
                o5 = this.toD || [];
              this.elem.attr("d", o5, void 0, true);
            }
            update() {
              let t5 = this.elem, e5 = this.prop, i6 = this.now, s4 = this.options.step;
              this[e5 + "Setter"] ? this[e5 + "Setter"]() : t5.attr ? t5.element && t5.attr(e5, i6, null, true) : t5.style[e5] = i6 + this.unit, s4 && s4.call(t5, i6, this);
            }
            run(t5, e5, i6) {
              let s4 = this, r4 = s4.options, n5 = function(t6) {
                return !n5.stopped && s4.step(t6);
              }, h3 = o4.requestAnimationFrame || function(t6) {
                setTimeout(t6, 13);
              }, l3 = function() {
                for (let t6 = 0; t6 < a4.timers.length; t6++)
                  a4.timers[t6]() || a4.timers.splice(t6--, 1);
                a4.timers.length && h3(l3);
              };
              t5 !== e5 || this.elem["forceAnimate:" + this.prop] ? (this.startTime = +/* @__PURE__ */ new Date(), this.start = t5, this.end = e5, this.unit = i6, this.now = this.start, this.pos = 0, n5.elem = this.elem, n5.prop = this.prop, n5() && 1 === a4.timers.push(n5) && h3(l3)) : (delete r4.curAnim[this.prop], r4.complete && 0 === Object.keys(r4.curAnim).length && r4.complete.call(this.elem));
            }
            step(t5) {
              let e5, i6;
              let s4 = +/* @__PURE__ */ new Date(), o5 = this.options, r4 = this.elem, a5 = o5.complete, h3 = o5.duration, l3 = o5.curAnim;
              return r4.attr && !r4.element ? e5 = false : t5 || s4 >= h3 + this.startTime ? (this.now = this.end, this.pos = 1, this.update(), l3[this.prop] = true, i6 = true, n4(l3, function(t6) {
                true !== t6 && (i6 = false);
              }), i6 && a5 && a5.call(r4), e5 = false) : (this.pos = o5.easing((s4 - this.startTime) / h3), this.now = this.start + (this.end - this.start) * this.pos, this.update(), e5 = true), e5;
            }
            initPath(t5, e5, i6) {
              let s4 = t5.startX, o5 = t5.endX, n5 = i6.slice(), a5 = t5.isArea, h3 = a5 ? 2 : 1, l3, d3, c3, p3, u4 = e5 && e5.slice();
              if (!u4)
                return [n5, n5];
              function g3(t6, e6) {
                for (; t6.length < d3; ) {
                  let i7 = t6[0], s5 = e6[d3 - t6.length];
                  if (s5 && "M" === i7[0] && ("C" === s5[0] ? t6[0] = ["C", i7[1], i7[2], i7[1], i7[2], i7[1], i7[2]] : t6[0] = ["L", i7[1], i7[2]]), t6.unshift(i7), a5) {
                    let e7 = t6.pop();
                    t6.push(t6[t6.length - 1], e7);
                  }
                }
              }
              function f3(t6, e6) {
                for (; t6.length < d3; ) {
                  let e7 = t6[Math.floor(t6.length / h3) - 1].slice();
                  if ("C" === e7[0] && (e7[1] = e7[5], e7[2] = e7[6]), a5) {
                    let i7 = t6[Math.floor(t6.length / h3)].slice();
                    t6.splice(t6.length / 2, 0, e7, i7);
                  } else
                    t6.push(e7);
                }
              }
              if (s4 && o5 && o5.length) {
                for (c3 = 0; c3 < s4.length; c3++) {
                  if (s4[c3] === o5[0]) {
                    l3 = c3;
                    break;
                  }
                  if (s4[0] === o5[o5.length - s4.length + c3]) {
                    l3 = c3, p3 = true;
                    break;
                  }
                  if (s4[s4.length - 1] === o5[o5.length - s4.length + c3]) {
                    l3 = s4.length - c3;
                    break;
                  }
                }
                void 0 === l3 && (u4 = []);
              }
              return u4.length && r3(l3) && (d3 = n5.length + l3 * h3, p3 ? (g3(u4, n5), f3(n5, u4)) : (g3(n5, u4), f3(u4, n5))), [u4, n5];
            }
            fillSetter() {
              a4.prototype.strokeSetter.apply(this, arguments);
            }
            strokeSetter() {
              this.elem.attr(this.prop, s3(this.start).tweenTo(s3(this.end), this.pos), void 0, true);
            }
          }
          return a4.timers = [], a4;
        }), i4(e3, "Core/Animation/AnimationUtilities.js", [e3["Core/Animation/Fx.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          let { defined: i5, getStyle: s3, isArray: o4, isNumber: r3, isObject: n4, merge: a4, objectEach: h3, pick: l3 } = e4;
          function d3(t5) {
            return n4(t5) ? a4({ duration: 500, defer: 0 }, t5) : { duration: t5 ? 500 : 0, defer: 0 };
          }
          function c3(e5, i6) {
            let s4 = t4.timers.length;
            for (; s4--; )
              t4.timers[s4].elem !== e5 || i6 && i6 !== t4.timers[s4].prop || (t4.timers[s4].stopped = true);
          }
          return { animate: function(e5, i6, l4) {
            let d4, p3 = "", u4, g3, f3;
            n4(l4) || (f3 = arguments, l4 = { duration: f3[2], easing: f3[3], complete: f3[4] }), r3(l4.duration) || (l4.duration = 400), l4.easing = "function" == typeof l4.easing ? l4.easing : Math[l4.easing] || Math.easeInOutSine, l4.curAnim = a4(i6), h3(i6, function(r4, n5) {
              c3(e5, n5), g3 = new t4(e5, l4, n5), u4 = void 0, "d" === n5 && o4(i6.d) ? (g3.paths = g3.initPath(e5, e5.pathArray, i6.d), g3.toD = i6.d, d4 = 0, u4 = 1) : e5.attr ? d4 = e5.attr(n5) : (d4 = parseFloat(s3(e5, n5)) || 0, "opacity" !== n5 && (p3 = "px")), u4 || (u4 = r4), "string" == typeof u4 && u4.match("px") && (u4 = u4.replace(/px/g, "")), g3.run(d4, u4, p3);
            });
          }, animObject: d3, getDeferredAnimation: function(t5, e5, s4) {
            let o5 = d3(e5), r4 = s4 ? [s4] : t5.series, a5 = 0, h4 = 0;
            r4.forEach((t6) => {
              let s5 = d3(t6.options.animation);
              a5 = n4(e5) && i5(e5.defer) ? o5.defer : Math.max(a5, s5.duration + s5.defer), h4 = Math.min(o5.duration, s5.duration);
            }), t5.renderer.forExport && (a5 = 0);
            let l4 = { defer: Math.max(0, a5 - h4), duration: Math.min(a5, h4) };
            return l4;
          }, setAnimation: function(t5, e5) {
            e5.renderer.globalAnimation = l3(t5, e5.options.chart.animation, true);
          }, stop: c3 };
        }), i4(e3, "Core/Renderer/HTML/AST.js", [e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          let { SVG_NS: i5, win: s3 } = t4, { attr: o4, createElement: r3, css: n4, error: a4, isFunction: h3, isString: l3, objectEach: d3, splat: c3 } = e4, { trustedTypes: p3 } = s3, u4 = p3 && h3(p3.createPolicy) && p3.createPolicy("highcharts", { createHTML: (t5) => t5 }), g3 = u4 ? u4.createHTML("") : "", f3 = function() {
            try {
              return !!new DOMParser().parseFromString(g3, "text/html");
            } catch (t5) {
              return false;
            }
          }();
          class m3 {
            static filterUserAttributes(t5) {
              return d3(t5, (e5, i6) => {
                let s4 = true;
                -1 === m3.allowedAttributes.indexOf(i6) && (s4 = false), -1 !== ["background", "dynsrc", "href", "lowsrc", "src"].indexOf(i6) && (s4 = l3(e5) && m3.allowedReferences.some((t6) => 0 === e5.indexOf(t6))), s4 || (a4(33, false, void 0, { "Invalid attribute in config": `${i6}` }), delete t5[i6]), l3(e5) && t5[i6] && (t5[i6] = e5.replace(/</g, "&lt;"));
              }), t5;
            }
            static parseStyle(t5) {
              return t5.split(";").reduce((t6, e5) => {
                let i6 = e5.split(":").map((t7) => t7.trim()), s4 = i6.shift();
                return s4 && i6.length && (t6[s4.replace(/-([a-z])/g, (t7) => t7[1].toUpperCase())] = i6.join(":")), t6;
              }, {});
            }
            static setElementHTML(t5, e5) {
              if (t5.innerHTML = m3.emptyHTML, e5) {
                let i6 = new m3(e5);
                i6.addToDOM(t5);
              }
            }
            constructor(t5) {
              this.nodes = "string" == typeof t5 ? this.parseMarkup(t5) : t5;
            }
            addToDOM(e5) {
              return function e6(s4, r4) {
                let h4;
                return c3(s4).forEach(function(s5) {
                  let l4;
                  let c4 = s5.tagName, p4 = s5.textContent ? t4.doc.createTextNode(s5.textContent) : void 0, u5 = m3.bypassHTMLFiltering;
                  if (c4) {
                    if ("#text" === c4)
                      l4 = p4;
                    else if (-1 !== m3.allowedTags.indexOf(c4) || u5) {
                      let a5 = "svg" === c4 ? i5 : r4.namespaceURI || i5, h5 = t4.doc.createElementNS(a5, c4), g4 = s5.attributes || {};
                      d3(s5, function(t5, e7) {
                        "tagName" !== e7 && "attributes" !== e7 && "children" !== e7 && "style" !== e7 && "textContent" !== e7 && (g4[e7] = t5);
                      }), o4(h5, u5 ? g4 : m3.filterUserAttributes(g4)), s5.style && n4(h5, s5.style), p4 && h5.appendChild(p4), e6(s5.children || [], h5), l4 = h5;
                    } else
                      a4(33, false, void 0, { "Invalid tagName in config": c4 });
                  }
                  l4 && r4.appendChild(l4), h4 = l4;
                }), h4;
              }(this.nodes, e5);
            }
            parseMarkup(t5) {
              let e5;
              let i6 = [];
              if (t5 = t5.trim().replace(/ style=(["'])/g, " data-style=$1"), f3)
                e5 = new DOMParser().parseFromString(u4 ? u4.createHTML(t5) : t5, "text/html");
              else {
                let i7 = r3("div");
                i7.innerHTML = t5, e5 = { body: i7 };
              }
              let s4 = (t6, e6) => {
                let i7 = t6.nodeName.toLowerCase(), o5 = { tagName: i7 };
                "#text" === i7 && (o5.textContent = t6.textContent || "");
                let r4 = t6.attributes;
                if (r4) {
                  let t7 = {};
                  [].forEach.call(r4, (e7) => {
                    "data-style" === e7.name ? o5.style = m3.parseStyle(e7.value) : t7[e7.name] = e7.value;
                  }), o5.attributes = t7;
                }
                if (t6.childNodes.length) {
                  let e7 = [];
                  [].forEach.call(t6.childNodes, (t7) => {
                    s4(t7, e7);
                  }), e7.length && (o5.children = e7);
                }
                e6.push(o5);
              };
              return [].forEach.call(e5.body.childNodes, (t6) => s4(t6, i6)), i6;
            }
          }
          return m3.allowedAttributes = ["alt", "aria-controls", "aria-describedby", "aria-expanded", "aria-haspopup", "aria-hidden", "aria-label", "aria-labelledby", "aria-live", "aria-pressed", "aria-readonly", "aria-roledescription", "aria-selected", "class", "clip-path", "color", "colspan", "cx", "cy", "d", "dx", "dy", "disabled", "fill", "filterUnits", "flood-color", "flood-opacity", "height", "href", "id", "in", "markerHeight", "markerWidth", "offset", "opacity", "orient", "padding", "paddingLeft", "paddingRight", "patternUnits", "r", "refX", "refY", "role", "scope", "slope", "src", "startOffset", "stdDeviation", "stroke", "stroke-linecap", "stroke-width", "style", "tableValues", "result", "rowspan", "summary", "target", "tabindex", "text-align", "text-anchor", "textAnchor", "textLength", "title", "type", "valign", "width", "x", "x1", "x2", "xlink:href", "y", "y1", "y2", "zIndex"], m3.allowedReferences = ["https://", "http://", "mailto:", "/", "../", "./", "#"], m3.allowedTags = ["a", "abbr", "b", "br", "button", "caption", "circle", "clipPath", "code", "dd", "defs", "div", "dl", "dt", "em", "feComponentTransfer", "feDropShadow", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feOffset", "feMerge", "feMergeNode", "filter", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "li", "linearGradient", "marker", "ol", "p", "path", "pattern", "pre", "rect", "small", "span", "stop", "strong", "style", "sub", "sup", "svg", "table", "text", "textPath", "thead", "title", "tbody", "tspan", "td", "th", "tr", "u", "ul", "#text"], m3.emptyHTML = g3, m3.bypassHTMLFiltering = false, m3;
        }), i4(e3, "Core/Templating.js", [e3["Core/Defaults.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          let { defaultOptions: i5, defaultTime: s3 } = t4, { extend: o4, getNestedProperty: r3, isArray: n4, isNumber: a4, isObject: h3, isString: l3, pick: d3, pInt: c3 } = e4, p3 = { add: (t5, e5) => t5 + e5, divide: (t5, e5) => 0 !== e5 ? t5 / e5 : "", eq: (t5, e5) => t5 == e5, each: function(t5) {
            let e5 = arguments[arguments.length - 1];
            return !!n4(t5) && t5.map((i6, s4) => u4(e5.body, o4(h3(i6) ? i6 : { "@this": i6 }, { "@index": s4, "@first": 0 === s4, "@last": s4 === t5.length - 1 }))).join("");
          }, ge: (t5, e5) => t5 >= e5, gt: (t5, e5) => t5 > e5, if: (t5) => !!t5, le: (t5, e5) => t5 <= e5, lt: (t5, e5) => t5 < e5, multiply: (t5, e5) => t5 * e5, ne: (t5, e5) => t5 != e5, subtract: (t5, e5) => t5 - e5, unless: (t5) => !t5 };
          function u4(t5 = "", e5, o5) {
            let n5 = /\{([a-zA-Z0-9\:\.\,;\-\/<>%_@"'= #\(\)]+)\}/g, a5 = /\(([a-zA-Z0-9\:\.\,;\-\/<>%_@"'= ]+)\)/g, h4 = [], l4 = /f$/, c4 = /\.([0-9])/, f3 = i5.lang, m3 = o5 && o5.time || s3, x3 = o5 && o5.numberFormatter || g3, y3 = (t6 = "") => {
              let i6;
              return "true" === t6 || "false" !== t6 && ((i6 = Number(t6)).toString() === t6 ? i6 : r3(t6, e5));
            }, b3, v3, S3 = 0, k3;
            for (; null !== (b3 = n5.exec(t5)); ) {
              let i6 = a5.exec(b3[1]);
              i6 && (b3 = i6, k3 = true), v3 && v3.isBlock || (v3 = { ctx: e5, expression: b3[1], find: b3[0], isBlock: "#" === b3[1].charAt(0), start: b3.index, startInner: b3.index + b3[0].length, length: b3[0].length });
              let s4 = b3[1].split(" ")[0].replace("#", "");
              p3[s4] && (v3.isBlock && s4 === v3.fn && S3++, v3.fn || (v3.fn = s4));
              let o6 = "else" === b3[1];
              if (v3.isBlock && v3.fn && (b3[1] === `/${v3.fn}` || o6)) {
                if (S3)
                  !o6 && S3--;
                else {
                  let e6 = v3.startInner, i7 = t5.substr(e6, b3.index - e6);
                  void 0 === v3.body ? (v3.body = i7, v3.startInner = b3.index + b3[0].length) : v3.elseBody = i7, v3.find += i7 + b3[0], o6 || (h4.push(v3), v3 = void 0);
                }
              } else
                v3.isBlock || h4.push(v3);
              if (i6 && !v3?.isBlock)
                break;
            }
            return h4.forEach((i6) => {
              let s4, o6;
              let { body: r4, elseBody: n6, expression: a6, fn: h5 } = i6;
              if (h5) {
                let t6 = [i6], l5 = a6.split(" ");
                for (o6 = p3[h5].length; o6--; )
                  t6.unshift(y3(l5[o6 + 1]));
                s4 = p3[h5].apply(e5, t6), i6.isBlock && "boolean" == typeof s4 && (s4 = u4(s4 ? r4 : n6, e5));
              } else {
                let t6 = a6.split(":");
                if (s4 = y3(t6.shift() || ""), t6.length && "number" == typeof s4) {
                  let e6 = t6.join(":");
                  if (l4.test(e6)) {
                    let t7 = parseInt((e6.match(c4) || ["", "-1"])[1], 10);
                    null !== s4 && (s4 = x3(s4, t7, f3.decimalPoint, e6.indexOf(",") > -1 ? f3.thousandsSep : ""));
                  } else
                    s4 = m3.dateFormat(e6, s4);
                }
              }
              t5 = t5.replace(i6.find, d3(s4, ""));
            }), k3 ? u4(t5, e5, o5) : t5;
          }
          function g3(t5, e5, s4, o5) {
            let r4, n5;
            t5 = +t5 || 0, e5 = +e5;
            let h4 = i5.lang, l4 = (t5.toString().split(".")[1] || "").split("e")[0].length, p4 = t5.toString().split("e"), u5 = e5;
            -1 === e5 ? e5 = Math.min(l4, 20) : a4(e5) ? e5 && p4[1] && p4[1] < 0 && ((n5 = e5 + +p4[1]) >= 0 ? (p4[0] = (+p4[0]).toExponential(n5).split("e")[0], e5 = n5) : (p4[0] = p4[0].split(".")[0] || 0, t5 = e5 < 20 ? (p4[0] * Math.pow(10, p4[1])).toFixed(e5) : 0, p4[1] = 0)) : e5 = 2;
            let g4 = (Math.abs(p4[1] ? p4[0] : t5) + Math.pow(10, -Math.max(e5, l4) - 1)).toFixed(e5), f3 = String(c3(g4)), m3 = f3.length > 3 ? f3.length % 3 : 0;
            return s4 = d3(s4, h4.decimalPoint), o5 = d3(o5, h4.thousandsSep), r4 = (t5 < 0 ? "-" : "") + (m3 ? f3.substr(0, m3) + o5 : ""), 0 > +p4[1] && !u5 ? r4 = "0" : r4 += f3.substr(m3).replace(/(\d{3})(?=\d)/g, "$1" + o5), e5 && (r4 += s4 + g4.slice(-e5)), p4[1] && 0 != +r4 && (r4 += "e" + p4[1]), r4;
          }
          return { dateFormat: function(t5, e5, i6) {
            return s3.dateFormat(t5, e5, i6);
          }, format: u4, helpers: p3, numberFormat: g3 };
        }), i4(e3, "Core/Renderer/RendererUtilities.js", [e3["Core/Utilities.js"]], function(t4) {
          var e4;
          let { clamp: i5, pick: s3, pushUnique: o4, stableSort: r3 } = t4;
          return (e4 || (e4 = {})).distribute = function t5(e5, n4, a4) {
            let h3 = e5, l3 = h3.reducedLen || n4, d3 = (t6, e6) => t6.target - e6.target, c3 = [], p3 = e5.length, u4 = [], g3 = c3.push, f3, m3, x3, y3 = true, b3, v3, S3 = 0, k3;
            for (f3 = p3; f3--; )
              S3 += e5[f3].size;
            if (S3 > l3) {
              for (r3(e5, (t6, e6) => (e6.rank || 0) - (t6.rank || 0)), x3 = (k3 = e5[0].rank === e5[e5.length - 1].rank) ? p3 / 2 : -1, m3 = k3 ? x3 : p3 - 1; x3 && S3 > l3; )
                b3 = e5[f3 = Math.floor(m3)], o4(u4, f3) && (S3 -= b3.size), m3 += x3, k3 && m3 >= e5.length && (x3 /= 2, m3 = x3);
              u4.sort((t6, e6) => e6 - t6).forEach((t6) => g3.apply(c3, e5.splice(t6, 1)));
            }
            for (r3(e5, d3), e5 = e5.map((t6) => ({ size: t6.size, targets: [t6.target], align: s3(t6.align, 0.5) })); y3; ) {
              for (f3 = e5.length; f3--; )
                b3 = e5[f3], v3 = (Math.min.apply(0, b3.targets) + Math.max.apply(0, b3.targets)) / 2, b3.pos = i5(v3 - b3.size * b3.align, 0, n4 - b3.size);
              for (f3 = e5.length, y3 = false; f3--; )
                f3 > 0 && e5[f3 - 1].pos + e5[f3 - 1].size > e5[f3].pos && (e5[f3 - 1].size += e5[f3].size, e5[f3 - 1].targets = e5[f3 - 1].targets.concat(e5[f3].targets), e5[f3 - 1].align = 0.5, e5[f3 - 1].pos + e5[f3 - 1].size > n4 && (e5[f3 - 1].pos = n4 - e5[f3 - 1].size), e5.splice(f3, 1), y3 = true);
            }
            return g3.apply(h3, c3), f3 = 0, e5.some((e6) => {
              let i6 = 0;
              return (e6.targets || []).some(() => (h3[f3].pos = e6.pos + i6, void 0 !== a4 && Math.abs(h3[f3].pos - h3[f3].target) > a4) ? (h3.slice(0, f3 + 1).forEach((t6) => delete t6.pos), h3.reducedLen = (h3.reducedLen || n4) - 0.1 * n4, h3.reducedLen > 0.1 * n4 && t5(h3, n4, a4), true) : (i6 += h3[f3].size, f3++, false));
            }), r3(h3, d3), h3;
          }, e4;
        }), i4(e3, "Core/Renderer/SVG/SVGElement.js", [e3["Core/Animation/AnimationUtilities.js"], e3["Core/Color/Color.js"], e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3) {
          let { animate: o4, animObject: r3, stop: n4 } = t4, { deg2rad: a4, doc: h3, noop: l3, svg: d3, SVG_NS: c3, win: p3 } = i5, { addEvent: u4, attr: g3, createElement: f3, css: m3, defined: x3, erase: y3, extend: b3, fireEvent: v3, isArray: S3, isFunction: k3, isObject: M2, isString: C3, merge: w3, objectEach: T2, pick: A2, pInt: P2, syncTimeout: L2, uniqueKey: O2 } = s3;
          class D2 {
            _defaultGetter(t5) {
              let e5 = A2(this[t5 + "Value"], this[t5], this.element ? this.element.getAttribute(t5) : null, 0);
              return /^[\-0-9\.]+$/.test(e5) && (e5 = parseFloat(e5)), e5;
            }
            _defaultSetter(t5, e5, i6) {
              i6.setAttribute(e5, t5);
            }
            add(t5) {
              let e5;
              let i6 = this.renderer, s4 = this.element;
              return t5 && (this.parentGroup = t5), void 0 !== this.textStr && "text" === this.element.nodeName && i6.buildText(this), this.added = true, (!t5 || t5.handleZ || this.zIndex) && (e5 = this.zIndexSetter()), e5 || (t5 ? t5.element : i6.box).appendChild(s4), this.onAdd && this.onAdd(), this;
            }
            addClass(t5, e5) {
              let i6 = e5 ? "" : this.attr("class") || "";
              return (t5 = (t5 || "").split(/ /g).reduce(function(t6, e6) {
                return -1 === i6.indexOf(e6) && t6.push(e6), t6;
              }, i6 ? [i6] : []).join(" ")) !== i6 && this.attr("class", t5), this;
            }
            afterSetters() {
              this.doTransform && (this.updateTransform(), this.doTransform = false);
            }
            align(t5, e5, i6) {
              let s4, o5, r4, n5, a5;
              let h4 = {}, l4 = this.renderer, d4 = l4.alignedObjects;
              t5 ? (this.alignOptions = t5, this.alignByTranslate = e5, (!i6 || C3(i6)) && (this.alignTo = r4 = i6 || "renderer", y3(d4, this), d4.push(this), i6 = void 0)) : (t5 = this.alignOptions, e5 = this.alignByTranslate, r4 = this.alignTo), i6 = A2(i6, l4[r4], "scrollablePlotBox" === r4 ? l4.plotBox : void 0, l4);
              let c4 = t5.align, p4 = t5.verticalAlign;
              return s4 = (i6.x || 0) + (t5.x || 0), o5 = (i6.y || 0) + (t5.y || 0), "right" === c4 ? n5 = 1 : "center" === c4 && (n5 = 2), n5 && (s4 += (i6.width - (t5.width || 0)) / n5), h4[e5 ? "translateX" : "x"] = Math.round(s4), "bottom" === p4 ? a5 = 1 : "middle" === p4 && (a5 = 2), a5 && (o5 += (i6.height - (t5.height || 0)) / a5), h4[e5 ? "translateY" : "y"] = Math.round(o5), this[this.placed ? "animate" : "attr"](h4), this.placed = true, this.alignAttr = h4, this;
            }
            alignSetter(t5) {
              let e5 = { left: "start", center: "middle", right: "end" };
              e5[t5] && (this.alignValue = t5, this.element.setAttribute("text-anchor", e5[t5]));
            }
            animate(t5, e5, i6) {
              let s4 = r3(A2(e5, this.renderer.globalAnimation, true)), n5 = s4.defer;
              return h3.hidden && (s4.duration = 0), 0 !== s4.duration ? (i6 && (s4.complete = i6), L2(() => {
                this.element && o4(this, t5, s4);
              }, n5)) : (this.attr(t5, void 0, i6 || s4.complete), T2(t5, function(t6, e6) {
                s4.step && s4.step.call(this, t6, { prop: e6, pos: 1, elem: this });
              }, this)), this;
            }
            applyTextOutline(t5) {
              let e5 = this.element, s4 = -1 !== t5.indexOf("contrast");
              s4 && (t5 = t5.replace(/contrast/g, this.renderer.getContrast(e5.style.fill)));
              let o5 = t5.split(" "), r4 = o5[o5.length - 1], n5 = o5[0];
              if (n5 && "none" !== n5 && i5.svg) {
                this.fakeTS = true, n5 = n5.replace(/(^[\d\.]+)(.*?)$/g, function(t7, e6, i7) {
                  return 2 * Number(e6) + i7;
                }), this.removeTextOutline();
                let t6 = h3.createElementNS(c3, "tspan");
                g3(t6, { class: "highcharts-text-outline", fill: r4, stroke: r4, "stroke-width": n5, "stroke-linejoin": "round" });
                let i6 = e5.querySelector("textPath") || e5;
                [].forEach.call(i6.childNodes, (e6) => {
                  let i7 = e6.cloneNode(true);
                  i7.removeAttribute && ["fill", "stroke", "stroke-width", "stroke"].forEach((t7) => i7.removeAttribute(t7)), t6.appendChild(i7);
                });
                let s5 = 0;
                [].forEach.call(i6.querySelectorAll("text tspan"), (t7) => {
                  s5 += Number(t7.getAttribute("dy"));
                });
                let o6 = h3.createElementNS(c3, "tspan");
                o6.textContent = "\u200B", g3(o6, { x: Number(e5.getAttribute("x")), dy: -s5 }), t6.appendChild(o6), i6.insertBefore(t6, i6.firstChild);
              }
            }
            attr(t5, e5, i6, s4) {
              let o5 = this.element, r4 = D2.symbolCustomAttribs, a5, h4, l4 = this, d4;
              return "string" == typeof t5 && void 0 !== e5 && (a5 = t5, (t5 = {})[a5] = e5), "string" == typeof t5 ? l4 = (this[t5 + "Getter"] || this._defaultGetter).call(this, t5, o5) : (T2(t5, function(e6, i7) {
                d4 = false, s4 || n4(this, i7), this.symbolName && -1 !== r4.indexOf(i7) && (h4 || (this.symbolAttr(t5), h4 = true), d4 = true), this.rotation && ("x" === i7 || "y" === i7) && (this.doTransform = true), d4 || (this[i7 + "Setter"] || this._defaultSetter).call(this, e6, i7, o5);
              }, this), this.afterSetters()), i6 && i6.call(this), l4;
            }
            clip(t5) {
              if (t5 && !t5.clipPath) {
                let e5 = O2() + "-", i6 = this.renderer.createElement("clipPath").attr({ id: e5 }).add(this.renderer.defs);
                b3(t5, { clipPath: i6, id: e5, count: 0 }), t5.add(i6);
              }
              return this.attr("clip-path", t5 ? `url(${this.renderer.url}#${t5.id})` : "none");
            }
            crisp(t5, e5) {
              e5 = e5 || t5.strokeWidth || 0;
              let i6 = Math.round(e5) % 2 / 2;
              return t5.x = Math.floor(t5.x || this.x || 0) + i6, t5.y = Math.floor(t5.y || this.y || 0) + i6, t5.width = Math.floor((t5.width || this.width || 0) - 2 * i6), t5.height = Math.floor((t5.height || this.height || 0) - 2 * i6), x3(t5.strokeWidth) && (t5.strokeWidth = e5), t5;
            }
            complexColor(t5, i6, s4) {
              let o5 = this.renderer, r4, n5, a5, h4, l4, d4, c4, p4, u5, g4, f4 = [], m4;
              v3(this.renderer, "complexColor", { args: arguments }, function() {
                if (t5.radialGradient ? n5 = "radialGradient" : t5.linearGradient && (n5 = "linearGradient"), n5) {
                  if (a5 = t5[n5], l4 = o5.gradients, d4 = t5.stops, u5 = s4.radialReference, S3(a5) && (t5[n5] = a5 = { x1: a5[0], y1: a5[1], x2: a5[2], y2: a5[3], gradientUnits: "userSpaceOnUse" }), "radialGradient" === n5 && u5 && !x3(a5.gradientUnits) && (h4 = a5, a5 = w3(a5, o5.getRadialAttr(u5, h4), { gradientUnits: "userSpaceOnUse" })), T2(a5, function(t6, e5) {
                    "id" !== e5 && f4.push(e5, t6);
                  }), T2(d4, function(t6) {
                    f4.push(t6);
                  }), l4[f4 = f4.join(",")])
                    g4 = l4[f4].attr("id");
                  else {
                    a5.id = g4 = O2();
                    let t6 = l4[f4] = o5.createElement(n5).attr(a5).add(o5.defs);
                    t6.radAttr = h4, t6.stops = [], d4.forEach(function(i7) {
                      0 === i7[1].indexOf("rgba") ? (c4 = (r4 = e4.parse(i7[1])).get("rgb"), p4 = r4.get("a")) : (c4 = i7[1], p4 = 1);
                      let s5 = o5.createElement("stop").attr({ offset: i7[0], "stop-color": c4, "stop-opacity": p4 }).add(t6);
                      t6.stops.push(s5);
                    });
                  }
                  m4 = "url(" + o5.url + "#" + g4 + ")", s4.setAttribute(i6, m4), s4.gradient = f4, t5.toString = function() {
                    return m4;
                  };
                }
              });
            }
            css(t5) {
              let e5 = this.styles, i6 = {}, s4 = this.element, o5, r4 = !e5;
              if (e5 && T2(t5, function(t6, s5) {
                e5 && e5[s5] !== t6 && (i6[s5] = t6, r4 = true);
              }), r4) {
                e5 && (t5 = b3(e5, i6)), null === t5.width || "auto" === t5.width ? delete this.textWidth : "text" === s4.nodeName.toLowerCase() && t5.width && (o5 = this.textWidth = P2(t5.width)), this.styles = t5, o5 && !d3 && this.renderer.forExport && delete t5.width;
                let r5 = w3(t5);
                s4.namespaceURI === this.SVG_NS && (["textOutline", "textOverflow", "width"].forEach((t6) => r5 && delete r5[t6]), r5.color && (r5.fill = r5.color)), m3(s4, r5);
              }
              return this.added && ("text" === this.element.nodeName && this.renderer.buildText(this), t5.textOutline && this.applyTextOutline(t5.textOutline)), this;
            }
            dashstyleSetter(t5) {
              let e5, i6 = this["stroke-width"];
              if ("inherit" === i6 && (i6 = 1), t5 = t5 && t5.toLowerCase()) {
                let s4 = t5.replace("shortdashdotdot", "3,1,1,1,1,1,").replace("shortdashdot", "3,1,1,1").replace("shortdot", "1,1,").replace("shortdash", "3,1,").replace("longdash", "8,3,").replace(/dot/g, "1,3,").replace("dash", "4,3,").replace(/,$/, "").split(",");
                for (e5 = s4.length; e5--; )
                  s4[e5] = "" + P2(s4[e5]) * A2(i6, NaN);
                t5 = s4.join(",").replace(/NaN/g, "none"), this.element.setAttribute("stroke-dasharray", t5);
              }
            }
            destroy() {
              let t5 = this, e5 = t5.element || {}, i6 = t5.renderer, s4 = e5.ownerSVGElement, o5 = "SPAN" === e5.nodeName && t5.parentGroup || void 0, r4, a5;
              if (e5.onclick = e5.onmouseout = e5.onmouseover = e5.onmousemove = e5.point = null, n4(t5), t5.clipPath && s4) {
                let e6 = t5.clipPath;
                [].forEach.call(s4.querySelectorAll("[clip-path],[CLIP-PATH]"), function(t6) {
                  t6.getAttribute("clip-path").indexOf(e6.element.id) > -1 && t6.removeAttribute("clip-path");
                }), t5.clipPath = e6.destroy();
              }
              if (t5.connector = t5.connector?.destroy(), t5.stops) {
                for (a5 = 0; a5 < t5.stops.length; a5++)
                  t5.stops[a5].destroy();
                t5.stops.length = 0, t5.stops = void 0;
              }
              for (t5.safeRemoveChild(e5); o5 && o5.div && 0 === o5.div.childNodes.length; )
                r4 = o5.parentGroup, t5.safeRemoveChild(o5.div), delete o5.div, o5 = r4;
              t5.alignTo && y3(i6.alignedObjects, t5), T2(t5, function(e6, i7) {
                t5[i7] && t5[i7].parentGroup === t5 && t5[i7].destroy && t5[i7].destroy(), delete t5[i7];
              });
            }
            dSetter(t5, e5, i6) {
              S3(t5) && ("string" == typeof t5[0] && (t5 = this.renderer.pathToSegments(t5)), this.pathArray = t5, t5 = t5.reduce((t6, e6, i7) => e6 && e6.join ? (i7 ? t6 + " " : "") + e6.join(" ") : (e6 || "").toString(), "")), /(NaN| {2}|^$)/.test(t5) && (t5 = "M 0 0"), this[e5] !== t5 && (i6.setAttribute(e5, t5), this[e5] = t5);
            }
            fillSetter(t5, e5, i6) {
              "string" == typeof t5 ? i6.setAttribute(e5, t5) : t5 && this.complexColor(t5, e5, i6);
            }
            hrefSetter(t5, e5, i6) {
              i6.setAttributeNS("http://www.w3.org/1999/xlink", e5, t5);
            }
            getBBox(t5, e5) {
              let i6, s4, o5, r4, n5;
              let { alignValue: h4, element: l4, renderer: d4, styles: c4, textStr: p4 } = this, { cache: u5, cacheKeys: g4 } = d4, f4 = l4.namespaceURI === this.SVG_NS, y4 = A2(e5, this.rotation, 0), v4 = d4.styledMode ? l4 && D2.prototype.getStyle.call(l4, "font-size") : c4 && c4.fontSize;
              if (x3(p4) && (-1 === (n5 = p4.toString()).indexOf("<") && (n5 = n5.replace(/[0-9]/g, "0")), n5 += ["", d4.rootFontSize, v4, y4, this.textWidth, h4, c4 && c4.textOverflow, c4 && c4.fontWeight].join(",")), n5 && !t5 && (i6 = u5[n5]), !i6) {
                if (f4 || d4.forExport) {
                  try {
                    r4 = this.fakeTS && function(t6) {
                      let e6 = l4.querySelector(".highcharts-text-outline");
                      e6 && m3(e6, { display: t6 });
                    }, k3(r4) && r4("none"), i6 = l4.getBBox ? b3({}, l4.getBBox()) : { width: l4.offsetWidth, height: l4.offsetHeight, x: 0, y: 0 }, k3(r4) && r4("");
                  } catch (t6) {
                  }
                  (!i6 || i6.width < 0) && (i6 = { x: 0, y: 0, width: 0, height: 0 });
                } else
                  i6 = this.htmlGetBBox();
                if (s4 = i6.width, o5 = i6.height, f4 && (i6.height = o5 = { "11px,17": 14, "13px,20": 16 }[`${v4 || ""},${Math.round(o5)}`] || o5), y4) {
                  let t6 = Number(l4.getAttribute("y") || 0) - i6.y, e6 = { right: 1, center: 0.5 }[h4 || 0] || 0, r5 = y4 * a4, n6 = (y4 - 90) * a4, d5 = s4 * Math.cos(r5), c5 = s4 * Math.sin(r5), p5 = Math.cos(n6), u6 = Math.sin(n6), g5 = i6.x + e6 * (s4 - d5), f5 = i6.y + t6 - e6 * c5, m4 = g5 + t6 * p5, x4 = m4 + d5, b4 = x4 - o5 * p5, v5 = b4 - d5, S4 = f5 + t6 * u6, k4 = S4 + c5, M3 = k4 - o5 * u6, C4 = M3 - c5;
                  i6.x = Math.min(m4, x4, b4, v5), i6.y = Math.min(S4, k4, M3, C4), i6.width = Math.max(m4, x4, b4, v5) - i6.x, i6.height = Math.max(S4, k4, M3, C4) - i6.y;
                }
              }
              if (n5 && ("" === p4 || i6.height > 0)) {
                for (; g4.length > 250; )
                  delete u5[g4.shift()];
                u5[n5] || g4.push(n5), u5[n5] = i6;
              }
              return i6;
            }
            getStyle(t5) {
              return p3.getComputedStyle(this.element || this, "").getPropertyValue(t5);
            }
            hasClass(t5) {
              return -1 !== ("" + this.attr("class")).split(" ").indexOf(t5);
            }
            hide() {
              return this.attr({ visibility: "hidden" });
            }
            htmlGetBBox() {
              return { height: 0, width: 0, x: 0, y: 0 };
            }
            constructor(t5, e5) {
              this.onEvents = {}, this.opacity = 1, this.SVG_NS = c3, this.element = "span" === e5 ? f3(e5) : h3.createElementNS(this.SVG_NS, e5), this.renderer = t5, v3(this, "afterInit");
            }
            on(t5, e5) {
              let { onEvents: i6 } = this;
              return i6[t5] && i6[t5](), i6[t5] = u4(this.element, t5, e5), this;
            }
            opacitySetter(t5, e5, i6) {
              let s4 = Number(Number(t5).toFixed(3));
              this.opacity = s4, i6.setAttribute(e5, s4);
            }
            removeClass(t5) {
              return this.attr("class", ("" + this.attr("class")).replace(C3(t5) ? RegExp(`(^| )${t5}( |$)`) : t5, " ").replace(/ +/g, " ").trim());
            }
            removeTextOutline() {
              let t5 = this.element.querySelector("tspan.highcharts-text-outline");
              t5 && this.safeRemoveChild(t5);
            }
            safeRemoveChild(t5) {
              let e5 = t5.parentNode;
              e5 && e5.removeChild(t5);
            }
            setRadialReference(t5) {
              let e5 = this.element.gradient && this.renderer.gradients[this.element.gradient];
              return this.element.radialReference = t5, e5 && e5.radAttr && e5.animate(this.renderer.getRadialAttr(t5, e5.radAttr)), this;
            }
            setTextPath(t5, e5) {
              e5 = w3(true, { enabled: true, attributes: { dy: -5, startOffset: "50%", textAnchor: "middle" } }, e5);
              let i6 = this.renderer.url, s4 = this.text || this, o5 = s4.textPath, { attributes: r4, enabled: n5 } = e5;
              if (t5 = t5 || o5 && o5.path, o5 && o5.undo(), t5 && n5) {
                let e6 = u4(s4, "afterModifyTree", (e7) => {
                  if (t5 && n5) {
                    let o6 = t5.attr("id");
                    o6 || t5.attr("id", o6 = O2());
                    let n6 = { x: 0, y: 0 };
                    x3(r4.dx) && (n6.dx = r4.dx, delete r4.dx), x3(r4.dy) && (n6.dy = r4.dy, delete r4.dy), s4.attr(n6), this.attr({ transform: "" }), this.box && (this.box = this.box.destroy());
                    let a5 = e7.nodes.slice(0);
                    e7.nodes.length = 0, e7.nodes[0] = { tagName: "textPath", attributes: b3(r4, { "text-anchor": r4.textAnchor, href: `${i6}#${o6}` }), children: a5 };
                  }
                });
                s4.textPath = { path: t5, undo: e6 };
              } else
                s4.attr({ dx: 0, dy: 0 }), delete s4.textPath;
              return this.added && (s4.textCache = "", this.renderer.buildText(s4)), this;
            }
            shadow(t5) {
              let { renderer: e5 } = this, i6 = w3(this.parentGroup?.rotation === 90 ? { offsetX: -1, offsetY: -1 } : {}, M2(t5) ? t5 : {}), s4 = e5.shadowDefinition(i6);
              return this.attr({ filter: t5 ? `url(${e5.url}#${s4})` : "none" });
            }
            show(t5 = true) {
              return this.attr({ visibility: t5 ? "inherit" : "visible" });
            }
            "stroke-widthSetter"(t5, e5, i6) {
              this[e5] = t5, i6.setAttribute(e5, t5);
            }
            strokeWidth() {
              if (!this.renderer.styledMode)
                return this["stroke-width"] || 0;
              let t5 = this.getStyle("stroke-width"), e5 = 0, i6;
              return t5.indexOf("px") === t5.length - 2 ? e5 = P2(t5) : "" !== t5 && (g3(i6 = h3.createElementNS(c3, "rect"), { width: t5, "stroke-width": 0 }), this.element.parentNode.appendChild(i6), e5 = i6.getBBox().width, i6.parentNode.removeChild(i6)), e5;
            }
            symbolAttr(t5) {
              let e5 = this;
              D2.symbolCustomAttribs.forEach(function(i6) {
                e5[i6] = A2(t5[i6], e5[i6]);
              }), e5.attr({ d: e5.renderer.symbols[e5.symbolName](e5.x, e5.y, e5.width, e5.height, e5) });
            }
            textSetter(t5) {
              t5 !== this.textStr && (delete this.textPxLength, this.textStr = t5, this.added && this.renderer.buildText(this));
            }
            titleSetter(t5) {
              let e5 = this.element, i6 = e5.getElementsByTagName("title")[0] || h3.createElementNS(this.SVG_NS, "title");
              e5.insertBefore ? e5.insertBefore(i6, e5.firstChild) : e5.appendChild(i6), i6.textContent = String(A2(t5, "")).replace(/<[^>]*>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            }
            toFront() {
              let t5 = this.element;
              return t5.parentNode.appendChild(t5), this;
            }
            translate(t5, e5) {
              return this.attr({ translateX: t5, translateY: e5 });
            }
            updateTransform(t5 = "transform") {
              let { element: e5, matrix: i6, rotation: s4 = 0, scaleX: o5, scaleY: r4, translateX: n5 = 0, translateY: a5 = 0 } = this, h4 = ["translate(" + n5 + "," + a5 + ")"];
              x3(i6) && h4.push("matrix(" + i6.join(",") + ")"), s4 && h4.push("rotate(" + s4 + " " + A2(this.rotationOriginX, e5.getAttribute("x"), 0) + " " + A2(this.rotationOriginY, e5.getAttribute("y") || 0) + ")"), (x3(o5) || x3(r4)) && h4.push("scale(" + A2(o5, 1) + " " + A2(r4, 1) + ")"), h4.length && !(this.text || this).textPath && e5.setAttribute(t5, h4.join(" "));
            }
            visibilitySetter(t5, e5, i6) {
              "inherit" === t5 ? i6.removeAttribute(e5) : this[e5] !== t5 && i6.setAttribute(e5, t5), this[e5] = t5;
            }
            xGetter(t5) {
              return "circle" === this.element.nodeName && ("x" === t5 ? t5 = "cx" : "y" === t5 && (t5 = "cy")), this._defaultGetter(t5);
            }
            zIndexSetter(t5, e5) {
              let i6 = this.renderer, s4 = this.parentGroup, o5 = s4 || i6, r4 = o5.element || i6.box, n5 = this.element, a5 = r4 === i6.box, h4, l4, d4, c4 = false, p4, u5 = this.added, g4;
              if (x3(t5) ? (n5.setAttribute("data-z-index", t5), t5 = +t5, this[e5] === t5 && (u5 = false)) : x3(this[e5]) && n5.removeAttribute("data-z-index"), this[e5] = t5, u5) {
                for ((t5 = this.zIndex) && s4 && (s4.handleZ = true), g4 = (h4 = r4.childNodes).length - 1; g4 >= 0 && !c4; g4--)
                  p4 = !x3(d4 = (l4 = h4[g4]).getAttribute("data-z-index")), l4 !== n5 && (t5 < 0 && p4 && !a5 && !g4 ? (r4.insertBefore(n5, h4[g4]), c4 = true) : (P2(d4) <= t5 || p4 && (!x3(t5) || t5 >= 0)) && (r4.insertBefore(n5, h4[g4 + 1]), c4 = true));
                c4 || (r4.insertBefore(n5, h4[a5 ? 3 : 0]), c4 = true);
              }
              return c4;
            }
          }
          return D2.symbolCustomAttribs = ["anchorX", "anchorY", "clockwise", "end", "height", "innerR", "r", "start", "width", "x", "y"], D2.prototype.strokeSetter = D2.prototype.fillSetter, D2.prototype.yGetter = D2.prototype.xGetter, D2.prototype.matrixSetter = D2.prototype.rotationOriginXSetter = D2.prototype.rotationOriginYSetter = D2.prototype.rotationSetter = D2.prototype.scaleXSetter = D2.prototype.scaleYSetter = D2.prototype.translateXSetter = D2.prototype.translateYSetter = D2.prototype.verticalAlignSetter = function(t5, e5) {
            this[e5] = t5, this.doTransform = true;
          }, D2;
        }), i4(e3, "Core/Renderer/RendererRegistry.js", [e3["Core/Globals.js"]], function(t4) {
          var e4, i5;
          let s3;
          return (i5 = e4 || (e4 = {})).rendererTypes = {}, i5.getRendererType = function(t5 = s3) {
            return i5.rendererTypes[t5] || i5.rendererTypes[s3];
          }, i5.registerRendererType = function(e5, o4, r3) {
            i5.rendererTypes[e5] = o4, (!s3 || r3) && (s3 = e5, t4.Renderer = o4);
          }, e4;
        }), i4(e3, "Core/Renderer/SVG/SVGLabel.js", [e3["Core/Renderer/SVG/SVGElement.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          let { defined: i5, extend: s3, isNumber: o4, merge: r3, pick: n4, removeEvent: a4 } = e4;
          class h3 extends t4 {
            constructor(t5, e5, i6, s4, o5, r4, n5, a5, l3, d3) {
              let c3;
              super(t5, "g"), this.paddingLeftSetter = this.paddingSetter, this.paddingRightSetter = this.paddingSetter, this.textStr = e5, this.x = i6, this.y = s4, this.anchorX = r4, this.anchorY = n5, this.baseline = l3, this.className = d3, this.addClass("button" === d3 ? "highcharts-no-tooltip" : "highcharts-label"), d3 && this.addClass("highcharts-" + d3), this.text = t5.text(void 0, 0, 0, a5).attr({ zIndex: 1 }), "string" == typeof o5 && ((c3 = /^url\((.*?)\)$/.test(o5)) || this.renderer.symbols[o5]) && (this.symbolKey = o5), this.bBox = h3.emptyBBox, this.padding = 3, this.baselineOffset = 0, this.needsBox = t5.styledMode || c3, this.deferredAttr = {}, this.alignFactor = 0;
            }
            alignSetter(t5) {
              let e5 = { left: 0, center: 0.5, right: 1 }[t5];
              e5 !== this.alignFactor && (this.alignFactor = e5, this.bBox && o4(this.xSetting) && this.attr({ x: this.xSetting }));
            }
            anchorXSetter(t5, e5) {
              this.anchorX = t5, this.boxAttr(e5, Math.round(t5) - this.getCrispAdjust() - this.xSetting);
            }
            anchorYSetter(t5, e5) {
              this.anchorY = t5, this.boxAttr(e5, t5 - this.ySetting);
            }
            boxAttr(t5, e5) {
              this.box ? this.box.attr(t5, e5) : this.deferredAttr[t5] = e5;
            }
            css(e5) {
              if (e5) {
                let t5 = {};
                e5 = r3(e5), h3.textProps.forEach((i6) => {
                  void 0 !== e5[i6] && (t5[i6] = e5[i6], delete e5[i6]);
                }), this.text.css(t5), "fontSize" in t5 || "fontWeight" in t5 ? this.updateTextPadding() : ("width" in t5 || "textOverflow" in t5) && this.updateBoxSize();
              }
              return t4.prototype.css.call(this, e5);
            }
            destroy() {
              a4(this.element, "mouseenter"), a4(this.element, "mouseleave"), this.text && this.text.destroy(), this.box && (this.box = this.box.destroy()), t4.prototype.destroy.call(this);
            }
            fillSetter(t5, e5) {
              t5 && (this.needsBox = true), this.fill = t5, this.boxAttr(e5, t5);
            }
            getBBox() {
              this.textStr && 0 === this.bBox.width && 0 === this.bBox.height && this.updateBoxSize();
              let t5 = this.padding, e5 = n4(this.paddingLeft, t5);
              return { width: this.width || 0, height: this.height || 0, x: this.bBox.x - e5, y: this.bBox.y - t5 };
            }
            getCrispAdjust() {
              return this.renderer.styledMode && this.box ? this.box.strokeWidth() % 2 / 2 : (this["stroke-width"] ? parseInt(this["stroke-width"], 10) : 0) % 2 / 2;
            }
            heightSetter(t5) {
              this.heightSetting = t5;
            }
            onAdd() {
              this.text.add(this), this.attr({ text: n4(this.textStr, ""), x: this.x || 0, y: this.y || 0 }), this.box && i5(this.anchorX) && this.attr({ anchorX: this.anchorX, anchorY: this.anchorY });
            }
            paddingSetter(t5, e5) {
              o4(t5) ? t5 !== this[e5] && (this[e5] = t5, this.updateTextPadding()) : this[e5] = void 0;
            }
            rSetter(t5, e5) {
              this.boxAttr(e5, t5);
            }
            strokeSetter(t5, e5) {
              this.stroke = t5, this.boxAttr(e5, t5);
            }
            "stroke-widthSetter"(t5, e5) {
              t5 && (this.needsBox = true), this["stroke-width"] = t5, this.boxAttr(e5, t5);
            }
            "text-alignSetter"(t5) {
              this.textAlign = t5;
            }
            textSetter(t5) {
              void 0 !== t5 && this.text.attr({ text: t5 }), this.updateTextPadding();
            }
            updateBoxSize() {
              let t5;
              let e5 = this.text, r4 = {}, n5 = this.padding, a5 = this.bBox = (!o4(this.widthSetting) || !o4(this.heightSetting) || this.textAlign) && i5(e5.textStr) ? e5.getBBox() : h3.emptyBBox;
              this.width = this.getPaddedWidth(), this.height = (this.heightSetting || a5.height || 0) + 2 * n5;
              let l3 = this.renderer.fontMetrics(e5);
              if (this.baselineOffset = n5 + Math.min((this.text.firstLineMetrics || l3).b, a5.height || 1 / 0), this.heightSetting && (this.baselineOffset += (this.heightSetting - l3.h) / 2), this.needsBox && !e5.textPath) {
                if (!this.box) {
                  let t6 = this.box = this.symbolKey ? this.renderer.symbol(this.symbolKey) : this.renderer.rect();
                  t6.addClass(("button" === this.className ? "" : "highcharts-label-box") + (this.className ? " highcharts-" + this.className + "-box" : "")), t6.add(this);
                }
                t5 = this.getCrispAdjust(), r4.x = t5, r4.y = (this.baseline ? -this.baselineOffset : 0) + t5, r4.width = Math.round(this.width), r4.height = Math.round(this.height), this.box.attr(s3(r4, this.deferredAttr)), this.deferredAttr = {};
              }
            }
            updateTextPadding() {
              let t5 = this.text;
              if (!t5.textPath) {
                this.updateBoxSize();
                let e5 = this.baseline ? 0 : this.baselineOffset, s4 = n4(this.paddingLeft, this.padding);
                i5(this.widthSetting) && this.bBox && ("center" === this.textAlign || "right" === this.textAlign) && (s4 += { center: 0.5, right: 1 }[this.textAlign] * (this.widthSetting - this.bBox.width)), (s4 !== t5.x || e5 !== t5.y) && (t5.attr("x", s4), t5.hasBoxWidthChanged && (this.bBox = t5.getBBox(true)), void 0 !== e5 && t5.attr("y", e5)), t5.x = s4, t5.y = e5;
              }
            }
            widthSetter(t5) {
              this.widthSetting = o4(t5) ? t5 : void 0;
            }
            getPaddedWidth() {
              let t5 = this.padding, e5 = n4(this.paddingLeft, t5), i6 = n4(this.paddingRight, t5);
              return (this.widthSetting || this.bBox.width || 0) + e5 + i6;
            }
            xSetter(t5) {
              this.x = t5, this.alignFactor && (t5 -= this.alignFactor * this.getPaddedWidth(), this["forceAnimate:x"] = true), this.xSetting = Math.round(t5), this.attr("translateX", this.xSetting);
            }
            ySetter(t5) {
              this.ySetting = this.y = Math.round(t5), this.attr("translateY", this.ySetting);
            }
          }
          return h3.emptyBBox = { width: 0, height: 0, x: 0, y: 0 }, h3.textProps = ["color", "direction", "fontFamily", "fontSize", "fontStyle", "fontWeight", "lineHeight", "textAlign", "textDecoration", "textOutline", "textOverflow", "whiteSpace", "width"], h3;
        }), i4(e3, "Core/Renderer/SVG/Symbols.js", [e3["Core/Utilities.js"]], function(t4) {
          let { defined: e4, isNumber: i5, pick: s3 } = t4;
          function o4(t5, i6, o5, r4, n5) {
            let a4 = [];
            if (n5) {
              let h3 = n5.start || 0, l3 = s3(n5.r, o5), d3 = s3(n5.r, r4 || o5), c3 = 1e-3 > Math.abs((n5.end || 0) - h3 - 2 * Math.PI), p3 = (n5.end || 0) - 1e-3, u4 = n5.innerR, g3 = s3(n5.open, c3), f3 = Math.cos(h3), m3 = Math.sin(h3), x3 = Math.cos(p3), y3 = Math.sin(p3), b3 = s3(n5.longArc, p3 - h3 - Math.PI < 1e-3 ? 0 : 1), v3 = ["A", l3, d3, 0, b3, s3(n5.clockwise, 1), t5 + l3 * x3, i6 + d3 * y3];
              v3.params = { start: h3, end: p3, cx: t5, cy: i6 }, a4.push(["M", t5 + l3 * f3, i6 + d3 * m3], v3), e4(u4) && ((v3 = ["A", u4, u4, 0, b3, e4(n5.clockwise) ? 1 - n5.clockwise : 0, t5 + u4 * f3, i6 + u4 * m3]).params = { start: p3, end: h3, cx: t5, cy: i6 }, a4.push(g3 ? ["M", t5 + u4 * x3, i6 + u4 * y3] : ["L", t5 + u4 * x3, i6 + u4 * y3], v3)), g3 || a4.push(["Z"]);
            }
            return a4;
          }
          function r3(t5, e5, i6, s4, o5) {
            return o5 && o5.r ? n4(t5, e5, i6, s4, o5) : [["M", t5, e5], ["L", t5 + i6, e5], ["L", t5 + i6, e5 + s4], ["L", t5, e5 + s4], ["Z"]];
          }
          function n4(t5, e5, i6, s4, o5) {
            let r4 = o5?.r || 0;
            return [["M", t5 + r4, e5], ["L", t5 + i6 - r4, e5], ["A", r4, r4, 0, 0, 1, t5 + i6, e5 + r4], ["L", t5 + i6, e5 + s4 - r4], ["A", r4, r4, 0, 0, 1, t5 + i6 - r4, e5 + s4], ["L", t5 + r4, e5 + s4], ["A", r4, r4, 0, 0, 1, t5, e5 + s4 - r4], ["L", t5, e5 + r4], ["A", r4, r4, 0, 0, 1, t5 + r4, e5], ["Z"]];
          }
          return { arc: o4, callout: function(t5, e5, s4, o5, r4) {
            let a4 = Math.min(r4 && r4.r || 0, s4, o5), h3 = a4 + 6, l3 = r4 && r4.anchorX, d3 = r4 && r4.anchorY || 0, c3 = n4(t5, e5, s4, o5, { r: a4 });
            if (!i5(l3) || l3 < s4 && l3 > 0 && d3 < o5 && d3 > 0)
              return c3;
            if (t5 + l3 > s4 - h3) {
              if (d3 > e5 + h3 && d3 < e5 + o5 - h3)
                c3.splice(3, 1, ["L", t5 + s4, d3 - 6], ["L", t5 + s4 + 6, d3], ["L", t5 + s4, d3 + 6], ["L", t5 + s4, e5 + o5 - a4]);
              else if (l3 < s4) {
                let i6 = d3 < e5 + h3, r5 = i6 ? e5 : e5 + o5;
                c3.splice(i6 ? 2 : 5, 0, ["L", l3, d3], ["L", t5 + s4 - a4, r5]);
              } else
                c3.splice(3, 1, ["L", t5 + s4, o5 / 2], ["L", l3, d3], ["L", t5 + s4, o5 / 2], ["L", t5 + s4, e5 + o5 - a4]);
            } else if (t5 + l3 < h3) {
              if (d3 > e5 + h3 && d3 < e5 + o5 - h3)
                c3.splice(7, 1, ["L", t5, d3 + 6], ["L", t5 - 6, d3], ["L", t5, d3 - 6], ["L", t5, e5 + a4]);
              else if (l3 > 0) {
                let i6 = d3 < e5 + h3, s5 = i6 ? e5 : e5 + o5;
                c3.splice(i6 ? 1 : 6, 0, ["L", l3, d3], ["L", t5 + a4, s5]);
              } else
                c3.splice(7, 1, ["L", t5, o5 / 2], ["L", l3, d3], ["L", t5, o5 / 2], ["L", t5, e5 + a4]);
            } else
              d3 > o5 && l3 < s4 - h3 ? c3.splice(5, 1, ["L", l3 + 6, e5 + o5], ["L", l3, e5 + o5 + 6], ["L", l3 - 6, e5 + o5], ["L", t5 + a4, e5 + o5]) : d3 < 0 && l3 > h3 && c3.splice(1, 1, ["L", l3 - 6, e5], ["L", l3, e5 - 6], ["L", l3 + 6, e5], ["L", s4 - a4, e5]);
            return c3;
          }, circle: function(t5, e5, i6, s4) {
            return o4(t5 + i6 / 2, e5 + s4 / 2, i6 / 2, s4 / 2, { start: 0.5 * Math.PI, end: 2.5 * Math.PI, open: false });
          }, diamond: function(t5, e5, i6, s4) {
            return [["M", t5 + i6 / 2, e5], ["L", t5 + i6, e5 + s4 / 2], ["L", t5 + i6 / 2, e5 + s4], ["L", t5, e5 + s4 / 2], ["Z"]];
          }, rect: r3, roundedRect: n4, square: r3, triangle: function(t5, e5, i6, s4) {
            return [["M", t5 + i6 / 2, e5], ["L", t5 + i6, e5 + s4], ["L", t5, e5 + s4], ["Z"]];
          }, "triangle-down": function(t5, e5, i6, s4) {
            return [["M", t5, e5], ["L", t5 + i6, e5], ["L", t5 + i6 / 2, e5 + s4], ["Z"]];
          } };
        }), i4(e3, "Core/Renderer/SVG/TextBuilder.js", [e3["Core/Renderer/HTML/AST.js"], e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          let { doc: s3, SVG_NS: o4, win: r3 } = e4, { attr: n4, extend: a4, fireEvent: h3, isString: l3, objectEach: d3, pick: c3 } = i5;
          return class {
            constructor(t5) {
              let e5 = t5.styles;
              this.renderer = t5.renderer, this.svgElement = t5, this.width = t5.textWidth, this.textLineHeight = e5 && e5.lineHeight, this.textOutline = e5 && e5.textOutline, this.ellipsis = !!(e5 && "ellipsis" === e5.textOverflow), this.noWrap = !!(e5 && "nowrap" === e5.whiteSpace);
            }
            buildSVG() {
              let e5 = this.svgElement, i6 = e5.element, o5 = e5.renderer, r4 = c3(e5.textStr, "").toString(), n5 = -1 !== r4.indexOf("<"), a5 = i6.childNodes, h4 = !e5.added && o5.box, d4 = [r4, this.ellipsis, this.noWrap, this.textLineHeight, this.textOutline, e5.getStyle("font-size"), this.width].join(",");
              if (d4 !== e5.textCache) {
                e5.textCache = d4, delete e5.actualWidth;
                for (let t5 = a5.length; t5--; )
                  i6.removeChild(a5[t5]);
                if (n5 || this.ellipsis || this.width || e5.textPath || -1 !== r4.indexOf(" ") && (!this.noWrap || /<br.*?>/g.test(r4))) {
                  if ("" !== r4) {
                    h4 && h4.appendChild(i6);
                    let s4 = new t4(r4);
                    this.modifyTree(s4.nodes), s4.addToDOM(i6), this.modifyDOM(), this.ellipsis && -1 !== (i6.textContent || "").indexOf("\u2026") && e5.attr("title", this.unescapeEntities(e5.textStr || "", ["&lt;", "&gt;"])), h4 && h4.removeChild(i6);
                  }
                } else
                  i6.appendChild(s3.createTextNode(this.unescapeEntities(r4)));
                l3(this.textOutline) && e5.applyTextOutline && e5.applyTextOutline(this.textOutline);
              }
            }
            modifyDOM() {
              let t5;
              let e5 = this.svgElement, i6 = n4(e5.element, "x");
              for (e5.firstLineMetrics = void 0; t5 = e5.element.firstChild; )
                if (/^[\s\u200B]*$/.test(t5.textContent || " "))
                  e5.element.removeChild(t5);
                else
                  break;
              [].forEach.call(e5.element.querySelectorAll("tspan.highcharts-br"), (t6, s4) => {
                t6.nextSibling && t6.previousSibling && (0 === s4 && 1 === t6.previousSibling.nodeType && (e5.firstLineMetrics = e5.renderer.fontMetrics(t6.previousSibling)), n4(t6, { dy: this.getLineHeight(t6.nextSibling), x: i6 }));
              });
              let a5 = this.width || 0;
              if (!a5)
                return;
              let h4 = (t6, r4) => {
                let h5 = t6.textContent || "", l5 = h5.replace(/([^\^])-/g, "$1- ").split(" "), d4 = !this.noWrap && (l5.length > 1 || e5.element.childNodes.length > 1), c4 = this.getLineHeight(r4), p3 = 0, u4 = e5.actualWidth;
                if (this.ellipsis)
                  h5 && this.truncate(t6, h5, void 0, 0, Math.max(0, a5 - 0.8 * c4), (t7, e6) => t7.substring(0, e6) + "\u2026");
                else if (d4) {
                  let h6 = [], d5 = [];
                  for (; r4.firstChild && r4.firstChild !== t6; )
                    d5.push(r4.firstChild), r4.removeChild(r4.firstChild);
                  for (; l5.length; )
                    l5.length && !this.noWrap && p3 > 0 && (h6.push(t6.textContent || ""), t6.textContent = l5.join(" ").replace(/- /g, "-")), this.truncate(t6, void 0, l5, 0 === p3 && u4 || 0, a5, (t7, e6) => l5.slice(0, e6).join(" ").replace(/- /g, "-")), u4 = e5.actualWidth, p3++;
                  d5.forEach((e6) => {
                    r4.insertBefore(e6, t6);
                  }), h6.forEach((e6) => {
                    r4.insertBefore(s3.createTextNode(e6), t6);
                    let a6 = s3.createElementNS(o4, "tspan");
                    a6.textContent = "\u200B", n4(a6, { dy: c4, x: i6 }), r4.insertBefore(a6, t6);
                  });
                }
              }, l4 = (t6) => {
                let i7 = [].slice.call(t6.childNodes);
                i7.forEach((i8) => {
                  i8.nodeType === r3.Node.TEXT_NODE ? h4(i8, t6) : (-1 !== i8.className.baseVal.indexOf("highcharts-br") && (e5.actualWidth = 0), l4(i8));
                });
              };
              l4(e5.element);
            }
            getLineHeight(t5) {
              let e5 = t5.nodeType === r3.Node.TEXT_NODE ? t5.parentElement : t5;
              return this.textLineHeight ? parseInt(this.textLineHeight.toString(), 10) : this.renderer.fontMetrics(e5 || this.svgElement.element).h;
            }
            modifyTree(t5) {
              let e5 = (i6, s4) => {
                let { attributes: o5 = {}, children: r4, style: n5 = {}, tagName: h4 } = i6, l4 = this.renderer.styledMode;
                if ("b" === h4 || "strong" === h4 ? l4 ? o5.class = "highcharts-strong" : n5.fontWeight = "bold" : ("i" === h4 || "em" === h4) && (l4 ? o5.class = "highcharts-emphasized" : n5.fontStyle = "italic"), n5 && n5.color && (n5.fill = n5.color), "br" === h4) {
                  o5.class = "highcharts-br", i6.textContent = "\u200B";
                  let e6 = t5[s4 + 1];
                  e6 && e6.textContent && (e6.textContent = e6.textContent.replace(/^ +/gm, ""));
                } else
                  "a" === h4 && r4 && r4.some((t6) => "#text" === t6.tagName) && (i6.children = [{ children: r4, tagName: "tspan" }]);
                "#text" !== h4 && "a" !== h4 && (i6.tagName = "tspan"), a4(i6, { attributes: o5, style: n5 }), r4 && r4.filter((t6) => "#text" !== t6.tagName).forEach(e5);
              };
              t5.forEach(e5), h3(this.svgElement, "afterModifyTree", { nodes: t5 });
            }
            truncate(t5, e5, i6, s4, o5, r4) {
              let n5, a5;
              let h4 = this.svgElement, { renderer: l4, rotation: d4 } = h4, c4 = [], p3 = i6 ? 1 : 0, u4 = (e5 || i6 || "").length, g3 = u4, f3 = function(e6, o6) {
                let r5 = o6 || e6, n6 = t5.parentNode;
                if (n6 && void 0 === c4[r5] && n6.getSubStringLength)
                  try {
                    c4[r5] = s4 + n6.getSubStringLength(0, i6 ? r5 + 1 : r5);
                  } catch (t6) {
                  }
                return c4[r5];
              };
              if (h4.rotation = 0, s4 + (a5 = f3(t5.textContent.length)) > o5) {
                for (; p3 <= u4; )
                  g3 = Math.ceil((p3 + u4) / 2), i6 && (n5 = r4(i6, g3)), a5 = f3(g3, n5 && n5.length - 1), p3 === u4 ? p3 = u4 + 1 : a5 > o5 ? u4 = g3 - 1 : p3 = g3;
                0 === u4 ? t5.textContent = "" : e5 && u4 === e5.length - 1 || (t5.textContent = n5 || r4(e5 || i6, g3));
              }
              i6 && i6.splice(0, g3), h4.actualWidth = a5, h4.rotation = d4;
            }
            unescapeEntities(t5, e5) {
              return d3(this.renderer.escapes, function(i6, s4) {
                e5 && -1 !== e5.indexOf(i6) || (t5 = t5.toString().replace(RegExp(i6, "g"), s4));
              }), t5;
            }
          };
        }), i4(e3, "Core/Renderer/SVG/SVGRenderer.js", [e3["Core/Renderer/HTML/AST.js"], e3["Core/Color/Color.js"], e3["Core/Globals.js"], e3["Core/Renderer/RendererRegistry.js"], e3["Core/Renderer/SVG/SVGElement.js"], e3["Core/Renderer/SVG/SVGLabel.js"], e3["Core/Renderer/SVG/Symbols.js"], e3["Core/Renderer/SVG/TextBuilder.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3, o4, r3, n4, a4, h3) {
          let l3;
          let { charts: d3, deg2rad: c3, doc: p3, isFirefox: u4, isMS: g3, isWebKit: f3, noop: m3, SVG_NS: x3, symbolSizes: y3, win: b3 } = i5, { addEvent: v3, attr: S3, createElement: k3, css: M2, defined: C3, destroyObjectProperties: w3, extend: T2, isArray: A2, isNumber: P2, isObject: L2, isString: O2, merge: D2, pick: E, pInt: j2, uniqueKey: I2 } = h3;
          class B {
            constructor(t5, e5, i6, s4, o5, r4, n5) {
              let a5, h4;
              let l4 = this.createElement("svg").attr({ version: "1.1", class: "highcharts-root" }), d4 = l4.element;
              n5 || l4.css(this.getStyle(s4 || {})), t5.appendChild(d4), S3(t5, "dir", "ltr"), -1 === t5.innerHTML.indexOf("xmlns") && S3(d4, "xmlns", this.SVG_NS), this.box = d4, this.boxWrapper = l4, this.alignedObjects = [], this.url = this.getReferenceURL();
              let c4 = this.createElement("desc").add();
              c4.element.appendChild(p3.createTextNode("Created with Highcharts 11.3.0")), this.defs = this.createElement("defs").add(), this.allowHTML = r4, this.forExport = o5, this.styledMode = n5, this.gradients = {}, this.cache = {}, this.cacheKeys = [], this.imgCount = 0, this.rootFontSize = l4.getStyle("font-size"), this.setSize(e5, i6, false), u4 && t5.getBoundingClientRect && ((a5 = function() {
                M2(t5, { left: 0, top: 0 }), h4 = t5.getBoundingClientRect(), M2(t5, { left: Math.ceil(h4.left) - h4.left + "px", top: Math.ceil(h4.top) - h4.top + "px" });
              })(), this.unSubPixelFix = v3(b3, "resize", a5));
            }
            definition(e5) {
              let i6 = new t4([e5]);
              return i6.addToDOM(this.defs.element);
            }
            getReferenceURL() {
              if ((u4 || f3) && p3.getElementsByTagName("base").length) {
                if (!C3(l3)) {
                  let e5 = I2(), i6 = new t4([{ tagName: "svg", attributes: { width: 8, height: 8 }, children: [{ tagName: "defs", children: [{ tagName: "clipPath", attributes: { id: e5 }, children: [{ tagName: "rect", attributes: { width: 4, height: 4 } }] }] }, { tagName: "rect", attributes: { id: "hitme", width: 8, height: 8, "clip-path": `url(#${e5})`, fill: "rgba(0,0,0,0.001)" } }] }]), s4 = i6.addToDOM(p3.body);
                  M2(s4, { position: "fixed", top: 0, left: 0, zIndex: 9e5 });
                  let o5 = p3.elementFromPoint(6, 6);
                  l3 = "hitme" === (o5 && o5.id), p3.body.removeChild(s4);
                }
                if (l3)
                  return b3.location.href.split("#")[0].replace(/<[^>]*>/g, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20");
              }
              return "";
            }
            getStyle(t5) {
              return this.style = T2({ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "1rem" }, t5), this.style;
            }
            setStyle(t5) {
              this.boxWrapper.css(this.getStyle(t5));
            }
            isHidden() {
              return !this.boxWrapper.getBBox().width;
            }
            destroy() {
              let t5 = this.defs;
              return this.box = null, this.boxWrapper = this.boxWrapper.destroy(), w3(this.gradients || {}), this.gradients = null, this.defs = t5.destroy(), this.unSubPixelFix && this.unSubPixelFix(), this.alignedObjects = null, null;
            }
            createElement(t5) {
              return new this.Element(this, t5);
            }
            getRadialAttr(t5, e5) {
              return { cx: t5[0] - t5[2] / 2 + (e5.cx || 0) * t5[2], cy: t5[1] - t5[2] / 2 + (e5.cy || 0) * t5[2], r: (e5.r || 0) * t5[2] };
            }
            shadowDefinition(t5) {
              let e5 = [`highcharts-drop-shadow-${this.chartIndex}`, ...Object.keys(t5).map((e6) => `${e6}-${t5[e6]}`)].join("-").toLowerCase().replace(/[^a-z0-9\-]/g, ""), i6 = D2({ color: "#000000", offsetX: 1, offsetY: 1, opacity: 0.15, width: 5 }, t5);
              return this.defs.element.querySelector(`#${e5}`) || this.definition({ tagName: "filter", attributes: { id: e5, filterUnits: i6.filterUnits }, children: [{ tagName: "feDropShadow", attributes: { dx: i6.offsetX, dy: i6.offsetY, "flood-color": i6.color, "flood-opacity": Math.min(5 * i6.opacity, 1), stdDeviation: i6.width / 2 } }] }), e5;
            }
            buildText(t5) {
              new a4(t5).buildSVG();
            }
            getContrast(t5) {
              let i6 = e4.parse(t5).rgba.map((t6) => {
                let e5 = t6 / 255;
                return e5 <= 0.03928 ? e5 / 12.92 : Math.pow((e5 + 0.055) / 1.055, 2.4);
              }), s4 = 0.2126 * i6[0] + 0.7152 * i6[1] + 0.0722 * i6[2];
              return 1.05 / (s4 + 0.05) > (s4 + 0.05) / 0.05 ? "#FFFFFF" : "#000000";
            }
            button(e5, i6, s4, o5, r4 = {}, n5, a5, h4, l4, d4) {
              let c4, p4, u5;
              let f4 = this.label(e5, i6, s4, l4, void 0, void 0, d4, void 0, "button"), m4 = this.styledMode, x4 = r4.states || {}, y4 = 0;
              r4 = D2(r4), delete r4.states;
              let b4 = D2({ color: "#333333", cursor: "pointer", fontSize: "0.8em", fontWeight: "normal" }, r4.style);
              delete r4.style;
              let S4 = t4.filterUserAttributes(r4);
              return f4.attr(D2({ padding: 8, r: 2 }, S4)), m4 || (S4 = D2({ fill: "#f7f7f7", stroke: "#cccccc", "stroke-width": 1 }, S4), c4 = (n5 = D2(S4, { fill: "#e6e6e6" }, t4.filterUserAttributes(n5 || x4.hover || {}))).style, delete n5.style, p4 = (a5 = D2(S4, { fill: "#e6e9ff", style: { color: "#000000", fontWeight: "bold" } }, t4.filterUserAttributes(a5 || x4.select || {}))).style, delete a5.style, u5 = (h4 = D2(S4, { style: { color: "#cccccc" } }, t4.filterUserAttributes(h4 || x4.disabled || {}))).style, delete h4.style), v3(f4.element, g3 ? "mouseover" : "mouseenter", function() {
                3 !== y4 && f4.setState(1);
              }), v3(f4.element, g3 ? "mouseout" : "mouseleave", function() {
                3 !== y4 && f4.setState(y4);
              }), f4.setState = function(t5) {
                if (1 !== t5 && (f4.state = y4 = t5), f4.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-" + ["normal", "hover", "pressed", "disabled"][t5 || 0]), !m4) {
                  f4.attr([S4, n5, a5, h4][t5 || 0]);
                  let e6 = [b4, c4, p4, u5][t5 || 0];
                  L2(e6) && f4.css(e6);
                }
              }, !m4 && (f4.attr(S4).css(T2({ cursor: "default" }, b4)), d4 && f4.text.css({ pointerEvents: "none" })), f4.on("touchstart", (t5) => t5.stopPropagation()).on("click", function(t5) {
                3 !== y4 && o5.call(f4, t5);
              });
            }
            crispLine(t5, e5, i6 = "round") {
              let s4 = t5[0], o5 = t5[1];
              return C3(s4[1]) && s4[1] === o5[1] && (s4[1] = o5[1] = Math[i6](s4[1]) - e5 % 2 / 2), C3(s4[2]) && s4[2] === o5[2] && (s4[2] = o5[2] = Math[i6](s4[2]) + e5 % 2 / 2), t5;
            }
            path(t5) {
              let e5 = this.styledMode ? {} : { fill: "none" };
              return A2(t5) ? e5.d = t5 : L2(t5) && T2(e5, t5), this.createElement("path").attr(e5);
            }
            circle(t5, e5, i6) {
              let s4 = L2(t5) ? t5 : void 0 === t5 ? {} : { x: t5, y: e5, r: i6 }, o5 = this.createElement("circle");
              return o5.xSetter = o5.ySetter = function(t6, e6, i7) {
                i7.setAttribute("c" + e6, t6);
              }, o5.attr(s4);
            }
            arc(t5, e5, i6, s4, o5, r4) {
              let n5;
              L2(t5) ? (e5 = (n5 = t5).y, i6 = n5.r, s4 = n5.innerR, o5 = n5.start, r4 = n5.end, t5 = n5.x) : n5 = { innerR: s4, start: o5, end: r4 };
              let a5 = this.symbol("arc", t5, e5, i6, i6, n5);
              return a5.r = i6, a5;
            }
            rect(t5, e5, i6, s4, o5, r4) {
              let n5 = L2(t5) ? t5 : void 0 === t5 ? {} : { x: t5, y: e5, r: o5, width: Math.max(i6 || 0, 0), height: Math.max(s4 || 0, 0) }, a5 = this.createElement("rect");
              return this.styledMode || (void 0 !== r4 && (n5["stroke-width"] = r4, T2(n5, a5.crisp(n5))), n5.fill = "none"), a5.rSetter = function(t6, e6, i7) {
                a5.r = t6, S3(i7, { rx: t6, ry: t6 });
              }, a5.rGetter = function() {
                return a5.r || 0;
              }, a5.attr(n5);
            }
            roundedRect(t5) {
              return this.symbol("roundedRect").attr(t5);
            }
            setSize(t5, e5, i6) {
              this.width = t5, this.height = e5, this.boxWrapper.animate({ width: t5, height: e5 }, { step: function() {
                this.attr({ viewBox: "0 0 " + this.attr("width") + " " + this.attr("height") });
              }, duration: E(i6, true) ? void 0 : 0 }), this.alignElements();
            }
            g(t5) {
              let e5 = this.createElement("g");
              return t5 ? e5.attr({ class: "highcharts-" + t5 }) : e5;
            }
            image(t5, e5, i6, s4, o5, r4) {
              let n5 = { preserveAspectRatio: "none" };
              P2(e5) && (n5.x = e5), P2(i6) && (n5.y = i6), P2(s4) && (n5.width = s4), P2(o5) && (n5.height = o5);
              let a5 = this.createElement("image").attr(n5), h4 = function(e6) {
                a5.attr({ href: t5 }), r4.call(a5, e6);
              };
              if (r4) {
                a5.attr({ href: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" });
                let e6 = new b3.Image();
                v3(e6, "load", h4), e6.src = t5, e6.complete && h4({});
              } else
                a5.attr({ href: t5 });
              return a5;
            }
            symbol(t5, e5, i6, s4, o5, r4) {
              let n5, a5, h4, l4;
              let c4 = this, u5 = /^url\((.*?)\)$/, g4 = u5.test(t5), f4 = !g4 && (this.symbols[t5] ? t5 : "circle"), m4 = f4 && this.symbols[f4];
              if (m4)
                "number" == typeof e5 && (a5 = m4.call(this.symbols, Math.round(e5 || 0), Math.round(i6 || 0), s4 || 0, o5 || 0, r4)), n5 = this.path(a5), c4.styledMode || n5.attr("fill", "none"), T2(n5, { symbolName: f4 || void 0, x: e5, y: i6, width: s4, height: o5 }), r4 && T2(n5, r4);
              else if (g4) {
                h4 = t5.match(u5)[1];
                let s5 = n5 = this.image(h4);
                s5.imgwidth = E(r4 && r4.width, y3[h4] && y3[h4].width), s5.imgheight = E(r4 && r4.height, y3[h4] && y3[h4].height), l4 = (t6) => t6.attr({ width: t6.width, height: t6.height }), ["width", "height"].forEach((t6) => {
                  s5[`${t6}Setter`] = function(t7, e6) {
                    this[e6] = t7;
                    let { alignByTranslate: i7, element: s6, width: o6, height: n6, imgwidth: a6, imgheight: h5 } = this, l5 = "width" === e6 ? a6 : h5, d4 = 1;
                    r4 && "within" === r4.backgroundSize && o6 && n6 && a6 && h5 ? (d4 = Math.min(o6 / a6, n6 / h5), S3(s6, { width: Math.round(a6 * d4), height: Math.round(h5 * d4) })) : s6 && l5 && s6.setAttribute(e6, l5), !i7 && a6 && h5 && this.translate(((o6 || 0) - a6 * d4) / 2, ((n6 || 0) - h5 * d4) / 2);
                  };
                }), C3(e5) && s5.attr({ x: e5, y: i6 }), s5.isImg = true, C3(s5.imgwidth) && C3(s5.imgheight) ? l4(s5) : (s5.attr({ width: 0, height: 0 }), k3("img", { onload: function() {
                  let t6 = d3[c4.chartIndex];
                  0 === this.width && (M2(this, { position: "absolute", top: "-999em" }), p3.body.appendChild(this)), y3[h4] = { width: this.width, height: this.height }, s5.imgwidth = this.width, s5.imgheight = this.height, s5.element && l4(s5), this.parentNode && this.parentNode.removeChild(this), c4.imgCount--, c4.imgCount || !t6 || t6.hasLoaded || t6.onload();
                }, src: h4 }), this.imgCount++);
              }
              return n5;
            }
            clipRect(t5, e5, i6, s4) {
              return this.rect(t5, e5, i6, s4, 0);
            }
            text(t5, e5, i6, s4) {
              let o5 = {};
              if (s4 && (this.allowHTML || !this.forExport))
                return this.html(t5, e5, i6);
              o5.x = Math.round(e5 || 0), i6 && (o5.y = Math.round(i6)), C3(t5) && (o5.text = t5);
              let r4 = this.createElement("text").attr(o5);
              return s4 && (!this.forExport || this.allowHTML) || (r4.xSetter = function(t6, e6, i7) {
                let s5 = i7.getElementsByTagName("tspan"), o6 = i7.getAttribute(e6);
                for (let i8 = 0, r5; i8 < s5.length; i8++)
                  (r5 = s5[i8]).getAttribute(e6) === o6 && r5.setAttribute(e6, t6);
                i7.setAttribute(e6, t6);
              }), r4;
            }
            fontMetrics(t5) {
              let e5 = j2(o4.prototype.getStyle.call(t5, "font-size") || 0), i6 = e5 < 24 ? e5 + 3 : Math.round(1.2 * e5), s4 = Math.round(0.8 * i6);
              return { h: i6, b: s4, f: e5 };
            }
            rotCorr(t5, e5, i6) {
              let s4 = t5;
              return e5 && i6 && (s4 = Math.max(s4 * Math.cos(e5 * c3), 4)), { x: -t5 / 3 * Math.sin(e5 * c3), y: s4 };
            }
            pathToSegments(t5) {
              let e5 = [], i6 = [], s4 = { A: 8, C: 7, H: 2, L: 3, M: 3, Q: 5, S: 5, T: 3, V: 2 };
              for (let o5 = 0; o5 < t5.length; o5++)
                O2(i6[0]) && P2(t5[o5]) && i6.length === s4[i6[0].toUpperCase()] && t5.splice(o5, 0, i6[0].replace("M", "L").replace("m", "l")), "string" == typeof t5[o5] && (i6.length && e5.push(i6.slice(0)), i6.length = 0), i6.push(t5[o5]);
              return e5.push(i6.slice(0)), e5;
            }
            label(t5, e5, i6, s4, o5, n5, a5, h4, l4) {
              return new r3(this, t5, e5, i6, s4, o5, n5, a5, h4, l4);
            }
            alignElements() {
              this.alignedObjects.forEach((t5) => t5.align());
            }
          }
          return T2(B.prototype, { Element: o4, SVG_NS: x3, escapes: { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }, symbols: n4, draw: m3 }), s3.registerRendererType("svg", B, true), B;
        }), i4(e3, "Core/Renderer/HTML/HTMLElement.js", [e3["Core/Globals.js"], e3["Core/Renderer/SVG/SVGElement.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          let { composed: s3 } = t4, { css: o4, defined: r3, extend: n4, pushUnique: a4, pInt: h3 } = i5;
          class l3 extends e4 {
            static compose(t5) {
              if (a4(s3, this.compose)) {
                let e5 = l3.prototype, i6 = t5.prototype;
                i6.getSpanCorrection = e5.getSpanCorrection, i6.htmlCss = e5.htmlCss, i6.htmlGetBBox = e5.htmlGetBBox, i6.htmlUpdateTransform = e5.htmlUpdateTransform, i6.setSpanRotation = e5.setSpanRotation;
              }
              return t5;
            }
            getSpanCorrection(t5, e5, i6) {
              this.xCorr = -t5 * i6, this.yCorr = -e5;
            }
            htmlCss(t5) {
              let e5;
              let { element: i6 } = this, s4 = "SPAN" === i6.tagName && t5 && "width" in t5, r4 = s4 && t5.width;
              return s4 && (delete t5.width, this.textWidth = h3(r4) || void 0, e5 = true), t5?.textOverflow === "ellipsis" && (t5.whiteSpace = "nowrap", t5.overflow = "hidden"), n4(this.styles, t5), o4(i6, t5), e5 && this.htmlUpdateTransform(), this;
            }
            htmlGetBBox() {
              let { element: t5 } = this;
              return { x: t5.offsetLeft, y: t5.offsetTop, width: t5.offsetWidth, height: t5.offsetHeight };
            }
            htmlUpdateTransform() {
              if (!this.added) {
                this.alignOnAdd = true;
                return;
              }
              let { element: t5, renderer: e5, rotation: i6, styles: s4, textAlign: n5 = "left", textWidth: a5, translateX: h4 = 0, translateY: l4 = 0, x: d3 = 0, y: c3 = 0 } = this, p3 = { left: 0, center: 0.5, right: 1 }[n5], u4 = s4?.whiteSpace;
              if (o4(t5, { marginLeft: `${h4}px`, marginTop: `${l4}px` }), "SPAN" === t5.tagName) {
                let s5 = [i6, n5, t5.innerHTML, a5, this.textAlign].join(","), h5, l5 = false;
                if (a5 !== this.oldTextWidth) {
                  let e6 = this.textPxLength ? this.textPxLength : (o4(t5, { width: "", whiteSpace: u4 || "nowrap" }), t5.offsetWidth), s6 = a5 || 0;
                  (s6 > this.oldTextWidth || e6 > s6) && (/[ \-]/.test(t5.textContent || t5.innerText) || "ellipsis" === t5.style.textOverflow) && (o4(t5, { width: e6 > s6 || i6 ? a5 + "px" : "auto", display: "block", whiteSpace: u4 || "normal" }), this.oldTextWidth = a5, l5 = true);
                }
                this.hasBoxWidthChanged = l5, s5 !== this.cTT && (h5 = e5.fontMetrics(t5).b, r3(i6) && (i6 !== (this.oldRotation || 0) || n5 !== this.oldAlign) && this.setSpanRotation(i6, p3, h5), this.getSpanCorrection(!r3(i6) && this.textPxLength || t5.offsetWidth, h5, p3)), o4(t5, { left: d3 + (this.xCorr || 0) + "px", top: c3 + (this.yCorr || 0) + "px" }), this.cTT = s5, this.oldRotation = i6, this.oldAlign = n5;
              }
            }
            setSpanRotation(t5, e5, i6) {
              o4(this.element, { transform: `rotate(${t5}deg)`, transformOrigin: `${100 * e5}% ${i6}px` });
            }
          }
          return l3;
        }), i4(e3, "Core/Renderer/HTML/HTMLRenderer.js", [e3["Core/Renderer/HTML/AST.js"], e3["Core/Globals.js"], e3["Core/Renderer/SVG/SVGElement.js"], e3["Core/Renderer/SVG/SVGRenderer.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3, o4) {
          let { composed: r3 } = e4, { attr: n4, createElement: a4, extend: h3, pick: l3, pushUnique: d3 } = o4;
          class c3 extends s3 {
            static compose(t5) {
              if (d3(r3, this.compose)) {
                let e5 = c3.prototype, i6 = t5.prototype;
                i6.html = e5.html;
              }
              return t5;
            }
            html(e5, s4, o5) {
              let r4 = this.createElement("span"), d4 = r4.element, c4 = r4.renderer, p3 = function(t5, e6) {
                ["opacity", "visibility"].forEach(function(s5) {
                  t5[s5 + "Setter"] = function(o6, r5, n5) {
                    let a5 = t5.div ? t5.div.style : e6;
                    i5.prototype[s5 + "Setter"].call(this, o6, r5, n5), a5 && (a5[r5] = o6);
                  };
                }), t5.addedSetters = true;
              };
              return r4.textSetter = function(e6) {
                e6 !== this.textStr && (delete this.bBox, delete this.oldTextWidth, t4.setElementHTML(this.element, l3(e6, "")), this.textStr = e6, r4.doTransform = true);
              }, p3(r4, r4.element.style), r4.xSetter = r4.ySetter = r4.alignSetter = r4.rotationSetter = function(t5, e6) {
                "align" === e6 ? r4.alignValue = r4.textAlign = t5 : r4[e6] = t5, r4.doTransform = true;
              }, r4.afterSetters = function() {
                this.doTransform && (this.htmlUpdateTransform(), this.doTransform = false);
              }, r4.attr({ text: e5, x: Math.round(s4), y: Math.round(o5) }).css({ position: "absolute" }), c4.styledMode || r4.css({ fontFamily: this.style.fontFamily, fontSize: this.style.fontSize }), d4.style.whiteSpace = "nowrap", r4.css = r4.htmlCss, r4.add = function(t5) {
                let e6, i6;
                let s5 = c4.box.parentNode, o6 = [];
                if (this.parentGroup = t5, t5) {
                  if (!(e6 = t5.div)) {
                    for (i6 = t5; i6; )
                      o6.push(i6), i6 = i6.parentGroup;
                    o6.reverse().forEach(function(t6) {
                      var i7;
                      let l4 = n4(t6.element, "class"), d5 = t6.css;
                      function c5(e7, i8) {
                        t6[i8] = e7, "translateX" === i8 ? g3.left = e7 + "px" : g3.top = e7 + "px", t6.doTransform = true;
                      }
                      let u4 = t6.styles || {};
                      e6 = t6.div = t6.div || a4("div", l4 ? { className: l4 } : void 0, { position: "absolute", left: (t6.translateX || 0) + "px", top: (t6.translateY || 0) + "px", display: t6.display, opacity: t6.opacity, visibility: t6.visibility }, e6 || s5);
                      let g3 = e6.style;
                      h3(t6, { classSetter: (i7 = e6, function(t7) {
                        this.element.setAttribute("class", t7), i7.className = t7;
                      }), css: function(e7) {
                        return d5.call(t6, e7), ["cursor", "pointerEvents"].forEach((t7) => {
                          e7[t7] && (g3[t7] = e7[t7]);
                        }), t6;
                      }, on: function() {
                        return o6[0].div && r4.on.apply({ element: o6[0].div, onEvents: t6.onEvents }, arguments), t6;
                      }, translateXSetter: c5, translateYSetter: c5 }), t6.addedSetters || p3(t6), t6.css(u4);
                    });
                  }
                } else
                  e6 = s5;
                return e6.appendChild(d4), r4.added = true, r4.alignOnAdd && r4.htmlUpdateTransform(), r4;
              }, r4;
            }
          }
          return c3;
        }), i4(e3, "Core/Axis/AxisDefaults.js", [], function() {
          var t4, e4;
          return (e4 = t4 || (t4 = {})).xAxis = { alignTicks: true, allowDecimals: void 0, panningEnabled: true, zIndex: 2, zoomEnabled: true, dateTimeLabelFormats: { millisecond: { main: "%H:%M:%S.%L", range: false }, second: { main: "%H:%M:%S", range: false }, minute: { main: "%H:%M", range: false }, hour: { main: "%H:%M", range: false }, day: { main: "%e %b" }, week: { main: "%e %b" }, month: { main: "%b '%y" }, year: { main: "%Y" } }, endOnTick: false, gridLineDashStyle: "Solid", gridZIndex: 1, labels: { autoRotationLimit: 80, distance: 15, enabled: true, indentation: 10, overflow: "justify", padding: 5, reserveSpace: void 0, rotation: void 0, staggerLines: 0, step: 0, useHTML: false, zIndex: 7, style: { color: "#333333", cursor: "default", fontSize: "0.8em" } }, maxPadding: 0.01, minorGridLineDashStyle: "Solid", minorTickLength: 2, minorTickPosition: "outside", minorTicksPerMajor: 5, minPadding: 0.01, offset: void 0, reversed: void 0, reversedStacks: false, showEmpty: true, showFirstLabel: true, showLastLabel: true, startOfWeek: 1, startOnTick: false, tickLength: 10, tickPixelInterval: 100, tickmarkPlacement: "between", tickPosition: "outside", title: { align: "middle", useHTML: false, x: 0, y: 0, style: { color: "#666666", fontSize: "0.8em" } }, type: "linear", uniqueNames: true, visible: true, minorGridLineColor: "#f2f2f2", minorGridLineWidth: 1, minorTickColor: "#999999", lineColor: "#333333", lineWidth: 1, gridLineColor: "#e6e6e6", gridLineWidth: void 0, tickColor: "#333333" }, e4.yAxis = { reversedStacks: true, endOnTick: true, maxPadding: 0.05, minPadding: 0.05, tickPixelInterval: 72, showLastLabel: true, labels: { x: void 0 }, startOnTick: true, title: { text: "Values" }, stackLabels: { animation: {}, allowOverlap: false, enabled: false, crop: true, overflow: "justify", formatter: function() {
            let { numberFormatter: t5 } = this.axis.chart;
            return t5(this.total || 0, -1);
          }, style: { color: "#000000", fontSize: "0.7em", fontWeight: "bold", textOutline: "1px contrast" } }, gridLineWidth: 1, lineWidth: 0 }, t4;
        }), i4(e3, "Core/Foundation.js", [e3["Core/Utilities.js"]], function(t4) {
          var e4;
          let { addEvent: i5, isFunction: s3, objectEach: o4, removeEvent: r3 } = t4;
          return (e4 || (e4 = {})).registerEventOptions = function(t5, e5) {
            t5.eventOptions = t5.eventOptions || {}, o4(e5.events, function(e6, o5) {
              t5.eventOptions[o5] !== e6 && (t5.eventOptions[o5] && (r3(t5, o5, t5.eventOptions[o5]), delete t5.eventOptions[o5]), s3(e6) && (t5.eventOptions[o5] = e6, i5(t5, o5, e6, { order: 0 })));
            });
          }, e4;
        }), i4(e3, "Core/Axis/Tick.js", [e3["Core/Templating.js"], e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          let { deg2rad: s3 } = e4, { clamp: o4, correctFloat: r3, defined: n4, destroyObjectProperties: a4, extend: h3, fireEvent: l3, isNumber: d3, merge: c3, objectEach: p3, pick: u4 } = i5;
          return class {
            constructor(t5, e5, i6, s4, o5) {
              this.isNew = true, this.isNewLabel = true, this.axis = t5, this.pos = e5, this.type = i6 || "", this.parameters = o5 || {}, this.tickmarkOffset = this.parameters.tickmarkOffset, this.options = this.parameters.options, l3(this, "init"), i6 || s4 || this.addLabel();
            }
            addLabel() {
              let e5 = this, i6 = e5.axis, s4 = i6.options, o5 = i6.chart, a5 = i6.categories, c4 = i6.logarithmic, p4 = i6.names, g3 = e5.pos, f3 = u4(e5.options && e5.options.labels, s4.labels), m3 = i6.tickPositions, x3 = g3 === m3[0], y3 = g3 === m3[m3.length - 1], b3 = (!f3.step || 1 === f3.step) && 1 === i6.tickInterval, v3 = m3.info, S3 = e5.label, k3, M2, C3, w3 = this.parameters.category || (a5 ? u4(a5[g3], p4[g3], g3) : g3);
              c4 && d3(w3) && (w3 = r3(c4.lin2log(w3))), i6.dateTime && (v3 ? k3 = (M2 = o5.time.resolveDTLFormat(s4.dateTimeLabelFormats[!s4.grid && v3.higherRanks[g3] || v3.unitName])).main : d3(w3) && (k3 = i6.dateTime.getXDateFormat(w3, s4.dateTimeLabelFormats || {}))), e5.isFirst = x3, e5.isLast = y3;
              let T2 = { axis: i6, chart: o5, dateTimeLabelFormat: k3, isFirst: x3, isLast: y3, pos: g3, tick: e5, tickPositionInfo: v3, value: w3 };
              l3(this, "labelFormat", T2);
              let A2 = (e6) => f3.formatter ? f3.formatter.call(e6, e6) : f3.format ? (e6.text = i6.defaultLabelFormatter.call(e6, e6), t4.format(f3.format, e6, o5)) : i6.defaultLabelFormatter.call(e6, e6), P2 = A2.call(T2, T2), L2 = M2 && M2.list;
              L2 ? e5.shortenLabel = function() {
                for (C3 = 0; C3 < L2.length; C3++)
                  if (h3(T2, { dateTimeLabelFormat: L2[C3] }), S3.attr({ text: A2.call(T2, T2) }), S3.getBBox().width < i6.getSlotWidth(e5) - 2 * f3.padding)
                    return;
                S3.attr({ text: "" });
              } : e5.shortenLabel = void 0, b3 && i6._addedPlotLB && e5.moveLabel(P2, f3), n4(S3) || e5.movedLabel ? S3 && S3.textStr !== P2 && !b3 && (!S3.textWidth || f3.style.width || S3.styles.width || S3.css({ width: null }), S3.attr({ text: P2 }), S3.textPxLength = S3.getBBox().width) : (e5.label = S3 = e5.createLabel(P2, f3), e5.rotation = 0);
            }
            createLabel(t5, e5, i6) {
              let s4 = this.axis, o5 = s4.chart, r4 = n4(t5) && e5.enabled ? o5.renderer.text(t5, i6?.x, i6?.y, e5.useHTML).add(s4.labelGroup) : void 0;
              return r4 && (o5.styledMode || r4.css(c3(e5.style)), r4.textPxLength = r4.getBBox().width), r4;
            }
            destroy() {
              a4(this, this.axis);
            }
            getPosition(t5, e5, i6, s4) {
              let n5 = this.axis, a5 = n5.chart, h4 = s4 && a5.oldChartHeight || a5.chartHeight, d4 = { x: t5 ? r3(n5.translate(e5 + i6, void 0, void 0, s4) + n5.transB) : n5.left + n5.offset + (n5.opposite ? (s4 && a5.oldChartWidth || a5.chartWidth) - n5.right - n5.left : 0), y: t5 ? h4 - n5.bottom + n5.offset - (n5.opposite ? n5.height : 0) : r3(h4 - n5.translate(e5 + i6, void 0, void 0, s4) - n5.transB) };
              return d4.y = o4(d4.y, -1e5, 1e5), l3(this, "afterGetPosition", { pos: d4 }), d4;
            }
            getLabelPosition(t5, e5, i6, o5, r4, a5, h4, d4) {
              let c4, p4;
              let g3 = this.axis, f3 = g3.transA, m3 = g3.isLinked && g3.linkedParent ? g3.linkedParent.reversed : g3.reversed, x3 = g3.staggerLines, y3 = g3.tickRotCorr || { x: 0, y: 0 }, b3 = o5 || g3.reserveSpaceDefault ? 0 : -g3.labelOffset * ("center" === g3.labelAlign ? 0.5 : 1), v3 = r4.distance, S3 = {};
              return c4 = 0 === g3.side ? i6.rotation ? -v3 : -i6.getBBox().height : 2 === g3.side ? y3.y + v3 : Math.cos(i6.rotation * s3) * (y3.y - i6.getBBox(false, 0).height / 2), n4(r4.y) && (c4 = 0 === g3.side && g3.horiz ? r4.y + c4 : r4.y), t5 = t5 + u4(r4.x, [0, 1, 0, -1][g3.side] * v3) + b3 + y3.x - (a5 && o5 ? a5 * f3 * (m3 ? -1 : 1) : 0), e5 = e5 + c4 - (a5 && !o5 ? a5 * f3 * (m3 ? 1 : -1) : 0), x3 && (p4 = h4 / (d4 || 1) % x3, g3.opposite && (p4 = x3 - p4 - 1), e5 += p4 * (g3.labelOffset / x3)), S3.x = t5, S3.y = Math.round(e5), l3(this, "afterGetLabelPosition", { pos: S3, tickmarkOffset: a5, index: h4 }), S3;
            }
            getLabelSize() {
              return this.label ? this.label.getBBox()[this.axis.horiz ? "height" : "width"] : 0;
            }
            getMarkPath(t5, e5, i6, s4, o5, r4) {
              return r4.crispLine([["M", t5, e5], ["L", t5 + (o5 ? 0 : -i6), e5 + (o5 ? i6 : 0)]], s4);
            }
            handleOverflow(t5) {
              let e5 = this.axis, i6 = e5.options.labels, o5 = t5.x, r4 = e5.chart.chartWidth, n5 = e5.chart.spacing, a5 = u4(e5.labelLeft, Math.min(e5.pos, n5[3])), h4 = u4(e5.labelRight, Math.max(e5.isRadial ? 0 : e5.pos + e5.len, r4 - n5[1])), l4 = this.label, d4 = this.rotation, c4 = { left: 0, center: 0.5, right: 1 }[e5.labelAlign || l4.attr("align")], p4 = l4.getBBox().width, g3 = e5.getSlotWidth(this), f3 = {}, m3 = g3, x3 = 1, y3;
              d4 || "justify" !== i6.overflow ? d4 < 0 && o5 - c4 * p4 < a5 ? y3 = Math.round(o5 / Math.cos(d4 * s3) - a5) : d4 > 0 && o5 + c4 * p4 > h4 && (y3 = Math.round((r4 - o5) / Math.cos(d4 * s3))) : (o5 - c4 * p4 < a5 ? m3 = t5.x + m3 * (1 - c4) - a5 : o5 + (1 - c4) * p4 > h4 && (m3 = h4 - t5.x + m3 * c4, x3 = -1), (m3 = Math.min(g3, m3)) < g3 && "center" === e5.labelAlign && (t5.x += x3 * (g3 - m3 - c4 * (g3 - Math.min(p4, m3)))), (p4 > m3 || e5.autoRotation && (l4.styles || {}).width) && (y3 = m3)), y3 && (this.shortenLabel ? this.shortenLabel() : (f3.width = Math.floor(y3) + "px", (i6.style || {}).textOverflow || (f3.textOverflow = "ellipsis"), l4.css(f3)));
            }
            moveLabel(t5, e5) {
              let i6 = this, s4 = i6.label, o5 = i6.axis, r4 = false, n5;
              s4 && s4.textStr === t5 ? (i6.movedLabel = s4, r4 = true, delete i6.label) : p3(o5.ticks, function(e6) {
                r4 || e6.isNew || e6 === i6 || !e6.label || e6.label.textStr !== t5 || (i6.movedLabel = e6.label, r4 = true, e6.labelPos = i6.movedLabel.xy, delete e6.label);
              }), !r4 && (i6.labelPos || s4) && (n5 = i6.labelPos || s4.xy, i6.movedLabel = i6.createLabel(t5, e5, n5), i6.movedLabel && i6.movedLabel.attr({ opacity: 0 }));
            }
            render(t5, e5, i6) {
              let s4 = this.axis, o5 = s4.horiz, r4 = this.pos, n5 = u4(this.tickmarkOffset, s4.tickmarkOffset), a5 = this.getPosition(o5, r4, n5, e5), h4 = a5.x, d4 = a5.y, c4 = o5 && h4 === s4.pos + s4.len || !o5 && d4 === s4.pos ? -1 : 1, p4 = u4(i6, this.label && this.label.newOpacity, 1);
              i6 = u4(i6, 1), this.isActive = true, this.renderGridLine(e5, i6, c4), this.renderMark(a5, i6, c4), this.renderLabel(a5, e5, p4, t5), this.isNew = false, l3(this, "afterRender");
            }
            renderGridLine(t5, e5, i6) {
              let s4 = this.axis, o5 = s4.options, r4 = {}, n5 = this.pos, a5 = this.type, h4 = u4(this.tickmarkOffset, s4.tickmarkOffset), l4 = s4.chart.renderer, d4 = this.gridLine, c4, p4 = o5.gridLineWidth, g3 = o5.gridLineColor, f3 = o5.gridLineDashStyle;
              "minor" === this.type && (p4 = o5.minorGridLineWidth, g3 = o5.minorGridLineColor, f3 = o5.minorGridLineDashStyle), d4 || (s4.chart.styledMode || (r4.stroke = g3, r4["stroke-width"] = p4 || 0, r4.dashstyle = f3), a5 || (r4.zIndex = 1), t5 && (e5 = 0), this.gridLine = d4 = l4.path().attr(r4).addClass("highcharts-" + (a5 ? a5 + "-" : "") + "grid-line").add(s4.gridGroup)), d4 && (c4 = s4.getPlotLinePath({ value: n5 + h4, lineWidth: d4.strokeWidth() * i6, force: "pass", old: t5, acrossPanes: false })) && d4[t5 || this.isNew ? "attr" : "animate"]({ d: c4, opacity: e5 });
            }
            renderMark(t5, e5, i6) {
              let s4 = this.axis, o5 = s4.options, r4 = s4.chart.renderer, n5 = this.type, a5 = s4.tickSize(n5 ? n5 + "Tick" : "tick"), h4 = t5.x, l4 = t5.y, d4 = u4(o5["minor" !== n5 ? "tickWidth" : "minorTickWidth"], !n5 && s4.isXAxis ? 1 : 0), c4 = o5["minor" !== n5 ? "tickColor" : "minorTickColor"], p4 = this.mark, g3 = !p4;
              a5 && (s4.opposite && (a5[0] = -a5[0]), p4 || (this.mark = p4 = r4.path().addClass("highcharts-" + (n5 ? n5 + "-" : "") + "tick").add(s4.axisGroup), s4.chart.styledMode || p4.attr({ stroke: c4, "stroke-width": d4 })), p4[g3 ? "attr" : "animate"]({ d: this.getMarkPath(h4, l4, a5[0], p4.strokeWidth() * i6, s4.horiz, r4), opacity: e5 }));
            }
            renderLabel(t5, e5, i6, s4) {
              let o5 = this.axis, r4 = o5.horiz, n5 = o5.options, a5 = this.label, h4 = n5.labels, l4 = h4.step, c4 = u4(this.tickmarkOffset, o5.tickmarkOffset), p4 = t5.x, g3 = t5.y, f3 = true;
              a5 && d3(p4) && (a5.xy = t5 = this.getLabelPosition(p4, g3, a5, r4, h4, c4, s4, l4), (!this.isFirst || this.isLast || n5.showFirstLabel) && (!this.isLast || this.isFirst || n5.showLastLabel) ? !r4 || h4.step || h4.rotation || e5 || 0 === i6 || this.handleOverflow(t5) : f3 = false, l4 && s4 % l4 && (f3 = false), f3 && d3(t5.y) ? (t5.opacity = i6, a5[this.isNewLabel ? "attr" : "animate"](t5).show(true), this.isNewLabel = false) : (a5.hide(), this.isNewLabel = true));
            }
            replaceMovedLabel() {
              let t5 = this.label, e5 = this.axis;
              t5 && !this.isNew && (t5.animate({ opacity: 0 }, void 0, t5.destroy), delete this.label), e5.isDirty = true, this.label = this.movedLabel, delete this.movedLabel;
            }
          };
        }), i4(e3, "Core/Axis/Axis.js", [e3["Core/Animation/AnimationUtilities.js"], e3["Core/Axis/AxisDefaults.js"], e3["Core/Color/Color.js"], e3["Core/Defaults.js"], e3["Core/Foundation.js"], e3["Core/Globals.js"], e3["Core/Axis/Tick.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3, o4, r3, n4, a4) {
          let { animObject: h3 } = t4, { xAxis: l3, yAxis: d3 } = e4, { defaultOptions: c3 } = s3, { registerEventOptions: p3 } = o4, { deg2rad: u4 } = r3, { arrayMax: g3, arrayMin: f3, clamp: m3, correctFloat: x3, defined: y3, destroyObjectProperties: b3, erase: v3, error: S3, extend: k3, fireEvent: M2, getClosestDistance: C3, insertItem: w3, isArray: T2, isNumber: A2, isString: P2, merge: L2, normalizeTickInterval: O2, objectEach: D2, pick: E, relativeLength: j2, removeEvent: I2, splat: B, syncTimeout: R } = a4, z2 = (t5, e5) => O2(e5, void 0, void 0, E(t5.options.allowDecimals, e5 < 0.5 || void 0 !== t5.tickAmount), !!t5.tickAmount);
          k3(c3, { xAxis: l3, yAxis: L2(l3, d3) });
          class N2 {
            constructor(t5, e5, i6) {
              this.init(t5, e5, i6);
            }
            init(t5, e5, i6 = this.coll) {
              let s4 = "xAxis" === i6, o5 = this.isZAxis || (t5.inverted ? !s4 : s4);
              this.chart = t5, this.horiz = o5, this.isXAxis = s4, this.coll = i6, M2(this, "init", { userOptions: e5 }), this.opposite = E(e5.opposite, this.opposite), this.side = E(e5.side, this.side, o5 ? this.opposite ? 0 : 2 : this.opposite ? 1 : 3), this.setOptions(e5);
              let r4 = this.options, n5 = r4.labels, a5 = r4.type;
              this.userOptions = e5, this.minPixelPadding = 0, this.reversed = E(r4.reversed, this.reversed), this.visible = r4.visible, this.zoomEnabled = r4.zoomEnabled, this.hasNames = "category" === a5 || true === r4.categories, this.categories = T2(r4.categories) && r4.categories || (this.hasNames ? [] : void 0), this.names || (this.names = [], this.names.keys = {}), this.plotLinesAndBandsGroups = {}, this.positiveValuesOnly = !!this.logarithmic, this.isLinked = y3(r4.linkedTo), this.ticks = {}, this.labelEdge = [], this.minorTicks = {}, this.plotLinesAndBands = [], this.alternateBands = {}, this.len = 0, this.minRange = this.userMinRange = r4.minRange || r4.maxZoom, this.range = r4.range, this.offset = r4.offset || 0, this.max = void 0, this.min = void 0;
              let h4 = E(r4.crosshair, B(t5.options.tooltip.crosshairs)[s4 ? 0 : 1]);
              this.crosshair = true === h4 ? {} : h4, -1 === t5.axes.indexOf(this) && (s4 ? t5.axes.splice(t5.xAxis.length, 0, this) : t5.axes.push(this), w3(this, t5[this.coll])), t5.orderItems(this.coll), this.series = this.series || [], t5.inverted && !this.isZAxis && s4 && !y3(this.reversed) && (this.reversed = true), this.labelRotation = A2(n5.rotation) ? n5.rotation : void 0, p3(this, r4), M2(this, "afterInit");
            }
            setOptions(t5) {
              let e5 = this.horiz ? { labels: { autoRotation: [-45] }, margin: 15 } : { title: { rotation: 90 * this.side } };
              this.options = L2(e5, c3[this.coll], t5), M2(this, "afterSetOptions", { userOptions: t5 });
            }
            defaultLabelFormatter(t5) {
              let e5 = this.axis, i6 = this.chart, { numberFormatter: s4 } = i6, o5 = A2(this.value) ? this.value : NaN, r4 = e5.chart.time, n5 = e5.categories, a5 = this.dateTimeLabelFormat, h4 = c3.lang, l4 = h4.numericSymbols, d4 = h4.numericSymbolMagnitude || 1e3, p4 = e5.logarithmic ? Math.abs(o5) : e5.tickInterval, u5 = l4 && l4.length, g4, f4;
              if (n5)
                f4 = `${this.value}`;
              else if (a5)
                f4 = r4.dateFormat(a5, o5);
              else if (u5 && l4 && p4 >= 1e3)
                for (; u5-- && void 0 === f4; )
                  p4 >= (g4 = Math.pow(d4, u5 + 1)) && 10 * o5 % g4 == 0 && null !== l4[u5] && 0 !== o5 && (f4 = s4(o5 / g4, -1) + l4[u5]);
              return void 0 === f4 && (f4 = Math.abs(o5) >= 1e4 ? s4(o5, -1) : s4(o5, -1, void 0, "")), f4;
            }
            getSeriesExtremes() {
              let t5;
              let e5 = this;
              M2(this, "getSeriesExtremes", null, function() {
                e5.hasVisibleSeries = false, e5.dataMin = e5.dataMax = e5.threshold = void 0, e5.softThreshold = !e5.isXAxis, e5.series.forEach((i6) => {
                  if (i6.reserveSpace()) {
                    let s4 = i6.options, o5, r4 = s4.threshold, n5, a5;
                    if (e5.hasVisibleSeries = true, e5.positiveValuesOnly && 0 >= (r4 || 0) && (r4 = void 0), e5.isXAxis)
                      (o5 = i6.xData) && o5.length && (o5 = e5.logarithmic ? o5.filter((t6) => t6 > 0) : o5, n5 = (t5 = i6.getXExtremes(o5)).min, a5 = t5.max, A2(n5) || n5 instanceof Date || (o5 = o5.filter(A2), n5 = (t5 = i6.getXExtremes(o5)).min, a5 = t5.max), o5.length && (e5.dataMin = Math.min(E(e5.dataMin, n5), n5), e5.dataMax = Math.max(E(e5.dataMax, a5), a5)));
                    else {
                      let t6 = i6.applyExtremes();
                      A2(t6.dataMin) && (n5 = t6.dataMin, e5.dataMin = Math.min(E(e5.dataMin, n5), n5)), A2(t6.dataMax) && (a5 = t6.dataMax, e5.dataMax = Math.max(E(e5.dataMax, a5), a5)), y3(r4) && (e5.threshold = r4), (!s4.softThreshold || e5.positiveValuesOnly) && (e5.softThreshold = false);
                    }
                  }
                });
              }), M2(this, "afterGetSeriesExtremes");
            }
            translate(t5, e5, i6, s4, o5, r4) {
              let n5 = this.linkedParent || this, a5 = s4 && n5.old ? n5.old.min : n5.min;
              if (!A2(a5))
                return NaN;
              let h4 = n5.minPixelPadding, l4 = (n5.isOrdinal || n5.brokenAxis?.hasBreaks || n5.logarithmic && o5) && n5.lin2val, d4 = 1, c4 = 0, p4 = s4 && n5.old ? n5.old.transA : n5.transA, u5 = 0;
              if (p4 || (p4 = n5.transA), i6 && (d4 *= -1, c4 = n5.len), n5.reversed && (d4 *= -1, c4 -= d4 * (n5.sector || n5.len)), e5)
                u5 = (t5 = t5 * d4 + c4 - h4) / p4 + a5, l4 && (u5 = n5.lin2val(u5));
              else {
                l4 && (t5 = n5.val2lin(t5));
                let e6 = d4 * (t5 - a5) * p4;
                u5 = (n5.isRadial ? e6 : x3(e6)) + c4 + d4 * h4 + (A2(r4) ? p4 * r4 : 0);
              }
              return u5;
            }
            toPixels(t5, e5) {
              return this.translate(t5, false, !this.horiz, void 0, true) + (e5 ? 0 : this.pos);
            }
            toValue(t5, e5) {
              return this.translate(t5 - (e5 ? 0 : this.pos), true, !this.horiz, void 0, true);
            }
            getPlotLinePath(t5) {
              let e5 = this, i6 = e5.chart, s4 = e5.left, o5 = e5.top, r4 = t5.old, n5 = t5.value, a5 = t5.lineWidth, h4 = r4 && i6.oldChartHeight || i6.chartHeight, l4 = r4 && i6.oldChartWidth || i6.chartWidth, d4 = e5.transB, c4 = t5.translatedValue, p4 = t5.force, u5, g4, f4, x4, y4;
              function b4(t6, e6, i7) {
                return "pass" !== p4 && (t6 < e6 || t6 > i7) && (p4 ? t6 = m3(t6, e6, i7) : y4 = true), t6;
              }
              let v4 = { value: n5, lineWidth: a5, old: r4, force: p4, acrossPanes: t5.acrossPanes, translatedValue: c4 };
              return M2(this, "getPlotLinePath", v4, function(t6) {
                u5 = f4 = Math.round((c4 = m3(c4 = E(c4, e5.translate(n5, void 0, void 0, r4)), -1e5, 1e5)) + d4), g4 = x4 = Math.round(h4 - c4 - d4), A2(c4) ? e5.horiz ? (g4 = o5, x4 = h4 - e5.bottom, u5 = f4 = b4(u5, s4, s4 + e5.width)) : (u5 = s4, f4 = l4 - e5.right, g4 = x4 = b4(g4, o5, o5 + e5.height)) : (y4 = true, p4 = false), t6.path = y4 && !p4 ? void 0 : i6.renderer.crispLine([["M", u5, g4], ["L", f4, x4]], a5 || 1);
              }), v4.path;
            }
            getLinearTickPositions(t5, e5, i6) {
              let s4, o5, r4;
              let n5 = x3(Math.floor(e5 / t5) * t5), a5 = x3(Math.ceil(i6 / t5) * t5), h4 = [];
              if (x3(n5 + t5) === n5 && (r4 = 20), this.single)
                return [e5];
              for (s4 = n5; s4 <= a5 && (h4.push(s4), (s4 = x3(s4 + t5, r4)) !== o5); )
                o5 = s4;
              return h4;
            }
            getMinorTickInterval() {
              let { minorTicks: t5, minorTickInterval: e5 } = this.options;
              return true === t5 ? E(e5, "auto") : false !== t5 ? e5 : void 0;
            }
            getMinorTickPositions() {
              let t5 = this.options, e5 = this.tickPositions, i6 = this.minorTickInterval, s4 = this.pointRangePadding || 0, o5 = (this.min || 0) - s4, r4 = (this.max || 0) + s4, n5 = r4 - o5, a5 = [], h4;
              if (n5 && n5 / i6 < this.len / 3) {
                let s5 = this.logarithmic;
                if (s5)
                  this.paddedTicks.forEach(function(t6, e6, o6) {
                    e6 && a5.push.apply(a5, s5.getLogTickPositions(i6, o6[e6 - 1], o6[e6], true));
                  });
                else if (this.dateTime && "auto" === this.getMinorTickInterval())
                  a5 = a5.concat(this.getTimeTicks(this.dateTime.normalizeTimeTickInterval(i6), o5, r4, t5.startOfWeek));
                else
                  for (h4 = o5 + (e5[0] - o5) % i6; h4 <= r4 && h4 !== a5[0]; h4 += i6)
                    a5.push(h4);
              }
              return 0 !== a5.length && this.trimTicks(a5), a5;
            }
            adjustForMinRange() {
              let t5 = this.options, e5 = this.logarithmic, { max: i6, min: s4, minRange: o5 } = this, r4, n5, a5, h4;
              this.isXAxis && void 0 === o5 && !e5 && (o5 = y3(t5.min) || y3(t5.max) || y3(t5.floor) || y3(t5.ceiling) ? null : Math.min(5 * (C3(this.series.map((t6) => (t6.xIncrement ? t6.xData?.slice(0, 2) : t6.xData) || [])) || 0), this.dataMax - this.dataMin)), A2(i6) && A2(s4) && A2(o5) && i6 - s4 < o5 && (n5 = this.dataMax - this.dataMin >= o5, r4 = (o5 - i6 + s4) / 2, a5 = [s4 - r4, E(t5.min, s4 - r4)], n5 && (a5[2] = e5 ? e5.log2lin(this.dataMin) : this.dataMin), h4 = [(s4 = g3(a5)) + o5, E(t5.max, s4 + o5)], n5 && (h4[2] = e5 ? e5.log2lin(this.dataMax) : this.dataMax), (i6 = f3(h4)) - s4 < o5 && (a5[0] = i6 - o5, a5[1] = E(t5.min, i6 - o5), s4 = g3(a5))), this.minRange = o5, this.min = s4, this.max = i6;
            }
            getClosest() {
              let t5, e5;
              if (this.categories)
                e5 = 1;
              else {
                let i6 = [];
                this.series.forEach(function(t6) {
                  let s4 = t6.closestPointRange;
                  t6.xData?.length === 1 ? i6.push(t6.xData[0]) : !t6.noSharedTooltip && y3(s4) && t6.reserveSpace() && (e5 = y3(e5) ? Math.min(e5, s4) : s4);
                }), i6.length && (i6.sort((t6, e6) => t6 - e6), t5 = C3([i6]));
              }
              return t5 && e5 ? Math.min(t5, e5) : t5 || e5;
            }
            nameToX(t5) {
              let e5 = T2(this.options.categories), i6 = e5 ? this.categories : this.names, s4 = t5.options.x, o5;
              return t5.series.requireSorting = false, y3(s4) || (s4 = this.options.uniqueNames && i6 ? e5 ? i6.indexOf(t5.name) : E(i6.keys[t5.name], -1) : t5.series.autoIncrement()), -1 === s4 ? !e5 && i6 && (o5 = i6.length) : o5 = s4, void 0 !== o5 ? (this.names[o5] = t5.name, this.names.keys[t5.name] = o5) : t5.x && (o5 = t5.x), o5;
            }
            updateNames() {
              let t5 = this, e5 = this.names, i6 = e5.length;
              i6 > 0 && (Object.keys(e5.keys).forEach(function(t6) {
                delete e5.keys[t6];
              }), e5.length = 0, this.minRange = this.userMinRange, (this.series || []).forEach((e6) => {
                e6.xIncrement = null, (!e6.points || e6.isDirtyData) && (t5.max = Math.max(t5.max, e6.xData.length - 1), e6.processData(), e6.generatePoints()), e6.data.forEach(function(i7, s4) {
                  let o5;
                  i7?.options && void 0 !== i7.name && void 0 !== (o5 = t5.nameToX(i7)) && o5 !== i7.x && (i7.x = o5, e6.xData[s4] = o5);
                });
              }));
            }
            setAxisTranslation() {
              let t5 = this, e5 = t5.max - t5.min, i6 = t5.linkedParent, s4 = !!t5.categories, o5 = t5.isXAxis, r4 = t5.axisPointRange || 0, n5, a5 = 0, h4 = 0, l4, d4 = t5.transA;
              (o5 || s4 || r4) && (n5 = t5.getClosest(), i6 ? (a5 = i6.minPointOffset, h4 = i6.pointRangePadding) : t5.series.forEach(function(e6) {
                let i7 = s4 ? 1 : o5 ? E(e6.options.pointRange, n5, 0) : t5.axisPointRange || 0, l5 = e6.options.pointPlacement;
                if (r4 = Math.max(r4, i7), !t5.single || s4) {
                  let t6 = e6.is("xrange") ? !o5 : o5;
                  a5 = Math.max(a5, t6 && P2(l5) ? 0 : i7 / 2), h4 = Math.max(h4, t6 && "on" === l5 ? 0 : i7);
                }
              }), l4 = t5.ordinal && t5.ordinal.slope && n5 ? t5.ordinal.slope / n5 : 1, t5.minPointOffset = a5 *= l4, t5.pointRangePadding = h4 *= l4, t5.pointRange = Math.min(r4, t5.single && s4 ? 1 : e5), o5 && n5 && (t5.closestPointRange = n5)), t5.translationSlope = t5.transA = d4 = t5.staticScale || t5.len / (e5 + h4 || 1), t5.transB = t5.horiz ? t5.left : t5.bottom, t5.minPixelPadding = d4 * a5, M2(this, "afterSetAxisTranslation");
            }
            minFromRange() {
              let { max: t5, min: e5 } = this;
              return A2(t5) && A2(e5) && t5 - e5 || void 0;
            }
            setTickInterval(t5) {
              let { categories: e5, chart: i6, dataMax: s4, dataMin: o5, dateTime: r4, isXAxis: n5, logarithmic: a5, options: h4, softThreshold: l4 } = this, d4 = A2(this.threshold) ? this.threshold : void 0, c4 = this.minRange || 0, { ceiling: p4, floor: u5, linkedTo: g4, softMax: f4, softMin: m4 } = h4, b4 = A2(g4) && i6[this.coll]?.[g4], v4 = h4.tickPixelInterval, k4 = h4.maxPadding, C4 = h4.minPadding, w4 = 0, T3, P3 = A2(h4.tickInterval) && h4.tickInterval >= 0 ? h4.tickInterval : void 0, L3, O3, D3, j3;
              if (r4 || e5 || b4 || this.getTickAmount(), D3 = E(this.userMin, h4.min), j3 = E(this.userMax, h4.max), b4 ? (this.linkedParent = b4, T3 = b4.getExtremes(), this.min = E(T3.min, T3.dataMin), this.max = E(T3.max, T3.dataMax), h4.type !== b4.options.type && S3(11, true, i6)) : (l4 && y3(d4) && A2(s4) && A2(o5) && (o5 >= d4 ? (L3 = d4, C4 = 0) : s4 <= d4 && (O3 = d4, k4 = 0)), this.min = E(D3, L3, o5), this.max = E(j3, O3, s4)), A2(this.max) && A2(this.min) && (a5 && (this.positiveValuesOnly && !t5 && 0 >= Math.min(this.min, E(o5, this.min)) && S3(10, true, i6), this.min = x3(a5.log2lin(this.min), 16), this.max = x3(a5.log2lin(this.max), 16)), this.range && A2(o5) && (this.userMin = this.min = D3 = Math.max(o5, this.minFromRange() || 0), this.userMax = j3 = this.max, this.range = void 0)), M2(this, "foundExtremes"), this.adjustForMinRange(), A2(this.min) && A2(this.max)) {
                if (!A2(this.userMin) && A2(m4) && m4 < this.min && (this.min = D3 = m4), !A2(this.userMax) && A2(f4) && f4 > this.max && (this.max = j3 = f4), e5 || this.axisPointRange || this.stacking?.usePercentage || b4 || !(w4 = this.max - this.min) || (!y3(D3) && C4 && (this.min -= w4 * C4), y3(j3) || !k4 || (this.max += w4 * k4)), !A2(this.userMin) && A2(u5) && (this.min = Math.max(this.min, u5)), !A2(this.userMax) && A2(p4) && (this.max = Math.min(this.max, p4)), l4 && A2(o5) && A2(s4)) {
                  let t6 = d4 || 0;
                  !y3(D3) && this.min < t6 && o5 >= t6 ? this.min = h4.minRange ? Math.min(t6, this.max - c4) : t6 : !y3(j3) && this.max > t6 && s4 <= t6 && (this.max = h4.minRange ? Math.max(t6, this.min + c4) : t6);
                }
                !i6.polar && this.min > this.max && (y3(h4.min) ? this.max = this.min : y3(h4.max) && (this.min = this.max)), w4 = this.max - this.min;
              }
              if (this.min !== this.max && A2(this.min) && A2(this.max) ? b4 && !P3 && v4 === b4.options.tickPixelInterval ? this.tickInterval = P3 = b4.tickInterval : this.tickInterval = E(P3, this.tickAmount ? w4 / Math.max(this.tickAmount - 1, 1) : void 0, e5 ? 1 : w4 * v4 / Math.max(this.len, v4)) : this.tickInterval = 1, n5 && !t5) {
                let t6 = this.min !== this.old?.min || this.max !== this.old?.max;
                this.series.forEach(function(e6) {
                  e6.forceCrop = e6.forceCropping?.(), e6.processData(t6);
                }), M2(this, "postProcessData", { hasExtremesChanged: t6 });
              }
              this.setAxisTranslation(), M2(this, "initialAxisTranslation"), this.pointRange && !P3 && (this.tickInterval = Math.max(this.pointRange, this.tickInterval));
              let I3 = E(h4.minTickInterval, r4 && !this.series.some((t6) => t6.noSharedTooltip) ? this.closestPointRange : 0);
              !P3 && this.tickInterval < I3 && (this.tickInterval = I3), r4 || a5 || P3 || (this.tickInterval = z2(this, this.tickInterval)), this.tickAmount || (this.tickInterval = this.unsquish()), this.setTickPositions();
            }
            setTickPositions() {
              let t5 = this.options, e5 = t5.tickPositions, i6 = t5.tickPositioner, s4 = this.getMinorTickInterval(), o5 = this.hasVerticalPanning(), r4 = "colorAxis" === this.coll, n5 = (r4 || !o5) && t5.startOnTick, a5 = (r4 || !o5) && t5.endOnTick, h4 = [], l4;
              if (this.tickmarkOffset = this.categories && "between" === t5.tickmarkPlacement && 1 === this.tickInterval ? 0.5 : 0, this.minorTickInterval = "auto" === s4 && this.tickInterval ? this.tickInterval / t5.minorTicksPerMajor : s4, this.single = this.min === this.max && y3(this.min) && !this.tickAmount && (this.min % 1 == 0 || false !== t5.allowDecimals), e5)
                h4 = e5.slice();
              else if (A2(this.min) && A2(this.max)) {
                if (!this.ordinal?.positions && (this.max - this.min) / this.tickInterval > Math.max(2 * this.len, 200))
                  h4 = [this.min, this.max], S3(19, false, this.chart);
                else if (this.dateTime)
                  h4 = this.getTimeTicks(this.dateTime.normalizeTimeTickInterval(this.tickInterval, t5.units), this.min, this.max, t5.startOfWeek, this.ordinal?.positions, this.closestPointRange, true);
                else if (this.logarithmic)
                  h4 = this.logarithmic.getLogTickPositions(this.tickInterval, this.min, this.max);
                else {
                  let t6 = this.tickInterval, e6 = t6;
                  for (; e6 <= 2 * t6; )
                    if (h4 = this.getLinearTickPositions(this.tickInterval, this.min, this.max), this.tickAmount && h4.length > this.tickAmount)
                      this.tickInterval = z2(this, e6 *= 1.1);
                    else
                      break;
                }
                h4.length > this.len && (h4 = [h4[0], h4[h4.length - 1]])[0] === h4[1] && (h4.length = 1), i6 && (this.tickPositions = h4, (l4 = i6.apply(this, [this.min, this.max])) && (h4 = l4));
              }
              this.tickPositions = h4, this.paddedTicks = h4.slice(0), this.trimTicks(h4, n5, a5), !this.isLinked && A2(this.min) && A2(this.max) && (this.single && h4.length < 2 && !this.categories && !this.series.some((t6) => t6.is("heatmap") && "between" === t6.options.pointPlacement) && (this.min -= 0.5, this.max += 0.5), e5 || l4 || this.adjustTickAmount()), M2(this, "afterSetTickPositions");
            }
            trimTicks(t5, e5, i6) {
              let s4 = t5[0], o5 = t5[t5.length - 1], r4 = !this.isOrdinal && this.minPointOffset || 0;
              if (M2(this, "trimTicks"), !this.isLinked) {
                if (e5 && s4 !== -1 / 0)
                  this.min = s4;
                else
                  for (; this.min - r4 > t5[0]; )
                    t5.shift();
                if (i6)
                  this.max = o5;
                else
                  for (; this.max + r4 < t5[t5.length - 1]; )
                    t5.pop();
                0 === t5.length && y3(s4) && !this.options.tickPositions && t5.push((o5 + s4) / 2);
              }
            }
            alignToOthers() {
              let t5;
              let e5 = this, i6 = [this], s4 = e5.options, o5 = this.chart.options.chart, r4 = "yAxis" === this.coll && o5.alignThresholds, n5 = [];
              if (e5.thresholdAlignment = void 0, (false !== o5.alignTicks && s4.alignTicks || r4) && false !== s4.startOnTick && false !== s4.endOnTick && !e5.logarithmic) {
                let s5 = (t6) => {
                  let { horiz: e6, options: i7 } = t6;
                  return [e6 ? i7.left : i7.top, i7.width, i7.height, i7.pane].join(",");
                }, o6 = s5(this);
                this.chart[this.coll].forEach(function(r5) {
                  let { series: n6 } = r5;
                  n6.length && n6.some((t6) => t6.visible) && r5 !== e5 && s5(r5) === o6 && (t5 = true, i6.push(r5));
                });
              }
              if (t5 && r4) {
                i6.forEach((t7) => {
                  let i7 = t7.getThresholdAlignment(e5);
                  A2(i7) && n5.push(i7);
                });
                let t6 = n5.length > 1 ? n5.reduce((t7, e6) => t7 += e6, 0) / n5.length : void 0;
                i6.forEach((e6) => {
                  e6.thresholdAlignment = t6;
                });
              }
              return t5;
            }
            getThresholdAlignment(t5) {
              if ((!A2(this.dataMin) || this !== t5 && this.series.some((t6) => t6.isDirty || t6.isDirtyData)) && this.getSeriesExtremes(), A2(this.threshold)) {
                let t6 = m3((this.threshold - (this.dataMin || 0)) / ((this.dataMax || 0) - (this.dataMin || 0)), 0, 1);
                return this.options.reversed && (t6 = 1 - t6), t6;
              }
            }
            getTickAmount() {
              let t5 = this.options, e5 = t5.tickPixelInterval, i6 = t5.tickAmount;
              y3(t5.tickInterval) || i6 || !(this.len < e5) || this.isRadial || this.logarithmic || !t5.startOnTick || !t5.endOnTick || (i6 = 2), !i6 && this.alignToOthers() && (i6 = Math.ceil(this.len / e5) + 1), i6 < 4 && (this.finalTickAmt = i6, i6 = 5), this.tickAmount = i6;
            }
            adjustTickAmount() {
              let t5 = this, { finalTickAmt: e5, max: i6, min: s4, options: o5, tickPositions: r4, tickAmount: n5, thresholdAlignment: a5 } = t5, h4 = r4?.length, l4 = E(t5.threshold, t5.softThreshold ? 0 : null), d4, c4, p4 = t5.tickInterval, u5, g4 = () => r4.push(x3(r4[r4.length - 1] + p4)), f4 = () => r4.unshift(x3(r4[0] - p4));
              if (A2(a5) && (u5 = a5 < 0.5 ? Math.ceil(a5 * (n5 - 1)) : Math.floor(a5 * (n5 - 1)), o5.reversed && (u5 = n5 - 1 - u5)), t5.hasData() && A2(s4) && A2(i6)) {
                let a6 = () => {
                  t5.transA *= (h4 - 1) / (n5 - 1), t5.min = o5.startOnTick ? r4[0] : Math.min(s4, r4[0]), t5.max = o5.endOnTick ? r4[r4.length - 1] : Math.max(i6, r4[r4.length - 1]);
                };
                if (A2(u5) && A2(t5.threshold)) {
                  for (; r4[u5] !== l4 || r4.length !== n5 || r4[0] > s4 || r4[r4.length - 1] < i6; ) {
                    for (r4.length = 0, r4.push(t5.threshold); r4.length < n5; )
                      void 0 === r4[u5] || r4[u5] > t5.threshold ? f4() : g4();
                    if (p4 > 8 * t5.tickInterval)
                      break;
                    p4 *= 2;
                  }
                  a6();
                } else if (h4 < n5) {
                  for (; r4.length < n5; )
                    r4.length % 2 || s4 === l4 ? g4() : f4();
                  a6();
                }
                if (y3(e5)) {
                  for (c4 = d4 = r4.length; c4--; )
                    (3 === e5 && c4 % 2 == 1 || e5 <= 2 && c4 > 0 && c4 < d4 - 1) && r4.splice(c4, 1);
                  t5.finalTickAmt = void 0;
                }
              }
            }
            setScale() {
              let { coll: t5, stacking: e5 } = this, i6 = false, s4 = false;
              this.series.forEach((t6) => {
                i6 = i6 || t6.isDirtyData || t6.isDirty, s4 = s4 || t6.xAxis && t6.xAxis.isDirty || false;
              }), this.setAxisSize();
              let o5 = this.len !== (this.old && this.old.len);
              o5 || i6 || s4 || this.isLinked || this.forceRedraw || this.userMin !== (this.old && this.old.userMin) || this.userMax !== (this.old && this.old.userMax) || this.alignToOthers() ? (e5 && "yAxis" === t5 && e5.buildStacks(), this.forceRedraw = false, this.userMinRange || (this.minRange = void 0), this.getSeriesExtremes(), this.setTickInterval(), e5 && "xAxis" === t5 && e5.buildStacks(), this.isDirty || (this.isDirty = o5 || this.min !== this.old?.min || this.max !== this.old?.max)) : e5 && e5.cleanStacks(), i6 && this.panningState && (this.panningState.isDirty = true), M2(this, "afterSetScale");
            }
            setExtremes(t5, e5, i6 = true, s4, o5) {
              let r4 = this, n5 = r4.chart;
              r4.series.forEach((t6) => {
                delete t6.kdTree;
              }), M2(r4, "setExtremes", o5 = k3(o5, { min: t5, max: e5 }), () => {
                r4.userMin = t5, r4.userMax = e5, r4.eventArgs = o5, i6 && n5.redraw(s4);
              });
            }
            zoom(t5, e5) {
              let i6 = this, s4 = this.dataMin, o5 = this.dataMax, r4 = this.options, n5 = Math.min(s4, E(r4.min, s4)), a5 = Math.max(o5, E(r4.max, o5)), h4 = { newMin: t5, newMax: e5 };
              return M2(this, "zoom", h4, function(t6) {
                let e6 = t6.newMin, r5 = t6.newMax;
                (e6 !== i6.min || r5 !== i6.max) && (!i6.allowZoomOutside && (y3(s4) && (e6 < n5 && (e6 = n5), e6 > a5 && (e6 = a5)), y3(o5) && (r5 < n5 && (r5 = n5), r5 > a5 && (r5 = a5))), i6.displayBtn = void 0 !== e6 || void 0 !== r5, i6.setExtremes(e6, r5, false, void 0, { trigger: "zoom" })), t6.zoomed = true;
              }), h4.zoomed;
            }
            setAxisSize() {
              let t5 = this.chart, e5 = this.options, i6 = e5.offsets || [0, 0, 0, 0], s4 = this.horiz, o5 = this.width = Math.round(j2(E(e5.width, t5.plotWidth - i6[3] + i6[1]), t5.plotWidth)), r4 = this.height = Math.round(j2(E(e5.height, t5.plotHeight - i6[0] + i6[2]), t5.plotHeight)), n5 = this.top = Math.round(j2(E(e5.top, t5.plotTop + i6[0]), t5.plotHeight, t5.plotTop)), a5 = this.left = Math.round(j2(E(e5.left, t5.plotLeft + i6[3]), t5.plotWidth, t5.plotLeft));
              this.bottom = t5.chartHeight - r4 - n5, this.right = t5.chartWidth - o5 - a5, this.len = Math.max(s4 ? o5 : r4, 0), this.pos = s4 ? a5 : n5;
            }
            getExtremes() {
              let t5 = this.logarithmic;
              return { min: t5 ? x3(t5.lin2log(this.min)) : this.min, max: t5 ? x3(t5.lin2log(this.max)) : this.max, dataMin: this.dataMin, dataMax: this.dataMax, userMin: this.userMin, userMax: this.userMax };
            }
            getThreshold(t5) {
              let e5 = this.logarithmic, i6 = e5 ? e5.lin2log(this.min) : this.min, s4 = e5 ? e5.lin2log(this.max) : this.max;
              return null === t5 || t5 === -1 / 0 ? t5 = i6 : t5 === 1 / 0 ? t5 = s4 : i6 > t5 ? t5 = i6 : s4 < t5 && (t5 = s4), this.translate(t5, 0, 1, 0, 1);
            }
            autoLabelAlign(t5) {
              let e5 = (E(t5, 0) - 90 * this.side + 720) % 360, i6 = { align: "center" };
              return M2(this, "autoLabelAlign", i6, function(t6) {
                e5 > 15 && e5 < 165 ? t6.align = "right" : e5 > 195 && e5 < 345 && (t6.align = "left");
              }), i6.align;
            }
            tickSize(t5) {
              let e5 = this.options, i6 = E(e5["tick" === t5 ? "tickWidth" : "minorTickWidth"], "tick" === t5 && this.isXAxis && !this.categories ? 1 : 0), s4 = e5["tick" === t5 ? "tickLength" : "minorTickLength"], o5;
              i6 && s4 && ("inside" === e5[t5 + "Position"] && (s4 = -s4), o5 = [s4, i6]);
              let r4 = { tickSize: o5 };
              return M2(this, "afterTickSize", r4), r4.tickSize;
            }
            labelMetrics() {
              let t5 = this.chart.renderer, e5 = this.ticks, i6 = e5[Object.keys(e5)[0]] || {};
              return this.chart.renderer.fontMetrics(i6.label || i6.movedLabel || t5.box);
            }
            unsquish() {
              let t5 = this.options.labels, e5 = this.horiz, i6 = this.tickInterval, s4 = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / i6), o5 = t5.rotation, r4 = this.labelMetrics().h, n5 = Math.max(this.max - this.min, 0), a5 = function(t6) {
                let e6 = t6 / (s4 || 1);
                return (e6 = e6 > 1 ? Math.ceil(e6) : 1) * i6 > n5 && t6 !== 1 / 0 && s4 !== 1 / 0 && n5 && (e6 = Math.ceil(n5 / i6)), x3(e6 * i6);
              }, h4 = i6, l4, d4 = Number.MAX_VALUE, c4;
              if (e5) {
                if (!t5.staggerLines && (A2(o5) ? c4 = [o5] : s4 < t5.autoRotationLimit && (c4 = t5.autoRotation)), c4) {
                  let t6, e6;
                  for (let i7 of c4)
                    (i7 === o5 || i7 && i7 >= -90 && i7 <= 90) && (e6 = (t6 = a5(Math.abs(r4 / Math.sin(u4 * i7)))) + Math.abs(i7 / 360)) < d4 && (d4 = e6, l4 = i7, h4 = t6);
                }
              } else
                h4 = a5(0.75 * r4);
              return this.autoRotation = c4, this.labelRotation = E(l4, A2(o5) ? o5 : 0), t5.step ? i6 : h4;
            }
            getSlotWidth(t5) {
              let e5 = this.chart, i6 = this.horiz, s4 = this.options.labels, o5 = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1), r4 = e5.margin[3];
              if (t5 && A2(t5.slotWidth))
                return t5.slotWidth;
              if (i6 && s4.step < 2)
                return s4.rotation ? 0 : (this.staggerLines || 1) * this.len / o5;
              if (!i6) {
                let t6 = s4.style.width;
                if (void 0 !== t6)
                  return parseInt(String(t6), 10);
                if (r4)
                  return r4 - e5.spacing[3];
              }
              return 0.33 * e5.chartWidth;
            }
            renderUnsquish() {
              let t5 = this.chart, e5 = t5.renderer, i6 = this.tickPositions, s4 = this.ticks, o5 = this.options.labels, r4 = o5.style, n5 = this.horiz, a5 = this.getSlotWidth(), h4 = Math.max(1, Math.round(a5 - 2 * o5.padding)), l4 = {}, d4 = this.labelMetrics(), c4 = r4.textOverflow, p4, u5, g4 = 0, f4, m4;
              if (P2(o5.rotation) || (l4.rotation = o5.rotation || 0), i6.forEach(function(t6) {
                let e6 = s4[t6];
                e6.movedLabel && e6.replaceMovedLabel(), e6 && e6.label && e6.label.textPxLength > g4 && (g4 = e6.label.textPxLength);
              }), this.maxLabelLength = g4, this.autoRotation)
                g4 > h4 && g4 > d4.h ? l4.rotation = this.labelRotation : this.labelRotation = 0;
              else if (a5 && (p4 = h4, !c4))
                for (u5 = "clip", m4 = i6.length; !n5 && m4--; )
                  (f4 = s4[i6[m4]].label) && (f4.styles && "ellipsis" === f4.styles.textOverflow ? f4.css({ textOverflow: "clip" }) : f4.textPxLength > a5 && f4.css({ width: a5 + "px" }), f4.getBBox().height > this.len / i6.length - (d4.h - d4.f) && (f4.specificTextOverflow = "ellipsis"));
              l4.rotation && (p4 = g4 > 0.5 * t5.chartHeight ? 0.33 * t5.chartHeight : g4, c4 || (u5 = "ellipsis")), this.labelAlign = o5.align || this.autoLabelAlign(this.labelRotation), this.labelAlign && (l4.align = this.labelAlign), i6.forEach(function(t6) {
                let e6 = s4[t6], i7 = e6 && e6.label, o6 = r4.width, n6 = {};
                i7 && (i7.attr(l4), e6.shortenLabel ? e6.shortenLabel() : p4 && !o6 && "nowrap" !== r4.whiteSpace && (p4 < i7.textPxLength || "SPAN" === i7.element.tagName) ? (n6.width = p4 + "px", c4 || (n6.textOverflow = i7.specificTextOverflow || u5), i7.css(n6)) : i7.styles && i7.styles.width && !n6.width && !o6 && i7.css({ width: null }), delete i7.specificTextOverflow, e6.rotation = l4.rotation);
              }, this), this.tickRotCorr = e5.rotCorr(d4.b, this.labelRotation || 0, 0 !== this.side);
            }
            hasData() {
              return this.series.some(function(t5) {
                return t5.hasData();
              }) || this.options.showEmpty && y3(this.min) && y3(this.max);
            }
            addTitle(t5) {
              let e5;
              let i6 = this.chart.renderer, s4 = this.horiz, o5 = this.opposite, r4 = this.options, n5 = r4.title, a5 = this.chart.styledMode;
              this.axisTitle || ((e5 = n5.textAlign) || (e5 = (s4 ? { low: "left", middle: "center", high: "right" } : { low: o5 ? "right" : "left", middle: "center", high: o5 ? "left" : "right" })[n5.align]), this.axisTitle = i6.text(n5.text || "", 0, 0, n5.useHTML).attr({ zIndex: 7, rotation: n5.rotation || 0, align: e5 }).addClass("highcharts-axis-title"), a5 || this.axisTitle.css(L2(n5.style)), this.axisTitle.add(this.axisGroup), this.axisTitle.isNew = true), a5 || n5.style.width || this.isRadial || this.axisTitle.css({ width: this.len + "px" }), this.axisTitle[t5 ? "show" : "hide"](t5);
            }
            generateTick(t5) {
              let e5 = this.ticks;
              e5[t5] ? e5[t5].addLabel() : e5[t5] = new n4(this, t5);
            }
            createGroups() {
              let { axisParent: t5, chart: e5, coll: i6, options: s4 } = this, o5 = e5.renderer, r4 = (e6, r5, n5) => o5.g(e6).attr({ zIndex: n5 }).addClass(`highcharts-${i6.toLowerCase()}${r5} ` + (this.isRadial ? `highcharts-radial-axis${r5} ` : "") + (s4.className || "")).add(t5);
              this.axisGroup || (this.gridGroup = r4("grid", "-grid", s4.gridZIndex), this.axisGroup = r4("axis", "", s4.zIndex), this.labelGroup = r4("axis-labels", "-labels", s4.labels.zIndex));
            }
            getOffset() {
              let t5 = this, { chart: e5, horiz: i6, options: s4, side: o5, ticks: r4, tickPositions: n5, coll: a5 } = t5, h4 = e5.inverted && !t5.isZAxis ? [1, 0, 3, 2][o5] : o5, l4 = t5.hasData(), d4 = s4.title, c4 = s4.labels, p4 = A2(s4.crossing), u5 = e5.axisOffset, g4 = e5.clipOffset, f4 = [-1, 1, 1, -1][o5], m4, x4 = 0, b4, v4 = 0, S4 = 0, k4, C4;
              if (t5.showAxis = m4 = l4 || s4.showEmpty, t5.staggerLines = t5.horiz && c4.staggerLines || void 0, t5.createGroups(), l4 || t5.isLinked ? (n5.forEach(function(e6) {
                t5.generateTick(e6);
              }), t5.renderUnsquish(), t5.reserveSpaceDefault = 0 === o5 || 2 === o5 || { 1: "left", 3: "right" }[o5] === t5.labelAlign, E(c4.reserveSpace, !p4 && null, "center" === t5.labelAlign || null, t5.reserveSpaceDefault) && n5.forEach(function(t6) {
                S4 = Math.max(r4[t6].getLabelSize(), S4);
              }), t5.staggerLines && (S4 *= t5.staggerLines), t5.labelOffset = S4 * (t5.opposite ? -1 : 1)) : D2(r4, function(t6, e6) {
                t6.destroy(), delete r4[e6];
              }), d4?.text && false !== d4.enabled && (t5.addTitle(m4), m4 && !p4 && false !== d4.reserveSpace && (t5.titleOffset = x4 = t5.axisTitle.getBBox()[i6 ? "height" : "width"], v4 = y3(b4 = d4.offset) ? 0 : E(d4.margin, i6 ? 5 : 10))), t5.renderLine(), t5.offset = f4 * E(s4.offset, u5[o5] ? u5[o5] + (s4.margin || 0) : 0), t5.tickRotCorr = t5.tickRotCorr || { x: 0, y: 0 }, C4 = 0 === o5 ? -t5.labelMetrics().h : 2 === o5 ? t5.tickRotCorr.y : 0, k4 = Math.abs(S4) + v4, S4 && (k4 -= C4, k4 += f4 * (i6 ? E(c4.y, t5.tickRotCorr.y + f4 * c4.distance) : E(c4.x, f4 * c4.distance))), t5.axisTitleMargin = E(b4, k4), t5.getMaxLabelDimensions && (t5.maxLabelDimensions = t5.getMaxLabelDimensions(r4, n5)), "colorAxis" !== a5) {
                let e6 = this.tickSize("tick");
                u5[o5] = Math.max(u5[o5], (t5.axisTitleMargin || 0) + x4 + f4 * t5.offset, k4, n5 && n5.length && e6 ? e6[0] + f4 * t5.offset : 0);
                let i7 = !t5.axisLine || s4.offset ? 0 : 2 * Math.floor(t5.axisLine.strokeWidth() / 2);
                g4[h4] = Math.max(g4[h4], i7);
              }
              M2(this, "afterGetOffset");
            }
            getLinePath(t5) {
              let e5 = this.chart, i6 = this.opposite, s4 = this.offset, o5 = this.horiz, r4 = this.left + (i6 ? this.width : 0) + s4, n5 = e5.chartHeight - this.bottom - (i6 ? this.height : 0) + s4;
              return i6 && (t5 *= -1), e5.renderer.crispLine([["M", o5 ? this.left : r4, o5 ? n5 : this.top], ["L", o5 ? e5.chartWidth - this.right : r4, o5 ? n5 : e5.chartHeight - this.bottom]], t5);
            }
            renderLine() {
              this.axisLine || (this.axisLine = this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup), this.chart.styledMode || this.axisLine.attr({ stroke: this.options.lineColor, "stroke-width": this.options.lineWidth, zIndex: 7 }));
            }
            getTitlePosition(t5) {
              let e5 = this.horiz, i6 = this.left, s4 = this.top, o5 = this.len, r4 = this.options.title, n5 = e5 ? i6 : s4, a5 = this.opposite, h4 = this.offset, l4 = r4.x, d4 = r4.y, c4 = this.chart.renderer.fontMetrics(t5), p4 = t5 ? Math.max(t5.getBBox(false, 0).height - c4.h - 1, 0) : 0, u5 = { low: n5 + (e5 ? 0 : o5), middle: n5 + o5 / 2, high: n5 + (e5 ? o5 : 0) }[r4.align], g4 = (e5 ? s4 + this.height : i6) + (e5 ? 1 : -1) * (a5 ? -1 : 1) * (this.axisTitleMargin || 0) + [-p4, p4, c4.f, -p4][this.side], f4 = { x: e5 ? u5 + l4 : g4 + (a5 ? this.width : 0) + h4 + l4, y: e5 ? g4 + d4 - (a5 ? this.height : 0) + h4 : u5 + d4 };
              return M2(this, "afterGetTitlePosition", { titlePosition: f4 }), f4;
            }
            renderMinorTick(t5, e5) {
              let i6 = this.minorTicks;
              i6[t5] || (i6[t5] = new n4(this, t5, "minor")), e5 && i6[t5].isNew && i6[t5].render(null, true), i6[t5].render(null, false, 1);
            }
            renderTick(t5, e5, i6) {
              let s4 = this.isLinked, o5 = this.ticks;
              (!s4 || t5 >= this.min && t5 <= this.max || this.grid && this.grid.isColumn) && (o5[t5] || (o5[t5] = new n4(this, t5)), i6 && o5[t5].isNew && o5[t5].render(e5, true, -1), o5[t5].render(e5));
            }
            render() {
              let t5, e5;
              let i6 = this, s4 = i6.chart, o5 = i6.logarithmic, a5 = s4.renderer, l4 = i6.options, d4 = i6.isLinked, c4 = i6.tickPositions, p4 = i6.axisTitle, u5 = i6.ticks, g4 = i6.minorTicks, f4 = i6.alternateBands, m4 = l4.stackLabels, x4 = l4.alternateGridColor, y4 = l4.crossing, b4 = i6.tickmarkOffset, v4 = i6.axisLine, S4 = i6.showAxis, k4 = h3(a5.globalAnimation);
              if (i6.labelEdge.length = 0, i6.overlap = false, [u5, g4, f4].forEach(function(t6) {
                D2(t6, function(t7) {
                  t7.isActive = false;
                });
              }), A2(y4)) {
                let t6 = this.isXAxis ? s4.yAxis[0] : s4.xAxis[0], e6 = [1, -1, -1, 1][this.side];
                if (t6) {
                  let s5 = t6.toPixels(y4, true);
                  i6.horiz && (s5 = t6.len - s5), i6.offset = e6 * s5;
                }
              }
              if (i6.hasData() || d4) {
                let a6 = i6.chart.hasRendered && i6.old && A2(i6.old.min);
                i6.minorTickInterval && !i6.categories && i6.getMinorTickPositions().forEach(function(t6) {
                  i6.renderMinorTick(t6, a6);
                }), c4.length && (c4.forEach(function(t6, e6) {
                  i6.renderTick(t6, e6, a6);
                }), b4 && (0 === i6.min || i6.single) && (u5[-1] || (u5[-1] = new n4(i6, -1, null, true)), u5[-1].render(-1))), x4 && c4.forEach(function(n5, a7) {
                  e5 = void 0 !== c4[a7 + 1] ? c4[a7 + 1] + b4 : i6.max - b4, a7 % 2 == 0 && n5 < i6.max && e5 <= i6.max + (s4.polar ? -b4 : b4) && (f4[n5] || (f4[n5] = new r3.PlotLineOrBand(i6, {})), t5 = n5 + b4, f4[n5].options = { from: o5 ? o5.lin2log(t5) : t5, to: o5 ? o5.lin2log(e5) : e5, color: x4, className: "highcharts-alternate-grid" }, f4[n5].render(), f4[n5].isActive = true);
                }), i6._addedPlotLB || (i6._addedPlotLB = true, (l4.plotLines || []).concat(l4.plotBands || []).forEach(function(t6) {
                  i6.addPlotBandOrLine(t6);
                }));
              }
              [u5, g4, f4].forEach(function(t6) {
                let e6 = [], i7 = k4.duration;
                D2(t6, function(t7, i8) {
                  t7.isActive || (t7.render(i8, false, 0), t7.isActive = false, e6.push(i8));
                }), R(function() {
                  let i8 = e6.length;
                  for (; i8--; )
                    t6[e6[i8]] && !t6[e6[i8]].isActive && (t6[e6[i8]].destroy(), delete t6[e6[i8]]);
                }, t6 !== f4 && s4.hasRendered && i7 ? i7 : 0);
              }), v4 && (v4[v4.isPlaced ? "animate" : "attr"]({ d: this.getLinePath(v4.strokeWidth()) }), v4.isPlaced = true, v4[S4 ? "show" : "hide"](S4)), p4 && S4 && (p4[p4.isNew ? "attr" : "animate"](i6.getTitlePosition(p4)), p4.isNew = false), m4 && m4.enabled && i6.stacking && i6.stacking.renderStackTotals(), i6.old = { len: i6.len, max: i6.max, min: i6.min, transA: i6.transA, userMax: i6.userMax, userMin: i6.userMin }, i6.isDirty = false, M2(this, "afterRender");
            }
            redraw() {
              this.visible && (this.render(), this.plotLinesAndBands.forEach(function(t5) {
                t5.render();
              })), this.series.forEach(function(t5) {
                t5.isDirty = true;
              });
            }
            getKeepProps() {
              return this.keepProps || N2.keepProps;
            }
            destroy(t5) {
              let e5 = this, i6 = e5.plotLinesAndBands, s4 = this.eventOptions;
              if (M2(this, "destroy", { keepEvents: t5 }), t5 || I2(e5), [e5.ticks, e5.minorTicks, e5.alternateBands].forEach(function(t6) {
                b3(t6);
              }), i6) {
                let t6 = i6.length;
                for (; t6--; )
                  i6[t6].destroy();
              }
              for (let t6 in ["axisLine", "axisTitle", "axisGroup", "gridGroup", "labelGroup", "cross", "scrollbar"].forEach(function(t7) {
                e5[t7] && (e5[t7] = e5[t7].destroy());
              }), e5.plotLinesAndBandsGroups)
                e5.plotLinesAndBandsGroups[t6] = e5.plotLinesAndBandsGroups[t6].destroy();
              D2(e5, function(t6, i7) {
                -1 === e5.getKeepProps().indexOf(i7) && delete e5[i7];
              }), this.eventOptions = s4;
            }
            drawCrosshair(t5, e5) {
              let s4 = this.crosshair, o5 = E(s4 && s4.snap, true), r4 = this.chart, n5, a5, h4, l4 = this.cross, d4;
              if (M2(this, "drawCrosshair", { e: t5, point: e5 }), t5 || (t5 = this.cross && this.cross.e), s4 && false !== (y3(e5) || !o5)) {
                if (o5 ? y3(e5) && (a5 = E("colorAxis" !== this.coll ? e5.crosshairPos : null, this.isXAxis ? e5.plotX : this.len - e5.plotY)) : a5 = t5 && (this.horiz ? t5.chartX - this.pos : this.len - t5.chartY + this.pos), y3(a5) && (d4 = { value: e5 && (this.isXAxis ? e5.x : E(e5.stackY, e5.y)), translatedValue: a5 }, r4.polar && k3(d4, { isCrosshair: true, chartX: t5 && t5.chartX, chartY: t5 && t5.chartY, point: e5 }), n5 = this.getPlotLinePath(d4) || null), !y3(n5)) {
                  this.hideCrosshair();
                  return;
                }
                h4 = this.categories && !this.isRadial, l4 || (this.cross = l4 = r4.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-" + (h4 ? "category " : "thin ") + (s4.className || "")).attr({ zIndex: E(s4.zIndex, 2) }).add(), !r4.styledMode && (l4.attr({ stroke: s4.color || (h4 ? i5.parse("#ccd3ff").setOpacity(0.25).get() : "#cccccc"), "stroke-width": E(s4.width, 1) }).css({ "pointer-events": "none" }), s4.dashStyle && l4.attr({ dashstyle: s4.dashStyle }))), l4.show().attr({ d: n5 }), h4 && !s4.width && l4.attr({ "stroke-width": this.transA }), this.cross.e = t5;
              } else
                this.hideCrosshair();
              M2(this, "afterDrawCrosshair", { e: t5, point: e5 });
            }
            hideCrosshair() {
              this.cross && this.cross.hide(), M2(this, "afterHideCrosshair");
            }
            hasVerticalPanning() {
              let t5 = this.chart.options.chart.panning;
              return !!(t5 && t5.enabled && /y/.test(t5.type));
            }
            update(t5, e5) {
              let i6 = this.chart;
              t5 = L2(this.userOptions, t5), this.destroy(true), this.init(i6, t5), i6.isDirtyBox = true, E(e5, true) && i6.redraw();
            }
            remove(t5) {
              let e5 = this.chart, i6 = this.coll, s4 = this.series, o5 = s4.length;
              for (; o5--; )
                s4[o5] && s4[o5].remove(false);
              v3(e5.axes, this), v3(e5[i6] || [], this), e5.orderItems(i6), this.destroy(), e5.isDirtyBox = true, E(t5, true) && e5.redraw();
            }
            setTitle(t5, e5) {
              this.update({ title: t5 }, e5);
            }
            setCategories(t5, e5) {
              this.update({ categories: t5 }, e5);
            }
          }
          return N2.keepProps = ["coll", "extKey", "hcEvents", "names", "series", "userMax", "userMin"], N2;
        }), i4(e3, "Core/Axis/DateTimeAxis.js", [e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          var i5;
          let { composed: s3 } = t4, { addEvent: o4, getMagnitude: r3, normalizeTickInterval: n4, pushUnique: a4, timeUnits: h3 } = e4;
          return function(t5) {
            function e5() {
              return this.chart.time.getTimeTicks.apply(this.chart.time, arguments);
            }
            function i6() {
              if ("datetime" !== this.options.type) {
                this.dateTime = void 0;
                return;
              }
              this.dateTime || (this.dateTime = new l3(this));
            }
            t5.compose = function t6(r4) {
              if (a4(s3, t6)) {
                r4.keepProps.push("dateTime");
                let t7 = r4.prototype;
                t7.getTimeTicks = e5, o4(r4, "afterSetOptions", i6);
              }
              return r4;
            };
            class l3 {
              constructor(t6) {
                this.axis = t6;
              }
              normalizeTimeTickInterval(t6, e6) {
                let i7 = e6 || [["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ["second", [1, 2, 5, 10, 15, 30]], ["minute", [1, 2, 5, 10, 15, 30]], ["hour", [1, 2, 3, 4, 6, 8, 12]], ["day", [1, 2]], ["week", [1, 2]], ["month", [1, 2, 3, 4, 6]], ["year", null]], s4 = i7[i7.length - 1], o5 = h3[s4[0]], a5 = s4[1], l4;
                for (l4 = 0; l4 < i7.length; l4++)
                  if (o5 = h3[(s4 = i7[l4])[0]], a5 = s4[1], i7[l4 + 1]) {
                    let e7 = (o5 * a5[a5.length - 1] + h3[i7[l4 + 1][0]]) / 2;
                    if (t6 <= e7)
                      break;
                  }
                o5 === h3.year && t6 < 5 * o5 && (a5 = [1, 2, 5]);
                let d3 = n4(t6 / o5, a5, "year" === s4[0] ? Math.max(r3(t6 / o5), 1) : 1);
                return { unitRange: o5, count: d3, unitName: s4[0] };
              }
              getXDateFormat(t6, e6) {
                let { axis: i7 } = this, s4 = i7.chart.time;
                return i7.closestPointRange ? s4.getDateFormat(i7.closestPointRange, t6, i7.options.startOfWeek, e6) || s4.resolveDTLFormat(e6.year).main : s4.resolveDTLFormat(e6.day).main;
              }
            }
            t5.Additions = l3;
          }(i5 || (i5 = {})), i5;
        }), i4(e3, "Core/Axis/LogarithmicAxis.js", [e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          var i5;
          let { composed: s3 } = t4, { addEvent: o4, normalizeTickInterval: r3, pick: n4, pushUnique: a4 } = e4;
          return function(t5) {
            function e5(t6) {
              let e6 = t6.userOptions, i7 = this.logarithmic;
              "logarithmic" !== e6.type ? this.logarithmic = void 0 : i7 || (i7 = this.logarithmic = new h3(this));
            }
            function i6() {
              let t6 = this.logarithmic;
              t6 && (this.lin2val = function(e6) {
                return t6.lin2log(e6);
              }, this.val2lin = function(e6) {
                return t6.log2lin(e6);
              });
            }
            t5.compose = function t6(r4) {
              return a4(s3, t6) && (r4.keepProps.push("logarithmic"), o4(r4, "init", e5), o4(r4, "afterInit", i6)), r4;
            };
            class h3 {
              constructor(t6) {
                this.axis = t6;
              }
              getLogTickPositions(t6, e6, i7, s4) {
                let o5 = this.axis, a5 = o5.len, h4 = o5.options, l3 = [];
                if (s4 || (this.minorAutoInterval = void 0), t6 >= 0.5)
                  t6 = Math.round(t6), l3 = o5.getLinearTickPositions(t6, e6, i7);
                else if (t6 >= 0.08) {
                  let o6, r4, n5, a6, h5, d3, c3;
                  let p3 = Math.floor(e6);
                  for (o6 = t6 > 0.3 ? [1, 2, 4] : t6 > 0.15 ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9], r4 = p3; r4 < i7 + 1 && !c3; r4++)
                    for (n5 = 0, a6 = o6.length; n5 < a6 && !c3; n5++)
                      (h5 = this.log2lin(this.lin2log(r4) * o6[n5])) > e6 && (!s4 || d3 <= i7) && void 0 !== d3 && l3.push(d3), d3 > i7 && (c3 = true), d3 = h5;
                } else {
                  let d3 = this.lin2log(e6), c3 = this.lin2log(i7), p3 = s4 ? o5.getMinorTickInterval() : h4.tickInterval, u4 = "auto" === p3 ? null : p3, g3 = h4.tickPixelInterval / (s4 ? 5 : 1), f3 = s4 ? a5 / o5.tickPositions.length : a5;
                  t6 = r3(t6 = n4(u4, this.minorAutoInterval, (c3 - d3) * g3 / (f3 || 1))), l3 = o5.getLinearTickPositions(t6, d3, c3).map(this.log2lin), s4 || (this.minorAutoInterval = t6 / 5);
                }
                return s4 || (o5.tickInterval = t6), l3;
              }
              lin2log(t6) {
                return Math.pow(10, t6);
              }
              log2lin(t6) {
                return Math.log(t6) / Math.LN10;
              }
            }
            t5.Additions = h3;
          }(i5 || (i5 = {})), i5;
        }), i4(e3, "Core/Axis/PlotLineOrBand/PlotLineOrBandAxis.js", [e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          var i5;
          let { composed: s3 } = t4, { erase: o4, extend: r3, isNumber: n4, pushUnique: a4 } = e4;
          return function(t5) {
            let e5;
            function i6(t6) {
              return this.addPlotBandOrLine(t6, "plotBands");
            }
            function h3(t6, i7) {
              let s4 = this.userOptions, o5 = new e5(this, t6);
              if (this.visible && (o5 = o5.render()), o5) {
                if (this._addedPlotLB || (this._addedPlotLB = true, (s4.plotLines || []).concat(s4.plotBands || []).forEach((t7) => {
                  this.addPlotBandOrLine(t7);
                })), i7) {
                  let e6 = s4[i7] || [];
                  e6.push(t6), s4[i7] = e6;
                }
                this.plotLinesAndBands.push(o5);
              }
              return o5;
            }
            function l3(t6) {
              return this.addPlotBandOrLine(t6, "plotLines");
            }
            function d3(t6, e6, i7) {
              i7 = i7 || this.options;
              let s4 = this.getPlotLinePath({ value: e6, force: true, acrossPanes: i7.acrossPanes }), o5 = [], r4 = this.horiz, a5 = !n4(this.min) || !n4(this.max) || t6 < this.min && e6 < this.min || t6 > this.max && e6 > this.max, h4 = this.getPlotLinePath({ value: t6, force: true, acrossPanes: i7.acrossPanes }), l4, d4 = 1, c4;
              if (h4 && s4)
                for (a5 && (c4 = h4.toString() === s4.toString(), d4 = 0), l4 = 0; l4 < h4.length; l4 += 2) {
                  let t7 = h4[l4], e7 = h4[l4 + 1], i8 = s4[l4], n5 = s4[l4 + 1];
                  ("M" === t7[0] || "L" === t7[0]) && ("M" === e7[0] || "L" === e7[0]) && ("M" === i8[0] || "L" === i8[0]) && ("M" === n5[0] || "L" === n5[0]) && (r4 && i8[1] === t7[1] ? (i8[1] += d4, n5[1] += d4) : r4 || i8[2] !== t7[2] || (i8[2] += d4, n5[2] += d4), o5.push(["M", t7[1], t7[2]], ["L", e7[1], e7[2]], ["L", n5[1], n5[2]], ["L", i8[1], i8[2]], ["Z"])), o5.isFlat = c4;
                }
              return o5;
            }
            function c3(t6) {
              this.removePlotBandOrLine(t6);
            }
            function p3(t6) {
              let e6 = this.plotLinesAndBands, i7 = this.options, s4 = this.userOptions;
              if (e6) {
                let r4 = e6.length;
                for (; r4--; )
                  e6[r4].id === t6 && e6[r4].destroy();
                [i7.plotLines || [], s4.plotLines || [], i7.plotBands || [], s4.plotBands || []].forEach(function(e7) {
                  for (r4 = e7.length; r4--; )
                    (e7[r4] || {}).id === t6 && o4(e7, e7[r4]);
                });
              }
            }
            function u4(t6) {
              this.removePlotBandOrLine(t6);
            }
            t5.compose = function t6(o5, n5) {
              return a4(s3, t6) && (e5 = o5, r3(n5.prototype, { addPlotBand: i6, addPlotLine: l3, addPlotBandOrLine: h3, getPlotBandPath: d3, removePlotBand: c3, removePlotLine: u4, removePlotBandOrLine: p3 })), n5;
            };
          }(i5 || (i5 = {})), i5;
        }), i4(e3, "Core/Axis/PlotLineOrBand/PlotLineOrBand.js", [e3["Core/Axis/PlotLineOrBand/PlotLineOrBandAxis.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          let { arrayMax: i5, arrayMin: s3, defined: o4, destroyObjectProperties: r3, erase: n4, fireEvent: a4, merge: h3, objectEach: l3, pick: d3 } = e4;
          class c3 {
            static compose(e5) {
              return t4.compose(c3, e5);
            }
            constructor(t5, e5) {
              this.axis = t5, this.options = e5, this.id = e5.id;
            }
            render() {
              a4(this, "render");
              let { axis: t5, options: e5 } = this, { horiz: i6, logarithmic: s4 } = t5, { color: r4, events: n5, zIndex: c4 = 0 } = e5, p3 = {}, u4 = t5.chart.renderer, g3 = e5.to, f3 = e5.from, m3 = e5.value, x3 = e5.borderWidth, y3 = e5.label, { label: b3, svgElem: v3 } = this, S3 = [], k3, M2 = o4(f3) && o4(g3), C3 = o4(m3), w3 = !v3, T2 = { class: "highcharts-plot-" + (M2 ? "band " : "line ") + (e5.className || "") }, A2 = M2 ? "bands" : "lines";
              if (!t5.chart.styledMode && (C3 ? (T2.stroke = r4 || "#999999", T2["stroke-width"] = d3(e5.width, 1), e5.dashStyle && (T2.dashstyle = e5.dashStyle)) : M2 && (T2.fill = r4 || "#e6e9ff", x3 && (T2.stroke = e5.borderColor, T2["stroke-width"] = x3))), p3.zIndex = c4, A2 += "-" + c4, (k3 = t5.plotLinesAndBandsGroups[A2]) || (t5.plotLinesAndBandsGroups[A2] = k3 = u4.g("plot-" + A2).attr(p3).add()), v3 || (this.svgElem = v3 = u4.path().attr(T2).add(k3)), o4(m3))
                S3 = t5.getPlotLinePath({ value: s4?.log2lin(m3) ?? m3, lineWidth: v3.strokeWidth(), acrossPanes: e5.acrossPanes });
              else {
                if (!(o4(f3) && o4(g3)))
                  return;
                S3 = t5.getPlotBandPath(s4?.log2lin(f3) ?? f3, s4?.log2lin(g3) ?? g3, e5);
              }
              return !this.eventsAdded && n5 && (l3(n5, (t6, e6) => {
                v3?.on(e6, function(t7) {
                  n5[e6].apply(this, [t7]);
                });
              }), this.eventsAdded = true), (w3 || !v3.d) && S3?.length ? v3.attr({ d: S3 }) : v3 && (S3 ? (v3.show(), v3.animate({ d: S3 })) : v3.d && (v3.hide(), b3 && (this.label = b3 = b3.destroy()))), y3 && (o4(y3.text) || o4(y3.formatter)) && S3?.length && t5.width > 0 && t5.height > 0 && !S3.isFlat ? (y3 = h3({ align: i6 && M2 && "center", x: i6 ? !M2 && 4 : 10, verticalAlign: !i6 && M2 && "middle", y: i6 ? M2 ? 16 : 10 : M2 ? 6 : -4, rotation: i6 && !M2 && 90 }, y3), this.renderLabel(y3, S3, M2, c4)) : b3 && b3.hide(), this;
            }
            renderLabel(t5, e5, o5, r4) {
              let n5 = this.axis, a5 = n5.chart.renderer, l4 = this.label;
              l4 || (this.label = l4 = a5.text(this.getLabelText(t5), 0, 0, t5.useHTML).attr({ align: t5.textAlign || t5.align, rotation: t5.rotation, class: "highcharts-plot-" + (o5 ? "band" : "line") + "-label" + (t5.className || ""), zIndex: r4 }), n5.chart.styledMode || l4.css(h3({ fontSize: "0.8em", textOverflow: "ellipsis" }, t5.style)), l4.add());
              let d4 = e5.xBounds || [e5[0][1], e5[1][1], o5 ? e5[2][1] : e5[0][1]], c4 = e5.yBounds || [e5[0][2], e5[1][2], o5 ? e5[2][2] : e5[0][2]], p3 = s3(d4), u4 = s3(c4);
              if (l4.align(t5, false, { x: p3, y: u4, width: i5(d4) - p3, height: i5(c4) - u4 }), !l4.alignValue || "left" === l4.alignValue) {
                let e6 = t5.clip ? n5.width : n5.chart.chartWidth;
                l4.css({ width: (90 === l4.rotation ? n5.height - (l4.alignAttr.y - n5.top) : e6 - (l4.alignAttr.x - n5.left)) + "px" });
              }
              l4.show(true);
            }
            getLabelText(t5) {
              return o4(t5.formatter) ? t5.formatter.call(this) : t5.text;
            }
            destroy() {
              n4(this.axis.plotLinesAndBands, this), delete this.axis, r3(this);
            }
          }
          return c3;
        }), i4(e3, "Core/Tooltip.js", [e3["Core/Templating.js"], e3["Core/Globals.js"], e3["Core/Renderer/RendererUtilities.js"], e3["Core/Renderer/RendererRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3, o4) {
          var r3;
          let { format: n4 } = t4, { composed: a4, doc: h3, isSafari: l3 } = e4, { distribute: d3 } = i5, { addEvent: c3, clamp: p3, css: u4, discardElement: g3, extend: f3, fireEvent: m3, isArray: x3, isNumber: y3, isString: b3, merge: v3, pick: S3, pushUnique: k3, splat: M2, syncTimeout: C3 } = o4;
          class w3 {
            constructor(t5, e5) {
              this.allowShared = true, this.crosshairs = [], this.distance = 0, this.isHidden = true, this.isSticky = false, this.now = {}, this.options = {}, this.outside = false, this.chart = t5, this.init(t5, e5);
            }
            bodyFormatter(t5) {
              return t5.map(function(t6) {
                let e5 = t6.series.tooltipOptions;
                return (e5[(t6.point.formatPrefix || "point") + "Formatter"] || t6.point.tooltipFormatter).call(t6.point, e5[(t6.point.formatPrefix || "point") + "Format"] || "");
              });
            }
            cleanSplit(t5) {
              this.chart.series.forEach(function(e5) {
                let i6 = e5 && e5.tt;
                i6 && (!i6.isActive || t5 ? e5.tt = i6.destroy() : i6.isActive = false);
              });
            }
            defaultFormatter(t5) {
              let e5;
              let i6 = this.points || M2(this);
              return (e5 = (e5 = [t5.tooltipFooterHeaderFormatter(i6[0])]).concat(t5.bodyFormatter(i6))).push(t5.tooltipFooterHeaderFormatter(i6[0], true)), e5;
            }
            destroy() {
              this.label && (this.label = this.label.destroy()), this.split && (this.cleanSplit(true), this.tt && (this.tt = this.tt.destroy())), this.renderer && (this.renderer = this.renderer.destroy(), g3(this.container)), o4.clearTimeout(this.hideTimer), o4.clearTimeout(this.tooltipTimeout);
            }
            getAnchor(t5, e5) {
              let i6;
              let s4 = this.chart, o5 = s4.pointer, r4 = s4.inverted, n5 = s4.plotTop, a5 = s4.plotLeft;
              if ((t5 = M2(t5))[0].series && t5[0].series.yAxis && !t5[0].series.yAxis.options.reversedStacks && (t5 = t5.slice().reverse()), this.followPointer && e5)
                void 0 === e5.chartX && (e5 = o5.normalize(e5)), i6 = [e5.chartX - a5, e5.chartY - n5];
              else if (t5[0].tooltipPos)
                i6 = t5[0].tooltipPos;
              else {
                let s5 = 0, o6 = 0;
                t5.forEach(function(t6) {
                  let e6 = t6.pos(true);
                  e6 && (s5 += e6[0], o6 += e6[1]);
                }), s5 /= t5.length, o6 /= t5.length, this.shared && t5.length > 1 && e5 && (r4 ? s5 = e5.chartX : o6 = e5.chartY), i6 = [s5 - a5, o6 - n5];
              }
              return i6.map(Math.round);
            }
            getClassName(t5, e5, i6) {
              let s4 = this.options, o5 = t5.series, r4 = o5.options;
              return [s4.className, "highcharts-label", i6 && "highcharts-tooltip-header", e5 ? "highcharts-tooltip-box" : "highcharts-tooltip", !i6 && "highcharts-color-" + S3(t5.colorIndex, o5.colorIndex), r4 && r4.className].filter(b3).join(" ");
            }
            getLabel() {
              let t5 = this, i6 = this.chart.styledMode, o5 = this.options, r4 = this.split && this.allowShared, n5 = this.container, a5 = this.chart.renderer;
              if (this.label) {
                let t6 = !this.label.hasClass("highcharts-label");
                (!r4 && t6 || r4 && !t6) && this.destroy();
              }
              if (!this.label) {
                if (this.outside) {
                  let t6 = this.chart.options.chart.style, i7 = s3.getRendererType();
                  this.container = n5 = e4.doc.createElement("div"), n5.className = "highcharts-tooltip-container", u4(n5, { position: "absolute", top: "1px", pointerEvents: "none", zIndex: Math.max(this.options.style.zIndex || 0, (t6 && t6.zIndex || 0) + 3) }), this.renderer = a5 = new i7(n5, 0, 0, t6, void 0, void 0, a5.styledMode);
                }
                if (r4 ? this.label = a5.g("tooltip") : (this.label = a5.label("", 0, 0, o5.shape, void 0, void 0, o5.useHTML, void 0, "tooltip").attr({ padding: o5.padding, r: o5.borderRadius }), i6 || this.label.attr({ fill: o5.backgroundColor, "stroke-width": o5.borderWidth || 0 }).css(o5.style).css({ pointerEvents: o5.style.pointerEvents || (this.shouldStickOnContact() ? "auto" : "none") })), t5.outside) {
                  let e5 = this.label, { xSetter: i7, ySetter: s4 } = e5;
                  e5.xSetter = function(s5) {
                    i7.call(e5, t5.distance), n5 && (n5.style.left = s5 + "px");
                  }, e5.ySetter = function(i8) {
                    s4.call(e5, t5.distance), n5 && (n5.style.top = i8 + "px");
                  };
                }
                this.label.attr({ zIndex: 8 }).shadow(o5.shadow).add();
              }
              return n5 && !n5.parentElement && e4.doc.body.appendChild(n5), this.label;
            }
            getPlayingField() {
              let { body: t5, documentElement: e5 } = h3, { chart: i6, distance: s4, outside: o5 } = this;
              return { width: o5 ? Math.max(t5.scrollWidth, e5.scrollWidth, t5.offsetWidth, e5.offsetWidth, e5.clientWidth) - 2 * s4 : i6.chartWidth, height: o5 ? Math.max(t5.scrollHeight, e5.scrollHeight, t5.offsetHeight, e5.offsetHeight, e5.clientHeight) : i6.chartHeight };
            }
            getPosition(t5, e5, i6) {
              let { distance: s4, chart: o5, outside: r4 } = this, { inverted: n5, plotLeft: a5, plotTop: h4, polar: l4 } = o5, { plotX: d4 = 0, plotY: c4 = 0 } = i6, p4 = {}, u5 = n5 && i6.h || 0, { height: g4, width: f4 } = this.getPlayingField(), m4 = o5.pointer.getChartPosition(), x4 = (t6) => t6 * m4.scaleX, y4 = (t6) => t6 * m4.scaleY, b4 = (i7) => {
                let n6 = "x" === i7;
                return [i7, n6 ? f4 : g4, n6 ? t5 : e5].concat(r4 ? [n6 ? x4(t5) : y4(e5), n6 ? m4.left - s4 + x4(d4 + a5) : m4.top - s4 + y4(c4 + h4), 0, n6 ? f4 : g4] : [n6 ? t5 : e5, n6 ? d4 + a5 : c4 + h4, n6 ? a5 : h4, n6 ? a5 + o5.plotWidth : h4 + o5.plotHeight]);
              }, v4 = b4("y"), k4 = b4("x"), M3, C4 = !!i6.negative;
              !l4 && o5.hoverSeries?.yAxis?.reversed && (C4 = !C4);
              let w4 = !this.followPointer && S3(i6.ttBelow, !l4 && !n5 === C4), T2 = function(t6, e6, i7, o6, n6, a6, h5) {
                let l5 = r4 ? "y" === t6 ? y4(s4) : x4(s4) : s4, d5 = (i7 - o6) / 2, c5 = o6 < n6 - s4, g5 = n6 + s4 + o6 < e6, f5 = n6 - l5 - i7 + d5, m5 = n6 + l5 - d5;
                if (w4 && g5)
                  p4[t6] = m5;
                else if (!w4 && c5)
                  p4[t6] = f5;
                else if (c5)
                  p4[t6] = Math.min(h5 - o6, f5 - u5 < 0 ? f5 : f5 - u5);
                else {
                  if (!g5)
                    return false;
                  p4[t6] = Math.max(a6, m5 + u5 + i7 > e6 ? m5 : m5 + u5);
                }
              }, A2 = function(t6, e6, i7, o6, r5) {
                if (r5 < s4 || r5 > e6 - s4)
                  return false;
                r5 < i7 / 2 ? p4[t6] = 1 : r5 > e6 - o6 / 2 ? p4[t6] = e6 - o6 - 2 : p4[t6] = r5 - i7 / 2;
              }, P2 = function(t6) {
                [v4, k4] = [k4, v4], M3 = t6;
              }, L2 = () => {
                false !== T2.apply(0, v4) ? false !== A2.apply(0, k4) || M3 || (P2(true), L2()) : M3 ? p4.x = p4.y = 0 : (P2(true), L2());
              };
              return (n5 && !l4 || this.len > 1) && P2(), L2(), p4;
            }
            hide(t5) {
              let e5 = this;
              o4.clearTimeout(this.hideTimer), t5 = S3(t5, this.options.hideDelay), this.isHidden || (this.hideTimer = C3(function() {
                let i6 = e5.getLabel();
                e5.getLabel().animate({ opacity: 0 }, { duration: t5 ? 150 : t5, complete: () => {
                  i6.hide(), e5.container && e5.container.remove();
                } }), e5.isHidden = true;
              }, t5));
            }
            init(t5, e5) {
              this.chart = t5, this.options = e5, this.crosshairs = [], this.now = { x: 0, y: 0 }, this.isHidden = true, this.split = e5.split && !t5.inverted && !t5.polar, this.shared = e5.shared || this.split, this.outside = S3(e5.outside, !!(t5.scrollablePixelsX || t5.scrollablePixelsY));
            }
            shouldStickOnContact(t5) {
              return !!(!this.followPointer && this.options.stickOnContact && (!t5 || this.chart.pointer.inClass(t5.target, "highcharts-tooltip")));
            }
            move(t5, e5, i6, s4) {
              let r4 = this, n5 = r4.now, a5 = false !== r4.options.animation && !r4.isHidden && (Math.abs(t5 - n5.x) > 1 || Math.abs(e5 - n5.y) > 1), h4 = r4.followPointer || r4.len > 1;
              f3(n5, { x: a5 ? (2 * n5.x + t5) / 3 : t5, y: a5 ? (n5.y + e5) / 2 : e5, anchorX: h4 ? void 0 : a5 ? (2 * n5.anchorX + i6) / 3 : i6, anchorY: h4 ? void 0 : a5 ? (n5.anchorY + s4) / 2 : s4 }), r4.getLabel().attr(n5), r4.drawTracker(), a5 && (o4.clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function() {
                r4 && r4.move(t5, e5, i6, s4);
              }, 32));
            }
            refresh(t5, e5) {
              let i6 = this.chart, s4 = this.options, r4 = i6.pointer, a5 = M2(t5), h4 = a5[0], l4 = [], d4 = s4.format, c4 = s4.formatter || this.defaultFormatter, p4 = this.shared, u5 = i6.styledMode, g4 = {};
              if (!s4.enabled || !h4.series)
                return;
              o4.clearTimeout(this.hideTimer), this.allowShared = !(!x3(t5) && t5.series && t5.series.noSharedTooltip), this.followPointer = !this.split && h4.series.tooltipOptions.followPointer;
              let f4 = this.getAnchor(t5, e5), y4 = f4[0], v4 = f4[1];
              p4 && this.allowShared ? (r4.applyInactiveState(a5), a5.forEach(function(t6) {
                t6.setState("hover"), l4.push(t6.getLabelConfig());
              }), (g4 = h4.getLabelConfig()).points = l4) : g4 = h4.getLabelConfig(), this.len = l4.length;
              let k4 = b3(d4) ? n4(d4, g4, i6) : c4.call(g4, this), C4 = h4.series;
              if (this.distance = S3(C4.tooltipOptions.distance, 16), false === k4)
                this.hide();
              else {
                if (this.split && this.allowShared)
                  this.renderSplit(k4, a5);
                else {
                  let t6 = y4, o5 = v4;
                  if (e5 && r4.isDirectTouch && (t6 = e5.chartX - i6.plotLeft, o5 = e5.chartY - i6.plotTop), i6.polar || false === C4.options.clip || a5.some((e6) => r4.isDirectTouch || e6.series.shouldShowTooltip(t6, o5))) {
                    let t7 = this.getLabel();
                    (!s4.style.width || u5) && t7.css({ width: (this.outside ? this.getPlayingField() : i6.spacingBox).width + "px" }), t7.attr({ text: k4 && k4.join ? k4.join("") : k4 }), t7.addClass(this.getClassName(h4), true), u5 || t7.attr({ stroke: s4.borderColor || h4.color || C4.color || "#666666" }), this.updatePosition({ plotX: y4, plotY: v4, negative: h4.negative, ttBelow: h4.ttBelow, h: f4[2] || 0 });
                  } else {
                    this.hide();
                    return;
                  }
                }
                this.isHidden && this.label && this.label.attr({ opacity: 1 }).show(), this.isHidden = false;
              }
              m3(this, "refresh");
            }
            renderSplit(t5, e5) {
              let i6 = this, { chart: s4, chart: { chartWidth: o5, chartHeight: r4, plotHeight: n5, plotLeft: a5, plotTop: c4, pointer: u5, scrollablePixelsY: g4 = 0, scrollablePixelsX: m4, scrollingContainer: { scrollLeft: x4, scrollTop: y4 } = { scrollLeft: 0, scrollTop: 0 }, styledMode: v4 }, distance: k4, options: M3, options: { positioner: C4 } } = i6, w4 = i6.outside && "number" != typeof m4 ? h3.documentElement.getBoundingClientRect() : { left: x4, right: x4 + o5, top: y4, bottom: y4 + r4 }, T2 = i6.getLabel(), A2 = this.renderer || s4.renderer, P2 = !!(s4.xAxis[0] && s4.xAxis[0].opposite), { left: L2, top: O2 } = u5.getChartPosition(), D2 = c4 + y4, E = 0, j2 = n5 - g4;
              function I2(t6, e6, s5, o6, r5 = true) {
                let n6, a6;
                return s5 ? (n6 = P2 ? 0 : j2, a6 = p3(t6 - o6 / 2, w4.left, w4.right - o6 - (i6.outside ? L2 : 0))) : (n6 = e6 - D2, a6 = p3(a6 = r5 ? t6 - o6 - k4 : t6 + k4, r5 ? a6 : w4.left, w4.right)), { x: a6, y: n6 };
              }
              b3(t5) && (t5 = [false, t5]);
              let B = t5.slice(0, e5.length + 1).reduce(function(t6, s5, o6) {
                if (false !== s5 && "" !== s5) {
                  let r5 = e5[o6 - 1] || { isHeader: true, plotX: e5[0].plotX, plotY: n5, series: {} }, h4 = r5.isHeader, l4 = h4 ? i6 : r5.series, d4 = l4.tt = function(t7, e6, s6) {
                    let o7 = t7, { isHeader: r6, series: n6 } = e6;
                    if (!o7) {
                      let t8 = { padding: M3.padding, r: M3.borderRadius };
                      v4 || (t8.fill = M3.backgroundColor, t8["stroke-width"] = M3.borderWidth ?? 1), o7 = A2.label("", 0, 0, M3[r6 ? "headerShape" : "shape"], void 0, void 0, M3.useHTML).addClass(i6.getClassName(e6, true, r6)).attr(t8).add(T2);
                    }
                    return o7.isActive = true, o7.attr({ text: s6 }), v4 || o7.css(M3.style).attr({ stroke: M3.borderColor || e6.color || n6.color || "#333333" }), o7;
                  }(l4.tt, r5, s5.toString()), u6 = d4.getBBox(), g5 = u6.width + d4.strokeWidth();
                  h4 && (E = u6.height, j2 += E, P2 && (D2 -= E));
                  let { anchorX: f4, anchorY: m5 } = function(t7) {
                    let e6, i7;
                    let { isHeader: s6, plotX: o7 = 0, plotY: r6 = 0, series: h5 } = t7;
                    if (s6)
                      e6 = Math.max(a5 + o7, a5), i7 = c4 + n5 / 2;
                    else {
                      let { xAxis: t8, yAxis: s7 } = h5;
                      e6 = t8.pos + p3(o7, -k4, t8.len + k4), h5.shouldShowTooltip(0, s7.pos - c4 + r6, { ignoreX: true }) && (i7 = s7.pos + r6);
                    }
                    return { anchorX: e6 = p3(e6, w4.left - k4, w4.right + k4), anchorY: i7 };
                  }(r5);
                  if ("number" == typeof m5) {
                    let e6 = u6.height + 1, s6 = C4 ? C4.call(i6, g5, e6, r5) : I2(f4, m5, h4, g5);
                    t6.push({ align: C4 ? 0 : void 0, anchorX: f4, anchorY: m5, boxWidth: g5, point: r5, rank: S3(s6.rank, h4 ? 1 : 0), size: e6, target: s6.y, tt: d4, x: s6.x });
                  } else
                    d4.isActive = false;
                }
                return t6;
              }, []);
              !C4 && B.some((t6) => {
                let { outside: e6 } = i6, s5 = (e6 ? L2 : 0) + t6.anchorX;
                return s5 < w4.left && s5 + t6.boxWidth < w4.right || s5 < L2 - w4.left + t6.boxWidth && w4.right - s5 > s5;
              }) && (B = B.map((t6) => {
                let { x: e6, y: i7 } = I2(t6.anchorX, t6.anchorY, t6.point.isHeader, t6.boxWidth, false);
                return f3(t6, { target: i7, x: e6 });
              })), i6.cleanSplit(), d3(B, j2);
              let R = { left: L2, right: L2 };
              B.forEach(function(t6) {
                let { x: e6, boxWidth: s5, isHeader: o6 } = t6;
                !o6 && (i6.outside && L2 + e6 < R.left && (R.left = L2 + e6), !o6 && i6.outside && R.left + s5 > R.right && (R.right = L2 + e6));
              }), B.forEach(function(t6) {
                let { x: e6, anchorX: s5, anchorY: o6, pos: r5, point: { isHeader: n6 } } = t6, a6 = { visibility: void 0 === r5 ? "hidden" : "inherit", x: e6, y: (r5 || 0) + D2, anchorX: s5, anchorY: o6 };
                if (i6.outside && e6 < s5) {
                  let t7 = L2 - R.left;
                  t7 > 0 && (n6 || (a6.x = e6 + t7, a6.anchorX = s5 + t7), n6 && (a6.x = (R.right - R.left) / 2, a6.anchorX = s5 + t7));
                }
                t6.tt.attr(a6);
              });
              let { container: z2, outside: N2, renderer: W } = i6;
              if (N2 && z2 && W) {
                let { width: t6, height: e6, x: i7, y: s5 } = T2.getBBox();
                W.setSize(t6 + i7, e6 + s5, false), z2.style.left = R.left + "px", z2.style.top = O2 + "px";
              }
              l3 && T2.attr({ opacity: 1 === T2.opacity ? 0.999 : 1 });
            }
            drawTracker() {
              if (!this.shouldStickOnContact()) {
                this.tracker && (this.tracker = this.tracker.destroy());
                return;
              }
              let t5 = this.chart, e5 = this.label, i6 = this.shared ? t5.hoverPoints : t5.hoverPoint;
              if (!e5 || !i6)
                return;
              let s4 = { x: 0, y: 0, width: 0, height: 0 }, o5 = this.getAnchor(i6), r4 = e5.getBBox();
              o5[0] += t5.plotLeft - (e5.translateX || 0), o5[1] += t5.plotTop - (e5.translateY || 0), s4.x = Math.min(0, o5[0]), s4.y = Math.min(0, o5[1]), s4.width = o5[0] < 0 ? Math.max(Math.abs(o5[0]), r4.width - o5[0]) : Math.max(Math.abs(o5[0]), r4.width), s4.height = o5[1] < 0 ? Math.max(Math.abs(o5[1]), r4.height - Math.abs(o5[1])) : Math.max(Math.abs(o5[1]), r4.height), this.tracker ? this.tracker.attr(s4) : (this.tracker = e5.renderer.rect(s4).addClass("highcharts-tracker").add(e5), t5.styledMode || this.tracker.attr({ fill: "rgba(0,0,0,0)" }));
            }
            styledModeFormat(t5) {
              return t5.replace('style="font-size: 0.8em"', 'class="highcharts-header"').replace(/style="color:{(point|series)\.color}"/g, 'class="highcharts-color-{$1.colorIndex} {series.options.className} {point.options.className}"');
            }
            tooltipFooterHeaderFormatter(t5, e5) {
              let i6 = t5.series, s4 = i6.tooltipOptions, o5 = i6.xAxis, r4 = o5 && o5.dateTime, a5 = { isFooter: e5, labelConfig: t5 }, h4 = s4.xDateFormat, l4 = s4[e5 ? "footerFormat" : "headerFormat"];
              return m3(this, "headerFormatter", a5, function(e6) {
                r4 && !h4 && y3(t5.key) && (h4 = r4.getXDateFormat(t5.key, s4.dateTimeLabelFormats)), r4 && h4 && (t5.point && t5.point.tooltipDateKeys || ["key"]).forEach(function(t6) {
                  l4 = l4.replace("{point." + t6 + "}", "{point." + t6 + ":" + h4 + "}");
                }), i6.chart.styledMode && (l4 = this.styledModeFormat(l4)), e6.text = n4(l4, { point: t5, series: i6 }, this.chart);
              }), a5.text;
            }
            update(t5) {
              this.destroy(), this.init(this.chart, v3(true, this.options, t5));
            }
            updatePosition(t5) {
              let { chart: e5, container: i6, distance: s4, options: o5, renderer: r4 } = this, { height: n5 = 0, width: a5 = 0 } = this.getLabel(), h4 = e5.pointer, { left: l4, top: d4, scaleX: c4, scaleY: p4 } = h4.getChartPosition(), g4 = (o5.positioner || this.getPosition).call(this, a5, n5, t5), f4 = (t5.plotX || 0) + e5.plotLeft, m4 = (t5.plotY || 0) + e5.plotTop, x4;
              r4 && i6 && (o5.positioner && (g4.x += l4 - s4, g4.y += d4 - s4), x4 = (o5.borderWidth || 0) + 2 * s4 + 2, r4.setSize(a5 + x4, n5 + x4, false), (1 !== c4 || 1 !== p4) && (u4(i6, { transform: `scale(${c4}, ${p4})` }), f4 *= c4, m4 *= p4), f4 += l4 - g4.x, m4 += d4 - g4.y), this.move(Math.round(g4.x), Math.round(g4.y || 0), f4, m4);
            }
          }
          return (r3 = w3 || (w3 = {})).compose = function t5(e5) {
            k3(a4, t5) && c3(e5, "afterInit", function() {
              let t6 = this.chart;
              t6.options.tooltip && (t6.tooltip = new r3(t6, t6.options.tooltip));
            });
          }, w3;
        }), i4(e3, "Core/Series/Point.js", [e3["Core/Renderer/HTML/AST.js"], e3["Core/Animation/AnimationUtilities.js"], e3["Core/Defaults.js"], e3["Core/Templating.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3, o4) {
          let { animObject: r3 } = e4, { defaultOptions: n4 } = i5, { format: a4 } = s3, { addEvent: h3, defined: l3, erase: d3, extend: c3, fireEvent: p3, getNestedProperty: u4, isArray: g3, isFunction: f3, isNumber: m3, isObject: x3, merge: y3, objectEach: b3, pick: v3, syncTimeout: S3, removeEvent: k3, uniqueKey: M2 } = o4;
          class C3 {
            animateBeforeDestroy() {
              let t5 = this, e5 = { x: t5.startXPos, opacity: 0 }, i6 = t5.getGraphicalProps();
              i6.singular.forEach(function(i7) {
                t5[i7] = t5[i7].animate("dataLabel" === i7 ? { x: t5[i7].startXPos, y: t5[i7].startYPos, opacity: 0 } : e5);
              }), i6.plural.forEach(function(e6) {
                t5[e6].forEach(function(e7) {
                  e7.element && e7.animate(c3({ x: t5.startXPos }, e7.startYPos ? { x: e7.startXPos, y: e7.startYPos } : {}));
                });
              });
            }
            applyOptions(t5, e5) {
              let i6 = this.series, s4 = i6.options.pointValKey || i6.pointValKey;
              return c3(this, t5 = C3.prototype.optionsToObject.call(this, t5)), this.options = this.options ? c3(this.options, t5) : t5, t5.group && delete this.group, t5.dataLabels && delete this.dataLabels, s4 && (this.y = C3.prototype.getNestedProperty.call(this, s4)), this.selected && (this.state = "select"), "name" in this && void 0 === e5 && i6.xAxis && i6.xAxis.hasNames && (this.x = i6.xAxis.nameToX(this)), void 0 === this.x && i6 ? void 0 === e5 ? this.x = i6.autoIncrement() : this.x = e5 : m3(t5.x) && i6.options.relativeXValue && (this.x = i6.autoIncrement(t5.x)), this.isNull = this.isValid && !this.isValid(), this.formatPrefix = this.isNull ? "null" : "point", this;
            }
            destroy() {
              if (!this.destroyed) {
                let t5 = this, e5 = t5.series, i6 = e5.chart, s4 = e5.options.dataSorting, o5 = i6.hoverPoints, n5 = t5.series.chart.renderer.globalAnimation, a5 = r3(n5), h4 = () => {
                  for (let e6 in (t5.graphic || t5.graphics || t5.dataLabel || t5.dataLabels) && (k3(t5), t5.destroyElements()), t5)
                    delete t5[e6];
                };
                t5.legendItem && i6.legend.destroyItem(t5), o5 && (t5.setState(), d3(o5, t5), o5.length || (i6.hoverPoints = null)), t5 === i6.hoverPoint && t5.onMouseOut(), s4 && s4.enabled ? (this.animateBeforeDestroy(), S3(h4, a5.duration)) : h4(), i6.pointCount--;
              }
              this.destroyed = true;
            }
            destroyElements(t5) {
              let e5 = this, i6 = e5.getGraphicalProps(t5);
              i6.singular.forEach(function(t6) {
                e5[t6] = e5[t6].destroy();
              }), i6.plural.forEach(function(t6) {
                e5[t6].forEach(function(t7) {
                  t7 && t7.element && t7.destroy();
                }), delete e5[t6];
              });
            }
            firePointEvent(t5, e5, i6) {
              let s4 = this, o5 = this.series, r4 = o5.options;
              (r4.point.events[t5] || s4.options && s4.options.events && s4.options.events[t5]) && s4.importEvents(), "click" === t5 && r4.allowPointSelect && (i6 = function(t6) {
                !s4.destroyed && s4.select && s4.select(null, t6.ctrlKey || t6.metaKey || t6.shiftKey);
              }), p3(s4, t5, e5, i6);
            }
            getClassName() {
              return "highcharts-point" + (this.selected ? " highcharts-point-select" : "") + (this.negative ? " highcharts-negative" : "") + (this.isNull ? " highcharts-null-point" : "") + (void 0 !== this.colorIndex ? " highcharts-color-" + this.colorIndex : "") + (this.options.className ? " " + this.options.className : "") + (this.zone && this.zone.className ? " " + this.zone.className.replace("highcharts-negative", "") : "");
            }
            getGraphicalProps(t5) {
              let e5, i6;
              let s4 = this, o5 = [], r4 = { singular: [], plural: [] };
              for ((t5 = t5 || { graphic: 1, dataLabel: 1 }).graphic && o5.push("graphic", "connector"), t5.dataLabel && o5.push("dataLabel", "dataLabelPath", "dataLabelUpper"), i6 = o5.length; i6--; )
                s4[e5 = o5[i6]] && r4.singular.push(e5);
              return ["graphic", "dataLabel"].forEach(function(e6) {
                let i7 = e6 + "s";
                t5[e6] && s4[i7] && r4.plural.push(i7);
              }), r4;
            }
            getLabelConfig() {
              return { x: this.category, y: this.y, color: this.color, colorIndex: this.colorIndex, key: this.name || this.category, series: this.series, point: this, percentage: this.percentage, total: this.total || this.stackTotal };
            }
            getNestedProperty(t5) {
              return t5 ? 0 === t5.indexOf("custom.") ? u4(t5, this.options) : this[t5] : void 0;
            }
            getZone() {
              let t5 = this.series, e5 = t5.zones, i6 = t5.zoneAxis || "y", s4, o5 = 0;
              for (s4 = e5[0]; this[i6] >= s4.value; )
                s4 = e5[++o5];
              return this.nonZonedColor || (this.nonZonedColor = this.color), s4 && s4.color && !this.options.color ? this.color = s4.color : this.color = this.nonZonedColor, s4;
            }
            hasNewShapeType() {
              let t5 = this.graphic && (this.graphic.symbolName || this.graphic.element.nodeName);
              return t5 !== this.shapeType;
            }
            constructor(t5, e5, i6) {
              this.formatPrefix = "point", this.visible = true, this.series = t5, this.applyOptions(e5, i6), this.id ?? (this.id = M2()), this.resolveColor(), t5.chart.pointCount++, p3(this, "afterInit");
            }
            isValid() {
              return (m3(this.x) || this.x instanceof Date) && m3(this.y);
            }
            optionsToObject(t5) {
              let e5 = this.series, i6 = e5.options.keys, s4 = i6 || e5.pointArrayMap || ["y"], o5 = s4.length, r4 = {}, n5, a5 = 0, h4 = 0;
              if (m3(t5) || null === t5)
                r4[s4[0]] = t5;
              else if (g3(t5))
                for (!i6 && t5.length > o5 && ("string" == (n5 = typeof t5[0]) ? r4.name = t5[0] : "number" === n5 && (r4.x = t5[0]), a5++); h4 < o5; )
                  i6 && void 0 === t5[a5] || (s4[h4].indexOf(".") > 0 ? C3.prototype.setNestedProperty(r4, t5[a5], s4[h4]) : r4[s4[h4]] = t5[a5]), a5++, h4++;
              else
                "object" == typeof t5 && (r4 = t5, t5.dataLabels && (e5.hasDataLabels = () => true), t5.marker && (e5._hasPointMarkers = true));
              return r4;
            }
            pos(t5, e5 = this.plotY) {
              if (!this.destroyed) {
                let { plotX: i6, series: s4 } = this, { chart: o5, xAxis: r4, yAxis: n5 } = s4, a5 = 0, h4 = 0;
                if (m3(i6) && m3(e5))
                  return t5 && (a5 = r4 ? r4.pos : o5.plotLeft, h4 = n5 ? n5.pos : o5.plotTop), o5.inverted && r4 && n5 ? [n5.len - e5 + h4, r4.len - i6 + a5] : [i6 + a5, e5 + h4];
              }
            }
            resolveColor() {
              let t5 = this.series, e5 = t5.chart.options.chart, i6 = t5.chart.styledMode, s4, o5, r4 = e5.colorCount, n5;
              delete this.nonZonedColor, t5.options.colorByPoint ? (i6 || (s4 = (o5 = t5.options.colors || t5.chart.options.colors)[t5.colorCounter], r4 = o5.length), n5 = t5.colorCounter, t5.colorCounter++, t5.colorCounter === r4 && (t5.colorCounter = 0)) : (i6 || (s4 = t5.color), n5 = t5.colorIndex), this.colorIndex = v3(this.options.colorIndex, n5), this.color = v3(this.options.color, s4);
            }
            setNestedProperty(t5, e5, i6) {
              let s4 = i6.split(".");
              return s4.reduce(function(t6, i7, s5, o5) {
                let r4 = o5.length - 1 === s5;
                return t6[i7] = r4 ? e5 : x3(t6[i7], true) ? t6[i7] : {}, t6[i7];
              }, t5), t5;
            }
            shouldDraw() {
              return !this.isNull;
            }
            tooltipFormatter(t5) {
              let e5 = this.series, i6 = e5.tooltipOptions, s4 = v3(i6.valueDecimals, ""), o5 = i6.valuePrefix || "", r4 = i6.valueSuffix || "";
              return e5.chart.styledMode && (t5 = e5.chart.tooltip.styledModeFormat(t5)), (e5.pointArrayMap || ["y"]).forEach(function(e6) {
                e6 = "{point." + e6, (o5 || r4) && (t5 = t5.replace(RegExp(e6 + "}", "g"), o5 + e6 + "}" + r4)), t5 = t5.replace(RegExp(e6 + "}", "g"), e6 + ":,." + s4 + "f}");
              }), a4(t5, { point: this, series: this.series }, e5.chart);
            }
            update(t5, e5, i6, s4) {
              let o5;
              let r4 = this, n5 = r4.series, a5 = r4.graphic, h4 = n5.chart, l4 = n5.options;
              function d4() {
                r4.applyOptions(t5);
                let s5 = a5 && r4.hasMockGraphic, d5 = null === r4.y ? !s5 : s5;
                a5 && d5 && (r4.graphic = a5.destroy(), delete r4.hasMockGraphic), x3(t5, true) && (a5 && a5.element && t5 && t5.marker && void 0 !== t5.marker.symbol && (r4.graphic = a5.destroy()), t5?.dataLabels && r4.dataLabel && (r4.dataLabel = r4.dataLabel.destroy())), o5 = r4.index, n5.updateParallelArrays(r4, o5), l4.data[o5] = x3(l4.data[o5], true) || x3(t5, true) ? r4.options : v3(t5, l4.data[o5]), n5.isDirty = n5.isDirtyData = true, !n5.fixedBox && n5.hasCartesianSeries && (h4.isDirtyBox = true), "point" === l4.legendType && (h4.isDirtyLegend = true), e5 && h4.redraw(i6);
              }
              e5 = v3(e5, true), false === s4 ? d4() : r4.firePointEvent("update", { options: t5 }, d4);
            }
            remove(t5, e5) {
              this.series.removePoint(this.series.data.indexOf(this), t5, e5);
            }
            select(t5, e5) {
              let i6 = this, s4 = i6.series, o5 = s4.chart;
              t5 = v3(t5, !i6.selected), this.selectedStaging = t5, i6.firePointEvent(t5 ? "select" : "unselect", { accumulate: e5 }, function() {
                i6.selected = i6.options.selected = t5, s4.options.data[s4.data.indexOf(i6)] = i6.options, i6.setState(t5 && "select"), e5 || o5.getSelectedPoints().forEach(function(t6) {
                  let e6 = t6.series;
                  t6.selected && t6 !== i6 && (t6.selected = t6.options.selected = false, e6.options.data[e6.data.indexOf(t6)] = t6.options, t6.setState(o5.hoverPoints && e6.options.inactiveOtherPoints ? "inactive" : ""), t6.firePointEvent("unselect"));
                });
              }), delete this.selectedStaging;
            }
            onMouseOver(t5) {
              let e5 = this.series, i6 = e5.chart, s4 = i6.pointer;
              t5 = t5 ? s4.normalize(t5) : s4.getChartCoordinatesFromPoint(this, i6.inverted), s4.runPointActions(t5, this);
            }
            onMouseOut() {
              let t5 = this.series.chart;
              this.firePointEvent("mouseOut"), this.series.options.inactiveOtherPoints || (t5.hoverPoints || []).forEach(function(t6) {
                t6.setState();
              }), t5.hoverPoints = t5.hoverPoint = null;
            }
            importEvents() {
              if (!this.hasImportedEvents) {
                let t5 = this, e5 = y3(t5.series.options.point, t5.options), i6 = e5.events;
                t5.events = i6, b3(i6, function(e6, i7) {
                  f3(e6) && h3(t5, i7, e6);
                }), this.hasImportedEvents = true;
              }
            }
            setState(e5, i6) {
              let s4 = this.series, o5 = this.state, r4 = s4.options.states[e5 || "normal"] || {}, a5 = n4.plotOptions[s4.type].marker && s4.options.marker, h4 = a5 && false === a5.enabled, l4 = a5 && a5.states && a5.states[e5 || "normal"] || {}, d4 = false === l4.enabled, u5 = this.marker || {}, g4 = s4.chart, f4 = a5 && s4.markerAttribs, x4 = s4.halo, y4, b4, S4, k4 = s4.stateMarkerGraphic, M3;
              if ((e5 = e5 || "") === this.state && !i6 || this.selected && "select" !== e5 || false === r4.enabled || e5 && (d4 || h4 && false === l4.enabled) || e5 && u5.states && u5.states[e5] && false === u5.states[e5].enabled)
                return;
              if (this.state = e5, f4 && (y4 = s4.markerAttribs(this, e5)), this.graphic && !this.hasMockGraphic) {
                if (o5 && this.graphic.removeClass("highcharts-point-" + o5), e5 && this.graphic.addClass("highcharts-point-" + e5), !g4.styledMode) {
                  b4 = s4.pointAttribs(this, e5), S4 = v3(g4.options.chart.animation, r4.animation);
                  let t5 = b4.opacity;
                  s4.options.inactiveOtherPoints && m3(t5) && (this.dataLabels || []).forEach(function(e6) {
                    e6 && !e6.hasClass("highcharts-data-label-hidden") && (e6.animate({ opacity: t5 }, S4), e6.connector && e6.connector.animate({ opacity: t5 }, S4));
                  }), this.graphic.animate(b4, S4);
                }
                y4 && this.graphic.animate(y4, v3(g4.options.chart.animation, l4.animation, a5.animation)), k4 && k4.hide();
              } else
                e5 && l4 && (M3 = u5.symbol || s4.symbol, k4 && k4.currentSymbol !== M3 && (k4 = k4.destroy()), y4 && (k4 ? k4[i6 ? "animate" : "attr"]({ x: y4.x, y: y4.y }) : M3 && (s4.stateMarkerGraphic = k4 = g4.renderer.symbol(M3, y4.x, y4.y, y4.width, y4.height).add(s4.markerGroup), k4.currentSymbol = M3)), !g4.styledMode && k4 && "inactive" !== this.state && k4.attr(s4.pointAttribs(this, e5))), k4 && (k4[e5 && this.isInside ? "show" : "hide"](), k4.element.point = this, k4.addClass(this.getClassName(), true));
              let C4 = r4.halo, w3 = this.graphic || k4, T2 = w3 && w3.visibility || "inherit";
              C4 && C4.size && w3 && "hidden" !== T2 && !this.isCluster ? (x4 || (s4.halo = x4 = g4.renderer.path().add(w3.parentGroup)), x4.show()[i6 ? "animate" : "attr"]({ d: this.haloPath(C4.size) }), x4.attr({ class: "highcharts-halo highcharts-color-" + v3(this.colorIndex, s4.colorIndex) + (this.className ? " " + this.className : ""), visibility: T2, zIndex: -1 }), x4.point = this, g4.styledMode || x4.attr(c3({ fill: this.color || s4.color, "fill-opacity": C4.opacity }, t4.filterUserAttributes(C4.attributes || {})))) : x4 && x4.point && x4.point.haloPath && x4.animate({ d: x4.point.haloPath(0) }, null, x4.hide), p3(this, "afterSetState", { state: e5 });
            }
            haloPath(t5) {
              let e5 = this.pos();
              return e5 ? this.series.chart.renderer.symbols.circle(Math.floor(e5[0]) - t5, e5[1] - t5, 2 * t5, 2 * t5) : [];
            }
          }
          return C3;
        }), i4(e3, "Core/Pointer.js", [e3["Core/Color/Color.js"], e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          var s3;
          let { parse: o4 } = t4, { charts: r3, composed: n4, noop: a4 } = e4, { addEvent: h3, attr: l3, css: d3, defined: c3, extend: p3, find: u4, fireEvent: g3, isNumber: f3, isObject: m3, objectEach: x3, offset: y3, pick: b3, pushUnique: v3, splat: S3 } = i5;
          class k3 {
            applyInactiveState(t5) {
              let e5 = [], i6;
              (t5 || []).forEach(function(t6) {
                i6 = t6.series, e5.push(i6), i6.linkedParent && e5.push(i6.linkedParent), i6.linkedSeries && (e5 = e5.concat(i6.linkedSeries)), i6.navigatorSeries && e5.push(i6.navigatorSeries);
              }), this.chart.series.forEach(function(t6) {
                -1 === e5.indexOf(t6) ? t6.setState("inactive", true) : t6.options.inactiveOtherPoints && t6.setAllPointsToState("inactive");
              });
            }
            destroy() {
              let t5 = this;
              this.eventsToUnbind.forEach((t6) => t6()), this.eventsToUnbind = [], !e4.chartCount && (k3.unbindDocumentMouseUp && (k3.unbindDocumentMouseUp = k3.unbindDocumentMouseUp()), k3.unbindDocumentTouchEnd && (k3.unbindDocumentTouchEnd = k3.unbindDocumentTouchEnd())), clearInterval(t5.tooltipTimeout), x3(t5, function(e5, i6) {
                t5[i6] = void 0;
              });
            }
            getSelectionMarkerAttrs(t5, e5) {
              let i6 = { args: { chartX: t5, chartY: e5 }, attrs: {}, shapeType: "rect" };
              return g3(this, "getSelectionMarkerAttrs", i6, (i7) => {
                let s4;
                let { chart: o5, mouseDownX: r4 = 0, mouseDownY: n5 = 0, zoomHor: a5, zoomVert: h4 } = this, l4 = i7.attrs;
                l4.x = o5.plotLeft, l4.y = o5.plotTop, l4.width = a5 ? 1 : o5.plotWidth, l4.height = h4 ? 1 : o5.plotHeight, a5 && (s4 = t5 - r4, l4.width = Math.abs(s4), l4.x = (s4 > 0 ? 0 : s4) + r4), h4 && (s4 = e5 - n5, l4.height = Math.abs(s4), l4.y = (s4 > 0 ? 0 : s4) + n5);
              }), i6;
            }
            drag(t5) {
              let e5 = this.chart, i6 = e5.options.chart, s4 = e5.plotLeft, r4 = e5.plotTop, n5 = e5.plotWidth, a5 = e5.plotHeight, h4 = this.mouseDownX || 0, l4 = this.mouseDownY || 0, d4 = m3(i6.panning) ? i6.panning && i6.panning.enabled : i6.panning, c4 = i6.panKey && t5[i6.panKey + "Key"], p4 = t5.chartX, u5 = t5.chartY, g4, f4 = this.selectionMarker;
              if ((!f4 || !f4.touch) && (p4 < s4 ? p4 = s4 : p4 > s4 + n5 && (p4 = s4 + n5), u5 < r4 ? u5 = r4 : u5 > r4 + a5 && (u5 = r4 + a5), this.hasDragged = Math.sqrt(Math.pow(h4 - p4, 2) + Math.pow(l4 - u5, 2)), this.hasDragged > 10)) {
                g4 = e5.isInsidePlot(h4 - s4, l4 - r4, { visiblePlotOnly: true });
                let { shapeType: n6, attrs: a6 } = this.getSelectionMarkerAttrs(p4, u5);
                (e5.hasCartesianSeries || e5.mapView) && (this.zoomX || this.zoomY) && g4 && !c4 && !f4 && (this.selectionMarker = f4 = e5.renderer[n6](), f4.attr({ class: "highcharts-selection-marker", zIndex: 7 }).add(), e5.styledMode || f4.attr({ fill: i6.selectionMarkerFill || o4("#334eff").setOpacity(0.25).get() })), f4 && f4.attr(a6), g4 && !f4 && d4 && e5.pan(t5, i6.panning);
              }
            }
            dragStart(t5) {
              let e5 = this.chart;
              e5.mouseIsDown = t5.type, e5.cancelClick = false, e5.mouseDownX = this.mouseDownX = t5.chartX, e5.mouseDownY = this.mouseDownY = t5.chartY;
            }
            getSelectionBox(t5) {
              let e5 = { args: { marker: t5 }, result: {} };
              return g3(this, "getSelectionBox", e5, (e6) => {
                e6.result = { x: t5.attr ? +t5.attr("x") : t5.x, y: t5.attr ? +t5.attr("y") : t5.y, width: t5.attr ? t5.attr("width") : t5.width, height: t5.attr ? t5.attr("height") : t5.height };
              }), e5.result;
            }
            drop(t5) {
              let e5 = this, i6 = this.chart, s4 = this.hasPinched;
              if (this.selectionMarker) {
                let { x: o5, y: r4, width: n5, height: a5 } = this.getSelectionBox(this.selectionMarker), h4 = { originalEvent: t5, xAxis: [], yAxis: [], x: o5, y: r4, width: n5, height: a5 }, l4 = !!i6.mapView;
                (this.hasDragged || s4) && (i6.axes.forEach(function(i7) {
                  if (i7.zoomEnabled && c3(i7.min) && (s4 || e5[{ xAxis: "zoomX", yAxis: "zoomY" }[i7.coll]]) && f3(o5) && f3(r4) && f3(n5) && f3(a5)) {
                    let e6 = i7.horiz, s5 = "touchend" === t5.type ? i7.minPixelPadding : 0, d4 = i7.toValue((e6 ? o5 : r4) + s5), c4 = i7.toValue((e6 ? o5 + n5 : r4 + a5) - s5);
                    h4[i7.coll].push({ axis: i7, min: Math.min(d4, c4), max: Math.max(d4, c4) }), l4 = true;
                  }
                }), l4 && g3(i6, "selection", h4, function(t6) {
                  i6.zoom(p3(t6, s4 ? { animation: false } : null));
                })), f3(i6.index) && (this.selectionMarker = this.selectionMarker.destroy()), s4 && this.scaleGroups();
              }
              i6 && f3(i6.index) && (d3(i6.container, { cursor: i6._cursor }), i6.cancelClick = +this.hasDragged > 10, i6.mouseIsDown = this.hasDragged = this.hasPinched = false, this.pinchDown = []);
            }
            findNearestKDPoint(t5, e5, i6) {
              let s4;
              return t5.forEach(function(t6) {
                let o5 = t6.noSharedTooltip && e5, r4 = !o5 && 0 > t6.options.findNearestPointBy.indexOf("y"), n5 = t6.searchPoint(i6, r4);
                m3(n5, true) && n5.series && (!m3(s4, true) || function(t7, i7) {
                  let s5 = t7.distX - i7.distX, o6 = t7.dist - i7.dist, r5 = (i7.series.group && i7.series.group.zIndex) - (t7.series.group && t7.series.group.zIndex);
                  return 0 !== s5 && e5 ? s5 : 0 !== o6 ? o6 : 0 !== r5 ? r5 : t7.series.index > i7.series.index ? -1 : 1;
                }(s4, n5) > 0) && (s4 = n5);
              }), s4;
            }
            getChartCoordinatesFromPoint(t5, e5) {
              let i6 = t5.series, s4 = i6.xAxis, o5 = i6.yAxis, r4 = t5.shapeArgs;
              if (s4 && o5) {
                let i7 = b3(t5.clientX, t5.plotX), n5 = t5.plotY || 0;
                return t5.isNode && r4 && f3(r4.x) && f3(r4.y) && (i7 = r4.x, n5 = r4.y), e5 ? { chartX: o5.len + o5.pos - n5, chartY: s4.len + s4.pos - i7 } : { chartX: i7 + s4.pos, chartY: n5 + o5.pos };
              }
              if (r4 && r4.x && r4.y)
                return { chartX: r4.x, chartY: r4.y };
            }
            getChartPosition() {
              if (this.chartPosition)
                return this.chartPosition;
              let { container: t5 } = this.chart, e5 = y3(t5);
              this.chartPosition = { left: e5.left, top: e5.top, scaleX: 1, scaleY: 1 };
              let i6 = t5.offsetWidth, s4 = t5.offsetHeight;
              return i6 > 2 && s4 > 2 && (this.chartPosition.scaleX = e5.width / i6, this.chartPosition.scaleY = e5.height / s4), this.chartPosition;
            }
            getCoordinates(t5) {
              let e5 = { xAxis: [], yAxis: [] };
              return this.chart.axes.forEach(function(i6) {
                e5[i6.isXAxis ? "xAxis" : "yAxis"].push({ axis: i6, value: i6.toValue(t5[i6.horiz ? "chartX" : "chartY"]) });
              }), e5;
            }
            getHoverData(t5, e5, i6, s4, o5, r4) {
              let n5 = [], a5 = function(t6) {
                return t6.visible && !(!o5 && t6.directTouch) && b3(t6.options.enableMouseTracking, true);
              }, h4 = e5, l4, d4 = { chartX: r4 ? r4.chartX : void 0, chartY: r4 ? r4.chartY : void 0, shared: o5 };
              g3(this, "beforeGetHoverData", d4);
              let c4 = h4 && !h4.stickyTracking;
              l4 = c4 ? [h4] : i6.filter((t6) => t6.stickyTracking && (d4.filter || a5)(t6));
              let p4 = s4 && t5 || !r4 ? t5 : this.findNearestKDPoint(l4, o5, r4);
              return h4 = p4 && p4.series, p4 && (o5 && !h4.noSharedTooltip ? (l4 = i6.filter(function(t6) {
                return d4.filter ? d4.filter(t6) : a5(t6) && !t6.noSharedTooltip;
              })).forEach(function(t6) {
                let e6 = u4(t6.points, function(t7) {
                  return t7.x === p4.x && !t7.isNull;
                });
                m3(e6) && (t6.boosted && t6.boost && (e6 = t6.boost.getPoint(e6)), n5.push(e6));
              }) : n5.push(p4)), g3(this, "afterGetHoverData", d4 = { hoverPoint: p4 }), { hoverPoint: d4.hoverPoint, hoverSeries: h4, hoverPoints: n5 };
            }
            getPointFromEvent(t5) {
              let e5 = t5.target, i6;
              for (; e5 && !i6; )
                i6 = e5.point, e5 = e5.parentNode;
              return i6;
            }
            onTrackerMouseOut(t5) {
              let e5 = this.chart, i6 = t5.relatedTarget, s4 = e5.hoverSeries;
              this.isDirectTouch = false, !s4 || !i6 || s4.stickyTracking || this.inClass(i6, "highcharts-tooltip") || this.inClass(i6, "highcharts-series-" + s4.index) && this.inClass(i6, "highcharts-tracker") || s4.onMouseOut();
            }
            inClass(t5, e5) {
              let i6 = t5, s4;
              for (; i6; ) {
                if (s4 = l3(i6, "class")) {
                  if (-1 !== s4.indexOf(e5))
                    return true;
                  if (-1 !== s4.indexOf("highcharts-container"))
                    return false;
                }
                i6 = i6.parentElement;
              }
            }
            constructor(t5, e5) {
              this.hasDragged = false, this.lastValidTouch = {}, this.pinchDown = [], this.eventsToUnbind = [], this.options = e5, this.chart = t5, this.runChartClick = !!e5.chart.events?.click, this.pinchDown = [], this.lastValidTouch = {}, this.setDOMEvents(), g3(this, "afterInit");
            }
            normalize(t5, e5) {
              let i6 = t5.touches, s4 = i6 ? i6.length ? i6.item(0) : b3(i6.changedTouches, t5.changedTouches)[0] : t5;
              e5 || (e5 = this.getChartPosition());
              let o5 = s4.pageX - e5.left, r4 = s4.pageY - e5.top;
              return p3(t5, { chartX: Math.round(o5 /= e5.scaleX), chartY: Math.round(r4 /= e5.scaleY) });
            }
            onContainerClick(t5) {
              let e5 = this.chart, i6 = e5.hoverPoint, s4 = this.normalize(t5), o5 = e5.plotLeft, r4 = e5.plotTop;
              !e5.cancelClick && (i6 && this.inClass(s4.target, "highcharts-tracker") ? (g3(i6.series, "click", p3(s4, { point: i6 })), e5.hoverPoint && i6.firePointEvent("click", s4)) : (p3(s4, this.getCoordinates(s4)), e5.isInsidePlot(s4.chartX - o5, s4.chartY - r4, { visiblePlotOnly: true }) && g3(e5, "click", s4)));
            }
            onContainerMouseDown(t5) {
              let i6 = (1 & (t5.buttons || t5.button)) == 1;
              t5 = this.normalize(t5), e4.isFirefox && 0 !== t5.button && this.onContainerMouseMove(t5), (void 0 === t5.button || i6) && (this.zoomOption(t5), i6 && t5.preventDefault && t5.preventDefault(), this.dragStart(t5));
            }
            onContainerMouseLeave(t5) {
              let e5 = r3[b3(k3.hoverChartIndex, -1)];
              t5 = this.normalize(t5), this.onContainerMouseMove(t5), e5 && t5.relatedTarget && !this.inClass(t5.relatedTarget, "highcharts-tooltip") && (e5.pointer.reset(), e5.pointer.chartPosition = void 0);
            }
            onContainerMouseEnter(t5) {
              delete this.chartPosition;
            }
            onContainerMouseMove(t5) {
              let e5 = this.chart, i6 = e5.tooltip, s4 = this.normalize(t5);
              this.setHoverChartIndex(t5), ("mousedown" === e5.mouseIsDown || this.touchSelect(s4)) && this.drag(s4), !e5.openMenu && (this.inClass(s4.target, "highcharts-tracker") || e5.isInsidePlot(s4.chartX - e5.plotLeft, s4.chartY - e5.plotTop, { visiblePlotOnly: true })) && !(i6 && i6.shouldStickOnContact(s4)) && (this.inClass(s4.target, "highcharts-no-tooltip") ? this.reset(false, 0) : this.runPointActions(s4));
            }
            onDocumentTouchEnd(t5) {
              let e5 = r3[b3(k3.hoverChartIndex, -1)];
              e5 && e5.pointer.drop(t5);
            }
            onContainerTouchMove(t5) {
              this.touchSelect(t5) ? this.onContainerMouseMove(t5) : this.touch(t5);
            }
            onContainerTouchStart(t5) {
              this.touchSelect(t5) ? this.onContainerMouseDown(t5) : (this.zoomOption(t5), this.touch(t5, true));
            }
            onDocumentMouseMove(t5) {
              let e5 = this.chart, i6 = e5.tooltip, s4 = this.chartPosition, o5 = this.normalize(t5, s4);
              !s4 || e5.isInsidePlot(o5.chartX - e5.plotLeft, o5.chartY - e5.plotTop, { visiblePlotOnly: true }) || i6 && i6.shouldStickOnContact(o5) || this.inClass(o5.target, "highcharts-tracker") || this.reset();
            }
            onDocumentMouseUp(t5) {
              let e5 = r3[b3(k3.hoverChartIndex, -1)];
              e5 && e5.pointer.drop(t5);
            }
            pinch(t5) {
              let e5 = this, i6 = e5.chart, s4 = e5.pinchDown, o5 = t5.touches || [], r4 = o5.length, n5 = e5.lastValidTouch, h4 = e5.hasZoom, l4 = {}, d4 = 1 === r4 && (e5.inClass(t5.target, "highcharts-tracker") && i6.runTrackerClick || e5.runChartClick), c4 = {}, u5 = e5.chart.tooltip, f4 = 1 === r4 && b3(u5 && u5.options.followTouchMove, true), m4 = e5.selectionMarker;
              r4 > 1 ? e5.initiated = true : f4 && (e5.initiated = false), h4 && e5.initiated && !d4 && false !== t5.cancelable && t5.preventDefault(), [].map.call(o5, function(t6) {
                return e5.normalize(t6);
              }), "touchstart" === t5.type ? ([].forEach.call(o5, function(t6, e6) {
                s4[e6] = { chartX: t6.chartX, chartY: t6.chartY };
              }), n5.x = [s4[0].chartX, s4[1] && s4[1].chartX], n5.y = [s4[0].chartY, s4[1] && s4[1].chartY], i6.axes.forEach(function(t6) {
                if (t6.zoomEnabled) {
                  let e6 = i6.bounds[t6.horiz ? "h" : "v"], s5 = t6.minPixelPadding, o6 = t6.toPixels(Math.min(b3(t6.options.min, t6.dataMin), t6.dataMin)), r5 = t6.toPixels(Math.max(b3(t6.options.max, t6.dataMax), t6.dataMax)), n6 = Math.min(o6, r5), a5 = Math.max(o6, r5);
                  e6.min = Math.min(t6.pos, n6 - s5), e6.max = Math.max(t6.pos + t6.len, a5 + s5);
                }
              }), e5.res = true) : f4 ? this.runPointActions(e5.normalize(t5)) : s4.length && (g3(i6, "touchpan", { originalEvent: t5 }, () => {
                m4 || (e5.selectionMarker = m4 = p3({ destroy: a4, touch: true }, i6.plotBox)), e5.pinchTranslate(s4, o5, l4, m4, c4, n5), e5.hasPinched = h4, e5.scaleGroups(l4, c4);
              }), e5.res && (e5.res = false, this.reset(false, 0)));
            }
            pinchTranslate(t5, e5, i6, s4, o5, r4) {
              this.zoomHor && this.pinchTranslateDirection(true, t5, e5, i6, s4, o5, r4), this.zoomVert && this.pinchTranslateDirection(false, t5, e5, i6, s4, o5, r4);
            }
            pinchTranslateDirection(t5, e5, i6, s4, o5, r4, n5, a5) {
              let h4 = this.chart, l4 = t5 ? "x" : "y", d4 = t5 ? "X" : "Y", c4 = "chart" + d4, p4 = t5 ? "width" : "height", u5 = h4["plot" + (t5 ? "Left" : "Top")], g4 = h4.inverted, f4 = h4.bounds[t5 ? "h" : "v"], m4 = 1 === e5.length, x4 = e5[0][c4], y4 = !m4 && e5[1][c4], b4 = function() {
                "number" == typeof w3 && Math.abs(x4 - y4) > 20 && (M2 = a5 || Math.abs(C3 - w3) / Math.abs(x4 - y4)), k4 = (u5 - C3) / M2 + x4, v4 = h4["plot" + (t5 ? "Width" : "Height")] / M2;
              }, v4, S4, k4, M2 = a5 || 1, C3 = i6[0][c4], w3 = !m4 && i6[1][c4], T2;
              b4(), (S4 = k4) < f4.min ? (S4 = f4.min, T2 = true) : S4 + v4 > f4.max && (S4 = f4.max - v4, T2 = true), T2 ? (C3 -= 0.8 * (C3 - n5[l4][0]), "number" == typeof w3 && (w3 -= 0.8 * (w3 - n5[l4][1])), b4()) : n5[l4] = [C3, w3], g4 || (r4[l4] = k4 - u5, r4[p4] = v4);
              let A2 = g4 ? t5 ? "scaleY" : "scaleX" : "scale" + d4, P2 = g4 ? 1 / M2 : M2;
              o5[p4] = v4, o5[l4] = S4, s4[A2] = M2 * (g4 && !t5 ? -1 : 1), s4["translate" + d4] = P2 * u5 + (C3 - P2 * x4);
            }
            reset(t5, e5) {
              let i6 = this.chart, s4 = i6.hoverSeries, o5 = i6.hoverPoint, r4 = i6.hoverPoints, n5 = i6.tooltip, a5 = n5 && n5.shared ? r4 : o5;
              t5 && a5 && S3(a5).forEach(function(e6) {
                e6.series.isCartesian && void 0 === e6.plotX && (t5 = false);
              }), t5 ? n5 && a5 && S3(a5).length && (n5.refresh(a5), n5.shared && r4 ? r4.forEach(function(t6) {
                t6.setState(t6.state, true), t6.series.isCartesian && (t6.series.xAxis.crosshair && t6.series.xAxis.drawCrosshair(null, t6), t6.series.yAxis.crosshair && t6.series.yAxis.drawCrosshair(null, t6));
              }) : o5 && (o5.setState(o5.state, true), i6.axes.forEach(function(t6) {
                t6.crosshair && o5.series[t6.coll] === t6 && t6.drawCrosshair(null, o5);
              }))) : (o5 && o5.onMouseOut(), r4 && r4.forEach(function(t6) {
                t6.setState();
              }), s4 && s4.onMouseOut(), n5 && n5.hide(e5), this.unDocMouseMove && (this.unDocMouseMove = this.unDocMouseMove()), i6.axes.forEach(function(t6) {
                t6.hideCrosshair();
              }), this.hoverX = i6.hoverPoints = i6.hoverPoint = null);
            }
            runPointActions(t5, e5, i6) {
              let s4 = this.chart, o5 = s4.series, n5 = s4.tooltip && s4.tooltip.options.enabled ? s4.tooltip : void 0, a5 = !!n5 && n5.shared, l4 = e5 || s4.hoverPoint, d4 = l4 && l4.series || s4.hoverSeries, c4 = (!t5 || "touchmove" !== t5.type) && (!!e5 || d4 && d4.directTouch && this.isDirectTouch), p4 = this.getHoverData(l4, d4, o5, c4, a5, t5);
              l4 = p4.hoverPoint, d4 = p4.hoverSeries;
              let g4 = p4.hoverPoints, f4 = d4 && d4.tooltipOptions.followPointer && !d4.tooltipOptions.split, m4 = a5 && d4 && !d4.noSharedTooltip;
              if (l4 && (i6 || l4 !== s4.hoverPoint || n5 && n5.isHidden)) {
                if ((s4.hoverPoints || []).forEach(function(t6) {
                  -1 === g4.indexOf(t6) && t6.setState();
                }), s4.hoverSeries !== d4 && d4.onMouseOver(), this.applyInactiveState(g4), (g4 || []).forEach(function(t6) {
                  t6.setState("hover");
                }), s4.hoverPoint && s4.hoverPoint.firePointEvent("mouseOut"), !l4.series)
                  return;
                s4.hoverPoints = g4, s4.hoverPoint = l4, l4.firePointEvent("mouseOver", void 0, () => {
                  n5 && l4 && n5.refresh(m4 ? g4 : l4, t5);
                });
              } else if (f4 && n5 && !n5.isHidden) {
                let e6 = n5.getAnchor([{}], t5);
                s4.isInsidePlot(e6[0], e6[1], { visiblePlotOnly: true }) && n5.updatePosition({ plotX: e6[0], plotY: e6[1] });
              }
              this.unDocMouseMove || (this.unDocMouseMove = h3(s4.container.ownerDocument, "mousemove", function(t6) {
                let e6 = r3[k3.hoverChartIndex];
                e6 && e6.pointer.onDocumentMouseMove(t6);
              }), this.eventsToUnbind.push(this.unDocMouseMove)), s4.axes.forEach(function(e6) {
                let i7;
                let o6 = b3((e6.crosshair || {}).snap, true);
                !o6 || (i7 = s4.hoverPoint) && i7.series[e6.coll] === e6 || (i7 = u4(g4, (t6) => t6.series && t6.series[e6.coll] === e6)), i7 || !o6 ? e6.drawCrosshair(t5, i7) : e6.hideCrosshair();
              });
            }
            scaleGroups(t5, e5) {
              let i6 = this.chart;
              i6.series.forEach(function(s4) {
                let o5 = t5 || s4.getPlotBox("series");
                s4.group && (s4.xAxis && s4.xAxis.zoomEnabled || i6.mapView) && (s4.group.attr(o5), s4.markerGroup && (s4.markerGroup.attr(t5 || s4.getPlotBox("marker")), s4.markerGroup.clip(e5 ? i6.clipRect : null)), s4.dataLabelsGroup && s4.dataLabelsGroup.attr(o5));
              }), i6.clipRect.attr(e5 || i6.clipBox);
            }
            setDOMEvents() {
              let t5 = this.chart.container, i6 = t5.ownerDocument;
              t5.onmousedown = this.onContainerMouseDown.bind(this), t5.onmousemove = this.onContainerMouseMove.bind(this), t5.onclick = this.onContainerClick.bind(this), this.eventsToUnbind.push(h3(t5, "mouseenter", this.onContainerMouseEnter.bind(this))), this.eventsToUnbind.push(h3(t5, "mouseleave", this.onContainerMouseLeave.bind(this))), k3.unbindDocumentMouseUp || (k3.unbindDocumentMouseUp = h3(i6, "mouseup", this.onDocumentMouseUp.bind(this)));
              let s4 = this.chart.renderTo.parentElement;
              for (; s4 && "BODY" !== s4.tagName; )
                this.eventsToUnbind.push(h3(s4, "scroll", () => {
                  delete this.chartPosition;
                })), s4 = s4.parentElement;
              e4.hasTouch && (this.eventsToUnbind.push(h3(t5, "touchstart", this.onContainerTouchStart.bind(this), { passive: false })), this.eventsToUnbind.push(h3(t5, "touchmove", this.onContainerTouchMove.bind(this), { passive: false })), k3.unbindDocumentTouchEnd || (k3.unbindDocumentTouchEnd = h3(i6, "touchend", this.onDocumentTouchEnd.bind(this), { passive: false })));
            }
            setHoverChartIndex(t5) {
              let i6 = this.chart, s4 = e4.charts[b3(k3.hoverChartIndex, -1)];
              s4 && s4 !== i6 && s4.pointer.onContainerMouseLeave(t5 || { relatedTarget: i6.container }), s4 && s4.mouseIsDown || (k3.hoverChartIndex = i6.index);
            }
            touch(t5, e5) {
              let i6, s4;
              let o5 = this.chart;
              this.setHoverChartIndex(), 1 === t5.touches.length ? (t5 = this.normalize(t5), o5.isInsidePlot(t5.chartX - o5.plotLeft, t5.chartY - o5.plotTop, { visiblePlotOnly: true }) && !o5.openMenu ? (e5 && this.runPointActions(t5), "touchmove" === t5.type && (i6 = !!(s4 = this.pinchDown)[0] && Math.sqrt(Math.pow(s4[0].chartX - t5.chartX, 2) + Math.pow(s4[0].chartY - t5.chartY, 2)) >= 4), b3(i6, true) && this.pinch(t5)) : e5 && this.reset()) : 2 === t5.touches.length && this.pinch(t5);
            }
            touchSelect(t5) {
              return !!(this.chart.zooming.singleTouch && t5.touches && 1 === t5.touches.length);
            }
            zoomOption(t5) {
              let e5 = this.chart, i6 = (e5.options.chart, e5.inverted), s4 = e5.zooming.type || "", o5, r4;
              /touch/.test(t5.type) && (s4 = b3(e5.zooming.pinchType, s4)), this.zoomX = o5 = /x/.test(s4), this.zoomY = r4 = /y/.test(s4), this.zoomHor = o5 && !i6 || r4 && i6, this.zoomVert = r4 && !i6 || o5 && i6, this.hasZoom = o5 || r4;
            }
          }
          return (s3 = k3 || (k3 = {})).compose = function t5(e5) {
            v3(n4, t5) && h3(e5, "beforeRender", function() {
              this.pointer = new s3(this, this.options);
            });
          }, k3;
        }), i4(e3, "Core/Legend/Legend.js", [e3["Core/Animation/AnimationUtilities.js"], e3["Core/Templating.js"], e3["Core/Globals.js"], e3["Core/Series/Point.js"], e3["Core/Renderer/RendererUtilities.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3, o4, r3) {
          var n4;
          let { animObject: a4, setAnimation: h3 } = t4, { format: l3 } = e4, { composed: d3, marginNames: c3 } = i5, { distribute: p3 } = o4, { addEvent: u4, createElement: g3, css: f3, defined: m3, discardElement: x3, find: y3, fireEvent: b3, isNumber: v3, merge: S3, pick: k3, pushUnique: M2, relativeLength: C3, stableSort: w3, syncTimeout: T2 } = r3;
          class A2 {
            constructor(t5, e5) {
              this.allItems = [], this.initialItemY = 0, this.itemHeight = 0, this.itemMarginBottom = 0, this.itemMarginTop = 0, this.itemX = 0, this.itemY = 0, this.lastItemY = 0, this.lastLineHeight = 0, this.legendHeight = 0, this.legendWidth = 0, this.maxItemWidth = 0, this.maxLegendWidth = 0, this.offsetWidth = 0, this.padding = 0, this.pages = [], this.symbolHeight = 0, this.symbolWidth = 0, this.titleHeight = 0, this.totalItemWidth = 0, this.widthOption = 0, this.chart = t5, this.setOptions(e5), e5.enabled && (this.render(), u4(this.chart, "endResize", function() {
                this.legend.positionCheckboxes();
              })), u4(this.chart, "render", () => {
                this.options.enabled && this.proximate && (this.proximatePositions(), this.positionItems());
              });
            }
            setOptions(t5) {
              let e5 = k3(t5.padding, 8);
              this.options = t5, this.chart.styledMode || (this.itemStyle = t5.itemStyle, this.itemHiddenStyle = S3(this.itemStyle, t5.itemHiddenStyle)), this.itemMarginTop = t5.itemMarginTop, this.itemMarginBottom = t5.itemMarginBottom, this.padding = e5, this.initialItemY = e5 - 5, this.symbolWidth = k3(t5.symbolWidth, 16), this.pages = [], this.proximate = "proximate" === t5.layout && !this.chart.inverted, this.baseline = void 0;
            }
            update(t5, e5) {
              let i6 = this.chart;
              this.setOptions(S3(true, this.options, t5)), this.destroy(), i6.isDirtyLegend = i6.isDirtyBox = true, k3(e5, true) && i6.redraw(), b3(this, "afterUpdate", { redraw: e5 });
            }
            colorizeItem(t5, e5) {
              let { area: i6, group: s4, label: o5, line: r4, symbol: n5 } = t5.legendItem || {};
              if (s4?.[e5 ? "removeClass" : "addClass"]("highcharts-legend-item-hidden"), !this.chart.styledMode) {
                let { itemHiddenStyle: s5 = {} } = this, a5 = s5.color, { fillColor: h4, fillOpacity: l4, lineColor: d4, marker: c4 } = t5.options, p4 = (t6) => (!e5 && (t6.fill && (t6.fill = a5), t6.stroke && (t6.stroke = a5)), t6);
                o5?.css(S3(e5 ? this.itemStyle : s5)), r4?.attr(p4({ stroke: d4 || t5.color })), n5 && n5.attr(p4(c4 && n5.isMarker ? t5.pointAttribs() : { fill: t5.color })), i6?.attr(p4({ fill: h4 || t5.color, "fill-opacity": h4 ? 1 : l4 ?? 0.75 }));
              }
              b3(this, "afterColorizeItem", { item: t5, visible: e5 });
            }
            positionItems() {
              this.allItems.forEach(this.positionItem, this), this.chart.isResizing || this.positionCheckboxes();
            }
            positionItem(t5) {
              let { group: e5, x: i6 = 0, y: s4 = 0 } = t5.legendItem || {}, o5 = this.options, r4 = o5.symbolPadding, n5 = !o5.rtl, a5 = t5.checkbox;
              if (e5 && e5.element) {
                let o6 = { translateX: n5 ? i6 : this.legendWidth - i6 - 2 * r4 - 4, translateY: s4 };
                e5[m3(e5.translateY) ? "animate" : "attr"](o6, void 0, () => {
                  b3(this, "afterPositionItem", { item: t5 });
                });
              }
              a5 && (a5.x = i6, a5.y = s4);
            }
            destroyItem(t5) {
              let e5 = t5.checkbox, i6 = t5.legendItem || {};
              for (let t6 of ["group", "label", "line", "symbol"])
                i6[t6] && (i6[t6] = i6[t6].destroy());
              e5 && x3(e5), t5.legendItem = void 0;
            }
            destroy() {
              for (let t5 of this.getAllItems())
                this.destroyItem(t5);
              for (let t5 of ["clipRect", "up", "down", "pager", "nav", "box", "title", "group"])
                this[t5] && (this[t5] = this[t5].destroy());
              this.display = null;
            }
            positionCheckboxes() {
              let t5;
              let e5 = this.group && this.group.alignAttr, i6 = this.clipHeight || this.legendHeight, s4 = this.titleHeight;
              e5 && (t5 = e5.translateY, this.allItems.forEach(function(o5) {
                let r4;
                let n5 = o5.checkbox;
                n5 && (r4 = t5 + s4 + n5.y + (this.scrollOffset || 0) + 3, f3(n5, { left: e5.translateX + o5.checkboxOffset + n5.x - 20 + "px", top: r4 + "px", display: this.proximate || r4 > t5 - 6 && r4 < t5 + i6 - 6 ? "" : "none" }));
              }, this));
            }
            renderTitle() {
              let t5 = this.options, e5 = this.padding, i6 = t5.title, s4, o5 = 0;
              i6.text && (this.title || (this.title = this.chart.renderer.label(i6.text, e5 - 3, e5 - 4, void 0, void 0, void 0, t5.useHTML, void 0, "legend-title").attr({ zIndex: 1 }), this.chart.styledMode || this.title.css(i6.style), this.title.add(this.group)), i6.width || this.title.css({ width: this.maxLegendWidth + "px" }), o5 = (s4 = this.title.getBBox()).height, this.offsetWidth = s4.width, this.contentGroup.attr({ translateY: o5 })), this.titleHeight = o5;
            }
            setText(t5) {
              let e5 = this.options;
              t5.legendItem.label.attr({ text: e5.labelFormat ? l3(e5.labelFormat, t5, this.chart) : e5.labelFormatter.call(t5) });
            }
            renderItem(t5) {
              let e5 = t5.legendItem = t5.legendItem || {}, i6 = this.chart, s4 = i6.renderer, o5 = this.options, r4 = "horizontal" === o5.layout, n5 = this.symbolWidth, a5 = o5.symbolPadding || 0, h4 = this.itemStyle, l4 = this.itemHiddenStyle, d4 = r4 ? k3(o5.itemDistance, 20) : 0, c4 = !o5.rtl, p4 = !t5.series, u5 = !p4 && t5.series.drawLegendSymbol ? t5.series : t5, g4 = u5.options, f4 = !!this.createCheckboxForItem && g4 && g4.showCheckbox, m4 = o5.useHTML, x4 = t5.options.className, y4 = e5.label, b4 = n5 + a5 + d4 + (f4 ? 20 : 0);
              !y4 && (e5.group = s4.g("legend-item").addClass("highcharts-" + u5.type + "-series highcharts-color-" + t5.colorIndex + (x4 ? " " + x4 : "") + (p4 ? " highcharts-series-" + t5.index : "")).attr({ zIndex: 1 }).add(this.scrollGroup), e5.label = y4 = s4.text("", c4 ? n5 + a5 : -a5, this.baseline || 0, m4), i6.styledMode || y4.css(S3(t5.visible ? h4 : l4)), y4.attr({ align: c4 ? "left" : "right", zIndex: 2 }).add(e5.group), !this.baseline && (this.fontMetrics = s4.fontMetrics(y4), this.baseline = this.fontMetrics.f + 3 + this.itemMarginTop, y4.attr("y", this.baseline), this.symbolHeight = k3(o5.symbolHeight, this.fontMetrics.f), o5.squareSymbol && (this.symbolWidth = k3(o5.symbolWidth, Math.max(this.symbolHeight, 16)), b4 = this.symbolWidth + a5 + d4 + (f4 ? 20 : 0), c4 && y4.attr("x", this.symbolWidth + a5))), u5.drawLegendSymbol(this, t5), this.setItemEvents && this.setItemEvents(t5, y4, m4)), f4 && !t5.checkbox && this.createCheckboxForItem && this.createCheckboxForItem(t5), this.colorizeItem(t5, t5.visible), (i6.styledMode || !h4.width) && y4.css({ width: (o5.itemWidth || this.widthOption || i6.spacingBox.width) - b4 + "px" }), this.setText(t5);
              let v4 = y4.getBBox(), M3 = this.fontMetrics && this.fontMetrics.h || 0;
              t5.itemWidth = t5.checkboxOffset = o5.itemWidth || e5.labelWidth || v4.width + b4, this.maxItemWidth = Math.max(this.maxItemWidth, t5.itemWidth), this.totalItemWidth += t5.itemWidth, this.itemHeight = t5.itemHeight = Math.round(e5.labelHeight || (v4.height > 1.5 * M3 ? v4.height : M3));
            }
            layoutItem(t5) {
              let e5 = this.options, i6 = this.padding, s4 = "horizontal" === e5.layout, o5 = t5.itemHeight, r4 = this.itemMarginBottom, n5 = this.itemMarginTop, a5 = s4 ? k3(e5.itemDistance, 20) : 0, h4 = this.maxLegendWidth, l4 = e5.alignColumns && this.totalItemWidth > h4 ? this.maxItemWidth : t5.itemWidth, d4 = t5.legendItem || {};
              s4 && this.itemX - i6 + l4 > h4 && (this.itemX = i6, this.lastLineHeight && (this.itemY += n5 + this.lastLineHeight + r4), this.lastLineHeight = 0), this.lastItemY = n5 + this.itemY + r4, this.lastLineHeight = Math.max(o5, this.lastLineHeight), d4.x = this.itemX, d4.y = this.itemY, s4 ? this.itemX += l4 : (this.itemY += n5 + o5 + r4, this.lastLineHeight = o5), this.offsetWidth = this.widthOption || Math.max((s4 ? this.itemX - i6 - (t5.checkbox ? 0 : a5) : l4) + i6, this.offsetWidth);
            }
            getAllItems() {
              let t5 = [];
              return this.chart.series.forEach(function(e5) {
                let i6 = e5 && e5.options;
                e5 && k3(i6.showInLegend, !m3(i6.linkedTo) && void 0, true) && (t5 = t5.concat((e5.legendItem || {}).labels || ("point" === i6.legendType ? e5.data : e5)));
              }), b3(this, "afterGetAllItems", { allItems: t5 }), t5;
            }
            getAlignment() {
              let t5 = this.options;
              return this.proximate ? t5.align.charAt(0) + "tv" : t5.floating ? "" : t5.align.charAt(0) + t5.verticalAlign.charAt(0) + t5.layout.charAt(0);
            }
            adjustMargins(t5, e5) {
              let i6 = this.chart, s4 = this.options, o5 = this.getAlignment();
              o5 && [/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/].forEach(function(r4, n5) {
                r4.test(o5) && !m3(t5[n5]) && (i6[c3[n5]] = Math.max(i6[c3[n5]], i6.legend[(n5 + 1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][n5] * s4[n5 % 2 ? "x" : "y"] + k3(s4.margin, 12) + e5[n5] + (i6.titleOffset[n5] || 0)));
              });
            }
            proximatePositions() {
              let t5;
              let e5 = this.chart, i6 = [], s4 = "left" === this.options.align;
              for (let o5 of (this.allItems.forEach(function(t6) {
                let o6, r4, n5 = s4, a5, h4;
                t6.yAxis && (t6.xAxis.options.reversed && (n5 = !n5), t6.points && (o6 = y3(n5 ? t6.points : t6.points.slice(0).reverse(), function(t7) {
                  return v3(t7.plotY);
                })), r4 = this.itemMarginTop + t6.legendItem.label.getBBox().height + this.itemMarginBottom, h4 = t6.yAxis.top - e5.plotTop, a5 = t6.visible ? (o6 ? o6.plotY : t6.yAxis.height) + (h4 - 0.3 * r4) : h4 + t6.yAxis.height, i6.push({ target: a5, size: r4, item: t6 }));
              }, this), p3(i6, e5.plotHeight)))
                t5 = o5.item.legendItem || {}, v3(o5.pos) && (t5.y = e5.plotTop - e5.spacing[0] + o5.pos);
            }
            render() {
              let t5 = this.chart, e5 = t5.renderer, i6 = this.options, s4 = this.padding, o5 = this.getAllItems(), r4, n5, a5, h4 = this.group, l4, d4 = this.box;
              this.itemX = s4, this.itemY = this.initialItemY, this.offsetWidth = 0, this.lastItemY = 0, this.widthOption = C3(i6.width, t5.spacingBox.width - s4), l4 = t5.spacingBox.width - 2 * s4 - i6.x, ["rm", "lm"].indexOf(this.getAlignment().substring(0, 2)) > -1 && (l4 /= 2), this.maxLegendWidth = this.widthOption || l4, h4 || (this.group = h4 = e5.g("legend").addClass(i6.className || "").attr({ zIndex: 7 }).add(), this.contentGroup = e5.g().attr({ zIndex: 1 }).add(h4), this.scrollGroup = e5.g().add(this.contentGroup)), this.renderTitle(), w3(o5, (t6, e6) => (t6.options && t6.options.legendIndex || 0) - (e6.options && e6.options.legendIndex || 0)), i6.reversed && o5.reverse(), this.allItems = o5, this.display = r4 = !!o5.length, this.lastLineHeight = 0, this.maxItemWidth = 0, this.totalItemWidth = 0, this.itemHeight = 0, o5.forEach(this.renderItem, this), o5.forEach(this.layoutItem, this), n5 = (this.widthOption || this.offsetWidth) + s4, a5 = this.lastItemY + this.lastLineHeight + this.titleHeight, a5 = this.handleOverflow(a5) + s4, d4 || (this.box = d4 = e5.rect().addClass("highcharts-legend-box").attr({ r: i6.borderRadius }).add(h4)), t5.styledMode || d4.attr({ stroke: i6.borderColor, "stroke-width": i6.borderWidth || 0, fill: i6.backgroundColor || "none" }).shadow(i6.shadow), n5 > 0 && a5 > 0 && d4[d4.placed ? "animate" : "attr"](d4.crisp.call({}, { x: 0, y: 0, width: n5, height: a5 }, d4.strokeWidth())), h4[r4 ? "show" : "hide"](), t5.styledMode && "none" === h4.getStyle("display") && (n5 = a5 = 0), this.legendWidth = n5, this.legendHeight = a5, r4 && this.align(), this.proximate || this.positionItems(), b3(this, "afterRender");
            }
            align(t5 = this.chart.spacingBox) {
              let e5 = this.chart, i6 = this.options, s4 = t5.y;
              /(lth|ct|rth)/.test(this.getAlignment()) && e5.titleOffset[0] > 0 ? s4 += e5.titleOffset[0] : /(lbh|cb|rbh)/.test(this.getAlignment()) && e5.titleOffset[2] > 0 && (s4 -= e5.titleOffset[2]), s4 !== t5.y && (t5 = S3(t5, { y: s4 })), e5.hasRendered || (this.group.placed = false), this.group.align(S3(i6, { width: this.legendWidth, height: this.legendHeight, verticalAlign: this.proximate ? "top" : i6.verticalAlign }), true, t5);
            }
            handleOverflow(t5) {
              let e5 = this, i6 = this.chart, s4 = i6.renderer, o5 = this.options, r4 = o5.y, n5 = "top" === o5.verticalAlign, a5 = this.padding, h4 = o5.maxHeight, l4 = o5.navigation, d4 = k3(l4.animation, true), c4 = l4.arrowSize || 12, p4 = this.pages, u5 = this.allItems, g4 = function(t6) {
                "number" == typeof t6 ? S4.attr({ height: t6 }) : S4 && (e5.clipRect = S4.destroy(), e5.contentGroup.clip()), e5.contentGroup.div && (e5.contentGroup.div.style.clip = t6 ? "rect(" + a5 + "px,9999px," + (a5 + t6) + "px,0)" : "auto");
              }, f4 = function(t6) {
                return e5[t6] = s4.circle(0, 0, 1.3 * c4).translate(c4 / 2, c4 / 2).add(v4), i6.styledMode || e5[t6].attr("fill", "rgba(0,0,0,0.0001)"), e5[t6];
              }, m4, x4, y4, b4 = i6.spacingBox.height + (n5 ? -r4 : r4) - a5, v4 = this.nav, S4 = this.clipRect;
              return "horizontal" !== o5.layout || "middle" === o5.verticalAlign || o5.floating || (b4 /= 2), h4 && (b4 = Math.min(b4, h4)), p4.length = 0, t5 && b4 > 0 && t5 > b4 && false !== l4.enabled ? (this.clipHeight = m4 = Math.max(b4 - 20 - this.titleHeight - a5, 0), this.currentPage = k3(this.currentPage, 1), this.fullHeight = t5, u5.forEach((t6, e6) => {
                y4 = t6.legendItem || {};
                let i7 = y4.y || 0, s5 = Math.round(y4.label.getBBox().height), o6 = p4.length;
                (!o6 || i7 - p4[o6 - 1] > m4 && (x4 || i7) !== p4[o6 - 1]) && (p4.push(x4 || i7), o6++), y4.pageIx = o6 - 1, x4 && ((u5[e6 - 1].legendItem || {}).pageIx = o6 - 1), e6 === u5.length - 1 && i7 + s5 - p4[o6 - 1] > m4 && i7 > p4[o6 - 1] && (p4.push(i7), y4.pageIx = o6), i7 !== x4 && (x4 = i7);
              }), S4 || (S4 = e5.clipRect = s4.clipRect(0, a5 - 2, 9999, 0), e5.contentGroup.clip(S4)), g4(m4), v4 || (this.nav = v4 = s4.g().attr({ zIndex: 1 }).add(this.group), this.up = s4.symbol("triangle", 0, 0, c4, c4).add(v4), f4("upTracker").on("click", function() {
                e5.scroll(-1, d4);
              }), this.pager = s4.text("", 15, 10).addClass("highcharts-legend-navigation"), !i6.styledMode && l4.style && this.pager.css(l4.style), this.pager.add(v4), this.down = s4.symbol("triangle-down", 0, 0, c4, c4).add(v4), f4("downTracker").on("click", function() {
                e5.scroll(1, d4);
              })), e5.scroll(0), t5 = b4) : v4 && (g4(), this.nav = v4.destroy(), this.scrollGroup.attr({ translateY: 1 }), this.clipHeight = 0), t5;
            }
            scroll(t5, e5) {
              let i6 = this.chart, s4 = this.pages, o5 = s4.length, r4 = this.clipHeight, n5 = this.options.navigation, l4 = this.pager, d4 = this.padding, c4 = this.currentPage + t5;
              if (c4 > o5 && (c4 = o5), c4 > 0) {
                void 0 !== e5 && h3(e5, i6), this.nav.attr({ translateX: d4, translateY: r4 + this.padding + 7 + this.titleHeight, visibility: "inherit" }), [this.up, this.upTracker].forEach(function(t7) {
                  t7.attr({ class: 1 === c4 ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active" });
                }), l4.attr({ text: c4 + "/" + o5 }), [this.down, this.downTracker].forEach(function(t7) {
                  t7.attr({ x: 18 + this.pager.getBBox().width, class: c4 === o5 ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active" });
                }, this), i6.styledMode || (this.up.attr({ fill: 1 === c4 ? n5.inactiveColor : n5.activeColor }), this.upTracker.css({ cursor: 1 === c4 ? "default" : "pointer" }), this.down.attr({ fill: c4 === o5 ? n5.inactiveColor : n5.activeColor }), this.downTracker.css({ cursor: c4 === o5 ? "default" : "pointer" })), this.scrollOffset = -s4[c4 - 1] + this.initialItemY, this.scrollGroup.animate({ translateY: this.scrollOffset }), this.currentPage = c4, this.positionCheckboxes();
                let t6 = a4(k3(e5, i6.renderer.globalAnimation, true));
                T2(() => {
                  b3(this, "afterScroll", { currentPage: c4 });
                }, t6.duration);
              }
            }
            setItemEvents(t5, e5, i6) {
              let o5 = this, r4 = t5.legendItem || {}, n5 = o5.chart.renderer.boxWrapper, a5 = t5 instanceof s3, h4 = "highcharts-legend-" + (a5 ? "point" : "series") + "-active", l4 = o5.chart.styledMode, d4 = i6 ? [e5, r4.symbol] : [r4.group], c4 = (e6) => {
                o5.allItems.forEach((i7) => {
                  t5 !== i7 && [i7].concat(i7.linkedSeries || []).forEach((t6) => {
                    t6.setState(e6, !a5);
                  });
                });
              };
              for (let i7 of d4)
                i7 && i7.on("mouseover", function() {
                  t5.visible && c4("inactive"), t5.setState("hover"), t5.visible && n5.addClass(h4), l4 || e5.css(o5.options.itemHoverStyle);
                }).on("mouseout", function() {
                  o5.chart.styledMode || e5.css(S3(t5.visible ? o5.itemStyle : o5.itemHiddenStyle)), c4(""), n5.removeClass(h4), t5.setState();
                }).on("click", function(e6) {
                  let i8 = "legendItemClick", s4 = function() {
                    t5.setVisible && t5.setVisible(), c4(t5.visible ? "inactive" : "");
                  };
                  n5.removeClass(h4), e6 = { browserEvent: e6 }, t5.firePointEvent ? t5.firePointEvent(i8, e6, s4) : b3(t5, i8, e6, s4);
                });
            }
            createCheckboxForItem(t5) {
              t5.checkbox = g3("input", { type: "checkbox", className: "highcharts-legend-checkbox", checked: t5.selected, defaultChecked: t5.selected }, this.options.itemCheckboxStyle, this.chart.container), u4(t5.checkbox, "click", function(e5) {
                let i6 = e5.target;
                b3(t5.series || t5, "checkboxClick", { checked: i6.checked, item: t5 }, function() {
                  t5.select();
                });
              });
            }
          }
          return (n4 = A2 || (A2 = {})).compose = function t5(e5) {
            M2(d3, t5) && u4(e5, "beforeMargins", function() {
              this.legend = new n4(this, this.options.legend);
            });
          }, A2;
        }), i4(e3, "Core/Legend/LegendSymbol.js", [e3["Core/Utilities.js"]], function(t4) {
          var e4;
          let { extend: i5, merge: s3, pick: o4 } = t4;
          return function(t5) {
            function e5(t6, e6, r3) {
              let n4 = this.legendItem = this.legendItem || {}, { chart: a4, options: h3 } = this, { baseline: l3 = 0, symbolWidth: d3, symbolHeight: c3 } = t6, p3 = this.symbol || "circle", u4 = c3 / 2, g3 = a4.renderer, f3 = n4.group, m3 = l3 - Math.round(c3 * (r3 ? 0.4 : 0.3)), x3 = {}, y3, b3 = h3.marker, v3 = 0;
              if (a4.styledMode || (x3["stroke-width"] = Math.min(h3.lineWidth || 0, 24), h3.dashStyle ? x3.dashstyle = h3.dashStyle : "square" === h3.linecap || (x3["stroke-linecap"] = "round")), n4.line = g3.path().addClass("highcharts-graph").attr(x3).add(f3), r3 && (n4.area = g3.path().addClass("highcharts-area").add(f3)), x3["stroke-linecap"] && (v3 = Math.min(n4.line.strokeWidth(), d3) / 2), d3) {
                let t7 = [["M", v3, m3], ["L", d3 - v3, m3]];
                n4.line.attr({ d: t7 }), n4.area?.attr({ d: [...t7, ["L", d3 - v3, l3], ["L", v3, l3]] });
              }
              if (b3 && false !== b3.enabled && d3) {
                let t7 = Math.min(o4(b3.radius, u4), u4);
                0 === p3.indexOf("url") && (b3 = s3(b3, { width: c3, height: c3 }), t7 = 0), n4.symbol = y3 = g3.symbol(p3, d3 / 2 - t7, m3 - t7, 2 * t7, 2 * t7, i5({ context: "legend" }, b3)).addClass("highcharts-point").add(f3), y3.isMarker = true;
              }
            }
            t5.areaMarker = function(t6, i6) {
              e5.call(this, t6, i6, true);
            }, t5.lineMarker = e5, t5.rectangle = function(t6, e6) {
              let i6 = e6.legendItem || {}, s4 = t6.options, r3 = t6.symbolHeight, n4 = s4.squareSymbol, a4 = n4 ? r3 : t6.symbolWidth;
              i6.symbol = this.chart.renderer.rect(n4 ? (t6.symbolWidth - r3) / 2 : 0, t6.baseline - r3 + 1, a4, r3, o4(t6.options.symbolRadius, r3 / 2)).addClass("highcharts-point").attr({ zIndex: 3 }).add(i6.group);
            };
          }(e4 || (e4 = {})), e4;
        }), i4(e3, "Core/Series/SeriesDefaults.js", [], function() {
          return { lineWidth: 2, allowPointSelect: false, crisp: true, showCheckbox: false, animation: { duration: 1e3 }, enableMouseTracking: true, events: {}, marker: { enabledThreshold: 2, lineColor: "#ffffff", lineWidth: 0, radius: 4, states: { normal: { animation: true }, hover: { animation: { duration: 150 }, enabled: true, radiusPlus: 2, lineWidthPlus: 1 }, select: { fillColor: "#cccccc", lineColor: "#000000", lineWidth: 2 } } }, point: { events: {} }, dataLabels: { animation: {}, align: "center", borderWidth: 0, defer: true, formatter: function() {
            let { numberFormatter: t4 } = this.series.chart;
            return "number" != typeof this.y ? "" : t4(this.y, -1);
          }, padding: 5, style: { fontSize: "0.7em", fontWeight: "bold", color: "contrast", textOutline: "1px contrast" }, verticalAlign: "bottom", x: 0, y: 0 }, cropThreshold: 300, opacity: 1, pointRange: 0, softThreshold: true, states: { normal: { animation: true }, hover: { animation: { duration: 150 }, lineWidthPlus: 1, marker: {}, halo: { size: 10, opacity: 0.25 } }, select: { animation: { duration: 0 } }, inactive: { animation: { duration: 150 }, opacity: 0.2 } }, stickyTracking: true, turboThreshold: 1e3, findNearestPointBy: "x" };
        }), i4(e3, "Core/Series/SeriesRegistry.js", [e3["Core/Globals.js"], e3["Core/Defaults.js"], e3["Core/Series/Point.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3) {
          var o4;
          let { defaultOptions: r3 } = e4, { extendClass: n4, merge: a4 } = s3;
          return function(e5) {
            function s4(t5, s5) {
              let o5 = r3.plotOptions || {}, n5 = s5.defaultOptions, a5 = s5.prototype;
              a5.type = t5, a5.pointClass || (a5.pointClass = i5), n5 && (o5[t5] = n5), e5.seriesTypes[t5] = s5;
            }
            e5.seriesTypes = t4.seriesTypes, e5.registerSeriesType = s4, e5.seriesType = function(t5, o5, h3, l3, d3) {
              let c3 = r3.plotOptions || {};
              return o5 = o5 || "", c3[t5] = a4(c3[o5], h3), s4(t5, n4(e5.seriesTypes[o5] || function() {
              }, l3)), e5.seriesTypes[t5].prototype.type = t5, d3 && (e5.seriesTypes[t5].prototype.pointClass = n4(i5, d3)), e5.seriesTypes[t5];
            };
          }(o4 || (o4 = {})), o4;
        }), i4(e3, "Core/Series/Series.js", [e3["Core/Animation/AnimationUtilities.js"], e3["Core/Defaults.js"], e3["Core/Foundation.js"], e3["Core/Globals.js"], e3["Core/Legend/LegendSymbol.js"], e3["Core/Series/Point.js"], e3["Core/Series/SeriesDefaults.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Renderer/SVG/SVGElement.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3, o4, r3, n4, a4, h3, l3) {
          let { animObject: d3, setAnimation: c3 } = t4, { defaultOptions: p3 } = e4, { registerEventOptions: u4 } = i5, { hasTouch: g3, svg: f3, win: m3 } = s3, { seriesTypes: x3 } = a4, { arrayMax: y3, arrayMin: b3, clamp: v3, correctFloat: S3, defined: k3, destroyObjectProperties: M2, diffObjects: C3, erase: w3, error: T2, extend: A2, find: P2, fireEvent: L2, getClosestDistance: O2, getNestedProperty: D2, insertItem: E, isArray: j2, isNumber: I2, isString: B, merge: R, objectEach: z2, pick: N2, removeEvent: W, splat: G, syncTimeout: H } = l3;
          class X {
            constructor() {
              this.zoneAxis = "y";
            }
            init(t5, e5) {
              let i6;
              L2(this, "init", { options: e5 });
              let s4 = this, o5 = t5.series;
              this.eventsToUnbind = [], s4.chart = t5, s4.options = s4.setOptions(e5);
              let r4 = s4.options, n5 = false !== r4.visible;
              s4.linkedSeries = [], s4.bindAxes(), A2(s4, { name: r4.name, state: "", visible: n5, selected: true === r4.selected }), u4(this, r4);
              let a5 = r4.events;
              (a5 && a5.click || r4.point && r4.point.events && r4.point.events.click || r4.allowPointSelect) && (t5.runTrackerClick = true), s4.getColor(), s4.getSymbol(), s4.parallelArrays.forEach(function(t6) {
                s4[t6 + "Data"] || (s4[t6 + "Data"] = []);
              }), s4.isCartesian && (t5.hasCartesianSeries = true), o5.length && (i6 = o5[o5.length - 1]), s4._i = N2(i6 && i6._i, -1) + 1, s4.opacity = s4.options.opacity, t5.orderItems("series", E(this, o5)), r4.dataSorting && r4.dataSorting.enabled ? s4.setDataSortingOptions() : s4.points || s4.data || s4.setData(r4.data, false), L2(this, "afterInit");
            }
            is(t5) {
              return x3[t5] && this instanceof x3[t5];
            }
            bindAxes() {
              let t5;
              let e5 = this, i6 = e5.options, s4 = e5.chart;
              L2(this, "bindAxes", null, function() {
                (e5.axisTypes || []).forEach(function(o5) {
                  s4[o5].forEach(function(s5) {
                    t5 = s5.options, (N2(i6[o5], 0) === s5.index || void 0 !== i6[o5] && i6[o5] === t5.id) && (E(e5, s5.series), e5[o5] = s5, s5.isDirty = true);
                  }), e5[o5] || e5.optionalAxis === o5 || T2(18, true, s4);
                });
              }), L2(this, "afterBindAxes");
            }
            updateParallelArrays(t5, e5, i6) {
              let s4 = t5.series, o5 = I2(e5) ? function(i7) {
                let o6 = "y" === i7 && s4.toYData ? s4.toYData(t5) : t5[i7];
                s4[i7 + "Data"][e5] = o6;
              } : function(t6) {
                Array.prototype[e5].apply(s4[t6 + "Data"], i6);
              };
              s4.parallelArrays.forEach(o5);
            }
            hasData() {
              return this.visible && void 0 !== this.dataMax && void 0 !== this.dataMin || this.visible && this.yData && this.yData.length > 0;
            }
            hasMarkerChanged(t5, e5) {
              let i6 = t5.marker, s4 = e5.marker || {};
              return i6 && (s4.enabled && !i6.enabled || s4.symbol !== i6.symbol || s4.height !== i6.height || s4.width !== i6.width);
            }
            autoIncrement(t5) {
              let e5 = this.options, i6 = e5.pointIntervalUnit, s4 = e5.relativeXValue, o5 = this.chart.time, r4 = this.xIncrement, n5, a5;
              return (r4 = N2(r4, e5.pointStart, 0), this.pointInterval = a5 = N2(this.pointInterval, e5.pointInterval, 1), s4 && I2(t5) && (a5 *= t5), i6 && (n5 = new o5.Date(r4), "day" === i6 ? o5.set("Date", n5, o5.get("Date", n5) + a5) : "month" === i6 ? o5.set("Month", n5, o5.get("Month", n5) + a5) : "year" === i6 && o5.set("FullYear", n5, o5.get("FullYear", n5) + a5), a5 = n5.getTime() - r4), s4 && I2(t5)) ? r4 + a5 : (this.xIncrement = r4 + a5, r4);
            }
            setDataSortingOptions() {
              let t5 = this.options;
              A2(this, { requireSorting: false, sorted: false, enabledDataSorting: true, allowDG: false }), k3(t5.pointRange) || (t5.pointRange = 1);
            }
            setOptions(t5) {
              let e5;
              let i6 = this.chart, s4 = i6.options, o5 = s4.plotOptions, r4 = i6.userOptions || {}, n5 = R(t5), a5 = i6.styledMode, h4 = { plotOptions: o5, userOptions: n5 };
              L2(this, "setOptions", h4);
              let l4 = h4.plotOptions[this.type], d4 = r4.plotOptions || {}, c4 = d4.series || {}, u5 = p3.plotOptions[this.type] || {}, g4 = d4[this.type] || {};
              this.userOptions = h4.userOptions;
              let f4 = R(l4, o5.series, g4, n5);
              this.tooltipOptions = R(p3.tooltip, p3.plotOptions.series?.tooltip, u5?.tooltip, i6.userOptions.tooltip, d4.series?.tooltip, g4.tooltip, n5.tooltip), this.stickyTracking = N2(n5.stickyTracking, g4.stickyTracking, c4.stickyTracking, !!this.tooltipOptions.shared && !this.noSharedTooltip || f4.stickyTracking), null === l4.marker && delete f4.marker, this.zoneAxis = f4.zoneAxis || "y";
              let m4 = this.zones = (f4.zones || []).slice();
              return (f4.negativeColor || f4.negativeFillColor) && !f4.zones && (e5 = { value: f4[this.zoneAxis + "Threshold"] || f4.threshold || 0, className: "highcharts-negative" }, a5 || (e5.color = f4.negativeColor, e5.fillColor = f4.negativeFillColor), m4.push(e5)), m4.length && k3(m4[m4.length - 1].value) && m4.push(a5 ? {} : { color: this.color, fillColor: this.fillColor }), L2(this, "afterSetOptions", { options: f4 }), f4;
            }
            getName() {
              return N2(this.options.name, "Series " + (this.index + 1));
            }
            getCyclic(t5, e5, i6) {
              let s4, o5;
              let r4 = this.chart, n5 = `${t5}Index`, a5 = `${t5}Counter`, h4 = i6?.length || r4.options.chart.colorCount;
              !e5 && (k3(o5 = N2("color" === t5 ? this.options.colorIndex : void 0, this[n5])) ? s4 = o5 : (r4.series.length || (r4[a5] = 0), s4 = r4[a5] % h4, r4[a5] += 1), i6 && (e5 = i6[s4])), void 0 !== s4 && (this[n5] = s4), this[t5] = e5;
            }
            getColor() {
              this.chart.styledMode ? this.getCyclic("color") : this.options.colorByPoint ? this.color = "#cccccc" : this.getCyclic("color", this.options.color || p3.plotOptions[this.type].color, this.chart.options.colors);
            }
            getPointsCollection() {
              return (this.hasGroupedData ? this.points : this.data) || [];
            }
            getSymbol() {
              let t5 = this.options.marker;
              this.getCyclic("symbol", t5.symbol, this.chart.options.symbols);
            }
            findPointIndex(t5, e5) {
              let i6, s4, o5;
              let n5 = t5.id, a5 = t5.x, h4 = this.points, l4 = this.options.dataSorting;
              if (n5) {
                let t6 = this.chart.get(n5);
                t6 instanceof r3 && (i6 = t6);
              } else if (this.linkedParent || this.enabledDataSorting || this.options.relativeXValue) {
                let e6 = (e7) => !e7.touched && e7.index === t5.index;
                if (l4 && l4.matchByName ? e6 = (e7) => !e7.touched && e7.name === t5.name : this.options.relativeXValue && (e6 = (e7) => !e7.touched && e7.options.x === t5.x), !(i6 = P2(h4, e6)))
                  return;
              }
              return i6 && void 0 !== (o5 = i6 && i6.index) && (s4 = true), void 0 === o5 && I2(a5) && (o5 = this.xData.indexOf(a5, e5)), -1 !== o5 && void 0 !== o5 && this.cropped && (o5 = o5 >= this.cropStart ? o5 - this.cropStart : o5), !s4 && I2(o5) && h4[o5] && h4[o5].touched && (o5 = void 0), o5;
            }
            updateData(t5, e5) {
              let i6 = this.options, s4 = i6.dataSorting, o5 = this.points, r4 = [], n5 = this.requireSorting, a5 = t5.length === o5.length, h4, l4, d4, c4, p4 = true;
              if (this.xIncrement = null, t5.forEach(function(t6, e6) {
                let l5;
                let d5 = k3(t6) && this.pointClass.prototype.optionsToObject.call({ series: this }, t6) || {}, p5 = d5.x, u5 = d5.id;
                u5 || I2(p5) ? (-1 === (l5 = this.findPointIndex(d5, c4)) || void 0 === l5 ? r4.push(t6) : o5[l5] && t6 !== i6.data[l5] ? (o5[l5].update(t6, false, null, false), o5[l5].touched = true, n5 && (c4 = l5 + 1)) : o5[l5] && (o5[l5].touched = true), (!a5 || e6 !== l5 || s4 && s4.enabled || this.hasDerivedData) && (h4 = true)) : r4.push(t6);
              }, this), h4)
                for (l4 = o5.length; l4--; )
                  (d4 = o5[l4]) && !d4.touched && d4.remove && d4.remove(false, e5);
              else
                !a5 || s4 && s4.enabled ? p4 = false : (t5.forEach(function(t6, e6) {
                  t6 === o5[e6].y || o5[e6].destroyed || o5[e6].update(t6, false, null, false);
                }), r4.length = 0);
              return o5.forEach(function(t6) {
                t6 && (t6.touched = false);
              }), !!p4 && (r4.forEach(function(t6) {
                this.addPoint(t6, false, null, null, false);
              }, this), null === this.xIncrement && this.xData && this.xData.length && (this.xIncrement = y3(this.xData), this.autoIncrement()), true);
            }
            setData(t5, e5 = true, i6, s4) {
              let o5 = this, r4 = o5.points, n5 = r4 && r4.length || 0, a5 = o5.options, h4 = o5.chart, l4 = a5.dataSorting, d4 = o5.xAxis, c4 = a5.turboThreshold, p4 = this.xData, u5 = this.yData, g4 = o5.pointArrayMap, f4 = g4 && g4.length, m4 = a5.keys, x4, y4, b4, v4 = 0, S4 = 1, k4 = null, M3;
              h4.options.chart.allowMutatingData || (a5.data && delete o5.options.data, o5.userOptions.data && delete o5.userOptions.data, M3 = R(true, t5)), t5 = M3 || t5 || [];
              let C4 = t5.length;
              if (l4 && l4.enabled && (t5 = this.sortData(t5)), h4.options.chart.allowMutatingData && false !== s4 && C4 && n5 && !o5.cropped && !o5.hasGroupedData && o5.visible && !o5.boosted && (b4 = this.updateData(t5, i6)), !b4) {
                if (o5.xIncrement = null, o5.colorCounter = 0, this.parallelArrays.forEach(function(t6) {
                  o5[t6 + "Data"].length = 0;
                }), c4 && C4 > c4) {
                  if (I2(k4 = o5.getFirstValidPoint(t5)))
                    for (x4 = 0; x4 < C4; x4++)
                      p4[x4] = this.autoIncrement(), u5[x4] = t5[x4];
                  else if (j2(k4)) {
                    if (f4) {
                      if (k4.length === f4)
                        for (x4 = 0; x4 < C4; x4++)
                          p4[x4] = this.autoIncrement(), u5[x4] = t5[x4];
                      else
                        for (x4 = 0; x4 < C4; x4++)
                          y4 = t5[x4], p4[x4] = y4[0], u5[x4] = y4.slice(1, f4 + 1);
                    } else if (m4 && (v4 = m4.indexOf("x"), S4 = m4.indexOf("y"), v4 = v4 >= 0 ? v4 : 0, S4 = S4 >= 0 ? S4 : 1), 1 === k4.length && (S4 = 0), v4 === S4)
                      for (x4 = 0; x4 < C4; x4++)
                        p4[x4] = this.autoIncrement(), u5[x4] = t5[x4][S4];
                    else
                      for (x4 = 0; x4 < C4; x4++)
                        y4 = t5[x4], p4[x4] = y4[v4], u5[x4] = y4[S4];
                  } else
                    T2(12, false, h4);
                } else
                  for (x4 = 0; x4 < C4; x4++)
                    y4 = { series: o5 }, o5.pointClass.prototype.applyOptions.apply(y4, [t5[x4]]), o5.updateParallelArrays(y4, x4);
                for (u5 && B(u5[0]) && T2(14, true, h4), o5.data = [], o5.options.data = o5.userOptions.data = t5, x4 = n5; x4--; )
                  r4[x4]?.destroy();
                d4 && (d4.minRange = d4.userMinRange), o5.isDirty = h4.isDirtyBox = true, o5.isDirtyData = !!r4, i6 = false;
              }
              "point" === a5.legendType && (this.processData(), this.generatePoints()), e5 && h4.redraw(i6);
            }
            sortData(t5) {
              let e5 = this, i6 = e5.options, s4 = i6.dataSorting, o5 = s4.sortKey || "y", r4 = function(t6, e6) {
                return k3(e6) && t6.pointClass.prototype.optionsToObject.call({ series: t6 }, e6) || {};
              };
              t5.forEach(function(i7, s5) {
                t5[s5] = r4(e5, i7), t5[s5].index = s5;
              }, this);
              let n5 = t5.concat().sort((t6, e6) => {
                let i7 = D2(o5, t6), s5 = D2(o5, e6);
                return s5 < i7 ? -1 : s5 > i7 ? 1 : 0;
              });
              return n5.forEach(function(t6, e6) {
                t6.x = e6;
              }, this), e5.linkedSeries && e5.linkedSeries.forEach(function(e6) {
                let i7 = e6.options, s5 = i7.data;
                i7.dataSorting && i7.dataSorting.enabled || !s5 || (s5.forEach(function(i8, o6) {
                  s5[o6] = r4(e6, i8), t5[o6] && (s5[o6].x = t5[o6].x, s5[o6].index = o6);
                }), e6.setData(s5, false));
              }), t5;
            }
            getProcessedData(t5) {
              let e5 = this, i6 = e5.xAxis, s4 = e5.options, o5 = s4.cropThreshold, r4 = t5 || e5.getExtremesFromAll || s4.getExtremesFromAll, n5 = i6?.logarithmic, a5 = e5.isCartesian, h4, l4, d4 = 0, c4, p4, u5, g4 = e5.xData, f4 = e5.yData, m4 = false, x4 = g4.length;
              i6 && (p4 = (c4 = i6.getExtremes()).min, u5 = c4.max, m4 = !!(i6.categories && !i6.names.length)), a5 && e5.sorted && !r4 && (!o5 || x4 > o5 || e5.forceCrop) && (g4[x4 - 1] < p4 || g4[0] > u5 ? (g4 = [], f4 = []) : e5.yData && (g4[0] < p4 || g4[x4 - 1] > u5) && (g4 = (h4 = this.cropData(e5.xData, e5.yData, p4, u5)).xData, f4 = h4.yData, d4 = h4.start, l4 = true));
              let y4 = O2([n5 ? g4.map(n5.log2lin) : g4], () => e5.requireSorting && !m4 && T2(15, false, e5.chart));
              return { xData: g4, yData: f4, cropped: l4, cropStart: d4, closestPointRange: y4 };
            }
            processData(t5) {
              let e5 = this.xAxis;
              if (this.isCartesian && !this.isDirty && !e5.isDirty && !this.yAxis.isDirty && !t5)
                return false;
              let i6 = this.getProcessedData();
              this.cropped = i6.cropped, this.cropStart = i6.cropStart, this.processedXData = i6.xData, this.processedYData = i6.yData, this.closestPointRange = this.basePointRange = i6.closestPointRange, L2(this, "afterProcessData");
            }
            cropData(t5, e5, i6, s4) {
              let o5 = t5.length, r4, n5, a5 = 0, h4 = o5;
              for (r4 = 0; r4 < o5; r4++)
                if (t5[r4] >= i6) {
                  a5 = Math.max(0, r4 - 1);
                  break;
                }
              for (n5 = r4; n5 < o5; n5++)
                if (t5[n5] > s4) {
                  h4 = n5 + 1;
                  break;
                }
              return { xData: t5.slice(a5, h4), yData: e5.slice(a5, h4), start: a5, end: h4 };
            }
            generatePoints() {
              let t5 = this.options, e5 = this.processedData || t5.data, i6 = this.processedXData, s4 = this.processedYData, o5 = this.pointClass, r4 = i6.length, n5 = this.cropStart || 0, a5 = this.hasGroupedData, h4 = t5.keys, l4 = [], d4 = t5.dataGrouping && t5.dataGrouping.groupAll ? n5 : 0, c4, p4, u5, g4, f4 = this.data;
              if (!f4 && !a5) {
                let t6 = [];
                t6.length = e5.length, f4 = this.data = t6;
              }
              for (h4 && a5 && (this.options.keys = false), g4 = 0; g4 < r4; g4++)
                p4 = n5 + g4, a5 ? ((u5 = new o5(this, [i6[g4]].concat(G(s4[g4])))).dataGroup = this.groupMap[d4 + g4], u5.dataGroup.options && (u5.options = u5.dataGroup.options, A2(u5, u5.dataGroup.options), delete u5.dataLabels)) : (u5 = f4[p4]) || void 0 === e5[p4] || (f4[p4] = u5 = new o5(this, e5[p4], i6[g4])), u5 && (u5.index = a5 ? d4 + g4 : p4, l4[g4] = u5);
              if (this.options.keys = h4, f4 && (r4 !== (c4 = f4.length) || a5))
                for (g4 = 0; g4 < c4; g4++)
                  g4 !== n5 || a5 || (g4 += r4), f4[g4] && (f4[g4].destroyElements(), f4[g4].plotX = void 0);
              this.data = f4, this.points = l4, L2(this, "afterGeneratePoints");
            }
            getXExtremes(t5) {
              return { min: b3(t5), max: y3(t5) };
            }
            getExtremes(t5, e5) {
              let i6 = this.xAxis, s4 = this.yAxis, o5 = this.processedXData || this.xData, r4 = [], n5 = this.requireSorting && !this.is("column") ? 1 : 0, a5 = !!s4 && s4.positiveValuesOnly, h4, l4, d4, c4, p4, u5, g4, f4 = 0, m4 = 0, x4 = 0;
              t5 = t5 || this.stackedYData || this.processedYData || [];
              let v4 = t5.length;
              for (i6 && (f4 = (h4 = i6.getExtremes()).min, m4 = h4.max), u5 = 0; u5 < v4; u5++)
                if (c4 = o5[u5], l4 = (I2(p4 = t5[u5]) || j2(p4)) && ((I2(p4) ? p4 > 0 : p4.length) || !a5), d4 = e5 || this.getExtremesFromAll || this.options.getExtremesFromAll || this.cropped || !i6 || (o5[u5 + n5] || c4) >= f4 && (o5[u5 - n5] || c4) <= m4, l4 && d4) {
                  if (g4 = p4.length)
                    for (; g4--; )
                      I2(p4[g4]) && (r4[x4++] = p4[g4]);
                  else
                    r4[x4++] = p4;
                }
              let S4 = { activeYData: r4, dataMin: b3(r4), dataMax: y3(r4) };
              return L2(this, "afterGetExtremes", { dataExtremes: S4 }), S4;
            }
            applyExtremes() {
              let t5 = this.getExtremes();
              return this.dataMin = t5.dataMin, this.dataMax = t5.dataMax, t5;
            }
            getFirstValidPoint(t5) {
              let e5 = t5.length, i6 = 0, s4 = null;
              for (; null === s4 && i6 < e5; )
                s4 = t5[i6], i6++;
              return s4;
            }
            translate() {
              this.processedXData || this.processData(), this.generatePoints();
              let t5 = this.options, e5 = t5.stacking, i6 = this.xAxis, s4 = i6.categories, o5 = this.enabledDataSorting, r4 = this.yAxis, n5 = this.points, a5 = n5.length, h4 = this.pointPlacementToXValue(), l4 = !!h4, d4 = t5.threshold, c4 = t5.startFromThreshold ? d4 : 0, p4, u5, g4, f4, m4 = Number.MAX_VALUE;
              function x4(t6) {
                return v3(t6, -1e5, 1e5);
              }
              for (p4 = 0; p4 < a5; p4++) {
                let t6;
                let a6 = n5[p4], y4 = a6.x, b4, v4, M3 = a6.y, C4 = a6.low, w4 = e5 && r4.stacking?.stacks[(this.negStacks && M3 < (c4 ? 0 : d4) ? "-" : "") + this.stackKey];
                u5 = i6.translate(y4, false, false, false, true, h4), a6.plotX = I2(u5) ? S3(x4(u5)) : void 0, e5 && this.visible && w4 && w4[y4] && (f4 = this.getStackIndicator(f4, y4, this.index), !a6.isNull && f4.key && (v4 = (b4 = w4[y4]).points[f4.key]), b4 && j2(v4) && (C4 = v4[0], M3 = v4[1], C4 === c4 && f4.key === w4[y4].base && (C4 = N2(I2(d4) ? d4 : r4.min)), r4.positiveValuesOnly && k3(C4) && C4 <= 0 && (C4 = void 0), a6.total = a6.stackTotal = N2(b4.total), a6.percentage = k3(a6.y) && b4.total ? a6.y / b4.total * 100 : void 0, a6.stackY = M3, this.irregularWidths || b4.setOffset(this.pointXOffset || 0, this.barW || 0, void 0, void 0, void 0, this.xAxis))), a6.yBottom = k3(C4) ? x4(r4.translate(C4, false, true, false, true)) : void 0, this.dataModify && (M3 = this.dataModify.modifyValue(M3, p4)), I2(M3) && void 0 !== a6.plotX && (t6 = I2(t6 = r4.translate(M3, false, true, false, true)) ? x4(t6) : void 0), a6.plotY = t6, a6.isInside = this.isPointInside(a6), a6.clientX = l4 ? S3(i6.translate(y4, false, false, false, true, h4)) : u5, a6.negative = (a6.y || 0) < (d4 || 0), a6.category = N2(s4 && s4[a6.x], a6.x), a6.isNull || false === a6.visible || (void 0 !== g4 && (m4 = Math.min(m4, Math.abs(u5 - g4))), g4 = u5), a6.zone = this.zones.length ? a6.getZone() : void 0, !a6.graphic && this.group && o5 && (a6.isNew = true);
              }
              this.closestPointRangePx = m4, L2(this, "afterTranslate");
            }
            getValidPoints(t5, e5, i6) {
              let s4 = this.chart;
              return (t5 || this.points || []).filter(function(t6) {
                let { plotX: o5, plotY: r4 } = t6, n5 = !i6 && (t6.isNull || !I2(r4));
                return !n5 && (!e5 || !!s4.isInsidePlot(o5, r4, { inverted: s4.inverted })) && false !== t6.visible;
              });
            }
            getClipBox() {
              let { chart: t5, xAxis: e5, yAxis: i6 } = this, s4 = R(t5.clipBox);
              return e5 && e5.len !== t5.plotSizeX && (s4.width = e5.len), i6 && i6.len !== t5.plotSizeY && (s4.height = i6.len), s4;
            }
            getSharedClipKey() {
              return this.sharedClipKey = (this.options.xAxis || 0) + "," + (this.options.yAxis || 0), this.sharedClipKey;
            }
            setClip() {
              let { chart: t5, group: e5, markerGroup: i6 } = this, s4 = t5.sharedClips, o5 = t5.renderer, r4 = this.getClipBox(), n5 = this.getSharedClipKey(), a5 = s4[n5];
              a5 ? a5.animate(r4) : s4[n5] = a5 = o5.clipRect(r4), e5 && e5.clip(false === this.options.clip ? void 0 : a5), i6 && i6.clip();
            }
            animate(t5) {
              let { chart: e5, group: i6, markerGroup: s4 } = this, o5 = e5.inverted, r4 = d3(this.options.animation), n5 = [this.getSharedClipKey(), r4.duration, r4.easing, r4.defer].join(","), a5 = e5.sharedClips[n5], h4 = e5.sharedClips[n5 + "m"];
              if (t5 && i6) {
                let t6 = this.getClipBox();
                if (a5)
                  a5.attr("height", t6.height);
                else {
                  t6.width = 0, o5 && (t6.x = e5.plotHeight), a5 = e5.renderer.clipRect(t6), e5.sharedClips[n5] = a5;
                  let i7 = { x: -99, y: -99, width: o5 ? e5.plotWidth + 199 : 99, height: o5 ? 99 : e5.plotHeight + 199 };
                  h4 = e5.renderer.clipRect(i7), e5.sharedClips[n5 + "m"] = h4;
                }
                i6.clip(a5), s4 && s4.clip(h4);
              } else if (a5 && !a5.hasClass("highcharts-animating")) {
                let t6 = this.getClipBox(), e6 = r4.step;
                s4 && s4.element.childNodes.length && (r4.step = function(t7, i7) {
                  e6 && e6.apply(i7, arguments), "width" === i7.prop && h4 && h4.element && h4.attr(o5 ? "height" : "width", t7 + 99);
                }), a5.addClass("highcharts-animating").animate(t6, r4);
              }
            }
            afterAnimate() {
              this.setClip(), z2(this.chart.sharedClips, (t5, e5, i6) => {
                t5 && !this.chart.container.querySelector(`[clip-path="url(#${t5.id})"]`) && (t5.destroy(), delete i6[e5]);
              }), this.finishedAnimating = true, L2(this, "afterAnimate");
            }
            drawPoints(t5 = this.points) {
              let e5, i6, s4, o5, r4, n5, a5;
              let h4 = this.chart, l4 = h4.styledMode, { colorAxis: d4, options: c4 } = this, p4 = c4.marker, u5 = this[this.specialGroup || "markerGroup"], g4 = this.xAxis, f4 = N2(p4.enabled, !g4 || !!g4.isRadial || null, this.closestPointRangePx >= p4.enabledThreshold * p4.radius);
              if (false !== p4.enabled || this._hasPointMarkers)
                for (e5 = 0; e5 < t5.length; e5++) {
                  o5 = (s4 = (i6 = t5[e5]).graphic) ? "animate" : "attr", r4 = i6.marker || {}, n5 = !!i6.marker;
                  let c5 = (f4 && void 0 === r4.enabled || r4.enabled) && !i6.isNull && false !== i6.visible;
                  if (c5) {
                    let t6 = N2(r4.symbol, this.symbol, "rect");
                    a5 = this.markerAttribs(i6, i6.selected && "select"), this.enabledDataSorting && (i6.startXPos = g4.reversed ? -(a5.width || 0) : g4.width);
                    let e6 = false !== i6.isInside;
                    if (!s4 && e6 && ((a5.width || 0) > 0 || i6.hasImage) && (i6.graphic = s4 = h4.renderer.symbol(t6, a5.x, a5.y, a5.width, a5.height, n5 ? r4 : p4).add(u5), this.enabledDataSorting && h4.hasRendered && (s4.attr({ x: i6.startXPos }), o5 = "animate")), s4 && "animate" === o5 && s4[e6 ? "show" : "hide"](e6).animate(a5), s4) {
                      let t7 = this.pointAttribs(i6, l4 || !i6.selected ? void 0 : "select");
                      l4 ? d4 && s4.css({ fill: t7.fill }) : s4[o5](t7);
                    }
                    s4 && s4.addClass(i6.getClassName(), true);
                  } else
                    s4 && (i6.graphic = s4.destroy());
                }
            }
            markerAttribs(t5, e5) {
              let i6 = this.options, s4 = i6.marker, o5 = t5.marker || {}, r4 = o5.symbol || s4.symbol, n5 = {}, a5, h4, l4 = N2(o5.radius, s4 && s4.radius);
              e5 && (a5 = s4.states[e5], l4 = N2((h4 = o5.states && o5.states[e5]) && h4.radius, a5 && a5.radius, l4 && l4 + (a5 && a5.radiusPlus || 0))), t5.hasImage = r4 && 0 === r4.indexOf("url"), t5.hasImage && (l4 = 0);
              let d4 = t5.pos();
              return I2(l4) && d4 && (n5.x = d4[0] - l4, n5.y = d4[1] - l4, i6.crisp && (n5.x = Math.floor(n5.x))), l4 && (n5.width = n5.height = 2 * l4), n5;
            }
            pointAttribs(t5, e5) {
              let i6 = this.options.marker, s4 = t5 && t5.options, o5 = s4 && s4.marker || {}, r4 = s4 && s4.color, n5 = t5 && t5.color, a5 = t5 && t5.zone && t5.zone.color, h4, l4, d4 = this.color, c4, p4, u5 = N2(o5.lineWidth, i6.lineWidth), g4 = 1;
              return d4 = r4 || a5 || n5 || d4, c4 = o5.fillColor || i6.fillColor || d4, p4 = o5.lineColor || i6.lineColor || d4, e5 = e5 || "normal", h4 = i6.states[e5] || {}, u5 = N2((l4 = o5.states && o5.states[e5] || {}).lineWidth, h4.lineWidth, u5 + N2(l4.lineWidthPlus, h4.lineWidthPlus, 0)), c4 = l4.fillColor || h4.fillColor || c4, { stroke: p4 = l4.lineColor || h4.lineColor || p4, "stroke-width": u5, fill: c4, opacity: g4 = N2(l4.opacity, h4.opacity, g4) };
            }
            destroy(t5) {
              let e5, i6, s4;
              let o5 = this, r4 = o5.chart, n5 = /AppleWebKit\/533/.test(m3.navigator.userAgent), a5 = o5.data || [];
              for (L2(o5, "destroy", { keepEventsForUpdate: t5 }), this.removeEvents(t5), (o5.axisTypes || []).forEach(function(t6) {
                (s4 = o5[t6]) && s4.series && (w3(s4.series, o5), s4.isDirty = s4.forceRedraw = true);
              }), o5.legendItem && o5.chart.legend.destroyItem(o5), e5 = a5.length; e5--; )
                (i6 = a5[e5]) && i6.destroy && i6.destroy();
              o5.zones.forEach(M2), l3.clearTimeout(o5.animationTimeout), z2(o5, function(t6, e6) {
                t6 instanceof h3 && !t6.survive && t6[n5 && "group" === e6 ? "hide" : "destroy"]();
              }), r4.hoverSeries === o5 && (r4.hoverSeries = void 0), w3(r4.series, o5), r4.orderItems("series"), z2(o5, function(e6, i7) {
                t5 && "hcEvents" === i7 || delete o5[i7];
              });
            }
            applyZones() {
              let { area: t5, chart: e5, graph: i6, zones: s4, points: o5, xAxis: r4, yAxis: n5, zoneAxis: a5 } = this, { inverted: h4, renderer: l4 } = e5, d4 = this[`${a5}Axis`], { isXAxis: c4, len: p4 = 0 } = d4 || {}, u5 = (i6?.strokeWidth() || 0) / 2 + 1, g4 = (t6, e6 = 0, i7 = 0) => {
                h4 && (i7 = p4 - i7);
                let { translated: s5 = 0, lineClip: o6 } = t6, r5 = i7 - s5;
                o6?.push(["L", e6, Math.abs(r5) < u5 ? i7 - u5 * (r5 <= 0 ? -1 : 1) : s5]);
              };
              if (s4.length && (i6 || t5) && d4 && I2(d4.min)) {
                let e6 = d4.getExtremes().max, u6 = (t6) => {
                  t6.forEach((e7, i7) => {
                    ("M" === e7[0] || "L" === e7[0]) && (t6[i7] = [e7[0], c4 ? p4 - e7[1] : e7[1], c4 ? e7[2] : p4 - e7[2]]);
                  });
                };
                if (s4.forEach((t6, i7) => {
                  t6.lineClip = [], t6.translated = v3(d4.toPixels(N2(t6.value, e6), true) || 0, 0, p4);
                }), i6 && !this.showLine && i6.hide(), t5 && t5.hide(), "y" === a5 && o5.length < r4.len)
                  for (let t6 of o5) {
                    let { plotX: e7, plotY: i7, zone: o6 } = t6, r5 = o6 && s4[s4.indexOf(o6) - 1];
                    o6 && g4(o6, e7, i7), r5 && g4(r5, e7, i7);
                  }
                let f4 = [], m4 = d4.toPixels(d4.getExtremes().min, true);
                s4.forEach((e7) => {
                  let s5 = e7.lineClip || [], o6 = Math.round(e7.translated || 0);
                  r4.reversed && s5.reverse();
                  let { clip: a6, simpleClip: d5 } = e7, p5 = 0, g5 = 0, x4 = r4.len, y4 = n5.len;
                  c4 ? (p5 = o6, x4 = m4) : (g5 = o6, y4 = m4);
                  let b4 = [["M", p5, g5], ["L", x4, g5], ["L", x4, y4], ["L", p5, y4], ["Z"]], v4 = [b4[0], ...s5, b4[1], b4[2], ...f4, b4[3], b4[4]];
                  f4 = s5.reverse(), m4 = o6, h4 && (u6(v4), t5 && u6(b4)), a6 ? (a6.animate({ d: v4 }), d5?.animate({ d: b4 })) : (a6 = e7.clip = l4.path(v4), t5 && (d5 = e7.simpleClip = l4.path(b4))), i6 && e7.graph?.clip(a6), t5 && e7.area?.clip(d5);
                });
              } else
                this.visible && (i6 && i6.show(), t5 && t5.show());
            }
            plotGroup(t5, e5, i6, s4, o5) {
              let r4 = this[t5], n5 = !r4, a5 = { visibility: i6, zIndex: s4 || 0.1 };
              return k3(this.opacity) && !this.chart.styledMode && "inactive" !== this.state && (a5.opacity = this.opacity), r4 || (this[t5] = r4 = this.chart.renderer.g().add(o5)), r4.addClass("highcharts-" + e5 + " highcharts-series-" + this.index + " highcharts-" + this.type + "-series " + (k3(this.colorIndex) ? "highcharts-color-" + this.colorIndex + " " : "") + (this.options.className || "") + (r4.hasClass("highcharts-tracker") ? " highcharts-tracker" : ""), true), r4.attr(a5)[n5 ? "attr" : "animate"](this.getPlotBox(e5)), r4;
            }
            getPlotBox(t5) {
              let e5 = this.xAxis, i6 = this.yAxis, s4 = this.chart, o5 = s4.inverted && !s4.polar && e5 && false !== this.invertible && "series" === t5;
              return s4.inverted && (e5 = i6, i6 = this.xAxis), { translateX: e5 ? e5.left : s4.plotLeft, translateY: i6 ? i6.top : s4.plotTop, rotation: o5 ? 90 : 0, rotationOriginX: o5 ? (e5.len - i6.len) / 2 : 0, rotationOriginY: o5 ? (e5.len + i6.len) / 2 : 0, scaleX: o5 ? -1 : 1, scaleY: 1 };
            }
            removeEvents(t5) {
              let { eventsToUnbind: e5 } = this;
              t5 || W(this), e5.length && (e5.forEach((t6) => {
                t6();
              }), e5.length = 0);
            }
            render() {
              let t5 = this, { chart: e5, options: i6, hasRendered: s4 } = t5, o5 = d3(i6.animation), r4 = t5.visible ? "inherit" : "hidden", n5 = i6.zIndex, a5 = e5.seriesGroup, h4 = t5.finishedAnimating ? 0 : o5.duration;
              L2(this, "render"), t5.plotGroup("group", "series", r4, n5, a5), t5.markerGroup = t5.plotGroup("markerGroup", "markers", r4, n5, a5), false !== i6.clip && t5.setClip(), h4 && t5.animate?.(true), t5.drawGraph && (t5.drawGraph(), t5.applyZones()), t5.visible && t5.drawPoints(), t5.drawDataLabels?.(), t5.redrawPoints?.(), i6.enableMouseTracking && t5.drawTracker?.(), h4 && t5.animate?.(), s4 || (h4 && o5.defer && (h4 += o5.defer), t5.animationTimeout = H(() => {
                t5.afterAnimate();
              }, h4 || 0)), t5.isDirty = false, t5.hasRendered = true, L2(t5, "afterRender");
            }
            redraw() {
              let t5 = this.isDirty || this.isDirtyData;
              this.translate(), this.render(), t5 && delete this.kdTree;
            }
            reserveSpace() {
              return this.visible || !this.chart.options.chart.ignoreHiddenSeries;
            }
            searchPoint(t5, e5) {
              let { xAxis: i6, yAxis: s4 } = this, o5 = this.chart.inverted;
              return this.searchKDTree({ clientX: o5 ? i6.len - t5.chartY + i6.pos : t5.chartX - i6.pos, plotY: o5 ? s4.len - t5.chartX + s4.pos : t5.chartY - s4.pos }, e5, t5);
            }
            buildKDTree(t5) {
              this.buildingKdTree = true;
              let e5 = this, i6 = e5.options.findNearestPointBy.indexOf("y") > -1 ? 2 : 1;
              delete e5.kdTree, H(function() {
                e5.kdTree = function t6(i7, s4, o5) {
                  let r4, n5;
                  let a5 = i7?.length;
                  if (a5)
                    return r4 = e5.kdAxisArray[s4 % o5], i7.sort((t7, e6) => (t7[r4] || 0) - (e6[r4] || 0)), { point: i7[n5 = Math.floor(a5 / 2)], left: t6(i7.slice(0, n5), s4 + 1, o5), right: t6(i7.slice(n5 + 1), s4 + 1, o5) };
                }(e5.getValidPoints(void 0, !e5.directTouch), i6, i6), e5.buildingKdTree = false;
              }, e5.options.kdNow || t5?.type === "touchstart" ? 0 : 1);
            }
            searchKDTree(t5, e5, i6) {
              let s4 = this, [o5, r4] = this.kdAxisArray, n5 = e5 ? "distX" : "dist", a5 = (s4.options.findNearestPointBy || "").indexOf("y") > -1 ? 2 : 1, h4 = !!s4.isBubble;
              if (this.kdTree || this.buildingKdTree || this.buildKDTree(i6), this.kdTree)
                return function t6(e6, i7, a6, l4) {
                  let d4 = i7.point, c4 = s4.kdAxisArray[a6 % l4], p4, u5, g4 = d4;
                  !function(t7, e7) {
                    let i8 = t7[o5], s5 = e7[o5], n6 = k3(i8) && k3(s5) ? i8 - s5 : null, a7 = t7[r4], l5 = e7[r4], d5 = k3(a7) && k3(l5) ? a7 - l5 : 0, c5 = h4 && e7.marker?.radius || 0;
                    e7.dist = Math.sqrt((n6 && n6 * n6 || 0) + d5 * d5) - c5, e7.distX = k3(n6) ? Math.abs(n6) - c5 : Number.MAX_VALUE;
                  }(e6, d4);
                  let f4 = (e6[c4] || 0) - (d4[c4] || 0) + (h4 && d4.marker?.radius || 0), m4 = f4 < 0 ? "left" : "right", x4 = f4 < 0 ? "right" : "left";
                  return i7[m4] && (g4 = (p4 = t6(e6, i7[m4], a6 + 1, l4))[n5] < g4[n5] ? p4 : d4), i7[x4] && Math.sqrt(f4 * f4) < g4[n5] && (g4 = (u5 = t6(e6, i7[x4], a6 + 1, l4))[n5] < g4[n5] ? u5 : g4), g4;
                }(t5, this.kdTree, a5, a5);
            }
            pointPlacementToXValue() {
              let { options: t5, xAxis: e5 } = this, i6 = t5.pointPlacement;
              return "between" === i6 && (i6 = e5.reversed ? -0.5 : 0.5), I2(i6) ? i6 * (t5.pointRange || e5.pointRange) : 0;
            }
            isPointInside(t5) {
              let { chart: e5, xAxis: i6, yAxis: s4 } = this, { plotX: o5 = -1, plotY: r4 = -1 } = t5, n5 = r4 >= 0 && r4 <= (s4 ? s4.len : e5.plotHeight) && o5 >= 0 && o5 <= (i6 ? i6.len : e5.plotWidth);
              return n5;
            }
            drawTracker() {
              let t5 = this, e5 = t5.options, i6 = e5.trackByArea, s4 = [].concat((i6 ? t5.areaPath : t5.graphPath) || []), o5 = t5.chart, r4 = o5.pointer, n5 = o5.renderer, a5 = o5.options.tooltip?.snap || 0, h4 = () => {
                e5.enableMouseTracking && o5.hoverSeries !== t5 && t5.onMouseOver();
              }, l4 = "rgba(192,192,192," + (f3 ? 1e-4 : 2e-3) + ")", d4 = t5.tracker;
              d4 ? d4.attr({ d: s4 }) : t5.graph && (t5.tracker = d4 = n5.path(s4).attr({ visibility: t5.visible ? "inherit" : "hidden", zIndex: 2 }).addClass(i6 ? "highcharts-tracker-area" : "highcharts-tracker-line").add(t5.group), o5.styledMode || d4.attr({ "stroke-linecap": "round", "stroke-linejoin": "round", stroke: l4, fill: i6 ? l4 : "none", "stroke-width": t5.graph.strokeWidth() + (i6 ? 0 : 2 * a5) }), [t5.tracker, t5.markerGroup, t5.dataLabelsGroup].forEach((t6) => {
                t6 && (t6.addClass("highcharts-tracker").on("mouseover", h4).on("mouseout", (t7) => {
                  r4.onTrackerMouseOut(t7);
                }), e5.cursor && !o5.styledMode && t6.css({ cursor: e5.cursor }), g3 && t6.on("touchstart", h4));
              })), L2(this, "afterDrawTracker");
            }
            addPoint(t5, e5, i6, s4, o5) {
              let r4, n5;
              let a5 = this.options, h4 = this.data, l4 = this.chart, d4 = this.xAxis, c4 = d4 && d4.hasNames && d4.names, p4 = a5.data, u5 = this.xData;
              e5 = N2(e5, true);
              let g4 = { series: this };
              this.pointClass.prototype.applyOptions.apply(g4, [t5]);
              let f4 = g4.x;
              if (n5 = u5.length, this.requireSorting && f4 < u5[n5 - 1])
                for (r4 = true; n5 && u5[n5 - 1] > f4; )
                  n5--;
              this.updateParallelArrays(g4, "splice", [n5, 0, 0]), this.updateParallelArrays(g4, n5), c4 && g4.name && (c4[f4] = g4.name), p4.splice(n5, 0, t5), (r4 || this.processedData) && (this.data.splice(n5, 0, null), this.processData()), "point" === a5.legendType && this.generatePoints(), i6 && (h4[0] && h4[0].remove ? h4[0].remove(false) : (h4.shift(), this.updateParallelArrays(g4, "shift"), p4.shift())), false !== o5 && L2(this, "addPoint", { point: g4 }), this.isDirty = true, this.isDirtyData = true, e5 && l4.redraw(s4);
            }
            removePoint(t5, e5, i6) {
              let s4 = this, o5 = s4.data, r4 = o5[t5], n5 = s4.points, a5 = s4.chart, h4 = function() {
                n5 && n5.length === o5.length && n5.splice(t5, 1), o5.splice(t5, 1), s4.options.data.splice(t5, 1), s4.updateParallelArrays(r4 || { series: s4 }, "splice", [t5, 1]), r4 && r4.destroy(), s4.isDirty = true, s4.isDirtyData = true, e5 && a5.redraw();
              };
              c3(i6, a5), e5 = N2(e5, true), r4 ? r4.firePointEvent("remove", null, h4) : h4();
            }
            remove(t5, e5, i6, s4) {
              let o5 = this, r4 = o5.chart;
              function n5() {
                o5.destroy(s4), r4.isDirtyLegend = r4.isDirtyBox = true, r4.linkSeries(s4), N2(t5, true) && r4.redraw(e5);
              }
              false !== i6 ? L2(o5, "remove", null, n5) : n5();
            }
            update(t5, e5) {
              L2(this, "update", { options: t5 = C3(t5, this.userOptions) });
              let i6 = this, s4 = i6.chart, o5 = i6.userOptions, r4 = i6.initialType || i6.type, n5 = s4.options.plotOptions, a5 = x3[r4].prototype, h4 = i6.finishedAnimating && { animation: false }, l4 = {}, d4, c4, p4 = ["colorIndex", "eventOptions", "navigatorSeries", "symbolIndex", "baseSeries"], u5 = t5.type || o5.type || s4.options.chart.type, g4 = !(this.hasDerivedData || u5 && u5 !== this.type || void 0 !== t5.pointStart || void 0 !== t5.pointInterval || void 0 !== t5.relativeXValue || t5.joinBy || t5.mapData || ["dataGrouping", "pointStart", "pointInterval", "pointIntervalUnit", "keys"].some((t6) => i6.hasOptionChanged(t6)));
              u5 = u5 || r4, g4 && (p4.push("data", "isDirtyData", "isDirtyCanvas", "points", "processedData", "processedXData", "processedYData", "xIncrement", "cropped", "_hasPointMarkers", "hasDataLabels", "nodes", "layout", "level", "mapMap", "mapData", "minY", "maxY", "minX", "maxX"), false !== t5.visible && p4.push("area", "graph"), i6.parallelArrays.forEach(function(t6) {
                p4.push(t6 + "Data");
              }), t5.data && (t5.dataSorting && A2(i6.options.dataSorting, t5.dataSorting), this.setData(t5.data, false))), t5 = R(o5, { index: void 0 === o5.index ? i6.index : o5.index, pointStart: n5?.series?.pointStart ?? o5.pointStart ?? i6.xData?.[0] }, !g4 && { data: i6.options.data }, t5, h4), g4 && t5.data && (t5.data = i6.options.data), (p4 = ["group", "markerGroup", "dataLabelsGroup", "transformGroup"].concat(p4)).forEach(function(t6) {
                p4[t6] = i6[t6], delete i6[t6];
              });
              let f4 = false;
              if (x3[u5]) {
                if (f4 = u5 !== i6.type, i6.remove(false, false, false, true), f4) {
                  if (Object.setPrototypeOf)
                    Object.setPrototypeOf(i6, x3[u5].prototype);
                  else {
                    let t6 = Object.hasOwnProperty.call(i6, "hcEvents") && i6.hcEvents;
                    for (c4 in a5)
                      i6[c4] = void 0;
                    A2(i6, x3[u5].prototype), t6 ? i6.hcEvents = t6 : delete i6.hcEvents;
                  }
                }
              } else
                T2(17, true, s4, { missingModuleFor: u5 });
              if (p4.forEach(function(t6) {
                i6[t6] = p4[t6];
              }), i6.init(s4, t5), g4 && this.points)
                for (let t6 of (false === (d4 = i6.options).visible ? (l4.graphic = 1, l4.dataLabel = 1) : (this.hasMarkerChanged(d4, o5) && (l4.graphic = 1), i6.hasDataLabels?.() || (l4.dataLabel = 1)), this.points))
                  t6 && t6.series && (t6.resolveColor(), Object.keys(l4).length && t6.destroyElements(l4), false === d4.showInLegend && t6.legendItem && s4.legend.destroyItem(t6));
              i6.initialType = r4, s4.linkSeries(), s4.setSortedData(), f4 && i6.linkedSeries.length && (i6.isDirtyData = true), L2(this, "afterUpdate"), N2(e5, true) && s4.redraw(!!g4 && void 0);
            }
            setName(t5) {
              this.name = this.options.name = this.userOptions.name = t5, this.chart.isDirtyLegend = true;
            }
            hasOptionChanged(t5) {
              let e5 = this.chart, i6 = this.options[t5], s4 = e5.options.plotOptions, o5 = this.userOptions[t5], r4 = N2(s4?.[this.type]?.[t5], s4?.series?.[t5]);
              return o5 && !k3(r4) ? i6 !== o5 : i6 !== N2(r4, i6);
            }
            onMouseOver() {
              let t5 = this.chart, e5 = t5.hoverSeries, i6 = t5.pointer;
              i6.setHoverChartIndex(), e5 && e5 !== this && e5.onMouseOut(), this.options.events.mouseOver && L2(this, "mouseOver"), this.setState("hover"), t5.hoverSeries = this;
            }
            onMouseOut() {
              let t5 = this.options, e5 = this.chart, i6 = e5.tooltip, s4 = e5.hoverPoint;
              e5.hoverSeries = null, s4 && s4.onMouseOut(), this && t5.events.mouseOut && L2(this, "mouseOut"), i6 && !this.stickyTracking && (!i6.shared || this.noSharedTooltip) && i6.hide(), e5.series.forEach(function(t6) {
                t6.setState("", true);
              });
            }
            setState(t5, e5) {
              let i6 = this, s4 = i6.options, o5 = i6.graph, r4 = s4.inactiveOtherPoints, n5 = s4.states, a5 = N2(n5[t5 || "normal"] && n5[t5 || "normal"].animation, i6.chart.options.chart.animation), h4 = s4.lineWidth, l4 = s4.opacity;
              if (t5 = t5 || "", i6.state !== t5 && ([i6.group, i6.markerGroup, i6.dataLabelsGroup].forEach(function(e6) {
                e6 && (i6.state && e6.removeClass("highcharts-series-" + i6.state), t5 && e6.addClass("highcharts-series-" + t5));
              }), i6.state = t5, !i6.chart.styledMode)) {
                if (n5[t5] && false === n5[t5].enabled)
                  return;
                if (t5 && (h4 = n5[t5].lineWidth || h4 + (n5[t5].lineWidthPlus || 0), l4 = N2(n5[t5].opacity, l4)), o5 && !o5.dashstyle && I2(h4))
                  for (let t6 of [o5, ...this.zones.map((t7) => t7.graph)])
                    t6?.animate({ "stroke-width": h4 }, a5);
                r4 || [i6.group, i6.markerGroup, i6.dataLabelsGroup, i6.labelBySeries].forEach(function(t6) {
                  t6 && t6.animate({ opacity: l4 }, a5);
                });
              }
              e5 && r4 && i6.points && i6.setAllPointsToState(t5 || void 0);
            }
            setAllPointsToState(t5) {
              this.points.forEach(function(e5) {
                e5.setState && e5.setState(t5);
              });
            }
            setVisible(t5, e5) {
              let i6 = this, s4 = i6.chart, o5 = s4.options.chart.ignoreHiddenSeries, r4 = i6.visible;
              i6.visible = t5 = i6.options.visible = i6.userOptions.visible = void 0 === t5 ? !r4 : t5;
              let n5 = t5 ? "show" : "hide";
              ["group", "dataLabelsGroup", "markerGroup", "tracker", "tt"].forEach((t6) => {
                i6[t6]?.[n5]();
              }), (s4.hoverSeries === i6 || s4.hoverPoint?.series === i6) && i6.onMouseOut(), i6.legendItem && s4.legend.colorizeItem(i6, t5), i6.isDirty = true, i6.options.stacking && s4.series.forEach((t6) => {
                t6.options.stacking && t6.visible && (t6.isDirty = true);
              }), i6.linkedSeries.forEach((e6) => {
                e6.setVisible(t5, false);
              }), o5 && (s4.isDirtyBox = true), L2(i6, n5), false !== e5 && s4.redraw();
            }
            show() {
              this.setVisible(true);
            }
            hide() {
              this.setVisible(false);
            }
            select(t5) {
              this.selected = t5 = this.options.selected = void 0 === t5 ? !this.selected : t5, this.checkbox && (this.checkbox.checked = t5), L2(this, t5 ? "select" : "unselect");
            }
            shouldShowTooltip(t5, e5, i6 = {}) {
              return i6.series = this, i6.visiblePlotOnly = true, this.chart.isInsidePlot(t5, e5, i6);
            }
            drawLegendSymbol(t5, e5) {
              o4[this.options.legendSymbol || "rectangle"]?.call(this, t5, e5);
            }
          }
          return X.defaultOptions = n4, X.types = a4.seriesTypes, X.registerType = a4.registerSeriesType, A2(X.prototype, { axisTypes: ["xAxis", "yAxis"], coll: "series", colorCounter: 0, directTouch: false, isCartesian: true, kdAxisArray: ["clientX", "plotY"], parallelArrays: ["x", "y"], pointClass: r3, requireSorting: true, sorted: true }), a4.series = X, X;
        }), i4(e3, "Core/Chart/Chart.js", [e3["Core/Animation/AnimationUtilities.js"], e3["Core/Axis/Axis.js"], e3["Core/Defaults.js"], e3["Core/Templating.js"], e3["Core/Foundation.js"], e3["Core/Globals.js"], e3["Core/Renderer/RendererRegistry.js"], e3["Core/Series/Series.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Renderer/SVG/SVGRenderer.js"], e3["Core/Time.js"], e3["Core/Utilities.js"], e3["Core/Renderer/HTML/AST.js"], e3["Core/Axis/Tick.js"]], function(t4, e4, i5, s3, o4, r3, n4, a4, h3, l3, d3, c3, p3, u4) {
          let { animate: g3, animObject: f3, setAnimation: m3 } = t4, { defaultOptions: x3, defaultTime: y3 } = i5, { numberFormat: b3 } = s3, { registerEventOptions: v3 } = o4, { charts: S3, doc: k3, marginNames: M2, svg: C3, win: w3 } = r3, { seriesTypes: T2 } = h3, { addEvent: A2, attr: P2, createElement: L2, clamp: O2, css: D2, defined: E, diffObjects: j2, discardElement: I2, erase: B, error: R, extend: z2, find: N2, fireEvent: W, getStyle: G, isArray: H, isNumber: X, isObject: F, isString: Y, merge: U, objectEach: V, pick: $2, pInt: Z, relativeLength: _2, removeEvent: q2, splat: K, syncTimeout: J, uniqueKey: Q } = c3;
          class tt {
            static chart(t5, e5, i6) {
              return new tt(t5, e5, i6);
            }
            constructor(t5, e5, i6) {
              this.sharedClips = {};
              let s4 = [...arguments];
              (Y(t5) || t5.nodeName) && (this.renderTo = s4.shift()), this.init(s4[0], s4[1]);
            }
            setZoomOptions() {
              let t5 = this.options.chart, e5 = t5.zooming;
              this.zooming = { ...e5, type: $2(t5.zoomType, e5.type), key: $2(t5.zoomKey, e5.key), pinchType: $2(t5.pinchType, e5.pinchType), singleTouch: $2(t5.zoomBySingleTouch, e5.singleTouch, false), resetButton: U(e5.resetButton, t5.resetZoomButton) };
            }
            init(t5, e5) {
              W(this, "init", { args: arguments }, function() {
                let i6 = U(x3, t5), s4 = i6.chart;
                this.userOptions = z2({}, t5), this.margin = [], this.spacing = [], this.bounds = { h: {}, v: {} }, this.labelCollectors = [], this.callback = e5, this.isResizing = 0, this.options = i6, this.axes = [], this.series = [], this.time = t5.time && Object.keys(t5.time).length ? new d3(t5.time) : r3.time, this.numberFormatter = s4.numberFormatter || b3, this.styledMode = s4.styledMode, this.hasCartesianSeries = s4.showAxes, this.index = S3.length, S3.push(this), r3.chartCount++, v3(this, s4), this.xAxis = [], this.yAxis = [], this.pointCount = this.colorCounter = this.symbolCounter = 0, this.setZoomOptions(), W(this, "afterInit"), this.firstRender();
              });
            }
            initSeries(t5) {
              let e5 = this.options.chart, i6 = t5.type || e5.type, s4 = T2[i6];
              s4 || R(17, true, this, { missingModuleFor: i6 });
              let o5 = new s4();
              return "function" == typeof o5.init && o5.init(this, t5), o5;
            }
            setSortedData() {
              this.getSeriesOrderByLinks().forEach(function(t5) {
                t5.points || t5.data || !t5.enabledDataSorting || t5.setData(t5.options.data, false);
              });
            }
            getSeriesOrderByLinks() {
              return this.series.concat().sort(function(t5, e5) {
                return t5.linkedSeries.length || e5.linkedSeries.length ? e5.linkedSeries.length - t5.linkedSeries.length : 0;
              });
            }
            orderItems(t5, e5 = 0) {
              let i6 = this[t5], s4 = this.options[t5] = K(this.options[t5]).slice(), o5 = this.userOptions[t5] = this.userOptions[t5] ? K(this.userOptions[t5]).slice() : [];
              if (this.hasRendered && (s4.splice(e5), o5.splice(e5)), i6)
                for (let t6 = e5, r4 = i6.length; t6 < r4; ++t6) {
                  let e6 = i6[t6];
                  e6 && (e6.index = t6, e6 instanceof a4 && (e6.name = e6.getName()), e6.options.isInternal || (s4[t6] = e6.options, o5[t6] = e6.userOptions));
                }
            }
            isInsidePlot(t5, e5, i6 = {}) {
              let { inverted: s4, plotBox: o5, plotLeft: r4, plotTop: n5, scrollablePlotBox: a5 } = this, h4 = 0, l4 = 0;
              i6.visiblePlotOnly && this.scrollingContainer && ({ scrollLeft: h4, scrollTop: l4 } = this.scrollingContainer);
              let d4 = i6.series, c4 = i6.visiblePlotOnly && a5 || o5, p4 = i6.inverted ? e5 : t5, u5 = i6.inverted ? t5 : e5, g4 = { x: p4, y: u5, isInsidePlot: true, options: i6 };
              if (!i6.ignoreX) {
                let t6 = d4 && (s4 && !this.polar ? d4.yAxis : d4.xAxis) || { pos: r4, len: 1 / 0 }, e6 = i6.paneCoordinates ? t6.pos + p4 : r4 + p4;
                e6 >= Math.max(h4 + r4, t6.pos) && e6 <= Math.min(h4 + r4 + c4.width, t6.pos + t6.len) || (g4.isInsidePlot = false);
              }
              if (!i6.ignoreY && g4.isInsidePlot) {
                let t6 = !s4 && i6.axis && !i6.axis.isXAxis && i6.axis || d4 && (s4 ? d4.xAxis : d4.yAxis) || { pos: n5, len: 1 / 0 }, e6 = i6.paneCoordinates ? t6.pos + u5 : n5 + u5;
                e6 >= Math.max(l4 + n5, t6.pos) && e6 <= Math.min(l4 + n5 + c4.height, t6.pos + t6.len) || (g4.isInsidePlot = false);
              }
              return W(this, "afterIsInsidePlot", g4), g4.isInsidePlot;
            }
            redraw(t5) {
              W(this, "beforeRedraw");
              let e5 = this.hasCartesianSeries ? this.axes : this.colorAxis || [], i6 = this.series, s4 = this.pointer, o5 = this.legend, r4 = this.userOptions.legend, n5 = this.renderer, a5 = n5.isHidden(), h4 = [], l4, d4, c4, p4 = this.isDirtyBox, u5 = this.isDirtyLegend, g4;
              for (n5.rootFontSize = n5.boxWrapper.getStyle("font-size"), this.setResponsive && this.setResponsive(false), m3(!!this.hasRendered && t5, this), a5 && this.temporaryDisplay(), this.layOutTitles(false), c4 = i6.length; c4--; )
                if (((g4 = i6[c4]).options.stacking || g4.options.centerInCategory) && (d4 = true, g4.isDirty)) {
                  l4 = true;
                  break;
                }
              if (l4)
                for (c4 = i6.length; c4--; )
                  (g4 = i6[c4]).options.stacking && (g4.isDirty = true);
              i6.forEach(function(t6) {
                t6.isDirty && ("point" === t6.options.legendType ? ("function" == typeof t6.updateTotals && t6.updateTotals(), u5 = true) : r4 && (r4.labelFormatter || r4.labelFormat) && (u5 = true)), t6.isDirtyData && W(t6, "updatedData");
              }), u5 && o5 && o5.options.enabled && (o5.render(), this.isDirtyLegend = false), d4 && this.getStacks(), e5.forEach(function(t6) {
                t6.updateNames(), t6.setScale();
              }), this.getMargins(), e5.forEach(function(t6) {
                t6.isDirty && (p4 = true);
              }), e5.forEach(function(t6) {
                let e6 = t6.min + "," + t6.max;
                t6.extKey !== e6 && (t6.extKey = e6, h4.push(function() {
                  W(t6, "afterSetExtremes", z2(t6.eventArgs, t6.getExtremes())), delete t6.eventArgs;
                })), (p4 || d4) && t6.redraw();
              }), p4 && this.drawChartBox(), W(this, "predraw"), i6.forEach(function(t6) {
                (p4 || t6.isDirty) && t6.visible && t6.redraw(), t6.isDirtyData = false;
              }), s4 && s4.reset(true), n5.draw(), W(this, "redraw"), W(this, "render"), a5 && this.temporaryDisplay(true), h4.forEach(function(t6) {
                t6.call();
              });
            }
            get(t5) {
              let e5 = this.series;
              function i6(e6) {
                return e6.id === t5 || e6.options && e6.options.id === t5;
              }
              let s4 = N2(this.axes, i6) || N2(this.series, i6);
              for (let t6 = 0; !s4 && t6 < e5.length; t6++)
                s4 = N2(e5[t6].points || [], i6);
              return s4;
            }
            getAxes() {
              let t5 = this.userOptions;
              for (let i6 of (W(this, "getAxes"), ["xAxis", "yAxis"])) {
                let s4 = t5[i6] = K(t5[i6] || {});
                for (let t6 of s4)
                  new e4(this, t6, i6);
              }
              W(this, "afterGetAxes");
            }
            getSelectedPoints() {
              return this.series.reduce((t5, e5) => (e5.getPointsCollection().forEach((e6) => {
                $2(e6.selectedStaging, e6.selected) && t5.push(e6);
              }), t5), []);
            }
            getSelectedSeries() {
              return this.series.filter(function(t5) {
                return t5.selected;
              });
            }
            setTitle(t5, e5, i6) {
              this.applyDescription("title", t5), this.applyDescription("subtitle", e5), this.applyDescription("caption", void 0), this.layOutTitles(i6);
            }
            applyDescription(t5, e5) {
              let i6 = this, s4 = this.options[t5] = U(this.options[t5], e5), o5 = this[t5];
              o5 && e5 && (this[t5] = o5 = o5.destroy()), s4 && !o5 && ((o5 = this.renderer.text(s4.text, 0, 0, s4.useHTML).attr({ align: s4.align, class: "highcharts-" + t5, zIndex: s4.zIndex || 4 }).add()).update = function(e6, s5) {
                i6.applyDescription(t5, e6), i6.layOutTitles(s5);
              }, this.styledMode || o5.css(z2("title" === t5 ? { fontSize: this.options.isStock ? "1em" : "1.2em" } : {}, s4.style)), this[t5] = o5);
            }
            layOutTitles(t5 = true) {
              let e5 = [0, 0, 0], i6 = this.renderer, s4 = this.spacingBox;
              ["title", "subtitle", "caption"].forEach(function(t6) {
                let o6 = this[t6], r4 = this.options[t6], n5 = r4.verticalAlign || "top", a5 = "title" === t6 ? "top" === n5 ? -3 : 0 : "top" === n5 ? e5[0] + 2 : 0;
                if (o6) {
                  o6.css({ width: (r4.width || s4.width + (r4.widthAdjust || 0)) + "px" });
                  let t7 = i6.fontMetrics(o6).b, h4 = Math.round(o6.getBBox(r4.useHTML).height);
                  o6.align(z2({ y: "bottom" === n5 ? t7 : a5 + t7, height: h4 }, r4), false, "spacingBox"), r4.floating || ("top" === n5 ? e5[0] = Math.ceil(e5[0] + h4) : "bottom" === n5 && (e5[2] = Math.ceil(e5[2] + h4)));
                }
              }, this), e5[0] && "top" === (this.options.title.verticalAlign || "top") && (e5[0] += this.options.title.margin), e5[2] && "bottom" === this.options.caption.verticalAlign && (e5[2] += this.options.caption.margin);
              let o5 = !this.titleOffset || this.titleOffset.join(",") !== e5.join(",");
              this.titleOffset = e5, W(this, "afterLayOutTitles"), !this.isDirtyBox && o5 && (this.isDirtyBox = this.isDirtyLegend = o5, this.hasRendered && t5 && this.isDirtyBox && this.redraw());
            }
            getContainerBox() {
              return { width: G(this.renderTo, "width", true) || 0, height: G(this.renderTo, "height", true) || 0 };
            }
            getChartSize() {
              let t5 = this.options.chart, e5 = t5.width, i6 = t5.height, s4 = this.getContainerBox();
              this.chartWidth = Math.max(0, e5 || s4.width || 600), this.chartHeight = Math.max(0, _2(i6, this.chartWidth) || (s4.height > 1 ? s4.height : 400)), this.containerBox = s4;
            }
            temporaryDisplay(t5) {
              let e5 = this.renderTo, i6;
              if (t5)
                for (; e5 && e5.style; )
                  e5.hcOrigStyle && (D2(e5, e5.hcOrigStyle), delete e5.hcOrigStyle), e5.hcOrigDetached && (k3.body.removeChild(e5), e5.hcOrigDetached = false), e5 = e5.parentNode;
              else
                for (; e5 && e5.style && (k3.body.contains(e5) || e5.parentNode || (e5.hcOrigDetached = true, k3.body.appendChild(e5)), ("none" === G(e5, "display", false) || e5.hcOricDetached) && (e5.hcOrigStyle = { display: e5.style.display, height: e5.style.height, overflow: e5.style.overflow }, i6 = { display: "block", overflow: "hidden" }, e5 !== this.renderTo && (i6.height = 0), D2(e5, i6), e5.offsetWidth || e5.style.setProperty("display", "block", "important")), (e5 = e5.parentNode) !== k3.body); )
                  ;
            }
            setClassName(t5) {
              this.container.className = "highcharts-container " + (t5 || "");
            }
            getContainer() {
              let t5 = this.options, e5 = t5.chart, i6 = "data-highcharts-chart", s4 = Q(), o5, r4 = this.renderTo;
              r4 || (this.renderTo = r4 = e5.renderTo), Y(r4) && (this.renderTo = r4 = k3.getElementById(r4)), r4 || R(13, true, this);
              let a5 = Z(P2(r4, i6));
              X(a5) && S3[a5] && S3[a5].hasRendered && S3[a5].destroy(), P2(r4, i6, this.index), r4.innerHTML = p3.emptyHTML, e5.skipClone || r4.offsetWidth || this.temporaryDisplay(), this.getChartSize();
              let h4 = this.chartWidth, d4 = this.chartHeight;
              D2(r4, { overflow: "hidden" }), this.styledMode || (o5 = z2({ position: "relative", overflow: "hidden", width: h4 + "px", height: d4 + "px", textAlign: "left", lineHeight: "normal", zIndex: 0, "-webkit-tap-highlight-color": "rgba(0,0,0,0)", userSelect: "none", "touch-action": "manipulation", outline: "none" }, e5.style || {}));
              let c4 = L2("div", { id: s4 }, o5, r4);
              this.container = c4, this._cursor = c4.style.cursor;
              let u5 = e5.renderer || !C3 ? n4.getRendererType(e5.renderer) : l3;
              if (this.renderer = new u5(c4, h4, d4, void 0, e5.forExport, t5.exporting && t5.exporting.allowHTML, this.styledMode), this.containerBox = this.getContainerBox(), m3(void 0, this), this.setClassName(e5.className), this.styledMode)
                for (let e6 in t5.defs)
                  this.renderer.definition(t5.defs[e6]);
              else
                this.renderer.setStyle(e5.style);
              this.renderer.chartIndex = this.index, W(this, "afterGetContainer");
            }
            getMargins(t5) {
              let { spacing: e5, margin: i6, titleOffset: s4 } = this;
              this.resetMargins(), s4[0] && !E(i6[0]) && (this.plotTop = Math.max(this.plotTop, s4[0] + e5[0])), s4[2] && !E(i6[2]) && (this.marginBottom = Math.max(this.marginBottom, s4[2] + e5[2])), this.legend && this.legend.display && this.legend.adjustMargins(i6, e5), W(this, "getMargins"), t5 || this.getAxisMargins();
            }
            getAxisMargins() {
              let t5 = this, e5 = t5.axisOffset = [0, 0, 0, 0], i6 = t5.colorAxis, s4 = t5.margin, o5 = function(t6) {
                t6.forEach(function(t7) {
                  t7.visible && t7.getOffset();
                });
              };
              t5.hasCartesianSeries ? o5(t5.axes) : i6 && i6.length && o5(i6), M2.forEach(function(i7, o6) {
                E(s4[o6]) || (t5[i7] += e5[o6]);
              }), t5.setChartSize();
            }
            getOptions() {
              return j2(this.userOptions, x3);
            }
            reflow(t5) {
              let e5 = this, i6 = e5.containerBox, s4 = e5.getContainerBox();
              delete e5.pointer.chartPosition, !e5.isPrinting && !e5.isResizing && i6 && s4.width && ((s4.width !== i6.width || s4.height !== i6.height) && (c3.clearTimeout(e5.reflowTimeout), e5.reflowTimeout = J(function() {
                e5.container && e5.setSize(void 0, void 0, false);
              }, t5 ? 100 : 0)), e5.containerBox = s4);
            }
            setReflow() {
              let t5 = this, e5 = (e6) => {
                t5.options?.chart.reflow && t5.hasLoaded && t5.reflow(e6);
              };
              if ("function" == typeof ResizeObserver)
                new ResizeObserver(e5).observe(t5.renderTo);
              else {
                let t6 = A2(w3, "resize", e5);
                A2(this, "destroy", t6);
              }
            }
            setSize(t5, e5, i6) {
              let s4 = this, o5 = s4.renderer;
              s4.isResizing += 1, m3(i6, s4);
              let r4 = o5.globalAnimation;
              s4.oldChartHeight = s4.chartHeight, s4.oldChartWidth = s4.chartWidth, void 0 !== t5 && (s4.options.chart.width = t5), void 0 !== e5 && (s4.options.chart.height = e5), s4.getChartSize();
              let { chartWidth: n5, chartHeight: a5, scrollablePixelsX: h4 = 0, scrollablePixelsY: l4 = 0 } = s4;
              (s4.isDirtyBox || n5 !== s4.oldChartWidth || a5 !== s4.oldChartHeight) && (s4.styledMode || (r4 ? g3 : D2)(s4.container, { width: `${n5 + h4}px`, height: `${a5 + l4}px` }, r4), s4.setChartSize(true), o5.setSize(n5, a5, r4), s4.axes.forEach(function(t6) {
                t6.isDirty = true, t6.setScale();
              }), s4.isDirtyLegend = true, s4.isDirtyBox = true, s4.layOutTitles(), s4.getMargins(), s4.redraw(r4), s4.oldChartHeight = void 0, W(s4, "resize"), setTimeout(() => {
                s4 && W(s4, "endResize", void 0, () => {
                  s4.isResizing -= 1;
                });
              }, f3(r4).duration));
            }
            setChartSize(t5) {
              let e5, i6, s4, o5;
              let r4 = this.inverted, n5 = this.renderer, a5 = this.chartWidth, h4 = this.chartHeight, l4 = this.options.chart, d4 = this.spacing, c4 = this.clipOffset;
              this.plotLeft = e5 = Math.round(this.plotLeft), this.plotTop = i6 = Math.round(this.plotTop), this.plotWidth = s4 = Math.max(0, Math.round(a5 - e5 - this.marginRight)), this.plotHeight = o5 = Math.max(0, Math.round(h4 - i6 - this.marginBottom)), this.plotSizeX = r4 ? o5 : s4, this.plotSizeY = r4 ? s4 : o5, this.plotBorderWidth = l4.plotBorderWidth || 0, this.spacingBox = n5.spacingBox = { x: d4[3], y: d4[0], width: a5 - d4[3] - d4[1], height: h4 - d4[0] - d4[2] }, this.plotBox = n5.plotBox = { x: e5, y: i6, width: s4, height: o5 };
              let p4 = 2 * Math.floor(this.plotBorderWidth / 2), u5 = Math.ceil(Math.max(p4, c4[3]) / 2), g4 = Math.ceil(Math.max(p4, c4[0]) / 2);
              this.clipBox = { x: u5, y: g4, width: Math.floor(this.plotSizeX - Math.max(p4, c4[1]) / 2 - u5), height: Math.max(0, Math.floor(this.plotSizeY - Math.max(p4, c4[2]) / 2 - g4)) }, t5 || (this.axes.forEach(function(t6) {
                t6.setAxisSize(), t6.setAxisTranslation();
              }), n5.alignElements()), W(this, "afterSetChartSize", { skipAxes: t5 });
            }
            resetMargins() {
              W(this, "resetMargins");
              let t5 = this, e5 = t5.options.chart;
              ["margin", "spacing"].forEach(function(i6) {
                let s4 = e5[i6], o5 = F(s4) ? s4 : [s4, s4, s4, s4];
                ["Top", "Right", "Bottom", "Left"].forEach(function(s5, r4) {
                  t5[i6][r4] = $2(e5[i6 + s5], o5[r4]);
                });
              }), M2.forEach(function(e6, i6) {
                t5[e6] = $2(t5.margin[i6], t5.spacing[i6]);
              }), t5.axisOffset = [0, 0, 0, 0], t5.clipOffset = [0, 0, 0, 0];
            }
            drawChartBox() {
              let t5 = this.options.chart, e5 = this.renderer, i6 = this.chartWidth, s4 = this.chartHeight, o5 = this.styledMode, r4 = this.plotBGImage, n5 = t5.backgroundColor, a5 = t5.plotBackgroundColor, h4 = t5.plotBackgroundImage, l4 = this.plotLeft, d4 = this.plotTop, c4 = this.plotWidth, p4 = this.plotHeight, u5 = this.plotBox, g4 = this.clipRect, f4 = this.clipBox, m4 = this.chartBackground, x4 = this.plotBackground, y4 = this.plotBorder, b4, v4, S4, k4 = "animate";
              m4 || (this.chartBackground = m4 = e5.rect().addClass("highcharts-background").add(), k4 = "attr"), o5 ? b4 = v4 = m4.strokeWidth() : (v4 = (b4 = t5.borderWidth || 0) + (t5.shadow ? 8 : 0), S4 = { fill: n5 || "none" }, (b4 || m4["stroke-width"]) && (S4.stroke = t5.borderColor, S4["stroke-width"] = b4), m4.attr(S4).shadow(t5.shadow)), m4[k4]({ x: v4 / 2, y: v4 / 2, width: i6 - v4 - b4 % 2, height: s4 - v4 - b4 % 2, r: t5.borderRadius }), k4 = "animate", x4 || (k4 = "attr", this.plotBackground = x4 = e5.rect().addClass("highcharts-plot-background").add()), x4[k4](u5), !o5 && (x4.attr({ fill: a5 || "none" }).shadow(t5.plotShadow), h4 && (r4 ? (h4 !== r4.attr("href") && r4.attr("href", h4), r4.animate(u5)) : this.plotBGImage = e5.image(h4, l4, d4, c4, p4).add())), g4 ? g4.animate({ width: f4.width, height: f4.height }) : this.clipRect = e5.clipRect(f4), k4 = "animate", y4 || (k4 = "attr", this.plotBorder = y4 = e5.rect().addClass("highcharts-plot-border").attr({ zIndex: 1 }).add()), o5 || y4.attr({ stroke: t5.plotBorderColor, "stroke-width": t5.plotBorderWidth || 0, fill: "none" }), y4[k4](y4.crisp({ x: l4, y: d4, width: c4, height: p4 }, -y4.strokeWidth())), this.isDirtyBox = false, W(this, "afterDrawChartBox");
            }
            propFromSeries() {
              let t5, e5, i6;
              let s4 = this, o5 = s4.options.chart, r4 = s4.options.series;
              ["inverted", "angular", "polar"].forEach(function(n5) {
                for (e5 = T2[o5.type], i6 = o5[n5] || e5 && e5.prototype[n5], t5 = r4 && r4.length; !i6 && t5--; )
                  (e5 = T2[r4[t5].type]) && e5.prototype[n5] && (i6 = true);
                s4[n5] = i6;
              });
            }
            linkSeries(t5) {
              let e5 = this, i6 = e5.series;
              i6.forEach(function(t6) {
                t6.linkedSeries.length = 0;
              }), i6.forEach(function(t6) {
                let { linkedTo: i7 } = t6.options;
                if (Y(i7)) {
                  let s4;
                  (s4 = ":previous" === i7 ? e5.series[t6.index - 1] : e5.get(i7)) && s4.linkedParent !== t6 && (s4.linkedSeries.push(t6), t6.linkedParent = s4, s4.enabledDataSorting && t6.setDataSortingOptions(), t6.visible = $2(t6.options.visible, s4.options.visible, t6.visible));
                }
              }), W(this, "afterLinkSeries", { isUpdating: t5 });
            }
            renderSeries() {
              this.series.forEach(function(t5) {
                t5.translate(), t5.render();
              });
            }
            render() {
              let t5 = this.axes, e5 = this.colorAxis, i6 = this.renderer, s4 = this.options.chart.axisLayoutRuns || 2, o5 = (t6) => {
                t6.forEach((t7) => {
                  t7.visible && t7.render();
                });
              }, r4 = 0, n5 = true, a5, h4 = 0;
              for (let e6 of (this.setTitle(), W(this, "beforeMargins"), this.getStacks?.(), this.getMargins(true), this.setChartSize(), t5)) {
                let { options: t6 } = e6, { labels: i7 } = t6;
                if (e6.horiz && e6.visible && i7.enabled && e6.series.length && "colorAxis" !== e6.coll && !this.polar) {
                  r4 = t6.tickLength, e6.createGroups();
                  let s5 = new u4(e6, 0, "", true), o6 = s5.createLabel("x", i7);
                  if (s5.destroy(), o6 && $2(i7.reserveSpace, !X(t6.crossing)) && (r4 = o6.getBBox().height + i7.distance + Math.max(t6.offset || 0, 0)), r4) {
                    o6?.destroy();
                    break;
                  }
                }
              }
              for (this.plotHeight = Math.max(this.plotHeight - r4, 0); (n5 || a5 || s4 > 1) && h4 < s4; ) {
                let e6 = this.plotWidth, i7 = this.plotHeight;
                for (let e7 of t5)
                  0 === h4 ? e7.setScale() : (e7.horiz && n5 || !e7.horiz && a5) && e7.setTickInterval(true);
                0 === h4 ? this.getAxisMargins() : this.getMargins(), n5 = e6 / this.plotWidth > (h4 ? 1 : 1.1), a5 = i7 / this.plotHeight > (h4 ? 1 : 1.05), h4++;
              }
              this.drawChartBox(), this.hasCartesianSeries ? o5(t5) : e5 && e5.length && o5(e5), this.seriesGroup || (this.seriesGroup = i6.g("series-group").attr({ zIndex: 3 }).shadow(this.options.chart.seriesGroupShadow).add()), this.renderSeries(), this.addCredits(), this.setResponsive && this.setResponsive(), this.hasRendered = true;
            }
            addCredits(t5) {
              let e5 = this, i6 = U(true, this.options.credits, t5);
              i6.enabled && !this.credits && (this.credits = this.renderer.text(i6.text + (this.mapCredits || ""), 0, 0).addClass("highcharts-credits").on("click", function() {
                i6.href && (w3.location.href = i6.href);
              }).attr({ align: i6.position.align, zIndex: 8 }), e5.styledMode || this.credits.css(i6.style), this.credits.add().align(i6.position), this.credits.update = function(t6) {
                e5.credits = e5.credits.destroy(), e5.addCredits(t6);
              });
            }
            destroy() {
              let t5;
              let e5 = this, i6 = e5.axes, s4 = e5.series, o5 = e5.container, n5 = o5 && o5.parentNode;
              for (W(e5, "destroy"), e5.renderer.forExport ? B(S3, e5) : S3[e5.index] = void 0, r3.chartCount--, e5.renderTo.removeAttribute("data-highcharts-chart"), q2(e5), t5 = i6.length; t5--; )
                i6[t5] = i6[t5].destroy();
              for (this.scroller && this.scroller.destroy && this.scroller.destroy(), t5 = s4.length; t5--; )
                s4[t5] = s4[t5].destroy();
              ["title", "subtitle", "chartBackground", "plotBackground", "plotBGImage", "plotBorder", "seriesGroup", "clipRect", "credits", "pointer", "rangeSelector", "legend", "resetZoomButton", "tooltip", "renderer"].forEach(function(t6) {
                let i7 = e5[t6];
                i7 && i7.destroy && (e5[t6] = i7.destroy());
              }), o5 && (o5.innerHTML = p3.emptyHTML, q2(o5), n5 && I2(o5)), V(e5, function(t6, i7) {
                delete e5[i7];
              });
            }
            firstRender() {
              let t5 = this, e5 = t5.options;
              t5.getContainer(), t5.resetMargins(), t5.setChartSize(), t5.propFromSeries(), t5.getAxes();
              let i6 = H(e5.series) ? e5.series : [];
              e5.series = [], i6.forEach(function(e6) {
                t5.initSeries(e6);
              }), t5.linkSeries(), t5.setSortedData(), W(t5, "beforeRender"), t5.render(), t5.pointer.getChartPosition(), t5.renderer.imgCount || t5.hasLoaded || t5.onload(), t5.temporaryDisplay(true);
            }
            onload() {
              this.callbacks.concat([this.callback]).forEach(function(t5) {
                t5 && void 0 !== this.index && t5.apply(this, [this]);
              }, this), W(this, "load"), W(this, "render"), E(this.index) && this.setReflow(), this.warnIfA11yModuleNotLoaded(), this.hasLoaded = true;
            }
            warnIfA11yModuleNotLoaded() {
              let { options: t5, title: e5 } = this;
              !t5 || this.accessibility || (this.renderer.boxWrapper.attr({ role: "img", "aria-label": (e5 && e5.element.textContent || "").replace(/</g, "&lt;") }), t5.accessibility && false === t5.accessibility.enabled || R('Highcharts warning: Consider including the "accessibility.js" module to make your chart more usable for people with disabilities. Set the "accessibility.enabled" option to false to remove this warning. See https://www.highcharts.com/docs/accessibility/accessibility-module.', false, this));
            }
            addSeries(t5, e5, i6) {
              let s4;
              let o5 = this;
              return t5 && (e5 = $2(e5, true), W(o5, "addSeries", { options: t5 }, function() {
                s4 = o5.initSeries(t5), o5.isDirtyLegend = true, o5.linkSeries(), s4.enabledDataSorting && s4.setData(t5.data, false), W(o5, "afterAddSeries", { series: s4 }), e5 && o5.redraw(i6);
              })), s4;
            }
            addAxis(t5, e5, i6, s4) {
              return this.createAxis(e5 ? "xAxis" : "yAxis", { axis: t5, redraw: i6, animation: s4 });
            }
            addColorAxis(t5, e5, i6) {
              return this.createAxis("colorAxis", { axis: t5, redraw: e5, animation: i6 });
            }
            createAxis(t5, i6) {
              let s4 = new e4(this, i6.axis, t5);
              return $2(i6.redraw, true) && this.redraw(i6.animation), s4;
            }
            showLoading(t5) {
              let e5 = this, i6 = e5.options, s4 = i6.loading, o5 = function() {
                r4 && D2(r4, { left: e5.plotLeft + "px", top: e5.plotTop + "px", width: e5.plotWidth + "px", height: e5.plotHeight + "px" });
              }, r4 = e5.loadingDiv, n5 = e5.loadingSpan;
              r4 || (e5.loadingDiv = r4 = L2("div", { className: "highcharts-loading highcharts-loading-hidden" }, null, e5.container)), n5 || (e5.loadingSpan = n5 = L2("span", { className: "highcharts-loading-inner" }, null, r4), A2(e5, "redraw", o5)), r4.className = "highcharts-loading", p3.setElementHTML(n5, $2(t5, i6.lang.loading, "")), e5.styledMode || (D2(r4, z2(s4.style, { zIndex: 10 })), D2(n5, s4.labelStyle), e5.loadingShown || (D2(r4, { opacity: 0, display: "" }), g3(r4, { opacity: s4.style.opacity || 0.5 }, { duration: s4.showDuration || 0 }))), e5.loadingShown = true, o5();
            }
            hideLoading() {
              let t5 = this.options, e5 = this.loadingDiv;
              e5 && (e5.className = "highcharts-loading highcharts-loading-hidden", this.styledMode || g3(e5, { opacity: 0 }, { duration: t5.loading.hideDuration || 100, complete: function() {
                D2(e5, { display: "none" });
              } })), this.loadingShown = false;
            }
            update(t5, e5, i6, s4) {
              let o5, r4, n5;
              let a5 = this, h4 = { credits: "addCredits", title: "setTitle", subtitle: "setSubtitle", caption: "setCaption" }, l4 = t5.isResponsiveOptions, c4 = [];
              W(a5, "update", { options: t5 }), l4 || a5.setResponsive(false, true), t5 = j2(t5, a5.options), a5.userOptions = U(a5.userOptions, t5);
              let p4 = t5.chart;
              p4 && (U(true, a5.options.chart, p4), this.setZoomOptions(), "className" in p4 && a5.setClassName(p4.className), ("inverted" in p4 || "polar" in p4 || "type" in p4) && (a5.propFromSeries(), o5 = true), "alignTicks" in p4 && (o5 = true), "events" in p4 && v3(this, p4), V(p4, function(t6, e6) {
                -1 !== a5.propsRequireUpdateSeries.indexOf("chart." + e6) && (r4 = true), -1 !== a5.propsRequireDirtyBox.indexOf(e6) && (a5.isDirtyBox = true), -1 === a5.propsRequireReflow.indexOf(e6) || (a5.isDirtyBox = true, l4 || (n5 = true));
              }), !a5.styledMode && p4.style && a5.renderer.setStyle(a5.options.chart.style || {})), !a5.styledMode && t5.colors && (this.options.colors = t5.colors), t5.time && (this.time === y3 && (this.time = new d3(t5.time)), U(true, a5.options.time, t5.time)), V(t5, function(e6, i7) {
                a5[i7] && "function" == typeof a5[i7].update ? a5[i7].update(e6, false) : "function" == typeof a5[h4[i7]] ? a5[h4[i7]](e6) : "colors" !== i7 && -1 === a5.collectionsWithUpdate.indexOf(i7) && U(true, a5.options[i7], t5[i7]), "chart" !== i7 && -1 !== a5.propsRequireUpdateSeries.indexOf(i7) && (r4 = true);
              }), this.collectionsWithUpdate.forEach(function(e6) {
                t5[e6] && (K(t5[e6]).forEach(function(t6, s5) {
                  let o6;
                  let r5 = E(t6.id);
                  r5 && (o6 = a5.get(t6.id)), !o6 && a5[e6] && (o6 = a5[e6][$2(t6.index, s5)]) && (r5 && E(o6.options.id) || o6.options.isInternal) && (o6 = void 0), o6 && o6.coll === e6 && (o6.update(t6, false), i6 && (o6.touched = true)), !o6 && i6 && a5.collectionsWithInit[e6] && (a5.collectionsWithInit[e6][0].apply(a5, [t6].concat(a5.collectionsWithInit[e6][1] || []).concat([false])).touched = true);
                }), i6 && a5[e6].forEach(function(t6) {
                  t6.touched || t6.options.isInternal ? delete t6.touched : c4.push(t6);
                }));
              }), c4.forEach(function(t6) {
                t6.chart && t6.remove && t6.remove(false);
              }), o5 && a5.axes.forEach(function(t6) {
                t6.update({}, false);
              }), r4 && a5.getSeriesOrderByLinks().forEach(function(t6) {
                t6.chart && t6.update({}, false);
              }, this);
              let u5 = p4 && p4.width, g4 = p4 && (Y(p4.height) ? _2(p4.height, u5 || a5.chartWidth) : p4.height);
              n5 || X(u5) && u5 !== a5.chartWidth || X(g4) && g4 !== a5.chartHeight ? a5.setSize(u5, g4, s4) : $2(e5, true) && a5.redraw(s4), W(a5, "afterUpdate", { options: t5, redraw: e5, animation: s4 });
            }
            setSubtitle(t5, e5) {
              this.applyDescription("subtitle", t5), this.layOutTitles(e5);
            }
            setCaption(t5, e5) {
              this.applyDescription("caption", t5), this.layOutTitles(e5);
            }
            showResetZoom() {
              let t5 = this, e5 = x3.lang, i6 = t5.zooming.resetButton, s4 = i6.theme, o5 = "chart" === i6.relativeTo || "spacingBox" === i6.relativeTo ? null : "scrollablePlotBox";
              function r4() {
                t5.zoomOut();
              }
              W(this, "beforeShowResetZoom", null, function() {
                t5.resetZoomButton = t5.renderer.button(e5.resetZoom, null, null, r4, s4).attr({ align: i6.position.align, title: e5.resetZoomTitle }).addClass("highcharts-reset-zoom").add().align(i6.position, false, o5);
              }), W(this, "afterShowResetZoom");
            }
            zoomOut() {
              W(this, "selection", { resetSelection: true }, this.zoom);
            }
            zoom(t5) {
              let e5 = this, i6 = e5.pointer, s4 = false, o5;
              !t5 || t5.resetSelection ? (e5.axes.forEach(function(t6) {
                o5 = t6.zoom();
              }), i6.initiated = false) : t5.xAxis.concat(t5.yAxis).forEach(function(t6) {
                let r5 = t6.axis, n5 = r5.isXAxis, { hasPinched: a5, mouseDownX: h4, mouseDownY: l4 } = i6;
                (i6[n5 ? "zoomX" : "zoomY"] && E(h4) && E(l4) && e5.isInsidePlot(h4 - e5.plotLeft, l4 - e5.plotTop, { axis: r5, ignoreX: a5, ignoreY: a5 }) || !E(e5.inverted ? h4 : l4)) && (o5 = r5.zoom(t6.min, t6.max), r5.displayBtn && (s4 = true));
              });
              let r4 = e5.resetZoomButton;
              s4 && !r4 ? e5.showResetZoom() : !s4 && F(r4) && (e5.resetZoomButton = r4.destroy()), o5 && e5.redraw($2(e5.options.chart.animation, t5 && t5.animation, e5.pointCount < 100));
            }
            pan(t5, e5) {
              let i6;
              let s4 = this, o5 = s4.hoverPoints, r4 = "object" == typeof e5 ? e5 : { enabled: e5, type: "x" }, n5 = s4.options.chart;
              n5 && n5.panning && (n5.panning = r4);
              let a5 = r4.type;
              W(this, "pan", { originalEvent: t5 }, function() {
                o5 && o5.forEach(function(t6) {
                  t6.setState();
                });
                let e6 = s4.xAxis;
                "xy" === a5 ? e6 = e6.concat(s4.yAxis) : "y" === a5 && (e6 = s4.yAxis);
                let r5 = {};
                e6.forEach(function(e7) {
                  if (!e7.options.panningEnabled || e7.options.isInternal)
                    return;
                  let o6 = e7.horiz, n6 = t5[o6 ? "chartX" : "chartY"], h4 = o6 ? "mouseDownX" : "mouseDownY", l4 = s4[h4], d4 = e7.minPointOffset || 0, c4 = e7.reversed && !s4.inverted || !e7.reversed && s4.inverted ? -1 : 1, p4 = e7.getExtremes(), u5 = e7.toValue(l4 - n6, true) + d4 * c4, g4 = e7.toValue(l4 + e7.len - n6, true) - (d4 * c4 || e7.isXAxis && e7.pointRangePadding || 0), f4 = g4 < u5, m4 = e7.hasVerticalPanning(), x4 = f4 ? g4 : u5, y4 = f4 ? u5 : g4, b4 = e7.panningState, v4;
                  m4 && !e7.isXAxis && (!b4 || b4.isDirty) && e7.series.forEach(function(t6) {
                    let e8 = t6.getProcessedData(true), i7 = t6.getExtremes(e8.yData, true);
                    b4 || (b4 = { startMin: Number.MAX_VALUE, startMax: -Number.MAX_VALUE }), X(i7.dataMin) && X(i7.dataMax) && (b4.startMin = Math.min($2(t6.options.threshold, 1 / 0), i7.dataMin, b4.startMin), b4.startMax = Math.max($2(t6.options.threshold, -1 / 0), i7.dataMax, b4.startMax));
                  });
                  let S4 = Math.min($2(b4 && b4.startMin, p4.dataMin), d4 ? p4.min : e7.toValue(e7.toPixels(p4.min) - e7.minPixelPadding)), k4 = Math.max($2(b4 && b4.startMax, p4.dataMax), d4 ? p4.max : e7.toValue(e7.toPixels(p4.max) + e7.minPixelPadding));
                  e7.panningState = b4, e7.isOrdinal || ((v4 = S4 - x4) > 0 && (y4 += v4, x4 = S4), (v4 = y4 - k4) > 0 && (y4 = k4, x4 -= v4), e7.series.length && x4 !== p4.min && y4 !== p4.max && x4 >= S4 && y4 <= k4 && (e7.setExtremes(x4, y4, false, false, { trigger: "pan" }), !s4.resetZoomButton && x4 !== S4 && y4 !== k4 && a5.match("y") && (s4.showResetZoom(), e7.displayBtn = false), i6 = true), r5[h4] = n6);
                }), V(r5, (t6, e7) => {
                  s4[e7] = t6;
                }), i6 && s4.redraw(false), D2(s4.container, { cursor: "move" });
              });
            }
          }
          return z2(tt.prototype, { callbacks: [], collectionsWithInit: { xAxis: [tt.prototype.addAxis, [true]], yAxis: [tt.prototype.addAxis, [false]], series: [tt.prototype.addSeries] }, collectionsWithUpdate: ["xAxis", "yAxis", "series"], propsRequireDirtyBox: ["backgroundColor", "borderColor", "borderWidth", "borderRadius", "plotBackgroundColor", "plotBackgroundImage", "plotBorderColor", "plotBorderWidth", "plotShadow", "shadow"], propsRequireReflow: ["margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "spacing", "spacingTop", "spacingRight", "spacingBottom", "spacingLeft"], propsRequireUpdateSeries: ["chart.inverted", "chart.polar", "chart.ignoreHiddenSeries", "chart.type", "colors", "plotOptions", "time", "tooltip"] }), tt;
        }), i4(e3, "Extensions/ScrollablePlotArea.js", [e3["Core/Animation/AnimationUtilities.js"], e3["Core/Globals.js"], e3["Core/Renderer/RendererRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3) {
          let { stop: o4 } = t4, { composed: r3 } = e4, { addEvent: n4, createElement: a4, css: h3, defined: l3, extend: d3, merge: c3, pick: p3, pushUnique: u4 } = s3;
          function g3() {
            let t5;
            let { axisOffset: e5, chartWidth: s4, chartHeight: r4, container: l4, plotHeight: d4, plotLeft: c4, plotTop: u5, plotWidth: g4, scrollablePixelsX: f4 = 0, scrollablePixelsY: m4 = 0, scrollingContainer: x4 } = this, y4 = !this.fixedDiv, b4 = this.options.chart, v4 = b4.scrollablePlotArea, { scrollPositionX: S3, scrollPositionY: k3 } = v4, M2 = i5.getRendererType(), { fixedRenderer: C3 } = this;
            C3 ? C3.setSize(s4, r4) : (this.fixedDiv = a4("div", { className: "highcharts-fixed" }, { position: "absolute", overflow: "hidden", pointerEvents: "none", zIndex: (b4.style?.zIndex || 0) + 2, top: 0 }, void 0, true), x4?.parentNode.insertBefore(this.fixedDiv, x4), h3(this.renderTo, { overflow: "visible" }), this.fixedRenderer = C3 = new M2(this.fixedDiv, s4, r4, b4.style), this.scrollableMask = C3.path().attr({ fill: b4.backgroundColor || "#fff", "fill-opacity": p3(v4.opacity, 0.85), zIndex: -1 }).addClass("highcharts-scrollable-mask").add(), n4(this, "afterShowResetZoom", this.moveFixedElements), n4(this, "afterApplyDrilldown", this.moveFixedElements), n4(this, "afterLayOutTitles", this.moveFixedElements)), (this.scrollableDirty || y4) && (this.scrollableDirty = false, this.moveFixedElements());
            let w3 = s4 + f4, T2 = r4 + m4;
            o4(this.container), h3(l4, { width: `${w3}px`, height: `${T2}px` }), this.renderer.boxWrapper.attr({ width: w3, height: T2, viewBox: [0, 0, w3, T2].join(" ") }), this.chartBackground?.attr({ width: w3, height: T2 }), x4 && (h3(x4, { width: `${this.chartWidth}px`, height: `${this.chartHeight}px` }), y4 && (S3 && (x4.scrollLeft = f4 * S3), k3 && (x4.scrollTop = m4 * k3)));
            let A2 = u5 - e5[0] - 1, P2 = c4 - e5[3] - 1, L2 = u5 + d4 + e5[2] + 1, O2 = c4 + g4 + e5[1] + 1, D2 = c4 + g4 - f4, E = u5 + d4 - m4;
            t5 = f4 ? [["M", 0, A2], ["L", c4 - 1, A2], ["L", c4 - 1, L2], ["L", 0, L2], ["Z"], ["M", D2, A2], ["L", s4, A2], ["L", s4, L2], ["L", D2, L2], ["Z"]] : m4 ? [["M", P2, 0], ["L", P2, u5 - 1], ["L", O2, u5 - 1], ["L", O2, 0], ["Z"], ["M", P2, E], ["L", P2, r4], ["L", O2, r4], ["L", O2, E], ["Z"]] : [["M", 0, 0]], "adjustHeight" !== this.redrawTrigger && this.scrollableMask?.attr({ d: t5 });
          }
          function f3() {
            let t5;
            let e5 = this.container, i6 = this.fixedRenderer, s4 = [".highcharts-breadcrumbs-group", ".highcharts-contextbutton", ".highcharts-caption", ".highcharts-credits", ".highcharts-legend", ".highcharts-legend-checkbox", ".highcharts-navigator-series", ".highcharts-navigator-xaxis", ".highcharts-navigator-yaxis", ".highcharts-navigator", ".highcharts-reset-zoom", ".highcharts-drillup-button", ".highcharts-scrollbar", ".highcharts-subtitle", ".highcharts-title"];
            for (let o5 of (this.scrollablePixelsX && !this.inverted ? t5 = ".highcharts-yaxis" : this.scrollablePixelsX && this.inverted ? t5 = ".highcharts-xaxis" : this.scrollablePixelsY && !this.inverted ? t5 = ".highcharts-xaxis" : this.scrollablePixelsY && this.inverted && (t5 = ".highcharts-yaxis"), t5 && s4.push(`${t5}:not(.highcharts-radial-axis)`, `${t5}-labels:not(.highcharts-radial-axis-labels)`), s4))
              [].forEach.call(e5.querySelectorAll(o5), (t6) => {
                (t6.namespaceURI === i6.SVG_NS ? i6.box : i6.box.parentNode).appendChild(t6), t6.style.pointerEvents = "auto";
              });
          }
          function m3() {
            let t5;
            let e5 = { WebkitOverflowScrolling: "touch", overflowX: "hidden", overflowY: "hidden" };
            this.scrollablePixelsX && (e5.overflowX = "auto"), this.scrollablePixelsY && (e5.overflowY = "auto"), this.scrollingParent = a4("div", { className: "highcharts-scrolling-parent" }, { position: "relative" }, this.renderTo), this.scrollingContainer = a4("div", { className: "highcharts-scrolling" }, e5, this.scrollingParent), n4(this.scrollingContainer, "scroll", () => {
              this.pointer && (delete this.pointer.chartPosition, this.hoverPoint && (t5 = this.hoverPoint), this.pointer.runPointActions(void 0, t5, true));
            }), this.innerContainer = a4("div", { className: "highcharts-inner-container" }, null, this.scrollingContainer), this.innerContainer.appendChild(this.container), this.setUpScrolling = null;
          }
          function x3() {
            this.chart.scrollableDirty = true;
          }
          function y3(t5) {
            let e5, i6, s4;
            let o5 = this.options.chart.scrollablePlotArea, r4 = o5 && o5.minWidth, n5 = o5 && o5.minHeight;
            if (!this.renderer.forExport && (r4 ? (this.scrollablePixelsX = e5 = Math.max(0, r4 - this.chartWidth), e5 && (this.scrollablePlotBox = this.renderer.scrollablePlotBox = c3(this.plotBox), this.plotBox.width = this.plotWidth += e5, this.inverted ? this.clipBox.height += e5 : this.clipBox.width += e5, s4 = { 1: { name: "right", value: e5 } })) : n5 && (this.scrollablePixelsY = i6 = Math.max(0, n5 - this.chartHeight), l3(i6) && (this.scrollablePlotBox = this.renderer.scrollablePlotBox = c3(this.plotBox), this.plotBox.height = this.plotHeight += i6, this.inverted ? this.clipBox.width += i6 : this.clipBox.height += i6, s4 = { 2: { name: "bottom", value: i6 } })), s4 && !t5.skipAxes))
              for (let t6 of this.axes)
                if (s4[t6.side]) {
                  let e6 = t6.getPlotLinePath;
                  t6.getPlotLinePath = function() {
                    let i7 = s4[t6.side].name, o6 = s4[t6.side].value, r5 = this[i7];
                    this[i7] = r5 - o6;
                    let n6 = e6.apply(this, arguments);
                    return this[i7] = r5, n6;
                  };
                } else
                  t6.setAxisSize(), t6.setAxisTranslation();
          }
          function b3() {
            this.scrollablePixelsX || this.scrollablePixelsY ? (this.setUpScrolling && this.setUpScrolling(), this.applyFixed()) : this.fixedDiv && this.applyFixed();
          }
          function v3() {
            this.chart.scrollableDirty = true;
          }
          return { compose: function t5(e5, i6, s4) {
            u4(r3, t5) && (n4(e5, "afterInit", x3), d3(i6.prototype, { applyFixed: g3, moveFixedElements: f3, setUpScrolling: m3 }), n4(i6, "afterSetChartSize", y3), n4(i6, "render", b3), n4(s4, "show", v3));
          } };
        }), i4(e3, "Core/Axis/Stacking/StackItem.js", [e3["Core/Templating.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          let { format: s3 } = t4, { series: o4 } = e4, { destroyObjectProperties: r3, fireEvent: n4, isNumber: a4, pick: h3 } = i5;
          return class {
            constructor(t5, e5, i6, s4, o5) {
              let r4 = t5.chart.inverted, n5 = t5.reversed;
              this.axis = t5;
              let a5 = this.isNegative = !!i6 != !!n5;
              this.options = e5 = e5 || {}, this.x = s4, this.total = null, this.cumulative = null, this.points = {}, this.hasValidPoints = false, this.stack = o5, this.leftCliff = 0, this.rightCliff = 0, this.alignOptions = { align: e5.align || (r4 ? a5 ? "left" : "right" : "center"), verticalAlign: e5.verticalAlign || (r4 ? "middle" : a5 ? "bottom" : "top"), y: e5.y, x: e5.x }, this.textAlign = e5.textAlign || (r4 ? a5 ? "right" : "left" : "center");
            }
            destroy() {
              r3(this, this.axis);
            }
            render(t5) {
              let e5 = this.axis.chart, i6 = this.options, o5 = i6.format, r4 = o5 ? s3(o5, this, e5) : i6.formatter.call(this);
              if (this.label)
                this.label.attr({ text: r4, visibility: "hidden" });
              else {
                this.label = e5.renderer.label(r4, null, void 0, i6.shape, void 0, void 0, i6.useHTML, false, "stack-labels");
                let s4 = { r: i6.borderRadius || 0, text: r4, padding: h3(i6.padding, 5), visibility: "hidden" };
                e5.styledMode || (s4.fill = i6.backgroundColor, s4.stroke = i6.borderColor, s4["stroke-width"] = i6.borderWidth, this.label.css(i6.style || {})), this.label.attr(s4), this.label.added || this.label.add(t5);
              }
              this.label.labelrank = e5.plotSizeY, n4(this, "afterRender");
            }
            setOffset(t5, e5, i6, s4, r4, l3) {
              let { alignOptions: d3, axis: c3, label: p3, options: u4, textAlign: g3 } = this, f3 = c3.chart, m3 = this.getStackBox({ xOffset: t5, width: e5, boxBottom: i6, boxTop: s4, defaultX: r4, xAxis: l3 }), { verticalAlign: x3 } = d3;
              if (p3 && m3) {
                let t6 = p3.getBBox(), e6 = p3.padding, i7 = "justify" === h3(u4.overflow, "justify"), s5;
                d3.x = u4.x || 0, d3.y = u4.y || 0;
                let { x: r5, y: n5 } = this.adjustStackPosition({ labelBox: t6, verticalAlign: x3, textAlign: g3 });
                m3.x -= r5, m3.y -= n5, p3.align(d3, false, m3), (s5 = f3.isInsidePlot(p3.alignAttr.x + d3.x + r5, p3.alignAttr.y + d3.y + n5)) || (i7 = false), i7 && o4.prototype.justifyDataLabel.call(c3, p3, d3, p3.alignAttr, t6, m3), p3.attr({ x: p3.alignAttr.x, y: p3.alignAttr.y, rotation: u4.rotation, rotationOriginX: t6.width / 2, rotationOriginY: t6.height / 2 }), h3(!i7 && u4.crop, true) && (s5 = a4(p3.x) && a4(p3.y) && f3.isInsidePlot(p3.x - e6 + (p3.width || 0), p3.y) && f3.isInsidePlot(p3.x + e6, p3.y)), p3[s5 ? "show" : "hide"]();
              }
              n4(this, "afterSetOffset", { xOffset: t5, width: e5 });
            }
            adjustStackPosition({ labelBox: t5, verticalAlign: e5, textAlign: i6 }) {
              let s4 = { bottom: 0, middle: 1, top: 2, right: 1, center: 0, left: -1 }, o5 = s4[e5], r4 = s4[i6];
              return { x: t5.width / 2 + t5.width / 2 * r4, y: t5.height / 2 * o5 };
            }
            getStackBox(t5) {
              let e5 = this.axis, i6 = e5.chart, { boxTop: s4, defaultX: o5, xOffset: r4, width: n5, boxBottom: l3 } = t5, d3 = e5.stacking.usePercentage ? 100 : h3(s4, this.total, 0), c3 = e5.toPixels(d3), p3 = t5.xAxis || i6.xAxis[0], u4 = h3(o5, p3.translate(this.x)) + r4, g3 = e5.toPixels(l3 || a4(e5.min) && e5.logarithmic && e5.logarithmic.lin2log(e5.min) || 0), f3 = Math.abs(c3 - g3), m3 = i6.inverted, x3 = this.isNegative;
              return m3 ? { x: (x3 ? c3 : c3 - f3) - i6.plotLeft, y: p3.height - u4 - n5, width: f3, height: n5 } : { x: u4 + p3.transB - i6.plotLeft, y: (x3 ? c3 - f3 : c3) - i6.plotTop, width: n5, height: f3 };
            }
          };
        }), i4(e3, "Core/Axis/Stacking/StackingAxis.js", [e3["Core/Animation/AnimationUtilities.js"], e3["Core/Axis/Axis.js"], e3["Core/Globals.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Axis/Stacking/StackItem.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3, o4, r3) {
          var n4;
          let { getDeferredAnimation: a4 } = t4, { composed: h3 } = i5, { series: { prototype: l3 } } = s3, { addEvent: d3, correctFloat: c3, defined: p3, destroyObjectProperties: u4, fireEvent: g3, isArray: f3, isNumber: m3, objectEach: x3, pick: y3, pushUnique: b3 } = r3;
          function v3() {
            let t5 = this.inverted;
            this.axes.forEach((t6) => {
              t6.stacking && t6.stacking.stacks && t6.hasVisibleSeries && (t6.stacking.oldStacks = t6.stacking.stacks);
            }), this.series.forEach((e5) => {
              let i6 = e5.xAxis && e5.xAxis.options || {};
              e5.options.stacking && e5.reserveSpace() && (e5.stackKey = [e5.type, y3(e5.options.stack, ""), t5 ? i6.top : i6.left, t5 ? i6.height : i6.width].join(","));
            });
          }
          function S3() {
            let t5 = this.stacking;
            if (t5) {
              let e5 = t5.stacks;
              x3(e5, (t6, i6) => {
                u4(t6), delete e5[i6];
              }), t5.stackTotalGroup?.destroy();
            }
          }
          function k3() {
            this.stacking || (this.stacking = new P2(this));
          }
          function M2(t5, e5, i6, s4) {
            return !p3(t5) || t5.x !== e5 || s4 && t5.stackKey !== s4 ? t5 = { x: e5, index: 0, key: s4, stackKey: s4 } : t5.index++, t5.key = [i6, e5, t5.index].join(","), t5;
          }
          function C3() {
            let t5;
            let e5 = this, i6 = e5.yAxis, s4 = e5.stackKey || "", o5 = i6.stacking.stacks, r4 = e5.processedXData, n5 = e5.options.stacking, a5 = e5[n5 + "Stacker"];
            a5 && [s4, "-" + s4].forEach((i7) => {
              let s5 = r4.length, n6, h4, l4;
              for (; s5--; )
                n6 = r4[s5], t5 = e5.getStackIndicator(t5, n6, e5.index, i7), h4 = o5[i7]?.[n6], (l4 = h4?.points[t5.key || ""]) && a5.call(e5, l4, h4, s5);
            });
          }
          function w3(t5, e5, i6) {
            let s4 = e5.total ? 100 / e5.total : 0;
            t5[0] = c3(t5[0] * s4), t5[1] = c3(t5[1] * s4), this.stackedYData[i6] = t5[1];
          }
          function T2(t5) {
            (this.is("column") || this.is("columnrange")) && (this.options.centerInCategory && !this.options.stacking && this.chart.series.length > 1 ? l3.setStackedPoints.call(this, t5, "group") : t5.stacking.resetStacks());
          }
          function A2(t5, e5) {
            let i6, s4, r4, n5, a5, h4, l4, d4, u5;
            let g4 = e5 || this.options.stacking;
            if (!g4 || !this.reserveSpace() || ({ group: "xAxis" }[g4] || "yAxis") !== t5.coll)
              return;
            let m4 = this.processedXData, x4 = this.processedYData, b4 = [], v4 = x4.length, S4 = this.options, k4 = S4.threshold || 0, M3 = S4.startFromThreshold ? k4 : 0, C4 = S4.stack, w4 = e5 ? `${this.type},${g4}` : this.stackKey || "", T3 = "-" + w4, A3 = this.negStacks, P3 = t5.stacking, L2 = P3.stacks, O2 = P3.oldStacks;
            for (P3.stacksTouched += 1, l4 = 0; l4 < v4; l4++) {
              d4 = m4[l4], u5 = x4[l4], h4 = (i6 = this.getStackIndicator(i6, d4, this.index)).key || "", L2[a5 = (s4 = A3 && u5 < (M3 ? 0 : k4)) ? T3 : w4] || (L2[a5] = {}), L2[a5][d4] || (O2[a5]?.[d4] ? (L2[a5][d4] = O2[a5][d4], L2[a5][d4].total = null) : L2[a5][d4] = new o4(t5, t5.options.stackLabels, !!s4, d4, C4)), r4 = L2[a5][d4], null !== u5 ? (r4.points[h4] = r4.points[this.index] = [y3(r4.cumulative, M3)], p3(r4.cumulative) || (r4.base = h4), r4.touched = P3.stacksTouched, i6.index > 0 && false === this.singleStacks && (r4.points[h4][0] = r4.points[this.index + "," + d4 + ",0"][0])) : (delete r4.points[h4], delete r4.points[this.index]);
              let e6 = r4.total || 0;
              "percent" === g4 ? (n5 = s4 ? w4 : T3, e6 = A3 && L2[n5]?.[d4] ? (n5 = L2[n5][d4]).total = Math.max(n5.total || 0, e6) + Math.abs(u5) || 0 : c3(e6 + (Math.abs(u5) || 0))) : "group" === g4 ? (f3(u5) && (u5 = u5[0]), null !== u5 && e6++) : e6 = c3(e6 + (u5 || 0)), "group" === g4 ? r4.cumulative = (e6 || 1) - 1 : r4.cumulative = c3(y3(r4.cumulative, M3) + (u5 || 0)), r4.total = e6, null !== u5 && (r4.points[h4].push(r4.cumulative), b4[l4] = r4.cumulative, r4.hasValidPoints = true);
            }
            "percent" === g4 && (P3.usePercentage = true), "group" !== g4 && (this.stackedYData = b4), P3.oldStacks = {};
          }
          class P2 {
            constructor(t5) {
              this.oldStacks = {}, this.stacks = {}, this.stacksTouched = 0, this.axis = t5;
            }
            buildStacks() {
              let t5, e5;
              let i6 = this.axis, s4 = i6.series, o5 = "xAxis" === i6.coll, r4 = i6.options.reversedStacks, n5 = s4.length;
              for (this.resetStacks(), this.usePercentage = false, e5 = n5; e5--; )
                t5 = s4[r4 ? e5 : n5 - e5 - 1], o5 && t5.setGroupedPoints(i6), t5.setStackedPoints(i6);
              if (!o5)
                for (e5 = 0; e5 < n5; e5++)
                  s4[e5].modifyStacks();
              g3(i6, "afterBuildStacks");
            }
            cleanStacks() {
              this.oldStacks && (this.stacks = this.oldStacks, x3(this.stacks, (t5) => {
                x3(t5, (t6) => {
                  t6.cumulative = t6.total;
                });
              }));
            }
            resetStacks() {
              x3(this.stacks, (t5) => {
                x3(t5, (e5, i6) => {
                  m3(e5.touched) && e5.touched < this.stacksTouched ? (e5.destroy(), delete t5[i6]) : (e5.total = null, e5.cumulative = null);
                });
              });
            }
            renderStackTotals() {
              let t5 = this.axis, e5 = t5.chart, i6 = e5.renderer, s4 = this.stacks, o5 = t5.options.stackLabels?.animation, r4 = a4(e5, o5 || false), n5 = this.stackTotalGroup = this.stackTotalGroup || i6.g("stack-labels").attr({ zIndex: 6, opacity: 0 }).add();
              n5.translate(e5.plotLeft, e5.plotTop), x3(s4, (t6) => {
                x3(t6, (t7) => {
                  t7.render(n5);
                });
              }), n5.animate({ opacity: 1 }, r4);
            }
          }
          return (n4 || (n4 = {})).compose = function t5(e5, i6, s4) {
            if (b3(h3, t5)) {
              let t6 = i6.prototype, o5 = s4.prototype;
              d3(e5, "init", k3), d3(e5, "destroy", S3), t6.getStacks = v3, o5.getStackIndicator = M2, o5.modifyStacks = C3, o5.percentStacker = w3, o5.setGroupedPoints = T2, o5.setStackedPoints = A2;
            }
          }, n4;
        }), i4(e3, "Series/Line/LineSeries.js", [e3["Core/Series/Series.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          let { defined: s3, merge: o4, isObject: r3 } = i5;
          class n4 extends t4 {
            drawGraph() {
              let t5 = this.options, e5 = (this.gappedPath || this.getGraphPath).call(this), i6 = this.chart.styledMode;
              [this, ...this.zones].forEach((s4, n5) => {
                let a4, h3 = s4.graph, l3 = h3 ? "animate" : "attr", d3 = s4.dashStyle || t5.dashStyle;
                h3 ? (h3.endX = this.preventGraphAnimation ? null : e5.xMap, h3.animate({ d: e5 })) : e5.length && (s4.graph = h3 = this.chart.renderer.path(e5).addClass("highcharts-graph" + (n5 ? ` highcharts-zone-graph-${n5 - 1} ` : " ") + (n5 && s4.className || "")).attr({ zIndex: 1 }).add(this.group)), h3 && !i6 && (a4 = { stroke: !n5 && t5.lineColor || s4.color || this.color || "#cccccc", "stroke-width": t5.lineWidth || 0, fill: this.fillGraph && this.color || "none" }, d3 ? a4.dashstyle = d3 : "square" !== t5.linecap && (a4["stroke-linecap"] = a4["stroke-linejoin"] = "round"), h3[l3](a4).shadow(n5 < 2 && t5.shadow && o4({ filterUnits: "userSpaceOnUse" }, r3(t5.shadow) ? t5.shadow : {}))), h3 && (h3.startX = e5.xMap, h3.isArea = e5.isArea);
              });
            }
            getGraphPath(t5, e5, i6) {
              let o5 = this, r4 = o5.options, n5 = [], a4 = [], h3, l3 = r4.step;
              t5 = t5 || o5.points;
              let d3 = t5.reversed;
              return d3 && t5.reverse(), (l3 = { right: 1, center: 2 }[l3] || l3 && 3) && d3 && (l3 = 4 - l3), (t5 = this.getValidPoints(t5, false, !(r4.connectNulls && !e5 && !i6))).forEach(function(d4, c3) {
                let p3;
                let u4 = d4.plotX, g3 = d4.plotY, f3 = t5[c3 - 1], m3 = d4.isNull || "number" != typeof g3;
                (d4.leftCliff || f3 && f3.rightCliff) && !i6 && (h3 = true), m3 && !s3(e5) && c3 > 0 ? h3 = !r4.connectNulls : m3 && !e5 ? h3 = true : (0 === c3 || h3 ? p3 = [["M", d4.plotX, d4.plotY]] : o5.getPointSpline ? p3 = [o5.getPointSpline(t5, d4, c3)] : l3 ? (p3 = 1 === l3 ? [["L", f3.plotX, g3]] : 2 === l3 ? [["L", (f3.plotX + u4) / 2, f3.plotY], ["L", (f3.plotX + u4) / 2, g3]] : [["L", u4, f3.plotY]]).push(["L", u4, g3]) : p3 = [["L", u4, g3]], a4.push(d4.x), l3 && (a4.push(d4.x), 2 === l3 && a4.push(d4.x)), n5.push.apply(n5, p3), h3 = false);
              }), n5.xMap = a4, o5.graphPath = n5, n5;
            }
          }
          return n4.defaultOptions = o4(t4.defaultOptions, { legendSymbol: "lineMarker" }), e4.registerSeriesType("line", n4), n4;
        }), i4(e3, "Series/Area/AreaSeries.js", [e3["Core/Color/Color.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          let { parse: s3 } = t4, { seriesTypes: { line: o4 } } = e4, { extend: r3, merge: n4, objectEach: a4, pick: h3 } = i5;
          class l3 extends o4 {
            drawGraph() {
              this.areaPath = [], super.drawGraph.apply(this);
              let { areaPath: t5, options: e5 } = this;
              [this, ...this.zones].forEach((i6, s4) => {
                let o5 = {}, r4 = i6.fillColor || e5.fillColor, n5 = i6.area, a5 = n5 ? "animate" : "attr";
                n5 ? (n5.endX = this.preventGraphAnimation ? null : t5.xMap, n5.animate({ d: t5 })) : (o5.zIndex = 0, (n5 = i6.area = this.chart.renderer.path(t5).addClass("highcharts-area" + (s4 ? ` highcharts-zone-area-${s4 - 1} ` : " ") + (s4 && i6.className || "")).add(this.group)).isArea = true), this.chart.styledMode || (o5.fill = r4 || i6.color || this.color, o5["fill-opacity"] = r4 ? 1 : e5.fillOpacity ?? 0.75, n5.css({ pointerEvents: this.stickyTracking ? "none" : "auto" })), n5[a5](o5), n5.startX = t5.xMap, n5.shiftUnit = e5.step ? 2 : 1;
              });
            }
            getGraphPath(t5) {
              let e5, i6, s4;
              let r4 = o4.prototype.getGraphPath, n5 = this.options, a5 = n5.stacking, l4 = this.yAxis, d3 = [], c3 = [], p3 = this.index, u4 = l4.stacking.stacks[this.stackKey], g3 = n5.threshold, f3 = Math.round(l4.getThreshold(n5.threshold)), m3 = h3(n5.connectNulls, "percent" === a5), x3 = function(i7, s5, o5) {
                let r5 = t5[i7], n6 = a5 && u4[r5.x].points[p3], h4 = r5[o5 + "Null"] || 0, m4 = r5[o5 + "Cliff"] || 0, x4, y4, b4 = true;
                m4 || h4 ? (x4 = (h4 ? n6[0] : n6[1]) + m4, y4 = n6[0] + m4, b4 = !!h4) : !a5 && t5[s5] && t5[s5].isNull && (x4 = y4 = g3), void 0 !== x4 && (c3.push({ plotX: e5, plotY: null === x4 ? f3 : l4.getThreshold(x4), isNull: b4, isCliff: true }), d3.push({ plotX: e5, plotY: null === y4 ? f3 : l4.getThreshold(y4), doCurve: false }));
              };
              t5 = t5 || this.points, a5 && (t5 = this.getStackPoints(t5));
              for (let o5 = 0, r5 = t5.length; o5 < r5; ++o5)
                a5 || (t5[o5].leftCliff = t5[o5].rightCliff = t5[o5].leftNull = t5[o5].rightNull = void 0), i6 = t5[o5].isNull, e5 = h3(t5[o5].rectPlotX, t5[o5].plotX), s4 = a5 ? h3(t5[o5].yBottom, f3) : f3, i6 && !m3 || (m3 || x3(o5, o5 - 1, "left"), i6 && !a5 && m3 || (c3.push(t5[o5]), d3.push({ x: o5, plotX: e5, plotY: s4 })), m3 || x3(o5, o5 + 1, "right"));
              let y3 = r4.call(this, c3, true, true);
              d3.reversed = true;
              let b3 = r4.call(this, d3, true, true), v3 = b3[0];
              v3 && "M" === v3[0] && (b3[0] = ["L", v3[1], v3[2]]);
              let S3 = y3.concat(b3);
              S3.length && S3.push(["Z"]);
              let k3 = r4.call(this, c3, false, m3);
              return S3.xMap = y3.xMap, this.areaPath = S3, k3;
            }
            getStackPoints(t5) {
              let e5 = this, i6 = [], s4 = [], o5 = this.xAxis, r4 = this.yAxis, n5 = r4.stacking.stacks[this.stackKey], l4 = {}, d3 = r4.series, c3 = d3.length, p3 = r4.options.reversedStacks ? 1 : -1, u4 = d3.indexOf(e5);
              if (t5 = t5 || this.points, this.options.stacking) {
                for (let e6 = 0; e6 < t5.length; e6++)
                  t5[e6].leftNull = t5[e6].rightNull = void 0, l4[t5[e6].x] = t5[e6];
                a4(n5, function(t6, e6) {
                  null !== t6.total && s4.push(e6);
                }), s4.sort(function(t6, e6) {
                  return t6 - e6;
                });
                let g3 = d3.map((t6) => t6.visible);
                s4.forEach(function(t6, a5) {
                  let f3 = 0, m3, x3;
                  if (l4[t6] && !l4[t6].isNull)
                    i6.push(l4[t6]), [-1, 1].forEach(function(i7) {
                      let o6 = 1 === i7 ? "rightNull" : "leftNull", r5 = n5[s4[a5 + i7]], h4 = 0;
                      if (r5) {
                        let i8 = u4;
                        for (; i8 >= 0 && i8 < c3; ) {
                          let s5 = d3[i8].index;
                          !(m3 = r5.points[s5]) && (s5 === e5.index ? l4[t6][o6] = true : g3[i8] && (x3 = n5[t6].points[s5]) && (h4 -= x3[1] - x3[0])), i8 += p3;
                        }
                      }
                      l4[t6][1 === i7 ? "rightCliff" : "leftCliff"] = h4;
                    });
                  else {
                    let e6 = u4;
                    for (; e6 >= 0 && e6 < c3; ) {
                      let i7 = d3[e6].index;
                      if (m3 = n5[t6].points[i7]) {
                        f3 = m3[1];
                        break;
                      }
                      e6 += p3;
                    }
                    f3 = h3(f3, 0), f3 = r4.translate(f3, 0, 1, 0, 1), i6.push({ isNull: true, plotX: o5.translate(t6, 0, 0, 0, 1), x: t6, plotY: f3, yBottom: f3 });
                  }
                });
              }
              return i6;
            }
          }
          return l3.defaultOptions = n4(o4.defaultOptions, { threshold: 0, legendSymbol: "areaMarker" }), r3(l3.prototype, { singleStacks: false }), e4.registerSeriesType("area", l3), l3;
        }), i4(e3, "Series/Spline/SplineSeries.js", [e3["Core/Series/SeriesRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          let { line: i5 } = t4.seriesTypes, { merge: s3, pick: o4 } = e4;
          class r3 extends i5 {
            getPointSpline(t5, e5, i6) {
              let s4, r4, n4, a4;
              let h3 = e5.plotX || 0, l3 = e5.plotY || 0, d3 = t5[i6 - 1], c3 = t5[i6 + 1];
              function p3(t6) {
                return t6 && !t6.isNull && false !== t6.doCurve && !e5.isCliff;
              }
              if (p3(d3) && p3(c3)) {
                let t6 = d3.plotX || 0, i7 = d3.plotY || 0, o5 = c3.plotX || 0, p4 = c3.plotY || 0, u5 = 0;
                s4 = (1.5 * h3 + t6) / 2.5, r4 = (1.5 * l3 + i7) / 2.5, n4 = (1.5 * h3 + o5) / 2.5, a4 = (1.5 * l3 + p4) / 2.5, n4 !== s4 && (u5 = (a4 - r4) * (n4 - h3) / (n4 - s4) + l3 - a4), r4 += u5, a4 += u5, r4 > i7 && r4 > l3 ? (r4 = Math.max(i7, l3), a4 = 2 * l3 - r4) : r4 < i7 && r4 < l3 && (r4 = Math.min(i7, l3), a4 = 2 * l3 - r4), a4 > p4 && a4 > l3 ? (a4 = Math.max(p4, l3), r4 = 2 * l3 - a4) : a4 < p4 && a4 < l3 && (a4 = Math.min(p4, l3), r4 = 2 * l3 - a4), e5.rightContX = n4, e5.rightContY = a4, e5.controlPoints = { low: [s4, r4], high: [n4, a4] };
              }
              let u4 = ["C", o4(d3.rightContX, d3.plotX, 0), o4(d3.rightContY, d3.plotY, 0), o4(s4, h3, 0), o4(r4, l3, 0), h3, l3];
              return d3.rightContX = d3.rightContY = void 0, u4;
            }
          }
          return r3.defaultOptions = s3(i5.defaultOptions), t4.registerSeriesType("spline", r3), r3;
        }), i4(e3, "Series/AreaSpline/AreaSplineSeries.js", [e3["Series/Spline/SplineSeries.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          let { area: s3, area: { prototype: o4 } } = e4.seriesTypes, { extend: r3, merge: n4 } = i5;
          class a4 extends t4 {
          }
          return a4.defaultOptions = n4(t4.defaultOptions, s3.defaultOptions), r3(a4.prototype, { getGraphPath: o4.getGraphPath, getStackPoints: o4.getStackPoints, drawGraph: o4.drawGraph }), e4.registerSeriesType("areaspline", a4), a4;
        }), i4(e3, "Series/Column/ColumnSeriesDefaults.js", [], function() {
          return { borderRadius: 3, centerInCategory: false, groupPadding: 0.2, marker: null, pointPadding: 0.1, minPointLength: 0, cropThreshold: 50, pointRange: null, states: { hover: { halo: false, brightness: 0.1 }, select: { color: "#cccccc", borderColor: "#000000" } }, dataLabels: { align: void 0, verticalAlign: void 0, y: void 0 }, startFromThreshold: true, stickyTracking: false, tooltip: { distance: 6 }, threshold: 0, borderColor: "#ffffff" };
        }), i4(e3, "Series/Column/ColumnSeries.js", [e3["Core/Animation/AnimationUtilities.js"], e3["Core/Color/Color.js"], e3["Series/Column/ColumnSeriesDefaults.js"], e3["Core/Globals.js"], e3["Core/Series/Series.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3, o4, r3, n4) {
          let { animObject: a4 } = t4, { parse: h3 } = e4, { hasTouch: l3, noop: d3 } = s3, { clamp: c3, defined: p3, extend: u4, fireEvent: g3, isArray: f3, isNumber: m3, merge: x3, pick: y3, objectEach: b3, relativeLength: v3 } = n4;
          class S3 extends o4 {
            animate(t5) {
              let e5, i6;
              let s4 = this, o5 = this.yAxis, r4 = o5.pos, n5 = s4.options, h4 = this.chart.inverted, l4 = {}, d4 = h4 ? "translateX" : "translateY";
              t5 ? (l4.scaleY = 1e-3, i6 = c3(o5.toPixels(n5.threshold), r4, r4 + o5.len), h4 ? l4.translateX = i6 - o5.len : l4.translateY = i6, s4.clipBox && s4.setClip(), s4.group.attr(l4)) : (e5 = Number(s4.group.attr(d4)), s4.group.animate({ scaleY: 1 }, u4(a4(s4.options.animation), { step: function(t6, i7) {
                s4.group && (l4[d4] = e5 + i7.pos * (r4 - e5), s4.group.attr(l4));
              } })));
            }
            init(t5, e5) {
              super.init.apply(this, arguments);
              let i6 = this;
              (t5 = i6.chart).hasRendered && t5.series.forEach(function(t6) {
                t6.type === i6.type && (t6.isDirty = true);
              });
            }
            getColumnMetrics() {
              let t5 = this, e5 = t5.options, i6 = t5.xAxis, s4 = t5.yAxis, o5 = i6.options.reversedStacks, r4 = i6.reversed && !o5 || !i6.reversed && o5, n5 = {}, a5, h4 = 0;
              false === e5.grouping ? h4 = 1 : t5.chart.series.forEach(function(e6) {
                let i7;
                let o6 = e6.yAxis, r5 = e6.options;
                e6.type === t5.type && e6.reserveSpace() && s4.len === o6.len && s4.pos === o6.pos && (r5.stacking && "group" !== r5.stacking ? (void 0 === n5[a5 = e6.stackKey] && (n5[a5] = h4++), i7 = n5[a5]) : false !== r5.grouping && (i7 = h4++), e6.columnIndex = i7);
              });
              let l4 = Math.min(Math.abs(i6.transA) * (!i6.brokenAxis?.hasBreaks && i6.ordinal?.slope || e5.pointRange || i6.closestPointRange || i6.tickInterval || 1), i6.len), d4 = l4 * e5.groupPadding, c4 = (l4 - 2 * d4) / (h4 || 1), p4 = Math.min(e5.maxPointWidth || i6.len, y3(e5.pointWidth, c4 * (1 - 2 * e5.pointPadding))), u5 = (c4 - p4) / 2, g4 = (t5.columnIndex || 0) + (r4 ? 1 : 0), f4 = u5 + (d4 + g4 * c4 - l4 / 2) * (r4 ? -1 : 1);
              return t5.columnMetrics = { width: p4, offset: f4, paddedWidth: c4, columnCount: h4 }, t5.columnMetrics;
            }
            crispCol(t5, e5, i6, s4) {
              this.chart;
              let o5 = this.borderWidth, r4 = -(o5 % 2 ? 0.5 : 0), n5 = o5 % 2 ? 0.5 : 1;
              this.options.crisp && (i6 = Math.round(t5 + i6) + r4 - (t5 = Math.round(t5) + r4));
              let a5 = Math.round(e5 + s4) + n5, h4 = 0.5 >= Math.abs(e5) && a5 > 0.5;
              return s4 = a5 - (e5 = Math.round(e5) + n5), h4 && s4 && (e5 -= 1, s4 += 1), { x: t5, y: e5, width: i6, height: s4 };
            }
            adjustForMissingColumns(t5, e5, i6, s4) {
              if (!i6.isNull && s4.columnCount > 1) {
                let o5 = this.xAxis.series.filter((t6) => t6.visible).map((t6) => t6.index), r4 = 0, n5 = 0;
                b3(this.xAxis.stacking?.stacks, (t6) => {
                  if ("number" == typeof i6.x) {
                    let e6 = t6[i6.x.toString()];
                    if (e6) {
                      let t7 = e6.points[this.index];
                      if (f3(t7)) {
                        let t8 = Object.keys(e6.points).filter((t9) => !t9.match(",") && e6.points[t9] && e6.points[t9].length > 1).map(parseFloat).filter((t9) => -1 !== o5.indexOf(t9)).sort((t9, e7) => e7 - t9);
                        r4 = t8.indexOf(this.index), n5 = t8.length;
                      }
                    }
                  }
                });
                let a5 = (n5 - 1) * s4.paddedWidth + e5;
                t5 = (i6.plotX || 0) + a5 / 2 - e5 - r4 * s4.paddedWidth;
              }
              return t5;
            }
            translate() {
              let t5 = this, e5 = t5.chart, i6 = t5.options, s4 = t5.dense = t5.closestPointRange * t5.xAxis.transA < 2, r4 = t5.borderWidth = y3(i6.borderWidth, s4 ? 0 : 1), n5 = t5.xAxis, a5 = t5.yAxis, h4 = i6.threshold, l4 = y3(i6.minPointLength, 5), d4 = t5.getColumnMetrics(), u5 = d4.width, f4 = t5.pointXOffset = d4.offset, x4 = t5.dataMin, b4 = t5.dataMax, v4 = t5.barW = Math.max(u5, 1 + 2 * r4), S4 = t5.translatedThreshold = a5.getThreshold(h4);
              e5.inverted && (S4 -= 0.5), i6.pointPadding && (v4 = Math.ceil(v4)), o4.prototype.translate.apply(t5), t5.points.forEach(function(s5) {
                let o5 = y3(s5.yBottom, S4), r5 = 999 + Math.abs(o5), g4 = s5.plotX || 0, k3 = c3(s5.plotY, -r5, a5.len + r5);
                s5.stackBox;
                let M2, C3 = Math.min(k3, o5), w3 = Math.max(k3, o5) - C3, T2 = u5, A2 = g4 + f4, P2 = v4;
                l4 && Math.abs(w3) < l4 && (w3 = l4, M2 = !a5.reversed && !s5.negative || a5.reversed && s5.negative, m3(h4) && m3(b4) && s5.y === h4 && b4 <= h4 && (a5.min || 0) < h4 && (x4 !== b4 || (a5.max || 0) <= h4) && (M2 = !M2, s5.negative = !s5.negative), C3 = Math.abs(C3 - S4) > l4 ? o5 - l4 : S4 - (M2 ? l4 : 0)), p3(s5.options.pointWidth) && (A2 -= Math.round(((T2 = P2 = Math.ceil(s5.options.pointWidth)) - u5) / 2)), i6.centerInCategory && !i6.stacking && (A2 = t5.adjustForMissingColumns(A2, T2, s5, d4)), s5.barX = A2, s5.pointWidth = T2, s5.tooltipPos = e5.inverted ? [c3(a5.len + a5.pos - e5.plotLeft - k3, a5.pos - e5.plotLeft, a5.len + a5.pos - e5.plotLeft), n5.len + n5.pos - e5.plotTop - A2 - P2 / 2, w3] : [n5.left - e5.plotLeft + A2 + P2 / 2, c3(k3 + a5.pos - e5.plotTop, a5.pos - e5.plotTop, a5.len + a5.pos - e5.plotTop), w3], s5.shapeType = t5.pointClass.prototype.shapeType || "roundedRect", s5.shapeArgs = t5.crispCol(A2, s5.isNull ? S4 : C3, P2, s5.isNull ? 0 : w3);
              }), g3(this, "afterColumnTranslate");
            }
            drawGraph() {
              this.group[this.dense ? "addClass" : "removeClass"]("highcharts-dense-data");
            }
            pointAttribs(t5, e5) {
              let i6 = this.options, s4 = this.pointAttrToOptions || {}, o5 = s4.stroke || "borderColor", r4 = s4["stroke-width"] || "borderWidth", n5, a5, l4, d4 = t5 && t5.color || this.color, c4 = t5 && t5[o5] || i6[o5] || d4, p4 = t5 && t5.options.dashStyle || i6.dashStyle, u5 = t5 && t5[r4] || i6[r4] || this[r4] || 0, g4 = y3(t5 && t5.opacity, i6.opacity, 1);
              t5 && this.zones.length && (a5 = t5.getZone(), d4 = t5.options.color || a5 && (a5.color || t5.nonZonedColor) || this.color, a5 && (c4 = a5.borderColor || c4, p4 = a5.dashStyle || p4, u5 = a5.borderWidth || u5)), e5 && t5 && (l4 = (n5 = x3(i6.states[e5], t5.options.states && t5.options.states[e5] || {})).brightness, d4 = n5.color || void 0 !== l4 && h3(d4).brighten(n5.brightness).get() || d4, c4 = n5[o5] || c4, u5 = n5[r4] || u5, p4 = n5.dashStyle || p4, g4 = y3(n5.opacity, g4));
              let f4 = { fill: d4, stroke: c4, "stroke-width": u5, opacity: g4 };
              return p4 && (f4.dashstyle = p4), f4;
            }
            drawPoints(t5 = this.points) {
              let e5;
              let i6 = this, s4 = this.chart, o5 = i6.options, r4 = s4.renderer, n5 = o5.animationLimit || 250;
              t5.forEach(function(t6) {
                let a5 = t6.plotY, h4 = t6.graphic, l4 = !!h4, d4 = h4 && s4.pointCount < n5 ? "animate" : "attr";
                m3(a5) && null !== t6.y ? (e5 = t6.shapeArgs, h4 && t6.hasNewShapeType() && (h4 = h4.destroy()), i6.enabledDataSorting && (t6.startXPos = i6.xAxis.reversed ? -(e5 && e5.width || 0) : i6.xAxis.width), !h4 && (t6.graphic = h4 = r4[t6.shapeType](e5).add(t6.group || i6.group), h4 && i6.enabledDataSorting && s4.hasRendered && s4.pointCount < n5 && (h4.attr({ x: t6.startXPos }), l4 = true, d4 = "animate")), h4 && l4 && h4[d4](x3(e5)), s4.styledMode || h4[d4](i6.pointAttribs(t6, t6.selected && "select")).shadow(false !== t6.allowShadow && o5.shadow), h4 && (h4.addClass(t6.getClassName(), true), h4.attr({ visibility: t6.visible ? "inherit" : "hidden" }))) : h4 && (t6.graphic = h4.destroy());
              });
            }
            drawTracker(t5 = this.points) {
              let e5;
              let i6 = this, s4 = i6.chart, o5 = s4.pointer, r4 = function(t6) {
                let e6 = o5.getPointFromEvent(t6);
                void 0 !== e6 && i6.options.enableMouseTracking && (o5.isDirectTouch = true, e6.onMouseOver(t6));
              };
              t5.forEach(function(t6) {
                e5 = f3(t6.dataLabels) ? t6.dataLabels : t6.dataLabel ? [t6.dataLabel] : [], t6.graphic && (t6.graphic.element.point = t6), e5.forEach(function(e6) {
                  e6.div ? e6.div.point = t6 : e6.element.point = t6;
                });
              }), i6._hasTracking || (i6.trackerGroups.forEach(function(t6) {
                i6[t6] && (i6[t6].addClass("highcharts-tracker").on("mouseover", r4).on("mouseout", function(t7) {
                  o5.onTrackerMouseOut(t7);
                }), l3 && i6[t6].on("touchstart", r4), !s4.styledMode && i6.options.cursor && i6[t6].css({ cursor: i6.options.cursor }));
              }), i6._hasTracking = true), g3(this, "afterDrawTracker");
            }
            remove() {
              let t5 = this, e5 = t5.chart;
              e5.hasRendered && e5.series.forEach(function(e6) {
                e6.type === t5.type && (e6.isDirty = true);
              }), o4.prototype.remove.apply(t5, arguments);
            }
          }
          return S3.defaultOptions = x3(o4.defaultOptions, i5), u4(S3.prototype, { directTouch: true, getSymbol: d3, negStacks: true, trackerGroups: ["group", "dataLabelsGroup"] }), r3.registerSeriesType("column", S3), S3;
        }), i4(e3, "Core/Series/DataLabel.js", [e3["Core/Animation/AnimationUtilities.js"], e3["Core/Templating.js"], e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3) {
          var o4;
          let { getDeferredAnimation: r3 } = t4, { format: n4 } = e4, { composed: a4 } = i5, { defined: h3, extend: l3, fireEvent: d3, isArray: c3, isString: p3, merge: u4, objectEach: g3, pick: f3, pInt: m3, pushUnique: x3, splat: y3 } = s3;
          return function(t5) {
            function e5() {
              return k3(this).some((t6) => t6?.enabled);
            }
            function i6(t6, e6, i7, s5, o6) {
              let r4 = this, n5 = this.chart, a5 = this.isCartesian && n5.inverted, d4 = this.enabledDataSorting, c4 = t6.plotX, p4 = t6.plotY, u5 = i7.rotation, g4 = i7.align, m4 = h3(c4) && h3(p4) && n5.isInsidePlot(c4, Math.round(p4), { inverted: a5, paneCoordinates: true, series: r4 }), x4 = (i8) => {
                d4 && r4.xAxis && !S4 && r4.setDataLabelStartPos(t6, e6, o6, m4, i8);
              }, y4, b4, v4, S4 = "justify" === f3(i7.overflow, d4 ? "none" : "justify"), k4 = this.visible && false !== t6.visible && h3(c4) && (t6.series.forceDL || d4 && !S4 || m4 || f3(i7.inside, !!this.options.stacking) && s5 && n5.isInsidePlot(c4, a5 ? s5.x + 1 : s5.y + s5.height - 1, { inverted: a5, paneCoordinates: true, series: r4 })), M3 = t6.pos();
              if (k4 && M3) {
                u5 && e6.attr({ align: g4 });
                let t7 = e6.getBBox(true), a6 = [0, 0];
                if (y4 = n5.renderer.fontMetrics(e6).b, s5 = l3({ x: M3[0], y: Math.round(M3[1]), width: 0, height: 0 }, s5), l3(i7, { width: t7.width, height: t7.height }), u5 ? (S4 = false, b4 = n5.renderer.rotCorr(y4, u5), v4 = { x: s5.x + (i7.x || 0) + s5.width / 2 + b4.x, y: s5.y + (i7.y || 0) + { top: 0, middle: 0.5, bottom: 1 }[i7.verticalAlign] * s5.height }, a6 = [t7.x - Number(e6.attr("x")), t7.y - Number(e6.attr("y"))], x4(v4), e6[o6 ? "attr" : "animate"](v4)) : (x4(s5), e6.align(i7, void 0, s5), v4 = e6.alignAttr), S4 && s5.height >= 0)
                  this.justifyDataLabel(e6, i7, v4, t7, s5, o6);
                else if (f3(i7.crop, true)) {
                  let { x: e7, y: i8 } = v4;
                  e7 += a6[0], i8 += a6[1], k4 = n5.isInsidePlot(e7, i8, { paneCoordinates: true, series: r4 }) && n5.isInsidePlot(e7 + t7.width, i8 + t7.height, { paneCoordinates: true, series: r4 });
                }
                i7.shape && !u5 && e6[o6 ? "attr" : "animate"]({ anchorX: M3[0], anchorY: M3[1] });
              }
              o6 && d4 && (e6.placed = false), k4 || d4 && !S4 ? e6.show() : (e6.hide(), e6.placed = false);
            }
            function s4() {
              return this.plotGroup("dataLabelsGroup", "data-labels", this.hasRendered ? "inherit" : "hidden", this.options.dataLabels.zIndex || 6);
            }
            function o5(t6) {
              let e6 = this.hasRendered || 0, i7 = this.initDataLabelsGroup().attr({ opacity: +e6 });
              return !e6 && i7 && (this.visible && i7.show(), this.options.animation ? i7.animate({ opacity: 1 }, t6) : i7.attr({ opacity: 1 })), i7;
            }
            function b3(t6) {
              let e6;
              t6 = t6 || this.points;
              let i7 = this, s5 = i7.chart, o6 = i7.options, a5 = s5.renderer, { backgroundColor: l4, plotBackgroundColor: c4 } = s5.options.chart, u5 = a5.getContrast(p3(c4) && c4 || p3(l4) && l4 || "#000000"), x4 = k3(i7), { animation: b4, defer: v4 } = x4[0], M3 = v4 ? r3(s5, b4, i7) : { defer: 0, duration: 0 };
              d3(this, "drawDataLabels"), i7.hasDataLabels?.() && (e6 = this.initDataLabels(M3), t6.forEach((t7) => {
                let r4 = t7.dataLabels || [];
                y3(S3(x4, t7.dlOptions || t7.options?.dataLabels)).forEach((l6, d4) => {
                  let c5 = l6.enabled && t7.visible && (!t7.isNull || t7.dataLabelOnNull) && function(t8, e7) {
                    let i8 = e7.filter;
                    if (i8) {
                      let e8 = i8.operator, s6 = t8[i8.property], o7 = i8.value;
                      return ">" === e8 && s6 > o7 || "<" === e8 && s6 < o7 || ">=" === e8 && s6 >= o7 || "<=" === e8 && s6 <= o7 || "==" === e8 && s6 == o7 || "===" === e8 && s6 === o7 || "!=" === e8 && s6 != o7 || "!==" === e8 && s6 !== o7;
                    }
                    return true;
                  }(t7, l6), { backgroundColor: x5, borderColor: y4, distance: b5, style: v5 = {} } = l6, S4, k4, M4, C3, w3 = {}, T2 = r4[d4], A2 = !T2, P2;
                  if (c5 && (k4 = f3(l6[t7.formatPrefix + "Format"], l6.format), S4 = t7.getLabelConfig(), M4 = h3(k4) ? n4(k4, S4, s5) : (l6[t7.formatPrefix + "Formatter"] || l6.formatter).call(S4, l6), C3 = l6.rotation, !s5.styledMode && (v5.color = f3(l6.color, v5.color, p3(i7.color) ? i7.color : void 0, "#000000"), "contrast" === v5.color ? ("none" !== x5 && (P2 = x5), t7.contrastColor = a5.getContrast("auto" !== P2 && P2 || t7.color || i7.color), v5.color = P2 || !h3(b5) && l6.inside || 0 > m3(b5 || 0) || o6.stacking ? t7.contrastColor : u5) : delete t7.contrastColor, o6.cursor && (v5.cursor = o6.cursor)), w3 = { r: l6.borderRadius || 0, rotation: C3, padding: l6.padding, zIndex: 1 }, s5.styledMode || (w3.fill = "auto" === x5 ? t7.color : x5, w3.stroke = "auto" === y4 ? t7.color : y4, w3["stroke-width"] = l6.borderWidth), g3(w3, (t8, e7) => {
                    void 0 === t8 && delete w3[e7];
                  })), !T2 || c5 && h3(M4) && !!T2.div == !!l6.useHTML && (T2.rotation && l6.rotation || T2.rotation === l6.rotation) || (T2 = void 0, A2 = true), c5 && h3(M4) && (T2 ? w3.text = M4 : (T2 = C3 ? a5.text(M4, 0, 0, l6.useHTML).addClass("highcharts-data-label") : a5.label(M4, 0, 0, l6.shape, void 0, void 0, l6.useHTML, void 0, "data-label")) && T2.addClass(" highcharts-data-label-color-" + t7.colorIndex + " " + (l6.className || "") + (l6.useHTML ? " highcharts-tracker" : "")), T2)) {
                    T2.options = l6, T2.attr(w3), s5.styledMode || T2.css(v5).shadow(l6.shadow);
                    let o7 = l6[t7.formatPrefix + "TextPath"] || l6.textPath;
                    o7 && !l6.useHTML && (T2.setTextPath(t7.getDataLabelPath?.(T2) || t7.graphic, o7), t7.dataLabelPath && !o7.enabled && (t7.dataLabelPath = t7.dataLabelPath.destroy())), T2.added || T2.add(e6), i7.alignDataLabel(t7, T2, l6, void 0, A2), T2.isActive = true, r4[d4] && r4[d4] !== T2 && r4[d4].destroy(), r4[d4] = T2;
                  }
                });
                let l5 = r4.length;
                for (; l5--; )
                  r4[l5] && r4[l5].isActive ? r4[l5].isActive = false : (r4[l5]?.destroy(), r4.splice(l5, 1));
                t7.dataLabel = r4[0], t7.dataLabels = r4;
              })), d3(this, "afterDrawDataLabels");
            }
            function v3(t6, e6, i7, s5, o6, r4) {
              let n5 = this.chart, a5 = e6.align, h4 = e6.verticalAlign, l4 = t6.box ? 0 : t6.padding || 0, { x: d4 = 0, y: c4 = 0 } = e6, p4, u5;
              return (p4 = (i7.x || 0) + l4) < 0 && ("right" === a5 && d4 >= 0 ? (e6.align = "left", e6.inside = true) : d4 -= p4, u5 = true), (p4 = (i7.x || 0) + s5.width - l4) > n5.plotWidth && ("left" === a5 && d4 <= 0 ? (e6.align = "right", e6.inside = true) : d4 += n5.plotWidth - p4, u5 = true), (p4 = i7.y + l4) < 0 && ("bottom" === h4 && c4 >= 0 ? (e6.verticalAlign = "top", e6.inside = true) : c4 -= p4, u5 = true), (p4 = (i7.y || 0) + s5.height - l4) > n5.plotHeight && ("top" === h4 && c4 <= 0 ? (e6.verticalAlign = "bottom", e6.inside = true) : c4 += n5.plotHeight - p4, u5 = true), u5 && (e6.x = d4, e6.y = c4, t6.placed = !r4, t6.align(e6, void 0, o6)), u5;
            }
            function S3(t6, e6) {
              let i7 = [], s5;
              if (c3(t6) && !c3(e6))
                i7 = t6.map(function(t7) {
                  return u4(t7, e6);
                });
              else if (c3(e6) && !c3(t6))
                i7 = e6.map(function(e7) {
                  return u4(t6, e7);
                });
              else if (c3(t6) || c3(e6)) {
                if (c3(t6) && c3(e6))
                  for (s5 = Math.max(t6.length, e6.length); s5--; )
                    i7[s5] = u4(t6[s5], e6[s5]);
              } else
                i7 = u4(t6, e6);
              return i7;
            }
            function k3(t6) {
              let e6 = t6.chart.options.plotOptions;
              return y3(S3(S3(e6?.series?.dataLabels, e6?.[t6.type]?.dataLabels), t6.options.dataLabels));
            }
            function M2(t6, e6, i7, s5, o6) {
              let r4 = this.chart, n5 = r4.inverted, a5 = this.xAxis, h4 = a5.reversed, l4 = ((n5 ? e6.height : e6.width) || 0) / 2, d4 = t6.pointWidth, c4 = d4 ? d4 / 2 : 0;
              e6.startXPos = n5 ? o6.x : h4 ? -l4 - c4 : a5.width - l4 + c4, e6.startYPos = n5 ? h4 ? this.yAxis.height - l4 + c4 : -l4 - c4 : o6.y, s5 ? "hidden" === e6.visibility && (e6.show(), e6.attr({ opacity: 0 }).animate({ opacity: 1 })) : e6.attr({ opacity: 1 }).animate({ opacity: 0 }, void 0, e6.hide), r4.hasRendered && (i7 && e6.attr({ x: e6.startXPos, y: e6.startYPos }), e6.placed = true);
            }
            t5.compose = function t6(r4) {
              if (x3(a4, t6)) {
                let t7 = r4.prototype;
                t7.initDataLabelsGroup = s4, t7.initDataLabels = o5, t7.alignDataLabel = i6, t7.drawDataLabels = b3, t7.justifyDataLabel = v3, t7.setDataLabelStartPos = M2, t7.hasDataLabels = e5;
              }
            };
          }(o4 || (o4 = {})), o4;
        }), i4(e3, "Series/Column/ColumnDataLabel.js", [e3["Core/Series/DataLabel.js"], e3["Core/Globals.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3) {
          var o4;
          let { composed: r3 } = e4, { series: n4 } = i5, { merge: a4, pick: h3, pushUnique: l3 } = s3;
          return function(e5) {
            function i6(t5, e6, i7, s4, o5) {
              let r4 = this.chart.inverted, l4 = t5.series, d3 = (l4.xAxis ? l4.xAxis.len : this.chart.plotSizeX) || 0, c3 = (l4.yAxis ? l4.yAxis.len : this.chart.plotSizeY) || 0, p3 = t5.dlBox || t5.shapeArgs, u4 = h3(t5.below, t5.plotY > h3(this.translatedThreshold, c3)), g3 = h3(i7.inside, !!this.options.stacking);
              if (p3) {
                if (s4 = a4(p3), !("allow" === i7.overflow && false === i7.crop)) {
                  s4.y < 0 && (s4.height += s4.y, s4.y = 0);
                  let t6 = s4.y + s4.height - c3;
                  t6 > 0 && t6 < s4.height && (s4.height -= t6);
                }
                r4 && (s4 = { x: c3 - s4.y - s4.height, y: d3 - s4.x - s4.width, width: s4.height, height: s4.width }), g3 || (r4 ? (s4.x += u4 ? 0 : s4.width, s4.width = 0) : (s4.y += u4 ? s4.height : 0, s4.height = 0));
              }
              i7.align = h3(i7.align, !r4 || g3 ? "center" : u4 ? "right" : "left"), i7.verticalAlign = h3(i7.verticalAlign, r4 || g3 ? "middle" : u4 ? "top" : "bottom"), n4.prototype.alignDataLabel.call(this, t5, e6, i7, s4, o5), i7.inside && t5.contrastColor && e6.css({ color: t5.contrastColor });
            }
            e5.compose = function e6(s4) {
              t4.compose(n4), l3(r3, e6) && (s4.prototype.alignDataLabel = i6);
            };
          }(o4 || (o4 = {})), o4;
        }), i4(e3, "Series/Bar/BarSeries.js", [e3["Series/Column/ColumnSeries.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          let { extend: s3, merge: o4 } = i5;
          class r3 extends t4 {
          }
          return r3.defaultOptions = o4(t4.defaultOptions, {}), s3(r3.prototype, { inverted: true }), e4.registerSeriesType("bar", r3), r3;
        }), i4(e3, "Series/Scatter/ScatterSeriesDefaults.js", [], function() {
          return { lineWidth: 0, findNearestPointBy: "xy", jitter: { x: 0, y: 0 }, marker: { enabled: true }, tooltip: { headerFormat: '<span style="color:{point.color}">\u25CF</span> <span style="font-size: 0.8em"> {series.name}</span><br/>', pointFormat: "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>" } };
        }), i4(e3, "Series/Scatter/ScatterSeries.js", [e3["Series/Scatter/ScatterSeriesDefaults.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          let { column: s3, line: o4 } = e4.seriesTypes, { addEvent: r3, extend: n4, merge: a4 } = i5;
          class h3 extends o4 {
            applyJitter() {
              let t5 = this, e5 = this.options.jitter, i6 = this.points.length;
              e5 && this.points.forEach(function(s4, o5) {
                ["x", "y"].forEach(function(r4, n5) {
                  let a5, h4 = "plot" + r4.toUpperCase(), l3, d3, c3;
                  e5[r4] && !s4.isNull && (a5 = t5[r4 + "Axis"], c3 = e5[r4] * a5.transA, a5 && !a5.isLog && (l3 = Math.max(0, s4[h4] - c3), d3 = Math.min(a5.len, s4[h4] + c3), s4[h4] = l3 + (d3 - l3) * function(t6) {
                    let e6 = 1e4 * Math.sin(t6);
                    return e6 - Math.floor(e6);
                  }(o5 + n5 * i6), "x" === r4 && (s4.clientX = s4.plotX)));
                });
              });
            }
            drawGraph() {
              this.options.lineWidth ? super.drawGraph() : this.graph && (this.graph = this.graph.destroy());
            }
          }
          return h3.defaultOptions = a4(o4.defaultOptions, t4), n4(h3.prototype, { drawTracker: s3.prototype.drawTracker, sorted: false, requireSorting: false, noSharedTooltip: true, trackerGroups: ["group", "markerGroup", "dataLabelsGroup"] }), r3(h3, "afterTranslate", function() {
            this.applyJitter();
          }), e4.registerSeriesType("scatter", h3), h3;
        }), i4(e3, "Series/CenteredUtilities.js", [e3["Core/Globals.js"], e3["Core/Series/Series.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          var s3, o4;
          let { deg2rad: r3 } = t4, { fireEvent: n4, isNumber: a4, pick: h3, relativeLength: l3 } = i5;
          return (o4 = s3 || (s3 = {})).getCenter = function() {
            let t5 = this.options, i6 = this.chart, s4 = 2 * (t5.slicedOffset || 0), o5 = i6.plotWidth - 2 * s4, r4 = i6.plotHeight - 2 * s4, d3 = t5.center, c3 = Math.min(o5, r4), p3 = t5.thickness, u4, g3 = t5.size, f3 = t5.innerSize || 0, m3, x3;
            "string" == typeof g3 && (g3 = parseFloat(g3)), "string" == typeof f3 && (f3 = parseFloat(f3));
            let y3 = [h3(d3[0], "50%"), h3(d3[1], "50%"), h3(g3 && g3 < 0 ? void 0 : t5.size, "100%"), h3(f3 && f3 < 0 ? void 0 : t5.innerSize || 0, "0%")];
            for (!i6.angular || this instanceof e4 || (y3[3] = 0), m3 = 0; m3 < 4; ++m3)
              x3 = y3[m3], u4 = m3 < 2 || 2 === m3 && /%$/.test(x3), y3[m3] = l3(x3, [o5, r4, c3, y3[2]][m3]) + (u4 ? s4 : 0);
            return y3[3] > y3[2] && (y3[3] = y3[2]), a4(p3) && 2 * p3 < y3[2] && p3 > 0 && (y3[3] = y3[2] - 2 * p3), n4(this, "afterGetCenter", { positions: y3 }), y3;
          }, o4.getStartAndEndRadians = function(t5, e5) {
            let i6 = a4(t5) ? t5 : 0, s4 = a4(e5) && e5 > i6 && e5 - i6 < 360 ? e5 : i6 + 360;
            return { start: r3 * (i6 + -90), end: r3 * (s4 + -90) };
          }, s3;
        }), i4(e3, "Series/Pie/PiePoint.js", [e3["Core/Animation/AnimationUtilities.js"], e3["Core/Series/Point.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          let { setAnimation: s3 } = t4, { addEvent: o4, defined: r3, extend: n4, isNumber: a4, isString: h3, pick: l3, relativeLength: d3 } = i5;
          class c3 extends e4 {
            getConnectorPath(t5) {
              let e5 = t5.dataLabelPosition, i6 = t5.options || {}, s4 = i6.connectorShape, o5 = this.connectorShapes[s4] || s4;
              return e5 && o5.call(this, { ...e5.computed, alignment: e5.alignment }, e5.connectorPosition, i6) || [];
            }
            getTranslate() {
              return this.sliced && this.slicedTranslation || { translateX: 0, translateY: 0 };
            }
            haloPath(t5) {
              let e5 = this.shapeArgs;
              return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(e5.x, e5.y, e5.r + t5, e5.r + t5, { innerR: e5.r - 1, start: e5.start, end: e5.end, borderRadius: e5.borderRadius });
            }
            constructor(t5, e5, i6) {
              super(t5, e5, i6), this.half = 0, this.name ?? (this.name = "Slice");
              let s4 = (t6) => {
                this.slice("select" === t6.type);
              };
              o4(this, "select", s4), o4(this, "unselect", s4);
            }
            isValid() {
              return a4(this.y) && this.y >= 0;
            }
            setVisible(t5, e5 = true) {
              t5 !== this.visible && this.update({ visible: t5 ?? !this.visible }, e5, void 0, false);
            }
            slice(t5, e5, i6) {
              let o5 = this.series, n5 = o5.chart;
              s3(i6, n5), e5 = l3(e5, true), this.sliced = this.options.sliced = t5 = r3(t5) ? t5 : !this.sliced, o5.options.data[o5.data.indexOf(this)] = this.options, this.graphic && this.graphic.animate(this.getTranslate());
            }
          }
          return n4(c3.prototype, { connectorShapes: { fixedOffset: function(t5, e5, i6) {
            let s4 = e5.breakAt, o5 = e5.touchingSliceAt, r4 = i6.softConnector ? ["C", t5.x + ("left" === t5.alignment ? -5 : 5), t5.y, 2 * s4.x - o5.x, 2 * s4.y - o5.y, s4.x, s4.y] : ["L", s4.x, s4.y];
            return [["M", t5.x, t5.y], r4, ["L", o5.x, o5.y]];
          }, straight: function(t5, e5) {
            let i6 = e5.touchingSliceAt;
            return [["M", t5.x, t5.y], ["L", i6.x, i6.y]];
          }, crookedLine: function(t5, e5, i6) {
            let { breakAt: s4, touchingSliceAt: o5 } = e5, { series: r4 } = this, [n5, a5, h4] = r4.center, l4 = h4 / 2, { plotLeft: c4, plotWidth: p3 } = r4.chart, u4 = "left" === t5.alignment, { x: g3, y: f3 } = t5, m3 = s4.x;
            if (i6.crookDistance) {
              let t6 = d3(i6.crookDistance, 1);
              m3 = u4 ? n5 + l4 + (p3 + c4 - n5 - l4) * (1 - t6) : c4 + (n5 - l4) * t6;
            } else
              m3 = n5 + (a5 - f3) * Math.tan((this.angle || 0) - Math.PI / 2);
            let x3 = [["M", g3, f3]];
            return (u4 ? m3 <= g3 && m3 >= s4.x : m3 >= g3 && m3 <= s4.x) && x3.push(["L", m3, f3]), x3.push(["L", s4.x, s4.y], ["L", o5.x, o5.y]), x3;
          } } }), c3;
        }), i4(e3, "Series/Pie/PieSeriesDefaults.js", [], function() {
          return { borderRadius: 3, center: [null, null], clip: false, colorByPoint: true, dataLabels: { connectorPadding: 5, connectorShape: "crookedLine", crookDistance: void 0, distance: 30, enabled: true, formatter: function() {
            return this.point.isNull ? void 0 : this.point.name;
          }, softConnector: true, x: 0 }, fillColor: void 0, ignoreHiddenPoint: true, inactiveOtherPoints: true, legendType: "point", marker: null, size: null, showInLegend: false, slicedOffset: 10, stickyTracking: false, tooltip: { followPointer: true }, borderColor: "#ffffff", borderWidth: 1, lineWidth: void 0, states: { hover: { brightness: 0.1 } } };
        }), i4(e3, "Series/Pie/PieSeries.js", [e3["Series/CenteredUtilities.js"], e3["Series/Column/ColumnSeries.js"], e3["Core/Globals.js"], e3["Series/Pie/PiePoint.js"], e3["Series/Pie/PieSeriesDefaults.js"], e3["Core/Series/Series.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Renderer/SVG/Symbols.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3, o4, r3, n4, a4, h3) {
          let { getStartAndEndRadians: l3 } = t4, { noop: d3 } = i5, { clamp: c3, extend: p3, fireEvent: u4, merge: g3, pick: f3, relativeLength: m3, splat: x3 } = h3;
          class y3 extends r3 {
            animate(t5) {
              let e5 = this, i6 = e5.points, s4 = e5.startAngleRad;
              t5 || i6.forEach(function(t6) {
                let i7 = t6.graphic, o5 = t6.shapeArgs;
                i7 && o5 && (i7.attr({ r: f3(t6.startR, e5.center && e5.center[3] / 2), start: s4, end: s4 }), i7.animate({ r: o5.r, start: o5.start, end: o5.end }, e5.options.animation));
              });
            }
            drawEmpty() {
              let t5, e5;
              let i6 = this.startAngleRad, s4 = this.endAngleRad, o5 = this.options;
              0 === this.total && this.center ? (t5 = this.center[0], e5 = this.center[1], this.graph || (this.graph = this.chart.renderer.arc(t5, e5, this.center[1] / 2, 0, i6, s4).addClass("highcharts-empty-series").add(this.group)), this.graph.attr({ d: a4.arc(t5, e5, this.center[2] / 2, 0, { start: i6, end: s4, innerR: this.center[3] / 2 }) }), this.chart.styledMode || this.graph.attr({ "stroke-width": o5.borderWidth, fill: o5.fillColor || "none", stroke: o5.color || "#cccccc" })) : this.graph && (this.graph = this.graph.destroy());
            }
            drawPoints() {
              let t5 = this.chart.renderer;
              this.points.forEach(function(e5) {
                e5.graphic && e5.hasNewShapeType() && (e5.graphic = e5.graphic.destroy()), e5.graphic || (e5.graphic = t5[e5.shapeType](e5.shapeArgs).add(e5.series.group), e5.delayedRendering = true);
              });
            }
            generatePoints() {
              super.generatePoints(), this.updateTotals();
            }
            getX(t5, e5, i6, s4) {
              let o5 = this.center, r4 = this.radii ? this.radii[i6.index] || 0 : o5[2] / 2, n5 = s4.dataLabelPosition, a5 = n5?.distance || 0, h4 = Math.asin(c3((t5 - o5[1]) / (r4 + a5), -1, 1)), l4 = o5[0] + (e5 ? -1 : 1) * (Math.cos(h4) * (r4 + a5)) + (a5 > 0 ? (e5 ? -1 : 1) * (s4.padding || 0) : 0);
              return l4;
            }
            hasData() {
              return !!this.processedXData.length;
            }
            redrawPoints() {
              let t5, e5, i6, s4;
              let o5 = this, r4 = o5.chart;
              this.drawEmpty(), o5.group && !r4.styledMode && o5.group.shadow(o5.options.shadow), o5.points.forEach(function(n5) {
                let a5 = {};
                e5 = n5.graphic, !n5.isNull && e5 ? (s4 = n5.shapeArgs, t5 = n5.getTranslate(), r4.styledMode || (i6 = o5.pointAttribs(n5, n5.selected && "select")), n5.delayedRendering ? (e5.setRadialReference(o5.center).attr(s4).attr(t5), r4.styledMode || e5.attr(i6).attr({ "stroke-linejoin": "round" }), n5.delayedRendering = false) : (e5.setRadialReference(o5.center), r4.styledMode || g3(true, a5, i6), g3(true, a5, s4, t5), e5.animate(a5)), e5.attr({ visibility: n5.visible ? "inherit" : "hidden" }), e5.addClass(n5.getClassName(), true)) : e5 && (n5.graphic = e5.destroy());
              });
            }
            sortByAngle(t5, e5) {
              t5.sort(function(t6, i6) {
                return void 0 !== t6.angle && (i6.angle - t6.angle) * e5;
              });
            }
            translate(t5) {
              u4(this, "translate"), this.generatePoints();
              let e5 = this.options, i6 = e5.slicedOffset, s4 = l3(e5.startAngle, e5.endAngle), o5 = this.startAngleRad = s4.start, r4 = this.endAngleRad = s4.end, n5 = r4 - o5, a5 = this.points, h4 = e5.ignoreHiddenPoint, d4 = a5.length, c4, p4, g4, f4, m4, x4, y4, b3 = 0;
              for (t5 || (this.center = t5 = this.getCenter()), x4 = 0; x4 < d4; x4++) {
                y4 = a5[x4], c4 = o5 + b3 * n5, y4.isValid() && (!h4 || y4.visible) && (b3 += y4.percentage / 100), p4 = o5 + b3 * n5;
                let e6 = { x: t5[0], y: t5[1], r: t5[2] / 2, innerR: t5[3] / 2, start: Math.round(1e3 * c4) / 1e3, end: Math.round(1e3 * p4) / 1e3 };
                y4.shapeType = "arc", y4.shapeArgs = e6, (g4 = (p4 + c4) / 2) > 1.5 * Math.PI ? g4 -= 2 * Math.PI : g4 < -Math.PI / 2 && (g4 += 2 * Math.PI), y4.slicedTranslation = { translateX: Math.round(Math.cos(g4) * i6), translateY: Math.round(Math.sin(g4) * i6) }, f4 = Math.cos(g4) * t5[2] / 2, m4 = Math.sin(g4) * t5[2] / 2, y4.tooltipPos = [t5[0] + 0.7 * f4, t5[1] + 0.7 * m4], y4.half = g4 < -Math.PI / 2 || g4 > Math.PI / 2 ? 1 : 0, y4.angle = g4;
              }
              u4(this, "afterTranslate");
            }
            updateTotals() {
              let t5 = this.points, e5 = t5.length, i6 = this.options.ignoreHiddenPoint, s4, o5, r4 = 0;
              for (s4 = 0; s4 < e5; s4++)
                (o5 = t5[s4]).isValid() && (!i6 || o5.visible) && (r4 += o5.y);
              for (s4 = 0, this.total = r4; s4 < e5; s4++)
                (o5 = t5[s4]).percentage = r4 > 0 && (o5.visible || !i6) ? o5.y / r4 * 100 : 0, o5.total = r4;
            }
          }
          return y3.defaultOptions = g3(r3.defaultOptions, o4), p3(y3.prototype, { axisTypes: [], directTouch: true, drawGraph: void 0, drawTracker: e4.prototype.drawTracker, getCenter: t4.getCenter, getSymbol: d3, isCartesian: false, noSharedTooltip: true, pointAttribs: e4.prototype.pointAttribs, pointClass: s3, requireSorting: false, searchPoint: d3, trackerGroups: ["group", "dataLabelsGroup"] }), n4.registerSeriesType("pie", y3), y3;
        }), i4(e3, "Series/Pie/PieDataLabel.js", [e3["Core/Series/DataLabel.js"], e3["Core/Globals.js"], e3["Core/Renderer/RendererUtilities.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4, i5, s3, o4) {
          var r3;
          let { composed: n4, noop: a4 } = e4, { distribute: h3 } = i5, { series: l3 } = s3, { arrayMax: d3, clamp: c3, defined: p3, pick: u4, pushUnique: g3, relativeLength: f3 } = o4;
          return function(e5) {
            let i6 = { radialDistributionY: function(t5, e6) {
              return (e6.dataLabelPosition?.top || 0) + t5.distributeBox.pos;
            }, radialDistributionX: function(t5, e6, i7, s5, o6) {
              let r5 = o6.dataLabelPosition;
              return t5.getX(i7 < (r5?.top || 0) + 2 || i7 > (r5?.bottom || 0) - 2 ? s5 : i7, e6.half, e6, o6);
            }, justify: function(t5, e6, i7, s5) {
              return s5[0] + (t5.half ? -1 : 1) * (i7 + (e6.dataLabelPosition?.distance || 0));
            }, alignToPlotEdges: function(t5, e6, i7, s5) {
              let o6 = t5.getBBox().width;
              return e6 ? o6 + s5 : i7 - o6 - s5;
            }, alignToConnectors: function(t5, e6, i7, s5) {
              let o6 = 0, r5;
              return t5.forEach(function(t6) {
                (r5 = t6.dataLabel.getBBox().width) > o6 && (o6 = r5);
              }), e6 ? o6 + s5 : i7 - o6 - s5;
            } };
            function s4(t5, e6) {
              let { center: i7, options: s5 } = this, o6 = i7[2] / 2, r5 = t5.angle || 0, n5 = Math.cos(r5), a5 = Math.sin(r5), h4 = i7[0] + n5 * o6, l4 = i7[1] + a5 * o6, d4 = Math.min((s5.slicedOffset || 0) + (s5.borderWidth || 0), e6 / 5);
              return { natural: { x: h4 + n5 * e6, y: l4 + a5 * e6 }, computed: {}, alignment: e6 < 0 ? "center" : t5.half ? "right" : "left", connectorPosition: { breakAt: { x: h4 + n5 * d4, y: l4 + a5 * d4 }, touchingSliceAt: { x: h4, y: l4 } }, distance: e6 };
            }
            function o5() {
              let t5 = this, e6 = t5.points, i7 = t5.chart, s5 = i7.plotWidth, o6 = i7.plotHeight, r5 = i7.plotLeft, n5 = Math.round(i7.chartWidth / 3), a5 = t5.center, c4 = a5[2] / 2, g4 = a5[1], m4 = [[], []], x3 = [0, 0, 0, 0], y3 = t5.dataLabelPositioners, b3, v3, S3, k3 = 0;
              t5.visible && t5.hasDataLabels?.() && (e6.forEach((t6) => {
                (t6.dataLabels || []).forEach((t7) => {
                  t7.shortened && (t7.attr({ width: "auto" }).css({ width: "auto", textOverflow: "clip" }), t7.shortened = false);
                });
              }), l3.prototype.drawDataLabels.apply(t5), e6.forEach((t6) => {
                (t6.dataLabels || []).forEach((e7, i8) => {
                  let s6 = a5[2] / 2, o7 = e7.options, r6 = f3(o7?.distance || 0, s6);
                  0 === i8 && m4[t6.half].push(t6), !p3(o7?.style?.width) && e7.getBBox().width > n5 && (e7.css({ width: Math.round(0.7 * n5) + "px" }), e7.shortened = true), e7.dataLabelPosition = this.getDataLabelPosition(t6, r6), k3 = Math.max(k3, r6);
                });
              }), m4.forEach((e7, n6) => {
                let l4 = e7.length, d4 = [], f4, m5, b4 = 0, M2;
                l4 && (t5.sortByAngle(e7, n6 - 0.5), k3 > 0 && (f4 = Math.max(0, g4 - c4 - k3), m5 = Math.min(g4 + c4 + k3, i7.plotHeight), e7.forEach((t6) => {
                  (t6.dataLabels || []).forEach((e8, s6) => {
                    let o7 = e8.dataLabelPosition;
                    o7 && o7.distance > 0 && (o7.top = Math.max(0, g4 - c4 - o7.distance), o7.bottom = Math.min(g4 + c4 + o7.distance, i7.plotHeight), b4 = e8.getBBox().height || 21, t6.distributeBox = { target: (e8.dataLabelPosition?.natural.y || 0) - o7.top + b4 / 2, size: b4, rank: t6.y }, d4.push(t6.distributeBox));
                  });
                }), h3(d4, M2 = m5 + b4 - f4, M2 / 5)), e7.forEach((i8) => {
                  (i8.dataLabels || []).forEach((h4) => {
                    let l5 = h4.options || {}, g5 = i8.distributeBox, f5 = h4.dataLabelPosition, m6 = f5?.natural.y || 0, b5 = l5.connectorPadding || 0, k4 = 0, M3 = m6, C3 = "inherit";
                    if (f5) {
                      if (d4 && p3(g5) && f5.distance > 0 && (void 0 === g5.pos ? C3 = "hidden" : (S3 = g5.size, M3 = y3.radialDistributionY(i8, h4))), l5.justify)
                        k4 = y3.justify(i8, h4, c4, a5);
                      else
                        switch (l5.alignTo) {
                          case "connectors":
                            k4 = y3.alignToConnectors(e7, n6, s5, r5);
                            break;
                          case "plotEdges":
                            k4 = y3.alignToPlotEdges(h4, n6, s5, r5);
                            break;
                          default:
                            k4 = y3.radialDistributionX(t5, i8, M3, m6, h4);
                        }
                      if (f5.attribs = { visibility: C3, align: f5.alignment }, f5.posAttribs = { x: k4 + (l5.x || 0) + ({ left: b5, right: -b5 }[f5.alignment] || 0), y: M3 + (l5.y || 0) - h4.getBBox().height / 2 }, f5.computed.x = k4, f5.computed.y = M3, u4(l5.crop, true)) {
                        let t6;
                        k4 - (v3 = h4.getBBox().width) < b5 && 1 === n6 ? (t6 = Math.round(v3 - k4 + b5), x3[3] = Math.max(t6, x3[3])) : k4 + v3 > s5 - b5 && 0 === n6 && (t6 = Math.round(k4 + v3 - s5 + b5), x3[1] = Math.max(t6, x3[1])), M3 - S3 / 2 < 0 ? x3[0] = Math.max(Math.round(-M3 + S3 / 2), x3[0]) : M3 + S3 / 2 > o6 && (x3[2] = Math.max(Math.round(M3 + S3 / 2 - o6), x3[2])), f5.sideOverflow = t6;
                      }
                    }
                  });
                }));
              }), (0 === d3(x3) || this.verifyDataLabelOverflow(x3)) && (this.placeDataLabels(), this.points.forEach((e7) => {
                (e7.dataLabels || []).forEach((s6) => {
                  let { connectorColor: o7, connectorWidth: r6 = 1 } = s6.options || {}, n6 = s6.dataLabelPosition;
                  if (r6) {
                    let a6;
                    b3 = s6.connector, n6 && n6.distance > 0 ? (a6 = !b3, b3 || (s6.connector = b3 = i7.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-" + e7.colorIndex + (e7.className ? " " + e7.className : "")).add(t5.dataLabelsGroup)), i7.styledMode || b3.attr({ "stroke-width": r6, stroke: o7 || e7.color || "#666666" }), b3[a6 ? "attr" : "animate"]({ d: e7.getConnectorPath(s6) }), b3.attr({ visibility: n6.attribs?.visibility })) : b3 && (s6.connector = b3.destroy());
                  }
                });
              })));
            }
            function r4() {
              this.points.forEach((t5) => {
                (t5.dataLabels || []).forEach((t6) => {
                  let e6 = t6.dataLabelPosition;
                  e6 ? (e6.sideOverflow && (t6.css({ width: Math.max(t6.getBBox().width - e6.sideOverflow, 0) + "px", textOverflow: (t6.options?.style || {}).textOverflow || "ellipsis" }), t6.shortened = true), t6.attr(e6.attribs), t6[t6.moved ? "animate" : "attr"](e6.posAttribs), t6.moved = true) : t6 && t6.attr({ y: -9999 });
                }), delete t5.distributeBox;
              }, this);
            }
            function m3(t5) {
              let e6 = this.center, i7 = this.options, s5 = i7.center, o6 = i7.minSize || 80, r5 = o6, n5 = null !== i7.size;
              return !n5 && (null !== s5[0] ? r5 = Math.max(e6[2] - Math.max(t5[1], t5[3]), o6) : (r5 = Math.max(e6[2] - t5[1] - t5[3], o6), e6[0] += (t5[3] - t5[1]) / 2), null !== s5[1] ? r5 = c3(r5, o6, e6[2] - Math.max(t5[0], t5[2])) : (r5 = c3(r5, o6, e6[2] - t5[0] - t5[2]), e6[1] += (t5[0] - t5[2]) / 2), r5 < e6[2] ? (e6[2] = r5, e6[3] = Math.min(i7.thickness ? Math.max(0, r5 - 2 * i7.thickness) : Math.max(0, f3(i7.innerSize || 0, r5)), r5), this.translate(e6), this.drawDataLabels && this.drawDataLabels()) : n5 = true), n5;
            }
            e5.compose = function e6(h4) {
              if (t4.compose(l3), g3(n4, e6)) {
                let t5 = h4.prototype;
                t5.dataLabelPositioners = i6, t5.alignDataLabel = a4, t5.drawDataLabels = o5, t5.getDataLabelPosition = s4, t5.placeDataLabels = r4, t5.verifyDataLabelOverflow = m3;
              }
            };
          }(r3 || (r3 = {})), r3;
        }), i4(e3, "Extensions/OverlappingDataLabels.js", [e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          let { composed: i5 } = t4, { addEvent: s3, fireEvent: o4, isNumber: r3, objectEach: n4, pick: a4, pushUnique: h3 } = e4;
          function l3(t5) {
            let e5 = t5.length, i6 = this.renderer, s4 = (t6, e6) => !(e6.x >= t6.x + t6.width || e6.x + e6.width <= t6.x || e6.y >= t6.y + t6.height || e6.y + e6.height <= t6.y), n5 = (t6) => {
              let e6 = t6.box ? 0 : t6.padding || 0, s5, o5, n6, a6 = 0, h5 = 0, l5, d4;
              if (t6 && (!t6.alignAttr || t6.placed))
                return s5 = t6.alignAttr || { x: t6.attr("x"), y: t6.attr("y") }, o5 = t6.parentGroup, t6.width || (n6 = t6.getBBox(), t6.width = n6.width, t6.height = n6.height, a6 = i6.fontMetrics(t6.element).h), l5 = t6.width - 2 * e6, (d4 = { left: "0", center: "0.5", right: "1" }[t6.alignValue]) ? h5 = +d4 * l5 : r3(t6.x) && Math.round(t6.x) !== t6.translateX && (h5 = t6.x - (t6.translateX || 0)), { x: s5.x + (o5.translateX || 0) + e6 - (h5 || 0), y: s5.y + (o5.translateY || 0) + e6 - a6, width: t6.width - 2 * e6, height: (t6.height || 0) - 2 * e6 };
            }, a5, h4, l4, c4, p3, u4 = false;
            for (let i7 = 0; i7 < e5; i7++)
              (a5 = t5[i7]) && (a5.oldOpacity = a5.opacity, a5.newOpacity = 1, a5.absoluteBox = n5(a5));
            t5.sort((t6, e6) => (e6.labelrank || 0) - (t6.labelrank || 0));
            for (let i7 = 0; i7 < e5; ++i7) {
              c4 = (h4 = t5[i7]) && h4.absoluteBox;
              for (let o5 = i7 + 1; o5 < e5; ++o5)
                p3 = (l4 = t5[o5]) && l4.absoluteBox, c4 && p3 && h4 !== l4 && 0 !== h4.newOpacity && 0 !== l4.newOpacity && "hidden" !== h4.visibility && "hidden" !== l4.visibility && s4(c4, p3) && ((h4.labelrank < l4.labelrank ? h4 : l4).newOpacity = 0);
            }
            for (let e6 of t5)
              d3(e6, this) && (u4 = true);
            u4 && o4(this, "afterHideAllOverlappingLabels");
          }
          function d3(t5, e5) {
            let i6, s4 = false;
            return t5 && (i6 = t5.newOpacity, t5.oldOpacity !== i6 && (t5.hasClass("highcharts-data-label") ? (t5[i6 ? "removeClass" : "addClass"]("highcharts-data-label-hidden"), s4 = true, t5[t5.isOld ? "animate" : "attr"]({ opacity: i6 }, void 0, function() {
              e5.styledMode || t5.css({ pointerEvents: i6 ? "auto" : "none" });
            }), o4(e5, "afterHideOverlappingLabel")) : t5.attr({ opacity: i6 })), t5.isOld = true), s4;
          }
          function c3() {
            let t5 = this, e5 = [];
            for (let i6 of t5.labelCollectors || [])
              e5 = e5.concat(i6());
            for (let i6 of t5.yAxis || [])
              i6.stacking && i6.options.stackLabels && !i6.options.stackLabels.allowOverlap && n4(i6.stacking.stacks, (t6) => {
                n4(t6, (t7) => {
                  t7.label && e5.push(t7.label);
                });
              });
            for (let i6 of t5.series || [])
              if (i6.visible && i6.hasDataLabels?.()) {
                let s4 = (i7) => {
                  for (let s5 of i7)
                    s5.visible && (s5.dataLabels || []).forEach((i8) => {
                      let o5 = i8.options || {};
                      i8.labelrank = a4(o5.labelrank, s5.labelrank, s5.shapeArgs?.height), o5.allowOverlap ?? Number(o5.distance) > 0 ? (i8.oldOpacity = i8.opacity, i8.newOpacity = 1, d3(i8, t5)) : e5.push(i8);
                    });
                };
                s4(i6.nodes || []), s4(i6.points);
              }
            this.hideOverlappingLabels(e5);
          }
          return { compose: function t5(e5) {
            if (h3(i5, t5)) {
              let t6 = e5.prototype;
              t6.hideOverlappingLabels = l3, s3(e5, "render", c3);
            }
          } };
        }), i4(e3, "Extensions/BorderRadius.js", [e3["Core/Defaults.js"], e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4, i5) {
          let { defaultOptions: s3 } = t4, { composed: o4, noop: r3 } = e4, { addEvent: n4, extend: a4, isObject: h3, merge: l3, pushUnique: d3, relativeLength: c3 } = i5, p3 = { radius: 0, scope: "stack", where: void 0 }, u4 = r3, g3 = r3;
          function f3(t5, e5, i6, s4, o5 = {}) {
            let r4 = u4(t5, e5, i6, s4, o5), { innerR: n5 = 0, r: a5 = i6, start: h4 = 0, end: l4 = 0 } = o5;
            if (o5.open || !o5.borderRadius)
              return r4;
            let d4 = l4 - h4, p4 = Math.sin(d4 / 2), g4 = Math.max(Math.min(c3(o5.borderRadius || 0, a5 - n5), (a5 - n5) / 2, a5 * p4 / (1 + p4)), 0), f4 = Math.min(g4, 2 * (d4 / Math.PI) * n5), m4 = r4.length - 1;
            for (; m4--; )
              !function(t6, e6, i7) {
                let s5, o6, r5;
                let n6 = t6[e6], a6 = t6[e6 + 1];
                if ("Z" === a6[0] && (a6 = t6[0]), ("M" === n6[0] || "L" === n6[0]) && "A" === a6[0] ? (s5 = n6, o6 = a6, r5 = true) : "A" === n6[0] && ("M" === a6[0] || "L" === a6[0]) && (s5 = a6, o6 = n6), s5 && o6 && o6.params) {
                  let n7 = o6[1], a7 = o6[5], h5 = o6.params, { start: l5, end: d5, cx: c4, cy: p5 } = h5, u5 = a7 ? n7 - i7 : n7 + i7, g5 = u5 ? Math.asin(i7 / u5) : 0, f5 = a7 ? g5 : -g5, m5 = Math.cos(g5) * u5;
                  r5 ? (h5.start = l5 + f5, s5[1] = c4 + m5 * Math.cos(l5), s5[2] = p5 + m5 * Math.sin(l5), t6.splice(e6 + 1, 0, ["A", i7, i7, 0, 0, 1, c4 + n7 * Math.cos(h5.start), p5 + n7 * Math.sin(h5.start)])) : (h5.end = d5 - f5, o6[6] = c4 + n7 * Math.cos(h5.end), o6[7] = p5 + n7 * Math.sin(h5.end), t6.splice(e6 + 1, 0, ["A", i7, i7, 0, 0, 1, c4 + m5 * Math.cos(d5), p5 + m5 * Math.sin(d5)])), o6[4] = Math.abs(h5.end - h5.start) < Math.PI ? 0 : 1;
                }
              }(r4, m4, m4 > 1 ? f4 : g4);
            return r4;
          }
          function m3() {
            if (this.options.borderRadius && !(this.chart.is3d && this.chart.is3d())) {
              let { options: t5, yAxis: e5 } = this, i6 = "percent" === t5.stacking, o5 = s3.plotOptions?.[this.type]?.borderRadius, r4 = x3(t5.borderRadius, h3(o5) ? o5 : {}), n5 = e5.options.reversed;
              for (let s4 of this.points) {
                let { shapeArgs: o6 } = s4;
                if ("roundedRect" === s4.shapeType && o6) {
                  let { width: h4 = 0, height: l4 = 0, y: d4 = 0 } = o6, p4 = d4, u5 = l4;
                  if ("stack" === r4.scope && s4.stackTotal) {
                    let o7 = e5.translate(i6 ? 100 : s4.stackTotal, false, true, false, true), r5 = e5.translate(t5.threshold || 0, false, true, false, true), n6 = this.crispCol(0, Math.min(o7, r5), 0, Math.abs(o7 - r5));
                    p4 = n6.y, u5 = n6.height;
                  }
                  let g4 = (s4.negative ? -1 : 1) * (n5 ? -1 : 1) == -1, f4 = r4.where;
                  !f4 && this.is("waterfall") && Math.abs((s4.yBottom || 0) - (this.translatedThreshold || 0)) > this.borderWidth && (f4 = "all"), f4 || (f4 = "end");
                  let m4 = Math.min(c3(r4.radius, h4), h4 / 2, "all" === f4 ? l4 / 2 : 1 / 0) || 0;
                  "end" === f4 && (g4 && (p4 -= m4), u5 += m4), a4(o6, { brBoxHeight: u5, brBoxY: p4, r: m4 });
                }
              }
            }
          }
          function x3(t5, e5) {
            return h3(t5) || (t5 = { radius: t5 || 0 }), l3(p3, e5, t5);
          }
          function y3() {
            let t5 = x3(this.options.borderRadius);
            for (let e5 of this.points) {
              let i6 = e5.shapeArgs;
              i6 && (i6.borderRadius = c3(t5.radius, (i6.r || 0) - (i6.innerR || 0)));
            }
          }
          function b3(t5, e5, i6, s4, o5 = {}) {
            let r4 = g3(t5, e5, i6, s4, o5), { r: n5 = 0, brBoxHeight: a5 = s4, brBoxY: h4 = e5 } = o5, l4 = e5 - h4, d4 = h4 + a5 - (e5 + s4), c4 = l4 - n5 > -0.1 ? 0 : n5, p4 = d4 - n5 > -0.1 ? 0 : n5, u5 = Math.max(c4 && l4, 0), f4 = Math.max(p4 && d4, 0), m4 = [t5 + c4, e5], x4 = [t5 + i6 - c4, e5], y4 = [t5 + i6, e5 + c4], b4 = [t5 + i6, e5 + s4 - p4], v3 = [t5 + i6 - p4, e5 + s4], S3 = [t5 + p4, e5 + s4], k3 = [t5, e5 + s4 - p4], M2 = [t5, e5 + c4], C3 = (t6, e6) => Math.sqrt(Math.pow(t6, 2) - Math.pow(e6, 2));
            if (u5) {
              let t6 = C3(c4, c4 - u5);
              m4[0] -= t6, x4[0] += t6, y4[1] = M2[1] = e5 + c4 - u5;
            }
            if (s4 < c4 - u5) {
              let o6 = C3(c4, c4 - u5 - s4);
              y4[0] = b4[0] = t5 + i6 - c4 + o6, v3[0] = Math.min(y4[0], v3[0]), S3[0] = Math.max(b4[0], S3[0]), k3[0] = M2[0] = t5 + c4 - o6, y4[1] = M2[1] = e5 + s4;
            }
            if (f4) {
              let t6 = C3(p4, p4 - f4);
              v3[0] += t6, S3[0] -= t6, b4[1] = k3[1] = e5 + s4 - p4 + f4;
            }
            if (s4 < p4 - f4) {
              let o6 = C3(p4, p4 - f4 - s4);
              y4[0] = b4[0] = t5 + i6 - p4 + o6, x4[0] = Math.min(y4[0], x4[0]), m4[0] = Math.max(b4[0], m4[0]), k3[0] = M2[0] = t5 + p4 - o6, b4[1] = k3[1] = e5;
            }
            return r4.length = 0, r4.push(["M", ...m4], ["L", ...x4], ["A", c4, c4, 0, 0, 1, ...y4], ["L", ...b4], ["A", p4, p4, 0, 0, 1, ...v3], ["L", ...S3], ["A", p4, p4, 0, 0, 1, ...k3], ["L", ...M2], ["A", c4, c4, 0, 0, 1, ...m4], ["Z"]), r4;
          }
          return { compose: function t5(e5, i6, s4, r4) {
            if (d3(o4, t5)) {
              let t6 = r4.prototype.symbols;
              n4(e5, "afterColumnTranslate", m3, { order: 9 }), n4(i6, "afterTranslate", y3), s4.symbolCustomAttribs.push("borderRadius", "brBoxHeight", "brBoxY"), u4 = t6.arc, g3 = t6.roundedRect, t6.arc = f3, t6.roundedRect = b3;
            }
          }, optionsToObject: x3 };
        }), i4(e3, "Core/Responsive.js", [e3["Core/Globals.js"], e3["Core/Utilities.js"]], function(t4, e4) {
          var i5;
          let { composed: s3 } = t4, { diffObjects: o4, extend: r3, find: n4, merge: a4, pick: h3, pushUnique: l3, uniqueKey: d3 } = e4;
          return function(t5) {
            function e5(t6, e6) {
              let i7 = t6.condition, s4 = i7.callback || function() {
                return this.chartWidth <= h3(i7.maxWidth, Number.MAX_VALUE) && this.chartHeight <= h3(i7.maxHeight, Number.MAX_VALUE) && this.chartWidth >= h3(i7.minWidth, 0) && this.chartHeight >= h3(i7.minHeight, 0);
              };
              s4.call(this) && e6.push(t6._id);
            }
            function i6(t6, e6) {
              let i7 = this.options.responsive, s4 = this.currentResponsive, r4 = [], h4;
              !e6 && i7 && i7.rules && i7.rules.forEach((t7) => {
                void 0 === t7._id && (t7._id = d3()), this.matchResponsiveRule(t7, r4);
              }, this);
              let l4 = a4(...r4.map((t7) => n4((i7 || {}).rules || [], (e7) => e7._id === t7)).map((t7) => t7 && t7.chartOptions));
              l4.isResponsiveOptions = true, r4 = r4.toString() || void 0;
              let c3 = s4 && s4.ruleIds;
              r4 !== c3 && (s4 && this.update(s4.undoOptions, t6, true), r4 ? ((h4 = o4(l4, this.options, true, this.collectionsWithUpdate)).isResponsiveOptions = true, this.currentResponsive = { ruleIds: r4, mergedOptions: l4, undoOptions: h4 }, this.update(l4, t6, true)) : this.currentResponsive = void 0);
            }
            t5.compose = function t6(o5) {
              return l3(s3, t6) && r3(o5.prototype, { matchResponsiveRule: e5, setResponsive: i6 }), o5;
            };
          }(i5 || (i5 = {})), i5;
        }), i4(e3, "masters/highcharts.src.js", [e3["Core/Globals.js"], e3["Core/Utilities.js"], e3["Core/Defaults.js"], e3["Core/Animation/Fx.js"], e3["Core/Animation/AnimationUtilities.js"], e3["Core/Renderer/HTML/AST.js"], e3["Core/Templating.js"], e3["Core/Renderer/RendererUtilities.js"], e3["Core/Renderer/SVG/SVGElement.js"], e3["Core/Renderer/SVG/SVGRenderer.js"], e3["Core/Renderer/HTML/HTMLElement.js"], e3["Core/Renderer/HTML/HTMLRenderer.js"], e3["Core/Axis/Axis.js"], e3["Core/Axis/DateTimeAxis.js"], e3["Core/Axis/LogarithmicAxis.js"], e3["Core/Axis/PlotLineOrBand/PlotLineOrBand.js"], e3["Core/Axis/Tick.js"], e3["Core/Tooltip.js"], e3["Core/Series/Point.js"], e3["Core/Pointer.js"], e3["Core/Legend/Legend.js"], e3["Core/Chart/Chart.js"], e3["Extensions/ScrollablePlotArea.js"], e3["Core/Axis/Stacking/StackingAxis.js"], e3["Core/Axis/Stacking/StackItem.js"], e3["Core/Series/Series.js"], e3["Core/Series/SeriesRegistry.js"], e3["Series/Column/ColumnSeries.js"], e3["Series/Column/ColumnDataLabel.js"], e3["Series/Pie/PieSeries.js"], e3["Series/Pie/PieDataLabel.js"], e3["Core/Series/DataLabel.js"], e3["Extensions/OverlappingDataLabels.js"], e3["Extensions/BorderRadius.js"], e3["Core/Responsive.js"], e3["Core/Color/Color.js"], e3["Core/Time.js"]], function(t4, e4, i5, s3, o4, r3, n4, a4, h3, l3, d3, c3, p3, u4, g3, f3, m3, x3, y3, b3, v3, S3, k3, M2, C3, w3, T2, A2, P2, L2, O2, D2, E, j2, I2, B, R) {
          return t4.animate = o4.animate, t4.animObject = o4.animObject, t4.getDeferredAnimation = o4.getDeferredAnimation, t4.setAnimation = o4.setAnimation, t4.stop = o4.stop, t4.timers = s3.timers, t4.AST = r3, t4.Axis = p3, t4.Chart = S3, t4.chart = S3.chart, t4.Fx = s3, t4.Legend = v3, t4.PlotLineOrBand = f3, t4.Point = y3, t4.Pointer = b3, t4.Series = w3, t4.StackItem = C3, t4.SVGElement = h3, t4.SVGRenderer = l3, t4.Templating = n4, t4.Tick = m3, t4.Time = R, t4.Tooltip = x3, t4.Color = B, t4.color = B.parse, c3.compose(l3), d3.compose(h3), b3.compose(S3), v3.compose(S3), t4.defaultOptions = i5.defaultOptions, t4.getOptions = i5.getOptions, t4.time = i5.defaultTime, t4.setOptions = i5.setOptions, t4.dateFormat = n4.dateFormat, t4.format = n4.format, t4.numberFormat = n4.numberFormat, e4.extend(t4, e4), t4.distribute = a4.distribute, t4.seriesType = T2.seriesType, P2.compose(A2), j2.compose(w3, L2, h3, l3), D2.compose(w3), u4.compose(p3), g3.compose(p3), E.compose(S3), O2.compose(L2), f3.compose(p3), I2.compose(S3), k3.compose(p3, S3, w3), M2.compose(p3, S3, w3), x3.compose(b3), t4;
        }), e3["masters/highcharts.src.js"]._modules = e3, e3["masters/highcharts.src.js"];
      });
    }
  });

  // node_modules/highcharts/modules/variwide.js
  var require_variwide = __commonJS({
    "node_modules/highcharts/modules/variwide.js"(exports, module) {
      !function(t3) {
        "object" == typeof module && module.exports ? (t3.default = t3, module.exports = t3) : "function" == typeof define && define.amd ? define("highcharts/modules/variwide", ["highcharts"], function(i4) {
          return t3(i4), t3.Highcharts = i4, t3;
        }) : t3("undefined" != typeof Highcharts ? Highcharts : void 0);
      }(function(t3) {
        "use strict";
        var i4 = t3 ? t3._modules : {};
        function s3(t4, i5, s4, e3) {
          t4.hasOwnProperty(i5) || (t4[i5] = e3.apply(null, s4), "function" == typeof CustomEvent && window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded", { detail: { path: i5, module: t4[i5] } })));
        }
        s3(i4, "Series/Variwide/VariwideComposition.js", [i4["Core/Globals.js"], i4["Core/Utilities.js"]], function(t4, i5) {
          let { composed: s4 } = t4, { addEvent: e3, pushUnique: r3, wrap: o4 } = i5;
          function a4(t5) {
            this.variwide && this.cross && this.cross.attr("stroke-width", t5.point && t5.point.crosshairWidth);
          }
          function n4() {
            let t5 = this;
            !this.horiz && this.variwide && this.chart.labelCollectors.push(function() {
              return t5.tickPositions.filter((i6) => !!t5.ticks[i6].label).map((i6, s5) => {
                let e4 = t5.ticks[i6].label;
                return e4.labelrank = t5.zData[s5], e4;
              });
            });
          }
          function h3(t5) {
            let i6 = this.axis, s5 = i6.horiz ? "x" : "y";
            i6.variwide && (this[s5 + "Orig"] = t5.pos[s5], this.postTranslate(t5.pos, s5, this.pos));
          }
          function l3(t5, i6, s5) {
            let e4 = this.axis, r4 = t5[i6] - e4.pos;
            e4.horiz || (r4 = e4.len - r4), r4 = e4.series[0].postTranslate(s5, r4), e4.horiz || (r4 = e4.len - r4), t5[i6] = e4.pos + r4;
          }
          function d3(t5, i6, s5, e4, r4, o5, a5, n5) {
            let h4 = Array.prototype.slice.call(arguments, 1), l4 = r4 ? "x" : "y";
            this.axis.variwide && "number" == typeof this[l4 + "Orig"] && (h4[r4 ? 0 : 1] = this[l4 + "Orig"]);
            let d4 = t5.apply(this, h4);
            return this.axis.variwide && this.axis.categories && this.postTranslate(d4, l4, this.pos), d4;
          }
          return { compose: function t5(i6, p3) {
            if (r3(s4, t5)) {
              let t6 = p3.prototype;
              e3(i6, "afterDrawCrosshair", a4), e3(i6, "afterRender", n4), e3(p3, "afterGetPosition", h3), t6.postTranslate = l3, o4(t6, "getLabelPosition", d3);
            }
          } };
        }), s3(i4, "Series/Variwide/VariwidePoint.js", [i4["Core/Series/SeriesRegistry.js"], i4["Core/Utilities.js"]], function(t4, i5) {
          let { column: { prototype: { pointClass: s4 } } } = t4.seriesTypes, { isNumber: e3 } = i5;
          return class extends s4 {
            isValid() {
              return e3(this.y) && e3(this.z);
            }
          };
        }), s3(i4, "Series/Variwide/VariwideSeriesDefaults.js", [], function() {
          return { pointPadding: 0, groupPadding: 0 };
        }), s3(i4, "Series/Variwide/VariwideSeries.js", [i4["Core/Series/SeriesRegistry.js"], i4["Series/Variwide/VariwideComposition.js"], i4["Series/Variwide/VariwidePoint.js"], i4["Series/Variwide/VariwideSeriesDefaults.js"], i4["Core/Utilities.js"]], function(t4, i5, s4, e3, r3) {
          let { column: o4 } = t4.seriesTypes, { addEvent: a4, extend: n4, merge: h3, pick: l3 } = r3;
          class d3 extends o4 {
            processData(i6) {
              this.totalZ = 0, this.relZ = [], t4.seriesTypes.column.prototype.processData.call(this, i6), (this.xAxis.reversed ? this.zData.slice().reverse() : this.zData).forEach(function(t5, i7) {
                this.relZ[i7] = this.totalZ, this.totalZ += t5;
              }, this), this.xAxis.categories && (this.xAxis.variwide = true, this.xAxis.zData = this.zData);
            }
            postTranslate(t5, i6, s5) {
              let e4 = this.xAxis, r4 = this.relZ, o5 = e4.reversed ? r4.length - t5 : t5, a5 = e4.reversed ? -1 : 1, n5 = e4.toPixels(e4.reversed ? (e4.dataMax || 0) + e4.pointRange : e4.dataMin || 0), h4 = e4.toPixels(e4.reversed ? e4.dataMin || 0 : (e4.dataMax || 0) + e4.pointRange), d4 = Math.abs(h4 - n5), p3 = this.totalZ, c3 = this.chart.inverted ? h4 - (this.chart.plotTop - a5 * e4.minPixelPadding) : n5 - this.chart.plotLeft - a5 * e4.minPixelPadding, u4 = o5 / r4.length * d4, f3 = (o5 + a5) / r4.length * d4, x3 = l3(r4[o5], p3) / p3 * d4, w3 = l3(r4[o5 + a5], p3) / p3 * d4;
              return s5 && (s5.crosshairWidth = w3 - x3), c3 + x3 + (i6 - (c3 + u4)) * (w3 - x3) / (f3 - u4);
            }
            translate() {
              this.crispOption = this.options.crisp, this.options.crisp = false, super.translate(), this.options.crisp = this.crispOption;
            }
            correctStackLabels() {
              let t5, i6, s5, e4;
              let r4 = this.options, o5 = this.yAxis;
              for (let a5 of this.points)
                e4 = a5.x, i6 = a5.shapeArgs.width, (s5 = o5.stacking.stacks[(this.negStacks && a5.y < (r4.startFromThreshold ? 0 : r4.threshold) ? "-" : "") + this.stackKey]) && (t5 = s5[e4]) && !a5.isNull && t5.setOffset(-(i6 / 2) || 0, i6 || 0, void 0, void 0, a5.plotX, this.xAxis);
            }
          }
          return d3.compose = i5.compose, d3.defaultOptions = h3(o4.defaultOptions, e3), a4(d3, "afterColumnTranslate", function() {
            let t5 = this.xAxis, i6 = this.chart.inverted, s5 = this.borderWidth % 2 / 2, e4 = -1;
            for (let r4 of this.points) {
              let o5, a5;
              ++e4;
              let n5 = r4.shapeArgs || {}, { x: h4 = 0, width: l4 = 0 } = n5, { plotX: d4 = 0, tooltipPos: p3, z: c3 = 0 } = r4;
              t5.variwide ? (o5 = this.postTranslate(e4, h4, r4), a5 = this.postTranslate(e4, h4 + l4)) : (o5 = d4, a5 = t5.translate(r4.x + c3, false, false, false, true)), this.crispOption && (o5 = Math.round(o5) - s5, a5 = Math.round(a5) - s5), n5.x = o5, n5.width = Math.max(a5 - o5, 1), r4.plotX = (o5 + a5) / 2, p3 && (i6 ? p3[1] = t5.len - n5.x - n5.width / 2 : p3[0] = n5.x + n5.width / 2);
            }
            this.options.stacking && this.correctStackLabels();
          }, { order: 2 }), n4(d3.prototype, { irregularWidths: true, pointArrayMap: ["y", "z"], parallelArrays: ["x", "y", "z"], pointClass: s4 }), t4.registerSeriesType("variwide", d3), d3;
        }), s3(i4, "masters/modules/variwide.src.js", [i4["Core/Globals.js"], i4["Series/Variwide/VariwideSeries.js"]], function(t4, i5) {
          i5.compose(t4.Axis, t4.Tick);
        });
      });
    }
  });

  // node_modules/highcharts/modules/exporting.js
  var require_exporting = __commonJS({
    "node_modules/highcharts/modules/exporting.js"(exports, module) {
      !function(e3) {
        "object" == typeof module && module.exports ? (e3.default = e3, module.exports = e3) : "function" == typeof define && define.amd ? define("highcharts/modules/exporting", ["highcharts"], function(t3) {
          return e3(t3), e3.Highcharts = t3, e3;
        }) : e3("undefined" != typeof Highcharts ? Highcharts : void 0);
      }(function(e3) {
        "use strict";
        var t3 = e3 ? e3._modules : {};
        function n4(e4, t4, n5, i4) {
          e4.hasOwnProperty(t4) || (e4[t4] = i4.apply(null, n5), "function" == typeof CustomEvent && window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded", { detail: { path: t4, module: e4[t4] } })));
        }
        n4(t3, "Core/Chart/ChartNavigationComposition.js", [], function() {
          var e4;
          return function(e5) {
            e5.compose = function(e6) {
              return e6.navigation || (e6.navigation = new t4(e6)), e6;
            };
            class t4 {
              constructor(e6) {
                this.updates = [], this.chart = e6;
              }
              addUpdate(e6) {
                this.chart.navigation.updates.push(e6);
              }
              update(e6, t5) {
                this.updates.forEach((n5) => {
                  n5.call(this.chart, e6, t5);
                });
              }
            }
            e5.Additions = t4;
          }(e4 || (e4 = {})), e4;
        }), n4(t3, "Extensions/Exporting/ExportingDefaults.js", [t3["Core/Globals.js"]], function(e4) {
          let { isTouchDevice: t4 } = e4;
          return { exporting: { allowTableSorting: true, type: "image/png", url: "https://export.highcharts.com/", pdfFont: { normal: void 0, bold: void 0, bolditalic: void 0, italic: void 0 }, printMaxWidth: 780, scale: 2, buttons: { contextButton: { className: "highcharts-contextbutton", menuClassName: "highcharts-contextmenu", symbol: "menu", titleKey: "contextButtonTitle", menuItems: ["viewFullscreen", "printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG"] } }, menuItemDefinitions: { viewFullscreen: { textKey: "viewFullscreen", onclick: function() {
            this.fullscreen && this.fullscreen.toggle();
          } }, printChart: { textKey: "printChart", onclick: function() {
            this.print();
          } }, separator: { separator: true }, downloadPNG: { textKey: "downloadPNG", onclick: function() {
            this.exportChart();
          } }, downloadJPEG: { textKey: "downloadJPEG", onclick: function() {
            this.exportChart({ type: "image/jpeg" });
          } }, downloadPDF: { textKey: "downloadPDF", onclick: function() {
            this.exportChart({ type: "application/pdf" });
          } }, downloadSVG: { textKey: "downloadSVG", onclick: function() {
            this.exportChart({ type: "image/svg+xml" });
          } } } }, lang: { viewFullscreen: "View in full screen", exitFullscreen: "Exit from full screen", printChart: "Print chart", downloadPNG: "Download PNG image", downloadJPEG: "Download JPEG image", downloadPDF: "Download PDF document", downloadSVG: "Download SVG vector image", contextButtonTitle: "Chart context menu" }, navigation: { buttonOptions: { symbolSize: 14, symbolX: 14.5, symbolY: 13.5, align: "right", buttonSpacing: 3, height: 28, verticalAlign: "top", width: 28, symbolFill: "#666666", symbolStroke: "#666666", symbolStrokeWidth: 3, theme: { padding: 5 } }, menuStyle: { border: "none", borderRadius: "3px", background: "#ffffff", padding: "0.5em" }, menuItemStyle: { background: "none", borderRadius: "3px", color: "#333333", padding: "0.5em", fontSize: t4 ? "0.9em" : "0.8em", transition: "background 250ms, color 250ms" }, menuItemHoverStyle: { background: "#f2f2f2" } } };
        }), n4(t3, "Extensions/Exporting/ExportingSymbols.js", [], function() {
          var e4;
          return function(e5) {
            let t4 = [];
            function n5(e6, t5, n6, i5) {
              return [["M", e6, t5 + 2.5], ["L", e6 + n6, t5 + 2.5], ["M", e6, t5 + i5 / 2 + 0.5], ["L", e6 + n6, t5 + i5 / 2 + 0.5], ["M", e6, t5 + i5 - 1.5], ["L", e6 + n6, t5 + i5 - 1.5]];
            }
            function i4(e6, t5, n6, i5) {
              let o4 = i5 / 3 - 2;
              return [].concat(this.circle(n6 - o4, t5, o4, o4), this.circle(n6 - o4, t5 + o4 + 4, o4, o4), this.circle(n6 - o4, t5 + 2 * (o4 + 4), o4, o4));
            }
            e5.compose = function(e6) {
              if (-1 === t4.indexOf(e6)) {
                t4.push(e6);
                let o4 = e6.prototype.symbols;
                o4.menu = n5, o4.menuball = i4.bind(o4);
              }
            };
          }(e4 || (e4 = {})), e4;
        }), n4(t3, "Extensions/Exporting/Fullscreen.js", [t3["Core/Renderer/HTML/AST.js"], t3["Core/Globals.js"], t3["Core/Utilities.js"]], function(e4, t4, n5) {
          let { composed: i4 } = t4, { addEvent: o4, fireEvent: r3, pushUnique: s3 } = n5;
          function l3() {
            this.fullscreen = new a4(this);
          }
          class a4 {
            static compose(e5) {
              s3(i4, this.compose) && o4(e5, "beforeRender", l3);
            }
            constructor(e5) {
              this.chart = e5, this.isOpen = false;
              let t5 = e5.renderTo;
              !this.browserProps && ("function" == typeof t5.requestFullscreen ? this.browserProps = { fullscreenChange: "fullscreenchange", requestFullscreen: "requestFullscreen", exitFullscreen: "exitFullscreen" } : t5.mozRequestFullScreen ? this.browserProps = { fullscreenChange: "mozfullscreenchange", requestFullscreen: "mozRequestFullScreen", exitFullscreen: "mozCancelFullScreen" } : t5.webkitRequestFullScreen ? this.browserProps = { fullscreenChange: "webkitfullscreenchange", requestFullscreen: "webkitRequestFullScreen", exitFullscreen: "webkitExitFullscreen" } : t5.msRequestFullscreen && (this.browserProps = { fullscreenChange: "MSFullscreenChange", requestFullscreen: "msRequestFullscreen", exitFullscreen: "msExitFullscreen" }));
            }
            close() {
              let e5 = this, t5 = e5.chart, n6 = t5.options.chart;
              r3(t5, "fullscreenClose", null, function() {
                e5.isOpen && e5.browserProps && t5.container.ownerDocument instanceof Document && t5.container.ownerDocument[e5.browserProps.exitFullscreen](), e5.unbindFullscreenEvent && (e5.unbindFullscreenEvent = e5.unbindFullscreenEvent()), t5.setSize(e5.origWidth, e5.origHeight, false), e5.origWidth = void 0, e5.origHeight = void 0, n6.width = e5.origWidthOption, n6.height = e5.origHeightOption, e5.origWidthOption = void 0, e5.origHeightOption = void 0, e5.isOpen = false, e5.setButtonText();
              });
            }
            open() {
              let e5 = this, t5 = e5.chart, n6 = t5.options.chart;
              r3(t5, "fullscreenOpen", null, function() {
                if (n6 && (e5.origWidthOption = n6.width, e5.origHeightOption = n6.height), e5.origWidth = t5.chartWidth, e5.origHeight = t5.chartHeight, e5.browserProps) {
                  let n7 = o4(t5.container.ownerDocument, e5.browserProps.fullscreenChange, function() {
                    e5.isOpen ? (e5.isOpen = false, e5.close()) : (t5.setSize(null, null, false), e5.isOpen = true, e5.setButtonText());
                  }), i5 = o4(t5, "destroy", n7);
                  e5.unbindFullscreenEvent = () => {
                    n7(), i5();
                  };
                  let r4 = t5.renderTo[e5.browserProps.requestFullscreen]();
                  r4 && r4.catch(function() {
                    alert("Full screen is not supported inside a frame.");
                  });
                }
              });
            }
            setButtonText() {
              let t5 = this.chart, n6 = t5.exportDivElements, i5 = t5.options.exporting, o5 = i5 && i5.buttons && i5.buttons.contextButton.menuItems, r4 = t5.options.lang;
              if (i5 && i5.menuItemDefinitions && r4 && r4.exitFullscreen && r4.viewFullscreen && o5 && n6) {
                let t6 = n6[o5.indexOf("viewFullscreen")];
                t6 && e4.setElementHTML(t6, this.isOpen ? r4.exitFullscreen : i5.menuItemDefinitions.viewFullscreen.text || r4.viewFullscreen);
              }
            }
            toggle() {
              this.isOpen ? this.close() : this.open();
            }
          }
          return a4;
        }), n4(t3, "Core/HttpUtilities.js", [t3["Core/Globals.js"], t3["Core/Utilities.js"]], function(e4, t4) {
          let { doc: n5, win: i4 } = e4, { createElement: o4, discardElement: r3, merge: s3, objectEach: l3 } = t4, a4 = { ajax: function(e5) {
            let t5 = { json: "application/json", xml: "application/xml", text: "text/plain", octet: "application/octet-stream" }, n6 = new XMLHttpRequest();
            function i5(t6, n7) {
              e5.error && e5.error(t6, n7);
            }
            if (!e5.url)
              return false;
            n6.open((e5.type || "get").toUpperCase(), e5.url, true), e5.headers && e5.headers["Content-Type"] || n6.setRequestHeader("Content-Type", t5[e5.dataType || "json"] || t5.text), l3(e5.headers, function(e6, t6) {
              n6.setRequestHeader(t6, e6);
            }), e5.responseType && (n6.responseType = e5.responseType), n6.onreadystatechange = function() {
              let t6;
              if (4 === n6.readyState) {
                if (200 === n6.status) {
                  if ("blob" !== e5.responseType && (t6 = n6.responseText, "json" === e5.dataType))
                    try {
                      t6 = JSON.parse(t6);
                    } catch (e6) {
                      if (e6 instanceof Error)
                        return i5(n6, e6);
                    }
                  return e5.success && e5.success(t6, n6);
                }
                i5(n6, n6.responseText);
              }
            }, e5.data && "string" != typeof e5.data && (e5.data = JSON.stringify(e5.data)), n6.send(e5.data);
          }, getJSON: function(e5, t5) {
            a4.ajax({ url: e5, success: t5, dataType: "json", headers: { "Content-Type": "text/plain" } });
          }, post: function(e5, t5, n6) {
            let o5 = new i4.FormData();
            l3(t5, function(e6, t6) {
              o5.append(t6, e6);
            }), o5.append("b64", "true");
            let { filename: s4, type: a5 } = t5;
            return i4.fetch(e5, { method: "POST", body: o5, ...n6 }).then((e6) => {
              e6.ok && e6.text().then((e7) => {
                let t6 = document.createElement("a");
                t6.href = `data:${a5};base64,${e7}`, t6.download = s4, t6.click(), r3(t6);
              });
            });
          } };
          return a4;
        }), n4(t3, "Extensions/Exporting/Exporting.js", [t3["Core/Renderer/HTML/AST.js"], t3["Core/Chart/Chart.js"], t3["Core/Chart/ChartNavigationComposition.js"], t3["Core/Defaults.js"], t3["Extensions/Exporting/ExportingDefaults.js"], t3["Extensions/Exporting/ExportingSymbols.js"], t3["Extensions/Exporting/Fullscreen.js"], t3["Core/Globals.js"], t3["Core/HttpUtilities.js"], t3["Core/Utilities.js"]], function(e4, t4, n5, i4, o4, r3, s3, l3, a4, c3) {
          var p3;
          let { defaultOptions: u4, setOptions: h3 } = i4, { composed: d3, doc: g3, SVG_NS: f3, win: m3 } = l3, { addEvent: x3, css: y3, createElement: b3, discardElement: v3, extend: w3, find: E, fireEvent: C3, isObject: S3, merge: T2, objectEach: F, pick: O2, pushUnique: k3, removeEvent: M2, uniqueKey: P2 } = c3;
          return function(t5) {
            let i5;
            let p4 = [/-/, /^(clipPath|cssText|d|height|width)$/, /^font$/, /[lL]ogical(Width|Height)$/, /^parentRule$/, /^(cssRules|ownerRules)$/, /perspective/, /TapHighlightColor/, /^transition/, /^length$/, /^[0-9]+$/], h4 = ["fill", "stroke", "strokeLinecap", "strokeLinejoin", "strokeWidth", "textAnchor", "x", "y"];
            t5.inlineAllowlist = [];
            let N2 = ["clipPath", "defs", "desc"];
            function j2(e5) {
              let t6, n6;
              let i6 = this, o5 = i6.renderer, r4 = T2(i6.options.navigation.buttonOptions, e5), s4 = r4.onclick, l4 = r4.menuItems, a5 = r4.symbolSize || 12;
              if (i6.btnCount || (i6.btnCount = 0), i6.exportDivElements || (i6.exportDivElements = [], i6.exportSVGElements = []), false === r4.enabled || !r4.theme)
                return;
              let c4 = r4.theme;
              i6.styledMode || (c4.fill = O2(c4.fill, "#ffffff"), c4.stroke = O2(c4.stroke, "none")), s4 ? n6 = function(e6) {
                e6 && e6.stopPropagation(), s4.call(i6, e6);
              } : l4 && (n6 = function(e6) {
                e6 && e6.stopPropagation(), i6.contextMenu(p5.menuClassName, l4, p5.translateX || 0, p5.translateY || 0, p5.width || 0, p5.height || 0, p5), p5.setState(2);
              }), r4.text && r4.symbol ? c4.paddingLeft = O2(c4.paddingLeft, 30) : r4.text || w3(c4, { width: r4.width, height: r4.height, padding: 0 }), i6.styledMode || (c4["stroke-linecap"] = "round", c4.fill = O2(c4.fill, "#ffffff"), c4.stroke = O2(c4.stroke, "none"));
              let p5 = o5.button(r4.text, 0, 0, n6, c4, void 0, void 0, void 0, void 0, r4.useHTML).addClass(e5.className).attr({ title: O2(i6.options.lang[r4._titleKey || r4.titleKey], "") });
              p5.menuClassName = e5.menuClassName || "highcharts-menu-" + i6.btnCount++, r4.symbol && (t6 = o5.symbol(r4.symbol, r4.symbolX - a5 / 2, r4.symbolY - a5 / 2, a5, a5, { width: a5, height: a5 }).addClass("highcharts-button-symbol").attr({ zIndex: 1 }).add(p5), i6.styledMode || t6.attr({ stroke: r4.symbolStroke, fill: r4.symbolFill, "stroke-width": r4.symbolStrokeWidth || 1 })), p5.add(i6.exportingGroup).align(w3(r4, { width: p5.width, x: O2(r4.x, i6.buttonOffset) }), true, "spacingBox"), i6.buttonOffset += ((p5.width || 0) + r4.buttonSpacing) * ("right" === r4.align ? -1 : 1), i6.exportSVGElements.push(p5, t6);
            }
            function H() {
              if (!this.printReverseInfo)
                return;
              let { childNodes: e5, origDisplay: t6, resetParams: n6 } = this.printReverseInfo;
              this.moveContainers(this.renderTo), [].forEach.call(e5, function(e6, n7) {
                1 === e6.nodeType && (e6.style.display = t6[n7] || "");
              }), this.isPrinting = false, n6 && this.setSize.apply(this, n6), delete this.printReverseInfo, i5 = void 0, C3(this, "afterPrint");
            }
            function D2() {
              let e5 = g3.body, t6 = this.options.exporting.printMaxWidth, n6 = { childNodes: e5.childNodes, origDisplay: [], resetParams: void 0 };
              this.isPrinting = true, this.pointer.reset(null, 0), C3(this, "beforePrint");
              let i6 = t6 && this.chartWidth > t6;
              i6 && (n6.resetParams = [this.options.chart.width, void 0, false], this.setSize(t6, void 0, false)), [].forEach.call(n6.childNodes, function(e6, t7) {
                1 === e6.nodeType && (n6.origDisplay[t7] = e6.style.display, e6.style.display = "none");
              }), this.moveContainers(e5), this.printReverseInfo = n6;
            }
            function G(e5) {
              e5.renderExporting(), x3(e5, "redraw", e5.renderExporting), x3(e5, "destroy", e5.destroyExport);
            }
            function W(t6, n6, i6, o5, r4, s4, l4) {
              let a5 = this, p5 = a5.options.navigation, u5 = a5.chartWidth, h5 = a5.chartHeight, d4 = "cache-" + t6, f4 = Math.max(r4, s4), v4, E2 = a5[d4];
              E2 || (a5.exportContextMenu = a5[d4] = E2 = b3("div", { className: t6 }, { position: "absolute", zIndex: 1e3, padding: f4 + "px", pointerEvents: "auto", ...a5.renderer.style }, a5.fixedDiv || a5.container), v4 = b3("ul", { className: "highcharts-menu" }, a5.styledMode ? {} : { listStyle: "none", margin: 0, padding: 0 }, E2), a5.styledMode || y3(v4, w3({ MozBoxShadow: "3px 3px 10px #888", WebkitBoxShadow: "3px 3px 10px #888", boxShadow: "3px 3px 10px #888" }, p5.menuStyle)), E2.hideMenu = function() {
                y3(E2, { display: "none" }), l4 && l4.setState(0), a5.openMenu = false, y3(a5.renderTo, { overflow: "hidden" }), y3(a5.container, { overflow: "hidden" }), c3.clearTimeout(E2.hideTimer), C3(a5, "exportMenuHidden");
              }, a5.exportEvents.push(x3(E2, "mouseleave", function() {
                E2.hideTimer = m3.setTimeout(E2.hideMenu, 500);
              }), x3(E2, "mouseenter", function() {
                c3.clearTimeout(E2.hideTimer);
              }), x3(g3, "mouseup", function(e5) {
                a5.pointer.inClass(e5.target, t6) || E2.hideMenu();
              }), x3(E2, "click", function() {
                a5.openMenu && E2.hideMenu();
              })), n6.forEach(function(t7) {
                if ("string" == typeof t7 && (t7 = a5.options.exporting.menuItemDefinitions[t7]), S3(t7, true)) {
                  let n7;
                  t7.separator ? n7 = b3("hr", void 0, void 0, v4) : ("viewData" === t7.textKey && a5.isDataTableVisible && (t7.textKey = "hideData"), n7 = b3("li", { className: "highcharts-menu-item", onclick: function(e5) {
                    e5 && e5.stopPropagation(), E2.hideMenu(), "string" != typeof t7 && t7.onclick && t7.onclick.apply(a5, arguments);
                  } }, void 0, v4), e4.setElementHTML(n7, t7.text || a5.options.lang[t7.textKey]), a5.styledMode || (n7.onmouseover = function() {
                    y3(this, p5.menuItemHoverStyle);
                  }, n7.onmouseout = function() {
                    y3(this, p5.menuItemStyle);
                  }, y3(n7, w3({ cursor: "pointer" }, p5.menuItemStyle || {})))), a5.exportDivElements.push(n7);
                }
              }), a5.exportDivElements.push(v4, E2), a5.exportMenuWidth = E2.offsetWidth, a5.exportMenuHeight = E2.offsetHeight);
              let T3 = { display: "block" };
              i6 + a5.exportMenuWidth > u5 ? T3.right = u5 - i6 - r4 - f4 + "px" : T3.left = i6 - f4 + "px", o5 + s4 + a5.exportMenuHeight > h5 && "top" !== l4.alignOptions.verticalAlign ? T3.bottom = h5 - o5 - f4 + "px" : T3.top = o5 + s4 - f4 + "px", y3(E2, T3), y3(a5.renderTo, { overflow: "" }), y3(a5.container, { overflow: "" }), a5.openMenu = true, C3(a5, "exportMenuShown");
            }
            function I2(e5) {
              let t6;
              let n6 = e5 ? e5.target : this, i6 = n6.exportSVGElements, o5 = n6.exportDivElements, r4 = n6.exportEvents;
              i6 && (i6.forEach((e6, o6) => {
                e6 && (e6.onclick = e6.ontouchstart = null, n6[t6 = "cache-" + e6.menuClassName] && delete n6[t6], i6[o6] = e6.destroy());
              }), i6.length = 0), n6.exportingGroup && (n6.exportingGroup.destroy(), delete n6.exportingGroup), o5 && (o5.forEach(function(e6, t7) {
                e6 && (c3.clearTimeout(e6.hideTimer), M2(e6, "mouseleave"), o5[t7] = e6.onmouseout = e6.onmouseover = e6.ontouchstart = e6.onclick = null, v3(e6));
              }), o5.length = 0), r4 && (r4.forEach(function(e6) {
                e6();
              }), r4.length = 0);
            }
            function R(e5, t6) {
              let n6 = this.getSVGForExport(e5, t6);
              e5 = T2(this.options.exporting, e5), a4.post(e5.url, { filename: e5.filename ? e5.filename.replace(/\//g, "-") : this.getFilename(), type: e5.type, width: e5.width, scale: e5.scale, svg: n6 }, e5.fetchOptions);
            }
            function L2() {
              return this.styledMode && this.inlineStyles(), this.container.innerHTML;
            }
            function $2() {
              let e5 = this.userOptions.title && this.userOptions.title.text, t6 = this.options.exporting.filename;
              return t6 ? t6.replace(/\//g, "-") : ("string" == typeof e5 && (t6 = e5.toLowerCase().replace(/<\/?[^>]+(>|$)/g, "").replace(/[\s_]+/g, "-").replace(/[^a-z0-9\-]/g, "").replace(/^[\-]+/g, "").replace(/[\-]+/g, "-").substr(0, 24).replace(/[\-]+$/g, "")), (!t6 || t6.length < 5) && (t6 = "chart"), t6);
            }
            function q2(e5) {
              let t6, n6, i6 = T2(this.options, e5);
              i6.plotOptions = T2(this.userOptions.plotOptions, e5 && e5.plotOptions), i6.time = T2(this.userOptions.time, e5 && e5.time);
              let o5 = b3("div", null, { position: "absolute", top: "-9999em", width: this.chartWidth + "px", height: this.chartHeight + "px" }, g3.body), r4 = this.renderTo.style.width, s4 = this.renderTo.style.height, l4 = i6.exporting.sourceWidth || i6.chart.width || /px$/.test(r4) && parseInt(r4, 10) || (i6.isGantt ? 800 : 600), a5 = i6.exporting.sourceHeight || i6.chart.height || /px$/.test(s4) && parseInt(s4, 10) || 400;
              w3(i6.chart, { animation: false, renderTo: o5, forExport: true, renderer: "SVGRenderer", width: l4, height: a5 }), i6.exporting.enabled = false, delete i6.data, i6.series = [], this.series.forEach(function(e6) {
                (n6 = T2(e6.userOptions, { animation: false, enableMouseTracking: false, showCheckbox: false, visible: e6.visible })).isInternal || i6.series.push(n6);
              });
              let c4 = {};
              this.axes.forEach(function(e6) {
                e6.userOptions.internalKey || (e6.userOptions.internalKey = P2()), e6.options.isInternal || (c4[e6.coll] || (c4[e6.coll] = true, i6[e6.coll] = []), i6[e6.coll].push(T2(e6.userOptions, { visible: e6.visible })));
              }), i6.colorAxis = this.userOptions.colorAxis;
              let p5 = new this.constructor(i6, this.callback);
              return e5 && ["xAxis", "yAxis", "series"].forEach(function(t7) {
                let n7 = {};
                e5[t7] && (n7[t7] = e5[t7], p5.update(n7));
              }), this.axes.forEach(function(e6) {
                let t7 = E(p5.axes, function(t8) {
                  return t8.options.internalKey === e6.userOptions.internalKey;
                }), n7 = e6.getExtremes(), i7 = n7.userMin, o6 = n7.userMax;
                t7 && (void 0 !== i7 && i7 !== t7.min || void 0 !== o6 && o6 !== t7.max) && t7.setExtremes(i7, o6, true, false);
              }), t6 = p5.getChartHTML(), C3(this, "getSVG", { chartCopy: p5 }), t6 = this.sanitizeSVG(t6, i6), i6 = null, p5.destroy(), v3(o5), t6;
            }
            function z2(e5, t6) {
              let n6 = this.options.exporting;
              return this.getSVG(T2({ chart: { borderRadius: 0 } }, n6.chartOptions, t6, { exporting: { sourceWidth: e5 && e5.sourceWidth || n6.sourceWidth, sourceHeight: e5 && e5.sourceHeight || n6.sourceHeight } }));
            }
            function V() {
              let e5;
              let n6 = t5.inlineAllowlist, i6 = {}, o5 = g3.createElement("iframe");
              y3(o5, { width: "1px", height: "1px", visibility: "hidden" }), g3.body.appendChild(o5);
              let r4 = o5.contentWindow && o5.contentWindow.document;
              r4 && r4.body.appendChild(r4.createElementNS(f3, "svg")), function t6(o6) {
                let s4, a5, c4, u5, d4, g4;
                let f4 = {};
                if (r4 && 1 === o6.nodeType && -1 === N2.indexOf(o6.nodeName)) {
                  if (s4 = m3.getComputedStyle(o6, null), a5 = "svg" === o6.nodeName ? {} : m3.getComputedStyle(o6.parentNode, null), !i6[o6.nodeName]) {
                    e5 = r4.getElementsByTagName("svg")[0], c4 = r4.createElementNS(o6.namespaceURI, o6.nodeName), e5.appendChild(c4);
                    let t7 = m3.getComputedStyle(c4, null), n7 = {};
                    for (let e6 in t7)
                      "string" != typeof t7[e6] || /^[0-9]+$/.test(e6) || (n7[e6] = t7[e6]);
                    i6[o6.nodeName] = n7, "text" === o6.nodeName && delete i6.text.fill, e5.removeChild(c4);
                  }
                  for (let e6 in s4)
                    (l3.isFirefox || l3.isMS || l3.isSafari || Object.hasOwnProperty.call(s4, e6)) && function(e7, t7) {
                      if (u5 = d4 = false, n6.length) {
                        for (g4 = n6.length; g4-- && !d4; )
                          d4 = n6[g4].test(t7);
                        u5 = !d4;
                      }
                      for ("transform" === t7 && "none" === e7 && (u5 = true), g4 = p4.length; g4-- && !u5; )
                        u5 = p4[g4].test(t7) || "function" == typeof e7;
                      !u5 && (a5[t7] !== e7 || "svg" === o6.nodeName) && i6[o6.nodeName][t7] !== e7 && (h4 && -1 === h4.indexOf(t7) ? f4[t7] = e7 : e7 && o6.setAttribute(t7.replace(/([A-Z])/g, function(e8, t8) {
                        return "-" + t8.toLowerCase();
                      }), e7));
                    }(s4[e6], e6);
                  if (y3(o6, f4), "svg" === o6.nodeName && o6.setAttribute("stroke-width", "1px"), "text" === o6.nodeName)
                    return;
                  [].forEach.call(o6.children || o6.childNodes, t6);
                }
              }(this.container.querySelector("svg")), e5.parentNode.removeChild(e5), o5.parentNode.removeChild(o5);
            }
            function K(e5) {
              (this.fixedDiv ? [this.fixedDiv, this.scrollingContainer] : [this.container]).forEach(function(t6) {
                e5.appendChild(t6);
              });
            }
            function A2() {
              let e5 = this, t6 = (t7, n6, i6) => {
                e5.isDirtyExporting = true, T2(true, e5.options[t7], n6), O2(i6, true) && e5.redraw();
              };
              e5.exporting = { update: function(e6, n6) {
                t6("exporting", e6, n6);
              } }, n5.compose(e5).navigation.addUpdate((e6, n6) => {
                t6("navigation", e6, n6);
              });
            }
            function B() {
              let e5 = this;
              e5.isPrinting || (i5 = e5, l3.isSafari || e5.beforePrint(), setTimeout(() => {
                m3.focus(), m3.print(), l3.isSafari || setTimeout(() => {
                  e5.afterPrint();
                }, 1e3);
              }, 1));
            }
            function U() {
              let e5 = this, t6 = e5.options.exporting, n6 = t6.buttons, i6 = e5.isDirtyExporting || !e5.exportSVGElements;
              e5.buttonOffset = 0, e5.isDirtyExporting && e5.destroyExport(), i6 && false !== t6.enabled && (e5.exportEvents = [], e5.exportingGroup = e5.exportingGroup || e5.renderer.g("exporting-group").attr({ zIndex: 3 }).add(), F(n6, function(t7) {
                e5.addButton(t7);
              }), e5.isDirtyExporting = false);
            }
            function J(e5, t6) {
              let n6 = e5.indexOf("</svg>") + 6, i6 = e5.substr(n6);
              return e5 = e5.substr(0, n6), t6 && t6.exporting && t6.exporting.allowHTML && i6 && (i6 = '<foreignObject x="0" y="0" width="' + t6.chart.width + '" height="' + t6.chart.height + '"><body xmlns="http://www.w3.org/1999/xhtml">' + i6.replace(/(<(?:img|br).*?(?=\>))>/g, "$1 />") + "</body></foreignObject>", e5 = e5.replace("</svg>", i6 + "</svg>")), e5 = e5.replace(/zIndex="[^"]+"/g, "").replace(/symbolName="[^"]+"/g, "").replace(/jQuery[0-9]+="[^"]+"/g, "").replace(/url\(("|&quot;)(.*?)("|&quot;)\;?\)/g, "url($2)").replace(/url\([^#]+#/g, "url(#").replace(/<svg /, '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ (|NS[0-9]+\:)href=/g, " xlink:href=").replace(/\n/, " ").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, '$1="rgb($2)" $1-opacity="$3"').replace(/&nbsp;/g, "\xA0").replace(/&shy;/g, "\xAD");
            }
            t5.compose = function e5(t6, n6) {
              if (r3.compose(n6), s3.compose(t6), k3(d3, e5)) {
                let e6 = t6.prototype;
                e6.afterPrint = H, e6.exportChart = R, e6.inlineStyles = V, e6.print = B, e6.sanitizeSVG = J, e6.getChartHTML = L2, e6.getSVG = q2, e6.getSVGForExport = z2, e6.getFilename = $2, e6.moveContainers = K, e6.beforePrint = D2, e6.contextMenu = W, e6.addButton = j2, e6.destroyExport = I2, e6.renderExporting = U, e6.callbacks.push(G), x3(t6, "init", A2), l3.isSafari && m3.matchMedia("print").addListener(function(e7) {
                  i5 && (e7.matches ? i5.beforePrint() : i5.afterPrint());
                }), u4.exporting = T2(o4.exporting, u4.exporting), u4.lang = T2(o4.lang, u4.lang), u4.navigation = T2(o4.navigation, u4.navigation);
              }
            };
          }(p3 || (p3 = {})), p3;
        }), n4(t3, "masters/modules/exporting.src.js", [t3["Core/Globals.js"], t3["Extensions/Exporting/Exporting.js"], t3["Core/HttpUtilities.js"]], function(e4, t4, n5) {
          e4.HttpUtilities = n5, e4.ajax = n5.ajax, e4.getJSON = n5.getJSON, e4.post = n5.post, t4.compose(e4.Chart, e4.Renderer);
        });
      });
    }
  });

  // node_modules/highcharts/modules/export-data.js
  var require_export_data = __commonJS({
    "node_modules/highcharts/modules/export-data.js"(exports, module) {
      !function(t3) {
        "object" == typeof module && module.exports ? (t3.default = t3, module.exports = t3) : "function" == typeof define && define.amd ? define("highcharts/modules/export-data", ["highcharts", "highcharts/modules/exporting"], function(e3) {
          return t3(e3), t3.Highcharts = e3, t3;
        }) : t3("undefined" != typeof Highcharts ? Highcharts : void 0);
      }(function(t3) {
        "use strict";
        var e3 = t3 ? t3._modules : {};
        function a4(t4, e4, a5, o4) {
          t4.hasOwnProperty(e4) || (t4[e4] = o4.apply(null, a5), "function" == typeof CustomEvent && window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded", { detail: { path: e4, module: t4[e4] } })));
        }
        a4(e3, "Extensions/DownloadURL.js", [e3["Core/Globals.js"]], function(t4) {
          let { isSafari: e4, win: a5, win: { document: o4 } } = t4, n4 = a5.URL || a5.webkitURL || a5;
          function i4(t5) {
            let e5 = t5.replace(/filename=.*;/, "").match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/);
            if (e5 && e5.length > 3 && a5.atob && a5.ArrayBuffer && a5.Uint8Array && a5.Blob && n4.createObjectURL) {
              let t6 = a5.atob(e5[3]), o5 = new a5.ArrayBuffer(t6.length), i5 = new a5.Uint8Array(o5);
              for (let e6 = 0; e6 < i5.length; ++e6)
                i5[e6] = t6.charCodeAt(e6);
              return n4.createObjectURL(new a5.Blob([i5], { type: e5[1] }));
            }
          }
          return { dataURLtoBlob: i4, downloadURL: function(t5, n5) {
            let r3 = a5.navigator, s3 = o4.createElement("a");
            if ("string" != typeof t5 && !(t5 instanceof String) && r3.msSaveOrOpenBlob) {
              r3.msSaveOrOpenBlob(t5, n5);
              return;
            }
            t5 = "" + t5;
            let l3 = /Edge\/\d+/.test(r3.userAgent), h3 = e4 && "string" == typeof t5 && 0 === t5.indexOf("data:application/pdf");
            if ((h3 || l3 || t5.length > 2e6) && !(t5 = i4(t5) || ""))
              throw Error("Failed to convert to blob");
            if (void 0 !== s3.download)
              s3.href = t5, s3.download = n5, o4.body.appendChild(s3), s3.click(), o4.body.removeChild(s3);
            else
              try {
                if (!a5.open(t5, "chart"))
                  throw Error("Failed to open window");
              } catch {
                a5.location.href = t5;
              }
          } };
        }), a4(e3, "Extensions/ExportData/ExportDataDefaults.js", [], function() {
          return { exporting: { csv: { annotations: { itemDelimiter: "; ", join: false }, columnHeaderFormatter: null, dateFormat: "%Y-%m-%d %H:%M:%S", decimalPoint: null, itemDelimiter: null, lineDelimiter: "\n" }, showTable: false, useMultiLevelHeaders: true, useRowspanHeaders: true, showExportInProgress: true }, lang: { downloadCSV: "Download CSV", downloadXLS: "Download XLS", exportData: { annotationHeader: "Annotations", categoryHeader: "Category", categoryDatetimeHeader: "DateTime" }, viewData: "View data table", hideData: "Hide data table", exportInProgress: "Exporting..." } };
        }), a4(e3, "Extensions/ExportData/ExportData.js", [e3["Core/Renderer/HTML/AST.js"], e3["Core/Defaults.js"], e3["Extensions/DownloadURL.js"], e3["Extensions/ExportData/ExportDataDefaults.js"], e3["Core/Globals.js"], e3["Core/Series/SeriesRegistry.js"], e3["Core/Utilities.js"]], function(t4, e4, a5, o4, n4, i4, r3) {
          let { getOptions: s3, setOptions: l3 } = e4, { downloadURL: h3 } = a5, { composed: c3, doc: d3, win: p3 } = n4, { series: u4, seriesTypes: { arearange: m3, gantt: g3, map: x3, mapbubble: f3, treemap: b3, xrange: y3 } } = i4, { addEvent: w3, defined: D2, extend: T2, find: v3, fireEvent: E, isNumber: S3, pick: C3, pushUnique: L2 } = r3;
          function A2(t5) {
            let e5 = !!this.options.exporting?.showExportInProgress, a6 = p3.requestAnimationFrame || setTimeout;
            a6(() => {
              e5 && this.showLoading(this.options.lang.exportInProgress), a6(() => {
                try {
                  t5.call(this);
                } finally {
                  e5 && this.hideLoading();
                }
              });
            });
          }
          function R() {
            A2.call(this, () => {
              let t5 = this.getCSV(true);
              h3(B(t5, "text/csv") || "data:text/csv,\uFEFF" + encodeURIComponent(t5), this.getFilename() + ".csv");
            });
          }
          function k3() {
            A2.call(this, () => {
              let t5 = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Ark1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>td{border:none;font-family: Calibri, sans-serif;} .number{mso-number-format:"0.00";} .text{ mso-number-format:"@";}</style><meta name=ProgId content=Excel.Sheet><meta charset=UTF-8></head><body>' + this.getTable(true) + "</body></html>";
              h3(B(t5, "application/vnd.ms-excel") || "data:application/vnd.ms-excel;base64," + p3.btoa(unescape(encodeURIComponent(t5))), this.getFilename() + ".xls");
            });
          }
          function H(t5) {
            let e5 = "", a6 = this.getDataRows(), o5 = this.options.exporting.csv, n5 = C3(o5.decimalPoint, "," !== o5.itemDelimiter && t5 ? 1.1.toLocaleString()[1] : "."), i5 = C3(o5.itemDelimiter, "," === n5 ? ";" : ","), r4 = o5.lineDelimiter;
            return a6.forEach((t6, o6) => {
              let s4 = "", l4 = t6.length;
              for (; l4--; )
                "string" == typeof (s4 = t6[l4]) && (s4 = `"${s4}"`), "number" == typeof s4 && "." !== n5 && (s4 = s4.toString().replace(".", n5)), t6[l4] = s4;
              t6.length = a6.length ? a6[0].length : 0, e5 += t6.join(i5), o6 < a6.length - 1 && (e5 += r4);
            }), e5;
          }
          function O2(t5) {
            let e5, a6;
            let o5 = this.hasParallelCoordinates, n5 = this.time, i5 = this.options.exporting && this.options.exporting.csv || {}, r4 = this.xAxis, s4 = {}, l4 = [], h4 = [], c4 = [], d4 = this.options.lang, p4 = d4.exportData, m4 = p4.categoryHeader, g4 = p4.categoryDatetimeHeader, x4 = function(e6, a7, o6) {
              if (i5.columnHeaderFormatter) {
                let t6 = i5.columnHeaderFormatter(e6, a7, o6);
                if (false !== t6)
                  return t6;
              }
              return e6 ? e6 instanceof u4 ? t5 ? { columnTitle: o6 > 1 ? a7 : e6.name, topLevelColumnTitle: e6.name } : e6.name + (o6 > 1 ? " (" + a7 + ")" : "") : e6.options.title && e6.options.title.text || (e6.dateTime ? g4 : m4) : m4;
            }, f4 = function(t6, e6, a7) {
              let o6 = {}, n6 = {};
              return e6.forEach(function(e7) {
                let i6 = (t6.keyToAxis && t6.keyToAxis[e7] || e7) + "Axis", r5 = S3(a7) ? t6.chart[i6][a7] : t6[i6];
                o6[e7] = r5 && r5.categories || [], n6[e7] = r5 && r5.dateTime;
              }), { categoryMap: o6, dateTimeValueAxisMap: n6 };
            }, b4 = function(t6, e6) {
              let a7 = t6.pointArrayMap || ["y"], o6 = t6.data.some((t7) => void 0 !== t7.y && t7.name);
              return o6 && e6 && !e6.categories && "name" !== t6.exportKey ? ["x", ...a7] : a7;
            }, y4 = [], w4, T3, L3, A3 = 0, R2, k4;
            for (R2 in this.series.forEach(function(e6) {
              let a7 = e6.options.keys, l5 = e6.xAxis, d5 = a7 || b4(e6, l5), p5 = d5.length, u5 = !e6.requireSorting && {}, m5 = r4.indexOf(l5), g5 = f4(e6, d5), w5, D3;
              if (false !== e6.options.includeInDataExport && !e6.options.isInternal && false !== e6.visible) {
                for (v3(y4, function(t6) {
                  return t6[0] === m5;
                }) || y4.push([m5, A3]), D3 = 0; D3 < p5; )
                  L3 = x4(e6, d5[D3], d5.length), c4.push(L3.columnTitle || L3), t5 && h4.push(L3.topLevelColumnTitle || L3), D3++;
                (w5 = { chart: e6.chart, autoIncrement: e6.autoIncrement, options: e6.options, pointArrayMap: e6.pointArrayMap, index: e6.index }).index, e6.options.data.forEach(function(t6, a8) {
                  let r5, h5, c5;
                  let x5 = { series: w5 };
                  o5 && (g5 = f4(e6, d5, a8)), e6.pointClass.prototype.applyOptions.apply(x5, [t6]);
                  let b5 = e6.data[a8] && e6.data[a8].name;
                  if (r5 = (x5.x ?? "") + "," + b5, D3 = 0, (!l5 || "name" === e6.exportKey || !o5 && l5 && l5.hasNames && b5) && (r5 = b5), u5 && (u5[r5] && (r5 += "|" + a8), u5[r5] = true), s4[r5]) {
                    let t7 = `${r5},${s4[r5].pointers[e6.index]}`, a9 = r5;
                    s4[r5].pointers[e6.index] && (s4[t7] || (s4[t7] = [], s4[t7].xValues = [], s4[t7].pointers = []), r5 = t7), s4[a9].pointers[e6.index] += 1;
                  } else {
                    s4[r5] = [], s4[r5].xValues = [];
                    let t7 = [];
                    for (let a9 = 0; a9 < e6.chart.series.length; a9++)
                      t7[a9] = 0;
                    s4[r5].pointers = t7, s4[r5].pointers[e6.index] = 1;
                  }
                  for (s4[r5].x = x5.x, s4[r5].name = b5, s4[r5].xValues[m5] = x5.x; D3 < p5; )
                    c5 = x5[h5 = d5[D3]], s4[r5][A3 + D3] = C3(g5.categoryMap[h5][c5], g5.dateTimeValueAxisMap[h5] ? n5.dateFormat(i5.dateFormat, c5) : null, c5), D3++;
                }), A3 += D3;
              }
            }), s4)
              Object.hasOwnProperty.call(s4, R2) && l4.push(s4[R2]);
            for (T3 = t5 ? [h4, c4] : [c4], A3 = y4.length; A3--; )
              e5 = y4[A3][0], a6 = y4[A3][1], w4 = r4[e5], l4.sort(function(t6, a7) {
                return t6.xValues[e5] - a7.xValues[e5];
              }), k4 = x4(w4), T3[0].splice(a6, 0, k4), t5 && T3[1] && T3[1].splice(a6, 0, k4), l4.forEach(function(t6) {
                let e6 = t6.name;
                w4 && !D2(e6) && (w4.dateTime ? (t6.x instanceof Date && (t6.x = t6.x.getTime()), e6 = n5.dateFormat(i5.dateFormat, t6.x)) : e6 = w4.categories ? C3(w4.names[t6.x], w4.categories[t6.x], t6.x) : t6.x), t6.splice(a6, 0, e6);
              });
            return E(this, "exportData", { dataRows: T3 = T3.concat(l4) }), T3;
          }
          function j2(t5) {
            let e5 = (t6) => {
              if (!t6.tagName || "#text" === t6.tagName)
                return t6.textContent || "";
              let a7 = t6.attributes, o5 = `<${t6.tagName}`;
              return a7 && Object.keys(a7).forEach((t7) => {
                let e6 = a7[t7];
                o5 += ` ${t7}="${e6}"`;
              }), o5 += ">" + (t6.textContent || ""), (t6.children || []).forEach((t7) => {
                o5 += e5(t7);
              }), o5 += `</${t6.tagName}>`;
            }, a6 = this.getTableAST(t5);
            return e5(a6);
          }
          function N2(t5) {
            let e5 = 0, a6 = [], o5 = this.options, n5 = t5 ? 1.1.toLocaleString()[1] : ".", i5 = C3(o5.exporting.useMultiLevelHeaders, true), r4 = this.getDataRows(i5), s4 = i5 ? r4.shift() : null, l4 = r4.shift(), h4 = function(t6, e6) {
              let a7 = t6.length;
              if (e6.length !== a7)
                return false;
              for (; a7--; )
                if (t6[a7] !== e6[a7])
                  return false;
              return true;
            }, c4 = function(t6, e6, a7, o6) {
              let i6 = C3(o6, ""), r5 = "highcharts-text" + (e6 ? " " + e6 : "");
              return "number" == typeof i6 ? (i6 = i6.toString(), "," === n5 && (i6 = i6.replace(".", n5)), r5 = "highcharts-number") : o6 || (r5 = "highcharts-empty"), { tagName: t6, attributes: a7 = T2({ class: r5 }, a7), textContent: i6 };
            };
            false !== o5.exporting.tableCaption && a6.push({ tagName: "caption", attributes: { class: "highcharts-table-caption" }, textContent: C3(o5.exporting.tableCaption, o5.title.text ? o5.title.text : "Chart") });
            for (let t6 = 0, a7 = r4.length; t6 < a7; ++t6)
              r4[t6].length > e5 && (e5 = r4[t6].length);
            a6.push(function(t6, e6, a7) {
              let n6 = [], r5 = 0, s5 = a7 || e6 && e6.length, l5, d5 = 0, p5;
              if (i5 && t6 && e6 && !h4(t6, e6)) {
                let a8 = [];
                for (; r5 < s5; ++r5)
                  if ((l5 = t6[r5]) === t6[r5 + 1])
                    ++d5;
                  else if (d5)
                    a8.push(c4("th", "highcharts-table-topheading", { scope: "col", colspan: d5 + 1 }, l5)), d5 = 0;
                  else {
                    l5 === e6[r5] ? o5.exporting.useRowspanHeaders ? (p5 = 2, delete e6[r5]) : (p5 = 1, e6[r5] = "") : p5 = 1;
                    let t7 = c4("th", "highcharts-table-topheading", { scope: "col" }, l5);
                    p5 > 1 && t7.attributes && (t7.attributes.valign = "top", t7.attributes.rowspan = p5), a8.push(t7);
                  }
                n6.push({ tagName: "tr", children: a8 });
              }
              if (e6) {
                let t7 = [];
                for (r5 = 0, s5 = e6.length; r5 < s5; ++r5)
                  void 0 !== e6[r5] && t7.push(c4("th", null, { scope: "col" }, e6[r5]));
                n6.push({ tagName: "tr", children: t7 });
              }
              return { tagName: "thead", children: n6 };
            }(s4, l4, Math.max(e5, l4.length)));
            let d4 = [];
            r4.forEach(function(t6) {
              let a7 = [];
              for (let o6 = 0; o6 < e5; o6++)
                a7.push(c4(o6 ? "td" : "th", null, o6 ? {} : { scope: "row" }, t6[o6]));
              d4.push({ tagName: "tr", children: a7 });
            }), a6.push({ tagName: "tbody", children: d4 });
            let p4 = { tree: { tagName: "table", id: `highcharts-data-table-${this.index}`, children: a6 } };
            return E(this, "aftergetTableAST", p4), p4.tree;
          }
          function V() {
            this.toggleDataTable(false);
          }
          function U(e5) {
            e5 = C3(e5, !this.isDataTableVisible);
            let a6 = e5 && !this.dataTableDiv;
            if (a6 && (this.dataTableDiv = d3.createElement("div"), this.dataTableDiv.className = "highcharts-data-table", this.renderTo.parentNode.insertBefore(this.dataTableDiv, this.renderTo.nextSibling)), this.dataTableDiv) {
              let o6 = this.dataTableDiv.style, n6 = o6.display;
              if (o6.display = e5 ? "block" : "none", e5) {
                this.dataTableDiv.innerHTML = t4.emptyHTML;
                let e6 = new t4([this.getTableAST()]);
                e6.addToDOM(this.dataTableDiv), E(this, "afterViewData", { element: this.dataTableDiv, wasHidden: a6 || n6 !== o6.display });
              } else
                E(this, "afterHideData");
            }
            this.isDataTableVisible = e5;
            let o5 = this.exportDivElements, n5 = this.options.exporting, i5 = n5 && n5.buttons && n5.buttons.contextButton.menuItems, r4 = this.options.lang;
            if (n5 && n5.menuItemDefinitions && r4 && r4.viewData && r4.hideData && i5 && o5) {
              let e6 = o5[i5.indexOf("viewData")];
              e6 && t4.setElementHTML(e6, this.isDataTableVisible ? r4.hideData : r4.viewData);
            }
          }
          function F() {
            this.toggleDataTable(true);
          }
          function B(t5, e5) {
            let a6 = p3.navigator, o5 = p3.URL || p3.webkitURL || p3;
            try {
              if (a6.msSaveOrOpenBlob && p3.MSBlobBuilder) {
                let e6 = new p3.MSBlobBuilder();
                return e6.append(t5), e6.getBlob("image/svg+xml");
              }
              return o5.createObjectURL(new p3.Blob(["\uFEFF" + t5], { type: e5 }));
            } catch (t6) {
            }
          }
          function I2() {
            let t5 = this, e5 = t5.dataTableDiv, a6 = (t6, e6) => t6.children[e6].textContent, o5 = (t6, e6) => (o6, n5) => {
              var i5, r4;
              return i5 = a6(e6 ? o6 : n5, t6), r4 = a6(e6 ? n5 : o6, t6), "" === i5 || "" === r4 || isNaN(i5) || isNaN(r4) ? i5.toString().localeCompare(r4) : i5 - r4;
            };
            if (e5 && t5.options.exporting && t5.options.exporting.allowTableSorting) {
              let a7 = e5.querySelector("thead tr");
              a7 && a7.childNodes.forEach((a8) => {
                let n5 = a8.closest("table");
                a8.addEventListener("click", function() {
                  let i5 = [...e5.querySelectorAll("tr:not(thead tr)")], r4 = [...a8.parentNode.children];
                  i5.sort(o5(r4.indexOf(a8), t5.ascendingOrderInTable = !t5.ascendingOrderInTable)).forEach((t6) => {
                    n5.appendChild(t6);
                  }), r4.forEach((t6) => {
                    ["highcharts-sort-ascending", "highcharts-sort-descending"].forEach((e6) => {
                      t6.classList.contains(e6) && t6.classList.remove(e6);
                    });
                  }), a8.classList.add(t5.ascendingOrderInTable ? "highcharts-sort-ascending" : "highcharts-sort-descending");
                });
              });
            }
          }
          function M2() {
            this.options && this.options.exporting && this.options.exporting.showTable && !this.options.chart.forExport && this.viewData();
          }
          return { compose: function t5(e5) {
            if (L2(c3, t5)) {
              let t6 = e5.prototype, a6 = s3().exporting;
              w3(e5, "afterViewData", I2), w3(e5, "render", M2), t6.downloadCSV = R, t6.downloadXLS = k3, t6.getCSV = H, t6.getDataRows = O2, t6.getTable = j2, t6.getTableAST = N2, t6.hideData = V, t6.toggleDataTable = U, t6.viewData = F, a6 && (T2(a6.menuItemDefinitions, { downloadCSV: { textKey: "downloadCSV", onclick: function() {
                this.downloadCSV();
              } }, downloadXLS: { textKey: "downloadXLS", onclick: function() {
                this.downloadXLS();
              } }, viewData: { textKey: "viewData", onclick: function() {
                A2.call(this, this.toggleDataTable);
              } } }), a6.buttons && a6.buttons.contextButton.menuItems && a6.buttons.contextButton.menuItems.push("separator", "downloadCSV", "downloadXLS", "viewData")), l3(o4), m3 && (m3.prototype.keyToAxis = { low: "y", high: "y" }), g3 && (g3.prototype.exportKey = "name", g3.prototype.keyToAxis = { start: "x", end: "x" }), y3 && (y3.prototype.keyToAxis = { x2: "x" }), x3 && (x3.prototype.exportKey = "name"), f3 && (f3.prototype.exportKey = "name"), b3 && (b3.prototype.exportKey = "name");
            }
          } };
        }), a4(e3, "masters/modules/export-data.src.js", [e3["Core/Globals.js"], e3["Extensions/DownloadURL.js"], e3["Extensions/ExportData/ExportData.js"]], function(t4, e4, a5) {
          t4.dataURLtoBlob = e4.dataURLtoBlob, t4.downloadURL = e4.downloadURL, a5.compose(t4.Chart);
        });
      });
    }
  });

  // node_modules/octokit/dist-web/index.js
  var import_core2 = __toESM(require_dist_node4());

  // node_modules/@octokit/plugin-paginate-rest/dist-web/index.js
  var VERSION3 = "9.1.5";
  function normalizePaginatedListResponse(response) {
    if (!response.data) {
      return {
        ...response,
        data: []
      };
    }
    const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
    if (!responseNeedsNormalization)
      return response;
    const incompleteResults = response.data.incomplete_results;
    const repositorySelection = response.data.repository_selection;
    const totalCount = response.data.total_count;
    delete response.data.incomplete_results;
    delete response.data.repository_selection;
    delete response.data.total_count;
    const namespaceKey = Object.keys(response.data)[0];
    const data = response.data[namespaceKey];
    response.data = data;
    if (typeof incompleteResults !== "undefined") {
      response.data.incomplete_results = incompleteResults;
    }
    if (typeof repositorySelection !== "undefined") {
      response.data.repository_selection = repositorySelection;
    }
    response.data.total_count = totalCount;
    return response;
  }
  function iterator(octokit2, route, parameters) {
    const options = typeof route === "function" ? route.endpoint(parameters) : octokit2.request.endpoint(route, parameters);
    const requestMethod = typeof route === "function" ? route : octokit2.request;
    const method = options.method;
    const headers = options.headers;
    let url = options.url;
    return {
      [Symbol.asyncIterator]: () => ({
        async next() {
          if (!url)
            return { done: true };
          try {
            const response = await requestMethod({ method, url, headers });
            const normalizedResponse = normalizePaginatedListResponse(response);
            url = ((normalizedResponse.headers.link || "").match(
              /<([^>]+)>;\s*rel="next"/
            ) || [])[1];
            return { value: normalizedResponse };
          } catch (error) {
            if (error.status !== 409)
              throw error;
            url = "";
            return {
              value: {
                status: 200,
                headers: {},
                data: []
              }
            };
          }
        }
      })
    };
  }
  function paginate(octokit2, route, parameters, mapFn) {
    if (typeof parameters === "function") {
      mapFn = parameters;
      parameters = void 0;
    }
    return gather(
      octokit2,
      [],
      iterator(octokit2, route, parameters)[Symbol.asyncIterator](),
      mapFn
    );
  }
  function gather(octokit2, results, iterator2, mapFn) {
    return iterator2.next().then((result) => {
      if (result.done) {
        return results;
      }
      let earlyExit = false;
      function done() {
        earlyExit = true;
      }
      results = results.concat(
        mapFn ? mapFn(result.value, done) : result.value.data
      );
      if (earlyExit) {
        return results;
      }
      return gather(octokit2, results, iterator2, mapFn);
    });
  }
  var composePaginateRest = Object.assign(paginate, {
    iterator
  });
  function paginateRest(octokit2) {
    return {
      paginate: Object.assign(paginate.bind(null, octokit2), {
        iterator: iterator.bind(null, octokit2)
      })
    };
  }
  paginateRest.VERSION = VERSION3;

  // node_modules/@octokit/plugin-paginate-graphql/dist-web/index.js
  var generateMessage = (path, cursorValue) => `The cursor at "${path.join(
    ","
  )}" did not change its value "${cursorValue}" after a page transition. Please make sure your that your query is set up correctly.`;
  var MissingCursorChange = class extends Error {
    constructor(pageInfo, cursorValue) {
      super(generateMessage(pageInfo.pathInQuery, cursorValue));
      this.pageInfo = pageInfo;
      this.cursorValue = cursorValue;
      this.name = "MissingCursorChangeError";
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  };
  var MissingPageInfo = class extends Error {
    constructor(response) {
      super(
        `No pageInfo property found in response. Please make sure to specify the pageInfo in your query. Response-Data: ${JSON.stringify(
          response,
          null,
          2
        )}`
      );
      this.response = response;
      this.name = "MissingPageInfo";
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  };
  var isObject = (value) => Object.prototype.toString.call(value) === "[object Object]";
  function findPaginatedResourcePath(responseData) {
    const paginatedResourcePath = deepFindPathToProperty(
      responseData,
      "pageInfo"
    );
    if (paginatedResourcePath.length === 0) {
      throw new MissingPageInfo(responseData);
    }
    return paginatedResourcePath;
  }
  var deepFindPathToProperty = (object, searchProp, path = []) => {
    for (const key of Object.keys(object)) {
      const currentPath = [...path, key];
      const currentValue = object[key];
      if (currentValue.hasOwnProperty(searchProp)) {
        return currentPath;
      }
      if (isObject(currentValue)) {
        const result = deepFindPathToProperty(
          currentValue,
          searchProp,
          currentPath
        );
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  };
  var get = (object, path) => {
    return path.reduce((current, nextProperty) => current[nextProperty], object);
  };
  var set = (object, path, mutator) => {
    const lastProperty = path[path.length - 1];
    const parentPath = [...path].slice(0, -1);
    const parent = get(object, parentPath);
    if (typeof mutator === "function") {
      parent[lastProperty] = mutator(parent[lastProperty]);
    } else {
      parent[lastProperty] = mutator;
    }
  };
  var extractPageInfos = (responseData) => {
    const pageInfoPath = findPaginatedResourcePath(responseData);
    return {
      pathInQuery: pageInfoPath,
      pageInfo: get(responseData, [...pageInfoPath, "pageInfo"])
    };
  };
  var isForwardSearch = (givenPageInfo) => {
    return givenPageInfo.hasOwnProperty("hasNextPage");
  };
  var getCursorFrom = (pageInfo) => isForwardSearch(pageInfo) ? pageInfo.endCursor : pageInfo.startCursor;
  var hasAnotherPage = (pageInfo) => isForwardSearch(pageInfo) ? pageInfo.hasNextPage : pageInfo.hasPreviousPage;
  var createIterator = (octokit2) => {
    return (query, initialParameters = {}) => {
      let nextPageExists = true;
      let parameters = { ...initialParameters };
      return {
        [Symbol.asyncIterator]: () => ({
          async next() {
            if (!nextPageExists)
              return { done: true, value: {} };
            const response = await octokit2.graphql(
              query,
              parameters
            );
            const pageInfoContext = extractPageInfos(response);
            const nextCursorValue = getCursorFrom(pageInfoContext.pageInfo);
            nextPageExists = hasAnotherPage(pageInfoContext.pageInfo);
            if (nextPageExists && nextCursorValue === parameters.cursor) {
              throw new MissingCursorChange(pageInfoContext, nextCursorValue);
            }
            parameters = {
              ...parameters,
              cursor: nextCursorValue
            };
            return { done: false, value: response };
          }
        })
      };
    };
  };
  var mergeResponses = (response1, response2) => {
    if (Object.keys(response1).length === 0) {
      return Object.assign(response1, response2);
    }
    const path = findPaginatedResourcePath(response1);
    const nodesPath = [...path, "nodes"];
    const newNodes = get(response2, nodesPath);
    if (newNodes) {
      set(response1, nodesPath, (values) => {
        return [...values, ...newNodes];
      });
    }
    const edgesPath = [...path, "edges"];
    const newEdges = get(response2, edgesPath);
    if (newEdges) {
      set(response1, edgesPath, (values) => {
        return [...values, ...newEdges];
      });
    }
    const pageInfoPath = [...path, "pageInfo"];
    set(response1, pageInfoPath, get(response2, pageInfoPath));
    return response1;
  };
  var createPaginate = (octokit2) => {
    const iterator2 = createIterator(octokit2);
    return async (query, initialParameters = {}) => {
      let mergedResponse = {};
      for await (const response of iterator2(
        query,
        initialParameters
      )) {
        mergedResponse = mergeResponses(mergedResponse, response);
      }
      return mergedResponse;
    };
  };
  function paginateGraphql(octokit2) {
    octokit2.graphql;
    return {
      graphql: Object.assign(octokit2.graphql, {
        paginate: Object.assign(createPaginate(octokit2), {
          iterator: createIterator(octokit2)
        })
      })
    };
  }

  // node_modules/@octokit/plugin-rest-endpoint-methods/dist-web/index.js
  var VERSION4 = "10.2.0";
  var Endpoints = {
    actions: {
      addCustomLabelsToSelfHostedRunnerForOrg: [
        "POST /orgs/{org}/actions/runners/{runner_id}/labels"
      ],
      addCustomLabelsToSelfHostedRunnerForRepo: [
        "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
      ],
      addSelectedRepoToOrgSecret: [
        "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
      ],
      addSelectedRepoToOrgVariable: [
        "PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
      ],
      approveWorkflowRun: [
        "POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"
      ],
      cancelWorkflowRun: [
        "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"
      ],
      createEnvironmentVariable: [
        "POST /repositories/{repository_id}/environments/{environment_name}/variables"
      ],
      createOrUpdateEnvironmentSecret: [
        "PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"
      ],
      createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
      createOrUpdateRepoSecret: [
        "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"
      ],
      createOrgVariable: ["POST /orgs/{org}/actions/variables"],
      createRegistrationTokenForOrg: [
        "POST /orgs/{org}/actions/runners/registration-token"
      ],
      createRegistrationTokenForRepo: [
        "POST /repos/{owner}/{repo}/actions/runners/registration-token"
      ],
      createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
      createRemoveTokenForRepo: [
        "POST /repos/{owner}/{repo}/actions/runners/remove-token"
      ],
      createRepoVariable: ["POST /repos/{owner}/{repo}/actions/variables"],
      createWorkflowDispatch: [
        "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
      ],
      deleteActionsCacheById: [
        "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"
      ],
      deleteActionsCacheByKey: [
        "DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"
      ],
      deleteArtifact: [
        "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
      ],
      deleteEnvironmentSecret: [
        "DELETE /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"
      ],
      deleteEnvironmentVariable: [
        "DELETE /repositories/{repository_id}/environments/{environment_name}/variables/{name}"
      ],
      deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
      deleteOrgVariable: ["DELETE /orgs/{org}/actions/variables/{name}"],
      deleteRepoSecret: [
        "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"
      ],
      deleteRepoVariable: [
        "DELETE /repos/{owner}/{repo}/actions/variables/{name}"
      ],
      deleteSelfHostedRunnerFromOrg: [
        "DELETE /orgs/{org}/actions/runners/{runner_id}"
      ],
      deleteSelfHostedRunnerFromRepo: [
        "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"
      ],
      deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
      deleteWorkflowRunLogs: [
        "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
      ],
      disableSelectedRepositoryGithubActionsOrganization: [
        "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
      ],
      disableWorkflow: [
        "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"
      ],
      downloadArtifact: [
        "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
      ],
      downloadJobLogsForWorkflowRun: [
        "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"
      ],
      downloadWorkflowRunAttemptLogs: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"
      ],
      downloadWorkflowRunLogs: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
      ],
      enableSelectedRepositoryGithubActionsOrganization: [
        "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
      ],
      enableWorkflow: [
        "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"
      ],
      forceCancelWorkflowRun: [
        "POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"
      ],
      generateRunnerJitconfigForOrg: [
        "POST /orgs/{org}/actions/runners/generate-jitconfig"
      ],
      generateRunnerJitconfigForRepo: [
        "POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"
      ],
      getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
      getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
      getActionsCacheUsageByRepoForOrg: [
        "GET /orgs/{org}/actions/cache/usage-by-repository"
      ],
      getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
      getAllowedActionsOrganization: [
        "GET /orgs/{org}/actions/permissions/selected-actions"
      ],
      getAllowedActionsRepository: [
        "GET /repos/{owner}/{repo}/actions/permissions/selected-actions"
      ],
      getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
      getEnvironmentPublicKey: [
        "GET /repositories/{repository_id}/environments/{environment_name}/secrets/public-key"
      ],
      getEnvironmentSecret: [
        "GET /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"
      ],
      getEnvironmentVariable: [
        "GET /repositories/{repository_id}/environments/{environment_name}/variables/{name}"
      ],
      getGithubActionsDefaultWorkflowPermissionsOrganization: [
        "GET /orgs/{org}/actions/permissions/workflow"
      ],
      getGithubActionsDefaultWorkflowPermissionsRepository: [
        "GET /repos/{owner}/{repo}/actions/permissions/workflow"
      ],
      getGithubActionsPermissionsOrganization: [
        "GET /orgs/{org}/actions/permissions"
      ],
      getGithubActionsPermissionsRepository: [
        "GET /repos/{owner}/{repo}/actions/permissions"
      ],
      getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
      getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
      getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
      getOrgVariable: ["GET /orgs/{org}/actions/variables/{name}"],
      getPendingDeploymentsForRun: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
      ],
      getRepoPermissions: [
        "GET /repos/{owner}/{repo}/actions/permissions",
        {},
        { renamed: ["actions", "getGithubActionsPermissionsRepository"] }
      ],
      getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
      getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
      getRepoVariable: ["GET /repos/{owner}/{repo}/actions/variables/{name}"],
      getReviewsForRun: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"
      ],
      getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
      getSelfHostedRunnerForRepo: [
        "GET /repos/{owner}/{repo}/actions/runners/{runner_id}"
      ],
      getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
      getWorkflowAccessToRepository: [
        "GET /repos/{owner}/{repo}/actions/permissions/access"
      ],
      getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
      getWorkflowRunAttempt: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"
      ],
      getWorkflowRunUsage: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"
      ],
      getWorkflowUsage: [
        "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"
      ],
      listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
      listEnvironmentSecrets: [
        "GET /repositories/{repository_id}/environments/{environment_name}/secrets"
      ],
      listEnvironmentVariables: [
        "GET /repositories/{repository_id}/environments/{environment_name}/variables"
      ],
      listJobsForWorkflowRun: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"
      ],
      listJobsForWorkflowRunAttempt: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"
      ],
      listLabelsForSelfHostedRunnerForOrg: [
        "GET /orgs/{org}/actions/runners/{runner_id}/labels"
      ],
      listLabelsForSelfHostedRunnerForRepo: [
        "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
      ],
      listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
      listOrgVariables: ["GET /orgs/{org}/actions/variables"],
      listRepoOrganizationSecrets: [
        "GET /repos/{owner}/{repo}/actions/organization-secrets"
      ],
      listRepoOrganizationVariables: [
        "GET /repos/{owner}/{repo}/actions/organization-variables"
      ],
      listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
      listRepoVariables: ["GET /repos/{owner}/{repo}/actions/variables"],
      listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
      listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
      listRunnerApplicationsForRepo: [
        "GET /repos/{owner}/{repo}/actions/runners/downloads"
      ],
      listSelectedReposForOrgSecret: [
        "GET /orgs/{org}/actions/secrets/{secret_name}/repositories"
      ],
      listSelectedReposForOrgVariable: [
        "GET /orgs/{org}/actions/variables/{name}/repositories"
      ],
      listSelectedRepositoriesEnabledGithubActionsOrganization: [
        "GET /orgs/{org}/actions/permissions/repositories"
      ],
      listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
      listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
      listWorkflowRunArtifacts: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
      ],
      listWorkflowRuns: [
        "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
      ],
      listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
      reRunJobForWorkflowRun: [
        "POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"
      ],
      reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
      reRunWorkflowFailedJobs: [
        "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"
      ],
      removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
        "DELETE /orgs/{org}/actions/runners/{runner_id}/labels"
      ],
      removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
        "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
      ],
      removeCustomLabelFromSelfHostedRunnerForOrg: [
        "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"
      ],
      removeCustomLabelFromSelfHostedRunnerForRepo: [
        "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"
      ],
      removeSelectedRepoFromOrgSecret: [
        "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
      ],
      removeSelectedRepoFromOrgVariable: [
        "DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
      ],
      reviewCustomGatesForRun: [
        "POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"
      ],
      reviewPendingDeploymentsForRun: [
        "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
      ],
      setAllowedActionsOrganization: [
        "PUT /orgs/{org}/actions/permissions/selected-actions"
      ],
      setAllowedActionsRepository: [
        "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"
      ],
      setCustomLabelsForSelfHostedRunnerForOrg: [
        "PUT /orgs/{org}/actions/runners/{runner_id}/labels"
      ],
      setCustomLabelsForSelfHostedRunnerForRepo: [
        "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
      ],
      setGithubActionsDefaultWorkflowPermissionsOrganization: [
        "PUT /orgs/{org}/actions/permissions/workflow"
      ],
      setGithubActionsDefaultWorkflowPermissionsRepository: [
        "PUT /repos/{owner}/{repo}/actions/permissions/workflow"
      ],
      setGithubActionsPermissionsOrganization: [
        "PUT /orgs/{org}/actions/permissions"
      ],
      setGithubActionsPermissionsRepository: [
        "PUT /repos/{owner}/{repo}/actions/permissions"
      ],
      setSelectedReposForOrgSecret: [
        "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"
      ],
      setSelectedReposForOrgVariable: [
        "PUT /orgs/{org}/actions/variables/{name}/repositories"
      ],
      setSelectedRepositoriesEnabledGithubActionsOrganization: [
        "PUT /orgs/{org}/actions/permissions/repositories"
      ],
      setWorkflowAccessToRepository: [
        "PUT /repos/{owner}/{repo}/actions/permissions/access"
      ],
      updateEnvironmentVariable: [
        "PATCH /repositories/{repository_id}/environments/{environment_name}/variables/{name}"
      ],
      updateOrgVariable: ["PATCH /orgs/{org}/actions/variables/{name}"],
      updateRepoVariable: [
        "PATCH /repos/{owner}/{repo}/actions/variables/{name}"
      ]
    },
    activity: {
      checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
      deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
      deleteThreadSubscription: [
        "DELETE /notifications/threads/{thread_id}/subscription"
      ],
      getFeeds: ["GET /feeds"],
      getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
      getThread: ["GET /notifications/threads/{thread_id}"],
      getThreadSubscriptionForAuthenticatedUser: [
        "GET /notifications/threads/{thread_id}/subscription"
      ],
      listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
      listNotificationsForAuthenticatedUser: ["GET /notifications"],
      listOrgEventsForAuthenticatedUser: [
        "GET /users/{username}/events/orgs/{org}"
      ],
      listPublicEvents: ["GET /events"],
      listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
      listPublicEventsForUser: ["GET /users/{username}/events/public"],
      listPublicOrgEvents: ["GET /orgs/{org}/events"],
      listReceivedEventsForUser: ["GET /users/{username}/received_events"],
      listReceivedPublicEventsForUser: [
        "GET /users/{username}/received_events/public"
      ],
      listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
      listRepoNotificationsForAuthenticatedUser: [
        "GET /repos/{owner}/{repo}/notifications"
      ],
      listReposStarredByAuthenticatedUser: ["GET /user/starred"],
      listReposStarredByUser: ["GET /users/{username}/starred"],
      listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
      listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
      listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
      listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
      markNotificationsAsRead: ["PUT /notifications"],
      markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
      markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
      setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
      setThreadSubscription: [
        "PUT /notifications/threads/{thread_id}/subscription"
      ],
      starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
      unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
    },
    apps: {
      addRepoToInstallation: [
        "PUT /user/installations/{installation_id}/repositories/{repository_id}",
        {},
        { renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"] }
      ],
      addRepoToInstallationForAuthenticatedUser: [
        "PUT /user/installations/{installation_id}/repositories/{repository_id}"
      ],
      checkToken: ["POST /applications/{client_id}/token"],
      createFromManifest: ["POST /app-manifests/{code}/conversions"],
      createInstallationAccessToken: [
        "POST /app/installations/{installation_id}/access_tokens"
      ],
      deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
      deleteInstallation: ["DELETE /app/installations/{installation_id}"],
      deleteToken: ["DELETE /applications/{client_id}/token"],
      getAuthenticated: ["GET /app"],
      getBySlug: ["GET /apps/{app_slug}"],
      getInstallation: ["GET /app/installations/{installation_id}"],
      getOrgInstallation: ["GET /orgs/{org}/installation"],
      getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
      getSubscriptionPlanForAccount: [
        "GET /marketplace_listing/accounts/{account_id}"
      ],
      getSubscriptionPlanForAccountStubbed: [
        "GET /marketplace_listing/stubbed/accounts/{account_id}"
      ],
      getUserInstallation: ["GET /users/{username}/installation"],
      getWebhookConfigForApp: ["GET /app/hook/config"],
      getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
      listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
      listAccountsForPlanStubbed: [
        "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"
      ],
      listInstallationReposForAuthenticatedUser: [
        "GET /user/installations/{installation_id}/repositories"
      ],
      listInstallationRequestsForAuthenticatedApp: [
        "GET /app/installation-requests"
      ],
      listInstallations: ["GET /app/installations"],
      listInstallationsForAuthenticatedUser: ["GET /user/installations"],
      listPlans: ["GET /marketplace_listing/plans"],
      listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
      listReposAccessibleToInstallation: ["GET /installation/repositories"],
      listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
      listSubscriptionsForAuthenticatedUserStubbed: [
        "GET /user/marketplace_purchases/stubbed"
      ],
      listWebhookDeliveries: ["GET /app/hook/deliveries"],
      redeliverWebhookDelivery: [
        "POST /app/hook/deliveries/{delivery_id}/attempts"
      ],
      removeRepoFromInstallation: [
        "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
        {},
        { renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"] }
      ],
      removeRepoFromInstallationForAuthenticatedUser: [
        "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
      ],
      resetToken: ["PATCH /applications/{client_id}/token"],
      revokeInstallationAccessToken: ["DELETE /installation/token"],
      scopeToken: ["POST /applications/{client_id}/token/scoped"],
      suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
      unsuspendInstallation: [
        "DELETE /app/installations/{installation_id}/suspended"
      ],
      updateWebhookConfigForApp: ["PATCH /app/hook/config"]
    },
    billing: {
      getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
      getGithubActionsBillingUser: [
        "GET /users/{username}/settings/billing/actions"
      ],
      getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
      getGithubPackagesBillingUser: [
        "GET /users/{username}/settings/billing/packages"
      ],
      getSharedStorageBillingOrg: [
        "GET /orgs/{org}/settings/billing/shared-storage"
      ],
      getSharedStorageBillingUser: [
        "GET /users/{username}/settings/billing/shared-storage"
      ]
    },
    checks: {
      create: ["POST /repos/{owner}/{repo}/check-runs"],
      createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
      get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
      getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
      listAnnotations: [
        "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"
      ],
      listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
      listForSuite: [
        "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"
      ],
      listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
      rerequestRun: [
        "POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"
      ],
      rerequestSuite: [
        "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"
      ],
      setSuitesPreferences: [
        "PATCH /repos/{owner}/{repo}/check-suites/preferences"
      ],
      update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
    },
    codeScanning: {
      deleteAnalysis: [
        "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
      ],
      getAlert: [
        "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
        {},
        { renamedParameters: { alert_id: "alert_number" } }
      ],
      getAnalysis: [
        "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"
      ],
      getCodeqlDatabase: [
        "GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
      ],
      getDefaultSetup: ["GET /repos/{owner}/{repo}/code-scanning/default-setup"],
      getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
      listAlertInstances: [
        "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"
      ],
      listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
      listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
      listAlertsInstances: [
        "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
        {},
        { renamed: ["codeScanning", "listAlertInstances"] }
      ],
      listCodeqlDatabases: [
        "GET /repos/{owner}/{repo}/code-scanning/codeql/databases"
      ],
      listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
      updateAlert: [
        "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"
      ],
      updateDefaultSetup: [
        "PATCH /repos/{owner}/{repo}/code-scanning/default-setup"
      ],
      uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
    },
    codesOfConduct: {
      getAllCodesOfConduct: ["GET /codes_of_conduct"],
      getConductCode: ["GET /codes_of_conduct/{key}"]
    },
    codespaces: {
      addRepositoryForSecretForAuthenticatedUser: [
        "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
      ],
      addSelectedRepoToOrgSecret: [
        "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
      ],
      checkPermissionsForDevcontainer: [
        "GET /repos/{owner}/{repo}/codespaces/permissions_check"
      ],
      codespaceMachinesForAuthenticatedUser: [
        "GET /user/codespaces/{codespace_name}/machines"
      ],
      createForAuthenticatedUser: ["POST /user/codespaces"],
      createOrUpdateOrgSecret: [
        "PUT /orgs/{org}/codespaces/secrets/{secret_name}"
      ],
      createOrUpdateRepoSecret: [
        "PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
      ],
      createOrUpdateSecretForAuthenticatedUser: [
        "PUT /user/codespaces/secrets/{secret_name}"
      ],
      createWithPrForAuthenticatedUser: [
        "POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"
      ],
      createWithRepoForAuthenticatedUser: [
        "POST /repos/{owner}/{repo}/codespaces"
      ],
      deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
      deleteFromOrganization: [
        "DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"
      ],
      deleteOrgSecret: ["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],
      deleteRepoSecret: [
        "DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
      ],
      deleteSecretForAuthenticatedUser: [
        "DELETE /user/codespaces/secrets/{secret_name}"
      ],
      exportForAuthenticatedUser: [
        "POST /user/codespaces/{codespace_name}/exports"
      ],
      getCodespacesForUserInOrg: [
        "GET /orgs/{org}/members/{username}/codespaces"
      ],
      getExportDetailsForAuthenticatedUser: [
        "GET /user/codespaces/{codespace_name}/exports/{export_id}"
      ],
      getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
      getOrgPublicKey: ["GET /orgs/{org}/codespaces/secrets/public-key"],
      getOrgSecret: ["GET /orgs/{org}/codespaces/secrets/{secret_name}"],
      getPublicKeyForAuthenticatedUser: [
        "GET /user/codespaces/secrets/public-key"
      ],
      getRepoPublicKey: [
        "GET /repos/{owner}/{repo}/codespaces/secrets/public-key"
      ],
      getRepoSecret: [
        "GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
      ],
      getSecretForAuthenticatedUser: [
        "GET /user/codespaces/secrets/{secret_name}"
      ],
      listDevcontainersInRepositoryForAuthenticatedUser: [
        "GET /repos/{owner}/{repo}/codespaces/devcontainers"
      ],
      listForAuthenticatedUser: ["GET /user/codespaces"],
      listInOrganization: [
        "GET /orgs/{org}/codespaces",
        {},
        { renamedParameters: { org_id: "org" } }
      ],
      listInRepositoryForAuthenticatedUser: [
        "GET /repos/{owner}/{repo}/codespaces"
      ],
      listOrgSecrets: ["GET /orgs/{org}/codespaces/secrets"],
      listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
      listRepositoriesForSecretForAuthenticatedUser: [
        "GET /user/codespaces/secrets/{secret_name}/repositories"
      ],
      listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
      listSelectedReposForOrgSecret: [
        "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
      ],
      preFlightWithRepoForAuthenticatedUser: [
        "GET /repos/{owner}/{repo}/codespaces/new"
      ],
      publishForAuthenticatedUser: [
        "POST /user/codespaces/{codespace_name}/publish"
      ],
      removeRepositoryForSecretForAuthenticatedUser: [
        "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
      ],
      removeSelectedRepoFromOrgSecret: [
        "DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
      ],
      repoMachinesForAuthenticatedUser: [
        "GET /repos/{owner}/{repo}/codespaces/machines"
      ],
      setRepositoriesForSecretForAuthenticatedUser: [
        "PUT /user/codespaces/secrets/{secret_name}/repositories"
      ],
      setSelectedReposForOrgSecret: [
        "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
      ],
      startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
      stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
      stopInOrganization: [
        "POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"
      ],
      updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"]
    },
    copilot: {
      addCopilotForBusinessSeatsForTeams: [
        "POST /orgs/{org}/copilot/billing/selected_teams"
      ],
      addCopilotForBusinessSeatsForUsers: [
        "POST /orgs/{org}/copilot/billing/selected_users"
      ],
      cancelCopilotSeatAssignmentForTeams: [
        "DELETE /orgs/{org}/copilot/billing/selected_teams"
      ],
      cancelCopilotSeatAssignmentForUsers: [
        "DELETE /orgs/{org}/copilot/billing/selected_users"
      ],
      getCopilotOrganizationDetails: ["GET /orgs/{org}/copilot/billing"],
      getCopilotSeatDetailsForUser: [
        "GET /orgs/{org}/members/{username}/copilot"
      ],
      listCopilotSeats: ["GET /orgs/{org}/copilot/billing/seats"]
    },
    dependabot: {
      addSelectedRepoToOrgSecret: [
        "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
      ],
      createOrUpdateOrgSecret: [
        "PUT /orgs/{org}/dependabot/secrets/{secret_name}"
      ],
      createOrUpdateRepoSecret: [
        "PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
      ],
      deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
      deleteRepoSecret: [
        "DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
      ],
      getAlert: ["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],
      getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
      getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
      getRepoPublicKey: [
        "GET /repos/{owner}/{repo}/dependabot/secrets/public-key"
      ],
      getRepoSecret: [
        "GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
      ],
      listAlertsForEnterprise: [
        "GET /enterprises/{enterprise}/dependabot/alerts"
      ],
      listAlertsForOrg: ["GET /orgs/{org}/dependabot/alerts"],
      listAlertsForRepo: ["GET /repos/{owner}/{repo}/dependabot/alerts"],
      listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
      listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
      listSelectedReposForOrgSecret: [
        "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
      ],
      removeSelectedRepoFromOrgSecret: [
        "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
      ],
      setSelectedReposForOrgSecret: [
        "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
      ],
      updateAlert: [
        "PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"
      ]
    },
    dependencyGraph: {
      createRepositorySnapshot: [
        "POST /repos/{owner}/{repo}/dependency-graph/snapshots"
      ],
      diffRange: [
        "GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"
      ],
      exportSbom: ["GET /repos/{owner}/{repo}/dependency-graph/sbom"]
    },
    emojis: { get: ["GET /emojis"] },
    gists: {
      checkIsStarred: ["GET /gists/{gist_id}/star"],
      create: ["POST /gists"],
      createComment: ["POST /gists/{gist_id}/comments"],
      delete: ["DELETE /gists/{gist_id}"],
      deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
      fork: ["POST /gists/{gist_id}/forks"],
      get: ["GET /gists/{gist_id}"],
      getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
      getRevision: ["GET /gists/{gist_id}/{sha}"],
      list: ["GET /gists"],
      listComments: ["GET /gists/{gist_id}/comments"],
      listCommits: ["GET /gists/{gist_id}/commits"],
      listForUser: ["GET /users/{username}/gists"],
      listForks: ["GET /gists/{gist_id}/forks"],
      listPublic: ["GET /gists/public"],
      listStarred: ["GET /gists/starred"],
      star: ["PUT /gists/{gist_id}/star"],
      unstar: ["DELETE /gists/{gist_id}/star"],
      update: ["PATCH /gists/{gist_id}"],
      updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
    },
    git: {
      createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
      createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
      createRef: ["POST /repos/{owner}/{repo}/git/refs"],
      createTag: ["POST /repos/{owner}/{repo}/git/tags"],
      createTree: ["POST /repos/{owner}/{repo}/git/trees"],
      deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
      getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
      getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
      getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
      getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
      getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
      listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
      updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
    },
    gitignore: {
      getAllTemplates: ["GET /gitignore/templates"],
      getTemplate: ["GET /gitignore/templates/{name}"]
    },
    interactions: {
      getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
      getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
      getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
      getRestrictionsForYourPublicRepos: [
        "GET /user/interaction-limits",
        {},
        { renamed: ["interactions", "getRestrictionsForAuthenticatedUser"] }
      ],
      removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
      removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
      removeRestrictionsForRepo: [
        "DELETE /repos/{owner}/{repo}/interaction-limits"
      ],
      removeRestrictionsForYourPublicRepos: [
        "DELETE /user/interaction-limits",
        {},
        { renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"] }
      ],
      setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
      setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
      setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
      setRestrictionsForYourPublicRepos: [
        "PUT /user/interaction-limits",
        {},
        { renamed: ["interactions", "setRestrictionsForAuthenticatedUser"] }
      ]
    },
    issues: {
      addAssignees: [
        "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"
      ],
      addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
      checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
      checkUserCanBeAssignedToIssue: [
        "GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"
      ],
      create: ["POST /repos/{owner}/{repo}/issues"],
      createComment: [
        "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"
      ],
      createLabel: ["POST /repos/{owner}/{repo}/labels"],
      createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
      deleteComment: [
        "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"
      ],
      deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
      deleteMilestone: [
        "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"
      ],
      get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
      getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
      getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
      getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
      getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
      list: ["GET /issues"],
      listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
      listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
      listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
      listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
      listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
      listEventsForTimeline: [
        "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"
      ],
      listForAuthenticatedUser: ["GET /user/issues"],
      listForOrg: ["GET /orgs/{org}/issues"],
      listForRepo: ["GET /repos/{owner}/{repo}/issues"],
      listLabelsForMilestone: [
        "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"
      ],
      listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
      listLabelsOnIssue: [
        "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"
      ],
      listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
      lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
      removeAllLabels: [
        "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"
      ],
      removeAssignees: [
        "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"
      ],
      removeLabel: [
        "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"
      ],
      setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
      unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
      update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
      updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
      updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
      updateMilestone: [
        "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"
      ]
    },
    licenses: {
      get: ["GET /licenses/{license}"],
      getAllCommonlyUsed: ["GET /licenses"],
      getForRepo: ["GET /repos/{owner}/{repo}/license"]
    },
    markdown: {
      render: ["POST /markdown"],
      renderRaw: [
        "POST /markdown/raw",
        { headers: { "content-type": "text/plain; charset=utf-8" } }
      ]
    },
    meta: {
      get: ["GET /meta"],
      getAllVersions: ["GET /versions"],
      getOctocat: ["GET /octocat"],
      getZen: ["GET /zen"],
      root: ["GET /"]
    },
    migrations: {
      cancelImport: [
        "DELETE /repos/{owner}/{repo}/import",
        {},
        {
          deprecated: "octokit.rest.migrations.cancelImport() is deprecated, see https://docs.github.com/rest/migrations/source-imports#cancel-an-import"
        }
      ],
      deleteArchiveForAuthenticatedUser: [
        "DELETE /user/migrations/{migration_id}/archive"
      ],
      deleteArchiveForOrg: [
        "DELETE /orgs/{org}/migrations/{migration_id}/archive"
      ],
      downloadArchiveForOrg: [
        "GET /orgs/{org}/migrations/{migration_id}/archive"
      ],
      getArchiveForAuthenticatedUser: [
        "GET /user/migrations/{migration_id}/archive"
      ],
      getCommitAuthors: [
        "GET /repos/{owner}/{repo}/import/authors",
        {},
        {
          deprecated: "octokit.rest.migrations.getCommitAuthors() is deprecated, see https://docs.github.com/rest/migrations/source-imports#get-commit-authors"
        }
      ],
      getImportStatus: [
        "GET /repos/{owner}/{repo}/import",
        {},
        {
          deprecated: "octokit.rest.migrations.getImportStatus() is deprecated, see https://docs.github.com/rest/migrations/source-imports#get-an-import-status"
        }
      ],
      getLargeFiles: [
        "GET /repos/{owner}/{repo}/import/large_files",
        {},
        {
          deprecated: "octokit.rest.migrations.getLargeFiles() is deprecated, see https://docs.github.com/rest/migrations/source-imports#get-large-files"
        }
      ],
      getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
      getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
      listForAuthenticatedUser: ["GET /user/migrations"],
      listForOrg: ["GET /orgs/{org}/migrations"],
      listReposForAuthenticatedUser: [
        "GET /user/migrations/{migration_id}/repositories"
      ],
      listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
      listReposForUser: [
        "GET /user/migrations/{migration_id}/repositories",
        {},
        { renamed: ["migrations", "listReposForAuthenticatedUser"] }
      ],
      mapCommitAuthor: [
        "PATCH /repos/{owner}/{repo}/import/authors/{author_id}",
        {},
        {
          deprecated: "octokit.rest.migrations.mapCommitAuthor() is deprecated, see https://docs.github.com/rest/migrations/source-imports#map-a-commit-author"
        }
      ],
      setLfsPreference: [
        "PATCH /repos/{owner}/{repo}/import/lfs",
        {},
        {
          deprecated: "octokit.rest.migrations.setLfsPreference() is deprecated, see https://docs.github.com/rest/migrations/source-imports#update-git-lfs-preference"
        }
      ],
      startForAuthenticatedUser: ["POST /user/migrations"],
      startForOrg: ["POST /orgs/{org}/migrations"],
      startImport: [
        "PUT /repos/{owner}/{repo}/import",
        {},
        {
          deprecated: "octokit.rest.migrations.startImport() is deprecated, see https://docs.github.com/rest/migrations/source-imports#start-an-import"
        }
      ],
      unlockRepoForAuthenticatedUser: [
        "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"
      ],
      unlockRepoForOrg: [
        "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"
      ],
      updateImport: [
        "PATCH /repos/{owner}/{repo}/import",
        {},
        {
          deprecated: "octokit.rest.migrations.updateImport() is deprecated, see https://docs.github.com/rest/migrations/source-imports#update-an-import"
        }
      ]
    },
    orgs: {
      addSecurityManagerTeam: [
        "PUT /orgs/{org}/security-managers/teams/{team_slug}"
      ],
      blockUser: ["PUT /orgs/{org}/blocks/{username}"],
      cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
      checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
      checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
      checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
      convertMemberToOutsideCollaborator: [
        "PUT /orgs/{org}/outside_collaborators/{username}"
      ],
      createInvitation: ["POST /orgs/{org}/invitations"],
      createOrUpdateCustomProperties: ["PATCH /orgs/{org}/properties/schema"],
      createOrUpdateCustomPropertiesValuesForRepos: [
        "PATCH /orgs/{org}/properties/values"
      ],
      createOrUpdateCustomProperty: [
        "PUT /orgs/{org}/properties/schema/{custom_property_name}"
      ],
      createWebhook: ["POST /orgs/{org}/hooks"],
      delete: ["DELETE /orgs/{org}"],
      deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
      enableOrDisableSecurityProductOnAllOrgRepos: [
        "POST /orgs/{org}/{security_product}/{enablement}"
      ],
      get: ["GET /orgs/{org}"],
      getAllCustomProperties: ["GET /orgs/{org}/properties/schema"],
      getCustomProperty: [
        "GET /orgs/{org}/properties/schema/{custom_property_name}"
      ],
      getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
      getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
      getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
      getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
      getWebhookDelivery: [
        "GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"
      ],
      list: ["GET /organizations"],
      listAppInstallations: ["GET /orgs/{org}/installations"],
      listBlockedUsers: ["GET /orgs/{org}/blocks"],
      listCustomPropertiesValuesForRepos: ["GET /orgs/{org}/properties/values"],
      listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
      listForAuthenticatedUser: ["GET /user/orgs"],
      listForUser: ["GET /users/{username}/orgs"],
      listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
      listMembers: ["GET /orgs/{org}/members"],
      listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
      listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
      listPatGrantRepositories: [
        "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"
      ],
      listPatGrantRequestRepositories: [
        "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"
      ],
      listPatGrantRequests: ["GET /orgs/{org}/personal-access-token-requests"],
      listPatGrants: ["GET /orgs/{org}/personal-access-tokens"],
      listPendingInvitations: ["GET /orgs/{org}/invitations"],
      listPublicMembers: ["GET /orgs/{org}/public_members"],
      listSecurityManagerTeams: ["GET /orgs/{org}/security-managers"],
      listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
      listWebhooks: ["GET /orgs/{org}/hooks"],
      pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
      redeliverWebhookDelivery: [
        "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
      ],
      removeCustomProperty: [
        "DELETE /orgs/{org}/properties/schema/{custom_property_name}"
      ],
      removeMember: ["DELETE /orgs/{org}/members/{username}"],
      removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
      removeOutsideCollaborator: [
        "DELETE /orgs/{org}/outside_collaborators/{username}"
      ],
      removePublicMembershipForAuthenticatedUser: [
        "DELETE /orgs/{org}/public_members/{username}"
      ],
      removeSecurityManagerTeam: [
        "DELETE /orgs/{org}/security-managers/teams/{team_slug}"
      ],
      reviewPatGrantRequest: [
        "POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"
      ],
      reviewPatGrantRequestsInBulk: [
        "POST /orgs/{org}/personal-access-token-requests"
      ],
      setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
      setPublicMembershipForAuthenticatedUser: [
        "PUT /orgs/{org}/public_members/{username}"
      ],
      unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
      update: ["PATCH /orgs/{org}"],
      updateMembershipForAuthenticatedUser: [
        "PATCH /user/memberships/orgs/{org}"
      ],
      updatePatAccess: ["POST /orgs/{org}/personal-access-tokens/{pat_id}"],
      updatePatAccesses: ["POST /orgs/{org}/personal-access-tokens"],
      updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
      updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
    },
    packages: {
      deletePackageForAuthenticatedUser: [
        "DELETE /user/packages/{package_type}/{package_name}"
      ],
      deletePackageForOrg: [
        "DELETE /orgs/{org}/packages/{package_type}/{package_name}"
      ],
      deletePackageForUser: [
        "DELETE /users/{username}/packages/{package_type}/{package_name}"
      ],
      deletePackageVersionForAuthenticatedUser: [
        "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
      ],
      deletePackageVersionForOrg: [
        "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
      ],
      deletePackageVersionForUser: [
        "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
      ],
      getAllPackageVersionsForAPackageOwnedByAnOrg: [
        "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
        {},
        { renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"] }
      ],
      getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
        "GET /user/packages/{package_type}/{package_name}/versions",
        {},
        {
          renamed: [
            "packages",
            "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"
          ]
        }
      ],
      getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
        "GET /user/packages/{package_type}/{package_name}/versions"
      ],
      getAllPackageVersionsForPackageOwnedByOrg: [
        "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
      ],
      getAllPackageVersionsForPackageOwnedByUser: [
        "GET /users/{username}/packages/{package_type}/{package_name}/versions"
      ],
      getPackageForAuthenticatedUser: [
        "GET /user/packages/{package_type}/{package_name}"
      ],
      getPackageForOrganization: [
        "GET /orgs/{org}/packages/{package_type}/{package_name}"
      ],
      getPackageForUser: [
        "GET /users/{username}/packages/{package_type}/{package_name}"
      ],
      getPackageVersionForAuthenticatedUser: [
        "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
      ],
      getPackageVersionForOrganization: [
        "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
      ],
      getPackageVersionForUser: [
        "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
      ],
      listDockerMigrationConflictingPackagesForAuthenticatedUser: [
        "GET /user/docker/conflicts"
      ],
      listDockerMigrationConflictingPackagesForOrganization: [
        "GET /orgs/{org}/docker/conflicts"
      ],
      listDockerMigrationConflictingPackagesForUser: [
        "GET /users/{username}/docker/conflicts"
      ],
      listPackagesForAuthenticatedUser: ["GET /user/packages"],
      listPackagesForOrganization: ["GET /orgs/{org}/packages"],
      listPackagesForUser: ["GET /users/{username}/packages"],
      restorePackageForAuthenticatedUser: [
        "POST /user/packages/{package_type}/{package_name}/restore{?token}"
      ],
      restorePackageForOrg: [
        "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"
      ],
      restorePackageForUser: [
        "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"
      ],
      restorePackageVersionForAuthenticatedUser: [
        "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
      ],
      restorePackageVersionForOrg: [
        "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
      ],
      restorePackageVersionForUser: [
        "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
      ]
    },
    projects: {
      addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}"],
      createCard: ["POST /projects/columns/{column_id}/cards"],
      createColumn: ["POST /projects/{project_id}/columns"],
      createForAuthenticatedUser: ["POST /user/projects"],
      createForOrg: ["POST /orgs/{org}/projects"],
      createForRepo: ["POST /repos/{owner}/{repo}/projects"],
      delete: ["DELETE /projects/{project_id}"],
      deleteCard: ["DELETE /projects/columns/cards/{card_id}"],
      deleteColumn: ["DELETE /projects/columns/{column_id}"],
      get: ["GET /projects/{project_id}"],
      getCard: ["GET /projects/columns/cards/{card_id}"],
      getColumn: ["GET /projects/columns/{column_id}"],
      getPermissionForUser: [
        "GET /projects/{project_id}/collaborators/{username}/permission"
      ],
      listCards: ["GET /projects/columns/{column_id}/cards"],
      listCollaborators: ["GET /projects/{project_id}/collaborators"],
      listColumns: ["GET /projects/{project_id}/columns"],
      listForOrg: ["GET /orgs/{org}/projects"],
      listForRepo: ["GET /repos/{owner}/{repo}/projects"],
      listForUser: ["GET /users/{username}/projects"],
      moveCard: ["POST /projects/columns/cards/{card_id}/moves"],
      moveColumn: ["POST /projects/columns/{column_id}/moves"],
      removeCollaborator: [
        "DELETE /projects/{project_id}/collaborators/{username}"
      ],
      update: ["PATCH /projects/{project_id}"],
      updateCard: ["PATCH /projects/columns/cards/{card_id}"],
      updateColumn: ["PATCH /projects/columns/{column_id}"]
    },
    pulls: {
      checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
      create: ["POST /repos/{owner}/{repo}/pulls"],
      createReplyForReviewComment: [
        "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
      ],
      createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
      createReviewComment: [
        "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"
      ],
      deletePendingReview: [
        "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
      ],
      deleteReviewComment: [
        "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"
      ],
      dismissReview: [
        "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"
      ],
      get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
      getReview: [
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
      ],
      getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
      list: ["GET /repos/{owner}/{repo}/pulls"],
      listCommentsForReview: [
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
      ],
      listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
      listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
      listRequestedReviewers: [
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
      ],
      listReviewComments: [
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"
      ],
      listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
      listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
      merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
      removeRequestedReviewers: [
        "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
      ],
      requestReviewers: [
        "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
      ],
      submitReview: [
        "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"
      ],
      update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
      updateBranch: [
        "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"
      ],
      updateReview: [
        "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
      ],
      updateReviewComment: [
        "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"
      ]
    },
    rateLimit: { get: ["GET /rate_limit"] },
    reactions: {
      createForCommitComment: [
        "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"
      ],
      createForIssue: [
        "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"
      ],
      createForIssueComment: [
        "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
      ],
      createForPullRequestReviewComment: [
        "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
      ],
      createForRelease: [
        "POST /repos/{owner}/{repo}/releases/{release_id}/reactions"
      ],
      createForTeamDiscussionCommentInOrg: [
        "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
      ],
      createForTeamDiscussionInOrg: [
        "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
      ],
      deleteForCommitComment: [
        "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"
      ],
      deleteForIssue: [
        "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"
      ],
      deleteForIssueComment: [
        "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"
      ],
      deleteForPullRequestComment: [
        "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"
      ],
      deleteForRelease: [
        "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"
      ],
      deleteForTeamDiscussion: [
        "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"
      ],
      deleteForTeamDiscussionComment: [
        "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"
      ],
      listForCommitComment: [
        "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"
      ],
      listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
      listForIssueComment: [
        "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
      ],
      listForPullRequestReviewComment: [
        "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
      ],
      listForRelease: [
        "GET /repos/{owner}/{repo}/releases/{release_id}/reactions"
      ],
      listForTeamDiscussionCommentInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
      ],
      listForTeamDiscussionInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
      ]
    },
    repos: {
      acceptInvitation: [
        "PATCH /user/repository_invitations/{invitation_id}",
        {},
        { renamed: ["repos", "acceptInvitationForAuthenticatedUser"] }
      ],
      acceptInvitationForAuthenticatedUser: [
        "PATCH /user/repository_invitations/{invitation_id}"
      ],
      addAppAccessRestrictions: [
        "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
        {},
        { mapToData: "apps" }
      ],
      addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
      addStatusCheckContexts: [
        "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
        {},
        { mapToData: "contexts" }
      ],
      addTeamAccessRestrictions: [
        "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
        {},
        { mapToData: "teams" }
      ],
      addUserAccessRestrictions: [
        "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
        {},
        { mapToData: "users" }
      ],
      checkAutomatedSecurityFixes: [
        "GET /repos/{owner}/{repo}/automated-security-fixes"
      ],
      checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
      checkVulnerabilityAlerts: [
        "GET /repos/{owner}/{repo}/vulnerability-alerts"
      ],
      codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
      compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
      compareCommitsWithBasehead: [
        "GET /repos/{owner}/{repo}/compare/{basehead}"
      ],
      createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
      createCommitComment: [
        "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"
      ],
      createCommitSignatureProtection: [
        "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
      ],
      createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
      createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
      createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
      createDeploymentBranchPolicy: [
        "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
      ],
      createDeploymentProtectionRule: [
        "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
      ],
      createDeploymentStatus: [
        "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
      ],
      createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
      createForAuthenticatedUser: ["POST /user/repos"],
      createFork: ["POST /repos/{owner}/{repo}/forks"],
      createInOrg: ["POST /orgs/{org}/repos"],
      createOrUpdateEnvironment: [
        "PUT /repos/{owner}/{repo}/environments/{environment_name}"
      ],
      createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
      createOrgRuleset: ["POST /orgs/{org}/rulesets"],
      createPagesDeployment: ["POST /repos/{owner}/{repo}/pages/deployment"],
      createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
      createRelease: ["POST /repos/{owner}/{repo}/releases"],
      createRepoRuleset: ["POST /repos/{owner}/{repo}/rulesets"],
      createTagProtection: ["POST /repos/{owner}/{repo}/tags/protection"],
      createUsingTemplate: [
        "POST /repos/{template_owner}/{template_repo}/generate"
      ],
      createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
      declineInvitation: [
        "DELETE /user/repository_invitations/{invitation_id}",
        {},
        { renamed: ["repos", "declineInvitationForAuthenticatedUser"] }
      ],
      declineInvitationForAuthenticatedUser: [
        "DELETE /user/repository_invitations/{invitation_id}"
      ],
      delete: ["DELETE /repos/{owner}/{repo}"],
      deleteAccessRestrictions: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
      ],
      deleteAdminBranchProtection: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
      ],
      deleteAnEnvironment: [
        "DELETE /repos/{owner}/{repo}/environments/{environment_name}"
      ],
      deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
      deleteBranchProtection: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection"
      ],
      deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
      deleteCommitSignatureProtection: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
      ],
      deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
      deleteDeployment: [
        "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"
      ],
      deleteDeploymentBranchPolicy: [
        "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
      ],
      deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
      deleteInvitation: [
        "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"
      ],
      deleteOrgRuleset: ["DELETE /orgs/{org}/rulesets/{ruleset_id}"],
      deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
      deletePullRequestReviewProtection: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
      ],
      deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
      deleteReleaseAsset: [
        "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"
      ],
      deleteRepoRuleset: ["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
      deleteTagProtection: [
        "DELETE /repos/{owner}/{repo}/tags/protection/{tag_protection_id}"
      ],
      deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
      disableAutomatedSecurityFixes: [
        "DELETE /repos/{owner}/{repo}/automated-security-fixes"
      ],
      disableDeploymentProtectionRule: [
        "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
      ],
      disablePrivateVulnerabilityReporting: [
        "DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"
      ],
      disableVulnerabilityAlerts: [
        "DELETE /repos/{owner}/{repo}/vulnerability-alerts"
      ],
      downloadArchive: [
        "GET /repos/{owner}/{repo}/zipball/{ref}",
        {},
        { renamed: ["repos", "downloadZipballArchive"] }
      ],
      downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
      downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
      enableAutomatedSecurityFixes: [
        "PUT /repos/{owner}/{repo}/automated-security-fixes"
      ],
      enablePrivateVulnerabilityReporting: [
        "PUT /repos/{owner}/{repo}/private-vulnerability-reporting"
      ],
      enableVulnerabilityAlerts: [
        "PUT /repos/{owner}/{repo}/vulnerability-alerts"
      ],
      generateReleaseNotes: [
        "POST /repos/{owner}/{repo}/releases/generate-notes"
      ],
      get: ["GET /repos/{owner}/{repo}"],
      getAccessRestrictions: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
      ],
      getAdminBranchProtection: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
      ],
      getAllDeploymentProtectionRules: [
        "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
      ],
      getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
      getAllStatusCheckContexts: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
      ],
      getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
      getAppsWithAccessToProtectedBranch: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
      ],
      getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
      getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
      getBranchProtection: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection"
      ],
      getBranchRules: ["GET /repos/{owner}/{repo}/rules/branches/{branch}"],
      getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
      getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
      getCollaboratorPermissionLevel: [
        "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
      ],
      getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
      getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
      getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
      getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
      getCommitSignatureProtection: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
      ],
      getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
      getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
      getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
      getCustomDeploymentProtectionRule: [
        "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
      ],
      getCustomPropertiesValues: ["GET /repos/{owner}/{repo}/properties/values"],
      getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
      getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
      getDeploymentBranchPolicy: [
        "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
      ],
      getDeploymentStatus: [
        "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
      ],
      getEnvironment: [
        "GET /repos/{owner}/{repo}/environments/{environment_name}"
      ],
      getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
      getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
      getOrgRuleSuite: ["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],
      getOrgRuleSuites: ["GET /orgs/{org}/rulesets/rule-suites"],
      getOrgRuleset: ["GET /orgs/{org}/rulesets/{ruleset_id}"],
      getOrgRulesets: ["GET /orgs/{org}/rulesets"],
      getPages: ["GET /repos/{owner}/{repo}/pages"],
      getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
      getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
      getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
      getPullRequestReviewProtection: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
      ],
      getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
      getReadme: ["GET /repos/{owner}/{repo}/readme"],
      getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
      getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
      getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
      getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
      getRepoRuleSuite: [
        "GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"
      ],
      getRepoRuleSuites: ["GET /repos/{owner}/{repo}/rulesets/rule-suites"],
      getRepoRuleset: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
      getRepoRulesets: ["GET /repos/{owner}/{repo}/rulesets"],
      getStatusChecksProtection: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
      ],
      getTeamsWithAccessToProtectedBranch: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
      ],
      getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
      getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
      getUsersWithAccessToProtectedBranch: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
      ],
      getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
      getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
      getWebhookConfigForRepo: [
        "GET /repos/{owner}/{repo}/hooks/{hook_id}/config"
      ],
      getWebhookDelivery: [
        "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"
      ],
      listActivities: ["GET /repos/{owner}/{repo}/activity"],
      listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
      listBranches: ["GET /repos/{owner}/{repo}/branches"],
      listBranchesForHeadCommit: [
        "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"
      ],
      listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
      listCommentsForCommit: [
        "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"
      ],
      listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
      listCommitStatusesForRef: [
        "GET /repos/{owner}/{repo}/commits/{ref}/statuses"
      ],
      listCommits: ["GET /repos/{owner}/{repo}/commits"],
      listContributors: ["GET /repos/{owner}/{repo}/contributors"],
      listCustomDeploymentRuleIntegrations: [
        "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"
      ],
      listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
      listDeploymentBranchPolicies: [
        "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
      ],
      listDeploymentStatuses: [
        "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
      ],
      listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
      listForAuthenticatedUser: ["GET /user/repos"],
      listForOrg: ["GET /orgs/{org}/repos"],
      listForUser: ["GET /users/{username}/repos"],
      listForks: ["GET /repos/{owner}/{repo}/forks"],
      listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
      listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
      listLanguages: ["GET /repos/{owner}/{repo}/languages"],
      listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
      listPublic: ["GET /repositories"],
      listPullRequestsAssociatedWithCommit: [
        "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"
      ],
      listReleaseAssets: [
        "GET /repos/{owner}/{repo}/releases/{release_id}/assets"
      ],
      listReleases: ["GET /repos/{owner}/{repo}/releases"],
      listTagProtection: ["GET /repos/{owner}/{repo}/tags/protection"],
      listTags: ["GET /repos/{owner}/{repo}/tags"],
      listTeams: ["GET /repos/{owner}/{repo}/teams"],
      listWebhookDeliveries: [
        "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"
      ],
      listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
      merge: ["POST /repos/{owner}/{repo}/merges"],
      mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
      pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
      redeliverWebhookDelivery: [
        "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
      ],
      removeAppAccessRestrictions: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
        {},
        { mapToData: "apps" }
      ],
      removeCollaborator: [
        "DELETE /repos/{owner}/{repo}/collaborators/{username}"
      ],
      removeStatusCheckContexts: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
        {},
        { mapToData: "contexts" }
      ],
      removeStatusCheckProtection: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
      ],
      removeTeamAccessRestrictions: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
        {},
        { mapToData: "teams" }
      ],
      removeUserAccessRestrictions: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
        {},
        { mapToData: "users" }
      ],
      renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
      replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
      requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
      setAdminBranchProtection: [
        "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
      ],
      setAppAccessRestrictions: [
        "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
        {},
        { mapToData: "apps" }
      ],
      setStatusCheckContexts: [
        "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
        {},
        { mapToData: "contexts" }
      ],
      setTeamAccessRestrictions: [
        "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
        {},
        { mapToData: "teams" }
      ],
      setUserAccessRestrictions: [
        "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
        {},
        { mapToData: "users" }
      ],
      testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
      transfer: ["POST /repos/{owner}/{repo}/transfer"],
      update: ["PATCH /repos/{owner}/{repo}"],
      updateBranchProtection: [
        "PUT /repos/{owner}/{repo}/branches/{branch}/protection"
      ],
      updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
      updateDeploymentBranchPolicy: [
        "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
      ],
      updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
      updateInvitation: [
        "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"
      ],
      updateOrgRuleset: ["PUT /orgs/{org}/rulesets/{ruleset_id}"],
      updatePullRequestReviewProtection: [
        "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
      ],
      updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
      updateReleaseAsset: [
        "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"
      ],
      updateRepoRuleset: ["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
      updateStatusCheckPotection: [
        "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        {},
        { renamed: ["repos", "updateStatusCheckProtection"] }
      ],
      updateStatusCheckProtection: [
        "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
      ],
      updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
      updateWebhookConfigForRepo: [
        "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"
      ],
      uploadReleaseAsset: [
        "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
        { baseUrl: "https://uploads.github.com" }
      ]
    },
    search: {
      code: ["GET /search/code"],
      commits: ["GET /search/commits"],
      issuesAndPullRequests: ["GET /search/issues"],
      labels: ["GET /search/labels"],
      repos: ["GET /search/repositories"],
      topics: ["GET /search/topics"],
      users: ["GET /search/users"]
    },
    secretScanning: {
      getAlert: [
        "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
      ],
      listAlertsForEnterprise: [
        "GET /enterprises/{enterprise}/secret-scanning/alerts"
      ],
      listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
      listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
      listLocationsForAlert: [
        "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"
      ],
      updateAlert: [
        "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
      ]
    },
    securityAdvisories: {
      createPrivateVulnerabilityReport: [
        "POST /repos/{owner}/{repo}/security-advisories/reports"
      ],
      createRepositoryAdvisory: [
        "POST /repos/{owner}/{repo}/security-advisories"
      ],
      createRepositoryAdvisoryCveRequest: [
        "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"
      ],
      getGlobalAdvisory: ["GET /advisories/{ghsa_id}"],
      getRepositoryAdvisory: [
        "GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
      ],
      listGlobalAdvisories: ["GET /advisories"],
      listOrgRepositoryAdvisories: ["GET /orgs/{org}/security-advisories"],
      listRepositoryAdvisories: ["GET /repos/{owner}/{repo}/security-advisories"],
      updateRepositoryAdvisory: [
        "PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
      ]
    },
    teams: {
      addOrUpdateMembershipForUserInOrg: [
        "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"
      ],
      addOrUpdateProjectPermissionsInOrg: [
        "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}"
      ],
      addOrUpdateRepoPermissionsInOrg: [
        "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
      ],
      checkPermissionsForProjectInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}"
      ],
      checkPermissionsForRepoInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
      ],
      create: ["POST /orgs/{org}/teams"],
      createDiscussionCommentInOrg: [
        "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
      ],
      createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
      deleteDiscussionCommentInOrg: [
        "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
      ],
      deleteDiscussionInOrg: [
        "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
      ],
      deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
      getByName: ["GET /orgs/{org}/teams/{team_slug}"],
      getDiscussionCommentInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
      ],
      getDiscussionInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
      ],
      getMembershipForUserInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/memberships/{username}"
      ],
      list: ["GET /orgs/{org}/teams"],
      listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
      listDiscussionCommentsInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
      ],
      listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
      listForAuthenticatedUser: ["GET /user/teams"],
      listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
      listPendingInvitationsInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/invitations"
      ],
      listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects"],
      listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
      removeMembershipForUserInOrg: [
        "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"
      ],
      removeProjectInOrg: [
        "DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"
      ],
      removeRepoInOrg: [
        "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
      ],
      updateDiscussionCommentInOrg: [
        "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
      ],
      updateDiscussionInOrg: [
        "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
      ],
      updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
    },
    users: {
      addEmailForAuthenticated: [
        "POST /user/emails",
        {},
        { renamed: ["users", "addEmailForAuthenticatedUser"] }
      ],
      addEmailForAuthenticatedUser: ["POST /user/emails"],
      addSocialAccountForAuthenticatedUser: ["POST /user/social_accounts"],
      block: ["PUT /user/blocks/{username}"],
      checkBlocked: ["GET /user/blocks/{username}"],
      checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
      checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
      createGpgKeyForAuthenticated: [
        "POST /user/gpg_keys",
        {},
        { renamed: ["users", "createGpgKeyForAuthenticatedUser"] }
      ],
      createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
      createPublicSshKeyForAuthenticated: [
        "POST /user/keys",
        {},
        { renamed: ["users", "createPublicSshKeyForAuthenticatedUser"] }
      ],
      createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
      createSshSigningKeyForAuthenticatedUser: ["POST /user/ssh_signing_keys"],
      deleteEmailForAuthenticated: [
        "DELETE /user/emails",
        {},
        { renamed: ["users", "deleteEmailForAuthenticatedUser"] }
      ],
      deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
      deleteGpgKeyForAuthenticated: [
        "DELETE /user/gpg_keys/{gpg_key_id}",
        {},
        { renamed: ["users", "deleteGpgKeyForAuthenticatedUser"] }
      ],
      deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
      deletePublicSshKeyForAuthenticated: [
        "DELETE /user/keys/{key_id}",
        {},
        { renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"] }
      ],
      deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
      deleteSocialAccountForAuthenticatedUser: ["DELETE /user/social_accounts"],
      deleteSshSigningKeyForAuthenticatedUser: [
        "DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"
      ],
      follow: ["PUT /user/following/{username}"],
      getAuthenticated: ["GET /user"],
      getByUsername: ["GET /users/{username}"],
      getContextForUser: ["GET /users/{username}/hovercard"],
      getGpgKeyForAuthenticated: [
        "GET /user/gpg_keys/{gpg_key_id}",
        {},
        { renamed: ["users", "getGpgKeyForAuthenticatedUser"] }
      ],
      getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
      getPublicSshKeyForAuthenticated: [
        "GET /user/keys/{key_id}",
        {},
        { renamed: ["users", "getPublicSshKeyForAuthenticatedUser"] }
      ],
      getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
      getSshSigningKeyForAuthenticatedUser: [
        "GET /user/ssh_signing_keys/{ssh_signing_key_id}"
      ],
      list: ["GET /users"],
      listBlockedByAuthenticated: [
        "GET /user/blocks",
        {},
        { renamed: ["users", "listBlockedByAuthenticatedUser"] }
      ],
      listBlockedByAuthenticatedUser: ["GET /user/blocks"],
      listEmailsForAuthenticated: [
        "GET /user/emails",
        {},
        { renamed: ["users", "listEmailsForAuthenticatedUser"] }
      ],
      listEmailsForAuthenticatedUser: ["GET /user/emails"],
      listFollowedByAuthenticated: [
        "GET /user/following",
        {},
        { renamed: ["users", "listFollowedByAuthenticatedUser"] }
      ],
      listFollowedByAuthenticatedUser: ["GET /user/following"],
      listFollowersForAuthenticatedUser: ["GET /user/followers"],
      listFollowersForUser: ["GET /users/{username}/followers"],
      listFollowingForUser: ["GET /users/{username}/following"],
      listGpgKeysForAuthenticated: [
        "GET /user/gpg_keys",
        {},
        { renamed: ["users", "listGpgKeysForAuthenticatedUser"] }
      ],
      listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
      listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
      listPublicEmailsForAuthenticated: [
        "GET /user/public_emails",
        {},
        { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] }
      ],
      listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
      listPublicKeysForUser: ["GET /users/{username}/keys"],
      listPublicSshKeysForAuthenticated: [
        "GET /user/keys",
        {},
        { renamed: ["users", "listPublicSshKeysForAuthenticatedUser"] }
      ],
      listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
      listSocialAccountsForAuthenticatedUser: ["GET /user/social_accounts"],
      listSocialAccountsForUser: ["GET /users/{username}/social_accounts"],
      listSshSigningKeysForAuthenticatedUser: ["GET /user/ssh_signing_keys"],
      listSshSigningKeysForUser: ["GET /users/{username}/ssh_signing_keys"],
      setPrimaryEmailVisibilityForAuthenticated: [
        "PATCH /user/email/visibility",
        {},
        { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"] }
      ],
      setPrimaryEmailVisibilityForAuthenticatedUser: [
        "PATCH /user/email/visibility"
      ],
      unblock: ["DELETE /user/blocks/{username}"],
      unfollow: ["DELETE /user/following/{username}"],
      updateAuthenticated: ["PATCH /user"]
    }
  };
  var endpoints_default = Endpoints;
  var endpointMethodsMap = /* @__PURE__ */ new Map();
  for (const [scope, endpoints] of Object.entries(endpoints_default)) {
    for (const [methodName, endpoint2] of Object.entries(endpoints)) {
      const [route, defaults, decorations] = endpoint2;
      const [method, url] = route.split(/ /);
      const endpointDefaults = Object.assign(
        {
          method,
          url
        },
        defaults
      );
      if (!endpointMethodsMap.has(scope)) {
        endpointMethodsMap.set(scope, /* @__PURE__ */ new Map());
      }
      endpointMethodsMap.get(scope).set(methodName, {
        scope,
        methodName,
        endpointDefaults,
        decorations
      });
    }
  }
  var handler = {
    has({ scope }, methodName) {
      return endpointMethodsMap.get(scope).has(methodName);
    },
    getOwnPropertyDescriptor(target, methodName) {
      return {
        value: this.get(target, methodName),
        // ensures method is in the cache
        configurable: true,
        writable: true,
        enumerable: true
      };
    },
    defineProperty(target, methodName, descriptor) {
      Object.defineProperty(target.cache, methodName, descriptor);
      return true;
    },
    deleteProperty(target, methodName) {
      delete target.cache[methodName];
      return true;
    },
    ownKeys({ scope }) {
      return [...endpointMethodsMap.get(scope).keys()];
    },
    set(target, methodName, value) {
      return target.cache[methodName] = value;
    },
    get({ octokit: octokit2, scope, cache }, methodName) {
      if (cache[methodName]) {
        return cache[methodName];
      }
      const method = endpointMethodsMap.get(scope).get(methodName);
      if (!method) {
        return void 0;
      }
      const { endpointDefaults, decorations } = method;
      if (decorations) {
        cache[methodName] = decorate(
          octokit2,
          scope,
          methodName,
          endpointDefaults,
          decorations
        );
      } else {
        cache[methodName] = octokit2.request.defaults(endpointDefaults);
      }
      return cache[methodName];
    }
  };
  function endpointsToMethods(octokit2) {
    const newMethods = {};
    for (const scope of endpointMethodsMap.keys()) {
      newMethods[scope] = new Proxy({ octokit: octokit2, scope, cache: {} }, handler);
    }
    return newMethods;
  }
  function decorate(octokit2, scope, methodName, defaults, decorations) {
    const requestWithDefaults = octokit2.request.defaults(defaults);
    function withDecorations(...args) {
      let options = requestWithDefaults.endpoint.merge(...args);
      if (decorations.mapToData) {
        options = Object.assign({}, options, {
          data: options[decorations.mapToData],
          [decorations.mapToData]: void 0
        });
        return requestWithDefaults(options);
      }
      if (decorations.renamed) {
        const [newScope, newMethodName] = decorations.renamed;
        octokit2.log.warn(
          `octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`
        );
      }
      if (decorations.deprecated) {
        octokit2.log.warn(decorations.deprecated);
      }
      if (decorations.renamedParameters) {
        const options2 = requestWithDefaults.endpoint.merge(...args);
        for (const [name, alias] of Object.entries(
          decorations.renamedParameters
        )) {
          if (name in options2) {
            octokit2.log.warn(
              `"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`
            );
            if (!(alias in options2)) {
              options2[alias] = options2[name];
            }
            delete options2[name];
          }
        }
        return requestWithDefaults(options2);
      }
      return requestWithDefaults(...args);
    }
    return Object.assign(withDecorations, requestWithDefaults);
  }
  function restEndpointMethods(octokit2) {
    const api = endpointsToMethods(octokit2);
    return {
      rest: api
    };
  }
  restEndpointMethods.VERSION = VERSION4;
  function legacyRestEndpointMethods(octokit2) {
    const api = endpointsToMethods(octokit2);
    return {
      ...api,
      rest: api
    };
  }
  legacyRestEndpointMethods.VERSION = VERSION4;

  // node_modules/@octokit/plugin-retry/dist-web/index.js
  var import_light = __toESM(require_light());
  init_dist_web2();
  async function errorRequest(state, octokit2, error, options) {
    if (!error.request || !error.request.request) {
      throw error;
    }
    if (error.status >= 400 && !state.doNotRetry.includes(error.status)) {
      const retries = options.request.retries != null ? options.request.retries : state.retries;
      const retryAfter = Math.pow((options.request.retryCount || 0) + 1, 2);
      throw octokit2.retry.retryRequest(error, retries, retryAfter);
    }
    throw error;
  }
  async function wrapRequest(state, octokit2, request2, options) {
    const limiter = new import_light.default();
    limiter.on("failed", function(error, info) {
      const maxRetries = ~~error.request.request.retries;
      const after = ~~error.request.request.retryAfter;
      options.request.retryCount = info.retryCount + 1;
      if (maxRetries > info.retryCount) {
        return after * state.retryAfterBaseValue;
      }
    });
    return limiter.schedule(
      requestWithGraphqlErrorHandling.bind(null, state, octokit2, request2),
      options
    );
  }
  async function requestWithGraphqlErrorHandling(state, octokit2, request2, options) {
    const response = await request2(request2, options);
    if (response.data && response.data.errors && /Something went wrong while executing your query/.test(
      response.data.errors[0].message
    )) {
      const error = new RequestError(response.data.errors[0].message, 500, {
        request: options,
        response
      });
      return errorRequest(state, octokit2, error, options);
    }
    return response;
  }
  var VERSION5 = "6.0.1";
  function retry(octokit2, octokitOptions) {
    const state = Object.assign(
      {
        enabled: true,
        retryAfterBaseValue: 1e3,
        doNotRetry: [400, 401, 403, 404, 422, 451],
        retries: 3
      },
      octokitOptions.retry
    );
    if (state.enabled) {
      octokit2.hook.error("request", errorRequest.bind(null, state, octokit2));
      octokit2.hook.wrap("request", wrapRequest.bind(null, state, octokit2));
    }
    return {
      retry: {
        retryRequest: (error, retries, retryAfter) => {
          error.request.request = Object.assign({}, error.request.request, {
            retries,
            retryAfter
          });
          return error;
        }
      }
    };
  }
  retry.VERSION = VERSION5;

  // node_modules/@octokit/plugin-throttling/dist-web/index.js
  var import_light2 = __toESM(require_light());
  var VERSION6 = "8.1.3";
  var noop = () => Promise.resolve();
  function wrapRequest2(state, request2, options) {
    return state.retryLimiter.schedule(doRequest, state, request2, options);
  }
  async function doRequest(state, request2, options) {
    const isWrite = options.method !== "GET" && options.method !== "HEAD";
    const { pathname } = new URL(options.url, "http://github.test");
    const isSearch = options.method === "GET" && pathname.startsWith("/search/");
    const isGraphQL = pathname.startsWith("/graphql");
    const retryCount = ~~request2.retryCount;
    const jobOptions = retryCount > 0 ? { priority: 0, weight: 0 } : {};
    if (state.clustering) {
      jobOptions.expiration = 1e3 * 60;
    }
    if (isWrite || isGraphQL) {
      await state.write.key(state.id).schedule(jobOptions, noop);
    }
    if (isWrite && state.triggersNotification(pathname)) {
      await state.notifications.key(state.id).schedule(jobOptions, noop);
    }
    if (isSearch) {
      await state.search.key(state.id).schedule(jobOptions, noop);
    }
    const req = state.global.key(state.id).schedule(
      jobOptions,
      request2,
      options
    );
    if (isGraphQL) {
      const res = await req;
      if (res.data.errors != null && res.data.errors.some((error) => error.type === "RATE_LIMITED")) {
        const error = Object.assign(new Error("GraphQL Rate Limit Exceeded"), {
          response: res,
          data: res.data
        });
        throw error;
      }
    }
    return req;
  }
  var triggers_notification_paths_default = [
    "/orgs/{org}/invitations",
    "/orgs/{org}/invitations/{invitation_id}",
    "/orgs/{org}/teams/{team_slug}/discussions",
    "/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
    "/repos/{owner}/{repo}/collaborators/{username}",
    "/repos/{owner}/{repo}/commits/{commit_sha}/comments",
    "/repos/{owner}/{repo}/issues",
    "/repos/{owner}/{repo}/issues/{issue_number}/comments",
    "/repos/{owner}/{repo}/pulls",
    "/repos/{owner}/{repo}/pulls/{pull_number}/comments",
    "/repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
    "/repos/{owner}/{repo}/pulls/{pull_number}/merge",
    "/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
    "/repos/{owner}/{repo}/pulls/{pull_number}/reviews",
    "/repos/{owner}/{repo}/releases",
    "/teams/{team_id}/discussions",
    "/teams/{team_id}/discussions/{discussion_number}/comments"
  ];
  function routeMatcher(paths) {
    const regexes = paths.map(
      (path) => path.split("/").map((c3) => c3.startsWith("{") ? "(?:.+?)" : c3).join("/")
    );
    const regex2 = `^(?:${regexes.map((r3) => `(?:${r3})`).join("|")})[^/]*$`;
    return new RegExp(regex2, "i");
  }
  var regex = routeMatcher(triggers_notification_paths_default);
  var triggersNotification = regex.test.bind(regex);
  var groups = {};
  var createGroups = function(Bottleneck2, common) {
    groups.global = new Bottleneck2.Group({
      id: "octokit-global",
      maxConcurrent: 10,
      ...common
    });
    groups.search = new Bottleneck2.Group({
      id: "octokit-search",
      maxConcurrent: 1,
      minTime: 2e3,
      ...common
    });
    groups.write = new Bottleneck2.Group({
      id: "octokit-write",
      maxConcurrent: 1,
      minTime: 1e3,
      ...common
    });
    groups.notifications = new Bottleneck2.Group({
      id: "octokit-notifications",
      maxConcurrent: 1,
      minTime: 3e3,
      ...common
    });
  };
  function throttling(octokit2, octokitOptions) {
    const {
      enabled = true,
      Bottleneck: Bottleneck2 = import_light2.default,
      id = "no-id",
      timeout = 1e3 * 60 * 2,
      // Redis TTL: 2 minutes
      connection
    } = octokitOptions.throttle || {};
    if (!enabled) {
      return {};
    }
    const common = { connection, timeout };
    if (groups.global == null) {
      createGroups(Bottleneck2, common);
    }
    const state = Object.assign(
      {
        clustering: connection != null,
        triggersNotification,
        fallbackSecondaryRateRetryAfter: 60,
        retryAfterBaseValue: 1e3,
        retryLimiter: new Bottleneck2(),
        id,
        ...groups
      },
      octokitOptions.throttle
    );
    if (typeof state.onSecondaryRateLimit !== "function" || typeof state.onRateLimit !== "function") {
      throw new Error(`octokit/plugin-throttling error:
        You must pass the onSecondaryRateLimit and onRateLimit error handlers.
        See https://octokit.github.io/rest.js/#throttling

        const octokit = new Octokit({
          throttle: {
            onSecondaryRateLimit: (retryAfter, options) => {/* ... */},
            onRateLimit: (retryAfter, options) => {/* ... */}
          }
        })
    `);
    }
    const events = {};
    const emitter = new Bottleneck2.Events(events);
    events.on("secondary-limit", state.onSecondaryRateLimit);
    events.on("rate-limit", state.onRateLimit);
    events.on(
      "error",
      (e3) => octokit2.log.warn("Error in throttling-plugin limit handler", e3)
    );
    state.retryLimiter.on("failed", async function(error, info) {
      const [state2, request2, options] = info.args;
      const { pathname } = new URL(options.url, "http://github.test");
      const shouldRetryGraphQL = pathname.startsWith("/graphql") && error.status !== 401;
      if (!(shouldRetryGraphQL || error.status === 403)) {
        return;
      }
      const retryCount = ~~request2.retryCount;
      request2.retryCount = retryCount;
      options.request.retryCount = retryCount;
      const { wantRetry, retryAfter = 0 } = await async function() {
        if (/\bsecondary rate\b/i.test(error.message)) {
          const retryAfter2 = Number(error.response.headers["retry-after"]) || state2.fallbackSecondaryRateRetryAfter;
          const wantRetry2 = await emitter.trigger(
            "secondary-limit",
            retryAfter2,
            options,
            octokit2,
            retryCount
          );
          return { wantRetry: wantRetry2, retryAfter: retryAfter2 };
        }
        if (error.response.headers != null && error.response.headers["x-ratelimit-remaining"] === "0" || (error.response.data?.errors ?? []).some(
          (error2) => error2.type === "RATE_LIMITED"
        )) {
          const rateLimitReset = new Date(
            ~~error.response.headers["x-ratelimit-reset"] * 1e3
          ).getTime();
          const retryAfter2 = Math.max(
            // Add one second so we retry _after_ the reset time
            // https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#exceeding-the-rate-limit
            Math.ceil((rateLimitReset - Date.now()) / 1e3) + 1,
            0
          );
          const wantRetry2 = await emitter.trigger(
            "rate-limit",
            retryAfter2,
            options,
            octokit2,
            retryCount
          );
          return { wantRetry: wantRetry2, retryAfter: retryAfter2 };
        }
        return {};
      }();
      if (wantRetry) {
        request2.retryCount++;
        return retryAfter * state2.retryAfterBaseValue;
      }
    });
    octokit2.hook.wrap("request", wrapRequest2.bind(null, state));
    return {};
  }
  throttling.VERSION = VERSION6;
  throttling.triggersNotification = triggersNotification;

  // node_modules/@octokit/app/dist-web/index.js
  var import_core = __toESM(require_dist_node4());
  var import_auth_app = __toESM(require_dist_node6());
  var import_oauth_app = __toESM(require_dist_node8());

  // node_modules/@octokit/webhooks/dist-web/index.js
  var import_aggregate_error = __toESM(require_aggregate_error());

  // node_modules/@octokit/webhooks-methods/dist-web/index.js
  var Algorithm = /* @__PURE__ */ ((Algorithm2) => {
    Algorithm2["SHA1"] = "sha1";
    Algorithm2["SHA256"] = "sha256";
    return Algorithm2;
  })(Algorithm || {});
  var getAlgorithm = (signature) => {
    return signature.startsWith("sha256=") ? "sha256" : "sha1";
  };
  var enc = new TextEncoder();
  function hexToUInt8Array(string) {
    const pairs = string.match(/[\dA-F]{2}/gi);
    const integers = pairs.map(function(s3) {
      return parseInt(s3, 16);
    });
    return new Uint8Array(integers);
  }
  function UInt8ArrayToHex(signature) {
    return Array.prototype.map.call(new Uint8Array(signature), (x3) => x3.toString(16).padStart(2, "0")).join("");
  }
  function getHMACHashName(algorithm) {
    return {
      [Algorithm.SHA1]: "SHA-1",
      [Algorithm.SHA256]: "SHA-256"
    }[algorithm];
  }
  async function importKey(secret, algorithm) {
    return crypto.subtle.importKey(
      "raw",
      // raw format of the key - should be Uint8Array
      enc.encode(secret),
      {
        // algorithm details
        name: "HMAC",
        hash: { name: getHMACHashName(algorithm) }
      },
      false,
      // export = false
      ["sign", "verify"]
      // what this key can do
    );
  }
  async function sign(options, payload) {
    const { secret, algorithm } = typeof options === "object" ? {
      secret: options.secret,
      algorithm: options.algorithm || Algorithm.SHA256
    } : { secret: options, algorithm: Algorithm.SHA256 };
    if (!secret || !payload) {
      throw new TypeError(
        "[@octokit/webhooks-methods] secret & payload required for sign()"
      );
    }
    if (!Object.values(Algorithm).includes(algorithm)) {
      throw new TypeError(
        `[@octokit/webhooks] Algorithm ${algorithm} is not supported. Must be  'sha1' or 'sha256'`
      );
    }
    const signature = await crypto.subtle.sign(
      "HMAC",
      await importKey(secret, algorithm),
      enc.encode(payload)
    );
    return `${algorithm}=${UInt8ArrayToHex(signature)}`;
  }
  async function verify(secret, eventPayload, signature) {
    if (!secret || !eventPayload || !signature) {
      throw new TypeError(
        "[@octokit/webhooks-methods] secret, eventPayload & signature required"
      );
    }
    const algorithm = getAlgorithm(signature);
    return await crypto.subtle.verify(
      "HMAC",
      await importKey(secret, algorithm),
      hexToUInt8Array(signature.replace(`${algorithm}=`, "")),
      enc.encode(eventPayload)
    );
  }

  // node_modules/@octokit/webhooks/dist-web/index.js
  var import_aggregate_error2 = __toESM(require_aggregate_error());
  var import_aggregate_error3 = __toESM(require_aggregate_error());
  var createLogger = (logger) => ({
    debug: () => {
    },
    info: () => {
    },
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    ...logger
  });
  var emitterEventNames = [
    "branch_protection_rule",
    "branch_protection_rule.created",
    "branch_protection_rule.deleted",
    "branch_protection_rule.edited",
    "check_run",
    "check_run.completed",
    "check_run.created",
    "check_run.requested_action",
    "check_run.rerequested",
    "check_suite",
    "check_suite.completed",
    "check_suite.requested",
    "check_suite.rerequested",
    "code_scanning_alert",
    "code_scanning_alert.appeared_in_branch",
    "code_scanning_alert.closed_by_user",
    "code_scanning_alert.created",
    "code_scanning_alert.fixed",
    "code_scanning_alert.reopened",
    "code_scanning_alert.reopened_by_user",
    "commit_comment",
    "commit_comment.created",
    "create",
    "delete",
    "dependabot_alert",
    "dependabot_alert.created",
    "dependabot_alert.dismissed",
    "dependabot_alert.fixed",
    "dependabot_alert.reintroduced",
    "dependabot_alert.reopened",
    "deploy_key",
    "deploy_key.created",
    "deploy_key.deleted",
    "deployment",
    "deployment.created",
    "deployment_protection_rule",
    "deployment_protection_rule.requested",
    "deployment_review",
    "deployment_review.approved",
    "deployment_review.rejected",
    "deployment_review.requested",
    "deployment_status",
    "deployment_status.created",
    "discussion",
    "discussion.answered",
    "discussion.category_changed",
    "discussion.created",
    "discussion.deleted",
    "discussion.edited",
    "discussion.labeled",
    "discussion.locked",
    "discussion.pinned",
    "discussion.transferred",
    "discussion.unanswered",
    "discussion.unlabeled",
    "discussion.unlocked",
    "discussion.unpinned",
    "discussion_comment",
    "discussion_comment.created",
    "discussion_comment.deleted",
    "discussion_comment.edited",
    "fork",
    "github_app_authorization",
    "github_app_authorization.revoked",
    "gollum",
    "installation",
    "installation.created",
    "installation.deleted",
    "installation.new_permissions_accepted",
    "installation.suspend",
    "installation.unsuspend",
    "installation_repositories",
    "installation_repositories.added",
    "installation_repositories.removed",
    "installation_target",
    "installation_target.renamed",
    "issue_comment",
    "issue_comment.created",
    "issue_comment.deleted",
    "issue_comment.edited",
    "issues",
    "issues.assigned",
    "issues.closed",
    "issues.deleted",
    "issues.demilestoned",
    "issues.edited",
    "issues.labeled",
    "issues.locked",
    "issues.milestoned",
    "issues.opened",
    "issues.pinned",
    "issues.reopened",
    "issues.transferred",
    "issues.unassigned",
    "issues.unlabeled",
    "issues.unlocked",
    "issues.unpinned",
    "label",
    "label.created",
    "label.deleted",
    "label.edited",
    "marketplace_purchase",
    "marketplace_purchase.cancelled",
    "marketplace_purchase.changed",
    "marketplace_purchase.pending_change",
    "marketplace_purchase.pending_change_cancelled",
    "marketplace_purchase.purchased",
    "member",
    "member.added",
    "member.edited",
    "member.removed",
    "membership",
    "membership.added",
    "membership.removed",
    "merge_group",
    "merge_group.checks_requested",
    "meta",
    "meta.deleted",
    "milestone",
    "milestone.closed",
    "milestone.created",
    "milestone.deleted",
    "milestone.edited",
    "milestone.opened",
    "org_block",
    "org_block.blocked",
    "org_block.unblocked",
    "organization",
    "organization.deleted",
    "organization.member_added",
    "organization.member_invited",
    "organization.member_removed",
    "organization.renamed",
    "package",
    "package.published",
    "package.updated",
    "page_build",
    "ping",
    "project",
    "project.closed",
    "project.created",
    "project.deleted",
    "project.edited",
    "project.reopened",
    "project_card",
    "project_card.converted",
    "project_card.created",
    "project_card.deleted",
    "project_card.edited",
    "project_card.moved",
    "project_column",
    "project_column.created",
    "project_column.deleted",
    "project_column.edited",
    "project_column.moved",
    "projects_v2_item",
    "projects_v2_item.archived",
    "projects_v2_item.converted",
    "projects_v2_item.created",
    "projects_v2_item.deleted",
    "projects_v2_item.edited",
    "projects_v2_item.reordered",
    "projects_v2_item.restored",
    "public",
    "pull_request",
    "pull_request.assigned",
    "pull_request.auto_merge_disabled",
    "pull_request.auto_merge_enabled",
    "pull_request.closed",
    "pull_request.converted_to_draft",
    "pull_request.demilestoned",
    "pull_request.dequeued",
    "pull_request.edited",
    "pull_request.enqueued",
    "pull_request.labeled",
    "pull_request.locked",
    "pull_request.milestoned",
    "pull_request.opened",
    "pull_request.ready_for_review",
    "pull_request.reopened",
    "pull_request.review_request_removed",
    "pull_request.review_requested",
    "pull_request.synchronize",
    "pull_request.unassigned",
    "pull_request.unlabeled",
    "pull_request.unlocked",
    "pull_request_review",
    "pull_request_review.dismissed",
    "pull_request_review.edited",
    "pull_request_review.submitted",
    "pull_request_review_comment",
    "pull_request_review_comment.created",
    "pull_request_review_comment.deleted",
    "pull_request_review_comment.edited",
    "pull_request_review_thread",
    "pull_request_review_thread.resolved",
    "pull_request_review_thread.unresolved",
    "push",
    "registry_package",
    "registry_package.published",
    "registry_package.updated",
    "release",
    "release.created",
    "release.deleted",
    "release.edited",
    "release.prereleased",
    "release.published",
    "release.released",
    "release.unpublished",
    "repository",
    "repository.archived",
    "repository.created",
    "repository.deleted",
    "repository.edited",
    "repository.privatized",
    "repository.publicized",
    "repository.renamed",
    "repository.transferred",
    "repository.unarchived",
    "repository_dispatch",
    "repository_import",
    "repository_vulnerability_alert",
    "repository_vulnerability_alert.create",
    "repository_vulnerability_alert.dismiss",
    "repository_vulnerability_alert.reopen",
    "repository_vulnerability_alert.resolve",
    "secret_scanning_alert",
    "secret_scanning_alert.created",
    "secret_scanning_alert.reopened",
    "secret_scanning_alert.resolved",
    "secret_scanning_alert.revoked",
    "secret_scanning_alert_location",
    "secret_scanning_alert_location.created",
    "security_advisory",
    "security_advisory.performed",
    "security_advisory.published",
    "security_advisory.updated",
    "security_advisory.withdrawn",
    "sponsorship",
    "sponsorship.cancelled",
    "sponsorship.created",
    "sponsorship.edited",
    "sponsorship.pending_cancellation",
    "sponsorship.pending_tier_change",
    "sponsorship.tier_changed",
    "star",
    "star.created",
    "star.deleted",
    "status",
    "team",
    "team.added_to_repository",
    "team.created",
    "team.deleted",
    "team.edited",
    "team.removed_from_repository",
    "team_add",
    "watch",
    "watch.started",
    "workflow_dispatch",
    "workflow_job",
    "workflow_job.completed",
    "workflow_job.in_progress",
    "workflow_job.queued",
    "workflow_job.waiting",
    "workflow_run",
    "workflow_run.completed",
    "workflow_run.in_progress",
    "workflow_run.requested"
  ];
  function handleEventHandlers(state, webhookName, handler2) {
    if (!state.hooks[webhookName]) {
      state.hooks[webhookName] = [];
    }
    state.hooks[webhookName].push(handler2);
  }
  function receiverOn(state, webhookNameOrNames, handler2) {
    if (Array.isArray(webhookNameOrNames)) {
      webhookNameOrNames.forEach(
        (webhookName) => receiverOn(state, webhookName, handler2)
      );
      return;
    }
    if (["*", "error"].includes(webhookNameOrNames)) {
      const webhookName = webhookNameOrNames === "*" ? "any" : webhookNameOrNames;
      const message = `Using the "${webhookNameOrNames}" event with the regular Webhooks.on() function is not supported. Please use the Webhooks.on${webhookName.charAt(0).toUpperCase() + webhookName.slice(1)}() method instead`;
      throw new Error(message);
    }
    if (!emitterEventNames.includes(webhookNameOrNames)) {
      state.log.warn(
        `"${webhookNameOrNames}" is not a known webhook name (https://developer.github.com/v3/activity/events/types/)`
      );
    }
    handleEventHandlers(state, webhookNameOrNames, handler2);
  }
  function receiverOnAny(state, handler2) {
    handleEventHandlers(state, "*", handler2);
  }
  function receiverOnError(state, handler2) {
    handleEventHandlers(state, "error", handler2);
  }
  function wrapErrorHandler(handler2, error) {
    let returnValue;
    try {
      returnValue = handler2(error);
    } catch (error2) {
      console.log('FATAL: Error occurred in "error" event handler');
      console.log(error2);
    }
    if (returnValue && returnValue.catch) {
      returnValue.catch((error2) => {
        console.log('FATAL: Error occurred in "error" event handler');
        console.log(error2);
      });
    }
  }
  function getHooks(state, eventPayloadAction, eventName) {
    const hooks = [state.hooks[eventName], state.hooks["*"]];
    if (eventPayloadAction) {
      hooks.unshift(state.hooks[`${eventName}.${eventPayloadAction}`]);
    }
    return [].concat(...hooks.filter(Boolean));
  }
  function receiverHandle(state, event) {
    const errorHandlers = state.hooks.error || [];
    if (event instanceof Error) {
      const error = Object.assign(new import_aggregate_error.default([event]), {
        event,
        errors: [event]
      });
      errorHandlers.forEach((handler2) => wrapErrorHandler(handler2, error));
      return Promise.reject(error);
    }
    if (!event || !event.name) {
      throw new import_aggregate_error.default(["Event name not passed"]);
    }
    if (!event.payload) {
      throw new import_aggregate_error.default(["Event payload not passed"]);
    }
    const hooks = getHooks(
      state,
      "action" in event.payload ? event.payload.action : null,
      event.name
    );
    if (hooks.length === 0) {
      return Promise.resolve();
    }
    const errors = [];
    const promises = hooks.map((handler2) => {
      let promise = Promise.resolve(event);
      if (state.transform) {
        promise = promise.then(state.transform);
      }
      return promise.then((event2) => {
        return handler2(event2);
      }).catch((error) => errors.push(Object.assign(error, { event })));
    });
    return Promise.all(promises).then(() => {
      if (errors.length === 0) {
        return;
      }
      const error = new import_aggregate_error.default(errors);
      Object.assign(error, {
        event,
        errors
      });
      errorHandlers.forEach((handler2) => wrapErrorHandler(handler2, error));
      throw error;
    });
  }
  function removeListener(state, webhookNameOrNames, handler2) {
    if (Array.isArray(webhookNameOrNames)) {
      webhookNameOrNames.forEach(
        (webhookName) => removeListener(state, webhookName, handler2)
      );
      return;
    }
    if (!state.hooks[webhookNameOrNames]) {
      return;
    }
    for (let i4 = state.hooks[webhookNameOrNames].length - 1; i4 >= 0; i4--) {
      if (state.hooks[webhookNameOrNames][i4] === handler2) {
        state.hooks[webhookNameOrNames].splice(i4, 1);
        return;
      }
    }
  }
  function createEventHandler(options) {
    const state = {
      hooks: {},
      log: createLogger(options && options.log)
    };
    if (options && options.transform) {
      state.transform = options.transform;
    }
    return {
      on: receiverOn.bind(null, state),
      onAny: receiverOnAny.bind(null, state),
      onError: receiverOnError.bind(null, state),
      removeListener: removeListener.bind(null, state),
      receive: receiverHandle.bind(null, state)
    };
  }
  async function verifyAndReceive(state, event) {
    const matchesSignature = await verify(
      state.secret,
      event.payload,
      event.signature
    ).catch(() => false);
    if (!matchesSignature) {
      const error = new Error(
        "[@octokit/webhooks] signature does not match event payload and secret"
      );
      return state.eventHandler.receive(
        Object.assign(error, { event, status: 400 })
      );
    }
    let payload;
    try {
      payload = JSON.parse(event.payload);
    } catch (error) {
      error.message = "Invalid JSON";
      error.status = 400;
      throw new import_aggregate_error2.default([error]);
    }
    return state.eventHandler.receive({
      id: event.id,
      name: event.name,
      payload
    });
  }
  var Webhooks = class {
    constructor(options) {
      if (!options || !options.secret) {
        throw new Error("[@octokit/webhooks] options.secret required");
      }
      const state = {
        eventHandler: createEventHandler(options),
        secret: options.secret,
        hooks: {},
        log: createLogger(options.log)
      };
      this.sign = sign.bind(null, options.secret);
      this.verify = verify.bind(null, options.secret);
      this.on = state.eventHandler.on;
      this.onAny = state.eventHandler.onAny;
      this.onError = state.eventHandler.onError;
      this.removeListener = state.eventHandler.removeListener;
      this.receive = state.eventHandler.receive;
      this.verifyAndReceive = verifyAndReceive.bind(null, state);
    }
  };

  // node_modules/@octokit/app/dist-web/index.js
  var import_auth_app2 = __toESM(require_dist_node6());
  var import_auth_unauthenticated = __toESM(require_dist_node7());
  var import_auth_app3 = __toESM(require_dist_node6());
  var VERSION10 = "14.0.2";
  function webhooks(appOctokit, options) {
    return new Webhooks({
      secret: options.secret,
      transform: async (event) => {
        if (!("installation" in event.payload) || typeof event.payload.installation !== "object") {
          const octokit22 = new appOctokit.constructor({
            authStrategy: import_auth_unauthenticated.createUnauthenticatedAuth,
            auth: {
              reason: `"installation" key missing in webhook event payload`
            }
          });
          return {
            ...event,
            octokit: octokit22
          };
        }
        const installationId = event.payload.installation.id;
        const octokit2 = await appOctokit.auth({
          type: "installation",
          installationId,
          factory(auth6) {
            return new auth6.octokit.constructor({
              ...auth6.octokitOptions,
              authStrategy: import_auth_app2.createAppAuth,
              ...{
                auth: {
                  ...auth6,
                  installationId
                }
              }
            });
          }
        });
        octokit2.hook.before("request", (options2) => {
          options2.headers["x-github-delivery"] = event.id;
        });
        return {
          ...event,
          octokit: octokit2
        };
      }
    });
  }
  async function getInstallationOctokit(app, installationId) {
    return app.octokit.auth({
      type: "installation",
      installationId,
      factory(auth6) {
        const options = {
          ...auth6.octokitOptions,
          authStrategy: import_auth_app3.createAppAuth,
          ...{ auth: { ...auth6, installationId } }
        };
        return new auth6.octokit.constructor(options);
      }
    });
  }
  function eachInstallationFactory(app) {
    return Object.assign(eachInstallation.bind(null, app), {
      iterator: eachInstallationIterator.bind(null, app)
    });
  }
  async function eachInstallation(app, callback) {
    const i4 = eachInstallationIterator(app)[Symbol.asyncIterator]();
    let result = await i4.next();
    while (!result.done) {
      await callback(result.value);
      result = await i4.next();
    }
  }
  function eachInstallationIterator(app) {
    return {
      async *[Symbol.asyncIterator]() {
        const iterator2 = composePaginateRest.iterator(
          app.octokit,
          "GET /app/installations"
        );
        for await (const { data: installations } of iterator2) {
          for (const installation of installations) {
            const installationOctokit = await getInstallationOctokit(
              app,
              installation.id
            );
            yield { octokit: installationOctokit, installation };
          }
        }
      }
    };
  }
  function eachRepositoryFactory(app) {
    return Object.assign(eachRepository.bind(null, app), {
      iterator: eachRepositoryIterator.bind(null, app)
    });
  }
  async function eachRepository(app, queryOrCallback, callback) {
    const i4 = eachRepositoryIterator(
      app,
      callback ? queryOrCallback : void 0
    )[Symbol.asyncIterator]();
    let result = await i4.next();
    while (!result.done) {
      if (callback) {
        await callback(result.value);
      } else {
        await queryOrCallback(result.value);
      }
      result = await i4.next();
    }
  }
  function singleInstallationIterator(app, installationId) {
    return {
      async *[Symbol.asyncIterator]() {
        yield {
          octokit: await app.getInstallationOctokit(installationId)
        };
      }
    };
  }
  function eachRepositoryIterator(app, query) {
    return {
      async *[Symbol.asyncIterator]() {
        const iterator2 = query ? singleInstallationIterator(app, query.installationId) : app.eachInstallation.iterator();
        for await (const { octokit: octokit2 } of iterator2) {
          const repositoriesIterator = composePaginateRest.iterator(
            octokit2,
            "GET /installation/repositories"
          );
          for await (const { data: repositories } of repositoriesIterator) {
            for (const repository of repositories) {
              yield { octokit: octokit2, repository };
            }
          }
        }
      }
    };
  }
  var App = class {
    static {
      this.VERSION = VERSION10;
    }
    static defaults(defaults) {
      const AppWithDefaults = class extends this {
        constructor(...args) {
          super({
            ...defaults,
            ...args[0]
          });
        }
      };
      return AppWithDefaults;
    }
    constructor(options) {
      const Octokit5 = options.Octokit || import_core.Octokit;
      const authOptions = Object.assign(
        {
          appId: options.appId,
          privateKey: options.privateKey
        },
        options.oauth ? {
          clientId: options.oauth.clientId,
          clientSecret: options.oauth.clientSecret
        } : {}
      );
      this.octokit = new Octokit5({
        authStrategy: import_auth_app.createAppAuth,
        auth: authOptions,
        log: options.log
      });
      this.log = Object.assign(
        {
          debug: () => {
          },
          info: () => {
          },
          warn: console.warn.bind(console),
          error: console.error.bind(console)
        },
        options.log
      );
      if (options.webhooks) {
        this.webhooks = webhooks(this.octokit, options.webhooks);
      } else {
        Object.defineProperty(this, "webhooks", {
          get() {
            throw new Error("[@octokit/app] webhooks option not set");
          }
        });
      }
      if (options.oauth) {
        this.oauth = new import_oauth_app.OAuthApp({
          ...options.oauth,
          clientType: "github-app",
          Octokit: Octokit5
        });
      } else {
        Object.defineProperty(this, "oauth", {
          get() {
            throw new Error(
              "[@octokit/app] oauth.clientId / oauth.clientSecret options are not set"
            );
          }
        });
      }
      this.getInstallationOctokit = getInstallationOctokit.bind(
        null,
        this
      );
      this.eachInstallation = eachInstallationFactory(
        this
      );
      this.eachRepository = eachRepositoryFactory(
        this
      );
    }
  };

  // node_modules/octokit/dist-web/index.js
  var import_oauth_app2 = __toESM(require_dist_node8());
  var VERSION11 = "3.1.2";
  var Octokit = import_core2.Octokit.plugin(
    restEndpointMethods,
    paginateRest,
    paginateGraphql,
    retry,
    throttling
  ).defaults({
    userAgent: `octokit.js/${VERSION11}`,
    throttle: {
      onRateLimit,
      onSecondaryRateLimit
    }
  });
  function onRateLimit(retryAfter, options, octokit2) {
    octokit2.log.warn(
      `Request quota exhausted for request ${options.method} ${options.url}`
    );
    if (options.request.retryCount === 0) {
      octokit2.log.info(`Retrying after ${retryAfter} seconds!`);
      return true;
    }
  }
  function onSecondaryRateLimit(retryAfter, options, octokit2) {
    octokit2.log.warn(
      `SecondaryRateLimit detected for request ${options.method} ${options.url}`
    );
    if (options.request.retryCount === 0) {
      octokit2.log.info(`Retrying after ${retryAfter} seconds!`);
      return true;
    }
  }
  var App2 = App.defaults({ Octokit });
  var OAuthApp2 = import_oauth_app2.OAuthApp.defaults({ Octokit });

  // node_modules/preact/dist/preact.module.js
  var n2;
  var l;
  var u2;
  var t2;
  var i2;
  var o2;
  var r2;
  var f;
  var e2;
  var c = {};
  var s = [];
  var a2 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  var h = Array.isArray;
  function v(n4, l3) {
    for (var u4 in l3)
      n4[u4] = l3[u4];
    return n4;
  }
  function p(n4) {
    var l3 = n4.parentNode;
    l3 && l3.removeChild(n4);
  }
  function y(l3, u4, t3) {
    var i4, o4, r3, f3 = {};
    for (r3 in u4)
      "key" == r3 ? i4 = u4[r3] : "ref" == r3 ? o4 = u4[r3] : f3[r3] = u4[r3];
    if (arguments.length > 2 && (f3.children = arguments.length > 3 ? n2.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps)
      for (r3 in l3.defaultProps)
        void 0 === f3[r3] && (f3[r3] = l3.defaultProps[r3]);
    return d(l3, f3, i4, o4, null);
  }
  function d(n4, t3, i4, o4, r3) {
    var f3 = { type: n4, props: t3, key: i4, ref: o4, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == r3 ? ++u2 : r3, __i: -1, __u: 0 };
    return null == r3 && null != l.vnode && l.vnode(f3), f3;
  }
  function g(n4) {
    return n4.children;
  }
  function b(n4, l3) {
    this.props = n4, this.context = l3;
  }
  function m(n4, l3) {
    if (null == l3)
      return n4.__ ? m(n4.__, n4.__i + 1) : null;
    for (var u4; l3 < n4.__k.length; l3++)
      if (null != (u4 = n4.__k[l3]) && null != u4.__e)
        return u4.__e;
    return "function" == typeof n4.type ? m(n4) : null;
  }
  function w(n4, u4, t3) {
    var i4, o4 = n4.__v, r3 = o4.__e, f3 = n4.__P;
    if (f3)
      return (i4 = v({}, o4)).__v = o4.__v + 1, l.vnode && l.vnode(i4), M(f3, i4, o4, n4.__n, void 0 !== f3.ownerSVGElement, 32 & o4.__u ? [r3] : null, u4, null == r3 ? m(o4) : r3, !!(32 & o4.__u), t3), i4.__.__k[i4.__i] = i4, i4.__d = void 0, i4.__e != r3 && k(i4), i4;
  }
  function k(n4) {
    var l3, u4;
    if (null != (n4 = n4.__) && null != n4.__c) {
      for (n4.__e = n4.__c.base = null, l3 = 0; l3 < n4.__k.length; l3++)
        if (null != (u4 = n4.__k[l3]) && null != u4.__e) {
          n4.__e = n4.__c.base = u4.__e;
          break;
        }
      return k(n4);
    }
  }
  function x(n4) {
    (!n4.__d && (n4.__d = true) && i2.push(n4) && !C.__r++ || o2 !== l.debounceRendering) && ((o2 = l.debounceRendering) || r2)(C);
  }
  function C() {
    var n4, u4, t3, o4 = [], r3 = [];
    for (i2.sort(f); n4 = i2.shift(); )
      n4.__d && (t3 = i2.length, u4 = w(n4, o4, r3) || u4, 0 === t3 || i2.length > t3 ? (j(o4, u4, r3), r3.length = o4.length = 0, u4 = void 0, i2.sort(f)) : u4 && l.__c && l.__c(u4, s));
    u4 && j(o4, u4, r3), C.__r = 0;
  }
  function P(n4, l3, u4, t3, i4, o4, r3, f3, e3, a4, h3) {
    var v3, p3, y3, d3, _2, g3 = t3 && t3.__k || s, b3 = l3.length;
    for (u4.__d = e3, S(u4, l3, g3), e3 = u4.__d, v3 = 0; v3 < b3; v3++)
      null != (y3 = u4.__k[v3]) && "boolean" != typeof y3 && "function" != typeof y3 && (p3 = -1 === y3.__i ? c : g3[y3.__i] || c, y3.__i = v3, M(n4, y3, p3, i4, o4, r3, f3, e3, a4, h3), d3 = y3.__e, y3.ref && p3.ref != y3.ref && (p3.ref && N(p3.ref, null, y3), h3.push(y3.ref, y3.__c || d3, y3)), null == _2 && null != d3 && (_2 = d3), 65536 & y3.__u || p3.__k === y3.__k ? e3 = $(y3, e3, n4) : "function" == typeof y3.type && void 0 !== y3.__d ? e3 = y3.__d : d3 && (e3 = d3.nextSibling), y3.__d = void 0, y3.__u &= -196609);
    u4.__d = e3, u4.__e = _2;
  }
  function S(n4, l3, u4) {
    var t3, i4, o4, r3, f3, e3 = l3.length, c3 = u4.length, s3 = c3, a4 = 0;
    for (n4.__k = [], t3 = 0; t3 < e3; t3++)
      null != (i4 = n4.__k[t3] = null == (i4 = l3[t3]) || "boolean" == typeof i4 || "function" == typeof i4 ? null : "string" == typeof i4 || "number" == typeof i4 || "bigint" == typeof i4 || i4.constructor == String ? d(null, i4, null, null, i4) : h(i4) ? d(g, { children: i4 }, null, null, null) : void 0 === i4.constructor && i4.__b > 0 ? d(i4.type, i4.props, i4.key, i4.ref ? i4.ref : null, i4.__v) : i4) ? (i4.__ = n4, i4.__b = n4.__b + 1, f3 = I(i4, u4, r3 = t3 + a4, s3), i4.__i = f3, o4 = null, -1 !== f3 && (s3--, (o4 = u4[f3]) && (o4.__u |= 131072)), null == o4 || null === o4.__v ? (-1 == f3 && a4--, "function" != typeof i4.type && (i4.__u |= 65536)) : f3 !== r3 && (f3 === r3 + 1 ? a4++ : f3 > r3 ? s3 > e3 - r3 ? a4 += f3 - r3 : a4-- : a4 = f3 < r3 && f3 == r3 - 1 ? f3 - r3 : 0, f3 !== t3 + a4 && (i4.__u |= 65536))) : (o4 = u4[t3]) && null == o4.key && o4.__e && (o4.__e == n4.__d && (n4.__d = m(o4)), O(o4, o4, false), u4[t3] = null, s3--);
    if (s3)
      for (t3 = 0; t3 < c3; t3++)
        null != (o4 = u4[t3]) && 0 == (131072 & o4.__u) && (o4.__e == n4.__d && (n4.__d = m(o4)), O(o4, o4));
  }
  function $(n4, l3, u4) {
    var t3, i4;
    if ("function" == typeof n4.type) {
      for (t3 = n4.__k, i4 = 0; t3 && i4 < t3.length; i4++)
        t3[i4] && (t3[i4].__ = n4, l3 = $(t3[i4], l3, u4));
      return l3;
    }
    n4.__e != l3 && (u4.insertBefore(n4.__e, l3 || null), l3 = n4.__e);
    do {
      l3 = l3 && l3.nextSibling;
    } while (null != l3 && 8 === l3.nodeType);
    return l3;
  }
  function I(n4, l3, u4, t3) {
    var i4 = n4.key, o4 = n4.type, r3 = u4 - 1, f3 = u4 + 1, e3 = l3[u4];
    if (null === e3 || e3 && i4 == e3.key && o4 === e3.type)
      return u4;
    if (t3 > (null != e3 && 0 == (131072 & e3.__u) ? 1 : 0))
      for (; r3 >= 0 || f3 < l3.length; ) {
        if (r3 >= 0) {
          if ((e3 = l3[r3]) && 0 == (131072 & e3.__u) && i4 == e3.key && o4 === e3.type)
            return r3;
          r3--;
        }
        if (f3 < l3.length) {
          if ((e3 = l3[f3]) && 0 == (131072 & e3.__u) && i4 == e3.key && o4 === e3.type)
            return f3;
          f3++;
        }
      }
    return -1;
  }
  function T(n4, l3, u4) {
    "-" === l3[0] ? n4.setProperty(l3, null == u4 ? "" : u4) : n4[l3] = null == u4 ? "" : "number" != typeof u4 || a2.test(l3) ? u4 : u4 + "px";
  }
  function A(n4, l3, u4, t3, i4) {
    var o4;
    n:
      if ("style" === l3)
        if ("string" == typeof u4)
          n4.style.cssText = u4;
        else {
          if ("string" == typeof t3 && (n4.style.cssText = t3 = ""), t3)
            for (l3 in t3)
              u4 && l3 in u4 || T(n4.style, l3, "");
          if (u4)
            for (l3 in u4)
              t3 && u4[l3] === t3[l3] || T(n4.style, l3, u4[l3]);
        }
      else if ("o" === l3[0] && "n" === l3[1])
        o4 = l3 !== (l3 = l3.replace(/(PointerCapture)$|Capture$/i, "$1")), l3 = l3.toLowerCase() in n4 ? l3.toLowerCase().slice(2) : l3.slice(2), n4.l || (n4.l = {}), n4.l[l3 + o4] = u4, u4 ? t3 ? u4.u = t3.u : (u4.u = Date.now(), n4.addEventListener(l3, o4 ? L : D, o4)) : n4.removeEventListener(l3, o4 ? L : D, o4);
      else {
        if (i4)
          l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if ("width" !== l3 && "height" !== l3 && "href" !== l3 && "list" !== l3 && "form" !== l3 && "tabIndex" !== l3 && "download" !== l3 && "rowSpan" !== l3 && "colSpan" !== l3 && "role" !== l3 && l3 in n4)
          try {
            n4[l3] = null == u4 ? "" : u4;
            break n;
          } catch (n5) {
          }
        "function" == typeof u4 || (null == u4 || false === u4 && "-" !== l3[4] ? n4.removeAttribute(l3) : n4.setAttribute(l3, u4));
      }
  }
  function D(n4) {
    if (this.l) {
      var u4 = this.l[n4.type + false];
      if (n4.t) {
        if (n4.t <= u4.u)
          return;
      } else
        n4.t = Date.now();
      return u4(l.event ? l.event(n4) : n4);
    }
  }
  function L(n4) {
    if (this.l)
      return this.l[n4.type + true](l.event ? l.event(n4) : n4);
  }
  function M(n4, u4, t3, i4, o4, r3, f3, e3, c3, s3) {
    var a4, p3, y3, d3, _2, m3, w3, k3, x3, C3, S3, $2, H, I2, T2, A2 = u4.type;
    if (void 0 !== u4.constructor)
      return null;
    128 & t3.__u && (c3 = !!(32 & t3.__u), r3 = [e3 = u4.__e = t3.__e]), (a4 = l.__b) && a4(u4);
    n:
      if ("function" == typeof A2)
        try {
          if (k3 = u4.props, x3 = (a4 = A2.contextType) && i4[a4.__c], C3 = a4 ? x3 ? x3.props.value : a4.__ : i4, t3.__c ? w3 = (p3 = u4.__c = t3.__c).__ = p3.__E : ("prototype" in A2 && A2.prototype.render ? u4.__c = p3 = new A2(k3, C3) : (u4.__c = p3 = new b(k3, C3), p3.constructor = A2, p3.render = q), x3 && x3.sub(p3), p3.props = k3, p3.state || (p3.state = {}), p3.context = C3, p3.__n = i4, y3 = p3.__d = true, p3.__h = [], p3._sb = []), null == p3.__s && (p3.__s = p3.state), null != A2.getDerivedStateFromProps && (p3.__s == p3.state && (p3.__s = v({}, p3.__s)), v(p3.__s, A2.getDerivedStateFromProps(k3, p3.__s))), d3 = p3.props, _2 = p3.state, p3.__v = u4, y3)
            null == A2.getDerivedStateFromProps && null != p3.componentWillMount && p3.componentWillMount(), null != p3.componentDidMount && p3.__h.push(p3.componentDidMount);
          else {
            if (null == A2.getDerivedStateFromProps && k3 !== d3 && null != p3.componentWillReceiveProps && p3.componentWillReceiveProps(k3, C3), !p3.__e && (null != p3.shouldComponentUpdate && false === p3.shouldComponentUpdate(k3, p3.__s, C3) || u4.__v === t3.__v)) {
              for (u4.__v !== t3.__v && (p3.props = k3, p3.state = p3.__s, p3.__d = false), u4.__e = t3.__e, u4.__k = t3.__k, u4.__k.forEach(function(n5) {
                n5 && (n5.__ = u4);
              }), S3 = 0; S3 < p3._sb.length; S3++)
                p3.__h.push(p3._sb[S3]);
              p3._sb = [], p3.__h.length && f3.push(p3);
              break n;
            }
            null != p3.componentWillUpdate && p3.componentWillUpdate(k3, p3.__s, C3), null != p3.componentDidUpdate && p3.__h.push(function() {
              p3.componentDidUpdate(d3, _2, m3);
            });
          }
          if (p3.context = C3, p3.props = k3, p3.__P = n4, p3.__e = false, $2 = l.__r, H = 0, "prototype" in A2 && A2.prototype.render) {
            for (p3.state = p3.__s, p3.__d = false, $2 && $2(u4), a4 = p3.render(p3.props, p3.state, p3.context), I2 = 0; I2 < p3._sb.length; I2++)
              p3.__h.push(p3._sb[I2]);
            p3._sb = [];
          } else
            do {
              p3.__d = false, $2 && $2(u4), a4 = p3.render(p3.props, p3.state, p3.context), p3.state = p3.__s;
            } while (p3.__d && ++H < 25);
          p3.state = p3.__s, null != p3.getChildContext && (i4 = v(v({}, i4), p3.getChildContext())), y3 || null == p3.getSnapshotBeforeUpdate || (m3 = p3.getSnapshotBeforeUpdate(d3, _2)), P(n4, h(T2 = null != a4 && a4.type === g && null == a4.key ? a4.props.children : a4) ? T2 : [T2], u4, t3, i4, o4, r3, f3, e3, c3, s3), p3.base = u4.__e, u4.__u &= -161, p3.__h.length && f3.push(p3), w3 && (p3.__E = p3.__ = null);
        } catch (n5) {
          u4.__v = null, c3 || null != r3 ? (u4.__e = e3, u4.__u |= c3 ? 160 : 32, r3[r3.indexOf(e3)] = null) : (u4.__e = t3.__e, u4.__k = t3.__k), l.__e(n5, u4, t3);
        }
      else
        null == r3 && u4.__v === t3.__v ? (u4.__k = t3.__k, u4.__e = t3.__e) : u4.__e = z(t3.__e, u4, t3, i4, o4, r3, f3, c3, s3);
    (a4 = l.diffed) && a4(u4);
  }
  function j(n4, u4, t3) {
    for (var i4 = 0; i4 < t3.length; i4++)
      N(t3[i4], t3[++i4], t3[++i4]);
    l.__c && l.__c(u4, n4), n4.some(function(u5) {
      try {
        n4 = u5.__h, u5.__h = [], n4.some(function(n5) {
          n5.call(u5);
        });
      } catch (n5) {
        l.__e(n5, u5.__v);
      }
    });
  }
  function z(l3, u4, t3, i4, o4, r3, f3, e3, s3) {
    var a4, v3, y3, d3, _2, g3, b3, w3 = t3.props, k3 = u4.props, x3 = u4.type;
    if ("svg" === x3 && (o4 = true), null != r3) {
      for (a4 = 0; a4 < r3.length; a4++)
        if ((_2 = r3[a4]) && "setAttribute" in _2 == !!x3 && (x3 ? _2.localName === x3 : 3 === _2.nodeType)) {
          l3 = _2, r3[a4] = null;
          break;
        }
    }
    if (null == l3) {
      if (null === x3)
        return document.createTextNode(k3);
      l3 = o4 ? document.createElementNS("http://www.w3.org/2000/svg", x3) : document.createElement(x3, k3.is && k3), r3 = null, e3 = false;
    }
    if (null === x3)
      w3 === k3 || e3 && l3.data === k3 || (l3.data = k3);
    else {
      if (r3 = r3 && n2.call(l3.childNodes), w3 = t3.props || c, !e3 && null != r3)
        for (w3 = {}, a4 = 0; a4 < l3.attributes.length; a4++)
          w3[(_2 = l3.attributes[a4]).name] = _2.value;
      for (a4 in w3)
        _2 = w3[a4], "children" == a4 || ("dangerouslySetInnerHTML" == a4 ? y3 = _2 : "key" === a4 || a4 in k3 || A(l3, a4, null, _2, o4));
      for (a4 in k3)
        _2 = k3[a4], "children" == a4 ? d3 = _2 : "dangerouslySetInnerHTML" == a4 ? v3 = _2 : "value" == a4 ? g3 = _2 : "checked" == a4 ? b3 = _2 : "key" === a4 || e3 && "function" != typeof _2 || w3[a4] === _2 || A(l3, a4, _2, w3[a4], o4);
      if (v3)
        e3 || y3 && (v3.__html === y3.__html || v3.__html === l3.innerHTML) || (l3.innerHTML = v3.__html), u4.__k = [];
      else if (y3 && (l3.innerHTML = ""), P(l3, h(d3) ? d3 : [d3], u4, t3, i4, o4 && "foreignObject" !== x3, r3, f3, r3 ? r3[0] : t3.__k && m(t3, 0), e3, s3), null != r3)
        for (a4 = r3.length; a4--; )
          null != r3[a4] && p(r3[a4]);
      e3 || (a4 = "value", void 0 !== g3 && (g3 !== l3[a4] || "progress" === x3 && !g3 || "option" === x3 && g3 !== w3[a4]) && A(l3, a4, g3, w3[a4], false), a4 = "checked", void 0 !== b3 && b3 !== l3[a4] && A(l3, a4, b3, w3[a4], false));
    }
    return l3;
  }
  function N(n4, u4, t3) {
    try {
      "function" == typeof n4 ? n4(u4) : n4.current = u4;
    } catch (n5) {
      l.__e(n5, t3);
    }
  }
  function O(n4, u4, t3) {
    var i4, o4;
    if (l.unmount && l.unmount(n4), (i4 = n4.ref) && (i4.current && i4.current !== n4.__e || N(i4, null, u4)), null != (i4 = n4.__c)) {
      if (i4.componentWillUnmount)
        try {
          i4.componentWillUnmount();
        } catch (n5) {
          l.__e(n5, u4);
        }
      i4.base = i4.__P = null, n4.__c = void 0;
    }
    if (i4 = n4.__k)
      for (o4 = 0; o4 < i4.length; o4++)
        i4[o4] && O(i4[o4], u4, t3 || "function" != typeof n4.type);
    t3 || null == n4.__e || p(n4.__e), n4.__ = n4.__e = n4.__d = void 0;
  }
  function q(n4, l3, u4) {
    return this.constructor(n4, u4);
  }
  n2 = s.slice, l = { __e: function(n4, l3, u4, t3) {
    for (var i4, o4, r3; l3 = l3.__; )
      if ((i4 = l3.__c) && !i4.__)
        try {
          if ((o4 = i4.constructor) && null != o4.getDerivedStateFromError && (i4.setState(o4.getDerivedStateFromError(n4)), r3 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n4, t3 || {}), r3 = i4.__d), r3)
            return i4.__E = i4;
        } catch (l4) {
          n4 = l4;
        }
    throw n4;
  } }, u2 = 0, t2 = function(n4) {
    return null != n4 && null == n4.constructor;
  }, b.prototype.setState = function(n4, l3) {
    var u4;
    u4 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = v({}, this.state), "function" == typeof n4 && (n4 = n4(v({}, u4), this.props)), n4 && v(u4, n4), null != n4 && this.__v && (l3 && this._sb.push(l3), x(this));
  }, b.prototype.forceUpdate = function(n4) {
    this.__v && (this.__e = true, n4 && this.__h.push(n4), x(this));
  }, b.prototype.render = g, i2 = [], r2 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f = function(n4, l3) {
    return n4.__v.__b - l3.__v.__b;
  }, C.__r = 0, e2 = 0;

  // node_modules/preact-render-to-string/dist/index.module.js
  var o3 = /[\s\n\\/='"\0<>]/;
  var n3 = /^(xlink|xmlns|xml)([A-Z])/;
  var a3 = /^accessK|^auto[A-Z]|^ch|^col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|readO|rowS|spellC|src[A-Z]|tabI|item[A-Z]/;
  var i3 = /^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/;
  var l2 = /["&<]/;
  function s2(e3) {
    if (0 === e3.length || false === l2.test(e3))
      return e3;
    for (var t3 = 0, r3 = 0, o4 = "", n4 = ""; r3 < e3.length; r3++) {
      switch (e3.charCodeAt(r3)) {
        case 34:
          n4 = "&quot;";
          break;
        case 38:
          n4 = "&amp;";
          break;
        case 60:
          n4 = "&lt;";
          break;
        default:
          continue;
      }
      r3 !== t3 && (o4 += e3.slice(t3, r3)), o4 += n4, t3 = r3 + 1;
    }
    return r3 !== t3 && (o4 += e3.slice(t3, r3)), o4;
  }
  var c2 = {};
  var p2 = /* @__PURE__ */ new Set(["animation-iteration-count", "border-image-outset", "border-image-slice", "border-image-width", "box-flex", "box-flex-group", "box-ordinal-group", "column-count", "fill-opacity", "flex", "flex-grow", "flex-negative", "flex-order", "flex-positive", "flex-shrink", "flood-opacity", "font-weight", "grid-column", "grid-row", "line-clamp", "line-height", "opacity", "order", "orphans", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-miterlimit", "stroke-opacity", "stroke-width", "tab-size", "widows", "z-index", "zoom"]);
  var u3 = /[A-Z]/g;
  function f2(e3) {
    var t3 = "";
    for (var r3 in e3) {
      var o4 = e3[r3];
      if (null != o4 && "" !== o4) {
        var n4 = "-" == r3[0] ? r3 : c2[r3] || (c2[r3] = r3.replace(u3, "-$&").toLowerCase()), a4 = ";";
        "number" != typeof o4 || n4.startsWith("--") || p2.has(n4) || (a4 = "px;"), t3 = t3 + n4 + ":" + o4 + a4;
      }
    }
    return t3 || void 0;
  }
  var _;
  var d2;
  var h2;
  var m2;
  var v2 = [];
  var g2 = Array.isArray;
  var y2 = Object.assign;
  function b2(o4, n4) {
    var a4 = l.__s;
    l.__s = true, _ = l.__b, d2 = l.diffed, h2 = l.__r, m2 = l.unmount;
    var i4 = y(g, null);
    i4.__k = [o4];
    try {
      return C2(o4, n4 || k2, false, void 0, i4);
    } finally {
      l.__c && l.__c(o4, v2), l.__s = a4, v2.length = 0;
    }
  }
  function x2() {
    this.__d = true;
  }
  var k2 = {};
  function w2(e3, t3) {
    var r3, o4 = e3.type, n4 = true;
    return e3.__c ? (n4 = false, (r3 = e3.__c).state = r3.__s) : r3 = new o4(e3.props, t3), e3.__c = r3, r3.__v = e3, r3.props = e3.props, r3.context = t3, r3.__d = true, null == r3.state && (r3.state = k2), null == r3.__s && (r3.__s = r3.state), o4.getDerivedStateFromProps ? r3.state = y2({}, r3.state, o4.getDerivedStateFromProps(r3.props, r3.state)) : n4 && r3.componentWillMount ? (r3.componentWillMount(), r3.state = r3.__s !== r3.state ? r3.__s : r3.state) : !n4 && r3.componentWillUpdate && r3.componentWillUpdate(), h2 && h2(e3), r3.render(r3.props, r3.state, t3);
  }
  function C2(t3, l3, c3, p3, u4) {
    if (null == t3 || true === t3 || false === t3 || "" === t3)
      return "";
    if ("object" != typeof t3)
      return "function" == typeof t3 ? "" : s2(t3 + "");
    if (g2(t3)) {
      var v3 = "";
      u4.__k = t3;
      for (var b3 = 0; b3 < t3.length; b3++) {
        var k3 = t3[b3];
        null != k3 && "boolean" != typeof k3 && (v3 += C2(k3, l3, c3, p3, u4));
      }
      return v3;
    }
    if (void 0 !== t3.constructor)
      return "";
    t3.__ = u4, _ && _(t3);
    var A2, L2, D2, E = t3.type, T2 = t3.props, Z = l3;
    if ("function" == typeof E) {
      if (E === g) {
        if (T2.tpl) {
          for (var F = "", U = 0; U < T2.tpl.length; U++)
            if (F += T2.tpl[U], T2.exprs && U < T2.exprs.length) {
              var W = T2.exprs[U];
              if (null == W)
                continue;
              "object" != typeof W || void 0 !== W.constructor && !g2(W) ? F += W : F += C2(W, l3, c3, p3, t3);
            }
          return F;
        }
        if (T2.UNSTABLE_comment)
          return "<!--" + s2(T2.UNSTABLE_comment || "") + "-->";
        L2 = T2.children;
      } else {
        if (null != (A2 = E.contextType)) {
          var $2 = l3[A2.__c];
          Z = $2 ? $2.props.value : A2.__;
        }
        if (E.prototype && "function" == typeof E.prototype.render)
          L2 = w2(t3, Z), D2 = t3.__c;
        else {
          t3.__c = D2 = { __v: t3, props: T2, context: Z, setState: x2, forceUpdate: x2, __d: true, __h: [] };
          for (var j2 = 0; D2.__d && j2++ < 25; )
            D2.__d = false, h2 && h2(t3), L2 = E.call(D2, T2, Z);
          D2.__d = true;
        }
        if (null != D2.getChildContext && (l3 = y2({}, l3, D2.getChildContext())), (E.getDerivedStateFromError || D2.componentDidCatch) && l.errorBoundaries) {
          var M2 = "";
          L2 = null != L2 && L2.type === g && null == L2.key ? L2.props.children : L2;
          try {
            return M2 = C2(L2, l3, c3, p3, t3);
          } catch (e3) {
            return E.getDerivedStateFromError && (D2.__s = E.getDerivedStateFromError(e3)), D2.componentDidCatch && D2.componentDidCatch(e3, {}), D2.__d && (L2 = w2(t3, l3), null != (D2 = t3.__c).getChildContext && (l3 = y2({}, l3, D2.getChildContext())), M2 = C2(L2 = null != L2 && L2.type === g && null == L2.key ? L2.props.children : L2, l3, c3, p3, t3)), M2;
          } finally {
            d2 && d2(t3), t3.__ = void 0, m2 && m2(t3);
          }
        }
      }
      var z2 = C2(L2 = null != L2 && L2.type === g && null == L2.key ? L2.props.children : L2, l3, c3, p3, t3);
      return d2 && d2(t3), t3.__ = void 0, m2 && m2(t3), z2;
    }
    var H, q2 = "<" + E, B = "";
    for (var I2 in T2) {
      var N2 = T2[I2];
      switch (I2) {
        case "children":
          H = N2;
          continue;
        case "key":
        case "ref":
        case "__self":
        case "__source":
          continue;
        case "htmlFor":
          if ("for" in T2)
            continue;
          I2 = "for";
          break;
        case "className":
          if ("class" in T2)
            continue;
          I2 = "class";
          break;
        case "defaultChecked":
          I2 = "checked";
          break;
        case "defaultSelected":
          I2 = "selected";
          break;
        case "defaultValue":
        case "value":
          switch (I2 = "value", E) {
            case "textarea":
              H = N2;
              continue;
            case "select":
              p3 = N2;
              continue;
            case "option":
              p3 != N2 || "selected" in T2 || (q2 += " selected");
          }
          break;
        case "dangerouslySetInnerHTML":
          B = N2 && N2.__html;
          continue;
        case "style":
          "object" == typeof N2 && (N2 = f2(N2));
          break;
        case "acceptCharset":
          I2 = "accept-charset";
          break;
        case "httpEquiv":
          I2 = "http-equiv";
          break;
        default:
          if (n3.test(I2))
            I2 = I2.replace(n3, "$1:$2").toLowerCase();
          else {
            if (o3.test(I2))
              continue;
            "-" !== I2[4] && "draggable" !== I2 || null == N2 ? c3 ? i3.test(I2) && (I2 = "panose1" === I2 ? "panose-1" : I2.replace(/([A-Z])/g, "-$1").toLowerCase()) : a3.test(I2) && (I2 = I2.toLowerCase()) : N2 += "";
          }
      }
      null != N2 && false !== N2 && "function" != typeof N2 && (q2 = true === N2 || "" === N2 ? q2 + " " + I2 : q2 + " " + I2 + '="' + s2(N2 + "") + '"');
    }
    if (o3.test(E))
      throw new Error(E + " is not a valid HTML tag name in " + q2 + ">");
    return B || ("string" == typeof H ? B = s2(H) : null != H && false !== H && true !== H && (B = C2(H, l3, "svg" === E || "foreignObject" !== E && c3, p3, t3))), d2 && d2(t3), t3.__ = void 0, m2 && m2(t3), !B && S2.has(E) ? q2 + "/>" : q2 + ">" + B + "</" + E + ">";
  }
  var S2 = /* @__PURE__ */ new Set(["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]);
  var index_module_default = b2;

  // src/index.tsx
  var import_highcharts = __toESM(require_highcharts());
  var import_variwide = __toESM(require_variwide());
  var import_exporting = __toESM(require_exporting());
  var import_export_data = __toESM(require_export_data());
  (0, import_variwide.default)(import_highcharts.default);
  (0, import_exporting.default)(import_highcharts.default);
  (0, import_export_data.default)(import_highcharts.default);
  var storageKey = "zotero-plugins-dashboard-github-token";
  var auth5 = localStorage.getItem(storageKey);
  var octokit = new Octokit({ auth: auth5 });
  var chartOptions = {
    chart: { type: "variwide", zooming: { type: "x" } },
    title: { text: "Downloads ColumnGraph" },
    xAxis: { type: "category", reversed: true },
    legend: { enabled: false },
    yAxis: {
      type: "logarithmic",
      title: { text: "Downloads / Dates" }
    },
    series: [
      {
        type: "variwide",
        name: "Downloads",
        minPointLength: 8,
        colorByPoint: true
      }
    ],
    tooltip: {
      useHTML: true,
      formatter() {
        const point = this.point, downloads = Math.round(point.y * point.z ** 2);
        return index_module_default(
          /* @__PURE__ */ y("table", null, /* @__PURE__ */ y("thead", null, /* @__PURE__ */ y("tr", null, /* @__PURE__ */ y("td", { colSpan: 2 }, /* @__PURE__ */ y("b", null, point.custom.title)))), /* @__PURE__ */ y("tbody", null, /* @__PURE__ */ y("tr", null, /* @__PURE__ */ y("td", { style: { color: point.color } }, "Downloads:"), /* @__PURE__ */ y("td", null, downloads > 1e3 ? `${Math.round(downloads / 1e3)}k` : downloads)), /* @__PURE__ */ y("tr", null, /* @__PURE__ */ y("td", { style: { color: point.color } }, "Begin:"), /* @__PURE__ */ y("td", null, new Date(point.custom.begin).toLocaleDateString())), /* @__PURE__ */ y("tr", null, /* @__PURE__ */ y("td", { style: { color: point.color } }, "End:"), /* @__PURE__ */ y("td", null, new Date(point.custom.end).toLocaleDateString()))))
        );
      }
    }
  };
  onload = async function() {
    const params = new URLSearchParams(new URL(location.href).search);
    if (!params.has("repo"))
      return;
    const [owner, repo] = params.get("repo").split("/"), chart = import_highcharts.default.chart(
      "container",
      import_highcharts.default.merge(chartOptions, {
        subtitle: {
          text: index_module_default(
            /* @__PURE__ */ y("a", { href: `https://github.com/${owner}/${repo}` }, owner, "/", repo)
          )
        }
      })
    );
    chart.showLoading();
    try {
      const iterator2 = octokit.paginate.iterator(
        octokit.rest.repos.listReleases,
        {
          owner,
          repo,
          headers: { accept: "application/vnd.github+json" }
        }
      );
      let point = ["", 0, 0];
      for await (const { data } of iterator2)
        for (const release of data) {
          const asset = release.assets[0], published = release.published_at ?? release.created_at, date = new Date(published), downloaded = asset?.download_count ?? 0;
          if (point.some(Boolean))
            chart.series[0].addPoint({
              name: point[0],
              y: point[1] / (point[2] - date.getTime()),
              z: Math.sqrt(point[2] - date.getTime()),
              custom: {
                begin: date.getTime(),
                end: point[2],
                title: release.name
              }
            });
          point = [release.tag_name, downloaded, date.getTime()];
        }
    } catch (error) {
      if (error instanceof Error)
        alert(error.message);
      else
        console.error(error);
    } finally {
      chart.hideLoading();
    }
  };
})();