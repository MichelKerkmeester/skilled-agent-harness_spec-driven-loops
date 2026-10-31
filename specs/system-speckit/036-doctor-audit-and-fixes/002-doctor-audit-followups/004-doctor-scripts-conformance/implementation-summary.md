---
title: "Implementation Summary"
description: "Every doctor script now follows the OpenCode standards, has its false-PASS and crash bugs fixed with regression tests, carries no dead code, and runs under one test runner that CI calls."
trigger_phrases:
  - "doctor scripts conformance summary"
  - "doctor test runner shipped"
  - "doctor scripts verification evidence"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/004-doctor-scripts-conformance"
    last_updated_at: "2026-10-03T18:20:00Z"
    last_updated_by: "doctor-scripts-conformance"
    recent_action: "Verified every doctor script fix and wired the runner into CI"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/tests/run-all.sh"
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/commands/doctor/scripts/release-update.cjs"
      - ".github/workflows/spec-kit-check.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-scripts-conformance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Remove mcp-doctor.sh --fix: yes, both MCP workflows forbid it and the request was to leave nothing dead"
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
| **Spec Folder** | 004-doctor-scripts-conformance |
| **Completed** | 2026-10-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The doctor's own scripts now do what their workflows say. Four checks that reported PASS on real drift now catch it, three that crashed on malformed input now report it, and a hub-contract check that never fired on a real command now compares 21 of them. Every script has tests, and one runner executes all of them locally and in CI.

### Doctor scripts conformance

The fixes, by script:

- **`command-catalog-mirror-check.cjs`**: a row now counts only for the command its first backticked id names, so a deleted `/create:skill` row no longer hides behind `/create:skill-parent`. The group table is checked in both directions. A crash exits 2 with `STATUS=ERROR` instead of the drift code.
- **`agent-roster-mirror-check.cjs`**: takes `--root`, survives a broken symlink, skips READMEs, and exits 2 on a crash.
- **`fable-mode-check.cjs`**: no longer prints `STATUS=OK` after measuring nothing. A file target, an unloadable explicit baseline or an empty measurement exits 2, and bad flags are rejected.
- **`skill-graph-freshness.cjs`**: reports skills on disk that the compiled graph lacks, treats an empty compiled map as degraded, and names unreadable metadata instead of calling the skill a ghost.
- **`parent-skill-check.cjs`**: rebuilt as one function per invariant group. Unparseable versions, `null` JSON files and malformed entries now fail instead of passing or crashing. Four contract rules it never checked are enforced. Contract libraries load from the repository root. 3k now reads every list form commands use, and exempts `TodoWrite`, which grants no workspace capability.
- **`release-update.cjs`**: `check` survives a release that deletes an unedited changelog, `align` reads uncommitted edits from the worktree, a second `apply` plans afresh, and units are keyed `kind:name` everywhere, with old name-only records still readable. Prerelease tags order numerically. Rollback takes the apply lock. Plan paths are confined to their units. Error messages name what is missing.
- **`check-mcp-mutation-class.sh`**: covers every script the pre-commit hook sends it, 21 rows where there were 7, and fails on an unlisted one. It accepts `command -v curl` probes, catches split `rm` flags, ignores heredoc text, and exits 2 on a malformed manifest.
- **`doctor-runtime-bootstrap.sh`**: the legacy-directory migration runs before anything creates the target, a missing `flock` no longer reads as a busy lock, a held lock exits 3 and writes state, and the duplicated npm block is one function.
- **`mcp-doctor.sh`**: `--fix`, which both MCP workflows forbid, is gone. Bad arguments exit 3, a `null` config reports FAIL in JSON, and a missing `--root` is an error.
- **`route-validate.sh` and `.py`**: unknown arguments exit 2, an empty manifest exits 2, each self-test fixture asserts its own rule id, and `main()` is split by assertion group.
- **`audit_descriptions.py`**: reads its budget constants from `skill-contract.json`, rejects a negative `--top-n`, and drops a dead `.toml` branch.

Every script carries the standard header and numbered sections. The four tools that check headers, sections and unused names report nothing over the folder.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/*.cjs`, `*.sh`, `*.py` (12 scripts) | Modified | The fixes above, headers, sections, dead code removed |
| `.skilled/commands/doctor/scripts/tests/` (11 new files, 5 updated) | Created/Modified | One suite per script, `run-all.sh`, `README.md` |
| `.skilled/commands/doctor/scripts/README.md` | Modified | Tree, entrypoints, mutation boundaries, the runner and the fixture overrides |
| `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml` | Modified | Rows for the 14 MCP scripts the guard did not cover |
| `.skilled/commands/doctor/assets/doctor-{runtime-mirrors,fable-mode,skill-graph-freshness,mcp-debug,mcp-install,rebuild,skill-budget,update-check,update-align,update-apply}.yaml`, `doctor-update-presentation.txt`, `update.md` | Modified | Exit codes, flags and unit keys as the scripts now behave |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts`, `tests/parent-skill-check-fixtures.vitest.ts` | Modified | Five freshness cases; a stale module-path workaround removed |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs` | Modified | Dead staging helper removed |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Modified | Row 11 names the mirror checkers that own it |
| `.github/workflows/spec-kit-check.yml` | Modified | New `doctor-scripts` job; Pi agent and prompt mirror checks in the mirrors job |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Objective checks ran first: the drift verifier with every opt-in check, shellcheck, syntax checks and the TypeScript unused-locals pass. Four read-only reviews followed, one per file group. Each reviewer reproduced its findings in scratch fixtures, and the parent session re-read the load-bearing ones before any edit. Four implementation workers then owned disjoint file sets and worked test first: each regression test was observed failing against the old script, then passing. The parent session kept the shared surfaces (routes, READMEs, runner, CI), sent two workers back to close items they had left open, and reran every gate itself from the final state. As an independent check it swapped the old versions of two scripts back in. Against them, 7 catalog tests and 19 mutation-guard tests failed, and with the fixed scripts restored all passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Exempt `TodoWrite` in check 3k | It manages only the agent's own task list. Without the exemption, making 3k live would have failed eight `/create:*` commands for a tool that grants nothing |
| Mixed-case aliases warn, not fail | sk-doc carries 16 and sk-design 2. A hard failure would turn both hubs and the CI hub loop red over hub data this phase does not own |
| A checker crash exits 2 | The workflows map 2 to "the audit could not run", and a crash is exactly that, not drift |
| `mcp-doctor.sh` bad arguments exit 3 | Its workflows already map 2 to "failures", so a 2 would read as a broken MCP setup |
| `release-update` may adopt the release for binary and deleted conflicts | No workflow forbids it, and before the change there was no way to take the release side of those conflicts at all |
| `check` keeps fetching the tags base inference needs | A vendored tree has no local tags. The check workflow's allowed exception now names them, instead of the fetch being cut |
| One runner, one CI job | A suite that nothing runs is untested in practice. The five suites that existed before ran nowhere |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` under macOS bash 3.2 | Exit 0. 8 suites: node:test 183 of 183 (9 files), unittest 10 of 10, bash suites 35, 28, 18 and 19 passed with 0 failed, route self-test, freshness panel |
| Advisor vitest: freshness panel, parent-skill fixtures, vocabulary agreement | 23 of 23 |
| `verify_alignment_drift.py --fail-on-warn --check-exact-headers --check-sections --check-folders` over the scripts folder | 28 files, 0 findings (15 before) |
| `shellcheck -S style -x` on every script and shell suite | Exit 0 |
| tsc unused-locals over every `.cjs` script and suite | 0 unused names (4 before) |
| `node --check`, `bash -n`, `py_compile` | Clean |
| Old-code swap: catalog and mutation-guard suites against the HEAD scripts | 7 of 10 and 19 of 35 fail, then all pass with the fixes restored |
| `pre-commit.test.sh` | Exit 0 |
| Workflow YAML parse of `spec-kit-check.yml` | Jobs `check`, `mirrors`, `doctor-scripts` |

Real-tree gates, before and after (exit codes):

| Gate | Before | After |
|------|--------|-------|
| `compiled-route-guard.cjs`, `check-no-spec-imports.cjs` | 0, 0 | 0, 0 |
| `route-validate.sh`, `--self-test` | 0, 0 | 0, 0 |
| `command-catalog-mirror-check.cjs`, `agent-roster-mirror-check.cjs` | 0, 0 | 0, 0 |
| `check-mcp-mutation-class.sh` | 0 (7 scripts) | 0 (21 scripts) |
| `audit_descriptions.py`, `skill-graph-freshness.cjs`, `fable-mode-check.cjs` | 0, 0, 0 | 0, 0, 0 |
| `parent-skill-check.cjs` on sk-code, sk-doc, sk-design, cli-external-orchestration, cli-classifier, mcp-tooling, system-deep-loop | all 0 | all 0 |
| `mcp-doctor.sh --json` | 1 (credential variables unset) | 1 (same) |
| `release-update.cjs check --offline --json` | 0 | 0, unit keys in `kind:name` form |
| Codex, Pi and Hermes mirror `--check` scripts, command-tree parity, contract drift, skill-root metadata, router vocabulary reach, journey proof | all 0 | all 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Mixed-case aliases warn.** 3d-alias reports 16 aliases in sk-doc and 2 in sk-design as warnings. Lowercasing them is a routing-data change for those hubs, after which the check can become a failure.
2. **The new CI job has not run yet.** It runs on the next push that touches `.skilled/commands/**`. Locally the runner passes under macOS bash 3.2. The bash suites have not been run on Linux.
3. **`mcp-doctor.sh --json` exits 1 in this shell** because credential variables are unset. That is the documented warning path, not a defect.
<!-- /ANCHOR:limitations -->
