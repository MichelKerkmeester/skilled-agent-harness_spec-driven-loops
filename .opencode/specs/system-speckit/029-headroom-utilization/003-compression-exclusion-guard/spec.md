---
title: "Feature Specification: Compression Exclusion Guard Utility"
description: "Build a reusable, dependency-free guard (DENY_PATH + DENY_KEYS + citation-survival + raw-hash) that any future compression path must pass through, so control-plane data (generated JSON, metadata, MCP envelopes, state files, diffs, citations) can never reach a compressor."
trigger_phrases:
  - "compression exclusion guard"
  - "deny path deny keys"
  - "compression safety guard"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-headroom-utilization/003-compression-exclusion-guard"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the compression-exclusion-guard phase"
    next_safe_action: "Decide the guard module location and language"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-003-compression-exclusion-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Compression Exclusion Guard Utility

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
| **Rec** | #2 — Exclusion guard utility |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Builds the safety foundation the research specified before any compression exists. The guard is **our code with no Headroom dependency**; later phases (006) consume it. It encodes the exclusion set proven in `001-research/research/research.md` §A2.

**Dependencies**: None to build. Phase 006 (compress pilot) depends on this guard.

**Status**: Planned — not yet started. Scaffolded as a tracked phase under packet 029.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Any future use of compression near our content risks corrupting control-plane data whose exact bytes are load-bearing: generated `description.json` / `graph-metadata.json`, continuity frontmatter, MCP request/response envelopes, deep-loop state/deltas, code-graph readiness/diffs/identifiers, and source citations. Without a single chokepoint, every future compression call would have to re-implement the exclusions and could get them wrong.

### Purpose
Build one small reusable guard utility that every compression call must pass through, so the dangerous classes can never reach a compressor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A standalone guard module (our code, no Headroom dependency): `DENY_PATH` patterns + `DENY_KEYS` set.
- Pre/post `[SOURCE:]` citation extraction and equality check; raw sha256 capture for restore.
- Unit tests with positive (allowed) and negative (must-reject) fixtures.

### Out of Scope
- Calling Headroom or any compressor (006 wires it in).
- Production wiring into live paths.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| guard module | Create | Reusable DENY_PATH/DENY_KEYS + citation + hash guard (TS, to match our tooling) |
| guard tests | Create | Positive + negative fixtures; 100% rejection of excluded classes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Guard rejects every excluded path/key class | 100% rejection across negative fixtures (description.json, graph-metadata.json, state.jsonl, deltas, MCP envelope, diff/patch, hook JSON) |
| REQ-002 | Guard preserves citation integrity | Pre/post `[SOURCE:]` sets compared; any loss → reject and fall back to raw |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Deterministic + dependency-free | Same input → same verdict; no Headroom import required to run the guard |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The guard is a reusable, dependency-free utility with green tests.
- **SC-002**: 100% of negative fixtures are rejected; allowed copied bundles pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Incomplete deny list | A dangerous class slips through | Derive the list verbatim from the research exclusion set; cover with negative fixtures |
| Risk | Over-broad deny list | Blocks legitimate copied bundles | Allowlist the explicit copied-bundle artifact kind; test positive fixtures |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where should the guard module live so both deep-loop tooling and a future compress shim can import it?
- TypeScript (matches our scripts) vs Python (matches Headroom) — which side owns the guard?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Research basis**: `../001-research/research/research.md`
