# Decision: Development Workflow

These are starter decisions. Keep the project's documented tracker, milestones and checks when adopting Northstar.

## Use one authoritative bug backlog

By default `documents/bugs.md` holds `B-NNN` IDs, severity and status. If this project uses an issue tracker, record the tracker name and where to find it in project instructions. Use its identifiers, state and closure rules. A local index may link to issues.

- `bug-report` captures the defect in the selected backlog.
- `squash` triages open bugs and writes their stable identifiers in the spec's `Bugs:` header.
- `imp` verifies the original repro or an equivalent regression before recording closure under project policy.

**Why:** Intake, triage and implementation need to refer to the same record.

**Constraint:** Keep broken behavior in the selected bug backlog, working-but-wrong code in master roadmap Maintenance, and new behavior in a roadmap step.

## Feature ideas go through `/ideas`, parked ones live in `documents/ideas.md`

`/ideas` splits a ramble into ideas, gut-checks each against the northstar, decisions, cost, and roadmaps, then routes approved ones: a roadmap step (plus a master entry), a capability scope change, or a stub capability doc for `/draft-capability`. Parked ideas go in `documents/ideas.md`. Dropped ideas aren't written down.

**Why:** Ideas left in chat or agent memory are invisible to planning sessions and other skills.

**Constraint:** No edits without approval of the exact text. `/ideas` never writes a full capability doc — only a stub.

## `/coherence` checks that docs and code agree

One skill checks that the northstar, decisions, capabilities, roadmaps, DECISIONS.md files, backlogs, memory, and code agree — both structure (pairings, checkbox sync, links) and meaning (contradictions, "done" steps that aren't built, code that breaks a decision). Modes: delta since the last run (default), `since <ref>`, `full` (each capability; optional authorized delegation), or one capability. Each finding names the workflow that fixes it.

**Why:** Drift is mostly in meaning, not structure — a doc claiming something is deferred after it was built.

**Constraint:** Report-only. It writes `scratchpad/coherence-report.md` before presenting, and only applies direct edits the developer approves. Every other fix goes through its own workflow. The last-run marker lives in that report, which is local (scratchpad is gitignored) — a fresh clone starts with `full` or `since <ref>`.

## Spec size is measured in points, not function count

Each spec action item gets a weight: 1 trivial, 2 standard, 3 new logic, 5 risky (schema, concurrency, external API, cross-package contract). Suggested max is **13 points** per spec. `/draft-spec` and `/squash` both flag specs over the max and offer a split, but the developer can proceed anyway.

**Why:** A function count treats a one-line field add the same as a schema migration. Points track how dense a spec actually is.

**Constraint:** The point scale lives in the installed `draft-spec` skill. `squash` references the same scale.

## Portable skill maintenance and completion evidence

Northstar supplies the skills. This project's durable records are its own documents and issue history. For a new checkout, restore the approved spec and its checkpoint from a project handoff before resuming implementation.

Implementation checkboxes require completed work and applicable checks. Capability acceptance and bug closure require evidence of the claimed behavior; pending manual or device verification stays open. A capability-only coherence run must not advance a global delta baseline.

**Why:** Portable runtimes have different tools and session storage; consistent files and explicit evidence prevent false completion and lost review scope.
