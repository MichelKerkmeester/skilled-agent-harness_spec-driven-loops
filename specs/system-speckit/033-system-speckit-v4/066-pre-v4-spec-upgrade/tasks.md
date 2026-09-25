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

- [x] T001 Route through `sk-code` before the first code write, and record what its router resolves (AGENTS.md Gate 2). Evidence: `compiled-route.cjs --hub sk-code` resolved `sk-code-opencode`; its universal, JavaScript and TypeScript checklists were loaded
- [x] T002 Confirm the single-file Vitest commands by running one existing file in each project: `repair-derived.vitest.ts` (cli) and `generated-metadata-integrity.vitest.ts` (root) (`.skilled/skills/system-spec-kit/vitest.config.ts`). Evidence: `npx vitest run --config vitest.config.ts --project cli tests/repair-derived.vitest.ts` 13 passed, exit 0; `--project root runtime/tests/generated-metadata-integrity.vitest.ts` 19 passed, exit 0
- [x] T003 Capture the before numbers: full `cli` and `root` Vitest pass counts, and the harness counts already measured (active 111 of 170 and 686 of 1,007, archived 0 of 186 and 0 of 911) (`scratch/harness/`). Evidence at `f2b04f4773`: cli 157 files, 1,550 tests, 1,531 passed, 0 failed, 19 skipped; root 107 files, 1,277 tests, 1,264 passed, 0 failed, 13 skipped; `tsc --noEmit` exit 0 for `runtime` and `runtime/cli`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Validator hook and exit-code fix
- [x] T004 Add the recorded-findings function to `validateFolder` between the final entry list and the summary: load `upgrade-baseline.json`, strip line numbers from both sides, downgrade an `error` entry to `warn` only when all its details are listed, skip the never-covered rules outside `z_archive` and `z_future`, and ignore a malformed file (`runtime/lib/validation/orchestrator.ts`). Evidence: five-hunk diff in `orchestrator.ts` (optional `recorded` field, `applyRecordedFindings` called before the summary, recorded note in the text report); runtime `tsc --noEmit` exit 0; `generated-metadata-integrity` 19 passed
- [x] T005 [P] Vitest cases for T004: all details listed gives `warn`, one new detail stays `error`, a shifted line number still matches, a never-covered rule stays `error` in an active packet and becomes `warn` under `z_archive`, a malformed file leaves every error in place, no file changes nothing (`runtime/tests/upgrade-baseline.vitest.ts`). Evidence: 8 passed; switching the every-key match to some-key fails the unlisted-detail case, so the invariant is guarded
- [x] T006 Exit 1 from `run()` when `failed[]` is non-empty (`runtime/cli/graph/backfill-graph-metadata.ts`). Evidence: 5-line diff in `run()`; `graph-metadata-backfill` and `repair-derived` tests 19 passed, 1 skipped (pre-existing), exit 0; cli `tsc --noEmit` exit 0
- [x] T007 [P] Spawn test: a folder whose refresh throws makes the backfill exit 1, and a clean folder still exits 0 (`runtime/cli/tests/graph-metadata-backfill.vitest.ts`). Evidence: 8 passed, 1 skipped; with the exit-code fix removed the new test fails `expected +0 to be 1`, so it guards the bug
- [x] T008 Rebuild the dist and confirm `validate.sh --strict` still passes on a current v4 packet with no `upgrade-baseline.json` (`runtime/cli`, `runtime`). Evidence: `npm run build` in `runtime` exit 0, both dists carry the change; `010-goal-file-addon` and `032-recorded-findings-closure` print `RESULT: PASSED (errors=0 warnings=0)`; no `upgrade-baseline.json` exists under `specs/`

### Command
- [x] T009 Argument parsing, root resolution, discovery through `collectSpecFolders`, the read-only before pass and the dry-run report (`runtime/cli/spec/upgrade-legacy.mjs`). Evidence: dry run over `specs/system-speckit/033-system-speckit-v4` printed `inspected=199 active=199 archived=0` and `passing=198/199`, exit 1; `--bogus` and a root outside the repository exit 2. Discovery skips the copies of spec folders that research and review runs keep inside a packet
- [x] T010 Document edits and derivation for active packets, in the order `backfill-frontmatter`, `heal-spec-docs`, `repair-derived`, `migrate-generated-json --only` (`runtime/cli/spec/upgrade-legacy.mjs`). Evidence: on a v3-shaped fixture packet `--apply` ran all four steps (`step ...: ok`) and `passing before=0/1 after=1/1`, exit 0
- [x] T011 Write `upgrade-baseline.json` atomically with sorted findings and a stable `recordedAt`, validate again, print the report, set exit 0, 1 or 2 (`runtime/cli/spec/upgrade-legacy.mjs`). Evidence: the fixture's `upgrade-baseline.json` holds 6 sorted findings with schema 1; a second `--apply` exits 0 and leaves the specs manifest identical; a new broken link then prints `RESULT: FAILED` with `x SPEC_DOC_INTEGRITY`
- [x] T012 Record-only path for `z_archive` and `z_future` under `--include-archive` (`runtime/cli/spec/upgrade-legacy.mjs`). Evidence: `--include-archive` harness runs pass 158 of 158 (v3.0) and 895 of 895 (v3.6) archived packets, and the sandbox `git status` lists no changed archived file apart from each new `upgrade-baseline.json`; the test "only records an archived packet and never rewrites its documents" passes, and so does "leaves a root inside z_archive alone unless --include-archive is given"
- [x] T013 [P] Vitest: a dry run writes nothing and exits 1, `--apply` makes strict pass and writes the file, a second `--apply` changes no byte, and a new broken link after the upgrade fails strict (`runtime/cli/tests/upgrade-legacy.vitest.ts`). Evidence: `upgrade-legacy.vitest.ts` 6 passed in a throwaway repo holding a copy of the skill: empty tree exits 0, dry run exits 1 with an unchanged manifest, `--apply` exits 0 and the packet passes, a second `--apply` changes nothing, a new broken link fails strict, a root outside the repo exits 2

### Optional transforms
- [x] T014 Decide from T016's counts which structure-only transforms earn code, then build each with a test and rerun the harness. Closed as not built: every active and archived packet passes on recording alone (170, 995, 158 and 895 of the same), so a transform adds no pass. The largest recorded rule, `GREP_CONVENTION` (2,181 and 1,977 findings), would need edits to authored documents for findings that no longer block anything, and the large metadata counts belong to archived snapshots, which are frozen by design
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Harness proof items 1 to 5 from `plan.md` §5 over `v3.0.0.0` and `v3.6.0.0`, numbers recorded in `implementation-summary.md`. Each sandbox is git-initialized and committed before `--apply`, so AC-004 and AC-007 can diff it (`scratch/harness/`). Evidence, four runs on 2026-09-24, each exit 0: v3.0 `before=2/170 after=170/170`, v3.0 with archives `before=2/328 after=328/328`, v3.6 `before=0/995 after=995/995`, v3.6 with archives `before=0/1890 after=1890/1890`. In every run the dry run exited 1 with the manifest identical, a second `--apply` left it identical, the scope check read `new .md files=0, archived files changed=0, changed status lines=0`, and one new broken link printed `RESULT: FAILED` with `x SPEC_DOC_INTEGRITY`. On 2026-09-25 the proof script was found to name its file lists by tag only, so two runs of one tag shared them. The two v3.0 runs ran one after the other, and the two v3.6 runs never compared a name the other wrote in between, so no result changed. Each run now names its files after itself. Final-state reruns on 2026-09-25, both tags with `--include-archive`, each exit 0: v3.0 `before=2/328 after=328/328` (active 170 of 170, archived 158 of 158), v3.6 `before=0/1890 after=1890/1890` (active 995 of 995, archived 895 of 895). In both runs, proofs 5 and 2 were identical, the scope checks read 0, 0, 0, proof 3 printed `RESULT: FAILED` with `x SPEC_DOC_INTEGRITY`, and no step failed. The runs printed 23 and 48 `left as is` lines for unreadable frontmatter. The command copy these reruns used differs from the final file only by the printed v3 move and the root dedupe. Neither can act in a sandbox whose packets sit in a real `specs/` under one root
- [x] T016 Count recorded findings by rule across both tags, for the T014 decision (`scratch/harness/`). Evidence, findings recorded with `--include-archive` (v3.0 / v3.6): `GREP_CONVENTION` 2,181 / 1,977; `GENERATED_METADATA_DRIFT` 158 / 1,740; `GENERATED_METADATA_INTEGRITY` 158 / 1,303; `METADATA_DISK_PATH_CONSISTENCY` 0 / 1,383; `ANCHORS_VALID` 130 / 705; `SPEC_DOC_SUFFICIENCY` 79 / 689; `SCAFFOLD_NEVER_TOUCHED` 48 / 524; `SPEC_DOC_INTEGRITY` 137 / 453; `STATUS_CROSS_DOC_CONSISTENCY` 32 / 242; `FRONTMATTER_MEMORY_BLOCK` 7 / 205; `LEVEL_MATCH` 104 / 174; `PLACEHOLDER_FILLED` 157 / 154; `FILE_EXISTS` 63 / 143; `TEMPLATE_SOURCE` 9 / 134; `AI_PROTOCOLS` 78 / 71; `FRONTMATTER_VALID` 0 / 62; `GRAPH_METADATA_CHILD_IDENTITY` 0 / 28; `TOC_POLICY` 0 / 1. The metadata rules appear only in archived packets
- [x] T017 [P] Add the command to the topology, key-files and entrypoints lists (`runtime/cli/spec/README.md`). Evidence: topology line, key-files row, entrypoint line, and the writes-only-the-selected-folder rule now names the command as its second exception; `rg -c upgrade-legacy` prints 4
- [x] T018 [P] Write the v4.0.0.1 release notes covering every change since the v4.0.0.0 tag and naming the command, per the operator's choice on 2026-09-24 (`.skilled/skills/system-spec-kit/changelog/v4.0.0.1.md`). Evidence: routed through `sk-doc` to `sk-create-changelog`, expanded format over 139 commits and 44 packets; claims checked against each packet's summary and commits, with six unsupported claims corrected; `hvr_scan.py` 0 hard blockers, `validate_document.py` exit 0
- [x] T019 Rerun the full `cli` and `root` Vitest projects and `validate.sh --strict` on this packet from the final state, then fill `implementation-summary.md` and the evidence cells in `acceptance-criteria.md`. Evidence 2026-09-25: cli 1,550 passed, 19 skipped, 0 failed; root 1,274 passed, 13 skipped, 0 failed; `implementation-summary.md` and AC-001 to AC-007 filled; `validate.sh --strict` on this packet, run after the continuity save and the metadata re-derive, printed `RESULT: PASSED` with 0 errors and 0 warnings
- [x] T020 Fix what the closeout evidence pass found (`runtime/cli/spec/upgrade-legacy.mjs`, `runtime/tests/upgrade-baseline.vitest.ts`, `runtime/cli/tests/upgrade-legacy.vitest.ts`, `scratch/harness/upgrade-proof.sh`, README, release notes). Evidence, 2026-09-25: the command's old `╔═╗` header, which the JavaScript style guide bars from new files, and the hook test's missing header were replaced, and both first lines match the sibling test byte for byte. A test now proves a packet the tools cannot fix makes `--apply` exit 2 and names it. After the operator's call on the malformed-frontmatter edge case, the fill step names each document it leaves alone, with a test, and the README and release notes say so. The proof script names its file lists per run, a rename the conductor made in the scratch harness. The gate review then failed the build on one P1, confirmed by hand: both v3 tags track `specs` as a symlink to `.opencode/specs`, so the printed `git mv` stopped with "destination already exists". The printed move now removes the link first. It was measured to work in four committed throwaway repositories (tracked relative link, tracked absolute link, untracked link, no link), and its test runs it. The review's P2 on overlapping `--roots` listing a packet twice was fixed with a test. MiMo wrote the code and doc changes in 7 briefs, each diff checked against its brief
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or T014 closed as not built with the measured reason
- [x] No `[B]` blocked tasks remaining
- [x] Harness proof items 1 to 5 pass from the final state
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

- [x] CHK-010 [P0] Code passes lint and typecheck (`npm run lint` in `runtime/cli`). Evidence 2026-09-25: `npm run lint` in `runtime/cli` (its `tsc --noEmit`) exit 0; `tsc --noEmit` in `runtime` exit 0. `eslint` over the six changed code and test files reports 5 errors, all unused variables in `orchestrator.ts`, and the committed `orchestrator.ts` gives the same 5, so none is new
- [x] CHK-011 [P0] No new warnings from the touched Vitest files. Evidence: the three changed test files run alone print only Vite's config-loader notice about the unchanged `vitest.config.ts`
- [x] CHK-012 [P1] Every caught error is handled, and a failed step reports failure (REQ-005). Evidence: each `catch` in `upgrade-legacy.mjs` either records a reason that sets exit 2 (validation, steps, baseline write), counts and prints a per-file error (frontmatter fill), or skips a missing baseline in the closing tally. With one packet's graph file broken, the run printed `step repair-derived: FAILED exit 2` and `step migrate-generated-json: FAILED exit 1` and exited 2
- [x] CHK-013 [P1] Code follows the patterns of `refresh-track-roots.mjs` and `orchestrator.ts`. Evidence: after the header fix the command opens with the `MODULE:` header and numbered section dividers `refresh-track-roots.mjs` uses, as the JavaScript style guide requires of a new file; the new hook test carries the `TEST:` header its sibling uses. The hook adds one optional field to the existing entry shape and runs inside `validateFolder`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (`acceptance-criteria.md`). Evidence: AC-001 to AC-007 read `Met`, each with observed evidence and the final-state reruns of 2026-09-25; none waived or superseded
- [x] CHK-021 [P0] Harness proof items 1 to 5 pass. Evidence: the final-state reruns of 2026-09-25 for both tags with `--include-archive` passed all five items, exit 0 (T015)
- [x] CHK-022 [P1] Edge cases tested: empty specs root, malformed frontmatter, packets under `.opencode/specs/` only, a tree already on v4. Evidence, command tests: "exits 0 on an empty specs tree and says it found nothing", "names a document whose frontmatter it cannot read and leaves it as is", "asks for the v4 layout, and the move it prints works on a v3 checkout", which builds the tracked `specs` link both v3 tags ship, runs the printed move and upgrades the result, and "changes nothing on a second --apply" with the proof runs' second `--apply` for a tree already upgraded. The last two cases follow the spec edge cases as amended by the operator on 2026-09-25
- [x] CHK-023 [P1] Error scenarios validated: a child tool refuses a write, the backfill fails a folder. Evidence: `repair-derived.vitest.ts` "reports a repair it could not make and exits 2" for a refused write; the backfill test "exits 1 and names the folder when one graph file is corrupt"; the command test "exits 2 and names a packet the tools cannot fix"
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The backfill exit code is `cross-consumer`, the recorded-findings hook is `algorithmic`. Evidence: `plan.md` Fix Addendum lists every consumer of the exit code and the one caller of the hook
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed (`plan.md` Fix Addendum: `heal-spec-docs.cjs` also exits 0 and is left as is). Evidence: the command reads each packet's verdict from the validator, not from that exit code
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the backfill exit code and the validator summary (`plan.md` Fix Addendum). Evidence: the table's nine rows come from `rg -n --hidden "backfill-graph-metadata" .skilled .github` on 2026-09-24, and the pre-commit row was measured: 0 of 4,114 packets newly blocked
- [x] CHK-FIX-004 [P0] The hook's tests cover the invariant: an unlisted finding is never downgraded, a never-covered rule is never downgraded outside archives. Evidence: "keeps an error entry when one detail is not recorded", "keeps an error entry when a recorded detail appears again at a new line" and "never downgrades a re-derive rule in an active packet, but does in an archive" pass; switching the every-key match to some-key fails the first, so it guards the invariant
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (`plan.md` Fix Addendum). Evidence: the addendum now states the row count, 2 eras by 3 locations by 4 file states by 2 rule classes, 48 rows, and which evidence covers which axes
- [x] CHK-FIX-006 [P1] Tests that read process-wide state, such as `SPECKIT_*` variables, set and restore them. Evidence: no changed test reads or writes `process.env`; the command tests spawn the command in a throwaway repository with the inherited environment
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: nothing is committed yet, so the evidence is pinned to the uncommitted diff over base `f2b04f4773` and to the final files' sha256 prefixes: `upgrade-legacy.mjs` `2e0e634cfd10`, `orchestrator.ts` `89dcee4eb452`, `backfill-graph-metadata.ts` `e9c151b80ae8`, `upgrade-baseline.vitest.ts` `4b5d0ae90c56`, `upgrade-legacy.vitest.ts` `30e5c27a7206`, `graph-metadata-backfill.vitest.ts` `1b1fa61a5285`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: `rg -ni` for key, secret, token, password and bearer assignments over the six changed code and test files exited 1 with no match
- [x] CHK-031 [P0] Every write stays inside the specs roots the command was given (NFR-S01). Evidence: in all four proof sandboxes the only files outside `specs/` changed after the base commit are the validator's own dist freshness records, which every `validate.sh` run writes, plus one command file the conductor copied in by hand. The command tests show a passing child, a research copy and a root inside `z_archive` left byte-identical
- [x] CHK-032 [P1] No network or LLM call anywhere in the command (NFR-S02). Evidence: `rg` for `fetch(`, URLs, `curl`, `wget`, `http.`, `net.connect`, provider names and `pi -p` in `upgrade-legacy.mjs` exited 1 with no match
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized. Evidence 2026-09-25: the two spec edge cases that disagreed with the code were settled by the operator in the code's favor and amended; `plan.md` Data Flow was amended to the built pipeline
- [x] CHK-041 [P1] Code comments state the durable reason, with no packet or requirement ids. Evidence 2026-09-25: the pre-commit hook's checker, `sk-code-quality/scripts/check-comment-hygiene.sh`, exits 0 on each of the six changed code and test files and on both changed harness scripts
- [x] CHK-042 [P2] `runtime/cli/spec/README.md` and the v4 changelog updated. Evidence: the README names the command in its tree, entrypoints and key-files row, including the layout refusal and the per-file report; the release notes went into a new `changelog/v4.0.0.1.md` by operator decision, `hvr_scan.py` 0 hard blockers, `validate_document.py` exit 0
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence 2026-09-25: `git status --porcelain` lists only the delivered files; the proof sandboxes, briefs and logs lived in the session scratchpad outside the repository
- [x] CHK-051 [P1] scratch/ cleaned before completion, except the committed harness scripts. Evidence: `scratch/` holds the harness scripts, the new `upgrade-proof.sh`, and two data files from the planning runs under `scratch/harness/data/`, which the committed `data/.gitignore` keeps out of git by design. Nothing else is there
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-25
<!-- /ANCHOR:summary -->

---
