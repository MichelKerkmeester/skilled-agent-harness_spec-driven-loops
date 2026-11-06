---
title: "Tasks: Phase 10: dsh-mcp-code-mode"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh mcp code mode tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: dsh-mcp-code-mode

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

`MP` is `.dsh/patches/mcp-code-mode.patch.yml`. `EC` is `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`. Authoring mode for every code task is `sk-code` `sk-code-skilled`. Executor for T003 to T006 is `cli-codex gpt-6-luna xhigh fast`. The orchestrating Claude session runs setup, verification and the docs.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Save the launcher PID baseline (`scratch/pids-before.txt`). Verify: `pgrep -f mcp-code-mode-launcher | sort > scratch/pids-before.txt` exits 0.
  - Open: `scratch/pids-before.txt` is missing. The baseline is recorded inside `evidence/keyless-mcp-boot.txt` instead.
- [ ] T002 [P] Capture the executor unit baseline (`EC` tests). Verify: the runtime's vitest run of `tests/unit/executor-config.vitest.ts` passes and its count is saved.
  - Open: the vitest run passes at 112 of 112 (`evidence/executor-config-vitest.txt`), but no count from before this phase's changes was saved.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the MCP patch with one `code_mode` stdio row, explicit `env`, `cwd` and `startupTimeoutMs` (`MP`). Verify: `--dump-config` with `MP` piped to `grep -c 'dsh-mcp-client'` prints 1. Evidence: `.dsh/patches/mcp-code-mode.patch.yml`, `evidence/dump-config-mcp.txt`.
- [ ] T004 Write the `mcp-route-guard` adapter on `tools/pre-execute` for `mcp__.*`, mounted from `MP` (`.dsh/plugins/repo-guards/`). Verify: its deny test passes.
  - Open: the deny test passes (6 of 6 in the MCP test file). The adapter registers in `index.mjs` on every guards load, not from the MCP patch as D2 and this task require. Without the MCP patch no `mcp__*` tool exists, so the guard never fires. The deviation is in `goal.md` section 4.
- [x] T005 Add the `cli-deepseek-harness` MCP capability (`EC`). Verify: `rg -n 'cli-deepseek-harness' EC` matches the capability entry. Evidence: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `evidence/executor-config-vitest.txt`.
- [ ] T006 Add capability and default-off assertions (`executor-config.vitest.ts`). Verify: the vitest run passes with the new cases.
  - Open: the capability is asserted (vitest lines 388 to 393), and other kinds are refused (lines 399 to 404). No case asserts that `cli-deepseek-harness` defaults to no MCP. The only default-off assertion covers the `native` kind (line 417).
- [x] T007 [P] Optionally add dsh rows to the MCP doctor (`.skilled/commands/doctor/assets/doctor-mcp-*.yaml`). Verify: `rg -n 'dsh' .skilled/commands/doctor/assets/doctor-mcp-*.yaml` matches, or the row is recorded as skipped in `implementation-summary.md`.
  - Skipped as optional. No dsh rows exist in the doctor files. The skip is recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Dump config without `MP`. Verify: `grep -c 'dsh-mcp-client'` on the dump prints 0. Evidence: `evidence/dump-config-mcp.txt`.
- [ ] T009 Run the keyless MCP dispatch, then compare launcher PIDs (`scratch/pids-after.txt`). Verify: exit 1 with `MISSING_CREDENTIAL`, no MCP startup error on stderr and `comm -13 scratch/pids-before.txt scratch/pids-after.txt` prints nothing.
  - Open: exit 1, `MISSING_CREDENTIAL` and an empty PID comparison are recorded (`evidence/keyless-mcp-boot.txt`). Stderr holds one Code Mode line, `Error during batch registration for manual 'webflow'`, which the evidence ties to a token variable the scrubbed environment lacks. Whether that counts as an MCP startup error needs an operator ruling. `scratch/pids-after.txt` does not exist, and the run predates the bundle edits at 08:02 to 08:18.
- [x] T010 Update the packet's `references/mcp.md` and `.dsh/SYNC.md` (`sk-doc` for the reference). Verify: `rg -l 'mcp-code-mode.patch.yml' .dsh/SYNC.md .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/mcp.md` lists both. Evidence: `.dsh/SYNC.md`, `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/mcp.md`.
- [x] T011 Validate the phase folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`. Evidence: `tasks.md:66` records the final strict run, which printed `RESULT: PASSED` with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no task row marked `[B]`.
- [ ] Manual verification passed: the launcher PID comparison is saved in `scratch/` until closeout and summarized in `implementation-summary.md`
  - Open: `scratch/` holds no PID files, and the comparison result is summarized in `implementation-summary.md` only.
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

The whole phase is optional. If it is skipped, the parent records the skip and no row here is claimed.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md`.
- [ ] CHK-003 [P1] Dependencies identified and available: phases 004, 006 and 008 are complete
  - Open: phase 008 is not closed (AC-001 and AC-005 are unmet).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The adapter and config change pass the `sk-code-skilled` lint and format checks
  - Open: no lint or format run is recorded.
- [ ] CHK-011 [P0] The keyless MCP run stderr holds no MCP startup error
  - Open: one Code Mode manual registration error is on stderr (see T009). The ruling is with the operator.
- [x] CHK-012 [P1] The route guard denies when its core throws. Evidence: `.dsh/plugins/repo-guards/adapters/mcp-route-guard.mjs`, `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt`.
- [x] CHK-013 [P1] Existing executor kinds keep their MCP validation unchanged. The refusal for every other kind still fires, and the error text now names both per-lineage kinds. Evidence: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `evidence/executor-config-vitest.txt`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
  - Open: AC-003 and AC-005 are unmet. See `acceptance-criteria.md`.
- [x] CHK-021 [P0] The launcher PID comparison prints nothing. Evidence: `evidence/keyless-mcp-boot.txt`. This run predates the bundle edits and does not satisfy AC-003.
- [ ] CHK-022 [P1] Edge case tested: a dispatch without `MP` starts no launcher
  - Open: no run without the MCP patch was recorded. The dump without the patch shows no row, but a dump does not start a launcher.
- [ ] CHK-023 [P1] Error scenario validated: a startup timeout surfaces on stderr
  - Open: no startup-timeout run was recorded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase builds new behavior and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `MP` holds no key value. `rg -n -i 'key|secret|token' MP` prints nothing. Evidence: `.dsh/patches/mcp-code-mode.patch.yml`.
- [x] CHK-031 [P0] `mcp__code_mode__*` tools outside the allowlist are denied. Evidence: `.dsh/plugins/repo-guards/tests/mcp-route-guard.test.mjs`, `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt`.
- [x] CHK-032 [P1] Server instructions are treated as data in `references/mcp.md` (line 62). Evidence: `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/mcp.md`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same patch, adapter and capability. Evidence: `spec.md`, `plan.md`, `tasks.md`.
- [x] CHK-041 [P1] Code comments carry the durable reason and no ephemeral label. The label scan hits in `fanout-run.cjs` are on lines that already exist at HEAD (line 566). None sit in this phase's MCP code. Evidence: `.dsh/plugins/repo-guards/`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`.
- [x] CHK-042 [P2] The MCP doctor rows are added or the skip is recorded. Evidence: `implementation-summary.md`.
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
| P1 Items | 10 | 7/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-06 (closeout pass, bundle snapshot 08:19). Open items are listed above and in `implementation-summary.md`.
<!-- /ANCHOR:summary -->

---
