# Iteration 004 - Maintainability

## Dispatcher

- Iteration 4 of 5, generation 3, sessionId 2026-11-23T09:35:31.105Z, lineageMode restart (config). The state log holds three iteration records, so the derived number is 4 and matches dispatch.
- Dimension: maintainability. Operator focus addressed by reading how the epic's shipped heuristics are kept in step across runtimes (the deep-loop offer gate and its curly-apostrophe fold from phase 028, the pasted-reply strip rule and its shared fixture), the residue tool and its doctor wiring, and comment hygiene over every scoped code file. Behavior claims were probed against the built native gate (`runtime/dist`) and the Python source, not taken from packet text.

## Dimension

D4 Maintainability.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:270-335, 381-410, 436-512` (offer-gate vocabulary, exception predicates, fold sites)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4466-4620` (Python copy of the gate, `_fold_quotes`, and the row-gating caller at 4608-4618)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (shared cases), `runtime/tests/command-attach.vitest.ts:23, 103-108`, `runtime/tests/python/test_skill_advisor.py` (vocabulary coverage grep)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:674, 1026-1034`, `runtime/lib/scorer/lanes/explicit.ts:10, 438-447, 487` (callers of the exported predicates)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/pasted-reply-strip-cases.json` consumers (`tests/python/test_skill_advisor.py`, `tests/legacy/advisor-prompt-policy.vitest.ts`)
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml:217-234`, `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:213-328` (doctor cleanup wiring)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` (size and structure only; the file is not in the declared scope list)
- Comment-hygiene grep over all scoped code files (launcher, hooks, handlers, lib, scorer, lanes, Python scripts, tests)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The writing-about predicate is the one exported offer-gate test that does not fold curly apostrophes, and three scorer callers read it unfolded** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:408 -- Phase 028 fixed the curly-apostrophe gap by folding inside each predicate or call site: `isStuckRunComplaint` (line 388), `isPastRunRead` (line 400), `isNoEditRequest` (line 443) and `asksForLoopRun` (line 478) each run their own `.replace` (two spellings, `[‘’]` and `[‘’]`), while `isWritingAboutTopic` (line 408) only lowercases. Its pattern's gap words are `(?:[\w'-]+ ){0,3}?`, so a curly possessive or contraction between the verb and the genre noun breaks the match. Inside `asksForLoopRun` the text is already folded, so the run offer is held correctly; but the three other callers pass unfolded lowercase text: the hub hold-back `withholdLoopHubOnWritingAbout` (`runtime/lib/scorer/fusion.ts:1031`), the explicit lane's `writingAboutLoop` (`runtime/lib/scorer/lanes/explicit.ts:444`), and the Python fallback's `is_writing_about_topic(prompt_lower)` (`runtime/scripts/skill_advisor.py:4618`, whose predicate at 4582 likewise only lowercases while Python's other predicates use `_fold_quotes` at 4559). Probed: native `isWritingAboutTopic` returns true for "write my team's blog post about how the deep review converges" and false for the same prompt with a curly apostrophe; Python agrees (True, False); `asksForLoopRun` is false for both. The parity holds and the gap is shared, as with the earlier fixed instance. Root cause is maintainability: normalization lives at each call site instead of in one helper the native side owns (Python has `_fold_quotes`, native has none), so each new or reused predicate can miss it.
   Finding class: per-call-site input normalization (residue of a class a prior fix closed only for named instances)
   Scope proof: `command-attach.ts`, `fusion.ts`, `explicit.ts` and `skill_advisor.py` are in the declared scope file list; the fold sites are phase 028's change.
   Affected surface hints: `isWritingAboutTopic` in `command-attach.ts`, `is_writing_about_topic` in `skill_advisor.py`, a shared native fold helper, a curly-apostrophe writing-about case in `deep-loop-offer-cases.json`.
   Case: "write my team’s blog post about how the deep review converges" (curly apostrophe) is not read as writing about the loop, so the deep-loop hub is not withheld from the ranking and the explicit lane applies its loop rules, unlike the straight-apostrophe spelling.

2. **The Python offer gate inlines the vocabulary lists the native gate keeps as data, and the shared fixture tests none of the multi-pass, deep loop or non-"I'd like" want-lead branches** -- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4509 -- The native gate keeps `LOOP_WORDING` (`command-attach.ts:277`) and `LOOP_NAMES` (`command-attach.ts:330`) as data lists, with the comment that the vocabulary "stays visible and cheap to correct". The Python copy spells them as regex literals (`deep research|deep review|multi-pass` at 4509, `deep loop|research loop|review loop` at 4506) and repeats the want leads (4507). Its header comment (4469-4472) names `deep-loop-offer-cases.json` as the drift detector, but a grep of that fixture, `test_skill_advisor.py` and `command-attach.vitest.ts` finds no case containing `multi-pass`, `deep loop`, `give me a`, `spin up` or `we need a`; the only want-lead case is "I’d like" (fixture line 32). The two copies agree today (probe: six prompts over those branches return true in both runtimes), so this is not drift; it is an unguarded duplication where an edit to one list passes both suites.
   Finding class: duplicated heuristic with incomplete parity fixture
   Scope proof: `skill_advisor.py`, `command-attach.ts` and `deep-loop-offer-cases.json` are in the declared scope file list.
   Affected surface hints: `deep-loop-offer-cases.json` (one case per `LOOP_WORDING` and `LOOP_NAMES` entry and per want lead), the Python `_LOOP_REQUEST_RE` construction.
   Case: removing `multi-pass` from `LOOP_WORDING` in `command-attach.ts` leaves "run a multi-pass review of the auth module" offered by the Python fallback but not by the native gate, and every existing shared case still passes in both suites.

## Traceability Checks

- spec_code (pass): the shared-fixture claim in the Python header (`skill_advisor.py:4466-4472`) holds for the 30 offer cases (iteration 1) and the strip fixture is read by both runtimes (`tests/python/test_skill_advisor.py`, `tests/legacy/advisor-prompt-policy.vitest.ts`); the doctor cleanup wiring matches the contract test (`doctor-update-contract.test.cjs:222` phase order, `:243` exit-0 rule, `:326` outcome schema against `doctor-update-apply.yaml:217-234`).
- feature_catalog_code (partial): unchanged from iteration 3 (R3-P2-003 still open); no new catalog surface checked this iteration.

## Integration Evidence

- Probes `/private/tmp/claude-501/r4/probe.mjs` and `/private/tmp/claude-501/r4/probe2.mjs` (outside the repo) load `runtime/dist/runtime/lib/command-attach.js` and import `skill_advisor.py` with `python3 -I`; both exited 0. The dist build may lag source; the source fold sites read at command-attach.ts:388-478 match the dist behavior observed.
- Doctor: `/doctor:update apply` phase_7_lane_cleanup names `sweep-lane-residue.mjs machine --json` and `apply --json ... </dev/null` (`doctor-update-apply.yaml:221-222`).

## Edge Cases

- `sweep-lane-residue.mjs` is 2384 lines with 74 top-level functions in one file. It is outside the declared scope list and is covered by `sweep-lane-residue.vitest.ts` and `lane-residue-gate.test.cjs`; size alone is not a defect, so it is recorded here and not raised.
- Comment-hygiene grep hits are generic placeholders (`specs/<packet>` at `hooks/claude/user-prompt-submit.ts:225`, `runtime/advisor-server.ts:103`, `skill-graph-db.ts:241`), not ephemeral labels. `compiled-routing-flag.ts:27` names `014-runtime-engine/lib/resolve.cjs`, a real path in another skill, and the file is outside scope.
- The dist build is the native probe surface because no TS runner is installed (iteration 1 note).

## Confirmed-Clean Surfaces

- Comment hygiene across all scoped code files: no packet, phase, finding or AC ids in comments.
- Pasted-reply strip rule: one shared fixture read by both runtimes.
- Doctor cleanup wiring: phase order, outcomes and exit handling asserted by the contract test.

## Ruled Out

- Comment hygiene violations in the epic's changed code: none.
- Doctor lane-cleanup wiring untested: ruled out by `doctor-update-contract.test.cjs:213-328`.
- Current native/Python drift on the untested vocabulary branches: none (six-prompt probe).

## Next Focus

- Dimension: cross-reference stabilization (all four dimensions covered)
- Focus area: final pass over carried P2s R1-P2-001, R2-P2-001, R3-P2-001 to R3-P2-003, R4-P2-001, R4-P2-002 for duplicates or refinement; re-run checklist_evidence and the two partial overlays (feature_catalog_code, playbook_capability); optionally execute one playbook scenario.
- Reason: last iteration; coverage gate needs every dimension and core protocol settled.
- Rotation status: 4/4 dimensions covered.
- Carry-forward: probing dist plus Python with paired prompts stays productive; grep for exported predicates and their callers found the leak.
- Required evidence: file:line per protocol result; any partial raised to pass needs a reference.

Review verdict: PASS
