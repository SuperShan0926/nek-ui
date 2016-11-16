/**
 * ------------------------------------------------------------
 * Component 组件基类
 * @author   sensen(rainforest92@126.com)
 * ------------------------------------------------------------
 */

'use strict';

var Regular = require('regularjs');
var polyfill = require('./polyfill.js');
var _ = require('./_.js');
var filter = require('./filter.js');
var directive = require('./directive.js');

/**
 * @class Component
 * @extend Regular
 * @param {boolean=false}           options.data.readonly            => 是否只读
 * @param {boolean=false}           options.data.disabled            => 是否禁用
 * @param {boolean=true}            options.data.visible             => 是否显示
 * @param {string=''}               options.data.class               => 补充class
 */
var Component = Regular.extend({
    /**
     * @protected
     */
    config: function() {
        _.extend(this.data, {
            readonly: false,
            disabled: false,
            visible: true,
            'class': '',
            console: typeof console === 'undefined' ? undefined : console
        });
        this.$on('update', function(conf) {
          if (!conf) return;
          conf.forEach(function(d) {
              if (this.data.hasOwnProperty(d.key)) {
                  this.$update(d.key, d.value);
              }
          }.bind(this));
        })
        this.$watch('NEK', function(val) {
            this.$emit('update', val.conf);
        });
        this.supr();
    },
    /**
     * @protected
     */
    defaults: function(data) {
      this.data = Object.assign(data, this.data);
    },
    /**
     * @protected
     */
    reset: function() {
        this.data = {};
        this.config();
    }
})
.filter(filter)
.directive(directive);

module.exports = Component;