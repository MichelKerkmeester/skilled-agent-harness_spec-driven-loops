# Iteration 001 - Shared Runtime Correctness

## Focus

Correctness, edge cases, documentation drift, and test gaps in the shared deep-loop runtime, concentrating on `convergence.cjs`, `executor-audit.ts`, `divergent-pivot.ts`, `prompt-pack.ts`, and the loop-lock library/CLI.

## Actions Taken

1. Read the externalized state log and strategy before investigating the selected focus.
2. Inspected the five named runtime surfaces and the split TypeScript/CLI loop-lock implementation.
3. Cross-checked suspected defects against executor, convergence, pivot, prompt-pack, and loop-lock tests.
4. Compared runtime behavior and signatures with the shared runtime README contracts.

## Findings

### F-ITER001-001 - Snapshot persistence can be falsely reported as successful (P1)

For non-council loops, the snapshot write executes only when both `--persist-snapshot` is truthy and `--iteration` is present, but the response reports `snapshotPersistence: "persisted"` based solely on `--persist-snapshot`. A caller that omits `--iteration` therefore receives success telemetry even though no snapshot was written. Unlike council mode, there is no input-validation guard requiring the snapshot identity field. Existing integration tests cover persistence with an iteration and council's missing-round validation, but not this non-council omission. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:807-824] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:826-843] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts:226] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts:308-320]

### F-ITER001-002 - Distinct retry failures in one iteration are silently collapsed (P1)

`emitDispatchFailure` suppresses a new failure whenever the latest event for the iteration is any `dispatch_failure`; it does not compare reason, detail, executor, or dispatch attempt. A timeout followed by a crash in the same iteration is recorded as one failure, obscuring retry history and potentially preventing workflow logic from observing consecutive failures accurately. The unit test establishes idempotence only for two identical calls and does not cover distinct retry outcomes. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:281-299] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:828-848] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts:333-351]

### F-ITER001-003 - Loop-lock nonce ownership is not enforced end-to-end (P1)

Acquisition creates and persists an `acquire_nonce`, but the CLI status mapper drops it and CLI refresh/release accept only an owner PID. The library's refresh identity helper checks the nonce only when both stored and expected nonces are supplied, so CLI refresh bypasses the stronger identity even for modern locks. Library release checks only PID. PID reuse, or another caller in the same process, can therefore refresh or release a lock it did not acquire. Current CLI tests explicitly validate PID-only behavior, while library tests prove nonce-aware refresh only when callers opt in; no nonce-aware release contract exists. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:140-149] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:475-489] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:582-623] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:687-702] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:114-133] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:187-200] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/loop-lock-cli.vitest.ts:101-111]

### F-ITER001-004 - Runtime README quick start cannot run against the published API (P1)

The README calls `acquireLoopLock(specFolder)` and later `releaseLoopLock(lock)`, but the actual API requires `(lockPath, LoopLockData)` and `(lockPath, ownerPid)`. The same quick start imports through paths containing a doubled slash and directs tests through the old `system-spec-kit/mcp_server` package rather than the runtime's own Vitest configuration. This is direct documentation-versus-behavior drift on the primary onboarding path. [SOURCE: .opencode/skills/system-deep-loop/runtime/README.md:61-84] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:538-570] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:687-702]

### F-ITER001-005 - Production prompt-pack tests are checkout-specific (P2)

The prompt renderer's production-template test hard-codes one developer's absolute repository root. It cannot run unchanged in another clone, CI workspace, or this numbered worktree, so the test intended to guard live research/review templates is non-hermetic and may fail before exercising rendering. The renderer's basic substitution and missing-variable behavior otherwise has focused unit coverage. [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts:100-150]

### Ruled-Out Direction

No defect was established in the divergent pivot transaction's split prepare/record/finalize durability path during this pass. Its 3/3 parse-valid quorum, 2/3 endorsement, replay, preflight limits, and recursion guard are directly covered by integration tests. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1206-1390] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts:160-435]

## Questions Answered

- The shared-runtime portion of the correctness question now has four concrete P1 issues and one P2 test portability gap.
- A concrete documentation drift exists in the runtime's primary quick-start contract.
- Shared-runtime test coverage is broad but misses non-council persistence omission, distinct same-iteration retry failures, nonce-aware CLI ownership, and portable production-template resolution.

## Questions Remaining

- Do the four subskills invoke these runtime surfaces in ways that trigger or mask the identified defects?
- Where do command contracts and runtime-specific agent definitions diverge from current behavior?
- Which operator ergonomics and cost/performance issues dominate actual loop runs?
- Are async executor provenance guarantees intentionally weaker than synchronous dispatch, and is that documented?

## Next Focus

Rotate to documentation accuracy across the four subskills, deep command contracts, and Claude/OpenCode agent definitions. Trace each documented lifecycle, dispatch, resume, and convergence claim to its active workflow or runtime implementation, while carrying the shared-runtime findings forward for integration impact checks.

## SCOPE VIOLATIONS

None. No researched runtime, test, command, skill, or agent file was modified.
