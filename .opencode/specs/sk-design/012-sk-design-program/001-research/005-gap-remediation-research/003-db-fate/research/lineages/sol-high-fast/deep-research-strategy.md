# Deep Research Strategy: Styles SQLite Database Fate

## 1. Research Topic

Decide whether to fully wire and populate the dormant styles SQLite database as the default retrieval path or formally shelve it and retain the flat-file engine as the single source.

## 2. Non-Goals

- Do not implement, remove, rename, or relocate styles code or data.
- Do not modify the parent spec packet or any path outside this detached lineage.
- Do not decide the separate interface-command rewrite or styles-directory naming questions.
- Do not treat code existence or passing unit tests alone as proof of production need.

## 3. Stop Conditions

- Complete exactly five iterations because `stopPolicy=max-iterations`.
- Produce an evidence-backed recommendation, decision framework, keep-path wiring plan, and shelf-path deprecation plan.
- Ground the recommendation in the four design-mode corpus consumers and current operational evidence.

<!-- ANCHOR:key-questions -->
## 4. Key Questions (Remaining)

- [x] What contract and workload do design-interface, design-motion, design-audit, and design-foundations actually require from the styles library?
- [x] How complete is the persistent implementation, and what exact work remains to make it the default and populate a real database?
- [x] What measurable benefits justify SQLite at the present corpus size, and what recurring operational costs would default persistence introduce?
- [x] Which decision criteria and thresholds should govern keep versus shelve?
- [x] What are the safe wiring and deprecation plans, including rollback and preservation of useful evidence assets?
<!-- /ANCHOR:key-questions -->

<!-- ANCHOR:answered-questions -->
## 5. Answered Questions

- The four consumers require a bounded, generation-safe `runQuery`/`runHydrate` facade and degrade safely when retrieval is unavailable; none requires SQLite specifically. (iteration 1)
- The persistent implementation is mature, but a real default requires a published initial generation plus explicit build/distribution/refresh/repair ownership and live cutover evidence. (iteration 2)
- Persistent selection avoids substantial repeat-query corpus I/O, but the only direct speed assertion is a 20-style fixture; present-scale materiality, workload demand, relevance quality, and lifecycle cost remain unmeasured. (iteration 3)
- A weighted present-state framework scores formal shelving 85/100 versus wiring 54/100; reversal requires conjunctive workload, materiality, lifecycle, parity, relevance, shadow, rollback, and demand gates. (iteration 4)
- Both paths are reversible: wiring requires distribution, build/refresh ownership, shadow/relevance gates, then cutover; shelving removes live DB code/modes and supersedes the roadmap while preserving the flat manifest and design evidence. (iteration 5)
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 6. What Worked

- Consumer-to-facade tracing: showed that backend choice is isolated below all four corpus modules. (iteration 1)
- Implementation-versus-integration separation: distinguished mature database code from the absent operational lifecycle. (iteration 2)
- Evidence-class separation: distinguished correctness, directional speed, material speed, and product demand. (iteration 3)
- Weighted scoring and sensitivity check: made judgment explicit and showed the result is not dependent on one criterion. (iteration 4)
- Dependency and manifest-ownership scans: bounded the shelf blast radius and protected the flat engine's retrieval manifest. (iteration 5)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 7. What Failed

- Initial wildcard include search: returned no files because the path/include shape was too broad; replaced with an exact call-site search. (iteration 1)
- First-segment indexer read: did not reach the build function, so operator and README evidence were used to triangulate the published lifecycle. (iteration 2)
- Exact ROI modeling: blocked by the absent full-corpus database, workload trace, build timing, and human relevance set. (iteration 3)
- Broad feature-token search: included database internals, so its absence claim was narrowed to consumer call sites. (iteration 4)
- Pro-wire workload hypothesis: could not be tested because no runtime query trace exists; retained as a reactivation gate. (iteration 5)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 8. Exhausted Approaches

- Database-specific consumer rewrites: ruled out because all consumers already call the adapter-backed facade. (iteration 1)
- SQLite as authoritative content storage: ruled out because hydration remains flat-file artifact access. (iteration 1)
- Default flip without build/distribution: ruled out because clean checkouts have no pointer or generation file. (iteration 2)
- Capability inventory as business justification: ruled out because consumer demand and measured value are separate. (iteration 2)
- Synthetic 20-style timing as production justification: ruled out because it proves direction but records no materiality. (iteration 3)
- Correctness suite as demand proof: ruled out because safety and usefulness are separate questions. (iteration 3)
- Dormant-code optionality: ruled out because Git history and decision evidence preserve recovery without active runtime ownership. (iteration 4)
- Sunk-cost promotion and one-benchmark promotion: ruled out by conjunctive promotion gates. (iteration 4)
- Lazy query-time builds, shelf-with-live-switches, and deleting the flat retrieval manifest: ruled out as unsafe or non-remediating. (iteration 5)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 9. Ruled-Out Directions

None yet.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:carried-forward-open-questions -->
## 10. Carried-Forward Open Questions

None yet.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. Next Focus

Synthesis complete after the fifth iteration; no further research focus.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. Known Context

- The gap analysis reports 1,290 style folders, no SQLite file, a `legacy` default, and four corpus modules routed through `_engine/style-library.mjs`. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:22-89]
- The database foundation packet reports 69 passing tests for generation manifests, telemetry, differential oracle, fixtures, and judgments, but identifies live-corpus telemetry and human relevance labels as unresolved. [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/001-foundation/implementation-summary.md:50-57] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/001-foundation/implementation-summary.md:117-123]
- `resource-map.md` is not present in the target spec folder; skipping the input coverage gate.

## 13. Research Boundaries

- Maximum iterations: 5
- Stop policy: max-iterations
- Convergence threshold: 0.05, telemetry only before iteration 5
- Allowed write root: this detached `sol-high-fast` lineage only
- Per-iteration write set: one prompt, one narrative, one delta, one state-log append, then workflow-owned reducer projections
