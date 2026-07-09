---
title: "Tasks: Deep loop executor config-dir override"
description: "Completed implementation tasks for the deep-loop cli-claude-code config-dir override."
trigger_phrases:
  - "deep-loop configDir tasks"
  - "Claude config-dir fanout tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/013-deep-loop-executor-config-dir"
    last_updated_at: "2026-06-10T16:50:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed configDir implementation and verification"
    next_safe_action: "Reference implementation-summary.md for verification evidence"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-executor-config-dir-20260610"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep loop executor config-dir override

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read executor schema and validation flow.
- [x] T002 Read fanout-run spawn env construction.
- [x] T003 [P] Read review/research command setup docs and review auto YAML.
- [x] T004 [P] Read focused executor-config, fanout-run, and executor-audit tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add `configDir` to executor config schema.
- [x] T006 Restrict `configDir` support to `cli-claude-code`.
- [x] T007 Add `~` expansion and scoped `CLAUDE_CONFIG_DIR` injection in fanout-run.
- [x] T008 Document `--config-dir=PATH` in deep-review setup.
- [x] T009 Document `--config-dir=PATH` in deep-research sibling setup.
- [x] T010 Add review auto YAML binding and render hint for single cli-claude-code auto dispatch.
- [x] T011 Add unit coverage for configDir validation and fanout env behavior.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run focused TypeScript no-emit check.
- [x] T013 Run focused Vitest suite.
- [x] T014 Run stubbed Fable 5 configDir smoke check.
- [x] T015 Run absent configDir smoke check.
- [x] T016 Run OpenCode hygiene and alignment checks.
- [x] T017 Validate this spec folder with `validate.sh --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification passed or deviations documented in implementation summary.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Verification Evidence**: See `implementation-summary.md` and `checklist.md`.
<!-- /ANCHOR:cross-refs -->
