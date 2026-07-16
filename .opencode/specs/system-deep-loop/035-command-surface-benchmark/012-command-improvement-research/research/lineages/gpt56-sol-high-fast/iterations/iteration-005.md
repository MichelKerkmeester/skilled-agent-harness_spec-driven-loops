# Iteration 005 — Authoring ergonomics and prioritized deltas

## Focus

RQ5: identify template and authoring changes that prevent fat monoliths, missing loader contracts, and prose drift; prioritize the full candidate set.

## Evidence and findings

### F16 — The create-benchmark work shows prose-first completeness does not hold

Independent re-review found a scaffold missing loader-required `id`, `expected_intent`, and `expected_resources`; a documented benchmark route absent from the executable router; and multiple guide/template claims that did not match the runtime consumer. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation/evidence/review-sol-ultra-rereview.md:8-18] [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation/evidence/review-sol-ultra-rereview.md:36-43] The packet later treated loader-gating frontmatter and prose drift as explicit completeness work. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation/implementation-summary.md:97-101]

The same failure mode exists in command authoring: templates describe fields and contracts, but the runtime consumer does not supply a schema that templates must satisfy.

Candidate delta: make a versioned command contract schema the source for template generation, loader gating, validator rules, mirror rendering, and benchmark discovery.

Acceptance criterion: templates validate against the exact schema consumed by runtime tools; removing a loader-required field fails the template fixture before any command is generated.

### F17 — Directly authored routers make boilerplate cheap and correctness expensive

The command template is over 1,200 lines and combines tutorials, variants, router guidance, execution patterns, validation, and a copyable command skeleton. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:1-40] The deep family then duplicates substantial workflow and presentation logic in routers, while create duplicates ownership prose. This is an ergonomic incentive problem: copying prose is easier than declaring the contract once.

Candidate delta: split the canon into a short normative `SKILL.md`, a versioned contract schema, focused examples, and a renderer that produces thin router stubs plus fixtures. Keep the long reference as generated or non-normative guidance.

Acceptance criterion: a new workflow router is authored by filling a bounded contract; generated Markdown passes validation and mirror sync without copying family boilerplate.

### F18 — Presentation exceptions need representation, not silent drift

`memory/search` intentionally inlines a compressed retrieval-result contract while acknowledging that its presentation boundary differs from the normal asset-owned model. [SOURCE: .opencode/commands/memory/search.md:139-150] A validator that blindly bans inline presentation would turn a documented exception into churn.

Candidate delta: model presentation ownership as `asset`, `runtime`, or `router-exception`, with exception rationale and a bounded allowed block.

Acceptance criterion: ordinary workflow routers fail on inline presentation logic; a declared exception passes only when rationale, owner, and allowed block markers are present.

## Prioritized candidate sequence

1. P0: define the versioned command contract and correct required-input semantics in both templates.
2. P0: replace raw-text route extraction with schema-aware executable-edge parsing.
3. P1: add semantic validator fixtures for gates, targets, modes, presentation, timeout, and destructive confirmation.
4. P1: add the approved command census and inventory-derived all-family reference coverage.
5. P1: normalize invocation records across OpenCode, Codex, and Claude; clarify host versus leaf execution.
6. P2: render thin routers and shared ownership prose from contract data.
7. P2: remove stale paths, section numbers, family tables, unsupported positional claims, and command-local prose mismatches.

## Ruled out

- Expanding the monolithic template with another checklist. Existing failures are enforcement and source-of-truth failures.
- Banning all inline presentation. At least one current command has a reasoned direct-dispatch exception.
- Treating loader metadata as optional documentation. Runtime discovery makes it executable contract.
- Fixing P2 prose before P0 schema and parser work. The prose would drift again.

## Iteration assessment

New-info ratio: 0.52. The fifth angle confirmed a common root cause across command and create-benchmark work: contract facts are duplicated in prose instead of generated from loader/runtime schemas. Iteration 5 was completed despite lower novelty because the stop policy required the full five-pass review.
