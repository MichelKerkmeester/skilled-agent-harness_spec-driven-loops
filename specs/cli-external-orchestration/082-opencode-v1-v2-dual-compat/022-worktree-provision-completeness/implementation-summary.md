---
title: "Implementation Summary"
description: "A fresh worktree now installs every tracked package tree instead of a subset: the manifest names fourteen trees, a test compares it with every tracked package.json, and provisioning reports lockfile drift and a missing manifest instead of failing bare or skipping in silence."
trigger_phrases:
  - "worktree provision completeness implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/022-worktree-provision-completeness"
    last_updated_at: "2026-10-20T08:20:00Z"
    last_updated_by: "spec-doc-writer"
    recent_action: "Filled the phase records and the parent phase map rows"
    next_safe_action: "None; the folder validates strictly and every phase row is updated"
    blockers: []
    key_files:
      - ".skilled/skills/sk-git/scripts/worktree-naming.sh"
      - ".skilled/skills/sk-git/scripts/worktree-provision-paths.txt"
      - ".skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh"
      - "SECURITY.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-022-worktree-provision-completeness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-worktree-provision-completeness |
| **Completed** | 2026-10-20 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fresh worktree now installs every tracked package tree instead of a subset, so its own suites stop failing in ways that read as broken code. The provision list names fourteen trees, a test compares it with every tracked `package.json`, and provisioning reports lockfile drift and a missing manifest instead of failing bare or skipping in silence.

### Phase 22: worktree-provision-completeness

Five tracked package trees were missing from `worktree-provision-paths.txt`. Before the edit, a fresh worktree could not run three of the added trees' suites: the cache optimizer's suite failed, the fast-mode suite had no vitest, and the DESIGN.md generator backend had 1 failed test. The fix adds `.pi/extensions/pi-cache-optimizer`, `.pi/extensions/pi-fast-mode-w-subagent-support` and `.skilled/skills/sk-design/sk-design-md-generator/backend  dist/cli.js`; the backend names `dist/cli.js`, the package's untracked `main`, because the existing build-output guard requires it. Two tracked trees stay out with a reason on an `# excluded:` line: the Code Mode server needs Node 24 for isolated-vm and its `INSTALL-GUIDE.md` owns that install, and the Obsidian MCP server declares no dependencies and runs through npx. The root `.` entry is gone because the root has had no `package.json` since commit e84663a8c5, so it installed nothing and would only raise the new warning. `SECURITY.md` line 95 now says "fourteen" and names `bun.lockb`.

The list now guards itself. `provision_list_gaps` in `worktree-naming.test.sh` compares `git ls-files` `package.json` files under `.skilled`, `.opencode` and `.pi` with the listed and excluded paths, printing `stale: <path>` for a listed or excluded path with no manifest and `unlisted: <path>` for a tracked tree in neither. One test checks the real list for gaps; a second copies it without the cache optimizer, appends a bogus `no/such/pkg`, and expects both findings.

`provision_worktree` tells the operator what went wrong. It captures installer output to a temporary log instead of discarding it and drops `--silent`, because npm's silent level hides the error lines, then prints up to four error lines on a failed install. When the failure is a frozen install whose lockfile disagrees with `package.json`, it prints `lockfile drift: package.json and its lockfile disagree; run npm install in <pkg> and commit the lockfile`. It reports rather than repairs, because a repair would rewrite a committed lockfile without review. A `bun.lockb` with no `package-lock.json` now selects bun, and a listed path with no `package.json` prints `WARNING: <pkg> is listed but has no package.json; skipped` on stderr while provisioning still exits 0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modified | `provision_worktree` logs installer output, prints up to four error lines, names lockfile drift, selects bun for `bun.lockb`, and warns on a missing manifest |
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | Modified | Fourteen entries with the three added trees, two recorded exclusions and no root `.` |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modified | `provision_list_gaps` with two tests, plus `bun.lockb`, drift and missing-manifest fixtures |
| `SECURITY.md` | Modified | Line 95 says fourteen trees and names `bun.lockb` |
| This folder's `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` | Modified | The phase records, filled from the scaffold |
| `../spec.md` | Modified | The phase 22 row and the 021-to-022 handoff row in the phase map |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix starts from rows 2, 3, 18, 27 and 29 of `../014-post-merge-deep-research/research/research.md` and findings F1, F2, F3, F4 and F7 of `../017-post-merge-research-provisioning/research/research.md`. The baseline run was captured first — `PASS=97 FAIL=0`, exit 0, on origin/main b0133e893a (`scratch/mutation/baseline.txt`) — then the new tests and list were run against the old script and old list, where 8 of the new tests failed with `PASS=101 FAIL=8`, exit 1 (`scratch/mutation/old-code-run.txt`); the completeness test listed `stale: .` and exactly the five unlisted trees. Against the new script and list the suite passes `PASS=109 FAIL=0`, exit 0 (`scratch/mutation/new-code-run.txt`).

The drift fixture uses a stub npm that fails `npm ci` with the in-sync error, and real npm 11.19.1 on Node 26.8.2 adds the real wording in `scratch/mutation/real-npm-drift.txt`. The end-to-end proof is a `git clone --no-hardlinks` provisioned with only Node 22.23.1 (CI's version) and bun 1.3.9 on `PATH`: `provision_worktree "$PWD"` reports 11 installed, 5 built, 3 already present, 0 failed, exit 0, in 43 s. Afterwards the cache optimizer passes 118 tests, the fast-mode extension 81 and the backend 176; `scratch/mutation/fresh-clone.txt`, produced by `scratch/mutation/fresh-clone.sh`, holds that run and the three suite results.

No CI job runs `worktree-naming.test.sh`. The OpenCode Dual-Version Battery runs `provision_worktree`, so the three added trees install there too and a failed install fails that job.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add the two Pi extensions and the DESIGN.md generator backend | Each tree's own suite is what a fresh worktree needs, and the backend names `dist/cli.js` because the existing build-output guard requires the package's untracked `main` (row 2) |
| Exclude the Code Mode server and the Obsidian MCP server on `# excluded:` lines | The Code Mode server needs Node 24 for isolated-vm and its `INSTALL-GUIDE.md` owns that install; the Obsidian server declares no dependencies and runs through npx, so provisioning them would install nothing useful (row 2) |
| Remove the root `.` entry | The root has had no `package.json` since commit e84663a8c5, so the entry installed nothing and would only raise the new warning (row 2) |
| Report lockfile drift instead of repairing it | A repair would rewrite a committed lockfile without review; the message names the package and the exact repair so an operator can review the rewrite (row 18) |
| Drop `--silent` and log installer output | npm's silent level hides the error lines a failure needs, and discarding the log left a bare `FAILED` with nothing to act on (row 18) |
| Treat `bun.lockb` like `bun.lock` | A binary lockfile pins the same bun install; falling to npm would write a second lockfile and ignore the committed one (row 27) |
| Warn, and keep exit 0, for a listed path with no manifest | The tree is stale, not broken, and the warning names it; failing the whole provision would hide the trees that did install (row 29) |
| Keep the completeness guard in the bash suite rather than CI | The naming suite is not run by a CI job, and adding one belongs to the CI files another group owns; the OpenCode Dual-Version Battery already exercises `provision_worktree` |
| Keep the error-line pipeline non-fatal under `set -e` | CI runs the suite under `set -euo pipefail`, so a failed install whose log held no `error` line made the pipeline return non-zero and ended the shell before the summary; `|| true` lets the failure reach its own message (row 18) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline before any edit | PASS: `worktree-naming tests: PASS=97 FAIL=0`, exit 0, on origin/main b0133e893a (`scratch/mutation/baseline.txt`) |
| New tests and list on the old code | FAIL as intended: `PASS=101 FAIL=8`, exit 1; the completeness test lists `stale: .` and exactly the five unlisted trees (`scratch/mutation/old-code-run.txt`) |
| New tests and list on the new code | PASS: `PASS=109 FAIL=0`, exit 0 (`scratch/mutation/new-code-run.txt`) |
| Silent install failure under `set -e` | PASS: with the `|| true` dropped the suite fails only "a silent install failure under set -e reaches the summary" (`PASS=108 FAIL=1`, exit 1, `scratch/mutation/no-pipefail-guard-run.txt`); the guarded suite passes 109 (`scratch/mutation/new-code-run.txt`) |
| Lockfile drift, real npm 11.19.1 on Node 26.8.2 | PASS: npm fails `npm ci` with the in-sync error, provisioning prints the drift message and exits 1 (`scratch/mutation/real-npm-drift.txt`) |
| `bun.lockb` fixture | PASS: the package installs with bun once and never reaches npm (`scratch/mutation/new-code-run.txt`) |
| Missing manifest fixture | PASS: the run prints `WARNING: <pkg> is listed but has no package.json; skipped` on stderr and exits 0 (`scratch/mutation/new-code-run.txt`); the real npm run shows the same warning beside a failing install (`scratch/mutation/real-npm-drift.txt`) |
| Completeness guard on the real list | PASS: no `stale:` or `unlisted:` line (`scratch/mutation/new-code-run.txt`) |
| Manifest and security note | PASS: 14 entries, two `# excluded:` reasons, no root `.`, and `SECURITY.md` line 95 says "fourteen" and names `bun.lockb` |
| Fresh clone with only the CI toolchain | PASS: 11 installed, 5 built, 3 already present, 0 failed, exit 0, 43 s (`scratch/mutation/fresh-clone.txt`, from `scratch/mutation/fresh-clone.sh`) |
| Added trees' suites after provisioning | PASS: cache optimizer 118 tests, fast-mode extension 81, backend 176 (`scratch/mutation/fresh-clone.txt`, from `scratch/mutation/fresh-clone.sh`) |
| Strict spec validation | PASS: RESULT: PASSED from `validate.sh --strict` on this folder (`scratch/validate-strict.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No CI job runs the naming suite.** `worktree-naming.test.sh` is a local suite, so the completeness guard does not run in CI. The OpenCode Dual-Version Battery runs `provision_worktree`, which surfaces an install failure in the three added trees, but a gap between the list and the tracked packages is caught only locally.
2. **Drift is reported, not repaired.** Provisioning names the package and the repair, `npm install` in `<pkg>` and commit the lockfile, but an operator must run it and review the rewritten lockfile.
3. **The Code Mode server is deliberately not provisioned.** It needs Node 24 for isolated-vm, so a fresh worktree still cannot run its server until its `INSTALL-GUIDE.md` install is followed under that Node version.
4. **The dual-version workflow comment still says "Packages that ship a bun.lock".** The comment is in CI files another group owns, so this phase leaves it unchanged even though provisioning now recognizes `bun.lockb` too.
<!-- /ANCHOR:limitations -->

---
