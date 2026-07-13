---
title: "Feature Specification: repo-wide kebab-case (hyphen) filesystem-naming convention"
description: "Ban snake_case in filesystem names repo-wide and make kebab-case (hyphens) the sole canonical form for folder names, file names, and script filenames — with a hard exemption for Python (.py, PEP-8 snake_case) plus vendored/third-party trees, generated/lockfile output, and tool-mandated filenames. Code identifiers, JSON/YAML keys, frontmatter fields, and DB columns are OUT of scope (idiomatic case, hyphens illegal there). Reverses and supersedes the 027 underscore migration, including the sk-doc validator/loader logic that keys on feature_catalog / manual_testing_playbook. Phase parent for a 12-phase program: policy + logic + generators + guard/tooling first, then a full repo inventory, then surface-by-surface migration (catalog/playbook, references/assets, scripts+imports, specs/docs, config/data), then validate/build/test/re-benchmark, then close-out and worktree merge."
trigger_phrases:
  - "hyphen naming convention"
  - "kebab-case filesystem names"
  - "ban snake_case files and folders"
  - "reverse underscore migration"
  - "hyphenate folder and file names"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the phase-parent spec and 12-phase decomposition"
    next_safe_action: "Review the phase map, then plan phase 001 in a worktree"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Transition tolerance window for the validator (dual-name accept) vs atomic logic+rename coupling for the catalog roots"
    answered_questions:
      - "Scope = filesystem names only (folders/files/script filenames); code identifiers + JSON/YAML keys + frontmatter fields keep idiomatic case"
      - "Exemptions = .py files, vendored/third-party, lockfiles/generated output, tool-mandated filenames"
      - "Fully reverses 027, including the sk-doc validator/loader logic keyed on feature_catalog / manual_testing_playbook"
      - "Placement = new top-level phase parent under sk-doc; migration execution runs on a worktree"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + phase list + outcome; mechanics live in each child's plan.md, decisions in decision-record.md. -->

# Feature Specification: Repo-Wide Kebab-Case Filesystem Naming

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention |
| **Level** | phase parent (Level 3) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc (owns the naming conventions, the `validate_document.py` classifier, the create-* generators, and the templates) |
| **Origin** | Operator: "reverse the naming convention and ban snake_case EVERYWHERE except python scripts … folder names, file names, script file names should all use hyphens … change logic in sk-doc and its create skills, then retroactively fix across the repo … definitely needs a worktree" |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo's filesystem naming is inconsistent and, after packet 027, actively snake_case for catalog/playbook content
(`feature_catalog/mcp_tool_surface/read_path_freshness.md`). The operator's canonical form is **kebab-case (hyphens)**
for every filesystem name — folders, files, and script filenames — with Python as the sole language exemption
(`.py` files keep PEP-8 snake_case). This program bans snake_case in filesystem names repo-wide and makes hyphens the
single canonical form.

The load-bearing complication: the sk-doc validator classifies catalog/playbook leaves by the `feature_catalog` /
`manual_testing_playbook` parent-directory NAME (`validate_document.py:129,137`), and the Lane C benchmark loader keys
on frontmatter. Renaming those two root directories to `feature-catalog` / `manual-testing-playbook` therefore requires
a coordinated change to the sk-doc classification logic — this is not a pure rename.

### Purpose
Make kebab-case the sole canonical filesystem-naming form repo-wide; update the sk-doc logic, create-* generators, and
templates to emit and validate it; add a guard so snake_case cannot re-enter in-scope names; and retroactively rename
every in-scope snake_case folder/file/script — fixing all path references and imports in lockstep — without regressing
validation, builds, tests, imports, or the Lane C benchmark.

### Non-Goals
- Renaming **code identifiers**, **JSON/YAML keys**, **frontmatter fields**, or **DB columns** — hyphens are illegal in
  most identifiers and snake_case keys are a data/API contract, not a filename. Idiomatic case is kept there.
- Touching **Python `.py`** filenames (snake_case is idiomatic / PEP-8).
- Renaming **vendored/third-party** trees, **generated/lockfile** output, or **tool-mandated** filenames.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Convention & policy**: hyphens are the sole canonical form for in-scope filesystem names; supersede the 027
  underscore ADR; publish the authoritative convention doc + the exemption/deny-list boundary.
- **sk-doc logic**: the `validate_document.py` classifier and any name-keyed logic (both copies), the Lane C loader
  (`load-playbook-scenarios.cjs`), and any validator rule that references `feature_catalog` / `manual_testing_playbook`.
- **create-* generators + templates**: emit hyphenated folder/file names (`feature-name.md`, `category-name/`, …);
  reverse the 027 generator changes.
- **Guard + migration tooling**: an exemption-aware no-new-snake_case guard; a deterministic, dry-run-default rename
  engine with collision hard-abort and an in-lockstep reference/import sweep.
- **Retroactive migration** of every in-scope snake_case folder / file / script filename across all skills, specs,
  references, assets, benchmarks, scripts, and config/data filenames — with all path references and imports fixed.

### Out of Scope (deliberate — exemptions)
- **Python `.py`** filenames.
- **Vendored / third-party**: `node_modules/`, Python `site-packages` / `.venv`, embedded package trees.
- **Generated / lockfiles**: `package-lock.json`, `dist/`, compiled bundles, other regenerated artifacts.
- **Tool-mandated filenames**: `package.json`, `tsconfig.json`, GitHub/workflow files, etc.
- **Code identifiers, JSON/YAML keys, frontmatter fields, DB columns** (idiomatic case retained).
- **Skill / agent / command directory names** and **spec phase-folder names** (`^[0-9]{3}-[a-z0-9-]+$`) are already
  hyphen-only; confirmed compliant, not re-touched.
- **Frozen surfaces**: `z_archive/`, changelogs, completed spec history.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phases -->
## PHASE DOCUMENTATION MAP

Ordered so the repo stays internally consistent at every commit: policy + logic + generators + guard land BEFORE any
rename, so the toolchain emits and accepts hyphens first; then inventory; then surface-by-surface migration; then the
full gate; then close-out. Migration-execution phases (005+) run on a dedicated worktree.

| Phase | Child | Outcome |
|-------|-------|---------|
| **001** | `001-convention-policy-and-scope` | The authoritative kebab-case convention doc + decision record: the rule (hyphens for in-scope FS names, `.py` exempt), the full exemption/deny-list boundary, the identifier/key out-of-scope line, and formal supersession of the 027 underscore ADR. |
| **002** | `002-sk-doc-validator-and-classifier-logic` | Update the sk-doc classifier (`validate_document.py`, both copies) + the Lane C loader + any validator rule keyed on `feature_catalog` / `manual_testing_playbook` to accept the hyphenated roots. Ship a transition tolerance (accept both names) so 002 can land before 006 renames the dirs. |
| **003** | `003-create-generators-and-templates` | Update the create-feature-catalog + create-manual-testing-playbook (and any other) create-* skills, the `/create:*` generators, and templates to emit hyphenated folder/file names; reverse the 027 generator changes. |
| **004** | `004-guard-and-migration-tooling` | Build the exemption-aware no-new-snake_case guard + the deterministic, dry-run-default rename engine (path-segment `_`→`-`, collision hard-abort, in-lockstep reference + import sweep, exemption deny-list). |
| **005** | `005-inventory-and-partitioning` | Full repo inventory of in-scope snake_case FS names (applying every exemption); the authoritative rename map + collision/exemption report; partition into migration batches by surface/skill family. Establish the worktree. |
| **006** | `006-migrate-catalog-and-playbook` | Reverse 027: rename `feature_catalog`→`feature-catalog`, `manual_testing_playbook`→`manual-testing-playbook`, and all underscore catalog/playbook content back to hyphens, across all skills; rewrite index tables + `category:` frontmatter + cross-refs; validated against the 002 logic. |
| **007** | `007-migrate-references-and-assets` | Hyphenate snake_case folders/files under `references/`, `assets/`, and `benchmark/` across all skills (non-catalog); rewrite their cross-references. |
| **008** | `008-migrate-scripts-and-imports` | Rename snake_case **script filenames** (`.ts`/`.js`/`.cjs`/`.mjs`/`.sh`) to hyphens AND fix every `import`/`require`/`source`/registry path reference in lockstep — the highest-risk phase. |
| **009** | `009-migrate-specs-and-docs` | Hyphenate remaining in-scope snake_case names across spec docs and other `.md` filesystem names (honoring frozen surfaces and the identifier/key exemption). |
| **010** | `010-migrate-config-and-data` | Remaining in-scope `.json`/`.yaml`/`.yml` **data/config filenames** (not keys) and any stragglers; final exemption reconciliation. |
| **011** | `011-validate-build-test-rebenchmark` | Recursive `validate.sh --strict` on touched skills; full build/test/typecheck gates; whole-repo import + markdown-link resolution (0 broken); Lane C re-baseline vs a pre-migration snapshot; prove the no-new-snake guard fires. |
| **012** | `012-supersede-027-and-closeout` | Mark 027 superseded, update changelogs, finalize the convention as canonical, parent rollup, and merge the worktree back. |

**Sequencing invariants:** 001 lands first, then 002/003/004 (the toolchain speaks hyphens before any rename). 002 ships
a dual-name tolerance so it can precede 006. The rename batches (006-010) each validate + fix references before commit. 011 is the whole-repo gate;
012 supersedes 027 and merges. Because a runtime path (the validator classifier) keys on the catalog root names, 006
must land coupled with the 002 logic — call out any silent-downgrade risk in the 006 plan.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Zero in-scope snake_case filesystem names remain (folders, files, script filenames) outside the exemption set and
   frozen surfaces; all are kebab-case.
2. `validate.sh --strict` is Errors 0 recursively across every touched skill; catalog/playbook leaves still classify
   correctly under the updated (hyphen-keyed) logic.
3. All build / test / typecheck gates pass; whole-repo import and markdown-link resolution shows **0 broken references**
   after the script+import rename.
4. The Lane C smart-routing benchmark shows no scoring regression vs the pre-migration baseline; scenario count intact.
5. The create-* generators + templates emit only kebab-case; the no-new-snake_case guard rejects a fresh in-scope
   snake_case name and accepts a hyphenated one.
6. Every exemption is honored — no `.py`, vendored, generated, lockfile, or tool-mandated name was renamed; no code
   identifier / JSON-YAML key / frontmatter field was altered.
7. Packet 027 is formally superseded; the convention doc is the single canonical source.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Broken imports/requires (highest risk)** — renaming script files breaks `import`/`require`/`source`/registry paths.
  Mitigation: 008 does rename + reference-rewrite in one atomic pass; 011 runs whole-repo import resolution to zero.
- **Validator silent-downgrade** — the classifier keys on the catalog root dir names; renaming before the logic accepts
  hyphens would downgrade every catalog leaf to `readme`. Mitigation: 002 dual-name tolerance lands before 006.
- **Over-broad sweep** — matching `_` inside identifiers / JSON-YAML keys / prose would corrupt code and data.
  Mitigation: path-segment-only, word-boundary-safe rename; identifiers/keys explicitly out of scope; exemption deny-list.
- **Exemption leakage** — the vendored Python and package trees are enormous; a mis-scoped find would try to rename them.
  Mitigation: exemption-aware inventory (005) + guard (004); collision hard-abort.
- **Concurrent sessions** — other lanes are active. Mitigation: execute on an isolated worktree; path-scoped commits.
- **Reverses just-shipped 027** — this program undoes 027's underscore migration. Mitigation: 001 supersedes the 027
  ADR explicitly; 006 is framed as the deliberate reversal; 012 reconciles 027's docs.
- **Dependency:** the Lane C harness (unchanged) for the 011 regression check; the spec-kit validator (rebuilt in the
  worktree); sk-git for the worktree lifecycle.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Transition model for the catalog roots**: dual-name tolerance in the validator (002 accepts both, 006 renames, a
  later cleanup drops the underscore alias) vs a single atomic logic+rename commit. Recommend the tolerance window to
  keep every intermediate commit green. To be decided in the 002 plan.
- **Batch granularity for 008** (scripts+imports): one big atomic rename vs per-skill batches. To be decided in 008's
  plan once the 005 inventory quantifies the import graph.
<!-- /ANCHOR:questions -->
