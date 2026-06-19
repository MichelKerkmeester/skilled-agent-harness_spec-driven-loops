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

Implemented the MCP-server portion of this sub-phase: one named red-team probe gate under mcp_server/tests/security/, deterministic fixtures, a run-tests.mjs security selector, npm selector forwarding, and no-querytext denial-audit sanitization in governance persistence.

### Added

- [P] Add the poisoned-RAG family: memory_save untrusted content → recall (full + compact) → assert markers neutralized at render (mcp_server/tests/security/redteam-probe-gate.vitest.ts) — REQ-003, REQ-009
- [P] Add the query-only-injection family aggregating the 'ignore previous instructions' → null assertion (mcp_server/tests/security/redteam-probe-gate.vitest.ts) — REQ-004
- [P] Add the wrapper-breakout family reusing the unicode-instructional / nested-tag surfaces (mcp_server/tests/security/redteam-probe-gate.vitest.ts) — REQ-005
- Add the run-tests.mjs security lane selector so the gate runs as one named group (mcp_server/scripts/run-tests.mjs) — REQ-001
- Add the negative control (no-op payload must not false-pass) — REQ-010 edge case
- tsc/build green + existing suite green vs the pre-gate baseline (capture baseline first) — SC-004, REQ-010

### Changed

- Confirm the namespace-denial audit GAP and locate the wiring point (rg 'namespace_denied|audit|denial'); record that spec-folder-mutex.ts is a TOCTOU lock, not an Authorizer
- Decide C8/SB8 sequencing: escaper-first vs gate-lands-red-as-acceptance-test; capture the decision in the checklist
- Author the named gate aggregator with a zero-success ceiling and a structured per-probe report (mcp_server/tests/security/redteam-probe-gate.vitest.ts) — REQ-001, REQ-002, REQ-008
- Wire the no-querytext exfil-audit: record a denial event with no verbatim query text + a gate assertion that the stored audit record contains no query (namespace-denial audit path; mcp_server/tests/security/redteam-probe-gate.vitest.ts) — REQ-007
- Run the gate as one group; confirm zero-success ceiling fails on any probe success and the structured report names the broken seam
- Confirm both recall shapes (full + compact) and the negative control pass — REQ-009

### Fixed

- Confirm the live per-seam sanitizer surfaces: sanitizeSkillLabel (lib/utils/skill-label-sanitizer.ts), architecture-seam.vitest.ts, bm25-security.vitest.ts, tests/security/adversarial-unicode.vitest.ts, fixtures tests/advisor-fixtures/{promptPoisoningAdversarial,unicodeInstructionalSkillLabel}.json
- Add per-family fixtures, extending the existing poisoning/unicode fixtures (mcp_server/tests/security/redteam-fixtures/)
- CHK-FIX-001 Finding class recorded for the exfil-audit edit (cross-consumer / algorithmic) and for each probe family
- CHK-FIX-002 Same-class producer inventory: rg 'sanitizeSkillLabel|ignore previous instructions|promptPoisoning|unicodeInstructional' — all injection seams enumerated and covered by the gate
- CHK-FIX-003 Consumer inventory for the render boundary + the audit path (rg 'formatSearchResults|memory-triggers|getTieredContent|namespace_denied|audit')
- CHK-FIX-004 Adversarial table tests cover delimiter, joined-input, outside-wrapper, no-op, and fallback cases across poisoned-RAG / query-only-injection / wrapper-breakout

### Verification

- Baseline npm run typecheck - PASS: 0 errors
- Baseline broad related Vitest - PASS: 14 files, 479 passed, 2 skipped
- npm test -- --security - PASS: 1 file, 2 passed, 1 todo
- Post-change npm run typecheck - PASS: 0 errors
- Post-change broad related Vitest - PASS: 15 files, 481 passed, 2 skipped, 1 todo
- validate.sh --strict on this packet - PASS: 0 errors, 0 warnings
- Accidental package-level full run before selector fix - FAILED/HUNG with unrelated existing full-suite failures; not used as verification evidence
- Deep-loop prompt-pack render probe - PENDING: sibling runtime outside requested MCP-server scope

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Modified | Redact prompt/query-shaped deny audit payloads before persistence |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/run-tests.mjs` | Modified | Add named security selector and keep default test flow inside the runner |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Forward npm test -- --security args into run-tests.mjs |
| `.opencode/skills/system-spec-kit/mcp_server/tests/security/redteam-probe-gate.vitest.ts` | Created | Aggregate deterministic red-team gate |
| `.opencode/skills/system-spec-kit/mcp_server/tests/security/redteam-fixtures/probe-payloads.json` | Created | Attack-family fixtures |

### Follow-Ups

- CHK-020 All acceptance criteria met (REQ-001..REQ-007 P0; REQ-008..REQ-010 P1) — pending REQ-006 sibling-runtime probe
- CHK-023 Deep-loop prompt-pack render probe passes and reports dormant-caller status (REQ-006) — pending sibling-runtime edit
- CHK-FIX-007 Evidence pinned to a fix SHA / explicit diff range, not a moving branch-relative range — pending commit hash by user instruction
- CHK-042 tests/security/README.md updated to list the new named gate
- CHK-050 Temp/probe scratch in scratch/ only
- CHK-051 scratch/ cleaned before completion
