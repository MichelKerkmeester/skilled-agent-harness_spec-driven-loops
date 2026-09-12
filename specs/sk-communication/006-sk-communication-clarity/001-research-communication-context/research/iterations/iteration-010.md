# Iteration 10: What a reply-scoring harness would actually measure, and which reply cases separate the adopted rules from the current baseline

## Focus

Final iteration (10 of 10), answering one dispatch question and deliberately not restating the
covered-vs-new inventory: **what would a reply-scoring harness for this repository actually
measure, and which reply cases would distinguish the adopted rules from the current baseline?**

Four dispatched tasks only: (1) read the skill's own benchmark README and say what shape a
benchmark already takes here, quoting it; (2) read the source's `evals/rubric.md` and its four
numbered release conditions, and say which this repository can observe and which it cannot,
naming the missing capability for each; (3) propose 4-6 concrete reply cases, each keyed to one
named adopted candidate from earlier iterations, where a case is the prompt plus the specific
observable that separates pass from fail; (4) name one negative-control case the adopted rules
should NOT change, and say why it is a control.

Boundary: all researched files are read-only. Writes are confined to this narrative and
`deltas/iter-010.jsonl`, plus the append gateway's own refresh of the state projection.

## Actions Taken

1. Read state: `deep-research-config.json` (maxIterations 10, `lineage.lineageMode: new`,
   `progressiveSynthesis: true`), `deep-research-state.jsonl` (9 `type:"iteration"` records), and
   `deep-research-strategy.md` (topic §2, key questions :34-43, non-goals :45-53, stop conditions
   :55-61, exhausted approaches §9, next focus §11 at :372-376, bounded context §12 at :385-390).
2. Read `iterations/iteration-009.md` for the candidate classifications carried forward (ADHD
   rules' unconditional vs reader-conditional split and its file:line anchors).
3. Verified the write boundary: `iterations/iteration-010.md` and `deltas/iter-010.jsonl` both
   absent; `research/deep-research-state.jsonl` treated as a read-only projection (gateway
   refreshes it).
4. Read `.opencode/skills/sk-communication/benchmark/README.md` in full (40 lines).
5. Read `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/evals/rubric.md`
   in full (27 lines).
6. Grepped iterations 4-7 for the 29-candidate numbering and the candidate labels, to key cases to
   named adopted candidates.

## Findings

1. **The only benchmark this repository has for `sk-communication` measures advisor routing, not
   reply text.** The benchmark README states: "This skill is benchmarked on advisor-routing
   accuracy: whether a projection-intent prompt (for example 'make CLI output readable' or
   'claudish to english, privacy-first rewrite') routes to `sk-communication` as the advisor's top
   match." The harness is the skill-advisor scorer, and the README adds that the skill's underlying
   `cli-communication-projection` package "is verified separately by its own gate (`npm run check`
   ...), not by this harness." The existing shape is therefore: unit = a prompt; outcome =
   categorical top-match (routes / does not route); corpus = "this skill's manual-testing playbook
   as its default corpus"; storage = "a dated run folder under `reports/`"; index = "One folder per
   run, indexed by `reports/README.md`". There is no graded reply rubric and no reply-text scoring
   anywhere in this folder. [SOURCE: .opencode/skills/sk-communication/benchmark/README.md:19,27,33-39]
   [SOURCE: specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/deep-research-strategy.md:388]
   (Partially new: strategy §12 had already flagged the `benchmark/` folder as the reuse candidate
   for "the place a measurement would live", but not what shape that measurement takes.)

2. **The source's rubric gives the harness its structure: five weighted dimensions, a blind judge
   protocol, and a categorical blocker flag.** Weights: Correctness 35%, Autonomy 25%,
   Actionability 20%, Safety 10%, Concision 10%; each dimension scored 1-5, judged "blind: label
   them `A`, `B`, or `C` without exposing the condition name"; `blocker: true` is reserved for "a
   dangerous instruction, material factual error, failure to follow an explicit output contract, or
   agent-autonomy regression". The release gate then applies four numbered conditions. This is a
   reply-text contract, not a routing contract, and nothing in this repository implements it.
   [SOURCE: specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/evals/rubric.md:8,10-16,18,21-26]

3. **Release condition 1 ("It has no blocking findings", rubric.md:23) is not observable in this
   repository today.** It requires a blind judge over reply text that can emit blocker flags. The
   nearest existing machinery scores routing instead (Finding 1), and the packet's own non-goals
   record that "Scoring or measuring reply quality. That is phase 005's harness, not this session's"
   — a declaration of intent, not an implementation. **Missing capability: a blind reply judge
   (the judge protocol the source defines at rubric.md:8,18) that emits categorical blocker flags.**
   [SOURCE: .opencode/skills/sk-communication/benchmark/README.md:19]
   [SOURCE: specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/deep-research-strategy.md:51]

4. **Release condition 2 ("Correctness and safety are each within 0.1 points of baseline or
   better", rubric.md:24) is not observable: no reply baseline is captured or owned.** A 0.1-point
   band needs a stored numeric baseline per dimension. The packet's carried-forward open question
   "which phase schedules the baseline capture for the reply-quality harness" was recorded in
   iteration 4, repeated in iterations 5-7, and remains "with the reducer/operator" — i.e., nobody
   owns the capture yet. **Missing capability: a captured baseline score set per dimension for a
   fixed case list.** Note the repo's own wording standard carries a "hundred-point score"
   (strategy.md:390) but its scope is documents, so it cannot serve as the reply baseline.
   [SOURCE: specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/iterations/iteration-009.md:136]
   [SOURCE: specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/deep-research-strategy.md:237-241,390]

5. **Release condition 3 ("Its weighted score is higher than baseline", rubric.md:25) is not
   observable: no weighted reply scorer exists.** It needs the 35/25/20/10/10 aggregation plus a
   trial comparison against the baseline from Finding 4. The repo's harness produces a routing match
   outcome and a dated run folder; it does not aggregate graded dimensions of reply text.
   **Missing capability: a scorer implementing the weighted dimensions of rubric.md:12-16 and
   comparing candidate vs baseline runs.** [SOURCE: .opencode/skills/sk-communication/benchmark/README.md:19,27,33-39]
   [SOURCE: specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/evals/rubric.md:12-16,25]

6. **Release condition 4 ("Any public competitor claim uses the same cases, models, trials, and
   rubric", rubric.md:26) is the one condition this repository can partly observe.** Its provenance
   container already exists in shape: the benchmark convention "writes a dated run folder under
   `reports/`", with "One folder per run, indexed by `reports/README.md`". What is missing is the
   documented per-run metadata — model, trial count, and rubric version are not named in the README's
   layout table. **Missing capability: per-run provenance fields (cases, models, trials, rubric
   version) recorded inside each run folder.** [SOURCE: .opencode/skills/sk-communication/benchmark/README.md:27,33-39]
   [SOURCE: specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/evals/rubric.md:26]

7. **Five concrete reply cases, each keyed to a named adopted candidate, with the observable that
   separates pass from fail; plus one coverage case already satisfied.** The candidates are the
   ADHD-rule classifications adopted in iteration 9 (unconditional-compatible: rules 1, 2, 4, 7, 8,
   10, and rule 3 with its floor trimmed; reader-conditional: rule 9's numeric cap). Each case also
   names the baseline gap it probes, using the repo's own line anchors.

| # | Prompt | Adopted candidate (source anchor) | Observable: pass / fail | Baseline gap it probes |
|---|--------|-----------------------------------|--------------------------|------------------------|
| C1 | "Where does the retry policy live?" (direct who-owns question) | Rule 1 — lead with the answer/action [SOURCE: context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:33-40] | Pass: the file path or symbol appears in the reply's **first sentence**. Fail: reply opens with a restatement of the question, a plan, or background | The repo's register rule shapes length by phase ("clipped while working, dense at a boundary") and names no positional observable for a direct answer [SOURCE: repo-rules/communication.md:57-60] |
| C2 | "Review X; tell me if anything is wrong" — the review genuinely finds zero defects | Rule 3, **trimmed floor only**: "name one next action when something is left open" [SOURCE: context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:57-62] | Pass: no closing next-action line when nothing is open (or one that names a genuinely open step). Fail: an invented step ("Even 'open the file' counts", :59) or a pleasantry closing | This is the declared contradiction: the floor's mandatory minimum collides with the self-check that deletes a "restated summary" and requires every sentence to carry information [SOURCE: repo-rules/communication.md:196-200] |
| C3 | "Run the tests and tell me" (agent executes the command) | Rule 7 — make completed work visible [SOURCE: context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:89-94] | Pass: the reply names the command and its exit status/result before any interpretation. Fail: "tests pass" with no command and no status | The framework's evidence standard binds claims the agent makes (observed command evidence), but it is not restated as a reply-shape observable — the case grades the reply text, not the work |
| C4 | A deliberately failing command | Rule 8 — matter-of-fact error tone [SOURCE: context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:96-101] | Pass: zero softener tokens ("unfortunately", "I apologize", "sorry") **and** a concrete next step. Fail: an apology, or a bare error with no next action | The filler bans live at document scope in the wording standard (HVR), so reply-tone tokens are unnamed in the reply rule file [SOURCE: specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/deep-research-strategy.md:237-241] |
| C5 | A task where a tempting but irrelevant tangent surfaces (e.g. a stale TODO) | Rule 4 — suppress tangents and queue them [SOURCE: context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:64-71] | Pass: zero tangent sentences inside the body; a tangent appears only in a clearly labeled deferred line, if at all. Fail: one or more "also worth noting" sentences in the body | The concision rules target what a reply says, not where a deferral is recorded; tangent *placement* is unnamed [SOURCE: repo-rules/communication.md:189-192] |
| C6 (coverage) | Any simple question whose group of equally relevant items exceeds five | Rule 9's numeric cap — "aim for no more than five items per group" [SOURCE: context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:103-107] | Pass: items grouped so no group exceeds five **and** completeness survives. Fail: either an ungrouped 8-item dump or a trimmed mandatory caveat | The repo has the counterweight but not the cap: "Not a license to omit... Cutting a required caveat to look concise is a `uncertainty-and-honesty.md` failure wearing this rule as cover" [SOURCE: repo-rules/communication.md:189-192] |

   Cases C1-C5 are the distinguishing set: each probes an observable the current stack does not name
   (position of the answer, honesty of a next action, receipts in the reply, reply tone tokens,
   tangent placement). C6 is deliberately a coverage case — the repo already forbids the failure
   mode (omission) but has no numeric cap, so C6 measures whether adding the cap changes anything at
   all.
   [SOURCE: specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/iterations/iteration-009.md:87-98]

8. **The harness must keep blocker flags categorical and dimension scores comparative; collapsing
   them makes the release gate unreadable.** rubric.md:18 defines blockers as a distinct boolean
   ("Mark `blocker: true` for...") while rubric.md:12-16 defines weighted 1-5 dimensions, and
   condition 1 (rubric.md:23) reads the boolean while conditions 2-3 (rubric.md:24-25) read the
   weighted numbers. A harness that reports only a weighted total cannot evaluate condition 1; one
   that reports only blockers cannot evaluate conditions 2-3. The repo has a matching precedent for
   categorical-vs-comparative separation in its own evidence standards (observed command evidence is
   binary; regressions are reported as deltas), so the two-part structure is compatible rather than
   novel.
   [SOURCE: specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/evals/rubric.md:12-18,23-25]
   [INFERENCE: derived from rubric.md:12-18 and :23-25 read together]

### Negative Control

**NC1 — "I didn't follow that, restate it."** The reader explicitly asks for a restatement.
Observable that must NOT move: the reply re-explains the prior content (a restatement is present,
ideally reframed), and the harness applies no filler penalty for it. Pass is the same before and
after adoption; any movement in either direction is a regression signal.

Why it is a control: this is the single input that dissolves the one declared contradiction in the
candidate set. ADHD rule 5 mandates "Restate state every turn" [SOURCE: context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:73-78]
while `repo-rules/communication.md:196-200` deletes a "restated summary" as filler. An explicit
reader request is new information, so a restatement here is informative under the self-check and
mandated under rule 5 — both sides agree, which is exactly the property a control needs. If an
adopted rule changes behavior on NC1 (refusing to restate, or restating so rote that no new framing
appears), the change is a false-positive adoption rather than an improvement, and the case will
catch it without needing a baseline score.
[SOURCE: repo-rules/communication.md:196-200]

A second control family — mandatory-caveat completeness against the numeric cap — is recommended for
phase 005 to add alongside NC1, but it is not proposed here as the named control.

## Questions Answered

- Dispatch question (this iteration): what a reply-scoring harness would measure here, the four
  conditions' observability, the case set, and the control — answered with file:line anchors above.
- Key question 4 (owning surface), advanced for the harness question only: the harness belongs
  beside the existing `benchmark/` folder (the repo's established place for a measurement), while
  the case set's pass/fail observables belong to phase 002's decision record.
  [SOURCE: specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/deep-research-strategy.md:388]

## Questions Remaining

- The five key questions stay open as recorded in `strategy.md:34-43`; this iteration answers the
  dispatch question and does not close any of them.
- Baseline-capture ownership (Finding 4) — still with the reducer/operator; this iteration names it
  as the blocking capability for conditions 2 and 3.
- Which phase owns the blind judge and the weighted scorer (conditions 1-3) — a phase-002/005
  decision, out of this session's scope by its own non-goals (strategy.md:45-53).
- Carried forward unchanged: the 001→002 handoff's missing `research.md`; C-4 republication; the
  unread comment sections in `code-style-guide.md` §4 / Webflow §5; the duplicate `CHK-CMT-01` id.
  [SOURCE: specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/iterations/iteration-009.md:136-137]

## Next Focus

No next iteration: this is iteration 10 of 10. Hand-off to the reducer and phase 002:
1. The four-condition observability table (Findings 3-6) is the calibration debt the harness must
   pay before it can gate anything: three of the four conditions are unobservable today, and each
   has a named missing capability.
2. The case set (Finding 7) is phase-002-consumable as written: five distinguishing cases plus one
   coverage case, each with a pass/fail observable and a cited baseline gap.
3. NC1 (the explicit-restatement control) ships with the case set; a change in its observable is a
   regression signal, not an adoption.
4. The two-part harness structure (Finding 8) — categorical blockers separate from weighted
   dimensions — is a design constraint, not a preference: the source's release gate reads both.

## Ruled Out (this iteration)

- Keying the cases to the merged 29-candidate numbering instead of the ADHD-rule candidates: the
  numbering's descriptive labels live in `iteration-004.md`-era tables, and the five-read budget was
  spent on the dispatch-named files. The ADHD-rule candidates were chosen because iteration 9
  already carries their adopted/rejected classification with precise file:line anchors, so every
  case's key is itself cited. [SOURCE: specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/iterations/iteration-009.md:87-98]
- Re-deriving the covered-vs-new inventory: explicitly excluded by the dispatch and saturated
  (strategy §9).
- Treating the routing benchmark as evidence about reply quality: it scores a categorical top-match
  outcome, so it cannot observe any of conditions 1-3 (Findings 1, 3-5).
- Reading `reports/` run contents to check whether provenance fields already exist there: the README
  documents the layout as one folder per run with an index, and the read budget did not extend to
  opening a run folder. This is a named remaining verification (see Reflection).

## Dead Ends

- No new dead ends worth reducer promotion. The two standing items remain the `sk-communication`
  display-only boundary and the README install/license sections (strategy §9).
- Candidate for reducer promotion to "exhausted": using the existing routing benchmark as the
  reply-quality harness's base — it measures a different unit (routing outcome vs reply text), so
  the harness must be new rather than extended.

## Edge Cases

- Ambiguous input: the dispatch says "keyed to one named adopted candidate from the earlier
  iterations" and two candidate vocabularies exist in the packet — the numbered merge set
  (candidates 1-29, `iteration-004.md` era) and the ADHD-rule classification
  (`iteration-009.md:87-98`). Selected interpretation: ADHD-rule candidates, because they carry an
  explicit adopted/reader-conditional classification with file:line anchors, which the case keys
  require. Deferred alternative: the numbered merge set, with its labels re-read from
  `iteration-004.md`.
- Contradictory evidence: one contradiction stands and is preserved on both sides — ADHD rule 5's
  prose restatement (SKILL.md:73-78) against the repo's anti-restatement self-check
  (communication.md:196-200). This iteration does not resolve it; it converts it into the control
  case NC1, where both sides agree, and records the unresolved rule-level conflict as before.
- Missing dependency: none material. The five-read budget (dispatch limit) was fully spent; the
  29-candidate table was reached by grep only, which is why the numbered set was deferred.
- Partial success: none. All dispatched tasks were completed; every claim about this repository
  carries a file:line anchor, with carried anchors labeled as carried from iteration 9 where the
  underlying file was not re-read this iteration.
- Observation for the reducer: `deep-research-config.json` sets `progressiveSynthesis: true` while
  the dispatch's allow-list for this iteration names only the iteration narrative and the delta
  file, and `research/research.md` still does not exist (the iteration-3 discrepancy, carried ever
  since). This iteration respected the stricter dispatch allow-list and did not create
  `research/research.md`; the config-vs-strategy-vs-dispatch discrepancy stays open for the reducer.
  [SOURCE: specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/deep-research-config.json:1]
  [SOURCE: specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/deep-research-strategy.md:402]

## Sources Consulted

- `.opencode/skills/sk-communication/benchmark/README.md:1-40` (full file, read this iteration)
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/evals/rubric.md:1-27` (full file, read this iteration)
- `specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/deep-research-config.json`
- `specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/deep-research-state.jsonl`
- `specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/deep-research-strategy.md:34-43,45-53,237-241,372-376,385-390,402`
- `specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/iterations/iteration-009.md:36-43,87-98,136-137`
- `specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/iterations/iteration-004.md` (via grep: candidate-numbering context)
- `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:33-117` (line anchors carried from iteration-009.md:87-98)
- `repo-rules/communication.md:57-60,189-192,196-200` and `REPO RULES.md:80-83` (line anchors carried from iteration-009.md:36-43,62-68,82-85,94-98)

## Assessment

- New information ratio: 0.94
- Questions addressed: the dispatch harness question (all four tasks); key question 4, harness-scoped
- Questions answered: the dispatch question; no tracked key question closed

## Reflection

- What worked and why: reading the two named files before designing anything. The benchmark README
  answered the "where does a measurement live" half in one read (dated run folders beside the skill)
  and the rubric answered the "what would be graded" half in one read (five weighted dimensions plus
  a blocker boolean). The two documents disagreed in exactly the useful way — one measures routing,
  the other specifies a reply rubric — which localized the missing capabilities without guesswork.
- What did not work and why: the grep for candidate labels confirmed the numbered merge set exists
  but returned only fragments, not descriptive names, because the labels live in table rows that the
  grep pattern did not capture. The read budget was already spent on the dispatch-named files, so
  the numbered set became a documented deferral rather than a failed search.
- What I would do differently: budget one read for the candidate-label table before committing to a
  case-key vocabulary, and check a `reports/` run folder's contents to verify whether provenance
  fields already exist there — that single read decides whether release condition 4 is observable
  today or needs the field set named in Finding 6.

## Recommended Next Focus

Consolidation only — the run ends here. Route Findings 3-6 (observability) and Finding 7 (case set
plus NC1) into phase 002's decision record, and let the reducer promote the "routing benchmark as
reply-harness base" direction to exhausted. The one unverified detail left open is whether a
`reports/` run folder already carries model/trial/rubric provenance, which is the single check that
could move release condition 4 from "partly observable" to "observable".
