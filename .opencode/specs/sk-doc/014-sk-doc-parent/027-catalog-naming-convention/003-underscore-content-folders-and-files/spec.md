---
title: "Feature Specification: restyle catalog/playbook content folders and files to underscore_case"
description: "Every surviving hyphenated category folder and per-feature file under feature_catalog/ and manual_testing_playbook/ (plus references/, assets/, benchmark/ content subfolders) is renamed from hyphen-case to underscore_case, repo-wide across all skills. ~510 content subfolders + ~1,959 per-feature .md files. Unlike sibling de-numbering packets 001/002, no runtime gate keys on hyphen-vs-underscore (the validator classifies leaves by the feature_catalog/manual_testing_playbook parent-dir NAME, and the Lane C loader selects by frontmatter), so the load-bearing risk is low; the work is a rename + path-scoped reference sweep + convention-doc rewrite + a no-new-hyphen guard. Skill/agent/command/phase-folder names stay hyphenated."
trigger_phrases:
  - "underscore content folders"
  - "hyphen to underscore catalog"
  - "restyle feature_catalog folders"
  - "underscore per-feature filenames"
  - "content folder underscore migration"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/003-underscore-content-folders-and-files"
    last_updated_at: "2026-07-12T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored (scaffold)"
    next_safe_action: "Terra: author phase children, then implement 001-convention-docs"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Validator classifies catalog/playbook leaves by parent.parent dir NAME (feature_catalog/manual_testing_playbook), not the slug (validate_document.py:129,137) -> underscore slugs validate unchanged"
      - "Lane C loader selects scenario files by frontmatter, not filename shape (load-playbook-scenarios.cjs:306) -> underscore filenames load unchanged"
      - "Measured surface: ~510 hyphenated content subfolders + ~1,959 hyphenated per-feature .md files (excl z_archive)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + phase list + outcome; full evidence in research.md, decisions in decision-record.md, mechanics in each child's plan.md. -->

# Feature Specification: Underscore Restyle of Catalog/Playbook Content

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/014-sk-doc-parent/027-catalog-naming-convention/003-underscore-content-folders-and-files |
| **Level** | phase parent (Level 3) |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-12 |
| **Owner skill** | sk-doc (owns the `create-feature-catalog` + `create-manual-testing-playbook` conventions, templates, `/create:*` generators, and the `validate_document.py` classifier) |
| **Origin** | Operator: "make sure all folders in feature catalog, playbook, benchmarks, skill references, assets, etc use underscores (folder_name not folder-name)" — scope confirmed as all content folders AND all per-feature files |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Catalog/playbook content is named in hyphen-case: category folders (`feature_catalog/mcp-tool-surface/`),
per-feature files (`read-path-freshness.md`), and content subfolders under `references/`, `assets/`, and
`benchmark/`. The operator's canonical form is `underscore_case`, so `feature_catalog/mcp-tool-surface/read-path-freshness.md`
becomes `feature_catalog/mcp_tool_surface/read_path_freshness.md`.

Unlike the sibling de-numbering packets (001/002), **no runtime consumer keys on hyphen-vs-underscore**:
- The sk-doc validator classifies a catalog/playbook leaf by its `feature_catalog` / `manual_testing_playbook`
  parent-directory NAME, not by the category slug (`validate_document.py:129,137`) — so underscore slugs validate
  identically.
- The Lane C skill-benchmark loader selects scenario files by frontmatter content, not by filename shape
  (`load-playbook-scenarios.cjs:306`) — so underscore filenames load identically.

So this is a mechanical rename + path-scoped reference sweep, not a gate-neutralization problem. It still costs a
convention-doc rewrite (the `create-*` SKILLs and templates currently mandate the hyphenated `category-name` /
`feature-name.md` form) and a guard so the underscore form is self-enforcing.

**Purpose:** make `underscore_case` the sole canonical form for all in-scope catalog/playbook content folders and
files, repo-wide, without regressing validation, the Lane C benchmark corpus, or CI.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope (measured — see `research.md` for the full inventory):**
- **~510 hyphenated content subfolders**: `feature_catalog/<category>/` (101) + `manual_testing_playbook/<category>/`
  (255) + hyphenated subfolders under `references/` (3), `assets/` (17), and `benchmark/` (31), across all skills.
- **~1,959 hyphenated per-feature `.md` files** under `feature_catalog/<category>/` and
  `manual_testing_playbook/<category>/`.
- **Reference surface**: root index tables (`feature_catalog.md` / `manual_testing_playbook.md` path rows),
  `category:` frontmatter values, markdown nav / cross-reference links that point at in-scope paths, and any
  hub-routing index rows that cite these filenames.
- **Convention docs**: `create-feature-catalog` + `create-manual-testing-playbook` SKILL.md, their templates, and the
  `/create:*` generators — rewrite the documented canonical form from `category-name` / `feature-name.md` to
  `category_name` / `feature_name.md`.
- **Guard**: a check that FAILS when a NEW hyphenated content folder or file is introduced under the in-scope
  surfaces (mirrors the 001/002 no-new-numbers guards).

**Out of scope (deliberate):**
- **Skill / agent / command directory names** (`sk-doc`, `create-feature-catalog`, `code-review`, ...) and **spec
  phase-folder names** (`^[0-9]{3}-[a-z0-9-]+$`) — hyphen-only by hard convention; never underscored. The reference
  sweep is path-scoped and word-boundary-safe so hyphenated skill/tool names appearing INSIDE prose or as reference
  targets are not touched.
- **Changelogs, `z_archive/`, completed spec-folder history/narrative** — frozen.
- **Category-folder / snippet-file DE-NUMBERING** — that is siblings 001/002, already complete.
- Any digit-bearing topic name whose hyphens are structural (e.g. `4-stage-pipeline-architecture`) is reviewed for
  collision safety before restyle; the script computes the rename map from the live tree and hard-aborts on collision.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phases -->
## 4. PHASES

Ordered so the repo is internally consistent at every commit (guard/tolerance first, then rename).

| Phase | Child | Outcome |
|-------|-------|---------|
| **001** | `001-convention-docs` | Rewrite the `create-feature-catalog` + `create-manual-testing-playbook` SKILL.md, templates, and `/create:*` generators so `category_name` / `feature_name.md` (underscore) is the documented canonical form; the descriptive slug stays, only the separator changes. |
| **002** | `002-validator-and-guard` | Confirm `validate_document.py` (both copies) classifies underscore leaves unchanged (it keys on the parent-dir name); add a regression guard that FAILS when a NEW hyphenated content folder/file is introduced under the in-scope surfaces. |
| **003** | `003-migration-tooling` | A deterministic, dry-run-default rename engine adapted from the 001/002 de-numbering engine: enumerate the ~510 folders + ~1,959 files, compute the hyphen->underscore rename map on path segments only, hard-abort on collision, rewrite root index tables + `category:` frontmatter + nav/cross-ref links, honor the deny-list (skill/agent/command names, phase folders, z_archive, changelogs, spec history). Emits a diff + safety/collision report; no mutation without `--apply`. |
| **004** | `004-execute-migration` | Run the migration fanned out by skill family, validating each family as it lands. All in-scope folders + files renamed + every live reference rewritten in lockstep. |
| **005** | `005-validate-and-rebenchmark` | Recursive `validate.sh --strict` on touched skills; whole-workspace markdown-link guard; re-run the Lane C smart-routing benchmark on affected skills and prove no scoring regression vs a pre-migration baseline captured at phase start; prove the no-new-hyphen guard fires. |

**Sequencing invariant:** 001 (convention docs) + 002 (guard/tolerance) land before 003 authors against them; the
migration (004) lands before the gate (005). Because no runtime gate keys on the separator, there is no
silent-downgrade risk of the kind 001/002 faced — validation is unaffected mid-flight.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Zero hyphenated category folders or per-feature files remain under the in-scope surfaces outside the excluded
   changelog/archive/history surface; all are `underscore_case`.
2. `validate.sh --strict` is Errors 0 recursively across every touched skill, and every catalog/playbook leaf is
   still classified as its typed document (not downgraded to `readme`).
3. The Lane C smart-routing benchmark shows no scoring regression on affected skills vs the pre-migration baseline
   captured in 005; the discovered-scenario count is unchanged.
4. The no-new-hyphen guard rejects a freshly-created hyphenated content folder/file and accepts an underscore one.
5. Convention docs, templates, and `/create:*` generators emit only `underscore_case` content folder/file names.
6. No skill/agent/command/phase-folder name was underscored; the whole-workspace markdown-link guard is clean.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Over-broad sweep touching hyphenated skill/tool names in prose** (the central risk) — mitigated by a path-scoped,
  word-boundary-safe reference sweep that only rewrites in-scope path segments, plus a deny-list; 005 runs the
  whole-workspace markdown-link guard to catch any broken reference.
- **Rename collisions** — a hyphen->underscore rename could collide with an existing sibling; the script computes the
  map from the live tree and hard-aborts on any collision before writing.
- **Broken relative links / CI failure** — the migration rewrites links in the same pass as the rename; 005 runs the
  markdown-link guard whole-workspace.
- **Concurrent-session churn** — the migration is built and executed in an isolated git worktree; commits are
  path-scoped.
- **Dependency:** the Lane C harness (unchanged) for the 005 regression check; the spec-kit validator (rebuilt in the
  worktree). This packet's final tree consistency depends on the sibling re-nest (parent 001/002) landing.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The collision/deny-list boundary is enumerated in `decision-record.md` (to be authored) and encoded as
the migration script's deny-list in Phase 003.
<!-- /ANCHOR:questions -->
