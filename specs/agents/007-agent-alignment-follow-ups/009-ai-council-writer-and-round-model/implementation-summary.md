---
title: "Implementation Summary"
description: "The ai-council agent names itself the one writer of its artifacts, runs one round per invocation, defaults to Depth 1, uses one threshold table and fits in 595 lines, with sections 12 to 17 moved into the deep-ai-council references."
trigger_phrases:
  - "ai council writer and round model implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/009-ai-council-writer-and-round-model"
    last_updated_at: "2026-11-14T23:47:18Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified phase 009"
    next_safe_action: "Start phase 010 deep-loop-leaf-state-and-status"
    packet_purpose: "Purpose: Every owned finding ends as a shipped fix or a recorded decision, and the agent can finish a council run without breaking a rule it states."
    blockers: []
    key_files:
      - ".skilled/agents/ai-council.md"
      - ".skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md"
      - ".skilled/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md"
    session_dedup:
      fingerprint: "sha256:a10b9f9d530c9173ba8719ac627c9863ba9e50d90b231a7755c0d273cca27a77"
      session_id: "scaffold-009-ai-council-writer-and-round-model"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-14T23:47:18Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-ai-council-writer-and-round-model |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A direct `@ai-council` dispatch now has one writer, the agent, and the agent can answer YES to every self-check question with its own tools. It runs one round per invocation, defaults to Depth 1 and fits in 595 lines, with its persistence, state, convergence and rollback sections moved into the `deep-ai-council` references.

### Phase 9: ai-council-writer-and-round-model

| Finding | Outcome | Evidence (`scratch/after.txt`) |
|---------|---------|-------------------------------|
| ai-council-1 | Fixed. Q11 asks for Write and Edit artifacts and an ordered event list. No line says the gateway refreshes `ai-council-state.jsonl` | `exit 0 receipt` 0, `refresh` 0, references search prints nothing |
| ai-council-2 | Fixed to answer A. The agent states single writer authority, the registry notes drop the helper step, and `command-wiring.md` names the helper as writer only for runs that never dispatch the agent | `persist-artifacts` in the registry 0, no `write`/`edit: deny` |
| ai-council-3 | Fixed. One round per invocation, caller-owned loop and resume from the artifacts on disk in `state-format.md` section 6, `max_rounds` defaults to 3 | `repeat from step 3` 0, three `defaults to 3` lines |
| ai-council-4 | Fixed. Depth 1 is the default in the agent and in `depth-dispatch.md` | both searches print 0 |
| ai-council-5 | Fixed. CLI rows are simulated lenses, no Temp column or temperature line, the duplicate vantage is gone | searches print 0, `AI Vantage Target` 3 |
| ai-council-6 | Fixed. One Lead Thresholds table with contiguous bands in the agent and `scoring-rubric.md` | old phrasings 0, `Lead of 15 to 24` 1 each |
| ai-council-7, across-6 | Fixed. 816 to 595 lines, no stale `§12`-`§19` citation, registry reason states thirteen files and sections 0 to 11 | `wc -l` 595, citation search prints nothing |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/agents/ai-council.md`, `.claude/agents/ai-council.md` | Modify | All the fixes above; the fork regenerated from the canonical body |
| `.pi`, `.codex`, `.dsh` ai-council and orchestrate copies | Regenerate | The three sync scripts |
| `.skilled/agents/agent-registry.json` | Modify | `ai-council` notes and the `templateExceptions` reason |
| `.skilled/agents/orchestrate.md`, `.claude/agents/orchestrate.md` | Regenerate, Modify | The agent-files row |
| `deep-ai-council/references/` (folder-layout, state-format, output-schema, convergence-signals, failure-handling, depth-dispatch, command-wiring, seat-diversity-patterns, scoring-rubric) | Modify | Received sections 12 to 17, the depth default, the Temp column drop, the threshold table and the repointed citations |
| `deep-ai-council/manual-testing-playbook/` (resume-after-interrupted-state, out-of-scope-write-rejection) | Modify | Resume from artifacts on disk; repointed citations |
| `deep-ai-council/SKILL.md`, `changelog/v1.8.11.0.md` | Modify, Create | Mode version 1.8.11.0 |
| `multi-ai-council-runtime-parity.vitest.ts`, `multi-ai-council-mirror-parity.vitest.ts` | Modify | Dropped the moved heading string; the last three headers are now sections 11 to 13 |
| `deep-ai-council.contract.markdown`, trigger-index outputs | Regenerate | Hashes of the edited files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at `--thinking max` through cli-pi made eleven single-task edits: the depth default, Temp column and threshold table in three references, the resume scenario, and seven edits to the agent file run one at a time with a snapshot after each. The conductor made the section move into the references, the registry, test and generated-file changes, and read every diff. Line counts in order: 816, 648 after removing sections 12 to 17, 658 with the pointer, 664 after the threshold table, 651 after the preamble shrink and pointer compaction, 619 after the task-type table, 595 after section 10 shrank.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The section move ran before the in-place agent edits, against the plan's order | The moved text was rewritten while it moved, so editing it in place first was wasted work |
| `multi-ai-council-mirror-parity.vitest.ts` changed although the plan listed it unchanged | It asserts the last three headers are sections 17 to 19, which the move renumbers |
| `command-wiring.md` was rewritten for answer A, beyond receiving section 16 | Its overview still called the agent planning-only and had every caller run the helper, which contradicts the one writer |
| `folder-layout.md:87` keeps the placement ADR as a named record | It names an archived ADR that put the protocol in the agent body. The protocol details now live in `command-wiring.md` and the agent keeps the rule and a pointer |
| The extra cuts were the strategy-count table and the pointer as one paragraph, not the report template | They reached 595 lines without moving the section 8 template the parser relies on |
| No install for the council suites | Vitest resolves from `.skilled/node_modules`. The `cli/tests` suites run under the root config, because the runtime config does not collect them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Every section 4 acceptance command | Each prints its stated value, `scratch/after.txt` |
| Council suites | `test:council` 6 files/10 tests and 2/16, cli council suites 4/17, all passing, same as `scratch/baseline-tests.txt` |
| Roster, mirror, compiled contract | `agent-roster: OK`, mirror check exit 0, contract diff exit 0 |
| Em dashes | No edited file gained one (`scratch/emdash-before.txt`) |
| Trigger index | `generate-trigger-index.mjs --check` exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`/deep:ai-council` route claim.** Its workflow names `target_agent ai-council` while its seats run as `opencode run --agent plan`. That is the command's contract and stays out of scope, reported to the operator.
2. **`folder-layout.md` cites `deep-ai-council.md` for Step 0.** The agent file is `ai-council.md`. It is a section 1 citation outside this phase's moved range and is left as found.
<!-- /ANCHOR:limitations -->


---


