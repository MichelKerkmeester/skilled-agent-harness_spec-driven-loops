---
title: "Feature Specification: Phase 5: comment-extraction"
description: "Instructional HTML comments (SELF-CHECK, voice guides, footer size notes) are not stripped by the renderer and leak into rendered bytes — measured 15.5% of packet bytes (implementation-summary 43.6%) with zero code consumers. Move them out-of-band to sidecar guidance and add per-doc byte budgets."
trigger_phrases:
  - "comment extraction"
  - "instructional comment leakage"
  - "sidecar guidance"
  - "byte budget"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "036-spec-doc-template-reduction/005-comment-extraction"
    last_updated_at: "2026-08-26T07:10:00Z"
    last_updated_by: "design-author"
    recent_action: "Authored comment-extraction design from 001-analysis research (R2 + R6)"
    next_safe_action: "Move instructional comments to sidecars; add byte-budget snapshot assertions"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/"
      - ".opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-036-005-comment-extraction"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact rendered-byte totals should be recomputed with the real renderer at change time"
    answered_questions:
      - "Are the instructional comments consumed by any code? (No — grep of SELF-CHECK/FAILURE-MODES returns nothing)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: comment-extraction

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-26 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-continuity-single-source |
| **Successor** | 006-verify-rollout |
| **Handoff Criteria** | Instructional comments relocated to sidecars; rendered packet bytes measurably reduced; per-doc byte budgets enforced as additive snapshot assertions; renderer untouched. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5**, the cross-cutting rendered-byte reduction that packet 033 never touched. Grounded in 001-analysis research R2 (comment relocation) and R6 (byte budgets), which the research backs with small-model evidence: instruction density degrades following, context length alone hurts, and mid-doc prose lands in the lost-in-the-middle attention trough.

**Scope Boundary**: Instructional HTML comments (SELF-CHECK, FAILURE MODES, voice guides, footer size notes) and additive byte-budget test assertions. The renderer is NOT changed — sidecars achieve zero rendered bytes without touching the render path.

**Dependencies**:
- The golden-snapshot harness (a reviewed re-baseline captures the reduced bytes).
- `SPECKIT_LEVEL` / `SPECKIT_TEMPLATE_SOURCE` markers must be preserved — they are consumed by detectLevel and the snapshot test (NOT leakage).

**Deliverables**:
- Instructional comments moved to sidecar guidance files.
- Per-doc rendered-byte budgets as additive snapshot assertions.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The inline-gate renderer strips only IF gates, not plain HTML comments, so SELF-CHECK blocks, per-field voice guides, and footer size notes survive into every scaffolded doc's bytes — measured at 15.5% of packet bytes (implementation-summary 43.6%). No code reads them. They tax every scaffolded doc and every AI read, with no offsetting consumer.

### Purpose
Move that guidance out-of-band into sidecar files so scaffolded docs carry only load-bearing content, and lock in the reduction with per-doc byte budgets.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Relocate instructional HTML comments from all authoring templates into sidecar guidance files.
- Add per-doc rendered-byte budget assertions using measured baselines: Level 1 spec.md at 4,280 B, Level 1 implementation-summary.md at 3,365 B, and Level 2 spec.md at 6,627 B, with targets no higher than 90% of each baseline, or integer upper limits of 3,852 B, 3,028 B, and 5,964 B.
- A reviewed golden-snapshot re-baseline capturing the reduced bytes.

### Out of Scope
- Any renderer change — the sidecar approach keeps the render path untouched.
- Removing `SPECKIT_LEVEL` / `SPECKIT_TEMPLATE_SOURCE` markers (they are load-bearing).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| templates/*.md.tmpl | Modify | Strip instructional comments, keeping only markers |
| templates/guidance/ | Create | Sidecar guidance files holding the relocated instructions |
| scripts/tests/scaffold-golden-snapshots.vitest.ts | Modify | Additive per-doc byte-budget assertions |
| scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap | Modify | Reviewed re-baseline for reduced bytes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Instructional comments removed from rendered output | **Given** a fresh scaffold of each level, no SELF-CHECK / FAILURE-MODES / voice-guide comment appears in the rendered bytes |
| REQ-002 | Markers preserved | **Given** detectLevel and the snapshot test, `SPECKIT_LEVEL` and `SPECKIT_TEMPLATE_SOURCE` still resolve and pass |
| REQ-003 | Per-doc byte budgets enforced against measured baselines | **Given** the snapshot suite, each rendered doc is asserted at no more than 90% of its measured baseline: 3,852 B for Level 1 spec.md, 3,028 B for Level 1 implementation-summary.md, and 5,964 B for Level 2 spec.md; a regression fails the test |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Guidance remains discoverable to authors | **Given** the sidecar files, the authoring guidance is linked from the template guide so authors still find it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero instructional-comment bytes in rendered scaffolds; guidance lives in sidecars.
- **SC-002**: Per-doc byte budgets assert-enforced; the reduction is measured with the real renderer.
- **SC-003**: Renderer unchanged; markers preserved; golden snapshots re-baselined by review.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing a marker mistaken for a comment | High — detectLevel/snapshot break | Preserve `SPECKIT_LEVEL` / `SPECKIT_TEMPLATE_SOURCE`; only strip SELF-CHECK/voice/footer |
| Risk | Byte budgets set too tight | Low-Medium | Compare real renderer output with the measured baselines before ratifying the 10% reduction target |
| Dependency | Golden snapshots | Reviewed re-baseline required | Diff review is the gate; only intended byte reductions may appear |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What reduction does the real renderer achieve against the measured baselines, and do the renders meet the 10% target?
<!-- /ANCHOR:questions -->

---
