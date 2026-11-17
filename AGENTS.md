# Working on Northstar

Northstar ships a workflow for other repositories. The files in `documents/` are starter documents; their example milestone and backlog do not describe the work of maintaining Northstar. Instructions to merge into an adopting project live in [templates/project-instructions.md](templates/project-instructions.md).

- Edit shared skill instructions and references in `.claude/skills/<name>/`. Run `node scripts/sync-skills.cjs` to generate their Codex copies in `.agents/skills/`. Edit Codex picker labels directly in `.agents/skills/<name>/agents/openai.yaml`. When renaming a skill, review and remove obsolete mirror files explicitly.
- Use Node.js 20+ for the maintainer checks. Run `node scripts/sync-skills.cjs --check` and `node --test scripts/sync-skills.test.cjs`. For a change to discovery or packaging, also run `node scripts/check-codex.cjs` with Codex CLI on PATH.
- Keep the repo-local and plugin routes on the same skill files. The plugin root is `.agents/`; the catalog at `.agents/plugins/marketplace.json` points there. Adopters copy the skills or install the plugin; they do not need both.
- When changing a workflow, preserve its review checkpoints and test the affected decision on a disposable project. Report what was actually observed: loading a skill, executing a workflow, passing a check, and manual acceptance are different results.
- Keep project-specific specs, reports and progress in the adopting project. Never write them into the installed package.
