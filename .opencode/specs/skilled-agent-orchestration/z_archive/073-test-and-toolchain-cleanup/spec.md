---
title: "Feature Specification: 073 Test + Toolchain Cleanup"
description: "Bundle 4 follow-up fixes from packets 071/072 + telemetry-schema-drift commit. 3 fixes shipped (run-matrix.sh codex/opencode token regexes + opencode timeout 180s; post-save reviewer EISDIR guard); 1 deferred (test-alignment-validator ESM migration — needs deeper refactor due to import.meta usage)."
trigger_phrases: ["073", "test-and-toolchain-cleanup", "post-save EISDIR fix", "run-matrix.sh fix"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/073-test-and-toolchain-cleanup"
    last_updated_at: "2026-05-05T17:15:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "3 fixes verified; 1 deferred"
    next_safe_action: "Commit + push"
    blockers: []
    key_files:
      - .opencode/skills/system-spec-kit/scripts/core/post-save-review.ts
      - .opencode/specs/skilled-agent-orchestration/071-sk-doc-router-stress-test/002-matrix-execute/scripts/run-matrix.sh
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "073-final"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 073 Test + Toolchain Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Predecessor** | 072 + telemetry-schema fix (commits aede7ae7b + f3338bd59) |
| **Successor** | None (a 074 follow-up may be filed for the deferred ESM migration) |
| **Handoff Criteria** | 3 fixes applied + verified on real logs; 1 fix deferred with documented technical reason; one commit on main + pushed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packets 071/072 + the inline telemetry-schema fix surfaced 4 bounded toolchain issues. 3 are mechanical fixes (run-matrix.sh token-extraction regexes for codex+opencode; opencode 120s→180s timeout; post-save reviewer EISDIR guard). The 4th (test-alignment-validator.js ESM bug) turned out to need a deeper refactor — the validator source uses `import.meta.url` which can't be transpiled to CommonJS. Bundling fixed#2/3/4 into one cleanup keeps the diff coherent; deferring #1 to a focused follow-up packet preserves scope.

### Purpose
Apply 3 bounded fixes that reduce friction for future router-stress + memory-save workflows. Document the deferred ESM migration with its technical rationale.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (3 shipped fixes)

1. **Fix #2: codex token regex in `run-matrix.sh`**. Old regex `tokens used[^0-9]*[0-9,]+` doesn't match the actual `tokens used\n[indent][0-9,]+` format. New extractor uses awk: `/tokens used/ {getline; gsub(/[^0-9]/,""); ...}`. Verified against SD-001/codex.log: extracts 35713 (was 0).

2. **Fix #3: opencode timeout 120→180s + jq parser in `run-matrix.sh`**. Raised all 3 CLI timeouts to 180s (codex/copilot stayed within 120s in 071, but raising uniformly is consistent). New jq parser filters JSONL stream first via grep, then sums `step_finish.part.tokens.total` events: `grep -E '^\{' "$log" | jq -r 'select(.type=="step_finish") | .part.tokens.total // empty' | awk '{s+=$1} END {print s+0}'`. Verified against SD-001/opencode.log: extracts 40810 (was "(json-parse-failed)").

3. **Fix #4: post-save reviewer EISDIR guard in `post-save-review.ts`**. Added directory + missing-file guard before `fs.readFileSync`. Phase-parent workflows pass the spec folder root (a directory) — pre-fix the reviewer threw EISDIR; post-fix it returns SKIPPED with a clear `skipReason: 'savedFilePath is a directory (phase-parent or unspecified target)'`. dist/post-save-review.js rebuilt via `tsc --build`. Verified: `generate-context.js ... 068-spec-folder` now logs SKIPPED cleanly instead of REVIEWER_ERROR.

### Out of Scope (1 deferred fix)

**Fix #1 DEFERRED: test-alignment-validator.js ESM migration**. The test currently uses CommonJS `require()` but `scripts/package.json` declares `"type":"module"`, so Node throws `ReferenceError: require is not defined`. Renaming to `.cjs` exposed a deeper bug: the test loads alignment-validator.ts via `typescript.transpileModule(... ModuleKind.CommonJS ...)` then `Module._compile`s the result. The source uses `import.meta.url` (line 19), which is ESM-only syntax that TypeScript can't transpile to CommonJS — the transpiled output throws `Cannot use 'import.meta' outside a module`. The proper fix is a full ESM migration: rewrite the test as `.mjs` using `import` instead of `require`, replace `Module._compile` with `import()` of a temporary `.mjs` file. Estimated 30-60 min of focused refactoring. Filed as candidate for follow-up packet 074.

### Out of Scope (already shipped)
- Fix #5 (codex stdin redirection) — already in 071's run-matrix.sh
- Telemetry schema drift fix — already shipped in commit f3338bd59

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `071/002-matrix-execute/scripts/run-matrix.sh` | Modify | Token regex (codex), jq parser (opencode), 3 timeouts 120→180 |
| `.opencode/skills/system-spec-kit/scripts/core/post-save-review.ts` | Modify | Directory + missing-file guard |
| `.opencode/skills/system-spec-kit/scripts/dist/core/post-save-review.js` | Regenerate | tsc --build |
| `073/{spec,plan,tasks,implementation-summary}.md` | Create | Spec docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | run-matrix.sh codex extractor returns real token count | `awk '/tokens used/ {getline; gsub(/[^0-9]/,""); ...}'` on SD-001/codex.log returns 35713 |
| REQ-002 | run-matrix.sh opencode extractor returns real token count | `grep -E '^\{' \| jq -r 'select(.type=="step_finish")...'` on SD-001/opencode.log returns 40810 |
| REQ-003 | run-matrix.sh all 3 CLI timeouts = 180s | `grep -c 'timeout 180' run-matrix.sh` returns >=3 |
| REQ-004 | post-save reviewer skips with directory guard (no EISDIR) | `generate-context.js ... 068-spec-folder` logs SKIPPED with directory skipReason; no REVIEWER_ERROR |
| REQ-005 | dist/post-save-review.js rebuilt from updated TS | `grep -c 'isDirectory' dist/core/post-save-review.js` returns >=1 |
| REQ-006 | One commit on main + pushed | `git push origin main` exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | validate.sh --strict on 073 exits 0 | Validator returns 0 errors, 0 warnings |
| REQ-008 | Fix #1 deferred with documented rationale | Section 3 "Out of Scope (1 deferred fix)" documents the ESM/import.meta technical block |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 3 fixes applied, verified, committed, pushed
- **SC-002**: 074 candidate scope documented for the deferred ESM migration

### Given/When/Then Verification Scenarios

**Given** SD-001/codex.log with `tokens used\n35,713`, **When** running the new awk-based extractor, **Then** stdout is `35713`.

**Given** SD-001/opencode.log with mixed JSONL + stderr noise, **When** running `grep + jq + awk` chain, **Then** stdout is `40810` (sum of step_finish.tokens.total).

**Given** the timeout 120→180 sed change, **When** running `grep -c 'timeout 180' run-matrix.sh`, **Then** count is >=3.

**Given** post-save-review.ts has the directory guard, **When** generate-context.js runs against a phase-parent spec folder (068), **Then** stdout/log shows `POST-SAVE QUALITY REVIEW -- SKIPPED` with clear skipReason (no `REVIEWER_ERROR`).

**Given** tsc --build runs on scripts/, **When** checking dist/core/post-save-review.js, **Then** it contains the new `isDirectory` guard.

**Given** all fixes applied, **When** committing + pushing, **Then** one commit lands on main and `git push origin main` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | tsc --build fails or breaks unrelated dist/ files | Low | Verified — build passes cleanly with only post-save-review.ts changes; no cascading errors |
| Risk | post-save-review.vitest.ts test fails with directory-guard logic | Low | Existing tests don't pass directory paths; guard is additive |
| Risk | Deferred Fix #1 forgotten | Low | Documented in §3 + §6 with explicit 074 candidate scope |
| Dependency | TypeScript + tsc available | Green | scripts/package.json has "build":"tsc --build" |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — Fix #1 deferral has clear documentation. 074 follow-up gated on user request.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
