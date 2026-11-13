---
title: "Tasks: Phase 1: relocation-engine"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "relocation engine tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: relocation-engine

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`K` is `.skilled/skills/system-spec-kit`. `R` is `$K/runtime/cli/spec/relocate.mjs`. `COPY` is a throwaway copy of the repository made with `git worktree add` or `cp -R`, never the working tree.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the stale `packet_pointer` count in `goal.md`, `acceptance-criteria.md` and `resource-map.md` and record the three numbers (`goal.md` section 4 of this phase). Verify: `rg -c "stale pointers" goal.md` prints 1.
- [x] T002 Find the producer of `specs/descriptions.json` and record the command (`$K/runtime/lib/search/folder-discovery.ts`). Verify: `rg -c "descriptions.json command" goal.md` prints 1.
- [x] T003 Capture the test baseline before the first edit (`$K/runtime/cli/package.json`). Verify: `cd $K/runtime/cli && npm test` prints the pass and fail counts, saved to `scratch/baseline.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `goal.md`, `acceptance-criteria.md`, `resource-map.md` and `decision-record.md` to `DOCS` (`$K/runtime/cli/spec/repair-derived.cjs`). Verify: `rg -c "'goal.md', 'acceptance-criteria.md', 'resource-map.md', 'decision-record.md'" $K/runtime/cli/spec/repair-derived.cjs` prints 1.
- [x] T005 Add `goal.md`, `acceptance-criteria.md` and `resource-map.md` to the candidate list (`$K/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs`). Verify: `rg -c "'goal.md'|'acceptance-criteria.md'|'resource-map.md'" $K/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs` prints 3.
- [x] T006 Create the CLI with argument parsing for `--map`, `--from`, `--to`, `--renumber`, `--declare-subtrack` and `--apply`, dry run by default (`$R`). Verify: `node $R --map scratch/empty-map.json` prints that nothing is to do and exits 0.
- [x] T007 Add preflight for destination collision, the no-mix rule through `trackLayout`, the one-subtrack depth limit, `NNN-slug` naming and the dirty-tree check (`$R`). Verify: `node $R --map scratch/mixed-map.json` exits 2 and `git status --porcelain` prints nothing new.
- [x] T008 Add the move step, `git mv` for a tracked folder and a rename for an untracked one (`$R`). Verify: in `COPY`, `node $R --from <a> --to <b> --apply` then `ls <b>/spec.md` prints the path.
- [x] T009 Add the `description.json` identity rewrite through `graph/migrate-generated-json.ts --only` (`$R`). Verify: in `COPY`, `rg -c '"specFolder": "<b id>"' <b>/description.json` prints 1.
- [x] T010 Add the `graph-metadata.json` and document pointer rewrite through `repair-derived.cjs --roots <dest> --apply` (`$R`). Verify: in `COPY`, `node $K/runtime/cli/spec/repair-derived.cjs --roots <b>` exits 0.
- [x] T011 Add the phase-parent `children_ids` update on the old and the new parent (`$R`). Verify: in `COPY`, `rg -c '<a id>' <old parent>/graph-metadata.json` prints nothing and `rg -c '<b id>' <new parent>/graph-metadata.json` prints 1.
- [x] T012 Add the track and subtrack root refresh through `refresh-track-roots.mjs --track <t> --apply` for every affected track (`$R`). Verify: in `COPY`, `node $K/runtime/cli/spec/sweep-track-roots.mjs` exits 0.
- [x] T013 Add the inbound reference rewrite for `manual.depends_on`, `manual.supersedes`, `manual.related_to` and markdown link targets, by whole-id match (`$R`). Verify: in `COPY`, `rg -l '<a id>' specs` prints nothing.
- [x] T014 Add the ledger append and the redirect rebuild through `cite-drift-scan.mjs --rebuild-redirects` (`.skilled/skills/sk-doc/shared/scripts/relocation-ledger.json`). Verify: in `COPY`, `rg -c '"from": "<a id>"' .skilled/skills/sk-doc/shared/scripts/relocation-ledger.json` prints 1.
- [x] T015 Add the trigger index and description cache refresh (`$R`). Verify: in `COPY`, `node $K/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0.
- [x] T016 Add the report-only scan of `.skilled/bin/lib/compiled-route-layout.cjs` and `.github/workflows/*` that fails closed (`$R`). Verify: a dry run that moves `specs/sk-doc/z_archive/019-skill-routing-refactor` exits 2 and prints `compiled-route-layout.cjs`.
- [x] T017 Add the close step that runs `validate.sh` on each moved packet and `sweep-track-roots.mjs` (`$R`). Verify: in `COPY`, the apply output ends with `RESULT: PASSED` for the moved packet.
- [x] T018 Add `--declare-subtrack <track>/<name>` (`$R`). Verify: in `COPY`, `node $R --declare-subtrack demo/sub --apply` then `ls specs/demo/sub/z_archive/.gitkeep` prints the path.
- [x] T019 Make `restore_spec` call the engine when a differently named live sibling holds the restored number, and keep refusing a folder at the exact destination (`$K/runtime/cli/spec/archive.sh`). Verify: in `COPY`, restoring `001-a` beside a live `001-b` exits 0 and `ls` shows the restored packet on the next free number.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run a dry run with a sample map on the real tree (`$R`). Verify: `node $R --map scratch/sample-map.json` exits 1 and `git status --porcelain` prints the same lines as before the run.
- [x] T021 Apply the sample map in `COPY` and run it a second time (`$R`). Verify: the first `--apply` exits 0 and the second prints that nothing is to do and exits 0.
- [x] T022 Rerun the full suite and compare with the baseline (`scratch/baseline.txt`). Verify: `cd $K/runtime/cli && npm test` exits 0 and its fail count is not above the baseline.
- [x] T023 Validate this phase folder (`spec.md`). Verify: `bash $K/runtime/cli/spec/validate.sh . --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The second `--apply` run in `COPY` exited 0 with nothing to do
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with its reason in `goal.md` section 4.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The baseline in `scratch/baseline.txt` exists before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check $R` exits 0
- [x] CHK-011 [P0] `bash -n $K/runtime/cli/spec/archive.sh` exits 0
- [x] CHK-012 [P1] Every failure path in `$R` exits 2 with a message that names the path
- [x] CHK-013 [P1] No code comment names a spec path, a task id or a requirement id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The dry run on the real tree changed no file
- [x] CHK-022 [P1] The prefix-id and joined-id cases leave unrelated references untouched
- [x] CHK-023 [P1] Each preflight refusal exits 2 before any write
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase builds a new tool and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `$R` reads no credential and no `.env` file
- [x] CHK-031 [P0] A `from` or `to` outside `specs/`, and a symlinked folder, exit 2
- [x] CHK-032 [P1] N/A: the tool has no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The header comment of `$R` states the dry-run default and the three exit codes
- [x] CHK-042 [P2] `$K/runtime/cli/spec/README.md` lists `relocate.mjs`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Sample maps and the baseline live in `scratch/` only
- [x] CHK-051 [P1] `COPY` is removed before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
