# Iteration 7: Workflow and artifact-contract gaps for code-quality integration

## Focus
This iteration followed the explicit dispatch focus over the stale reducer `NEXT FOCUS`: unresolved workflow and artifact-contract gaps for `code-quality` integration. I investigated route-proof expectations, JSONL/stable-key evidence, delta/artifact gaps, completion-claim verification, and the shape of quality-gate evidence that downstream spec-kit/deep-loop systems can consume.

## Findings
1. Route-proof is no longer just a benchmark convention; it is a mechanical post-dispatch contract for deep-loop research state. The compiled `/deep:research` contract requires each iteration record to include `target_agent: "deep-research"`, `resolved_route`, `agent_definition_loaded: true`, and `mode: "research"`, while `verify-iteration.cjs` checks the same fields on the canonical state-log record and fails missing or mismatched route proof. [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:105] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:111] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:6] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:99] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:140]
2. There is an artifact-contract contradiction around deltas: `verify-iteration.cjs` says a dispatched research leaf owes a narrative markdown file, state-log record, and per-iteration delta file, and it fails when `deltas/iter-NNN.jsonl` lacks a `type: "iteration"` record. The current `deep-research` leaf contract, however, only allows iteration markdown, one state append, optional idea rows, progressive `research.md`, and packet-local ideas; `research/deltas/*` is not an allowed write target. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:6] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:159] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:160] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:162] [SOURCE: .opencode/agents/deep-research.md:69] [SOURCE: .opencode/agents/deep-research.md:71]
3. Stable-key JSON evidence is already a deep-loop reliability concern, but the stable-key guarantee lives in dispatch receipts, not in `code-quality` handoff output yet. `canonicalReceiptJson()` recursively sorts object keys so receipt signatures reproduce independent of insertion order, and tests assert this behavior; `sk-code` advisor metadata includes `stable jsonl keys` as routing vocabulary, but `code-quality` itself still describes prose/checklist handoff rather than a canonical keyed payload. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/receipt-crypto.ts:39] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/receipt-crypto.ts:43] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/receipt-crypto.ts:54] [SOURCE: .opencode/skills/deep-loop-runtime/tests/receipt-crypto.test.ts:103] [SOURCE: .opencode/skills/deep-loop-runtime/tests/receipt-crypto.test.ts:109] [SOURCE: .opencode/skills/sk-code/graph-metadata.json:118]
4. `code-quality` should not claim completion, but it should report evidence in a consumer-readable shape before verification. Its workflow explicitly hands to verification when P0 items are clear and its rules prohibit completion/done/passing claims; the success criteria require a quality-evidence handoff with remaining accepted risk. This aligns with system-spec-kit's completion-verification rule, where validation runs before completion claims and strict continuity freshness can block stale completion claims. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:140] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:150] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:187] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:204] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:213] [SOURCE: .opencode/skills/system-spec-kit/references/validation/path_scoped_rules.md:146] [SOURCE: .opencode/skills/system-spec-kit/references/validation/path_scoped_rules.md:148] [SOURCE: .opencode/skills/system-spec-kit/references/validation/validation_rules.md:99] [SOURCE: .opencode/skills/system-spec-kit/references/validation/validation_rules.md:103]
5. The best downstream-consumable shape is a two-layer handoff: human checklist summary plus a stable keyed advisory envelope. The existing checklist already has structured P0/P1/gate fields, while the `code` and `review` agents define advisory `AGENT_IO_RESULT v1` envelopes with stable fields for status, confidence, failure type, summary, files, verification, and next action. `code-quality` can mirror that pattern without becoming a reviewer or verifier by emitting `quality_gate`, `checklists`, `comment_hygiene`, `dist_staleness`, `p0/p1/p2`, `deferrals`, `verification_handoff`, and `remaining_risk` fields inside the final handoff. [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:461] [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:463] [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:520] [SOURCE: .opencode/agents/code.md:329] [SOURCE: .opencode/agents/code.md:332] [SOURCE: .opencode/agents/code.md:335] [SOURCE: .opencode/agents/code.md:341] [SOURCE: .opencode/agents/review.md:295] [SOURCE: .opencode/agents/review.md:298] [SOURCE: .opencode/agents/review.md:304]
6. Downstream systems need direct evidence, not self-attested gate status. The code agent's acceptance rubric treats missing required verification or a failed mandatory quality gate as P0 blockers, and its pre-return verification requires final-file rereads, command/action evidence, scope cleanliness, and current quality-gate evidence. Therefore `code-quality` should report exact checker commands/results and deferrals, then let verification/spec-kit/deep-review consume those facts rather than trusting a single `pass` string. [SOURCE: .opencode/agents/code.md:152] [SOURCE: .opencode/agents/code.md:160] [SOURCE: .opencode/agents/code.md:177] [SOURCE: .opencode/agents/code.md:398] [SOURCE: .opencode/agents/code.md:402] [SOURCE: .opencode/agents/code.md:406] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:145] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:146] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:210]

## Ruled Out
- Writing `research/deltas/iter-007.jsonl` from this leaf execution. The file would be packet-local, but the current `deep-research` agent write contract does not include `research/deltas/*`, so writing it would violate the scope lock. [SOURCE: .opencode/agents/deep-research.md:69] [SOURCE: .opencode/agents/deep-research.md:71]
- Generalizing deep-loop route-proof fields into the `code-quality` quality handoff as mandatory quality evidence. Route-proof belongs to dispatch/iteration identity; `code-quality` can include dispatch lineage only as optional provenance, not as proof that P0/P1/P2 evidence exists. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:99] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:204]
- Letting `code-quality` produce a formal review report or done claim. Its boundary leaves findings-first output to `code-review` and final evidence to verification. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:39] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:49] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:187]

## Dead Ends
- The delta artifact gap cannot be closed inside this iteration without changing the leaf write contract or the runtime verifier. The reducer/workflow owner must choose whether deltas are leaf-owned, reducer-owned, or no longer required by `verify-iteration.cjs`. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:159] [SOURCE: .opencode/agents/deep-research.md:71]
- Another broad discovery pass is unlikely to improve the implementation backlog. The remaining blocker is a contract decision and implementation shape, not lack of evidence. [INFERENCE: based on iterations 1-7 covering baseline, spec-kit, advisor, deep-loop/hook/benchmark, backlog synthesis, validation, and artifact-contract checks]

## Edge Cases
- Ambiguous input: Strategy `NEXT FOCUS` is stale and still points at the original baseline; I followed the explicit dispatch focus for iteration 7.
- Contradictory evidence: `verify-iteration.cjs` requires a delta file, while the leaf agent's allowed-write contract excludes `research/deltas/*`. The contradiction is unresolved and is the main blocker for downstream mechanical verification.
- Missing dependencies: Delta write authority is missing for this leaf; no `research/deltas/iter-007.jsonl` was written.
- Partial success: Iteration markdown, one canonical state append, and progressive `research.md` are in scope. Delta output is omitted by contract.

## Sources Consulted
- `.opencode/commands/deep/assets/compiled/deep_research.contract.md:105`
- `.opencode/commands/deep/assets/compiled/deep_research.contract.md:111`
- `.opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:6`
- `.opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:99`
- `.opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:159`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:633`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/receipt-crypto.ts:39`
- `.opencode/skills/deep-loop-runtime/tests/receipt-crypto.test.ts:103`
- `.opencode/agents/deep-research.md:69`
- `.opencode/agents/deep-research.md:71`
- `.opencode/skills/sk-code/code-quality/SKILL.md:15`
- `.opencode/skills/sk-code/code-quality/SKILL.md:140`
- `.opencode/skills/sk-code/code-quality/SKILL.md:187`
- `.opencode/skills/sk-code/code-quality/SKILL.md:204`
- `.opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:461`
- `.opencode/agents/code.md:329`
- `.opencode/agents/code.md:398`
- `.opencode/agents/review.md:295`
- `.opencode/skills/system-spec-kit/references/validation/path_scoped_rules.md:146`
- `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:99`

## Assessment
- New information ratio: 0.85
- Questions addressed: route-proof expectations; JSONL/stable-key evidence; delta/artifact contract gaps; completion-claim verification; downstream-consumable quality-gate evidence.
- Questions answered: `code-quality` should emit direct evidence in a stable keyed handoff while avoiding done/review claims; route-proof belongs to deep-loop dispatch state; the remaining deep-loop artifact blocker is the leaf-vs-verifier delta contract contradiction.

## Reflection
- What worked and why: Reading the runtime validator, compiled command contract, leaf agent contract, and code-quality output contracts together exposed a concrete mismatch that prior backlog synthesis had only described as an omitted optional artifact.
- What did not work and why: Treating `deltas` as merely optional misses the current runtime verifier's mechanical failure mode; the source-of-truth files disagree.
- What I would do differently: Resolve the delta ownership contract before implementing downstream quality handoff changes, so the future implementation can produce artifacts that the verifier actually accepts.

## Recommended Next Focus
Move from research to implementation planning with one contract decision first: either extend the `deep-research` leaf allowed-write contract to include `research/deltas/iter-NNN.jsonl`, or update the deep-loop verifier/command workflow so deltas are reducer-owned or no longer required. Then implement the `code-quality` evidence handoff as a stable keyed advisory envelope plus checklist summary consumed by code, review, spec-kit, and deep-loop flows.
