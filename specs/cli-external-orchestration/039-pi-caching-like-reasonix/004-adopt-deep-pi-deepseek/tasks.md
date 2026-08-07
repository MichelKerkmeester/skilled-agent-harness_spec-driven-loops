---
title: "Tasks: Adopt deep-pi as Exclusive DeepSeek Extension"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-pi install tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/004-adopt-deep-pi-deepseek"
    last_updated_at: "2026-08-07T11:19:49Z"
    last_updated_by: "spec-author"
    recent_action: "All tasks complete with live evidence"
    next_safe_action: "Proceed to phase 005"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Adopt deep-pi as Exclusive DeepSeek Extension

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

Install.

- [x] T001 Confirmed `003-fork-and-guard-cache-optimizer` is Complete
- [x] T002 Ran `pi install npm:@arter/deep-pi@1.0.0` — succeeded
- [x] T002a `npm view @arter/deep-pi@1.0.0 gitHead` returned `0f1cbd8124b4fb35df97f85aa943d730f4aae549`; that commit exists in `github.com/christopherarter/deep-pi`'s real history (the repo has since moved on to `v1.0.4`, so no `v1.0.0` tag remains, but the commit itself is verified reachable); `diff` of the installed `extensions/deeppi.ts` against `git show <sha>:extensions/deeppi.ts` returned zero differences — byte-identical
- [x] T003 `pi list` confirms `npm:@arter/deep-pi@1.0.0` installed; command registration confirmed via source read of `extensions/deeppi.ts`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Activation Confirmation.

- [x] T004 Live session on `deepseek/deepseek-v4-flash` completed cleanly; `isDeepPiModel` (source-confirmed) matches this model exactly (`provider==="deepseek"`, `id` in the owned set). Persistent-stats-based confirmation isn't possible (deep-pi keeps no state file by design) — deferred to phase 005's payload-diff verification
- [x] T005 `isDeepPiModel` source-confirmed to reject `openai-codex/gpt-5.6-luna` and `opencode/deepseek-v4-flash-free` (provider mismatch on both) — matches phase 003's independently-verified `isDeepPiOwned` boundary exactly
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Trade-off Documentation.

- [x] T006 All-or-nothing module trade-off recorded in `spec.md`/`implementation-summary.md`
- [x] T007 [P] `jrimmer/pi-deepseek-optimized` fallback path documented in `spec.md` §6
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both activation checks (T004, T005) pass via source-confirmed eligibility matching phase 003's boundary exactly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../003-fork-and-guard-cache-optimizer/`
- **Successor**: `../005-verification-and-decision-reconciliation/`
<!-- /ANCHOR:cross-refs -->
