---
title: "Implementation Summary: Phase 5: trim-duplicated-and-dead-agent-text"
description: "The eleven agent files lost their restated summaries and repeated sections, hold one identical advisor block, and the roster check fails when a copy drifts."
trigger_phrases:
  - "trim duplicated and dead agent text implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/005-trim-duplicated-and-dead-agent-text"
    last_updated_at: "2026-11-14T14:05:03Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 5 with seven acceptance rows Met and AC-007 waived by ADR-001"
    next_safe_action: "Run the phase 006 tasks in order from T001"
    packet_purpose: "Purpose: Each agent file states each rule once, the one block all files share is identical everywhere and checked, and no rule is lost in the cut."
    blockers: []
    key_files:
      - ".skilled/bin/sync-agent-roster.cjs"
      - ".skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md"
      - ".skilled/agents/code.md"
    session_dedup:
      fingerprint: "sha256:a3d4c5e7cdae36c90af3a75bb273ee1d5463f0df61208a30d3e9133efbabb694"
      session_id: "7b3d8afd-85b7-4568-b947-3f44f177431d"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "7b3d8afd-85b7-4568-b947-3f44f177431d"
      workspace: "/Users/michelkerkmeester/worktrees/public/377-agent-contract-and-registry-alignment"
      savedAt: "2026-11-14T14:05:03Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-trim-duplicated-and-dead-agent-text |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The eleven agent files are 2,511 words shorter, and no rule was reworded. They went from 53,367 words to 50,856. Every removed block has a row in `scratch/removal-map.md` naming the line that still carries its rule, with the block quoted in full.

### Nine summaries removed

Nine files closed with a box-drawn summary that restated the sections above it: `ai-council`, `code`, `context`, `debug`, `deep-research`, `deep-review`, `markdown`, `prompt-improver` and `review`. The spec counted eight. `deep-review.md` indents its AUTHORITY line differently, so the spec's search missed it. In `debug.md` the summary sat before the last two sections, so RULES is now section 11 and RELATED RESOURCES section 12.

### `code.md` and `context.md`

`code.md` lost its `Pre-Return Verification` list, the `Before returning:` sentence and eleven of fourteen anti-pattern rows. Each repeated a line of its rules section or its self-validation questions. The three rows no other line states stay. OUTPUT VERIFICATION and ANTI-PATTERNS total 1,266 words, down from 2,063. `context.md` lost the seven-item routing list that repeated its query routing matrix.

### One advisor block, checked

`design.md` wrapped the advisor block at a different width and `markdown.md` held it on one line without its label. Both now carry the three lines the other nine files carry. The agent template holds the canonical copy between `ADVISOR-BLOCK` markers. The `--check` mode of `sync-agent-roster.cjs` reads it from there and reports `shared advisor block differs from the template: <name>` for a file that does not carry it line for line. It exits 2 when the block cannot be read.

### The template's summary rule

Section 7 of `agent-template.md` now says agent files carry no closing summary. The skeleton's `## 9. SUMMARY` block, the checklist line and the SUMMARY mentions in the required-sections paragraph and the two dialect bullets went with it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/agents/*.md`, ten files | Modified | Summaries, repeated blocks and the shared block. `orchestrate.md` did not change |
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Modified | The summary rule and the canonical advisor block |
| `.skilled/bin/sync-agent-roster.cjs` | Modified | Shared-block comparison in `--check` mode |
| `.skilled/bin/sync-agent-roster.vitest.ts` | Modified | One case, thirteen in total |
| `.claude/agents` twins of the ten files | Modified | Hand-kept twins, the same lines |
| `.codex`, `.pi` and `.dsh` copies | Regenerated | Generated copies |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`scratch/trim-plan.py` wrote the removal map and the exact expected content of every agent file and Claude twin before any file changed. DeepSeek V4.1 Flash at max, through `cli-opencode` on the LLM Gateway route, then made the changes in twelve dispatches, one at a time: the template, the script with its test, and one per agent file with its twin. Each brief carried the literal old and new text and is kept under `scratch/dispatch-briefs/`. The orchestrating session accepted a dispatch only when the file on disk equalled its expected file byte for byte. All twelve were accepted on the first run. It read the script diff, ran the tests and the checks itself, regenerated the runtime copies and committed.

Three agents, `context`, `review` and `code`, ran once before the cut and once after on the same small task with the same prompts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The 50,000-word ceiling is waived at 50,856 | Operator answer, 2026-11-14, ADR-001. The files held 53,367 words at the start, about 800 more than the spec measured, because phases 3 and 4 added required sections. Closing the gap meant finding 850 more words, and decision D4 says no rule is cut to reach the ceiling |
| Nine summaries removed, not eight | Operator answer, 2026-11-14. REQ-004 says no agent file ends with a box-drawn summary, and `deep-review.md` had one the spec's search missed |
| The expected files were computed first and each dispatch compared with them | A model retyping a 30-line deletion can drop or keep a neighbouring line. A byte comparison catches that, and a word count does not |
| The shared block is matched as consecutive whole lines | The block is three lines in every file. A match that ignored line breaks would have passed `design.md`, whose different wrapping was one of the two drifts |
| Three anti-pattern rows of `code.md` stay | No other line of the file states their case. The removal map marks them `kept, unique` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Acceptance criteria | 7 of 8 `Met`, AC-007 `Waived` by ADR-001, see `acceptance-criteria.md` |
| `tasks.md` checklist | Every P0 and P1 item checked with its output. The one P2 item is deferred with its reason |
| `wc -w .skilled/agents/*.md` | 50,856 in total, 53,367 before |
| `rg -l '^│' .skilled/agents` | No path. Nine before |
| Each agent file and twin against its expected file, `cmp` | Twenty files identical |
| `node .skilled/bin/sync-agent-roster.cjs --check`, after the script change and before the agent files changed | Two lines naming `design` and `markdown`, `agent-roster: FAIL (2 problem(s))`, exit 1 |
| The same check now | `agent-roster: OK`, exit 0 |
| `vitest run --root .skilled --config vitest.config.bin.ts bin/sync-agent-roster.vitest.ts` | 13 passed of 13 |
| `quality-gate.cjs --files` on the script and its test | No P0, P1 or P2 finding, exit 0 |
| `node .skilled/bin/check-agent-mirror-sync.cjs --all` | `11 agent(s) checked — all comparable mirrors in sync — OK`, exit 0 |
| Deleted lines containing `deny`, `NEVER` or `HARD BLOCK` in this phase's diff | 0 |
| `code` return after the cut against the return template | All ten required and four conditional fields present, see `scratch/code-dispatch-after.md` |
| Three agents before and after | Every limit the before-returns showed is in the after-returns, see `scratch/dispatch-after.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The word ceiling was not reached.** The total is 50,856 against a ceiling of 50,000. ADR-001 records the waiver.
2. **Each agent was probed once.** One run before and one after is one sample each. The `code` return changed from `PASS` to `BLOCKED`: the after-run ran the quality gate on the scratch file, got an error and refused to claim completion. That is the stricter behaviour, and one sample does not show the cut caused it.
3. **Eight agents were not dispatched after the cut.** Their only change is the removed summary, or for `design` the re-wrapped block.
4. **The phase documents say `code.md` section 8 for the return contract.** It is section 9 since phase 4. The observed notes say so, and the planned text was left as written.
5. **`common-pitfalls.md` does not name restated summaries as a pitfall.** CHK-042 is a P2 that edits a skill reference file, which parent decision D6 keeps out of this packet.
6. **The fixture agents in the test carry the two block markers as well as the block.** The check ignores markers in an agent file, so the tests hold, and a reader may take the markers for part of the contract.
7. **The CI step was not run on GitHub.** The branch is local, so the check has only run on this machine.
<!-- /ANCHOR:limitations -->

---
