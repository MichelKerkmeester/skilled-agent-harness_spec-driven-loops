---
title: "Implementation Summary"
description: "The quality gate no longer hands the workflows README to actionlint, five docs cite what the code holds, and the Pi adapters import each core once from their own folder."
trigger_phrases:
  - "closeout follow up fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/005-closeout-follow-up-fixes"
    last_updated_at: "2026-11-16T07:29:33Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed the phase 4 close-out findings"
    next_safe_action: "Commit when the operator asks"
    packet_purpose: "Purpose: Each finding is fixed at its source, and the checker that found it passes."
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-quality/repository/quality.json"
      - ".skilled/hooks/vitest.config.ts"
      - ".skilled/hooks/coverage-rationale.md"
    session_dedup:
      fingerprint: "sha256:2ef3f99c770e0078fadb53647257fc6bc070f80165fcc1eda1a4aa285cb35140"
      session_id: "scaffold-005-closeout-follow-up-fixes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a4c37e98-2c3a-4c20-a7bf-acbc32e31f29"
      workspace: "/Users/michelkerkmeester/worktrees/public/411-hook-library-cleanup"
      savedAt: "2026-11-16T07:29:33Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-closeout-follow-up-fixes |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A change to the workflows README no longer fails the quality gate on actionlint. The Pi adapters import each shared core once, from their own folder, so a failed import now reports its real error instead of a missing fallback path.

### Phase 5: closeout-follow-up-fixes

Phase 4 closed with a list of faults it left out of scope. This phase fixes the ones that change no hook behavior. Each fix is proven by the checker or suite that found the fault. The `--check` worktree warning and the OpenCode plugin prefixes stay open, because each changes behavior and needs its own decision.

The docs that described the removed fallbacks or the alias now describe the single import.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-code-quality/repository/quality.json`, `scripts/lib/quality-config-discovery.cjs`, `references/quality-config.md` | Modified | actionlint `paths` is `*.yml` and `*.yaml` under `.github/workflows/` |
| `sk-code-ci/references/job-shape-rules.md` | Modified | Three line citations |
| `system-spec-kit/manual-testing-playbook/ux-hooks/comment-hygiene-opencode-plugin.md` | Modified | The `gate:comment-hygiene` marker and the moved doc-model check |
| `.opencode/plugins/codex-hooks-watchdog.js` | Modified | Header and catch comments only |
| `.skilled/hooks/coverage-rationale.md`, `.github/workflows/README.md` | Modified | Resolving paths, concern keys and `readme-check` markers |
| Six Pi adapters: `completion-evidence.ts`, `goal-context.ts`, `task-dispatch-guard.ts`, `session-handover.ts`, `dispatch-preflight-lint.ts`, `prompt-advisor.ts` | Modified | One import each, no fallback |
| `.skilled/hooks/vitest.config.ts`, `session-handover.test.ts`, `prompt-advisor.vitest.ts` | Modified | The alias and the tests of the dead path are gone |
| Two goal READMEs, two spec-kit hook READMEs, the advisor Pi README and catalog entry, `directive-lifecycle-dedup.md` | Modified | Prose now describes the single import |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

A read-only Opus investigation confirmed each finding and named its fix. The doc and config fixes were made and checked first. A separate Opus agent removed the Pi fallbacks and ran the suites before and after. Its counts were then rerun here: the hook Vitest suite, the hook `node --test` list, the advisor test and both sync checks.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Two globs, `*.yml` and `*.yaml`, not a brace pattern | The gate's glob matcher has no brace support, and GitHub reads workflows only at the top of the folder |
| Markers for `pipeline.js` and "Seven workflows", not text changes | `pipeline.js` lives in the installed `dsh-tools` package, and the seven workflows are named in the sentence |
| Left the wrapper-runtime sentence in `coverage-rationale.md` | Worktree 424 edits it, and one owner per line keeps the merge clean |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Quality gate, actionlint only | Workflows README: `NOT_APPLICABLE`. `hook-vitest-suites.yml`: `RAN_CLEAN` |
| sk-code-quality `node --test` | 154 of 154 pass |
| README checkers on `coverage-rationale.md` and the workflows README | `SUMMARY files=1 pass=1 fail=0` for both checkers on both files |
| `grep -c 'gate:comment-hygiene' .skilled/scripts/git-hooks/pre-commit` | 5 |
| Hook Vitest, no alias | 503 of 503, 9 files |
| Hook `node --test` list | 1888 pass, 0 fail |
| `prompt-advisor.vitest.ts` | 13 of 13 |
| Dead specifier search over the six adapters | No match, exit 1 |
| `sync-runtime-mirrors --check` and `sync-hook-registrations --check` | PASS, 257 mirrors and 22 Pi extensions |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Two spec-kit Vitest configs keep the same alias block.** `system-spec-kit/runtime/vitest.config.ts` and `system-spec-kit/vitest.config.ts` look unused now, but no run proved it, so they stay.
2. **Three READMEs still fail the reference checker on old tokens.** The spec-kit Pi README, the spec-kit hooks README and the advisor Pi README name paths such as `hooks/pi/` that the checker resolves from the wrong folder. The tokens were there before this phase.
3. **`task-dispatch-guard.ts` has no unit test that loads it.** Its proof is the typecheck and the unchanged surviving import.
<!-- /ANCHOR:limitations -->

---
