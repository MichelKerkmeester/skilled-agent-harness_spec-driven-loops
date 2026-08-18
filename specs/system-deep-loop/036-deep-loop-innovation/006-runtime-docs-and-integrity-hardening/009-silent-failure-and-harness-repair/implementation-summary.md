---
title: "Implementation Summary: 009-silent-failure-and-harness-repair"
description: "Malformed input now fails loudly with INPUT_VALIDATION and a distinct exit code, aggregate test suites no longer double-register discovered tests, the shared spawn helper settles on a SIGTERM-ignoring child, and benchmark/playbook/contract paths resolve to real assets."
trigger_phrases:
  - "silent failure harness repair implementation"
  - "input validation exit code deep loop"
  - "aggregate suite double registration fix"
  - "deep loop 031 implementation summary"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/009-silent-failure-and-harness-repair"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled packet docs to Complete with 22/23 findings landed across 3 lanes"
    next_safe_action: "Re-land skill-benchmark-resume-adapter timeout fix without a suite hang"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

# Implementation Summary: 009-silent-failure-and-harness-repair

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-silent-failure-and-harness-repair |
| **Completed** | 2026-08-07 |
| **Level** | 3 |
| **Status** | COMPLETE (22/23 findings landed across 3 lanes; skill-benchmark half of F-034-02 deferred) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Twenty-three findings across three lanes shared one shape: unmeasured or invalid input presenting as fine. Lane A made malformed input fail loudly instead of becoming a null placeholder, an empty array, or a `NaN` that reaches array slicing with `status ok`. Lane B repaired the harnesses producing the evidence: three rollback aggregates were side-effect-importing executable suites that Vitest also discovered independently, registering ~100+ tests twice each and inflating the counts `021` reconciles. Lane C repaired asset and playbook resolution, including fourteen manual scenarios that `cd` into a path that did not exist and a contract-snapshot verifier that could not accept its own output. 22 of 23 findings landed across three commits on `skilled/v4.0.0.0`; the skill-benchmark half of F-034-02 was attempted and reverted (see Known Limitations).

### Lane A — fail-loudly input validation (12 findings, landed as `8fc33832c9`)

| Finding | Landed | Disposition |
|---------|--------|-------------|
| `F-003-03` | Landed | Malformed delta rows in `reduce-state.cjs:154` now fail with `INPUT_VALIDATION` instead of becoming a filtered `null`. Same file/line as `F-037-04`, one work unit. |
| `F-037-04` | Landed | Same fix as `F-003-03`: malformed delta rows no longer silently drop while the iteration still passes. |
| `F-037-02` | Landed | Synthesis in `deep-review-auto.yaml` no longer catches a parse failure, returns an empty array, and appends `synthesis_complete`; malformed canonical state records now fail loudly. |
| `F-037-03` | Landed | `verify-iteration.cjs:57` no longer accepts a stale valid record when the newest append is malformed. |
| `F-032-01` | Landed | `query.cjs:100` no longer lets `Number(args.limit \|\| 50)` yield `NaN` into array slicing with `status ok`. |
| `F-032-02` | Landed | `ExecutorConfigError` in `executor-config.ts` now carries a code; schema failures no longer surface as generic `SCRIPT_ERROR`. |
| `F-032-03` | Landed | `reduce-state.cjs:2181` — a misspelled reducer flag no longer leaves the artifact directory undefined and writes to the default root while exiting successfully. |
| `F-032-04` | Landed | `upsert.cjs:131` — a valueless flag no longer becomes boolean `true` and reaches `path.resolve`; missing/unreadable event files now produce `INPUT_VALIDATION`. |
| `F-032-05` | Landed | `fanout-merge.cjs:1097` — context merge mode no longer silently reads research-shaped artifacts. |
| `F-036-01` | Landed | `durable-orchestrator.ts:591` — the run cache no longer erases the pool-item generic. |
| `F-036-02` | Landed | `divergent-pivot.ts:528` — pivot events are validated with real runtime checks, not cast after generic-only validation. |
| `F-036-03` | Landed | `divergent-pivot.ts:995` — persisted pivot config is validated, not asserted as a closed shape after shallow checks. |

### Lane B — harness self-integrity (3 findings, landed as `8b887bef5f`)

| Finding | Landed | Disposition |
|---------|--------|-------------|
| `F-034-01` | Landed | The three rollback-gate aggregate suites (agent-improvement, model-benchmark, skill-benchmark) stop double-registering independently-discovered tests. This legitimately reduces the discovered test count (ADR-002); the reduction is the fix, reported as a delta rather than lost coverage. |
| `F-034-02` | PARTIAL — model-benchmark landed, skill-benchmark DEFERRED (not landed) | `model-benchmark-resume-adapter`'s file-wide timeout override is now scoped and reset. The equivalent `skill-benchmark-resume-adapter` change introduced a hang and was reverted; see Known Limitations. |
| `F-034-03` | Landed | The shared spawn helper (`tests/helpers/spawn-cjs.ts`) now settles when a child ignores SIGTERM, escalating to SIGKILL. A new test spawns a SIGTERM-ignoring child and asserts the helper still resolves. |

### Lane C — benchmark/playbook/contract truth (8 findings, landed as `5611f21a15`)

| Finding | Landed | Disposition |
|---------|--------|-------------|
| `F-035-03` | Landed | Benchmark postconditions in `behavior-bench-run.cjs` reject absolute probe paths outside the repo; the behavior-benchmark run guards its probe paths. |
| `F-030-01` | Landed | The playbook root index no longer omits a scenario directory; the four previously-excluded scenarios are back inside the readiness denominator. |
| `F-030-02` | Landed | Every prescribed manual-testing-playbook `cwd`/test path now resolves; the fourteen scenarios that `cd`'d into a dead path are reconciled with the shipped scenario directories. |
| `F-030-03` | Landed | `PARTIAL` is no longer definable while the governing policy allows only PASS/FAIL/SKIP; READY is no longer reachable through it. |
| `F-040-01` | Landed | The contract-snapshot verifier (`render-contract-snapshot.cjs`) now accepts its own generated output; `review-mode-contract-snapshot.md` was regenerated to match. |
| `F-033-01` | Landed | The seven benchmark profiles referencing underscore fixture IDs now reference the real hyphenated fixture IDs. |
| `F-033-02` | Landed | `run-skill-benchmark.cjs`'s fixture loader now scans the documented subdirectories instead of only immediate entries. |
| `F-038-01` | Landed | `conformance-benchmark.md` no longer splits its paths between a live packet and an absent one. |

Not in Lane C scope: the five pre-existing command-contract reds `021` recorded as a baseline are unchanged (before==after) — Lane C's spec explicitly triaged them as a different child's baseline, not a Lane C regression.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The three lanes landed as three separate commits on `skilled/v4.0.0.0`. Lane A (`8fc33832c9`) passed tsc rc0, the branch-leases-waves/fanout-merge/fanout-run/verify-iteration unit suites (174 tests), the divergent-pivot/query-script/upsert-script integration suites (30 tests), and the reduce-state fallback test, with zero new failures. Lane B (`8b887bef5f`) passed tsc rc0 and the agent/model/skill rollback-gate suites (61/58/80), the model-benchmark-resume-adapter suite (22), and the spawn-cjs suite (6), each run per file. Lane C (`5611f21a15`) passed tsc rc0 and the behavior-bench-run, render-contract-snapshot, playbook-mode, and load-playbook-typed-derivation suites. The skill-benchmark half of F-034-02 was implemented, found to hang the suite (it only fails, not hangs, at origin), and reverted before landing rather than shipped with a new failure mode.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Return `INPUT_VALIDATION` with a distinct exit code rather than a generic script error or a silent success (ADR-001) | Malformed input becoming a null placeholder, an empty array, or a `NaN` that reaches `status ok` hides real corruption from the caller and the dashboard. |
| Report Lane B's reduced discovered-test count as a correctness delta, not lost coverage (ADR-002) | The aggregates were double-registering ~100+ independently-discovered tests each; the lower count after de-duplication is the fix, and reporting it as a raw drop would misread a fix as a regression. |
| Escalate the shared spawn helper to SIGKILL when a child ignores SIGTERM | Resolving only from `close` let a SIGTERM-ignoring child hang the helper indefinitely; the existing unit test used a cooperative process that never exercised this path. |
| Revert the skill-benchmark-resume-adapter timeout change rather than ship a hang | The change introduced a hang that the pre-existing failure at origin did not have; shipping a hang is worse than the pre-existing timeout-related failure it was meant to fix. |
| Triage the five pre-existing command-contract reds as out of Lane C scope | They are `021`'s recorded RED baseline, not a Lane C regression; fixing them belongs to the child that owns that baseline. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Lane A: TypeScript | rc 0 |
| Lane A: branch-leases-waves/fanout-merge/fanout-run/verify-iteration unit suites | 174 tests, zero new failures |
| Lane A: divergent-pivot/query-script/upsert-script integration suites | 30 tests, zero new failures |
| Lane A: reduce-state fallback test | PASS |
| Lane B: TypeScript | rc 0 |
| Lane B: agent/model/skill rollback-gate suites | 61/58/80 passed per file |
| Lane B: model-benchmark-resume-adapter suite | 22 passed |
| Lane B: spawn-cjs suite | 6 passed, including the new SIGTERM-ignoring-child case |
| Lane C: TypeScript | rc 0 |
| Lane C: behavior-bench-run, render-contract-snapshot, playbook-mode, load-playbook-typed-derivation suites | PASS |
| Lane C: five pre-existing command-contract reds | Unchanged (before==after); out of Lane C scope |
| Lane C: full 035 oracle verification | Not reached — blocked by a fixture-internal ENOENT for a create-command contract asset; the packet path resolution it depends on was fixed here |

Across all three lanes, the auth gateway (`transition-authorization-gateway.ts`) was untouched.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`F-034-02` PARTIAL (skill-benchmark half DEFERRED, not landed)** — the model-benchmark-resume-adapter timeout scoping landed; the equivalent skill-benchmark-resume-adapter change was attempted and reverted because it introduced a hang (the suite only fails, does not hang, at origin). Re-landing needs a non-hanging fix.
2. **035 oracle verification not reached** — full verification remains blocked by a fixture-internal ENOENT for a create-command contract asset, unrelated to the packet path resolution Lane C fixed.
3. The five pre-existing command-contract reds (`021`'s recorded RED baseline) remain red; they were triaged as out of Lane C scope, not fixed.
<!-- /ANCHOR:limitations -->
