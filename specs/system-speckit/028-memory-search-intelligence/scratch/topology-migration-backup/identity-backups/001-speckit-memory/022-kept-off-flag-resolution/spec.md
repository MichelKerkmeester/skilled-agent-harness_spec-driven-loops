---
title: "Feature Specification: Kept-Off Flag Resolution"
description: "The final flip-or-delete reckoning for every 028 default-off flag: keep 5 default-on, delete 10 and their code, decided per flag under a fair real-world simulation with a fresh-Opus final gate and a 4-layer verification."
trigger_phrases:
  - "028 kept off flag resolution"
  - "028 flag flip or delete reckoning"
  - "028 keep 5 delete 10 flags"
  - "028 final flag disposition"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/022-kept-off-flag-resolution"
    last_updated_at: "2026-07-04T17:51:01.130Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created the flag-resolution phase folder documenting keep 5 and delete 10"
    next_safe_action: "Use this phase as the authoritative per-flag disposition for 028"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-20-028-022-kept-off-flag-resolution"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every default-off flag has a final keep-or-delete decision."
      - "The deleted flags had their code removed and committed before this phase documented the outcome."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Kept-Off Flag Resolution

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-20 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `system-speckit/028-memory-search-intelligence` |
| **Phase** | 007 of 007 |
| **Predecessor** | ../004-review-remediation/spec.md |
| **Source decisions** | `../benchmark-status.md`, `../keep-off-flag-roadmap.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 028 build epoch shipped most of its new search and memory behavior behind default-off flags and closed with no flag flipped. A keep-off reinvestigation then gave each flag a path to useful, and a transitional pass flipped four to default-on while the rest waited behind that path. That left the tree carrying many dormant switches whose someday-flip was an assumption, not a measured fact. A release sign-off could not tell which switches earned their place and which were dead code carrying a hopeful note.

### Purpose
Close the experiment with a per-flag flip-or-delete decision so every 028 default-off flag is resolved. Keep the switches that earned default-on and delete the ones that did not, along with their code, so the surviving flag surface is exactly the set a reader can trust.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A per-flag keep-or-delete decision for every 028 default-off flag, with one-line deciding evidence each.
- The method that produced each decision: a fair real-world simulation as the live signal, plus a fresh-Opus final decision gate per flag.
- The 4-layer verification that hardened each decision: triage, adversarial-verify, fresh-Opus, deep-review.
- The documentation reconciliation of the four cross-cutting docs, the affected decision-records, the changelog and the timeline to this final reality.

### Out of Scope
- The code removal of the ten deleted flags, which was already executed and committed before this phase documented the outcome.
- The five kept flags' implementation, which shipped during the build epoch and is unchanged here.
- The pre-028 graph-channel follow-up on `useGraph`, `SPECKIT_GRAPH_SIGNALS` and `SPECKIT_DEGREE_BOOST`, which stays out of 028 scope.
- Packet 030 and any concurrent-session files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../feature-flags.md` | Modify | Drop the 10 deleted flags, list the 5 kept default-on |
| `../keep-off-flag-roadmap.md` | Modify | Replace path-to-useful framing with the final keep-or-delete resolution table |
| `../benchmark-status.md` | Modify | Record the final keep 5 and delete 10 tally |
| `../before-vs-after.md` | Modify | Reconcile the narrative to keep 5 and delete 10 |
| `../001-speckit-memory/changelog/changelog-001-022-keep-off-flag-reinvestigation.md` | Modify | Reframe the milestone to the deletion reckoning |
| `../001-speckit-memory/changelog/changelog-001-root.md` | Modify | Update the closing milestone row |
| `../timeline.md` | Modify | Reconcile Section G to keep 5 and delete 10 |
| `../**/decision-record.md` (deleted-flag phases) | Modify | One-line deleted-superseded-by-measurement note each |
| `spec.md` | Create | Defines the resolution scope and the per-flag disposition |
| `plan.md` | Create | Defines the method and verification route |
| `tasks.md` | Create | Records the reconciliation and documentation tasks |
| `checklist.md` | Create | Records the verification items |
| `implementation-summary.md` | Create | Records the executed reckoning and its evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every default-off flag has a final disposition | Each flag is recorded KEPT default-on or DELETED in the resolution table |
| REQ-002 | Each disposition carries deciding evidence | Each row has a one-line measured reason, no flag deleted or kept on a guess |
| REQ-003 | Deleted flags read as removed, not dormant | The four cross-cutting docs and the affected decision-records show the deletions, no path-to-useful framing survives |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Honest framing on the no-harm keeps | The retention and prelude keeps read as safety or grounding guarantees, not precision wins |
| REQ-005 | The method is documented | The real-world simulation signal and the fresh-Opus per-flag gate are recorded |
| REQ-006 | The 4-layer verification is documented | Triage, adversarial-verify, fresh-Opus and deep-review are named as the verification stack |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The final tally is keep 5 default-on and delete 10, recorded in `benchmark-status.md` and `keep-off-flag-roadmap.md`.
- Every cross-cutting doc, the affected decision-records, the changelog and the timeline agree with that tally.
- No surviving document carries the transitional four-flip or path-to-useful framing.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A keep reads as a precision win when it is a no-harm guarantee | A sign-off over-trusts a safety flip | Keep the honest framing in every evidence cell |
| Risk | A deleted flag still appears live in a stale doc | A reader chases a removed switch | Reconcile all four cross-cutting docs plus the decision-records |
| Dependency | The committed code removal of the ten flags | The docs describe a state the code already reached | Code removal was executed and committed before this phase |
| Dependency | The criterion-4 benchmark and the real-world simulation | The deciding evidence rests on them | Both ran before the reckoning decided |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- Every disposition must trace to a measured number or a structural fact, not a guess.
- The no-harm keeps must not be dressed as precision wins.
- All docs follow the HVR voice: no em-dashes, no prose semicolons, no Oxford commas, no artifact ids in prose.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A flag with a real correctness fix but no real-data effect is deleted, not kept. The procedural reliability multiplier is the case: the de-rate fix stayed committed but the flag and its emitter were removed.
- A flag with a high oracle ceiling but a net-zero live result is deleted. Agentic recall is the case, +0.344 oracle but live net-zero with regressions.
- A flag that is correct but not a recall lever is deleted. Edge-presence currentness is the case, an integrity pass that repairs 0 on the live graph.
- A no-harm keep must keep its honest framing. Retention forgetting and the world-summary prelude are the cases.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| File count | Medium | Four cross-cutting docs plus eight decision-records plus the changelog and timeline |
| Risk | Low | Documentation reconciliation against a committed code state |
| Verification | Medium | Strict validation plus an HVR scan across the reconciled surfaces |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The coupling guard on the kept calibration pair and the pre-028 graph-channel harm are recorded as follow-ups out of this phase's scope.
<!-- /ANCHOR:questions -->
