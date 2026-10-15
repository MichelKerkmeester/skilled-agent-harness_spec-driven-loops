---
title: "Implementation Summary"
description: "The /doctor:git setup battery is hardened: DEGRADED exit 3, truthful suppression and adapter checks, repairs proved by round trips and a closed trust boundary. 23 of 25 criteria Met, push and real-runtime run open."
trigger_phrases:
  - "setup check hardening implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/033-git-setup-customization/005-setup-check-hardening"
    last_updated_at: "2026-10-15T17:49:54Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the setup-check hardening, 23 of 25 criteria Met"
    next_safe_action: "Run DOC-384 in a real runtime, then push and read the three CI runs"
    blockers:
      - "AC-016 needs a push and the Gate Inputs run read"
      - "AC-020 needs DOC-384 run in a real runtime"
    key_files:
      - ".skilled/commands/doctor/scripts/git-setup-check.cjs"
      - ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs"
      - ".skilled/commands/doctor/assets/doctor-git-setup.yaml"
      - ".github/workflows/gate-inputs.yml"
      - "specs/sk-git/033-git-setup-customization/005-setup-check-hardening/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-setup-check-hardening"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-setup-check-hardening |
| **Completed** | Built and verified locally on 2026-10-15. Not closeable: AC-016 and AC-020 are open |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:git setup` now says what it knows and nothing more. A run that is unsure ends DEGRADED with exit 3 instead of OK, and every repair line it can print has been applied to a failing fixture and turned the row PASS.

### Phase 5: setup-check-hardening

- **Status model.** Any FAIL row gives `STATUS=FAIL` and exit 1. Otherwise any UNKNOWN or DEGRADED row gives `STATUS=DEGRADED` and exit 3. Otherwise `STATUS=OK` and exit 0. A usage error still exits 2.
- **Suppression.** The row reads the saved `hook-flags.env` the way the hooks do, with BOM, quotes, trailing comments and `HOOK_FLAGS_CONFIG`. An environment value wins even when empty. The repair names the variable or the file line.
- **AI-tool hooks.** The advisory counts only under the event and matcher that fire it for Claude, Codex, Devin and Cursor. OpenCode and Pi need their event hook and the shared module import. A run with no active tool is UNKNOWN and names `--tool`.
- **Gates.** A failed or unparseable helper report is UNKNOWN with no repair. A gate saved off is DEGRADED. An inherited `GATE_REGISTRY` is dropped.
- **Repairs.** Worktrees name the variable that set the base. Install restores exactly the missing paths. Standards unset the contract dir at the scope that set it. Hooks name this checkout's installer in this checkout and `git config core.hooksPath` elsewhere.
- **Trust boundary.** `GIT_DIR` and its siblings are dropped, git and bash run from absolute paths, relative `PATH` entries are removed, every repository read goes through a non-blocking, no-follow reader with a 1 MiB cap, and a symlinked allowlist is refused.
- **Docs and CI.** The setup YAML, presentation, DOC-384, the playbook row, the catalog leaf and the root README state exits 0, 3, 1 and 2. The hooks README matchers match the real wiring. Gate Inputs installs the packages its hook tests load. The durable-directory manifest was regenerated.
- **Evidence repair.** 002 and 034 tasks and criteria now cite commands a reviewer can rerun.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | Status model, truthful checks, safe repairs, trust-boundary hardening |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | 17 to 44 tests: status matrix, negative fixtures, round trips, adversarial reader and PATH tables |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Modified | Exit 3 maps to DEGRADED, the three STATUS lines, the adapter promise |
| `.skilled/commands/doctor/assets/doctor-git-presentation.txt` | Modified | Mutation class from the route, DEGRADED result block, the four exits |
| `.skilled/skills/sk-git/scripts/hooks/README.md` | Modified | Claude and Codex matcher cells |
| `.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md` | Modified | DOC-384 precondition and exits |
| `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` | Modified | DOC-384 summary row |
| `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md` | Modified | Leaf title and exit-code sentence |
| `README.md` | Modified | `--tool`, the four exits and the three STATUS lines |
| `.github/workflows/gate-inputs.yml` | Modified | Setup Node and an install step before the hook tests |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Regenerated | One directory added, derived count 777 to 778 |
| `002-doctor-git-setup/acceptance-criteria.md`, `tasks.md`, `graph-metadata.json` | Modified | Rerunnable evidence, metadata re-derived |
| `../../034-standards-template-round-trip/tasks.md`, `graph-metadata.json` | Modified | Rerunnable evidence, metadata re-derived |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each change outside the spec folder went to DeepSeek through cli-pi as one short brief, the operator's execution model. Before each dispatch the targets were backed up. After it the orchestrator diffed against the backup, rejected anything outside the brief, ran the suite and ran a mutation check: the old behavior restored, at least one new test failing, the file restored and compared with `cmp`. Every mutation failed as expected. Spec-folder docs were written by the orchestrator.

Deviations, each recorded in the task evidence:

1. The manifest was regenerated by the orchestrator through the test's own `--write` mode, not by DeepSeek.
2. One test comment in the no-write test was corrected by hand after DeepSeek left it inaccurate.
3. DeepSeek added an unbriefed `PATH` narrowing. A mutation showed it was needed, so it was kept and moved into `main()` as `narrowPath()` by a follow-up brief, so requiring the module leaves `PATH` alone.
4. `repair-derived.cjs --apply` was run on 002 and 034 after their evidence edits, to clear the fingerprint and description drift strict validation reported.
5. Two briefs were split in two, and one extra brief was added to finish the exit-code docs for AC-006.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| DEGRADED exits 3 when a row is UNKNOWN or a gate is saved off | Operator decision 1. A battery that says OK while unsure misleads every other row |
| The hooks repair names this checkout's installer in this checkout, and `git config core.hooksPath` to this checkout's hooks folder elsewhere | Operator decision 2, option A. The installer reads its source tree from the working directory, so naming it for another repository would link that repository's own hooks |
| DEGRADED is also a row result, used only by the gates row | Kept by the operator, so the per-row table agrees with the run status |
| The Codex matcher must match both `exec` and `Bash` | The real wiring is `exec\|Bash`, and Codex sends `Bash` from 0.160 |
| `PATH` is narrowed inside `main()`, not at load time | Child scripts and in-process modules also look up git through `PATH`, and a plain `require()` must not change the caller's environment |
| The `hard-rules.json` overlay stays out | Operator decision 3 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `run-all.sh` | Before: 7 suites, node tests 302 of 302. After: `[run-all] 7 suite(s) passed, 0 failed`, node tests 329 of 329, other suites unchanged, no new warning |
| Battery `--tool claude` on this checkout | `STATUS=OK checks=11`, exit 0, 0.57 s against 0.61 s before |
| `route-validate.sh` | `OK: route-validate - 14 routes validated, 2 warnings`, the two existing H1 notes |
| `check-gate-inputs.sh` | `RESULT: PASSED`, inputs resolved 215 to 218 |
| `check-gate-inputs.test.sh` | `check-gate-inputs: 50 passed, 0 failed` |
| `test_readme_manifest.py` | Before exit 1, not reproducible. After exit 0, `reproduced=True` |
| `validate_catalog_package.py` | Before exit 1, leaf title mismatch. After exit 0, `PASS: 0 violations`, fixtures ALL PASS |
| `hvr_scan.py` hard blockers | 0 on the catalog leaf, DOC-384, the setup YAML and `README.md`. 0 on the added lines of the other three. The hooks README keeps 32, the playbook 53 and the presentation 4, all present before this phase |
| Mutation checks | Every code fix failed at least one test with its old behavior restored, listed per task in `tasks.md` |
| `validate.sh specs/sk-git/033-git-setup-customization --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **CI is unread.** AC-016 and T035 need a push and a read of the Gate Inputs, sk-doc Script Tests and Feature catalog runs. No push was authorized.
2. **DOC-384 was not run in a real runtime.** AC-020, T034 and CHK-021 need `/doctor:git setup` run by an operator. The battery itself ran on this checkout.
3. **Pre-existing HVR blockers remain.** The hooks README, the playbook and the presentation keep their earlier counts. Clearing them means rewriting text outside this phase's scope.
4. **Adjacent docs not changed.** `.skilled/commands/doctor/scripts/README.md:67` still lists PASS, FAIL, SKIP or UNKNOWN without DEGRADED. The battery's header comment does not list the STATUS lines. The hooks-check comment says the installer runs `validate-message.mjs`, which it does only under `--status`.
<!-- /ANCHOR:limitations -->

---
