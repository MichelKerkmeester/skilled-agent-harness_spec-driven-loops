# Review Iteration 003 — deepseek-max-1

**Dimension:** correctness (D1)
**Protocol:** `spec_code` (carried) + behavior execution
**Focus:** the served gate's behavior on refusal, mode-cue and stuck-run paths, with the operator focus carried in full: the refusal and mode-cue rules added in the sixth to eighth rounds (REQ-023, REQ-024, REQ-026, REQ-035 to REQ-038) are exercised, not only read.

## Dispatcher

- Run: `fanout-deepseek-max-1-1795518961022-7ms9ak`, generation 1, lineage mode `new`, label `deepseek-max-1`.
- Execution: this process; no nested dispatch ran.
- Config: `maxIterations=7`, `stopPolicy=max-iterations`.
- Steering channel: `steer.md` is absent at iteration 3.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:480-620,980-1060,1400-1540`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5441-5520`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1485-1600`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074,1487`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:120-170`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:60-100`
- `.skilled/commands/deep/assets/deep-review-presentation.txt:28-60`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:28-58`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A refused loop phrase still supplies the mode cue, so the gate can offer the exact command the prompt refused** -- `command-attach.ts:1489` -- `deferredLoopCommand` counts mode cues with `MODE_CUES[mode].test(cueText)` after blanking only loop-name *subjects*. It never removes phrases a refusal leads, while `asksForLoopRun` does skip them (`runAskNegatedAt` / `LOOP_ASK_REFUSED_AFTER`, used by `hasLoopAsk`). The two therefore disagree on the same prompt. Measured on the served head: "run deep reviews on the parser, but skip the deep research" returns `/deep:research (ask)` — the command the prompt explicitly skips — and "run a deep review on the parser and skip the deep research" returns no command at all, because the refused research cue cancels the genuine review cue.
   Case: an operator types "run deep reviews on the parser, but skip the deep research". The advisor answers with `/deep:research (ask)`, so the one command the operator ruled out is the one offered, and the reviews they asked for are not offered. A second real input, "run a deep review on the parser and skip the deep research", loses the review offer entirely.
   Finding class: `correctness` (refusal contract violated on the deferred mode-cue path; `ask` policy still blocks spend without a second confirmation).
   Scope proof: `command-attach.ts` and the fixture are `reviewScopeFiles` entries; the two served results were produced by `node .skilled/bin/skill-advisor.cjs advisor_recommend` (built `dist`), and the cue test was read at `:1489-1496`. `skill_advisor.py:5441-5460` shows the Python gate reads `run_asked` and `stuck` but keeps no mode-cue copy, so this path is TypeScript-only.
   Affected surface hints: `command-attach.ts:1489`, `command-attach.ts:1472`, `command-attach.ts:993-999`, fixture rows `refusal-verb-*` and `plural-*`.

   ```json
   {
     "type": "correctness",
     "claim": "Refused loop phrases remain in cueText and are counted as mode cues, so a deferred route can attach the refused command or lose the unrefused one.",
     "evidenceRefs": [
       "advisor_recommend('run deep reviews on the parser, but skip the deep research') -> /deep:research ask",
       "advisor_recommend('run a deep review on the parser and skip the deep research') -> system-deep-loop with no command",
       "command-attach.ts:1489",
       "command-attach.ts:1472",
       "command-attach.ts:993"
     ],
     "counterevidenceSought": "Checked that asksForLoopRun is true for both prompts and that commandOnlyMentioned is false (no command string is typed). Read the refusal handling in hasLoopAsk and confirmed it is the only place refusals are stripped; cueText is built from the raw prompt. Also checked the inverse prompt ('...skip the deep review' with a research ask) and found the same class in the other direction.",
     "alternativeExplanation": "The cue set may be intended as a coarse topic read rather than a request read, with `ask` policy as the safety net. That explains a weak cue but not offering the exact command the prompt refuses.",
     "finalSeverity": "P1",
     "confidence": 0.88,
     "downgradeTrigger": "Downgrade to P2 if the team accepts a refused-mode cue as a presentational hint because policy `ask` blocks execution, and records the behavior as a known limit."
   }
   ```

### P2 Findings

2. **Two non-command asks share the plural/cue gap and lose the offer silently** -- `command-attach.ts:1489` -- Same root cause as finding 1, recorded separately for the prompts that lose an offer rather than receive a wrong one: "run a deep review on the parser and skip the deep research", "skip the deep research, run a deep review on the parser" and "no deep research, run a deep review on the parser" all return the hub with no command, though each asks for a deep review through a use verb.
   Case: an operator writes "no deep research, run a deep review on the parser" and gets the hub skill with no command, so the requested review is never offered.
   Finding class: `correctness` (false negative; no wrong command is offered).
   Scope proof: measured through the built advisor; the cue test read at `command-attach.ts:1489`.
   Affected surface hints: `command-attach.ts:1489`, `command-attach.ts:1502` (`NAMED_LOOP_MODE` does not match the plural "deep reviews").

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial (carried) | Iteration 1's two P1s stand; this iteration adds a third, in the deferred cue path. |
| `checklist_evidence` | pass (carried) | Iteration 2's result stands; not re-run. |

What this iteration actually ran:

1. **33-prompt native/Python predicate comparison.** `asksForLoopRun` and `isStuckRunComplaint` were evaluated for 33 adversarial prompts in the built TypeScript and in `skill_advisor.py`; drift 0. The refusal, plural, question, effort, subject and stuck-run rows of the shared fixture are represented.
2. **26 served-head measurements on refusal and mode-cue prompts.** REQ-015, REQ-023, REQ-024 and REQ-026 controls give their stated results (six refusals withhold, three keep-controls keep, the two doctor-refusing prompts drop the doctor, the plain stuck complaint keeps it). The mixed-mode refusal prompts in findings 1 and 2 do not.
3. **13 count and plural variants.** "run three deep reviews", "run 12 deep reviews", "run a dozen deep reviews", "do two exhaustive deep reviews", "run two deep reviews of the parser and one of the scheduler", "run several deep reviews" all keep `/deep:review (ask)`; "don't run two deep reviews on the parser" withholds; "run two deep review loops on the parser" keeps `/deep:review`.
4. **Code read of the refusal and cue paths.** `hasLoopAsk` skips a refused phrase; `deferredLoopCommand` tests cues on text where only loop-name subjects are blanked; the Python gate has no mode-cue copy.

## Integration Evidence

- Served head: `node .skilled/bin/skill-advisor.cjs advisor_recommend` (built `dist/runtime/lib/command-attach.js`).
- Python copy: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, imported directly for predicate comparison.
- Hub router: `.skilled/skills/system-deep-loop/hub-router.json` (context only).
- Fused doctor row: `fusion.ts:1074` `withholdDeepLoopDoctorWithoutRun`, called at `:1487`.

## Edge Cases

- **The wrong-command and lost-command symptoms share one root cause.** They are split by impact: the P1 offers a refused command; the P2 only withholds an offer. Fixing the cue text fixes both.
- **`ask` policy limits blast radius.** No command self-executes; the operator still confirms. The severity rests on the offer contradicting an explicit refusal, not on spend.
- **The Python fallback cannot reproduce this path.** It has no mode-cue implementation; the finding is TypeScript-only, and the fallback's limitation 8 already covers its own untyped-ask gap.

## Confirmed-Clean Surfaces

- REQ-015, REQ-023 (six refusals and three keep-controls) served correctly.
- REQ-024 (two run-refusing stuck prompts withhold the doctor; the plain complaint keeps `/doctor:deep-loop`).
- REQ-036 question prompts served correctly, including the later-clause control.
- REQ-037 effort complaints and four controls served correctly.
- Count and plural variants beyond the fixture's eight run rows served correctly.
- Native/Python predicate parity: 33/33, drift 0.

## Ruled Out

- **Plural counts are unread.** Ruled out: digits, spelled counts and "a dozen" all ask, and "don't run two deep reviews" withholds.
- **The doubled-mode prompt double-counts.** Ruled out: "run two deep review loops on the parser" resolves to review.
- **The doctor lane fires on a refused fix.** Ruled out: "the deep review run is stuck and I don't want a fix" drops the doctor row.
- **The typed-stuck exception leaked to untyped complaints.** Ruled out: the untyped stuck complaint still returns `/doctor:deep-loop`.

## Next Focus

- **Dimension:** security
- **Focus area:** untrusted prompt handling in the gate: regex cost on very long prompts, bounded-window behavior, and whether a crafted prompt can steer the command or the doctor row.
- **Reason:** the gate runs on every prompt and is pure pattern matching over untrusted text; the long-prompt and refusal paths are the security surface.
- **Rotation status:** correctness complete; security next.
- **Required evidence:** code paths at `file:line` plus measured timing on adversarial inputs.

## Assessment

Dimensions addressed: correctness

The gate is correct on the fixture's refusal, plural, question, effort and stuck-run groups, and the two gate copies agree on 33 adversarial prompts. One deferred-path defect remains: refusals are removed from the ask predicate but not from the mode-cue read, which can offer the refused command or drop the requested one. No P0.

Review verdict: CONDITIONAL
