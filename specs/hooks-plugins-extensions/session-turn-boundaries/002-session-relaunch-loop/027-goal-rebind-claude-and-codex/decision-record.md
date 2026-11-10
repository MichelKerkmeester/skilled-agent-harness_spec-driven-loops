---
title: "Decision Record: goal rebind in Claude and Codex receivers"
description: "Why a Claude receiver starts on the goal command with its claim moved to start context, and why the Codex seed instruction is deferred until a Codex sender can carry a packet."
trigger_phrases:
  - "goal rebind claude start prompt decision"
  - "codex goal seed deferred"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex"
    last_updated_at: "2026-10-25T02:00:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Recorded the Claude start-prompt design and the Codex deferral"
    next_safe_action: "None for this phase; the live-proof and docs phase follows"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/hooks/session-relaunch/claude/compact-pointer.mjs"
      - ".skilled/hooks/session-relaunch/lib/goal-handover.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-027-goal-rebind-claude-and-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: goal rebind in Claude and Codex receivers

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: A Claude receiver starts on the goal command and gets its claim as start context

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-25 |
| **Deciders** | Build session, on the probe verdicts and the operator default that the receiver sets the goal without asking |

---

<!-- ANCHOR:adr-001-context -->
### Context

A Claude receiver was started with one prompt, the claim seed. The probes showed that a start prompt that begins `/goal <slice>` sets the goal, interactively and under `-p`, up to 4,000 characters, and that a `SessionStart` hook cannot send the command in an interactive session. A start prompt is one prompt, so the claim has to reach the session another way. The probes also showed that `SessionStart` `additionalContext` is delivered as context, though it never runs a command.

### Constraints

- The goal text is read from `goal.md` at launch, never a copy, and only the `chat_slice` goes in, only at `packet_budget=ok`.
- The claim must still carry the note path, the spec folder and the Gate 3 answer, as the seed did.
- A hop that cannot send a goal must work exactly as before.
- A hook must not act in a dispatched child or in a runtime started from the loop session's shell.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: the start prompt is `/goal <slice>`, and the claim seed the wrapper would have sent travels in `SKILLED_LOOP_CLAIM_SEED` to a `SessionStart` hook, which delivers the claim instructions as start context.

**How it works**: after `consume`, `skilled-loop` renders the slice through `lib/goal-handover.cjs`, which runs `goal.cjs packet <packet> --workspace <root>` for a packet it has already shape- and containment-checked. When a slice comes back, the launch arguments carry `/goal <slice>` and the environment carries the claim seed. The `SessionStart` entry that already runs `claude/compact-pointer.mjs` handles the `startup` source: it requires the variable, an unset `AI_SESSION_CHILD`, the goal switch on, a valid session id and a seed whose note path parses, then emits the seed and its claim, resume and complete steps ahead of "any work on the goal". When the helper refuses, the start prompt stays the claim seed, the variable is absent and the wrapper prints one warning line naming the reason, for a packet that was named and could not be sent. The off switch and a hop with no packet print nothing, because neither is a surprise to the operator. Hermes takes the packet as `HERMES_SPEC_FOLDER`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Goal command as the prompt, claim in start context** | The goal is set from the file; proven interactively; no keystroke from the operator | The claim is context, not a message, so the model must act on it unprompted | 8/10 |
| A start hook that sends the command | The prompt stays the claim seed | Probe verdict: the interactive session never submits a hook's `initialUserMessage`; `additionalContext` carrying `/goal` sets nothing | 1/10 |
| The slice rides in the seed as a fenced block and the model sends `/goal` | No new hook | The model chooses to send it, a long slice in a seed is a copy for the model to retype, and the claim seed grows by 4,000 characters | 4/10 |
| A new hook file and registry rows | Name states the purpose | Touches the hook registry and every generated runtime mirror for a handler of an event already registered | 5/10 |

**Why this one**: it is the only option that sets the goal without the model's choice, and the claim already arrives as hook context for a seed prompt, so moving it to start context changes its carrier and not its content.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A Claude hop with a goal packet starts with the goal set from `goal.md` and the note claimed, with no operator keystroke.
- A hop with no goal, the off switch or a refused slice behaves as before.

**What it costs**:
- The receiver's first message is the goal, so the claim reaches the model as context. The live runs show it claims first, and a model that ignored context would start on the goal with the note unclaimed. The wrapper still names the open note in its warning if the session ends unclaimed.
- The `SKILLED_LOOP_` prefix on the variable makes the existing nested-run check drop it for a runtime started from the loop session's shell. `AI_SESSION_CHILD=1` covers a dispatched child.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later Claude release delivers or drops start context differently | M | The live proof records the version; the conformance tests pin the hook's output |
| A Hermes child inherits `HERMES_SPEC_FOLDER` | L | The plugin has no child marker; recorded as a limit in the README |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The goal command must be the whole start prompt, so the claim cannot stay in it |
| 2 | **Beyond Local Maxima?** | PASS | The hook-sends-command and fenced-block options were compared against the probe verdicts |
| 3 | **Sufficient?** | PASS | One helper, one wrapper branch and one hook branch cover set, refuse and off |
| 4 | **Fits Goal?** | PASS | The phase exists to set the goal in the receiver from `goal.md` |
| 5 | **Open Horizons?** | PASS | Another runtime with a command-only goal can reuse the helper |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `lib/goal-handover.cjs` renders and checks the slice.
- `skilled-loop` builds the start prompt, exports `SKILLED_LOOP_CLAIM_SEED` and `HERMES_SPEC_FOLDER`.
- `claude/compact-pointer.mjs` delivers the claim for the `startup` source.

**How to roll back**: revert the phase diff. No registry row or generated settings file changed, so nothing needs regenerating.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The Codex seed instruction is deferred, not built

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-25 |
| **Deciders** | Build session, on the brief's instruction to build no dead code |

---

<!-- ANCHOR:adr-002-context -->
### Context

The phase asked for a Codex seed instruction that has the model call `create_goal` from the slice. Probe C showed that path works when a first turn exists. The seed is only useful when a Codex receiver is handed a goal packet. A hop relaunches the runtime it left, because the wrapper's runtime is fixed at the first launch and `armableRecord` refuses a record from another runtime. A Codex sender writes no `goal_packet`, because `resolveGoalPacket` answers empty for it: the Codex goal store, `goals_1.sqlite` under the Codex home, keys a goal by thread with objective text and a status and no packet. Its `thread_goals` table held 0 rows when read on 2026-10-25.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: build nothing for Codex in this phase, and record the seed instruction as deferred until a Codex goal reader exists.

**How it works**: no Codex receiver can be handed a packet today, so the instruction would never run. The existing resolver test that pins a Codex sender to an empty packet stays as the guard. When a reader can match a Codex goal to a packet, the instruction belongs in `codex/prompt-seed.mjs`'s seed text, fed by the same helper, within the 4,000-character limit probe C reported.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer until a Codex goal reader exists** | No dead code; the unreachable path cannot rot untested | AC-002 stays unproven on Codex | 8/10 |
| Build the seed instruction now, gated on `SESSION_RELAUNCH_GOAL_PACKET` | Ready when a reader lands | It would be tested only against a hand-set variable, never from a real hop, and a probe n of 1 backs its behavior | 3/10 |

**Why this one**: an untestable path with no producer is scaffolding, and the model-mediated behavior it relies on was seen once.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No code ships that nothing can reach.

**What it costs**:
- A Codex hop carries no goal to its receiver. Mitigation: the goal posture rule still has the model send the fenced slice.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A Codex reader lands and nobody builds the seed | L | The README names the dependency in its Codex paragraph |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Nothing can produce a Codex packet today |
| 2 | **Beyond Local Maxima?** | PASS | Building it gated on the variable was compared |
| 3 | **Sufficient?** | PASS | The resolver test already pins the producer side |
| 4 | **Fits Goal?** | PASS | The goal is a receiver with its goal set, and Codex has none to set |
| 5 | **Open Horizons?** | PASS | The path stays open for a reader |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Nothing in `codex/prompt-seed.mjs`. AC-002 is waived under this record and AC-007 pins the reason.

**How to roll back**: none needed.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---
