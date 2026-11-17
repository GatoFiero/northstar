# Northstar

Northstar gives a coding project a memory that stays with the code. It provides 15 skills for Codex and Claude Code, plus Markdown conventions for a project's vision, decisions, roadmap and verification. Use the full workflow for work that benefits from a spec and review. A one-line fix does not need a planning ceremony.

## Start in Codex

**For one project, use repository-local skills.** In the target Git repository:

1. Copy the **individual skill folders** from Northstar's [`.agents/skills/`](.agents/skills/) into the target's `.agents/skills/`. Check existing names before merging. Nothing needs to be installed globally.
2. Merge the relevant [starter documents](documents/) and [project instructions](templates/project-instructions.md) into the project and its existing `AGENTS.md`. Keep its real milestones, issues, stack, and checks. Create `scratchpad/` and add `scratchpad/*.md` to its ignore rules. The root `AGENTS.md` in *this* repository is for Northstar maintainers.
3. Open that **target repository** in Codex. Type `$` in the skill picker and look for **Northstar**. Try `$draft-northstar Help me define who this project is for and what v1 must do.` If you already have a vision, start from the current milestone. A GitHub link in a chat alone does not install anything.

**For several projects, install the skills once as a Codex plugin.** Run these commands from any directory:

```sh
codex plugin marketplace add GatoFiero/northstar
codex plugin add northstar@northstar-workflows
```

Start a new session **in the project you want to work on** and choose the Northstar skill from the picker. The CLI lists plugin skills with names such as `northstar:draft-northstar`. Use the same per-project documents and instructions from step 2. Each project keeps its own milestones, decisions and handoffs. GitHub workflows use the access available in your session. Choose one installation route per project to avoid duplicate entries. To test a local Northstar checkout, register it with `codex plugin marketplace add .` from its root. See the official [skills guide](https://learn.chatgpt.com/docs/build-skills) and [plugin packaging guide](https://developers.openai.com/plugins/build/plugins).

**Claude Code:** use [`.claude/skills/`](.claude/skills/), merge the project instructions into `CLAUDE.md`, and invoke a skill with `/` instead of `$`. On ChatGPT surfaces with installed skills, use the name shown by the `@` picker. This repository is not a listing in the public plugin directory.

## Choose a workflow

| In Codex | What you get |
|---|---|
| `$draft-northstar` | Project vision, users and boundaries in `documents/northstar.md`. |
| `$draft-capability` | A capability's requirements, acceptance criteria and roadmap. |
| `$draft-foundation` | Architecture decisions for a capability that needs them. |
| `$draft-spec` | A reviewable spec for one numbered roadmap step. |
| `$imp` | Implementation of the approved spec or selected item, with checks and progress. |
| `$audit` | Findings on the current changes before fixes are applied. |
| `$utest` | Focused unit tests for agreed behavior. |
| `$pr-create` | A GitHub pull request against the intended base, with validation evidence. |
| `$pr-review` | Review of the actual base-to-head changes and the checks for that revision. |
| `$bug-report` | Capture a defect for later without investigating or fixing it. |
| `$squash` | Triage Northstar backlog bugs into a fix spec. This is not Git commit squashing. |
| `$ideas` | Discuss and route feature ideas into a roadmap or the parked-ideas list. |
| `$coherence` | Find disagreements between project documents, roadmaps, decisions and code. |
| `$catchup` | A digest of merged PRs over a date range or count. |
| `$improve-workflow` | Test a change to a recurring procedure and preserve the supported lesson for future chats in this project. |

On a new feature, the usual path is **vision → capability and roadmap → optional foundation → spec → implementation → audit/tests → pull request**. A spec covers one roadmap step, with one function-sized action per item: 1 point for trivial work, 2 for standard work, 3 for new logic and 5 for risky changes. Above the suggested 13 points, consider splitting the work. Review product and scope decisions before the next stage. [Workflow decisions](documents/decisions/dev-workflow.md) explain the conventions.

## Resume in a new Codex chat

Open the same project and ask: **“Read the current milestone and the relevant issue or PR. Check the branch, working tree, and active spec. Tell me which step is next and which checks are still pending.”** Use `$catchup` when you want to know what *merged*, rather than what is unfinished.

Committed capability, roadmap and decision documents are available in a fresh checkout; ignored `scratchpad/` files are not. Before switching worktrees or machines mid-step, preserve the approved spec or record its scope, branch/commit, verification and next action in the project's existing handoff location. A successful build does not establish that a deployment, device or manual acceptance check passed.

## Improve a recurring workflow

After a correction, try “Use `$improve-workflow` to find out why our release check passed the wrong artifact. Compare the current command with a better one on the same inputs. If the evidence supports the change, adopt it for this project.” The plugin picker lists this skill as `northstar:improve-workflow`.

The skill borrows the comparison and lesson-reuse ideas from [Harness²](https://github.com/google-research/harness2/blob/main/docs/EXPERIMENTS.md). By default, one chat compares one candidate with the existing procedure. Successful lessons go in the relevant project runbook or in `documents/workflow-lessons.md`. Each lesson names its trigger, action, exception and evidence. A fresh chat doing a release check can find that entry through the project's normal instructions. To use lessons across clones, include the adopted guidance in the project's usual version-control workflow.

For projects already using Northstar, merge the lesson lookup paragraph from [the project instructions](templates/project-instructions.md) into the target's existing instructions. The skill can also add that pointer when adopting the first lesson. Occasional retrospectives run on request. A team that wants routine retrospectives can authorize them in project instructions for a specific recurring task.

## Maintain Northstar

Edit shared skills in [`.claude/skills/`](.claude/skills/), then run `node scripts/sync-skills.cjs`. Codex-specific picker metadata belongs in each portable skill's `agents/openai.yaml`. The repo-local and plugin routes share the same files. See [AGENTS.md](AGENTS.md) for mirror checks, regression tests and the optional Codex runtime check.
