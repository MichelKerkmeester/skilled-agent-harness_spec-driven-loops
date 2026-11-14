---
title: "Implementation Summary"
description: "Phase 6 shipped: each of five shared agent rules has one source in the agent template or the run config, and the eleven agents, the deep-loop assets and the compiled contracts agree with it."
trigger_phrases:
  - "shared agent contract implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/006-shared-agent-contract"
    last_updated_at: "2026-11-14T21:52:45Z"
    last_updated_by: "generate-context"
    recent_action: "Built phase 006, both review gates run, second APPROVED"
    next_safe_action: "Run /speckit:implement on phase 007 after the operator approves"
    packet_purpose: "Purpose: Each shared rule has one source with a named owner, every agent file agrees with it, and a command can show the agreement."
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md"
      - ".skilled/agents/deep-review.md"
      - ".skilled/agents/deep-research.md"
      - ".skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json"
      - ".skilled/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:109eb877b1fccf2d744e8716e68d0e9c68a4efc5e5ec4f9ee489687115f4e7a1"
      session_id: "scaffold-006-shared-agent-contract"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "c07b6145-476a-4dd9-8584-9a2c9a8a5d5d"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-14T21:52:45Z"
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
| **Spec Folder** | 006-shared-agent-contract |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every agent now reads one tool budget, from its own `Tool Calls` row or, for a deep leaf, from the `Max N` line its iteration prompt renders from `maxToolCallsPerIteration`. The deep-review budget is 24. The template states the budget, self-attested-output, refusal and untrusted-content rules once, and all ten LEAF agents carry the refusal line and the untrusted-content rule.

### Phase 6: shared-agent-contract

The fix commits are `6c1fca5106` (the build), `0c85405de6` (two review fixes) and `24594b2b28` (the trigger index). Each owned finding closes as follows:

| Finding | Closed by | Evidence at `24594b2b28` |
|---------|-----------|--------------------------|
| across-1, code-5, review-1 | Template budget rule, fast-path caps removed | REQ-001 prints 1; REQ-002 exits 1 over all five runtime trees |
| deep-research-1 | Budget from the iteration prompt; `tool_call_budget` dropped | REQ-003 search exits 1; suite asserts `Max 24` for research |
| deep-review-1 | Config 24, rendered in the review prompt, profiles removed | REQ-004 search exits 1; `prompt-pack.vitest.ts:168` asserts `Max 24` for review |
| orchestrate-3 | Split row and footer read the target's `Tool Calls` budget | REQ-005: exit 1, then 2 |
| across-2 | Self-attested-output rule; 28 deep boxes unticked | REQ-006 prints 1; REQ-007 exits 1 |
| debug-3 | Three returned lines with Command and Exit Code fields | REQ-008: 3, then exit 1 |
| across-3 | Refusal line in every LEAF agent; template states it once plus the skeleton | REQ-009: 10 files, template 2 |
| across-4, review-5 | Untrusted-content rule in template and every LEAF agent | REQ-010: 10 files, template 4 |
| across-5 | "Daemon-free" sentence and "Layer 1" wording removed | REQ-011: exit 1, then 1; REQ-012 exits 1 |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Modify | The four shared rules, one refusal block, three checklist rows |
| `.skilled/agents/` (11 files) and `.claude/agents/` forks | Modify | Budget pointers, refusal line, untrusted rule, unticked checklists, debug verification lines |
| `.pi/agents/`, `.codex/agents/`, `.dsh/agents/` | Regenerate | The three sync generators |
| `.skilled/commands/deep/assets/deep-research-{auto,confirm}.yaml` | Modify | Drop the unread `tool_call_budget` |
| `.skilled/commands/deep/assets/deep-review-{auto,confirm}.yaml` | Modify | Drop `tool_call_budget`, pass `max_tool_calls_per_iteration` |
| `deep-review/assets/deep-review-config.json`, `prompt-pack-iteration.md.tmpl` | Modify | Budget 24, rendered from config |
| Both deep-loop `SKILL.md` and `loop-protocol.md` | Modify | Name the config key, no number; versions 1.15.13.0 and 1.11.15.0 |
| `deep-research/changelog/v1.15.13.0.md`, `deep-review/changelog/v1.11.15.0.md` | Create | Release entries |
| `runtime/tests/unit/prompt-pack.vitest.ts`, `runtime/tests/fanout-review-focus.vitest.ts` | Modify | Pass the budget; assert it for review |
| `.skilled/commands/deep/assets/compiled/` (3 contracts) | Regenerate | Source digests |
| Trigger-index outputs under `system-spec-kit/runtime/` | Regenerate | New release entries |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`/speckit:implement :auto`, executed directly by the main agent, because the workflow takes the direct fallback under `:auto` and agent markdown is main-agent work. Setup captured `scratch/before.txt` and explained each difference from `scratch/baseline.txt` as ordering or a later command form. The template went first, then the agents, the deep-loop assets and tests, the forks, the generated copies, the changelogs and the contracts. `scratch/after.txt` holds all fifteen requirement searches. The first `@review` gate returned REQUESTED_CHANGES on a stale trigger index. After the rebuild and two P2 fixes, the second returned APPROVED with no P0 or P1.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Deep-review budget 24, the plan default | Its floor is 16, and 24 matches deep-research. The operator gave no other value |
| No runtime abort near 12 assumed | Nothing cites a source for one, so each agent's stated budget governs |
| Untrusted rule not added to `orchestrate.md` | It runs as the operator-facing session, where the repository rule already binds |
| Release entries for both deep-loop modes | A `SKILL.md` body change ships an entry, as phase 5 did |
| Repointed `deep-research.md:459` too [DEVIATION] | It restated "target 8-11, max 12" inside REQ-003's own search, which the plan's line list missed |
| Read-only template variant names the REFUSE line without quoting it | Quoting it would make the template count 3 and break REQ-009, which requires 2 |
| Orchestrator split row keeps "8 calls when it states none" | That is the plan's wording. Both reviews flagged the 8 against the footer's 12 as a P2, and phase 8 owns that file's routing text |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fifteen REQ searches (`scratch/after.txt`) | Each printed what its row requires |
| Deep-loop vitest, four suites | `Test Files 4 passed (4)`, `Tests 43 passed (43)`, as at base |
| Missing review variable | Rendering without `max_tool_calls_per_iteration` threw an error naming it |
| `check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=3`, exit 0 |
| `sync-agent-roster.cjs --check`, `check-agent-mirror-sync.cjs` | `agent-roster: OK`; all comparable mirrors in sync, both exit 0 |
| `check_changelog_shape.py` on both entries | `pass=2 fail=0` |
| `check-frontmatter-versions.sh` | exit 0 |
| `generate-trigger-index.mjs --check` | exit 0, 0 stale, at `24594b2b28` |
| `@review` post-execution gate | First REQUESTED_CHANGES (stale index), second APPROVED, advisory 97 |
| Acceptance criteria | 15 of 15 Met; tasks.md P0 and P1 items checked |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **CLI fan-out executors read the unrendered review template.** `fanout-run.cjs:1616` hands them the path, so they see the literal `{max_tool_calls_per_iteration}` placeholder rather than 24. Research already worked this way. Rendering it for CLI executors is a separate change.
2. **The orchestrator states two default numbers.** The split row says 8 calls for an agent with no budget and the footer says 12. Phase 8 can settle both on 12 when it edits `orchestrate.md`.
3. **CHK-FIX-004 says "the one test".** The plan changes two vitest files, and both changes are planned.
<!-- /ANCHOR:limitations -->

---
