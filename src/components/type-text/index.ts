import { css, html, LitElement, TemplateResult } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { componentStyles } from '~src/global';
import scopedStyles from './styles.module.scss';

@customElement('type-text')
export default class TypeText extends LitElement {
  render(): TemplateResult {
    return html`<p>Joseph Abbey!</p>`;
  }

  // Styles can either be in this file (only css)
  // or imported from another file (scss in this case)
  static styles = [
    ...componentStyles,
    scopedStyles as never,
    css`
      // More styles here
    `,
  ];
}
