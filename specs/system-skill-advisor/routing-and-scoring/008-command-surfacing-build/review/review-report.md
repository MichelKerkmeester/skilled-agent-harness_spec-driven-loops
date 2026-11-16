# Review Report: Command Surfacing Build, Pass Eleven (two lineages)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the eleventh review pass. It read phase 039's sk-doc routing change and review pass ten's two fixes, `6d50afe6f39..2f3f893c153`, in two areas (`review/review-scope-11.txt`).
- Executor: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, cap eight iterations each, threshold 0.10, stop policy convergence, through `fanout-run.cjs` (exit 0). Brief `review/review-brief-11.txt`, config `review/deep-review-fanout-config-pass-11.json`. Pass ten's report is kept as `review-report-pass-10.md`.

## 1. Executive Summary

- **Verdict: CONDITIONAL, both P1 fixed.** P0 0, P1 2, P2 10. Both P1 are fixed in phase 039 (T013), with a wrapper invariance test (T014) that pins the whole class: every mention fixture must read the same wrapped in code, quote or bold marks, and under a retired name, as it reads plain. Five P2 are fixed and five recorded.
- **Stop.** routing-11 stopped at iteration 3 with `converged`. fixes-11 stopped at iteration 8 with `maxIterationsReached`, which is not convergence, so pass twelve reads these fixes.

## 2. Findings and Dispositions

| Id | Severity | Location | Finding | Disposition |
|----|----------|----------|---------|-------------|
| FIX11-P1-001 | P1 | `lib/command-attach.ts` `commandOnlyMentioned` | A closing single quote after a command in an or-list hid the refusal for the later command | Fixed: a single quote that closes a command name is dropped too; the invariance test fails on the old code for straight and curly single quotes |
| FIX11-P1-002 | P1 | `lib/command-attach.ts` `typedCommandForTop` | Refusing the retired `/create:skill` still delivered `/create:sk-skill` | Fixed: the mention check reads a retired name beside the command it maps to |
| FIX11-P2-001 | P2 | `doctor-install-contract.test.cjs` | The test no longer checked the workflow its title names | Fixed: it asserts the workflow carries no stale offer sentence |
| FIX11-P2-003 | P2 | `lib/command-attach.ts` comment | The comment named only the opening quote | Fixed with FIX11-P1-001 |
| FIX11-P2-005 | P2 | `doctor-install-contract.test.cjs` | One assertion was subsumed by the next | Fixed: the subsumed line is gone |
| F003 | P2 | 039 `spec.md` | The spec listed `sk-create-readme/ROUTER.md`, which was not changed | Fixed: row and scope mention removed |
| F001 | P2 | `sk-doc/ROUTER.md` | The probe proves the hub only, and a dropped hook name loads the generic README template | Fixed in the docs: 039's purpose, REQ-003 and Known Limitations now say so |
| F002 | P2 | `sk-doc/ROUTER.md` | The named skill-advisor hook phrase ties two README intents | Open, recorded |
| F004 | P2 | `sk-doc/ROUTER.md` | Other named hooks bring the same cross-hub token class | Open, recorded |
| F005 | P2 | `generate-router-intent-signals.cjs` | The carry rule and its check share a blind spot for dotted phrases | Open, recorded |
| FIX11-P2-002 | P2 | 039 `acceptance-criteria.md` | AC-006 tests one instance of REQ-006 | Open, recorded: AC-007's invariance test now covers the class |
| FIX11-P2-004 | P2 | `doctor-install-presentation.txt:78` | The sentence fuses the accepted list with the ones already there | Open, recorded |

## 3. Verification

`039-main-sk-doc-routing-repair/scratch/after-pass-eleven.txt` and `after-pass-eleven-invariance.txt`: build and typecheck exit 0, suite 0 failed with `AI_SESSION_CHILD` unset and set, doctor tests 1266 passed 0 failed, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5], stored sets unchanged.
