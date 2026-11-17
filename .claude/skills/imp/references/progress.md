# Updating completion records

Use the spec's exact `Roadmap Step:` or `Bugs:` identity. Do not guess from similar titles. Preserve unrelated entries and user edits.

## Feature specs

Only after every numbered action item is implemented and verified:

1. Mark the identified per-capability roadmap step `- [x] complete`.
2. Update its corresponding master-roadmap checkbox. If a match is ambiguous, report it rather than changing a plausible entry. If no entry exists, report the missing mapping for coherence review.
3. Mark capability acceptance criteria only when evidence demonstrates that particular criterion. Record relevant tests or the developer's reported manual result. Leave manual, deployment, and hardware acceptance pending when unverified, even if implementation is complete.

Roadmap completion records implementation; capability acceptance records demonstrated behavior. Explain this distinction when statuses differ.

## Bug specs

Skip roadmap updates. For each listed bug, inspect all action items tagged with its ID. Once they are implemented, verify the original repro or an equivalent regression check. Only with that evidence move the entry from `## Open` to `## Closed`, remove its status line, and add `- **Closed:** YYYY-MM-DD — fixed (spec: <title>; verified: <check>)`.

If reproduction remains unavailable, keep the bug open with status `in spec` and a note that implementation is complete but verification is pending. Do not represent static reasoning or a passing compile as a reproduced fix.
