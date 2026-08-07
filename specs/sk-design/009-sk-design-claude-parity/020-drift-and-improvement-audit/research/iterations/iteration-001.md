# Iteration 1: Command Router and Asset Validation

## Focus
This iteration investigated whether `.opencode/commands/design/**` and their router/assets split still validate against the sk-design command-surface checker.

## Findings
1. **P1 bug — the design command surface currently fails its own validator.** Running `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` returned `STATUS=INVALID STAGE=metadata`, ten invalid metadata errors, and `SUMMARY invalid=10 drift=0`; the validator is the checked-in command-surface gate for `/design:audit`, `/design:foundations`, `/design:interface`, `/design:md-generator`, and `/design:motion`. [SOURCE: command:node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:36]
2. **P1 bug — `:auto|:confirm` is modeled as an argumentGrammar flag even though the validator requires flag names to be long flags.** The checker reported `argumentGrammar.flags[*].name must be a long flag such as --scope`; command metadata stores `:auto|:confirm` inside `flags` for audit, foundations, interface, md-generator, and motion. [SOURCE: command:node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs] [SOURCE: .opencode/skills/sk-design/command-metadata.json:28] [SOURCE: .opencode/skills/sk-design/command-metadata.json:32]
3. **P1 drift — command metadata sibling-discriminator coverage excludes the registered transport mode.** The validator expects every command's `preferSiblingWhen` to cover `/design:design-mcp-open-design` along with the other siblings, but `command-metadata.json` lists only foundations/interface/md-generator/motion for audit while `mode-registry.json` registers `design-mcp-open-design` as a sixth mode with `packetKind: transport`. [SOURCE: command:node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs] [SOURCE: .opencode/skills/sk-design/command-metadata.json:121] [SOURCE: .opencode/skills/sk-design/command-metadata.json:123] [SOURCE: .opencode/skills/sk-design/mode-registry.json:145]
4. **P2 improvement — the command-surface checker itself only enumerates the five public `/design:*` workflow commands, so the current contract is ambiguous about whether the transport should be command-addressable or discriminator-only.** `COMMANDS` contains five slash commands, while the registry and hub-router include `design-mcp-open-design`; the validator's sibling expectation implies the transport should be projected into sibling discrimination even without a wrapper markdown command. [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:36] [SOURCE: .opencode/skills/sk-design/mode-registry.json:145] [SOURCE: .opencode/skills/sk-design/hub-router.json:84]

## Ruled Out
- Router markdown frontmatter was not the primary failure: the checker halted in `metadata` stage before surface-drift comparison. [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:178]

## Dead Ends
- No command implementation fix was attempted; this run is research-only.

## Edge Cases
- Ambiguous input: whether `design-mcp-open-design` should get a public `/design:design-mcp-open-design` command remains unresolved; evidence shows the registry has a mode but `mode-registry.json` keeps `command: null`. [SOURCE: .opencode/skills/sk-design/mode-registry.json:157]
- Contradictory evidence: none beyond the command-vs-registry projection mismatch.
- Missing dependencies: none.
- Partial success: command validation failed, but the failure itself produced actionable audit evidence.

## Sources Consulted
- `.opencode/commands/design/interface.md:1`
- `.opencode/commands/design/md-generator.md:1`
- `.opencode/commands/design/assets/design_interface_auto.yaml:1`
- `.opencode/commands/design/assets/design_md-generator_auto.yaml:1`
- `.opencode/skills/sk-design/command-metadata.json:1`
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:36`
- `command:node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`

## Assessment
- New information ratio: 0.95
- Questions addressed: command router/assets validation; command metadata vs registry parity.
- Questions answered: the command surface does not currently pass its own checked-in validation gate.

## Reflection
- What worked and why: the dedicated validator gave direct repository-grounded failure evidence.
- What did not work and why: validator output did not identify line numbers, so metadata reads were needed to anchor the failures.
- What I would do differently: next pass should inspect naming drift and agent/registry parity after command metadata failures.

## Recommended Next Focus
Audit naming drift around `mcp-open-design` vs `design-mcp-open-design`, then agent and metadata parity.
