import { css, html, LitElement, TemplateResult } from "lit";
import { property, customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { componentStyles } from "~src/global";
import scopedStyles from "./styles.module.scss";

@customElement("bottom-nav")
export default class BottomNav extends LitElement {
  @property({ type: String }) current = "";

  render(): TemplateResult {
      return html`
      <ul>
        <li>
          <a href="/" class=${classMap({ current: this.current === "home" })}>
            Home
          </a>
        </li>
        <li><a>Page</a></li>
        <li><a>Page</a></li>
      </ul>
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
