---
title: "Phase 4 (BACKLOG-ONLY, per council §10.7): Stretch goals — H-5, H-7, H-9 + M-1..M-6"
description: "BACKLOG-ONLY parking lot inside packet 108 — no implementation work happens here. H-4 promoted to Phase 2 MVP. H-8 dropped (duplicates H-1's deep-review verdict per council §10.6). Remaining stretch teachings: H-5 3-tier config, H-7 marker-based dedup, H-9 bounded evidence + M-1..M-6. If pursued in future, lift this content into a fresh packet 109 — do NOT implement inside packet 108."
trigger_phrases:
  - "108 phase 4 stretch goals"
  - "h4-h9 medium teachings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/108-auto-review-quick-wins-verdict-markers-logging/004-stretch-goals"
    last_updated_at: "2026-05-16T07:00:00Z"
    last_updated_by: "claude-opus-4-7-108-scaffold"
    recent_action: "phase_4_spec_scaffolded_OPTIONAL_awaiting_council"
    next_safe_action: "deferred_until_phases_1_3_complete_and_capacity_allows"
    blockers:
      - "Phases 1-3 (MVP) not yet complete"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-108-004-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Should Phase 4 become a separate packet 109?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4 Stretch Goals (OPTIONAL)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 (OPTIONAL — packet declared complete after Phases 1-3) |
| **Status** | Planned — deferred until MVP complete + capacity available |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Phase Parent** | `108-auto-review-quick-wins-verdict-markers-logging` |
| **Source teachings** | H-4, H-5, H-7, H-8, H-9 + M-1..M-6 from `106/research/review-report.md` §5 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phases 1-3 deliver the MVP (5 quick wins), 11 additional teachings remain in 106's findings: 4 HIGH-impact MEDIUM-cost (H-4 anti-repetition rule, H-5 3-tier config, H-7 marker-based dedup, H-8 per-iteration verdict, H-9 bounded evidence) + 6 MEDIUM-impact teachings. Adopting them would close more gaps but at higher implementation cost. This phase is OPTIONAL — pursue only if Phases 1-3 prove the approach AND capacity is available.

### Purpose
Provide a planned home for the stretch teachings so they don't fall off the radar. Each teaching gets a sub-section in §3 SCOPE with a concrete implementation path; deciding which to adopt happens at Phase 4 start (post-MVP), not at scaffold time.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (à la carte — operator picks which to adopt)

| Teaching | Surface | Cost | Status |
|----------|---------|------|--------|
| ~~H-4 anti-repetition rule~~ | ~~prompts~~ | ~~LOW~~ | **PROMOTED to Phase 2 MVP** (council §5.2 + §10.3) |
| H-5 3-tier config (file > env > default) | mk-skill-advisor, mk-code-graph plugins | MEDIUM | BACKLOG (packet 109 if pursued) |
| H-7 marker-based dedup for findings | deep-review multi-dimensional loops | MEDIUM | BACKLOG |
| ~~H-8 PASS/FAIL/UNKNOWN per-iteration verdict~~ | ~~deep-review~~ | ~~MEDIUM~~ | **DROPPED — duplicates H-1's deep-review verdict** (council §10.6) |
| H-9 bounded evidence interpolation | deep-review for large packets | LOW | BACKLOG |
| M-1 PR state dedup | sk-code-review | MEDIUM | BACKLOG |
| M-2 min-evidence gate (opt-in) | sk-code-review | LOW | BACKLOG |
| M-3 mutation signature dedup | deep-agent-improvement | MEDIUM | BACKLOG |
| M-4 enable gate for diagnostic logging | skill-advisor (overlaps Phase 3) | LOW | BACKLOG (likely absorbed by Phase 3) |
| M-5 safe stringify fallback | code-graph (overlaps Phase 3) | LOW | BACKLOG (likely absorbed by Phase 3) |
| M-6 async config init | mk-skill-advisor, mk-code-graph | LOW | BACKLOG |

### Out of Scope
- Any LOW-impact teaching (L-1, L-2, L-3) — these are architectural mismatches per 106's reject list
- Re-doing 106 research or council review (already complete)

### Files to Change
Each teaching's implementation path lists specific files. See 106's review-report.md §5 for full file:line citations. This packet does not pre-commit to specific files until Phase 4 start, when operator selects which teachings to adopt.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Phases 1-3 complete before Phase 4 starts | Strict validate exit 0 on 001/002/003 children |
| REQ-002 | Operator selects subset of teachings at Phase 4 kickoff | Subset documented in implementation-summary.md before edits begin |
| REQ-003 | Each adopted teaching gets file:line evidence in commit messages | Audit trail preserved |
| REQ-004 | Phase 4 strict validate exit 0 after each batch of teachings | Validation gate per batch |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 4 selection documented (which teachings adopted, which deferred).
- **SC-002**: Each adopted teaching has a passing smoke-test.
- **SC-003**: Strict validate exit 0 after Phase 4 completion.
- **SC-004**: Phase parent reconciliation: derived.last_active_child_id set to 004 if Phase 4 ran.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Risk | Impact | Mitigation |
|------|------|--------|-----------|
| Risk | Scope creep — operator adopts too many teachings in one batch | Schedule slip | Recommend batch size ≤ 3 teachings per commit |
| Risk | Phase 4 happens before Phases 1-3 stabilize | Conflicting edits | Hard gate: don't start Phase 4 until Phases 1-3 pushed + green |
| Risk | Stretch goals duplicate work in another packet | Wasted effort | Check for existing packets (e.g. M-3 mutation signatures may already be in deep-agent-improvement work) |
| Dependency | Phases 1-3 complete | Phase 4 gate | Track via parent derived.last_active_child_id |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **Q1**: Should Phase 4 be split into a separate packet 109? Council to advise — packet-per-phase or stretch-as-child both valid.
2. **Q2**: Which of the 11 teachings is highest leverage post-MVP? Council to recommend priority order.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:iteration-plan -->
## 8. ITERATION PLAN

| # | Step |
|---|------|
| 1 | Verify Phases 1-3 complete + pushed |
| 2 | Operator selects teaching subset for Phase 4 (documented in implementation-summary.md) |
| 3 | Implement selected teachings one batch at a time (≤ 3 per commit) |
| 4 | Smoke-test per batch |
| 5 | Strict validate after each batch |
| 6 | Update parent derived.last_active_child_id to 004 |
<!-- /ANCHOR:iteration-plan -->
