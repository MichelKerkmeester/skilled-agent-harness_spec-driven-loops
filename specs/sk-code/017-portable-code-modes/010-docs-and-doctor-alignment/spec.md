---
title: "Feature Specification: Align docs, playbooks, catalogs and doctor text with the shipped portable quality and review behavior"
description: "After the portable quality and review children landed, the READMEs, playbooks, feature catalog, doctor text and hook docs still described the old behavior: no way to change a rule, a single review baseline, an agent with its own checklist. This child brings every one of them to the shipped behavior and adds the foreign-repository scenarios."
trigger_phrases:
  - "docs and doctor alignment"
  - "align docs playbooks catalogs and doctor text"
  - "foreign repository playbook scenarios"
  - "rule overrides docs alignment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Align docs, playbooks, catalogs and doctor text with the shipped portable quality and review behavior

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (round A) |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/251-docs-and-doctor-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The portable quality and review children made the rules a repository's own: a hard floor that never changes, a `## Rule overrides` section and `commentHygiene.disableRules` for the rest, a review that resolves its rules through `--explain` and states them on a `Rule sources:` line, and an agent whose verdict follows severity. The docs around them still describe the earlier modes. A reader of the review README finds a single baseline plus a surface, the doctor text has no word for the disabled hygiene rules, the hook READMEs say nothing about the config key, and neither playbook proves a repository that wants a different style. The review scripts README also carried a broken relative path that made the setup battery's drift guard fail before any edit.

### Purpose
Every doc, README, catalog, playbook and doctor text that describes the shipped quality or review behavior says what ships, and the playbooks run the three foreign-repository cases: almost no inline comments, a comment on every function, and a refused floor override.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured at `HEAD` `780cbd7cd8` of the worktree, which sits two commits behind `origin/main`:

```text
$ node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs        (baseline, before any edit)
PASS 8 of 9 legs; FAIL drift-guards
  sk-code-review/scripts/README.md:43: path does not resolve
$ for each (file, phrase): git show HEAD:<file> | grep -c "<phrase>"
sk-code-review/README.md              "Rule sources"                     0
sk-code-review/README.md              "Floor, Default Lens"              0
sk-code-review/references/review-ux-single-pass.md  "Rule sources"       0
sk-code-quality/README.md             "disableRules"                     0
sk-code-quality/scripts/README.md     "explain <path>"                   0
sk-code-quality/scripts/lib/README.md "hygieneCheckerFlags"              0
sk-code-skilled/README.md             "House Style Lives Here"           0
sk-code/README.md                     "Rules A Repository Can Change"    0
sk-code/shared/README.md              "will call"                        1
sk-code/README.md                     "v3.9.1.0"                         1   (a changelog file that is not the newest)
feature-catalog/feature-catalog.md    "rule-overrides-and-hygiene-policy" 0
.skilled/scripts/git-hooks/README.md  "commentHygiene"                   0
.skilled/hooks/git/README.md          "commentHygiene"                   0
$ validate-playbook-package.cjs --package sk-code-review/manual-testing-playbook
PASS scenarios=34 categories=10      (no foreign-repository category)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct each stale claim in the READMEs, references, feature catalog, doctor command text, hook and CI READMEs and the root README, at the doc that owns it.
- Add three review playbook scenarios and two quality playbook scenarios for the foreign-repository cases, each built from commands that were run, with the review ones backed by a live `@review` run.
- Add three feature catalog leaves for the rule overrides, the review floor and lens, and the review agent's verdict.
- Write one changelog entry for each of the four skills and modes touched, step their carriers, and run the generators for the compiled-route manifest and the Hermes copies.
- Record each stale claim, its source line and the shipped fact in the table below.

### Out of Scope
- The CI profile child's behavior (the `sk-code-ci` mode, the `ci` profile and the workflow row for it) - round B documents it after it lands.
- The quality run applying `## Rule overrides` sections and the doctor's applied-rules block - they landed on `origin/main` after this tree's base, so round B (or the merge) documents them. These docs avoid stating whether a run applies the rows.
- The parent packet's `spec.md` and `graph-metadata.json` - the conductor wires the child in.
- The agents' own text - `review.md`, `deep-review.md`, `orchestrate.md` and `code.md` were already aligned by the review-agent child, so no edit and no mirror run was needed.
- Code, scripts and tests - only docs, playbooks and the generated files a doc change makes stale.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-review/README.md`, `references/review-ux-single-pass.md`, `scripts/README.md` | Modify | Floor and lens, Rule sources line, agent verdict, retired verdict words, broken path, fixture tree |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/` | Modify/Create | Category `foreign-repository-rules` with three scenarios, the root index and a canary supplement |
| `.skilled/skills/sk-code/sk-code-quality/README.md`, `SKILL.md`, `scripts/README.md`, `scripts/lib/README.md` | Modify | Rules a repository can change, multi-path explain, hygiene helpers |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/` | Modify/Create | Two scenarios and the root index |
| `.skilled/skills/sk-code/sk-code-skilled/README.md` | Modify | The house style lives here |
| `.skilled/skills/sk-code/README.md`, `shared/README.md`, `shared/references/universal/rule-overrides.md` | Modify | Hub levers, the linter wording, who applies a row |
| `.skilled/skills/sk-code/feature-catalog/` | Modify/Create | Root entry, three updated leaves, three new leaves |
| `.skilled/commands/doctor/sk-code.md`, `assets/doctor-sk-code-presentation.txt`, `assets/doctor-sk-code-quality.yaml`, `assets/doctor-setup-presentation.txt`, `scripts/README.markdown` | Modify | Hygiene line, init suggestion, troubleshooting rows |
| `.skilled/scripts/git-hooks/README.md`, `.skilled/hooks/git/README.md`, `.github/workflows/README.md` | Modify | The config key reaches the hook and the CI job |
| `README.md` | Modify | Hard floor and overrides, review lens, agent verdict, the quality doctor |
| Four changelog entries and their carriers | Create/Modify | sk-code v3.9.14.0, sk-code-quality v1.13.8.0, sk-code-review v1.9.7.0, sk-code-skilled v2.1.9.0 |
| Compiled-route manifest and its archived copy, four Hermes copies | Regenerate | Generated by `compiled-route-manifest.cjs refresh` and `sync-skills-hermes.cjs` |

### Stale Claims Found

Lines are those of `HEAD`.

| # | File:line | Stale claim | Shipped fact |
|---|-----------|-------------|--------------|
| 1 | `sk-code-review/scripts/README.md:43` | Relative path `../shared/scripts/check-rule-overrides.cjs` | The linter is at `../../shared/scripts/`; the path made the drift guard fail |
| 2 | `sk-code-review/scripts/README.md:36` | The fixture tree stops at `rule-sources-valid.md` | Sixteen fixtures; four were missing |
| 3 | `sk-code-review/README.md:3`, `:27` | The mode "enforces" a baseline and produces findings and a status line | A fixed floor, a default lens and a `Rule sources:` line |
| 4 | `sk-code-review/README.md:130-132` | "Baseline Plus Surface": minimums "never relaxed" | The floor never changes; the 25 lens rules drop or change by override; precedence has five levels |
| 5 | `sk-code-review/README.md:108` | Only the final status line is described | Full reviews also state `Rule sources:` and the agent's verdict follows severity with an advisory score |
| 6 | `sk-code-review/README.md:206`, `:216` | Verification lists only the canary; related docs omit the contract | `--mode-only`, the report checkers and `rule-overrides.md` |
| 7 | `sk-code-review/references/review-ux-single-pass.md:46-64` | Report flow has no rule sources and uses the older verdict words | `Rule sources:` under the gate evidence; three status values; severity-based merge posture |
| 8 | `sk-code-review/manual-testing-playbook/manual-testing-playbook.md:39-41`, `:154` | Ids stop at CR-028; no foreign-repository case | CR-029 to CR-031 added, sections 17 and 18 moved to 18 and 19 |
| 9 | `sk-code-quality/README.md:26`, `:43`, `:67` | Works on authoring surfaces only; step 3 loads one floor | Floor rule ids with fixed or overridable marks; the SKILLED house style moved to sk-code-skilled |
| 10 | `sk-code-quality/README.md:87`, `:117` | No repository lever is named | `## Rule overrides` and `commentHygiene.disableRules` |
| 11 | `sk-code-quality/scripts/README.md:46` | `--explain <path>` is not described | It takes several files and returns surfaces, seats and parsed override rows |
| 12 | `sk-code-quality/scripts/lib/README.md:26` | `quality-config.cjs` exports lack the hygiene helpers | `hygieneCheckerFlags()`, `hygieneDisableFlags()`, `readHygieneRules()` and the `disableRules` validation |
| 13 | `sk-code-quality/manual-testing-playbook/manual-testing-playbook.md:151` | Heading ends at CQ-011 | CQ-012 and CQ-013 added |
| 14 | `sk-code-skilled/README.md:23`, `:134` | Works on evidence only | The house style (layout, `MODULE:`, `ceiling:`, JS and CSS checks) lives here, and its checklist carries an override row |
| 15 | `sk-code/README.md:24`, `:48`, `:163` | Mode table and quality doctor sentence omit the levers | A "Rules A Repository Can Change" subsection and the hygiene rules in the doctor |
| 16 | `sk-code/README.md:202` | Newest release entry is `v3.9.1.0.md` | The changelog folder holds the newest entry |
| 17 | `sk-code/shared/README.md:26`, `:94` | The modes "will call" the linter | They read their rule overrides through it; the standards carry ids and marks |
| 18 | `sk-code/shared/references/universal/rule-overrides.md:33` | Scope does not say who applies a row | The review mode applies rows and records them; the quality runner reads each section |
| 19 | `feature-catalog/feature-catalog.md:3`, `:11`, `:23`, `:87`, `:105` and the quality leaves | No entry for overrides, lens or the agent verdict; the config and doctor entries omit the key | Three new leaves, updated entries and `last_updated` |
| 20 | `.skilled/commands/doctor/sk-code.md:74`, `assets/doctor-sk-code-presentation.txt`, `assets/doctor-sk-code-quality.yaml:77`, `:90`, `:105`, `assets/doctor-setup-presentation.txt:26`, `scripts/README.markdown:72`, `:135` | The quality doctor reports the config and tools only | It also shows the disabled hygiene rules and, with no `specs/` folder, suggests the 15 spec-kit rules without writing them |
| 21 | `.skilled/scripts/git-hooks/README.md:113`, `.skilled/hooks/git/README.md:28` | Pre-commit comment hygiene has no exception | One `--disable-rule` flag for each rule the quality config lists |
| 22 | `.github/workflows/README.md:31` | `comment-hygiene.yml` rejects forbidden pointers, full stop | It honors `commentHygiene.disableRules` |
| 23 | `README.md:756`, `:897`, `:1255`, `:1455` | Checklists "always run first"; the review agent is a baseline; the quality doctor creates a config | Hard floor plus overrides, the lens, a severity verdict and the hygiene line |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every claim in the stale-claim table is corrected at the doc that owns it, and no changed doc states that a quality run does or does not apply `## Rule overrides` rows |
| REQ-002 | The review playbook gains CR-029 (almost no inline comments, no documentation finding), CR-030 (comment every function, the finding is raised) and CR-031 (a floor override refused), the quality playbook gains CQ-012 and CQ-013, existing ids are unchanged, and every command and output in them was run |
| REQ-003 | `validate_document.py --json` reports 0 issues on every changed or new doc, `validate-playbook-package.cjs` passes for the three playbooks with no new warning, and `validate_catalog_package.py` passes for the feature catalog |
| REQ-004 | The doc gates pass from the final state: the README reference and count checkers show no new failure, `verify-doc-claims.cjs` passes, the setup battery prints `STATUS=OK`, the canary and its suite pass, and the Hermes sync `--check` passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Each of the four skills and modes touched has one changelog entry that validates with 0 issues, with the carriers stepped above both the local and the `origin/main` newest version |
| REQ-006 | The hook, CI and doctor texts name `commentHygiene.disableRules` and the init suggestion, matching what the doctor script prints |
| REQ-007 | Every judgment call is recorded in `implementation-summary.md` with its reason |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each phrase probe in `tasks.md` reads 0 for a new phrase (or 1 for a stale one) at `HEAD` and the reverse in the changed tree.
- **SC-002**: The review playbook validates with 37 scenarios and 11 categories, the quality playbook with 13 scenarios, and the hub playbook is unchanged at 28.
- **SC-003**: The setup battery moves from 8 of 9 legs to `STATUS=OK legs=9`.
- **SC-004**: Three live `@review` runs produce the verdicts the three review scenarios expect, and the report checkers exit 0 on all three.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Children 001 to 006, 008, 011, 013 and 014 landed | The docs describe behavior that must exist | Every playbook command was run against this tree, and CQ-012 and CQ-013 were rerun against an `origin/main` archive |
| Risk | `origin/main` is two commits ahead, and one of them applies override sections in the quality run | A doc written from this tree could contradict it | The changed docs stay silent on whether a run applies rows; CQ-013 states the `origin/main` result and is flagged below |
| Risk | The quality `SKILL.md` and the doctor assets were edited on both sides | A merge conflict | The `SKILL.md` edit moved off the line the other side changed; the remaining overlap is listed in `implementation-summary.md` |
| Risk | Live `@review` runs are not deterministic | A scenario's expected verdict could drift | Each scenario asserts the verdict, the rule sources and the finding class, not the wording, and was run to a passing state with the checkers |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A: the packet changes documents, playbooks and generated files, and runs no service.
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A - no runtime path changes.

### Security
- **NFR-S01**: No tracked file names a private skill, a `local-*` path or a credential; the added lines of the diff hold no `local-` path, and the one match in the changed files is the git-hooks README's existing description of its private-skill gate.

### Reliability
- **NFR-R01**: The final-state gates in `acceptance-criteria.md` run from the changed tree, and none was skipped or bypassed.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a repository with no `## Rule overrides` section and no `disableRules` key behaves as before, and the docs say a mode that does not read overrides behaves as before.
- Maximum input: the playbook fixtures hold one source file each, and the resolver is asked about one file, so the multi-file explain is described in prose rather than proven at scale.
- Failure path: a floor row in a checklist is refused at the linter (exit 1) and the resolver (`refused true`), and a fixed hygiene id in the config is `CONFIG_INVALID` with exit 3.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 40 documents across 3 skills, the hub, the doctor, the hooks and the root README |
| Risk | 8/25 | Docs only, with one merge overlap against a landed child |
| Research | 12/20 | Three live review runs and a replay against the `origin/main` tree |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Round B documents the CI profile and, if the merge keeps them, the applied-rules block of the doctor.
<!-- /ANCHOR:questions -->

---
