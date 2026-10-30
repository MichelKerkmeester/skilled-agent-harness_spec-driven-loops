---
title: "Acceptance Criteria: manifest and template block"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agents md manifest acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet the open criteria, then mark each one Met with its command output"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: manifest and template block

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block`
**Level:** 2
**Status:** Draft
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the root `AGENTS.md`, When the segmenter runs, Then it yields 46 sections whose start bytes match the table and whose match prefixes each find their section | `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` case names the 46 sections and passes | Unmet | - |
| AC-002 | REQ-002 | Given a root file with a heading no authored entry matches, or an authored entry matching nothing, When the generator runs, Then it exits 1 | the suite's two refusal cases pass | Unmet | - |
| AC-003 | REQ-003 | Given a one-byte edit to a temporary copy of the derived body, When `--check` runs, Then it exits 1 | the suite's drift case passes | Unmet | - |
| AC-004 | REQ-004 | Given each pin, When the contract case reads its consumer file, Then the consumer still contains the text or its own constant equals it | the suite's consumer case passes with no pin skipped | Unmet | - |
| AC-005 | REQ-005 | Given the canary's `AGENTS.md` string list, When the pin set is compared, Then every canary string appears in it | `rg -n 'AGENTS.md' .skilled/commands/doctor/assets/agents-md-manifest.json` prints the pin block and the suite's canary-coverage case passes | Unmet | - |
| AC-006 | REQ-006 | Given the edited root file, When the block markers are counted, Then exactly one start marker and one end marker exist after the last shipped section | `grep -c 'skilled:repo-local:start' AGENTS.md` prints `1` | Unmet | - |
| AC-007 | REQ-006 | Given the edited root file, When its size is measured, Then it is at most 27899 bytes | `wc -c < AGENTS.md` prints at most `27899` | Unmet | - |
| AC-008 | REQ-006 | Given the edited root file, When the canary runs, Then it passes and the last delivery anchor ends at or before byte 16374 | `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` prints `OK: all rule invariants present` and `  16374  #### Blast-Radius Management` or a smaller byte | Unmet | - |
| AC-009 | REQ-001 | Given the edited root file, When the gate 1 pointer sync checks, Then it passes | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check` prints `PASS` | Unmet | - |
| AC-010 | REQ-007 | Given the release tags, When the history key is generated, Then it holds one body per distinct body, deduped by sha256 | the suite's dedupe case passes and prints the history count | Unmet | - |
| AC-011 | REQ-008 | Given an origin that is not the source repository, When the suite runs, Then it prints its skip reason and passes | the suite's skip case prints a reason naming the origin | Unmet | - |
| AC-012 | REQ-009 | Given the workflow file, When both path-filter lists are read, Then each names `AGENTS.md` and `REPO RULES.md` | `grep -c "'AGENTS.md'" .github/workflows/spec-kit-check.yml` prints `2` | Unmet | - |

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

**Closeable:** No

AC-001 through AC-012 are unmet: the child is specified and not started.
<!-- /ANCHOR:closure -->
