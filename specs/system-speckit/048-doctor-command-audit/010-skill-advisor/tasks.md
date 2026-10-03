---
title: "Tasks: Phase 10: skill-advisor"
description: "The ordered work for the skill-advisor audit: inventory the route and workflow against the checkout, apply the fix verdict to the workflow, route and presentation, then verify and close the packet."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: skill-advisor

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

- [x] T001 Read the route entry, the workflow asset and the router text, and list every path, script, command, flag and assertion they name (`.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`)
- [x] T002 Verify each named item against the checkout and record it with the command that showed it (`scratch/reality-check.md`)
- [x] T003 Run the workflow read-only, stopping at every write, and keep the output (`scratch/doctor-run.log`)
- [x] T004 Decide the verdict from the recorded evidence and write the repairs (`scratch/proposal.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Move the workflow's four removed-namespace call sites to the CLI front door (`node .skilled/bin/skill-advisor.cjs ...`) (`.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`)
- [x] T006 Replace the `.skills` reads with the phase-0 skill listing and the CLI skill graph inventory (`.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`)
- [x] T007 Give every declared route command its required arguments: `advisor_recommend --prompt`, `advisor_validate --confirm-heavy-run`, `advisor_rebuild --trusted`, `skill_graph_scan --trusted`, `skill_graph_query --queryType` (`.skilled/commands/doctor/_routes.yaml`)
- [x] T008 Correct gate 3 to name the two author-lane files and declare `mcp_tools: []` on the route (`.skilled/commands/doctor/_routes.yaml`)
- [x] T009 Fix the rollback build command to `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` (`.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`)
- [x] T010 Split the proposal boost range into token `[0.0, 1.0]` and phrase `[-1.0, 2.0]` (`.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`)
- [x] T011 Correct the phase 0 assertions: trigger phrases from graph metadata, the real repo manifests, and named sources for `skill_count` and `graph_health` (`.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`)
- [x] T012 Replace `{packet_scratch}` with `<packet_scratch>` and drop the incorrect gitignored claim (`.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`)
- [x] T013 Add the labelled skill-advisor scope prompt and relabel the retrieval prompt in the presentation (`.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`)
- [x] T014 Add the read-context comment over the mutation boundary so the other lanes read as context (`.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run the route validator and confirm exit 0 (`bash .skilled/commands/doctor/scripts/route-validate.sh`)
- [x] T016 Parse every edited YAML and confirm no removed namespace remains (`python3 yaml.safe_load`, `rg 'system_skill_advisor\.'`)
- [x] T017 Run the family's remaining checks: catalog mirror, mutation-class guard and doctor script tests (`.skilled/commands/doctor/scripts/`)
- [x] T018 Close the packet docs from the observed evidence (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `goal.md`)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (three P0 requirements and one P1 requirement, each with an acceptance row)
- [x] CHK-002 [P0] Technical approach defined in plan.md (audit first, then apply the fix verdict to the workflow, route and presentation)
- [x] CHK-003 [P1] Dependencies identified and available (the worktree, the route validator, the CLI and the graph metadata are all present)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (every edited YAML parses with `yaml.safe_load` and `route-validate.sh` exits 0)
- [x] CHK-011 [P0] No console errors or warnings (the catalog mirror check returns STATUS=OK and the mutation-class guard returns GUARD PASS)
- [x] CHK-012 [P1] Error handling implemented (the workflow keeps its retryable exit 75 handling for an absent daemon and its exit 64 argument guards)
- [x] CHK-013 [P1] Code follows project patterns (the workflow keeps the family's phase structure and the route keeps the manifest shape every sibling route uses)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (every row in `acceptance-criteria.md` is Met)
- [x] CHK-021 [P0] Manual testing complete (one read-only pass recorded in `scratch/doctor-run.log`)
- [x] CHK-022 [P1] Edge cases tested (a warm-only probe against `tcp://127.0.0.1:9` exits 75 without spawning a daemon, a query without `--queryType` exits 64, and the skill inventory resolves against the phase-0 listing)
- [x] CHK-023 [P1] Error scenarios validated (the skipped-step table in `scratch/doctor-run.log` names every step not run and why)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class (the transport drift was fixed at all call sites as one class, the five incomplete command lines as one class, and each subsystem defect is recorded as a finding)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed (`rg` for `system_skill_advisor.` over the edited doctor files returns no matches)
- [x] CHK-FIX-003 [P0] Consumer inventory completed (the route, workflow, router and presentation consumers were re-checked and `route-validate.sh` J1 parity passes)
- [x] CHK-FIX-004 [P0] Adversarial cases covered for the changed behavior (the daemon-absent exit 75 path, the warm-socket precedence and the tree-walk inventory were each exercised or recorded; no delimiter, redaction or outside-root code changed)
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion (addressing surface by drift class; the reality-check rows cover every cell)
- [x] CHK-FIX-006 [P1] Hostile global-state variant executed (`SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:9` proved the retryable path without spawning a daemon or touching the live socket)
- [x] CHK-FIX-007 [P1] Evidence pinned to the reviewed working-tree diff in this worktree, before any commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (no secret value appears in the assets, the route or the run log)
- [x] CHK-031 [P0] Input validation implemented (the route's declared commands now carry their required arguments and the workflow's target validator is unchanged)
- [x] CHK-032 [P1] Trust gates respected (the mutating `advisor_rebuild` and `skill_graph_scan` lines declare `--trusted`, and the read-only run launched neither)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (the three docs were closed from the same recorded evidence)
- [x] CHK-041 [P1] Comments adequate (the workflow's read-context comment and the route's `mcp_tools` comment explain why, with no ephemeral ids)
- [x] CHK-042 [P2] Adjacent docs refreshed in the shared batch (`README.md`, `.skilled/commands/speckit/README.txt`, the manual-testing-playbook doctor README)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (`reality-check.md`, `doctor-run.log` and `proposal.md` live under the packet's `scratch/`)
- [x] CHK-051 [P1] The scratch evidence is kept as the phase record rather than deleted
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



