import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@0.6.5/lit-element.js?module';

const styles = html`
  <style>
    :host {
      --bt-default-spacing: 10px;
    }

    [style*="--aspect-ratio"] {
      position: relative;
    }

    [style*="--aspect-ratio"]::before {
      content: "";
      display: block;
      padding-bottom: calc(100% / (var(--aspect-ratio)));
    }

    [style*="--aspect-ratio"] > :first-child {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
    }

    ha-card {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .content {
      flex: 1;
      text-align: center;
      cursor: pointer;
      position: relative;
    }

    .content img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }

    .toolbar {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin-top: calc(var(--bt-spacing, var(--bt-default-spacing)) * 2);
      height: 30%;
    }

    .toolbar .button {
      color: var(--bt-icon-inactive-color, var(--text-primary-color));
      flex-direction: column;
      height: 100%;
      cursor: pointer;
    }
    .button.active {
      color: var(--bt-icon-active-color, var(--primary-color));
    }

    .state {
      display: table;
      height: 100%;
      text-align: center;
      padding: 8px;
    }

    .state span {
      display: table-cell;
      vertical-align: middle;
    }
`

class ButtonToolbarCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    }
  }

  getServiceState(service) {
    if (!service || !service.parameter) return false;

    if (service.toggle) {
      return this.hass.states[service.entity].attributes[service.parameter];
    }

    if (service.active) {
      return this.hass.states[service.entity].attributes[service.parameter] === service.active;
    }
  }

  handleMore() {
    const e = new Event('hass-more-info', { bubbles: true, composed: true })
    e.detail = { entityId: this.config.content.entity }
    this.dispatchEvent(e);
  }

  render() {
    const aspect_ratio = this.config.aspect_ratio != null ? this.config.aspect_ratio : '1/1'

    return html`
      ${styles}
      <div>
          ${this.renderContent()}
          ${this.renderToolbar()}
      </div>
    `
  }

  renderContent() {
    const { content } = this.config

    if (!content || !content.image) {
      return html`<span />`;
    }

    return html`
      <div class="content" @click='${(e) => this.handleMore()}' ?more-info=true>
        <img src="${content.image}" style="height: ${content.height};">
      </div>
    `
  }

  renderToolbar() {
    const { toolbar } = this.config
    const buttons = toolbar.map(({ type, entity, name, icon, unit, service }) => {
      if (type === 'service') {
        const isActive = this.getServiceState(service);
        let classes = "button";
        if (isActive) {
          classes += " active";
        }
        const execute = () => {
          const params = {
            entity_id: service.entity,
          };
          if (!!service.parameter) {
            params[service.parameter] = !isActive;
          }
          const args = service.name.split('.')
          this.hass.callService(args[0], args[1], params);
        }
        return html`
          <ha-icon
            class=${classes}
            .icon=${icon}
            @click='${execute}'
          ></ha-icon>
        `;
      } else if (type === 'state') {

        const stateEntity = this.hass.states[entity]
        const stateUnit = unit != null ? unit : stateEntity.attributes.unit_of_measurement;

        return html`<div class="state"><span>${stateEntity.state} ${stateUnit}</span></div>`
      }
    })

    return html`
      <div class="toolbar">
        ${buttons}
      </div>
    `
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('button-toolbar-redux', ButtonToolbarCard);
