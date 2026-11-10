---
title: "Resource Map — Close every known gap in the operator decision-capture feature and find changes that make it more maintainable and prevent overengineering. Known gaps: (1) answers reach a decision record only when /speckit:save runs; (2) the pending-answer nudge shows only on Claude and OpenCode, not Devin, Codex or Pi; (3) Codex captures only at save time from its rollout, because a live hook needs hook trust; (4) Cursor is marked unverified and Hermes is absent from the runtime matrix; (5) chat-answer pairing depends on the saving model's judgment; (6) process questions (Gate 3, spec folder, branch) are filtered by keyword; (7) a Claude nudge emitted at session exit is lost; (8) the Codex and Pi sweeps exit 0 silently on an unreadable transcript while the Claude and Devin sweeps report an error. Maintainability: five live adapters and five save-time readers each parse a storage format another tool owns (OpenCode SQLite, Codex rollout, Devin and Pi session files, Claude transcript). For each gap say whether it is worth closing, the smallest change that closes it, and what to delete or merge rather than add. Code: .skilled/hooks/decision-capture/, .opencode/plugins/decision-capture.js, .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts and decision-table-matcher.ts, runtime/cli/continuity/match-decision-table.ts, .skilled/commands/speckit/save.md. Read-only research: do not edit code."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 36
- **By category**: READMEs=1, Documents=1, Commands=1, Agents=0, Skills=14, Specs=3, Scripts=11, Tests=3, Config=2, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 043-decision-capture
- **Generated**: 2026-11-02T17:35:11.768Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/README.md | Cited | OK | Citations=3; Iterations=3 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/coverage-rationale.md | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/speckit/save.md | Cited | OK | Citations=3; Iterations=3 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/.state/decision-capture/probe/codex.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/.state/decision-capture/probe/devin.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/.state/decision-capture/probe/opencode.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/.state/decision-capture/probe/pi.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/.state/decision-capture/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/benchmark/reports/2026-11-02--manual-testing-playbook--decision-capture-live-conversation/results.csv | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/api/index.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/decision-record.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/implementation-summary.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/handover.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/decision-capture.js | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/decision-capture/bin/sweep-codex.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/hooks/decision-capture/bin/sweep-devin.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/decision-capture/bin/sweep-opencode.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/hooks/decision-capture/bin/sweep-pi.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/decision-capture/bin/sweep-transcript.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/decision-capture/lib/capture-core.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/hooks/decision-capture/lib/chat-questions.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/decision-capture/pi/decision-capture.ts | Cited | OK | Citations=2; Iterations=2 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/decision-capture/bin/sweep-codex.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/settings.json | Cited | OK | Citations=1; Iterations=1 |
| .codex/hooks.json | Cited | OK | Citations=1; Iterations=1 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| deepseek | lineages/deepseek/deltas/iter-001.jsonl |
| deepseek | lineages/deepseek/deltas/iter-002.jsonl |
| deepseek | lineages/deepseek/deltas/iter-003.jsonl |
| luna | lineages/luna/deltas/iter-001.jsonl |
| luna | lineages/luna/deltas/iter-002.jsonl |
