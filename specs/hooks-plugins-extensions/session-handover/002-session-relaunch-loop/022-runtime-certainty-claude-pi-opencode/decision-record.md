---
title: "Decision Record: Phase 22: runtime-certainty-claude-pi-opencode"
description: "Why the OpenCode nested-run live check is waived and why the busy-at-arm criterion is replaced on Pi and OpenCode."
trigger_phrases:
  - "runtime certainty decision record"
  - "opencode nested run waiver"
  - "arm withdrawal on new turn"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/022-runtime-certainty-claude-pi-opencode"
    last_updated_at: "2026-10-22T13:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the two decisions behind the waived and superseded acceptance rows"
    next_safe_action: "Validate the packet"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "5820adf5-6b90-452d-9421-385ec95d7f40"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 22: runtime-certainty-claude-pi-opencode

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Waive the live OpenCode nested run

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-22 |
| **Deciders** | Claude (orchestrating session), recorded for operator review |

---

<!-- ANCHOR:adr-001-context -->
### Context

AC-001 asks for a live nested run on each runtime: a runtime started from a looped session's shell must be treated as outside the loop. Claude and Pi passed live, each logging `loop-nested-run`. On OpenCode, `openai/gpt-6-luna` refused every form of the nested `opencode run`, citing the cli-opencode skill's rule that OpenCode never invokes itself, including through a harness script and with explicit operator authorization.

### Constraints

- The refusal comes from a skill guard the model is right to follow; forcing past it would mean weakening that guard for a test.
- The nested-run logic is one shared function, `dropNestedLoop`, that every adapter calls the same way.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: to waive the live OpenCode cell of AC-001 and rest it on the automated OpenCode init test plus the live Claude and Pi passes of the same shared function.

**How it works**: the OpenCode plugin calls `core.dropNestedLoop(process.env, { hostPid: process.pid })` at init, and its test asserts the drop. The Claude and Pi live runs prove the process-tree rule on a real chain.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive the OpenCode live cell** | Keeps the skill guard intact; the shared code is proven live twice | One live cell missing | 8/10 |
| Run the nested OpenCode outside the model, by hand in the tool shell | Live evidence on OpenCode | A hand-started process is not what a session would do | 5/10 |
| Relax the cli-opencode self-invocation rule | Live evidence | Weakens a guard for a test | 2/10 |

**Why this one**: the evidence that matters is the process-tree rule, and it already passed live on two runtimes through the same function.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The cli-opencode guard stays as written.

**What it costs**:
- OpenCode's nested-run behavior is certified by test and shared code, not by its own live run. Mitigation: rerun it live if the skill ever allows a test self-invocation.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Replace the busy-at-arm criterion on Pi and OpenCode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-22 |
| **Deciders** | Claude (orchestrating session), recorded for operator review |

---

<!-- ANCHOR:adr-002-context -->
### Context

AC-008 expected a busy session at arm time to end with the killer giving up within 30 seconds, sending a notification and disarming the record. That is what Claude does, because its transcript changes while a turn runs. Live S6 on OpenCode and Pi showed the killer signalling mid-turn instead: OpenCode's killer has no transcript and only waits 3 seconds, and Pi writes an assistant message only when it completes, so a thinking turn looks idle.

### Constraints

- Neither runtime gives the killer a signal it can watch during a turn.
- The fix must never end a turn the operator just started.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: to withdraw the arm as soon as the arming session starts a new turn, on OpenCode at a new user message and on Pi at `agent_start`, instead of waiting for the killer's timeout.

**How it works**: the adapter reads the record, and when it is armed for this session it disarms it with reason `user-message` and logs `arm-cancelled`. The killer then finds no armed record, logs `killer-no-armed-record` and sends nothing. The note stays open, and the wrapper prints the manual claim command when the runtime exits. No notification is sent, because nothing timed out.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Withdraw the arm on a new turn** | Acts before the killer can fire; uses events both hosts already emit | No timeout notification on these runtimes | 9/10 |
| Lengthen the killer's idle wait | One constant | Still guesses; a long thought outlasts any fixed wait, and every hop slows down | 4/10 |
| Watch OpenCode's database for writes | Closer to Claude's transcript watch | The database is shared by every session, so any session's write looks like activity | 3/10 |

**Why this one**: it acts on proof that the session is alive instead of guessing from silence.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A turn started just after the arm is never cut off on Pi or OpenCode: live reruns logged `arm-cancelled` within 1 ms on Pi and 200 ms on OpenCode, then `killer-no-armed-record`.

**What it costs**:
- On these two runtimes the operator sees the manual claim command at exit rather than a macOS notification. AC-017 states the replacement criterion.
<!-- /ANCHOR:adr-002-consequences -->
<!-- /ANCHOR:adr-002 -->
