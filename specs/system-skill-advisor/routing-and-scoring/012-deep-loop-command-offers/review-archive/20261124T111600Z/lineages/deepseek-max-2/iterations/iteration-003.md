# Review Iteration 003 — deepseek-max-2

**Dimension:** correctness (D1)
**Focus:** the gate's decision path on inflected and adversarial inputs the prompt-text contract allows — plural loop names, performance complaints about the loop, later-clause refusals, two-mode requests, and the typed-command path against the doctor branch.

## Dispatcher

- Run: `fanout-deepseek-max-2-1795514074741-gl47kr`, generation 1, lineage mode `new`.
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2`.
- Prior findings carried: P2 × 4 (record accuracy). Verdict before this iteration: PASS.
- `steer.md` absent.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:326-470,505-560,675-700,840-900,936-1120,1300-1423`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4800-4990,5306-5400,5459`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` (`attachTypedCommand` path, read through the built head)
- `.skilled/commands/deep/assets/deep-review-presentation.txt:16-34` (the stated ask vocabulary the gate must implement)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:40-56` (D2's ask definition, ADR-006's bare-name rule)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:250-252` (limitations 6 to 8, the recorded word-rule misses)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Plural loop names are never read as loop asks, in either copy** -- `command-attach.ts:441` -- `LOOP_NAMES` lists only the singular `deep loop`, `research loop` and `review loop`, `LOOP_WORDING` lists `deep research` / `deep review` as whole phrases with a trailing word boundary, and `LOOP_COUNT` covers only `iterations`, `passes` and `rounds` after a count. A plural loop noun therefore matches nothing: "run two research loops", "run 2 deep reviews of the parser", "do deep reviews of the parser" and "run a couple of deep reviews" all return `asksForLoopRun: false` and produce no attached command, while the singular "run a review loop", "do a deep research" and "run 5 review loop iterations" return `true`.
   Case: a reader types "run two research loops on the cache and pick the better one". The advisor offers no `/deep:research`, so option A of the offer never appears and the reader gets a single-pass answer for a request that asked for two loops — the failure `spec.md:34` describes as the packet's reason to exist ("a request that asks for the loop in plain words gets no command row"). The plural is an ordinary inflection, and the codebase's own lists enumerate plurals elsewhere (`config`/`configs`, `prompt`/`prompts`, `hang`/`hangs`), so the omission is not a documented exclusion.
   ```
   {"type":"claim","claim":"A plural loop name behind a use verb is not a loop ask in either gate copy","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:441",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5021"],"counterevidenceSought":"searched LOOP_WORDING, LOOP_NAMES, LOOP_COUNT, MULTI_PASS and PASS_NOUN for a plural noun path; executed the built gate and skill_advisor.asks_for_loop_run on 13 plural and singular prompts","alternativeExplanation":"the plural could be reachable through LOOP_COUNT or PASS_NOUN if those counted loops rather than passes, rounds or iterations; measured false in both copies rules that out","finalSeverity":"P1","confidence":0.86,"downgradeTrigger":"if the operator's vocabulary decision treats plural loop nouns as outside the ask set (a D6-style record-not-guard call), this drops to P2 and becomes a limitation row"}
   ```
   Finding class: `class-of-bug` (one vocabulary gap that repeats for every loop noun).
   Scope proof: both producers are in `reviewScopeFiles`; the result is measured by executing the built gate at `dist/runtime/lib/command-attach.js` and `skill_advisor.asks_for_loop_run`, not inferred from reading the patterns.
   Affected surface hints: `LOOP_NAMES` / `LOOP_WORDING` / `LOOP_COUNT` in both copies; the fixture has no plural-ask case, so the drift guard cannot catch the omission; `deep-review-presentation.txt:16-17` states the ask as "names a deep loop, deep review or a review loop", which a reader reads as covering the plural.

### P2 Findings

1. **Complaints about the loop's speed or cost are read as run asks** -- `command-attach.ts:842` -- the subject test recognises an edit verb from `LOOP_EDIT_LEAD` (`refactor`, `fix`, `edit`, `modify`, `rewrite`, `debug`, `patch`, `rename`, `tweak`, `tune`, `clean up`) and artifact nouns from `LOOP_ARTIFACT_NOUNS`, but no performance or effort vocabulary. So "make the deep review faster", "speed up the deep research loop", "improve the deep review", "the deep review takes too long" and "the last 3 iterations of the deep review were slow" all return `asksForLoopRun: true` in both copies, while "tune the deep research loop" returns `false` only because `tune` is in the edit list.
   Case: a reader says "make the deep review faster". The advisor attaches `/deep:review` and the AI asks the offer question, so a request to change the loop's speed is answered with an offer to run it — the same false-offer class as limitation 7's "multi-pass compiler design review". D2 (`spec.md:43`) says a bare loop name counts as an ask only behind a use, continue or want verb; "make" is none of those.
   Finding class: `instance-only` (a vocabulary family with no list to extend yet).
   Scope proof: the gate and `spec.md` are in `reviewScopeFiles`; the five prompts were executed against both copies with the results above.
   Affected surface hints: `LOOP_EDIT_LEAD` and `LOOP_ARTIFACT_NOUNS` in `command-attach.ts`; their Python mirrors; limitation 7 in `implementation-summary.md:251` already records the sibling miss; the corpus has no row for this family, so `false_offer` stays 0 without seeing it.

## Traceability Checks

None run this iteration: both core protocols completed in iterations 1 and 2, and this iteration's dimension is correctness. The results array is empty rather than padded with a `pending` row.

## Integration Evidence

- The measurement surface is the built gate (`dist/runtime/lib/command-attach.js`, rebuilt from `lib/command-attach.ts`) and `scripts/skill_advisor.py`; both are in `reviewScopeFiles`, and the two agree on every prompt below, so no finding rests on a single-copy artefact.
- `attachCommand` on a single review route was exercised for the same prompts to confirm the ask result reaches a command decision rather than stopping at the predicate.

## Edge Cases

- **Plural finding vs. operator decision D6.** D6 rules out new guards for six single-probe misses. This finding is a vocabulary class rather than a single probe, so it is reported as a defect with a downgrade trigger instead of being recorded as a limitation; if the operator reads it as a single-phrasing call, the P2 branch applies.
- **"run 2 deep review passes" and "run 5 review loop iterations" ask, "run two research loops" does not.** The asymmetry is the finding: passes and iterations are counted by `LOOP_COUNT`, loop nouns are not, so the same request succeeds or fails on the noun the reader picked.
- **Two-mode requests behave as designed.** "run a deep review and then a deep research pass" reads as an ask and the deferred route refuses to pick a mode (two cues), which CHK-012 requires; not a finding.
- **Later-clause refusals behave as designed.** "run a deep review, don't run the doctor" and "don't run the doctor, run a deep review" both ask, and "do a deep review of the parser, but do not fix the tests" asks: a refusal of a different action does not cancel an earlier ask.
- **"no, run a deep review" and "why not run a deep review"** both ask, matching the recorded intent that these two propose the command rather than refuse it.
- **Questions.** "what does deep review mean" and "how does the deep review pick dimensions" return false, so the question reading holds.

## Confirmed-Clean Surfaces

- `asksForLoopRun` on a refusal lead, a later-clause refusal, a question, a past-run read and a subject phrase: "review the code iteratively, not a deep review" still asks (correct: the ask is the first clause), "review the parser in three passes" asks, "the last 3 iterations of the deep review were slow" is covered by P2-001 above.
- `isStuckRunComplaint`: unchanged from iteration 1's 41-prompt comparison; 0 disagreements between copies.
- The typed path: "run /deep:review on the parser, then /create:changelog" and "/deep:review the parser and then /doctor:deep-loop" keep `/deep:review` at the gate and the served head; the typed-stuck prompt returns `/doctor:deep-loop` at the gate and the typed command on the head (ADR-005).

## Ruled Out

- **A parity drift on the new prompts**: both copies agree on all 24 prompts measured this iteration; the findings are vocabulary gaps present in both, not divergence.
- **A two-cue mode leak**: a prompt with both mode cues gets no command on a deferred route, as CHK-012 requires.
- **A refusal-in-later-clause bug**: a refusal of a different action leaves an earlier ask standing, in both copies.
- **A question-reading bug**: "what does deep review mean" / "how does the deep review pick dimensions" both return false.
- **A typed-list ordering bug**: `typedCommandsIn` order does not hide a shorter typed command; measured in iteration 1 as well.

## Next Focus

- **Dimension:** security (D2)
- **Focus area:** the trust boundaries this packet touches — prompt-text handling (no shell or path interpolation), the Python gate's regexes on untrusted prompts (catastrophic backtracking, the 10,000-unit head), `subprocess.ts` argument handling, and the degraded brief's command rendering (option text vs. plain `(ask)`).
- **Reason:** correctness finished with one P1 and one P2; security has had no iteration.
- **Rotation status:** dimension rotation, third of four.
- **Blocked/productive carry-forward:** productive — the vocabulary-gap direction is saturated (two findings, no more angles without the operator's call); blocked — no security finding can rest on running the suites.
- **Required evidence:** a concrete input that crosses a trust boundary and the code path it reaches, read in the copy that serves it.
- **Recovery note:** not applicable.

Review verdict: CONDITIONAL
