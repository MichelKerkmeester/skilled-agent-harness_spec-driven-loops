---
title: "Implementation Summary: sk-doc Validator Notices and Dead Playbook Citations"
description: "Complete. validate_document.py now says when it falls back to README rules, quick_validate.py blocks a non-qualified MCP token for skills as for commands, and four dead playbook citations are repointed or removed."
trigger_phrases:
  - "sk doc validator and reference fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes"
    last_updated_at: "2026-09-27T19:45:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase from the build evidence of a9dbac98ef"
    next_safe_action: "None. The phase is Complete; the orchestrator commits"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes/plan.md"
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
      - ".skilled/skills/sk-doc/shared/scripts/quick_validate.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "owner-fix-phase-012"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should system-deep-loop fix the other drifted playbook citations by hand (spec.md section 10)"
      - "Should sk-doc give playbook and feature-catalog root index files their own document types (spec.md section 10)"
      - "Should sk-doc strip quotes from allowed-tools tokens so a quoted non-qualified MCP token is caught (review P2)"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: sk-doc Validator Notices and Dead Playbook Citations

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-sk-doc-validator-and-reference-fixes |
| **Status** | Complete |
| **Completed** | 2026-09-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A README verdict that `validate_document.py` reached only because no type rule matched now says so, a skill can no longer ship a non-qualified MCP tool token, and four playbook citations that pointed past the end of their files are gone.

### sk-doc Validator Notices and Dead Playbook Citations

`validate_document.py` used to check any document it could not type against README rules and report `Document type: readme`, so a reader could not tell a real README verdict from a guess. A private `_detect_document_type_with_source()` now returns the type with its source, `'rule'` or `'default'`, and `detect_document_type()` wraps it and still returns a string, so its three importing test files see no change. When the caller gave no `--type` and the default decided, `validate_document()` adds one `document_type_fallback` entry of severity `warning`, with a message naming the file and a `fix_hint` naming `--type`. `valid` and `exit_code` are still computed from blocking errors only, so the playbook root index still exits 0 and `.skilled/repo-rules/communication.md` still exits 1, each now with the notice.

`quick_validate.py` failed a non-qualified MCP tool token in a command but only warned in a skill, against its own comment that either surface must fully qualify one. The skill-only warning branch is gone, so every package kind gets the same blocking message naming `mcp__<server>__<tool>`, and the docstring's `Validates:` list names the rule. No tracked skill or command carried such a token, so nothing that passed before fails now.

The sk-doc `README.md` troubleshooting row "Wrong document type detected" names the new warning. The two deep-research playbook rows cite `deep-research-presentation.txt:379-388` and `:233-236`, where their anchor text now lives. The two memory-pipeline rows are removed from the recorded `npm run check` capture in the spec-kit playbook, and the capture's note says why and that its `17 violation(s)` count is the original recording.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modified | The source-returning detector and the `document_type_fallback` warning |
| `.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py` | Modified | Two pytest cases: an untyped file gets one notice with its exit code unchanged, and a typed file or a file named `README.md` gets none |
| `.skilled/skills/sk-doc/shared/scripts/quick_validate.py` | Modified | One blocking branch for a non-qualified MCP token, and the docstring rule |
| `.skilled/skills/sk-doc/scripts/tests/test_quick_validate_086.py` | Modified | Case 6 (server-only token, invalid) and Case 7 (wildcard, valid, no token warning) |
| `.skilled/skills/sk-doc/README.md` | Modified | The troubleshooting row names the warning. 1 insertion, 1 deletion |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md` | Modified | Row `:119` cites `deep-research-presentation.txt:379-388` |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/pause-sentinel-halt.md` | Modified | Row `:105` cites `deep-research-presentation.txt:233-236` |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md` | Modified | Two capture rows removed, the note at `:100` extended. 1 insertion, 3 deletions |

All eight files landed in commit `a9dbac98ef`, "fix(sk-doc): flag a README-by-default verdict and block bare MCP tokens in skills", 102 insertions and 24 deletions. The build-start HEAD was `6f47c32dce`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator took the baseline at `6f47c32dce`, after the main merge `d6e512e6b5`, then dispatched six single-change briefs from `scratch/briefs/`. Brief 01 (the fallback warning and its tests) ran on codex gpt-5.5 medium in 120 s. Brief 02 (the token rule and its tests) ran on cursor Grok 4.7 in 116 s, because codex hit its usage limit mid-wave. Briefs 03 to 06 (the README row and the three playbook files) ran on pi over `llmgateway/deepseek-v4.1-flash`, thinking max, in 91, 32, 23 and 47 s. The orchestrator verified each brief's result, reran the whole owner suite, had a Claude reviewer check the GPT and Grok code, and committed the build. These phase docs were then closed from that evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A notice, not a failure, for the README fallback | The owner's contract makes exit 1 the delivery block for a document defect, and `/create:*` workflows validate root index files without `--type`. `goal.md` D1, `spec.md` REQ-001 |
| Keep `detect_document_type()` returning a string | A private helper carries the source, so the three test files that import the public function are untouched |
| Remove, not repoint, the two memory-pipeline rows | The cited import no longer exists anywhere in the 62-line test file. The rows sit in a recorded capture, so the capture's note records the removal. `goal.md` D3 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every check ran from the worktree root on 2026-09-27. The orchestrator ran them unless the row says otherwise.

| Check | Result |
|-------|--------|
| Baseline owner suite, `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` | 24 files PASS, 2 FAIL (`test_readme_manifest.py` "manifest reproduction assertion failed", `test_rename_tooling_fixture_harness.py` `test_default_cli_is_dry_run_deterministic_and_non_mutating`), exit 1 |
| Baseline probes, `validate_document.py ... --json` | Playbook root index exit 0, `readme`, `warnings` `[]`, `total_issues` 0. `communication.md` exit 1, `readme`, no fallback entry, `total_issues` 1 |
| Baseline token count, `_MCP_FULLY_QUALIFIED_RE` over tracked `allowed-tools` outside `specs/` | 0 |
| `ONLY_TESTS=test_structure_validation.py run-script-tests.sh` | `PASS` |
| Playbook probe after brief 01, `--json` | Exit 0, exactly 1 `document_type_fallback` warning, `total_issues` 1, keys `auto_fixable_count`, `blocking_errors`, `document_type`, `file_path`, `total_issues`, `valid`, `warnings`. With `--type readme`: exit 0, no fallback entry. `communication.md`: exit 1, fallback entry present. `py_compile` ok |
| `python3 .skilled/skills/sk-doc/scripts/tests/test_quick_validate_086.py` | `PASS`, exit 0 |
| AC-002 fixture outside the repository, `quick_validate.py` | `[Read, mcp__code_mode]` exit 1, the message "allowed-tools entry 'mcp__code_mode' is a non-fully-qualified MCP tool token" followed by "use mcp__<server>__<tool>". `[Read, mcp__code_mode__call_tool_chain]` exit 0, `Skill is valid!` |
| Briefs 03 to 06 | README diff 1 insertion, 1 deletion. `grep -c` 1 for each new citation and 1 for `memory-pipeline-regressions`. Spec-kit diff 1 insertion, 3 deletions. `validate_document.py` `VALID`, exit 0 on each |
| Dead-citation `rg` from SC-003 over `.skilled/skills` | No output, exit 1 |
| Full owner suite after the build | 24 PASS and the same 2 FAIL by name, exit 1. No new failing name. `PASS test_structure_validation.py`, `PASS test_quick_validate_086.py` |
| Cross-family review (a Claude reviewer) | No P0 or P1. Each new test fails on the pre-build code (0 warnings instead of 1; Case 6 valid came back True). JSON keys and exit codes match old and new on an empty file, with `--type readme` and under `references/`. One notice after `--fix` re-validation, `auto_fixable_count` unchanged. None of 307 skill folders changes verdict. One P2, see Known Limitations |
| Read-only rechecks while closing these docs | `sed -n '233,236p;379,388p'` on the 407-line presentation file prints `### Contract` with the `**Outputs:**` line and the Key Differences block with `Externalized state` and `Negative knowledge`. `validate_document.py` on each of the three playbook files prints `VALID` and `Document type: playbook_feature`, exit 0 |
| `validate.sh --strict` and `check-goal.cjs` on this folder | `RESULT: PASSED` and exit 0 on the final state of these docs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Executor for brief 02.** Cursor Grok 4.7 wrote the `quick_validate.py` change instead of codex gpt-5.5, because codex hit its usage limit ("You've hit your usage limit ... try again at 10:43 PM").
2. **Owner suite failing set.** REQ-006 names four failing files from the planning run. At the build baseline only two failed, so the comparison is by name against that two-file set, a subset of the four.
3. **Dispatch briefs kept.** `scratch/briefs/` stays as the record of what each executor was sent, so `scratch/` is not emptied to `.gitkeep`.
4. **Baselines not saved to scratch.** T003 and T004 named `scratch/suite-baseline.txt` and `scratch/fallback-baseline.txt`. The baselines are recorded in the orchestrator's build evidence and the `goal.md` log instead.
5. **Stale planning pins.** `validate_document.py` changed after planning (`666abc1a22e`, `e33f1a6ff3e`), moving its pins by 11 lines. `research.md` has 159 lines and `memory-pipeline-regressions.vitest.ts` 62, and three test files import `detect_document_type`, not five. The spec, plan and tasks now say so, citing by function name where the build shifts a line.
6. **Parent changelog.** `spec.md` Phase Context asks for a refresh of `../changelog/`, but `specs/cli-jev/003-cli-jev-workflow-integration/changelog/` does not exist, so there was nothing to refresh.
7. **`total_issues` on a fallback.** The notice joins the issue list, so `total_issues` rises by 1 on a fallback document. Every JSON key stays, and no caller that omits `--type` reads `total_issues`.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The owner suite is still red.** `test_readme_manifest.py` and `test_rename_tooling_fixture_harness.py` fail as they did before this phase. They are not this phase's to fix.
2. **A quoted MCP token still passes (review P2, predates this phase).** `quick_validate.py` strips only whitespace from `allowed-tools` tokens, so `"mcp__code_mode"` in quotes is not caught. It sits outside REQ-002 and is recorded for the `sk-doc` owner.
3. **Root index files still validate as `readme`.** A playbook or feature-catalog root index now carries the notice but no type of its own. `spec.md` section 10 asks the owner whether they should get one.
4. **Other drifted playbook citations remain.** Only the four counted dead citations were fixed. `spec.md` section 10 lists the in-range drifts for `system-deep-loop`.
5. **One checklist item is a recorded deviation.** CHK-051 in `tasks.md`, because `scratch/briefs/` is kept on purpose. It is not an acceptance row.
<!-- /ANCHOR:limitations -->

---
