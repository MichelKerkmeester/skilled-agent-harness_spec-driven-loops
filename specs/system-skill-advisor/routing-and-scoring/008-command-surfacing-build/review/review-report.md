# Review Report: Command Surfacing Build, Pass Twelve (two lineages)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the twelfth review pass, capped by the operator as the last one (Q085). It read the mention check fixes, the wrapper invariance test and the two merges of origin/main, `2f3f893c153..05475f9d044` (`review/review-scope-12.txt`).
- Executor: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, cap eight iterations each, threshold 0.10, stop policy convergence, through `fanout-run.cjs` (exit 0). Brief `review/review-brief-12.txt`, config `review/deep-review-fanout-config-pass-12.json`. Pass eleven's report is kept as `review-report-pass-11.md`.

## 1. Executive Summary

- **Verdict: CONDITIONAL, P1 accepted as a known limit.** P0 0, P1 1, P2 3.
- **Stop.** Both lineages stopped with `converged`: mention-12 at iteration 3, merged-12 at iteration 6. This is the first pass since pass nine where every lineage converged.
- **The one P1 is recorded, not patched.** The operator chose on 2026-11-16 (Q085) to close capped: a further P1 in the mention check is recorded as a known limit instead of patched again. So criterion 4 holds converged with 0 P0 and one P1 the operator accepted, not with 0 P1.

## 2. Findings and Dispositions

| Id | Severity | Location | Finding | Disposition |
|----|----------|----------|---------|-------------|
| F001 | P1 | `lib/command-attach.ts` `commandOnlyMentioned` | A wrapper the fold does not drop, such as square brackets, `~~`, `<code>`, guillemets or primes, turns a refused or questioned command into an offer: 72 of 72 refusal and question rows flip, no request row does | Known limit (Q085), named in 039 Known Limitations. The six wrappers chat produces most, backtick, straight and curly quotes and bold, are covered and pinned by the invariance test |
| F002 | P2 | `lib/command-attach.ts:437` | A doc-path mention of the command next to a led refusal defeats the refusal | Open, recorded |
| F003 | P2 | `lib/command-attach.ts:208` | The typed-command reader uses a narrower wrapper set than the mention reader | Open, recorded |
| MRG12-P2-001 | P2 | `doctor-install-contract.test.cjs:239` | The workflow half of the runtime-name test cannot fail | Open, recorded |

merged-12 found the two merges keep main's text except the branch's README phrase narrowings and the `/create:sk-skill` name, and the generated signals follow the router.

## 3. Verification

The reviewed HEAD's gate is `039-main-sk-doc-routing-repair/scratch/after-merge-2.txt`: build and typecheck exit 0, suite 2363 passed 0 failed with fresh local advisor state, doctor tests 1273 passed, bin tests 198 passed, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5], stored sets unchanged.
