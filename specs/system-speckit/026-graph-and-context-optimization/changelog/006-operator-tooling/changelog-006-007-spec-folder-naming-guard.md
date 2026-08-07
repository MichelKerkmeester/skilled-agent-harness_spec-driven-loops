---
title: "Changelog: Spec-Folder Naming-Convention Guard [006-operator-tooling/007-spec-folder-naming-guard]"
description: "Chronological changelog for the Spec-Folder Naming-Convention Guard phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/007-spec-folder-naming-guard` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling`

### Summary

This is a research/design packet, not an implementation. It delivers a feasibility study and a recommended design for a cross-runtime spec-folder naming guard, prompted by the operator hitting the 028-026-program-research mis-location defect. No guard code, hook, or script was written or modified. The deliverable is the documented analysis (research.md) plus the canonical spec docs.

### Added

- Research deliverable: documented feasibility study with recommended layered design for a cross-runtime spec-folder naming guard (research.md).
- Cataloged the `create.sh` basename regex and its looseness gap at `create.sh:681-687`, where the pattern permits slugs the guard should reject.
- Mapped the hook-parity landscape: only Codex has a working pre-write deny hook (`hooks/codex/pre-tool-use.ts`); Claude has PostToolUse but no PreToolUse; Gemini has no checked-in project hook.

### Changed

- Captured the phase-child regex from `is-phase-parent.ts:8` and `shell-common.sh:57` as the single-source-of-truth for phase-child detection.
- Documented that top-level vs phase-child classification is flag-driven (`--phase-child`), not semantic.
- Confirmed the PARTIAL feasibility verdict: a single pre-write hook cannot guarantee enforcement because parity is uneven and raw `mkdir`/Write bypass hooks.

### Fixed

- Reproduced the `028-026-program-research` mis-location defect on disk and confirmed it sits at the track root instead of under a parent phase.
- Verified that `FOLDER_NAMING` validation is syntax-only (`validation_rules.md:586`), leaving no semantic detection for mis-located folders.

### Verification

- Evidence verification - Pass
- Defect reproduction - Pass
- Packet validation - Pass
- Checklist - Pass
- Tasks complete - 15 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Created | Problem, scope, requirements, success, risks, open questions |
| `plan.md` | Created | Research approach + recommended-design plan |
| `tasks.md` | Created | Research task breakdown across three phases |
| `research.md` | Created | Findings, PARTIAL verdict, layered design, risks |
| `checklist.md` | Created | Level 2 verification of research completeness |
| `implementation-summary.md` | Created | This summary |

### Follow-Ups

- No guard code exists yet; this packet only justifies and designs it. An implementation packet is required to ship the guard.
- No prompt-time or pre-write hook can catch folders created by hand outside tracked tools; only `validate.sh` catches those retroactively.
- Mis-location detection is high-confidence for embedded sibling numbers but heuristic for generic slugs; false positives are possible.
- Gemini has no checked-in project hook, so it receives no pre-write enforcement even under the recommended design.
