# Iteration 7: aicouncil-skillbench-gates

**Dimensions**: correctness, consistency
**Files reviewed**: .opencode/commands/deep/ask-ai-council.md, .opencode/commands/deep/start-skill-benchmark-loop.md
**Findings**: P0=0 P1=1 P2=0

## Findings
### [P1] Phase 0 restart instruction only names the non-canonical council command (S07-001)
- **Dimension**: consistency | **Class**: instance-only
- **Location**: `.opencode/commands/deep/ask-ai-council.md:62`
- **Evidence**: The Phase 0 hard-block message tells users to restart with `/deep:ask-ai-council [arguments]`, while the same entrypoint declares canonical attached mode syntax as `/speckit:deep-council:auto` and `/speckit:deep-council:confirm` at line 92 and uses `/speckit:deep-council` in the execution-mode table at lines 340-342.
- **Recommendation**: Update the restart block to use the canonical `/speckit:deep-council[:auto|:confirm] [arguments]` form, or explicitly list both supported aliases while preserving the mode suffix semantics.
- **Scope proof**: Bounded to the Phase 0 failure message and command-name references inside the reviewed ask-ai-council entrypoint.

## Status
complete
