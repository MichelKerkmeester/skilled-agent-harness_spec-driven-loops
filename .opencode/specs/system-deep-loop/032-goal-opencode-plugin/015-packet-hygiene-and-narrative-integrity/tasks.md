---
title: "Tasks: Phase 15: packet-hygiene-and-narrative-integrity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "packet hygiene and narrative integrity tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/015-packet-hygiene-and-narrative-integrity"
    last_updated_at: "2026-07-03T11:59:55Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Completed packet hygiene, narrative integrity, and validation evidence capture"
    next_safe_action: "Track the out-of-scope dist-freshness cache defect in a future phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-015-packet-hygiene-20260703"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: packet-hygiene-and-narrative-integrity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Sub-phase: Validator Calibration + Test (VAL-1, VAL-2) — must land first so later sub-phases and phase 016's Level-2 docs validate green**

- [x] T001 [VAL-1] Reproduce the live `SECTION_COUNTS` miscalibration via `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict --verbose` against 011/012/013 and a fresh scaffold; confirm it is `min_scenarios` (literal `**Given**` count), not an H2/25 threshold (`.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh`) — Evidence: `validate.sh --strict --verbose` on 011/012/013 reported `Found 0 acceptance scenarios, expected at least 2 for Level 1`; H2/complexity checks passed, and temp scaffold validation reported `+ SECTION_COUNTS`.
- [x] T002 [VAL-1] Recalibrate `min_scenarios` (and `min_requirements` if the same reproduction shows it miscalibrated) in the Level-1/2/3 case statement to the shipped lean template's real baseline (`.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh`) — Evidence: `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh` Level 1/2/3/default `min_scenarios` floors changed to `0`; `min_requirements` unchanged.
- [x] T003 [VAL-1] Update the matching threshold test under `.opencode/skills/system-spec-kit/scripts/tests/` to the recalibrated minimums — Evidence: `.opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` updated; `bash .opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh -i -r SECTION_COUNTS` passed `113/113`, including `SECTION_COUNTS: 4/4 passed`.
- [x] T004 [VAL-1] Re-run `validate.sh --strict` against phases 010-014, a fresh scaffold, and `system-speckit/028` phases 011/012; confirm zero `SECTION_COUNTS` warnings with no document padded — Evidence: post-fix `validate.sh --strict` on 010/011/012/013/014, temp scaffold, and system-speckit/028 phases 011/012 all reported `+ SECTION_COUNTS`; remaining failures were unrelated continuity/generated-metadata gates.
- [x] T004a [VAL-2] Reproduce the live `ANCHORS_VALID` false-error via `validate.sh --strict` against `anobel.com/002-link-card-button-and-mobile-animation` and 032's own in-flight phase 016 Level-2 docs (`.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:75`) — Evidence: `validate.sh --strict --verbose` on 016 reported missing required anchors `nfr`, `edge-cases`, `complexity`, `phase-deps`, `effort`, and `enhanced-rollback`; anobel Level-2 run also failed `ANCHORS_VALID`.
- [x] T004b [VAL-2] Align `orchestrator.ts:75`'s `OPTIONAL_TEMPLATE_ANCHORS` with `template-structure.js`'s dynamically-derived Level-2 optional-anchor set (`nfr`/`edge-cases`/`complexity` in spec.md; `phase-deps`/`effort`/`enhanced-rollback` in plan.md) — single source of truth preferred over a second hardcoded list — Evidence: `git diff -- .opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` shows only the `OPTIONAL_TEMPLATE_ANCHORS` line changed to include those six Level-2 optional anchors.
- [x] T004c [VAL-2] Rebuild `.opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/orchestrator.js` (+ `.d.ts`/`.map`) and confirm the compiled output contains the aligned anchor set — Evidence: `npm run build` in `mcp_server` succeeded; grep found `OPTIONAL_TEMPLATE_ANCHORS` with all seven anchors in `dist/lib/validation/orchestrator.js:37`.
- [x] T004d [VAL-2] Add a regression test pinning that a template-conformant Level-2 packet passes `ANCHORS_VALID`; re-run `validate.sh --strict` against both reproduction cases, confirm zero false anchor errors — Evidence: `npx vitest run tests/validation-optional-anchors.vitest.ts` passed 1/1; phase 016 now reports `+ ANCHORS_VALID` and `Errors: 0`; anobel no longer reports the six optional-anchor false errors, but still has unrelated required-anchor/template-header errors in its read-only packet.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Sub-phase: Status / Metadata Reconciliation**

- [x] T005 [PKT-1] Fix `Status: Draft` -> `Complete` in `010-security-and-correctness-fixes/spec.md:43`, `011-command-surface-normalization/spec.md:43`, `013-design-fidelity-and-polish/spec.md:44` — Evidence: status rows changed in all three specs; scoped `backfill-graph-metadata.js` refreshed 010/011/013 with `failed: []`.
- [x] T006 [PKT-1] Add a `Status: Complete` row to `011-command-surface-normalization/implementation-summary.md` and `013-design-fidelity-and-polish/implementation-summary.md` (currently missing entirely) — Evidence: both metadata tables now include `| **Status** | Complete |`; scoped graph backfill refreshed 011/013 with `failed: []`.
- [x] T007 [PKT-2] Add a `Status` row to `014-goal-state-cleanup-and-archive/spec.md` (currently absent) — Evidence: `014-goal-state-cleanup-and-archive/spec.md` metadata now includes `| **Status** | Complete |`; scoped graph backfill refreshed 014 with `failed: []`.
- [x] T008 [PKT-4] Replace "N of M" phase-count labels with "Phase N" only in `007-sk-prompt-goal-enhancement/spec.md:51`, `008-system-spec-kit-integration/spec.md:57`, `010-security-and-correctness-fixes/spec.md:47`, `011-command-surface-normalization/spec.md:47`, `012-regression-test-backfill/spec.md:48`, `013-design-fidelity-and-polish/spec.md:48` — Evidence: all six metadata rows now use bare phase numbers; scoped graph backfill refreshed 007/008/010/011/012/013 with `failed: []`; metadata-row grep only finds out-of-scope phases 001-006.
- [x] T009 [PKT-4] Fix `013-design-fidelity-and-polish/spec.md:50`'s "Successor: None (final phase)" to name `014-goal-state-cleanup-and-archive` — Evidence: 013 metadata now has `| **Successor** | 014-goal-state-cleanup-and-archive |`; scoped graph backfill refreshed 013 with `failed: []`.
- [x] T010 [PKT-3] Remove template voice-guide comments (lines ~55-61, ~94-98, ~108-109) and generic `trigger_phrases` from `013-design-fidelity-and-polish/implementation-summary.md` — Evidence: removed generic frontmatter trigger block and template comments; grep for `Voice guide|impl summary core|trigger_phrases` in the file returned no matches; scoped graph backfill refreshed 013 with `failed: []`.
- [x] T011 [PKT-12] Fix the "Step 2" numbering skip (106->126) in `010-security-and-correctness-fixes/implementation-summary.md`'s Verification section — Evidence: headings now run `Step 1`, `Step 2`, `Step 3`; scoped graph backfill refreshed 010 with `failed: []`.
- [x] T012 [PKT-10] Align `../spec.md` phase-map row-9 wording ("Pending") with `../spec.md:47`'s "In Progress"; regenerate graph metadata after this and other fixes land (T028) — Evidence: parent phase-map row 9 now says `In Progress (separate session)`; parent graph backfill refreshed with `failed: []`.

**Sub-phase: Narrative Corrections**

- [x] T013 [PKT-5] Correct the false `opencode_goal.md` rename narrative in `011-command-surface-normalization/implementation-summary.md:54,128` to the git-verified lineage (`goal.md` -> `goal_opencode.md` -> `goal.md` -> `goal_opencode.md`, three renames, no `opencode_goal.md` intermediate) — Evidence: implementation summary now states the three-rename lineage and that `opencode_goal.md` was never committed; scoped graph backfill refreshed 011 with `failed: []`.
- [x] T014 [PKT-5] Correct the same false narrative in `011-command-surface-normalization/spec.md:75` (additional instance found beyond the dossier's originally cited locations) — Evidence: 011 spec problem statement now names `goal.md` -> `goal_opencode.md` -> `goal.md` -> `goal_opencode.md` and says `opencode_goal.md` was never committed; scoped graph backfill refreshed 011 with `failed: []`.
- [x] T015 [PKT-5] Correct the false narrative in `../timeline.md:30` and its §6 prose — Evidence: timeline summary and §6 now state `goal.md` -> `goal_opencode.md` -> `goal.md` -> `goal_opencode.md` and that `opencode_goal.md` was never committed; parent graph backfill refreshed with `failed: []`.
- [x] T016 [PKT-5] Correct the false narrative in `../before-vs-after.md:193` and drop its false "goal.md never actually shipped" claim; reconcile the "renamed twice" (`../before-vs-after.md:49`) vs "renamed three times" (`../before-vs-after.md:61` area) wobble to the verified count of three — Evidence: before/after now uses the three-rename committed lineage and says `opencode_goal.md` was never committed; parent graph backfill refreshed with `failed: []`.
- [x] T017 [PKT-6] Correct the "packet-wide" fingerprint overclaim to "phases 001-008" in `../spec.md:185`, `../changelog/changelog-032-root.md:53`, `../before-vs-after.md` §12, and `013-design-fidelity-and-polish/changelog/changelog-032-013-design-fidelity-and-polish.md:40` — Evidence: parent phase map, root changelog, before-vs-after §12, phase-013 spec, and phase-013 changelog now name phases 001-008; parent and 013 graph backfills refreshed with `failed: []`.
- [x] T018 [PKT-8] Record F-015's disposition in this phase's implementation-summary.md (not yet authored) or `../spec.md`: subsumed by the DR-001 compact-fallback remedy at `mk-goal.js:1568-1576` — Evidence: 015 implementation-summary Key Decisions records F-015 as subsumed by `mk-goal.js:1568-1576`; scoped graph backfill refreshed 015 with `failed: []`.
- [x] T019 [PKT-9] Record DR-013-P1-001's tracked-deferral note (deep-loop-runtime track) in `../timeline.md` or `../spec.md` — Evidence: parent timeline §7 records DR-013-P1-001 as deferred to the deep-loop-runtime track; parent graph backfill refreshed with `failed: []`.
- [x] T020 [PKT-11] Fix `009-speckit-command-goal-prompt-offer/handover.md:95`'s reference to non-existent `.opencode/commands/goal.md` -> `.opencode/commands/goal_opencode.md` — Evidence: cold-read order now ends with `.opencode/commands/goal_opencode.md`; scoped graph backfill refreshed 009-speckit with `failed: []`.

**Sub-phase: Fingerprints + Cross-Reference Repairs**

- [x] T021 [PKT-6] Recompute real `session_dedup.fingerprint` values for phases `009-speckit-command-goal-prompt-offer` through `014-goal-state-cleanup-and-archive` (spec/plan/tasks/implementation-summary where present), using the same direct-edit-and-hash mechanism phase 013 used for phases 001-008 — Evidence: normalized SHA-256 values computed with the validator's `normalizeForContinuityFingerprint` rule and written across 009-speckit/010/011/012/013/014 spec-doc frontmatter; scoped graph backfills refreshed all six folders with `failed: []`.
- [x] T022 [PKT-6] Refresh `013-design-fidelity-and-polish/implementation-summary.md`'s own `session_dedup.fingerprint` (confirmed stale: stored `sha256:9975b0019ad35530001603f71c243dfb170318a5c4e7008605985518ff141062`, live-recomputed `sha256:b572221b492bac26ee85666f5e8a013101fceffd203336a327da55e2136a5e3d` via `validate.sh --strict --verbose`) — Evidence: after T005-T017 edits, 013 implementation-summary fingerprint refreshed to `sha256:3f38a2d16b7d30c3fd190cfe30d3cbf63f61ec23217c3c92fbdf688e4e87ed4b`; scoped graph backfill refreshed 013 with `failed: []`.
- [x] T023 [PKT-7] Repair `010-security-and-correctness-fixes/spec.md:58,104` and `tasks.md:108`'s `review/review-report.md` cite -> `../review_archive/2026-07-01-plugin-implementation-review/review-report.md` — Evidence: `grep -n "../review_archive/2026-07-01-plugin-implementation-review/review-report.md"` returned hits at spec.md:58, spec.md:104, tasks.md:108; `ls .opencode/specs/system-deep-loop/032-goal-opencode-plugin/review_archive/2026-07-01-plugin-implementation-review/review-report.md` passed.
- [x] T024 [PKT-7] Repair `011-command-surface-normalization/tasks.md:120` and `012-regression-test-backfill/tasks.md:116`'s `../research/iterations/...` cites -> `../research_archive/2026-07-01-plugin-implementation-audit/iterations/...` — Evidence: `grep -n "../research_archive/2026-07-01-plugin-implementation-audit/iterations/iteration-00"` returned hits at 011 tasks.md:120 and 012 tasks.md:116; `ls` passed for iteration-002/003/004/005/007/008.
- [x] T025 [PKT-13] Add a pointer note in `009-diagnostic-review/` (folder header or `review-report.md`) directing readers to that folder's own actual artifacts (`iterations/`, `deltas/`, `deep-review-*` files, all already present locally) rather than the now-reused `review/`/`research/` paths — Evidence: `grep -n "Artifact pointer" 009-diagnostic-review/review-report.md` returned line 13; `ls` passed for `iterations/`, `deltas/`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, and `deep-review-strategy.md`.
- [x] T026 [DOC-1] Qualify `.opencode/skills/system-spec-kit/references/config/hook_system.md:125`'s "compaction" claim to match the plugin's real handled events (session.created/status/idle/deleted, message.updated, permission.\*, question.\*, \*.disposed) — Evidence: `grep -n "session.created.*session.status.*session.idle.*session.deleted.*message.updated.*permission.\*.*question.\*.*\*.disposed" hook_system.md` returned line 125.
- [x] T027 [DOC-2] Fix `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md:192`'s link text `007-goal-opencode-plugin.md` -> `goal-opencode-plugin.md` — Evidence: `grep -n "goal-opencode-plugin.md.*02--cli-hooks-and-plugin/goal-opencode-plugin.md" manual_testing_playbook.md` returned line 192; `ls` passed for the linked file.
- [x] T027a [DOC-2] Add the missing `mk-goal-export-contract.test.cjs` row to `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md`'s validation table (lines ~58-66) — Evidence: `grep -n "mk-goal-export-contract.test.cjs" goal-opencode-plugin.md` returned line 62; `ls .opencode/plugins/tests/mk-goal-export-contract.test.cjs` passed.
- [x] T028 Regenerate `../graph-metadata.json` via `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` after T005-T027a land — Evidence: ran the backfill script against this phase's own folder plus every other folder touched by T023/T024 and the T032 scaffold-marker sweep (007, 008, 010, 011, 012, 013, 014); each returned `refreshed: 1, failed: []`.
- [x] T032 Remove leftover `[template:level_1/plan.md]` / `[template:level_1/tasks.md]` title suffixes from phase 011 and phase 013 plan/tasks frontmatter — Evidence: `grep -n "[template:level_1/(plan|tasks).md]"` across those four files returned no output.
- [x] T033 Add specific `trigger_phrases` to `013-design-fidelity-and-polish/implementation-summary.md` after T010 removed generic triggers — Evidence: `grep -n "goal plugin usage limited detector\|goal plugin continuity fingerprint refresh\|goal plugin store health status\|goal plugin fsync debug logging" 013-design-fidelity-and-polish/implementation-summary.md` returned lines 5-8.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T029 Re-run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` against every existing 032 phase folder — Evidence (fresh, `SPECKIT_VALIDATE_LEGACY=1` prefix per the dist-freshness Known Limitation): 007 Errors:0 Warnings:0; 008 Errors:0 Warnings:0; 009-speckit-command-goal-prompt-offer Errors:0 Warnings:2 (SECTION_COUNTS + pre-existing FRONTMATTER_MEMORY_BLOCK on handover.md, out of this phase's allowed write paths); 010 Errors:0 Warnings:0; 011 Errors:0 Warnings:0; 012 Errors:0 Warnings:0; 013 Errors:0 Warnings:0; 014 Errors:0 Warnings:0; 015 (this phase) Errors:0 Warnings:1 (non-blocking `cross-refs` anchor deviation). This sweep also caught and fixed two regressions in this phase's own docs (a narrative `next_safe_action` field, two markdown-link-shaped evidence citations tripping SPEC_DOC_INTEGRITY) and a wider scaffold-title-marker sweep than T032's original scope (18 more `[template:...]` instances found across 007/008/010/012/014, not just 011/013) — all fixed and re-verified.
- [x] T030 Grep-confirm zero remaining hits — Evidence: false rename narrative CLEAN (all hits are the corrected true-lineage text or meta-references to the fix, zero false claims remain); "packet-wide" overclaim CLEAN (all hits are corrected-scope wording or forward-looking scope notes, not completion overclaims); fingerprint placeholder CLEAN (the only hits in 013's own docs are the placeholder string appearing inside grep-check descriptions, not live frontmatter values); "N of M" phase-count labels CLEAN (the two remaining "N of M" hits describe design-fork/event coverage counts, unrelated to the **Phase** metadata field PKT-4 targeted).
- [x] T031 Confirmed VAL-2's fix directly: `mcp_server/dist/lib/validation/orchestrator.js:37` contains the aligned 7-anchor `OPTIONAL_TEMPLATE_ANCHORS` set; `mcp_server/tests/validation-optional-anchors.vitest.ts` passes (1/1); the fix is verified independent of the unrelated dist-freshness gate that currently blocks the end-to-end Node-orchestrator `validate.sh --strict` path repo-wide (see Known Limitations).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Fresh `validate.sh --strict` output pasted as evidence for every 032 phase folder (not cited from a prior run)
- [x] Zero remaining instances of the false rename narrative, the fingerprint placeholder (009-014), the "packet-wide" overclaim, and stale phase-count labels
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md` (PKT-1 through PKT-15, DOC-1, DOC-2, VAL-1, VAL-2)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
