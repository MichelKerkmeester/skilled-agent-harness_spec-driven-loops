# Review Report - hook-confirm-3b

Detached fan-out lineage of the command-surfacing deep review, pass three confirming round.

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Scope: commit `860610d783` and the two source files it changed plus their tests
- Session: `fanout-hook-confirm-3b-1794595021404-69frey`, generation 1, lineage mode `new`
- Iterations: 3 of 3 (hard stop `maxIterationsReached`)
- Operator review focus: confirm the pass-three fixes in commit `860610d783`; the doctor hook check is reviewed first and deepest, the no-edit pattern once; every finding carries file:line and a concrete input run.

## 1. Executive Summary

- **Overall verdict: CONDITIONAL.** No P0. One active P1. Four active P2.
- `hasAdvisories`: false (the verdict is conditional on the P1; the P2s are listed separately).
- **Both fixes were checked against the code by running concrete inputs.**
  - The **doctor hook check** fix holds. `node -e1 <marker>`, `node --eval=1 <marker>`, `node --print=1 <marker>`, `node -pe 1 <marker>` and `node -ci <marker>` now report `hook-missing`; eight working-launch shapes, including `node -r./preload.cjs <marker>`, `node -i <marker>`, `node -- <marker>` and `node --no-warnings <marker>`, still report `ok`. No introduced defect was found. One pre-existing P2 false-`ok` remains for `node -` and a bad short cluster.
  - The **no-edit pattern** fix fixes the case it targeted (`make no changes to its public api` and `make no changes in the tests` now return `false`) but **introduces a P1 regression in the opposite direction**: a genuine no-edit request that names its object (`make no changes to any file, just report what you find`) now returns `false`, and `attachCommand` offers `/create:agent` where the pre-commit module returned `undefined`. A P2 remains for the adverb form (`make no changes whatsoever to ...`).
- Active P0/P1/P2 counts: **0 / 1 / 4**.
- Review scope summary: two changed source files plus their two test files; three iterations covering correctness, maintainability and traceability; security had no surface (both changes are pure parsing predicates with no trust boundary crossed).
- Operator review focus: "Code review of command surfacing, PASS THREE confirming round. FIRST read the full instructions in .../review-instructions-3b.txt and follow them exactly. Scope: commit 860610d783 and the two source files it changed. Say whether each of the two fixes holds and whether it introduced a defect. Every finding is P0, P1 or P2 with file:line and a concrete input you ran. Never open holdout-prompts.jsonl. Change no code, write only inside your lineage folder."

## 2. Planning Trigger

`/speckit:plan` is required: an active P1 remains, and the fix is a one-line predicate narrowing whose correct form needs a change-verb-aware decision.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["HC3B-P1-001", "HC3B-P2-001", "HC3B-P2-002", "HC3B-P2-003", "HC3B-P2-004"],
  "remediationWorkstreams": [
    "WS-1 (P1): restore the no-edit gate for genuine object-bearing requests without re-breaking scope-limited change requests",
    "WS-2 (P2): close the adverb/different-preposition hole in the same lookahead",
    "WS-3 (P2): pin both no-edit directions in the guard table",
    "WS-4 (P2): pin the hook-check false-ok cases or record them as a known limitation"
  ],
  "specSeed": [
    "Amend 017-review-pass-two-remediation REQ-001 so the pattern's contract names the sentence shapes it must accept and reject, not just the phrase list.",
    "Record that the four AC-001 endings are the minimum class, not the whole class."
  ],
  "planSeed": [
    "Choose between: (a) keep the lookahead only when a change verb is present elsewhere in the prompt, or (b) drop the lookahead and require the change-verb rule at each caller.",
    "Add a genuine-no-edit-with-object row to tests/command-attach-guards.vitest.ts that fails on the current predicate.",
    "Add a `make no changes whatsoever to` row to the scope-limit table.",
    "Add `node - <marker>` to the hook check's not-wired table, or document the limitation in the check's header comment."
  ],
  "findingClasses": ["correctness-regression", "correctness-incomplete-fix", "correctness-existing-gap", "maintainability-test-coverage"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts",
    ".skilled/commands/doctor/scripts/hook-wiring-check.cjs",
    ".skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Disposition | Finding class | Scope proof | Affected surface hints |
|----|----------|-------|-----------|-----------|----------|--------|-------------|---------------|-------------|------------------------|
| HC3B-P1-001 | P1 | The `make no changes` lookahead is over-broad: a genuine no-edit request that names its object loses the guard | correctness | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` | `isNoEditRequest('make no changes to any file, just report what you find')` = `false`; `attachCommand('sk-doc', SINGLE('sk-create-agent'), that prompt)` = `'/create:agent'`; the pre-commit module returns `true` / `undefined` for the same prompt | A reader who explicitly rules out changes is handed a file-creating command; the catalog promise "a reader who rules out a change is never handed work that writes" is violated | active | correctness-regression | changed line in a declared-scope file; all four consumers share the predicate | attach/scorer/explainer gates; feature catalog rows |
| HC3B-P2-001 | P2 | A node argument node itself rejects still lets the next word read as the script | correctness | `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:276` | probe root `dash-only` -> `ok claude`; `printf '' \| node - probes/ran.js` prints nothing while `node probes/ran.js` prints `RAN`; `node -rc /dev/null` -> `bad option: -rc` | `/doctor` reports a broken hook as wired for exotic constructs | active | correctness-existing-gap (pre-existing) | in-scope file; same settings shape as existing rows | `/doctor` hook-wiring report |
| HC3B-P2-002 | P2 | The lookahead's word list is too narrow: an adverb or a different preposition keeps the old false no-edit reading | correctness | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` | `isNoEditRequest('make no changes whatsoever to the public api')` = `true`, identical to the pre-fix module | the `AR3-P2-001` failure mode remains reachable with one adverb | active | correctness-incomplete-fix | same changed line | attach/scorer gates |
| HC3B-P2-003 | P2 | The no-edit guard table has no genuine object-bearing no-edit row, so the regression ships with a green suite | maintainability | `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:30` | predicate returns `false` on the failing prompt while `vitest run tests/command-attach-guards.vitest.ts` reports 26/26 passed | the P1 is invisible to the suite | active | maintainability-test-coverage | in-scope test file | guard suite |
| HC3B-P2-004 | P2 | The hook-check table has no case for a leading word node does not run, so the false `ok` is untested | maintainability | `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:249` | probe returns `ok claude` for `node - <marker>` while `node --test` reports 32 pass, 0 fail | the P2 is invisible to the suite | active | maintainability-test-coverage | in-scope test file | hook check suite |

## 4. Remediation Workstreams

**P1 first**

1. **WS-1 - restore the no-edit gate for genuine object-bearing requests.** The lookahead must not disable the phrase for a sentence that only names what must stay unchanged. Options: (a) apply the exclusion only when the prompt also carries a change verb (create/refactor/rename/fix/update/add), which is the actual difference between `make no changes to any file, just report` and `refactor the parser and make no changes to its public api`; or (b) keep the pattern phrase-only and move the scope decision to each caller, which already knows the route's mutation class. Option (a) preserves the commit's intent with the smallest change.
2. **Gate to rerun:** the new genuine-no-edit rows, the two commit rows, and the four AC-001 endings must all pass; the full guard suite must stay green.

**P2 advisories (separate)**

3. **WS-2 - widen the exclusion** to `whatsoever to`, `on`, `outside`, `beyond`, or state in the comment that only `to`/`in` are handled, so the narrowness is deliberate rather than accidental.
4. **WS-3 - pin the no-edit directions** with rows that fail today (P2-003).
5. **WS-4 - pin the hook false-`ok`** or document it in `hook-wiring-check.cjs`'s header as a known limitation (P2-004).

## 5. Spec Seed

- `017-review-pass-two-remediation` REQ-001 names a phrase list (`make no changes`, `no changes yet`, the `don't` contraction) but not the sentence shapes the phrase must accept or reject. Add the shapes: "phrase at end of request" and "phrase followed by an object that names what must not change, inside a change request" are different classes.
- AC-001's `Met` row is scoped to requests **ending** in each of the four wordings. Keep that scope but add the object-bearing class as a new criterion rather than widening AC-001 retroactively.
- Record that the pass-three commit changed the predicate's accepted class after AC-001 was marked Met, so a future reader does not read `Met` as covering the new form.

## 6. Plan Seed

1. Decide the WS-1 mechanism (change-verb-aware lookahead vs. caller-side scope decision) and state which one the codebase's layering prefers.
2. Write the failing test first: a genuine no-edit request naming its object must return `false` from `attachCommand`.
3. Re-run the two commit rows and the four AC-001 endings to prove no re-break.
4. Decide whether `make no changes whatsoever to` belongs in the same change or a follow-up.
5. For the hook check, decide between a new test row and a documented limitation; the `node -` bridge is not worth code complexity.

## 7. Traceability Status

**Core Protocols**

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | `017-review-pass-two-remediation` REQ-001 mechanism statement; AC-001 four endings all `true`; AC-027 launches pass (hook suite 32/32) | REQ-001's phrase is narrowed for object-bearing sentences without a spec change (HC3B-P1-001) |
| `checklist_evidence` | pass | AC-001 at `017-.../acceptance-criteria.md:56` and AC-027 at `:82` remain `Met` for the literal scope they state | neither row claims the object-bearing class; that is the P2-003 gap, not a false `Met` |

`AC_COVERAGE`: exempt (no `checklist.md` at the review target; the owning phase packet's `acceptance-criteria.md` was read instead).

**Overlay Protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | `attachCommand` (`command-attach.ts:335`) consumes the shared predicate; no gate holds a private copy |
| `agent_cross_runtime` | notApplicable | no runtime mirror in this diff |
| `feature_catalog_code` | partial | `feature-catalog/cli-surface/advisor-recommend.md:33` and `feature-catalog/scorer-fusion/command-meaning-matching.md:36` state the no-edit promise; contradicted for the object-bearing class by HC3B-P1-001 |
| `playbook_capability` | notApplicable | no playbook surface in this diff |

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept directions: hook-check correctness (iteration 1, saturated at the operator's requested depth), no-edit predicate correctness (iteration 2), test-table and traceability coverage (iteration 3)
- Remaining frontier: none; the cap was reached before any new direction could be opened

## 8. Deferred Items

- The commit's wider suite claim ("Suite 184 files, 1798 passed... Doctor tests 1215") is unverified: the dispatch permits only the two named single test files. No finding depends on it.
- A holdout/eval measurement of the predicate change was not run and is out of scope for this lineage (`holdout-prompts.jsonl` was never opened).
- The `node -` bridge and bad-cluster cases are accepted as advisory; fixing them is not worth code complexity unless a real hook uses them.

## 9. Search Ledger

No `reviewDepthSchemaVersion: 2` search ledger was emitted for this lineage (legacy v1 iteration records). Coverage is recorded through the iteration `filesReviewed` lists, the `files under review` strategy table, and the ruled-out directions below:

- Hook-check fix driver (`readWords`, `commandWords`, `nodeFlagSkipsScript`, `runsNodeOnMarker`, `scriptWord`, `runsMarker`) — reviewed, 13 CLI probes.
- No-edit predicate and all four consumers — reviewed, 9 predicate/attach probes against current and pre-commit modules.
- Test tables for both surfaces — reviewed, both suites run.
- Packet traceability (REQ-001, AC-001, AC-027) and feature catalog — reviewed.
- Not reviewed: `holdout-prompts.jsonl` (prohibited), the wider suite, and the `/doctor` route file that spawns the hook check.

## 10. Audit Appendix

**Convergence summary**

| Iteration | Focus | Ratio | P0/P1/P2 (new) | Verdict |
|---|---|---|---|---|
| 1 | correctness (hook check) | 1.00 | 0/0/1 | PASS |
| 2 | correctness (no-edit predicate) | 0.86 | 0/1/1 | CONDITIONAL |
| 3 | maintainability + traceability | 0.22 | 0/0/2 | CONDITIONAL |

Stop reason: `maxIterationsReached` (3 of 3). Composite convergence was not reached: the last ratio 0.22 exceeds the 0.10 threshold. No stuck recovery, no P0, no blocked stop.

**Coverage summary**

- Dimensions: correctness, maintainability, traceability covered (3/4 = 0.75). Security has no surface in this diff.
- Files under review: all four in-scope files reviewed; both test files exercised by their suites.

**Ruled-out claims**

- The hook fix reporting a plausible working hook command as `hook-missing` — ruled out by eight no-regression probes.
- The `/^-[rC]/` early return hiding a real no-run short flag — ruled out by node's own option behaviour.
- The no-edit fix breaking the `AR3-P2-001` case — ruled out; both commit rows return `false`.
- Another `NO_EDIT_REQUEST` alternative catching the failing prompt — ruled out by enumerating all nine.
- A caller compensating with a second check — ruled out; all four delegate.
- The packet's acceptance rows being falsely `Met` — ruled out; both are scoped to the literal classes they tested.
- Feature-catalog doc drift — ruled out; the contradiction is behavioural, not stale wording.

**Sources reviewed**

`.skilled/commands/doctor/scripts/hook-wiring-check.cjs` (full), `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (no-edit region and `attachCommand`), `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` (two gates), `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts` (`isReadOnlyExplainer`), `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`, `017-review-pass-two-remediation/spec.md` REQ-001 and `acceptance-criteria.md` AC-001/AC-027, `feature-catalog/cli-surface/advisor-recommend.md`, `feature-catalog/scorer-fusion/command-meaning-matching.md`, commit `860610d783` diff, and the pre-commit module at `860610d783^` (extracted into `probes/command-attach-pre.ts`).

**State integrity note**

Two canonical iteration records carry `findingsSummary` transcription values that disagree with the reducer-owned registry:

- Iteration 2: recorded `{"P0":0,"P1":2,"P2":1}` (count 2); correct running total is `{"P0":0,"P1":1,"P2":2}` (count 3).
- Iteration 3: recorded `{"P0":0,"P1":1,"P2":3}` (count 4); correct running total is `{"P0":0,"P1":1,"P2":4}` (count 5).

The delta finding rows, `deep-review-findings-registry.json` and the dashboard carry the correct counts (P1 1, P2 4) and are the authoritative record the merge reads. The records were not rewritten because the state log is a projection of an append-only ledger and a second run row would break the one-record-per-iteration contract. Reported here so no reader treats the recorded summaries as the active totals.
