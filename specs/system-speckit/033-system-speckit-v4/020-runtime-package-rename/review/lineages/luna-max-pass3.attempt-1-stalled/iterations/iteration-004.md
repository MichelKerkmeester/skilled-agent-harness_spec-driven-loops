# Deep Review Iteration 4

## Review metadata

- Session: `fanout-luna-max-pass3-1788556809353-mcpewh`
- Target: `.opencode/specs/system-speckit/053-spec-kit-runtime-rename`
- Dimension: maintainability
- Angle: stale vocabulary, test helpers, package ownership, and follow-on change safety
- Executor: inline `cli-codex`, model `gpt-5.6-luna`, max effort, fast tier
- Prior active findings carried forward: `DR-001`, `DR-002`, `DR-003`

## Evidence reviewed

- The public API, stress-test, and test-support READMEs retain “MCP Server” titles or instruct operators to run from `mcp_server`, despite the runtime package’s new `@spec-kit/runtime` identity. `[SOURCE: .opencode/skills/system-spec-kit/runtime/api/README.md:1-16]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/stress-test/README.md:1-16]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/tests/_support/README.md:31-46]`
- Runtime tests use `MCP_SERVER_ROOT` for the moved runtime directory and retain `mcp_server/tests` compatibility patterns. `[SOURCE: .opencode/skills/system-spec-kit/runtime/tests/env-reference-drift.vitest.ts:4-20]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/tests/council-playbook-anchor-integrity.vitest.ts:7-30,55-91]`
- The scripts workflow helper and several error messages still call the runtime API “MCP-server,” and the stop hook comment says the current phase is barred from editing `mcp_server` sources. `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:251-262,1431-1435,1517-1523]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:11-20]`
- The test bootstrap explains a retired database path, so its rationale is historical, but it uses the stale directory label in the live setup comments. `[SOURCE: .opencode/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:25-44]`
- The workspace lockfile has a runtime-scoped `chokidar` package entry, and the advisor loader checks the advisor copy first and runtime copy second. `[SOURCE: .opencode/skills/system-spec-kit/package-lock.json:2051-2066]` `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts:97-115]`
- Runtime finalization identifies the package as `system-spec-kit/runtime` and removes stale generated roots; the variable name `serverDir` is only vocabulary drift, not a path error. `[SOURCE: .opencode/skills/system-spec-kit/runtime/scripts/finalize-dist.mjs:9-28,30-47]`

## Finding

### DR-004 — P2 maintainability — stale internal `mcp_server` vocabulary remains after the move

The code and test support paths now resolve the runtime correctly, but helper names (`tryImportMcpApi`, `MCP_SERVER_ROOT`), test regexes, run instructions, and explanatory comments still encode the retired package identity. The aliases are not currently breaking behavior: they either name an internal compatibility concept or resolve the moved directory. They do, however, make future search-driven edits and ownership review less reliable, and they overlap the live documentation residue in `DR-003` without being the same documentation finding.

Suggested remediation: rename internal symbols and current run instructions to runtime, keep explicit `MCP` wording only where the code is deliberately describing the preserved advisor or a retired subsystem, and retain compatibility regexes only with a comment naming the supported historical input. Add a focused residue test that distinguishes permitted historical/preserved references from current runtime vocabulary.

## Dimension result

- Maintainability: PASS with one P2 vocabulary advisory; no new P0/P1.
- Correctness: `DR-001` remains active and was not reclassified.
- Security: `DR-002` remains an operator-controlled hardening advisory.
- Traceability: `DR-003` remains active; the API/stress/test-support docs reinforce it.
- New findings: 0 P0, 0 P1, 1 P2.
- Convergence: all four dimensions are now covered, but this is telemetry only; continue to the required tenth iteration.

## Ruled-out maintainability directions

- `chokidar` dead dependency: ruled out as a manifest-only defect because the lockfile models a runtime-scoped package and the advisor loader explicitly checks that fallback. `[SOURCE: .opencode/skills/system-spec-kit/package-lock.json:2051-2066]` `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts:97-115]`
- `serverDir` in `finalize-dist.mjs`: vocabulary drift only; `FRESHNESS_PACKAGE_ID` and the dist roots resolve to the moved runtime. `[SOURCE: .opencode/skills/system-spec-kit/runtime/scripts/finalize-dist.mjs:11-28]`

## Next angle

Iteration 5 revisits correctness at build and dependency seams: the scripts freshness symlink, runtime lockfile placement, package preparation order, public API resolution, and the packet’s build claims. Convergence will remain telemetry-only.

Review verdict: CONDITIONAL
