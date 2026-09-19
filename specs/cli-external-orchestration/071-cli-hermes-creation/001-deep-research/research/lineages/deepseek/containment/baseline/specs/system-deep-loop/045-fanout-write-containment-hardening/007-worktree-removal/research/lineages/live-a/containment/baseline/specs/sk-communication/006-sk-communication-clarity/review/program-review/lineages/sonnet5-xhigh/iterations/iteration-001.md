# Iteration 1: Correctness — sk-communication engine (phase 004) + repo-rules split (phase 003)

## Focus

Dimension: Correctness. Files: `.opencode/skills/sk-communication/cli-communication-projection/src/{config/local-provider.ts,contracts/projection.ts,fidelity/semantics.ts,fidelity/types.ts,fidelity/validator.ts,runtime/external-cli-projection.ts,evaluation/fidelity-veto.ts,config/copy-editing-instruction.ts}`, `.opencode/skills/sk-communication/cli-communication-projection/test/providers/helpers.ts`, `.opencode/commands/rewrite/{response.md,response-by-external-agent.md}`, `repo-rules/{communication.md,prose-mechanics.md}`, `REPO RULES.md`. Scope: verify the "four decision-free engine fixes" and the D5 single-home wording-standard instruction against the actual diff (`git diff` against HEAD on the working tree), not against the narrative in `goal.md`.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 11 (7 engine source + 1 test helper + 2 command docs + 2 repo-rules files, plus 1 router file)
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.15

## Findings

### P2, Suggestion

- **F001**: Fidelity check audit-trail shrinks silently on the no-op path, `.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts:212-238`. Before this diff, the four `checks.push(passed(...))` calls for `MARKDOWN_STRUCTURE_CHANGED`, `FACT_ADDED`, `POLARITY_CHANGED`, and `REQUIREMENT_STRENGTH_CHANGED`/`PRIORITY_CHANGED` ran unconditionally after the `if (restored.text !== sourceText)` block. The diff moved them inside that block (lines 212, 224-227), and the new `compareClaimCoverage` veto (line 229) is inside it too. When a rewrite is a byte-identical no-op (`restored.text === sourceText`), the accepted outcome's `checks` array now contains only `restored.checks` + `ACCEPTED` (and `JUDGE_REJECTED` when judged) — it silently drops the five structural/semantic "passed" entries a reworded outcome always carries. This does not change the accept/reject decision (accept is driven by early `fallback()` returns, not by check count) and `evaluateFidelityVeto()` in `src/evaluation/fidelity-veto.ts:49` only uses `checks.length` as an informational `checkCount`, never as a gating signal — so this is not release-blocking. It is a real asymmetry though: any future consumer that reads `checks` expecting "all N fidelity dimensions were verified" will see a shorter, dimension-dependent list on the no-op path with no code comment marking the tradeoff as intentional.
- **F002**: `AcceptedProjection.changeKind` (contracts layer) is added but the interface is never constructed anywhere in `src/` or `test/`, `.opencode/skills/sk-communication/cli-communication-projection/src/contracts/projection.ts:29-33`. Grep for `AcceptedProjection` across `src/` and `test/` returns only its own declaration, its appearance in the `ProjectionOutcome` union (`src/contracts/projection.ts:51`), and its re-export (`src/contracts/index.ts:109`) — no call site builds a value of this type (`status: 'accepted'` literals elsewhere only appear in the unrelated `src/core/assembler.ts:259` and the actually-used `AcceptedFidelityOutcome` in `src/fidelity/validator.ts`). This predates the diff (the interface itself is untouched structurally besides the new field) — the diff mirrors the fidelity layer's new `changeKind` field into an already-unwired contract type rather than introducing new dead code, but it is worth flagging that the `contracts/projection.ts` orchestrator-facing type still has no producer.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `repo-rules/communication.md:230 lines`, `repo-rules/prose-mechanics.md:140 lines`, `REPO RULES.md:47-48,66-67` | Router rows for both split halves exist and match the goal.md claim ("router names both halves"); full spec_code sweep deferred to iteration 3 |

## Assessment

- New findings ratio: 0.15
- Dimensions addressed: correctness
- Novelty justification: Read the actual working-tree diff for the 004 engine change rather than trusting `goal.md`'s "gate 82 files 455 tests exit 0" narrative claim; verified `resolveCopyEditingInstruction()` reads and caches `hvr-rules.md` at first call (matches D5's "one home, enters the engine, no detector set" claim — `src/config/copy-editing-instruction.ts:1-40`); traced the new `compareClaimCoverage` veto's word-stem bag-of-words matching (`src/fidelity/semantics.ts:130-166`) for a false-negative gap on negation removal (`not` is in `CLAIM_FUNCTION_WORDS`, so a candidate that drops "not" would pass the claim-coverage check on its own) — confirmed this gap is covered by the pre-existing, earlier-running `POLARITY_CHANGED` veto in `compareSemanticMeaning()` (`src/fidelity/semantics.ts:87-96`, invoked before `compareClaimCoverage` in `validator.ts:214`), so no exploitable fidelity bypass exists in the layered check order.

## Ruled Out

- Negation-removal bypass of `compareClaimCoverage` via the `not` function-word exclusion: ruled out as a live risk, `src/fidelity/semantics.ts:214` (`compareSemanticMeaning` → `POLARITY_CHANGED`) runs first in `validator.ts` and independently signatures polarity markers, so a rewrite that drops "not" is vetoed there before `compareClaimCoverage` is ever reached.
- `checkCount` divergence (F001) driving an incorrect accept/reject decision: ruled out, `evaluateFidelityVeto()` gates purely on `result.status === 'accepted'` (`src/evaluation/fidelity-veto.ts:41`), `checkCount` is carried through only as a diagnostic field.

## Dead Ends

None this iteration.

## Recommended Next Focus

Iteration 2: Security. Focus on the trust-boundary surface of the projection engine — `restoreProtectedSpans`/protected-spans handling, the child-process CLI transport (`src/transports/cli.ts` if present) that pipes external-CLI output back through `external-cli-projection.ts`, and whether `COMMUNICATION_PROJECTION_ENABLED` scoping (claimed "strictly scoped to the child subprocess execution" in `response-by-external-agent.md`) actually holds in the runtime. Treat CLI/model output as untrusted per the loop-protocol's prompt-injection posture.
