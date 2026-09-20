---
title: "Tasks: routing doctrine and discovery vocabulary"
description: "Task breakdown for one always-loaded policy per hub and the discovery-vocabulary prune."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: routing doctrine and discovery vocabulary

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
## Phase 1: Measure

- [x] T001 Measure the live compiled policy for all five graduated hubs and record whether any carries `defaultResource` (`.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`)
- [x] T002 Read the compiled-policy schema for the field and confirm `additionalProperties: false` (`.opencode/bin/lib/compiled-routing/003-contract-schemas/schemas/compiled-policy.v1.schema.json`)
- [x] T003 Trace the field through every hub compiler and record which read it (`.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/*/lib/registry-compiler.cjs`)
- [x] T004 Find the live consumer of each hub's fallback expression (`.opencode/skills/*/SKILL.md`)
- [x] T005 Locate the existing cross-artifact check and record its scope (`.opencode/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs`)
- [x] T006 Read all six hubs' two artifacts and classify each against the three shapes (`.opencode/skills/*/hub-router.json`, `.opencode/skills/*/ROUTER.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Declare the fallback-only semantics and contract on the four hubs that lacked the key (`.opencode/skills/{system-deep-loop,sk-code,sk-doc,cli-external-orchestration}/hub-router.json`)
- [x] T008 Name the preamble as the other concept in the same key where a hub carries both (`.opencode/skills/sk-code/hub-router.json`)
- [x] T009 Confirm `sk-design` legitimately declares no preamble rather than listing resources that never load (`.opencode/skills/sk-design/hub-router.json`)
- [x] T010 Remove the six retired families from the keyword block (`.opencode/skills/system-deep-loop/SKILL.md`)
- [x] T011 Remove the two retired discovery terms from trigger phrases and key topics (`.opencode/skills/system-deep-loop/graph-metadata.json`)
- [x] T012 Verify each retired term names nothing in the registry, the command metadata, or the router vocabulary (`.opencode/skills/system-deep-loop/mode-registry.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Re-mint and Verify

- [x] T013 Re-mint the four hubs whose inputs changed, through the shipped refresh API (`.opencode/bin/lib/compiled-route-manifest.cjs`)
- [x] T014 Mirror both manifest copies byte-identically (`specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/*/manifest.json`)
- [x] T015 Run the compiled-route guard and require exit 0 with five hubs fresh (`node .opencode/bin/compiled-route-guard.cjs`)
- [x] T016 Run the root-metadata gate and require 13/13 (`node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`)
- [x] T017 Run the root-router contract fixtures (`node .opencode/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs`)
- [x] T018 Run the deep-loop runtime suite in the background and record its exit code (`npx vitest run --no-coverage`)
- [x] T019 Reproduce the one failing root-metadata case at baseline and record it as pre-existing (`node .opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`)
- [x] T020 Recompile the three command contracts the `SKILL.md` digest edit staled (`.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`)
- [x] T021 Re-run the full runtime suite from the repaired state and confirm it exits zero (`npx vitest run --no-coverage`)
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
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every edited JSON parses
- [x] CHK-011 [P0] No comment carries a spec path, phase number, or finding id
- [x] CHK-012 [P1] Every added key is precedented in the fleet rather than invented
- [x] CHK-013 [P1] The edit follows the existing artifact shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Guard exits 0 with five hubs fresh
- [x] CHK-022 [P1] Root-metadata gate passes 13/13
- [x] CHK-023 [P1] The one failing case is proven pre-existing at baseline
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug` — the contradiction was fleet-wide, not hub-local
- [x] CHK-FIX-002 [P0] Same-class producer inventory: all six hubs carrying both artifacts read
- [x] CHK-FIX-003 [P0] Consumer inventory: every `defaultResource` reader in the tree traced
- [x] CHK-FIX-004 [P0] Not applicable — no path, parser, or redaction logic changed
- [x] CHK-FIX-005 [P1] Matrix axes listed: six hubs by two artifacts, every row resolved
- [x] CHK-FIX-006 [P1] Not applicable — the changed files read no process-wide state
- [x] CHK-FIX-007 [P1] Evidence pinned to the working tree at the recorded HEAD
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Not applicable — no input validation surface changed
- [x] CHK-032 [P1] Not applicable — no auth surface changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, and acceptance criteria synchronized
- [x] CHK-041 [P1] Added comments carry the durable why and nothing ephemeral
- [x] CHK-042 [P2] No README change earned
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary output kept out of the packet
- [x] CHK-051 [P1] No scratch file left behind
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-16
<!-- /ANCHOR:summary -->
