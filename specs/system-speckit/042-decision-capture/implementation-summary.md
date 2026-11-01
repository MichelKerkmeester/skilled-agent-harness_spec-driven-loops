---
title: "Implementation Summary"
description: "A full-auto save now writes operator answers into the decision record with a verbatim appendix, captured live on Claude and swept from OpenCode and Devin sessions."
trigger_phrases:
  - "decision capture implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-decision-capture"
    last_updated_at: "2026-11-01T12:30:00Z"
    last_updated_by: "build-orchestrator"
    recent_action: "Registered Claude hook; added OpenCode and Devin readers"
    next_safe_action: "The main session reviews and commits the uncommitted build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-042-decision-capture"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 042-decision-capture |
| **Completed** | 2026-11-01, uncommitted until the main session commits it |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A full-auto `/speckit:save` can now write each operator answer into the packet's `decision-record.md` as a short decision, with the exact question, options and answer kept beside it under the same Q id. Saving twice changes no byte, process questions never reach the record, and creating the record cannot move the packet's validated level.

### Automatic decision capture: record every operator question and answer, AI-rewritten into the bound packet's decision record

On Claude, a PostToolUse hook queues each AskUserQuestion answer the moment you give it. The live probe confirmed Claude hands the hook the answers. At save time a transcript sweep adds any answer the hook missed and every plain chat question you answered directly. On OpenCode and Devin, the save step runs a reader for that runtime's stored session instead, which recovers answered question calls but offers no chat candidates. The session model writes one short decision per answer, with a stated reason or `Not stated.`, what it supersedes and what carries it. The deterministic writer then upserts them, and a Stop-hook line tells you when answers are still waiting for a save.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .skilled/hooks/decision-capture/lib/capture-core.mjs | Created | Normalizes answers, filters process questions and appends to the locked per-session queue. |
| .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs, claude/fixtures/ | Created | Claude PostToolUse adapter, registered, with the probe's redacted payload as its fixture. |
| .skilled/hooks/decision-capture/bin/sweep-opencode.mjs, bin/sweep-devin.mjs, their tests, bin/fixtures/ | Created | Read answered question calls from OpenCode's SQLite store and Devin's transcripts; 6 and 5 node:test cases on redacted real samples. |
| runtime/cli/runtime-mirrors/hook-registry.json, .claude/settings.json | Modified | The decision-capture entry, and the Claude binding the sync rendered from it. |
| .skilled/hooks/README.md, hooks/shared/hook-stdin-deadline.test.mjs, runtime/cli/tests/hook-registration-sync.vitest.ts | Modified | Kill-switch, coverage, tree and key-file rows; the adapter's deadline entry; the pinned binding count, 99 to 100. |
| .skilled/hooks/decision-capture/bin/sweep-transcript.mjs | Created | Recovers answered AskUserQuestion calls from a transcript and lists chat candidates. |
| .skilled/hooks/decision-capture/lib/capture-core.test.mjs, bin/sweep-transcript.test.mjs | Created | 13 and 10 node:test cases. |
| .skilled/skills/.state/decision-capture/README.md | Created | Explains the gitignored queue, consumed log and cleanup. |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Created | Upserts rows and fenced verbatim items by stable Q id, guards the level, records consumed keys. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts | Created | 11 writer cases. |
| .skilled/skills/system-spec-kit/runtime/api/index.ts, runtime/lib/validation/orchestrator.ts | Modified | One re-export block, and `export` on the existing `detectLevel`. |
| runtime/cli/utils/input-normalizer.ts, cli/types/session-types.ts, cli/core/workflow.ts, cli/continuity/generate-context.ts | Modified | Validate and carry `operatorDecisions`, route each entry, write in full-auto mode, document the field. |
| runtime/cli/tests/save-continuity-write.vitest.ts | Modified | Seven save cases; the existing hooks moved to file level so both blocks share them. |
| runtime/hooks/claude/session-stop.ts, runtime/tests/hook-session-stop.vitest.ts | Modified | Stop-hook nudge and its three tests. |
| templates/addons/decision-record.md.tmpl, cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap | Modified | The two operator anchors and the regenerated golden snapshot. |
| .skilled/commands/speckit/save.md, references/memory/save-workflow.md, references/structure/phase-definitions.md | Modified | The save step, the field table and the parent-record rule. |
### Follow-up fixes

The alignment run and the playbook runs found four defects and a set of stale docs after the build, and each was fixed here.

| File | Action | Purpose |
|------|--------|---------|
| runtime/cli/tests/decision-record-writer.vitest.ts, runtime/api/index.ts | Modified | The test reaches the writer and `detectLevel` through the runtime API, so the CLI `check` gate passes; three new cases. |
| .skilled/hooks/decision-capture/lib/capture-core.mjs, capture-core.test.mjs | Modified | A partial save lowers the Stop-hook cursor, so the next new answer is reported. |
| runtime/lib/continuity/decision-record-writer.ts | Modified | A key already in consumed.jsonl is not appended again, and a hand-written item without a source comment is matched by its question and answer. |
| decision-record.md, .skilled/skills/.state/decision-capture/README.md | Modified | Q001 carries its source key; the README states the matching rule. |
| SKILL.md, README.md, references (decision-format, template-guide, folder-structure), save.md, both hooks READMEs | Modified | Docs describe the decision record a save writes, the new anchors, the printed `key` and the current counts. |
| feature-catalog/ux-hooks/operator-decision-capture.md, feature-catalog.md, changelog/v2.12.28.0.md | Created or modified | Catalog entry, release entry and the skill version 2.12.28.0. |
| manual-testing-playbook: the three decision-capture scenarios, 240, 153, 155 and the index | Modified | Setup without `rm -rf`, the cli project flags, the SKIPPED review signal and the retired scenario 153. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The orchestrator moved the packet to Level 3 with `upgrade-level.sh`, refined the plan against the code (ADR-002) and strict-validated it. Five DeepSeek v4.1 flash workers then ran one at a time, each on its own files: the capture core, the writer, the save wiring, the sweep and the Stop nudge. Their briefs and logs are in scratch/runs/. The orchestrator read every diff, reran every check and fixed four defects the workers' tests had missed. Each fix got a test that failed first: the nudge wrote state for idle sessions, the process filter misread two real questions, a quoted heading inside an answer became a phantom id, and a created record lacked the continuity block. The runtime and CLI were rebuilt so the save command and the Stop hook run the new code.

After the main session ran the live probe, the orchestrator registered the Claude hook through the registry and its sync script, and fixed one more defect a test showed first: the hook took its project root from the payload's cwd, which can sit below the project, while the Stop hook counts the queue under CLAUDE_PROJECT_DIR. Two more workers then built the Devin and OpenCode readers against redacted real samples. The Devin data exposed two filter gaps, a work menu with a "Commit ..." item and an unlettered "New packet" offer, and the orchestrator fixed both in the core rather than keeping the worker's per-runtime workaround. Nothing was committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Left `spec-doc-structure.ts` unchanged | Its ADR check already reads only `adr-` anchors, and an operator-only record passed validation. |
| Routed entries in `workflow.ts` with `resolveContinuityLeaf` | The resolver lives in the CLI layer, which the runtime writer cannot import, and reusing it keeps decisions and continuity on the same child. |
| Judged process questions by their offered choices first | The real Q002 asked about process questions and is a product decision, while the real Q004 named its worktree choice only in its options. |
| Registered the Claude hook only after the live probe | REQ-001 made registration wait for proof that the payload carries the answers, and the probe showed `tool_response.answers`. |
| Read OpenCode and Devin from their stored sessions, not from hooks | Their stored sessions hold the answers, while their hook payloads stay unprobed, so a save-time reader works without guessing a live shape. |
| Read OpenCode's newest table layout by the shape of its older parts | The current store held no question call to sample, and its tool items carry the same state object, so this one path is inferred rather than observed. |
| Fixed the ship filter in the core, not in the Devin reader | A worker had stripped options before filtering to keep a real work-menu question; that hid options from the filter on Devin only, while every runtime has the same risk. |
| Ran workers one at a time | The cli-opencode contract allows parallel dispatch only with operator approval, and the operator's rulings did not give it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `node --test` capture-core, sweep-transcript, sweep-devin and sweep-opencode | PASS, 34 of 34 |
| `node --test` hook-stdin-deadline and hook-flags | PASS, 49 of 49; was 48 of 48 before the adapter entry |
| CLI vitest: writer, save, normalizer files | PASS, 64 of 64 before the last writer change, 35 of 35 for writer and save after it |
| Runtime vitest: hook-session-stop and hook-adapter-path-parity | PASS, 148 of 148 |
| CLI vitest: hook-registration-sync, writer and save | PASS, 42 of 42 after the binding count moved to 100 |
| Full CLI vitest project, package vitest 4.1.11 | PASS, 194 files and 2273 tests passed, 20 skipped, exit 0, both before and after the hook registration. The baseline under repo-root vitest 5.0.3 had 2239 passed and 3 failing files, two from the template edit landing mid-run and one from the runner version; all three pass now. |
| `tsc --noEmit` runtime and CLI | PASS, exit 0 and exit 0 |
| Compiled Stop hook, scratch project | One systemMessage for two pending answers, then nothing |
| Sweep of the main session transcript | 57 answers recovered, 1 chat candidate; the commit question dropped, the AC-009 question kept |
| Real-data sweeps into a scratch queue | Devin: five transcripts gave 1, 1, 1, 0 and 0. OpenCode: 206 stored parts gave 202 records from 167 calls; the live opencode.db opened read-only and recovered 0 in 3 ms |
| Comment hygiene on the changed code files | exit 0; a file citing ids exits 1 |
| `sync-hook-registrations.cjs --check` | PASS, 4 files match the 32-hook registry |
| `validate.sh --strict` on this packet | RESULT: PASSED, Errors 0, Warnings 1 (AI_PROTOCOLS, the Level 3 template does not scaffold that section) |
| Follow-up: `npm --prefix runtime/cli run check` | exit 1 before at the import-policy step; exit 0 after, all eight steps passing |
| Follow-up: `node --test` capture-core, sweep-transcript, sweep-opencode and sweep-devin | PASS, 35 of 35; 34 of 34 before the new nudge test |
| Follow-up: CLI vitest writer, save and registration-sync files | PASS, 45 of 45; 42 before the three new writer cases |
| Follow-up: runtime vitest hook-session-stop | PASS, 19 of 19 |
| Follow-up: `tsc --noEmit` runtime and CLI, `sync-hook-registrations.cjs --check` | exit 0, exit 0, PASS for 4 files and 32 hooks |
| Follow-up: full CLI vitest project | 194 files passed and 3 skipped, 2276 tests passed and 20 skipped, exit 0, the three new writer cases being the difference; the baseline before the first edit was 194 files passed and 3 skipped, 2273 tests passed and 20 skipped, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Claude Code may need a hook reload.** The new PostToolUse binding is in .claude/settings.json, and a running session may keep its old snapshot until `/hooks` approves it or a new session starts. The save-time sweep covers the gap.
2. **Chat questions are found only in a closing paragraph.** The sweep offers a plain chat question only when it ends the assistant message, so one asked earlier in a message is missed. In the main session 1 of 17 typed replies qualified. Add such a decision by hand with the next free id.
3. **OpenCode and Devin are read at save time only.** Their readers find answered question calls but no plain chat questions, and OpenCode's newest table layout has no real sample yet. Codex and Pi capture nothing, because no answered call was found to read.
4. **The process filter is a heuristic.** It keeps questions it cannot recognize, such as the T001 probe-consent question and a "Commit gate" timing question whose options never start with Commit, so the save step's own instruction to leave out process questions has to catch those.
<!-- /ANCHOR:limitations -->

---


