# Deep Review Iteration 13

## Dimension

Independent re-verification of this packet's own verification claims, focused on the documented typecheck, focused seeded-PPR tests, and full code-graph suite baseline counts.

## Files Reviewed

| File | Lines | Purpose |
| --- | --- | --- |
| `.opencode/skills/sk-code-review/references/review_core.md` | 28-49 | Severity and evidence doctrine |
| `.opencode/skills/system-code-graph/package.json` | 6-12 | Real verification scripts |
| `implementation-summary.md` | 95-108 | Claimed verification results |
| `checklist.md` | 55-73 | Claimed typecheck and suite baseline evidence |

Commands run from `.opencode/skills/system-code-graph`:

| Command | Exit | Actual result |
| --- | ---: | --- |
| `npm run typecheck` | 0 | `tsc --noEmit -p tsconfig.json` completed with no reported errors |
| `npx vitest run mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts` | 0 | `Test Files 2 passed (2)`, `Tests 9 passed (9)` |
| `env -u SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION npx vitest run` | 1 | `Test Files 9 failed | 80 passed (89)`, `Tests 23 failed | 733 passed | 1 skipped (757)` |

## Findings by Severity (P0/P1/P2)

### P0

None.

### P1

#### P1-013 [P1] Full-suite verification count no longer matches the packet's claimed baseline

Claim: The packet's verification docs claim the existing code-graph suite with the new flag off preserves the pre-existing baseline, recorded as `same 6 failed/9 failed pre-existing baseline` in `checklist.md` and `implementation-summary.md`, and also as `5 failed/8 failed` after the ADR-001 fix in `implementation-summary.md`.

EvidenceRefs: `checklist.md:58`, `checklist.md:70`, `implementation-summary.md:100`, `implementation-summary.md:101`, `implementation-summary.md:105`; command run `env -u SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION npx vitest run` from `.opencode/skills/system-code-graph` exited 1 with `Test Files 9 failed | 80 passed (89)` and `Tests 23 failed | 733 passed | 1 skipped (757)`.

CounterevidenceSought: Read `package.json:6-12` to use the real test entrypoint, unset `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` for the flag-off path, and separately confirmed the focused seeded-PPR tests pass exactly as claimed.

AlternativeExplanation: The broader suite may be sensitive to runtime state, cwd resolution, concurrent daemon state, or unrelated drift. That would explain some failures, but it does not support the packet's unqualified baseline-count claim in the current tree.

FinalSeverity: P1.

Confidence: 0.92.

DowngradeTrigger: Downgrade to P2 or close if a rerun in the documented expected environment produces the claimed baseline counts, or if the docs are amended to state the current reproducible baseline and environmental preconditions.

Finding class: matrix/evidence.

Content hash: `sha256:2c2983ea23aa9a4429d83e4c85f9289a637c2a96a50a491d489ed412e160a87c`.

### P2

None.

## Traceability Checks

| Claim | Source | Actual check | Result |
| --- | --- | --- | --- |
| `tsc --noEmit` clean with 0 errors | `implementation-summary.md:100`, `implementation-summary.md:103`, `checklist.md:58` | `npm run typecheck` | Matches claim |
| Recovered PPR unit tests pass as 2 files / 9 tests | `implementation-summary.md:104` | Focused `npx vitest run ...seeded-ppr...` | Matches claim |
| Existing full suite preserves documented baseline count with flag off | `implementation-summary.md:101`, `implementation-summary.md:105`, `checklist.md:70` | `env -u SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION npx vitest run` | Does not match claim |

## Verdict

CONDITIONAL. The direct typecheck and focused seeded-PPR test claims are reproducible, but the broader suite baseline-count claim is not reproducible in the current tree.

## Next Dimension

Reconcile whether the full-suite failures are expected environmental drift or genuine current baseline drift, then update verification docs or the failing suite baseline evidence accordingly.

Review verdict: CONDITIONAL
