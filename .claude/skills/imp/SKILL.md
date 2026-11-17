---
name: imp
description: Implement an approved Northstar scratchpad/feature-spec.md, one numbered item at a time with verification and progress tracking. Use to execute that spec or a selected item, not to start an unplanned feature.
allowed-tools: Read, Edit, Write, Glob, Bash(go build ./...), Bash(go vet ./...), Bash(npm run build), Bash(npm run lint), Bash(cargo build), Bash(cargo clippy), Bash(python -m py_compile), Bash(git diff --name-only)
---

# Implement a Northstar spec

Execute the approved scope in small, independently verified iterations. The spec checkboxes are the execution record; do not create a competing task ledger.

## Load and resolve scope

Read `scratchpad/feature-spec.md`, applicable project instructions, relevant project decisions, and touched packages' `DECISIONS.md` files. For a feature spec, read its named roadmap and capability; for a bug spec, read the listed bugs and their repro steps in `documents/bugs.md`.

- If the spec is absent, unresolved, or not approved for execution, explain the missing prerequisite and use `draft-spec` or `squash` as appropriate. Do not invent a plan and implement it.
- Use the requested item or range. Otherwise start at the first unchecked numbered action item and continue through the current commit group. An explicit single-item request ends after that item.
- Respect dependencies before jumping to a later item. A checked item is not an instruction to implement it again.
- On resumption, inspect current files, Git status, and recorded verification before trusting checkboxes. Preserve unrelated user changes.
- Check whether choices would contradict decisions or obstruct remaining roadmap steps. Resolve substantive conflicts with the developer before coding.

## Implement and verify one item

1. State the item's purpose briefly, then implement only its named files and behavior. Stop for a scope decision if additional work is required. Revert only your own accidental out-of-scope edits, preserving existing work.
2. Review the result for correctness, edge cases, error handling, security, and project conventions. Record concrete findings with file and line evidence. Fix blocking defects within scope before continuing; carry optional findings to the checkpoint.
3. Discover validation commands from project instructions, scripts, and CI. Use the project's package manager and working directory. Run the build/lint checks appropriate to the item and relevant existing tests. For documentation or configuration changes, validate structure and references instead of inventing a build command.
4. Record commands, outcomes, and any unavailable checks. A skipped check is not a pass. If required validation fails or cannot run, stop before marking the item verified or advancing dependent work.
5. Mark only the implemented and verified action item `[x]`. Record meaningful decisions where they apply, including why and any constraint. Avoid entries for routine implementation details.

Do not implement the next item until this iteration's review, verification, and tracking are complete. Then continue automatically within the approved range and commit group.

## Progress and checkpoints

Read [progress rules](references/progress.md) when the spec finishes or a bug's tagged items finish, before updating roadmaps, acceptance criteria, or bug status.

- At a commit-group boundary, present accumulated findings, changed files, verification, and the spec's suggested commit message. Stop for review before the next group. Do not commit automatically.
- At the end of the requested range, report completed items, pending work, findings, and validation. If findings need a decision, ask once with concrete options.
- Provide manual checks with observable expected results when useful. Keep unperformed manual or device checks explicitly pending; a checklist is not evidence they passed.
- Flag decisions that affect future roadmap steps, capability requirements, or the vision. Propose precise amendments and obtain agreement before changing those commitments.
