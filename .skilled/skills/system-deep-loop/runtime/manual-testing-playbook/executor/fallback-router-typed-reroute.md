---
title: "DLR-044 -- Fallback-router typed reroute"
description: "Manual validation scenario for Fallback-router typed reroute in the runtime/ skill."
version: 1.4.0.15
---

# DLR-044 -- Fallback-router typed reroute

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-044`.

---

## 1. OVERVIEW

Adds typed fallback-route metadata, route trace fields, and startup graph validation for executor fallback routing.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Fallback-router typed reroute behaves as documented and remains aligned with its implementation and tests.
- Layer partition: executor runtime.
- Real user request: `Validate Fallback-router typed reroute and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Route trace metadata, preflight validation errors, cycle detection, and same-scope routing coverage.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/executor/fallback-router-typed-reroute.md`.

### Prompt

- Prompt: `Validate Fallback-router typed reroute and report whether the current source, script surface, and tests agree with the runtime/ contract.`

### Commands

1. Inspect `lib/deep-loop/fallback-router.ts` for the implementation contract.
2. Inspect `tests/unit/fallback-router.vitest.ts` for the matching regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS or FAIL with rationale; record SKIP only when a named sandbox blocker — an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential — prevents the command from running.

### Expected Outcome

Fallback-router typed reroute matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Evidence

- Source excerpts from `lib/deep-loop/fallback-router.ts` showing the anchors named in the commands above, read from the current files rather than recalled.
- Captured stdout and exit status for every command run in this section.
- Output from `tests/unit/fallback-router.vitest.ts` naming the assertions that carry the expected signals.
- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.

### Failure Triage

- Source file no longer exposes the documented function, type, script argument, output field, or YAML step.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script, runtime, YAML, or dashboard output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `lib/deep-loop/fallback-router.ts` | typed fallback-router reroute + graph preflight. |

### Validation

| File | Role |
|---|---|
| `tests/unit/fallback-router.vitest.ts` | Primary regression coverage for Fallback-router typed reroute. |

---

## 5. SOURCE METADATA

- Group: Executor
- Playbook ID: DLR-044
- Feature catalog entry: `feature-catalog/executor/fallback-router-typed-reroute.md`
- Scenario file path: `manual-testing-playbook/executor/fallback-router-typed-reroute.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//015-fallback-router-typed-reroute`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
