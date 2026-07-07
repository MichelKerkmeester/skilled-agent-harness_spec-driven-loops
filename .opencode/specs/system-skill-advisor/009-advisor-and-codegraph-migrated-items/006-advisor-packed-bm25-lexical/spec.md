---
title: "Feature Specification: Packed BM25 + BM25F lexical lane for the advisor"
description: "The advisor lexical lane is token overlap plus static synonyms, leaning on hand-tuned synonym pressure. Adopt 027 phase 014's packed typed-array BM25 with BM25F field weights over skill fields to improve ambiguous routing, shadow-validated before any live weight change."
trigger_phrases:
  - "advisor BM25 lexical lane"
  - "BM25F field weights"
  - "packed postings advisor"
  - "lexical lane synonym pressure"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/003-advisor-packed-bm25-lexical"
    last_updated_at: "2026-06-10T21:14:49Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented packed BM25F shadow helper"
    next_safe_action: "Future promotion requires advisor_validate gate"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/bm25-lexical-shadow.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-advisor-packed-bm25-lexical"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "BM25F augments the current lexical lane as a default-off shadow helper; token-overlap remains the live lexical lane."
      - "Initial field weights are name > keywords > intentSignals > domains > derivedTriggers > description, query-time tunable in the helper."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: advisor-packed-bm25-lexical

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
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 9 |
| **Predecessor** | None |
| **Successor** | 009-codegraph-bm25-symbol-resolver (pattern reuse, soft) |
| **Source transfers** | Analysis #5 (packed BM25 + BM25F); adopts 027 phase 014 |
| **Handoff Criteria** | Phase validates `--strict`; BM25 lane remains shadow-only and has focused non-regression tests before any future live weight change |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the spec-027 feature adoption into the advisor and code-graph daemons. It augments the advisor's token-overlap lexical lane with a packed BM25F shadow helper.

**Scope Boundary**: The lexical lane only (`lib/scorer/lanes/lexical.ts`), plus the lane registry wiring and the `advisor_validate` baseline check. No changes to the semantic lane, fusion weights, or graph queries. The new lane ships shadow-first; live weight changes are gated on validation.

**Dependencies**:
- Soft pattern dependency with phase 009 (code-graph BM25): prove the advisor lane shadow-validated first, then reuse the pattern code-graph-side.

**Deliverables**:
- A packed (typed-array postings) BM25 + BM25F helper over skill fields: name, description, keywords, domains, intent signals, derived triggers.
- A default-off shadow wrapper and focused comparison tests proving live scorer output is unchanged.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor lexical lane is token overlap plus static synonyms/hints (`lib/scorer/lanes/lexical.ts:8-23` and `:50-85`), so routing quality depends on hand-tuned synonym pressure and degrades on ambiguous prompts. 027 phase 014 shipped packed typed-array postings with query-time field weights and proved the BM25F approach (`027 014/implementation-summary.md:52-59`).

### Purpose
Adopt 027 phase 014's packed BM25 + BM25F over the advisor's skill fields so ambiguous routing improves and synonym pressure drops, shipped shadow-first and validated against `advisor_validate` baselines before any live weight change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A packed BM25 + BM25F lexical lane (typed-array postings, per-field weights) over the advisor's skill fields.
- Lane registry wiring so the BM25 lane runs in shadow mode alongside the existing lexical lane.
- A baseline comparison harness using `advisor_validate` outcomes to decide if BM25 should replace or augment token overlap.

### Out of Scope
- Changing live fusion weights or promoting BM25 to primary before validation passes - that is gated, not in this scope by default.
- Touching the semantic lane (already live) or adding new embeddings.
- Building a general full-text store - this is an in-memory packed index over the skill corpus only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts` (~:8-23, :50-85) | Modify | Preserve token-overlap live scoring and expose a default-off BM25 shadow wrapper |
| `system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts` | Create | Packed typed-array postings + BM25F field weights |
| `system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts` | Modify | Register BM25 shadow metadata outside live `SCORER_LANES` |
| `system-skill-advisor/mcp_server/tests/scorer/bm25-lexical-shadow.vitest.ts` | Create | BM25F, footprint, corpus non-regression, and live scorer parity tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | BM25 lane ships shadow-first; live routing is unchanged until validated | With the shadow flag, `advisor_recommend` rankings are byte-identical to current; only shadow telemetry differs |
| REQ-002 | No live weight change without passing `advisor_validate` baselines | A documented baseline run shows non-regression before any flip; the flip is a separate gated step |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | BM25F scores across the named skill fields with per-field weights | Field-weighted scoring is unit-tested on a fixture corpus; name/keywords outweigh description as configured |
| REQ-004 | Packed postings keep the index small for the skill corpus | Index build is bounded and measured; memory footprint reported (small corpus may not need it - decision recorded) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On focused advisor-routing fixtures, the shadow BM25F helper matches or beats token-overlap lexical scoring while remaining out of live fusion.
- **SC-002**: Enabling the shadow lane changes no live ranking until an explicit, validation-gated flip.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Live routing regression from premature weight flip | High | Shadow-first (REQ-001) + validation gate (REQ-002) |
| Risk | Small skill corpus may not benefit from BM25 | Med - effort vs value | REQ-004 measures footprint; decision recorded; keep token overlap as fallback |
| Dependency | `advisor_validate` baselines | Med | Reuse existing outcome events as the comparison harness |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered: BM25F does not replace token overlap in this phase. It is a default-off shadow helper so live routing remains unchanged.
- Answered: initial weights are name 4.0, keywords 3.0, intentSignals 2.4, domains 2.2, derivedTriggers 1.8, description 1.0; a separate promotion phase must define any live advisor_validate gate.
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
