---
title: "PI-016 -- Fail-open guard discipline"
description: "This scenario explicitly reconciles the originally-planned \"fail-closed verification\" wording with the implemented fail-open guard behavior and tests the behavior that actually exists for `PI-016`."
version: 1.5.2.0
---

# PI-016 -- Fail-open guard discipline

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-016`.

---

## 1. OVERVIEW

The planned title says “fail-closed verification,” but the implemented extension bridges intentionally use fail-open handling: a guard-core exception must not accidentally block valid work. This scenario records that mismatch instead of silently changing the requirement.

### Why This Matters

Fail-open and fail-closed are opposite safety properties. A reviewer must know which one the code implements before interpreting a passing exception-path check.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the actual fail-open discipline of the bridged guard cores and identify any accidental block or allow behavior.
- Real user request: `Review the Pi guard extensions and tell me what happens when a guard throws during a lifecycle event. Be explicit about whether the implementation fails open or closed.`
- Prompt: `Inspect every Pi extension guard wrapper. For each catch path, report whether an exception blocks or allows the action. Do not rename the behavior to match the scenario title.`
- Expected execution process: Read every extension wrapper -> identify `try`/`catch` paths -> inspect returned `{block: true}` paths -> compare against the shared guard-core contract -> record the implemented discipline.
- Expected signals: Guard exceptions are caught and allow the action; intentional guard decisions can still return `{block: true, reason}`; no wrapper silently converts an exception into a block.
- Desired user-visible outcome: An honest fail-open result with the title mismatch visible to future operators.
- Pass/fail: PASS if all twenty-two extensions preserve fail-open exception handling and intentional blocks remain explicit. FAIL if a guard exception unexpectedly blocks or silently allows a guarded action outside the documented discipline. The title mismatch is a documented scope note, not a reason to reinterpret the code. One deliberate exception exists outside this surface: the input-handler catch paths differ in shape (`undefined` vs `{action: "continue"}`), both of which are non-blocking.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Search the extension files for `try`, `catch`, `evaluate`, and `block: true`.
2. Read each catch body and the intentional block paths.
3. Record the implementation as fail-open or fail-closed per file.
4. If a credentialed live tool event becomes available, exercise one harmless exception fixture in isolation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-016 | Fail-open guard discipline | Verify actual exception behavior and expose title mismatch | `Inspect every Pi extension guard wrapper. For each catch path, report whether an exception blocks or allows the action. Do not rename the behavior to match the scenario title.` | `( cd .pi/extensions && for f in *.ts; do t=$(sed -n "s/.*from '\(.*\)';.*/\1/p" "$f"); rg -n --with-filename 'try|catch|evaluateMutation|block: true|Fail open' "$t"; done )` -> read each matched adapter -> compare with shared guard-core return values -> optionally run an isolated exception fixture | Catch comments and bodies show fail-open behavior; intentional block paths are explicit | Captured search output covers all twenty-two adapters the entries re-export: eighteen carry an explicit `Fail open` catch comment, and four (`decision-capture.ts`, `dispatch-preflight-lint.ts`, `prompt-advisor.ts`, `session-relaunch.ts`) have catch paths without that comment. Intentional `block: true` returns appear in the env-secret-guard, git-message-gate, overlay-guard, dispatch-preflight-lint and spec-gate-enforce adapters. The adapter roster is in `.pi/extensions/README.md`. | PASS for the behavior actually built: guard exceptions fail open, while explicit guard decisions may block. FAIL if an exception path blocks unexpectedly. | Re-read the specific catch body and shared guard-core return contract; do not “fix” the title by changing behavior outside this playbook's scope. |

### Optional Supplemental Checks

- Add an isolated test extension that throws from a non-production fixture and capture whether Pi continues startup; provider credentials are not required for the static wrapper check.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Strict verdict and mismatch-reporting policy |
| `../../SKILL.md` | Extension and guard boundaries |
| `../../references/native-skills-and-extensions.md` | Extension failure behavior |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/extensions/*.ts` | Twenty-two extension entries, each resolving to an adapter whose catch paths are inspected |
| `../../../../system-spec-kit/runtime/hooks/lib/spec-gate` | Shared guard-core behavior referenced by the bridges |

---

## 5. SOURCE METADATA

- Group: Hook Extension Layer
- Playbook ID: PI-016
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hook-extension-layer/fail-open-guard-discipline.md`
