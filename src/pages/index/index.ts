import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { pageStyles } from "~src/global";
import { getUsername } from "~services/name-service";
import scopedStyles from "./styles.module.scss";

import("~components/bottom-nav");
import("~components/hello-text");

@customElement("index-page")
export default class IndexPage extends LitElement {
  @state() username: string | null = null;

  render(): TemplateResult {
      return html`
      <bottom-nav current="home"></bottom-nav>
      <div class="container">
        <hello-text sub="Welcome User">${this.username}</hello-text>
      </div>
    `;
  }

  connectedCallback(): void {
      super.connectedCallback();
      this.username = getUsername();
      // eslint-disable-next-line no-console
      if (!PRODUCTION) console.log("Everything is working!");
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
