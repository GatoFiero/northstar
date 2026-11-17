---
name: bug-report
description: Capture a reported defect in the project's authoritative bug backlog. Use when asked to log a bug; leave diagnosis and fixes to a separate task.
---

Capture the report without investigating code or proposing fixes. Use the destination specified by the user or the backlog established by project instructions and decisions. If that is the adopted `documents/bugs.md`, follow the file workflow below. If an unrelated project has no established destination, return a draft and ask where to file it before creating a backlog.

For a tracker, search for an existing issue there. Use the tracker's fields, identifiers and duplicate policy to capture the details in steps 1–4. Return the resulting issue link and finish here; steps 5–6 describe file-backed entries. If the required access or authorization is missing, return a draft and any known link. Report it filed only after the write succeeds. Update a local index only if the project requires links there.

## 1. Read the report

The description is in the user's request. If it's empty, ask "What broke?" and wait.

A single message may describe more than one bug. If so, split them and log each as its own entry.

## 2. Check the shape

**Is it a bug?** A bug is broken behavior. If the report is really new behavior ("it'd be nice if…", "add a way to…"), say so in one line and ask: log it as a bug anyway, or note it as a feature idea for the next planning session? If feature, stop — do not write it to bugs.md.

**Duplicate?** For the file backlog, check its `## Open` section. For a tracker, check open issues in the selected project. If an entry looks like the same bug, show its ID and title and confirm how to record the new detail unless the project or user already specifies this.

## 3. Fill gaps — one burst at most

Each entry needs: title, severity, repro, expected/actual. Infer what you can from the description. If repro or severity can't be inferred, ask for the missing ones in a single message — never more than one round of questions. If the developer skips a field, leave it as `?` and log anyway.

Severity guide:
- `blocker` — breaks a flow, loses data, or would embarrass in a demo
- `annoying` — wrong, but there's a workaround
- `cosmetic` — looks off, behavior is fine

## 4. Guess the area

List the files in `documents/capabilities/` and pick the capability whose name best fits where the bug shows up (e.g. a login problem → `auth`, bad numbers on a report → `analytics`). Name only — don't read the docs. Leave blank if unclear.

## 5. Write the entry

Count only real bug entry headings under Open and Closed; ignore fenced examples and IDs mentioned in prose. Choose one above the highest existing number, or `B-001` if both sections are empty.

Append to the end of the `## Open` section (replace the `*(none yet)*` placeholder if present), using the format at the top of the file:

```markdown
### B-NNN — Short title
- **Found:** YYYY-MM-DD, <context from the report, e.g. app testing>
- **Severity:** <severity>
- **Area:** <capability or blank>
- **Status:** open
- **Repro:** <steps>
- **Expected / Actual:** <expected> / <actual>
```

Use today's date. Keep the title under ~8 words and the lines short.

## 6. Confirm

Reply with one line per logged bug: `Logged B-NNN — <title> (<severity>)`. Then stop.
