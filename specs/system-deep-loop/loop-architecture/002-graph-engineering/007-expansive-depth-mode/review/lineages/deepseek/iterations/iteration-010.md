# Review Iteration 010

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 10 of 24
- Focus: **Frontier node F-1-002: maintainability**
- Dimension: maintainability
- Frontier node: F-1-002 (depth 1 of 3), scope `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- Convergence before dispatch: `CONTINUE` / `noStopCandidate`, stuck 1, consecutive failures 0.
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, the three node files, `executor-config.vitest.ts`, `combo-matrix.vitest.ts`.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:112-143,197-307,379-430,524-562,620-659` (flag support, capability record, allowlists)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3050-3070,3109-3130,3231-3245,3350-3390,3450-3456` (mirrored allowlists and provider maps)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:966-1118` (allowlist content assertions)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts:66-110` (per-model command construction)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. This pass produced no new finding.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts:66-74` | The hand-duplicated allowlists are covered by a parity check in the direction that matters: every model in the TypeScript list is built through the fan-out builder, so a model missing from the fan-out set fails the suite. |
| `checklist_evidence` | notApplicable | - | No spec checklist for a commit-range target. |
| `skill_agent` | notApplicable | - | No agent definition in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in the range. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts:70-74` maps `CURSOR_SUPPORTED_MODELS`, `DEVIN_SUPPORTED_MODELS`, `PI_SUPPORTED_MODELS`, `DSH_SUPPORTED_MODELS` and `VIBE_SUPPORTED_MODELS` into the per-kind model matrix, and the suite builds a command for each entry. A model present in the TypeScript list but absent from the fan-out set throws "not in the enforced allowlist" and fails the test, so the duplication is guarded in the fail-closed direction.
- `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:966-1118` pins each allowlist's exact contents, so an accidental removal is caught even before the builder runs.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:191-196` states that the capability record is checked against the builders by a conformance test rather than read by them, which is the documented design for the duplication.

## Edge Cases

- **The reverse parity direction is untested.** A model present in the fan-out set but absent from the TypeScript list would not fail a test. That direction is fail-open only in the sense that the fan-out would accept a model the config rejects; the config is the gate, so the entry is unreachable. Not a finding.
- **`EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` and `EXECUTOR_ADAPTER_CAPABILITIES[].sandboxSurface` are parallel records.** They are not derivable from each other — claude's `permission-mode` is preventive, devin's is not — so the duplication is intentional and documented at `executor-config.ts:281-296`.
- **The capability record is documentation-as-code.** It is read by the conformance test and the catalog, not by the builders, which the record's own comment states. A reader expecting runtime enforcement from it is reading it wrong.

## Confirmed-Clean Surfaces

- **Allowlist duplication is bounded and tested.** Four mirrored lists, each pinned by content assertions and exercised through the builder.
- **Comment accuracy after the range.** The comments the range rewrote (`executor-config.ts:117-142,281-306`, `fanout-run.cjs:2973-2975,3005-3008`) describe the code beside them.
- **No dead exports.** Every exported allowlist and predicate has a test or a builder consumer.
- **Capability record shape.** One frozen record per kind, with a table-driven conformance test, so a new kind cannot be added without a record.

## Ruled Out

- **A maintainability finding for the mirrored allowlists.** Ruled out: the fail-closed direction is tested through the builder, and the fail-open direction is unreachable because the config gates first.
- **A finding for the single-member `ExecutorResumeMode` union.** Ruled out: it documents the contract that no builder resumes a provider session, and the conformance test asserts it for every kind.
- **A finding for the lazy `require` inside `sandboxEnforcementFor`.** Ruled out: it is the documented way a CJS script loads the TypeScript record, and Node caches the module.

## Next Focus

- Dimension: maintainability
- Frontier node: F-1-004 (active; the reducer's breadth-first rule selects the shallowest node with the fewest visits)
- Focus area: the gateway's maintainability: whether `GATEWAY_IDENTITY_FIELDS` is a denylist that a future identity field would slip past, whether `eventContentDigest`'s head-nulling is explained where a maintainer will find it, and whether the conflict path's stderr write duplicates the JSON line.
- Reason: F-1-002 maintainability is clean; the gateway node has three dimensions covered and maintainability is its last.
- Rotation status: F-1-002 all four dimensions covered; F-1-004 maintainability next.
- Blocked/productive carry-forward: productive (parity-test tracing closed the duplication question); no blocked approaches.
- Required evidence: `GATEWAY_IDENTITY_FIELDS`, `eventContentDigest`, and the conflict stderr path.
- Recovery note: none.

Review verdict: PASS
