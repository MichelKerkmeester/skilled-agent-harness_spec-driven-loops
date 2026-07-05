---
title: "Feature Specification: Follow-Up Remediation (030 packet)"
description: "Closes the 4 deliberately-deferred follow-up items from phase 009: 2 active review findings (session-id propagation, LEAF-identity conflation), the validate.sh dual-path gap, and the scaffold-marker content debt across phases 002-007 that the validate.sh fix would otherwise expose."
trigger_phrases:
  - "030 followup remediation"
  - "packet 030 review findings fix"
  - "sliding window convergence implementation"
  - "scaffold content authoring 002-007"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/011-followup-remediation"
    last_updated_at: "2026-07-02T15:46:36Z"
    last_updated_by: "claude-fable-5"
    recent_action: "All 7 children complete; phase closed"
    next_safe_action: "Final strict recursive sweep when the shared-dist gate clears"
    blockers: []
    key_files:
      - "009-research-backlog-remediation/changelog-009-root.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User confirmed all 4 follow-up categories in scope (review findings, sliding-window convergence, validate.sh gap, scaffold cleanup)."
---
# Feature Specification: Follow-Up Remediation (030 packet)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 11 |
| **Predecessor** | 010-documentation-truth-audit |
| **Successor** | None |
| **Handoff Criteria** | All 7 children complete; `validate.sh --recursive` passes 0 errors on the whole 030 packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 009's own changelog (`changelog-009-root.md` Follow-Ups) documented 4 deliberately-deferred items: 2 review findings that remained genuinely active in the prior codex deep-review lineage, a sliding-window convergence mode a decision record recommends building next, a validate.sh architectural gap where the default invocation path never runs 2 rules shipped this packet, and scaffold-marker content debt across phases 002-007 that becomes blocking (not cosmetic) the moment the validate.sh gap is fixed.

### Purpose
Close all 4 categories as 7 independently-verified children, sequenced so the scaffold-content work (which the validate.sh fix depends on) lands before the rule is enabled by default.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix 2 active review findings from the codex lineage (`../review/lineages/codex/deep-review-findings-registry.json`, F002 session-id, F003 LEAF-identity conflation).
- Implement the sliding-window convergence mode per `009-research-backlog-remediation/009-convergence-design-and-hardening/decision-record.md` (ADR-001).
- Wire registry-backed shell validate.sh rules into the default Node-orchestrator invocation path.
- Author real `plan.md`/`tasks.md` content for ~40 leaf children across phases 002-007 whose bodies are still unmodified template placeholder text.

### Out of Scope
- Re-litigating packet 030's own already-shipped code correctness outside these 4 specific items.
- Any packet other than 030 (031/032/028 are other sessions' active work).

### Files to Change
Audit-trail summary only; per-child detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/commands/deep/assets/deep_review_{auto,confirm}.yaml` | Modify | 001 | Session-id propagation |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | 001, 002 | Native session-id parity, LEAF-identity wording |
| `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-*/**` through `007-*/**` | Modify | 003-005 | Real plan.md/tasks.md content |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modify | 006 | Registry-rule bridge |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`, `lib/coverage-graph/coverage-graph-signals.ts` | Modify | 007 | Sliding-window mode |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-fanout-session-id-propagation` | Bind the real fan-out session_id into review/research/context init instead of a timestamp (F002) | Complete |
| 002 | `002-fanout-leaf-identity-conflation` | Reword the shared fan-out prompt builder so it stops telling LEAF agents to run the full loop (F003) | Complete |
| 003 | `003-scaffold-content-002-deep-loop-runtime` | Author real plan.md/tasks.md content for 002's 18 leaf children | Complete |
| 004 | `004-scaffold-content-003-deep-loop-workflows` | Author real plan.md/tasks.md content for 003's 12 leaf children | Complete |
| 005 | `005-scaffold-content-004-through-007` | Author real plan.md/tasks.md content for phases 004/005/006/007's leaf children | Complete |
| 006 | `006-validate-sh-registry-bridge` | Wire registry-backed shell rules into the default validate.sh path | Complete |
| 007 | `007-sliding-window-convergence-mode` | Implement ADR-001's sliding-window convergence design | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before being marked Complete
- **Hard dependency**: phase 006 MUST NOT start until phases 003, 004, and 005 are all Complete — enabling the registry-backed `SCAFFOLD_NEVER_TOUCHED` rule by default before the scaffold content is fixed would fail `validate.sh --strict` on ~40 packets across phases 002-007
- Phases 001, 002, and 007 have no dependency on any other phase in this parent and may run in any order
- Run `validate.sh --recursive` on the 030 packet root after phase 006 specifically, to prove the dependency was honored

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 003, 004, 005 | 006 | All scaffold-content children Complete | `validate.sh --strict` passes on every touched leaf folder |
| 006 | (parent close-out) | Registry bridge shipped | `validate.sh --recursive` on 030 root shows 0 errors |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. Scope and the 003-005 -> 006 dependency confirmed via AskUserQuestion and Explore research before this phase was scaffolded.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
