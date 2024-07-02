var Handlebars = require("handlebars");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['index'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n            <li style=\"display: flex; align-items: center; gap: 1rem\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"logoUrl") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(7, data, 0),"data":data,"loc":{"start":{"line":30,"column":14},"end":{"line":52,"column":21}}})) != null ? stack1 : "")
    + "              <div>\n                <h3>\n                  <a\n                    href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":56,"column":26},"end":{"line":56,"column":33}}}) : helper)))
    + "\"\n                    rel=\"noreferrer noopener\"\n                    target=\"_blank\"\n                  >"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":59,"column":19},"end":{"line":59,"column":28}}}) : helper)))
    + "</a>\n\n                </h3>\n                <p>"
    + alias4(((helper = (helper = lookupProperty(helpers,"summary") || (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"summary","hash":{},"data":data,"loc":{"start":{"line":63,"column":19},"end":{"line":63,"column":30}}}) : helper)))
    + "</p>\n              </div>\n\n            </li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"gte")||(depth0 && lookupProperty(depth0,"gte"))||container.hooks.helperMissing).call(alias1,(data && lookupProperty(data,"index")),8,{"name":"gte","hash":{},"data":data,"loc":{"start":{"line":31,"column":22},"end":{"line":31,"column":36}}}),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data,"loc":{"start":{"line":31,"column":16},"end":{"line":48,"column":23}}})) != null ? stack1 : "")
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                  <img\n                    style=\"aspect-ratio: 1\"\n                    width=\"128\"\n                    height=\"128\"\n                    src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"logoUrl") || (depth0 != null ? lookupProperty(depth0,"logoUrl") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"logoUrl","hash":{},"data":data,"loc":{"start":{"line":36,"column":25},"end":{"line":36,"column":36}}}) : helper)))
    + "\"\n                    alt=\"\"\n                    loading=\"lazy\"\n                  />\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                  <img\n                    style=\"aspect-ratio: 1\"\n                    width=\"128\"\n                    height=\"128\"\n                    src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"logoUrl") || (depth0 != null ? lookupProperty(depth0,"logoUrl") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"logoUrl","hash":{},"data":data,"loc":{"start":{"line":45,"column":25},"end":{"line":45,"column":36}}}) : helper)))
    + "\"\n                    alt=\"\"\n                  />\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "                <div style=\"width: 128px; height: 128px\"></div>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n            <li style=\"display: flex; align-items: center; gap: 1rem\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"logoUrl") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(7, data, 0),"data":data,"loc":{"start":{"line":78,"column":14},"end":{"line":90,"column":21}}})) != null ? stack1 : "")
    + "              <div>\n                <h3>\n                  <a\n                    href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":94,"column":26},"end":{"line":94,"column":33}}}) : helper)))
    + "\"\n                    rel=\"noreferrer noopener\"\n                    target=\"_blank\"\n                  >"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":97,"column":19},"end":{"line":97,"column":28}}}) : helper)))
    + "</a>\n\n\n                </h3>\n                <p>"
    + alias4(((helper = (helper = lookupProperty(helpers,"summary") || (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"summary","hash":{},"data":data,"loc":{"start":{"line":102,"column":19},"end":{"line":102,"column":30}}}) : helper)))
    + "</p>\n              </div>\n\n            </li>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n                <img\n                  style=\"aspect-ratio: 1\"\n                  width=\"128\"\n                  height=\"128\"\n                  src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"logoUrl") || (depth0 != null ? lookupProperty(depth0,"logoUrl") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"logoUrl","hash":{},"data":data,"loc":{"start":{"line":84,"column":23},"end":{"line":84,"column":34}}}) : helper)))
    + "\"\n                  alt=\"\"\n                />\n\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <meta name=\"description\" content=\"A packwiz minecraft modpack\" />\n    <meta name=\"generator\" content=\"packwiz-renderer 0.1.0\" />\n\n    <title>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"pack") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "</title>\n  </head>\n  <body>\n    <main style=\"max-width: 960px; margin: 0 auto\">\n\n      <h1>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"pack") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "</h1>\n\n      <p>\n        To install this modpack use packwiz, and point at this url with\n        <a href=\"/pack.toml\">pack.toml</a>\n        at the end.\n      </p>\n\n      <div>\n\n        <h2>Mods</h2>\n        <ul\n          style=\"display: flex; flex-direction: column; gap: 1rem; padding: 0\"\n        >\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias3,(depth0 != null ? lookupProperty(depth0,"mods") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":27,"column":10},"end":{"line":67,"column":19}}})) != null ? stack1 : "")
    + "\n        </ul>\n\n        <h2>Resource Packs</h2>\n        <ul\n          style=\"display: flex; flex-direction: column; gap: 1rem; padding: 0\"\n        >\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias3,(depth0 != null ? lookupProperty(depth0,"resourcePacks") : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":75,"column":10},"end":{"line":106,"column":19}}})) != null ? stack1 : "")
    + "\n        </ul>\n      </div>\n    </main>\n\n  </body>\n</html>\n";
},"useData":true});
