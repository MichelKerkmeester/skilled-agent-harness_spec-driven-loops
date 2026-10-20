---
title: "Implementation Summary"
description: "A plain run of `pi --offline --help` in the trusted main checkout no longer loses `--fast`: the copy claim now records which real package root claimed, so the user-scope copy and the project copy at one real path both register, while a worktree copy at another path still stands down. The comment above the claim now states Pi's real conflict model, and the README test counts come from the run that measured them."
trigger_phrases:
  - "pi fast mode trusted flag implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/021-pi-fast-mode-trusted-flag"
    last_updated_at: "2026-10-20T07:14:55Z"
    last_updated_by: "spec-doc-writer"
    recent_action: "Filled the phase records and the parent phase map rows"
    next_safe_action: "None; the folder validates strictly and every phase row is updated"
    blockers: []
    key_files:
      - ".pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts"
      - ".pi/extensions/pi-fast-mode-w-subagent-support/tests/extension.test.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-021-pi-fast-mode-trusted-flag"
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
| **Spec Folder** | 021-pi-fast-mode-trusted-flag |
| **Completed** | 2026-10-20 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`--fast` is back in the trusted main checkout. The claim that stops two copies of the extension from clashing forgot which copy had claimed, so the copy Pi loaded before trust silenced the copy it kept. The claim now compares real package roots, and a test proves two copies at one real path both register.

### Phase 21: pi-fast-mode-trusted-flag

In a plain run (no `-a`) of `pi --offline --help` in the trusted main checkout, `--fast` was missing. Pi's resource loader (`dist/core/resource-loader.js:560-570`) preloads the user-scope copy before the trust decision, and that copy claimed the package on the shared event bus. The trusted pass then loaded the project copy at the same real path, saw the claim and stood down — and Pi, which keys loaded extensions by real path, kept the project copy and dropped the user copy the flag had been registered on.

The research first suggested registering the flag before the claim gate. That fails: Pi reports a flag registered at two different real paths as a conflict (`resource-loader.js:584-590`, around `975-1007`), and print mode fails on it (`specs/system-deep-loop/040-cli-pi-worktree-extension-clash/spec.md:35`), so a worktree layout would exit 1 again. The fix instead records the claiming copy's real package root in the claim, using `realpathSync` and falling back to `path.resolve`. A copy stands down only when a copy at a different real root claimed first, so copies at one real root both register and Pi folds them, while a worktree copy beside a global link still stays silent.

The new test, "lets two copies at one real path both register", builds a real package directory and a symlink to it under a temporary root, loads both copies on one fake bus and expects each to register the `fast` flag. It failed on the old code with 1 failed, 12 passed and exit 1, and passes on the new code with 13 passed and exit 0. The comment above `claimPackage` now states Pi's real conflict model: every copy is keyed by real path, copies at one real path collapse, a flag from two real paths is a conflict that fails a print-mode run, and the pre-trust listeners stay subscribed. The extension suite passes 7 files and 81 tests, and the four README count places now say 81 instead of 80.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts` | Modified | `realRoot` resolves the package root, and `claimPackage` carries `claimedBy` so only a copy at a different real root stands down; the comment above it is corrected |
| `.pi/extensions/pi-fast-mode-w-subagent-support/tests/extension.test.ts` | Modified | Adds "lets two copies at one real path both register" over a real package and a symlink to it |
| `.pi/extensions/pi-fast-mode-w-subagent-support/README.md` | Modified | Test count to 81 and the copy-claim paragraph rewritten for the real-root rule |
| `.pi/extensions/pi-fast-mode-w-subagent-support/src/README.md` | Modified | Test count to 81 |
| `.pi/extensions/pi-fast-mode-w-subagent-support/tests/README.md` | Modified | Test counts to 81, and the `extension.test.ts` row now names the copy claim |
| This folder's `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` | Modified | The phase records, filled from the scaffold |
| `../spec.md` | Modified | The phase 21 row and the 020-to-021 handoff row in the phase map |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix starts from row 1 of `../014-post-merge-deep-research/research/research.md` and the loader lines the row cites. The baseline run was captured first — 7 files and 80 tests (`scratch/mutation/baseline-vitest.txt`) — then the new test was written and run against the old code, where it failed with 1 failed, 12 passed and exit 1 (`scratch/mutation/old-code-run.txt`); on the new code it passes 13 of 13 with exit 0 (`scratch/mutation/new-code-run.txt`). The full suite gives 7 files and 81 tests with `tsc --noEmit` exit 0. `scratch/probe/probe.sh` then ran the help probe with a temporary `PI_CODING_AGENT_DIR`, never `~/.pi`: the old code reported `--fast=0` in the primary plain run, and the new code reports `--fast=1` in all six runs across the primary and worktree layouts and the plain, `-a` and `-na` modes, with no conflicts and exit 0 (`scratch/probe/probe-4layout.txt`). The print-mode probe shows no "failed to load" and no conflict in either layout; its exit 1 is only because the temporary agent dir has no models configured (`scratch/probe/print-after.txt`). The README counts were set from that full run, in the four places row 19 named.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compare real package roots instead of registering the flag before the claim gate | Pi reports a flag registered at two different real paths as a conflict (`resource-loader.js:584-590`, around `975-1007`), and print mode fails on it, so the research's first suggestion would exit 1 in a worktree layout |
| Let copies at one real root both register | Pi keeps every copy keyed by real path and folds copies at one real path into one entry, so both registering is what the loader expects; only copies at different real roots conflict |
| Fall back to `path.resolve` when `realpathSync` throws | A path that cannot be resolved still gets a stable comparison value, so the claim does not throw during load |
| Record the pre-trust listener issue upstream and change nothing here | The listeners live in Pi 1.3.0's loader, outside this repo; the suggested fix, releasing the pre-trust bus subscriptions on `reload()`, is Pi's to make (row 21) |
| Set the README counts from a real run | Row 19 found the old count unverified; the run now measures 7 files and 81 tests |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline before any edit | PASS: 7 files passed, 80 tests passed, exit 0 (`scratch/mutation/baseline-vitest.txt`) |
| New test on the old code | FAIL as intended: 1 failed, 12 passed, exit 1 (`scratch/mutation/old-code-run.txt`) |
| New test on the new code | PASS: 13 passed, exit 0 (`scratch/mutation/new-code-run.txt`) |
| Full extension suite and type check | PASS: 7 files, 81 tests, and `tsc --noEmit` exit 0 (`scratch/mutation/after-full-run.txt`) |
| Help probe, six runs | PASS: new code `--fast=1` in the primary and worktree layouts × plain, `-a` and `-na`, no conflicts, exit 0; old code `--fast=0` in the primary plain run (`scratch/probe/probe-4layout.txt`) |
| Print-mode load, both layouts | PASS: no "failed to load" and no conflict; the exit 1 is only because the temporary agent dir has no models configured (`scratch/probe/print-after.txt`) |
| README counts | PASS: 7 files and 81 tests in `README.md` line 124, `src/README.md` line 78 and `tests/README.md` lines 21 and 53 |
| Strict spec validation | PASS: RESULT: PASSED from `validate.sh --strict` on this folder (`scratch/validate-strict.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pi's pre-trust listeners stay subscribed (row 21, upstream).** Pi 1.3.0's loader keeps the pre-trust listeners and bus subscriptions across the trusted load, so the earlier copy's claim survives the reload. This phase works with that behaviour rather than against it. The suggested upstream fix is to release the pre-trust bus subscriptions on `reload()`; it is outside this repo, so no repo change is claimed for it.
2. **A copy built before this change does not take part in the claim.** The claim now carries a root, so an older copy that only flips a boolean can still register beside a newer one until both copies carry the change. The READMEs state this.
3. **The help probe needs a configured agent dir to exit 0 in print mode.** With a temporary `PI_CODING_AGENT_DIR` and no models configured, a print-mode run exits 1 on the missing model, not on a load failure; both layouts show no conflict and no "failed to load" (`scratch/probe/print-after.txt`).
<!-- /ANCHOR:limitations -->

---
