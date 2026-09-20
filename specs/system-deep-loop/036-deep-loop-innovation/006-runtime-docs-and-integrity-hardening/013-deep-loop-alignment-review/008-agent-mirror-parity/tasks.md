---
title: "Tasks: Phase 8: agent-mirror-parity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: agent-mirror-parity

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Measure the six agent trees: file shapes, rosters, READMEs and dialects (`.opencode/agents`, `.claude/agents`, `.cursor/agents`, `.pi/agents`, `.codex/agents`, `.devin/agents`)
- [x] T002 Measure the deny-half treatments and verify the `.pi` `# Unmapped` rule against `PERMISSION_TOOL_MAP` in `sync-agents-pi.cjs`
- [x] T003 Confirm the hash-equal leaf-set collision on `system-deep-loop` (agent-improvement vs model-benchmark) and `sk-doc` (sk-create-skill vs sk-create-skill-parent)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `modeLeafSetDigest` and `findCollidingModeLeafSets` to the leaf-resource contract (`.opencode/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs`)
- [x] T005 Teach the generator optional per-mode leaf scopes and refuse two modes that receive the same leaf set (`.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`)
- [x] T006 Author the two scope files and regenerate both manifests (`.opencode/skills/system-deep-loop/leaf-scopes.json`, `.opencode/skills/sk-doc/leaf-scopes.json`, both `leaf-manifest.json`)
- [x] T007 Teach the router-contract reachability check that a leaf belongs to the mode that declares it inside a shared packet (`.opencode/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs`)
- [x] T008 Cover the new helpers and the generator scopes; index the new test file (`.opencode/skills/sk-doc/sk-create-skill/scripts/tests/`)
- [x] T009 Write the six-tree translation crosswalk (`.opencode/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md`)
- [x] T010 Point both agent READMEs at the crosswalk and state the manual-invocation model drift (`.opencode/agents/README.txt`, `.claude/agents/README.txt`); index it in the packet README
- [x] T011 Remove the `budgetProfile`/`edgeCases` demand from both authored bodies and regenerate the two derived trees (`.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`, then both sync scripts)
- [x] T012 Normalize `.claude/agents/deep-review.md` path references to its own tier, matching its eleven siblings (`.claude/agents/deep-review.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the mirror gates: both generators' `--check` modes, the body/tool-surface check and the roster check
- [x] T014 Run the leaf gates: manifest freshness across all thirteen manifests, router-contract reachability for both touched hubs, skill-root metadata and derived freshness
- [x] T015 Run the deep-loop runtime suite (`cd .opencode/skills/system-deep-loop/runtime && npx vitest run --no-coverage`)
- [x] T016 Record the evidence, the pre-existing conditions observed and the one measurement the review got wrong (below)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Observations Outside This Packet

| Observation | Why it is not repaired here |
|-------------|-----------------------------|
| `skill-root-metadata-contract.test.cjs` fails on `testFleetDiscoveryUsesTheAuthoredMarker`: it still expects the retired `sk-design-md-generator` hub | The retirement belongs to the `sk-design` track; this packet touches no skill-discovery surface |
| `node .opencode/bin/compiled-route-guard.cjs` reports `system-deep-loop` as `stale-manifest` | No routing input of that hub changed in this packet; the staleness predates it and its cause is a compiler-side change from another track |
| The vendored `barter/ai-speckit/coder/` agent copy still carries the `budgetProfile`/`edgeCases` demand | It is not one of the six runtime trees |

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - the touched scripts run under Node with no lint config of their own; both generators and every gate exit 0
- [x] CHK-011 [P0] No console errors or warnings - gate output inspected for each run
- [x] CHK-012 [P1] Error handling implemented - every new refusal is a named error code with its own fixture
- [x] CHK-013 [P1] Code follows project patterns - errors are `ContractError` codes, tests are self-running Node scripts
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete - six-tree facts re-measured against the generators before the crosswalk was written
- [x] CHK-022 [P1] Edge cases tested - single-file scope, absent scope, orphan mode, missing target and the colliding pair
- [x] CHK-023 [P1] Error scenarios validated - every refusal path has a fixture asserting its error code
- [x] CHK-024 [P0] Spec-folder strict validation passed - `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/008-agent-mirror-parity --strict` reports `RESULT: PASSED`, 0 errors, 0 warnings, 8/8 acceptance criteria carrying evidence
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding has a class: generator multiplexing (`class-of-bug`), router reachability (`cross-consumer`), agent-body demand (`cross-consumer`), documentation gap (`instance-only` per tree)
- [x] CHK-FIX-002 [P0] Same-class producer inventory done: every hub with a `mode-registry.json` was re-checked for hash-equal mode leaf sets; only the two hubs had one
- [x] CHK-FIX-003 [P0] Consumer inventory done: generator, freshness gate, router contract, parent-skill gate, both agent READMEs, both generators
- [x] CHK-FIX-004 [P0] Path/refusal fixes carry adversarial cases: absolute scope, traversal, outside-root, missing target, orphan mode, colliding pair
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion (hub x mode x scope shape)
- [x] CHK-FIX-006 [P1] Hostile env variant considered: the scoping file is optional, so a hub without it is the no-scope variant and stays byte-identical
- [x] CHK-FIX-007 [P1] Evidence is pinned to file:line in `acceptance-criteria.md` and to command output in `implementation-summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented - scope normalisation refuses absolute, traversing and outside-root paths
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable; no auth surface is touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate - new comments state the durable why and cite no packet identifiers
- [x] CHK-042 [P2] README updated - both agent READMEs, the packet README and the tests README
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - fixtures are built in `mkdtempSync` directories
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-15
<!-- /ANCHOR:summary -->
