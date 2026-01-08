import { sanitizeHTMLToDom, Setting } from 'obsidian';
import { BaseSection } from './BaseSection';

export class GithubSection extends BaseSection {
	protected title(): string | undefined {
		return undefined;
	}
	protected onload() {
		this.createSecretIdSetting();
	}

	private createSecretIdSetting() {
		const { containerEl, plugin } = this;

		const desc = new DocumentFragment();
		desc.append(
			sanitizeHTMLToDom(`
				Select the secret ID that contains your GitHub personal access token.
				Create a token <a href="https://github.com/settings/tokens?type=beta">here</a>.
				You can manage secrets using Obsidian's Keychain settings.
			`),
		);

		new Setting(containerEl)
			.setName('GitHub Secret ID')
			.setDesc(desc)
			.addDropdown((dropdown) => {
				// Get available secret IDs
				const secretIds = this.app.secretStorage.listSecrets();
				
				// Add an empty option
				dropdown.addOption('', 'Select a Secret ID');
				
				// Add all secret IDs
				secretIds.forEach(id => {
					dropdown.addOption(id, id);
				});

				dropdown.setValue(plugin.settings.githubSecretId ?? '')
					.onChange(async (value) => {
						const secretId = value.trim();
						await plugin.modifySettings((settings) => {
							settings.githubSecretId = secretId ? secretId : undefined;
						});
					});
			});
	}
}
