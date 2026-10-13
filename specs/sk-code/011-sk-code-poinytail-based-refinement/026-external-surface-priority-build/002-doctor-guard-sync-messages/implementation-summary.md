---
title: "Implementation Summary: Doctor guard and sync messages"
description: "The doctor's 3c line and route repair string, the guard's drift line and sync's missing-source stop now name their fix, and a missing authored manifest fails the guard; built on cli-pi DeepSeek, reviewed in five iterations, with the ledger rerun on the final commit."
trigger_phrases:
  - "doctor guard and sync messages implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/002-doctor-guard-sync-messages"
    last_updated_at: "2026-10-13T07:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, reviewed and closed the phase"
    next_safe_action: "Operator merges the branch to main"
    blockers: []
    key_files:
      - ".skilled/bin/compiled-route-sync.cjs"
      - ".skilled/bin/compiled-route-guard.cjs"
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/commands/doctor/assets/doctor-update-apply.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-026-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Doctor guard and sync messages

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-doctor-guard-sync-messages |
| **Status** | Complete |
| **Completed** | 2026-10-13 |
| **Level** | 2 |
| **Branch** | `worktrees/127-surface-messages`, from origin/main `4b9bf840b0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every message a user meets on the removal path now names the next action, and a missing authored compiled-routing closure fails loudly instead of passing.

- The doctor's 3c line for a missing packet directory adds: if this surface packet was removed on purpose, finish the removal with the README.md block "What Adapting `sk-code` Looks Like".
- The doctor's `compiled_routes` repair string adds the copy-back: after the refresh, copy the runtime activation manifest over its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/<hub>/manifest.json`, or commit with the hooks installed, then rerun the guard.
- The guard prints, under its authored-drift line, `<hub>: copy <runtime manifest> over <authored twin>, or commit with the hooks installed so the pre-commit gate copies it`.
- A missing authored manifest is the guard failure `authored-missing`, printed as `<hub>: restore <path>`, and the guard exits 1. A missing runtime manifest is still reported once, by the freshness check.
- Sync's build and `--check` modes stop first with `SYNC FAILED: authored compiled-routing source is missing; restore specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program`, exit 1, no stack. `SPECS_ROOT` resolves through realpath only when `specs/` exists.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/compiled-route-sync.cjs` | Modified | Authored-root check before any `lstat` |
| `.skilled/bin/compiled-route-guard.cjs` | Modified | Drift line names both paths and the copy; `authored-missing` failure |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | 3c pointer |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml` | Modified | `compiled_routes` repair string |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | Modified | T2, T3, T4 |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modified | T1 |
| `.skilled/bin/README.md` | Modified | Catalog lines for the new failure and the sync stop (review finding R3-P2-001) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Commits on `worktrees/127-surface-messages`: `36cef9db0a` sync, `ed10d1f294` guard, `f9eb84c4fe` doctor line and repair string, `015d7ea3d0` review fixes, then the closeout commit with these docs and the review packet.

Every edit outside this folder was made by DeepSeek V4.1 Flash through cli-pi (`llmgateway/deepseek-v4.1-flash`, `--thinking max`), six dispatches, each one change with literal text. Devin's daily quota was still exhausted (`resource_exhausted` on a probe), which is the fallback C2 names. Each diff was read against the brief and each check rerun by the orchestrator.

A five-iteration `/deep:review :auto` then ran over `4b9bf840b0..f9eb84c4fe` on the same executor. It found no P0 or P1 and eight P2: five fixed in `015d7ea3d0`, three rejected. The reducer recorded two search-debt items, so the report's verdict is CONDITIONAL; both were closed by observed runs after synthesis. Artifacts are in `review/`.

### Acceptance Ledger

Copy rows ran under the session scratchpad in copies built from the final commit (`.skilled` without `node_modules`, each `node_modules` linked read-only, `specs/sk-doc/z_archive/019-skill-routing-refactor/`, `README.md`, `PUBLIC-RELEASE.md`, `.github`, `.opencode`), with a `pwd` check after each `cd`. The control copy printed sync `all 55 served copies match`, guard `All hubs fresh or excused` and doctor OK, each exit 0.

| ID | Result | Evidence |
|----|--------|----------|
| P9-1 | Pass | `rm -rf .skilled/skills/sk-code/sk-code-webflow; node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` exit 1, printing ``FAIL: 3c: mode "sk-code-webflow" packet "sk-code-webflow" is not an existing sub-directory; if this surface packet was removed on purpose, finish the removal with the README.md block "What Adapting `sk-code` Looks Like"`` |
| P9-2 | Pass | After the `tieBreak` reorder to `[quality, review, webflow, obsidian, opencode]`, `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` exit 0, then `node .skilled/bin/compiled-route-guard.cjs` exit 1, printing `sk-code: copy .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json over specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json, or commit with the hooks installed so the pre-commit gate copies it` |
| P9-3 | Pass | Same copy, the repair string applied verbatim for `<hub>` = sk-code: `cp .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`, then `node .skilled/bin/compiled-route-guard.cjs` exit 0 (`All hubs fresh or excused`) and `node .skilled/bin/compiled-route-sync.cjs --check` exit 0 (`all 55 served copies match their authored files`) |
| P9-4 | Pass | `node .skilled/bin/compiled-route-sync.cjs --check` in the copy with no `specs/` and in the copy with `specs/` but no 019 folder: exit 1 both times, stderr one line `SYNC FAILED: authored compiled-routing source is missing; restore specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program`, 0 stack frames. A dangling `specs` symlink prints the same line |
| P9-5 | Pass | `node .skilled/bin/compiled-route-guard.cjs` in the same two copies: exit 1 both times, printing `Authored manifest missing, so the runtime cannot be rebuilt from source:` for all seven hubs and `sk-code: restore specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` |
| P9-6 | Pass | In the 019-only copy, `node .skilled/bin/compiled-route-sync.cjs --check` exit 0 (`all 55 served copies match their authored files`) and `node .skilled/bin/compiled-route-guard.cjs` exit 0 (`All hubs fresh or excused`) |
| P9-7 | Pass | In the worktree, `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` 98 of 98, `bash .skilled/commands/doctor/scripts/tests/run-all.sh` `7 suite(s) passed, 0 failed`, `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs` 46 of 46, each exit 0 |

Each test was run alone with `--test-name-pattern`, before against the pre-phase source (the source diff reversed in place, then restored) and after against the final source.

| ID | Test | Before | After |
|----|------|--------|-------|
| T1 | 3c names the README adaptation block when a packet directory is missing | before: exit 1 | after: exit 0 |
| T2 | guard authored-drift names the runtime manifest, its authored twin and the copy | before: exit 1 | after: exit 0 |
| T3 | sync --check names the authored folder to restore when it is missing, with no stack | before: exit 1 | after: exit 0 |
| T4 | guard reports a missing authored manifest by path instead of passing | before: exit 1 | after: exit 0 |

### Review Findings

| ID | Severity | Disposition | Proof or reason |
|----|----------|-------------|-----------------|
| RV-1 | P2 | Fixed | R1-P2-001, build-path check untested: the sync test also runs the no-argument build; with that `requireAuthoredRoot()` removed the test exits 1 |
| RV-2 | P2 | Rejected | R1-P2-002, twin derived from the runtime layout: the runtime closure mirrors the authored one by relative path by design; `sync --check` compares `path.join(runtimeRoot, rel)` and the pre-commit gate derives the twin the same way |
| RV-3 | P2 | Rejected | R2-P2-001, literal path in the repair string: goal D2 requires it and goal criterion 2 greps for it |
| RV-4 | P2 | Fixed | R3-P2-001, bin README out of date: prose and both table rows describe the new failure and the sync stop |
| RV-5 | P2 | Rejected | R3-P2-002, tests pin the helper record: D5 asks one test per change; P9-2 and P9-5 show the printed lines; a render function only for tests adds an abstraction nothing asks for |
| RV-6 | P2 | Fixed | R4-P2-001, guard header said two divergences: it lists three |
| RV-7 | P2 | Fixed | R4-P2-002, tests reused the guard's formula: both place the twin by a literal suffix; T2 and T4 still fail before (exit 1) and pass after (exit 0) |
| RV-8 | P2 | Fixed | R5-P2-001, copy-back bound to stale hubs only: it applies to each refreshed hub and each hub reported as differing; P9-3 reran it |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The guard derives the authored twin from the runtime manifest's relative path | The old `activationRootFor(AUTHORED_ROOT)` throws when the authored tree is gone, so it could not name the file to restore; the pre-commit gate already derives it this way |
| The sync check lives in `main()` for build and `--check` only | `--verify`, `--finalize` and `--revert` never read the authored tree, and a check at module load would exit any process that only `require`s sync |
| `authoredDrift` takes optional roots and is exported | The tests need a sandboxed authored root; `check({ sourceRoot, runtimeRoot })` in sync uses the same pattern |
| No skill release and no changelog file | D6: the doctor command and `.skilled/bin` belong to no skill changelog, and 026 has no `changelog/` folder; phase 005 writes the release note |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline at `4b9bf840b0` | Invariants 97 of 97, `run-all.sh` 7 suites, compiled-route-manifest 43 of 43; guard, sync `--check`, sk-code doctor exit 0 |
| Final state | Invariants 98 of 98, `run-all.sh` 7 suites, compiled-route-manifest 46 of 46; guard, sync `--check`, sk-code doctor exit 0 |
| Other guard consumers | `typo-flags.test.cjs` 10 of 10; `check-no-spec-imports.cjs` exit 0; the pre-commit gate reads only `HUBS`, which is unchanged |
| `/deep:review :auto`, 5 iterations | CONDITIONAL from two search-debt items closed afterwards; 0 P0, 0 P1, 8 P2, 5 fixed and 3 rejected. See `review/review-report.md` |
| `validate.sh --strict` and the goal criteria | Rerun at closeout; results in the orchestrator's report |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **pi needs `--no-extensions` here.** The tracked `.pi/extensions/pi-fast-mode-w-subagent-support` and the operator's global copy register the same `--fast` flag, so `pi` refuses to start in this repository. Every builder dispatch and review iteration added `--no-extensions`; the review workflow's cli-pi command builder does not, which is worth fixing where `buildPiLineageCommand` builds its arguments.
2. **An unreadable authored manifest still prints a stack.** With the file at mode 000 the guard exits 1 with `EACCES`. It fails closed, and the read is the one the pre-phase guard already made, so this phase left it alone.
<!-- /ANCHOR:limitations -->
