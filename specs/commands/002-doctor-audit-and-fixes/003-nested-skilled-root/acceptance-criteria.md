---
title: "Acceptance Criteria: Phase 3: nested-skilled-root"
description: "The eight criteria and their observed evidence for the nested skilled root change."
trigger_phrases:
  - "nested skilled root acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-nested-skilled-root"
    last_updated_at: "2026-11-01T06:38:22Z"
    last_updated_by: "markdown"
    recent_action: "Closed the acceptance criteria from verified evidence"
    next_safe_action: "Commit the Skilled fix and re-pin Barter coder before the live proof"
    blockers:
      - "Strict validation still reports generated metadata integrity and drift errors outside the writable scope."
      - "The live Barter proof waits for the commit and re-pin."
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-nested-skilled-root"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: nested-skilled-root

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 003-nested-skilled-root
**Level:** 2
**Status:** Complete
**Date:** 2026-11-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the framework copy at `<F>/nested/.skilled`, When `sk-skill-check.cjs check sk-code-terraform --into-hub sk-code --json` runs, Then the reported `hubPath` is `.skilled/skills/sk-code` and stderr holds no `HUB_NOT_FOUND` | `scratch/T011.md:10` (expected hub path and no `HUB_NOT_FOUND`) | Met | - |
| AC-002 | REQ-002 | Given the same copy, When `skill-graph-freshness.cjs` runs, Then the report holds the fixture's compiled `generated_at` stamp and prints no `panel error` | `scratch/T012.md:10` (fixture stamp `2026-11-01T00:00:00.000Z`, no panel error) | Met | - |
| AC-003 | REQ-003 | Given a decoy `.opencode` with no sentinel at `<F>` and the copy at `<F>/nested/.skilled`, When `parent-skill-check.cjs` runs with no argument, Then the `Resolved:` line names `<F>/nested/.skilled/skills/system-deep-loop`, the output holds no `Cannot find module` | `scratch/T013.md:10` (nested `Resolved:` path and no module error) | Met | - |
| AC-004 | REQ-004 | Given the Skilled checkout, When the three baseline commands run, Then the hub report holds `"hubPath": ".skilled/skills/sk-code"`, the freshness run exits 0 with no `panel error`, and parent-skill-check prints `0 warnings` | `scratch/T031.md:5`, `scratch/T031.md:8`, `scratch/T031.md:11` (counts 1, 0, 1; matches baseline) | Met | - |
| AC-005 | REQ-005 | Given a temporary repository whose `.skilled` is a symlink to the Skilled checkout, When each script runs through that link, Then each resolves the Skilled checkout, the freshness report holds the Skilled compiled stamp, and neither prints a `panel error` | `scratch/T014.md:10` (checkout and linked layouts; 2 passed) | Met | - |
| AC-006 | REQ-006 | Given the changed scripts, When `rg -n "'\.git'" .skilled/commands/doctor/scripts` runs, Then no line selects a repository root, and each of the three files requires `shared/workspace/repo-root.mjs` | `scratch/orchestrator-verify.md:53` (all three resolver imports; no non-test root selection) | Met | - |
| AC-007 | REQ-007 | Given the full doctor suite, When `bash .skilled/commands/doctor/scripts/tests/run-all.sh` runs, Then it exits 0 with `0 failed`, `sk-skill-check` reports `pass 58` and `sk-skill-convert` `pass 69` or higher | `scratch/orchestrator-verify.md:49` (304 baseline passes; 8 added); `scratch/T034.md:15` (7 suites passed, 0 failed; node aggregate 999 pass, 0 fail) | Met | - |
| AC-008 | REQ-008 | Given the docs, When `rg -n 'nearest ancestor.*\.git' .skilled/commands` runs, Then it prints no line, and each script header names the sentinel rule | `scratch/T020.md:7` (no stale sentence); `scratch/T020.md:3` (three script comments updated) | Met | - |

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

All eight criteria are Met with the evidence cited in the table. The live Barter proof remains a post-commit re-pin follow-up.
<!-- /ANCHOR:closure -->
