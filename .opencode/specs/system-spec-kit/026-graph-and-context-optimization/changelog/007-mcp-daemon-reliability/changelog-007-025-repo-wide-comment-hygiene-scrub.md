---
title: "Changelog: Repo-wide comment-hygiene scrub [007-mcp-daemon-reliability/025-repo-wide-comment-hygiene-scrub]"
description: "Chronological changelog for the Repo-wide comment-hygiene scrub phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/025-repo-wide-comment-hygiene-scrub` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The live codebase is now clean of perishable comment labels. After packet 024 made the hygiene checker stricter, a repo-wide run found about ninety more labels hiding in code comments across the skills, bin, and plugin trees. Three gpt-5.5 agents cleared them in parallel.

### Added

- None.

### Changed

- Measured the repo-wide label backlog with the extended checker and partitioned it into three disjoint clusters for parallel scrubbing
- Cluster A: 16 files under system-spec-kit mcp_server, shared, and scripts
- Cluster B: 12 files under code-graph, advisor, bin, and plugins
- Cluster C: 12 files under deep-review, deep-research, deep-improvement, deep-loop-runtime, sk-code, and sk-doc

### Fixed

- Approximately ninety perishable comment labels (ADR, REQ, DR, phase, seat identifiers) hiding across the live codebase were rewritten to durable intent with comment-only edits preserving the technical reason behind each comment

### Verification

- Extended checker over all 40 files - PASS, 0 violations
- node --check on edited cjs and js - PASS
- py_compile on edited py - PASS
- Comment-only diff stat - PASS, 112 insertions / 114 deletions
- Scope comparison against cluster lists - PASS, no stray files
- Diff spot-checks (reduce-state, run-benchmark, reindex, wait_patterns) - PASS, meaning preserved
- validate.sh --strict on this packet - PASS
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `16 files under skills/system-spec-kit/{mcp_server,shared,scripts}` | Modified | Comment-only label scrub (cluster A) |
| `12 files under skills/system-code-graph, skills/system-skill-advisor, bin, plugins` | Modified | Comment-only label scrub (cluster B) |
| `12 files under skills/{deep-review,deep-research,deep-improvement,deep-loop-runtime,sk-code,sk-doc}` | Modified | Comment-only label scrub (cluster C) |

### Follow-Ups

- Excluded scopes still carry labels. Archived specs, scratch, fixtures, and the packet-local specs/ scripts are intentionally not scrubbed. They are frozen or throwaway.
- F-notation stays review-owned. The checker does not flag F\d+, so genuine F finding labels rely on review.
- No git pre-commit wiring yet. The checker runs through the PostToolUse hook. Wiring it into git pre-commit can land now that the live tree is clean, as a small follow-on, if blocking other sessions is acceptable.
