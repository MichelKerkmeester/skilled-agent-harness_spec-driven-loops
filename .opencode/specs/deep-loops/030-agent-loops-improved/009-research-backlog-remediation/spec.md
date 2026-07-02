---
title: "Research Backlog Remediation"
description: "Phase parent tracking implementation of the deep-research fan-out's Tier 0/1/2 remediation backlog (research/research.md): tooling bug fixes, claimed-vs-actual drift closure, and infra/design hardening."
trigger_phrases:
  - "research backlog remediation"
  - "009 remediation"
  - "fanout-merge schema fix"
  - "tier 0 tier 1 tier 2 backlog"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation"
    last_updated_at: "2026-07-01T17:35:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All 11 children complete and independently verified; phase closed"
    next_safe_action: "None — phase 009 fully complete, no children remain"
    blockers: []
    key_files:
      - ".opencode/specs/deep-loops/030-agent-loops-improved/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research Backlog Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 9 of 11 |
| **Predecessor** | 008-loop-systems-remediation |
| **Successor** | 010-documentation-truth-audit |
| **Handoff Criteria** | Each child phase validates independently under `validate.sh`; Tier 0 children must land before Tier 1/2 children are trusted (Tier 0 fixes the very tooling the backlog itself came from) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the `agent-loops-improved` packet: implement the prioritized remediation backlog produced by a 2-lineage (GLM-5.2 xhigh + GPT-5.5-fast high) deep-research fan-out against this exact packet (`research/research.md`, compiled 2026-07-01). That research pass found 26 corroborated findings plus one critical bug in its own tooling (the fan-out merge script silently dropped 69% of one lineage's findings) and produced a 19-item, 4-tier backlog. This phase implements **Tier 0, 1, and 2** (18 items); Tier 3 (the 6 proposed `validate.sh --strict --semantic` systemic-prevention checks) is explicitly **out of scope** for this phase.

**Scope Boundary**: fixes to the deep-loop-runtime fan-out/merge scripts (Tier 0), drift-closure across this packet's own spec/metadata/registry files (Tier 1), and convergence/observability infra hardening (Tier 2). All implementation lives in the child phases below.

**Dependencies**: `research/research.md` (the source backlog) must remain the reference of record; children should cite it (`§4`/`§5` finding IDs) in their own evidence trails rather than re-deriving findings.

**Execution model**: each child is planned and implemented by dispatching to `xiaomi/mimo-v2.5-pro-ultraspeed` via `cli-opencode` (operator-directed executor), then independently verified by the orchestrating Claude Sonnet 5 session (operator-directed verifier) before being marked Complete.

**Deliverables**: ten independently-shipped remediation children, grouped by theme and priority tier (see Phase Documentation Map below).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-research fan-out against this packet found: (1) a critical, silent data-loss bug in the fan-out merge tool itself (`fanout-merge.cjs` drops registries whose schema doesn't use the exact `keyFindings` key, with no warning), (2) three more confirmed bugs in the shared deep-loop-runtime fan-out/convergence machinery (convergence-threshold propagation gap, 4-hour lineage timeout with no override, a salvage/duplicate-filename naming defect), and (3) systemic drift across this packet's own documentation between claimed-Complete status and actual evidence (stale Phase Documentation Map rows, stale `completion_pct` continuity, unreconciled review registries, incomplete graph-metadata, old-packet-number migration residue, missing ADR governance docs, live template scaffolds under Complete-status folders).

### Purpose
Close every Tier 0/1/2 backlog item as an independently-shipped, independently-verified child phase, in priority order — fix the tooling the research itself depends on first (Tier 0), then close the claimed-vs-actual drift the tooling revealed (Tier 1), then harden the underlying infra/design (Tier 2).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Tier 0 — fix the research/review tooling before trusting it further (children 001-003).
- Tier 1 — close the drift between claimed-complete and actual evidence (children 004-007).
- Tier 2 — infrastructure/design hardening (children 008-010).

### Out of Scope
- Tier 3 (the 6 proposed `validate.sh --strict --semantic` systemic-prevention checks) — tracked as a follow-up, not part of this phase.
- Any net-new loop features beyond what the backlog names (tracked in earlier phases 002-008 if ever needed).
- Re-running the deep-research fan-out itself — this phase consumes its output, it does not re-derive it.

### Files to Change

Audit-trail summary only; per-child detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modify | 001 | Schema-tolerant merge / loud schema-mismatch warning |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | 002, 003, 008 | Timeout override, salvage-naming fix, threshold-default alignment, stop-policy flag |
| `.opencode/commands/deep/assets/deep_review_auto.yaml`, `deep_research_auto.yaml` | Modify | 003, 008 | Comment-hygiene cleanup, forced-depth flag docs |
| `030-agent-loops-improved/**/spec.md`, `graph-metadata.json`, `description.json` | Modify | 004-007 | Phase-doc-map sync, completion_pct backfill, old-packet-number cleanup, registry disposition, metadata backfill, scaffold authoring |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modify | 010 | Template-default-content detection |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Tier | Focus | Status |
|-------|--------|------|-------|--------|
| 1 | `001-fanout-merge-schema-tolerance` | 0 | Fix silent finding-loss in fanout-merge.cjs (critical) | Complete |
| 2 | `002-fanout-timeout-override` | 0 | `--lineage-timeout-hours` override for the 4h hard cap | Complete |
| 3 | `003-runtime-hygiene-fixes` | 0 | Comment-hygiene cleanup + salvage/duplicate-filename naming fix | Complete |
| 4 | `004-phase-doc-map-and-completion-pct-sync` | 1 | Sync 40 phase-map rows + backfill 40 completion_pct blocks | Complete |
| 5 | `005-packet-identity-cleanup` | 1 | Old-packet-number find-replace + stale native lock removal | Complete |
| 6 | `006-review-registry-and-metadata-backfill` | 1 | Review-finding disposition + graph-metadata key_files backfill | Complete |
| 7 | `007-parent-scaffold-and-governance-docs` | 1 | Real 008-parent docs + missing ADR decision-records/checklists | Complete |
| 8 | `008-convergence-threshold-and-forced-depth-flag` | 2 | Threshold-default alignment + `--stop-policy=max-iterations` as first-class flag | Complete |
| 9 | `009-convergence-design-and-hardening` | 2 | Sliding-window convergence design + 4 hardening recs | Complete |
| 10 | `010-validate-sh-template-detection` | 2 | Template-default-content detection in `validate.sh` | Complete |
| 11 | `011-synthesis-integrity-and-orchestrator-watchdog` | 0 | Synthesis-completion invariant + orchestrator post-exit watchdog + `reconstructResearchRegistryFromState` (found by generation-2 forced-depth research, not in the original Tier 0-2 backlog) | Complete |

### Phase Transition Rules

- Tier 0 children (1-3) SHOULD land before Tier 1/2 children are implemented, since Tier 1/2 work trusts the same merge/runtime tooling Tier 0 repairs.
- Each phase MUST pass `validate.sh` independently before being marked Complete.
- Parent spec tracks aggregate progress via this map; update the Status column as each child ships.
- Run `validate.sh --recursive` on the root packet to validate all phases as an integrated unit once this phase closes.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-003 (Tier 0) | 004-007 (Tier 1) | Merge tool no longer silently drops findings; comment-hygiene clean; salvage naming fixed | Regression tests pass; `validate.sh --strict` clean |
| 004-007 (Tier 1) | 008-010 (Tier 2) | Claimed-vs-actual drift closed for the packet itself | `validate.sh --recursive` clean |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Tier 3 (systemic-prevention `validate.sh --strict --semantic` checks) is deliberately deferred — revisit as a follow-up phase once Tier 0-2 land, since several of those checks would have caught Tier 1 findings automatically.
- **Research regeneration in flight (2026-07-01T07:11Z)**: the original `research/research.md` (26 findings) was archived to `research/research_archive/20260701T071133Z-gen1/` and a deeper, forced-depth re-run (35 iterations/lineage via `stopPolicy=max-iterations`, generation 2) is running in the background to close the ≥30-iteration gap the operator originally required. This phase's children were planned against the generation-1 backlog, whose findings were independently re-verified against live files/code by this session (not taken on trust) — they remain valid regardless of the new pass's finding-ID numbering. When generation 2 completes, reconcile via the old↔new ID crosswalk and fold any genuinely new findings into this phase (new child if warranted) rather than assuming generation 1 is superseded wholesale.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Source backlog**: `../research/research.md` (§4 Consolidated Findings, §5 Prioritized Remediation Backlog, §6 Meta-Findings)
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
