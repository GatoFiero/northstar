---
name: utest
description: Plan, write, and run focused unit tests for changed behavior on the current branch. Use when the user requests new unit coverage; approve the plan once, then execute it without per-test approvals.
---

## Rules (always on)
- Work from the branch diff before proposing any tests.
- Developer approval happens once, at the test plan — not per test. After the plan is approved, implement candidates one at a time, running each immediately after writing it, without stopping to ask.
- Target only impacted behaviors — no bulk generation or unrelated scaffolding.
- Keep tests isolated and deterministic: mock collaborators, avoid external I/O.
- Use clear naming and AAA style (Arrange / Act / Assert); prefer public APIs over reflection.
- **Write tests to files — never output test code only in chat.**
- **Run tests immediately after writing and report results.**
- **Surface any failures before moving to the next test.**

## Workflow

1. **Find the test command** — Read applicable project instructions, test configuration and CI for the changed package. Use its declared working directory, package manager and test runner. Check nested workspaces and existing tests for equivalent coverage. If no runner is configured, explain what can be tested with the project's toolchain before proposing new tooling.

2. **Read the spec** — If `scratchpad/feature-spec.md` exists, read it for feature context and intended changes. Note which functions and files are in scope.

3. **Gather changes** — Use the requested comparison base, the existing PR's base or the established parent in a stack. Otherwise resolve the verified repository default from a GitHub connector, authenticated CLI, or the Git remote HEAD. Report ambiguity instead of guessing a branch name. Read `git diff --find-renames <base>...HEAD` and inspect staged, unstaged and relevant untracked files. Include deleted behavior and changed contracts when identifying useful cases.

4. **Create test plan** — Propose cases that would catch a concrete regression and are missing from the existing suite. Write it to `scratchpad/test-plan.md` containing:
   - Test strategy overview
   - All test candidates with coverage areas (happy path, edge cases, error paths)
   - Status column for each: `pending` / `created` / `passed` / `failed` / `not run`

5. **Present test plan** — Use the approved cases if the developer already selected them. Otherwise present the plan for review once before writing tests.

6. **Implement the next candidate** — Once the plan is approved, work through candidates in order without asking again. For each: write only that test to the appropriate test file, keeping the diff minimal. Follow stack conventions:
   - **Go**: standard `testing` package; `testify/assert` if already a dependency; table-driven tests where appropriate
   - **TS**: match the existing test framework (Jest, Vitest, etc.)
   - **Rust**: `#[cfg(test)]` module with `#[test]` functions
   - **Python**: `pytest` with fixtures; `unittest.mock` for collaborators

7. **Update test plan** — Mark the test as `created` in `scratchpad/test-plan.md`.

8. **Run the test** — Execute the test command scoped to the new test if possible; otherwise run the full suite. Record the command, working directory and result. If a prerequisite is unavailable, mark the case `not run` with the reason.

9. **Update status** — For a completed run, mark `passed` or `failed` in the test plan. If failed, surface the failure details, propose a fix, and continue — no need to pause for approval unless the fix requires a design choice only the developer can make.

10. **Iterate** — Repeat steps 6–9 for the next candidate. When all candidates are done, provide a final summary of the test plan status.

## Output
- `scratchpad/test-plan.md` — strategy and per-test status tracking
- Test files written to the appropriate test directories in the codebase
- Command and outcome for each new test, including any unverified cases
- Any bugs found during test execution surfaced immediately

## Error Handling
- If test creation fails, report the specific error and retry with an adjusted approach.
- If the runner is unavailable, record the missing prerequisite and the exact project command for a later run.
- If no existing test structure is found, suggest where to create it before proceeding.
