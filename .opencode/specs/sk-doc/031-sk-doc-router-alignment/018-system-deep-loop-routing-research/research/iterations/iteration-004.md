# Iteration 4: Deterministic Scenario Census and Routing Partition

## Focus

Classify the system-deep-loop manual-playbook corpus under the benchmark loader's actual rules, separating loader-recognized routing candidates from browser, index, unreadable, and metadata-ineligible material. Dispatch proof: `Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`. Canonical record proof: `Resolved route: mode=research target_agent=deep-research`.

## Actions Taken

1. Inventoried all seven `manual_testing_playbook/` trees and their scenario Markdown files.
2. Read the loader's index-table, YAML-frontmatter, class-kind, stage, route-gold, and typed-gold rules.
3. Invoked the loader read-only against each of the seven owning roots and aggregated class, stage, flat-gold, typed-gold, and warning counts.
4. Compared the authored hub index, baseline report, and benchmark README counts.

## Findings

1. The “roughly 319 scenarios” are exactly **319 Markdown artifacts**, not 319 loader scenarios: seven root `manual_testing_playbook.md` files plus 312 non-root Markdown files. The 312 non-root files divide by owner as hub 19, deep-ai-council 33, deep-alignment 31, deep-improvement 60, deep-research 62, deep-review 55, and runtime 52. [INFERENCE: deterministic read-only Node census over `.opencode/skills/system-deep-loop/**/manual_testing_playbook/**/*.md`, applying the loader's root-file exclusions at `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:343-361,486-524`]
2. A family-wide invocation of the existing loader, once per owning root, recognizes only **21 scenarios**: deep-improvement 9, deep-research 8, and deep-review 4. All 21 are `classKind=routing`, `stage=routing`, and carry flat `expected_resources`; none declares `expected_leaf_resources` or `expected_workflow_mode`, so the current typed-gold row count remains zero. [INFERENCE: deterministic loader census using `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:343-417,486-524` over the seven packet roots]
3. The hub index declares **18** scenarios, but the loader emits 18 unreadable-file warnings and loads zero because every indexed path uses hyphenated directories such as `mode-routing/research-routing.md`, while the checked-in directory is `mode_routing/`. This is a corpus-addressing failure before routing classification, not a router miss. [SOURCE: `.opencode/skills/system-deep-loop/manual_testing_playbook/manual_testing_playbook.md:201-224`] [SOURCE: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:497-519`] [INFERENCE: exact-path existence check for all 18 index rows returned present=0 and missing=18]
4. The committed evidence is contradictory about hub corpus size: the playbook and baseline report describe 18 rows (14 routing plus 4 browser), while the benchmark README says 20 and 16 routing plus 4 browser. The playbook index and machine-readable baseline agree, so **18 (14+4)** is the better-supported current count; the README's 20 is stale or refers to an uncommitted/later corpus state. [SOURCE: `.opencode/skills/system-deep-loop/manual_testing_playbook/manual_testing_playbook.md:201-225`] [SOURCE: `.opencode/skills/system-deep-loop/benchmark/baseline/skill-benchmark-report.json:153-164`] [SOURCE: `.opencode/skills/system-deep-loop/benchmark/README.md:27-42`]
5. The deterministic partition is therefore: **21 current routing-gold candidates**; **14 additional hub routing candidates** only after its index paths become readable; **4 explicit browser exclusions** from the hub's `MR-*` rows; **273 non-root files that the loader cannot classify** because they are neither readable indexed rows nor YAML-frontmatter scenarios with `id|expected_intent|expected_resources`; and **7 root index documents**, which are not scenarios. Thus 35 is the evidence-backed upper bound for genuine routing candidates in the present family corpus, while the other 284 artifacts must stay outside typed-gold scoring unless independently authored scenario metadata makes them eligible. [SOURCE: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:56-73,343-417,497-524`] [INFERENCE: 319 = 21 current candidates + 14 path-blocked routing candidates + 4 browser exclusions + 273 loader-ineligible files + 7 root indexes]

## Questions Answered

- Which of the roughly 319 scenarios are genuine routing decisions, and which must remain outside typed-gold scoring? **Answered under the loader-contract interpretation:** 21 are current candidates, 14 are path-blocked hub candidates, 4 are explicit browser exclusions, and 280 artifacts (273 unsupported files plus 7 indexes) are not typed-gold eligible.

## Questions Remaining

- What dependency-ordered configuration and router changes can raise routing quality without weakening fallback behavior?
- Which of the 273 loader-ineligible files should be deliberately promoted into authored routing scenarios, if any? This is not inferable from filenames alone.

## Ruled Out

- “319 Markdown artifacts” means 319 normalized benchmark scenarios; the loader produces 21 today.
- The benchmark README's 20-scenario statement is the current source of truth; the authored index and machine report both support 18.
- Metadata-ineligible behavior files can safely receive inferred typed gold; typed gold is opt-in and must remain authored.

## Dead Ends

- Broad behavior-benchmark scenario discovery does not answer this question: those fixtures are a different corpus from `manual_testing_playbook/` and do not pass through this loader.

## Edge Cases

- Ambiguous input: “roughly 319 scenarios” conflates 319 Markdown artifacts with normalized scenarios; the narrower loader-contract interpretation was selected.
- Contradictory evidence: the README says 20 scenarios, while the current playbook index and baseline report support 18; both claims are preserved above.
- Missing dependencies: none; the census used direct local files because memory/code-graph accelerators were already recorded unavailable.
- Partial success: semantic promotion decisions for the 273 loader-ineligible files remain unresolved because current metadata does not support classification.

## Sources Consulted

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:39-73,120-165,343-417,427-524`
- `.opencode/skills/system-deep-loop/manual_testing_playbook/manual_testing_playbook.md:140-225`
- `.opencode/skills/system-deep-loop/benchmark/baseline/skill-benchmark-report.json:153-164`
- `.opencode/skills/system-deep-loop/benchmark/README.md:20-42`
- `.opencode/skills/system-deep-loop/**/manual_testing_playbook/**/*.md` (deterministic inventory and loader census)

## Assessment

- New information ratio: 1.0
- Novelty justification: 5 of 5 findings are fully new relative to the iteration-3 registry; no simplicity bonus was needed.
- Questions addressed: scenario census, loader eligibility, class/stage partition, route-gold presence, typed-gold exclusions.
- Questions answered: genuine routing decisions versus material that must remain outside typed-gold scoring under the current loader contract.

## Reflection

- What worked and why: invoking the production loader per owning packet exposed the decisive difference between authored Markdown inventory and normalized benchmark rows.
- What did not work and why: filename/keyword discovery mixed behavior benchmarks, root indexes, and scenario files, so it could not provide loader-semantic counts.
- What I would do differently: begin the next pass from the 35 evidence-backed candidate rows and derive changes in dependency order rather than revisiting the full 319-artifact inventory.

## Next Focus

Build the dependency-ordered change plan: repair or canonicalize hub index paths, decide the exact 35-scenario typed-gold authoring scope, generate the manifest, add a hub-level packet-qualified surface router, and then rerun loader validation before benchmark scoring.
