---
name: pr-create
description: Prepare and open a GitHub pull request from the current branch when the user requests PR creation. Resolve its actual base, check for an existing PR, and verify the published head.
---

# Open a pull request

Use the connected GitHub tool or authenticated `gh` for repository and PR operations. Use Git for local changes and pushes. If remote writes are unavailable, provide the prepared title, body, base, and head, and report which action is pending.

## Resolve the target

1. Inspect `git status`, the repository and remotes, current branch, and `git rev-parse HEAD`. Identify the head repository as well as the branch (a fork may have the same branch name as the base repository). A PR includes committed work. Preserve unrelated working-tree changes. If intended edits are still uncommitted, follow the user’s existing instructions or clarify which changes belong.
2. Look up open PRs for this exact head repository and branch. If the base matches, compare the PR’s recorded head SHA with the intended commit before returning its URL. Report unpublished local work or update the existing branch if the request includes publishing it. If a different base is requested, report the mismatch before opening a duplicate or retargeting an existing PR. Update a PR only when requested.
3. For a new PR, use the requested base or the established parent of a stacked branch. Otherwise use the base repository’s verified default from GitHub or its remote HEAD. Resolve the current base commit and head commit. If stack evidence conflicts or the base cannot be established, clarify the target.
4. Inspect `git log <base>..<head>` for commits unique to the head and `git diff --find-renames <base>...<head>` for the proposed changes, using the resolved commits. A GitHub compare is an alternative for published commits. Check that the scope matches the request.

## Draft the PR

Follow the repository’s PR template when present. Otherwise use the Northstar sections **Background Context**, **Change Summary**, **Steps to test**, and **Risk mitigation** where relevant. Use an outcome-focused title, normally at most 72 characters. Explain the behavior reviewers need to assess. Draw on the diff, approved spec, relevant decisions and actual validation results. Distinguish checks already run from reproduction instructions or pending checks.

## Publish and verify

1. Compare the live head branch on the chosen remote with the intended local commit. If missing or behind, push using a normal, non-force push to that branch. If rejected, inspect the divergence and preserve remote commits. If the SHAs already match, no push is needed.
2. Open the PR with explicit **base repository**, **base branch**, and **head**, including the head owner for a fork. Respect the requested draft state. For `gh`, use `gh pr create --repo <owner/repo> --base <base> --head <head> --title <title> --body-file <file>` with a fresh temporary file; for the connector, pass the body directly.
3. Read the resulting PR back from GitHub. Check its base, head repository and branch, and head commit against the intended target. Return its URL and any mismatch or pending validation. If creation reports an ambiguous failure, look up the exact head/base pair before retrying.

Send a team notification only if the user explicitly requests it and a configured messaging tool is available.
