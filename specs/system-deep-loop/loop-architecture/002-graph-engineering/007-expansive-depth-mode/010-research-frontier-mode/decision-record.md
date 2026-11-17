---
title: "Decision Record: Opt-in expansive depth mode for deep-research: frontier admission, veto, close rules"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "010-research-frontier-mode operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode"
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
# Decision Record: Opt-in expansive depth mode for deep-research: frontier admission, veto, close rules

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
| D-010-01 | An exhausted, blocked or abstained node is re-kinded in the coverage graph to a CLAIM with `verification_status: closed`; a pruned node is never written. | ADR-002 left the target kind open. CLAIM feeds only the claim-verification rate, which counts a closed claim as settled, while FINDING and SOURCE would skew findings counts and source diversity. The graph close case shows coverage and diversity return to their base values. | Change the closed-node branch of `buildFrontierGraphEvents` in `frontier-admit.cjs` to emit nothing, and add a delete path to `upsert.cjs` for nodes already written. |
| D-010-02 | The golden lineage-prompt check strips the one expansive-only paragraph of the embedded agent persona before comparing; every other byte still has to match the untouched baseline. | The lineage prompt embeds `.skilled/agents/deep-research.md` verbatim, and the leaf contract row is a required change to that file. The paragraph is inert on a default run, because no FRONTIER block is ever rendered there. | Remove `withoutExpansiveOnlyPersona` from `research-depth-mode-golden.vitest.ts` and accept the persona bytes into the baseline at integration. |
| D-010-03 | The fan-in partition guard reports a missing node, in `registry.frontier.partitionGuard`, the merge output and a stderr warning, instead of aborting the merge. | One crashed lineage would otherwise cost the whole fan-out its synthesis, while the default fan-out tolerates failed lineages. | Throw an input error in `fanout-merge.cjs` main when `partitionGuard.passed` is false. |
| D-010-04 | The target-2 pilot (T031, T032) runs at the integration merge gate, not on this branch. | A live `/deep:research` loop of 6 to 10 dispatched iterations does not fit the branch's turn budget beside the closing gates. A CLI smoke on a scratch packet exercised seed, admit, block, reduce, graph and the stop decision end to end. | Not applicable: run the pilot and record its registry stats. |
| D-010-05 | A lineage's node store and inbox rows go at `lineages/<label>/frontier-nodes.jsonl` and `lineages/<label>/inbox.jsonl`. | A lineage binds `artifact_dir` to its lineage directory, and every frontier reader resolves the store under `artifact_dir`, so a nested `research/` folder would never be read. | Change the path in `writeLineageFrontierStore` in `fanout-run.cjs`. |
| D-010-06 | `{frontier_block}` is computed by `frontier-admit.cjs block`, not written by the orchestrating model. | The slot count the leaf sees must be the one admission enforces, and only code can keep the two equal. | Bind `frontier_block` from YAML prose in `render_prompt_pack`. |
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
