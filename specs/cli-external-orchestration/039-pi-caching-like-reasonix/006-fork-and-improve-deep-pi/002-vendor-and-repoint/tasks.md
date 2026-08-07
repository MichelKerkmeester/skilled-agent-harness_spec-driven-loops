---
title: "Tasks: Vendor and Repoint deep-pi"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-pi vendor tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/002-vendor-and-repoint"
    last_updated_at: "2026-08-07T20:22:03Z"
    last_updated_by: "spec-author"
    recent_action: "Re-vendored after HANDOFF fixes; diff -rq still exits 0"
    next_safe_action: "None — 006 packet complete"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-006-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Vendor and Repoint deep-pi

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

- [x] T001 Confirmed phase 1 (`001-fix-and-test-deep-pi`) is Complete — Status field checked directly, all checklist items verified
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Copied the patched fork's runtime files into `.pi/extensions/deep-pi/` (`extensions/`, `package.json`, `tsconfig.json`, `LICENSE`, `README.md`, `tests/`)
- [x] T003 Updated `.pi/settings.json`'s `packages` entry from `npm:@arter/deep-pi@1.0.0` to `extensions/deep-pi` (local vendored path)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 `diff -rq .pi/extensions/deep-pi/extensions <clone>/extensions` and `diff -rq .../tests <clone>/tests` both exit 0 (identical trees); direct `diff` on `deeppi.ts`/`telemetry.ts` individually also exit 0; confirmed no `node_modules`/`.git` vendored
- [x] T005 `pi list` output: `extensions/deep-pi` → `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/deep-pi`, listed once under Project packages, no `npm:@arter/deep-pi` entry remaining
- [x] T006 **Post-HANDOFF re-vendoring**: after phase 1 fixed the HANDOFF review's 4 confirmed findings, re-copied the corrected `extensions/deeppi.ts`, `extensions/deeppi/telemetry.ts`, and all of `tests/` into `.pi/extensions/deep-pi/`; re-ran T004's `diff -rq` — both trees still exit 0 against the corrected fork, confirming the vendored copy tracked the fix rather than silently going stale
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Diff-based scope verification (T004, re-confirmed by T006 after the HANDOFF fixes) and resolution check (T005) both pass with real evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../001-fix-and-test-deep-pi/`
- **Successor**: `../003-live-verification-and-closeout/`
<!-- /ANCHOR:cross-refs -->
