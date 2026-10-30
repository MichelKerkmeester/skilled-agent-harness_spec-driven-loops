---
title: "Acceptance Criteria: /doctor:agents-md"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agents md phase acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md"
    last_updated_at: "2026-10-30T17:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Every criterion met and the phase closed"
    next_safe_action: "Close the top 021 packet"
    blockers: []
    key_files:
      - "scratch/baseline.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: /doctor:agents-md

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `agents/021-doctor-agents-md/001-doctor-agents-md`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | D30 | Given the five child folders, When each is validated, Then every one prints `RESULT: PASSED` and its criteria read `Met` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md --recursive --strict` prints `RESULT: PASSED` with `Errors: 0  Warnings: 0`, and each child validates on its own: 005 records its own run at 005-verification-and-docs/scratch/gate.txt:4 | Met | - |
| AC-002 | D8 | Given the manifest, When its freshness check runs, Then it exits 0 with a `PASS` line naming the section and pin counts | `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` prints `PASS: 44 sections, 30 pins, derived matches AGENTS.md` at 005-verification-and-docs/scratch/baseline.txt:129, exit 0 | Met | - |
| AC-003 | D15 | Given this repository, When the check engine runs, Then it exits 0 with `STATUS=OK` and `A1 install state: pure` | `node .skilled/commands/doctor/scripts/agents-md-check.cjs` prints `A1 install state: pure` and `STATUS=OK rows=12 findings=0 unknown=0` at 005-verification-and-docs/scratch/baseline.txt:136, exit 0 | Met | - |
| AC-004 | D23 | Given this repository, When the embed plan runs, Then it prints `NOTHING TO DO` and writes nothing | `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` prints `[agents-md-embed] plan for <this repository> (state: pure)` then `NOTHING TO DO` at 005-verification-and-docs/scratch/baseline.txt:214, exit 0, and `git status --porcelain` lists nothing it wrote | Met | - |
| AC-005 | D1 | Given the route manifest, When the validator runs, Then it exits 0 and its summary names the check, embed and restore routes at the re-measured count | `bash .skilled/commands/doctor/scripts/route-validate.sh` prints `OK: route-validate — 24 routes validated, 5 warnings` at scratch/baseline.txt:38, exit 0, and the manifest carries `check`, `embed` and `restore` for `/doctor:agents-md` | Met | - |
| AC-006 | D26 | Given the edited root file, When the canary runs, Then it passes and the last delivery anchor ends at or before byte 16384 | `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` prints `OK: all rule invariants present` at scratch/baseline.txt:4, exit 0, with the last anchor at byte 16368 | Met | - |
| AC-007 | D12 | Given the final tree, When the repo-rules checker runs, Then it prints `RESULT: PASSED (11/11 checks)` | `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` prints `[repo-rules-check] RESULT: PASSED (11/11 checks)` at scratch/baseline.txt:34, exit 0 | Met | - |
| AC-008 | D30 | Given the family runner, When it runs from the final tree, Then every suite passes | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `7 suite(s) passed, 0 failed` at scratch/baseline.txt:42, exit 0, with `PASS: node:test (41 files)` | Met | - |
| AC-009 | D21 | Given the two manual rows, When they are read, Then each records an observation or an unknown with its reason | both rows record `UNKNOWN` with its reason and the operator steps that answer them: doctor-agents-md-block-devin-quote.md:60 and doctor-agents-md-cursor-mirror-load.md:60 | Met | - |
| AC-010 | D31 | Given the final tree, When the change list is read, Then it names only the files the five children name and no consumer path | `git status --porcelain` names the README doctor section, the script README, the catalog and playbook rows with two new scenarios, four changelogs, three skill version carriers with their Hermes copies, the regenerated retrieval corpus, the re-minted sk-doc activation manifest, and this packet's documents. `rg -n 'local-'` over the list prints nothing, and every deviation is named at 005-verification-and-docs/implementation-summary.md:128 | Met | - |

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

AC-001 to AC-010 are `Met`. All five children are closed, every baseline command reruns green from the final tree, and the aggregate gate passes with no errors and no warnings.
<!-- /ANCHOR:closure -->
