var Handlebars = require("handlebars");
var template = Handlebars.template,
  templates = (Handlebars.templates = Handlebars.templates || {});
templates["index"] = template({
  1: function (container, depth0, helpers, partials, data) {
    var stack1,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (stack1 = container.invokePartial(
      lookupProperty(partials, "item"),
      depth0,
      {
        name: "item",
        data: data,
        indent: "            ",
        helpers: helpers,
        partials: partials,
        decorators: container.decorators,
      },
    )) != null
      ? stack1
      : "";
  },
  compiler: [8, ">= 4.3.0"],
  main: function (container, depth0, helpers, partials, data) {
    var stack1,
      alias1 = container.lambda,
      alias2 = container.escapeExpression,
      alias3 = depth0 != null ? depth0 : container.nullContext || {},
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      '<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <meta name="description" content="A packwiz minecraft modpack" />\n    <meta name="generator" content="packwiz-renderer 0.1.0" />\n\n    <title>' +
      alias2(
        alias1(
          (stack1 = depth0 != null ? lookupProperty(depth0, "pack") : depth0) !=
            null
            ? lookupProperty(stack1, "name")
            : stack1,
          depth0,
        ),
      ) +
      '</title>\n  </head>\n  <body>\n    <main style="max-width: 960px; margin: 0 auto">\n\n      <h1>' +
      alias2(
        alias1(
          (stack1 = depth0 != null ? lookupProperty(depth0, "pack") : depth0) !=
            null
            ? lookupProperty(stack1, "name")
            : stack1,
          depth0,
        ),
      ) +
      '</h1>\n\n      <p>\n        To install this modpack use packwiz, and point at this url with\n        <a href="/pack.toml">pack.toml</a>\n        at the end.\n      </p>\n\n      <div>\n\n        <h2>Mods</h2>\n        <ul\n          style="display: flex; flex-direction: column; gap: 1rem; padding: 0"\n        >\n' +
      ((stack1 = lookupProperty(helpers, "each").call(
        alias3,
        depth0 != null ? lookupProperty(depth0, "mods") : depth0,
        {
          name: "each",
          hash: {},
          fn: container.program(1, data, 0),
          inverse: container.noop,
          data: data,
          loc: {
            start: { line: 27, column: 10 },
            end: { line: 29, column: 19 },
          },
        },
      )) != null
        ? stack1
        : "") +
      '\n        </ul>\n\n        <h2>Resource Packs</h2>\n        <ul\n          style="display: flex; flex-direction: column; gap: 1rem; padding: 0"\n        >\n' +
      ((stack1 = lookupProperty(helpers, "each").call(
        alias3,
        depth0 != null ? lookupProperty(depth0, "resourcePacks") : depth0,
        {
          name: "each",
          hash: {},
          fn: container.program(1, data, 0),
          inverse: container.noop,
          data: data,
          loc: {
            start: { line: 37, column: 10 },
            end: { line: 39, column: 19 },
          },
        },
      )) != null
        ? stack1
        : "") +
      "\n        </ul>\n      </div>\n    </main>\n\n  </body>\n</html>\n"
    );
  },
  usePartial: true,
  useData: true,
});
templates["item"] = template({
  1: function (container, depth0, helpers, partials, data) {
    var stack1,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      ((stack1 = lookupProperty(helpers, "if").call(
        alias1,
        (
          lookupProperty(helpers, "gte") ||
          (depth0 && lookupProperty(depth0, "gte")) ||
          container.hooks.helperMissing
        ).call(alias1, data && lookupProperty(data, "index"), 8, {
          name: "gte",
          hash: {},
          data: data,
          loc: { start: { line: 3, column: 10 }, end: { line: 3, column: 24 } },
        }),
        {
          name: "if",
          hash: {},
          fn: container.program(2, data, 0),
          inverse: container.program(4, data, 0),
          data: data,
          loc: { start: { line: 3, column: 4 }, end: { line: 20, column: 11 } },
        },
      )) != null
        ? stack1
        : "") + "\n"
    );
  },
  2: function (container, depth0, helpers, partials, data) {
    var helper,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      '      <img\n        style="aspect-ratio: 1"\n        width="128"\n        height="128"\n        src="' +
      container.escapeExpression(
        ((helper =
          (helper =
            lookupProperty(helpers, "logoUrl") ||
            (depth0 != null ? lookupProperty(depth0, "logoUrl") : depth0)) !=
          null
            ? helper
            : container.hooks.helperMissing),
        typeof helper === "function"
          ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, {
              name: "logoUrl",
              hash: {},
              data: data,
              loc: {
                start: { line: 8, column: 13 },
                end: { line: 8, column: 24 },
              },
            })
          : helper),
      ) +
      '"\n        alt=""\n        loading="lazy"\n      />\n'
    );
  },
  4: function (container, depth0, helpers, partials, data) {
    var helper,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      '      <img\n        style="aspect-ratio: 1"\n        width="128"\n        height="128"\n        src="' +
      container.escapeExpression(
        ((helper =
          (helper =
            lookupProperty(helpers, "logoUrl") ||
            (depth0 != null ? lookupProperty(depth0, "logoUrl") : depth0)) !=
          null
            ? helper
            : container.hooks.helperMissing),
        typeof helper === "function"
          ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, {
              name: "logoUrl",
              hash: {},
              data: data,
              loc: {
                start: { line: 17, column: 13 },
                end: { line: 17, column: 24 },
              },
            })
          : helper),
      ) +
      '"\n        alt=""\n      />\n'
    );
  },
  6: function (container, depth0, helpers, partials, data) {
    return '    <div style="width: 128px; height: 128px"></div>\n';
  },
  8: function (container, depth0, helpers, partials, data) {
    var helper,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return container.escapeExpression(
      ((helper =
        (helper =
          lookupProperty(helpers, "version") ||
          (depth0 != null ? lookupProperty(depth0, "version") : depth0)) != null
          ? helper
          : container.hooks.helperMissing),
      typeof helper === "function"
        ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, {
            name: "version",
            hash: {},
            data: data,
            loc: {
              start: { line: 29, column: 28 },
              end: { line: 29, column: 41 },
            },
          })
        : helper),
    );
  },
  compiler: [8, ">= 4.3.0"],
  main: function (container, depth0, helpers, partials, data) {
    var stack1,
      helper,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      alias2 = container.hooks.helperMissing,
      alias3 = "function",
      alias4 = container.escapeExpression,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      '<li style="display: flex; align-items: center; gap: 1rem">\n' +
      ((stack1 = lookupProperty(helpers, "if").call(
        alias1,
        depth0 != null ? lookupProperty(depth0, "logoUrl") : depth0,
        {
          name: "if",
          hash: {},
          fn: container.program(1, data, 0),
          inverse: container.program(6, data, 0),
          data: data,
          loc: { start: { line: 2, column: 2 }, end: { line: 24, column: 9 } },
        },
      )) != null
        ? stack1
        : "") +
      '  <div>\n    <h3>\n      <a href="' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "url") ||
            (depth0 != null ? lookupProperty(depth0, "url") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "url",
              hash: {},
              data: data,
              loc: {
                start: { line: 27, column: 15 },
                end: { line: 27, column: 22 },
              },
            })
          : helper),
      ) +
      '" rel="noreferrer noopener" target="_blank">' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "title") ||
            (depth0 != null ? lookupProperty(depth0, "title") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "title",
              hash: {},
              data: data,
              loc: {
                start: { line: 27, column: 66 },
                end: { line: 27, column: 75 },
              },
            })
          : helper),
      ) +
      "</a>\n\n      <small>" +
      ((stack1 = lookupProperty(helpers, "if").call(
        alias1,
        depth0 != null ? lookupProperty(depth0, "version") : depth0,
        {
          name: "if",
          hash: {},
          fn: container.program(8, data, 0),
          inverse: container.noop,
          data: data,
          loc: {
            start: { line: 29, column: 13 },
            end: { line: 29, column: 48 },
          },
        },
      )) != null
        ? stack1
        : "") +
      "</small>\n    </h3>\n    <p>" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "summary") ||
            (depth0 != null ? lookupProperty(depth0, "summary") : depth0)) !=
          null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "summary",
              hash: {},
              data: data,
              loc: {
                start: { line: 31, column: 7 },
                end: { line: 31, column: 18 },
              },
            })
          : helper),
      ) +
      "</p>\n  </div>\n</li>\n"
    );
  },
  useData: true,
});
