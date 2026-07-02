# Dimension

Correctness/integration, daemon launcher and startup surfaces: outer launcher build order, MCP server registration, IPC reclaim behavior, and crash-loop diagnostics for P1-001-style startup failures.

# Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28` - severity and evidence doctrine loaded before final calls.
- `.agents/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md:166` - iteration artifact contract loaded.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-state.jsonl:1` - run config and lineage.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-findings-registry.json:11` - active P1-001 registry entry.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-findings-registry.json:45` - active P1-002 registry entry.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-strategy.md:131` - iteration 7 focus.
- `.opencode/bin/code-index.cjs:86` - daemon-backed CLI freshness guard checks only the code-index CLI dist entrypoint.
- `.opencode/bin/code-index.cjs:117` - CLI shim validates its own dist before spawning the built CLI.
- `.opencode/bin/code-index.cjs:119` - CLI shim spawns `code-index-cli.js` without building spec-kit.
- `.opencode/bin/mk-code-index-launcher.cjs:1269` - launcher required artifacts list contains only code-graph `mcp_server/dist/index.js`.
- `.opencode/bin/mk-code-index-launcher.cjs:1283` - launcher bootstrap build is scoped to `kitDir`, the system-code-graph skill.
- `.opencode/bin/mk-code-index-launcher.cjs:1292` - bootstrap action text names only `@spec-kit/system-code-graph`.
- `.opencode/bin/mk-code-index-launcher.cjs:1297` - bootstrap runs local TypeScript from code-graph with `-p tsconfig.json`.
- `.opencode/bin/mk-code-index-launcher.cjs:1490` - daemon child server path is code-graph `mcp_server/dist/index.js`.
- `.opencode/bin/mk-code-index-launcher.cjs:1491` - launcher spawns the daemon child directly.
- `.opencode/bin/mk-code-index-launcher.cjs:1520` - child exit is mirrored by the launcher without special dependency classification.
- `.opencode/bin/mk-code-index-launcher.cjs:1536` - non-signal child exit becomes the launcher exit code.
- `.opencode/bin/mk-code-index-launcher.cjs:1038` - dead-socket reclaim path only respawns after socket/owner checks.
- `.opencode/bin/mk-code-index-launcher.cjs:1063` - reclaim respawn also calls the same code-graph-only `buildIfNeeded`.
- `.opencode/bin/mk-code-index-launcher.cjs:1712` - initial launcher startup calls `buildIfNeeded` before launch.
- `.opencode/bin/mk-code-index-launcher.cjs:1738` - initial startup then calls `launchServer`.
- `.opencode/bin/mk-code-index-launcher.cjs:1740` - launcher bootstrap exceptions are logged generically as `failed` JSON.
- `opencode.json:68` - OpenCode MCP config registers `mk_code_index`.
- `opencode.json:72` - OpenCode starts `.opencode/bin/mk-code-index-launcher.cjs` directly.
- `.claude/mcp.json:57` - Claude MCP config registers `mk_code_index`.
- `.claude/mcp.json:60` - Claude starts the same launcher directly.
- `.codex/config.toml:54` - Codex MCP config registers `mk_code_index`.
- `.codex/config.toml:56` - Codex starts the same launcher directly.
- `.opencode/install_guides/SET-UP - Code Graph.md:60` - setup guide documents manual spec-kit build as a prerequisite.
- `.opencode/install_guides/SET-UP - Code Graph.md:63` - setup guide command builds system-spec-kit manually, outside launcher startup.
- `.opencode/install_guides/README.md:710` - install guide check looks only for code-graph `dist/index.js`.
- `.opencode/install_guides/README.md:717` - install guide build path builds only system-code-graph.
- `.opencode/skills/system-code-graph/package.json:7` - code-graph build script runs only its own `tsc --build`.

# Findings by Severity

## P0

None.

## P1

No new P1 findings. This pass strengthens active P1-001 and leaves P1-002/P1-003 active.

### P1-001 [P1] Seeded-PPR recovery adds an unconditional missing compiled-module dependency

- Claim adjudication update: No reviewed launcher, daemon-backed CLI shim, runtime MCP registration, or reclaim path provides the remaining possible mitigation: a deterministic build or verification of `.opencode/skills/system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js` before code-graph imports `code-graph-context.js`.
- Evidence: OpenCode, Claude, and Codex all register `mk_code_index` to start `.opencode/bin/mk-code-index-launcher.cjs` directly. The launcher considers only `.opencode/skills/system-code-graph/mcp_server/dist/index.js` a required artifact, runs TypeScript from the system-code-graph skill directory, and then spawns that code-graph server. The reclaim/respawn path reuses the same `buildIfNeeded` call, so dead-socket recovery does not add a spec-kit build-order guarantee. [SOURCE: `opencode.json:68`, `opencode.json:72`, `.claude/mcp.json:57`, `.claude/mcp.json:60`, `.codex/config.toml:54`, `.codex/config.toml:56`, `.opencode/bin/mk-code-index-launcher.cjs:1269`, `.opencode/bin/mk-code-index-launcher.cjs:1283`, `.opencode/bin/mk-code-index-launcher.cjs:1297`, `.opencode/bin/mk-code-index-launcher.cjs:1490`, `.opencode/bin/mk-code-index-launcher.cjs:1712`, `.opencode/bin/mk-code-index-launcher.cjs:1738`, `.opencode/bin/mk-code-index-launcher.cjs:1063`]
- Counterevidence sought: A layer above raw `node index.ts` or compiled `dist/index.js` that builds or validates the system-spec-kit MCP dist traversal module before code-graph server startup, or an install/postinstall/runtime command that is on the actual MCP startup path.
- Counterevidence result: The only spec-kit build reference found in the launcher-adjacent setup surface is a manual prerequisite in `SET-UP - Code Graph.md`, not a startup guarantee. The general install guide's code-graph install check and build command are code-graph-only. [SOURCE: `.opencode/install_guides/SET-UP - Code Graph.md:60`, `.opencode/install_guides/SET-UP - Code Graph.md:63`, `.opencode/install_guides/README.md:710`, `.opencode/install_guides/README.md:717`]
- Alternative explanation considered: Operators may have prebuilt system-spec-kit dist from another workflow or manual setup. That can make a local runtime work, but it is not a deterministic code-graph startup contract and does not mitigate clean-checkout or stale-dist risk.
- Crash-loop behavior: The launcher inherits child stdio and mirrors the child exit code, so the underlying `Memory weighted-walk traversal module not found` error should be visible when the child fails. It does not classify that dependency failure specially, and dead-socket reclaim just re-runs the same code-graph-only build before relaunch. [SOURCE: `.opencode/bin/mk-code-index-launcher.cjs:1491`, `.opencode/bin/mk-code-index-launcher.cjs:1494`, `.opencode/bin/mk-code-index-launcher.cjs:1520`, `.opencode/bin/mk-code-index-launcher.cjs:1536`, `.opencode/bin/mk-code-index-launcher.cjs:1038`, `.opencode/bin/mk-code-index-launcher.cjs:1063`]
- Final severity: P1 remains appropriate because the actual cross-runtime MCP startup path lacks the build-order guarantee that could downgrade P1-001.
- Confidence: high.
- Downgrade trigger: Add and verify startup/build enforcement that creates the spec-kit traversal dist artifact before `code-graph-context.js` loads, or move the traversal import behind the seeded-PPR branch with graceful disabled/error behavior.

## P2

No new P2 findings.

# Traceability Checks

- `spec_code` core: CONDITIONAL. Launcher and runtime MCP config review confirms no outer startup layer mitigates P1-001.
- `checklist_evidence` core: CONDITIONAL inherited from P1-003. This iteration did not re-adjudicate packet task/checklist state.
- `agent_cross_runtime` overlay: CONDITIONAL. OpenCode, Claude, and Codex all converge on the same launcher, so the P1-001 startup risk is cross-runtime rather than runtime-specific.
- `feature_catalog_code` overlay: CONDITIONAL inherited from P2-005. This pass reviewed setup/install docs only for build-order counterevidence.
- `playbook_capability` overlay: CONDITIONAL inherited from P2-005.

# Verdict

CONDITIONAL. No new findings, but the launcher and MCP registration layer removed the last reviewed in-repo mitigation hypothesis for P1-001. All three active P1s remain unresolved.

# Next Dimension

Iteration 8 should keep `stopPolicy=max-iterations` and broaden away from launcher startup into a different angle: either dependency/artifact packaging consistency for generated dist assumptions across system-spec-kit and system-code-graph, or database/index schema behavior under edge-confidence flag toggles and seeded-PPR fallback paths. Do not stop on convergence telemetry.

Review verdict: CONDITIONAL
