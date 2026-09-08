# Iteration 2: Angle 2, SYSTEM-SPEC-KIT

## Focus

Inventory the current system-spec-kit runtime CLI, validation registry, template levels and addons, lexical retrieval surface and `/speckit:*` command behavior.

## Actions Taken

- Read the current state and strategy before source inspection.
- Inspected the runtime CLI tree, validation front door, registry and retrieval README.
- Inspected `create.sh`, the template manifest, and the six current `/speckit:*` command frontmatters and contracts.

## Findings

## INVENTORY

| Surface | Value | Source |
|---|---|---|
| Runtime location | The live package is nested under `.opencode/skills/system-spec-kit/runtime/cli/`, with `spec/`, `rules/`, `continuity/`, `retrieval/`, `runtime-mirrors/`, `resource-map/`, `templates/`, `optimizer/` and other CLI areas. | [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/README.md:13`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/README.md:62`] |
| Validation front door | `validate.sh` delegates rule decisions to the validation orchestrator. Exit codes are 0 success, 1 user error, 2 validation error and 3 system error. | [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh:5`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh:370`] |
| Registered validation rules | The registry contains 40 rule entries, including `AC_CLOSURE`, `GREP_CONVENTION`, `CONTINUITY_FRESHNESS`, `GENERATED_METADATA_INTEGRITY` and `LINKS_VALID`. | [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:367`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:416`] |
| Rule scripts | 39 rule/helper files are present under `runtime/cli/rules`; the authoritative registered rule count is 40 because some rules are native or TypeScript-backed. | [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/rules/README.md:1`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:343`] |
| Create surface | `create.sh` supports levels 1, 2, 3 and 3+, plus phase-parent, review and research modes. It exposes `--with-lazy-addons` and `--with-goal`. | [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh:9`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh:95`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh:277`] |
| Template contracts | `templates/spec-kit-docs.json` is the manifest-backed level contract. Acceptance criteria is optional at Levels 2, 3 and 3+, while `goal.md` is a lazy addon. | [SOURCE: `.opencode/skills/system-spec-kit/templates/README.md:76`] [SOURCE: `.opencode/skills/system-spec-kit/templates/README.md:142`] [SOURCE: `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:89`] [SOURCE: `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:98`] |
| Acceptance criteria and goal | The packet acceptance-criteria document and level examples exist. The closure rule is an error for Levels 2, 3 and 3+. `--with-goal` scaffolds `goal.md`, a durable operator directive. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/034-v4-state-inventory-research/acceptance-criteria.md:29`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:89`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh:281`] |
| Retrieval | `generate-trigger-index.mjs` publishes the committed trigger index, `lookup-trigger-index.mjs` reads and ranks it, `rg-wrapper.mjs` provides structured/path/count lanes and `sweep-memory-residue.mjs` checks retired memory-MCP consumers. No daemon or MCP transport is required. | [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:16`] [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:57`] |
| `/speckit:*` commands | Current command surface is `/speckit:complete`, `plan`, `implement`, `resume`, `save` and `search`. `plan` stops before implementation, `implement` requires planning, `save` writes continuity through `generate-context.js`, and `search` is lexical with exit 1 for no-hit and 2 for errors. | [SOURCE: `.opencode/commands/speckit/plan.md:2`] [SOURCE: `.opencode/commands/speckit/implement.md:2`] [SOURCE: `.opencode/commands/speckit/save.md:19`] [SOURCE: `.opencode/commands/speckit/search.md:138`] |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | One-line correction | Source |
|---|---|---|---|---|---|---|
| Not opened in this angle; draft walk reserved for iteration 10 | Runtime and retrieval surface | MISSING | The current surface is `runtime/cli/`, with lexical trigger-index and ripgrep retrieval, 40 registered validators and explicit `/speckit:save` and `/speckit:search`. | P0 | Replace the draft’s old memory/MCP runtime description with the runtime CLI and lexical retrieval contract. | [SOURCE: `.opencode/skills/system-spec-kit/SKILL.md:460`] |

## DISAGREEMENTS

README-versus-registry contradiction: `.opencode/skills/README.txt:30` is stale about the wider library count, while system-spec-kit’s own README agrees with the 40-rule registry at `.opencode/skills/system-spec-kit/README.md:448`.

## CONFIDENCE

Confirmed: runtime paths, 40 registry entries, four public levels, addon controls, retrieval scripts and command behavior were opened directly. Inferred: the 39-file rule-script count is a filesystem count while the 40-rule registry is authoritative because native and TypeScript rules do not each require a shell file.

## Questions Answered

- What does system-spec-kit ship now, including runtime CLI, rules, templates, addons and `/speckit:*` commands?

## Questions Remaining

- Map the deep-loop modes and executor contracts.
- Reproduce the draft’s exact runtime claims against its lines.

## Next Focus

SYSTEM-DEEP-LOOP: inspect modes, command files, executor allowlists, fan-out, convergence, ledger and reducer behavior.

## Reflection

The runtime is clearly a nested CLI package rather than the old top-level script/MCP layout. The retrieval README explicitly declares no daemon or MCP transport. No repository files outside the lineage were changed.
