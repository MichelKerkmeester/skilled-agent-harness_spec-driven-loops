---
title: "MCP Daemon Rebuild and Restart Protocol"
description: "Documentation-only packet that codified the canonical 4-part MCP rebuild and restart verification contract, closing the phantom-fix failure mode discovered during the 005 post-remediation probe. Four reference documents shipped: rebuild-restart protocol, live-probe template, dist-marker grep cheatsheet plus a copy-paste implementation verification checklist."
trigger_phrases:
  - "MCP daemon restart protocol"
  - "phantom fix problem"
  - "dist marker verification"
  - "live MCP probe contract"
  - "MCP rebuild restart contract"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/008-mcp-daemon-rebuild-protocol` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

After the 005 packet claimed its Cluster 1-3 P0 fixes had landed, post-remediation live probes revealed the defects were still present. Research in 007 ruled out a missing dist rebuild because the compiled output already carried fresh timestamps. The actual cause was that the MCP-owning client (OpenCode / Codex / Claude Code) had never been restarted, so the running daemon process continued executing old code. This is the phantom-fix failure mode: source patched, dist compiled, but the live tool still reflects the previous build.

This packet authored the canonical 4-part verification contract that every subsequent MCP TypeScript fix must satisfy before any completion claim is made final. The contract requires four evidence items: source diff paths, targeted test pass output, dist verification (timestamp check plus marker grep) plus a live MCP tool probe. Four reference documents were created in `references/` and completion was confirmed on 2026-04-27.

### Added

- `references/mcp-rebuild-restart-protocol.md`: canonical 4-part contract covering the five evidence fields (sourceDiffPaths, targetedTests, distVerification, runtimeRestart, liveProbe), with per-client restart procedures for OpenCode / Codex CLI / Claude Code
- `references/live-probe-template.md`: per-subsystem probe queries for each MCP surface (memory_context, memory_search, code_graph_query, memory_causal_stats), with expected post-fix outcomes per packet
- `references/dist-marker-grep-cheatsheet.md`: grep patterns for each Phase C packet's new code markers, one pattern per MCP layer
- `references/implementation-verification-checklist.md`: copy-paste markdown verification block that any implementation packet can embed in its implementation-summary.md

### Changed

None.

### Fixed

None.

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| 4 reference docs exist | PASS | `ls references/` returns all 4 files: mcp-rebuild-restart-protocol.md, live-probe-template.md, dist-marker-grep-cheatsheet.md, implementation-verification-checklist.md |
| At least 1 sibling cite | PASS | Sibling packets 008 and 014 cite packet 013 in their "MCP Daemon Restart Required" sections |
| `validate.sh --strict` | PASS | Errors 0, Warnings 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `references/mcp-rebuild-restart-protocol.md` | Created | Canonical 4-part rebuild and restart verification contract with per-client restart procedures |
| `references/live-probe-template.md` | Created | Per-subsystem live MCP probe queries with expected post-fix outcomes |
| `references/dist-marker-grep-cheatsheet.md` | Created | Grep patterns for dist marker verification across Phase C packets |
| `references/implementation-verification-checklist.md` | Created | Copy-paste markdown checklist for implementation-summary.md verification blocks |

### Follow-Ups

- Consider adding an automated `dist-freshness-check.sh` script in Phase D once the manual protocol has been validated across multiple packets.
- Evaluate adding a `validate.sh` rule that detects heuristically when MCP source was modified and requires a citation to this protocol before the packet can pass.
