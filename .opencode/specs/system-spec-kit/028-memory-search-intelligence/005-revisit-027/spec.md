---
title: "Feature Specification: Revisit 027 Refinements Through the 028 Lens"
description: "Cross-packet deep-research child: re-examine the subjects packet 027 (XCE-derived Spec Kit refinement) shipped — memory write-safety, retention, causal-edge lifecycle, feedback reducers, incremental index, triggers, search resilience, daemon re-election, observability, derived-memory — against packet 028's aionforge/galadriel findings."
trigger_phrases:
  - "028 revisit 027 refinements"
  - "cross packet 027 028 reconciliation"
  - "027 subjects revisited with 028"
  - "bounded beta posterior feedback reducers"
  - "retention temporal close forget allowlist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-revisit-027"
    last_updated_at: "2026-06-16T20:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Seed 005 cross-packet revisit child for the deep-research loop"
    next_safe_action: "Run Round K mapping pass over Q1-Q11 against live 027 code"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-16-028-005-revisit-027"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: Revisit 027 Refinements Through the 028 Lens

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 027 (XCE-Derived Spec Kit Refinement) hardened the memory store, retrieval path, causal-graph lifecycle, learning feedback, and the daemon/IPC infrastructure — drawing on peck, gem-team, memclaw, and OpenLTM. Packet 028 then mined two memory engines 027 never had access to (aionforge-memory, Rust; galadriel, Python) and surfaced richer, code-mapped techniques for the *same* surfaces: edge-presence bi-temporal currentness, a bounded anti-flood Beta posterior, content-addressed idempotency, determinism + a generation watermark, query-class routing, and graceful-degrade discipline. 027's refinements were therefore designed without this prior art and may be superseded, extendable, or — in at least one case (the recall-trust ingest bypass) — incompletely covered.

### Purpose
For each subject 027 shipped, determine through 028's findings whether the external prior art **supersedes**, **extends**, **contradicts**, or is **already-covered-by** the live 027 implementation — producing a cited, code-mapped cross-packet **reconciliation ledger** that feeds the 028 roadmap. Read-only research; this child mines the same two external systems as 028 but targets 027's shipped code rather than greenfield subsystems.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only analysis of live 027 code/docs under `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/**` and the implicated subsystem sources.
- Cross-referencing 028's findings (`../research/roadmap.md` + child `research.md`) and the two external systems under `../external/`.
- A supersede / extend / contradict / already-covered reconciliation ledger, each row citing live 027 code + the 028 finding + (where applicable) the external source.

### Out of Scope
- Implementing any revisit candidate (deferred to a later packet).
- Modifying 027's shipped code or the external reference systems.
- Re-deriving 028's four-subsystem roadmap (this child builds on it, it does not replace it).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each ledger row cites live 027 code (file:line) and the 028 finding it is reconciled against | file:line + 028 candidate id per row |
| REQ-002 | Coverage spans 027's shipped subjects: write-safety/provenance, retention, causal-edge lifecycle, feedback reducers, incremental index/statediff, triggers, search resilience, daemon re-election/reconnect, observability, derived-memory | All Q1-Q11 addressed in research.md |
| REQ-003 | Each row carries a verdict (supersedes / extends / contradicts / already-covered / no-transfer) and leverage × effort | Verdict + ranking in research.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research.md contains a reconciliation ledger with ≥10 rows, each citing live 027 code and a 028 finding, each with a verdict.
- **SC-002**: The sharpest direct overlaps (feedback-reducers↔Beta posterior, retention↔temporal-close, provenance↔ingest-bypass, causal-edges↔bi-temporal, derived-memory↔content-addressed-id) are each resolved with evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 027 code drift / stale cited lines | Wrong verdict | Cite live file:line; treat each overlap as a hypothesis until the 027 code is opened |
| Risk | Early convergence | Fewer iterations than budget | Broaden to adjacent 027 phases, then resume a new generation |
| Dependency | 028 roadmap + child research.md | Reconciliation needs 028's findings | Read `../research/roadmap.md` (BROADENING ADDENDUM is authoritative) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1 (retention × bi-temporal close + forget-allowlist): should 027's tier-aware delete-sweep become a temporal-close, and does 028's 6-label forget-allowlist refine 027's tier gate?
- Q2 (provenance/write-safety × content-addressed idempotency + ingest-bypass): does 027's source_kind / write-ingress guard cover 028's recall-trust ingest-bypass, and does content-addressed identity strengthen 027's dedup?
- Q3 (causal-edge lifecycle/tombstones/promoter × full bi-temporal model): do 028's four-timestamp validity windows + SUPERSEDES/CONTRADICTS extend or fork 027's causal-edge lifecycle?
- Q4 (feedback reducers × bounded Beta posterior): should 027's learning feedback reducers adopt 028's anti-flood bounded Beta posterior, given 028 found the estimator is raw-frequency?
- Q5 (incremental index/statediff × determinism + generation watermark): is 027's incremental index output deterministic, and should statediff reconciliation carry a generation watermark?
- Q6 (semantic triggers × query-class routing): could 027's trigger matcher use 028's retrieval-class router as an additive axis?
- Q7 (daemon re-election/reconnect/IPC × graceful-degrade + reliability trust): does 028's degrade-discipline strengthen 027's reconnect, and could re-election use a reliability signal?
- Q8 (search resilience/score-scale/reranking/response-policy gate × deterministic RRF + active-channel denominator): how do 027's score-scale + response-policy fixes interact with 028's RRF determinism + query-class gating?
- Q9 (observability/continuity × consolidation gauges + newInfoRatio-ingest): does 028's gauge taxonomy extend 027's observability, and how does continuity meet bi-temporal as-of reads?
- Q10 (memclaw derived-memory write safety × content-addressed derived IDs + idempotent async consolidation): does 028's content-addressed derived identity strengthen 027's derived-memory safety under crash-replay?
- Q11 (capstone): where does 028 contradict or already-cover 027 — and does 028's "promote-off-state is 0-of-4 clean flips" temper 027's confidence that its own default-off flags are cheap to flip on?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research output**: See `research/research.md`.
- **028 roadmap**: See `../research/roadmap.md` (BROADENING ADDENDUM is authoritative).
- **027 packet**: See `../../027-xce-research-based-refinement/spec.md` + `before-vs-after.md`.
- **Parent Spec**: See `../spec.md`.
<!-- /ANCHOR:related-docs -->
