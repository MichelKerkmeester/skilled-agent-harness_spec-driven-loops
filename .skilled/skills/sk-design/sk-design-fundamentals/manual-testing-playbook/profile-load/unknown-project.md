---
title: "SKD-040 -- An unknown project loads no profile"
description: "This scenario validates profile loading for `SKD-040`. It focuses on a project with no `references/<project>-profile.md`, which must answer from the installed tokens and the design scales and load no profile."
stage: routing
id: "SKD-040"
version: 1.0.0.0
---

# SKD-040 -- An unknown project loads no profile

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-040`.

---

## 1. OVERVIEW

This scenario validates profile loading for `SKD-040`. It focuses on confirming that a request about a project with no `references/<project>-profile.md` loads no profile, and answers from the tokens the app installs and the design scales.

### Why This Matters

The Project Profile Slot is opt-in: a project may add a profile holding its own values, and the slot adds no routing phrase of its own. The failure this guards against is an agent inventing a project profile, or borrowing another project's values, for a project that has none. An unknown project is answered from the installed tokens and the scales, and the reply says so.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-040` and confirm the expected signals without contradictory evidence.

- Objective: confirm a project with no `references/<project>-profile.md` loads no profile and answers from the installed tokens and the design scales.
- Real user request: `What spacing and radius should the pricing card on the Lumen dashboard use?`
- Prompt: `What spacing and radius should the pricing card on the Lumen dashboard use?`
- Expected execution process: the advisor selects `sk-design`, the agent checks `references/` for a `lumen-profile.md`, finds none, loads no profile, and answers from the tokens the app installs and the design scales. The reply names the Project Profile Slot as the rule that governs the decision.
- Expected signals: The reply gives a spacing step and a radius step from the scales, or an installed token where one exists, and each value names its source. It states that no `lumen-profile.md` exists, so no profile was loaded, and it cites the Project Profile Slot. It never invents a profile or a project-specific token.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if no profile is loaded or invented, every value names a token or a scale step, and the reply cites the Project Profile Slot; FAIL if a profile is loaded or invented, a `lumen-profile.md` is claimed to exist, or a value appears with no source.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "what spacing and radius should the pricing card on the lumen dashboard use" --threshold 0.5`
2. `agent: issue the same prompt in a fresh session`
3. `bash: find .skilled/skills/sk-design/sk-design-fundamentals/references -name '*-profile.md'`
4. `bash: rg -n -A 7 "Project Profile Slot" .skilled/skills/sk-design/sk-design-fundamentals/SKILL.md`

### Expected Signals

The reply gives a spacing step and a radius step from the scales, or an installed token where one exists, and each value names its source. It states that no `lumen-profile.md` exists, so no profile was loaded, and it cites the Project Profile Slot. It never invents a profile or a project-specific token.

### Evidence

Advisor JSON, the reply verbatim, the empty `find` output proving no profile file exists, and the grep output showing the Project Profile Slot rule and its precedence order.

### Pass / Fail Criteria

- **Pass**: no profile is loaded or invented, every value names a token or a scale step, and the reply cites the Project Profile Slot.
- **Fail**: a profile is loaded or invented, a `lumen-profile.md` is claimed to exist, or a value appears with no source.

### Failure Triage

Check that step 3 printed nothing; any output is a profile the slot could load. Then read the reply for a profile name or a project-specific token. A value with no token name or scale step means the reply answered from plausibility instead of the scales.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-040 | An unknown project loads no profile | confirm a project with no `references/<project>-profile.md` loads no profile and answers from the installed tokens and the design scales | `What spacing and radius should the pricing card on the Lumen dashboard use?` | 1. `bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "what spacing and radius should the pricing card on the lumen dashboard use" --threshold 0.5` -> 2. `agent: issue the same prompt in a fresh session` -> 3. `bash: find .skilled/skills/sk-design/sk-design-fundamentals/references -name '*-profile.md'` -> 4. `bash: rg -n -A 7 "Project Profile Slot" .skilled/skills/sk-design/sk-design-fundamentals/SKILL.md` | The reply gives a spacing step and a radius step from the scales, or an installed token where one exists, and each value names its source. It states that no `lumen-profile.md` exists, so no profile was loaded, and it cites the Project Profile Slot. It never invents a profile or a project-specific token. | Advisor JSON, the reply verbatim, the empty `find` output proving no profile file exists, and the grep output showing the Project Profile Slot rule and its precedence order. | PASS if no profile is loaded or invented, every value names a token or a scale step, and the reply cites the Project Profile Slot; FAIL if a profile is loaded or invented, a `lumen-profile.md` is claimed to exist, or a value appears with no source | Check that step 3 printed nothing; any output is a profile the slot could load. Then read the reply for a profile name or a project-specific token. A value with no token name or scale step means the reply answered from plausibility instead of the scales. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [unknown-project.md](unknown-project.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Section 3's Project Profile Slot names when a profile loads, that an unknown project loads none, and the precedence order |
| [ROUTER.md §3](../../ROUTER.md#3-machine-router) | Machine router: the slot adds no routing phrase of its own |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: profile-load
- Playbook ID: SKD-040
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `profile-load/unknown-project.md`
