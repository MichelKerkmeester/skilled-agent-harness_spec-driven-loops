---
title: "Tasks: JSON Metadata Rename Reconciliation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "metadata rename reconciliation"
  - "specFolder parentChain drift"
  - "phantom children_ids prune"
  - "extractKeywords numeric junk"
  - "migrate-generated-json apply run"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/008-metadata-rename-reconciliation"
    last_updated_at: "2026-07-09T13:40:00Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Closed task list with final verification evidence"
    next_safe_action: "No packet task remains; do not commit or push unless explicitly requested"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-008-metadata-rename-reconciliation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: JSON Metadata Rename Reconciliation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Re-confirm the parentChain and merge-path call graph against the live tree. Evidence: scoped diff touches the two parentChain producers and graph refresh/merge callers only.
- [x] T002 [P] Re-run the read-only full-tree dry-run baseline and diff against the spec-time baseline. Evidence: final dry-run header is `enumerated:2508`, `migrated:0`, `skippedNoop:2508`, `failed:0`, `excluded:57` versus baseline `enumerated:2503`, `migrated:2446`, `failed:0`.
- [x] T003 [P] Confirm `.opencode/specs/descriptions.json` is clean for stale paths. Evidence: aggregate cache has 2,377 records, 0 stale top-level path matches, and 0 parentChain mismatches; scoped git status did not list it.
- [x] T004 Grep audit for additional parentChain producers. Evidence: implementation remained scoped to `generatePerFolderDescription()` and the CLI explicit-description path.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Route parentChain through the resolved specFolder in `generatePerFolderDescription()`.
- [x] T006 Apply the same parentChain fix to the CLI explicit-description path.
- [x] T007 Add a numeric-junk filter to `extractKeywords()`.
- [x] T008 Extend `STOP_WORDS` with a reviewed generic-verb list.
- [x] T009 Add sentence-boundary-preferred truncation ahead of word-boundary fallback.
- [x] T010 Thread an opt-in prune option through `refreshGraphMetadataForSpecFolder()` into merge.
- [x] T011 Add `--prune`/`--prune-report` argv handling to the backfill CLI.
- [x] T012 Thread prune options and matching CLI flags through `migrate-generated-json.ts`.
- [x] T013 Rebuild TypeScript outputs. Evidence: `npm run build` exited 0; no tracked dist drift remained.
- [x] T014 Full-tree dry-run with fixes landed. Evidence: `migrated:0`, `failed:0` after reconciliation.
- [x] T015 Full-tree apply run completed in prior resume dispatch and verified by current repeat dry-run residual 0.
- [x] T016 Repeat dry-run confirmed near-zero residual. Evidence: `migrated:0` and direct mismatch counts all 0.
- [x] T017 Full-tree prune report reviewed in prior resume dispatch; current code/test evidence preserves on-disk children.
- [x] T018 Prune apply run completed in prior resume dispatch and verified by current repeat counts.
- [x] T019 Per-entry existence check implemented. Evidence: `preserveExistingChildrenOnDisk()` keeps existing targets before prune merge.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Spot-check `sk-doc/999-sk-doc-parent` class before/after. Evidence: final direct mismatch scan reports no stale graph `spec_folder` and no description specFolder/parentChain mismatches.
- [x] T021 Spot-check one `system-speckit/026` dual-prefix class before/after. Evidence: final direct graph mismatch count is 0 and dry-run residual is 0.
- [x] T022 Run strict validation. Evidence: final `validate.sh --strict` output is recorded in implementation-summary.md.
- [x] T023 Capture generated metadata integrity before/after. Evidence: final full-tree migration dry-run reports `migrated:0`; global verify noise is unrelated archived completion evidence.
- [x] T024 [P] Add and pass relevant tests. Evidence: `migrate-generated-json.vitest.ts` passed 1 file / 11 tests.
- [x] T025 [P] Confirm aggregate cache clean/untouched. Evidence: `.opencode/specs/descriptions.json` parsed with 2,377 records and 0 stale top-level path matches; scoped git status did not list it.
- [x] T026 Update spec/plan/tasks/checklist/implementation-summary with final evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed with known unrelated test-infrastructure failures documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

## Phase R: Audit Remediation (2026-07-09 GPT-5.6 review wave)

- [ ] T027 [P1] A single `--prune` invocation generates its dry-run report and applies removals in the same run, bypassing the report-review gate (`scripts/graph/migrate-generated-json.ts:459-463`; `scripts/graph/backfill-graph-metadata.ts:165-167`). Require a report artifact/hash or explicit confirmation token from a prior `--prune-report` run.
- [ ] T028 [P2] Share one description-fallback helper between `_processSpecFolder()` and `generatePerFolderDescription()` so the per-folder generator cannot write blank descriptions (`mcp_server/lib/search/folder-discovery.ts:963-968` vs `:1033`); update the blank-spec test that currently locks in the empty behavior (`folder-discovery.vitest.ts:770-780`).
- [ ] T029 [P2] `wouldWritePerFolderDescription()` strips `lastUpdated`, so canonical-doc changes with unchanged synopsis keep a stale timestamp despite the F6 claim (`folder-discovery.ts:325-332`). Define `lastUpdated` semantics and add stale-source detection independent of synopsis equality.
- [ ] T030 [P2] The explicit `--description` CLI path ignores `SPECKIT_IDENTITY_MERGE_SAFETY` (`scripts/spec-folder/generate-description.ts:32-40` vs `ENV_REFERENCE.md:466`). Apply the capability-flag check or amend the ENV contract.
- [ ] T031 [P2] Dry-run prune prediction uses `mergeGraphMetadata` while apply preserves on-disk children via `refreshGraphMetadataForSpecFolder`, so dry-run over-reports changes (`backfill-graph-metadata.ts:370-389`). Route prediction through the same preservation calculation.
- [ ] T032 [P2] Live migration returns unconditional `rewritten` even when the writer skipped an unchanged graph (`migrate-generated-json.ts:284-304`). Return `unchanged` when `summary.changed === 0`; test second-run outcome counts, not only file bytes.
- [ ] T033 [P2] Document `--prune-report`/`--prune`, report-first sequencing, scope controls, and rollback in the script usage header and the maintenance README (`migrate-generated-json.ts:3-6`).
