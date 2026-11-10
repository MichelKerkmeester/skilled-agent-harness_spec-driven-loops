# Iteration 10: Broaden Verification — Fleet-Wide Verify Breadth and the Gate Removal Precondition (Final Consolidation)

## Focus

"Broaden: verify remaining evidence gaps" — executed as the two gaps iteration 9 left open, resolving into the consolidation it requested: (a) extend `verify` execution from the 5 measured skills to the 9 remaining skill dirs, closing the topic's first clause ("exit 1 on every skill it checks") at fleet scale; (b) re-read the gate's failure branches to price Q4's removal option — what happens to the once-green gate when the per-doc `version` line is deleted; (c) assemble the single decision record for the fix phase, now with fleet-scale anchors and the removal precondition. This is the terminal iteration under the max-iterations stop policy; no new key question was opened.

## Actions Taken

1. Read state: `deep-research-config.json`, `deep-research-strategy.md`, the state-log projection (9 iteration records + iteration-10 start sentinel), `findings-registry.json` (0 open questions, 34 ruled-out directions, 5/5 resolved), `iterations/iteration-009.md`, `iteration-007.md`, `iteration-006.md`. Boundary check: `iterations/iteration-010.md` and `deltas/iter-010.jsonl` absent before writing.
2. Executed `verify --skill <name>` for the 9 previously unmeasured skill dirs in one loop, capturing each exit code and the engine's aggregated summary (`[verify] N files | ... ok=M ... skip-no-frontmatter=K`); per-doc mismatch counts derive as files − ok − skip.
3. Re-read the engine's argument parsing, gate block, classify, and verify-helper paths for the negative branches: gate skips frontmatter-less docs [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:408], fails a version-less frontmatter doc as `FAIL:missing` [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:409], fails malformed values as `FAIL:malformed` [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:410], under the gate comment "every in-scope file must carry a 4-part version" [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:397-398]; the gate/verify validation-switch call [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:393] and the switch behavior [SOURCE: .skilled/skills/sk-doc/shared/scripts/validation-switch.cjs:64-72].
4. Read iteration 006's Q4 decision text and iteration 007's Q2 decision text in full so the consolidated record carries the exact answers [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:28-32] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-007.md:26].
5. Wrote `deltas/iter-010.jsonl` (19 rows: canonical record + 5 findings + invariant + observation + 6 graph nodes + 3 graph edges + 2 ruled-out rows). Staged the single-record file `/tmp/iter-010-record.json` for the append gateway (identical to delta line 1); the gateway run and the required verify-iteration check execute as the iteration's closing step.
6. Skipped `research/research.md`: progressive synthesis is enabled, but the dispatch's allowed-write list contains only the iteration narrative and the delta file, so synthesis stays with the workflow (same rationale as iterations 8-9).

## Findings

1. **Verify is red across the entire fleet: 14/14 skill dirs exit 1; 2,798 of 2,909 in-scope docs flagged (96.2%).** New this pass: cli-classifier 47/49; cli-external-orchestration 424/433; cli-orca 29/30; mcp-code-mode 42/43; mcp-tooling 559/569; sk-design 189/200 (+2 skip-no-frontmatter); sk-vision 46/47; system-deep-loop 440/444; system-spec-kit 199/207 (+1 skip). Every invocation EXIT=1. Combined with the 823 flags measured across 5 earlier skills (713 in iteration 6 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:11]; 36 sk-prompt + 74 sk-git in iteration 9 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-009.md:23]), the topic's first clause holds fleet-wide. Count reconciliation: 2,022 files this pass + 887 from iterations 6/9 = 2,909 — the fleet gate denominator [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-009.md:19]. No skill verifies green. New — first verify execution outside the 5 measured skills.

2. **The gate's FAIL:missing branch pins Q4's removal precondition: deleting the per-doc version from in-scope docs turns the green gate red unless the rule itself changes.** Gate mode fails any in-scope doc whose frontmatter lacks a version line [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:409]; frontmatter-less docs skip [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:408]; malformed values fail [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:410]; the gate's stated contract is that every in-scope file carries a 4-part version [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:397-398]. Iteration 6's option (a) ("remove the field from child doc classes... the enforced contract then applies to `SKILL.md` alone and stays green by construction") [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:29] is therefore incomplete as priced: the same change must also delete or narrow the gate branch at :409 (and/or shrink the engine's scope definition [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-007.md:20]), or every child doc flips gate-red. This is the single most decision-relevant gap closed this iteration. Partially new — presence/format semantics were cited before; the removal consequence and the exact branch were not.

3. **Stored-side aggregates corroborate stale mint epochs at fleet scale; template-default snapshots dominate several skills.** Verify's aggregate line groups mismatches as `stored!=derived` with counts: sk-vision 32 of 46 flags are stored `1.0.0.0` vs derived `0.3.0.x`; cli-orca 28 of 29; cli-classifier stores `0.1.0.x` against derived up to `0.8.0.x`; system-spec-kit stores `1.0.0.0`/`1.6.0.x` against derived `2.7.0.x`; cli-external-orchestration stores `1.4.0.2-.5` against a spread of derived values. Consistent with iteration 6's era-dominance (574 of 713 = 80.5%) [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:11] and the registry's template-literal field origin (finding-4-4). Partially new — breadth instance of the era-dominance finding; the template-default pattern is new at fleet scale.

4. **Gate and verify honor an operator validation switch that exits 0 with `validation skipped`; it was off for every invocation in this run.** `exitIfValidationOff` runs before gate/verify work [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:393]; when the switch is on it prints `validation skipped, <switch> is on` and exits 0 [SOURCE: .skilled/skills/sk-doc/shared/scripts/validation-switch.cjs:64-72]. Empirical status: all 14 gate and 14 verify invocations in this run executed and reported file counts, so the switch is off in this working tree; the "green fleet-wide" enforcement claim is conditional on it staying off. New — not previously cited.

5. **Synthesis — the single decision record (the run's terminal consolidation).** (a) **Q1 (why exit 1):** rule and derivation are faithful; stored values are stale snapshots; `W` is self-invalidating (stored==derived is non-convergent by construction); nothing automated runs `verify` — exit 1 on every skill is the expected steady state of an unenforced, non-convergent invariant, not a fault and not a missing rule. (b) **Q2 (external author):** at most the skill era; its carriers (`SKILL.md`, changelog) ship in the package; per-doc `X.Y` is re-derivable from shipped files, `W` irreproducible without git, `Z` vacuous [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-007.md:26]. (c) **Q3 (smallest green-by-construction contract):** presence + 4-part format on in-scope docs, enforced by the post-edit gate — already green fleet-wide (2,902 ok, 7 skips, 0 failures [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-009.md:19]); do not assert stored==derived; no new CI job, generator, or reconciliation loop. (d) **Q4 (should the field exist):** no as an asserted per-doc invariant; keep `SKILL.md`; remove from child classes — now carrying the gate-branch prerequisite of Finding 2 — or at most retain an era-only stamp [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:28-32]. (e) **Fix-phase prerequisites:** the gate-branch edit, template rows, the changelog scope divergence (packager vs engine [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-007.md:20]), the 7 frontmatter-less skips, the underscore-form scope asymmetry (0 live [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-009.md:25]), and this pass's validation-switch caveat. [INFERENCE: consolidation from the findings registry, iterations 5-9, and this pass's executions.]

## Ruled Out

- **A live fixture probe of the FAIL:missing branch** (a scratch skill tree under `/tmp` fed to `gate --skills-root`). Rejected: it would create files outside the allowed-write list; the direct code citation at :408-410 is sufficient and the branch is unambiguous.
- **Re-running the fleet gate.** Already executed green across 14/14 dirs in iterations 8-9 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-009.md:19]; this pass extended verify breadth instead.

## Dead Ends

- None of iterations 1-9's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:131-302].
- No new elimination candidate. The validation-switch escape hatch is an operational caveat, not a dead end.

## Edge Cases

- Ambiguous input: none material — "broaden" was resolved to the two gaps iteration 9 named.
- Contradictory evidence: none. Stored-above-derived cases (cli-orca, sk-vision) are consistent with template defaults, not a contradiction.
- Missing dependencies: none.
- Partial success: none; 9/9 verify invocations completed. Evidence-hygiene note: the shell's `grep -c FAIL` includes the summary line itself, so all per-skill mismatch counts in this narrative use the engine's own summary arithmetic (files − ok − skip), which reconciles for every skill.

## Questions Answered

- None newly at the key-question level (Q1-Q5 remain resolved [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:63-67]). The breadth meta-question closes: gate green 14/14 dirs; verify red 14/14 dirs — both halves of the topic now hold at fleet scale.

## Questions Remaining

- None. This is the terminal iteration (max-iterations stop policy); the consolidation is complete.

## Sources Consulted

- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` (362-376, 393, 397-398, 408-410)
- `.skilled/skills/sk-doc/shared/scripts/validation-switch.cjs` (64-72)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md`, `iteration-007.md`, `iteration-009.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md`, `findings-registry.json`, `deep-research-config.json`, `deep-research-state.jsonl`
- Command outputs: `verify --skill` for 9 dirs (EXIT=1 each; totals 2,022 files, 1,975 mismatches, 44 ok, 3 skip); record/delta staging (19 delta rows)

## Assessment

- New information ratio: 0.85 — (2 fully new + 0.5 × 2 partially new) / 4 = 0.75, plus the +0.10 simplicity credit for the consolidated decision record. Fully new: fleet-wide verify breadth; validation-switch semantics. Partially new: removal precondition; fleet-scale stale epochs. Redundant: none; synthesis counted in the credit, not double-counted.
- Questions addressed: the breadth meta-question; the removal-option pricing for Q4.
- Questions answered: none newly at the key-question level.

## Reflection

- What worked and why: executing breadth, not trusting the sample. Nine verify invocations in one loop (~1 tool call, a few minutes) converted "5/5 measured red" into "14/14 fleet red, 2,798 of 2,909 flagged", and the file-count reconciliation (2,022 + 887 = 2,909) matched iteration 9's independent gate denominator — two measurements agreeing on the same universe. Second: re-reading the gate block line-by-line before endorsing "delete the field stays green". Iteration 6 cited the same range [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:29] but read the positive path; the negative branches (:408-410) are what price the fix, and they change "delete the field" from a docs-only edit into an engine+docs change.
- What did not work and why: nothing failed. Two limits to the evidence: the switch's activation key was not read (behavior verified at :64-72 only), and the verify summary's per-doc counts had to be derived arithmetically (files − ok − skip) because the aggregated groups do not list per-file lines.
- What I would do differently: when a prior iteration cites a line range as support for "stays green by construction", re-read the range for its negative branches (what fails) before endorsing the conclusion — removing an input often trips a branch that the positive-path read steps over.

## Recommended Next Focus

Terminal iteration: no further research. Hand-off to the fix phase with the decision record in Finding 5. The sequencing constraint that matters most: any change that removes the `version` field from child docs must land together with the gate-branch/scope change in `frontmatter-version.mjs` [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:409] — otherwise the fleet-wide green gate flips red in the same commit. All other items are independent and safe to schedule alone.

## SCOPE VIOLATIONS

None. All writes stayed inside the allowed paths (`iterations/iteration-010.md`, `deltas/iter-010.jsonl`, and the gateway's own writes via `/tmp/iter-010-record.json`). No repository file was created or modified by any execution; the verify loop captured output in-shell only; the considered `/tmp` fixture probe was rejected before execution; no banned operation ran.
