import { sanitizeHTMLToDom, Setting } from 'obsidian';
import { BaseSection } from './BaseSection';
import styles from './GithubSection.module.scss';

export class GithubSection extends BaseSection {
	protected title(): string | undefined {
		return 'GitHub';
	}
	protected onload() {
		this.createTokenSetting();
	}

	private createTokenSetting() {
		const { containerEl, plugin } = this;

		const desc = new DocumentFragment();
		desc.append(
			sanitizeHTMLToDom(`
				Used to authenticate with the GitHub API.
				Create one <a href="https://github.com/settings/tokens?type=beta">here</a>.
			`),
		);

		let tokenInput: HTMLInputElement | null = null;
		new Setting(containerEl)
			.setName('GitHub personal access token')
			.setDesc(desc)
			.addText((text) => {
				tokenInput = text.inputEl;
				text.inputEl.type = 'password';

				text.setPlaceholder('Enter your token')
					.setValue(plugin.settings.githubToken ?? '')
					.onChange(async (value) => {
						const token = value.trim();
						await plugin.modifySettings((settings) => {
							settings.githubToken = token ? token : undefined;
						});
					});
			})
			.addExtraButton((button) => {
				const toggleButton = (isTokenHidden: boolean) => {
					button
						.setIcon(isTokenHidden ? 'eye' : 'eye-off')
						.setTooltip(isTokenHidden ? 'Show token' : 'Hide token');
				};

				toggleButton(true);

				button.onClick(() => {
					if (!tokenInput) {
						return;
					}

					if (tokenInput.type === 'password') {
						tokenInput.type = 'text';
						toggleButton(false);
					} else {
						tokenInput.type = 'password';
						toggleButton(true);
					}
				});
			});
	}
}
