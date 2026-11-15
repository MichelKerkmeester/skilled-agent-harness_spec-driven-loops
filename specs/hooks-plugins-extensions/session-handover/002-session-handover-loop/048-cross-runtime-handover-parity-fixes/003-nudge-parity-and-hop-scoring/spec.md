---
title: "Feature Specification: Phase 3: nudge-parity-and-hop-scoring"
description: "Claude and Codex have each delivered one nudge twice when two tool hooks ran at once, and the live-hop scorecard never checks the side word a receiver must recover. This phase moves the Vibe nudge claim into the shared nudge module, scores the side word and runs live Pi and OpenCode hops."
trigger_phrases:
  - "shared nudge claim"
  - "duplicate nudge race"
  - "hop scorecard side word"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: nudge-parity-and-hop-scoring

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
| **Branch** | `worktrees/420-cross-runtime-handover-parity-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-failed-arm-deferred-mark |
| **Successor** | 004-history-preview-readability |
| **Handoff Criteria** | One nudge per level on Claude, Codex and Vibe under racing hooks, and live Pi and OpenCode hops that report the side word |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the cross-runtime hand-over parity fixes. Phase 047 kept the nudge claim inside the Vibe adapter, because only Vibe was known to run tool hooks side by side. Transcripts now show the same race on Claude and Codex, so the claim moves to the shared module.

**Scope Boundary**: `lib/nudge.cjs`, the Claude, Codex and Vibe nudge paths, and the live-hop harness in `../scratch/harness/`.

**Dependencies**:
- Phases 001 and 002, which the live hops prove.
- Pi and OpenCode CLIs with a working provider for the live hops.

**Deliverables**:
- A shared nudge claim used by Claude, Codex and Vibe.
- A side-word check in `score.cjs`.
- One live Pi hop and one live OpenCode hop.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Claude and Codex read the nudge level, decide and write it with no claim, so two hooks that run at once both deliver. A scan of 391 Claude nudge deliveries found a pair from two tool calls 16 ms apart on 2026-10-22 and a tool hook and a prompt hook 115 ms apart on 2026-11-14, each with the same text. A scan of 22 Codex nudges found two identical developer messages 12 ms apart after two tool calls completed together on 2026-11-15. The live-hop scorecard scores the hop and three task facts but not the side word, so recall was read off the screen by hand.

### Purpose
Every runtime delivers each nudge once, and a live hop scores recall as well as the hop.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 152,157p .skilled/hooks/session-handover/claude/context-nudge.mjs
  const notePath = nudge.plannedNotePath({ cwd: payload.cwd, sessionId });
  try {
    nudge.writeState(sessionId, decision.level);
transcript 64740f8b (2026-10-22): toolu_01TxTTzqD8v65sJ9ZxmQt1Qf 09:46:05.624Z, toolu_01JGpRmgn7WB4h9RfgbWLmjt 09:46:05.640Z, both "Context is about 11% full"
rollout 01a1ddbb (2026-11-15): two item_completed events, then lines 42 and 43, identical developer nudges 12 ms apart
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One shared function in `lib/nudge.cjs` that claims, decides again and writes the level.
- Claude, Codex and Vibe call it in place of their own write.
- A side-word check in the live-hop scorecard and live Pi and OpenCode hops.

### Out of Scope
- Pi and OpenCode nudges, which run inside one plugin host process.
- The compaction level reset, which every runtime already has.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-handover/lib/nudge.cjs` | Modify | Shared claim and commit |
| `.skilled/hooks/session-handover/claude/context-nudge.mjs` | Modify | Commit through the claim |
| `.skilled/hooks/session-handover/codex/shared.mjs` | Modify | Commit through the claim |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | Modify | Use the shared claim |
| `../scratch/harness/score.cjs` | Create | Side-word check in a copy of the phase 047 harness |
| Nudge tests and README | Modify | Coverage and docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Two commits racing on one session's state deliver one nudge, and a claim older than its stale bound is taken over |
| REQ-002 | Claude, Codex and Vibe deliver a nudge only through the shared commit |
| REQ-003 | The existing handover suite passes with no edited expectation for a nudge that is delivered once |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `score.cjs` reports whether the receiver stated the side word and whether the note held it |
| REQ-005 | A live Pi hop and a live OpenCode hop each relaunch, and their receivers report the side word through History Lookup |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The handover and Vibe lifecycle suites pass with 0 failing.
- **SC-002**: Each live hop scores 5/5 with the side word reported and absent from the note.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A claim file left by a dead hook blocks every nudge | High: no hop | The ten-second stale bound phase 047 used, kept by test |
| Risk | A shared change alters Pi or OpenCode | Med | They do not call the new function, and their suites rerun |
| Dependency | Pi and OpenCode providers | Live hops cannot run | Record the gap and ask the operator |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The claim adds one file create and one remove per delivered nudge only.

### Reliability
- **NFR-R01**: A state directory that cannot be made lets the hook deliver as before.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an invalid session id never reaches the claim.
- Maximum input: many hooks at once still deliver one nudge.
- Failure path: a claim that cannot be created for a reason other than an existing file delivers as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One shared function, three callers, a harness copy |
| Risk | 12/25 | Shared nudge module |
| Research | 4/20 | The Vibe claim is proven |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a Pi or OpenCode receiver run the lookup without being told to? The live hops show it.
<!-- /ANCHOR:questions -->

---
