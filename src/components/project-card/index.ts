import { css, html, LitElement, TemplateResult } from 'lit';
import { guard } from 'lit/directives/guard.js';
import { property, customElement } from 'lit/decorators.js';
import { componentStyles } from '~src/global';
import scopedStyles from './styles.module.scss';

@customElement('project-card')
export default class ProjectCard extends LitElement {
  @property() content: string = '';
  @property() href: string = '#';

  render(): TemplateResult {
    return html`<a href="${this.href}">
      <pre>
${guard([this.content], () => {
    const lines = this.content.replace(/\r/g, '').split('\n');
    const l = Math.max(...lines.map((a) => a.length));
    const c = `+${'-'.repeat(l + 2)}+`;
    return `${c}\n${lines
      .map((line) => `| ${line.padEnd(l, ' ')} |`)
      .join('\n')}\n${c}`;
  })}</pre
      >
    </a>`;
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
