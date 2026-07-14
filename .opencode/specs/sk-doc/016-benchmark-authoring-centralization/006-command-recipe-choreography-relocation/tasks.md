---
title: "Tasks: command-recipe choreography relocation + validator repair"
description: "Task Format: T### [P?] Description (surface)"
trigger_phrases:
  - "choreography relocation tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-benchmark-authoring-centralization/006-command-recipe-choreography-relocation"
    last_updated_at: "2026-07-14T21:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown"
    next_safe_action: "Run Phase 1"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Tasks: command-recipe choreography relocation + validator repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

*Wave 1 — solo SOL max. Lane C dead-branch cleanup, done and verified first.*

- [x] T001 Remove the dead wrapper-prose choreography branch from `score-skill-benchmark.cjs` (deep-improvement) — `score-skill-benchmark.cjs` net −39 lines; `sameJsonValue(recipe.choreography, record.choreography)` equality retained
- [x] T002 Drop the now-unused `wrapperMarkdown` argument + dead helpers; keep recipe↔metadata equality (deep-improvement) — removed `extractSection`/`normalizedIncludes`/`wrapperMarkdown`; kept `wrapperPathForCommand` (heading/argument-hint still consume it)
- [x] T003 Verify the full skill-benchmark suite stays green after cleanup (deep-improvement) — vitest `56/0` after cleanup (orchestrator re-run)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*Wave 2 — SOL max swarm on disjoint surfaces.*

- [x] T004 [P] Agent A: repair `design-command-surface-check.mjs` null-command synthesis to `invalid=0` (sk-design) — `readNoCommandTokens`/`commandTokenForMode` model transport as token `design-mcp-open-design`; validator `invalid=0` (was 10)
- [x] T005 [P] Agent A: strengthen the asset-level choreography check (auto/confirm parity, witnesses; no positional heuristic) + negative tests (sk-design) — structural `step_N_<name>` contract in `design-command-surface-check.mjs`; `node --test` `7/0`
- [x] T006 [P] Agent B: refresh the stale `sk_design_command_recipe_valid.private.json` to current metadata (deep-improvement) — `argumentHint`/`argumentGrammar`/`choreography` (4→5 rows) now deep-equal live `/design:interface`
- [x] T007 [P] Agent B: de-mask the vitest recipe test to load committed gold; add negative tests (deep-improvement) — `designRecipe()` loads fixture gold; drift-tripwire test; vitest `57/0`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Central re-verify (suite, `node design-command-surface-check.mjs`, node --check) + fresh Sonnet review — validator `VALID invalid=0`, vitest `57/0`, `node --test` `7/0`; Sonnet review no P0/P1
- [x] T009 Run validate.sh --strict; refresh graph metadata; commit + integrate — `validate.sh --strict` Errors 0; committed + integrated to `skilled/v4.0.0.0`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Gates green (suite `57/0`, validator `invalid=0`, `validate.sh --strict` Errors 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
