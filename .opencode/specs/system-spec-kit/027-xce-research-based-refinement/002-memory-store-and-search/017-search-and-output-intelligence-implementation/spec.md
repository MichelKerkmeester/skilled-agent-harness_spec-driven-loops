---
title: "Feature Specification: Phase 1: search-and-output-intelligence-implementation [template:level_1/spec.md]"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/017-search-and-output-intelligence-implementation"
    last_updated_at: "2026-06-17T06:03:01Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/017-search-and-output-intelligence-implementation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: search-and-output-intelligence-implementation

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (phase parent — control file) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-search-and-output-intelligence-research |
| **Successor** | None |
| **Handoff Criteria** | All 7 phase children pass `validate.sh --strict`; touched-surface test sweep green; each code change flag-reconciled |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the search-and-output-intelligence work: implementing the prioritized findings from the 016 deep-research (KQ1–KQ5 + recommendations #1–#7) via fresh claude2 Opus agents, one phase child per finding.

**Scope Boundary**: Retrieval-gating calibration, generic-query recall routing, and `/memory:search` output-contract parity. Builds on the already-shipped 015 `resolveAbsoluteRelevance` cosine calibration and the cold/deprecated-tier inclusion. Excludes index re-embedding (deferred, CPU-heavy) and a cross-encoder reranker (explicitly out per operator decision).

**Dependencies**:
- 015 (`resolveAbsoluteRelevance`) — cosine-based calibration already live; these phases tune the gate built on top of it.
- 016 research lineages — the evidence base each phase implements.

**Deliverables**:
- S1–S5 code phases (token-budget safety, request-quality aggregation, generic-query routing, confidence-calibration infra, cosine top-N reorder).
- O1–O2 command-contract phases (deterministic arg handling + salience inversion; output surface-parity).
- P5 disposition (FSRS cold-tier ranking): documented no-change — see §3.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After 015 fixed the dominant RRF-vs-cosine miscalibration, on-topic searches still under-report: generic 2–3 word queries read `weak`/`do_not_cite` despite mixed-but-relevant matches, a strong top hit is dragged down by a weaker tail, token-budget truncation hides results (5→1), and weak models render non-comparable output fields (`confidence` vs `similarity`) across surfaces. These are gate-aggregation, recall-routing, and output-contract gaps, not a retrieval miss.

### Purpose
Make a genuinely relevant search read as citable and render comparably on every surface, without re-embedding the corpus or adding a reranker.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Token-budget truncation safety so weak queries still surface all results (S1).
- Request-quality aggregation that lets a strong top hit earn citable (S2).
- Generic short-query routing that escalates low-signal queries for better recall (S3).
- Confidence-calibration infrastructure (isotonic fit/apply), flag-gated default-OFF (S4).
- Cosine top-N reorder of the head by absolute relevance (S5).
- `/memory:search` command-contract: deterministic arg handling + salience inversion (O1) and output surface-parity — one score/scale/name (O2).

### Out of Scope
- **Corpus re-embedding / index repair** — CPU-heavy; deferred until the operator is home and confirms. Not a code change in this packet.
- **Cross-encoder reranker** — explicitly excluded per operator decision ("Dont add reranker"); Stage-3 stays `provider:'none'`.
- **P5 — FSRS cold-tier ranking tuning — NO-CHANGE.** The 5th research problem (tune how cold/deprecated tiers rank) needs no code phase: 015 already admits cold/deprecated rows into the lexical + trigger channels and default-ON vector-lane Option-A backfill, and FSRS already supplies the temperature decay that ranks them. There is no miscalibration to fix here — over-tuning would fight the FSRS scheduler. Revisit only if live traffic shows cold rows mis-ordered against hot peers.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/*` (per-phase) | Modify | S1–S5 calibration/recall changes (see phase children for exact files) |
| `.opencode/commands/memory/search.md` + `assets/search_presentation.txt` | Modify | O1–O2 command/output contract |
| (none) | — | P5 is a documented no-change disposition |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [Requirement description] | [How to verify it's done] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | [Requirement description] | [How to verify it's done] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-token-budget-truncation-safety/ | S1 — skip-don't-break truncation + floor(3) + progressive disclosure | Complete |
| 2 | 002-request-quality-aggregation/ | S2 — top-dominant + margin-aware citable verdict | Complete |
| 3 | 003-generic-query-deep-routing/ | S3 — escalate low-signal short queries for recall | Complete |
| 4 | 004-confidence-calibration-labeled-set/ | S4 — isotonic calibration infra (flag-gated default-OFF) + proxy seed | Complete |
| 5 | 005-cosine-topn-reorder/ | S5 — stable head reorder by absolute relevance | Complete |
| 6 | 006-command-contract-structural/ | O1 — deterministic arg handling + salience inversion | Complete |
| 7 | 007-output-surface-parity/ | O2 — one score/scale/name across surfaces | Complete |

> P5 (FSRS cold-tier ranking) is intentionally **not** a phase child — see §3 Out of Scope for the no-change rationale.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-token-budget-truncation-safety | 002-request-quality-aggregation | [Criteria TBD] | [Verification TBD] |
| 002-request-quality-aggregation | 003-generic-query-deep-routing | [Criteria TBD] | [Verification TBD] |
| 003-generic-query-deep-routing | 004-confidence-calibration-labeled-set | [Criteria TBD] | [Verification TBD] |
| 004-confidence-calibration-labeled-set | 005-cosine-topn-reorder | [Criteria TBD] | [Verification TBD] |
| 005-cosine-topn-reorder | 006-command-contract-structural | [Criteria TBD] | [Verification TBD] |
| 006-command-contract-structural | 007-output-surface-parity | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->
