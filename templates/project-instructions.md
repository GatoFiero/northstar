# Northstar workflow for this project

Merge the parts that fit into the project's existing `AGENTS.md` (Codex) or `CLAUDE.md` (Claude Code). Add the project's actual stack, validation commands, working directories, and any device or deployment acceptance requirements. Keep existing project rules and sources of truth.

**Starting or resuming work.** Check the current branch, working tree, relevant issue or PR (including its base), and the current milestone in `documents/roadmaps/master.md`. Then read the relevant capability, roadmap step, decisions and local spec. Use these records to identify the next unfinished action. If the request is a small standalone edit, use only the pieces that help.

**Where project knowledge lives.**

For a recurring task, look for a matching entry in `documents/workflow-lessons.md` if the file exists, or in the relevant project runbook. Apply it only when its trigger and exceptions fit the live situation. When a repeated mistake or useful correction surfaces, suggest a focused `improve-workflow` comparison at handoff.

- `documents/northstar.md`: vision, users, boundaries and capability map; create it with `draft-northstar` when needed.
- `documents/capabilities/<name>.md` and `documents/roadmaps/<name>.md`: requirements, acceptance criteria, and the order of implementation. The master roadmap orders steps across capabilities.
- `documents/decisions/<topic>.md` for decisions shared across this project and `<package>/DECISIONS.md` for local ones. Record consequential choices, alternatives and constraints before the session ends.
- `documents/bugs.md` and `documents/ideas.md`: separate broken behavior from proposed features. If the project already uses an issue tracker, document which record is authoritative and link it rather than starting a competing queue.

**Doing the work.** Review a spec for one roadmap step before implementing it. Continue within the agreed scope; ask when a new decision changes it. Use project-defined checks and record the result. Keep manual or device acceptance pending until someone actually observes the behavior.

**Local working files.** Keep the active spec and reports under `scratchpad/` in the target project. Put developer action lists in `scratchpad/action-items.md` when helpful; preserve unfinished items. Add `scratchpad/*.md` to the project's ignore rules. Those files do not accompany a fresh clone.

**Handing off mid-step.** When work must survive a new checkout, use an authorized tracked issue, PR or project handoff document (for example `documents/handoff.md`). Record the branch and commit, exact step or bug IDs, approved numbered items and their completion evidence, pending acceptance and next action. On resume, restore the approved items to `scratchpad/feature-spec.md`, create the directory if needed, and verify the checkpoint against the live branch before continuing. Ask for any missing scope or evidence.
