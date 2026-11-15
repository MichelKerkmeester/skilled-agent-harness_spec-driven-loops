---
title: "Implementation Summary"
description: "Phase 13 fixed the two P1 Vibe guard defects and the confirmed P2 findings, each behavior fix carrying a test that failed before it. The hook and dispatch suites pass, the fan-out suite passes, and the packet validates clean."
trigger_phrases:
  - "vibe audit fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/013-vibe-audit-fixes"
    last_updated_at: "2026-11-14T22:55:00Z"
    last_updated_by: "deepseek-v4-1-flash-1017"
    recent_action: "Implemented every task in tasks.md and verified the suites"
    next_safe_action: "Phase 014 builds the journal fixture and reader"
    blockers: []
    key_files:
      - ".vibe/plugins/repo-guards/lib/hook-io.mjs"
      - ".vibe/plugins/repo-guards/env-secret-guard.mjs"
      - ".skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does sync-skills-vibe.cjs follow a symlinked ancestor of its output folder? Yes; all three generators now judge every component below the checkout"
      - "Does anything read the ERROR_POLICY export in goal-inject.mjs? No; the export was dropped"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-vibe-audit-fixes |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every verified finding from the 2026-11-14 sk-code audit is now either fixed with a test or dropped with the evidence that disproved it. The two P1 defects were the env-secret guard judging a relative path against the checkout instead of the session folder, and the `isolated-vibe-home` rule ignoring a `cd` before the run. Both regression tests failed before their fix.

### Phase 13: vibe-audit-fixes

`sessionDirFor` now lives once in `.vibe/plugins/repo-guards/lib/hook-io.mjs`, and `env-secret-guard.mjs` overrides `cwd` with the session folder at its call site. `toCoreCall` still anchors to the checkout, so the git-message gate and dispatch preflight are untouched. The dispatch rule resolves a relative `VIBE_HOME` against `vibeWorkingDirectory()`, the same base `output-dir-required` uses. The fan-out verdict now requires an integer export exit code of 0 and names the recorded outcome in its failure message. The home renderer refuses `$VAR`, `${VAR}`, `$(` and backtick leftovers plus newline and carriage return in the root. The skills mirror ignores dotfiles, and all three Vibe sync generators refuse an output folder reached through a symlinked ancestor.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.vibe/plugins/repo-guards/lib/hook-io.mjs` | Modified | Export the one `sessionDirFor`; `toCoreCall` unchanged |
| `.vibe/plugins/repo-guards/env-secret-guard.mjs` | Modified | Pass the session folder as `cwd` to the guard core |
| `.vibe/plugins/repo-guards/{overlay-guard,spec-gate,spec-gate-classify,post-edit-quality}.mjs` | Modified | Import the shared `sessionDirFor`; overlay wraps its stderr note write |
| `.vibe/plugins/repo-guards/tests/env-secret-guard.test.mjs` | Created | Relative symlink to a dotenv file in the session folder is denied |
| `.vibe/plugins/repo-guards/spec-gate.mjs` | Modified | `pre_tool` advise note uses `system_message` |
| `.vibe/plugins/repo-guards/render-home-hooks.cjs` | Modified | Refuse every substitution form and newline/CR in the root |
| `.vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs` | Modified | Real-path comparison, wrapped line, four substitution cases, newline/CR cases |
| `.vibe/plugins/repo-guards/fixtures/spec-gate/seed-state.mjs` | Modified | MODULE box header |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modified | Relative home uses `vibeWorkingDirectory()`; imports the session-free sets |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modified | Two relative-home cases with and without a preceding `cd` |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modified | Exports `VIBE_SESSION_FREE_SUBCOMMANDS` and `VIBE_SESSION_FREE_FLAGS` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Integer exit check, outcome in the message, mirror comment, JSDoc, split require |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | Null exit, stopped outcome, three-roster equality |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs` | Modified | Skip dotfiles; linked-ancestor check |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-{agents,prompts}-vibe.cjs` | Modified | Linked-ancestor check |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-vibe.test.mjs` | Created | `.DS_Store` is not drift |
| `.skilled/hooks/goal/vibe/goal-vibe.test.mjs` | Modified | Temporary `goal.md` fixture instead of the live 011 packet |
| `.skilled/hooks/goal/vibe/goal-inject.mjs` | Modified | Dropped the unread `ERROR_POLICY` export |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each behavior fix started with a test that had to fail. The env-guard test failed `fail 1` before T013, the relative-home cases failed before T020, the null-exit and stopped-outcome cases failed before T024, the `.DS_Store` case failed before T007, and the renderer cases were added with the fix. The style fixes needed no new test and were confirmed with `node --check`, the existing suites, and the line-length scan.

The four verify-first checks were opened before deciding. All three `assertOutputDirectorySafe` copies checked only the last path component, so a linked ancestor below the checkout bypassed them; each now walks every component below the checkout. `ERROR_POLICY` in `goal-inject.mjs` had no reader anywhere in the repository, so it was dropped rather than tested.

`scratch/baseline.txt` holds the pre-change counts, `scratch/dotfile-repro.txt` the dotfile reproduction, `scratch/git-gate-before.txt` and `scratch/git-gate-after.txt` the unchanged gate output, and `scratch/node-check.txt` the syntax scan.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `sessionDirFor` lives in `hook-io.mjs`, `toCoreCall` unchanged | The git-message gate and dispatch preflight depend on the checkout as `cwd`; only the env guard needs the session folder |
| A relative `VIBE_HOME` uses `vibeWorkingDirectory()` | It is the base `output-dir-required` already uses, so the two rules cannot disagree about a `cd` |
| `ERROR_POLICY` was dropped, not asserted | No reader and no documented contract; the Vibe adapter is a renderer, and the session-start hook owns fail-open |
| The ancestor-symlink check stops at the checkout | Above the checkout is the operator's layout; `/var` is a symlink on macOS, and refusing it would refuse every temp-folder run |
| Dotfiles are skipped in `listOutputEntries` | A mirror entry is a skill link, so a Finder dotfile is neither drift nor prunable output |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs .vibe/plugins/repo-guards/tests/*.test.mjs` | `tests 72`, `pass 72`, `fail 0` (baseline 64 pass) |
| `node --test .skilled/hooks/dispatch/lib/*.test.mjs .vibe/plugins/repo-guards/tests/*.test.mjs` | `tests 73`, `pass 72`, `fail 1`; the failure is the file-level entry for the vitest suite `dispatch-audit.test.mjs`, which `node --test` cannot run, at baseline and after |
| `.skilled/node_modules/.bin/vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | `Test Files 1 passed (1)`, `Tests 130 passed (130)` |
| `npx vitest run tests/unit/fanout-run.vitest.ts` (from `.skilled/skills/system-deep-loop/runtime`) | `Test Files 1 passed (1)`, `Tests 195 passed (195)` (baseline 193) |
| `diff scratch/git-gate-before.txt scratch/git-gate-after.txt` | No output |
| `node --check` on every touched `.mjs` and `.cjs` file | 20 `OK`, 0 `FAIL` (`scratch/node-check.txt`) |
| Linked-ancestor refusal in the three Vibe sync generators | A symlinked ancestor under `.skilled/skills/.state/` is refused by each generator with `refusing to write through a symbolic link`; the real mirrors still pass `--check` |
| `rg -c "^\| (P1\|P2\|Verify-first) " goal.md` | 21 rows |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` | `RESULT: PASSED (errors=0 warnings=0)` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The T001 glob includes a vitest suite.** `dispatch-audit.test.mjs` was already a vitest suite at HEAD, so `node --test` reports one file-level failure on the exact glob. The node:test subset and the vitest run of that file both pass; the glob mismatch is pre-existing and outside this phase's scope.
2. **The 120-character scan exempts box-drawing headers.** Every module header line is 204 characters by convention; the scan that matters is the code-line scan, which is clean on every touched file.
3. **The full suites for the three Vibe sync generators are phase 020's.** This phase adds only the `.DS_Store` case to `sync-skills-vibe.test.mjs`.
<!-- /ANCHOR:limitations -->

---
