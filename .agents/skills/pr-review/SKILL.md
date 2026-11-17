---
name: pr-review
description: Review a GitHub pull request or branch, run its available project checks, and report merge readiness for a specific revision with findings and verification gaps. Do not apply source fixes.
---

# Review a pull request or branch

Review changes, run the project’s checks, and write `scratchpad/pr-review-report.md`. Leave source fixes to a separate implementation task. Use a connected GitHub tool or authenticated `gh` for remote metadata, patches, and CI results. A local checkout can also supply commits and diffs.

## Identify what to review

- For a PR number or URL, read the PR from the target repository and record its base and head repositories, branch names and commit SHAs. Use the PR’s recorded base, including a parent branch in a stack.
- For a branch, use an explicit comparison base first, then the branch’s existing PR base or established parent, then the verified repository default. When no branch is specified, use the current branch. Resolve current commits and clarify conflicting stack information.
- For a **committed branch or PR review**, run checks from a clean checkout of the recorded head SHA. If the current checkout is dirty or at another revision, use an isolated worktree at that SHA. Never discard another person’s edits. For an explicitly local working-tree review, include staged, unstaged and relevant untracked changes, and label the results with that local state.
- If an exact checkout is unavailable, review the remote patch and report local tests as `NOT RUN`. Identify any GitHub CI evidence by the SHA it actually tested. A synthetic merge build and a head-commit build can differ.

## Review the change

Read the base-to-head patch (`git diff --find-renames <base>...<head>` or the equivalent GitHub PR diff). Inspect added and removed lines, renames and deleted files. Load surrounding code, callers, tests or the pre-change version where a hunk depends on them. For truncated patches, retrieve the missing file patches or compare the blobs at the pinned revisions; identify any remaining coverage gap.

Read applicable `AGENTS.md`, capability documents, and project or package decisions. Trace the behavior the change introduces or removes. Consider correctness, error handling, concurrency, security, resource cleanup, and documented contracts. Apply project language and style conventions. For each finding, describe the trigger, effect and suggested fix, with a path and line on the appropriate side of the diff.

## Run the project’s checks

Discover the build, lint, test, integration, and end-to-end commands from project instructions, scripts, workspace manifests, lockfiles and CI. Use the declared working directory, package manager and environment. Run the applicable project suites, including full suites required by project policy. If a project has only documents or workflow skills, use its published validation commands.

Record the command, exit status and relevant output for each run. Report a missing suite as **not configured** and an unavailable or skipped configured check as **NOT RUN** with the reason. Keep results from alternative commands distinct from required checks. Respect user and repository constraints on starting services and accessing databases. For a possible pre-existing failure, reproduce the affected check on the base revision in isolation when practical. State what remains uncertain if comparison is unavailable.

## Present the report

Write the report before triage. If the project filesystem is unavailable, return the report in chat with its intended path. Include:

- Target, base/head SHAs, working-tree state and patch coverage.
- Commands and results, including unavailable checks and exact-revision CI evidence.
- **Blockers**, **Must-have**, and **Nit picks** with supporting evidence. State clearly when there are no findings. Distinguish an observed regression from a pre-existing failure or an environment limitation.
- A verdict of **Ready to merge**, **Blocked** (with reasons), or **Verification incomplete**. Do not mark a revision ready when required checks are unavailable.

Present proposed blockers for triage and record any agreed follow-up without erasing observed failures or pending checks. Propose a decision entry only when a finding reveals a durable project constraint. For a live PR, recheck the head before an external review or merge recommendation. If it moved, refresh the affected comparisons and checks or explicitly scope the report to the earlier commit. Post to GitHub only when requested, then return the report path or comment URL.
