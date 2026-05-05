---
title: "Implementation Plan: 073 Test + Toolchain Cleanup"
description: "3 mechanical fixes (run-matrix.sh codex regex, opencode jq + 180s timeout, post-save EISDIR guard); 1 deferred (test-alignment-validator ESM migration). tsc rebuild for dist/."
trigger_phrases: ["073 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/073-test-and-toolchain-cleanup"
    last_updated_at: "2026-05-05T17:15:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Plan authored after 3 fixes verified"
    next_safe_action: "Commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "073-final"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 073 Test + Toolchain Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Stack** | Bash (run-matrix.sh) + TypeScript (post-save-review.ts) + tsc build |
| **Source files** | run-matrix.sh, post-save-review.ts |
| **Output** | dist/core/post-save-review.js (regenerated) |
| **Testing** | awk/jq verification on real 071 logs; smoke test of generate-context.js |

### Overview
Three bounded fixes applied directly via Edit tool. Token-extraction regexes corrected for codex/opencode in run-matrix.sh; post-save reviewer guard added in post-save-review.ts then dist/ rebuilt via tsc. One fix (Fix #1 ESM migration) deferred due to import.meta usage in the validator source.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Findings documented in 071/072 review-reports + this turn's debug
- [x] tsc build script available (`npm run build` in scripts/)

### Definition of Done
- [x] 3 fixes verified on real logs / smoke test
- [x] dist/ rebuilt
- [ ] One commit on main + pushed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical Edit-based fixes. No new files except spec docs. Single `tsc --build` rebuild for the TS change.

### Data Flow
```
post-save-review.ts (Edit guard)  ->  tsc --build  ->  dist/core/post-save-review.js
run-matrix.sh (Edit token regexes + timeouts) -> verified vs real logs
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate post-save-review.ts + workflow.ts call site
- [x] Sample real codex.log + opencode.log to design extractors
- [x] Investigate Fix #1 — discover import.meta blocker, defer

### Phase 2: Core Implementation
- [x] Edit run-matrix.sh: codex awk extractor (35713 verified)
- [x] Edit run-matrix.sh: opencode grep+jq+awk (40810 verified)
- [x] Edit run-matrix.sh: 3× sed timeout 120→180
- [x] Edit post-save-review.ts: directory + missing-file guard
- [x] tsc --build → dist/core/post-save-review.js regenerated

### Phase 3: Verification
- [x] Codex extractor verified on SD-001/codex.log
- [x] Opencode extractor verified on SD-001/opencode.log
- [x] post-save guard verified via generate-context.js smoke test (SKIPPED, no EISDIR)
- [ ] validate.sh --strict on 073
- [ ] Commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each extractor on real log | awk, jq, awk pipeline |
| Integration | post-save guard end-to-end | generate-context.js smoke test on 068 |
| Build | dist/ regeneration | tsc --build |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| TypeScript | External | Green | Cannot rebuild dist/ |
| 071 logs at logs/SD-001/{codex,opencode}.log | Internal | Green | Cannot verify extractors |
| jq + awk | External | Green | Standard CLI tools |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: tsc build fails; post-save guard breaks existing tests; extractors return wrong values
- **Procedure**: `git reset --hard HEAD~1` (single commit)
- **Granularity**: One commit
<!-- /ANCHOR:rollback -->
