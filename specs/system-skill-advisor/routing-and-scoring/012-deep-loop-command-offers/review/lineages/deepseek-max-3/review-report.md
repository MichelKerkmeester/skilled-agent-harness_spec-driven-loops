# Deep Review Report — 012 deep loop command offers (lineage deepseek-max-3)

## 1. Executive Summary

- **Overall verdict:** CONDITIONAL
- **hasAdvisories:** false (the verdict is CONDITIONAL; the four P2s are listed but do not set the advisory flag)
- **Counts the verdict used:** P0 = 0, P1 = 1, P2 = 4, read from the lineage registry by `review-verdict.cjs` (active P0 0, active P1 1, active P2 4, search debt 0, failed required gate ids none)
- **Self-check outcomes:** no active P0 existed, so no full Hunter/Skeptic/Referee replay was required. The one P1 (finding 1) received a compact skeptic/referee pass in iteration 1 and its claim packet is recorded there. The adversarial self-check at synthesis made no calls: no P0/P1 was downgraded or called a false positive.
- **Review scope:** 72 seeded files: the packet docs (`spec.md`, `acceptance-criteria.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, `plan.md`, `timeline.md`), the advisor gate and its Python fallback, the scorer lanes, the renderer and subprocess layer, the degraded CLI and hook fallback, the shared fixture and its suites, the deep command documents and workflow YAMLs, the hub router, and the deep-loop reducer.
- **Operator review focus (verbatim):** Traceability is the lead focus: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md (REQ-001 to REQ-053) against the code that implements it or the decision that records it (ADR-001 to ADR-009), and every ticked task in tasks.md and every Met row in acceptance-criteria.md (AC-001 to AC-061) against evidence that really exists in the tree, including the twelfth fix round (T112 to T114). Cover all four configured dimensions, because the coverage gate needs each one recorded before the last iteration. Give correctness, security and maintainability one iteration each within iterations 1 to 4, and spend the rest on traceability. Record every finding's file as its full repo-relative path, such as specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md, never a bare file name. The scope gate matches full paths only. Do not write a terminal_gates row yourself. The orchestrator computes it with terminal-gates.cjs after the run.
- **Iterations:** 7 of 7 (stopPolicy = max-iterations, stop reason `maxIterationsReached`). Dimensions covered: correctness (iteration 1), security (2), maintainability (3), traceability (4 to 7).
- **Stop reason:** the configured cap was reached. Convergence was read as telemetry only, as the dispatch directed.

## 2. Planning Trigger

`/speckit:plan` is required: one active P1 remains (the how-to question defect in both gate copies) and it should be fixed before the next review rerun.

```json
{
  "title": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "1", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1238", "title": "A digit iteration count in an unrelated trailing clause turns a how-to question into a run ask"},
    {"id": "2", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:828", "title": "The past-run outranking reads only punctuation as a clause break, so a run ask introduced by then is swallowed"},
    {"id": "3", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:691", "title": "The drift guard's coverage test only recognizes Python pattern names ending in _RE and never checks an excused name exists"},
    {"id": "4", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1", "title": "Both suites read the same fixture rows, so a misreading shared by the two copies passes the parity test"},
    {"id": "5", "severity": "P2", "dimension": "traceability", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:68", "title": "AC-011's verification cell describes an unresolved reference the reference check no longer reports"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "title": "Scope the digit iteration count to the question's own clause, in both gate copies", "findings": ["1"]},
    {"id": "WS-2", "title": "Treat a bare then/and/but clause opener as a clause break in explicitRunOutranks, in both copies", "findings": ["2"]},
    {"id": "WS-3", "title": "Widen the drift-guard coverage test to every compiled gate name and resolve each excused name", "findings": ["3"]},
    {"id": "WS-4", "title": "Keep a differential sweep or add the count-plus-question rows so a shared misreading fails a test", "findings": ["4"]},
    {"id": "WS-5", "title": "Drop the stale unresolved-reference clause from AC-011", "findings": ["5"]}
  ],
  "specSeed": [
    "REQ-036: say that a digit iteration count in a trailing statement does not turn a how-do question into a request",
    "REQ-051: say that the coverage test accounts for every compiled gate name, not only names ending in _RE",
    "T039: say which clause openers count (punctuation plus then/and/but) or narrow the task to punctuation",
    "AC-011: correct the reference-check description to the clean pass the tree now reports"
  ],
  "planSeed": [
    "Scope ITERATION_COUNT / _LOOP_DIGIT_COUNT_RE to the question clause in command-attach.ts and skill_advisor.py, with a shared fixture row for the trailing-count form",
    "Extend the clause-mark search in explicitRunOutranks / _explicit_run_outranks to the conjunction openers, with fixture rows",
    "Change the coverage regex to every `_X = re.compile(` name and assert each PATTERNS_NOT_COMPARED name exists",
    "Add a checked differential-sweep artifact, or fixture rows for the question-plus-count interaction",
    "Correct AC-011's verification text"
  ],
  "findingClasses": ["class-of-bug", "instance-only", "matrix/evidence"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py",
    ".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts",
    ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | file:line | Title |
|----|-----|-----------|-----------|-------|
| 1 | P1 | correctness | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1238` | A digit iteration count in an unrelated trailing clause turns a how-to question into a run ask |
| 2 | P2 | correctness | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:828` | The past-run outranking reads only punctuation as a clause break, so a run ask introduced by "then" is swallowed |
| 3 | P2 | maintainability | `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:691` | The drift guard's coverage test only recognizes Python pattern names ending in `_RE` and never checks an excused name exists |
| 4 | P2 | maintainability | `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` | Both suites read the same fixture rows, so a misreading shared by the two copies passes the parity test |
| 5 | P2 | traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:68` | AC-011's verification cell describes an unresolved reference the reference check no longer reports |

**1.** Evidence: `isLoopQuestion` tests `ITERATION_COUNT` over the whole prompt before it reads the question grammar (`command-attach.ts:1238`, `:1247`; the Python copy is `skill_advisor.py:5063`, `:5305-5317`). Observed through the fallback: `how do I run a deep review on this?` returns `False`, while `how do I run a deep review on this? it took 5 iterations last time` returns `True`. Impact: the advisor offers a long, multi-pass run for a question that `REQ-036` says carries no command. Fix: scope the count test to the question's own clause; keep the existing "how do I run a deep review? then run a deep review on the parser" control. `findingClass`: class-of-bug. `scopeProof`: exactly two readers, both fixed by the same change; the fixture pins the question without the trailing count but no row pins the combined form. `affectedSurfaceHints`: ["command-attach.ts isLoopQuestion", "skill_advisor.py _is_loop_question", "shared fixture how-do rows", "command-attach-guards.vitest.ts"].

**2.** Evidence: `explicitRunOutranks` searches `[,.;!?\n]` for the clause mark (`command-attach.ts:828`; `skill_advisor.py:5279`). Observed: `read the deep review report then run a deep review on the parser` returns `False`, while the same prompt with a comma before `then` returns `True` and is a fixture row (`summary-then-another-review`). Impact: a prompt that asks to read a past report and then run a fresh review loses the offer. Fix: add the conjunction openers to the clause-mark read, or narrow the task wording. `findingClass`: instance-only. `scopeProof`: only the two implementations read a clause mark; no fixture row covers the punctuation-less form. `affectedSurfaceHints`: ["command-attach.ts explicitRunOutranks", "skill_advisor.py _explicit_run_outranks", "past-run fixture rows"].

**3.** Evidence: `compiled` is collected with `^(_[A-Z0-9_]+_RE) = re\.compile\(` (`deep-loop-offer-cases.vitest.ts:691`), and the `PATTERNS_NOT_COMPARED` rows are only asserted to carry a non-empty reason (`:675`). All 43 gate names end in `_RE` today, so the gap is latent; 14 excused names without `_RE` (`_MODE_CUE_PATTERNS` at `:596`, `_LOOP_MULTI_PASS` at `:597`, `_CMD_DECLINE_LEADS` at `:606`) are never resolved. Impact: `REQ-051`'s promise ("a new Python gate pattern that is neither compared nor listed fails a test") does not hold for a name outside the convention. Fix: match every compiled name and assert each excused name exists. `findingClass`: class-of-bug. `scopeProof`: one coverage test; today's tree passes, so the finding is about the guard's coverage, not a current failure. `affectedSurfaceHints`: ["deep-loop-offer-cases.vitest.ts coverage test", "PATTERNS_NOT_COMPARED table", "skill_advisor.py gate compile names"].

**4.** Evidence: both suites drive `asksForLoopRun` from the same 359 rows (`deep-loop-offer-cases.vitest.ts:111`; `test_skill_advisor.py:2854`). Finding 1 is the working example: both copies agree on a prompt no row pins, so the parity test is green while both are wrong. The differential sweeps the tasks cite (227 prompts, 3,729 grammar prompts) are recorded as prose and no script reproduces them. Impact: a shared misreading survives the guard. Fix: keep a sweep as a checked artifact, or add interaction rows. `findingClass`: matrix/evidence. `scopeProof`: the two suites are the only fixture readers. `affectedSurfaceHints`: ["shared fixture", "python parity test", "vitest fixture reader", "scratch probe sweeps"].

**5.** Evidence: AC-011's cell says the reference check "reports one unresolved reference, the pre-existing `speckit-resume.yaml` path" (`acceptance-criteria.md:68`), while the command it names prints `OK  command references resolve across 84 asset file(s)` and exits 0, and the evidence row it points at has said so all along (`implementation-summary.md:157`). Impact: the row's evidence no longer reproduces the sentence beside it. Fix: drop the parenthetical. `findingClass`: instance-only. `scopeProof`: one acceptance cell; no other doc repeats the claim. `affectedSurfaceHints`: ["acceptance-criteria.md AC-011", "implementation-summary.md Closure pass: advisor suite"].

## 4. Remediation Workstreams

- **P0:** none.
- **P1:** WS-1 (finding 1) — scope the digit count to the question clause in both gate copies, with a shared fixture row for the trailing-count form.
- **P2 advisories:** WS-2 (finding 2), WS-3 (finding 3), WS-4 (finding 4), WS-5 (finding 5), in that order.

## 5. Spec Seed

- `REQ-036`: add that a digit iteration count in a separate statement about a past run does not turn a how-do question into a request.
- `REQ-051`: restate the coverage promise in terms of every compiled gate pattern, naming the `_RE` convention if it stays.
- `T039`: name the clause openers that count, or narrow the task to punctuation and record the choice.
- `AC-011`: correct the reference-check description to the clean pass the tree reports.
- `AC-040`: keep `Unmet` until the orchestrator's `terminal-gates.cjs` reads this run's gates; the rerun itself is this lineage.

## 6. Plan Seed

1. Extract the count test in `isLoopQuestion`/`_is_loop_question` to the question's clause, then add a fixture row for `how do I run a deep review on this? it took 5 iterations last time` with `asksForLoopRun: false`.
2. Add `then|and|but|so` as clause openers in `explicitRunOutranks`/`_explicit_run_outranks`, with a fixture row for the punctuation-less form and the existing comma row as the control.
3. Change the coverage regex in `deep-loop-offer-cases.vitest.ts` to every `_X = re.compile(` name, and assert every `PATTERNS_NOT_COMPARED` name exists in the gate source.
4. Add the interaction rows to the shared fixture, or restore the generated-prompt sweep as a checked artifact under `scratch/`.
5. Edit AC-011's verification cell; rerun `evidence-tails.py` and `validate.sh --strict`.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| `spec_code` | pass | `REQ-001` to `REQ-019` (iteration 4): probes, offer docs, mirror/reference gates, aliases, near-miss/holdout rows, every stated prompt. `REQ-020` to `REQ-039` (5): typed parity, refusals, double-typed, mode cues, stage-one, degraded paths, long-prompt bound, drift guard, reducer rules, closure docs, corpus. `REQ-040` to `REQ-053` (6): no-edit, refused cue, routed mode, pronoun rerun, effort manner, mode-free, whitespace, negation, pattern guard, numbering, next-focus, doctor constant. | The `REQ-036` interaction (finding 1) and the `T039` clause reading (finding 2) |
| `checklist_evidence` | pass | `AC-001` to `AC-029` (4), `AC-030` to `AC-043` (5), `AC-044` to `AC-061` (6): every `Evidence: path:N (anchor)` tail resolves (`problems=0`), every fixture count matches, every named test title exists, `T084` is the only open task and `AC-040` the only open criterion. | `AC-011`'s description (finding 5) |

### Overlay Protocols

| Protocol | Status | Notes |
|----------|--------|-------|
| `skill_agent` | notApplicable | No agent definition is part of this packet's change set |
| `agent_cross_runtime` | notApplicable | No runtime mirror is a change target; the mirror check is read as `REQ-007` evidence |
| `feature_catalog_code` | notApplicable | No feature-catalog entry is in scope |
| `playbook_capability` | notApplicable | No playbook is in scope |

### AC Coverage

`AC_COVERAGE`: advisory-shortfall. The packet holds 61 rows: 56 `Met`, 3 `Waived` (AC-008, AC-017, AC-020 with ADR-003, ADR-002, ADR-009), 1 `Superseded` (AC-019 with ADR-001) and 1 `Unmet` (AC-040, the rerun this lineage supplies). The validation rule that emits the signal is advisory, so it does not change the verdict.

## 8. Deferred Items

- The four P2 findings are advisory follow-ups for the next packet; none changes the verdict.
- Two packet rows that are open by record remain open: `T084` (the rerun task) and `AC-040` (the rerun criterion). This lineage is the rerun; their status is the orchestrator's to compute after `terminal-gates.cjs`.
- The native `dist/` rebuild was not performed by this read-only review; the kept probe artifact records `freshness: live` instead.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none; this was a default-depth run, so no expansion frontier was seeded.
- Selected review directions: the gate's word rules (correctness), the prompt and child-process boundary (security), the drift guard and fixture oracle (maintainability), and the REQ/AC/ADR trace (traceability).
- Remaining frontier: none recorded.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).* This lineage recorded v1 iteration records, so `searchCoverage`, `candidateCoverage`, `searchDebt` and `cleanSearchProof` are absent; the search work is recorded in the iteration narratives and the `ruled_out` rows of each delta. No search debt is open.

## 10. Audit Appendix

### Convergence Summary

- Iterations: 7 of 7; stop reason `maxIterationsReached`; verdict CONDITIONAL; release readiness `in-progress`.
- New-finding ratios: iteration 1 = 1.0 (two new findings), 2 = 0.0, 3 = 1.0 (two new findings), 4 = 1.0 (one new), 5 = 0.0, 6 = 0.0, 7 = 0.0.
- Registry: 5 open findings (0 P0, 1 P1, 4 P2) and 0 resolved.

### Coverage Summary

- Dimensions: correctness, security, traceability, maintainability — all recorded.
- Files reviewed across the run: the packet docs, `command-attach.ts`, `skill_advisor.py`, `render.ts`, `subprocess.ts`, `prompt-policy.ts`, `fusion.ts`, `explicit.ts`, `advisor-recommend.ts`, `skill-advisor-cli.ts`, the hook fallback, the schemas, the fixture and its five suites, the reducer and its unit tests, the presentation files, the command documents, both deep YAMLs, `hub-router.json`, `ROUTER.md` and the hub `SKILL.md`.

### Ruled-out Claims

- No TypeScript/Python pattern divergence in the bounded-window search (all 359 fixture rows agree).
- No command injection or secret exposure on the offer path (stdin, argv arrays, no shell).
- No probe-artifact/cell mismatch (69 rows, four groups, zero changed keep or negative rows).
- No closure-count drift outside `AC-011` (summary, tails, boxes and ADRs agree).
- No second `DEEP_LOOP_DOCTOR_COMMAND` declaration.

### Sources Reviewed

`spec.md`, `acceptance-criteria.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, `timeline.md`; `scratch/probes/results-after.json`, `results-spec-baseline.json`, `fresh-review-hook.txt`, `ac034-served-head.jsonl`; `scratch/citations/evidence-tails.py`; `command-attach.ts`, `skill_advisor.py`, `render.ts`, `subprocess.ts`, `prompt-policy.ts`, `scorer/fusion.ts`, `scorer/lanes/explicit.ts`, `handlers/advisor-recommend.ts`, `skill-advisor-cli.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`, `schemas/advisor-tool-schemas.ts`; the shared fixture and `deep-loop-offer-cases.vitest.ts`, `command-attach-guards.vitest.ts`, `typed-on-stuck-serving.vitest.ts`, `command-brief-golden.vitest.ts`, `subprocess-typed-fields.vitest.ts`, `cli-degraded-command-contract.vitest.ts`, `test_skill_advisor.py`; `reduce-state.cjs`, `deep-review-strategy-numbering.vitest.ts`, `next-focus-iteration-verdict.vitest.ts`; the deep presentation files, `research.md`, `review.md`, `deep-research.yaml`, `deep-review.yaml`, `hub-router.json`, `ROUTER.md`, `SKILL.md`; `command-prompts.jsonl`, `command-routing-baseline.json`, `.skilled/changelog/skilled/v4.2.0.0.md`, `013-deep-loop-offer-in-hint/implementation-summary.md`.

### Cross-reference Appendix

#### Core Protocols

- `spec_code`: pass; evidence list in §7.
- `checklist_evidence`: pass; evidence list in §7.

#### Overlay Protocols

- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: notApplicable, reason in §7.
