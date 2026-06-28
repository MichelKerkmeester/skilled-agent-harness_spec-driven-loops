---
title: "Changelog: Kimi K2.7 Code Support [149-kimi-k2-7-code-support/root]"
description: "Root changelog rollup for the completed Kimi K2.7 Code support packet."
trigger_phrases:
  - "149 root changelog"
  - "kimi k2.7 support"
  - "kimi phase rollup"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/149-kimi-k2-7-code-support` (Level Phase Parent)

### Summary

Spec 149 turned Kimi K2.7 Code from a live provider slug into a documented, routed and empirically backed small-model option. The packet first registered `kimi-for-coding/k2p7`, then proved the easy prompt bakeoff could not discriminate frameworks, then replaced that placeholder with a strict-validator run that retired `rcaf` for this model and promoted `costar` with `tidd-ec` as fallback. The later phases made the support maintainable by aligning house filenames and documenting the broad-scope timeout failure mode that makes Kimi appear hung when it is actually over-reading before `opencode` can flush output.

### Included Phases

| Phase | Status | Summary |
|-------|--------|---------|
| [`001-model-registration`](./changelog-149-001-model-registration.md) | Complete | Registered `kimi-k2.7-code`, kept `kimi` aliases usable, retired `kimi-k2.6` in place and proved live dispatch. |
| [`002-framework-bakeoff`](./changelog-149-002-framework-bakeoff.md) | Complete | Ran 30 real Kimi dispatches across five frameworks and found a correctness-saturated TIE on easy T3 fixtures. |
| [`003-promote-results`](./changelog-149-003-promote-results.md) | Complete | Folded the inconclusive run 006 result into the registry as `default-unverified`, keeping `rcaf` only as a convention default. |
| [`004-discriminating-bakeoff`](./changelog-149-004-discriminating-bakeoff.md) | Complete | Re-ran on strict validators, got a separable result and promoted `costar`, `tidd-ec` and avoid-`rcaf` as empirical guidance. |
| [`005-filename-underscore-alignment`](./changelog-149-005-filename-underscore-alignment.md) | Complete | Renamed seven `sk-prompt-models` documentation and asset files to the underscore convention while preserving dashed model profiles by contract. |
| [`006-broad-scope-timeout-caveat`](./changelog-149-006-broad-scope-timeout-caveat.md) | Complete | Documented the `--variant high` broad-scope timeout failure mode, its zero-byte symptom and the read-cap plus timeout mitigation. |

### Added

- `kimi-k2.7-code` in `sk-prompt-models/assets/model-profiles.json`, later renamed to `model_profiles.json`.
- `sk-prompt-models/references/models/kimi-k2.7-code.md`, a seven-section prompt-craft profile.
- `kimi-k2.7-frameworks.json`, cloned from `framework-bakeoff.json` for the first five-framework run.
- `benchmarks/006-kimi-k2.7-prompt-framework/` outputs, including `aggregate.json`, `results.json`, `synthesis.md`, `llm-judge-board.json`, `llm-judge-results.json` and `llm-judge-synthesis.md`.
- `kimi-k2.7-discriminating.json`, a strict-validator bakeoff profile with five frameworks, invalid-dominant validators, `correctnessGate.threshold` 0.0 and 6 samples per cell.
- `benchmarks/007-kimi-k2.7-discriminating/` outputs, including `aggregate.json`, `synthesis.md`, `results.json` and `per-fixture-correctness.json`.
- A `variant_flag` operational caveat, wall-clock observation and over-exploration weakness for Kimi K2.7 Code.

### Changed

- `sk-prompt-models/SKILL.md` gained Kimi K2.7 frontmatter, keywords, activation triggers, keyword triggers, `MODEL_ALIASES` and a dispatch-matrix row.
- `cli-opencode/SKILL.md` gained the Kimi For Coding auth-login line, model-selection entry and later the operational caveat.
- `kimi-k2.6` was retained as historical so older references still resolve while the active recommendation moved to `kimi-k2.7-code`.
- Run 006 evidence kept `rcaf` at `default-unverified` because the bakeoff returned a TIE with saturated correctness.
- Run 007 evidence promoted `costar` as primary, `tidd-ec` as fallback, `rcaf` as avoid and `empirical` as the status.
- Seven dash-named `sk-prompt-models` documentation and asset files moved to underscore names, while the four model-profile files stayed dashed because the guard derives their paths from model ids.
- Parent phase-map rows and `graph-metadata.json` children ids were reconciled as phases completed.

### Fixed

- Run 002 used real T3 coding fixtures and surfaced correctness saturation instead of hiding it.
- Run 004 recovered from an accidental external kill at 52/120, fixed a throttle bug mid-flight and excluded `hard-roman-to-int` after it stalled under orchestration churn.
- `cli-opencode/references/cli_reference.md` changed the stale `opencode-go/kimi-k2.6` row to `kimi-for-coding/k2p7`.
- `cli-opencode/references/context-budget.md` changed `kimi-k2.6` references to `kimi-k2.7-code`, recorded the 262,144 context and added the caveat.
- `system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` now loads `model_profiles.json`.

### Verification

| Check | Result |
|-------|--------|
| Live Kimi slug and smoke dispatch | PASS: `opencode models kimi-for-coding` showed `kimi-for-coding/k2p7`, context 262144 and output 32768. The smoke dispatch returned `pong`, exit 0, cost 0. |
| Prompt-card sync guard | PASS: `check-prompt-quality-card-sync.sh .` passed after registration, filename alignment and timeout-caveat edits. |
| First bakeoff | PASS: run `006-kimi-k2.7-prompt-framework` produced `aggregate.json`, `results.json` and `synthesis.md`, with 30/30 real Kimi dispatches and a TIE verdict. |
| Discriminating bakeoff | PASS: run `007-kimi-k2.7-discriminating` was separable, `correctness_saturated: false`, with `tidd-ec`, `race` and `costar` at 1.000, `cidi` at 0.996 and `rcaf` at 0.992. |
| Registry and reference parity | PASS: the registry, model profile and `_index.md` moved from run 006 `default-unverified` to run 007 `empirical`. |
| Filename alignment | PASS: all seven targets were renamed, stale live references to the six unique old dash names returned zero hits, renamed JSON parsed and dashed model profiles stayed present. |
| Phase validation | PASS: each phase recorded `validate.sh <phase> --strict` at exit 0. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `sk-prompt-models/assets/model-profiles.json` then `model_profiles.json` | Updated | Added Kimi K2.7 Code, retired Kimi K2.6, promoted run 007 guidance and added the timeout weakness. |
| `sk-prompt-models/references/models/kimi-k2.7-code.md` | Created and updated | Added the profile, recorded run 006, replaced it with run 007 guidance and added the broad-scope timeout caveat. |
| `sk-prompt-models/references/models/kimi-k2.6.md` | Updated | Added the historical banner. |
| `sk-prompt-models/references/models/_index.md` | Updated | Moved Kimi K2.7 Code active, moved Kimi K2.6 historical and mirrored the final empirical status. |
| `sk-prompt-models/SKILL.md` | Updated | Added Kimi K2.7 routing, aliases and dispatch matrix content, then repointed renamed links. |
| `cli-opencode/SKILL.md` | Updated | Added provider login, model selection, renamed references and the operational caveat. |
| `sk-prompt-models/graph-metadata.json` and `cli-opencode/graph-metadata.json` | Updated | Added routing metadata for Kimi K2.7 Code and Kimi For Coding. |
| `benchmarks/006-kimi-k2.7-prompt-framework/` | Created | First bakeoff outputs and secondary judge outputs. |
| `benchmarks/007-kimi-k2.7-discriminating/` | Created | Strict-validator bakeoff outputs and per-fixture correctness. |
| `kimi-k2.7-frameworks.json` and `kimi-k2.7-discriminating.json` | Created | Benchmark profiles for runs 006 and 007. |
| `sk-prompt-models` references and assets | Renamed | Seven dash-named files moved to underscore names and inbound links were repaired. |
| `cli-opencode/references/cli_reference.md` and `cli-opencode/references/context-budget.md` | Updated | Stale Kimi K2.6 references repaired and timeout caveat added. |
| `149/spec.md` and `149/graph-metadata.json` | Updated | Phase-map rows and children ids reconciled. |

### Follow-Ups

- Run 006 remains a smoke-quality result, not a framework recommendation. Phase 004 superseded it with run 007.
- Run 007 is conclusive for retiring `rcaf` on strict validators, but the perfect tier is still tied. `costar`, `tidd-ec` and `race` all scored 1.000.
- `hard-roman-to-int` was excluded from run 007 after it stalled under orchestration churn. A future re-run can add it back for completeness.
- The broad-scope timeout caveat is an observation from two timeouts and one fixed run, not a controlled benchmark.
- The manual testing playbook scenario `CO-036` still names `kimi-k2.6` and was deferred to avoid disturbing its file-count self-check.
- Historical and archived references to old dash filenames were intentionally left as point-in-time records.
