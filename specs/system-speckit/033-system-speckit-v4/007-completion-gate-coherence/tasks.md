---
title: "Task Breakdown: One Validation Verdict, Honestly Earned"
description: "Ordered tasks to make the completion gate environment-independent, move the unsatisfiable check out, merge the duplicated finding, and delete unreachable code."
trigger_phrases:
  - "validation gate coherence tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/007-completion-gate-coherence"
    last_updated_at: "2026-08-29T10:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Closed every task with evidence"
    next_safe_action: "None outstanding; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Breakdown: One Validation Verdict, Honestly Earned

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

- [x] T-001 [P0] Reproduce the verdict flip on a real packet and record both exit statuses.
- [x] T-002 [P0] Identify the rule responsible and why each engine treats it differently.
- [x] T-003 [P1] Capture a baseline: a sample of packets validated under every engine selection, verdicts recorded. Evidence: 30 packets x 4 engine selections showed 17 disagreements; 150 packets across the two engines showed 48, in four signatures.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P0] Decide the freshness rule's applicability in one place both engines read. Decided at the rule's own entry point, so no caller can disagree; the rule's logic stays unguarded and directly testable.
- [x] T-102 [P1] Name the engine that produced a result in the validation output. Present as an `Engine:` line and an `engine` field in JSON.
- [x] T-103 [P0] Run the command-tree comparison as its own repository check.
- [x] T-104 [P0] Remove that comparison from the per-packet gate.
- [x] T-105 [P2] Revisit the documents that recorded a workaround for it.
- [x] T-106 [P1] DROPPED — the premise was measured and refuted. The two rules do not always co-occur: 4 packets in 220 fail the anchor rule alone, so they report separable faults and must not be merged. See the amendment in `spec.md`.
- [x] T-107 [P1] Remove the third rule already stubbed out on the default engine.
- [x] T-108 [P2] Delete the validation paths shown to be unreachable, including a stale hardcoded child list that was silently narrowing one packet's recursive run.
- [x] T-109 [P2] Settle whether the older engine is deleted or kept behind an explicit flag. Deleted, after showing the surviving engine loses no check it did not already have.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P0] The sample returns identical verdicts and exit statuses under every engine selection. Only one engine remains, so the question is now closed by construction; the front-end swap was proved verdict-neutral on 120 packets.
- [x] T-202 [P0] Every packet whose verdict changed is examined and the change justified. Each disagreement class was traced to a named cause before any code changed.
- [x] T-203 [P1] Not applicable — the merge was dropped once its premise was refuted.
- [x] T-204 [P1] The set of rules evaluated is unchanged after the deletions, except the one rule deliberately removed and three that were silently unreachable and now run.
- [x] T-205 [P1] The validation test suites pass, measured as a delta against the same suites at the previous commit.
- [x] T-206 [P2] Record the strict failure rate before and after.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- One verdict per packet, whatever the environment.
- No packet fails on a condition it cannot influence.
- One fault reports once.
- Every drop in the failure count is traced to a duplicate, an unsatisfiable
  condition, or a corrected verdict — never to a lowered bar.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 … REQ-007
- `plan.md` — sequence, testing, rollback

<!-- /ANCHOR:cross-refs -->

---

## VERIFICATION CHECKLIST

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

The load-bearing check is differential: the same packets validated under each
engine selection must agree. It is written so that it fails before the fix, so
the test is known to measure the defect rather than to assert a hope.

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [x] CHK-001 [P0] The verdict flip reproduced with both exit statuses recorded.
- [x] CHK-002 [P0] The responsible rule and the reason for the disagreement identified.
- [x] CHK-003 [P1] Baseline verdicts captured across engine selections.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [x] CHK-010 [P1] Applicability of the freshness rule is expressed once, at the rule's own entry point.
- [x] CHK-011 [P2] Deletions are justified by demonstrated unreachability, except the one rule removed for duplication, whose narrower justification is recorded in `spec.md`.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING CHECKLIST

- [x] CHK-020 [P0] The differential check failed before the fix (48 disagreements in 150 packets) and the engine fork it measured no longer exists.
- [x] CHK-021 [P1] Not applicable — the merge was dropped. Detail lines are now printed for every finding, which was the reader-facing half of the concern.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-030 [P0] No packet fails on a repository-wide condition; the command-tree comparison runs as its own repository check.
- [x] CHK-031 [P1] Failure-rate change accounted for by class, and every packet the restored check would have newly failed was repaired rather than left failing.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-040 [P2] No check that reports a real fault is weakened; two checks the surviving engine lacked were added to it before the other was removed.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-050 [P1] The freshness rule's documented condition matches its behaviour.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [x] CHK-060 [P2] The repository check sits with the other repository checks.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

The gate returns one verdict per packet, reports each fault once, and asks
nothing a packet cannot answer.

<!-- /ANCHOR:summary -->
