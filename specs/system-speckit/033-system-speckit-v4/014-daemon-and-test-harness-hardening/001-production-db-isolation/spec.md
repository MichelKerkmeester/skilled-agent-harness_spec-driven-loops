---
title: "Feature Specification: Phase 1: Production Database Isolation"
description: "The root vitest config globs mcp-server tests but declares no setupFiles, so the production-database isolation guard loads from one entry point and not the other. A run started from scripts/ can resolve the live 12.9 GB memory database while the daemon holds it open."
trigger_phrases:
  - "production db isolation"
  - "vitest setupFiles bypass"
  - "context-index.sqlite guard"
  - "isolateProductionDatabase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/014-daemon-and-test-harness-hardening/001-production-db-isolation"
    last_updated_at: "2026-08-30T09:56:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec from observed config asymmetry"
    next_safe_action: "Decide resolver-wide vs test-scoped fail-closed guard, then plan"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/vitest.config.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/vitest.config.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/tests/_support/vitest-setup.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-production-db-isolation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Resolver-wide fail-closed guard, or scoped to a test environment condition?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: Production Database Isolation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-orphan-daemon-reaping |
| **Handoff Criteria** | A test run started from any entry point cannot resolve the production database directory |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Daemon Lifecycle and Test-Harness Hardening specification.

**Scope Boundary**: The two vitest configs and the shared path resolver. Daemon lifecycle is phase 002; test runtime bounds are phase 003.

**Dependencies**:
- None. This phase is first because it is the only one with a data-loss consequence.

**Deliverables**:
- One reachable production-database guard, proven by negative control
- A single vitest entry point, or two entry points that provably share setup

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`mcp-server/vitest.config.ts` loads `tests/_support/vitest-setup.ts`, whose `isolateProductionDatabase()` exists to stop a test opening the live memory database. Its own comment states the consequence: writing to it while the daemon holds it open corrupts the SQLite file. `system-spec-kit/vitest.config.ts` declares no `setupFiles` at all, yet its `include` globs `mcp-server/tests/**/*.vitest.ts`. There is no `scripts/vitest.config.*`, so `npx vitest run` from `scripts/` resolves upward to the unguarded config — which is what one of the three wedged runs on 2026-08-30 did.

The production database is 13,838,503,936 bytes and was held open by the live daemon during that run, including its `.lock` and `.lock-journal` file descriptors.

### Purpose

Make it impossible for a test run to resolve the production database directory, regardless of which config or working directory it starts from.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reconcile the two vitest configs so the isolation setup cannot be bypassed by entry point
- Add a fail-closed check in the path resolver so config choice is not the only line of defence
- A negative control that reproduces the bypass before the fix and proves the guard after

### Out of Scope
- Fixing the 56 currently failing tests — unrelated to the isolation path and separately tracked
- Shrinking the 12.9 GB database or its equally sized `.bak` sibling — real, but a storage concern
- Any change to what the resolver returns for non-test callers

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/vitest.config.ts` | Modify | Share `setupFiles` with the mcp-server config, or remove this config so one entry point remains |
| `.opencode/skills/system-spec-kit/shared/paths` resolver | Modify | Fail closed when a test-context run resolves the production database directory |
| `.opencode/skills/system-spec-kit/mcp-server/tests/` | Create | Negative-control test proving the guard fires |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every vitest entry point loads the production-database isolation setup | Starting a run from `scripts/`, from `mcp-server/`, and from the skill root all resolve a throwaway database directory |
| REQ-002 | The resolver refuses the production database directory in a test context rather than falling back to it | A test that explicitly targets the production directory fails closed with a named error instead of opening the file |
| REQ-003 | The bypass is reproduced before it is fixed | A recorded negative control run shows the pre-fix path resolving to the production directory |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Config drift cannot silently reintroduce the gap | A check fails if a vitest config globs `mcp-server/tests/**` without the isolation setup |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the fix applied, no vitest invocation from any working directory in the skill tree resolves the production database directory
- **SC-002**: The guard's failure mode is a named, fail-closed error, not a silent fallback
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A resolver-wide guard changes behaviour for production callers | High | Gate the refusal on a test context, or stage it behind a flag and run the full suite before removing the flag |
| Risk | Removing the root config breaks an unknown caller | Med | Grep for invocations that depend on the root config's include globs before deleting |
| Dependency | The daemon holds the database open during any run | Med | Do not exercise the negative control against the live database; assert on the resolved path, never on an open handle |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the fail-closed refusal live in the resolver for all callers, or only under a test-environment condition? Resolver-wide is stronger but widens the blast radius to production paths.
- Is the root `vitest.config.ts` still needed at all, or is it a leftover that should be deleted rather than repaired?
<!-- /ANCHOR:questions -->

---
