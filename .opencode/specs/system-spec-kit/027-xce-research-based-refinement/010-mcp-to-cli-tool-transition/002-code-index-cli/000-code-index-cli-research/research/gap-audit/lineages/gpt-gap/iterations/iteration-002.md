# Iteration 2: LENS-2 Delta and Requirement Traceability

## Focus

Trace every research design delta to phase requirements/tasks, and every phase requirement back to research evidence.

## Findings

- D1, D2, and D10 are owned by phase 1 through the stable shim and dist-freshness guard. D3 and D4 are owned by manifest codegen and validateToolArgs parity. D5 is owned by blocked-read rendering. D6 and D7 are owned by exit taxonomy and timeout/warm-only policy plumbing. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research/research/research.md:39] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:93] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:96]

- D8 and D9 are owned by phase 2. The requirements explicitly require a dual-client test and dual-spawn/dead-socket-respawn test, while tasks T001 and T002 mirror the same work. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests/spec.md:119] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests/spec.md:120] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests/tasks.md:57]

- P2 gap: phase-1 prose is truncated in both spec and tasks around the "NOT Zod" note. Acceptance criteria still preserve the requirement, but the broken sentence can confuse implementation and review. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:68] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/tasks.md:58]

## Sources Consulted

- [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:200]
- [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:213]
- [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:61]
- [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:67]
- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:119]
- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:127]

## Assessment

- newInfoRatio: 0.78
- Novelty justification: The delta ownership was mostly expected; the truncated phase-1 text was new.
- Confidence: High. D1-D10 all have an owning phase; no orphan delta found.

## Reflection

- What worked and why: Mapping research §5 and §10 against phase spec scope lines found a clean ownership chain.
- What did not work and why: Phase task rows are intentionally coarse planned-state rows, so requirement tables are the better traceability source.
- What I would do differently: Use a D-series table in the final synthesis to reduce duplicate prose.

## Ruled Out

- Zod reuse as a missing requirement: the research and source both show code-index validation is hand-coded schema subset validation plus dispatcher required-field checks. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:200] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:88]

## Dead Ends

- No D-series orphan found in phase 2.

## Recommended Next Focus

LENS-3: Compare phase-3 runtime pairing scope with actual adapter, plugin, and config inventory.
