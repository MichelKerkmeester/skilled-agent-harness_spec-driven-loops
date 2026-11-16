# Review Report: Command Surfacing Build, Pass Ten (two lineages)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the tenth review pass. It read the commits after pass nine (`05f776202e0..5b2b062baef`) and what the branch keeps over main in the merge `e91faf28b8c`, in two areas (`review/review-scope-10.txt`).
- Executor: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, cap eight iterations each, threshold 0.10, stop policy convergence, through `fanout-run.cjs` (exit 0). Brief `review/review-brief-10.txt`, config `review/deep-review-fanout-config-pass-10.json`. Pass nine's report is kept as `review-report-pass-9.md`.

## 1. Executive Summary

- **Verdict: CONDITIONAL, both P1 fixed.** P0 0, P1 2, P2 7. Both P1 and three P2 are fixed in phase 039 (T010, T011). Four P2 are recorded as open.
- **Stop.** attach-scorer-10 stopped at iteration 7 with `converged`. docs-merge-10 stopped at iteration 5 with `stuckRecovery`, which is not convergence, so a further pass reads phase 039 and these fixes.

## 2. Findings and Dispositions

| Id | Severity | Location | Finding | Disposition |
|----|----------|----------|---------|-------------|
| AC10-P1-001 | P1 | `lib/command-attach.ts` `commandOnlyMentioned` | A single-quoted command name still hid a refusal or question lead | Fixed: a single quote that opens a command name is dropped, contractions keep theirs; three cases fail without it |
| F001 | P1 | `doctor-install-presentation.txt:78` | The merge took main's runtime sentence while the branch's contract test and workflow still said DSH is not offered | Fixed: the presentation names the eight manifest runtimes, the stale DSH sentence is gone, the test reads the manifest |
| F002 | P2 | `doctor-install-presentation.txt:78` | The sentence said nine but listed eight | Fixed with F001 |
| AC10-P2-002 | P2 | `lib/command-attach.ts` | The curly double quotes had no test | Fixed: case added |
| AC10-P2-003 | P2 | `lib/command-attach.ts` | The comment did not say why the apostrophe stays | Fixed: the comment names it |
| AC10-P2-001 | P2 | `command-transcript-score.vitest.ts` | The in-any-order clause of the suffix requirement has no test | Open, recorded |
| F003 | P2 | advisor `README.md:244` | The runtime lists leave out Vibe | Open, recorded (the final alignment run's B3 too) |
| F004 | P2 | `changelog/v1.1.0.0.md:44` | The no-edit bullet claims more than the gate | Open, recorded |
| F005 | P2 | `changelog/v1.1.0.0.md:102` | The suffix list is narrower than the parser | Open, recorded |

## 3. Verification

`039-main-sk-doc-routing-repair/scratch/after-pass-ten.txt`: build and typecheck exit 0, suite 2353 passed 0 failed with `AI_SESSION_CHILD` unset and set, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5], stored sets unchanged. Doctor script tests 1266 passed 0 failed.
