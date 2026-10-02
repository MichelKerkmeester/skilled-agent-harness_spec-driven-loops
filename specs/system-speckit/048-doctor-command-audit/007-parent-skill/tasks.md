---
title: "Tasks: Phase 7: parent-skill"
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
# Tasks: Phase 7: parent-skill

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

- [x] T001 Confirm the worktree and keep one read-only run of both route-declared commands plus the route validator (`scratch/doctor-run.log`). Evidence: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` → `checked=14 passed=14 failed=0 fixed=0`, exit 0; `node .skilled/commands/doctor/scripts/parent-skill-check.cjs ".skilled/skills/system-deep-loop"` → "OK: parent-skill-check — all hard invariants passed, 0 warnings", exit 0; `bash .skilled/commands/doctor/scripts/route-validate.sh` → exit 0, 10 routes, 2 warnings. No `--fix` flag was used.
- [x] T002 Read the router, the route entry, the workflow YAML, the checker and the presentation with line-numbered source reads (`scratch/reality-check.md`). Evidence: every claim in the inventory carries a line citation; the workflow's older contract and the checker's current checks are compared at `reality-check.md:7` and `:70`.
- [x] T003 [P] Probe every path, script, command, flag and environment variable the route and workflow name (`scratch/reality-check.md`). Evidence: all route assets, declared scripts and named reference paths are present; `PARENT_HUB_CHECK_STRICT` is read by the checker while the workflow described only a checks 5-9 override; no MCP tool and no advisor CLI command is declared.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the verdict and the target behavior (`scratch/proposal.md`). Evidence: verdict `fix` — keep the route and align four things: the workflow invariant, the phase-0 gate order, the checker's documentation and the presentation row.
- [x] T005 Update the workflow invariant in `.skilled/commands/doctor/assets/doctor-parent-skill.yaml`. Evidence: `packetKind` now includes `transport`, nested `description.json` is prohibited alongside `graph-metadata.json`, the fidelity list names the leaf-manifest, root-metadata, router and version checks, and the strict override reads advisory-only.
- [x] T006 Align `phase_0_audit` and `upstream_assets` with the route's first script. Evidence: `root_metadata_gate` is named, phase 0 runs it with no `--fix` before the per-hub audit even when it reports findings, and both exit codes are captured and mapped to one status.
- [x] T007 [P] Update the checker's description and runtime label (`.skilled/commands/doctor/scripts/parent-skill-check.cjs`). Evidence: the usage note says the override covers advisory findings, the header lists the manifest, root-metadata, router and version checks, and the runtime label reads "Advisory findings: FAIL. Hard failures always FAIL."
- [x] T008 [P] Expand the `parent-skill` row in `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`. Evidence: the row now reads "Audit parent-skill structure, routing manifests, root metadata, router contract, and version consistency."
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Parse the workflow YAML and syntax-check the checker. Evidence: `python3 yaml.safe_load` → `YAML_OK`; `node --check .skilled/commands/doctor/scripts/parent-skill-check.cjs` → `NODE_SYNTAX_OK`.
- [x] T010 Rerun the fleet gate and the parent audit after the edit. Evidence: fleet gate exit 0, `checked=14 passed=14 failed=0 fixed=0`; parent audit exit 0, "all hard invariants passed, 0 warnings".
- [x] T011 Rerun `bash .skilled/commands/doctor/scripts/route-validate.sh`. Evidence: exit 0, "OK: route-validate — 9 routes validated, 2 warnings"; J1 parity PASS. The recorded run shows the pre-batch count of 10 routes at `scratch/doctor-run.log:102`.
- [x] T012 Run the batch gates over the shared doctor assets. Evidence: `python3 yaml.safe_load` over every doctor asset YAML and `_routes.yaml` → `YAML_OK`; `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` → `STATUS=OK`, exit 0; `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` → `GUARD PASS`.
- [x] T013 Record the verdict, decisions and remaining findings. Evidence: `implementation-summary.md` states "Verdict: fix", lists the three changed files, five key decisions and the recorded findings and limitations.
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

- [x] CHK-001 [P0] Requirements documented in spec.md — the four requirements and the two success criteria are written and each acceptance row maps to one of them
- [x] CHK-002 [P0] Technical approach defined in plan.md — the audit-then-apply plan, the affected surfaces and the testing strategy
- [x] CHK-003 [P1] Dependencies identified and available — the worktree is provisioned; both doctor scripts, the route validator and the audited hub are present and every named path resolves
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --check` on the checker → `NODE_SYNTAX_OK`; `python3 yaml.safe_load` on the workflow → `YAML_OK`
- [x] CHK-011 [P0] No console errors or warnings — the fleet gate and parent audit print only INFO/PASS lines and exit 0; `route-validate.sh` exits 0 with two informational duplicate-flag warnings
- [x] CHK-012 [P1] Error handling implemented — the workflow maps exit 0 to OK, exit 1 to FAIL and exit 2 to ERROR for both checks, and a missing target is the exit 2 path
- [x] CHK-013 [P1] Code follows project patterns — the edits keep the checker's existing check/result shape and the workflow's established YAML structure; no ephemeral ids were added to code comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — every row in `acceptance-criteria.md` is `Met`
- [x] CHK-021 [P0] Manual testing complete — one read-only run of both route commands plus the route validator was recorded, and the fleet gate, parent audit and route validator were rerun after the change
- [x] CHK-022 [P1] Edge cases tested — the strict default and the `PARENT_HUB_CHECK_STRICT=0` advisory path are distinguished in the workflow; an unset variable leaves the run in the strict default (`printenv` exited 1), which is the path the recorded run shows
- [x] CHK-023 [P1] Error scenarios validated — the workflow documents exit 2 as ERROR for a missing target and exit 1 as FAIL; the run exercised the exit 0 path
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class — the fix is `cross-consumer` (workflow, checker documentation and presentation describe one contract) and `matrix/evidence` for the docs; the subsystem findings are `instance-only` and none were observed
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — `scratch/reality-check.md` inventories both producers (the fleet gate and the parent checker), and the route already lists both in order
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — the presentation row, the router table and the route manifest were checked; `route-validate.sh` I1/J1 pass, exit 0
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests — N/A: this fix is descriptive text in an audit contract; no security, path, parser or redaction behavior changed, and the checker remains read-only
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — check scope × exit-code path × severity mode; the run covered the exit 0 path for both checks, and the other paths are the documented mappings
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — `PARENT_HUB_CHECK_STRICT` is process-wide and was unset (`printenv` exit 1), so the run exercised the strict default; the advisory override is documented and was not silently enabled
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — the tree is uncommitted by instruction; evidence is pinned to the enumerated working-tree diff and the recorded command output
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the doctor reads no credentials and the run log holds none
- [x] CHK-031 [P0] Input validation implemented — the workflow requires an existing directory for `parent_skill_dir`, and the checker exits 2 when the target is missing or unreadable
- [x] CHK-032 [P1] Auth/authz working correctly — N/A; the command has no auth or authz surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — `spec.md` status Complete, this task list fully ticked, `acceptance-criteria.md` all `Met`
- [x] CHK-041 [P1] Code comments adequate — the checker comments describe the advisory override and the check set; no ephemeral spec or packet ids were added
- [x] CHK-042 [P2] README updated (if applicable) — the shared presentation row for `parent-skill` is updated; no other README details this target's check list
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — the audit artifacts (`reality-check.md`, `doctor-run.log`, `proposal.md`) live in `scratch/`; no other temp files were created
- [x] CHK-051 [P1] scratch/ cleaned before completion — the three audit artifacts are kept as this phase's evidence, not deleted
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



