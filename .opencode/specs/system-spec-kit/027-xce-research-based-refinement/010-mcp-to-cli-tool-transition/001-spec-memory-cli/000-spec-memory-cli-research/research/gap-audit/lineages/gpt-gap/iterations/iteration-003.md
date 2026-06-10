# Iteration 3: Runtime Pairing Completeness

## Focus

Compare phase 3's runtime-pairing scope against the actual adapter, plugin, and config inventory in the repo. This pass looks for named surfaces that do not match live wiring, and for missing documentation of deliberate exclusions.

## Findings

1. **P1 GAP-001: Codex hook wiring is misaligned between phase scope and the live workspace hook file.** Phase 3 says the Codex spec-memory-serving adapter is `system-spec-kit/mcp_server/hooks/codex/session-start` [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:97]. The Codex hook-system reference says live Codex readiness requires `[features].codex_hooks = true` plus user/workspace `hooks.json`, and specifically identifies `hooks/codex/session-start.ts` as the Codex startup entrypoint [SOURCE: file:.opencode/skills/system-spec-kit/references/config/hook_system.md:35] [SOURCE: file:.opencode/skills/system-spec-kit/references/config/hook_system.md:130]. The checked-in `.codex/settings.json` template also points at `dist/hooks/codex/session-start.js` and `dist/hooks/codex/user-prompt-submit.js` [SOURCE: file:.codex/settings.json:8] [SOURCE: file:.codex/settings.json:19]. But the live workspace `.codex/hooks.json` invokes the Claude compact/session/user-prompt scripts instead [SOURCE: file:.codex/hooks.json:9] [SOURCE: file:.codex/hooks.json:21] [SOURCE: file:.codex/hooks.json:32]. An implementer who only extends `hooks/codex/session-start` can miss the live hook file and leave Codex transport-down fallback unexercised.

2. **P1 GAP-002: Gemini exclusion is not documented; phase 3 currently does the opposite.** The audit charter treats Gemini hooks as deliberately excluded if documented. The program-level pairing rule names Claude Code, Codex, Devin, and OpenCode plugin surfaces, not Gemini [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/spec.md:117] [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/spec.md:118]. Phase 3, however, lists Gemini settings as a dependency and includes Gemini allowlisting in scope [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:66] [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:96]. The phase should either remove Gemini and mark it as an explicit non-goal, or promote it to a real requirement with files and acceptance criteria.

3. OpenCode plugin scope is complete for planned-state purposes. The repo currently auto-loads three OpenCode entrypoints: `mk-skill-advisor.js`, `mk-code-graph.js`, and `session-cleanup.js` [SOURCE: file:.opencode/plugins/README.md:40]. The same README says helper bridges live under owning skills, not in `.opencode/plugins/` [SOURCE: file:.opencode/plugins/README.md:52]. Phase 3 tasks correctly create a new spec-memory plugin and bridge following that pattern [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/tasks.md:63].

4. Claude and Devin are broadly covered, but phase 3 should name config files in the planning pass. Claude live settings call the system-spec-kit Claude hooks for UserPromptSubmit, PreCompact, SessionStart, and Stop [SOURCE: file:.claude/settings.local.json:31]. Devin live settings call the advisor user prompt hook and the system-spec-kit Devin session-start hook [SOURCE: file:.devin/hooks.v1.json:2] [SOURCE: file:.devin/hooks.v1.json:14]. Phase 3's broad `Runtime permission configs` row is enough for a scaffold [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:113], but the implementation plan should enumerate `.claude/settings.local.json`, `.codex/hooks.json`, `.codex/settings.json`, `.devin/hooks.v1.json`, and `.opencode/plugins/`.

## Sources Consulted

- Phase 3 runtime-integration spec/tasks
- Transition-program runtime pairing rule
- `.codex/hooks.json`, `.codex/settings.json`
- `.claude/settings.local.json`, `.devin/hooks.v1.json`
- OpenCode plugin README
- Hook-system reference

## Assessment

`newInfoRatio`: 0.90.

Novelty justification: this pass found the strongest actionable gaps: a Codex live-vs-template hook mismatch and a Gemini scope contradiction.

Confidence: high. Both gaps are backed by direct file references, and both affect the phase meant to close transport-down runtime access.

## Reflection

What worked: checking actual runtime config files caught a mismatch that the phase docs alone hide.

What failed: relying on generic "Codex" or "runtime config" labels is not enough when templates and live hook files differ.

Ruled out: treating the missing spec-memory OpenCode plugin as a gap; phase 3 explicitly owns creating it.

## Recommended Next Focus

LENS-4: sequencing, estimates, and cross-workstream shared infrastructure.
