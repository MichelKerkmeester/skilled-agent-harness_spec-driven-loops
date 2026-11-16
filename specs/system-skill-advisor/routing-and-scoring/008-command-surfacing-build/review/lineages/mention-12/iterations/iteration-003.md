# Review Iteration 003 - mention-12

## Dispatcher

- Mode: review. Target agent: `@deep-review`, executed in-process by this detached fan-out lineage.
- Session: `fanout-mention-12-1794856957949-n58dw7`, generation 1, lineage `mention-12`.
- Iteration: 3 of 8. Dimensions: correctness, security, traceability, maintainability (final cross-reference and verification pass).
- Operator review focus, and how this iteration addressed it: pass twelve's brief asks for a wrapper, quote or alias case the invariance test does not cover that changes a refusal or question into a request or back. This iteration re-ran the exact prompts that carry F001, F002 and F003 against the final tree and rechecked every recorded limit, so the focus is closed on evidence rather than on the earlier reads.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1-549`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:196-264` and `:410-459` (focused rereads of both boundary implementations)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:169-232` and `:476-555` (wrapper and typed-command coverage)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-12.txt:1-10`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/mention-12/deep-review-state.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/mention-12/deep-review-findings-registry.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/mention-12/deltas/iter-001.jsonl` and `deltas/iter-002.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/mention-12/deep-review-strategy.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `spec_code` (core): pass. The branch change remains exactly the pass-eleven fix in the two scope files; no active finding contradicts it. F001 and F002 remain outside AC-007's enumerated marks, and F003 is a pre-existing typed-path asymmetry. `[SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/acceptance-criteria.md:60]`
- `checklist_evidence` (core): notApplicable. No packet checklist belongs to this review pass; AC-007 is met as written.
- `skill_agent` (overlay): pass. No agent definition is touched by the scope files or the findings.
- `agent_cross_runtime` (overlay): notApplicable. No runtime mirror is touched.
- `feature_catalog_code` (overlay): partial. The wrapper contract is still implemented twice (mention normalizer and typed boundary); F001 and F003 name the two gaps. No new drift appeared in this pass.
- `playbook_capability` (overlay): partial. No playbook scenario was executed; the exported functions were re-run directly.

## Integration Evidence

- `lib/scorer/fusion.ts:1204-1215` and `:1230-1232` still consume `commandOnlyMentioned` and `typedCommandIn`; the F001 and F003 prompts reach the scorer's command rows through the same functions.
- `handlers/advisor-recommend.ts:421-439` still calls `typedCommandForTop`; F003's bold-typed prompt returns `undefined` there.
- The recorded limits are intact: `do not run /deep:review:auto.md` still reads as the command (withheld), and underscore emphasis still reads as a request; neither is re-reported.

## Edge Cases

- F003's deep-loop instance stays `undefined` for `**/deep:review** the diff` while the plain form attaches; the key is absent from the probe object because the value is `undefined`, which is the finding's expected result.
- The bracket wrapper flips both a statement and a question (`do not run [/create:readme], just explain` and `is [/speckit:complete] overkill?`), so F001 is not limited to imperative refusals.
- F002 needs both a led refusal and a path occurrence; the plain refusal alone still withholds, which keeps its reach narrower than F001's.
- The retired name still reads as its replacement for refusals (`true`) and as a request when asked for (`false`), including the mode-suffix form `typedCommandIn('/create:skill:auto') === '/create:sk-skill'`.

## Confirmed-Clean Surfaces

- F001 reproduces: plain `true`, bracketed `false`, `attachCommand` returns `/create:readme`; the bracketed question is `false`.
- F002 reproduces: plain refusal `true`, refusal plus `/create:readme.md` `false`, `attachCommand` returns `/create:readme`.
- F003 reproduces: plain typed command is delivered, the bold-typed command is not, and the deep-loop plain form attaches while the bold form does not.
- State consistency: the state log holds one config row, two canonical `type:"iteration"` records and two `graph_convergence` events; each delta's first line equals its `iter-NNN.record.json`; the registry carries three open findings (1 P1, 2 P2) with all four dimensions covered; the strategy's running counts and completed dimensions agree.
- No writes outside the lineage were performed by this reviewer; the only out-of-lineage writes are the authorized `upsert.cjs` coverage-graph and `convergence.cjs` observability writes the brief names.

## Ruled Out

- A new defect in the wrapper matrix beyond F001: the six covered wrappers still show 0 mismatches on every fixture row, and the uncovered pairs still fail only in the refusal/question direction.
- A regression in the path case beyond F002: the directory-segment form (`/create:readme/notes.txt`) fails the same way, so both path forms are one finding.
- A distinct security finding: no prompt-controlled regex, no secret or filesystem surface, and no super-linear scan.
- A stale-line citation: every finding line was re-read at `05475f9d044`; the cited lines are unchanged.

## Next Focus

- Dimension: none remaining.
- Focus area: none; the stop decision is expected at this pass.
- Reason: all four dimensions and all six protocols are covered and the three findings are re-verified; the only open items are advisories F002 and F003 plus the active P1 F001.
- Rotation status: exhausted.
- Blocked/productive carry-forward: the exported-function probe over concrete prompts for any follow-up pass.
- Required evidence: the convergence script's stop decision recorded in the state log.
- Recovery note: none.

Review verdict: CONDITIONAL
