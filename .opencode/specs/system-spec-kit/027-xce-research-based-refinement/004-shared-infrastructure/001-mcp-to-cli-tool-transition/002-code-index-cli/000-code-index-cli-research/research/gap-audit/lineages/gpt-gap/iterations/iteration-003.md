# Iteration 3: LENS-3 Runtime Pairing Completeness

## Focus

Compare phase-3 pairing scope against the actual runtime adapters, OpenCode plugin, and bridge/config inventory. Verify Gemini is documented as out of the required pairing set.

## Findings

- The three required hook adapters exist and are the right conceptual targets. Claude SessionStart builds startup sections from the code-graph boundary; Codex wraps the Claude startup section builder for Codex SessionStart; Devin has a code-graph SessionStart hook that reads the startup marker directly. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:26] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts:19] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts:3] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts:36]

- The OpenCode plugin repair is real and already owned by phase 3. The plugin points at `system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`, while the bridge imports dist modules that are absent under system-code-graph and present under system-spec-kit. Phase 3 explicitly says to repair `mk-code-graph-bridge.mjs` import drift before adding CLI fallback. [SOURCE: file:.opencode/plugins/mk-code-graph.js:47] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:5] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/spec.md:95]

- P1 gap: the phase-3 docs do not enumerate actual runtime registration files. The implementation will need at least `.claude/settings.local.json`, `.codex/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`, runtime MCP configs, `.opencode/plugins/mk-code-graph.js`, and the bridge file. The plan's affected-surface table says "See spec.md Files to Change", but spec.md only gives a generic row. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/plan.md:86] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/spec.md:107] [SOURCE: file:.claude/settings.local.json:56] [SOURCE: file:.codex/settings.json:3] [SOURCE: file:.devin/hooks.v1.json:14]

- Gemini is a non-gap under current scope. The program-wide pairing rule names Claude Code, Codex, and Devin; code-index phase 3 repeats the same trio; the Gemini README says Gemini adapters are retained for operators outside this repo and that no project-level Gemini hook registration file ships. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md:117] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/spec.md:94] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md:28]

## Sources Consulted

- [SOURCE: file:.opencode/plugins/README.md:45]
- [SOURCE: file:.opencode/plugins/README.md:55]
- [SOURCE: file:.opencode/plugins/README.md:60]
- [SOURCE: file:.claude/settings.local.json:61]
- [SOURCE: file:.codex/settings.json:7]
- [SOURCE: file:.devin/hooks.v1.json:19]

## Assessment

- newInfoRatio: 0.65
- Novelty justification: Adapter existence and Gemini scope were partly expected; the missing registration-file inventory is new audit value.
- Confidence: High for P1 affected-surface gap; phase 3 needs the file inventory before implementation.

## Reflection

- What worked and why: Comparing live runtime registration files against phase-3 prose made the missing inventory concrete.
- What did not work and why: Absence checks for dist files are command evidence, not file-line evidence; I used bridge import lines plus phase-3 ownership lines instead.
- What I would do differently: Add a phase-3 resource-map table before implementation starts.

## Ruled Out

- Gemini hook implementation as a required code-index gap. Scope is three runtimes plus OpenCode plugin.

## Dead Ends

- OpenCode import drift is not an unowned gap; phase 3 names it directly.

## Recommended Next Focus

LENS-4: Validate sequencing, estimates, and shared launcher/socket risks.
