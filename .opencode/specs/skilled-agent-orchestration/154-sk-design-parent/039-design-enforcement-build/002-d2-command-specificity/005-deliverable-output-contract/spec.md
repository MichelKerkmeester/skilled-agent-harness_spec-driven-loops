---
title: "Feature Specification: D2-R5 — Per-command deliverable output contract for /design:*"
description: "The /design:* wrappers declare only a STATUS=OK|FAIL tail, leaving each deliverable's name, kind, required fields, and file outputs undefined and unenforced."
trigger_phrases:
  - "d2-r5 output contract"
  - "design command deliverable contract"
  - "outputContract emit deliverable spec"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/005-deliverable-output-contract"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgrade spec to Level 2; record outputContract reconciliation and editorial-finalize note"
    next_safe_action: "Run D2-R6 sibling-discriminator phase for the /design:* command surface"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r5-deliverable-output-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D2-R5 — Per-command deliverable output contract for /design:*

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each `/design:*` wrapper declared only a `STATUS=OK|FAIL` tail (evidence: `commands/design/audit.md:26`), so the concrete deliverable each command produces had no named shape. Its artifact name, kind, required fields, and file outputs were undefined, leaving callers and the surface checker with nothing to enforce beyond a bare status string.

### Purpose
Make the deliverable each `/design:*` command emits a named, machine-enforced contract in the `command-metadata.json` SSOT, mirrored into each wrapper as an Emit Deliverable section, and reconciled against the existing `proofFields` and `toolPolicy` lanes by `design-command-surface-check.mjs`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `outputContract{primaryArtifactName, artifactKind, requiredFields, fileOutputs}` to all five `command-metadata.json` records
- Append an `Emit Deliverable` body section to each of the five wrappers, naming the `primaryArtifactName`
- Extend `design-command-surface-check.mjs` with contract presence, sub-shape validation, a generic-artifact-name ban, the `artifactKind` enum, and the `requiredFields == proofFields` / `fileOutputs ↔ mutatesWorkspace` reconciliations plus an Emit-Deliverable body check

### Out of Scope
- Wrapper frontmatter (`allowed-tools`, `argument-hint`) — owned by D2-R1/R2 and held byte-stable
- Mode prose and routing logic in the `sk-design` skill modes
- Any taste or design-quality judgment — this is a deterministic command-surface gate only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Add `outputContract` block to all five records |
| `.opencode/commands/design/audit.md` | Modify | Append `Emit Deliverable` naming "Design Quality Audit Report" |
| `.opencode/commands/design/foundations.md` | Modify | Append `Emit Deliverable` naming "Visual System Foundations Plan" |
| `.opencode/commands/design/interface.md` | Modify | Append `Emit Deliverable` naming "Interface Direction Spec" |
| `.opencode/commands/design/md-generator.md` | Modify | Append `Emit Deliverable` naming "Style Reference DESIGN.md" + `<output>/DESIGN.md` |
| `.opencode/commands/design/motion.md` | Modify | Append `Emit Deliverable` naming "Motion Design Spec" |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Additive contract validation, ban, enum, reconciliation, body check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Contract present per command | All five records carry `outputContract` with the four sub-fields; checker requires it |
| REQ-002 | Specific artifact name | Each `primaryArtifactName` names a concrete deliverable; generic names (output, result, ...) are rejected |
| REQ-003 | Lane reconciliation holds | `requiredFields == proofFields` per record; `fileOutputs` non-empty iff `toolPolicy.mutatesWorkspace` |
| REQ-004 | Surface check passes | `design-command-surface-check.mjs` returns STATUS=PASS, invalid=0, drift=0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Wrapper section mirrors metadata | Each wrapper's Emit Deliverable section names its `primaryArtifactName`; body-drift check passes |
| REQ-006 | No frontmatter regression | D2-R1/R2 `allowed-tools` + `argument-hint` parity preserved on all five wrappers |
| REQ-007 | Evergreen artifacts | No spec/packet/phase ID or spec path introduced into any of the seven output files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every `/design:*` command produces a named, enforced deliverable rather than a bare status tail; the checker bites when the contract is missing, generic, or unreconciled
- **SC-002**: `design-command-surface-check.mjs` reports STATUS=PASS, invalid=0, drift=0 with the existing frontmatter parity intact; `node --check` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | D2-R3 (command-metadata SSOT + checker) | Landed | `command-metadata.json` and the checker are the surfaces this phase extends |
| Dependency | D2-R1/R2 (frontmatter parity) | Landed | `allowed-tools` + `argument-hint` are read-only here and verified byte-stable |
| Risk | Body-drift check too brittle | Low | The Emit-Deliverable check matches only the heading + `primaryArtifactName`, not prose; reversible per file |
| Risk | `requiredFields` drifts from `proofFields` | Low | Reconciliation gate fails the build when they diverge |

### requiredFields == proofFields reconciliation

`requiredFields` mirrors each record's existing `proofFields` by design, so the deliverable contract and the proof obligation cannot diverge. The checker enforces `sameValue(proofFields, requiredFields)` per record, and `fileOutputs` is reconciled to `toolPolicy.mutatesWorkspace`: empty for the four read-and-guide modes, `["<output>/DESIGN.md"]` for the mutating `md-generator`. A non-mutating command carrying a non-empty `fileOutputs` is rejected with `outputContract.fileOutputs must be empty when toolPolicy.mutatesWorkspace is false`.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: Only the `mutatesWorkspace: true` command may declare `fileOutputs`; a read-only mode that claims a file output is rejected, keeping the deliverable lane aligned with the tool-policy lane

### Maintainability
- **NFR-M01**: The wrapper Emit Deliverable section is a projection of the SSOT `outputContract`; the body-drift check keeps the projection honest without authoring prose in the wrapper

### Reliability
- **NFR-R01**: The change is additive — every prior frontmatter parity and surface-drift check still passes (drift=0), so the contract layers on without regressing the existing gate
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A record missing `outputContract`: checker reports STATUS=INVALID at the metadata stage
- A `primaryArtifactName` composed solely of generic words: rejected by the ban set
- An `artifactKind` outside `report | plan | spec | reference-doc`: rejected by the enum

### Error Scenarios
- A non-mutating command with non-empty `fileOutputs`: STATUS=INVALID, invalid=1 (synthetic-break proof)
- A wrapper missing its Emit Deliverable section or not naming its artifact: `drift>0` on the `emit-deliverable` field

### State Transitions
- Contract added to metadata but wrapper section absent: the body-drift check flags the wrapper until the section mirrors the SSOT
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Seven files: metadata SSOT, five wrappers, one checker; no mode logic touched |
| Risk | 6/25 | Additive validation; reversible per file; frontmatter held byte-stable |
| Research | 5/20 | Contract shape sourced from existing `proofFields` + `toolPolicy` in the SSOT |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The `primaryArtifactName` and `artifactKind` values are deliberately editorial-finalizable: the checker enforces non-generic, in-enum, reconciled values, but the exact wording (e.g. "Interface Direction Spec") can be tuned later without changing the gate. No blocker for this phase.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification addendum (NFR, edge cases, complexity)
- Per-command outputContract + Emit Deliverable section + additive surface-check gate
- requiredFields == proofFields and fileOutputs <-> mutatesWorkspace reconciliation
-->
