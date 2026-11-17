# Review Report: Command Surfacing Build, Pass Fourteen (two lineages)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the fourteenth review pass, over pass thirteen's fixes `932aff4e437..e626653ce79` (`review/review-scope-14.txt`).
- Executor: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, cap eight iterations each, threshold 0.10, stop policy convergence, through `fanout-run.cjs`. Brief `review/review-brief-14.txt`, config `review/deep-review-fanout-config-pass-14.json`. Pass thirteen's report is kept as `review-report-pass-13.md`.

## 1. Executive Summary

- **Verdict: CONDITIONAL, closed by the operator's decision.** P0 0, P1 3, P2 2. data-14 stopped at iteration 5 with `converged`. mention-14 stopped at iteration 8 with `maxIterationsReached`.
- **The loop does not converge, by design of the check.** mention-14's two P1 are the mirror images of pass thirteen's two. A fresh Opus 5.5 read (xhigh, read-only) found that the mention check defaults to "request", so every unlisted refusal wording becomes a finding, and the brief asked reviewers for any new breaking input. It recommended recording the class as a known limit and grading new wordings of it P2. The operator approved that on 2026-11-17, with the generic advisor phrases fixed in the same step.

## 2. Findings and Dispositions

| Id | Severity | Location | Finding | Disposition |
|----|----------|----------|---------|-------------|
| mention-14 R1-P1-001 | P1 | `lib/command-attach.ts:415` | A refusal of it with a reason or a repeat adverb, such as "don't run it again, it broke things", reads as a request | Known limit class (operator, 2026-11-17), named in 040 Known Limitations; the pass thirteen side, "don't run it twice" as a request, is kept |
| mention-14 R1-P1-002 | P1 | `lib/command-attach.ts:465` | A document naming followed by any then clause reads as a request | Known limit class, same decision; the pass thirteen side, "open the command file, then run it" as a request, is kept |
| data-14 F001 | P1 | advisor `graph-metadata.json` | "which skill", "route request", "not offering a skill" and "workflow measure" pulled ordinary prompts to the advisor | Fixed: the two bare phrases dropped beside their specific forms, the other two made advisor-specific, both lists; the four ordinary prompts no longer top the advisor |
| mention-14 R1-P2-001 | P2 | guards test | The fixtures pin neither boundary the two rules changed | Open, recorded |
| data-14 F002 | P2 | 040 `decision-record.md` | ADR-001 did not name the residual leak | Fixed by data-14 F001 |

## 3. Verification

`040-final-alignment-loop/scratch/after-pass-14.txt` holds the gate after the phrase fix.
