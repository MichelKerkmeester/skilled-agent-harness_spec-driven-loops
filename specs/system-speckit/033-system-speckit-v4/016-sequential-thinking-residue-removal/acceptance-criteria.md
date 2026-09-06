---
title: "Acceptance Criteria: Retire the decommissioned MCP server from the doctor tooling and clear stale spec residue"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/016-sequential-thinking-residue-removal"
    last_updated_at: "2026-08-31T13:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed all eight criteria against observed command output"
    next_safe_action: "Operator review and commit"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/scripts/mcp-doctor.sh"
      - ".opencode/commands/doctor/assets/doctor-mcp-install.yaml"
      - ".opencode/commands/doctor/assets/doctor-mcp-debug.yaml"
      - ".opencode/commands/doctor/assets/doctor-mcp-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "048-decommissioned-server-residue"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Do the dangling sk-doc children_ids pre-date recent work? Yes — identical 17 entries present at 4cbff2d4b6~1."
      - "Does a generator maintain specs/sk-doc/graph-metadata.json? No — backfill rejects it as not a spec folder."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Retire the decommissioned MCP server from the doctor tooling and clear stale spec residue

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/016-sequential-thinking-residue-removal
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the doctor tooling, When searched for the decommissioned package, Then no invocation remains | `rg -n "server-sequential-thinking" .opencode/commands/doctor/` — 6 matches before, 0 after | Met | - |
| AC-002 | REQ-002 | Given a full diagnostic run, When `mcp-doctor.sh --json` executes, Then it emits no `sequential_thinking` check | Before: 40 checks, 3 warnings, 3 sequential checks + 2 sequential config warnings. After: 35 checks, 1 warning, 0 sequential entries | Met | - |
| AC-003 | REQ-002 | Given the retired server name, When passed as `--server sequential_thinking`, Then the run is inert rather than an error | Live run after change: `status: healthy`, exit 0, prerequisites plus config wiring only — no `npx` probe | Met | - |
| AC-004 | REQ-003 | Given both doctor YAML assets, When parsed, Then they load and name only live servers | `yaml.safe_load` succeeds; `servers`, `repair_actions` and `install_guides` keys all equal `[system-spec-memory, system_skill_advisor, code_mode]` | Met | - |
| AC-005 | REQ-004 | Given the doctor test surface, When re-run after the change, Then every check matches or beats its baseline | `bash -n` ×2 exit 0; `route-validate.sh` exit 0 (10 routes, 2 warnings — identical to baseline); `--self-test` exit 0; `check-mcp-mutation-class.sh` exit 0; `tests/*.test.cjs` 0/1/0 — identical to baseline | Met | - |
| AC-006 | REQ-004 | Given the presentation display parity check, When `route-validate.sh` runs, Then J1 still passes after four rows were removed | `PASS: J1: _routes.yaml routes, speckit.md table, and all 3 presentation displays are in parity` | Met | - |
| AC-007 | REQ-005 | Given `specs/sk-doc/039-create-repo-rules/`, When confirmed empty and unreferenced, Then it is removed | `find` returned 0 entries; `git ls-files` 0; `git log --all` empty; `rg "039-create-repo-rules"` no matches; `rmdir` succeeded and the path is gone | Met | - |
| AC-008 | REQ-006 | Given both operator claims about the sk-doc track index, When verified independently, Then the decision to leave it alone is evidenced | Claim 1: identical 17 dangling entries at `4cbff2d4b6~1`. Claim 2: `backfill-graph-metadata.js --spec-folder specs/sk-doc` errors `target is not a spec folder (missing spec.md)`. Plus `check-graph-metadata-child-drift.sh` header documents dangling entries as deliberately unreported | Met | - |

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

AC-002 and AC-005 carried the packet: the before-and-after diagnostic run proved the defect was live rather than cosmetic, and the baseline comparison proved the deletion cost nothing. What was consciously left out is the track-index repair — AC-008 closes by recording an evidenced decision not to make a hand edit to a hand-maintained file that a documented validator rule deliberately declines to flag, and that seven sibling tracks share. The `deep-ai-council` Depth-1 dependency on the same retired server was found during the consumer inventory and is recorded as an open question rather than fixed, because it needs a replacement mechanism and not a deletion.
<!-- /ANCHOR:closure -->
