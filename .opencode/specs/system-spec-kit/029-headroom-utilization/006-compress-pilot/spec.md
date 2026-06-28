---
title: "Feature Specification: Scoped Offline compress() Pilot"
description: "Run a scoped, offline Headroom compress() pilot on one copied non-authoritative artifact behind the 003 guard, measuring real token savings, citation survival, and rejection of excluded fixtures — turning the proven perfect-fit design into a measured result."
trigger_phrases:
  - "compress pilot"
  - "headroom compress benchmark"
  - "perfect fit pilot"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-headroom-utilization/006-compress-pilot"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the compress-pilot phase"
    next_safe_action: "Pick one large copied artifact and reuse the 004 install"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-006-compress-pilot"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Scoped Offline compress() Pilot

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/154-design-context-loading` |
| **Parent Spec** | ../spec.md |
| **Rec** | #6 — Offline compress() pilot |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Measures the perfect-fit design from `001-research/research/research.md` §Part A. The research proved the design at the source level but the savings number is a deterministic estimate, not a live measurement (the live call was dependency-blocked). This phase closes that one open gate.

**Dependencies**: Depends on 003 (the exclusion guard) and 004 (the isolated install).

**Status**: Planned — not yet started. Scaffolded as a tracked phase under packet 029.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research specified a perfect-fit integration (guarded offline compress() over copied non-authoritative bundles) and demonstrated ~47% savings as a deterministic char-based estimate, because the live Headroom call could not run in the research sandbox. We have not measured real token savings or citation survival on a live run, nor confirmed the guard rejects excluded artifacts in practice.

### Purpose
Run one scoped, offline compress() pilot behind the 003 guard on a real copied artifact, measuring live token savings, citation survival, and 100% rejection of excluded fixtures.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reuse the 004 isolated install; pick one large copied non-authoritative artifact.
- Run it through the 003 guard, then `compress()` with the conservative config (`compress_system_messages=False`, `kompress_model="disabled"`).
- Measure before/after tokens + `[SOURCE:]` citation equality; run negative fixtures to confirm rejection.

### Out of Scope
- Production wiring / the proxy / `wrap`.
- Touching any authoritative artifact (copied input only, sibling output only).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| pilot harness | Create | Guard → compress() → measure, over one copied artifact + negative fixtures |
| `research/compress-pilot-report.md` | Create | Measured token delta + citation survival + rejection results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Measured positive token delta | Live compress() on ≥1 large copied bundle records a real before/after token reduction |
| REQ-002 | Citation survival | 100% `[SOURCE:]` equality on accepted cited fixtures |
| REQ-003 | Excluded fixtures rejected | 100% rejection of negative fixtures (description.json, graph-metadata.json, state.jsonl, deltas, MCP envelope, diff, hook JSON) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Deterministic re-run | Same input + config reproduces the same compact output or the sidecar is flagged invalid |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The perfect-fit design is validated with measured (not estimated) numbers, or its real limits are documented.
- **SC-002**: The guard rejects 100% of excluded fixtures in a live run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Real savings below the estimate | Lower value than hoped | Report honestly; conservative config; decide on measured value |
| Risk | Fidelity loss on a real artifact | Answers/citations degrade | Citation gate + fail-safe to raw; answer-probes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which copied artifact best represents a high-value low-risk bundle?
- What measured savings threshold makes adoption worthwhile?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Research basis**: `../001-research/research/research.md`
