---
title: "Feature Specification: repo-wide kebab-case (hyphen) filesystem-naming convention"
description: "Ban snake_case in filesystem names repo-wide and make kebab-case (hyphens) the sole canonical form for folder names, file names, and script filenames — with a hard exemption for Python (.py, PEP-8 snake_case) plus vendored/third-party trees, generated/lockfile output, tool-mandated filenames, and Python import-package directories. Code identifiers, JSON/YAML/TOML keys, frontmatter fields, and DB columns are OUT of scope (idiomatic case, hyphens illegal there). Reverses and supersedes the 027 underscore migration, including the sk-doc validator/loader logic keyed on feature_catalog / manual_testing_playbook. Phase parent for a 12-phase program (000-011): worktree + immutable-baseline + census first, then policy + all-consumer logic + create-generators + no-new-snake guard + rename-and-reference tooling + a frozen bijective rename map + shared cross-cutting closures, then a per-component migration fan-out, then alias-removal, the whole-repo gate, and integrate-latest + closeout. Migration runs on a dedicated worktree pinned to an immutable BASE SHA."
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
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Restructured into the 000-011 phased tree"
    next_safe_action: "Execute phase 000 (worktree + baseline + census) on the pinned BASE SHA"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope = filesystem names only (folders/files/script filenames); code identifiers + JSON/YAML/TOML keys + frontmatter fields keep idiomatic case"
      - "Exemptions = .py files, Python import-package dirs, vendored/third-party, lockfiles/generated output, tool-mandated filenames, frozen surfaces"
      - "Fully reverses 027, including the sk-doc validator/loader logic keyed on feature_catalog / manual_testing_playbook"
      - "Placement = top-level phase parent under sk-doc; packet number 017 (concurrent 017-smart-routing folds into 016); migration on a worktree"
      - "Catalog-root transition = bounded dual-name tolerance + an explicit alias-removal phase"
      - "Rename batching = dependency-closure (reference-graph SCCs), not per-extension"
      - "node tooling in the worktree = fresh deterministic install, never a symlink to the main tree"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + phase list + outcome; mechanics live in each child's plan.md, decisions in 001's decision-record.md. -->

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
| **Review** | GPT-5.6-sol (max) design review returned REQUESTED_CHANGES; this phased decomposition folds in every P0/P1. See `001-convention-policy-and-scope/decision-record.md`. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo's filesystem naming is inconsistent and, after packet 027, actively snake_case for catalog/playbook content
(`feature_catalog/mcp_tool_surface/read_path_freshness.md`). The operator's canonical form is **kebab-case (hyphens)**
for every filesystem name — folders, files, and script filenames — with Python as the sole language exemption
(`.py` files keep PEP-8 snake_case). This program bans snake_case in filesystem names repo-wide and makes hyphens the
single canonical form.

The load-bearing complication: the sk-doc classifier classifies catalog/playbook leaves by the `feature_catalog` /
`manual_testing_playbook` parent-directory NAME (`validate_document.py:123-138`), and a **network of other consumers**
key on the same root/index names — the Lane C benchmark loader and generator, `parent-skill-check.cjs`, the
`post-edit-router.cjs`, `package_skill.py`, plus an **inverse guard** (`check_no_hyphenated_catalog_content.py`) that
currently *rejects* the desired state. Renaming those two roots therefore requires a coordinated, all-consumer logic
change — this is not a pure rename. A second complication: the execution environment must be reproducible — the repo's
scale and a `mcp_server` workspace declared in `package-lock.json` mean the migration must run against an **immutable
BASE SHA** in a worktree with a fresh, deterministic dependency install, not the actively-raced shared checkout.

### Purpose
Make kebab-case the sole canonical filesystem-naming form repo-wide; update the sk-doc logic, all root-name consumers,
the create-* generators, and templates to emit and validate it; add a guard so snake_case cannot re-enter in-scope
names; build a semantic rename engine + a rename-map-driven whole-repo reference checker; and retroactively rename every
in-scope snake_case folder/file/script — fixing all path references and imports in lockstep, in dependency-closed
batches — without regressing validation, builds, tests, imports, or the Lane C benchmark.

### Non-Goals
- Renaming **code identifiers**, **JSON/YAML/TOML keys**, **frontmatter fields**, or **DB columns** — hyphens are
  illegal in most identifiers and snake_case keys are a data/API contract, not a filename. Idiomatic case is kept.
- Touching **Python `.py`** filenames or **Python import-package directory names** (snake_case is idiomatic / required
  for importability).
- Renaming **vendored/third-party** trees, **generated/lockfile** output, or **tool-mandated** filenames.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Convention & policy**: hyphens are the sole canonical form for in-scope filesystem names; supersede the 027
  underscore ADR; publish the authoritative convention doc + the exemption/deny-list boundary + the frontmatter-value
  vs frontmatter-key line + the frozen-history exception.
- **All root-name consumer logic**: the `validate_document.py` classifier (a **symlink** at `sk-doc/scripts/` plus the
  real file under `shared/scripts/`), the Lane C loader + generator, `parent-skill-check.cjs`, `post-edit-router.cjs`,
  `package_skill.py`, the **inverse** `check_no_hyphenated_catalog_content.py` guard, and every rule/test keyed on
  `feature_catalog` / `manual_testing_playbook`.
- **create-* generators + templates**: emit hyphenated folder/file names; reverse the 027 generator changes.
- **Guard + tooling**: an exemption-aware no-new-snake_case guard (`--changed-since $BASE` and `--all` modes); a
  deterministic, dry-run-default rename engine (semantic source→target map, collision hard-abort on exact/casefold/NFC,
  symlink mode-120000 + exec-bit preservation); a rename-map-driven whole-repo reference checker (module resolution,
  path-value config, shell sourcing, registries, and a disposition ledger for dynamic `require`/glob sites).
- **Retroactive migration** of every in-scope snake_case folder / file / script filename across all skills, specs,
  references, assets, benchmarks, scripts, runtime/package-layout dirs, and config/data filenames — with all path
  references and imports fixed, in dependency-closed batches.

### Out of Scope (deliberate — exemptions)
- **Python `.py`** filenames; **Python import-package directory names** (`_`→`-` would break `import`).
- **Vendored / third-party**: `node_modules/`, Python `site-packages` / `.venv`, embedded package trees.
- **Generated / lockfiles**: `package-lock.json`, `dist/`, compiled bundles, other regenerated artifacts.
- **Tool-mandated filenames**: `package.json`, `tsconfig.json`, `.utcp_config.json`, `action.yml`/`action.yaml`,
  plugin manifests, `SKILL.md`, GitHub/workflow files, and similar exact-name contracts. Test-runner magic
  (`__snapshots__`, `__mocks__`, `conftest.py`, `test_*.py`/`*_test.py`) is preserved unless moved with its full
  discovery/config closure.
- **Code identifiers, JSON/YAML/TOML keys, frontmatter FIELDS, DB columns** (idiomatic case retained). Frontmatter
  *values* that are filesystem paths or path-derived slugs DO change when required.
- **Already-compliant**: skill/agent/command directory names and spec phase-folder names (`^[0-9]{3}-[a-z0-9-]+$`).
- **Frozen surfaces**: `z_archive/`, changelogs, completed spec history — never rewritten (append-only supersession
  only); the whole-repo "zero snake_case" gate is scope-aware and excludes these.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phases -->
## PHASE MAP & OUTCOMES

Ordered so the repo stays internally consistent at every commit and the execution is reproducible: an isolated worktree
+ immutable baseline + raw census come FIRST; then policy + all-consumer logic + create-generators + the no-new-snake
guard + rename/reference tooling + the frozen bijective map + shared cross-cutting closures (the toolchain speaks
hyphens before any rename); then the per-component migration fan-out; then alias-removal, the whole-repo gate, and
integrate-latest + closeout. Every phase carries a blocking SOL verifier contract in its `checklist.md`.

| Phase | Child | Kind | Outcome |
|-------|-------|------|---------|
| **000** | `000-worktree-baseline-and-census` | leaf | Establish the isolated worktree off an immutable BASE SHA; a fresh deterministic dependency install (never a symlink to the raced main tree); capture the full baseline — naming census, symlink + mode manifest, test-discovery counts, strict-validate output, Lane C scenario IDs/scores, casefold/NFC collision report — against which every later phase is proven. |
| **001** | `001-convention-policy-and-scope` | leaf (+decision-record) | The authoritative kebab-case convention doc + the program decision record (dual-name tolerance, dependency-closure batching, fresh-install, numbering, GPT review). The full exemption/deny-list boundary, the identifier/key + frontmatter-value line, the frozen-history exception, Python import-package handling, and formal supersession of the 027 underscore ADR. |
| **002** | `002-root-name-consumer-migration` | leaf | Update **every** runtime consumer of the catalog/playbook root + index names to accept the hyphenated roots: the classifier (symlink-aware, both surfaces), the Lane C loader + generator, `parent-skill-check.cjs`, `post-edit-router.cjs`, `package_skill.py`, the inverse guard + its tests. Ship a bounded dual-name tolerance (accept both, emit only hyphens, fail closed if both physical roots coexist); test POSIX + Windows paths. |
| **003** | `003-create-generators-and-templates` | parent (×4) | Update every create-* generator + templates to emit hyphenated folder/file names; reverse the 027 generator changes. Children split the surface: create-skill-and-packaging, catalog/playbook generators, the readme/agent/command/changelog/flowchart/diff/benchmark emitters, and command-asset emitters. |
| **004** | `004-no-new-snake-guard` | leaf | The exemption-aware no-new-snake_case guard with a debt-tolerant `--changed-since $BASE` mode and an `--all` mode enabled after migration; positive + negative fixtures. |
| **005** | `005-rename-and-reference-tooling` | parent (×3) | The deterministic, dry-run-default rename engine (semantic source→target map; collision hard-abort on exact/casefold/NFC; symlink mode-120000 + exec-bit preservation), the rename-map-driven whole-repo reference checker (module resolution, path-value config, shell sourcing, registries; a disposition ledger for every dynamic `require`/`source`/glob site), and a fixture corpus + dry-run harness. |
| **006** | `006-inventory-and-frozen-map` | leaf | The full repo inventory (every exemption applied) frozen into a **bijective, fully-classified** rename map — every candidate is exactly one of rename / exempt / frozen / generated / tool-mandated, no "unknown" bucket — partitioned into dependency-closed batches (reference-graph SCCs); the closure↔component map, hoist list, and parallel go-list. Hash the map together with BASE. |
| **007** | `007-shared-and-cross-cutting-closures` | parent (×4) | The dependency backbone: closures that span ≥2 component subtrees, hoisted so component phases depend on them — root/opencode infra strays, the cross-skill symlink closure, hoisted shared-script closures, and active (non-frozen) specs/docs. |
| **008** | `008-component-migration` | parent (×14) | The per-component migration fan-out: one child subtree per skill / command-area / agent-set (`001-sk-code` … `014-agents`), each ending in a rollup `…-gate`. Component phases declare `depends_on` 007; the catalog/playbook reversal lands coupled with the 002 logic (zero silent `readme` downgrade). |
| **009** | `009-remove-transition-aliases` | leaf | Drop the underscore aliases from the 002 logic; prove the old live root names are now rejected and only scoped frozen/exempt references remain. |
| **010** | `010-whole-repo-gate` | leaf | The whole-repo gate: the `--all` naming guard, every affected build/typecheck/test suite with discovery-count parity, whole-repo import + path + markdown-link resolution (0 broken), recursive `validate.sh --strict`, and a fixed-seed Lane C re-baseline (semantic + score, not count only) vs the 000 snapshot. Verification mutates no tracked file. |
| **011** | `011-integrate-and-closeout` | leaf | Integrate the latest origin in a clean integration worktree and rerun the ENTIRE 010 gate on the exact final commit; mark 027 superseded (append-only), update changelogs, finalize the convention as canonical, parent rollup, reconcile completion metadata, and merge. |

**Sequencing invariants:** 000 pins BASE + baseline before anything. 001-007 make the toolchain speak hyphens — policy, all-consumer logic, generators, the guard, the rename/reference engine, the frozen map, and the shared cross-cutting closures — before any component rename. 002 ships a bounded dual-name tolerance so it precedes the catalog/playbook reversal inside 008; 009 removes the alias only after 008 lands. 006's map is frozen + hashed with BASE; batches are dependency-closed (a batch may mix JS/shell/JSON/YAML/MD). 007 hoists every closure spanning ≥2 component subtrees, and 008's component phases declare `depends_on` it. 010 is the whole-repo gate; 011 integrates the latest origin and reruns 010 before closeout. Because a runtime path (the classifier) keys on the catalog root names, the catalog/playbook reversal in 008 must land coupled with the 002 logic + tolerance.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Zero in-scope snake_case filesystem names remain (folders, files, script filenames) outside the exemption set and
   frozen surfaces; all are kebab-case. The scope-aware `--all` guard proves it and rejects a fresh violation.
2. `validate.sh --strict` is Errors 0 recursively across every touched skill; catalog/playbook leaves still classify
   correctly under the updated (hyphen-keyed) logic — zero silent `readme` downgrade.
3. All build / test / typecheck gates pass; whole-repo import, path-value, and markdown-link resolution shows **0
   broken references**; test-file and test-case discovery counts equal the 000 baseline.
4. The Lane C smart-routing benchmark shows no scoring regression vs the pinned pre-migration baseline; scenario IDs +
   semantics intact (compared by ID, not count alone).
5. The create-* generators + templates emit only kebab-case; the no-new-snake_case guard rejects a fresh in-scope
   snake_case name and accepts a hyphenated one.
6. Every exemption is honored — no `.py`, Python package dir, vendored, generated, lockfile, or tool-mandated name was
   renamed; no code identifier / JSON-YAML-TOML key / frontmatter field was altered; frozen history is unchanged except
   an approved append-only 027-supersession note.
7. Packet 027 is formally superseded; the convention doc is the single canonical source; the program is merged via a
   clean integration after the full 014 gate reran on the exact final commit.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Broken imports/requires (highest risk)** — renaming script files breaks `import`/`require`/`source`/registry paths,
  including dynamic `require(path.join(...))` sites a static sweep misses. Mitigation: 005 reference checker with a
  dynamic-site disposition ledger; 011 does rename + reference-rewrite in one dependency-closed pass; 014 resolves
  whole-repo imports to zero.
- **Validator silent-downgrade** — the classifier + a network of consumers key on the catalog root names; renaming
  before all of them accept hyphens downgrades every catalog leaf to `readme`. Mitigation: 002 migrates ALL consumers
  with a dual-name tolerance before 007; the 007 checklist enumerates every leaf's type.
- **Non-reproducible builds** — a `mcp_server` workspace in `package-lock.json` + locally-untracked manifests mean a
  clean worktree may not `npm ci`. Mitigation: 000 fixes/tracks manifests + fresh install; 009 updates canonical
  manifests/lockfiles when package paths move; never symlink deps or `dist` from the raced main tree.
- **Over-broad / mechanical sweep** — matching `_` inside identifiers/keys/prose, or a blind `_`→`-`, corrupts code and
  produces bad names (`_common.sh`→`-common.sh`, `__fixtures__`→`--fixtures--`, leading-hyphen CLI hazards).
  Mitigation: semantic source→target map (005), path-segment + word-boundary safety, exemption deny-list, bijective
  classified map (006).
- **Exemption leakage** — the vendored Python + package trees are enormous; a mis-scoped find would rename them.
  Mitigation: exemption-aware census (000/006) + guard (004); collision hard-abort (005).
- **Concurrent sessions** — other lanes commit to the same branch and share the main index. Mitigation: pin BASE,
  execute on an isolated worktree, one writer at a time (or satellite worktrees merged serially), path-scoped commits,
  final integration in a clean worktree.
- **Reverses just-shipped 027** — this program undoes 027's underscore migration. Mitigation: 001 supersedes the 027
  ADR explicitly; 007 is framed as the deliberate reversal; 015 reconciles 027's docs append-only.
- **Dependency:** the Lane C harness (unchanged) for the 014 regression check; the spec-kit validator (rebuilt in the
  worktree); sk-git for the worktree lifecycle (`references/worktree_workflows.md`).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Parallelism model** for the rename batches: strictly one LUNA writer per worktree with serial SOL verification, vs
  satellite worktrees per dependency-closed batch merged serially into the coordinator branch. To be decided in 006
  once the batch graph is known; default is serial-single-writer.
- **Rebase cadence**: frequent fetch/overlap audits with one controlled final integration (default) vs a single final
  rebase of the whole rename set. To be decided in 015 against the observed origin drift.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 000 | 000-worktree-baseline-and-census/ | Isolated worktree, immutable BASE, full baseline census | Planned |
| 001 | 001-convention-policy-and-scope/ | Convention doc + decision record + exemption boundary | Planned |
| 002 | 002-root-name-consumer-migration/ | All catalog/playbook root-name consumers accept hyphens | Planned |
| 003 | 003-create-generators-and-templates/ | create-* generators + templates emit hyphens (parent ×4) | Planned |
| 004 | 004-no-new-snake-guard/ | Exemption-aware no-new-snake_case guard | Planned |
| 005 | 005-rename-and-reference-tooling/ | Rename engine + reference checker + harness (parent ×3) | Planned |
| 006 | 006-inventory-and-frozen-map/ | Bijective frozen rename map + batch graph | Planned |
| 007 | 007-shared-and-cross-cutting-closures/ | Hoisted cross-subtree closures (parent ×4) | Planned |
| 008 | 008-component-migration/ | Per-component migration fan-out (parent ×14) | Planned |
| 009 | 009-remove-transition-aliases/ | Drop underscore aliases; prove old roots rejected | Planned |
| 010 | 010-whole-repo-gate/ | Whole-repo naming/build/test/link/benchmark gate | Planned |
| 011 | 011-integrate-and-closeout/ | Integrate latest origin, rerun 010, supersede 027, close out | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 000 | 001 | BASE pinned; baseline census + collision report captured | Baseline artifacts exist, keyed by BASE |
| 001-007 | 008 | Toolchain speaks hyphens; guard, rename/reference tooling, frozen map, and shared closures landed | 003/004/005 fixtures pass; 006 map hashed with BASE; 007 closures resolved |
| 008 | 009 | Every component subtree gate green; catalog/playbook reversal coupled with 002 logic | Per-skill `…-gate` checklists pass; zero silent `readme` downgrade |
| 009 | 010 | Underscore aliases removed; old live roots rejected | 002 logic rejects legacy roots; only frozen/exempt refs remain |
| 010 | 011 | Whole-repo gate green on the pre-integration commit | `--all` guard + build/test/link/benchmark parity vs 000 |
<!-- /ANCHOR:phase-map -->
