# Deep Review Report: C6 Executor-Identity Change

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true
- **Active findings:** P0 0, P1 0, P2 3
- **Scope:** the uncommitted C6 executor-identity change across seven files: `executor-audit.ts`, `append-mode-event.cjs`, `legacy-compatibility.ts`, `deep-research-ledger-schema.ts`, `deep-research-ledger-types.ts`, `deep-research-contract.ts` and the new `executor-audit-ledger-projection.vitest.ts`.
- **Run shape:** one iteration of one, all four dimensions in risk order, single executor `cli-deepseek-harness` (`deepseek-v4.1-flash-1017`, reasoning `max`). Stop reason `maxIterationsReached`.

The change does what C6 Option A asks. On a ledger-backed state log, `writeFirstRecordExecutor` now sends an `iteration_start` row carrying `executor` through the append gateway, and the projection refresh writes it back. This run's own state log is live proof: its `iteration_start` row survived every later refresh. The three advisories are hardening and portability points, none blocking.

## 2. Planning Trigger

`/speckit:plan` is not required. The verdict is PASS and the three P2 items are advisory.

Planning Packet:

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1103", "title": "Unbounded gateway spawn can hang the pre-dispatch audit"},
    {"id": "R1-P2-002", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:585", "title": "Legacy research upcast invents focus and strategy digests"},
    {"id": "R1-P2-003", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1060", "title": "Fixed-depth repository root breaks on a differently vendored runtime"}
  ],
  "remediationWorkstreams": ["Advisory hardening of the pre-dispatch gateway call"],
  "specSeed": ["Optional: bound the pre-dispatch gateway call with a timeout and name its refusal"],
  "planSeed": ["Optional: add a spawnSync timeout to appendThroughGateway"],
  "findingClasses": ["reliability-hardening", "traceability", "portability"],
  "affectedSurfacesSeed": ["writeFirstRecordExecutor callers in the four deep YAMLs", "append-mode-event.cjs", "research projection contract iteration_start row", "runtime mirror packaging"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### R1-P2-001: Unbounded gateway spawn can hang the pre-dispatch audit

- **Severity:** P2. **Dimension:** correctness. **findingClass:** reliability-hardening.
- **Location:** `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1103`
- **Evidence:** `appendThroughGateway` calls `spawnSync` with only `{ cwd: REPOSITORY_ROOT, encoding: 'utf8' }`, so no wall-clock bound exists.
- **Impact:** a gateway stalled on a ledger lock or a slow filesystem blocks the run before the executor starts, instead of refusing it.
- **Fix:** pass a `timeout` to `spawnSync` and treat a timeout as a refusal with a named reason.
- **Disposition:** active, advisory. **scopeProof:** new code in the reviewed diff, reached by both ledger modes. **affectedSurfaceHints:** the four deep YAML callers, `append-mode-event.cjs`.

### R1-P2-002: Legacy research upcast invents focus and strategy digests

- **Severity:** P2. **Dimension:** traceability. **findingClass:** traceability.
- **Location:** `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:585`
- **Evidence:** the new `deep_research.iteration_started` case sets `focusRef` to `legacy-jsonl:<recordDigest>:focus` and `strategyDigest` to the row's own digest. The legacy opening row carries neither a focus nor a strategy.
- **Impact:** a consumer that resolves `focusRef` or checks `strategyDigest` against the strategy file gets a pointer that names content it cannot reach.
- **Fix:** mark the derived values as synthetic in the field or a comment, or source them from real artifacts when they exist.
- **Disposition:** active, advisory. **scopeProof:** new upcast case in the reviewed diff. **affectedSurfaceHints:** the research projection `iteration_start` row, consumers of `focusRef` and `strategyDigest`.

### R1-P2-003: Fixed-depth repository root breaks on a differently vendored runtime

- **Severity:** P2. **Dimension:** maintainability. **findingClass:** portability.
- **Location:** `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1060`
- **Evidence:** `REPOSITORY_ROOT` walks six parent segments from `import.meta.url`, and the gateway runs with it as `cwd` to bind each append to the checkout.
- **Impact:** an install at another depth resolves the wrong directory, and the gateway's checkout binding refuses every non-native executor row on a ledger-backed log.
- **Fix:** resolve the root from the state log's run directory or `git rev-parse --show-toplevel`, rather than a fixed depth.
- **Disposition:** active, advisory. **scopeProof:** new constant in the reviewed diff. **affectedSurfaceHints:** runtime mirror packaging, consumer installs.

## 4. Remediation Workstreams

- **P0:** none.
- **P1:** none.
- **P2 advisories:** bound the gateway spawn (R1-P2-001) first, because it is the only one that can stall a live run. Then the root resolution (R1-P2-003) and the synthetic digests (R1-P2-002).

## 5. Spec Seed

- Optional: state in `spec.md` that the pre-dispatch executor audit fails closed within a bounded time when the gateway does not answer.

## 6. Plan Seed

- Optional: add a `timeout` to the `spawnSync` call in `appendThroughGateway` and a test that a hung gateway produces a refusal.
- Optional: replace the fixed-depth `REPOSITORY_ROOT` with a resolution that does not depend on install depth.

## 7. Traceability Status

**Core protocols**

- `spec_code`: pass. The ledger-backed path routes the executor row through the gateway, and this run's state log carries the `iteration_start` row with `executor` after several refreshes.
- `checklist_evidence`: pass. The new test drives the real gateway in both modes, asserts one opening row after a refresh and asserts a second audit appends nothing.

**Overlay protocols**

- `skill_agent`: partial. Skill docs changed outside the seven-file target were not reviewed as code.
- `agent_cross_runtime`: partial. All four YAML callers pass a session id. The review binding is proven live, the research binding is not exercised by this run.
- `feature_catalog_code`: not applicable.
- `playbook_capability`: not applicable.

`AC_COVERAGE`: exempt, because the target type is `files`, not a spec folder.

resource-map.md not present at init, so the Resource Map Coverage Gate was skipped.

## 8. Deferred Items

- A ledger directory with no frame yet falls back to the direct write, which a later refresh would drop. Reachable only after a failed first append.
- Two concurrent audits for the same iteration could both append. The dispatcher audits once per iteration, so this stays deferred.
- The research workflows bind `config.lineage.sessionId`. A research run would prove that binding live.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Swept directions: none recorded.
- Remaining frontier: the three deferred items above.

## 9. Search Ledger

- **graphCoverageMode:** `graphless_fallback`
- **Required bug classes (8):** identity_projection, caller_contract, duplicate_open_rows, process_spawn_reliability, legacy_migration, install_portability, schema_acceptance, temp_file_injection. All eight covered.
- **Ruled out (5):** identity_projection, caller_contract, duplicate_open_rows, schema_acceptance, temp_file_injection.
- **Finding-linked (3):** process_spawn_reliability, legacy_migration, install_portability.
- **searchDebt:** none. `hasSearchDebt: false`.
- **Ledger rows:** 8, in `iterations/iteration-001.md` and `deltas/iter-001.jsonl`.

## 10. Audit Appendix

**Convergence summary.** One iteration ran. Graph convergence moved from STOP_BLOCKED (no dimensions covered) to STOP_ALLOWED (coverage 1.0, score 1.0). The loop stopped on the max-iterations hard stop. The claim-adjudication gate passed, because no P0 or P1 was raised.

**Coverage summary.** All four dimensions covered in iteration 1: correctness, security, traceability and maintainability.

**Ruled-out claims.** Command injection through the new spawn (argv-only, no shell). Schema rejection of the optional `executor` field. Duplicate opening rows on a sequential re-audit. The executor row being dropped by a refresh.

**Orchestrator spot check.** The three P2 claims were re-read at their cited lines and match the source.

**Sources reviewed.** The seven target files, the four deep YAML callers as cross-references and the run's own state log.

### Core Protocols

- `spec_code`: pass
- `checklist_evidence`: pass

### Overlay Protocols

- `skill_agent`: partial
- `agent_cross_runtime`: partial
- `feature_catalog_code`: not applicable
- `playbook_capability`: not applicable
