"use strict";

var _litElement = require("https://unpkg.com/@polymer/lit-element@0.6.5/lit-element.js?module");

function _templateObject5() {
  var data = _taggedTemplateLiteralLoose(["\n      <div class=\"toolbar\">\n        ", "\n      </div>\n    "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteralLoose(["<div class=\"state\"><span>", " ", "</span></div>"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteralLoose(["<div class=\"mode-icon ", "\">\n          <paper-icon-button icon=\"", "\" title=\"", "\" @click='", "'></paper-icon-button>\n        </div>"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteralLoose(["\n      ", "\n      <ha-card>\n        ", "\n      </ha-card>\n    "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  <style>\n    :host {\n      --bt-default-spacing: 10px;\n    }\n\n    ha-card {\n      box-shadow: none;\n      display: flex;\n      flex-direction: column;\n      width: 100%;\n    }\n\n    .content {\n      flex: 1;\n      text-align: center;\n      cursor: pointer;\n      position: relative;\n    }\n\n    .content img {\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      margin: auto;\n    }\n\n    .toolbar {\n      display: grid;\n      grid-template-columns: auto;\n      grid-auto-flow: column;\n      margin-top: calc(var(--bt-spacing, var(--bt-default-spacing)) * 2);\n      gap: 2px;\n      background: var(--bt-toolbar-background, var(--primary-color));\n    }\n\n    .toolbar paper-icon-button {\n      flex-direction: column;\n      height: 100%;\n    }\n\n    .state {\n      display: table;\n      height: 100%;\n      text-align: center;\n      padding: 8px;\n    }\n\n    .state span {\n      display: table-cell;\n      vertical-align: middle;\n    }\n\n    .mode-icon {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      text-align: center;\n      justify-content: center;\n      min-height: 24px;\n      cursor: pointer;\n      color: var(--bt-icon-inactive-color, var(--text-primary-color));\n    }\n    .mode-icon.active {\n      color: var(--bt-icon-active-color, var(--primary-color));\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

var styles = (0, _litElement.html)(_templateObject());

var ButtonToolbarCard =
/*#__PURE__*/
function (_LitElement) {
  _inheritsLoose(ButtonToolbarCard, _LitElement);

  function ButtonToolbarCard() {
    return _LitElement.apply(this, arguments) || this;
  }

  var _proto = ButtonToolbarCard.prototype;

  _proto.handleMore = function handleMore() {
    var e = new Event('hass-more-info', {
      bubbles: true,
      composed: true
    });
    e.detail = {
      entityId: this.config.content.entity
    };
    this.dispatchEvent(e);
  };

  _proto.render = function render() {
    return (0, _litElement.html)(_templateObject2(), styles, this.renderToolbar());
  };

  _proto.getServiceState = function getServiceState(service) {
    if (!service || !service.parameter) return false;

    if (service.toggle) {
      return this.hass.states[service.entity].attributes[service.parameter];
    }

    if (service.active) {
      return this.hass.states[service.entity].attributes[service.parameter] === service.active;
    }
  };

  _proto.renderToolbar = function renderToolbar() {
    var _this = this;

    var toolbar = this.config.toolbar;
    var buttons = toolbar.map(function (_ref) {
      var type = _ref.type,
          entity = _ref.entity,
          name = _ref.name,
          icon = _ref.icon,
          unit = _ref.unit,
          service = _ref.service;

      if (type === 'service') {
        var isActive = _this.getServiceState(service);

        var execute = function execute() {
          var args = service.name.split('.');
          var extra = {};

          if (service.parameter && service.toggle) {
            extra[service.parameter] = !_this.hass.states[service.entity].attributes[service.parameter];
          }

          _this.hass.callService(args[0], args[1], {
            entity_id: service.entity,
            ...extra,
            ...(service.args || {})
          });
        };

        return (0, _litElement.html)(_templateObject3(), isActive ? 'active' : '', icon, name, execute);
      } else if (type === 'state') {
        var stateEntity = _this.hass.states[entity];
        var stateUnit = unit != null ? unit : stateEntity.attributes.unit_of_measurement;
        return (0, _litElement.html)(_templateObject4(), stateEntity.state, stateUnit);
      }
    });
    return (0, _litElement.html)(_templateObject5(), buttons);
  };

  _proto.setConfig = function setConfig(config) {
    this.config = config;
  };

  _proto.getCardSize = function getCardSize() {
    return 1;
  };

  _createClass(ButtonToolbarCard, null, [{
    key: "properties",
    get: function get() {
      return {
        hass: Object,
        config: Object
      };
    }
  }]);

  return ButtonToolbarCard;
}(_litElement.LitElement);

customElements.define('button-toolbar-redux', ButtonToolbarCard);
