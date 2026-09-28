---
title: "Implementation Summary: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode"
description: "Planned, not built: the phase documents were written on 2026-09-26, amended twice on 2026-09-27 and amended on 2026-09-28 for the wave 3 directive, which stops the phase at the operator's label gate. No census, scorer, measurement or plugin change has been made."
trigger_phrases:
  - "goal verifier jev summary"
  - "jev shadow mode status"
  - "labeled set scorer status"
  - "pi goal nudge census status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow"
    last_updated_at: "2026-09-28T11:30:00Z"
    last_updated_by: "wave-3-spec-leaf"
    recent_action: "Wave 3 amendment: label gate, Pi source, builders, skill docs, moved lines"
    next_safe_action: "Build the Pi census and run it on ~/.pi/agent/sessions (T024 to T026)"
    blockers:
      - "The phase stops at the label gate (parent D4): the labeled set and everything after it wait for the operator"
      - "The Jev arm waits on redaction fixes in three modules and on 002's latency record"
      - "The Deem arm waits on cli-deem (proposed, phase 008)"
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow/goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "How many of Pi's 253 truncation-branch nudges are clamp artifacts?"
      - "Which unit and window explain 1,457 nudges in 28 sessions against 1,616 matches in 37 files?"
      - "Can the provider and model be read per call from a choice answer's JSON?"
      - "Is the labeled set committed?"
      - "Which option-order scheme does REQ-006 fix for a Deem choice?"
      - "Does parent D4 let a Claude row's native goal_status pre-label stand?"
      - "Which Claude transcript directory does the builder read?"
      - "How should the census report the 2026-09-27 nudge delivery change?"
    answered_questions:
      - "The census and the builder's Pi rows read ~/.pi/agent/sessions (parent D4, 2026-09-28)"
      - "The npm jevctl prints a bare 0.2.3 for --version, so the gate refuses it"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-goal-verifier-jev-shadow |
| **Completed** | Not started (Planned) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned: its documents are written and no code, fixture or measurement exists.

### Phase 3: goal-verifier-jev-shadow

The plan has three slices. First, a census counts the hidden verdict lines Pi already records, with no text and no call. Second, an offline scorer runs three zero-call arms on your labeled set and counts how many errors the evidence clamp alone causes. A model arm on Deem or Jev follows only past a gate fixed now, with Deem preferred because your conversation stays on the machine. Third, a shadow mode, `deem` or `jev` (proposed), follows only if that arm clears the keep threshold, for the backend that kept. Without a Jev key and without a local Deem server passing its check, every path behaves as it does today.

The build stops at your label gate. It runs the census on `~/.pi/agent/sessions`, builds and tests the scorer on a synthetic fixture and writes the rows for you to label. No model writes a label, and everything after your labels is outside this phase's completion.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Written 2026-09-26, amended 2026-09-27 and 2026-09-28 | The requirements and proof plan, the build approach, the ordered tasks, the phase goal and this status record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`create.sh --phase` scaffolded the folder on 2026-09-26. The documents were then written from research R2 and the proposed-phase entry in `../001-deep-research/research/research.md`. The plugin, core and test seams they cite were reopened against the worktree the same day.

On 2026-09-27 the documents were amended to the final synthesis, `../004-deep-research-expansion/research/research.md` section 13, with R2 and R4 from section 11. The amendment added the Pi census as the first slice, the tail-window and parity arms with the clamp-defect count, a gate for the Jev arm and the plugin mode, the redaction precondition in three modules and R4's optional claims column. `goal.md`'s log lists each requirement change. The plugin clamp, heuristic, Pi nudge emitter and completion sentinel lines it cites were reopened that day.

A second amendment the same day applied round 3's synthesis, `../007-classifier-deep-research/research/research.md` section 14 "003-goal-verifier-jev-shadow", with R2 and the shared two-backend gate contract from section 12. Deem joins Jev as a backend, preferred for the model arm and the shadow mode. For Deem the redaction and 002-latency preconditions drop, stability is the order-flip rate over 3 option orders and a keep holds per commit pair. The zero-call slices did not change. `goal.md`'s log lists each change.

On 2026-09-28 the documents were amended for the parent's wave 3 directive, after the worktree merged main at `bbf2a8e4cd`. Parent D4 stops the phase at the label gate and names `~/.pi/agent/sessions` as the Pi source. D5 names the build orchestrator and the CLI executors, and D6 adds the goal hooks READMEs and, on keep, the goal plugin's catalog, playbook and changelog files. D1 needed no change. Every cited line of code the phase will change was reopened, and the moved ones were corrected. One premise no longer holds: since `e7c88670fb` Pi writes a nudge only when the next user prompt delivers it. `spec.md` records that as a risk and a question. `goal.md`'s log lists each change with its source.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The scorer drives the plugin's own `maybeVerifyGoal` through `__test` | The heuristic function is not exported, and this measures the real verifier with no plugin edit in slice 1 |
| The wrapper rule holds rows the heuristic stopped at its length or blocking check | Those checks run first, so every blocking-pattern match is held without copying a regex that neither module exports |
| The shadow gate is checked once per session | This is the operator's rule. A keyless session then shows one enablement line and nothing per verification |
| The Pi census comes first | Pi already records the verifier's verdicts, so the first slice measures a channel in real use with no label and no key |
| Deem is the preferred backend for the model arm and the shadow mode | The payload is your own conversation, and Deem keeps it on the machine. Jev stays available behind its own switch and gate |
| The clamp fix and the redaction fixes go to their owners | This phase measures the defects and reports them. It edits neither the clamp nor any redaction rule |
| The phase stops at the label gate | Your answer to the parent's D4: no model writes a label, and the build delivers everything up to the point where you label |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, tests, measurement | Not run. Nothing is built |
| `validate.sh --strict` on this phase | Recorded by the authoring run, not claimed here |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Stops at the label gate.** Only the operator labels, and parent D4 puts the labeling outside this phase's completion. The census needs no label, and the scorer is built and tested on a synthetic fixture before the set exists.
2. **The heuristic's error rates, Jev's latency and Deem's accuracy on this judgment are UNKNOWN.** The scorer, 002's per-call record and R21's Deem half in 002 measure them.
3. **Pi records no `met` turn.** It sends a nudge only on a verdict other than `met`, so every rate from the census alone has an UNKNOWN denominator.
4. **The census figures differ by method.** 1,457 nudges in 28 sessions (final synthesis) against 1,616 matches in 37 files (raw count, 2026-09-27). The census must print its unit and window to reconcile them.
5. **Pi's records changed on 2026-09-27.** Since `e7c88670fb` a nudge reaches the session file only with the next user prompt, so records after that date miss every nudge still queued when a session ended.
<!-- /ANCHOR:limitations -->

---
