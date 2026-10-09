---
title: "Tasks: Phase 4: webflow-checker-fix"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "webflow checker fix tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: webflow-checker-fix

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

All commands run from the repository root unless a task says `cd`. `CHECKER` stands for the absolute path of `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs`. The checker takes no arguments and reads `./src/2_javascript/z_minified` from the working directory (`test-minified-runtime.mjs:7`, `:23`), so every fixture run does `cd` into the fixture root first.

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P] Record the drift-gate baseline (`.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`): run `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`, then record the exit status and the `Errors:` and `Warnings:` lines. Expected in the worktree on 2026-10-09: exit 0, `Errors: 0`, `Warnings: 247`, `PASS: stack-folders`. The main checkout showed `Errors: 1` from an unrelated uncommitted file that the worktree does not carry; record whatever this run prints.
- [ ] T002 [P] Record the validator baseline (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py`): run `python3 -I .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py`. Expected: exit 0 and `OK: 6 language folder(s) all resolve`.
- [ ] T003 [P] Record the in-repo Webflow asset baseline (`.skilled/skills/sk-code/sk-code-webflow/assets/`): run `T=$(mktemp -d) && mkdir -p "$T/src/2_javascript/z_minified" && for f in .skilled/skills/sk-code/sk-code-webflow/assets/{animation/snippets,integrations,patterns}/*.js; do cp "$f" "$T/src/2_javascript/z_minified/$(basename "$(dirname "$f")")__$(basename "$f")"; done && (cd "$T" && node "$CHECKER"); echo "exit=$?"; rm -rf "$T"`. Expected: `Passed:  16/16` and exit 0.
- [ ] T004 [P] Reproduce the defect in a temporary tree (`test-minified-runtime.mjs:118-132`, `:186-191`): write `window.setTimeout(function () { throw new Error('timer boom'); });` to `$T/src/2_javascript/z_minified/deferred-throw.js` in a `mktemp -d` tree, run the checker from `$T`, then `rm -rf "$T"`. Expected: `RESULT: PASS` and exit 0, which is the defect.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Create the known-bad Webflow fixture with four one-line scripts. Each opens with a `//` comment naming the callback source it exercises and the run command `cd <this fixture root> && node <path to test-minified-runtime.mjs>`. Files: `throw-in-timeout.js` holds `window.setTimeout(function () { throw new Error('timer callback failed'); }, 50);`. `throw-in-animation-frame.js` holds `window.requestAnimationFrame(function () { undefined_frame_helper(); });`. `throw-in-webflow-push.js` holds `window.Webflow.push(function () { throw new TypeError('push callback failed'); });`. `unguarded-lookup-in-push.js` holds `window.Webflow.push(function () { document.querySelector('[data-hero]').classList.add('is-ready'); });` (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad/src/2_javascript/z_minified/`)
- [ ] T006 [P] Create the known-good Webflow fixture with two scripts, each opening with the same purpose and run-command comment (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-good/src/2_javascript/z_minified/`). `guarded-init.js` follows the component lifecycle in `.skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.js:142-163`. It sets an init flag, calls `window.Webflow.push(start)`, and `start` calls `setTimeout(init, 50)`. `init` returns early when `document.querySelectorAll('[data-component="example"]')` is empty, returns early when `document.querySelector('[data-target]')` is null, and calls `requestAnimationFrame` with a callback that also null-checks before touching the element. `late-element-poll.js` calls `window.Webflow.push(poll)`, where `poll` looks up `document.querySelector('[data-late]')`, calls `setTimeout(poll, 100)` and returns when the result is null, and otherwise adds a class. It has no retry limit, so it proves the nesting cap.
- [ ] T007 Confirm the fixtures pass under the unchanged checker, which is the defect on real inputs: run `(cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad && node "$CHECKER"); echo "exit=$?"`. Expected: `Passed:  4/4` and exit 0. Then run the same command in `runtime-fixture/known-good`. Expected: `Passed:  2/2` and exit 0. (`runtime-fixture/`)
- [ ] T008 Add the D1 detection to the header comment list at `test-minified-runtime.mjs:9-13`, as one bullet: `- Errors thrown inside setTimeout, requestAnimationFrame and Webflow.push callbacks`. (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs`)
- [ ] T009 Add `const MAX_SYNC_CALLBACK_DEPTH = 20;` to section 1 after `SKIP_FOLDERS` (`test-minified-runtime.mjs:26`). Put a one-line WHY comment above it: the stand-ins run timers synchronously, so an unbounded retry loop would otherwise recurse until the call stack overflows. (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs`)
- [ ] T010 Change `function create_mock_environment()` at `test-minified-runtime.mjs:33` to `function create_mock_environment(callback_errors)`. At the top of its body, add `let callback_depth = 0;` and a local `run_callback(source, callback)` that returns without calling when `callback_depth >= MAX_SYNC_CALLBACK_DEPTH`. Otherwise it increments the depth, calls `callback()` in `try`, pushes `{ source, error }` onto `callback_errors` in `catch`, and decrements the depth in `finally`. Put a one-line WHY comment above it: only callbacks the stand-ins actually invoke are judged, because listeners never fire and every element lookup returns null. (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs`)
- [ ] T011 Replace the three empty catches. The `setTimeout` stand-in at `test-minified-runtime.mjs:118-123` becomes `(fn) => { run_callback('setTimeout', fn); return 1; }`. The `requestAnimationFrame` stand-in at `:127-132` becomes `(fn) => { run_callback('requestAnimationFrame', () => fn(0)); return 1; }`. `Webflow.push` at `:187-191` becomes `(fn) => { run_callback('Webflow.push', fn); }`. Leave every `addEventListener` no-op (`:47`, `:81`, `:116`, `:137`) and the observer stand-ins (`:243-268`) unchanged. (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs`)
- [ ] T012 In `test_file`, replace `const mock_env = create_mock_environment();` at `test-minified-runtime.mjs:331` with `const callback_errors = [];` followed by `const mock_env = create_mock_environment(callback_errors);`. (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs`)
- [ ] T013 In `test_file`, between the `vm.runInContext` call (`test-minified-runtime.mjs:338-341`) and the init-flag check (`:343`), return a failure when `callback_errors.length > 0`. Take the message as `first.error && typeof first.error.message === 'string' ? first.error.message : String(first.error)`, because errors thrown in the `vm` context come from another realm and fail `instanceof Error`. Return `{ status: 'FAIL', error, stack: first.error && first.error.stack }`, where `error` is a template literal that reads `N deferred callback error(s), first in SOURCE: MESSAGE` with `N` as `callback_errors.length`, `SOURCE` as `first.source` and `MESSAGE` as `message`. Leave `main()` (`:371-436`) unchanged. (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs`)
- [ ] T014 [P] Create the validator unittest, using the header banner and `load_module` pattern of `test_verify_alignment_drift.py:1-29`. A helper builds `<tmp>/assets/scripts/` with a `shutil.copy2` of `verify_stack_folders.py`, plus `<tmp>/references/<name>/` for every name in the loaded module's `KNOWN_LANGUAGES | EXEMPT_NON_LANGUAGE_DIRS` (`verify_stack_folders.py:15-16`) and any extra names. It runs the copy with `[sys.executable, "-I", str(copy)]` and `check=False`. `test_known_language_tree_passes` expects return code 0 and `OK: 6 language folder(s)` in stdout. `test_orphan_folder_fails` adds `not-a-language` and expects return code 1, `orphan references folder not a known language` and `not-a-language` in stdout, and `1 stack-folder problem(s) found.` in stdout. End with `if __name__ == "__main__": unittest.main()`. (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_stack_folders.py`)
- [ ] T015 [P] Update the Webflow scripts README structure table. Insert a row between `minify-webflow.mjs` (`README.md:71`) and `test-minified-runtime.mjs` (`:72`): `` | `runtime-fixture/` | Known-bad and known-good inputs for `test-minified-runtime.mjs`. Run the checker from `known-bad/`, which must fail, or from `known-good/`, which must pass. | ``. Replace the purpose cell of the `test-minified-runtime.mjs` row at `:72` with `Runs each minified script in a stand-in browser and fails on top-level errors and on errors thrown by the setTimeout, requestAnimationFrame and Webflow.push callbacks it invokes.` Leave `Code files | 3` at `:31` unchanged, because the README counts direct files only (`:32`) and the fixtures sit in a subfolder. (`.skilled/skills/sk-code/sk-code-webflow/assets/scripts/README.md`)
- [ ] T016 [P] Update the opencode scripts README. Change `| Code files | 3 |` at `README.md:33` to `| Code files | 4 |`. Insert a row after `test_verify_alignment_drift.py` (`:73`): `` | `test_verify_stack_folders.py` | Builds a temporary references tree and proves `verify_stack_folders.py` exits 1 on an orphan folder and 0 on a clean tree. | ``. (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Syntax check: run `node --check .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs` and `python3 -I -m py_compile .skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_stack_folders.py`. Expected: both exit 0 with no output.
- [ ] T018 REQ-001, deferred throw fails: run `(cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad && node "$CHECKER"); echo "exit=$?"`. Expected: exit 1, `Failed:  4/4`, and four FAIL lines reading `1 deferred callback error(s), first in <source>`, where `<source>` is `setTimeout`, `requestAnimationFrame` and `Webflow.push` (twice, once for the thrown error and once for the unguarded lookup).
- [ ] T019 REQ-002, known-good controls including the polling script pass: run the T018 command in `runtime-fixture/known-good`. Expected: exit 0, `Passed:  2/2`, a PASS for both `guarded-init.js` and `late-element-poll.js`, and no `Maximum call stack size exceeded` text.
- [ ] T020 REQ-002, every runnable in-repo asset passes: rerun the T003 command. Expected: `Passed:  16/16` and exit 0, identical to the baseline. The temporary tree is removed by the command.
- [ ] T021 REQ-002, the Webflow project's own minified scripts are checked in that project, because they are not in this repository. Nothing runs here. Record in `implementation-summary.md` that the operator runs `node <repo>/.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs` from the Webflow project root. Expected there: exit 0, or a FAIL line that names a real callback error.
- [ ] T022 REQ-003, validator fixture: run `python3 -I .skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_stack_folders.py -v`. Expected: `Ran 2 tests`, `OK` and exit 0. Then run `python3 -I .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py`. Expected: exit 0 and `OK: 6 language folder(s) all resolve`, unchanged from T002.
- [ ] T023 SC-001, no deferred callback error passes silently: run `grep -n 'catch (e) {}' .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs`. Expected: no output and exit 1. Together with T018 this shows every invoked callback source reports its error.
- [ ] T024 SC-002, both checkers have a known-bad input: confirm T018 exited 1 and T022's `test_orphan_folder_fails` passed. Expected: both observed in this run.
- [ ] T025 README tables: run `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-webflow/assets/scripts/README.md` and the same command on `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md`. Expected: `VALID`, `Total issues: 0` and exit 0 for each, the same result both files gave on 2026-10-09 before the edit. Then run `grep -n 'runtime-fixture/\|test_verify_stack_folders.py\|Code files' .skilled/skills/sk-code/sk-code-webflow/assets/scripts/README.md .skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md`. Expected: the two new rows and `Code files | 3` (Webflow) and `Code files | 4` (opencode).
- [ ] T026 Drift gate unchanged: run `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`. Expected: `Errors:` equal to the T001 count, with no new ERROR under `sk-code-webflow/` or `sk-code-opencode/`, and `PASS: stack-folders`. The overall exit equals the T001 exit. New untracked files are not scanned (`verify_alignment_drift.py:229-233`), so record that limit in the summary.
- [ ] T027 Scope check: run `git status --short .skilled/skills/sk-code/`. Expected: three modified files, `sk-code-webflow/assets/scripts/test-minified-runtime.mjs`, `sk-code-webflow/assets/scripts/README.md` and `sk-code-opencode/assets/scripts/README.md`, and two untracked paths, `sk-code-webflow/assets/scripts/runtime-fixture/` and `sk-code-opencode/assets/scripts/test_verify_stack_folders.py`. No `mktemp` tree is left behind.
- [ ] T028 Validate this folder: run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/004-webflow-checker-fix --strict`. Expected: `RESULT: PASSED`.
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
