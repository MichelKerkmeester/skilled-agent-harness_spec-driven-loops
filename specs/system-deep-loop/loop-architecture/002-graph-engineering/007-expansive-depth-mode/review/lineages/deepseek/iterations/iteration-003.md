# Review Iteration 003

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 3 of 24
- Focus: **Frontier node F-1-006: correctness**
- Dimension: correctness
- Frontier node: F-1-006 (depth 1 of 3), scope `.skilled/commands/deep`, `.skilled/skills/system-deep-loop/deep-review/references`, `.skilled/skills/system-deep-loop/deep-research/references`, `.skilled/skills/system-deep-loop/runtime/feature-catalog`
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, the command docs and compiled contracts, `deep-review/references/convergence/convergence.md`, `deep-review/references/protocol/loop-protocol.md`, `deep-review/references/protocol/loop-state-and-gates.md`, `deep-review/references/state/state-jsonl.md`, `runtime/feature-catalog/executor/executor-config.md`, `runtime/feature-catalog/fanout/fanout-run.md`, `runtime/feature-catalog/script-entry-points/append-mode-event-script.md`, `runtime/feature-catalog/script-entry-points/convergence-script.md`.

## Files Reviewed

- `.skilled/commands/deep/review.md:108-112` and `.skilled/commands/deep/research.md:115-119` (`--executor` sandbox paragraph)
- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:284-290,363-370`
- `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown:279-285,342-349`
- `.skilled/commands/deep/assets/deep-review-presentation.txt:142,222`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:131,195`
- `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:137-180,453-458`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:284-289`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-state-and-gates.md:113-160`
- `.skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:97-101`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/executor-config.md:26-48`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:110,197,203,216,231`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/append-mode-event-script.md:29-53`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md:61,81`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The executor catalog claims the conformance test fails on any builder drift, but its `permission-mode` assertion cannot see a same-mode collapse** -- `.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/executor-config.md:29` -- The catalog states that "a builder that drifts from its record fails the test". For the `permission-mode` surface the test asserts only that `read-only` differs from `danger-full-access` (`executor-adapter-capabilities.vitest.ts:308-312`), so a builder that emits the same permission mode for `workspace-write` and `danger-full-access` passes. That is exactly the dsh collapse reported as R1-P2-001, and the catalog's stated safety net does not catch it. The claim is actionable in one place: the assertion should compare all three modes pairwise for a `permission-mode` surface.
   - Finding class: matrix/evidence
   - Scope proof: `rg -n "permission-mode" .skilled/skills/system-deep-loop/runtime/tests/unit/executor-adapter-capabilities.vitest.ts` returns the single assertion pair at 308-312; no other test asserts the dsh permission mode for `workspace-write` against `danger-full-access`. The catalog sentence is the only place that claims drift detection for the record as a whole.
   - Affected surface hints: ["executor adapter conformance test", "runtime/feature-catalog/executor/executor-config.md", "dsh command builder"]
   - Case: a maintainer changes the dsh builder so `workspace-write` and `danger-full-access` both emit `--permission-mode workspace-write` (the current state). The conformance suite stays green, and the catalog still tells the reader that drift cannot survive the suite.

## Findings - Refined

1. **R2-P2-001 refined: the feature catalog repeats the identity claim the projection contradicts** -- `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/append-mode-event-script.md:29` -- The catalog says the gateway "drops the row's `eventId`, `idempotencyKey`, `producer` and `authorityEpoch`" and that "None of the four is kept as a claim". The drop applies to the envelope metadata only; the review record travels whole as `data.record` and the projection spreads it, so a model-written `eventId` or `idempotencyKey` survives in the projected row. This is the same root cause as R2-P2-001, now stated as a documented guarantee rather than only a code comment, so the fix must correct the catalog sentence as well as the projection or the strip.
   - Finding class: instance-only
   - Scope proof: the catalog sentence and the code comment (`append-mode-event.cjs:104-107`) make the same claim; both are contradicted by the single projection spread at `deep-review-state-contract.ts:291-296`. No third statement of the claim was found.
   - Affected surface hints: ["append-mode-event CLI", "runtime/feature-catalog/script-entry-points/append-mode-event-script.md", "deep-review-state-contract projection"]
   - Case: an operator reads the catalog to learn what the state log can contain, concludes a model cannot put an `eventId` into a row, and writes a correlation check that trusts the state-log field.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `.skilled/commands/deep/review.md:111`, `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:140`, `.skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:97` | The three commits' doc claims match the code: the opencode sandbox paragraph matches the builder, the blocked-stop record is attributed to `convergence.cjs` with `--read-only` on a dry run, and the iteration row time is described as gateway-set with `claimedTimestamp`. |
| `checklist_evidence` | notApplicable | - | No spec checklist for a commit-range target. |
| `skill_agent` | notApplicable | - | No agent definition in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in the range. |
| `feature_catalog_code` | partial | `.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/executor-config.md:29`, `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/append-mode-event-script.md:29` | Two catalog claims overstate what the code guarantees: the drift-detection sentence (P2-1) and the identity-drop sentence (refinement of R2-P2-001). The rest of the catalog checked (fanout-run, convergence-script, executor-config capability record) matches the builders. |
| `playbook_capability` | notApplicable | - | The manual-testing playbooks describe operator scenarios, not a capability this node's code claims; no playbook claim was found to contradict the range. Recorded `notApplicable` rather than `pass` because no playbook was exercised. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:288` already states that "the deepseek harness narrows `danger-full-access` to `workspace-write`, and pi builds the same command for both write modes". That corrects the iteration-1 edge-case note that the narrowing was undocumented: the behavior is documented, and R1-P2-001 stands only on the provenance mismatch (`sandboxMode` and `sandboxEnforcement` in `effectiveConfig`), not on the narrowing being hidden.
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:110,197,203` matches the fan-out builders: claude `--output-format stream-json --verbose`, opencode `sandboxEnforcement` `compensating` under `workspace-write`, and `danger-full-access` as plain `--auto` with no deny.
- `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:140,456` and `loop-state-and-gates.md:113,157` both attribute the blocked-stop record to `convergence.cjs` and name `--read-only` for the dry run, matching the YAML's `step_bind_convergence_write_arg`.

## Edge Cases

- **Compiled contracts are generated.** `deep-review.contract.markdown` and `deep-research.contract.markdown` carry `sourceDigests` for `review.md`, the presentation asset and the YAML. Their body text matches the edited sources, so no hand-edit drift was found; a digest mismatch would be a generation failure, not a review finding.
- **Two claude log formats are both correct.** `loop-protocol.md:287` describes `--output-format text` for the `dispatch-iteration.cjs` branch, which still emits text (`dispatch-iteration.cjs:375-376`), while the fan-out builder emits `stream-json` (`fanout-run.cjs:2923-2925`). The doc names the branch it describes, so this is not drift.
- **`playbook_capability` marked `notApplicable`.** The playbooks in scope are operator procedures; none asserts a capability the range changed. Marking it `pass` would claim a check that was not run.
- **Ratio denominator correction.** Iterations 1 and 2 reported `newFindingsRatio` on an iteration-local denominator (1.0 each). The contract compares new against accumulated findings, so this iteration uses the accumulated denominator and later iterations follow it. The earlier values overstate novelty, which delays a stop rather than forcing one; the correction is recorded here rather than rewritten, because the ledger is append-only.

## Confirmed-Clean Surfaces

- **Opencode sandbox docs.** `review.md:111`, `research.md:118`, both presentations, both compiled contracts and `loop-protocol.md:286` all describe the same behavior: `--auto` always, `workspace-write` denies `external_directory` to file tools but not Bash, `danger-full-access` adds no deny, `read-only` is refused.
- **Blocked-stop attribution.** The convergence reference and the state-and-gates reference both name `convergence.cjs` as the producer and `--read-only` as the dry-run argument, matching the YAML binding.
- **Iteration row time.** `state-jsonl.md:97` and `append-mode-event-script.md:33` both describe the gateway clock plus `claimedTimestamp`, matching `deep-review-state-contract.ts:291-296`.
- **Executor capability catalog.** `executor-config.md:29` correctly describes the record's fields and the cost reader's opencode/claude-only cost, which matches `EXECUTOR_ADAPTER_CAPABILITIES` and `fanout-salvage.cjs`.

## Ruled Out

- **Compiled-contract drift.** Ruled out: the body text of both compiled contracts matches the edited `review.md`/`research.md` and presentation assets, and the digest headers were regenerated in the same commit.
- **A separate finding for the dsh narrowing being undocumented.** Ruled out after reading `loop-protocol.md:288`, which documents it; the surviving issue is the provenance mismatch already recorded as R1-P2-001.
- **A finding for the claude `--output-format` difference between dispatch paths.** Ruled out: the reference names the `dispatch-iteration.cjs` branch, and that branch still emits text.

## Next Focus

- Dimension: security
- Frontier node: F-1-002 (active, correctness covered; the reducer's breadth-first rule now returns to the shallowest node with the fewest visits)
- Focus area: the trust boundary between the parent environment and the child for the three node files: `buildExecutorDispatchEnv`'s per-kind allowlist, the dsh persona patch path resolution under `.dsh/agents`, and whether an inherited `OPENCODE_CONFIG_CONTENT` can re-enable a denied path.
- Reason: all three depth-1 nodes now have one correctness visit and no P0/P1; the next pass should rotate to security on the node with the highest-blast surface.
- Rotation status: correctness covered on F-1-002, F-1-004 and F-1-006; security next.
- Blocked/productive carry-forward: productive (doc-to-code comparison found one overstated guarantee and one refinement); no blocked approaches.
- Required evidence: `executor-audit.ts` env allowlist and `buildExecutorDispatchEnv`, `fanout-run.cjs` dsh patch path construction, and the opencode inline-config merge.
- Recovery note: none.

Review verdict: PASS
