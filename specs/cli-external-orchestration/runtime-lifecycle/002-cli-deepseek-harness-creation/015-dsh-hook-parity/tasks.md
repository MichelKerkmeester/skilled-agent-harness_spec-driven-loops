---
title: "Tasks: Phase 15: dsh-hook-parity"
description: "Ordered tasks for DSH hook parity: probes and red tests, six adapters and a leaf marker, the session sweep, the hook library move and the verification gates."
trigger_phrases:
  - "dsh hook parity tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: dsh-hook-parity

<!-- SPECKIT_LEVEL: 3 -->

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

`B` is `.dsh/plugins/repo-guards`. `T` is `$B/tests/`. `L` is `.skilled/hooks`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inventory every hook concern from the hooks README, the coverage matrix, the additional hooks table, `.opencode/plugins/`, `.pi/extensions/` and the Hermes plugin (`spec.md` section 12). Verify: the parity table has 30 rows, 31 once the follow-up adds the orphan sweep row.
- [x] T002 Probe patch order with a lineage patch that overrides the `repo-guards` row (scratchpad probe). Verify: stderr prints `patch: entry "repo-guards" not found`.
- [x] T003 Probe the agent context: a per-agent tool registers at `agent/created`, `agent.ctx.commands` needs `inject`, `agent/disposed` fires at headless exit (scratchpad probe). Verify: the probe log prints `tool=ok`, `cannot get property "commands" without inject` and `agent-disposed`.
- [x] T004 Capture baselines. Verify: bundle 37 pass, dispatch rules 50 pass, hooks vitest 481 pass and 2 fail, mirrors 221 over 9 trees, hook registrations 4 files and 20 Pi links.
- [x] T005 Write the failing fixture tests first (`$T`, `$L/decision-capture/bin/sweep-dsh.test.mjs`). Verify: `evidence/tests-red.txt` shows each suite failing with `ERR_MODULE_NOT_FOUND`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add the leaf marker (`$L/shared/dsh/session-role.mjs`, `$B/lineage-leaf.mjs`, `.dsh/patches/lineage.patch.yml`). Verify: `session-role.test.mjs` passes.
- [x] T007 Turn the advisor on, read only operator prompts, honor the leaf and the directive lifecycle (`.dsh/patches/guards.patch.yml`, `prompt-advisor.mjs`). Verify: the five advisor tests in `session-role.test.mjs` pass.
- [x] T008 [P] Add `overlay-guard.mjs`. Verify: `overlay-guard.test.mjs` passes 5 of 5.
- [x] T009 [P] Add `session-start-advisories.mjs`. Verify: its five tests in `session-lifecycle.test.mjs` pass.
- [x] T010 [P] Add `session-compact-context.mjs` and export `runSessionPrime`. Verify: its two tests pass.
- [x] T011 [P] Add `session-stop-context.mjs`. Verify: its three tests pass.
- [x] T012 Add `sweep-dsh.mjs` with a Zstandard frame walker, late timed replies and `multi_select`. Verify: `sweep-dsh.test.mjs` passes 8 of 8, and `evidence/sweep-frame-walker.txt` prints `identical to zstd -dc: true`.
- [x] T013 Add `decision-capture.mjs`. Verify: `decision-capture.test.mjs` passes 6 of 6.
- [x] T014 Add `loadDshTools` and `goal-manage.mjs`. Verify: `goal-manage.test.mjs` passes 10 of 10.
- [x] T015 Register the six adapters in `$B/index.mjs`, holding `goal-manage` and `session-compact-context` behind `ctx.inject`. Verify: the bundle suite passes.
- [x] T016 Update the three legacy advisor tests in `repo-guards.test.mjs` to the new contract. Verify: they pass.
- [x] T017 Move every adapter into the hook library with `git mv`, rewrite its relative imports and leave relative links in `$B/adapters/` and index links in `$L/<concern>/dsh/`. Verify: every relative literal resolves and the bundle suite passes 75 of 75.
- [x] T018 Add the `dsh-adapters` tree to `sync-runtime-mirrors.cjs`. Verify: `sync-runtime-mirrors.test.mjs` passes 6 of 6 and `--check` prints `PASS: 243 mirrors across 10 trees`.
- [x] T019 [P] Wire the DSH sweep into `.skilled/commands/speckit/save.md`. Verify: `rg -n sweep-dsh .skilled/commands/speckit/save.md` prints two lines.
- [x] T020 Update the docs: the hooks README tree and DSH column, `runtime-refusal.test.mjs`, `coverage-rationale.md`, the bundle README, `.dsh/SYNC.md`, `guards-and-hooks.md`, GRD-001, three skill `hooks/dsh/README.md` files, the runtime-mirrors README and the doctor step. Verify: `runtime-refusal.test.mjs` passes 6 of 6.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Run the bundle, sweep and matrix suites. Verify: `fail 0` on each.
- [x] T022 Run the dispatch rule tests. Verify: `node --test $L/dispatch/lib/dispatch-rule-checks.test.mjs` prints `fail 0`.
- [x] T023 Run the hooks vitest suite. Verify: the only failures are the two pre-existing `codex-shell-tool.test.mjs` cases.
- [x] T024 Run the three `sync-*-dsh.cjs --check`, the Hermes sync checks, the runtime-mirror checks and the compiled-route manifest test. Verify: each exits 0 and the manifest test passes 48 of 48 (`evidence/gates-2026-11-06.txt`).
- [x] T025 Rebuild the trigger index and check it. Verify: `--check` exits 0.
- [x] T026 Record keyless boots and `--dump-config` for both compositions (`evidence/`). Verify: the interactive boot lists `dsh_goal` and an `Advisor:` notice, the lineage boot neither.
- [x] T027 Validate the packet. Verify: `validate.sh <packet> --strict --recursive` prints `RESULT: PASSED` for every folder.
- [x] T028 Register 015 in the parent: phase map, phase pointers, regenerated parent metadata and the goal LOG row. Verify: parent `children_ids` lists 015.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Follow-up Drift Fixes

- [x] T029 Write failing tests for the five drift items (`$T/repo-guards.test.mjs`, `$T/session-role.test.mjs`, `orphan-sweeper-session-runtimes.vitest.ts`, `git-setup-check.test.cjs`). Verify: `evidence/followup-fixes-2026-11-06.txt` records each red run.
- [x] T030 Classify only operator messages in `spec-gate-classify.mjs`. Verify: the bundle suite passes 78 of 78.
- [x] T031 Report the advisor runtime as `dsh` and add `dsh` to `advisor-runtime-values.ts`. Verify: the advisor suite passes 1373 with 8 skipped, and a live run prints `Advisor: live` under `runtime=dsh`.
- [x] T032 Disable `tool-goal` in `.dsh/patches/lineage.patch.yml`. Verify: `evidence/leaf-goal-tools-off.txt` shows the row disabled and a 20-tool lineage boot.
- [x] T033 Add `dsh` to the orphan sweeper's session pattern. Verify: the four sweeper suites pass 30 of 30.
- [x] T034 Add the DSH row to `git-setup-check.cjs`, its tests and the `/doctor:git` docs. Verify: `git-setup-check.test.cjs` passes 78 of 78 and the live check prints `dsh (active): registered`.
- [x] T035 Name `tool-goal` wherever the lineage patch rows are listed and add the DSH rows to the sk-git hooks README. Verify: every prose line that `rg -n "command-goal" .dsh .skilled/skills/cli-external-orchestration/cli-deepseek-harness` prints also names `tool-goal`.
- [x] T036 Rerun every gate, re-derive the packet metadata and rebuild the trigger index last. Verify: recursive strict validation prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `evidence/keyless-boot-interactive.txt` and `evidence/keyless-boot-lineage.txt` show the split
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
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

A blocked task stays `[B]` with its failing command and output recorded in `implementation-summary.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-008)
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: `dsh --version` from a temp cwd prints 0.2.2-rc.1
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every new module loads: the bundle suite imports each one through its link
- [x] CHK-011 [P0] No plugin warning on a keyless boot: both boot stderr files hold only `MISSING_CREDENTIAL`
- [x] CHK-012 [P1] Each of the 20 adapters exports `ERROR_POLICY`, and each new adapter has a throw-policy test
- [x] CHK-013 [P1] Code follows project patterns: section-banner headers, JSDoc on exports, no packet ids in comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (`acceptance-criteria.md`)
- [x] CHK-021 [P0] Manual testing complete: GRD-001 run and recorded in `evidence/gates-2026-11-06.txt`, and `/goal-dsh` run against the real manage CLI in `evidence/goal-command-live.txt`
- [x] CHK-022 [P1] Edge cases tested: pending, failed and late answers, a skippable frame, a leaf, a resumed session, a notice spliced after the operator prompt and a dangling DSH adapter link
- [x] CHK-023 [P1] Error scenarios validated: one throw-policy test per new adapter
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase adds parity and moves files. It fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: no adapter reads a key, and every boot ran with model keys unset
- [x] CHK-031 [P0] Input validation implemented: the goal tool declares its parameter schema, and the sweep ignores unparsable lines
- [x] CHK-032 [P1] Auth/authz: N/A, no adapter authenticates anything
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments state the why: patch order, real-path imports, the scoped inject
- [x] CHK-042 [P2] READMEs updated: hooks, bundle, three skill `hooks/dsh/` folders, runtime mirrors
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only, never in this folder
- [x] CHK-051 [P1] scratch/ holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 15 | 15/15 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-11-06
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
- [x] CHK-101 [P1] All ADRs have status Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented: the move used `git mv`, and the links keep every old adapter path valid
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] NFR-P01: session-start guards run in parallel with a 5 s timeout, and primary reconcile is detached (`session-start-advisories.mjs`)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented in `plan.md` section 7
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No new dependency: the adapters load the harness packages from the installed `dsh`
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] The bundle README and `guards-and-hooks.md` list the same 20 adapters, and they, `.dsh/SYNC.md` and the rationale name the same four interactive-only ones
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

N/A: the operator approved the scope, the workspace and the push in the dispatch brief. No separate sign-off applies.
<!-- /ANCHOR:sign-off -->
