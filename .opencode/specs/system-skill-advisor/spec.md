---
title: "Feature Specification: system-skill-advisor parent — shared advisor-scorer root fix"
description: "Parent hub for the shared skill-advisor scorer program: the saturation-class root fix and its workstreams (executor-delegation resolver, graph-causal visited-guard, eval hardening, semantic_shadow prove-or-freeze) plus the advisor runtime, RRF-fusion, and penalty-contract packets — one advisor identity, one place to resume."
trigger_phrases:
  - "skill advisor scorer program"
  - "advisor scorer root fix"
  - "system-skill-advisor parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor"
    last_updated_at: "2026-07-07T00:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Grouped the advisor-scorer work under one phase parent; scorer workstreams (005-008) shipped"
    next_safe_action: "Land Layer-1b projection vocab + one coordinated advisor reindex; close 001 umbrella"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + outcome only; no merge/migration/consolidation history; heavy docs live in children. -->

# Feature Specification: system-skill-advisor parent — shared advisor-scorer root fix

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | None (root) |
| **Parent Packet** | None (top-level track) |
| **Handoff Criteria** | Each child phase validates independently; parent validates under recursive phase-parent policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared skill-advisor scorer — the weighted five-lane fusion that ranks which skill a prompt should route to — carries a saturation-class defect: explicit-lane disambiguation penalties are pre-clamp additive offsets and the fusion floors net-negative lane matches to zero, so durable negative evidence is erased the moment saturating positive support reappears. Around that root sit several independent scorer concerns — executor-delegation routing, a graph-causal traversal bug, thin release-gate evaluation, and an unproven semantic lane — that were investigated and fixed as separate workstreams. They share one advisor identity and one runtime, but had no single parent to resume from or validate as a unit.

### Purpose
Provide one phase parent for the advisor-scorer program: the saturation root fix and its workstreams, plus the advisor runtime, RRF-fusion, and penalty-contract packets. This parent organizes and tracks; the code-judgment and per-workstream detail live in each child phase.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All plans, task breakdowns, checklists, decisions, and continuity live in the child phase folders in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The shared advisor scorer under `.opencode/skills/system-skill-advisor/mcp_server/` — its fusion, lanes, executor-delegation resolver, evaluation harness, and the TS↔Python parity contract.
- The advisor projection vocabulary that feeds the scorer from skill metadata.
- Each child phase's independent validation and the parent's recursive-phase validation.

### Out of Scope
- The sk-code-local routing and discovery work (Layer 1 of the same program) — homed under the sk-code hub at `skilled-agent-orchestration/124-sk-code-parent/024-sk-code-advisor-routing-and-discovery`, not here.
- Advisor-adjacent phases owned by other programs (code-graph, xce, deep-loop, sk-doc) that touch the advisor as a dependency — they stay under their own parents.
- The one coordinated advisor reindex + skill-graph recompile — a cross-cutting operation run once, tracked separately.

### Files to Change
Per-phase detail lives in each child's `plan.md`. This parent authors only `spec.md`, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder; all implementation detail lives inside the phase children. Resume a specific phase with `/speckit:resume system-skill-advisor/[NNN-phase]/`.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-scorer-saturation-root-fix/` | Root-fix design spec + TS↔Python parity re-baseline (WS3). The pre-clamp-penalty saturation thesis; its WS1 arithmetic fix was empirically falsified and re-scoped into the workstreams below plus audit-phrase calibration. | planned (umbrella) |
| 002 | `002-skill-advisor-runtime/` | Advisor runtime research: deterministic fusion, lane health, embedding freshness, query routing, drift metrics. | complete |
| 003 | `003-advisor-rrf-fusion/` | The RRF-fusion path and two routing guards — built, unit-tested, byte-identical when disabled. | complete |
| 004 | `004-advisor-penalty-contract/` | The explicit-lane penalty contract and the self-recommendation-guard graduation. | complete |
| 005 | `005-executor-delegation-resolver/` | WS2 — metadata-driven executor-delegation resolver replacing the inline pre-clamp band-aid; post-fusion override; TS + Python parity. | complete |
| 006 | `006-graph-causal-visited-guard/` | WS4 — graph-causal BFS visited-guard order bug (score-first / traverse-second); measured corpus-neutral. | complete |
| 007 | `007-eval-hardening/` | WS5 — empirical ambiguity slice, enum-enforced buckets, ratcheted eval baseline, honest independent holdout. | complete |
| 008 | `008-semantic-shadow-prove-or-freeze/` | WS6 — semantic_shadow FREEZE (weight held at 0.05); opt-in paired 193-row ablation + fail-on-skip guard + degradation detector. | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before being treated as done.
- The parent tracks aggregate progress via this map.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Layer-1b projection vocab** — adding single-pass audit/review vocab to the advisor-facing metadata (both hubs) is deferred to bundle with the coordinated reindex, since metadata edits only take effect post-reindex.
- **001 umbrella close-out** — 001 remains `planned` because its WS1 thesis was superseded by the shipped workstreams; whether to mark it complete or retire it is an open bookkeeping question.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Sibling program (Layer 1)**: `../skilled-agent-orchestration/124-sk-code-parent/024-sk-code-advisor-routing-and-discovery/`
- **Design input**: each child's `research/` and the scorer-fix recommendation carried in `001-scorer-saturation-root-fix/research/`
- **Scorer source**: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/`
- **Graph Metadata**: see `graph-metadata.json` for `derived.last_active_child_id`
