---
title: "022/010 ADR Writing and Doc Validator"
description: "Four ADRs closed the 022 hardcoded-default remediation arc by documenting the architectural decisions made across packets 001, 004a and 004b. A companion validator script detects future doc drift against canonical model lists."
trigger_phrases:
  - "022/010 ADR writing"
  - "validate-doc-model-refs.js"
  - "ADR-D doc cross-checking"
  - "022 arc closure"
  - "doc drift validator"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

The 022 arc remediated hardcoded defaults across skill-advisor and spec-memory but left the architectural decisions undocumented. Doc drift also persisted after model-default changes with no automated detection path.

Four ADRs were authored in a new `decision-record.md` to formally capture what was decided across 022 remediation packets: ADR-A established `SKILL_ADVISOR_COMPAT_CONTRACT.defaults` as the canonical source of truth for calibration constants. ADR-B amended the verification clause for ADR-013 and ADR-014 to mandate grepping for inline `||` fallbacks alongside `DEFAULT_*` constants. ADR-C documented all three parallel resolution chains in `profile.ts` and required each to derive from `registry.ts`. ADR-D mandated doc-implementation cross-checking and shipped `validate-doc-model-refs.js`, a Node.js script that scans skill docs against canonical model lists and exits 1 on drift.

The 022 arc was fully closed. The validator is available for manual runs and ready for CI wiring when that follow-up is scheduled.

### Added

- `010-adr-writing-and-doc-validator/decision-record.md` with 4 ADRs (A, B, C, D) following the established template from 004
- `sk-doc/scripts/validate-doc-model-refs.js` validator script (approx 220 lines) loading canonical models from `registry.ts` and `registered_embedders.py`
- Org-prefix whitelist in the validator reducing false positives for model-name pattern matching
- Context-aware drift detection distinguishing active defaults from historical references marked with "former default" or "superseded"
- `--verbose` and `--help` flags on the validator script

### Changed

- `004-spec-memory-embedder-bake-off/decision-record.md` received an appended AMENDMENT section cross-referencing ADR-B. No existing content was modified.

### Fixed

- 022 arc architectural decisions were undocumented after code remediation landed. ADRs A through D now record the rationale and consequences for future maintainers.
- Doc drift after model-default changes had no automated detection path. The validator script closes this gap by cross-referencing docs against the canonical model registry at run time.

### Verification

| Check | Result |
|---|---|
| `node .opencode/skills/sk-doc/scripts/validate-doc-model-refs.js --help` | Exit 0. Help text displayed. |
| `node .opencode/skills/sk-doc/scripts/validate-doc-model-refs.js` | Exit 1. Drift detected in install guides and CocoIndex docs. Expected per ADR-D. |
| ADR count in `decision-record.md` | 4 headings (ADR-A through ADR-D) confirmed. |
| AMENDMENT present in `004-spec-memory-embedder-bake-off/decision-record.md` | 1 match for `AMENDMENT (2026-05-23, per 022/010 ADR-B)`. |
| All Level 2 spec docs created | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` all present. |
| `description.json` and `graph-metadata.json` created | Both present in packet directory. |
| Strict packet validation | Exit 0 after main-agent fixes to fingerprint format and plan/tasks frontmatter. |

### Files Changed

| File | What changed |
|---|---|
| `022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator/decision-record.md` (NEW) | 4 ADRs documenting 022 remediation decisions (A, B, C, D). |
| `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js` (NEW) | Node.js validator scanning skill docs for doc drift against canonical model lists. Supports `--help` and `--verbose`. |
| `022-hardcoded-default-remediation-arc/004-spec-memory-embedder-bake-off/decision-record.md` | AMENDMENT section appended with ADR-B cross-reference. Existing content unchanged. |

### Follow-Ups

- Wire `validate-doc-model-refs.js` to pre-commit or CI so drift detection runs automatically at PR time.
- Update `install_guides/README.md` and CocoIndex docs to reflect current canonical defaults. The validator currently exits 1 on these files as expected per ADR-D.
- Extend `MODEL_ORG_PREFIXES` array when new model providers are added to the canonical registry.
