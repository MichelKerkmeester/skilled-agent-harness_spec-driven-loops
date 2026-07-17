# Gap Audit Synthesis - GPT Gap Lineage

- Date: 2026-06-06
- Session: `fanout-gpt-gap-1780758130805-1e67fs`
- Requested executor: `cli-codex model=gpt-5.5`
- Actual execution: direct Codex session, because nested `cli-codex` self-invocation is prohibited by the executor skill
- Iterations: 5/5
- Stop reason: `maxIterationsReached`
- Verdict: `GAP_REGISTER_REQUIRED`

## 1. Verdict

No P0 blockers found. Implementation can proceed into phase 1 if the two P1s are either fixed now or explicitly carried into the phase-3 planning gate. The packet is not COMPLETE by the audit's own standard because P1 gaps remain.

## 2. Numbered Gap Register

| # | Severity | Gap | Evidence | Fix |
|---|---|---|---|---|
| G1 | P1 | Phase 3 lacks an exact affected-surface inventory. The plan's affected-surface table points back to spec.md, while spec.md only says "Runtime hook adapters + plugin bridge + configs + docs." Actual work spans runtime hook registration files, MCP configs, OpenCode plugin entrypoint, and the bridge. | [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/plan.md:86] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/spec.md:107] [SOURCE: file:.claude/settings.local.json:56] [SOURCE: file:.codex/settings.json:3] [SOURCE: file:.devin/hooks.v1.json:14] | Add a phase-3 affected-surface table naming concrete files: `.claude/settings.local.json`, `.codex/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`, `.codex/config.toml`, `.claude/mcp.json`, `.devin/config.json`, `opencode.json`, `.opencode/plugins/mk-code-graph.js`, `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`, and docs touched for fallback guidance. |
| G2 | P1 | Prompt-time dual-failure acceptance is missing. Phase 1 requires auto-spawn from a stopped daemon, while phase 3 requires warm-only fail-open hook behavior. No requirement explicitly covers MCP down plus daemon absent/dead in a prompt hook, with no cold spawn and return within hook timeout. | [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:126] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/spec.md:94] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/spec.md:119] [SOURCE: file:.claude/settings.local.json:61] [SOURCE: file:.codex/settings.json:7] [SOURCE: file:.devin/hooks.v1.json:19] | Add acceptance criteria and tests for hook warm-only mode: MCP transport stopped, daemon socket absent/dead, CLI invocation uses no cold spawn, returns fail-open within the runtime timeout, and surfaces retryable status without blocking the prompt path. |
| G3 | P2 | Codex config's code-index DB note is stale. It says default DB lives under `.opencode/.spec-kit/code-graph/database`; launcher and server config say the default is skill-local under `.opencode/skills/system-code-graph/mcp_server/database`, and other runtime configs agree. | [SOURCE: file:.codex/config.toml:99] [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:99] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/core/config.ts:14] [SOURCE: file:.claude/mcp.json:68] | Update `.codex/config.toml` note to match the launcher/server source and other runtime configs. |
| G4 | P2 | Phase-1 prose is truncated around the "NOT Zod" validation note in both spec and tasks. The requirement remains recoverable, but the broken prose is a review trap. | [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:68] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/tasks.md:58] | Complete the sentence in both files: validation parity uses `validateToolArgs()` plus dispatcher required-field checks, not Zod. |
| G5 | P2 | The code-index parent "Files to Change" section is stale. It still says the CLI entrypoint/shim is future-only, while the phase map below already lists phases 001-003 as scaffolded and pending. | [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:83] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:100] | Refresh the parent table or point readers to the phase map so implementers do not treat runtime integration as unscaffolded. |

## 3. Clean Checks

- 8/8 tool ownership is covered. The tool schema exports exactly the 8 expected tools, and phases 1/2 own the CLI and regression-locking work. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:186] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:93] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests/spec.md:93]
- OpenCode import drift is real but owned by phase 3. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/spec.md:95] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:5]
- Gemini hook work is a non-gap under current scope. The program-wide pairing rule and code-index phase 3 name Claude Code, Codex, and Devin; Gemini adapters are retained for external operators and no project-level Gemini hook registration ships. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md:117] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md:28]
- Literal socket directory collision is not present in the active runtime configs. [SOURCE: file:.codex/config.toml:67] [SOURCE: file:.codex/config.toml:92] [SOURCE: file:.codex/config.toml:109]

## 4. D-Series Traceability

| Delta | Owning phase | Status |
|---|---|---|
| D1 stable shim | 001-cli-core | Covered |
| D2 compiled CLI implementation | 001-cli-core | Covered |
| D3 all-8 manifest parity | 001-cli-core + 002-hardening-and-tests | Covered |
| D4 validation parity | 001-cli-core | Covered |
| D5 blocked-read rendering | 001-cli-core + 002-hardening-and-tests | Covered |
| D6 exit taxonomy | 001-cli-core | Covered |
| D7 timeout and hook policy plumbing | 001-cli-core + 003-runtime-integration | Covered, but G2 adds missing dual-failure acceptance |
| D8 dual-client test | 002-hardening-and-tests | Covered |
| D9 dual-spawn/dead-socket-respawn test | 002-hardening-and-tests | Covered |
| D10 dist-freshness guard | 001-cli-core | Covered |

## 5. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Report MCP removal as a gap | Dual-stack keeps MCP registered; full removal is out of scope. | [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:80] | 1 |
| Require Zod at argv boundary | Code-index uses hand-coded schema subset validation plus dispatcher required checks. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:200] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:88] | 2 |
| Treat Gemini hooks as required code-index work | Current pairing rule names Claude Code, Codex, Devin, plus OpenCode plugin; Gemini has no repo-level registration file. | [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md:117] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md:28] | 3 |
| Report literal socket-dir collision | Runtime configs pin distinct service socket directories. | [SOURCE: file:.codex/config.toml:67] [SOURCE: file:.codex/config.toml:92] [SOURCE: file:.codex/config.toml:109] | 4 |

## 6. Open Questions

- Should G1 and G2 be fixed immediately in the packet docs before phase 1 starts, or explicitly assigned to the phase-3 `speckit:plan` gate? The audit recommendation is to fix both now because they are cheap doc/acceptance additions and reduce rediscovery.

## 7. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- newInfoRatio trend: 1.00 -> 0.78 -> 0.65 -> 0.52 -> 0.34
- Gap counts: P0=0, P1=2, P2=3

## 8. References

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research/research/research.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/{001-cli-core,002-hardening-and-tests,003-runtime-integration}/{spec.md,plan.md,tasks.md}`
- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/{query,context,detect-changes}.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/{claude,codex,devin,gemini}/`
- `.opencode/plugins/mk-code-graph.js`
- `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`
- `.codex/config.toml`, `.codex/settings.json`, `.codex/hooks.json`, `.claude/mcp.json`, `.claude/settings.local.json`, `.devin/config.json`, `.devin/hooks.v1.json`, `opencode.json`
