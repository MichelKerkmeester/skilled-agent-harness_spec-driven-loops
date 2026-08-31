---
title: "Tasks: Phase 6: Command and Hub Wiring"
description: "Ordered tasks for making the mode reachable: baseline every registry, author the command through sk-create-command, add exactly one entry per registry matching each file own shape, mirror into the second runtime, then verify by parse, count delta, read-back and followed symlink."
trigger_phrases:
  - "registration tasks"
  - "command authoring"
  - "count delta check"
  - "symlink verification"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: Command and Hub Wiring

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

- [ ] T001 Record entry counts and md5s for all four registries
- [ ] T002 Read a sibling entry in each registry, so the new entry matches that file's shape rather than an imposed one
- [ ] T003 Confirm phases 3-5 are closed - registering an unfinished mode makes it reachable and wrong
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author `/create:repo-rule` through `sk-create-command`: router `.md` plus auto, confirm and presentation assets
- [ ] T005 Cover create, revise and retire in the argument hint, since the mode owns all three
- [ ] T006 Add the `mode-registry.json` entry with its tool surface and command binding
- [ ] T007 Add `hub-router.json` signals that separate this mode from `sk-create-skill`
- [ ] T008 Add the `command-metadata.json` entry: description, argument hint, user intent, three-step choreography, discriminator
- [ ] T009 Add the `leaf-manifest.json` mode entry
- [ ] T010 Create the `.claude/commands/create/repo-rule.md` mirror symlink
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Parse all four registries; any failure blocks, because the hub loads them for twelve other modes
- [ ] T012 Compare entry counts: exactly one new entry per registry, never zero, never two
- [ ] T013 Read each new entry back and inspect it, rather than trusting the write
- [ ] T014 Follow the mirror symlink to a real file
- [ ] T015 Confirm a rule-shaped request selects this mode rather than `sk-create-skill`
- [ ] T016 Run `validate.sh <this folder> --strict` and record `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The other twelve modes still route
- [ ] `scratch/` cleaned
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Command authoring mode**: `.opencode/skills/sk-doc/sk-create-command/`
- **The mode being registered**: `.opencode/skills/sk-doc/sk-create-repo-rule/`
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
- [ ] CHK-003 [P1] Predecessor phase closed and its outputs available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The command was authored through `sk-create-command`, not by hand
- [ ] CHK-011 [P0] Every registry parses after the edit
- [ ] CHK-012 [P1] Each entry matches its file's existing shape and ordering conventions
- [ ] CHK-013 [P1] The discriminator names when to prefer a sibling command
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Count delta is exactly one in every registry
- [ ] CHK-022 [P0] The mirror was followed, not merely observed to exist
- [ ] CHK-023 [P1] Routing checked against the likely confusion, `sk-create-skill`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

The defect class is a partial registration, which fails in a way that looks like a routing bug rather than a missing entry.

- [ ] CHK-FIX-001 [P0] Finding class recorded as `cross-consumer`: four files must agree or routing breaks
- [ ] CHK-FIX-002 [P0] Producer inventory: a sibling entry read in each of the four registries
- [ ] CHK-FIX-003 [P0] Consumer inventory: the hub loads all four for twelve other modes; each parsed after editing
- [ ] CHK-FIX-004 [P0] Not applicable - no security, path or parser surface in the entries themselves
- [ ] CHK-FIX-005 [P1] Matrix axes: 4 registries x (parses, count rose, entry readable)
- [ ] CHK-FIX-006 [P1] Not applicable - no process-wide state
- [ ] CHK-FIX-007 [P1] Evidence pinned to the landing commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets in the command or any registry entry
- [ ] CHK-031 [P0] The mode's declared tool surface matches what `SKILL.md` allows - no widening at registration
- [ ] CHK-032 [P1] The mirror symlink points inside the repository
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [ ] CHK-041 [P1] The argument hint documents create, revise and retire
- [ ] CHK-042 [P1] Parent Phase Documentation Map updated from Pending
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
| P0 Items | 12 | [ ]/12 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->

---



