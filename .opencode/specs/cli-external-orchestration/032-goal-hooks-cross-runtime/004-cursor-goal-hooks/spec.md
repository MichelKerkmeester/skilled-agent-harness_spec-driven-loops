---
title: "Feature Specification: Cursor goal hooks"
description: "Port the runtime-neutral goal core to Cursor via a sessionStart-only prebind-style injection adapter (goal-inject.mjs), the fixed injection-only tier per phase 002's capability matrix, with fail-open behavior everywhere since Cursor hooks are shared with the editor, not just CLI dispatch."
trigger_phrases:
  - "cursor goal hooks"
  - "cursor sessionStart goal injection"
  - "cursor goal fail-open"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/004-cursor-goal-hooks"
    last_updated_at: "2026-07-29T05:10:00Z"
    last_updated_by: "claude"
    recent_action: "Built goal-inject.mjs sessionStart adapter, tested, live-smoked, registered"
    next_safe_action: "None — phase complete; successor is 005-pi-goal-hooks"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/cursor/goal-inject.mjs"
      - ".opencode/hooks/goal/cursor/goal-cursor.test.mjs"
      - ".cursor/hooks.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cursor's beforeSubmitPrompt/prompt-submit path is confirmed non-delivery, same workaround class as spec-gate-prebind."
      - "Cursor hooks are shared with the editor, so fail-open is a hard requirement, not a preference."
      - "Phase 002 fixed the tier at sessionStart-only injection; sessionEnd verify and preToolUse refresh both dropped."
      - "Live smoke (2 dispatches, raw transcript inspection) found zero occurrences of the injected marker in model-visible content, extending phase 002's RECORDED-EVIDENCE finding with a negative signal — reported honestly, not overclaimed as CONFIRMED non-delivery on n=2."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Cursor goal hooks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Branch** | `skilled/v4.0.0.0` (direct, per parent packet's operator choice) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `003-devin-goal-hooks` |
| **Successor** | `005-pi-goal-hooks` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A goal set for the work does not survive into a Cursor session. OpenCode has passive per-turn goal injection via `mk-goal.js`; Cursor has nothing, and its most natural injection surface (`beforeSubmitPrompt`) is confirmed non-delivery, ruling out the straightforward per-turn approach used elsewhere.

### Purpose

Port the runtime-neutral goal core (built in phase 001) to Cursor using `sessionStart`, the one hook surface phase 002's capability matrix fixed as Cursor's honest parity tier — "injection-only, `sessionStart`-once." Injection is built prebind-style (the same workaround class already used for `spec-gate-prebind`) since there is no reliable per-turn re-injection surface: `preToolUse`'s `agent_message` is confirmed non-delivered into model context, and `stop` never fires so no verify/continue mechanism exists to build against either. Because Cursor hooks are shared with the editor (not just CLI dispatch), the adapter must fail open unconditionally: a goal-core error, or malformed/missing stdin, must never block or degrade the editor experience.

### User Story

As an operator working inside a Cursor session (editor or `cursor-agent -p`), I need the active goal to be visible to the agent at session start and verified at session end, without any risk that a goal-hook bug ever blocks or degrades my editor session.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `sessionStart` adapter (`goal-inject.mjs`): injects the `[active_goal]` block, prebind-style, built on phase 001's `lib/goal-core.cjs`.
- ~~Optional `preToolUse` `agent_message` refresh adapter~~ — DROPPED per phase 002's fixed tier (`002-capability-probes/capability-matrix.md`): a live probe confirmed `preToolUse`'s `agent_message` is returned in the hook's JSON response but never spliced into the model-visible transcript (zero occurrences of an injected marker token in the raw `~/.cursor/projects/.../agent-transcripts/*.jsonl`, and the model's final reply never referenced it).
- ~~`sessionEnd` adapter (heuristic verify)~~ — DROPPED per phase 002's Fixed Parity Tiers section: `stop` never fires under the tested CLI build and no Cursor event exposes a block/continue decision, so there is no continuation mechanism a `sessionEnd` verdict could ever act on. Phase 002 fixed Cursor's tier at "injection-only, `sessionStart`-once"; building an inert verifier that can never influence the session would misrepresent that tier. This spec's scope narrows to `sessionStart` only.
- Registration of the adapter in `.cursor/hooks.json`.
- Fail-open behavior: any goal-core read/write/render error, or malformed/missing stdin, is caught and the hook exits as a no-op success, never a block, never a degraded editor response.
- Adapter file at `.opencode/hooks/goal/cursor/`.
- Co-located `node --test` suite.
- A live smoke proof: goal text reaching the model in a real `cursor-agent -p` session, with honest reporting of what raw-transcript inspection actually showed (not assumed from self-report alone).

### Out of Scope

- Building `lib/goal-core.cjs` itself (phase 001).
- The capability-probe methodology and matrix itself (phase 002) — this spec only consumes its output.
- Devin and Pi adapters (phases 003, 005).
- Any change to `mk-goal.js`'s own OpenCode-only behavior or state file.
- Dispatch-shape coverage and OpenCode plugin symlinks (phases 006, 007).
- `preToolUse` refresh and `sessionEnd` verify adapters — both DROPPED per phase 002's fixed parity tier (see In Scope).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Create | `sessionStart` adapter: prebind-style injection, fail-open unconditionally |
| `.cursor/hooks.json` | Modify | Register the adapter on `sessionStart`, appended after existing entries |
| `.opencode/hooks/goal/cursor/goal-cursor.test.mjs` | Create | Co-located adapter tests: active/none/paused/disabled + fail-open-on-malformed-stdin |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `sessionStart` injects the goal brief, prebind-style. | **MET.** A live `cursor-agent -p` session (isolated `/tmp` workspace, `--trust`, real `goal-inject.mjs`) shows the hook fires, reads the active goal, and returns the rendered `[active_goal]` block as `agent_message` in Cursor's JSON response envelope (confirmed via `turnsUsed` incrementing 0→1→2 across two dispatches and `runtime:"cursor"` recorded in shared state). This is RECORDED-EVIDENCE per phase 002's terminology (fires + returns content). Raw agent-transcript JSONL inspection across both dispatches found **zero** occurrences of the injected nonce token (`GOALPROBE-QX9K7ZTM`) or the `[active_goal]` marker in model-visible content, and a direct self-report ask returned "NONE" — consistent with, and extending, phase 002's unresolved model-visibility finding for `sessionStart`. Reported honestly as unproven end-to-end delivery, not overclaimed as working. |
| REQ-002 | Every adapter fails open on a goal-core error. | **MET.** `node --test` covers malformed stdin, empty stdin, a field-missing JSON payload, and a corrupt `active-goal.json` state file — all resolve to `{"permission":"allow"}` with exit code 0, never a thrown error. |
| REQ-003 | ~~`sessionEnd` runs the ported heuristic verifier.~~ | **DROPPED.** Phase 002's Fixed Parity Tiers section confirmed `stop` never fires and no Cursor event exposes a block/continue decision, so Cursor has no verify/continue mechanism to build against; `sessionEnd` firing alone cannot inform a continuation the runtime is already ending. See spec.md §3 Scope. |
| REQ-004 | Adapter is registered correctly in `.cursor/hooks.json`. | **MET.** `python3 -c "import json;json.load(open('.cursor/hooks.json'))"` parses cleanly; the new `sessionStart` entry (`node .opencode/hooks/goal/cursor/goal-inject.mjs`) is appended after all 6 pre-existing entries (none removed/reordered); a live session confirmed the entry fires (see REQ-001 evidence). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | ~~Optional `preToolUse` refresh is built only if phase 002 confirms cadence support.~~ | **DROPPED.** Phase 002's matrix confirmed non-delivery; this spec ships without it, documented in `implementation-summary.md`. |
| REQ-006 | Adapter is dependency-free of anything but phase 001's `lib/goal-core.cjs` and Node builtins. | **MET.** `goal-inject.mjs` imports only `node:module` (`createRequire`) and `../lib/goal-core.cjs`; manual import-graph trace confirms no other skill-owned dependency. |
| REQ-007 | Co-located tests cover the happy path and the fail-open path. | **MET.** `node --test .opencode/hooks/goal/cursor/goal-cursor.test.mjs` — 10/10 passing: active-goal injection, turn recording, no-op (none/paused/disabled/cleared), and 4 fail-open cases (malformed stdin, empty stdin, missing-field payload, corrupt state JSON). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sessionStart` injection is verified live in a real Cursor session (`cursor-agent -p`, isolated `/tmp` workspace, 2 dispatches) — MET as RECORDED-EVIDENCE (fires, reads state, returns `agent_message`); model-visibility remains unproven (0/2 raw-transcript occurrences of the injected marker, self-report "NONE").
- ~~**SC-002**: `sessionEnd` verify is tested against both a met and an unmet goal.~~ — DROPPED with REQ-003 (no `sessionEnd` adapter built; see §3 Scope).
- **SC-003**: Fail-open behavior is explicitly tested by simulating a goal-core error (corrupt state file) and malformed/missing/incomplete stdin — MET, 4 fail-open cases in `goal-cursor.test.mjs`.
- **SC-004**: `.cursor/hooks.json` registration is confirmed correct — MET: JSON valid, path real, hook observed firing live (turn counter incremented on both live dispatches).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cursor hooks are shared with the editor, not just CLI dispatch. | A goal-hook bug could block or degrade every Cursor editor session on this machine, not just dispatched CLI runs. | Fail-open is a P0 requirement on the adapter; explicit fail-open regression tests before merge (4 cases in `goal-cursor.test.mjs`). |
| Risk (materialized) | `beforeSubmitPrompt`/prompt-submit and `preToolUse` agent_message confirmed non-delivery; `stop` never fires. | No reliable per-turn re-injection or verify/continue surface exists at all — `sessionStart`-once is the ceiling, not a starting tier to build up from. | Accepted per phase 002's Fixed Parity Tiers; `sessionStart` prebind-style injection is the sole adapter, documented honestly as the ceiling not a stepping stone. |
| Risk (materialized) | `sessionStart`'s `agent_message` may not reach the model even though the hook fires and returns content. | The injected goal brief may have zero effect despite the adapter working correctly end-to-end from Cursor's own contract. | Live smoke this phase (2 dispatches, raw-transcript inspection + self-report) found zero occurrences of the injected marker in model-visible content — reported honestly in REQ-001 evidence rather than assumed to work from "the hook fired." |
| Dependency | Phase 001's `lib/goal-core.cjs`. | Adapter cannot render/read/write goal state without it. | Confirmed shipped and importable before this phase started. |
| Dependency | Phase 002's capability-probe matrix. | Fixed the sessionStart-only tier and dropped both preToolUse refresh (REQ-005) and sessionEnd verify (REQ-003). | Read in full before implementation began; both drops documented above. |
| Dependency | `cursor-agent -p` CLI auth availability for the live smoke proof. | If unavailable, the live proof must fall back to an editor session. | Not needed — `cursor-agent about` confirmed Pro-tier authenticated (`mkerkmeester@proton.me`); live CLI smoke ran directly, no fallback required. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- ~~Whether phase 002 confirms `preToolUse` `agent_message` refresh is worth adding~~ — RESOLVED: **CONFIRMED non-delivery** into model-visible context (live probe, `002-capability-probes/capability-matrix.md`). `sessionStart`-only is the fixed, honest tier for this runtime; REQ-005 ships without the refresh adapter.
- ~~Whether `sessionEnd` verify is buildable given it confirmedly fires~~ — RESOLVED: phase 002's Fixed Parity Tiers section caps Cursor at "injection-only, `sessionStart`-once" because no event exposes a block/continue decision; a `sessionEnd` verdict would have nowhere to act, so REQ-003 is dropped rather than shipped as an inert observer.
- ~~Whether `sessionStart`'s `agent_message` is actually model-visible, beyond RECORDED-EVIDENCE~~ — Still not fully resolved to CONFIRMED either way (only n=2 dispatches this phase), but this phase's live smoke (direct raw-transcript inspection, not just self-report) found zero occurrences of the injected content in model-visible transcript across both dispatches, consistent with the same non-delivery pattern phase 002 found for `preToolUse`. Recorded honestly as a negative signal, not claimed as a closed CONFIRMED finding — that determination belongs to phase 002's matrix, which this phase does not have authority to amend.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Fail-open is non-negotiable — no goal-hook error path may ever surface as a block, error, or visible degradation in the shared editor session.

### Security

- **NFR-S01**: The shared `active-goal.json` state file is read-only from the Cursor adapters' perspective except through phase 001's `lib/goal-core.cjs` write path (same atomic temp+rename, 0600 hygiene as `mk-goal.js`).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios

- **goal-core throws on read**: Adapter catches, logs (if a safe log surface exists), exits as no-op success; session proceeds with no goal block injected.
- **Corrupt or missing `active-goal.json`**: Treated the same as "no active goal" — silent no-op, not an error surfaced to the editor.
- **`.cursor/hooks.json` misconfigured (wrong path)**: Cursor itself fails to find the hook; this is a registration bug caught by REQ-004's live-firing check, not a runtime fail-open case.

### Session Boundaries

- **No active goal set**: `sessionStart` injects nothing (`{"permission":"allow"}`, no `agent_message`). Confirmed by test.
- **Goal set mid-session by another runtime (shared state file)**: `sessionStart` reads whatever is current at session start; no re-read occurs (no `preToolUse` refresh — dropped per REQ-005).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:related -->
## RELATED DOCUMENTS

- **Parent packet**: `.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/spec.md`
- **Phase 001**: `.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/001-goal-core-and-state/spec.md` — the goal core this phase builds on
- **Phase 002**: `.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/002-capability-probes/spec.md` — the capability matrix this phase's REQ-005 depends on
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
<!-- /ANCHOR:related -->
