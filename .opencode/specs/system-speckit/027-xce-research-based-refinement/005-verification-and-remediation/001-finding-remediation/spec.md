---
title: "Feature Specification: Epic Finding Remediation (Phase Parent)"
description: "Phase parent for remediating every finding from the 120-seat epic deep-review sweep: 132 P1 clusters (101 unverified single-seat claims) and 119 P2 clusters, processed verify-first across eight subsystem lanes with GPT-5.5 implementation and Fable 5 verification."
trigger_phrases:
  - "027 finding remediation"
  - "epic sweep remediation phases"
  - "p1 p2 backlog lanes"
importance_tier: "important"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/001-finding-remediation"
    last_updated_at: "2026-06-11T19:10:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All 8 lanes closed: every P1/P2 entry terminally dispositioned"
    next_safe_action: "Successor: MiMo v2.5 Pro playbook runs for the 3 system skills"
    blockers: []
    key_files:
      - "backlog/p1-backlog.json"
      - "backlog/p2-backlog.json"
      - "remediation-plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-027-finding-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Verify-first pipeline: single-seat claims refute ~50% historically, so nothing is fixed unverified."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  REQUIRED content: root purpose, sub-phase list, what needs done.
-->

# Feature Specification: Epic Finding Remediation (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (Phase Parent) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
| **Predecessor** | review/epic-sweep (the 120-seat review this remediates) |
| **Successor** | Manual-testing-playbook runs (MiMo v2.5 Pro subject) |
| **Handoff Criteria** | Every backlog entry carries a terminal disposition (fixed, refuted, waived-convention, or follow-on) with evidence; all lanes strict-validate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 120-seat epic deep-review sweep adjudicated only its 41 strongest finding clusters (23 confirmed and fixed). That left 101 single-seat P1 claims and 119 P2 clusters inventoried but never individually examined. Single-seat claims historically refute about half the time, so they can be neither fixed blindly nor dismissed blindly.

### Purpose
Drive every remaining finding to a terminal, evidence-backed disposition: refute-first Fable 5 verification per subsystem lane, GPT-5.5-fast (high) implementation of confirmed findings, Fable verification of each implementation, and batch triage of the P2 pool (fix the real, waive the convention-noise with stated reasons).

> **Phase-parent note:** detailed planning and per-finding state live in the lane children and `backlog/`. The machine-readable backlogs (`backlog/p1-backlog.json`, `backlog/p2-backlog.json`) are the canonical finding inventory; `remediation-plan.md` is the pipeline state surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 132 P1 clusters: 19 already fixed (echoes of the verified tier), 2 refuted, 10 downgraded, 101 to verify and remediate where confirmed.
- All 119 P2 clusters: per-lane triage to fix-or-waive with explicit reasons.
- Eight subsystem lanes as child phases (see Phase Documentation Map).

### Out of Scope
- The manual-testing-playbook runs (successor work, after all lanes close).
- New features; every change is a remediation of a recorded finding.

### Files to Change
Per-lane; each child's plan enumerates its confirmed findings' target files from the backlog.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `backlog/*.json` | Reference | Canonical finding inventory with dispositions |
| Per-lane source/test/doc files | Modify | Confirmed-finding fixes only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each lane is an independently executable child. Pipeline per lane: Fable refute-first verification of the lane's unverified P1s, GPT-5.5-fast (high) implementation of confirmed items, Fable implementation-verification, P2 triage, targeted tests, scoped commit.

| Phase | Folder | Focus | P1 to verify | P2 | Status |
|-------|--------|-------|--------------|----|--------|
| 1 | `001-write-safety-and-guards/` | Retention/guard/provenance protections (write-safety, memclaw, provenance phases) | 13 | 12 | Complete |
| 2 | `002-causal-and-memo/` | Causal graph, corrections, memo DAG multi-writer correctness | 10 | 5 | Complete |
| 3 | `003-search-and-triggers/` | Trigger matching scope, retrieval observability consistency | 9 | 13 | Complete |
| 4 | `004-vector-and-checkpoint-durability/` | Vector shard rebuild/attach integrity, checkpoint invalidation | 12 | 19 | Complete |
| 5 | `005-bm25-indexing-fidelity/` | Packed BM25 incremental-indexing field fidelity, RSS gate realism | 4 | 1 | Complete |
| 6 | `006-launchers-and-cli/` | Daemon launchers (advisor flags/trust/PID), CLI front-door correctness | 21 | 19 | Complete |
| 7 | `007-continuity-and-save-concurrency/` | Parent-metadata concurrency, snapshot/receipt ordering, save schema | 13 | 15 | Complete |
| 8 | `008-doc-truth-and-test-fidelity/` | Remaining doc-truth stragglers, benchmark/test fidelity, port fakes | 19 | 35 | Complete |

### Phase Transition Rules
- Lanes are independent and may run in parallel waves; each lane MUST pass `validate.sh` and its targeted test suites before its commit.
- A finding may only be closed as fixed with a passing regression or directly observable corrected behavior; refuted/waived dispositions require a stated reason in the lane's implementation summary.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at scaffold. Lane verification may reclassify individual findings (P1 to P2 or refuted); the backlog JSON carries the final word.
<!-- /ANCHOR:questions -->
