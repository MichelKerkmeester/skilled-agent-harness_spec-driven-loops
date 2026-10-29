---
title: "Decision Record: Phase 8: ai-systems-migration"
description: "Why four AI Systems skills that fail the strict canon checker on findings a routing move cannot fix are waived to a follow-up canon packet."
trigger_phrases:
  - "ai systems migration decision record"
  - "ai systems canon waiver"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/008-ai-systems-migration"
    last_updated_at: "2026-10-29T17:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the AC-008 waiver"
    next_safe_action: "Operator approves the five pushes"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 8: ai-systems-migration

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Waive Four Canon Failures a Routing Move Cannot Fix

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-29 |
| **Deciders** | The conductor of this phase, on a fresh Opus reviewer's recommendation, under the operator's standing direction to decide and verify at the end |

---

<!-- ANCHOR:adr-001-context -->
### Context

AC-008 asks `package_skill.py --check --strict` to print `Result: PASS` for each of the 16 moved skills. After the move and the canon fixes that leave routing unchanged, 12 pass. None of the 16 has an RS-001 to RS-005 routing-shape finding. The other four fail on findings the move did not cause:

- Barter - Copywriter lacks the `HOW IT WORKS` and `REFERENCES` sections.
- Sales - Direct Communication (`sales-direct-communication`) and Barter - Deal Templates (`barter-deals`) carry names unlike their folders.
- Sales - HubSpot & Automation has 28 findings: 19 resource docs on the `0.NNN` version scheme, 8 changelog entries without a `version` key, and one routing marker, because its routing prose never names `UNKNOWN_FALLBACK`. The pre-move `SKILL.md` at `8e4573b8f` lacked that marker too.

### Constraints

- A skill rename changes the name each Claude Project kernel and its parity gate compare, so it reaches every Project that loads the skill.
- New sections and resource-doc re-versioning change content the phase's routing-only scope does not cover.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Waive AC-008 for these four skills and send their canon fixes to a follow-up AI Systems canon packet, offered to the operator. The phase goal's canon criterion was amended on 2026-10-29 to the routing-shape result plus the 12 skills a routing move can bring to a pass.

**How it works**: AC-008 reads `Waived` with this record in its Waiver cell. The implementation summary lists the four failures under Known Limitations.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive to a follow-up canon packet** | The routing phase closes on what it changed, and the canon work gets its own scope and review | Four skills keep failing the strict checker until that packet runs | 8/10 |
| Fix all four inside this phase | AC-008 passes as written | The renames reach every Project kernel and parity gate, far past a routing move | 4/10 |
| Leave AC-008 unmet | No new record | The phase can never close, though nothing in its scope is left | 2/10 |

**Why this one**: It closes the routing work on evidence and keeps the renames under a review of their own.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The phase closes with every routing criterion met, and the remaining canon gaps are named per skill.

**What it costs**:
- Four skills still print `Result: FAIL` under the strict checker. Mitigation: the follow-up packet starts from the per-skill list above.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The follow-up never runs | M | The implementation summary and this record both name it, and the operator was offered it |
| A rename breaks a Project kernel | M | The follow-up runs each Project's parity gate after a rename |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four of 16 skills fail AC-008 on findings outside routing |
| 2 | **Beyond Local Maxima?** | PASS | Three options were compared above |
| 3 | **Sufficient?** | PASS | Every routing-shape check passes on all 16 |
| 4 | **Fits Goal?** | PASS | The goal is moving each router into `ROUTER.md` with routing unchanged |
| 5 | **Open Horizons?** | PASS | The follow-up can fix the four without touching the routers |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- AC-008 is marked `Waived` with ADR-001, and the goal's canon criterion carries the dated amendment.

**How to roll back**: Set AC-008 back to `Unmet` and restore the goal criterion's original text.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
