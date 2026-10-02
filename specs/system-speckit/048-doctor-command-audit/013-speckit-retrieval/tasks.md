---
title: "Tasks: Phase 13: speckit-retrieval"
description: "Ordered audit tasks for the speckit-retrieval target: inventory, read-only run, verdict, applied fixes and the parity proof."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: speckit-retrieval

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
## Phase 1: Audit

- [x] T001 Read the route block, the workflow asset, the presentation and the router in full (`_routes.yaml`, `doctor-speckit-retrieval.yaml`, `doctor-speckit-presentation.txt`, `speckit.md`)
- [x] T002 Inventory every path, script, command, flag and environment variable the target names, each scored present, moved or missing with the command that showed it (`scratch/reality-check.md`)
- [x] T003 Run the lookup probes and the recipe read-only: 23 prompt-set lookups, the recipe with and without `--no-config`, and a nonexistent root (`scratch/doctor-run.log`)
- [x] T004 [P] Run the authoring-side probes: the index `paths` mtime walk, the phrase and anchor drift checks, `generate-trigger-index.mjs --check --json`, `sync-gate1-pointers.cjs --check` and the glob counts (`scratch/doctor-run.log`)
- [x] T005 Write the verdict and the minimal edits (`scratch/proposal.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Apply the fixes

- [x] T006 Remove the dead `--incremental` flag, its setup input, its field handling and its presentation prompt, and stop recommending an incremental regeneration (`_routes.yaml`, `doctor-speckit-retrieval.yaml`, `doctor-speckit-presentation.txt`)
- [x] T007 Remove the orphaned `--scope` prompt that read as this target's (`doctor-speckit-presentation.txt`)
- [x] T008 Correct the Claude path note: Claude reads the root AGENTS.md directly, not through a removed symlink (`doctor-speckit-retrieval.yaml`)
- [x] T009 Name only the phrase-quality classes the committed diagnostics can carry, and correct the recipe's glob count (`doctor-speckit-retrieval.yaml`)
- [x] T010 Fix the dead `doctor_*.yaml` pattern to `doctor-*.yaml` in the workflow, the router and the manifest (`doctor-speckit-retrieval.yaml`, `speckit.md`, `_routes.yaml`)
- [x] T011 Record the subsystem defects as findings instead of fixing them (`scratch/proposal.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Re-read the edited hunks and confirm every mismatch is gone: no `--incremental`, no `doctor_*`, no CLAUDE.md symlink claim, the correct glob count
- [x] T013 Run `bash .skilled/commands/doctor/scripts/route-validate.sh` and read the result: exit 0, 9 routes validated, 2 warnings, J1 parity pass
- [x] T014 Confirm the batch gates: YAML parses, the command-catalog mirror check reports OK, and the MCP mutation guard passes
- [x] T015 Close the phase docs: summary verdict, acceptance rows, goal log and spec status
- [x] T016 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase> --strict` and read `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every step of the workflow ran read-only on this checkout, and `route-validate.sh` exits 0
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

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 through REQ-004, with their acceptance rows in acceptance-criteria.md
- [x] CHK-002 [P0] Technical approach defined in plan.md §1, §3 and §4: audit read-only, then apply the smallest fix per mismatch
- [x] CHK-003 [P1] Dependencies identified in plan.md §6; Node v26.8.2, ripgrep 15.2.0 and the named scripts are all present
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No runtime code changed; `_routes.yaml` and the workflow asset load under `yaml.safe_load`, and the presentation stays plain text
- [x] CHK-011 [P0] Every probe's stderr was read; the only stderr output was the deliberate nonexistent-root test and the two informational validator warnings
- [x] CHK-012 [P1] The workflow's exit-class contract was re-proved: a missing index exits 2 with ENOENT, a clean no-hit exits 1, a hit exits 0
- [x] CHK-013 [P1] The edits keep the asset schema and the presentation's heading structure; `route-validate.sh` J1 enforces the shared pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 through AC-004 are Met in acceptance-criteria.md
- [x] CHK-021 [P0] The whole workflow ran read-only: 23 prompt-set lookups, the recipe with and without `--no-config`, the cold-lookup measurement and the parity gate
- [x] CHK-022 [P1] Edge cases tested: clean no-hit, missing index, nonexistent recipe root, and a dependency-free ambient-config comparison
- [x] CHK-023 [P1] Error scenarios validated: broken invocations exit 2 with stderr, distinct from a clean no-hit at exit 1
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every mismatch fixed here is an instance fix in the doctor assets; the optional staleness probe is an addition and stays a recorded finding
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed by grep: `--incremental` had no consumer, and the only surviving `doctor_*` hit is `doctor-update.yaml`, owned by the update redesign
- [x] CHK-FIX-003 [P0] Consumer inventory completed over the four edited files: no remaining reference to the removed input, flag or prompt
- [x] CHK-FIX-004 [P0] No security, path, parser or redaction behavior changed; the one path-shaped fix (the forbidden glob) was checked against the real 14-asset set with zero old-pattern matches
- [x] CHK-FIX-005 [P1] Matrix axes listed: present, moved, missing or stale claim; exit class 0, 1 or 2+; signal severity high, medium or low; every named item is scored in `scratch/reality-check.md` §1 to §4
- [x] CHK-FIX-006 [P1] The ambient-config variant ran the recipe with and without `--no-config`; `RIPGREP_CONFIG_PATH` is unset and no user rc file exists
- [x] CHK-FIX-007 [P1] The audit ran at HEAD `83616db9ba221a80d271b2b924b3a32664962ffd`; the fix evidence is the working-tree diff range named in the batch close-out
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the edits or in the run log; the changed text is documentation and YAML prose
- [x] CHK-031 [P0] Not applicable to the text edits; the workflow's own input validation was re-proved through the missing-index probe
- [x] CHK-032 [P1] Not applicable; the target reads local files, runs local scripts and declares `mcp_tools: []`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance criteria, summary and goal log synchronized at closure
- [x] CHK-041 [P1] No code comments added; the asset keeps its existing comments, including the surviving `index_regenerates_byte_identical` note
- [x] CHK-042 [P2] Not applicable: this phase edits doctor assets, not a README. The subsystem README defects are recorded as findings
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Every audit artifact lives in `scratch/`: `reality-check.md`, `doctor-run.log` and `proposal.md`
- [x] CHK-051 [P1] The temporary latency and lookup probe files were removed after the run; the three evidence files are kept
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



