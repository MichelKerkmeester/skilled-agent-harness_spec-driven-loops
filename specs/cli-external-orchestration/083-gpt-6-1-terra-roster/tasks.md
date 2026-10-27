---
title: "Tasks: Add GPT-6.1 Terra to cli-codex, cli-opencode and cli-pi through the openai provider"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "gpt 6 1 terra roster tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Add GPT-6.1 Terra to cli-codex, cli-opencode and cli-pi through the openai provider

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the model id in the Codex catalog (`~/.codex/models_cache.json`). Verify: the cache lists slug `gpt-6.1-terra`.
- [x] T002 Refresh Pi's model catalog (`~/.pi/agent/models-store.json`). Verify: `pi --list-models terra --offline` lists `openai gpt-6.1-terra`.
- [x] T003 [P] Capture the runtime test baseline. Verify: the two roster suites report 279 passed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `gpt-6.1-terra` to the cli-codex roster docs (`cli-codex/`). Verify: `rg -c gpt-6.1-terra cli-codex/references/providers-and-models.md` prints 2, one roster row and one ceiling row.
- [x] T005 Add the Terra row to the cli-opencode GPT grid (`cli-opencode/references/`). Verify: `rg -n 'openai/gpt-6.1-terra-fast'` finds the grid row.
- [x] T006 Add `gpt-6.1-terra` to the cli-pi roster, allowlists and provider map (`cli-pi/`, `executor-config.ts`, `fanout-run.cjs`, `.pi/settings.json`). Verify: the roster tests pass.
- [x] T007 Bump versions, write three changelog entries and regenerate the Hermes mirrors. Verify: `validate_document.py` prints `VALID` for each entry.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Smoke-dispatch GPT-6.1 Terra on each CLI. Verify: Codex, OpenCode 1 and Pi each print `OK` with exit 0.
- [x] T009 Run the full deep-loop runtime suite. Verify: `npx vitest run --no-coverage` shows no failure tied to the allowlist. The 7 failures are timing, one intermittent test and a zod pin that another commit raised (see implementation-summary.md).
- [x] T010 Check mirror drift. Verify: `sync-skills-hermes.cjs --check` reports no drift.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



