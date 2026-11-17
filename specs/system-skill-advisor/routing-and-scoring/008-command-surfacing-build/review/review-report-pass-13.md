# Review Report: Command Surfacing Build, Pass Thirteen (two lineages)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the thirteenth review pass, over phase 040's build `b8ebee37d75..932aff4e437` (`review/review-scope-13.txt`), run under the operator's full-loop answer.
- Executor: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, cap eight iterations each, threshold 0.10, stop policy convergence, through `fanout-run.cjs` (exit 0). Brief `review/review-brief-13.txt`, config `review/deep-review-fanout-config-pass-13.json`. Pass twelve's report is kept as `review-report-pass-12.md`.

## 1. Executive Summary

- **Verdict: CONDITIONAL, all three P1 fixed.** P0 0, P1 3, P2 7. The fixes are in phase 040 and pass fourteen reads them.
- **Stop.** data-13 stopped at iteration 3 with `converged`. mention-13 stopped at iteration 8 with `maxIterationsReached`, which is not convergence.

## 2. Findings and Dispositions

| Id | Severity | Location | Finding | Disposition |
|----|----------|----------|---------|-------------|
| mention-13 F001 | P1 | `lib/command-attach.ts` | A document naming returned a mention before a later "then run it" was read | Fixed: the request clause is read first, and a naming followed by "then" is not only a read; two cases fail on the old code |
| mention-13 F002 | P1 | `lib/command-attach.ts` | "don't run it twice" and "never run it without a budget" read as refusals | Fixed: the refusal has to end its clause; two cases fail on the old code |
| data-13 F001 | P1 | advisor `graph-metadata.json` | The new phrases put clean, arena, arm and briefs into the lexical lane, so ordinary prompts topped the advisor | Fixed: six of the seven phrases removed, only "vibe prompt hook" kept; the five ordinary prompts no longer top the advisor; P08 and P09 declined in ADR-001 |
| mention-13 F007 | P2 | `lib/command-attach.ts` comment | The fold comment broke mid-sentence | Fixed |
| mention-13 F003 | P2 | `lib/command-attach.ts:441` | A markdown link label abutting its target stops being an occurrence | Open, recorded |
| mention-13 F004 | P2 | `lib/command-attach.ts:459` | The post-name reader covers one clause shape | Open, recorded |
| mention-13 F005 | P2 | 040 `spec.md` | The document bullet is wider than the determiner rule | Open, recorded |
| mention-13 F006 | P2 | 040 `tasks.md` | CHK-FIX-002 claims matrix coverage for leads it never wraps | Open, recorded |
| data-13 F002 | P2 | advisor `graph-metadata.json` | "clean arena" fired inside a longer noun phrase | Fixed with data-13 F001 |
| data-13 F003 | P2 | `declared-phrase-specificity.vitest.ts` | The declared-phrase contract holds in one scorer and not the other | Open, recorded |

## 3. Verification

`040-final-alignment-loop/scratch/after-pass-13.txt`: build and typecheck exit 0, stored sets unchanged, graph freshness exit 0, suite 2385 passed 0 failed with `AI_SESSION_CHILD` unset and set, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5], probes 11 of 15 (P05, P08 and P09 declined in ADR-001, P04 overturned by the run's critic), and none of the five ordinary prompts tops the advisor.
