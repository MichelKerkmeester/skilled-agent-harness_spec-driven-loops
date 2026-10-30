---
title: "Tasks: /doctor:helper"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "doctor helper tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: /doctor:helper

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

**Variables.** `D` is `.skilled/commands/doctor`. `M` is `D/scripts/doctor-helper-match.cjs`. `F` is `D/scripts/tests/fixtures/doctor-helper`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the baseline counts into `scratch/baseline.txt` (`scratch/`). Verify: it names the route count, the node:test file count and the deriver's `doctorRoutes` number.
- [ ] T002 Run the setup-list contract check once against the current tree (`D/scripts/tests`). Verify: the run either passes or names the command whose row is missing.
- [ ] T003 Write both suites and freeze the held-out set, then commit them before the matcher exists (`D/scripts/tests`). Verify: `node --test D/scripts/tests/doctor-helper-match.test.cjs` exits non-zero on `Cannot find module`.
- [ ] T004 Pin the held-out file's sha256 in the suite (`D/scripts/tests/doctor-helper-match.test.cjs`). Verify: `shasum -a 256 F/heldout.jsonl` matches the constant in the suite.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement the tokenizer and the id and runnable derivation (`M`). Verify: `node --test D/scripts/tests/doctor-helper-match.test.cjs` reports the tokenizer and derivation cases passing.
- [ ] T006 Implement skipping for the helper's own route and local-only names (`M`). Verify: the skip case passes and no output byte contains the local prefix.
- [ ] T007 Implement scoring, the floor, the tie-break and the renderers (`M`). Verify: `node M -- "my pre-commit hook keeps rejecting my commit"` exits 0 with `1) /doctor:git hooks` first.
- [ ] T008 Tune the floor and the weights against the tune set only (`M`, `F/tune.jsonl`). Verify: the held-out case passes with top-1 at least 0.80.
- [ ] T009 Add the vocabulary phrases the misses named (`D/_routes.yaml`). Verify: `node D/scripts/doctor-phrase-reach.cjs` exits 0.
- [ ] T010 Add the helper route and the header router list entry (`D/_routes.yaml`). Verify: `bash D/scripts/route-validate.sh` exits 0.
- [ ] T011 Author the router, the workflow and the presentation from the command templates (`D/helper.md`, `D/assets/doctor-helper.yaml`, `D/assets/doctor-helper-presentation.txt`). Verify: `node --test D/scripts/tests/doctor-helper-contract.test.cjs` reports the router and workflow cases passing.
- [ ] T012 Add the setup row and the command contract entry (`D/assets/doctor-setup-presentation.txt`, `command-contract.json`). Verify: the contract suite passes and `generate-command-routers.cjs --check` exits 0.
- [ ] T013 Regenerate the advisor blocks and apply or record the bridge decision (`derive-command-bridges.cjs`, `scoring-compatibility.json`). Verify: the deriver prints `"status": "fresh"` and the advisor doctor vitest suites pass.
- [ ] T014 Regenerate the mirrors and the three prompt stub sets. Verify: each `--check` exits 0.
- [ ] T015 Correct the two named drifts (`command-contract.json`, `README.md`). Verify: `generate-command-routers.cjs --check` prints zero path drift and the root README doctor count matches the router count.
- [ ] T016 Add the docs rows: commands README, script README, feature catalog, the two playbook scenarios and the changelogs. Verify: `node D/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Run the family runner (`D/scripts/tests`). Verify: `bash D/scripts/tests/run-all.sh` ends `0 failed`.
- [ ] T018 Rerun every baseline command (`scratch/baseline.txt`). Verify: each prints its pass line with the re-measured count, not the pre-work absolute.
- [ ] T019 Confirm the change list (`git status --porcelain`). Verify: it names no file outside `spec.md` section 3 and no local-only path.
- [ ] T020 Run the packet gate (`specs/agents/021-doctor-agents-md/002-doctor-helper`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/002-doctor-helper --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The bridge decision and the re-measured counts are recorded in `implementation-summary.md`
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

- [ ] CHK-001 [P0] `/doctor:sk-skill` is on the start branch. Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit.
- [ ] CHK-002 [P0] The baseline counts are recorded. Verify: `rg -c 'doctorRoutes' scratch/baseline.txt` prints at least `1`.
- [ ] CHK-003 [P1] The held-out set is frozen before tuning. Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/heldout.jsonl` prints a commit older than the matcher's.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The matcher parses. Verify: `node --check .skilled/commands/doctor/scripts/doctor-helper-match.cjs` exits 0.
- [ ] CHK-011 [P0] The module exports both functions behind a main guard. Verify: `node -e "const m=require('./.skilled/commands/doctor/scripts/doctor-helper-match.cjs'); console.log(typeof m.loadEntries, typeof m.rankProblem)"` prints `function function`.
- [ ] CHK-012 [P1] No code comment carries a packet, phase or task id. Verify: `rg -n 'AC-[0-9]{3}|REQ-[0-9]{3}|specs/' .skilled/commands/doctor/scripts/doctor-helper-match.cjs` prints nothing.
- [ ] CHK-013 [P1] The matcher starts no daemon and writes nothing. Verify: the suite's no-write case passes and `rg -n 'spawn|exec' .skilled/commands/doctor/scripts/doctor-helper-match.cjs` prints nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`.
- [ ] CHK-021 [P0] Both suites pass. Verify: both `node --test` commands report `fail 0`.
- [ ] CHK-022 [P1] The held-out bar is printed. Verify: the suite prints top-1, top-3 and negatives figures.
- [ ] CHK-023 [P1] Self-recall covers every manifest phrase. Verify: `node D/scripts/doctor-helper-match.cjs --table --json` lists an entry for every router.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No local-only name appears in any output. Verify: `node D/scripts/doctor-helper-match.cjs --table --json | grep -c 'local-'` prints `0`.
- [ ] CHK-031 [P0] The helper never emits a flag. Verify: the suite's flag case passes and the presentation names no flag.
- [ ] CHK-032 [P1] No hardcoded secret. Verify: `rg -ni 'api[_-]?key|token|secret|password' .skilled/commands/doctor/scripts/doctor-helper-match.cjs` prints nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] The catalog row matches the router. Verify: `node D/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK`.
- [ ] CHK-041 [P1] The root README count matches the router count. Verify: the number in the doctor section equals `ls .skilled/commands/doctor/*.md | wc -l`.
- [ ] CHK-042 [P2] The playbook registry names both new scenarios. Verify: `rg -c 'doctor-helper' .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` prints at least `2`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Fixtures live under the tests tree. Verify: `ls .skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/` prints both set files.
- [ ] CHK-051 [P1] No temporary file survives. Verify: `git status --porcelain` lists no path under a temporary directory.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
