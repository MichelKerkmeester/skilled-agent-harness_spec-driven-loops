# Command Authoring Canon Improvement Research

## Executive synthesis

The dominant defect is not that individual commands ignore a complete canon. The canon itself duplicates behavioral truth across a normative skill, two templates, router prose, workflow YAML, runtime code, mirror wrappers, and benchmark adapters without a shared machine-readable contract. That permits three failure classes at once:

1. A generated command can follow the router template and violate the skill's mandatory input-gate rule. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:219-240] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:42-51]
2. Families copy recurring gate, presentation, and workflow logic into routers, while legitimate family differences such as default mode remain implicit. [SOURCE: .opencode/commands/create/command.md:25-38] [SOURCE: .opencode/commands/design/audit.md:54-77] [SOURCE: .opencode/commands/deep/research.md:11-118]
3. The validators can stay green while raw-comment edges create false P0 cycles, three routed families escape reference checks, the approved command census drifts, and command prose contradicts runtime. [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:39-46] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:387-420] [SOURCE: .opencode/commands/deep/research.md:140-146] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1139-1149]

The recommended sequence is schema first, semantic validation second, generation third, command-local cleanup last. Reversing that order would repair symptoms while preserving their authoring mechanism.

## Answers to the research questions

### RQ1 — Canon completeness gaps

The canon has four material gaps.

- The required-input invariant is contradictory: the skill demands an immediate gate, while the canonical router template declares a required hint and omits the gate. This incompleteness propagates into live families. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:219-240] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:42-51]
- `command_template.md` contains a singular command path, stale numbered-section references, and an incomplete/outdated family topology. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:65-75] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:604-606] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:816-845]
- The canon has no machine-readable representation for input ownership, mode resolution, loader requirements, presentation ownership, timeout bounds, or intentional exceptions.
- `validate_document.py --type command` verifies section presence but not those behavioral invariants. [SOURCE: .opencode/skills/sk-doc/shared/scripts/validate_document.py:417-515]

A command can therefore be “canon-shaped” without being contract-correct.

### RQ2 — Recurring family divergence

Canon-wide fixes should own required-hint gate classification, thin-router boundaries, asset-ownership prose, and loader declarations. These recur across create, design, speckit, doctor, and deep routers and are traceable to missing or contradictory template rules. [SOURCE: .opencode/commands/create/command.md:1-16] [SOURCE: .opencode/commands/design/audit.md:1-15] [SOURCE: .opencode/commands/speckit/plan.md:1-14] [SOURCE: .opencode/commands/doctor/mcp.md:1-15] [SOURCE: .opencode/commands/deep/research.md:1-18]

Not every difference should be normalized. Create defaults to confirm, design can default complete invocations to auto, and speckit can require an explicit choice. [SOURCE: .opencode/commands/create/command.md:35-38] [SOURCE: .opencode/commands/design/audit.md:54-77] [SOURCE: .opencode/commands/speckit/plan.md:33-38] The canon should encode these policies in a mode matrix and test parity, not force one answer.

Command-local fixes remain appropriate for isolated facts, notably the `deep/research` timeout claim and `memory/save` hint/fallback mismatch. [SOURCE: .opencode/commands/deep/research.md:140-146] [SOURCE: .opencode/commands/memory/save.md:1-15]

### RQ3 — Validator and benchmark blind spots

Five deterministic checks are missing.

1. Schema-aware route-edge parsing. The current raw-text extraction treats comments as command edges, causing the three reported P0 cycles. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/004-command-lane-integration/alignment/alignment-report.md:8-26] [SOURCE: .opencode/commands/create/assets/create_readme_auto.yaml:28-43] [SOURCE: .opencode/commands/doctor/_routes.yaml:1-14]
2. Inventory-derived reference coverage. The current checker hard-codes create, deep, and design, omitting speckit, memory, and doctor. [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:39-46]
3. Approved command-census comparison. Sync currently validates discovered source count against generated mirror count, so both can drift together. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:217-225]
4. Semantic router-contract validation: gate owner, dispatch targets, mode matrix, presentation owner, and destructive confirmation.
5. Cross-layer parity for argument optionality, timeout bounds, capabilities, and runtime constants. The current benchmark's S1-S5 scope does not cover these claims. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:365-493]

### RQ4 — Router and dispatch improvements

The invocation surface needs a runtime-neutral normalized record. OpenCode attached suffixes, Codex flattened prompt names, and Claude invocation syntax should all produce `{command, mode, arguments, runtime}` before routing. The Codex generator currently flattens the name and forwards only `$ARGUMENTS`; its promise of `$1..$N` parity is not backed by substitution logic. [SOURCE: .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs:64-83]

`argument-hint` should be rendered from semantic input metadata rather than used as that metadata. `memory/save` proves that angle brackets do not reliably mean surface-required because the command accepts an empty invocation and resolves a fallback. [SOURCE: .opencode/commands/memory/save.md:1-15]

Detached fan-out also needs distinct lineage-host and leaf-executor roles. The Codex adapter forbids self-invocation, while the fan-out runtime can hand the receiving Codex process a `cli-codex` lineage prompt. [SOURCE: .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:20-45] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1003-1084]

### RQ5 — Authoring ergonomics

The create-benchmark completeness work supplies the most relevant precedent: missing loader-required fields, documented routes absent from executable routing, and guide/template claims diverging from runtime. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation/evidence/review-sol-ultra-rereview.md:8-18] [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation/evidence/review-sol-ultra-rereview.md:36-43] The remedy is to make runtime-consumed schemas generate or validate authoring surfaces, not add another prose checklist.

A bounded command contract should generate the router skeleton, argument hint, mode table, Owned Assets table, Presentation Boundary, mirror metadata, and validator fixtures. This makes the correct action cheaper than copying a monolith. Intentional exceptions remain possible through typed declarations; `memory/search` demonstrates why presentation exceptions need a first-class representation. [SOURCE: .opencode/commands/memory/search.md:139-150]

## Prioritized candidate deltas

### P0. Establish a versioned command contract

Targets:

- `.opencode/skills/sk-doc/create-command/SKILL.md`
- `.opencode/skills/sk-doc/create-command/assets/command_router_template.md`
- `.opencode/skills/sk-doc/create-command/assets/command_template.md`
- New schema under `.opencode/skills/sk-doc/create-command/assets/`

Delta: define topology, inputs and gate owner, execution targets, mode matrix, owned assets, loader requirements, presentation ownership, destructive policy, and runtime-specific invocation aliases. Correct the existing required-input contradiction and stale template references.

Acceptance criterion: both templates validate against the schema; a required input is always router-gated or target-gated; every six-family router has a complete contract; no numbered-section pointer or hand-maintained family inventory remains normative.

### P0. Replace raw-text route inference with executable-edge parsing

Targets:

- `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs`
- Benchmark route fixtures

Delta: parse YAML and traverse only schema-declared dispatch fields, recording edge kind and source location.

Acceptance criterion: current comment-only references yield zero route edges; true direct, subaction, and workflow cycles still fail with a path of executable fields.

### P1. Add semantic command validation and mutation fixtures

Targets:

- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- `.opencode/commands/scripts/validate-command-references.cjs`
- Command benchmark fixtures

Delta: validate input ownership, target resolution, mode matrix, presentation ownership, timeout bounds, confirmation behavior, and all declared assets across every inventoried family.

Acceptance criterion: independent mutation fixtures fail for each invariant; reference coverage reports create, design, speckit, memory, doctor, and deep without hard-coded family omissions.

### P1. Freeze the command census explicitly

Targets:

- New census manifest under `.opencode/skills/sk-doc/create-command/assets/`
- `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs`
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs`

Delta: record approved canonical path, family, topology, mirror name, and approval provenance. Compare discovery and generated mirrors independently to this manifest.

Acceptance criterion: source and mirror cannot drift together unnoticed; every addition, deletion, rename, or topology change requires an explicit manifest delta.

### P1. Normalize cross-runtime invocation and execution roles

Targets:

- `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs`
- Deep-loop dispatch runtime and workflow schemas
- Canon invocation grammar

Delta: normalize attached suffixes and leading mode tokens to one invocation record; reject conflicting controls; prohibit `$1..$N` until implemented; split `lineageHost` from `leafExecutor`.

Acceptance criterion: equivalent OpenCode, Codex, and Claude invocations produce identical normalized records; same-runtime detached fan-out never recursively self-dispatches; route proof records both host and leaf roles.

### P2. Generate thin routers and shared prose

Targets:

- Create-command renderer/generator
- `create/*`, `design/*`, `speckit/*`, `memory/*`, `doctor/*`, and `deep/*` routers after P0/P1 land

Delta: render input gate, mode table, Owned Assets, Presentation Boundary, and execution-target sections from the contract. Move workflow protocol and display templates out of deep routers. Permit bounded typed exceptions.

Acceptance criterion: new workflow routers require no copied family boilerplate; router-owned workflow decisions are zero unless explicitly exempted; asset kinds and paths cannot disagree with rendered prose.

### P2. Repair command-local contract mismatches

Targets include `.opencode/commands/deep/research.md`, `.opencode/commands/memory/save.md`, and repeated create ownership prose.

Delta: align timeout semantics to runtime, render optional/fallback input accurately, and correct `.txt` ownership labels.

Acceptance criterion: the new semantic and parity checks pass without exceptions for these known mismatches.

## Eliminated alternatives

- Command-by-command cleanup before canon enforcement: repairs current instances but preserves regeneration defects.
- One default-mode policy: erases legitimate risk and completeness differences between families.
- More regex around YAML: cannot establish executable edge semantics reliably.
- More prose checklists: create-benchmark evidence shows loader/runtime contracts still drift when prose is the source of truth.
- A blanket ban on inline presentation: rejects intentional direct-dispatch behavior such as `memory/search` instead of making the exception auditable.
- Recursive same-runtime executor dispatch: violates the Codex executor contract and obscures lineage ownership.

## Convergence and confidence

All five questions converged on one architectural recommendation: make the command contract machine-readable and make every prose surface, mirror, validator, benchmark, and generated router consume it. Confidence is high for the P0 findings because each is directly reproduced in shipped files. P1 contract design details remain candidates until the current OpenCode/Claude loaders are tested for tolerated metadata placement; a sidecar schema avoids relying on unknown frontmatter behavior.

The loop stopped because iteration 5 reached `maxIterations`, not because an earlier convergence signal ended the review.
