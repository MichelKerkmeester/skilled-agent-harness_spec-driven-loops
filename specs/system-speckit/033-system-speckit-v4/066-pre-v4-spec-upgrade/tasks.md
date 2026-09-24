---
title: "Tasks: Pre-v4 spec folder upgrade path"
description: "Ordered tasks for the upgrade-legacy command, the recorded-findings hook in the validator and the graph backfill exit-code fix, with the harness proof over v3.0.0.0 and v3.6.0.0."
trigger_phrases:
  - "pre-v4 upgrade tasks"
  - "upgrade-legacy tasks"
  - "recorded findings hook tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pre-v4 spec folder upgrade path

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Route through `sk-code` before the first code write, and record what its router resolves (AGENTS.md Gate 2)
- [ ] T002 Confirm the single-file Vitest commands by running one existing file in each project: `repair-derived.vitest.ts` (cli) and `generated-metadata-integrity.vitest.ts` (root) (`.skilled/skills/system-spec-kit/vitest.config.ts`)
- [ ] T003 Capture the before numbers: full `cli` and `root` Vitest pass counts, and the harness counts already measured (active 111 of 170 and 686 of 1,007, archived 0 of 186 and 0 of 911) (`scratch/harness/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Validator hook and exit-code fix
- [ ] T004 Add the recorded-findings function to `validateFolder` between the final entry list and the summary: load `upgrade-baseline.json`, strip line numbers from both sides, downgrade an `error` entry to `warn` only when all its details are listed, skip the never-covered rules outside `z_archive` and `z_future`, and ignore a malformed file (`runtime/lib/validation/orchestrator.ts`)
- [ ] T005 [P] Vitest cases for T004: all details listed gives `warn`, one new detail stays `error`, a shifted line number still matches, a never-covered rule stays `error` in an active packet and becomes `warn` under `z_archive`, a malformed file leaves every error in place, no file changes nothing (`runtime/tests/upgrade-baseline.vitest.ts`)
- [ ] T006 Exit 1 from `run()` when `failed[]` is non-empty (`runtime/cli/graph/backfill-graph-metadata.ts`)
- [ ] T007 [P] Spawn test: a folder whose refresh throws makes the backfill exit 1, and a clean folder still exits 0 (`runtime/cli/tests/graph-metadata-backfill.vitest.ts`)
- [ ] T008 Rebuild the dist and confirm `validate.sh --strict` still passes on a current v4 packet with no `upgrade-baseline.json` (`runtime/cli`, `runtime`)

### Command
- [ ] T009 Argument parsing, root resolution, discovery through `collectSpecFolders`, the read-only before pass and the dry-run report (`runtime/cli/spec/upgrade-legacy.mjs`)
- [ ] T010 Document edits and derivation for active packets, in the order `backfill-frontmatter`, `heal-spec-docs`, `repair-derived`, `migrate-generated-json --only` (`runtime/cli/spec/upgrade-legacy.mjs`)
- [ ] T011 Write `upgrade-baseline.json` atomically with sorted findings and a stable `recordedAt`, validate again, print the report, set exit 0, 1 or 2 (`runtime/cli/spec/upgrade-legacy.mjs`)
- [ ] T012 Record-only path for `z_archive` and `z_future` under `--include-archive` (`runtime/cli/spec/upgrade-legacy.mjs`)
- [ ] T013 [P] Vitest: a dry run writes nothing and exits 1, `--apply` makes strict pass and writes the file, a second `--apply` changes no byte, and a new broken link after the upgrade fails strict (`runtime/cli/tests/upgrade-legacy.vitest.ts`)

### Optional transforms
- [ ] T014 [B] Decide from T016's counts which structure-only transforms earn code, then build each with a test and rerun the harness. Blocked on T016, optional per `plan.md` §3
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Harness proof items 1 to 5 from `plan.md` §5 over `v3.0.0.0` and `v3.6.0.0`, numbers recorded in `implementation-summary.md`. Each sandbox is git-initialized and committed before `--apply`, so AC-004 and AC-007 can diff it (`scratch/harness/`)
- [ ] T016 Count recorded findings by rule across both tags, for the T014 decision (`scratch/harness/`)
- [ ] T017 [P] Add the command to the topology, key-files and entrypoints lists (`runtime/cli/spec/README.md`)
- [ ] T018 [P] Add one Upgrade Notes bullet naming the command (`.skilled/skills/system-spec-kit/changelog/v4.0.0.0.md`)
- [ ] T019 Rerun the full `cli` and `root` Vitest projects and `validate.sh --strict` on this packet from the final state, then fill `implementation-summary.md` and the evidence cells in `acceptance-criteria.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or T014 closed as not built with the measured reason
- [ ] No `[B]` blocked tasks remaining
- [ ] Harness proof items 1 to 5 pass from the final state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-007)
- [x] CHK-002 [P0] Technical approach defined in plan.md (§3 Data Flow)
- [x] CHK-003 [P1] Dependencies identified and available (plan.md §6)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint and typecheck (`npm run lint` in `runtime/cli`)
- [ ] CHK-011 [P0] No new warnings from the touched Vitest files
- [ ] CHK-012 [P1] Every caught error is handled, and a failed step reports failure (REQ-005)
- [ ] CHK-013 [P1] Code follows the patterns of `refresh-track-roots.mjs` and `orchestrator.ts`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (`acceptance-criteria.md`)
- [ ] CHK-021 [P0] Harness proof items 1 to 5 pass
- [ ] CHK-022 [P1] Edge cases tested: empty specs root, malformed frontmatter, packets under `.opencode/specs/` only, a tree already on v4
- [ ] CHK-023 [P1] Error scenarios validated: a child tool refuses a write, the backfill fails a folder
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class. The backfill exit code is `cross-consumer`, the recorded-findings hook is `algorithmic`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed (`plan.md` Fix Addendum: `heal-spec-docs.cjs` also exits 0 and is left as is).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the backfill exit code and the validator summary (`plan.md` Fix Addendum).
- [ ] CHK-FIX-004 [P0] The hook's tests cover the invariant: an unlisted finding is never downgraded, a never-covered rule is never downgraded outside archives.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (`plan.md` Fix Addendum).
- [ ] CHK-FIX-006 [P1] Tests that read process-wide state, such as `SPECKIT_*` variables, set and restore them.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Every write stays inside the specs roots the command was given (NFR-S01)
- [ ] CHK-032 [P1] No network or LLM call anywhere in the command (NFR-S02)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] Code comments state the durable reason, with no packet or requirement ids
- [ ] CHK-042 [P2] `runtime/cli/spec/README.md` and the v4 changelog updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion, except the committed harness scripts
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 2/12 |
| P1 Items | 13 | 1/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-24
<!-- /ANCHOR:summary -->

---
