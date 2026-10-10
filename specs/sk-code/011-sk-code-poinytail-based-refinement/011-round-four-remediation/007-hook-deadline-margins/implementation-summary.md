---
title: "Implementation Summary"
description: "The Claude prompt-submit shim now stops reading stdin at a 500 ms deadline, and the seven hook entries whose host allows 3 seconds read with the same deadline."
trigger_phrases:
  - "hook deadline margins implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins"
    last_updated_at: "2026-10-10T17:40:00Z"
    last_updated_by: "sonnet-verifier"
    recent_action: "Verified every goal criterion; no defects found"
    next_safe_action: "Orchestrator runs the Hermes generator and trigger-index rebuild"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-hook-deadline-margins"
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
| **Spec Folder** | 007-hook-deadline-margins |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No spec-kit hook can be held open by a stdin its host never closes now, and the seven entries whose host kills them after 3 seconds leave at least 1000 ms for their own work. The Claude prompt-submit shim was the last reader that blocked until the stream closed. It now settles at a deadline like the other fifteen.

### Phase 7: hook-deadline-margins

The shim `runtime/hooks/claude/user-prompt-submit.ts` replaced its `readSync` loop with an inlined, event-based read that settles on `end`, on a 500 ms timer or on a 1 MB overflow, and `runShim` became async around it. The shim imports no sibling module, because its suite runs the `.ts` source directly. The shared readers gained `SHORT_HOST_STDIN_TIMEOUT_MS = 500`, an optional deadline argument on `parseHookStdin` and `readCodexHookInput` that defaults to 3000 ms, and the seven entries registered with `"timeout":3` pass it. Every other entry keeps 3000 ms and the 1800 ms `withTimeout` in the Claude lifecycle hooks stays.

With stdin held open, the seven entries now exit with medians of 538 to 765 ms. Before the fix the shim ran until a 12 second kill and the other four late entries took 3.0 to 3.3 seconds.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` | Modified | Inlined 500 ms deadline read, async shim, four unused imports removed |
| `.skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts` | Modified | `SHORT_HOST_STDIN_TIMEOUT_MS = 500` |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` | Modified | The same constant for the plain adapters |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` | Modified | `parseHookStdin(timeoutMs)` with a 3000 ms default |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts` | Modified | `readCodexHookInput(..., timeoutMs)` with a 3000 ms default |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | Modified | Passes the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Modified | Passes the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts` | Modified | Passes the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts` | Modified | Passes the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` | Modified | Passes the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` | Modified | Passes the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` | Modified | Replaced whole with the planner's copy: shim entry, short-host bounds, held-open payload test |
| `.skilled/skills/system-spec-kit/runtime/hooks/README.md` | Modified | `shared-stdin.ts` row names the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` | Modified | The classifiers' short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md` | Modified | The shim's own deadline |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modified | `version: 2.7.2.0` |
| `.skilled/skills/system-spec-kit/changelog/v2.7.2.0.md` | Created | Changelog entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash built the child one unit at a time from `scratch/dispatch-units.json`, each unit gated by its own check. A Sonnet verifier then reran every Phase 1 record, Phase 2 check and Phase 3 task, read the full diff of the 16 modified files and the new changelog, rebuilt nothing (`dist/` was already fresh and carried the new constant), and ran the `sk-code-opencode` drift guards. `build-units.py verify` rebuilds the 17 touched files from the saved pre-edit copies plus only the planned units and found them byte-identical to the tree. The Hermes mirror, trigger index and parent changelog are left to the orchestrator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The shim gets an inlined reader instead of an import | Its vitest suite runs the `.ts` source with type stripping, where an import of `../shared-stdin.js` names a file that does not exist beside the source |
| The short deadline is 500 ms | The work after the read took at most 314 ms warm and 1748 ms once on a cold advisor start, so 500 ms leaves 750 ms even in that case |
| The deadline travels as an argument with a 3000 ms default | `parseHookStdin` and `readCodexHookInput` also serve the 10 second Stop entries, which keep 3000 ms |
| The 1800 ms budget and the 2500 ms and 2800 ms child timeouts stay | Their own suites pin them. A held-open stdin plus a child that runs to its kill timeout still passes 3 seconds, recorded as a residual |
| The test file is replaced whole | About a dozen separate edits would be riskier than one `cp` proven with `cmp` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test hooks/lib/hook-stdin-deadline.test.mjs` | PASS: exit 0, `ℹ tests 39`, `ℹ pass 39`, `ℹ fail 0` |
| `grep -n 'readSync' hooks/claude/user-prompt-submit.ts` | PASS: no output, exit 1 |
| `scratch/measure-open-stdin.mjs` | PASS: exit 0, `entries=7 late=0 margin_ms=1000 runs=3` |
| `scratch/compare-fail-open.mjs` | PASS: exit 0, `cases=66 mismatches=0` |
| vitest hook set plus `node --test tests/hooks/*.test.mjs` | PASS: `Tests  290 passed (290)`, `ℹ pass 181`, `ℹ fail 0`, exit 0 |
| `validate.sh <folder> --strict` | PASS: `RESULT: PASSED` |
| `npm run typecheck`, ESLint, `node --check`, dist freshness | PASS: typecheck 0, ESLint 0 on seven files, one pre-existing `HookInput` error in `session-prime.ts`, `All watched dist outputs are fresh.` |
| `run-all-drift-guards.sh` | PASS: `all 4 guards PASSED` |
| `sync-skills-hermes.cjs --check` | PENDING-ORCHESTRATOR: `DRIFT system-spec-kit` as expected, plus five sibling sk-code lines |
| Review of the full diff | PASS: no defects, `scratch/fix-units.json` is `[]` |

**Orchestrator steps, 2026-10-10.** The Hermes generator wrote 6 of 70 copies, and `sync-skills-hermes.cjs --check` prints `PASS: 70 Hermes skill copies in sync`. The sk-code manifest was re-minted and copied over its archive copy (`cmp` exit 0), and `compiled-route-guard.cjs` prints `sk-code fresh` and `All hubs fresh or excused`. The trigger index was rebuilt, and its `--check` exits 0.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A held-open stdin plus a child that runs to its own kill timeout still passes 3 seconds.** The 500 ms read plus the shim's 2500 ms or the Codex adapters' 2800 ms child timeout exceeds the host's 3 seconds, so the host still kills that case. Before this phase the same case never ended.
2. **A payload written more than 500 ms after the hook starts, on a stdin that stays open, is cut short.** The hook takes its empty or invalid payload answer. Hosts write the payload at spawn.
3. **No suite covers the shim's 1 MB overflow path.** A manual probe with a 2.2 MB payload printed `INPUT_OVERFLOW` and `{}` with exit 0.
4. **The tests prove each entry exits on its own and acts on a held-open payload.** They do not show how a real host behaves.
<!-- /ANCHOR:limitations -->

---
