---
title: "Acceptance Criteria: Human Voice Rules standard ownership and packet template conformance"
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
    packet_pointer: "specs/sk-doc/046-human-voice-standard-ownership"
    last_updated_at: "2026-09-01T04:20:00Z"
    last_updated_by: "claude"
    recent_action: "Verified all thirteen criteria against observed command output"
    next_safe_action: "Review the uncommitted diff and commit the paths this packet owns"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md"
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py"
      - ".opencode/skills/sk-doc/ROUTER.md"
      - ".opencode/skills/sk-doc/leaf-aliases.json"
      - ".opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the 641-file reference count block the move? No. 614 are frozen spec documents."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Human Voice Rules standard ownership and packet template conformance

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/046-human-voice-standard-ownership
**Level:** 2
**Status:** Complete
**Date:** 2026-09-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the standard in the hub shared tier, When it is moved, Then it resolves inside the packet and nowhere else | `shasum -a 256` matched `7bd3eca2` before and after, and `ls shared/references/` no longer lists it | Met | - |
| AC-002 | REQ-002 | Given no `--rules` argument, When the scanner runs, Then it finds the standard at the new path | Clean fixture exit 0, dirty fixture exit 1, both rerun from the final state | Met | - |
| AC-003 | REQ-002 | Given a standard whose section 6 heading is renamed, When the scanner runs against it, Then it refuses rather than reporting a clean scan | `sed 's/^## 6\. HARD BLOCKER WORDS.*/## 6. RENAMED/'` piped through `--rules` exits 2 | Met | - |
| AC-004 | REQ-003 | Given the full-text inventory, When the old path is searched outside `specs/`, Then only frozen artifacts carry it | `rg -n "shared/references/hvr-rules" .opencode repo-rules` returns benchmark reports and the `v1.0.0.0` changelog entry only | Met | - |
| AC-005 | REQ-004 | Given the packet after the move, When the package gate runs, Then it passes in strict mode | `package_skill.py --check --strict` reports `Result: PASS` | Met | - |
| AC-006 | REQ-004 | Given the hub after the move, When the parent-skill check runs, Then every hard invariant passes with no warning | `parent-skill-check.cjs .opencode/skills/sk-doc` reports 14 modes, 0 warnings, including 10b byte drift and 12a router contract | Met | - |
| AC-007 | REQ-004 | Given the fleet after the move, When root metadata is audited, Then every skill root still conforms | `ci-skill-root-metadata.cjs` reports `checked=14 passed=14 failed=0` | Met | - |
| AC-008 | REQ-004 | Given the edited templates, When the golden snapshot test runs, Then it passes and no snapshot entry went obsolete | Negative control first: 5 failed. After substitution: 9 passed, 0 obsolete | Met | - |
| AC-009 | REQ-004 | Given the routing gold, When playbook topology is validated, Then all 32 scenarios stay valid | `validate-playbook-topology.cjs` reports `verdict=PASS valid=32 blocked=0` | Met | - |
| AC-010 | REQ-005 | Given the moved standard, When its body is compared, Then only the frontmatter-governed block and one move-broken link differ | Checksum identical at move time. The single later edit repointed `./core-standards.md` out of the vacated directory | Met | - |
| AC-011 | REQ-006 | Given the packet references and assets, When they are read against the skill templates, Then each opens on `## 1. OVERVIEW` and carries an on-enum `contextType` | Both references and the report asset now open on OVERVIEW, and `contextType` moved from the undefined value `reference` onto `implementation` and `general` | Met | - |
| AC-012 | REQ-007 | Given the released `v1.0.0.0` entry stating the standard would not move, When the reversal is recorded, Then the released entry is left intact | `v1.1.0.0.md` added and `v1.0.0.0.md` left unchanged, which the packet's own NEVER rule requires | Met | - |
| AC-013 | REQ-004 | Given everything this packet authored, When the packet's own scanner runs over it, Then no hard blocker remains | Three semicolons found in `spec.md` and fixed. One remains in template-pinned `plan.md` boilerplate and is recorded as an exemption | Met | - |

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

AC-002 through AC-004 carried the packet: a run-time parser that finds its input, a
negative control proving it still fails closed, and an inventory showing the old path
survives only where a record of the past belongs. What was consciously left out is the
`contextType: reference` drift in eleven sibling files and the stale mode set in the
`max-load` routing gold, both pre-existing and both a fleet sweep rather than this
packet's scope.
<!-- /ANCHOR:closure -->
