---
title: "Feature Specification: Phase 47: vibe-handover-hardening"
description: "A looped Mistral Vibe session is told that nothing ends it right after prepare, its killer watches a journal segment Vibe abandons at turn end, and five smaller gaps leave a hop less reliable than on Claude Code. This phase fixes the eight findings the operator chose from a read-only analysis."
trigger_phrases:
  - "vibe handover hardening"
  - "phase 47 vibe handover hardening"
  - "vibe prepare nothing ends this session"
  - "vibe killer journal folder watch"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 47: vibe-handover-hardening

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
| **Branch** | `worktrees/418-vibe-handover-hardening` |
| **Parent Spec** | ../spec.md |
| **Phase** | 47 of 47 |
| **Predecessor** | 046-vibe-history-locator |
| **Successor** | None |
| **Handoff Criteria** | Every acceptance row Met or Waived by an ADR, the handover suite green, one live Vibe hop on the operator's plan |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 47** of the session handover loop. A read-only analysis by Fable 5.2 (`scratch/analysis.md`, citations checked in `scratch/analysis-verification.md`) found two P1 and seven P2 problems in the Vibe path. The operator chose to build eight of them: F1 to F7 and F9.

**Scope Boundary**: the Vibe hand-over path only. Claude Code, Codex, Pi, OpenCode, Cursor and Devin behavior must not change.

**Dependencies**:
- Phase 045's `post_agent` arm and phase 046's Vibe locator, both on main.
- The installed Vibe CLI 3.1.2 and the operator's Vibe plan key in the macOS keychain for the live hop.

**Deliverables**:
- Code and tests for F1 to F7 and F9.
- Updated hand-over docs where a message or behavior they describe changes.
- One live Vibe hop record.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After `prepare`, a looped Vibe session is told "nothing ends this session" while the nudge told it the loop ends it, and in the recorded deepseek-flash hop the sender spent 76.5 s and about 20 tool calls on that contradiction. The killer watches one journal segment that Vibe stops writing at the turn-end fold, so on Vibe it is a fixed three-second timer, and the withdraw that should cancel a hop when the operator types runs last in a hook chain measured at up to 3.26 s.

### Purpose
A Vibe session in `skilled-loop` hands over as reliably as a Claude Code session: it is told to stop, a new prompt cancels a pending hop in time, and the smaller gaps the analysis found are closed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 609,617p .skilled/hooks/session-handover/bin/session-handover.cjs
  // left. Cursor, Devin and Vibe have no relaunch hook, so their session ends by hand.
  const prepared = runtime === 'cursor' || runtime === 'devin' || runtime === 'vibe'
    ? '[session-handover] handoff prepared; nothing ends this session.'
      + ' Exit it and run the claim command the wrapper prints.'
    : '[session-handover] handoff prepared; stop now and end this turn.'
$ sed -n 142,148p .skilled/hooks/session-handover/lib/killer.cjs
function transcriptMtime(transcriptPath) {
  try {
    return fs.statSync(transcriptPath).mtimeMs;
$ sed -n 92,101p .skilled/hooks/session-lifecycle/vibe/turn-start.mjs
const PARTS = [
  (payload) => pendingCompletionAdvisoryPart(payload),
  ...
  // The hand-over part runs last, so its claim or nudge text ends the context.
  handoverPart,
];
```
Live timings (prepare 16:17:52.188Z, signal 16:19:08.687Z, turn end 16:19:05.604Z) come from the phase 046 loc3 run in `~/046-live-runs-raw-backup-2026-11-15.tar.gz`, as quoted in `scratch/analysis.md` F1 and F2.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Tell a looped Vibe session with a real session folder to stop after `prepare` (F1).
- Withdraw an armed hop before the other `pre_agent` parts run, and let the killer watch the whole journal folder (F2).
- Reset the nudge level after a Vibe compaction and stop pointing a sender at its own pending note (F3), and claim the nudge level atomically (F6).
- Let a typed `/speckit-handoff` under the loop use the real Vibe session id (F4), keep the hand-over working after a fork or rewind (F5), defer a record whose arm failed (F7), and warn when `MISTRAL_API_KEY` is exported (F9).

### Out of Scope
- F8, the shell-child guard on Vibe - it needs a process-table capture from a live turn first.
- Model, effort and name carry, nested-loop drop and the question-dialog hold for Vibe - listed by the analysis but not chosen.
- Any change to another runtime's behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | Modify | F1 prepare message, F4 session id fallback |
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modify | Export `vibeSessionFolder` for F1 |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | Modify | F2 withdraw step and folder watch, F4 id persist, F5 parent check, F6 nudge claim (kept in the Vibe adapter so the shared `nudge.cjs` stays unchanged), F7 deferred mark |
| `.skilled/hooks/session-handover/lib/killer.cjs` | Modify | F2 directory watch |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Modify | F2 withdraw first |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | Modify | F3 level reset and pending guards |
| `.skilled/bin/skilled-loop` | Modify | F9 key warning |
| `.skilled/commands/speckit/handoff.md` | Modify | F4 Vibe instruction |
| Hand-over tests and README | Modify | Coverage and docs for each change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `prepare --runtime vibe` with a session id that names a Vibe session folder prints the stop-now line; with an id that names none it prints the manual line (F1) |
| REQ-002 | On Vibe `pre_agent`, an armed hop is withdrawn before any other turn-start part runs (F2 part 1) |
| REQ-003 | The existing handover suite and the other runtimes' tests still pass with no change to their expectations |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The killer, given a Vibe journal folder, restarts its idle clock when any numbered segment changes and does not time out when the first segment is deleted (F2 part 2) |
| REQ-005 | A Vibe compaction resets the nudge level, prints no claim pointer while a hop is pending, and prints the stale-note text after a withdraw (F3) |
| REQ-006 | Under the loop, `prepare --runtime vibe` without `--session` uses the session id the last `pre_agent` hook saw (F4) |
| REQ-007 | A `pre_agent` or `post_agent` payload with a `parent_session_id` still nudges, withdraws and arms; a `post_tool` payload with one stays silent (F5) |
| REQ-008 | Two nudge decisions racing on one state file produce one nudge (F6) |
| REQ-009 | Each failed arm branch marks the record deferred and logs its reason, and the next operator prompt withdraws it (F7) |
| REQ-010 | `skilled-loop vibe` with `MISTRAL_API_KEY` set prints one warning to stderr and still starts (F9) |
| REQ-011 | One live Vibe hop through `skilled-loop vibe` on the operator's plan relaunches and the receiver claims the note |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-handover/tests/*.test.cjs` passes with at least the 1009 baseline tests plus the new ones, 0 failing.
- **SC-002**: In a live Vibe hop, the time from `prepare` to `killer-signal` is under 20 s.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Vibe plan quota for the live hop | The live row cannot be proven | Unset `MISTRAL_API_KEY` so the keychain plan key bills, as phase 046 did |
| Risk | The directory watch never goes idle if Vibe keeps writing after turn end | Med: no hop | The killer's 30 s timeout still ends the wait; a test and the live hop check the normal case |
| Risk | A shared module change alters another runtime | High | Gate every change on `runtime === 'vibe'` or the Vibe adapter; REQ-003 reruns the full suite |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The withdraw step adds no new process spawn to `pre_agent`.

### Reliability
- **NFR-R01**: A failure inside any new step is logged and never blocks the Vibe turn.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a `pre_agent` payload with no session id or no `SKILLED_LOOP_ID` persists nothing and withdraws nothing.
- Maximum input: a journal folder with many segments is read with one directory listing per poll.
- Failure path: an unreadable journal folder reads as missing and follows the killer's existing grace and timeout.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 150 lines over 9 files plus tests |
| Risk | 12/25 | Shared killer and nudge modules |
| Research | 6/20 | Done in the analysis |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is the journal written during a streaming model call? The live hop shows whether the folder watch still signals within SC-002.
<!-- /ANCHOR:questions -->

---
