'use strict';

requirejs.config({
  baseUrl: './',
  paths: {
    angular: './../node_modules/angular/angular',
    chai: './../node_modules/chai/chai',
    jquery: './../node_modules/jquery/dist/jquery',
    qlik: './stubs/qlik.stub',
    css: './../node_modules/require-css/css'
  },
  shim: {
    angular: {
      deps: ['jquery'],
      exports: 'angular'
    },
    qlik: {
      deps: ['angular']
    }
  }
});