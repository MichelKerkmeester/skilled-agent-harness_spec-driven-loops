---
title: "009 Test Reliability Remediation: Six Brittle Tests Fixed"
description: "Six surgical test-only edits close findings F-015-C5-01 through F-015-C5-06. Hard-coded developer paths, absolute latency assertions, real-timer sleeps, leaked env mutations plus a colliding fixture root are all resolved. A new shared env-snapshot helper removes duplicated restore boilerplate."
trigger_phrases:
  - "test reliability remediation"
  - "F-015-C5 findings"
  - "vi.useFakeTimers envelope"
  - "env snapshot restore vitest"
  - "gate-d-resume-perf hard-coded path"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/009-fix-test-reliability`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings`

### Summary

Six tests across the stress-test and unit-test surface had reliability defects that caused failures on non-developer machines, in CI or under repeated runs. One test hard-coded an absolute developer home-directory path that only worked on the original author's machine. One asserted absolute latency budgets that failed on slower hardware. One used real-timer sleeps with elapsed-time assertions, introducing wall-clock flakes. Two tests mutated process env vars without restoring them, leaking state across the run. One test used a repo-local fixture root that collided when runs overlapped or a prior run crashed.

Each finding from packet 046 iteration-015 section C5 (F-015-C5-01 through F-015-C5-06) is now closed with the minimum test-only edit. A small shared helper at `mcp_server/lib/test-helpers/env-snapshot.ts` removes duplicated env-restore boilerplate that two of the fixes need. No product-code files were touched.

### Added

- `mcp_server/lib/test-helpers/env-snapshot.ts`: new shared helper exporting `snapshotEnv(keys)` that returns a `restore()` function with try/finally semantics

### Changed

- `gate-d-resume-perf.vitest.ts`: hard-coded absolute `REPO_ROOT` path replaced by `process.cwd()` captured at module load
- `gate-d-benchmark-session-resume.vitest.ts`: absolute `p50 < 300 ms` and `p95 < 500 ms` latency asserts gated behind `BENCHMARK=1` so CI asserts correctness only
- `envelope.vitest.ts`: T154 real-timer sleeps replaced by `vi.useFakeTimers()` with `vi.setSystemTime`. Real timers restored in `afterEach`.
- `opencode-plugin-bridge-stress.vitest.ts`: `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` snapshotted in `beforeEach` and restored in `afterEach` via the shared helper
- `hybrid-search-flags.vitest.ts`: `SPECKIT_MMR` snapshotted in `beforeEach` and restored in `afterEach` via the shared helper
- `memory-save-pipeline-enforcement.vitest.ts`: fixed repo-local `tmp-test-fixtures/` path replaced by per-test `fs.mkdtempSync` random-suffix root inside `process.cwd()`

### Fixed

- `gate-d-resume-perf.vitest.ts` failed on any machine other than the original developer's due to a literal home-directory path in `REPO_ROOT`
- `gate-d-benchmark-session-resume.vitest.ts` failed on slower CI hardware because the `p50` and `p95` thresholds were unconditional
- `envelope.vitest.ts` T154 tests produced wall-clock flakes. Fake timers make the test deterministic and fast.
- Two tests left env mutations in place after failure, causing unrelated subsequent tests to see unexpected env state
- `memory-save-pipeline-enforcement.vitest.ts` concurrent runs collided on a shared fixed fixture path. A crashed run left a stale dir that blocked the next run.

### Verification

| Check | Result |
|-------|--------|
| Each modified test in isolation via `npx vitest run` | TBD. To be filled after run. |
| Sample unit-test invocation (envelope, hybrid-search-flags, memory-save-pipeline-enforcement) | TBD. To be filled after run. |
| Full `npm run stress` (56+ files, 163+ tests) | TBD. To be filled after run. |
| `validate.sh --strict` on this packet | TBD. To be filled after run. |
| Git diff scope | Six test files plus new helper plus packet spec docs only |
| Inline finding markers present | TBD. Six markers expected, one per finding. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/test-helpers/env-snapshot.ts` | Created (NEW) | Shared env-snapshot/restore helper consumed by C5-04 and C5-05 |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/session/gate-d-resume-perf.vitest.ts` | Modified | F-015-C5-01: hard-coded REPO_ROOT replaced by captured process.cwd() |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/session/gate-d-benchmark-session-resume.vitest.ts` | Modified | F-015-C5-02: p50/p95 latency asserts gated behind BENCHMARK=1 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/envelope.vitest.ts` | Modified | F-015-C5-03: real-timer sleeps replaced by vi.useFakeTimers() deterministic control |
| `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` | Modified | F-015-C5-04: env snapshot/restore via shared helper in beforeEach/afterEach |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts` | Modified | F-015-C5-05: env snapshot/restore via shared helper in beforeEach/afterEach |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` | Modified | F-015-C5-06: fixed fixture root replaced by per-test mkdtempSync random-suffix path |

### Follow-Ups

- Run each modified test in isolation and fill the TBD rows in the Verification table before marking the packet complete.
- Add a dedicated unit test for `env-snapshot.ts` if a third consumer is added in a future packet.
- Consider adding a CI lint step that detects literal home-directory paths in test files to prevent regressions of F-015-C5-01.
