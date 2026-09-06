---
title: "Task Breakdown: Automated Repair of Derived Packet Failures"
description: "Ordered tasks to harden the repair tool, prove it with fixtures, audit the derived-field generators, wire it in reporting mode, and measure the fleet."
trigger_phrases:
  - "derived repair tasks"
  - "repair-derived tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/039-derived-repair-automation"
    last_updated_at: "2026-08-29T05:52:27Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the task breakdown for the derived-repair tool"
    next_safe_action: "Harden the repair tool and add its fixture tests"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/repair-derived.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Automated Repair of Derived Packet Failures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

- `[x]` complete · `[ ]` open
- `T-0NN` setup · `T-1NN` implementation · `T-2NN` verification

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T-001 [P0] Establish which failures are recomputable and which record work a person did.
- [x] T-002 [P0] Confirm the precedent: a fleet checker that repairs generated files, leaves authored ones alone, and runs in CI without its repair flag.
- [x] T-003 [P0] Prototype the tool and prove a broken packet is restored to its committed content.
- [x] T-004 [P1] Record the level field as a string, matching the form the overwhelming majority of packets already carry.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P0] Validate arguments and refuse any target outside the specs tree.
- [x] T-102 [P0] Return distinct exit codes for clean, repairable-while-reporting, and repair-failed.
- [x] T-103 [P1] Read both validator report shapes so no packet appears trivially clean.
- [ ] T-104 [P0] Build fixture packets, one broken per derived class and one carrying only authored failures. Only the recorded-location class is covered today.
- [x] T-105 [P0] Assert the authored fixture is byte-identical after a run.
- [x] T-106 [P1] Assert a second run over a repaired fixture changes nothing.
- [x] T-107 [P1] Audit the generators that emit derived fields for the omission already found in one of them.
- [x] T-108 [P1] Add a reporting-mode step to an existing workflow, never applying repairs.
- [x] T-109 [P2] Write the tool's readme, stating what it repairs, what it refuses, and why the refusal is deliberate.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P0] Run the tool's tests and read the result.
- [x] T-202 [P0] Dry run across the specs tree; confirm no repairable derived failures remain.
- [x] T-203 [P0] Confirm every remaining failure belongs to an authored rule, with counts by rule.
- [ ] T-204 [P1] Confirm the workflow step passes in reporting mode.
- [x] T-205 [P1] Confirm the scoped diff contains no archived or scratch packet and no generated database or log file.
- [ ] T-206 [P2] Write the implementation summary and reconcile packet metadata.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- The tool repairs every derived class and writes nothing for any authored one.
- A fleet dry run reports no repairable derived failures.
- Remaining failures are authored-only and reported by rule.
- The workflow reports without applying.
- Repeated runs converge.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 … REQ-010
- `plan.md` — architecture, phases, rollback
- `.opencode/skills/system-spec-kit/scripts/spec/repair-derived.cjs` — the tool

<!-- /ANCHOR:cross-refs -->

---

## VERIFICATION CHECKLIST

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

Each claim below is settled by a command whose output and exit status are read,
not by inspection. Repair claims are checked against the committed content of a
deliberately broken packet, so the proof is a restoration rather than an
assertion that a rule stopped firing.

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Repairable and non-repairable rules separated and written down.
- [x] CHK-002 [P0] Existing precedent read: derived files regenerated, authored files left to a person, CI runs without the repair flag.
- [x] CHK-003 [P1] Level field recorded in the form the majority of packets already use.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [x] CHK-010 [P0] Repairable rules are an explicit allow-list, so an unlisted rule is refused by construction.
- [x] CHK-011 [P0] Every written value is recomputed from repository state.
- [x] CHK-012 [P1] Comments explain why a repair is safe, not which packet prompted it.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING CHECKLIST

- [ ] CHK-020 [P0] A fixture broken in each derived way is repaired. The level and re-derive classes have no fixture yet.
- [x] CHK-021 [P0] A fixture carrying only authored failures is byte-identical afterwards.
- [x] CHK-022 [P1] A second run over a repaired fixture changes nothing.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-030 [P0] Fleet dry run reports no repairable derived failures.
- [x] CHK-031 [P1] Remaining failures reported by rule and all belong to authored classes.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-040 [P0] A target outside the specs tree is refused.
- [x] CHK-041 [P1] Writes stay within the packet under repair.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-050 [P1] Readme states what is repaired, what is refused, and why the refusal is deliberate.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [x] CHK-060 [P1] Tool sits beside the validator it reads; tests sit with the other script tests.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

Derived failures are repaired from repository state; authored failures are
reported and left for the person who did the work.

<!-- /ANCHOR:summary -->
