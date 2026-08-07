# Iteration 3: Folded Audit and Foundations Coverage

## Focus

Determine whether folding audit and foundations into `design-interface` left a current capability or proof gap, without treating retired command names as capabilities that must be restored.

## Actions Taken

1. Re-read config, JSONL state, strategy, and registry before selecting the unresolved folded-capability question instead of synthesizing early.
2. Read the complete `design-interface` routing contract, its mechanical preflight card, the objective UX floor, and the current design/motion command discriminators.
3. Verified every resource in the `VISUAL_SYSTEM` resource map exists.
4. Searched only live, loadable interface/shared resources for retired ownership language.
5. Ran the interface command-contract test suite.

## Findings

1. **Foundations capability survived the fold and does not need a new mode or command.** The interface router maps static-system requests to `VISUAL_SYSTEM`, whose eleven color, type, layout, artifact, example, and asset resources all exist. `/interface:design` also explicitly owns color, typography, layout, spacing, responsive adaptation, and theming. Restoring `/interface:foundations` would add another public route without recovering a missing capability. Cost of the recommended action—keep the fold—is zero. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:122] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:138] [SOURCE: .opencode/commands/interface/design.md:25] [SOURCE: command: VISUAL_SYSTEM path existence check]

2. **The current commands overclaim what the mechanical card proves.** `/interface:design` routes “performance” and “scoring” to the card, and `/interface:motion` routes “motion-performance” there. The card is a binary visual/content/responsive/state checklist with only `SHIP` or `FIX`; it has no performance measurement or score. The objective quality reference explicitly assigns React/runtime performance to `sk-code`. The smallest fix is deletion: remove `performance`, `scoring`, and `motion-performance` from those discriminator sentences, leaving binary quality/preflight work in interface and existing measured runtime handoff in `sk-code`. Cost: very low—two command-line edits plus contract tests. [SOURCE: .opencode/commands/interface/design.md:24] [SOURCE: .opencode/commands/interface/motion.md:24] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:201] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux-quality-reference.md:117]

3. **The proof architecture already supplies the evidence layer the binary card omits.** The card deliberately records pass/fail and failing box numbers, while the public commands require a separate `Evidence Ledger`; the shared command-contract tests reject evidence-free verified flags. Adding severity, confidence, or a new result schema to every checkbox would duplicate the existing evidence contract and add ceremony. Keep the card binary. Cost of doing nothing: reviewers must use the already-required ledger; cost of expansion: widespread template and test churn. [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:201] [SOURCE: .opencode/commands/interface/design.md:75] [SOURCE: .opencode/commands/interface/motion.md:68] [SOURCE: command: node --test .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs]

4. **Retirement left live dead-owner language inside resources the interface router can load.** `mechanical-defaults.md` twice says an audit mode consumes the gate; the `VISUAL_SYSTEM` resource map loads `foundations/corpus-map.md`, which still assigns review/scoring to audit; the shared anti-slop reference still lists both retired children. These are not historical changelog mentions: they are current operational guidance and can direct a reader toward nonexistent owners. The smallest fix is to delete the retired ownership sentences or replace them with the existing `design-interface`/`sk-code` owner—no compatibility aliases. Cost: low, bounded documentation edits and package validation. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:132] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:138] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical-defaults.md:19] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical-defaults.md:147] [SOURCE: .opencode/skills/sk-design/design-interface/references/foundations/corpus-map.md:27] [SOURCE: .opencode/skills/sk-design/shared/anti-slop-principles.md:55]

5. **The shared polish card has a real routing defect, not a missing capability.** It correctly points to an existing hierarchy/rhythm procedure, but calls that procedure a `foundations` subworkflow and tells reviewers to route fixes to a nonexistent owner. Rename the owner in two sentences to `design-interface` and retain the procedure. Cost: negligible; two prose changes. Recreating a subworkflow would be strictly larger. [SOURCE: .opencode/skills/sk-design/shared/procedures/polish-gate-orchestration.md:31] [SOURCE: .opencode/skills/sk-design/shared/procedures/polish-gate-orchestration.md:43] [SOURCE: .opencode/skills/sk-design/shared/procedures/polish-gate-orchestration.md:49]

## Questions Answered

- Did folding foundations and audit into interface create a present capability or proof gap that the binary preflight checks do not cover? Foundations capability is intact. The present gap is narrower: two commands mislabel an unmeasured card as performance/scoring proof, and several live resources still route ownership to retired surfaces.

## Questions Remaining

- Which current duplicated workflow or presentation assets impose a concrete maintenance cost rather than merely having similar shapes?
- Final value-to-cost ranking and explicit rejection list.

## Ruled Out

- **Restore `/interface:foundations` or an internal foundations subworkflow:** all current static-system resources are reachable from interface.
- **Restore an audit mode:** current review capability exists; the defects are overclaimed proof and stale ownership labels.
- **Add severity, confidence, or evidence fields to the mechanical card:** the public command already requires an Evidence Ledger.
- **Grant Bash/browser tools to interface:** existing `sk-code` and browser integration own measured runtime proof.

## Dead Ends

- Treating every occurrence of “audit” as stale would wrongly flag ordinary auditability language and historical provenance.
- Counting card boxes does not establish coverage quality; comparing claimed proof to the card and quality-floor boundaries does.

## Edge Cases

- Ambiguous input: “capability gap” could mean a missing public command; evidence instead showed capability retention with ownership and proof-boundary drift.
- Contradictory evidence: the folded mode is structurally complete while several of its loadable references still speak the retired topology.
- Missing dependencies: no live render was supplied, so no claim was made about the quality of a particular UI audit.
- Partial success: the command-contract suite passes, proving structural contract health but not semantic accuracy of the discriminator wording.

## Sources Consulted

- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md`
- `.opencode/skills/sk-design/design-interface/references/design-process/ux-quality-reference.md`
- `.opencode/skills/sk-design/design-interface/references/design-process/mechanical-defaults.md`
- `.opencode/skills/sk-design/design-interface/references/foundations/corpus-map.md`
- `.opencode/skills/sk-design/shared/anti-slop-principles.md`
- `.opencode/skills/sk-design/shared/procedures/polish-gate-orchestration.md`
- `.opencode/commands/interface/design.md`
- `.opencode/commands/interface/motion.md`
- Interface command-contract test suite

## Assessment

- New information ratio: 0.86
- Novelty justification: three findings identified current semantic/routing defects, while two rejected larger restoration or schema changes using positive coverage evidence.
- Confidence: high for resource reachability, command wording, and stale-owner references; medium for the practical frequency of the bad routes because no invocation telemetry exists.

## Reflection

- What worked and why: comparing command claims with the exact proof surfaces separated a real measurement gap from a request to restore deleted commands.
- What did not work and why: a broad keyword search included auditability prose and historical material, so the query was narrowed to live loadable resources and explicit owner labels.
- What I would do differently: start with the current resource map and public output contract, then inspect only the resources those contracts can actually load.

## Recommended Next Focus

Test the auto/confirm/presentation asset set and remaining shared lifecycle material for concrete duplication or dead choreography after `commandSubworkflows` removal. Reject consolidation based on file count alone.
