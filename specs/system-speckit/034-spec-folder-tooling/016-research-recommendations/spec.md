---
title: "Feature Specification: Research recommendations"
description: "Phase 14's research ranked 16 ways to stop the spec tooling from producing new validation failures and to heal old-format spec folders safely. Each child phase plans one of them."
trigger_phrases:
  - "research recommendations"
  - "spec auto healing recommendations"
  - "phase 16 research recommendations"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Research recommendations

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-speckit/034-spec-folder-tooling` |
| **Predecessor** | 015-archive-current-location-and-ignored-files |
| **Successor** | None |
| **Handoff Criteria** | Each child plans one recommendation from `../014-spec-auto-healing-research/research/research.md` section 11 and validates strict at its slot |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The tools that scaffold, archive, heal and index spec packets kept producing failures that the corpus-wide repair then had to clean up by hand: a template that nests anchors, phase scaffolds that fail their own gate, a healer that writes rejected phrases and version stamps it cannot prove, CI checks that compare the wrong thing, and no supported path for an external repo still on an older version.

### Purpose
Plan each of the 16 ranked recommendations as its own phase, then build, verify and ship all of them through parallel CLI lanes in an order that respects their dependencies and never lets two concurrent phases write the same file.

> **Phase-parent note:** This spec.md is the only authored document at the parent level. Each child holds its own plan, tasks and acceptance criteria.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One child phase per recommendation SH-01 to SH-16.
- Each child's plan names the files, the tests, the checks and the risks.
- Building every child through the lanes in `goal.md`: DeepSeek V4.1 Flash max through cli-pi on two routes and GPT-6 Luna max fast through cli-codex, in six waves.

### Out of Scope
- Work outside a child's own Files to Change.
- Reopening the research's verified findings.

### Files to Change
Each child keeps its own file list. This table maps children to recommendations.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-spec-template-anchor-nesting/` | Planned packet | SH-01 | Un-nest the spec template's `questions` anchor |
| `002-phase-scaffold-graph-metadata/` | Planned packet | SH-02 | Derive graph metadata before `create.sh --phase` exits |
| `003-archive-path-follow-ups/` | Planned packet | SH-03 | What remains after phase 15's archive fix |
| `004-trigger-index-rebuild-hardening/` | Planned packet | SH-04 | Harden the CI rebuild job |
| `005-healer-phrase-seeding/` | Planned packet | SH-05 | Stop the healer writing rejected phrases |
| `006-evidence-gated-provenance/` | Planned packet | SH-06 | Stamp template versions only on exact evidence |
| `007-ci-rule-set-comparison/` | Planned packet | SH-07 | Compare failing rule sets, pass the weekly baseline |
| `008-legacy-era-report/` | Planned packet | SH-09 | One read-only report of old-format generations |
| `009-doctor-update-compatibility/` | Planned packet | SH-08 | The external-repo path through `/doctor:update` |
| `010-upgrade-reversibility/` | Planned packet | SH-10 | A reversibility record for `upgrade-legacy --apply` |
| `011-anchor-repair-mode/` | Planned packet | SH-11 | An anchor-repair mode, including un-nesting |
| `012-fold-one-off-repairs/` | Planned packet | SH-12 | Fold the remaining one-off scripts into tools |
| `013-anchor-contract-alignment/` | Planned packet | SH-13 | Make the anchor check, registry and docs agree |
| `014-gate-3-menu-parity/` | Planned packet | SH-14 | Render every Gate 3 menu from shared constants |
| `015-lane-rules-as-heal-modes/` | Planned packet | SH-15 | Automate the deterministic lane rules |
| `016-phrase-cleanup-hardening/` | Planned packet | SH-16 | Harden the phrase cleanup tools |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. The order follows the research's dependencies: SH-05, SH-06, SH-09 and SH-10 come before SH-08, SH-01 before SH-11, and SH-01 and SH-11 before SH-13.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-spec-template-anchor-nesting/` | Un-nest the spec template's `questions` anchor (SH-01) | Planned |
| 2 | `002-phase-scaffold-graph-metadata/` | Derive graph metadata before `create.sh --phase` exits (SH-02) | Planned |
| 3 | `003-archive-path-follow-ups/` | What remains after phase 15's archive fix (SH-03) | Planned |
| 4 | `004-trigger-index-rebuild-hardening/` | Harden the CI rebuild job (SH-04) | Planned |
| 5 | `005-healer-phrase-seeding/` | Stop the healer writing rejected phrases (SH-05) | Planned |
| 6 | `006-evidence-gated-provenance/` | Stamp template versions only on exact evidence (SH-06) | Planned |
| 7 | `007-ci-rule-set-comparison/` | Compare failing rule sets, pass the weekly baseline (SH-07) | Planned |
| 8 | `008-legacy-era-report/` | One read-only report of old-format generations (SH-09) | Planned |
| 9 | `009-doctor-update-compatibility/` | The external-repo path through `/doctor:update` (SH-08) | Planned |
| 10 | `010-upgrade-reversibility/` | A reversibility record for `upgrade-legacy --apply` (SH-10) | Planned |
| 11 | `011-anchor-repair-mode/` | An anchor-repair mode, including un-nesting (SH-11) | Planned |
| 12 | `012-fold-one-off-repairs/` | Fold the remaining one-off scripts into tools (SH-12) | Planned |
| 13 | `013-anchor-contract-alignment/` | Make the anchor check, registry and docs agree (SH-13) | Planned |
| 14 | `014-gate-3-menu-parity/` | Render every Gate 3 menu from shared constants (SH-14) | Planned |
| 15 | `015-lane-rules-as-heal-modes/` | Automate the deterministic lane rules (SH-15) | Planned |
| 16 | `016-phrase-cleanup-hardening/` | Harden the phrase cleanup tools (SH-16) | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-spec-template-anchor-nesting` | `011-anchor-repair-mode` | The fixed template is the un-nesting target | `validate.sh --strict` passes on each child |
| `005-healer-phrase-seeding` | `009-doctor-update-compatibility` | The doctor path never ships a healer that writes rejected phrases | `validate.sh --strict` passes on each child |
| `006-evidence-gated-provenance` | `009-doctor-update-compatibility` | The doctor path never ships invented provenance | `validate.sh --strict` passes on each child |
| `008-legacy-era-report` | `009-doctor-update-compatibility` | The doctor check reads the era report | `validate.sh --strict` passes on each child |
| `010-upgrade-reversibility` | `009-doctor-update-compatibility` | The doctor path never ships an apply step with no undo record | `validate.sh --strict` passes on each child |
| `001-spec-template-anchor-nesting` | `013-anchor-contract-alignment` | New scaffolds pass a nesting check | `validate.sh --strict` passes on each child |
| `011-anchor-repair-mode` | `013-anchor-contract-alignment` | The corpus is un-nested before nesting becomes an error | `validate.sh --strict` passes on each child |
| Any other pair | Any other | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator decided the open choices on 2026-10-08, and each child records its own decision.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research**: `../014-spec-auto-healing-research/research/research.md`, section 11 ranks the recommendations
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/`
- **Parent Spec**: See `../spec.md`
