# Iteration 018 — system-code-graph: tsconfig.json + package.json + dist build correctness

## Summary

The TypeScript configuration is well-structured with proper extends, module settings, and include/exclude patterns. However, the build state is incomplete: the dist folder does not exist, node_modules is missing, and package.json lacks a build script despite INSTALL_GUIDE.md documenting manual build commands. The top-level package.json/package-lock.json are unrelated to the skill (they serve a repo-level dev server).

## Files Reviewed

- `.opencode/skills/system-code-graph/tsconfig.json` (lines read: 59)
- `.opencode/skills/system-code-graph/package.json` (lines read: 21)
- `package.json` (lines read: 16)
- `package-lock.json` (lines read: 571)
- `.opencode/skills/system-code-graph/package-lock.json` (lines read: 50)
- `mcp_server/dist/index.js` (file does not exist)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 018-001 | `.opencode/skills/system-code-graph/package.json:1-21` | No build script defined in package.json; INSTALL_GUIDE.md:83 documents manual build command but package.json lacks `"build": "tsc"` or similar automation | The launcher expects `mcp_server/dist/index.js` (INSTALL_GUIDE.md:54) but there's no automated way to generate it; developers must run manual tsc commands per INSTALL_GUIDE.md | Add `"scripts": { "build": "tsc --build tsconfig.json" }` to package.json for consistency with documented installation workflow |
| 018-002 | `mcp_server/dist/index.js` (file missing) | Compiled entrypoint does not exist; dist folder is absent | The launcher at `.opencode/bin/mk-code-index-launcher.cjs` boots from `mcp_server/dist/index.js` per INSTALL_GUIDE.md:54; missing artifact means the MCP server cannot start | Run `npm install` and `tsc --build .opencode/skills/system-code-graph/tsconfig.json` per INSTALL_GUIDE.md:82-83 to generate the dist folder |
| 018-003 | `.opencode/skills/system-code-graph/` (node_modules missing) | node_modules folder does not exist in the skill directory | TypeScript cannot compile without installed dependencies; package-lock.json exists but npm install has not been run | Run `npm --prefix .opencode/skills/system-code-graph install` per INSTALL_GUIDE.md:82 |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| 018-004 | `package.json:1-16`, `package-lock.json:1-571` | Top-level package.json/package-lock.json are unrelated to the skill (they serve opencode-env dev server) but were included in iteration scope | Creates confusion for future reviewers; these files should not be considered part of the skill's build correctness assessment | Clarify in future iteration scopes that top-level package files are out-of-scope for skill-level build reviews |

## Convergence Signal

newInfoRatio 0.8 vs prior iterations (prior iterations focused on handlers, lib code, and test coverage; this iteration is the first to examine build configuration and artifacts)
