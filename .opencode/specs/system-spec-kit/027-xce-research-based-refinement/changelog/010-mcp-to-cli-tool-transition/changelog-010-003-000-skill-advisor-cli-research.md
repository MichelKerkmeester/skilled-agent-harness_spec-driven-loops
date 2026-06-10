---
title: "Changelog: 003-skill-advisor-cli / 000-skill-advisor-cli-research"
description: "GO verdict for skill-advisor CLI transition: 10-iteration research confirmed 9-tool zero-loss CLI, reconciled skill_advisor.py as a legacy facade, mandated warm-only hooks at 824.8ms one-shot measurement, and produced D1-D8 deltas."
trigger_phrases:
  - "skill advisor cli research changelog"
  - "skill advisor feasibility changelog"
  - "mk_skill_advisor cli verdict changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-06

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli`

### Summary

A single cli-codex lane (gpt-5.5 high, 10 forced iterations) delivered a GO verdict for the skill-advisor CLI transition. All 9 tools from `TOOL_DEFINITIONS` can be exposed with zero feature loss. The research reconciled `skill_advisor.py` as a legacy facade with 10/10 measured scorer parity rather than superseding it, measured the one-shot native bridge at 824.8ms (mandating warm-only prompt-time hooks), root-caused the orphan-launcher class, and produced D1-D8 design deltas across 3 medium implementation packets.

### Added

- `research/**` — lane packet (10 forced iterations), findings registry, lane report, and root synthesis
- `spec.md` — generated findings fence, answered question, Complete status

### Changed

- `tasks.md`, `plan.md`, `implementation-summary.md` — reconciled with research evidence

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| Pre-run `validate.sh --strict` | PASS (0 errors, 0 warnings) |
| Lane outcome | PASS — 1/1 succeeded, 10/10 forced iterations, 6.2 min |
| Verdict shape (REQ-002) | PASS — 9-row parity matrix, timing table, D1-D8, effort |
| Zero-loss classing (REQ-003) | PASS — every tool and resident service classed |
| Post-writeback strict validation | PASS |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `research/**` | Created | Lane packet (10 iterations), registry, lane report, root synthesis |
| `spec.md` | Modified | Findings fence, answered question, Complete status |
| `tasks.md`, `plan.md`, `implementation-summary.md` | Modified | Reconciliation with evidence |

### Follow-Ups

- `advisor_rebuild` / `skill_graph_scan` wall-time under mutation not measured (read-only lane) — left to implementation packet
- Live orphan recount blocked by sandbox; six-orphan precedent stands as recorded incident evidence
