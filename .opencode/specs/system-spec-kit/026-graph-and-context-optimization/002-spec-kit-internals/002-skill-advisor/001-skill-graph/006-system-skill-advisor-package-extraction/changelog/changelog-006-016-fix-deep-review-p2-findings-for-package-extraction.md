---
title: "P2 remediation for 015 deep-review advisories"
description: "The cleanup packet closes the 015 deep-review P2 advisories with small, targeted changes. The advisor still registers as mk_skill_advisor, the public tool ids stay stable and the package folder remains system-skill-advisor."
trigger_phrases:
  - "013/009/016 implementation"
  - "p2 remediation 015"
  - "mk_skill_advisor deep-review cleanup"
  - "MK_SKILL_ADVISOR_DB_DIR environment variable"
  - "skill advisor rename invariants test"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/016-fix-deep-review-p2-findings-for-package-extraction` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The deep-review of the skill advisor rename (015) left nine P2 advisories and D2b flagged two shared seams for extraction or acceptance. This cleanup packet refreshed the stale parent phase metadata, introduced a mk-prefixed database environment variable as the preferred override, added automated rename-invariant tests and fixed outdated validation paths in the package documentation. The two shared utility seams were documented as accepted-as-is pending a future dedicated extraction packet.

### Added
- A `MK_SKILL_ADVISOR_DB_DIR` preferred environment variable with `SYSTEM_SKILL_ADVISOR_DB_DIR` fallback for database path override.
- `rename-invariants.vitest.ts` test suite asserting rename invariants for server registration, launcher identity and runtime config parity across OpenCode, Claude, Codex and Gemini runtimes.

### Changed
- The database path override order now prefers `MK_SKILL_ADVISOR_DB_DIR` across the launcher, advisor-status handler, projector and skill graph database resolver.
- Two shared seams (`sqlite-integrity.ts` and `skill-label-sanitizer.ts`) documented as accepted-as-is with rationale for future extraction.

### Fixed
- Stale parent phase metadata now uses mk-prefixed values for the launcher path, launcher entity, trigger phrase and active child pointer in `013/009/graph-metadata.json`.
- Stale standalone advisor validation commands in `README.md` and `SET-UP_GUIDE.md` now run the advisor package checks instead of the old spec-kit package test path.

### Verification
- `npm run build` in `.opencode/skills/system-skill-advisor/mcp_server`: PASS
- `npm test` in `.opencode/skills/system-skill-advisor/mcp_server`: PASS, 41 files and 294 tests
- Parent stale launcher grep: PASS, zero matches for old launcher path, entity or trigger in parent metadata
- README and SET-UP stale vitest path grep: PASS, zero matches in targeted docs
- Packet 016 strict validation: PASS, 0 errors and 0 warnings
- Parent 013/009 strict validation: PASS, 0 errors and 0 warnings
- `verify_alignment_drift.py --root .opencode/skills/system-skill-advisor`: PASS, 182 files scanned and 0 findings
- `git push origin main`: PASS, pushed `c7c56cf9f` to `origin/main`

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/specs/.../013/009/graph-metadata.json` | Modified | Fix stale parent metadata and active child |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Prefer mk-prefixed DB override env var |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts` | Modified | Align status DB path override order |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts` | Modified | Align projection DB path override order |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | Align canonical skill graph DB resolver |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/rename-invariants.vitest.ts` | Created | Assert rename invariants in Vitest |

### Follow-Ups
- Runtime database files remain dirty in the worktree. They were already dirty at session start and are intentionally excluded from the commit.
- Shared seam extraction is deferred. The two seams are documented as accepted-as-is. Moving source into a shared package remains a separate future change.
