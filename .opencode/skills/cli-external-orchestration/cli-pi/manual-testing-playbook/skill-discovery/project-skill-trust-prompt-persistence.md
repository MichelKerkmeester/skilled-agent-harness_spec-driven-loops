---
title: "PI-006 -- Project-skill trust prompt persistence"
description: "This scenario checks the documented first-load trust prompt and whether a project-skill decision persists for `PI-006`, with persistence left SKIP when a live credentialed session is unavailable."
version: 1.0.0.0
---

# PI-006 -- Project-skill trust prompt persistence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-006`.

---

## 1. OVERVIEW

This scenario separates the first trust prompt from the later persistence check. It must not treat `--approve` as proof that an interactive trust decision was displayed or saved.

### Why This Matters

Project skills are executable instructions. Trust must be visible at first load and stable afterward, otherwise a supposedly approved project can silently change what Pi loads.

---

## 2. SCENARIO CONTRACT

- Objective: Observe the first-load trust prompt for a configured project skill directory and verify the decision persists exactly once.
- Real user request: `Load the project skill directory in Pi, show me the first trust decision, then restart and verify the same decision persists without prompting again.`
- Prompt: `Load the configured project skill directory and report the trust state. On the first run, record whether a trust prompt appears; on the second run, record whether the decision persists.`
- Expected execution process: Use a disposable project and temporary config directory -> run once without bypassing the trust UI -> record the prompt and decision -> run again -> compare trust state and output.
- Expected signals: First run has a visible trust prompt; second run has no duplicate prompt and preserves the decision.
- Desired user-visible outcome: An auditable trust transition with no writes to the operator's global Pi state.
- Pass/fail: SKIP with blockers `provider credentials are absent on this machine` and `the second-run persistence observation requires a credentialed live session`. PASS only after both runs are captured. FAIL if a prompt is silently bypassed or the decision changes unexpectedly.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Create a disposable project containing one uniquely named skill.
2. Use a new `PI_CODING_AGENT_DIR` and do not pass `--approve` on the first run unless the test specifically targets bypass behavior.
3. Capture the first prompt and decision without entering secrets.
4. Repeat with the same isolated config and record whether the prompt returns.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-006 | Project-skill trust prompt persistence | Verify first-load prompt and saved decision | `Load the configured project skill directory and report the trust state. On the first run, record whether a trust prompt appears; on the second run, record whether the decision persists.` | `PI_CODING_AGENT_DIR=<tmp> pi --offline -p "Load the configured project skill directory and report the trust state. On the first run, record whether a trust prompt appears; on the second run, record whether the decision persists." </dev/null` -> capture first output -> repeat with the same isolated config -> compare prompt and decision text | Prompt once, decision persisted, no second prompt | The documentation states behavior after a trust prompt, but the current machine has no provider-backed live confirmation of persistence. | SKIP with blocker `provider credentials are absent on this machine`; do not claim persistence from `--approve` alone. | Inspect the isolated trust file, verify the project path is unchanged, and rerun in a disposable directory rather than the real global config. |

### Optional Supplemental Checks

- Run a control with `--no-approve` and record whether project-local resources are ignored rather than trusted.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Trust and global-config safety policy |
| `../../SKILL.md` | `--approve`, project-local trust, and resource loading rules |
| `../../references/native-skills-and-extensions.md` | Trust-boundary guidance for native resources |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/settings.json` | Project-local package settings inspected before trust testing |
| `../../references/cli-reference.md` | `--approve` and `--no-approve` option meanings |

---

## 5. SOURCE METADATA

- Group: Skill Discovery
- Playbook ID: PI-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `skill-discovery/project-skill-trust-prompt-persistence.md`
