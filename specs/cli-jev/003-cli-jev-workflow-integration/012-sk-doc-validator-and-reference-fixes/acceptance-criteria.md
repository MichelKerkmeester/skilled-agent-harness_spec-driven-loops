---
title: "Acceptance Criteria: sk-doc Validator Notices and Dead Playbook Citations"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes"
    last_updated_at: "2026-09-27T19:45:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Marked all six criteria Met from the build evidence"
    next_safe_action: "None. The criteria are closed; the orchestrator commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "owner-fix-phase-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: sk-doc Validator Notices and Dead Playbook Citations

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Commands run from the worktree root. `VD` is `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `QV` is `.skilled/skills/sk-doc/shared/scripts/quick_validate.py`, `PR` is `.skilled/commands/deep/assets/deep-research-presentation.txt` and `$SCRATCH` is a directory outside the repository.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a document no type rule matches, When `VD` runs on it without `--type`, Then the result carries one `document_type_fallback` warning and the exit code is what it was before the change | `python3 $VD .skilled/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md --json` exits 0 and its `warnings` holds one entry with `type` `document_type_fallback`. `python3 $VD .skilled/repo-rules/communication.md` exits 1 as before and prints the same warning. The same first file with `--type readme --json` exits 0 with no such entry. The two new pytest cases pass Observed 2026-09-27 after `a9dbac98ef`: the playbook root index exits 0 with exactly one `document_type_fallback` warning (`total_issues` 1, JSON keys `auto_fixable_count`, `blocking_errors`, `document_type`, `file_path`, `total_issues`, `valid`, `warnings`). `communication.md` exits 1 with the fallback entry present. `--type readme` exits 0 with no fallback entry. `ONLY_TESTS=test_structure_validation.py run-script-tests.sh` prints `PASS`. Evidence: `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `_detect_document_type_with_source()` and the fallback block in `validate_document()`; `.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py`, the two `fallback` tests | Met | - |
| AC-002 | REQ-002 | Given a skill whose `allowed-tools` holds a non-qualified MCP token, When `QV` validates it, Then it is invalid, as a command already is | `$SCRATCH/mcp-skill/SKILL.md` with `name: mcp-skill`, a one-line description, `version: 1.0.0.0` and `allowed-tools: [Read, mcp__code_mode]`: `python3 $QV $SCRATCH/mcp-skill` exits 1 and names `mcp__<server>__<tool>`. With `allowed-tools: [Read, mcp__code_mode__call_tool_chain]` it exits 0. `python3 .skilled/skills/sk-doc/scripts/tests/test_quick_validate_086.py` exits 0 with the two new cases Observed 2026-09-27 after `a9dbac98ef`, fixture outside the repository: `[Read, mcp__code_mode]` exits 1 with the message "allowed-tools entry 'mcp__code_mode' is a non-fully-qualified MCP tool token" followed by "use mcp__<server>__<tool>", and `[Read, mcp__code_mode__call_tool_chain]` exits 0 with `Skill is valid!`. `test_quick_validate_086.py` prints `PASS`, exit 0, with Case 6 (server-only, invalid) and Case 7 (wildcard, valid). Evidence: `.skilled/skills/sk-doc/shared/scripts/quick_validate.py:250` | Met | - |
| AC-003 | REQ-003 | Given the Key Differences block in `PR`, When the `exhausted-approach-respect.md` source row is read, Then it cites a range inside `PR` that holds its anchor text | `grep -c 'deep-research-presentation.txt:379-388' .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md` prints `1`. `sed -n '379,388p' $PR` prints lines containing `Externalized state` and `Negative knowledge` Observed 2026-09-27 after `a9dbac98ef`: `grep -c` prints 1, and `sed -n '379,388p'` prints the Key Differences block with `Externalized state` and `Negative knowledge` (reread read-only while closing the docs). Evidence: `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md:119` | Met | - |
| AC-004 | REQ-004 | Given the Contract block in `PR`, When the `pause-sentinel-halt.md` source row is read, Then it cites a range inside `PR` that holds its anchor text | `grep -c 'deep-research-presentation.txt:233-236' .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/pause-sentinel-halt.md` prints `1`. `sed -n '233,236p' $PR` prints `### Contract` and the `**Outputs:**` line Observed 2026-09-27 after `a9dbac98ef`: `grep -c` prints 1, and `sed -n '233,236p'` prints `### Contract` and the `**Outputs:**` line (reread read-only while closing the docs). Evidence: `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/pause-sentinel-halt.md:105` | Met | - |
| AC-005 | REQ-005 | Given the memory-pipeline test no longer imports `../../shared/embeddings`, When the spec-kit playbook capture is read, Then its two dead rows are gone and its note says why | `grep -c 'memory-pipeline-regressions' .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md` prints `1`, the one hit being the extended note. `rg -n -e 'deep/research\.md:307' -e 'deep/research\.md:176' -e 'regressions\.vitest\.ts:67' -e 'regressions\.vitest\.ts:109' .skilled/skills` prints nothing Observed 2026-09-27 after `a9dbac98ef`: `grep -c` prints 1, the note, and the `rg` prints nothing, exit 1. `git diff --stat` shows 1 insertion and 3 deletions. Evidence: `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md:100` | Met | - |
| AC-006 | REQ-006 | Given the owner suite failed four named files on 2026-09-27, When it runs after the change, Then no other file fails and the three edited playbook files still validate | `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints no `FAIL` line outside `test_create_skill_contract.py`, `test_readme_manifest.py`, `test_rename_tooling_fixture_harness.py` and `test_root_name_consumer_matrix.py`, and prints `PASS test_structure_validation.py` and `PASS test_quick_validate_086.py`. `python3 $VD` on each of the three edited playbook files exits 0 with `Document type: playbook_feature` Observed 2026-09-27: the baseline before any edit failed 2 of 26 files (`test_readme_manifest.py`, `test_rename_tooling_fixture_harness.py`), a subset of the four. After `a9dbac98ef` the suite printed 24 `PASS` and the same 2 `FAIL` by name, exit 1, including `PASS test_structure_validation.py` and `PASS test_quick_validate_086.py`. `validate_document.py` on each of the three playbook files prints `VALID` and `Document type: playbook_feature`, exit 0 (rerun read-only while closing the docs). Evidence: `.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Closeable. All six criteria are Met with observed evidence from the build commit `a9dbac98ef` and the checks the orchestrator ran before and after it. AC-006 compares against the build baseline's two failing files, a subset of the four named at planning.
<!-- /ANCHOR:closure -->
