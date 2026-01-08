import { Client } from './client';
import { IssueEmbed } from './postprocessing/IssueEmbed';
import { GitHubEmbedsSettingsTab } from './settings/GitHubEmbedsSettingsTab';
import { ErrorEmbed } from './postprocessing/ErrorEmbed';
import { FileUrl, IssueUrl } from './client/types';
import { SettingsProvider } from './settings';
import { FileEmbed } from './postprocessing/FileEmbed';
import { LoadingEmbed } from './postprocessing/LoadingEmbed';
import styles from './styles.scss';
import { EmbedContainer } from './postprocessing/EmbedContainer';
import { Langs } from './utilities';

// Initialize Apollo Client __DEV__ variable
window.__DEV__ = process.env.NODE_ENV === 'development';

export default class GithubEmbedsPlugin extends SettingsProvider {
	private client: Client | null = null;

	private async getGitHubToken(): Promise<string | null> {
		const secretId = this.settings.githubSecretId;
		if (!secretId) {
			return null;
		}
		return this.app.secretStorage.getSecret(secretId);
	}

	async onload() {
		await Langs.initialize(this.app, this);

		await this.loadSettings();
		this.addSettingTab(new GitHubEmbedsSettingsTab(this.app, this));

		this.onSettingsChanged(
			async (_, settings) => {
				const token = await this.getGitHubToken();
				this.client = token ? new Client(token) : null;
			},
			{ immediate: true },
		);

		// Custom codeblock: github-embed
		this.registerMarkdownCodeBlockProcessor('github-embed', async (source, el, ctx) => {
			// Parse the codeblock for a line like: URL: <the-url>
			const sourceSplit = source.split('\n')
			const urlLine = sourceSplit.find(line => line.trim().toLowerCase().startsWith('url:'));
			const url = urlLine ? urlLine.split(':').slice(1).join(':').trim() : source;

			const createContainer = () => new EmbedContainer(el.createEl('p', styles.embedContainer), ctx);

			let showHeading = this.settings.showHeading;
			const showHeadingLine = sourceSplit.find(line => line.trim().startsWith('showHeading:'));
			if(showHeadingLine !== undefined) {
				const showHeadingValue = showHeadingLine.split(':')[1].trim().toLowerCase()
				if(showHeadingValue == 'true') {
					showHeading = true;
				} else if(showHeadingValue == 'false') {
					showHeading = false;
				} else {
					createContainer().setChild((el) => new ErrorEmbed(el, ": Invalid showHeading value."));
					return;
				}
			}

			if (Client.isIssueUrl(url)) {
				await this.createIssueEmbed(url, createContainer());
			} else if (Client.isFileUrl(url)) {
				await this.createFileEmbed(url, createContainer(), showHeading);
			} else {
				createContainer().setChild((el) => new ErrorEmbed(el, ": Invalid URL."));
			}
		});
	}

	private async createFileEmbed(fileUrl: FileUrl, container: EmbedContainer, showHeading: boolean = true) {
		const tryLoad = async () => {
			container.setChild((el) => new LoadingEmbed(el));

			const token = await this.getGitHubToken();
			if (!token || !this.client) {
				container.setChild((el) => new ErrorEmbed(el, 'missing API token', tryLoad));
				return;
			}

			try {
				const file = await this.client.fetchFile(fileUrl);
				container.setChild((el) => new FileEmbed(el, file, this, showHeading));
			} catch (error) {
				container.setChild((el) => new ErrorEmbed(el, error, tryLoad));
				return;
			}
		};

		this.onSettingsChanged(
			async (prev, curr) => {
				if (prev?.githubSecretId !== curr.githubSecretId) {
					// Update client and reload
					const token = await this.getGitHubToken();
					this.client = token ? new Client(token) : null;
					return tryLoad();
				}
			},
			{ immediate: true },
		);
	}

	private async createIssueEmbed(issueUrl: IssueUrl, container: EmbedContainer) {
		const tryLoad = async () => {
			container.setChild((el) => new LoadingEmbed(el));

			const token = await this.getGitHubToken();
			if (!token || !this.client) {
				container.setChild((el) => new ErrorEmbed(el, 'missing API token', tryLoad));
				return;
			}

			try {
				const { data, errors, error } = await this.client.fetchIssue(issueUrl);

				if (error) {
					container.setChild((el) => new ErrorEmbed(el, error, tryLoad));
					return;
				}

				if (errors) {
					const errorMessages = errors.map((e) => e.message || JSON.stringify(e));
					container.setChild((el) => new ErrorEmbed(el, errorMessages, tryLoad));
					return;
				}

				const issue = data.repository?.issueOrPullRequest;
				if (!issue) {
					container.setChild((el) => new ErrorEmbed(el, 'issue or pull request does not exist', tryLoad));
					return;
				}

				container.setChild((el) => new IssueEmbed(el, issue, this));
			} catch (error) {
				container.setChild((el) => new ErrorEmbed(el, error, tryLoad));
				return;
			}
		};

		this.onSettingsChanged(
			async (prev, curr) => {
				if (prev?.githubSecretId !== curr.githubSecretId) {
					// Update client and reload
					const token = await this.getGitHubToken();
					this.client = token ? new Client(token) : null;
					return tryLoad();
				}
			},
			{ immediate: true },
		);
	}
}
