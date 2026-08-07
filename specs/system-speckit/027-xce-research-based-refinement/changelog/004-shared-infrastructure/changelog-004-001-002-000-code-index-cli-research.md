---
title: "Changelog: 002-code-index-cli / 000-code-index-cli-research"
description: "GO verdict for code-index CLI transition: 10-iteration single-lane research confirmed zero feature loss across all 8 tools, identified blocked-read rendering as the top system risk, and produced D1-D10 design deltas."
trigger_phrases:
  - "code index cli research changelog"
  - "code graph cli feasibility changelog"
  - "mk_code_index cli verdict changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-06

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli`

### Summary

A single cli-codex lane (gpt-5.5 high, 10 forced iterations) delivered a GO verdict for the code-index CLI transition. All 8 tools from `CODE_GRAPH_TOOL_SCHEMAS` can be exposed with zero feature loss via a daemon-backed CLI over the existing IPC surface. The spec-memory pattern transfers except for Zod codegen — the hand-coded `validateToolArgs` path is used instead. Blocked-read rendering was identified as the top system-specific risk and added to the D1-D10 design delta set. Effort estimate: 6-9 engineering days.

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
| Lane outcome | PASS — 1/1 succeeded, 10/10 forced iterations, 6.7 min |
| Verdict shape (REQ-002) | PASS — 8-row parity matrix, loss table, risk register, D1-D10, effort |
| Zero-loss classing (REQ-003) | PASS — every tool and daemon capability classed |
| Post-writeback strict validation | PASS |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `research/**` | Created | Lane packet (10 iterations), registry, lane report, root synthesis |
| `spec.md` | Modified | Findings fence, answered question, Complete status |
| `tasks.md`, `plan.md`, `implementation-summary.md` | Modified | Reconciliation with evidence |

### Follow-Ups

- Command naming and file placement left to the implementation packet (lane recommends `code-index` with `mk_code_index` server key)
- Effort re-estimated at implementation packet planning as routine hygiene
