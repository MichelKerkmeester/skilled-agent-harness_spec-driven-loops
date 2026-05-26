---
title: "Plan: Filesystem Durability Closure for F22 F28 F59 F66 F67 F72 F89 F103 F104"
description: "Plan for rerank sidecar atomic-write durability, state-dir validation, log fd behavior, health payload normalization, DI, and helper extraction."
trigger_phrases:
  - "020 003 plan"
  - "filesystem durability plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/003-fix-deferred-p2s-for-filesystem-durability"
    last_updated_at: "2026-05-23T10:31:09Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified"
    next_safe_action: "Parent agent may review and commit packet"
    blockers: []
    key_files:
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/bin/lib/ensure-rerank-sidecar.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0200030200030200030200030200030200030200030200030200030200030200"
      session_id: "020-003-filesystem-durability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Filesystem Durability Closure for F22 F28 F59 F66 F67 F72 F89 F103 F104

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS, TypeScript tests, Node.js |
| **Framework** | Vitest bin and mcp-server suites |
| **Storage** | Sidecar state directory, owner ledger, launcher log file |
| **Testing** | Targeted Vitest, mcp-server typecheck, strict spec validation |

### Overview
This packet closes nine deferred P2 findings in `.opencode/bin/lib/ensure-rerank-sidecar.cjs`. The sequence is scaffold validation, predecessor/source reads, durability helper work, state-dir and log semantics, health shape and skip/DI consistency, focused fixtures, requested verification, docs completion, and final strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] User pre-approved the Level 2 packet folder.
- [x] Scope is limited to launcher, launcher tests, optional launcher helper modules, and packet docs.
- [x] Scaffold strict validation passes before source edits.

### Definition of Done
- [x] F22/F28/F59/F66/F67/F72/F89/F103/F104 are closed with fixtures.
- [x] At least five ADRs document behavior, alternatives, durability contract, and compatibility.
- [x] Requested vitest, typecheck, and strict validation commands exit 0 or equivalent local runner evidence is documented where the prompt runner path is absent.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Keep the launcher public API stable and extract internal helpers around durability, validation, logging, health normalization, and orchestration. The F15 atomic-write pattern remains the baseline: exclusive temp create, fsync file, rename. This packet adds containing-directory fsync after rename.

### Key Components
- **Atomic write helper**: owns random temp suffix, file fsync, rename, and directory fsync.
- **State-dir validator**: normalizes and rejects unsafe or non-writable directories before launcher work.
- **Log opener/spawner**: owns `0600` mode and `stdio: ['ignore', logFd, logFd]`.
- **Health normalizer**: returns stable `{ status, port, ownerCount, lastReapTs }`.
- **Dependency bundle**: injects spawn, fetch, fs, process, crypto, and timers for tests.

### Data Flow
Launcher input and env select a state directory. The state dir is validated before owner ledger or log writes. Persistent writes use random temp names and atomic rename, then fsync the containing directory. Health reads normalize ledger-derived owner counts and reap timestamps into a stable payload.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ensure-rerank-sidecar.cjs` | Launcher and state owner | Add durability, validation, logging, health, DI, and helper extraction | `ensure-rerank-sidecar.vitest.ts` |
| `ensure-rerank-sidecar.vitest.ts` | Launcher fixture suite | Add regression coverage for all nine findings | Bin vitest |
| Packet docs | Work contract and ADRs | Record findings, verification, and durability semantics | Strict spec validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold Level 2 packet docs.
- [x] Read parent 020 spec and Bucket 1/6 ADR style.
- [x] Read F15 atomic-write baseline.
- [x] Read full launcher source and tests.
- [x] Strict-validate scaffold before source edits.

### Phase 2: Core Implementation
- [x] Add `fsyncDirOf(path)` and call it after atomic renames.
- [x] Replace any deterministic temp naming with crypto-random suffixes.
- [x] Validate `RERANK_SIDECAR_STATE_DIR` at launcher entry.
- [x] Open log files with `0600` and spawn with stable fd stdio shape.
- [x] Normalize health payload shape.
- [x] Add internal deps parameter support without changing public API.
- [x] Split the largest function into focused helpers.

### Phase 3: Verification
- [x] Run requested bin vitest command equivalent through installed local runner.
- [x] Run requested embedders vitest command; no F48 rerun needed.
- [x] Run mcp-server typecheck.
- [x] Fill checklist, decision record, and implementation summary.
- [x] Run final strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Atomic write, directory fsync, temp suffix, state-dir validation, log mode, stdio, health payload, skip and DI | `node node_modules/vitest/vitest.mjs run .opencode/bin/lib/ensure-rerank-sidecar.vitest.ts --config .opencode/vitest.config.bin.ts` |
| Regression | Embedders surface unaffected by launcher durability bucket | `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` |
| Compile | mcp-server TypeScript safety | `npm run typecheck --workspace=@spec-kit/mcp-server` |
| Spec | Packet contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| F15 atomic-write baseline | Internal contract | Read before source edits | Cannot safely extend durability |
| Vitest installs | Internal tooling | Present expected | Cannot prove fixture behavior |
| mcp-server workspace typecheck | Internal tooling | Present expected | Cannot claim TS safety |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any targeted test failure or typecheck failure that is not directly caused by this packet and fixable in scope.
- **Procedure**: Stop at first regression per parent rule, record the failure in `decision-record.md` DEFERRED section, and do not proceed to remaining findings.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Core) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Parent/predecessor reads | Core |
| Core | Scaffold validation | Verify |
| Verify | Fixture implementation | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20-30 minutes |
| Core Implementation | Medium | 90-150 minutes |
| Verification | Medium | 30-60 minutes |
| **Total** | | **140-240 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Atomic writes preserve wx + random temp + rename.
- [x] Directory fsync happens after rename and closes descriptors.
- [x] State-dir validation rejects unsafe paths before writes.

### Rollback Procedure
1. Restore prior launcher behavior if targeted tests expose an in-scope regression.
2. Record any unrelated existing test failure in `decision-record.md` DEFERRED section and halt.
3. Re-run the failing targeted command after any rollback.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
