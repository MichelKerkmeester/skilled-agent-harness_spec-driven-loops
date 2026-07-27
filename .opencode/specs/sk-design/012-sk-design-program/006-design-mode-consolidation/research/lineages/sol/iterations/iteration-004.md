# Iteration 4: Workflow Asset Ceremony and Drift

## Focus

Test the auto/confirm/presentation asset set and shared lifecycle material for concrete duplication or dead choreography after `commandSubworkflows` removal. File count alone is not treated as a defect.

## Actions Taken

1. Re-read state, strategy, and the findings registry before following the asset-ceremony focus.
2. Inventoried the three auto YAMLs, three confirm YAMLs, and three presentation assets by lines and bytes.
3. Compared each auto/confirm pair for exact shared content and searched current non-history consumers.
4. Compared the interface command’s canonical lane list with the design auto workflow and presentation.
5. Searched live command assets and the shared creation contract for `commandSubworkflows`, retired commands, or nested public-command dispatch.

## Findings

1. **Delete the redundant lane enum from `interface-design-auto.yaml`.** The public command is the route authority and exposes `direction|directions|redesign|preflight|handoff|aesthetic`; its auto execution target separately declares `direction|directions|redesign|preflight|build|aesthetic`. That duplicate drops `handoff` and invents `build`, even though implementation belongs to `sk-code`. The smallest fix is deleting the YAML `user_inputs.mode` line rather than synchronizing another enum. Cost: negligible—one deletion and command-contract verification. [SOURCE: .opencode/commands/interface/design.md:3] [SOURCE: .opencode/commands/interface/design.md:60] [SOURCE: .opencode/commands/interface/assets/interface-design-auto.yaml:154] [SOURCE: .opencode/commands/interface/assets/interface-design-auto.yaml:157]

2. **Close the performance/scoring wording fix across the presentation boundary.** The design presentation still recommends the binary card for “findings-first review and scoring,” so editing only the command discriminator would leave a conflicting current output surface. Delete “and scoring” there as part of the same bounded fix identified in iteration 3. Cost: negligible—one additional phrase deletion. This is closure of one defect, not a new scoring system. [SOURCE: .opencode/commands/interface/assets/interface-design-presentation.txt:50] [SOURCE: .opencode/commands/interface/design.md:24] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:201]

3. **The nine command assets are repetitive, but wholesale consolidation is not worth doing now.** The asset set is 1,826 lines and 108,241 bytes; each auto/confirm pair shares 184–191 exact unique non-comment lines. Yet auto and confirm have a real behavioral distinction—the confirm version owns one bundled intake/presentation wait—and all current commands explicitly select these files as execution targets. Merging them would require conditional workflow semantics or another shared template, both forbidden new abstraction. Keep the files and remove only duplicated literals that have actually drifted. Cost of keeping them: repeated maintenance; cost of consolidation: medium-to-high workflow and contract-test churn. [SOURCE: .opencode/commands/interface/design.md:77] [SOURCE: .opencode/commands/interface/motion.md:70] [SOURCE: .opencode/commands/interface/design-reference.md:70] [SOURCE: .opencode/commands/interface/assets/interface-design-confirm.yaml:172] [SOURCE: command: wc -l -c interface command assets] [SOURCE: command: auto/confirm exact-line comparison]

4. **`commandSubworkflows` is already fully absent from active command sources.** The live command package contains no key, compatibility alias, retired command file, or nested public-command invocation. The shared creation contract directly prohibits public commands invoking public commands, and the command-contract tests pass that rule. There is nothing further to delete under that machinery name. Cost of additional work would be search/test churn with no current behavior change. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:28] [SOURCE: .opencode/commands/interface/design.md:90] [SOURCE: .opencode/commands/interface/motion.md:83] [SOURCE: .opencode/commands/interface/design-reference.md:83] [SOURCE: command: active commandSubworkflows search]

5. **Current sk-doc parent-hub doctrine does not justify a structural rewrite.** Iteration 1’s package validator passed the one-hub/one-registry topology, matching child identities, and procedure connectivity. The worth-fixing drift is content authority leaking into duplicate literals and live resources naming retired owners—not the existence of mode packets, procedure folders, transports, or command workflow assets. Cost: low for bounded deletions; high and unjustified for a hub rebuild. [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md] [SOURCE: command: python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/sk-design] [SOURCE: .opencode/commands/interface/design.md:18]

## Questions Answered

- Which current hub artifacts still carry duplicated or retired-surface ceremony that imposes a concrete maintenance or routing cost? The shared creation contract and loadable interface/shared references retain retired-owner language; the design auto YAML duplicates and contradicts the public lane enum; the presentation duplicates the unsupported scoring claim.
- Where does the current hub drift from sk-doc create-skill parent-hub doctrine, and which drift is worth fixing now? The validated topology does not materially drift. Only bounded authority/content drift is worth fixing; structural consolidation is not.

## Questions Remaining

- Which evidence-backed refinements rank highest by value-to-cost, and which plausible proposals are explicitly not worth doing?

## Ruled Out

- **Merge auto and confirm YAMLs:** requires conditional workflow semantics or a new shared template.
- **Delete all presentation assets:** confirm mode has a current bundled-intake display responsibility.
- **Rebuild the hub to remove all repetition:** package structure validates and repetition alone is not a runtime defect.
- **Further `commandSubworkflows` cleanup:** no active implementation remains.

## Dead Ends

- Measuring lines and bytes identified review surface, not value; the recommendation emerged only after finding a contradictory duplicated lane enum.
- Searching all `.opencode` consumers pulled historical specs and logs; those do not prove a current runtime dependency.

## Edge Cases

- Ambiguous input: duplicated files can be legitimate when they encode distinct auto/confirm behavior.
- Contradictory evidence: heavy textual duplication coexists with a valid behavioral split.
- Missing dependencies: no invocation telemetry shows how often the stale `build` literal changes behavior; the contradiction is nevertheless current and deterministic.
- Partial success: the asset set is structurally coherent, so only two literal deletions are justified.

## Sources Consulted

- `.opencode/commands/interface/design.md`
- `.opencode/commands/interface/motion.md`
- `.opencode/commands/interface/design-reference.md`
- Nine current interface command assets
- `.opencode/skills/sk-design/shared/creation-contract.md`
- `.opencode/skills/sk-doc/create-skill/SKILL.md`
- Active-source reference search and auto/confirm exact-line comparison

## Assessment

- New information ratio: 0.73
- Novelty justification: one new concrete contradictory enum and one propagation surface were found; the rest converted apparent duplication into explicit negative knowledge.
- Confidence: high for literal drift and current references; medium for maintenance-cost magnitude because no change-frequency history was measured.

## Reflection

- What worked and why: comparing each duplicated literal to its declared authority exposed one surgical deletion without inventing a consolidation layer.
- What did not work and why: repository-wide consumer search crossed historical research logs, so only current command and skill sources were admitted as evidence.
- What I would do differently: normalize authority-bearing fields first and skip byte counts unless a contradictory duplicate is found.

## Recommended Next Focus

Reconcile all five iterations into one value-to-cost ranking, retest top claims against current files, and make the rejection list as explicit as the action list.
