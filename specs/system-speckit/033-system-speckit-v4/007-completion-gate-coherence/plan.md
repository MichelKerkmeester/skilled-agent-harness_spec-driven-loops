---
title: "Implementation Plan: One Validation Verdict, Honestly Earned"
description: "Land the gate fixes one at a time, each with a before-and-after comparison across a real sample, starting with the verdict flip."
trigger_phrases:
  - "validation gate coherence plan"
  - "engine selection verdicts identical"
  - "freshness rule single entry point"
  - "duplicate finding measured refuted"
  - "stale hardcoded child list"
  - "command tree comparison repository check"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/007-completion-gate-coherence"
    last_updated_at: "2026-08-29T10:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded how the sequence actually ran"
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
# Implementation Plan: One Validation Verdict, Honestly Earned

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Four changes, landed separately, each measured against a sample of real packets
before and after. The order is deliberate: correctness of the verdict first,
then the check that trained readers to distrust it, then the double-counting,
then the code that cannot run.

Nothing here deletes a check that reports a real fault. Every reduction in the
failure count must be shown to come from a duplicate finding, an unsatisfiable
condition, or a verdict that was wrong — never from lowering a bar.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- A sample of packets returns identical verdicts and exit statuses under every
  engine selection.
- Every packet whose verdict changes is examined individually and the change
  justified.
- The validation test suites pass unchanged.
- No rule disappears from the report except the ones deliberately merged, and
  their detail lines survive in the finding that remains.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two validators answer the same question. One is a shell script that resolves
each rule through the registry by spawning a process per lookup; the other is a
compiled orchestrator that runs some rules natively and shells out to the rest.
The orchestrator's shell-out is the right design and stays: it bounds
duplication to the handful of rules implemented twice rather than all of them.

The defect is not that two engines exist but that nothing declares which one
answered, and that one rule's applicability is decided independently in each.
The fix is a single gate on that rule and an engine named in the output.

The command-tree comparison is a repository-level fact wired into a per-packet
rule. It moves to its own check. Nothing about it changes except where it runs
and what its failure blocks.

The duplicated template reporting is two branches of one function. They merge
into one finding carrying both detail lists.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: One verdict

Move the freshness rule's applicability decision into a single place both
engines consult, so the documented opt-in governs both. Name the engine in the
output. Compare a broad sample across every engine selection and require
identical verdicts.

### Phase 2: The unsatisfiable check

Run the command-tree comparison as its own repository check and remove it from
the per-packet gate. Then revisit the documents that recorded a workaround, so
the guidance to disregard the gate's exit status does not outlive its cause.

### Phase 3: One fault, one finding

Merge the two template-shape branches into a single finding with both detail
lists, and remove the third rule already stubbed out on the default engine.
Verify that the packets affected lose exactly one finding each and none stops
failing outright.

### Phase 4: Code that cannot run

Remove the unreachable paths the audit identified, each justified by showing it
cannot execute rather than by how it looks. Confirm the rule inventory is
unchanged afterwards.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The load-bearing test is a differential one: validate a sample of real packets
under each engine selection and require the verdicts to match. Before the fix it
must fail, which is the negative control that proves it measures the defect.

For the merge, the test is that affected packets lose one finding and keep the
same pass or fail outcome. For the deletions, that the set of rules evaluated is
identical before and after.

**What the differential actually showed.** It failed loudly, as required: 48 of
150 packets disagreed, in four signatures rather than the single one expected.
Two signatures were checks the older engine made and the survivor did not, which
turned the deletion into a port-then-delete rather than a delete. That is the
value of running the negative control before writing the fix: the plan assumed
the survivor was already the stricter of the two, and it was not.

Deleting an engine makes the differential unrunnable afterwards, so the
equivalent evidence is a front-end comparison: the same packets validated
through the old and the new front-end, requiring identical exit statuses. That
ran across 120 packets with no differences.

The regression measurement is a delta, not an absolute: the same test suites are
run at the previous commit and after the change, and only tests that fail in the
second run and not the first count. The suites have substantial pre-existing
failures, so an absolute pass requirement would have been unmeetable and would
have hidden exactly the regressions worth catching.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The rule registry, which both engines read.
- The compiled orchestrator build, whose absence is itself one of the engine
  selection paths.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each phase is its own commit touching a distinct area, so any one reverts
without disturbing the others. No packet content changes, so a revert restores
the previous behaviour exactly.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

The riskiest phase is the first, because it changes what the completion gate
says. It lands with the differential comparison recorded, so a revert can be
judged against evidence of what the verdicts were rather than against memory.

If the engine question is settled by deletion rather than an explicit flag, that
is a separate commit again, so the gating fix survives a change of mind about
the engine.
<!-- /ANCHOR:enhanced-rollback -->
