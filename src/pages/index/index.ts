import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { pageStyles } from '~src/global';
import scopedStyles from './styles.module.scss';
import asmCard from './asm.card';
import appIdeasCard from './app-ideas.card';

import('~components/bottom-nav');
import('~components/type-text');
import('~components/project-card');

@customElement('index-page')
export default class IndexPage extends LitElement {
  render(): TemplateResult {
    return html`
      <bottom-nav current="home"></bottom-nav>
      <type-text></type-text>
      <div class="projects">
        <project-card
          content="${asmCard}"
          href="/customasm.html"></project-card>
        <project-card
          content="${appIdeasCard}"
          href="//app-ideas.josephabbey.dev"></project-card>
      </div>
    `;
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
