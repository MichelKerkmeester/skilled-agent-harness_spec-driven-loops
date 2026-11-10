---
title: "Feature Specification: Align docs, playbooks, catalogs and doctor text with the shipped portable quality and review behavior"
description: "After the portable quality, review, override-applying and CI-profile children landed, the READMEs, playbooks, feature catalog, doctor text and hook docs still described the old behavior: no way to change a rule, a single review baseline, an agent with its own checklist, a CI doctor tied to six names. This child brings every one of them to the shipped behavior and adds the four foreign-repository scenarios."
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
| **Status** | Complete (rounds A and B) |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/251-docs-and-doctor-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The portable quality and review children made the rules a repository's own: a hard floor that never changes, a `## Rule overrides` section and `commentHygiene.disableRules` for the rest, a review that resolves its rules through `--explain` and states them on a `Rule sources:` line, and an agent whose verdict follows severity. The docs around them still describe the earlier modes. A reader of the review README finds a single baseline plus a surface, the doctor text has no word for the disabled hygiene rules, the hook READMEs say nothing about the config key, and neither playbook proves a repository that wants a different style. The review scripts README also carried a broken relative path that made the setup battery's drift guard fail before any edit.

### Purpose
Every doc, README, catalog, playbook and doctor text that describes the shipped quality, review or CI behavior says what ships, and the playbooks run the four foreign-repository cases: almost no inline comments, a comment on every function, a refused floor override, and a CI doctor that reads a repository's own switch names.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Round A was measured at `HEAD` `780cbd7cd8`, two commits behind `origin/main`. Round B was measured at `ebc6392141`, round A rebased onto the `origin/main` that holds the CI profile child and the override-applying child. The round B probes follow the round A block.

Round A:

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

Round B, at `ebc6392141`:

```text
$ for each (file, phrase): git show HEAD:<file> | grep -c "<phrase>"
doctor-sk-code-presentation.txt        "^Hygiene"                        3   (Hygiene: ~82, Hygiene rules: ~100, Hygiene: ~144)
feature-catalog.md                     "six switch variables"            1
doctor-ci-toggle.md (DOC-394)          "six documented"                  3
doctor-ci-toggle.md (DOC-394)          "second confirmation"             0
doctor-ci-report.md (DOC-392)          "profile"                         0
sk-code-ci/README.md                   "CI profile"                      0
ci-workflow-doctor-and-switches.md     "CI profile"                      0
sk-code/shared/README.md               "rule-registry"                   0
sk-code-quality/scripts/README.md      "rule_conflicts"                  0
doctor scripts README.markdown         "explain"                         0
disabled-hygiene-rules.md (CQ-012)     "p0_p1_p2_decisions"              0
$ check_readme_references.py / check_derived_readme_counts.py over the 14 README files this child changed
FAIL .skilled/hooks/git/README.md (4 unresolved), .skilled/scripts/git-hooks/README.md (4 unresolved)
FAIL sk-code-quality/scripts/README.md (2 count claims), sk-code-review/README.md (1 count claim)
$ validate-playbook-package.cjs --package sk-code-ci/manual-testing-playbook
PASS scenarios=1 categories=1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct each stale claim in the READMEs, references, feature catalog, doctor command text, hook and CI READMEs and the root README, at the doc that owns it.
- Add three review playbook scenarios and two quality playbook scenarios for the foreign-repository cases, each built from commands that were run, with the review ones backed by a live `@review` run.
- Add three feature catalog leaves for the rule overrides, the review floor and lens, and the review agent's verdict.
- State the shipped facts of the override-applying run and the doctor's applied-rules block wherever a doc was silent or neutral in round A.
- Describe the CI profile (`/doctor:ci`, the sk-code-ci packet, the catalog, the hub playbook scenarios, the router table, the hub and root READMEs) and add the fourth foreign-repository scenario to the sk-code-ci playbook.
- Make the doctor presentation say each hygiene fact once, matching what the status script prints.
- Fix the README checker failures that predate this child, at the doc or with a reasoned marker.
- Write one changelog entry for each of the five skills and modes touched (the four unlanded entries extended, one new for sk-code-ci), step their carriers, and run the generators for the compiled-route manifest and the Hermes copies.
- Record each stale claim, its source line and the shipped fact in the table below.

### Out of Scope
- Code, scripts and tests of the CI profile and override-applying children - they shipped before round B, and only their docs change here.
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
| `.skilled/skills/sk-code/sk-code-ci/` README, `SKILL.md`, playbook root, new `foreign-repository/` scenario and changelog | Modify/Create | Round B: the profile section, the template, the fourth foreign-repository scenario, sk-code-ci v1.1.6.0 |
| `.skilled/skills/sk-code/ROUTER.md`, `manual-testing-playbook/doctor-commands/doctor-ci-report.md`, `doctor-ci-toggle.md`, the hub playbook root | Modify | Round B: the profile row, the report's `profile` key, the protected-workflow confirmation |
| `.skilled/skills/sk-code/shared/README.md`, `sk-code-quality/scripts/README.md`, `scripts/lib/README.md`, `.skilled/commands/doctor/scripts/README.markdown`, `sk-code.md`, `assets/doctor-sk-code-presentation.txt`, `assets/doctor-setup-presentation.txt` | Modify | Round B: the registry, the applied-rules facts, one hygiene line per block |
| `.skilled/hooks/git/README.md`, `.skilled/scripts/git-hooks/README.md`, the review README | Modify | Round B: resolvable paths, reasoned markers, contract placeholders |
| Compiled-route manifest and its archived copy, Hermes copies | Regenerate | Generated by `compiled-route-manifest.cjs refresh` and `sync-skills-hermes.cjs`, in both rounds |

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
| 24 | `doctor-sk-code-presentation.txt:82`, `:100`, `:144` | Three overlapping hygiene lines (`Hygiene:` twice, `Hygiene rules:` once) | The status prints `Hygiene:` once and `Hygiene rules:` once; the result summary's `Applies:` line carries the counts, so the second `Hygiene:` is gone |
| 25 | `doctor-sk-code-presentation.txt` init plan | `Suggested, not written:` without its reason | The script also prints a `why:` line |
| 26 | `.skilled/commands/doctor/scripts/README.markdown:76`, `:142`, `:179`, `sk-code.md:74`, the catalog doctor leaf | The status shows the config, tools and disabled rules only | It also lists each checklist with its seat, override rows or refusal reasons, conflicts and the hygiene rules in force, through `--explain` over a sample; a refused section, unknown id or missing checklist fails it |
| 27 | `sk-code-quality/README.md` "Rules Your Repository Can Change", `scripts/README.md:46`, `scripts/lib/README.md` consumers | Round A stayed silent on whether a run applies rows | A refused section or unknown id is `CONFIG_INVALID` exit 3, accepted rows are in `rule_overrides` and `p0_p1_p2_decisions`, same-level conflicts make the rule unverified |
| 28 | `shared/README.md` tree and table, `rule-overrides.md` Scope and Key Sources | No registry module or test | `scripts/lib/rule-registry.cjs` and its test; the run applies sections as section 7 says |
| 29 | `feature-catalog.md:133`, `ci-workflow-doctor-and-switches.md` | `toggle` covers six switch variables | Any variable a job compares against `off`; refusals from the live ruleset, `neverOff` and the README; a second confirmation for a protected workflow; the profile lookup |
| 30 | `manual-testing-playbook/doctor-commands/doctor-ci-toggle.md` (DOC-394), `doctor-ci-report.md` (DOC-392) and the hub playbook root | "Six documented names", no profile key, one confirmation | The profile's switches, a `profile` key in the report JSON, the protected-workflow list and the second confirmation |
| 31 | `sk-code-ci/README.md`, `SKILL.md`, `ROUTER.md`, the hub README and `SKILL.md` | The packet and its router row describe this repository's CI only | Universal rules plus a CI profile (`.sk-code/ci.json`) and a profile template |
| 32 | `sk-code-ci/manual-testing-playbook/` | One routing scenario, no foreign-repository case | `ci-foreign-repository-profile`, run with a mocked `gh` |
| 33 | `doctor-setup-presentation.txt:27` | The CI row omits the profile | The report is read against the repository CI profile |
| 34 | `.skilled/hooks/git/README.md:52`, `:78`, `:88`, `:99`, `.skilled/scripts/git-hooks/README.md:14`, `:26`, `:33`, `:131` | Four unresolved paths each | The relative path is corrected, or the token is a git-directory path that cannot resolve and carries a reason marker |
| 35 | `sk-code-quality/scripts/README.md:48`, `:62`, `sk-code-review/README.md:75` | Count claims the checker cannot derive | The two bash suite counts are correct and carry reason markers; the review example uses the contract's `X files, Y lines` placeholders |
| 36 | `sk-code-quality/manual-testing-playbook/quality-gate/disabled-hygiene-rules.md` (CQ-012) | The scenario did not show the run recording the style rows | Step 2 prints the decisions line with both rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every claim in the stale-claim table is corrected at the doc that owns it, and every changed doc agrees with the shipped behavior of the run that applies `## Rule overrides` rows |
| REQ-002 | The review playbook gains CR-029 (almost no inline comments, no documentation finding), CR-030 (comment every function, the finding is raised) and CR-031 (a floor override refused), the quality playbook gains CQ-012 and CQ-013, existing ids are unchanged, and every command and output in them was run |
| REQ-003 | `validate_document.py --json` reports 0 issues on every changed or new doc, `validate-playbook-package.cjs` passes for the three playbooks with no new warning, and `validate_catalog_package.py` passes for the feature catalog |
| REQ-004 | The doc gates pass from the final state: the README reference and count checkers show no new failure, `verify-doc-claims.cjs` passes, the setup battery prints `STATUS=OK`, the canary and its suite pass, and the Hermes sync `--check` passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | Every doc that described `/doctor:ci` without the profile, or called six names the only valid switches, states the profile lookup, the shape-based switch detection, the ruleset refusal and the second confirmation, and the sk-code-ci playbook gains `ci-foreign-repository-profile`, whose commands were run |
| REQ-009 | The docs that were silent or neutral in round A state the override-applying run (a refused section or unknown id is `CONFIG_INVALID` exit 3, accepted rows in the decisions, same-level conflicts unverified), the shared registry and the doctor's applies block with its sample limit, and CQ-012 and CQ-013 pass in this tree |
| REQ-010 | The doctor presentation says each hygiene fact once and matches what `sk-code-quality-config.cjs status` prints |
| REQ-011 | `check_readme_references.py` and `check_derived_readme_counts.py` pass on every README this child changed |
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
- **SC-002**: The review playbook validates with 37 scenarios and 11 categories, the quality playbook with 13 scenarios, the sk-code-ci playbook with 2 scenarios in 2 categories, and the hub playbook is unchanged at 28.
- **SC-003**: The setup battery moves from 8 of 9 legs to `STATUS=OK legs=9` in round A and stays there after the rebase and round B.
- **SC-004**: Three live `@review` runs produce the verdicts the three review scenarios expect, and the report checkers exit 0 on all three.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Children 001 to 006, 008, 011, 013 and 014 landed | The docs describe behavior that must exist | Every playbook command was run against this tree, and CQ-012 and CQ-013 were rerun against an `origin/main` archive |
| Risk | The override-applying run and the CI profile landed after round A was written | A round A doc could contradict them | Round B restates each from the shipped summaries and replays CQ-012 and CQ-013 in this tree |
| Risk | The presentation file was edited on both sides of the rebase | Three overlapping hygiene lines | Round B reduces them to one line per block and checks them against the status output |
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
