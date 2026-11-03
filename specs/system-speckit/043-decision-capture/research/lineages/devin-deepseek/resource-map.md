---
title: "Resource Map — Three open gaps in operator decision capture: routing words for decision requests, per-project scoping of the shared state folder, and reducing model judgment for chat answers"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 32
- **By category**: READMEs=0, Documents=1, Commands=4, Agents=0, Skills=12, Specs=8, Scripts=6, Tests=0, Config=1, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 043-decision-capture
- **Generated**: 2026-11-03T08:43:04.918Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/assets/symlink-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/skill-graph-freshness.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/symlink-engine.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/save.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-design/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/ROUTER.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/hook-completion-evidence-stop.vitest.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skill-advisor/031-routing-and-launcher-hardening/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/031-routing-and-launcher-hardening/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/031-routing-and-launcher-hardening/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/043-decision-capture/005-chat-question-detection/acceptance-criteria.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/043-decision-capture/007-gap-closure/decision-record.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/043-decision-capture/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/043-decision-capture/review/review-report.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/043-decision-capture/spec.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/decision-capture.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/decision-capture/bin/sweep-transcript.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/decision-capture/lib/capture-core.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/decision-capture/lib/chat-questions.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/decision-capture/pi/decision-capture.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.labels.json | Cited | OK | Citations=1; Iterations=1 |

---
