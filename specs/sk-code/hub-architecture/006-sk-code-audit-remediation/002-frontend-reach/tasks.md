---
title: "Tasks: Phase 2: frontend-reach"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "frontend reach tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: frontend-reach

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Run every command from the repository root. A path with no folder in front of it, such as `findings-ledger.md` or `scratch/`, is inside `specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/` in phase 001 and inside this phase folder elsewhere.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load the hub routing rule before any registry edit (`.skilled/repo-rules/skill-hub-routing.md`). Verify: `ls .skilled/repo-rules/skill-hub-routing.md` prints the path.
- [ ] T002 Read how the registry compiler treats a second `specific` surface (`.skilled/bin/compiled-route-sync.cjs`). Verify: `node .skilled/bin/compiled-route-sync.cjs --check` exits 0 before any edit.
- [ ] T003 Confirm the baseline exists (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/router-baseline.txt`). Verify: `grep -c '"action"'` on that file prints 22.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `surfaceDetection` block with label `FRONTEND`, role `specific` and the file markers (`.skilled/skills/sk-code/mode-registry.json`). Verify: `node -e "const m=require('./.skilled/skills/sk-code/mode-registry.json').modes.find(x=>x.workflowMode==='sk-code-frontend');console.log(m.surfaceDetection.role)"` prints `specific`.
- [ ] T005 Rework `code-frontend-aliases` and `code-frontend-visual` with the probe phrases and no single-word keyword (`.skilled/skills/sk-code/hub-router.json`). Verify: the count script in `plan.md` section 5 prints 0.
- [ ] T006 Add a class that scores review requests naming accessibility, a stylesheet or a UI component for the frontend surface (`.skilled/skills/sk-code/hub-router.json`). Verify: the `review` probe returns two targets.
- [ ] T007 Mirror the vocabulary in the hub `INTENT_SIGNALS` and correct the section 11 sentence (`.skilled/skills/sk-code/ROUTER.md`). Verify: `rg -c 'surfaces that stack detection does not select' .skilled/skills/sk-code/ROUTER.md` prints nothing and exits 1.
- [ ] T008 Mirror the vocabulary in the packet router (`.skilled/skills/sk-code/sk-code-frontend/ROUTER.md`). Verify: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints PASS for the router-sync leg.
- [ ] T009 Bring the registry aliases and the hub wording in line (`.skilled/skills/sk-code/mode-registry.json`, `.skilled/skills/sk-code/SKILL.md`). Verify: `rg -c 'bundled from request vocabulary alone' .skilled/skills/sk-code/SKILL.md` prints nothing and exits 1.
- [ ] T010 Document the frontend markers in the detection order (`.skilled/skills/sk-code/shared/references/stack-detection.md`). Verify: `rg -c 'FRONTEND' .skilled/skills/sk-code/shared/references/stack-detection.md` prints a number above 0.
- [ ] T011 Add the three probe scenario files (`.skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/`). Verify: the playbook package validator exits 0.
- [ ] T012 Regenerate the compiled route (`.skilled/bin/compiled-route-sync.cjs`). Verify: `node .skilled/bin/compiled-route-sync.cjs --check` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Replay the probes (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/probes.txt`). Verify: the replay script in `plan.md` section 5 prints `frontend 13/13`, `review 1/1` and `negative 0/8`.
- [ ] T014 Compare non-frontend first targets with the baseline (`scratch/router-baseline.txt`). Verify: the comparison prints 0 changed lines.
- [ ] T015 Run the hub gates (`.skilled/commands/doctor/scripts/sk-code-setup-check.cjs`). Verify: the `guard`, `sync` and `parent-skill` lines print PASS.
- [ ] T016 Record the fix evidence for rows `F1` to `F4` (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| F[1-4] .*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [ ] T017 Validate the phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/002-frontend-reach --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The probe replay prints `frontend 13/13`, `review 1/1` and `negative 0/8`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Findings ledger**: See `../001-finding-verification/findings-ledger.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Every requirement in `spec.md` section 4 names a command and its expected output
- [ ] CHK-002 [P0] `plan.md` section 3 names the files this phase changes
- [ ] CHK-003 [P1] The predecessor phase's handoff criteria are met
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every changed JSON file parses with `node -e "require('./<file>')"`
- [ ] CHK-011 [P0] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints no new failing leg against the phase 001 baseline
- [ ] CHK-012 [P1] No changed file outside the Files to Change table appears in `git diff --stat`
- [ ] CHK-013 [P1] Changed documents keep their frontmatter and section order
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] CHK-021 [P0] The probe replay prints `frontend 13/13`, `review 1/1` and `negative 0/8`
- [ ] CHK-022 [P1] Each edge case in `spec.md` was run and its result is in the `goal.md` log
- [ ] CHK-023 [P1] The failure path in `spec.md` was triggered once on purpose and behaved as written
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each ledger row this phase owns has a verdict before its task starts
- [ ] CHK-FIX-002 [P0] Each fixed statement was searched for across the hub with `rg`, and every copy found was fixed or listed
- [ ] CHK-FIX-003 [P0] The consumers in `plan.md` Affected Surfaces were checked and each row's verification ran
- [ ] CHK-FIX-004 [P1] The ledger's last column names the command that proves each fix
- [ ] CHK-FIX-005 [P1] Fix evidence is pinned to a commit SHA, not a branch name
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No changed file holds a credential or an environment value
- [ ] CHK-031 [P1] N/A: this phase changes no input handling, authentication or authorization path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same files and the same gate command
- [ ] CHK-041 [P1] No code comment added in this phase carries a spec path, a task id or a finding id
- [ ] CHK-042 [P2] The packet or hub release note names the ledger rows this phase closed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working files live in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` holds only files a later phase reads
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 10 | 0/10 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified. Planning date 2026-11-14.
<!-- /ANCHOR:summary -->

---



