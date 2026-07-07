---
title: "Implementation Plan: Scaffold system-skill-advisor package"
description: "Author SKILL.md, graph-metadata.json, placeholder catalog/playbook/references, DB-path policy, install-guide stub, empty mcp_server scaffold."
trigger_phrases:
  - "system-skill-advisor scaffold plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/002-system-skill-advisor-package-scaffold"
    last_updated_at: "2026-05-14T03:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "plan.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Scaffold system-skill-advisor package

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Stand up the `.opencode/skills/system-skill-advisor/` package envelope per ADR-001. Author SKILL.md (currently empty), graph-metadata.json (currently missing), populate catalog/playbook/references with placeholder entries, add DB-path policy + install-guide stubs, scaffold empty mcp_server/. No runtime move.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] ADR-001 locked on main (`07c612f8a`).
- [x] system-skill-advisor folder partial stub exists.

### Definition of Done
- [x] SKILL.md authored with full frontmatter + body.
- [x] graph-metadata.json authored with proper schema.
- [x] Each non-mcp_server directory carries ≥ 1 content file.
- [x] DB-path policy + install-guide stubs land.
- [x] mcp_server/ stub directory created.
- [x] No production advisor code modified.
- [x] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON authoring only |
| **Framework** | Spec Kit MCP server skill discovery |
| **Storage** | `.opencode/skills/system-skill-advisor/` |
| **Testing** | skill_graph_scan equivalent + vitest skill_advisor sanity |

### Approach
1. Audit current `system-skill-advisor/` state. Decide which existing files (SKILL.md empty, ARCHITECTURE.md, README.md) to overwrite vs preserve.
2. Author SKILL.md with frontmatter aligned to ADR-001 (description, trigger_phrases, importance_tier, contextType). Body documents the standalone-MCP shape and the legacy tool-id bridge.
3. Author graph-metadata.json with `derived.trigger_phrases`, `derived.key_topics`, `derived.intent_signals`, `derived.causal_summary`, and `manual.depends_on` / `manual.related_to` per ADR-001. Empty `[]` for fields that don't apply yet (e.g. children_ids).
4. Copy-and-rebrand the existing `mcp_server/skill_advisor/feature_catalog/` + `mcp_server/skill_advisor/manual_testing_playbook/` entries (or author placeholder versions) into the new package's dirs.
5. Author `references/db-path-policy.md`, `INSTALL_GUIDE.md` (stub), and `mcp_server/README.md` (or .gitkeep) per REQ-004..006.
6. Validate: load all JSON + YAML via node, run vitest skill_advisor and confirm regression status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Audit current `system-skill-advisor/` state.
- Inventory the existing `mcp_server/skill_advisor/feature_catalog/`, `manual_testing_playbook/`, `references/` content to know what to mirror.

### Phase 2: Implementation
- Author SKILL.md.
- Author graph-metadata.json.
- Author or rebrand catalog/playbook/references content.
- Author DB-path policy + install-guide stubs.
- Create mcp_server/ stub.

### Phase 3: Verification
- node JSON/YAML load on the new files.
- vitest skill_advisor: confirm failure count is ≤ 3 (current baseline).
- Strict validate this packet + parent 009 + parent 015.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Schema | SKILL.md frontmatter valid YAML, graph-metadata.json valid JSON | node load |
| Discovery | 18 skills now visible | manual count via `ls .opencode/skills/ | wc -l` cross-check |
| Vitest skill_advisor | No new regressions | `vitest run skill_advisor` |
| Strict spec | This packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- ADR-001 (`015/009/001/decision-record.md`) on main.
- Existing `system-skill-advisor/` partial stub on main.
- Existing `mcp_server/skill_advisor/feature_catalog/` + `manual_testing_playbook/` for mirroring.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Single-commit revert restores prior state. No production code or skill metadata outside `system-skill-advisor/` is touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 | ADR-001 shipped | Locks the package shape |
| Phase 2 | Phase 1 | Author after audit |
| Phase 3 | Phase 2 | Verify after authoring |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| SKILL.md + graph-metadata.json | ~150 lines |
| Catalog/playbook/references content (mirror or stub) | ~300-500 lines |
| DB-path policy + install-guide stubs | ~80 lines |
| Implementation-summary update | ~60 lines |
| **Total** | **~600-800 lines doc + JSON; 0 LOC code** |

cli-codex gpt-5.5 high fast dispatch: 10-15 min.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- skill_graph_scan crashes on new graph-metadata.json
- Vitest skill_advisor adds new failures beyond the current 3
- SKILL.md frontmatter parse fails

### Recovery
1. Revert this commit
2. Confirm vitest restoration

### Data Safety
Scaffold-only; no runtime state changes.
<!-- /ANCHOR:enhanced-rollback -->
