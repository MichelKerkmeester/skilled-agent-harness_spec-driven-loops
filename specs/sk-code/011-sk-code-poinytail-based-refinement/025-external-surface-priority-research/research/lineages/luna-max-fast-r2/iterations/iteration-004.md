# Iteration 4: R1 tieBreak insertion rule

## Focus
This pass narrows Q10 to R1: where the surface-order rule is written, what the scaffold changes, what the doctor checks, and whether an inserted surface wins a routing bundle after the compiled manifest and authored copy are refreshed. Q10 remains open for R2-R4 and full end-to-end coverage.

## Actions Taken
- Read the lineage config, state, strategy, registry, dashboard, and prior iteration files before selecting the focus. Q10 is the exact strategy question: "R1-R4 stress test, what exact edit text and which files does each touch, what can still break, and is each the smallest correct fix?"
- Read the create-skill parent router, confirm and auto YAMLs, README adaptation steps, nested-packet checklist, sk-code hub/README, and doctor 5e/5i implementations.
- Throwaway copy: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2-luna-max-fast-r2-i4.U3wj. cp -cR from the prepared base exited 0 and printed this path. In the copy, I moved sk-code-webflow before sk-code-opencode in hub-router.json routerPolicy.tieBreak; the resulting order was sk-code-quality, sk-code-review, sk-code-webflow, sk-code-opencode, sk-code-obsidian.
- node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code exited 0 with manifestValid:true, fresh:true, generation:2. My first manifest lookup searched for activation-manifest.json and found no match; the refresh output identified .../013-live-activation/activation/sk-code/manifest.json.
- In the second copy command, copied .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json to specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json (exit 0). The canary fixture supplied the prompt Add an integration test and unit test coverage plan for a Webflow animation, including vitest checks. The compiled route command exited 0 and returned ordered targets [sk-code-webflow, sk-code-opencode]. The result confirms bundle order; the output does not expose scores, so exact score equality remains unverified.
- The expected canary path under the surface packet was absent; recursive search found it under the prepared authored closure at specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json.
- The prepared base began with a five-mode tieBreak, while the checked-out worktree file .skilled/skills/sk-code/hub-router.json:7-11 contains only quality, review, and opencode. This contradicts the dispatch description that the prepared base is a byte copy; the run's routing result is scoped to the prepared base until that snapshot mismatch is explained.

## Findings
| class | claim | evidence | severity |
|---|---|---|---|
| ORDER | The shared parent-skill workflow writes routerPolicy.tieBreak on its create/update path and generates surface packets for --surfaces, but the generation rule says only that tieBreak must cover all modes; it does not place a user surface before sk-code-opencode. Add the same ordering sentence to confirm and auto generation. [SOURCE: .skilled/commands/create/skill-parent.md:42-47] [SOURCE: .skilled/commands/create/skill-parent.md:54-57] [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462] [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:467] [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:250] | [SOURCE: .skilled/commands/create/skill-parent.md:42-47] [SOURCE: .skilled/commands/create/skill-parent.md:54-57] [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462] [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:467] [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:250] | P1 |\n| DOC | The root adaptation step registers packets and updates the mode table but omits tieBreak placement; the nested-packet checklist describes only exact-permutation validation; sk-code SKILL.md calls tieBreak order the detection precedence, which becomes misleading after R1. The sk-code README table is an inventory and makes no precedence claim, so R1 does not need to edit it. [SOURCE: README.md:1448] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:224] [SOURCE: .skilled/skills/sk-code/SKILL.md:74] [SOURCE: .skilled/skills/sk-code/README.md:55-57] | [SOURCE: README.md:1448] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:224] [SOURCE: .skilled/skills/sk-code/SKILL.md:74] [SOURCE: .skilled/skills/sk-code/README.md:55-57] | P1 |\n| OK | Doctor 5e accepts any exact permutation and 5i only requires workflow modes to precede non-workflow modes. A user surface after sk-code-opencode can therefore pass both checks; neither leg enforces R1. [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1088] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1142-1157] [INFERENCE: the predicates contain no relative-order rule among surface modes] | [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1088] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1142-1157] [INFERENCE: the predicates contain no relative-order rule among surface modes] | P1 |\n| OK | In the prepared throwaway copy, moving sk-code-webflow before sk-code-opencode, refreshing the compiled manifest, copying that manifest to the authored closure, and routing the matching canary prompt returned both surfaces in the desired order. The route output contains both targets but does not expose scores, so exact score equality is not independently observable. Command: node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code (exit 0; manifestValid=true, fresh=true, generation=2); authored manifest copy (exit 0); node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "Add an integration test and unit test coverage plan for a Webflow animation, including vitest checks." (exit 0; targets [sk-code-webflow, sk-code-opencode]). | throwaway-copy command and exit/output recorded in Actions Taken | P2 |\n| DOC | The prior full-copy update simulation reported exact failures "mode(s) registered but absent from the hub SKILL.md mode table: [sk-code-myapp]" and "\"sk-code-myapp\": no canary case routes to it"; neither message gives a next command. For a wrong tieBreak order specifically, 5e/5i emit no failure. The R1 insertion can be one extension to the existing /create:skill-parent update --surfaces action, but this does not replace the larger integration checklist. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/iterations/iteration-002.md:17] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1384] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1273] | [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/iterations/iteration-002.md:17] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1384] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1273] | P1 |\n| BREAK | The prepared throwaway base did not start from the same tieBreak observed in the checked-out worktree: the worktree file at hub-router.json:7-11 lists only quality, review, opencode, while the prepared base reported quality, review, opencode, obsidian, webflow before mutation. Treat the copy result as evidence about the prepared base only until its source snapshot is reconciled. [SOURCE: .skilled/skills/sk-code/hub-router.json:7-11] [INFERENCE: based on the prepared-base command output recorded above] | [SOURCE: .skilled/skills/sk-code/hub-router.json:7-11] [INFERENCE: based on the prepared-base command output recorded above] | P1 |\n

## Exact R1 replacement text
- Confirm workflow .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462: append this sentence to the existing hub-router generation activity: "For each new user surface, place it before sk-code-opencode in routerPolicy.tieBreak and keep every workflow mode first." The existing activity says only tieBreak covering all modes; the --surfaces generation activity is at line 467.
- Auto workflow .skilled/commands/create/assets/create-skill-parent-auto.yaml:250: Line 250: - "hub-router.json present and valid (routerSignals cover every workflowMode, typed vocabularyClasses, tieBreak covers all modes; any catch-all vocabulary class (hub-identity) is on the default mode only, not specialized modes (see parent_hub_router_schema.md); surface packets get metadata routerSignals plus a surfaceBundle outcome)". Add this activity after the auto workflow generates hub-router.json: "For each new user surface, place it before sk-code-opencode in routerPolicy.tieBreak and keep every workflow mode first."
- Root README.md:1448, replace the full step with: 2. Register your packets in mode-registry.json and hub-router.json; place each new surface before sk-code-opencode in routerPolicy.tieBreak, keeping workflow modes first; update the mode table in SKILL.md §1.
- Checklist .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:224, replace row 3 with: | 3 | Stage-one tie-break | hub-router.json routerPolicy.tieBreak | parent-skill-check 5e requires an exact permutation; keep workflow modes first and place user surfaces before sk-code-opencode so they win keyword ties |
- Hub contract .skilled/skills/sk-code/SKILL.md:74, replace the final sentence with: Bundled surfaces follow routerPolicy.tieBreak order; to prioritize a user-owned surface over the native sk-code-opencode packet on a keyword tie, place it before sk-code-opencode in that list.
- No R1 text change is needed in .skilled/commands/create/skill-parent.md:42-47,54-57: it routes to the selected YAML and does not define tieBreak placement. No R1 change is needed to the sk-code README table at .skilled/skills/sk-code/README.md:55-57; it lists packet contents but asserts no order. Doctor 5e/5i need no R1 code change for the minimal documentation/scaffold fix, but this leaves wrong relative surface order undetected.

## Options
| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| R1, with the missing contract sentence | Add the insertion sentence to both create-skill-parent YAMLs, README step 2, nested-packet row 3, and replace the stale tieBreak explanation in sk-code SKILL.md:74. Extend the existing /create:skill-parent update --surfaces generation instruction to place the new surface before OpenCode. | Low: wording in existing instructions and one existing command path. | 5e/5i do not detect a wrong surface order; command-generated or manually edited data can still put OpenCode first. The larger surface-update checklist still has other integration legs. | README-only is cheaper but leaves both scaffold paths and the checklist ambiguous; omitting the SKILL.md edit leaves a false universal precedence statement. |
| Add a doctor rule for user-surface priority | Would require a durable way to distinguish user-owned from native surfaces before 5i could enforce the relation. | Higher: metadata/schema and validation changes. | Adds another classification contract and would affect every hub registration. | R1 wording is sufficient for the current request; no evidence shows a second order source or new metadata is needed. |

## Questions Answered
- No complete key question is closed. This pass supplies exact R1 evidence and text; Q10 remains open for R2-R4 and residual-flow coverage.

## Questions Remaining
- Q10: validate exact R2-R4 edits, all touched files, and their minimum scope; reconcile the prepared base with the checked-out tree.
- Q11: inspect other example assumptions and the complete external-user flow.
- Q12: challenge X1-X9 and identify new rejections.

## Ruled Out
- A README-only R1 edit: the scaffold and parent-skill checklist still omit insertion position.
- A new doctor order rule as part of minimal R1: 5e/5i have no user/native classification, so enforcing it requires a broader contract.

## Dead Ends
- None.

## Edge Cases
- Ambiguous input: the focus names Q10 broadly but the dispatch selects its R1 tieBreak slice; R2-R4 are deferred.
- Contradictory evidence: the prepared copy's initial tieBreak differs from the checked-out hub-router.json; confirm the prepared-base snapshot before using its results as current-worktree evidence.
- Missing dependencies: the first expected canary path was absent; recursive search found the fixture in the prepared authored closure.
- Partial success: routing output confirms returned bundle order but exposes no per-surface scores, so equality of scores is not directly verified.

## Sources Consulted
- .skilled/commands/create/skill-parent.md:42-47,54-57
- .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462,467,471
- .skilled/commands/create/assets/create-skill-parent-auto.yaml (tieBreak/router generation line recorded above)
- README.md:1448
- .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:224
- .skilled/skills/sk-code/SKILL.md:63-74
- .skilled/skills/sk-code/README.md:55-57
- .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1088,1142-1157
- .skilled/skills/sk-code/hub-router.json:7-11
- Throwaway-copy command outputs recorded under Actions Taken.
- specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/iterations/iteration-002.md for the exact 6b/5k-canary messages from the prior --surfaces simulation.

## Assessment
- New information ratio: 0.50 (one new mismatch finding; four findings add exact path, doctor, or update-flow evidence to prior findings; one directly re-runs the earlier tie-break route result).
- Questions addressed: R1 portion of Q10.
- Questions answered: none in full.
- Questions remaining: Q10-R2/R3/R4, Q11, Q12.

## Reflection
- What worked and why: editing only the throwaway copy's tieBreak and running refresh plus the authored manifest copy isolates the ordering behavior; the canary fixture provides a concrete two-surface prompt.
- What did not work and why: the first manifest search assumed activation-manifest.json, but the refresh command exposes the actual manifest.json path. The route output also does not expose scoring, so the tie itself cannot be proven from that receipt alone.
- What I would do differently: first compare the prepared base and checkout source snapshots, then run the same route check against a genuinely newly registered stand-in surface and capture decision scores if the CLI exposes them.

## Recommended Next Focus
Continue Q10 across R2-R4 after resolving the prepared-base mismatch; inspect the exact edits and residual failure modes without changing the repository.

## SCOPE VIOLATIONS
None. Repository writes are limited to this iteration narrative, this delta file, and the append gateway's state projection.
