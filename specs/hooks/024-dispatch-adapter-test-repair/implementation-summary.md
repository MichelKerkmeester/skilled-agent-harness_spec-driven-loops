---
title: "Implementation Summary"
description: "The two dispatch adapter suites recorded as failing pass under their owning vitest config. The dispatch READMEs now give that command, run the repo's pinned vitest, and say why the plain runners fail."
trigger_phrases:
  - "dispatch adapter test repair implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/024-dispatch-adapter-test-repair"
    last_updated_at: "2026-10-19T12:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Documented the owning runner and verified every suite from the final tree"
    next_safe_action: "Packet complete. Pushing the branch waits for the operator"
    blockers: []
    key_files:
      - ".skilled/hooks/dispatch/README.md"
      - ".skilled/hooks/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hooks-024-dispatch-adapter-test-repair"
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
| **Spec Folder** | 024-dispatch-adapter-test-repair |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The two dispatch adapter suites recorded as broken were never broken. Each failed only under the runner it was given, and both pass under the hooks vitest config. The dispatch READMEs now say which command to use and why.

### Document the owning runner for the dispatch adapter vitest suites

`codex-shell-tool.test.mjs` imports vitest, so `node --test` loads it and then fails with `Cannot read properties of undefined (reading 'config')`. `pi/dispatch-preflight-lint.ts` imports `../../.skilled/hooks/shared/hook-flags.mjs`, a path written for its `.pi/extensions/` symlink as `.pi/extensions/README.md` documents, because Pi resolves an extension's imports from the symlink path. Vitest resolves the real file, so only the alias in `.skilled/hooks/vitest.config.ts` finds the module. Run from `.skilled` without that config, the suite fails with `Cannot find module`. Under the config, the Pi suite passes 38 tests, codex 5 and directive-dedup 15.

Review turned up a second gap in the same commands. Vitest is installed under `.skilled/node_modules`, not at the repository root, so a root-level `npx vitest` ran a cached 5.0.5 in place of the pinned 5.0.3, and offline it fails with ENOTFOUND. Every vitest command in both READMEs now calls `.skilled/node_modules/.bin/vitest`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/dispatch/README.md` | Modified | The test files and their runner in the tree, the Pi import exception, and the adapter suite command with why the plain runners fail |
| `.skilled/hooks/README.md` | Modified | The validation command covers all three adapter suites and both commands call the pinned vitest |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator reproduced each failure and each pass, then traced the Pi import through commits 79dc898562 and c7b71c996e. DeepSeek made the README edits through cli-pi in eight short briefs (`scratch/briefs/`). Luna reviewed read-only in four rounds: round 1 found the root-level `npx` P1 and an inaccurate `node --test` sentence, rounds 2 and 3 each found one wording P2, and round 4 passed. Every suite and every README command was rerun from the final tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the docs, not the Pi import | The link-relative import is the contract Pi loads by, and every Pi extension in the repo uses it. Changing one adapter would break its load under Pi |
| Leave both tests unchanged | They pass under their owning config, so changing an assertion or import would fix nothing |
| Call the pinned vitest binary | A root-level `npx` silently runs a different vitest, or none offline |
| Level 2 although recommend-level.sh scored Level 0 | The closure needs an acceptance criteria file |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `sh scratch/suites.sh`, baseline and final (`scratch/suites-before.txt`, `suites-after.txt`) | Unchanged and all pass: Pi preflight 38, codex 5, directive-dedup 15, hooks vitest tree 177, dispatch-audit 114, guard node 39, shared hooks 44. The wrong-runner rows fail as expected in both |
| Each vitest and `node --test` command in both README validation sections, as written | Exit 0 |
| Luna read-only review (`scratch/review/luna-1.txt` to `luna-4.txt`) | PASS on round 4 |
| `validate.sh specs/hooks/024-dispatch-adapter-test-repair --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The baseline ran on a different vitest.** The baseline's vitest rows ran through root-level `npx` (vitest 5.0.5), and the final rows through the pinned 5.0.3. Every count matched.
2. **The plugin import checks fail in this worktree.** The `node -e "import('./.skilled/plugins/...')"` lines in both READMEs exit 1 here, because `worktree-naming.sh provision` does not install `.opencode/node_modules` and the plugins need `zod`. The same line prints `ok` in a checkout that has it. This packet does not change those lines.
3. **The dual-compat packet still records both suites as failing.** Its files belong to another worktree, so the correction is left to that packet.
<!-- /ANCHOR:limitations -->

---
