---
title: "Implementation Plan: Phase 5: doc-claims-hardening"
description: "Four in-place edits to verify_doc_claims.cjs close the gaps round three recorded: a usage error for a missing --root, a label check for path-shaped labels, anchor resolution by GitHub's heading slug, and a condition rule for loading bullets. Four new tests prove each one, the guardrails text loses its semicolons and the OpenCode packet goes to 1.2.1.0."
trigger_phrases:
  - "doc claims hardening plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: doc-claims-hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node.js CommonJS), Markdown |
| **Framework** | None. Node built-ins `fs`, `path`, `os`, `child_process`, `node:test` |
| **Storage** | None |
| **Testing** | `node --test verify_doc_claims.test.cjs`, the checker over `scratch/repro-fixture` and over the live hub, `run-all-drift-guards.sh`, `validate_document.py`, `hvr_scan.py`, doctor `parent-skill-check.cjs` |

### Overview
All five recorded gaps reproduce on the tree of 2026-10-10. This phase extends `verify_doc_claims.cjs` in place: `parseArgs` rejects a `--root` that is not a directory, a new `labelIsStale` helper checks path-shaped labels, three helpers resolve `#anchor` targets against headings and explicit anchors, and one line skips conditional loading bullets in the tier check. Tests go in first, so a negative-control run shows the four new cases failing on the unedited checker. The guardrails text, the scripts README row, the version and a changelog follow.

Every Phase 2 edit is one unit in `scratch/dispatch-units.json`, 21 units in tasks.md order, with its OLD text quoted exactly and its check. The planner applied all of them in order to a mirror of the hub on 2026-10-10. Every OLD text was unique when its turn came, every unit check printed its expected text, and the results are in section 5.
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
In-place extension of an existing read-only CLI guard, with test cases added to its existing `node:test` file.

### Key Components
- **Root check in `parseArgs`** (`verify_doc_claims.cjs:66-79`). The function computes the usage text once. After resolving the hub it prints `usage: verify_doc_claims [--root <hub dir>] [--checks paths,names,surfaces,tiers] (--root is not a directory: <path>)` to stderr and exits 2 when the path is missing or not a directory. Exit 2 is the code the script already uses for a bad `--checks` value (`:76`). The `--checks` error keeps its wording.
- **`labelIsStale(hub, doc, label, target)`**, a new helper after `listMarkdown` (`:145-148`). A `./` or `../` label keeps today's rule (`:177-178`). Any other path-shaped label passes when it is the tail of its existing in-hub target, or when it names a real file through `bases()` (`:126-133`), the doc's packet root (`packetRoot`, `:120-124`) or the doc's folder. Labels over external, absolute or out-of-hub targets, and labels that name other `.skilled/` skills, are skipped. The call at `:177-180` becomes one condition that calls it.
- **Anchor helpers** `headingSlug`, `anchorsOf` and `anchorMissing`, also after `listMarkdown`. `anchorsOf` reads a Markdown file once (cached), skips fenced code, slugs each ATX heading and adds `-1`, `-2` for repeats, and adds every `<a id>` or `<a name>` value. `anchorMissing` decodes percent escapes and compares as written and lowercased. Link targets (`:170-175`) check the anchor of any in-hub `.md` target, or of the doc itself for a bare `#anchor`. Backticked paths (`:182-187`) split off `#anchor` before the path test, so `x.md#a` is now file-checked, then anchor-checked.
- **Condition rule in `checkTiers`** (`:240-241`). A new constant `CONDITIONAL_WORDING = /\b(?:when|if|unless|only|matched)\b/i` sits after `TWO_SURFACE_WORDING` (`:43`). A non-ALWAYS bullet whose text matches it is skipped before its files and globs are read. The ALWAYS row is never skipped.
- **Tests** (`scripts/tests/verify_doc_claims.test.cjs`). Four cases inserted before the tiers test (`:120`): missing `--root`, a stale packet-relative label, dead anchors (link, backticked and same-file), and a conditional bullet with a glob and a file. Each builds its own throwaway hub, as the existing six do.
- **Reproduction fixture** (`scratch/repro-fixture/`, written by the planner). A seven-file hub whose `doc.md` carries one stale label (line 3), one dead link anchor (line 4), one dead backticked anchor (line 5) and one clean line (line 6), and whose `ROUTER.md:13` is a conditional glob bullet. The `-fixture` suffix keeps it out of the alignment-drift walk.

### Data Flow
The checker walks the hub's `.md` and `.json` files and runs each selected check. The paths check now also reads label text and anchor fragments, opening a target file only when the file part already resolved. The tier check drops conditional bullets before expanding their paths. Output format and exit codes 0, 1 and 2 are unchanged, apart from the new exit-2 case.

### Decisions

| ID | Decision | Why |
|----|----------|-----|
| D1 | Anchors use GitHub's heading slug: lowercase, drop every character that is not a letter, number, underscore, space or hyphen, then replace each space with a hyphen, no collapsing | No repo link validator resolves anchors. `check-markdown-links.cjs:143-150`, `check-repo-rules.cjs:179`, `validate-command-references.cjs:81` and `check_readme_references.py:89` all drop the fragment. The only repo rule about anchor shape, `validate_document.py:498` ("Double-dash anchors required for GitHub compatibility"), assumes this slug. Emoji are dropped, so `## 7. 🐛 COMMON ISSUES` gives `7--common-issues` |
| D2 | A path-shaped label that is the tail of its existing target passes | The recorded case is a short label over a `../sk-code-opencode/...` target. A tail label names the real file in another packet, so only a label that names no real file is stale |
| D3 | The condition words are `when`, `if`, `unless`, `only` and `matched`, and they apply to both files and globs | The brief asks to extend "the conditional-bullet rule round three added for files". Round three added no file rule. Its rule (`verify_doc_claims.cjs:246-248`) exempts bare folders outside the ALWAYS row, and files and globs both still count (Known Limitation 1). The live `ROUTER.md` bullets at `:605-607` state their condition with `matched`, `only` and `when`, and the one every-route bullet at `:604` uses none of the words |
| D4 | The tests are added before the checker edits, and a negative-control run records `fail 4` | Proves each case fails for the gap it names, as round three did for its router-sync tests |
| D5 | Version 1.2.0.0 to 1.2.1.0 | Bug fixes and tightened checks are a patch bump (`sk-create-changelog/SKILL.md:159`). The branch is unmerged, and each round takes a new version, per the shared decision |
| D6 | The guardrails semicolons become sentence breaks, and no word changes | Round three left them because "they were verbatim in the shared docs and are left as a faithful move" (Known Limitation 5). The operator chose to fix every residual. A full stop keeps each clause and its meaning, so the move stays faithful in content |
| D7 | `assets/scripts/README.md:77` gains "including path-shaped link labels and `#anchor` targets", and `SKILL.md:175` is not reworded | The README row is the checker's usage reference. `SKILL.md:175` says "path references resolve", which stays true, and any reword there would add to its 25 voice-scan hard blockers |

### Reasons recorded by round three, and the answer here
- Known Limitations 1 to 4 carry no reason for the omission. They were found in review and left for a later round.
- Known Limitation 5 gave a reason, answered in D6.

### Handoffs

The stricter checker, applied to a mirror with every unit in place (`scratch/plan-doc-claims-after.txt`), reports eight hits, none under `sk-code-opencode/`. Each is a true hit. The orchestrator moves these exact edits to their owners before builds start.

| Owner | File:line | Find | Replace with |
|-------|-----------|------|--------------|
| 004 | `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:51` | `[javascript/style-guide.md](` | `[javascript/style-guide/overview-naming-and-structure.md](` |
| 004 | same file `:52` | `[javascript/quality-standards.md](` | `[javascript/quality-standards/init-dom-error-and-async.md](` |
| 004 | same file `:54` | `[css/quality-standards.md](` | `[css/quality-standards/patterns-and-naming-enforcement.md](` |
| 004 | `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md:123` | `[javascript/style-guide.md](` | `[javascript/style-guide/overview-naming-and-structure.md](` |
| 004 | same file `:124` | `[javascript/quality-standards.md](` | `[javascript/quality-standards/init-dom-error-and-async.md](` |
| 004 | same file `:126` | `[css/quality-standards.md](` | `[css/quality-standards/patterns-and-naming-enforcement.md](` |
| 002 | `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/systematic-four-phases.md:33` | `[animation_workflows.md Section 7](../../implementation/animation-workflows/overview-decision-tree-and-css.md#7-🐛-common-issues-and-solutions)` | `[testing-and-common-issues.md Section 3](../../implementation/animation-workflows/testing-and-common-issues.md#3-common-issues-and-solutions)` |
| 002 | same file `:34` | `#3-📚-collection-list-patterns)` | `#3-collection-list-patterns)` |

The label targets exist: each new label is the tail of its own link target. `testing-and-common-issues.md:308` is `## 3. COMMON ISSUES AND SOLUTIONS` and `overview-limits-and-collection-lists.md:86` is `## 3. COLLECTION LIST PATTERNS`. Child 002 may already change the label text on line 33 for its underscore-label work. The target and anchor above are what must land.

Other handoffs:
- **002**: any path-shaped label it writes over a link must be the tail of that link's target, or a file in the doc's own packet, or the checker reports it (D2).
- **004**: any path-shaped label it writes in the quality packet follows the same rule.
- **Orchestrator**: regenerate Hermes after all builds (`SKILL.md` version changes the `sk-code-opencode` copy). Rerun the checker over the whole tree after 002 and 004 land and route any line in `scratch/hits-for-orchestrator.txt` that is still printed.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Planner dry run, 2026-10-10.** `scratch/build_units.py --apply` applied all 20 edit and create units in order to a copy of `.skilled/skills/sk-code`, and every OLD text was unique when applied. `scratch/check-units.cjs` on the live tree printed `units 21, edit units 19, problems 0`. Every unit check printed its expected text on the mirror and did not on the live tree.
- **Negative control.** The new test file against the unedited checker: `tests 10`, `pass 6`, `fail 4`, the four failures being the four new cases (`scratch/plan-neg-test.txt`). Against the edited checker: `pass 10`, `fail 0` (`scratch/plan-pos-test.txt`).
- **Reproduction fixture.** Unedited checker over `scratch/repro-fixture`: `PASS check paths`, `FAIL check tiers` with `ROUTER.md:13: claims shared/references/extra/gamma.md loads on every route`, `doc-claims: 3/4 checks passed`, exit 1. Edited checker: `FAIL check paths` with exactly the `doc.md:3`, `doc.md:4` and `doc.md:5` lines, `PASS check tiers`, `doc-claims: 3/4 checks passed`, exit 1.
- **Live hub.** Edited checker over the mirror: eight hits, all in the Handoffs table, none under `sk-code-opencode/`. `--root /nonexistent-dir` printed the usage line and exited 2.
- **Markdown.** `validate_document.py` returned `VALID`, `Total issues: 0` for `workflow-guardrails.md`, `assets/scripts/README.md`, `SKILL.md` and the new changelog, before and after. `hvr_scan.py` hard blockers: guardrails 4 to 0, README 0 to 0, `SKILL.md` 25 to 25, changelog 0. Doctor `parent-skill-check.cjs` on the mirror: `PASS: 13d-packet-version` and `OK: parent-skill-check`.
- **Interim state.** Until the 002 and 004 handoffs land, the checker and the umbrella exit 1 on doc-claims for the eight lines above. The builder records them in `scratch/hits-for-orchestrator.txt`. That is not a failure of this phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node.js (v26.8.2 observed) and Python 3 for `validate_document.py` and `hvr_scan.py`.
- Baselines at plan time, 2026-10-10: the checker over the live hub `doc-claims: 4/4 checks passed`, exit 0. Its test `pass 6`, `fail 0`. The umbrella printed four `PASS:` lines and `run-all-drift-guards: all 4 guards PASSED`. Doctor sk-code `PASS: 13d-packet-version` and `OK: parent-skill-check`. Hermes `--check` `PASS: 70 Hermes skill copies in sync`. Leaf manifest `leaf-manifest.json OK (59ea33fd766514d568f793234145be7aa5ae90d9482669cf383eb3c6f237b441)`.
- Sibling builds run in parallel and may move any of these before the builder's Phase 1. The builder records what prints.
- No compiled-route re-mint: the route hash reads only the hub `SKILL.md`, `hub-router.json` and `mode-registry.json`, which this phase does not edit. No leaf-manifest change: the new changelog and the test file are not leaves.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the five modified files with `git restore` on their paths from `spec.md` Files to Change.
- Delete `.skilled/skills/sk-code/sk-code-opencode/changelog/v1.2.1.0.md`. No other file depends on it.
<!-- /ANCHOR:rollback -->

---
