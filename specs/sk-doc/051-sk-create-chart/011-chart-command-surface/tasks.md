---
title: "Tasks: Chart Command Surface"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "chart command tasks"
  - "command surface tasks"
  - "routing refresh tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Chart Command Surface

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

- [x] T001 Read the two sibling routers and their assets, then the two newest ones, to separate the pattern from the subject (`.opencode/commands/create/diagram.md`, `.opencode/commands/create/diff.md`, `.opencode/commands/create/repo-rule.md`)
- [x] T002 Read the chart packet contract: `SKILL.md`, `references/catalog.md`, `references/template-contract.md`, `references/color-system.md` and the manual-testing playbook
- [x] T003 Sweep every surface the sibling command lands on, and grep each routing file rather than assuming (`grep -rl "create:diagram"`)
- [x] T004 [P] Capture a baseline for every gate the change touches, including the two already failing (`compiled-route-guard.cjs`, `validate-canary.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Author the presentation contract, which owns every user-visible word (`.opencode/commands/create/assets/create-chart-presentation.txt`)
- [x] T006 Author the seven-step autonomous workflow (`.opencode/commands/create/assets/create-chart-auto.yaml`)
- [x] T007 Derive the confirm workflow from it, adding a checkpoint per step and an interactive execution block (`.opencode/commands/create/assets/create-chart-confirm.yaml`)
- [x] T008 Author the thin router with the six canonical numbered sections (`.opencode/commands/create/chart.md`)
- [x] T009 Bind the command in the hub registry (`.opencode/skills/sk-doc/mode-registry.json`)
- [x] T010 Show that command in the hub mode table, and correct the stale form count in the same row (`.opencode/skills/sk-doc/SKILL.md`)
- [x] T011 Add the advisor-facing command entry with a diagram discriminator (`.opencode/skills/sk-doc/command-metadata.json`)
- [x] T012 [P] Write the runtime mirrors through their own sync scripts rather than by hand (`sync-runtime-mirrors.cjs`, `sync-prompts.cjs`)
- [x] T013 [P] Regenerate the advisor command-bridge projection and its two generated blocks (`derive-command-bridges.cjs`)
- [x] T014 Update the two test censuses the new declaration moves (`command-metadata-e2e.vitest.ts`, `test_emitted_name_contract.py` and its fixture)
- [x] T015 Correct the same stale form count and add the command to the hub README (`.opencode/skills/sk-doc/README.md`)
- [x] T016 Refresh the compiled-route manifest for the runtime root and the authored root
- [x] T017 Rebuild the canary and re-pin the three drifted source digests, deriving each hash independently before writing it
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Prove the command document is structurally valid (`validate_document.py --type command`, `check_authored_name_kebab.py`)
- [x] T019 Prove the hub is whole (`parent-skill-check.cjs .opencode/skills/sk-doc`)
- [x] T020 Prove routing was re-established (`compiled-route-sync.cjs --check` and `--verify`, `compiled-route-guard.cjs`, `validate-canary.cjs`)
- [x] T021 Probe the advisor with realistic chart prompts and compare against the baseline
- [x] T022 Re-run every test the change touches, and the chart corpus check to prove the packet was not disturbed
- [x] T023 Record the adjacent defects found and not fixed
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
- **Closure gate**: See `acceptance-criteria.md`
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

- [x] CHK-010 [P0] Code passes lint/format checks. `validate_document.py --type command` exits 0 with 0 issues, and `npm run typecheck` exits 0 over the advisor package
- [x] CHK-011 [P0] No console errors or warnings. `parent-skill-check.cjs` reports 0 warnings
- [x] CHK-012 [P1] Error handling implemented. The router stops on a missing asset, and the workflow carries six recovery paths
- [x] CHK-013 [P1] Code follows project patterns. The router matches the two newest sibling routers rather than the older one, which still carries the deprecated raw argument echo
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. See `acceptance-criteria.md`, 12 rows, all `Met`
- [x] CHK-021 [P0] Manual testing complete. Six advisor probes and one direct compiled-route lookup, before and after
- [x] CHK-022 [P1] Edge cases tested. The two prompts that abstain were probed at a lowered threshold to confirm they carry the right compiled route
- [x] CHK-023 [P1] Error scenarios validated. The corpus check was run under contention, failed, and was reproduced clean serially
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded. The missing command is `cross-consumer`: one declaration reaches eleven surfaces
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. `grep -rl "create:diagram"` over the repository excluding `specs/` enumerated every surface the sibling lands on
- [x] CHK-FIX-003 [P0] Consumer inventory completed. `grep -rn "command-metadata"` found the bridge derivation, its drift guard and the census test
- [x] CHK-FIX-004 [P0] Not applicable. No security, path, parser or redaction surface is touched
- [x] CHK-FIX-005 [P1] Matrix axes listed. Four runtime trees by one command, and two routing stages by one hub
- [x] CHK-FIX-006 [P1] Not applicable. No test or code path reads process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to observed command output captured in the session scratch directory, and to the working tree at `c2af3510d7` plus the changes listed in `spec.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Nothing in the change carries a credential
- [x] CHK-031 [P0] Input validation implemented. Three required fields, each with a hard stop and an explicit ban on inference
- [x] CHK-032 [P1] Auth/authz working correctly. `allowed-tools` names six tools and no MCP surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. No ephemeral artifact label appears in any comment
- [x] CHK-042 [P2] README updated. The hub README gained the command and lost a stale count
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Command output went to the session scratch directory, outside the repository
- [x] CHK-051 [P1] scratch/ cleaned before completion. The packet `scratch/` holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-04
<!-- /ANCHOR:summary -->

---
