# Iteration 4: Command-Split Cost Quantification

## Focus
Count files and validator constraints per new command.

## Findings (confirmed)
1. **~4 opencode files/command:** doc + auto YAML + confirm YAML + presentation. [SOURCE: .opencode/commands/interface/]
2. **+1 claude mirror** minimum. [SOURCE: glob]
3. **Validator binds:** next non-empty (:357-360); preferSiblingWhen exact sibling set (:916-917); typicallyBefore subset of next (:978-983); handoff.nextOptions match next (:1247-1248). [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs]
4. **Tests enumerate canonical commands** — both test files need updates. [SOURCE: interface-command-contract.test.mjs:10-13; design-command-surface-check.test.mjs:63-70]
5. **Estimate:** ~5-6 files + ~150-250 lines metadata + full sibling graph rewire per command.

## Assessment
- newInfoRatio: 0.90
