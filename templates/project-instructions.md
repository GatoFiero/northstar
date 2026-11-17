# Northstar workflow for this project

Merge the parts that fit into the project's existing `AGENTS.md` (Codex) or `CLAUDE.md` (Claude Code). Add the project's actual stack, validation commands, working directories, and any device or deployment acceptance requirements. Keep existing project rules and sources of truth.

**Starting or resuming work.** Check the current branch, working tree, relevant issue or PR (including its base), and the current milestone in `documents/roadmaps/master.md`. Then read the relevant capability, roadmap step, decisions and local spec. Use these records to identify the next unfinished action. If the request is a small standalone edit, use only the pieces that help.

**Where project knowledge lives.**

- `documents/northstar.md`: vision, users, boundaries and capability map; create it with `draft-northstar` when needed.
- `documents/capabilities/<name>.md` and `documents/roadmaps/<name>.md`: requirements, acceptance criteria, and the order of implementation. The master roadmap orders steps across capabilities.
- `documents/decisions/<topic>.md` for cross-project decisions and `<package>/DECISIONS.md` for local ones: record consequential choices, alternatives and constraints before the session ends.
- `documents/bugs.md` and `documents/ideas.md`: separate broken behavior from proposed features. If the project already uses an issue tracker, document which record is authoritative and link it rather than starting a competing queue.

**Doing the work.** Review a spec for one roadmap step before implementing it. Continue within the agreed scope; ask when a new decision changes it. Use project-defined checks and record the result. Keep manual or device acceptance pending until someone actually observes the behavior.

**Local working files.** Keep the active spec and reports under `scratchpad/` in the target project. Put developer action lists in `scratchpad/action-items.md` when helpful; preserve unfinished items. Add `scratchpad/*.md` to the project's ignore rules. Those files do not accompany a fresh clone.

**Handing off mid-step.** When work must survive a new checkout, put a short note in the existing tracked issue, PR description or project handoff document, using a location authorized for this task. Record the branch and commit, exact step, approved scope, checks already run, any acceptance still pending, and the next action. If an approved spec exists only in scratchpad, carry it into the new checkout or save its agreed contents in a durable project record. On resume, recheck the live checkout; a handoff or checked box alone does not prove current behavior.
