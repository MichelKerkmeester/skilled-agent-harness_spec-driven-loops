# Iteration 8: Ownership, Live-Read Provenance, and Synthesis Decisions

## Focus

Finalize universal-preamble ownership, define the live observed-leaf provenance needed to measure actual reads, close the two broad router-input questions at their evidence boundary, and reconcile those decisions with the ranked recall optimizations and anti-gaming gates. This is a synthesis-oriented final iteration; it does not implement or dispatch.

Canonical route proof: `Resolved route: mode=research target_agent=deep-research`.

## Findings

1. **The broad router-input question is answered, but at three distinct boundaries.** In deterministic replay, `INTENT_SIGNALS` selects near-top intent rows, `RESOURCE_MAP` supplies their candidate leaves, and `DEFAULT_RESOURCE` seeds every route; in hub routing, those structures do not directly select workflow/surface packet entrypoints; in live Mode B, their effect on actual reads remains unmeasured because the executor scores model-stated resources and retains only best-effort, deduplicated path extractions. The evidence gap is therefore causal live leaf use—not deterministic selection or hub topology—and another static trace cannot close it. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:185-239] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:317-418] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327]

2. **Choose an explicit non-routable shared owner for genuinely universal preamble leaves; do not add an ordinary `shared` mode.** The current resolver recognizes only a declared-mode packet prefix or one authored shared alias, refuses to infer shared ownership, and fails closed otherwise. An alias is correct only when each physical file has one truthful existing-mode owner; an ordinary shared mode changes routable registry topology; silent exclusion is unsupported. The synthesis decision is therefore to extend the typed contract with a validated non-routable/shared ownership category, then regenerate identity artifacts without changing the raw selected-resource set. This decision is falsified if every universal file can be assigned one honest existing mode (use aliases instead), or if the governing typed-pair standard rejects non-routable owners (then physical ownership/topology must be redesigned and surface invariance re-proven). [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:190-275] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:420-488] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/iterations/iteration-006.md:15-17]

3. **Actual-read measurement needs an ordered evidence stream plus a separate route-decision provenance stream.** Replace `raw.observedReads` as the metric source with append-order events carrying run/scenario identity, event index and monotonic time, tool/operation, requested input, canonical resolved path, success/outcome, manifest digest, and resolved typed identity. Count only successful exact file reads as leaf reads; preserve glob/grep discoveries and Bash-derived hints on separate diagnostic channels. Separately record each router candidate's origin (`DEFAULT_RESOURCE` or contributing intent/map row), score/tie decision, and surface/language retention. Joining these streams supports Hit@k, Recall@k, MRR, and calls/time-to-first-expected; causal attribution still requires controlled paired interventions because a path join alone proves correlation. Falsifying fixtures must show that order survives deduplication, failed reads and glob patterns do not count, aliases canonicalize deterministically, and paths outside the target skill are rejected. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:201-275] [INFERENCE: ordered successful-read events joined to a frozen manifest can measure actual leaf access, while causal router-input claims require an intervention beyond observational joining]

4. **Ordered recommendation set:** (0) freeze a same-revision baseline, add ordered live-read/route provenance, and correct minimum-versus-exhaustive D3 gold; (1) add the explicit non-routable shared-owner contract as identity remediation; (2) test a two-tier `RESOURCE_MAP` with small required sets and predicate-gated supplements; (3) only then test specificity-aware leaf-intent weights/tie control; (4) accept changes only through preregistered fitted, sealed holdout, negative, topology, route-budget, and live-read gates. Identity work is not a recall gain, and generated JSON is evidence output, not an optimization surface. Falsification is conjunctive: any loss of the frozen 18/18 surface routes, raw-route change in the identity-only candidate, holdout/negative regression, route-budget increase, or failure to improve ordered live-read recall rejects the relevant candidate. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/iterations/iteration-006.md:7-28] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-state.jsonl:19] [INFERENCE: provenance and sound gold must precede optimization so candidate selection cannot redefine the metric it is judged by]

5. **Research can stop with the implementation outcome still unverified.** All five charter questions now have either a source-backed answer or an explicit experimental boundary: deterministic inputs, benchmark composition, ownership choice, ranked optimization, and anti-gaming validation are synthesis-ready; actual live read gains and post-change surface invariance require implementation-time experiments forbidden in this run. Stop conditions for the next phase are: preserve exact raw routes for identity-only work, preserve 18/18 surface expectations for every candidate, require non-empty independently authored holdouts, and reject causal live-read claims without ordered provenance plus a controlled intervention. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-strategy.md:24-45] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/iterations/iteration-006.md:61-75] [INFERENCE: the remaining uncertainty is experimental rather than a missing research decision]

## Ruled Out

- An ordinary `shared` registry mode as an identity-only fix: it changes hub topology and therefore cannot inherit the raw-route/surface-invariance claim. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:463-488]
- Multiple aliases for one shared disk path: the resolver returns the first match, making ownership order-dependent. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:227-236]
- Current `raw.observedReads` as ordered actual-load or causal evidence: it regex-extracts tool inputs and deduplicates paths without success, order metrics, or router-input provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327]
- Re-running deterministic traces or editing generated manifest/report JSON to claim recall; both directions are already exhausted and do not measure live use or select a missing raw leaf. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-strategy.md:117-135]

## Dead Ends

- Silent exclusion of the preamble from the typed contract remains fail-open and unsupported; only an explicit validated category can represent a non-leaf/shared owner.
- Static source inspection cannot prove actual live leaf recall, read order, or post-change 18/18 invariance. Those require instrumented, same-revision experiments.

## Edge Cases

- Ambiguous input: The reducer strategy still names the broad router-input question, while the rendered final prompt prioritizes ownership/provenance synthesis. The narrower rendered focus was used and the broad question was explicitly closed across deterministic, hub, and live boundaries.
- Contradictory evidence: None newly introduced. Prior report-versus-current-source count drift is preserved as the reason to require a fresh same-revision baseline.
- Missing dependencies: The live executor lacks ordered successful-read and router-origin provenance, so actual live leaf recall and causal attribution remain experimentally unverified; an explicit non-routable shared-owner schema also does not yet exist.
- Partial success: None. The research questions are answered with a bounded experimental gap; no implementation outcome is claimed.

## Sources Consulted

- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/prompts/iteration-8.md:1-39`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-config.json:1-77`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-state.jsonl:1-20`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-strategy.md:24-285`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:1-525`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/iterations/iteration-006.md:1-75`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:180-289`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:260-374`

## Assessment

- New information ratio: 0.50
- Novelty basis: Four of five findings partially reorganize prior evidence and one is redundant confirmation, yielding 0.40, plus a 0.10 simplicity bonus for closing both remaining questions with one ownership/provenance model.
- Questions addressed: How do router inputs influence deterministic, hub, and live behavior? Does a shared mode clear the contract error without degrading surface routing? What ownership and provenance decisions make the optimization set falsifiable?
- Questions answered: Both remaining charter questions. A declared shared mode can clear identity only through a topology-changing coordinated change and cannot promise unchanged surface routing; use a truthful alias or add an explicit non-routable shared owner. Router inputs are deterministically understood, while live actual-read effects require the specified provenance experiment.

## Reflection

- What worked and why: Separating identity ownership, route-decision provenance, and successful-read evidence prevented a contract fix from being mislabeled as recall improvement and turned the remaining live ambiguity into a falsifiable instrumentation requirement.
- What did not work and why: Existing live telemetry cannot establish read order, read success, canonical typed identity, or causal router origin because it stores deduplicated regex matches from tool inputs.
- What I would do differently: In the implementation phase, preregister the baseline and acceptance matrix before changing either the ownership schema or router, then run identity and recall candidates independently.

## Recommended Next Focus

Synthesize the eight iterations into the final research report, then plan two isolated implementation experiments: first provenance plus explicit shared-owner/D3 contract work with raw-route invariance, then two-tier map and specificity scoring with frozen surface, sealed holdout, negative, route-budget, and ordered live-read gates.
