# Review Report - command surfacing pass fourteen (mention area)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `mention` (pass fourteen)
- Lineage: `review/lineages/mention-14`
- Session: `fanout-mention-14-1794868189353-tsxtos`, generation 1, lineage mode `new`
- Iterations: 8 of 8
- Stop reason: `maxIterationsReached` (terminal gate `coverage` still failing at the stop)

---

## 1. Executive Summary

- **Overall verdict: FAIL**
- **hasAdvisories: false**
- **Counts the verdict used:** P0 = 0, P1 = 2, P2 = 1
- **Why FAIL with no P0:** the required terminal gate `coverage` failed at the stop (`traceability-incomplete`), and the workflow's verdict rule makes a required quality gate still failing at the terminal stop a FAIL. The evidence and scope gates passed.
- **Self-check outcomes:** `R1-P1-001` confirmed P1; `R1-P1-002` confirmed P1; `R1-P2-001` confirmed P2. No finding was downgraded or called a false positive, so the counts are unchanged.
- **Review scope summary:** both pass-fourteen `mention` scope files, read in full at `e626653ce79`; the diff from `932aff4e437`; phase-040 records consulted for traceability only. Every configured dimension (correctness, security, traceability, maintainability) was covered, and both files were read under all four.
- **Operator review focus:** Review pass fourteen. First read `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-14.txt` and follow it: it names your area by lineage label, the scope file, the graph and stop steps each iteration runs, and the holdout rule.

Both P1s are regressions introduced by the pass-thirteen fixes to the two rules this area owns. Neither is a security defect; the security pass found no injection, backtracking, or fold-based bypass. The traceability gate is closed because the phase-040 records and AC-005 cannot be satisfied while the two P1s are open.

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is FAIL because a required terminal gate is still failing, and two active P1 findings need remediation.

**Planning Packet**

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "R1-P1-001",
      "severity": "P1",
      "title": "A refusal whose object carries a reason or a repeat adverb is read as a request",
      "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:415"
    },
    {
      "id": "R1-P1-002",
      "severity": "P1",
      "title": "A document naming followed by any then clause is read as a request",
      "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:465"
    },
    {
      "id": "R1-P2-001",
      "severity": "P2",
      "title": "The new fixtures pin neither boundary the two rules changed",
      "file": ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:210"
    }
  ],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "severity": "P1",
      "finding": "R1-P1-001",
      "action": "Make the clause-end refusal read complete when the refusal predicate ends the clause, not when the pronoun does, while keeping `don't run it twice` and `never run it without a budget` as requests."
    },
    {
      "id": "WS-2",
      "severity": "P1",
      "finding": "R1-P1-002",
      "action": "Keep a document naming a mention unless the `then` clause itself asks to run the named command or to do the command's work; a read-only or unrelated `then` clause must not turn it into a request."
    },
    {
      "id": "WS-3",
      "severity": "P2",
      "finding": "R1-P2-001",
      "action": "Add failing-first mention rows for both boundary shapes before the rule edits."
    }
  ],
  "specSeed": [
    "Record that a post-name refusal is complete when the refusal clause ends, including when the predicate carries a reason or a repeat adverb such as `again`, `anymore`, `because ...` or `until ...`.",
    "Record that a command named as a document (with `the`, `this` or `that`) stays a mention when the following `then` clause asks only for a read or for unrelated work.",
    "Carry the two P1s and the P2 forward into the phase that owns pass fourteen's remediation."
  ],
  "planSeed": [
    "Add the two failing-first rows (`/create:readme keeps failing, never run it again` and `read the /deep:review docs, then tell me what it does`) and confirm they fail before any rule edit.",
    "Change `COMMAND_DECLINED_BY_PRONOUN` so the clause-end test is on the refusal, not on `it`, and keep the two recorded request rows green.",
    "Replace the blanket `then` test in the document branch with a work-request test that leaves `then tell me`, `then summarize` and `then run the test suite` as mentions.",
    "Re-run the guard suite and the wrapper matrix; no other row may move."
  ],
  "findingClasses": {
    "R1-P1-001": "correctness-regression",
    "R1-P1-002": "rule-precedence",
    "R1-P2-001": "test-coverage-gap"
  },
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:415",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:465",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:533",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:259",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:210-218"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### R1-P1-001 - A refusal whose object carries a reason is read as a request (P1, correctness)

- **File:line:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:415`
- **Evidence:** `COMMAND_DECLINED_BY_PRONOUN` now requires `it` at the clause end and allows only `yet`, `now`, `for now`, `at all` and `please` after it. `commandOnlyMentioned('/create:readme keeps failing, never run it again', '/create:readme')` returns `false`; `attachCommand('sk-doc', SINGLE('sk-create-readme'), prompt)` returns `/create:readme` (policy `start`, mutating).
- **Impact:** a reader who refuses the command is offered it, and a `start` command can begin work the reader ruled out. The code contradicts its own comment at 412-414 ("the refusal has to end its clause").
- **Fix recommendation:** anchor the clause end on the refusal predicate rather than on the pronoun, and keep limit clauses (`twice`, `without a budget`) as requests.
- **Disposition:** active
- **Finding class:** correctness-regression
- **Scope proof:** direct execution of the exported guard and consumer on five prompts; the removed pattern ended at `it\b`, so the same inputs read as mentions before this branch.
- **Affected surface hints:** `commandOnlyMentioned:463`, `typedCommandForTop:259`, `attachCommand:533`, the later-refusal fixtures.

### R1-P1-002 - A document naming followed by any `then` clause is read as a request (P1, correctness)

- **File:line:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:465`
- **Evidence:** `!/\bthen\b/.test(clause)` suppresses the document reading whenever `then` appears after the name. `commandOnlyMentioned('read the /deep:review docs, then tell me what it does', '/deep:review')` returns `false`; `attachCommand('system-deep-loop', SINGLE('review'), prompt)` returns `/deep:review`. The same holds for `then summarize it`, `then check the changelog` and `then run the test suite`.
- **Impact:** a reader who only reads about the command is offered a costly multi-pass command. The deep-loop depth gate at 549-552 does not withhold it because `typedCommandIn` finds the typed name.
- **Fix recommendation:** keep the document reading unless the `then` clause itself names a run of the command or the command's work; a read-only follow-up is not a request.
- **Disposition:** active
- **Finding class:** rule-precedence
- **Scope proof:** direct execution on six `then` clauses; `COMMAND_ASKED_BY_PRONOUN` already carries `, then run it`, so the guard only changes read-only follow-ups.
- **Affected surface hints:** `attachCommand:533`, `attachCommand:549-552`, `COMMAND_AS_DOCUMENT:423`, document fixtures at tests 221-226.

### R1-P2-001 - The new fixtures pin neither boundary the two rules changed (P2, correctness)

- **File:line:** `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:210`
- **Evidence:** the five new request rows cover a limit after `it` and a work clause after `then`; no row covers a refusal with a trailing reason and no row covers a `then` read-only follow-up. Adding either row to a mention table fails today.
- **Impact:** the suite stays green if either boundary is widened or narrowed again.
- **Fix recommendation:** add the two failing-first rows before the rule edits.
- **Disposition:** active (advisory)
- **Finding class:** test-coverage-gap
- **Scope proof:** read the fixture tables at 202-218 and 221-229; the only `then` row asserts a request and the only post-name refusals end at `it`.
- **Affected surface hints:** request table 210-218, `REFUSE8` 42-51, document table 221-226.

## 4. Remediation Workstreams

1. **WS-1 (P1, R1-P1-001):** add the failing-first rows, then change the clause-end anchor so a refusal ending its clause is honored even when the predicate carries a reason. Keep `twice` and `without a budget` as requests.
2. **WS-2 (P1, R1-P1-002):** replace the blanket `then` test with a work-request test; `then tell me`, `then summarize`, `then check` and `then run the test suite` must stay mentions, while `then run it` and `then do a thorough review` stay requests.
3. **WS-3 (P2, R1-P2-001):** add both failing-first fixture rows and keep the wrapper/retired-name invariants intact for them.
4. **Verification for all three:** the guard suite green, the two recorded request rows (`don't run it twice`, `never run it without a budget`) unchanged, and the wrapper matrix unchanged.

## 5. Spec Seed

- A refusal after the name is complete when the refusal clause ends, whatever reason or repeat adverb follows the predicate; a limit on how a requested run may happen is not a refusal.
- A command named as a document with a determiner stays a mention when a following `then` clause asks only for a read or for unrelated work; only a clause that asks to run the command or do its work makes it a request.
- The two pass-thirteen fixes each carry one boundary case that the original fixtures did not pin; the follow-on phase adds those rows before the rule edits.

## 6. Plan Seed

- T1: add `['/create:readme keeps failing, never run it again', '/create:readme']` to the mention table and `['read the /deep:review docs, then tell me what it does', '/deep:review']` to the document table; confirm both fail on the current head.
- T2: adjust `COMMAND_DECLINED_BY_PRONOUN` (line 415) so the end anchor is on the refusal predicate; keep the `twice`/`without a budget` rows green.
- T3: adjust the document branch (line 465) so `then` alone does not suppress the mention; keep `then run it` and `then do a thorough review` as requests.
- T4: run the guard suite and the wrapper matrix; record the before/after counts. No other file changes.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | `040-final-alignment-loop/spec.md:57`, `040-final-alignment-loop/implementation-summary.md:83`, `command-attach.ts:415`, `command-attach.ts:465` | The document-naming shape with a `then` read-only follow-up is offered (R1-P1-002); the refusal rule requires the pronoun to end the clause (R1-P1-001). |
| `checklist_evidence` | partial | `040-final-alignment-loop/acceptance-criteria.md:60`, `040-final-alignment-loop/tasks.md:131` | AC-005 is `Unmet` for pass 14 (two P1 open); CHK-FIX-002 does not cover the two new boundary shapes. |

### Overlay Protocols

All four overlay protocols are `notApplicable`: the diff contains no skill definition, no agent mirror, no feature-catalog row and no playbook capability.

### AC Coverage

`exempt`: the target folder has no `acceptance-criteria.md` at its root; the phase children own their acceptance criteria, and the phase-040 rows are reported under `checklist_evidence` instead.

## 8. Deferred Items

- The `PLAIN_ROWS` membership gap for the newest fixtures (wrapper matrix and retired-name loop do not include them) is folded into R1-P2-001; a hand-check found wrapper invariance already holds.
- A second P2 for the code comments at 412-414 and 420-422 was not raised: both comments state the intent the two P1s say the code fails, so fixing either rule fixes its comment.
- The dead-looking `sameCommandRow` branch in `typedCommandForTop` is pre-existing and outside the two changed rules; recorded as context only.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

The loop recorded seven `STUCK_RECOVERY` decisions (iterations 2-7) and a final `maxIterationsReached`; the recovery path changed granularity from file to line and replayed the two protocols, but no pivot transaction was opened, so the divergence maps are empty.

## 9. Search Ledger

- `searchCoverage` (latest record): required `[]`, covered `[]`, ruledOut `[]`, deferred `[]`, blocked `[]`, graphCoverageMode `graph`.
- `candidateCoverage`: covered `clause_boundary`, `rule_precedence`, `test_boundary_pinning`; ruledOut `backtracking_dos`, `command_name_escaping`, `markup_fold_consent`, `regex_injection`, `typed_command_boundary`.
- `searchDebt`: `[]` (no deferred or blocked bug class).
- `ruledOutCandidates`: the five ruled-out classes above, each with the action and evidence recorded in iterations 1-2.
- `cleanSearchProof`: the static/escaped pattern construction, the timing probe, the wrapper-fold check and the typed-command boundary check.

## 10. Audit Appendix

### Convergence Summary

| Iteration | Focus | New findings (P0/P1/P2) | Ratio | Stop decision |
|-----------|-------|--------------------------|-------|---------------|
| 1 | correctness | 0/2/1 | 1.00 | CONTINUE |
| 2 | security | 0/0/0 | 0.00 | CONTINUE |
| 3 | traceability | 0/0/0 | 0.00 | STUCK_RECOVERY |
| 4 | maintainability | 0/0/0 | 0.00 | STUCK_RECOVERY |
| 5 | correctness replay | 0/0/0 | 0.00 | STUCK_RECOVERY |
| 6 | consumer cross-reference | 0/0/0 | 0.00 | STUCK_RECOVERY |
| 7 | fixture invariance | 0/0/0 | 0.00 | STUCK_RECOVERY |
| 8 | traceability (cap) | 0/0/0 | 0.00 | STOP `maxIterationsReached` |

### Coverage Summary

- Dimensions: correctness, security, traceability, maintainability - all covered.
- Files: `command-attach.ts` and `command-attach-guards.vitest.ts` - both reviewed under all four dimensions.
- Terminal gates at the stop: evidence `pass`, scope `pass`, coverage `fail` (`traceability-incomplete`).
- Verdict: `FAIL` from the workflow's rule that a required gate still failing at the terminal stop fails the session, with the two P1 findings as the remediation driver.
- Active findings: 3 (2 P1, 1 P2); resolved: 0.

### Ruled-Out Claims

- Regex injection: every built pattern is static or `escapePhrase`d.
- Backtracking DoS: 400k-character adversarial prompts complete in 11 ms or less.
- Markup fold bypass: wrapped refusals still read as refusals.
- Typed-command boundary: a doc path, extension or longer name is still rejected.
- A request-reads-as-a-mention defect in the two changed rules beyond the intended limits: none found.

### Verdict Correction

`review-verdict.cjs` first ran before the terminal-gates row existed and returned `CONDITIONAL` (no failed gate was visible). After `terminal-gates.cjs` recorded `coverage: fail`, the same script returned `FAIL` with `failed_required_gate_ids: ["coverage"]`. The report, the dashboard and the final `synthesis_complete` row carry `FAIL`; the earlier `synthesis_complete` row (sequence 19) is superseded by the corrected row (sequence 20) and is kept only as ledger history. No finding count changed.

### Sources Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (whole file, `e626653ce79`)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (whole file)
- `review/review-brief-14.txt`, `review/review-scope-14.txt`
- `040-final-alignment-loop/spec.md`, `implementation-summary.md`, `acceptance-criteria.md`, `tasks.md`
- `sk-code-review/references/review-core.md`

Holdout rule honored: no `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl` was opened; no forbidden diff was run; no score summary or CLI session text was read.
