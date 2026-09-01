---
title: "Acceptance Criteria: Phase 2: mode-scaffold"
description: "The five criteria that decide whether the empty mode packet may close: three met against named gate output, and two superseded because the requirement they encode rests on a premise this phase disproved."
trigger_phrases:
  - "mode scaffold acceptance criteria"
  - "packaging gate closure"
  - "hub gate superseded criterion"
  - "empty packet closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/002-mode-scaffold"
    last_updated_at: "2026-09-01T08:42:57Z"
    last_updated_by: "implementation"
    recent_action: "Closed the scaffold criteria: three met, two superseded by ADR-001"
    next_safe_action: "Proceed to phase 003 (content migration)"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: mode-scaffold

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/049-sk-create-frontmatter/002-mode-scaffold
**Level:** 3
**Status:** Complete
**Date:** 2026-09-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four-file packet with no content in it, When the strict packaging gate runs against it, Then it reports a pass | `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-doc/sk-create-frontmatter --check --strict` reports `Result: PASS` with exactly 2 warnings, `Missing recommended section: INTEGRATION POINTS` and `Missing recommended section: RELATED RESOURCES` | Met | - |
| AC-002 | REQ-002 | Given the hub check passing before the packet existed, When the unregistered packet is added, Then the hub check still reports OK | Not observed. The same command reports `FAIL: 6a: child director(ies) neither registered as a packet nor allowlisted: [sk-create-frontmatter]` and `FAIL: parent-skill-check — 1 invariant failures, 0 warnings`. The criterion's premise, that an unregistered packet is inert, is disproved at `.opencode/commands/doctor/scripts/parent-skill-check.cjs:1003` | Superseded | ADR-001 |
| AC-003 | REQ-003 | Given `sk-create-repo-rule` as the most recently built sibling mode, When both packets are packaged under the same command, Then the new packet's warning list matches the sibling's | Both report the same 2 warnings under `package_skill.py --check --strict`, so the new packet carries the sibling's file shape | Met | - |
| AC-004 | SC-001 | Given a packet holding no reference documents and no routing entry, When the packaging gate runs, Then it passes on the shape alone | The same `Result: PASS`, produced with `references/` holding only its index and no registry, router or manifest entry anywhere | Met | - |
| AC-005 | SC-002 | Given the hub gate's exit 0 baseline from before the packet existed, When the gate is rerun after, Then its output is unchanged | Not observed, and not achievable while the packet stays unregistered: registration is what makes a hub child directory legal. Closed in phase 004, where the same command reports `OK: parent-skill-check — all hard invariants passed, 0 warnings` at exit 0 | Superseded | ADR-001 |

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

Three criteria carried the packet. The strict packaging gate passes on a packet with nothing in it
(AC-001, AC-004), and its warning list matches `sk-create-repo-rule`'s exactly, so the packet has the
sibling's file shape rather than merely a plausible one (AC-003).

AC-002 and AC-005 were not met at this phase, and they are recorded as `Superseded` rather than `Met`
because the criteria themselves are wrong. Both restate spec.md §3's claim that "an unregistered packet
is inert". It is not. `.opencode/commands/doctor/scripts/parent-skill-check.cjs:1003` filters every hub
child directory against `DIRECTORY_ALLOWLIST` and `registeredPackets` and hard-fails anything in neither
set, and `DIRECTORY_ALLOWLIST` at lines 76-80 holds support-directory names such as `shared` and
`references`, never mode packets. Registration is what makes a child directory legal, not merely what
makes it reachable, so no version of this phase could both build the packet and leave the hub gate
untouched. Partial registration is worse rather than better: invariant 6b requires a registered mode in
the hub `SKILL.md` mode table and 10d requires the leaf manifest and registry to reach each other, so a
registry-only entry produces two failures instead of one.

The decision to follow the spec anyway, build empty, and carry the failure rather than suppress it is
ADR-001 in `decision-record.md`. The failure was satisfied in phase 004: after registration the same
command reports `OK: parent-skill-check — all hard invariants passed, 0 warnings` at exit 0. Consciously
left out: registration itself, all content migration, and any change to `parent-skill-check.cjs` or its
allowlist. The other four parent hubs stayed at exit 0 throughout.
<!-- /ANCHOR:closure -->
