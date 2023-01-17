import { css, html, LitElement, TemplateResult } from "lit";
import { property, customElement } from "lit/decorators.js";
import { componentStyles } from "~src/global";
import scopedStyles from "./styles.module.scss";

@customElement("hello-text")
export default class HelloText extends LitElement {
  @property({ type: String }) sub!: string;

  render(): TemplateResult {
      return html`
      <h4>Hello, <slot></slot></h4>
      <p>${this.sub}</p>
    `;
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
