# Convergence report — deepseek-v4-flash-cli-runtime-r3

- **Stop reason:** `maxIterationsReached` (config.stopPolicy `max-iterations`; convergenceThreshold 3 treated as telemetry only — the lineage charter fixes five iterations, one angle each, no early synthesis)
- **Total iterations completed:** 5 of 5
- **Findings registered:** 12 (P1 ×2, P2 ×10) — per iteration: 3, 2, 2, 2, 3
- **Questions answered ratio:** 11 of 13 key/scan questions answered; 2 carried (pi loader relocation; test:legacy dispatch of the four standalone bash tests)
- **newInfoRatio trend:** 1.0 every iteration (fixed-angle audits; no iteration re-covered a prior angle; the census rows were checked but not re-reported)

## Iteration summary

| Iter | Angle | newInfoRatio | Findings | Primary evidence |
|------|-------|--------------|----------|------------------|
| 1 | Command assets vs scripts | 1.0 | 3 | save.md:47-48, workflow.ts:1740, no validate.md |
| 2 | Undocumented env reads | 1.0 | 2 | validate.sh:19-20, ENV-REFERENCE.md:225 |
| 3 | Test coverage by script | 1.0 | 2 | cli/tests standalone bash tests, check-links.sh registry absence |
| 4 | Hook adapters vs core | 1.0 | 2 | pi/completion-evidence.ts:12,20 |
| 5 | CI push vs PR coverage | 1.0 | 3 | spec-kit-check.yml:3-8, changed-packet-validation.yml:3-5, PR-only set |

## Quality gates

- **Source diversity:** all evidence is checked-in source at path:line; no web, no inferred behavior without a citation.
- **No single weak source:** every finding cites both claim and actual file:line; the two conditional findings (006, 008) are explicitly labeled conditional with the verifying read named.
- **Focus alignment:** each iteration executed its fixed angle in the charter's order; no re-reporting of census-fixed/kept/recorded rows without new evidence (sweep-track-roots.mjs stated as recorded-kept, not re-listed).
- **Convergence:** not used as a stop signal by design (max-iterations).

## Verdict

The remediated tree (007/008/014) holds under this round's angles. Twelve defects were found, two of them P1: the pi completion-evidence adapter's hook-flags import path (008, conditional on loader behavior) and the spec-kit-check workflow's missing push trigger (010), the latter reopening the exact CI-invisibility gap the census believed closed. No finding contradicts a census disposition.
