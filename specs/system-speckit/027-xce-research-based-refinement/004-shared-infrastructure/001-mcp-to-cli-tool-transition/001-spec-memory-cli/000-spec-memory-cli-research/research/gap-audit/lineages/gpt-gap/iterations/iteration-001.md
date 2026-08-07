# Iteration 1: Coverage Cross-Check

## Focus

Reconcile the phase-000 parity and daemon-affordance findings against the three implementation phase specs. The question was whether every tool, daemon service, and MCP affordance has exactly one owner, or whether any item is unowned/double-owned before implementation starts.

## Findings

1. The 37-tool CLI surface is owned by phase 1, and the parity lock is owned by phase 2. Phase 1 requires all 37 subcommands generated from `TOOL_DEFINITIONS`, with `list-tools` enumerating 37 and no handwritten mapping [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:127]. Phase 2 owns the all-37 parity suite and makes drift fail loudly [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/spec.md:136].

2. The daemon-service preservation story is covered by the phase split. Phase 1 explicitly keeps the daemon stack unchanged and makes the CLI an IPC client over the existing launcher, bridge, session proxy, schemas, and handlers [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:65]. Phase 2 regression-locks the daemon safety properties discovered in research: dual-spawn, dual-client coexistence, lifecycle cleanup, and all-37 parity [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/spec.md:68].

3. The MCP-affordance replacements mostly have clean owners. Tool-schema discovery becomes `list-tools` in phase 1 [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:127], argv validation and `--json` are phase 1 [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:96], retryable/terminal exits are phase 1 with exit-69 docs in phase 2 [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:130] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/spec.md:101], and runtime permission/hook affordances are phase 3 [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:95].

4. P2 scope ambiguity: phase 3 still names Gemini in runtime configs/allowlists even though the program-wide pairing rule names Claude Code, Codex, Devin, and OpenCode plugin surfaces. The program requirement names hooks for Claude/Codex/Devin and an OpenCode plugin, with no Gemini hook pairing [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md:117] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md:118]. Phase 3, however, lists Gemini settings as a dependency and Gemini allowlisting as in scope [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:66] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:96]. This is not a CLI-core coverage blocker, but it needs cleanup before runtime planning.

## Sources Consulted

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md`

## Assessment

`newInfoRatio`: 0.82.

Novelty justification: the broad ownership split was already present, but the Gemini runtime-scope ambiguity became visible only when the phase specs were cross-checked against the program-wide pairing rule.

Confidence: high for phase 1/2 coverage, medium for Gemini severity because the operator exclusion lives in the audit charter rather than in the checked-in phase docs.

## Reflection

What worked: phase maps and requirements were enough to map almost all research parity claims to phase owners.

What failed: broad labels like "runtime permission configs" are too coarse to prove exact runtime coverage.

Ruled out: reporting missing `checklist.md` as a gap; these child phases are in planned state and the audit charter says not to count that.

## Recommended Next Focus

LENS-2: trace D1-D7 and DD-001 to concrete phase requirements and tasks.
