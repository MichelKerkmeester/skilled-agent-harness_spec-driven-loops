# Review Iteration 001 — Correctness (inventory pass)

## Dispatcher

- Lineage: `review/lineages/deepseek-max-1`, session `fanout-deepseek-max-1-1795550334883-gjbarh`, generation 8, lineageMode `new`
- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Scope: the 72 pre-bound paths in `review-scope-files.txt`, taken in file order
- Budget: 24 tool calls, 10 minutes. Stop policy `max-iterations`, cap 7, so this lineage runs to 7 regardless of convergence telemetry.
- Operator review focus (carried into every iteration): finish the `spec_code` and `checklist_evidence` protocols against REQ/AC/task evidence that really exists in the tree. This iteration starts both: it checked the citation layer of `acceptance-criteria.md` and the counted claims that carry the sixth-round and later rows.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:220` (REQ-001 row block, read to REQ-050)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:66` (AC-009 to AC-059, read in full)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:164` (T082 to T092, Verification Summary, the three open boxes)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:95` (AC-038, the finding below)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121` (`VOCABULARY_PAIRS` and the `PATTERN_PAIRS` / `PATTERNS_NOT_COMPARED` tables)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` (case and column counts)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:225` (`row_type` counts)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:400` (`enrichCompiledRoutes` command guard) and `:442` (`attachTypedCommand`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:251` (`typedCommandIn`), `:304` (`typedCommandForTop`), `:1582` (`attachCommand`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1011` (`refinesSameLocation`), `:2449` (`authoredHeading` in `replaceAnchorSection`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **AC-038's observed drift-guard counts no longer match the guard it cites** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:95` -- AC-038 reads `Met` and states that `VOCABULARY_PAIRS` "compares 22 vocabulary pairs", "the last of them `RUN_ASK_REFUSAL_LEADS`", and that "Twelve of the 22 lists carry a per-entry case ... The other ten are compared but carry no per-entry case". The guard at `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121` now holds 24 rows, and the last row is `['RUN_ASK_REFUSAL_VERBS', '_RUN_ASK_REFUSAL_VERB_LIST', RUN_ASK_REFUSAL_VERBS]`. The two rows added after AC-038 was written are `RUN_ASK_REFUSAL_CANCEL_LEADS` (added with the negated-refusal rule, `spec.md:274`) and `RUN_ASK_REFUSAL_VERBS` (the refusal-verb list, `spec.md:247`), so the 12/10 split AC-038 states is also off by the two new lists. REQ-031 itself is written to survive this ("The requirement names no list count, so adding a list changes the guard, not this text"); the acceptance cell was not given the same treatment.
   Finding class: docs-traceability
   Scope proof: both files are in `review-scope-files.txt` (entry 23 for `acceptance-criteria.md`, entry 19 for the vitest file), and the counted claim is checkable from the tree alone.
   Affected surface hints: `acceptance-criteria.md` AC-038 observed cell; `spec.md` REQ-031 (its own text needs no change); no code or test change is implied.
   Case: a reader or reviewer who opens AC-038 to confirm REQ-031 as built counts 24 pairs, finds a different last entry, and cannot tell whether the guard grew legitimately or the row is stale. The row's evidence pointer (`deep-loop-offer-cases.vitest.ts:121`) still resolves, so the drift hides behind a passing citation.

## Traceability Checks

| Protocol | Level | Status this iteration | Evidence |
| --- | --- | --- | --- |
| `spec_code` | core | partial | Start made, not finished. Spot-checked five claim-to-code pairs: REQ-029 against `handlers/advisor-recommend.ts:442` (`attachTypedCommand` applied after `enrichCompiledRoutes` at `:570` and `:642`), REQ-025 against `lib/command-attach.ts:251` (`typedCommandIn` keeps its longest key) and `:304` (`typedCommandForTop` gives the typed command to the row that owns it), REQ-023 against `command-attach.ts:1599` (`isRunRefused` withholds the doctor row), REQ-032 against `runtime/scripts/reduce-state.cjs:1011`, REQ-048 against `reduce-state.cjs:2449`. All five read as the requirement states. The remaining REQ-001 to REQ-022 and REQ-030 to REQ-051 pairs are carried to iterations 3 to 5. |
| `checklist_evidence` | core | partial | `acceptance-criteria.md` carries 60 `Evidence: `path:line` (`quoted text`)` cells. All 60 resolve to an existing file, none is past end-of-file, and in all 60 the cited line contains the quoted text, so the citation layer is clean. Counted claims were re-derived from the tree: `command-prompts.jsonl` `near-miss` rows 31 (AC-019 states 31), `refusal-verb-` fixture rows 12 (AC-030 states 12), fixture rows carrying `doctorWithheld` 47 with 27 true and 20 false (AC-031 states 47 / 27 / 20), `effort-` rows 24 (AC-046 states 24), `plural-` rows 21 (AC-044 states 21), fixture cases 359 (AC-037 and AC-042 state 359), `PATTERN_PAIRS` 12 + `ANCHORED_PATTERN_PAIRS` 8 + `FRAGMENT_PAIRS` 16 + `QUANTIFIER_PAIRS` 4 = 40 and `PATTERNS_NOT_COMPARED` 38 (AC-059 states 40 and 38). One counted claim fails: AC-038's 22 pairs, carried above. |

## Edge Cases

- `AC-040` reads `Unmet` (`acceptance-criteria.md:97`), `T084` is open (`tasks.md:166`) and `CHK-020` is open (`tasks.md:286`). The three boxes are one follow-up row, not three gaps: the fifth-round decision was that the traceability rerun is a review run and not part of the build. This lineage is that rerun, so the row may close after synthesis, and the open boxes are the honest state rather than a finding.
- `## Verification Summary` (`tasks.md:340`) reports 12 P0 items with 11 verified. The single unverified item is the same follow-up row, so the summary and the boxes agree.
- `implementation-summary.md` limitation 8 records that the served-brief layer is where a degraded brief drops a command. That is a documented limitation, not a silent gap, so it is not read as a pass and not counted as a finding this iteration.

## Confirmed-Clean Surfaces

- Every `path:line` citation in `acceptance-criteria.md` and `tasks.md` (60 quoted cells, plus the unquoted refs) resolves to a real file and an in-range line.
- The commits the acceptance cells name as observation points (`2520456bd3f`, `3db3085bcf0`, `4edba5ad264`, `9f1190407eb`, `5ace62e10e6`) all exist in this repository, and the probe artifacts those cells cite (`scratch/probes/fresh-review-hook.txt`, `scratch/probes/results-ac017-ood.json`, `scratch/probes/results-final-958fa81-worktree.json`, `scratch/probes/ac034-served-head.jsonl`) are present.
- The served-head ordering ADR-005 requires is the ordering the code has: `attachTypedCommand` runs after `enrichCompiledRoutes` on both the cached and the uncached path of `computeRecommendationOutput`, so a typed command replaces the diagnosis a stuck complaint earns.

## Ruled Out

- Citation drift across `acceptance-criteria.md`: investigated because a long-lived packet accumulates stale line references. Eliminated for this iteration — 60 of 60 quoted cells land on their quote, and no reference is past end-of-file.
- Near-miss count drift (AC-019): investigated, eliminated — the corpus holds 31 `near-miss` rows, which is the number AC-019 says was observed after later rounds moved it past the original 15.
- `PATTERNS_NOT_COMPARED` count drift (AC-059): investigated, eliminated — 38 named rows and 40 compared pairs both match the tree.

## Next Focus

- Dimension: D2 security
- Focus area: the degraded and fallback surfaces, where a supplied command reaches a row: `skill-advisor-cli.ts` (`trackedCommandForOwner`, the row `degradedRecommendations` builds) and `hooks/lib/skill-advisor-cli-fallback.ts`; plus the subprocess boundary in `lib/subprocess.ts` and the schema boundary in `schemas/advisor-tool-schemas.ts`.
- Reason: security is second in risk order, and the sixth round moved trust decisions (which command may print, what a supplied string may become) onto the degraded path, which is exactly where a caller can hand the advisor a string it did not build.
- Rotation status: D1 correctness reviewed; D2 security is next.
- Blocked/productive carry-forward: the counted-claim sweep is productive for traceability. Prefer it for the REQ-023 to REQ-034 block in iteration 4.
- Required evidence: `file:line` for every claim about which command prints, and a named caller that can send the failing input.

Review verdict: PASS
