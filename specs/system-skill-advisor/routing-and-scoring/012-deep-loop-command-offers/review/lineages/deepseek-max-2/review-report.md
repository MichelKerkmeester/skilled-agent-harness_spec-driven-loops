# Review Report — Packet 012 / lineage deepseek-max-2

**Target:** `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
**Lineage:** `deepseek-max-2` — session `fanout-deepseek-max-2-1795514074741-gl47kr`, generation 1, mode `new`
**Executor:** `cli-pi` model `deepseek-v4.1-flash-1017`
**Iterations:** 5 of 5 (`stopPolicy=max-iterations`), stop reason `maxIterationsReached`

---

## 1. Executive Summary

- **Overall verdict: FAIL**
- **hasAdvisories: false**
- **Active findings the verdict used: P0=0, P1=1, P2=7**
- **Why FAIL:** the terminal gates recorded at this stop read evidence `pass`, scope `pass`, coverage **`fail`** (`coverage-too-young`). The shared rule this workflow states — any P0, or a required quality gate still failing at the terminal stop, is a FAIL — makes coverage the deciding gate, and an active P1 is also present. `review-verdict.cjs` computed this from the registry and the state log: `{"verdict":"FAIL","active_p0":0,"active_p1":1,"active_p2":7,"failed_required_gate_ids":["coverage"]}`.
- **Why the coverage gate failed:** all four dimensions are recorded as covered (`dimensionCoverage` all `true`) and both traceability protocols completed, but the gate also requires `coverageAge >= 1`, an iteration after the last newly covered dimension. The fifth and final capped iteration is where maintainability was first covered, so no stabilization pass follows it. This is a property of running four dimensions plus two traceability protocols inside a five-iteration cap, not a missing dimension: it is also why REQ-033 / AC-040 cannot be satisfied by this run as configured.
- **Self-check outcomes:** no finding was downgraded, upgraded or called a false positive by the terminal self-check, so the counts above are the counts as raised. One P1 candidate was taken through a compact Hunter/Skeptic/Referee pass inside iteration 3 and confirmed at P1 (its claim-adjudication packet is in `iterations/iteration-003.md`). No P0 was ever a candidate, so no full three-pass ran.
- **Review scope:** 46 files in `reviewScopeFiles`; 5 iterations covering correctness, security, traceability (both core protocols) and maintainability; reads confined to the declared scope, with commands, playbook assets and skills cited only as traceability context.
- **Operator review focus (verbatim):** "Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006)."
- **How the focus was addressed:** iterations 1 and 2 ran `spec_code` and `checklist_evidence` to completion — every REQ-001..REQ-034 resolved to a producer at a cited line, 110 of 110 path:line citations in the closure rows resolved, 39 `Met` rows read, and the sixth/seventh-round rows read against the tree. Four of the eight findings are the direct result of that pass (stale evidence cells and one stale requirement pointer).

---

## 2. Planning Trigger

`/speckit:plan` **is required**: the verdict is FAIL and eight active findings remain (one P1, seven P2).

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "ITER3-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:441"},
    {"id": "ITER1-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:87"},
    {"id": "ITER1-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:86"},
    {"id": "ITER1-P2-003", "severity": "P2", "dimension": "traceability", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:99"},
    {"id": "ITER2-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:88"},
    {"id": "ITER3-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:842"},
    {"id": "ITER4-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1554"},
    {"id": "ITER5-P2-001", "severity": "P2", "dimension": "maintainability", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:213"}
  ],
  "remediationWorkstreams": [
    {"id": "W1", "priority": 1, "findingIds": ["ITER3-P1-001"], "summary": "Decide whether plural loop nouns join the ask vocabulary; if yes, extend both copies and the fixture; if no, record it beside limitation 7"},
    {"id": "W2", "priority": 2, "findingIds": ["ITER1-P2-001", "ITER1-P2-002", "ITER1-P2-003", "ITER2-P2-001", "ITER5-P2-001"], "summary": "Repoint the stale closure evidence: fixture count, changelog quote, suite totals, AC-031 lines, REQ-006 file"},
    {"id": "W3", "priority": 3, "findingIds": ["ITER3-P2-001"], "summary": "Decide whether performance complaints about the loop are guarded or recorded as a limitation"},
    {"id": "W4", "priority": 4, "findingIds": ["ITER4-P2-001"], "summary": "Check a fallback-supplied command against TRACKED_COMMANDS before the brief renders it"},
    {"id": "W5", "priority": 5, "findingIds": [], "summary": "Satisfy the coverage gate for REQ-033 / AC-040: rerun with a stabilization pass after the last new dimension, or amend the criterion"}
  ],
  "specSeed": [
    "REQ-031 gains the plural loop nouns if W1 chooses the guard, with fixture cases and drift-guard pairs for any new list",
    "REQ-006 names command-attach-guards.vitest.ts, the file that holds the loop-ask and depth-word cases",
    "REQ-034 gains a clause that every evidence cell's stated count is re-read after a later round changes the artefact it counts",
    "REQ-033 restates the coverage-gate requirement so a capped run can satisfy it, or AC-040 is amended with the reason"
  ],
  "planSeed": [
    "Extend LOOP_NAMES / LOOP_WORDING (or the matcher) with plural forms in both copies; add fixture cases for run two research loops and run 2 deep reviews; add the plural entries to the per-entry coverage test",
    "Repoint acceptance-criteria.md AC-029/030/031/037/042 and tasks.md T063/T068/T075/T087 to the tree's current numbers and lines",
    "Decide the performance-vocabulary call with the operator (guard vs limitation 8-style record) and record it in decision-record.md",
    "Add an own-key table check to the degraded typed branch in skill-advisor-cli.ts and a golden case that fails without it",
    "Rerun /deep:review with --max-iterations=6 so the last covered dimension gains a stabilization pass, then close AC-040"
  ],
  "findingClasses": {
    "ITER3-P1-001": "class-of-bug",
    "ITER1-P2-001": "evidence-drift",
    "ITER1-P2-002": "evidence-drift",
    "ITER1-P2-003": "evidence-drift",
    "ITER2-P2-001": "evidence-drift",
    "ITER3-P2-001": "instance-only",
    "ITER4-P2-001": "instance-only",
    "ITER5-P2-001": "instance-only"
  },
  "affectedSurfacesSeed": {
    "ITER3-P1-001": [".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts", ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py", ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json"],
    "ITER1-P2-001": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md", "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md"],
    "ITER1-P2-002": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md", ".skilled/changelog/skilled/v4.2.0.0.md"],
    "ITER1-P2-003": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md", "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md"],
    "ITER2-P2-001": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md", ".skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts"],
    "ITER3-P2-001": [".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts", ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py"],
    "ITER4-P2-001": [".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts", ".skilled/skills/system-skill-advisor/runtime/lib/render.ts"],
    "ITER5-P2-001": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md"]
  },
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Fix | Disposition | Finding class | Scope proof | Affected surfaces |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ITER3-P1-001 | P1 | Plural loop names are never read as loop asks, in either copy | correctness | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:441` | `LOOP_NAMES` holds only `deep loop` / `research loop` / `review loop`; `LOOP_WORDING` phrases end on a word boundary; `LOOP_COUNT` covers passes, rounds and iterations only. Measured in both copies: "run two research loops", "run 2 deep reviews of the parser", "do deep reviews of the parser" → `false`; singular forms → `true` | An explicit loop ask with a use verb gets no command, so option A of the offer never appears — the failure `spec.md:34` states as the packet's reason to exist | Extend the vocabulary (or the matcher) with plural loop nouns in both copies, add fixture cases, and add the plural entries to the per-entry coverage test | active | class-of-bug | Producer file in scope; result measured by executing `dist/runtime/lib/command-attach.js` and `skill_advisor.asks_for_loop_run` | `LOOP_NAMES`, `LOOP_WORDING`, `LOOP_COUNT` in both copies; fixture; drift guard |
| ITER1-P2-001 | P2 | Closure evidence states a fixture size the fixture no longer has | traceability | `acceptance-criteria.md:87` | Fixture holds 248 cases (counted from the tracked file); AC-030/037/042 and T068/075/087 say 203 | A `Met` row's stated observation cannot be reproduced | Repoint the count to 248 (or state the round it measured) | active | evidence-drift | Packet docs and fixture both in scope; count read from the file | `acceptance-criteria.md` AC-030/037/042; `tasks.md` T068/075/087; `implementation-summary.md:165-166` |
| ITER1-P2-002 | P2 | A `Met` row and its task quote a changelog number that is gone | traceability | `acceptance-criteria.md:86` | Changelog holds no `2,696`; its suite table at `:759` quotes 3,126 | The row rests on an observation the tree contradicts | Repoint to `changelog:759` | active | evidence-drift | Both files in scope; absence measured by search | `acceptance-criteria.md:86`; `tasks.md:128`; changelog `:759` |
| ITER1-P2-003 | P2 | Two closure rows state different suite totals for the same tree | traceability | `acceptance-criteria.md:99` | AC-042 and T081 say 3,029 "on the final staged tree"; T087, `implementation-summary.md:172` and the changelog say 3,126 | The release row cannot prove the current tree's suite is green | Label AC-042 with its round, or restate the final total | active | evidence-drift | All four files in scope; disagreement read from the cells (suite not re-run in this write surface) | `acceptance-criteria.md:99`; `tasks.md:163,174`; `implementation-summary.md:164,172`; changelog `:759` |
| ITER2-P2-001 | P2 | AC-031's evidence lines land beside the cases they describe | traceability | `acceptance-criteria.md:88` | `:196` is a prose comment, `:239` a fixture property; the cases open at `:199` and `:250` | A reader cannot confirm the row from the line it names | Repoint to `:199` and `:250` | active | evidence-drift | Both files in scope; lines read directly | `acceptance-criteria.md:88`; `doctor-handoff-command.vitest.ts:199,250` |
| ITER3-P2-001 | P2 | Complaints about the loop's speed or cost are read as run asks | correctness | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:842` | `LOOP_EDIT_LEAD` holds edit verbs, not performance verbs; five variants return `true` in both copies; "tune" is caught only because it is an edit verb | A request to make the loop faster is answered with an offer to run it — sibling of limitation 7 | Guard the family or record it as a limitation; D2's rule (`spec.md:43`) excludes it | active | instance-only | Producer and `spec.md` in scope; results measured in both copies | `LOOP_EDIT_LEAD`, `LOOP_ARTIFACT_NOUNS`, Python mirrors, limitation 7 |
| ITER4-P2-001 | P2 | The degraded brief renders a fallback-supplied command string unchecked | security | `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1554` | `{ command: entry.command }` forwards the child's string; `render.ts:231` renders it; every other path resolves from `TRACKED_COMMANDS` with `Object.hasOwn` | A hostile or buggy child puts arbitrary text in the runnable-command position; not reachable from the prompt alone | Check the value against the tracked table before rendering | active | instance-only | CLI, render and subprocess in scope; both sites read | `skill-advisor-cli.ts:1554-1562`; `render.ts:227-240`; `subprocess.ts:199-240` |
| ITER5-P2-001 | P2 | REQ-006 points a maintainer at a test file that holds none of the cases it names | maintainability | `spec.md:213` | `command-attach.vitest.ts` has 0 `asksForLoopRun`/loop-vocabulary matches; `command-attach-guards.vitest.ts` has 5 | A maintainer follows the requirement to the wrong file | Name `command-attach-guards.vitest.ts` | active | instance-only | `spec.md` and both test files in scope; absence measured | `spec.md:213`; `acceptance-criteria.md:66`; both test files |

Registry note: `deep-review-findings-registry.json` is reducer-owned and is the authority for counts (P0=0, P1=1, P2=7). Its `dimension` field shows the reducer's fallback (`correctness`) for findings whose delta rows did not carry a `dimension`, and its `findingClass` / `scopeProof` are `null` for the same reason — the iteration narratives and the delta rows' titles are the source for the classes shown above. The dimension column here is the dimension the finding was actually raised under.

---

## 4. Remediation Workstreams

**W1 — P1, decide the plural vocabulary (ITER3-P1-001).** One call: does `run two research loops` join the ask set? If yes, both gate copies move together, the shared fixture gains a plural case per loop noun, and the drift guard's per-entry list gains the plural spellings. If no, the operator records it as a limitation beside limitation 7 and the finding resolves by decision. Do this first: it is the only finding that changes behaviour.

**W2 — P2, repoint the closure evidence (ITER1-P2-001/002/003, ITER2-P2-001, ITER5-P2-001).** Five rows, one pass. Each is a line or a number, all inside the packet. The fixture count, the changelog quote, the two suite totals, AC-031's two line numbers, and REQ-006's file name. W2 is cheap and unblocks the packet's closeability evidence.

**W3 — P2, decide the performance vocabulary (ITER3-P2-001).** Same shape of decision as W1 and the same operator, so take them together: guard the family or record it.

**W4 — P2, harden the degraded command path (ITER4-P2-001).** A table check at the pass-through site plus a golden case that fails without it. No behaviour change for a healthy child.

**W5 — the coverage gate.** REQ-033 / AC-040 cannot be closed by a five-iteration run whose last dimension is covered in the final pass. Either rerun with `--max-iterations=6` (one stabilization pass after maintainability), or amend AC-040 to state the coverage-age rule and why a capped run stops short of it.

---

## 5. Spec Seed

- REQ-031: record the plural loop nouns if W1 chooses the guard, with the fixture cases and the drift-guard pairs that keep both copies equal.
- REQ-006: name `tests/command-attach-guards.vitest.ts`, the file that holds the loop-ask and depth-word cases.
- REQ-034: add the clause the review proved necessary — any evidence cell that quotes a count must be re-read after a later round changes the artefact it counts (the fixture grew from 203 to 248, and the suite total moved from 3,029 to 3,126).
- REQ-033: restate the coverage-gate requirement so a capped run can satisfy it, or state the coverage-age rule and amend AC-040.

## 6. Plan Seed

- Extend the loop vocabulary in both gate copies, add the plural fixture cases, and extend the per-entry case lists (`command-attach.ts:441`, `skill_advisor.py:5021`, `deep-loop-offer-cases.vitest.ts:241-296`).
- Repoint the five closure rows (`acceptance-criteria.md:86,87,88,99`, `tasks.md:128,140,151,163,174`, `implementation-summary.md:165-166`, `spec.md:213`).
- Record the performance-vocabulary decision in `decision-record.md` and, if it is a limitation, in `implementation-summary.md` beside limitation 7.
- Add an own-key table check to the degraded typed branch (`skill-advisor-cli.ts:1554`) with a golden case.
- Rerun `/deep:review` on this packet with `--max-iterations=6` after W1/W2 land, then close AC-040 on a passing coverage gate.

## 7. Traceability Status

| Protocol | Level | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| `spec_code` | core | pass | Every REQ-001..REQ-034 resolved to a producer at a cited line; 41 REQ prompts executed through both gate copies with 0 disagreements (`command-attach.ts:326-560`, `skill_advisor.py:5021-5400`) | REQ-006 names a test file that does not hold the cases (ITER5-P2-001) |
| `checklist_evidence` | core | pass | 110 of 110 citations in `acceptance-criteria.md` / `tasks.md` resolve in range; 39 `Met`, 1 `Superseded`, 2 `Waived`, 1 `Unmet`; three waivers ADR-backed (`decision-record.md:33,128,223`); Verification Summary reproduces its boxes (`tasks.md:298-300`) | Stale counts and two imprecise evidence cells (ITER1-P2-001/002/003, ITER2-P2-001) |
| `skill_agent` | overlay | not run | — | Out of this run's remaining budget after the four dimensions; not claimed as covered |
| `agent_cross_runtime` | overlay | not run | — | The LEAF contract was honoured inline; no cross-runtime mirror claim is made |
| `feature_catalog_code` | overlay | not run | — | Not claimed |
| `playbook_capability` | overlay | not run | — | Not claimed |

**AC_COVERAGE:** advisory-shortfall. `acceptance-criteria.md` exists and the packet is lifecycle-active, but AC-040 (REQ-033) stays `Unmet`: this rerun's coverage gate failed on `coverage-too-young`, so the criterion's own condition — "its terminal gates read evidence, scope and coverage pass" — is not met. 42 of 43 rows are closed (`Met`/`Waived`/`Superseded`); the advisory signal does not change the verdict, which already rests on the failed gate.

## 8. Deferred Items

- **Limitation-class, not findings:** (a) the 10,000-unit head truncation makes a loop ask placed past the cut invisible to the Python fallback while the native tool rejects an over-long prompt (documented cap, REQ-030); (b) the drift guard compares word lists and two integers, not the grammar around them, so a one-sided grammar edit would pass — today the two grammars agree over 2,306 generated prompts; (c) the plural-ask gap and the performance-vocabulary gap are the two live instances of "the lists are complete on both sides and still incomplete for the language".
- **Not re-measurable inside this lineage:** the vitest and Python suites, the probe script, the corpus capture, the mirror checks and `validate.sh`. Their recorded results were read, not reproduced, and the two suite totals disagree (ITER1-P2-003).
- **`implementation-summary.md:166`** still says the drift guard compares eleven pairs where it compares twelve; covered by W2's line set.

## Dimension Expansion Map

- **Completed pivots:** 0 (`divergence.completed` is empty).
- **Failed pivots:** 0.
- **Audited overrides:** 0.
- **Saturated directions:** the reducer records none (`divergence.saturatedDirections: []`); this run's saturation is the operator-facing statement in `## 8. Deferred Items` — the traceability record drift is exhausted for this pass, the vocabulary direction is saturated at two findings, and the two-copy parity direction was ruled out by measurement.
- **Selected review directions:** traceability (`spec_code`, then `checklist_evidence`), correctness, security, maintainability — one dimension per iteration in that order, no pivot.
- **Remaining frontier:** none (`frontier` absent; the run was not expansive).
- This section records breadth only and changes no verdict, count or workstream above.

## 9. Search Ledger

- **Reducer-owned search state:** `searchCoverage` records the last iteration's required bug classes (`parity_drift`, `dead_code`, `stale_pointer`, `comment_drift`) with `parity_drift`, `dead_code` and `comment_drift` ruled out. `searchDebt` is empty; `candidateCoverage` and `cleanSearchProof` were not populated by these records.
- **Ruled-out directions across the run:** depth-word leak into the gate (measured false); TS/Python parity drift on 41 REQ prompts and 2,306 generated prompts (0 disagreements); a second typed command hiding the first (kept on gate and head); a two-cue mode leak on a deferred route (no command, as CHK-012 requires); refusal-in-later-clause cancellation (does not cancel an earlier ask); question-reading failure (two questions return false); ReDoS in either copy (worst case 17 ms on 10,000 characters); shell injection through the prompt (argument array plus stdin); prototype pollution through skill ids (`Object.hasOwn` on every table read); secrets in the changed files (none); missing evidence files or unbacked waivers (13 of 13 present, every waiver ADR-backed); dead exports (none); comments contradicting their patterns (none).
- **Sources reviewed:** 46 scoped files plus 7 context reads outside the scope list (deep-loop hub router, ROUTER, hub and mode `SKILL.md` files, both deep YAML workflows, `communication-handoff.md` §5), all named in the iteration files.

## 10. Audit Appendix

- **Convergence summary:** `convergenceScore` moved 0.00 → 0.75 → 0.40 → 0.86 → 0.87; per-iteration `newFindingsRatio` 1.0, 0.25, 0.6, 0.14, 0.13. `stopPolicy=max-iterations`, so convergence was telemetry only and the loop ran all five iterations as configured.
- **Coverage summary:** correctness 1 iteration, traceability 2 (one per core protocol), security 1, maintainability 1; all four `dimensionCoverage` flags true; `coverageAge` < 1 at the stop.
- **Terminal gates:** evidence `pass` (`all-findings-cited`), scope `pass` (`all-findings-in-scope`), coverage `fail` (`coverage-too-young`); `failedRequiredGateIds: ["coverage"]`; stop reason `maxIterationsReached`.
- **Verdict recomputation:** `review-verdict.cjs --registry-path … --state-log …` → `FAIL`, `active_p0 0`, `active_p1 1`, `active_p2 7`, `failed_required_gate_ids ["coverage"]`.
- **Iteration artifacts:** `iterations/iteration-001.md` … `iteration-005.md`, `deltas/iter-001.jsonl` … `iter-005.jsonl`, each iteration's canonical record handed to the append gateway (receipts at ledger sequence 2 to 6), the terminal-gates row at sequence 7.
- **Ruled-out claims and sources** are listed per iteration under `## Ruled Out`, and the sources under `## Files Reviewed`.
- **Continuity save not run:** this dispatch forbids `generate-context.js` and any write outside the lineage, so `phase_save` did not run and packet continuity is unchanged by this lineage; the review record is the lineage directory plus the `synthesis_complete` row in its state log.
- **Cross-reference appendix:** core protocols — `spec_code` pass (iteration 1), `checklist_evidence` pass (iteration 2). Overlay protocols — not run, not claimed.

Review verdict: FAIL
