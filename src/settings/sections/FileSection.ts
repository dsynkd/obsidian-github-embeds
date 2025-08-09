import { BaseSection } from './BaseSection';
import { ResettableSetting } from '../utilities';
import { DefaultSettings } from '../defaults';

export class FileSection extends BaseSection {
	protected title(): string | undefined {
		return 'Files';
	}
	protected onload(): void {
		const { containerEl, plugin } = this;

		let thresholdSetting: ResettableSetting | null = null;

		new ResettableSetting(containerEl)
			.setName('Show File Embed Heading')
			.addResettableToggle(
				(toggle) => {
					toggle.setValue(plugin.settings.showHeading).onChange(async (value) => {
						await plugin.modifySettings((settings) => {
							settings.showHeading = value;
						});
						// Show/hide the threshold setting based on the toggle
						if (thresholdSetting) {
							thresholdSetting.settingEl.style.display = value ? '' : 'none';
						}
					});
				},
				() => DefaultSettings.showHeading,
			);

		thresholdSetting = new ResettableSetting(containerEl)
			.setName('Snippet preview threshold')
			.setDesc('The maximum number of lines a file snippet can have before it defaults to closed.')
			.addResettableText(
				(text) => {
					text.inputEl.setAttr('type', 'number');
					text.inputEl.setAttr('min', 0);
					text.inputEl.setAttr('step', 1);

					text.setPlaceholder('Enter a number')
						.setValue(this.plugin.settings.autoOpenThreshold.toString())
						.onChange(async (value) => {
							if (value.trim().length === 0) {
								return;
							}

							const threshold = Math.max(Math.floor(parseInt(value)), 0);
							if (isNaN(threshold)) {
								text.setValue(this.plugin.settings.autoOpenThreshold.toString());
								return;
							}

							text.setValue(threshold.toString());
							await this.plugin.modifySettings((settings) => {
								settings.autoOpenThreshold = threshold;
							});
						});
				},
				() => DefaultSettings.autoOpenThreshold.toString(),
			);

		// Set initial visibility of the threshold setting
		thresholdSetting.settingEl.style.display = plugin.settings.showHeading ? '' : 'none';
	}
}
