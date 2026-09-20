---
title: "Tasks — Phase 18 — catalog and reference topology simplification"
description: "Task list for the three-folder catalog migration and reference-heading normalization."
trigger_phrases:
  - "phase 18 tasks"
  - "catalog topology tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/018-catalog-reference-topology"
    last_updated_at: "2026-08-03T20:32:51Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 18 tasks"
    next_safe_action: "Execute migration tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/018-catalog-reference-topology"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks — Phase 18 — catalog and reference topology simplification

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; completed items carry concrete evidence.
- Task IDs: T001–T008; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Capture the 25-card move map, inbound-link inventory, 26-heading baseline, and root catalog count mismatch [evidence: baseline snapshot `/tmp/phase018-card-baseline.json`; 26 decimal headings inventoried; root overview had stale 23-entry/3-plugin counts]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Move 14 CLI cards into `feature-catalog/cli/` and 6 MCP cards into `feature-catalog/mcp/`; retain 5 plugin cards in `plugins/` [evidence: 20 `git mv` commands; post-move counts cli=14, mcp=6, plugins=5]
- [x] T003 Update root catalog counts, surface headings, card links, moved-card canonical paths, and inbound links [evidence: root catalog updated to 25 entries and 14/6/5; 38 live documents re-based; `Feature file path:` values updated on all 20 moved cards]
- [x] T004 Remove decimal H3–H6 prefixes from every mcp-obsidian reference while retaining descriptive text [evidence: 26 headings stripped via regex; `rg -n` grep returns zero decimal forms]
- [x] T005 Replace numeric subsection prose references with durable descriptive wording [evidence: `§2.6` reference rewritten; prose grep returns zero]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 [P] Verify counts, zero decimal headings, zero stale moved paths, and Markdown link integrity [evidence: 14/6/5 counts PASS; card preservation 20/20 byte-compared; 291 local links resolve; 0 stale moved paths; 0 decimal headings]
- [x] T007 Regenerate mcp-tooling leaf manifest; normalize the six off-taxonomy plugin-card validation types; repair the fifteen pre-existing reference-index links; validate catalog package and Phase 18 docs; write implementation summary [evidence: leaf manifest `c45d3c36…` OK; 6 taxonomy rows canonicalized; 15 index links repaired; package validator PASS; link guard mcp-obsidian = 0; implementation summary written]
- [x] T008 Align `references/plugins/plugin-operation-logic.md` with the sk-create-skill reference template (full frontmatter, short intro, numbered H2 + descriptive H3, OVERVIEW with Core Principle, named validation checkpoints) [evidence: rewritten doc carries 5-field frontmatter (version `1.0.0.0`), 2-sentence intro, `## 1. OVERVIEW` with Core Principle, descriptive prose cross-references, zero broken links]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 25 cards remain accessible through `cli/`, `mcp/`, or `plugins/`; zero decimal reference subheadings or stale migration links remain; required validators pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-007)
- Catalog contract: `.opencode/skills/sk-doc/sk-create-feature-catalog/SKILL.md`
- Parent packet: `../spec.md`
<!-- /ANCHOR:cross-refs -->
