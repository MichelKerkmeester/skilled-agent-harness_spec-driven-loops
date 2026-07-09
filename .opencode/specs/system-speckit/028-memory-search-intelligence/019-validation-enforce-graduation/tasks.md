---
title: "Tasks: Validation Advisory-to-Enforce Graduation — Status Cross-Doc, Metadata Disk-Path, Child Drift"
description: "Task Format: T### [P?] Description (file path) {deps: T###}"
trigger_phrases:
  - "validation enforce graduation tasks"
  - "status cross-doc enforce flip tasks"
  - "metadata disk consistency enforce flip tasks"
  - "child drift enforce flip tasks"
  - "dist presence freshness guard tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/019-validation-enforce-graduation"
    last_updated_at: "2026-07-09T23:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Drafted task breakdown from plan.md's five phases"
    next_safe_action: "Write checklist.md"
    blockers:
      - "017 (flag parsing trustworthiness) not yet landed — implementation cannot start until then"
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-status-cross-doc-consistency.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-metadata-disk-consistency.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-child-drift.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-019-validation-enforce-graduation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Validation Advisory-to-Enforce Graduation — Status Cross-Doc, Metadata Disk-Path, Child Drift

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 | T001-T004 | Precondition confirmed, census driver built |
| M2 | T005-T010 | Phase 1 flag flipped (status cross-doc) |
| M3 | T011-T017 | Phase 2 flag flipped (metadata disk-path) |
| M4 | T018-T021 | Phase 3 guard proven |
| M5 | T022-T032 | Phase 3 flag flipped, tree-wide verify clean |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Precondition gate and the shared census tooling every subsequent phase reuses. No flag flips yet.

- [ ] T001 [B] Confirm 017 (flag-parsing trustworthiness) has landed and its own `validate.sh --strict` passes (blocked until 017 lands)
- [ ] T002 [B] Confirm 015 (`validation-hardening-fixes`) has landed: `classify_status()`/`classifyStatus()` recognize `Implemented`/`Implementing`, and its own REQ-006 reconciliation on `006-presentation-layer-fixes`/`010-query-channel-calibration` is still clean {deps: T001}
- [ ] T003 [P] Write the parameterized census driver: sets a target `SPECKIT_*_ENFORCE` env var `true` transiently, loops `validate.sh --strict --json --no-recursive` across `.opencode/specs`, parses each folder's `results[]` for the target rule's `status`, tallies `warn` counts (new script, read-only)
- [ ] T004 [P] Unit-test the census driver against a small synthetic fixture tree with known mismatches, confirm its tally matches a hand-count
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

The three sequential graduations, least-risky-first: status cross-doc, then metadata disk-path (fresh census), then the child-drift dist-presence guard followed by its own flip.

### Status Cross-Doc Enforce (`SPECKIT_STATUS_CROSS_DOC_ENFORCE`)

- [ ] T005 Run the tree-wide advisory census for `STATUS_CROSS_DOC_CONSISTENCY` across `.opencode/specs` (census driver, `SPECKIT_STATUS_CROSS_DOC_ENFORCE=true` transient) {deps: T003, T004}
- [ ] T006 Reconcile every real mismatch: correct the stale `Status` field, or record an explicit intentional-difference note when the difference is deliberate {deps: T005}
- [ ] T007 Re-run the census, confirm zero (or record an individually-explained residual with evidence) {deps: T006}
- [ ] T008 Flip the resolved default in `capability-flags.ts` for `SPECKIT_STATUS_CROSS_DOC_ENFORCE`; update its doc-comment to record the graduation (`mcp_server/lib/config/capability-flags.ts`) {deps: T007}
- [ ] T009 Update `ENV_REFERENCE.md:168,470` to reflect the new enforcing default (`mcp_server/ENV_REFERENCE.md`) {deps: T008}
- [ ] T010 Spot-check `validate.sh --strict` on 2-3 representative folders, confirm the check now runs as a real comparison (not "not applicable" or silent advisory-pass); commit Phase 1 independently {deps: T009}

### Metadata Disk-Path Enforce (`SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE`)

- [ ] T011 Take a **fresh** mismatch census for `METADATA_DISK_PATH_CONSISTENCY` immediately before backfilling — explicitly do not reuse `008-metadata-rename-reconciliation`'s prior baseline {deps: T010}
- [ ] T012 Cross-reference the fresh census against the known post-008 folder re-nest campaign moves (`013→005/050`, `014→000/015`, `015→004/007`, `016→001/031`) to confirm those folders' drift is captured, not assumed already-fixed {deps: T011}
- [ ] T013 Reconcile every real mismatch via `generate-description.js`/`backfill-graph-metadata.js` — never hand-edit `description.json`/`graph-metadata.json` {deps: T012}
- [ ] T014 Re-run the census, confirm zero (or record an individually-explained residual, matching 008's own precedent for honest disclosure) {deps: T013}
- [ ] T015 Flip the resolved default in `capability-flags.ts` for `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE`; update its doc-comment {deps: T014}
- [ ] T016 Update `ENV_REFERENCE.md:167,469` to reflect the new enforcing default {deps: T015}
- [ ] T017 Spot-check a folder created after 008's original run, confirm correct classification; commit Phase 2 independently {deps: T016}

### Child-Drift Dist-Presence Guard, then Enforce (`SPECKIT_CHILD_DRIFT_ENFORCE`)

- [ ] T018 Add a named `is-phase-parent` entry to `dist-freshness.cjs`'s `system-spec-kit/scripts` package: `distEntries['is-phase-parent'] = 'dist/spec/is-phase-parent.js'` plus a matching `entrySourceCandidates['is-phase-parent']` pointing at `scripts/spec/is-phase-parent.ts` (`scripts/lib/dist-freshness.cjs`) {deps: T017}
- [ ] T019 Wire the guard into `check-graph-metadata-child-drift.sh` ahead of the existing scanner import (`:56-93`): when `SPECKIT_CHILD_DRIFT_ENFORCE=true` and the guard reports missing/stale, fail closed with a rebuild-command remediation message, reusing the `STALE_EXIT_CODE=69` convention (`scripts/rules/check-graph-metadata-child-drift.sh`) {deps: T018}
- [ ] T020 [P] Extend `scripts/tests/check-graph-metadata-child-drift.sh` with the guard's fixture matrix: missing dist, stale dist (source mtime newer), fresh dist, each crossed with enforce on/off {deps: T019}
- [ ] T021 Verify all fixture-matrix cases pass before proceeding to the census {deps: T020}
- [ ] T022 Run the tree-wide advisory census for `GRAPH_METADATA_CHILD_DRIFT` (census driver, `SPECKIT_CHILD_DRIFT_ENFORCE=true` transient) {deps: T021}
- [ ] T023 Reconcile every real `children_ids` drift via `backfill-graph-metadata.js` (union-only, never pruning) {deps: T022}
- [ ] T024 Re-run the census, confirm zero {deps: T023}
- [ ] T025 Flip the resolved default in `capability-flags.ts` for `SPECKIT_CHILD_DRIFT_ENFORCE`; update its doc-comment {deps: T024}
- [ ] T026 Add the currently-missing `SPECKIT_CHILD_DRIFT_ENFORCE` row to `ENV_REFERENCE.md` (summary table + full flag-reference table, matching the shape of the other two flags' rows) {deps: T025}
- [ ] T027 [P] Re-verify the guard's fail-closed behavior against a deliberately-broken fixture with the flag now truly enforcing (not just advisory-mode simulated) {deps: T026}
- [ ] T028 Commit Phase 3 independently {deps: T027}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T029 Run a full tree-wide `validate.sh --strict` sweep (or `strict-pass-freshness.ts`) across `.opencode/specs` with all three flags at their new enforcing defaults {deps: T028}
- [ ] T030 Confirm no net-new regression beyond the deliberately-reconciled mismatches; record before/after folder counts {deps: T029}
- [ ] T031 Update this packet's `implementation-summary.md` with before/after counts, evidence commands, and outcomes for all three phases {deps: T030}
- [ ] T032 Mark `checklist.md` items with evidence {deps: T031}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (T001/T002 unblock once 017/015 land)
- [ ] All milestones achieved
- [ ] Each flag flip committed independently
- [ ] Tree-wide `validate.sh --strict` sweep clean (Phase 3)
- [ ] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS
- Core + L2 + L3 detail
- Task dependencies explicit
- Milestone mapping
- Planning-only: no tasks marked complete
-->
