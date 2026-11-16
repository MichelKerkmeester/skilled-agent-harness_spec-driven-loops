# Review Report - Command Surfacing Pass Six, `scorer-6`

Lineage: `fanout-scorer-6-1794815529929-dybl7p` | Artifact root: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-6` | Stop reason: `maxIterationsReached` | Iterations: 3

## 1. Executive Summary

**Overall verdict: PASS (advisories only)**

- hasAdvisories: true
- Active findings: P0 = 0, P1 = 0, P2 = 4
- Review scope: the three files `review/review-scope-6.txt` assigns to area `scorer` — the transcript scorer, its vitest file, and the routing-accuracy README row and paragraph that describe it.
- Dimensions covered: correctness (iteration 1), security and traceability (iteration 2, one cross-reference pass), maintainability (iteration 3).
- Operator review focus: "Review pass six. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-6.txt and follow it: it names your area by lineage label, the scope file review/review-scope-6.txt, the diff command for each area, the recorded limits not to re-report and the holdout rule. Every finding is P0, P1 or P2 with file:line and a concrete input. Change no code and write only inside your lineage folder."

The pass-six change is sound where it matters. `redirectTargets` now strips a heredoc body before it scans for `>`, an empty body ends at its own end line, and a backslash-quoted end word is honoured; `startState` returns a shape and counts a read with no checkout write as `readOnly` rather than a start; `startShapes` sums to `started` over the same uncapped start-row set. Every new case is pinned by a test, and the packet's 036 evidence files carry the counts its criteria name.

Four P2 advisories remain. Two are residual holes in the changed logic: a second heredoc listed on one opening line leaves its body scannable, and a write whose target the transcript never names passes the inside-checkout test, so a lookup can still be scored as a start. One is stale documentation in the same README row and in a test comment, both still saying a bare document read is a start. One is the `scoreRun` return declaration, which omits the `startShape` field its consumer reads.

## 2. Planning Trigger

`/speckit:plan` is not required: no active P1 or P0 finding and no failed quality gate. The follow-on is `/create:changelog`, and the four advisories are optional cleanup for the next pass over the scorer.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": {"P0": 0, "P1": 0, "P2": 4},
  "followOn": "/create:changelog",
  "remediationWorkstreams": [
    "WS-1 heredoc and write-boundary completeness",
    "WS-2 docs and contract drift",
    "WS-3 optional: one shared shape key list"
  ],
  "specSeed": [],
  "planSeed": [
    "Strip every heredoc delimiter on an opening line, or strip the pairs in document order",
    "Treat an unnamed write as neither an inside nor an outside write for the start boundary",
    "Delete the stale cat-counts sentence from the README and the shell-step test comment",
    "Add startShape to the scoreRun return declaration and key the tally from one shape list"
  ],
  "findingClasses": ["correctness", "traceability", "maintainability"],
  "affectedSurfacesSeed": [
    "score-command-transcripts.mjs HEREDOC_BODY/redirectTargets",
    "score-command-transcripts.mjs writePaths/firstWritePosition/startShape",
    "routing-accuracy/README.md scorer row",
    "command-transcript-score.vitest.ts shell-step table",
    "score-command-transcripts.mjs scoreRun @returns/addScored"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | Evidence | Fix recommendation | Finding class | Scope proof | Affected surfaces |
|---|---|---|---|---|---|---|---|---|
| iter1-P2-second-heredoc-body-write | P2 | A second heredoc on one opening line is not stripped, so its body comparison becomes a write | correctness | `score-command-transcripts.mjs:752`, `:269-300` | Consume every delimiter on the opening line, or strip each heredoc pair in document order | correctness | Pattern, redirect consumer and shell write scanner are all in the scoped scorer | `HEREDOC_BODY`, `redirectTargets`, `shellWriteTargets`, `firstWritePosition`, `workflowPath`, `startShape` |
| iter1-P2-unnamed-write-is-inside-checkout | P2 | A write whose target is never named counts as inside the checkout, so a lookup plus an unnamed write scores as a `readWrite` start | correctness | `score-command-transcripts.mjs:327`, `:729-736`, `:1513-1518` | Count an unnamed write for `unsafe` only, never for the checkout boundary | correctness | Boundary path is the scoped scorer's own, and phase 036 names the outside-checkout write as a lookup | `writePaths`, `firstWritePosition`, `insideCheckout`, `startShape`, `startRate`, `startShapes.readWrite` |
| iter2-P2-old-start-rule-still-stated | P2 | The README and the shell-step test still say a bare document read is a start | traceability | `routing-accuracy/README.md:135`, `command-transcript-score.vitest.ts:1565-1579` | Delete the `cat` clause from both sentences and keep the search, in-place `sed` and heredoc exclusions | traceability | Both files are pass-six scoped, and the contradiction is inside one README row | `startRate`, `startShapes.readOnly`, `readDocument`, `startShape`, README scorer row, shell-step test comment |
| iter3-P2-score-run-return-omits-start-shape | P2 | `scoreRun`'s declared return type omits `startShape`, the field `addScored` reads | maintainability | `score-command-transcripts.mjs:2035-2041`, `:2104`, `:2412` | Add the field to the union and key the tally from one shape list | maintainability | Declaration, field and consumer are all in the scoped scorer | `scoreRun` `@returns`, `addScored`, `startShapes`, `newTally` |

Every finding above is active. No finding was downgraded or resolved during the run, and none duplicates a registry finding by title or by input; the `$'EOF'` heredoc form and the shell-read-as-load gap were recognised as already recorded and left out of this report.

## 4. Remediation Workstreams

### WS-1 Heredoc and write-boundary completeness (P2, advisory)
1. Make `HEREDOC_BODY`'s opening-line group stop at the last delimiter on the line, so `cat <<A <<B` consumes both bodies; add the two-delimiter case to the existing `it.each` table.
2. Decide the unnamed-write rule once: it should stay a write for `unsafe` and stop being evidence of an inside-checkout write for `startShape`, with one case per unnamed-write producer (`apply_patch` with no header, a write tool call with no path).

### WS-2 Docs and contract drift (P2, advisory)
1. Remove "a `cat` of the command's document counts" from the README row and from the comment above the shell-step table; the surrounding exclusions stay correct.
2. Add `startShape` to `scoreRun`'s `@returns` union.

### WS-3 Optional: one shared shape key list (P2 follow-on)
1. Export the five shape names from one place and build `newTally().startShapes` from it, so a renamed shape cannot print an `undefined` key.

## 5. Spec Seed

No spec is owed for this lineage: the four findings are advisories and phase 036's requirements are met at code level. If a later packet picks them up, its scope is the three scoped files plus the packet's 036 edge-case row, and its behaviour contract is:

- A heredoc body is data for every heredoc on the opening line, not only the first.
- A start requires a write the run's own checkout would keep; an unnamed write is not that evidence.
- Every printed start number and the README that describes it state the same rule.

## 6. Plan Seed

1. Extend the heredoc stripper to multi-delimiter opening lines and add the case to `command-transcript-score.vitest.ts`.
2. Split the unnamed write from the checkout boundary in `startShape`, with one test per producer.
3. Delete the stale `cat` sentence from the README and the shell-step comment.
4. Add `startShape` to the `scoreRun` declaration and, optionally, one exported shape list.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Iteration | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | pass | 1, 2, 3 | `score-command-transcripts.mjs:1494-1518`, `command-transcript-score.vitest.ts:1504` | Phase 036 REQ-004 maps to the shape return and its cases; REQ-001 holds by construction. The numeric restatement is not re-run because the brief forbids `--summary`. |
| `checklist_evidence` | pass | 2, 3 | `036-start-rate-fixed-rule/scratch/restate.txt`, `scratch/restate-sets.txt`, `scratch/after.txt`, `035-suite-metrics-and-start-shape/scratch/shape-check.txt` | The cited files carry the 22 start lines, the 10 decline lines, the 11 pre/final data lines, the 2326-passed suite line and the mutation check of the new summary case. |

### Overlay Protocols

| Protocol | Status | Iteration | Reason |
|---|---|---|---|
| `skill_agent` | notApplicable | 3 | No skill file under `.skilled/skills/system-skill-advisor` names the scorer; only the folder README does. |
| `agent_cross_runtime` | notApplicable | 3 | No agent definition in `.skilled/agents/` or a runtime mirror names the scorer. |
| `feature_catalog_code` | notApplicable | 3 | The scorer is a measurement script with no catalog row. |
| `playbook_capability` | notApplicable | 3 | No playbook capability names the scorer. |

### AC_COVERAGE

Advisory and not machine-run by this lineage: `validate.sh` is outside the permitted commands for a detached lineage. Read by hand, every 036 acceptance row is `Met` with the evidence this report cites, so the signal is expected to pass when the packet is validated at the merge.

## 8. Deferred Items

- The numeric restatement of 007 and 033 is accepted from the packet's own `scratch/` evidence, not re-scored here.
- The duplicated start rule (`startShape` versus `startedCommand`) is recorded as a follow-on risk, not a finding: the two agree today and two instances do not justify a shared helper under the repository's restraint rule.
- A missing fresh row file makes the scorer file fresh runs as `unknown_row` rather than refusing; that path predates this branch and is recorded here, not raised.

## Dimension Expansion Map

| Dimension | Iterations | Result |
|---|---|---|
| correctness | 1 | Two P2: multi-heredoc false write; unnamed write counted as inside the checkout |
| security | 2 | No finding: holdout rows are refused before a session loads, and no printed line carries prompt text |
| traceability | 2 | One P2: the old cat-counts rule survives in the README row and the shell-step comment |
| maintainability | 3 | One P2: `scoreRun`'s return declaration omits `startShape` |

## 9. Search Ledger

| Search | Method | Result | Disposition |
|---|---|---|---|
| Heredoc stripping and redirect scanning | direct read + `node --input-type=module -e` probe over `normalize` | Empty body, backslash end word and opening-line redirect behave as documented; a two-delimiter line leaves the second body scannable | finding `iter1-P2-second-heredoc-body-write` |
| Write boundary and the read-alone rule | direct read + probe over `startState`/`startedCommand` | A read plus an unnamed write returns `readWrite`; a read plus an outside-checkout write returns `readOnly` | finding `iter1-P2-unnamed-write-is-inside-checkout`; the outside-checkout case ruled in favour of the code |
| Start-shape tally invariant | direct read of `scoreRun`, `addScored`, `tallyBlock` | The four starting shapes sum to `started`; `readOnly` holds the lookups | clean |
| Holdout hygiene | direct read of `loadRowLabels`, `scoreRun`, every `process.stdout.write` line | Holdout rows are marked and refused before a session loads; output carries ids, codes and counts | clean |
| Docs against code | read of the README row and the shell-step comment | Both keep the old rule in one place | finding `iter2-P2-old-start-rule-still-stated` |
| Packet checklist evidence | read of the 036 and 035 `scratch/` files | Counts match the criteria's data lines; mutation check recorded | clean |
| Producer/consumer contract | read of `scoreRun`'s `@returns`, the object it builds and `addScored` | `startShape` is missing from the declaration | finding `iter3-P2-score-run-return-omits-start-shape` |

## 10. Audit Appendix

### Iteration Records

| Iteration | Focus | Findings | Ratio | Verdict | Gateway receipt |
|---|---|---|---|---|---|
| 1 | correctness | 2 P2 | 1.0 | PASS | ledger sequence 2, `event-588468c9` |
| 2 | security and traceability | 1 P2 | 0.3333 | PASS | ledger sequence 3, `event-96a8b6c6` |
| 3 | maintainability | 1 P2 | 0.25 | PASS | ledger sequence 4, `event-5d31c238` |

### Core Protocols Appendix

- `spec_code`: iteration 1 recorded the mapping from phase 036 REQ-004 to `startState` and its cases; iteration 3 re-read the same lines while checking the contract.
- `checklist_evidence`: iteration 2 read the four `scratch/` files named by the 035 and 036 criteria; iteration 3 carried the result.

### Overlay Protocols Appendix

- All four overlay protocols resolve `notApplicable` in iteration 3, each with the read that shows no skill, agent, catalog row or playbook capability names the scorer.

### State Integrity

- Three iteration narratives, three delta files, three canonical records and three receipted ledger appends agree on iteration number, focus, dimension set and finding ids.
- `deep-review-state.jsonl` is the gateway's projection; the lineage never wrote it directly.
- The reducer ran after each iteration (exit 0) and owns the registry, the dashboard and the anchored strategy blocks.
- The registry's `dimension` for `iter2-P2-old-start-rule-still-stated` reads `security` while its finding class is `traceability`: the reducer derives a finding's dimension from the first dimension name in the iteration focus, and iteration 2's focus names security first. The finding's own `dimension` and class in `findingDetails` and in `deltas/iter-002.jsonl` are `traceability`.
- No file outside `review/lineages/scorer-6/` was created or modified by this lineage, and no review target file was touched; `git status --porcelain -- .skilled` is empty.

### Holdout Statement

No corpus, holdout or fresh prompt file was opened by this lineage. The probes imported the scorer module and passed crafted records in memory; the only evidence reads were the packet's `scratch/` text files and the packet's acceptance criteria.
