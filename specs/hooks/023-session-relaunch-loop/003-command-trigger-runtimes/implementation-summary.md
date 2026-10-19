---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "command trigger runtimes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/003-command-trigger-runtimes"
    last_updated_at: "2026-10-18T11:56:34Z"
    last_updated_by: "generate-context"
    recent_action: "Closed CHK-012 and CHK-141 with the mirror review and the phase 004 live runs"
    next_safe_action: "Verify nothing remains; phase 003 is complete and closed"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/hooks/session-relaunch/codex/stop-arm.mjs"
      - ".skilled/hooks/session-relaunch/hermes/session-end-arm.mjs"
      - ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md"
      - ".hermes/prompts/speckit-handoff.md"
    session_dedup:
      fingerprint: "sha256:6579078f1b5217f78d2283e6ba404227a65e673405b8c57db6b6265b207036ad"
      session_id: "scaffold-003-command-trigger-runtimes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-command-trigger-runtimes |
| **Completed** | 2026-10-17 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All seven named runtimes can now enter the session-relaunch loop. Codex and Hermes got automatic arm-plus-kill adapters on events the spike captured firing. Cursor and Devin enter on the `/speckit:handoff` command. `skilled-loop` carries a case arm for each of the four.

### Phase 3: command-trigger-runtimes

The spike returned AUTO for Codex 0.162.1 and Hermes 0.21.1, and COMMAND-ONLY for Cursor and Devin (run-ledger D57, D58, D62; `scratch/spike/SPIKE-codex.md`, `SPIKE-cursor-hermes.md`, `SPIKE-devin.md`). Codex fires `Stop`, `SessionEnd` and `UserPromptSubmit` in both TUI and exec modes, and its rollout `token_count` record carries usage. Hermes fires `on_session_end` after every message and reports usage through `post_api_request`; the repo-guards plugin bridges both to the Node adapters, so the operator's config stays untouched. Cursor's evidence is source-only because its credentials were expired and `stop` is not wired in `.cursor/hooks.json`. Devin's hook usage is unverified and it has no command-mirror surface.

On a command-only runtime you run `/speckit:handoff`. It writes the note and runs `prepare`, which prints the per-runtime manual claim command outside the loop. A `skilled-loop <runtime> "[session-relaunch] claim and continue handoff <path>"` launch finishes the hop. On an AUTO runtime the adapter arms the pending record at turn end and the killer restarts the session once it goes idle.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | One case arm per runtime: `codex`, `cursor` (launches `cursor-agent`), `hermes` and `devin`; per-runtime manual claim command; model and provider carry |
| `.skilled/hooks/session-relaunch/codex/` (`context-nudge.mjs`, `prompt-seed.mjs`, `stop-arm.mjs`, `shared.mjs`) | Created | Codex adapter: `UserPromptSubmit` seed detection, `PostToolUse` threshold nudge, `Stop` arm-plus-kill |
| `.skilled/hooks/session-relaunch/hermes/` (`context-nudge.mjs`, `session-end-arm.mjs`) | Created | Hermes entry points bridged by the repo-guards plugin |
| `.hermes/plugins/repo-guards/` (`__init__.py`, `plugin.yaml`, tests) | Modified | Records `post_api_request` usage per session, nudges on `pre_llm_call`, arms on `on_session_end`, clears usage on finalize and reset |
| `hook-registry.json`, `.codex/hooks.json`, `.codex/hooks/` symlinks | Modified / Created | Three Codex hook rows rendered by `sync-hook-registrations.cjs`; three mirror symlinks added by `sync-runtime-mirrors.cjs` |
| `.skilled/hooks/session-relaunch/tests/` (`codex-adapters.test.cjs`, `hermes-adapters.test.cjs`, `skilled-loop.test.cjs`) | Created / Modified | Stub-runtime wrapper tests for all four arms plus AUTO adapter suites |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | Review-confirmed fix (D72 P0): `prepare` accepts all seven wrapper runtimes |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `lib/killer.cjs` | Modified | Review-confirmed fix (D80): one `manualClaimCommand` per runtime shared by the CLI and the killer |
| `/speckit:handoff` mirrors | Created | `.hermes/prompts/speckit-handoff.md` added (D68); Codex and Cursor mirrors already resolved to the canonical command; Devin has no surface |
| `.skilled/hooks/session-relaunch/README.md`, `.skilled/hooks/README.md` | Modified | Runtime adapter matrix and coverage rows naming all seven runtimes (README.md:13-21, hooks/README.md:28,186) |
| `feature-catalog/context-preservation/session-relaunch-loop.md`, `manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md`, indexes | Modified | Catalog entry and four-runtime scenario doc |
| `003-command-trigger-runtimes/scratch/spike/` | Created | Three spike reports and 30 raw captures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Tests went first in every build lane and each lane recorded a red run before its green one: D63 wrapper arms, D64/D66 the two adapter lanes (red 7 Node and 5 Python), D70 the devin arm (red 4 fails, including devin falling through to claude), D79 the killer-target fix (red 2), D80 the shared manual command (red 5) and D81 the wrapper print path (red 3).

SWE reviewed every diff that landed. D67 passed the arms. D72 failed the Codex adapter on one P0: `prepare` rejected `SKILLED_LOOP_RUNTIME=codex`, which also broke `/speckit:handoff` on cursor, hermes and devin. D73 failed the Hermes adapter on two P1s: usage popped per message killed the nudge, and the same prepare rejection. D77 confirmed a further P1 in the fix (codex stop-arm targeted the transient `process.ppid`) plus a P2 that the manual claim command was wrong for hermes and opencode. D83 closed the loop: PASS with 0 P0 and 0 P1, a live `bash -c` probe proving the loop's direct child resolution, and end-to-end codex and hermes runs through prepare, arm, SIGTERM and `should-relaunch` true.

The Luna quota deviation reshaped the back half. Lanes 3.4d and 3.4e were dispatched to Luna and never ran: the Codex usage limit reset on Oct 22 08:13 and no file was touched (D74, D75). The operator answered "I build these two fixes" (D76), so the orchestrator wrote both fixes and SWE re-reviewed them. The standing quota answer had been "Wait for Luna" (run-ledger H6, line 72); for these two P0/P1 fixes the operator chose the faster path. The same quota pushed lane 3.6 docs from Luna to SWE (D78) and this closure lane to SWE (D84). Two more operator answers are quoted in the ledger: "Amend the 003 out-of-scope line (Recommended)" after D80 touched the frozen `relaunch-core.cjs` and `killer.cjs` files, and the earlier "Wait for Luna" that governed the phase 001 and 002 quota pauses.

One recorded spike deviation: the Hermes live run used `--provider llmgateway`, the only Hermes provider configured, which parent decision D7 forbids (D58). And one review gap carried to phase 004: the SWE mirror lane D68 got no Luna read-only review, so the orchestrator's `sync-prompts-hermes --check` PASS 38 stands in (run-ledger line 299).

### Verification

| Check | Result |
|-------|--------|
| `node --test`, 15 concern files plus OpenCode plugin test | PASS, 214/214, fail 0 (PG1) |
| repo-guards pytest (Hermes bridge) | PASS, 59/59 (PG1) |
| `hook-registration-sync.vitest.ts` | PASS, 7/7 (PG1; pin bumped 95 to 98 at D64) |
| `sync-hook-registrations.cjs --check` | PASS, 32-hook registry, 19 Pi extensions; delta is the 3 Codex rows (PG2) |
| `sync-runtime-mirrors.cjs --check` | PASS, 192 mirrors across 8 trees (PG3) |
| `run-all-drift-guards.sh` | PASS, 4/4, 278 warnings at baseline; `verify_alignment_drift.py` 0 findings on 31 session-relaunch files and 3 repo-guards files (PG4) |
| Comment-hygiene grep over touched code | 0 hits (PG4) |
| `shellcheck .skilled/bin/skilled-loop`, `check-rule-copies.js` | rc=0 both (PG5) |
| Doc validators | `validate_document` rc=0 on 9/9 docs plus the concern README, 0 issues; `hvr_scan` 0 hard blockers on new files; playbook package rc=0 with 1 pre-existing WARN elsewhere (PG6, D78, D82) |
| Playbook scenarios | Automatable checks pass inside PG1. The live checks ran in phase 004 lane 4.5: Codex PASS, Devin PASS, Hermes and Cursor SKIP by operator decision (`session-relaunch-command-runtimes.md:96-101`) |
| Scope receipt | 84 changed paths outside `specs/`, each mapped to a lane family (PG8) |
| `validate.sh 003-command-trigger-runtimes --strict` | RESULT: PASSED (this lane, final state) |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `/speckit:handoff` is the baseline trigger on all four runtimes | ADR-001: a manual trigger needs no usage signal and stays identical across runtimes |
| Adapters ship only where the spike captured a firing event | ADR-002: a hook that never fires is dead weight, so Codex and Hermes got adapters and Cursor and Devin stayed command-only |
| Codex binds three separate scripts, not one | The Codex hook installer allows each script under one event only, so `prompt-seed.mjs`, `context-nudge.mjs` and `stop-arm.mjs` split the surface (D65, contract 12.5) |
| Hermes bridges through the enabled `repo-guards` plugin | Contract 12.3: the plugin is already enabled, so the operator's config needs no change and `on_session_end` arms at every message |
| The Codex killer target is the loop's direct child | Codex exports no pid variable, so `findCodexPid` walks the ancestor chain to the child of `SKILLED_LOOP_ID` before arming (D79, SPIKE-codex.md) |
| `prepare` accepts all seven wrapper runtimes | D72 proved a codex prepare exited 2; without the fix a command-trigger hop could not even write its pending record |
| One `manualClaimCommand` per runtime, shared by CLI and killer | D80 removed divergent printed commands; the scope amendment was operator-approved ("Amend the 003 out-of-scope line (Recommended)") |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Acceptance criteria | AC-001 through AC-005 marked Met in `acceptance-criteria.md`, each Verification cell citing the observed evidence |
| Gate PG (plan section 11, final state) | PG1-PG8 all PASS, recorded at run-ledger.md:290-298 |
| `validate.sh <this folder> --strict` | RESULT: PASSED, Errors 0 (orchestrator's lane and this closure run) |
| Live runs on Codex, Cursor, Hermes and Devin | Run in phase 004 lane 4.5, as spec.md scopes them: Codex PASS (run 6), Devin PASS (swe-2-max), Hermes and Cursor SKIP by operator decision |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live runs landed in phase 004 lane 4.5.** Codex and Devin passed. Hermes and Cursor have no live run, by operator decision, so their automatic and command paths rest on the stub-runtime and adapter tests.
2. **Carried P2 findings from the D77 and D83 reviews.** All eight were fixed later in the run, tests first: the Hermes window (D89), the own-property lookup and `!` escaping (D85, D91), the event-name gate and spawn-failure rule (D87), the runtime-neutral busy error (D86, D92), the pid miss, now printed and consumed by the wrapper on a pending exit (D91), and the unset-runtime default (D86, D93). The findings were:
   - Hermes never reports the context window, so fill uses `SESSION_RELAUNCH_WINDOW_TOKENS` or the 200K default and a 128K model reads low (D77).
   - `manualClaimCommand` looks up `RUNTIME_SEED_OPTIONS` without an own-property check (`relaunch-core.cjs:449`, D83).
   - Codex `stop-arm` and Hermes `session-end-arm` do not gate on `hook_event_name` (D83).
   - A target-pid miss leaves the record pending forever with no printed manual command (D83).
   - The busy-shell error says "Claude" under every runtime (`session-relaunch.cjs:223`, D83).
   - Killer-spawn failure restores pending on Hermes but leaves the record armed on Codex (D83).
   - `!` is not escaped in the printed manual command, so interactive bash history expansion can bite (D83).
   - The exit-3 manual command defaults to claude when `SKILLED_LOOP_RUNTIME` is unset (D83).
3. **Review gap, closed.** The SWE mirror lane D68 got its Luna read-only review once the quota returned (D143 VERDICT PASS).
4. **Cursor's verdict rests on source-only evidence.** The installed bundle's hook dispatch was inspected but no live payload was captured, since the machine's Cursor credentials were expired and no permitted provider exists for Cursor (SPIKE-cursor-hermes.md caveats).
5. **Codex `SessionEnd` under the interactive TUI was not captured.** The pty probe was killed rather than cleanly quit; `Stop` is the proven arm trigger and `SessionEnd` the exit-side signal (SPIKE-codex.md caveats).
<!-- /ANCHOR:limitations -->

---
