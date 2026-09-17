---
title: "DLR-022 -- Session state hierarchy"
description: "Manual validation scenario for Session state hierarchy in the runtime/ skill."
version: 1.4.0.4
---

# DLR-022 -- Session state hierarchy

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-022`.

---

## 1. OVERVIEW

Creates and validates the ADR-002 session->topic->round state shape, including stable topic-NNN-slug and round-NNN ids.

### Why This Matters

This is the council state-shape contract. If it drifts, downstream tools that traverse session->topic->round (dashboards, resume logic, audit tooling) break silently.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm session state hierarchy behaves as documented and remains aligned with its implementation and tests.
- Layer partition: council state shape.
- Real user request: `Validate Session state hierarchy and report whether the current id shape, validator rules, and tests agree with the runtime/ contract.`
- Expected signals: 3-level session/topic/round shape; topic ids `topic-NNN-slug`; round ids `round-NNN`; validator rejects malformed/duplicate/out-of-order ids.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/council/session-state-hierarchy.md`.

### Prompt

- Prompt: `Validate Session state hierarchy and report whether the current id shape, validator rules, and tests agree with the runtime/ contract.`

### Commands

1. Inspect `lib/council/session-state-hierarchy.cjs` for the implementation contract and id shape rules.
2. Inspect `tests/council/session-state-hierarchy.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS or FAIL with rationale; record SKIP only when a named sandbox blocker — an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential — prevents the command from running.

### Expected Outcome

Session state hierarchy matches the documented current reality, the id shape rules agree with ADR-002, and validation evidence is reproducible.

### Evidence

- Source excerpts from `lib/council/session-state-hierarchy.cjs` showing the anchors named in the commands above, read from the current files rather than recalled.
- Captured stdout and exit status for every command run in this section.
- Output from `tests/council/session-state-hierarchy.vitest.ts` naming the assertions that carry the expected signals.
- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.

### Failure Triage

- Topic id shape drifts from `topic-NNN-slug` without ADR amendment.
- Round id shape drifts from `round-NNN`.
- Validator weakens (accepts malformed/duplicate/out-of-order ids without flagging).
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `lib/council/session-state-hierarchy.cjs` | 3-level session/topic/round state constructor + validator with stable ids. |

### Validation

| File | Role |
|---|---|
| `tests/council/session-state-hierarchy.vitest.ts` | Primary regression coverage for Session state hierarchy. |

---

## 5. SOURCE METADATA

- Group: Council
- Playbook ID: DLR-022
- Feature catalog entry: `feature-catalog/council/session-state-hierarchy.md`
- Scenario file path: `manual-testing-playbook/council/session-state-hierarchy.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
