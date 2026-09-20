---
title: "Tasks: deep-loop and spec-kit playbook remediation"
description: "Ordered tasks: measure eight roots, classify the large counts, transform the single-cause classes, survive and relaunch the agent failures, re-measure."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "deep-loop and spec-kit playbook remediation tasks"
  - "runtime vocabulary transform tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-doc/037-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/037-playbook-family-remediation/003-deep-loop-and-spec-kit"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Completed the deep-loop and spec-kit tasks; eight roots re-measured at zero"
    next_safe_action: "None; tasks complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual-testing-playbook"
      - ".opencode/skills/system-deep-loop/runtime/manual-testing-playbook"
      - ".opencode/skills/sk-git/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:bbd923705556d00457a26d6cc9b03a5dc43faaad4689992becfa1986f53149c9"
      session_id: "2026-08-29-sk-code-031-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: deep-loop and spec-kit playbook remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Measure each of the eight roots with its own `--package <root> --strict` run and record the starting counts. Evidence: `system-spec-kit` 918, `system-deep-loop/runtime` 473, `deep-review` 173, `deep-research` 165, `deep-improvement` 123, `sk-git` 89, the `system-deep-loop` parent 79, `sk-doc/sk-create-diff` 1.
- [x] T-002 Record each root's routing-gold exclusion count before the work so a later reclassification would be visible. Evidence: `system-spec-kit` carries 20 routing-gold-excluded scenarios against 402 operator scenarios; the `system-deep-loop` parent carries 6 against 14.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Classify `system-deep-loop/runtime`'s 473 violations before editing. Evidence: one uniform structural drift across 54 scenarios generated against an older section vocabulary that wrote `SOURCE_METADATA` with an underscore, which is why the required-section regex never matched.
- [x] T-004 Apply one reviewed vocabulary transform to `runtime` and handle the residual case by hand. Evidence: the transform cleared 472 of the 473; the remaining one was handled explicitly rather than forced into the same shape.
- [x] T-005 Correct `sk-git`'s shared boilerplate line once rather than 82 times. Evidence: 82 of its 89 violations were instances of a single line carrying both a `PARTIAL` verdict the fail-closed tier forbids and a `SKIP` with no blocker recorded.
- [x] T-006 Repair the misaligned `sk-git` scenario table. Evidence: a stray `||` shifted the columns so the grader read command text out of the Evidence cell; the table had been passing on the misread rather than on correct content.
- [x] T-007 Work `system-spec-kit`'s 918 violations class by class across its 402 operator scenarios. Evidence: final census `PASS package=system-spec-kit scenarios=422 categories=26 operator=402 routing_gold_excluded=20 violations=0 warnings=0`.
- [x] T-008 Relaunch the four remediation agents terminated mid-run and complete their roots. Evidence: the terminations were an organisation-side API block reporting `oauth_org_not_allowed` with subscription access disabled for `claude-sonnet-5`; work already written to disk survived, the agents were relaunched on the inherited model, and the banked progress at the time of failure was `system-spec-kit` 918 to 514, `deep-improvement` 123 to 9, and `deep-research` 19 to 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-009 Re-measure all eight roots individually and read each census line. Evidence: `system-spec-kit` 422 across 26, `deep-research` 62 across 9, `deep-improvement` 60 across 11, `deep-review` 55 across 10, `runtime` 54 across 12, `sk-git` 42 across 8, the `system-deep-loop` parent 20 across 6, `sk-doc/sk-create-diff` 11 across 3 — all `tier=FAIL_CLOSED violations=0`.
- [x] T-010 Confirm the stale section vocabulary is gone from the shipped tree. Evidence: a recursive search for the underscored `SOURCE_METADATA` token across `system-deep-loop/runtime/manual-testing-playbook/` returns 0 files.
- [x] T-011 Confirm no count was cleared by moving scenarios out of the operator contract. Evidence: `system-spec-kit` still reports `routing_gold_excluded=20` and the `system-deep-loop` parent still reports `routing_gold_excluded=6`, both unchanged from the starting census.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All eight roots report `violations=0` at `tier=FAIL_CLOSED` under their own runs, including the fleet's largest at 422 scenarios.
- The two single-cause counts were repaired at their cause, and the record says which shape each count had.
- The routing-gold exclusion counts are unchanged, so nothing reached zero by leaving the contract.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Parent packet and phase map: `../spec.md`.
- Predecessor phase: `../002-cli-and-mcp-transports/`.
- Successor phase: `../004-fail-closed-graduation/`.
<!-- /ANCHOR:cross-refs -->
