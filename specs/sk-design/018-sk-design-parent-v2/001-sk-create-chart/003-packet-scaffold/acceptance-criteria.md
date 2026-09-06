---
title: "Acceptance Criteria: Phase 3: packet-scaffold"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/003-packet-scaffold"
    last_updated_at: "2026-09-02T07:56:50Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
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
# Acceptance Criteria: Phase 3: packet-scaffold

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/018-sk-design-parent-v2/001-sk-create-chart/003-packet-scaffold
**Level:** 3
**Status:** In Progress
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the package holds no chart content, When `package_skill.py .opencode/skills/sk-doc/sk-create-chart --check --strict` runs, Then it reports a pass | `Result: PASS`, exit 0, zero warnings. The same command returned `Result: FAIL` at exit 1 before `SKILL.md` existed, so the check can fail | Met | - |
| AC-002 | REQ-002 | Given the packet is a mode under a hub rather than a root, When the fleet metadata gate runs, Then the packet carries none of the four root-level metadata files and raises no violation | `ci-skill-root-metadata.cjs` reports `checked=14 passed=13 failed=1` with `OK [H] sk-doc`, matching the pre-work baseline. The one failure is a stale `mcp-tooling` manifest that predates this work | Met | - |
| AC-003 | REQ-003 | Given entry documents could be adapted from the reference, When each was written, Then it derives from a create-skill template | `SKILL.md` follows `assets/parent-skill/scaffold/packet-skill-scaffold.md` section by section. `README.md` follows the packet README shape used by every sibling mode. No reference file was opened while writing either | Met | - |
| AC-004 | REQ-004 | Given the source inventory classifies files as port or adapt, When the tree is reconciled against those rows, Then every content kind has a directory that exists | `references/` for the two catalogs, `assets/templates/`, `assets/color/`, `assets/reports/`, `assets/examples/` for the corpus, `scripts/` for the validator, `SKILL.md` and `README.md` for the two entry documents. The `LICENSE` and `agents/openai.yaml` rows get no home, recorded with reasons in `implementation-summary.md` | Met | - |
| AC-005 | REQ-005 | Given a version story should start at adoption, When the changelog directory was created, Then it carries a first entry | `changelog/v1.0.0.0.md` exists and states that the release carries the shape and no corpus | Met | - |
| AC-006 | SC-002 | Given a new directory under a hub can break a neighbour, When the fleet metadata gate and the compiled routing manifest are re-run, Then neither moved from its baseline | `fresh=true` at generation 5 with policy hash `6a5d6b45` and manifest fingerprint `b32b13d1`, byte-identical before and after | Met | - |

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

AC-001 carried the packet: an empty package that passes its own gate is the whole point, because the same failure against a full one could be either shape or content. What was consciously left out is everything the later phases own, the chart corpus, the color system, the validator body and the playbook scenarios, so their directories exist and are empty on purpose.

One consequence is recorded rather than fixed. `parent-skill-check.cjs .opencode/skills/sk-doc` now fails invariant 6a on the unregistered directory, where it was clean before. Creating the directory and registering the mode are separate phases, so every run between them sees a packet the registry does not know about. Registration closes it, and adding the packet to the check's allowlist would silence it permanently and wrongly.
<!-- /ANCHOR:closure -->
