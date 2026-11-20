---
title: "Acceptance Criteria: Phase 5: v1-reference-purge"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "v1 reference purge acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/005-v1-reference-purge"
    last_updated_at: "2026-11-20T16:32:14Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-v1-reference-purge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: v1-reference-purge

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 070-opencode-v1-removal/005-v1-reference-purge
**Level:** 2
**Status:** Complete
**Date:** 2026-11-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When the sweep runs, Then it lists no hand-written file, and each remaining generated file carries v1 phrases only from history or the `cli-opencode` 1.x skill-version phrases | The sweep lists only `phrase-variants.json` and `trigger-index.json`; a source trace over `trigger-index.json` finds 48 skill-version phrases, 4 history phrases and 0 live sources. The operator asked for an empty sweep, so this row records the residue ADR-002 explains | Superseded | ADR-002 |
| AC-002 | REQ-002 | Given the resolvers, the rule engine, the battery, the wrapper and the setup helper, When they are searched for the `unsupported` family, Then nothing matches | `rg -n "unsupported" .skilled/hooks/cli-dispatch/lib/opencode-version.mjs .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs .skilled/commands/doctor/scripts/opencode-version-battery.cjs .skilled/bin/skilled-loop .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` prints nothing, and `UNRESOLVED_FAMILIES` is `['unknown']` | Met | - |
| AC-003 | REQ-003 | Given the baseline, When the gate, the whole deep-loop vitest and the doctor suite rerun, Then no new failure appears and each count drop is a named removal | implementation-summary.md Verification table: every leg exit 0, node 837 to 832 tests from five named removals, all other legs equal to the baseline | Met | - |
| AC-004 | REQ-004 | Given the shared corpus and the hand-written outputs, When the CJS parser is compared with the ESM parser, Then every answer matches | `keeps CJS parsing in parity with the ESM parser for every fixture` passes in the deep-loop vitest | Met | - |
| AC-005 | REQ-005 | Given the fixture without its OpenCode 1 sentence, When sk-skill-convert runs, Then every test passes | `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` prints `pass 69`, `fail 0` | Met | - |
| AC-006 | REQ-006 | Given OpenCode 2.3.2 installed, When the live battery runs, Then it exits 0 | implementation-summary.md records the `--family=v2 --json` run and its exit status | Met | - |
| AC-007 | REQ-007 | Given phase 003's justified list, When its three replacement checks rerun, Then each prints 0 and the list is marked superseded | Both `rg` checks print 0, `check-index-v1.py` prints 0, and line 1 of `003-v1-docs-and-playbooks-sweep/scratch/justified.txt` names ADR-001 of this phase | Met | - |

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

Every row is Met except AC-001, which ADR-002 supersedes because the residue lives only in generated files that history feeds.
<!-- /ANCHOR:closure -->
