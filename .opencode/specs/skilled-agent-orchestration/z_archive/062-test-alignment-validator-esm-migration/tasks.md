---
title: "Tasks: 074 ESM Migration"
description: "T###: rewrite, verify, delete legacy, commit, push"
trigger_phrases: ["074 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/062-test-alignment-validator-esm-migration"
    last_updated_at: "2026-05-05T17:35:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Tasks authored"
    next_safe_action: "Commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "074-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 074 ESM Migration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read full test-alignment-validator.js (223 lines, 6 tests)
- [x] T002 Identify validator's relative imports (promptUserChoice + dirnameFromImportMeta)
- [x] T003 Confirm tests don't hit default-path branch (use explicit schemaPath/docsPath)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Author test-alignment-validator.mjs with ESM imports
- [x] T005 createRequire(import.meta.url) for typescript module
- [x] T006 Add dirnameFromImportMeta inline stub
- [x] T007 ModuleKind.ESNext in transpile compilerOptions
- [x] T008 Write transpiled output to /tmp/foo.mjs + dynamic import via pathToFileURL
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 Run test: PASS T-AV00 + T-AV01 + T-AV02 + T-AV03 + T-AV04 + T-AV05 (6/6)
- [x] T010 git rm legacy test-alignment-validator.js
- [ ] T011 validate.sh --strict on 074 exits 0
- [ ] T012 Commit on main + push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] 6/6 tests pass
- [x] Legacy .js deleted
- [ ] Commit + push
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor**: 073-test-and-toolchain-cleanup (Fix #1 deferred)
<!-- /ANCHOR:cross-refs -->
