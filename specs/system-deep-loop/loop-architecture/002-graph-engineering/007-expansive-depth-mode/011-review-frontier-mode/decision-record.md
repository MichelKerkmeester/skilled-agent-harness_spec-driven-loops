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

<!-- /ANCHOR:operator-answers-verbatim -->
