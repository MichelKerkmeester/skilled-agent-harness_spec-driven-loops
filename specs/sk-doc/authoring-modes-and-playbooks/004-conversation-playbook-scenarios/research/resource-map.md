---
title: "Resource Map — Review the conversation-scenario plan before building it. (1) The existing sk-create-manual-testing-playbook skill (templates, references, validate-playbook-package.cjs and its tests, the current 'Turn | Exact user input' chain tables in cli-claude-code, cli-cursor and local-obsidian playbooks): what to improve or reuse. (2) Phase 001-scenario-contract (the json conversation block, closed key set, validator rules) and 002-conversation-runner (tmux-driven runner, per-runtime adapters for Claude Code, OpenCode, Codex, Pi and Devin, scratch-project refusal, cleanup, matrix): should anything be changed, simplified, split, re-ordered or planned differently, and is anything missing? Check the feasibility claims per runtime against the cli-* skills and each CLI's --help (read-only; do not start long interactive sessions). (3) Whether the runner contract fits its first consumer, specs/system-speckit/043-decision-capture/006-live-conversation-test (stage marks PASS/FAIL/SKIP vs its PASS/FAIL/DEVIATION/N/A, per-stage state checks, saves, restart, kill switch). Cite code and spec lines."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 16
- **By category**: READMEs=0, Documents=3, Commands=0, Agents=0, Skills=5, Specs=8, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 3
- **Scope**: research convergence output for 065-conversation-playbook-scenarios
- **Generated**: 2026-11-01T21:54:45.363Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| plan.md | Cited | MISSING | Citations=1; Iterations=1 |
| spec.md | Cited | MISSING | Citations=1; Iterations=1 |
| tasks.md | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/structure/phase-definitions.md | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/001-scenario-contract/plan.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/001-scenario-contract/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/002-conversation-runner/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/002-conversation-runner/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/decision-record.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/spec.md | Cited | OK | Citations=1; Iterations=1 |

---
