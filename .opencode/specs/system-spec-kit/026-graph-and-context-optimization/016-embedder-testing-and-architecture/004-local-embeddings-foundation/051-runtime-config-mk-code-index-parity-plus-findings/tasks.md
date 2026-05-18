---
title: "Tasks: Runtime config mk-code-index parity plus findings"
description: "Task ledger for packet 016 runtime config parity and bounded deep-review finding remediation."
trigger_phrases:
  - "016 tasks"
  - "runtime config parity tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/051-runtime-config-mk-code-index-parity-plus-findings"
    last_updated_at: "2026-05-14T19:27:55Z"
    last_updated_by: "codex"
    recent_action: "All packet tasks completed or deferred with named follow-ons"
    next_safe_action: "Run follow-on hardening packets if requested"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:2222222222222222222222222222222222222222222222222222222222222222"
      session_id: "016-runtime-config-mk-code-index-parity-plus-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Runtime config mk-code-index parity plus findings

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Scaffold Level 3 packet 016 under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/`.
- [x] T002 Read local rename commit `50cfabb6e2` after requested SHA was absent.
- [x] T003 Read both review reports and bucket P1/P2 findings.
- [x] T004 Read runtime configs and launcher state.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Rename stale runtime config keys and launcher paths in `opencode.json`, `.codex/config.toml`, and `.gemini/settings.json`.
- [x] T006 Verify `.claude/mcp.json` was already aligned and leave it untouched.
- [x] T007 Fix 017 F012 by deriving the mk-code-index launcher fallback path from `path.basename(kitDir)`.
- [x] T008 Fix 048 F004 by broadening shared-daemon error response detection.
- [x] T009 Fix 048 F011 by exercising primary `spec_kit_memory` and `cocoindex_code` test keys.
- [x] T010 Fix 048 F008/F009/F010 traceability docs in the 045 packet and handover.
- [x] T011 Document all remaining non-bounded P2 findings with named follow-on packets.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Validate JSON config syntax with `node`.
- [x] T013 Validate `.codex/config.toml` with Python 3.11 `tomllib`.
- [x] T014 Run `opencode mcp list`; verify `mk_code_index` connected.
- [x] T015 Run `node --check` for changed JS/MJS/CJS files.
- [x] T016 Run focused Vitest for shared-daemon helper routing.
- [x] T017 Strict-validate the modified 045 packet.
- [x] T018 Strict-validate packet 016.
- [x] T019 Commit logical scopes and leave push to operator.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed where available.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
