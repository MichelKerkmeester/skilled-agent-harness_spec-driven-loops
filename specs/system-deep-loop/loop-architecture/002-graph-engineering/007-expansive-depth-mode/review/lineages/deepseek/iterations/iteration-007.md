# Review Iteration 007

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 7 of 24
- Focus: **Frontier node F-1-002: traceability**
- Dimension: traceability
- Frontier node: F-1-002 (depth 1 of 3), scope `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- Convergence before dispatch: `CONTINUE` / `noStopCandidate`, stuck 0, consecutive failures 0.
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, the three node files, `runtime/feature-catalog/executor/executor-config.md`, `runtime/feature-catalog/fanout/fanout-run.md`, `runtime/feature-catalog/fanout/fanout-salvage.md`, `deep-review/references/protocol/loop-protocol.md`, and the three commit messages.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:112-143,197-307` (flag support, adapter record, preventive record)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:100-200,1078-1102,1404-1425`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2870-3048,3392-3448,3560-3626`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:101-163` (cost reader)
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/executor-config.md:26-48`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:110,197,203`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-salvage.md:58`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:284-289`
- Commit messages: `555487146e2`, `8170db46079`, `47ba2a08a85`.

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
| `spec_code` | pass | `555487146e2`, `8170db46079`, `47ba2a08a85`; `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4162-4170`; `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:429-495`; `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` `--read-only` refusal | Each commit message names a behavior the code implements: the dry-run convergence call is bound to `--read-only`, the review row mints identity and refuses a reused key with other content, and the blocked-stop record is withheld on a dry run. No message claims more than the diff does. |
| `checklist_evidence` | notApplicable | - | The review target is a commit range, not a spec packet; no checklist exists to verify. |
| `skill_agent` | notApplicable | - | No agent definition is in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror is in the range. |
| `feature_catalog_code` | pass | `.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/executor-config.md:26-48`, `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:110,197,203` | Every catalog claim checked matches the code: the adapter record's fields, the cost reader's opencode/claude-only cost, the claude stream-json log, the opencode compensating control and the dsh narrowing. |
| `playbook_capability` | notApplicable | - | No playbook asserts a capability this node's code owns. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-salvage.md:58` says a lineage's cost adds up its live and rotated logs, and `fanout-salvage.cjs:137-163` does exactly that per attempt. The claude reader takes the last cumulative `result` cost per log (`:115-118`), so summing across attempts is correct and does not double-count within one attempt.
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/executor-config.md:29` names the conformance test as the drift check; the test exists and covers binary, prompt channel, log format, effort surface, sandbox surface and cost source. Its one weak assertion is already reported as R3-P2-001.
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:288` documents the dsh narrowing and the pi same-command behavior, which is the traceability evidence that R1-P2-001 is a provenance-label issue rather than an undocumented behavior change.

## Edge Cases

- **The commit range includes a merge-free linear history.** All three commits are ordinary fixes; no merge commit needed the `merge-no-own-diff` prune.
- **`spec_code` for a commit range has no spec document.** The commit messages are the stated contract, so the protocol compares each message to the diff it names rather than to a `spec.md`. Recorded as `pass` on that basis, not as `notApplicable`, because the messages do make verifiable claims.
- **The adapter record is documentation-as-code.** `EXECUTOR_ADAPTER_CAPABILITIES` is read by the conformance test and the catalog, not by the builders. That is the documented design (`executor-config.ts:191-196`), so a reader expecting runtime enforcement from the record is reading it wrong, not finding drift.

## Confirmed-Clean Surfaces

- **Flag-support table vs builders.** Every field in `EXECUTOR_KIND_FLAG_SUPPORT` is either consumed by the builder or by the runner's timeout/env path; no kind advertises a field its builder ignores silently.
- **Cost source per kind.** `log` for opencode and claude, `none` for every other kind, matching `readLineageProviderCostUsd`'s behavior.
- **Prompt channel per kind.** `argv`, `stdin` and `file` each match the builder's actual argument placement.
- **Resume.** Every record says `artifact`, and no builder passes a provider-session resume flag.

## Ruled Out

- **A cost double-count across rotated claude logs.** Ruled out: rotation is per attempt, and each attempt's log carries its own cumulative total, so summing attempts is correct.
- **A flag-support entry the builder ignores.** Ruled out: the dsh `reasoningEffort` entry is documented as baked into the route patch, which the builder states at `fanout-run.cjs:3619-3620`.
- **A commit message overstating its diff.** Ruled out: each of the three messages names a behavior the diff implements, and none claims a broader guarantee.
- **A traceability finding from the dsh narrowing.** Ruled out as a duplicate of R1-P2-001 and its iteration-3 refinement.

## Next Focus

- Dimension: traceability
- Frontier node: F-1-004 (active; the reducer's breadth-first rule selects the shallowest node with the fewest visits)
- Focus area: the gateway's cross-references: whether the `deep-review-state.jsonl` field list in `state-jsonl.md` matches what the projection actually writes, and whether the ledger event stems named in the catalog all have a registered producer.
- Reason: F-1-002 traceability is clean; the gateway node has had correctness and security passes and its documented state shape is the next traceability surface.
- Rotation status: F-1-002 correctness, security and traceability covered; F-1-004 traceability next.
- Blocked/productive carry-forward: productive (commit-message-to-diff comparison and cost-reader tracing both held); no blocked approaches.
- Required evidence: `state-jsonl.md` field list, the projection contract's row construction, and the stem registry.
- Recovery note: none.

Review verdict: PASS
