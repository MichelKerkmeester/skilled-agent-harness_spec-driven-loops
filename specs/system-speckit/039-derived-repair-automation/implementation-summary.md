---
title: "Implementation Summary: Automated Repair of Derived Packet Failures"
description: "Prototype repairs the derivable packet failures and refuses the authored ones; hardening, tests, generator audit, workflow wiring and the fleet run remain."
trigger_phrases:
  - "derived repair summary"
  - "repair-derived status"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/039-derived-repair-automation"
    last_updated_at: "2026-08-28T16:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Prototyped the repair tool and proved it restores a broken packet"
    next_safe_action: "Harden argument handling and add the fixture tests"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/repair-derived.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 20
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
| **Spec Folder** | 039-derived-repair-automation |
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
| Repairs restore a broken packet | PASS | A packet was broken in three derived ways, repaired, and two of its three files matched the committed content exactly; the third differed only in the level's type, which was then corrected |
| Idempotent | PASS | A dry run over an already-repaired subtree reported nothing repairable and exited clean |
| Refuses non-derived failures | PASS | The same run reported the rules it declined, grouped and counted, without writing |
| Fixture tests | PENDING | Not yet written |
| Workflow wiring | PENDING | Not yet added |
| Fleet dry run clean | PENDING | Not yet run |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only three repairs exist.** Other derivable fields may remain; the audit of
   the generators that emit them has not been done.
2. **No tests yet.** Correctness rests on a single manual break-and-restore
   exercise, which is evidence but not coverage.
3. **Not wired into any workflow**, so drift is still found by hand.
4. **The authored failures stay failing by design.** Roughly 139 packets and
   1,100 rule-hits record work nobody wrote down, and no tool can supply that.

<!-- /ANCHOR:limitations -->
