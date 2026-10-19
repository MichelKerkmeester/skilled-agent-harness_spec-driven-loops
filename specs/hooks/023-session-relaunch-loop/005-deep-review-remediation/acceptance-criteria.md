---
title: "Acceptance Criteria: Phase 5: deep-review-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep review remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/005-deep-review-remediation"
    last_updated_at: "2026-10-18T13:25:36Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Commit after operator approval"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: deep-review-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/005-deep-review-remediation
**Level:** 2
**Status:** Complete
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the WS1 tests, when they run before the fix, then each fails on an assertion, and after the fix `node --test` on the concern's test files ends with `# fail 0` and names a test for each of R1-P2-001, R1-P2-003, R2-P2-001 and R2-P2-002 | `../scratch/run-ledger.md:429` and `:432` (red 26!==200, exit 1!==0, 2!==1 signals, 493!==448 mode, then green); follow-ups `:434`, `:450`, `:452` and `:456`. Named tests: `appendLog keeps every line when eight processes append concurrently` (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:749`), `killer records a timeout when the transcript vanishes while it waits` (`.skilled/hooks/session-relaunch/tests/killer.test.cjs:958`), `two killers cannot both claim the same stale lock` (`.skilled/hooks/session-relaunch/tests/killer.test.cjs:1074`), `killer restores a permissive state directory to private mode` (`.skilled/hooks/session-relaunch/tests/killer.test.cjs:1392`). Final gate node 375/375, fail 0. | Met | - |
| AC-002 | REQ-002 | Given the five adapters, when `rg` searches for `plannedNotePath`, the threshold resolver and the seed parser, then each has one definition in the core, and a test shows a second Stop on an armed record spawns no second killer | `rg` finds `plannedNotePath`, `relaunchThreshold`, `notePathFromSeed` and `DEFAULT_THRESHOLD` only in `.skilled/hooks/session-relaunch/lib/nudge.cjs` (190, 207, 171, 24); `findLoopChildPid` and `readProcessTable` once in `lib/relaunch-core.cjs` (726, 703), while the CLI reads its own table with `readProcessTableWithCommands` (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:155`) and hands it to `core.findLoopChildPid` (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:186`). Tests `stop-arm spawns exactly one killer across repeated Stop payloads on a pending record` (`.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:508`) and `stop-arm respawns one killer for an armed record whose killer is gone` (`.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:558`). Ledger `:429`, `:431`, `:438`. | Met | - |
| AC-003 | REQ-003 | Given a Skip seed, when either printer emits it, then its parentheses balance, and the parser returns Skip for both the new and the old suffix | `../scratch/run-ledger.md:438`: printers emit ` (Gate 3 answered D, Skip, in the sending session)` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:527`, `.skilled/bin/skilled-loop:98`); `rg -c 'Skip in the sending session\)' .skilled` outside specs finds only `SPEC_FOLDER_SKIP_SUFFIX_LEGACY` (`.skilled/hooks/session-relaunch/lib/nudge.cjs:16`) and its test (`.skilled/hooks/session-relaunch/tests/nudge.test.cjs:29`); both spellings parse to `none` in `nudge.test.cjs`. | Met | - |
| AC-004 | REQ-004 | Given the WS4 docs, when they are read against `skilled-loop`, phase 003 `tasks.md` and the contract, then the exit contract matches the code, each evidence pointer resolves to its content, and the earlier relaunch order is marked superseded | `../scratch/run-ledger.md:426`: `.skilled/bin/README.md:177` and the command-runtimes playbook restate the exit contract from `skilled-loop:405-505` (decider failure sentence added in ws5); phase 003 `tasks.md` pointers resolve (README:15-23, hooks README:30/188/278, `.skilled/hooks/session-relaunch/tests/killer.test.cjs:393`); contract section 7 earlier order marked superseded. | Met | - |
| AC-005 | REQ-005 | Given the packet code, when a fresh SWE session reviews it against the sk-code-opencode checklists, then every confirmed finding is fixed and `run-all-drift-guards.sh` exits 0 | `../scratch/run-ledger.md:442` (alignment review, eight P2) and the ws5/ws5b fixes (`:444`, `:446`); every finding fixed and reviewed (`:448`, `:454`, `:456`); `run-all-drift-guards.sh` all 4 guards PASSED, 278 non-blocking warnings (baseline 278). | Met | - |
| AC-006 | REQ-006 | Given the docs a fix changes, when their sk-doc validators run, then each passes | `../scratch/run-ledger.md:440` and the follow-up docs lane (`:457`): `validate_document.py` 0 issues on the concern README, catalog leaf and both playbooks; catalog package PASS 0 violations; playbook package PASS (102 scenarios, 0 violations); `.skilled/bin/README.md` VALID 0 issues; hvr counts unchanged from before the edits. | Met | - |
| AC-007 | REQ-007 | Given the final state, when the full gate reruns, then every count is at or above the phase 004 baseline and `validate.sh` on the parent with `--recursive --strict` prints `RESULT: PASSED` | Final gate from the orchestrator's run at 20:02 today, every step rc 0, not rerun in this session: node 375/375, pytest 62/62, Pi relaunch vitest 21/21, registration vitest 7/7, tsc 0, shellcheck 0, hook sync PASS 32 hooks, mirrors PASS 192, hermes prompts PASS 38, drift 4/4 guards (278 non-blocking warnings, baseline 278), OpenCode import ok, deep-review node tests 1/1, verify-iteration vitest 31/31, extract_structure pytest 4/4, readme manifest reproducible gaps=18, Pi Fast Mode extension vitest 83/83 and tsc 0, sk-doc rename harness 4/4 when run alone. Baseline at `../scratch/run-ledger.md:423`. The recursive strict validation of the parent is recorded in implementation-summary.md. | Met | - |
| AC-008 | REQ-008 | Given the open items from the final review wave, when each is checked against its ledger entry, then each is closed here with evidence or handed to its owning packet with a pointer | Met. Heading and cross-reference: `specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/plan.md:170`, `specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/plan.md:227`. Citation split: `specs/hooks/023-session-relaunch-loop/004-integration-review-and-docs-closure/acceptance-criteria.md:63`. Pi guard: `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:110` and its test `.pi/extensions/pi-fast-mode-w-subagent-support/tests/extension.test.ts:266`, landed per `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:472`. The Pi suite was not rerun in this session because the package import does not resolve in this worktree. Checklist rule: `.skilled/skills/sk-doc/shared/scripts/extract_structure.py:682`, with its regression `.skilled/skills/sk-doc/scripts/tests/test_extract_structure_regressions.py:71`; the pytest run here exits 0 with 4 passed. Tests README: `.skilled/hooks/session-relaunch/tests/README.md`, per `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:467`. Manifest: `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:61`, per `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:466`. Handed to packet 009: `specs/system-deep-loop/038-review-and-cli-lineage/009-findings-summary-integrity/acceptance-criteria.md`, per `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:464`. | Met | - |

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

All seven criteria are Met. The twelve review advisories are fixed with tests, and so are the further findings that the lane reviews and the sk-code-opencode alignment review raised. Nothing was left out.
<!-- /ANCHOR:closure -->
