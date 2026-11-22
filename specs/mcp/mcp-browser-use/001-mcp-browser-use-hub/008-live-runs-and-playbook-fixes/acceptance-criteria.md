---
title: "Acceptance Criteria: Phase 8: live-runs-and-playbook-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "live runs and playbook fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/008-live-runs-and-playbook-fixes"
    last_updated_at: "2026-11-22T12:00:50Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked each criterion with the evidence read on the authoring date"
    next_safe_action: "Run validate.sh --strict on this child and on the parent"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-22-live-runs-and-playbook-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: live-runs-and-playbook-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `008-live-runs-and-playbook-fixes`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the Bladebro run folder, When its `results.csv` is read, Then it holds five rows, 4 PASS and 1 FAIL, matching the README tally | `awk -F, 'NR>2 && $3=="PASS"'` counted 4 and `$3=="FAIL"` counted 1 on 2026-11-22. The README reads "Tally: 4 PASS, 1 FAIL." Cites: .skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv:3-7, tasks.md:44 | Met | - |
| AC-002 | REQ-001 | Given the Aside run folder, When its `results.csv` is read, Then it holds 15 rows, 10 PASS and 5 FAIL, matching the README tally | `awk` counted 15 rows, 10 PASS and 5 FAIL on 2026-11-22. The README reads "Tally: 10 PASS, 5 FAIL." Cites: .skilled/skills/mcp-browser-use/mcp-aside-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--signed-in-live/results.csv:3-17, tasks.md:45 | Met | - |
| AC-003 | REQ-002 | Given the Bladebro playbook, When `validate-playbook-package.cjs --package mcp-browser-use/mcp-bladebro` runs, Then it exits 0 with `scenarios=15` and `violations=0` | Exit 0 on 2026-11-22. Output: `PASS package=mcp-browser-use/mcp-bladebro tier=FAIL_CLOSED scenarios=15 categories=5 operator=15 routing_gold_excluded=0 violations=0 warnings=0` Cites: tasks.md:60 | Met | - |
| AC-004 | REQ-003 | Given the Aside and Chrome DevTools playbooks, When the validator runs on each, Then each exits 0 with `violations=0`, and the census warnings are named | Exit 0 on both. Aside: `violations=0 warnings=1` (HAND_TYPED_CENSUS). Chrome DevTools: `violations=0 warnings=2` (HAND_TYPED_CENSUS, CENSUS_MISMATCH). Both warnings predate this packet. Cites: tasks.md:62 | Met | - |
| AC-005 | REQ-004 | Given the Bladebro package, When `validate_catalog_package.py --package mcp-browser-use/mcp-bladebro` runs, Then it exits 0 with 0 violations, and the package holds 18 markdown files | Exit 0 and `PASS: 0 violations (all enforced catalog checks).` on 2026-11-22. `find feature-catalog -name '*.md'` counted 18. Cites: tasks.md:48, tasks.md:60 | Met | - |
| AC-006 | REQ-005 | Given each FAIL row, When its reason cell is read, Then the cause is named, and no FAIL is recorded as PASS | Read on 2026-11-22: BB-012 names the launch error. ASD-007 and ASD-017 name the `/tmp` redirect, ASD-016 the missing h1, ASD-018 the `page.on` error, and ASD-019 `page.context`. Each run's `results.csv` holds the verdict its README reports. Cites: tasks.md:115, .skilled/skills/mcp-browser-use/mcp-aside-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--signed-in-live/results.csv:3-17 | Met | - |
| AC-007 | REQ-006 | Given the path `/Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub`, When it is listed and the worktrees and branches are read, Then the path does not exist and nothing registers it | `ls` exited 1 with `No such file or directory`. `git worktree list` has no line for 505. `git branch --list "*505*"` printed nothing. All on 2026-11-22. Cites: tasks.md:52 | Met | - |
| AC-008 | NFR-S01 | Given the two run folders, When each file is scanned, Then no file holds an email address, and each folder holds `README.md`, `results.csv` and `source.md` | Email-pattern scan returned 0 matches across all six files. `ls` of both folders lists the three files each. Cites: tasks.md:61 | Met | - |

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

**Closeable:** Yes. Every criterion is met. The `validate.sh --strict` gate is the completion check in the `plan.md` Definition of Done, not a row here. The open items in spec section 10 are for a later packet and do not block closure.
<!-- /ANCHOR:closure -->
