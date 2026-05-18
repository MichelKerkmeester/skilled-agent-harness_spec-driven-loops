---
title: "Implementation Summary: P2 remediation for 015 deep-review advisories"
description: "Closed the 015 deep-review P2 cleanup ledger and documented the D2b shared seam decisions without changing locked advisor identities."
trigger_phrases:
  - "013/009/016 implementation"
  - "p2 remediation 015 summary"
importance_tier: "important"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/016-deep-review-p2-remediation"
    last_updated_at: "2026-05-14T21:30:00Z"
    last_updated_by: "codex"
    recent_action: "P2 remediation committed and pushed"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/rename-invariants.vitest.ts"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `016-deep-review-p2-remediation` |
| **Completed** | 2026-05-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cleanup packet closes the 015 deep-review P2 advisories with small, targeted changes. The advisor still registers as `mk_skill_advisor`, the public tool ids stay stable, and the package folder remains `system-skill-advisor`.

### P2 Finding Remediation

Parent `013/009/graph-metadata.json` now points at `.opencode/bin/mk-skill-advisor-launcher.cjs`, uses the mk-prefixed launcher entity, replaces the old `system_skill_advisor next steps` trigger phrase, and records child 016 as the active child.

The database override now prefers `MK_SKILL_ADVISOR_DB_DIR` and falls back to `SYSTEM_SKILL_ADVISOR_DB_DIR`. The same order is documented in the runtime configs and advisor package docs, preserving compatibility for existing scripts while matching the renamed MCP server id.

`rename-invariants.vitest.ts` adds automated checks for `mk_skill_advisor` server registration, mk-prefixed launcher state identity, and runtime config parity across OpenCode, Claude, Codex, and Gemini.

The stale advisor validation commands in `README.md` and `SET-UP_GUIDE.md` now run the standalone advisor package checks instead of the old spec-kit package test path.

### Shared Seam Disposition

The two D2b shared seams are accepted as-is for this packet:

| Seam | Disposition | Rationale |
|------|-------------|-----------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/utils/sqlite-integrity.ts` | Documented acceptance | The neutral re-export already prevents higher-level storage callers from importing advisor freshness internals. Moving the source implementation into `@spec-kit/shared` would broaden package ownership beyond this P2 remediation. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/utils/skill-label-sanitizer.ts` | Documented acceptance | The neutral re-export keeps shared payload code off advisor renderer paths. The implementation remains advisor-owned until a dedicated shared extraction packet can update imports, package exports, and tests together. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/specs/.../013/009/graph-metadata.json` | Modified | Fix stale parent metadata and active child. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Prefer mk-prefixed DB override env var. |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts` | Modified | Align status DB path override order. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts` | Modified | Align projection DB path override order. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | Align canonical skill graph DB resolver. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/rename-invariants.vitest.ts` | Created | Assert rename invariants in Vitest. |
| Runtime configs and advisor docs | Modified | Document mk-prefixed DB override and standalone advisor tests. |
| Packet 016 docs | Created | Record scope, plan, tasks, checklist, metadata, and seam decisions. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the review ledger item by item, verified each finding was still open, and avoided moving the shared seams into a wider package extraction. Advisor `npm run build` rebuilt the MCP output after source changes, and full advisor Vitest passed with 294 tests.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Prefer `MK_SKILL_ADVISOR_DB_DIR` and keep `SYSTEM_SKILL_ADVISOR_DB_DIR` fallback | This closes the discoverability gap without breaking existing test or CI overrides. |
| Use static Vitest guards for rename invariants | They catch identity/config drift without launching the MCP server or mutating runtime state. |
| Document the two shared seams instead of moving them | D2b flagged them as candidates, not required moves; extraction needs a separate package-boundary packet. |
| Rebuild advisor dist as the robustness remediation | The P2 was about stale dist risk after rename; a fresh build is the bounded fix for this packet. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` in `.opencode/skills/system-skill-advisor/mcp_server` | PASS |
| `npm test` in `.opencode/skills/system-skill-advisor/mcp_server` | PASS, 41 files and 294 tests |
| Parent stale launcher grep | PASS, zero matches for old launcher path/entity/trigger in parent metadata |
| README/SET-UP stale vitest path grep | PASS, zero matches in targeted docs |
| Packet 016 strict validation | PASS, 0 errors and 0 warnings |
| Parent 013/009 strict validation | PASS, 0 errors and 0 warnings |
| `verify_alignment_drift.py --root .opencode/skills/system-skill-advisor` | PASS, 182 files scanned, 0 findings |
| `git push origin main` | PASS, pushed `c7c56cf9f` to `origin/main` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runtime DB files remain dirty in the worktree.** They were already dirty at session start and are intentionally excluded from the commit.
2. **Shared seam extraction is deferred.** The two D2b seams are documented as accepted-as-is here; moving source into `@spec-kit/shared` remains a separate future package-boundary change.
<!-- /ANCHOR:limitations -->
