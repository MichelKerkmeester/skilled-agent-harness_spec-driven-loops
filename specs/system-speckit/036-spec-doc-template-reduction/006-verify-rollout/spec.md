---
title: "Feature Specification: Phase 6: verify-rollout"
description: "Final verification and rollout for the template-reduction packet: whole-suite golden snapshots, a before/after deriveStatus fleet comparison, dist rebuild, strict validation across representative levels, and a no-stray-files sweep before any completion claim."
trigger_phrases:
  - "verify rollout"
  - "fleet validation"
  - "golden snapshot suite"
  - "regression baseline"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction/006-verify-rollout"
    last_updated_at: "2026-08-26T07:15:00Z"
    last_updated_by: "design-author"
    recent_action: "Authored verify-rollout design"
    next_safe_action: "After 002-005 land, run the whole gate and the deriveStatus fleet delta"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-036-006-verify-rollout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "What is the authoritative final gate? (validate.sh --strict + golden snapshots + dist freshness)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: verify-rollout

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
| **Phase** | 6 of 6 |
| **Predecessor** | 005-comment-extraction |
| **Successor** | (final) |
| **Handoff Criteria** | Whole golden-snapshot suite green; deriveStatus fleet delta is zero; both dist trees fresh; `validate.sh --strict` clean on L1/L2/L3/L3+/legacy; no task-created residue. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6**, the authoritative close-out for the template-reduction packet. It runs only after phases 002-005 land, and it proves the whole packet did no fleet harm.

**Scope Boundary**: Verification, regression measurement, and rollout only — no new template changes.

**Dependencies**:
- All prior phases (merge, dedup, continuity, comments) landed.
- The regression-baseline discipline: capture real starting numbers, re-run the WHOLE gate, report the delta.

**Deliverables**:
- Whole-suite verification evidence + the deriveStatus before/after fleet delta.
- Rollout + changelog refresh.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each prior phase edits shipped, load-bearing templates and validators where a mis-sequenced change regresses the whole packet fleet. Without a single authoritative close-out that measures the fleet delta, a silent status flip or a rendered-byte regression could ship undetected.

### Purpose
Prove — with real command output — that the packet reduced bloat without changing any shipped packet's derived status or breaking any validator, then roll out.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the whole golden-snapshot suite (empty diff except intended re-baselines).
- A before/after deriveStatus comparison across a representative fleet of shipped L2+ packets.
- Both dist trees rebuilt; `validate.sh --strict` on fresh L1/L2/L3/L3+ scaffolds + a shipped legacy packet.
- No-stray-files sweep; rollout + changelog.

### Out of Scope
- Any new template or validator change (those belong to phases 002-005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| changelog/ (packet) | Modify | Rollout changelog entry for the packet |
| (evidence only) | Verify | Snapshot suite, deriveStatus delta, validate.sh output captured as evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Whole golden-snapshot suite green | **Given** the suite, all renders match (empty diff) except the intended, reviewed re-baselines |
| REQ-002 | Zero deriveStatus fleet delta | **Given** a before/after run over representative shipped L2+ packets, every derived status is identical |
| REQ-003 | Strict validation clean across levels | **Given** rebuilt dist trees, `validate.sh --strict` exits 0 on fresh L1/L2/L3/L3+ scaffolds and a shipped legacy packet |
| REQ-004 | No task-created residue | **Given** the scoped diff, no unrelated file changed and no stray output remains |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Rendered-byte reduction reported | **Given** before/after measurements, the packet reports the actual rendered-byte reduction achieved |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Golden-snapshot suite green; deriveStatus fleet delta zero; validate.sh --strict clean across levels.
- **SC-002**: Rendered-byte reduction measured and reported against the captured baseline.
- **SC-003**: Clean scoped diff, no residue; rollout changelog written.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Claiming completion on a stale dist | High — validate.sh exits 3 | Rebuild both dist trees; confirm dist-freshness before the final gate |
| Risk | Fleet comparison sampled too narrowly | Medium | Sample L1/L2/L3/L3+ and at least one shipped legacy packet |
| Dependency | Phases 002-005 landed | Blocks this phase | Do not start close-out until all prior phases are green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which shipped packets form the representative fleet sample for the deriveStatus delta? (Pick at close-out time to cover all levels + legacy.)
<!-- /ANCHOR:questions -->

---
