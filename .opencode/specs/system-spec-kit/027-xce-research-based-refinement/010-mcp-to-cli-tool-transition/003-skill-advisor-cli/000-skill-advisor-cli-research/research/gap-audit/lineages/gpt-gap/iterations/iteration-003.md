# Iteration 3: LENS-3 Runtime Pairing Completeness

## Focus

Compare the phase-3 runtime pairing scope against the actual adapter, shim, plugin, config, and doctor inventory in the repository. Verify that Gemini is deliberately excluded in documentation rather than accidentally omitted.

## Findings

1. P1 GAP: Gemini exclusion is not documented in the phase packet even though Gemini advisor surfaces exist. The program and phase parent define required runtime pairing as Claude Code, Codex, and Devin plus OpenCode plugin [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/spec.md:117], [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/spec.md:109]. The repository still has a Gemini advisor hook implementation [SOURCE: file:.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts:3] and a Gemini feature catalog entry [SOURCE: file:.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/gemini-hook.md:17]. The audit prompt says Gemini implementation is a non-gap only if the exclusion is documented; phase 3 currently omits Gemini without an explicit out-of-scope note [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:93].

2. P1 GAP: phase 3 does not name the actual runtime file inventory it must verify. The phase names the target hook adapters glob, OpenCode bridge, configs, doctor routes, allowlists, and docs [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:93]. Actual active surfaces include OpenCode config [SOURCE: file:opencode.json:47], Codex MCP config [SOURCE: file:.codex/config.toml:104], Claude MCP config [SOURCE: file:.claude/mcp.json:37], Devin MCP config [SOURCE: file:.devin/config.json:37], Codex hook config [SOURCE: file:.codex/settings.json:14], Claude hook config [SOURCE: file:.claude/settings.local.json:31], Devin hook config [SOURCE: file:.devin/hooks.v1.json:1], OpenCode plugin transform [SOURCE: file:.opencode/plugins/mk-skill-advisor.js:710], plugin bridge [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:276], and doctor assets [SOURCE: file:.opencode/commands/doctor/assets/doctor_skill-advisor.yaml:22], [SOURCE: file:.opencode/commands/doctor/assets/doctor_skill-budget.yaml:23]. The phase should list these as verification inventory before implementation starts.

3. The deprecated system-spec-kit hook locations are shims, not separate implementations, but phase 3 should still mention them for config verification. Codex and Claude active hook configs can point at `system-spec-kit` hook paths [SOURCE: file:.codex/settings.json:19], [SOURCE: file:.claude/settings.local.json:38]. Those source files delegate to the advisor-owned compiled hook [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:5], [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:5]. If phase 3 changes only the advisor hook implementation, runtime behavior updates through the shim, but the transport-down drill must include the configured shim paths.

4. The OpenCode plugin scope is correctly present. The plugin appends advisor brief content through `experimental.chat.system.transform` [SOURCE: file:.opencode/plugins/mk-skill-advisor.js:710], and the phase explicitly requires the bridge to gain CLI fallback [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:94].

5. Doctor route ownership is present but too generic for implementers. Phase 3 says add CLI checks to doctor:skill-advisor and skill-budget surfaces [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:96]. Actual doctor YAMLs have different mutation models: skill-advisor can mutate scorer/metadata after approval [SOURCE: file:.opencode/commands/doctor/assets/doctor_skill-advisor.yaml:72], while skill-budget is strictly read-only [SOURCE: file:.opencode/commands/doctor/assets/doctor_skill-budget.yaml:23]. The phase should preserve that distinction when adding CLI checks.

## Sources Consulted

- Program and skill-advisor phase specs
- Phase 3 spec, plan, tasks
- Runtime configs: `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, `.devin/config.json`, `.codex/settings.json`, `.claude/settings.local.json`, `.devin/hooks.v1.json`
- Hook shims and hook implementations
- OpenCode plugin and bridge
- Doctor YAML assets

## Assessment

`newInfoRatio`: 0.82. Novelty is high because actual runtime inventory exposes two implementation-facing documentation gaps.

Confidence: high on Gemini existence and phase omission; high on inventory gap; medium on exact runtime config precedence for Devin local overrides.

## Reflection

What worked: distinguishing target implementation files from configured shim files. What failed: relying on high-level runtime names would miss the deprecated shim layer. Ruled out: requiring Gemini implementation.

## Recommended Next Focus

LENS-4: sequencing, estimates, and cross-workstream launcher/socket/model-server concerns.
