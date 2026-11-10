---
title: "Implementation Plan: Phase 2: webflow-labels-and-playbook"
description: "Text-only repairs in the sk-code-webflow packet: 59 link labels that show an old underscore file name are relabelled with the target path they open, the playbook root gains a numbered overview heading, and the packet moves to 1.1.2.0 with one changelog entry. Every edit is one literal replacement proven by its own one-line check."
trigger_phrases:
  - "webflow labels and playbook plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: webflow-labels-and-playbook

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | None. Checks run through Node.js and Python 3 scripts already in the repository |
| **Storage** | None |
| **Testing** | `rg`, `validate_document.py`, `hvr_scan.py`, `validate-playbook-package.cjs`, `run-all-drift-guards.sh`, `test-minified-runtime.mjs` fixtures, `sync-skills-hermes.cjs --check`, `compiled-route-guard.cjs`, `generate-leaf-manifest.cjs --check` |

### Overview
Every change is a literal text replacement in a file under `.skilled/skills/sk-code/sk-code-webflow/`, listed one per task in `tasks.md` and one per unit in `scratch/dispatch-units.json`. The 59 old labels become the target path in backticks, the form round three used for the three labels in `common-commands.md`. The playbook root gains the `## 1. OVERVIEW` heading round three gave the Obsidian root. No link target, route, resource map or file path changes, so the routing gates return the verdicts they return today.
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
In-place text edits to documentation, each proven by a one-line check and then by the existing gates.

### Key Components
- **Link labels**: recheck on 2026-10-10, `rg -n '\[[a-z]+_[a-z_]+\.md\]' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**'` printed 59 rows in 23 files, the count Known Limitation 1 of round three recorded. The rows, sorted by file and line, are saved in `scratch/label-rows.txt`, and `scratch/label-files.txt` lists the 23 files plus `SKILL.md`. Every row holds exactly one old label, and every target resolved with `test -e` from the file's own folder. No earlier phase fixed any of them.
- **Playbook root**: `python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md` printed `INVALID`, `Total issues: 2`, the blocking `missing_required_section: overview` and the `document_type_fallback` warning, exit 1, as Known Limitation 4 recorded. The file has no frontmatter, its H1 is line 1 and its intro paragraph starts on line 3.
- **Version and changelog**: `SKILL.md` line 5 reads `version: 1.1.1.0`, the only version line in the packet outside `changelog/`. `changelog/` holds `v1.0.0.0.md`, `v1.1.0.0.md` and `v1.1.1.0.md`, so `v1.1.2.0.md` is free.
- **Unit builder**: `scratch/build-units.cjs` reads `scratch/label-rows.txt`, writes `scratch/dispatch-units.json` and the Phase 2 task text, and proves every old text occurs exactly once in its unedited file. With `--simulate` it applies every unit in order to a copy of the hub and runs each check there. It refuses to run once the changelog exists, so it is a planning tool only.
- **Check scripts** in `scratch/`, each run from the repository root: `check-labels.sh` walks `label-rows.txt` and prints `OK=<n> BAD=<n>` (`OK=0 BAD=59` before the build), `check-docs.sh` prints the validator verdict and hard-blocker count for each file in `label-files.txt`, and `check-units.cjs` reruns every unit check and prints `<n>/62 checks matched`.

### Decisions

| ID | Decision | Why |
|----|----------|-----|
| D1 | Each new label is the link's own target in backticks, `` [`<target>`](<target>) ``, with the target text unchanged | Round three decision D8 set this form for the three `common-commands.md` labels. A label equal to its target is skipped by the doc-claims label check (`verify_doc_claims.cjs`, `label !== target`), and the target is already checked as a link target |
| D2 | A unit's old text is the smallest unique span: the link alone when it occurs once in the file, else the whole line, else the line above plus the line | Ten labels share their link text with another label in the same file (two each in `state-and-cleanup.md`, `rules-and-root-cause.md`, `requirements-rules-and-checklist.md` and `condition-based-waiting.md`, and two identical lines in `scroll-interceptor-and-related.md`), so units T017, T018, T022, T023, T041, T043, T065, T066, T070 and T071 quote a whole line or two lines. A link-only span leaves the existing em dashes on lines such as `mime-troubleshooting-and-deployment.md:277` untouched, as round three decision D7 required |
| D3 | Each label check reads one line number, `sed -n '<line>p' <file> \| grep -cF -- '<new link>'`, expecting `1` | Single-line replacements keep every line number, and several new links repeat in one file, so a whole-file count would depend on unit order |
| D4 | The playbook root gets `## 1. OVERVIEW` above its intro paragraph, and the one `document_type_fallback` warning stays | Round three decision D5: the validator finds sections only through numbered H2 headings, and no type rule matches a playbook root, which `sk-doc` owns. The planning copy printed `VALID`, `Total issues: 1`, exit 0 |
| D5 | Patch bump 1.1.1.0 to 1.1.2.0 with a compact changelog | `sk-create-changelog` section 4 maps docs fixes and cleanup to `patch`. `v1.1.1.0` is already committed on this branch, so this phase cannot fold into it. The entry follows the template's compact shape, with an `&nbsp;` line before each H2 |

### Answers to the reasons round three gave

| Item | Round three reason | How this plan answers it |
|------|--------------------|--------------------------|
| 59 underscore labels | Only the three in `common-commands.md` were requested (`010-round-three-remediation/004-webflow-and-obsidian/plan.md` section 8, Known Limitation 1) | The operator now asks for every recorded residual, so all 59 are planned, one unit each |
| Webflow playbook root overview | Not in any finding of that child, and `validate-playbook-package.cjs` already passed (Known Limitation 4) | The operator now asks for it. The same heading that fixed the Obsidian root fixes this one, and REQ-004 keeps the package validator passing |

### Handoffs

| To | Item |
|----|------|
| Orchestrator | Regenerate the Hermes copies after every build (T075). Only `.hermes/skills/sk-code-webflow/` drifts from this phase |
| Orchestrator | The brief names the `SKILL.md` version as a routing input, so T076 re-mints the compiled sk-code route and its archive copy when the guard reports it stale. A planning probe on a hub copy with the bumped version still reported `"fresh":true`, so the re-mint may be a no-op |
| None | No fix needs a file another child owns |

### Data Flow
Readers reach these files through the hub router and each packet's `RESOURCE_MAP`. The router reads resource paths, not link labels, and the leaf manifest lists paths, not contents, so no route or manifest input changes except the version line. The new changelog sits under `changelog/`, which is not a leaf root.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Each Phase 2 edit or create is also a unit in `scratch/dispatch-units.json`, in the same order and with the same task id, and `node scratch/build-units.cjs` reproves that every old text occurs exactly once.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Planning probes, 2026-10-10**: all 62 units were applied in order to a copy of the sk-code hub under `scratch/`, each check run right after its unit, and `simulate: 62/62 checks matched`. On that copy the label search printed nothing (exit 1), the label loop printed `59 OK`, `verify_doc_claims.cjs --root <copy>` printed `doc-claims: 4/4 checks passed`, the playbook root printed `VALID` and `Total issues: 1`, the package validator printed `violations=0 warnings=0`, the 24 files in `scratch/label-files.txt` kept identical validator verdicts and hard-blocker counts, and the changelog printed `VALID` with 0 hard blockers. The diff of the packet showed 26 entries (25 changed files and the new changelog), 60 removed lines and 62 added lines. The copies were then deleted.
- **Baselines in place, 2026-10-10**: drift guards `run-all-drift-guards: all 4 guards PASSED`, exit 0. Package validator `PASS package=sk-code/sk-code-webflow ... violations=0 warnings=0`. Hermes `PASS: 70 Hermes skill copies in sync`. Fixtures `bad exit=1`, `good exit=0`. Route guard `sk-code fresh`. Leaf manifest `leaf-manifest.json OK (59ea33fd...)`. `git status --porcelain -- .skilled/skills/sk-code/sk-code-webflow` printed nothing.
- **Diff shape**: Phase 1 copies the packet to `scratch/before/`, and Phase 3 compares it with the edited packet.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Worked example: `../../010-round-three-remediation/004-webflow-and-obsidian/`, read-only.
- Sibling children build in parallel. Child 003 may edit the `shared/references/workflow-*.md` files that three Webflow symlinks point at, and child 005 may change the doc-claims guard. The builder compares against its own Phase 1 capture, not against these planning numbers.
- Node.js, Python 3 and `rg`. No network.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the 25 modified tracked files with `git restore` on the paths in the spec.md Files to Change table, or copy them back from `scratch/before/sk-code-webflow/`.
- Delete the new file `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md`. Nothing else depends on it.
<!-- /ANCHOR:rollback -->

---
