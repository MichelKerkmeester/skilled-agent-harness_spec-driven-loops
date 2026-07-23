# Parent Packet Audit — Final Research Synthesis

## 1. Executive Summary

The root `001`–`021` phase map and A–F membership are accurate, but the parent packet is not safe as a resume surface. The most consequential defects are in generated metadata, current routing-reference claims, lifecycle-status authority, and nested-topology guidance. No audited source was modified.

## 2. Scope

Audited:

- `spec.md`
- `context-index.md`
- `routing-config-and-advisor-reference.md`
- `routing-before-after.md`
- `graph-metadata.json`
- `description.json`
- live child metadata/status surfaces needed to verify parent claims

Excluded: frozen `research/**`, `benchmark/**`, `lineages/**`, `*.out`, `*.log`, and run-record artifacts.

## 3. Method

Ten forced-depth iterations covered tree inventory, A–F grouping, both routing references, metadata, cross-links/handoffs, stale-token scans, lifecycle reconciliation, structural continuity, and adversarial falsification. Every iteration produced a narrative, canonical state record, and delta record.

## 4. Confirmed Structural Baseline

- The root has exactly 21 numbered direct children, `001`–`021`, and every basename appears once in the parent phase map. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:94]
- A–F is a complete, non-overlapping direct-layer partition: A `001–004`, B `005–009`, C `010–014`, D `015–019`, E `020`, F `021`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:47]
- The duplicate `012` collision is nested under `020/007`; it is not a root collision. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/spec.md:50]
- Root `015-sk-code-router-alignment` is a standard packet; nested `020/007/015-routing-coverage-activation-verification` is the 14-child phase parent. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/graph-metadata.json:6] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/graph-metadata.json:6]

## 5. P1 Findings — Metadata and Resume Integrity

### P1.1 — `children_ids` contains a nonexistent `000-migration-plan`

The parent graph lists 22 children because it prepends `000-migration-plan`; that path is absent and the authored/live phase map begins at `001`. Graph traversal can therefore target a ghost child. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:6] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:96]

### P1.2 — `description.json` still describes only the narrow ten-packet predecessor

The synopsis says the problem is ten sk-doc `create-` packets, while the current parent purpose spans fleet routing, compiled serving, and documentation quality across 21 children. Memory search can under-rank the packet for most of its actual scope. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/description.json:4] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:49]

### P1.3 — `last_active_child_id` is null despite active work

The parent map marks direct and nested work active/in progress, but metadata supplies no active child. Automated resume cannot select an authoritative continuation target. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:123] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:110]

## 6. P1 Findings — Authoritative Routing Reference

### P1.4 — The same document claims both 2-of-7 and 7-of-7 rollout

The diagram, LIVE notes, and coverage table say surface routers/manifests exist only on `sk-code` and `sk-doc`, including “populated 2/7.” Elsewhere the file correctly says all seven hubs ship them. The live tree confirms 7-of-7. Because the document calls itself definitive, this is a load-bearing contract contradiction. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:48] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:182] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:199]

### P1.5 — Default-mode inventory is stale for four hubs

The reference names defaults for five non-sk-code/sk-doc hubs; only `sk-prompt` retains its named default. `sk-design`, `mcp-tooling`, `system-deep-loop`, and `cli-external-orchestration` are now null/defer. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:79] [SOURCE: .opencode/skills/sk-design/hub-router.json:5] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:5] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:5] [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:5]

### P1.6 — `resourceContractVersion` is falsely described as sk-doc-only

The reference describes registry activation as single-hub and sk-code as fallback-driven. All seven live registries declare version `1`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:187] [SOURCE: .opencode/skills/sk-code/mode-registry.json:4] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:4] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4]

## 7. P1 Findings — Before/After Reference

### P1.7 — The current “After” architecture omits compiled-routing serving authority

The document stops at Advisor → Hub → Surface and presents legacy router artifacts as the operational after-state. Group E and all seven hub SKILL surfaces now place compiled routing ahead of the legacy kill-switch fallback. A debugger following this reference starts at the wrong serving layer. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:23] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:68] [SOURCE: .opencode/skills/sk-doc/SKILL.md:54]

### P1.8 — It presents completed verification as the current next step

Mutation testing and live-mode checking are written in future tense, but the current Group E verification records completed teeth tests and live sampling, with narrower remaining gaps. Resuming from this document repeats completed work. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:158] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:28] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:92]

## 8. P1 Findings — Broken Links and Paths

### P1.9 — Root `Parent Spec` pointer is broken

The parent metadata says this top-level packet has no parent, yet RELATED DOCUMENTS points to `../spec.md`; that target does not exist under the `sk-doc` track. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:37] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:171]

### P1.10 — Both Layer-2 paths in `routing-before-after.md` use removed underscore spelling

The document twice names `shared/references/smart_routing.md`; the current canonical path on all seven hubs is `shared/references/smart-routing.md`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:84] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:129] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:128]

## 9. P1 Finding — Lifecycle Authority Split

Parent rows `015` and `018` say in progress while their child specs/graphs remain planned; `019` is research-complete in parent/spec but in-progress in graph metadata. Nested parents `020` and `021` are active/in progress in the root narrative but planned in their graph roots. No document defines which lifecycle surface wins. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:110] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/graph-metadata.json:42] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/graph-metadata.json:42] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:41]

## 10. P1 Finding — Nested Topology Is Missing from the Parent Continuity Bridge

`context-index.md` accurately says Group E has seven children, but does not qualify that as direct depth and omits the nested `020/007` duplicate-`012` collision and 14-child phase-parent `015`. Combined with null `last_active_child_id`, a bare “phase 015” or “012 collision” can send a resumer to the wrong packet. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:53] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/spec.md:50]

## 11. P2 Findings

1. **Incomplete handoff map.** The table covers A→B, C research→fixes, and only D `016/017/019`→implementation; active `015`, `018`, `020`, and `021` have no actionable handoff despite the aggregate closeout criterion. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:41] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:124]
2. **Misleading single-document note.** `spec.md` says it is the only authored parent document while naming `context-index.md`; two additional authored routing references also exist. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:55]
3. **Stale consumer line citations and non-rooted RELATED paths.** Several function ranges no longer contain the named symbols, and literal skill-tree paths omit `.opencode/skills/`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:87] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:234]
4. **Validation metric scopes are conflated.** “7/7” and “91 scenarios” are presented as one snapshot, while the later teeth report distinguishes 106 total, 91 applicable, and six hubs. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:17] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:41]
5. **Serial transition wording conflicts with parallel workstreams.** “Each phase” must pass before “the next phase” begins, but D/E/F are concurrently active; the rule needs a per-workstream qualifier. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:120]

## 12. Open Questions

- Which child should root `last_active_child_id` select while multiple workstreams remain active?
- Which lifecycle surface is authoritative: parent phase row, child spec, implementation summary, or graph metadata?
- Should the two routing references be current operational docs or explicitly dated historical snapshots?

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Report missing/mis-grouped root children | All 21 direct children form a bijection with the phase map | `spec.md:94-116` | 1, 2, 9, 10 |
| Treat duplicate `012` as a root collision | Collision is nested under `020/007` | `020/007/spec.md:50` | 1, 2 |
| Treat root `015` as phase parent | Root `015` has empty `children_ids`; nested `015` has 14 | both graph files line 6 | 1, 2, 9 |
| Treat rename-ledger old names as stale | They occur only in intentional history | `context-index.md:9-39` | 3, 4, 7, 10 |
| Report stale parent spec hash | Stored `spec.md` SHA-256 matches current content | `graph-metadata.json:120` | 5, 10 |
| Report Group E/F direct counts as false | Seven and eleven direct children are correct | `context-index.md:53-54` | 2, 9 |

## 13. Divergence Map

- Saturated: direct-child inventory, A–F membership, old-name scan, fingerprint check.
- Productive pivots: metadata → cross-links → supporting references → status authority → nested resume topology.
- Remaining frontier: authority decisions listed in Open Questions; these require packet-owner policy, not more evidence gathering.

## 14. Recommendations

1. Regenerate/fix parent metadata first: remove ghost `000`, refresh `description.json`, and set an intentional active-child policy.
2. Reconcile the authoritative routing reference as one atomic edit; its 2/7 and 7/7 states cannot be patched independently.
3. Update the before/after document for compiled serving, completed verification, and hyphenated paths.
4. Repair root links and make handoff/resume guidance explicit for active D/E/F work.
5. Add a short nested-topology note to `context-index.md` covering `020/007`, duplicate `012`, and nested phase-parent `015`.
6. Choose and document a lifecycle-status authority, then regenerate dependent graph/status surfaces.

## 15. Source Index

Primary evidence is recorded in `iterations/iteration-001.md` through `iteration-010.md`; structured records are in `deltas/iter-001.jsonl` through `iter-010.jsonl`.

## 16. Confidence and Limits

High confidence for filesystem, literal path, metadata, carrier-count, and status-conflict findings. Medium-high confidence for severity of unrooted shorthand paths and metric-scope wording. No claim depends on frozen historical artifacts.

## 17. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 10
- Questions answered: 5 / 5 evidence questions
- Remaining questions: 3 policy decisions
- newInfoRatio trend: `0.90, 0.45, 0.85, 0.78, 0.88, 0.72, 0.64, 0.48, 0.42, 0.12`
- Average newInfoRatio: 0.624
- Final-pass novelty: 0.12
- Stop policy: max-iterations; convergence before iteration 10 was telemetry only
