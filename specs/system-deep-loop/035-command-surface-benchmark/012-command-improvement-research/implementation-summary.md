---
title: "Implementation Summary: create-command + command-surface improvement research"
description: "The two-lineage deep-research fan-out and the reconciled cross-model improvement backlog at research/research.md are complete and run-integrity verified; downstream remediation is deferred to successor packet 013."
status: in_progress
trigger_phrases:
  - "command improvement research summary"
  - "command surface fan-out synthesis"
  - "command canon improvement backlog"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/012-command-improvement-research"
    last_updated_at: "2026-07-16T08:31:18Z"
    last_updated_by: "claude"
    recent_action: "Synthesized 2-lineage fan-out into research/research.md"
    next_safe_action: "Open remediation packet on keystone K1"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/orchestration-summary.json"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    completion_pct: 90
    open_questions:
      - "Is the router-gate alternative a P0 or P1 promotion given 35 commands rely on the prose form?"
      - "Is Claude command parity intended, or should the canon scope to opencode and codex?"
    answered_questions:
      - "The run is complete: both lineages 5/5, stopReason maxIterationsReached."
      - "The deliverable is research/research.md; deltas seed follow-on packets."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-command-improvement-research |
| **Status** | In Progress |
| **Completed** | Research run and cross-model synthesis done (5 of 5 iterations per lineage); downstream remediation handoff open |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The deliverable of this packet is the completed two-lineage deep-research run and the cross-model synthesis at `research/research.md`. Two independent models were forced to five non-converging iterations each — GLM-5.2 at max reasoning via cli-opencode (`glm52-max`) and GPT-5.6-Sol at high reasoning / fast tier via cli-codex (`gpt56-sol-high-fast`) — each exploring the create-command canon and the 066 benchmark findings to depth without collapsing early. The skill-owned fanout-run.cjs driver ran both lineages under stop policy max-iterations, writing each lineage to its own `research/lineages/<label>/` boundary.

The synthesis reconciles the two lineage syntheses into one prioritized improvement backlog: agreements are strengthened, model-unique findings are flagged, and disagreements are noted. It yields a P0/P1/P2 backlog whose keystone is K1 (compose frontmatter validation into the canonical `--type command` path) and whose larger target is K2 (a versioned command contract every prose surface, mirror, validator, benchmark, and generated router consumes). No shipped runtime was touched; every delta is a candidate proposal for a follow-on remediation packet.

### Files Produced

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Authored | Reconciled cross-model backlog, agreement matrix, provenance |
| `research/lineages/glm52-max/**` | Generated | GLM-5.2 lineage iterations, state, and synthesis |
| `research/lineages/gpt56-sol-high-fast/**` | Generated | GPT-5.6-Sol lineage iterations, state, and synthesis |
| `research/orchestration-summary.json` | Generated | Fan-out run counts and timestamp-anomaly telemetry |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Authored | Level-1 spec-folder conformance for the research packet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both lineages ran the full `phase_init → phase_main_loop → phase_synthesis` cycle in isolation. Convergence was recorded as telemetry only: the GPT lineage's new-information ratios fell 0.88 → 0.76 → 0.82 → 0.70 → 0.52 and the GLM lineage's ran 1.0 → 0.7 → 0.75 → 0.8 → 0.6, and neither triggered an early stop under the max-iterations policy. The final synthesis pass merged the two lineage `research.md` files by hand-reconciliation rather than a mechanical union, so that cross-model agreement (HIGH confidence) is distinguished from single-lineage findings (MEDIUM confidence, worth a verify pass).

The GPT lineage additionally flagged that some of the 066 benchmark's P0 route-cycle findings are comment-derived false positives, which the backlog routes to an independent parser fix (K3) ahead of acting on those P0s.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Force two lineages to non-convergence | Two independent model perspectives explore the full question to depth without collapsing on a single-model view |
| Keep the packet research-and-synthesis only | Deltas seed follow-on remediation packets; no shipped runtime is mutated from a research packet |
| Reconcile by hand, not mechanical union | Cross-model agreement earns HIGH confidence; single-lineage findings stay MEDIUM and flagged for a verify pass |
| Sequence K1 before the W-tier checks | The semantic-validation tier is unenforceable on the canonical path until frontmatter validation is composed into `--type command` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Lineage completion | PASS: both `deep-research-state.jsonl` report 5/5 iterations; `iterations/iteration-001..005.md` present in each lineage; 10 total |
| Stop reason | PASS: `stopReason: maxIterationsReached` on both lineages — not convergence |
| Orchestration counts | PASS: `research/orchestration-summary.json` reports `total_cli_lineages: 2`, `succeeded: 2`, `failed: 0` |
| Route proof | PASS: GPT records carry `target_agent=deep-research, mode=research` on all 5 iterations; GLM records carry `mode=research` (smaller-model state schema) |
| Synthesis completeness | PASS: `research/research.md` carries the agreement matrix, model-unique findings, prioritized backlog with acceptance criteria, and run provenance |
| Data-quality anomalies | NOTED: GLM cosmetic timestamp anomalies and a GPT stall heartbeat gap; neither truncated a lineage (both 5/5) nor affects findings content |
| Strict packet validation | PASS: `validate.sh --strict` Errors:0 Warnings:0 after the Level-1 restructure and metadata regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Downstream remediation is not this packet's work.** The output is an actionable backlog, not an implemented change; the keystone items (K1, K2, K3) and the wholesale canon/validator/parity items (W-tier) belong to successor packet 013-command-canon-remediation. The packet stays `in_progress` until that handoff opens.
2. **Single-lineage findings need a verify pass.** Model-unique findings (GPT F05/F07/F09 and the GLM ergonomics set) are MEDIUM confidence by design; the remediation packet should confirm each against the real symptom before acting, per finding-is-a-hypothesis.
3. **Two open decision gates remain.** Whether the router-gate alternative is a P0 or P1 promotion, and whether Claude command parity is intended at all, are decisions for the remediation packet rather than settled conclusions of this research.
<!-- /ANCHOR:limitations -->
