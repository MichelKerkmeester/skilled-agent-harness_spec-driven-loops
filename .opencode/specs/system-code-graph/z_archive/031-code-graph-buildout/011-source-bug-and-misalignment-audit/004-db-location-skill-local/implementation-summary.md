---
title: "Implementation Summary: DB Location Skill-Local (fix #1) [system-code-graph/031-code-graph-buildout/011-source-bug-and-misalignment-audit/004-db-location-skill-local/implementation-summary]"
description: "Relocate the code-graph SQLite DB out of workspace-root .opencode/.spec-kit/code-graph/database back to the skill folder mcp_server/database (operator fix #1). Reverses ADR-002/004/005; every runtime already shares the skill via the .opencode/skills symlink."
trigger_phrases:
  - "code graph db location skill-local"
  - "fix 1 spec-kit relocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/011-source-bug-and-misalignment-audit/004-db-location-skill-local"
    last_updated_at: "2026-05-29T09:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Relocated DB to skill-local; .spec-kit removed; committed 69e7bf12"
    next_safe_action: "None; fix #1 complete and verified green"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-db-location-skill-local |
| **Completed** | 2026-05-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The code-graph database now lives inside its skill at `.opencode/skills/system-code-graph/mcp_server/database/`, not the workspace-root `.opencode/.spec-kit/code-graph/database/`. The old directory is removed and no longer recreated. Every runtime reaches the skill-local DB through the `.opencode/skills` symlink, so it stays a single shared instance.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/core/config.ts`, `lib/readiness-marker.ts` | Modified | Default DB dir + marker base → skill-local |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | `dbDir` skill-local; migration reversed; legacy-lease probe → `.spec-kit` |
| `opencode.json`, `.gitignore`, `lib/ipc/socket-server.ts` | Modified | Note + ignore rules + comment |
| `references/config/database_path_policy.md` + 9 docs | Modified | Policy §1/§2/§3 rewrite (CG-014/CG-038) + path swaps |
| `mcp_server/tests/launcher-lease.vitest.ts` | Modified | Legacy-path test → `.spec-kit` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Applied directly to main (the affected files carried no WIP), rebuilt dist, migrated the existing DB to skill-local, removed `.opencode/.spec-kit`, killed the stale launcher, and committed as 69e7bf12. Verified `DATABASE_DIR` resolves skill-local and the full suite passes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skill-local over `.spec-kit` | Runtimes already share the skill via symlink; the cross-runtime-sharing rationale for `.spec-kit` (CG-038) was wrong |
| Defer CG-013 cwd-divergence | Importing core/config into readiness-marker runs resolveCanonicalDbDir at module load and breaks fs-mock tests |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `DATABASE_DIR` | `.../system-code-graph/mcp_server/database` (skill-local) |
| typecheck | PASS (0 errors) |
| full vitest | 577 passed / 1 skipped / 0 failed |
| `.opencode/.spec-kit` | Removed (DB migrated) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Skill-folder DB trade-off.** A live DB inside the committed/symlinked skill folder must be treated as gitignored regenerable state; skill re-sync must not overwrite it. `.gitignore` + launcher migration-back handle this.
2. **CG-013 deferred.** readiness-marker still resolves its base dir from `process.cwd()` (matches config when CWD == workspace root); sharing the canonical resolver is deferred (fs-mock breakage).
<!-- /ANCHOR:limitations -->
