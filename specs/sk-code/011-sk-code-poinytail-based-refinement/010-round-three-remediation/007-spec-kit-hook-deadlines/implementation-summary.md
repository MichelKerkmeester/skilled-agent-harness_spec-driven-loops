---
title: "Implementation Summary"
description: "Every listed spec-kit hook stdin reader now settles at a 3000 ms deadline through two shared readers; review found four small defects and all four are fixed."
trigger_phrases:
  - "spec kit hook deadlines implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines"
    last_updated_at: "2026-10-10T13:00:00Z"
    last_updated_by: "sonnet-verifier"
    recent_action: "Verified, reviewed and re-verified after four review fixes: every goal criterion passes"
    next_safe_action: "Orchestrator: Hermes generator, trigger-index rebuild, commit"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts"
      - ".skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs"
      - ".skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-spec-kit-hook-deadlines"
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
| **Spec Folder** | 007-spec-kit-hook-deadlines |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A spec-kit hook no longer waits forever on a host that never closes stdin. Every listed reader under `.skilled/skills/system-spec-kit/runtime/hooks/` now stops reading after 3000 ms, takes whatever text arrived and gives the same fail-open answer it gives on an empty or invalid payload. Before the edits, 30 of the 32 runnable hook entries were still running when a probe killed them at 9 seconds. Now all 32 exit on their own.

### Phase 7: spec-kit-hook-deadlines

Two shared readers carry the deadline. `lib/hook-adapter-shared.mjs` serves the plain `.mjs` and `.cjs` hooks: `readStdin({ timeoutMs = 3000 })` settles on the end of the stream or the deadline, then removes its listeners, clears its timer and pauses stdin so the process can exit. The new `shared-stdin.ts` serves the compiled hooks: `readHookStdin({ timeoutMs, maxBytes })` does the same and also resolves `null` once more than `maxBytes` arrive, so the four `shared.ts` readers keep their 1 MB cap. The `.mjs` file is not part of the TypeScript build and is absent from `dist/`, which is why there are two. The four `.cjs` hooks load the ESM reader with a dynamic import inside their existing `try`, and every hook keeps its own `JSON.parse` and fail-open branch.

A new table-driven test holds stdin open on all 32 hook entries (16 plain, 16 compiled) and checks that each exits on its own with its recorded exit code and stdout, plus four payload tests. The 15 readers were routed, the READMEs describe them, and the skill moved to 2.7.1.0 with a changelog entry. When the branch merged into main, main already held a different 2.7.1.0, so this entry now ships inside `changelog/v2.7.2.0.md` together with the round-four deadline work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/hooks/lib/hook-adapter-shared.mjs` | Modified | `readStdin` gains the 3000 ms deadline |
| `runtime/hooks/shared-stdin.ts` | Created | `readHookStdin` for the compiled adapters, deadline plus byte cap |
| `runtime/hooks/lib/hook-stdin-deadline.test.mjs` | Created | 32-entry deadline test and four payload tests |
| `runtime/hooks/{claude,codex,devin}/completion-evidence-stop.cjs`, `runtime/hooks/devin/post-compaction.cjs` | Modified | Local reader delegates to the shared reader by dynamic import |
| `runtime/hooks/cursor/{post-tool-use,spec-gate-prebind,completion-evidence-response}.mjs`, `runtime/hooks/devin/permission-request-policy.mjs` | Modified | Private reader removed, shared reader imported |
| `runtime/hooks/{claude,codex,cursor,devin}/shared.ts` | Modified | Hook input readers use `readHookStdin` with the 1 MB cap |
| `runtime/hooks/claude/directive-lifecycle-boundary.ts`, `runtime/hooks/claude/compact-inject.ts` | Modified | Read through `readHookStdin`; the snapshot worker becomes async |
| `runtime/hooks/README.md`, `runtime/hooks/lib/README.md` | Modified | Reader description, tree, key files, validation command |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modified | `version: 2.7.1.0` |
| `.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md` | Created | Changelog entry |

All paths are under `.skilled/skills/system-spec-kit/` (the `runtime/` ones under `runtime/hooks/`). `runtime/dist/hooks/` was rebuilt and is git-ignored.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash built the child one unit at a time from `scratch/dispatch-units.json` (40 units, all passing their own check). A Sonnet verifier then reran every Phase 2 and Phase 3 check, rebuilt the 21 touched files from the saved pre-edit copy plus only the planned edits and compared them byte for byte, probed the 1 MB cap, a partial payload on an open stdin and the excluded reader directly, and read the full diff. Nothing was committed or pushed. The Hermes mirror, the trigger-index rebuild and the parent changelog refresh are the orchestrator's.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two readers, one for `.mjs`/`.cjs` and one for compiled TypeScript | The `.mjs` reader is absent from `dist/`, so a relative import from a compiled adapter would resolve to a missing file |
| 3000 ms for every entry | Matches the `.skilled/hooks` sibling; the smallest host timeout in the registry is also 3 seconds, so no host kills the hook first except where it already did |
| `.cjs` hooks use `await import()` inside their existing `try` | Works on every supported Node, resolves from the real path under symlinks, and a failed load also fails open |
| The compiled reader keeps each caller's 1 MB cap | An oversized payload is still dropped early and never buffered whole |
| `claude/user-prompt-submit.ts` stays unchanged | Its suite runs the `.ts` source directly, so it cannot import a sibling module; recorded as a follow-up |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Criterion 1: reader `rg` over the hooks tree | PASS: no match lines, `exit=1` (15 matches in `scratch/before`) |
| Criterion 2: `node --check` x10, `npm run typecheck`, eslint on 7 files, `npm run build`, `dist-freshness check-all` | PASS: exit 0, `All watched dist outputs are fresh.` |
| Criterion 3: `node --test hooks/lib/hook-stdin-deadline.test.mjs` | PASS: `ℹ tests 37`, `ℹ pass 37`, `ℹ fail 0`, exit 0 (before the edits: pass 7, fail 30) |
| Criterion 4: vitest hook set and `node --test tests/hooks/*.test.mjs` | PASS: `Test Files  16 passed (16)`, `Tests  290 passed (290)`, `ℹ tests 184`, `ℹ pass 181`, `ℹ fail 0`, `ℹ skipped 3`, exit 0 |
| Criterion 5: `rg` for imports of `hook-adapter-shared.cjs` | PASS: no match lines, `exit=1` |
| Criterion 6: `validate.sh --strict` on this folder | PASS: `Errors: 0  Warnings: 0`, `RESULT: PASSED` |
| Fail-open answers unchanged | PASS: `cases=64 mismatches=0` against the answers recorded on the unedited tree |
| Symlinked entries (`.skilled/hooks`, `.devin/hooks`, `.cursor/hooks`) | PASS: four entries answer as before, exit 0 |
| Exact-edit check (`build-units.py verify scratch/before`) | PASS with two deliberate deviations: `files=21 mismatches=2`, naming only `hooks/README.md` (FIX-2) and `changelog/v2.7.1.0.md` (FIX-3, FIX-4); `cursor/post-tool-use.mjs` now matches |
| Scope diff | PASS: 18 modified, 3 untracked, none outside the plan |
| Hermes `--check` | PENDING-ORCHESTRATOR: `DRIFT system-spec-kit` from the version bump, plus sibling drift |

### Review result

The code is right: both readers bound every read, release listeners, clear the timer and pause stdin; a 2.2 MB payload resolves `null` in 30 ms and an exact 1 MB payload passes; a partial payload on a held-open stdin returns at 3.0 s; the snapshot worker's rejection is caught by its caller; no stray `hook-adapter-shared.cjs` import remains. Four small defects were found and fixed (`scratch/fix-units-applied.json`, tasks T066 to T069), then every check was rerun:

1. FIX-1: `cursor/post-tool-use.mjs` had two extra blank lines where the private reader was deleted.
2. FIX-2: in `runtime/hooks/README.md` the new `shared-stdin.ts` row sat after a blank line and rendered outside the key-files table (the planner's edit text introduced it).
3. FIX-3 and FIX-4: the changelog said every hook now stops after 3000 ms, which is false for `claude/user-prompt-submit.ts`.

After the fixes: `compare-fail-open.mjs` prints `cases=64 mismatches=0`, `dist-freshness check-all` prints `All watched dist outputs are fresh.`, and both edited documents validate with `Total issues: 0`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`claude/user-prompt-submit.ts` is the excluded sixteenth reader.** It reads with a `readSync(0, ...)` loop at lines 81-95 that the requirement search does not match, and it still blocks on an open stdin (a probe found it running at 6 seconds). Its suite runs the `.ts` source directly with type stripping, so it cannot import `../shared-stdin.js` without breaking eight tests, and its hosts give it 3 seconds. A fix needs a shorter, inlined deadline in a follow-up.
2. **A 3-second host timeout gains nothing from a 3000 ms deadline.** The Claude `SessionStart`, `PreCompact` and `UserPromptSubmit` and the Codex `SessionStart` and `UserPromptSubmit` entries are killed by their host at about the same moment as before.
3. **The test proves each entry exits at the deadline with stdin open, not how a real host behaves.** The compiled entries run from `dist/`, so the test needs `npm run build` first.
<!-- /ANCHOR:limitations -->

---


