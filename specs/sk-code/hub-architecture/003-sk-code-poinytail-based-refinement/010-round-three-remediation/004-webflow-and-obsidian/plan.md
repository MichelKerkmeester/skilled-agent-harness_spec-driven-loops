---
title: "Implementation Plan: Phase 4: webflow-and-obsidian"
description: "Text-only repairs in two sk-code surface packets: nine template pointers and four section pointers in the Webflow packet move to files and sections that exist, two link labels and the comment budget row are corrected, the Obsidian section 4 asset list names the seven shipped checklists, and the Obsidian playbook root gains the overview heading the document validator requires. Both packets get a patch version and a changelog entry."
trigger_phrases:
  - "webflow and obsidian plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: webflow-and-obsidian

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, plus comment lines in shipped `.js`, `.css` and `.html` templates |
| **Framework** | None. Checks run through Node.js and Python 3 scripts already in the repository |
| **Storage** | None |
| **Testing** | `verify_router_sync.cjs`, `compiled-route-guard.cjs`, `generate-leaf-manifest.cjs --check`, `validate-playbook-package.cjs`, `validate_document.py`, `hvr_scan.py`, `test-minified-runtime.mjs` fixtures, `run-all-drift-guards.sh` |

### Overview
Every change is a literal text replacement in a file this phase owns, listed one per task in `tasks.md` and one per unit in `scratch/dispatch-units.json`. The Webflow templates and references stop naming the removed `references/webflow/` tree and the section numbers the reference split moved. The Obsidian `SKILL.md` stops offering three checklists that never shipped, and the playbook root gains a numbered overview heading. No script, route, resource map or leaf path changes, so the routing gates must return the verdicts they return today.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place text edits to documentation and template comments, each proven by a grep and by the existing gates.

### Key Components
- **Shipped templates** (`sk-code-webflow/assets/templates/`): nine pointer rows. Recheck on 2026-10-10: `rg -n "references/(webflow|css|javascript|html)" .skilled/skills/sk-code/sk-code-webflow/assets/templates/` printed the nine rows f-iter013-001 names (`component-template.js:7`, `component-template.css:8`, `embed-template.html:6,80`, `form-scaffold-template.html:7,202,203,204`, `head-footer-code-template.html:8`). No earlier phase fixed them.
- **HTML style guide** (`references/html/style-guide.md`): line 78 cites `init-dom-error-and-async.md §13 Action Routing Pattern` (f-iter013-002), line 103 cites `quick-reference.md §10 Form Validation Classes` (f-iter013-003), and line 191 repeats the `init-dom-error-and-async.md §13` claim. `init-dom-error-and-async.md` stops at `## 5. ASYNC PATTERNS`. `### Action Routing Pattern` sits at `shared-listener-and-weakmap.md:91`, inside `## 2. SHARED DOCUMENT LISTENER PATTERN` (`:34`). `## 5. FORM VALIDATION CLASSES` is at `javascript/quick-reference.md:268`.
- **JavaScript quick reference** (`references/javascript/quick-reference.md`): line 68 holds the budget row `- [ ] Maximum 5 comments per 10 lines` (f-iter005-001), and line 281 cites `../css/quick-reference.md §3 Form Validation Classes`, which is `## 4. FORM VALIDATION CLASSES` at `css/quick-reference.md:82`.
- **Cross-language rules** (`references/shared/cross-language-rules.md`): line 47 holds `1. **Quantity limit:** Maximum 5 comments per 10 lines of code` (f-iter005-001, f-iter004-001 Webflow half). Line 173 shows the label `../../universal/code-style-guide.md` over the target `../../../shared/references/universal/code-style-guide.md` (f-iter005-002) and says the rule is "defined once for both surfaces".
- **Enforcement** (`references/shared/enforcement.md`): line 310 shows the label `../../../assets/webflow/checklists/code-quality-checklist.md` over a target that resolves (f-iter004-005). Line 246 shows the short label `code-quality-checklist.md`, which is a name, not a stale path, and stays.
- **Obsidian `SKILL.md`**: section 4 (`## 4. ASSETS (on-demand)`, line 236) lists five asset lines at 238 to 242, three of them for files that do not exist (f-iter015-001). `ls .skilled/skills/sk-code/sk-code-obsidian/assets/` lists seven checklists, and the `RESOURCE_MAP` in section 2b already routes all seven.
- **Obsidian playbook root**: `python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md` prints `INVALID`, `Total issues: 2`: the blocking `missing_required_section: overview` and the `document_type_fallback` warning. The validator finds sections only through numbered H2 headings (`^## \d+\.`), so an unnumbered `## Overview` does not count. A copy with `## 1. OVERVIEW` inserted after the H1 printed `VALID`, `Total issues: 1`, exit 0.

### Decisions

| ID | Decision | Why |
|----|----------|-----|
| D1 | Template pointers use the full repository path `.skilled/skills/sk-code/sk-code-webflow/references/...` | The templates ship into other projects, so a pointer relative to the templates folder means nothing there. The Webflow scripts already print this form in their usage lines (`test-minified-runtime.mjs:7`), and each path passes `test -e` from the repository root |
| D2 | `component-template.js` points at the folder `references/javascript/style-guide/` | The JavaScript style guide was split into three files (`overview-naming-and-structure.md`, `formatting.md`, `commenting-and-related.md`), and the template's conventions list spans all three |
| D3 | Fix the three extra pointers of the same class found during recheck: `html/style-guide.md:191`, `javascript/quick-reference.md:281` and `css/quality-standards/focus-has-print-and-quick-reference.md:61` (a `references/webflow/css/quick-reference.md §5` pointer whose target is now section 6 of `css/quick-reference.md`), plus the `§3` to `§4` section number on `form-scaffold-template.html:204` | They are the same dead-section defect as f-iter013-002 and f-iter013-003 in files this phase owns, and leaving them would fail the REQ-002 grep |
| D4 | Obsidian section 4 lists exactly the seven shipped checklists, each line in the form `- <title>: \`assets/<file>\``, using each checklist's own `title:` | Repointing three lines one to one is impossible, since no shipped file is a renderer pre-flight or a debug checklist. Listing the seven real files matches the `RESOURCE_MAP` and the playbook's list of real files. The colon form keeps the new lines free of dashes |
| D5 | Fix the playbook root with a numbered `## 1. OVERVIEW` heading above the existing intro paragraph, and accept the one `document_type_fallback` warning | The blocking error is in the file and is fixed there. The warning says no type rule matches a playbook root file, which is decided in `validate_document.py` (`_detect_document_type_with_source`), owned by `sk-doc`, not by this phase. `--type playbook` does not apply either: it demands `global_preconditions`, `global_evidence_requirements` and `deterministic_command_notation` sections, and the Webflow and OpenCode playbook roots fail it the same way. `validate-playbook-package.cjs` stays the governing gate for the package and keeps passing |
| D6 | Patch bumps: `sk-code-webflow` 1.1.0.0 to 1.1.1.0 and `sk-code-obsidian` 0.1.2.0 to 0.1.3.0, one changelog entry each under the packet's own `changelog/` | `sk-create-changelog` section 4 maps docs fixes and cleanup to `patch` (`{MAJOR}.{MINOR}.{PATCH+1}.0`). `v0.1.2.0` is already committed (`0da902346aa`), so this phase cannot fold into it |
| D8 | The playbook honesty note, the three triage steps, the zero-keyword expected result and the two README pointers name only current files, and the three `common-commands.md` labels show the target path, the form the other label fixes use | The operator asked for every finding fixed. Keeping the old names as history would leave the residue search failing, and the current names are what a reader needs |
| D7 | Edits that touch a line holding an em dash replace only a substring, never the whole line | The new text must add no em dash, and the dashes already on those lines are outside these findings |

### Handoffs

| To | Item |
|----|------|
| Child 001 (shared and hub docs) | Both Webflow budget rows link `../../../shared/references/universal/code-style-guide.md` and name its section 4 (`## 4. COMMENTING`). Child 001 adds the comment-density rule to that file. Keep the rule inside section 4, or tell the orchestrator the new section number so this phase's two links can follow it |
| Child 001 (shared and hub docs) | `.skilled/skills/sk-code/leaf-manifest.json` is not touched here. This phase adds and removes no file under `references/` or `assets/`, so the planning run showed the manifest stays `OK (fab6eb86...)`. If T054 reports it stale, the builder stops and reports instead of regenerating it |
| Orchestrator | Regenerate the Hermes copies after every build (T048). Only `.hermes/skills/sk-code-webflow/SKILL.md` and `.hermes/skills/sk-code-obsidian/SKILL.md` drift from this phase |
| `sk-doc` owner (no sibling child) | `validate_document.py` has no document type for a playbook root file and always adds a `document_type_fallback` warning (D5) |

### Data Flow
Readers reach these files through the hub router (`ROUTER.md` and each packet's `RESOURCE_MAP`) and adopters through copied templates. The router reads resource paths, not the edited prose, and the leaf manifest lists paths, not contents, so no route or manifest changes. The new changelog files sit under `changelog/`, which is not a leaf root.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Each Phase 2 edit is also a unit in `scratch/dispatch-units.json`, in the same order and with the same task id, and `scratch/build-units.cjs` reproves that every old text occurs exactly once.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Planning probes, 2026-10-10**: all 34 units were applied in order, each check run right after its unit, to a copy of both packets under `scratch/`, and every unit check printed its expected value. On that copy the nine template paths passed `test -e`, `validate_document.py` printed `VALID` with 0 issues for every edited Markdown file and both changelogs and `VALID` with 1 issue for the playbook root, hard-blocker counts did not rise (Obsidian `SKILL.md` fell from 49 to 44), the playbook package validator printed `violations=0 warnings=0`, router-sync legs 1a, 1b, 2 and 4 passed and the leaf manifest stayed `OK`. Leg 3 could not resolve route-gold from the copied location, so the builder reruns all five legs in place. The copies were then deleted.
- **Baselines in place, 2026-10-10**: router-sync `5/5` exit 0, compiled-route guard `sk-code fresh` with policy hash `a59ec9ff7f6a450ca96f1d81b4b3174930058e7fcb94babd4a077b8b058299e2`, leaf manifest `OK (fab6eb8691aa05ea57ffda56837e50fa191f3eb35275f8167202f24fe0b9cfb5)` and `checked=14 fresh=14 failed=0`, playbook package `PASS ... violations=0 warnings=0`, drift guards `Errors: 0`, `Warnings: 253`, all 3 guards PASSED, Hermes `PASS: 70 Hermes skill copies in sync`, Webflow fixtures `Failed:  4/4` (known-bad) and `Passed:  2/2` (known-good).
- **Diff shape**: each edited file is compared with a copy saved in `scratch/before/` during Phase 1, and the count of changed lines must match T049 exactly.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Research input: iterations 004, 005, 013 and 015 of `../../001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/`, read-only.
- Sibling children build in parallel. A sibling may change the drift-guard warning count or Hermes drift. The builder compares against its own Phase 1 capture, not against these planning numbers.
- Node.js and Python 3 as used by the existing gates. No network.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the nineteen modified tracked files with `git restore` on the paths in the spec.md Files to Change table, or copy them back from `scratch/before/`.
- Delete the two new changelog files `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.1.0.md` and `.skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.3.0.md`. Nothing else depends on them.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:limitations -->
## 8. KNOWN LIMITATIONS

- About sixty other link labels across the Webflow references still show old underscore file names over targets that resolve, for example `references/deployment/cdn-deployment.md:314` and `references/implementation/performance-patterns/budgets-and-anti-patterns.md:226`. `rg -n '\[[a-z]+_[a-z_]+\.md\]' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**'` lists them. Only the three in `common-commands.md` were requested, so the rest wait for a sweep of their own.
<!-- /ANCHOR:limitations -->
