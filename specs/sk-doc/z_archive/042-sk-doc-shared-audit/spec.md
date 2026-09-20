---
title: "Feature Specification: sk-doc shared/ audit for integration, utilisation and usefulness"
description: "Audits every file under sk-doc/shared/references and sk-doc/shared/assets for real consumers, correct placement and orphan status, then repairs the defects the audit proved."
trigger_phrases:
  - "sk-doc shared audit"
  - "shared references and assets audit"
  - "sk-doc shared orphans"
  - "shared backbone placement"
  - "quick-reference default resource"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-doc shared/ audit for integration, utilisation and usefulness

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` (no branch created; stream ran on the shared dirty tree) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-doc/shared/` accumulated a standards backbone over many packets without anyone re-asking whether each file still has consumers, still sits in the right place, and still tells the truth. Nothing in the hub gates the content of these files against reality, so three classes of rot went unnoticed: a shared reference that fails the hub's own floor validator, template paths that stopped resolving when the hub dropped its root `assets/` directory, and a documented `llms.txt` document class with a stated enforcement level that no validator implements.

### Purpose

Every file under `shared/references` and `shared/assets` carries a verdict backed by a consumer count, and the defects that verdict work proved are repaired in place.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A per-file verdict for all 13 files under `shared/references` and `shared/assets`, plus `shared/README.md`, each with a named consumer set.
- Repair of the defects the audit proved, inside `shared/references`, `shared/assets` and `shared/README.md`.
- Written proposals for changes that land in files this stream does not own.

### Out of Scope

- `shared/scripts/`: propose-only. `sk-doc/scripts/` holds six facade symlinks into it and `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:38` hard-codes `shared/scripts/check-frontmatter-versions.sh`, so a move breaks every concurrently running agent.
- `sk-doc` hub-root files (`ROUTER.md`, `SKILL.md`, `README.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `leaf-aliases.json`, `graph-metadata.json`, `description.json`): another stream owns them this wave.
- `REPO RULES.md`, `AGENTS.md` and `repo-rules/*`: another stream owns them this wave.
- Content rewrites of files that passed the audit. A file with real consumers, correct placement and no proved defect is left alone.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/shared/references/frontmatter-versioning.md` | Modify | Rename `## 1. SCOPE` to `## 1. OVERVIEW AND SCOPE` so the file passes `validate_document.py --type reference`; replace the dead `scripts/frontmatter-version.*` pointer with resolving links. |
| `.opencode/skills/sk-doc/shared/references/quick-reference.md` | Modify | Repair six non-resolving template paths, drop the stale packet enumeration in favour of a pointer to `mode-registry.json`, correct the `llms.txt` enforcement claim, and replace the reference to the non-existent `git-commit` skill. |
| `.opencode/skills/sk-doc/shared/references/core-standards.md` | Modify | Remove the `llmstxt` detection row and enforcement row that no validator backs, state what `--type` actually accepts, repair the command template path, and drop the dead `document_style_guide.md` pointer. |
| `.opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md` | Modify | Replace section 7's stale claim about `core-standards.md` and the classifier with the gates that actually enforce the rule; de-packet section 8 so the file stops violating the evergreen packet-id rule that sits beside it. |
| `.opencode/skills/sk-doc/shared/README.md` | Modify | Replace the scaffold-era text: two false claims about symlink facades, and packet-phase language in an evergreen README. |
| `.opencode/skills/sk-doc/shared/assets/.gitkeep` | Delete | Orphan placeholder in a directory holding five tracked files. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every file under `shared/references` and `shared/assets` has a verdict naming its live consumers, distinguished from mentions in frozen benchmark reports and spec history | Section 8 carries one row per file with a consumer count and a keep/move/delete verdict |
| REQ-002 | Every orphan is named | Section 8 marks each file with zero live consumers; `assets/.gitkeep` is the only one found and it is removed |
| REQ-003 | `frontmatter-versioning.md` passes the hub's own floor validator | `validate_document.py .../frontmatter-versioning.md --type reference` exits 0 |
| REQ-004 | No shared reference or asset cites a path that does not resolve | Each repaired path checked against the filesystem; `check-markdown-links.cjs` reports no broken link under `sk-doc/shared/` |
| REQ-005 | The hub gates that were green before this work are green after it | `parent-skill-check.cjs .opencode/skills/sk-doc` and `leaf-resource-contract.test.cjs` show no new failure attributable to this packet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Any change needed in a file this stream does not own is written down rather than applied | Section 9 carries the proposals, each naming the owning file and the exact change |
| REQ-007 | `hvr-rules.md` stays where it is | The file is unmodified and unmoved; section 8 records the consumer count that makes a move wrong |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 14 audited items (13 files under `shared/references` and `shared/assets`, plus `shared/README.md`) each carry a verdict with named evidence, and 8 of them end at "keep, unchanged".
- **SC-002**: The count of shared references failing `validate_document.py` goes from 1 to 0.
- **SC-003**: The count of non-resolving resource paths cited by shared references and `shared/README.md` goes from 10 to 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `shared/scripts/validate_document.py` and its `template-rules.json` | The audit's own pass/fail evidence comes from this validator | Ran it before and after every edit; captured the baseline first |
| Risk | Renumbering a section breaks an inbound anchor link | Medium | Grepped for anchor-qualified links first: one exists, `filesystem-naming-convention.md#6-...`, and sections 1 to 6 were left untouched |
| Risk | Three other agents write the same tree concurrently | High | Scoped every edit to `shared/references`, `shared/assets` and `shared/README.md`; left the git index untouched; nothing committed |
| Risk | Removing a `.gitkeep` perturbs generated metadata | Low | `leaf-manifest.json` carries no `shared/` entries; re-ran `parent-skill-check` including `10b-byte-drift` after the removal |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Every proposal in section 9 is actionable by its owning stream without a decision from this one.
<!-- /ANCHOR:questions -->

---

## 8. AUDIT VERDICTS

Consumer counts exclude `benchmark/reports/**` (frozen routing-benchmark JSON that merely inventories the hub) and `specs/**` (frozen packet history). "Modes" counts distinct `sk-create-*` packets that reference the file.

### 8.1 shared/references

| File | Routed as | Live consumers | Verdict |
|------|-----------|----------------|---------|
| `core-standards.md` | `ROUTER.md` doc-quality + FULL_INVENTORY; `leaf-aliases.json` to sk-create-quality-control | 6 modes (agent, command, manual-testing-playbook, quality-control, readme, skill) plus 12 `/create:*` command YAML assets | Keep, shared. Repaired: three false or dead statements. |
| `evergreen-packet-id-rule.md` | `ROUTER.md` doc-quality + FULL_INVENTORY; `leaf-aliases.json` | 3 modes (benchmark, manual-testing-playbook, readme) | Keep, unchanged. Correctly shared and already accurate. |
| `filesystem-naming-convention.md` | Not routed | 2 modes (benchmark fixture guide, quality-control `SKILL.md`), plus an anchor-qualified link into section 6 | Keep, shared. Repaired sections 7 and 8. Considered for `repo-rules/`, rejected: see 9.3. |
| `frontmatter-versioning.md` | Not routed | `shared/scripts/check-frontmatter-versions.sh`, `shared/scripts/frontmatter-version.mjs`, and 4 modes (benchmark, feature-catalog, manual-testing-playbook, skill) | Keep, shared. The only shared doc failing the hub's floor validator; fixed. |
| `hvr-rules.md` | `ROUTER.md` doc-quality + FULL_INVENTORY; `leaf-aliases.json` | 3 modes (quality-control, readme, skill), `repo-rules/communication.md`, 10 `system-spec-kit` templates and 6 of its test fixtures, plus a spec-kit golden snapshot. 244 files repo-wide carry the path, 202 of them frozen spec docs | Keep, unchanged, do not move. A move falsifies history and breaks the spec-kit snapshot test. |
| `quick-reference.md` | `hub-router.json` `routerPolicy.defaultResource`, and `SKILL.md` loads it on the defer branch | 4 modes plus the hub README | Keep, repaired. Highest-traffic shared doc and the worst-rotted; see 8.3. |
| `validation.md` | `ROUTER.md` doc-quality + FULL_INVENTORY; `leaf-aliases.json` | 8 modes plus 10 `/create:*` command YAML assets | Keep, unchanged. Every path in it resolves. |

### 8.2 shared/assets

| File | Routed as | Live consumers | Verdict |
|------|-----------|----------------|---------|
| `changelog-template.md` | `ROUTER.md` changelog intents; `leaf-aliases.json` to sk-create-changelog | 4 runtime agent mirrors (`.opencode`, `.claude`, `.codex`, `.pi`), 2 `/create:changelog` YAML assets, sk-create-changelog, sk-create-skill, 2 `system-spec-kit` docs, and `leaf-resource-contract.test.cjs` | Keep, unchanged. Sole-owner alias to sk-create-changelog is a routing convenience, not a placement claim; the real consumer set spans four runtimes and a second skill. |
| `frontmatter-templates.md` | Not routed | `shared/scripts/quick_validate.py`, `commands/doctor/scripts/audit_descriptions.py`, 2 `/create:*` YAML assets, 1 doctor YAML asset, and 6 modes | Keep, unchanged. The most broadly shared asset in the folder. |
| `llmstxt-templates.md` | `ROUTER.md` optimization + FULL_INVENTORY; `leaf-aliases.json` to sk-create-quality-control | 1 real consumer (`sk-create-quality-control/references/optimization.md`) plus a list mention in `sk-create-skill/assets/skill/skill-asset-template.md` | Keep, unchanged. Move into sk-create-quality-control evaluated and rejected: see 9.2. |
| `skill-contract.json` | Not routed; machine data | `shared/scripts/skill_contract.py` and `shared/scripts/skill-contract.cjs`, reached from `quick_validate.py:46` and `sk-create-skill/scripts/package_skill.py:43` | Keep, unchanged. Zero references by path string in any document, which makes it look like an orphan; the two loaders resolve it by `__dirname` and it is live. |
| `template-rules.json` | Not routed; machine data | `shared/scripts/validate_document.py` (4 call sites) and `sk-create-feature-catalog/scripts/validate_catalog_package.py:919` | Keep, unchanged. The rule data behind the hub's floor validator and the most load-bearing file under `shared/assets`. |
| `.gitkeep` | Not routed | None | Orphan. Removed. Vestigial scaffold placeholder in a directory holding five tracked files. |

### 8.3 Defects proved and repaired

| # | Location | Defect | Evidence |
|---|----------|--------|----------|
| D1 | `frontmatter-versioning.md` section 1 | Failed `validate_document.py --type reference` with `missing_required_section: overview`, because its first heading was `SCOPE`. The one shared doc failing the hub's own floor validator | Baseline run exited 1; renaming the heading in a scratch copy made it exit 0 before the real file was touched |
| D2 | `quick-reference.md` sections 5, 10, 12 | Six template and reference paths written as bare `assets/...` or `references/...`. The hub has no root `assets/` or `references/` directory, so none resolve. One of them, `assets/testing_playbook/...`, is also snake_case, contradicting the kebab canon two files away | `ls` of the hub root shows no `assets/` or `references/`; `find` for `testing_playbook` returns nothing; `SKILL.md` states the absence explicitly |
| D3 | `core-standards.md` section 3 and `quick-reference.md` section 5 | Both documented an `llms.txt` document class with an enforcement level, and disagreed with each other (`Strict, blocks` versus `Moderate`). No `llmstxt` type exists in `validate_document.py --type`, `template-rules.json` or `quick_validate.py`, and no `llms.txt` file exists in the repository | `--type` choices at `validate_document.py:1533` list 13 types, none of them `llmstxt`; `documentTypes` in `template-rules.json` lists the same 13; `find . -name llms.txt` returns nothing |
| D4 | `core-standards.md` section 7 | Command block cited `assets/command/command-template.md`; the file is at `sk-create-command/assets/command-template.md` | `find` returns exactly one `command-template.md`, under the packet |
| D5 | `core-standards.md` section 8 | Pointed at `document_style_guide.md`, a file that exists nowhere in the repository. The only occurrence of that string was the pointer itself | Repo grep returned one hit: the pointer |
| D6 | `filesystem-naming-convention.md` section 7 | Claimed `core-standards.md` section 2 "currently documents the legacy snake_case filename rule, which the `validate_document.py` classifier still applies". Both halves are false: section 2 states the kebab rule and already points here, and the validator applies no filename rule at all | Read of `core-standards.md` section 2; a scratch file named `my_under_score.md` validates clean at exit 0 |
| D7 | `filesystem-naming-convention.md` section 8 | An evergreen reference carrying four packet identifiers, which is exactly what `evergreen-packet-id-rule.md` in the same directory forbids for `references/**/*.md` | The rule file's own document-class table |
| D8 | `quick-reference.md` section 7 | Hand-maintained tree enumerating 11 packets; the hub registers 13 modes and the enumeration omitted `sk-create-repo-rule`. The section's own closing paragraph already told the reader to consult `mode-registry.json` instead | `mode-registry.json` lists 13 `workflowMode` values; `parent-skill-check` invariant 6b holds the `SKILL.md` mode table to the same set |
| D9 | `quick-reference.md` section 13 | Listed `git-commit` as a related skill. No such skill exists; the git skill is `sk-git` | `ls .opencode/skills/` |
| D10 | `shared/README.md` | Claimed "the sk-doc/{scripts,references,assets} root dirs keep facade symlinks pointing here" and "Child packets symlink these inward". Only `scripts` has facades, and no sk-doc packet symlinks anything from `shared/`. Also carried scaffold-phase language in an evergreen README | A repo-wide symlink walk returns six facades, all under `sk-doc/scripts/`, all pointing into `shared/scripts/`; the sk-code hub is the tree that actually uses the inward-symlink pattern |

---

## 9. PROPOSALS FOR OTHER OWNERS

### 9.1 `hub-router.json` defaultResource, for the hub-root owner

`routerPolicy.defaultResource` is `shared/references/quick-reference.md`, and `SKILL.md` loads it on exactly one branch: the defer branch, when intent is unclear or contradictory. The file a confused caller receives is a validation-command cheat sheet. It does not list the modes they need to choose between; the closest thing it had was the stale tree removed under D8, which now points at `mode-registry.json` instead.

No change is proposed to `hub-router.json` itself. The observation is recorded because the fallback resource and the fallback question are still mismatched, and the owner of the hub-root files is the only stream that can decide whether to point `defaultResource` at a purpose-built disambiguation resource.

### 9.2 `llmstxt-templates.md` placement, considered and rejected

The file has one real consumer, `sk-create-quality-control/references/optimization.md`, and `leaf-aliases.json` already binds it to that mode. Moving it to `sk-create-quality-control/assets/` would need an edit to `ROUTER.md` `RESOURCE_MAP` (line 137 and line 262), an edit to `leaf-aliases.json`, a `leaf-manifest.json` regeneration, and an edit to `sk-create-skill/assets/skill/skill-asset-template.md`, all in files this stream does not own.

The move is not recommended. Routing already resolves the file to the right mode, and a resource's disk location has no effect on load cost once the alias exists. The change would be churn across four surfaces to satisfy a tidiness rule that the alias mechanism exists precisely to relax.

### 9.3 `filesystem-naming-convention.md` as a repo rule, considered and rejected

The kebab-case canon reads like repository-wide governance and could plausibly live under `repo-rules/`. It should not move, for two reasons. Its three enforcing gates all live in `shared/scripts/`, so the rule and its enforcement would end up in different trees. And `REPO RULES.md` routes on the action about to be taken; naming has no trigger row today, so a rule file added there would be loaded by nothing.

If the owner of `repo-rules/` disagrees, the smaller change is a trigger row pointing at the existing file rather than a copy of it. A second copy of a naming canon is worse than no repo rule at all.

### 9.4 `shared/scripts/.gitkeep`, propose-only

`shared/scripts/.gitkeep` is the same vestigial placeholder as the one removed from `shared/assets/`, in a directory holding 27 other tracked files. It has no consumers. It is left in place because `shared/scripts/` is propose-only for this stream. Removing it is safe whenever a stream that owns that directory next touches it.

---
