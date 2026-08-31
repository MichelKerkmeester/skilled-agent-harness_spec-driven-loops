---
title: "Implementation Summary: Phase 5: Integration and Lifecycle Contract"
description: "The three wiring points and three lifecycle paths, ordered so every interruption leaves an unreferenced file rather than a router row pointing at nothing. Retire - the one operation the set has never performed - was derived by inverting create and dry-run to 7/7/7 self-consistency."
trigger_phrases:
  - "wiring contract shipped"
  - "retire dry run"
  - "interruption safety"
  - "scope check replay"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/040-create-repo-rules/005-agents-md-integration"
    last_updated_at: "2026-08-31T11:33:11Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Contracted the wiring points and the three lifecycle paths"
    next_safe_action: "Author the command and register the mode across four hub files"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-agents-md-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-agents-md-integration |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`references/agents-md-integration.md` — the three wiring points, three lifecycle paths, and
the ordering that makes each one interruptible. It closes the gap phases 3 and 4 both
recorded rather than solved.

### The ordering is the whole design

Create writes the **file first**, then the rows, then the pointer. Retire is the exact
inverse: pointer, index row, trigger row, file.

Both orders are chosen for what happens when you stop halfway. Stop mid-create after the
file and you have an unreferenced file — inert, harmless, obvious. Stop after a row with no
file and you have a router row pointing at nothing, which **looks like coverage**. The rule
is: always leave the safer wreck.

### The retire path, dry-run rather than reasoned about

The rule set has never retired a rule, so the path has no worked example anywhere. It was
run on paper against `root-cause.md`: **8/8/8 before, 7/7/7 after**, self-consistent, with
all four interruption states enumerated and none of them leaving a dangling row.

### The scope check earns its place twice over

Replayed against both scope-statement widenings the set has had — delegation posture and
delivery — and **both would have been caught before the trigger row was written**. Each was
a case of a router about to route to a rule its own §4 declared out of bounds.

### The pointer is the point people skip

Measured: pointer counts run **2-4 per rule across 18 sections**. Without one, a rule is
discoverable at session start and invisible at the moment of need — which was the exact
state of the whole set before phase 5 of the reference implementation.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/agents-md-integration.md` | Created | Wiring and lifecycle contract, 139 lines |
| `references/README.md` | Modified | Routes to it |
| `SKILL.md` | Modified | Revise and retire now carry real orderings; zero deferral notes remain |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The create path was read out of what the reference implementation actually did eight times,
not out of what it intended. Retire was then derived by inverting it, because two separately
written procedures drift and one derived from the other cannot.

The dry-run caught a measurement error worth recording. The first self-consistency check
reported the retire path leaving the router **inconsistent**, which would have meant the
ordering was wrong. It was the counting expression: it matched every line containing a
`repo-rules/` link, so index rows were counted as trigger rows and the total came out at 16
instead of 8. Re-counted section-bounded, the path is clean.

Nothing was executed. The router, `AGENTS.md` and the corpus are all confirmed untouched —
this phase writes a contract, and the first real retirement will be the first time any of it
runs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| File first on create, file last on retire | Both orders leave an unreferenced file as the worst intermediate state. A row pointing at nothing looks like coverage, which is worse than an obvious orphan |
| Derive retire by inverting create | Retire has no precedent anywhere. Two separately written procedures drift; one derived from the other cannot |
| Dry-run rather than reason about it | The only operation with no worked example is the one least safe to argue from first principles |
| Do not archive retired rules | Git holds the history. An archive directory becomes where rules go to be ignored, and a reader cannot tell retired from pending |
| `version`: fourth segment for any content change | All eight rules sit at 1.0.0.0, so the corpus offers no evidence. Recorded in the contract as a choice, not a finding |
| Revise re-runs the decision tests | A rule that no longer passes them should be retired, not patched. Patching is how a set stops meaning anything |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Retire dry-run leaves the router self-consistent | PASS - 8/8/8 before, 7/7/7 after |
| Every interruption state enumerated | PASS - 4 states; worst is an unreferenced file, none has a dangling row |
| Scope check would have caught both widenings | PASS - delegation posture and delivery, both refused by the §4 In list of their time |
| Create path reproduces the shipped wiring | PASS - three points confirmed present on all eight rules, pointers 2-4 each |
| Nothing executed against the live router | PASS - `REPO RULES.md`, `AGENTS.md` and `repo-rules/` all untouched |
| Deferral notes replaced | PASS - zero "deferred" mentions remain in `SKILL.md` |
| All packet documents parse | PASS - 9 of 9 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The retire path has still never been executed.** A paper dry-run with correct counts is the strongest evidence available before a real retirement, and it is not the same thing. The first real one should be watched.
2. **The `version` convention is invented.** All eight rules sit at `1.0.0.0` so the corpus could not settle it. The contract says outright that it is a choice.
3. **The scope check depends on a human reading §4.** It is a judgment about whether a rule's subject falls inside a prose list. Nothing mechanical could make that call, and two of the set's own widenings show how easy it is to skip.
4. **Multi-section pointers are contracted but untested at the edges.** Rules carry 2-4 pointers each; what happens when a rule governs a section that is itself later removed is unspecified.
5. **Interruption safety is argued, not tested.** No one has actually killed a wiring operation halfway and inspected the result.
<!-- /ANCHOR:limitations -->

---


