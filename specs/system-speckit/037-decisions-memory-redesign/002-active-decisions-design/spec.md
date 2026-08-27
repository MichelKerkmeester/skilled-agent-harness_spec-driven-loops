---
title: "Feature Specification: Phase 2: active-decisions-design [template:level-1/spec.md]"
description: "Evaluated an always-loaded DECISIONS.md surface as the constitutional-memory replacement and DECIDED against it. Deprecate the constitutional DB layer and keep the 20 rule files as plain docs (their content already lives inlined in the root instruction files). No new always-loaded surface, no CLAUDE.md import, no Cursor rule."
trigger_phrases:
  - "active decisions decision"
  - "no replacement surface"
  - "constitutional layer deprecation"
  - "keep rules as docs"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "037-decisions-memory-redesign/002-active-decisions-design"
    last_updated_at: "2026-08-26T08:10:00Z"
    last_updated_by: "design-author"
    recent_action: "Reversed: DECISIONS.md surface dropped; keep the rules as plain docs"
    next_safe_action: "Proceed to 003 tier deprecation; there is no replacement surface to build"
    blockers: []
    key_files:
      - "CLAUDE.md"
      - "AGENTS.md"
      - ".opencode/skills/system-spec-kit/constitutional/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-037-002-active-decisions-design"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Build a new always-loaded DECISIONS.md surface? (No — owner reversed; keep rules as plain docs)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: active-decisions-design

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-26 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-analysis |
| **Successor** | 003-deprecation-mechanics |
| **Handoff Criteria** | The direction decision is recorded: no replacement surface is built; the constitutional layer is deprecated with rule content kept in the existing root docs. Phase 003 proceeds directly to retiring the DB tier. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2**. It originally designed an always-loaded `.opencode/DECISIONS.md` replacement surface. The owner reversed that mid-flight: **do not build a new surface.** This phase now records that decision so the packet stays honest and phase 003 knows there is no replacement to hand off to.

**Scope Boundary**: A recorded decision only. No runtime files change in this phase.

**Dependencies**:
- Confirmed research findings: the constitutional DB tier is decorative; `includeConstitutional` (not `alwaysSurface`) is the real lever; learned-triggers verified 0 rows.
- The rule content already lives inlined in `CLAUDE.md`/`AGENTS.md`/`BARTER.md`, which load every turn — so deprecating the tier loses no steering without any new surface.

**Deliverables**:
- The recorded decision: deprecate the layer, keep rules as plain docs, add nothing.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The constitutional DB tier is decorative: its rules are already inlined in the root instruction files, it surfaces only when the model chooses to call `memory_search`, and its cold-start injection is dead code. A first design proposed replacing it with an always-loaded `DECISIONS.md` surface, but that would introduce a `CLAUDE.md` `@`-import pattern not used here, a Cursor-side duplicate to keep in sync, and a file that decays if untended.

### Purpose
Deprecate the decorative tier and keep the rules as ordinary docs — the leanest path, adding no new surface — because the steering never came from the tier in the first place.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the decision: **no** new always-loaded decisions surface (`DECISIONS.md`), **no** `CLAUDE.md` import, **no** Cursor rule.
- Confirm the rules' durable content already lives in the root instruction files (so nothing is lost when the tier is retired).

### Out of Scope
- Building any new decisions surface, DB, or required spec-doc.
- Deprecating the `memory-system-spec-kit-only` rule (owner kept it — native-memory ban stays).
- The tier/plumbing removal itself (phase 003) and rule-content rehoming (phase 004).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| (none) | Decision only | This phase records a direction decision; no runtime file changes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The no-replacement decision is recorded | **Given** this packet, the decision to deprecate the layer without a new surface is documented and consistent across phases 003-006 |
| REQ-002 | No steering is lost by adding nothing | **Given** the rules already inlined in the root docs, retiring the tier changes no every-turn steering |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Downstream phases match the decision | **Given** phases 003/004/005, none reference a `DECISIONS.md` surface as a dependency |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The decision — deprecate the tier, keep rules as plain docs, build no new surface — is recorded and consistent packet-wide.
- **SC-002**: No `DECISIONS.md`, `@`-import, Cursor rule, new DB, or new required spec-doc is introduced anywhere in the packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Downstream phases still assume a replacement surface | Medium — inconsistent packet | Re-scope 005 (advisor) alongside this decision; 003/004 already surface-agnostic |
| Dependency | Rule content in the root docs | Low — steering stays | Verify content is inlined before phase 004 deletes/retargets the files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the `constitutional/` folder be deleted after the tier is retired, or kept as plain unindexed reference docs? (Decided in phase 004.)
<!-- /ANCHOR:questions -->

---
