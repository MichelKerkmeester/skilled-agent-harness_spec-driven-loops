---
title: "Feature Specification: Spec-tree structural cleanup"
description: "Resolve duplicate sibling spec numbers and move heavy docs out of phase-parent roots into 001 phases, renumbering existing phases up, so every phase-parent root holds only a lean spec plus its two JSONs."
trigger_phrases:
  - "spec tree structural cleanup"
  - "duplicate sibling spec numbers"
  - "phase parent purity restructure"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/141-spec-tree-structural-cleanup"
    last_updated_at: "2026-06-08T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Restructured 4 phase parents + 2 duplicate renames; B2 left as-is"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000141"
      session_id: "spec-141-spec-tree-structural-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Renumber convention: new 001 from root docs, shift existing phases up by one"
      - "Scope: active specs only; z_archive left under the tolerant policy"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Spec-tree structural cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A deterministic audit of the 1,751 active spec folders under `.opencode/specs/` found two structural violations. Two sibling sets shared a 3-digit prefix (two `016-*` packets, two `029-*` packets), which breaks ordering and resume pointers. Seven phase-parent folders carried heavy docs (`plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`) at the root alongside their phase children, violating phase-parent purity.

### Purpose
Resolve the duplicate numbers and bring every confirmed phase parent to purity: the root holds only a lean phase-parent spec plus `description.json` and `graph-metadata.json`, with the former root work relocated into a `001` phase and the existing phases shifted up by one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The two active duplicate-number renames (Rule A).
- The phase-parent restructures for the confirmed conformant parents (Rule B).
- Coordinated metadata refresh: each packet's identity, the parent `children_ids` manifest, and per-folder `description.json`.

### Out of Scope
- The `z_archive` violations (12 duplicate, 17 phase-parent) - left under the documented tolerant/legacy policy.
- The two decision-record-only parents (`004-code-index-stack`, `004-semantic-trigger-fallback`) - the root `decision-record.md` is a packet-wide cross-cutting doc, not misfiled phase work.
- `012-comprehensive-deep-review-audit` - its "phases" are non-conformant review-slice workspaces, so a clean restructure would require fabricating spec packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../001-local-embeddings-foundation/029-post-027-findings-remediation` | Rename | -> `030-post-027-findings-remediation` (Rule A) |
| `.../007-mcp-daemon-reliability/016-cross-session-kill-scoping` | Rename | -> `029-cross-session-kill-scoping` (Rule A) |
| `.../007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn` | Restructure | Phase parent: new 001, shift child to 002 (Rule B) |
| `.../003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook` | Restructure | New 001 + shift; fresh leaf spec (Rule B) |
| `.../004-code-graph/011-source-bug-and-misalignment-audit` | Restructure | New 001 + shift 3 phases (Rule B) |
| `.../004-code-graph/008-real-world-usefulness-test-planning` | Restructure | New 001 + shift 7 phases (Rule B) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No duplicate sibling numbers among active specs | A re-run of the audit reports zero active Rule-A violations |
| REQ-002 | Restructured phase-parent roots hold only spec + JSONs | Each restructured root lists only `spec.md`, `description.json`, `graph-metadata.json` plus phase dirs |
| REQ-003 | Each restructured parent validates --strict clean | `validate.sh --strict` returns 0 errors on the parent |
| REQ-004 | Identity stays consistent after each move | `packet_pointer`, `spec_folder`/`specFolder`, and parent `children_ids` resolve to the new paths |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Shifted phases validate --strict clean | Every shifted phase returns 0 errors, 0 warnings |
| REQ-006 | New 001 phases are conformant leaf packets | Each new 001 has the level-appropriate doc set and validates clean |
| REQ-007 | Non-conformant packets are documented, not fabricated | `012` is recorded as left-as-is with rationale rather than force-restructured |
| REQ-008 | No foreign files swept into commits | Each commit's stat shows only that packet's subtree |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Two active duplicate-number sets resolved; the audit re-run is clean of active Rule-A violations.
- **SC-002**: Four conformant phase parents restructured to purity, each parent and all its phases validating `--strict` clean.
- **SC-003**: The non-conformant review-campaign parent and the cross-cutting decision-record parents are documented as deliberate non-changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reference drift after a rename | Graph + memory point at dead paths | Set identity from the new location and rebuild the parent manifest per move |
| Risk | Concurrent sessions share the git index | A commit sweeps in foreign staged files | Scoped `git commit --only -- <subtree>` and per-commit stat verification |
| Risk | Heterogeneous old packets carry pre-existing debt | A uniform recipe leaves errors | Detect phase-parent-style roots and author a fresh leaf spec; revert packets that need fabrication |
| Dependency | `generate-description.js` + backfill | Per-folder metadata regen | Run per moved folder; surgically patch parent `children_ids` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The audit scans all active spec folders in a single deterministic pass.
- **NFR-P02**: Each restructure touches only its own packet subtree.

### Security
- **NFR-S01**: No secrets are introduced; only spec-folder structure and metadata change.
- **NFR-S02**: Renames signal only paths recorded in the affected packet.

### Reliability
- **NFR-R01**: Every move is followed by a `--strict` validation before commit.
- **NFR-R02**: A packet that cannot reach clean without fabrication is reverted to HEAD rather than committed half-done.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: A parent with no conformant phase children is not treated as a phase parent.
- Maximum length: Parents with many phases (9, 7) shift in reverse order to avoid collisions.
- Invalid format: Review-slice folders lacking `plan/tasks/impl` are not forced into conformant packets.

### Error Scenarios
- External service failure: Metadata regen degrades to a surgical `children_ids` patch.
- Network timeout: Not applicable; the work is local filesystem and git.
- Concurrent access: Scoped commits keep another session's staged changelog work out of these commits.

### State Transitions
- Partial completion: A half-restructured packet is reverted to HEAD and the leftover dirs removed.
- Session expiry: Each restructure is committed independently so progress is durable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~6 packets, dozens of folder renames, metadata coordination |
| Risk | 17/25 | Reference drift, shared git index, pre-existing debt |
| Research | 12/20 | Audit + per-packet conformance inspection |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the `012` review-campaign parent eventually be re-homed into a review-artifact layout rather than the standard phase-parent shape?
- Should the `z_archive` tolerant policy ever be tightened, or do archived packets stay grandfathered indefinitely?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
