# Review Iteration 001

## Dispatcher

- Command: `/deep:review` autonomous single-iteration dispatch (`executionMode: auto`, non-interactive)
- Target agent: `@deep-review` (LEAF; no nested dispatch)
- Mode: `review`
- Budget profile: `verify` (11-13 calls)
- Review target: the uncommitted C6 executor-identity change across the seven declared files
- Lifecycle: `lineageMode: new`, `generation: 1`, `sessionId: 2026-11-14T22:08:20.484Z`

Setup bindings emitted for audit:

```
BINDING: target=specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening
BINDING: maxIterations=1
BINDING: convergence=0.10
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening
```

## Dimension

Risk-ordered single-pass sweep over all four dimensions because this dispatch runs one iteration of one: correctness first, then security, traceability, and maintainability. The core question is REQ-009: does C6 Option A keep exactly one executor row per iteration through a projection refresh in both review and research.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` — new `APPEND_GATEWAY_PATH`/`REPOSITORY_ROOT` constants, `ledgerModeFor`, `iterationNamesExecutor`, `appendThroughGateway`, and the ledger branch of `writeFirstRecordExecutor` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1058]
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` — the review branch now accepts `iteration_start` beside `iteration` and wraps both under `deep_review.iteration_recorded` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:443]
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` — `iteration_start` unpinned, mapped to `deep_research.iteration_started`, and upcast from the legacy row [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:585]
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` — optional `executor: 'json'` data rule for the opening stem [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:641]
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` — `IterationStartedData` union with and without `executor` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:171]
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` — the research projection writes the optional `executor` back onto the opening row [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:290]
- `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts` — new end-to-end tests for review, research, and the missing-session refusal [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts:104]

Cross-reference context (not findings scope): the four deep workflow YAMLs that call `writeFirstRecordExecutor`, the live review state log, and `executor-audit.vitest.ts`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Unbounded gateway spawn can hang the pre-dispatch audit** -- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1103` -- `appendThroughGateway` calls `spawnSync` with only `{ cwd, encoding }`. The review and research workflows run this audit before dispatch, so a gateway blocked on a ledger lock, a filesystem stall, or a killed child blocks the run instead of refusing it. A wall-clock timeout is missing from the only new external process the change adds.
   Finding class: reliability hardening
   Scope proof: new code in the reviewed diff; both ledger modes reach it.
   Affected surface hints: `writeFirstRecordExecutor` callers in `.skilled/commands/deep/assets/deep-review-auto.yaml:1230`, `deep-review-confirm.yaml:1333`, `deep-research-auto.yaml:1201`, `deep-research-confirm.yaml:1209`; `append-mode-event.cjs`.
   Case: a gateway process left holding the ledger lock after a killed run, or a stalled temp filesystem, makes `writeFirstRecordExecutor` wait indefinitely before the executor starts.
   Evidence: [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1103]

2. **Legacy research upcast invents focus and strategy digests** -- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:585` -- the new `deep_research.iteration_started` case sets `focusRef` to `legacy-jsonl:<recordDigest>:focus` and `strategyDigest` to the record digest. Those fields promise references to the focus and strategy artifacts, but the legacy opening row carries neither, so a downstream resolver or integrity check gets a pointer that cannot resolve to the named content.
   Finding class: traceability
   Scope proof: new upcast case in the reviewed diff.
   Affected surface hints: the research projection contract's `iteration_start` row; any consumer resolving `focusRef` or validating `strategyDigest`.
   Case: a legacy research `iteration_start` row is migrated and then audited against the strategy file; `strategyDigest` is the digest of the row, not of the strategy content.
   Evidence: [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:589]

3. **Fixed-depth repository root breaks on a differently vendored runtime** -- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1060` -- `REPOSITORY_ROOT` is derived by walking six parent segments from `import.meta.url`, and the gateway runs with that directory as `cwd` because it binds each append to the checkout's identity. The in-repo mirrors all sit at the same depth, but an install at a different depth resolves the parent of the checkout and the binding refuses rather than appending.
   Finding class: maintainability / portability
   Scope proof: new constant in the reviewed diff; `APPEND_GATEWAY_PATH` shares the depth assumption.
   Affected surface hints: runtime mirror packaging; consumer installs of the `system-deep-loop` skill.
   Case: the skill is installed at `repo/node_modules/system-deep-loop/runtime/lib/deep-loop`, where six parent segments land above `repo`, so the gateway's checkout binding fails for every non-native executor with a ledger.
   Evidence: [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1060]

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | The C6 Option A behavior is implemented at the fault site: the ledger-backed state log routes the executor row through the gateway, and the row is rebuilt from the ledger. Live evidence: [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening/review/deep-review-state.jsonl:3] |
| `checklist_evidence` | core | pass | The new test executes the real gateway in both modes, asserts exactly one opening row after a refresh, and asserts a second audit appends nothing [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts:113] |
| `skill_agent` | overlay | partial | `SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json`, and the changelog are modified outside the declared seven-file target; not reviewed as code. |
| `agent_cross_runtime` | overlay | partial | All four deep YAML callers pass a `sessionId`; the review binding is proven by the live row, the research workflow's `config.lineage.sessionId` resolution is not independently exercised. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog entry is in the declared target. |
| `playbook_capability` | overlay | notApplicable | No manual-testing playbook surface is in the declared target. |

## Integration Evidence

- Live production path: the run's own state log carries `{"type":"iteration_start","iteration":1,...}` with the `cli-deepseek-harness` executor and the config session id, written through the new gateway branch and preserved by the projection refresh [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening/review/deep-review-state.jsonl:3].
- Review gateway classification: `rawEvent.type === 'iteration' || rawEvent.type === 'iteration_start'` under `deep-review`, both wrapped whole under `deep_review.iteration_recorded` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:443].
- Research migration path: the legacy branch hands the row to `upcastLegacyDeepResearchRecord`, whose new case produces `deep_research.iteration_started` and carries the executor when it is a JSON object [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:585].
- Projection replay: the research contract spreads `executor` back onto the `iteration_start` row only when it is a non-array object [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:290].
- Caller binding: the four deep YAML steps add `sessionId` to the `writeFirstRecordExecutor` arguments, so the new throw is not reachable from the shipped workflows.

## Edge Cases

- **Empty ledger frames directory.** `ledgerModeFor` requires at least one `.frame` file; a ledger directory that exists but holds no frame falls back to the direct write, which the next projected refresh drops. The gateway creates the opening frame with run initialization, so the gap is only reachable after a failed first append. Recorded as a deferred hardening check, not an active finding.
- **Concurrent pre-dispatch audits.** Two audits for the same iteration can both observe no executor row and both append. The new test proves the sequential re-audit is idempotent, not the concurrent case; the dispatcher audits once per iteration, so this stays deferred.
- **Research workflow session placeholder.** The research YAMLs bind `config.lineage.sessionId`, while the review YAMLs bind `session_id`; the new test calls the function directly. The live review row proves the review binding resolves; the research binding is deferred to a workflow-level integration run.
- **Missing `sessionId` on a non-ledger state log.** The new throw is unreachable because `ledgerModeFor` returns `null` first, and the direct-write path is unchanged. Confirmed clean.
- **Duplicate row detection across record types.** `iterationNamesExecutor` treats a canonical `iteration` row that already carries an object `executor` as satisfying the audit, so a re-dispatch does not double-write. Confirmed by reading the helper and the test.

## Confirmed-Clean Surfaces

- No shell interpolation: `spawnSync` receives an argv array and the mode comes from the frozen `LEDGER_MODES` constant list.
- The temporary event directory is created with `mkdtempSync` (0700 on POSIX) and removed in `finally`; the executor record carries configuration, not secrets.
- Native executors still short-circuit before the ledger check, so D3's "other executor kinds keep today's stdout echo and env behavior" holds for the native path and the gateway child inherits the environment unchanged.
- The four YAML callers all pass a session id, and the live review row is direct evidence that the binding authorizes.
- The new test's refusal case asserts the state log is byte-identical after the throw, so refusal is non-destructive [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts:137].

## Ruled Out

- **Direct write being dropped by a refresh** -- ruled out by the gateway path plus the live row [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening/review/deep-review-state.jsonl:3].
- **Command injection through the new spawn** -- ruled out: argv-only `spawnSync`, no shell, fixed mode constants [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1103].
- **Schema rejection of the optional executor field** -- ruled out by the `executor: 'json'` optional-field rule and the passing research projection test [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:641].
- **Duplicate opening rows on a sequential re-audit** -- ruled out by the test's second `writeFirstRecordExecutor` call and the single-row assertion [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts:116].

## Next Focus

None -- `maxIterations=1` is reached. Advisory follow-ups only: add a spawn timeout, replace the synthetic focus/strategy digests with real references or mark them synthetic, and make the repository-root resolution installation-depth independent.

## Verdict

P0: 0, P1: 0, P2: 3. No active P0 or P1 finding remains; the three P2 advisories are non-blocking. `hasAdvisories=true`.

Review verdict: PASS
