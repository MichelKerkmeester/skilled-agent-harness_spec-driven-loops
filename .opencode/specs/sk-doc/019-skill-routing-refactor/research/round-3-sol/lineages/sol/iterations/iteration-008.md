# Iteration 8: Commit-Scoped Parent Canon Hunk Review

## Focus
Reviewed every canonical, non-frozen hunk changed by commit `140266be3e` in the parent `spec.md`, `context-index.md`, `routing-before-after.md`, `routing-config-and-advisor-reference.md`, `description.json`, and `graph-metadata.json`. Each changed claim, path, metric, status, topology statement, child count, fingerprint, and resume pointer was checked against current canonical files or the live compiled-routing resolver. Historical research, lineage, benchmark, log, output, and run-record artifacts were not treated as defects. The exact route was `mode=research target_agent=deep-research`; the deep-research skill definition was loaded and no sub-dispatch occurred.

## Findings
1. **No new P1/P2 finding survived verification and deduplication.** The changed-hunk defects that remain real are already recorded in this lineage: the bad `020/spec.md` and `021/spec.md` handoff paths, the mixed 2/7-versus-7/7 surface/manifest population statements, the 7/7 route-gold denominator, the operator-gated/default-on contradiction, and the metric-provenance limitation. The remaining changed topology, metadata, default-mode, and repo-rooted consumer-path statements matched current files or live behavior. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-003.md:6-19] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-004.md:6-15] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-005.md:6-18] [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:29-42]

## Ruled Out
- **Duplicate, not new:** `spec.md:133` points to nonexistent `020/spec.md` and `021/spec.md`; iteration 4 already reported and commit-attributed this exact defect. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:133] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-004.md:7]
- **Duplicate, not new:** changed 7/7 surface-router, manifest, and `resourceContractVersion` statements still conflict with unchanged 2/7 prose in the same routing reference; iteration 3 already captured the commit-created mixed-population contradiction. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:45-64] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:182-202] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-003.md:7]
- **Duplicate, not new:** `routing-before-after.md`'s changed 7/7 route-gold framing is contradicted by six-applicable-hub canonical evidence; iteration 5 already narrowed the defect to the denominator rather than the 91/106 arithmetic. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:17] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:152-161] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-005.md:7]
- **Topology verified:** the changed nested-topology paragraph's direct counts, 17-folder `007` inventory, duplicate `012` prefix, and 3/3/4/14 sub-parent counts matched the current directory tree. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:53-64]
- **Metadata verified:** the root graph contains exactly the 21 current direct children, the removed `000-migration-plan` child is absent on disk, and `last_active_child_id` resolves to the real `020-router-unification-program` child. Strict validation reported clean root generated-metadata integrity/drift and child-list consistency; therefore no fingerprint or children-count defect was promoted. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:6-27] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:118-123]
- **Description verified:** the visibly clipped synopsis is bounded generated metadata rather than an accidental broken path or topology claim; the routing reference itself documents the description field as a maximum-150-character synopsis. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/description.json:3-23] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:149-157]
- **Current route behavior verified:** unset-flag resolver calls returned generation/hash-bound compiled decisions for all seven hubs, preserving the already-reported contradiction with operator-gated prose but adding no new commit-scoped defect. [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:29-42] [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:99-129]

## Dead Ends
- Reclassifying already-recorded changed-hunk defects as new would duplicate iterations 3–5 and inflate novelty.
- The recursive strict validator surfaced many known child-packet failures, but those are outside this iteration's parent changed-hunk scope and were not promoted.

## Edge Cases
- Ambiguous input: none; the six target files and commit boundary were explicit.
- Contradictory evidence: changed parent prose still conflicts with unchanged prose and canonical child evidence, but all such conflicts were exact duplicates of prior findings.
- Missing dependencies: raw frozen route-gold/mutation records remain excluded, so the already-recorded metric-provenance limitation was not re-opened.
- Partial success: none; all changed hunks were classified, and mandatory route proof succeeded for all seven hubs.

## Sources Consulted
- `git diff --unified=0 140266be3e^ 140266be3e` for all six requested parent files
- `.opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:55,120,132-134,174`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:53-64,113-118`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:17,84,129-163`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:79-90,97,122,178-202,234-236`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/description.json:1-34`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:1-125`
- `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:29-42,99-129`
- Root strict validation plus exact directory, target-path, child-count, and seven-hub resolver probes

## Assessment
- New information ratio: 0.0
- Novelty justification: zero new findings survived deduplication; the iteration contributed exhaustive negative knowledge over the commit's six-file changed-hunk surface.
- Questions addressed: parent commit regression inventory, broken links, metrics, status/topology claims, fingerprints, child counts, and mandatory route proof
- Questions answered: the line-by-line parent commit regression inventory is closed; no additional NEW P1/P2 defect was found
- Mandatory exact route proof: `mode=research target_agent=deep-research`, skill definition loaded, no sub-dispatch; live `resolve.cjs` calls returned compiled decisions for `sk-code`, `system-deep-loop`, `mcp-tooling`, `cli-external-orchestration`, `sk-prompt`, `sk-design`, and `sk-doc`.
- Convergence telemetry only: `0.0 < 0.05`, but max-iterations policy requires continuation through iteration 10.

## Reflection
- What worked and why: a zero-context commit diff followed by exact current-file, directory-count, validator, and resolver checks made every changed line classifiable without rereading excluded artifacts.
- What did not work and why: recursive strict validation produced high-volume known child failures; it was useful only for root metadata and topology checks, not as a source of new parent-hunk findings.
- What I would do differently: keep the final pass commit-scoped and use promoted canonical reports only to reconcile severity/classification, not to reopen frozen metric evidence.

## Recommended Next Focus
Perform final deduplication and severity/classification reconciliation across all accumulated findings, then use iteration 10 for the max-iterations terminal verification pass.
