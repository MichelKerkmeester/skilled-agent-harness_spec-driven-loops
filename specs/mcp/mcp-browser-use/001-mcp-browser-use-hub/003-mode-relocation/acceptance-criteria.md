---
title: "Acceptance Criteria: Phase 3: mode-relocation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "mode relocation acceptance criteria"
  - "mcp-browser-use relocation closure"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation"
    last_updated_at: "2026-11-24T05:32:33Z"
    last_updated_by: "claude-code"
    recent_action: "Closed the packet after rerunning every criterion"
    next_safe_action: "Keep every row Met when later phases touch the moved packets"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-mode-relocation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 3: mode-relocation

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `003-mode-relocation`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the move is done, When `jq '.modes \| length' .skilled/skills/mcp-tooling/mode-registry.json` runs, Then it prints 6 | Observed 2026-11-21: `jq` printed `6` | Met | - |
| AC-002 | REQ-002 | Given the move is done, When the old-path `rg` over `.skilled` and the id `rg` over the six old-hub files in `spec.md` REQ-002 run, Then both print nothing | Observed 2026-11-21 after the residual rewrites: both `rg` runs print nothing, exit 1 each; the same id pattern finds 6 lines in `.skilled/skills/mcp-browser-use/mode-registry.json`, so the search works. The three residual files were rewritten: `cite-drift-redirects.json` and `semantic-probes.json` on the operator's answer, and the broken old path at `mcp-figma/references/troubleshooting.md:488` | Met | - |
| AC-003 | REQ-003 | Given the move is done, When `parent-skill-check.cjs` runs on each hub path, Then each ends with `OK: parent-skill-check` | Observed: both runs exit 0 and print `OK: parent-skill-check — all hard invariants passed, 0 warnings` with subject lines naming `.skilled/skills/mcp-tooling` and `.skilled/skills/mcp-browser-use` | Met | - |
| AC-004 | REQ-004 | Given a generated file named in `spec.md` section 3, When its generator runs on the final tree, Then the file changes only through that run | Generators table in `implementation-summary.md`: leaf manifests, trigger index and sk-doc snapshots rebuilt; each `--check` or plain run exits 0 afterwards | Met | - |
| AC-005 | REQ-005 | Given both `skill_dir` values point under `mcp-browser-use`, When `check-mcp-mutation-class.test.sh` runs, Then it exits 0 | Observed: `rg` prints manifest lines 45 and 61 under `mcp-browser-use`; the test exits 0 with `Results: 37 passed, 0 failed` | Met | - |
| AC-006 | REQ-006 | Given the Chrome packet moved byte for byte, When `node --test .skilled/bin/tests/mcp-installers.test.cjs` runs, Then it exits 0 | Observed: exit 0, `tests 5`, `pass 5`, `fail 0`; `cmp` shows both `_utils.sh` copies identical | Met | - |
| AC-007 | REQ-007 | Given the move is done, When `git diff --stat` runs on the 22 id-only files, Then it prints nothing | Observed: 27 of the 41 outside files from the starting inventory show no diff, the 22 id-only files among them | Met | - |
| AC-008 | REQ-008 | Given the hook and guard patterns are widened, When `bash .skilled/commands/doctor/scripts/tests/check-mcp-mutation-class.test.sh` runs, Then it exits 0 including a case for a script under `skills/mcp-browser-use/mcp-*`, and `check-mcp-mutation-class.sh` lists the moved scripts under their new paths | Observed: the new case failed before the widening and passes after (37 of 37, exit 0); the guard exits 0 and prints `PASS` for `mcp-browser-use/mcp-{chrome,aside}-devtools/scripts/{install,doctor}.sh` | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every row is Met, so no criterion blocks closure.
<!-- /ANCHOR:closure -->
