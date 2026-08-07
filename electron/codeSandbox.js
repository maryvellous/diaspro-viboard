const vm = require('vm');

class CodeSandbox {
  static runJavaScript(code, timeoutMs = 2000) {
    let logs = [];
    let errors = [];

    const customConsole = {
      log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      error: (...args) => errors.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      warn: (...args) => logs.push('[WARN] ' + args.join(' ')),
    };

    const sandbox = {
      console: customConsole,
      Math,
      Date,
      JSON,
      parseInt,
      parseFloat,
      Array,
      Object,
      String,
      Number,
      Boolean,
    };

    const context = vm.createContext(sandbox);

    try {
      const script = new vm.Script(code);
      const result = script.runInContext(context, { timeout: timeoutMs });
      return {
        success: true,
        output: logs.join('\n'),
        result: result !== undefined ? String(result) : undefined,
        errors: errors.join('\n'),
      };
    } catch (err) {
      return {
        success: false,
        output: logs.join('\n'),
        error: err.message,
      };
    }
  }
}

module.exports = CodeSandbox;
