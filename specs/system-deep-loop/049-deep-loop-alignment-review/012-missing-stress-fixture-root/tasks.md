---
title: "Tasks: Phase 12: missing-stress-fixture-root"
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
# Tasks: Phase 12: missing-stress-fixture-root

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

- [x] T001 Read the four files that name the missing fixture root and record exactly what each requires (`.opencode/skills/system-deep-loop/deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/`)
- [x] T002 Reproduce the setup failure before any edit and record the first failing require (`.opencode/skills/system-deep-loop/deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/setup-cp-sandbox.sh`)
- [x] T003 Locate the prune commit and list every path it removed (`.git`, commit `ebe7d6bb3c4`)
- [x] T004 Read the crosswalk to fix the current shapes and decide which trees the fixture carries (`.opencode/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md`)
- [x] T005 Check whether the roster, mirror-sync and generator checks can see nested fixture agents (`.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs`, `check-agent-mirror-sync.cjs`, `sync-agents.cjs`, `sync-agents-pi.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Restore

- [x] T006 Recover the pruned corpus bytes from history and record what the prune removed (`.opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/`)
- [x] T007 Create the fixture in the six current tree shapes, dropping the retired runtime (`.opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/`)
- [x] T008 Renumber the fixture's flaw markers and README to the live scenario IDs (`.opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/README.md`, `.opencode/agents/cp-improve-target.md`)
- [x] T009 Correct the repo-root walk in the setup script (`setup-cp-sandbox.sh`)
- [x] T010 Correct the required and copied fixture paths to the live surfaces (`setup-cp-sandbox.sh`)
- [x] T011 Provision the sandbox with the shared package the helper scripts resolve, plus its runtime dependency (`setup-cp-sandbox.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verify

- [x] T012 Run the corrected script and require exit 0 plus the created-sandbox message (`setup-cp-sandbox.sh --sandbox-dir /tmp/cp-proof-sandbox`)
- [x] T013 Inspect the sandbox: six target shapes present, symlinks preserved and resolving, contents equal to the fixture (`/tmp/cp-proof-sandbox`)
- [x] T014 Run the scenarios' pre-dispatch helper steps from the sandbox alone (`scan-integration.cjs`, `generate-profile.cjs`)
- [x] T015 Run the mirror-sync and roster checks and confirm the fixture is invisible (`check-agent-mirror-sync.cjs --all`, `agent-roster-mirror-check.cjs`)
- [x] T016 Confirm the pre-commit staged-path filter does not match a nested fixture agent path (`setup-cp-sandbox.sh` consumers)
- [x] T017 Run the comment-hygiene checker over the changed code surface (`check-comment-hygiene.sh`)
- [x] T018 Run the deep-loop runtime suite in the background and record the exit code (`npx vitest run --no-coverage`)
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
- [x] CHK-003 [P1] Dependencies identified and available (the pruned corpus in git history, the crosswalk)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n setup-cp-sandbox.sh` reports no syntax error
- [x] CHK-011 [P0] Comment-hygiene checker reports the setup script clean (exit 0)
- [x] CHK-012 [P1] The script fails closed when a required path is absent (every surface guarded by `require_path`)
- [x] CHK-013 [P1] No spec path, phase number, ADR, requirement or finding id embedded in a code comment
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The setup script exits 0 against the restored fixture
- [x] CHK-021 [P0] The sandbox runs the scenario-side helper steps (`scan-integration.cjs`, `generate-profile.cjs`)
- [x] CHK-022 [P1] The fixture is absent from the roster and mirror-sync populations (12 agents, no fixture entry)
- [x] CHK-023 [P1] The deep-loop runtime suite exits zero
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `missing-fixture-root` with adjacent path drift in the same consumer
- [x] CHK-FIX-002 [P0] Same-class producer inventory: every file naming `test-fixtures/060-stress-test` located (four files)
- [x] CHK-FIX-003 [P0] Consumer inventory: setup script, three scenario documents, playbook index anchors
- [x] CHK-FIX-004 [P0] Not a path/parser/redaction fix: the script's existing sandbox-dir validation is unchanged
- [x] CHK-FIX-005 [P1] Matrix: six runtime tree shapes, each verified present and correctly shaped
- [x] CHK-FIX-006 [P1] No process-wide state read; no hostile env variant applicable
- [x] CHK-FIX-007 [P1] Evidence pinned to the observed commands in `implementation-summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Sandbox path validation unchanged and still refuses paths outside `/tmp/`
- [x] CHK-032 [P1] The sandbox copies are read-only sources; no canonical mutation added
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Fixture README explains the corpus and its inertness
- [x] CHK-042 [P2] Scenario documents left untouched, with their stale cross-references recorded as adjacent findings
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files only under `/tmp/`
- [x] CHK-051 [P1] No scratch files inside the repository
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-09-16
<!-- /ANCHOR:summary -->
