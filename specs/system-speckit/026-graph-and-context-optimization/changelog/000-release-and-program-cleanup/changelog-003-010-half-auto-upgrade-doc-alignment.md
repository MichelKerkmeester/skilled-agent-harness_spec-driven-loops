---
title: "Changelog: Half-Auto Upgrade Doc Alignment"
description: "Four Tier C surfaces upgraded: Copilot next-prompt freshness contract made mechanically visible, Codex timeout fallback gains a stale marker and cold-start smoke check, ENV reference gains a source-derived feature flags table. The advisor_rebuild command is registered as the explicit repair tool."
trigger_phrases:
  - "half-auto upgrade doc alignment"
  - "Copilot next-prompt freshness"
  - "Codex timeout stale marker"
  - "advisor rebuild command"
  - "feature flags reference table"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/010-half-auto-upgrade-doc-alignment` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Packet 013 identified four Tier C surfaces where automation was easy to overstate. Copilot advisor refresh was described inconsistently across docs, leaving operators unaware that it is next-prompt only and the current prompt sees the prior turn's brief. The Codex timeout fallback served stale cold-start context with no machine-visible marker. Feature-flag default states were undocumented, hiding opt-in OFF behavior for five search and memory automation gates. The `advisor_status` tool detected stale advisor state but had no explicit repair path.

All four sub-tasks shipped in a single pass. Copilot docs in `hook_system.md` and `skill_advisor_hook.md` now carry the NEXT-PROMPT freshness contract with precise wording. The Codex `user-prompt-submit.ts` timeout path returns a `stale:true` fallback marker and logs a structured warning. A new `freshness-smoke-check.ts` helper lets callers verify cold-start context freshness with dependency injection for deterministic tests. The ENV reference gained a source-derived feature flags table (default ON/OFF state, governing env var, gated automation, version). Each row maps to a live flag in `search-flags.ts`. The `advisor_rebuild` command was registered as the explicit repair tool while `advisor_status` remains diagnostic-only.

### Added

- `mcp_server/hooks/codex/lib/freshness-smoke-check.ts` (NEW): cold-start smoke helper returning `{ fresh, lastUpdateAt, latencyMs }` with injectable dependencies
- `mcp_server/tests/hooks-codex-freshness.vitest.ts` (NEW): focused test for Codex freshness hook behavior
- Feature flags reference table in `mcp_server/ENV_REFERENCE.md` with columns: flag name, default state (ON/OFF), governing env var, gated automation, added-in version
- `advisor_rebuild` tool registered in `system-skill-advisor` as the explicit repair command alongside `advisor_status`

### Changed

- `references/config/hook_system.md`: Copilot Tier row updated to state NEXT-PROMPT freshness with the exact phrase "current prompt sees PRIOR turn's brief"
- `references/hooks/skill_advisor_hook.md`: Copilot row updated to match the same NEXT-PROMPT freshness contract wording
- `mcp_server/hooks/codex/user-prompt-submit.ts`: timeout fallback path now emits `stale:true` marker and a structured warning instead of silently returning cold-start context
- `mcp_server/ENV_REFERENCE.md`: feature flags section expanded from prose to a structured reference table derived from `search-flags.ts`

### Fixed

- Copilot freshness was described inconsistently across docs. The NEXT-PROMPT / PRIOR turn contract phrase is now the single source of truth across all hook reference files.
- Codex timeout fallback served stale context without signaling staleness to callers or operators. The stale marker and structured warning make the fallback machine-visible.
- Feature flag opt-in OFF defaults were invisible to operators. The new reference table makes each default state explicit.
- `advisor_status` had no documented repair path. `advisor_rebuild` is now the named command for explicit repair.

### Verification

| Check | Command / Artifact | Result |
|-------|--------------------|--------|
| Codex freshness tests | `npm --prefix .opencode/skills/system-spec-kit/mcp_server exec -- vitest run mcp_server/tests/hooks-codex-freshness.vitest.ts --reporter=default` | PASS: 2 test files, 4 tests |
| TypeScript build | `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | PASS |
| Strict packet validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet-folder> --strict` | PASS |
| Scope check | `git status --short` | PASS: only scoped files modified |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Copilot NEXT-PROMPT freshness contract wording added to table and prose |
| `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md` | Copilot row updated to NEXT-PROMPT freshness phrase |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Timeout fallback emits stale marker and structured warning |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts` (NEW) | Cold-start freshness smoke check helper |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hooks-codex-freshness.vitest.ts` (NEW) | Focused test for Codex freshness hook |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Feature flags reference table added |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-rebuild.ts` (NEW) | `advisor_rebuild` explicit repair command |

### Follow-Ups

- Copilot remains next-prompt fresh by design. Current-prompt injection is out of scope and was not added.
- The feature flags table is generated from the source file at authoring time. Automated build-time generation is a future improvement.
- `advisor_rebuild` skips a live status check unless `force:true` is passed. Auto-repair triggered by `advisor_status` was explicitly ruled out.
