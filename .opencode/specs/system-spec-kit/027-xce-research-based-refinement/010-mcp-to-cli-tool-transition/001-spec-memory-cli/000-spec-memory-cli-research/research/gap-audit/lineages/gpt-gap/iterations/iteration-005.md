# Iteration 5: Adversarial Residual Sweep

## Focus

Look for contradictions, unsupported settled claims, missing failure modes, and day-one implementer traps across the spec-memory workstream after the first four lenses.

## Findings

1. The strongest day-one trap remains Codex live hook wiring. Phase 3 tells implementers to extend `hooks/codex/session-start` [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:97], and the Codex template agrees [SOURCE: file:.codex/settings.json:8]. But the checked-in live hook file invokes Claude hook paths for PreCompact, SessionStart, and UserPromptSubmit [SOURCE: file:.codex/hooks.json:9] [SOURCE: file:.codex/hooks.json:21] [SOURCE: file:.codex/hooks.json:32]. The phase must either update/verify `.codex/hooks.json` or explicitly state that the live hook registration is outside this packet and name the owner. Otherwise Codex can pass a source-level adapter check while still not using the CLI-backed path in a live workspace.

2. The Gemini contradiction remains unresolved. The program-wide runtime pairing rule excludes Gemini by naming only Claude/Codex/Devin hooks plus OpenCode plugin [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/spec.md:117] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/spec.md:118], but phase 3 includes Gemini settings and allowlisting [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:66] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:96]. This is not a runtime engineering unknown; it is a documentation/scope contradiction that should be fixed before phase 3 planning.

3. Major failure modes are covered. Both MCP-down and daemon-down are addressed by the additive CLI plus auto-spawn: phase 1 requires auto-spawn on ENOENT/dead socket [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec.md:129], and phase 3 requires transport-down fallback guidance and stopped-MCP verification [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:131]. Fresh-checkout drift is covered by packaging/install verification [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec.md:100]. Concurrent worktree/socket cases are covered by D1's divergent socket-dir test and the bridge's owner-recorded socket preference [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/tasks.md:57] [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:338].

4. No P0 implementation blocker was found. The CLI core and hardening phases have enough scope authority to start once their normal planning passes run. The P1s are both phase-3 planning defects: they can be fixed by tightening docs/tasks before runtime integration begins.

## Sources Consulted

- All prior iteration evidence
- Phase 3 runtime-integration spec/tasks
- Live Codex hook files and Codex template
- Program parent runtime pairing rule
- Shared launcher bridge

## Assessment

`newInfoRatio`: 0.62.

Novelty justification: this was a consolidation pass; it added confidence that the residual gaps are phase-3 documentation/config-scope issues, not CLI-core blockers.

Confidence: high.

## Reflection

What worked: using live config files as adversarial evidence separated real traps from planned-state harmlessness.

What failed: there is no single phase-3 resource map that enumerates every runtime config path, so implementers could miss a live-vs-template mismatch.

Ruled out: claiming the whole workstream is incomplete. The gap register is specific and bounded.

## Recommended Next Focus

Fix phase 3 planning scope before runtime-integration implementation: Codex hook registration and Gemini exclusion/ownership.
