DEEP-REVIEW

# Deep-Review Iteration Prompt Pack — iter 11 of 20

## STATE

state_summary: Iter 10 raised 1 P1 (rule missing from runtime files) + 1 P2 (skill count 21 vs 22). **Both are FALSE POSITIVES — adjudicate as RETRACTED in this iter**. Then continue with graph-metadata.json edge symmetry across sk-small-model ↔ cli-devin ↔ cli-opencode.

**Retraction evidence (pre-collected by orchestrator)**:
- `.claude/CLAUDE.md`: only contains tool routing for CocoIndex + Code Graph. NOT a framework-rules file by design.
- `.codex/AGENTS.md` line 7: "the project file is authoritative for gates, scope discipline, code style, safety constraints, spec-folder workflow, memory routing, and all other framework matters. This file never overrides those — it only shapes delivery." → `.codex/AGENTS.md` is voice/tone/reasoning-visibility ONLY by explicit scope.
- Skill count: `ls .opencode/skills/` returns 22 entries: 21 skill directories + `README.md` file. The actual skill count is 21 = directories. README's claim of 21 is correct.

Review Iteration: 11 of 20
Mode: review
Dimension: **cross-cutting / adjudication**

## TASK 1 — RETRACT ITER-10 FINDINGS

Document the retraction:
- F1-iter10 (P1 rule-in-runtime-files): RETRACT — `.claude/CLAUDE.md` and `.codex/AGENTS.md` are scoped to runtime-specific concerns by design (not framework rules). `feedback_agents_md_sync_triad` memory confirms the sync triad is canonical + Barter, not runtime files.
- F2-iter10 (P2 skill count 21 vs 22): RETRACT — `ls` count of 22 includes `README.md`; actual skill count is `ls -1d .opencode/skills/*/ | wc -l = 21`. README is correct.

## TASK 2 — GRAPH-METADATA EDGE SYMMETRY

Read three graph-metadata.json files:
1. `.opencode/skills/sk-small-model/graph-metadata.json`
2. `.opencode/skills/cli-devin/graph-metadata.json`
3. `.opencode/skills/cli-opencode/graph-metadata.json`

For each, capture the `manual.enhances`, `manual.enhanced_by`, `manual.depends_on`, `manual.related_to` arrays.

Check symmetry:
- sk-small-model says `enhances → cli-devin weight 0.5`. Does cli-devin's graph-metadata declare `enhanced_by ← sk-small-model` or a symmetric `related_to`?
- Same check for sk-small-model → cli-opencode.

If asymmetric (only one side declares the edge), flag P2: edge graph inconsistency reduces advisor lane signal (the graph_causal lane reads from both ends).

## TASK 3 — DESCRIPTION.JSON METADATA CONSISTENCY

Read each description.json (3 skills above). Compare:
- `name` field present
- `description` field non-empty
- `trigger_phrases` or `trigger_examples` array exists
- Importance tier present

Verify they all use the same schema shape (consistent keys + types).

## STATE FILES

- Write iter to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/iterations/iteration-011.md`
- Write delta to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/deltas/iter-011.jsonl`
- State log: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/deep-review-state.jsonl`

## CONSTRAINTS

- LEAF agent. Soft 12 / hard 13 tool calls.
- Read-only review target.
- Use absolute paths.

## OUTPUT CONTRACT

1. **iteration-011.md** — Structure: `## Task 1 Retraction`, `## Task 2 Edge Symmetry`, `## Task 3 description.json Consistency`, `## Findings`, `## Verdict`, `## Next Focus`.

2. **state.jsonl APPEND** — include findingsRetracted + findingsNew counts.

3. **deltas/iter-011.jsonl** — multi-line.

## EXECUTION

1. sequential_thinking 5+ thoughts.
2. Document retraction (no reads needed — evidence is in prompt).
3. Read 3 graph-metadata.json files.
4. Read 3 description.json files.
5. Compose iter + delta + state. Stop.
