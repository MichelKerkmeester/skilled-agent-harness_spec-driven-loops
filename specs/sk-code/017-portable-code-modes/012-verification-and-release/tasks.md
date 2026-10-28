---
title: "Tasks: Phase 12: verification-and-release"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "verification and release tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: verification-and-release

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

`E` is this packet's `scratch/e2e`. `F` is `/Users/michelkerkmeester/worktrees/public/.scratch-dc90/fixtures`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the six scenario files for their fixtures, steps and pass criteria. Verify: `rg --files .skilled/skills/sk-code | rg 'disabled-hygiene-rules|floor-override-refused|almost-no-inline-comments|comment-every-function|foreign-repository-profile'` prints six paths, exit 0.
- [x] T002 Confirm the starting state: no quality config yet, and the CI profile already inside the skill folder. Verify: `node .skilled/commands/doctor/scripts/ci-report.cjs --no-gh --json` reads `"path": ".skilled/skills/sk-code/sk-code-ci/repository/ci.json"` and `"workflowCount": 32`.
- [x] T003 Create the fixture root outside the worktree. Verify: `ls -d $F` prints the path.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the two quality-gate scenarios and record them (`$E/CQ-012.md`, `$E/CQ-013.md`). Verify: `sed -n '201p' $E/CQ-012.md` and `sed -n '197p' $E/CQ-013.md` both print `VERDICT: PASS`.
- [x] T005 Run the three review scenarios through the devin executor and record them (`$E/CR-029.md`, `$E/CR-030.md`, `$E/CR-031.md`). Verify: `sed -n '207p' $E/CR-029.md`, `sed -n '219p' $E/CR-030.md` and `sed -n '313p' $E/CR-031.md` all print `VERDICT: PASS`.
- [x] T006 Run the CI foreign-repository scenario and record it (`$E/ci-foreign-repository-profile.md`). Verify: `sed -n '295p' $E/ci-foreign-repository-profile.md` prints `VERDICT: PASS`.
- [x] T007 Copy the identity helper into the CI fixture (`.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/foreign-repository/foreign-repository-profile.md`). Verify: `rg -n 'repository-identity' .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook` prints line 80, the `cp` line.
- [x] T008 Write this repository's quality config (`.skilled/skills/sk-code/sk-code-quality/repository/quality.json`). Verify: `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs status` prints `Trust: trusted`, `Errors: none` and `STATUS=OK SOURCE="repo" TRUST=trusted`, exit 0.
- [x] T009 Write the framework changelog and restore the tagged wording (`.skilled/changelog/skilled/v4.0.0.17.md`, `v4.0.0.16.md`). Verify: `sed -n '35p' .skilled/changelog/skilled/v4.0.0.17.md` prints `## Settings in Skill Folders`, and `sed -n '39p' .skilled/changelog/skilled/v4.0.0.16.md` still names `.sk-code/quality.json`.
- [x] T010 Write the three skill changelogs and step the carriers (`.skilled/skills/sk-code/changelog/v3.9.17.0.md`, `sk-code-ci/changelog/v1.1.9.0.md`, `sk-code-quality/changelog/v1.13.11.0.md`, the `SKILL.md`, `description.json`, `hub-router.json` and `mode-registry.json` files, and the `.hermes` copies). Verify: `rg -n '^version: (3\.9\.17\.0|1\.1\.9\.0|1\.13\.11\.0)$'` over the three `SKILL.md` files prints three lines.
- [x] T011 Re-mint the sk-code compiled route and refresh the skill graph (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`). Verify: `node .skilled/bin/compiled-route-guard.cjs --json` reads `"failures": 0`, exit 0; `node .skilled/bin/compiled-route-sync.cjs --check` reads `all 55 served copies match their authored files`, exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the in-repository checks and record them (`scratch/in-repo.txt`). Verify: `rg -n 'exit 0' scratch/in-repo.txt` prints every check line, and `sed -n '9p'` reads `sk-code setup battery: STATUS=OK legs=9, exit 0`.
- [x] T013 Confirm the six verdicts. Verify: `rg -c 'VERDICT: PASS' $E/*.md` prints one hit in each of the six files.
- [x] T014 Validate the packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/017-portable-code-modes/012-verification-and-release --strict` prints `RESULT: PASSED`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The six scenarios end `VERDICT: PASS` and the in-repository checks exit 0
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-008 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `devin` ran three reviews, and `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs status` exits 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed file parses. Evidence: `node -e 'JSON.parse(require("fs").readFileSync(".skilled/skills/sk-code/sk-code-quality/repository/quality.json","utf8"))'` prints `quality.json parses`, exit 0; `bash -n` over the shell block that opens at `foreign-repository-profile.md:71` exits 0.
- [x] CHK-011 [P0] No new warnings in the recorded output. Evidence: the six files record no warning line, and `scratch/in-repo.txt` carries `exit 0` on every check.
- [x] CHK-012 [P1] Error handling: a scenario that fails its pass criteria ends `VERDICT: FAIL` rather than passing quietly, and CR-031 records a first attempt that failed the report contract. Evidence: `scratch/e2e/CR-031.md:20` and `:23`.
- [x] CHK-013 [P1] The recorded files follow the playbook's section order and name no spec id. Evidence: each file opens with its scenario path and deviations, and `rg -n 'REQ-|ADR-|CHK-|T[0-9]{3}' scratch/e2e` finds nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] Each behavior the phase changed has a case: the fixture copy, the quality config read, the two quality-gate scenarios, the three review scenarios and the CI scenario. Evidence: T004 to T008.
- [x] CHK-022 [P1] Edge cases: a stale fixture is rebuilt first, an unscaffolded executor run is recorded, and the longest scenario is the one with three layers. Evidence: `scratch/e2e/CR-031.md:34`, `:23` and `:313`.
- [x] CHK-023 [P1] Every fixture lives under `.scratch-dc90/fixtures/`; `scratch/` holds only the six records, `in-repo.txt` and `.gitkeep`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: the missing helper in the copied fixture is `instance-only`, because the playbook omitted one file and no other fixture copies `ci-profile.cjs`.
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -n 'repository-identity' .skilled/skills/sk-code .skilled/commands/doctor` names the helper, its loader and this one fixture copy.
- [x] CHK-FIX-003 [P0] Consumers: the copied `ci-profile.cjs` is the only consumer, and it is copied unchanged.
- [x] CHK-FIX-004 [P0] N/A: the fix adds one `cp` line to a fixture build and changes no path, parser or redaction logic, so no adversarial table applies.
- [x] CHK-FIX-005 [P1] Matrix: six scenarios across three modes, each run once from its own fixture.
- [x] CHK-FIX-006 [P1] Hostile state: a first run with no skill on the executor's path produced prose both checkers refused, and the rerun with the symlink passed. Evidence: `scratch/e2e/CR-031.md:20`.
- [x] CHK-FIX-007 [P1] Evidence is against this worktree at `b2f730caf7` plus the uncommitted changes in `worktrees/255-portable-modes-verification-release`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; every fixture holds synthetic code and the recorded runs name no credential.
- [x] CHK-031 [P0] Every live run stayed inside a throwaway fixture under `.scratch-dc90/fixtures/`, and its recorded command names the permission mode it used. Evidence: `scratch/e2e/CR-029.md:14` and `scratch/e2e/CR-031.md:14`.
- [x] CHK-032 [P1] N/A: no auth surface beyond the operator's own checkout.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files and commands.
- [x] CHK-041 [P1] N/A: the phase adds no code comment; the fixture line it adds sits beside the other `cp` lines.
- [x] CHK-042 [P2] Four changelog entries written and the carriers stepped.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Every fixture lived under `.scratch-dc90/fixtures/`; no scenario wrote a tracked file.
- [x] CHK-051 [P1] `scratch/` holds the six records, `in-repo.txt` and `.gitkeep`; no fixture tree was left behind.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->

---
