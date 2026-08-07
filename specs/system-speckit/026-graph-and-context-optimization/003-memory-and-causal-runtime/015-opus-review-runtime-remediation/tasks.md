---
title: "Tasks: Opus Review Runtime Remediation (013 cross-review)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "opus review remediation tasks"
  - "013 cross-review fix tasks"
  - "restore crash window tasks"
  - "reconcileMoves spec_folder task"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/015-opus-review-runtime-remediation"
    last_updated_at: "2026-06-02T16:07:14Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 015 remediation packet from validated 013/002 sibling"
    next_safe_action: "Fix P1-1 checkpoint-restore data-loss crash window first"
    blockers: []
    key_files:
      - "lib/storage/checkpoints.ts"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - "lib/storage/incremental-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-review-remediation-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Opus Review Runtime Remediation (013 cross-review)

<!-- SPECKIT_LEVEL: 3 -->
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

**Phase 1 - P1 correctness fixes** (each verified against deployed source, each behavior fix proven by a focused vitest).

- [ ] T001 Verify P1-1 against deployed source: confirm the restore swap renames live to `.bak` before the snapshot is in place (lib/storage/checkpoints.ts)
- [ ] T002 [P] Reorder the restore swap so the snapshot is in place before the live file is retired, preserving the two-phase journal semantics (lib/storage/checkpoints.ts)
- [ ] T003 [P] Harden boot recovery to reconstruct one consistent live DB from any partial on-disk swap state (lib/storage/checkpoints.ts)
- [ ] T004 Add/extend the crash-window vitest: crash mid-swap → boot recovery yields a live DB; run it (checkpoints-restore-crash-window.vitest.ts)
- [ ] T005 Verify P1-2 against deployed source: confirm UTF-8 is decoded per socket read (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T006 [P] Buffer raw bytes across reads; decode UTF-8 only on complete-frame boundaries; bound the accumulator (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T007 Add/extend the split-sequence vitest: multi-byte sequence split across two reads decodes byte-identical; run it (front-proxy-utf8-frame.vitest.ts)
- [ ] T008 Verify P1-3 against deployed source: confirm `reconcileMoves` drops `spec_folder` on the moved-row rewrite (lib/storage/incremental-index.ts)
- [ ] T009 [P] Carry `spec_folder` through the moved-row rewrite, preserving the source value verbatim (NULL included) (lib/storage/incremental-index.ts)
- [ ] T010 Add/extend the reconcile vitest: moved row keeps `spec_folder` (set + NULL cases); run it (reconcile-moves-spec-folder.vitest.ts)
- [ ] T011 Gate: `npm run typecheck` 0 new errors AND `npm run test:core` green before Phase 2
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Phase 2 - P1-4 version/tool-count documentation sweep** (reconcile stale claims to deployed values at every cited location).

- [ ] T012 Enumerate every cited doc location claiming a `SCHEMA_VERSION` or tool count
- [ ] T013 Confirm the deployed `SCHEMA_VERSION` and the deployed tool count against the live runtime
- [ ] T014 Update each cited `SCHEMA_VERSION` claim to the deployed value
- [ ] T015 Update each cited tool-count claim to the deployed count
- [ ] T016 grep the cited docs to confirm no stale value remains
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Phase 3 - 17 P2 advisories** (each fixed at its cited line or explicitly deferred with rationale; any behavior-changing P2 gains a vitest).

- [ ] T017 Triage the 17 P2 advisories into fix-now vs deferred, with a one-line rationale each
- [ ] T018 Fix each fix-now P2 at its exact cited line, minimal diff (no adjacent cleanup)
- [ ] T019 For any P2 that changes runtime behavior, add/extend a focused vitest and run it
- [ ] T020 Record deferred P2 advisories with rationale in implementation-summary.md
- [ ] T021 Gate: `npm run typecheck` 0 new errors AND `npm run test:core` green
- [ ] T022 Run `validate.sh --strict` on this packet; iterate to Errors: 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 4 P1 findings fixed; 3 behavior fixes each proven by a green vitest
- [ ] 17 P2 advisories resolved or deferred with documented rationale
- [ ] `validate.sh --strict` on this packet passes (Errors: 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
