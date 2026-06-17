# Iteration 002: Security

## Focus
**Dimension**: Security — Vulnerabilities, exposure, secrets, trust boundaries, injection risks  
**Files reviewed**: `.opencode/skills/mcp-open-design/SKILL.md`, `.opencode/skills/mcp-open-design/references/mcp_wiring.md`, `.opencode/skills/mcp-open-design/references/od_cli_reference.md`, `.opencode/skills/mcp-open-design/references/tool_surface.md`, `.opencode/skills/sk-interface-design/SKILL.md`, `.opencode/skills/sk-interface-design/references/design_principles.md`, `.opencode/skills/sk-interface-design/references/variation_diversity.md`

## Scorecard
- Dimensions covered: correctness, security
- Files reviewed: 7
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F006**: MCP config stores daemon socket at world-readable /tmp path, `.opencode/skills/mcp-open-design/references/mcp_wiring.md:82`, The MCP wiring config populates `OD_SIDECAR_IPC_PATH=/tmp/open-design/ipc/release-stable/daemon.sock`. On a multi-user macOS system, `/tmp` is world-readable and writable (sticky bit). If the Open Design daemon is not running, another user could theoretically create a rogue socket at this path before the daemon starts. Risk is mitigated by the `release-stable` namespace subdirectory (must exist first) and the fact the socket is created by the desktop app (trusted process). However, the docs could note the `/tmp` surface area and recommend a per-user socket directory for higher-security environments. This is an environmental concern, not a skill bug, and the actual risk is very low on single-user macOS desktops.

- **F007**: Token handling guidance is incomplete — no safe-storage directive for `OD_TOOL_TOKEN`, `.opencode/skills/mcp-open-design/references/od_cli_reference.md:131`, The CLI reference documents `OD_TOOL_TOKEN` (bearer) that "the daemon injects when it spawns an agent" and notes standalone use "may need those env vars set." The skill has a "never paste credentials into prompts" rule (SKILL.md:260) but does not extend this to safe token storage — no mention of secrets managers, env-file permissions, or avoidance of plaintext config storage. Since `OD_TOOL_TOKEN` is a bearer token, plaintext exposure in shell history or config files is a concern the skill should address, even if the primary path is daemon-injected.

- **F008**: Manual fallback hardcodes absolute app path that may not exist, `.opencode/skills/mcp-open-design/references/mcp_wiring.md:125-126`, The manual config fallback hardcodes `"/Applications/Open Design.app/Contents/MacOS/Open Design"`. For users who installed via non-standard paths (Homebrew, custom location, or a future versioned app bundle), the hardcoded path would fail. While not a vulnerability, incorrect path resolution could lead an agent to silently fail or worse, try alternative resolution mechanisms that are less safe. The docs could use a resolution pattern (e.g., "locate the app first") rather than a hardcoded absolute path.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | not_executed | hard | — | Deferred |
| checklist_evidence | not_executed | hard | — | Deferred |

## Assessment
- New findings ratio: 1.00 (all 3 findings are new; iteration 1 findings were correctness, these are security)
- Dimensions addressed: security
- Novelty justification: First security pass — F006 is a surface-area concern at the OS level, F007 is a token-handling guidance gap, F008 is a path resolution concern. All three are P2 because no exploit vector is demonstrated and the skill is markdown guidance (not executable code).

## Ruled Out
- **Command injection in `node "$OD_BIN"` invocations**: checked all documented CLI invocations. Arguments are quoted via `"$OD_BIN"` and project IDs come from prior tool output, not raw user input to the skill. No injection vector found.
- **Hardcoded secrets**: grep for `secret`, `password`, `api_key`, `token=` returned no matches that expose actual credentials. Token references are all documentation, never literal values.
- **`curl ... | sh` pattern**: explicitly warned against in both SKILL.md and README. The skill's ALWAYS rule 7 requires dry-run first. Good posture.
- **`ELECTRON_RUN_AS_NODE=1` abuse**: documented use of Electron as Node runtime is standard practice for packaged Electron apps. No privilege escalation vector since the Electron binary is within the signed app bundle.
- **`design_principles.md` security**: content is pure design guidance, no executable code, no unsafe patterns to review.
- **`variation_diversity.md` security**: seed math is internal agent scaffolding, no external I/O or secrets exposure.

## Dead Ends
- None in this iteration.

## Recommended Next Focus
**Dimension**: Traceability  
**Rationale**: The two core protocols (`spec_code` and `checklist_evidence`) need execution. Cross-reference the spec claims against the shipped skills, verify phased checklist items have evidence, and check that the phase-008 deprecation of mcp-magicpath left no stale references.

Review verdict: PASS
