---
title: "Tasks: restore max as GLM-5.3-Flash's fan-out thinking tier"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "glm thinking tier"
  - "remove xhigh override"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/061-glm-5-3-flash-thinking-tier-per-route"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All tasks complete; 204/204 green"
    next_safe_action: "Commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fix-061-glm-thinking-tier"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: restore max as GLM-5.3-Flash's fan-out thinking tier

<!-- SPECKIT_LEVEL: 1 -->
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the exact symptom [evidence: `npx vitest run` — `fanout-run.vitest.ts:1541` AssertionError, `openrouter/z-ai/glm-5.3-flash --thinking` expected `max`, received `xhigh`]
- [x] T002 Capture the pre-edit baseline [evidence: both suites = `Test Files 1 failed | 1 passed (2)`, `Tests 1 failed | 203 passed (204)`]
- [x] T003 Establish the ground truth from live provider data [evidence: `opencode models --verbose` — openrouter `z-ai/glm-5.3-flash` and opencode-go `glm-5.3-flash` both `low`/`high`/`max`, no `xhigh`; llmgateway carries both]
- [x] T004 Locate the producer and blame it [evidence: `pinReasoningEffortForModel` short-circuits on `isGlmFlashXhighPinnedModel`; `git log -S` gives `d47d73f8bb`, 2026-08-29]
- [x] T005 Inventory every consumer of the symbol before deleting [evidence: 2 definitions, 2 call sites, 1 import + 2 assertions in `executor-config.vitest.ts`; nothing outside the runtime]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Remove the predicate and its call; rewrite the doc comment to state the per-route rule (`executor-config.ts`)
- [x] T007 Remove the mirror and its call; keep the comment in sync (`fanout-run.cjs`) [evidence: `node --check` clean]
- [x] T008 Correct the four GLM assertions to `max`, drop the dead import, add a `glm-5.1` pass-through case (`executor-config.vitest.ts`)
- [x] T009 Leave `fanout-run.vitest.ts` untouched as the negative control [evidence: `git diff --stat` on it is empty]
- [x] T010 [P] Correct the two catalog rows and state the per-route rule (`cli-opencode/references/providers-and-models.md`)
- [x] T011 [P] Correct the two catalog rows likewise (`cli-pi/references/providers-and-models.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rerun the same check that failed, then the whole gate [evidence: `Test Files 2 passed (2)`, `Tests 204 passed (204)` — delta from baseline is +1 pass, −1 fail]
- [x] T013 Confirm the negative control [evidence: `fanout-run.vitest.ts` green with an empty diff — it was never edited]
- [x] T014 Typecheck and syntax [evidence: `npm run typecheck` reports errors only in `deep-review-state-contract.ts` and `append-mode-event.ts`, neither touched here; zero errors in `executor-config.ts`; `node --check fanout-run.cjs` clean]
- [x] T015 Stale-claim sweep [evidence: no catalog outside changelogs still says GLM has no `max` variant on any route]
- [x] T016 Scoped-diff check [evidence: `git diff --name-only` = exactly the 5 intended files for this packet, index empty. The two `.pi/` config files also dirty in the tree are the operator's own deliberate change, made by their live pi session and unrelated to this fix — reverted in error mid-session, then restored byte-for-byte (blob hashes match the pre-revert diff)]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]` [evidence: T001–T016]
- [x] No `[B]` blocked tasks [evidence: `grep '\[B\]' tasks.md` returns nothing]
- [x] Gate green against a real baseline, not an assumed one [evidence: 203/1 → 204/0]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
