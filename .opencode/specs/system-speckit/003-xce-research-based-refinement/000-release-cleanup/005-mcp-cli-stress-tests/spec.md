---
title: "Feature Specification: MCP CLI Stress Tests"
description: "Completed stress coverage for the three daemons, CLI front doors under schema v37, and the new gated flags."
trigger_phrases:
  - "mcp cli stress tests"
  - "027 release cleanup 005-mcp-cli-stress-tests"
  - "shipped 027 alignment"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/005-mcp-cli-stress-tests"
    last_updated_at: "2026-06-10T16:06:30Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed release-cleanup MCP/CLI stress coverage and verification."
    next_safe_action: "No follow-up required."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-005-mcp-cli-stress-tests-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved implementation scope and isolation constraints."
---
# Feature Specification: MCP CLI Stress Tests

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Completed stress coverage for the three daemons, CLI front doors under schema v37, and the new gated flags.

### Purpose
Extend the MCP server stress suite so release-cleanup verification exercises schema v37 migrations, default-off gated paths, CLI front-door command surfaces, and daemon isolation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add schema v37 migration stress for v35 source provenance, v36 idempotency receipts, and v37 tombstone partitions.
- Add default-off and opt-in stress for idempotency replay, tombstone deletes, and semantic-trigger shadow telemetry.
- Add CLI front-door stress for spec-memory, code-index, and skill-advisor command counts, warm-only exit codes, and temp-socket isolation.
- Preserve the existing live-owner SKIP behavior and substrate harness isolation invariants.

### Out of Scope
- Production daemon/database mutation outside temp socket or in-memory fixtures.
- Package manifest or lockfile edits.
- Git commit creation.

### Files to Change
Implemented stress-test and phase-doc scope only.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/release-cleanup-new-surfaces-stress.vitest.ts | Added | Schema, gated flag, CLI front-door, and process-table stress coverage |
| .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts | Modified | Current schema canary aligned to schema 37 |
| .opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs | Modified | Slug-named scenario file lookup |
| implementation-summary.md, tasks.md, spec.md, plan.md | Modified | Completion and verification evidence reconciliation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R1 | Read before stress edits | Existing harness, suites, CLI shims, and changelogs are read before edits begin |
| R2 | Preserve isolation | Stress coverage uses in-memory fixtures or temp sockets and does not disrupt host daemons |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R3 | Add release-cleanup stress coverage | Schema v37, gated flags, and 37/8/9 CLI command surfaces are exercised additively |
| R4 | Verify stress and docs | Build, stress, schema, hygiene, alignment, and strict validation pass with evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Final stress suite passes after build with added coverage.
- Baseline-vs-after pass counts are recorded in implementation-summary.md.
- Host daemon isolation is asserted by process-table equality inside the CLI stress.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shipped schema/flag/CLI changelogs | Stress coverage could target the wrong surface | Read committed changelogs before edits |
| Risk | Host daemon disruption | Could affect active assistant MCP sessions | Use temp sockets, warm-only probes, and in-memory fixtures |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
