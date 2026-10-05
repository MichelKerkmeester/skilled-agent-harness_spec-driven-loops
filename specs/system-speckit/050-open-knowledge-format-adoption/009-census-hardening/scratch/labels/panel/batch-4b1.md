
## Row 101 (ambiguous)
- Doc: `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/011-deep-research-swe-2/research/lineages/swe-2-research/iterations/iteration-004.md:47`
- Citation: `goal.md:116`
- Candidates: `.claude/commands/create/goal.md`, `.skilled/commands/create/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/002-hermes-contract-pin/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/003-deep-loop-executor-support/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/004-cli-hermes-skill-packet/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/005-hermes-runtime-folder/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/006-hermes-hook-and-plugin-layer/goal.md` and 456 more

```text
**11. When the deletion surface turns out to be load-bearing, halt — do not work around it.** Phase 005 found the MCP `Server` object was the socket's request handler, not a stdio transport, and stopped rather than deleting the socket the CLI depends on; the phase reopened and the wire migration shipped in `3def6d6c9b`. [SOURCE: command:`git show 3def6d6c9b`]

**12. Rename after the removal, and carry everything that names the path — including generated artifacts, which are regenerated, not edited.** `git mv` plus 407 path updates: launcher, CLI shim, plugin, doctor scripts, tsconfig outputs, freshness key, the cross-package shim, and the committed trigger index (`f5c55c7eb8`). Renaming first would hide deletions inside a move diff. [SOURCE: command:`git show 3feab865ea`] [SOURCE: file:goal.md:116] [SOURCE: file:spec.md:158]

### D. Sweep residue by claims, over the whole repo, with explicit keep-classes
```

