---
title: "Feature Specification: 015 Notion→Obsidian flawless-migration — research then adopt-or-build into mcp-obsidian + mcp-notion"
description: "Phase parent for a flawless complex-Notion→Obsidian migration capability: research first (20 iterations, GLM-5.2 via cli-devin + DeepSeek V4 Flash xhigh via cli-opencode/Cline, no early convergence), then synthesize into whatever phase children mcp-obsidian + mcp-notion need — including any Obsidian plugins that close a gap."
trigger_phrases:
  - "015-notion-to-obisidian-migration"
  - "notion to obsidian migration"
  - "migrate notion obsidian"
  - "flawless notion obsidian migration"
  - "complex notion workspace migration"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "added phase 005 — installed 9 more plugins + 3 references + roster + router wiring"
    next_safe_action: "None — all phases complete; per-plugin deep research is a separate follow-up"
    blockers: []
    key_files:
      - "spec.md"
      - "001-deep-research/research/research.md"
      - "002-migration-playbook/spec.md"
      - "003-notion-bases-plugin-tie-in/spec.md"
      - "004-plugin-install-and-verification/spec.md"
      - "005-obsidian-plugin-expansion/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-notion-to-obisidian-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: 015 Notion→Obsidian flawless-migration

---

## 1. ROOT PURPOSE

We need to **flawlessly migrate a COMPLEX Notion environment** — databases, relations, rollups, formulas, nested pages, files, comments, views — **fully into Obsidian**, using the `mcp-notion` (24-tool Notion MCP) and `mcp-obsidian` (Local REST API + notesmd CLI + plugins) skills as the migration engine, and adding Obsidian plugins where they close a gap the skills cannot.

A prior single-pass web-research note (preserved as `001-deep-research/prior-findings.md`) already sketched the shape of this problem — importer choice, Bases as the database replacement, plugin-recovered relations/rollups — but it was not exhaustive and predates a dedicated research loop. So the decomposition is **research first** (deep, multi-model, no early convergence, seeded by that prior note), **then autonomously synthesize → phase → implement**, rather than committing to a migration design before the gaps are mapped.

---

## 2. WHAT NEEDS DONE

- Produce a verified, repeatable method for migrating a complex Notion workspace into Obsidian with no silent data loss — relations, rollups, formulas, nested hierarchy, files/attachments, comments, and views all accounted for (preserved, reconstructed, or explicitly logged as a limitation).
- Decide how `mcp-notion` (as the Notion-side reader) and `mcp-obsidian` (as the Obsidian-side writer) drive each step of that method, and which Obsidian plugins (e.g. Notion Bases, Dataview) are required to close feature gaps.
- Bake the verified capability into the two skills (and install any proven plugin), so the migration is a repeatable, agent-driven capability rather than a one-off manual playbook.

---

## 3. SUB-PHASE LIST

| Phase | Folder | Outcome |
|---|---|---|
| **001 — Deep research** | `001-deep-research/` | Done. 20-iteration deep research (10x GLM-5.2 via cli-devin + 10x DeepSeek V4 Flash xhigh via cli-opencode/Cline, no early convergence), seeded by the preserved prior findings — everything needed for a flawless complex Notion→Obsidian migration. |
| **002 — Migration playbook** | `002-migration-playbook/` | Done. Built `mcp-obsidian/references/notion-migration.md` (8-step reconstruction + verification method) and `mcp-notion/references/migration-inventory.md` (7-step inventory + API-gap reads), plus additive `NOTION_MIGRATION` router entries in both SKILL.md files. |
| **003 — Notion Bases plugin tie-in** | `003-notion-bases-plugin-tie-in/` | Done. Built the `mcp-obsidian` Notion Bases community-plugin reference tree (two-way relations, 7 rollups, 7 views, subtasks, Lookup columns) plus a Dataview supplement, a feature-catalog entry, the OBS-022 manual scenario, and a `PLUGIN_NOTION_BASES` router intent. |
| **004 — Plugin install and verification** | `004-plugin-install-and-verification/` | Done. Shipped the OBS-023 headless real-vault install scenario and the 11-check `verify-notion-migration-parity.sh`, and executed the real BRAT install of Notion Bases v1.12.0 into the operator's vault (Dataview already present). |
| **005 — Obsidian plugin-stack expansion** | `005-obsidian-plugin-expansion/` | Done. Installed nine more community plugins into the operator's vault via BRAT-headless, authored dedicated file-layer references for the three with an AI-authorable data model (Advanced Canvas, Claudian, Project Manager), added an all-plugins roster covering every enabled plugin, and wired three new router intents into `mcp-obsidian`. |

Phases 002-004 completed the migration capability: the migration/inventory references, the Notion Bases plugin knowledge tree, and the parity verifier are built into `mcp-obsidian`/`mcp-notion`, and Notion Bases v1.12.0 is installed in the operator's vault. Phase 005 extends the same skill beyond migration to the operator's broader plugin stack — nine more plugins installed, and dedicated docs for the three with a file-layer data model. Running an actual Notion→Obsidian migration of a live workspace is a separate future use of this capability.

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-deep-research/` | 20-iteration deep research into the flawless migration method | Done |
| 002 | `002-migration-playbook/` | `mcp-obsidian`/`mcp-notion` migration + inventory reference docs | Done |
| 003 | `003-notion-bases-plugin-tie-in/` | Notion Bases plugin knowledge tree + Dataview supplement | Done |
| 004 | `004-plugin-install-and-verification/` | Real-vault plugin install scenario + 11-check parity script | Done |
| 005 | `005-obsidian-plugin-expansion/` | Nine-plugin vault install + three file-layer references + all-plugins roster + router wiring | Done |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume mcp-tooling/015-notion-to-obisidian-migration/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Research verdict decided (no open design blockers) | `research.md` §13-15 (Divergence Map, Open Questions, Recommendations) |
| 002 | 003 | Migration playbook build complete: both reference docs + routers built | `validate_document.py --type skill` = 0 issues; `ci-leaf-manifest-freshness.cjs` OK |
| 003 | 004 | Notion Bases plugin reference tree built; `mcp-obsidian` router routes to it | `validate_document.py --type skill` = 0 issues; `ci-leaf-manifest-freshness.cjs` OK |
| 004 | Done | Planning artifacts built AND the real install has executed with an explicit operator go-ahead | `OBS-023` scenario verify step passes; `verify-notion-migration-parity.sh` runs against a live vault |
| 005 | Done | Nine plugins installed in the vault AND three file-layer references + roster + router wiring authored and validated | `validate.sh 005-obsidian-plugin-expansion --strict` Errors:0; `validate_document.py` 16/16 clean |
<!-- /ANCHOR:phase-map -->
