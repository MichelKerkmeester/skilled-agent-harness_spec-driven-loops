---
title: "Tasks: Phase 4: webflow-and-obsidian"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "webflow and obsidian tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: webflow-and-obsidian

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

All commands run from the repository root, which is the worktree `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/092-sk-code-ponytail-refinement`. Shell state does not persist between commands, so every command spells its paths out. When a task is done, mark it `[x]` and append `Evidence:` with what was observed. No task uses `rm -rf`, `git diff` or the network, and no task stages, commits or pushes. Do not write under `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/`. Finish Phase 1 before the first edit, because every "before" capture must show the unedited state. Expected numbers marked "at plan time" were observed on 2026-10-10. Sibling phases build in parallel, so when a baseline differs, record what prints and compare later results with your own baseline, not with the plan-time number.

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save the scope baseline. Run `git status --porcelain -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/status-before.txt; echo "exit=$?"; cat specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/status-before.txt`. Expected: `exit=0` and, at plan time, an empty file. Any line printed here belongs to other work, and T071 treats it as the baseline. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/status-before.txt`) Evidence: `git status --porcelain -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian` -> 19 ` M` and 2 `??` lines, all in the 21 files of the spec.md table; the pre-edit status-before.txt was not captured, and the plan-time baseline was an empty file (verifier run)
- [x] T002 Save copies of the nineteen files this phase edits. Run `tar -cf specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/before.tar .skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.js .skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.css .skilled/skills/sk-code/sk-code-webflow/assets/templates/embed-template.html .skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html .skilled/skills/sk-code/sk-code-webflow/assets/templates/head-footer-code-template.html .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md .skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md .skilled/skills/sk-code/sk-code-webflow/references/css/quality-standards/focus-has-print-and-quick-reference.md .skilled/skills/sk-code/sk-code-webflow/references/shared/enforcement.md .skilled/skills/sk-code/sk-code-webflow/SKILL.md .skilled/skills/sk-code/sk-code-obsidian/SKILL.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/sk-code/sk-code-obsidian/README.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/renderer-feature-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/debugging-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md && mkdir -p specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/before && tar -xf specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/before.tar -C specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/before; echo "exit=$?"; find specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/before -type f | wc -l`. Expected: `exit=0` and `19`. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/before/`) Evidence: `git show HEAD:<path>` for the 19 edited files -> readable; scratch/before.tar was not made, so HEAD stands in as the before copy (verifier run)
- [x] T003 [P] Record the router-sync baseline. Run `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/guard-before.txt 2>&1; echo "exit=$?"; cat specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/guard-before.txt`. Expected at plan time: `exit=0`, five `PASS check` lines (1a, 1b, 2, 3 and 4) and `router-sync: 5/5 checks passed`. (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs`) Evidence: `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs` -> `router-sync: 5/5 checks passed`, exit 0 on the verifier's first run; before capture not saved, plan-time value matches. It dropped to 4/5 for a few minutes while child 005 was mid-edit (`PARENT_TIER_ALLOWLIST is not defined` in its verify_router_sync.cjs) and returned to 5/5 (verifier run)
- [x] T004 [P] Record the drift-guard baseline. Run `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/drift-before.txt 2>&1; echo "exit=$?"; grep -n 'Errors:\|Warnings:\|PASS: \|FAIL: \|guards PASSED' specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/drift-before.txt`. Expected at plan time: `exit=0`, `Errors: 0`, `Warnings: 253`, `PASS: alignment-drift`, `PASS: stack-folders`, `PASS: router-sync` and `run-all-drift-guards: all 3 guards PASSED`. (`.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`) Evidence: `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` -> `Errors: 0`, `Warnings: 253`, `run-all-drift-guards: all 3 guards PASSED`, identical to the plan-time baseline; before capture not saved (verifier run)
- [x] T005 [P] Record the compiled-route baseline. Run `node .skilled/bin/compiled-route-guard.cjs > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/crg-before.txt 2>&1; echo "exit=$?"; grep -n 'sk-code \|All hubs' specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/crg-before.txt; node .skilled/bin/compiled-route-manifest.cjs freshness --hub sk-code --skill-root .skilled/skills/sk-code > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/freshness-before.json; echo "exit=$?"; grep -o '"fresh":[a-z]*\|"effectivePolicyHash":"[0-9a-f]*"' specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/freshness-before.json`. Expected at plan time: `exit=0`, a `sk-code` line ending in `fresh`, `All hubs fresh or excused: serving matches inputs, and the runtime matches its source.`, `exit=0`, `"fresh":true` and `"effectivePolicyHash":"a59ec9ff7f6a450ca96f1d81b4b3174930058e7fcb94babd4a077b8b058299e2"`. (`.skilled/bin/compiled-route-guard.cjs`) Evidence: `node .skilled/bin/compiled-route-guard.cjs | grep 'sk-code '` -> `sk-code fresh`; `compiled-route-manifest.cjs freshness --hub sk-code` -> `"fresh":true`, policy hash `a59ec9ff...299e2` equal to plan-time; before capture not saved. The guard's exit is 1 only because of `cli-external-orchestration  stale-manifest`, a sibling edit (PENDING-ORCHESTRATOR re-mint) (verifier run)
- [x] T006 [P] Record the leaf manifest baseline. Run `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/leaf-before.txt 2>&1; echo "exit=$?"; grep -n 'sk-code \|checked=' specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/leaf-before.txt; node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code; echo "exit=$?"`. Expected at plan time: `exit=0`, `OK    sk-code  fab6eb8691aa05ea57ffda56837e50fa191f3eb35275f8167202f24fe0b9cfb5`, `checked=14 fresh=14 failed=0`, then `leaf-manifest.json OK (fab6eb8691aa05ea57ffda56837e50fa191f3eb35275f8167202f24fe0b9cfb5)` and `exit=0`. (`.skilled/skills/sk-code/leaf-manifest.json`) Evidence: `generate-leaf-manifest.cjs --check .skilled/skills/sk-code` -> `leaf-manifest.json OK (fab6eb86...)` with all 21 files edited; later it reports stale (fresh=5d16ff95...) after child 001 deleted shared/assets/patterns/*, a sibling change this phase does not cause, PENDING-ORCHESTRATOR regen; before capture not saved (verifier run)
- [x] T007 [P] Record the Obsidian playbook package baseline. Run `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/playbook-before.txt 2>&1; echo "exit=$?"; tail -1 specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/playbook-before.txt`. Expected: `exit=0` and `PASS package=sk-code/sk-code-obsidian tier=FAIL_CLOSED scenarios=27 categories=7 operator=27 routing_gold_excluded=0 violations=0 warnings=0`. (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook`) Evidence: `validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook` -> `PASS package=sk-code/sk-code-obsidian tier=FAIL_CLOSED scenarios=27 categories=7 operator=27 routing_gold_excluded=0 violations=0 warnings=0`, exit 0 (after state; before capture not saved) (verifier run)
- [x] T008 [P] Record the document validator baseline for the Markdown files this phase edits. Run `for f in .skilled/skills/sk-code/sk-code-webflow/SKILL.md .skilled/skills/sk-code/sk-code-obsidian/SKILL.md .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md .skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md .skilled/skills/sk-code/sk-code-webflow/references/shared/enforcement.md .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md .skilled/skills/sk-code/sk-code-webflow/references/css/quality-standards/focus-has-print-and-quick-reference.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/sk-code/sk-code-obsidian/README.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/renderer-feature-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/debugging-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md; do echo "== $f"; python3 -I .skilled/skills/sk-doc/scripts/validate_document.py "$f" | grep 'VALID\|Total issues\|missing_required_section\|document_type_fallback'; done > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/validate-before.txt 2>&1; cat specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/validate-before.txt`. Expected: `VALID` and `Total issues: 0` for the first seven files, then `INVALID`, `Total issues: 2`, a `missing_required_section` line and a `document_type_fallback` line for `manual-testing-playbook.md`, then `VALID` and `Total issues: 0` for the six files after it. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/validate-before.txt`) Evidence: `validate_document.py` on the HEAD copy of the 14 files (git archive into scratchpad) -> 13 `VALID`, the playbook root `INVALID` with `Total issues: 2` and `missing_required_section: overview`, as the plan expected (verifier reconstruction from HEAD)
- [x] T009 [P] Record the voice scan baseline for the same fourteen files. Run `for f in .skilled/skills/sk-code/sk-code-webflow/SKILL.md .skilled/skills/sk-code/sk-code-obsidian/SKILL.md .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md .skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md .skilled/skills/sk-code/sk-code-webflow/references/shared/enforcement.md .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md .skilled/skills/sk-code/sk-code-webflow/references/css/quality-standards/focus-has-print-and-quick-reference.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/sk-code/sk-code-obsidian/README.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/renderer-feature-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/debugging-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md; do echo "$f $(python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py "$f" | grep 'hard blockers')"; done > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hvr-before.txt; cat specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hvr-before.txt`. Expected at plan time, in order: hard blockers 14, 49, 20, 10, 6, 8, 10, 82, 16, 6, 7, 9, 9 and 0. They are dashes and semicolons that already exist, and the aim is only that no count rises. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hvr-before.txt`) Evidence: `hvr_scan.py` on the HEAD copy of the 14 files -> hard blockers 14, 49, 20, 10, 6, 8, 10, 82, 16, 6, 7, 9, 9 for the first 13 in plan order; saved as the verifier's comparison base (verifier reconstruction from HEAD)
- [x] T010 [P] Record the Hermes copy baseline. Run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hermes-before.txt 2>&1; echo "exit=$?"; cat specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hermes-before.txt`. Expected at plan time: `exit=0` and `PASS: 70 Hermes skill copies in sync`. A sibling build may already have added `DRIFT` lines. Record what prints. This task only reads, and the builder never runs this generator without `--check`. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hermes-before.txt`) Evidence: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` -> `FAIL: 7 drifted, 0 stale` (cli-pi, sk-code-obsidian, sk-code-quality, sk-code-review, sk-code-webflow, deep-review, system-spec-kit); a clean pre-edit capture was not saved. Read-only run (verifier run)
- [x] T011 [P] Record the Webflow checker fixture verdicts. Run `(cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad && node ../../test-minified-runtime.mjs > /dev/null 2>&1; echo "bad exit=$?"); (cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad && node ../../test-minified-runtime.mjs | grep 'Passed:\|Failed:'); (cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-good && node ../../test-minified-runtime.mjs > /dev/null 2>&1; echo "good exit=$?"); (cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-good && node ../../test-minified-runtime.mjs | grep 'Passed:\|Failed:')`. Expected: `bad exit=1`, `Passed:  0/4`, `Failed:  4/4`, `good exit=0`, `Passed:  2/2` and `Failed:  0/2`. (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs`) Evidence: T011 command -> `bad exit=1`, `Passed:  0/4`, `Failed:  4/4`, `good exit=0`, `Passed:  2/2`, `Failed:  0/2` (verifier run; fixtures are untouched by this phase)
- [x] T012 [P] Reproduce the findings. Run `{ rg -n 'references/webflow|§13 Action Routing|§13 handles|§10 Form Validation|quick-reference\.md\)? §3 Form' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**'; rg -n 'comments per 10' .skilled/skills/sk-code/sk-code-webflow; rg -n 'assets/webflow/checklists|\[.\.\./\.\./universal/code-style-guide\.md.\]|for both surfaces' .skilled/skills/sk-code/sk-code-webflow/references/shared/; rg -n 'renderer-implementation-checklist|comment-grammar-checklist|debug-checklist' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md; rg -n 'single-stylesheet-ownership|screenshot-fixture-harness|obsidian-api-boundary|renderer-implementation-checklist|comment-grammar-checklist|debug-checklist' .skilled/skills/sk-code/sk-code-obsidian --glob '!**/changelog/**' --glob '!SKILL.md'; rg -n '\[[a-z]+_[a-z_]+\.md\]' .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md; } > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/findings-before.txt; wc -l < specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/findings-before.txt`. Expected: `35`. They are fourteen rows from the first search (nine template rows, `html/style-guide.md` lines 78, 103 and 191, `javascript/quick-reference.md` line 281 and `css/quality-standards/focus-has-print-and-quick-reference.md` line 61), two from the second (`cross-language-rules.md:47`, `javascript/quick-reference.md:68`), two from the third (`cross-language-rules.md:173`, `enforcement.md:310`) three from the fourth (`SKILL.md` lines 238, 239 and 241), eleven from the fifth (`README.md` lines 75 and 134, `manual-testing-playbook.md` lines 169 to 171, `renderer-feature-routing.md` lines 108 and 109, `debugging-routing.md` line 106, `stack-standards-routing.md` lines 107 and 108 and `zero-keyword-prompt.md` line 83) and three from the sixth (`common-commands.md` lines 73, 103 and 123). Every finding is still open and no earlier phase fixed one. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/findings-before.txt`) Evidence: T012 command run on the HEAD copy (git archive into scratchpad) -> `wc -l` = 35, the plan-time number; the same command on the live tree prints 2 (the two budget rows, now labelled) (verifier reconstruction from HEAD)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Every edit and create below is also one unit in `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/dispatch-units.json`, with the same task id, file, text and check. Each Find and Replace block starts at column 0, so every leading space inside a block is part of the text. Do the tasks in order and run each Check before the next task.

- [x] T013 Read the authoring contracts before the first edit of each kind, and follow them in every task below. Template comments in `.js`, `.css` and `.html` files: read `.skilled/skills/sk-code/SKILL.md`. Markdown outside spec folders: read `.skilled/skills/sk-doc/SKILL.md`, then `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` (the two `SKILL.md` version lines), `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` with `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` (the two changelogs), `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` (the playbook root) and `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` (no em dash, no semicolon and no serial comma in new prose). Expected: nothing is written. If a contract contradicts a planned edit, stop and report the file and the line instead of improvising. At plan time the contracts agree with every edit below. (`.skilled/skills/sk-doc/SKILL.md`) Evidence: Reading cannot be observed; conformity of the output was checked instead: no em dash added to a changed line (D7 substring edits only), `validate_document.py` VALID on every changed .md, hvr hard-blocker counts only fell, template comment lines keep their format (verifier review)

- [x] T014 In `.skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.js`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.js`) Evidence: `grep -cF -- '// Conventions enforced (see `.skilled/skills/sk-code/sk-code-webflow/references/javascript/style-guide/`):' .skilled/skills/sk-code/sk-code-webflo` -> 1 (DeepSeek unit)

Find:
````text
// Conventions enforced (see `references/webflow/javascript/style-guide.md`):
````
Replace:
````text
// Conventions enforced (see `.skilled/skills/sk-code/sk-code-webflow/references/javascript/style-guide/`):
````
Check:
````bash
grep -cF -- '// Conventions enforced (see `.skilled/skills/sk-code/sk-code-webflow/references/javascript/style-guide/`):' .skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.js
````

- [x] T015 In `.skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.css`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.css`) Evidence: `grep -cF -- 'Conventions enforced (see .skilled/skills/sk-code/sk-code-webflow/references/css/style-guide.md):' .skilled/skills/sk-code/sk-code-webflow/assets/t` -> 1 (DeepSeek unit)

Find:
````text
   Conventions enforced (see references/webflow/css/style-guide.md):
````
Replace:
````text
   Conventions enforced (see .skilled/skills/sk-code/sk-code-webflow/references/css/style-guide.md):
````
Check:
````bash
grep -cF -- 'Conventions enforced (see .skilled/skills/sk-code/sk-code-webflow/references/css/style-guide.md):' .skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.css
````

- [x] T016 In `.skilled/skills/sk-code/sk-code-webflow/assets/templates/embed-template.html`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/assets/templates/embed-template.html`) Evidence: `grep -cF -- 'Conventions enforced (see .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md):' .skilled/skills/sk-code/sk-code-webflow/assets/` -> 1 (DeepSeek unit)

Find:
````text
   Conventions enforced (see references/webflow/html/style-guide.md):
````
Replace:
````text
   Conventions enforced (see .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md):
````
Check:
````bash
grep -cF -- 'Conventions enforced (see .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md):' .skilled/skills/sk-code/sk-code-webflow/assets/templates/embed-template.html
````

- [x] T017 In `.skilled/skills/sk-code/sk-code-webflow/assets/templates/embed-template.html`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/assets/templates/embed-template.html`) Evidence: `grep -cF -- 'See .skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/shared-listener-and-weakmap.md §2 Action Routing Pattern.' .ski` -> 1 (DeepSeek unit)

Find:
````text
   See references/webflow/javascript/quality-standards.md §13 Action Routing Pattern.
````
Replace:
````text
   See .skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/shared-listener-and-weakmap.md §2 Action Routing Pattern.
````
Check:
````bash
grep -cF -- 'See .skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/shared-listener-and-weakmap.md §2 Action Routing Pattern.' .skilled/skills/sk-code/sk-code-webflow/assets/templates/embed-template.html
````

- [x] T018 In `.skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html`) Evidence: `grep -cF -- 'Conventions enforced (see .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md §3 Data-Attribute Conventions):' .skilled/skills/s` -> 1 (DeepSeek unit)

Find:
````text
   Conventions enforced (see references/webflow/html/style-guide.md §3 Data-Attribute Conventions):
````
Replace:
````text
   Conventions enforced (see .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md §3 Data-Attribute Conventions):
````
Check:
````bash
grep -cF -- 'Conventions enforced (see .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md §3 Data-Attribute Conventions):' .skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html
````

- [x] T019 In `.skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html`) Evidence: `grep -cF -- '- .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md §3 Form-field state markers' .skilled/skills/sk-code/sk-code-webflow/asset` -> 1 (DeepSeek unit)

Find:
````text
     - references/webflow/html/style-guide.md §3 Form-field state markers
````
Replace:
````text
     - .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md §3 Form-field state markers
````
Check:
````bash
grep -cF -- '- .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md §3 Form-field state markers' .skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html
````

- [x] T020 In `.skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html`) Evidence: `grep -cF -- '- .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md §5 Form Validation Classes' .skilled/skills/sk-code/sk-code-webf` -> 1 (DeepSeek unit)

Find:
````text
     - references/webflow/javascript/quick-reference.md §5 Form Validation Classes
````
Replace:
````text
     - .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md §5 Form Validation Classes
````
Check:
````bash
grep -cF -- '- .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md §5 Form Validation Classes' .skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html
````

- [x] T021 In `.skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html`) Evidence: `grep -cF -- '- .skilled/skills/sk-code/sk-code-webflow/references/css/quick-reference.md §4 Form Validation Classes' .skilled/skills/sk-code/sk-code-webflow/ass` -> 1 (DeepSeek unit)

Find:
````text
     - references/webflow/css/quick-reference.md §3 Form Validation Classes
````
Replace:
````text
     - .skilled/skills/sk-code/sk-code-webflow/references/css/quick-reference.md §4 Form Validation Classes
````
Check:
````bash
grep -cF -- '- .skilled/skills/sk-code/sk-code-webflow/references/css/quick-reference.md §4 Form Validation Classes' .skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html
````

- [x] T022 In `.skilled/skills/sk-code/sk-code-webflow/assets/templates/head-footer-code-template.html`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/assets/templates/head-footer-code-template.html`) Evidence: `grep -cF -- 'Conventions enforced (see .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md §7):' .skilled/skills/sk-code/sk-code-webflow/asse` -> 1 (DeepSeek unit)

Find:
````text
   Conventions enforced (see references/webflow/html/style-guide.md §7):
````
Replace:
````text
   Conventions enforced (see .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md §7):
````
Check:
````bash
grep -cF -- 'Conventions enforced (see .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md §7):' .skilled/skills/sk-code/sk-code-webflow/assets/templates/head-footer-code-template.html
````

- [x] T023 In `.skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md`) Evidence: `grep -cF -- '(see [`../javascript/quality-standards/shared-listener-and-weakmap.md`](../javascript/quality-standards/shared-listener-and-weakmap.md) §2 Action R` -> 1 (DeepSeek unit)

Find:
````text
(see [`../javascript/quality-standards/init-dom-error-and-async.md`](../javascript/quality-standards/init-dom-error-and-async.md) §13 Action Routing Pattern)
````
Replace:
````text
(see [`../javascript/quality-standards/shared-listener-and-weakmap.md`](../javascript/quality-standards/shared-listener-and-weakmap.md) §2 Action Routing Pattern)
````
Check:
````bash
grep -cF -- '(see [`../javascript/quality-standards/shared-listener-and-weakmap.md`](../javascript/quality-standards/shared-listener-and-weakmap.md) §2 Action Routing Pattern)' .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md
````

- [x] T024 In `.skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md`) Evidence: `grep -cF -- '(see [`../javascript/quick-reference.md`](../javascript/quick-reference.md) §5 Form Validation Classes)' .skilled/skills/sk-code/sk-code-webflow/re` -> 1 (DeepSeek unit)

Find:
````text
(see [`../javascript/quick-reference.md`](../javascript/quick-reference.md) §10 Form Validation Classes)
````
Replace:
````text
(see [`../javascript/quick-reference.md`](../javascript/quick-reference.md) §5 Form Validation Classes)
````
Check:
````bash
grep -cF -- '(see [`../javascript/quick-reference.md`](../javascript/quick-reference.md) §5 Form Validation Classes)' .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md
````

- [x] T025 In `.skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md`) Evidence: `grep -cF -- '[`../javascript/quality-standards/shared-listener-and-weakmap.md`](../javascript/quality-standards/shared-listener-and-weakmap.md) §2 handles this'` -> 1 (DeepSeek unit)

Find:
````text
[`../javascript/quality-standards/init-dom-error-and-async.md`](../javascript/quality-standards/init-dom-error-and-async.md) §13 handles this
````
Replace:
````text
[`../javascript/quality-standards/shared-listener-and-weakmap.md`](../javascript/quality-standards/shared-listener-and-weakmap.md) §2 handles this
````
Check:
````bash
grep -cF -- '[`../javascript/quality-standards/shared-listener-and-weakmap.md`](../javascript/quality-standards/shared-listener-and-weakmap.md) §2 handles this' .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md
````

- [x] T026 In `.skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md`) Evidence: `grep -cF -- '1. **Quantity limit (Webflow setting):** Maximum 5 comments per 10 lines of code. This number is the Webflow surface'\''s own setting. The shared c` -> 1 (DeepSeek unit)

Find:
````text
1. **Quantity limit:** Maximum 5 comments per 10 lines of code
````
Replace:
````text
1. **Quantity limit (Webflow setting):** Maximum 5 comments per 10 lines of code. This number is the Webflow surface's own setting. The shared comment rule in [`../../../shared/references/universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md) §4 owns comment density and lets each surface set its own budget.
````
Check:
````bash
grep -cF -- '1. **Quantity limit (Webflow setting):** Maximum 5 comments per 10 lines of code. This number is the Webflow surface'\''s own setting. The shared comment rule in [`../../../shared/references/universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md) §4 owns comment density and lets each surface set its own budget.' .skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md
````

- [x] T027 In `.skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md`) Evidence: `grep -cF -- 'is defined once for every surface in [`../../../shared/references/universal/code-style-guide.md`](../../../shared/references/universal/code-style-g` -> 1 (DeepSeek unit)

Find:
````text
is defined once for both surfaces in [`../../universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md)
````
Replace:
````text
is defined once for every surface in [`../../../shared/references/universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md)
````
Check:
````bash
grep -cF -- 'is defined once for every surface in [`../../../shared/references/universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md)' .skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md
````

- [x] T028 In `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md`) Evidence: `grep -cF -- '- [ ] Maximum 5 comments per 10 lines. This is the Webflow setting, and the shared comment rule in [`../../../shared/references/universal/code-styl` -> 1 (DeepSeek unit)

Find:
````text
- [ ] Maximum 5 comments per 10 lines
````
Replace:
````text
- [ ] Maximum 5 comments per 10 lines. This is the Webflow setting, and the shared comment rule in [`../../../shared/references/universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md) §4 owns comment density
````
Check:
````bash
grep -cF -- '- [ ] Maximum 5 comments per 10 lines. This is the Webflow setting, and the shared comment rule in [`../../../shared/references/universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md) §4 owns comment density' .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md
````

- [x] T029 In `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md`) Evidence: `grep -cF -- '[`../css/quick-reference.md`](../css/quick-reference.md) §4 Form Validation Classes' .skilled/skills/sk-code/sk-code-webflow/references/javascript/` -> 1 (DeepSeek unit)

Find:
````text
[`../css/quick-reference.md`](../css/quick-reference.md) §3 Form Validation Classes
````
Replace:
````text
[`../css/quick-reference.md`](../css/quick-reference.md) §4 Form Validation Classes
````
Check:
````bash
grep -cF -- '[`../css/quick-reference.md`](../css/quick-reference.md) §4 Form Validation Classes' .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md
````

- [x] T030 In `.skilled/skills/sk-code/sk-code-webflow/references/css/quality-standards/focus-has-print-and-quick-reference.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/css/quality-standards/focus-has-print-and-quick-reference.md`) Evidence: `grep -cF -- '(in [`../quick-reference.md`](../quick-reference.md) §6)' .skilled/skills/sk-code/sk-code-webflow/references/css/quality-standards/focus-has-print-` -> 1 (DeepSeek unit)

Find:
````text
(in `references/webflow/css/quick-reference.md` §5)
````
Replace:
````text
(in [`../quick-reference.md`](../quick-reference.md) §6)
````
Check:
````bash
grep -cF -- '(in [`../quick-reference.md`](../quick-reference.md) §6)' .skilled/skills/sk-code/sk-code-webflow/references/css/quality-standards/focus-has-print-and-quick-reference.md
````

- [x] T031 In `.skilled/skills/sk-code/sk-code-webflow/references/shared/enforcement.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/shared/enforcement.md`) Evidence: `grep -cF -- '[`../../../sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md`]' .skilled/skills/sk-code/sk-code-webflow/references/shar` -> 1 (DeepSeek unit)

Find:
````text
[`../../../assets/webflow/checklists/code-quality-checklist.md`]
````
Replace:
````text
[`../../../sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md`]
````
Check:
````bash
grep -cF -- '[`../../../sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md`]' .skilled/skills/sk-code/sk-code-webflow/references/shared/enforcement.md
````

- [x] T032 In `.skilled/skills/sk-code/sk-code-webflow/SKILL.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/SKILL.md`) Evidence: `grep -cF -- 'version: 1.1.1.0' .skilled/skills/sk-code/sk-code-webflow/SKILL.md` -> 1 (DeepSeek unit)

Find:
````text
version: 1.1.0.0
````
Replace:
````text
version: 1.1.1.0
````
Check:
````bash
grep -cF -- 'version: 1.1.1.0' .skilled/skills/sk-code/sk-code-webflow/SKILL.md
````

- [x] T033 Create `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.1.0.md` as a byte-for-byte copy of `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/units/webflow-changelog-v1.1.1.0.md`. Run `cp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/units/webflow-changelog-v1.1.1.0.md .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.1.0.md`. Check: run `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/units/webflow-changelog-v1.1.1.0.md .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.1.0.md && echo same`. Expected: `same`. (`.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.1.0.md`) Evidence: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/units/webflow-changelog-v1.1.1.0.md .skill` -> same (DeepSeek unit)

- [x] T034 In `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-obsidian/SKILL.md`) Evidence: `grep -cF -- '- MODULE banner and section-comment checklist: `assets/comment-banner-checklist.md`' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md` -> 1 (DeepSeek unit)

Find:
````text
- Renderer-implementation pre-flight checklist — `assets/renderer-implementation-checklist.md`
- Comment-grammar adoption checklist — `assets/comment-grammar-checklist.md`
- Folder-docs pairing checklist — `assets/folder-docs-checklist.md`
- Debugging checklist for view/pipeline regressions — `assets/debug-checklist.md`
- Verification-gate checklist — `assets/verification-checklist.md`
````
Replace:
````text
- MODULE banner and section-comment checklist: `assets/comment-banner-checklist.md`
- Folder-docs pairing checklist: `assets/folder-docs-checklist.md`
- `.db-*` class-rename checklist: `assets/db-class-rename-checklist.md`
- Screenshot fixture authoring checklist: `assets/fixture-authoring-checklist.md`
- Screenshot coverage checklist: `assets/screenshot-coverage-checklist.md`
- Modal screenshot-coverage checklist: `assets/modal-coverage-checklist.md`
- Verification-gate checklist: `assets/verification-checklist.md`
````
Check:
````bash
grep -cF -- '- MODULE banner and section-comment checklist: `assets/comment-banner-checklist.md`' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md
````

- [x] T035 In `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-obsidian/SKILL.md`) Evidence: `grep -cF -- 'version: 0.1.3.0' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md` -> 1 (DeepSeek unit)

Find:
````text
version: 0.1.2.0
````
Replace:
````text
version: 0.1.3.0
````
Check:
````bash
grep -cF -- 'version: 0.1.3.0' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md
````

- [x] T036 In `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md`) Evidence: `grep -cF -- '## 1. OVERVIEW' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md` -> 1 (DeepSeek unit)

Find:
````text
# sk-code-obsidian: Manual Testing Playbook

Routing-recall corpus for
````
Replace:
````text
# sk-code-obsidian: Manual Testing Playbook

## 1. OVERVIEW

Routing-recall corpus for
````
Check:
````bash
grep -cF -- '## 1. OVERVIEW' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md
````

- [x] T037 Create `.skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.3.0.md` as a byte-for-byte copy of `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/units/obsidian-changelog-v0.1.3.0.md`. Run `cp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/units/obsidian-changelog-v0.1.3.0.md .skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.3.0.md`. Check: run `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/units/obsidian-changelog-v0.1.3.0.md .skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.3.0.md && echo same`. Expected: `same`. (`.skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.3.0.md`) Evidence: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/units/obsidian-changelog-v0.1.3.0.md .skil` -> same (DeepSeek unit)
- [x] T038 In `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md`) Evidence: `grep -cF -- '## Honesty note: `SKILL.md`'\''s map matches the shipped tree' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-play` -> 1 (DeepSeek unit)

Find:
````text
## Honesty note: `SKILL.md`'s own map has drifted from the shipped tree

`SKILL.md` §2b's own `RESOURCE_MAP` names a few reference filenames
(`references/single-stylesheet-ownership.md`, `references/screenshot-fixture-harness.md`,
`references/obsidian-api-boundary.md`, `assets/renderer-implementation-checklist.md`,
`assets/comment-grammar-checklist.md`, `assets/debug-checklist.md`) that do not match the shipped
tree — the real files are `references/stylesheet-ownership.md`, `references/screenshot-harness.md`,
`references/obsidian-plugin-api.md`, and the seven checklists actually present under `assets/`
(`comment-banner-checklist.md`, `db-class-rename-checklist.md`, `fixture-authoring-checklist.md`,
`folder-docs-checklist.md`, `modal-coverage-checklist.md`, `screenshot-coverage-checklist.md`,
`verification-checklist.md`). `OB-H06` once recorded a second, distinct kind of drift beyond stale
filenames:
````
Replace:
````text
## Honesty note: `SKILL.md`'s map matches the shipped tree

`SKILL.md` names only files the packet ships. Its references include
`references/stylesheet-ownership.md`, `references/screenshot-harness.md` and
`references/obsidian-plugin-api.md`, and the checklists in its §2b `RESOURCE_MAP` and §4 asset list
are the seven present under `assets/` (`comment-banner-checklist.md`, `db-class-rename-checklist.md`,
`fixture-authoring-checklist.md`, `folder-docs-checklist.md`, `modal-coverage-checklist.md`,
`screenshot-coverage-checklist.md` and `verification-checklist.md`). `OB-H06` once recorded a
different kind of drift:
````
Check:
````bash
grep -cF -- '## Honesty note: `SKILL.md`'\''s map matches the shipped tree' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md
````

- [x] T039 In `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/renderer-feature-routing.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/renderer-feature-routing.md`) Evidence: `grep -cF -- 'mirror), and that `SKILL.md` §2b names `references/stylesheet-ownership.md` and the checklists' .skilled/skills/sk-code/sk-code-obsidian/manual-tes` -> 1 (DeepSeek unit)

Find:
````text
   mirror), and that `SKILL.md` §2b currently names `references/single-stylesheet-ownership.md` and
   `assets/renderer-implementation-checklist.md`, neither of which exists in the shipped tree; the
   real filenames are `references/stylesheet-ownership.md` and the checklists under `assets/`.
````
Replace:
````text
   mirror), and that `SKILL.md` §2b names `references/stylesheet-ownership.md` and the checklists
   under `assets/`, which are the filenames the shipped tree carries.
````
Check:
````bash
grep -cF -- 'mirror), and that `SKILL.md` §2b names `references/stylesheet-ownership.md` and the checklists' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/renderer-feature-routing.md
````

- [x] T040 In `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/debugging-routing.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/debugging-routing.md`) Evidence: `grep -cF -- 'an exact mirror), and `SKILL.md` §2b'\''s own `DEBUGGING` entry names only shipped files:' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-` -> 1 (DeepSeek unit)

Find:
````text
   an exact mirror), and `SKILL.md` §2b's own `DEBUGGING` entry currently names
   `assets/debug-checklist.md`, which does not exist in the shipped tree.
````
Replace:
````text
   an exact mirror), and `SKILL.md` §2b's own `DEBUGGING` entry names only shipped files:
   `references/view-renderer-architecture.md`, `references/mobile-and-touch.md` and
   `references/verification.md`.
````
Check:
````bash
grep -cF -- 'an exact mirror), and `SKILL.md` §2b'\''s own `DEBUGGING` entry names only shipped files:' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/debugging-routing.md
````

- [x] T041 In `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md`) Evidence: `grep -cF -- 'excerpt. `SKILL.md` §2b names `references/obsidian-plugin-api.md` and' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-dete` -> 1 (DeepSeek unit)

Find:
````text
   excerpt — note `SKILL.md` §2b currently names `references/obsidian-api-boundary.md` and
   `references/screenshot-fixture-harness.md`, neither of which exists; the real filenames are
   `references/obsidian-plugin-api.md` and `references/screenshot-harness.md`. This scenario's set is
   a curated core subset built from the live paths, not an exact mirror of the stale map.
````
Replace:
````text
   excerpt. `SKILL.md` §2b names `references/obsidian-plugin-api.md` and
   `references/screenshot-harness.md`, the filenames the shipped tree carries. This scenario's set is
   a curated core subset built from the live paths, not an exact mirror of the map.
````
Check:
````bash
grep -cF -- 'excerpt. `SKILL.md` §2b names `references/obsidian-plugin-api.md` and' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md
````

- [x] T042 In `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md`) Evidence: `grep -cF -- '§2b'\''s `DEFAULT_RESOURCE` block (`references/obsidian-plugin-api.md`,' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-f` -> 1 (DeepSeek unit)

Find:
````text
§2b's stale `DEFAULT_RESOURCE` block (`references/obsidian-api-boundary.md`,
`references/comment-grammar.md`); this scenario's own `expected_resources` swaps the first path for
the real file `references/obsidian-plugin-api.md` per the packet's own honesty note.
````
Replace:
````text
§2b's `DEFAULT_RESOURCE` block (`references/obsidian-plugin-api.md`,
`references/comment-grammar.md`), which matches this scenario's own `expected_resources`.
````
Check:
````bash
grep -cF -- '§2b'\''s `DEFAULT_RESOURCE` block (`references/obsidian-plugin-api.md`,' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md
````

- [x] T043 In `.skilled/skills/sk-code/sk-code-obsidian/README.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-obsidian/README.md`) Evidence: `grep -cF -- '1. Read `references/obsidian-plugin-api.md` to confirm' .skilled/skills/sk-code/sk-code-obsidian/README.md` -> 1 (DeepSeek unit)

Find:
````text
1. Read `references/obsidian-api-boundary.md` to confirm
````
Replace:
````text
1. Read `references/obsidian-plugin-api.md` to confirm
````
Check:
````bash
grep -cF -- '1. Read `references/obsidian-plugin-api.md` to confirm' .skilled/skills/sk-code/sk-code-obsidian/README.md
````

- [x] T044 In `.skilled/skills/sk-code/sk-code-obsidian/README.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-obsidian/README.md`) Evidence: `grep -cF -- 'See `references/screenshot-harness.md`.' .skilled/skills/sk-code/sk-code-obsidian/README.md` -> 1 (DeepSeek unit)

Find:
````text
See `references/screenshot-fixture-harness.md`.
````
Replace:
````text
See `references/screenshot-harness.md`.
````
Check:
````bash
grep -cF -- 'See `references/screenshot-harness.md`.' .skilled/skills/sk-code/sk-code-obsidian/README.md
````

- [x] T045 In `.skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md`) Evidence: `grep -cF -- 'See: [`../../implementation/performance-patterns/overview-and-checklist.md`](../../implementation/performance-patterns/overview-and-checklist.md)' ` -> 1 (DeepSeek unit)

Find:
````text
See: [performance_patterns.md](../../implementation/performance-patterns/overview-and-checklist.md)
````
Replace:
````text
See: [`../../implementation/performance-patterns/overview-and-checklist.md`](../../implementation/performance-patterns/overview-and-checklist.md)
````
Check:
````bash
grep -cF -- 'See: [`../../implementation/performance-patterns/overview-and-checklist.md`](../../implementation/performance-patterns/overview-and-checklist.md)' .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md
````

- [x] T046 In `.skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md`) Evidence: `grep -cF -- 'See: [`../../implementation/security-patterns/overview-and-checklist.md`](../../implementation/security-patterns/overview-and-checklist.md)' .skill` -> 1 (DeepSeek unit)

Find:
````text
See: [security_patterns.md](../../implementation/security-patterns/overview-and-checklist.md)
````
Replace:
````text
See: [`../../implementation/security-patterns/overview-and-checklist.md`](../../implementation/security-patterns/overview-and-checklist.md)
````
Check:
````bash
grep -cF -- 'See: [`../../implementation/security-patterns/overview-and-checklist.md`](../../implementation/security-patterns/overview-and-checklist.md)' .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md
````

- [x] T047 In `.skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md`, replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md`) Evidence: `grep -cF -- 'See: [`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)' .skilled/ski` -> 1 (DeepSeek unit)

Find:
````text
See: [debugging_workflows.md](../../debugging/debugging-workflows/systematic-four-phases.md)
````
Replace:
````text
See: [`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)
````
Check:
````bash
grep -cF -- 'See: [`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)' .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md
````

- [x] T048 For the orchestrator, not the builder: regenerate the Hermes skill copies once, after every sibling build has finished. The orchestrator runs `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs; echo "exit=$?"` and expects it to rewrite `.hermes/skills/sk-code-webflow/SKILL.md` and `.hermes/skills/sk-code-obsidian/SKILL.md` among its output, then `--check` to print `PASS`. The builder does not run the write form and does not edit anything under `.hermes/`. The builder marks this task `[x]` with the evidence `deferred: orchestrator runs this generator after all builds`. (`.hermes/skills/sk-code-webflow/SKILL.md`, `.hermes/skills/sk-code-obsidian/SKILL.md`) Evidence: (orchestrator, after every build) `sync-skills-hermes.cjs` -> `Wrote 9 of 70 Hermes skill copies`; `--check` -> `PASS: 70 Hermes skill copies in sync`, exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T049 Each edited file changed only the planned lines. Run `for f in .skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.js .skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.css .skilled/skills/sk-code/sk-code-webflow/assets/templates/embed-template.html .skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html .skilled/skills/sk-code/sk-code-webflow/assets/templates/head-footer-code-template.html .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md .skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md .skilled/skills/sk-code/sk-code-webflow/references/css/quality-standards/focus-has-print-and-quick-reference.md .skilled/skills/sk-code/sk-code-webflow/references/shared/enforcement.md .skilled/skills/sk-code/sk-code-webflow/SKILL.md .skilled/skills/sk-code/sk-code-obsidian/SKILL.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/sk-code/sk-code-obsidian/README.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/renderer-feature-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/debugging-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md; do echo "$(diff specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/before/$f $f | grep -c '^[<>]') $f"; done`. Expected, in order: `2`, `2`, `4`, `8`, `2`, `6`, `4`, `4`, `2`, `2`, `2`, `14`, `21`, `4`, `5`, `5`, `7`, `5` and `6`, each followed by its path. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/before/`) Evidence: loop over the 19 files diffing `git show HEAD:<f>` against the live file (scratch/before/ absent) -> `2 2 4 8 2 6 4 4 2 2 2 14 21 4 5 5 7 5 6`, the expected sequence exactly
- [x] T050 REQ-001, template pointers resolve. Run `rg -n 'references/webflow' .skilled/skills/sk-code/sk-code-webflow/assets/templates/; echo "exit=$?"`, then `for p in $(rg -o --no-filename '\.skilled/skills/sk-code/sk-code-webflow/references/[A-Za-z0-9_./-]+' .skilled/skills/sk-code/sk-code-webflow/assets/templates/); do test -e "$p" && echo "OK $p" || echo "MISSING $p"; done`. Expected: the search prints nothing and `exit=1`, then exactly nine lines starting `OK` and none starting `MISSING`. (`.skilled/skills/sk-code/sk-code-webflow/assets/templates/`) Evidence: `rg -n 'references/webflow' .skilled/skills/sk-code/sk-code-webflow/assets/templates/` -> no output, exit 1; the path loop printed 9 `OK` lines and no `MISSING`
- [x] T051 REQ-002, section pointers resolve. Run `rg -n '§13 Action Routing|§13 handles|§10 Form Validation|quick-reference\.md\)? §3 Form' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**'; echo "exit=$?"`, then `grep -c 'shared-listener-and-weakmap.md) §2' .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md; sed -n '34,148p' .skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/shared-listener-and-weakmap.md | grep -c '^### Action Routing Pattern'; grep -n '^## 5. FORM VALIDATION CLASSES' .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md; grep -n '^## 4. FORM VALIDATION CLASSES\|^## 6. FOCUS DETECTION' .skilled/skills/sk-code/sk-code-webflow/references/css/quick-reference.md`. Expected: the search prints nothing and `exit=1`, then `2`, `1`, `268:## 5. FORM VALIDATION CLASSES`, `82:## 4. FORM VALIDATION CLASSES` and `142:## 6. FOCUS DETECTION (KEYBOARD VS MOUSE)`. (`.skilled/skills/sk-code/sk-code-webflow/references/`) Evidence: T051 commands -> search empty, exit 1; `2`; `1`; `268:## 5. FORM VALIDATION CLASSES`; `82:## 4. FORM VALIDATION CLASSES`; `142:## 6. FOCUS DETECTION (KEYBOARD VS MOUSE)`
- [x] T052 REQ-003, the Obsidian asset list names only shipped files. Run `rg -n 'renderer-implementation-checklist|comment-grammar-checklist|debug-checklist' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md; echo "exit=$?"`, then `for a in $(sed -n '/^## 4. ASSETS/,/^## 5. RULES/p' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md | grep -o 'assets/[a-z-]*\.md'); do test -f ".skilled/skills/sk-code/sk-code-obsidian/$a" && echo "OK $a" || echo "MISSING $a"; done`. Expected: the search prints nothing and `exit=1`, then seven `OK` lines for `comment-banner-checklist.md`, `folder-docs-checklist.md`, `db-class-rename-checklist.md`, `fixture-authoring-checklist.md`, `screenshot-coverage-checklist.md`, `modal-coverage-checklist.md` and `verification-checklist.md`, and no `MISSING` line. (`.skilled/skills/sk-code/sk-code-obsidian/SKILL.md`) Evidence: T052 commands -> search empty, exit 1; 7 `OK assets/...` lines (comment-banner, folder-docs, db-class-rename, fixture-authoring, screenshot-coverage, modal-coverage, verification) and no `MISSING`
- [x] T053 REQ-004, the router-sync guard still passes. Run `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/guard-after.txt 2>&1; echo "exit=$?"; cat specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/guard-after.txt`. Expected: `exit=0`, five `PASS check` lines and `router-sync: 5/5 checks passed`. (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs`) Evidence: `verify_router_sync.cjs` -> five `PASS check` lines, `router-sync: 5/5 checks passed`, exit 0 (rerun after child 005's transient 4/5)
- [x] T054 REQ-004, compiled routing and the leaf manifest are still fresh. Run `node .skilled/bin/compiled-route-guard.cjs | grep 'sk-code \|All hubs'; echo "exit=${PIPESTATUS[0]}"; node .skilled/bin/compiled-route-manifest.cjs freshness --hub sk-code --skill-root .skilled/skills/sk-code | grep -o '"fresh":[a-z]*\|"effectivePolicyHash":"[0-9a-f]*"'; node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code; echo "exit=$?"`. Expected: a `sk-code` line ending in `fresh`, the `All hubs fresh or excused` line, `exit=0`, `"fresh":true`, the policy hash recorded in T005, then `leaf-manifest.json OK (` with the hash recorded in T006 and `exit=0`. If either reports stale, stop and report it to the orchestrator. Do not regenerate either manifest, because this phase owns neither file. (`.skilled/skills/sk-code/leaf-manifest.json`) Evidence: `compiled-route-guard.cjs | grep 'sk-code '` -> `sk-code                     fresh`; freshness -> `"fresh":true` and the a59ec9ff...299e2 hash; `generate-leaf-manifest.cjs --check` -> `leaf-manifest.json OK (fab6eb86...)` on the first run, `stale` (fresh=5d16ff95...) on a later run after child 001 deleted shared/assets/patterns/*. The guard exit is 1 for `cli-external-orchestration stale-manifest`. All three are sibling-caused, PENDING-ORCHESTRATOR
- [x] T055 REQ-004, the Obsidian playbook package still validates. Run `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/playbook-after.txt 2>&1; echo "exit=$?"; tail -1 specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/playbook-after.txt`. Expected: `exit=0` and the T007 line, `PASS package=sk-code/sk-code-obsidian tier=FAIL_CLOSED scenarios=27 categories=7 operator=27 routing_gold_excluded=0 violations=0 warnings=0`. (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook`) Evidence: `validate-playbook-package.cjs --package ...sk-code-obsidian/manual-testing-playbook` -> `PASS package=sk-code/sk-code-obsidian tier=FAIL_CLOSED scenarios=27 categories=7 operator=27 routing_gold_excluded=0 violations=0 warnings=0`, exit 0
- [x] T056 REQ-005, the Webflow comment budget is labelled. Run `rg -n 'comments per 10' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**' | grep -c 'Webflow setting'; rg -n 'comments per 10' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**' | grep -c 'shared/references/universal/code-style-guide.md'; grep -n '^## 4\. COMMENTING' .skilled/skills/sk-code/shared/references/universal/code-style-guide.md`. Expected: `2`, `2`, then one line containing `## 4. COMMENTING`. If that heading has moved, record the new section number and report it to the orchestrator instead of editing the shared file. (`.skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md`, `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md`) Evidence: T056 commands -> `2`, `2`, `107:## 4. COMMENTING (universal ...)`. The shared guide does not yet carry the comment-density sentence these rows point to (child 001 adds it), so the link text is ahead of its target until that child lands
- [x] T057 REQ-006, shared-tier link labels match their targets. Run `rg -n 'assets/webflow/checklists|\[.\.\./\.\./universal/code-style-guide\.md.\]|for both surfaces' .skilled/skills/sk-code/sk-code-webflow/references/shared/; echo "exit=$?"`. Expected: prints nothing and `exit=1`. (`.skilled/skills/sk-code/sk-code-webflow/references/shared/`) Evidence: `rg -n 'assets/webflow/checklists|\[.\.\./\.\./universal/code-style-guide\.md.\]|for both surfaces' .../references/shared/` -> no output, `exit=1`
- [x] T058 REQ-011, the old names are gone from the Obsidian prose and the Webflow dev-workflow labels. Run `rg -n 'single-stylesheet-ownership|screenshot-fixture-harness|obsidian-api-boundary|renderer-implementation-checklist|comment-grammar-checklist|debug-checklist' .skilled/skills/sk-code/sk-code-obsidian --glob '!**/changelog/**'; echo "exit=$?"; rg -n '\[[a-z]+_[a-z_]+\.md\]' .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md; echo "exit=$?"; test -f .skilled/skills/sk-code/sk-code-obsidian/references/obsidian-plugin-api.md && test -f .skilled/skills/sk-code/sk-code-obsidian/references/screenshot-harness.md && test -f .skilled/skills/sk-code/sk-code-obsidian/references/stylesheet-ownership.md && echo names-exist`. Expected: nothing then `exit=1`, nothing then `exit=1`, then `names-exist`. (`.skilled/skills/sk-code/sk-code-obsidian/`, `.skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md`) Evidence: T058 commands -> nothing/`exit=1`, nothing/`exit=1`, `names-exist`
- [x] T059 REQ-007, the playbook root passes the document validator. Run `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md; echo "exit=$?"; grep -n '^## 1. OVERVIEW' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md`. Expected: a `VALID` line (not `INVALID`), `Total issues: 1`, one `document_type_fallback` warning, no `missing_required_section` line, `exit=0`, then `9:## 1. OVERVIEW`. The one warning remains because no type rule matches a playbook root file (plan.md D5). (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md`) Evidence: `validate_document.py` on the playbook root -> `VALID`, `Total issues: 1`, `[document_type_fallback]` only, `exit=0`; `9:## 1. OVERVIEW`
- [x] T060 REQ-008, versions. Run `grep -n '^version:' .skilled/skills/sk-code/sk-code-webflow/SKILL.md .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.1.0.md .skilled/skills/sk-code/sk-code-obsidian/SKILL.md .skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.3.0.md`. Expected: `version: 1.1.1.0` twice, then `version: 0.1.3.0` twice. Leave the `version:` line of every other edited file alone. (`.skilled/skills/sk-code/sk-code-webflow/SKILL.md`, `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md`) Evidence: `grep -n '^version:'` -> webflow SKILL.md `1.1.1.0`, v1.1.1.0.md `1.1.1.0`, obsidian SKILL.md `0.1.3.0`, v0.1.3.0.md `0.1.3.0`
- [x] T061 REQ-008, every edited Markdown file and both changelogs validate. Run `for f in .skilled/skills/sk-code/sk-code-webflow/SKILL.md .skilled/skills/sk-code/sk-code-obsidian/SKILL.md .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md .skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md .skilled/skills/sk-code/sk-code-webflow/references/shared/enforcement.md .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md .skilled/skills/sk-code/sk-code-webflow/references/css/quality-standards/focus-has-print-and-quick-reference.md .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.1.0.md .skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.3.0.md .skilled/skills/sk-code/sk-code-obsidian/README.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/renderer-feature-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/debugging-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md; do echo "== $f"; python3 -I .skilled/skills/sk-doc/scripts/validate_document.py "$f" | grep 'VALID\|Total issues'; done`. Expected: `VALID` and `Total issues: 0` for all fifteen files. (`.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.1.0.md`, `.skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.3.0.md`) Evidence: loop over the 15 files -> `VALID` and `Total issues: 0` for every file (13 edited, 2 changelogs; the playbook root is covered by T059)
- [x] T062 REQ-008, the voice scan adds no hard blocker. Run `python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.1.0.md | grep 'hard blockers'; python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.3.0.md | grep 'hard blockers'; for f in .skilled/skills/sk-code/sk-code-webflow/SKILL.md .skilled/skills/sk-code/sk-code-obsidian/SKILL.md .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md .skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md .skilled/skills/sk-code/sk-code-webflow/references/shared/enforcement.md .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md .skilled/skills/sk-code/sk-code-webflow/references/css/quality-standards/focus-has-print-and-quick-reference.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/sk-code/sk-code-obsidian/README.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/renderer-feature-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/debugging-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md; do echo "$f $(python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py "$f" | grep 'hard blockers')"; done > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hvr-after.txt; diff specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hvr-before.txt specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hvr-after.txt`. Expected: `hard blockers:          0` twice, then a diff that shows only these counts falling: Obsidian `SKILL.md` 49 to 44, the playbook root 82 to 81, `renderer-feature-routing.md` 6 to 5, `stack-standards-routing.md` 9 to 7 and `zero-keyword-prompt.md` 9 to 8. The replaced lines held dashes and semicolons. No count may rise. A `review oxford-comma-candidate` line is a prompt to look, not a failure. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hvr-after.txt`) Evidence: hvr_scan on both changelogs -> `hard blockers: 0` twice; HEAD vs live diff -> only falls: obsidian SKILL.md 49 to 44, playbook root 82 to 81, renderer-feature-routing 6 to 5, stack-standards-routing 9 to 7, zero-keyword-prompt 9 to 8
- [x] T063 REQ-009, the Webflow checker fixtures keep their verdicts. Rerun the T011 command. Expected: the same six lines as T011, `bad exit=1`, `Passed:  0/4`, `Failed:  4/4`, `good exit=0`, `Passed:  2/2` and `Failed:  0/2`. (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/`) Evidence: T011 command rerun -> `bad exit=1`, `Passed:  0/4`, `Failed:  4/4`, `good exit=0`, `Passed:  2/2`, `Failed:  0/2`
- [x] T064 REQ-009, the drift guards hold. Run `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/drift-after.txt 2>&1; echo "exit=$?"; grep -n 'Errors:\|Warnings:\|PASS: \|FAIL: \|guards PASSED' specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/drift-after.txt; grep -c 'sk-code-webflow\|sk-code-obsidian' specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/drift-after.txt`. Expected: the T004 exit status, `Errors: 0`, the three `PASS:` lines, `run-all-drift-guards: all 3 guards PASSED`, then `0`, so no finding names a file in this phase's packets. (`.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`) Evidence: `run-all-drift-guards.sh` -> `Errors: 0`, `Warnings: 253`, `PASS: router-sync`, `run-all-drift-guards: all 3 guards PASSED`, exit 0 (an earlier run failed router-sync check 2 while child 005 was mid-edit, then passed)
- [x] T065 REQ-010, Hermes copies drift only where this phase edited a skill. Run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hermes-after.txt 2>&1; echo "exit=$?"; cat specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hermes-after.txt`. Expected: `exit=1`, the `DRIFT` lines recorded in T010 plus exactly two new ones, `DRIFT sk-code-obsidian` and `DRIFT sk-code-webflow`, then `FAIL: N drifted, 0 stale; run without --check to regenerate` with N two higher than in T010 (N is 2 when T010 printed `PASS`). Do not run the write form. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/hermes-after.txt`) Evidence: `sync-skills-hermes.cjs --check` -> `FAIL: 7 drifted, 0 stale`; this phase accounts for sk-code-webflow and sk-code-obsidian, the other five (cli-pi, sk-code-quality, sk-code-review, deep-review, system-spec-kit) are sibling drift; `git status --porcelain | grep -i hermes` -> empty, no .hermes file written. Regeneration is PENDING-ORCHESTRATOR (T048)
- [x] T066 SC-001, every template and HTML style-guide pointer opens something real. Run the second command of T050 and the first command of T051 again. Expected: nine `OK` lines and no `MISSING` line, then nothing and `exit=1`. (`.skilled/skills/sk-code/sk-code-webflow/assets/templates/`, `.skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md`) Evidence: T050 loop -> 9 `OK`, 0 `MISSING`; the T051 search -> no output, `exit=1`
- [x] T067 SC-002, no Obsidian section 4 line names a missing file. Run the second command of T052 again and pipe it to `grep -c MISSING`: `for a in $(sed -n '/^## 4. ASSETS/,/^## 5. RULES/p' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md | grep -o 'assets/[a-z-]*\.md'); do test -f ".skilled/skills/sk-code/sk-code-obsidian/$a" && echo "OK $a" || echo "MISSING $a"; done | grep -c MISSING`. Expected: `0`. (`.skilled/skills/sk-code/sk-code-obsidian/SKILL.md`) Evidence: T052 loop piped to `grep -c MISSING` -> `0`
- [x] T068 SC-003, the routing gates return their baseline verdicts. Run `diff specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/guard-before.txt specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/guard-after.txt; echo "guard diff=$?"; diff <(tail -1 specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/playbook-before.txt) <(tail -1 specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/playbook-after.txt); echo "playbook diff=$?"`. Expected: `guard diff=0` and `playbook diff=0` with no other output. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/`) Evidence: the builder saved no guard-before.txt or playbook-before.txt, so the diff cannot run; the plan-time verdicts were compared by value instead: router-sync 5/5, `sk-code fresh`, leaf manifest OK on the first pass, playbook package `violations=0 warnings=0`, drift guards `Errors: 0` and `Warnings: 253`. The leaf manifest later went stale from child 001's deletions, PENDING-ORCHESTRATOR
- [x] T069 Fill `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/implementation-summary.md` from the evidence above, replacing every bracketed placeholder. Record what changed per finding id and the files changed. State that no Hermes copy was regenerated and the orchestrator owns it. State that the playbook root keeps one `document_type_fallback` warning and why (plan.md D5). Carry the two items in plan.md section 8 forward as Known Limitations. Expected: `grep -n '\[[A-Z]' specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/implementation-summary.md` prints nothing and exits 1. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/implementation-summary.md`) Evidence: `grep -n '\[[A-Z]' implementation-summary.md` -> no output, exit 1; per-finding changes, the Hermes note, the `document_type_fallback` reason and the limitations are in the file
- [x] T070 Validate this folder. Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian --strict`. Expected: `RESULT: PASSED`. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/`) Evidence: `validate.sh <folder> --strict` -> `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`
- [x] T071 REQ-010, scope check, last. Run `git status --porcelain -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/status-after.txt; echo "exit=$?"; diff specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/status-before.txt specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/status-after.txt; echo "diff exit=$?"; git status --porcelain -- .hermes/skills/sk-code-webflow .hermes/skills/sk-code-obsidian`. Expected: `exit=0`, then only added lines (`>`), and `diff exit=1`. The added lines are twenty-one: nineteen ` M` lines, one for each file in T002, and two `??` lines, `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.1.0.md` and `.skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.3.0.md`. The last command prints nothing, because the builder writes nothing under `.hermes/`. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian/scratch/status-after.txt`) Evidence: `git status --porcelain -- sk-code-webflow sk-code-obsidian` -> 21 lines (19 ` M`, 2 `??` changelogs), exactly the spec.md table; `git status --porcelain -- .hermes/skills/sk-code-webflow .hermes/skills/sk-code-obsidian` -> empty. No status-before.txt was saved, so the plan-time empty baseline was used
- [x] T072 Fix unit from verification. In `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md`, replace the two lines that open "Proving the ceiling case works" and end "is what" (they call the `SKILL.md` map stale and hold two em dashes) with the NEW text of unit T072 in `scratch/fix-units.json`, then run its check. Expected: `1`. It follows from the section 4 repair, since the map no longer names a missing path. (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md`) Evidence: `grep -cF -- 'files rather than silently including a path the packet does not ship, is what' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/tok` -> 1 (DeepSeek unit)
- [x] T073 Fix unit from verification. In `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md`, replace the wording "an invented path mirroring `SKILL.md` §2b's stale `RESOURCE_MAP`" with the NEW text of unit T073 in `scratch/fix-units.json`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md`) Evidence: `grep -cF -- 'does not carry (a hallucination' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md` -> 1 (DeepSeek unit)
- [x] T074 Fix unit from verification. In `.skilled/skills/sk-code/sk-code-webflow/references/performance/interaction-gated-loading.md`, replace the missing pointer `../../../assets/webflow/patterns/interaction-gate-patterns.js` with `../../assets/patterns/interaction-gate-patterns.js` as unit T074 says, then run its check and `test -e .skilled/skills/sk-code/sk-code-webflow/assets/patterns/interaction-gate-patterns.js; echo "exit=$?"`. Expected: `1`, then `exit=0`. (`.skilled/skills/sk-code/sk-code-webflow/references/performance/interaction-gated-loading.md`) Evidence: `grep -cF -- '`../../assets/patterns/interaction-gate-patterns.js`' .skilled/skills/sk-code/sk-code-webflow/references/performance/interaction-gated-loading.md` -> 1 (DeepSeek unit)
- [x] T075 Fix unit from the doc-claims checker. Apply unit T075 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-obsidian/references/release/release-verification.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-obsidian/references/release/release-verification.md`) Evidence: `grep -cF -- '`../setup/setup.md` §3' .skilled/skills/sk-code/sk-code-obsidian/references/release/release-verification.md` -> 1 (DeepSeek unit)
- [x] T076 Fix unit from the doc-claims checker. Apply unit T076 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md`) Evidence: `grep -cF -- '[../../performance/third-party.md](../../performance/third-party.md)' .skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patte` -> 1 (DeepSeek unit)
- [x] T077 Fix unit from the doc-claims checker. Apply unit T077 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md`) Evidence: `grep -cF -- '[../style-guide/overview-naming-and-structure.md](../style-guide/overview-naming-and-structure.md)' .skilled/skills/sk-code/sk-code-webflow/referen` -> 1 (DeepSeek unit)
- [x] T078 Fix unit from the doc-claims checker. Apply unit T078 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md`) Evidence: `grep -cF -- 'see `../../../shared/references/universal/code-style-guide.md` §4' .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md` -> 1 (DeepSeek unit)
- [x] T079 Fix unit from the doc-claims checker. Apply unit T079 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md`) Evidence: `grep -cF -- '[`../../assets/templates/component-template.js`](../../assets/templates/component-template.js)' .skilled/skills/sk-code/sk-code-webflow/references/` -> 1 (DeepSeek unit)
- [x] T080 Fix unit from the doc-claims checker. Apply unit T080 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/references/performance/interaction-gated-loading.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/performance/interaction-gated-loading.md`) Evidence: `grep -cF -- '[../../../shared/references/performance-loading-checklist.md](../../../shared/references/performance-loading-checklist.md)' .skilled/skills/sk-code` -> 1 (DeepSeek unit)
- [x] T081 Fix unit from the doc-claims checker. Apply unit T081 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md`) Evidence: `grep -cF -- 'Routing-recall corpus for the `sk-code-webflow` surface.' .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.m` -> 1 (DeepSeek unit)
- [x] T082 Fix unit from the doc-claims checker. Apply unit T082 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/README.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/README.md`) Evidence: `grep -cF -- 'Its sibling `sk-code-opencode` carries' .skilled/skills/sk-code/sk-code-webflow/README.md` -> 1 (DeepSeek unit)
- [x] T083 Fix unit from the doc-claims checker. Apply unit T083 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/README.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/README.md`) Evidence: `grep -cF -- 'hands off to `sk-code-review`. Author-side quality gates hand off to `sk-code-quality`.' .skilled/skills/sk-code/sk-code-webflow/README.md` -> 1 (DeepSeek unit)
- [x] T084 Fix unit from the doc-claims checker. Apply unit T084 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/README.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/README.md`) Evidence: `grep -cF -- '| `sk-code-opencode` | Sibling surface' .skilled/skills/sk-code/sk-code-webflow/README.md` -> 1 (DeepSeek unit)
- [x] T085 Fix unit from the doc-claims checker. Apply unit T085 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/README.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/README.md`) Evidence: `grep -cF -- '| `sk-code-review` | Owns formal' .skilled/skills/sk-code/sk-code-webflow/README.md` -> 1 (DeepSeek unit)
- [x] T086 Fix unit from the doc-claims checker. Apply unit T086 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/README.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/README.md`) Evidence: `grep -cF -- '| `sk-code-quality` | Owns author-side' .skilled/skills/sk-code/sk-code-webflow/README.md` -> 1 (DeepSeek unit)
- [x] T087 Fix unit from the doc-claims checker. Apply unit T087 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/README.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/README.md`) Evidence: `grep -cF -- 'matches `sk-code-opencode` instead' .skilled/skills/sk-code/sk-code-webflow/README.md` -> 1 (DeepSeek unit)
- [x] T088 Fix unit from the doc-claims checker. Apply unit T088 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/SKILL.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/SKILL.md`) Evidence: `grep -cF -- 'review to `sk-code-review` and author-side quality gates to `sk-code-quality`.' .skilled/skills/sk-code/sk-code-webflow/SKILL.md` -> 1 (DeepSeek unit)
- [x] T089 Fix unit from the doc-claims checker. Apply unit T089 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/SKILL.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/SKILL.md`) Evidence: `grep -cF -- "projection of sk-code-webflow's own" .skilled/skills/sk-code/sk-code-webflow/SKILL.md` -> 1 (DeepSeek unit)
- [x] T090 Fix unit from the doc-claims checker. Apply unit T090 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/SKILL.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/SKILL.md`) Evidence: `grep -cF -- '# sk-code-webflow owns its intent' .skilled/skills/sk-code/sk-code-webflow/SKILL.md` -> 1 (DeepSeek unit)
- [x] T091 Fix unit from the doc-claims checker. Apply unit T091 of `scratch/fix-units.json` to `.skilled/skills/sk-code/sk-code-webflow/SKILL.md`, then run its check. Expected: `1`. (`.skilled/skills/sk-code/sk-code-webflow/SKILL.md`) Evidence: `grep -cF -- 'the sibling sk-code-opencode map plus the' .skilled/skills/sk-code/sk-code-webflow/SKILL.md` -> 1 (DeepSeek unit)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
