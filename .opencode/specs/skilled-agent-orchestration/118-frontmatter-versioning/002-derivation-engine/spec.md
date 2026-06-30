---
title: "Feature Specification: Phase 2 — Derivation Engine"
description: "There is no deterministic tool to compute each doc's correct version (changelog-anchored, numstat-gated edit count) and insert it without corrupting YAML; the 2,222-file retroactive pass needs a reproducible, idempotent engine with a dry-run manifest and a verify mode."
trigger_phrases:
  - "derivation engine"
  - "frontmatter version script"
  - "numstat gated edit count"
  - "version dry-run manifest"
  - "idempotent version insert"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-frontmatter-versioning/002-derivation-engine"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the deterministic compute/insert/verify engine plus a 21-assertion test suite"
    next_safe_action: "Phase complete; commit the working tree when ready"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/frontmatter-version.mjs"
      - ".opencode/skills/system-spec-kit/scripts/spec-folder/nested-changelog.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-derivation-engine"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The entire derivation + insertion path is deterministic and scripted; MiMo is not in the compute path."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2 — Derivation Engine

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
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-versioning-standard |
| **Successor** | 003-apply-core-skill-docs |
| **Handoff Criteria** | Engine passes unit tests; dry-run manifest reviewed; idempotent re-run is a no-op |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Skill Frontmatter Versioning specification.

**Scope Boundary**: a single deterministic script plus tests under `sk-doc/scripts/`. The engine only dry-runs in this phase — no corpus edits (3-4), no standards edits (1).

**Dependencies**:
- Phase 1 version standard (the `X.Y.Z.W` semantics + changelog-anchored derivation rules the engine implements).

**Deliverables**:
- `frontmatter-version` script: compute (anchor = `max(frontmatter, changelog)`; `W` = numstat-gated edit count), insert (line-wise, last key before closing `---`, idempotent), `--verify`, and a dry-run CSV/JSON manifest.
- Unit tests on fixtures: 5-field, 2-field, no-frontmatter, already-versioned, 3-part SKILL.md.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Computing the correct version for ~2,500 files by hand is infeasible and unsafe. The version must be derived (anchor = the higher of the SKILL.md frontmatter and the latest `changelog/v*.md`; build segment = the count of commits that actually changed lines in that file), and inserted without reflowing multi-line `trigger_phrases` arrays. A naive `git log --follow | wc -l` over-counts 3-5x because of a historical repo-wide rename and bulk sweeps.

### Purpose
A deterministic, idempotent engine exists that computes each in-scope file's version per the phase-1 standard, emits a reviewable dry-run manifest, inserts the field line-wise without YAML corruption, and verifies results — reproducible from the same git state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `frontmatter-version` script: select (manifest/globs), compute (anchor + numstat-gated `W`), insert (idempotent, line-wise), `--verify`.
- Dry-run CSV/JSON manifest (`path, fileClass, skill, anchor, anchorSource, realEditCount, derivedVersion, action`).
- Unit tests + fixtures covering the frontmatter variants and the rename-inflation case.

### Out of Scope
- Running the engine on the real corpus — phases 3-4.
- Enforcement / CI gate — phase 5.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/scripts/frontmatter-version.{ts,mjs}` | Create | The deterministic compute/insert/verify engine |
| `.opencode/skills/sk-doc/scripts/__fixtures__/*` | Create | Frontmatter fixtures + tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Engine computes the correct version per the phase-1 standard and inserts idempotently without YAML corruption; dry-run emits a manifest; `--verify` confirms | Unit tests pass; dry-run on a sample skill yields expected versions (e.g. a `sk-code` reference → `3.5.0.5`); a re-run is a no-op |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The numstat gate discards the historical rename + bulk-sweep inflation | A fixture with rename history yields the gated (not raw) edit count |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All unit tests pass and the dry-run manifest matches hand-computed versions on the sampled skills.
- **SC-002**: Running `--apply` then re-running is a byte-level no-op (idempotent).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `--follow` rename inaccuracy | Med — wrong edit counts | Trace path with `--follow` but gate every commit on per-file `numstat > 0` |
| Risk | YAML reflow corrupting `trigger_phrases` | High | Line-wise edit only; never re-serialize; `--verify` structural check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Engine home is `sk-doc/scripts/`, modeled on `system-spec-kit/scripts/spec-folder/nested-changelog.ts`.
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
