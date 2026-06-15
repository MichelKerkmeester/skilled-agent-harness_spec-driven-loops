---
title: "Feature Specification: Catalog & Playbook Snippet De-Numbering [skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/spec]"
description: "Remove numeric filename prefixes from per-feature snippet files in feature catalogs and manual testing playbooks repo-wide, keeping numbered category folders; update sk-doc standards first, then migrate ~1,531 files and their references."
trigger_phrases:
  - "133 catalog playbook snippet denumbering"
  - "remove numbered prefix snippet files"
  - "feature catalog playbook de-numbering"
  - "sk-doc snippet naming convention"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All 6 phases complete: 1557 snippets de-numbered, merged to main"
    next_safe_action: "Program complete; optional reintroduction guard is a follow-up"
    blockers: []
    key_files:
      - "spec.md"
      - "resource-map.md"
      - "graph-metadata.json"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "D1 execution mechanic: script-assisted (DeepSeek authors tool, MiMo runs)"
      - "D2 referrer scope: INCLUDE the ~743 historical spec-folder links"
      - "D3 git isolation: dedicated worktree, merged to main after phase 006"
      - "D4 collisions: auto-resolve by inspection; anomalies frozen"
---

# Feature Specification: Catalog & Playbook Snippet De-Numbering

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Updated** | 2026-06-06 |
| **Branch** | dedicated worktree `.worktrees/NNNN-snippet-denumbering` (per D3), merged to `main` after phase 006 |
| **Parent Packet** | `skilled-agent-orchestration` |
| **Predecessor** | `125-feature-catalog-template-improvements` (most recent sk-doc catalog work) |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Per-feature snippet files in feature catalogs and manual testing playbooks carry a **globally sequential numeric prefix** (`001-feature-name.md`, `NNN-feature-name.md`) that "continues across categories and does not reset." That prefix makes the packages hard to maintain: inserting, reordering, or moving a feature forces a renumber, the global sequence drifts (real folders already mix `007` next to `024`), and two features can only be told apart by their number — producing duplicate slugs once the number is stripped. The numbers add maintenance cost without adding navigational value the root document does not already provide.

### Purpose
Drop the numeric prefix from every per-feature snippet **filename** (`NNN-feature-name.md` → `feature-name.md`) while **keeping** the numeric prefix on the **category folders** (`NN--category-name/` stays). Update the sk-doc standards and templates first so the new convention is canonical, then retroactively migrate every existing feature catalog and manual testing playbook in the public repo (~1,531 files across 20 skills) and fix all references to the renamed files.

> **Phase-parent note:** This spec.md is the ONLY authored planning document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and continuity live in the child phase folders listed in the Phase Documentation Map below. The cross-cutting blast-radius ledger lives in `resource-map.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update sk-doc creation standards, templates, snippet templates, and the two `create:*` command docs/assets so the no-prefix snippet convention is canonical (phase 001).
- Define and document the replacement ordering rule: snippet order is defined by the **root catalog/playbook listing order**, not by filename; category folders keep `NN--` numbering for section order.
- Build deterministic migration tooling with a dry-run, collision-abort, and reference-rewrite pass (phase 002).
- Retroactively rename ~1,531 per-feature snippet files across 20 active skill packages and rewrite their in-tree and active-skill references (phases 003–005).
- **Per D2:** rewrite ALL numbered-snippet references repo-wide, including the ~743 historical referrers under `.opencode/specs/**` (phase 006), so no stale numbered link remains anywhere active.
- Repo-wide reference sweep, validation, optional reintroduction guard, and memory save (phase 006).
- **Per D3:** run the bulk migration (phases 003–006) inside a dedicated git worktree (`.worktrees/NNNN-snippet-denumbering`, sk-git-created), merged to `main` after phase 006 validates. Phases 001 (12-file standard) + 002 (packet-local tooling) land on `main` first so the worktree branches from an updated baseline.

### Out of Scope
- **Category folder numbering** — kept by design (`NN--category-name/` unchanged).
- **Feature IDs inside content** (e.g. `M-219`, `EX-001`) — these are scenario identifiers, not filenames; they stay.
- **Pre-existing anomalies** not caused by this change (per D4 frozen): the uppercase `FEATURE_CATALOG.md` in `deep-ai-council`; `z_future/backup` catalogs/playbooks; `**/z_archive/**`; the unrelated `.worktrees/**` skill copies (distinct from our execution worktree).
- **Content rewrites** of snippets beyond the rename + reference fix (scope-locked to de-numbering).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/references/feature_catalog_creation.md` | Modify | 001 | Drop the `NNN-` per-feature prefix rule; add ordering rule |
| `.opencode/skills/sk-doc/references/manual_testing_playbook_creation.md` | Modify | 001 | Same de-numbering + ordering rule |
| `.opencode/skills/sk-doc/assets/feature_catalog/*.md` | Modify | 001 | Root + snippet templates: remove `{NN}`/`{NNN}` from filenames |
| `.opencode/skills/sk-doc/assets/testing_playbook/*.md` | Modify | 001 | Root + snippet templates: remove `{NNN}` from filenames |
| `.opencode/commands/create/{feature-catalog,testing-playbook}.md` + `assets/create_*` | Modify | 001 | Command docs/YAML instruction alignment |
| `.opencode/skills/sk-doc/scripts/validate_document.py` + `assets/template_rules.json` | Modify | 001 | Update stale `NNN-feature.md` comment/description (validator stays de-numbering-safe) |
| `133-.../scratch/` migration script + manifests | Create | 002 | Deterministic de-number + reference-rewrite tooling |
| `.opencode/skills/system-spec-kit/{feature_catalog,manual_testing_playbook}/**` | Rename | 003 | 673 snippet files de-numbered |
| `.opencode/skills/{mcp-click-up,system-skill-advisor,deep-*}/**` | Rename | 004 | ~548 snippet files de-numbered |
| `.opencode/skills/{system-code-graph,cli-*,sk-*,mcp-*}/**` | Rename | 005 | ~310 snippet files de-numbered |
| active-skill referrers (changelogs, references, root docs) | Modify | 003–006 | Rewrite links to renamed snippets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Six dependency-ordered phases. Each is an independently executable child spec folder owning its
> own plan, tasks, checklist, and continuity. Phases 001→002 are strictly sequential; 003/004/005
> may run once 002's script is green; 006 is last.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-sk-doc-standards-and-templates/` | Made the no-prefix convention canonical (13 contract files). MiMo authored, DeepSeek PASS, validator 11/11. | complete |
| 002 | `002-migration-tooling-and-dry-run/` | `denumber-snippets.cjs`: deterministic de-number + reference-rewrite, dry-run default, collision-abort. 23/23 harness + real dry-run + MiMo PASS. 2 collisions resolved. | complete |
| 003 | `003-migrate-system-spec-kit/` | Migrated `system-spec-kit`: 699 files (catalog+playbook) de-numbered, R-status preserved, collisions applied. | complete |
| 004 | `004-migrate-high-volume-skills/` | Migrated 548 files across 7 skills (mcp-click-up, system-skill-advisor, deep-*). | complete |
| 005 | `005-migrate-remaining-skills/` | Migrated 310 files across 12 skills (system-code-graph, cli-*, sk-*, mcp-*). | complete |
| 006 | `006-reference-sweep-validation-guard/` | Global ref sweep (765 files, 6430 edits, 0 conflicts); merged worktree→main; root docs validate; 0 numbered/stale refs remain. | complete |

**Outcome:** 1,562 snippet files de-numbered across 20 skills; numbered category folders kept; rename history preserved (100% similarity); merged to `main` (HEAD `60aeb5762f`). The 9 actively-WIP'd `027` deep-research files were handed back to their session (refs left numbered, exempt).

### Phase Transition Rules
- Each phase MUST pass `validate.sh` independently before the next phase begins.
- The parent spec tracks aggregate progress via this map; per-phase detail stays in the children.
- 001 (standards) MUST land before 002 (tooling); 002's dry-run MUST be green before any migration write in 003–005.
- Use `/speckit:resume [parent]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-sk-doc-standards-and-templates` | `002-migration-tooling-and-dry-run` | New convention is canonical in references + templates + create-commands; validator stays green | sk-doc strict validate passes; templates show de-numbered filenames |
| `002-migration-tooling-and-dry-run` | `003/004/005` | Script dry-run produces a clean rename + ref-edit manifest with ZERO unresolved collisions | Dry-run report reviewed; 2 known collisions resolved |
| `003/004/005` (migration waves) | `006-reference-sweep-validation-guard` | All target trees renamed; per-tree link-check + count reconciliation pass | `validate.sh` per skill; zero numbered snippet files remain in active scope |
| `006-reference-sweep-validation-guard` | (done) | Zero broken numbered-snippet links in active scope; completion metadata reconciled | Repo-wide grep clean; memory saved |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

The four execution decisions are RESOLVED (operator-confirmed 2026-06-06):

- **D1 — Execution mechanic: SCRIPT-ASSISTED.** DeepSeek authors + adversarially reviews a deterministic rename/reference-rewrite tool; MiMo runs it per-skill and verifies. Phase 002 builds it.
- **D2 — Referrer scope: INCLUDE spec folders.** The phase 006 sweep also rewrites the ~743 historical `.opencode/specs/**` numbered-snippet links — no stale numbered link remains active anywhere.
- **D3 — Git isolation: DEDICATED WORKTREE.** All skill-file mutations run in `.worktrees/NNNN-snippet-denumbering` (sk-git), merged to `main` once after phase 006 validates.
- **D4 — Collisions: AUTO-RESOLVE; anomalies FROZEN.** Phase 002 inspects the 4 colliding files and merges duplicates or assigns distinct slugs; the uppercase root + `z_future/backup` anomalies stay out of scope.

No blocking questions remain. Ready to begin phase 001 on operator go.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Cross-cutting blast radius / path ledger**: See `resource-map.md`
- **Phase children**: See sub-folders `001-*` … `006-*` for per-phase spec.md, plan.md, tasks.md
- **Parent track**: See `../spec.md` (skilled-agent-orchestration)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Governing standards (the surfaces phase 001 edits)**:
  - `.opencode/skills/sk-doc/references/feature_catalog_creation.md`
  - `.opencode/skills/sk-doc/references/manual_testing_playbook_creation.md`
