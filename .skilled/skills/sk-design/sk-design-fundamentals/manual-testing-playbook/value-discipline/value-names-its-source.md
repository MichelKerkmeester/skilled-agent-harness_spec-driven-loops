---
title: "SKD-013 -- Every value names its source"
description: "This scenario validates value provenance for `SKD-013`. It focuses on a request for spacing, radius and shadow where every value must name a token or a scale step, and no value may appear without one."
stage: routing
id: "SKD-013"
version: 1.0.0.0
---

# SKD-013 -- Every value names its source

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-013`.

---

## 1. OVERVIEW

This scenario validates value provenance for `SKD-013`. It focuses on confirming that each value returned for spacing, radius and shadow names where it came from: an installed token or a named scale step.

### Why This Matters

A plausible value is still a defect when the project installs a token for it, and a value with no stated source cannot be implemented without guessing. Provenance is what separates a decision from a number that merely looks right, and it is what turns a missing token into a named scale step instead of a hand-written value.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-013` and confirm the expected signals without contradictory evidence.

- Objective: confirm each value returned for spacing, radius and shadow names where it came from: an installed token or a named scale step.
- Real user request: `Our app installs spacing and radius tokens but no shadow token. What spacing, radius and shadow should the summary card use?`
- Prompt: `Our app installs spacing and radius tokens but no shadow token. What spacing, radius and shadow should the summary card use?`
- Expected execution process: resolve spacing and radius against the installed token names first and the host scales second, answer shadow from the shadow scale because the project installs no shadow token, and state the source beside every value.
- Expected signals: Each value in the reply carries its source. Spacing and radius name an installed token or a named scale step, and shadow names an elevation from the shadow scale together with the fact that no shadow token is installed. No value appears without a source.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if every value names a token or a scale step and the shadow's missing token is stated; FAIL if any value appears without a source, or a missing token is filled with a hand-written value that names no scale step.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "our app installs spacing and radius tokens but no shadow token what spacing radius and shadow should the summary card use" --threshold 0.5`
2. `agent: issue the same prompt in a fresh session and record each value with its stated source`
3. `bash: rg -n -A 7 "Project Profile Slot" .skilled/skills/sk-design/sk-design-fundamentals/SKILL.md`

### Expected Signals

Each value in the reply carries its source. Spacing and radius name an installed token or a named scale step, and shadow names an elevation from the shadow scale together with the fact that no shadow token is installed.

### Evidence

Advisor JSON, the reply verbatim with each value and its stated source, and the grep output showing that installed tokens come before the design scales.

### Pass / Fail Criteria

- **Pass**: every value names a token or a scale step and the shadow's missing token is stated.
- **Fail**: any value appears without a source, or a missing token is filled with a hand-written value that names no scale step.

### Failure Triage

Read the reply line by line and match each value to a token name or a scale step. A bare number means provenance was dropped. The shadow must be a named elevation from the shadow scale, not an invented offset, and the reply must say the project installs no shadow token.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-013 | Every value names its source | confirm each value returned for spacing, radius and shadow names an installed token or a named scale step | `Our app installs spacing and radius tokens but no shadow token. What spacing, radius and shadow should the summary card use?` | 1. `bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "our app installs spacing and radius tokens but no shadow token what spacing radius and shadow should the summary card use" --threshold 0.5` -> 2. `agent: issue the same prompt in a fresh session and record each value with its stated source` -> 3. `bash: rg -n -A 7 "Project Profile Slot" .skilled/skills/sk-design/sk-design-fundamentals/SKILL.md` | Each value in the reply carries its source. Spacing and radius name an installed token or a named scale step, and shadow names an elevation from the shadow scale together with the fact that no shadow token is installed. | Advisor JSON, the reply verbatim with each value and its stated source, and the grep output showing that installed tokens come before the design scales. | PASS if every value names a token or a scale step and the shadow's missing token is stated; FAIL if any value appears without a source, or a missing token is filled with a hand-written value that names no scale step | Read the reply line by line and match each value to a token name or a scale step. A bare number means provenance was dropped. The shadow must be a named elevation from the shadow scale, not an invented offset, and the reply must say the project installs no shadow token. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [value-names-its-source.md](value-names-its-source.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, the shadow elevations and the Project Profile Slot precedence |
| [references/depth-and-detail.md](../../references/depth-and-detail.md) | The shadow systems behind the elevation choice |
| [ROUTER.md §3](../../ROUTER.md#3-machine-router) | Machine router: intent map, resource map and loading levels |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: value-discipline
- Playbook ID: SKD-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `value-discipline/value-names-its-source.md`
