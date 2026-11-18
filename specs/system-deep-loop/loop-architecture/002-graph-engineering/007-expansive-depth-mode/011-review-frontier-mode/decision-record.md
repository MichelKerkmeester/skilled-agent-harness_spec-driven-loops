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

<!-- /ANCHOR:operator-answers-verbatim -->
