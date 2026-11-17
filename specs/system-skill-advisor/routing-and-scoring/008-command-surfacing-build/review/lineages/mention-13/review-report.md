# Review Report - command mention pass thirteen (mention-13)

- Session: `fanout-mention-13-1794865302020-qunumz`, generation 1, lineage `mention-13`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder), mention area
- Scope files: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`
- Diff reviewed: `b8ebee37d75..932aff4e437`
- Iterations: 7 dispatched passes (8 iteration rows; run 3 was re-recorded), stop reason `maxIterationsReached`
- Dimensions: correctness, security, traceability, maintainability

## 1. Executive Summary

**Overall verdict: FAIL.** The registry verdict is CONDITIONAL (0 P0, 2 P1, 5 P2), and the required coverage gate failed at the terminal stop (`traceability-incomplete`), which makes the session verdict FAIL under the review contract. No P0 was found; nothing here is an incident, and nothing here is a clean close either.

`hasAdvisories: false` (the flag is only set on PASS).

The counts the verdict used: **P0 0, P1 2, P2 5**.

What the two P1s say, in one line each:

1. A command named as a document now reads as a mention even when the same prompt then asks to run it, so `open the /deep:review command file, then run it` loses the command the reader typed (F001).
2. A limiting negation after the name now reads as a refusal, so `run /speckit:save and don't run it twice` loses the command too (F002).

Both sit in the request direction the packet names as a High risk (`spec.md:150`), and both were introduced by this branch's two new tail rules. The five P2s are two more reader-shape gaps, one spec text wider than the code, one checklist claim wider than the matrix, and one reflowed comment.

Why the coverage gate failed: the two core traceability protocols stay `partial` because F005 (the spec bullet) and F006 (the checklist claim) are packet-text defects that a read-only lineage cannot repair. The loop therefore ran to the 8-iteration cap instead of converging, and the gate that stops a run from closing over an overstated checklist did its job.

Self-check outcomes: both P1s carry typed claim-adjudication packets and were confirmed, not downgraded. No P0 candidate arose, so no Hunter/Skeptic/Referee pass was owed. F007 was narrowed in iteration 6 after `git show b8ebee37d75` showed two of the four comment lines it first blamed predate the branch.

Operator review focus, verbatim: `Review pass thirteen. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-13.txt and follow it: it names your area by lineage label, the scope file, the graph and stop steps each iteration runs, and the holdout rule.`

## 2. Planning Trigger

`/speckit:plan` **is required**: two active P1 findings plus a failing required gate.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": {
    "P0": 0,
    "P1": 2,
    "P2": 5,
    "ids": ["F001", "F002", "F003", "F004", "F005", "F006", "F007"]
  },
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "P1",
      "title": "Keep a later request a request",
      "findingIds": ["F001", "F002"],
      "surface": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
    },
    {
      "id": "WS-2",
      "priority": "P2",
      "title": "Close the two reader-shape gaps",
      "findingIds": ["F003", "F004"],
      "surface": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
    },
    {
      "id": "WS-3",
      "priority": "P2",
      "title": "Align the packet text and checklist evidence with the code",
      "findingIds": ["F005", "F006"],
      "surface": "040-final-alignment-loop/spec.md, 040-final-alignment-loop/tasks.md"
    },
    {
      "id": "WS-4",
      "priority": "P2",
      "title": "Re-wrap the fold comment",
      "findingIds": ["F007"],
      "surface": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
    }
  ],
  "specSeed": [
    "Add the determiner condition to the document bullet in spec.md §3 and to REQ-001, or widen the code to accept an article-less doc naming.",
    "Restate CHK-FIX-002 so it names the leads the invariance matrix actually runs, or move the two new rows into PLAIN_ROWS.",
    "Record that a later request clause outranks a document naming, and that a qualified negation (`don't run it twice`) is a limit rather than a refusal."
  ],
  "planSeed": [
    "Add a failing-first test for `open the /deep:review command file, then run it` and for `read the /deep:review docs, then do a thorough review of this diff`.",
    "Add a failing-first test for `run /speckit:save and don't run it twice` and `run /deep:review but never run it without a budget`.",
    "Move the COMMAND_AS_DOCUMENT return after the COMMAND_ASKED_BY_PRONOUN check, or let the pronoun-request check win.",
    "Bound COMMAND_DECLINED_BY_PRONOUN to a clause that ends at `it` or continues with a sentence boundary.",
    "Drop the `](target)` pair (or treat `](` as a boundary) before the fold, so a markdown link label keeps its own occurrence.",
    "Add the two new rows to PLAIN_ROWS, or narrow the CHK-FIX-002 sentence to the leads the matrix runs.",
    "Re-wrap comment lines 421-436 to the block width."
  ],
  "findingClasses": ["logic-ordering", "logic-overreach", "normalization-edge", "vocabulary-asymmetry", "spec-drift", "evidence-overstatement", "documentation-readability"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/spec.md",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1 - Required

**F001 - A document naming returns a mention before a later request clause is read**
- Dimension: correctness. File: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:458`.
- Evidence: `COMMAND_AS_DOCUMENT` returns `true` before the `COMMAND_ASKED_BY_PRONOUN` check at line 460. The contract at lines 403-407 says a use-verb clause with `it` turns an earlier naming into a request.
- Impact: `open the /deep:review command file, then run it` yields `typedCommandForTop(...) === undefined`; `read the /deep:review docs, then do a thorough review of this diff` yields `attachCommand(...) === undefined` even though `thorough` matches `DEPTH_REQUEST`.
- Disposition: active. Finding class: logic-ordering.
- Scope proof: exported guards and consumer run on both prompts; both classify as mentions, and the unchanged pronoun regex matches the tail `command file, then run it`, so the earlier read was a request.
- Affected surface hints: `command-attach.ts`, `lib/scorer/fusion.ts`, `command-attach-guards.vitest.ts`.
- Fix: move the document return after the pronoun-request check, or let a use-verb clause win.

**F002 - A limiting negation after the name reads as a refusal**
- Dimension: correctness. File: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:413`.
- Evidence: `COMMAND_DECLINED_BY_PRONOUN` ends at `it\b`, so any qualifier after `it` still refuses.
- Impact: `run /speckit:save and don't run it twice` and `run /deep:review but never run it without a budget` lose the typed command.
- Disposition: active. Finding class: logic-overreach.
- Scope proof: both prompts classify as mentions; the unchanged lead tests cannot produce that reading, so `b8ebee37d75` returned a request.
- Affected surface hints: `command-attach.ts`, `lib/scorer/fusion.ts`, `command-attach-guards.vitest.ts`.
- Fix: bound the tail refusal at `it` or a sentence boundary.

### P2 - Advisories

**F003 - A markdown link label abuts its target and the naming stops being an occurrence** - `command-attach.ts:441` - the fold drops brackets and parentheses, so `[/create:readme](https://example.com/docs)` merges into `/create:readmehttps://...`, the lookahead at 451 rejects it and `occurrences.length === 0` returns `false`. `do not run [/create:readme](https://example.com/docs) yet` therefore offers `/create:readme`. Class: normalization-edge.

**F004 - The post-name reader covers one clause shape** - `command-attach.ts:459` - a question (`/create:readme, what does it do?`) and a sibling refusal (`/create:readme is wrong, skip it`) still read as requests and offer the command. Class: vocabulary-asymmetry.

**F005 - The spec's document bullet is wider than the code's determiner rule** - `040-final-alignment-loop/spec.md:85` - the bullet and `REQ-001` (`spec.md:119`) state the document shape without a determiner; the code requires `the|this|that` at `command-attach.ts:458`. `read /create:readme documentation and tell me what it does` still offers the command. `tasks.md:46` records the narrowing as deliberate, so the packet text is the stale part. Class: spec-drift.

**F006 - CHK-FIX-002 claims matrix coverage for leads the matrix never wraps** - `040-final-alignment-loop/tasks.md:131` - `PLAIN_ROWS` (`command-attach-guards.vitest.ts:179-182`) holds only the older fixtures, while `COMMAND_DECLINED_BY_PRONOUN` and `COMMAND_AS_DOCUMENT` appear only in the unwrapped blocks at 202-230. Behaviour holds under a wrapper; the claim does not. Class: evidence-overstatement.

**F007 - The fold comment was left mid-sentence by the reflow** - `command-attach.ts:427` and `:435` - the branch produced a 57-character line and a 148-character line in the block that states the fold contract. Lines 432 and 436 predate the branch and are older debt. Class: documentation-readability.

## 4. Remediation Workstreams

**WS-1 (P1, first): keep a later request a request.**
1. Add the two F001 prompts and the two F002 prompts as failing-first rows.
2. Move the `COMMAND_AS_DOCUMENT` return below `COMMAND_ASKED_BY_PRONOUN`, or make the pronoun-request check win when both match.
3. Bound `COMMAND_DECLINED_BY_PRONOUN` at `it` or a sentence boundary.
4. Re-run `REQUEST6`, `CONTROL5` and the wrapper matrix; all must stay requests.

**WS-2 (P2): close the reader-shape gaps.** Handle `](` before the fold, and read a post-name question clause or the pre-name decline vocabulary after the name.

**WS-3 (P2): align the packet text.** Amend `spec.md:85`/`REQ-001` and `tasks.md:131`, or move the two rows into `PLAIN_ROWS`.

**WS-4 (P2): re-wrap `command-attach.ts:421-436`.**

P2 advisories are separate from WS-1 and do not gate the verdict on their own.

## 5. Spec Seed

- The document bullet must state the determiner condition, or the code must accept an article-less doc naming. Pick one; do not leave both readings live.
- The tail-refusal rule needs a stated boundary: a refusal of `it` that ends the clause, versus a negation that qualifies it.
- A link label and a doc path are two different things; the fold should not merge a label with a URL.
- The checklist coverage claim should name the rows it covers, because a reader closes the packet on that sentence.

## 6. Plan Seed

- Failing-first rows for all four P1 prompts, then the three code edits in WS-1, WS-2.
- A wrapper row for a linked label and a post-name question, so the two shapes stay pinned.
- A spec/tasks text edit for F005 and F006, with the acceptance row quoting the determiner if the code keeps it.
- Re-run the guards suite and the mention fixtures after the edits; `REQUEST6`, `CONTROL5` and `AC-001`'s five prompts are the regression floor.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | F005: `spec.md:85`/`REQ-001` vs `command-attach.ts:458`. All other scope bullets match (fold marks at 440-441, doc-path skip at 451, typed boundary at 208). |
| `checklist_evidence` | core | partial | F006: `tasks.md:131`. `AC-001` met on its five prompts and on `REQUEST6`/`CONTROL5`; `CHK-FIX-001` holds; `AC-005` is `Unmet` because this pass found P1s; `AC-004` is `Waived` by ADR-001 in the data area. |
| `skill_agent` | overlay | notApplicable | No agent definition in the diff. |
| `agent_cross_runtime` | overlay | notApplicable | No runtime mirror is touched. |
| `feature_catalog_code` | overlay | partial | `plan.md:70` names the guards test and the matrix as verification; F001, F002 and F006 are outside it. |
| `playbook_capability` | overlay | notApplicable | The playbook row belongs to the data area. |

`AC_COVERAGE`: advisory-shortfall. The packet is Level 2 with `acceptance-criteria.md` present; AC-001 to AC-003 are Met, AC-004 is Waived (ADR-001), AC-005 is Unmet because this pass found two P1s. The signal is advisory and does not change the verdict.

## 8. Deferred Items

- `AC-002`'s suite-wide claim (2381 passed) is unverified here: this lineage runs no suite and writes no test output.
- The pre-existing comment orphan at `command-attach.ts:432` and the long line at 436 are older debt, outside this branch's diff.
- The `data` area (intent phrases, the playbook prompt, ADR-001) is `data-13`'s; nothing here rules on it.
- The open P2 of review passes ten to twelve and the `038-alignment-p1-remediation` list were not re-reported.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Swept directions: none.
- Recovery: one stuck-recovery activation at iteration 6 (`stuckThresholdReached`), answered by a line-level security pass at iteration 7.
- Remaining frontier: none recorded.

## 9. Search Ledger

- `searchCoverage`: no reducer-owned search-debt rows; `searchDebtCount` 0.
- `candidateCoverage`: not applicable to this review (no required bug-class list on the lineage).
- `searchLedger` rows were not produced: the lineage recorded classification and ruled-out rows in each delta instead.
- `ruledOutCandidates`: bracketed-form occurrence loss, typed-boundary regression, pre-name decline regression, ReDoS, homoglyph bypass, fold DoS, reader mark-set divergence, stale citations, stale typed-reader comment.
- `cleanSearchProof`: each ruled-out direction names the probe and its result in its iteration file (iterations 1, 2, 3, 5, 6, 7).

## 10. Audit Appendix

- **Convergence summary**: iterations 1 to 7 recorded ratios 1.0, 0.14, 0.0, 0.07, 0.0, 0.0, 0.0. Decisions: CONTINUE (1, 2, 3), CONTINUE (4), CONTINUE (5), STUCK_RECOVERY (6), CONTINUE (7). Terminal stop at iteration 8: `maxIterationsReached`, blocked by `dimensionCoverageGate`.
- **Coverage summary**: correctness (iterations 1, 5, 8), traceability (2, 8), security (3, 7), maintainability (4, 6). All four dimensions covered; both scope files reviewed under every dimension.
- **Graph**: a `SLICE` node for the mention area, `FILE` nodes for both scope files, per-dimension nodes, finding and evidence nodes, and `COVERS`/`IN_DIMENSION`/`IN_FILE`/`EVIDENCE_FOR`/`CONFIRMS` edges, persisted per iteration through `upsert.cjs` into the lineage's own graph directory.
- **Ruled-out claims**: listed in section 9.
- **Sources reviewed**: `command-attach.ts` (whole file plus four focused ranges), `command-attach-guards.vitest.ts` (whole file plus three ranges), `fusion.ts:1200-1216`, `review-brief-13.txt`, `review-scope-13.txt`, `040-final-alignment-loop/spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `command-offer-fit-gates.md`, and the old tree at `b8ebee37d75` for the comment comparison.
- **State integrity**: 8 iteration rows across 7 runs; run 3 re-recorded with `findingsCount: 6` so its summary reads as the running total, and `deltas/iter-003.jsonl`'s first line rewritten to that record. Registry: 7 open, 0 resolved, all four dimensions covered.
- **Write surface**: every artifact lives under `review/lineages/mention-13`. The only outside path with a fresh mtime is `review/observability-events.jsonl`, whose rows name `producer: fanout-run` and this lineage's label, so it is the parent runner's heartbeat.
- **Continuity save**: not run. This lineage is forbidden from running `generate-context.js`, so continuity is left to the parent fan-out closeout.
