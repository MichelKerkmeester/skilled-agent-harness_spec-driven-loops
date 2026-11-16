---
title: "Feature Specification: Phase 4: hook-readme-fold-and-rewrite"
description: "81 hook READMEs describe a folder that holds only symlinks, two feature folders have no README and 53 of the 183 READMEs miss the sentence targets. This phase folds the 81 into their feature README, rewrites the 102 that stay, authors the two missing ones and splits the session-handover README."
trigger_phrases:
  - "hook readme fold and rewrite"
  - "phase 4 hook readme fold and rewrite"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 4: hook-readme-fold-and-rewrite

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`.skilled/hooks/` holds 183 README paths. 81 of them describe a folder that holds only symlinks, `ask-surface-guard/` and `decision-capture/` have no feature README and `session-handover/README.md` runs to 14,422 words. This phase folds the 81 into a runtime table in the README one level up, rewrites the 102 that stay, authors the two missing ones and moves the deep session-handover behaviour into five sibling documents. After it, `readme-metrics.py` reports one failing file where it reports 53 today, and the reference checker reports none where it reports 95.

**Key Decisions**: Workers on `deepseek-flash` draft one README per brief and the orchestrating session reviews each return against seven gates, The stricter `code_folder` validator type is read for every rule except `code_folder_inline_path`

**Critical Dependencies**: Phase 003 is complete, so every path a README names is final.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/411-hook-library-cleanup` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-literal-hook-renames |
| **Successor** | None |
| **Handoff Criteria** | Every hook README passes `validate_document.py` and `hvr_scan.py`, the sentence metrics meet the targets in the plan and the parent packet validates recursively. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Hook library cleanup, literal names and README rewrite specification.

**Scope Boundary**: README files under `.skilled/hooks/` and the README paths there that are symlinks into skills. No code changes. Paths, flags, events and numbers stay byte-exact.

**Dependencies**:
- Phase 003 is complete, so every path a README names is final.
- The standards in `sk-create-readme`, `readme-code-template.md` and the human voice rules.
- Vibe CLI workers on `deepseek-flash`, with cli-opencode on OpenCode Go as fallback, briefed and reviewed by the orchestrating session.

**Deliverables**:
- The 81 symlink-only leaf READMEs folded into their feature README's runtime table and deleted.
- The root README, the feature READMEs and the leaf READMEs for real code rewritten, and feature READMEs authored for `ask-surface-guard/` and `decision-capture/`.
- `session-handover/README.md` split into an orientation page and sibling reference docs, and the known wrong facts corrected.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A reader who opens a runtime folder such as `.skilled/hooks/git-live-follow/claude/` finds a README of about 300 words for one symlink. 81 READMEs are of that kind, and the facts in them repeat the feature README one level up. The READMEs for real code are hard to read in one pass: 53 of the 183 miss the sentence targets, 100 prose paragraphs run past 80 words and `session-handover/README.md` alone holds 14,422 words. `ask-surface-guard/` and `decision-capture/` have no feature README, so a reader of those two folders has no starting page. 95 READMEs name a path that does not resolve.

### Purpose
Every README under `.skilled/hooks/` describes real code and reads in one pass, and no README is left for a folder that holds only symlinks.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ find .skilled/hooks -name README.md | wc -l
     183
$ python3 -c "print(len([str(r.parent) for r in __import__('pathlib').Path('.skilled/hooks').rglob('README.md') if all(c.is_symlink() for c in r.parent.iterdir() if c.name != 'README.md')]))"
81
$ ls .skilled/hooks/ask-surface-guard/README.md .skilled/hooks/decision-capture/README.md
ls: .skilled/hooks/ask-surface-guard/README.md: No such file or directory
ls: .skilled/hooks/decision-capture/README.md: No such file or directory
$ wc -w .skilled/hooks/session-handover/README.md
   14422 .skilled/hooks/session-handover/README.md
$ python3 specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/scratch/readme-metrics.py .skilled/hooks | tail -2
TOTAL sentences=3483 median=12 over30=255 (7.3%) max=97 para_over80=100 prose_words=52129
SUMMARY files=183 pass=130 fail=53
$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py $(find .skilled/hooks -name README.md | sort) | tail -1
SUMMARY files=183 pass=88 fail=95
$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py $(find .skilled/hooks -name README.md | sort) | tail -1
SUMMARY files=183 pass=173 fail=10
$ grep '^readme-[vh]' specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/003-literal-hook-renames/scratch/baseline-after/summary.txt
readme-validate_document	pass=183	fail=0
readme-hvr_scan	pass=158	fail=25
```

A planning run of `validate_document.py --type code_folder --json` over the 102 READMEs that stay printed these blocking rules: `code_folder_flat_inventory` in 69 files, `code_folder_inline_path` in 64, `code_folder_directory_tree` in 5, `code_folder_relative_link` in 5 and `code_folder_commit_hash` in 2. Of those 102, 40 fail the sentence metrics, 24 fail `hvr_scan.py`, 51 fail the reference checker and 5 fail the count checker. None passes every gate. T002 saves the per-file rows before the first edit.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fold the 81 READMEs that sit in a folder of symlinks into a RUNTIME COVERAGE table in the README one level up, then delete them with `git rm`.
- Rewrite the root hooks README, the 20 other feature READMEs for real code and the 76 leaf READMEs for real code to the code-folder shape and the human voice rules.
- Author `ask-surface-guard/README.md` and `decision-capture/README.md` from the code in those folders.
- Split `session-handover/README.md`: orientation, quick start, runtime coverage and switches stay, and the deep behaviour moves into five sibling documents in that folder.
- Rewrite the two skill-owned READMEs the hooks tree links to, `sk-git/scripts/hooks/README.md` and the spec-gate library README. Fix the hard blockers and the eight unresolved references and add the folded rows in `skill-advisor-hook.md`, and nothing else there.
- Correct the wrong facts listed in `plan.md`, update the doc lines elsewhere that describe a changed README and rebase the three pinned lists.

### Out of Scope
- Any code, test, registry, workflow or config file - the child goal freezes this as decision D1, and REQ-013 proves it.
- `coverage-rationale.md` and `injection-contract.md` - the parent spec lists them as out of scope. They are not READMEs.
- A rewrite of `skill-advisor-hook.md` beyond hard blockers, the eight unresolved references and the folded rows - the approved plan limits that file to blockers, because it is the advisor skill's reference document. The eight references are in scope because the approved plan requires `check_readme_references.py` to exit 0 for every README, and REQ-008 counts this file.
- The runtime mirror READMEs outside `.skilled/hooks/`, such as `.claude/hooks/README.md` and `.pi/extensions/README.md` - they describe other folders.
- Kill-switch names, concern keys and hook ids - the parent goal freezes them as decision D1. The root README gains one table that maps the keys that differ from their folder names.
- Commit, merge and push - the parent goal freezes this as decision D6.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 81 `README.md` files under `.skilled/hooks/<feature>/<runtime>/` whose folder holds only symlinks | Delete | With `git rm`, after each one's row is in the README one level up. `scratch/fold-map.tsv` lists them. |
| `.skilled/hooks/README.md` | Modify | Rewrite. Drop the relocation history and the stale counts, add the concern-key table and keep the coverage matrix a test reads. |
| 20 feature READMEs for real code under `.skilled/hooks/<feature>/README.md` | Modify | Rewrite to the worked example's shape. 18 of them gain the folded runtime rows. |
| `.skilled/hooks/codex-global-hooks-check/README.md` | Modify | Remove the sentence that says each runtime folder holds a README. Its table already holds the four rows. |
| `.skilled/hooks/ask-surface-guard/README.md`, `.skilled/hooks/decision-capture/README.md` | Create | A reader of either folder has no starting page today. |
| 76 leaf READMEs for real code at depth 2 and depth 3 under `.skilled/hooks/` | Modify | Rewrite to OVERVIEW, a complete FILES table or a tree, and RELATED. Remove links to deleted READMEs. |
| `.skilled/hooks/session-handover/README.md` | Modify | Keep orientation, quick start, runtime coverage, switches, tree and validation. |
| `.skilled/hooks/session-handover/handoff-protocol.md`, `goal-carry-over.md`, `runtime-behavior.md`, `state-files.md`, `troubleshooting.md` | Create | The README holds 14,422 words today. Each new document takes one topic out of it, as `goal/goal-plugin.md` does for `goal/README.md`. |
| `.skilled/skills/sk-git/scripts/hooks/README.md` | Modify | Rewrite. The title names both hooks it documents, and it gains the eight folded rows of `git-message-gate/` and `git-preflight/`. |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md` | Modify | Rewrite, with the seven folded rows of `spec-gate/`. |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modify | Hard blockers, the eight unresolved references and the eight folded rows of `skill-advisor/` only. |
| Root `README.md`, `.skilled/skills/system-spec-kit/README.md`, `.skilled/bin/README.md` and five playbook files under `system-spec-kit/manual-testing-playbook/plugins-and-hooks/` | Modify | Only a line that describes what `session-handover/README.md` covers, when the split makes it wrong. |
| `durable-directory-manifest.json`, `baseline-readme-verdicts.json`, `trigger-index.json` and the files under `runtime/cli/retrieval/fixtures/` | Regenerate | With each list's own writer, once, after the last README edit. |
| `scratch/readme-gates.py` in this folder | Create | Running five checkers by hand for each of about 110 files fails as a review step, because each return needs one verdict line a re-dispatch can quote. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `python3 -c "print([str(r.parent) for r in __import__('pathlib').Path('.skilled/hooks').rglob('README.md') if all(c.is_symlink() for c in r.parent.iterdir() if c.name != 'README.md')])"` prints `[]`. It lists 81 folders today. |
| REQ-002 | `ls .skilled/hooks/ask-surface-guard/README.md .skilled/hooks/decision-capture/README.md` exits 0. |
| REQ-003 | For every `README.md` under `.skilled/hooks/`, `validate_document.py` prints `VALID` and `hvr_scan.py` reports `hard blockers: 0`. 25 READMEs fail `hvr_scan.py` today. |
| REQ-004 | `readme-gates.py fold` prints `FOLD missing=0`: each link in a folder that holds only links is named as `<runtime>/<file>` in the README one level up. |
| REQ-005 | `readme-metrics.py` over `.skilled/hooks` and the five session-handover documents prints `FAIL` for no file except `.skilled/hooks/skill-advisor/README.md`. It prints `FAIL` for 53 files today. |
| REQ-006 | The hook Vitest tree, the hook `node --test` suites and the OpenCode plugin tests print the counts T001 records, and `completion-evidence-sentinel.vitest.ts` passes. Three tests read README text: `runtime-refusal.test.mjs`, `goal-doc-contract.test.cjs` and that Vitest file. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `validate_document.py --type code_folder --json` reports no blocking rule other than `code_folder_inline_path` for every `README.md` under `.skilled/hooks/` except `skill-advisor/README.md`. A README path that is a link is checked at the file it points to, because `code_folder_relative_link` resolves links from the README's own folder. |
| REQ-008 | `check_readme_references.py` and `check_derived_readme_counts.py` over every `README.md` under `.skilled/hooks/` and the five session-handover documents each print `fail=0`. They print `fail=95` and `fail=10` today. |
| REQ-009 | `wc -w .skilled/hooks/session-handover/README.md` prints fewer than 3,000 words, `ls` on the five sibling documents exits 0 and the README links each of them. |
| REQ-010 | `rg -n '\]\([^)]*specs/' .skilled/hooks -g '*.md'` prints nothing. The session-handover README holds six such links today. |
| REQ-011 | `readme-gates.py triggers` prints `TRIGGERS lost=0`: each trigger phrase of a README in `scratch/before/` is in the same README now, or in the README one level up when the file was deleted. The phrase "git hooks" in the root hooks README is the one recorded exception. |
| REQ-012 | `test_readme_manifest.py` prints `manifest=reproducible`, `test_readme_verdict_parity.py` prints `PARITY PASS` and `generate-trigger-index.mjs --check` prints `trigger index matches the corpus`. |
| REQ-013 | No file outside Markdown, the pinned lists and this packet changes: the path list of `git status --short`, without those three groups, equals the list T003 saves. |
| REQ-014 | The root hooks README names each of the eight concern keys that differ from their folder name next to its folder, its last H2 is RELATED and its frontmatter holds no "git hooks" phrase. |
| REQ-015 | The `LEAFREF` search in `tasks.md` lists no file outside `specs/` that names a deleted README. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `find .skilled/hooks -name README.md | wc -l` prints 104. It prints 183 today, and the phase deletes 81 and creates 2.
- **SC-002**: The `SUMMARY` line of `readme-metrics.py .skilled/hooks` shows `fail=1`. It shows `fail=53` today.
- **SC-003**: Every gate in the `plan.md` baseline table passes from the final state, and each count differs from the phase 3 final count only where the table says it will.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The Vibe CLI with `deepseek-flash` | Without it no worker drafts a README | After two failed runs or a rate limit, the same brief goes to cli-opencode on `opencode-go/deepseek-v4.1-flash`. Three rejected attempts on one file and the orchestrating session writes it. |
| Risk | A worker changes a fact while it shortens a sentence | High | Each brief lists the paths, flags and events of the file. The review compares every backticked token of the old file with the new one and reads each feature README against its source. |
| Risk | A rewrite drops text a test asserts | High | The three briefs for files a test reads quote the asserted strings. REQ-006 reruns the suites. |
| Risk | A deleted README is still linked from another document | Med | `check_readme_references.py` over every hook README, and the REQ-015 search over the rest of the repository. |
| Risk | A trigger phrase is lost, so the phrase lookup no longer finds the document | Med | REQ-011 compares every phrase with the saved copy. |
| Risk | The other session on main edits a hook README or a generated index | Low | Nothing is merged in this phase. The pinned lists are regenerated after the merge. |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. The phase changes no code path.

### Security
- **NFR-S01**: A worker writes only the one file its brief names. The review rejects a return whose diff touches any other path, and REQ-013 proves no code file changed.

### Reliability
- **NFR-R01**: No runtime entry loses its documentation. REQ-004 proves each link in a link-only folder is named in the README one level up before its leaf README is deleted.

---

## 8. EDGE CASES

- Empty input: a link-only folder whose facts are already in the README one level up, such as the four in `codex-global-hooks-check/`, adds no row and is only deleted.
- Maximum input: `session-handover/README.md` at 14,422 words is split by section into six briefs, one for each output file.
- Failure path: a worker return that fails a gate is rejected with the `readme-gates.py` lines that failed. The third rejection on one file ends the dispatches for it.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 81 deleted, 102 rewritten, 7 created, 5 regenerated, LOC: about 9,000 lines of Markdown, Systems: hook docs, three skill docs, pinned lists |
| Risk | 6/25 | Auth: N, API: N, Breaking: N, a wrong fact in a README misleads a reader but breaks no hook |
| Research | 5/20 | Each runtime row is read from the registry or the adapter, not from an old README |
| Multi-Agent | 12/15 | Workstreams: about 110 worker briefs in waves of up to five |
| Coordination | 8/15 | Dependencies: the worker CLI, the live session on main, three tests that read README text |
| **Total** | **51/100** | **Level 3** |

The child scores below Level 3 alone. It carries Level 3 because `recommend-level.sh` scored the whole decomposition at 75/100 and the children were scaffolded at the parent's level.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A worker rewrites a path, flag, event or number | H | M | The identifier comparison in `readme-gates.py` and a source read of each feature README. |
| R-002 | A folded row is written from the old leaf README and repeats its error | M | M | Each row comes from `hook-registry.json` or the adapter file. `scratch/fold-map.tsv` holds the source of each row. |
| R-003 | A rewrite removes a string a test asserts | H | L | The asserted strings are quoted in the brief, and the suites run after each wave that touches such a file. |
| R-004 | The worker CLI stalls or hits a rate limit under five parallel runs | M | M | The pilot runs two briefs first. A stalled run is stopped and the brief goes to the fallback. |
| R-005 | A link-only folder with five or more links stays in the durable directory manifest without a README | L | M | T071 reads the `gaps` count the manifest test prints and records each new gap. |

---

## 11. USER STORIES

### US-001: A feature README reads in one pass (Priority: P0)

**As a** maintainer who opens a hook folder, **I want** its README in short sentences with the runtime entries in one table, **so that** I learn what the hook does and where each runtime loads it without opening a second file.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A runtime folder of links needs no page of its own (Priority: P1)

**As a** reader who lists `.skilled/hooks/<feature>/`, **I want** the link folders to hold only their links, **so that** a README always means real code is next to it.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Does `vibe -p` need `--auto-approve` to write a file from a scratch working directory? Unknown. The pilot in T010 shows it before any wave.
- How do Vibe's billing pool and rate limits behave under five parallel runs? Unknown. The pilot and the first wave show it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
