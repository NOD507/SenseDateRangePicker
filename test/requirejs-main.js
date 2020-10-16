'use strict';

(function init() { // eslint-disable-line func-names
  function run() {
    requirejs(window.awFiles, function () {
      mocha.run();
    });
  }
  requirejs(['./requirejs-config'], run);
})();