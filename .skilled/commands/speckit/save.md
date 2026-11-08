---
description: Save current conversation context into canonical spec-doc continuity surfaces
argument-hint: "<spec-folder>"
allowed-tools: Read, Edit, Bash, Grep, Glob, Task
---

# /speckit:save

Thin router for canonical continuity saves.

## 1. ROUTER CONTRACT

Inputs:
- `$ARGUMENTS` may contain an explicit spec folder.
- If `$ARGUMENTS` is empty, resolve the active spec folder using Gate 3 carry-over first, session file evidence second, and a targeted user question only when ambiguous.

Outputs:
- Default response is a save plan: target route, proposed edits, blockers, advisories, and follow-up actions.
- Explicit apply/full-auto runs `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js` with AI-authored JSON.
  That script is the whole write.
  The JSON can carry the packet's continuity (`recent_action`, `next_safe_action`, `blockers`, `key_files`, `completion_pct`, `open_questions`, `answered_questions`), which only a `--full-auto` run writes.
  The field rules are in `save-workflow.md` under Continuity Fields.
  A full-auto run may also carry the writer inputs `--session-id <id>` and `--runtime <slug>` (claude, codex, opencode, pi, devin, dsh or cursor). With both present, the writer mints the writer-owned `_memory.continuity.session_ref` pointer from them, the repository root and the save time.
  Never send `session_ref` in the JSON: the writer ignores a payload copy and names it, and a known runtime with a gated reader (cursor) omits the pointer while the save continues.
  The `session_ref` field rules are in `save-workflow.md` under Session Reference.
  The JSON can also carry `operatorDecisions`, which a `--full-auto` run writes into the target packet's `decision-record.md`, creating that file when it is absent. The field rules are in `save-workflow.md` under Operator Decisions.
  Every mode refreshes `description.json`, `graph-metadata.json` and the phase-parent pointers, and `hybrid` behaves like the default `plan-only`.
- Retrieval freshness is a separate, optional step: regenerate the trigger index with `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` when the packet's `trigger_phrases` changed. There is no indexing handoff, no daemon to wait for and no launcher file to check.

Guardrails:
- Do not use standalone `memory/*.md` files as save destinations.
- Do not claim an automatic hook save unless current hook evidence proves it.
- The writer is the only write path. Do not hand-edit generated metadata to stand in for a save.
- This is a direct-dispatch command with no workflow YAML by design; do not create or modify workflow YAML from this command.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation | `.skilled/commands/speckit/assets/save-presentation.txt` |

This is a direct-dispatch command: it routes straight to the `generate-context.js` writer and owns no workflow YAML by design. Nothing it calls needs a background service.

Before rendering any prompt, dashboard, or result block, read the presentation asset and follow it as the display source of truth.

---

## 3. MODE ROUTING

Operating modes:
- Default mode returns the save plan without mutating.
- Explicit apply/full-auto mode executes the metadata/description/graph-metadata refresh through the writer.

Route category (chosen during processing): `narrative_progress`, `task_update`, `decision_log`, `research_findings`, `metadata_only`, or `drop`. The runtime also accepts the aliases `what_built`, `how_delivered`, `decisions`, `research` and `metadata` and folds them into those six.

---

## 4. EXECUTION TARGETS

Procedure:

1. Resolve and validate `target_folder`.
2. Check topic/folder alignment and stop for confirmation on mismatch.
3. Extract session summary, key decisions, modified files, trigger phrases, technical context, tool calls, and notable exchanges.
   On Claude, also collect operator decisions: run `node .skilled/hooks/decision-capture/bin/sweep-transcript.mjs` from the repository root.
   It copies any AskUserQuestion answer the hook missed into the local queue, then prints `pending` and `chat_candidates`.
   On OpenCode run `node .skilled/hooks/decision-capture/bin/sweep-opencode.mjs` instead, and on Devin `node .skilled/hooks/decision-capture/bin/sweep-devin.mjs`. Each reads the runtime's stored session and prints the same `pending` list and `chat_candidates`.
   On Codex run `node .skilled/hooks/decision-capture/bin/sweep-codex.mjs`, on Pi `node .skilled/hooks/decision-capture/bin/sweep-pi.mjs` and on DSH `node .skilled/hooks/decision-capture/bin/sweep-dsh.mjs`. They print the same two lists, print nothing at all when both are empty, and print an `error` and exit 1 when the session file cannot be read.
   When the target packet already has a `decision-record.md`, run `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/match-decision-table.js --session <id> --record <path>` next, before writing any entry, whether or not you have seen a hand-written table in it.
   The dry run lists each pending answer that already sits as a row in a hand-written decision table, and in an apply or full-auto save a second run with `--apply` records that row's id as consumed, so the answer needs no entry.
   On every save, whether or not the packet has a record, run `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/match-decision-table.js --scan-orphans`. It prints one `<count> <session-id>` line per session whose answers are still pending.
   Tell the operator about every listed session other than this one, with its count: those answers came from a session that ended without a save. Write no entries for them in this save.
   Write one `operatorDecisions` entry for each pending answer.
   Each chat candidate carries an `evidence` object: `questionType`, `optionMatch`, `contentOverlap`, `imperativeOpening` and `topicShift`. Read it before judging the candidate.
   A reply that opens with a new task or a topic shift, shares no content word with the question and names no offered option usually starts new work rather than answering. `optionMatch: not_applicable` is no evidence against an answer.
   The evidence informs the judgment and never replaces it. Several candidates can share one reply, so write an entry only for a question that reply answers.
   End every chat entry's `why` with `Evidence: <questionType>, option <optionMatch>, overlap <contentOverlap>, imperative <imperativeOpening>, shift <topicShift>.`, after the stated reason, or after `Not stated.` when none was given. Pending tool answers carry no evidence and stay as they are.
   Leave out a candidate whose answer is null. The sweeps already drop process questions, so every pending record and candidate they print is a product question.
   Each entry carries the record's printed `key` as its `sourceKey`, a one-sentence `decided`, the `why` the session stated, `supersedes`, `carriedBy` and the exact `question`, `options` and `answer`.
   Fill `carriedBy` with what in the target packet carries the decision: requirement or task ids, files or anchors, such as `REQ-003, plan.md`.
   For a pending answer, omit `why` when no reason was stated, so the record says `Not stated.` instead of a guess. For a chat entry with no stated reason, write `why` as `Not stated.` followed by the `Evidence:` sentence.
   Mark an entry `scope: "cross-phase"` when it decides something for every phase of a phase parent.
4. Choose one route category (listed under MODE ROUTING).
5. In default mode, return the save plan without mutating.
6. In explicit apply/full-auto mode, you run the writer and inspect the post-save quality review.
   You patch HIGH metadata issues when practical.
   When the packet carries a `goal.md`, you append one progress row to its log for what this session did.
   You always use the locked append.
   On a bound session, use the goal command's log action: `node .skilled/hooks/goal/bin/goal.cjs log "<item> | <state> | <evidence>" --runtime <runtime> --session <native session id> --workspace <repo root>`.
   On OpenCode with a bound session, use `opencode_goal({ action: "log", item, state, evidence })`.
   On a runtime without a management surface or for an unbound packet, use the session-free `node .skilled/hooks/goal/bin/goal.cjs packet-log <spec-folder> "<item> | <state> | <evidence>" --workspace <repo root>`.
   You never hand-edit the table.
   You never touch the durable slice from a save.
   Canonical spec-doc content is authored in the packet documents themselves.
   The writer owns the continuity frontmatter and the generated metadata pair.
   You update continuity by putting its fields in the JSON.
   You never edit `_memory.continuity` by hand.
   The writer also owns `session_ref`: on a full-auto run it mints the pointer from `--session-id` and `--runtime`, so pass both beside the writer call and never author the object yourself.
   A save targeted at a phase parent writes that continuity to the child its payload paths name.
   When no payload path does, it writes that continuity to the child the parent's pointer names.
   When the paths span two children, it writes no continuity and lists the candidates.
   You rerun with one of them as the target.
   The same save writes the `operatorDecisions` entries into `decision-record.md` and records their keys as consumed.
   A default-mode save only lists them.
7. Render the result using the presentation asset.

Tool map:

| Need | Script |
| --- | --- |
| Continuity frontmatter, description and graph-metadata refresh | `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js` |
| Operator answers waiting for a decision record, on Claude | `node .skilled/hooks/decision-capture/bin/sweep-transcript.mjs` |
| Operator answers waiting for a decision record, on OpenCode or Devin | `node .skilled/hooks/decision-capture/bin/sweep-opencode.mjs` or `sweep-devin.mjs` |
| Operator answers waiting for a decision record, on Codex, Pi or DSH | `node .skilled/hooks/decision-capture/bin/sweep-codex.mjs`, `sweep-pi.mjs` or `sweep-dsh.mjs` |
| Answers already holding a row in a hand-written decision table | `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/match-decision-table.js --session <id> --record <path>` |
| Trigger-index regeneration, only when `trigger_phrases` changed | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` |
| Trigger phrase correction | Edit the packet document's `trigger_phrases` frontmatter, then rerun the writer |

The writer keeps atomic same-directory update and lock semantics and depends on no background service. Ripgrep cannot write, so no retrieval recipe substitutes for it.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/speckit/assets/save-presentation.txt`:

- Startup questions and active spec-folder resolution prompts.
- Save plan, dashboard, approval, result-envelope, and error displays.
- Trigger-edit display, quality-review guidance, follow-up actions, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves routing and tooling.

---

## 6. WORKFLOW SUMMARY

The router resolves and validates the target spec folder, extracts the session context, chooses a route category, and either returns a non-mutating save plan (default) or runs the metadata/description/graph-metadata refresh via `generate-context.js` (explicit apply/full-auto). A full-auto run also writes the continuity fields and any operator decisions.
That writer is the whole write: it needs no daemon, and there is no indexing handoff after it.
Canonical spec-doc content is authored in the packet documents themselves.
Every user-facing string renders through the presentation asset.
It is a direct-dispatch command with no workflow YAML by design.

Related commands: `/speckit:search` (lexical retrieval over spec docs and skill docs); `/speckit:resume` (session recovery and continuation).

A save payload's `contextType` is checked against the session list in spec-kit's `shared/context-types.ts`: `implementation`, `research`, `debugging`, `review`, `planning`, `decision`, `architecture`, `configuration`, `documentation`, `general` and `discovery`. These classify the session and set its project phase, so the list is separate from the four values a doc's frontmatter uses.
