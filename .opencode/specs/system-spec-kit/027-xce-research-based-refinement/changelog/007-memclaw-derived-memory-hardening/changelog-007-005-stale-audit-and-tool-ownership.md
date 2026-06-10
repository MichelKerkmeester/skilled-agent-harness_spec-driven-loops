---
title: "Memclaw Derived Memory Hardening 005: Stale-Exclusion Audit and Tool-Ownership Lint"
description: "Read-only hard-exclusion predicate audit surfaced through memory_health and /doctor memory, plus a derived 37-tool ownership map with a blocking pre-commit drift gate. Recall behavior and stored data are unchanged."
trigger_phrases:
  - "007 005 stale audit tool ownership changelog"
  - "hard exclusion audit memory_health shipped"
  - "tool ownership drift gate pre-commit"
  - "derived tool ownership map 37 tools"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening`

### Summary

This leaf adds two diagnostic and governance surfaces without changing recall behavior or stored data. The health audit exposes hard-exclusion predicate metadata through `memory_health` and classifies intended archived exclusions separately from deprecated-tier silent-risk rows, surfacing hints through `/doctor memory`. The tool-ownership lint derives a deterministic 37-tool map from `TOOL_DEFINITIONS` at pre-commit time and blocks on missing tools, extra tools, field drift, a malformed map, or unreadable definitions. No schema version bump occurred.

### Added

- `getHardExclusionPredicates()` in `hybrid-search.ts`: read-only metadata export of existing search exclusion predicates without editing recall logic.
- `data.exclusionAudit` in `memory-crud-health.ts`: in-memory intended-exclusion policy classification and diagnostic hints for silent-risk or unclassified exclusions.
- `hard_exclusion_risk` registered in `doctor_memory.yaml` from the health payload.
- Deterministic 37-tool ownership and stability map derived from `TOOL_DEFINITIONS` in `tool-schemas.ts`.
- `mcp_server/tests/fixtures/tool-ownership-map.json`: committed generated fixture.
- `tool-ownership-lint-runner.mjs`: source-derived pre-commit runner that fails closed without requiring `npm run build` or compiled dist files.
- Pre-commit hook in `.opencode/scripts/git-hooks/pre-commit` extended with a blocking tool-ownership drift gate.
- `mcp_server/tests/stale-audit-tool-ownership.vitest.ts`: 6 tests covering exclusion audit and ownership lint edge cases.
- `references/config/hook_system.md` updated to document audit and ownership-lint firing surfaces.

### Changed

- `hybrid-search.ts`: predicate metadata exposed through a new export; existing recall predicates are unchanged.
- `memory-crud-health.ts`: observe-only audit output and health hints added; no recall or mutation path was touched.
- `tool-schemas.ts`: deterministic ownership-map derivation and drift comparison helpers added alongside existing schema definitions.
- `.opencode/scripts/git-hooks/pre-commit`: blocking ownership drift gate added.

### Fixed

- None.

### Verification

- `npx vitest run tests/stale-audit-tool-ownership.vitest.ts`: 1 file, 6 tests passed.
- `npx vitest run tests/search-archival.vitest.ts tests/handler-memory-search.vitest.ts`: 2 files, 41 tests passed.
- Combined 3-file run: 47 tests passed.
- `npx tsc --noEmit -p tsconfig.json`: clean.
- `node tests/tool-ownership-lint-runner.mjs`: clean 37-tool map.
- Comment hygiene on changed code files: passed.
- `validate.sh --strict` on this spec folder: 0 errors, 0 warnings.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modified | Hard-exclusion predicate metadata exposed without editing recall predicates. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Observe-only exclusion audit output and health hints. |
| `.opencode/commands/doctor/assets/doctor_memory.yaml` | Modified | `hard_exclusion_risk` registered from `memory_health.data.exclusionAudit`. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | Deterministic ownership-map derivation and drift comparison helpers. |
| `.opencode/scripts/git-hooks/pre-commit` | Modified | Blocking tool-ownership drift gate added. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/stale-audit-tool-ownership.vitest.ts` | Added | Exclusion audit and ownership lint edge-case coverage. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/tool-ownership-lint-runner.mjs` | Added | Source-derived pre-commit runner that fails closed. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/tool-ownership-map.json` | Added | Committed generated ownership-map fixture. |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Modified | Audit and ownership-lint firing surfaces documented. |

### Follow-Ups

- Recall policy is intentionally unchanged. Widening recall to include deprecated rows requires a separate policy decision.
- Direct skill-budget YAML was not edited (outside the allowed write list). Ownership drift is enforced by pre-commit and documented in the hook reference.
