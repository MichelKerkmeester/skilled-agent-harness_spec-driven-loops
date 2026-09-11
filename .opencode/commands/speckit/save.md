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
- Explicit apply/full-auto runs `node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js` with AI-authored JSON. That script is the whole write.
- Retrieval freshness is a separate, optional step: regenerate the trigger index with `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` when the packet's `trigger_phrases` changed. There is no indexing handoff, no daemon to wait for and no launcher file to check.

Guardrails:
- Do not use standalone `memory/*.md` files as save destinations.
- Do not claim an automatic hook save unless current hook evidence proves it.
- The writer is the only write path. Do not hand-edit generated metadata to stand in for a save.
- This is a direct-dispatch command with no workflow YAML by design; do not create or modify workflow YAML from this command.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation | `.opencode/commands/speckit/assets/save-presentation.txt` |

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
4. Choose one route category (listed under MODE ROUTING).
5. In default mode, return the save plan without mutating.
6. In explicit apply/full-auto mode, run the writer, inspect the post-save quality review, and patch HIGH metadata issues when practical. When the packet carries a `goal.md`, append one progress row to its log for what this session did. Always use the locked append: the goal command's log action on a bound session (`node .opencode/hooks/goal/bin/goal.cjs log "<item> | <state> | <evidence>"`, or `opencode_goal({ action: "log", item, state, evidence })` on OpenCode), or the session-free `node .opencode/hooks/goal/bin/goal.cjs packet-log <spec-folder> "<item> | <state> | <evidence>" --workspace <repo root>` on a runtime without a management surface or for an unbound packet. Never hand-edit the table, and never touch the durable slice from a save. Canonical spec-doc content is authored in the packet documents themselves; the writer owns the continuity frontmatter and the generated metadata pair.
7. Render the result using the presentation asset.

Tool map:

| Need | Script |
| --- | --- |
| Continuity frontmatter, description and graph-metadata refresh | `node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js` |
| Trigger-index regeneration, only when `trigger_phrases` changed | `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` |
| Trigger phrase correction | Edit the packet document's `trigger_phrases` frontmatter, then rerun the writer |

The writer keeps atomic same-directory update and lock semantics and depends on no background service. Ripgrep cannot write, so no retrieval recipe substitutes for it.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/speckit/assets/save-presentation.txt`:

- Startup questions and active spec-folder resolution prompts.
- Save plan, dashboard, approval, result-envelope, and error displays.
- Trigger-edit display, quality-review guidance, follow-up actions, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves routing and tooling.

---

## 6. WORKFLOW SUMMARY

The router resolves and validates the target spec folder, extracts the session context, chooses a route category, and either returns a non-mutating save plan (default) or runs the metadata/description/graph-metadata refresh via `generate-context.js` (explicit apply/full-auto). That writer is the whole write: it needs no daemon, and there is no indexing handoff after it. Canonical spec-doc content is authored in the packet documents themselves. Every user-facing string renders through the presentation asset. It is a direct-dispatch command with no workflow YAML by design.

Related commands: `/speckit:search` (lexical retrieval over spec docs and skill docs); `/speckit:resume` (session recovery and continuation).
