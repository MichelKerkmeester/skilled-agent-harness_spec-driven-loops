---
title: "Tasks: ui-ux-pro-max-merge"
description: "Task breakdown for the three-phase merge of ui-ux-pro-max data + search into sk-design-interface. Status planned; tasks grouped by implementation phase."
trigger_phrases:
  - "ui-ux-pro-max merge tasks"
  - "sk-design-interface data merge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/003-ui-ux-pro-max-merge"
    last_updated_at: "2026-06-13T17:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phased task breakdown"
    next_safe_action: "Execute Phase 1 tasks"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-003-ui-ux-pro-max-merge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: ui-ux-pro-max-merge

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending · `[P]` parallelizable
- Each phase ends with skill validation + `validate.sh --strict`.
- Map every copied MIT file to a provenance entry in the same commit.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] Re-read the 002 recommendation; confirm per-asset verdicts
- [ ] Re-count source CSVs (measured, not marketing)
- [ ] Capture target skill baseline (SKILL.md size, advisor routing)
- [ ] Create `.opencode/skills/sk-design-interface/assets/data/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

The merge ships in three internal phases (authoritative breakdown in `plan.md` §4).

**Merge Phase 1 — Quality-floor data + licensing foundation**
- [ ] Copy `ux-guidelines.csv`, `charts.csv`, `app-interface.csv` (keep a11y rows)
- [ ] Extract `react-performance.csv` design-quality rows (layout-stability, reduced-motion, load-shift) into the quality reference; leave React perf to `sk-code` (002 ADAPT)
- [ ] Author `references/ux_quality_reference.md` distilled from CRITICAL/HIGH rows
- [ ] Create `LICENSE-ui-ux-pro-max.txt` (verbatim MIT) + `THIRD-PARTY-NOTICES.md`
- [ ] Update SKILL.md `license:` frontmatter + add a one-line routing pointer

**Merge Phase 2 — Zero-dep search script**
- [ ] Adapt `core.py` → `scripts/design_search_core.py`; `search.py` → `scripts/design_search.py`
- [ ] Re-root `DATA_DIR` → `assets/data`; trim `CSV_CONFIG`; drop stack config; MIT header
- [ ] Generator/persistence removal gate: no `design_system` import, no `--design-system`, no `--persist`, no generated `design-system/` writes (query-only)
- [ ] Confirm stdlib-only; smoke-run a query; add SKILL.md "optional, never required" note

**Merge Phase 3 — Aesthetic critique-against inventory + advisor routing**
- [ ] Copy `styles.csv`, `colors.csv`, `typography.csv`, `ui-reasoning.csv`, `products.csv`, `landing.csv` → `assets/data/`
- [ ] Author `references/design_inventory.md` (critique-against framing)
- [ ] Extend `THIRD-PARTY-NOTICES.md`; update `graph-metadata.json` routing (keep existing edges)
- [ ] Add the SKILL.md routing section (keep SKILL.md lean)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] Each internal phase committed separately, gated by `validate.sh --strict`
- [ ] Skill validation + advisor discovery pass after the final phase
- [ ] `design_principles.md` content unchanged (diff clean)
- [ ] Every adopted MIT file mapped in `THIRD-PARTY-NOTICES.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All three phases shipped and committed
- [ ] `design_principles.md` content unchanged
- [ ] SKILL.md stays lean; no CSV content inlined
- [ ] Every adopted file is license-mapped
- [ ] Advisor still routes the skill; existing edges intact
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source recommendation: `../002-ui-ux-pro-max-merge-research/research/research.md`
- Plan: `plan.md` (phases + dependencies)
- Target skill: `.opencode/skills/sk-design-interface/`
<!-- /ANCHOR:cross-refs -->
