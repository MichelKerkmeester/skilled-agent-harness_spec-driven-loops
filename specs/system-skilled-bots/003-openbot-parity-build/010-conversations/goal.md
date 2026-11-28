---
title: "Goal: Phase 10: conversations"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "conversations goal"
  - "phase 10 goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/010-conversations"
    last_updated_at: "2026-11-26T02:00:00Z"
    last_updated_by: "wo-08-writer"
    recent_action: "Bound the three child goals"
    next_safe_action: "Get the operator's approval of child 001's key map delta"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo08-010-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: conversations

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deliver Phase 10 of `../goal.md`: one conversation with your bots. `bots chat <id>` appends each message to an append-only file under the state root, runs one headless run per human message with the BOT.md body as the standing role, routes `@bot` to another bot, appends a resumed run's answer where the person asked and draws the transcript in the chat tab of `bots ui`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The chat surface is designed in child 001 before any code, and children 002 and 003 decide no layout, key, call, grammar or budget of their own. |
| D2 | The transcript prints as the three-key object of `contracts/cli-json.md` section 3.1, never a bare array. |
| D3 | A conversation belongs to the identity, and the bot id is the default conversation name. |
| D4 | One message is one run, and the reply is appended when the run ends. No stream. |
| D5 | The pane sends on a chat worker of its own and quit does not wait for it. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-chat-ux-and-pane-map | `001-chat-ux-and-pane-map/goal.md` |
| 002-conversation-runtime-and-chat-verb | `002-conversation-runtime-and-chat-verb/goal.md` |
| 003-chat-pane-and-proof | `003-chat-pane-and-proof/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n '^\| \*\*Approved\*\* \| Met \|' specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/key-map-delta.md` prints one line.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count.
- [ ] `node .skilled/bin/bots.cjs chat my-bot --transcript --json | jq -r 'keys | join(" ")'` prints `conversationId messages version`.
- [ ] `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_` prints `test result: ok. 26 passed`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/010-conversations --strict --recursive` prints `RESULT: PASSED`.
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
| Phase parent authored | Done | `spec.md` carries the threshold evidence and the map for three children |
| Child 001 design | Written | The frame check in `001-chat-ux-and-pane-map/tasks.md` printed `frames=26 bad=0` on 2026-11-26 |
| Key map approval | Pending | `001-chat-ux-and-pane-map/design/key-map-delta.md` section 6 reads `Unmet` |
| Implementation | Pending | `node .skilled/bin/bots.cjs chat my-bot` prints `bots: unknown verb: chat` and exits 2 |

### Deviations and findings

| Item | Note |
|------|------|
| The parent goal owns the binding | `../goal.md` names this phase in its row 010 and binds this file, which binds the three children. |
| Documents moved | The pre-expansion `plan.md`, `tasks.md`, `acceptance-criteria.md` and `implementation-summary.md` moved into child 002. Its `spec.md` and `goal.md` were rewritten there from the pre-expansion text. |
| Outside citations by line | Forty lines in other phases and in `contracts/` cite `010-conversations/spec.md`, `plan.md`, `tasks.md` or `acceptance-criteria.md` by line. Those files now live in child 002 or were rewritten, so the citations need a pass by their owners. |
| REQ-011 dropped, two contract lines to repoint | F-060 offered dropping REQ-011 or adding `--message-id`. The first was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive, so `contracts/records.md` sections 5 and 10 must repoint their REQ-011 citations at REQ-003 and drop the sentence that a re-sent message is a queue duplicate. `contracts/runtime-architecture.md` section 1.2 still sketches `chat BOT-ID --message TEXT` where the pane now sends on stdin. Both are the contract owner's. |
<!-- /ANCHOR:log -->
