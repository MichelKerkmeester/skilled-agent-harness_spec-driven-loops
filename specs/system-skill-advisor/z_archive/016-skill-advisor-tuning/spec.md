---
title: "Feature Specification: skill-advisor scorer tuning"
description: "Group the shared advisor-scorer program as nested phases: the saturation-class root fix and its workstreams (executor-delegation resolver, graph-causal visited-guard, eval hardening, semantic_shadow prove-or-freeze) plus the advisor runtime, RRF-fusion, and penalty-contract packets."
trigger_phrases:
  - "skill advisor scorer tuning"
  - "advisor scorer root fix"
  - "advisor scorer workstreams"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning"
    last_updated_at: "2026-07-07T17:49:35.000Z"
    last_updated_by: "claude-opus"
    recent_action: "WU-1 reconciled 001/002/003/004 spec honesty (WS1 falsified, RRF row, guard ledger truthed)"
    next_safe_action: "WU-2 read-only assets (012/009); gated WU-3 vocab+reindex, WU-4 guard del, WU-5 penalty"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + outcome only; no merge/migration/consolidation history; heavy docs live in children. -->

# Feature Specification: skill-advisor scorer tuning

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `system-skill-advisor` |
| **Parent Packet** | `system-skill-advisor` |
| **Handoff Criteria** | Each child phase validates independently; parent validates under recursive phase-parent policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared skill-advisor scorer — the weighted five-lane fusion that ranks which skill a prompt should route to — carries a saturation-class defect: explicit-lane disambiguation penalties are pre-clamp additive offsets and the fusion floors net-negative lane matches to zero, so durable negative evidence is erased the moment saturating positive support reappears. Around that root sit several independent scorer concerns — executor-delegation routing, a graph-causal traversal bug, thin release-gate evaluation, and an unproven semantic lane — each investigated and fixed as its own workstream.

### Purpose
Group the advisor-scorer program as one set of nested phases: the saturation root fix and its workstreams, plus the advisor runtime, RRF-fusion, and penalty-contract packets. This parent organizes and tracks; the code-judgment and per-workstream detail live in each child phase.

> **Phase-parent note:** This spec.md is the ONLY authored document at this parent level. All plans, task breakdowns, checklists, decisions, and continuity live in the child phase folders in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The shared advisor scorer under `.opencode/skills/system-skill-advisor/mcp_server/` — its fusion, lanes, executor-delegation resolver, evaluation harness, and the TS↔Python parity contract.
- The advisor projection vocabulary that feeds the scorer from skill metadata.
- Each child phase's independent validation and this parent's recursive-phase validation.

### Out of Scope
- The sk-code-local routing and discovery work (Layer 1 of the same program) — homed under the sk-code hub, not here.
- Advisor-adjacent phases owned by other programs (code-graph, xce, deep-loop, sk-doc) that touch the advisor as a dependency.
- The one coordinated advisor reindex + skill-graph recompile — a cross-cutting operation run once, tracked separately.

### Files to Change
Per-phase detail lives in each child's `plan.md`. This parent authors only `spec.md`, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder; all implementation detail lives inside the phase children. Resume a specific phase with `/speckit:resume system-skill-advisor/016-skill-advisor-tuning/[NNN-phase]/`.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-scorer-saturation-root-fix/` | Root-fix design spec + TS↔Python parity re-baseline. The pre-clamp-penalty saturation thesis; its WS1 arithmetic fix was empirically falsified and re-scoped into the workstreams below plus audit-phrase calibration. | closed — WS1 thesis falsified & re-scoped |
| 002 | `002-skill-advisor-runtime/` | Advisor runtime research + its own nested sub-phases: deterministic fusion, lane health, embedding freshness, query routing, drift metrics. | complete — children at accepted terminal states (004/007 shadow-only live-NO-GO, CHK-120 satisfied-by-deletion; 003/006 accepted-partial) |
| 003 | `003-advisor-rrf-fusion/` | The RRF-fusion path and two routing guards — built, unit-tested, byte-identical when disabled. | complete |
| 004 | `004-advisor-penalty-contract/` | The explicit-lane penalty contract and the self-recommendation-guard graduation. | complete |
| 005 | `005-executor-delegation-resolver/` | Metadata-driven executor-delegation resolver replacing the inline pre-clamp band-aid; post-fusion override; TS + Python parity. | complete |
| 006 | `006-graph-causal-visited-guard/` | Graph-causal BFS visited-guard order bug (score-first / traverse-second); measured corpus-neutral. | complete |
| 007 | `007-eval-hardening/` | Empirical ambiguity slice, enum-enforced buckets, ratcheted eval baseline, honest independent holdout. | complete |
| 008 | `008-semantic-shadow-prove-or-freeze/` | semantic_shadow FREEZE (weight held at 0.05); opt-in paired 193-row ablation + fail-on-skip guard + degradation detector. | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before being treated as done.
- This parent tracks aggregate progress via the map.
- Run `validate.sh --recursive` on this parent to validate all phases as an integrated unit.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Layer-1b projection vocab** — adding single-pass audit/review vocab to the advisor-facing metadata is deferred to bundle with the coordinated reindex, since metadata edits only take effect post-reindex.
- **001 umbrella close-out** — RESOLVED: 001 is closed out as WS1-falsified/superseded; its close-out imports the experiment record (WS1 post-cap demotion implemented → measured net -2 / fixed 0 of 6 / broke 2 → reverted; superseded by audit-phrase calibration in commit e2711fb580).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../` (`system-skill-advisor`)
- **Sibling program (Layer 1)**: `../../skilled-agent-orchestration/124-sk-code-parent/024-sk-code-advisor-routing-and-discovery/`
- **Scorer source**: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/`
- **Graph Metadata**: see `graph-metadata.json` for `derived.last_active_child_id`
