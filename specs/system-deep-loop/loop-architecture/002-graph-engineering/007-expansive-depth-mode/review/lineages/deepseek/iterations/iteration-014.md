# Review Iteration 014

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 14 of 24
- Focus: **Frontier node F-2-007: security**
- Dimension: security
- Frontier node: F-2-007 (depth 2 of 3, child of F-1-002), scope `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-adapter-capabilities.vitest.ts`
- Convergence before dispatch: `CONTINUE` / `noStopCandidate`, stuck 0, consecutive failures 0.
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, `fanout-run.cjs` containment call site.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4000-4065` (containment imports, mode resolution)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4848-4925` (containment result handling)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5155-5170` (containment in the lineage output)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:281-307` (preventive record)

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
| `spec_code` | pass | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4848-4925` | The call site reports every containment category the guard returns, and the catalog's description of the guard as after-the-fact and reported matches the code. |
| `checklist_evidence` | notApplicable | - | No spec checklist for a commit-range target. |
| `skill_agent` | notApplicable | - | No agent definition in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in the range. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4868-4887` records contested paths as a `containment_contested` ledger event and does not charge them to the lane, which matches the comment that the tree cannot say whose bytes they are.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4889-4903` records advisories as a `containment_advisory` event with the detected paths, so an advisory is never silent.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4905-4921` records a violation event, binds the findings, the recovery hint and the quarantine path, and `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5163` puts all three on the lineage output.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4055-4060` resolves the containment mode from the config with `preserve` as the default, so the destructive `restore` mode is opt-in.

## Edge Cases

- **The guard's internals are outside the commit range.** `write-containment.ts` is not among the 88 changed files, so this pass reviewed the call site's handling of the guard's result, not the guard's path construction. A finding there would be outside the review target.
- **`containment.event` is spread before the runner's own fields.** A guard-supplied `label` or `run_id` cannot override the runner's attribution, because the spread comes first.
- **A violation does not fail the lane.** The comment states the gates keep their own verdict and a finding never turns a failed lane into a passing one; the code matches, since the violation is recorded and the lane's status is decided elsewhere.
- **`restore` mode is opt-in.** The default is `preserve`, so the guard reports and quarantines without deleting.

## Confirmed-Clean Surfaces

- **Contested paths.** Reported, not charged.
- **Advisories.** Reported with their detected paths.
- **Violations.** Reported with findings, recovery hint and quarantine path.
- **Mode default.** `preserve`, with `restore` opt-in.
- **Attribution order.** The runner's fields win over the guard's event fields.

## Ruled Out

- **A security finding in the guard's path construction.** Ruled out of scope: `write-containment.ts` is not in the commit range.
- **A swallowed violation.** Ruled out: every category the guard returns reaches the ledger or the lineage output.
- **A destructive default.** Ruled out: `preserve` is the default and `restore` is opt-in.

## Next Focus

- Dimension: traceability
- Frontier node: F-2-007 (still active; traceability next)
- Focus area: whether the sandbox enforcement vocabulary (`preventive`, `compensating`, `none`) is defined in one place and used consistently by the catalog, the preview and the conformance test.
- Reason: F-2-007 security is clean; the node's remaining risk is that the three-value vocabulary is described differently in different docs.
- Rotation status: F-2-007 correctness and security complete; traceability next.
- Blocked/productive carry-forward: productive (call-site review confirmed the reporting path); no blocked approaches.
- Required evidence: the vocabulary definitions in `executor-config.ts`, `fanout-run.md` and the conformance test.
- Recovery note: none.

Review verdict: PASS
