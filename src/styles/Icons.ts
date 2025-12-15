import commentIcon from 'assets/comment.svg';
import prDraftIcon from 'assets/git-pull-request-draft.svg';
import prOpenIcon from 'assets/git-pull-request.svg';
import prClosedIcon from 'assets/git-pull-request-closed.svg';
import prMergedIcon from 'assets/git-merge.svg';
import issueDraftIcon from 'assets/issue-draft.svg';
import issueOpenIcon from 'assets/issue-opened.svg';
import issueClosedIcon from 'assets/skip.svg';
import issueCompletedIcon from 'assets/issue-closed.svg';
import issueReopenedIcon from 'assets/issue-reopened.svg';

/**
 * A collection of GitHub icons.
 */
export const Icons = {
	'comment': commentIcon,
	'pr-draft': prDraftIcon,
	'pr-open': prOpenIcon,
	'pr-closed': prClosedIcon,
	'pr-merged': prMergedIcon,
	'issue-draft': issueDraftIcon,
	'issue-open': issueOpenIcon,
	'issue-closed': issueClosedIcon,
	'issue-completed': issueCompletedIcon,
	'issue-reopened': issueReopenedIcon,
} as const;

export type IconName = keyof typeof Icons;
