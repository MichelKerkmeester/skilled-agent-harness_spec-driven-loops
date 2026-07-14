---
title: "Feature Specification: 074 test-alignment-validator ESM Migration"
description: "Resolve the deferred Fix #1 from packet 073: migrate test-alignment-validator from CommonJS to ESM. Validator source uses import.meta.url which TypeScript can't transpile to CJS — proper fix is full ESM rewrite (transpile with module:ESNext + dynamic import of temp .mjs)."
trigger_phrases: ["074", "test-alignment-validator-esm-migration", "ESM test fix"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/062-test-alignment-validator-esm-migration"
    last_updated_at: "2026-05-05T17:35:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "ESM migration verified — 6/6 tests pass"
    next_safe_action: "Author plan/tasks/impl-summary, commit, push"
    blockers: []
    key_files:
      - .opencode/skills/system-spec-kit/scripts/tests/test-alignment-validator.mjs
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "074-final"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 074 test-alignment-validator ESM Migration

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
| **Predecessor** | 073-test-and-toolchain-cleanup (commit fc158c1fe — Fix #1 deferred) |
| **Successor** | None |
| **Handoff Criteria** | New `.mjs` test runs cleanly (6/6 PASS); old `.js` deleted; one commit on main + pushed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 073 deferred Fix #1: `test-alignment-validator.js` uses CommonJS `require()`, but `scripts/package.json` declares `"type":"module"`. The `.cjs` rename attempted in 073 fixed the wrapper-level `require is not defined` but exposed a deeper blocker: the validator source (`alignment-validator.ts:19`) uses `import.meta.url`, an ESM-only feature TypeScript can't transpile to CommonJS even with `module:CommonJS`. The transpiled CJS code throws `Cannot use 'import.meta' outside a module`.

### Purpose
Migrate the test to ESM (`.mjs`): use `import` statements, `createRequire(import.meta.url)` for the CJS-only `typescript` module, transpile validator source with `ModuleKind.ESNext`, write transpiled output to a temp `.mjs` file, dynamic-`import()` via `pathToFileURL().href`. Stub both relative-path imports (`promptUserChoice`, `dirnameFromImportMeta`) since the test fixtures don't need them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `test-alignment-validator.mjs` with full ESM migration
- Stub both `promptUserChoice` and `dirnameFromImportMeta` imports during transpile
- Use `createRequire(import.meta.url)` to load CJS `typescript` module
- Write transpiled output to temp `.mjs`, dynamic-import via `pathToFileURL().href`
- Delete legacy `test-alignment-validator.js`
- All 6 tests must pass (T-AV00 through T-AV05)

### Out of Scope
- vitest migration
- Validator source changes
- Other `*.vitest.ts` files (vitest handles ESM natively)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/tests/test-alignment-validator.mjs` | Create | ESM-migrated test |
| `.opencode/skills/system-spec-kit/scripts/tests/test-alignment-validator.js` | Delete | Legacy CommonJS file |
| `074/{spec,plan,tasks,implementation-summary}.md` | Create | Spec docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | New .mjs test runs cleanly | `node test-alignment-validator.mjs` exits 0 |
| REQ-002 | All 6 tests pass | T-AV00 + T-AV01 + T-AV02 + T-AV03 + T-AV04 + T-AV05 all PASS |
| REQ-003 | Legacy .js file deleted | `git ls-files | grep test-alignment-validator.js` returns empty |
| REQ-004 | Validator source unchanged | `git diff alignment-validator.ts` empty |
| REQ-005 | One commit on main + pushed | `git push origin main` exit 0 |
| REQ-006 | validate.sh --strict on 074 exits 0 | Validator returns 0/0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | dirnameFromImportMeta stub doesn't break test paths | All tests pass with explicit schemaPath/docsPath; default-path branch untested by this suite |
| REQ-008 | promptUserChoice stub allows optional .js extension | Regex matches both `'../utils/prompt-utils'` and `'../utils/prompt-utils.js'` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 6/6 tests pass
- **SC-002**: 073's deferred Fix #1 resolved cleanly

### Given/When/Then Verification Scenarios

**Given** the new .mjs test, **When** running `node test-alignment-validator.mjs`, **Then** stdout shows 6 PASS + 0 FAIL.

**Given** the validator source uses `import.meta.url`, **When** transpiling with `ModuleKind.ESNext`, **Then** import.meta is preserved.

**Given** the transpiled output is written to a temp `.mjs`, **When** dynamic-importing via `pathToFileURL().href`, **Then** Node treats the file as ESM regardless of cwd's package.json type.

**Given** the validator imports `dirnameFromImportMeta` from a relative path, **When** the regex stub replaces it with an inline impl, **Then** the test runs without resolving relative paths from /tmp/.

**Given** the legacy .js file is deleted, **When** running `git ls-files`, **Then** only the .mjs is listed.

**Given** the changes committed, **When** running `git push origin main`, **Then** push succeeds.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | dirnameFromImportMeta stub returns wrong dir | Low | Tests always pass explicit paths; stub only matters for default-path branch |
| Risk | Other tests in the dir affected by `.js` → `.mjs` cleanup | Low | Other test files are `*.vitest.ts` — handled by vitest, unaffected |
| Risk | typescript loader needs CJS context | Resolved | createRequire(import.meta.url) per Node ESM-CJS interop convention |
| Dependency | Node 18+ for native ESM + createRequire | Green | Repo runs on Node 25.6.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — clean migration, all tests pass.
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
