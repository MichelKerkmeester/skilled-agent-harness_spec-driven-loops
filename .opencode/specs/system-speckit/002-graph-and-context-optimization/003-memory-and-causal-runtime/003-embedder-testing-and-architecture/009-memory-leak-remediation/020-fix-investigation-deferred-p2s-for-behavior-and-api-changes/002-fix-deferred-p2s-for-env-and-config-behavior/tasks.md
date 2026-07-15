---
title: "Tasks: Env and Config Behavior Closure for F17 F16 F40 F46"
description: "Task list for closing F17 F16 F40 F46 with validation, shared allowlists, prefix precedence fixtures, and verification."
trigger_phrases:
  - "020 002 tasks"
  - "F17 F16 F40 F46 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/002-fix-deferred-p2s-for-env-and-config-behavior"
    last_updated_at: "2026-05-23T12:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded"
    next_safe_action: "Validate scaffold, then implement F17/F16/F40/F46"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0200020200020200020200020200020200020200020200020200020200020200"
      session_id: "020-002-f17-f16-f40-f46-env-config"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Env and Config Behavior Closure for F17 F16 F40 F46

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

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
## PHASE 1: SETUP

- [x] T001 Scaffold Level 2 packet docs from 020/001 (`<this-folder>/`)
- [x] T002 Read parent 020 spec and halt-on-first-regression rule (`../spec.md`)
- [x] T003 Read Bucket 6 ADR template (`../001-*/decision-record.md`)
- [x] T004 Read F49 launcher allowlist baseline (`../../017-*/004-*/implementation-summary.md`)
- [x] T005 Read full source/test files for allowed edit surface
- [x] T006 Strict-validate scaffold before source edits (`validate.sh`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T007 Add shared sidecar env allowlist helper (`sidecar-env-allowlist.cjs`)
- [ ] T008 Wire launcher env filtering to shared allowlist (`ensure-rerank-sidecar.cjs`)
- [ ] T009 Wire in-process env filtering to shared allowlist (`sidecar-client.ts`)
- [ ] T010 Add stderr warning for dropped env keys (`sidecar-client.ts`)
- [ ] T011 Add F17 `ConfigHashInputError` and hash input validation (`ensure-rerank-sidecar.cjs`)
- [ ] T012 Add F46 `SPECKIT_*` over `RERANK_*` prefix precedence (`sidecar-client.ts`)
- [ ] T013 Add regression fixtures (`sidecar-hardening.vitest.ts`, `ensure-rerank-sidecar.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T014 Run requested embedders vitest command
- [ ] T015 Run requested bin vitest command
- [ ] T016 Run mcp-server typecheck
- [ ] T017 Fill checklist, decision record, and implementation summary
- [ ] T018 Run final strict spec validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Requested verification commands exit 0
- [ ] Parent halt-on-first-regression rule was honored
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Scope**: See `../spec.md`
- **F49 Baseline**: See `../../017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode/implementation-summary.md`
- **Finding Registry**: See `../../015-deep-research-drift-and-simplification/research/findings-registry.json`
<!-- /ANCHOR:cross-refs -->
