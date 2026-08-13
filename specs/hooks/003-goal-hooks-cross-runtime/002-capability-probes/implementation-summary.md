---
title: "Implementation Summary: Cross-runtime goal hook capability probes"
description: "Three live capability probes complete: Pi turn-end event confirmed, Devin Stop block/continue confirmed live, Cursor preToolUse refresh confirmed non-delivering"
trigger_phrases:
  - "capability probe summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/002-capability-probes"
    last_updated_at: "2026-08-11T06:43:14.944Z"
    last_updated_by: "claude"
    recent_action: "Ran all three live capability probes and recorded the matrix"
    next_safe_action: "Hand fixed tiers to phases 003/004/005 adapter implementation"
    blockers: []
    key_files: ["capability-matrix.md", "spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-002-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Devin's Stop hook decision:block forces genuine continuation (live transcript proof)."
      - "Pi's types.d.ts exposes turn_end/agent_end/agent_settled, all subscribable."
      - "Cursor's preToolUse agent_message does not reach model-visible context (live transcript proof)."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-capability-probes |
| **Completed** | 2026-07-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three live/direct-read capability probes, each cited by evidence, plus a capability matrix (`capability-matrix.md`) fixing the honest parity tier for phases 003 (Devin), 004 (Cursor), and 005 (Pi) before any adapter code exists.

- **Probe (a) — Pi event surface**: direct read of the installed `types.d.ts` (`/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/types.d.ts`). Found `TurnEndEvent` (`type:"turn_end"`, line 549), `AgentEndEvent` (`type:"agent_end"`, line 534), and `AgentSettledEvent` (`type:"agent_settled"`, line 539) — all fire at agent/turn boundaries distinct from `SessionShutdownEvent`, and are all subscribable via `ExtensionContext.on(...)` (lines 867-870).
- **Probe (b) — Devin Stop block/continue**: live probe in an isolated `/tmp` workspace mirroring the DV-008 playbook pattern (throwaway `.devin/hooks.v1.json`, real repo's `.devin/hooks.v1.json` untouched). A `Stop` hook script returned `{"decision":"block","reason":"..."}` on its first invocation. Result: **CONFIRMED** — `devin -p` genuinely continued. Direct evidence from the real session transcript (`~/.local/share/devin/cli/transcripts/caring-diver.json`): step 8 the agent said "Hello!" and stopped; step 9 the hook's `reason` text was injected verbatim as a synthetic `user` turn; step 10 the agent produced a new turn ("Got it — no action taken.") in direct response. The hook fired twice; `stop_hook_active` was `false` on the first call and `true` on the second (the same loop-guard field/semantics as Claude Code's Stop contract).
- **Probe (c) — Cursor preToolUse refresh**: live probe in an isolated `/tmp` workspace with a throwaway `.cursor/hooks.json` (real repo's `.cursor/hooks.json` untouched). A `preToolUse` hook returned `agent_message` containing an explicit instruction to echo a distinctive token in the model's next reply. Result: **CONFIRMED non-delivery** — the hook fired (payload logged), but the raw model transcript (`~/.cursor/projects/private-tmp-cli-cursor-pretooluse-probe-*/agent-transcripts/*.jsonl`) contains zero occurrences of the marker text anywhere in the user/assistant turns, and the model's final reply never referenced it. This is direct transcript-level proof, stronger than the prior packet's self-report caveat (`009-cursor-hooks-lifecycle/002-cursor-hooks-live-wiring/implementation-summary.md:68`), which only had the model's own (explicitly unreliable) account to go on.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `capability-matrix.md` | Created | Full evidence table for all three probes, status legend, fixed parity tiers |
| `spec.md` | Modified | Status → Complete; capability matrix populated; open questions resolved |
| `003-devin-goal-hooks/spec.md` | Modified | `Stop` adapter scope fixed to verify-and-continue; open question resolved |
| `004-cursor-goal-hooks/spec.md` | Modified | Optional `preToolUse` refresh dropped; scope fixed to `sessionStart`+`sessionEnd` only |
| `005-pi-goal-hooks/spec.md` | Modified | Turn-end verify scope fixed to implemented; auto-continue mechanism flagged UNKNOWN for that phase to resolve |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Read `spec.md`/`plan.md`/`tasks.md` for this phase to confirm scope and evidence discipline (no inference from schema similarity alone).
2. Probe (a): read `types.d.ts` directly with `grep`/`Read`; confirmed the `on()` overload signatures for `turn_end`/`agent_end`/`agent_settled` exist and take no result type.
3. Checked prior packet evidence for Devin (`029-cli-devin-revival/hook-testing-results.md`, `013-devin-permission-request-handler/implementation-summary.md`) — found `Stop` confirmed to fire and `stop_hook_active` documented in the payload, but no prior test of `decision:"block"` specifically for `Stop` (only `PermissionRequest`'s `decision` field was tested and found NOT honored by devin 3000.2.17's non-interactive runtime — a different hook/decision pair, not assumed to generalize).
4. Confirmed `devin` installed and authenticated (`command -v devin`, `devin auth status`).
5. Built an isolated `/tmp` workspace (`mktemp -d`) with a throwaway `.devin/hooks.v1.json` registering only a `Stop` hook pointed at a counting probe script; dispatched `devin -p "Say hello..." --model adaptive --permission-mode auto </dev/null`; read the resulting session transcript from `~/.local/share/devin/cli/transcripts/`.
6. Checked prior Cursor evidence (`mcp-server/hooks/cursor/README.md` §2 delivery table, `030-cli-cursor-creation` packet) — found `sessionStart`/`preToolUse`/`sessionEnd` all confirmed to fire, and a documented caveat that model self-report is an unreliable oracle for whether injected context was actually seen.
7. Confirmed `cursor-agent` installed (`command -v cursor-agent`). Built an isolated `/tmp` workspace with a throwaway `.cursor/hooks.json` registering only a `preToolUse` hook returning an `agent_message` with an explicit compliance-testable instruction; dispatched `cursor-agent -p "List the files..." --force </dev/null`; read the resulting raw model transcript from `~/.cursor/projects/<slug>/agent-transcripts/<id>/<id>.jsonl` (not just the CLI's final stdout) to check for the injected marker's presence in the actual conversation sent to the model.
8. Wrote `capability-matrix.md`, updated this phase's `spec.md` matrix/open-questions/status, and updated phases 003/004/005 `spec.md` scope sections per REQ-006.
9. Deleted both `/tmp` probe workspaces after evidence capture; the real `.devin/hooks.v1.json` and `.cursor/hooks.json` were never touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Embed the capability matrix in `spec.md` (summary) with full evidence in a separate `capability-matrix.md` | The spec-level table stays scannable; the full evidence table (file:line citations, transcript paths) is large enough to warrant its own file, which `spec.md` now references. |
| Use isolated `/tmp` workspaces mirroring the repo's existing DV-008/live-wiring probe methodology for both Devin and Cursor | Matches established, reviewed precedent in this repo (`cli-devin/manual-testing-playbook/hooks/permission-request-auto-vs-bypass.md`, `030-cli-cursor-creation` live-fire tests) rather than inventing a new harness pattern; keeps the real `.devin/hooks.v1.json`/`.cursor/hooks.json` untouched per the task's explicit instruction. |
| Trust raw transcript files over CLI stdout or model self-report for both live probes | The repo's own prior finding (Cursor sessionStart self-report unreliable) generalizes: a model's account of what it saw is not proof either way. Both probes here instead read the actual on-disk conversation/event transcript (Devin: `~/.local/share/devin/cli/transcripts/*.json`; Cursor: `~/.cursor/projects/*/agent-transcripts/*.jsonl`) as the load-bearing evidence. |
| Do not run Pi live for probe (a) | REQ-001's acceptance criteria only requires a direct, cited read of the installed `types.d.ts`, which unambiguously answers the question (typed `on()` overloads exist for `turn_end`/`agent_end`/`agent_settled`); no live dispatch was needed to answer "does a usable event exist." |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Probe (a) — Pi `types.d.ts` event read | PASS | `TurnEndEvent`/`AgentEndEvent`/`AgentSettledEvent` confirmed, all subscribable (`types.d.ts:534-554,867-870`) |
| Probe (b) — Devin `Stop` hook block/continue live test | PASS — CONFIRMED SUPPORTED | Live transcript proof, `~/.local/share/devin/cli/transcripts/caring-diver.json` |
| Probe (c) — Cursor `preToolUse` refresh live test | PASS — CONFIRMED NON-DELIVERY | Live transcript proof, `~/.cursor/projects/.../agent-transcripts/*.jsonl` shows zero marker occurrences |
| Capability matrix population | PASS | `capability-matrix.md`, no TBD cells for the three in-scope probe results |
| Phases 003/004/005 scope updated (REQ-006) | PASS | All three child `spec.md` files updated with the fixed tiers |
| `validate.sh --strict` (this folder) | PASS | See parent packet report for exact invocation/output |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Devin's auto-continue mechanism is proven for `Stop` specifically; Cursor has no equivalent to test.** Cursor's `stop` event never fires under the installed CLI build (confirmed in a prior packet), so there was no session-level decision surface to probe at all — Cursor's verify/continue tier is "unsupported" by absence of a working hook, not by a tested-and-failed decision field.
2. **Pi's auto-continue mechanism is explicitly left UNKNOWN.** `turn_end`/`agent_end`/`agent_settled` handlers have no result type in the installed `types.d.ts` (`Promise<void> | void`), so they cannot force continuation via a return value the way Devin's `Stop` can. Whether Pi has some other mechanism (e.g., an extension queuing a follow-up input) was out of scope for this phase's three named probes and is left for phase 005 to investigate before it claims any continuation behavior.
3. **Cursor's `agent_message` non-delivery finding is scoped to `preToolUse` under the currently installed `cursor-agent 2026.07.23-e383d2b` (model `composer-2.5`).** `sessionStart`'s `agent_message` is known to be returned in the JSON envelope (`004-cursor-hook-adapter-layer/implementation-summary.md:81`) but this phase did not re-run a transcript-level check for `sessionStart` specifically — the matrix records that gap honestly as RECORDED-EVIDENCE rather than CONFIRMED end-to-end.
4. **Devin's `PermissionRequest` decision field is documented (prior packet) as NOT honored by devin 3000.2.17's non-interactive runtime.** This phase's `Stop`-hook finding is a different hook/decision pair and does not contradict that — both are now separately, correctly evidenced rather than assumed to generalize from one another.
<!-- /ANCHOR:limitations -->
