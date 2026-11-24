# Review Iteration 005 — deepseek-max-1

**Dimension:** maintainability (D4)
**Protocol:** code read + doc comparison
**Focus:** whether the two gate copies and the four mode-vocabulary surfaces can drift without a test noticing, and whether the comments state the durable reason rather than a ticket label.

## Dispatcher

- Run: `fanout-deepseek-max-1-1795518961022-7ms9ak`, generation 1, label `deepseek-max-1`.
- Execution: this process; no nested dispatch ran.
- Config: `maxIterations=7`, `stopPolicy=max-iterations`.
- Steering channel: `steer.md` is absent at iteration 5.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330-470,480-620,993-1060,1465-1510`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4480-4680,4940-5010,5100-5180`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:60-100,240-320`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1-6`
- `.skilled/skills/system-deep-loop/hub-router.json:30-45`
- `.skilled/skills/system-deep-loop/ROUTER.md:38-66`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:300-330`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:440-470`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The drift guard compares vocabulary, not the grammar that carries the exceptions** -- `deep-loop-offer-cases.vitest.ts:68` -- `VOCABULARY_PAIRS` compares fifteen exported string arrays and `NUMERIC_PAIRS` two numbers. The patterns those lists feed are hand-ported and uncompared: `refusalLeadSource` (`command-attach.ts:605`) adds a `skip … to` exception and a `refuse(d)( to)` suffix that Python re-implements at `skill_advisor.py:4975`, and the negation lookbehinds, the `spinning up` exclusion and the windowed `endsBefore` scan have separate native and Python sources. A one-sided edit to any of those passes the guard, which is the failure mode the guard exists to catch.
   Case: a maintainer tightens the `skip` exception in TypeScript only, so "skip to the deep review" asks in one copy and withholds in the other, and every test still passes because no pair compares the generated pattern.
   Finding class: `drift-risk` (no current behavior difference; the risk is a future silent divergence).
   Scope proof: `command-attach.ts`, `skill_advisor.py` and the guard file are `reviewScopeFiles` entries; the pairs list and both grammar helpers were read at the cited lines.
   Affected surface hints: `deep-loop-offer-cases.vitest.ts:68,90,303,313`, `command-attach.ts:605`, `skill_advisor.py:4975`.

2. **Four surfaces each carry their own mode vocabulary, and nothing checks that they agree** -- `command-attach.ts:450` -- The loop names live in `LOOP_NAMES` (`:450`), the mode cues in `MODE_CUES` (`:494`, with `DEFECT_CHECK` at `:492`), the explicit-mode pattern in `NAMED_LOOP_MODE` (`:1502`), and the hub's routing keywords in `hub-router.json:34,37` / `ROUTER.md:63-64`. Only the first is compared with Python; the other three are independent. The two P1-class defects already found are symptoms of this: the plural `deep loops`/`research loops` exist in `LOOP_NAMES` but not in the hub keywords, and the cue read ignores refusals that the ask read honours.
   Case: a maintainer adds a mode word to one of the four surfaces (a new loop alias in the hub, a new cue in `MODE_CUES`) and the gate, the deferred cue and the router disagree on the same prompt, with no test naming the disagreement.
   Finding class: `single-source-of-truth` (structural risk; the concrete behavior gaps are reported in iterations 1 and 3 and are not re-counted here).
   Scope proof: all four files are `reviewScopeFiles` entries; the lists and patterns were read at the cited lines.
   Affected surface hints: `command-attach.ts:450,492,494,1502`, `hub-router.json:34,37`, `ROUTER.md:63-64`.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial (carried) | Iterations 1 and 3 findings stand. |
| `checklist_evidence` | pass (carried) | Iteration 2 result stands. |

What this iteration actually ran:

1. **Comment-hygiene sweep over every changed code file.** `rg -n "ADR-[0-9]|REQ-[0-9]|CHK-[0-9]|T0[0-9][0-9]|specs/"` over `command-attach.ts`, `skill_advisor.py`, `skill-advisor-cli.ts`, `subprocess.ts`, `explicit.ts`, `fusion.ts`, `reduce-state.cjs` and the shared fixture printed no match. The comments state the durable reason ("A refused loop phrase …", "A route can pick the mode because the prompt named its command …"), not a ticket or spec path.
2. **The drift guard's coverage read against its own purpose.** The guard compares fifteen vocabulary pairs and two numbers, and its header comment says a word added to one copy alone must fail the suite. The grammar helpers beside those lists are outside that comparison.
3. **Mode-vocabulary inventory.** `LOOP_NAMES` (6 entries, both numbers), `MODE_CUES` (2 entries + `DEFECT_CHECK`), `NAMED_LOOP_MODE` (a three-alternative pattern), and the hub keyword lists (research at `hub-router.json:34`, review at `:37`). The plural forms appear only in `LOOP_NAMES`; the hub carries singular `research loop` and `review loop` and no `deep loop` keyword.
4. **Doc comparison.** REQ-031's list of ten pinned and five unpinned lists matches the guard's case lines; `implementation-summary.md:258-260` names the same limitations the code still has.

## Integration Evidence

- Drift guard: `deep-loop-offer-cases.vitest.ts` pairs and per-entry cases.
- Grammar helpers: `command-attach.ts:605` and `skill_advisor.py:4975`.
- Mode vocabulary: `command-attach.ts:450,492,494,1502`; `hub-router.json:34,37`; `ROUTER.md:63-64`.
- Hook/comment hygiene: `rg` over the changed code files (no ticket ids, no spec paths).

## Edge Cases

- **A drift risk is not a defect.** Both P2s are future-maintenance risks; neither changes current behavior, and neither should be counted as a closure blocker.
- **The hub keyword lists are data, not code.** Adding plurals there would widen routing for every prompt, so the fix needs the out-of-domain replay ADR-002 describes rather than a mechanical edit.

## Confirmed-Clean Surfaces

- No comment in the changed code embeds an ADR/REQ/CHK/task id or a spec path; the comments give the durable reason.
- All fifteen compared lists exist as exported arrays with named Python tuples, and each has the case the guard requires.
- REQ-031's "five lists cannot be pinned one row at a time" reasons match the code: `MODE_SUFFIXES` only appears on typed commands, the lead-word lists lead a typed command, the auxiliaries fill one grammar slot, and the refusal leads are alternatives of one pattern.

## Ruled Out

- **Comment-hygiene violations in the changed code.** Ruled out: the sweep printed no match across all changed files.
- **The guard silently compares empty lists.** Ruled out: it reads the Python tuples out of the source and fails on a renamed list, as AC-038 records.
- **A missing per-entry case for the ten pinned lists.** Ruled out: the case lines exist at `:247` to `:293`.

## Next Focus

- **Dimension:** correctness (follow-up)
- **Focus area:** the typed-doctor gap recorded in iteration 4, plus a re-verification that the three P1 findings still reproduce after re-reading their code paths.
- **Reason:** the coverage gate needs every dimension covered, and correctness deserves a second pass that includes the trust-boundary find.
- **Rotation status:** maintainability complete; correctness follow-up next.
- **Required evidence:** the prompt measurements and the code paths, re-read.

## Assessment

Dimensions addressed: maintainability

The code is maintainable in the small (clear comments, named constants, bounded windows) and fragile in the large (four mode vocabularies, grammar outside the guard). Both are P2 risks, not defects. No P0 or P1 this iteration; the earlier P1s remain active.

Review verdict: CONDITIONAL
