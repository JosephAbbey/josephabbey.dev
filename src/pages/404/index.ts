import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { pageStyles } from '~src/global';
import scopedStyles from './styles.module.scss';

import('~components/bottom-nav');

@customElement('not-found-page')
export default class NotFoundPage extends LitElement {
  render(): TemplateResult {
    return html`<bottom-nav></bottom-nav>`;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // eslint-disable-next-line no-console
    if (!PRODUCTION) console.log('Everything is working!');
  }

  // Styles can either be in this file (only css)
  // or imported from another file (scss in this case)
  static styles = [
    ...pageStyles,
    scopedStyles as never,
    css`
      // More styles here
    `,
  ];
}
