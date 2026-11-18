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
| Q002 | Decouple the frontier node cap from the iteration cap and rerun the pilots. | Not stated. | None | AC-014, deep-research.yaml, frontier-admit.cjs |
| Q003 | Land the cap decoupling with a test, skip the research rerun, and amend AC-014 to require the frontier to drain to zero open and zero active nodes before the iteration cap. | Not stated. The replayed run-2 stop check showed four default-run blockers that D2 freezes (novelty, source diversity, graph coverage, claim verification), so a non-cap stop is not reachable by the cap change alone. | Q002 for the research pilot | AC-014, REQ-012, goal.md completion criteria, frontier-admit.cjs |
| Q004 | Ratify ADR-006: the golden lineage-prompt check strips the one expansive-only persona paragraph. | Not stated. | None | ADR-006, AC-001, research-depth-mode-golden.vitest.ts |
| Q005 | Size a defaulted expansive budget from the seed: `min(24, max(loop default, 2·c·(S + maxDepth − 1)))`, with c 1 for research and the dimension count for review and S counted per lineage under fan-out; an explicit budget always wins, the node cap stays half the final budget, and default runs persist no new key. | Coordinator relay of the operator ruling of 2026-11-18, option (c) with a ceiling. Not stated beyond that. At the default budget the half-budget node cap was full after the seed, so an expansive run worked its seeds only. | ADR-003's consequence that the pilot must still state its `maxIterations`, for a defaulted budget | REQ-018, AC-020, ADR-003 amendment, T033, frontier-admit.cjs, fanout-run.cjs, deep-research.yaml |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:build-decisions -->
## Build Decisions

Decisions taken during the 2026-11-17 build while the operator was away. Each one names how to undo it.

| ID | Decided | Why | Rollback |
|----|---------|-----|----------|
| D-010-01 | An exhausted, blocked or abstained node is re-kinded in the coverage graph to a CLAIM with `verification_status: closed`; a pruned node is never written. | ADR-002 left the target kind open. CLAIM feeds only the claim-verification rate, which counts a closed claim as settled, while FINDING and SOURCE would skew findings counts and source diversity. The graph close case shows coverage and diversity return to their base values. | Change the closed-node branch of `buildFrontierGraphEvents` in `frontier-admit.cjs` to emit nothing, and add a delete path to `upsert.cjs` for nodes already written. |
| ADR-006 (D-010-02) | The golden lineage-prompt check strips the one expansive-only paragraph of the embedded agent persona before comparing; every other byte still has to match the untouched baseline. | The lineage prompt embeds `.skilled/agents/deep-research.md` verbatim, and the leaf contract row is a required change to that file. The paragraph is inert on a default run, because no FRONTIER block is ever rendered there. | Remove `withoutExpansiveOnlyPersona` from `research-depth-mode-golden.vitest.ts` and accept the persona bytes into the baseline at integration. Ratified by the operator on 2026-11-18 (Q004): it waives AC-001's byte identity for the CLI lineage prompt only. |
| D-010-03 | The fan-in partition guard reports a missing node, in `registry.frontier.partitionGuard`, the merge output and a stderr warning, instead of aborting the merge. | One crashed lineage would otherwise cost the whole fan-out its synthesis, while the default fan-out tolerates failed lineages. | Throw an input error in `fanout-merge.cjs` main when `partitionGuard.passed` is false. |
| D-010-04 | The target-2 pilot (T031, T032) runs at the integration merge gate, not on this branch. | A live `/deep:research` loop of 6 to 10 dispatched iterations does not fit the branch's turn budget beside the closing gates. A CLI smoke on a scratch packet exercised seed, admit, block, reduce, graph and the stop decision end to end. | Not applicable: run the pilot and record its registry stats. |
| D-010-05 | A lineage's node store and inbox rows go at `lineages/<label>/frontier-nodes.jsonl` and `lineages/<label>/inbox.jsonl`. | A lineage binds `artifact_dir` to its lineage directory, and every frontier reader resolves the store under `artifact_dir`, so a nested `research/` folder would never be read. | Change the path in `writeLineageFrontierStore` in `fanout-run.cjs`. |
| D-010-06 | `{frontier_block}` is computed by `frontier-admit.cjs block`, not written by the orchestrating model. | The slot count the leaf sees must be the one admission enforces, and only code can keep the two equal. | Bind `frontier_block` from YAML prose in `render_prompt_pack`. |
| D-010-07 | `seedNodes` is a no-op once the store holds any depth-1 node. | Resume skips the seed, but a restart that keeps the store, or a repeated fan-out launch, would add a reworded second decomposition, and the fan-out partition would then name nodes no lineage holds. | Remove the already-seeded guard from `seedNodes` in `frontier-admit.cjs`. |
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
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01DZkg8CnttvcpZMfP5Hihip:0 -->

Question:
```text
Research pilot: I replayed run 2's final stop check (993 fixture). Decoupling the node cap won't make a non-cap stop reachable, because four default-run blockers that D2 freezes all fired at once: novelty never converged (rolling avg 0.89, MAD stop=false, weighted score 0.35); source diversity was 0.50 vs a 1.5 threshold; graph question coverage was 0.22 (16 uncovered); claim verification was 0. A rerun would cost ~1h and is almost certain to cap-stop again, which would be attempt 3. What now?
```

Options:
```text
Decouple, amend AC-014 (Recommended)
Decouple and rerun anyway
Amend only, no code
```

Answer:
```text
Decouple, amend AC-014 (Recommended)
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
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01FPRewkTEXRRTCkKKmmFfgM:0 -->

Question:
```text
The fresh Opus xhigh design review recommends option (c), with the expansive default budget sized from the seed. The cap rule stays at half the budget, so your earlier decoupling ruling stands. When --depth-mode=expansive is set and --max-iterations is left at its default, the run's budget becomes max(loopDefault, 2·c·(S + 2)), where S = seeded depth-1 nodes and c = 1 for research or the dimension count (4) for review. Research S=3 → 10, S=6 → 16; review S=1 → 24, S=3 → 40. An explicit --max-iterations always wins, and default runs are untouched (D2). Rejected: docs only (review at its default of 7 answers zero seeds), seeds outside the cap (reverses your decoupling ruling), and counting only open nodes (no effect, because the store never records 'answered'). Proceed?
```

Options:
```text
Build option (c) (Recommended)
(c) with a ceiling
Docs only
```

Answer:
```text
(c) with a ceiling
```

<!-- /ANCHOR:operator-answers-verbatim -->
