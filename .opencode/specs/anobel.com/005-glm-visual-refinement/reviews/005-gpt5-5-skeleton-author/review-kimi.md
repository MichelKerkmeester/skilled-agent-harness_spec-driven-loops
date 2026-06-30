## Verdict
**AGREE-WITH-CHANGES** — confidence 0.72 — The skeleton-author escalation is the right architecture, but the plan over-optimistically assumes a single GPT-5.5 shot will produce *spatially* valid JSON and glosses several dispatch/prompt/cost details that will break on first implementation.

## What GPT-5.5 got right
- **Role boundary**: skeleton-only, never final tile code, keeps GLM-5.2 as renderer (matches iter-r2-A6).
- **Failure-triggered escalation**: deterministic skeleton + best-of-3 first, GPT-5.5 only on residual 2D failures (AdaCoder principle).
- **Linear-tile exclusion**: zero paid spend on already-strong linear primitives.
- **Cost-gating intent**: per-tile cap, batch `N_2D` ceiling, explicit go/no-go on `$/recovered-tile`.
- **Schema reuse**: re-uses phase-004 skeleton schema/compile path, so this phase is a swap of author, not a new pipeline.

## Gaps / risks / errors

1. **Unverified model slug** — The spec dispatches `openai/gpt-5.5-fast --variant xhigh`, but `.opencode/skills/cli-opencode/SKILL.md` only documents `openai/gpt-5.5-pro`; `gpt-5.5-fast` is not listed and may not resolve. **Verify with `opencode models openai` before locking the plan.**

2. **No enforceable 4200-token cap** — The invocation shown has no `--max-tokens` / `max_completion_tokens` flag, so the cap is an accounting target, not a hard limit. Dense matrix/node diagrams with >8 nodes + edges can exceed 4200 tokens at `xhigh` reasoning effort, producing truncated JSON.

3. **Prompt omits the actual tile content** — The skeleton author must know *what* to lay out (the source brief, items, relationships, possibly the reference image). The shown prompt is only canvas/constraint prose. Without the content payload GPT-5.5 cannot author a meaningful skeleton.

4. **Schema-valid ≠ spatially valid** (RC-2) — GPT-5.5 can emit JSON that parses against the schema yet contains overlapping bboxes or content that overflows `diagramFrame`. The spec assumes schema validation is enough; it is not. A deterministic `bboxContainment + pairwiseOverlap + titleZoneClear` validator is required between GPT-5.5 and GLM.

5. **Single-shot assumption is over-optimistic** — Research predicts `+1 to +3` at confidence 0.78 for *the approach*, not for one non-iterative attempt. Hard 2D tiles fail precisely because direct coordinate placement collides; one more direct placement by a stronger model does not magically solve collision avoidance without a verification loop.

6. **No failure taxonomy for SC-001** — If recovery is `<+3`, the spec does not tell you *why*: `invalid_skeleton`, `collision_present`, `glm_rewrote_scaffold`, `still_overflow`, `downgraded`. Without tags, the parent open question (worth it vs downgrade?) is unanswerable.

7. **Trigger/skip priority is ambiguous** — `trigger_gpt55_if` lists broad primitives (`matrix, flow, hub, branch, popover, node-diagram, network, connector-map`) while `skip_gpt55_if` lists exemptions. The spec must state explicitly that **skip rules override trigger rules**, otherwise a simple 3-item flow could still escalate.

8. **GLM scaffold compliance is assumed, not enforced** — The mitigation is a prose contract forbidding edits to `data-layout-id`, `top`, `left`, etc. After GLM render, a deterministic DOM check must verify those exact attributes/values are preserved; otherwise the skeleton effort is wasted (RC-1/RC-3 can return).

9. **Statistical noise on +3 bar** — One tile is ~2.2 percentage points on n=45. A `+3` recovery claim is within sampling noise unless measured as paired tile-level deltas with a holdout set, not a single batch run.

10. **`$/recovered-tile` denominator can be zero** — If GPT-5.5 recovers 0 tiles, the metric is undefined. The spec needs a break-even value model or a floor reporting rule.

11. **A6 is a derivative bet** — The research says implement A5/004 skeleton-first first and keep A6 as an escalation. The spec treats A6 as a fixed phase 5, but it only pays off if A5 leaves dense 2D failures that are worth paid recovery. Consider making A6 contingent on A5's measured residual.

12. **No temperature/reproducibility setting** — A geometry solver should run at low temperature or structured output; the spec omits this.

## Strongest improvement or alternative
**Insert a deterministic spatial validator after GPT-5.5 and allow one conditional repair dispatch, not a blind best-of-2.** Concretely:
1. GPT-5.5 emits skeleton JSON.
2. Deterministic validator checks `bboxContainment`, `pairwiseOverlap`, `titleZoneClear`, `rowCap`.
3. If invalid **and** budget remains, re-dispatch GPT-5.5 with the violated rule IDs and offending node IDs ("node#3 overlaps node#5 by 18px; fix").
4. If still invalid or no budget, log `invalid_skeleton` and downgrade-to-linear.

This closes the real RC-2 risk, replaces the weak "1 vs best-of-2" open question with a principled verify-then-repair loop, and makes SC-001 failures diagnosable. Raise the per-tile cap to `<=2` calls but keep the batch ceiling tight.

## One thing to test or verify before building this phase
**Manually dry-run the skeleton-author prompt on the 5 lowest-scoring 2D tiles today** with the actual tile brief/image included, then run a deterministic spatial validator on the returned JSON. Measure: (a) whether `openai/gpt-5.5-fast` resolves and real token count, (b) schema validity, (c) spatial validity, (d) how many collisions GPT-5.5 produces in one shot. If ≥3 of 5 skeletons are spatially invalid on first pass, the validator-and-repair design above is mandatory and the cost model changes before you write the classifier or accountant.