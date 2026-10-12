# Iteration 10: Adversarial re-verification of rounds one and two

## Focus
Re-open every finding and recommendation recorded in iterations 1-9 of this lineage plus round-one claims F10, F18, F19, F20 in `research/research.md`; re-read each cited line against the current tree, drop or correct what does not hold, and settle the carried-forward open questions. COPY_B registry-scrub probe was the one item flagged "if budget allows"; it was not run (12-call budget consumed by verification reads plus the three required artifacts).

## Actions Taken
- Read `deep-research-config.json`, `findings-registry.json` (all 9 iterations' ruled-out rows and carried-forward questions), and `research/research.md` in full (lines 1-183).
- Re-read `.skilled/skills/sk-code/ROUTER.md` lines 38-44 and 345-395 (the §11 `RESOURCE_MAP` projection contract and the IMPLEMENTATION list).
- Grepped `.skilled/bin` for `z_archive|authored-drift|authored_path|authoredPath` (8 hits in 4 files) and read `.skilled/bin/compiled-route-sync.cjs:760-772` (the closure-trace entry that F19/F20 depend on).
- Grepped `create-skill-parent-confirm.yaml` for `surfaces|description.json|SKILL.md` (32 hits) and read the update-branch contract lines (452-495).
- Grepped `parent-skill-check.cjs` for the F18 leg labels; `3d-files` and `5k-canary` confirmed in-tree.

## Findings

| Class | Claim | Evidence | Sev |
|-------|-------|----------|-----|
| OK | F10 holds. §11 `RESOURCE_MAP` IMPLEMENTATION lists ~17 `sk-code-webflow` leaves against ~8 `sk-code-opencode` + 1 `shared/` leaf; the projection contract (evidence surfaces folded into the shared intent union) is unchanged. Stack-agnostic intents remain Webflow-dominated; deleting webflow still guts them. | [SOURCE: .skilled/skills/sk-code/ROUTER.md:41], [SOURCE: .skilled/skills/sk-code/ROUTER.md:353-380] | P2 |
| OK | F20 holds, with a sharper anchor than rounds one/two cited. The authored closure root is hard-coded as `CURRENT_LAYOUT` segments `'specs','sk-doc','z_archive','019-skill-routing-refactor','015-router-unification-program'`; `serving-closure.manifest.json` records the same `generatedFrom`; the guard's `authored-drift` leg and `check-no-spec-imports.cjs`'s spec-path regex both key on it. | [SOURCE: .skilled/bin/lib/compiled-route-layout.cjs:54], [SOURCE: .skilled/bin/lib/compiled-routing/serving-closure.manifest.json:3], [SOURCE: .skilled/bin/compiled-route-guard.cjs:70], [SOURCE: .skilled/bin/compiled-route-guard.cjs:162], [SOURCE: .skilled/bin/check-no-spec-imports.cjs:53], [SOURCE: .skilled/bin/check-no-spec-imports.cjs:76], [SOURCE: .skilled/bin/check-no-spec-imports.cjs:137] | P1 |
| OK | F19 holds with nuance. `compiled-route-sync.cjs:764-766` resolves `path.join(sourceRoot, CURRENT_LAYOUT.resolver)` and throws `authored resolver missing at ${authoredResolver}` when the authored tree is absent — this is the sync-side failure the iteration-3 refinement predicted (real dependency = sync trace/`--check` + guard authored-drift, not mint). Nuance: line 766 is the *thrown* error in the closure-trace helper, not a printed remediation string; round one's citation shape ("message at :766") is imprecise but the mechanism and consequence are correct. | [SOURCE: .skilled/bin/compiled-route-sync.cjs:764-766] | P1 |
| OK | F18 mechanism holds (not re-executed). The five cited doctor legs exist in the current tree — `3d-files` softFails on missing companion/changelog files, `5k-canary` softFails on unreadable fixture. The copy-run result itself (gate exit 1 at 5k-canary, tieBreak-last placement) is carried from iteration 2's observed run; re-running was ruled out in iteration 9 and stays ruled out — a copy run re-observes what is already measured. | [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:567], [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:572], [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:577], [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:736], [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1273], [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1281] | P1 |
| ORDER | Carried-forward question settled: `update --surfaces` DOES rewrite the hub SKILL.md and description.json. The confirm YAML's update contract performs "Extract the hub SKILL.md, registry, hub-router, root router, description, and hub graph-metadata contracts", then "Create or update the thin hub SKILL.md (routing only)" and "Create or update description.json from parent_skill_description_template.json"; surfaces are generated as bare-noun evidence-base packets with their own SKILL.md/README/changelog. So the F18 residual gap is in `tieBreak` placement, leaf-manifest/canary data and registry legs — not missing SKILL.md or description.json writes. | [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:452], [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:460], [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:464], [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:467] | P1 |
| OK | No round-two ruled-out row was falsified by this pass. Spot-checks against the registry: `compiled-route-layout.cjs` confirms the mint-writes-runtime/sync-reads-authored split (iteration 3 ruled-out row stands); `parent-skill-check.cjs` legs confirm iteration 2's observations stand. | [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/swe2max-devin/findings-registry.json:190-352] | P2 |

## SCOPE VIOLATIONS
None. All writes stayed inside the lineage artifact directory; the COPY_B probe was skipped rather than executed half-budgeted.

## Questions Answered
- Whether `update --surfaces` rewrites the hub SKILL.md mode table and writes `description.json` keywords for a new surface: **yes for both files** (confirm YAML :460, :464, :467); the five-leg residual is placement/manifest/canary/registry, per iteration 2's observed gate exit.
- F20 refinement (carried from iteration 3): **confirmed** — sync's `CURRENT_LAYOUT.resolver` join at `compiled-route-sync.cjs:764-766` and the guard's `authored-drift` leg are the specs/ dependency; mint is not.
- F10, F18, F19, F20 re-check: **all hold**; the only correction is citation shape on F19 (:766 is a thrown error, not a printed string).

## Questions Remaining
- Whether a registry-scrubbed copy heals the debug-intent defer (COPY_B probe; carried from iteration 8, unrun again — out of budget).

## Dead Ends / Ruled Out
- Re-running the F18 add-surface copy probe — re-observes iteration 2's measured result; reading the workflow YAML settled the contract question more cheaply (consistent with iteration 9's ruled-out row `842d5a30983c`).

## Edge Cases
- Ambiguous input: none — the focus named the exact claims to re-open.
- Contradictory evidence: none found; one citation-shape imprecision on F19 recorded above.
- Missing dependencies: COPY_B probe not executed (budget); recorded as remaining, not as failure.
- Partial success: verification covered all named claims; only the optional COPY_B experiment lapsed.

## Sources Consulted
- `.skilled/skills/sk-code/ROUTER.md:38-44`, `:345-395`
- `.skilled/bin/lib/compiled-route-layout.cjs:54`
- `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json:3`
- `.skilled/bin/compiled-route-guard.cjs:70`, `:162`
- `.skilled/bin/compiled-route-sync.cjs:760-772`
- `.skilled/bin/check-no-spec-imports.cjs:53`, `:73`, `:76`, `:137`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:567-577`, `:736`, `:1273-1281`
- `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:452-495`
- `research/research.md:1-183`; `findings-registry.json` (this lineage)

## Assessment
- New information ratio: 0.75 (2 fully new: `compiled-route-layout.cjs:54` authored-path anchor; confirm-YAML update-branch lines settling the carried question. 2 partially new: F10 and F18/F19 mechanism re-verifications on the current tree.)
- Questions addressed: F10/F18/F19/F20 re-verification; the two code-level carried-forward items.
- Questions answered: the `update --surfaces` contract question; the F20 refinement.

## Reflection
- What worked: targeted greps for the exact tokens (`z_archive`, leg labels, `surfaces|description.json`) located every anchor in two commands, and the single wide `sed` read covered both ROUTER.md ranges. Verification-by-reread is cheap when the cited lines are precise.
- What did not work: nothing failed; the COPY_B experiment simply did not fit the 12-call budget beside three mandatory artifacts.
- What I would do differently: for a final verification pass, front-load the write path scaffolding so one probe call remains free for the residual experiment.

## Recommended Next Focus
Converged. If a successor iteration is minted, the single open item is the COPY_B registry-scrub + re-mint probe for the debug-intent defer question; everything else in the lineage's finding set verified clean against the current tree.
