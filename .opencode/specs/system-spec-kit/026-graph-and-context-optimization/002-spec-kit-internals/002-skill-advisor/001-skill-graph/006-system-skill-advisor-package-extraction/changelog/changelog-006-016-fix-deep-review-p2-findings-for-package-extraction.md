---
title: "P2 remediation for 015 deep-review advisories"
description: "Closes nine P2 advisories from the 015 deep review and documents two shared-seam follow-ups without changing locked advisor identities."
trigger_phrases:
  - "013/009/016"
  - "p2 remediation 015"
  - "mk_skill_advisor deep-review cleanup"
  - "advisor rename invariants"
  - "skill advisor database override"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/016-fix-deep-review-p2-findings-for-package-extraction` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The 015 deep review passed the rename from `system_skill_advisor` to `mk_skill_advisor` but left nine P2 advisories open. This cleanup closed stale parent graph metadata, added a preferred `MK_SKILL_ADVISOR_DB_DIR` environment variable with legacy fallback, added rename-invariant tests, and documented acceptance of two shared seams that need future extraction.

### Added

- `MK_SKILL_ADVISOR_DB_DIR` environment variable as the preferred database directory override, with `SYSTEM_SKILL_ADVISOR_DB_DIR` as a legacy fallback.
- Rename-invariant Vitest suite that asserts `mk_skill_advisor` server registration identity, launcher state value, and runtime configuration parity across OpenCode, Claude, Codex and Gemini runtimes.

### Changed

- Parent graph metadata updated to reference the mk-prefixed launcher path and entity instead of the stale system-prefixed entries.
- Database override environment variable order documented across runtime configuration files and advisor package documentation.

### Fixed

- Stale parent metadata entries including launcher path, launcher entity, trigger phrase and active child pointer corrected.
- Stale standalone advisor validation command paths in documentation corrected to run the advisor package checks directly.

### Verification

- `npm run build` in `.opencode/skills/system-skill-advisor/mcp_server` — PASS
- `npm test` in `.opencode/skills/system-skill-advisor/mcp_server` — PASS, 41 files and 294 tests
- Parent stale launcher grep — PASS, zero matches for old launcher path, entity or trigger phrase in parent metadata
- README and SET-UP stale vitest path grep — PASS, zero matches in targeted docs
- Packet 016 strict validation — PASS, 0 errors and 0 warnings
- Parent 013/009 strict validation — PASS, 0 errors and 0 warnings
- `verify_alignment_drift.py --root .opencode/skills/system-skill-advisor` — PASS, 182 files scanned, 0 findings
- `git push origin main` — PASS, pushed `c7c56cf9f` to `origin/main`

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/specs/.../013/009/graph-metadata.json` | Modified | Fix stale parent metadata and active child |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Prefer mk-prefixed DB override environment variable |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts` | Modified | Align status database path override order |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts` | Modified | Align projection database path override order |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | Align canonical skill graph database resolver |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/rename-invariants.vitest.ts` | Created | Assert rename invariants in Vitest |

### Follow-Ups

- Runtime database files remain dirty in the worktree and are intentionally excluded from the commit.
- Shared seam extraction is deferred. The two seams are documented as accepted-as-is in this packet, and moving source into `@spec-kit/shared` remains a separate future package-boundary change.
