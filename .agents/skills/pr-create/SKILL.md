---
name: pr-create
description: Prepare and open a GitHub pull request from the current branch when the user requests PR creation. Resolve its actual base, check for an existing PR, and verify the published head.
---

# Open a pull request

Use the connected GitHub tool or authenticated `gh` for repository and PR operations. Use Git for local changes and pushes. If remote writes are unavailable, provide the prepared title, body, base, and head, and report which action is pending.

## Resolve the target

1. Inspect `git status`, the repository and remotes, current branch, and `git rev-parse HEAD`. Identify the head repository as well as the branch (a fork may have the same branch name as the base repository). A PR includes committed work. Preserve unrelated working-tree changes. If intended edits are still uncommitted, follow the user’s existing instructions or clarify which changes belong.
2. Look up open PRs for this exact head repository and branch. Resolve the base from the request, an existing PR, or the established parent of a stacked branch. Otherwise use the base repository’s verified default. Clarify conflicting targets. Use the live base commit and the intended head commit.
3. **Before any push**, compare the repository identities and the full branch names. If both match, publishing this head would update the base itself. Choose an unused feature branch in the head repository for the intended commit and repeat the PR lookup for that branch. Leave the base ref and local edits intact. Matching branch names in different repositories are valid (for example, `contributor:main` into `upstream:main`).
4. For an existing PR with the resolved base, compare its published SHA with the intended commit. Return its URL, and report unpublished local work or update its branch if the request includes publication. Report a base mismatch before opening a duplicate or retargeting an existing PR.
5. For a new PR or before publishing updates, inspect `git log <base>..<head>` and `git diff --find-renames <base>...<head>` using the resolved commits. Confirm the head has a unique commit and the patch contains an intended change. A GitHub compare is an alternative for published commits. If either is empty, report that there is nothing to propose and stop before pushing or creating a PR.

## Draft the PR

Follow the repository’s PR template when present. Otherwise use the Northstar sections **Background Context**, **Change Summary**, **Steps to test**, and **Risk mitigation** where relevant. Use an outcome-focused title, normally at most 72 characters. Explain the behavior reviewers need to assess. Draw on the diff, approved spec, relevant decisions and actual validation results. Distinguish checks already run from reproduction instructions or pending checks.

## Publish and verify

1. Compare the live head branch on the chosen remote with the intended local commit. If missing or behind, push using an explicit, non-force refspec: `git push <head-remote> <intended-sha>:refs/heads/<head-branch>`. If rejected, inspect the divergence and preserve remote commits. If the SHAs already match, no push is needed.
2. Open the PR with explicit **base repository**, **base branch**, and **head**, including the head owner for a fork. Respect the requested draft state. For `gh`, use `gh pr create --repo <owner/repo> --base <base> --head <head> --title <title> --body-file <file>` with a fresh temporary file; for the connector, pass the body directly.
3. Read the resulting PR back from GitHub. Check its base, head repository and branch, and head commit against the intended target. Return its URL and any mismatch or pending validation. If creation reports an ambiguous failure, look up the exact head/base pair before retrying.

Send a team notification only if the user explicitly requests it and a configured messaging tool is available.
