# Iteration 15: the ranked recommendation table across Q1-Q5

## Focus

Consolidate every recommendation, apply the adversarial revisions, and rank by value-delivered-per-risk across the five questions. This is the input to `research.md`.

## Actions Taken

1. Re-read `steer.md`.
2. Consolidated ~30 recommendations from iterations 4-14; merged overlaps (R4.2+R8.4+R6.5 archive-contract docs; R8.1+R8.2 doctor wiring); applied all revisions from iteration 14.
3. Ranked by: kills a debt source > makes healing discoverable > hardens what this branch shipped > closes gate gaps > docs/consistency.

## Findings

1. The strongest finding of the lineage: every hardening need the branch exposes already has a shipped mechanism that solves most of it - upgrade-legacy (orchestration), repair-derived (derived facts), heal-spec-docs (proven defaults), the baseline file (recorded debt), the pinning vitest (drift defense), the remint hook (commit-time metadata), the regression gate (PR), the weekly sweep (corpus census). The gaps are coverage seams and two honest defects, not missing architecture. CONFIRMED [SOURCES: all files cited in iterations 4-13]
2. Two defects are confirmed wrong-by-construction: (a) the CI rebuild commits 1 of the 4 tracked artifacts its generator writes (silent sidecar drift), and (b) the spec template's conditional double `/ANCHOR:questions` emits an orphaned close on renders that include both gates. Both produce wrong output with green checks. CONFIRMED [SOURCE: trigger-index-rebuild.yml:44-52 + generate-trigger-index.mjs:371-381; spec.md.tmpl:399,425 + spec-doc-structure.ts:634-635]
3. Ranking principle adopted: a fix that stops NEW instances of a failure class outranks a fix that heals more old ones - sources beat sinks because sinks already exist (upgrade-legacy heals; nothing stops the template). CONFIRMED as judgment applied to the table

## Ruled Out (cumulative)

- Auto-repair inside /doctor:update apply (boundary); corpus step inside release-update.cjs (engine scope); whole-corpus validation per PR (cost); strict-pass-freshness as a merge gate (documented design); mandatory clean-tree gating (would block real repairs); fail-closed pre-commit validate without dist; unconditional skeleton writes; App-token as the required fix; shipping scratchpad scripts as-is; normalizing marker style in old packets (MIGRATION.md:40).

## Dead Ends

- `scratchpad/detail/` empty; lib/corpus.mjs lives under retrieval/lib; both recorded and resolved.

## Ranked Recommendations (final)

| Rank | ID | Recommendation | Q | Where it lives | Effort | Risk | Evidence | Standing |
|------|----|----------------|---|----------------|--------|------|----------|----------|
| 1 | F-01 | Fix the ANCHORS_VALID source: emit exactly one `/ANCHOR:questions` closer per level in spec.md.tmpl + add a render-per-level vitest asserting the anchor-stack contract | Q2, Q4 | templates/core/spec.md.tmpl + tests | S | Low | spec.md.tmpl:399/425; spec-doc-structure.ts:634-635 | CONFIRMED defect |
| 2 | F-02 | Commit all four artifacts in the rebuild job (index + 3 fixture sidecars), `set -euo pipefail`, post-commit `git status` verify | Q4 | trigger-index-rebuild.yml | S | Low | workflow:44-58; generator:371-381 | CONFIRMED defect |
| 3 | F-03 | Wire corpus healing into /doctor:update: a `corpus_drift` battery check (dry-run `upgrade-legacy`, approved `--apply` repair) + next-steps routing in check | Q3 | doctor-update-{apply,check}.yaml + presentation | M | Low-Med | apply.yaml:146-198 slot; zero current references | CONFIRMED gap |
| 4 | F-04 | Compare failing-RULE sets not verdicts in changed-packet job: block on added rules (worsening) even when base already failed | Q5 | changed-packet-validation.yml | S | Low | yml:139-146 verdict-only | CONFIRMED gap |
| 5 | F-05 | Activate the weekly ratchet: pass `--baseline` (previous artifact) to strict-pass-freshness so regression/new-failure surface | Q5 | strict-pass-freshness-report.yml | S | Low | sweep tool:20-32,90-96 unused flag | CONFIRMED gap |
| 6 | F-06 | Add description.json `specFolder` repair to repair-derived (derived-from-disk, atomic write, NO FIELD reports) - it feeds completion-state resolution, not just validation | Q1 | repair-derived.cjs | S | Low-Med | fix-specfolder.mjs spec; completion-state.cjs:67-76 | CONFIRMED gap |
| 7 | F-07 | Repo-era detector (`upgrade-legacy --detect` or spec/repo-era.mjs): layout + marker census + generated-metadata presence + strict-fail count in one JSON, consumed by doctor check | Q3 | new module + check YAML | M | Low | four scattered signals (iter 9) | INFERRED design |
| 8 | F-08 | Port fix-dup-anchors triage to a heal-anchors module inside upgrade-legacy's doc-edit phase | Q1 | new module + upgrade-legacy | M | Med (marker surgery) | fix-dup-anchors.mjs:1-89; upgrade-legacy:378-415 | CONFIRMED fit |
| 9 | F-09 | Implement lane-playbook mechanical rules in heal-spec-docs: repoint-or-unlink, archive-aware continuity placeholders, impl-summary status follows spec.md, generic-phrase rewrite | Q1 | heal-spec-docs.cjs + HEALING.md | M | Med | batch-01.task rules 4-7 | CONFIRMED contract |
| 10 | F-10 | Document the shipped archive contract (validated+baselined, never repaired; census includes archives) in README-repair-derived + MIGRATION.md; resolve the phase-013-vs-freeze contradiction | Q2, Q3 | two docs | S | Low | iter 6 finding 4; iter 8 finding 5 | CONFIRMED conflict |
| 11 | F-11 | Extend cleanup/census to the nine add-on doc kinds with per-kind seed recipes + extend the three-way vitest pin | Q4 | phrase tools + judge + create.sh + test | M | Med | 9 uncovered templates (iter 11) | CONFIRMED gap |
| 12 | F-12 | Reconcile Gate 3 wording: render menus from GATE_3_CHOICE_* constants or rename them to what they are | Q4 | spec-gate-core.mjs + test | S | Low | 3 wordings coexist (iter 11) | CONFIRMED divergence |
| 13 | F-13 | Pre-commit structural check: `validate --strict --no-recursive` on staged packets when <=~20 AND validator dist is fresh; warn-and-pass otherwise | Q5 | git-hooks/pre-commit | M | Med (latency + dist coupling) | no structural gate exists (iter 13) | REVISED, CONFIRMED gap |
| 14 | F-14 | Rebuild job robustness: build at branch tip not event sha (`ref:` or pull --rebase), distinguish non-FF from auth in the push error, let workflow_dispatch bypass the subject guard | Q4 | trigger-index-rebuild.yml | S | Low | stale-event race (iter 10) | CONFIRMED |
| 15 | F-15 | `--reconstruct` verify-then-keep: write a missing required doc only when it validates; else record FILE_EXISTS in upgrade-baseline.json | Q1, Q3 | healer + upgrade-legacy | M | Med | batch rule 3 + sufficiency risk | REVISED |
| 16 | F-16 | Sibling-inheritance in fill-frontmatter: copy missing importance_tier/contextType from the packet's spec.md before template defaults | Q1 | upgrade-legacy.mjs | S | Low | add-fm-fields.mjs advantage | CONFIRMED |
| 17 | F-17 | Grouped-detail report mode on upgrade-legacy (`### folder / x RULE`) so campaigns need no scrape scripts; promote citecheck.mjs to a permanent lineage linter | Q1, Q5 | upgrade-legacy + new lint module | S | Low | val-detail.sh usage; citecheck.mjs | CONFIRMED residual |
| 18 | F-18 | Docs hygiene pack: narrow `.opencode/specs` write-blessing on v3 checkouts (write-recipe:55), staleness `--auto-upgrade` gated to anchor-proven docs, PAT scope/rotation documented, corpus-commit discipline recipe documented | Q3, Q4 | 4 docs | S | Low | iter 9 finding 6; iter 5 finding 3; iter 10 finding 5; iter 12 finding 1 | CONFIRMED |

Cross-cutting invariants every mutating item keeps: dry-run first, atomic or verify-gated writes, structure-only edits (no prose changes, no invented history), recorded-not-erased residual debt.

## Assessment

- New information ratio: 0.4 (consolidation iteration; value is ranking not discovery)
- All five questions answered with evidence; 18 ranked recommendations emitted.

## Reflection

- The table deliberately puts two S-effort source fixes above every M-effort healing investment: they are the only items that stop the corpus from re-growing the same debt.

## Recommended Next Focus

phase_synthesis: write `research.md` with this table, update findings-registry keyFindings, dashboard, resource-map, and append the `deep_research.synthesis_complete` record with `stopReason: "maxIterationsReached"`.
