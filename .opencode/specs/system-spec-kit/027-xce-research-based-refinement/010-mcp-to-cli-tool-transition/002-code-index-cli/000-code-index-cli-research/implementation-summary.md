---
title: "Implementation Summary: Code-Index CLI Feasibility [system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research/implementation-summary]"
description: "Planned-stub summary for the Code-Index CLI feasibility research. Nothing concluded yet: the forced-10 lane runs against the 10-KQ register; the verdict lands here at reconciliation."
trigger_phrases:
  - "code index cli feasibility result"
  - "code graph cli fallback result"
  - "mk_code_index cli result"
importance_tier: "normal"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research"
    last_updated_at: "2026-06-06T14:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "GO verdict shipped; research reconciled"
    next_safe_action: "Scaffold implementation phases on operator direction"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research |
| **Completed** | 2026-06-06 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

GO verdict shipped: mk_code_index can gain a daemon-backed dual-stack CLI with auto-spawn at zero feature loss (8/8 tools, 0 MCP-only). The spec-memory pattern transfers except Zod codegen (hand-coded validateToolArgs path instead); blocked-read rendering identified as the top system-specific risk; D1–D10 deltas specified; 6–9 day estimate.

The verdict chain is anchored in `research/research.md` (synthesis) and `research/lineages/gpt/research.md` (canonical lane detail, file:line-cited), with the settled spec-memory record as premise.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| research/** | Created | Lane packet (10 iterations), registry, lane report, root synthesis |
| spec.md | Modified | Generated findings fence + answered question + Complete status |
| tasks.md, plan.md, implementation-summary.md | Modified | Reconciliation with evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One fan-out invocation: single cli-codex lane (gpt-5.5, reasoning high, service tier fast), forced 10 iterations with one orthogonal KQ per iteration, 1500s/iteration ceiling. The lane exited clean (1/1 succeeded), wrote 10 iteration files + findings registry + verdict-shaped report; the orchestrator compiled the root synthesis and reconciled packet docs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Daemon-backed CLI over the existing IPC surface, not a daemon-free reimplementation | Pure per-invocation CLI fails zero-feature-loss: lease, bridge, readiness, scan persistence, apply rollback would all need rebuilding |
| Generate the manifest from CODE_GRAPH_TOOL_SCHEMAS with validateToolArgs at argv | The Zod path from spec-memory does not exist here; reusing the hand-coded validator preserves dispatcher parity |
| Blocked-read envelopes preserved verbatim in all output formats | A text renderer that hides status: blocked turns a safety feature into silent data loss |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-run `validate.sh --strict` | PASS (0 errors, 0 warnings) |
| Lane outcome (`research/orchestration-summary.json`) | PASS — 1/1 succeeded, 10/10 forced iterations, 6.7 min, stopReason maxIterationsReached |
| Verdict shape (REQ-002) | PASS — 8-row parity matrix, loss table, prior-art transfer table, risk register, D1–D10, effort in research/research.md + lane report |
| Zero-loss classing (REQ-003) | PASS — every tool and daemon capability classed per architecture; pure-CLI losses enumerated |
| Post-writeback strict validation | PASS (run at reconciliation) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Command naming and file placement intentionally left to the implementation packet (lane recommends `code-index` with documented `mk_code_index` server key).
2. Effort is research-grade bottom-up (6–9d); implementation planning re-estimates as routine hygiene.
3. Salvage-sweep placeholder `iteration-N.md` files may appear alongside canonical `iteration-NNN.md` (known runner quirk); zero-padded files are canonical.
<!-- /ANCHOR:limitations -->
