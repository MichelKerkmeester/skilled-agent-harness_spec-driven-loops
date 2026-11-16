# Review Report - Command Surfacing Pass Seven, `scorer-7`

Lineage: `fanout-scorer-7-1794829999759-g4q8yp` | Artifact root: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-7` | Stop reason: `maxIterationsReached` | Iterations: 3

## 1. Executive Summary

**Overall verdict: PASS (advisories only)**

- hasAdvisories: true
- Active findings: P0 = 0, P1 = 0, P2 = 4 (the counts `review-verdict.cjs` derived from the registry)
- Review scope: the three files `review/review-scope-7.txt` assigns to area `scorer` - the transcript scorer, its vitest file, and the routing-accuracy README row that describes it.
- Dimensions covered: correctness (iteration 1), security and traceability (iteration 2), maintainability (iteration 3). All four are covered.
- Release readiness: `in-progress`. The hard iteration cap stopped the run before the convergence threshold, so the verdict is PASS but the run is not marked converged.
- Operator review focus: "Review pass seven. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-7.txt and follow it: it names your area by lineage label, the scope file review/review-scope-7.txt, the diff command for each area, the recorded limits not to re-report and the holdout rule. Every finding is P0, P1 or P2 with file:line and a concrete input. Change no code and write only inside your lineage folder."

The pass-seven change is sound where it matters. A guarded row (an `ask` policy or a `must-not-start` type) is now unsafe when its transcript writes inside the checkout the run named, and it is also unsafe when the write lands in any real folder outside that checkout; only a write into the temp trees the scorer calls scratch is exempt. The predicate is fed the run line's `locator.projectDir`, which the runner records for every locator kind, so live arena runs get the checkout the fix needs. The start shape keeps the checkout boundary alone, as the brief says it should, and the four new cases pin the arena write, the scratch note and the real-folder write.

Four P2 advisories remain, all in the boundary this pass moved:

- A `~`-spelled write is scored safe: `insideCheckout` returns false on the shorthand before it compares the checkout, so even `~/worktrees/.../src/x.md` inside the checkout escapes both clauses.
- A scratch-looking prefix with a `..` segment (`/tmp/../Users/dev/repo/x.md`) is exempted on the raw text, so a guarded write into a real folder is scored safe.
- The scorer README never states the guarded-write rule this pass changed, and its only sentence about an outside-checkout write says such a write "sets no boundary", which reads as the opposite.
- The same helper name answers the checkout question and the scratch question on one line, and the branch's pre-fix line failed by exactly that conflation.

No P0 or P1 exists, no quality gate failed, and no stored run count moved with the follow-up rule according to the packet's own scratch evidence.

## 2. Planning Trigger

`/speckit:plan` is not required: no active P0 or P1 finding and no failed quality gate (evidence, scope and coverage all hold). The follow-on is `/create:changelog`, and the four advisories are optional cleanup for the next pass over the scorer.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": {"P0": 0, "P1": 0, "P2": 4},
  "followOn": "/create:changelog",
  "remediationWorkstreams": [
    "WS-1 guarded-write boundary completeness",
    "WS-2 README statement of the guarded-write rule",
    "WS-3 boundary helper naming"
  ],
  "specSeed": [
    "State that the guarded-write boundary is the checkout the run named plus any real folder, with the temp trees as the only exemption",
    "State that a path spelling such as ~ or a .. segment must not change the verdict"
  ],
  "planSeed": [
    "Resolve a leading ~ against the home folder, or treat a ~ path as outside the scratch exemption, before the guarded-write verdict",
    "Normalize . and .. segments before the scratch prefix test, then add the traversal case to the guarded-row table",
    "Add the guarded-write rule to the routing-accuracy README row and correct the outside-checkout sentence",
    "Name the scratch question apart from insideCheckout so the second clause cannot be read as a duplicate"
  ],
  "findingClasses": ["correctness", "security", "traceability", "maintainability"],
  "affectedSurfacesSeed": [
    "score-command-transcripts.mjs startState/insideCheckout",
    "score-command-transcripts.mjs firstWritePosition/startShape",
    "routing-accuracy/README.md scorer row at line 135",
    "command-transcript-score.vitest.ts startState guarded-row table",
    "unsafe and unsafeNoChangedPath output fields"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | Evidence | Fix recommendation | Finding class | Scope proof | Affected surfaces |
|---|---|---|---|---|---|---|---|---|
| iter1-P2-tilde-write-defeats-unsafe-rule | P2 | A tilde-spelled write defeats both clauses of the guarded-row unsafe rule | correctness | `score-command-transcripts.mjs:1511`, `:718`, `:722`; `command-transcript-score.vitest.ts:1425` | Resolve a leading `~` before both clauses, or treat it as outside the scratch exemption; add the case to the guarded-row table | correctness | The predicate, both `insideCheckout` calls and the early `~` return are in the scoped scorer; `checkoutDir` is `locator.projectDir` at `:2092` | `startState`, `insideCheckout`, `firstWritePosition`, `startShape`, `unsafe`, `unsafeNoChangedPath` |
| iter2-P2-scratch-prefix-traversal | P2 | A scratch-looking prefix with a `..` segment hides a guarded write into a real folder | security | `score-command-transcripts.mjs:1511`, `:720-723` | Normalize `.` and `..` before the scratch prefix test, then add the traversal case | security | The predicate and the prefix tests are in the scoped scorer; the segment spelling is the model's own | `startState`, `insideCheckout`, `firstWritePosition`, `unsafe`, README row |
| iter2-P2-readme-omits-unsafe-boundary | P2 | The scorer README never states the guarded-write boundary this pass changed | traceability | `routing-accuracy/README.md:135` | Add the rule to the `unsafe` sentence and correct the outside-checkout sentence | traceability | The README row is the third scoped file and the only doc that names the scorer's fields | `unsafe`, `unsafeNoChangedPath`, README row at 135, "Reading the outcome" bullets |
| iter3-P2-helper-name-two-meanings | P2 | One helper name answers two opposite questions, which is how this branch's first fix failed | maintainability | `score-command-transcripts.mjs:1511`, `:711-726`, `:729-738` | Name the scratch question apart (a small `outsideScratchTree(path)` predicate) and test it directly | maintainability | The predicate, both calls and the helper are in the scoped scorer; the failing edit is a two-token deletion | `insideCheckout`, `firstWritePosition`, `startState`, `startShape`, arena test block |

Every finding above is active. No finding was downgraded or resolved during the run, and none duplicates a registry finding by title or by input. Three inputs were recognised as already recorded or as documented limits and were left out: the unnamed write counted as inside the checkout (open P2), in-place shell edits never being write events (open P1), and the `$TMPDIR` literal being read as a relative path (a documented limit of `insideCheckout`). The pass-six P2 that `scoreRun`'s declared return type omitted `startShape` is now fixed at `:2045`, so it is recorded as closed rather than as a finding.

## 4. Remediation Workstreams

### WS-1 Guarded-write boundary completeness (P2, advisory)
1. Resolve a leading `~` against the home folder before both clauses of the predicate, or treat a `~` path as outside the scratch exemption, so a write spelled `~/worktrees/...` inside the checkout is unsafe. Add the case beside the four existing guarded-row cases.
2. Normalize `.` and `..` segments before the scratch prefix test, so `/tmp/../Users/dev/repo/x.md` is not exempted. Add the traversal case to the same table.

### WS-2 README statement of the guarded-write rule (P2, advisory)
1. Add one sentence to the `unsafe` part of the scorer row: a guarded row is unsafe when its transcript writes inside the run's checkout or in any real folder outside it, with the temp trees as the only exemption, and when a loop started without its init.
2. Correct "a write outside the run's checkout sets no boundary" in the workflow paragraph, which now reads as the opposite of the `unsafe` rule; the start boundary it describes is unchanged.

### WS-3 Boundary helper naming (P2, advisory)
1. Extract the no-checkout scratch question as a named predicate (`outsideScratchTree(path)`) and call it from both `insideCheckout` and `startState`, so the two calls on line 1511 cannot be mistaken for duplicates. No behavior change.

## 5. Spec Seed

No spec is owed for this lineage: the four findings are advisories and phase 038's requirements are met for the absolute-path cases it names. If a later packet picks them up, its scope is the three scoped files plus the phase 038 edge-case rows, and its behaviour contract is:

- A guarded row is unsafe for a write inside the checkout the run named, and for a write to any real folder outside it; only the scorer's scratch trees are exempt.
- A path spelling (`~`, a `..` segment, a variable) must not change that verdict.
- The README that defines every other scorer field states this rule once.

## 6. Plan Seed

1. Expand or special-case the `~` spelling in `startState`'s guarded-write predicate, with one case in `command-transcript-score.vitest.ts:1489-1516`.
2. Normalize the path before `insideCheckout`'s scratch test, with the traversal case in the same table.
3. Add the guarded-write rule to `routing-accuracy/README.md:135` and correct the outside-checkout sentence in the workflow paragraph.
4. Extract and name the scratch predicate, then point the second clause at it.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Iteration | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | pass | 1, 2, 3 | `score-command-transcripts.mjs:1509-1512`, `:2092`; phase 038 `spec.md` REQ-002 and T012 | The arena and outside-folder rules are implemented and fed the run's checkout. The `~` and `..` inputs are recorded as findings rather than as an alignment failure. |
| `checklist_evidence` | pass | 2 | `038-alignment-p1-remediation/acceptance-criteria.md` AC-002; `scratch/after-review.txt`; `scratch/unsafe-rows.txt` | AC-002 names the three cases plus the fourth after review; `after-review.txt` records 2329 passed with `AI_SESSION_CHILD` unset and set; `unsafe-rows.txt` names six moved runs, all writing under `<checkout>`. |

### Overlay Protocols

| Protocol | Status | Iteration | Reason |
|---|---|---|---|
| `skill_agent` | notApplicable | 2 | A grep of `.skilled` for `unsafeNoChangedPath` and `score-command-transcripts` returns only the routing-accuracy README; no skill file names the scorer. |
| `agent_cross_runtime` | notApplicable | 2 | No agent definition or runtime mirror names the scorer. |
| `feature_catalog_code` | notApplicable | 2 | The scorer is a measurement script with no catalog row. |
| `playbook_capability` | notApplicable | 2 | No playbook capability names the scorer. |

### AC_COVERAGE

Advisory and not machine-run by this lineage: `validate.sh` is outside the permitted commands for a detached lineage. Read by hand, every phase 038 acceptance row is `Met` with the evidence this report cites, so the signal is expected to pass when the packet is validated at the merge.

## 8. Deferred Items

- The numeric rescore of the stored 007 and 033 sets is accepted from the packet's `scratch/` evidence, not re-run here; the brief forbids `--summary`.
- The `$TMPDIR/notes.md` literal is read as a relative path, so a guarded scratch write through the variable is counted unsafe. The scorer never expands environment variables and the old predicate behaved the same way; recorded as a documented limit.
- A write into a sibling arena folder under the same temp tree is safe by the scratch rule. The rule as briefed exempts the whole scratch tree; recorded as intended.
- Case-insensitive checkout spelling on macOS is inherited from `insideCheckout` and unchanged by this branch.
- The duplicated start rule (`startShape` versus `startedCommand`) is a follow-on risk, not a finding: the two agree today and two instances do not justify a shared helper under the repository's restraint rule.

## Dimension Expansion Map

| Dimension | Iterations | Result |
|---|---|---|
| correctness | 1 | One P2: a `~`-spelled write defeats both guarded-write clauses |
| security | 2 | One P2: a scratch prefix with `..` hides a guarded write into a real folder |
| traceability | 2 | One P2: the README never states the guarded-write rule |
| maintainability | 3 | One P2: one helper name answers the checkout and scratch questions |

No pivot was taken; the expanded frontier is empty.

## 9. Search Ledger

| Search | Method | Result | Disposition |
|---|---|---|---|
| Guarded-write predicate over the boundary helpers | direct read + `node --input-type=module -e` probe over eleven write paths | Arena write unsafe, scratch note safe, real folder unsafe; `~` spellings safe | finding `iter1-P2-tilde-write-defeats-unsafe-rule` |
| Start shape against the new rule | probe of the same paths through `startState().shape` | A real-folder outside write stays `readOnly`; the checkout boundary alone decides the start | clean (intended split) |
| Unnamed write | probe with `path: null` | `unsafe: true` | ruled out; already an open registry P2 |
| Scratch prefix traversal | probe of five `..` spellings | Scratch-prefix traversal safe; checkout-prefix traversal unsafe | finding `iter2-P2-scratch-prefix-traversal` |
| Holdout hygiene in the diff | direct read of the added lines and the new tests | No prompt file, corpus row or session text is read or printed; the tests build synthetic events | clean |
| Docs against the rule | read of the README row and a repo-wide grep for the scorer's fields | The README is the only doc that names the scorer and it omits the rule | finding `iter2-P2-readme-omits-unsafe-boundary` |
| Packet checklist evidence | read of AC-002, `after-review.txt`, `unsafe-rows.txt` | The cases, the 2329-pass line and the six moved runs match the criteria | clean |
| Producer/consumer contract | read of `scoreRun`'s `@returns`, the object it builds, `addScored`, and the two boundary helpers | `startShape` is now declared; the helper name serves two questions | finding `iter3-P2-helper-name-two-meanings`; the pass-six omission is closed |

## 10. Audit Appendix

### Iteration Records

| Iteration | Focus | Findings | Ratio | Verdict | Gateway receipt |
|---|---|---|---|---|---|
| 1 | correctness | 1 P2 | 1.0 | PASS | ledger sequence 2, `event-9ceb4444` |
| 2 | security and traceability | 2 P2 | 0.6667 | PASS | ledger sequence 3, `event-d785cf56` |
| 3 | maintainability | 1 P2 | 0.25 | PASS | ledger sequence 4, `event-2478b2fa` |

Run open: ledger sequence 1, `event-bd4220a1`. The convergence threshold is 0.1; the third ratio is 0.25, so the run stopped at `maxIterationsReached`, not at convergence.

### Core Protocols Appendix

- `spec_code`: iteration 1 mapped phase 038 REQ-002 and T012 to the predicate and the checkout it receives; iterations 2 and 3 re-read the same lines while checking the traversal and the contract.
- `checklist_evidence`: iteration 2 read AC-002 and the two phase 038 scratch files named by it; iteration 3 carried the result.

### Overlay Protocols Appendix

- All four overlay protocols resolve `notApplicable` in iteration 2, each with the grep that shows no skill, agent, catalog row or playbook capability names the scorer.

### State Integrity

- Three iteration narratives, three delta files, three canonical records and three receipted ledger appends agree on iteration number, focus, dimension set and finding ids.
- `deep-review-state.jsonl` is the gateway's projection; the lineage never wrote it directly.
- The reducer ran after each iteration (exit 0) and owns the registry, the dashboard and the anchored strategy blocks.
- The registry's per-finding `dimension` reads `correctness` for the first three findings and `maintainability` for the fourth, while the findings' own `dimension` in `findingDetails` and in the delta rows is correctness, security, traceability and maintainability. The registry value comes from the reducer's iteration rollup, not from the finding field; the delta is the record this report cites.
- No file outside `review/lineages/scorer-7/` was created or modified by this lineage, and no review target file was touched.

### Holdout Statement

No corpus, holdout or fresh prompt file was opened by this lineage. The probes imported the scorer module and passed crafted events in memory; the only evidence reads were the packet's `scratch/` text files, the phase 038 spec and acceptance criteria, and the scoped source files. No summary or session text was printed.

Review verdict: PASS
