# Review Iteration 003

## Dispatcher

- Lineage: `doctor-docs-3`, session `fanout-doctor-docs-3-1794593402980-zhrui5`, generation 1.
- Mode: review, dimension `maintainability`, budget profile `verify`.
- Operator review focus: pass-three narrow review of the doctor-docs files changed by the pass-two remediation commits, each change judged against its task line and its callers. This iteration addresses the focus by checking every changed prose surface (bridge README, routing-accuracy README, playbook, catalog, tests README) against the code and data it names, including the sealed-holdout disclosure and the recaptured baseline arithmetic.
- Sources read: `git diff ec1869dae8..HEAD` for the six files below; `lib/command-attach.ts:48-56` and the generated `COMMAND_ROWS`; `scripts/routing-accuracy/{command-offer.mjs,run-command-behaviour.mjs,score-command-transcripts.mjs,measure-brief-cost.mjs}`; `schemas/advisor-tool-schemas.ts:285-312`; `handlers/advisor-recommend.ts:630,705`; the playbook inventory; `scorer-eval-baseline.json`; the scope file.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:50`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:79-128`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:27-40`
- `.skilled/skills/system-skill-advisor/runtime/tests/README.md:154`
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:31-45`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-30`
- `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts:53-75`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | T008's row-field sentence matches `CommandRow` (`command`, optional `policy`, optional `mutating` with the three values, `ownerSkillId`) and all 54 generated rows carry all four; T018 to T021 and T043 match `selectMode` (`--row-id` refuses the session form), `trustedCheckout`, `armFor`, `lineFixture` and the `delete env.AI_SESSION_CHILD` line. |
| `checklist_evidence` | pass | CHK-041 claims every rerun prints what its task named; the playbook inventory suite passes with the new count, the persistence test and the field test. |
| `feature_catalog_code` | pass | The catalog's three `AdvisorRecommendationSchema` citations and two `AdvisorRecommendInputSchema` citations resolve; the two `includeCompiledRoute === false` checks exist exactly twice. |
| `playbook_capability` | pass | The playbook names 50 category files, no `NNN-*` file and no `CL-002`, and the suite asserts each claim against the tree. |

## Integration Evidence

- `env -u AI_SESSION_CHILD npx vitest run tests/manual-testing-playbook.vitest.ts` in the advisor runtime reports `2 passed`.
- `env -u AI_SESSION_CHILD npx vitest run tests/command-attach-guards.vitest.ts` reports `24 passed`, including the README field check T008 added.
- `find .skilled/skills/system-skill-advisor/manual-testing-playbook -mindepth 2 -name '*.md'` counts 50 files, matching the playbook sentence and the suite.
- `git log ec1869dae8..HEAD -- scorer-eval-baseline.json` names `1ca14a4498`, the holdout retirement commit, and `capturedAtSha` names its parent `11f3a30814`, so the baseline is a working-tree recapture of the same change.

## Edge Cases

- The bridge README says `policy` and `mutating` are carried by each row, while `CommandRow` declares both optional. Every generated row carries both (54 of 54), so the sentence describes the table it documents, not the interface's loosest shape; recorded, not reported.
- The playbook says the category tree holds 50 files while the package holds 51 `.md` files under the same root; the difference is the root playbook itself, and the sentence says "category tree", so both are true.
- The baseline's `holdout_top1.total` moved from 66 to 65 while `correct` stayed 50 and the accuracy was recomputed to `0.7692`. That is consistent with retiring a row the scorer missed; the sealed row's text was never read, per the dispatch rule.

## Confirmed-Clean Surfaces

- `--row-id` with `--runtime` throws `--row-id narrows --summary only` at `score-command-transcripts.mjs:123`, matching the README.
- `lineFixture` falls back to `g2-fixture` beside the log and `armFor` maps all-started rows to `g2`, no-started rows to `pre` and a mix to `mixed_row_arms`.
- The catalog cites schema fields by name, and the named fields exist at the cited locations.
- The tests README row now describes what the playbook suite asserts.

## Ruled Out

- The holdout README disclosure is ruled out as a documentation defect: the ratchet compares `holdoutSha256` (`tests/parity/scorer-eval-baseline-ratchet.vitest.ts:248`), the baseline was recaptured in the same commit as the deletion, and `--numstat` reports 0 added and 1 deleted for the sealed file.
- The command-bridges README's field list is ruled out as stale: the suite reads the interface and asserts every name appears in the sentence.
- The playbook's absolute persistence path is ruled out as inconsistent: every sibling playbook resolves `<skill>/benchmark/reports/<dated-run-label>/` under its own skill folder, which is what this sentence names.

## Next Focus

- Dimension: security, with the caller sweep.
- Focus area: the changed functions' callers and trust boundaries, the hook reader's input handling, the doctor check consumers, and a cross-file consistency pass over the iteration findings.
- Reason: all changed prose is now checked; security is the last uncovered dimension.
- Rotation status: correctness, traceability and maintainability complete; security next.
- Blocked/productive carry-forward: doc-to-code citation checking is exhausted for this pass; do not re-enter it.
- Required evidence: caller references for `runsMarker`, `inspect`, `rowRuntimeCopies` and the changed docs; no execution path in either check; no secret material in the changed lines.

Review verdict: PASS
