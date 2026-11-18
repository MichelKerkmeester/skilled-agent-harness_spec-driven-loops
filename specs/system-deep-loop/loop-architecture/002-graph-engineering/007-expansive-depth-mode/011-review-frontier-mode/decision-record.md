---
title: "Decision Record: Opt-in expansive depth mode for deep-review: review frontier admission, steering, veto, close rules"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "011-review-frontier-mode operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode"
    last_updated_at: "2026-11-17T18:12:37.769Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Opt-in expansive depth mode for deep-review: review frontier admission, steering, veto, close rules

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Accept the nine 010 and 011 design ADRs as proposed; the builder may raise an amendment. | Not stated. | None | 010 and 011 plan.md ADRs, T000 |
| Q002 | Decouple the frontier node cap from the iteration cap and rerun the pilots. | Not stated. | None | AC-011, deep-review.yaml, frontier-admit.cjs |
| Q003 | Add an expansive-only stop rule: a fan-out lineage whose partition is fully answered becomes a stop candidate, then rerun the review pilot. | Not stated. The review pilot used 12 of 16 node slots; it failed because answered lineages kept running to the iteration cap. | Q002 for the review pilot | AC-011, REQ-010, goal.md completion criteria |
| Q004 | Ratify ADR-005: the golden review lineage-prompt check strips the one expansive-only persona paragraph. | Not stated. | None | ADR-005, AC-001, review-depth-mode-golden.vitest.ts |
| Q005 | Fix the missing lineage-local coverage graph in fan-out lineages first, then add the drained-partition candidate behind every gate; no gate is weakened. | Not stated. A replay showed a drained candidate would be BLOCKED in pi-2, pi-5 and pi-6, mainly by the hotspot gate that cannot pass without a graph. | Q003 design detail | REQ-016, REQ-017, AC-017, AC-018, fanout-run.cjs, convergence.cjs |
| Q006 | Make the standard graph upsert derive EVIDENCE_FOR links from each finding's file reference, as a named default-run defect fix, before the pilot rerun. | Not stated. With graphs present, evidence density stayed 0 because the standard upsert never wrote evidence links. | None | REQ-018, AC-019, upsert.cjs |
| Q007 | Keep frontier_drained as a hard stop candidate (D-011-07); every quality gate and the graph decision still apply. | Not stated. A soft candidate could never add a stop, since the composite candidate forms at the score the convergence gate needs. | None | D-011-07, REQ-017 |
| Q008 | Amend AC-011 to seven subsystem depth-1 nodes plus the determinism node, zero open and zero active, every node terminal, with the stop-reason clause dropped; record the four stop-integrity defects outside this packet. | Not stated. Pilot run 2 drained every lineage frontier, but pi-2 capped on real spec_code traceability the fixture cannot satisfy, and leaf-written stop reasons are unchecked. | The stop-reason clause of AC-011, REQ-010 and SC-002 | AC-011, REQ-010, SC-002, T030, goal.md completion criteria |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:build-decisions -->
## Build Decisions

Decisions taken during the 2026-11-17 build while the operator was away. Each one names how to undo it.

| ID | Decided | Why | Rollback |
|----|---------|-----|----------|
| D-011-01 | An iteration record counts toward a review node when it carries `frontierNodeId` equal to the node, when the bounded marker `Frontier node <id>` appears anywhere in its focus, or when the node store holds an `active` row for that node at the record's iteration. | The research build matched the marker only as a focus prefix, so a leaf that reworded its focus lost the visit, the depth budget and the stuck close. The workflow marks the dispatched node active before render, so attribution no longer depends on what the leaf writes. The marker regex is the one integration uses for research. | Drop the activation-row and `frontierNodeId` branches from `reviewRecordsForNode` in `runtime/scripts/reduce-state.cjs`. |
| D-011-02 | The `frontierOpen` veto also applies to review stop candidates that are hard stops. | Review's `all_dimensions_clean` candidate is built with `hardStop: true`, so the research guard `!candidate.hardStop` would never veto it, and REQ-003 names that candidate. The veto still sits after the cap, failures, stuck recovery, `off`, `max-iterations` and the review floor. | Restore `!candidate.hardStop` as the only guard in `buildStopDecision` in `runtime/scripts/convergence.cjs`; review runs then stop with open nodes. |
| D-011-03 | The golden review baseline holds seven artifacts: the six named plus the stop-decision config. The lineage artifact also carries `buildNativeCommandInput`, the checkout path is tokenized as `<CWD>`, and the pivot artifact leaves out the config echo. | The veto changes the stop-decision config, the native path is the other lineage entry point, the checkout path differs per worktree, and the config echo mirrors the fixture file, which differs between the two variants by design. | Drop the extra artifacts from `ARTIFACTS` in `review-depth-mode-golden.vitest.ts` and recapture on a pre-phase tree. |
| D-011-04 | The target-1 pilot (T030, T031) runs on the integration tip after merge, not on this branch. | A live fan-out review of seven nodes across four dimensions needs at least 28 dispatched iterations, which does not fit the branch's turn budget beside the closing gates. | Not applicable: run the pilot and record its registry stats. |
| ADR-005 (D-011-05) | The golden review lineage-prompt check strips the one expansive-only paragraph of the embedded review persona before comparing; every other byte still has to match the untouched baseline. This follows phase 010's ADR-006 exactly, so the operator rules once for both phases. | The lineage prompt embeds `.skilled/agents/deep-review.md` verbatim, and the `frontier_proposal` leaf-contract paragraph is a required change to that file. The paragraph is inert on a default run, because no FRONTIER block is ever rendered there. The strip is anchored on the paragraph's bold header, so an edit to the paragraph or any other byte change still fails the check. | Remove `withoutExpansiveOnlyPersona` from `review-depth-mode-golden.vitest.ts` and accept the persona bytes into the baseline at integration. Ratified by the operator on 2026-11-18 (Q004): it waives AC-001's byte identity for the CLI lineage prompt only. |
| D-011-06 | A review lineage's node store goes at `lineages/<label>/frontier-nodes.jsonl`, with no inbox file. | A lineage binds its artifact dir to the lineage directory, and every frontier reader resolves the store under it, so a nested `review/` folder would never be read; this matches 010's D-010-05. Review reads no inbox. | Change the path in `writeLineageFrontierStore` in `fanout-run.cjs`. |
| D-011-07 | `frontier_drained` is a hard candidate (`hardStop: true`), so `convergenceGate` passes on it as it does on `all_dimensions_clean`; the other eight gates and the graph decision still apply. | A soft candidate passes `convergenceGate` only at a weighted score of 0.60 or more, and the review composite vote forms its own candidate at that same score, so a soft drained candidate could never add a stop. Made under the operator's option-3 ruling of 2026-11-18 (Q003); the operator may veto it. | Set `hardStop: false` on the `frontier_drained` candidate in `buildStopDecision` in `runtime/scripts/convergence.cjs`; the candidate then never stops a run the composite vote would not. |
| D-011-09 | The derived review FINDING nodes carry `finding_id`, `file` and `line` but no `severity`; a leaf node that already holds a finding id keeps its own name and metadata; a leaf finding id folds onto the stored or derived finding it names, matched case-insensitively on the raw id first and then with a `finding`, `find` or `node:finding` prefix stripped, and only an endpoint that names a finding moves; an id that collides with a stored finding of another file and title is keyed `finding:<id>#<iteration>`; only a `file:line` ref earns an edge; and the undeclared-endpoint edge skip applies to every loop type, with a stderr notice. The derived nodes also enter the `findingStability` signal, so a default run's stability moves with them. | A severity on a derived node would make the graph's `p0ResolutionRate` count a P0 that only a leaf `RESOLVES` edge can clear, so a P0 the registry later resolves would hold the graph at `CONTINUE` for good; `p0ResolutionGate` already blocks on active P0s from the registry. Without the fold, a leaf's own finding node doubles the finding count and halves the density (pi-2's leaf used `FIND-` ids). The foreign-key failure on edges to undeclared nodes was first seen in a research run, and the skip sits in the shared write path. Made under the operator's ruling of 2026-11-18. | Remove the derivation flags from the review `step_graph_upsert` command and `readReviewIterationFindings`, `deriveReviewFindingEvidence`, `canonicalReviewFindingId` and the orphan filter from `runtime/scripts/upsert.cjs`, then regenerate the review compiled contract. |
| D-011-08 | Each fan-out lineage's coverage graph lives in `lineages/<label>/graph-db/`: `fanout-run.cjs` exports `DEEP_LOOP_COVERAGE_DB_DIR` for every lineage of either loop type, and the graph-writing YAML steps tell the leaf the store is inside its write surface. | The shared default store sits outside the lineage write surface, so five of six pilot lineages skipped every graph step. pi-3 pointed the variable into its own lineage and is the only lineage whose replay matches a converged stop. Named defect fix REQ-016. | Drop `DEEP_LOOP_COVERAGE_DB_DIR` from the lineage `extraEnv` in `fanout-run.cjs` and the `fanout_graph_store` keys from both workflow YAMLs, then regenerate both compiled contracts. |
<!-- /ANCHOR:build-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01GXZervRj4ta5M1vXJ4deg8:2 -->

Question:
```text
Phases 010 and 011 (expansive modes) carry nine Proposed design ADRs. 010: visited is not answered, the graph close variant, the node cap vs minimum maxIterations, research/frontier-nodes.jsonl plus frontier-admit.cjs, and seed before spawn. 011: the terminal-status-to-candidate-bucket mapping, focus carries the node's next uncovered dimension, the review node store, and steering via next_dimension. How should these be settled?
```

Options:
```text
Accept as proposed (Recommended)
Decide at build time
```

Answer:
```text
Accept as proposed (Recommended)
```

### Q002
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_0124XY7BsyfxrDhCww4fnWY1:0 -->

Question:
```text
Pilot stop criterion: both live expansive-depth pilots (research 010, review 011) stopped on the iteration cap, so AC-014 (010) and AC-011 (011) are Unmet. Cause: the workflow sets maxFrontierNodes = max_iterations, and default-run quality gates (source diversity, graph STOP_BLOCKED) also block an earlier stop. How should I close these?
```

Options:
```text
Amend the criteria (Recommended)
Decouple the caps + rerun
Leave Unmet
```

Answer:
```text
Decouple the caps + rerun
```

### Q003
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01DZkg8CnttvcpZMfP5Hihip:1 -->

Question:
```text
Review pilot: the node cap never stopped it (12 nodes used against a cap of 16). It failed because each fan-out lineage keeps running after its own frontier node is answered (pi-2 and pi-6 ran 12 more iterations to the cap). The 6→8 root fix for the seven-node part has already landed. What should I do for AC-011?
```

Options:
```text
Partition-drained stop (Recommended)
Amend AC-011
Rerun as-is
```

Answer:
```text
Partition-drained stop (Recommended)
```

### Q004
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_0124XY7BsyfxrDhCww4fnWY1:1 -->

Question:
```text
Golden-test waivers: the default-run golden tests strip one expansive-only persona paragraph from the agent definition. ADR-006 (phase 010) and ADR-005 (phase 011) record this as a waiver, which keeps 011's golden criterion open until ratified. Ratify?
```

Options:
```text
Ratify both (Recommended)
Reject both
```

Answer:
```text
Ratify both (Recommended)
```

### Q005
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01MALQzKqe4JjaiRQRSvwzQr:0 -->

Question:
```text
Review partition-drained stop: I replayed the pilot lineages. In pi-2, pi-5 and pi-6, a drained-partition candidate would be BLOCKED by review quality gates on every iteration, and a blocked stop just continues to the cap. The failing gates: hotspotSaturationGate always fails when a lineage has no coverage graph (5 of 6 had none), pi-2 has an active P0, and partial spec_code traceability fails dimensionCoverageGate. Which design?
```

Options:
```text
Drained stops like the cap
Fix lineage graph, then gate
Gated candidate + amend AC-011
Amend AC-011 only
```

Answer:
```text
Fix lineage graph, then gate
```

### Q006
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01LDqruFvN9Ax8ncL2p5aeua:0 -->

Question:
```text
The lineage-graph fix and the gated frontier_drained candidate are committed (full suite: 3414 passed, 0 failed). A replay still predicts 3 of 6 review pilot lineages cap-stopping. The graph decision stays CONTINUE because evidence density is 0: the standard graph upsert never creates EVIDENCE_FOR links (only pi-3's leaf sent any). pi-2 and pi-6 are also blocked by real findings (an active P0, partial spec_code traceability). How do I close AC-011?
```

Options:
```text
Rerun now, then decide
Add evidence links first
Amend AC-011 + rerun
```

Answer:
```text
Add evidence links first
```

### Q007
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01LDqruFvN9Ax8ncL2p5aeua:1 -->

Question:
```text
The agent made frontier_drained a HARD stop candidate (like all_dimensions_clean), so it skips the convergence-score gate but still faces all nine quality gates and the graph decision. A soft one could never add a stop, because the composite candidate already forms at the score the gate needs. Keep it hard?
```

Options:
```text
Keep hard (Recommended)
Veto: make it soft
```

Answer:
```text
Keep hard (Recommended)
```

### Q008
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01Wjx69nuK2C3ABzL8tSZQsF:0 -->

Question:
```text
Review pilot rerun (28 min, all 6 lineages got working graphs): AC-011 FAILs. Zero open and zero active: met (22 nodes: 12 answered, 7 exhausted, 3 pruned). But (1) the seed has 8 depth-1 nodes: 7 subsystems + the determinism node T030 requires; (2) pi-2 still hit the cap, blocked by real spec_code traceability that this commit-range fixture's placeholder spec can't satisfy; (3) only pi-6's stop was legal and script-computed: pi-1, pi-3, pi-4 and pi-5 leaves wrote stop reasons themselves (one invented maxDurationReached; one went to synthesis on BLOCKED), and nothing checks a leaf's stop reason. How should AC-011 close?
```

Options:
```text
Amend AC-011, log defects
Fix stop integrity, rerun
Leave Unmet
```

Answer:
```text
Amend AC-011, log defects
```

<!-- /ANCHOR:operator-answers-verbatim -->
