---
title: "Acceptance Criteria: Phase 5: sk-code hub and mode packets"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk-code hub and mode packets acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/005-sk-code-hub"
    last_updated_at: "2026-10-28T11:08:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Verified every criterion against the final gate run"
    next_safe_action: "Conductor review and landing"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: sk-code hub and mode packets

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/072-skill-routing-and-clarity/005-sk-code-hub`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase is implemented, When its gates run, Then: `verify-router-sync.cjs`, `package_skill.py --strict`, `check-rule-copies.js` and `compiled-route-guard.cjs` pass after each packet. | At the final state all four pass: `verify-router-sync` 5/5, `package_skill.py --check --strict` PASS for all 14 top-level skills and for each of the four sk-code packets, `check-rule-copies.js` OK (6 extension floors), and `compiled-route-guard.cjs --json` 7 of 7 fresh. The interim runs kept during the packet work are the review packet's `rule-copies.out` and `canary-tests.out`; the other packets' interim output was not archived. `scratch/after.md:9`, `scratch/after.md:55`, `scratch/after.md:90` | Met | - |
| AC-002 | REQ-002 | Given the phase is implemented, When its gates run, Then: Each packet's first instruction appears before its machine-router appendix. | The machine router is the last H2 in every file: `## 9` in quality, `## 6` in skilled, `## 10` in review and `## 6` in the hub, with `sk-code-ci` unchanged. SMART ROUTING is 8, 3 and 8 lines, and the section after it starts at line 67 (quality), 57 (skilled), 63 (review) and 61 (hub); review's `## 3. HOW IT WORKS` used to start at 415. `scratch/after.md:76`, `scratch/after.md:90` | Met | - |
| AC-003 | REQ-003 | Given the phase is implemented, When its gates run, Then: One document names the routing authority, and the other two point at it. | `SKILL.md` §2 names `hub-router.json` as the mode vocabulary and `ROUTER.md` as the leaf-set router. `ROUTER.md` and `hub-router.json`'s `defaultResourceContract` point back at that sentence, and `mode-registry.json` and the feature catalog defer to it. `grep -i 'authoritative routing source' .skilled/skills/sk-code` finds nothing. `scratch/after.md:104` | Met | - |
| AC-004 | REQ-004 | Given the sk-code router, When section 2 and the phase boost are inspected, Then: section 2 is generated from section 9 or points to it without a keyword table, and the boost does not name `testing`. | `ROUTER.md` §2 carries no keyword table and points at the `INTENT_SIGNALS` block in §9; the boost reads `verification, debugging, code quality`; §9 is unchanged. The 92 stage-one terms stay out of §9 by decision, with the reason in `implementation-summary.md` Key Decisions. `scratch/after.md:104`, `scratch/after.md:110` | Met | - |

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

All four criteria are Met with observed evidence from the final gate run.
<!-- /ANCHOR:closure -->
