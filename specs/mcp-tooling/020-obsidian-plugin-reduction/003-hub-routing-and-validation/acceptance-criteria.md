---
title: "Acceptance Criteria: Phase 3: hub-routing-and-validation"
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
    packet_pointer: "scaffold/003-hub-routing-and-validation"
    last_updated_at: "2026-09-11T06:42:02Z"
    last_updated_by: "scaffold"
    recent_action: "All nine criteria met against observed evidence"
    next_safe_action: "Phase complete; nothing further in this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: hub-routing-and-validation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->

## 1. METADATA

**Packet:** mcp-tooling/020-obsidian-plugin-reduction/003-hub-routing-and-validation
**Level:** 3
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->

## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the pruned leaf manifest, When every mcp-obsidian leaf is resolved, Then all exist | .opencode/skills/mcp-tooling/leaf-manifest.json mcp-obsidian holds 26 leaves; hub gate 10c confirms each resolves | Met | - |
| AC-002 | REQ-002 | Given both routing files, When the removed terms are grepped, Then there are no hits | .opencode/skills/mcp-tooling/hub-router.json vocabularyClasses no longer defines the four removed classes | Met | - |
| AC-003 | REQ-003 | Given the retained vocabulary, When both routing files are read, Then Iconic, Health.md and theme terms are present | .opencode/skills/mcp-tooling/hub-router.json retains health-md-data, iconic-rulebook, minimal-theme classes | Met | - |
| AC-004 | REQ-004 | Given the per-hub gate, When run with the hub path, Then the subject line names mcp-tooling and the verdict passes | parent-skill-check.cjs .opencode/skills/mcp-tooling printed OK, all hard invariants passed, 0 warnings | Met | - |
| AC-005 | REQ-005 | Given the four packet folders, When each is validated with `--strict`, Then each prints `RESULT: PASSED` | validate.sh --strict printed RESULT: PASSED for all four packet folders | Met | - |
| AC-006 | REQ-006 | Given the repository, When removed doc-set paths are scanned for, Then hits appear only in changelog history and historical spec research | Re-run scan found 4 live files with residue, all fixed: mcp-notion/references/migration-inventory.md plus the retrieval trio trigger-index.json, corpus-manifest.json, generation-diagnostics.json; the 1,197 remaining hits are changelog and specs/ research | Met | - |
| AC-007 | REQ-007 | Given `implementation-summary.md`, When read, Then each gate is named with the literal marker it printed rather than a bare verdict | 003-hub-routing-and-validation/implementation-summary.md Verification section quotes each gate's own result string | Met | - |
| AC-008 | REQ-002 | Given a Dataview request, When replayed through compiled routing, Then this mode no longer claims it | advisor_recommend returned no recommendation for 'dataview query dql inline field' | Met | - |
| AC-009 | REQ-003 | Given an Iconic request, When replayed through compiled routing, Then it still reaches this mode | advisor_recommend scored mcp-tooling 0.829 for 'iconic icon rules rulebook' | Met | - |

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

Every criterion is Met against evidence that was run from the final state and read. AC-006 was
initially closed on a scan that never executed: a shell AND-chain broke on a preceding `grep -c`
that matched nothing and exited 1, so the residue scan was skipped and its silence was read as a
pass. An adversarial review caught it. The re-run found four live files with residue, all since
fixed.
What was consciously left out: the two prose mentions of removed plugins that are
statements about the vault rather than pointers into deleted docs, which is why AC-003
scans paths rather than names.
<!-- /ANCHOR:closure -->
