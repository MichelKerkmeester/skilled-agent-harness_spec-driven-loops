---
title: "Implementation Summary"
description: "Phase 10: upgrade-reversibility is complete. upgrade-legacy --apply refuses without git, writes a before-image manifest before its first change on a dirty tree, and its dry run lists every finding the baseline will downgrade."
trigger_phrases:
  - "upgrade reversibility implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility"
    last_updated_at: "2026-10-08T13:00:36Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, reviewed in two rounds and verified the phase"
    next_safe_action: "Commit with wave 2"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-upgrade-reversibility |
| **Status** | Complete |
| **Completed** | 2026-10-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is **complete**. Built in wave 2 by GPT-6 Luna, reviewed in two rounds by DeepSeek V4.1 Flash (logged DSL), and verified by the orchestrator, who also made one code fix after the review rounds ran out. `upgrade-legacy --apply` can now be undone: it refuses a repository without git, and on a dirty tree it writes a manifest of before-images before it changes anything. The dry run lists each finding a baseline will downgrade, and a second run on the same tree reports no planned changes.

### Phase 10: upgrade-reversibility

- **No git, no apply.** `readRepositoryState()` runs `git -C <REPO> rev-parse --absolute-git-dir`. When that fails, `--apply` exits 2 with `--apply requires REPO to be a git repository` before it reads a packet (`upgrade-legacy.mjs:182-189`, `upgrade-legacy.mjs:1015-1022`). REPO comes from the script's own location, so the current directory cannot pick another worktree.
- **A manifest before the first change.** When the tree is dirty and at least one packet fails, `prepareManifest()` writes `<git-dir>/upgrade-legacy.manifest.json` with mode `0o600` before `repairPackets()` runs (`upgrade-legacy.mjs:1083-1094`). If it cannot be written, the run prints the path and `no packet changes were made`, and exits 2. A clean committed tree gets no manifest.
- **What the manifest holds.** `schema`, `repoRoot`, `headSha`, `recordedAt`, `status`, `baselineMap`, `recordedBaselineMap`, `scopeHashes` and `beforeImages`. It starts as `in-progress` and becomes `complete` when the repairs and baseline writes finish. A before-image is the file bytes as base64 with the file mode, `absent` for a missing path, or a symlink target. Only dirty files inside the failing packets are saved.
- **Stale manifests are refused, not overwritten.** `readManifestIfExists()` trusts a manifest only while its `headSha` equals HEAD, its status is `complete` and every packet-tree hash still matches. Otherwise `--apply` exits 2, naming the manifest, the recorded HEAD and the current HEAD, and the dry run reports the same and carries on (`upgrade-legacy.mjs:354-449`).
- **A dry run that shows the downgrades.** `predictDowngradeFindings()` repairs a temporary copy of the failing packets and `printDowngrades()` prints one `<packet> | <rule> | error -> warning` row per remaining finding, which is what `--apply` records. When a valid manifest exists, its recorded baselines supply the list instead, even after the repository directory has moved (`upgrade-legacy.mjs:489`, `upgrade-legacy.mjs:925`).
- **A preview that cannot write into the real tree.** `materializeSymlinks()` replaces each link under the preview copy's spec roots with a copy of its target (`upgrade-legacy.mjs:854`, `upgrade-legacy.mjs:913`). See the orchestrator's fix below.
- **README.** `spec/README.md` gained "Upgrade Legacy Reversibility" and "Recover an Interrupted Apply", with the location, the fields, the three before-image kinds, the refusal rules and a restore script that takes the repository root from `UPGRADE_LEGACY_REPO_ROOT` (`README.md:115-209`).
- **Tests.** `upgrade-legacy.vitest.ts` holds 28 cases, and 12 of them exercise this phase (matrix below, with the README case under it).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Git refusal, manifest write and read, stale-manifest refusal, Downgrades section, symlink-safe preview |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | Cases for every reversibility path |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | Reversibility semantics, manifest structure and the recovery script |

The two code files also carry other phases' changes (the era report in the dry run and the phrase case from earlier phases), so a diff of them is wider than this phase.

### The Symlink Defect and the Orchestrator's Fix

Round 2 finding F4 said the dry-run preview wrote through symbolic links into the real tree. Luna's fix passed in its own sandbox but failed in the orchestrator's environment: the dry run still wrote into the link's target. The root cause is that Node v26.8.2 `fs.cpSync` with `{ recursive: true, dereference: true }` keeps nested symlinks as links, which the orchestrator reproduced in a standalone script. The preview copied packets that way, so a linked `spec.md` reached the preview as a link and the repair steps wrote through it.

The orchestrator wrote `materializeSymlinks()` and called it over the preview's `specs` and `.opencode/specs` roots. It replaces every link with a copy of its target, so the preview can only write inside itself. The orchestrator edited the code because the two review rounds the goal allows were used up and the builder's sandbox could not observe the failure. The case `dry run repairs a symlinked packet document only inside the preview` failed before the fix and passes after it.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Per the goal, wave 2 built the phase with GPT-6 Luna through cli-codex and DeepSeek V4.1 Flash max reviewed it read-only through cli-pi on the LLM Gateway route; both allowed rounds were used. The build reported 27 passed; after round 1 the two phase files reported 31 passed, and after round 2 and the orchestrator's fix, 34.

### Review

**Round 1: four findings, all applied.**

| Finding | Severity | What it found | Fix |
|---------|----------|---------------|-----|
| F1 | P1 | A manifest recorded at another HEAD was silently overwritten, against NFR-R02, the edge case "report the tree mismatch and refuse" and the plan's "never silently overwrites" | `--apply` now refuses with exit 2, naming the manifest, the recorded HEAD and the current HEAD; test `stale-manifest-head-refuses-apply` |
| F2 | P1 | Downgrades listed errors that the repair steps clear | The list now matches the baseline `--apply` records, by repairing a temporary copy first; test `dry-run Downgrades match the baseline recorded by apply` compares the two |
| F3 | P2 | A manifest left in progress blocked every later run with no way out | The dry run reports it and runs, `--apply` refuses with instructions, and the README gained the recovery procedure |
| F4 | P1 | The tests that AC-002 and AC-006 name did not exist | Added `dirty-tree-unwritable-manifest` and `manifest-recovery`, plus a head-moved test |

**Round 2 (final): four findings, all applied.**

| Finding | Severity | What it found | Fix |
|---------|----------|---------------|-----|
| F1 | P1 | The manifest's baseline was never restored (REQ-005, AC-006) | A valid manifest's recorded baseline is loaded and drives Downgrades; `manifest-recovery` was reworked to write in one process and read in another |
| F2 | P2 | A path mismatch on `repoRoot` rejected a moved checkout | The manifest is trusted when the recorded tree state matches; a moved-path case now runs inside `manifest-recovery` |
| F3 | P2 | The README recovery script resolved paths against the working directory | It now reads the repository root from `UPGRADE_LEGACY_REPO_ROOT`; test `readme recovery resolves paths from the exported repository root` runs it from another directory |
| F4 | P2 | The dry-run preview wrote through symbolic links | Luna's fix failed outside its sandbox; the orchestrator's `materializeSymlinks()` fixed it (section above) |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One manifest per worktree at `<git-dir>/upgrade-legacy.manifest.json`, `<git-dir>` from `git -C <REPO> rev-parse --absolute-git-dir` (operator, 2026-10-08) | Each worktree's files are its own, and resolving from REPO keeps a run from another directory from writing beside the wrong tree. Built as decided |
| `--apply` refuses without git (operator, 2026-10-08) | Neither a committed tree nor a manifest home exists there. Built as decided |
| The manifest stores the file bytes, not a blob id (operator allowed either on 2026-10-08) | HEAD plus a list of dirty paths cannot restore uncommitted edits, and bytes in the manifest restore without any git object. The file never calls `git hash-object` |
| The manifest is written only when the tree is dirty and a packet fails | Nothing else will be touched, and a clean committed tree is already restorable with git |
| Trust a manifest by HEAD and per-packet tree hashes, not by `repoRoot` | A moved or copied checkout with the same state is still the same tree, and the spec's edge cases say to trust a matching tree |

### Deviations

1. **No `isCommittedTree()` or `writeManifest()`.** `readRepositoryState()`, `prepareManifest()`, `completeManifest()` and `writeManifestFile()` do that work under other names. The manifest is written in two steps so an interrupted run leaves an `in-progress` record.
2. **No fixture directories (T004, T005).** The cases build their trees in a throwaway git repository the test file creates.
3. **No test titled `dry-run-lists-downgrades`.** Two cases under other titles carry it: `reports a failing legacy packet on a dry run and writes nothing` and `dry-run Downgrades match the baseline recorded by apply`.
4. **`no-git-refuses-apply` points `GIT_DIR` at a missing directory** instead of running in a sandbox with no git, which makes `git -C <REPO> rev-parse --absolute-git-dir` fail the same way.
5. **The tool loads the manifest's baselines and does not copy before-images back.** REQ-005 and SC-003 speak of restoring the baseline; the build reads that as loading the recorded baseline map for the run. Restoring dirty files is the README script, which a test runs.
6. **The orchestrator edited code** (`materializeSymlinks()`), which a leaf builder would not. The reason is under "The Symlink Defect and the Orchestrator's Fix".
7. **The spec's "tree SHA matches" became per-packet tree hashes** (`scopeHashes`), plus the HEAD SHA.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Test matrix

Axes: tree state (committed, dirty), mode (dry run, apply), git (present, absent), manifest location (writable, not), manifest state (none, complete and matching, HEAD moved, packet changed, interrupted) and checkout path (same, moved). Twelve rows are tested; three combinations are not.

| # | Scenario | Test | AC |
|---|----------|------|----|
| 1 | Committed tree, apply: exit 0, no manifest | `dirty-tree-writes-manifest` (first half) | AC-007 |
| 2 | Dirty tree, apply: manifest with before-image bytes written before the repair | `dirty-tree-writes-manifest` | AC-001, AC-003 |
| 3 | Before-image bytes written back over the file | `manifest-before-image-restores` | AC-003 |
| 4 | No git, apply: exit 2 before any write | `no-git-refuses-apply` | AC-009 |
| 5 | Manifest location not writable, apply: exit 2, tree unchanged | `dirty-tree-unwritable-manifest` | AC-002 |
| 6 | Second apply: `plan changes=0`, tree unchanged | `dirty-tree-idempotent` | AC-005 |
| 7 | Dry run: `Downgrades:` section with `error -> warning` rows, nothing written | `reports a failing legacy packet on a dry run and writes nothing` | AC-004 |
| 8 | Dry-run rows equal what apply records; cleared errors are not listed | `dry-run Downgrades match the baseline recorded by apply` | AC-004 |
| 9 | Manifest written in one process, read in another after the directory moved | `manifest-recovery` | AC-006 |
| 10 | HEAD moved: apply refuses, dry run continues | `stale-manifest-head-refuses-apply` | AC-006 |
| 11 | Packet changed after the manifest: apply refuses | `stale-manifest-tree-refuses-apply` | AC-006 |
| 12 | Symlinked packet document: the dry run leaves the real target alone | `dry run repairs a symlinked packet document only inside the preview` | AC-004 |

The README restore script is run by `readme recovery resolves paths from the exported repository root`, which backs AC-008. Not tested: an interrupted `in-progress` manifest, a run from a directory inside another checkout, and concurrent runs.

### Checks

| Check | Result |
|-------|--------|
| `vitest run --config vitest.config.ts --reporter verbose` on `upgrade-legacy.vitest.ts` and `repo-era.vitest.ts` from `.skilled/skills/system-spec-kit`, rerun at close | `Test Files 2 passed (2)`, `Tests 34 passed (34)`, exit 0; 28 of the 34 are in `upgrade-legacy.vitest.ts` |
| Symlink case before and after the orchestrator's fix | Failed before, passes after (build note); passes in the close rerun |
| `node --check upgrade-legacy.mjs` | Exit 0 |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`, wave 2 gate | rc 0 on the final state; 167 files passed and 3 skipped (170); 1685 tests passed and 19 skipped (1704); legacy 12 passed and 0 failed, 2 and 0, validation 12 and 0; wave 1 final was 162 files and 1648 tests, baseline 161 files and 1639 |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check`, wave 2 gate | rc 0 |
| CLI typecheck, wave 2 gate | rc 0 |
| `node --test runtime/tests/hooks/*.test.mjs`, wave 2 gate | 184 tests, 181 pass, 0 fail |
| `validate.sh --strict` on this folder | `RESULT: PASSED`, Errors 0, Warnings 0; `AC_COVERAGE` 9/9 and `AC_CLOSURE` closeable |
| `check-goal.cjs` on this folder | `RESULT: PASSED (5/5 checks)` |

The wave 2 whole-tree gates were first taken after 010's round 1 fixes, then rerun after round 2 and the symlink fix: the CLI suite rc 0 with 1685 tests passed and 0 failed, `run check` rc 0, the typecheck rc 0 and the hook tests 184 run with 0 failed.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations and Follow-ups

1. **The `in-progress` manifest path has no test.** Its refusal and the README recovery steps exist (`upgrade-legacy.mjs:378-388`, `README.md:129-209`), but no case interrupts a run.
2. **The manifest path guards have no outside-root test.** `resolveRepoPath()` (`upgrade-legacy.mjs:157-164`), `packetTreeHash()` (`upgrade-legacy.mjs:245-247`) and the README script reject a path that escapes the repository, and no case feeds them one.
3. **No test runs the command from a directory inside another checkout.** The code resolves the git directory from REPO, and the cases always run from the sandbox that is REPO.
4. **Restoring dirty files is a documented script, not a command.** `--apply` loads the manifest's baselines and never copies before-images back.
5. **Run on throwaway repositories only.** The cases use repositories they create. The command was not run against this checkout's real tree.
6. **The symlink defect was seen on Node v26.8.2.** The standalone reproduction and the cases ran on that version only, so the behavior on older Node versions is not known.
7. **Whole-tree gates rerun.** Done after round 2 and the symlink fix; CI on the wave 2 push is the remaining outside check.
8. **Changelog.** The phase context asks for a refresh of the matching file in `../changelog/` at close. No `changelog/` folder exists under the parent or the track, so there was nothing to refresh.
<!-- /ANCHOR:limitations -->

---
