---
title: "Tasks: Phase 012: makemd-support-beancount-removal"
description: "Task list for the make-md/beancount skill-doc change: author the make-md reference set, strip every beancount surface, wire PLUGIN_MAKEMD through SKILL.md, bump the version and changelog, and validate every changed doc plus this phase package."
trigger_phrases:
  - "015 makemd beancount tasks"
  - "mcp-obsidian make-md support tasks"
  - "PLUGIN_MAKEMD wiring tasks"
  - "phase 012 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/012-makemd-support-beancount-removal"
    last_updated_at: "2026-08-23T19:40:00Z"
    last_updated_by: "claude"
    recent_action: "Completed the make-md/beancount skill-doc change and authored close-out docs"
    next_safe_action: "Generate description.json + graph-metadata.json, then validate --strict"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-012-makemd-support-beancount-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 012: makemd-support-beancount-removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the notion-bases reference tree (`references/plugins/notion-bases/`) and its SKILL.md wiring as the structural template to mirror [evidence: make-md set mirrors the `notion-bases` file layout and frontmatter]
- [x] T002 Read the finance A/B research (Make.md install/features/mobile + reverse-engineered `.space` format) as the make-md source of truth [evidence: make-md docs cite the `.space` on-disk format from `Make-md/makemd`]
- [x] T003 Inventory every beancount surface and every notion-bases router point to mirror one-for-one [evidence: SKILL.md `PLUGIN_FINANCE` surface enumerated across intent, RESOURCE_MAP, PLUGINS aggregate, routing tuple, headline, keywords, triggers, §8]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the make-md reference tree (make-md, data-model, workflows, troubleshooting) and `feature-catalog/plugins/make-md.md` mirroring notion-bases (`references/plugins/make-md/`) [evidence: 4 reference files + feature-catalog entry created]
- [x] T005 Delete the beancount reference tree, feature-catalog entry, example script, assets, and manual-testing tie-in (`references/plugins/beancount-finance/`, `feature-catalog/plugins/beancount-finance.md`, `examples/beancount-transaction.sh`, `assets/plugins/beancount-finance/`, `manual-testing-playbook/plugin-tie-ins/beancount-transaction.md`) [evidence: `grep -rIi beancount` excl `changelog/` empty]
- [x] T006 SKILL.md router surgery: remove the `PLUGIN_FINANCE` surface and add `PLUGIN_MAKEMD` at every matching point (`SKILL.md`) [evidence: no `PLUGIN_FINANCE`; `PLUGIN_MAKEMD` present in intent + RESOURCE_MAP (9 paths) + routing tuple]
- [x] T007 Strip beancount from the prose/index docs and add make-md rows where notion-bases appears (`README.md`, `INSTALL-GUIDE.md`, `FEATURE-CATALOG.md`, `installed-plugins.md`, `plugin-operation-logic.md`, `examples/README.md`, `assets/workflows.md`, `manual-testing-playbook.md`) [evidence: `installed-plugins.md` + `FEATURE-CATALOG.md` reference make-md, not beancount]
- [x] T008 Bump SKILL.md 0.21.0.0 to 0.22.0.0 and add the changelog entry (`SKILL.md`, `changelog/v0.22.0.0.md`) [evidence: SKILL.md version 0.22.0.0; `v0.22.0.0.md` added]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `validate_document.py` on the 5 make-md docs and SKILL.md [evidence: 0 issues each]
- [x] T010 Grep sweeps: beancount empty (excl `changelog/`), `PLUGIN_MAKEMD` present / `PLUGIN_FINANCE` absent, make-md links resolve [evidence: sweeps clean; links resolve]
- [x] T011 Author this phase package and validate `--strict` (`012-makemd-support-beancount-removal/`) [evidence: authored docs pass FILE_EXISTS, TEMPLATE_SOURCE, LEVEL_MATCH, SECTION_COUNTS]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Beancount removed, Make.md added mirroring notion-bases, and changed docs validate - change complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
