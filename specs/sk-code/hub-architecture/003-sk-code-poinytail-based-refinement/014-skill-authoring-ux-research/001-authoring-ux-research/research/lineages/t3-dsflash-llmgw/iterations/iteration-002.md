# Iteration 2: E1 wide — route manifests, Hermes copies, trigger index, router vocabulary

## Focus
E1 widened from iteration 1's leaf slice: hub-router.json / mode-registry.json versus SKILL.md and ROUTER.md, the compiled-route manifest guard, the Hermes copies, the trigger index, and the router-vocabulary carry generator. Question: which of these artifacts already has a prevention point, which only has an after-the-fact check, and which has no routine check at all.

## Actions Taken
- Read compiled-route-manifest.cjs, the manifest library's input hashing, and compiled-route-guard.cjs; ran the guard (read-only).
- Read sync-skills-hermes.cjs check mode and ran it --check (the code writes nothing in check mode).
- Read generate-trigger-index.mjs check mode and ran it --check (documented and coded as write-nothing); captured the true exit code.
- Read the trigger-index CI rebuild workflow.
- Read generate-router-intent-signals.cjs and ran its --check; ran ci-skill-derived-freshness.cjs.
- Read the 010 and 011 goal.md orchestrator-step logs for the manual re-mint checklist evidence.

## Findings
1. [VERIFIED] The compiled-route manifest CLI has three verbs — mint, refresh, freshness — and returns 0 only when the manifest is valid AND fresh. Its inputs are the hub's SKILL.md, hub-router.json and mode-registry.json. [SOURCE: .skilled/bin/compiled-route-manifest.cjs:29-30,110-121] [SOURCE: .skilled/bin/lib/compiled-route-manifest.cjs:436-462]
2. [VERIFIED] compiled-route-guard.cjs separates three failure reasons — stale-manifest (serving legacy now), authored-drift (runtime and authored copies disagree; a rebuild would revert), inputs-do-not-compile — and prints the re-mint targets. Ran it: all 7 hubs `fresh`, exit 0. [SOURCE: .skilled/bin/compiled-route-guard.cjs:4-19,97-116,146-165]
3. [VERIFIED] The route-manifest slice of E1 is already prevented at commit time in this repo: the pre-commit route-remint gate detects staged hub routing inputs, re-mints, copies runtime to authored, `git add`s both, proves both reached the index, and blocks otherwise. Its comment records the cost of the previous after-the-fact check ("It has cost one twice"). [SOURCE: .skilled/scripts/git-hooks/pre-commit:352-370,439-549]
4. [VERIFIED] Hermes copies have the same shape one level down: sync-skills-hermes.cjs --check byte-compares 70 generated skill copies, prints PASS/DRIFT/STALE and exits 1 on drift; the pre-commit mirror-parity gate runs that check on every commit. Ran it: `PASS: 70 Hermes skill copies in sync`, exit 0. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:231-261] [SOURCE: .skilled/scripts/git-hooks/pre-commit:259-267]
5. [VERIFIED] The trigger index is stale right now: `--check` exits 1 with 5 stale documents, every one of them this research packet's own docs (goal.md, implementation-summary.md, plan.md, spec.md, tasks.md) missing from the committed index; the repair command is named in the report. The check writes nothing. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:33-41,506-570] (ran: TRUE_EXIT=1)
6. [VERIFIED] Trigger-index drift is healed only after merge: the CI rebuild workflow runs on push to main or skilled/**, regenerates the index plus its sidecars, and commits them; the PR-side check can only report drift. A branch's new documents are therefore invisible to the committed-index retrieval surface until CI lands the rebuild. [SOURCE: .github/workflows/trigger-index-rebuild.yml:1-10,30-75]
7. [VERIFIED] A second live drift instance sits in the advisor vocabulary carry: `generate-router-intent-signals.cjs --check` reports RESULT: FAILED, exit 1 — cli-classifier declares 27 multi-word phrases in its ROUTER.md INTENT_SIGNALS but its graph-metadata.json carries 10 (23 missing); the other six hubs pass. The generator's --write appends the missing phrases; no routine check or hook runs it (searched doctor routes, workflows, hooks: no caller). [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:1-25,74-100] (ran)
8. [VERIFIED] The graph-metadata derived block has the same generator/check pair and is green today: ci-skill-derived-freshness.cjs repairs in memory (no writes), fails on any difference, exit 0 at checked=14 fresh=14; it is wired into the routing-registry-drift CI job beside the leaf gate, and its writer regenerate-skill-derived.cjs defaults to dry-run. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:8-18,90-97] [SOURCE: .github/workflows/routing-registry-drift.yml:196-197]
9. [INFERRED] E1's artifacts fall into three prevention states, and the fix ranking follows: (a) already prevented at commit time by the auto-remint/check hook — route manifests, Hermes copies, spec metadata, graph-metadata derived (via CI), leaf only if the hook were extended (iteration 1); (b) check exists but is not wired to a routine gate — router intent signals (live failure today); (c) drift is healed only after merge — trigger index. The uniform root cause is that each mint is triggered by nothing when its input is edited; the uniform cheapest fix is to extend an existing commit-time surface (the route-remint block or MIRROR_CHECKS) with the already-written check, ordered by reversal cost; a per-doc daemon or a new artifact registry fails the cheaper move. For external authors none of this hook machinery exists, so their floor is the generator's own --check plus the message naming the fix — which every generator here already prints.

## Ruled Out
- Running any write-mode generator (trigger index, hermes sync, intent signals) to "fix" the two live drifts: out of scope for this lineage (writes would land outside the lineage directory); both are recorded as verified defects with their repair command instead.
- Re-verifying the iteration-1 leaf slice: excluded by the widening rule; only new surfaces were read this iteration.
- Treating the CI post-merge trigger-index heal as sufficient: rejected for branch work — the retrieval surface reads the committed index, so a branch's docs are invisible until CI lands, and the advisory PR check only reports.
- Auto-regenerating the index on every document save (watch/daemon): new dependency and process for an event the CI heal plus a commit-time check can cover; fails the cheaper move.
- A generic "derived artifact" registry abstraction to unify all five generators: fails the cheaper move while each family's check already exists and needs only a trigger; revisit if a sixth family appears.

## Dead Ends
- None eliminated this iteration; the E1 inventory is now complete across the named surfaces.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: the intent-signals check is not wired anywhere I could find; absence of a caller is evidence from search, not proof of non-existence — carried as an inference inside Finding 9.

## Sources Consulted
- .skilled/bin/compiled-route-manifest.cjs; .skilled/bin/lib/compiled-route-manifest.cjs
- .skilled/bin/compiled-route-guard.cjs
- .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs
- .github/workflows/trigger-index-rebuild.yml; .github/workflows/routing-registry-drift.yml
- .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs
- .skilled/scripts/git-hooks/pre-commit
- specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/goal.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/goal.md

## Assessment
- New information ratio: 0.90
- Questions addressed: Q1 (route manifests, Hermes, trigger index, intent signals), Q5 (hook placement)
- Questions answered: Q1 in substance — the E1 root cause is uniform and the per-surface prevention states are mapped; synthesis will answer Q1 formally.

## Reflection
- What worked and why: running the three read-only checks turned "drift is annoying" into two live defects (trigger index; cli-classifier intent signals) with named repair commands — evidence beats description.
- What did not work and why: an earlier echo-after-pipe captured tail's exit status instead of node's on the trigger-index check; re-ran with the exit read directly. Pipeline exit capture is a trap worth recording.
- What I would do differently: check the wiring of every generator first (grep for callers), because "who runs this" decided the prevention state more than the checker's quality did.

## Recommended Next Focus
Iteration 3, E2: the hub version carried in six files (SKILL.md, ROUTER.md, README.md, description.json, hub-router.json, mode-registry.json) plus the changelog file — find the bump surfaces, the parent-skill-check 13a-13d rules, the recorded evidence of the changelog-number collision between parallel branches, and whether any single command bumps all seven carriers.
