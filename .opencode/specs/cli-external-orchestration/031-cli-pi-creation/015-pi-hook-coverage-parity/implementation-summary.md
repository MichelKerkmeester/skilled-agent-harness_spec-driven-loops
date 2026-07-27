---
title: "Implementation Summary: Pi hook coverage parity"
description: "Closed the confirmed hook-coverage gap between .pi/extensions/ (6 files) and .devin/hooks/ and .cursor/hooks/ (13 real adapters each): 8 buildable session-lifecycle hooks bridged across 5 new extension files + 1 shared lib, 2 confirmed non-gaps documented; GLM-5.2 found 5 real findings, all fixed."
trigger_phrases:
  - "pi hook coverage parity summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/015-pi-hook-coverage-parity"
    last_updated_at: "2026-07-27T20:38:38Z"
    last_updated_by: "claude-code"
    recent_action: "Built directly, GLM-5.2 reviewed, all 5 findings fixed, closed Complete"
    next_safe_action: "None -- terminal phase; packet re-closes at 15 phases"
    blockers: []
    key_files: [".pi/extensions/lib/claude-hook-adapter.ts", ".pi/extensions/session-start-context.ts", ".pi/extensions/session-compact-context.ts", ".pi/extensions/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-hook-coverage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Pi's real 33-event Extension API re-confirmed via a direct read of the installed package's dist/core/extensions/types.d.ts, not phase 008's summary alone.", "session-prime.js emits plain text, session-stop.js emits nothing, user-prompt-submit.js emits a hookSpecificOutput JSON envelope -- confirmed via isolated spawn tests, correcting an initial wrong uniform-JSON-envelope assumption.", "input-event transform handlers chain additively (runner.js emitInput), confirming prompt-advisor.ts composes safely with the pre-existing spec-gate-classify.ts.", "permission-request-policy.mjs and spec-gate-prebind.mjs are confirmed non-gaps: their underlying need is already met by Pi's own tool_call and input events respectively."]
---
# Implementation Summary: Pi hook coverage parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-pi-hook-coverage-parity |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This is the terminal phase of `031-cli-pi-creation`, added when the operator flagged that `.devin/hooks/` and `.cursor/hooks/` support materially more hook concerns than `.pi/extensions/`. The observation was correct: phase 012 built 6 extension files covering only the `tool_call`/`tool_result`/`input`-scoped guard cores, while `.devin/hooks.v1.json` and `.cursor/hooks.json` each wire 13 real adapters across 7-8 lifecycle events, including a whole class phase 012 never touched: session-start context priming, session-shutdown autosave, prompt-submit skill-advisor recommendation, and post-compaction continuity recovery.

### Investigation

Re-read Pi's real Extension API directly from the installed `@earendil-works/pi-coding-agent` package's `dist/core/extensions/types.d.ts` (not phase 008's summary), confirming the 33-event surface and `ExtensionAPI.on()` overloads. Read every missing devin/cursor hook's actual source (not just its filename) to classify it:

- **8 buildable**: `session-start.js`/`session-prime.ts` (session_start), `session-stop.js`/`session-stop.ts` (session_shutdown), `user-prompt-submit.js` -> skill-advisor (input), `post-compaction.cjs` (session_compact), and the 4 plain warn-only CLI checks (`worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check`, all session_start).
- **2 confirmed non-gaps**: `permission-request-policy.mjs` composes the same `spec-gate-core`/`dispatch-rule-checks` cores `spec-gate-enforce.ts`/`dispatch-preflight-lint.ts` already call at `tool_call` time -- Pi has no separate approval-gate event, so the functional intent is already covered. `spec-gate-prebind.mjs` exists only because Cursor lacks a CLI-delivered prompt-classification event; Pi's `input` event genuinely is that classification point (already bridged), so Pi never had the gap this hook works around.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/lib/claude-hook-adapter.ts` | Created | Pi-specific spawnSync proxy (`runClaudeHookAdapter`) + JSON-envelope parser (`extractAdditionalContext`), mirroring devin's own `mcp-server/hooks/devin/shared.ts` pattern. |
| `.pi/extensions/session-start-context.ts` | Created | `session_start` -> `session-prime.js` (raw text) -> `pi.sendMessage()`. |
| `.pi/extensions/session-start-advisories.ts` | Created | `session_start` -> 4 sequential `ctx.exec()` calls -> `ctx.ui.notify()` on any warning. |
| `.pi/extensions/session-stop-context.ts` | Created | `session_shutdown(reason="quit")` -> `session-stop.js`, fire-and-forget. |
| `.pi/extensions/prompt-advisor.ts` | Created | `input` -> `user-prompt-submit.js` (JSON envelope) -> `{action:"transform"}`, chains safely with `spec-gate-classify.ts`. |
| `.pi/extensions/session-compact-context.ts` | Created | `session_compact` -> native port of `post-compaction.cjs`'s recovery chain -> `pi.sendMessage()`. |
| `.pi/extensions/README.md` | Modified | Directory Tree, Key Files, new §3A CONFIRMED NON-GAPS, Boundaries and Flow (two patterns + output-shape caveat), Entrypoints, all for 12 total files. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built directly (no LUNA dispatch): the task required precise reading of real runtime source (installed package types, `runner.js` dispatch semantics, dist hook stdin/stdout contracts) and correcting a real self-introduced assumption mid-build, not new-artifact scaffolding a fresh model could do from a brief alone.

A live `pi --offline --approve -p "list your available tools"` smoke test was re-run after every structural change (3 total runs, all exit 0, 0 extension-load errors). Before wiring `session-start-context.ts`, an isolated spawn test (`node session-prime.js < payload.json`) revealed it emits plain text, not the JSON envelope `user-prompt-submit.js` uses -- the initial implementation had wrongly assumed a uniform JSON contract across all three proxied dist hooks; this was caught and fixed before commit, not left latent. A direct read of `runner.js`'s `emitInput()` confirmed `input`-event transforms chain additively across handlers (not last-writer-wins), verifying `prompt-advisor.ts` composes safely with the pre-existing `spec-gate-classify.ts` rather than overwriting its Gate-3 question.

GLM-5.2 (`devin -p --model glm-5.2`) independently reviewed all 6 new/changed files against the real repo. It returned REQUEST CHANGES with 5 concrete findings:

1. **[BLOCKING]** `README.md` claimed both `session-prime.js` and `session-stop.js` write plain text to stdout. `session-stop.js` actually writes nothing (side effects only) -- confirmed by grepping for `process.stdout.write`/`console.log` in the dist file. Fixed to state this correctly.
2. **[BLOCKING]** `claude-hook-adapter.ts`'s header comment cited `.devin/hooks/devin/shared.ts` and `.cursor/hooks/cursor/shared.ts` as the analog spawnSync proxies -- neither path exists (`.devin/hooks/` and `.cursor/hooks/` hold only symlinks into the dist tree). The real proxies live at `system-spec-kit/mcp-server/hooks/{devin,cursor}/shared.ts`. Fixed; the functional claim (both proxy into the same claude dist files) was correct, only the cited paths were wrong.
3. **[BLOCKING]** `session-compact-context.ts` accessed `event.compactionEntry.summary` without guarding `compactionEntry` itself -- if undefined, the whole handler throws before the try/catch's outer boundary, silently dropping the spec-folder rehydration and memory-resume fallback that do not depend on `compactionEntry` at all. Fixed to `event.compactionEntry?.summary?.trim() ?? ""`, restoring the intended "degrade gracefully, not drop everything" behavior.
4. **[MINOR]** The same file's `boundedMemoryContextResume()` accessed `parsed.data` without guarding `parsed` itself, deviating from the original `post-compaction.cjs`'s null-safe `parsed?.data?.summary` chain. Fail-open masked the practical impact, but fixed to restore the faithful-port contract.
5. **[MINOR]** `README.md`'s fail-open rule implied all `input` handlers return `{action:"continue"}` on error, but `prompt-advisor.ts` returns `undefined` while `spec-gate-classify.ts` returns `{action:"continue"}`. Fixed to name both return shapes.

All 5 fixed; the path construction in `claude-hook-adapter.ts`, the raw-stdout handling in `session-start-context.ts`, the JSON-envelope parsing in `prompt-advisor.ts`, and the tmpdir-hash/CLI-invocation/recovery-chain-ordering fidelity of the `post-compaction.cjs` port were all independently confirmed correct.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two adapter patterns (spawnSync proxy vs. native port), chosen per hook | `session-prime`/`session-stop`/`user-prompt-submit` must not drift from the other 3 runtimes' state/transcript semantics, so they proxy into the same Claude dist files. `post-compaction` was ported natively because Pi's `session_compact` event already carries the real `compactionEntry.summary` in-process -- a proxy would be unnecessarily indirect for data Pi already has. |
| Bundle the 4 plain CLI-check advisories into one file rather than 4 near-identical files | They share identical bridging logic (spawn, capture stderr, notify) and were already designed as a group in cursor/devin's own SessionStart arrays; one file matches that grouping without boilerplate duplication. |
| Verify output-shape assumptions via isolated spawn tests before wiring into extension files | The three proxied dist hooks do NOT share a uniform stdout contract (plain text vs. nothing vs. JSON envelope) -- an untested assumption here would have shipped a silent no-op. |
| Document `permission-request-policy.mjs` and `spec-gate-prebind.mjs` as non-gaps rather than deferring them | Both hooks exist to work around a limitation Pi's own architecture does not have (a separate approval-gate event, a CLI-undelivered classification event); labeling them "deferred" would misstate the actual coverage. |
| Get an independent GLM-5.2 review before commit | New spawnSync-proxy code with hand-constructed payloads and a hand-cited file-path analogy is exactly where a plausible-but-wrong claim can hide; GLM's review caught 3 real blocking issues (1 factual, 1 citation, 1 null-guard bug) here. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live `pi --offline --approve -p "list your available tools"` smoke test | PASS -- exit 0, 0 extension-load errors, re-run 3 times across the build |
| Isolated spawn tests (`session-prime.js`, `user-prompt-submit.js`) | PASS -- confirmed real output shapes, caught and fixed the plain-text-vs-JSON assumption |
| `input`-transform composition check (`runner.js` `emitInput()` read) | PASS -- confirmed additive chaining, no regression to `spec-gate-classify.ts` |
| `validate_document.py` on `.pi/extensions/README.md` + manual HVR grep | PASS -- `VALID, 0 issues`; 1 self-introduced semicolon found by manual grep, fixed |
| `grep ": any\|<any>\|as any"` across all 6 new files | PASS -- 0 matches |
| GLM-5.2 independent review | REQUEST CHANGES -> all 5 findings (3 blocking, 2 minor) fixed -> re-validated clean |
| Whole-packet `validate.sh --recursive --strict` (parent + all 15 phases) | Run via the established main-tree round-trip pattern; result recorded at commit time |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A live provider-authenticated interactive-session trace confirming every new hook fires exactly as designed remains open**, inherited from phase 008 -- this phase's verification is a clean extension-load smoke test plus isolated spawn tests of each proxied dist hook, not a full interactive session trace under real credentials.
2. **`pi.sendMessage()`'s LLM-visibility is behaviorally confirmed but not exhaustively tested** -- a smoke-test session's response referenced content only present in the injected `session-prime.js` text, and `messages.ts`'s `convertToLlm()` type-confirms `CustomMessage` entries transform into LLM-compatible messages, but no test enumerated every mode (tui/rpc/json/print) this holds across.
3. **`task-dispatch-guard` and `completion-evidence-stop.cjs` remain deliberately deferred**, unchanged from phase 008/012 -- this phase did not attempt to resolve them.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
