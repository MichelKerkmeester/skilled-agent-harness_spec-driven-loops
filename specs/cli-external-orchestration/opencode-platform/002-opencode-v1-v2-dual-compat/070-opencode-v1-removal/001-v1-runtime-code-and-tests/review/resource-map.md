---
title: "Resource Map — Confirmation review of three fix commits on branch worktrees/477-opencode-v1-removal: 49edc61c95b (the Vibe session-cleanup hook now calls the plugin factory, plus a contract test), d857649d81c (the dispatch guard probes only the `opencode` binary or $OPENCODE_BIN; the loop wrapper refuses an OpenCode 1 binary; v2-bridge export trim; version comments), 12dcc168817 (the cli-opencode README sentence plus packet traceability; trigger-index.json and the retrieval fixtures in it are generated). Confirm that the earlier review's findings in specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/review/review-report.md are resolved and look for regressions the fixes introduce. Earlier findings: DR4-P1-001 (.vibe/plugins/repo-guards/session-cleanup.mjs:51,60 called sessionCleanupPlugin.server after v2-bridge.js dualPlugin dropped the server key; hook-io.mjs runGuard hid the TypeError); DR3-P1-001 (003-v1-docs-and-playbooks-sweep acceptance-criteria.md:57 recorded AC-004 Met while implementation-summary.md:130 said AC-004 not met); DR1-P2-001 (opencode-version.mjs:17 comment promised an `unsupported` token the parser never returns); DR1-P2-002 (two byte-identical parseOpencodeVersion copies, opencode-version.cjs:148 and opencode-version.mjs:183, with divergent failure semantics); DR1-P2-003 (skilled-loop:1217 always passed --standalone, so a v1 binary failed with a raw usage error); DR2-P2-001 (opencode-version.mjs bare-name probe ran a command-chosen opencode<N> binary from PATH); DR3-P2-001 (003 acceptance-criteria.md:55 rows carried Waiver - while their printed command failed as written); DR3-P2-002 (003 scratch/justified.txt:23 justified a renamed feature-catalog path); DR4-P2-001 (v2-bridge.js:602 re-exported MAPPED_HOOKS and TOOL_ALIASES with no importer). For each earlier finding state resolved, still open or not checked, with file:line evidence."
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 2
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=0, Specs=2, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: review convergence output for 001-v1-runtime-code-and-tests
- **Generated**: 2026-11-19T17:41:19.376Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md | Analyzed | OK | Findings P0=0 P1=1 P2=1; Iterations=1 |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/tasks.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---
