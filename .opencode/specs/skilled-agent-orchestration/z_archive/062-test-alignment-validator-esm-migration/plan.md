---
title: "Implementation Plan: 074 ESM Migration"
description: "Rewrite test-alignment-validator.js as test-alignment-validator.mjs. Stub two relative imports during transpile. createRequire for typescript module. Dynamic import of temp .mjs."
trigger_phrases: ["074 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/062-test-alignment-validator-esm-migration"
    last_updated_at: "2026-05-05T17:35:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Plan authored after 6/6 tests pass"
    next_safe_action: "Commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "074-final"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 074 ESM Migration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Stack** | Node ESM + TypeScript transpileModule |
| **Source files** | scripts/tests/test-alignment-validator.mjs (new) |
| **Output** | scripts/tests/test-alignment-validator.mjs |
| **Testing** | `node test-alignment-validator.mjs` |

### Overview
Single-file ESM rewrite. Same test cases (T-AV00..T-AV05). Different module-loading strategy: ESNext transpile + temp .mjs + dynamic import().
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 073 closed with Fix #1 deferral
- [x] alignment-validator.ts uses import.meta.url confirmed (line 19)

### Definition of Done
- [x] .mjs created
- [x] All 6 tests PASS
- [x] Legacy .js deleted
- [ ] Commit + push
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure rewrite (not iterative refactor). New file replaces old file 1:1 in test surface.

### Data Flow
```
read alignment-validator.ts source
  -> stub 2 relative imports (promptUserChoice, dirnameFromImportMeta)
  -> typescript.transpileModule({module: ESNext})
  -> write to /tmp/foo.mjs
  -> await import(pathToFileURL(tempPath).href)
  -> run tests against the imported module
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Identify dirnameFromImportMeta usage (line 19 only, default-path branch)
- [x] Confirm tests don't hit default-path branch (T-AV04/T-AV05 pass explicit paths)

### Phase 2: Core Implementation
- [x] Author test-alignment-validator.mjs with ESM imports
- [x] Add createRequire for typescript module
- [x] Add dirnameFromImportMeta stub (extends existing promptUserChoice stub pattern)
- [x] Use ModuleKind.ESNext in transpile
- [x] Write to /tmp/.mjs + dynamic import via pathToFileURL

### Phase 3: Verification
- [x] Run test: 6/6 PASS
- [x] Delete legacy .js (git rm)
- [ ] validate.sh --strict
- [ ] Commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | Run the test | `node test-alignment-validator.mjs` |
| Aggregate | 6 tests pass | exit code 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| Node 18+ ESM + createRequire | Green (Node 25.6.1) |
| typescript module | Green |
| alignment-validator.ts | Green (unchanged) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: tests regress; missing functionality
- **Procedure**: `git revert HEAD` (single commit)
- **Granularity**: One commit
<!-- /ANCHOR:rollback -->
