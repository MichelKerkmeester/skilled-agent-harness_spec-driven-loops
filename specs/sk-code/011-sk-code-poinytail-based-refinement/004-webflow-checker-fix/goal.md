---
title: "Goal: Phase 4: webflow-checker-fix"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/004-webflow-checker-fix"
    last_updated_at: "2026-10-09T17:52:50Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-004-webflow-checker-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: webflow-checker-fix

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the Webflow minified-runtime checker fail a script whose setTimeout, requestAnimationFrame or Webflow.push callbacks throw while it still passes guarded and polling scripts, and give both that checker and the stack-folder validator a known-bad test input.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The checker judges only callbacks its stand-ins already invoke: setTimeout, requestAnimationFrame and Webflow.push. Every addEventListener stand-in stays a no-op, the observer stand-ins stay unchanged and `main()` stays unchanged. |
| D2 | A hardcoded `MAX_SYNC_CALLBACK_DEPTH = 20` in section 1 of `test-minified-runtime.mjs` skips further synchronous callback calls, so a script that polls for a missing element does not overflow the stack. |
| D3 | The Webflow fixtures live in `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad/` and `runtime-fixture/known-good/`, each holding `src/2_javascript/z_minified/*.js`, because the checker takes no arguments and reads that path from the working directory. |
| D4 | The validator's known-bad input is the unittest `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_stack_folders.py`, which runs a copy of the validator in a temporary tree. `verify_stack_folders.py` itself does not change. |
| D5 | The phase modifies only `test-minified-runtime.mjs` and the two script READMEs, and adds only `runtime-fixture/` and `test_verify_stack_folders.py`. It does not fix the pre-existing `[JSON-PARSE]` drift-gate error in `specs/hooks/022-smart-rule-injection/graph-metadata.json`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `(cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad && node ../../test-minified-runtime.mjs); echo "exit=$?"` prints `Failed:  4/4`, four FAIL lines reading `1 deferred callback error(s), first in <source>` whose sources are `setTimeout`, `requestAnimationFrame` and `Webflow.push` (twice), and `exit=1`.
- [ ] From the repository root, `(cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-good && node ../../test-minified-runtime.mjs); echo "exit=$?"` prints `Passed:  2/2`, a PASS for `guarded-init.js` and for `late-element-poll.js`, no `Maximum call stack size exceeded` text, and `exit=0`.
- [ ] From the repository root, `C="$PWD/.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs"; T=$(mktemp -d) && mkdir -p "$T/src/2_javascript/z_minified" && for f in .skilled/skills/sk-code/sk-code-webflow/assets/{animation/snippets,integrations,patterns}/*.js; do cp "$f" "$T/src/2_javascript/z_minified/$(basename "$(dirname "$f")")__$(basename "$f")"; done && (cd "$T" && node "$C"); echo "exit=$?"; rm -rf "$T"` prints `Passed:  16/16` and `exit=0`.
- [ ] `python3 -I .skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_stack_folders.py -v` prints `Ran 2 tests` and `OK`, including a passing `test_orphan_folder_fails`, and exits 0, and `python3 -I .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py` prints `OK: 6 language folder(s) all resolve` and exits 0.
- [ ] `node --check .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs` exits 0 with no output, and `grep -n 'catch (e) {}' .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs` prints nothing and exits 1.
- [ ] `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py` prints `VALID` and `Total issues: 0` and exits 0 for both `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/README.md` and `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md`; `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/README.md` contains a `runtime-fixture/` row and `Code files | 3`, and `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md` contains a `test_verify_stack_folders.py` row and `Code files | 4`.
- [ ] `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` prints `PASS: stack-folders` and an `Errors:` count of 1 or less, with no ERROR line under `sk-code-webflow/` or `sk-code-opencode/`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Known-bad fixture fails with exit 1 and `Failed:  4/4` | Done | four FAIL lines, all four sources, exit 1 |
| Known-good fixture passes with exit 0 and `Passed:  2/2` | Done | both files PASS, no stack overflow, exit 0 |
| In-repo Webflow assets pass `Passed:  16/16` | Done | `Passed:  16/16`, exit 0 |
| Validator unittest passes and the live validator still prints `OK` | Done | `Ran 2 tests`, `OK`; live `OK: 6 language folder(s)` |
| Checker syntax check passes and no empty catch remains | Done | node --check exit 0; grep exit 1 |
| Both script READMEs validate and carry the new rows | Done | both VALID, 0 issues, rows present |
| Drift gate shows no new ERROR and `PASS: stack-folders` | Done | Errors 0, Warnings 247, exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| `rm -rf` refused by the command runner | T003 and T004 no longer delete their temporary trees; the orchestrator deleted them and ran criterion 3 with its cleanup |
<!-- /ANCHOR:log -->
