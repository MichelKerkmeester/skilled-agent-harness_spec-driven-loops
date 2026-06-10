# Iteration 5: LENS-5 Adversarial Residual Sweep

## Focus

Find contradictions between packet docs and source, hedged claims presented as settled, missing failure modes, and day-one implementation traps.

## Findings

- P2 gap: Codex's code-index MCP note contradicts the current launcher/server source and the other runtime configs about the default DB location. Codex says the DB lives at `.opencode/.spec-kit/code-graph/database` by default; launcher and server config say skill-local `.opencode/skills/system-code-graph/mcp_server/database`; Claude/OpenCode/Devin notes agree with skill-local. This is note-level drift, not a runtime blocker, but it will mislead implementers touching configs. [SOURCE: file:.codex/config.toml:99] [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:99] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/core/config.ts:14] [SOURCE: file:.claude/mcp.json:68]

- P2 gap: the code-index parent "Files to Change" section still describes a future CLI entrypoint only, while the phase map below it already says phases 001-003 are scaffolded with CLI core, hardening/tests, and runtime integration. The phase map is authoritative enough, so this is stale parent prose rather than a blocking contradiction. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:83] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:100]

- P2 gap: phase-1 `NOT Zod` prose truncation appears in both spec and tasks. It does not erase the acceptance criteria, but it is exactly the kind of small doc defect that can cause implementation review churn. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:68] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/tasks.md:58]

- No P0 contradiction found. Blocked-read handling is consistently named as top risk in research and phase 1; handler evidence shows query/context/detect_changes all return blocked/degraded envelopes instead of false empty success on stale readiness. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research/research/research.md:32] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1263] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:224] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:255]

## Sources Consulted

- [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/README.md:142]
- [SOURCE: file:opencode.json:80]
- [SOURCE: file:.devin/config.json:68]
- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:101]
- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:103]

## Assessment

- newInfoRatio: 0.34
- Novelty justification: Residual sweep produced no new P0/P1 beyond earlier iterations, but found three P2 cleanup items.
- Confidence: High for note drift and truncation; high that no P0 blocker exists in the audited docs.

## Reflection

- What worked and why: Comparing config notes against launcher source surfaced a real contradiction.
- What did not work and why: Historical spec hits were too noisy to classify current gaps.
- What I would do differently: Add automated stale-prose checks for moved DB locations and phase-parent file tables.

## Ruled Out

- Blocking implementation on DB note drift. The source code and most runtime configs agree on skill-local behavior.

## Dead Ends

- No evidence that checklist.md absence in planned-state phase packets is a gap; it remains an explicit non-gap per audit input.

## Recommended Next Focus

Synthesis: emit numbered gap register with no P0s, two P1s, and three P2s.
