---
title: "Tasks: Fork pi-cache-optimizer with a DeepSeek Exclusion Guard"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi-cache-optimizer fork tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer"
    last_updated_at: "2026-08-07T13:20:00Z"
    last_updated_by: "spec-author"
    recent_action: "All 16 tasks complete with live evidence"
    next_safe_action: "None — phase 003 complete"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Fork pi-cache-optimizer with a DeepSeek Exclusion Guard

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

Audit, Fork & Diff.

- [x] T001 Re-confirm the 7-hook registration inventory and resolve the `after_provider_response` 400-retry open question from `spec.md` §7
- [x] T002 Fork `jiangge/pi-cache-optimizer` (v2.8.0) to `MichelKerkmeester/pi-cache-optimizer`, pinned to commit `5132d137ce28cb91ec12a5475832df4d5154085a`
- [x] T003 Add the shared `isDeepPiOwned(model)` predicate (`provider === "deepseek"` AND `id` is `deepseek-v4-flash`/`deepseek-v4-pro`) near the existing `isDeepSeekLikeModel`
- [x] T004 Guard added to all 6 hooks; `model_select` correctly uses `event.model` (verified against `ModelSelectEvent`'s real type, which has a `model` field directly — unlike the other 5 hooks' event types), the rest correctly use route-resolved `ctx.model`
- [x] T005 Context-provided delivery evidence records `tsc --noEmit` plus 25 tests passing and the boundary test for direct DeepSeek versus opencode-routed DeepSeek
- [x] T006 GitHub commit diff is limited to `index.ts` and `tests/review-findings.test.ts`; it contains the predicate/export, six guards, and the boundary test
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Host & Repoint.

- [x] T007 Push the fork to its remote at the pinned commit; GitHub connector fetch confirmed commit `5132d137ce28cb91ec12a5475832df4d5154085a`
- [x] T008 Update `.pi/settings.json`'s `packages` array entry to `git:github.com/MichelKerkmeester/pi-cache-optimizer@5132d137ce28cb91ec12a5475832df4d5154085a`
- [x] T009 Confirm with `pi list --approve` that the pinned Git source is listed and npm is absent
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Non-Regression Smoke Test.

- [x] T010 Non-DeepSeek session run live: `pi-cache-optimizer-stats.json` `totalsByModel["openai-codex/gpt-5.6-luna"].totalRequests` 31→32→33 across the checks, confirming continued normal operation (not a comparison to the historical cumulative 89%)
- [x] T011 `opencode/deepseek-v4-flash-free` session run live: new `totalsByModel` entry created (0→1), confirming `pi-cache-optimizer` still active for it; `deepseek/deepseek-v4-flash` session run live with a genuine configured API key: zero stats entry created, confirming the guard correctly silences the extension for the model `deep-pi` owns
- [x] T012 No active Pi sessions found (`pgrep -fl` empty); reverted `.pi/settings.json` to `npm:pi-cache-optimizer`, confirmed normal operation live, then re-applied the pinned fork source as final state
- [x] T013 `spec.md`/`plan.md` status updated to Complete with the live evidence above
- [x] T014 [2026-08-07, operator request] Vendored the pinned fork commit's source into `.pi/extensions/pi-cache-optimizer/` in this repo; `diff` against the fork commit confirms `index.ts` is byte-identical
- [x] T015 Ran `npm install && npm test && npm run typecheck` inside the vendored copy: 25/25 tests pass, typecheck clean; updated `.pi/settings.json`'s `packages` entry to the local source `extensions/pi-cache-optimizer`; `pi list` confirms it resolves to `<repo>/.pi/extensions/pi-cache-optimizer`
- [x] T016 Re-ran the T010/T011 live smoke tests against the vendored copy: non-DeepSeek session stats incremented normally; `deepseek/deepseek-v4-flash` session produced zero new stats entries. Temporary test sessions removed after verification
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Typecheck/unit tests (T005), diff-based scope verification (T006), live regression checks (T010, T011), and rollback (T012) all pass with real evidence
- [x] In-repo vendoring (T014-T016) re-confirms the same evidence against the current delivery mechanism
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Successor**: `../004-adopt-deep-pi-deepseek/` depends on T006/T007 completing first
<!-- /ANCHOR:cross-refs -->
