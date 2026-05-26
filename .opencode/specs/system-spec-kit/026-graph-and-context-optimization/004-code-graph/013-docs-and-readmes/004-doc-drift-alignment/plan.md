---
title: "Implementation Plan: system-code-graph doc-drift alignment"
description: "Six surgical Edit patches across SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, feature_catalog.md, and graph-metadata.json — followed by packet strict-validate."
trigger_phrases:
  - "028 plan"
  - "system-code-graph doc drift plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/020-doc-drift-alignment"
    last_updated_at: "2026-05-16T09:01:20Z"
    last_updated_by: "main_agent"
    recent_action: "Authored Level-1 plan in canonical template shape"
    next_safe_action: "Execute tasks.md Phase 1-3"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000028"
      session_id: "028-plan"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Implementation Plan: system-code-graph Doc-Drift Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter + JSON |
| **Framework** | system-spec-kit strict-validate |
| **Storage** | n/a (docs + one metadata JSON) |
| **Testing** | `validate.sh --strict` + post-edit `grep` sweep |

### Overview
Six surgical Edit-tool patches realign authored docs with the runtime source-of-truth (`tool-schemas.ts` and `mcp_server/index.ts`). No source-code changes. Runtime is already correct.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Drift sources enumerated (6 files, 8+ lines)
- [x] Source-of-truth identified (`tool-schemas.ts` — 11 tools)
- [x] Version strategy decided (1.0.0.0 → 1.0.3.1, doc-only bump)

### Definition of Done
- [ ] All 6 files edited per `tasks.md`
- [ ] `grep` sweep returns no `10 (tools|MCP tools)` or `12 MCP tools` hits in scope files
- [ ] `graph-metadata.json` topology updated and `causal_summary` rewritten
- [ ] `SKILL.md._memory.continuity.packet_pointer` = 028
- [ ] Strict-validate exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Direct doc-edit patches. No architectural choice to make.

### Key Components
- **`tool-schemas.ts`**: runtime source-of-truth for tool count (11).
- **`mcp_server/index.ts`**: runtime source-of-truth for server topology (standalone `mk-code-index`).
- **`changelog/v1.0.3.0.md`**: source-of-truth for current version baseline.

### Data Flow
Runtime artifacts (TS schema + server entrypoint + changelog) → authored docs (SKILL/README/ARCHITECTURE/INSTALL/feature_catalog/graph-metadata). All flow is one-way: docs follow runtime, never the reverse.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Packet scaffolded
- [x] Source-of-truth grep complete (8 hits across 6 files)

### Phase 2: Core Implementation
- [ ] Tool count reconciled (10/12 → 11) in 5 files
- [ ] `graph-metadata.json` topology + host + causal_summary rewritten
- [ ] SKILL.md frontmatter `version` + `_memory.continuity` refreshed
- [ ] README.md "Skill version" + "Active MCP tools" rows updated

### Phase 3: Verification
- [ ] Grep sweep returns clean
- [ ] Strict-validate exits 0
- [ ] `implementation-summary.md` filled with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static grep | 6 in-scope files | `grep -nE` |
| Strict validate | This packet | `validate.sh --strict` |
| Manual | SKILL.md continuity block reads correctly on resume | `/spec_kit:resume` smoke check (optional) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `tool-schemas.ts` enumeration | Internal | Green | Re-grep schema if tools change mid-flight |
| `validate.sh` strict mode | Internal | Green | Use `--no-strict` and document warnings |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: validate.sh fails or grep sweep still shows drift after edits.
- **Procedure**: `git checkout -- <files>` on the 6 in-scope skill files; packet folder remains for re-attempt.
<!-- /ANCHOR:rollback -->
