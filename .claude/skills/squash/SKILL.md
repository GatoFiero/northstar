---
name: squash
description: Triage defects from the project's bug backlog and draft a point-budgeted fix spec. Use for Northstar bug planning, not Git squash commits or immediate implementation.
allowed-tools: Read, Edit, Write, Glob, Grep, Bash(git diff --name-only), Bash(git log)
---

You are a bug triage and planning agent. Your job is to turn a batch of open bugs into one `/imp`-ready spec. You investigate and plan — you do not write code.

## 1. Pick the queue

Use the backlog named in project instructions or decisions. For a file backlog, use open entries under `## Open` in `documents/bugs.md`. For a tracker, read the issues or supplied snapshots. Use their stable identifiers in the spec header and action tags, including the repository or project when ambiguous. Use the tracker's fields and lifecycle for every status update below. Make external changes only within the authorized task. Report unavailable updates as pending and preserve any local index as links only.

Exclude work already in a spec from new triage. If asked to resume a selected bug whose local spec is missing, check the linked issue, PR or project handoff and use the recovery rules in `../imp/SKILL.md`. An absent local file does not reopen a bug.

Use the user's request to select the queue:
- **Empty** — all open bugs, max 5 included
- **A number** (`/squash 3`) — all open bugs, max N included
- **Bug IDs** (`/squash B-003 B-007`) — only those bugs, in that order
- **A capability name** (`/squash analytics`) — only bugs with that `Area`, max 5 included

Order the queue: `blocker` → `annoying` → `cosmetic`, then oldest `Found` date first.

If the queue is empty, say so and stop.

**Check the existing spec.** If `scratchpad/feature-spec.md` exists and has any unchecked `- [ ]` items, warn: "The current spec (<title>) has N unfinished items. Overwrite it?" Wait for an answer. Stop if no.

Show the queue as a numbered list (`B-NNN — title (severity, area)`) and the budget (bug cap + 13-point spec max). Then start.

## 2. Work each bug, one at a time

For each bug in order:

**a. Load context.** If `Area` is set, read that capability doc. Read `<package>/DECISIONS.md` for every package you end up looking at — a fix must not violate those constraints. Scan `documents/decisions/` for topics that overlap.

**b. Find the root cause.** Read the code along the bug's repro path. Use available, authorized reproduction tools when useful; otherwise reason from the code and label the diagnosis as static, unverified evidence. State:
- **Root cause** — file:line and one or two sentences on why it breaks
- **Confidence** — high (found the line) / medium (likely cause, not proven) / low (can't find it)

If confidence is low, say what's missing (e.g. "need the console error", "can't tell which widget"). Offer to add a note to the bug entry and skip it.

**c. Propose the fix.** List the action items it needs, one function each, with point weights (see the point scale in `../draft-spec/SKILL.md`). If this bug shares a root cause or a function with a bug already included, say so and merge the items instead of duplicating them.

**d. Ask.** Show the bug's points and the running total: `B-007: 3 pts — total 8 / 13`. Then ask:

> **Include**, **defer**, **won't fix**, or **feature**?

Wait for the answer before moving to the next bug.

- **Include** — add its items to the spec plan.
- **Defer** — leave it open, move on. If you learned something useful (root cause, file:line), offer to add a `- **Notes:**` line to the entry.
- **Won't fix** — ask for a one-line reason. Move the entry to `## Closed` with `- **Closed:** YYYY-MM-DD — won't fix: <reason>`.
- **Feature** — it's new behavior, not broken behavior. Propose a roadmap step (capability, step title, one-paragraph description) to add to the matching `documents/roadmaps/<capability>.md`. On confirm, add it and move the bug entry to `## Closed` with `- **Closed:** YYYY-MM-DD — moved to <capability> Step N`. If no capability fits, note it for the next planning session and leave the bug open.

**Stop the loop when** the bug cap is reached, the queue is empty, or including the next bug would push the total past 13 points. In the last case, say so and ask: include it anyway, or stop here? The developer can go over the max.

If no bugs were included, say so and stop — don't write a spec.

## 3. Write the spec

Overwrite `scratchpad/feature-spec.md` using the `feature-spec.md` template in `../draft-spec/SKILL.md`, with these differences:

- **Title:** `# Bug Squash — YYYY-MM-DD`
- **Header:** replace the `**Roadmap Step:**` line with `**Bugs:** B-003, B-007` (every included bug, comma-separated). `/imp` reads this line to close the bugs. Keep the `**Points:**` line.
- **Feature Summary:** replace it with a `## Bugs` section — one short block per included bug: ID, title, root cause (file:line), and the fix in one sentence.
- **Action items:** tag each with every bug it fixes, after the points: `- [ ] **1. \`FunctionName\`** (line XX) · 2 pts · B-003`. An item fixing two bugs lists both: `· B-003, B-007`.
- **Data Flow:** only include it if a fix changes how data moves. Otherwise omit the section.
- **Quick Start:** keep it. Its test step is a manual repro check per bug ("follow B-003's repro → expected result now happens").

Unit tests are out of scope.

## 4. Mark the bugs

For a file backlog, change each included entry from `**Status:** open` to `**Status:** in spec`. For a tracker, apply its documented triage transition if one exists and report any pending update.

## 5. Hand off

Summarize in a few lines: bugs included, points total, bugs deferred / won't-fix / rerouted. Then say: "Run `/imp` to start." Stop.
