---
title: "Feature Specification: Vibe automatic session handover"
description: "Mistral Vibe hands over by command only: the operator ends the session and runs a printed claim command. This phase gives Vibe the automatic tier Claude Code has, a context nudge, an arm at turn end and a relaunch on a claim seed, then proves it with playbook scenarios and scored live hops."
trigger_phrases:
  - "vibe automatic handover"
  - "vibe session handover"
  - "vibe context nudge"
  - "vibe stop arm"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Vibe automatic session handover

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/406-vibe-automatic-handover` |
| **Parent Spec** | ../spec.md |
| **Phase** | 45 of 45 |
| **Predecessor** | 044-in-session-handover-rename |
| **Successor** | None |
| **Handoff Criteria** | A Vibe session started through `skilled-loop vibe` is nudged, hands over and is relaunched on its claim seed with no operator step, and the live score matches Claude Code's |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 45** of the session handover loop. Phase 043 taught the flag readers, the handoff command and the continuity writer about Vibe, and ran one manual hop. This phase adds the automatic tier.

**Scope Boundary**: the Vibe adapter for session handover, its wiring into the two Vibe turn composers, a Vibe usage reader, playbook scenarios and live measurement. The wrapper, the killer and the loop core change only where Vibe needs a branch.

**Dependencies**:
- Phase 044 on main, so the code uses the session handover names
- `MISTRAL_API_KEY` and `vibe 3.1.2` for the live hops

**Deliverables**:
- `.skilled/hooks/session-handover/vibe/` with a turn-start part and a turn-end arm part
- `readVibeUsage` in `lib/context-usage.cjs`
- Playbook scenarios for the automatic tier
- Scored live hops for Vibe beside a Claude Code baseline
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A Vibe session near its context limit gets no warning and never hands over on its own. `.vibe/hooks.toml` registers no session handover hook, so a record a Vibe sender prepares stays pending, and `skilled-loop vibe` declines it as not armed and prints a claim command the operator must run by hand. `.vibe/plugins/README.md` gives the reason as "Vibe has no idle or compaction event", but Vibe does run `pre_agent`, `post_agent` and `post_tool` hooks, and its session folder records the context fill and the compaction point.

### Purpose
A Vibe session hands over the way a Claude Code session does: it is nudged near its compaction point, it arms at turn end, and the wrapper starts a fresh Vibe on the claim seed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -c -i "handover" .vibe/hooks.toml
0
$ cat <session_root>/context-breakdown.json            # one headless deepseek-flash turn
{"system": 19608, "tools": 14064, "skills": 0, "conversation": 868}
$ jq .core_settings.context.model_facts <session_root>/generations/<CURRENT>/runtime-state.json
compaction_threshold 256000, context_window 1048576
phase 043 live hop: relaunch.log "decline reason=not-armed", the wrapper printed the claim command
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `readVibeUsage(sessionRoot)`: the fill is the newest measured `input_tokens` in the session journal, the window is `compaction_threshold` from the current generation's `runtime-state.json`, and `SESSION_HANDOVER_WINDOW_TOKENS` overrides it
- A turn-start part: expand a claim seed into the claim instructions, withdraw an armed hand-over when the operator types, otherwise nudge past the threshold
- A turn-end part that arms a pending record and starts the killer, run last so a deny from another part keeps the session going
- Wiring both parts into `session-lifecycle/vibe/turn-start.mjs` and `turn-end.mjs`, and any branch the core, killer or wrapper needs for Vibe
- Docs: the handover README, the Vibe plugins README row, the env reference where Vibe is named
- Playbook scenarios for the automatic tier, in the Vibe playbook and the spec-kit handover playbook
- Live hops scored with the phase 041 harness, Vibe beside Claude Code

### Out of Scope
- A Vibe compaction pointer beyond what `compaction-post-tool` already carries
- Changing Vibe's own compaction settings, per the parent goal's decision D2
- A model other than `deepseek-flash` for the live hops

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-handover/lib/context-usage.cjs` | Modify | `readVibeUsage`, `resolveVibeWindow` |
| `.skilled/hooks/session-handover/vibe/` | Create | Turn-start part and turn-end arm part, with tests |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `turn-end.mjs` | Modify | Run the two parts |
| `.skilled/hooks/session-handover/README.md`, `.vibe/plugins/README.md` | Modify | Vibe joins the automatic tier |
| Vibe and spec-kit playbooks | Create, Modify | Automatic-tier scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With the Vibe switch on, a Vibe turn past 80% of the compaction threshold gets the hand-over nudge once, and a turn below it gets nothing. |
| REQ-002 | A pending record is armed at `post_agent` only when no other turn-end part denies, and the killer ends the Vibe process. |
| REQ-003 | `skilled-loop vibe` relaunches Vibe on the claim seed, and the new session claims and completes the note. |
| REQ-004 | The switch off, a missing session folder or an unreadable file leaves the turn untouched: every part fails open. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | An operator prompt typed after the arm withdraws the hand-over, and the session carries on. |
| REQ-006 | Playbook scenarios cover the nudge, the arm and relaunch, the withdraw and the switch off. |
| REQ-007 | Live Vibe hops score at least what Claude Code scores on the same harness task, with the time per stage recorded. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new unit tests pass, and the relaunch, flag, goal and Vibe hook suites keep their counts.
- **SC-002**: `relaunch.log` for a live Vibe run shows `prepare`, `killer-signal` and `relaunch reason=ready`, and the receiver reports the code word.
- **SC-003**: `score.cjs` prints the same score for Vibe as for the Claude Code baseline run on the same task.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Interactive Vibe may not exit cleanly on the killer's SIGTERM | Retired | The spike measured a clean exit 0 in one second |
| Risk | `context-breakdown.json` holds characters, not tokens | Retired | The reader takes the journal's measured `input_tokens` |
| Risk | The killer's idle wait needs a file whose time changes while Vibe writes | Med | Pass the newest journal segment, not the session folder |
| Dependency | DeepSeek V4.1 Flash max through the LLM Gateway builds, a fresh Opus medium reviews | Low | The operator's amendment to D5 for this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: No part of the hand-over can deny a Vibe turn or exit non-zero.
- **NFR-R02**: The Vibe switch stays off by default, as for every runtime but Claude Code.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a session folder with no `CURRENT` file gives no usage and no nudge.
- Maximum input: a fill above the threshold after the nudge already fired adds no second nudge until the level rises.
- Failure path: a killer that cannot find the Vibe pid leaves the record pending, and the wrapper falls back to printing the claim command.
- Hand-typed hand-over: Vibe exports no session id to its tools, so `/speckit-handoff` typed by the operator prepares with a `uuidgen` id. The arm matches only the hook payload's session id, so that record stays pending and the wrapper prints the claim command as before. The nudge carries the real id in its prepare command, so a nudged hand-over arms.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Two adapter parts, a usage reader, composer wiring, playbooks |
| Risk | 15/25 | Process signalling in a third-party runtime |
| Research | 10/20 | Spike done, two behaviors still to measure live |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Answered by the live spike on 2026-11-15 (`scratch/spike/spike.sh`). SIGTERM to the `vibe-rs` process the shell started ends interactive Vibe in one second with exit 0, and its `vibe-app-server` exits with it.
- `context-breakdown.json` changes every turn but holds character counts, not tokens: 77,464 characters stood for 20,001 measured input tokens. Vibe's own docstring calls them payload sizes. The reader therefore takes `input_tokens` from the newest `action_result` usage in the journal, which is what Vibe compares to `compaction_threshold`.
- `CURRENT` is a JSON object whose `generation` field names the folder under `generations/`. The newest journal segment can be empty after a checkpoint, so the reader walks segments newest first.
<!-- /ANCHOR:questions -->

---
