---
title: "Deep Review Iteration 013 — feature catalog and playbook capability"
trigger_phrases: []
---

# Iteration 13: Traceability — `feature_catalog_code` and `playbook_capability`

## Focus

Dimension: **traceability** (overlay protocols). Slice: catalog entries and manual-testing
scenarios that describe this lineage's areas — the severity system's verdict and claim-adjudication
entries, the fan-out strongest-restriction scenario, and the fan-out scenario command sequences
against the tests they name.

## Files Reviewed

- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/verdicts.md`, `claim-adjudication.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-strongest-restriction.md`
- `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/{fanout-salvage-recovery,fanout-pool-concurrency-cap,fanout-run-cli-lineage-spawn,fanout-merge-research,fanout-merge-review-strongest-restriction,artifact-dir-override-parity}.md` (command blocks)
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/{fanout-cli-lineages-review,fanout-single-executor-parity-review}.md` (command blocks)
- `runtime/tests/unit/fanout-merge.vitest.ts` (test-name inventory), sibling scenarios that use the correct command form (controls)

## Findings

### P0 Findings

None.

### P1 Findings

None new. Carried: F001 and F002 remain active (unchanged this iteration).

### P2 Findings

- **F008**: Nine fan-out playbook scenarios name a test path that does not exist, so their exact command sequence cannot produce the result they demand — `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-salvage-recovery.md:52` — The scenarios instruct `cd .skilled/skills/system-spec-kit/runtime && npx vitest run ../../runtime//tests/unit/<file>`. From that working directory, `../../runtime/` resolves to `.skilled/skills/runtime/`, which does not exist on disk; the named test files live at `.skilled/skills/system-deep-loop/runtime/tests/unit/`. Affected scenarios (all with the same defect): `fanout-salvage-recovery.md:52`, `fanout-pool-concurrency-cap.md:49`, `fanout-run-cli-lineage-spawn.md:51`, `fanout-merge-research.md:49`, `fanout-merge-review-strongest-restriction.md:49`, `artifact-dir-override-parity.md:54` (runs `../../runtime//tests/unit/`), plus the deep-review set `fanout-strongest-restriction.md:49`, `fanout-cli-lineages-review.md:55`, `fanout-single-executor-parity-review.md:53`. Sibling scenarios use the correct base (control: `fanout-config-schema.md:49` and `deep-research/…/fanout-cli-lineages-research.md:54` run `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/…`), and the named tests do exist there (`fanout-merge.vitest.ts`, `fanout-pool.vitest.ts`, `fanout-run.vitest.ts`, `fanout-salvage.vitest.ts` verified on disk). Consequence: an operator replaying one of these scenarios cannot obtain the PASS evidence the scenario demands (its named test file is not reachable by the command as written). Provenance: the lines arrived with the Sep 17 `refactor(source-root): name .skilled across the deep-loop skill` commit (`e14d5b196b7`) and are present in the `v4.0.0.3` blob, so the release ships them; the tests themselves are unaffected and CI runs them from their real paths.

  Finding class: `instance-only`
  Scope proof: Enumerated every `system-spec-kit/runtime && npx vitest run ../../runtime` occurrence under the deep-loop skill (nine files), resolved the relative path from the stated working directory, confirmed `.skilled/skills/runtime` is absent, confirmed the four named test files exist at the deep-loop path, and read two correct-form controls.
  Affected surface hints: [`.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/`, `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/`]

## Claim Adjudication

No new P0/P1; F008 is an advisory with an enumerated blast radius and an on-disk negative plus a positive control.

## Traceability Checks

### `feature_catalog_code`

| Claim (catalog) | Status | Evidence |
|-----------------|--------|----------|
| Verdict mapping: FAIL on active P0 or failed gate; CONDITIONAL on active P1; PASS only with zero P0/P1, advisories when P2 remains (`severity-system/verdicts.md`) | pass | `fanout-merge.cjs:889-901` derives exactly this; the cross-lineage FAIL is the merge owner. |
| Claim adjudication requires a typed packet per new P0/P1 and writes a `claim_adjudication` event (`severity-system/claim-adjudication.md`) | pass | The agent contract's field list matches the packets this lineage writes (F001-F007 carry claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger), and the template lineage's state log carries the event. |
| The severity scale is exactly three tiers; an out-of-scale rating collapses and cannot raise a verdict (`severity-system/*`) | pass | `SEVERITY_RANK` has three entries (`fanout-merge.cjs:29`) and unranked severities are reported with an explicit note that they cannot raise the merged verdict (`:905-916`). |

### `playbook_capability`

| Scenario group | Status | Evidence |
|----------------|--------|----------|
| Fan-out test scenarios' expected signals | pass on content | Strongest-restriction scenario's signals match source: `SEVERITY_RANK` (`fanout-merge.cjs:29`), active-disposition guard (`:843-847`), verdict derivation (`:889-901`); all five test names it requires exist (`fanout-merge.vitest.ts:579-685`). |
| Fan-out test scenarios' command sequence | fail (F008) | Nine scenarios name an unreachable test path; correct-form controls exist. |

## Ruled Out

- "The strongest-restriction catalog/scenario claims drifted from the implementation": ruled out — every named signal resolves in the source, and the five required tests exist under their stated names.
- "The correct command form is nowhere in the tree": ruled out — two control scenarios use the deep-loop working directory with repo-relative test paths, which is the form the nine broken scenarios would need.

## Dead Ends

- Executing one scenario end to end via vitest: not attempted — the runner writes caches and fixtures outside the lineage; the path resolution and file existence are the observed facts, and the runner's own filter semantics are not needed to show the named path is absent.

## Assessment

- New findings ratio: 1.0 (one new P2; weighted new = weighted total = 1)
- Dimensions addressed: traceability (overlay protocols closed)
- Novelty justification: this pass checked catalog claims against code and playbook commands against the filesystem. The catalog claims hold; the playbook command block broke in nine places when the tree was renamed, and the negative and positive controls make the finding precise.

## Next Focus

Dimension: maintainability / broadening. Focus area: re-verify every carried finding's citation against the current tree (a correction here is a refinement, not a new finding), patch the strategy's exhausted-approach list, and sweep the remaining unreviewed manifest slices for comment-hygiene violations in changed files. Required evidence: each citation re-read; each comment-hygiene claim paired with a search control.

Review verdict: CONDITIONAL
