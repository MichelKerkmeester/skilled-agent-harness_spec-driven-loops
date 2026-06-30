---
title: "Implementation Plan: ui-ux-pro-max-merge"
description: "Three-phase plan to merge ui-ux-pro-max's data + search layers into sk-design-interface: Phase 1 quality-floor data + licensing foundation, Phase 2 zero-dep search script, Phase 3 aesthetic critique-against inventory + advisor routing."
trigger_phrases:
  - "ui-ux-pro-max merge plan"
  - "sk-design-interface data merge plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/003-ui-ux-pro-max-merge"
    last_updated_at: "2026-06-13T17:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored three-phase merge plan"
    next_safe_action: "Execute Phase 1"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: ui-ux-pro-max-merge

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs + CSV data + Python 3 stdlib scripts |
| **Framework** | House skill structure (`assets/`, `scripts/`, `references/`), advisor graph |
| **Storage** | `assets/data/*.csv` (copied from the MIT repo) |
| **Testing** | `validate.sh --strict`, skill validation, advisor discovery, script smoke-run |

### Overview
Adopt the data + search layers of `ui-ux-pro-max` into `sk-design-interface` in three independently shippable phases. Quality-floor data lands first (lowest risk, also stands up licensing); the search script second; the aesthetic critique-against inventory + advisor routing last.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 002 research recommendation accepted
- [x] Per-asset verdicts + integration design known
- [ ] Source repo files re-counted at execution time

### Definition of Done
- [ ] All three phases shipped
- [ ] `validate.sh --strict` green; skill validation + advisor discovery pass
- [ ] Licensing artifacts complete; `design_principles.md` unchanged
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive, layered adoption into the existing skill — data under `assets/data/`, optional tooling under `scripts/`, distilled guidance under `references/`, with `design_principles.md` remaining the untouched authority.

### Key Components
- **`assets/data/`** (NEW): adopted CSVs, MIT-licensed.
- **`references/ux_quality_reference.md`** (NEW): distilled quality-floor checklist.
- **`references/design_inventory.md`** (NEW): aesthetic data framed as critique-against.
- **`scripts/design_search*.py`** (NEW): zero-dep BM25 over `assets/data/`.
- **Licensing artifacts** (NEW): `LICENSE-ui-ux-pro-max.txt`, `THIRD-PARTY-NOTICES.md`.

### Data Flow
Designer reads `design_principles.md` (how to think) → consults `ux_quality_reference.md` (must-not-break rules) and `design_inventory.md` (clichés to deviate from) → optionally queries `assets/data/` via the search script.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design-interface/SKILL.md` | Skill entry doc | update (frontmatter license + short routing section) | size check + advisor discovery |
| `sk-design-interface/references/design_principles.md` | Primary authority | unchanged | no diff |
| `sk-design-interface/graph-metadata.json` | Advisor routing | update (trigger phrases / intents / key_files); keep existing edges | `skill_graph_validate` |
| `sk-design-interface/assets/data/`, `scripts/`, new references | New surfaces | create | files present + license-mapped |
| `external/ui-ux-pro-max-skill-main/` | Source | read-only | no diff |

Required inventories at execution:
- Re-count every CSV: `wc -l assets/data/*.csv`.
- Confirm no third-party imports in the adapted scripts: `rg -n "^import|^from" scripts/design_search*.py`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Quality-floor data + licensing foundation (lowest risk, highest value)
- [ ] Create `assets/data/`; copy `ux-guidelines.csv`, `charts.csv`, `app-interface.csv` (a11y subset)
- [ ] Extract the cross-cutting design-quality rows from `react-performance.csv` (layout-stability, reduced-motion, load-shift) into the quality reference; leave React-specific perf to `sk-code` (002 ADAPT verdict)
- [ ] Author `references/ux_quality_reference.md` (distilled from CRITICAL/HIGH rows)
- [ ] Stand up `LICENSE-ui-ux-pro-max.txt` (verbatim MIT) + `THIRD-PARTY-NOTICES.md`
- [ ] Update SKILL.md `license:` frontmatter + add a one-line routing pointer
- [ ] Validate skill + `validate.sh --strict`

### Phase 2: Zero-dep search script (optional tooling)
- [ ] Adapt `core.py` → `scripts/design_search_core.py`; `search.py` → `scripts/design_search.py`
- [ ] Re-root `DATA_DIR` → `assets/data`; trim `CSV_CONFIG` to adopted domains; drop stack config; add MIT provenance header
- [ ] **Generator/persistence removal gate:** assert no `design_system` import, no `--design-system`, no `--persist`, no generated `design-system/` writes in the adapted scripts (query-only surface)
- [ ] Smoke-run a query; confirm stdlib-only
- [ ] Add a SKILL.md note that the script is optional, never a required step

### Phase 3: Aesthetic critique-against inventory + advisor routing
- [ ] Copy `styles.csv`, `colors.csv`, `typography.csv`, `ui-reasoning.csv`, `products.csv`, `landing.csv` → `assets/data/`
- [ ] Author `references/design_inventory.md` (critique-against framing; "deviate deliberately")
- [ ] Extend `THIRD-PARTY-NOTICES.md` with the new files
- [ ] Update `graph-metadata.json` routing (trigger phrases: color palette, font pairing, design tokens, ux checklist; new `key_files`); keep existing edges
- [ ] Add the SKILL.md routing section; final skill + advisor + `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Spec docs + skill structure | `validate.sh --strict`, skill validation |
| Routing | Advisor still surfaces the skill | advisor discovery, `skill_graph_validate` |
| Script | Search runs, stdlib-only | smoke query, `rg` import check |
| Manual | Counts regenerated; license map complete | review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../002-ui-ux-pro-max-merge-research` | Internal | Green (complete) | No recommendation to implement |
| `external/ui-ux-pro-max-skill-main/` data + scripts | Internal (vendored) | Green | Nothing to adopt |
| Python 3 (stdlib only) | External | Green | Search script unusable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Skill validation/advisor regression, or licensing gap.
- **Procedure**: Revert the skill-dir changes (git); each phase is a discrete commit, so roll back per phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends on | Why |
|-------|-----------|-----|
| Phase 1 | 002 research | Implements its accepted recommendation; lands first MIT files + licensing |
| Phase 2 | Phase 1 | Search needs `assets/data/` to exist |
| Phase 3 | Phase 1 (licensing + `assets/data/`); benefits from Phase 2 | Extends the license map; search covers the new data |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 1 | S-M | Copy 3 CSVs, distill one checklist, two license docs, frontmatter edit |
| Phase 2 | S | Re-root + trim two short scripts |
| Phase 3 | M | Six CSVs, one framing reference, advisor routing, SKILL.md section |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- **Per-phase commits:** each phase is its own commit so rollback is granular.
- **No external state:** all changes are in the skill dir; reverting the commit fully restores prior behavior.
- **Advisor regeneration:** if routing breaks, restore the prior `graph-metadata.json` and re-run advisor discovery.
- **Licensing safety:** never copy an MIT file without its provenance entry in the same commit.
<!-- /ANCHOR:enhanced-rollback -->
