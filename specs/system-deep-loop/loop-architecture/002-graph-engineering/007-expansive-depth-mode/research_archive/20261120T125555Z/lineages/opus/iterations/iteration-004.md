# Iteration 4: Restraint, part B (fanout-run probes and completion names, convergence.cjs layering, YAML bookkeeping)

## Focus
Frontier node F-1-001 (depth 1, scope .skilled/skills/system-deep-loop/runtime/scripts, .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/commands/deep/assets): Restraint: what can be deleted, merged or collapsed across frontier-admit.cjs, the deep-research and deep-review reduce-state.cjs reducers, convergence.cjs, fanout-run.cjs and the two deep workflow YAMLs while every promise of the expansive-depth modes stays kept? Name concrete deletions with file:line.

## Actions Taken
1. Read the `LINEAGE_COMMAND_ADAPTERS` table and the per-kind binary probes (fanout-run.cjs:3379, 3557-3647), and measured each adapter builder's length.
2. Mapped the convergence.cjs sections. The stop decision runs 720-1827, about 1100 lines.
3. Counted `bookkeeping_log`, `append_jsonl` and approval gates in both YAMLs, and traced `pivot_override_accepted` through both workflows, both reducers and the research ledger schema.
4. Confirmed the event names `synthesis-closeout.cjs` emits (synthesis-closeout.cjs:412, 439, 459, 483).

## Findings
1. **Eight copy-pasted binary probes.**
   - `isCodexBinaryAvailable`, `isClaudeBinaryAvailable`, `isOpencodeBinaryAvailable`, `isCursorBinaryAvailable`, `isDevinBinaryAvailable`, `isPiBinaryAvailable`, `isDshBinaryAvailable` and `isVibeBinaryAvailable` each `spawnSync` the same `command -v <name>` (fanout-run.cjs:3379, 3582-3647). There are 15 `command -v` sites in the file.
   - The comment at 3590-3591 records that two kinds once lacked the check and failed mid-lineage. That is the drift a table prevents.
   - **Change:** one `BINARY_BY_KIND` map beside `LINEAGE_COMMAND_ADAPTERS` (3557) and one `isExecutorBinaryAvailable(kind, env)`; delete the eight functions.
   - Value low-M, effort S, risk low.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3582] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3590]
2. **The strict completion set still carries tolerance for spellings that scripted closeout no longer produces.**
   - `SYNTHESIS_EVENT_NAMES` accepts `synthesis_complete`, `phase_synthesis_complete` and `synthesis` (fanout-run.cjs:1241). The research terminal set adds `synthesis_incomplete` (1248-1251). `completionFromArtifacts` rescues a lineage only on the max-iterations path (1282-1312, 1334-1342).
   - `synthesis-closeout.cjs`, called by step_convergence_report (deep-research.yaml:2195-2216), emits only `synthesis_complete` or `synthesis_incomplete` (synthesis-closeout.cjs:412, 439, 459, 483).
   - **Change:** once the pre-spawn classifier from iteration 2 (Finding 3) owns legacy logs:
     - drop `phase_synthesis_complete` and `synthesis` from the strict set
     - move the artifact fallback into that classifier
   - Then one rule judges new attempts, and one tolerant rule judges prior ones.
   - Value M, effort S, risk low-medium. A lineage whose closeout step fails is no longer rescued by its artifacts, which is the intended strictness.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1241] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:439]
3. **The review audit drops the override it claims to keep, and the review reducer reads it anyway.**
   - Review pins `pivot_override_accepted` as print-only bookkeeping (deep-review.yaml:167, 1627).
   - Research records the same event through a ledger stem (deep-research.yaml:1501; deep-research-ledger-schema.ts:622).
   - The review reducer still filters `pivot_override_accepted` rows (runtime/scripts/reduce-state.cjs:1414), and so does divergent-review-pivot.ts:421. From a current run they find nothing.
   - So review's "audited override" leaves no durable audit row, and two readers are dead.
   - **Change:** add a `deep_review.pivot_override_accepted` stem mirroring research's, and route the review row through the gateway. Alternatively, delete both readers and the "audited" wording.
   - Value M (an audit-trail correctness gap), effort S-M, risk low.
   [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:167] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1414] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:622]
4. **Print-only bookkeeping is spelled as fully templated JSON rows.**
   - Research has 12 `bookkeeping_log` directives and review has 7. None is persisted: the research and review `pinned_bookkeeping` blocks say the step "prints the row in its log line" (deep-research.yaml:175-180; deep-review.yaml:166-169).
   - Each still carries a full event template with `sessionId`, `generation` and timestamp placeholders that the model must substitute, for example `graph_convergence` with three embedded JSON blobs.
   - **Change:** shrink each `bookkeeping_log` to a one-line `log:` message with only the fields an operator reads, and delete the JSON templates. Where a fact matters later, `maxDurationReached` for example, it already reaches the ledger through closeout's `--stop-reason`.
   - Value M (less model transcription per iteration, so less cross-runtime variance), effort S, risk low.
   [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:176] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:166]
5. **The node-binding rule lives in convergence.cjs, but the node store's owner is frontier-admit.cjs.**
   - `frontierMarkerPattern`, `ANY_FRONTIER_MARKER`, `activeNodeByIteration` and `iterationBoundToNode` sit at convergence.cjs:1359-1395. So the review reducer imports node binding from the stop-decision module (runtime/scripts/reduce-state.cjs:18-23), while the research reducer keeps its own copy.
   - **Change:** move the four into frontier-admit.cjs next to `readNodeStore`, and have convergence.cjs and both reducers import them. This completes iteration 1's Findings 1 and 2.
   - convergence.cjs then keeps only the stop decision and counters, and the circular-looking reducer to convergence to frontier-admit chain becomes reducer to frontier-admit.
   - Value M, effort S, risk low.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1359] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:18]
6. **Correction to iteration 1, Finding 6.** The single gateway command those steps should reference is `state_write_protocol.command` at deep-research.yaml:172, not 157. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:172]

## F-1-001 consolidated answer (both parts), ranked by value over effort

| Change | Value | Effort | Risk |
|--------|-------|--------|------|
| Move inline YAML programs into a lifecycle script | H | M | low |
| One `projectFrontier` | H | M | med |
| Shrink print-only bookkeeping | M | S | low |
| Delete 24 config aliases | M | S | low |
| Move the binding rule into frontier-admit.cjs; delete the regex copies | M | S | low |
| Research `block --node-id` | M | S | low |
| Fix the review override audit | M | S-M | low |
| Single strict completion set | M | S | low-med |
| Delete the expired migration | S-M | S | low |
| One binary-probe table | low-M | S | low |
| Delete the gateway fallbacks | low-M | S | low |

Every promise stays kept:
- No change removes an admission check, the frontierOpen veto, the band budget, the terminal-cap bypass or ledger authority.

## Questions Answered
- F-1-001 (with iteration 1).

## Questions Remaining
None in this lineage's frontier scope.

## Ruled Out
- Extracting the eight adapter builders (33-106 lines each, fanout-run.cjs:2533-3555) as a restraint move. Their divergence is the cross-CLI parity question (F-1-004), dealt to the other lineage, so it is only noted here.

## Dead Ends
None.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: research persists `pivot_override_accepted` while review pins it as print-only. Both are cited; neither is better supported, because the two workflows disagree.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1241-1342, 2533-3555, 3379, 3557-3647
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:3-150, 720-1827, 1359-1395
- .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:412-483
- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:18-23, 1408-1418
- .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:622
- .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:421
- .skilled/commands/deep/assets/deep-research.yaml:172-180, 1460, 1501, 2195-2216
- .skilled/commands/deep/assets/deep-review.yaml:165-169, 1627

## Assessment
- New information ratio: 0.83
- Questions addressed: F-1-001
- Questions answered: F-1-001

## Reflection
- What worked and why: tracing one event name across workflow, schema and reducer found a real audit gap that a pure size or duplication scan would miss.
- What did not work and why: convergence.cjs section headers showed size but not seams. The import graph showed the seams.
- What I would do differently: check the review ledger schema directly for a missing stem before concluding. Here the conclusion rests on the YAML's own pinned list.

## Recommended Next Focus
All three frontier nodes in this lineage's scope are answered. Recommend synthesis.
