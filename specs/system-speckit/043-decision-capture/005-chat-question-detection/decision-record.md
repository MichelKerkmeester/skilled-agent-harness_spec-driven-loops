---
title: "Decision Record: Phase 5: chat-question-detection"
description: "Why chat-question detection was extended from the Claude sweep to the OpenCode, Devin, Codex and Pi sweeps."
trigger_phrases:
  - "chat question detection decision record"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/005-chat-question-detection"
    last_updated_at: "2026-11-02T12:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the scope extension to every runtime"
    next_safe_action: "Build the shared detector and the four reader mappers"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-005-chat-question-detection"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 5: chat-question-detection

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Detect chat questions on every runtime

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-02 |
| **Deciders** | The operator, through the question tool on 2026-11-02, choosing "Build chat detection elsewhere" over a Claude-only limit or a save-step instruction. |

---

<!-- ANCHOR:adr-001-context -->
### Context

This child built chat-question detection for the Claude sweep only, and listed the other runtimes out of scope. The 006 main scenario then ran on Pi. Pi queued all 6 tool answers live, but the S5 answer the operator typed in chat ("No, keep it static") never reached the decision record, because the Pi sweep prints an empty `chat_candidates`. OpenCode recorded the same answer only because its subject chose to.

The parent goal asks for every operator answer to land, in every runtime that offers an answer surface.

### Constraints

- The Claude sweep's output must not change. Its 23 tests stay as they are.
- Each reader keeps its own storage format, and none of them writes to the runtime's own state.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: move the detector into `lib/chat-questions.mjs` and have each runtime's sweep feed it.

**How it works**: the detector takes the session as ordered turns: assistant text, an assistant tool call, or a prompt the operator typed. Each sweep maps its own store to those turns. The Claude sweep reads the JSONL transcript, OpenCode its SQLite messages, Devin its transcript steps, Codex its rollout and Pi its session file. The key rule, the caps and the process filter are the same for all five, and each key carries its runtime's name.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One shared detector, one mapper per reader** | One rule set, stable keys, a repeat save stays idempotent | Four readers change | 8/10 |
| Record the limit and keep chat Claude-only | No code | Chat answers stay lost on four runtimes | 4/10 |
| Tell the save step to scan the conversation itself | Cheap | Relies on the model, and without a key a repeat save could write a second row | 3/10 |

**Why this one**: the operator chose it. It is also the only option where a chat answer gets a stable key, so the consumed log keeps a repeat save from adding it twice.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A plain chat answer reaches the decision record on every runtime.

**What it costs**:
- Four readers depend on how each runtime stores user prompts. Mitigation: each reader test runs on a redacted fixture from a real session.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A runtime stores injected context as a user message | M | Each mapper drops entries the runtime marks as non-typed, and its test covers one |
| A runtime update changes its message shape | M | The fixture test fails on the new shape |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The Pi run lost the S5 chat answer |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | One detector, four mappers, one fixture each |
| 4 | **Fits Goal?** | PASS | The parent objective names every runtime with an answer surface |
| 5 | **Open Horizons?** | PASS | A new runtime adds one mapper |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `spec.md`: the in-scope list gains the four runtimes, the out-of-scope line is removed, REQ-010 is added.
- `acceptance-criteria.md`: AC-011. `tasks.md`: T022 to T028.

**How to roll back**: revert the four readers and `lib/chat-questions.mjs`, restore the out-of-scope line, and delete REQ-010, AC-011, T022 to T028 and this record.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Chat-question detection is built into the OpenCode, Devin, Codex and Pi sweeps, not left as a Claude-only limit. | Not stated. | The out-of-scope line that left chat questions on other runtimes to other children | ADR-001, REQ-010, AC-011, T022 to T028 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:2cdc1c20-d541-4a71-ba53-999a34105259:toolu_018tSHSzX1gYDGHratjNNXZL:0 -->

Question:
```text
In the decision-capture live test, the Pi run captured all 6 tool answers (no duplicates, the repeat save left the record unchanged), but not the S5 plain-chat answer ("No, keep it static"). Chat-answer detection (child 005) reads only the Claude transcript. On OpenCode, Pi, Devin and Codex the save sweep returns no chat candidates by design, while the scenario expects that chat row on every runtime. OpenCode recorded it on its own; Pi didn't. How should chat answers outside Claude Code be handled?
```

Options:
```text
Claude-only, record it (Recommended)
Build chat detection elsewhere
Make the save step ask
```

Answer:
```text
Build chat detection elsewhere
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
