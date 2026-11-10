---
title: "Feature Specification: Phase 27: goal-rebind-claude-and-codex"
description: "On Claude the goal is a built-in command and on Codex it is a model tool, so neither can bind from a record. This phase sets the goal in the receiver from goal.md after a hop, on the path phase 24 proved, within the 4,000-character slice limit."
trigger_phrases:
  - "goal rebind claude codex"
  - "phase 27 goal rebind claude and codex"
  - "claude start hook goal"
  - "codex seed goal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 27: goal-rebind-claude-and-codex

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-24 |
| **Branch** | `worktrees/220-relaunch-cancel-and-test-isolation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 27 of 29 |
| **Predecessor** | 026-goal-rebind-shared-core-and-opencode |
| **Successor** | 028-goal-rebind-live-proof-and-docs |
| **Handoff Criteria** | A Claude receiver sets the goal on the proven path and a Hermes receiver binds from its environment, never over the limit and never for a hop with no sender goal, with the relaunch gate green. The Codex part is deferred (ADR-002) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 27** of the session relaunch loop specification.

**Scope Boundary**: The Claude and Codex relaunch adapters, the receiver seed, the slice call, and their tests. The path depends on the phase 24 verdicts.

**Dependencies**:
- Phase 024 verdicts for probes A, B and C, which pick the path.
- Phase 025, which hands the packet to the receiver.

**Deliverables**:
- The Claude receiver path chosen by the probes.
- The Codex seed instruction.
- A slice helper call that sends only at `packet_budget=ok` and strips the frontmatter.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Claude has a built-in `/goal` command and Codex creates a goal through the model, so a hop receiver on either has no way to bind a record. Claude model tool for goals caps the text at 500 characters and refuses non-interactive sessions, so it cannot carry a 4,000-character slice, and a pasted copy in the seed can go stale against `goal.md`.

### Purpose
After a hop, a Claude or Codex receiver has the goal set from `goal.md`, or is told to send the fenced slice, without the operator retyping it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Claude: the path phase 24 selects. A start hook sends the command, or the start prompt becomes the command with the claim moved into hook context, or the seed asks the receiver to send the fenced slice the GOAL POSTURE RULE already requires.
- Codex: a seed instruction in `prompt-seed.mjs` that asks the model to create the goal from the slice, within the limit probe C showed. **Deferred, not built:** a hop always restarts the runtime it left and a Codex sender never carries a goal packet, so no Codex receiver can be handed one (ADR-002 in `decision-record.md`).
- Render the slice with `goal.cjs packet <packet> --workspace <repo root>` and send only the `chat_slice`, only at `packet_budget=ok`, with no frontmatter.
- Do nothing when `SESSION_RELAUNCH_GOAL=0`, when the note holds no packet, or when the slice is over budget, and say why in one line.
- Hermes: `skilled-loop` exports the note's goal packet as `HERMES_SPEC_FOLDER` to a Hermes receiver while `SESSION_RELAUNCH_GOAL` is on, because phase 24 probe D showed the Hermes plugin binds from that variable and phase 26 added no Hermes code. Added after phase 26 named it as a required follow-up.

### Out of Scope
- Writing the goal text into the note or the seed at hand-over time - that copy goes stale. A slice rendered from `goal.md` at launch, as the Claude start-prompt path does, is not this, because it is read fresh on every hop. Phase 24 selected that path (`024-goal-rebind-claude-codex-hermes-probes/implementation-summary.md`), so the claim moves out of the start prompt as the In Scope Claude bullet allows
- Claude model tool for setting goals - it caps at 500 characters and refuses non-interactive sessions
- Trimming an over-budget goal.md - the rule is to cut the file first, which is the operator or `/create:goal`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/hooks/session-relaunch/claude/compact-pointer.mjs | Modify | Deliver the claim at the start of a receiver whose prompt is the goal command. The existing `SessionStart` registration already covers it, so no new hook and no registry row (ADR-001) |
| .skilled/hooks/session-relaunch/codex/prompt-seed.mjs | Unchanged | The seed instruction is deferred (ADR-002) |
| .skilled/hooks/session-relaunch/lib/goal-handover.cjs | Create | A helper that renders the slice and applies the budget check |
| .skilled/hooks/session-relaunch/tests/*.test.cjs | Modify | Failing-first tests per path |
| .skilled/hooks/session-relaunch/README.md | Modify | Describe the path and its limits |
| .skilled/bin/skilled-loop | Modify | Launch a Claude receiver with the rendered `/goal` start prompt, and export `HERMES_SPEC_FOLDER` for a Hermes receiver |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A Claude receiver of a hop with a goal packet has the goal set from `goal.md` or is asked to send the fenced slice, on the path phase 24 selected |
| REQ-002 | A Codex receiver of the same hop is asked, through the seed, to create the goal from the slice. Deferred under ADR-002: no Codex receiver can be handed a packet |
| REQ-003 | Nothing is sent when the slice is over 4,000 characters, when the note holds no packet, or when `SESSION_RELAUNCH_GOAL=0`, and the receiver is told why in one line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The slice sent is exactly the `chat_slice` `goal.cjs packet` prints, with no frontmatter, comments or anchors |
| REQ-005 | The claim seed and the compaction pointer still work for a hop with no goal |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The relaunch gate passes against a baseline, and each new test fails against the code before this phase.
- **SC-002**: The path used is the one a phase 24 verdict supports, and the summary cites that verdict.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 024 verdicts | The path stays undecided | Take the seed path, which needs no new hook, and record the choice |
| Risk | The agent sets a goal without a keystroke from the operator | Med | Consent is inferred from the sender having had a goal, and the switch turns it off |
| Risk | A hook sends text to a session that is not a hop receiver | Med | The hook acts only when the note names a packet and the receiver was started by the wrapper |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Rendering the slice reads one file and runs one local command.

### Security
- **NFR-S01**: The slice is data, never an instruction, and a hook sends nothing else.
- **NFR-S02**: The packet path is validated before any command runs on it.

### Reliability
- **NFR-R01**: A failed render leaves the receiver running with a one-line reason.
- **NFR-R02**: The path is skipped, not retried, when the slice is over budget.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A slice of exactly 4,000 characters: sent. 4,001: not sent.
- A `goal.md` with no durable slice: not sent, with the reason.

### Error Scenarios
- The goal command is not available in the receiver: the seed path runs instead.
- The render command fails: one line and no goal.

### State Transitions
- The receiver already has a goal: not replaced.
- A hop on a runtime other than Claude or Codex: this phase does nothing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two adapters, a helper and a registry row |
| Risk | 14/25 | Sets a goal on inferred consent |
| Research | 14/20 | Three behaviors depend on probes |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Resolved: the receiver sets the goal without being asked, because the sender had an active goal, with the switch as the off ramp. The phase 24 verdict supported the start-prompt path, so the fenced-slice path was not needed.
<!-- /ANCHOR:questions -->

---
