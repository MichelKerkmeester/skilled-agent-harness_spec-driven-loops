---
title: "Goal: Phase 2: adapter-and-record-contracts"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "adapter and record contracts goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-002-adapter-contracts"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: adapter-and-record-contracts

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix the channel contracts the packet contracts leave open, in five design documents: the capability matrix, every channel record's lifecycle and samples with the derived secret names, the acknowledge order per transport, the five numbered conformance rules and the operator runbook, so the build children implement without a design decision of their own.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Capabilities are eight booleans and three descriptor facts per transport, and an undeclared operation returns the unsupported result before any I/O. |
| D2 | A channel with several credentials derives each further secret name by a fixed suffix on its configured name. `contracts/` is not edited. |
| D3 | Every transport with an acknowledge runs the durable step, then the seen record, then the acknowledge. |
| D4 | The action id index is 1-based, so a button and a numbered reply send the same number. |
| D5 | A queue entry's state only moves forward, a `sending` entry found at start becomes `unknown` and a retry waits the larger of the backoff step and the provider's own wait. |
| D6 | Only a six-digit attempt that is not the pending code counts toward the pairing lockout. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each of T004 to T008 in `tasks.md` prints what it says.
- [ ] `git diff --name-only "$(rg -o 'base commit [0-9a-f]{40}' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/goal.md | cut -d' ' -f3)"..HEAD -- specs/system-skilled-bots/003-openbot-parity-build/contracts` prints nothing.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Five design documents | Written | On 2026-11-26 T004 printed 11 and 14, T005 printed 9, 8 and 1, T006 printed 5 and 4, T007 printed 5, 18 and 7, T008 printed 12 and 12 and T009 printed nothing |
| Base commit | Recorded | base commit dbcd1c2ce1e8776ea5b9d344fc2dd1559e4b5e1c, the commit this phase started from. T009 and AC-007 read it from here |

### Deviations and findings

| Item | Note |
|------|------|
| `records.md` restates the contract | The work order asks for field tables and samples here. The contract has them since WO-01, so each table here names its section and the contract wins. |
| Gaps in the frozen contract | One `secret` per channel, no home for the Signal account, the WhatsApp phone number id or the two local addresses and a queue sample whose text is not `deliveryMessage()`. Each is in the parent spec section 8. |
| UNKNOWN | Whether signal-cli keeps events for a disconnected client. The Slack app-token scope is marked for the operator to confirm. |
| The shapes moved here, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive | F-063's first alternative puts the TypeScript shapes and the adapter method signatures in `design/capabilities.md` section 3, because the child is named for the adapter contract and defined none. |
| The sender rule covers every event kind, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive | F-019's first alternative resolves the chat and the sender at step 3 for every event kind, so a typed line on Signal or WhatsApp is covered as well as a press. |
| The failed status is mapped, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive | F-023's first alternative maps a `failed` status for a known platform message id onto the queue entry and the run record, and the runbook states the 24-hour window. |
| The index takes a lock, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive | F-024's first alternative names an exclusive lock file around every index read-modify-write, and the opening section names the helper that sets 0600 after the atomic write. |
| The copy check compares lines, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive | O-011's first alternative replaces the keyword grep with a `comm -12` comparison of the design's lines against the reference sources. |
| The backoff check reads the file, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive | O-012's first alternative drops the constant arithmetic and greps the table out of `records.md`. |
| The contract check reads a base commit, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive | O-013's first alternative replaces `git status --short` with a diff from the base commit recorded above, so a contract edit this phase commits is caught too. |
<!-- /ANCHOR:log -->
