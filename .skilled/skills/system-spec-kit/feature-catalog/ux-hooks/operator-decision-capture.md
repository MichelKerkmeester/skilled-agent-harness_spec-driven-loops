---
title: "Operator decision capture"
description: "Queues each operator answer to an AI question and lets a full-auto `/speckit:save` write it into the bound packet's `decision-record.md` as a short decision with the exact question, options and answer kept beside it."
trigger_phrases:
  - "operator decision capture"
  - "decision capture"
  - "operator decisions"
  - "capture askuserquestion answers"
  - "verbatim operator answers"
version: 1.0.5.0
---

# Operator decision capture

This catalog entry maps the current decision-capture behavior to its implementation files, validation tests and operator reference.

## 1. OVERVIEW

An answer the operator gives to an AI question is a product decision, and its exact wording is evidence for it. Decision capture queues each answer locally, and a full-auto `/speckit:save` turns the queued answers into rows in the bound packet's `decision-record.md`, with the verbatim exchange in the same file under the same `Q` id.

This feature is cataloged under UX hooks because its live half is a hook. The save-time half runs inside the continuity writer and needs no daemon.

---

## 2. HOW IT WORKS

### Capture

On Claude, a PostToolUse hook on `AskUserQuestion` hands each answered question to the runtime-neutral core, which appends one record per answer to a per-session queue under the gitignored `.skilled/skills/.state/decision-capture/` folder, inside a subfolder named by a hash of the project's real root, so projects linked to one Skilled checkout keep separate queues. Each record carries a source key built from the runtime, the session, the tool-use id and the question's position, and a key is queued at most once. Questions about Gate 3, spec folders, worktrees, branches and commit or push permission are dropped before they reach the queue. On Pi, an extension on the `tool_result` event does the same for `ask_user_question` and for pi-plan-build's `question` tool, using the Pi sweep's own mapping so both produce the same key. On OpenCode, the `decision-capture.js` plugin does the same on `tool.execute.after` for the `question` tool, with the key the OpenCode sweep builds. On Devin, a PostToolUse adapter on `ask_user_question` reuses the Devin sweep's mapping. On DSH, the `repo-guards` adapter queues `ask_user_question` answers on `tools/result` and a late reply to a timed question on `session/event`, through the DSH sweep's own mapping. The adapter also loads in a fan-out leaf, but a headless run has no question tool to answer. `SYSTEM_DECISION_CAPTURE_DISABLED=1` turns every live capture off.

### Sweeps

`/speckit:save` runs a sweep for the current runtime before it writes. On Claude, `sweep-transcript.mjs` copies any answered `AskUserQuestion` call the hook missed from the session transcript, and lists plain chat questions that closed an assistant turn together with the typed reply. On OpenCode, `sweep-opencode.mjs` reads answered question calls from OpenCode's SQLite store, opened read-only. On Devin, `sweep-devin.mjs` reads them from Devin's stored transcripts. On Codex, `sweep-codex.mjs` reads answered `request_user_input` calls from the stored rollout, and on Pi, `sweep-pi.mjs` reads answered `ask_user_question` and `question` results from the session file. Both skip a cancelled or interrupted question. On DSH, `sweep-dsh.mjs` reads the session log under `$DSH_HOME/sessions`, or `~/.dsh/sessions`, walking every Zstandard frame because Node decodes only the first, and records a late reply under the same key as the timed question it answers. Every sweep also lists plain chat questions answered by the next typed prompt, through the shared detector in `lib/chat-questions.mjs`. Each sweep maps its own store into assistant, tool-call and typed-prompt turns, and the OpenCode sweep reads them from `session_message` rows only. Each sweep prints the pending records and the chat candidates, each with its `key`, and every sweep prints an `error` and exits 1 when the session file it reads cannot be read.

### Save

When the target packet already has a `decision-record.md`, the save first runs `match-decision-table.js`. It finds each pending answer that already sits as a row in a hand-written decision table, and with `--apply` records that row's id in `consumed.jsonl`, so the answer needs no entry. The match is gated on the answer and scored on options, topic, question and date; a tie, a score under the threshold or a row another key holds with a different answer leaves the answer pending.

Every save also runs `match-decision-table.js --scan-orphans`, which lists each session whose answers are still pending, so the operator hears about answers from a session that ended without a save.

Each chat candidate also carries a deterministic `evidence` object: the question's type, whether the reply names an offered option, how many content words it shares with the question, whether it opens with a new task, and whether it shifts topic. No candidate is accepted or rejected by code: the session model still judges each one, reads the evidence first, and ends each chat entry's `why` with an `Evidence:` sentence so the judgment can be audited in the record. The session model writes one `operatorDecisions` entry per pending answer and per confirmed chat candidate, with the printed `key` as its `sourceKey`. A plan-only save lists the entries and writes nothing. A `--full-auto` save hands them to `decision-record-writer.ts`, which upserts a row in the `operator-decisions` anchor and adds the exact question, options and answer to the `operator-answers-verbatim` anchor. A known source key keeps its `Q` id. A row written by hand carries no key, so the writer matches it by its question and answer text, ignoring case and spacing. A repeated save changes no byte. A save whose answer changed for a known key rewrites that row and its appendix item.

The writer can create `decision-record.md` at any level. When it does so in a packet whose `spec.md` carries no level marker, it first stamps the level the validator already detects, so the new file cannot change that level. Written keys go to `consumed.jsonl` once each, so a later save does not offer them again.

### Nudge

The Claude Stop hook counts the answers still waiting for a record and reports a rising count once. On OpenCode the plugin puts the same count into the next request's system text, and on Pi the extension shows it through `ctx.ui.notify` at the end of a turn. Devin computes the count but discards Stop-hook output, so no reminder reaches a Devin operator. On DSH the adapter injects the count at idle as a `repo-guards` message that rides with the operator's next prompt, because DSH has no notice a plugin can raise. A save that consumes only part of the queue lowers the count it last reported, so the next new answer is reported again.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/hooks/decision-capture/lib/capture-core.mjs` | Hook core | Normalizes answers, filters process questions, appends to the locked queue and computes the Stop-hook count. |
| `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs` | Claude adapter | PostToolUse entry point for `AskUserQuestion`. |
| `.skilled/hooks/decision-capture/pi/decision-capture.ts` | Pi extension | `tool_result` entry point for `ask_user_question` and `question`, linked from `.pi/extensions/`. |
| `.opencode/plugins/decision-capture.js` | OpenCode plugin | `tool.execute.after` capture and the pending-answer system line. |
| `.skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs` | Devin adapter | PostToolUse entry point for `ask_user_question`. |
| `.skilled/hooks/decision-capture/dsh/decision-capture.mjs` | DSH adapter | `tools/result`, late-reply and idle-nudge entry points, linked from `.dsh/plugins/repo-guards/adapters/`. |
| `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs` | Save-time sweep | Claude transcript reader. |
| `.skilled/hooks/decision-capture/lib/chat-questions.mjs` | Shared detector | Chat-candidate pairing from ordered turns and each candidate's evidence object, used by every sweep. |
| `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs` | Save-time sweep | OpenCode SQLite store reader. |
| `.skilled/hooks/decision-capture/bin/sweep-devin.mjs` | Save-time sweep | Devin transcript reader. |
| `.skilled/hooks/decision-capture/bin/sweep-codex.mjs` | Save-time sweep | Codex rollout reader. |
| `.skilled/hooks/decision-capture/bin/sweep-pi.mjs` | Save-time sweep | Pi session reader. |
| `.skilled/hooks/decision-capture/bin/sweep-dsh.mjs` | Save-time sweep | DSH session-log reader with a Zstandard frame walker. |
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` | Runtime library | Row and appendix upsert, level guard and consumed-key log. |
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts` | Runtime library | Hand-written table parse, answer-gated scoring and refusals. |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts` | Save-time CLI | Matches a session's pending answers to table rows; `--apply`, `--scan-orphans` and `--release`. |
| `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` | Save pipeline | Routes each entry to its packet and writes it in full-auto mode. |
| `.skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts` | Save pipeline | Validates the `operatorDecisions` payload. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` | Claude Stop hook | Pending-answer nudge. |
| `.skilled/skills/system-spec-kit/templates/addons/decision-record.md.tmpl` | Template | The two operator anchors. |
| `.skilled/skills/.state/decision-capture/README.md` | Runtime state | Queue, consumed log and cleanup. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/hooks/decision-capture/lib/capture-core.test.mjs` | Automated test | Capture, filter, deduplication, locking, adapter and nudge. |
| `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.test.mjs` | Automated test | Claude adapter project-directory fallback. |
| `.skilled/hooks/decision-capture/lib/chat-questions.test.mjs` | Automated test | Chat-candidate pairing shared by every sweep. |
| `.skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs` | Automated test | The hooks README coverage row gives every runtime a covered cell or a stated reason. |
| `.skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs` | Automated test | Transcript recovery and chat candidates. |
| `.skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs` | Automated test | OpenCode store reader. |
| `.skilled/hooks/decision-capture/bin/sweep-devin.test.mjs` | Automated test | Devin transcript reader. |
| `.skilled/hooks/decision-capture/bin/sweep-codex.test.mjs` | Automated test | Codex rollout reader on a redacted live sample. |
| `.skilled/hooks/decision-capture/bin/sweep-pi.test.mjs` | Automated test | Pi session reader on a redacted live sample. |
| `.skilled/hooks/decision-capture/bin/sweep-dsh.test.mjs` | Automated test | DSH session-log reader, late replies and multi-frame logs. |
| `.skilled/hooks/decision-capture/tests/dsh-decision-capture.test.mjs` | Automated test | DSH adapter capture, late reply, nudge and kill switch. |
| `.skilled/hooks/decision-capture/pi/decision-capture.test.ts` | Automated test | Pi extension, kill switch and same-key dedup with the sweep. |
| `.opencode/plugins/tests/decision-capture.test.cjs` | Automated test | OpenCode plugin capture, kill switch, dedup with the sweep and the nudge line. |
| `.skilled/hooks/decision-capture/devin/ask-capture-posttooluse.test.mjs` | Automated test | Devin adapter on a redacted live payload, both producer orders, kill switch and refusals. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts` | Automated test | Upsert, idempotence, hand-written rows, appendix round trip, level guard and consumed log. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts` | Automated test | Plan-only and full-auto saves, routing and consumption. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/decision-table-matcher.vitest.ts` | Automated test | Table parse, scoring threshold, ties and refusals. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/match-decision-table.vitest.ts` | Automated test | Matcher CLI modes, idempotent `--apply` and exit codes. |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-session-stop.vitest.ts` | Automated test | Stop-hook nudge. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-claude-hook.md` | Manual playbook | Claude hook, registry and mirror wiring, kill switch. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md` | Manual playbook | Claude, OpenCode and Devin sweeps queue each answer once, and the Claude sweep prints each chat candidate's evidence. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md` | Manual playbook | Plan-only, full-auto and a byte-identical repeat save. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md` | Manual playbook | Live multi-turn conversation on five runtimes. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-kill-switch-conversation.md` | Manual playbook | Disabled capture leaves no queue file or nudge. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-sibling-reproof-conversation.md` | Manual playbook | Hand-written row consumed under its id; mid-message chat question offered once. |

---

## 4. SOURCE METADATA

- Group: UX Hooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `ux-hooks/operator-decision-capture.md`
- Related reference: `.skilled/skills/system-spec-kit/references/memory/save-workflow.md`
