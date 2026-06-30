---
title: "Feature Specification: ui-ux-pro-max-merge"
description: "Implement the 002 research recommendation: merge the data + search layers of the vendored MIT ui-ux-pro-max repo into sk-design-interface across three phases (quality-floor data + licensing, search script, aesthetic critique-against inventory), keeping the skill lean and its anti-default philosophy intact."
trigger_phrases:
  - "ui-ux-pro-max merge"
  - "sk-design-interface data merge"
  - "adopt ui-ux-pro-max data"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/003-ui-ux-pro-max-merge"
    last_updated_at: "2026-06-13T17:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All three merge phases shipped into sk-design-interface; skill validates; review fixes applied"
    next_safe_action: "Operator commits the skill changes; optional advisor graph rescan for new trigger phrases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-003-ui-ux-pro-max-merge"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: ui-ux-pro-max-merge

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-13 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Source** | Implements `../002-ui-ux-pro-max-merge-research/research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-design-interface` is strong on design *philosophy* but ships no data: it compresses all of accessibility, UX, color, and typography practice into a few sentences. The 002 research showed the vendored MIT `ui-ux-pro-max` repo has high-value data (objective quality rules + an aesthetic-pattern catalog) and a zero-dependency search engine that can fill that gap — provided the aesthetic data is framed as patterns to critique against, not answers to copy.

### Purpose
Adopt the data and search layers from `ui-ux-pro-max` into `sk-design-interface`, in three independently shippable phases, keeping the skill lean, its anti-default philosophy intact, and the licensing clean.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Quality-floor data (ADOPT directly):** `ux-guidelines.csv` (98), `charts.csv` (25), `app-interface.csv` a11y subset (29) → `assets/data/`, plus a distilled `references/ux_quality_reference.md`.
- **Cross-cutting perf slice (ADAPT):** extract only the design-quality rows from `react-performance.csv` (44) — layout-stability, reduced-motion, image/font loading shift — into `ux_quality_reference.md`. Do NOT copy React-specific implementation perf (that stays `sk-code` territory). Honors the 002 research ADAPT verdict for this file.
- **Search layer (ADAPT, optional):** `core.py` + `search.py` → `scripts/design_search_core.py` + `scripts/design_search.py`, re-rooted to `assets/data/`. The adapted scripts MUST NOT re-expose the upstream generator/persistence modes (no `design_system` import, no `--design-system`, no `--persist`, no generated `design-system/` writes).
- **Aesthetic data (ADAPT as critique-against inventory):** `styles.csv` (84), `colors.csv` (160), `typography.csv` (73), `ui-reasoning.csv` (161), `products.csv` (161), `landing.csv` (34) → `assets/data/`, plus a new `references/design_inventory.md`.
- **Licensing artifacts:** `LICENSE-ui-ux-pro-max.txt` (verbatim MIT), `THIRD-PARTY-NOTICES.md`, per-file provenance headers, SKILL.md `license:` frontmatter update.
- **Advisor routing + SKILL.md:** new trigger phrases / intent signals; a short routing section. `design_principles.md` stays the primary authority.

### Out of Scope
- `design_system.py` (1148 L generator), the 16 `stacks/*.csv`, `google-fonts.csv` (1923), `icons.csv`, `design.csv`/`draft.csv` scratch sets.
- The npm CLI, `.claude-plugin/`, 18 platform templates, 6 sibling sub-skills, the published ~660-line SKILL.md.
- Any change to `design_principles.md`'s content authority.
- Stack/implementation guidance (owned by `sk-code`).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: Quality-floor CSVs live under `assets/data/`; a distilled checklist lives in `references/ux_quality_reference.md` (CRITICAL/HIGH rows).
- R2: The adapted search scripts run against `assets/data/` with zero third-party dependencies and are never a mandatory runtime step.
- R3: Aesthetic CSVs are present and documented in `references/design_inventory.md` explicitly as "common/expected patterns to deviate from," not as a chooser.
- R4: Licensing artifacts present and correct; SKILL.md frontmatter declares the Apache-2.0 (principles) + MIT (data & search) mix and credits the upstream.
- R5: SKILL.md stays lean (well under the largest house SKILL.md); no CSV content inlined.
- R6: Advisor still routes the skill; the `enhances sk-code` / `prerequisite_for mcp-magicpath` edges still hold.
- R7: `design_principles.md` content unchanged.
- R8: The adapted search scripts expose query only — no generator/persistence surface (`design_system` import, `--design-system`, `--persist`, generated `design-system/` writes are all absent). Phase 2 acceptance asserts this.
- R9: `react-performance.csv` is handled per the 002 ADAPT verdict: its cross-cutting design-quality rows are extracted into the quality reference, or an explicit deferral is recorded. It is not silently dropped.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All three phases ship and `validate.sh --strict` is green for the packet.
- `package_skill.py` / skill validation passes for `sk-design-interface`; advisor discovery still surfaces it.
- Counts in any authored doc are regenerated from the CSVs, not copied from upstream marketing.
- A reviewer can trace every adopted file to a license/provenance entry.
- The skill's anti-default philosophy is preserved (aesthetic data framed as critique-against).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Mitigation |
|-------------------|------------|
| Aesthetic data drifts the skill toward generic defaults | Frame strictly as critique-against inventory in `design_inventory.md`; no auto-recommend flow |
| SKILL.md bloat | Route to references + scripts; never inline CSVs; keep the routing section short |
| Licensing incompleteness when MIT files land | Phase 1 stands up the licensing artifacts before/with the first copied file |
| Advisor routing regression | Re-run advisor discovery + edge checks after Phase 3 |
| Depends on 002 research | 002 is complete (`research/research.md`) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to ship the search scripts in Phase 2 or defer until data volume justifies them (default: ship, marked optional).

<!-- ANCHOR:nfr -->
### Non-Functional Requirements
- Zero new third-party runtime dependencies (scripts use stdlib only).
- SKILL.md size discipline maintained.
- License/attribution correctness is mandatory once MIT content is copied.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
### Edge Cases
- A CSV row references a stack-specific construct: keep only the cross-cutting design-quality fragment, drop the implementation detail.
- Upstream count vs measured count mismatch: always use the measured count.
- Adapted script run with a missing data file: fail clearly, never silently.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
### Complexity Assessment
Moderate. The data is copy + frame; the scripts are a small adaptation (re-root, trim config); the licensing follows an existing precedent. Risk is conceptual (framing) more than technical.
<!-- /ANCHOR:complexity -->
<!-- /ANCHOR:questions -->
