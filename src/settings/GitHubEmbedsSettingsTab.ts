import { App, PluginSettingTab } from 'obsidian';
import GithubEmbedsPlugin from '../main';
import { FileSection, GithubSection, IssueSection } from './sections';

export class GitHubEmbedsSettingsTab extends PluginSettingTab {
	constructor(
		app: App,
		public plugin: GithubEmbedsPlugin,
	) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new GithubSection(this);
		new FileSection(this);
		new IssueSection(this);
	}
}
