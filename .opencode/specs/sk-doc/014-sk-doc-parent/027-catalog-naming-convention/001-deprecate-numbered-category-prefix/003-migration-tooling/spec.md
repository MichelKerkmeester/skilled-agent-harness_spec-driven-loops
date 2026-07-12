---
title: "Spec: deterministic, dry-runnable migration tooling for the NN-- de-numbering"
description: "Phase 003 of the numbered-prefix deprecation. Author one deterministic migration script that performs the whole de-numbering — git mv the 390 numbered category folders to bare slugs, rewrite the 115 frontmatter category: values, the ~1,052 root index-table path rows, the ~5,298 nav/cross-ref links across ~1,841 files, and the two SKILL.md router-prefix blocks — with a DRY-RUN mode that mutates nothing and emits a rename map, per-file diff, and safety/collision report. Honors the ADR-004 deny-list (z_archive, CHANGELOG, history, this packet's evidence). Tooling-only phase — Phase 004 runs it."
trigger_phrases:
  - "de-numbering migration script"
  - "dry-run rename tooling"
  - "category prefix migration diff"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix/003-migration-tooling"
    last_updated_at: "2026-07-11T19:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored"
    next_safe_action: "Implement the migration script + dry-run report"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: Deterministic, Dry-Runnable Migration Tooling

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 025/003-migration-tooling |
| **Level** | 2 |
| **Status** | Complete |
| **Phase** | 003 of 005 (tooling) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
The de-numbering touches ~6,500 references across five distinct classes (research.md, C): 390 folder renames,
115 frontmatter `category:` values, ~1,052 root index-table rows, ~5,298 nav/cross-ref links across ~1,841
files, and 2 SKILL.md router-prefix blocks. Doing this by hand is un-reviewable and error-prone, and a wrong
edit to an excluded surface (a changelog, `z_archive/`, or this packet's own evidence) would falsify history
(ADR-004). This phase authors a **single deterministic migration script** whose default mode is a **DRY RUN**
that mutates nothing and emits a complete rename map, a per-file reference-change diff, and a safety/collision
report. The script computes its rename map from the live filesystem (not a hardcoded list) so it stays true to
the tree, and it honors the ADR-004 deny-list. Phase 004 is the only place it runs with mutation enabled.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
**In scope — author the migration script + its dry-run report:**
- One deterministic script (planned location `003-migration-tooling/scripts/denumber-migrate.mjs`; see plan.md
  §3) that, given the repo root, covers all five reference classes computed from the live tree:
  - **(a) Folder renames** — `git mv` each of the 390 numbered category folders to its bare slug (123 under
    `feature_catalog/`, 267 under `manual_testing_playbook/`, across 34 skills; zero collisions per research.md).
  - **(b) Frontmatter** — rewrite the 115 `category:` values that embed the numbered form.
  - **(c) Index tables** — rewrite the ~1,052 path rows in the root `feature_catalog.md` /
    `manual_testing_playbook.md` files.
  - **(d) Nav / cross-ref links** — rewrite the ~5,298 markdown links across ~1,841 files.
  - **(e) Router config** — rewrite the two SKILL.md router-prefix blocks: `system-skill-advisor/SKILL.md`
    prefixes (`:129,133,137,145`) and `system-code-graph/SKILL.md` `support_prefixes` / nested prefix arrays
    (`:131,136-171`).
- The dry-run report format: rename map, per-file diff, collision report, and an excluded-surface summary.

**Out of scope:** actually mutating the tree (Phase 004 runs the script with mutation on — dry-run only here);
the tolerant validator + no-new-numbers guard (Phase 002); the recursive re-validation and re-benchmark (005).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** In dry-run (the default) the script mutates nothing and prints a **complete rename map** plus a
  **per-file reference-change diff** for every file it would touch.
- **R2:** A **deny-list** excludes any path segment `z_archive/`, files named `CHANGELOG*` / `changelog*`,
  spec-folder history / `implementation-summary.md` narrative, and this packet's `research.md` /
  `decision-record.md` (they cite numbered paths as evidence) — per ADR-004.
- **R3:** A **collision check** aborts the run if any two stripped names would collide within a parent
  (expected zero per research.md, A); the check is reported explicitly, not assumed.
- **R4:** All **five reference classes (a–e)** are covered, and the rename map is **computed from the live
  tree**, not a hardcoded list, so it edits only references to real in-scope category folders.
- **R5:** The script is **re-runnable / idempotent** (a second run after a partial run does the right thing —
  already-renamed folders and already-rewritten references are no-ops) and **reversible via git**.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. A dry-run against the current tree reports approximately: **~390 renames**, **~115 category edits**,
   **~1,052 index rows**, **~5,298 links**, **2 router blocks**, **0 collisions**, and **0 mutations to any
   excluded surface** (deny-list clean).
2. `validate.sh --strict` on this phase folder is Errors 0.
3. The script is reviewed (dry-run output inspected against research.md counts) **before** Phase 004 runs it
   with mutation enabled.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Risk:* an over-broad link rewrite touches a numbered string inside an excluded surface → mitigated by R2's
  deny-list and the dry-run's excluded-surface summary being inspected before Phase 004.
- *Risk:* the counts drift from research.md between authoring and running → the rename map is recomputed from
  the live tree every run (R4), so the report reflects the tree at run time, not a snapshot.
- *Dependency:* Phase 001 (canonical de-numbered slug) and Phase 002 (tolerant classifier) must land first so
  the script authors against the settled target shape and every intermediate commit still validates.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
None. Script location is proposed in plan.md §3 (packet-local `scripts/`), reversible to the sk-doc scripts area
if review prefers it.
<!-- /ANCHOR:questions -->
