---
title: "Code Graph Watcher Claim Retraction"
description: "Doc-only remediation that replaced the MCP server README's false structural-watcher claim with the real code-graph freshness model: read-path selective repair via ensureCodeGraphReady, operator-triggered full repair via code_graph_scan, read-only diagnostics via code_graph_status. Blocked required-action behavior when a full scan is needed is also documented."
trigger_phrases:
  - "code graph watcher retraction"
  - "code graph freshness model"
  - "watcher overclaim fix"
  - "read-path graph freshness"
  - "013 P1-1 remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit/004-code-graph-watcher-claim-retraction` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit`

### Summary

The MCP server README had claimed real-time structural code-graph watching, but deep-research packet 013 validated that no such watcher path exists. The actual contract is that `ensureCodeGraphReady()` selectively reindexes changed tracked files on read. `code_graph_scan` performs operator-triggered full repair. `code_graph_status` diagnoses without mutating. `code_graph_query` blocks with a required-action signal when a full scan is needed. This packet replaced the false claim with an accurate freshness-model subsection and confirmed no other current operator docs carry a structural watcher promise.

### Added

- README subsection documenting the four-mode code-graph freshness contract: read-path self-heal, manual full repair, read-only status. Blocked required-action behavior is also covered.

### Changed

- `.opencode/skills/system-spec-kit/mcp_server/README.md` freshness model rewritten to name the actual repair paths and cite implementation surfaces from 013 evidence

### Fixed

- Structural watcher overclaim removed from the MCP server README. The README had described real-time watching that the adversarial retest in 013 iteration 004 confirmed does not exist in the code path.

### Verification

| Check | Artifact | Result |
|-------|----------|--------|
| Source evidence | 013 research report P1-1 finding. iteration-004 adversarial retest lines 67-72 | PASS |
| README freshness model | `.opencode/skills/system-spec-kit/mcp_server/README.md:517-529` | PASS: read-path self-heal, manual scan, status diagnostic, required-action behavior documented |
| Related doc sweep | Targeted `rg` over README, SKILL.md, CLAUDE.md, hook reference | PASS: no current doc found that promises a structural source watcher |
| Runtime-code scope | Targeted diff review | PASS: no `.ts`, `.js`, `.py` or shell files edited |
| Strict validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` on packet folder | PASS: exit 0, 0 errors, 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Freshness model rewritten. False structural watcher claim removed. Read-path self-heal, manual `code_graph_scan`, read-only `code_graph_status`. Required-action `code_graph_query` behavior documented with 013 evidence reference. |

### Follow-Ups

- Runtime automation remains unchanged by design. Implementing a structural source watcher is a separate, out-of-scope decision.
- Historical research artifacts in packets 012 and 013 may still reference the old watcher claim as recorded evidence. They are evidence records, not current operator guidance.
