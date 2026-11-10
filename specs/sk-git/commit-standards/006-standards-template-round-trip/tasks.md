---
title: "Tasks: Restore the round-trip of the shipped commit template rules block through the /doctor:git standards serializer"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "standards template round trip tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Restore the round-trip of the shipped commit template rules block through the /doctor:git standards serializer

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Record the parsed JSON of the commit rules block and the two failing tests as the baseline [EVIDENCE: rerun from the repository root. Parsed contract: `git show 6c2c3304d3^:.skilled/skills/sk-git/assets/commit-message-template.md | node --input-type=module -e 'import {extractContract} from "./.skilled/skills/sk-git/scripts/lib/message-contract.mjs"; let s=""; process.stdin.on("data",(d)=>{s+=d}).on("end",()=>{console.log(JSON.stringify(extractContract(s)))});' | shasum -a 256` prints `b36db201d1160df99bf11d528c6ec831afc231cd0909511f6744afde7eb29803`. Failing tests: `d=$(mktemp -d) && git archive 6c2c3304d3^ .skilled/commands/doctor/scripts .skilled/skills/sk-git .skilled/scripts/git-hooks | tar -x -C "$d" && git -C "$d" init -q && (cd "$d" && node --test .skilled/commands/doctor/scripts/tests/git-standards.test.cjs)` reports tests 10, pass 8, fail 2, the two failures being "the shipped rules blocks round-trip through the layout serializer" and "set changes only the edited line and the gates enforce the new value"]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Split the `commitId` line into the serializer layout (`.skilled/skills/sk-git/assets/commit-message-template.md`) [EVIDENCE: diff shows one line replaced by six]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T003 Compare the parsed JSON before and after, and run `validate-message.mjs` on a message with a valid and a `0000000` Commit-Id [EVIDENCE: parsed JSON identical: the T001 command run against `6c2c3304d3` instead of `6c2c3304d3^` prints the same sha256 `b36db201d1160df99bf11d528c6ec831afc231cd0909511f6744afde7eb29803`, and the T001 archive command against `6c2c3304d3` reports tests 10, pass 10, fail 0. Commit-Id 1234567 exit 0, 0000000 exit 1, --check-template exit 0]
- [x] T004 Run `git-standards.test.cjs` and `run-all.sh` [EVIDENCE: git-standards.test.cjs 10 of 10, run-all.sh exit 0 with 7 of 7 suites]
- [x] T005 Read the hook-trust sentinel as a note in the gate-inputs checker, with a test case (`.github/scripts/check-gate-inputs.sh`) [EVIDENCE: check-gate-inputs.sh RESULT: PASSED with failures=0, its tests 49 of 49, and the new case fails against the old checker]
- [x] T006 Clear the HVR hard blockers in the five docs [EVIDENCE: hvr_scan.py reports 0 hard blockers in all five docs]
- [x] T007 Extend the ai-tool-hooks check to all six adapters, with tests (`git-setup-check.cjs`) [EVIDENCE: git-setup-check.test.cjs 11 of 11, the six-adapter test fails 2 cases against the old function, and this checkout reports all six adapters registered]
- [x] T008 Run DOC-384 through a real AI runtime and record the verdict [EVIDENCE: DOC-384 PASS in a live Claude Code run of /doctor:git setup: 11 PASS rows, exit 0, --json 11 complete rows, --tool nope exit 2, git status and local config unchanged. Recorded here by operator choice instead of a benchmark report folder]
- [x] T009 Fresh Opus 5.5 medium review of the 033 and 034 work, and fix what it confirms [EVIDENCE: fresh Opus 5.5 medium review returned 9 findings (3 P1, 6 P2). P1 #1 reproduced by hand: the planted gpg.program ran once. All 9 fixed in T010 to T017]
- [x] T010 Review fix: helper git calls cannot run a program from the inspected repo's config (`log.showSignature` with `gpg.program`) [EVIDENCE: gpg.program test passes, fails with the fix reverted]
- [x] T011 Review fix: hooks PASS when each hook resolves into the repo's own hook sources or this checkout's, with a matching repair [EVIDENCE: hooks test passes, fails reverted. Applying the printed repair to a fresh repo turned FAIL into PASS]
- [x] T012 Review fix: the install repair restores missing sk-git files [EVIDENCE: install repair test passes, fails reverted]
- [x] T013 Review fix: the gate-inputs sentinel rule strips only the sentinel, so other paths in the segment still resolve [EVIDENCE: gate-inputs suite 50 of 50, the beside-the-sentinel case fails reverted]
- [x] T014 Review fix: trust reads `skilled.trustRepoHooks` with `--bool` [EVIDENCE: trust yes test passes, fails reverted]
- [x] T015 Review fix: allowlist and worktree base resolve against the main worktree, as the helpers do [EVIDENCE: linked-worktree test passes, fails reverted]
- [x] T016 Review fix: ai-tool-hooks reads registrations from the parsed hooks section and from `.claude/settings.local.json` [EVIDENCE: deny-rule and settings.local.json test passes, fails reverted]
- [x] T017 Review fix: the no-exec test covers the `gpg.program` vector without masking markers [EVIDENCE: the fsmonitor assertion now states it guards a future index-refreshing query, and the gpg test covers today's helper path]
- [x] T018 Name `setup` in the root README command reference (`README.md`) [EVIDENCE: README.md command entry reads <hooks|standards|setup> with a setup bullet]
- [x] T019 Add DOC-384 to the spec-kit playbook's doctor cross-reference [EVIDENCE: the spec-kit doctor README names DOC-384]
- [x] T020 Point sk-git's `SKILL.md` at `/doctor:git` and its three targets [EVIDENCE: SKILL.md section "Repository Settings: /doctor:git" before the lifecycle map]
- [x] T021 Add a `/doctor:git` feature entry to the sk-git feature catalog [EVIDENCE: feature file workflow-playbooks/doctor-git-settings.md and its catalog entry, leaf manifest regenerated (14 of 14), 0 new HVR blockers]
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



