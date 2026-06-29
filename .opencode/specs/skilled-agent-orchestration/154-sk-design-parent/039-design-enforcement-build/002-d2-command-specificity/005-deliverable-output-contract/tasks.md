---
title: "Tasks: Per-command deliverable output contract for /design:*"
description: "Add outputContract to command-metadata.json, an Emit Deliverable section to each wrapper, and extend the surface-check; verification tasks keep drift=0."
trigger_phrases:
  - "deliverable output contract tasks"
  - "emit deliverable section tasks"
  - "outputContract build tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/005-deliverable-output-contract"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark all build and verification tasks complete with one-line evidence"
    next_safe_action: "Run D2-R6 sibling-discriminator phase for the /design:* command surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
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
# Tasks: Per-command deliverable output contract for /design:*

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Read the five wrappers, metadata, checker, and registry (`.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md`, `.opencode/skills/sk-design/command-metadata.json`, `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`, `.opencode/skills/sk-design/mode-registry.json`) [10m] — all read before editing.
- [x] T002 Capture baseline surface-check, record invalid=0 drift=0 (`node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [5m] — baseline captured.
- [x] T003 [P] Extract `proofFields` per command to drive `requiredFields` reconciliation (`.opencode/skills/sk-design/command-metadata.json`) [10m] — `requiredFields` mirror each `proofFields`.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Metadata SSOT
- [x] T004 Add `outputContract{primaryArtifactName,artifactKind,requiredFields,fileOutputs}` to all five records, reconciling `requiredFields == proofFields` and `fileOutputs ↔ toolPolicy.mutatesWorkspace` per the recommended table (`.opencode/skills/sk-design/command-metadata.json`) [30m] — five blocks; reconciliations hold.

### Wrapper Emit Deliverable sections
- [x] T005 [P] Add `## 3. EMIT DELIVERABLE` naming "Design Quality Audit Report" + required fields (`.opencode/commands/design/audit.md`) [10m] — `audit.md:30,32`.
- [x] T006 [P] Add `## 3. EMIT DELIVERABLE` naming "Visual System Foundations Plan" + required fields (`.opencode/commands/design/foundations.md`) [10m] — section present, artifact named.
- [x] T007 [P] Add `## 3. EMIT DELIVERABLE` naming "Interface Direction Spec" + required fields (`.opencode/commands/design/interface.md`) [10m] — section present, artifact named.
- [x] T008 [P] Add `## 3. EMIT DELIVERABLE` naming "Style Reference DESIGN.md" + required fields + `<output>/DESIGN.md` file output (`.opencode/commands/design/md-generator.md`) [10m] — `md-generator.md:30,32,40`.
- [x] T009 [P] Add `## 3. EMIT DELIVERABLE` naming "Motion Design Spec" + required fields (`.opencode/commands/design/motion.md`) [10m] — section present, artifact named.

### Checker extension
- [x] T010 Add `"outputContract"` to `REQUIRED_FIELDS` + sub-shape validation (primaryArtifactName/artifactKind non-empty strings; requiredFields non-empty string array; fileOutputs string array) (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [25m] — required + sub-shape validated.
- [x] T011 Add `GENERIC_ARTIFACT_NAMES` ban + `artifactKind` enum (`report|plan|spec|reference-doc`); fail on generic `primaryArtifactName` (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [15m] — ban set + enum enforced.
- [x] T012 Add reconciliation: `requiredFields == proofFields` and `fileOutputs` non-empty iff `toolPolicy.mutatesWorkspace` (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [20m] — both reconciliations enforced.
- [x] T013 Extend `collectSurfaceDrift` with an `emit-deliverable` body check: each wrapper contains the section heading and names its `primaryArtifactName` (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [20m] — `emit-deliverable` drift field added.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Automated checks
- [x] T014 `node --check .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` exits 0 [5m] — exit 0.
- [x] T015 Run surface-check → STATUS=PASS, invalid=0, drift=0 (`node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [5m] — STATUS=PASS invalid=0 drift=0.

### Negative controls (scratch only)
- [x] T016 Flip one `primaryArtifactName` to "output" → expect STATUS=INVALID; revert [10m] — synthetic break flips to INVALID; reverted.
- [x] T017 Remove one wrapper Emit Deliverable section → expect drift>0; revert [10m] — covered by the `emit-deliverable` body-drift field; reverted.

### Evergreen + sync
- [x] T018 Grep the seven output files for spec/packet/phase IDs and `specs/` paths → expect no hits (`.opencode/commands/design/*.md`, `.opencode/skills/sk-design/command-metadata.json`, `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [10m] — no hits.
- [x] T019 Sync spec docs / cross-refs; clean scratch [10m] — spec/plan/tasks/checklist/impl-summary synced; scratch clean.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T019 complete.
- [x] No `[B]` blocked tasks remaining — none.
- [x] `node --check` passes on the checker — exit 0.
- [x] Surface-check: STATUS=PASS, invalid=0, drift=0 — confirmed.
- [x] Negative controls proved the gate fails, then reverted — synthetic break INVALID, reverted to invalid=0 drift=0.
- [x] Evergreen grep clean; checklist.md fully verified — grep clean; checklist all [x].

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort per task, explicit verification tasks)
- Additive build; verification holds drift=0
-->
