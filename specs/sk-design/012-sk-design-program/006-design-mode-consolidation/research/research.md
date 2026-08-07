# sk-design Consolidation Refinement Research

## 1. Executive Summary

The consolidated sk-design hub does not need another redesign. Its parent package, compiled routing readiness, command contract, and styles freshness checks pass. Foundations capability remains reachable through `design-interface`, and no active `commandSubworkflows` machinery remains.

Five bounded refinements are worth doing, ranked by value-to-cost:

1. Correct active styles documentation that invokes missing `_engine` and `_db` paths.
2. Delete live audit/foundations owner language from the shared contract, registry extension, and loadable guidance.
3. Delete command claims that a binary interface card proves performance or scoring.
4. Delete the 1,290-row broken inventory table from the root styles README.
5. Delete the design auto YAML's contradictory duplicate lane enum.

Every recommended change removes or corrects existing material. None introduces a mode, command, schema, abstraction, adapter, compatibility layer, or new ceremony.

## 2. Research Question and Scope

This research examined the current hub after `/interface:audit`, `/interface:foundations`, and `commandSubworkflows` retirement. It tested four questions: remaining retired-surface ceremony, sk-doc doctrine drift, capability/proof gaps caused by folding, and operational burden in the 7,812-file styles package. A fifth question ranked the resulting changes and rejected larger proposals.

The evidence boundary was current live source, current commands, current package checks, and direct path/engine behavior. Historical changelogs, archived specs, and benchmarks were treated as provenance, not runtime authority.

## 3. Method and Evidence Boundary

Five iterations used distinct angles:

- live hub and sk-doc parent doctrine;
- styles storage and facade behavior;
- folded audit/foundations capability and proof boundaries;
- auto/confirm/presentation workflow assets;
- final ranking and verification.

Load-bearing claims were rechecked with the official sk-design package validator, compiled-routing readiness, eight command-contract tests, style-library `build --check`, direct old/new path existence checks, and exact searches limited to active sources. No product source was modified; this research is research-only.

## 4. Current System Baseline

The current parent exposes four registered packets: `interface`, `motion`, `md-generator`, and `design-mcp-open-design`, plus three public `/interface:*` commands. The official validator reports PASS for packaging, compiled routing readiness, and parent-skill structure. The command-contract suite passes all eight tests, including stable command-to-mode mapping, visible output blocks, evidence-backed proof, and the prohibition on nested public-command dispatch. [SOURCE: command: `python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/sk-design`] [SOURCE: command: `node --test .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs`]

The style-library freshness check reports 1,290 records with no added, changed, or removed records. The corpus scale is real: 7,812 tracked files and roughly 135 MB, but scale alone is not a demonstrated defect. [SOURCE: command: `node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs build --check`] [SOURCE: lineages/sol/iterations/iteration-002.md]

## 5. Parent-Hub Doctrine Assessment

The parent topology conforms to the useful parts of sk-doc doctrine: one advisor identity, one registry, matching mode keys and packet names, one root graph metadata file, and real procedure sets behind distinct triggers. The Open Design transport is a justified extension because it has different routing semantics, tool boundaries, and taste-authority rules. Procedure folders likewise contain current, separately triggered work. [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:227] [SOURCE: .opencode/skills/sk-design/mode-registry.json:99]

The doctrine drift worth fixing is not structural. It is authority drift: current duplicated literals and loadable documents describe owners or lanes that no longer exist. A hub rebuild would cost more and solve less than deleting those literals.

## 6. Live Retired-Surface Drift

The shared creation contract is on every public command path. Its opening recognizes three current commands, but later sections still include audit/foundations proof rows, no-fit behavior, "four advisory modes," and an audit findings handoff. Those statements make the retired topology operationally visible. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:16] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:126] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:164] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:176] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:194]

The live registry also describes an audit/interface transform split and retains `auditFrame`, although compiled-route probes now resolve those requests to interface. Loadable interface references say an audit mode owns review/scoring, the anti-slop table lists retired children, and the polish procedure routes hierarchy/rhythm fixes to a nonexistent foundations subworkflow. [SOURCE: .opencode/skills/sk-design/mode-registry.json:19] [SOURCE: .opencode/skills/sk-design/mode-registry.json:27] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical-defaults.md:19] [SOURCE: .opencode/skills/sk-design/design-interface/references/foundations/corpus-map.md:27] [SOURCE: .opencode/skills/sk-design/shared/procedures/polish-gate-orchestration.md:31]

The smallest correction is a bounded deletion/rename sweep across only those live sources. Historical uses of "audit" and ordinary auditability language should remain untouched.

## 7. Foundations Capability After Folding

Foundations capability is present. `design-interface` maps static-system intent through `VISUAL_SYSTEM` to eleven existing color, type, layout, artifact, example, and asset resources. `/interface:design` explicitly owns color, typography, layout, spacing, responsive adaptation, and theming. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:122] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:138] [SOURCE: .opencode/commands/interface/design.md:25]

Restoring a foundations command, mode, or subworkflow would create another route to capability that is already reachable. The only foundations-related defect is stale ownership language around real resources and procedures.

## 8. Audit and Proof Boundary After Folding

Interface review capability is also present, but two public command descriptions overstate its proof surface. `/interface:design` sends "performance" and "scoring" to the mechanical card; `/interface:motion` sends "motion-performance" there. The card produces binary `SHIP`/`FIX` results and failing box numbers. It does not measure runtime performance or calculate a score. The UX quality reference explicitly assigns React/runtime performance to `sk-code`. [SOURCE: .opencode/commands/interface/design.md:24] [SOURCE: .opencode/commands/interface/motion.md:24] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:201] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux-quality-reference.md:117]

The existing public output contract already requires an `Evidence Ledger`, and tests reject evidence-free verified flags. Adding severity, confidence, evidence fields, or browser tools to the card would duplicate that contract. The smallest fix is to delete the unsupported performance/scoring words and keep measured runtime proof at the existing `sk-code` boundary. [SOURCE: .opencode/commands/interface/design.md:75] [SOURCE: .opencode/commands/interface/motion.md:68]

## 9. Styles Package and Storage Facade

The current operational burden is documentation drift, not storage architecture. Active hub material points to missing `styles/_engine/` and `styles/_db/` paths. The implementation lives under `styles/lib/engine/`, `styles/lib/database/`, and `styles/database/`; the supported build check passes while the documented `_engine` invocation fails with `MODULE_NOT_FOUND`. [SOURCE: .opencode/skills/sk-design/SKILL.md:207] [SOURCE: .opencode/skills/sk-design/SKILL.md:218] [SOURCE: .opencode/skills/sk-design/README.md:72] [SOURCE: lineages/sol/iterations/iteration-002.md]

The root `styles/README.md` is 165,030 bytes and repeats 1,290 bundle rows with broken root-relative links such as `099-supply/`. The real bundle lives at `library/bundles/099-supply`, and shorter README/manifests already own the inventory. Delete the table; retain a short overview, supported commands, architecture links, and an inventory pointer. [SOURCE: .opencode/skills/sk-design/styles/README.md:23] [SOURCE: .opencode/skills/sk-design/styles/library/README.md:15] [SOURCE: .opencode/skills/sk-design/styles/library/bundles/README.md:1]

The storage-neutral facade should stay. Current interface and motion consumers share one query/hydration surface, and `paths.mjs` centralizes physical layout. Removing it would spread storage knowledge into consumers. [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:28] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:24] [SOURCE: .opencode/skills/sk-design/styles/lib/paths.mjs:1]

## 10. Workflow Asset Ceremony

The three auto YAMLs, three confirm YAMLs, and three presentation assets total 1,826 lines and 108,241 bytes. Auto/confirm pairs share most exact unique lines, but the split still has a current job: confirm mode owns one bundled prompt/wait boundary. Merging the pairs would require conditional workflow semantics or a new template, so repetition alone does not justify consolidation.

One duplicated literal has actually drifted. The public design command exposes `direction|directions|redesign|preflight|handoff|aesthetic`, while `interface-design-auto.yaml` separately declares `direction|directions|redesign|preflight|build|aesthetic`. The smallest fix is deleting the YAML enum so the command remains the sole lane authority. [SOURCE: .opencode/commands/interface/design.md:3] [SOURCE: .opencode/commands/interface/design.md:60] [SOURCE: .opencode/commands/interface/assets/interface-design-auto.yaml:157]

No active `commandSubworkflows` key, compatibility alias, retired command file, or nested public-command invocation remains. Further cleanup under that name has no target.

## 11. Recommendations

| Rank | Smallest change | Current problem solved | Value | Cost |
|---|---|---|---|---|
| 1 | Correct active `_engine`/`_db` documentation to the existing `lib/engine`, `lib/database`, and `database` authorities; run every corrected command | Current documented commands target missing files | Very high | Low: bounded doc/playbook edits and command verification |
| 2 | Delete retired audit/foundations rows, `auditFrame` semantics, and dead-owner labels; rename the real polish owner to `design-interface` | Active command/router guidance names impossible owners | High | Low: bounded prose/registry/test updates |
| 3 | Delete `performance`, `scoring`, and `motion-performance` claims from two commands and the matching presentation phrase | Binary card is presented as measured proof | High | Very low: three phrase edits and contract tests |
| 4 | Delete the root styles README inventory table and point to the existing bundle README/manifests | 165 KB duplicated inventory has broken links | Medium-high | Very low: one document shrink |
| 5 | Delete `user_inputs.mode` from `interface-design-auto.yaml` | Duplicate lane enum invents `build` and omits `handoff` | Medium | Negligible: one-line deletion and contract tests |

The changes can be implemented independently except that recommendation 3 must update the command and presentation wording together.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Restore audit or foundations commands/modes/subworkflows | Current capabilities are reachable through interface; only labels and proof claims drifted | `VISUAL_SYSTEM` resources exist; command/package checks pass | 3, 5 |
| Add severity, confidence, or evidence schema to the mechanical card | Existing commands already require an Evidence Ledger | Command output contracts and adversarial proof test | 3 |
| Grant interface Bash/browser tools | Existing `sk-code` and browser integration own measured proof | Interface allowed-tools and integration boundary | 3 |
| Merge auto/confirm YAMLs or add a shared workflow template | Requires new conditional abstraction; confirm has real bundled-intake behavior | Current execution targets and confirm step 0 | 4 |
| Delete presentation assets | Confirm mode currently uses them as its prompt/display authority | Command owned-assets and confirm workflows | 4 |
| Rebuild hub/registry or delete procedures | Parent topology and procedures validate | Official package validator | 1, 4, 5 |
| Remove/reclassify Open Design transport | It has distinct current transport semantics and authority boundaries | Registry packet kind and transport contract | 1 |
| Remove storage facade | It is the existing minimal isolation seam with live consumers | Interface/motion imports and `paths.mjs` | 2 |
| Migrate to database-only, prune, remote-fetch, or default-persist corpus | No measured storage failure; freshness and query paths work | 1,290-record freshness check | 2, 5 |
| Further `commandSubworkflows` cleanup | No active machinery remains | Active-source search and nested-dispatch tests | 1, 4 |
| Scrub historical retired-mode references | History is provenance, not runtime authority | Active/history evidence separation | 1, 3 |

## Divergence Map

- Saturated directions: none recorded by divergent-mode machinery.
- Pivots taken: none.
- Pivot failures: none.
- Audited overrides: none.
- Council artifacts: none.
- Breadth came from five deliberately distinct focus tracks under `stopPolicy=max-iterations`: structure, storage, capability/proof, workflow assets, and decision ranking.
- Remaining frontier: none within the requested topic. The absence of pivots is not itself evidence of convergence; closure follows from all five questions being answered and the hard iteration cap being reached.

## 12. Open Questions

None within scope. Invocation-frequency telemetry could reorder the middle recommendations, but it is not needed to justify any of the five bounded changes.

## 13. Suggested Implementation Sequence

1. Fix active styles paths and execute every documented operational command.
2. Remove retired-owner semantics from shared contract, registry, and loadable resources; rerun compiled-route/package checks.
3. Narrow command/presentation proof claims and delete the duplicate YAML lane enum; rerun command-contract tests.
4. Shrink the root styles README; verify representative navigation and rerun style freshness.

This sequence prioritizes the reproduced executable failure, then route correctness, then documentation/context reduction.

## 14. Verification Plan

- `python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/sk-design`
- `node --test .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs`
- compiled-route probes for interface transform questions and explicit review wording
- every operational command whose styles path changes
- `node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs build --check`
- bounded active-source search confirming no retired owner or unsupported scoring/performance claim remains
- representative root README link checks

## 15. Risks and Evidence Limits

- Package validators do not detect semantic overclaim in prose; exact source checks remain necessary.
- No invocation telemetry exists, so the ranking is ordinal rather than a fabricated numeric ROI.
- No repository clone/status/package latency baseline was collected; that is why corpus migration is rejected, not declared permanently unnecessary.
- Deleting registry audit wording must preserve interface transform aliases that still support current compiled routing.
- Historical material must not be swept into the live cleanup.

## 16. Implementation Boundaries

This research authorizes no source changes by itself. Any implementation should remain bounded to the exact active files supporting the five recommendations. It should not introduce compatibility wrappers, new schema fields, shared templates, commands, modes, procedures, persistence defaults, or storage migrations. The rollback for each recommended edit is ordinary version-control reversion; no data migration is involved.

## 17. References

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/shared/creation-contract.md`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md`
- `.opencode/skills/sk-design/styles/README.md`
- `.opencode/skills/sk-design/styles/lib/paths.mjs`
- `.opencode/commands/interface/design.md`
- `.opencode/commands/interface/motion.md`
- `.opencode/commands/interface/design-reference.md`
- `.opencode/skills/sk-doc/create-skill/SKILL.md`
- `resource-map.md`
- `fanout-attribution.md`
- `lineages/sol/iterations/iteration-001.md` through `lineages/sol/iterations/iteration-005.md`

## Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last three iterations: run 3 folded audit/foundations capability (0.86); run 4 workflow asset ceremony (0.73); run 5 ranked closure (0.28)
- Convergence threshold: 0.05
- Stop policy: max-iterations; convergence before the cap was telemetry only
- Divergence summary: no divergent pivots, failures, overrides, or remaining frontier recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted
