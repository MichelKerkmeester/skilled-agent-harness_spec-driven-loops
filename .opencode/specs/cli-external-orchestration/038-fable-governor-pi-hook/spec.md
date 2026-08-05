---
title: "Phase Parent: Fable Governor Hook Research + Pi-Only Subagent Dispatch Directive"
description: "Two-part research and follow-up: (1) evaluate whether the fable governor per-turn hook should be updated or replaced with the governor logic now embedded in AGENTS.md; (2) design a pi-only per-turn hook directive mandating native pi-subagents plugin for subagent dispatch unless the user explicitly requests a specific cli-* skill mode."
trigger_phrases:
  - "fable governor hook"
  - "governor capsule"
  - "pi subagents directive"
  - "pi-only hook"
  - "subagent dispatch policy"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook"
    last_updated_at: "2026-08-05T00:23:03Z"
    last_updated_by: "pi-phase-state-reconciliation"
    recent_action: "Completed packet status reconciliation and refreshed all phase metadata"
    next_safe_action: "Preserve the uncommitted-state freshness caveat; no further in-scope implementation remains"
    blockers: []
    key_files:
      - "spec.md"
      - "006-dispatch-authorization-hardening/spec.md"
      - "007-dispatch-validation-evidence/spec.md"
      - "008-phase-state-reconciliation/spec.md"
      - "009-injection-contract-directive-sync/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All nine phases have evidence-supported Complete status; the package-root corpus remains an explicit exit-1 deferral."
      - "The final packet remains uncommitted, so any CONTINUITY_FRESHNESS warning is reported separately."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Fable Governor Hook Research + Pi-Only Subagent Dispatch Directive

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-external-orchestration/038-fable-governor-pi-hook |
| **Predecessor** | None |
| **Successor** | Implementation phases (added after research converges) |
| **Handoff Criteria** | All nine child phases have evidence-supported status, current generated metadata, and a recursive strict-validation receipt with any uncommitted-state freshness warning reported separately |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fable governor per-turn hook re-states a compact disposition capsule every turn, but AGENTS.md now embeds richer governor and proof-over-appearance logic. The two may have drifted in intent. Separately, pi lacks a per-turn directive that mandates the native pi-subagents plugin for subagent dispatch, so pi may default to ad-hoc dispatch or cli-* skills unless the user explicitly requests a specific cli skill mode.

### Purpose
Decide keep/update/replace for the governor hook based on evidence, and design a pi-only per-turn directive hook for subagent dispatch policy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for governor-hook research + pi directive design
- Per-phase implementation details in child folders

### Out of Scope
- Detailed per-phase implementation plans at the parent level

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-research/**` | Create | research | Research evidence, iteration logs, synthesis |
| `hooks/**` + `skills/system-spec-kit/constitutional/fable-governor.md` | Modify (later) | follow-up | Governor capsule keep/update/replace application |
| pi hook chain (`hooks/pi/**`, `prompt-advisor.ts`) | Create/Modify (later) | follow-up | Pi-only subagent dispatch directive injection |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research/ | Three-model research on governor-hook usefulness + pi subagent directive design (5x GPT-5.6 Luna max, 3x GLM 5.2 via cli-devin, 2x Grok 4.5 Max via cli-cursor; no early convergence) | Complete (2026-08-04) |
| 2 | 002-governor-parity/ | Bridge fallback parity fix (proof directive) + injection-contract label sync | Complete (2026-08-04, cli-codex) |
| 3 | 003-pi-directive-capsule/ | Pi-only per-turn directive line (native pi-subagents default, explicit cli-* override) | Complete (2026-08-04, cli-codex) |
| 4 | 004-pi-directive-enforcement/ | tool_call deny reusing DISPATCH_SHAPES (pi-default; user-text override token; deep-loop exempt) | Complete (2026-08-04, cli-codex) |
| 5 | 005-agents-md-pi-row/ | AGENTS.md §8 Pi row (coordinated with agents/002-runtime-surface-coverage) | Complete (2026-08-04, cli-codex) |
| 6 | 006-dispatch-authorization-hardening/ | P0/P1 dispatch-boundary remediation: unconditional cli-pi self-deny, exact executor authorization, bounded direct/ambiguous/none command inspector, raw-user capture, factory-level Pi tool_call matrix | Complete (2026-08-04; focused implementation evidence recorded) |
| 7 | 007-dispatch-validation-evidence/ | P2 evidence remediation: four-class evidence ledger, registered Pi factory evidence, claim correction, full-corpus baseline with bounded deferral | Complete (2026-08-04; focused gates pass; full corpus remains exit 1) |
| 8 | 008-phase-state-reconciliation/ | P2 state remediation: status/completion reconciliation across 001-009, parent map + handoff repair, generated metadata refresh, resume pointer | Complete (2026-08-05; metadata and state reconciliation verified) |
| 9 | 009-injection-contract-directive-sync/ | P3 contract remediation: injection-contract.md documents all three advisor directives (comment hygiene, governor, proof-over-appearance) and owning modules | Complete (2026-08-05; scoped contract verification recorded) |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research | 002-governor-parity | Keep/update/replace verdict + pi directive design delivered | evidence/synthesis.md present; 10 iterations logged |
| 002-governor-parity | 003-pi-directive-capsule | Bridge fallback parity + label sync shipped | vitest green; grep parity assertions |
| 003-pi-directive-capsule | 004-pi-directive-enforcement | Pi turns carry the directive; pi-only scope proven | tests + headless pi run exit 0 |
| 004-pi-directive-enforcement | 005-agents-md-pi-row | Deny matrix green; deep-loop exempt | matrix tests pass |
| 005-agents-md-pi-row | 006-dispatch-authorization-hardening | Pi row present exactly once; dispatch-boundary remediation contract accepted | grep AGENTS.md; phase 006 strict validation passes |
| 006-dispatch-authorization-hardening | 007-dispatch-validation-evidence | Registered Pi factory blocks cli-pi self-dispatch and executor mismatch; raw-user authorization proven | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` (27/27 combined) and the Phase 006 evidence ledger |
| 007-dispatch-validation-evidence | 008-phase-state-reconciliation | Evidence classes separated; full-corpus baseline has owner and revisit trigger | focused Pi suite 32/32; `evidence/full-corpus-baseline.md` records exit 1 and the complete failure ledger |
| 008-phase-state-reconciliation | 009-injection-contract-directive-sync | Phase 008 reconciliation is complete and Phase 009's contract evidence is retained without source changes | recursive strict validation of the parent packet; any dirty-worktree freshness warning is reported separately |
| 009-injection-contract-directive-sync | — | injection-contract.md documents all three directives and owning modules | directive grep assertions exit 0; phase 009 strict validation passes |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does the governor capsule duplicate, complement, or contradict AGENTS.md §Operating Discipline?
- Where exactly does the per-turn capsule get injected in each runtime's hook chain (pi prompt-advisor.ts, mk-skill-advisor.js, render.ts)?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-research/` (research phase)
- **Governor doctrine**: `.opencode/skills/system-spec-kit/constitutional/fable-governor.md`
- **Graph Metadata**: `graph-metadata.json` for `derived.last_active_child_id` pointer
