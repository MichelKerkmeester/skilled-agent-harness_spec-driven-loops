---
title: "Changelog: Red-Team Probe Gate [001-speckit-memory/006-redteam-probe-gate]"
description: "Chronological changelog for the Red-Team Probe Gate phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/006-redteam-probe-gate` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

The MCP-server security lane now has a named red-team probe gate. The gate exercises poisoned recall, query-only injection and wrapper breakout cases from deterministic fixtures, then reports failures at the broken seam. The phase also sanitizes namespace-denial audit persistence so stored denial records do not keep verbatim prompt or query text. The sibling prompt-pack probe remains pending outside the Memory MCP server scope.

### Added

- Added the aggregate security probe file and fixture set.
- Added a named security selector in the test runner and npm forwarding path.
- Added negative-control coverage so the gate does not pass by doing nothing.

### Changed

- Sanitized query-shaped namespace-denial audit payloads before persistence.
- Structured the gate output around probe families and broken seams.
- Kept both full and compact recall shapes under the same gate.

### Fixed

- Consolidated existing sanitizer and fixture evidence into one repeatable MCP-server security lane.

### Verification

- Baseline typecheck: PASS.
- Baseline related Vitest: PASS, 14 files and 479 tests.
- Named security lane: PASS, 1 file, 2 tests and 1 todo.
- Post-change typecheck: PASS.
- Post-change related Vitest: PASS, 15 files, 481 tests, 2 skipped and 1 todo.
- Strict phase validation: PASS.
- A package-level full run failed or hung on unrelated existing full-suite failures and was not used as evidence.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Modified | Redacts prompt and query-shaped denial audit payloads before persistence |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/run-tests.mjs` | Modified | Adds the named security selector |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Forwards security selector arguments |
| `.opencode/skills/system-spec-kit/mcp_server/tests/security/redteam-probe-gate.vitest.ts` | Created | Aggregates deterministic security probes |
| `.opencode/skills/system-spec-kit/mcp_server/tests/security/redteam-fixtures/probe-payloads.json` | Created | Holds probe family payloads |

### Follow-Ups

- Add the deep-loop prompt-pack render probe in the sibling runtime.
- Document the new named security lane in the security test README.
- Keep probe scratch files under the packet scratch area and clean them before closeout.
