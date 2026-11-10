---
title: "Resource Map — Review the decision-capture series before building its follow-ups. (1) What was built in 001-decision-capture-build (the PostToolUse capture hook, the transcript sweeps, the decision-record writer and save step, the Stop-hook nudge, the playbook scenarios): defects, weak spots, and what to improve. Known real-use gap: answers recorded by hand as table rows in another packet's decision record keep counting as pending. (2) The planned children 002-table-row-matching, 003-codex-and-pi-capture, 004-opencode-devin-live-capture, 005-chat-question-detection and 006-live-conversation-test: should any be changed, merged, split, re-ordered or planned differently? Is anything missing? (3) How 006 depends on the shared conversation runner planned in specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios, and whether the contract between them is right. Cite code and spec lines."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 37
- **By category**: READMEs=0, Documents=0, Commands=1, Agents=0, Skills=8, Specs=25, Scripts=3, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 043-decision-capture
- **Generated**: 2026-11-01T21:58:19.853Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/speckit/save.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-claude-hook.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/memory/save-workflow.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/001-scenario-contract/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/002-conversation-runner/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/002-conversation-runner/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/001-decision-capture-build/acceptance-criteria.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/001-decision-capture-build/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/001-decision-capture-build/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/acceptance-criteria.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/003-codex-and-pi-capture/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/003-codex-and-pi-capture/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/004-opencode-devin-live-capture/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/005-chat-question-detection/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/005-chat-question-detection/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/acceptance-criteria.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/decision-record.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/iterations/iteration-002.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/decision-capture/bin/sweep-transcript.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/decision-capture/lib/capture-core.mjs | Cited | OK | Citations=1; Iterations=1 |

---
