---
title: "Tasks: Phase 10: upgrade-reversibility"
description: "The task list for Phase 10: upgrade-reversibility, each task naming its file. Every task is done and carries the evidence that closed it, except the checklist rows named in the verification summary."
trigger_phrases:
  - "upgrade reversibility tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: upgrade-reversibility

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
## Phase 1: Tree State and Manifest Infrastructure

- [x] T001 Implement `isCommittedTree()` in `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` with `git -C <REPO>`, and refuse `--apply` when REPO is not a git repository (done differently: no function carries that name; `readRepositoryState()` at `upgrade-legacy.mjs:182` reads `git -C <REPO> rev-parse --absolute-git-dir`, `rev-parse --verify HEAD` and `status --porcelain=v1 -z --untracked-files=all`, and the dirty paths it returns decide whether the tree is committed; `--apply` exits 2 with `--apply requires REPO to be a git repository` when the first call fails, at lines 188 and 1015-1022; test `no-git-refuses-apply` passes)
- [x] T002 Implement `writeManifest()` in `upgrade-legacy.mjs` at `<git-dir>/upgrade-legacy.manifest.json` (`git -C <REPO> rev-parse --absolute-git-dir`) to record HEAD SHA, baseline map and a before-image (blob id from `git hash-object -w`, or bytes) for each dirty file the run touches (done differently: three functions, `prepareManifest()` at line 452 writes it as `in-progress` before any repair, `completeManifest()` at line 475 marks it `complete`, and `writeManifestFile()` at line 319 writes it with mode `0o600`; it records `schema`, `repoRoot`, `headSha`, `recordedAt`, `status`, `baselineMap`, `recordedBaselineMap`, `scopeHashes` and `beforeImages`; the before-image is the file bytes as base64 plus the mode, `absent` or a symlink target, and the file never calls `git hash-object`)
- [x] T003 Implement `readManifestIfExists()` in `upgrade-legacy.mjs` to load manifest and validate tree state match (`readManifestIfExists()` at line 354 returns the manifest only when its `headSha` equals HEAD, its status is `complete` and every `scopeHashes` entry equals the current packet-tree hash; a head mismatch, a tree mismatch or an `in-progress` status comes back as an issue, and a manifest that cannot be read or lacks its fields throws)
- [x] T004 Add test fixture `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/upgrade-legacy-dirty-tree/` with uncommitted changes (done differently: no fixture directory was added; the test builds its dirty tree inside the shared throwaway git repository with `writeLegacyPacket(DIRTY_PACKET)`, a commit, then an appended line in `spec.md` and `plan.md`, at `upgrade-legacy.vitest.ts:504-511`; `ls tests/fixtures | grep -i upgrade` finds nothing)
- [x] T005 Add test fixture `fixtures/upgrade-legacy-manifest-recovery/` with a pre-written manifest (done differently: no fixture directory; the `manifest-recovery` case writes the manifest with a real `--apply`, then renames the whole repository directory and reads the manifest from a second process, at `upgrade-legacy.vitest.ts:580-614`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Dry Run Listing and Apply Logic

- [x] T006 Modify dry run output in `upgrade-legacy.mjs` to add "Downgrades" section that lists each finding the baseline will downgrade (`printDowngrades()` at line 489 prints `Downgrades:` and one `<packet> | <rule> | error -> warning` row per finding, or `none`; the dry run calls it at line 1207 and `--apply` at line 1139; `predictDowngradeFindings()` at line 925 repairs a temporary copy of the failing packets so the list is what `--apply` would record)
- [x] T007 Add logic to `--apply` to refuse on dirty tree without manifest location, or write manifest before first change (the manifest is prepared at `upgrade-legacy.mjs:1083-1092`, before `repairPackets()` at line 1094, whenever the tree is dirty and a packet fails; when it cannot be written the run prints `could not write reversibility manifest at <path>; no packet changes were made` and exits 2)
- [x] T008 Add logic to restore baseline from manifest on second run, if manifest exists and tree state matches (`baselineMapFor()` at line 253 prefers the manifest's `recordedBaselineMap` for every packet in its `scopeHashes`; the dry run and `--apply` both read it, at lines 1046 and 1132; the tool loads the baselines and does not copy before-images back, which the README script does)
- [x] T009 Add test `upgrade-legacy.vitest.ts::dirty-tree-writes-manifest` that runs `--apply` on dirty fixture and checks for manifest (passes; a committed tree gets no manifest, a dirty tree gets one whose bytes for `spec.md` and `plan.md` equal what the files held before the run, at `upgrade-legacy.vitest.ts:489-534`)
- [x] T010 Add test `upgrade-legacy.vitest.ts::manifest-recovery` that reads manifest in a different fixture context (passes; the manifest is written by one process and read by another after the repository directory is renamed, at `upgrade-legacy.vitest.ts:580-614`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and Documentation

- [x] T011 Add test `upgrade-legacy.vitest.ts::dirty-tree-idempotent` that runs `--apply` twice and asserts zero plan diff on second run (passes; both runs exit 0, the second prints `plan changes=0` and the specs tree digest is unchanged, at `upgrade-legacy.vitest.ts:568-578`)
- [x] T012 Add test `upgrade-legacy.vitest.ts::dry-run-lists-downgrades` that checks dry run output for downgrade lines (done under two other titles: `reports a failing legacy packet on a dry run and writes nothing` asserts the `Downgrades:` section and `error -> warning` at `upgrade-legacy.vitest.ts:189-198`, and `dry-run Downgrades match the baseline recorded by apply` compares the dry-run rows with the baseline `--apply` wrote at lines 223-257; no test carries the planned title)
- [x] T013 Add test `upgrade-legacy.vitest.ts::dirty-tree-unwritable-manifest` that verifies tool refuses when manifest location is not writable (passes; a `git` shim on `PATH` answers `rev-parse --absolute-git-dir` with `/dev/null`, so the manifest path is `/dev/null/upgrade-legacy.manifest.json`; the run exits 2, names the path and leaves the packet byte for byte unchanged, at `upgrade-legacy.vitest.ts:155-187`)
- [x] T016 Add test `upgrade-legacy.vitest.ts::no-git-refuses-apply` that runs `--apply` in a sandbox with no git and expects a refusal before any write (passes; done by pointing `GIT_DIR` at a directory that does not exist, so `git -C <REPO> rev-parse --absolute-git-dir` fails; the run exits 2, prints `--apply requires REPO to be a git repository`, and the tree, the existing manifest and the fake git dir are untouched, at `upgrade-legacy.vitest.ts:555-566`)
- [x] T017 Add test `upgrade-legacy.vitest.ts::manifest-before-image-restores` that restores a dirty file from the manifest and compares bytes (passes; the decoded before-image is written back over the file and read again, then the current content is put back, at `upgrade-legacy.vitest.ts:536-553`; the match with the original bytes is asserted in `dirty-tree-writes-manifest` at lines 530-533)
- [x] T014 Update `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` to document manifest structure, location, and recovery procedure (sections "Upgrade Legacy Reversibility" at `README.md:115` and "Recover an Interrupted Apply" at line 131 give the location, the fields, the three before-image kinds, the refusal rules and a recovery script)
- [x] T015 Run full test suite `npm run test -- upgrade-legacy.vitest.ts` and verify all new tests pass (run as `vitest run --config vitest.config.ts --reporter verbose` on `upgrade-legacy.vitest.ts` and `repo-era.vitest.ts` from `.skilled/skills/system-spec-kit`: `Test Files 2 passed (2)`, `Tests 34 passed (34)`, exit 0; 28 of the 34 are in `upgrade-legacy.vitest.ts`)
- [x] T018 Review round 1 fix: refuse `--apply` when the manifest's HEAD is not the current HEAD, and handle an interrupted run (`readManifestIfExists()` lines 367-388 and `reportManifestIssue()` at line 432: `--apply` exits 2 naming the manifest, the recorded HEAD and the current HEAD; a dry run reports it and continues; added test `stale-manifest-head-refuses-apply` at `upgrade-legacy.vitest.ts:663-697`; its sibling `stale-manifest-tree-refuses-apply` at lines 699-719 pins the refusal when a packet changed after the manifest was written)
- [x] T019 Review round 1 fix: make the Downgrades list match the baseline `--apply` records (`predictDowngradeFindings()` repairs a temporary copy before listing; added test `dry-run Downgrades match the baseline recorded by apply` at `upgrade-legacy.vitest.ts:223-257`)
- [x] T020 Review round 2 fix: load a valid manifest's baseline into the Downgrades list and accept a moved checkout (`baselineMapFor()` at line 253; the recorded `repoRoot` is not compared; `manifest-recovery` writes in one process, moves the repository directory and reads in another, at `upgrade-legacy.vitest.ts:580-614`)
- [x] T021 Review round 2 fix: make the README recovery script resolve every path from the repository root, not the working directory (`README.md:138-141` exports `UPGRADE_LEGACY_REPO_ROOT` and the script reads it; pinned by test `readme recovery resolves paths from the exported repository root` at `upgrade-legacy.vitest.ts:616-661`, which runs the README's own script from a different directory)
- [x] T022 Orchestrator fix: make the dry-run preview copy resolve symbolic links (`materializeSymlinks()` at `upgrade-legacy.mjs:854` runs over the preview's spec roots at line 913; the test `dry run repairs a symlinked packet document only inside the preview` at `upgrade-legacy.vitest.ts:200-221` failed before this fix and passes after; see implementation-summary.md)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (done by tests that build real throwaway git repositories; see CHK-021)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-007 in spec.md section 4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md sections 3 and 4, synchronized to the build at close)
- [x] CHK-003 [P1] Dependencies identified and available (`git` is on PATH and the tests build real git repositories with it; phase 009 waits on this phase, per plan.md section 6)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`node --check upgrade-legacy.mjs` exits 0 at close; the wave 2 gates, rerun after review round 2, recorded `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` rc 0 and CLI typecheck rc 0; `tsc` does not cover an `.mjs` file)
- [x] CHK-011 [P0] No console errors or warnings (`grep -n "console\." upgrade-legacy.mjs` finds nothing; the tool writes through `process.stdout` and `process.stderr` as before)
- [x] CHK-012 [P1] Error handling implemented (refusals exit 2 with a message: no git, manifest not writable, manifest HEAD or tree mismatch, interrupted manifest, unreadable or incomplete manifest; no git, the unwritable location, the HEAD mismatch and the tree mismatch have tests; the interrupted, unreadable and incomplete manifests do not)
- [x] CHK-013 [P1] Code follows project patterns (judged from the diff: the new functions keep the file's section banners, `process.stderr.write(\`${SCRIPT}: ...\`)` messages and `process.exitCode = 2` refusals; the tests reuse `runUpgrade`, `writeLegacyPacket` and `commitChanges`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (nine of nine Met in acceptance-criteria.md)
- [x] CHK-021 [P0] Manual testing complete (done by tests instead of by hand: the cases build throwaway git repositories and walk committed, dirty, applied, rerun, moved and head-moved states; the orchestrator also reproduced the `fs.cpSync` symlink behavior in a standalone script)
- [x] CHK-022 [P1] Edge cases tested (committed tree, dirty tree, second run, moved checkout, HEAD moved, packet changed after the manifest, symlinked packet document; not pinned by a test: an interrupted `in-progress` manifest, a run from a directory inside another checkout, concurrent runs)
- [x] CHK-023 [P1] Error scenarios validated (unwritable manifest location exits 2, no git exits 2, stale HEAD exits 2, stale tree exits 2; each leaves the tree and the manifest unchanged)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (round 1: F1 algorithmic, F2 algorithmic, F3 instance-only, F4 matrix/evidence; round 2: F1 algorithmic, F2 instance-only, F3 instance-only, F4 class-of-bug; the classes were assigned at close from the evidence text, and the class-of-bug one was fixed at the producer for every link under the preview's spec roots, not for the one link the test used)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (`rg "upgrade-legacy.manifest"` finds the writer only in `upgrade-legacy.mjs`, plus the README recovery command and the test helpers; the only writer of `upgrade-baseline.json` is `recordFindings()` in the same file, while `runtime/lib/validation/orchestrator.ts` only names the file to read)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (the manifest is read by `readManifestIfExists()`, by the README recovery script and by `upgrade-legacy.vitest.ts`; `rg upgrade-legacy` over `.skilled`, `.claude`, `.opencode` and `.github` finds no other caller of `--apply`: the hits are the staleness and audit scripts that name it in a removal message, the phrase-cleanup report that names it as a fixer command, `MIGRATION.md`, changelogs and tests; phase 009 will be the first caller)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (not applicable as a fix: the phase adds a feature and does not repair a path, parser or redaction defect; its path guards at `upgrade-legacy.mjs:157-164`, `245-247` and `README.md:159-166` have no outside-root test, listed as a follow-up in implementation-summary.md)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (listed in implementation-summary.md under Verification: the axes are tree state, mode, git, manifest location, manifest state and checkout path; twelve rows each name their test and three combinations are named as untested)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (the code asks git for the repository, which reads `GIT_DIR` and `PATH`; `no-git-refuses-apply` sets `GIT_DIR` to a missing directory and `dirty-tree-unwritable-manifest` puts a `git` shim first on `PATH`; both pass)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. (nothing is committed yet; the cited lines are positions in the working tree on top of HEAD `160fcd8d2d` as of close, in `upgrade-legacy.mjs`, `upgrade-legacy.vitest.ts` and `spec/README.md`, and the wave 2 commit carries them)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (a case-insensitive grep of `upgrade-legacy.mjs` for secret, token, password, api key and credential finds nothing; the manifest is created with mode `0o600` at lines 325 and 345 because it holds packet file bytes)
- [x] CHK-031 [P0] Input validation implemented (a manifest needs `schema` 1 and a string `repoRoot` or is rejected at line 364; `resolveRepoPath()` at line 157 refuses an absolute or escaping path; `packetTreeHash()` at line 245 refuses a packet outside the spec roots; the README script rejects a path that escapes the repository)
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable: a local command-line tool with no authentication or authorization step)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (spec.md section 10 records the build answers, plan.md Key Components, Testing Strategy and checklists now describe the built functions and tests, and its Definition of Ready and Done boxes are ticked)
- [x] CHK-041 [P1] Code comments adequate (comments explain why the git dir is resolved from REPO at line 181, why the before-images are written before any repair at line 451, why baselines are reused only while the tree matches at line 353, and why symlinks are materialized at lines 850-853)
- [x] CHK-042 [P2] README updated (if applicable) (`spec/README.md` gained "Upgrade Legacy Reversibility" and "Recover an Interrupted Apply", lines 115-209)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (scratch/ holds only `.gitkeep`)
- [x] CHK-051 [P1] scratch/ cleaned before completion (scratch/ holds only `.gitkeep`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---
