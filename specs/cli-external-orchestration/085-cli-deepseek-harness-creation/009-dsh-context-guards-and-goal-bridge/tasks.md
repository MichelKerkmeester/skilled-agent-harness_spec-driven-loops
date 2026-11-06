---
title: "Tasks: Phase 9: dsh-context-guards-and-goal-bridge"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh context guards and goal bridge tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: dsh-context-guards-and-goal-bridge

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

`G` is `.dsh/plugins/repo-guards/`. `GP` is `.dsh/patches/guards.patch.yml`. Authoring mode for every code task is `sk-code` `sk-code-skilled`. Executor for T004 to T010 is `cli-codex gpt-6-luna xhigh fast`. The orchestrating Claude session runs setup, verification and the docs.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the phase 008 bundle test baseline (`G`). Verify: `node --test` over `G` exits 0 and the pass count is saved to `scratch/baseline.txt`.
  - Open: `scratch/baseline.txt` does not exist, so no baseline count was saved from the phase 008 state. The current suite count is in `008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt`.
- [x] T002 Build a fixture packet with frontmatter and a durable slice (`G` test fixtures). Verify: `node .skilled/hooks/goal/bin/goal.cjs packet <fixture> --workspace "$PWD" | grep -c '^chat_slice='` prints 1. Evidence: `.dsh/plugins/repo-guards/tests/repo-guards.test.mjs:420`, `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt`.
- [ ] T003 [P] Read the Pi bindings for the nine context and git guards and note each seam (`.pi/extensions/`). Verify: `scratch/seam-map.md` lists nine guards.
  - Open: `scratch/seam-map.md` does not exist.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the `goal-context` adapter that injects only the `chat_slice` (`G`). Verify: the REQ-001 test passes and the injected text has no `_memory:` line. Evidence: `.dsh/plugins/repo-guards/adapters/goal-context.mjs`, `.dsh/plugins/repo-guards/tests/repo-guards.test.mjs:420`, `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt`.
- [x] T005 Write the `session-start-context` adapter on `agent/created` (`G`). Verify: the REQ-002 test passes. Evidence: `.dsh/plugins/repo-guards/adapters/session-start-context.mjs`, `.dsh/plugins/repo-guards/tests/repo-guards.test.mjs:497`, `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt`.
  - The test stubs the session-prime core. It proves injection and call arguments, not parity with the Pi extension (see AC-002).
- [ ] T006 [P] Write `prompt-advisor` on `agent/pre-step` and switch it off in `.dsh/patches/lineage.patch.yml`. Verify: `--dump-config` with the lineage patch shows the adapter disabled.
  - Open: the adapter exists and its default-off test passes (line 544), but the switch is `promptAdvisor: false` in `.dsh/patches/guards.patch.yml`, not in the lineage patch. No dump-config record exists. The deviation is in `goal.md` section 4.
- [ ] T007 [P] Write `session-compact-context` on `compaction/summary` with a fixture test, or record it deferred with its reason (`G`, `.dsh/SYNC.md`). Verify: the restore test passes, or `rg -n 'session-compact-context.*deferred' .dsh/SYNC.md` matches.
  - Open: no restore test exists, and `.dsh/SYNC.md` lacks the deferral reason. The reason is in `.dsh/plugins/repo-guards/README.md` section 7.
- [ ] T008 [P] Write `git-message-gate` and `git-preflight-advisory` on `bash` git calls, or record each deferred (`G`). Verify: the message-contract fixture cases pass for the gate if shipped.
  - Open: both adapters ship and their bundle cases pass. The gate is tested on two messages, while the 38 contract cases pass on their own (`evidence/message-contract-run.txt`) and are not run through the gate.
- [ ] T009 [P] Write `session-stop-context`, `session-start-advisories` and `decision-capture`, or record each deferred with its reason (`G`, `.dsh/SYNC.md`). Verify: each has a passing test or a deferral line.
  - Open: all three reasons are in `.dsh/plugins/repo-guards/README.md` section 7, not `.dsh/SYNC.md` as required.
- [ ] T010 Add rows for every shipped adapter (`GP`). Verify: `--dump-config` with `GP` lists each shipped adapter.
  - Open: `guards.patch.yml` holds one bundle row, and the adapters register inside `index.mjs`. No dump-config listing is recorded.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Rerun the bundle suite (`G`). Verify: `node --test` over `G` exits 0 and the phase 008 cases match `scratch/baseline.txt`.
  - Open: the suite exits 0 with 37 pass and 0 fail at the 08:19 snapshot, but `scratch/baseline.txt` does not exist, so the phase 008 comparison cannot run.
- [ ] T012 Rerun the phase 008 keyless boot with the extended `GP`. Verify: exit 1, `MISSING_CREDENTIAL` and `grep -c -i 'plugin\|startup-'` on stderr prints 0.
  - Open: not rerun. dsh was not run in this closeout. The recorded run (`evidence/keyless-guards-boot.txt`, 07:53) predates the adapter edits at 08:02 to 08:18.
- [ ] T013 Update the packet's `references/guards-and-hooks.md` and `.dsh/SYNC.md` (`sk-doc` for the reference). Verify: `rg -n 'goal-context' .dsh/SYNC.md .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md` matches both.
  - Open: `guards-and-hooks.md` names `goal-context`, but `.dsh/SYNC.md` does not. SYNC.md also names none of the four deferrals with reasons.
- [x] T014 Validate the phase folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`. Evidence: `tasks.md:74` records the final strict run, which printed `RESULT: PASSED` with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no task row marked `[B]`.
- [ ] Manual verification passed: every optional adapter is shipped with a test or named as deferred with a reason
  - Open: the README names all four deferrals with reasons, but `.dsh/SYNC.md` does not (AC-006).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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

An optional adapter that cannot reach its seam on a fixture is deferred, not blocked, and its reason goes in `.dsh/SYNC.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md`.
- [ ] CHK-003 [P1] Dependencies identified and available: phase 008 is complete
  - Open: phase 008 is not closed. Its AC-001 and AC-005 are unmet.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The new adapters pass the `sk-code-skilled` lint and format checks
  - Open: no lint or format run is recorded for these adapters.
- [ ] CHK-011 [P0] The keyless boot stderr holds no warning other than `MISSING_CREDENTIAL`
  - Open: the recorded stderr is clean, but the run predates the current bundle (T012).
- [x] CHK-012 [P1] Context adapters log and continue when their core throws. Evidence: `.dsh/plugins/repo-guards/adapters/goal-context.mjs`, `.dsh/plugins/repo-guards/adapters/session-start-context.mjs`, `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt`.
- [x] CHK-013 [P1] Adapters import shared cores and copy no goal or git logic. Evidence: `.dsh/plugins/repo-guards/adapters/`, `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
  - Open: AC-002, AC-003, AC-005 and AC-006 remain unmet. AC-004 is met by the bundle README deferral record, but the stricter SYNC.md task remains open. See `acceptance-criteria.md`.
- [x] CHK-021 [P0] The goal slice equality test passes. Evidence: `.dsh/plugins/repo-guards/tests/repo-guards.test.mjs:420`, `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt`.
- [ ] CHK-022 [P1] Edge cases tested: no bound packet and an unreadable `goal.md`
  - Open: no test covers either edge case. The goal core test only covers a core that throws.
- [x] CHK-023 [P1] The phase 008 safety cases still pass. Evidence: `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase builds new behavior and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Injected context carries no frontmatter, env value or key. Evidence: `.dsh/plugins/repo-guards/tests/repo-guards.test.mjs:420`, `.dsh/plugins/repo-guards/adapters/goal-context.mjs`.
- [x] CHK-031 [P0] No context adapter blocks a tool call. Evidence: `.dsh/plugins/repo-guards/adapters/goal-context.mjs`, `.dsh/plugins/repo-guards/adapters/session-start-context.mjs`, `.dsh/plugins/repo-guards/adapters/prompt-advisor.mjs`, `.dsh/plugins/repo-guards/adapters/git-preflight-advisory.mjs`.
- [x] CHK-032 [P1] Auth and authz: N/A, the adapters hold no credential and grant nothing. Evidence: `.dsh/plugins/repo-guards/adapters/`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same required pair and optional set. Evidence: `spec.md`, `plan.md`, `tasks.md`.
- [x] CHK-041 [P1] Code comments carry the durable reason and no ephemeral label. Evidence: `.dsh/plugins/repo-guards/`, `../008-dsh-repo-guards-safety-wave/implementation-summary.md` (label-scan result).
- [ ] CHK-042 [P2] `.dsh/SYNC.md` names every deferral with its reason
  - Open: `.dsh/SYNC.md` does not name all four deferrals with reasons. The README does.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: `ls -la scratch/` showed only the placeholder `scratch/.gitkeep`.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `ls -la scratch/` showed only the placeholder `scratch/.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 5/8 |
| P1 Items | 10 | 8/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-06 (closeout pass, bundle snapshot 08:19). Open items are listed above and in `implementation-summary.md`.
<!-- /ANCHOR:summary -->

---
