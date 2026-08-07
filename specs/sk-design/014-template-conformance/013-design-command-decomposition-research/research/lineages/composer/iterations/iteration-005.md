# Iteration 5: Middle-Path Alternatives

## Focus
Lanes vs new commands.

## Findings (confirmed)
1. **`--mode` lanes** already public: direction|directions|redesign|preflight|handoff. [SOURCE: .opencode/commands/interface/design.md:3]
2. **`tasks[]`** maps 17 INTENT_SIGNALS to argument/internal/hidden lanes. [SOURCE: .opencode/skills/sk-design/command-metadata.json:126-234]
3. **Transform verbs** via taskProjections — advisory, not commands. [SOURCE: command-metadata.json:236-292]
4. Splitting duplicates lanes while breaking 1:1 workflowMode:command in mode-registry.

## Assessment
- newInfoRatio: 0.82
