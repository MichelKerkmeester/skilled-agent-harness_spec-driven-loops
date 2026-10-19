---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "pi opencode adapters implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/002-pi-opencode-adapters"
    last_updated_at: "2026-10-18T11:56:55Z"
    last_updated_by: "generate-context"
    recent_action: "Reconciled phase 002 at packet closure; all six rows Met"
    next_safe_action: "Verify nothing remains; phase 002 is complete and closed"
    blockers: []
    key_files:
      - "specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/goal.md"
    session_dedup:
      fingerprint: "sha256:e56b6b0586c781699ff7a1d08258bc9dd1d66e7d6cebeae57f20159faa89af75"
      session_id: "scaffold-002-pi-opencode-adapters"
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
| **Spec Folder** | 002-pi-opencode-adapters |
| **Completed** | 2026-10-17 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Pi and OpenCode now hand off automatically near their context limit through the shared session-relaunch core. Both runtime spikes returned AUTO and the wrapper carries the selected model, Pi extension selection and bound spec folder across hops.

### Phase 2: pi-opencode-adapters

The Pi extension and OpenCode plugin read runtime usage and send the same shared nudge. The wrapper arms only the verified runtimes. Follow-on fixes made the OpenCode nudge persist until a handoff note exists, corrected killer process spawning under Bun and kept model, extension and spec-folder context on each relaunch.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/session-relaunch.ts` | Created | Pi usage, nudge and handoff adapter |
| `.opencode/plugins/session-relaunch.js` | Created | OpenCode usage, nudge and handoff plugin |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` and shared core helpers | Created | Common nudge, context-usage and relaunch behavior |
| `.skilled/bin/skilled-loop` | Modified | AUTO runtime arms and carry of model, Pi extension arguments and spec-folder seed |
| Phase documentation and runtime rows | Updated | Verdicts, runbook scenarios and adapter records |

The spike verdicts are Pi 1.2.0 AUTO and OpenCode 1.19.0 AUTO (run-ledger D27 and `scratch/spike/SPIKE-REPORT.md`). The spike report keeps three limits visible: Pi TUI seed auto-send was source-verified but not exercised live, OpenCode TUI prompt auto-submit was not traced end to end and OpenCode `session.idle` on TUI quit plus wrapper-specific `process.ppid` were not directly captured.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Live Runs

| Run | relaunch.log evidence and result | Operator input and finding |
|-----|----------------------------------|----------------------------|
| OpenCode A | No copied log. The ledger records no note or prepare. At 0.05 the ~1M-token window did not trigger. At 0.02 the model did not recognize the one-shot nudge. | The operator lowered the threshold and stopped the run. Lane 2.4h made the active nudge persist until a note exists. The separate Pi probe found extension-selection flags were dropped on relaunch. Lane 2.5d added their carry. |
| OpenCode B | `live-oc-runB-relaunch.log`: prepare at 11:54:16 and relaunch at 12:01:05. No killer signal was logged, so this was not a counted hop. | The operator manually exited. The second Ctrl-C interrupted the fresh session before claim. Bun exposed `opencode.exe` as `process.execPath`, so the killer spawn launched OpenCode instead. Lane 2.4i switched the spawn to Node. |
| Pi run 1 | `live-pi-run1-relaunch.log`: prepare and SIGTERM at 12:21, relaunch at 12:22, second prepare and SIGTERM at 12:37, then hop-cap decline at 12:38. The note was claimed and completed. | The operator sent "Continue the live test." The receiver's Gate 3 answer was A. After a logic-sync prompt, the orchestrator chose claim and complete without prepare. This exposed low-threshold chaining to the hop cap and handoff steps in "Remaining work". Both notes carry to phase 004. |
| OpenCode C | No copied log. The ledger records that a note was written, then the model tried a nonexistent `prepare.mjs` path and got MODULE_NOT_FOUND. No hop occurred. | The operator interrupted the run. Lane 2.4j changed the nudge to stop on the relaunch record and fixed trimmed session-id matching. |
| OpenCode D | `live-oc-runD-relaunch.log`: prepare at 12:55:14, SIGTERM at 12:55:27 and relaunch at 12:55:27. The note was claimed and completed. | The receiver tried prepare because the sender listed handoff steps as remaining work. The orchestrator told it once to skip prepare and complete. Lane 2.4k corrected that wording. |
| OpenCode E | `live-oc-runE-relaunch.log`: prepare at 13:42:01, SIGTERM at 13:42:12, relaunch at 13:42:12 and no-file decline at 14:21. The note was completed. | The receiver answered Gate 3 with A. The orchestrator clarified that no adapter task was in scope and told it to complete. No further content correction was needed after lane 2.4k. |
| Pi run 2 | `live-pi-run2-relaunch.log`: prepare at 14:07:07, SIGTERM at 14:08:14, relaunch at 14:08:14 and no-file decline at 14:21. The note was completed. | The operator withdrew an incorrect instruction to leave the bound spec folder empty. The first session used `/speckit:save`. The receiver answered Gate 3 A and `/speckit:resume` mode A, skipped prepare and completed. The test session wrote continuity into this packet, so this summary's stale continuity fields were replaced. |
| OpenCode F | `live-oc-runF-relaunch.log`: prepare at 16:32:59, SIGTERM at 16:33:12, relaunch at 16:33:12 and no-file decline at 16:34. The note was completed. | The seed carried the bound spec folder and the receiver asked no Gate 3 question. No post-hop operator input was needed. OpenCode exposed no slash-command tool, so the model ran the continuity writer directly after the orchestrator allowed it once. Carry this finding to phase 004. |

The six copied relaunch logs and matching notes are under `scratch/live-*`. Runs A and C have ledger evidence only and no copied relaunch log.

### Verification

| Check | Result |
|-------|--------|
| Node suite | 170/170, fail 0 (run-ledger D54 and PG1) |
| Pi adapter tests | Vitest 11/11 (D54 and PG1) |
| OpenCode plugin tests | 20/20 (D47) |
| Hook-registration-sync tests | Vitest 7/7 (PG1) |
| Hook registration | PASS, 32 hooks and 19 Pi extensions resolve (PG2) |
| Runtime mirrors and doctor | Runtime mirror sync PASS 189. Doctor checkers rc=0: Codex agents 11, Codex prompts 38, roster OK, catalog OK, Codex hooks OK, Pi agents 11 and Pi prompts 38 (PG3) |
| Drift guards | 4/4 (PG4) |
| Shell and rule checks | shellcheck 0 and check-rule-copies 0 (D54 and PG5) |
| Pi load smoke | Explicit-extension Pi smoke returned rc=0 (AC-2.3 smokes). The plain command returned rc=1 then, because a duplicate `--fast` extension was installed globally and in the worktree. After that duplicate was removed, the plain command exited 0 on 2026-10-19 (`../008-review-3-remediation/evidence/phase-002-smokes-2026-10-19.txt`). |
| OpenCode import smoke | Importing the plugin and printing `typeof m.default` produced `function` (D30 and AC-2.3 smokes). The literal planned command printed `ok` on 2026-10-19 (same evidence file). |
| Lane 2.6c playbook | Document and package validators rc=0, with one pre-existing package warning elsewhere. The orchestrator's own rerun then closed AC-006 (run-ledger.md:194 and 198). |
| Strict packet validation | RESULT: PASSED once the closure docs were updated. |

### Deviations from the Ledger Plan

- The D29 shell fixture changed from `bash -c "sleep 30"` to `sleep 30; true` because the shell replaced itself with `sleep`. The assertion was tightened after sandbox `ps` failed with EPERM and caused a false pass. The rerun was 116/116.
- The spike's OpenCode command bumped its package files. The orchestrator restored both to their HEAD content, leaving the package pin clean (D27).
- The D53 review found a copied AGENTS rule over the size limit. The orchestrator shortened that line and `check-rule-copies` returned 0.
- AC-003 first closed on the isolated Pi extension smoke and the observed OpenCode import result, because the plain Pi command failed on a duplicate `--fast` registration. Both literal commands passed on the 2026-10-19 rerun.
- Lane 2.6b stopped after stale playbook anchors. Lane 2.6c later reported its playbook validators passing, and the orchestrator's rerun closed AC-006.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Both spikes returned AUTO. | D27 and the spike report verified usage, nudge, arm and seed surfaces for Pi and OpenCode. |
| Both adapters reuse the shared relaunch and context-usage core. | This keeps state handling common while each runtime owns its event integration. |
| Carry model, Pi extension selection and bound spec folder across hops. | D40, D43 and D52 closed the corresponding wrapper carry work. |
| Use OpenAI `gpt-6-luna` for live runs. | The ledger's operator guidance selected this model and provider for both runtimes. |
| Leave the root feature catalog's other-runtime wording for phase 004. | D36 records that it still says those runtimes are planned. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase acceptance | AC-001 through AC-006 marked Met with cited evidence. |
| Packet validator | RESULT: PASSED after the orchestrator refreshed the generated metadata. An earlier run had failed on SOURCE_FINGERPRINT_MISMATCH and description drift. |
| Evidence boundary | Summary claims cite run-ledger D25-D60, the spike report and the six copied live-run logs plus notes. Orchestrator-run outputs are cited from PG1-PG5. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **AC-006 closed late.** Lane 2.6c reported the playbook validators passing at D60, and AC-006 stayed open until the orchestrator's own rerun (run-ledger.md:194 and 198).
2. **Eight SWE P2 findings carry to phase 004.**
   - D35: the shared `.pi/types` shim lacks the event types the extension uses.
   - D39: a leading-dash value such as `--model --resume` is ambiguous in the wrapper.
   - D44: missing `-e` directories produce cd stderr noise.
   - D44: `-e --` consumes the delimiter.
   - D44: space-path and multi-hop extension tests are missing.
   - D48: an armed record left after a SIGKILLed killer can suppress a nudge without an age check.
   - D48: restart lookup ignores note status.
   - D55: corrupt relaunch-file handling calls `appendLog` without a guard at `relaunch-core.cjs:340`.
3. **Other phase 004 carryovers.** The root feature catalog still says other runtimes are planned (D36). OpenCode offers no slash-command tool to the live model (run F). Pi's low test threshold can chain through the hop cap and the nudge wording should keep handoff steps out of "Remaining work" (Pi run 1).
4. **Spike limits remain recorded.** Pi TUI seed submission and OpenCode TUI prompt submission were not end-to-end live-tested. OpenCode TUI quit behavior for `session.idle` and wrapper-specific `process.ppid` were not directly captured.
<!-- /ANCHOR:limitations -->

---


