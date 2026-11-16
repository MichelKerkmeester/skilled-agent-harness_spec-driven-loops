---
title: "Feature Specification: Phase 12: session-scoped-sweep-and-consume"
description: "The Claude transcript sweep reads whichever transcript in the project changed last, so a save can be offered another session's answers. A save run from a linked worktree records consumption in the worktree's own state, so the answer stays pending in the primary checkout where the hook queued it."
trigger_phrases:
  - "session scoped sweep and consume"
  - "phase 12 session scoped sweep and consume"
  - "worktree save pending answer"
  - "sweep reads another session transcript"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: session-scoped-sweep-and-consume

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/434-session-scoped-sweep-and-consume` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-level-match-operator-record |
| **Successor** | None |
| **Handoff Criteria** | The sweep reads the calling session's transcript from any checkout, and a linked worktree resolves the same decision-capture state as its primary checkout in both the hook library and the writer |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the decision capture series. Both defects surfaced on 2026-11-16 while child 011 was saved from linked worktree 433 with another Claude session active in the same project.

**Scope Boundary**: The Claude transcript sweep's transcript choice, and the state root that `capture-core.mjs` and `decision-record-writer.ts` resolve. The other runtimes' sweeps are out of scope.

**Dependencies**:
- Claude Code sets `CLAUDE_CODE_SESSION_ID` in every command it runs.
- `git rev-parse --path-format=absolute` and `git worktree list --porcelain`.

**Deliverables**:
- A sweep that opens `<id>.jsonl` for the calling session.
- One state root shared by a primary checkout and its linked worktrees, in both copies of the root logic.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Run without `--transcript`, the sweep reads the newest transcript recorded for the project. With two Claude sessions open, a save in one session was offered 12 answers that belonged to the other. Run from a linked worktree, it finds no transcript at all, because Claude records the session under the checkout it started in. Separately, both copies of the state-root logic use `git rev-parse --show-toplevel`, so a linked worktree gets its own state folder. The capture hook queues an answer in the primary checkout, a save in the worktree records it as consumed in the worktree, and the primary checkout keeps offering it. A later save there would write it into whatever packet that save targets. A repeat save into the same record does not duplicate it, because the writer reuses the existing id for a known source key.

### Purpose
A save reads only its own session's answers and closes them in the same state the hook wrote them to, from any checkout of the repository.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ bash scratchpad/probe/controls.sh <worktree 434> <scratch root>    # scratch HOME and scratch repo with one linked worktree
control1 picked from primary:  other-session
control1 picked from worktree: no transcript found for <scratch root>/wt
control2 capture-core same root for primary and worktree: false
  primary : <root>/repo/.skilled/skills/.state/decision-capture/f4c1e39d792d
  worktree: <root>/wt/.skilled/skills/.state/decision-capture/d7f9f9aa6031
```
`CLAUDE_CODE_SESSION_ID` was `mine-session` for both sweep runs. `other-session` was the newer transcript.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Open `~/.claude/projects/*/<CLAUDE_CODE_SESSION_ID>.jsonl` when the variable is set, and keep the newest-transcript fallback only when it is not.
- Resolve a linked worktree to its primary checkout, the first `git worktree list` entry, in `capture-core.mjs` and `decision-record-writer.ts`. A submodule and a bare repository keep their own root.
- Keep reading a worktree's old state folder so answers and consumed keys written there before the change are still found.

### Out of Scope
- The OpenCode, Devin, Pi, Codex, DSH and Vibe sweeps. Each also picks the newest session, and each needs its own runtime's session signal, which D5 requires a live probe for.
- Answers already stranded before this change. They stay listed until a save consumes them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs` | Modify | Open the calling session's transcript |
| `.skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs` | Modify | Session-id case, and the existing fallback case runs without the variable |
| `.skilled/hooks/decision-capture/lib/capture-core.mjs` | Modify | Primary-checkout root and worktree-folder reads |
| `.skilled/hooks/decision-capture/lib/capture-core.test.mjs` | Modify | Linked-worktree case |
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` | Modify | The same root and worktree consumed-log read |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts` | Modify | Linked worktree in the parity test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The sweep reads the calling session's transcript | The probe prints `mine-session` from the primary checkout and from the worktree, and the new sweep test fails on the old code |
| REQ-002 | A linked worktree resolves its primary checkout's state | The probe prints `same root: true`, and the capture-core and parity tests pass with the linked worktree case |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Answers and consumed keys in a worktree's old folder are still read | The capture-core linked-worktree test reads `local-key` and `local-consumed` from that folder |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/decision-capture/lib/*.test.mjs .skilled/hooks/decision-capture/bin/*.test.mjs` exits 0.
- **SC-002**: The scratch probe shows the calling session picked from both checkouts and one shared state root.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `CLAUDE_CODE_SESSION_ID` | Without it the sweep falls back to the newest transcript, as before | The fallback is unchanged and still checks the recorded cwd |
| Risk | A worktree save now writes the primary checkout's real state | A test run from a worktree could touch live decision-capture state | Every proof runs in a scratch HOME and a scratch repository, per D4 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---
