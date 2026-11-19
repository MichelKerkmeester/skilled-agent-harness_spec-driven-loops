# Iteration 006 - sk-code-alignment

## Dispatcher
- Iteration 6 of 10, dimension `sk-code-alignment` (custom), native leaf. Rotation: last uncovered dimension.
- Operator focus addressed: code first. Applied the Charter rubric (sk-code review floor, JS/CJS/TS surface rules via the SKILLED alignment verifier, quality tiers, test-what-changed, comment hygiene) to the 26 changed `.cjs`/`.ts` code files and the changed tests in scope.

## Dimension
sk-code-alignment. Loaded `.skilled/skills/sk-code/ROUTER.md`, `sk-code-review/references/review-core.md` sections 2 and 8 (floor, default lens, hygiene ids), and the SKILLED JavaScript style-guide outline.

## Files Reviewed
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` (readNodeStore, readTargetConfig, CLI readers, function lengths)
- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` (readJsonlRows, classifySourceLocation catches)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, `fanout-merge.cjs`, `runtime/lib/deep-loop/divergent-pivot.ts` (new helpers vs test coverage)
- All 26 changed code files: comment-hygiene scan over added lines, alignment-drift verifier
- `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts`, `frontier-admit.vitest.ts`, `frontier-admit-review.vitest.ts`, `deep-review-state-reducer.vitest.ts`, `deep-research-reduce-state.vitest.ts`

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Node-store reader drops a torn row with no signal, unlike the proposal reader** -- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:258 -- `readNodeStore` skips an unparseable line with a bare `catch { continue; }` (lines 258-263) and returns only the Map, so a node whose last row was torn silently disappears from the frontier (its status, depth and children vanish from admission caps and the drained-frontier check). The proposal reader in the same file treats the identical condition as reportable (`readProposalRows` collects `{file,line,error}` warnings, lines 1017-1029, with the comment "it is reported: it may have been a proposal"). The authoritative store gets weaker handling than the transient input. The test at `runtime/tests/unit/frontier-admit.vitest.ts:263` pins id non-reuse after a torn line but not that the loss is surfaced. Rule: `floor.silent-failures` (P2: reach is a crash mid-append, not a contract input, so no P1). Fix: return a `warnings` list from `readNodeStore` and emit it on the CLI JSON like `admit` does.
   Finding class: silent-failure / inconsistent error handling
   Scope proof: frontier-admit.cjs is in reviewScopeFiles; both readers live in it.
   Affected surface hints: frontier-admit.cjs readNodeStore and its CLI callers (seed, admit, close, graph, block); frontier-admit.vitest.ts torn-line test.
   Case: the last append to frontier-nodes.jsonl is cut off mid-line, so the node it updated is dropped on the next read and the CLI reports success with no warning.

## Traceability Checks
- `spec_code` (partial, unchanged): this pass checked code-standard conformance, not spec claims; no new spec_code evidence.
- `checklist_evidence`: not run this iteration.
- Comment hygiene (charter item, not a protocol): pass. Scan of every added line in the 26 code files and changed tests for `REQ-|ADR-|D<n>|Slice A-M|phase 0nn|specs/|CHK-|T<nnn>|SC-n` in comments found only two illustrative finding-id examples in `upsert.cjs` comments describing id normalization and one `specs/demo/spec.md` test fixture string; neither is an ephemeral pointer.

## Integration Evidence
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py` run over a scratch copy of the 26 changed code files: PASS, 0 findings, 0 warnings.

## Edge Cases
- The alignment verifier was run on a scratch copy (not in place) to keep the review target untouched; same bytes, so the result holds for the tree.
- Name-based coverage counts (helpers in reduce-state.cjs and fanout-merge.cjs that no test names) are weak evidence: those helpers are exercised through the reducer CLI (74 and 56 `frontier` mentions in the two reducer test files). Recorded as ruled out, not a finding.

## Confirmed-Clean Surfaces
- Comment hygiene across all changed code and tests.
- SKILLED JS/TS header, `'use strict'` and structure checks (alignment verifier PASS).
- No `it.only`/`it.skip`/TODO/FIXME in added code; the three `it.skipIf` guards are environment guards (root uid, Claude ancestry) with stated reasons.
- `upsert.cjs` catches: the torn-line skip in `readJsonlRows` documents that the reducer reports corruption; the `new URL` catch maps to `EXTERNAL_OTHER`, a defined outcome.
- `frontier-admit.cjs` config and known-texts readers fail closed on unreadable or malformed input.
- `stop-decision-yaml-contract.vitest.ts` parses the YAML and pins key order rather than only substring-matching; the forbidden-fragment test guards an empty step with a length check.

## Ruled Out
- Missing tests for new reducer/merge helpers: covered behaviorally through the reducer and merge CLIs.
- Function-length lens (several 60-90 line functions in frontier-admit.cjs): lens default P2, consistent with sibling runtime scripts; not raised as noise.
- Repeated `error instanceof Error ? error.message : String(error)` idiom: one-line idiom, below the rule-of-three value threshold for a helper.

## Next Focus
- Dimension: all six covered; iteration 7 starts cross-reference/traceability carry-forward.
- Focus area: close core protocols `spec_code` and `checklist_evidence` (still partial/pending), and the unrun overlays `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`.
- Reason: the core protocols must be recorded before STOP.
- Rotation status: 6/6 dimensions complete.
- Required evidence: file:line refs per protocol result.

Review verdict: CONDITIONAL
