---
title: "Acceptance Criteria: Phase 2: Delegation and Orchestration Rule"
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
    packet_pointer: "agents/007-repo-rules-router/002-delegation-orchestration-rule"
    last_updated_at: "2026-08-31T05:37:23Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the closure gate for the delegation and orchestration rule"
    next_safe_action: "Run the overlap inventory (T001) before drafting the rule"
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
# Acceptance Criteria: Phase 2: Delegation and Orchestration Rule

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/007-repo-rules-router/002-delegation-orchestration-rule
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
| AC-001 | REQ-001 | Given the new rule file, When a reader looks for its binding statement, Then one sentence under `## The rule` says delegating makes you the orchestrator rather than the author | The block carries one bold sentence naming both halves: orchestrator not author, and no single verdict closing a question | Met | - |
| AC-002 | REQ-002 | Given a judgment question answered by one model, When the rule is applied, Then the file states a single verdict does not close it - the delegate's or your own - and names the alternative | Section 4 splits factual from judgment questions and prescribes diverge, ground, or escalate; section 6 applies the same test to the delegator | Met | - |
| AC-003 | REQ-003 | Given an agent about to dispatch work, When it consults the router trigger table, Then a row matches on that action and links to this file | The trigger row's verbs are dispatch-shaped (hand work to, compose the prompt, accept or quote a return); the link resolves on disk | Met | - |
| AC-004 | REQ-004 | Given the rule file, When it is scanned for executor mechanics, Then no model uid, CLI flag, env var, or version string appears | Token scan over model families, flag patterns, env prefixes, version strings and invocation forms returned no lines | Met | - |
| AC-005 | REQ-005 | Given the six sibling rule files, When the new file is compared to them, Then it carries the same structural parts and phase 1's heading format | `Fires when`, one `## The rule` block, 9 numbered sections all uppercase with 9 dividers, closing self-check | Met | - |
| AC-006 | REQ-006 | Given the finding-as-hypothesis and frozen-scope doctrines, When the rule needs them, Then it links to the owning file rather than restating it | Sections 5 and 7 link to `evidence-and-proof.md` and `scope-discipline.md`; neither doctrine is re-explained beyond a clause | Met | - |
| AC-007 | REQ-007 | Given each obligation in the file, When a reader asks what breaks without it, Then the file answers in the same section | Clause audit over sections 1 through 8: each names a concrete failure | Met | - |
| AC-008 | REQ-008 | Given the rule, When someone reads it as "delegate more", Then a section explicitly refuses that reading | Section 8 names over-delegation as a restraint failure and routes it to `overengineering.md` | Met | - |
| AC-009 | REQ-003 | Given the router, When the seventh rule is added, Then it cost one new file and two router rows, with no existing rule file modified | Partially met and recorded as such: two rows were added and no rule file changed, but `REPO RULES.md` section 4 also needed correcting, because it listed agent dispatch as out of scope and would have contradicted the new trigger row. Three edits to one file, not two | Met | - |
| AC-010 | REQ-005 | Given this phase folder, When the packet gate runs, Then the spec docs validate | `validate.sh` on this folder with `--strict`: every rule passed and the only error was this row's own `AC_CLOSURE`, which clears once the row is marked. Re-run recorded below | Met | - |

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

AC-004 and AC-005 carried the phase: the rule holds no executor mechanics, so a CLI
version bump cannot invalidate it, and it matches the shape and format of its six
siblings. AC-009 is met with a correction on its face rather than a clean pass - the
seventh rule cost three edits to `REPO RULES.md`, not two, because its section 4 scope
statement excluded agent dispatch and had to be narrowed to mechanics. Left out
deliberately: no fixed count of independent lenses, and no enforcement tooling.
<!-- /ANCHOR:closure -->
