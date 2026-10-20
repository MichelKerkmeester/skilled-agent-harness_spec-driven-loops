---
title: "Implementation Summary"
description: "All 17 repository plugins now act on OpenCode 2, not only load there. The v2 bridge reports v2's shell and subagent tools under their v1 names, announces each session once with session.created, and fills the message events v1 plugins read, so the seven plugins that did nothing on v2 now show their effect in a live run."
trigger_phrases:
  - "v2 bridge plugin effects implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/035-v2-bridge-plugin-effects"
    last_updated_at: "2026-10-20T21:35:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded CI at the pushed main commit and closed the phase"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".opencode/plugins/lib/v2-bridge.js"
      - ".opencode/plugins/tests/v2-bridge.test.cjs"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh"
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/035-v2-bridge-plugin-effects/scratch/live-runs/results-matrix.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-035-v2-bridge-plugin-effects"
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
| **Spec Folder** | 035-v2-bridge-plugin-effects |
| **Completed** | 2026-10-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Seven plugins loaded on OpenCode 2 and then did nothing, because the bridge passed v2's tool names and events through unchanged. The fix sits in the one shared bridge, so no plugin file changed, and a live run now shows all 17 plugins acting on both versions.

### OpenCode 2 bridge

The bridge now hands v1 hooks the names and shapes they were written for. A v2 `shell` call reaches a hook as `bash`, and a `subagent` call as `task` with `subagent_type` set from `agent`. A changed agent goes back to v2 under `agent`, and the added field never reaches v2's input. A `shell` result gives the after hook its text as a string. Each session gets one `session.created`, delivered before its first other event or its first system transform. A transform that arrives while that delivery is still running waits for it. The mapped `message.updated` carries `sessionID` and `info.time.completed`, and a user inbox item becomes a user message with its text part. With those fields, session-relaunch records usage and can seed a handoff.

### Playbook runner

The five follow-ups from the last 034 review are closed:
- The commit-gate probe runs against a disposable repository that reads this checkout's commit rules. Its block stops with FAIL when `HEAD` moves or the refusal is missing.
- The runner refuses an evidence folder outside its checkout. It checks the path as given and again after resolving it, which catches `..` segments and symlinks.
- The goal scenario removes its state folders on an interrupted run.
- The sentinel and dist-freshness restores keep their backup and trap until the restored file matches.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/lib/v2-bridge.js` | Modified | Tool aliases, session announcement, message event fields |
| `.opencode/plugins/tests/v2-bridge.test.cjs` | Modified | A test per mapping, plus the concurrency and inherited-name cases |
| `.opencode/plugins/ARCHITECTURE.md`, `.opencode/plugins/README.md` | Modified | Describe the mappings and point at the live result |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/` | Modified | The runner check, five scenario fixes and the triage text for the new mappings |
| `035-v2-bridge-plugin-effects/scratch/live-runs/` | Created | Raw v2 probe, test baseline, every scenario's output and the results matrix |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A raw v2 probe plugin first logged the unbridged event envelopes, tool hook events and context calls. It confirmed all four causes from 034, and it showed that each envelope carries a `created` time and that a user prompt arrives as `session.inbox.enqueued`. OpenCode 1 running DeepSeek v4.1 flash at high effort wrote each change from a short brief. The orchestrator read each diff, reran the tests and fixed two concurrency details itself: a transform now waits for an announcement already in flight, which a test that fails without it covers, and an event-hook error on that path is recorded for cleanup instead of failing the request. Every scenario block then ran live on both versions, one at a time, so that two runs never wrote to the same log. Luna reviewed read-only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the shared bridge, not each plugin | The operator chose it on 2026-10-20. One mapping serves every plugin, and a new plugin gets it for free |
| Announce a session from the event stream or the first transform, whichever comes first | The first `context` call can run before the stream delivers the session's first event, and session-cleanup's startup warning must reach the first request |
| Take `info.time.completed` from the envelope's `created` time | The step event has no completion field; `created` is the moment v2 recorded the step's end, so no value is invented |
| Keep the scenario temp files in the system temp folder | The runner's snapshot and the scenario backups are removed by their traps. Putting the snapshot inside the watched log trees would mix it into the run's effects. Luna's first-round finding on this was declined for that reason |
| Keep the 034 matrix unchanged | It records what OpenCode 2 did before the fix; this phase's matrix is the after picture |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Plugin suite `node --test '.opencode/plugins/tests/*.test.cjs'` | PASS, 458 of 458 (436 before this phase, `scratch/live-runs/baseline-tests.txt`; after, `scratch/live-runs/verification.txt`) |
| Bridge mutations (`scratch/live-runs/verification.txt`) | In-flight check moved after the announced check: 2 tests fail. No `shell` alias: 3 fail. No announcement from the stream: the suite hangs until its alarm. The restored file is identical and passes 51 of 51 |
| Purity vitest `opencode-plugins-folder-purity.vitest.ts` | PASS, 1 of 1 (`verification.txt`) |
| Version battery in worktree 176 | PASS on v1 (4 legs) and v2 (4 legs) (`verification.txt`) |
| Battery unit tests | PASS, 50 of 50 (`verification.txt`) |
| Live playbook, all 17 scenarios on v1 and v2 | 17 of 17 PASS on each version; every block exited 0 (`scratch/live-runs/results-matrix.md`) |
| Shell legs of dist-freshness and spec-gate on v2 | dist-freshness logs `risky-bash:` on both; spec-gate behaves the same on both (`scratch/live-runs/shell-legs.txt`) |
| Runner evidence-folder check | Refuses `/tmp/...`, a `..` path and a path through an in-checkout symlink to an outside folder, creating nothing through the link (`verification.txt`) |
| Playbook package validator | PASS, 72 scenarios, 14 categories, 0 violations (`verification.txt`) |
| Luna review round 1 | FAIL: 4 P1 and 1 P2. Three P1s and the P2 were fixed; one P1 was declined (see Key Decisions) |
| Luna review round 2 | FAIL: 2 P1 and 5 P2, all fixed |
| Luna review round 3 | FAIL: 2 P1 and 3 P2. The ungated live advisor check, the evidence rows and the reset citation were fixed. The temp-folder finding repeats round 1's and stays declined. The README's `session.deleted` observation comes from phase 034's probe, not this packet, and stays |
| Luna review round 4 (final) | PASS, no P1 findings; bridge suite 51 of 51 |
| Recursive strict validation of 082 | 36 `RESULT: PASSED`, 0 failed, before the push |
| CI at `86c9aba3f8` on main | 13 of 14 workflows passed, including OpenCode Plugin Tests 39506282540, OpenCode Dual-Version Battery 39506282632 and Spec-Kit Check 39506282668. sk-doc Script Tests 39506282412 failed only in `test_readme_manifest.py`, on `.skilled/hooks/session-relaunch/lib`, a folder main's merge `2aee29cd64` added; this phase touched neither |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shell redirect writes pass the spec gate on both versions.** The gate's core finds no file path in a shell command and allows it. This behaves the same on v1 and v2 and is not a bridge gap.
2. **A model can skip the requested tool.** In the full pass, the v1 spec-gate run asked the documentation question instead of calling `write`. A rerun with the same prompt called it and was denied. A FAIL caused by a missing tool call needs one rerun before it counts.
3. **The sentinel's wording follows the packet's state.** Phase 034 is closed, so the advisory now reports items with no evidence marker rather than an incomplete P0 count. The scenario check accepts both wordings.
<!-- /ANCHOR:limitations -->

---
