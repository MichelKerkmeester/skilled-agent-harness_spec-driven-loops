---
title: "Implementation Summary: Automated Repair of Derived Packet Failures"
description: "Prototype repairs the derivable packet failures and refuses the authored ones; hardening, tests, generator audit, workflow wiring and the fleet run remain."
trigger_phrases:
  - "repair-derived tool"
  - "derived packet failures"
  - "folder name recorded in summary"
  - "frontmatter pointer repair"
  - "generated metadata re-derived"
  - "refuses authored failures"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/006-derived-metadata-repair-tool"
    last_updated_at: "2026-08-29T05:52:27Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped the repair tool with tests, workflow reporting and the fleet application"
    next_safe_action: "Confirm the workflow reporting step runs green on a dispatched sweep"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/repair-derived.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Automated Repair of Derived Packet Failures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-derived-metadata-repair-tool |
| **Status** | In Progress |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A repair tool that reads the validator's verdict for a packet, keeps only the
failures whose correct value can be recomputed from the repository, and writes
those. The tool is `.opencode/skills/system-spec-kit/scripts/spec/repair-derived.cjs`, beside the `validate.sh` it reads. Three repairs exist: the folder name recorded in the summary, the pointer
carried in document frontmatter, and the declared level in the generated
description. Generated metadata is re-derived in the same pass, because editing
a document invalidates the fingerprint taken over it.

Everything else is counted and reported by rule, never written.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The boundary came first and the code followed it. A remediation pass over 517
packets showed which failures were recomputation and which were records of work
a person did, and the tool was written to act only on the first group.

Reporting is the default. Application is a separate flag, so the tool cannot
rewrite the fleet as a side effect of being run.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Repairable rules are an explicit allow-list | An unlisted rule is refused by construction, so the boundary cannot erode by oversight |
| Reporting is the default, application a separate flag | The tool cannot rewrite the fleet as a side effect of being run |
| Re-derivation happens inside the repair | Editing a document invalidates its fingerprint; deferring it trades one error for another |
| The level is written as a string | It matches the form the overwhelming majority of packets already carry, keeping the field comparable |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Repairs restore a broken packet | PASS | A packet was broken in three derived ways, repaired, and its files compared against their committed content |
| Idempotent | PASS | A second run over a repaired packet changes nothing; asserted in the fixture tests |
| Refuses non-derived failures | PASS | An authored-only fixture is byte-identical afterwards, asserted on file contents |
| Refuses targets outside the packet tree | PASS | Paths outside the tree, traversal, unknown flags and valueless flags all rejected |
| Fixture tests | PASS | Six tests covering repair, refusal, containment, reporting and idempotence |
| Fleet dry run clean | PASS | 2,509 packets inspected, nothing repairable, nothing unreadable, working tree unchanged |
| Remaining failures authored-only | PASS | Reported by rule, led by continuity freshness and evidence citation |
| Standards conformance | PASS | Boxed header and numbered sections per the surface checklist; the surface drift guards report nothing against these files |
| Workflow reporting step | PENDING | Added and dispatched; not yet observed green on a run |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A fleet run is slow.** The tool asks the validator about each packet in
   turn, and that call is the whole cost, so a whole-tree pass stays in the minutes rather than the hours it took before the work ran in parallel. Scope it with `--folder` or
   `--roots` where possible, and expect the workflow step to add materially to
   that job's runtime.
2. **The repairable set is deliberately small.** Four rules are settled from
   repository state; every other failing rule is reported and left, because the
   answer lives with whoever did the work rather than in the repository.
3. **Repairs raise the freshness warning.** Re-deriving metadata updates the
   save time while the continuity block keeps its own, so an error becomes a
   warning and the raw failure count moves less than the error count does.
4. **Most of what it found was invisible.** The weekly sweep only inspects
   packets claiming completion, so the drift this corrected was not causing any
   reported failure.

<!-- /ANCHOR:limitations -->
