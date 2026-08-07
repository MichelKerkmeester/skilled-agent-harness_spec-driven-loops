# Iteration 3: Six-Family Mode Matrix and Completeness Validation

## Focus

RQ3: derive the mode/default matrix for create, design, speckit, memory, doctor, and deep, then define a completeness check that pairs every declared `:auto` / `:confirm` mode with both a real workflow asset and an `EXECUTION TARGETS` row. The narrow interpretation is command-suffix execution modes; command-native route categories and flags are represented as topology-specific policies, not forced into the mode-pair schema.

## Findings

1. The live workflow-backed corpus is complete today, but only by inspection: 28 routers declare `:auto` / `:confirm` across create (11), design (5), speckit (4), and deep (8); each has both target rows, each referenced YAML exists, and each family has balanced `_auto.yaml` / `_confirm.yaml` pair sets. Representative rows show the same pairing in create, design, speckit, and deep. [SOURCE: .opencode/commands/create/agent.md:35] [SOURCE: .opencode/commands/create/agent.md:37] [SOURCE: .opencode/commands/design/interface.md:89] [SOURCE: .opencode/commands/speckit/plan.md:46] [SOURCE: .opencode/commands/deep/review.md:128]

2. Omitted-mode behavior is intentionally family-specific and sometimes command-specific. Create fixes omission to confirm; design selects auto only when required arguments are complete and otherwise confirms; deep asks; speckit generally asks, while `resume` defaults to interactive. Memory and doctor do not declare the suffix pair at all: memory uses direct route/default policies, including a non-mutating default for `save`, while doctor uses flags and subaction workflows, with `--force` bypassing only the initial update confirmation. [SOURCE: .opencode/commands/create/agent.md:38] [SOURCE: .opencode/commands/design/interface.md:55] [SOURCE: .opencode/commands/deep/review.md:111] [SOURCE: .opencode/commands/speckit/plan.md:35] [SOURCE: .opencode/commands/speckit/resume.md:35] [SOURCE: .opencode/commands/memory/save.md:41] [SOURCE: .opencode/commands/doctor/update.md:42]

3. The six-family mode/default matrix therefore needs a typed policy, not one default value:

   | Family | Declared suffix modes | Omitted-input/default resolution | Topology |
   |---|---|---|---|
   | create | `:auto`, `:confirm` | fixed `confirm` | mode-pair workflow YAML |
   | design | `:auto`, `:confirm` | `auto` when required input is complete, otherwise `confirm` | mode-pair workflow YAML |
   | speckit | `:auto`, `:confirm`; selected commands also expose unattended aliases | usually `ask`; `resume` overrides to interactive | mode-pair YAML with many-to-one aliases |
   | memory | none | command-native direct routing; `save` defaults to preview/no mutation | direct dispatch |
   | doctor | none | subaction/flag policy; update prompts unless `--force` | route manifest plus subaction workflow |
   | deep | `:auto`, `:confirm` | `ask` | mode-pair workflow YAML |

   This matrix is source-backed by the family routing clauses and demonstrates that defaults belong on each command contract, with a family baseline plus explicit command override permitted. [SOURCE: .opencode/commands/design/interface.md:54] [SOURCE: .opencode/commands/speckit/plan.md:33] [SOURCE: .opencode/commands/speckit/resume.md:33] [SOURCE: .opencode/commands/memory/search.md:48] [SOURCE: .opencode/commands/doctor/update.md:44] [SOURCE: .opencode/commands/deep/review.md:107]

4. Completeness must be checked independently from reachability. The current adapter extracts concrete YAML references and reports when a referenced target is missing, but it has no declared-mode set to compare against, so deleting both an `:auto` row and its asset remains invisible. The existing reference checker also limits its asset-focused family inventory to create, deep, and design. The contract-ready check is: for every canonical declared mode, require exactly one normalized route row, require its target to exist, allow explicit aliases to share a target, and reject undeclared/orphan mode assets; topology variants without suffix modes skip the pair rule and validate their own declared routes instead. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:355] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:365] [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:39] [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/research.md:129]

5. SpecKit proves mode-to-asset mapping must be many-to-one: `:autopilot`, `:unattended`, and `--unattended` are distinct from `:auto` but intentionally select the auto YAML with extra metadata. Mutation coverage must therefore test missing assets, missing rows, wrong default policy, and orphan assets while also proving valid aliases and non-pair topologies pass. The prior synthesis already requires one mutation fixture per invariant and all-six-family reference coverage; this iteration supplies the concrete acceptance matrix. [SOURCE: .opencode/commands/speckit/plan.md:37] [SOURCE: .opencode/commands/speckit/plan.md:47] [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/research.md:68] [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/research.md:139]

## Candidate Deltas

| Target path | Candidate change | Acceptance criterion |
|---|---|---|
| `.opencode/skills/sk-doc/create-command/assets/command-contract.schema.json` | Add `topology`, `declared_modes`, normalized `mode_routes`, aliases, and typed `default_resolution` (`fixed`, `ask`, `input-completeness`, `direct-route`, or command override). | All 35 routers can be represented; create, design, speckit/resume, memory/save, doctor/update, and deep/review encode their current behavior without a synthetic universal default. |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Compose mode completeness into canonical command validation using the contract record. | A declared `:auto` with either the YAML missing or its target row missing fails; the equivalent confirm mutations fail; a valid SpecKit unattended alias passes. |
| `.opencode/commands/scripts/validate-command-references.cjs` | Replace the three-family hard-coded asset scope with contract-driven six-family discovery and report orphan mode assets. | Coverage names create, design, speckit, memory, doctor, and deep; adding an unreferenced `_auto.yaml` fails while direct-route families do not require pair assets. |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs` | Add an S2 completeness comparison before target reachability and consume normalized executable rows. | Removing both an `:auto` row and asset still emits a deterministic P1 completeness finding; a referenced missing target retains the existing reachability finding. |
| `.opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/` | Add independent mutation fixtures for missing asset, missing row, wrong default, orphan asset, many-to-one alias, and direct-route exemption. | One fixture fails per invalid invariant, the two valid topology fixtures pass, and results are stable across all six families. |

## Ruled Out

- A universal omitted-mode default: contradicted by create fixed-confirm, design input-completeness routing, deep/speckit ask behavior, and direct-route families.
- A one-mode/one-asset cardinality rule: contradicted by SpecKit unattended aliases intentionally sharing the auto workflow.
- Treating target reachability as mode completeness: removing both the declaration target row and asset leaves no concrete reference for the current checker to test.

## Dead Ends

- The searched `013-command-contract-remediation` path was absent. This was not required state; the checked-in 012 synthesis and live validator sources supplied the needed coverage evidence. No alternate 013 path was inferred.
- The initial broad text scan was truncated. A bounded, line-oriented census over every top-level router and every mode-pair asset replaced it; no YAML parser retry was attempted because strategy marks broad parser-first census as brittle.

## Edge Cases

- Ambiguous input: The word “mode” also names memory route categories and doctor flags. This iteration treats only declared command suffixes as pair modes and records other control surfaces under topology-specific default policies.
- Contradictory evidence: None. The live corpus is complete while the baseline says completeness is unchecked; those claims are compatible because one describes current data and the other preventive enforcement.
- Missing dependencies: The expected 013 remediation path was unavailable; live sources and the 012 synthesis were sufficient fallback evidence.
- Partial success: None. All six families, all declared suffix-mode routers, asset pairs, defaults, and current validator boundaries were covered.

## Sources Consulted

- `.opencode/commands/create/agent.md:31`
- `.opencode/commands/design/interface.md:52`
- `.opencode/commands/speckit/plan.md:33`
- `.opencode/commands/speckit/resume.md:33`
- `.opencode/commands/deep/review.md:107`
- `.opencode/commands/memory/save.md:39`
- `.opencode/commands/memory/search.md:45`
- `.opencode/commands/doctor/update.md:39`
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:355`
- `.opencode/commands/scripts/validate-command-references.cjs:39`
- `.opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/research.md:129`

## Assessment

- New information ratio: 0.90
- Questions addressed: RQ3
- Questions answered: RQ3

## Reflection

- What worked and why: A line-oriented, exhaustive router/asset census established present completeness without repeating the previously brittle YAML-parser approach; targeted family reads then separated default policy from asset topology.
- What did not work and why: The guessed 013 remediation path was absent, and the first broad grep exceeded the display budget. Neither blocked the answer because narrower live-source reads and the 012 synthesis covered the same contract gap.
- What I would do differently: Start from the normalized census immediately, then sample only the lines needed to prove each distinct default policy.

## Recommended Next Focus

RQ4: name doctor’s route-manifest topology and define executable-edge parsing that excludes YAML comments while preserving real subaction and workflow dispatch edges.
