---
title: "Feature Specification: Checklist Full Retirement"
description: "Retire the standalone verification checklist the tasks/checklist merge left behind: its producer, its contract entries, its read-paths, its template, and the 2,270 packet copies. Includes the fingerprint-generation change that keeps the removal from forcing a repo-wide repair on everyone who pulls it."
trigger_phrases:
  - "checklist full retirement"
  - "checklist retirement"
  - "retire standalone checklist"
  - "source fingerprint docset"
  - "verification lives in tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/010-checklist-full-retirement"
    last_updated_at: "2026-08-30T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Retired the document across producers, contract, read-paths, templates and packets"
    next_safe_action: "Validate and close out"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/spec-kit-docs.json"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-036-010-checklist-full-retirement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Operator chose full retirement including read-paths, and deletion without migrating the 45,758 recorded items"
      - "A digest is only comparable within the document-set generation that produced it"
---

# Feature Specification: Checklist Full Retirement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---

## EXECUTIVE SUMMARY

The tasks-and-checklist merge moved verification into the unified tasks document and recorded `Delete/retire` against the standalone template. The template was never deleted, and `upgrade-level.sh` kept rendering the document on every Level 1 to Level 2 upgrade — so a deprecated document was still being produced for new work, two packets later.

This retires it completely: the producer, every contract entry, every read-path, the template, its three worked examples, and the 2,270 packet copies tracked in this repository.

**Key Decisions**: the operator chose full retirement including read-paths, and deletion without migrating the 45,758 recorded items. Both were confirmed against the measured numbers.

**Critical Dependencies**: none. The unified tasks document already carries the verification and testing sections at Level 2 and above.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction |
| **Predecessor** | 009-template-folder-restructure |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The merge that unified tasks and checklist recorded `Delete/retire` against `templates/addons/checklist.md.tmpl` and then kept it, along with its three worked examples. The document stayed listed as an optional add-on at Levels 2, 3 and 3+, stayed mapped in the document-to-template resolver, and — the part that matters — stayed wired into `upgrade-level.sh`, which rendered a fresh copy on every Level 1 to Level 2 upgrade. A document declared retired was still being generated for new work.

Underneath that sat a quieter defect. The evidence rule held only task-shaped ids to its standard inside the tasks document; verification-shaped ids were checked only when they arrived from the standalone document. The merge had already moved those items into the tasks document, so retiring the file would have completed a silent exemption: every verification item in every packet, no longer checked for evidence, with the rule still reporting success.

### Purpose

One home for verification, with nothing left that produces, requires, reads or renders a second one — and no packet in any repository forced into a repair to get there.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The producer: the Level 1 to Level 2 upgrade path stops creating the document.
- The contract: document entry, version, section gates and optional-add-on listings at all three levels.
- The read-paths: 13 validation rules, 9 MCP server modules, 13 scripts.
- The artifacts: the template, its three worked examples, and 2,270 tracked packet copies.
- The test surface: fixtures, the cases that assert the retired requirement, and the conformance guard.
- The evidence rule's id filter, which the retirement would otherwise have turned into a blanket exemption.
- The fingerprint generation marker, without which every packet in every repository fails until repaired.

### Out of Scope
- The 397 copies behind the four symlinked repositories. They are other projects' files, outside this repository's git, and are never written through a symlink.
- The memory taxonomy. `checklist` there is a document-type label on already-indexed rows; removing it would mis-type history rather than retire a document.
- Checklist-as-pattern: the anchor shape, the completion evaluator over merged content, and the pre-task section name are not this document.
- The four pre-existing golden-snapshot failures, which reproduce on clean HEAD and are unrelated to this work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/spec/upgrade-level.sh` | Modify | Stops producing the document; the level path now creates acceptance criteria only |
| `templates/spec-kit-docs.json` | Modify | Document, version, section gates and optional listings removed |
| `scripts/utils/template-structure.js` | Modify | Document-to-template mapping removed |
| `scripts/rules/*.sh` | Modify | 13 rules; read-paths removed |
| `mcp-server/lib/**` | Modify | 9 modules; read-paths removed, fingerprint generation added |
| `scripts/**` | Modify | 13 scripts; read-paths removed |
| `templates/addons/checklist.md.tmpl` | Delete | The retired template |
| `templates/examples/level-{2,3,3+}/checklist.md` | Delete | Its worked examples |
| `specs/**/checklist.md` | Delete | 2,270 tracked packet copies |
| `scripts/rules/check-evidence.sh` | Modify | Holds both id shapes to the evidence standard |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No surface produces the document: not the scaffolder, not the upgrade path, not the contract |
| REQ-002 | A packet in any repository validates after pulling this without running a repair |
| REQ-003 | Verification items keep their evidence standard; the retirement grants no exemption |
| REQ-004 | Nothing is written through the symlinked repositories |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Every read-path is removed from rules, server modules and scripts |
| REQ-006 | The fixture suite reports no more failures than it did before this change |
| REQ-007 | A conformance test fails if any bucket starts carrying the document again |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An upgrade run creates acceptance criteria and no checklist.
- **SC-002**: A sample of untouched packets validates identically to its pre-change baseline.
- **SC-003**: The fixture suite's failure count does not rise.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Every stored fingerprint stops matching at once | High — a repo-wide repair before anything validates | The digest records its document-set generation; older ones are skipped and refresh naturally |
| Risk | The evidence rule silently exempts verification items | High — a gate that reports success while checking nothing | Both id shapes are now held to the standard, pinned by three fixtures |
| Risk | 45,758 recorded items stop being read | Accepted by the operator against the measured number | The records remain in git history; a revert restores them |
| Risk | Deleting through a symlink mutates another repository | High | Only git-tracked in-repo paths are deleted; verified zero symlinked paths staged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One fewer document read per packet per validation run.

### Security
- **NFR-S01**: Deletions are confined to git-tracked paths inside this repository.

### Reliability
- **NFR-R01**: A packet carrying a stale digest reports no drift and refreshes on its next save.
- **NFR-R02**: Real content drift is still reported; the generation check narrows comparison, not detection.

---

## 8. EDGE CASES

### Data Boundaries
- A packet with no verification section: the priority and evidence rules skip rather than fail.
- A packet still holding a copy from an external repository: read by nothing, blocks nothing.

### Error Scenarios
- A fingerprint from the previous generation: skipped, not reported as drift.
- A fingerprint from the current generation over changed docs: reported as drift, unchanged.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | 153 source files plus 2,270 deletions |
| Risk | 18/25 | Breaking: Y — changes the document contract for every packet in every repository |
| Research | 8/20 | The read-path inventory was measured, not estimated |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 9/15 | Four external repositories consume this toolchain |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Fleet-wide fingerprint invalidation | H | H (certain without the fix) | Generation marker; verified against a pre-change baseline |
| R-002 | Silent evidence exemption | H | H (certain without the fix) | Id filter widened; three fixtures pin it |
| R-003 | Evidence backlog surfaces as new warnings | L | H | Advisory severity; blocks nothing |

---

## 11. USER STORIES

### US-001: Pulling the change (Priority: P0)

**As a** repository user, **I want** the retirement to land without a migration, **so that** my packets validate the moment I pull rather than after a repo-wide repair.

### US-002: Trusting the evidence gate (Priority: P0)

**As a** packet author, **I want** verification items held to the evidence standard, **so that** a green gate means the evidence is there.

---

## 12. OPEN QUESTIONS

- None. Scope and the no-migration decision were settled by the operator against measured numbers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Parent Spec**: See `../spec.md`

---
