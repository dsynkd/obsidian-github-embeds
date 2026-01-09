import styles from './FileEmbed.module.css';
import { Settings, SettingsProvider } from '../settings';
import { FileSnippet } from '../client/types';
import { renderMarkdown } from '../utilities';
import { ExpandableEmbed } from './ExpandableEmbed';
import { Shard } from '../components/core';

export class FileEmbed extends ExpandableEmbed {
	
	wrapper: HTMLElement

	protected get rootClass(): string {
		return styles.embed;
	}

	constructor(
		containerEl: HTMLElement,
		private readonly file: FileSnippet,
		settings: SettingsProvider,
		showHeading: boolean = true
	) {
		super(containerEl, settings, showHeading);
	}

	protected onSettingsChange(prev: Settings | null, curr: Settings) {
		super.onSettingsChange(prev, curr);

		if (prev?.autoOpenThreshold !== curr.autoOpenThreshold) {
			this.tryToggle();
		}

		if (prev?.wordWrap !== curr.wordWrap) {
			this.applyStyles();	
		}

		if (prev?.showLineNumbers !== curr.showLineNumbers) {
			this.onReload();
		}
	}

	protected onReload() {
		super.onReload();

		this.tryToggle();
	}

	protected createHeadingPrefix(container: Shard): void {
		const { owner, repo, ref } = this.file;

		const prefix = container.createEl('div', styles.prefix);
		prefix.addClass('github-embed-heading-prefix')

		const repoLink = `${owner}/${repo}`;
		prefix.createEl('a', {
			text: repoLink,
			href: `https://github.com/${repoLink}`,
			cls: styles.repoLink,
		});

		const refText = ref.kind === 'branch' ? ref.value : ref.value.slice(0, 7);
		prefix.createEl('a', {
			text: `@${refText}`,
			href: `https://github.com/${repoLink}/tree/${ref.value}`,
			cls: styles.refLink,
		});
	}

	protected createHeading(container: Shard): void {
		const { path, lines, url } = this.file;
		const link = container.createEl('a', { href: url, cls: styles.title });
		link.createSpan({ text: path, cls: styles.linkText });
		const linesText = lines ? `#L${lines.start}${lines.end === -1 ? '-' : lines.end ? `-L${lines.end}` : ''}` : '';
		link.createSpan({ text: linesText, cls: styles.lines });
	}

	protected createInfo(container: Shard): void {
		// Spacer
		container.createEl('div');
	}

	protected createContent(container: Shard): void {
		const { lang = '', snippetContent } = this.file;
		
		const markdown = `\`\`\`${lang}\n${snippetContent.trimEnd()}\n\`\`\``;
		this.wrapper = container.createEl('div');
		renderMarkdown(this.settings.app, markdown, this.wrapper, this);
		setTimeout(() => {
			this.applyStyles();	
		}, 0);
	}

	protected applyStyles() {
		this.wrapper.classList.value = '';
		this.wrapper.classList.add(this.settings.settings.wordWrap ? styles.wordWrap : styles.noWordWrap);
		this.applyLineNumbers()
	}

	private applyLineNumbers() {
		const preElement = this.wrapper.querySelector('pre');
		if (preElement) {
			const codeElement = preElement.querySelector('code');
			if (!codeElement) return;
			
			// Remove existing line numbers
			const existingRows = preElement.querySelector('.line-numbers-rows');
			if (existingRows) {
				existingRows.remove();
			}
			
			if (this.settings.settings.showLineNumbers) {
				preElement.classList.add('line-numbers');
				
				// Create line numbers container
				const rowsContainer = document.createElement('div');
				rowsContainer.className = 'line-numbers-rows';
				
				// Count lines in code
				const lines = codeElement.textContent?.trimEnd().split('\n') || [];
				const startLine = this.file.lines?.start || 1;
				
				// Create spans for each line
				lines.forEach((_, index) => {
					const span = document.createElement('span');
					span.textContent = (startLine + index).toString();
					rowsContainer.appendChild(span);
				});
				
				// Insert before code element
				preElement.insertBefore(rowsContainer, codeElement);
			} else {
				preElement.classList.remove('line-numbers');
			}
		}
	}

	private tryToggle() {
		const lineCount = (this.file.snippetContent.match(/\n/g) || []).length;
		const open = lineCount < this.settings.settings.autoOpenThreshold;
		this.toggle(open);
	}
}
