---
title: "Tasks: Phase 14: doctor-env"
description: "The ordered work for the doctor-env phase: build the three command assets, wire them into the doctor family, then verify with the recorded run and the checks."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 14: doctor-env

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

- [x] T001 Read the sibling doctor routers and fix the six-section router shape this command follows (`.skilled/commands/doctor/mcp.md`)
- [x] T002 Read the sk-create-command family contract for the doctor entry the new command must join (`.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`)
- [x] T003 Confirm both table shapes, the section 5 GIT-HOOK MARKER rows and the counts in the live switch reference (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build the thin router: frontmatter, six canonical sections, argument hint and asset loading (`.skilled/commands/doctor/env.md`)
- [x] T005 Write the workflow asset: run-time parse of both table shapes, secret and per-invocation classification, read-only source inspection, preference preview, confirmation gate and final status (`.skilled/commands/doctor/assets/doctor-env.yaml`)
- [x] T006 Write the presentation asset that owns every prompt, table, preview, error and status string (`.skilled/commands/doctor/assets/doctor-env-presentation.txt`)
- [x] T007 Create the Claude command symlink to the router (`.claude/commands/doctor/env.md`)
- [x] T008 Update the doctor family catalog: README count and row, and the family contract entry (`.skilled/commands/README.txt`, `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`)
- [x] T009 Generate the runtime mirrors for Codex, Pi, Hermes and Cursor (`.codex/prompts/doctor-env.md`, `.pi/prompts/doctor-env.md`, `.hermes/prompts/doctor-env.md`, `.cursor/commands/doctor-env.md`)
- [x] T010 Apply the review fixes: source git-hook marker examples, concrete next-step text, token-threshold classification, comment placement and escaped README pipes (`.skilled/commands/doctor/assets/doctor-env.yaml`, `.skilled/commands/doctor/env.md`, `.skilled/commands/README.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Validate the router document and its authored name (`validate_document.py env.md --type command`, `check_authored_name_kebab.py`)
- [x] T012 Run the catalog and route checks (`command-catalog-mirror-check.cjs`, `route-validate.sh`)
- [x] T013 Confirm the symlink target and the runtime mirror sync (`ls -l .claude/commands/doctor/env.md`, prompt and mirror sync `--check`)
- [x] T014 Run and record the phase run: live inventory, added-row copy, dry run and one confirmed write to a disposable copy (`scratch/doctor-env-run.md`)
- [x] T015 Close the packet docs with the observed evidence (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `goal.md`)
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

- [x] CHK-010 [P0] Code passes lint/format checks (document validation returned VALID, 0 issues, and the authored-name check passed)
- [x] CHK-011 [P0] No console errors or warnings (every check exited 0 and the catalog mirror check printed STATUS=OK)
- [x] CHK-012 [P1] Error handling implemented (unknown flags, multiple selectors and extra positional arguments are rejected by the router contract)
- [x] CHK-013 [P1] Code follows project patterns (the router and its two owned assets follow the sk-create-command split used by the sibling doctor commands)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete (one run recorded in `scratch/doctor-env-run.md`)
- [x] CHK-022 [P1] Edge cases tested (an added reference row parsed without a command edit, a dry run wrote nothing, and a confirmed write to a disposable copy changed one line)
- [x] CHK-023 [P1] Class-specific paths validated (no secret value was shown or written and the per-invocation switch appeared only in its one-command form)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each review finding was fixed in place or recorded with its reason (three fixes applied, and the stale reference count recorded and left unfixed)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed (the 158 names were checked against the credential name segments, and none matched)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed surfaces (the catalog, route and mirror consumers were re-checked after the edits)
- [x] CHK-FIX-004 [P0] Adversarial cases covered (a token-count threshold classified as a preference, the source hook's `=1` marker form verified, and a dry run left no file)
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion (classification by destination by mode, with 17 sections and 14 per-invocation rows)
- [x] CHK-FIX-006 [P1] Hostile global-state variant executed (the confirmed write pointed the reader at a disposable copy through `HOOK_FLAGS_CONFIG`)
- [x] CHK-FIX-007 [P1] Evidence pinned to the built artifacts in this worktree, before any commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (the assets hold no values and the reference has no credential row)
- [x] CHK-031 [P0] Input validation implemented (the router rejects unknown flags, multiple selectors and extra positional arguments)
- [x] CHK-032 [P1] Writes stay inside the approved destinations (only `hook-flags.env` or the Claude settings env block, only after an explicit yes, and never `.env` or a shell profile)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Comments adequate (the skill_agent marker sits under the frontmatter as in the sibling routers)
- [x] CHK-042 [P2] README updated (doctor count 3 to 4 and the Environment Switches row)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (the run record and the disposable copy lived under `scratch/`)
- [x] CHK-051 [P1] The run record is kept in `scratch/` as the phase evidence
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02
<!-- /ANCHOR:summary -->

---
