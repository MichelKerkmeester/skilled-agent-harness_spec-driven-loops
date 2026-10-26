---
title: "Changelog: Phase 21: ci-gate-regressions [054-weak-model-spec-authoring/021-ci-gate-regressions]"
description: "Chronological changelog for the Phase 21: ci-gate-regressions phase."
trigger_phrases:
  - "weak model spec authoring ci gate regressions changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/021-ci-gate-regressions` (Level 2)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Phase 021 clears two CI gates that failed on main after packet 054 landed, both found by the completeness critic of a local alignment audit run over `ac2be31ec6..HEAD`. Changed-packet validation graded 104 benchmark-result packets kept under phase 011's `scratch/` folder and blocked on 81 of them; it now skips any `scratch/` path segment, as the validator's own discovery does. The divergence ratchet saw `/deep:research :auto` prompts route to spec-kit, because the intent signal `draft auto-repair` gave spec-kit the token `auto`; the signal is now `spec docs`. The phase also fixes the run's in-range P1 and P2 findings, and system-spec-kit is now 2.12.2.0.

### Added

- Two selection tests in `ci-rule-set-comparison.vitest.ts`: a packet copied under `scratch/` is not graded, and a packet named `001-scratch-notes` still is.
- The release note `changelog/v2.12.2.0.md`.

### Changed

- The changed-packet selection loop skips any changed file under a whole `scratch/` path segment.
- The system-spec-kit intent signal `draft auto-repair` is now `spec docs`, and `skill-graph.json` is recompiled.
- ESLint in `runtime/` ignores every `dist/` folder.

### Fixed

- The authoring card passes `validate_document.py`: section separators and an `OVERVIEW AND BOUNDS` heading.
- The validation rules, path-scoped rules and level guide call `decision-record.md` a lazy add-on.
- `speckit-complete.yaml` names checklist files that exist, and `validate.sh --help` gives the right Level 2 file.

### Verification

- Selection replay over `b51a341a07^2..b51a341a07`: 111 graded with 104 under `scratch/` before, 7 and 0 after
- `ci-rule-set-comparison.vitest.ts` 17/17, and 1 failed against the old workflow; card-sync plus comparison 27/27
- Divergence ratchet 9/9, drift guard and parity 21/21, scorer baseline 7/7, golden prompts 14/14
- Skill graph freshness `--strict` rc 0, `CARD SYNC OK`, `EXAMPLE_DRIFT_OK`, Hermes `PASS: 67`
- `validate.sh` on packet 054, `--strict --recursive`: every folder `RESULT: PASSED`

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.github/workflows/changed-packet-validation.yml` | Modified | Scratch skip in the selection loop |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts` | Modified | Two selection tests |
| `.skilled/skills/system-spec-kit/graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | `spec docs` signal, recompiled graph |
| `.skilled/skills/system-spec-kit/references/` (authoring card, validation rules, path-scoped rules, level guide) | Modified | Separators, heading, lazy add-on wording |
| `.skilled/skills/system-spec-kit/runtime/eslint.config.mjs`, `runtime/cli/spec/validate.sh` | Modified | `dist/` ignore, `--help` line |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modified | Real checklist paths |
| `.skilled/skills/system-spec-kit/SKILL.md`, its Hermes copy, `changelog/v2.12.2.0.md` | Modified, Created | 2.12.2.0 and its release note |

### Follow-Ups

- The live advisor still ranks spec-kit just above deep-loop for rr-iter3-168 (0.5744 against 0.5665), and prompts that name only Draft auto-repair no longer reach spec-kit. A scorer change that ignores `:auto` mode flags would fix both.
- 244 lint problems remain in `runtime/`; they predate 054 and no CI step runs that lint.
