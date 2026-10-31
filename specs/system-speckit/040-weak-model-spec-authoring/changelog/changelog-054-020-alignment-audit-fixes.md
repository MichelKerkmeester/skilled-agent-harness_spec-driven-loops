---
title: "Changelog: Phase 20: alignment-audit-fixes [054-weak-model-spec-authoring/020-alignment-audit-fixes]"
description: "Chronological changelog for the Phase 20: alignment-audit-fixes phase."
trigger_phrases:
  - "weak model spec authoring alignment audit fixes changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/020-alignment-audit-fixes` (Level 2)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Phase 020 checks everything packet 054 touched against its standard and fixes what is off. Four Opus medium leads audited code, skill docs, READMEs and changelogs, and routing with commands and agents, and a critic looked for gaps: 46 findings, 1 P0, 12 P1 and 33 P2. The P0 was a test import that broke the CLI import-policy gate, which CI runs on main. DeepSeek V4.1 Flash 1017 through cli-pi made the literal fixes, Sonnet 5.5 high the judgment fixes, and a fresh verifier per lane re-audited the files the first scope list missed. system-spec-kit is now 2.12.1.0.

### Added

- Catalog entries and playbook scenarios 485 and 486 for the Measured Behavior block and Draft auto-repair.
- A shared `speckit_template_stamp` parser in `lib/status-classifier.sh`, used by the placeholder gate and the MEASURED_BEHAVIOR rule.
- Eight spec-scoped advisor phrases in system-spec-kit `graph-metadata.json`, and the recompiled skill graph.
- `SPECKIT_DRAFT_AUTO_REPAIR` in `.env.example`, and the release note `changelog/v2.12.1.0.md`.

### Changed

- `check-example-drift.sh` runs under `set -euo pipefail` and still reports every failing example.
- The speckit plan, implement and complete workflows run the example-drift and card-sync guards after each strict validation, as a non-blocking check.
- READMEs, the root README included, give 8 warn-only rules, 15 template kinds, `--quiet` and Draft auto-repair.
- Release entries v2.9.0.0 to v2.12.0.0 use the compact tier with no test counts; the packet root changelog covers phases 001 to 019.

### Fixed

- The import-policy allowlist covers `draft-auto-repair.vitest.ts`, so `npm run check` in `runtime/cli` exits 0.
- Playbook scenarios expect the v2.4 stamp that fresh scaffolds print.
- The orchestrate agent and its runtime copies treat only `RESULT: PASSED` with exit 0 as a pass, and cite a template that exists.
- `SKILL.md` is back under the 5,000-word package gate.
- The examples and references no longer teach per-task effort estimates.

### Verification

- `npx tsx evals/check-no-mcp-lib-imports-ast.ts` exits 0 (before: `FAILED: 1 violation(s)`, exit 1); `npm run check` exits 0
- Targeted CLI vitest: 117 passed across 7 files; `yaml-intake-event-payloads` 7/7
- `check-example-drift.sh`, `check-card-sync.sh`, the Hermes check (`PASS: 67`), runtime mirrors (`PASS: 194`), skill graph freshness `--strict`, trigger index `--check`, contract drift `OK commands=3`
- Catalog, playbook and skill package validators pass
- `validate.sh` on packet 054, `--strict --recursive`: every folder `RESULT: PASSED`

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/` (allowlist, guard script, stamp helper, rule, tests, dist) | Modified | P0 fix, strict mode, shared parser, headers |
| `.skilled/skills/system-spec-kit/{feature-catalog,manual-testing-playbook,templates,references,assets}/` | Modified, Created | New entries, v2.4 stamps, real paths, no effort estimates |
| `.skilled/skills/system-spec-kit/SKILL.md`, `changelog/`, `graph-metadata.json` | Modified, Created | 2.12.1.0, release note, advisor phrases |
| `README.md`, system-spec-kit READMEs, `.skilled/commands/` READMEs and speckit docs and YAML | Modified | Counts, flags, guard step |
| `.skilled/agents/orchestrate.md` and its runtime copies | Modified | Exit-code rule, real template source |
| `.env.example`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | New switch, recompiled graph |

### Follow-Ups

- One advisor prompt, `repair derived metadata after editing docs`, still ranks sk-doc (0.8681) just above system-spec-kit (0.8622); sk-doc owns skill-root derived metadata, so the phrases were not widened.
- Em dashes that were already in edited files stay; no added line holds one.
