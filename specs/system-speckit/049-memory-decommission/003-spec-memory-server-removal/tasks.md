---
title: "Tasks: Phase 3: spec-memory-server-removal"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "spec memory server removal"
  - "mcp server deletion"
  - "daemon removal"
  - "preserve set"
  - "task breakdown"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: spec-memory-server-removal

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 Confirm phase 002's residue sweep returns empty before any deletion starts
- [ ] T002 Capture the baseline: advisor embedder resolves, `validate.sh --strict` passes on an existing packet, all five runtimes boot clean
- [ ] T003 [P] Write down the preserve-set inventory so the closing audit has a before state to compare against (`spec.md` section 3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Four stage commits, one per worklist item. Each stage is gated by its seam checks in Phase 5 and by
the advisor embedder proof in T028. The file-level steps live in Phase 4.

- [ ] T004 Stage 1 commit: the server tree and its package wiring (W1, detail T011-T013)
- [ ] T005 Stage 2 commit: launchers, plugin and hooks (W2, detail T014-T016)
- [ ] T006 Stage 3 commit: registrations, grants, env rows and routes (W3, detail T017-T020)
- [ ] T007 Stage 4 commit: catalogs, playbooks and install entries, plus the preserve-set guard (W4, detail T021-T022)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the closing residue sweep from the final state and read it by owner, not by count (`plan.md` section 3)
- [ ] T009 Audit the preserve set positively: each item is present and working, not merely unmatched
- [ ] T010 Sweep the documentation so no surviving doc describes the removed tools as available
<!-- /ANCHOR:phase-3 -->

---

## Phase 4: Deletion Worklist

One group per worklist item in `spec.md` section 3.

### W1: The server tree, as one unit

- [ ] T011 Delete `.opencode/skills/system-spec-kit/mcp-server/` in a single move
- [ ] T012 Remove its npm workspace entry and its `bin` and `scripts` entries
- [ ] T013 Remove the server-only lock and package entries the workspace left behind, then confirm the scripts package still builds

### W2: Launchers, plugin and hooks

- [ ] T014 Delete `.opencode/bin/system-spec-memory-launcher.cjs` and `.opencode/bin/spec-memory.cjs`
- [ ] T015 Strip the memory allowlists from `.opencode/bin/lib/launcher-session-proxy.cjs`, keeping the proxy itself for the advisor launcher
- [ ] T016 Delete `.opencode/plugins/system-spec-memory.js`, the memory hook adapters under `.opencode/hooks/spec-memory/` and the memory-only plugin tests and playbooks

### W3: Registrations, grants, env rows and routes

- [ ] T017 Remove the `system-spec-memory` registration and its tool grants from all five runtime roots: `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.pi/mcp.json` and `opencode.json`
- [ ] T018 Remove the server-only rows from `.env.example` and `ENV-REFERENCE.md`, keeping every flag whose owner is the advisor, the shared model server or the shared IPC layer
- [ ] T019 Remove the install and catalog entries, then regenerate one artifact and confirm it emits no removed tool name
- [ ] T020 Remove the launcher leases, the orphan and session cleanup branches and the obsolete memory routes

### W4: Preserve, do not sweep

- [ ] T021 Re-read every deletion in stages 1 to 3 against the preserve set and revert any line whose owner survives
- [ ] T022 Confirm each mixed row was closed by a source-level edit rather than a token deletion, a line drop or a search and replace

---

## Phase 5: Seam Checks

One task per break-risk seam in `spec.md` section 6. Each runs before the stage that touches it, and
its verification is the pass condition, not the edit itself.

- [ ] T023 Seam 1, `scripts/core/workflow.ts:101-106,605-640`: replace the `@spec-kit/mcp-server/api/indexing` import and the daemon-lease detection with source-owned behavior. Verify by building the scripts package with the tree absent and running `validate.sh --strict` on an existing packet
- [ ] T024 Seam 2, `scripts/deploy-mcp.sh:49-82` plus `.opencode/scripts/orphan-mcp-sweeper.sh:204-212,296-301,409-434,504-515` plus `.opencode/scripts/session-cleanup.sh:102-113`: split the memory branch out of each script. Verify by running a cleanup pass and confirming the advisor socket survives and no memory daemon is stranded
- [ ] T025 Seam 3, `shared/embeddings/adapter.ts:4-13` plus `shared/embeddings/providers/hf-local.ts:32-35,371-382` plus `shared/ipc/socket-server.ts:134,187,202-203`: remove the memory-only DB branches and keep the shared model-server socket. Verify with T028
- [ ] T026 Seam 4, `.opencode/commands/deep/assets/deep-research-auto.yaml:1757-1782,2339-2347` plus `system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts:55-87`: remove the MCP persistence and keep the loop state machine. Verify that deep-loop locks, projections and reducer state still work and the surviving tests pass
- [ ] T027 Seam 5, `.opencode/install-guides/install-scripts/install-all.sh:5-34,209-223` plus `.opencode/commands/create/assets/create-skill-auto.yaml` plus `system-spec-kit/templates/addons/resource-map.md.tmpl:21-48`: update each producer before deleting the artifacts it generated. Verify by regenerating one artifact per producer and finding no removed tool name in it

---

## Phase 6: Runtime Proof

- [ ] T028 Prove the advisor embedder resolves after removal: make a live skill-advisor call and confirm it returns a scored recommendation over the shared socket with no memory process running. This is the standing gate that every stage repeats
- [ ] T029 Boot each of the five runtimes cold and confirm all four negatives per runtime: no connection attempt, no timeout notice, no launcher lock directory and no orphan process

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Inventory source**: `specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/research/lineages/luna-max/research.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Feature flag configured (if applicable)
- [ ] CHK-122 [P1] Monitoring/alerting configured
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed
- [ ] CHK-133 [P2] Data handling compliant with requirements
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable)
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Name] | Technical Lead | [ ] Approved | |
| [Name] | Product Owner | [ ] Approved | |
| [Name] | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
