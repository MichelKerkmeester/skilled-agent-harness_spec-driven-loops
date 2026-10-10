---
title: "Tasks: Phase 2: webflow-labels-and-playbook"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "webflow labels and playbook tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: webflow-labels-and-playbook

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

All commands run from the repository root, which is the worktree `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/092-sk-code-ponytail-refinement`. Shell state does not persist between commands, so every command spells its paths out. `S` below is shorthand in prose only: it means `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch`, and every command writes that path in full. When a task is done, mark it `[x]` and append `Evidence:` with what was observed. No task uses `rm -rf`, `git diff` or the network, and no task stages, commits or pushes. Never write under `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/`, under `.hermes/` or outside `.skilled/skills/sk-code/sk-code-webflow/` and this phase folder. Finish Phase 1 before the first edit, because every "before" capture must show the unedited state. Numbers marked "at plan time" were observed on 2026-10-10. Sibling phases build in parallel, so when a gate baseline differs from the plan-time number, record what prints and compare later results with your own baseline. If a Phase 1 label or playbook capture differs from its expected value, stop and report it instead of editing.

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save the scope baseline. Run `git status --porcelain -- .skilled/skills/sk-code/sk-code-webflow > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/status-before.txt; echo "exit=$?"; wc -l < specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/status-before.txt`. Expected: `exit=0` and `0`. (`S/status-before.txt`) Evidence: git status --porcelain -- sk-code-webflow > status-before.txt -> exit=0, 0 lines
- [x] T002 Save a copy of the unedited packet. Run `mkdir -p specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/before && cp -R .skilled/skills/sk-code/sk-code-webflow specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/before/; echo "exit=$?"; diff -rq -x 'workflow-*.md' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/before/sk-code-webflow .skilled/skills/sk-code/sk-code-webflow; echo "diff exit=$?"`. Expected: `exit=0`, no diff line and `diff exit=0`. The `-x 'workflow-*.md'` skips three symlinks into the hub's `shared/` folder, which another phase owns. (`S/before/sk-code-webflow/`) Evidence: cp -R sk-code-webflow scratch/before/ then diff -rq -x workflow-*.md -> exit=0, no diff line, diff exit=0
- [x] T003 [P] Reproduce the label finding. Run `rg -n '\[[a-z]+_[a-z_]+\.md\]' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**' | sort -t: -k1,1 -k2,2n > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/labels-before.txt; wc -l < specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/labels-before.txt; diff specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/label-rows.txt specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/labels-before.txt; echo "diff exit=$?"`. Expected: `59`, no diff line and `diff exit=0`. (`S/labels-before.txt`) Evidence: rg label scan > labels-before.txt -> 59 lines, diff vs label-rows.txt empty, diff exit=0
- [x] T004 [P] Record the label check baseline. Run `bash specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/check-labels.sh | tail -1`. Expected: `OK=0 BAD=59`, because no label shows its target yet. (`S/check-labels.sh`) Evidence: bash scratch/check-labels.sh | tail -1 -> OK=0 BAD=59
- [x] T005 [P] Reproduce the playbook finding. Run `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md; echo "exit=$?"`. Expected: `INVALID`, `Total issues: 2`, a `[missing_required_section] Missing required section: overview` line, a `[document_type_fallback]` line and `exit=1`. (`.skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md`) Evidence: validate_document.py manual-testing-playbook.md -> INVALID, Total issues: 2, [missing_required_section] overview, [document_type_fallback], exit=1
- [x] T006 [P] Record the playbook package baseline. Run `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/playbook-before.txt 2>&1; echo "exit=$?"; tail -1 specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/playbook-before.txt`. Expected: `exit=0` and `PASS package=sk-code/sk-code-webflow tier=FAIL_CLOSED scenarios=13 categories=4 operator=13 routing_gold_excluded=0 violations=0 warnings=0`. (`S/playbook-before.txt`) Evidence: validate-playbook-package.cjs --package ...manual-testing-playbook -> exit=0, PASS package=sk-code/sk-code-webflow tier=FAIL_CLOSED scenarios=13 categories=4 operator=13 routing_gold_excluded=0 violations=0 warnings=0 (note: the validator output file ends with an extra "exit=0" line, so the PASS line is second to last, not last)
- [x] T007 [P] Record the validator verdict and voice-scan count of every edited Markdown file. Run `bash specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/check-docs.sh > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/docs-before.txt; wc -l < specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/docs-before.txt; grep -c 'invalid=0' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/docs-before.txt`. Expected: `24` and `24`. At plan time the hard-blocker counts were 0 for ten files, 1 for three, 2 for five, 3, 4 (twice), 9, 14 (`SKILL.md`) and 36 (`mime-troubleshooting-and-deployment.md`). They are dashes and semicolons that already exist, and the aim is only that no count changes. (`S/docs-before.txt`) Evidence: bash scratch/check-docs.sh > docs-before.txt -> 24 lines, grep -c invalid=0 -> 24
- [x] T008 [P] Record the drift-guard baseline. Run `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/drift-before.txt 2>&1; echo "exit=$?"; grep -n 'PASS: \|FAIL: \|guards PASSED\|doc-claims:' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/drift-before.txt`. Expected at plan time: `exit=0`, `PASS: alignment-drift`, `PASS: stack-folders`, `PASS: router-sync`, `PASS: doc-claims`, `doc-claims: 4/4 checks passed` and `run-all-drift-guards: all 4 guards PASSED`. (`S/drift-before.txt`) Evidence: run-all-drift-guards.sh -> exit=0, PASS alignment-drift/stack-folders/router-sync/doc-claims, doc-claims: 4/4 checks passed, all 4 guards PASSED
- [x] T009 [P] Record the Webflow checker fixture verdicts. Run `(cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad && node ../../test-minified-runtime.mjs > /dev/null 2>&1; echo "bad exit=$?"); (cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-good && node ../../test-minified-runtime.mjs > /dev/null 2>&1; echo "good exit=$?")`. Expected: `bad exit=1` and `good exit=0`. (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs`) Evidence: test-minified-runtime.mjs in known-bad/known-good -> bad exit=1, good exit=0
- [x] T010 [P] Record the Hermes copy baseline, read only. Run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/hermes-before.txt 2>&1; echo "exit=$?"; cat specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/hermes-before.txt`. Expected at plan time: `exit=0` and `PASS: 70 Hermes skill copies in sync`. A sibling build may already have added `DRIFT` lines. Record what prints. Never run this generator without `--check`. (`S/hermes-before.txt`) Evidence: sync-skills-hermes.cjs --check -> exit=1, DRIFT sk-code-review, FAIL: 1 drifted, 0 stale; MISMATCH: expected exit=0 and PASS: 70 Hermes skill copies in sync (sibling edits to sk-code-review in this worktree, not this phase)
- [x] T011 [P] Record the routing baseline. Run `node .skilled/bin/compiled-route-guard.cjs > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/crg-before.txt 2>&1; echo "exit=$?"; grep 'sk-code ' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/crg-before.txt; node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code; echo "exit=$?"`. Expected at plan time: `exit=0`, a `sk-code` line ending in `fresh`, `leaf-manifest.json OK (59ea33fd766514d568f793234145be7aa5ae90d9482669cf383eb3c6f237b441)` and `exit=0`. Record what prints. (`S/crg-before.txt`) Evidence: compiled-route-guard.cjs -> exit=0, "sk-code fresh"; generate-leaf-manifest.cjs --check -> leaf-manifest.json OK (59ea33fd766514d568f793234145be7aa5ae90d9482669cf383eb3c6f237b441), exit=0
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Every edit and create below is also one unit in `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/dispatch-units.json`, with the same task id, file, text and check. Each Find and Replace block starts at column 0, so every leading character inside a block is part of the text. Do the tasks in order and run each Check before the next task. If a Check prints anything other than its expected value, stop and report the task id and the output.

- [x] T012 Read the authoring contracts before the first edit of each kind, and follow them in every task below. Markdown outside spec folders: read `.skilled/skills/sk-doc/SKILL.md`, then `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` (the `SKILL.md` version line), `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` with `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` (the changelog), `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` (the playbook root) and `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` (no em dash, no semicolon and no serial comma in new prose). No code file changes in this phase, so `.skilled/skills/sk-code/SKILL.md` is not needed. Expected: nothing is written. If a contract contradicts a planned edit, stop and report the file and the line instead of improvising. At plan time the contracts agree with every edit below. (`.skilled/skills/sk-doc/SKILL.md`) Evidence: `changelog-template.md` has an `&nbsp;` line before each H2, the changelog and the 25 edited docs keep their validator verdicts (`diff docs-before.txt docs-after.txt` -> empty), and `git diff -U0` shows no new em dash or semicolon in added prose -> contracts followed (verifier)

- [x] T013 In `.skilled/skills/sk-code/sk-code-webflow/assets/webflow-debugging-checklist.md` (line 228, label `debugging_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/assets/webflow-debugging-checklist.md`) Evidence: `sed -n '228p' .skilled/skills/sk-code/sk-code-webflow/assets/webflow-debugging-checklist.md | grep -cF -- '[`../references/debugging/debugging-workflows/systema` -> 1 (DeepSeek unit)

Find:
````text
[debugging_workflows.md](../references/debugging/debugging-workflows/systematic-four-phases.md)
````
Replace:
````text
[`../references/debugging/debugging-workflows/systematic-four-phases.md`](../references/debugging/debugging-workflows/systematic-four-phases.md)
````
Check:
````bash
sed -n '228p' .skilled/skills/sk-code/sk-code-webflow/assets/webflow-debugging-checklist.md | grep -cF -- '[`../references/debugging/debugging-workflows/systematic-four-phases.md`](../references/debugging/debugging-workflows/systematic-four-phases.md)'
````

- [x] T014 In `.skilled/skills/sk-code/sk-code-webflow/assets/webflow-verification-checklist.md` (line 264, label `verification_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/assets/webflow-verification-checklist.md`) Evidence: `sed -n '264p' .skilled/skills/sk-code/sk-code-webflow/assets/webflow-verification-checklist.md | grep -cF -- '[`../references/verification/verification-workflow` -> 1 (DeepSeek unit)

Find:
````text
[verification_workflows.md](../references/verification/verification-workflows/gate-and-automated-options.md)
````
Replace:
````text
[`../references/verification/verification-workflows/gate-and-automated-options.md`](../references/verification/verification-workflows/gate-and-automated-options.md)
````
Check:
````bash
sed -n '264p' .skilled/skills/sk-code/sk-code-webflow/assets/webflow-verification-checklist.md | grep -cF -- '[`../references/verification/verification-workflows/gate-and-automated-options.md`](../references/verification/verification-workflows/gate-and-automated-options.md)'
````

- [x] T015 In `.skilled/skills/sk-code/sk-code-webflow/references/css/patterns/quick-reference-and-related.md` (line 110, label `animation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/css/patterns/quick-reference-and-related.md`) Evidence: `sed -n '110p' .skilled/skills/sk-code/sk-code-webflow/references/css/patterns/quick-reference-and-related.md | grep -cF -- '[`../../implementation/animation-wor` -> 1 (DeepSeek unit)

Find:
````text
[animation_workflows.md](../../implementation/animation-workflows/overview-decision-tree-and-css.md)
````
Replace:
````text
[`../../implementation/animation-workflows/overview-decision-tree-and-css.md`](../../implementation/animation-workflows/overview-decision-tree-and-css.md)
````
Check:
````bash
sed -n '110p' .skilled/skills/sk-code/sk-code-webflow/references/css/patterns/quick-reference-and-related.md | grep -cF -- '[`../../implementation/animation-workflows/overview-decision-tree-and-css.md`](../../implementation/animation-workflows/overview-decision-tree-and-css.md)'
````

- [x] T016 In `.skilled/skills/sk-code/sk-code-webflow/references/css/patterns/quick-reference-and-related.md` (line 112, label `webflow_patterns.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/css/patterns/quick-reference-and-related.md`) Evidence: `sed -n '112p' .skilled/skills/sk-code/sk-code-webflow/references/css/patterns/quick-reference-and-related.md | grep -cF -- '[`../../implementation/webflow-patte` -> 1 (DeepSeek unit)

Find:
````text
[webflow_patterns.md](../../implementation/webflow-patterns/overview-limits-and-collection-lists.md)
````
Replace:
````text
[`../../implementation/webflow-patterns/overview-limits-and-collection-lists.md`](../../implementation/webflow-patterns/overview-limits-and-collection-lists.md)
````
Check:
````bash
sed -n '112p' .skilled/skills/sk-code/sk-code-webflow/references/css/patterns/quick-reference-and-related.md | grep -cF -- '[`../../implementation/webflow-patterns/overview-limits-and-collection-lists.md`](../../implementation/webflow-patterns/overview-limits-and-collection-lists.md)'
````

- [x] T017 In `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/rules-and-root-cause.md` (line 51, label `debugging_checklist.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/rules-and-root-cause.md`) Evidence: `sed -n '51p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/rules-and-root-cause.md | grep -cF -- '[`../../../assets/webflow-d` -> 1 (DeepSeek unit)

Find:
````text
**See also:** [debugging_checklist.md](../../../assets/webflow-debugging-checklist.md) for systematic debugging checklist
````
Replace:
````text
**See also:** [`../../../assets/webflow-debugging-checklist.md`](../../../assets/webflow-debugging-checklist.md) for systematic debugging checklist
````
Check:
````bash
sed -n '51p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/rules-and-root-cause.md | grep -cF -- '[`../../../assets/webflow-debugging-checklist.md`](../../../assets/webflow-debugging-checklist.md)'
````

- [x] T018 In `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/rules-and-root-cause.md` (line 291, label `debugging_checklist.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/rules-and-root-cause.md`) Evidence: `sed -n '291p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/rules-and-root-cause.md | grep -cF -- '[`../../../assets/webflow-` -> 1 (DeepSeek unit)

Find:
````text
**See also:** [debugging_checklist.md](../../../assets/webflow-debugging-checklist.md) for tracing checklist
````
Replace:
````text
**See also:** [`../../../assets/webflow-debugging-checklist.md`](../../../assets/webflow-debugging-checklist.md) for tracing checklist
````
Check:
````bash
sed -n '291p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/rules-and-root-cause.md | grep -cF -- '[`../../../assets/webflow-debugging-checklist.md`](../../../assets/webflow-debugging-checklist.md)'
````

- [x] T019 In `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md` (line 359, label `implementation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md`) Evidence: `sed -n '359p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md | grep -cF -- '[`../../implemen` -> 1 (DeepSeek unit)

Find:
````text
[implementation_workflows.md](../../implementation/implementation-workflows/condition-based-waiting.md)
````
Replace:
````text
[`../../implementation/implementation-workflows/condition-based-waiting.md`](../../implementation/implementation-workflows/condition-based-waiting.md)
````
Check:
````bash
sed -n '359p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md | grep -cF -- '[`../../implementation/implementation-workflows/condition-based-waiting.md`](../../implementation/implementation-workflows/condition-based-waiting.md)'
````

- [x] T020 In `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md` (line 360, label `verification_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md`) Evidence: `sed -n '360p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md | grep -cF -- '[`../../verifica` -> 1 (DeepSeek unit)

Find:
````text
[verification_workflows.md](../../verification/verification-workflows/gate-and-automated-options.md)
````
Replace:
````text
[`../../verification/verification-workflows/gate-and-automated-options.md`](../../verification/verification-workflows/gate-and-automated-options.md)
````
Check:
````bash
sed -n '360p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md | grep -cF -- '[`../../verification/verification-workflows/gate-and-automated-options.md`](../../verification/verification-workflows/gate-and-automated-options.md)'
````

- [x] T021 In `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md` (line 361, label `dev_workflow.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md`) Evidence: `sed -n '361p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md | grep -cF -- '[`../../shared/d` -> 1 (DeepSeek unit)

Find:
````text
[dev_workflow.md](../../shared/dev-workflow/overview-nav-and-logging.md)
````
Replace:
````text
[`../../shared/dev-workflow/overview-nav-and-logging.md`](../../shared/dev-workflow/overview-nav-and-logging.md)
````
Check:
````bash
sed -n '361p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md | grep -cF -- '[`../../shared/dev-workflow/overview-nav-and-logging.md`](../../shared/dev-workflow/overview-nav-and-logging.md)'
````

- [x] T022 In `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md` (line 365, label `debugging_checklist.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md`) Evidence: `sed -n '365p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md | grep -cF -- '[`../../../asset` -> 1 (DeepSeek unit)

Find:
````text
- [lenis-patterns.js](../../../assets/integrations/lenis-patterns.js) - Complete Lenis smooth scroll integration patterns
- [debugging_checklist.md](../../../assets/webflow-debugging-checklist.md) - Systematic debugging checklist
````
Replace:
````text
- [lenis-patterns.js](../../../assets/integrations/lenis-patterns.js) - Complete Lenis smooth scroll integration patterns
- [`../../../assets/webflow-debugging-checklist.md`](../../../assets/webflow-debugging-checklist.md) - Systematic debugging checklist
````
Check:
````bash
sed -n '365p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md | grep -cF -- '[`../../../assets/webflow-debugging-checklist.md`](../../../assets/webflow-debugging-checklist.md)'
````

- [x] T023 In `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md` (line 386, label `debugging_checklist.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md`) Evidence: `sed -n '386p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md | grep -cF -- '[`../../../asset` -> 1 (DeepSeek unit)

Find:
````text
**For complete checklists:**
- [debugging_checklist.md](../../../assets/webflow-debugging-checklist.md) - Systematic debugging checklist
````
Replace:
````text
**For complete checklists:**
- [`../../../assets/webflow-debugging-checklist.md`](../../../assets/webflow-debugging-checklist.md) - Systematic debugging checklist
````
Check:
````bash
sed -n '386p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md | grep -cF -- '[`../../../assets/webflow-debugging-checklist.md`](../../../assets/webflow-debugging-checklist.md)'
````

- [x] T024 In `.skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md` (line 314, label `minification_guide.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md`) Evidence: `sed -n '314p' .skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md | grep -cF -- '[`minification-guide/overview-terser-and-patterns.m` -> 1 (DeepSeek unit)

Find:
````text
[minification_guide.md](minification-guide/overview-terser-and-patterns.md)
````
Replace:
````text
[`minification-guide/overview-terser-and-patterns.md`](minification-guide/overview-terser-and-patterns.md)
````
Check:
````bash
sed -n '314p' .skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md | grep -cF -- '[`minification-guide/overview-terser-and-patterns.md`](minification-guide/overview-terser-and-patterns.md)'
````

- [x] T025 In `.skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md` (line 315, label `implementation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md`) Evidence: `sed -n '315p' .skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md | grep -cF -- '[`../implementation/implementation-workflows/condit` -> 1 (DeepSeek unit)

Find:
````text
[implementation_workflows.md](../implementation/implementation-workflows/condition-based-waiting.md)
````
Replace:
````text
[`../implementation/implementation-workflows/condition-based-waiting.md`](../implementation/implementation-workflows/condition-based-waiting.md)
````
Check:
````bash
sed -n '315p' .skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md | grep -cF -- '[`../implementation/implementation-workflows/condition-based-waiting.md`](../implementation/implementation-workflows/condition-based-waiting.md)'
````

- [x] T026 In `.skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md` (line 316, label `verification_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md`) Evidence: `sed -n '316p' .skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md | grep -cF -- '[`../verification/verification-workflows/gate-and-a` -> 1 (DeepSeek unit)

Find:
````text
[verification_workflows.md](../verification/verification-workflows/gate-and-automated-options.md)
````
Replace:
````text
[`../verification/verification-workflows/gate-and-automated-options.md`](../verification/verification-workflows/gate-and-automated-options.md)
````
Check:
````bash
sed -n '316p' .skilled/skills/sk-code/sk-code-webflow/references/deployment/cdn-deployment.md | grep -cF -- '[`../verification/verification-workflows/gate-and-automated-options.md`](../verification/verification-workflows/gate-and-automated-options.md)'
````

- [x] T027 In `.skilled/skills/sk-code/sk-code-webflow/references/deployment/minification-guide/batch-rules-and-related.md` (line 107, label `implementation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/deployment/minification-guide/batch-rules-and-related.md`) Evidence: `sed -n '107p' .skilled/skills/sk-code/sk-code-webflow/references/deployment/minification-guide/batch-rules-and-related.md | grep -cF -- '[`../../implementation/` -> 1 (DeepSeek unit)

Find:
````text
[implementation_workflows.md](../../implementation/implementation-workflows/condition-based-waiting.md)
````
Replace:
````text
[`../../implementation/implementation-workflows/condition-based-waiting.md`](../../implementation/implementation-workflows/condition-based-waiting.md)
````
Check:
````bash
sed -n '107p' .skilled/skills/sk-code/sk-code-webflow/references/deployment/minification-guide/batch-rules-and-related.md | grep -cF -- '[`../../implementation/implementation-workflows/condition-based-waiting.md`](../../implementation/implementation-workflows/condition-based-waiting.md)'
````

- [x] T028 In `.skilled/skills/sk-code/sk-code-webflow/references/deployment/minification-guide/batch-rules-and-related.md` (line 108, label `debugging_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/deployment/minification-guide/batch-rules-and-related.md`) Evidence: `sed -n '108p' .skilled/skills/sk-code/sk-code-webflow/references/deployment/minification-guide/batch-rules-and-related.md | grep -cF -- '[`../../debugging/debug` -> 1 (DeepSeek unit)

Find:
````text
[debugging_workflows.md](../../debugging/debugging-workflows/systematic-four-phases.md)
````
Replace:
````text
[`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)
````
Check:
````bash
sed -n '108p' .skilled/skills/sk-code/sk-code-webflow/references/deployment/minification-guide/batch-rules-and-related.md | grep -cF -- '[`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)'
````

- [x] T029 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md` (line 240, label `implementation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md`) Evidence: `sed -n '240p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md | grep -cF -- '[`../implementation-wo` -> 1 (DeepSeek unit)

Find:
````text
[implementation_workflows.md](../implementation-workflows/condition-based-waiting.md)
````
Replace:
````text
[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)
````
Check:
````bash
sed -n '240p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md | grep -cF -- '[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)'
````

- [x] T030 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md` (line 241, label `debugging_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md`) Evidence: `sed -n '241p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md | grep -cF -- '[`../../debugging/debu` -> 1 (DeepSeek unit)

Find:
````text
[debugging_workflows.md](../../debugging/debugging-workflows/systematic-four-phases.md)
````
Replace:
````text
[`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)
````
Check:
````bash
sed -n '241p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md | grep -cF -- '[`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)'
````

- [x] T031 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md` (line 242, label `verification_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md`) Evidence: `sed -n '242p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md | grep -cF -- '[`../../verification/v` -> 1 (DeepSeek unit)

Find:
````text
[verification_workflows.md](../../verification/verification-workflows/gate-and-automated-options.md)
````
Replace:
````text
[`../../verification/verification-workflows/gate-and-automated-options.md`](../../verification/verification-workflows/gate-and-automated-options.md)
````
Check:
````bash
sed -n '242p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md | grep -cF -- '[`../../verification/verification-workflows/gate-and-automated-options.md`](../../verification/verification-workflows/gate-and-automated-options.md)'
````

- [x] T032 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md` (line 214, label `implementation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md`) Evidence: `sed -n '214p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md | grep -cF -- '[`../implementation-w` -> 1 (DeepSeek unit)

Find:
````text
[implementation_workflows.md](../implementation-workflows/condition-based-waiting.md)
````
Replace:
````text
[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)
````
Check:
````bash
sed -n '214p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md | grep -cF -- '[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)'
````

- [x] T033 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md` (line 215, label `performance_patterns.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md`) Evidence: `sed -n '215p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md | grep -cF -- '[`../performance-patt` -> 1 (DeepSeek unit)

Find:
````text
[performance_patterns.md](../performance-patterns/overview-and-checklist.md)
````
Replace:
````text
[`../performance-patterns/overview-and-checklist.md`](../performance-patterns/overview-and-checklist.md)
````
Check:
````bash
sed -n '215p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md | grep -cF -- '[`../performance-patterns/overview-and-checklist.md`](../performance-patterns/overview-and-checklist.md)'
````

- [x] T034 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md` (line 401, label `webflow_patterns.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md`) Evidence: `sed -n '401p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md | grep -cF -- '[`../webf` -> 1 (DeepSeek unit)

Find:
````text
[webflow_patterns.md](../webflow-patterns/overview-limits-and-collection-lists.md)
````
Replace:
````text
[`../webflow-patterns/overview-limits-and-collection-lists.md`](../webflow-patterns/overview-limits-and-collection-lists.md)
````
Check:
````bash
sed -n '401p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md | grep -cF -- '[`../webflow-patterns/overview-limits-and-collection-lists.md`](../webflow-patterns/overview-limits-and-collection-lists.md)'
````

- [x] T035 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md` (line 402, label `animation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md`) Evidence: `sed -n '402p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md | grep -cF -- '[`../anim` -> 1 (DeepSeek unit)

Find:
````text
[animation_workflows.md](../animation-workflows/overview-decision-tree-and-css.md)
````
Replace:
````text
[`../animation-workflows/overview-decision-tree-and-css.md`](../animation-workflows/overview-decision-tree-and-css.md)
````
Check:
````bash
sed -n '402p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md | grep -cF -- '[`../animation-workflows/overview-decision-tree-and-css.md`](../animation-workflows/overview-decision-tree-and-css.md)'
````

- [x] T036 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md` (line 403, label `security_patterns.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md`) Evidence: `sed -n '403p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md | grep -cF -- '[`../secu` -> 1 (DeepSeek unit)

Find:
````text
[security_patterns.md](../security-patterns/overview-and-checklist.md)
````
Replace:
````text
[`../security-patterns/overview-and-checklist.md`](../security-patterns/overview-and-checklist.md)
````
Check:
````bash
sed -n '403p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/focus-management/restoration-touch-and-anti-patterns.md | grep -cF -- '[`../security-patterns/overview-and-checklist.md`](../security-patterns/overview-and-checklist.md)'
````

- [x] T037 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md` (line 277, label `implementation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md`) Evidence: `sed -n '277p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md | grep -cF -- '[`..` -> 1 (DeepSeek unit)

Find:
````text
[implementation_workflows.md](../implementation-workflows/condition-based-waiting.md)
````
Replace:
````text
[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)
````
Check:
````bash
sed -n '277p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md | grep -cF -- '[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)'
````

- [x] T038 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md` (line 278, label `security_patterns.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md`) Evidence: `sed -n '278p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md | grep -cF -- '[`..` -> 1 (DeepSeek unit)

Find:
````text
[security_patterns.md](../security-patterns/overview-and-checklist.md)
````
Replace:
````text
[`../security-patterns/overview-and-checklist.md`](../security-patterns/overview-and-checklist.md)
````
Check:
````bash
sed -n '278p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md | grep -cF -- '[`../security-patterns/overview-and-checklist.md`](../security-patterns/overview-and-checklist.md)'
````

- [x] T039 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md` (line 281, label `minification_guide.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md`) Evidence: `sed -n '281p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md | grep -cF -- '[`..` -> 1 (DeepSeek unit)

Find:
````text
[minification_guide.md](../../deployment/minification-guide/overview-terser-and-patterns.md)
````
Replace:
````text
[`../../deployment/minification-guide/overview-terser-and-patterns.md`](../../deployment/minification-guide/overview-terser-and-patterns.md)
````
Check:
````bash
sed -n '281p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md | grep -cF -- '[`../../deployment/minification-guide/overview-terser-and-patterns.md`](../../deployment/minification-guide/overview-terser-and-patterns.md)'
````

- [x] T040 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/overview-architecture-and-filepond.md` (line 40, label `implementation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/overview-architecture-and-filepond.md`) Evidence: `sed -n '40p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/overview-architecture-and-filepond.md | grep -cF -- '[`../i` -> 1 (DeepSeek unit)

Find:
````text
[implementation_workflows.md](../implementation-workflows/condition-based-waiting.md)
````
Replace:
````text
[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)
````
Check:
````bash
sed -n '40p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/form-upload-workflows/overview-architecture-and-filepond.md | grep -cF -- '[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)'
````

- [x] T041 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md` (line 30, label `animation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md`) Evidence: `sed -n '30p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md | grep -cF -- '[`../animation` -> 1 (DeepSeek unit)

Find:
````text
- **Animation:** CSS first, Motion.dev for complexity - see [animation_workflows.md](../animation-workflows/overview-decision-tree-and-css.md)
````
Replace:
````text
- **Animation:** CSS first, Motion.dev for complexity - see [`../animation-workflows/overview-decision-tree-and-css.md`](../animation-workflows/overview-decision-tree-and-css.md)
````
Check:
````bash
sed -n '30p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md | grep -cF -- '[`../animation-workflows/overview-decision-tree-and-css.md`](../animation-workflows/overview-decision-tree-and-css.md)'
````

- [x] T042 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md` (line 31, label `webflow_patterns.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md`) Evidence: `sed -n '31p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md | grep -cF -- '[`../webflow-p` -> 1 (DeepSeek unit)

Find:
````text
[webflow_patterns.md](../webflow-patterns/overview-limits-and-collection-lists.md)
````
Replace:
````text
[`../webflow-patterns/overview-limits-and-collection-lists.md`](../webflow-patterns/overview-limits-and-collection-lists.md)
````
Check:
````bash
sed -n '31p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md | grep -cF -- '[`../webflow-patterns/overview-limits-and-collection-lists.md`](../webflow-patterns/overview-limits-and-collection-lists.md)'
````

- [x] T043 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md` (line 186, label `animation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md`) Evidence: `sed -n '186p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md | grep -cF -- '[`../animatio` -> 1 (DeepSeek unit)

Find:
````text
**See also:** [animation_workflows.md](../animation-workflows/overview-decision-tree-and-css.md) - Complete animation implementation guide including CSS patterns, Motion.dev integration, and performance optimization.
````
Replace:
````text
**See also:** [`../animation-workflows/overview-decision-tree-and-css.md`](../animation-workflows/overview-decision-tree-and-css.md) - Complete animation implementation guide including CSS patterns, Motion.dev integration, and performance optimization.
````
Check:
````bash
sed -n '186p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md | grep -cF -- '[`../animation-workflows/overview-decision-tree-and-css.md`](../animation-workflows/overview-decision-tree-and-css.md)'
````

- [x] T044 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md` (line 235, label `minification_guide.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md`) Evidence: `sed -n '235p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md | grep -cF -- '[`../` -> 1 (DeepSeek unit)

Find:
````text
[minification_guide.md](../../deployment/minification-guide/overview-terser-and-patterns.md)
````
Replace:
````text
[`../../deployment/minification-guide/overview-terser-and-patterns.md`](../../deployment/minification-guide/overview-terser-and-patterns.md)
````
Check:
````bash
sed -n '235p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md | grep -cF -- '[`../../deployment/minification-guide/overview-terser-and-patterns.md`](../../deployment/minification-guide/overview-terser-and-patterns.md)'
````

- [x] T045 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md` (line 313, label `debugging_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md`) Evidence: `sed -n '313p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md | grep -cF -- '[`../` -> 1 (DeepSeek unit)

Find:
````text
[debugging_workflows.md](../../debugging/debugging-workflows/systematic-four-phases.md)
````
Replace:
````text
[`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)
````
Check:
````bash
sed -n '313p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md | grep -cF -- '[`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)'
````

- [x] T046 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md` (line 314, label `verification_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md`) Evidence: `sed -n '314p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md | grep -cF -- '[`../` -> 1 (DeepSeek unit)

Find:
````text
[verification_workflows.md](../../verification/verification-workflows/gate-and-automated-options.md)
````
Replace:
````text
[`../../verification/verification-workflows/gate-and-automated-options.md`](../../verification/verification-workflows/gate-and-automated-options.md)
````
Check:
````bash
sed -n '314p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md | grep -cF -- '[`../../verification/verification-workflows/gate-and-automated-options.md`](../../verification/verification-workflows/gate-and-automated-options.md)'
````

- [x] T047 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md` (line 315, label `dev_workflow.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md`) Evidence: `sed -n '315p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md | grep -cF -- '[`../` -> 1 (DeepSeek unit)

Find:
````text
[dev_workflow.md](../../shared/dev-workflow/overview-nav-and-logging.md)
````
Replace:
````text
[`../../shared/dev-workflow/overview-nav-and-logging.md`](../../shared/dev-workflow/overview-nav-and-logging.md)
````
Check:
````bash
sed -n '315p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md | grep -cF -- '[`../../shared/dev-workflow/overview-nav-and-logging.md`](../../shared/dev-workflow/overview-nav-and-logging.md)'
````

- [x] T048 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md` (line 316, label `animation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md`) Evidence: `sed -n '316p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md | grep -cF -- '[`../` -> 1 (DeepSeek unit)

Find:
````text
[animation_workflows.md](../animation-workflows/overview-decision-tree-and-css.md)
````
Replace:
````text
[`../animation-workflows/overview-decision-tree-and-css.md`](../animation-workflows/overview-decision-tree-and-css.md)
````
Check:
````bash
sed -n '316p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md | grep -cF -- '[`../animation-workflows/overview-decision-tree-and-css.md`](../animation-workflows/overview-decision-tree-and-css.md)'
````

- [x] T049 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md` (line 226, label `debugging_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md`) Evidence: `sed -n '226p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md | grep -cF -- '[`../../debuggi` -> 1 (DeepSeek unit)

Find:
````text
[debugging_workflows.md](../../debugging/debugging-workflows/systematic-four-phases.md)
````
Replace:
````text
[`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)
````
Check:
````bash
sed -n '226p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md | grep -cF -- '[`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)'
````

- [x] T050 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md` (line 227, label `verification_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md`) Evidence: `sed -n '227p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md | grep -cF -- '[`../../verific` -> 1 (DeepSeek unit)

Find:
````text
[verification_workflows.md](../../verification/verification-workflows/gate-and-automated-options.md)
````
Replace:
````text
[`../../verification/verification-workflows/gate-and-automated-options.md`](../../verification/verification-workflows/gate-and-automated-options.md)
````
Check:
````bash
sed -n '227p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md | grep -cF -- '[`../../verification/verification-workflows/gate-and-automated-options.md`](../../verification/verification-workflows/gate-and-automated-options.md)'
````

- [x] T051 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md` (line 228, label `animation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md`) Evidence: `sed -n '228p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md | grep -cF -- '[`../animation-` -> 1 (DeepSeek unit)

Find:
````text
[animation_workflows.md](../animation-workflows/overview-decision-tree-and-css.md)
````
Replace:
````text
[`../animation-workflows/overview-decision-tree-and-css.md`](../animation-workflows/overview-decision-tree-and-css.md)
````
Check:
````bash
sed -n '228p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md | grep -cF -- '[`../animation-workflows/overview-decision-tree-and-css.md`](../animation-workflows/overview-decision-tree-and-css.md)'
````

- [x] T052 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md` (line 229, label `webflow_patterns.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md`) Evidence: `sed -n '229p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md | grep -cF -- '[`../webflow-pa` -> 1 (DeepSeek unit)

Find:
````text
[webflow_patterns.md](../webflow-patterns/overview-limits-and-collection-lists.md)
````
Replace:
````text
[`../webflow-patterns/overview-limits-and-collection-lists.md`](../webflow-patterns/overview-limits-and-collection-lists.md)
````
Check:
````bash
sed -n '229p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/performance-patterns/budgets-and-anti-patterns.md | grep -cF -- '[`../webflow-patterns/overview-limits-and-collection-lists.md`](../webflow-patterns/overview-limits-and-collection-lists.md)'
````

- [x] T053 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/security-patterns/owasp-prototype-and-safe-access.md` (line 338, label `implementation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/security-patterns/owasp-prototype-and-safe-access.md`) Evidence: `sed -n '338p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/security-patterns/owasp-prototype-and-safe-access.md | grep -cF -- '[`../impleme` -> 1 (DeepSeek unit)

Find:
````text
[implementation_workflows.md](../implementation-workflows/condition-based-waiting.md)
````
Replace:
````text
[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)
````
Check:
````bash
sed -n '338p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/security-patterns/owasp-prototype-and-safe-access.md | grep -cF -- '[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)'
````

- [x] T054 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/security-patterns/owasp-prototype-and-safe-access.md` (line 339, label `verification_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/security-patterns/owasp-prototype-and-safe-access.md`) Evidence: `sed -n '339p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/security-patterns/owasp-prototype-and-safe-access.md | grep -cF -- '[`../../veri` -> 1 (DeepSeek unit)

Find:
````text
[verification_workflows.md](../../verification/verification-workflows/gate-and-automated-options.md)
````
Replace:
````text
[`../../verification/verification-workflows/gate-and-automated-options.md`](../../verification/verification-workflows/gate-and-automated-options.md)
````
Check:
````bash
sed -n '339p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/security-patterns/owasp-prototype-and-safe-access.md | grep -cF -- '[`../../verification/verification-workflows/gate-and-automated-options.md`](../../verification/verification-workflows/gate-and-automated-options.md)'
````

- [x] T055 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md` (line 230, label `observer_patterns.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md`) Evidence: `sed -n '230p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md | grep -cF -- '[`../observ` -> 1 (DeepSeek unit)

Find:
````text
[observer_patterns.md](../observer-patterns/mutation-and-intersection.md)
````
Replace:
````text
[`../observer-patterns/mutation-and-intersection.md`](../observer-patterns/mutation-and-intersection.md)
````
Check:
````bash
sed -n '230p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md | grep -cF -- '[`../observer-patterns/mutation-and-intersection.md`](../observer-patterns/mutation-and-intersection.md)'
````

- [x] T056 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md` (line 231, label `performance_patterns.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md`) Evidence: `sed -n '231p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md | grep -cF -- '[`../perfor` -> 1 (DeepSeek unit)

Find:
````text
[performance_patterns.md](../performance-patterns/overview-and-checklist.md)
````
Replace:
````text
[`../performance-patterns/overview-and-checklist.md`](../performance-patterns/overview-and-checklist.md)
````
Check:
````bash
sed -n '231p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md | grep -cF -- '[`../performance-patterns/overview-and-checklist.md`](../performance-patterns/overview-and-checklist.md)'
````

- [x] T057 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md` (line 232, label `webflow_patterns.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md`) Evidence: `sed -n '232p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md | grep -cF -- '[`../webflo` -> 1 (DeepSeek unit)

Find:
````text
[webflow_patterns.md](../webflow-patterns/overview-limits-and-collection-lists.md)
````
Replace:
````text
[`../webflow-patterns/overview-limits-and-collection-lists.md`](../webflow-patterns/overview-limits-and-collection-lists.md)
````
Check:
````bash
sed -n '232p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md | grep -cF -- '[`../webflow-patterns/overview-limits-and-collection-lists.md`](../webflow-patterns/overview-limits-and-collection-lists.md)'
````

- [x] T058 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md` (line 233, label `animation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md`) Evidence: `sed -n '233p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md | grep -cF -- '[`../animat` -> 1 (DeepSeek unit)

Find:
````text
[animation_workflows.md](../animation-workflows/overview-decision-tree-and-css.md)
````
Replace:
````text
[`../animation-workflows/overview-decision-tree-and-css.md`](../animation-workflows/overview-decision-tree-and-css.md)
````
Check:
````bash
sed -n '233p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md | grep -cF -- '[`../animation-workflows/overview-decision-tree-and-css.md`](../animation-workflows/overview-decision-tree-and-css.md)'
````

- [x] T059 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/best-practices-and-summary.md` (line 182, label `implementation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/best-practices-and-summary.md`) Evidence: `sed -n '182p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/best-practices-and-summary.md | grep -cF -- '[`../imple` -> 1 (DeepSeek unit)

Find:
````text
[implementation_workflows.md](../implementation-workflows/condition-based-waiting.md)
````
Replace:
````text
[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)
````
Check:
````bash
sed -n '182p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/best-practices-and-summary.md | grep -cF -- '[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)'
````

- [x] T060 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/best-practices-and-summary.md` (line 183, label `performance_patterns.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/best-practices-and-summary.md`) Evidence: `sed -n '183p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/best-practices-and-summary.md | grep -cF -- '[`../perfo` -> 1 (DeepSeek unit)

Find:
````text
[performance_patterns.md](../performance-patterns/overview-and-checklist.md)
````
Replace:
````text
[`../performance-patterns/overview-and-checklist.md`](../performance-patterns/overview-and-checklist.md)
````
Check:
````bash
sed -n '183p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/best-practices-and-summary.md | grep -cF -- '[`../performance-patterns/overview-and-checklist.md`](../performance-patterns/overview-and-checklist.md)'
````

- [x] T061 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/filepond.md` (line 370, label `form_upload_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/filepond.md`) Evidence: `sed -n '370p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/filepond.md | grep -cF -- '[`../form-upload-workflows/o` -> 1 (DeepSeek unit)

Find:
````text
[form_upload_workflows.md](../form-upload-workflows/overview-architecture-and-filepond.md)
````
Replace:
````text
[`../form-upload-workflows/overview-architecture-and-filepond.md`](../form-upload-workflows/overview-architecture-and-filepond.md)
````
Check:
````bash
sed -n '370p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/third-party-integrations/filepond.md | grep -cF -- '[`../form-upload-workflows/overview-architecture-and-filepond.md`](../form-upload-workflows/overview-architecture-and-filepond.md)'
````

- [x] T062 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/webflow-patterns/finsweet-custom-select-bridge.md` (line 352, label `implementation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/webflow-patterns/finsweet-custom-select-bridge.md`) Evidence: `sed -n '352p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/webflow-patterns/finsweet-custom-select-bridge.md | grep -cF -- '[`../implementa` -> 1 (DeepSeek unit)

Find:
````text
[implementation_workflows.md](../implementation-workflows/condition-based-waiting.md)
````
Replace:
````text
[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)
````
Check:
````bash
sed -n '352p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/webflow-patterns/finsweet-custom-select-bridge.md | grep -cF -- '[`../implementation-workflows/condition-based-waiting.md`](../implementation-workflows/condition-based-waiting.md)'
````

- [x] T063 In `.skilled/skills/sk-code/sk-code-webflow/references/implementation/webflow-patterns/finsweet-custom-select-bridge.md` (line 355, label `performance_patterns.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/implementation/webflow-patterns/finsweet-custom-select-bridge.md`) Evidence: `sed -n '355p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/webflow-patterns/finsweet-custom-select-bridge.md | grep -cF -- '[`../performanc` -> 1 (DeepSeek unit)

Find:
````text
[performance_patterns.md](../performance-patterns/overview-and-checklist.md)
````
Replace:
````text
[`../performance-patterns/overview-and-checklist.md`](../performance-patterns/overview-and-checklist.md)
````
Check:
````bash
sed -n '355p' .skilled/skills/sk-code/sk-code-webflow/references/implementation/webflow-patterns/finsweet-custom-select-bridge.md | grep -cF -- '[`../performance-patterns/overview-and-checklist.md`](../performance-patterns/overview-and-checklist.md)'
````

- [x] T064 In `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md` (line 37, label `animation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md`) Evidence: `sed -n '37p' .skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md | grep -cF -- '[`../../implementation/a` -> 1 (DeepSeek unit)

Find:
````text
[animation_workflows.md](../../implementation/animation-workflows/overview-decision-tree-and-css.md)
````
Replace:
````text
[`../../implementation/animation-workflows/overview-decision-tree-and-css.md`](../../implementation/animation-workflows/overview-decision-tree-and-css.md)
````
Check:
````bash
sed -n '37p' .skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md | grep -cF -- '[`../../implementation/animation-workflows/overview-decision-tree-and-css.md`](../../implementation/animation-workflows/overview-decision-tree-and-css.md)'
````

- [x] T065 In `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/state-and-cleanup.md` (line 64, label `animation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/state-and-cleanup.md`) Evidence: `sed -n '64p' .skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/state-and-cleanup.md | grep -cF -- '[`../../implementation/animatio` -> 1 (DeepSeek unit)

Find:
````text
- **Decision tree and patterns:** [animation_workflows.md](../../implementation/animation-workflows/overview-decision-tree-and-css.md)
````
Replace:
````text
- **Decision tree and patterns:** [`../../implementation/animation-workflows/overview-decision-tree-and-css.md`](../../implementation/animation-workflows/overview-decision-tree-and-css.md)
````
Check:
````bash
sed -n '64p' .skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/state-and-cleanup.md | grep -cF -- '[`../../implementation/animation-workflows/overview-decision-tree-and-css.md`](../../implementation/animation-workflows/overview-decision-tree-and-css.md)'
````

- [x] T066 In `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/state-and-cleanup.md` (line 65, label `animation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/state-and-cleanup.md`) Evidence: `sed -n '65p' .skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/state-and-cleanup.md | grep -cF -- '[`../../implementation/animatio` -> 1 (DeepSeek unit)

Find:
````text
- **Complete reference:** [animation_workflows.md](../../implementation/animation-workflows/overview-decision-tree-and-css.md) contains all animation policy, rationale, and implementation details
````
Replace:
````text
- **Complete reference:** [`../../implementation/animation-workflows/overview-decision-tree-and-css.md`](../../implementation/animation-workflows/overview-decision-tree-and-css.md) contains all animation policy, rationale, and implementation details
````
Check:
````bash
sed -n '65p' .skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/state-and-cleanup.md | grep -cF -- '[`../../implementation/animation-workflows/overview-decision-tree-and-css.md`](../../implementation/animation-workflows/overview-decision-tree-and-css.md)'
````

- [x] T067 In `.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md` (line 322, label `implementation_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md`) Evidence: `sed -n '322p' .skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md | grep -cF -- '[`../../` -> 1 (DeepSeek unit)

Find:
````text
[implementation_workflows.md](../../implementation/implementation-workflows/condition-based-waiting.md)
````
Replace:
````text
[`../../implementation/implementation-workflows/condition-based-waiting.md`](../../implementation/implementation-workflows/condition-based-waiting.md)
````
Check:
````bash
sed -n '322p' .skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md | grep -cF -- '[`../../implementation/implementation-workflows/condition-based-waiting.md`](../../implementation/implementation-workflows/condition-based-waiting.md)'
````

- [x] T068 In `.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md` (line 323, label `debugging_workflows.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md`) Evidence: `sed -n '323p' .skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md | grep -cF -- '[`../../` -> 1 (DeepSeek unit)

Find:
````text
[debugging_workflows.md](../../debugging/debugging-workflows/systematic-four-phases.md)
````
Replace:
````text
[`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)
````
Check:
````bash
sed -n '323p' .skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md | grep -cF -- '[`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)'
````

- [x] T069 In `.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md` (line 324, label `dev_workflow.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md`) Evidence: `sed -n '324p' .skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md | grep -cF -- '[`../../` -> 1 (DeepSeek unit)

Find:
````text
[dev_workflow.md](../../shared/dev-workflow/overview-nav-and-logging.md)
````
Replace:
````text
[`../../shared/dev-workflow/overview-nav-and-logging.md`](../../shared/dev-workflow/overview-nav-and-logging.md)
````
Check:
````bash
sed -n '324p' .skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md | grep -cF -- '[`../../shared/dev-workflow/overview-nav-and-logging.md`](../../shared/dev-workflow/overview-nav-and-logging.md)'
````

- [x] T070 In `.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md` (line 327, label `verification_checklist.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md`) Evidence: `sed -n '327p' .skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md | grep -cF -- '[`../../` -> 1 (DeepSeek unit)

Find:
````text
- [verification_checklist.md](../../../assets/webflow-verification-checklist.md) - Printable verification checklist
````
Replace:
````text
- [`../../../assets/webflow-verification-checklist.md`](../../../assets/webflow-verification-checklist.md) - Printable verification checklist
````
Check:
````bash
sed -n '327p' .skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md | grep -cF -- '[`../../../assets/webflow-verification-checklist.md`](../../../assets/webflow-verification-checklist.md)'
````

- [x] T071 In `.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md` (line 334, label `verification_checklist.md`), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `1`. (`.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md`) Evidence: `sed -n '334p' .skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md | grep -cF -- '[`../../` -> 1 (DeepSeek unit)

Find:
````text
**See also:** [verification_checklist.md](../../../assets/webflow-verification-checklist.md) for printable checklist
````
Replace:
````text
**See also:** [`../../../assets/webflow-verification-checklist.md`](../../../assets/webflow-verification-checklist.md) for printable checklist
````
Check:
````bash
sed -n '334p' .skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md | grep -cF -- '[`../../../assets/webflow-verification-checklist.md`](../../../assets/webflow-verification-checklist.md)'
````

- [x] T072 In `.skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md` (playbook root overview heading), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `3:## 1. OVERVIEW`. (`.skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md`) Evidence: `grep -n '^## 1. OVERVIEW' .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md` -> 3:## 1. OVERVIEW (DeepSeek unit)

Find:
````text
# sk-code-webflow: Manual Testing Playbook

Routing-recall corpus for
````
Replace:
````text
# sk-code-webflow: Manual Testing Playbook

## 1. OVERVIEW

Routing-recall corpus for
````
Check:
````bash
grep -n '^## 1. OVERVIEW' .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md
````

- [x] T073 In `.skilled/skills/sk-code/sk-code-webflow/SKILL.md` (packet version), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints `5:version: 1.1.2.0`. (`.skilled/skills/sk-code/sk-code-webflow/SKILL.md`) Evidence: `grep -n '^version:' .skilled/skills/sk-code/sk-code-webflow/SKILL.md` -> 5:version: 1.1.2.0 (DeepSeek unit)

Find:
````text
version: 1.1.1.0
````
Replace:
````text
version: 1.1.2.0
````
Check:
````bash
grep -n '^version:' .skilled/skills/sk-code/sk-code-webflow/SKILL.md
````

- [x] T074 Create `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md` as a byte-for-byte copy of `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/units/webflow-changelog-v1.1.2.0.md`. Run `cp specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/units/webflow-changelog-v1.1.2.0.md .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md`. Check: run `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/units/webflow-changelog-v1.1.2.0.md .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md && echo same`. Expected: `same`. (`.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md`) Evidence: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/units/webflow-changelog-v1.1.2.0.md ` -> same (DeepSeek unit)

- [x] T075 For the orchestrator, not the builder: regenerate the Hermes skill copies once, after every sibling build has finished. The orchestrator runs `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs; echo "exit=$?"`, expects the `sk-code-webflow` copy among the rewritten ones, then runs the same command with `--check` and expects `PASS` and `exit=0`. The builder does not run the write form and does not edit anything under `.hermes/`. The builder marks this task `[x]` with the evidence `deferred: orchestrator runs this generator after all builds`. (`.hermes/skills/sk-code-webflow/`) Evidence: deferred: orchestrator runs this generator after all builds (`sync-skills-hermes.cjs --check` -> `DRIFT sk-code-webflow`, PENDING-ORCHESTRATOR)
- [x] T076 For the orchestrator, not the builder: after every build, run `node .skilled/bin/compiled-route-guard.cjs | grep 'sk-code '`. If the line ends in `fresh`, nothing more is needed. If it reports the sk-code route stale, run `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code`, then `cp .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`, and confirm the guard line ends in `fresh` and `cmp` of the two manifests prints nothing. The builder marks this task `[x]` with the evidence `deferred: orchestrator re-mints after all builds`. (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json`) Evidence: deferred: orchestrator re-mints after all builds (`compiled-route-guard.cjs | grep 'sk-code '` -> `sk-code stale-manifest` after sibling edits, PENDING-ORCHESTRATOR)

### Handoff from child 005

- [x] T095 Apply fix unit handoff-005.json:X (scratch/fix-chain.json) to `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/systematic-four-phases.md`. Check: `sed -n '33p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/systematic-four-phases.md` prints `[testing-and-common-issues.md Section 3] (../../implementation/animation-workflows/testing-and-common-issues.md#3-common-issues-and-solutions)` Evidence: `sed -n '33p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/systematic-four-phases.md` -> - **Animation issues:** See [testing-and-common-issues.md Section 3] (../../implementation/animation-workflows/testing-and-common-issues.md#3-common-issues-and-solutions) (DeepSeek unit)
- [x] T096 Apply fix unit handoff-005.json:X (scratch/fix-chain.json) to `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/systematic-four-phases.md`. Check: `sed -n '34p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/systematic-four-phases.md` prints `[overview-limits-and-collection-lists.md Section 3] (../../implementation/webflow-patterns/overview-limits-and-collection-lists.md#3-collection-list-patterns)` Evidence: `sed -n '34p' .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/systematic-four-phases.md` -> - **Webflow issues:** See [overview-limits-and-collection-lists.md Section 3] (../../implementation/webflow-patterns/overview-limits-and-collection-lists.md#3-collection-list-patterns) (DeepSeek unit)

### Review fixes

- [x] T097 Apply fix unit review-findings.json:R01 (scratch/fix-chain-review.json) to `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md`. Check: `grep -c 'Every Webflow link label that showed a file name from before the reference split' .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md` prints `1` Evidence: `grep -c 'Every Webflow link label that showed a file name from before the reference split' .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md` -> 1 (DeepSeek unit)
- [x] T098 Apply fix unit orchestrator-units.json:O01 (scratch/fix-chain-review.json) to `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md`. Check: `grep -c 'Two dead anchors open again' .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md` prints `1` Evidence: `grep -c 'Two dead anchors open again' .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md` -> 1 (DeepSeek unit)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T077 Every unit landed. Run `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/check-units.cjs`. Expected: no `MISMATCH` line and `62/62 checks matched`. (`S/dispatch-units.json`) Evidence: `node S/check-units.cjs` -> 62/62 checks matched, no MISMATCH line
- [x] T078 REQ-001, no underscore label remains. Run `rg -n '\[[a-z]+_[a-z_]+\.md\]' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**'; echo "exit=$?"`. Expected: the search prints nothing and exits 1, so the only output is `exit=1`. (`.skilled/skills/sk-code/sk-code-webflow/`) Evidence: `rg -n '\[[a-z]+_[a-z_]+\.md\]' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**'; echo exit=$?` -> exit=1 and nothing else
- [x] T079 REQ-002, every relabelled link shows its own target and the target resolves. Run `bash specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/check-labels.sh`. Expected: no `BAD` line and `OK=59 BAD=0`. (`S/check-labels.sh`) Evidence: `bash S/check-labels.sh` -> OK=59 BAD=0, no per-row BAD line
- [x] T080 REQ-003, the playbook root passes the document validator. Run `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md; echo "exit=$?"; grep -n '^## 1. OVERVIEW' .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md`. Expected: a `VALID` line (not `INVALID`), `Total issues: 1`, one `[document_type_fallback]` warning, no `missing_required_section` line, `exit=0`, then `3:## 1. OVERVIEW`. The one warning stays because no type rule matches a playbook root (plan.md D4). (`.skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md`) Evidence: `validate_document.py` on the playbook root -> VALID, Total issues: 1, one [document_type_fallback] warning, exit=0; `grep -n '^## 1. OVERVIEW'` -> 3:## 1. OVERVIEW
- [x] T081 REQ-004, the playbook package still validates. Run `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/playbook-after.txt 2>&1; echo "exit=$?"; diff specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/playbook-before.txt specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/playbook-after.txt; echo "diff exit=$?"`. Expected: `exit=0`, no diff line and `diff exit=0`, so the last line is still `PASS package=sk-code/sk-code-webflow tier=FAIL_CLOSED scenarios=13 categories=4 operator=13 routing_gold_excluded=0 violations=0 warnings=0`. (`S/playbook-after.txt`) Evidence: `validate-playbook-package.cjs --package .../manual-testing-playbook` -> PASS package=sk-code/sk-code-webflow tier=FAIL_CLOSED scenarios=13 categories=4 operator=13 routing_gold_excluded=0 violations=0 warnings=0, exit=0
- [x] T082 REQ-005, version and changelog. Run `grep -n '^version:' .skilled/skills/sk-code/sk-code-webflow/SKILL.md .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md; cmp specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/units/webflow-changelog-v1.1.2.0.md .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md && echo same; python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md | grep 'VALID\|Total issues'; python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md | grep 'hard blockers'`. Expected: `.skilled/skills/sk-code/sk-code-webflow/SKILL.md:5:version: 1.1.2.0`, `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md:10:version: 1.1.2.0`, `same`, a `VALID` line, `Total issues: 0` and `hard blockers:          0`. (`.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md`) Evidence: `grep -n '^version:'` -> SKILL.md:5:version: 1.1.2.0 and changelog:10:version: 1.1.2.0; `cmp` -> same; validator -> VALID, Total issues: 0; hvr_scan -> hard blockers: 0
- [x] T083 REQ-006, the drift guards hold. Run `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/drift-after.txt 2>&1; echo "exit=$?"; grep -n 'PASS: \|FAIL: \|guards PASSED\|doc-claims:' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/drift-after.txt; grep -c 'sk-code-webflow' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/drift-after.txt`. Expected: `exit=0`, four `PASS:` lines, `doc-claims: 4/4 checks passed`, `run-all-drift-guards: all 4 guards PASSED`, and a `sk-code-webflow` count no higher than the same count on `S/drift-before.txt`. If a guard fails, the problem lines name the file. A failing line that names a `sk-code-webflow` file is this phase's to fix; one that names only another packet belongs to a sibling and is recorded, not fixed. (`S/drift-after.txt`) Evidence: `run-all-drift-guards.sh` -> exit=0, 4 PASS lines, doc-claims: 4/4 checks passed, run-all-drift-guards: all 4 guards PASSED; sk-code-webflow count 0 before and after
- [x] T084 REQ-006, the checker fixtures keep their verdicts. Rerun the T009 command. Expected: `bad exit=1` and `good exit=0`, the same as T009. (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs`) Evidence: T009 command rerun -> bad exit=1, good exit=0
- [x] T085 REQ-006, every edited Markdown file keeps its validator verdict and hard-blocker count. Run `bash specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/check-docs.sh > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/docs-after.txt; diff specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/docs-before.txt specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/docs-after.txt; echo "diff exit=$?"`. Expected: no diff line and `diff exit=0`. (`S/docs-after.txt`) Evidence: `bash S/check-docs.sh > S/docs-after.txt; diff S/docs-before.txt S/docs-after.txt` -> empty, diff exit=0
- [x] T086 REQ-007, each edited file changed only the planned lines. Run `diff -rq -x 'workflow-*.md' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/before/sk-code-webflow .skilled/skills/sk-code/sk-code-webflow | wc -l; diff -r -x 'workflow-*.md' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/before/sk-code-webflow .skilled/skills/sk-code/sk-code-webflow | grep -c '^<'; diff -r -x 'workflow-*.md' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/before/sk-code-webflow .skilled/skills/sk-code/sk-code-webflow | grep -c '^>'`. Expected: `26` (25 changed files and one `Only in` line for the changelog), `60` and `62`: 59 label lines and the version line removed, and their replacements plus the two lines of the new heading added. (`S/before/sk-code-webflow/`) Evidence: `diff -rq -x 'workflow-*.md' S/before/sk-code-webflow .skilled/skills/sk-code/sk-code-webflow | wc -l` -> 27, then 62 removed and 64 added lines; the planned 26, 60 and 62 plus the two handoff lines in systematic-four-phases.md (T095 and T096), whose targets are the only link targets that changed
- [x] T087 Hermes copies drift only where this phase edited a skill, read only. Run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/hermes-after.txt 2>&1; echo "exit=$?"; cat specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/hermes-after.txt`. Expected: `exit=1`, the `DRIFT` lines recorded in T010 (if any) plus one line naming `sk-code-webflow`, and lines for siblings that built since T010. Record what prints. The orchestrator clears it in T075. (`S/hermes-after.txt`) Evidence: `sync-skills-hermes.cjs --check` -> exit=1, DRIFT sk-code, sk-code-opencode, sk-code-quality, sk-code-review, sk-code-webflow, system-spec-kit (6 drifted); baseline had only sk-code-review; sibling builds explain the rest, orchestrator clears it in T075
- [x] T088 Routing inputs. Run `node .skilled/bin/compiled-route-guard.cjs | grep 'sk-code '; node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code; echo "exit=$?"`. Expected: a `sk-code` line ending in `fresh` or naming the route stale, which T076 resolves (record which), then the T011 leaf-manifest line and `exit=0`. This phase adds no file under `references/` or `assets/`, so the leaf manifest must not change. If it reports stale, record the output and do not regenerate it. (`.skilled/skills/sk-code/leaf-manifest.json`) Evidence: `compiled-route-guard.cjs | grep 'sk-code '` -> sk-code stale-manifest (baseline fresh; sibling edits, T076 resolves); `generate-leaf-manifest.cjs --check` -> leaf-manifest.json OK (59ea33fd...), exit=0
- [x] T089 SC-001, a reader sees the path each link opens. Confirm T078 printed only `exit=1` and T079 printed `OK=59 BAD=0` in this run. Expected: both observed. (`.skilled/skills/sk-code/sk-code-webflow/`) Evidence: T078 printed only exit=1 and T079 printed OK=59 BAD=0 in this run
- [x] T090 SC-002, both playbook roots validate the same way. Run `for f in .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md; do python3 -I .skilled/skills/sk-doc/scripts/validate_document.py "$f" | grep -c 'Total issues: 1'; python3 -I .skilled/skills/sk-doc/scripts/validate_document.py "$f" | grep -cw INVALID; done`. Expected: `1`, `0`, `1`, `0`. (`.skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md`) Evidence: validator loop over both playbook roots -> 1, 0, 1, 0
- [x] T091 SC-003, no existing gate changed its verdict. Confirm T081, T083, T084 and T085 each showed their expected result in this run. Expected: all four observed. (`.skilled/skills/sk-code/sk-code-webflow/`) Evidence: T081, T083, T084 and T085 each showed their expected result in this run
- [x] T092 Fill `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/implementation-summary.md` from the evidence above, replacing every bracketed placeholder. Record the two items fixed, the 26 files changed, that no Hermes copy was regenerated and that the orchestrator owns T075 and T076. State that the playbook root keeps one `document_type_fallback` warning and why (plan.md D4). Expected: `grep -c '\[What\|\[Opening\|\[path\]\|\[Limitation\]' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/implementation-summary.md` prints `0`. (`specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/implementation-summary.md`) Evidence: `grep -c '\[What\|\[Opening\|\[path\]\|\[Limitation\]' S/../implementation-summary.md` -> 0
- [x] T093 REQ-007, scope check, last edit check. Run `git status --porcelain -- .skilled/skills/sk-code/sk-code-webflow > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/status-after.txt; LC_ALL=C sort specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/status-after.txt > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/status-after-sorted.txt; diff specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/status-expected.txt specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/status-after-sorted.txt; echo "diff exit=$?"; git status --porcelain -- .hermes/skills/sk-code-webflow | wc -l`. Expected: no diff line, `diff exit=0` and `0`. The expected file lists 25 ` M` lines and one `??` line for `changelog/v1.1.2.0.md`. T001 recorded an empty baseline, so every line here is this phase's. (`S/status-expected.txt`) Evidence: `diff S/status-expected.txt S/status-after-sorted.txt` -> one extra line, ` M .../debugging-workflows/systematic-four-phases.md` (the child 005 handoff, T095 and T096), nothing else; `git status --porcelain -- .hermes/skills/sk-code-webflow | wc -l` -> 0
- [x] T094 Validate this folder. Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook --strict`. Expected: `RESULT: PASSED`. (`specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/`) Evidence: `validate.sh <folder> --strict` after `repair-derived.cjs --apply` -> Summary: Errors: 0  Warnings: 0, RESULT: PASSED
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
