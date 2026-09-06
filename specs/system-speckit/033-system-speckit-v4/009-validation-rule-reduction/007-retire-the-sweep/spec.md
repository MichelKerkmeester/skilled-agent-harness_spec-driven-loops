---
title: "Feature Specification: A Gate That Can Actually Block"
description: "Replace a weekly cron that could not fail a merge with a pull-request check scoped to the packets the change touched."
trigger_phrases:
  - "retire sweep"
  - "changed packet validation"
  - "spec packet merge gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/007-retire-the-sweep"
    last_updated_at: "2026-08-30T08:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Added a changed-packet pull-request gate and deleted the weekly sweep workflow"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - ".github/workflows/changed-packet-validation.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-041-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: A Gate That Can Actually Block

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 006-delete-taste-rules |
| **Successor** | None |
| **Handoff Criteria** | A pull request that breaks a packet it touched is blocked, and one that touches only healthy packets is not |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The completion gate was mandatory for a completion claim and enforced nothing
mechanically. Its only whole-tree job was a weekly cron, which cannot block a
merge by construction, and three properties made it worse than absent.

It ran on a schedule, so a broken packet was discovered days after the change
that broke it, detached from the author and the diff. Its baseline lived in a
GitHub Actions cache keyed on a run id, so the comparison it drew was against
whatever happened to still be in cache rather than against a known state. And
its sweep step carried `continue-on-error`, so the enforcement job downstream
tested the recorded outcome rather than the packets — a known-failure state
reported success.

Meanwhile roughly a fifth of the corpus fails on authored content that predates
any current change. A whole-tree gate would block every author for packets they
never opened, which is the reason no blocking gate was ever turned on.

### Purpose

Make the gate block the thing it can fairly block: the packets a change
actually touched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- A pull-request workflow that resolves the packets in the diff and validates
  each one.
- Deleting the weekly sweep workflow and its index entry.

**Out of scope**

- The sweep script itself. It keeps its tests and stays runnable on demand;
  what is removed is the schedule and the enforcement job that misreported.
- Repairing the packets that currently fail. Scoping the gate to changed
  packets is what makes that repair optional rather than blocking.
- Collapsing the rule set further. That is phase 8 and is not done here.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | The check validates exactly the packets the pull request changed | P0 |
| REQ-002 | A packet that fails validation fails the check | P0 |
| REQ-003 | Pre-existing failures in untouched packets do not block a merge | P0 |
| REQ-004 | A validator that refuses to run fails the check rather than reading as a pass | P0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Replaying the check over recent real work resolves the right packets and
  passes.
- Replaying it over a known-broken packet blocks.
- The weekly sweep no longer exists as a scheduled job.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Packet resolution is wrong | The gate blocks good work or misses bad work | Resolution was replayed against real commit ranges before the gate was written into CI; 129 changed files resolved to 15 distinct packets, parents and children both |
| The gate blocks every pull request | Authors route around it and it is switched off | Simulated over the last eight commits of real work: 15 of 15 packets pass |
| A stale build makes the validator silent | Silence reads as success, which is how the sweep failed | The check requires an explicit `RESULT: PASSED` line rather than trusting an exit code |
| A phase parent drags in unchanged children | Unrelated failures block the author | The run is `--no-recursive`; a changed child appears in the list on its own |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Whether the check should be marked required in branch protection. The workflow
exists and will run on pull requests; making it mandatory is a repository
setting outside this packet.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 8. RELATED DOCUMENTS

- `../spec.md` — the parent packet and its phase map
- `plan.md`, `tasks.md` — this phase's approach and execution
<!-- /ANCHOR:related-docs -->
