---
title: "Implementation Plan: Rules Nothing Reads"
description: "Prove each rule has no reader, delete it whole, and show the corpus returns identical verdicts."
trigger_phrases:
  - "delete taste rules plan"
  - "advisory rule deletion plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/006-delete-taste-rules"
    last_updated_at: "2026-08-30T08:15:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Deleted nine advisory rules and every reference to them"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-041-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Rules Nothing Reads

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Establish which advisory rules have a reader, delete the ones that do not
together with everything that mentions them, and prove the corpus is unaffected
by comparing verdicts on a pinned sample.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Every deletion is preceded by a repo-wide search for consumers, not a search
  of the validation library alone.
- Verdicts on the pinned sample are identical before and after.
- The test suites pass without any assertion being relaxed to fit the change.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The registry is the single dispatch point: a rule that is absent from
`validator-registry.json` does not run. Deletion is therefore a registry edit
plus removal of the now-unreachable implementation, rather than a change to the
orchestrator's control flow. One rule, `PRIORITY_TAGS`, was implemented natively
in the orchestrator, so it needed its function and its call site removed as well;
the set of native rule ids is derived from what the orchestrator pushes, so
nothing else had to be updated to match.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Measure

Run the pinned 300-packet sample and record, per rule, how often it ran, how
often it reported a no-op, and how often it produced a finding. This separates
rules that are quietly working from rules that only ever print.

### Phase 2: Establish readers

For each candidate, search the whole repository, excluding only the rule's own
implementation, tests and reference docs. This is the step that changed the
answer: a first pass over the validation library alone reported nine rules with
no consumer, and the repo-wide pass found that `AC_COVERAGE` is named in deep
review's completion criteria.

### Phase 3: Delete

Registry entries, rule scripts, the one native implementation and its now
unreferenced helper, the two script registries, the remediation-hint map, the
tests, and the documentation.

### Phase 4: Prove no drift

Re-run the pinned sample and compare verdicts packet by packet against the
baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The claim being tested is that deleting non-blocking rules cannot change a
verdict, so the test is a paired run over the same 300 packets with per-packet
comparison rather than an aggregate pass rate. An aggregate can hide equal
numbers of regressions and improvements; the per-packet comparison cannot.

Rule-level suites for deleted rules are removed rather than adapted, since a
test for absent behaviour is noise. The orchestrator bridge test kept its
coverage by moving from the deleted node rule to one that still ships.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 1 of this packet, which made warnings non-blocking. Without it these
  deletions would change verdicts.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reverting the commit restores the registry entries and the rule scripts
together. Because the rules are dispatched from the registry, a partial revert
of the registry alone would restore them to running order as well.
<!-- /ANCHOR:rollback -->
