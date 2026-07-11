---
title: "Feature Specification: deprecate the numbered prefix on feature_catalog and manual_testing_playbook category folders"
description: "Every skill's feature_catalog/NN--<name>/ and manual_testing_playbook/NN--<name>/ category folders carry a two-digit NN-- ordinal prefix. No runtime consumer parses that number — ordering already lives in the root index tables — yet the prefix is load-bearing in exactly one place (the sk-doc validator classifies a catalog/playbook leaf only when its parent matches ^\\d{2}--). This phase-parent deprecates the prefix repo-wide: it first makes every consumer number-agnostic and guards against re-introduction, then renames all 390 numbered folders (123 feature_catalog + 267 manual_testing_playbook across 34 skills) and rewrites every live reference in lockstep, then proves no validation or benchmark regression. Descriptive slug becomes the canonical, sole naming form."
trigger_phrases:
  - "deprecate numbered prefix"
  - "remove NN-- category prefix"
  - "de-number feature_catalog folders"
  - "de-number manual_testing_playbook folders"
  - "category folder rename"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/999-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All 5 phases shipped + verified"
    next_safe_action: "Memory save + push (operator-gated)"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No consumer parses the NN ordinal numerically — ordering lives in the root index tables (GPT investigation, agent B/D)"
      - "The only hard runtime dependency on the prefix is validate_document.py leaf classification (^\\d{2}--, two copies)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + phase list + outcome; the full evidence lives in research.md, the decisions in decision-record.md, and the mechanics in each child's plan.md. -->

# Feature Specification: Deprecate the Numbered Category-Folder Prefix

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix |
| **Level** | phase parent (program Level 3) |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Owner skill** | sk-doc (owns the `create-feature-catalog` + `create-manual-testing-playbook` convention and the `validate_document.py` classifier) |
| **Origin** | Operator: "deprecate the numbered prefix of feature catalog and playbook snippet folders … retroactively in all skills and update path references" |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Every skill authored under the sk-doc convention names its category subfolders with a two-digit ordinal
prefix: `feature_catalog/06--mcp-tool-surface/`, `manual_testing_playbook/01--read-path-freshness/`, and so on.
The prefix was intended to fix display order, but a 4-agent GPT-5.6-sol investigation (see `research.md`)
established that **no runtime consumer parses the number** — ordering is already driven by the root index
tables (`feature_catalog.md` / `manual_testing_playbook.md`), and the only place the number is even read is a
single lexical path sort that is cosmetic. The prefix therefore buys nothing and costs:

- **Churn** — every category insertion forces a renumber-and-relink cascade.
- **A silent-failure trap** — the sk-doc validator classifies a catalog/playbook *leaf* as its typed document
  (running the taxonomy and placeholder checks) **only when the immediate parent matches `^\d{2}--`**
  (`validate_document.py:129,135`, two copies). Any de-numbered folder silently downgrades to a generic
  `readme` and loses its validation, so the prefix cannot simply be dropped folder-by-folder.

**Purpose:** make the descriptive slug (`mcp-tool-surface`, `read-path-freshness`) the sole canonical form,
repo-wide, without regressing validation, benchmark scoring, or CI — by de-coupling every consumer from the
number *before* renaming, then renaming all folders and their references atomically per skill.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope (measured — see `research.md` for the full inventory):**
- **390 category folders** → strip the `NN--` prefix: 123 under `feature_catalog/`, 267 under
  `manual_testing_playbook/`, across **34 skills**. Zero name collisions once stripped.
- **115 `category:` frontmatter values** that embed the numbered form.
- **~1,052 index-table path rows** in the root `feature_catalog.md` / `manual_testing_playbook.md` files.
- **~5,298 markdown nav / cross-reference links** across ~1,841 files that point at numbered folders.
- **Load-bearing code/config**: `validate_document.py` leaf classification (both copies); the SKILL.md router
  JSON prefix blocks in `system-skill-advisor/SKILL.md` and `system-code-graph/SKILL.md`; any hard-coded
  category/leaf paths in tests.

**Out of scope (deliberate):**
- **Changelogs and historical narrative** (`CHANGELOG*`, `z_archive/`, spec-folder history) — these record
  what folders *were called*; rewriting them would falsify history. They keep the numbered strings.
- Compatibility symlinks or a dual-naming grace period — the migration is atomic per skill, so no aliases.
- Re-ordering categories, editing catalog/playbook *content*, or touching any non-category subfolder.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phases -->
## 4. PHASES

Ordered so the repo is internally consistent at every commit (validator tolerant → then rename).

| Phase | Child | Outcome |
|-------|-------|---------|
| **001** | `001-convention-docs` | Drop the `NN--category-name` mandate from `create-feature-catalog` + `create-manual-testing-playbook` SKILL.md, their templates, and the `/create:*` command generators; the descriptive slug becomes the documented canonical form. |
| **002** | `002-validator-and-guard` | Make `validate_document.py` (both copies) classify catalog/playbook leaves by *being a subfolder* rather than by `^\d{2}--`, so both forms validate during the transition; add a regression guard that FAILS when a **new** numbered category folder is introduced. |
| **003** | `003-migration-tooling` | A deterministic, dry-runnable migration script: enumerate folders, `git mv` strip-prefix, rewrite frontmatter `category:`, index-table paths, nav/cross-ref links (honoring the changelog/history exclusion list), and the two SKILL.md router-prefix blocks. Emits a diff + safety/collision report; no mutation. |
| **004** | `004-execute-migration` | Run the migration, fanned out by skill family, validating each family as it lands. All 390 folders renamed + every live reference rewritten. |
| **005** | `005-validate-and-rebenchmark` | Recursive `validate.sh --strict` on touched skills; CI markdown-link guard; hard-coded-path tests; re-run the Lane C smart-routing benchmark on affected skills to prove no scoring regression; prove the no-new-numbers guard fires. |

**Sequencing invariant:** 001 + 002 (foundation) must land before 003 authors against them; 002's tolerant
classifier must land before 004 renames (so nothing loses validation mid-flight); 005 is the gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Zero `feature_catalog/NN--*/` or `manual_testing_playbook/NN--*/` folders remain outside the excluded
   changelog/history surface.
2. `validate.sh --strict` is Errors 0 recursively across every touched skill, and every catalog/playbook leaf
   is still classified as its typed document (not downgraded to `readme`).
3. The Lane C smart-routing benchmark shows no scoring regression on affected skills versus the pre-migration
   baseline captured in 005.
4. The no-new-numbers guard rejects a freshly-created `NN--` category folder.
5. Convention docs, templates, and `/create:*` generators emit only de-numbered slugs.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Silent validation loss** (the central risk) → mitigated by landing the tolerant classifier (002) *before*
  any rename (004), and by 005 asserting leaf classification per skill.
- **Broken relative links / CI failure** → the migration rewrites links in the same pass as the rename;
  005 runs the whole-workspace markdown-link guard.
- **Router-config drift** → the two SKILL.md prefix blocks are rewritten by the migration script, not by hand,
  and re-verified in 005.
- **Concurrent-session churn on the active branch** → this packet is built and executed in an isolated
  worktree; commits are path-scoped.
- **Dependency:** the Lane C harness (unchanged) for the 005 regression check; the spec-kit validator
  (rebuilt in the worktree).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The migration's changelog/history exclusion boundary is enumerated in `decision-record.md`
and encoded as the script's deny-list in 003.
<!-- /ANCHOR:questions -->
