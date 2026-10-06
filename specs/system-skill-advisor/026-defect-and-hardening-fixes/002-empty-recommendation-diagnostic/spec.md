---
title: "Feature Specification: A successful advisor call with nothing to recommend reported itself as an outage"
description: "When the advisor answered and no skill cleared the threshold, the hook reported an error code and an unavailable marker. Nothing had failed. That message sent three separate investigations after a transport failure that never happened."
trigger_phrases:
  - "advisor no match diagnostic"
  - "cli advisor unavailable misleading"
  - "empty recommendation reported as outage"
  - "advisor skipped status meaning"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: A successful advisor call with nothing to recommend reported itself as an outage

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Origin** | Found while chasing a reported cold-start failure that turned out not to exist. The operator then asked for the remaining fix |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The advisor hook reports one of three outcomes. It routes, it fails open, or it skips. Skipping covers two very different situations: the advisor could not be reached, and the advisor answered but no skill cleared the confidence threshold. The diagnostics did not distinguish them. Both emitted `errorCode: NON_ZERO_EXIT` and `errorMessage: CLI_ADVISOR_UNAVAILABLE`, even when the call exited zero against a live daemon that simply had nothing to say about an inert prompt.

The cost is not cosmetic. That message is the only signal a reader gets about why no brief appeared, and it names a failure that did not occur. It produced a reproducible five-of-five "cold-start defect" in a session where the advisor was working perfectly, and survived three separate hypotheses about transport, interpreters and environment before the message itself turned out to be the lie.

### Purpose

A successful call with no match says so, and an unreachable advisor keeps saying what it always said.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The diagnostics branch that describes a non-ok result built from a successful CLI response
- The envelope reason that travels with it
- A regression test, with the result builder exported as a seam so the case can be exercised without a daemon

### Out of Scope
- **The `skipped` status itself.** It is correct: nothing was injected into the prompt either way, and callers branch on it today
- **The fail-open path.** An unreachable advisor is a real outage and its wording is accurate
- **The threshold that decides what counts as a match.** Whether an inert prompt should route at all is a routing-quality question, not a reporting one

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Modify | Split the no-match case out of the outage diagnostics; export the result builder as a test seam |
| `.opencode/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts` | Create | Three cases: no match, unreachable, and a clean route |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A live advisor with no match reports no error code and no error class | The diagnostics carry a reason and a no-match message only |
| REQ-002 | An unreachable advisor still reports unavailable | The outage wording and error code are unchanged |
| REQ-003 | A successful route carries no diagnostics | Unchanged from before |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The regression test fails against the old behaviour | Verified by restoring the old branch and re-running |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An inert prompt through the real hook reports a no-match rather than an outage
- **SC-002**: Two routable prompts still route, unchanged
- **SC-003**: The advisor suite passes with no failures
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A consumer branches on the old marker | Med | Searched first: no test and no runtime caller asserts on it |
| Risk | Inventing an error code the type does not allow | Low | The compiler rejected the first attempt; the honest shape carries no code at all, since nothing failed |
| Risk | A test that would pass either way | High | Verified against the old branch, where it fails, and the restored branch, where it passes |
| Dependency | The compiled build, which the hooks are served from | Low | Rebuilt and the marker confirmed present in the output |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether `skipped` should split into two statuses rather than one status with two reasons. Callers branch on the status today, so changing it is a wider contract change than this packet's problem needs.
- Whether an inert prompt should route to nothing at all, or to a general fallback. That is a routing question this packet deliberately leaves alone.
<!-- /ANCHOR:questions -->

---
