---
title: "Decision Record: Phase 6: playbook-and-closeout"
description: "Why the scenarios are grouped by failure mode rather than by chart family, why the result-persistence sentence is restated, and why the fleet metadata criterion closes as a waiver."
trigger_phrases:
  - "chart playbook decisions"
  - "scenarios by failure mode"
  - "result persistence restated"
  - "fleet metadata waiver"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/006-playbook-and-closeout"
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "phase-6-closeout"
    recent_action: "Recorded the three decisions this phase took"
    next_safe_action: "Act on the open items in implementation-summary.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-6-playbook-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001: scenarios group by failure mode, with a family coverage table"
      - "ADR-002: the result-persistence sentence is restated without its semicolon"
      - "ADR-003: the fleet metadata criterion closes as a waiver"
---
# Decision Record: Phase 6: playbook-and-closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Scenarios group by failure mode, with a family coverage table

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 6 implementer |
| **Satisfies** | REQ-005, SC-001, US-001 |

---

### Context

The phase requirement asks for coverage of each chart family and the colour system rather than
one representative case. There are six families, which invites six scenarios.

The corpus record lists eight defects found by opening files in a browser, and they do not
distribute by family. Three are headlines that contradicted their own data. One is an axis ladder
too coarse for its peak. Four are text clipped, overflowing or overlapping. The same defect class
appears in two or three families at once, and two families share a single instance.

### Decision

Write eight scenarios grouped by the failure each one catches, in three categories, and carry a
table in the root index naming every family, the scenario that covers it and the reason that
scenario is the one.

### Consequences

- Every scenario fails for a reason no other scenario catches, which is the bar for inclusion.
- A reader looking for a family has one extra hop, which the coverage table pays for.
- Adding a seventh family later means adding a row rather than a document.

### Alternatives Rejected

- **One scenario per family.** Six documents that all fail for the same reason, and a reader who
  cannot tell which to run. It also leaves the colour system and the delivery property with no
  home, because neither belongs to a family.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The result-persistence sentence is restated without its semicolon

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 6 implementer |
| **Satisfies** | REQ-001, SC-001 |

---

### Context

Sibling playbook packages carry the result-persistence contract sentence verbatim. It contains a
semicolon, which is a hard blocker under the voice standard the same hub ships. One sibling
carries it anyway and records the semicolon as an exemption pinned by the contract.

The package validator reads the marker comment, not the sentence. Nothing compares the wording.

### Decision

Keep the marker comment exactly as the validator expects it, restate the sentence beside it
without the semicolon, and say so in the root index where a reader will look for the difference.

### Consequences

- The package passes both the contract check and the voice scan with no exemption to carry.
- The wording differs from its siblings by one clause, which the note beside it explains.

### Alternatives Rejected

- **Carry the sentence verbatim and record an exemption.** A second exemption to maintain, for a
  string no check compares, on a package that has no other reason to hold one.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The fleet metadata criterion closes as a waiver

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 6 implementer |
| **Satisfies** | REQ-004, SC-003 |

---

### Context

REQ-004 asks that the fleet skill-root metadata check report no violation across every root,
not only this one. Run from the final state it reports `checked=14 passed=13 failed=1` at exit 1.
The single failure is `mcp-tooling`, whose committed leaf manifest does not match a fresh
regeneration. `sk-doc` reports `OK [H]`.

That failure is not this packet's. The scaffold phase recorded the identical result before any
chart file existed, and this phase changed nothing under `mcp-tooling`. Regenerating another
hub's manifest is outside the write authority this packet was given.

### Decision

Close the criterion as a waiver rather than as met. Record the fleet number, name the one failing
root, name the cause and leave the fix to whoever owns that hub.

### Consequences

- The packet closes on an honest number rather than on a criterion quietly rewritten to fit it.
- A reader is told the fleet check is red and why, instead of finding it themselves.
- The criterion stays available to re-run once the neighbouring manifest is regenerated.

### Alternatives Rejected

- **Regenerate the `mcp-tooling` manifest.** It would turn the number green and would be an
  unreviewed edit to a hub nobody asked this packet to touch.
- **Rewrite the criterion to cover this root only.** That is the criterion agreeing with the
  result after the fact, which is exactly what the requirement was written to prevent.
<!-- /ANCHOR:adr-003 -->
