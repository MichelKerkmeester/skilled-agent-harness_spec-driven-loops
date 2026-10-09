---
title: "Implementation Plan: Phase 4: webflow-checker-fix"
description: "The Webflow minified-runtime checker records errors thrown by the setTimeout, requestAnimationFrame and Webflow.push callbacks it already invokes, and fails the script when any are recorded, with a nesting cap so polling scripts do not overflow the stack. Seeded fixtures prove the checker fails on callback errors and still passes guarded and polling scripts, a new unittest makes the stack-folder validator exit 1 on an orphan folder, and both script README tables list the new inputs."
trigger_phrases:
  - "webflow checker fix plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: webflow-checker-fix

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node.js ES module run in a `vm` sandbox), Python 3 scripts, bash |
| **Framework** | None. Node built-ins `fs`, `path` and `vm`, Python `unittest`, `subprocess` and `tempfile` |
| **Storage** | None |
| **Testing** | Fixture runs of `test-minified-runtime.mjs`, a Python unittest for `verify_stack_folders.py`, `run-all-drift-guards.sh` |

### Overview
The checker's three timer stand-ins run callbacks inside empty `catch (e) {}` blocks (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:118-123`, `:127-132`, `:186-191`), so a script whose deferred code throws still gets PASS. This phase routes those three stand-ins through one helper that records each thrown error, and `test_file` fails the script when the record is not empty. Listeners stay no-ops, so the checker only judges callbacks it already runs, and a nesting cap stops a polling script from overflowing the stack. Seeded fixtures then prove both directions, and a unittest gives `verify_stack_folders.py` its first known-bad input. The two script README tables gain rows for the new inputs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place extension of an existing CLI checker, plus seeded fixtures and one unittest

### Key Components
- **Callback runner in `create_mock_environment`**: one local function inside `test-minified-runtime.mjs:33` that runs a stand-in callback, pushes any thrown value with its source name onto a `callback_errors` array, and skips the call when the synchronous nesting depth reaches a hardcoded cap. The `setTimeout`, `requestAnimationFrame` and `Webflow.push` stand-ins call it instead of their own `try {} catch (e) {}`.
- **Nesting cap**: a constant in section 1 of the checker (`test-minified-runtime.mjs:19-26`). The stand-ins run timers synchronously, which no browser does, so a retry loop that polls for an element the stand-in page never returns would recurse until `RangeError: Maximum call stack size exceeded`. A probe of the uncapped fix failed such a polling script on that error. With a cap of 20 the same script passed, and the seeded throws still failed.
- **Failure branch in `test_file`**: after `vm.runInContext` returns (`test-minified-runtime.mjs:338-341`) and before the PASS return (`:354-357`), a non-empty `callback_errors` returns `{ status: 'FAIL', error, stack }`. `main()` already prints `error` and three stack lines (`:410-416`) and exits 1 on any failure (`:428-432`), so it does not change.
- **Webflow fixtures**: `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad/` and `.../known-good/`, each holding `src/2_javascript/z_minified/*.js`. That nesting is required because the checker reads `OUTPUT_DIR = 'src/2_javascript/z_minified'` relative to the working directory (`:23`) and takes no arguments (`:7`). The `-fixture` suffix keeps the files out of the alignment-drift scan, which skips any directory named `fixture` or ending in `-fixture` (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py:80`, `:263`).
- **Validator unittest**: `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_stack_folders.py`. The validator derives its references folder from its own location (`verify_stack_folders.py:13-14`) and takes no root argument, and the spec does not list it for modification. So the test copies the validator into a temporary `assets/scripts/` folder beside a temporary `references/` tree and runs the copy. The orphan case adds one folder outside the known set (`:15-16`) and expects exit 1 with the orphan message (`:33`, `:38-39`). The control case expects exit 0 with the `OK:` line (`:42`). The test loads the module the way `test_verify_alignment_drift.py:21-29` does, to read the language set rather than repeat it.
- **Script README tables**: `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/README.md` gains a `runtime-fixture/` row in its structure table (`:69-73`) and a real purpose for the checker row (`:72`). Its `Code files | 3` (`:31`) stays, because the README counts direct files only (`:32`). `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md` gains a `test_verify_stack_folders.py` row after `:73`, and its `Code files` count (`:33`) goes from 3 to 4.

### Data Flow
The checker reads each `.js` file under `./src/2_javascript/z_minified`, builds a fresh stand-in window, and runs the file in a `vm` context. Top-level throws already reach the outer `catch` (`:358-364`). Callback throws now land in `callback_errors`, and `test_file` turns a non-empty array into FAIL. `main()` counts the results and sets the exit status.

Known-good scripts keep passing because they null-check before they dereference. Every element lookup returns null or an empty array in the stand-in page (`:52`, `:71`, `:74-75`). A guarded script returns early inside its callback and records no error, which matches the Webflow guard-early rule (`.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md:118-125`). The one in-repo asset whose callbacks the stand-ins invoke, `assets/animation/snippets/cdn-bootstrap.js`, guards its lookup at `:23-24` and passed the probed fix. An unguarded dereference inside an invoked callback now fails. That matches what an unguarded top-level lookup already does today.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Known-bad Webflow fixture**: four scripts, one per invoked callback source plus an unguarded lookup inside `Webflow.push`. Run from `runtime-fixture/known-bad/`. Expected result: exit 1, `Failed:  4/4`, and each FAIL line names its source.
- **Known-good Webflow fixture**: a guarded init that runs through `Webflow.push`, `setTimeout` and `requestAnimationFrame`, and an unbounded poll for a late element. Run from `runtime-fixture/known-good/`. Expected result: exit 0 and `Passed:  2/2`.
- **In-repo Webflow assets**: the 16 runnable `.js` files under `sk-code-webflow/assets/animation/snippets/`, `assets/integrations/` and `assets/patterns/`, copied into a `mktemp -d` tree and removed afterwards. Expected result: 16/16 PASS before and after the fix. `assets/templates/component-template.js` is excluded. Its unfilled public-API placeholder at `component-template.js:193` puts a bracketed name after `window.`, which is a syntax error, so it fails today as well.
- **Stack-folder validator**: `python3 -I test_verify_stack_folders.py -v` runs the control case and the orphan case. The live validator must still print `OK: 6 language folder(s)` and exit 0.
- **Drift gate**: `run-all-drift-guards.sh` must show no new ERROR findings. Its baseline already fails on one unrelated error (see Dependencies). The alignment-drift scan reads only files git tracks (`verify_alignment_drift.py:229-233`), so new untracked files are invisible to it until the operator stages them.
- **README tables**: `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py` on both script READMEs. Both returned `VALID` with 0 issues on 2026-10-09, and both must still do so after the edit.
- **REQ-002 split**: the known-good controls, including the polling script, and every runnable in-repo asset are checked here. The Webflow project's own minified scripts are checked in that project, since they are not in this repository. `implementation-summary.md` records that hand-off.
- **Gap**: no persisted runner wraps the Webflow fixture runs. The commands live in `tasks.md`, in a comment at the top of each fixture file and in the new README row. A runner script is not in the spec's Files to Change table.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node.js with `vm` (v26.8.2 observed) and Python 3 (3.9.6 observed). The unittest uses `from __future__ import annotations` so its type hints load on 3.9.
- Baseline gate state: `run-all-drift-guards.sh` exits 1 before this phase. The cause is one ERROR, `[JSON-PARSE]` in `specs/hooks/022-smart-rule-injection/graph-metadata.json:1`, a working-tree change outside this phase. The phase must not add an ERROR. It must not fix that file either.
- Research input: D1 and its fix caveat in `../001-ponytail-deep-research/research/research.md` Section 7.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the three modified tracked files with `git restore .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs .skilled/skills/sk-code/sk-code-webflow/assets/scripts/README.md .skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md`.
- Delete the new paths `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/` and `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_stack_folders.py`. No other file depends on them.
<!-- /ANCHOR:rollback -->

---
