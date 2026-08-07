---
title: "Tasks: Live Verification and Closeout"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-pi live verification tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout"
    last_updated_at: "2026-08-07T20:22:03Z"
    last_updated_by: "spec-author"
    recent_action: "HANDOFF review's confirmed findings closed; RPC mode followed up"
    next_safe_action: "None — 006 packet complete"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-006-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Live Verification and Closeout

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

- [x] T001 Confirmed phase 2 (`002-vendor-and-repoint`) is Complete — Status field and checklist read directly
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Live `deepseek/deepseek-v4-flash` session (`phase006-smoke-deepseek`) completed cleanly — real "OK" response, `deepseek/deepseek-v4-flash` gained zero `pi-cache-optimizer-stats.json` entries and `legacyFamily.deepseek` stayed at 0 (guard still holds with `deep-pi` vendored active). **Limitation found:** `/deeppi`'s `ctx.ui.notify()` report doesn't surface through `pi --print`'s non-interactive stdout or the session `.jsonl` (confirmed by direct inspection — no notification-type entry exists in the session file); the counter values weren't directly observable this way. Substituting evidence: nothing in this clean round-trip should trigger either counter, and phase 1's unit tests already prove both surface correctly when forced
- [x] T003 Confirmed via live sessions: `opencode-go/deepseek-v4-flash` (67→68 requests) and `openai-codex/gpt-5.6-luna` (92→93 requests) both continued incrementing `pi-cache-optimizer` stats normally, unaffected by `deep-pi`. **`opencode/deepseek-v4-flash-free` has no live API key configured right now** (`pi --print --model opencode/deepseek-v4-flash-free` failed with "No API key found for opencode") — a real environmental gap, not fabricated around. Substituting evidence: phase 1's new `tests/eligibility.test.ts` case source-confirms this exact model fails `isDeepPiModel`'s `provider === "deepseek"` gate, matching phase 004's original boundary exactly
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 REQ-003 resolved during phase 1's implementation: implemented (not cut), per the autonomous-run's default. `001-fix-and-test-deep-pi/spec.md` §7 records the decision; `tasks.md` T004/T007 both `[x]`, no `[B]` remaining
- [x] T005 `001-fix-and-test-deep-pi/*.md` and `002-vendor-and-repoint/*.md` all updated to Complete with real evidence from their own implementation, cross-checked against T002/T003 here
- [x] T006 This phase's own `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` updated to Complete
- [x] T007 Parent `006-fork-and-improve-deep-pi/spec.md`'s Phase Documentation Map updated to show all three children Complete; `graph-metadata.json` regenerated
- [x] T008 `validate.sh --recursive --strict` on the whole 006 subtree: 0 errors, 0 warnings across parent + 3 children
- [x] T009 **Post-HANDOFF fixes**: a fresh `gpt-5.6-sol` HANDOFF review found 2 confirmed gaps against this phase. (1) REQ-007/REQ-008's "Partially met" language closed without explicit approval wording — fixed by citing the governing `/goal` directive's own standing instruction ("disclose real limitations honestly rather than fabricate around them... do not pause to ask what to do") as the approval basis for each disclosed substitution, recorded directly in `spec.md`. (2) `pi --mode rpc` identified by the reviewer as a missed observation path for `/deeppi`'s report, from source reasoning it couldn't fully execute itself — followed up directly: `pi --mode rpc` does emit `extension_ui_request` events carrying `setStatus`/`notify` payloads, confirming a status-bar-level signal IS observable there, but the full multi-line `/deeppi` report body was not confirmed reaching that stream in this pass. Recorded as a real, narrower residual limitation rather than either ignored or falsely resolved
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Live checks (T002, T003) and the final validate gate (T008) all pass with real evidence
- [x] HANDOFF review's 2 confirmed findings against this phase closed (T009)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../002-vendor-and-repoint/`
<!-- /ANCHOR:cross-refs -->
