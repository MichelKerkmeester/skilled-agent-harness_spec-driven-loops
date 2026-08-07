# Iteration 3: Parent Routing Canon versus Live Seven-Hub Runtime

## Focus
Compared the four parent canonical documents with the promoted compiled-routing runtime and the seven live hubs. The seven hubs were derived independently from both the promoted serving-closure manifest and the live hub roots: `sk-code`, `system-deep-loop`, `mcp-tooling`, `cli-external-orchestration`, `sk-prompt`, `sk-design`, and `sk-doc`. Frozen research, benchmark, lineage, output, log, and run-record artifacts were excluded.

## Findings
1. **P1 · NEW · introduced by `140266be3e`.** The routing reference is internally contradictory about rollout population. Its pipeline diagram and artifact section still say hub-level `smart-routing.md` and the typed surface exist only on `sk-code` and `sk-doc`, while the same document says all seven ship both. Commit `140266be3e` changed selected 2/7 statements to 7/7 but left the conflicting statements intact, creating the present contradiction. The live fleet confirms 7/7: every listed hub has `shared/references/smart-routing.md`, a manifest with the same mode count as its registry, and `resourceContractVersion: 1`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:45-56] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:64] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:122-138] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:180-200] [SOURCE: .opencode/bin/lib/compiled-routing/serving-closure.manifest.json:5-13]
2. **P1 · PRE-EXISTING · not introduced by `140266be3e`.** The parent reference describes benchmark replay's surface router and leaf manifest as the fleet-wide live resource-serving authority, but the actual promoted serving path compiles only hub policy/registry inputs and returns mode/destination targets. The runtime resolver gates on the default-on cohort, activation manifest, policy hash, and generation; `compiled-route.cjs` normalizes destination targets and does not consume `smart-routing.md` or `leaf-manifest.json`. Thus the documents conflate benchmark/typed-pair measurement authority with actual live serving authority. The compiled runtime and default-on cohort predate `140266be3e`, and that commit did not introduce the underlying serving-model prose. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:64-68] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:87-90] [SOURCE: .opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:73-88] [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/compiled-route.cjs:25-38] [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/compiled-route.cjs:94-107] [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:29-42]
3. **P1 · NEW · introduced by `140266be3e`.** `context-index.md` newly says making compiled routing the fleet default remains operator-gated, but the live resolver's unset-flag default cohort already contains all seven hubs and all seven activation manifests declare `servingAuthority:"compiled"` with `shadowOnly:false`. The runtime default-on implementation predates the documentation commit. `spec.md` independently preserves the same stale operator-gated position, but that specific spec line was not introduced by `140266be3e`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:108-112] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:71-75] [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:29-42] [SOURCE: .opencode/bin/lib/compiled-routing/010-live-activation/activation/sk-code/manifest.json:1] [SOURCE: .opencode/bin/lib/compiled-routing/010-live-activation/activation/sk-doc/manifest.json:1]
4. **P1 · PRE-EXISTING · not introduced by `140266be3e`.** Fleet manifest/version enforcement is not fully green: `parent-skill-check.cjs` passed guards 10a-10d for all seven hubs, but the same canonical checker fails sk-design's hard topology invariant 6a because the direct child `styles/` is neither a registered packet nor an allowlisted support directory. The directory and checker both existed before `140266be3e`; the documentation commit touched neither. This makes broad “all hard invariants enforced/passing fleet-wide” language unsafe even though manifest byte-drift, collision, and reachability checks themselves pass. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:895-899] [SOURCE: .opencode/skills/sk-design/mode-registry.json:39-165] [SOURCE: .opencode/skills/sk-design/styles/README.md:1] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:121-124]
5. **P2 · NEW · introduced by `140266be3e`.** The before/after canon now asserts policy metrics of 91/106 route-gold matches and a 91/91 mutation-teeth rate, but those figures are not encoded in the promoted live runtime or its activation manifests. The promoted closure contains per-hub canary fixtures and activation state, while each live manifest contains only schema, selected policy hash/generation, serving authority, and shadow state. Because the strategy excludes frozen benchmark/run artifacts, the exact 91/106 and 91/91 figures cannot be independently re-verified in this iteration and should be labeled program-evidence metrics rather than live-runtime metrics. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:17] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:152-161] [SOURCE: .opencode/bin/lib/compiled-routing/serving-closure.manifest.json:27-68] [SOURCE: .opencode/bin/lib/compiled-routing/010-live-activation/activation/cli-external-orchestration/manifest.json:1]

## Ruled Out
- The seven-hub identity and population are not ambiguous: the serving-closure manifest and the seven live `hub-router.json` roots agree exactly.
- Default-mode inventory is accurate: `sk-prompt` alone names `prompt-improve`; the other six are `null`. [SOURCE: .opencode/skills/sk-prompt/hub-router.json:5] [SOURCE: .opencode/skills/sk-code/hub-router.json:5]
- `resourceContractVersion` and manifest mode population are not stale: all seven registries and manifests declare version 1, and each manifest mode count equals its registry mode count. [SOURCE: .opencode/skills/sk-code/mode-registry.json:4] [SOURCE: .opencode/skills/sk-code/leaf-manifest.json:222] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:4] [SOURCE: .opencode/skills/sk-doc/leaf-manifest.json:220]

## Dead Ends
- Exact historical benchmark-metric reproduction was not attempted because benchmark/run artifacts are frozen and explicitly excluded by strategy. The smallest future verification is a non-frozen, current route-gold gate output promoted beside the serving closure.

## Edge Cases
- Ambiguous input: none; the focus and packet root were explicit.
- Contradictory evidence: canonical parent prose conflicts internally and with live serving behavior; both sides are preserved above.
- Missing dependencies: exact policy-metric evidence is unavailable within the allowed non-frozen surface, so finding 5 is an evidence-provenance limitation rather than a claim that the numbers are false.
- Partial success: the seven-hub checker chain stopped at sk-design's real 6a failure; sk-doc was rerun separately and passed. This is a researched defect, not an artifact-write failure.

## Sources Consulted
- `.opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:9-203`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:17-161`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:92-118`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:41-75`
- `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json:1-79`
- `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:29-150`
- `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/compiled-route.cjs:25-107`
- All seven hubs' `hub-router.json`, `mode-registry.json`, `leaf-manifest.json`, and `shared/references/smart-routing.md`
- `git show 140266be3e` and pre-commit object checks for changed-line attribution

## Assessment
- New information ratio: 1.0
- Questions addressed: `q3`, `q4-links`
- Questions answered: `q3`, `q4-links`
- Mandatory route proof: live `resolve.cjs` calls returned compiled decisions with policy hash/generation for all seven hubs (six `route`, one conservative `defer` for sk-design), proving the promoted resolver path rather than prose-only routing.
- Convergence telemetry only: ratio exceeds 0.05, but the max-iterations policy requires continuation through iteration 10.

## Reflection
- What worked and why: combining a seven-hub structural inventory, live resolver calls, canonical checker execution, and commit diff/object checks separated authored configuration, benchmark semantics, and actual serving authority.
- What did not work and why: the first scripted fleet-summary command had a Python f-string escaping error; it was replaced with a Node one-liner. The chained checker stopped on sk-design's genuine failure, so sk-doc was verified separately.
- What I would do differently: verify current non-frozen route-gold metric outputs if the next dispatch supplies an allowed promoted evidence path; do not infer those metrics from historical benchmark artifacts.

## Recommended Next Focus
Audit commit-level link and metric regressions in the remaining parent canon and live enforcement scripts, prioritizing claims that use “fleet-wide,” “authoritative,” or “PASS” without a promoted current evidence artifact.
