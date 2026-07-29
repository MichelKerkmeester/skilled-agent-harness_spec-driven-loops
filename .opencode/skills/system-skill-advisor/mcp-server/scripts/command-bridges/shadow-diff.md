# Command Bridge Shadow Diff

Shadow-phase evidence only. The live TypeScript and Python bridge definitions remain unchanged.

## Inventory

| Authority | Entry count |
| --- | ---: |
| JSON-derived command metadata | 22 |
| Residual allow-list | 8 |
| Generated projection | 30 |
| Live TypeScript `COMMAND_BRIDGES` | 6 |
| Live Python `COMMAND_BRIDGES` | 16 |

## Exclusive IDs

These rows are mutually exclusive: an ID listed here is absent from both other authorities.

| Region | Count | IDs |
| --- | ---: | --- |
| Only in JSON-derived | 15 | `command-create-benchmark`, `command-create-command`, `command-create-diff`, `command-create-flowchart`, `command-create-skill-parent`, `command-deep-ai-council`, `command-deep-alignment`, `command-deep-command-benchmark`, `command-deep-model-benchmark`, `command-deep-research`, `command-deep-review`, `command-deep-skill-benchmark`, `command-interface-design`, `command-interface-design-reference`, `command-prompt-improve` |
| Only in live TypeScript | 4 | `create:agent`, `create:manual-testing-playbook`, `deep-model-benchmark`, `memory:save` |
| Only in live Python | 7 | `command-prompt-improver`, `command-spec-kit-complete`, `command-spec-kit-deep-research`, `command-spec-kit-deep-review`, `command-spec-kit-implement`, `command-spec-kit-plan`, `command-spec-kit-resume` |

Additional overlap: JSON-derived and Python share 7 IDs; TypeScript and Python share the residual IDs `command-spec-kit` and `command-memory-save`; no ID appears in all three authorities.

## Granularity Mismatches

| Mismatch group | Count | Evidence |
| --- | ---: | --- |
| Spec Kit family | 1 | TypeScript collapses `/speckit:*`, `/deep:research`, and `/deep:review` into `command-spec-kit`; Python carries six specific `command-spec-kit-*` entries plus the generic bridge; JSON carries canonical deep command IDs but no system-spec-kit metadata. |
| Memory save aliases | 1 | TypeScript carries `memory:save` and `command-memory-save`; Python carries only `command-memory-save`; JSON has no system-spec-kit metadata entry. |
| Create command ID shape | 2 | TypeScript uses `create:agent` and `create:manual-testing-playbook`; JSON and Python use the `command-create-*` form. |
| Deep model benchmark ID shape | 1 | TypeScript uses `deep-model-benchmark`; JSON uses `command-deep-model-benchmark`; Python has no bridge. |
| Prompt command generation | 1 | JSON declares `/prompt:improve` as `command-prompt-improve`; Python retains legacy `/prompt` as `command-prompt-improver`; TypeScript has no bridge. |

Mismatch summary: 5 groups covering 6 concrete ID-shape or granularity differences.

## Python Shadow Check

`--check-command-bridges` compares the 30-entry generated projection with the 16-entry live Python dictionary:

| Result | Count |
| --- | ---: |
| Generated IDs missing from live Python | 16 |
| Live Python IDs absent from generated | 2 |
| Shared IDs with command/owner mismatches | 0 |
| Explicit known-diff IDs pinned by the drift guard | 18 |
