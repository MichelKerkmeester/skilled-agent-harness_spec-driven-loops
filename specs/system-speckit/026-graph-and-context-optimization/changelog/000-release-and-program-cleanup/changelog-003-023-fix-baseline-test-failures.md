---
title: "Pre-Existing Test Failure Remediation"
description: "Five vitest failures confirmed pre-existing via git stash were diagnosed and fixed with minimal scoped edits: four stale test assertions updated to match deliberate content reductions, one incomplete snake_case rename completed across two product files. Three stale graph-metadata entries were also cleaned up."
trigger_phrases:
  - "fix baseline test failures"
  - "advisor health degraded fix"
  - "skill_advisor snake case rename completion"
  - "manual playbook scenario count fix"
  - "corpus parity test remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-30

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/023-fix-baseline-test-failures` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Five vitest unit tests in the spec-kit skill-advisor MCP server had been failing since packet 040 (sk-doc conformance sweep) and commit `7dfd108` (skill_id rename). The failures were confirmed pre-existing via `git stash` during packet 045 work. Four tests were stale assertions out-of-sync with deliberate content reductions: the manual-testing playbook was reclassified from 42 scenarios to 4, the labeled corpus shrank from 200 to 197 rows. The plugin-bridge defaults had also been refactored to read from `compat-contract.json`. The fifth failure traced to commit `7dfd108`, which aligned `graph-metadata.json` with the new snake_case skill id but missed three kebab-case call sites across `skill_graph_compiler.py` and `skill_advisor.py`. All five tests now pass. The full stress suite (56/56, 163/163) and the skill-advisor sub-suite (236/236) verified no regressions.

### Added

None.

### Changed

- Test assertions in `manual-testing-playbook.vitest.ts` updated to match the live 4-scenario layout across 3 categories (down from 42 scenarios across 9 groups). Regex prefix widened from `[A-Z]{2}-` to `[A-Z]{2,4}-` to accept three-letter prefixes such as SAD.
- Corpus length expectation in `advisor-corpus-parity.vitest.ts` updated from 200 to 197 to reflect the 3 mcp-clickup rows removed in packet 040. Describe label also renamed to match.
- Assertion strategy in `plugin-bridge.vitest.ts` switched from inline string-literal constants to importing `compat-contract.json` and asserting against the contract default values directly.
- `GRAPH_ONLY_SKILL_IDS` set literal in `skill_advisor.py` renamed from `{"skill-advisor"}` to `{"skill_advisor"}` to complete the snake_case migration started in commit `7dfd108`.
- Two hardcoded `"skill-advisor"` literals in `skill_graph_compiler.py` (folder name injection at line 200 and fallback path lookup at line 337) renamed to `"skill_advisor"`.
- Three stale entries in `.opencode/skills/sk-code/graph-metadata.json` corrected: `v1.3.0.0.md` updated to `v3.0.0.0.md` at two sites. Two directory entries (`assets/nextjs`, `assets/go`) were also removed from `key_files` because the validator requires files not directories.

### Fixed

- `advisor-graph-health.vitest.ts` (health check) reported `inventory_parity.in_sync: false` and `graph_only: ['skill-advisor']` because the kebab-case set literal in `skill_advisor.py` caused the parity check to look for a skill id that no longer matched the graph. Completing the rename restored `in_sync: true` and `graph_only: ['skill_advisor']`.
- `advisor-graph-health.vitest.ts` (validator check) failed because the compiler injected `"skill-advisor"` as the graph folder name and used it as the fallback path. Both stale literals now align with the actual folder name `skill_advisor`.
- `skill_graph_compiler.py --validate-only` reported errors on `sk-code/graph-metadata.json` due to the `v1.3.0.0.md` path and two directory entries. The metadata cleanup resolved all three errors.

### Verification

| Check | Result |
|-------|--------|
| 5 originally-failing tests run individually | All 9 tests across 4 files PASS |
| Skill-advisor sub-suite (`vitest run skill_advisor/`) | 236/236 PASS (34 files). No regression in modified surface. |
| Full vitest unit suite (`npm run test:core`) | Pre-existing unrelated failures only (memory-learn-command-docs, codex-prompt-wrapper, outsourced-agent-handback-docs, remediation-008-docs, code-graph-scan, review-fixes, handler-memory-crud). None touch the modified files. Escalated to user as out-of-scope follow-on. |
| `npm run stress` | 56/56, 163/163, exit 0 PASS. Corpus grew from 159 to 163 since packet 045. |
| `validate.sh --strict` for packet 047 | exit 0 PASS |
| `python3 skill_graph_compiler.py --validate-only` | VALIDATION PASSED (no errors) |
| `python3 skill_advisor.py --health` | `inventory_parity.in_sync: true`, `graph_only: ['skill_advisor']` |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/manual-testing-playbook.vitest.ts` | Modified | Scenario count 42 to 4, group count 9 to 3, regex widened to `[A-Z]{2,4}-` |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-corpus-parity.vitest.ts` | Modified | `toHaveLength(200)` to `(197)`. Describe label renamed. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-graph-health.vitest.ts` | Modified | Expected `graph_only` updated from `['skill-advisor']` to `['skill_advisor']` |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge.vitest.ts` | Modified | Assertions switched from inline string literals to `compat-contract.json` import and contract default values |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py` | Modified | Two `"skill-advisor"` literals renamed to `"skill_advisor"` (lines 200 and 337) |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modified | `GRAPH_ONLY_SKILL_IDS = {"skill-advisor"}` renamed to `{"skill_advisor"}` (line 211) |
| `.opencode/skills/sk-code/graph-metadata.json` | Modified | `v1.3.0.0.md` updated to `v3.0.0.0.md` at two sites. Two directory entries removed from `key_files`. |

### Follow-Ups

- The `manual-testing-playbook.vitest.ts` test only covers the skill-advisor playbook layout. No coverage exists for other playbook packages that may have their own count drift over time.
- The validator's `key_files` check rejects directories. Skills that legitimately need to surface a directory stub need a different mechanism. This is out of scope for this packet.
- Other unit-suite failures unrelated to packet 045 remain (see Verification table above). These are pre-existing and were escalated to the user for separate triage.
