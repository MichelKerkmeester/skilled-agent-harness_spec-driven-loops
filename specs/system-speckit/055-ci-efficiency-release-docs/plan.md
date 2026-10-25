---
title: "Implementation Plan: CI efficiency release docs"
description: "Writes the eleven changelog entries and the audit doc fixes one hub at a time, checks each hub with its validators and gates, and commits each hub alone."
trigger_phrases:
  - "ci efficiency release docs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: CI efficiency release docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON routing files and the Hermes mirror, checked by Node and Bash gate scripts |
| **Framework** | sk-doc: `sk-create-changelog` for entries, `sk-create-frontmatter` for document editions |
| **Storage** | Git, no database |
| **Testing** | `validate_document.py` per file, a version carrier sweep, a changelog link scan, and the mirror, route and router-sync gates |

### Overview
The work writes release records and corrects doc text, with no runtime change. Each hub gets its changelog entries and doc fixes together, then its own checks, then its own commit. Every audit item is applied only after its quoted phrase is found again in the current file.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem and scope are in spec.md: `rg -n '^### (In|Out of) Scope' specs/system-speckit/055-ci-efficiency-release-docs/spec.md` prints two lines.
- [x] Success criteria are measurable: `rg -c '^- \*\*SC-' specs/system-speckit/055-ci-efficiency-release-docs/spec.md` prints 4.
- [x] Dependencies are identified: plan.md section 6 lists them, and the one Red item is open question 1 in spec.md.

### Definition of Done
- [x] Every row in acceptance-criteria.md is Met, Waived or Superseded: `rg -c '^\| AC-[0-9]{3} ' specs/system-speckit/055-ci-efficiency-release-docs/acceptance-criteria.md` prints 12, and the status cells hold no Unmet. Evidence 2026-10-26: 12 rows, all Met.
- [x] The gates pass: the mirror sync, route validation and router-sync commands in tasks.md Phase 3 print their PASS or OK lines. Evidence 2026-10-25: T042 printed PASS, OK and 5/5 with exit 0.
- [x] The docs agree: spec.md, plan.md, tasks.md and acceptance-criteria.md name the same eleven entries and the same open items. Evidence 2026-10-25: all four state 2.3.13.0 for the sk-doc hub.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One release record per hub: each touched skill gets an entry, and each hub is written, checked and committed as a unit.

### Key Components
- **Changelog entries**: eleven new `vX.md` files, one in each touched skill or mode `changelog/` folder, following that skill's own format.
- **Version carriers**: the files that state a bumped version, listed below.
- **Doc fixes**: the audit's 49 items, grouped by file in tasks.md.
- **Gates**: `validate_document.py`, the carrier sweep, the changelog link scan, the mirror sync, route validation, the router-sync guard and the hub parent check.

### Version Carriers

Carrier files were found at baseline (bb9b9d1c09) with `git grep -F` over each skill folder, excluding `changelog/` folders, and over each skill's `.hermes/skills/<skill>/` mirror. A document's own `version:` field is an edition, not a carrier, and each edited document re-derives its edition under sk-create-frontmatter. The Hermes mirrors are generated: `sync-skills-hermes.cjs` writes every skill's `SKILL.md` under `.hermes/skills/`, so each bumped skill's mirror is a carrier. The generated fixtures that hold version strings (the trigger index and the retrieval fixtures) are not carriers, as spec.md excludes them.

| Skill | Decided version | Carrier files |
|-------|-----------------|---------------|
| `sk-code` hub | 3.0.0.0 | `SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json`, the newest-entry link in `README.md`, `.hermes/skills/sk-code/SKILL.md`, and the activation manifest `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` (re-minted, see below) |
| `sk-code-skilled` | 2.0.1.0 | `SKILL.md`, `.hermes/skills/sk-code-skilled/SKILL.md` |
| `sk-code-review` | 1.8.0.0 | `SKILL.md`, `.hermes/skills/sk-code-review/SKILL.md` |
| `sk-code-ci` | 1.1.0.0 | `SKILL.md`, `.hermes/skills/sk-code-ci/SKILL.md` |
| `sk-code-quality` | 1.4.1.0 | `SKILL.md`, `.hermes/skills/sk-code-quality/SKILL.md` |
| `system-skill-advisor` | 0.17.0.0 | `SKILL.md`, `.hermes/skills/system-skill-advisor/SKILL.md` |
| `system-spec-kit` | 2.9.2.0 | `SKILL.md`, `.hermes/skills/system-spec-kit/SKILL.md` |
| `sk-create-skill` | 1.5.6.0 | `SKILL.md`, `.hermes/skills/sk-create-skill/SKILL.md` |
| `sk-create-command` | 1.0.5.0 | `SKILL.md`, `.hermes/skills/sk-create-command/SKILL.md` |
| `sk-doc` hub | 2.3.13.0, open question 1 answered (deviation a in tasks.md) | `SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json`, `.hermes/skills/sk-doc/SKILL.md`, and the activation manifest `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` |
| `sk-git` | 1.9.5.0 | `SKILL.md`, `.hermes/skills/sk-git/SKILL.md` |

An activation manifest holds an `effectivePolicyHash` and no version string, so the old-number sweep cannot find it. It changes with its hub's `hub-router.json`: commit `c301fa4bc7` changed `activation/sk-doc/manifest.json` in the commit that moved the sk-doc hub version. Re-mint each one with `node .skilled/bin/compiled-route-manifest.cjs refresh --hub <hub> --skill-root .skilled/skills/<hub>`, the command that `specs/sk-code/013-private-surface-skills/002-hub-surface-removal/plan.md` names, or let the commit hook re-mint it. Never edit it by hand. Which files the refresh writes is UNKNOWN until `git status` shows them after the run.

### Data Flow
The read-only audit lists each item with its file and line. For each item, the writer reads the current line, applies the fix or records a rejection, and moves on. A hub's entries and carriers move together, then its gates run, then its commit goes in. The shared gates run once more after the last hub commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: the work changes release records and doc text. No producer, consumer or runtime code changes, so no fix surface applies.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

tasks.md holds the ordered tasks and their verify commands. The four steps below give the order at a glance.

### Step 1: Confirm the baseline and the target numbers
Read each carrier and the newest entry, confirm every target path is absent on origin/main, and record the gate baselines.
Acceptance: each target path fails `git cat-file -e origin/main:<path>` (the working tree already holds these entries as untracked files, so the check runs against origin/main), and the mirror sync prints its PASS line before any further edit.
Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS`, and `git cat-file -e origin/main:<target path>; echo $?` prints `128` for each target.

### Step 2: Write each hub's entries and fixes
Work through the hubs in the order of tasks.md Phase 2: sk-code family, system-skill-advisor, system-spec-kit, sk-doc family, sk-git, then the root and command docs. The sk-doc hub entry is 2.3.13.0, per open question 1, which is answered. The working tree already holds most of these edits, uncommitted, from another writer. Run each task's verify first, keep an edit whose verify passes, and edit only what still fails.
Acceptance: each hub's entries exist at their decided versions, each carrier in the Version Carriers table states the new version, and each audit item of that hub is applied or recorded as rejected.
Verify: `rg -n -F '<old version>' <carrier files>` prints no line for each bumped skill, using the carrier list above, and `git status --porcelain -- .skilled/bin/lib/compiled-routing/013-live-activation/activation/` lists each bumped hub's re-minted manifest.

### Step 3: Run the gates and validators
Acceptance: `validate_document.py` exits 0 on every edited markdown file, the three gates pass, the link scan prints only the two baseline folders, and the released-entry and privacy checks print nothing.
Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py --type <type> <file>; echo $?` prints `0` for each edited file, with the type that tasks.md T041 names (`spec` for packet files, since without `--type` they exit 1 under README rules), and the link scan in tasks.md prints the two baseline folders.

### Step 4: Commit one hub at a time, then push
Acceptance: each commit's `git show --stat` lists only its hub's paths, and the push waits for the operator's yes.
Verify: `git show --stat HEAD` lists only the committed hub's paths, and `git status --porcelain` shows no path of that hub afterwards.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each edited markdown file: structure, frontmatter and placeholder check | `validate_document.py` from `.skilled/skills/sk-doc/shared/scripts/` |
| Integration | Version carriers, changelog links, released-entry guard, router and mirror gates, hub parent check | Carrier sweep and link scan in tasks.md, `verify-router-sync.cjs`, `route-validate.sh`, `sync-runtime-mirrors.cjs --check`, `parent-skill-check.cjs` |
| Manual | Each new entry read against the commit that carries the change, and each audit anchor read against its current line | `git show --stat <sha>` and `rg -n -F '<phrase>' <file>` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| origin/main, the base for every target number | Internal (git) | Green | A target number that origin/main already holds becomes a logic-sync question |
| `validate_document.py` in `.skilled/skills/sk-doc/shared/scripts/` | Internal | Green | Edited files cannot pass verification |
| Mirror sync, route validation, router-sync guard and hub parent check | Internal | Green | The hub that fails a gate stays uncommitted |
| Operator decision on the sk-doc hub number (open question 1) | External | Green, answered with 2.3.13.0 | The sk-doc family waits, and the other hubs go ahead |
| Operator yes for the push | External | Yellow | Commits stay local |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate fails after a hub commit, or an entry or doc fix states something the code does not do.
- **Procedure**: before a commit, restore a tracked file with `git restore -- <path>`. Remove a new entry only after confirming that this packet created it. After a commit, revert that hub's commit with `git revert <sha>`. Never rewrite history. A revert of a pushed commit needs the operator's yes first.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Step 1 (Baseline) ──► Step 2 (Write per hub) ──► Step 3 (Gates) ──► Step 4 (Commit and push)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Step 1 (Baseline) | None | Step 2 |
| Step 2 (Write per hub) | Step 1 | Step 3 |
| Step 3 (Gates) | Step 2 | Step 4 |
| Step 4 (Commit and push) | Step 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1 (Baseline) | Low | 30 minutes |
| Step 2 (Write per hub) | High | 4 to 6 hours |
| Step 3 (Gates) | Med | 1 to 2 hours |
| Step 4 (Commit and push) | Low | 30 minutes |
| **Total** | | **6 to 9 hours (assumption: no hub needs a second audit pass)** |
<!-- /ANCHOR:effort -->
