# Obsidian GitHub Embeds

Embed GitHub issues, PRs, and code snippets directly in Obsidian.

https://github.com/user-attachments/assets/cb2baf55-a379-4b89-b252-0ef42a982ef9

## Usage
1. Create a GitHub Personal Access Token [here](https://github.com/settings/tokens?type=beta) and paste it in the Settings.
2. Create a code block with the `github-embed` prefix and include the URL as such:

`````
```github-embed
PASTE-URL-HERE
```
`````

## Details

This plugin currently supports the following URL formats:

- Issue: `https://github.com/<OWNER>/<REPO>/issues/<ISSUE NUMBER>`
- PR: `https://github.com/<OWNER>/<REPO>/pull/<PR NUMBER>`
- File snippet: `https://github.com/<OWNER>/<REPO>/blob/<REF>/<PATH TO FILE>`

Snippets can be limited to one or more lines. If we wanted a file to only show line 12, we could append our URL with `#L12`. To show multiple lines, like 12 through 19, we could change this to read `#L12-L19`.

> **Note**
> While we can scope our files to a particular set of lines, the entire file will still need to be requested. This may result in poor performance for really large files.

By default, the token will be generated with the **Repository access** set to **Public repositories (read-only)**. To allow this plugin to also work with private repositories, change the access to **All repositories** and give it at minimum the following repository permissions:

- **Contents** (*Read-only*)
- **Issues** (*Read-only*)
- **Pull requests** (*Read-only*)

With the token created, navigate to this plugin's settings and paste it into the token text field.
