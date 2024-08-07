#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var __export = (target, all3) => {
  for (var name in all3)
    __defProp(target, name, { get: all3[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, "default", { value: mod, enumerable: true })
      : target,
    mod,
  )
);

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.4.5",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js",
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json",
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        "test:coverage": "tap --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version",
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git",
      },
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings",
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@definitelytyped/dtslint": "^0.0.133",
        "@types/node": "^18.11.3",
        decache: "^4.6.1",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.5.0",
        tap: "^16.3.0",
        tar: "^6.1.11",
        typescript: "^4.8.4",
      },
      engines: {
        node: ">=12",
      },
      browser: {
        fs: false,
      },
    };
  },
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs2 = require("fs");
    var path3 = require("path");
    var os2 = require("os");
    var crypto = require("crypto");
    var packageJson = require_package();
    var version2 = packageJson.version;
    var LINE =
      /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
    function parse5(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/gm, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(
          `MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`,
        );
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version2}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version2}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version2}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error(
            "INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development",
          );
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(
          `NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`,
        );
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs2.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault")
                ? filepath
                : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault")
            ? options.path
            : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path3.resolve(process.cwd(), ".env.vault");
      }
      if (fs2.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~"
        ? path3.join(os2.homedir(), envPath.slice(1))
        : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path3.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path4 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(
            fs2.readFileSync(path4, { encoding }),
          );
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path4} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(
          `You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`,
        );
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed =
          error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error(
            "INVALID_DOTENV_KEY: It must be 64 characters long (or more)",
          );
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error(
            "DECRYPTION_FAILED: Please check your DOTENV_KEY",
          );
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error(
          "OBJECT_REQUIRED: Please check the processEnv argument being passed to populate",
        );
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse: parse5,
      populate,
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  },
});

// node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/dotenv/lib/env-options.js"(exports2, module2) {
    var options = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) {
      options.encoding = process.env.DOTENV_CONFIG_ENCODING;
    }
    if (process.env.DOTENV_CONFIG_PATH != null) {
      options.path = process.env.DOTENV_CONFIG_PATH;
    }
    if (process.env.DOTENV_CONFIG_DEBUG != null) {
      options.debug = process.env.DOTENV_CONFIG_DEBUG;
    }
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
      options.override = process.env.DOTENV_CONFIG_OVERRIDE;
    }
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
      options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    }
    module2.exports = options;
  },
});

// node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/dotenv/lib/cli-options.js"(exports2, module2) {
    var re = /^dotenv_config_(encoding|path|debug|override|DOTENV_KEY)=(.+)$/;
    module2.exports = function optionMatcher(args) {
      return args.reduce(function (acc, cur) {
        const matches = cur.match(re);
        if (matches) {
          acc[matches[1]] = matches[2];
        }
        return acc;
      }, {});
    };
  },
});

// node_modules/commander/lib/error.js
var require_error = __commonJS({
  "node_modules/commander/lib/error.js"(exports2) {
    var CommanderError2 = class extends Error {
      /**
       * Constructs the CommanderError class
       * @param {number} exitCode suggested exit code which could be used with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       */
      constructor(exitCode, code, message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.code = code;
        this.exitCode = exitCode;
        this.nestedError = void 0;
      }
    };
    var InvalidArgumentError2 = class extends CommanderError2 {
      /**
       * Constructs the InvalidArgumentError class
       * @param {string} [message] explanation of why argument is invalid
       */
      constructor(message) {
        super(1, "commander.invalidArgument", message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
      }
    };
    exports2.CommanderError = CommanderError2;
    exports2.InvalidArgumentError = InvalidArgumentError2;
  },
});

// node_modules/commander/lib/argument.js
var require_argument = __commonJS({
  "node_modules/commander/lib/argument.js"(exports2) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Argument2 = class {
      /**
       * Initialize a new command argument with the given name and description.
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @param {string} name
       * @param {string} [description]
       */
      constructor(name, description) {
        this.description = description || "";
        this.variadic = false;
        this.parseArg = void 0;
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.argChoices = void 0;
        switch (name[0]) {
          case "<":
            this.required = true;
            this._name = name.slice(1, -1);
            break;
          case "[":
            this.required = false;
            this._name = name.slice(1, -1);
            break;
          default:
            this.required = true;
            this._name = name;
            break;
        }
        if (this._name.length > 3 && this._name.slice(-3) === "...") {
          this.variadic = true;
          this._name = this._name.slice(0, -3);
        }
      }
      /**
       * Return argument name.
       *
       * @return {string}
       */
      name() {
        return this._name;
      }
      /**
       * @package
       */
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Argument}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Set the custom handler for processing CLI command arguments into argument values.
       *
       * @param {Function} [fn]
       * @return {Argument}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Only allow argument value to be one of choices.
       *
       * @param {string[]} values
       * @return {Argument}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(
              `Allowed choices are ${this.argChoices.join(", ")}.`,
            );
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Make argument required.
       *
       * @returns {Argument}
       */
      argRequired() {
        this.required = true;
        return this;
      }
      /**
       * Make argument optional.
       *
       * @returns {Argument}
       */
      argOptional() {
        this.required = false;
        return this;
      }
    };
    function humanReadableArgName(arg) {
      const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
      return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
    }
    exports2.Argument = Argument2;
    exports2.humanReadableArgName = humanReadableArgName;
  },
});

// node_modules/commander/lib/help.js
var require_help = __commonJS({
  "node_modules/commander/lib/help.js"(exports2) {
    var { humanReadableArgName } = require_argument();
    var Help2 = class {
      constructor() {
        this.helpWidth = void 0;
        this.sortSubcommands = false;
        this.sortOptions = false;
        this.showGlobalOptions = false;
      }
      /**
       * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
       *
       * @param {Command} cmd
       * @returns {Command[]}
       */
      visibleCommands(cmd) {
        const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
        const helpCommand = cmd._getHelpCommand();
        if (helpCommand && !helpCommand._hidden) {
          visibleCommands.push(helpCommand);
        }
        if (this.sortSubcommands) {
          visibleCommands.sort((a, b) => {
            return a.name().localeCompare(b.name());
          });
        }
        return visibleCommands;
      }
      /**
       * Compare options for sort.
       *
       * @param {Option} a
       * @param {Option} b
       * @returns {number}
       */
      compareOptions(a, b) {
        const getSortKey = (option) => {
          return option.short
            ? option.short.replace(/^-/, "")
            : option.long.replace(/^--/, "");
        };
        return getSortKey(a).localeCompare(getSortKey(b));
      }
      /**
       * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleOptions(cmd) {
        const visibleOptions = cmd.options.filter((option) => !option.hidden);
        const helpOption = cmd._getHelpOption();
        if (helpOption && !helpOption.hidden) {
          const removeShort =
            helpOption.short && cmd._findOption(helpOption.short);
          const removeLong =
            helpOption.long && cmd._findOption(helpOption.long);
          if (!removeShort && !removeLong) {
            visibleOptions.push(helpOption);
          } else if (helpOption.long && !removeLong) {
            visibleOptions.push(
              cmd.createOption(helpOption.long, helpOption.description),
            );
          } else if (helpOption.short && !removeShort) {
            visibleOptions.push(
              cmd.createOption(helpOption.short, helpOption.description),
            );
          }
        }
        if (this.sortOptions) {
          visibleOptions.sort(this.compareOptions);
        }
        return visibleOptions;
      }
      /**
       * Get an array of the visible global options. (Not including help.)
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleGlobalOptions(cmd) {
        if (!this.showGlobalOptions) return [];
        const globalOptions = [];
        for (
          let ancestorCmd = cmd.parent;
          ancestorCmd;
          ancestorCmd = ancestorCmd.parent
        ) {
          const visibleOptions = ancestorCmd.options.filter(
            (option) => !option.hidden,
          );
          globalOptions.push(...visibleOptions);
        }
        if (this.sortOptions) {
          globalOptions.sort(this.compareOptions);
        }
        return globalOptions;
      }
      /**
       * Get an array of the arguments if any have a description.
       *
       * @param {Command} cmd
       * @returns {Argument[]}
       */
      visibleArguments(cmd) {
        if (cmd._argsDescription) {
          cmd.registeredArguments.forEach((argument) => {
            argument.description =
              argument.description ||
              cmd._argsDescription[argument.name()] ||
              "";
          });
        }
        if (cmd.registeredArguments.find((argument) => argument.description)) {
          return cmd.registeredArguments;
        }
        return [];
      }
      /**
       * Get the command term to show in the list of subcommands.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandTerm(cmd) {
        const args = cmd.registeredArguments
          .map((arg) => humanReadableArgName(arg))
          .join(" ");
        return (
          cmd._name +
          (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") +
          (cmd.options.length ? " [options]" : "") + // simplistic check for non-help option
          (args ? " " + args : "")
        );
      }
      /**
       * Get the option term to show in the list of options.
       *
       * @param {Option} option
       * @returns {string}
       */
      optionTerm(option) {
        return option.flags;
      }
      /**
       * Get the argument term to show in the list of arguments.
       *
       * @param {Argument} argument
       * @returns {string}
       */
      argumentTerm(argument) {
        return argument.name();
      }
      /**
       * Get the longest command term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestSubcommandTermLength(cmd, helper) {
        return helper.visibleCommands(cmd).reduce((max, command) => {
          return Math.max(max, helper.subcommandTerm(command).length);
        }, 0);
      }
      /**
       * Get the longest option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestOptionTermLength(cmd, helper) {
        return helper.visibleOptions(cmd).reduce((max, option) => {
          return Math.max(max, helper.optionTerm(option).length);
        }, 0);
      }
      /**
       * Get the longest global option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestGlobalOptionTermLength(cmd, helper) {
        return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
          return Math.max(max, helper.optionTerm(option).length);
        }, 0);
      }
      /**
       * Get the longest argument term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestArgumentTermLength(cmd, helper) {
        return helper.visibleArguments(cmd).reduce((max, argument) => {
          return Math.max(max, helper.argumentTerm(argument).length);
        }, 0);
      }
      /**
       * Get the command usage to be displayed at the top of the built-in help.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandUsage(cmd) {
        let cmdName = cmd._name;
        if (cmd._aliases[0]) {
          cmdName = cmdName + "|" + cmd._aliases[0];
        }
        let ancestorCmdNames = "";
        for (
          let ancestorCmd = cmd.parent;
          ancestorCmd;
          ancestorCmd = ancestorCmd.parent
        ) {
          ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
        }
        return ancestorCmdNames + cmdName + " " + cmd.usage();
      }
      /**
       * Get the description for the command.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandDescription(cmd) {
        return cmd.description();
      }
      /**
       * Get the subcommand summary to show in the list of subcommands.
       * (Fallback to description for backwards compatibility.)
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandDescription(cmd) {
        return cmd.summary() || cmd.description();
      }
      /**
       * Get the option description to show in the list of options.
       *
       * @param {Option} option
       * @return {string}
       */
      optionDescription(option) {
        const extraInfo = [];
        if (option.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`,
          );
        }
        if (option.defaultValue !== void 0) {
          const showDefault =
            option.required ||
            option.optional ||
            (option.isBoolean() && typeof option.defaultValue === "boolean");
          if (showDefault) {
            extraInfo.push(
              `default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`,
            );
          }
        }
        if (option.presetArg !== void 0 && option.optional) {
          extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
        }
        if (option.envVar !== void 0) {
          extraInfo.push(`env: ${option.envVar}`);
        }
        if (extraInfo.length > 0) {
          return `${option.description} (${extraInfo.join(", ")})`;
        }
        return option.description;
      }
      /**
       * Get the argument description to show in the list of arguments.
       *
       * @param {Argument} argument
       * @return {string}
       */
      argumentDescription(argument) {
        const extraInfo = [];
        if (argument.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`,
          );
        }
        if (argument.defaultValue !== void 0) {
          extraInfo.push(
            `default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`,
          );
        }
        if (extraInfo.length > 0) {
          const extraDescripton = `(${extraInfo.join(", ")})`;
          if (argument.description) {
            return `${argument.description} ${extraDescripton}`;
          }
          return extraDescripton;
        }
        return argument.description;
      }
      /**
       * Generate the built-in help text.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {string}
       */
      formatHelp(cmd, helper) {
        const termWidth = helper.padWidth(cmd, helper);
        const helpWidth = helper.helpWidth || 80;
        const itemIndentWidth = 2;
        const itemSeparatorWidth = 2;
        function formatItem(term, description) {
          if (description) {
            const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
            return helper.wrap(
              fullText,
              helpWidth - itemIndentWidth,
              termWidth + itemSeparatorWidth,
            );
          }
          return term;
        }
        function formatList(textArray) {
          return textArray
            .join("\n")
            .replace(/^/gm, " ".repeat(itemIndentWidth));
        }
        let output = [`Usage: ${helper.commandUsage(cmd)}`, ""];
        const commandDescription = helper.commandDescription(cmd);
        if (commandDescription.length > 0) {
          output = output.concat([
            helper.wrap(commandDescription, helpWidth, 0),
            "",
          ]);
        }
        const argumentList = helper.visibleArguments(cmd).map((argument) => {
          return formatItem(
            helper.argumentTerm(argument),
            helper.argumentDescription(argument),
          );
        });
        if (argumentList.length > 0) {
          output = output.concat(["Arguments:", formatList(argumentList), ""]);
        }
        const optionList = helper.visibleOptions(cmd).map((option) => {
          return formatItem(
            helper.optionTerm(option),
            helper.optionDescription(option),
          );
        });
        if (optionList.length > 0) {
          output = output.concat(["Options:", formatList(optionList), ""]);
        }
        if (this.showGlobalOptions) {
          const globalOptionList = helper
            .visibleGlobalOptions(cmd)
            .map((option) => {
              return formatItem(
                helper.optionTerm(option),
                helper.optionDescription(option),
              );
            });
          if (globalOptionList.length > 0) {
            output = output.concat([
              "Global Options:",
              formatList(globalOptionList),
              "",
            ]);
          }
        }
        const commandList = helper.visibleCommands(cmd).map((cmd2) => {
          return formatItem(
            helper.subcommandTerm(cmd2),
            helper.subcommandDescription(cmd2),
          );
        });
        if (commandList.length > 0) {
          output = output.concat(["Commands:", formatList(commandList), ""]);
        }
        return output.join("\n");
      }
      /**
       * Calculate the pad width from the maximum term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      padWidth(cmd, helper) {
        return Math.max(
          helper.longestOptionTermLength(cmd, helper),
          helper.longestGlobalOptionTermLength(cmd, helper),
          helper.longestSubcommandTermLength(cmd, helper),
          helper.longestArgumentTermLength(cmd, helper),
        );
      }
      /**
       * Wrap the given string to width characters per line, with lines after the first indented.
       * Do not wrap if insufficient room for wrapping (minColumnWidth), or string is manually formatted.
       *
       * @param {string} str
       * @param {number} width
       * @param {number} indent
       * @param {number} [minColumnWidth=40]
       * @return {string}
       *
       */
      wrap(str, width, indent, minColumnWidth = 40) {
        const indents =
          " \\f\\t\\v\xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF";
        const manualIndent = new RegExp(`[\\n][${indents}]+`);
        if (str.match(manualIndent)) return str;
        const columnWidth = width - indent;
        if (columnWidth < minColumnWidth) return str;
        const leadingStr = str.slice(0, indent);
        const columnText = str.slice(indent).replace("\r\n", "\n");
        const indentString = " ".repeat(indent);
        const zeroWidthSpace = "\u200B";
        const breaks = `\\s${zeroWidthSpace}`;
        const regex = new RegExp(
          `
|.{1,${columnWidth - 1}}([${breaks}]|$)|[^${breaks}]+?([${breaks}]|$)`,
          "g",
        );
        const lines = columnText.match(regex) || [];
        return (
          leadingStr +
          lines
            .map((line, i) => {
              if (line === "\n") return "";
              return (i > 0 ? indentString : "") + line.trimEnd();
            })
            .join("\n")
        );
      }
    };
    exports2.Help = Help2;
  },
});

// node_modules/commander/lib/option.js
var require_option = __commonJS({
  "node_modules/commander/lib/option.js"(exports2) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Option2 = class {
      /**
       * Initialize a new `Option` with the given `flags` and `description`.
       *
       * @param {string} flags
       * @param {string} [description]
       */
      constructor(flags, description) {
        this.flags = flags;
        this.description = description || "";
        this.required = flags.includes("<");
        this.optional = flags.includes("[");
        this.variadic = /\w\.\.\.[>\]]$/.test(flags);
        this.mandatory = false;
        const optionFlags = splitOptionFlags(flags);
        this.short = optionFlags.shortFlag;
        this.long = optionFlags.longFlag;
        this.negate = false;
        if (this.long) {
          this.negate = this.long.startsWith("--no-");
        }
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.presetArg = void 0;
        this.envVar = void 0;
        this.parseArg = void 0;
        this.hidden = false;
        this.argChoices = void 0;
        this.conflictsWith = [];
        this.implied = void 0;
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Option}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Preset to use when option used without option-argument, especially optional but also boolean and negated.
       * The custom processing (parseArg) is called.
       *
       * @example
       * new Option('--color').default('GREYSCALE').preset('RGB');
       * new Option('--donate [amount]').preset('20').argParser(parseFloat);
       *
       * @param {*} arg
       * @return {Option}
       */
      preset(arg) {
        this.presetArg = arg;
        return this;
      }
      /**
       * Add option name(s) that conflict with this option.
       * An error will be displayed if conflicting options are found during parsing.
       *
       * @example
       * new Option('--rgb').conflicts('cmyk');
       * new Option('--js').conflicts(['ts', 'jsx']);
       *
       * @param {(string | string[])} names
       * @return {Option}
       */
      conflicts(names) {
        this.conflictsWith = this.conflictsWith.concat(names);
        return this;
      }
      /**
       * Specify implied option values for when this option is set and the implied options are not.
       *
       * The custom processing (parseArg) is not called on the implied values.
       *
       * @example
       * program
       *   .addOption(new Option('--log', 'write logging information to file'))
       *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
       *
       * @param {object} impliedOptionValues
       * @return {Option}
       */
      implies(impliedOptionValues) {
        let newImplied = impliedOptionValues;
        if (typeof impliedOptionValues === "string") {
          newImplied = { [impliedOptionValues]: true };
        }
        this.implied = Object.assign(this.implied || {}, newImplied);
        return this;
      }
      /**
       * Set environment variable to check for option value.
       *
       * An environment variable is only used if when processed the current option value is
       * undefined, or the source of the current value is 'default' or 'config' or 'env'.
       *
       * @param {string} name
       * @return {Option}
       */
      env(name) {
        this.envVar = name;
        return this;
      }
      /**
       * Set the custom handler for processing CLI option arguments into option values.
       *
       * @param {Function} [fn]
       * @return {Option}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Whether the option is mandatory and must have a value after parsing.
       *
       * @param {boolean} [mandatory=true]
       * @return {Option}
       */
      makeOptionMandatory(mandatory = true) {
        this.mandatory = !!mandatory;
        return this;
      }
      /**
       * Hide option in help.
       *
       * @param {boolean} [hide=true]
       * @return {Option}
       */
      hideHelp(hide = true) {
        this.hidden = !!hide;
        return this;
      }
      /**
       * @package
       */
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      /**
       * Only allow option value to be one of choices.
       *
       * @param {string[]} values
       * @return {Option}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(
              `Allowed choices are ${this.argChoices.join(", ")}.`,
            );
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Return option name.
       *
       * @return {string}
       */
      name() {
        if (this.long) {
          return this.long.replace(/^--/, "");
        }
        return this.short.replace(/^-/, "");
      }
      /**
       * Return option name, in a camelcase format that can be used
       * as a object attribute key.
       *
       * @return {string}
       */
      attributeName() {
        return camelcase(this.name().replace(/^no-/, ""));
      }
      /**
       * Check if `arg` matches the short or long flag.
       *
       * @param {string} arg
       * @return {boolean}
       * @package
       */
      is(arg) {
        return this.short === arg || this.long === arg;
      }
      /**
       * Return whether a boolean option.
       *
       * Options are one of boolean, negated, required argument, or optional argument.
       *
       * @return {boolean}
       * @package
       */
      isBoolean() {
        return !this.required && !this.optional && !this.negate;
      }
    };
    var DualOptions = class {
      /**
       * @param {Option[]} options
       */
      constructor(options) {
        this.positiveOptions = /* @__PURE__ */ new Map();
        this.negativeOptions = /* @__PURE__ */ new Map();
        this.dualOptions = /* @__PURE__ */ new Set();
        options.forEach((option) => {
          if (option.negate) {
            this.negativeOptions.set(option.attributeName(), option);
          } else {
            this.positiveOptions.set(option.attributeName(), option);
          }
        });
        this.negativeOptions.forEach((value, key) => {
          if (this.positiveOptions.has(key)) {
            this.dualOptions.add(key);
          }
        });
      }
      /**
       * Did the value come from the option, and not from possible matching dual option?
       *
       * @param {*} value
       * @param {Option} option
       * @returns {boolean}
       */
      valueFromOption(value, option) {
        const optionKey = option.attributeName();
        if (!this.dualOptions.has(optionKey)) return true;
        const preset = this.negativeOptions.get(optionKey).presetArg;
        const negativeValue = preset !== void 0 ? preset : false;
        return option.negate === (negativeValue === value);
      }
    };
    function camelcase(str) {
      return str.split("-").reduce((str2, word) => {
        return str2 + word[0].toUpperCase() + word.slice(1);
      });
    }
    function splitOptionFlags(flags) {
      let shortFlag;
      let longFlag;
      const flagParts = flags.split(/[ |,]+/);
      if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1]))
        shortFlag = flagParts.shift();
      longFlag = flagParts.shift();
      if (!shortFlag && /^-[^-]$/.test(longFlag)) {
        shortFlag = longFlag;
        longFlag = void 0;
      }
      return { shortFlag, longFlag };
    }
    exports2.Option = Option2;
    exports2.DualOptions = DualOptions;
  },
});

// node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = __commonJS({
  "node_modules/commander/lib/suggestSimilar.js"(exports2) {
    var maxDistance = 3;
    function editDistance(a, b) {
      if (Math.abs(a.length - b.length) > maxDistance)
        return Math.max(a.length, b.length);
      const d = [];
      for (let i = 0; i <= a.length; i++) {
        d[i] = [i];
      }
      for (let j = 0; j <= b.length; j++) {
        d[0][j] = j;
      }
      for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
          let cost = 1;
          if (a[i - 1] === b[j - 1]) {
            cost = 0;
          } else {
            cost = 1;
          }
          d[i][j] = Math.min(
            d[i - 1][j] + 1,
            // deletion
            d[i][j - 1] + 1,
            // insertion
            d[i - 1][j - 1] + cost,
            // substitution
          );
          if (
            i > 1 &&
            j > 1 &&
            a[i - 1] === b[j - 2] &&
            a[i - 2] === b[j - 1]
          ) {
            d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
          }
        }
      }
      return d[a.length][b.length];
    }
    function suggestSimilar(word, candidates) {
      if (!candidates || candidates.length === 0) return "";
      candidates = Array.from(new Set(candidates));
      const searchingOptions = word.startsWith("--");
      if (searchingOptions) {
        word = word.slice(2);
        candidates = candidates.map((candidate) => candidate.slice(2));
      }
      let similar = [];
      let bestDistance = maxDistance;
      const minSimilarity = 0.4;
      candidates.forEach((candidate) => {
        if (candidate.length <= 1) return;
        const distance = editDistance(word, candidate);
        const length = Math.max(word.length, candidate.length);
        const similarity = (length - distance) / length;
        if (similarity > minSimilarity) {
          if (distance < bestDistance) {
            bestDistance = distance;
            similar = [candidate];
          } else if (distance === bestDistance) {
            similar.push(candidate);
          }
        }
      });
      similar.sort((a, b) => a.localeCompare(b));
      if (searchingOptions) {
        similar = similar.map((candidate) => `--${candidate}`);
      }
      if (similar.length > 1) {
        return `
(Did you mean one of ${similar.join(", ")}?)`;
      }
      if (similar.length === 1) {
        return `
(Did you mean ${similar[0]}?)`;
      }
      return "";
    }
    exports2.suggestSimilar = suggestSimilar;
  },
});

// node_modules/commander/lib/command.js
var require_command = __commonJS({
  "node_modules/commander/lib/command.js"(exports2) {
    var EventEmitter2 = require("node:events").EventEmitter;
    var childProcess = require("node:child_process");
    var path3 = require("node:path");
    var fs2 = require("node:fs");
    var process3 = require("node:process");
    var { Argument: Argument2, humanReadableArgName } = require_argument();
    var { CommanderError: CommanderError2 } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2, DualOptions } = require_option();
    var { suggestSimilar } = require_suggestSimilar();
    var Command2 = class _Command extends EventEmitter2 {
      /**
       * Initialize a new `Command`.
       *
       * @param {string} [name]
       */
      constructor(name) {
        super();
        this.commands = [];
        this.options = [];
        this.parent = null;
        this._allowUnknownOption = false;
        this._allowExcessArguments = true;
        this.registeredArguments = [];
        this._args = this.registeredArguments;
        this.args = [];
        this.rawArgs = [];
        this.processedArgs = [];
        this._scriptPath = null;
        this._name = name || "";
        this._optionValues = {};
        this._optionValueSources = {};
        this._storeOptionsAsProperties = false;
        this._actionHandler = null;
        this._executableHandler = false;
        this._executableFile = null;
        this._executableDir = null;
        this._defaultCommandName = null;
        this._exitCallback = null;
        this._aliases = [];
        this._combineFlagAndOptionalValue = true;
        this._description = "";
        this._summary = "";
        this._argsDescription = void 0;
        this._enablePositionalOptions = false;
        this._passThroughOptions = false;
        this._lifeCycleHooks = {};
        this._showHelpAfterError = false;
        this._showSuggestionAfterError = true;
        this._outputConfiguration = {
          writeOut: (str) => process3.stdout.write(str),
          writeErr: (str) => process3.stderr.write(str),
          getOutHelpWidth: () =>
            process3.stdout.isTTY ? process3.stdout.columns : void 0,
          getErrHelpWidth: () =>
            process3.stderr.isTTY ? process3.stderr.columns : void 0,
          outputError: (str, write) => write(str),
        };
        this._hidden = false;
        this._helpOption = void 0;
        this._addImplicitHelpCommand = void 0;
        this._helpCommand = void 0;
        this._helpConfiguration = {};
      }
      /**
       * Copy settings that are useful to have in common across root command and subcommands.
       *
       * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
       *
       * @param {Command} sourceCommand
       * @return {Command} `this` command for chaining
       */
      copyInheritedSettings(sourceCommand) {
        this._outputConfiguration = sourceCommand._outputConfiguration;
        this._helpOption = sourceCommand._helpOption;
        this._helpCommand = sourceCommand._helpCommand;
        this._helpConfiguration = sourceCommand._helpConfiguration;
        this._exitCallback = sourceCommand._exitCallback;
        this._storeOptionsAsProperties =
          sourceCommand._storeOptionsAsProperties;
        this._combineFlagAndOptionalValue =
          sourceCommand._combineFlagAndOptionalValue;
        this._allowExcessArguments = sourceCommand._allowExcessArguments;
        this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
        this._showHelpAfterError = sourceCommand._showHelpAfterError;
        this._showSuggestionAfterError =
          sourceCommand._showSuggestionAfterError;
        return this;
      }
      /**
       * @returns {Command[]}
       * @private
       */
      _getCommandAndAncestors() {
        const result = [];
        for (let command = this; command; command = command.parent) {
          result.push(command);
        }
        return result;
      }
      /**
       * Define a command.
       *
       * There are two styles of command: pay attention to where to put the description.
       *
       * @example
       * // Command implemented using action handler (description is supplied separately to `.command`)
       * program
       *   .command('clone <source> [destination]')
       *   .description('clone a repository into a newly created directory')
       *   .action((source, destination) => {
       *     console.log('clone command called');
       *   });
       *
       * // Command implemented using separate executable file (description is second parameter to `.command`)
       * program
       *   .command('start <service>', 'start named service')
       *   .command('stop [service]', 'stop named service, or all if no name supplied');
       *
       * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
       * @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
       * @param {object} [execOpts] - configuration options (for executable)
       * @return {Command} returns new command for action handler, or `this` for executable command
       */
      command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
        let desc = actionOptsOrExecDesc;
        let opts = execOpts;
        if (typeof desc === "object" && desc !== null) {
          opts = desc;
          desc = null;
        }
        opts = opts || {};
        const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
        const cmd = this.createCommand(name);
        if (desc) {
          cmd.description(desc);
          cmd._executableHandler = true;
        }
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        cmd._hidden = !!(opts.noHelp || opts.hidden);
        cmd._executableFile = opts.executableFile || null;
        if (args) cmd.arguments(args);
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd.copyInheritedSettings(this);
        if (desc) return this;
        return cmd;
      }
      /**
       * Factory routine to create a new unattached command.
       *
       * See .command() for creating an attached subcommand, which uses this routine to
       * create the command. You can override createCommand to customise subcommands.
       *
       * @param {string} [name]
       * @return {Command} new command
       */
      createCommand(name) {
        return new _Command(name);
      }
      /**
       * You can customise the help with a subclass of Help by overriding createHelp,
       * or by overriding Help properties using configureHelp().
       *
       * @return {Help}
       */
      createHelp() {
        return Object.assign(new Help2(), this.configureHelp());
      }
      /**
       * You can customise the help by overriding Help properties using configureHelp(),
       * or with a subclass of Help by overriding createHelp().
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureHelp(configuration) {
        if (configuration === void 0) return this._helpConfiguration;
        this._helpConfiguration = configuration;
        return this;
      }
      /**
       * The default output goes to stdout and stderr. You can customise this for special
       * applications. You can also customise the display of errors by overriding outputError.
       *
       * The configuration properties are all functions:
       *
       *     // functions to change where being written, stdout and stderr
       *     writeOut(str)
       *     writeErr(str)
       *     // matching functions to specify width for wrapping help
       *     getOutHelpWidth()
       *     getErrHelpWidth()
       *     // functions based on what is being written out
       *     outputError(str, write) // used for displaying errors, and not used for displaying help
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureOutput(configuration) {
        if (configuration === void 0) return this._outputConfiguration;
        Object.assign(this._outputConfiguration, configuration);
        return this;
      }
      /**
       * Display the help or a custom message after an error occurs.
       *
       * @param {(boolean|string)} [displayHelp]
       * @return {Command} `this` command for chaining
       */
      showHelpAfterError(displayHelp = true) {
        if (typeof displayHelp !== "string") displayHelp = !!displayHelp;
        this._showHelpAfterError = displayHelp;
        return this;
      }
      /**
       * Display suggestion of similar commands for unknown commands, or options for unknown options.
       *
       * @param {boolean} [displaySuggestion]
       * @return {Command} `this` command for chaining
       */
      showSuggestionAfterError(displaySuggestion = true) {
        this._showSuggestionAfterError = !!displaySuggestion;
        return this;
      }
      /**
       * Add a prepared subcommand.
       *
       * See .command() for creating an attached subcommand which inherits settings from its parent.
       *
       * @param {Command} cmd - new subcommand
       * @param {object} [opts] - configuration options
       * @return {Command} `this` command for chaining
       */
      addCommand(cmd, opts) {
        if (!cmd._name) {
          throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
        }
        opts = opts || {};
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        if (opts.noHelp || opts.hidden) cmd._hidden = true;
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd._checkForBrokenPassThrough();
        return this;
      }
      /**
       * Factory routine to create a new unattached argument.
       *
       * See .argument() for creating an attached argument, which uses this routine to
       * create the argument. You can override createArgument to return a custom argument.
       *
       * @param {string} name
       * @param {string} [description]
       * @return {Argument} new argument
       */
      createArgument(name, description) {
        return new Argument2(name, description);
      }
      /**
       * Define argument syntax for command.
       *
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @example
       * program.argument('<input-file>');
       * program.argument('[output-file]');
       *
       * @param {string} name
       * @param {string} [description]
       * @param {(Function|*)} [fn] - custom argument processing function
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      argument(name, description, fn, defaultValue) {
        const argument = this.createArgument(name, description);
        if (typeof fn === "function") {
          argument.default(defaultValue).argParser(fn);
        } else {
          argument.default(fn);
        }
        this.addArgument(argument);
        return this;
      }
      /**
       * Define argument syntax for command, adding multiple at once (without descriptions).
       *
       * See also .argument().
       *
       * @example
       * program.arguments('<cmd> [env]');
       *
       * @param {string} names
       * @return {Command} `this` command for chaining
       */
      arguments(names) {
        names
          .trim()
          .split(/ +/)
          .forEach((detail) => {
            this.argument(detail);
          });
        return this;
      }
      /**
       * Define argument syntax for command, adding a prepared argument.
       *
       * @param {Argument} argument
       * @return {Command} `this` command for chaining
       */
      addArgument(argument) {
        const previousArgument = this.registeredArguments.slice(-1)[0];
        if (previousArgument && previousArgument.variadic) {
          throw new Error(
            `only the last argument can be variadic '${previousArgument.name()}'`,
          );
        }
        if (
          argument.required &&
          argument.defaultValue !== void 0 &&
          argument.parseArg === void 0
        ) {
          throw new Error(
            `a default value for a required argument is never used: '${argument.name()}'`,
          );
        }
        this.registeredArguments.push(argument);
        return this;
      }
      /**
       * Customise or override default help command. By default a help command is automatically added if your command has subcommands.
       *
       * @example
       *    program.helpCommand('help [cmd]');
       *    program.helpCommand('help [cmd]', 'show help');
       *    program.helpCommand(false); // suppress default help command
       *    program.helpCommand(true); // add help command even if no subcommands
       *
       * @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
       * @param {string} [description] - custom description
       * @return {Command} `this` command for chaining
       */
      helpCommand(enableOrNameAndArgs, description) {
        if (typeof enableOrNameAndArgs === "boolean") {
          this._addImplicitHelpCommand = enableOrNameAndArgs;
          return this;
        }
        enableOrNameAndArgs = enableOrNameAndArgs ?? "help [command]";
        const [, helpName, helpArgs] =
          enableOrNameAndArgs.match(/([^ ]+) *(.*)/);
        const helpDescription = description ?? "display help for command";
        const helpCommand = this.createCommand(helpName);
        helpCommand.helpOption(false);
        if (helpArgs) helpCommand.arguments(helpArgs);
        if (helpDescription) helpCommand.description(helpDescription);
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        return this;
      }
      /**
       * Add prepared custom help command.
       *
       * @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
       * @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
       * @return {Command} `this` command for chaining
       */
      addHelpCommand(helpCommand, deprecatedDescription) {
        if (typeof helpCommand !== "object") {
          this.helpCommand(helpCommand, deprecatedDescription);
          return this;
        }
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        return this;
      }
      /**
       * Lazy create help command.
       *
       * @return {(Command|null)}
       * @package
       */
      _getHelpCommand() {
        const hasImplicitHelpCommand =
          this._addImplicitHelpCommand ??
          (this.commands.length &&
            !this._actionHandler &&
            !this._findCommand("help"));
        if (hasImplicitHelpCommand) {
          if (this._helpCommand === void 0) {
            this.helpCommand(void 0, void 0);
          }
          return this._helpCommand;
        }
        return null;
      }
      /**
       * Add hook for life cycle event.
       *
       * @param {string} event
       * @param {Function} listener
       * @return {Command} `this` command for chaining
       */
      hook(event, listener) {
        const allowedValues = ["preSubcommand", "preAction", "postAction"];
        if (!allowedValues.includes(event)) {
          throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        if (this._lifeCycleHooks[event]) {
          this._lifeCycleHooks[event].push(listener);
        } else {
          this._lifeCycleHooks[event] = [listener];
        }
        return this;
      }
      /**
       * Register callback to use as replacement for calling process.exit.
       *
       * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
       * @return {Command} `this` command for chaining
       */
      exitOverride(fn) {
        if (fn) {
          this._exitCallback = fn;
        } else {
          this._exitCallback = (err) => {
            if (err.code !== "commander.executeSubCommandAsync") {
              throw err;
            } else {
            }
          };
        }
        return this;
      }
      /**
       * Call process.exit, and _exitCallback if defined.
       *
       * @param {number} exitCode exit code for using with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       * @return never
       * @private
       */
      _exit(exitCode, code, message) {
        if (this._exitCallback) {
          this._exitCallback(new CommanderError2(exitCode, code, message));
        }
        process3.exit(exitCode);
      }
      /**
       * Register callback `fn` for the command.
       *
       * @example
       * program
       *   .command('serve')
       *   .description('start service')
       *   .action(function() {
       *      // do work here
       *   });
       *
       * @param {Function} fn
       * @return {Command} `this` command for chaining
       */
      action(fn) {
        const listener = (args) => {
          const expectedArgsCount = this.registeredArguments.length;
          const actionArgs = args.slice(0, expectedArgsCount);
          if (this._storeOptionsAsProperties) {
            actionArgs[expectedArgsCount] = this;
          } else {
            actionArgs[expectedArgsCount] = this.opts();
          }
          actionArgs.push(this);
          return fn.apply(this, actionArgs);
        };
        this._actionHandler = listener;
        return this;
      }
      /**
       * Factory routine to create a new unattached option.
       *
       * See .option() for creating an attached option, which uses this routine to
       * create the option. You can override createOption to return a custom option.
       *
       * @param {string} flags
       * @param {string} [description]
       * @return {Option} new option
       */
      createOption(flags, description) {
        return new Option2(flags, description);
      }
      /**
       * Wrap parseArgs to catch 'commander.invalidArgument'.
       *
       * @param {(Option | Argument)} target
       * @param {string} value
       * @param {*} previous
       * @param {string} invalidArgumentMessage
       * @private
       */
      _callParseArg(target, value, previous, invalidArgumentMessage) {
        try {
          return target.parseArg(value, previous);
        } catch (err) {
          if (err.code === "commander.invalidArgument") {
            const message = `${invalidArgumentMessage} ${err.message}`;
            this.error(message, { exitCode: err.exitCode, code: err.code });
          }
          throw err;
        }
      }
      /**
       * Check for option flag conflicts.
       * Register option if no conflicts found, or throw on conflict.
       *
       * @param {Option} option
       * @private
       */
      _registerOption(option) {
        const matchingOption =
          (option.short && this._findOption(option.short)) ||
          (option.long && this._findOption(option.long));
        if (matchingOption) {
          const matchingFlag =
            option.long && this._findOption(option.long)
              ? option.long
              : option.short;
          throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
        }
        this.options.push(option);
      }
      /**
       * Check for command name and alias conflicts with existing commands.
       * Register command if no conflicts found, or throw on conflict.
       *
       * @param {Command} command
       * @private
       */
      _registerCommand(command) {
        const knownBy = (cmd) => {
          return [cmd.name()].concat(cmd.aliases());
        };
        const alreadyUsed = knownBy(command).find((name) =>
          this._findCommand(name),
        );
        if (alreadyUsed) {
          const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
          const newCmd = knownBy(command).join("|");
          throw new Error(
            `cannot add command '${newCmd}' as already have command '${existingCmd}'`,
          );
        }
        this.commands.push(command);
      }
      /**
       * Add an option.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addOption(option) {
        this._registerOption(option);
        const oname = option.name();
        const name = option.attributeName();
        if (option.negate) {
          const positiveLongFlag = option.long.replace(/^--no-/, "--");
          if (!this._findOption(positiveLongFlag)) {
            this.setOptionValueWithSource(
              name,
              option.defaultValue === void 0 ? true : option.defaultValue,
              "default",
            );
          }
        } else if (option.defaultValue !== void 0) {
          this.setOptionValueWithSource(name, option.defaultValue, "default");
        }
        const handleOptionValue = (val, invalidValueMessage, valueSource) => {
          if (val == null && option.presetArg !== void 0) {
            val = option.presetArg;
          }
          const oldValue = this.getOptionValue(name);
          if (val !== null && option.parseArg) {
            val = this._callParseArg(
              option,
              val,
              oldValue,
              invalidValueMessage,
            );
          } else if (val !== null && option.variadic) {
            val = option._concatValue(val, oldValue);
          }
          if (val == null) {
            if (option.negate) {
              val = false;
            } else if (option.isBoolean() || option.optional) {
              val = true;
            } else {
              val = "";
            }
          }
          this.setOptionValueWithSource(name, val, valueSource);
        };
        this.on("option:" + oname, (val) => {
          const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, "cli");
        });
        if (option.envVar) {
          this.on("optionEnv:" + oname, (val) => {
            const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
            handleOptionValue(val, invalidValueMessage, "env");
          });
        }
        return this;
      }
      /**
       * Internal implementation shared by .option() and .requiredOption()
       *
       * @return {Command} `this` command for chaining
       * @private
       */
      _optionEx(config, flags, description, fn, defaultValue) {
        if (typeof flags === "object" && flags instanceof Option2) {
          throw new Error(
            "To add an Option object use addOption() instead of option() or requiredOption()",
          );
        }
        const option = this.createOption(flags, description);
        option.makeOptionMandatory(!!config.mandatory);
        if (typeof fn === "function") {
          option.default(defaultValue).argParser(fn);
        } else if (fn instanceof RegExp) {
          const regex = fn;
          fn = (val, def) => {
            const m = regex.exec(val);
            return m ? m[0] : def;
          };
          option.default(defaultValue).argParser(fn);
        } else {
          option.default(fn);
        }
        return this.addOption(option);
      }
      /**
       * Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
       * option-argument is indicated by `<>` and an optional option-argument by `[]`.
       *
       * See the README for more details, and see also addOption() and requiredOption().
       *
       * @example
       * program
       *     .option('-p, --pepper', 'add pepper')
       *     .option('-p, --pizza-type <TYPE>', 'type of pizza') // required option-argument
       *     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
       *     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      option(flags, description, parseArg, defaultValue) {
        return this._optionEx({}, flags, description, parseArg, defaultValue);
      }
      /**
       * Add a required option which must have a value after parsing. This usually means
       * the option must be specified on the command line. (Otherwise the same as .option().)
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      requiredOption(flags, description, parseArg, defaultValue) {
        return this._optionEx(
          { mandatory: true },
          flags,
          description,
          parseArg,
          defaultValue,
        );
      }
      /**
       * Alter parsing of short flags with optional values.
       *
       * @example
       * // for `.option('-f,--flag [value]'):
       * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
       * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
       *
       * @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
       * @return {Command} `this` command for chaining
       */
      combineFlagAndOptionalValue(combine = true) {
        this._combineFlagAndOptionalValue = !!combine;
        return this;
      }
      /**
       * Allow unknown options on the command line.
       *
       * @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
       * @return {Command} `this` command for chaining
       */
      allowUnknownOption(allowUnknown = true) {
        this._allowUnknownOption = !!allowUnknown;
        return this;
      }
      /**
       * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
       *
       * @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
       * @return {Command} `this` command for chaining
       */
      allowExcessArguments(allowExcess = true) {
        this._allowExcessArguments = !!allowExcess;
        return this;
      }
      /**
       * Enable positional options. Positional means global options are specified before subcommands which lets
       * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
       * The default behaviour is non-positional and global options may appear anywhere on the command line.
       *
       * @param {boolean} [positional]
       * @return {Command} `this` command for chaining
       */
      enablePositionalOptions(positional = true) {
        this._enablePositionalOptions = !!positional;
        return this;
      }
      /**
       * Pass through options that come after command-arguments rather than treat them as command-options,
       * so actual command-options come before command-arguments. Turning this on for a subcommand requires
       * positional options to have been enabled on the program (parent commands).
       * The default behaviour is non-positional and options may appear before or after command-arguments.
       *
       * @param {boolean} [passThrough] for unknown options.
       * @return {Command} `this` command for chaining
       */
      passThroughOptions(passThrough = true) {
        this._passThroughOptions = !!passThrough;
        this._checkForBrokenPassThrough();
        return this;
      }
      /**
       * @private
       */
      _checkForBrokenPassThrough() {
        if (
          this.parent &&
          this._passThroughOptions &&
          !this.parent._enablePositionalOptions
        ) {
          throw new Error(
            `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`,
          );
        }
      }
      /**
       * Whether to store option values as properties on command object,
       * or store separately (specify false). In both cases the option values can be accessed using .opts().
       *
       * @param {boolean} [storeAsProperties=true]
       * @return {Command} `this` command for chaining
       */
      storeOptionsAsProperties(storeAsProperties = true) {
        if (this.options.length) {
          throw new Error(
            "call .storeOptionsAsProperties() before adding options",
          );
        }
        if (Object.keys(this._optionValues).length) {
          throw new Error(
            "call .storeOptionsAsProperties() before setting option values",
          );
        }
        this._storeOptionsAsProperties = !!storeAsProperties;
        return this;
      }
      /**
       * Retrieve option value.
       *
       * @param {string} key
       * @return {object} value
       */
      getOptionValue(key) {
        if (this._storeOptionsAsProperties) {
          return this[key];
        }
        return this._optionValues[key];
      }
      /**
       * Store option value.
       *
       * @param {string} key
       * @param {object} value
       * @return {Command} `this` command for chaining
       */
      setOptionValue(key, value) {
        return this.setOptionValueWithSource(key, value, void 0);
      }
      /**
       * Store option value and where the value came from.
       *
       * @param {string} key
       * @param {object} value
       * @param {string} source - expected values are default/config/env/cli/implied
       * @return {Command} `this` command for chaining
       */
      setOptionValueWithSource(key, value, source) {
        if (this._storeOptionsAsProperties) {
          this[key] = value;
        } else {
          this._optionValues[key] = value;
        }
        this._optionValueSources[key] = source;
        return this;
      }
      /**
       * Get source of option value.
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSource(key) {
        return this._optionValueSources[key];
      }
      /**
       * Get source of option value. See also .optsWithGlobals().
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSourceWithGlobals(key) {
        let source;
        this._getCommandAndAncestors().forEach((cmd) => {
          if (cmd.getOptionValueSource(key) !== void 0) {
            source = cmd.getOptionValueSource(key);
          }
        });
        return source;
      }
      /**
       * Get user arguments from implied or explicit arguments.
       * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
       *
       * @private
       */
      _prepareUserArgs(argv, parseOptions) {
        if (argv !== void 0 && !Array.isArray(argv)) {
          throw new Error(
            "first parameter to parse must be array or undefined",
          );
        }
        parseOptions = parseOptions || {};
        if (argv === void 0 && parseOptions.from === void 0) {
          if (process3.versions?.electron) {
            parseOptions.from = "electron";
          }
          const execArgv = process3.execArgv ?? [];
          if (
            execArgv.includes("-e") ||
            execArgv.includes("--eval") ||
            execArgv.includes("-p") ||
            execArgv.includes("--print")
          ) {
            parseOptions.from = "eval";
          }
        }
        if (argv === void 0) {
          argv = process3.argv;
        }
        this.rawArgs = argv.slice();
        let userArgs;
        switch (parseOptions.from) {
          case void 0:
          case "node":
            this._scriptPath = argv[1];
            userArgs = argv.slice(2);
            break;
          case "electron":
            if (process3.defaultApp) {
              this._scriptPath = argv[1];
              userArgs = argv.slice(2);
            } else {
              userArgs = argv.slice(1);
            }
            break;
          case "user":
            userArgs = argv.slice(0);
            break;
          case "eval":
            userArgs = argv.slice(1);
            break;
          default:
            throw new Error(
              `unexpected parse option { from: '${parseOptions.from}' }`,
            );
        }
        if (!this._name && this._scriptPath)
          this.nameFromFilename(this._scriptPath);
        this._name = this._name || "program";
        return userArgs;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Use parseAsync instead of parse if any of your action handlers are async.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * program.parse(); // parse process.argv and auto-detect electron and special node flags
       * program.parse(process.argv); // assume argv[0] is app and argv[1] is script
       * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv] - optional, defaults to process.argv
       * @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
       * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
       * @return {Command} `this` command for chaining
       */
      parse(argv, parseOptions) {
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        this._parseCommand([], userArgs);
        return this;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
       * await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
       * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv]
       * @param {object} [parseOptions]
       * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
       * @return {Promise}
       */
      async parseAsync(argv, parseOptions) {
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        await this._parseCommand([], userArgs);
        return this;
      }
      /**
       * Execute a sub-command executable.
       *
       * @private
       */
      _executeSubCommand(subcommand, args) {
        args = args.slice();
        let launchWithNode = false;
        const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
        function findFile(baseDir, baseName) {
          const localBin = path3.resolve(baseDir, baseName);
          if (fs2.existsSync(localBin)) return localBin;
          if (sourceExt.includes(path3.extname(baseName))) return void 0;
          const foundExt = sourceExt.find((ext) =>
            fs2.existsSync(`${localBin}${ext}`),
          );
          if (foundExt) return `${localBin}${foundExt}`;
          return void 0;
        }
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        let executableFile =
          subcommand._executableFile || `${this._name}-${subcommand._name}`;
        let executableDir = this._executableDir || "";
        if (this._scriptPath) {
          let resolvedScriptPath;
          try {
            resolvedScriptPath = fs2.realpathSync(this._scriptPath);
          } catch (err) {
            resolvedScriptPath = this._scriptPath;
          }
          executableDir = path3.resolve(
            path3.dirname(resolvedScriptPath),
            executableDir,
          );
        }
        if (executableDir) {
          let localFile = findFile(executableDir, executableFile);
          if (!localFile && !subcommand._executableFile && this._scriptPath) {
            const legacyName = path3.basename(
              this._scriptPath,
              path3.extname(this._scriptPath),
            );
            if (legacyName !== this._name) {
              localFile = findFile(
                executableDir,
                `${legacyName}-${subcommand._name}`,
              );
            }
          }
          executableFile = localFile || executableFile;
        }
        launchWithNode = sourceExt.includes(path3.extname(executableFile));
        let proc;
        if (process3.platform !== "win32") {
          if (launchWithNode) {
            args.unshift(executableFile);
            args = incrementNodeInspectorPort(process3.execArgv).concat(args);
            proc = childProcess.spawn(process3.argv[0], args, {
              stdio: "inherit",
            });
          } else {
            proc = childProcess.spawn(executableFile, args, {
              stdio: "inherit",
            });
          }
        } else {
          args.unshift(executableFile);
          args = incrementNodeInspectorPort(process3.execArgv).concat(args);
          proc = childProcess.spawn(process3.execPath, args, {
            stdio: "inherit",
          });
        }
        if (!proc.killed) {
          const signals = ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"];
          signals.forEach((signal) => {
            process3.on(signal, () => {
              if (proc.killed === false && proc.exitCode === null) {
                proc.kill(signal);
              }
            });
          });
        }
        const exitCallback = this._exitCallback;
        proc.on("close", (code) => {
          code = code ?? 1;
          if (!exitCallback) {
            process3.exit(code);
          } else {
            exitCallback(
              new CommanderError2(
                code,
                "commander.executeSubCommandAsync",
                "(close)",
              ),
            );
          }
        });
        proc.on("error", (err) => {
          if (err.code === "ENOENT") {
            const executableDirMessage = executableDir
              ? `searched for local subcommand relative to directory '${executableDir}'`
              : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
            const executableMissing = `'${executableFile}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
            throw new Error(executableMissing);
          } else if (err.code === "EACCES") {
            throw new Error(`'${executableFile}' not executable`);
          }
          if (!exitCallback) {
            process3.exit(1);
          } else {
            const wrappedError = new CommanderError2(
              1,
              "commander.executeSubCommandAsync",
              "(error)",
            );
            wrappedError.nestedError = err;
            exitCallback(wrappedError);
          }
        });
        this.runningCommand = proc;
      }
      /**
       * @private
       */
      _dispatchSubcommand(commandName, operands, unknown) {
        const subCommand = this._findCommand(commandName);
        if (!subCommand) this.help({ error: true });
        let promiseChain;
        promiseChain = this._chainOrCallSubCommandHook(
          promiseChain,
          subCommand,
          "preSubcommand",
        );
        promiseChain = this._chainOrCall(promiseChain, () => {
          if (subCommand._executableHandler) {
            this._executeSubCommand(subCommand, operands.concat(unknown));
          } else {
            return subCommand._parseCommand(operands, unknown);
          }
        });
        return promiseChain;
      }
      /**
       * Invoke help directly if possible, or dispatch if necessary.
       * e.g. help foo
       *
       * @private
       */
      _dispatchHelpCommand(subcommandName) {
        if (!subcommandName) {
          this.help();
        }
        const subCommand = this._findCommand(subcommandName);
        if (subCommand && !subCommand._executableHandler) {
          subCommand.help();
        }
        return this._dispatchSubcommand(
          subcommandName,
          [],
          [
            this._getHelpOption()?.long ??
              this._getHelpOption()?.short ??
              "--help",
          ],
        );
      }
      /**
       * Check this.args against expected this.registeredArguments.
       *
       * @private
       */
      _checkNumberOfArguments() {
        this.registeredArguments.forEach((arg, i) => {
          if (arg.required && this.args[i] == null) {
            this.missingArgument(arg.name());
          }
        });
        if (
          this.registeredArguments.length > 0 &&
          this.registeredArguments[this.registeredArguments.length - 1].variadic
        ) {
          return;
        }
        if (this.args.length > this.registeredArguments.length) {
          this._excessArguments(this.args);
        }
      }
      /**
       * Process this.args using this.registeredArguments and save as this.processedArgs!
       *
       * @private
       */
      _processArguments() {
        const myParseArg = (argument, value, previous) => {
          let parsedValue = value;
          if (value !== null && argument.parseArg) {
            const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
            parsedValue = this._callParseArg(
              argument,
              value,
              previous,
              invalidValueMessage,
            );
          }
          return parsedValue;
        };
        this._checkNumberOfArguments();
        const processedArgs = [];
        this.registeredArguments.forEach((declaredArg, index) => {
          let value = declaredArg.defaultValue;
          if (declaredArg.variadic) {
            if (index < this.args.length) {
              value = this.args.slice(index);
              if (declaredArg.parseArg) {
                value = value.reduce((processed, v) => {
                  return myParseArg(declaredArg, v, processed);
                }, declaredArg.defaultValue);
              }
            } else if (value === void 0) {
              value = [];
            }
          } else if (index < this.args.length) {
            value = this.args[index];
            if (declaredArg.parseArg) {
              value = myParseArg(declaredArg, value, declaredArg.defaultValue);
            }
          }
          processedArgs[index] = value;
        });
        this.processedArgs = processedArgs;
      }
      /**
       * Once we have a promise we chain, but call synchronously until then.
       *
       * @param {(Promise|undefined)} promise
       * @param {Function} fn
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCall(promise, fn) {
        if (promise && promise.then && typeof promise.then === "function") {
          return promise.then(() => fn());
        }
        return fn();
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallHooks(promise, event) {
        let result = promise;
        const hooks = [];
        this._getCommandAndAncestors()
          .reverse()
          .filter((cmd) => cmd._lifeCycleHooks[event] !== void 0)
          .forEach((hookedCommand) => {
            hookedCommand._lifeCycleHooks[event].forEach((callback) => {
              hooks.push({ hookedCommand, callback });
            });
          });
        if (event === "postAction") {
          hooks.reverse();
        }
        hooks.forEach((hookDetail) => {
          result = this._chainOrCall(result, () => {
            return hookDetail.callback(hookDetail.hookedCommand, this);
          });
        });
        return result;
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {Command} subCommand
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallSubCommandHook(promise, subCommand, event) {
        let result = promise;
        if (this._lifeCycleHooks[event] !== void 0) {
          this._lifeCycleHooks[event].forEach((hook) => {
            result = this._chainOrCall(result, () => {
              return hook(this, subCommand);
            });
          });
        }
        return result;
      }
      /**
       * Process arguments in context of this command.
       * Returns action result, in case it is a promise.
       *
       * @private
       */
      _parseCommand(operands, unknown) {
        const parsed = this.parseOptions(unknown);
        this._parseOptionsEnv();
        this._parseOptionsImplied();
        operands = operands.concat(parsed.operands);
        unknown = parsed.unknown;
        this.args = operands.concat(unknown);
        if (operands && this._findCommand(operands[0])) {
          return this._dispatchSubcommand(
            operands[0],
            operands.slice(1),
            unknown,
          );
        }
        if (
          this._getHelpCommand() &&
          operands[0] === this._getHelpCommand().name()
        ) {
          return this._dispatchHelpCommand(operands[1]);
        }
        if (this._defaultCommandName) {
          this._outputHelpIfRequested(unknown);
          return this._dispatchSubcommand(
            this._defaultCommandName,
            operands,
            unknown,
          );
        }
        if (
          this.commands.length &&
          this.args.length === 0 &&
          !this._actionHandler &&
          !this._defaultCommandName
        ) {
          this.help({ error: true });
        }
        this._outputHelpIfRequested(parsed.unknown);
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        const checkForUnknownOptions = () => {
          if (parsed.unknown.length > 0) {
            this.unknownOption(parsed.unknown[0]);
          }
        };
        const commandEvent = `command:${this.name()}`;
        if (this._actionHandler) {
          checkForUnknownOptions();
          this._processArguments();
          let promiseChain;
          promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
          promiseChain = this._chainOrCall(promiseChain, () =>
            this._actionHandler(this.processedArgs),
          );
          if (this.parent) {
            promiseChain = this._chainOrCall(promiseChain, () => {
              this.parent.emit(commandEvent, operands, unknown);
            });
          }
          promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
          return promiseChain;
        }
        if (this.parent && this.parent.listenerCount(commandEvent)) {
          checkForUnknownOptions();
          this._processArguments();
          this.parent.emit(commandEvent, operands, unknown);
        } else if (operands.length) {
          if (this._findCommand("*")) {
            return this._dispatchSubcommand("*", operands, unknown);
          }
          if (this.listenerCount("command:*")) {
            this.emit("command:*", operands, unknown);
          } else if (this.commands.length) {
            this.unknownCommand();
          } else {
            checkForUnknownOptions();
            this._processArguments();
          }
        } else if (this.commands.length) {
          checkForUnknownOptions();
          this.help({ error: true });
        } else {
          checkForUnknownOptions();
          this._processArguments();
        }
      }
      /**
       * Find matching command.
       *
       * @private
       * @return {Command | undefined}
       */
      _findCommand(name) {
        if (!name) return void 0;
        return this.commands.find(
          (cmd) => cmd._name === name || cmd._aliases.includes(name),
        );
      }
      /**
       * Return an option matching `arg` if any.
       *
       * @param {string} arg
       * @return {Option}
       * @package
       */
      _findOption(arg) {
        return this.options.find((option) => option.is(arg));
      }
      /**
       * Display an error message if a mandatory option does not have a value.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForMissingMandatoryOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd.options.forEach((anOption) => {
            if (
              anOption.mandatory &&
              cmd.getOptionValue(anOption.attributeName()) === void 0
            ) {
              cmd.missingMandatoryOptionValue(anOption);
            }
          });
        });
      }
      /**
       * Display an error message if conflicting options are used together in this.
       *
       * @private
       */
      _checkForConflictingLocalOptions() {
        const definedNonDefaultOptions = this.options.filter((option) => {
          const optionKey = option.attributeName();
          if (this.getOptionValue(optionKey) === void 0) {
            return false;
          }
          return this.getOptionValueSource(optionKey) !== "default";
        });
        const optionsWithConflicting = definedNonDefaultOptions.filter(
          (option) => option.conflictsWith.length > 0,
        );
        optionsWithConflicting.forEach((option) => {
          const conflictingAndDefined = definedNonDefaultOptions.find(
            (defined) => option.conflictsWith.includes(defined.attributeName()),
          );
          if (conflictingAndDefined) {
            this._conflictingOption(option, conflictingAndDefined);
          }
        });
      }
      /**
       * Display an error message if conflicting options are used together.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForConflictingOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd._checkForConflictingLocalOptions();
        });
      }
      /**
       * Parse options from `argv` removing known options,
       * and return argv split into operands and unknown arguments.
       *
       * Examples:
       *
       *     argv => operands, unknown
       *     --known kkk op => [op], []
       *     op --known kkk => [op], []
       *     sub --unknown uuu op => [sub], [--unknown uuu op]
       *     sub -- --unknown uuu op => [sub --unknown uuu op], []
       *
       * @param {string[]} argv
       * @return {{operands: string[], unknown: string[]}}
       */
      parseOptions(argv) {
        const operands = [];
        const unknown = [];
        let dest = operands;
        const args = argv.slice();
        function maybeOption(arg) {
          return arg.length > 1 && arg[0] === "-";
        }
        let activeVariadicOption = null;
        while (args.length) {
          const arg = args.shift();
          if (arg === "--") {
            if (dest === unknown) dest.push(arg);
            dest.push(...args);
            break;
          }
          if (activeVariadicOption && !maybeOption(arg)) {
            this.emit(`option:${activeVariadicOption.name()}`, arg);
            continue;
          }
          activeVariadicOption = null;
          if (maybeOption(arg)) {
            const option = this._findOption(arg);
            if (option) {
              if (option.required) {
                const value = args.shift();
                if (value === void 0) this.optionMissingArgument(option);
                this.emit(`option:${option.name()}`, value);
              } else if (option.optional) {
                let value = null;
                if (args.length > 0 && !maybeOption(args[0])) {
                  value = args.shift();
                }
                this.emit(`option:${option.name()}`, value);
              } else {
                this.emit(`option:${option.name()}`);
              }
              activeVariadicOption = option.variadic ? option : null;
              continue;
            }
          }
          if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
            const option = this._findOption(`-${arg[1]}`);
            if (option) {
              if (
                option.required ||
                (option.optional && this._combineFlagAndOptionalValue)
              ) {
                this.emit(`option:${option.name()}`, arg.slice(2));
              } else {
                this.emit(`option:${option.name()}`);
                args.unshift(`-${arg.slice(2)}`);
              }
              continue;
            }
          }
          if (/^--[^=]+=/.test(arg)) {
            const index = arg.indexOf("=");
            const option = this._findOption(arg.slice(0, index));
            if (option && (option.required || option.optional)) {
              this.emit(`option:${option.name()}`, arg.slice(index + 1));
              continue;
            }
          }
          if (maybeOption(arg)) {
            dest = unknown;
          }
          if (
            (this._enablePositionalOptions || this._passThroughOptions) &&
            operands.length === 0 &&
            unknown.length === 0
          ) {
            if (this._findCommand(arg)) {
              operands.push(arg);
              if (args.length > 0) unknown.push(...args);
              break;
            } else if (
              this._getHelpCommand() &&
              arg === this._getHelpCommand().name()
            ) {
              operands.push(arg);
              if (args.length > 0) operands.push(...args);
              break;
            } else if (this._defaultCommandName) {
              unknown.push(arg);
              if (args.length > 0) unknown.push(...args);
              break;
            }
          }
          if (this._passThroughOptions) {
            dest.push(arg);
            if (args.length > 0) dest.push(...args);
            break;
          }
          dest.push(arg);
        }
        return { operands, unknown };
      }
      /**
       * Return an object containing local option values as key-value pairs.
       *
       * @return {object}
       */
      opts() {
        if (this._storeOptionsAsProperties) {
          const result = {};
          const len = this.options.length;
          for (let i = 0; i < len; i++) {
            const key = this.options[i].attributeName();
            result[key] =
              key === this._versionOptionName ? this._version : this[key];
          }
          return result;
        }
        return this._optionValues;
      }
      /**
       * Return an object containing merged local and global option values as key-value pairs.
       *
       * @return {object}
       */
      optsWithGlobals() {
        return this._getCommandAndAncestors().reduce(
          (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
          {},
        );
      }
      /**
       * Display error message and exit (or call exitOverride).
       *
       * @param {string} message
       * @param {object} [errorOptions]
       * @param {string} [errorOptions.code] - an id string representing the error
       * @param {number} [errorOptions.exitCode] - used with process.exit
       */
      error(message, errorOptions) {
        this._outputConfiguration.outputError(
          `${message}
`,
          this._outputConfiguration.writeErr,
        );
        if (typeof this._showHelpAfterError === "string") {
          this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
        } else if (this._showHelpAfterError) {
          this._outputConfiguration.writeErr("\n");
          this.outputHelp({ error: true });
        }
        const config = errorOptions || {};
        const exitCode = config.exitCode || 1;
        const code = config.code || "commander.error";
        this._exit(exitCode, code, message);
      }
      /**
       * Apply any option related environment variables, if option does
       * not have a value from cli or client code.
       *
       * @private
       */
      _parseOptionsEnv() {
        this.options.forEach((option) => {
          if (option.envVar && option.envVar in process3.env) {
            const optionKey = option.attributeName();
            if (
              this.getOptionValue(optionKey) === void 0 ||
              ["default", "config", "env"].includes(
                this.getOptionValueSource(optionKey),
              )
            ) {
              if (option.required || option.optional) {
                this.emit(
                  `optionEnv:${option.name()}`,
                  process3.env[option.envVar],
                );
              } else {
                this.emit(`optionEnv:${option.name()}`);
              }
            }
          }
        });
      }
      /**
       * Apply any implied option values, if option is undefined or default value.
       *
       * @private
       */
      _parseOptionsImplied() {
        const dualHelper = new DualOptions(this.options);
        const hasCustomOptionValue = (optionKey) => {
          return (
            this.getOptionValue(optionKey) !== void 0 &&
            !["default", "implied"].includes(
              this.getOptionValueSource(optionKey),
            )
          );
        };
        this.options
          .filter(
            (option) =>
              option.implied !== void 0 &&
              hasCustomOptionValue(option.attributeName()) &&
              dualHelper.valueFromOption(
                this.getOptionValue(option.attributeName()),
                option,
              ),
          )
          .forEach((option) => {
            Object.keys(option.implied)
              .filter((impliedKey) => !hasCustomOptionValue(impliedKey))
              .forEach((impliedKey) => {
                this.setOptionValueWithSource(
                  impliedKey,
                  option.implied[impliedKey],
                  "implied",
                );
              });
          });
      }
      /**
       * Argument `name` is missing.
       *
       * @param {string} name
       * @private
       */
      missingArgument(name) {
        const message = `error: missing required argument '${name}'`;
        this.error(message, { code: "commander.missingArgument" });
      }
      /**
       * `Option` is missing an argument.
       *
       * @param {Option} option
       * @private
       */
      optionMissingArgument(option) {
        const message = `error: option '${option.flags}' argument missing`;
        this.error(message, { code: "commander.optionMissingArgument" });
      }
      /**
       * `Option` does not have a value, and is a mandatory option.
       *
       * @param {Option} option
       * @private
       */
      missingMandatoryOptionValue(option) {
        const message = `error: required option '${option.flags}' not specified`;
        this.error(message, { code: "commander.missingMandatoryOptionValue" });
      }
      /**
       * `Option` conflicts with another option.
       *
       * @param {Option} option
       * @param {Option} conflictingOption
       * @private
       */
      _conflictingOption(option, conflictingOption) {
        const findBestOptionFromValue = (option2) => {
          const optionKey = option2.attributeName();
          const optionValue = this.getOptionValue(optionKey);
          const negativeOption = this.options.find(
            (target) => target.negate && optionKey === target.attributeName(),
          );
          const positiveOption = this.options.find(
            (target) => !target.negate && optionKey === target.attributeName(),
          );
          if (
            negativeOption &&
            ((negativeOption.presetArg === void 0 && optionValue === false) ||
              (negativeOption.presetArg !== void 0 &&
                optionValue === negativeOption.presetArg))
          ) {
            return negativeOption;
          }
          return positiveOption || option2;
        };
        const getErrorMessage = (option2) => {
          const bestOption = findBestOptionFromValue(option2);
          const optionKey = bestOption.attributeName();
          const source = this.getOptionValueSource(optionKey);
          if (source === "env") {
            return `environment variable '${bestOption.envVar}'`;
          }
          return `option '${bestOption.flags}'`;
        };
        const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
        this.error(message, { code: "commander.conflictingOption" });
      }
      /**
       * Unknown option `flag`.
       *
       * @param {string} flag
       * @private
       */
      unknownOption(flag) {
        if (this._allowUnknownOption) return;
        let suggestion = "";
        if (flag.startsWith("--") && this._showSuggestionAfterError) {
          let candidateFlags = [];
          let command = this;
          do {
            const moreFlags = command
              .createHelp()
              .visibleOptions(command)
              .filter((option) => option.long)
              .map((option) => option.long);
            candidateFlags = candidateFlags.concat(moreFlags);
            command = command.parent;
          } while (command && !command._enablePositionalOptions);
          suggestion = suggestSimilar(flag, candidateFlags);
        }
        const message = `error: unknown option '${flag}'${suggestion}`;
        this.error(message, { code: "commander.unknownOption" });
      }
      /**
       * Excess arguments, more than expected.
       *
       * @param {string[]} receivedArgs
       * @private
       */
      _excessArguments(receivedArgs) {
        if (this._allowExcessArguments) return;
        const expected = this.registeredArguments.length;
        const s = expected === 1 ? "" : "s";
        const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
        const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
        this.error(message, { code: "commander.excessArguments" });
      }
      /**
       * Unknown command.
       *
       * @private
       */
      unknownCommand() {
        const unknownName = this.args[0];
        let suggestion = "";
        if (this._showSuggestionAfterError) {
          const candidateNames = [];
          this.createHelp()
            .visibleCommands(this)
            .forEach((command) => {
              candidateNames.push(command.name());
              if (command.alias()) candidateNames.push(command.alias());
            });
          suggestion = suggestSimilar(unknownName, candidateNames);
        }
        const message = `error: unknown command '${unknownName}'${suggestion}`;
        this.error(message, { code: "commander.unknownCommand" });
      }
      /**
       * Get or set the program version.
       *
       * This method auto-registers the "-V, --version" option which will print the version number.
       *
       * You can optionally supply the flags and description to override the defaults.
       *
       * @param {string} [str]
       * @param {string} [flags]
       * @param {string} [description]
       * @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
       */
      version(str, flags, description) {
        if (str === void 0) return this._version;
        this._version = str;
        flags = flags || "-V, --version";
        description = description || "output the version number";
        const versionOption = this.createOption(flags, description);
        this._versionOptionName = versionOption.attributeName();
        this._registerOption(versionOption);
        this.on("option:" + versionOption.name(), () => {
          this._outputConfiguration.writeOut(`${str}
`);
          this._exit(0, "commander.version", str);
        });
        return this;
      }
      /**
       * Set the description.
       *
       * @param {string} [str]
       * @param {object} [argsDescription]
       * @return {(string|Command)}
       */
      description(str, argsDescription) {
        if (str === void 0 && argsDescription === void 0)
          return this._description;
        this._description = str;
        if (argsDescription) {
          this._argsDescription = argsDescription;
        }
        return this;
      }
      /**
       * Set the summary. Used when listed as subcommand of parent.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      summary(str) {
        if (str === void 0) return this._summary;
        this._summary = str;
        return this;
      }
      /**
       * Set an alias for the command.
       *
       * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
       *
       * @param {string} [alias]
       * @return {(string|Command)}
       */
      alias(alias) {
        if (alias === void 0) return this._aliases[0];
        let command = this;
        if (
          this.commands.length !== 0 &&
          this.commands[this.commands.length - 1]._executableHandler
        ) {
          command = this.commands[this.commands.length - 1];
        }
        if (alias === command._name)
          throw new Error("Command alias can't be the same as its name");
        const matchingCommand = this.parent?._findCommand(alias);
        if (matchingCommand) {
          const existingCmd = [matchingCommand.name()]
            .concat(matchingCommand.aliases())
            .join("|");
          throw new Error(
            `cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`,
          );
        }
        command._aliases.push(alias);
        return this;
      }
      /**
       * Set aliases for the command.
       *
       * Only the first alias is shown in the auto-generated help.
       *
       * @param {string[]} [aliases]
       * @return {(string[]|Command)}
       */
      aliases(aliases) {
        if (aliases === void 0) return this._aliases;
        aliases.forEach((alias) => this.alias(alias));
        return this;
      }
      /**
       * Set / get the command usage `str`.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      usage(str) {
        if (str === void 0) {
          if (this._usage) return this._usage;
          const args = this.registeredArguments.map((arg) => {
            return humanReadableArgName(arg);
          });
          return []
            .concat(
              this.options.length || this._helpOption !== null
                ? "[options]"
                : [],
              this.commands.length ? "[command]" : [],
              this.registeredArguments.length ? args : [],
            )
            .join(" ");
        }
        this._usage = str;
        return this;
      }
      /**
       * Get or set the name of the command.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      name(str) {
        if (str === void 0) return this._name;
        this._name = str;
        return this;
      }
      /**
       * Set the name of the command from script filename, such as process.argv[1],
       * or require.main.filename, or __filename.
       *
       * (Used internally and public although not documented in README.)
       *
       * @example
       * program.nameFromFilename(require.main.filename);
       *
       * @param {string} filename
       * @return {Command}
       */
      nameFromFilename(filename) {
        this._name = path3.basename(filename, path3.extname(filename));
        return this;
      }
      /**
       * Get or set the directory for searching for executable subcommands of this command.
       *
       * @example
       * program.executableDir(__dirname);
       * // or
       * program.executableDir('subcommands');
       *
       * @param {string} [path]
       * @return {(string|null|Command)}
       */
      executableDir(path4) {
        if (path4 === void 0) return this._executableDir;
        this._executableDir = path4;
        return this;
      }
      /**
       * Return program help documentation.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
       * @return {string}
       */
      helpInformation(contextOptions) {
        const helper = this.createHelp();
        if (helper.helpWidth === void 0) {
          helper.helpWidth =
            contextOptions && contextOptions.error
              ? this._outputConfiguration.getErrHelpWidth()
              : this._outputConfiguration.getOutHelpWidth();
        }
        return helper.formatHelp(this, helper);
      }
      /**
       * @private
       */
      _getHelpContext(contextOptions) {
        contextOptions = contextOptions || {};
        const context = { error: !!contextOptions.error };
        let write;
        if (context.error) {
          write = (arg) => this._outputConfiguration.writeErr(arg);
        } else {
          write = (arg) => this._outputConfiguration.writeOut(arg);
        }
        context.write = contextOptions.write || write;
        context.command = this;
        return context;
      }
      /**
       * Output help information for this command.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      outputHelp(contextOptions) {
        let deprecatedCallback;
        if (typeof contextOptions === "function") {
          deprecatedCallback = contextOptions;
          contextOptions = void 0;
        }
        const context = this._getHelpContext(contextOptions);
        this._getCommandAndAncestors()
          .reverse()
          .forEach((command) => command.emit("beforeAllHelp", context));
        this.emit("beforeHelp", context);
        let helpInformation = this.helpInformation(context);
        if (deprecatedCallback) {
          helpInformation = deprecatedCallback(helpInformation);
          if (
            typeof helpInformation !== "string" &&
            !Buffer.isBuffer(helpInformation)
          ) {
            throw new Error(
              "outputHelp callback must return a string or a Buffer",
            );
          }
        }
        context.write(helpInformation);
        if (this._getHelpOption()?.long) {
          this.emit(this._getHelpOption().long);
        }
        this.emit("afterHelp", context);
        this._getCommandAndAncestors().forEach((command) =>
          command.emit("afterAllHelp", context),
        );
      }
      /**
       * You can pass in flags and a description to customise the built-in help option.
       * Pass in false to disable the built-in help option.
       *
       * @example
       * program.helpOption('-?, --help' 'show help'); // customise
       * program.helpOption(false); // disable
       *
       * @param {(string | boolean)} flags
       * @param {string} [description]
       * @return {Command} `this` command for chaining
       */
      helpOption(flags, description) {
        if (typeof flags === "boolean") {
          if (flags) {
            this._helpOption = this._helpOption ?? void 0;
          } else {
            this._helpOption = null;
          }
          return this;
        }
        flags = flags ?? "-h, --help";
        description = description ?? "display help for command";
        this._helpOption = this.createOption(flags, description);
        return this;
      }
      /**
       * Lazy create help option.
       * Returns null if has been disabled with .helpOption(false).
       *
       * @returns {(Option | null)} the help option
       * @package
       */
      _getHelpOption() {
        if (this._helpOption === void 0) {
          this.helpOption(void 0, void 0);
        }
        return this._helpOption;
      }
      /**
       * Supply your own option to use for the built-in help option.
       * This is an alternative to using helpOption() to customise the flags and description etc.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addHelpOption(option) {
        this._helpOption = option;
        return this;
      }
      /**
       * Output help information and exit.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      help(contextOptions) {
        this.outputHelp(contextOptions);
        let exitCode = process3.exitCode || 0;
        if (
          exitCode === 0 &&
          contextOptions &&
          typeof contextOptions !== "function" &&
          contextOptions.error
        ) {
          exitCode = 1;
        }
        this._exit(exitCode, "commander.help", "(outputHelp)");
      }
      /**
       * Add additional text to be displayed with the built-in help.
       *
       * Position is 'before' or 'after' to affect just this command,
       * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
       *
       * @param {string} position - before or after built-in help
       * @param {(string | Function)} text - string to add, or a function returning a string
       * @return {Command} `this` command for chaining
       */
      addHelpText(position, text) {
        const allowedValues = ["beforeAll", "before", "after", "afterAll"];
        if (!allowedValues.includes(position)) {
          throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        const helpEvent = `${position}Help`;
        this.on(helpEvent, (context) => {
          let helpStr;
          if (typeof text === "function") {
            helpStr = text({ error: context.error, command: context.command });
          } else {
            helpStr = text;
          }
          if (helpStr) {
            context.write(`${helpStr}
`);
          }
        });
        return this;
      }
      /**
       * Output help information if help flags specified
       *
       * @param {Array} args - array of options to search for help flags
       * @private
       */
      _outputHelpIfRequested(args) {
        const helpOption = this._getHelpOption();
        const helpRequested =
          helpOption && args.find((arg) => helpOption.is(arg));
        if (helpRequested) {
          this.outputHelp();
          this._exit(0, "commander.helpDisplayed", "(outputHelp)");
        }
      }
    };
    function incrementNodeInspectorPort(args) {
      return args.map((arg) => {
        if (!arg.startsWith("--inspect")) {
          return arg;
        }
        let debugOption;
        let debugHost = "127.0.0.1";
        let debugPort = "9229";
        let match;
        if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
          debugOption = match[1];
        } else if (
          (match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null
        ) {
          debugOption = match[1];
          if (/^\d+$/.test(match[3])) {
            debugPort = match[3];
          } else {
            debugHost = match[3];
          }
        } else if (
          (match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !==
          null
        ) {
          debugOption = match[1];
          debugHost = match[3];
          debugPort = match[4];
        }
        if (debugOption && debugPort !== "0") {
          return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
        }
        return arg;
      });
    }
    exports2.Command = Command2;
  },
});

// node_modules/commander/index.js
var require_commander = __commonJS({
  "node_modules/commander/index.js"(exports2) {
    var { Argument: Argument2 } = require_argument();
    var { Command: Command2 } = require_command();
    var {
      CommanderError: CommanderError2,
      InvalidArgumentError: InvalidArgumentError2,
    } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2 } = require_option();
    exports2.program = new Command2();
    exports2.createCommand = (name) => new Command2(name);
    exports2.createOption = (flags, description) =>
      new Option2(flags, description);
    exports2.createArgument = (name, description) =>
      new Argument2(name, description);
    exports2.Command = Command2;
    exports2.Option = Option2;
    exports2.Argument = Argument2;
    exports2.Help = Help2;
    exports2.CommanderError = CommanderError2;
    exports2.InvalidArgumentError = InvalidArgumentError2;
    exports2.InvalidOptionArgumentError = InvalidArgumentError2;
  },
});

// node_modules/@commander-js/extra-typings/index.js
var require_extra_typings = __commonJS({
  "node_modules/@commander-js/extra-typings/index.js"(exports2, module2) {
    var commander = require_commander();
    exports2 = module2.exports = {};
    exports2.program = new commander.Command();
    exports2.Argument = commander.Argument;
    exports2.Command = commander.Command;
    exports2.CommanderError = commander.CommanderError;
    exports2.Help = commander.Help;
    exports2.InvalidArgumentError = commander.InvalidArgumentError;
    exports2.InvalidOptionArgumentError = commander.InvalidArgumentError;
    exports2.Option = commander.Option;
    exports2.createCommand = (name) => new commander.Command(name);
    exports2.createOption = (flags, description) =>
      new commander.Option(flags, description);
    exports2.createArgument = (name, description) =>
      new commander.Argument(name, description);
  },
});

// node_modules/delayed-stream/lib/delayed_stream.js
var require_delayed_stream = __commonJS({
  "node_modules/delayed-stream/lib/delayed_stream.js"(exports2, module2) {
    var Stream = require("stream").Stream;
    var util2 = require("util");
    module2.exports = DelayedStream;
    function DelayedStream() {
      this.source = null;
      this.dataSize = 0;
      this.maxDataSize = 1024 * 1024;
      this.pauseStream = true;
      this._maxDataSizeExceeded = false;
      this._released = false;
      this._bufferedEvents = [];
    }
    util2.inherits(DelayedStream, Stream);
    DelayedStream.create = function (source, options) {
      var delayedStream = new this();
      options = options || {};
      for (var option in options) {
        delayedStream[option] = options[option];
      }
      delayedStream.source = source;
      var realEmit = source.emit;
      source.emit = function () {
        delayedStream._handleEmit(arguments);
        return realEmit.apply(source, arguments);
      };
      source.on("error", function () {});
      if (delayedStream.pauseStream) {
        source.pause();
      }
      return delayedStream;
    };
    Object.defineProperty(DelayedStream.prototype, "readable", {
      configurable: true,
      enumerable: true,
      get: function () {
        return this.source.readable;
      },
    });
    DelayedStream.prototype.setEncoding = function () {
      return this.source.setEncoding.apply(this.source, arguments);
    };
    DelayedStream.prototype.resume = function () {
      if (!this._released) {
        this.release();
      }
      this.source.resume();
    };
    DelayedStream.prototype.pause = function () {
      this.source.pause();
    };
    DelayedStream.prototype.release = function () {
      this._released = true;
      this._bufferedEvents.forEach(
        function (args) {
          this.emit.apply(this, args);
        }.bind(this),
      );
      this._bufferedEvents = [];
    };
    DelayedStream.prototype.pipe = function () {
      var r = Stream.prototype.pipe.apply(this, arguments);
      this.resume();
      return r;
    };
    DelayedStream.prototype._handleEmit = function (args) {
      if (this._released) {
        this.emit.apply(this, args);
        return;
      }
      if (args[0] === "data") {
        this.dataSize += args[1].length;
        this._checkIfMaxDataSizeExceeded();
      }
      this._bufferedEvents.push(args);
    };
    DelayedStream.prototype._checkIfMaxDataSizeExceeded = function () {
      if (this._maxDataSizeExceeded) {
        return;
      }
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      this._maxDataSizeExceeded = true;
      var message =
        "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this.emit("error", new Error(message));
    };
  },
});

// node_modules/combined-stream/lib/combined_stream.js
var require_combined_stream = __commonJS({
  "node_modules/combined-stream/lib/combined_stream.js"(exports2, module2) {
    var util2 = require("util");
    var Stream = require("stream").Stream;
    var DelayedStream = require_delayed_stream();
    module2.exports = CombinedStream;
    function CombinedStream() {
      this.writable = false;
      this.readable = true;
      this.dataSize = 0;
      this.maxDataSize = 2 * 1024 * 1024;
      this.pauseStreams = true;
      this._released = false;
      this._streams = [];
      this._currentStream = null;
      this._insideLoop = false;
      this._pendingNext = false;
    }
    util2.inherits(CombinedStream, Stream);
    CombinedStream.create = function (options) {
      var combinedStream = new this();
      options = options || {};
      for (var option in options) {
        combinedStream[option] = options[option];
      }
      return combinedStream;
    };
    CombinedStream.isStreamLike = function (stream4) {
      return (
        typeof stream4 !== "function" &&
        typeof stream4 !== "string" &&
        typeof stream4 !== "boolean" &&
        typeof stream4 !== "number" &&
        !Buffer.isBuffer(stream4)
      );
    };
    CombinedStream.prototype.append = function (stream4) {
      var isStreamLike = CombinedStream.isStreamLike(stream4);
      if (isStreamLike) {
        if (!(stream4 instanceof DelayedStream)) {
          var newStream = DelayedStream.create(stream4, {
            maxDataSize: Infinity,
            pauseStream: this.pauseStreams,
          });
          stream4.on("data", this._checkDataSize.bind(this));
          stream4 = newStream;
        }
        this._handleErrors(stream4);
        if (this.pauseStreams) {
          stream4.pause();
        }
      }
      this._streams.push(stream4);
      return this;
    };
    CombinedStream.prototype.pipe = function (dest, options) {
      Stream.prototype.pipe.call(this, dest, options);
      this.resume();
      return dest;
    };
    CombinedStream.prototype._getNext = function () {
      this._currentStream = null;
      if (this._insideLoop) {
        this._pendingNext = true;
        return;
      }
      this._insideLoop = true;
      try {
        do {
          this._pendingNext = false;
          this._realGetNext();
        } while (this._pendingNext);
      } finally {
        this._insideLoop = false;
      }
    };
    CombinedStream.prototype._realGetNext = function () {
      var stream4 = this._streams.shift();
      if (typeof stream4 == "undefined") {
        this.end();
        return;
      }
      if (typeof stream4 !== "function") {
        this._pipeNext(stream4);
        return;
      }
      var getStream = stream4;
      getStream(
        function (stream5) {
          var isStreamLike = CombinedStream.isStreamLike(stream5);
          if (isStreamLike) {
            stream5.on("data", this._checkDataSize.bind(this));
            this._handleErrors(stream5);
          }
          this._pipeNext(stream5);
        }.bind(this),
      );
    };
    CombinedStream.prototype._pipeNext = function (stream4) {
      this._currentStream = stream4;
      var isStreamLike = CombinedStream.isStreamLike(stream4);
      if (isStreamLike) {
        stream4.on("end", this._getNext.bind(this));
        stream4.pipe(this, { end: false });
        return;
      }
      var value = stream4;
      this.write(value);
      this._getNext();
    };
    CombinedStream.prototype._handleErrors = function (stream4) {
      var self2 = this;
      stream4.on("error", function (err) {
        self2._emitError(err);
      });
    };
    CombinedStream.prototype.write = function (data) {
      this.emit("data", data);
    };
    CombinedStream.prototype.pause = function () {
      if (!this.pauseStreams) {
        return;
      }
      if (
        this.pauseStreams &&
        this._currentStream &&
        typeof this._currentStream.pause == "function"
      )
        this._currentStream.pause();
      this.emit("pause");
    };
    CombinedStream.prototype.resume = function () {
      if (!this._released) {
        this._released = true;
        this.writable = true;
        this._getNext();
      }
      if (
        this.pauseStreams &&
        this._currentStream &&
        typeof this._currentStream.resume == "function"
      )
        this._currentStream.resume();
      this.emit("resume");
    };
    CombinedStream.prototype.end = function () {
      this._reset();
      this.emit("end");
    };
    CombinedStream.prototype.destroy = function () {
      this._reset();
      this.emit("close");
    };
    CombinedStream.prototype._reset = function () {
      this.writable = false;
      this._streams = [];
      this._currentStream = null;
    };
    CombinedStream.prototype._checkDataSize = function () {
      this._updateDataSize();
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      var message =
        "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this._emitError(new Error(message));
    };
    CombinedStream.prototype._updateDataSize = function () {
      this.dataSize = 0;
      var self2 = this;
      this._streams.forEach(function (stream4) {
        if (!stream4.dataSize) {
          return;
        }
        self2.dataSize += stream4.dataSize;
      });
      if (this._currentStream && this._currentStream.dataSize) {
        this.dataSize += this._currentStream.dataSize;
      }
    };
    CombinedStream.prototype._emitError = function (err) {
      this._reset();
      this.emit("error", err);
    };
  },
});

// node_modules/mime-db/db.json
var require_db = __commonJS({
  "node_modules/mime-db/db.json"(exports2, module2) {
    module2.exports = {
      "application/1d-interleaved-parityfec": {
        source: "iana",
      },
      "application/3gpdash-qoe-report+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/3gpp-ims+xml": {
        source: "iana",
        compressible: true,
      },
      "application/3gpphal+json": {
        source: "iana",
        compressible: true,
      },
      "application/3gpphalforms+json": {
        source: "iana",
        compressible: true,
      },
      "application/a2l": {
        source: "iana",
      },
      "application/ace+cbor": {
        source: "iana",
      },
      "application/activemessage": {
        source: "iana",
      },
      "application/activity+json": {
        source: "iana",
        compressible: true,
      },
      "application/alto-costmap+json": {
        source: "iana",
        compressible: true,
      },
      "application/alto-costmapfilter+json": {
        source: "iana",
        compressible: true,
      },
      "application/alto-directory+json": {
        source: "iana",
        compressible: true,
      },
      "application/alto-endpointcost+json": {
        source: "iana",
        compressible: true,
      },
      "application/alto-endpointcostparams+json": {
        source: "iana",
        compressible: true,
      },
      "application/alto-endpointprop+json": {
        source: "iana",
        compressible: true,
      },
      "application/alto-endpointpropparams+json": {
        source: "iana",
        compressible: true,
      },
      "application/alto-error+json": {
        source: "iana",
        compressible: true,
      },
      "application/alto-networkmap+json": {
        source: "iana",
        compressible: true,
      },
      "application/alto-networkmapfilter+json": {
        source: "iana",
        compressible: true,
      },
      "application/alto-updatestreamcontrol+json": {
        source: "iana",
        compressible: true,
      },
      "application/alto-updatestreamparams+json": {
        source: "iana",
        compressible: true,
      },
      "application/aml": {
        source: "iana",
      },
      "application/andrew-inset": {
        source: "iana",
        extensions: ["ez"],
      },
      "application/applefile": {
        source: "iana",
      },
      "application/applixware": {
        source: "apache",
        extensions: ["aw"],
      },
      "application/at+jwt": {
        source: "iana",
      },
      "application/atf": {
        source: "iana",
      },
      "application/atfx": {
        source: "iana",
      },
      "application/atom+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atom"],
      },
      "application/atomcat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomcat"],
      },
      "application/atomdeleted+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomdeleted"],
      },
      "application/atomicmail": {
        source: "iana",
      },
      "application/atomsvc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomsvc"],
      },
      "application/atsc-dwd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dwd"],
      },
      "application/atsc-dynamic-event-message": {
        source: "iana",
      },
      "application/atsc-held+xml": {
        source: "iana",
        compressible: true,
        extensions: ["held"],
      },
      "application/atsc-rdt+json": {
        source: "iana",
        compressible: true,
      },
      "application/atsc-rsat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsat"],
      },
      "application/atxml": {
        source: "iana",
      },
      "application/auth-policy+xml": {
        source: "iana",
        compressible: true,
      },
      "application/bacnet-xdd+zip": {
        source: "iana",
        compressible: false,
      },
      "application/batch-smtp": {
        source: "iana",
      },
      "application/bdoc": {
        compressible: false,
        extensions: ["bdoc"],
      },
      "application/beep+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/calendar+json": {
        source: "iana",
        compressible: true,
      },
      "application/calendar+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xcs"],
      },
      "application/call-completion": {
        source: "iana",
      },
      "application/cals-1840": {
        source: "iana",
      },
      "application/captive+json": {
        source: "iana",
        compressible: true,
      },
      "application/cbor": {
        source: "iana",
      },
      "application/cbor-seq": {
        source: "iana",
      },
      "application/cccex": {
        source: "iana",
      },
      "application/ccmp+xml": {
        source: "iana",
        compressible: true,
      },
      "application/ccxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ccxml"],
      },
      "application/cdfx+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdfx"],
      },
      "application/cdmi-capability": {
        source: "iana",
        extensions: ["cdmia"],
      },
      "application/cdmi-container": {
        source: "iana",
        extensions: ["cdmic"],
      },
      "application/cdmi-domain": {
        source: "iana",
        extensions: ["cdmid"],
      },
      "application/cdmi-object": {
        source: "iana",
        extensions: ["cdmio"],
      },
      "application/cdmi-queue": {
        source: "iana",
        extensions: ["cdmiq"],
      },
      "application/cdni": {
        source: "iana",
      },
      "application/cea": {
        source: "iana",
      },
      "application/cea-2018+xml": {
        source: "iana",
        compressible: true,
      },
      "application/cellml+xml": {
        source: "iana",
        compressible: true,
      },
      "application/cfw": {
        source: "iana",
      },
      "application/city+json": {
        source: "iana",
        compressible: true,
      },
      "application/clr": {
        source: "iana",
      },
      "application/clue+xml": {
        source: "iana",
        compressible: true,
      },
      "application/clue_info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/cms": {
        source: "iana",
      },
      "application/cnrp+xml": {
        source: "iana",
        compressible: true,
      },
      "application/coap-group+json": {
        source: "iana",
        compressible: true,
      },
      "application/coap-payload": {
        source: "iana",
      },
      "application/commonground": {
        source: "iana",
      },
      "application/conference-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/cose": {
        source: "iana",
      },
      "application/cose-key": {
        source: "iana",
      },
      "application/cose-key-set": {
        source: "iana",
      },
      "application/cpl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cpl"],
      },
      "application/csrattrs": {
        source: "iana",
      },
      "application/csta+xml": {
        source: "iana",
        compressible: true,
      },
      "application/cstadata+xml": {
        source: "iana",
        compressible: true,
      },
      "application/csvm+json": {
        source: "iana",
        compressible: true,
      },
      "application/cu-seeme": {
        source: "apache",
        extensions: ["cu"],
      },
      "application/cwt": {
        source: "iana",
      },
      "application/cybercash": {
        source: "iana",
      },
      "application/dart": {
        compressible: true,
      },
      "application/dash+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpd"],
      },
      "application/dash-patch+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpp"],
      },
      "application/dashdelta": {
        source: "iana",
      },
      "application/davmount+xml": {
        source: "iana",
        compressible: true,
        extensions: ["davmount"],
      },
      "application/dca-rft": {
        source: "iana",
      },
      "application/dcd": {
        source: "iana",
      },
      "application/dec-dx": {
        source: "iana",
      },
      "application/dialog-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/dicom": {
        source: "iana",
      },
      "application/dicom+json": {
        source: "iana",
        compressible: true,
      },
      "application/dicom+xml": {
        source: "iana",
        compressible: true,
      },
      "application/dii": {
        source: "iana",
      },
      "application/dit": {
        source: "iana",
      },
      "application/dns": {
        source: "iana",
      },
      "application/dns+json": {
        source: "iana",
        compressible: true,
      },
      "application/dns-message": {
        source: "iana",
      },
      "application/docbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dbk"],
      },
      "application/dots+cbor": {
        source: "iana",
      },
      "application/dskpp+xml": {
        source: "iana",
        compressible: true,
      },
      "application/dssc+der": {
        source: "iana",
        extensions: ["dssc"],
      },
      "application/dssc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdssc"],
      },
      "application/dvcs": {
        source: "iana",
      },
      "application/ecmascript": {
        source: "iana",
        compressible: true,
        extensions: ["es", "ecma"],
      },
      "application/edi-consent": {
        source: "iana",
      },
      "application/edi-x12": {
        source: "iana",
        compressible: false,
      },
      "application/edifact": {
        source: "iana",
        compressible: false,
      },
      "application/efi": {
        source: "iana",
      },
      "application/elm+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/elm+xml": {
        source: "iana",
        compressible: true,
      },
      "application/emergencycalldata.cap+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/emergencycalldata.comment+xml": {
        source: "iana",
        compressible: true,
      },
      "application/emergencycalldata.control+xml": {
        source: "iana",
        compressible: true,
      },
      "application/emergencycalldata.deviceinfo+xml": {
        source: "iana",
        compressible: true,
      },
      "application/emergencycalldata.ecall.msd": {
        source: "iana",
      },
      "application/emergencycalldata.providerinfo+xml": {
        source: "iana",
        compressible: true,
      },
      "application/emergencycalldata.serviceinfo+xml": {
        source: "iana",
        compressible: true,
      },
      "application/emergencycalldata.subscriberinfo+xml": {
        source: "iana",
        compressible: true,
      },
      "application/emergencycalldata.veds+xml": {
        source: "iana",
        compressible: true,
      },
      "application/emma+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emma"],
      },
      "application/emotionml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emotionml"],
      },
      "application/encaprtp": {
        source: "iana",
      },
      "application/epp+xml": {
        source: "iana",
        compressible: true,
      },
      "application/epub+zip": {
        source: "iana",
        compressible: false,
        extensions: ["epub"],
      },
      "application/eshop": {
        source: "iana",
      },
      "application/exi": {
        source: "iana",
        extensions: ["exi"],
      },
      "application/expect-ct-report+json": {
        source: "iana",
        compressible: true,
      },
      "application/express": {
        source: "iana",
        extensions: ["exp"],
      },
      "application/fastinfoset": {
        source: "iana",
      },
      "application/fastsoap": {
        source: "iana",
      },
      "application/fdt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fdt"],
      },
      "application/fhir+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/fhir+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/fido.trusted-apps+json": {
        compressible: true,
      },
      "application/fits": {
        source: "iana",
      },
      "application/flexfec": {
        source: "iana",
      },
      "application/font-sfnt": {
        source: "iana",
      },
      "application/font-tdpfr": {
        source: "iana",
        extensions: ["pfr"],
      },
      "application/font-woff": {
        source: "iana",
        compressible: false,
      },
      "application/framework-attributes+xml": {
        source: "iana",
        compressible: true,
      },
      "application/geo+json": {
        source: "iana",
        compressible: true,
        extensions: ["geojson"],
      },
      "application/geo+json-seq": {
        source: "iana",
      },
      "application/geopackage+sqlite3": {
        source: "iana",
      },
      "application/geoxacml+xml": {
        source: "iana",
        compressible: true,
      },
      "application/gltf-buffer": {
        source: "iana",
      },
      "application/gml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["gml"],
      },
      "application/gpx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["gpx"],
      },
      "application/gxf": {
        source: "apache",
        extensions: ["gxf"],
      },
      "application/gzip": {
        source: "iana",
        compressible: false,
        extensions: ["gz"],
      },
      "application/h224": {
        source: "iana",
      },
      "application/held+xml": {
        source: "iana",
        compressible: true,
      },
      "application/hjson": {
        extensions: ["hjson"],
      },
      "application/http": {
        source: "iana",
      },
      "application/hyperstudio": {
        source: "iana",
        extensions: ["stk"],
      },
      "application/ibe-key-request+xml": {
        source: "iana",
        compressible: true,
      },
      "application/ibe-pkg-reply+xml": {
        source: "iana",
        compressible: true,
      },
      "application/ibe-pp-data": {
        source: "iana",
      },
      "application/iges": {
        source: "iana",
      },
      "application/im-iscomposing+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/index": {
        source: "iana",
      },
      "application/index.cmd": {
        source: "iana",
      },
      "application/index.obj": {
        source: "iana",
      },
      "application/index.response": {
        source: "iana",
      },
      "application/index.vnd": {
        source: "iana",
      },
      "application/inkml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ink", "inkml"],
      },
      "application/iotp": {
        source: "iana",
      },
      "application/ipfix": {
        source: "iana",
        extensions: ["ipfix"],
      },
      "application/ipp": {
        source: "iana",
      },
      "application/isup": {
        source: "iana",
      },
      "application/its+xml": {
        source: "iana",
        compressible: true,
        extensions: ["its"],
      },
      "application/java-archive": {
        source: "apache",
        compressible: false,
        extensions: ["jar", "war", "ear"],
      },
      "application/java-serialized-object": {
        source: "apache",
        compressible: false,
        extensions: ["ser"],
      },
      "application/java-vm": {
        source: "apache",
        compressible: false,
        extensions: ["class"],
      },
      "application/javascript": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["js", "mjs"],
      },
      "application/jf2feed+json": {
        source: "iana",
        compressible: true,
      },
      "application/jose": {
        source: "iana",
      },
      "application/jose+json": {
        source: "iana",
        compressible: true,
      },
      "application/jrd+json": {
        source: "iana",
        compressible: true,
      },
      "application/jscalendar+json": {
        source: "iana",
        compressible: true,
      },
      "application/json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["json", "map"],
      },
      "application/json-patch+json": {
        source: "iana",
        compressible: true,
      },
      "application/json-seq": {
        source: "iana",
      },
      "application/json5": {
        extensions: ["json5"],
      },
      "application/jsonml+json": {
        source: "apache",
        compressible: true,
        extensions: ["jsonml"],
      },
      "application/jwk+json": {
        source: "iana",
        compressible: true,
      },
      "application/jwk-set+json": {
        source: "iana",
        compressible: true,
      },
      "application/jwt": {
        source: "iana",
      },
      "application/kpml-request+xml": {
        source: "iana",
        compressible: true,
      },
      "application/kpml-response+xml": {
        source: "iana",
        compressible: true,
      },
      "application/ld+json": {
        source: "iana",
        compressible: true,
        extensions: ["jsonld"],
      },
      "application/lgr+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lgr"],
      },
      "application/link-format": {
        source: "iana",
      },
      "application/load-control+xml": {
        source: "iana",
        compressible: true,
      },
      "application/lost+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lostxml"],
      },
      "application/lostsync+xml": {
        source: "iana",
        compressible: true,
      },
      "application/lpf+zip": {
        source: "iana",
        compressible: false,
      },
      "application/lxf": {
        source: "iana",
      },
      "application/mac-binhex40": {
        source: "iana",
        extensions: ["hqx"],
      },
      "application/mac-compactpro": {
        source: "apache",
        extensions: ["cpt"],
      },
      "application/macwriteii": {
        source: "iana",
      },
      "application/mads+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mads"],
      },
      "application/manifest+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["webmanifest"],
      },
      "application/marc": {
        source: "iana",
        extensions: ["mrc"],
      },
      "application/marcxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mrcx"],
      },
      "application/mathematica": {
        source: "iana",
        extensions: ["ma", "nb", "mb"],
      },
      "application/mathml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mathml"],
      },
      "application/mathml-content+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mathml-presentation+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mbms-associated-procedure-description+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mbms-deregister+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mbms-envelope+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mbms-msk+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mbms-msk-response+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mbms-protection-description+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mbms-reception-report+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mbms-register+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mbms-register-response+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mbms-schedule+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mbms-user-service-description+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mbox": {
        source: "iana",
        extensions: ["mbox"],
      },
      "application/media-policy-dataset+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpf"],
      },
      "application/media_control+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mediaservercontrol+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mscml"],
      },
      "application/merge-patch+json": {
        source: "iana",
        compressible: true,
      },
      "application/metalink+xml": {
        source: "apache",
        compressible: true,
        extensions: ["metalink"],
      },
      "application/metalink4+xml": {
        source: "iana",
        compressible: true,
        extensions: ["meta4"],
      },
      "application/mets+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mets"],
      },
      "application/mf4": {
        source: "iana",
      },
      "application/mikey": {
        source: "iana",
      },
      "application/mipc": {
        source: "iana",
      },
      "application/missing-blocks+cbor-seq": {
        source: "iana",
      },
      "application/mmt-aei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["maei"],
      },
      "application/mmt-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musd"],
      },
      "application/mods+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mods"],
      },
      "application/moss-keys": {
        source: "iana",
      },
      "application/moss-signature": {
        source: "iana",
      },
      "application/mosskey-data": {
        source: "iana",
      },
      "application/mosskey-request": {
        source: "iana",
      },
      "application/mp21": {
        source: "iana",
        extensions: ["m21", "mp21"],
      },
      "application/mp4": {
        source: "iana",
        extensions: ["mp4s", "m4p"],
      },
      "application/mpeg4-generic": {
        source: "iana",
      },
      "application/mpeg4-iod": {
        source: "iana",
      },
      "application/mpeg4-iod-xmt": {
        source: "iana",
      },
      "application/mrb-consumer+xml": {
        source: "iana",
        compressible: true,
      },
      "application/mrb-publish+xml": {
        source: "iana",
        compressible: true,
      },
      "application/msc-ivr+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/msc-mixer+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/msword": {
        source: "iana",
        compressible: false,
        extensions: ["doc", "dot"],
      },
      "application/mud+json": {
        source: "iana",
        compressible: true,
      },
      "application/multipart-core": {
        source: "iana",
      },
      "application/mxf": {
        source: "iana",
        extensions: ["mxf"],
      },
      "application/n-quads": {
        source: "iana",
        extensions: ["nq"],
      },
      "application/n-triples": {
        source: "iana",
        extensions: ["nt"],
      },
      "application/nasdata": {
        source: "iana",
      },
      "application/news-checkgroups": {
        source: "iana",
        charset: "US-ASCII",
      },
      "application/news-groupinfo": {
        source: "iana",
        charset: "US-ASCII",
      },
      "application/news-transmission": {
        source: "iana",
      },
      "application/nlsml+xml": {
        source: "iana",
        compressible: true,
      },
      "application/node": {
        source: "iana",
        extensions: ["cjs"],
      },
      "application/nss": {
        source: "iana",
      },
      "application/oauth-authz-req+jwt": {
        source: "iana",
      },
      "application/oblivious-dns-message": {
        source: "iana",
      },
      "application/ocsp-request": {
        source: "iana",
      },
      "application/ocsp-response": {
        source: "iana",
      },
      "application/octet-stream": {
        source: "iana",
        compressible: false,
        extensions: [
          "bin",
          "dms",
          "lrf",
          "mar",
          "so",
          "dist",
          "distz",
          "pkg",
          "bpk",
          "dump",
          "elc",
          "deploy",
          "exe",
          "dll",
          "deb",
          "dmg",
          "iso",
          "img",
          "msi",
          "msp",
          "msm",
          "buffer",
        ],
      },
      "application/oda": {
        source: "iana",
        extensions: ["oda"],
      },
      "application/odm+xml": {
        source: "iana",
        compressible: true,
      },
      "application/odx": {
        source: "iana",
      },
      "application/oebps-package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["opf"],
      },
      "application/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogx"],
      },
      "application/omdoc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["omdoc"],
      },
      "application/onenote": {
        source: "apache",
        extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"],
      },
      "application/opc-nodeset+xml": {
        source: "iana",
        compressible: true,
      },
      "application/oscore": {
        source: "iana",
      },
      "application/oxps": {
        source: "iana",
        extensions: ["oxps"],
      },
      "application/p21": {
        source: "iana",
      },
      "application/p21+zip": {
        source: "iana",
        compressible: false,
      },
      "application/p2p-overlay+xml": {
        source: "iana",
        compressible: true,
        extensions: ["relo"],
      },
      "application/parityfec": {
        source: "iana",
      },
      "application/passport": {
        source: "iana",
      },
      "application/patch-ops-error+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xer"],
      },
      "application/pdf": {
        source: "iana",
        compressible: false,
        extensions: ["pdf"],
      },
      "application/pdx": {
        source: "iana",
      },
      "application/pem-certificate-chain": {
        source: "iana",
      },
      "application/pgp-encrypted": {
        source: "iana",
        compressible: false,
        extensions: ["pgp"],
      },
      "application/pgp-keys": {
        source: "iana",
        extensions: ["asc"],
      },
      "application/pgp-signature": {
        source: "iana",
        extensions: ["asc", "sig"],
      },
      "application/pics-rules": {
        source: "apache",
        extensions: ["prf"],
      },
      "application/pidf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/pidf-diff+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/pkcs10": {
        source: "iana",
        extensions: ["p10"],
      },
      "application/pkcs12": {
        source: "iana",
      },
      "application/pkcs7-mime": {
        source: "iana",
        extensions: ["p7m", "p7c"],
      },
      "application/pkcs7-signature": {
        source: "iana",
        extensions: ["p7s"],
      },
      "application/pkcs8": {
        source: "iana",
        extensions: ["p8"],
      },
      "application/pkcs8-encrypted": {
        source: "iana",
      },
      "application/pkix-attr-cert": {
        source: "iana",
        extensions: ["ac"],
      },
      "application/pkix-cert": {
        source: "iana",
        extensions: ["cer"],
      },
      "application/pkix-crl": {
        source: "iana",
        extensions: ["crl"],
      },
      "application/pkix-pkipath": {
        source: "iana",
        extensions: ["pkipath"],
      },
      "application/pkixcmp": {
        source: "iana",
        extensions: ["pki"],
      },
      "application/pls+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pls"],
      },
      "application/poc-settings+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/postscript": {
        source: "iana",
        compressible: true,
        extensions: ["ai", "eps", "ps"],
      },
      "application/ppsp-tracker+json": {
        source: "iana",
        compressible: true,
      },
      "application/problem+json": {
        source: "iana",
        compressible: true,
      },
      "application/problem+xml": {
        source: "iana",
        compressible: true,
      },
      "application/provenance+xml": {
        source: "iana",
        compressible: true,
        extensions: ["provx"],
      },
      "application/prs.alvestrand.titrax-sheet": {
        source: "iana",
      },
      "application/prs.cww": {
        source: "iana",
        extensions: ["cww"],
      },
      "application/prs.cyn": {
        source: "iana",
        charset: "7-BIT",
      },
      "application/prs.hpub+zip": {
        source: "iana",
        compressible: false,
      },
      "application/prs.nprend": {
        source: "iana",
      },
      "application/prs.plucker": {
        source: "iana",
      },
      "application/prs.rdf-xml-crypt": {
        source: "iana",
      },
      "application/prs.xsf+xml": {
        source: "iana",
        compressible: true,
      },
      "application/pskc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pskcxml"],
      },
      "application/pvd+json": {
        source: "iana",
        compressible: true,
      },
      "application/qsig": {
        source: "iana",
      },
      "application/raml+yaml": {
        compressible: true,
        extensions: ["raml"],
      },
      "application/raptorfec": {
        source: "iana",
      },
      "application/rdap+json": {
        source: "iana",
        compressible: true,
      },
      "application/rdf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rdf", "owl"],
      },
      "application/reginfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rif"],
      },
      "application/relax-ng-compact-syntax": {
        source: "iana",
        extensions: ["rnc"],
      },
      "application/remote-printing": {
        source: "iana",
      },
      "application/reputon+json": {
        source: "iana",
        compressible: true,
      },
      "application/resource-lists+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rl"],
      },
      "application/resource-lists-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rld"],
      },
      "application/rfc+xml": {
        source: "iana",
        compressible: true,
      },
      "application/riscos": {
        source: "iana",
      },
      "application/rlmi+xml": {
        source: "iana",
        compressible: true,
      },
      "application/rls-services+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rs"],
      },
      "application/route-apd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rapd"],
      },
      "application/route-s-tsid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sls"],
      },
      "application/route-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rusd"],
      },
      "application/rpki-ghostbusters": {
        source: "iana",
        extensions: ["gbr"],
      },
      "application/rpki-manifest": {
        source: "iana",
        extensions: ["mft"],
      },
      "application/rpki-publication": {
        source: "iana",
      },
      "application/rpki-roa": {
        source: "iana",
        extensions: ["roa"],
      },
      "application/rpki-updown": {
        source: "iana",
      },
      "application/rsd+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rsd"],
      },
      "application/rss+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rss"],
      },
      "application/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"],
      },
      "application/rtploopback": {
        source: "iana",
      },
      "application/rtx": {
        source: "iana",
      },
      "application/samlassertion+xml": {
        source: "iana",
        compressible: true,
      },
      "application/samlmetadata+xml": {
        source: "iana",
        compressible: true,
      },
      "application/sarif+json": {
        source: "iana",
        compressible: true,
      },
      "application/sarif-external-properties+json": {
        source: "iana",
        compressible: true,
      },
      "application/sbe": {
        source: "iana",
      },
      "application/sbml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sbml"],
      },
      "application/scaip+xml": {
        source: "iana",
        compressible: true,
      },
      "application/scim+json": {
        source: "iana",
        compressible: true,
      },
      "application/scvp-cv-request": {
        source: "iana",
        extensions: ["scq"],
      },
      "application/scvp-cv-response": {
        source: "iana",
        extensions: ["scs"],
      },
      "application/scvp-vp-request": {
        source: "iana",
        extensions: ["spq"],
      },
      "application/scvp-vp-response": {
        source: "iana",
        extensions: ["spp"],
      },
      "application/sdp": {
        source: "iana",
        extensions: ["sdp"],
      },
      "application/secevent+jwt": {
        source: "iana",
      },
      "application/senml+cbor": {
        source: "iana",
      },
      "application/senml+json": {
        source: "iana",
        compressible: true,
      },
      "application/senml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["senmlx"],
      },
      "application/senml-etch+cbor": {
        source: "iana",
      },
      "application/senml-etch+json": {
        source: "iana",
        compressible: true,
      },
      "application/senml-exi": {
        source: "iana",
      },
      "application/sensml+cbor": {
        source: "iana",
      },
      "application/sensml+json": {
        source: "iana",
        compressible: true,
      },
      "application/sensml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sensmlx"],
      },
      "application/sensml-exi": {
        source: "iana",
      },
      "application/sep+xml": {
        source: "iana",
        compressible: true,
      },
      "application/sep-exi": {
        source: "iana",
      },
      "application/session-info": {
        source: "iana",
      },
      "application/set-payment": {
        source: "iana",
      },
      "application/set-payment-initiation": {
        source: "iana",
        extensions: ["setpay"],
      },
      "application/set-registration": {
        source: "iana",
      },
      "application/set-registration-initiation": {
        source: "iana",
        extensions: ["setreg"],
      },
      "application/sgml": {
        source: "iana",
      },
      "application/sgml-open-catalog": {
        source: "iana",
      },
      "application/shf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["shf"],
      },
      "application/sieve": {
        source: "iana",
        extensions: ["siv", "sieve"],
      },
      "application/simple-filter+xml": {
        source: "iana",
        compressible: true,
      },
      "application/simple-message-summary": {
        source: "iana",
      },
      "application/simplesymbolcontainer": {
        source: "iana",
      },
      "application/sipc": {
        source: "iana",
      },
      "application/slate": {
        source: "iana",
      },
      "application/smil": {
        source: "iana",
      },
      "application/smil+xml": {
        source: "iana",
        compressible: true,
        extensions: ["smi", "smil"],
      },
      "application/smpte336m": {
        source: "iana",
      },
      "application/soap+fastinfoset": {
        source: "iana",
      },
      "application/soap+xml": {
        source: "iana",
        compressible: true,
      },
      "application/sparql-query": {
        source: "iana",
        extensions: ["rq"],
      },
      "application/sparql-results+xml": {
        source: "iana",
        compressible: true,
        extensions: ["srx"],
      },
      "application/spdx+json": {
        source: "iana",
        compressible: true,
      },
      "application/spirits-event+xml": {
        source: "iana",
        compressible: true,
      },
      "application/sql": {
        source: "iana",
      },
      "application/srgs": {
        source: "iana",
        extensions: ["gram"],
      },
      "application/srgs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["grxml"],
      },
      "application/sru+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sru"],
      },
      "application/ssdl+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ssdl"],
      },
      "application/ssml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ssml"],
      },
      "application/stix+json": {
        source: "iana",
        compressible: true,
      },
      "application/swid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["swidtag"],
      },
      "application/tamp-apex-update": {
        source: "iana",
      },
      "application/tamp-apex-update-confirm": {
        source: "iana",
      },
      "application/tamp-community-update": {
        source: "iana",
      },
      "application/tamp-community-update-confirm": {
        source: "iana",
      },
      "application/tamp-error": {
        source: "iana",
      },
      "application/tamp-sequence-adjust": {
        source: "iana",
      },
      "application/tamp-sequence-adjust-confirm": {
        source: "iana",
      },
      "application/tamp-status-query": {
        source: "iana",
      },
      "application/tamp-status-response": {
        source: "iana",
      },
      "application/tamp-update": {
        source: "iana",
      },
      "application/tamp-update-confirm": {
        source: "iana",
      },
      "application/tar": {
        compressible: true,
      },
      "application/taxii+json": {
        source: "iana",
        compressible: true,
      },
      "application/td+json": {
        source: "iana",
        compressible: true,
      },
      "application/tei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tei", "teicorpus"],
      },
      "application/tetra_isi": {
        source: "iana",
      },
      "application/thraud+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tfi"],
      },
      "application/timestamp-query": {
        source: "iana",
      },
      "application/timestamp-reply": {
        source: "iana",
      },
      "application/timestamped-data": {
        source: "iana",
        extensions: ["tsd"],
      },
      "application/tlsrpt+gzip": {
        source: "iana",
      },
      "application/tlsrpt+json": {
        source: "iana",
        compressible: true,
      },
      "application/tnauthlist": {
        source: "iana",
      },
      "application/token-introspection+jwt": {
        source: "iana",
      },
      "application/toml": {
        compressible: true,
        extensions: ["toml"],
      },
      "application/trickle-ice-sdpfrag": {
        source: "iana",
      },
      "application/trig": {
        source: "iana",
        extensions: ["trig"],
      },
      "application/ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ttml"],
      },
      "application/tve-trigger": {
        source: "iana",
      },
      "application/tzif": {
        source: "iana",
      },
      "application/tzif-leap": {
        source: "iana",
      },
      "application/ubjson": {
        compressible: false,
        extensions: ["ubj"],
      },
      "application/ulpfec": {
        source: "iana",
      },
      "application/urc-grpsheet+xml": {
        source: "iana",
        compressible: true,
      },
      "application/urc-ressheet+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsheet"],
      },
      "application/urc-targetdesc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["td"],
      },
      "application/urc-uisocketdesc+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vcard+json": {
        source: "iana",
        compressible: true,
      },
      "application/vcard+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vemmi": {
        source: "iana",
      },
      "application/vividence.scriptfile": {
        source: "apache",
      },
      "application/vnd.1000minds.decision-model+xml": {
        source: "iana",
        compressible: true,
        extensions: ["1km"],
      },
      "application/vnd.3gpp-prose+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp-prose-pc3ch+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp-v2x-local-service-information": {
        source: "iana",
      },
      "application/vnd.3gpp.5gnas": {
        source: "iana",
      },
      "application/vnd.3gpp.access-transfer-events+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.bsf+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.gmop+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.gtpc": {
        source: "iana",
      },
      "application/vnd.3gpp.interworking-data": {
        source: "iana",
      },
      "application/vnd.3gpp.lpp": {
        source: "iana",
      },
      "application/vnd.3gpp.mc-signalling-ear": {
        source: "iana",
      },
      "application/vnd.3gpp.mcdata-affiliation-command+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcdata-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcdata-payload": {
        source: "iana",
      },
      "application/vnd.3gpp.mcdata-service-config+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcdata-signalling": {
        source: "iana",
      },
      "application/vnd.3gpp.mcdata-ue-config+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcdata-user-profile+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcptt-affiliation-command+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcptt-floor-request+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcptt-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcptt-location-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcptt-service-config+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcptt-signed+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcptt-ue-config+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcptt-ue-init-config+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcptt-user-profile+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcvideo-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcvideo-location-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcvideo-service-config+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcvideo-transmission-request+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcvideo-ue-config+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mcvideo-user-profile+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.mid-call+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.ngap": {
        source: "iana",
      },
      "application/vnd.3gpp.pfcp": {
        source: "iana",
      },
      "application/vnd.3gpp.pic-bw-large": {
        source: "iana",
        extensions: ["plb"],
      },
      "application/vnd.3gpp.pic-bw-small": {
        source: "iana",
        extensions: ["psb"],
      },
      "application/vnd.3gpp.pic-bw-var": {
        source: "iana",
        extensions: ["pvb"],
      },
      "application/vnd.3gpp.s1ap": {
        source: "iana",
      },
      "application/vnd.3gpp.sms": {
        source: "iana",
      },
      "application/vnd.3gpp.sms+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.srvcc-ext+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.srvcc-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.state-and-event-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp.ussd+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp2.bcmcsinfo+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.3gpp2.sms": {
        source: "iana",
      },
      "application/vnd.3gpp2.tcap": {
        source: "iana",
        extensions: ["tcap"],
      },
      "application/vnd.3lightssoftware.imagescal": {
        source: "iana",
      },
      "application/vnd.3m.post-it-notes": {
        source: "iana",
        extensions: ["pwn"],
      },
      "application/vnd.accpac.simply.aso": {
        source: "iana",
        extensions: ["aso"],
      },
      "application/vnd.accpac.simply.imp": {
        source: "iana",
        extensions: ["imp"],
      },
      "application/vnd.acucobol": {
        source: "iana",
        extensions: ["acu"],
      },
      "application/vnd.acucorp": {
        source: "iana",
        extensions: ["atc", "acutc"],
      },
      "application/vnd.adobe.air-application-installer-package+zip": {
        source: "apache",
        compressible: false,
        extensions: ["air"],
      },
      "application/vnd.adobe.flash.movie": {
        source: "iana",
      },
      "application/vnd.adobe.formscentral.fcdt": {
        source: "iana",
        extensions: ["fcdt"],
      },
      "application/vnd.adobe.fxp": {
        source: "iana",
        extensions: ["fxp", "fxpl"],
      },
      "application/vnd.adobe.partial-upload": {
        source: "iana",
      },
      "application/vnd.adobe.xdp+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdp"],
      },
      "application/vnd.adobe.xfdf": {
        source: "iana",
        extensions: ["xfdf"],
      },
      "application/vnd.aether.imp": {
        source: "iana",
      },
      "application/vnd.afpc.afplinedata": {
        source: "iana",
      },
      "application/vnd.afpc.afplinedata-pagedef": {
        source: "iana",
      },
      "application/vnd.afpc.cmoca-cmresource": {
        source: "iana",
      },
      "application/vnd.afpc.foca-charset": {
        source: "iana",
      },
      "application/vnd.afpc.foca-codedfont": {
        source: "iana",
      },
      "application/vnd.afpc.foca-codepage": {
        source: "iana",
      },
      "application/vnd.afpc.modca": {
        source: "iana",
      },
      "application/vnd.afpc.modca-cmtable": {
        source: "iana",
      },
      "application/vnd.afpc.modca-formdef": {
        source: "iana",
      },
      "application/vnd.afpc.modca-mediummap": {
        source: "iana",
      },
      "application/vnd.afpc.modca-objectcontainer": {
        source: "iana",
      },
      "application/vnd.afpc.modca-overlay": {
        source: "iana",
      },
      "application/vnd.afpc.modca-pagesegment": {
        source: "iana",
      },
      "application/vnd.age": {
        source: "iana",
        extensions: ["age"],
      },
      "application/vnd.ah-barcode": {
        source: "iana",
      },
      "application/vnd.ahead.space": {
        source: "iana",
        extensions: ["ahead"],
      },
      "application/vnd.airzip.filesecure.azf": {
        source: "iana",
        extensions: ["azf"],
      },
      "application/vnd.airzip.filesecure.azs": {
        source: "iana",
        extensions: ["azs"],
      },
      "application/vnd.amadeus+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.amazon.ebook": {
        source: "apache",
        extensions: ["azw"],
      },
      "application/vnd.amazon.mobi8-ebook": {
        source: "iana",
      },
      "application/vnd.americandynamics.acc": {
        source: "iana",
        extensions: ["acc"],
      },
      "application/vnd.amiga.ami": {
        source: "iana",
        extensions: ["ami"],
      },
      "application/vnd.amundsen.maze+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.android.ota": {
        source: "iana",
      },
      "application/vnd.android.package-archive": {
        source: "apache",
        compressible: false,
        extensions: ["apk"],
      },
      "application/vnd.anki": {
        source: "iana",
      },
      "application/vnd.anser-web-certificate-issue-initiation": {
        source: "iana",
        extensions: ["cii"],
      },
      "application/vnd.anser-web-funds-transfer-initiation": {
        source: "apache",
        extensions: ["fti"],
      },
      "application/vnd.antix.game-component": {
        source: "iana",
        extensions: ["atx"],
      },
      "application/vnd.apache.arrow.file": {
        source: "iana",
      },
      "application/vnd.apache.arrow.stream": {
        source: "iana",
      },
      "application/vnd.apache.thrift.binary": {
        source: "iana",
      },
      "application/vnd.apache.thrift.compact": {
        source: "iana",
      },
      "application/vnd.apache.thrift.json": {
        source: "iana",
      },
      "application/vnd.api+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.aplextor.warrp+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.apothekende.reservation+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.apple.installer+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpkg"],
      },
      "application/vnd.apple.keynote": {
        source: "iana",
        extensions: ["key"],
      },
      "application/vnd.apple.mpegurl": {
        source: "iana",
        extensions: ["m3u8"],
      },
      "application/vnd.apple.numbers": {
        source: "iana",
        extensions: ["numbers"],
      },
      "application/vnd.apple.pages": {
        source: "iana",
        extensions: ["pages"],
      },
      "application/vnd.apple.pkpass": {
        compressible: false,
        extensions: ["pkpass"],
      },
      "application/vnd.arastra.swi": {
        source: "iana",
      },
      "application/vnd.aristanetworks.swi": {
        source: "iana",
        extensions: ["swi"],
      },
      "application/vnd.artisan+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.artsquare": {
        source: "iana",
      },
      "application/vnd.astraea-software.iota": {
        source: "iana",
        extensions: ["iota"],
      },
      "application/vnd.audiograph": {
        source: "iana",
        extensions: ["aep"],
      },
      "application/vnd.autopackage": {
        source: "iana",
      },
      "application/vnd.avalon+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.avistar+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.balsamiq.bmml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["bmml"],
      },
      "application/vnd.balsamiq.bmpr": {
        source: "iana",
      },
      "application/vnd.banana-accounting": {
        source: "iana",
      },
      "application/vnd.bbf.usp.error": {
        source: "iana",
      },
      "application/vnd.bbf.usp.msg": {
        source: "iana",
      },
      "application/vnd.bbf.usp.msg+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.bekitzur-stech+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.bint.med-content": {
        source: "iana",
      },
      "application/vnd.biopax.rdf+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.blink-idb-value-wrapper": {
        source: "iana",
      },
      "application/vnd.blueice.multipass": {
        source: "iana",
        extensions: ["mpm"],
      },
      "application/vnd.bluetooth.ep.oob": {
        source: "iana",
      },
      "application/vnd.bluetooth.le.oob": {
        source: "iana",
      },
      "application/vnd.bmi": {
        source: "iana",
        extensions: ["bmi"],
      },
      "application/vnd.bpf": {
        source: "iana",
      },
      "application/vnd.bpf3": {
        source: "iana",
      },
      "application/vnd.businessobjects": {
        source: "iana",
        extensions: ["rep"],
      },
      "application/vnd.byu.uapi+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.cab-jscript": {
        source: "iana",
      },
      "application/vnd.canon-cpdl": {
        source: "iana",
      },
      "application/vnd.canon-lips": {
        source: "iana",
      },
      "application/vnd.capasystems-pg+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.cendio.thinlinc.clientconf": {
        source: "iana",
      },
      "application/vnd.century-systems.tcp_stream": {
        source: "iana",
      },
      "application/vnd.chemdraw+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdxml"],
      },
      "application/vnd.chess-pgn": {
        source: "iana",
      },
      "application/vnd.chipnuts.karaoke-mmd": {
        source: "iana",
        extensions: ["mmd"],
      },
      "application/vnd.ciedi": {
        source: "iana",
      },
      "application/vnd.cinderella": {
        source: "iana",
        extensions: ["cdy"],
      },
      "application/vnd.cirpack.isdn-ext": {
        source: "iana",
      },
      "application/vnd.citationstyles.style+xml": {
        source: "iana",
        compressible: true,
        extensions: ["csl"],
      },
      "application/vnd.claymore": {
        source: "iana",
        extensions: ["cla"],
      },
      "application/vnd.cloanto.rp9": {
        source: "iana",
        extensions: ["rp9"],
      },
      "application/vnd.clonk.c4group": {
        source: "iana",
        extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"],
      },
      "application/vnd.cluetrust.cartomobile-config": {
        source: "iana",
        extensions: ["c11amc"],
      },
      "application/vnd.cluetrust.cartomobile-config-pkg": {
        source: "iana",
        extensions: ["c11amz"],
      },
      "application/vnd.coffeescript": {
        source: "iana",
      },
      "application/vnd.collabio.xodocuments.document": {
        source: "iana",
      },
      "application/vnd.collabio.xodocuments.document-template": {
        source: "iana",
      },
      "application/vnd.collabio.xodocuments.presentation": {
        source: "iana",
      },
      "application/vnd.collabio.xodocuments.presentation-template": {
        source: "iana",
      },
      "application/vnd.collabio.xodocuments.spreadsheet": {
        source: "iana",
      },
      "application/vnd.collabio.xodocuments.spreadsheet-template": {
        source: "iana",
      },
      "application/vnd.collection+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.collection.doc+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.collection.next+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.comicbook+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.comicbook-rar": {
        source: "iana",
      },
      "application/vnd.commerce-battelle": {
        source: "iana",
      },
      "application/vnd.commonspace": {
        source: "iana",
        extensions: ["csp"],
      },
      "application/vnd.contact.cmsg": {
        source: "iana",
        extensions: ["cdbcmsg"],
      },
      "application/vnd.coreos.ignition+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.cosmocaller": {
        source: "iana",
        extensions: ["cmc"],
      },
      "application/vnd.crick.clicker": {
        source: "iana",
        extensions: ["clkx"],
      },
      "application/vnd.crick.clicker.keyboard": {
        source: "iana",
        extensions: ["clkk"],
      },
      "application/vnd.crick.clicker.palette": {
        source: "iana",
        extensions: ["clkp"],
      },
      "application/vnd.crick.clicker.template": {
        source: "iana",
        extensions: ["clkt"],
      },
      "application/vnd.crick.clicker.wordbank": {
        source: "iana",
        extensions: ["clkw"],
      },
      "application/vnd.criticaltools.wbs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wbs"],
      },
      "application/vnd.cryptii.pipe+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.crypto-shade-file": {
        source: "iana",
      },
      "application/vnd.cryptomator.encrypted": {
        source: "iana",
      },
      "application/vnd.cryptomator.vault": {
        source: "iana",
      },
      "application/vnd.ctc-posml": {
        source: "iana",
        extensions: ["pml"],
      },
      "application/vnd.ctct.ws+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.cups-pdf": {
        source: "iana",
      },
      "application/vnd.cups-postscript": {
        source: "iana",
      },
      "application/vnd.cups-ppd": {
        source: "iana",
        extensions: ["ppd"],
      },
      "application/vnd.cups-raster": {
        source: "iana",
      },
      "application/vnd.cups-raw": {
        source: "iana",
      },
      "application/vnd.curl": {
        source: "iana",
      },
      "application/vnd.curl.car": {
        source: "apache",
        extensions: ["car"],
      },
      "application/vnd.curl.pcurl": {
        source: "apache",
        extensions: ["pcurl"],
      },
      "application/vnd.cyan.dean.root+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.cybank": {
        source: "iana",
      },
      "application/vnd.cyclonedx+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.cyclonedx+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.d2l.coursepackage1p0+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.d3m-dataset": {
        source: "iana",
      },
      "application/vnd.d3m-problem": {
        source: "iana",
      },
      "application/vnd.dart": {
        source: "iana",
        compressible: true,
        extensions: ["dart"],
      },
      "application/vnd.data-vision.rdz": {
        source: "iana",
        extensions: ["rdz"],
      },
      "application/vnd.datapackage+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.dataresource+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.dbf": {
        source: "iana",
        extensions: ["dbf"],
      },
      "application/vnd.debian.binary-package": {
        source: "iana",
      },
      "application/vnd.dece.data": {
        source: "iana",
        extensions: ["uvf", "uvvf", "uvd", "uvvd"],
      },
      "application/vnd.dece.ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uvt", "uvvt"],
      },
      "application/vnd.dece.unspecified": {
        source: "iana",
        extensions: ["uvx", "uvvx"],
      },
      "application/vnd.dece.zip": {
        source: "iana",
        extensions: ["uvz", "uvvz"],
      },
      "application/vnd.denovo.fcselayout-link": {
        source: "iana",
        extensions: ["fe_launch"],
      },
      "application/vnd.desmume.movie": {
        source: "iana",
      },
      "application/vnd.dir-bi.plate-dl-nosuffix": {
        source: "iana",
      },
      "application/vnd.dm.delegation+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.dna": {
        source: "iana",
        extensions: ["dna"],
      },
      "application/vnd.document+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.dolby.mlp": {
        source: "apache",
        extensions: ["mlp"],
      },
      "application/vnd.dolby.mobile.1": {
        source: "iana",
      },
      "application/vnd.dolby.mobile.2": {
        source: "iana",
      },
      "application/vnd.doremir.scorecloud-binary-document": {
        source: "iana",
      },
      "application/vnd.dpgraph": {
        source: "iana",
        extensions: ["dpg"],
      },
      "application/vnd.dreamfactory": {
        source: "iana",
        extensions: ["dfac"],
      },
      "application/vnd.drive+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ds-keypoint": {
        source: "apache",
        extensions: ["kpxx"],
      },
      "application/vnd.dtg.local": {
        source: "iana",
      },
      "application/vnd.dtg.local.flash": {
        source: "iana",
      },
      "application/vnd.dtg.local.html": {
        source: "iana",
      },
      "application/vnd.dvb.ait": {
        source: "iana",
        extensions: ["ait"],
      },
      "application/vnd.dvb.dvbisl+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.dvb.dvbj": {
        source: "iana",
      },
      "application/vnd.dvb.esgcontainer": {
        source: "iana",
      },
      "application/vnd.dvb.ipdcdftnotifaccess": {
        source: "iana",
      },
      "application/vnd.dvb.ipdcesgaccess": {
        source: "iana",
      },
      "application/vnd.dvb.ipdcesgaccess2": {
        source: "iana",
      },
      "application/vnd.dvb.ipdcesgpdd": {
        source: "iana",
      },
      "application/vnd.dvb.ipdcroaming": {
        source: "iana",
      },
      "application/vnd.dvb.iptv.alfec-base": {
        source: "iana",
      },
      "application/vnd.dvb.iptv.alfec-enhancement": {
        source: "iana",
      },
      "application/vnd.dvb.notif-aggregate-root+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.dvb.notif-container+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.dvb.notif-generic+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.dvb.notif-ia-msglist+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.dvb.notif-ia-registration-request+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.dvb.notif-ia-registration-response+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.dvb.notif-init+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.dvb.pfr": {
        source: "iana",
      },
      "application/vnd.dvb.service": {
        source: "iana",
        extensions: ["svc"],
      },
      "application/vnd.dxr": {
        source: "iana",
      },
      "application/vnd.dynageo": {
        source: "iana",
        extensions: ["geo"],
      },
      "application/vnd.dzr": {
        source: "iana",
      },
      "application/vnd.easykaraoke.cdgdownload": {
        source: "iana",
      },
      "application/vnd.ecdis-update": {
        source: "iana",
      },
      "application/vnd.ecip.rlp": {
        source: "iana",
      },
      "application/vnd.eclipse.ditto+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ecowin.chart": {
        source: "iana",
        extensions: ["mag"],
      },
      "application/vnd.ecowin.filerequest": {
        source: "iana",
      },
      "application/vnd.ecowin.fileupdate": {
        source: "iana",
      },
      "application/vnd.ecowin.series": {
        source: "iana",
      },
      "application/vnd.ecowin.seriesrequest": {
        source: "iana",
      },
      "application/vnd.ecowin.seriesupdate": {
        source: "iana",
      },
      "application/vnd.efi.img": {
        source: "iana",
      },
      "application/vnd.efi.iso": {
        source: "iana",
      },
      "application/vnd.emclient.accessrequest+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.enliven": {
        source: "iana",
        extensions: ["nml"],
      },
      "application/vnd.enphase.envoy": {
        source: "iana",
      },
      "application/vnd.eprints.data+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.epson.esf": {
        source: "iana",
        extensions: ["esf"],
      },
      "application/vnd.epson.msf": {
        source: "iana",
        extensions: ["msf"],
      },
      "application/vnd.epson.quickanime": {
        source: "iana",
        extensions: ["qam"],
      },
      "application/vnd.epson.salt": {
        source: "iana",
        extensions: ["slt"],
      },
      "application/vnd.epson.ssf": {
        source: "iana",
        extensions: ["ssf"],
      },
      "application/vnd.ericsson.quickcall": {
        source: "iana",
      },
      "application/vnd.espass-espass+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.eszigno3+xml": {
        source: "iana",
        compressible: true,
        extensions: ["es3", "et3"],
      },
      "application/vnd.etsi.aoc+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.asic-e+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.etsi.asic-s+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.etsi.cug+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.iptvcommand+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.iptvdiscovery+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.iptvprofile+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.iptvsad-bc+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.iptvsad-cod+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.iptvsad-npvr+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.iptvservice+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.iptvsync+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.iptvueprofile+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.mcid+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.mheg5": {
        source: "iana",
      },
      "application/vnd.etsi.overload-control-policy-dataset+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.pstn+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.sci+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.simservs+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.timestamp-token": {
        source: "iana",
      },
      "application/vnd.etsi.tsl+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.etsi.tsl.der": {
        source: "iana",
      },
      "application/vnd.eu.kasparian.car+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.eudora.data": {
        source: "iana",
      },
      "application/vnd.evolv.ecig.profile": {
        source: "iana",
      },
      "application/vnd.evolv.ecig.settings": {
        source: "iana",
      },
      "application/vnd.evolv.ecig.theme": {
        source: "iana",
      },
      "application/vnd.exstream-empower+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.exstream-package": {
        source: "iana",
      },
      "application/vnd.ezpix-album": {
        source: "iana",
        extensions: ["ez2"],
      },
      "application/vnd.ezpix-package": {
        source: "iana",
        extensions: ["ez3"],
      },
      "application/vnd.f-secure.mobile": {
        source: "iana",
      },
      "application/vnd.familysearch.gedcom+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.fastcopy-disk-image": {
        source: "iana",
      },
      "application/vnd.fdf": {
        source: "iana",
        extensions: ["fdf"],
      },
      "application/vnd.fdsn.mseed": {
        source: "iana",
        extensions: ["mseed"],
      },
      "application/vnd.fdsn.seed": {
        source: "iana",
        extensions: ["seed", "dataless"],
      },
      "application/vnd.ffsns": {
        source: "iana",
      },
      "application/vnd.ficlab.flb+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.filmit.zfc": {
        source: "iana",
      },
      "application/vnd.fints": {
        source: "iana",
      },
      "application/vnd.firemonkeys.cloudcell": {
        source: "iana",
      },
      "application/vnd.flographit": {
        source: "iana",
        extensions: ["gph"],
      },
      "application/vnd.fluxtime.clip": {
        source: "iana",
        extensions: ["ftc"],
      },
      "application/vnd.font-fontforge-sfd": {
        source: "iana",
      },
      "application/vnd.framemaker": {
        source: "iana",
        extensions: ["fm", "frame", "maker", "book"],
      },
      "application/vnd.frogans.fnc": {
        source: "iana",
        extensions: ["fnc"],
      },
      "application/vnd.frogans.ltf": {
        source: "iana",
        extensions: ["ltf"],
      },
      "application/vnd.fsc.weblaunch": {
        source: "iana",
        extensions: ["fsc"],
      },
      "application/vnd.fujifilm.fb.docuworks": {
        source: "iana",
      },
      "application/vnd.fujifilm.fb.docuworks.binder": {
        source: "iana",
      },
      "application/vnd.fujifilm.fb.docuworks.container": {
        source: "iana",
      },
      "application/vnd.fujifilm.fb.jfi+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.fujitsu.oasys": {
        source: "iana",
        extensions: ["oas"],
      },
      "application/vnd.fujitsu.oasys2": {
        source: "iana",
        extensions: ["oa2"],
      },
      "application/vnd.fujitsu.oasys3": {
        source: "iana",
        extensions: ["oa3"],
      },
      "application/vnd.fujitsu.oasysgp": {
        source: "iana",
        extensions: ["fg5"],
      },
      "application/vnd.fujitsu.oasysprs": {
        source: "iana",
        extensions: ["bh2"],
      },
      "application/vnd.fujixerox.art-ex": {
        source: "iana",
      },
      "application/vnd.fujixerox.art4": {
        source: "iana",
      },
      "application/vnd.fujixerox.ddd": {
        source: "iana",
        extensions: ["ddd"],
      },
      "application/vnd.fujixerox.docuworks": {
        source: "iana",
        extensions: ["xdw"],
      },
      "application/vnd.fujixerox.docuworks.binder": {
        source: "iana",
        extensions: ["xbd"],
      },
      "application/vnd.fujixerox.docuworks.container": {
        source: "iana",
      },
      "application/vnd.fujixerox.hbpl": {
        source: "iana",
      },
      "application/vnd.fut-misnet": {
        source: "iana",
      },
      "application/vnd.futoin+cbor": {
        source: "iana",
      },
      "application/vnd.futoin+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.fuzzysheet": {
        source: "iana",
        extensions: ["fzs"],
      },
      "application/vnd.genomatix.tuxedo": {
        source: "iana",
        extensions: ["txd"],
      },
      "application/vnd.gentics.grd+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.geo+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.geocube+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.geogebra.file": {
        source: "iana",
        extensions: ["ggb"],
      },
      "application/vnd.geogebra.slides": {
        source: "iana",
      },
      "application/vnd.geogebra.tool": {
        source: "iana",
        extensions: ["ggt"],
      },
      "application/vnd.geometry-explorer": {
        source: "iana",
        extensions: ["gex", "gre"],
      },
      "application/vnd.geonext": {
        source: "iana",
        extensions: ["gxt"],
      },
      "application/vnd.geoplan": {
        source: "iana",
        extensions: ["g2w"],
      },
      "application/vnd.geospace": {
        source: "iana",
        extensions: ["g3w"],
      },
      "application/vnd.gerber": {
        source: "iana",
      },
      "application/vnd.globalplatform.card-content-mgt": {
        source: "iana",
      },
      "application/vnd.globalplatform.card-content-mgt-response": {
        source: "iana",
      },
      "application/vnd.gmx": {
        source: "iana",
        extensions: ["gmx"],
      },
      "application/vnd.google-apps.document": {
        compressible: false,
        extensions: ["gdoc"],
      },
      "application/vnd.google-apps.presentation": {
        compressible: false,
        extensions: ["gslides"],
      },
      "application/vnd.google-apps.spreadsheet": {
        compressible: false,
        extensions: ["gsheet"],
      },
      "application/vnd.google-earth.kml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["kml"],
      },
      "application/vnd.google-earth.kmz": {
        source: "iana",
        compressible: false,
        extensions: ["kmz"],
      },
      "application/vnd.gov.sk.e-form+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.gov.sk.e-form+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.gov.sk.xmldatacontainer+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.grafeq": {
        source: "iana",
        extensions: ["gqf", "gqs"],
      },
      "application/vnd.gridmp": {
        source: "iana",
      },
      "application/vnd.groove-account": {
        source: "iana",
        extensions: ["gac"],
      },
      "application/vnd.groove-help": {
        source: "iana",
        extensions: ["ghf"],
      },
      "application/vnd.groove-identity-message": {
        source: "iana",
        extensions: ["gim"],
      },
      "application/vnd.groove-injector": {
        source: "iana",
        extensions: ["grv"],
      },
      "application/vnd.groove-tool-message": {
        source: "iana",
        extensions: ["gtm"],
      },
      "application/vnd.groove-tool-template": {
        source: "iana",
        extensions: ["tpl"],
      },
      "application/vnd.groove-vcard": {
        source: "iana",
        extensions: ["vcg"],
      },
      "application/vnd.hal+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.hal+xml": {
        source: "iana",
        compressible: true,
        extensions: ["hal"],
      },
      "application/vnd.handheld-entertainment+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zmm"],
      },
      "application/vnd.hbci": {
        source: "iana",
        extensions: ["hbci"],
      },
      "application/vnd.hc+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.hcl-bireports": {
        source: "iana",
      },
      "application/vnd.hdt": {
        source: "iana",
      },
      "application/vnd.heroku+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.hhe.lesson-player": {
        source: "iana",
        extensions: ["les"],
      },
      "application/vnd.hl7cda+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/vnd.hl7v2+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/vnd.hp-hpgl": {
        source: "iana",
        extensions: ["hpgl"],
      },
      "application/vnd.hp-hpid": {
        source: "iana",
        extensions: ["hpid"],
      },
      "application/vnd.hp-hps": {
        source: "iana",
        extensions: ["hps"],
      },
      "application/vnd.hp-jlyt": {
        source: "iana",
        extensions: ["jlt"],
      },
      "application/vnd.hp-pcl": {
        source: "iana",
        extensions: ["pcl"],
      },
      "application/vnd.hp-pclxl": {
        source: "iana",
        extensions: ["pclxl"],
      },
      "application/vnd.httphone": {
        source: "iana",
      },
      "application/vnd.hydrostatix.sof-data": {
        source: "iana",
        extensions: ["sfd-hdstx"],
      },
      "application/vnd.hyper+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.hyper-item+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.hyperdrive+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.hzn-3d-crossword": {
        source: "iana",
      },
      "application/vnd.ibm.afplinedata": {
        source: "iana",
      },
      "application/vnd.ibm.electronic-media": {
        source: "iana",
      },
      "application/vnd.ibm.minipay": {
        source: "iana",
        extensions: ["mpy"],
      },
      "application/vnd.ibm.modcap": {
        source: "iana",
        extensions: ["afp", "listafp", "list3820"],
      },
      "application/vnd.ibm.rights-management": {
        source: "iana",
        extensions: ["irm"],
      },
      "application/vnd.ibm.secure-container": {
        source: "iana",
        extensions: ["sc"],
      },
      "application/vnd.iccprofile": {
        source: "iana",
        extensions: ["icc", "icm"],
      },
      "application/vnd.ieee.1905": {
        source: "iana",
      },
      "application/vnd.igloader": {
        source: "iana",
        extensions: ["igl"],
      },
      "application/vnd.imagemeter.folder+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.imagemeter.image+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.immervision-ivp": {
        source: "iana",
        extensions: ["ivp"],
      },
      "application/vnd.immervision-ivu": {
        source: "iana",
        extensions: ["ivu"],
      },
      "application/vnd.ims.imsccv1p1": {
        source: "iana",
      },
      "application/vnd.ims.imsccv1p2": {
        source: "iana",
      },
      "application/vnd.ims.imsccv1p3": {
        source: "iana",
      },
      "application/vnd.ims.lis.v2.result+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ims.lti.v2.toolproxy+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ims.lti.v2.toolproxy.id+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ims.lti.v2.toolsettings+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ims.lti.v2.toolsettings.simple+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.informedcontrol.rms+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.informix-visionary": {
        source: "iana",
      },
      "application/vnd.infotech.project": {
        source: "iana",
      },
      "application/vnd.infotech.project+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.innopath.wamp.notification": {
        source: "iana",
      },
      "application/vnd.insors.igm": {
        source: "iana",
        extensions: ["igm"],
      },
      "application/vnd.intercon.formnet": {
        source: "iana",
        extensions: ["xpw", "xpx"],
      },
      "application/vnd.intergeo": {
        source: "iana",
        extensions: ["i2g"],
      },
      "application/vnd.intertrust.digibox": {
        source: "iana",
      },
      "application/vnd.intertrust.nncp": {
        source: "iana",
      },
      "application/vnd.intu.qbo": {
        source: "iana",
        extensions: ["qbo"],
      },
      "application/vnd.intu.qfx": {
        source: "iana",
        extensions: ["qfx"],
      },
      "application/vnd.iptc.g2.catalogitem+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.iptc.g2.conceptitem+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.iptc.g2.knowledgeitem+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.iptc.g2.newsitem+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.iptc.g2.newsmessage+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.iptc.g2.packageitem+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.iptc.g2.planningitem+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ipunplugged.rcprofile": {
        source: "iana",
        extensions: ["rcprofile"],
      },
      "application/vnd.irepository.package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["irp"],
      },
      "application/vnd.is-xpr": {
        source: "iana",
        extensions: ["xpr"],
      },
      "application/vnd.isac.fcs": {
        source: "iana",
        extensions: ["fcs"],
      },
      "application/vnd.iso11783-10+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.jam": {
        source: "iana",
        extensions: ["jam"],
      },
      "application/vnd.japannet-directory-service": {
        source: "iana",
      },
      "application/vnd.japannet-jpnstore-wakeup": {
        source: "iana",
      },
      "application/vnd.japannet-payment-wakeup": {
        source: "iana",
      },
      "application/vnd.japannet-registration": {
        source: "iana",
      },
      "application/vnd.japannet-registration-wakeup": {
        source: "iana",
      },
      "application/vnd.japannet-setstore-wakeup": {
        source: "iana",
      },
      "application/vnd.japannet-verification": {
        source: "iana",
      },
      "application/vnd.japannet-verification-wakeup": {
        source: "iana",
      },
      "application/vnd.jcp.javame.midlet-rms": {
        source: "iana",
        extensions: ["rms"],
      },
      "application/vnd.jisp": {
        source: "iana",
        extensions: ["jisp"],
      },
      "application/vnd.joost.joda-archive": {
        source: "iana",
        extensions: ["joda"],
      },
      "application/vnd.jsk.isdn-ngn": {
        source: "iana",
      },
      "application/vnd.kahootz": {
        source: "iana",
        extensions: ["ktz", "ktr"],
      },
      "application/vnd.kde.karbon": {
        source: "iana",
        extensions: ["karbon"],
      },
      "application/vnd.kde.kchart": {
        source: "iana",
        extensions: ["chrt"],
      },
      "application/vnd.kde.kformula": {
        source: "iana",
        extensions: ["kfo"],
      },
      "application/vnd.kde.kivio": {
        source: "iana",
        extensions: ["flw"],
      },
      "application/vnd.kde.kontour": {
        source: "iana",
        extensions: ["kon"],
      },
      "application/vnd.kde.kpresenter": {
        source: "iana",
        extensions: ["kpr", "kpt"],
      },
      "application/vnd.kde.kspread": {
        source: "iana",
        extensions: ["ksp"],
      },
      "application/vnd.kde.kword": {
        source: "iana",
        extensions: ["kwd", "kwt"],
      },
      "application/vnd.kenameaapp": {
        source: "iana",
        extensions: ["htke"],
      },
      "application/vnd.kidspiration": {
        source: "iana",
        extensions: ["kia"],
      },
      "application/vnd.kinar": {
        source: "iana",
        extensions: ["kne", "knp"],
      },
      "application/vnd.koan": {
        source: "iana",
        extensions: ["skp", "skd", "skt", "skm"],
      },
      "application/vnd.kodak-descriptor": {
        source: "iana",
        extensions: ["sse"],
      },
      "application/vnd.las": {
        source: "iana",
      },
      "application/vnd.las.las+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.las.las+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lasxml"],
      },
      "application/vnd.laszip": {
        source: "iana",
      },
      "application/vnd.leap+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.liberty-request+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.llamagraphics.life-balance.desktop": {
        source: "iana",
        extensions: ["lbd"],
      },
      "application/vnd.llamagraphics.life-balance.exchange+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lbe"],
      },
      "application/vnd.logipipe.circuit+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.loom": {
        source: "iana",
      },
      "application/vnd.lotus-1-2-3": {
        source: "iana",
        extensions: ["123"],
      },
      "application/vnd.lotus-approach": {
        source: "iana",
        extensions: ["apr"],
      },
      "application/vnd.lotus-freelance": {
        source: "iana",
        extensions: ["pre"],
      },
      "application/vnd.lotus-notes": {
        source: "iana",
        extensions: ["nsf"],
      },
      "application/vnd.lotus-organizer": {
        source: "iana",
        extensions: ["org"],
      },
      "application/vnd.lotus-screencam": {
        source: "iana",
        extensions: ["scm"],
      },
      "application/vnd.lotus-wordpro": {
        source: "iana",
        extensions: ["lwp"],
      },
      "application/vnd.macports.portpkg": {
        source: "iana",
        extensions: ["portpkg"],
      },
      "application/vnd.mapbox-vector-tile": {
        source: "iana",
        extensions: ["mvt"],
      },
      "application/vnd.marlin.drm.actiontoken+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.marlin.drm.conftoken+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.marlin.drm.license+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.marlin.drm.mdcf": {
        source: "iana",
      },
      "application/vnd.mason+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.maxar.archive.3tz+zip": {
        source: "iana",
        compressible: false,
      },
      "application/vnd.maxmind.maxmind-db": {
        source: "iana",
      },
      "application/vnd.mcd": {
        source: "iana",
        extensions: ["mcd"],
      },
      "application/vnd.medcalcdata": {
        source: "iana",
        extensions: ["mc1"],
      },
      "application/vnd.mediastation.cdkey": {
        source: "iana",
        extensions: ["cdkey"],
      },
      "application/vnd.meridian-slingshot": {
        source: "iana",
      },
      "application/vnd.mfer": {
        source: "iana",
        extensions: ["mwf"],
      },
      "application/vnd.mfmp": {
        source: "iana",
        extensions: ["mfm"],
      },
      "application/vnd.micro+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.micrografx.flo": {
        source: "iana",
        extensions: ["flo"],
      },
      "application/vnd.micrografx.igx": {
        source: "iana",
        extensions: ["igx"],
      },
      "application/vnd.microsoft.portable-executable": {
        source: "iana",
      },
      "application/vnd.microsoft.windows.thumbnail-cache": {
        source: "iana",
      },
      "application/vnd.miele+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.mif": {
        source: "iana",
        extensions: ["mif"],
      },
      "application/vnd.minisoft-hp3000-save": {
        source: "iana",
      },
      "application/vnd.mitsubishi.misty-guard.trustweb": {
        source: "iana",
      },
      "application/vnd.mobius.daf": {
        source: "iana",
        extensions: ["daf"],
      },
      "application/vnd.mobius.dis": {
        source: "iana",
        extensions: ["dis"],
      },
      "application/vnd.mobius.mbk": {
        source: "iana",
        extensions: ["mbk"],
      },
      "application/vnd.mobius.mqy": {
        source: "iana",
        extensions: ["mqy"],
      },
      "application/vnd.mobius.msl": {
        source: "iana",
        extensions: ["msl"],
      },
      "application/vnd.mobius.plc": {
        source: "iana",
        extensions: ["plc"],
      },
      "application/vnd.mobius.txf": {
        source: "iana",
        extensions: ["txf"],
      },
      "application/vnd.mophun.application": {
        source: "iana",
        extensions: ["mpn"],
      },
      "application/vnd.mophun.certificate": {
        source: "iana",
        extensions: ["mpc"],
      },
      "application/vnd.motorola.flexsuite": {
        source: "iana",
      },
      "application/vnd.motorola.flexsuite.adsi": {
        source: "iana",
      },
      "application/vnd.motorola.flexsuite.fis": {
        source: "iana",
      },
      "application/vnd.motorola.flexsuite.gotap": {
        source: "iana",
      },
      "application/vnd.motorola.flexsuite.kmr": {
        source: "iana",
      },
      "application/vnd.motorola.flexsuite.ttc": {
        source: "iana",
      },
      "application/vnd.motorola.flexsuite.wem": {
        source: "iana",
      },
      "application/vnd.motorola.iprm": {
        source: "iana",
      },
      "application/vnd.mozilla.xul+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xul"],
      },
      "application/vnd.ms-3mfdocument": {
        source: "iana",
      },
      "application/vnd.ms-artgalry": {
        source: "iana",
        extensions: ["cil"],
      },
      "application/vnd.ms-asf": {
        source: "iana",
      },
      "application/vnd.ms-cab-compressed": {
        source: "iana",
        extensions: ["cab"],
      },
      "application/vnd.ms-color.iccprofile": {
        source: "apache",
      },
      "application/vnd.ms-excel": {
        source: "iana",
        compressible: false,
        extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"],
      },
      "application/vnd.ms-excel.addin.macroenabled.12": {
        source: "iana",
        extensions: ["xlam"],
      },
      "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
        source: "iana",
        extensions: ["xlsb"],
      },
      "application/vnd.ms-excel.sheet.macroenabled.12": {
        source: "iana",
        extensions: ["xlsm"],
      },
      "application/vnd.ms-excel.template.macroenabled.12": {
        source: "iana",
        extensions: ["xltm"],
      },
      "application/vnd.ms-fontobject": {
        source: "iana",
        compressible: true,
        extensions: ["eot"],
      },
      "application/vnd.ms-htmlhelp": {
        source: "iana",
        extensions: ["chm"],
      },
      "application/vnd.ms-ims": {
        source: "iana",
        extensions: ["ims"],
      },
      "application/vnd.ms-lrm": {
        source: "iana",
        extensions: ["lrm"],
      },
      "application/vnd.ms-office.activex+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ms-officetheme": {
        source: "iana",
        extensions: ["thmx"],
      },
      "application/vnd.ms-opentype": {
        source: "apache",
        compressible: true,
      },
      "application/vnd.ms-outlook": {
        compressible: false,
        extensions: ["msg"],
      },
      "application/vnd.ms-package.obfuscated-opentype": {
        source: "apache",
      },
      "application/vnd.ms-pki.seccat": {
        source: "apache",
        extensions: ["cat"],
      },
      "application/vnd.ms-pki.stl": {
        source: "apache",
        extensions: ["stl"],
      },
      "application/vnd.ms-playready.initiator+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ms-powerpoint": {
        source: "iana",
        compressible: false,
        extensions: ["ppt", "pps", "pot"],
      },
      "application/vnd.ms-powerpoint.addin.macroenabled.12": {
        source: "iana",
        extensions: ["ppam"],
      },
      "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
        source: "iana",
        extensions: ["pptm"],
      },
      "application/vnd.ms-powerpoint.slide.macroenabled.12": {
        source: "iana",
        extensions: ["sldm"],
      },
      "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
        source: "iana",
        extensions: ["ppsm"],
      },
      "application/vnd.ms-powerpoint.template.macroenabled.12": {
        source: "iana",
        extensions: ["potm"],
      },
      "application/vnd.ms-printdevicecapabilities+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ms-printing.printticket+xml": {
        source: "apache",
        compressible: true,
      },
      "application/vnd.ms-printschematicket+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ms-project": {
        source: "iana",
        extensions: ["mpp", "mpt"],
      },
      "application/vnd.ms-tnef": {
        source: "iana",
      },
      "application/vnd.ms-windows.devicepairing": {
        source: "iana",
      },
      "application/vnd.ms-windows.nwprinting.oob": {
        source: "iana",
      },
      "application/vnd.ms-windows.printerpairing": {
        source: "iana",
      },
      "application/vnd.ms-windows.wsd.oob": {
        source: "iana",
      },
      "application/vnd.ms-wmdrm.lic-chlg-req": {
        source: "iana",
      },
      "application/vnd.ms-wmdrm.lic-resp": {
        source: "iana",
      },
      "application/vnd.ms-wmdrm.meter-chlg-req": {
        source: "iana",
      },
      "application/vnd.ms-wmdrm.meter-resp": {
        source: "iana",
      },
      "application/vnd.ms-word.document.macroenabled.12": {
        source: "iana",
        extensions: ["docm"],
      },
      "application/vnd.ms-word.template.macroenabled.12": {
        source: "iana",
        extensions: ["dotm"],
      },
      "application/vnd.ms-works": {
        source: "iana",
        extensions: ["wps", "wks", "wcm", "wdb"],
      },
      "application/vnd.ms-wpl": {
        source: "iana",
        extensions: ["wpl"],
      },
      "application/vnd.ms-xpsdocument": {
        source: "iana",
        compressible: false,
        extensions: ["xps"],
      },
      "application/vnd.msa-disk-image": {
        source: "iana",
      },
      "application/vnd.mseq": {
        source: "iana",
        extensions: ["mseq"],
      },
      "application/vnd.msign": {
        source: "iana",
      },
      "application/vnd.multiad.creator": {
        source: "iana",
      },
      "application/vnd.multiad.creator.cif": {
        source: "iana",
      },
      "application/vnd.music-niff": {
        source: "iana",
      },
      "application/vnd.musician": {
        source: "iana",
        extensions: ["mus"],
      },
      "application/vnd.muvee.style": {
        source: "iana",
        extensions: ["msty"],
      },
      "application/vnd.mynfc": {
        source: "iana",
        extensions: ["taglet"],
      },
      "application/vnd.nacamar.ybrid+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.ncd.control": {
        source: "iana",
      },
      "application/vnd.ncd.reference": {
        source: "iana",
      },
      "application/vnd.nearst.inv+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.nebumind.line": {
        source: "iana",
      },
      "application/vnd.nervana": {
        source: "iana",
      },
      "application/vnd.netfpx": {
        source: "iana",
      },
      "application/vnd.neurolanguage.nlu": {
        source: "iana",
        extensions: ["nlu"],
      },
      "application/vnd.nimn": {
        source: "iana",
      },
      "application/vnd.nintendo.nitro.rom": {
        source: "iana",
      },
      "application/vnd.nintendo.snes.rom": {
        source: "iana",
      },
      "application/vnd.nitf": {
        source: "iana",
        extensions: ["ntf", "nitf"],
      },
      "application/vnd.noblenet-directory": {
        source: "iana",
        extensions: ["nnd"],
      },
      "application/vnd.noblenet-sealer": {
        source: "iana",
        extensions: ["nns"],
      },
      "application/vnd.noblenet-web": {
        source: "iana",
        extensions: ["nnw"],
      },
      "application/vnd.nokia.catalogs": {
        source: "iana",
      },
      "application/vnd.nokia.conml+wbxml": {
        source: "iana",
      },
      "application/vnd.nokia.conml+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.nokia.iptv.config+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.nokia.isds-radio-presets": {
        source: "iana",
      },
      "application/vnd.nokia.landmark+wbxml": {
        source: "iana",
      },
      "application/vnd.nokia.landmark+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.nokia.landmarkcollection+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.nokia.n-gage.ac+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ac"],
      },
      "application/vnd.nokia.n-gage.data": {
        source: "iana",
        extensions: ["ngdat"],
      },
      "application/vnd.nokia.n-gage.symbian.install": {
        source: "iana",
        extensions: ["n-gage"],
      },
      "application/vnd.nokia.ncd": {
        source: "iana",
      },
      "application/vnd.nokia.pcd+wbxml": {
        source: "iana",
      },
      "application/vnd.nokia.pcd+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.nokia.radio-preset": {
        source: "iana",
        extensions: ["rpst"],
      },
      "application/vnd.nokia.radio-presets": {
        source: "iana",
        extensions: ["rpss"],
      },
      "application/vnd.novadigm.edm": {
        source: "iana",
        extensions: ["edm"],
      },
      "application/vnd.novadigm.edx": {
        source: "iana",
        extensions: ["edx"],
      },
      "application/vnd.novadigm.ext": {
        source: "iana",
        extensions: ["ext"],
      },
      "application/vnd.ntt-local.content-share": {
        source: "iana",
      },
      "application/vnd.ntt-local.file-transfer": {
        source: "iana",
      },
      "application/vnd.ntt-local.ogw_remote-access": {
        source: "iana",
      },
      "application/vnd.ntt-local.sip-ta_remote": {
        source: "iana",
      },
      "application/vnd.ntt-local.sip-ta_tcp_stream": {
        source: "iana",
      },
      "application/vnd.oasis.opendocument.chart": {
        source: "iana",
        extensions: ["odc"],
      },
      "application/vnd.oasis.opendocument.chart-template": {
        source: "iana",
        extensions: ["otc"],
      },
      "application/vnd.oasis.opendocument.database": {
        source: "iana",
        extensions: ["odb"],
      },
      "application/vnd.oasis.opendocument.formula": {
        source: "iana",
        extensions: ["odf"],
      },
      "application/vnd.oasis.opendocument.formula-template": {
        source: "iana",
        extensions: ["odft"],
      },
      "application/vnd.oasis.opendocument.graphics": {
        source: "iana",
        compressible: false,
        extensions: ["odg"],
      },
      "application/vnd.oasis.opendocument.graphics-template": {
        source: "iana",
        extensions: ["otg"],
      },
      "application/vnd.oasis.opendocument.image": {
        source: "iana",
        extensions: ["odi"],
      },
      "application/vnd.oasis.opendocument.image-template": {
        source: "iana",
        extensions: ["oti"],
      },
      "application/vnd.oasis.opendocument.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["odp"],
      },
      "application/vnd.oasis.opendocument.presentation-template": {
        source: "iana",
        extensions: ["otp"],
      },
      "application/vnd.oasis.opendocument.spreadsheet": {
        source: "iana",
        compressible: false,
        extensions: ["ods"],
      },
      "application/vnd.oasis.opendocument.spreadsheet-template": {
        source: "iana",
        extensions: ["ots"],
      },
      "application/vnd.oasis.opendocument.text": {
        source: "iana",
        compressible: false,
        extensions: ["odt"],
      },
      "application/vnd.oasis.opendocument.text-master": {
        source: "iana",
        extensions: ["odm"],
      },
      "application/vnd.oasis.opendocument.text-template": {
        source: "iana",
        extensions: ["ott"],
      },
      "application/vnd.oasis.opendocument.text-web": {
        source: "iana",
        extensions: ["oth"],
      },
      "application/vnd.obn": {
        source: "iana",
      },
      "application/vnd.ocf+cbor": {
        source: "iana",
      },
      "application/vnd.oci.image.manifest.v1+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oftn.l10n+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oipf.contentaccessdownload+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oipf.contentaccessstreaming+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oipf.cspg-hexbinary": {
        source: "iana",
      },
      "application/vnd.oipf.dae.svg+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oipf.dae.xhtml+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oipf.mippvcontrolmessage+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oipf.pae.gem": {
        source: "iana",
      },
      "application/vnd.oipf.spdiscovery+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oipf.spdlist+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oipf.ueprofile+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oipf.userprofile+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.olpc-sugar": {
        source: "iana",
        extensions: ["xo"],
      },
      "application/vnd.oma-scws-config": {
        source: "iana",
      },
      "application/vnd.oma-scws-http-request": {
        source: "iana",
      },
      "application/vnd.oma-scws-http-response": {
        source: "iana",
      },
      "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.bcast.drm-trigger+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.bcast.imd+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.bcast.ltkm": {
        source: "iana",
      },
      "application/vnd.oma.bcast.notification+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.bcast.provisioningtrigger": {
        source: "iana",
      },
      "application/vnd.oma.bcast.sgboot": {
        source: "iana",
      },
      "application/vnd.oma.bcast.sgdd+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.bcast.sgdu": {
        source: "iana",
      },
      "application/vnd.oma.bcast.simple-symbol-container": {
        source: "iana",
      },
      "application/vnd.oma.bcast.smartcard-trigger+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.bcast.sprov+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.bcast.stkm": {
        source: "iana",
      },
      "application/vnd.oma.cab-address-book+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.cab-feature-handler+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.cab-pcc+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.cab-subs-invite+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.cab-user-prefs+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.dcd": {
        source: "iana",
      },
      "application/vnd.oma.dcdc": {
        source: "iana",
      },
      "application/vnd.oma.dd2+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dd2"],
      },
      "application/vnd.oma.drm.risd+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.group-usage-list+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.lwm2m+cbor": {
        source: "iana",
      },
      "application/vnd.oma.lwm2m+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.lwm2m+tlv": {
        source: "iana",
      },
      "application/vnd.oma.pal+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.poc.detailed-progress-report+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.poc.final-report+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.poc.groups+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.poc.invocation-descriptor+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.poc.optimized-progress-report+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.push": {
        source: "iana",
      },
      "application/vnd.oma.scidm.messages+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oma.xcap-directory+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.omads-email+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/vnd.omads-file+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/vnd.omads-folder+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/vnd.omaloc-supl-init": {
        source: "iana",
      },
      "application/vnd.onepager": {
        source: "iana",
      },
      "application/vnd.onepagertamp": {
        source: "iana",
      },
      "application/vnd.onepagertamx": {
        source: "iana",
      },
      "application/vnd.onepagertat": {
        source: "iana",
      },
      "application/vnd.onepagertatp": {
        source: "iana",
      },
      "application/vnd.onepagertatx": {
        source: "iana",
      },
      "application/vnd.openblox.game+xml": {
        source: "iana",
        compressible: true,
        extensions: ["obgx"],
      },
      "application/vnd.openblox.game-binary": {
        source: "iana",
      },
      "application/vnd.openeye.oeb": {
        source: "iana",
      },
      "application/vnd.openofficeorg.extension": {
        source: "apache",
        extensions: ["oxt"],
      },
      "application/vnd.openstreetmap.data+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osm"],
      },
      "application/vnd.opentimestamps.ots": {
        source: "iana",
      },
      "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.openxmlformats-officedocument.drawing+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.comments+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        {
          source: "iana",
          compressible: false,
          extensions: ["pptx"],
        },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.slide": {
        source: "iana",
        extensions: ["sldx"],
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
        {
          source: "iana",
          extensions: ["ppsx"],
        },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template": {
        source: "iana",
        extensions: ["potx"],
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        source: "iana",
        compressible: false,
        extensions: ["xlsx"],
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
        source: "iana",
        extensions: ["xltx"],
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.theme+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.openxmlformats-officedocument.vmldrawing": {
        source: "iana",
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        {
          source: "iana",
          compressible: false,
          extensions: ["docx"],
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
        {
          source: "iana",
          extensions: ["dotx"],
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-package.core-properties+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":
        {
          source: "iana",
          compressible: true,
        },
      "application/vnd.openxmlformats-package.relationships+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oracle.resource+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.orange.indata": {
        source: "iana",
      },
      "application/vnd.osa.netdeploy": {
        source: "iana",
      },
      "application/vnd.osgeo.mapguide.package": {
        source: "iana",
        extensions: ["mgp"],
      },
      "application/vnd.osgi.bundle": {
        source: "iana",
      },
      "application/vnd.osgi.dp": {
        source: "iana",
        extensions: ["dp"],
      },
      "application/vnd.osgi.subsystem": {
        source: "iana",
        extensions: ["esa"],
      },
      "application/vnd.otps.ct-kip+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.oxli.countgraph": {
        source: "iana",
      },
      "application/vnd.pagerduty+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.palm": {
        source: "iana",
        extensions: ["pdb", "pqa", "oprc"],
      },
      "application/vnd.panoply": {
        source: "iana",
      },
      "application/vnd.paos.xml": {
        source: "iana",
      },
      "application/vnd.patentdive": {
        source: "iana",
      },
      "application/vnd.patientecommsdoc": {
        source: "iana",
      },
      "application/vnd.pawaafile": {
        source: "iana",
        extensions: ["paw"],
      },
      "application/vnd.pcos": {
        source: "iana",
      },
      "application/vnd.pg.format": {
        source: "iana",
        extensions: ["str"],
      },
      "application/vnd.pg.osasli": {
        source: "iana",
        extensions: ["ei6"],
      },
      "application/vnd.piaccess.application-licence": {
        source: "iana",
      },
      "application/vnd.picsel": {
        source: "iana",
        extensions: ["efif"],
      },
      "application/vnd.pmi.widget": {
        source: "iana",
        extensions: ["wg"],
      },
      "application/vnd.poc.group-advertisement+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.pocketlearn": {
        source: "iana",
        extensions: ["plf"],
      },
      "application/vnd.powerbuilder6": {
        source: "iana",
        extensions: ["pbd"],
      },
      "application/vnd.powerbuilder6-s": {
        source: "iana",
      },
      "application/vnd.powerbuilder7": {
        source: "iana",
      },
      "application/vnd.powerbuilder7-s": {
        source: "iana",
      },
      "application/vnd.powerbuilder75": {
        source: "iana",
      },
      "application/vnd.powerbuilder75-s": {
        source: "iana",
      },
      "application/vnd.preminet": {
        source: "iana",
      },
      "application/vnd.previewsystems.box": {
        source: "iana",
        extensions: ["box"],
      },
      "application/vnd.proteus.magazine": {
        source: "iana",
        extensions: ["mgz"],
      },
      "application/vnd.psfs": {
        source: "iana",
      },
      "application/vnd.publishare-delta-tree": {
        source: "iana",
        extensions: ["qps"],
      },
      "application/vnd.pvi.ptid1": {
        source: "iana",
        extensions: ["ptid"],
      },
      "application/vnd.pwg-multiplexed": {
        source: "iana",
      },
      "application/vnd.pwg-xhtml-print+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.qualcomm.brew-app-res": {
        source: "iana",
      },
      "application/vnd.quarantainenet": {
        source: "iana",
      },
      "application/vnd.quark.quarkxpress": {
        source: "iana",
        extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"],
      },
      "application/vnd.quobject-quoxdocument": {
        source: "iana",
      },
      "application/vnd.radisys.moml+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-audit+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-audit-conf+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-audit-conn+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-audit-dialog+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-audit-stream+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-conf+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-dialog+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-dialog-base+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-dialog-fax-detect+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-dialog-group+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-dialog-speech+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.radisys.msml-dialog-transform+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.rainstor.data": {
        source: "iana",
      },
      "application/vnd.rapid": {
        source: "iana",
      },
      "application/vnd.rar": {
        source: "iana",
        extensions: ["rar"],
      },
      "application/vnd.realvnc.bed": {
        source: "iana",
        extensions: ["bed"],
      },
      "application/vnd.recordare.musicxml": {
        source: "iana",
        extensions: ["mxl"],
      },
      "application/vnd.recordare.musicxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musicxml"],
      },
      "application/vnd.renlearn.rlprint": {
        source: "iana",
      },
      "application/vnd.resilient.logic": {
        source: "iana",
      },
      "application/vnd.restful+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.rig.cryptonote": {
        source: "iana",
        extensions: ["cryptonote"],
      },
      "application/vnd.rim.cod": {
        source: "apache",
        extensions: ["cod"],
      },
      "application/vnd.rn-realmedia": {
        source: "apache",
        extensions: ["rm"],
      },
      "application/vnd.rn-realmedia-vbr": {
        source: "apache",
        extensions: ["rmvb"],
      },
      "application/vnd.route66.link66+xml": {
        source: "iana",
        compressible: true,
        extensions: ["link66"],
      },
      "application/vnd.rs-274x": {
        source: "iana",
      },
      "application/vnd.ruckus.download": {
        source: "iana",
      },
      "application/vnd.s3sms": {
        source: "iana",
      },
      "application/vnd.sailingtracker.track": {
        source: "iana",
        extensions: ["st"],
      },
      "application/vnd.sar": {
        source: "iana",
      },
      "application/vnd.sbm.cid": {
        source: "iana",
      },
      "application/vnd.sbm.mid2": {
        source: "iana",
      },
      "application/vnd.scribus": {
        source: "iana",
      },
      "application/vnd.sealed.3df": {
        source: "iana",
      },
      "application/vnd.sealed.csf": {
        source: "iana",
      },
      "application/vnd.sealed.doc": {
        source: "iana",
      },
      "application/vnd.sealed.eml": {
        source: "iana",
      },
      "application/vnd.sealed.mht": {
        source: "iana",
      },
      "application/vnd.sealed.net": {
        source: "iana",
      },
      "application/vnd.sealed.ppt": {
        source: "iana",
      },
      "application/vnd.sealed.tiff": {
        source: "iana",
      },
      "application/vnd.sealed.xls": {
        source: "iana",
      },
      "application/vnd.sealedmedia.softseal.html": {
        source: "iana",
      },
      "application/vnd.sealedmedia.softseal.pdf": {
        source: "iana",
      },
      "application/vnd.seemail": {
        source: "iana",
        extensions: ["see"],
      },
      "application/vnd.seis+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.sema": {
        source: "iana",
        extensions: ["sema"],
      },
      "application/vnd.semd": {
        source: "iana",
        extensions: ["semd"],
      },
      "application/vnd.semf": {
        source: "iana",
        extensions: ["semf"],
      },
      "application/vnd.shade-save-file": {
        source: "iana",
      },
      "application/vnd.shana.informed.formdata": {
        source: "iana",
        extensions: ["ifm"],
      },
      "application/vnd.shana.informed.formtemplate": {
        source: "iana",
        extensions: ["itp"],
      },
      "application/vnd.shana.informed.interchange": {
        source: "iana",
        extensions: ["iif"],
      },
      "application/vnd.shana.informed.package": {
        source: "iana",
        extensions: ["ipk"],
      },
      "application/vnd.shootproof+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.shopkick+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.shp": {
        source: "iana",
      },
      "application/vnd.shx": {
        source: "iana",
      },
      "application/vnd.sigrok.session": {
        source: "iana",
      },
      "application/vnd.simtech-mindmapper": {
        source: "iana",
        extensions: ["twd", "twds"],
      },
      "application/vnd.siren+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.smaf": {
        source: "iana",
        extensions: ["mmf"],
      },
      "application/vnd.smart.notebook": {
        source: "iana",
      },
      "application/vnd.smart.teacher": {
        source: "iana",
        extensions: ["teacher"],
      },
      "application/vnd.snesdev-page-table": {
        source: "iana",
      },
      "application/vnd.software602.filler.form+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fo"],
      },
      "application/vnd.software602.filler.form-xml-zip": {
        source: "iana",
      },
      "application/vnd.solent.sdkm+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sdkm", "sdkd"],
      },
      "application/vnd.spotfire.dxp": {
        source: "iana",
        extensions: ["dxp"],
      },
      "application/vnd.spotfire.sfs": {
        source: "iana",
        extensions: ["sfs"],
      },
      "application/vnd.sqlite3": {
        source: "iana",
      },
      "application/vnd.sss-cod": {
        source: "iana",
      },
      "application/vnd.sss-dtf": {
        source: "iana",
      },
      "application/vnd.sss-ntf": {
        source: "iana",
      },
      "application/vnd.stardivision.calc": {
        source: "apache",
        extensions: ["sdc"],
      },
      "application/vnd.stardivision.draw": {
        source: "apache",
        extensions: ["sda"],
      },
      "application/vnd.stardivision.impress": {
        source: "apache",
        extensions: ["sdd"],
      },
      "application/vnd.stardivision.math": {
        source: "apache",
        extensions: ["smf"],
      },
      "application/vnd.stardivision.writer": {
        source: "apache",
        extensions: ["sdw", "vor"],
      },
      "application/vnd.stardivision.writer-global": {
        source: "apache",
        extensions: ["sgl"],
      },
      "application/vnd.stepmania.package": {
        source: "iana",
        extensions: ["smzip"],
      },
      "application/vnd.stepmania.stepchart": {
        source: "iana",
        extensions: ["sm"],
      },
      "application/vnd.street-stream": {
        source: "iana",
      },
      "application/vnd.sun.wadl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wadl"],
      },
      "application/vnd.sun.xml.calc": {
        source: "apache",
        extensions: ["sxc"],
      },
      "application/vnd.sun.xml.calc.template": {
        source: "apache",
        extensions: ["stc"],
      },
      "application/vnd.sun.xml.draw": {
        source: "apache",
        extensions: ["sxd"],
      },
      "application/vnd.sun.xml.draw.template": {
        source: "apache",
        extensions: ["std"],
      },
      "application/vnd.sun.xml.impress": {
        source: "apache",
        extensions: ["sxi"],
      },
      "application/vnd.sun.xml.impress.template": {
        source: "apache",
        extensions: ["sti"],
      },
      "application/vnd.sun.xml.math": {
        source: "apache",
        extensions: ["sxm"],
      },
      "application/vnd.sun.xml.writer": {
        source: "apache",
        extensions: ["sxw"],
      },
      "application/vnd.sun.xml.writer.global": {
        source: "apache",
        extensions: ["sxg"],
      },
      "application/vnd.sun.xml.writer.template": {
        source: "apache",
        extensions: ["stw"],
      },
      "application/vnd.sus-calendar": {
        source: "iana",
        extensions: ["sus", "susp"],
      },
      "application/vnd.svd": {
        source: "iana",
        extensions: ["svd"],
      },
      "application/vnd.swiftview-ics": {
        source: "iana",
      },
      "application/vnd.sycle+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.syft+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.symbian.install": {
        source: "apache",
        extensions: ["sis", "sisx"],
      },
      "application/vnd.syncml+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xsm"],
      },
      "application/vnd.syncml.dm+wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["bdm"],
      },
      "application/vnd.syncml.dm+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xdm"],
      },
      "application/vnd.syncml.dm.notification": {
        source: "iana",
      },
      "application/vnd.syncml.dmddf+wbxml": {
        source: "iana",
      },
      "application/vnd.syncml.dmddf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["ddf"],
      },
      "application/vnd.syncml.dmtnds+wbxml": {
        source: "iana",
      },
      "application/vnd.syncml.dmtnds+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
      },
      "application/vnd.syncml.ds.notification": {
        source: "iana",
      },
      "application/vnd.tableschema+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.tao.intent-module-archive": {
        source: "iana",
        extensions: ["tao"],
      },
      "application/vnd.tcpdump.pcap": {
        source: "iana",
        extensions: ["pcap", "cap", "dmp"],
      },
      "application/vnd.think-cell.ppttc+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.tmd.mediaflex.api+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.tml": {
        source: "iana",
      },
      "application/vnd.tmobile-livetv": {
        source: "iana",
        extensions: ["tmo"],
      },
      "application/vnd.tri.onesource": {
        source: "iana",
      },
      "application/vnd.trid.tpt": {
        source: "iana",
        extensions: ["tpt"],
      },
      "application/vnd.triscape.mxs": {
        source: "iana",
        extensions: ["mxs"],
      },
      "application/vnd.trueapp": {
        source: "iana",
        extensions: ["tra"],
      },
      "application/vnd.truedoc": {
        source: "iana",
      },
      "application/vnd.ubisoft.webplayer": {
        source: "iana",
      },
      "application/vnd.ufdl": {
        source: "iana",
        extensions: ["ufd", "ufdl"],
      },
      "application/vnd.uiq.theme": {
        source: "iana",
        extensions: ["utz"],
      },
      "application/vnd.umajin": {
        source: "iana",
        extensions: ["umj"],
      },
      "application/vnd.unity": {
        source: "iana",
        extensions: ["unityweb"],
      },
      "application/vnd.uoml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uoml"],
      },
      "application/vnd.uplanet.alert": {
        source: "iana",
      },
      "application/vnd.uplanet.alert-wbxml": {
        source: "iana",
      },
      "application/vnd.uplanet.bearer-choice": {
        source: "iana",
      },
      "application/vnd.uplanet.bearer-choice-wbxml": {
        source: "iana",
      },
      "application/vnd.uplanet.cacheop": {
        source: "iana",
      },
      "application/vnd.uplanet.cacheop-wbxml": {
        source: "iana",
      },
      "application/vnd.uplanet.channel": {
        source: "iana",
      },
      "application/vnd.uplanet.channel-wbxml": {
        source: "iana",
      },
      "application/vnd.uplanet.list": {
        source: "iana",
      },
      "application/vnd.uplanet.list-wbxml": {
        source: "iana",
      },
      "application/vnd.uplanet.listcmd": {
        source: "iana",
      },
      "application/vnd.uplanet.listcmd-wbxml": {
        source: "iana",
      },
      "application/vnd.uplanet.signal": {
        source: "iana",
      },
      "application/vnd.uri-map": {
        source: "iana",
      },
      "application/vnd.valve.source.material": {
        source: "iana",
      },
      "application/vnd.vcx": {
        source: "iana",
        extensions: ["vcx"],
      },
      "application/vnd.vd-study": {
        source: "iana",
      },
      "application/vnd.vectorworks": {
        source: "iana",
      },
      "application/vnd.vel+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.verimatrix.vcas": {
        source: "iana",
      },
      "application/vnd.veritone.aion+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.veryant.thin": {
        source: "iana",
      },
      "application/vnd.ves.encrypted": {
        source: "iana",
      },
      "application/vnd.vidsoft.vidconference": {
        source: "iana",
      },
      "application/vnd.visio": {
        source: "iana",
        extensions: ["vsd", "vst", "vss", "vsw"],
      },
      "application/vnd.visionary": {
        source: "iana",
        extensions: ["vis"],
      },
      "application/vnd.vividence.scriptfile": {
        source: "iana",
      },
      "application/vnd.vsf": {
        source: "iana",
        extensions: ["vsf"],
      },
      "application/vnd.wap.sic": {
        source: "iana",
      },
      "application/vnd.wap.slc": {
        source: "iana",
      },
      "application/vnd.wap.wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["wbxml"],
      },
      "application/vnd.wap.wmlc": {
        source: "iana",
        extensions: ["wmlc"],
      },
      "application/vnd.wap.wmlscriptc": {
        source: "iana",
        extensions: ["wmlsc"],
      },
      "application/vnd.webturbo": {
        source: "iana",
        extensions: ["wtb"],
      },
      "application/vnd.wfa.dpp": {
        source: "iana",
      },
      "application/vnd.wfa.p2p": {
        source: "iana",
      },
      "application/vnd.wfa.wsc": {
        source: "iana",
      },
      "application/vnd.windows.devicepairing": {
        source: "iana",
      },
      "application/vnd.wmc": {
        source: "iana",
      },
      "application/vnd.wmf.bootstrap": {
        source: "iana",
      },
      "application/vnd.wolfram.mathematica": {
        source: "iana",
      },
      "application/vnd.wolfram.mathematica.package": {
        source: "iana",
      },
      "application/vnd.wolfram.player": {
        source: "iana",
        extensions: ["nbp"],
      },
      "application/vnd.wordperfect": {
        source: "iana",
        extensions: ["wpd"],
      },
      "application/vnd.wqd": {
        source: "iana",
        extensions: ["wqd"],
      },
      "application/vnd.wrq-hp3000-labelled": {
        source: "iana",
      },
      "application/vnd.wt.stf": {
        source: "iana",
        extensions: ["stf"],
      },
      "application/vnd.wv.csp+wbxml": {
        source: "iana",
      },
      "application/vnd.wv.csp+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.wv.ssp+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.xacml+json": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.xara": {
        source: "iana",
        extensions: ["xar"],
      },
      "application/vnd.xfdl": {
        source: "iana",
        extensions: ["xfdl"],
      },
      "application/vnd.xfdl.webform": {
        source: "iana",
      },
      "application/vnd.xmi+xml": {
        source: "iana",
        compressible: true,
      },
      "application/vnd.xmpie.cpkg": {
        source: "iana",
      },
      "application/vnd.xmpie.dpkg": {
        source: "iana",
      },
      "application/vnd.xmpie.plan": {
        source: "iana",
      },
      "application/vnd.xmpie.ppkg": {
        source: "iana",
      },
      "application/vnd.xmpie.xlim": {
        source: "iana",
      },
      "application/vnd.yamaha.hv-dic": {
        source: "iana",
        extensions: ["hvd"],
      },
      "application/vnd.yamaha.hv-script": {
        source: "iana",
        extensions: ["hvs"],
      },
      "application/vnd.yamaha.hv-voice": {
        source: "iana",
        extensions: ["hvp"],
      },
      "application/vnd.yamaha.openscoreformat": {
        source: "iana",
        extensions: ["osf"],
      },
      "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osfpvg"],
      },
      "application/vnd.yamaha.remote-setup": {
        source: "iana",
      },
      "application/vnd.yamaha.smaf-audio": {
        source: "iana",
        extensions: ["saf"],
      },
      "application/vnd.yamaha.smaf-phrase": {
        source: "iana",
        extensions: ["spf"],
      },
      "application/vnd.yamaha.through-ngn": {
        source: "iana",
      },
      "application/vnd.yamaha.tunnel-udpencap": {
        source: "iana",
      },
      "application/vnd.yaoweme": {
        source: "iana",
      },
      "application/vnd.yellowriver-custom-menu": {
        source: "iana",
        extensions: ["cmp"],
      },
      "application/vnd.youtube.yt": {
        source: "iana",
      },
      "application/vnd.zul": {
        source: "iana",
        extensions: ["zir", "zirz"],
      },
      "application/vnd.zzazz.deck+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zaz"],
      },
      "application/voicexml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["vxml"],
      },
      "application/voucher-cms+json": {
        source: "iana",
        compressible: true,
      },
      "application/vq-rtcpxr": {
        source: "iana",
      },
      "application/wasm": {
        source: "iana",
        compressible: true,
        extensions: ["wasm"],
      },
      "application/watcherinfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wif"],
      },
      "application/webpush-options+json": {
        source: "iana",
        compressible: true,
      },
      "application/whoispp-query": {
        source: "iana",
      },
      "application/whoispp-response": {
        source: "iana",
      },
      "application/widget": {
        source: "iana",
        extensions: ["wgt"],
      },
      "application/winhlp": {
        source: "apache",
        extensions: ["hlp"],
      },
      "application/wita": {
        source: "iana",
      },
      "application/wordperfect5.1": {
        source: "iana",
      },
      "application/wsdl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wsdl"],
      },
      "application/wspolicy+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wspolicy"],
      },
      "application/x-7z-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["7z"],
      },
      "application/x-abiword": {
        source: "apache",
        extensions: ["abw"],
      },
      "application/x-ace-compressed": {
        source: "apache",
        extensions: ["ace"],
      },
      "application/x-amf": {
        source: "apache",
      },
      "application/x-apple-diskimage": {
        source: "apache",
        extensions: ["dmg"],
      },
      "application/x-arj": {
        compressible: false,
        extensions: ["arj"],
      },
      "application/x-authorware-bin": {
        source: "apache",
        extensions: ["aab", "x32", "u32", "vox"],
      },
      "application/x-authorware-map": {
        source: "apache",
        extensions: ["aam"],
      },
      "application/x-authorware-seg": {
        source: "apache",
        extensions: ["aas"],
      },
      "application/x-bcpio": {
        source: "apache",
        extensions: ["bcpio"],
      },
      "application/x-bdoc": {
        compressible: false,
        extensions: ["bdoc"],
      },
      "application/x-bittorrent": {
        source: "apache",
        extensions: ["torrent"],
      },
      "application/x-blorb": {
        source: "apache",
        extensions: ["blb", "blorb"],
      },
      "application/x-bzip": {
        source: "apache",
        compressible: false,
        extensions: ["bz"],
      },
      "application/x-bzip2": {
        source: "apache",
        compressible: false,
        extensions: ["bz2", "boz"],
      },
      "application/x-cbr": {
        source: "apache",
        extensions: ["cbr", "cba", "cbt", "cbz", "cb7"],
      },
      "application/x-cdlink": {
        source: "apache",
        extensions: ["vcd"],
      },
      "application/x-cfs-compressed": {
        source: "apache",
        extensions: ["cfs"],
      },
      "application/x-chat": {
        source: "apache",
        extensions: ["chat"],
      },
      "application/x-chess-pgn": {
        source: "apache",
        extensions: ["pgn"],
      },
      "application/x-chrome-extension": {
        extensions: ["crx"],
      },
      "application/x-cocoa": {
        source: "nginx",
        extensions: ["cco"],
      },
      "application/x-compress": {
        source: "apache",
      },
      "application/x-conference": {
        source: "apache",
        extensions: ["nsc"],
      },
      "application/x-cpio": {
        source: "apache",
        extensions: ["cpio"],
      },
      "application/x-csh": {
        source: "apache",
        extensions: ["csh"],
      },
      "application/x-deb": {
        compressible: false,
      },
      "application/x-debian-package": {
        source: "apache",
        extensions: ["deb", "udeb"],
      },
      "application/x-dgc-compressed": {
        source: "apache",
        extensions: ["dgc"],
      },
      "application/x-director": {
        source: "apache",
        extensions: [
          "dir",
          "dcr",
          "dxr",
          "cst",
          "cct",
          "cxt",
          "w3d",
          "fgd",
          "swa",
        ],
      },
      "application/x-doom": {
        source: "apache",
        extensions: ["wad"],
      },
      "application/x-dtbncx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ncx"],
      },
      "application/x-dtbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dtb"],
      },
      "application/x-dtbresource+xml": {
        source: "apache",
        compressible: true,
        extensions: ["res"],
      },
      "application/x-dvi": {
        source: "apache",
        compressible: false,
        extensions: ["dvi"],
      },
      "application/x-envoy": {
        source: "apache",
        extensions: ["evy"],
      },
      "application/x-eva": {
        source: "apache",
        extensions: ["eva"],
      },
      "application/x-font-bdf": {
        source: "apache",
        extensions: ["bdf"],
      },
      "application/x-font-dos": {
        source: "apache",
      },
      "application/x-font-framemaker": {
        source: "apache",
      },
      "application/x-font-ghostscript": {
        source: "apache",
        extensions: ["gsf"],
      },
      "application/x-font-libgrx": {
        source: "apache",
      },
      "application/x-font-linux-psf": {
        source: "apache",
        extensions: ["psf"],
      },
      "application/x-font-pcf": {
        source: "apache",
        extensions: ["pcf"],
      },
      "application/x-font-snf": {
        source: "apache",
        extensions: ["snf"],
      },
      "application/x-font-speedo": {
        source: "apache",
      },
      "application/x-font-sunos-news": {
        source: "apache",
      },
      "application/x-font-type1": {
        source: "apache",
        extensions: ["pfa", "pfb", "pfm", "afm"],
      },
      "application/x-font-vfont": {
        source: "apache",
      },
      "application/x-freearc": {
        source: "apache",
        extensions: ["arc"],
      },
      "application/x-futuresplash": {
        source: "apache",
        extensions: ["spl"],
      },
      "application/x-gca-compressed": {
        source: "apache",
        extensions: ["gca"],
      },
      "application/x-glulx": {
        source: "apache",
        extensions: ["ulx"],
      },
      "application/x-gnumeric": {
        source: "apache",
        extensions: ["gnumeric"],
      },
      "application/x-gramps-xml": {
        source: "apache",
        extensions: ["gramps"],
      },
      "application/x-gtar": {
        source: "apache",
        extensions: ["gtar"],
      },
      "application/x-gzip": {
        source: "apache",
      },
      "application/x-hdf": {
        source: "apache",
        extensions: ["hdf"],
      },
      "application/x-httpd-php": {
        compressible: true,
        extensions: ["php"],
      },
      "application/x-install-instructions": {
        source: "apache",
        extensions: ["install"],
      },
      "application/x-iso9660-image": {
        source: "apache",
        extensions: ["iso"],
      },
      "application/x-iwork-keynote-sffkey": {
        extensions: ["key"],
      },
      "application/x-iwork-numbers-sffnumbers": {
        extensions: ["numbers"],
      },
      "application/x-iwork-pages-sffpages": {
        extensions: ["pages"],
      },
      "application/x-java-archive-diff": {
        source: "nginx",
        extensions: ["jardiff"],
      },
      "application/x-java-jnlp-file": {
        source: "apache",
        compressible: false,
        extensions: ["jnlp"],
      },
      "application/x-javascript": {
        compressible: true,
      },
      "application/x-keepass2": {
        extensions: ["kdbx"],
      },
      "application/x-latex": {
        source: "apache",
        compressible: false,
        extensions: ["latex"],
      },
      "application/x-lua-bytecode": {
        extensions: ["luac"],
      },
      "application/x-lzh-compressed": {
        source: "apache",
        extensions: ["lzh", "lha"],
      },
      "application/x-makeself": {
        source: "nginx",
        extensions: ["run"],
      },
      "application/x-mie": {
        source: "apache",
        extensions: ["mie"],
      },
      "application/x-mobipocket-ebook": {
        source: "apache",
        extensions: ["prc", "mobi"],
      },
      "application/x-mpegurl": {
        compressible: false,
      },
      "application/x-ms-application": {
        source: "apache",
        extensions: ["application"],
      },
      "application/x-ms-shortcut": {
        source: "apache",
        extensions: ["lnk"],
      },
      "application/x-ms-wmd": {
        source: "apache",
        extensions: ["wmd"],
      },
      "application/x-ms-wmz": {
        source: "apache",
        extensions: ["wmz"],
      },
      "application/x-ms-xbap": {
        source: "apache",
        extensions: ["xbap"],
      },
      "application/x-msaccess": {
        source: "apache",
        extensions: ["mdb"],
      },
      "application/x-msbinder": {
        source: "apache",
        extensions: ["obd"],
      },
      "application/x-mscardfile": {
        source: "apache",
        extensions: ["crd"],
      },
      "application/x-msclip": {
        source: "apache",
        extensions: ["clp"],
      },
      "application/x-msdos-program": {
        extensions: ["exe"],
      },
      "application/x-msdownload": {
        source: "apache",
        extensions: ["exe", "dll", "com", "bat", "msi"],
      },
      "application/x-msmediaview": {
        source: "apache",
        extensions: ["mvb", "m13", "m14"],
      },
      "application/x-msmetafile": {
        source: "apache",
        extensions: ["wmf", "wmz", "emf", "emz"],
      },
      "application/x-msmoney": {
        source: "apache",
        extensions: ["mny"],
      },
      "application/x-mspublisher": {
        source: "apache",
        extensions: ["pub"],
      },
      "application/x-msschedule": {
        source: "apache",
        extensions: ["scd"],
      },
      "application/x-msterminal": {
        source: "apache",
        extensions: ["trm"],
      },
      "application/x-mswrite": {
        source: "apache",
        extensions: ["wri"],
      },
      "application/x-netcdf": {
        source: "apache",
        extensions: ["nc", "cdf"],
      },
      "application/x-ns-proxy-autoconfig": {
        compressible: true,
        extensions: ["pac"],
      },
      "application/x-nzb": {
        source: "apache",
        extensions: ["nzb"],
      },
      "application/x-perl": {
        source: "nginx",
        extensions: ["pl", "pm"],
      },
      "application/x-pilot": {
        source: "nginx",
        extensions: ["prc", "pdb"],
      },
      "application/x-pkcs12": {
        source: "apache",
        compressible: false,
        extensions: ["p12", "pfx"],
      },
      "application/x-pkcs7-certificates": {
        source: "apache",
        extensions: ["p7b", "spc"],
      },
      "application/x-pkcs7-certreqresp": {
        source: "apache",
        extensions: ["p7r"],
      },
      "application/x-pki-message": {
        source: "iana",
      },
      "application/x-rar-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["rar"],
      },
      "application/x-redhat-package-manager": {
        source: "nginx",
        extensions: ["rpm"],
      },
      "application/x-research-info-systems": {
        source: "apache",
        extensions: ["ris"],
      },
      "application/x-sea": {
        source: "nginx",
        extensions: ["sea"],
      },
      "application/x-sh": {
        source: "apache",
        compressible: true,
        extensions: ["sh"],
      },
      "application/x-shar": {
        source: "apache",
        extensions: ["shar"],
      },
      "application/x-shockwave-flash": {
        source: "apache",
        compressible: false,
        extensions: ["swf"],
      },
      "application/x-silverlight-app": {
        source: "apache",
        extensions: ["xap"],
      },
      "application/x-sql": {
        source: "apache",
        extensions: ["sql"],
      },
      "application/x-stuffit": {
        source: "apache",
        compressible: false,
        extensions: ["sit"],
      },
      "application/x-stuffitx": {
        source: "apache",
        extensions: ["sitx"],
      },
      "application/x-subrip": {
        source: "apache",
        extensions: ["srt"],
      },
      "application/x-sv4cpio": {
        source: "apache",
        extensions: ["sv4cpio"],
      },
      "application/x-sv4crc": {
        source: "apache",
        extensions: ["sv4crc"],
      },
      "application/x-t3vm-image": {
        source: "apache",
        extensions: ["t3"],
      },
      "application/x-tads": {
        source: "apache",
        extensions: ["gam"],
      },
      "application/x-tar": {
        source: "apache",
        compressible: true,
        extensions: ["tar"],
      },
      "application/x-tcl": {
        source: "apache",
        extensions: ["tcl", "tk"],
      },
      "application/x-tex": {
        source: "apache",
        extensions: ["tex"],
      },
      "application/x-tex-tfm": {
        source: "apache",
        extensions: ["tfm"],
      },
      "application/x-texinfo": {
        source: "apache",
        extensions: ["texinfo", "texi"],
      },
      "application/x-tgif": {
        source: "apache",
        extensions: ["obj"],
      },
      "application/x-ustar": {
        source: "apache",
        extensions: ["ustar"],
      },
      "application/x-virtualbox-hdd": {
        compressible: true,
        extensions: ["hdd"],
      },
      "application/x-virtualbox-ova": {
        compressible: true,
        extensions: ["ova"],
      },
      "application/x-virtualbox-ovf": {
        compressible: true,
        extensions: ["ovf"],
      },
      "application/x-virtualbox-vbox": {
        compressible: true,
        extensions: ["vbox"],
      },
      "application/x-virtualbox-vbox-extpack": {
        compressible: false,
        extensions: ["vbox-extpack"],
      },
      "application/x-virtualbox-vdi": {
        compressible: true,
        extensions: ["vdi"],
      },
      "application/x-virtualbox-vhd": {
        compressible: true,
        extensions: ["vhd"],
      },
      "application/x-virtualbox-vmdk": {
        compressible: true,
        extensions: ["vmdk"],
      },
      "application/x-wais-source": {
        source: "apache",
        extensions: ["src"],
      },
      "application/x-web-app-manifest+json": {
        compressible: true,
        extensions: ["webapp"],
      },
      "application/x-www-form-urlencoded": {
        source: "iana",
        compressible: true,
      },
      "application/x-x509-ca-cert": {
        source: "iana",
        extensions: ["der", "crt", "pem"],
      },
      "application/x-x509-ca-ra-cert": {
        source: "iana",
      },
      "application/x-x509-next-ca-cert": {
        source: "iana",
      },
      "application/x-xfig": {
        source: "apache",
        extensions: ["fig"],
      },
      "application/x-xliff+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xlf"],
      },
      "application/x-xpinstall": {
        source: "apache",
        compressible: false,
        extensions: ["xpi"],
      },
      "application/x-xz": {
        source: "apache",
        extensions: ["xz"],
      },
      "application/x-zmachine": {
        source: "apache",
        extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"],
      },
      "application/x400-bp": {
        source: "iana",
      },
      "application/xacml+xml": {
        source: "iana",
        compressible: true,
      },
      "application/xaml+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xaml"],
      },
      "application/xcap-att+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xav"],
      },
      "application/xcap-caps+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xca"],
      },
      "application/xcap-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdf"],
      },
      "application/xcap-el+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xel"],
      },
      "application/xcap-error+xml": {
        source: "iana",
        compressible: true,
      },
      "application/xcap-ns+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xns"],
      },
      "application/xcon-conference-info+xml": {
        source: "iana",
        compressible: true,
      },
      "application/xcon-conference-info-diff+xml": {
        source: "iana",
        compressible: true,
      },
      "application/xenc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xenc"],
      },
      "application/xhtml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xhtml", "xht"],
      },
      "application/xhtml-voice+xml": {
        source: "apache",
        compressible: true,
      },
      "application/xliff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xlf"],
      },
      "application/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml", "xsl", "xsd", "rng"],
      },
      "application/xml-dtd": {
        source: "iana",
        compressible: true,
        extensions: ["dtd"],
      },
      "application/xml-external-parsed-entity": {
        source: "iana",
      },
      "application/xml-patch+xml": {
        source: "iana",
        compressible: true,
      },
      "application/xmpp+xml": {
        source: "iana",
        compressible: true,
      },
      "application/xop+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xop"],
      },
      "application/xproc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xpl"],
      },
      "application/xslt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xsl", "xslt"],
      },
      "application/xspf+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xspf"],
      },
      "application/xv+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mxml", "xhvml", "xvml", "xvm"],
      },
      "application/yang": {
        source: "iana",
        extensions: ["yang"],
      },
      "application/yang-data+json": {
        source: "iana",
        compressible: true,
      },
      "application/yang-data+xml": {
        source: "iana",
        compressible: true,
      },
      "application/yang-patch+json": {
        source: "iana",
        compressible: true,
      },
      "application/yang-patch+xml": {
        source: "iana",
        compressible: true,
      },
      "application/yin+xml": {
        source: "iana",
        compressible: true,
        extensions: ["yin"],
      },
      "application/zip": {
        source: "iana",
        compressible: false,
        extensions: ["zip"],
      },
      "application/zlib": {
        source: "iana",
      },
      "application/zstd": {
        source: "iana",
      },
      "audio/1d-interleaved-parityfec": {
        source: "iana",
      },
      "audio/32kadpcm": {
        source: "iana",
      },
      "audio/3gpp": {
        source: "iana",
        compressible: false,
        extensions: ["3gpp"],
      },
      "audio/3gpp2": {
        source: "iana",
      },
      "audio/aac": {
        source: "iana",
      },
      "audio/ac3": {
        source: "iana",
      },
      "audio/adpcm": {
        source: "apache",
        extensions: ["adp"],
      },
      "audio/amr": {
        source: "iana",
        extensions: ["amr"],
      },
      "audio/amr-wb": {
        source: "iana",
      },
      "audio/amr-wb+": {
        source: "iana",
      },
      "audio/aptx": {
        source: "iana",
      },
      "audio/asc": {
        source: "iana",
      },
      "audio/atrac-advanced-lossless": {
        source: "iana",
      },
      "audio/atrac-x": {
        source: "iana",
      },
      "audio/atrac3": {
        source: "iana",
      },
      "audio/basic": {
        source: "iana",
        compressible: false,
        extensions: ["au", "snd"],
      },
      "audio/bv16": {
        source: "iana",
      },
      "audio/bv32": {
        source: "iana",
      },
      "audio/clearmode": {
        source: "iana",
      },
      "audio/cn": {
        source: "iana",
      },
      "audio/dat12": {
        source: "iana",
      },
      "audio/dls": {
        source: "iana",
      },
      "audio/dsr-es201108": {
        source: "iana",
      },
      "audio/dsr-es202050": {
        source: "iana",
      },
      "audio/dsr-es202211": {
        source: "iana",
      },
      "audio/dsr-es202212": {
        source: "iana",
      },
      "audio/dv": {
        source: "iana",
      },
      "audio/dvi4": {
        source: "iana",
      },
      "audio/eac3": {
        source: "iana",
      },
      "audio/encaprtp": {
        source: "iana",
      },
      "audio/evrc": {
        source: "iana",
      },
      "audio/evrc-qcp": {
        source: "iana",
      },
      "audio/evrc0": {
        source: "iana",
      },
      "audio/evrc1": {
        source: "iana",
      },
      "audio/evrcb": {
        source: "iana",
      },
      "audio/evrcb0": {
        source: "iana",
      },
      "audio/evrcb1": {
        source: "iana",
      },
      "audio/evrcnw": {
        source: "iana",
      },
      "audio/evrcnw0": {
        source: "iana",
      },
      "audio/evrcnw1": {
        source: "iana",
      },
      "audio/evrcwb": {
        source: "iana",
      },
      "audio/evrcwb0": {
        source: "iana",
      },
      "audio/evrcwb1": {
        source: "iana",
      },
      "audio/evs": {
        source: "iana",
      },
      "audio/flexfec": {
        source: "iana",
      },
      "audio/fwdred": {
        source: "iana",
      },
      "audio/g711-0": {
        source: "iana",
      },
      "audio/g719": {
        source: "iana",
      },
      "audio/g722": {
        source: "iana",
      },
      "audio/g7221": {
        source: "iana",
      },
      "audio/g723": {
        source: "iana",
      },
      "audio/g726-16": {
        source: "iana",
      },
      "audio/g726-24": {
        source: "iana",
      },
      "audio/g726-32": {
        source: "iana",
      },
      "audio/g726-40": {
        source: "iana",
      },
      "audio/g728": {
        source: "iana",
      },
      "audio/g729": {
        source: "iana",
      },
      "audio/g7291": {
        source: "iana",
      },
      "audio/g729d": {
        source: "iana",
      },
      "audio/g729e": {
        source: "iana",
      },
      "audio/gsm": {
        source: "iana",
      },
      "audio/gsm-efr": {
        source: "iana",
      },
      "audio/gsm-hr-08": {
        source: "iana",
      },
      "audio/ilbc": {
        source: "iana",
      },
      "audio/ip-mr_v2.5": {
        source: "iana",
      },
      "audio/isac": {
        source: "apache",
      },
      "audio/l16": {
        source: "iana",
      },
      "audio/l20": {
        source: "iana",
      },
      "audio/l24": {
        source: "iana",
        compressible: false,
      },
      "audio/l8": {
        source: "iana",
      },
      "audio/lpc": {
        source: "iana",
      },
      "audio/melp": {
        source: "iana",
      },
      "audio/melp1200": {
        source: "iana",
      },
      "audio/melp2400": {
        source: "iana",
      },
      "audio/melp600": {
        source: "iana",
      },
      "audio/mhas": {
        source: "iana",
      },
      "audio/midi": {
        source: "apache",
        extensions: ["mid", "midi", "kar", "rmi"],
      },
      "audio/mobile-xmf": {
        source: "iana",
        extensions: ["mxmf"],
      },
      "audio/mp3": {
        compressible: false,
        extensions: ["mp3"],
      },
      "audio/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["m4a", "mp4a"],
      },
      "audio/mp4a-latm": {
        source: "iana",
      },
      "audio/mpa": {
        source: "iana",
      },
      "audio/mpa-robust": {
        source: "iana",
      },
      "audio/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"],
      },
      "audio/mpeg4-generic": {
        source: "iana",
      },
      "audio/musepack": {
        source: "apache",
      },
      "audio/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["oga", "ogg", "spx", "opus"],
      },
      "audio/opus": {
        source: "iana",
      },
      "audio/parityfec": {
        source: "iana",
      },
      "audio/pcma": {
        source: "iana",
      },
      "audio/pcma-wb": {
        source: "iana",
      },
      "audio/pcmu": {
        source: "iana",
      },
      "audio/pcmu-wb": {
        source: "iana",
      },
      "audio/prs.sid": {
        source: "iana",
      },
      "audio/qcelp": {
        source: "iana",
      },
      "audio/raptorfec": {
        source: "iana",
      },
      "audio/red": {
        source: "iana",
      },
      "audio/rtp-enc-aescm128": {
        source: "iana",
      },
      "audio/rtp-midi": {
        source: "iana",
      },
      "audio/rtploopback": {
        source: "iana",
      },
      "audio/rtx": {
        source: "iana",
      },
      "audio/s3m": {
        source: "apache",
        extensions: ["s3m"],
      },
      "audio/scip": {
        source: "iana",
      },
      "audio/silk": {
        source: "apache",
        extensions: ["sil"],
      },
      "audio/smv": {
        source: "iana",
      },
      "audio/smv-qcp": {
        source: "iana",
      },
      "audio/smv0": {
        source: "iana",
      },
      "audio/sofa": {
        source: "iana",
      },
      "audio/sp-midi": {
        source: "iana",
      },
      "audio/speex": {
        source: "iana",
      },
      "audio/t140c": {
        source: "iana",
      },
      "audio/t38": {
        source: "iana",
      },
      "audio/telephone-event": {
        source: "iana",
      },
      "audio/tetra_acelp": {
        source: "iana",
      },
      "audio/tetra_acelp_bb": {
        source: "iana",
      },
      "audio/tone": {
        source: "iana",
      },
      "audio/tsvcis": {
        source: "iana",
      },
      "audio/uemclip": {
        source: "iana",
      },
      "audio/ulpfec": {
        source: "iana",
      },
      "audio/usac": {
        source: "iana",
      },
      "audio/vdvi": {
        source: "iana",
      },
      "audio/vmr-wb": {
        source: "iana",
      },
      "audio/vnd.3gpp.iufp": {
        source: "iana",
      },
      "audio/vnd.4sb": {
        source: "iana",
      },
      "audio/vnd.audiokoz": {
        source: "iana",
      },
      "audio/vnd.celp": {
        source: "iana",
      },
      "audio/vnd.cisco.nse": {
        source: "iana",
      },
      "audio/vnd.cmles.radio-events": {
        source: "iana",
      },
      "audio/vnd.cns.anp1": {
        source: "iana",
      },
      "audio/vnd.cns.inf1": {
        source: "iana",
      },
      "audio/vnd.dece.audio": {
        source: "iana",
        extensions: ["uva", "uvva"],
      },
      "audio/vnd.digital-winds": {
        source: "iana",
        extensions: ["eol"],
      },
      "audio/vnd.dlna.adts": {
        source: "iana",
      },
      "audio/vnd.dolby.heaac.1": {
        source: "iana",
      },
      "audio/vnd.dolby.heaac.2": {
        source: "iana",
      },
      "audio/vnd.dolby.mlp": {
        source: "iana",
      },
      "audio/vnd.dolby.mps": {
        source: "iana",
      },
      "audio/vnd.dolby.pl2": {
        source: "iana",
      },
      "audio/vnd.dolby.pl2x": {
        source: "iana",
      },
      "audio/vnd.dolby.pl2z": {
        source: "iana",
      },
      "audio/vnd.dolby.pulse.1": {
        source: "iana",
      },
      "audio/vnd.dra": {
        source: "iana",
        extensions: ["dra"],
      },
      "audio/vnd.dts": {
        source: "iana",
        extensions: ["dts"],
      },
      "audio/vnd.dts.hd": {
        source: "iana",
        extensions: ["dtshd"],
      },
      "audio/vnd.dts.uhd": {
        source: "iana",
      },
      "audio/vnd.dvb.file": {
        source: "iana",
      },
      "audio/vnd.everad.plj": {
        source: "iana",
      },
      "audio/vnd.hns.audio": {
        source: "iana",
      },
      "audio/vnd.lucent.voice": {
        source: "iana",
        extensions: ["lvp"],
      },
      "audio/vnd.ms-playready.media.pya": {
        source: "iana",
        extensions: ["pya"],
      },
      "audio/vnd.nokia.mobile-xmf": {
        source: "iana",
      },
      "audio/vnd.nortel.vbk": {
        source: "iana",
      },
      "audio/vnd.nuera.ecelp4800": {
        source: "iana",
        extensions: ["ecelp4800"],
      },
      "audio/vnd.nuera.ecelp7470": {
        source: "iana",
        extensions: ["ecelp7470"],
      },
      "audio/vnd.nuera.ecelp9600": {
        source: "iana",
        extensions: ["ecelp9600"],
      },
      "audio/vnd.octel.sbc": {
        source: "iana",
      },
      "audio/vnd.presonus.multitrack": {
        source: "iana",
      },
      "audio/vnd.qcelp": {
        source: "iana",
      },
      "audio/vnd.rhetorex.32kadpcm": {
        source: "iana",
      },
      "audio/vnd.rip": {
        source: "iana",
        extensions: ["rip"],
      },
      "audio/vnd.rn-realaudio": {
        compressible: false,
      },
      "audio/vnd.sealedmedia.softseal.mpeg": {
        source: "iana",
      },
      "audio/vnd.vmx.cvsd": {
        source: "iana",
      },
      "audio/vnd.wave": {
        compressible: false,
      },
      "audio/vorbis": {
        source: "iana",
        compressible: false,
      },
      "audio/vorbis-config": {
        source: "iana",
      },
      "audio/wav": {
        compressible: false,
        extensions: ["wav"],
      },
      "audio/wave": {
        compressible: false,
        extensions: ["wav"],
      },
      "audio/webm": {
        source: "apache",
        compressible: false,
        extensions: ["weba"],
      },
      "audio/x-aac": {
        source: "apache",
        compressible: false,
        extensions: ["aac"],
      },
      "audio/x-aiff": {
        source: "apache",
        extensions: ["aif", "aiff", "aifc"],
      },
      "audio/x-caf": {
        source: "apache",
        compressible: false,
        extensions: ["caf"],
      },
      "audio/x-flac": {
        source: "apache",
        extensions: ["flac"],
      },
      "audio/x-m4a": {
        source: "nginx",
        extensions: ["m4a"],
      },
      "audio/x-matroska": {
        source: "apache",
        extensions: ["mka"],
      },
      "audio/x-mpegurl": {
        source: "apache",
        extensions: ["m3u"],
      },
      "audio/x-ms-wax": {
        source: "apache",
        extensions: ["wax"],
      },
      "audio/x-ms-wma": {
        source: "apache",
        extensions: ["wma"],
      },
      "audio/x-pn-realaudio": {
        source: "apache",
        extensions: ["ram", "ra"],
      },
      "audio/x-pn-realaudio-plugin": {
        source: "apache",
        extensions: ["rmp"],
      },
      "audio/x-realaudio": {
        source: "nginx",
        extensions: ["ra"],
      },
      "audio/x-tta": {
        source: "apache",
      },
      "audio/x-wav": {
        source: "apache",
        extensions: ["wav"],
      },
      "audio/xm": {
        source: "apache",
        extensions: ["xm"],
      },
      "chemical/x-cdx": {
        source: "apache",
        extensions: ["cdx"],
      },
      "chemical/x-cif": {
        source: "apache",
        extensions: ["cif"],
      },
      "chemical/x-cmdf": {
        source: "apache",
        extensions: ["cmdf"],
      },
      "chemical/x-cml": {
        source: "apache",
        extensions: ["cml"],
      },
      "chemical/x-csml": {
        source: "apache",
        extensions: ["csml"],
      },
      "chemical/x-pdb": {
        source: "apache",
      },
      "chemical/x-xyz": {
        source: "apache",
        extensions: ["xyz"],
      },
      "font/collection": {
        source: "iana",
        extensions: ["ttc"],
      },
      "font/otf": {
        source: "iana",
        compressible: true,
        extensions: ["otf"],
      },
      "font/sfnt": {
        source: "iana",
      },
      "font/ttf": {
        source: "iana",
        compressible: true,
        extensions: ["ttf"],
      },
      "font/woff": {
        source: "iana",
        extensions: ["woff"],
      },
      "font/woff2": {
        source: "iana",
        extensions: ["woff2"],
      },
      "image/aces": {
        source: "iana",
        extensions: ["exr"],
      },
      "image/apng": {
        compressible: false,
        extensions: ["apng"],
      },
      "image/avci": {
        source: "iana",
        extensions: ["avci"],
      },
      "image/avcs": {
        source: "iana",
        extensions: ["avcs"],
      },
      "image/avif": {
        source: "iana",
        compressible: false,
        extensions: ["avif"],
      },
      "image/bmp": {
        source: "iana",
        compressible: true,
        extensions: ["bmp"],
      },
      "image/cgm": {
        source: "iana",
        extensions: ["cgm"],
      },
      "image/dicom-rle": {
        source: "iana",
        extensions: ["drle"],
      },
      "image/emf": {
        source: "iana",
        extensions: ["emf"],
      },
      "image/fits": {
        source: "iana",
        extensions: ["fits"],
      },
      "image/g3fax": {
        source: "iana",
        extensions: ["g3"],
      },
      "image/gif": {
        source: "iana",
        compressible: false,
        extensions: ["gif"],
      },
      "image/heic": {
        source: "iana",
        extensions: ["heic"],
      },
      "image/heic-sequence": {
        source: "iana",
        extensions: ["heics"],
      },
      "image/heif": {
        source: "iana",
        extensions: ["heif"],
      },
      "image/heif-sequence": {
        source: "iana",
        extensions: ["heifs"],
      },
      "image/hej2k": {
        source: "iana",
        extensions: ["hej2"],
      },
      "image/hsj2": {
        source: "iana",
        extensions: ["hsj2"],
      },
      "image/ief": {
        source: "iana",
        extensions: ["ief"],
      },
      "image/jls": {
        source: "iana",
        extensions: ["jls"],
      },
      "image/jp2": {
        source: "iana",
        compressible: false,
        extensions: ["jp2", "jpg2"],
      },
      "image/jpeg": {
        source: "iana",
        compressible: false,
        extensions: ["jpeg", "jpg", "jpe"],
      },
      "image/jph": {
        source: "iana",
        extensions: ["jph"],
      },
      "image/jphc": {
        source: "iana",
        extensions: ["jhc"],
      },
      "image/jpm": {
        source: "iana",
        compressible: false,
        extensions: ["jpm"],
      },
      "image/jpx": {
        source: "iana",
        compressible: false,
        extensions: ["jpx", "jpf"],
      },
      "image/jxr": {
        source: "iana",
        extensions: ["jxr"],
      },
      "image/jxra": {
        source: "iana",
        extensions: ["jxra"],
      },
      "image/jxrs": {
        source: "iana",
        extensions: ["jxrs"],
      },
      "image/jxs": {
        source: "iana",
        extensions: ["jxs"],
      },
      "image/jxsc": {
        source: "iana",
        extensions: ["jxsc"],
      },
      "image/jxsi": {
        source: "iana",
        extensions: ["jxsi"],
      },
      "image/jxss": {
        source: "iana",
        extensions: ["jxss"],
      },
      "image/ktx": {
        source: "iana",
        extensions: ["ktx"],
      },
      "image/ktx2": {
        source: "iana",
        extensions: ["ktx2"],
      },
      "image/naplps": {
        source: "iana",
      },
      "image/pjpeg": {
        compressible: false,
      },
      "image/png": {
        source: "iana",
        compressible: false,
        extensions: ["png"],
      },
      "image/prs.btif": {
        source: "iana",
        extensions: ["btif"],
      },
      "image/prs.pti": {
        source: "iana",
        extensions: ["pti"],
      },
      "image/pwg-raster": {
        source: "iana",
      },
      "image/sgi": {
        source: "apache",
        extensions: ["sgi"],
      },
      "image/svg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["svg", "svgz"],
      },
      "image/t38": {
        source: "iana",
        extensions: ["t38"],
      },
      "image/tiff": {
        source: "iana",
        compressible: false,
        extensions: ["tif", "tiff"],
      },
      "image/tiff-fx": {
        source: "iana",
        extensions: ["tfx"],
      },
      "image/vnd.adobe.photoshop": {
        source: "iana",
        compressible: true,
        extensions: ["psd"],
      },
      "image/vnd.airzip.accelerator.azv": {
        source: "iana",
        extensions: ["azv"],
      },
      "image/vnd.cns.inf2": {
        source: "iana",
      },
      "image/vnd.dece.graphic": {
        source: "iana",
        extensions: ["uvi", "uvvi", "uvg", "uvvg"],
      },
      "image/vnd.djvu": {
        source: "iana",
        extensions: ["djvu", "djv"],
      },
      "image/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"],
      },
      "image/vnd.dwg": {
        source: "iana",
        extensions: ["dwg"],
      },
      "image/vnd.dxf": {
        source: "iana",
        extensions: ["dxf"],
      },
      "image/vnd.fastbidsheet": {
        source: "iana",
        extensions: ["fbs"],
      },
      "image/vnd.fpx": {
        source: "iana",
        extensions: ["fpx"],
      },
      "image/vnd.fst": {
        source: "iana",
        extensions: ["fst"],
      },
      "image/vnd.fujixerox.edmics-mmr": {
        source: "iana",
        extensions: ["mmr"],
      },
      "image/vnd.fujixerox.edmics-rlc": {
        source: "iana",
        extensions: ["rlc"],
      },
      "image/vnd.globalgraphics.pgb": {
        source: "iana",
      },
      "image/vnd.microsoft.icon": {
        source: "iana",
        compressible: true,
        extensions: ["ico"],
      },
      "image/vnd.mix": {
        source: "iana",
      },
      "image/vnd.mozilla.apng": {
        source: "iana",
      },
      "image/vnd.ms-dds": {
        compressible: true,
        extensions: ["dds"],
      },
      "image/vnd.ms-modi": {
        source: "iana",
        extensions: ["mdi"],
      },
      "image/vnd.ms-photo": {
        source: "apache",
        extensions: ["wdp"],
      },
      "image/vnd.net-fpx": {
        source: "iana",
        extensions: ["npx"],
      },
      "image/vnd.pco.b16": {
        source: "iana",
        extensions: ["b16"],
      },
      "image/vnd.radiance": {
        source: "iana",
      },
      "image/vnd.sealed.png": {
        source: "iana",
      },
      "image/vnd.sealedmedia.softseal.gif": {
        source: "iana",
      },
      "image/vnd.sealedmedia.softseal.jpg": {
        source: "iana",
      },
      "image/vnd.svf": {
        source: "iana",
      },
      "image/vnd.tencent.tap": {
        source: "iana",
        extensions: ["tap"],
      },
      "image/vnd.valve.source.texture": {
        source: "iana",
        extensions: ["vtf"],
      },
      "image/vnd.wap.wbmp": {
        source: "iana",
        extensions: ["wbmp"],
      },
      "image/vnd.xiff": {
        source: "iana",
        extensions: ["xif"],
      },
      "image/vnd.zbrush.pcx": {
        source: "iana",
        extensions: ["pcx"],
      },
      "image/webp": {
        source: "apache",
        extensions: ["webp"],
      },
      "image/wmf": {
        source: "iana",
        extensions: ["wmf"],
      },
      "image/x-3ds": {
        source: "apache",
        extensions: ["3ds"],
      },
      "image/x-cmu-raster": {
        source: "apache",
        extensions: ["ras"],
      },
      "image/x-cmx": {
        source: "apache",
        extensions: ["cmx"],
      },
      "image/x-freehand": {
        source: "apache",
        extensions: ["fh", "fhc", "fh4", "fh5", "fh7"],
      },
      "image/x-icon": {
        source: "apache",
        compressible: true,
        extensions: ["ico"],
      },
      "image/x-jng": {
        source: "nginx",
        extensions: ["jng"],
      },
      "image/x-mrsid-image": {
        source: "apache",
        extensions: ["sid"],
      },
      "image/x-ms-bmp": {
        source: "nginx",
        compressible: true,
        extensions: ["bmp"],
      },
      "image/x-pcx": {
        source: "apache",
        extensions: ["pcx"],
      },
      "image/x-pict": {
        source: "apache",
        extensions: ["pic", "pct"],
      },
      "image/x-portable-anymap": {
        source: "apache",
        extensions: ["pnm"],
      },
      "image/x-portable-bitmap": {
        source: "apache",
        extensions: ["pbm"],
      },
      "image/x-portable-graymap": {
        source: "apache",
        extensions: ["pgm"],
      },
      "image/x-portable-pixmap": {
        source: "apache",
        extensions: ["ppm"],
      },
      "image/x-rgb": {
        source: "apache",
        extensions: ["rgb"],
      },
      "image/x-tga": {
        source: "apache",
        extensions: ["tga"],
      },
      "image/x-xbitmap": {
        source: "apache",
        extensions: ["xbm"],
      },
      "image/x-xcf": {
        compressible: false,
      },
      "image/x-xpixmap": {
        source: "apache",
        extensions: ["xpm"],
      },
      "image/x-xwindowdump": {
        source: "apache",
        extensions: ["xwd"],
      },
      "message/cpim": {
        source: "iana",
      },
      "message/delivery-status": {
        source: "iana",
      },
      "message/disposition-notification": {
        source: "iana",
        extensions: ["disposition-notification"],
      },
      "message/external-body": {
        source: "iana",
      },
      "message/feedback-report": {
        source: "iana",
      },
      "message/global": {
        source: "iana",
        extensions: ["u8msg"],
      },
      "message/global-delivery-status": {
        source: "iana",
        extensions: ["u8dsn"],
      },
      "message/global-disposition-notification": {
        source: "iana",
        extensions: ["u8mdn"],
      },
      "message/global-headers": {
        source: "iana",
        extensions: ["u8hdr"],
      },
      "message/http": {
        source: "iana",
        compressible: false,
      },
      "message/imdn+xml": {
        source: "iana",
        compressible: true,
      },
      "message/news": {
        source: "iana",
      },
      "message/partial": {
        source: "iana",
        compressible: false,
      },
      "message/rfc822": {
        source: "iana",
        compressible: true,
        extensions: ["eml", "mime"],
      },
      "message/s-http": {
        source: "iana",
      },
      "message/sip": {
        source: "iana",
      },
      "message/sipfrag": {
        source: "iana",
      },
      "message/tracking-status": {
        source: "iana",
      },
      "message/vnd.si.simp": {
        source: "iana",
      },
      "message/vnd.wfa.wsc": {
        source: "iana",
        extensions: ["wsc"],
      },
      "model/3mf": {
        source: "iana",
        extensions: ["3mf"],
      },
      "model/e57": {
        source: "iana",
      },
      "model/gltf+json": {
        source: "iana",
        compressible: true,
        extensions: ["gltf"],
      },
      "model/gltf-binary": {
        source: "iana",
        compressible: true,
        extensions: ["glb"],
      },
      "model/iges": {
        source: "iana",
        compressible: false,
        extensions: ["igs", "iges"],
      },
      "model/mesh": {
        source: "iana",
        compressible: false,
        extensions: ["msh", "mesh", "silo"],
      },
      "model/mtl": {
        source: "iana",
        extensions: ["mtl"],
      },
      "model/obj": {
        source: "iana",
        extensions: ["obj"],
      },
      "model/step": {
        source: "iana",
      },
      "model/step+xml": {
        source: "iana",
        compressible: true,
        extensions: ["stpx"],
      },
      "model/step+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpz"],
      },
      "model/step-xml+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpxz"],
      },
      "model/stl": {
        source: "iana",
        extensions: ["stl"],
      },
      "model/vnd.collada+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dae"],
      },
      "model/vnd.dwf": {
        source: "iana",
        extensions: ["dwf"],
      },
      "model/vnd.flatland.3dml": {
        source: "iana",
      },
      "model/vnd.gdl": {
        source: "iana",
        extensions: ["gdl"],
      },
      "model/vnd.gs-gdl": {
        source: "apache",
      },
      "model/vnd.gs.gdl": {
        source: "iana",
      },
      "model/vnd.gtw": {
        source: "iana",
        extensions: ["gtw"],
      },
      "model/vnd.moml+xml": {
        source: "iana",
        compressible: true,
      },
      "model/vnd.mts": {
        source: "iana",
        extensions: ["mts"],
      },
      "model/vnd.opengex": {
        source: "iana",
        extensions: ["ogex"],
      },
      "model/vnd.parasolid.transmit.binary": {
        source: "iana",
        extensions: ["x_b"],
      },
      "model/vnd.parasolid.transmit.text": {
        source: "iana",
        extensions: ["x_t"],
      },
      "model/vnd.pytha.pyox": {
        source: "iana",
      },
      "model/vnd.rosette.annotated-data-model": {
        source: "iana",
      },
      "model/vnd.sap.vds": {
        source: "iana",
        extensions: ["vds"],
      },
      "model/vnd.usdz+zip": {
        source: "iana",
        compressible: false,
        extensions: ["usdz"],
      },
      "model/vnd.valve.source.compiled-map": {
        source: "iana",
        extensions: ["bsp"],
      },
      "model/vnd.vtu": {
        source: "iana",
        extensions: ["vtu"],
      },
      "model/vrml": {
        source: "iana",
        compressible: false,
        extensions: ["wrl", "vrml"],
      },
      "model/x3d+binary": {
        source: "apache",
        compressible: false,
        extensions: ["x3db", "x3dbz"],
      },
      "model/x3d+fastinfoset": {
        source: "iana",
        extensions: ["x3db"],
      },
      "model/x3d+vrml": {
        source: "apache",
        compressible: false,
        extensions: ["x3dv", "x3dvz"],
      },
      "model/x3d+xml": {
        source: "iana",
        compressible: true,
        extensions: ["x3d", "x3dz"],
      },
      "model/x3d-vrml": {
        source: "iana",
        extensions: ["x3dv"],
      },
      "multipart/alternative": {
        source: "iana",
        compressible: false,
      },
      "multipart/appledouble": {
        source: "iana",
      },
      "multipart/byteranges": {
        source: "iana",
      },
      "multipart/digest": {
        source: "iana",
      },
      "multipart/encrypted": {
        source: "iana",
        compressible: false,
      },
      "multipart/form-data": {
        source: "iana",
        compressible: false,
      },
      "multipart/header-set": {
        source: "iana",
      },
      "multipart/mixed": {
        source: "iana",
      },
      "multipart/multilingual": {
        source: "iana",
      },
      "multipart/parallel": {
        source: "iana",
      },
      "multipart/related": {
        source: "iana",
        compressible: false,
      },
      "multipart/report": {
        source: "iana",
      },
      "multipart/signed": {
        source: "iana",
        compressible: false,
      },
      "multipart/vnd.bint.med-plus": {
        source: "iana",
      },
      "multipart/voice-message": {
        source: "iana",
      },
      "multipart/x-mixed-replace": {
        source: "iana",
      },
      "text/1d-interleaved-parityfec": {
        source: "iana",
      },
      "text/cache-manifest": {
        source: "iana",
        compressible: true,
        extensions: ["appcache", "manifest"],
      },
      "text/calendar": {
        source: "iana",
        extensions: ["ics", "ifb"],
      },
      "text/calender": {
        compressible: true,
      },
      "text/cmd": {
        compressible: true,
      },
      "text/coffeescript": {
        extensions: ["coffee", "litcoffee"],
      },
      "text/cql": {
        source: "iana",
      },
      "text/cql-expression": {
        source: "iana",
      },
      "text/cql-identifier": {
        source: "iana",
      },
      "text/css": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["css"],
      },
      "text/csv": {
        source: "iana",
        compressible: true,
        extensions: ["csv"],
      },
      "text/csv-schema": {
        source: "iana",
      },
      "text/directory": {
        source: "iana",
      },
      "text/dns": {
        source: "iana",
      },
      "text/ecmascript": {
        source: "iana",
      },
      "text/encaprtp": {
        source: "iana",
      },
      "text/enriched": {
        source: "iana",
      },
      "text/fhirpath": {
        source: "iana",
      },
      "text/flexfec": {
        source: "iana",
      },
      "text/fwdred": {
        source: "iana",
      },
      "text/gff3": {
        source: "iana",
      },
      "text/grammar-ref-list": {
        source: "iana",
      },
      "text/html": {
        source: "iana",
        compressible: true,
        extensions: ["html", "htm", "shtml"],
      },
      "text/jade": {
        extensions: ["jade"],
      },
      "text/javascript": {
        source: "iana",
        compressible: true,
      },
      "text/jcr-cnd": {
        source: "iana",
      },
      "text/jsx": {
        compressible: true,
        extensions: ["jsx"],
      },
      "text/less": {
        compressible: true,
        extensions: ["less"],
      },
      "text/markdown": {
        source: "iana",
        compressible: true,
        extensions: ["markdown", "md"],
      },
      "text/mathml": {
        source: "nginx",
        extensions: ["mml"],
      },
      "text/mdx": {
        compressible: true,
        extensions: ["mdx"],
      },
      "text/mizar": {
        source: "iana",
      },
      "text/n3": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["n3"],
      },
      "text/parameters": {
        source: "iana",
        charset: "UTF-8",
      },
      "text/parityfec": {
        source: "iana",
      },
      "text/plain": {
        source: "iana",
        compressible: true,
        extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"],
      },
      "text/provenance-notation": {
        source: "iana",
        charset: "UTF-8",
      },
      "text/prs.fallenstein.rst": {
        source: "iana",
      },
      "text/prs.lines.tag": {
        source: "iana",
        extensions: ["dsc"],
      },
      "text/prs.prop.logic": {
        source: "iana",
      },
      "text/raptorfec": {
        source: "iana",
      },
      "text/red": {
        source: "iana",
      },
      "text/rfc822-headers": {
        source: "iana",
      },
      "text/richtext": {
        source: "iana",
        compressible: true,
        extensions: ["rtx"],
      },
      "text/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"],
      },
      "text/rtp-enc-aescm128": {
        source: "iana",
      },
      "text/rtploopback": {
        source: "iana",
      },
      "text/rtx": {
        source: "iana",
      },
      "text/sgml": {
        source: "iana",
        extensions: ["sgml", "sgm"],
      },
      "text/shaclc": {
        source: "iana",
      },
      "text/shex": {
        source: "iana",
        extensions: ["shex"],
      },
      "text/slim": {
        extensions: ["slim", "slm"],
      },
      "text/spdx": {
        source: "iana",
        extensions: ["spdx"],
      },
      "text/strings": {
        source: "iana",
      },
      "text/stylus": {
        extensions: ["stylus", "styl"],
      },
      "text/t140": {
        source: "iana",
      },
      "text/tab-separated-values": {
        source: "iana",
        compressible: true,
        extensions: ["tsv"],
      },
      "text/troff": {
        source: "iana",
        extensions: ["t", "tr", "roff", "man", "me", "ms"],
      },
      "text/turtle": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["ttl"],
      },
      "text/ulpfec": {
        source: "iana",
      },
      "text/uri-list": {
        source: "iana",
        compressible: true,
        extensions: ["uri", "uris", "urls"],
      },
      "text/vcard": {
        source: "iana",
        compressible: true,
        extensions: ["vcard"],
      },
      "text/vnd.a": {
        source: "iana",
      },
      "text/vnd.abc": {
        source: "iana",
      },
      "text/vnd.ascii-art": {
        source: "iana",
      },
      "text/vnd.curl": {
        source: "iana",
        extensions: ["curl"],
      },
      "text/vnd.curl.dcurl": {
        source: "apache",
        extensions: ["dcurl"],
      },
      "text/vnd.curl.mcurl": {
        source: "apache",
        extensions: ["mcurl"],
      },
      "text/vnd.curl.scurl": {
        source: "apache",
        extensions: ["scurl"],
      },
      "text/vnd.debian.copyright": {
        source: "iana",
        charset: "UTF-8",
      },
      "text/vnd.dmclientscript": {
        source: "iana",
      },
      "text/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"],
      },
      "text/vnd.esmertec.theme-descriptor": {
        source: "iana",
        charset: "UTF-8",
      },
      "text/vnd.familysearch.gedcom": {
        source: "iana",
        extensions: ["ged"],
      },
      "text/vnd.ficlab.flt": {
        source: "iana",
      },
      "text/vnd.fly": {
        source: "iana",
        extensions: ["fly"],
      },
      "text/vnd.fmi.flexstor": {
        source: "iana",
        extensions: ["flx"],
      },
      "text/vnd.gml": {
        source: "iana",
      },
      "text/vnd.graphviz": {
        source: "iana",
        extensions: ["gv"],
      },
      "text/vnd.hans": {
        source: "iana",
      },
      "text/vnd.hgl": {
        source: "iana",
      },
      "text/vnd.in3d.3dml": {
        source: "iana",
        extensions: ["3dml"],
      },
      "text/vnd.in3d.spot": {
        source: "iana",
        extensions: ["spot"],
      },
      "text/vnd.iptc.newsml": {
        source: "iana",
      },
      "text/vnd.iptc.nitf": {
        source: "iana",
      },
      "text/vnd.latex-z": {
        source: "iana",
      },
      "text/vnd.motorola.reflex": {
        source: "iana",
      },
      "text/vnd.ms-mediapackage": {
        source: "iana",
      },
      "text/vnd.net2phone.commcenter.command": {
        source: "iana",
      },
      "text/vnd.radisys.msml-basic-layout": {
        source: "iana",
      },
      "text/vnd.senx.warpscript": {
        source: "iana",
      },
      "text/vnd.si.uricatalogue": {
        source: "iana",
      },
      "text/vnd.sosi": {
        source: "iana",
      },
      "text/vnd.sun.j2me.app-descriptor": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["jad"],
      },
      "text/vnd.trolltech.linguist": {
        source: "iana",
        charset: "UTF-8",
      },
      "text/vnd.wap.si": {
        source: "iana",
      },
      "text/vnd.wap.sl": {
        source: "iana",
      },
      "text/vnd.wap.wml": {
        source: "iana",
        extensions: ["wml"],
      },
      "text/vnd.wap.wmlscript": {
        source: "iana",
        extensions: ["wmls"],
      },
      "text/vtt": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["vtt"],
      },
      "text/x-asm": {
        source: "apache",
        extensions: ["s", "asm"],
      },
      "text/x-c": {
        source: "apache",
        extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"],
      },
      "text/x-component": {
        source: "nginx",
        extensions: ["htc"],
      },
      "text/x-fortran": {
        source: "apache",
        extensions: ["f", "for", "f77", "f90"],
      },
      "text/x-gwt-rpc": {
        compressible: true,
      },
      "text/x-handlebars-template": {
        extensions: ["hbs"],
      },
      "text/x-java-source": {
        source: "apache",
        extensions: ["java"],
      },
      "text/x-jquery-tmpl": {
        compressible: true,
      },
      "text/x-lua": {
        extensions: ["lua"],
      },
      "text/x-markdown": {
        compressible: true,
        extensions: ["mkd"],
      },
      "text/x-nfo": {
        source: "apache",
        extensions: ["nfo"],
      },
      "text/x-opml": {
        source: "apache",
        extensions: ["opml"],
      },
      "text/x-org": {
        compressible: true,
        extensions: ["org"],
      },
      "text/x-pascal": {
        source: "apache",
        extensions: ["p", "pas"],
      },
      "text/x-processing": {
        compressible: true,
        extensions: ["pde"],
      },
      "text/x-sass": {
        extensions: ["sass"],
      },
      "text/x-scss": {
        extensions: ["scss"],
      },
      "text/x-setext": {
        source: "apache",
        extensions: ["etx"],
      },
      "text/x-sfv": {
        source: "apache",
        extensions: ["sfv"],
      },
      "text/x-suse-ymp": {
        compressible: true,
        extensions: ["ymp"],
      },
      "text/x-uuencode": {
        source: "apache",
        extensions: ["uu"],
      },
      "text/x-vcalendar": {
        source: "apache",
        extensions: ["vcs"],
      },
      "text/x-vcard": {
        source: "apache",
        extensions: ["vcf"],
      },
      "text/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml"],
      },
      "text/xml-external-parsed-entity": {
        source: "iana",
      },
      "text/yaml": {
        compressible: true,
        extensions: ["yaml", "yml"],
      },
      "video/1d-interleaved-parityfec": {
        source: "iana",
      },
      "video/3gpp": {
        source: "iana",
        extensions: ["3gp", "3gpp"],
      },
      "video/3gpp-tt": {
        source: "iana",
      },
      "video/3gpp2": {
        source: "iana",
        extensions: ["3g2"],
      },
      "video/av1": {
        source: "iana",
      },
      "video/bmpeg": {
        source: "iana",
      },
      "video/bt656": {
        source: "iana",
      },
      "video/celb": {
        source: "iana",
      },
      "video/dv": {
        source: "iana",
      },
      "video/encaprtp": {
        source: "iana",
      },
      "video/ffv1": {
        source: "iana",
      },
      "video/flexfec": {
        source: "iana",
      },
      "video/h261": {
        source: "iana",
        extensions: ["h261"],
      },
      "video/h263": {
        source: "iana",
        extensions: ["h263"],
      },
      "video/h263-1998": {
        source: "iana",
      },
      "video/h263-2000": {
        source: "iana",
      },
      "video/h264": {
        source: "iana",
        extensions: ["h264"],
      },
      "video/h264-rcdo": {
        source: "iana",
      },
      "video/h264-svc": {
        source: "iana",
      },
      "video/h265": {
        source: "iana",
      },
      "video/iso.segment": {
        source: "iana",
        extensions: ["m4s"],
      },
      "video/jpeg": {
        source: "iana",
        extensions: ["jpgv"],
      },
      "video/jpeg2000": {
        source: "iana",
      },
      "video/jpm": {
        source: "apache",
        extensions: ["jpm", "jpgm"],
      },
      "video/jxsv": {
        source: "iana",
      },
      "video/mj2": {
        source: "iana",
        extensions: ["mj2", "mjp2"],
      },
      "video/mp1s": {
        source: "iana",
      },
      "video/mp2p": {
        source: "iana",
      },
      "video/mp2t": {
        source: "iana",
        extensions: ["ts"],
      },
      "video/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["mp4", "mp4v", "mpg4"],
      },
      "video/mp4v-es": {
        source: "iana",
      },
      "video/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"],
      },
      "video/mpeg4-generic": {
        source: "iana",
      },
      "video/mpv": {
        source: "iana",
      },
      "video/nv": {
        source: "iana",
      },
      "video/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogv"],
      },
      "video/parityfec": {
        source: "iana",
      },
      "video/pointer": {
        source: "iana",
      },
      "video/quicktime": {
        source: "iana",
        compressible: false,
        extensions: ["qt", "mov"],
      },
      "video/raptorfec": {
        source: "iana",
      },
      "video/raw": {
        source: "iana",
      },
      "video/rtp-enc-aescm128": {
        source: "iana",
      },
      "video/rtploopback": {
        source: "iana",
      },
      "video/rtx": {
        source: "iana",
      },
      "video/scip": {
        source: "iana",
      },
      "video/smpte291": {
        source: "iana",
      },
      "video/smpte292m": {
        source: "iana",
      },
      "video/ulpfec": {
        source: "iana",
      },
      "video/vc1": {
        source: "iana",
      },
      "video/vc2": {
        source: "iana",
      },
      "video/vnd.cctv": {
        source: "iana",
      },
      "video/vnd.dece.hd": {
        source: "iana",
        extensions: ["uvh", "uvvh"],
      },
      "video/vnd.dece.mobile": {
        source: "iana",
        extensions: ["uvm", "uvvm"],
      },
      "video/vnd.dece.mp4": {
        source: "iana",
      },
      "video/vnd.dece.pd": {
        source: "iana",
        extensions: ["uvp", "uvvp"],
      },
      "video/vnd.dece.sd": {
        source: "iana",
        extensions: ["uvs", "uvvs"],
      },
      "video/vnd.dece.video": {
        source: "iana",
        extensions: ["uvv", "uvvv"],
      },
      "video/vnd.directv.mpeg": {
        source: "iana",
      },
      "video/vnd.directv.mpeg-tts": {
        source: "iana",
      },
      "video/vnd.dlna.mpeg-tts": {
        source: "iana",
      },
      "video/vnd.dvb.file": {
        source: "iana",
        extensions: ["dvb"],
      },
      "video/vnd.fvt": {
        source: "iana",
        extensions: ["fvt"],
      },
      "video/vnd.hns.video": {
        source: "iana",
      },
      "video/vnd.iptvforum.1dparityfec-1010": {
        source: "iana",
      },
      "video/vnd.iptvforum.1dparityfec-2005": {
        source: "iana",
      },
      "video/vnd.iptvforum.2dparityfec-1010": {
        source: "iana",
      },
      "video/vnd.iptvforum.2dparityfec-2005": {
        source: "iana",
      },
      "video/vnd.iptvforum.ttsavc": {
        source: "iana",
      },
      "video/vnd.iptvforum.ttsmpeg2": {
        source: "iana",
      },
      "video/vnd.motorola.video": {
        source: "iana",
      },
      "video/vnd.motorola.videop": {
        source: "iana",
      },
      "video/vnd.mpegurl": {
        source: "iana",
        extensions: ["mxu", "m4u"],
      },
      "video/vnd.ms-playready.media.pyv": {
        source: "iana",
        extensions: ["pyv"],
      },
      "video/vnd.nokia.interleaved-multimedia": {
        source: "iana",
      },
      "video/vnd.nokia.mp4vr": {
        source: "iana",
      },
      "video/vnd.nokia.videovoip": {
        source: "iana",
      },
      "video/vnd.objectvideo": {
        source: "iana",
      },
      "video/vnd.radgamettools.bink": {
        source: "iana",
      },
      "video/vnd.radgamettools.smacker": {
        source: "iana",
      },
      "video/vnd.sealed.mpeg1": {
        source: "iana",
      },
      "video/vnd.sealed.mpeg4": {
        source: "iana",
      },
      "video/vnd.sealed.swf": {
        source: "iana",
      },
      "video/vnd.sealedmedia.softseal.mov": {
        source: "iana",
      },
      "video/vnd.uvvu.mp4": {
        source: "iana",
        extensions: ["uvu", "uvvu"],
      },
      "video/vnd.vivo": {
        source: "iana",
        extensions: ["viv"],
      },
      "video/vnd.youtube.yt": {
        source: "iana",
      },
      "video/vp8": {
        source: "iana",
      },
      "video/vp9": {
        source: "iana",
      },
      "video/webm": {
        source: "apache",
        compressible: false,
        extensions: ["webm"],
      },
      "video/x-f4v": {
        source: "apache",
        extensions: ["f4v"],
      },
      "video/x-fli": {
        source: "apache",
        extensions: ["fli"],
      },
      "video/x-flv": {
        source: "apache",
        compressible: false,
        extensions: ["flv"],
      },
      "video/x-m4v": {
        source: "apache",
        extensions: ["m4v"],
      },
      "video/x-matroska": {
        source: "apache",
        compressible: false,
        extensions: ["mkv", "mk3d", "mks"],
      },
      "video/x-mng": {
        source: "apache",
        extensions: ["mng"],
      },
      "video/x-ms-asf": {
        source: "apache",
        extensions: ["asf", "asx"],
      },
      "video/x-ms-vob": {
        source: "apache",
        extensions: ["vob"],
      },
      "video/x-ms-wm": {
        source: "apache",
        extensions: ["wm"],
      },
      "video/x-ms-wmv": {
        source: "apache",
        compressible: false,
        extensions: ["wmv"],
      },
      "video/x-ms-wmx": {
        source: "apache",
        extensions: ["wmx"],
      },
      "video/x-ms-wvx": {
        source: "apache",
        extensions: ["wvx"],
      },
      "video/x-msvideo": {
        source: "apache",
        extensions: ["avi"],
      },
      "video/x-sgi-movie": {
        source: "apache",
        extensions: ["movie"],
      },
      "video/x-smv": {
        source: "apache",
        extensions: ["smv"],
      },
      "x-conference/x-cooltalk": {
        source: "apache",
        extensions: ["ice"],
      },
      "x-shader/x-fragment": {
        compressible: true,
      },
      "x-shader/x-vertex": {
        compressible: true,
      },
    };
  },
});

// node_modules/mime-db/index.js
var require_mime_db = __commonJS({
  "node_modules/mime-db/index.js"(exports2, module2) {
    module2.exports = require_db();
  },
});

// node_modules/mime-types/index.js
var require_mime_types = __commonJS({
  "node_modules/mime-types/index.js"(exports2) {
    "use strict";
    var db = require_mime_db();
    var extname2 = require("path").extname;
    var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
    var TEXT_TYPE_REGEXP = /^text\//i;
    exports2.charset = charset;
    exports2.charsets = { lookup: charset };
    exports2.contentType = contentType;
    exports2.extension = extension;
    exports2.extensions = /* @__PURE__ */ Object.create(null);
    exports2.lookup = lookup;
    exports2.types = /* @__PURE__ */ Object.create(null);
    populateMaps(exports2.extensions, exports2.types);
    function charset(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var mime = match && db[match[1].toLowerCase()];
      if (mime && mime.charset) {
        return mime.charset;
      }
      if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return "UTF-8";
      }
      return false;
    }
    function contentType(str) {
      if (!str || typeof str !== "string") {
        return false;
      }
      var mime = str.indexOf("/") === -1 ? exports2.lookup(str) : str;
      if (!mime) {
        return false;
      }
      if (mime.indexOf("charset") === -1) {
        var charset2 = exports2.charset(mime);
        if (charset2) mime += "; charset=" + charset2.toLowerCase();
      }
      return mime;
    }
    function extension(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var exts = match && exports2.extensions[match[1].toLowerCase()];
      if (!exts || !exts.length) {
        return false;
      }
      return exts[0];
    }
    function lookup(path3) {
      if (!path3 || typeof path3 !== "string") {
        return false;
      }
      var extension2 = extname2("x." + path3)
        .toLowerCase()
        .substr(1);
      if (!extension2) {
        return false;
      }
      return exports2.types[extension2] || false;
    }
    function populateMaps(extensions, types) {
      var preference = ["nginx", "apache", void 0, "iana"];
      Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
          return;
        }
        extensions[type] = exts;
        for (var i = 0; i < exts.length; i++) {
          var extension2 = exts[i];
          if (types[extension2]) {
            var from = preference.indexOf(db[types[extension2]].source);
            var to = preference.indexOf(mime.source);
            if (
              types[extension2] !== "application/octet-stream" &&
              (from > to ||
                (from === to &&
                  types[extension2].substr(0, 12) === "application/"))
            ) {
              continue;
            }
          }
          types[extension2] = type;
        }
      });
    }
  },
});

// node_modules/asynckit/lib/defer.js
var require_defer = __commonJS({
  "node_modules/asynckit/lib/defer.js"(exports2, module2) {
    module2.exports = defer;
    function defer(fn) {
      var nextTick =
        typeof setImmediate == "function"
          ? setImmediate
          : typeof process == "object" && typeof process.nextTick == "function"
            ? process.nextTick
            : null;
      if (nextTick) {
        nextTick(fn);
      } else {
        setTimeout(fn, 0);
      }
    }
  },
});

// node_modules/asynckit/lib/async.js
var require_async = __commonJS({
  "node_modules/asynckit/lib/async.js"(exports2, module2) {
    var defer = require_defer();
    module2.exports = async;
    function async(callback) {
      var isAsync = false;
      defer(function () {
        isAsync = true;
      });
      return function async_callback(err, result) {
        if (isAsync) {
          callback(err, result);
        } else {
          defer(function nextTick_callback() {
            callback(err, result);
          });
        }
      };
    }
  },
});

// node_modules/asynckit/lib/abort.js
var require_abort = __commonJS({
  "node_modules/asynckit/lib/abort.js"(exports2, module2) {
    module2.exports = abort;
    function abort(state) {
      Object.keys(state.jobs).forEach(clean.bind(state));
      state.jobs = {};
    }
    function clean(key) {
      if (typeof this.jobs[key] == "function") {
        this.jobs[key]();
      }
    }
  },
});

// node_modules/asynckit/lib/iterate.js
var require_iterate = __commonJS({
  "node_modules/asynckit/lib/iterate.js"(exports2, module2) {
    var async = require_async();
    var abort = require_abort();
    module2.exports = iterate;
    function iterate(list, iterator, state, callback) {
      var key = state["keyedList"]
        ? state["keyedList"][state.index]
        : state.index;
      state.jobs[key] = runJob(
        iterator,
        key,
        list[key],
        function (error, output) {
          if (!(key in state.jobs)) {
            return;
          }
          delete state.jobs[key];
          if (error) {
            abort(state);
          } else {
            state.results[key] = output;
          }
          callback(error, state.results);
        },
      );
    }
    function runJob(iterator, key, item, callback) {
      var aborter;
      if (iterator.length == 2) {
        aborter = iterator(item, async(callback));
      } else {
        aborter = iterator(item, key, async(callback));
      }
      return aborter;
    }
  },
});

// node_modules/asynckit/lib/state.js
var require_state = __commonJS({
  "node_modules/asynckit/lib/state.js"(exports2, module2) {
    module2.exports = state;
    function state(list, sortMethod) {
      var isNamedList = !Array.isArray(list),
        initState = {
          index: 0,
          keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
          jobs: {},
          results: isNamedList ? {} : [],
          size: isNamedList ? Object.keys(list).length : list.length,
        };
      if (sortMethod) {
        initState.keyedList.sort(
          isNamedList
            ? sortMethod
            : function (a, b) {
                return sortMethod(list[a], list[b]);
              },
        );
      }
      return initState;
    }
  },
});

// node_modules/asynckit/lib/terminator.js
var require_terminator = __commonJS({
  "node_modules/asynckit/lib/terminator.js"(exports2, module2) {
    var abort = require_abort();
    var async = require_async();
    module2.exports = terminator;
    function terminator(callback) {
      if (!Object.keys(this.jobs).length) {
        return;
      }
      this.index = this.size;
      abort(this);
      async(callback)(null, this.results);
    }
  },
});

// node_modules/asynckit/parallel.js
var require_parallel = __commonJS({
  "node_modules/asynckit/parallel.js"(exports2, module2) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module2.exports = parallel;
    function parallel(list, iterator, callback) {
      var state = initState(list);
      while (state.index < (state["keyedList"] || list).length) {
        iterate(list, iterator, state, function (error, result) {
          if (error) {
            callback(error, result);
            return;
          }
          if (Object.keys(state.jobs).length === 0) {
            callback(null, state.results);
            return;
          }
        });
        state.index++;
      }
      return terminator.bind(state, callback);
    }
  },
});

// node_modules/asynckit/serialOrdered.js
var require_serialOrdered = __commonJS({
  "node_modules/asynckit/serialOrdered.js"(exports2, module2) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module2.exports = serialOrdered;
    module2.exports.ascending = ascending;
    module2.exports.descending = descending;
    function serialOrdered(list, iterator, sortMethod, callback) {
      var state = initState(list, sortMethod);
      iterate(list, iterator, state, function iteratorHandler(error, result) {
        if (error) {
          callback(error, result);
          return;
        }
        state.index++;
        if (state.index < (state["keyedList"] || list).length) {
          iterate(list, iterator, state, iteratorHandler);
          return;
        }
        callback(null, state.results);
      });
      return terminator.bind(state, callback);
    }
    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    }
    function descending(a, b) {
      return -1 * ascending(a, b);
    }
  },
});

// node_modules/asynckit/serial.js
var require_serial = __commonJS({
  "node_modules/asynckit/serial.js"(exports2, module2) {
    var serialOrdered = require_serialOrdered();
    module2.exports = serial;
    function serial(list, iterator, callback) {
      return serialOrdered(list, iterator, null, callback);
    }
  },
});

// node_modules/asynckit/index.js
var require_asynckit = __commonJS({
  "node_modules/asynckit/index.js"(exports2, module2) {
    module2.exports = {
      parallel: require_parallel(),
      serial: require_serial(),
      serialOrdered: require_serialOrdered(),
    };
  },
});

// node_modules/form-data/lib/populate.js
var require_populate = __commonJS({
  "node_modules/form-data/lib/populate.js"(exports2, module2) {
    module2.exports = function (dst, src) {
      Object.keys(src).forEach(function (prop) {
        dst[prop] = dst[prop] || src[prop];
      });
      return dst;
    };
  },
});

// node_modules/form-data/lib/form_data.js
var require_form_data = __commonJS({
  "node_modules/form-data/lib/form_data.js"(exports2, module2) {
    var CombinedStream = require_combined_stream();
    var util2 = require("util");
    var path3 = require("path");
    var http2 = require("http");
    var https2 = require("https");
    var parseUrl = require("url").parse;
    var fs2 = require("fs");
    var Stream = require("stream").Stream;
    var mime = require_mime_types();
    var asynckit = require_asynckit();
    var populate = require_populate();
    module2.exports = FormData3;
    util2.inherits(FormData3, CombinedStream);
    function FormData3(options) {
      if (!(this instanceof FormData3)) {
        return new FormData3(options);
      }
      this._overheadLength = 0;
      this._valueLength = 0;
      this._valuesToMeasure = [];
      CombinedStream.call(this);
      options = options || {};
      for (var option in options) {
        this[option] = options[option];
      }
    }
    FormData3.LINE_BREAK = "\r\n";
    FormData3.DEFAULT_CONTENT_TYPE = "application/octet-stream";
    FormData3.prototype.append = function (field, value, options) {
      options = options || {};
      if (typeof options == "string") {
        options = { filename: options };
      }
      var append2 = CombinedStream.prototype.append.bind(this);
      if (typeof value == "number") {
        value = "" + value;
      }
      if (util2.isArray(value)) {
        this._error(new Error("Arrays are not supported."));
        return;
      }
      var header = this._multiPartHeader(field, value, options);
      var footer = this._multiPartFooter();
      append2(header);
      append2(value);
      append2(footer);
      this._trackLength(header, value, options);
    };
    FormData3.prototype._trackLength = function (header, value, options) {
      var valueLength = 0;
      if (options.knownLength != null) {
        valueLength += +options.knownLength;
      } else if (Buffer.isBuffer(value)) {
        valueLength = value.length;
      } else if (typeof value === "string") {
        valueLength = Buffer.byteLength(value);
      }
      this._valueLength += valueLength;
      this._overheadLength +=
        Buffer.byteLength(header) + FormData3.LINE_BREAK.length;
      if (
        !value ||
        (!value.path &&
          !(value.readable && value.hasOwnProperty("httpVersion")) &&
          !(value instanceof Stream))
      ) {
        return;
      }
      if (!options.knownLength) {
        this._valuesToMeasure.push(value);
      }
    };
    FormData3.prototype._lengthRetriever = function (value, callback) {
      if (value.hasOwnProperty("fd")) {
        if (
          value.end != void 0 &&
          value.end != Infinity &&
          value.start != void 0
        ) {
          callback(null, value.end + 1 - (value.start ? value.start : 0));
        } else {
          fs2.stat(value.path, function (err, stat) {
            var fileSize;
            if (err) {
              callback(err);
              return;
            }
            fileSize = stat.size - (value.start ? value.start : 0);
            callback(null, fileSize);
          });
        }
      } else if (value.hasOwnProperty("httpVersion")) {
        callback(null, +value.headers["content-length"]);
      } else if (value.hasOwnProperty("httpModule")) {
        value.on("response", function (response) {
          value.pause();
          callback(null, +response.headers["content-length"]);
        });
        value.resume();
      } else {
        callback("Unknown stream");
      }
    };
    FormData3.prototype._multiPartHeader = function (field, value, options) {
      if (typeof options.header == "string") {
        return options.header;
      }
      var contentDisposition = this._getContentDisposition(value, options);
      var contentType = this._getContentType(value, options);
      var contents = "";
      var headers = {
        // add custom disposition as third element or keep it two elements if not
        "Content-Disposition": ["form-data", 'name="' + field + '"'].concat(
          contentDisposition || [],
        ),
        // if no content type. allow it to be empty array
        "Content-Type": [].concat(contentType || []),
      };
      if (typeof options.header == "object") {
        populate(headers, options.header);
      }
      var header;
      for (var prop in headers) {
        if (!headers.hasOwnProperty(prop)) continue;
        header = headers[prop];
        if (header == null) {
          continue;
        }
        if (!Array.isArray(header)) {
          header = [header];
        }
        if (header.length) {
          contents += prop + ": " + header.join("; ") + FormData3.LINE_BREAK;
        }
      }
      return (
        "--" +
        this.getBoundary() +
        FormData3.LINE_BREAK +
        contents +
        FormData3.LINE_BREAK
      );
    };
    FormData3.prototype._getContentDisposition = function (value, options) {
      var filename, contentDisposition;
      if (typeof options.filepath === "string") {
        filename = path3.normalize(options.filepath).replace(/\\/g, "/");
      } else if (options.filename || value.name || value.path) {
        filename = path3.basename(options.filename || value.name || value.path);
      } else if (value.readable && value.hasOwnProperty("httpVersion")) {
        filename = path3.basename(value.client._httpMessage.path || "");
      }
      if (filename) {
        contentDisposition = 'filename="' + filename + '"';
      }
      return contentDisposition;
    };
    FormData3.prototype._getContentType = function (value, options) {
      var contentType = options.contentType;
      if (!contentType && value.name) {
        contentType = mime.lookup(value.name);
      }
      if (!contentType && value.path) {
        contentType = mime.lookup(value.path);
      }
      if (
        !contentType &&
        value.readable &&
        value.hasOwnProperty("httpVersion")
      ) {
        contentType = value.headers["content-type"];
      }
      if (!contentType && (options.filepath || options.filename)) {
        contentType = mime.lookup(options.filepath || options.filename);
      }
      if (!contentType && typeof value == "object") {
        contentType = FormData3.DEFAULT_CONTENT_TYPE;
      }
      return contentType;
    };
    FormData3.prototype._multiPartFooter = function () {
      return function (next) {
        var footer = FormData3.LINE_BREAK;
        var lastPart = this._streams.length === 0;
        if (lastPart) {
          footer += this._lastBoundary();
        }
        next(footer);
      }.bind(this);
    };
    FormData3.prototype._lastBoundary = function () {
      return "--" + this.getBoundary() + "--" + FormData3.LINE_BREAK;
    };
    FormData3.prototype.getHeaders = function (userHeaders) {
      var header;
      var formHeaders = {
        "content-type": "multipart/form-data; boundary=" + this.getBoundary(),
      };
      for (header in userHeaders) {
        if (userHeaders.hasOwnProperty(header)) {
          formHeaders[header.toLowerCase()] = userHeaders[header];
        }
      }
      return formHeaders;
    };
    FormData3.prototype.setBoundary = function (boundary) {
      this._boundary = boundary;
    };
    FormData3.prototype.getBoundary = function () {
      if (!this._boundary) {
        this._generateBoundary();
      }
      return this._boundary;
    };
    FormData3.prototype.getBuffer = function () {
      var dataBuffer = new Buffer.alloc(0);
      var boundary = this.getBoundary();
      for (var i = 0, len = this._streams.length; i < len; i++) {
        if (typeof this._streams[i] !== "function") {
          if (Buffer.isBuffer(this._streams[i])) {
            dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
          } else {
            dataBuffer = Buffer.concat([
              dataBuffer,
              Buffer.from(this._streams[i]),
            ]);
          }
          if (
            typeof this._streams[i] !== "string" ||
            this._streams[i].substring(2, boundary.length + 2) !== boundary
          ) {
            dataBuffer = Buffer.concat([
              dataBuffer,
              Buffer.from(FormData3.LINE_BREAK),
            ]);
          }
        }
      }
      return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
    };
    FormData3.prototype._generateBoundary = function () {
      var boundary = "--------------------------";
      for (var i = 0; i < 24; i++) {
        boundary += Math.floor(Math.random() * 10).toString(16);
      }
      this._boundary = boundary;
    };
    FormData3.prototype.getLengthSync = function () {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this.hasKnownLength()) {
        this._error(
          new Error("Cannot calculate proper length in synchronous way."),
        );
      }
      return knownLength;
    };
    FormData3.prototype.hasKnownLength = function () {
      var hasKnownLength = true;
      if (this._valuesToMeasure.length) {
        hasKnownLength = false;
      }
      return hasKnownLength;
    };
    FormData3.prototype.getLength = function (cb) {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this._valuesToMeasure.length) {
        process.nextTick(cb.bind(this, null, knownLength));
        return;
      }
      asynckit.parallel(
        this._valuesToMeasure,
        this._lengthRetriever,
        function (err, values) {
          if (err) {
            cb(err);
            return;
          }
          values.forEach(function (length) {
            knownLength += length;
          });
          cb(null, knownLength);
        },
      );
    };
    FormData3.prototype.submit = function (params, cb) {
      var request,
        options,
        defaults2 = { method: "post" };
      if (typeof params == "string") {
        params = parseUrl(params);
        options = populate(
          {
            port: params.port,
            path: params.pathname,
            host: params.hostname,
            protocol: params.protocol,
          },
          defaults2,
        );
      } else {
        options = populate(params, defaults2);
        if (!options.port) {
          options.port = options.protocol == "https:" ? 443 : 80;
        }
      }
      options.headers = this.getHeaders(params.headers);
      if (options.protocol == "https:") {
        request = https2.request(options);
      } else {
        request = http2.request(options);
      }
      this.getLength(
        function (err, length) {
          if (err && err !== "Unknown stream") {
            this._error(err);
            return;
          }
          if (length) {
            request.setHeader("Content-Length", length);
          }
          this.pipe(request);
          if (cb) {
            var onResponse;
            var callback = function (error, responce) {
              request.removeListener("error", callback);
              request.removeListener("response", onResponse);
              return cb.call(this, error, responce);
            };
            onResponse = callback.bind(this, null);
            request.on("error", callback);
            request.on("response", onResponse);
          }
        }.bind(this),
      );
      return request;
    };
    FormData3.prototype._error = function (err) {
      if (!this.error) {
        this.error = err;
        this.pause();
        this.emit("error", err);
      }
    };
    FormData3.prototype.toString = function () {
      return "[object FormData]";
    };
  },
});

// node_modules/proxy-from-env/index.js
var require_proxy_from_env = __commonJS({
  "node_modules/proxy-from-env/index.js"(exports2) {
    "use strict";
    var parseUrl = require("url").parse;
    var DEFAULT_PORTS = {
      ftp: 21,
      gopher: 70,
      http: 80,
      https: 443,
      ws: 80,
      wss: 443,
    };
    var stringEndsWith =
      String.prototype.endsWith ||
      function (s) {
        return (
          s.length <= this.length &&
          this.indexOf(s, this.length - s.length) !== -1
        );
      };
    function getProxyForUrl2(url2) {
      var parsedUrl = typeof url2 === "string" ? parseUrl(url2) : url2 || {};
      var proto2 = parsedUrl.protocol;
      var hostname = parsedUrl.host;
      var port = parsedUrl.port;
      if (
        typeof hostname !== "string" ||
        !hostname ||
        typeof proto2 !== "string"
      ) {
        return "";
      }
      proto2 = proto2.split(":", 1)[0];
      hostname = hostname.replace(/:\d*$/, "");
      port = parseInt(port) || DEFAULT_PORTS[proto2] || 0;
      if (!shouldProxy(hostname, port)) {
        return "";
      }
      var proxy =
        getEnv("npm_config_" + proto2 + "_proxy") ||
        getEnv(proto2 + "_proxy") ||
        getEnv("npm_config_proxy") ||
        getEnv("all_proxy");
      if (proxy && proxy.indexOf("://") === -1) {
        proxy = proto2 + "://" + proxy;
      }
      return proxy;
    }
    function shouldProxy(hostname, port) {
      var NO_PROXY = (
        getEnv("npm_config_no_proxy") || getEnv("no_proxy")
      ).toLowerCase();
      if (!NO_PROXY) {
        return true;
      }
      if (NO_PROXY === "*") {
        return false;
      }
      return NO_PROXY.split(/[,\s]/).every(function (proxy) {
        if (!proxy) {
          return true;
        }
        var parsedProxy = proxy.match(/^(.+):(\d+)$/);
        var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
        var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
        if (parsedProxyPort && parsedProxyPort !== port) {
          return true;
        }
        if (!/^[.*]/.test(parsedProxyHostname)) {
          return hostname !== parsedProxyHostname;
        }
        if (parsedProxyHostname.charAt(0) === "*") {
          parsedProxyHostname = parsedProxyHostname.slice(1);
        }
        return !stringEndsWith.call(hostname, parsedProxyHostname);
      });
    }
    function getEnv(key) {
      return (
        process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || ""
      );
    }
    exports2.getProxyForUrl = getProxyForUrl2;
  },
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function (val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse5(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" +
          JSON.stringify(val),
      );
    };
    function parse5(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match =
        /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          str,
        );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  },
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env2) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env2).forEach((key) => {
        createDebug[key] = env2[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend2;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          },
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend2(namespace, delimiter) {
        const newDebug = createDebug(
          this.namespace +
            (typeof delimiter === "undefined" ? ":" : delimiter) +
            namespace,
        );
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(
          /[\s,]+/,
        );
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips
            .map(toNamespace)
            .map((namespace) => "-" + namespace),
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp
          .toString()
          .substring(2, regexp.toString().length - 2)
          .replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn(
          "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.",
        );
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  },
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn(
            "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.",
          );
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33",
    ];
    function useColors() {
      if (
        typeof window !== "undefined" &&
        window.process &&
        (window.process.type === "renderer" || window.process.__nwjs)
      ) {
        return true;
      }
      if (
        typeof navigator !== "undefined" &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
      ) {
        return false;
      }
      return (
        (typeof document !== "undefined" &&
          document.documentElement &&
          document.documentElement.style &&
          document.documentElement.style.WebkitAppearance) || // Is firebug? http://stackoverflow.com/a/398120/376773
        (typeof window !== "undefined" &&
          window.console &&
          (window.console.firebug ||
            (window.console.exception && window.console.table))) || // Is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (typeof navigator !== "undefined" &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
          parseInt(RegExp.$1, 10) >= 31) || // Double check webkit in userAgent just in case we are in a worker
        (typeof navigator !== "undefined" &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
      );
    }
    function formatArgs(args) {
      args[0] =
        (this.useColors ? "%c" : "") +
        this.namespace +
        (this.useColors ? " %c" : " ") +
        args[0] +
        (this.useColors ? "%c " : " ") +
        "+" +
        module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {});
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {}
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error) {}
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {}
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function (v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  },
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return (
        position !== -1 &&
        (terminatorPosition === -1 || position < terminatorPosition)
      );
    };
  },
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os2 = require("os");
    var tty2 = require("tty");
    var hasFlag2 = require_has_flag();
    var { env: env2 } = process;
    var forceColor;
    if (
      hasFlag2("no-color") ||
      hasFlag2("no-colors") ||
      hasFlag2("color=false") ||
      hasFlag2("color=never")
    ) {
      forceColor = 0;
    } else if (
      hasFlag2("color") ||
      hasFlag2("colors") ||
      hasFlag2("color=true") ||
      hasFlag2("color=always")
    ) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env2) {
      if (env2.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env2.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor =
          env2.FORCE_COLOR.length === 0
            ? 1
            : Math.min(parseInt(env2.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel2(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3,
      };
    }
    function supportsColor2(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (
        hasFlag2("color=16m") ||
        hasFlag2("color=full") ||
        hasFlag2("color=truecolor")
      ) {
        return 3;
      }
      if (hasFlag2("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env2.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os2.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env2) {
        if (
          [
            "TRAVIS",
            "CIRCLECI",
            "APPVEYOR",
            "GITLAB_CI",
            "GITHUB_ACTIONS",
            "BUILDKITE",
          ].some((sign) => sign in env2) ||
          env2.CI_NAME === "codeship"
        ) {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env2) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env2.TEAMCITY_VERSION)
          ? 1
          : 0;
      }
      if (env2.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env2) {
        const version2 = parseInt(
          (env2.TERM_PROGRAM_VERSION || "").split(".")[0],
          10,
        );
        switch (env2.TERM_PROGRAM) {
          case "iTerm.app":
            return version2 >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env2.TERM)) {
        return 2;
      }
      if (
        /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
          env2.TERM,
        )
      ) {
        return 1;
      }
      if ("COLORTERM" in env2) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream4) {
      const level = supportsColor2(stream4, stream4 && stream4.isTTY);
      return translateLevel2(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel2(supportsColor2(true, tty2.isatty(1))),
      stderr: translateLevel2(supportsColor2(true, tty2.isatty(2))),
    };
  },
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty2 = require("tty");
    var util2 = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util2.deprecate(
      () => {},
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.",
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor2 = require_supports_color();
      if (
        supportsColor2 &&
        (supportsColor2.stderr || supportsColor2).level >= 2
      ) {
        exports2.colors = [
          20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62,
          63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113,
          128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167,
          168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199,
          200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221,
        ];
      }
    } catch (error) {}
    exports2.inspectOpts = Object.keys(process.env)
      .filter((key) => {
        return /^debug_/i.test(key);
      })
      .reduce((obj, key) => {
        const prop = key
          .substring(6)
          .toLowerCase()
          .replace(/_([a-z])/g, (_, k) => {
            return k.toUpperCase();
          });
        let val = process.env[key];
        if (/^(yes|on|true|enabled)$/i.test(val)) {
          val = true;
        } else if (/^(no|off|false|disabled)$/i.test(val)) {
          val = false;
        } else if (val === "null") {
          val = null;
        } else {
          val = Number(val);
        }
        obj[prop] = val;
        return obj;
      }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts
        ? Boolean(exports2.inspectOpts.colors)
        : tty2.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(
          colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m",
        );
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return /* @__PURE__ */ new Date().toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(
        util2.formatWithOptions(exports2.inspectOpts, ...args) + "\n",
      );
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function (v) {
      this.inspectOpts.colors = this.useColors;
      return util2
        .inspect(v, this.inspectOpts)
        .split("\n")
        .map((str) => str.trim())
        .join(" ");
    };
    formatters.O = function (v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  },
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (
      typeof process === "undefined" ||
      process.type === "renderer" ||
      process.browser === true ||
      process.__nwjs
    ) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  },
});

// node_modules/follow-redirects/debug.js
var require_debug = __commonJS({
  "node_modules/follow-redirects/debug.js"(exports2, module2) {
    var debug;
    module2.exports = function () {
      if (!debug) {
        try {
          debug = require_src()("follow-redirects");
        } catch (error) {}
        if (typeof debug !== "function") {
          debug = function () {};
        }
      }
      debug.apply(null, arguments);
    };
  },
});

// node_modules/follow-redirects/index.js
var require_follow_redirects = __commonJS({
  "node_modules/follow-redirects/index.js"(exports2, module2) {
    var url2 = require("url");
    var URL2 = url2.URL;
    var http2 = require("http");
    var https2 = require("https");
    var Writable = require("stream").Writable;
    var assert = require("assert");
    var debug = require_debug();
    var useNativeURL = false;
    try {
      assert(new URL2());
    } catch (error) {
      useNativeURL = error.code === "ERR_INVALID_URL";
    }
    var preservedUrlFields = [
      "auth",
      "host",
      "hostname",
      "href",
      "path",
      "pathname",
      "port",
      "protocol",
      "query",
      "search",
      "hash",
    ];
    var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
    var eventHandlers = /* @__PURE__ */ Object.create(null);
    events.forEach(function (event) {
      eventHandlers[event] = function (arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
      };
    });
    var InvalidUrlError = createErrorType(
      "ERR_INVALID_URL",
      "Invalid URL",
      TypeError,
    );
    var RedirectionError = createErrorType(
      "ERR_FR_REDIRECTION_FAILURE",
      "Redirected request failed",
    );
    var TooManyRedirectsError = createErrorType(
      "ERR_FR_TOO_MANY_REDIRECTS",
      "Maximum number of redirects exceeded",
      RedirectionError,
    );
    var MaxBodyLengthExceededError = createErrorType(
      "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
      "Request body larger than maxBodyLength limit",
    );
    var WriteAfterEndError = createErrorType(
      "ERR_STREAM_WRITE_AFTER_END",
      "write after end",
    );
    var destroy = Writable.prototype.destroy || noop2;
    function RedirectableRequest(options, responseCallback) {
      Writable.call(this);
      this._sanitizeOptions(options);
      this._options = options;
      this._ended = false;
      this._ending = false;
      this._redirectCount = 0;
      this._redirects = [];
      this._requestBodyLength = 0;
      this._requestBodyBuffers = [];
      if (responseCallback) {
        this.on("response", responseCallback);
      }
      var self2 = this;
      this._onNativeResponse = function (response) {
        try {
          self2._processResponse(response);
        } catch (cause) {
          self2.emit(
            "error",
            cause instanceof RedirectionError
              ? cause
              : new RedirectionError({ cause }),
          );
        }
      };
      this._performRequest();
    }
    RedirectableRequest.prototype = Object.create(Writable.prototype);
    RedirectableRequest.prototype.abort = function () {
      destroyRequest(this._currentRequest);
      this._currentRequest.abort();
      this.emit("abort");
    };
    RedirectableRequest.prototype.destroy = function (error) {
      destroyRequest(this._currentRequest, error);
      destroy.call(this, error);
      return this;
    };
    RedirectableRequest.prototype.write = function (data, encoding, callback) {
      if (this._ending) {
        throw new WriteAfterEndError();
      }
      if (!isString2(data) && !isBuffer2(data)) {
        throw new TypeError("data should be a string, Buffer or Uint8Array");
      }
      if (isFunction2(encoding)) {
        callback = encoding;
        encoding = null;
      }
      if (data.length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      if (
        this._requestBodyLength + data.length <=
        this._options.maxBodyLength
      ) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({ data, encoding });
        this._currentRequest.write(data, encoding, callback);
      } else {
        this.emit("error", new MaxBodyLengthExceededError());
        this.abort();
      }
    };
    RedirectableRequest.prototype.end = function (data, encoding, callback) {
      if (isFunction2(data)) {
        callback = data;
        data = encoding = null;
      } else if (isFunction2(encoding)) {
        callback = encoding;
        encoding = null;
      }
      if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
      } else {
        var self2 = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function () {
          self2._ended = true;
          currentRequest.end(null, null, callback);
        });
        this._ending = true;
      }
    };
    RedirectableRequest.prototype.setHeader = function (name, value) {
      this._options.headers[name] = value;
      this._currentRequest.setHeader(name, value);
    };
    RedirectableRequest.prototype.removeHeader = function (name) {
      delete this._options.headers[name];
      this._currentRequest.removeHeader(name);
    };
    RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
      var self2 = this;
      function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener("timeout", socket.destroy);
        socket.addListener("timeout", socket.destroy);
      }
      function startTimer(socket) {
        if (self2._timeout) {
          clearTimeout(self2._timeout);
        }
        self2._timeout = setTimeout(function () {
          self2.emit("timeout");
          clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
      }
      function clearTimer() {
        if (self2._timeout) {
          clearTimeout(self2._timeout);
          self2._timeout = null;
        }
        self2.removeListener("abort", clearTimer);
        self2.removeListener("error", clearTimer);
        self2.removeListener("response", clearTimer);
        self2.removeListener("close", clearTimer);
        if (callback) {
          self2.removeListener("timeout", callback);
        }
        if (!self2.socket) {
          self2._currentRequest.removeListener("socket", startTimer);
        }
      }
      if (callback) {
        this.on("timeout", callback);
      }
      if (this.socket) {
        startTimer(this.socket);
      } else {
        this._currentRequest.once("socket", startTimer);
      }
      this.on("socket", destroyOnTimeout);
      this.on("abort", clearTimer);
      this.on("error", clearTimer);
      this.on("response", clearTimer);
      this.on("close", clearTimer);
      return this;
    };
    ["flushHeaders", "getHeader", "setNoDelay", "setSocketKeepAlive"].forEach(
      function (method) {
        RedirectableRequest.prototype[method] = function (a, b) {
          return this._currentRequest[method](a, b);
        };
      },
    );
    ["aborted", "connection", "socket"].forEach(function (property) {
      Object.defineProperty(RedirectableRequest.prototype, property, {
        get: function () {
          return this._currentRequest[property];
        },
      });
    });
    RedirectableRequest.prototype._sanitizeOptions = function (options) {
      if (!options.headers) {
        options.headers = {};
      }
      if (options.host) {
        if (!options.hostname) {
          options.hostname = options.host;
        }
        delete options.host;
      }
      if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf("?");
        if (searchPos < 0) {
          options.pathname = options.path;
        } else {
          options.pathname = options.path.substring(0, searchPos);
          options.search = options.path.substring(searchPos);
        }
      }
    };
    RedirectableRequest.prototype._performRequest = function () {
      var protocol = this._options.protocol;
      var nativeProtocol = this._options.nativeProtocols[protocol];
      if (!nativeProtocol) {
        throw new TypeError("Unsupported protocol " + protocol);
      }
      if (this._options.agents) {
        var scheme = protocol.slice(0, -1);
        this._options.agent = this._options.agents[scheme];
      }
      var request = (this._currentRequest = nativeProtocol.request(
        this._options,
        this._onNativeResponse,
      ));
      request._redirectable = this;
      for (var event of events) {
        request.on(event, eventHandlers[event]);
      }
      this._currentUrl = /^\//.test(this._options.path)
        ? url2.format(this._options)
        : // When making a request to a proxy, […]
          // a client MUST send the target URI in absolute-form […].
          this._options.path;
      if (this._isRedirect) {
        var i = 0;
        var self2 = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error) {
          if (request === self2._currentRequest) {
            if (error) {
              self2.emit("error", error);
            } else if (i < buffers.length) {
              var buffer = buffers[i++];
              if (!request.finished) {
                request.write(buffer.data, buffer.encoding, writeNext);
              }
            } else if (self2._ended) {
              request.end();
            }
          }
        })();
      }
    };
    RedirectableRequest.prototype._processResponse = function (response) {
      var statusCode = response.statusCode;
      if (this._options.trackRedirects) {
        this._redirects.push({
          url: this._currentUrl,
          headers: response.headers,
          statusCode,
        });
      }
      var location = response.headers.location;
      if (
        !location ||
        this._options.followRedirects === false ||
        statusCode < 300 ||
        statusCode >= 400
      ) {
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit("response", response);
        this._requestBodyBuffers = [];
        return;
      }
      destroyRequest(this._currentRequest);
      response.destroy();
      if (++this._redirectCount > this._options.maxRedirects) {
        throw new TooManyRedirectsError();
      }
      var requestHeaders;
      var beforeRedirect = this._options.beforeRedirect;
      if (beforeRedirect) {
        requestHeaders = Object.assign(
          {
            // The Host header was set by nativeProtocol.request
            Host: response.req.getHeader("host"),
          },
          this._options.headers,
        );
      }
      var method = this._options.method;
      if (
        ((statusCode === 301 || statusCode === 302) &&
          this._options.method === "POST") || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
        // the server is redirecting the user agent to a different resource […]
        // A user agent can perform a retrieval request targeting that URI
        // (a GET or HEAD request if using HTTP) […]
        (statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method))
      ) {
        this._options.method = "GET";
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
      }
      var currentHostHeader = removeMatchingHeaders(
        /^host$/i,
        this._options.headers,
      );
      var currentUrlParts = parseUrl(this._currentUrl);
      var currentHost = currentHostHeader || currentUrlParts.host;
      var currentUrl = /^\w+:/.test(location)
        ? this._currentUrl
        : url2.format(Object.assign(currentUrlParts, { host: currentHost }));
      var redirectUrl = resolveUrl(location, currentUrl);
      debug("redirecting to", redirectUrl.href);
      this._isRedirect = true;
      spreadUrlObject(redirectUrl, this._options);
      if (
        (redirectUrl.protocol !== currentUrlParts.protocol &&
          redirectUrl.protocol !== "https:") ||
        (redirectUrl.host !== currentHost &&
          !isSubdomain(redirectUrl.host, currentHost))
      ) {
        removeMatchingHeaders(
          /^(?:(?:proxy-)?authorization|cookie)$/i,
          this._options.headers,
        );
      }
      if (isFunction2(beforeRedirect)) {
        var responseDetails = {
          headers: response.headers,
          statusCode,
        };
        var requestDetails = {
          url: currentUrl,
          method,
          headers: requestHeaders,
        };
        beforeRedirect(this._options, responseDetails, requestDetails);
        this._sanitizeOptions(this._options);
      }
      this._performRequest();
    };
    function wrap(protocols) {
      var exports3 = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024,
      };
      var nativeProtocols = {};
      Object.keys(protocols).forEach(function (scheme) {
        var protocol = scheme + ":";
        var nativeProtocol = (nativeProtocols[protocol] = protocols[scheme]);
        var wrappedProtocol = (exports3[scheme] =
          Object.create(nativeProtocol));
        function request(input, options, callback) {
          if (isURL(input)) {
            input = spreadUrlObject(input);
          } else if (isString2(input)) {
            input = spreadUrlObject(parseUrl(input));
          } else {
            callback = options;
            options = validateUrl(input);
            input = { protocol };
          }
          if (isFunction2(options)) {
            callback = options;
            options = null;
          }
          options = Object.assign(
            {
              maxRedirects: exports3.maxRedirects,
              maxBodyLength: exports3.maxBodyLength,
            },
            input,
            options,
          );
          options.nativeProtocols = nativeProtocols;
          if (!isString2(options.host) && !isString2(options.hostname)) {
            options.hostname = "::1";
          }
          assert.equal(options.protocol, protocol, "protocol mismatch");
          debug("options", options);
          return new RedirectableRequest(options, callback);
        }
        function get(input, options, callback) {
          var wrappedRequest = wrappedProtocol.request(
            input,
            options,
            callback,
          );
          wrappedRequest.end();
          return wrappedRequest;
        }
        Object.defineProperties(wrappedProtocol, {
          request: {
            value: request,
            configurable: true,
            enumerable: true,
            writable: true,
          },
          get: {
            value: get,
            configurable: true,
            enumerable: true,
            writable: true,
          },
        });
      });
      return exports3;
    }
    function noop2() {}
    function parseUrl(input) {
      var parsed;
      if (useNativeURL) {
        parsed = new URL2(input);
      } else {
        parsed = validateUrl(url2.parse(input));
        if (!isString2(parsed.protocol)) {
          throw new InvalidUrlError({ input });
        }
      }
      return parsed;
    }
    function resolveUrl(relative2, base) {
      return useNativeURL
        ? new URL2(relative2, base)
        : parseUrl(url2.resolve(base, relative2));
    }
    function validateUrl(input) {
      if (
        /^\[/.test(input.hostname) &&
        !/^\[[:0-9a-f]+\]$/i.test(input.hostname)
      ) {
        throw new InvalidUrlError({ input: input.href || input });
      }
      if (
        /^\[/.test(input.host) &&
        !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)
      ) {
        throw new InvalidUrlError({ input: input.href || input });
      }
      return input;
    }
    function spreadUrlObject(urlObject, target) {
      var spread3 = target || {};
      for (var key of preservedUrlFields) {
        spread3[key] = urlObject[key];
      }
      if (spread3.hostname.startsWith("[")) {
        spread3.hostname = spread3.hostname.slice(1, -1);
      }
      if (spread3.port !== "") {
        spread3.port = Number(spread3.port);
      }
      spread3.path = spread3.search
        ? spread3.pathname + spread3.search
        : spread3.pathname;
      return spread3;
    }
    function removeMatchingHeaders(regex, headers) {
      var lastValue;
      for (var header in headers) {
        if (regex.test(header)) {
          lastValue = headers[header];
          delete headers[header];
        }
      }
      return lastValue === null || typeof lastValue === "undefined"
        ? void 0
        : String(lastValue).trim();
    }
    function createErrorType(code, message, baseClass) {
      function CustomError(properties) {
        Error.captureStackTrace(this, this.constructor);
        Object.assign(this, properties || {});
        this.code = code;
        this.message = this.cause
          ? message + ": " + this.cause.message
          : message;
      }
      CustomError.prototype = new (baseClass || Error)();
      Object.defineProperties(CustomError.prototype, {
        constructor: {
          value: CustomError,
          enumerable: false,
        },
        name: {
          value: "Error [" + code + "]",
          enumerable: false,
        },
      });
      return CustomError;
    }
    function destroyRequest(request, error) {
      for (var event of events) {
        request.removeListener(event, eventHandlers[event]);
      }
      request.on("error", noop2);
      request.destroy(error);
    }
    function isSubdomain(subdomain, domain) {
      assert(isString2(subdomain) && isString2(domain));
      var dot = subdomain.length - domain.length - 1;
      return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
    }
    function isString2(value) {
      return typeof value === "string" || value instanceof String;
    }
    function isFunction2(value) {
      return typeof value === "function";
    }
    function isBuffer2(value) {
      return typeof value === "object" && "length" in value;
    }
    function isURL(value) {
      return URL2 && value instanceof URL2;
    }
    module2.exports = wrap({ http: http2, https: https2 });
    module2.exports.wrap = wrap;
  },
});

// node_modules/smol-toml/dist/error.js
var require_error2 = __commonJS({
  "node_modules/smol-toml/dist/error.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TomlError = void 0;
    function getLineColFromPtr(string, ptr) {
      let lines = string.slice(0, ptr).split(/\r\n|\n|\r/g);
      return [lines.length, lines.pop().length + 1];
    }
    function makeCodeBlock(string, line, column) {
      let lines = string.split(/\r\n|\n|\r/g);
      let codeblock = "";
      let numberLen = (Math.log10(line + 1) | 0) + 1;
      for (let i = line - 1; i <= line + 1; i++) {
        let l = lines[i - 1];
        if (!l) continue;
        codeblock += i.toString().padEnd(numberLen, " ");
        codeblock += ":  ";
        codeblock += l;
        codeblock += "\n";
        if (i === line) {
          codeblock += " ".repeat(numberLen + column + 2);
          codeblock += "^\n";
        }
      }
      return codeblock;
    }
    var TomlError = class extends Error {
      line;
      column;
      codeblock;
      constructor(message, options) {
        const [line, column] = getLineColFromPtr(options.toml, options.ptr);
        const codeblock = makeCodeBlock(options.toml, line, column);
        super(
          `Invalid TOML document: ${message}

${codeblock}`,
          options,
        );
        this.line = line;
        this.column = column;
        this.codeblock = codeblock;
      }
    };
    exports2.TomlError = TomlError;
  },
});

// node_modules/smol-toml/dist/date.js
var require_date = __commonJS({
  "node_modules/smol-toml/dist/date.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TomlDate = void 0;
    var DATE_TIME_RE =
      /^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}:\d{2}(?:\.\d+)?)?(Z|[-+]\d{2}:\d{2})?$/i;
    var TomlDate = class _TomlDate extends Date {
      #hasDate = false;
      #hasTime = false;
      #offset = null;
      constructor(date) {
        let hasDate = true;
        let hasTime = true;
        let offset = "Z";
        if (typeof date === "string") {
          let match = date.match(DATE_TIME_RE);
          if (match) {
            if (!match[1]) {
              hasDate = false;
              date = `0000-01-01T${date}`;
            }
            hasTime = !!match[2];
            if (match[2] && +match[2] > 23) {
              date = "";
            } else {
              offset = match[3] || null;
              date = date.toUpperCase();
              if (!offset && hasTime) date += "Z";
            }
          } else {
            date = "";
          }
        }
        super(date);
        if (!isNaN(this.getTime())) {
          this.#hasDate = hasDate;
          this.#hasTime = hasTime;
          this.#offset = offset;
        }
      }
      isDateTime() {
        return this.#hasDate && this.#hasTime;
      }
      isLocal() {
        return !this.#hasDate || !this.#hasTime || !this.#offset;
      }
      isDate() {
        return this.#hasDate && !this.#hasTime;
      }
      isTime() {
        return this.#hasTime && !this.#hasDate;
      }
      isValid() {
        return this.#hasDate || this.#hasTime;
      }
      toISOString() {
        let iso = super.toISOString();
        if (this.isDate()) return iso.slice(0, 10);
        if (this.isTime()) return iso.slice(11, 23);
        if (this.#offset === null) return iso.slice(0, -1);
        if (this.#offset === "Z") return iso;
        let offset = +this.#offset.slice(1, 3) * 60 + +this.#offset.slice(4, 6);
        offset = this.#offset[0] === "-" ? offset : -offset;
        let offsetDate = new Date(this.getTime() - offset * 6e4);
        return offsetDate.toISOString().slice(0, -1) + this.#offset;
      }
      static wrapAsOffsetDateTime(jsDate, offset = "Z") {
        let date = new _TomlDate(jsDate);
        date.#offset = offset;
        return date;
      }
      static wrapAsLocalDateTime(jsDate) {
        let date = new _TomlDate(jsDate);
        date.#offset = null;
        return date;
      }
      static wrapAsLocalDate(jsDate) {
        let date = new _TomlDate(jsDate);
        date.#hasTime = false;
        date.#offset = null;
        return date;
      }
      static wrapAsLocalTime(jsDate) {
        let date = new _TomlDate(jsDate);
        date.#hasDate = false;
        date.#offset = null;
        return date;
      }
    };
    exports2.TomlDate = TomlDate;
  },
});

// node_modules/smol-toml/dist/util.js
var require_util = __commonJS({
  "node_modules/smol-toml/dist/util.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getStringEnd =
      exports2.skipUntil =
      exports2.skipVoid =
      exports2.skipComment =
      exports2.indexOfNewline =
        void 0;
    var error_js_1 = require_error2();
    function indexOfNewline(str, start = 0, end = str.length) {
      let idx = str.indexOf("\n", start);
      if (str[idx - 1] === "\r") idx--;
      return idx <= end ? idx : -1;
    }
    exports2.indexOfNewline = indexOfNewline;
    function skipComment(str, ptr) {
      for (let i = ptr; i < str.length; i++) {
        let c = str[i];
        if (c === "\n") return i;
        if (c === "\r" && str[i + 1] === "\n") return i + 1;
        if ((c < " " && c !== "	") || c === "\x7F") {
          throw new error_js_1.TomlError(
            "control characters are not allowed in comments",
            {
              toml: str,
              ptr,
            },
          );
        }
      }
      return str.length;
    }
    exports2.skipComment = skipComment;
    function skipVoid(str, ptr, banNewLines, banComments) {
      let c;
      while (
        (c = str[ptr]) === " " ||
        c === "	" ||
        (!banNewLines && (c === "\n" || (c === "\r" && str[ptr + 1] === "\n")))
      )
        ptr++;
      return banComments || c !== "#"
        ? ptr
        : skipVoid(str, skipComment(str, ptr), banNewLines);
    }
    exports2.skipVoid = skipVoid;
    function skipUntil(str, ptr, sep, end, banNewLines = false) {
      if (!end) {
        ptr = indexOfNewline(str, ptr);
        return ptr < 0 ? str.length : ptr;
      }
      for (let i = ptr; i < str.length; i++) {
        let c = str[i];
        if (c === "#") {
          i = indexOfNewline(str, i);
        } else if (c === sep) {
          return i + 1;
        } else if (c === end) {
          return i;
        } else if (
          banNewLines &&
          (c === "\n" || (c === "\r" && str[i + 1] === "\n"))
        ) {
          return i;
        }
      }
      throw new error_js_1.TomlError("cannot find end of structure", {
        toml: str,
        ptr,
      });
    }
    exports2.skipUntil = skipUntil;
    function getStringEnd(str, seek) {
      let first = str[seek];
      let target =
        first === str[seek + 1] && str[seek + 1] === str[seek + 2]
          ? str.slice(seek, seek + 3)
          : first;
      seek += target.length - 1;
      do seek = str.indexOf(target, ++seek);
      while (
        seek > -1 &&
        first !== "'" &&
        str[seek - 1] === "\\" &&
        str[seek - 2] !== "\\"
      );
      if (seek > -1) {
        seek += target.length;
        if (target.length > 1) {
          if (str[seek] === first) seek++;
          if (str[seek] === first) seek++;
        }
      }
      return seek;
    }
    exports2.getStringEnd = getStringEnd;
  },
});

// node_modules/smol-toml/dist/primitive.js
var require_primitive = __commonJS({
  "node_modules/smol-toml/dist/primitive.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parseValue = exports2.parseString = void 0;
    var util_js_1 = require_util();
    var date_js_1 = require_date();
    var error_js_1 = require_error2();
    var INT_REGEX =
      /^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/;
    var FLOAT_REGEX = /^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/;
    var LEADING_ZERO = /^[+-]?0[0-9_]/;
    var ESCAPE_REGEX = /^[0-9a-f]{4,8}$/i;
    var ESC_MAP = {
      b: "\b",
      t: "	",
      n: "\n",
      f: "\f",
      r: "\r",
      '"': '"',
      "\\": "\\",
    };
    function parseString(str, ptr = 0, endPtr = str.length) {
      let isLiteral = str[ptr] === "'";
      let isMultiline = str[ptr++] === str[ptr] && str[ptr] === str[ptr + 1];
      if (isMultiline) {
        endPtr -= 2;
        if (str[(ptr += 2)] === "\r") ptr++;
        if (str[ptr] === "\n") ptr++;
      }
      let tmp = 0;
      let isEscape;
      let parsed = "";
      let sliceStart = ptr;
      while (ptr < endPtr - 1) {
        let c = str[ptr++];
        if (c === "\n" || (c === "\r" && str[ptr] === "\n")) {
          if (!isMultiline) {
            throw new error_js_1.TomlError(
              "newlines are not allowed in strings",
              {
                toml: str,
                ptr: ptr - 1,
              },
            );
          }
        } else if ((c < " " && c !== "	") || c === "\x7F") {
          throw new error_js_1.TomlError(
            "control characters are not allowed in strings",
            {
              toml: str,
              ptr: ptr - 1,
            },
          );
        }
        if (isEscape) {
          isEscape = false;
          if (c === "u" || c === "U") {
            let code = str.slice(ptr, (ptr += c === "u" ? 4 : 8));
            if (!ESCAPE_REGEX.test(code)) {
              throw new error_js_1.TomlError("invalid unicode escape", {
                toml: str,
                ptr: tmp,
              });
            }
            try {
              parsed += String.fromCodePoint(parseInt(code, 16));
            } catch {
              throw new error_js_1.TomlError("invalid unicode escape", {
                toml: str,
                ptr: tmp,
              });
            }
          } else if (
            isMultiline &&
            (c === "\n" || c === " " || c === "	" || c === "\r")
          ) {
            ptr = (0, util_js_1.skipVoid)(str, ptr - 1, true);
            if (str[ptr] !== "\n" && str[ptr] !== "\r") {
              throw new error_js_1.TomlError(
                "invalid escape: only line-ending whitespace may be escaped",
                {
                  toml: str,
                  ptr: tmp,
                },
              );
            }
            ptr = (0, util_js_1.skipVoid)(str, ptr);
          } else if (c in ESC_MAP) {
            parsed += ESC_MAP[c];
          } else {
            throw new error_js_1.TomlError("unrecognized escape sequence", {
              toml: str,
              ptr: tmp,
            });
          }
          sliceStart = ptr;
        } else if (!isLiteral && c === "\\") {
          tmp = ptr - 1;
          isEscape = true;
          parsed += str.slice(sliceStart, tmp);
        }
      }
      return parsed + str.slice(sliceStart, endPtr - 1);
    }
    exports2.parseString = parseString;
    function parseValue(value, toml, ptr) {
      if (value === "true") return true;
      if (value === "false") return false;
      if (value === "-inf") return -Infinity;
      if (value === "inf" || value === "+inf") return Infinity;
      if (value === "nan" || value === "+nan" || value === "-nan") return NaN;
      if (value === "-0") return 0;
      let isInt;
      if ((isInt = INT_REGEX.test(value)) || FLOAT_REGEX.test(value)) {
        if (LEADING_ZERO.test(value)) {
          throw new error_js_1.TomlError("leading zeroes are not allowed", {
            toml,
            ptr,
          });
        }
        let numeric = +value.replace(/_/g, "");
        if (isNaN(numeric)) {
          throw new error_js_1.TomlError("invalid number", {
            toml,
            ptr,
          });
        }
        if (isInt && !Number.isSafeInteger(numeric)) {
          throw new error_js_1.TomlError(
            "integer value cannot be represented losslessly",
            {
              toml,
              ptr,
            },
          );
        }
        return numeric;
      }
      let date = new date_js_1.TomlDate(value);
      if (!date.isValid()) {
        throw new error_js_1.TomlError("invalid value", {
          toml,
          ptr,
        });
      }
      return date;
    }
    exports2.parseValue = parseValue;
  },
});

// node_modules/smol-toml/dist/extract.js
var require_extract = __commonJS({
  "node_modules/smol-toml/dist/extract.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.extractValue = void 0;
    var primitive_js_1 = require_primitive();
    var struct_js_1 = require_struct();
    var util_js_1 = require_util();
    var error_js_1 = require_error2();
    function sliceAndTrimEndOf(str, startPtr, endPtr, allowNewLines) {
      let value = str.slice(startPtr, endPtr);
      let commentIdx = value.indexOf("#");
      if (commentIdx > -1) {
        (0, util_js_1.skipComment)(str, commentIdx);
        value = value.slice(0, commentIdx);
      }
      let trimmed = value.trimEnd();
      if (!allowNewLines) {
        let newlineIdx = value.indexOf("\n", trimmed.length);
        if (newlineIdx > -1) {
          throw new error_js_1.TomlError(
            "newlines are not allowed in inline tables",
            {
              toml: str,
              ptr: startPtr + newlineIdx,
            },
          );
        }
      }
      return [trimmed, commentIdx];
    }
    function extractValue(str, ptr, end) {
      let c = str[ptr];
      if (c === "[" || c === "{") {
        let [value, endPtr2] =
          c === "["
            ? (0, struct_js_1.parseArray)(str, ptr)
            : (0, struct_js_1.parseInlineTable)(str, ptr);
        let newPtr = (0, util_js_1.skipUntil)(str, endPtr2, ",", end);
        if (end === "}") {
          let nextNewLine = (0, util_js_1.indexOfNewline)(str, endPtr2, newPtr);
          if (nextNewLine > -1) {
            throw new error_js_1.TomlError(
              "newlines are not allowed in inline tables",
              {
                toml: str,
                ptr: nextNewLine,
              },
            );
          }
        }
        return [value, newPtr];
      }
      let endPtr;
      if (c === '"' || c === "'") {
        endPtr = (0, util_js_1.getStringEnd)(str, ptr);
        let parsed = (0, primitive_js_1.parseString)(str, ptr, endPtr);
        if (end) {
          endPtr = (0, util_js_1.skipVoid)(str, endPtr, end !== "]");
          if (
            str[endPtr] &&
            str[endPtr] !== "," &&
            str[endPtr] !== end &&
            str[endPtr] !== "\n" &&
            str[endPtr] !== "\r"
          ) {
            throw new error_js_1.TomlError("unexpected character encountered", {
              toml: str,
              ptr: endPtr,
            });
          }
          endPtr += +(str[endPtr] === ",");
        }
        return [parsed, endPtr];
      }
      endPtr = (0, util_js_1.skipUntil)(str, ptr, ",", end);
      let slice = sliceAndTrimEndOf(
        str,
        ptr,
        endPtr - +(str[endPtr - 1] === ","),
        end === "]",
      );
      if (!slice[0]) {
        throw new error_js_1.TomlError(
          "incomplete key-value declaration: no value specified",
          {
            toml: str,
            ptr,
          },
        );
      }
      if (end && slice[1] > -1) {
        endPtr = (0, util_js_1.skipVoid)(str, ptr + slice[1]);
        endPtr += +(str[endPtr] === ",");
      }
      return [(0, primitive_js_1.parseValue)(slice[0], str, ptr), endPtr];
    }
    exports2.extractValue = extractValue;
  },
});

// node_modules/smol-toml/dist/struct.js
var require_struct = __commonJS({
  "node_modules/smol-toml/dist/struct.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parseArray =
      exports2.parseInlineTable =
      exports2.parseKey =
        void 0;
    var primitive_js_1 = require_primitive();
    var extract_js_1 = require_extract();
    var util_js_1 = require_util();
    var error_js_1 = require_error2();
    var KEY_PART_RE = /^[a-zA-Z0-9-_]+[ \t]*$/;
    function parseKey(str, ptr, end = "=") {
      let dot = ptr - 1;
      let parsed = [];
      let endPtr = str.indexOf(end, ptr);
      if (endPtr < 0) {
        throw new error_js_1.TomlError(
          "incomplete key-value: cannot find end of key",
          {
            toml: str,
            ptr,
          },
        );
      }
      do {
        let c = str[(ptr = ++dot)];
        if (c !== " " && c !== "	") {
          if (c === '"' || c === "'") {
            if (c === str[ptr + 1] && c === str[ptr + 2]) {
              throw new error_js_1.TomlError(
                "multiline strings are not allowed in keys",
                {
                  toml: str,
                  ptr,
                },
              );
            }
            let eos = (0, util_js_1.getStringEnd)(str, ptr);
            if (eos < 0) {
              throw new error_js_1.TomlError("unfinished string encountered", {
                toml: str,
                ptr,
              });
            }
            dot = str.indexOf(".", eos);
            let strEnd = str.slice(eos, dot < 0 || dot > endPtr ? endPtr : dot);
            let newLine = (0, util_js_1.indexOfNewline)(strEnd);
            if (newLine > -1) {
              throw new error_js_1.TomlError(
                "newlines are not allowed in keys",
                {
                  toml: str,
                  ptr: ptr + dot + newLine,
                },
              );
            }
            if (strEnd.trimStart()) {
              throw new error_js_1.TomlError(
                "found extra tokens after the string part",
                {
                  toml: str,
                  ptr: eos,
                },
              );
            }
            if (endPtr < eos) {
              endPtr = str.indexOf(end, eos);
              if (endPtr < 0) {
                throw new error_js_1.TomlError(
                  "incomplete key-value: cannot find end of key",
                  {
                    toml: str,
                    ptr,
                  },
                );
              }
            }
            parsed.push((0, primitive_js_1.parseString)(str, ptr, eos));
          } else {
            dot = str.indexOf(".", ptr);
            let part = str.slice(ptr, dot < 0 || dot > endPtr ? endPtr : dot);
            if (!KEY_PART_RE.test(part)) {
              throw new error_js_1.TomlError(
                "only letter, numbers, dashes and underscores are allowed in keys",
                {
                  toml: str,
                  ptr,
                },
              );
            }
            parsed.push(part.trimEnd());
          }
        }
      } while (dot + 1 && dot < endPtr);
      return [parsed, (0, util_js_1.skipVoid)(str, endPtr + 1, true, true)];
    }
    exports2.parseKey = parseKey;
    function parseInlineTable(str, ptr) {
      let res = {};
      let seen = /* @__PURE__ */ new Set();
      let c;
      let comma = 0;
      ptr++;
      while ((c = str[ptr++]) !== "}" && c) {
        if (c === "\n") {
          throw new error_js_1.TomlError(
            "newlines are not allowed in inline tables",
            {
              toml: str,
              ptr: ptr - 1,
            },
          );
        } else if (c === "#") {
          throw new error_js_1.TomlError(
            "inline tables cannot contain comments",
            {
              toml: str,
              ptr: ptr - 1,
            },
          );
        } else if (c === ",") {
          throw new error_js_1.TomlError("expected key-value, found comma", {
            toml: str,
            ptr: ptr - 1,
          });
        } else if (c !== " " && c !== "	") {
          let k;
          let t = res;
          let hasOwn = false;
          let [key, keyEndPtr] = parseKey(str, ptr - 1);
          for (let i = 0; i < key.length; i++) {
            if (i) t = hasOwn ? t[k] : (t[k] = {});
            k = key[i];
            if (
              (hasOwn = Object.hasOwn(t, k)) &&
              (typeof t[k] !== "object" || seen.has(t[k]))
            ) {
              throw new error_js_1.TomlError(
                "trying to redefine an already defined value",
                {
                  toml: str,
                  ptr,
                },
              );
            }
            if (!hasOwn && k === "__proto__") {
              Object.defineProperty(t, k, {
                enumerable: true,
                configurable: true,
                writable: true,
              });
            }
          }
          if (hasOwn) {
            throw new error_js_1.TomlError(
              "trying to redefine an already defined value",
              {
                toml: str,
                ptr,
              },
            );
          }
          let [value, valueEndPtr] = (0, extract_js_1.extractValue)(
            str,
            keyEndPtr,
            "}",
          );
          seen.add(value);
          t[k] = value;
          ptr = valueEndPtr;
          comma = str[ptr - 1] === "," ? ptr - 1 : 0;
        }
      }
      if (comma) {
        throw new error_js_1.TomlError(
          "trailing commas are not allowed in inline tables",
          {
            toml: str,
            ptr: comma,
          },
        );
      }
      if (!c) {
        throw new error_js_1.TomlError("unfinished table encountered", {
          toml: str,
          ptr,
        });
      }
      return [res, ptr];
    }
    exports2.parseInlineTable = parseInlineTable;
    function parseArray(str, ptr) {
      let res = [];
      let c;
      ptr++;
      while ((c = str[ptr++]) !== "]" && c) {
        if (c === ",") {
          throw new error_js_1.TomlError("expected value, found comma", {
            toml: str,
            ptr: ptr - 1,
          });
        } else if (c === "#") ptr = (0, util_js_1.skipComment)(str, ptr);
        else if (c !== " " && c !== "	" && c !== "\n" && c !== "\r") {
          let e = (0, extract_js_1.extractValue)(str, ptr - 1, "]");
          res.push(e[0]);
          ptr = e[1];
        }
      }
      if (!c) {
        throw new error_js_1.TomlError("unfinished array encountered", {
          toml: str,
          ptr,
        });
      }
      return [res, ptr];
    }
    exports2.parseArray = parseArray;
  },
});

// node_modules/smol-toml/dist/parse.js
var require_parse = __commonJS({
  "node_modules/smol-toml/dist/parse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parse = void 0;
    var struct_js_1 = require_struct();
    var extract_js_1 = require_extract();
    var util_js_1 = require_util();
    var error_js_1 = require_error2();
    function peekTable(key, table, meta, type) {
      let t = table;
      let m = meta;
      let k;
      let hasOwn = false;
      let state;
      for (let i = 0; i < key.length; i++) {
        if (i) {
          t = hasOwn ? t[k] : (t[k] = {});
          m = (state = m[k]).c;
          if (type === 0 && (state.t === 1 || state.t === 2)) {
            return null;
          }
          if (state.t === 2) {
            let l = t.length - 1;
            t = t[l];
            m = m[l].c;
          }
        }
        k = key[i];
        if ((hasOwn = Object.hasOwn(t, k)) && m[k]?.t === 0 && m[k]?.d) {
          return null;
        }
        if (!hasOwn) {
          if (k === "__proto__") {
            Object.defineProperty(t, k, {
              enumerable: true,
              configurable: true,
              writable: true,
            });
            Object.defineProperty(m, k, {
              enumerable: true,
              configurable: true,
              writable: true,
            });
          }
          m[k] = {
            t: i < key.length - 1 && type === 2 ? 3 : type,
            d: false,
            i: 0,
            c: {},
          };
        }
      }
      state = m[k];
      if (state.t !== type && !(type === 1 && state.t === 3)) {
        return null;
      }
      if (type === 2) {
        if (!state.d) {
          state.d = true;
          t[k] = [];
        }
        t[k].push((t = {}));
        state.c[state.i++] = state = { t: 1, d: false, i: 0, c: {} };
      }
      if (state.d) {
        return null;
      }
      state.d = true;
      if (type === 1) {
        t = hasOwn ? t[k] : (t[k] = {});
      } else if (type === 0 && hasOwn) {
        return null;
      }
      return [k, t, state.c];
    }
    function parse5(toml) {
      let res = {};
      let meta = {};
      let tbl = res;
      let m = meta;
      for (let ptr = (0, util_js_1.skipVoid)(toml, 0); ptr < toml.length; ) {
        if (toml[ptr] === "[") {
          let isTableArray = toml[++ptr] === "[";
          let k = (0, struct_js_1.parseKey)(toml, (ptr += +isTableArray), "]");
          if (isTableArray) {
            if (toml[k[1] - 1] !== "]") {
              throw new error_js_1.TomlError(
                "expected end of table declaration",
                {
                  toml,
                  ptr: k[1] - 1,
                },
              );
            }
            k[1]++;
          }
          let p = peekTable(
            k[0],
            res,
            meta,
            isTableArray ? 2 : 1,
            /* Type.EXPLICIT */
          );
          if (!p) {
            throw new error_js_1.TomlError(
              "trying to redefine an already defined table or value",
              {
                toml,
                ptr,
              },
            );
          }
          m = p[2];
          tbl = p[1];
          ptr = k[1];
        } else {
          let k = (0, struct_js_1.parseKey)(toml, ptr);
          let p = peekTable(
            k[0],
            tbl,
            m,
            0,
            /* Type.DOTTED */
          );
          if (!p) {
            throw new error_js_1.TomlError(
              "trying to redefine an already defined table or value",
              {
                toml,
                ptr,
              },
            );
          }
          let v = (0, extract_js_1.extractValue)(toml, k[1]);
          p[1][p[0]] = v[0];
          ptr = v[1];
        }
        ptr = (0, util_js_1.skipVoid)(toml, ptr, true);
        if (toml[ptr] && toml[ptr] !== "\n" && toml[ptr] !== "\r") {
          throw new error_js_1.TomlError(
            "each key-value declaration must be followed by an end-of-line",
            {
              toml,
              ptr,
            },
          );
        }
        ptr = (0, util_js_1.skipVoid)(toml, ptr);
      }
      return res;
    }
    exports2.parse = parse5;
  },
});

// node_modules/smol-toml/dist/stringify.js
var require_stringify = __commonJS({
  "node_modules/smol-toml/dist/stringify.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.stringify = void 0;
    var BARE_KEY = /^[a-z0-9-_]+$/i;
    function extendedTypeOf(obj) {
      let type = typeof obj;
      if (type === "object") {
        if (Array.isArray(obj)) return "array";
        if (obj instanceof Date) return "date";
      }
      return type;
    }
    function isArrayOfTables(obj) {
      for (let i = 0; i < obj.length; i++) {
        if (extendedTypeOf(obj[i]) !== "object") return false;
      }
      return obj.length != 0;
    }
    function formatString(s) {
      return JSON.stringify(s).replace(/\x7f/g, "\\u007f");
    }
    function stringifyValue(val, type = extendedTypeOf(val)) {
      if (type === "number") {
        if (isNaN(val)) return "nan";
        if (val === Infinity) return "inf";
        if (val === -Infinity) return "-inf";
        return val.toString();
      }
      if (type === "bigint" || type === "boolean") {
        return val.toString();
      }
      if (type === "string") {
        return formatString(val);
      }
      if (type === "date") {
        if (isNaN(val.getTime())) {
          throw new TypeError("cannot serialize invalid date");
        }
        return val.toISOString();
      }
      if (type === "object") {
        return stringifyInlineTable(val);
      }
      if (type === "array") {
        return stringifyArray(val);
      }
    }
    function stringifyInlineTable(obj) {
      let keys = Object.keys(obj);
      if (keys.length === 0) return "{}";
      let res = "{ ";
      for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        if (i) res += ", ";
        res += BARE_KEY.test(k) ? k : formatString(k);
        res += " = ";
        res += stringifyValue(obj[k]);
      }
      return res + " }";
    }
    function stringifyArray(array) {
      if (array.length === 0) return "[]";
      let res = "[ ";
      for (let i = 0; i < array.length; i++) {
        if (i) res += ", ";
        if (array[i] === null || array[i] === void 0) {
          throw new TypeError("arrays cannot contain null or undefined values");
        }
        res += stringifyValue(array[i]);
      }
      return res + " ]";
    }
    function stringifyArrayTable(array, key) {
      let res = "";
      for (let i = 0; i < array.length; i++) {
        res += `[[${key}]]
`;
        res += stringifyTable(array[i], key);
        res += "\n\n";
      }
      return res;
    }
    function stringifyTable(obj, prefix = "") {
      let preamble = "";
      let tables = "";
      let keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        if (obj[k] !== null && obj[k] !== void 0) {
          let type = extendedTypeOf(obj[k]);
          if (type === "symbol" || type === "function") {
            throw new TypeError(`cannot serialize values of type '${type}'`);
          }
          let key = BARE_KEY.test(k) ? k : formatString(k);
          if (type === "array" && isArrayOfTables(obj[k])) {
            tables += stringifyArrayTable(
              obj[k],
              prefix ? `${prefix}.${key}` : key,
            );
          } else if (type === "object") {
            let tblKey = prefix ? `${prefix}.${key}` : key;
            tables += `[${tblKey}]
`;
            tables += stringifyTable(obj[k], tblKey);
            tables += "\n\n";
          } else {
            preamble += key;
            preamble += " = ";
            preamble += stringifyValue(obj[k], type);
            preamble += "\n";
          }
        }
      }
      return `${preamble}
${tables}`.trim();
    }
    function stringify(obj) {
      if (extendedTypeOf(obj) !== "object") {
        throw new TypeError("stringify can only be called with an object");
      }
      return stringifyTable(obj);
    }
    exports2.stringify = stringify;
  },
});

// node_modules/smol-toml/dist/index.js
var require_dist = __commonJS({
  "node_modules/smol-toml/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.stringify =
      exports2.parse =
      exports2.TomlDate =
      exports2.TomlError =
        void 0;
    var error_js_1 = require_error2();
    Object.defineProperty(exports2, "TomlError", {
      enumerable: true,
      get: function () {
        return error_js_1.TomlError;
      },
    });
    var date_js_1 = require_date();
    Object.defineProperty(exports2, "TomlDate", {
      enumerable: true,
      get: function () {
        return date_js_1.TomlDate;
      },
    });
    var parse_js_1 = require_parse();
    Object.defineProperty(exports2, "parse", {
      enumerable: true,
      get: function () {
        return parse_js_1.parse;
      },
    });
    var stringify_js_1 = require_stringify();
    Object.defineProperty(exports2, "stringify", {
      enumerable: true,
      get: function () {
        return stringify_js_1.stringify;
      },
    });
  },
});

// node_modules/dotenv/config.js
(function () {
  require_main().config(
    Object.assign(
      {},
      require_env_options(),
      require_cli_options()(process.argv),
    ),
  );
})();

// node_modules/@commander-js/extra-typings/esm.mjs
var import_index = __toESM(require_extra_typings(), 1);
var {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  // deprecated old name
  Command,
  Argument,
  Option,
  Help,
} = import_index.default;

// package.json
var version = "0.1.0";

// node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 =
  (offset = 0) =>
  (code) =>
    `\x1B[${code + offset}m`;
var wrapAnsi256 =
  (offset = 0) =>
  (code) =>
    `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m =
  (offset = 0) =>
  (red, green, blue) =>
    `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39],
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49],
  },
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`,
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false,
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false,
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round(((red - 8) / 247) * 24) + 232;
        }
        return (
          16 +
          36 * Math.round((red / 255) * 5) +
          6 * Math.round((green / 255) * 5) +
          Math.round((blue / 255) * 5)
        );
      },
      enumerable: false,
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString]
            .map((character) => character + character)
            .join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise */
          (integer >> 16) & 255,
          (integer >> 8) & 255,
          integer & 255,
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: false,
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false,
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = (remainder % 6) / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result =
          30 +
          ((Math.round(blue) << 2) |
            (Math.round(green) << 1) |
            Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false,
    },
    rgbToAnsi: {
      value: (red, green, blue) =>
        styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false,
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false,
    },
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/index.js
var import_node_process = __toESM(require("node:process"), 1);
var import_node_os = __toESM(require("node:os"), 1);
var import_node_tty = __toESM(require("node:tty"), 1);
function hasFlag(
  flag,
  argv = globalThis.Deno
    ? globalThis.Deno.args
    : import_node_process.default.argv,
) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return (
    position !== -1 &&
    (terminatorPosition === -1 || position < terminatorPosition)
  );
}
var { env } = import_node_process.default;
var flagForceColor;
if (
  hasFlag("no-color") ||
  hasFlag("no-colors") ||
  hasFlag("color=false") ||
  hasFlag("color=never")
) {
  flagForceColor = 0;
} else if (
  hasFlag("color") ||
  hasFlag("colors") ||
  hasFlag("color=true") ||
  hasFlag("color=always")
) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0
      ? 1
      : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3,
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (
      hasFlag("color=16m") ||
      hasFlag("color=full") ||
      hasFlag("color=truecolor")
    ) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (import_node_process.default.platform === "win32") {
    const osRelease = import_node_os.default.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if ("GITHUB_ACTIONS" in env || "GITEA_ACTIONS" in env) {
      return 3;
    }
    if (
      [
        "TRAVIS",
        "CIRCLECI",
        "APPVEYOR",
        "GITLAB_CI",
        "BUILDKITE",
        "DRONE",
      ].some((sign) => sign in env) ||
      env.CI_NAME === "codeship"
    ) {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version2 = Number.parseInt(
      (env.TERM_PROGRAM_VERSION || "").split(".")[0],
      10,
    );
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version2 >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (
    /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)
  ) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream4, options = {}) {
  const level = _supportsColor(stream4, {
    streamIsTTY: stream4 && stream4.isTTY,
    ...options,
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: import_node_tty.default.isatty(1) }),
  stderr: createSupportsColor({ isTTY: import_node_tty.default.isatty(2) }),
};
var supports_color_default = supportsColor;

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue +=
      string.slice(endIndex, gotCR ? index - 1 : index) +
      prefix +
      (gotCR ? "\r\n" : "\n") +
      postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = ["ansi", "ansi", "ansi256", "ansi16m"];
var styles2 = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (
    options.level &&
    !(
      Number.isInteger(options.level) &&
      options.level >= 0 &&
      options.level <= 3
    )
  ) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(
        this,
        createStyler(style.open, style.close, this[STYLER]),
        this[IS_EMPTY],
      );
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    },
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  },
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(
        ansi_styles_default.rgbToAnsi256(...arguments_),
      );
    }
    return ansi_styles_default[type].ansi(
      ansi_styles_default.rgbToAnsi(...arguments_),
    );
  }
  if (model === "hex") {
    return getModelAnsi(
      "rgb",
      level,
      type,
      ...ansi_styles_default.hexToRgb(...arguments_),
    );
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level } = this;
      return function (...arguments_) {
        const styler = createStyler(
          getModelAnsi(model, levelMapping[level], "color", ...arguments_),
          ansi_styles_default.color.close,
          this[STYLER],
        );
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    },
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level } = this;
      return function (...arguments_) {
        const styler = createStyler(
          getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_),
          ansi_styles_default.bgColor.close,
          this[STYLER],
        );
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    },
  };
}
var proto = Object.defineProperties(() => {}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    },
  },
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent,
  };
};
var createBuilder = (self2, _styler, _isEmpty) => {
  const builder = (...arguments_) =>
    applyStyle(
      builder,
      arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "),
    );
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self2;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self2, string) => {
  if (self2.level <= 0 || !string) {
    return self2[IS_EMPTY] ? "" : string;
  }
  let styler = self2[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// node_modules/axios/lib/helpers/bind.js
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// node_modules/axios/lib/utils.js
var { toString } = Object.prototype;
var { getPrototypeOf } = Object;
var kindOf = /* @__PURE__ */ ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
var kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
var typeOfTest = (type) => (thing) => typeof thing === type;
var { isArray } = Array;
var isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return (
    val !== null &&
    !isUndefined(val) &&
    val.constructor !== null &&
    !isUndefined(val.constructor) &&
    isFunction(val.constructor.isBuffer) &&
    val.constructor.isBuffer(val)
  );
}
var isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
var isString = typeOfTest("string");
var isFunction = typeOfTest("function");
var isNumber = typeOfTest("number");
var isObject = (thing) => thing !== null && typeof thing === "object";
var isBoolean = (thing) => thing === true || thing === false;
var isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype3 = getPrototypeOf(val);
  return (
    (prototype3 === null ||
      prototype3 === Object.prototype ||
      Object.getPrototypeOf(prototype3) === null) &&
    !(Symbol.toStringTag in val) &&
    !(Symbol.iterator in val)
  );
};
var isDate = kindOfTest("Date");
var isFile = kindOfTest("File");
var isBlob = kindOfTest("Blob");
var isFileList = kindOfTest("FileList");
var isStream = (val) => isObject(val) && isFunction(val.pipe);
var isFormData = (thing) => {
  let kind;
  return (
    thing &&
    ((typeof FormData === "function" && thing instanceof FormData) ||
      (isFunction(thing.append) &&
        ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
          (kind === "object" &&
            isFunction(thing.toString) &&
            thing.toString() === "[object FormData]"))))
  );
};
var isURLSearchParams = kindOfTest("URLSearchParams");
var [isReadableStream, isRequest, isResponse, isHeaders] = [
  "ReadableStream",
  "Request",
  "Response",
  "Headers",
].map(kindOfTest);
var trim = (str) =>
  str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys
      ? Object.getOwnPropertyNames(obj)
      : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
var _global = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
      ? window
      : global;
})();
var isContextDefined = (context) =>
  !isUndefined(context) && context !== _global;
function merge() {
  const { caseless } = (isContextDefined(this) && this) || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = (caseless && findKey(result, key)) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(
    b,
    (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    },
    { allOwnKeys },
  );
  return a;
};
var stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
var inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(
    superConstructor.prototype,
    descriptors2,
  );
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype,
  });
  props && Object.assign(constructor.prototype, props);
};
var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null) return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (
        (!propFilter || propFilter(prop, sourceObj, destObj)) &&
        !merged[prop]
      ) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (
    sourceObj &&
    (!filter2 || filter2(sourceObj, destObj)) &&
    sourceObj !== Object.prototype
  );
  return destObj;
};
var endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
var toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
var isTypedArray = /* @__PURE__ */ ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
var forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];
  const iterator = generator.call(obj);
  let result;
  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
var matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
var isHTMLForm = kindOfTest("HTMLFormElement");
var toCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    });
};
var hasOwnProperty = (
  ({ hasOwnProperty: hasOwnProperty2 }) =>
  (obj, prop) =>
    hasOwnProperty2.call(obj, prop)
)(Object.prototype);
var isRegExp = kindOfTest("RegExp");
var reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
var freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (
      isFunction(obj) &&
      ["arguments", "caller", "callee"].indexOf(name) !== -1
    ) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value)) return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
var toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString)
    ? define(arrayOrString)
    : define(String(arrayOrString).split(delimiter));
  return obj;
};
var noop = () => {};
var toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite((value = +value))
    ? value
    : defaultValue;
};
var ALPHA = "abcdefghijklmnopqrstuvwxyz";
var DIGIT = "0123456789";
var ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT,
};
var generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "";
  const { length } = alphabet;
  while (size--) {
    str += alphabet[(Math.random() * length) | 0];
  }
  return str;
};
function isSpecCompliantForm(thing) {
  return !!(
    thing &&
    isFunction(thing.append) &&
    thing[Symbol.toStringTag] === "FormData" &&
    thing[Symbol.iterator]
  );
}
var toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
var isAsyncFn = kindOfTest("AsyncFunction");
var isThenable = (thing) =>
  thing &&
  (isObject(thing) || isFunction(thing)) &&
  isFunction(thing.then) &&
  isFunction(thing.catch);
var utils_default = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
};

// node_modules/axios/lib/core/AxiosError.js
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}
utils_default.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils_default.toJSONObject(this.config),
      code: this.code,
      status:
        this.response && this.response.status ? this.response.status : null,
    };
  },
});
var prototype = AxiosError.prototype;
var descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL",
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, "isAxiosError", { value: true });
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);
  utils_default.toFlatObject(
    error,
    axiosError,
    function filter2(obj) {
      return obj !== Error.prototype;
    },
    (prop) => {
      return prop !== "isAxiosError";
    },
  );
  AxiosError.call(axiosError, error.message, code, config, request, response);
  axiosError.cause = error;
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
var AxiosError_default = AxiosError;

// node_modules/axios/lib/platform/node/classes/FormData.js
var import_form_data = __toESM(require_form_data(), 1);
var FormData_default = import_form_data.default;

// node_modules/axios/lib/helpers/toFormData.js
function isVisitable(thing) {
  return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
function removeBrackets(key) {
  return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path3, key, dots) {
  if (!path3) return key;
  return path3
    .concat(key)
    .map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    })
    .join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils_default.isArray(arr) && !arr.some(isVisitable);
}
var predicates = utils_default.toFlatObject(
  utils_default,
  {},
  null,
  function filter(prop) {
    return /^is[A-Z]/.test(prop);
  },
);
function toFormData(obj, formData, options) {
  if (!utils_default.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new (FormData_default || FormData)();
  options = utils_default.toFlatObject(
    options,
    {
      metaTokens: true,
      dots: false,
      indexes: false,
    },
    false,
    function defined(option, source) {
      return !utils_default.isUndefined(source[option]);
    },
  );
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || (typeof Blob !== "undefined" && Blob);
  const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
  if (!utils_default.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null) return "";
    if (utils_default.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils_default.isBlob(value)) {
      throw new AxiosError_default(
        "Blob is not supported. Use a Buffer instead.",
      );
    }
    if (
      utils_default.isArrayBuffer(value) ||
      utils_default.isTypedArray(value)
    ) {
      return useBlob && typeof Blob === "function"
        ? new Blob([value])
        : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path3) {
    let arr = value;
    if (value && !path3 && typeof value === "object") {
      if (utils_default.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (
        (utils_default.isArray(value) && isFlatArray(value)) ||
        ((utils_default.isFileList(value) ||
          utils_default.endsWith(key, "[]")) &&
          (arr = utils_default.toArray(value)))
      ) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils_default.isUndefined(el) || el === null) &&
            formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true
                ? renderKey([key], index, dots)
                : indexes === null
                  ? key
                  : key + "[]",
              convertValue(el),
            );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path3, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable,
  });
  function build(value, path3) {
    if (utils_default.isUndefined(value)) return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path3.join("."));
    }
    stack.push(value);
    utils_default.forEach(value, function each(el, key) {
      const result =
        !(utils_default.isUndefined(el) || el === null) &&
        visitor.call(
          formData,
          el,
          utils_default.isString(key) ? key.trim() : key,
          path3,
          exposedHelpers,
        );
      if (result === true) {
        build(el, path3 ? path3.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils_default.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
var toFormData_default = toFormData;

// node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function encode(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0",
  };
  return encodeURIComponent(str).replace(
    /[!'()~]|%20|%00/g,
    function replacer(match) {
      return charMap[match];
    },
  );
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData_default(params, this, options);
}
var prototype2 = AxiosURLSearchParams.prototype;
prototype2.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype2.toString = function toString2(encoder) {
  const _encode = encoder
    ? function (value) {
        return encoder.call(this, value, encode);
      }
    : encode;
  return this._pairs
    .map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "")
    .join("&");
};
var AxiosURLSearchParams_default = AxiosURLSearchParams;

// node_modules/axios/lib/helpers/buildURL.js
function encode2(val) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}
function buildURL(url2, params, options) {
  if (!params) {
    return url2;
  }
  const _encode = (options && options.encode) || encode2;
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils_default.isURLSearchParams(params)
      ? params.toString()
      : new AxiosURLSearchParams_default(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url2.indexOf("#");
    if (hashmarkIndex !== -1) {
      url2 = url2.slice(0, hashmarkIndex);
    }
    url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url2;
}

// node_modules/axios/lib/core/InterceptorManager.js
var InterceptorManager = class {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null,
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils_default.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
};
var InterceptorManager_default = InterceptorManager;

// node_modules/axios/lib/defaults/transitional.js
var transitional_default = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false,
};

// node_modules/axios/lib/platform/node/classes/URLSearchParams.js
var import_url = __toESM(require("url"), 1);
var URLSearchParams_default = import_url.default.URLSearchParams;

// node_modules/axios/lib/platform/node/index.js
var node_default = {
  isNode: true,
  classes: {
    URLSearchParams: URLSearchParams_default,
    FormData: FormData_default,
    Blob: (typeof Blob !== "undefined" && Blob) || null,
  },
  protocols: ["http", "https", "file", "data"],
};

// node_modules/axios/lib/platform/common/utils.js
var utils_exports = {};
__export(utils_exports, {
  hasBrowserEnv: () => hasBrowserEnv,
  hasStandardBrowserEnv: () => hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
  origin: () => origin,
});
var hasBrowserEnv =
  typeof window !== "undefined" && typeof document !== "undefined";
var hasStandardBrowserEnv = ((product) => {
  return (
    hasBrowserEnv && ["ReactNative", "NativeScript", "NS"].indexOf(product) < 0
  );
})(typeof navigator !== "undefined" && navigator.product);
var hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === "function"
  );
})();
var origin = (hasBrowserEnv && window.location.href) || "http://localhost";

// node_modules/axios/lib/platform/index.js
var platform_default = {
  ...utils_exports,
  ...node_default,
};

// node_modules/axios/lib/helpers/toURLEncodedForm.js
function toURLEncodedForm(data, options) {
  return toFormData_default(
    data,
    new platform_default.classes.URLSearchParams(),
    Object.assign(
      {
        visitor: function (value, key, path3, helpers) {
          if (platform_default.isNode && utils_default.isBuffer(value)) {
            this.append(key, value.toString("base64"));
            return false;
          }
          return helpers.defaultVisitor.apply(this, arguments);
        },
      },
      options,
    ),
  );
}

// node_modules/axios/lib/helpers/formDataToJSON.js
function parsePropPath(name) {
  return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path3, value, target, index) {
    let name = path3[index++];
    if (name === "__proto__") return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path3.length;
    name = !name && utils_default.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils_default.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils_default.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path3, value, target[name], index);
    if (result && utils_default.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (
    utils_default.isFormData(formData) &&
    utils_default.isFunction(formData.entries)
  ) {
    const obj = {};
    utils_default.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
var formDataToJSON_default = formDataToJSON;

// node_modules/axios/lib/defaults/index.js
function stringifySafely(rawValue, parser, encoder) {
  if (utils_default.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils_default.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
var defaults = {
  transitional: transitional_default,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils_default.isObject(data);
      if (isObjectPayload && utils_default.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils_default.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType
          ? JSON.stringify(formDataToJSON_default(data))
          : data;
      }
      if (
        utils_default.isArrayBuffer(data) ||
        utils_default.isBuffer(data) ||
        utils_default.isStream(data) ||
        utils_default.isFile(data) ||
        utils_default.isBlob(data) ||
        utils_default.isReadableStream(data)
      ) {
        return data;
      }
      if (utils_default.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils_default.isURLSearchParams(data)) {
        headers.setContentType(
          "application/x-www-form-urlencoded;charset=utf-8",
          false,
        );
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if (
          (isFileList2 = utils_default.isFileList(data)) ||
          contentType.indexOf("multipart/form-data") > -1
        ) {
          const _FormData = this.env && this.env.FormData;
          return toFormData_default(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer,
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    },
  ],
  transformResponse: [
    function transformResponse(data) {
      const transitional2 = this.transitional || defaults.transitional;
      const forcedJSONParsing =
        transitional2 && transitional2.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (
        utils_default.isResponse(data) ||
        utils_default.isReadableStream(data)
      ) {
        return data;
      }
      if (
        data &&
        utils_default.isString(data) &&
        ((forcedJSONParsing && !this.responseType) || JSONRequested)
      ) {
        const silentJSONParsing =
          transitional2 && transitional2.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError_default.from(
                e,
                AxiosError_default.ERR_BAD_RESPONSE,
                this,
                null,
                this.response,
              );
            }
            throw e;
          }
        }
      }
      return data;
    },
  ],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform_default.classes.FormData,
    Blob: platform_default.classes.Blob,
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0,
    },
  },
};
utils_default.forEach(
  ["delete", "get", "head", "post", "put", "patch"],
  (method) => {
    defaults.headers[method] = {};
  },
);
var defaults_default = defaults;

// node_modules/axios/lib/helpers/parseHeaders.js
var ignoreDuplicateOf = utils_default.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent",
]);
var parseHeaders_default = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders &&
    rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
  return parsed;
};

// node_modules/axios/lib/core/AxiosHeaders.js
var $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils_default.isArray(value)
    ? value.map(normalizeValue)
    : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
var isValidHeaderName = (str) =>
  /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils_default.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils_default.isString(value)) return;
  if (utils_default.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils_default.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}
function buildAccessors(obj, header) {
  const accessorName = utils_default.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function (arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true,
    });
  });
}
var AxiosHeaders = class {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils_default.findKey(self2, lHeader);
      if (
        !key ||
        self2[key] === void 0 ||
        _rewrite === true ||
        (_rewrite === void 0 && self2[key] !== false)
      ) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) =>
      utils_default.forEach(headers, (_value, _header) =>
        setHeader(_value, _header, _rewrite),
      );
    if (
      utils_default.isPlainObject(header) ||
      header instanceof this.constructor
    ) {
      setHeaders(header, valueOrRewrite);
    } else if (
      utils_default.isString(header) &&
      (header = header.trim()) &&
      !isValidHeaderName(header)
    ) {
      setHeaders(parseHeaders_default(header), valueOrRewrite);
    } else if (utils_default.isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils_default.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils_default.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      return !!(
        key &&
        this[key] !== void 0 &&
        (!matcher || matchHeaderValue(this, this[key], key, matcher))
      );
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils_default.findKey(self2, _header);
        if (
          key &&
          (!matcher || matchHeaderValue(self2, self2[key], key, matcher))
        ) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils_default.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils_default.forEach(this, (value, header) => {
      const key = utils_default.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils_default.forEach(this, (value, header) => {
      value != null &&
        value !== false &&
        (obj[header] =
          asStrings && utils_default.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON())
      .map(([header, value]) => header + ": " + value)
      .join("\n");
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals =
      (this[$internals] =
      this[$internals] =
        {
          accessors: {},
        });
    const accessors = internals.accessors;
    const prototype3 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype3, _header);
        accessors[lHeader] = true;
      }
    }
    utils_default.isArray(header)
      ? header.forEach(defineAccessor)
      : defineAccessor(header);
    return this;
  }
};
AxiosHeaders.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization",
]);
utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    },
  };
});
utils_default.freezeMethods(AxiosHeaders);
var AxiosHeaders_default = AxiosHeaders;

// node_modules/axios/lib/core/transformData.js
function transformData(fns, response) {
  const config = this || defaults_default;
  const context = response || config;
  const headers = AxiosHeaders_default.from(context.headers);
  let data = context.data;
  utils_default.forEach(fns, function transform(fn) {
    data = fn.call(
      config,
      data,
      headers.normalize(),
      response ? response.status : void 0,
    );
  });
  headers.normalize();
  return data;
}

// node_modules/axios/lib/cancel/isCancel.js
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

// node_modules/axios/lib/cancel/CanceledError.js
function CanceledError(message, config, request) {
  AxiosError_default.call(
    this,
    message == null ? "canceled" : message,
    AxiosError_default.ERR_CANCELED,
    config,
    request,
  );
  this.name = "CanceledError";
}
utils_default.inherits(CanceledError, AxiosError_default, {
  __CANCEL__: true,
});
var CanceledError_default = CanceledError;

// node_modules/axios/lib/core/settle.js
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (
    !response.status ||
    !validateStatus2 ||
    validateStatus2(response.status)
  ) {
    resolve(response);
  } else {
    reject(
      new AxiosError_default(
        "Request failed with status code " + response.status,
        [
          AxiosError_default.ERR_BAD_REQUEST,
          AxiosError_default.ERR_BAD_RESPONSE,
        ][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response,
      ),
    );
  }
}

// node_modules/axios/lib/helpers/isAbsoluteURL.js
function isAbsoluteURL(url2) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url2);
}

// node_modules/axios/lib/helpers/combineURLs.js
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "")
    : baseURL;
}

// node_modules/axios/lib/core/buildFullPath.js
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

// node_modules/axios/lib/adapters/http.js
var import_proxy_from_env = __toESM(require_proxy_from_env(), 1);
var import_http = __toESM(require("http"), 1);
var import_https = __toESM(require("https"), 1);
var import_util2 = __toESM(require("util"), 1);
var import_follow_redirects = __toESM(require_follow_redirects(), 1);
var import_zlib = __toESM(require("zlib"), 1);

// node_modules/axios/lib/env/data.js
var VERSION = "1.7.2";

// node_modules/axios/lib/helpers/parseProtocol.js
function parseProtocol(url2) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url2);
  return (match && match[1]) || "";
}

// node_modules/axios/lib/helpers/fromDataURI.js
var DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
function fromDataURI(uri, asBlob, options) {
  const _Blob = (options && options.Blob) || platform_default.classes.Blob;
  const protocol = parseProtocol(uri);
  if (asBlob === void 0 && _Blob) {
    asBlob = true;
  }
  if (protocol === "data") {
    uri = protocol.length ? uri.slice(protocol.length + 1) : uri;
    const match = DATA_URL_PATTERN.exec(uri);
    if (!match) {
      throw new AxiosError_default(
        "Invalid URL",
        AxiosError_default.ERR_INVALID_URL,
      );
    }
    const mime = match[1];
    const isBase64 = match[2];
    const body = match[3];
    const buffer = Buffer.from(
      decodeURIComponent(body),
      isBase64 ? "base64" : "utf8",
    );
    if (asBlob) {
      if (!_Blob) {
        throw new AxiosError_default(
          "Blob is not supported",
          AxiosError_default.ERR_NOT_SUPPORT,
        );
      }
      return new _Blob([buffer], { type: mime });
    }
    return buffer;
  }
  throw new AxiosError_default(
    "Unsupported protocol " + protocol,
    AxiosError_default.ERR_NOT_SUPPORT,
  );
}

// node_modules/axios/lib/adapters/http.js
var import_stream4 = __toESM(require("stream"), 1);

// node_modules/axios/lib/helpers/AxiosTransformStream.js
var import_stream = __toESM(require("stream"), 1);

// node_modules/axios/lib/helpers/throttle.js
function throttle(fn, freq) {
  let timestamp = 0;
  const threshold = 1e3 / freq;
  let timer = null;
  return function throttled() {
    const force = this === true;
    const now = Date.now();
    if (force || now - timestamp > threshold) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timestamp = now;
      return fn.apply(null, arguments);
    }
    if (!timer) {
      timer = setTimeout(
        () => {
          timer = null;
          timestamp = Date.now();
          return fn.apply(null, arguments);
        },
        threshold - (now - timestamp),
      );
    }
  };
}
var throttle_default = throttle;

// node_modules/axios/lib/helpers/speedometer.js
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round((bytesCount * 1e3) / passed) : void 0;
  };
}
var speedometer_default = speedometer;

// node_modules/axios/lib/helpers/AxiosTransformStream.js
var kInternals = Symbol("internals");
var AxiosTransformStream = class extends import_stream.default.Transform {
  constructor(options) {
    options = utils_default.toFlatObject(
      options,
      {
        maxRate: 0,
        chunkSize: 64 * 1024,
        minChunkSize: 100,
        timeWindow: 500,
        ticksRate: 2,
        samplesCount: 15,
      },
      null,
      (prop, source) => {
        return !utils_default.isUndefined(source[prop]);
      },
    );
    super({
      readableHighWaterMark: options.chunkSize,
    });
    const self2 = this;
    const internals = (this[kInternals] = {
      length: options.length,
      timeWindow: options.timeWindow,
      ticksRate: options.ticksRate,
      chunkSize: options.chunkSize,
      maxRate: options.maxRate,
      minChunkSize: options.minChunkSize,
      bytesSeen: 0,
      isCaptured: false,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null,
    });
    const _speedometer = speedometer_default(
      internals.ticksRate * options.samplesCount,
      internals.timeWindow,
    );
    this.on("newListener", (event) => {
      if (event === "progress") {
        if (!internals.isCaptured) {
          internals.isCaptured = true;
        }
      }
    });
    let bytesNotified = 0;
    internals.updateProgress = throttle_default(function throttledHandler() {
      const totalBytes = internals.length;
      const bytesTransferred = internals.bytesSeen;
      const progressBytes = bytesTransferred - bytesNotified;
      if (!progressBytes || self2.destroyed) return;
      const rate = _speedometer(progressBytes);
      bytesNotified = bytesTransferred;
      process.nextTick(() => {
        self2.emit("progress", {
          loaded: bytesTransferred,
          total: totalBytes,
          progress: totalBytes ? bytesTransferred / totalBytes : void 0,
          bytes: progressBytes,
          rate: rate ? rate : void 0,
          estimated:
            rate && totalBytes && bytesTransferred <= totalBytes
              ? (totalBytes - bytesTransferred) / rate
              : void 0,
          lengthComputable: totalBytes != null,
        });
      });
    }, internals.ticksRate);
    const onFinish = () => {
      internals.updateProgress.call(true);
    };
    this.once("end", onFinish);
    this.once("error", onFinish);
  }
  _read(size) {
    const internals = this[kInternals];
    if (internals.onReadCallback) {
      internals.onReadCallback();
    }
    return super._read(size);
  }
  _transform(chunk, encoding, callback) {
    const self2 = this;
    const internals = this[kInternals];
    const maxRate = internals.maxRate;
    const readableHighWaterMark = this.readableHighWaterMark;
    const timeWindow = internals.timeWindow;
    const divider = 1e3 / timeWindow;
    const bytesThreshold = maxRate / divider;
    const minChunkSize =
      internals.minChunkSize !== false
        ? Math.max(internals.minChunkSize, bytesThreshold * 0.01)
        : 0;
    function pushChunk(_chunk, _callback) {
      const bytes = Buffer.byteLength(_chunk);
      internals.bytesSeen += bytes;
      internals.bytes += bytes;
      if (internals.isCaptured) {
        internals.updateProgress();
      }
      if (self2.push(_chunk)) {
        process.nextTick(_callback);
      } else {
        internals.onReadCallback = () => {
          internals.onReadCallback = null;
          process.nextTick(_callback);
        };
      }
    }
    const transformChunk = (_chunk, _callback) => {
      const chunkSize = Buffer.byteLength(_chunk);
      let chunkRemainder = null;
      let maxChunkSize = readableHighWaterMark;
      let bytesLeft;
      let passed = 0;
      if (maxRate) {
        const now = Date.now();
        if (!internals.ts || (passed = now - internals.ts) >= timeWindow) {
          internals.ts = now;
          bytesLeft = bytesThreshold - internals.bytes;
          internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
          passed = 0;
        }
        bytesLeft = bytesThreshold - internals.bytes;
      }
      if (maxRate) {
        if (bytesLeft <= 0) {
          return setTimeout(() => {
            _callback(null, _chunk);
          }, timeWindow - passed);
        }
        if (bytesLeft < maxChunkSize) {
          maxChunkSize = bytesLeft;
        }
      }
      if (
        maxChunkSize &&
        chunkSize > maxChunkSize &&
        chunkSize - maxChunkSize > minChunkSize
      ) {
        chunkRemainder = _chunk.subarray(maxChunkSize);
        _chunk = _chunk.subarray(0, maxChunkSize);
      }
      pushChunk(
        _chunk,
        chunkRemainder
          ? () => {
              process.nextTick(_callback, null, chunkRemainder);
            }
          : _callback,
      );
    };
    transformChunk(chunk, function transformNextChunk(err, _chunk) {
      if (err) {
        return callback(err);
      }
      if (_chunk) {
        transformChunk(_chunk, transformNextChunk);
      } else {
        callback(null);
      }
    });
  }
  setLength(length) {
    this[kInternals].length = +length;
    return this;
  }
};
var AxiosTransformStream_default = AxiosTransformStream;

// node_modules/axios/lib/adapters/http.js
var import_events = require("events");

// node_modules/axios/lib/helpers/formDataToStream.js
var import_util = require("util");
var import_stream2 = require("stream");

// node_modules/axios/lib/helpers/readBlob.js
var { asyncIterator } = Symbol;
var readBlob = async function* (blob) {
  if (blob.stream) {
    yield* blob.stream();
  } else if (blob.arrayBuffer) {
    yield await blob.arrayBuffer();
  } else if (blob[asyncIterator]) {
    yield* blob[asyncIterator]();
  } else {
    yield blob;
  }
};
var readBlob_default = readBlob;

// node_modules/axios/lib/helpers/formDataToStream.js
var BOUNDARY_ALPHABET = utils_default.ALPHABET.ALPHA_DIGIT + "-_";
var textEncoder = new import_util.TextEncoder();
var CRLF = "\r\n";
var CRLF_BYTES = textEncoder.encode(CRLF);
var CRLF_BYTES_COUNT = 2;
var FormDataPart = class {
  constructor(name, value) {
    const { escapeName } = this.constructor;
    const isStringValue = utils_default.isString(value);
    let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${!isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ""}${CRLF}`;
    if (isStringValue) {
      value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
    } else {
      headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
    }
    this.headers = textEncoder.encode(headers + CRLF);
    this.contentLength = isStringValue ? value.byteLength : value.size;
    this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;
    this.name = name;
    this.value = value;
  }
  async *encode() {
    yield this.headers;
    const { value } = this;
    if (utils_default.isTypedArray(value)) {
      yield value;
    } else {
      yield* readBlob_default(value);
    }
    yield CRLF_BYTES;
  }
  static escapeName(name) {
    return String(name).replace(
      /[\r\n"]/g,
      (match) =>
        ({
          "\r": "%0D",
          "\n": "%0A",
          '"': "%22",
        })[match],
    );
  }
};
var formDataToStream = (form, headersHandler, options) => {
  const {
    tag = "form-data-boundary",
    size = 25,
    boundary = tag +
      "-" +
      utils_default.generateString(size, BOUNDARY_ALPHABET),
  } = options || {};
  if (!utils_default.isFormData(form)) {
    throw TypeError("FormData instance required");
  }
  if (boundary.length < 1 || boundary.length > 70) {
    throw Error("boundary must be 10-70 characters long");
  }
  const boundaryBytes = textEncoder.encode("--" + boundary + CRLF);
  const footerBytes = textEncoder.encode("--" + boundary + "--" + CRLF + CRLF);
  let contentLength = footerBytes.byteLength;
  const parts = Array.from(form.entries()).map(([name, value]) => {
    const part = new FormDataPart(name, value);
    contentLength += part.size;
    return part;
  });
  contentLength += boundaryBytes.byteLength * parts.length;
  contentLength = utils_default.toFiniteNumber(contentLength);
  const computedHeaders = {
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
  };
  if (Number.isFinite(contentLength)) {
    computedHeaders["Content-Length"] = contentLength;
  }
  headersHandler && headersHandler(computedHeaders);
  return import_stream2.Readable.from(
    (async function* () {
      for (const part of parts) {
        yield boundaryBytes;
        yield* part.encode();
      }
      yield footerBytes;
    })(),
  );
};
var formDataToStream_default = formDataToStream;

// node_modules/axios/lib/helpers/ZlibHeaderTransformStream.js
var import_stream3 = __toESM(require("stream"), 1);
var ZlibHeaderTransformStream = class extends import_stream3.default.Transform {
  __transform(chunk, encoding, callback) {
    this.push(chunk);
    callback();
  }
  _transform(chunk, encoding, callback) {
    if (chunk.length !== 0) {
      this._transform = this.__transform;
      if (chunk[0] !== 120) {
        const header = Buffer.alloc(2);
        header[0] = 120;
        header[1] = 156;
        this.push(header, encoding);
      }
    }
    this.__transform(chunk, encoding, callback);
  }
};
var ZlibHeaderTransformStream_default = ZlibHeaderTransformStream;

// node_modules/axios/lib/helpers/callbackify.js
var callbackify = (fn, reducer) => {
  return utils_default.isAsyncFn(fn)
    ? function (...args) {
        const cb = args.pop();
        fn.apply(this, args).then((value) => {
          try {
            reducer ? cb(null, ...reducer(value)) : cb(null, value);
          } catch (err) {
            cb(err);
          }
        }, cb);
      }
    : fn;
};
var callbackify_default = callbackify;

// node_modules/axios/lib/adapters/http.js
var zlibOptions = {
  flush: import_zlib.default.constants.Z_SYNC_FLUSH,
  finishFlush: import_zlib.default.constants.Z_SYNC_FLUSH,
};
var brotliOptions = {
  flush: import_zlib.default.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: import_zlib.default.constants.BROTLI_OPERATION_FLUSH,
};
var isBrotliSupported = utils_default.isFunction(
  import_zlib.default.createBrotliDecompress,
);
var { http: httpFollow, https: httpsFollow } = import_follow_redirects.default;
var isHttps = /https:?/;
var supportedProtocols = platform_default.protocols.map((protocol) => {
  return protocol + ":";
});
function dispatchBeforeRedirect(options, responseDetails) {
  if (options.beforeRedirects.proxy) {
    options.beforeRedirects.proxy(options);
  }
  if (options.beforeRedirects.config) {
    options.beforeRedirects.config(options, responseDetails);
  }
}
function setProxy(options, configProxy, location) {
  let proxy = configProxy;
  if (!proxy && proxy !== false) {
    const proxyUrl = (0, import_proxy_from_env.getProxyForUrl)(location);
    if (proxyUrl) {
      proxy = new URL(proxyUrl);
    }
  }
  if (proxy) {
    if (proxy.username) {
      proxy.auth = (proxy.username || "") + ":" + (proxy.password || "");
    }
    if (proxy.auth) {
      if (proxy.auth.username || proxy.auth.password) {
        proxy.auth =
          (proxy.auth.username || "") + ":" + (proxy.auth.password || "");
      }
      const base64 = Buffer.from(proxy.auth, "utf8").toString("base64");
      options.headers["Proxy-Authorization"] = "Basic " + base64;
    }
    options.headers.host =
      options.hostname + (options.port ? ":" + options.port : "");
    const proxyHost = proxy.hostname || proxy.host;
    options.hostname = proxyHost;
    options.host = proxyHost;
    options.port = proxy.port;
    options.path = location;
    if (proxy.protocol) {
      options.protocol = proxy.protocol.includes(":")
        ? proxy.protocol
        : `${proxy.protocol}:`;
    }
  }
  options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
    setProxy(redirectOptions, configProxy, redirectOptions.href);
  };
}
var isHttpAdapterSupported =
  typeof process !== "undefined" && utils_default.kindOf(process) === "process";
var wrapAsync = (asyncExecutor) => {
  return new Promise((resolve, reject) => {
    let onDone;
    let isDone;
    const done = (value, isRejected) => {
      if (isDone) return;
      isDone = true;
      onDone && onDone(value, isRejected);
    };
    const _resolve = (value) => {
      done(value);
      resolve(value);
    };
    const _reject = (reason) => {
      done(reason, true);
      reject(reason);
    };
    asyncExecutor(
      _resolve,
      _reject,
      (onDoneHandler) => (onDone = onDoneHandler),
    ).catch(_reject);
  });
};
var resolveFamily = ({ address, family }) => {
  if (!utils_default.isString(address)) {
    throw TypeError("address must be a string");
  }
  return {
    address,
    family: family || (address.indexOf(".") < 0 ? 6 : 4),
  };
};
var buildAddressEntry = (address, family) =>
  resolveFamily(
    utils_default.isObject(address) ? address : { address, family },
  );
var http_default =
  isHttpAdapterSupported &&
  function httpAdapter(config) {
    return wrapAsync(
      async function dispatchHttpRequest(resolve, reject, onDone) {
        let { data, lookup, family } = config;
        const { responseType, responseEncoding } = config;
        const method = config.method.toUpperCase();
        let isDone;
        let rejected = false;
        let req;
        if (lookup) {
          const _lookup = callbackify_default(lookup, (value) =>
            utils_default.isArray(value) ? value : [value],
          );
          lookup = (hostname, opt, cb) => {
            _lookup(hostname, opt, (err, arg0, arg1) => {
              if (err) {
                return cb(err);
              }
              const addresses = utils_default.isArray(arg0)
                ? arg0.map((addr) => buildAddressEntry(addr))
                : [buildAddressEntry(arg0, arg1)];
              opt.all
                ? cb(err, addresses)
                : cb(err, addresses[0].address, addresses[0].family);
            });
          };
        }
        const emitter = new import_events.EventEmitter();
        const onFinished = () => {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(abort);
          }
          if (config.signal) {
            config.signal.removeEventListener("abort", abort);
          }
          emitter.removeAllListeners();
        };
        onDone((value, isRejected) => {
          isDone = true;
          if (isRejected) {
            rejected = true;
            onFinished();
          }
        });
        function abort(reason) {
          emitter.emit(
            "abort",
            !reason || reason.type
              ? new CanceledError_default(null, config, req)
              : reason,
          );
        }
        emitter.once("abort", reject);
        if (config.cancelToken || config.signal) {
          config.cancelToken && config.cancelToken.subscribe(abort);
          if (config.signal) {
            config.signal.aborted
              ? abort()
              : config.signal.addEventListener("abort", abort);
          }
        }
        const fullPath = buildFullPath(config.baseURL, config.url);
        const parsed = new URL(fullPath, "http://localhost");
        const protocol = parsed.protocol || supportedProtocols[0];
        if (protocol === "data:") {
          let convertedData;
          if (method !== "GET") {
            return settle(resolve, reject, {
              status: 405,
              statusText: "method not allowed",
              headers: {},
              config,
            });
          }
          try {
            convertedData = fromDataURI(config.url, responseType === "blob", {
              Blob: config.env && config.env.Blob,
            });
          } catch (err) {
            throw AxiosError_default.from(
              err,
              AxiosError_default.ERR_BAD_REQUEST,
              config,
            );
          }
          if (responseType === "text") {
            convertedData = convertedData.toString(responseEncoding);
            if (!responseEncoding || responseEncoding === "utf8") {
              convertedData = utils_default.stripBOM(convertedData);
            }
          } else if (responseType === "stream") {
            convertedData = import_stream4.default.Readable.from(convertedData);
          }
          return settle(resolve, reject, {
            data: convertedData,
            status: 200,
            statusText: "OK",
            headers: new AxiosHeaders_default(),
            config,
          });
        }
        if (supportedProtocols.indexOf(protocol) === -1) {
          return reject(
            new AxiosError_default(
              "Unsupported protocol " + protocol,
              AxiosError_default.ERR_BAD_REQUEST,
              config,
            ),
          );
        }
        const headers = AxiosHeaders_default.from(config.headers).normalize();
        headers.set("User-Agent", "axios/" + VERSION, false);
        const onDownloadProgress = config.onDownloadProgress;
        const onUploadProgress = config.onUploadProgress;
        const maxRate = config.maxRate;
        let maxUploadRate = void 0;
        let maxDownloadRate = void 0;
        if (utils_default.isSpecCompliantForm(data)) {
          const userBoundary = headers.getContentType(
            /boundary=([-_\w\d]{10,70})/i,
          );
          data = formDataToStream_default(
            data,
            (formHeaders) => {
              headers.set(formHeaders);
            },
            {
              tag: `axios-${VERSION}-boundary`,
              boundary: (userBoundary && userBoundary[1]) || void 0,
            },
          );
        } else if (
          utils_default.isFormData(data) &&
          utils_default.isFunction(data.getHeaders)
        ) {
          headers.set(data.getHeaders());
          if (!headers.hasContentLength()) {
            try {
              const knownLength = await import_util2.default
                .promisify(data.getLength)
                .call(data);
              Number.isFinite(knownLength) &&
                knownLength >= 0 &&
                headers.setContentLength(knownLength);
            } catch (e) {}
          }
        } else if (utils_default.isBlob(data)) {
          data.size &&
            headers.setContentType(data.type || "application/octet-stream");
          headers.setContentLength(data.size || 0);
          data = import_stream4.default.Readable.from(readBlob_default(data));
        } else if (data && !utils_default.isStream(data)) {
          if (Buffer.isBuffer(data)) {
          } else if (utils_default.isArrayBuffer(data)) {
            data = Buffer.from(new Uint8Array(data));
          } else if (utils_default.isString(data)) {
            data = Buffer.from(data, "utf-8");
          } else {
            return reject(
              new AxiosError_default(
                "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
                AxiosError_default.ERR_BAD_REQUEST,
                config,
              ),
            );
          }
          headers.setContentLength(data.length, false);
          if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
            return reject(
              new AxiosError_default(
                "Request body larger than maxBodyLength limit",
                AxiosError_default.ERR_BAD_REQUEST,
                config,
              ),
            );
          }
        }
        const contentLength = utils_default.toFiniteNumber(
          headers.getContentLength(),
        );
        if (utils_default.isArray(maxRate)) {
          maxUploadRate = maxRate[0];
          maxDownloadRate = maxRate[1];
        } else {
          maxUploadRate = maxDownloadRate = maxRate;
        }
        if (data && (onUploadProgress || maxUploadRate)) {
          if (!utils_default.isStream(data)) {
            data = import_stream4.default.Readable.from(data, {
              objectMode: false,
            });
          }
          data = import_stream4.default.pipeline(
            [
              data,
              new AxiosTransformStream_default({
                length: contentLength,
                maxRate: utils_default.toFiniteNumber(maxUploadRate),
              }),
            ],
            utils_default.noop,
          );
          onUploadProgress &&
            data.on("progress", (progress) => {
              onUploadProgress(
                Object.assign(progress, {
                  upload: true,
                }),
              );
            });
        }
        let auth = void 0;
        if (config.auth) {
          const username = config.auth.username || "";
          const password = config.auth.password || "";
          auth = username + ":" + password;
        }
        if (!auth && parsed.username) {
          const urlUsername = parsed.username;
          const urlPassword = parsed.password;
          auth = urlUsername + ":" + urlPassword;
        }
        auth && headers.delete("authorization");
        let path3;
        try {
          path3 = buildURL(
            parsed.pathname + parsed.search,
            config.params,
            config.paramsSerializer,
          ).replace(/^\?/, "");
        } catch (err) {
          const customErr = new Error(err.message);
          customErr.config = config;
          customErr.url = config.url;
          customErr.exists = true;
          return reject(customErr);
        }
        headers.set(
          "Accept-Encoding",
          "gzip, compress, deflate" + (isBrotliSupported ? ", br" : ""),
          false,
        );
        const options = {
          path: path3,
          method,
          headers: headers.toJSON(),
          agents: { http: config.httpAgent, https: config.httpsAgent },
          auth,
          protocol,
          family,
          beforeRedirect: dispatchBeforeRedirect,
          beforeRedirects: {},
        };
        !utils_default.isUndefined(lookup) && (options.lookup = lookup);
        if (config.socketPath) {
          options.socketPath = config.socketPath;
        } else {
          options.hostname = parsed.hostname;
          options.port = parsed.port;
          setProxy(
            options,
            config.proxy,
            protocol +
              "//" +
              parsed.hostname +
              (parsed.port ? ":" + parsed.port : "") +
              options.path,
          );
        }
        let transport;
        const isHttpsRequest = isHttps.test(options.protocol);
        options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
        if (config.transport) {
          transport = config.transport;
        } else if (config.maxRedirects === 0) {
          transport = isHttpsRequest
            ? import_https.default
            : import_http.default;
        } else {
          if (config.maxRedirects) {
            options.maxRedirects = config.maxRedirects;
          }
          if (config.beforeRedirect) {
            options.beforeRedirects.config = config.beforeRedirect;
          }
          transport = isHttpsRequest ? httpsFollow : httpFollow;
        }
        if (config.maxBodyLength > -1) {
          options.maxBodyLength = config.maxBodyLength;
        } else {
          options.maxBodyLength = Infinity;
        }
        if (config.insecureHTTPParser) {
          options.insecureHTTPParser = config.insecureHTTPParser;
        }
        req = transport.request(options, function handleResponse(res) {
          if (req.destroyed) return;
          const streams = [res];
          const responseLength = +res.headers["content-length"];
          if (onDownloadProgress) {
            const transformStream = new AxiosTransformStream_default({
              length: utils_default.toFiniteNumber(responseLength),
              maxRate: utils_default.toFiniteNumber(maxDownloadRate),
            });
            onDownloadProgress &&
              transformStream.on("progress", (progress) => {
                onDownloadProgress(
                  Object.assign(progress, {
                    download: true,
                  }),
                );
              });
            streams.push(transformStream);
          }
          let responseStream = res;
          const lastRequest = res.req || req;
          if (config.decompress !== false && res.headers["content-encoding"]) {
            if (method === "HEAD" || res.statusCode === 204) {
              delete res.headers["content-encoding"];
            }
            switch ((res.headers["content-encoding"] || "").toLowerCase()) {
              case "gzip":
              case "x-gzip":
              case "compress":
              case "x-compress":
                streams.push(import_zlib.default.createUnzip(zlibOptions));
                delete res.headers["content-encoding"];
                break;
              case "deflate":
                streams.push(new ZlibHeaderTransformStream_default());
                streams.push(import_zlib.default.createUnzip(zlibOptions));
                delete res.headers["content-encoding"];
                break;
              case "br":
                if (isBrotliSupported) {
                  streams.push(
                    import_zlib.default.createBrotliDecompress(brotliOptions),
                  );
                  delete res.headers["content-encoding"];
                }
            }
          }
          responseStream =
            streams.length > 1
              ? import_stream4.default.pipeline(streams, utils_default.noop)
              : streams[0];
          const offListeners = import_stream4.default.finished(
            responseStream,
            () => {
              offListeners();
              onFinished();
            },
          );
          const response = {
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: new AxiosHeaders_default(res.headers),
            config,
            request: lastRequest,
          };
          if (responseType === "stream") {
            response.data = responseStream;
            settle(resolve, reject, response);
          } else {
            const responseBuffer = [];
            let totalResponseBytes = 0;
            responseStream.on("data", function handleStreamData(chunk) {
              responseBuffer.push(chunk);
              totalResponseBytes += chunk.length;
              if (
                config.maxContentLength > -1 &&
                totalResponseBytes > config.maxContentLength
              ) {
                rejected = true;
                responseStream.destroy();
                reject(
                  new AxiosError_default(
                    "maxContentLength size of " +
                      config.maxContentLength +
                      " exceeded",
                    AxiosError_default.ERR_BAD_RESPONSE,
                    config,
                    lastRequest,
                  ),
                );
              }
            });
            responseStream.on("aborted", function handlerStreamAborted() {
              if (rejected) {
                return;
              }
              const err = new AxiosError_default(
                "maxContentLength size of " +
                  config.maxContentLength +
                  " exceeded",
                AxiosError_default.ERR_BAD_RESPONSE,
                config,
                lastRequest,
              );
              responseStream.destroy(err);
              reject(err);
            });
            responseStream.on("error", function handleStreamError(err) {
              if (req.destroyed) return;
              reject(AxiosError_default.from(err, null, config, lastRequest));
            });
            responseStream.on("end", function handleStreamEnd() {
              try {
                let responseData =
                  responseBuffer.length === 1
                    ? responseBuffer[0]
                    : Buffer.concat(responseBuffer);
                if (responseType !== "arraybuffer") {
                  responseData = responseData.toString(responseEncoding);
                  if (!responseEncoding || responseEncoding === "utf8") {
                    responseData = utils_default.stripBOM(responseData);
                  }
                }
                response.data = responseData;
              } catch (err) {
                return reject(
                  AxiosError_default.from(
                    err,
                    null,
                    config,
                    response.request,
                    response,
                  ),
                );
              }
              settle(resolve, reject, response);
            });
          }
          emitter.once("abort", (err) => {
            if (!responseStream.destroyed) {
              responseStream.emit("error", err);
              responseStream.destroy();
            }
          });
        });
        emitter.once("abort", (err) => {
          reject(err);
          req.destroy(err);
        });
        req.on("error", function handleRequestError(err) {
          reject(AxiosError_default.from(err, null, config, req));
        });
        req.on("socket", function handleRequestSocket(socket) {
          socket.setKeepAlive(true, 1e3 * 60);
        });
        if (config.timeout) {
          const timeout = parseInt(config.timeout, 10);
          if (Number.isNaN(timeout)) {
            reject(
              new AxiosError_default(
                "error trying to parse `config.timeout` to int",
                AxiosError_default.ERR_BAD_OPTION_VALUE,
                config,
                req,
              ),
            );
            return;
          }
          req.setTimeout(timeout, function handleRequestTimeout() {
            if (isDone) return;
            let timeoutErrorMessage = config.timeout
              ? "timeout of " + config.timeout + "ms exceeded"
              : "timeout exceeded";
            const transitional2 = config.transitional || transitional_default;
            if (config.timeoutErrorMessage) {
              timeoutErrorMessage = config.timeoutErrorMessage;
            }
            reject(
              new AxiosError_default(
                timeoutErrorMessage,
                transitional2.clarifyTimeoutError
                  ? AxiosError_default.ETIMEDOUT
                  : AxiosError_default.ECONNABORTED,
                config,
                req,
              ),
            );
            abort();
          });
        }
        if (utils_default.isStream(data)) {
          let ended = false;
          let errored = false;
          data.on("end", () => {
            ended = true;
          });
          data.once("error", (err) => {
            errored = true;
            req.destroy(err);
          });
          data.on("close", () => {
            if (!ended && !errored) {
              abort(
                new CanceledError_default(
                  "Request stream has been aborted",
                  config,
                  req,
                ),
              );
            }
          });
          data.pipe(req);
        } else {
          req.end(data);
        }
      },
    );
  };

// node_modules/axios/lib/helpers/progressEventReducer.js
var progressEventReducer_default = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer_default(50, 250);
  return throttle_default((e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e,
      lengthComputable: total != null,
    };
    data[isDownloadStream ? "download" : "upload"] = true;
    listener(data);
  }, freq);
};

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv
  ? // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      const msie = /(msie|trident)/i.test(navigator.userAgent);
      const urlParsingNode = document.createElement("a");
      let originURL;
      function resolveURL(url2) {
        let href = url2;
        if (msie) {
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol
            ? urlParsingNode.protocol.replace(/:$/, "")
            : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search
            ? urlParsingNode.search.replace(/^\?/, "")
            : "",
          hash: urlParsingNode.hash
            ? urlParsingNode.hash.replace(/^#/, "")
            : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname:
            urlParsingNode.pathname.charAt(0) === "/"
              ? urlParsingNode.pathname
              : "/" + urlParsingNode.pathname,
        };
      }
      originURL = resolveURL(window.location.href);
      return function isURLSameOrigin(requestURL) {
        const parsed = utils_default.isString(requestURL)
          ? resolveURL(requestURL)
          : requestURL;
        return (
          parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host
        );
      };
    })()
  : // Non standard browser envs (web workers, react-native) lack needed support.
    /* @__PURE__ */ (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })();

// node_modules/axios/lib/helpers/cookies.js
var cookies_default = platform_default.hasStandardBrowserEnv
  ? // Standard browser envs support document.cookie
    {
      write(name, value, expires, path3, domain, secure) {
        const cookie = [name + "=" + encodeURIComponent(value)];
        utils_default.isNumber(expires) &&
          cookie.push("expires=" + new Date(expires).toGMTString());
        utils_default.isString(path3) && cookie.push("path=" + path3);
        utils_default.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
      },
      read(name) {
        const match = document.cookie.match(
          new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"),
        );
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5);
      },
    }
  : // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {},
      read() {
        return null;
      },
      remove() {},
    };

// node_modules/axios/lib/core/mergeConfig.js
var headersToObject = (thing) =>
  thing instanceof AxiosHeaders_default ? { ...thing } : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, caseless) {
    if (
      utils_default.isPlainObject(target) &&
      utils_default.isPlainObject(source)
    ) {
      return utils_default.merge.call({ caseless }, target, source);
    } else if (utils_default.isPlainObject(source)) {
      return utils_default.merge({}, source);
    } else if (utils_default.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, caseless) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) =>
      mergeDeepProperties(headersToObject(a), headersToObject(b), true),
  };
  utils_default.forEach(
    Object.keys(Object.assign({}, config1, config2)),
    function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      (utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys) ||
        (config[prop] = configValue);
    },
  );
  return config;
}

// node_modules/axios/lib/helpers/resolveConfig.js
var resolveConfig_default = (config) => {
  const newConfig = mergeConfig({}, config);
  let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } =
    newConfig;
  newConfig.headers = headers = AxiosHeaders_default.from(headers);
  newConfig.url = buildURL(
    buildFullPath(newConfig.baseURL, newConfig.url),
    config.params,
    config.paramsSerializer,
  );
  if (auth) {
    headers.set(
      "Authorization",
      "Basic " +
        btoa(
          (auth.username || "") +
            ":" +
            (auth.password ? unescape(encodeURIComponent(auth.password)) : ""),
        ),
    );
  }
  let contentType;
  if (utils_default.isFormData(data)) {
    if (
      platform_default.hasStandardBrowserEnv ||
      platform_default.hasStandardBrowserWebWorkerEnv
    ) {
      headers.setContentType(void 0);
    } else if ((contentType = headers.getContentType()) !== false) {
      const [type, ...tokens] = contentType
        ? contentType
            .split(";")
            .map((token) => token.trim())
            .filter(Boolean)
        : [];
      headers.setContentType(
        [type || "multipart/form-data", ...tokens].join("; "),
      );
    }
  }
  if (platform_default.hasStandardBrowserEnv) {
    withXSRFToken &&
      utils_default.isFunction(withXSRFToken) &&
      (withXSRFToken = withXSRFToken(newConfig));
    if (
      withXSRFToken ||
      (withXSRFToken !== false && isURLSameOrigin_default(newConfig.url))
    ) {
      const xsrfValue =
        xsrfHeaderName &&
        xsrfCookieName &&
        cookies_default.read(xsrfCookieName);
      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};

// node_modules/axios/lib/adapters/xhr.js
var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
var xhr_default =
  isXHRAdapterSupported &&
  function (config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig_default(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders_default.from(
        _config.headers,
      ).normalize();
      let { responseType } = _config;
      let onCanceled;
      function done() {
        if (_config.cancelToken) {
          _config.cancelToken.unsubscribe(onCanceled);
        }
        if (_config.signal) {
          _config.signal.removeEventListener("abort", onCanceled);
        }
      }
      let request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders_default.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders(),
        );
        const responseData =
          !responseType || responseType === "text" || responseType === "json"
            ? request.responseText
            : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request,
        };
        settle(
          function _resolve(value) {
            resolve(value);
            done();
          },
          function _reject(err) {
            reject(err);
            done();
          },
          response,
        );
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (
            request.status === 0 &&
            !(request.responseURL && request.responseURL.indexOf("file:") === 0)
          ) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(
          new AxiosError_default(
            "Request aborted",
            AxiosError_default.ECONNABORTED,
            _config,
            request,
          ),
        );
        request = null;
      };
      request.onerror = function handleError() {
        reject(
          new AxiosError_default(
            "Network Error",
            AxiosError_default.ERR_NETWORK,
            _config,
            request,
          ),
        );
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout
          ? "timeout of " + _config.timeout + "ms exceeded"
          : "timeout exceeded";
        const transitional2 = _config.transitional || transitional_default;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(
          new AxiosError_default(
            timeoutErrorMessage,
            transitional2.clarifyTimeoutError
              ? AxiosError_default.ETIMEDOUT
              : AxiosError_default.ECONNABORTED,
            _config,
            request,
          ),
        );
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils_default.forEach(
          requestHeaders.toJSON(),
          function setRequestHeader(val, key) {
            request.setRequestHeader(key, val);
          },
        );
      }
      if (!utils_default.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (typeof _config.onDownloadProgress === "function") {
        request.addEventListener(
          "progress",
          progressEventReducer_default(_config.onDownloadProgress, true),
        );
      }
      if (typeof _config.onUploadProgress === "function" && request.upload) {
        request.upload.addEventListener(
          "progress",
          progressEventReducer_default(_config.onUploadProgress),
        );
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(
            !cancel || cancel.type
              ? new CanceledError_default(null, config, request)
              : cancel,
          );
          request.abort();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted
            ? onCanceled()
            : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
        reject(
          new AxiosError_default(
            "Unsupported protocol " + protocol + ":",
            AxiosError_default.ERR_BAD_REQUEST,
            config,
          ),
        );
        return;
      }
      request.send(requestData || null);
    });
  };

// node_modules/axios/lib/helpers/composeSignals.js
var composeSignals = (signals, timeout) => {
  let controller = new AbortController();
  let aborted;
  const onabort = function (cancel) {
    if (!aborted) {
      aborted = true;
      unsubscribe();
      const err = cancel instanceof Error ? cancel : this.reason;
      controller.abort(
        err instanceof AxiosError_default
          ? err
          : new CanceledError_default(err instanceof Error ? err.message : err),
      );
    }
  };
  let timer =
    timeout &&
    setTimeout(() => {
      onabort(
        new AxiosError_default(
          `timeout ${timeout} of ms exceeded`,
          AxiosError_default.ETIMEDOUT,
        ),
      );
    }, timeout);
  const unsubscribe = () => {
    if (signals) {
      timer && clearTimeout(timer);
      timer = null;
      signals.forEach((signal2) => {
        signal2 &&
          (signal2.removeEventListener
            ? signal2.removeEventListener("abort", onabort)
            : signal2.unsubscribe(onabort));
      });
      signals = null;
    }
  };
  signals.forEach(
    (signal2) =>
      signal2 &&
      signal2.addEventListener &&
      signal2.addEventListener("abort", onabort),
  );
  const { signal } = controller;
  signal.unsubscribe = unsubscribe;
  return [
    signal,
    () => {
      timer && clearTimeout(timer);
      timer = null;
    },
  ];
};
var composeSignals_default = composeSignals;

// node_modules/axios/lib/helpers/trackStream.js
var streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end;
  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};
var readBytes = async function* (iterable, chunkSize, encode3) {
  for await (const chunk of iterable) {
    yield* streamChunk(
      ArrayBuffer.isView(chunk) ? chunk : await encode3(String(chunk)),
      chunkSize,
    );
  }
};
var trackStream = (stream4, chunkSize, onProgress, onFinish, encode3) => {
  const iterator = readBytes(stream4, chunkSize, encode3);
  let bytes = 0;
  return new ReadableStream(
    {
      type: "bytes",
      async pull(controller) {
        const { done, value } = await iterator.next();
        if (done) {
          controller.close();
          onFinish();
          return;
        }
        let len = value.byteLength;
        onProgress && onProgress((bytes += len));
        controller.enqueue(new Uint8Array(value));
      },
      cancel(reason) {
        onFinish(reason);
        return iterator.return();
      },
    },
    {
      highWaterMark: 2,
    },
  );
};

// node_modules/axios/lib/adapters/fetch.js
var fetchProgressDecorator = (total, fn) => {
  const lengthComputable = total != null;
  return (loaded) =>
    setTimeout(() =>
      fn({
        lengthComputable,
        total,
        loaded,
      }),
    );
};
var isFetchSupported =
  typeof fetch === "function" &&
  typeof Request === "function" &&
  typeof Response === "function";
var isReadableStreamSupported =
  isFetchSupported && typeof ReadableStream === "function";
var encodeText =
  isFetchSupported &&
  (typeof TextEncoder === "function"
    ? /* @__PURE__ */ (
        (encoder) => (str) =>
          encoder.encode(str)
      )(new TextEncoder())
    : async (str) => new Uint8Array(await new Response(str).arrayBuffer()));
var supportsRequestStream =
  isReadableStreamSupported &&
  (() => {
    let duplexAccessed = false;
    const hasContentType = new Request(platform_default.origin, {
      body: new ReadableStream(),
      method: "POST",
      get duplex() {
        duplexAccessed = true;
        return "half";
      },
    }).headers.has("Content-Type");
    return duplexAccessed && !hasContentType;
  })();
var DEFAULT_CHUNK_SIZE = 64 * 1024;
var supportsResponseStream =
  isReadableStreamSupported &&
  !!(() => {
    try {
      return utils_default.isReadableStream(new Response("").body);
    } catch (err) {}
  })();
var resolvers = {
  stream: supportsResponseStream && ((res) => res.body),
};
isFetchSupported &&
  ((res) => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
      !resolvers[type] &&
        (resolvers[type] = utils_default.isFunction(res[type])
          ? (res2) => res2[type]()
          : (_, config) => {
              throw new AxiosError_default(
                `Response type '${type}' is not supported`,
                AxiosError_default.ERR_NOT_SUPPORT,
                config,
              );
            });
    });
  })(new Response());
var getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }
  if (utils_default.isBlob(body)) {
    return body.size;
  }
  if (utils_default.isSpecCompliantForm(body)) {
    return (await new Request(body).arrayBuffer()).byteLength;
  }
  if (utils_default.isArrayBufferView(body)) {
    return body.byteLength;
  }
  if (utils_default.isURLSearchParams(body)) {
    body = body + "";
  }
  if (utils_default.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};
var resolveBodyLength = async (headers, body) => {
  const length = utils_default.toFiniteNumber(headers.getContentLength());
  return length == null ? getBodyLength(body) : length;
};
var fetch_default =
  isFetchSupported &&
  (async (config) => {
    let {
      url: url2,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = "same-origin",
      fetchOptions,
    } = resolveConfig_default(config);
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let [composedSignal, stopTimeout] =
      signal || cancelToken || timeout
        ? composeSignals_default([signal, cancelToken], timeout)
        : [];
    let finished, request;
    const onFinish = () => {
      !finished &&
        setTimeout(() => {
          composedSignal && composedSignal.unsubscribe();
        });
      finished = true;
    };
    let requestContentLength;
    try {
      if (
        onUploadProgress &&
        supportsRequestStream &&
        method !== "get" &&
        method !== "head" &&
        (requestContentLength = await resolveBodyLength(headers, data)) !== 0
      ) {
        let _request = new Request(url2, {
          method: "POST",
          body: data,
          duplex: "half",
        });
        let contentTypeHeader;
        if (
          utils_default.isFormData(data) &&
          (contentTypeHeader = _request.headers.get("content-type"))
        ) {
          headers.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          data = trackStream(
            _request.body,
            DEFAULT_CHUNK_SIZE,
            fetchProgressDecorator(
              requestContentLength,
              progressEventReducer_default(onUploadProgress),
            ),
            null,
            encodeText,
          );
        }
      }
      if (!utils_default.isString(withCredentials)) {
        withCredentials = withCredentials ? "cors" : "omit";
      }
      request = new Request(url2, {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        withCredentials,
      });
      let response = await fetch(request);
      const isStreamResponse =
        supportsResponseStream &&
        (responseType === "stream" || responseType === "response");
      if (supportsResponseStream && (onDownloadProgress || isStreamResponse)) {
        const options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        const responseContentLength = utils_default.toFiniteNumber(
          response.headers.get("content-length"),
        );
        response = new Response(
          trackStream(
            response.body,
            DEFAULT_CHUNK_SIZE,
            onDownloadProgress &&
              fetchProgressDecorator(
                responseContentLength,
                progressEventReducer_default(onDownloadProgress, true),
              ),
            isStreamResponse && onFinish,
            encodeText,
          ),
          options,
        );
      }
      responseType = responseType || "text";
      let responseData = await resolvers[
        utils_default.findKey(resolvers, responseType) || "text"
      ](response, config);
      !isStreamResponse && onFinish();
      stopTimeout && stopTimeout();
      return await new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders_default.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request,
        });
      });
    } catch (err) {
      onFinish();
      if (err && err.name === "TypeError" && /fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError_default(
            "Network Error",
            AxiosError_default.ERR_NETWORK,
            config,
            request,
          ),
          {
            cause: err.cause || err,
          },
        );
      }
      throw AxiosError_default.from(err, err && err.code, config, request);
    }
  });

// node_modules/axios/lib/adapters/adapters.js
var knownAdapters = {
  http: http_default,
  xhr: xhr_default,
  fetch: fetch_default,
};
utils_default.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {}
    Object.defineProperty(fn, "adapterName", { value });
  }
});
var renderReason = (reason) => `- ${reason}`;
var isResolvedHandle = (adapter) =>
  utils_default.isFunction(adapter) || adapter === null || adapter === false;
var adapters_default = {
  getAdapter: (adapters) => {
    adapters = utils_default.isArray(adapters) ? adapters : [adapters];
    const { length } = adapters;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError_default(`Unknown adapter '${id}'`);
        }
      }
      if (adapter) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state]) =>
          `adapter ${id} ` +
          (state === false
            ? "is not supported by the environment"
            : "is not available in the build"),
      );
      let s = length
        ? reasons.length > 1
          ? "since :\n" + reasons.map(renderReason).join("\n")
          : " " + renderReason(reasons[0])
        : "as no adapter specified";
      throw new AxiosError_default(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT",
      );
    }
    return adapter;
  },
  adapters: knownAdapters,
};

// node_modules/axios/lib/core/dispatchRequest.js
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError_default(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders_default.from(config.headers);
  config.data = transformData.call(config, config.transformRequest);
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters_default.getAdapter(
    config.adapter || defaults_default.adapter,
  );
  return adapter(config).then(
    function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        config.transformResponse,
        response,
      );
      response.headers = AxiosHeaders_default.from(response.headers);
      return response;
    },
    function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response,
          );
          reason.response.headers = AxiosHeaders_default.from(
            reason.response.headers,
          );
        }
      }
      return Promise.reject(reason);
    },
  );
}

// node_modules/axios/lib/helpers/validator.js
var validators = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(
  (type, i) => {
    validators[type] = function validator(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  },
);
var deprecatedWarnings = {};
validators.transitional = function transitional(validator, version2, message) {
  function formatMessage(opt, desc) {
    return (
      "[Axios v" +
      VERSION +
      "] Transitional option '" +
      opt +
      "'" +
      desc +
      (message ? ". " + message : "")
    );
  }
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError_default(
        formatMessage(
          opt,
          " has been removed" + (version2 ? " in " + version2 : ""),
        ),
        AxiosError_default.ERR_DEPRECATED,
      );
    }
    if (version2 && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" +
            version2 +
            " and will be removed in the near future",
        ),
      );
    }
    return validator ? validator(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError_default(
      "options must be an object",
      AxiosError_default.ERR_BAD_OPTION_VALUE,
    );
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === void 0 || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError_default(
          "option " + opt + " must be " + result,
          AxiosError_default.ERR_BAD_OPTION_VALUE,
        );
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError_default(
        "Unknown option " + opt,
        AxiosError_default.ERR_BAD_OPTION,
      );
    }
  }
}
var validator_default = {
  assertOptions,
  validators,
};

// node_modules/axios/lib/core/Axios.js
var validators2 = validator_default.validators;
var Axios = class {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_default(),
      response: new InterceptorManager_default(),
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy;
        Error.captureStackTrace
          ? Error.captureStackTrace((dummy = {}))
          : (dummy = new Error());
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        try {
          if (!err.stack) {
            err.stack = stack;
          } else if (
            stack &&
            !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))
          ) {
            err.stack += "\n" + stack;
          }
        } catch (e) {}
      }
      throw err;
    }
  }
  _request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator_default.assertOptions(
        transitional2,
        {
          silentJSONParsing: validators2.transitional(validators2.boolean),
          forcedJSONParsing: validators2.transitional(validators2.boolean),
          clarifyTimeoutError: validators2.transitional(validators2.boolean),
        },
        false,
      );
    }
    if (paramsSerializer != null) {
      if (utils_default.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer,
        };
      } else {
        validator_default.assertOptions(
          paramsSerializer,
          {
            encode: validators2.function,
            serialize: validators2.function,
          },
          true,
        );
      }
    }
    config.method = (
      config.method ||
      this.defaults.method ||
      "get"
    ).toLowerCase();
    let contextHeaders =
      headers && utils_default.merge(headers.common, headers[config.method]);
    headers &&
      utils_default.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        },
      );
    config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(
      function unshiftRequestInterceptors(interceptor) {
        if (
          typeof interceptor.runWhen === "function" &&
          interceptor.runWhen(config) === false
        ) {
          return;
        }
        synchronousRequestInterceptors =
          synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(
          interceptor.fulfilled,
          interceptor.rejected,
        );
      },
    );
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(
      function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(
          interceptor.fulfilled,
          interceptor.rejected,
        );
      },
    );
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(
        responseInterceptorChain[i++],
        responseInterceptorChain[i++],
      );
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};
utils_default.forEach(
  ["delete", "get", "head", "options"],
  function forEachMethodNoData(method) {
    Axios.prototype[method] = function (url2, config) {
      return this.request(
        mergeConfig(config || {}, {
          method,
          url: url2,
          data: (config || {}).data,
        }),
      );
    };
  },
);
utils_default.forEach(
  ["post", "put", "patch"],
  function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url2, data, config) {
        return this.request(
          mergeConfig(config || {}, {
            method,
            headers: isForm
              ? {
                  "Content-Type": "multipart/form-data",
                }
              : {},
            url: url2,
            data,
          }),
        );
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
  },
);
var Axios_default = Axios;

// node_modules/axios/lib/cancel/CancelToken.js
var CancelToken = class _CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners) return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError_default(message, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new _CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel,
    };
  }
};
var CancelToken_default = CancelToken;

// node_modules/axios/lib/helpers/spread.js
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

// node_modules/axios/lib/helpers/isAxiosError.js
function isAxiosError(payload) {
  return utils_default.isObject(payload) && payload.isAxiosError === true;
}

// node_modules/axios/lib/helpers/HttpStatusCode.js
var HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
var HttpStatusCode_default = HttpStatusCode;

// node_modules/axios/lib/axios.js
function createInstance(defaultConfig2) {
  const context = new Axios_default(defaultConfig2);
  const instance = bind(Axios_default.prototype.request, context);
  utils_default.extend(instance, Axios_default.prototype, context, {
    allOwnKeys: true,
  });
  utils_default.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig2, instanceConfig));
  };
  return instance;
}
var axios = createInstance(defaults_default);
axios.Axios = Axios_default;
axios.CanceledError = CanceledError_default;
axios.CancelToken = CancelToken_default;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData_default;
axios.AxiosError = AxiosError_default;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders_default;
axios.formToJSON = (thing) =>
  formDataToJSON_default(
    utils_default.isHTMLForm(thing) ? new FormData(thing) : thing,
  );
axios.getAdapter = adapters_default.getAdapter;
axios.HttpStatusCode = HttpStatusCode_default;
axios.default = axios;
var axios_default = axios;

// node_modules/axios/index.js
var {
  Axios: Axios2,
  AxiosError: AxiosError2,
  CanceledError: CanceledError2,
  isCancel: isCancel2,
  CancelToken: CancelToken2,
  VERSION: VERSION2,
  all: all2,
  Cancel,
  isAxiosError: isAxiosError2,
  spread: spread2,
  toFormData: toFormData2,
  AxiosHeaders: AxiosHeaders2,
  HttpStatusCode: HttpStatusCode2,
  formToJSON,
  getAdapter,
  mergeConfig: mergeConfig2,
} = axios_default;

// src/http.ts
function getModrinthClient() {
  return axios_default.create({
    baseURL: "https://api.modrinth.com/",
    headers: {
      "User-Agent": `anthonyporthouse/packwiz-renderer/${version} (anthony@porthou.se)`,
    },
  });
}
function getCurseforgeClient() {
  return axios_default.create({
    baseURL: "https://api.curseforge.com/",
    headers: {
      "User-Agent": `anthonyporthouse/packwiz-renderer/${version} (anthony@porthou.se)`,
      "x-api-key": process.env.CURSEFORGE_KEY,
    },
  });
}

// src/curseforge/getClasses.ts
async function getClasses() {
  const client = getCurseforgeClient();
  const res = await client.get("/v1/categories", {
    params: {
      gameId: 432,
      classesOnly: true,
    },
  });
  return res.data.data;
}

// src/curseforge/getFiles.ts
async function getFiles(fileIds) {
  const client = getCurseforgeClient();
  try {
    const res = await client.post("/v1/mods/files", {
      fileIds,
    });
    return res.data.data.reduce(
      (obj, current) => ((obj[current.modId] = current.displayName), obj),
      {},
    );
  } catch (e) {
    if (axios_default.isAxiosError(e)) {
      console.error(e.response);
    } else {
      console.error(e);
    }
    throw e;
  }
}

// src/curseforge/getMods.ts
async function getMods(modIds) {
  const client = getCurseforgeClient();
  try {
    const res = await client.post("/v1/mods", {
      modIds,
    });
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// src/curseforge/normalizeCurseforgeModData.ts
async function normalizeCurseforgeModData(mods) {
  const modData = await getMods(
    mods.map((mod) => mod.update.curseforge["project-id"]),
  );
  const versions = await getFiles(
    mods.map((mod) => mod.update.curseforge["file-id"]),
  );
  const curseforgeCategories = await getClasses();
  return modData.map((mod) => {
    console.log(
      `${source_default.green("Mod:")} ${mod.name} ${source_default.gray(versions[mod.id])}`,
    );
    const category = curseforgeCategories.find((cat) => cat.id === mod.classId);
    return {
      source: "curseforge",
      title: mod.name,
      summary: mod.summary,
      logoUrl: mod.logo.thumbnailUrl,
      url: `https://curseforge.com/minecraft/${category.slug}/${mod.slug}`,
      type: (() => {
        switch (category.slug) {
          case "mc-mods":
            return "mod";
          case "shaders":
            return "shader";
          case "data-packs":
            return "mod";
          case "texture-packs":
            return "resourcepack";
          default:
            return "mod";
        }
      })(),
      version: versions[mod.id],
    };
  });
}

// src/external/normalizeExternalModData.ts
function normalizeExternalModData(mods) {
  return mods.map((mod) => {
    console.log(`${source_default.green("Mod:")} ${mod.name}`);
    return {
      source: "external",
      title: mod.name,
      summary: "",
      url: mod.download.url,
      logoUrl: "",
      type: "mod",
    };
  });
}

// src/getIndexFile.ts
var import_node_fs = require("node:fs");
var import_smol_toml = __toESM(require_dist(), 1);
function isIndex(data) {
  return "files" in data;
}
function getIndexFile(path3, name) {
  const indexData = (0, import_node_fs.readFileSync)(
    `${path3}/${name}`,
    "utf-8",
  );
  const pack = (0, import_smol_toml.parse)(indexData);
  if (!isIndex(pack)) {
    throw "Invalid index file";
  }
  return pack;
}

// src/getModFile.ts
var import_node_fs2 = require("node:fs");
var import_smol_toml2 = __toESM(require_dist(), 1);
function isModFile(data) {
  return "side" in data;
}
function getModFile(packPath, filePath) {
  const data = (0, import_node_fs2.readFileSync)(
    `${packPath}/${filePath}`,
    "utf-8",
  );
  const modFile = (0, import_smol_toml2.parse)(data);
  if (!isModFile(modFile)) {
    throw Error("Not a valid mod file");
  }
  return modFile;
}
function isExternalFile(file) {
  return file.update === void 0 || Object.keys(file.update).length === 0;
}
function isModrinthFile(file) {
  return file.update != void 0 && "modrinth" in file.update;
}
function isCurseforgeFile(file) {
  return file.update != void 0 && "curseforge" in file.update;
}

// src/getPackFile.ts
var import_node_fs3 = require("node:fs");
var import_smol_toml3 = __toESM(require_dist(), 1);
function isPack(pack) {
  return "pack-format" in pack;
}
function getPackFile(path3) {
  const indexData = (0, import_node_fs3.readFileSync)(
    `${path3}/pack.toml`,
    "utf-8",
  );
  const pack = (0, import_smol_toml3.parse)(indexData);
  if (!isPack(pack)) {
    throw "Invalid pack";
  }
  return pack;
}

// src/modrinth/getProjects.ts
async function getProjects(projectIds) {
  const client = getModrinthClient();
  try {
    const res = await client.get("/v2/projects", {
      params: {
        ids: JSON.stringify(projectIds),
      },
    });
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// src/modrinth/getVersions.ts
async function getVersions(versions) {
  const client = getModrinthClient();
  try {
    const res = await client.get("/v2/versions", {
      params: {
        ids: JSON.stringify(versions),
      },
    });
    return res.data.reduce(
      (obj, current) => (
        (obj[current.project_id] = current.version_number), obj
      ),
      {},
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// src/modrinth/normalizeModrinthModData.ts
async function normalizeModrinthModData(mods) {
  const modData = await getProjects(
    mods.map((mod) => mod.update.modrinth["mod-id"]),
  );
  const versions = await getVersions(
    mods.map((mod) => mod.update.modrinth["version"]),
  );
  return modData.map((mod) => {
    console.log(
      `${source_default.green("Mod:")} ${mod.title} ${source_default.gray(versions[mod.id])}`,
    );
    return {
      source: "modrinth",
      title: mod.title,
      summary: mod.description,
      logoUrl: mod.icon_url ?? "",
      url: `https://modrinth.com/mod/${mod.id}`,
      type: mod.project_type,
      version: versions[mod.id],
    };
  });
}

// node_modules/eta/dist/eta.module.mjs
var path = __toESM(require("node:path"), 1);
var fs = __toESM(require("node:fs"), 1);
var Cacher = class {
  constructor(cache) {
    this.cache = void 0;
    this.cache = cache;
  }
  define(key, val) {
    this.cache[key] = val;
  }
  get(key) {
    return this.cache[key];
  }
  remove(key) {
    delete this.cache[key];
  }
  reset() {
    this.cache = {};
  }
  load(cacheObj) {
    this.cache = {
      ...this.cache,
      ...cacheObj,
    };
  }
};
var EtaError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "Eta Error";
  }
};
var EtaParseError = class extends EtaError {
  constructor(message) {
    super(message);
    this.name = "EtaParser Error";
  }
};
var EtaRuntimeError = class extends EtaError {
  constructor(message) {
    super(message);
    this.name = "EtaRuntime Error";
  }
};
var EtaFileResolutionError = class extends EtaError {
  constructor(message) {
    super(message);
    this.name = "EtaFileResolution Error";
  }
};
var EtaNameResolutionError = class extends EtaError {
  constructor(message) {
    super(message);
    this.name = "EtaNameResolution Error";
  }
};
function ParseErr(message, str, indx) {
  const whitespace = str.slice(0, indx).split(/\n/);
  const lineNo = whitespace.length;
  const colNo = whitespace[lineNo - 1].length + 1;
  message +=
    " at line " +
    lineNo +
    " col " +
    colNo +
    ":\n\n  " +
    str.split(/\n/)[lineNo - 1] +
    "\n  " +
    Array(colNo).join(" ") +
    "^";
  throw new EtaParseError(message);
}
function RuntimeErr(originalError, str, lineNo, path3) {
  const lines = str.split("\n");
  const start = Math.max(lineNo - 3, 0);
  const end = Math.min(lines.length, lineNo + 3);
  const filename = path3;
  const context = lines
    .slice(start, end)
    .map(function (line, i) {
      const curr = i + start + 1;
      return (curr == lineNo ? " >> " : "    ") + curr + "| " + line;
    })
    .join("\n");
  const header = filename
    ? filename + ":" + lineNo + "\n"
    : "line " + lineNo + "\n";
  const err = new EtaRuntimeError(
    header + context + "\n\n" + originalError.message,
  );
  err.name = originalError.name;
  throw err;
}
var AsyncFunction = async function () {}.constructor;
function compile(str, options) {
  const config = this.config;
  const ctor = options && options.async ? AsyncFunction : Function;
  try {
    return new ctor(
      config.varName,
      "options",
      this.compileToString.call(this, str, options),
    );
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new EtaParseError(
        "Bad template syntax\n\n" +
          e.message +
          "\n" +
          Array(e.message.length + 1).join("=") +
          "\n" +
          this.compileToString.call(this, str, options) +
          "\n",
        // This will put an extra newline before the callstack for extra readability
      );
    } else {
      throw e;
    }
  }
}
function compileToString(str, options) {
  const config = this.config;
  const isAsync = options && options.async;
  const compileBody2 = this.compileBody;
  const buffer = this.parse.call(this, str);
  let res = `${config.functionHeader}
let include = (template, data) => this.render(template, data, options);
let includeAsync = (template, data) => this.renderAsync(template, data, options);

let __eta = {res: "", e: this.config.escapeFunction, f: this.config.filterFunction${config.debug ? ', line: 1, templateStr: "' + str.replace(/\\|"/g, "\\$&").replace(/\r\n|\n|\r/g, "\\n") + '"' : ""}};

function layout(path, data) {
  __eta.layout = path;
  __eta.layoutData = data;
}${config.debug ? "try {" : ""}${config.useWith ? "with(" + config.varName + "||{}){" : ""}

${compileBody2.call(this, buffer)}
if (__eta.layout) {
  __eta.res = ${isAsync ? "await includeAsync" : "include"} (__eta.layout, {...${config.varName}, body: __eta.res, ...__eta.layoutData});
}
${config.useWith ? "}" : ""}${config.debug ? "} catch (e) { this.RuntimeErr(e, __eta.templateStr, __eta.line, options.filepath) }" : ""}
return __eta.res;
`;
  if (config.plugins) {
    for (let i = 0; i < config.plugins.length; i++) {
      const plugin = config.plugins[i];
      if (plugin.processFnString) {
        res = plugin.processFnString(res, config);
      }
    }
  }
  return res;
}
function compileBody(buff) {
  const config = this.config;
  let i = 0;
  const buffLength = buff.length;
  let returnStr = "";
  for (i; i < buffLength; i++) {
    const currentBlock = buff[i];
    if (typeof currentBlock === "string") {
      const str = currentBlock;
      returnStr += "__eta.res+='" + str + "'\n";
    } else {
      const type = currentBlock.t;
      let content = currentBlock.val || "";
      if (config.debug) returnStr += "__eta.line=" + currentBlock.lineNo + "\n";
      if (type === "r") {
        if (config.autoFilter) {
          content = "__eta.f(" + content + ")";
        }
        returnStr += "__eta.res+=" + content + "\n";
      } else if (type === "i") {
        if (config.autoFilter) {
          content = "__eta.f(" + content + ")";
        }
        if (config.autoEscape) {
          content = "__eta.e(" + content + ")";
        }
        returnStr += "__eta.res+=" + content + "\n";
      } else if (type === "e") {
        returnStr += content + "\n";
      }
    }
  }
  return returnStr;
}
function trimWS(str, config, wsLeft, wsRight) {
  let leftTrim;
  let rightTrim;
  if (Array.isArray(config.autoTrim)) {
    leftTrim = config.autoTrim[1];
    rightTrim = config.autoTrim[0];
  } else {
    leftTrim = rightTrim = config.autoTrim;
  }
  if (wsLeft || wsLeft === false) {
    leftTrim = wsLeft;
  }
  if (wsRight || wsRight === false) {
    rightTrim = wsRight;
  }
  if (!rightTrim && !leftTrim) {
    return str;
  }
  if (leftTrim === "slurp" && rightTrim === "slurp") {
    return str.trim();
  }
  if (leftTrim === "_" || leftTrim === "slurp") {
    str = str.trimStart();
  } else if (leftTrim === "-" || leftTrim === "nl") {
    str = str.replace(/^(?:\r\n|\n|\r)/, "");
  }
  if (rightTrim === "_" || rightTrim === "slurp") {
    str = str.trimEnd();
  } else if (rightTrim === "-" || rightTrim === "nl") {
    str = str.replace(/(?:\r\n|\n|\r)$/, "");
  }
  return str;
}
var escMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function replaceChar(s) {
  return escMap[s];
}
function XMLEscape(str) {
  const newStr = String(str);
  if (/[&<>"']/.test(newStr)) {
    return newStr.replace(/[&<>"']/g, replaceChar);
  } else {
    return newStr;
  }
}
var defaultConfig = {
  autoEscape: true,
  autoFilter: false,
  autoTrim: [false, "nl"],
  cache: false,
  cacheFilepaths: true,
  debug: false,
  escapeFunction: XMLEscape,
  // default filter function (not used unless enables) just stringifies the input
  filterFunction: (val) => String(val),
  functionHeader: "",
  parse: {
    exec: "",
    interpolate: "=",
    raw: "~",
  },
  plugins: [],
  rmWhitespace: false,
  tags: ["<%", "%>"],
  useWith: false,
  varName: "it",
  defaultExtension: ".eta",
};
var templateLitReg =
  /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g;
var singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g;
var doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;
function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}
function getLineNo(str, index) {
  return str.slice(0, index).split("\n").length;
}
function parse4(str) {
  const config = this.config;
  let buffer = [];
  let trimLeftOfNextStr = false;
  let lastIndex = 0;
  const parseOptions = config.parse;
  if (config.plugins) {
    for (let i = 0; i < config.plugins.length; i++) {
      const plugin = config.plugins[i];
      if (plugin.processTemplate) {
        str = plugin.processTemplate(str, config);
      }
    }
  }
  if (config.rmWhitespace) {
    str = str.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "");
  }
  templateLitReg.lastIndex = 0;
  singleQuoteReg.lastIndex = 0;
  doubleQuoteReg.lastIndex = 0;
  function pushString(strng, shouldTrimRightOfString) {
    if (strng) {
      strng = trimWS(
        strng,
        config,
        trimLeftOfNextStr,
        // this will only be false on the first str, the next ones will be null or undefined
        shouldTrimRightOfString,
      );
      if (strng) {
        strng = strng.replace(/\\|'/g, "\\$&").replace(/\r\n|\n|\r/g, "\\n");
        buffer.push(strng);
      }
    }
  }
  const prefixes = [
    parseOptions.exec,
    parseOptions.interpolate,
    parseOptions.raw,
  ].reduce(function (accumulator, prefix) {
    if (accumulator && prefix) {
      return accumulator + "|" + escapeRegExp(prefix);
    } else if (prefix) {
      return escapeRegExp(prefix);
    } else {
      return accumulator;
    }
  }, "");
  const parseOpenReg = new RegExp(
    escapeRegExp(config.tags[0]) + "(-|_)?\\s*(" + prefixes + ")?\\s*",
    "g",
  );
  const parseCloseReg = new RegExp(
    "'|\"|`|\\/\\*|(\\s*(-|_)?" + escapeRegExp(config.tags[1]) + ")",
    "g",
  );
  let m;
  while ((m = parseOpenReg.exec(str))) {
    const precedingString = str.slice(lastIndex, m.index);
    lastIndex = m[0].length + m.index;
    const wsLeft = m[1];
    const prefix = m[2] || "";
    pushString(precedingString, wsLeft);
    parseCloseReg.lastIndex = lastIndex;
    let closeTag;
    let currentObj = false;
    while ((closeTag = parseCloseReg.exec(str))) {
      if (closeTag[1]) {
        const content = str.slice(lastIndex, closeTag.index);
        parseOpenReg.lastIndex = lastIndex = parseCloseReg.lastIndex;
        trimLeftOfNextStr = closeTag[2];
        const currentType =
          prefix === parseOptions.exec
            ? "e"
            : prefix === parseOptions.raw
              ? "r"
              : prefix === parseOptions.interpolate
                ? "i"
                : "";
        currentObj = {
          t: currentType,
          val: content,
        };
        break;
      } else {
        const char = closeTag[0];
        if (char === "/*") {
          const commentCloseInd = str.indexOf("*/", parseCloseReg.lastIndex);
          if (commentCloseInd === -1) {
            ParseErr("unclosed comment", str, closeTag.index);
          }
          parseCloseReg.lastIndex = commentCloseInd;
        } else if (char === "'") {
          singleQuoteReg.lastIndex = closeTag.index;
          const singleQuoteMatch = singleQuoteReg.exec(str);
          if (singleQuoteMatch) {
            parseCloseReg.lastIndex = singleQuoteReg.lastIndex;
          } else {
            ParseErr("unclosed string", str, closeTag.index);
          }
        } else if (char === '"') {
          doubleQuoteReg.lastIndex = closeTag.index;
          const doubleQuoteMatch = doubleQuoteReg.exec(str);
          if (doubleQuoteMatch) {
            parseCloseReg.lastIndex = doubleQuoteReg.lastIndex;
          } else {
            ParseErr("unclosed string", str, closeTag.index);
          }
        } else if (char === "`") {
          templateLitReg.lastIndex = closeTag.index;
          const templateLitMatch = templateLitReg.exec(str);
          if (templateLitMatch) {
            parseCloseReg.lastIndex = templateLitReg.lastIndex;
          } else {
            ParseErr("unclosed string", str, closeTag.index);
          }
        }
      }
    }
    if (currentObj) {
      if (config.debug) {
        currentObj.lineNo = getLineNo(str, m.index);
      }
      buffer.push(currentObj);
    } else {
      ParseErr("unclosed tag", str, m.index);
    }
  }
  pushString(str.slice(lastIndex, str.length), false);
  if (config.plugins) {
    for (let i = 0; i < config.plugins.length; i++) {
      const plugin = config.plugins[i];
      if (plugin.processAST) {
        buffer = plugin.processAST(buffer, config);
      }
    }
  }
  return buffer;
}
function handleCache(template, options) {
  const templateStore =
    options && options.async ? this.templatesAsync : this.templatesSync;
  if (this.resolvePath && this.readFile && !template.startsWith("@")) {
    const templatePath = options.filepath;
    const cachedTemplate = templateStore.get(templatePath);
    if (this.config.cache && cachedTemplate) {
      return cachedTemplate;
    } else {
      const templateString = this.readFile(templatePath);
      const templateFn = this.compile(templateString, options);
      if (this.config.cache) templateStore.define(templatePath, templateFn);
      return templateFn;
    }
  } else {
    const cachedTemplate = templateStore.get(template);
    if (cachedTemplate) {
      return cachedTemplate;
    } else {
      throw new EtaNameResolutionError(
        "Failed to get template '" + template + "'",
      );
    }
  }
}
function render(template, data, meta) {
  let templateFn;
  const options = {
    ...meta,
    async: false,
  };
  if (typeof template === "string") {
    if (this.resolvePath && this.readFile && !template.startsWith("@")) {
      options.filepath = this.resolvePath(template, options);
    }
    templateFn = handleCache.call(this, template, options);
  } else {
    templateFn = template;
  }
  const res = templateFn.call(this, data, options);
  return res;
}
function renderAsync(template, data, meta) {
  let templateFn;
  const options = {
    ...meta,
    async: true,
  };
  if (typeof template === "string") {
    if (this.resolvePath && this.readFile && !template.startsWith("@")) {
      options.filepath = this.resolvePath(template, options);
    }
    templateFn = handleCache.call(this, template, options);
  } else {
    templateFn = template;
  }
  const res = templateFn.call(this, data, options);
  return Promise.resolve(res);
}
function renderString(template, data) {
  const templateFn = this.compile(template, {
    async: false,
  });
  return render.call(this, templateFn, data);
}
function renderStringAsync(template, data) {
  const templateFn = this.compile(template, {
    async: true,
  });
  return renderAsync.call(this, templateFn, data);
}
var Eta$1 = class {
  constructor(customConfig) {
    this.config = void 0;
    this.RuntimeErr = RuntimeErr;
    this.compile = compile;
    this.compileToString = compileToString;
    this.compileBody = compileBody;
    this.parse = parse4;
    this.render = render;
    this.renderAsync = renderAsync;
    this.renderString = renderString;
    this.renderStringAsync = renderStringAsync;
    this.filepathCache = {};
    this.templatesSync = new Cacher({});
    this.templatesAsync = new Cacher({});
    this.resolvePath = null;
    this.readFile = null;
    if (customConfig) {
      this.config = {
        ...defaultConfig,
        ...customConfig,
      };
    } else {
      this.config = {
        ...defaultConfig,
      };
    }
  }
  // METHODS
  configure(customConfig) {
    this.config = {
      ...this.config,
      ...customConfig,
    };
  }
  withConfig(customConfig) {
    return {
      ...this,
      config: {
        ...this.config,
        ...customConfig,
      },
    };
  }
  loadTemplate(name, template, options) {
    if (typeof template === "string") {
      const templates =
        options && options.async ? this.templatesAsync : this.templatesSync;
      templates.define(name, this.compile(template, options));
    } else {
      let templates = this.templatesSync;
      if (
        template.constructor.name === "AsyncFunction" ||
        (options && options.async)
      ) {
        templates = this.templatesAsync;
      }
      templates.define(name, template);
    }
  }
};
function readFile(path3) {
  let res = "";
  try {
    res = fs.readFileSync(path3, "utf8");
  } catch (err) {
    if ((err == null ? void 0 : err.code) === "ENOENT") {
      throw new EtaFileResolutionError(`Could not find template: ${path3}`);
    } else {
      throw err;
    }
  }
  return res;
}
function resolvePath(templatePath, options) {
  let resolvedFilePath = "";
  const views = this.config.views;
  if (!views) {
    throw new EtaFileResolutionError("Views directory is not defined");
  }
  const baseFilePath = options && options.filepath;
  const defaultExtension =
    this.config.defaultExtension === void 0
      ? ".eta"
      : this.config.defaultExtension;
  const cacheIndex = JSON.stringify({
    filename: baseFilePath,
    path: templatePath,
    views: this.config.views,
  });
  templatePath += path.extname(templatePath) ? "" : defaultExtension;
  if (baseFilePath) {
    if (this.config.cacheFilepaths && this.filepathCache[cacheIndex]) {
      return this.filepathCache[cacheIndex];
    }
    const absolutePathTest = absolutePathRegExp.exec(templatePath);
    if (absolutePathTest && absolutePathTest.length) {
      const formattedPath = templatePath.replace(/^\/*|^\\*/, "");
      resolvedFilePath = path.join(views, formattedPath);
    } else {
      resolvedFilePath = path.join(path.dirname(baseFilePath), templatePath);
    }
  } else {
    resolvedFilePath = path.join(views, templatePath);
  }
  if (dirIsChild(views, resolvedFilePath)) {
    if (baseFilePath && this.config.cacheFilepaths) {
      this.filepathCache[cacheIndex] = resolvedFilePath;
    }
    return resolvedFilePath;
  } else {
    throw new EtaFileResolutionError(
      `Template '${templatePath}' is not in the views directory`,
    );
  }
}
function dirIsChild(parent, dir) {
  const relative2 = path.relative(parent, dir);
  return (
    relative2 && !relative2.startsWith("..") && !path.isAbsolute(relative2)
  );
}
var absolutePathRegExp = /^\\|^\//;
var Eta = class extends Eta$1 {
  constructor(...args) {
    super(...args);
    this.readFile = readFile;
    this.resolvePath = resolvePath;
  }
};

// src/renderer.ts
var import_path = __toESM(require("path"), 1);
function render2(pack, sortedProjects) {
  const eta = new Eta({
    views: import_path.default.join(__dirname, "..", "templates"),
  });
  return eta.render("./index", {
    pack,
    mods: sortedProjects.filter((project) => project.type === "mod"),
    resourcePacks: sortedProjects.filter(
      (project) => project.type === "resourcepack",
    ),
    version,
  });
}

// src/cli/actions/build.ts
var import_fs = require("fs");
async function buildAction(packPath, options) {
  console.log(`${source_default.blue("Info: ")} Parsing Pack`);
  const pack = getPackFile(packPath);
  const index = getIndexFile(packPath, pack.index.file);
  console.log(`${source_default.blue("Info: ")} Parsing Mod Files`);
  const mods = index.files
    .filter((file) => file.metafile)
    .map((file) => getModFile(packPath, file.file));
  const projects = [];
  console.log(`${source_default.blue("Info: ")} Fetching Modrinth Metadata`);
  projects.push(
    ...(await normalizeModrinthModData(mods.filter(isModrinthFile))),
  );
  console.log(`${source_default.blue("Info: ")} Fetching Cursforge Metadata`);
  projects.push(
    ...(await normalizeCurseforgeModData(mods.filter(isCurseforgeFile))),
  );
  console.log(
    `${source_default.blue("Info: ")} Fetching External File Metadata`,
  );
  projects.push(...normalizeExternalModData(mods.filter(isExternalFile)));
  const sortedProjects = projects.sort((a, b) =>
    a.title.localeCompare(b.title),
  );
  console.log(`${source_default.blue("Info: ")} Rendering Template`);
  const output = render2(pack, sortedProjects);
  console.log(
    `${source_default.blue("Info: ")} Outputting to ${options.output}/index.html`,
  );
  (0, import_fs.mkdirSync)(options.output, { recursive: true });
  (0, import_fs.writeFileSync)(`${options.output}/index.html`, output);
}

// src/cli/cli.ts
var program2 = new Command();
program2.name("packwiz-renderer");
program2.version(version);
program2
  .command("build")
  .description("Build the static assets for the given pack")
  .argument("<pack>", "The path to the pack to build")
  .option("-o, --output <dir>", "output directory", ".")
  .action(buildAction);
var cli_default = program2;

// bin/build.ts
cli_default
  .parseAsync()
  .then(() => {
    console.log("Complete");
  })
  .catch((e) => {
    console.error(e);
  });
/*! Bundled license information:

mime-db/index.js:
  (*!
   * mime-db
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2022 Douglas Christopher Wilson
   * MIT Licensed
   *)

mime-types/index.js:
  (*!
   * mime-types
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

smol-toml/dist/error.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/date.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/util.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/primitive.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/extract.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/struct.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/parse.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/stringify.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/index.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)
*/
