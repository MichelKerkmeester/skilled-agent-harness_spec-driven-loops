---
title: "Implementation Plan: Phase 003 — mcp-notion knowledge-layer references"
description: "Author the mcp-notion references/ knowledge layer — the 24-tool catalog, the 5 API-gap tools, the 22 property types, the database data-model, and troubleshooting — plus the embedded notion-mcp server README, from the 001 research findings and the web-verified official sources, then validate each."
trigger_phrases:
  - "mcp-notion references plan"
  - "notion knowledge layer plan"
  - "mcp-notion phase 3 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-notion/003-knowledge-references"
    last_updated_at: "2026-08-21T15:52:00Z"
    last_updated_by: "claude"
    recent_action: "Authored 5 references + notion-mcp server README; all validate 0 issues"
    next_safe_action: "Proceed to Phase 004 hub registration + advisor"
    blockers: []
    key_files: ["../001-deep-research/research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-003-knowledge-references"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 003 — mcp-notion knowledge-layer references

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation (no code) |
| **Framework** | sk-doc reference-document doctrine (`validate_document.py --type reference` / `--type readme`) |
| **Storage** | Files under `mcp-notion/references/` and `mcp-notion/mcp-servers/notion-mcp/` |
| **Testing** | `validate_document.py` per reference + README; `validate.sh` on this phase |

### Overview
Take the verified tool surface, the 5 MCP gaps, the property-type set, and the data-source hierarchy from the 001 deep-research findings, cross-check the tool names and endpoints against the official `@notionhq/notion-mcp-server` README and developers.notion.com (2026-08-21), and author five reference documents plus the embedded server README. Each document is validated with the reference/README doc validator, and the phase is closed with `validate.sh`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 001 deep-research findings read (tool surface, 5 gaps, property set, data-source hierarchy)
- [x] Official README fetched (2026-08-21) for the verbatim tool catalog
- [x] developer.notion.com endpoints and API-version pins identified for web verification

### Definition of Done
- [x] Five `references/*.md` authored and each passes `validate_document.py --type reference` with 0 issues
- [x] `mcp-servers/notion-mcp/README.md` authored and passes `validate_document.py --type readme` with 0 issues
- [x] Tool count caveat, read-only/no-API property types, and API-version pins documented with their sources
- [x] `validate.sh` on this phase passes; continuity refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-first reference authoring — ground every claim in a 001 research finding or a web-verified official source, transcribe tool names verbatim, and document caveats instead of resolving disagreements silently.

### Key Components
- **Tool catalog** (`mcp-tools.md`): 24 tools across 6 domains + the Code Mode invocation contract; the "22 vs 24" README count caveat.
- **API-gap tools** (`api-gap-tools.md`): direct REST calls for the 5 gaps; token from `$notion_NOTION_TOKEN`.
- **Property types** (`property-types.md`): 22 schema types; the strip-8-computed-before-write rule; the read-only/no-API findings.
- **Database data-model** (`database-model.md`): database→data-source→page hierarchy; relations; 14 rollup functions; Formulas 2.0.
- **Troubleshooting** (`troubleshooting.md`): auth, backoff, API-version mismatch, data-source confusion, deprecation-migration.
- **Server README** (`notion-mcp/README.md`): stdio, `NOTION_TOKEN`, dual-backend.

### Data Flow
001 research findings + official README + developers.notion.com → per-reference authoring (one document per knowledge domain) → `validate_document.py` per file → `validate.sh` phase closeout.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable as a runtime/policy fix — this phase is additive documentation authored ONLY inside the mode's own package (`mcp-notion/references/**` and `mcp-notion/mcp-servers/notion-mcp/README.md`). It touches no shared policy, no hub routing, no `.utcp_config.json`, and no other packet. (The hub-facing surfaces — mode-registry, hub-router, description/graph metadata, SKILL.md, smart-routing, leaf-manifest, repo README — are all inventoried and edited in Phase 4.)
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the 001 deep-research findings for the tool surface, the 5 gaps, the property set, and the data-source hierarchy
- [x] Fetch the official `@notionhq/notion-mcp-server` README (2026-08-21) for the verbatim tool names
- [x] Identify the gap endpoints and API-version pins on developers.notion.com for web verification

### Phase 2: Core Implementation
- [x] Author `references/mcp-tools.md` (24 tools, 6 domains, Code Mode contract, "22 vs 24" caveat)
- [x] Author `references/api-gap-tools.md` (5 gaps, endpoints, `$notion_NOTION_TOKEN`)
- [x] Author `references/property-types.md` (22 types, strip-8-computed rule, read-only/no-API findings)
- [x] Author `references/database-model.md` (data-source hierarchy, relations, 14 rollups, Formulas 2.0)
- [x] Author `references/troubleshooting.md` (auth, backoff, API-version, migration)
- [x] Author `mcp-servers/notion-mcp/README.md` (stdio, NOTION_TOKEN, dual-backend)

### Phase 3: Verification
- [x] Run `validate_document.py --type reference` on each of the five references; fix failures
- [x] Run `validate_document.py --type readme` on the server README; fix failures
- [x] Web-verify the gap endpoints and API-version pins against developers.notion.com (2026-08-21)
- [x] `validate.sh` this phase; refresh `implementation-summary.md` + continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Document | Reference structure, headers, frontmatter | `validate_document.py --type reference` |
| Document | Server README structure | `validate_document.py --type readme` |
| Source | Tool names verbatim; endpoints + version pins | Official README + developers.notion.com (web, 2026-08-21) |
| Doc | Phase folder structure + anchors | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 deep-research findings | Internal | Green | No verified surface to author against |
| Official `@notionhq/notion-mcp-server` README | External | Green | No verbatim tool catalog |
| developers.notion.com (endpoints + version pins) | External | Green | Gap endpoints and API-version pins unverified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a reference is inaccurate or a source could not be verified.
- **Procedure**: the references and the server README are additive and self-contained — delete `mcp-notion/references/*.md` and `mcp-notion/mcp-servers/notion-mcp/README.md`; no shared runtime or hub state is touched, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
