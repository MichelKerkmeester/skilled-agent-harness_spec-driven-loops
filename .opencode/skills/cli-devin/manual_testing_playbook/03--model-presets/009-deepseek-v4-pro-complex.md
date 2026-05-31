---
title: "DV-009 -- DeepSeek v4 (primary for complex tasks)"
description: "This scenario validates that --model deepseek-v4 is accepted as the documented primary pick for complex tasks (ambiguous, multi-step, reasoning-bound)."
---

# DV-009 -- DeepSeek v4 (primary for complex tasks)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-009`.

---

## 1. OVERVIEW

This scenario validates `--model deepseek-v4` for `DV-009`. DeepSeek v4 is the documented **primary** pick in cli-devin's four-model preset for **complex tasks** — work that is ambiguous, multi-step, reasoning-bound, or broad in scope.

### Why This Matters

The cli-devin Routing Matrix routes complex tasks to DeepSeek v4 before falling back to GLM 5.1 or Kimi k2.6. If DeepSeek v4 isn't accessible or doesn't visibly handle complex tasks better than the SWE-1.6 default, the routing recommendation has no operational basis. This scenario gives operators empirical evidence that the complex-task primary works.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `--model deepseek-v4` is accepted and produces deeper analysis than SWE-1.6 on a complex (ambiguous + reasoning-bound) prompt.
- Real user request: `Run a complex architectural review where the requirements aren't fully specified — I want DeepSeek's reasoning, not SWE-1.6's fast iteration.`
- Prompt: `Dispatch a complex architectural review with --model deepseek-v4 --permission-mode auto and compare output depth to the same prompt under --model swe-1.6.`
- Expected execution process: Operator picks an ambiguous review target (e.g. an existing reference inside cli-devin) -> dispatches the same prompt twice with different model flags -> captures both outputs -> compares for depth signals (cited principles, named trade-offs, edge cases, raised ambiguities).
- Expected signals: Both invocations exit 0. The DeepSeek v4 output cites more design principles, names more trade-offs, and surfaces more ambiguities. Dispatched command lines reflect both model IDs.
- Desired user-visible outcome: Two side-by-side review outputs that visibly differ in depth, justifying the cli-devin routing matrix recommendation to use DeepSeek v4 on complex tasks.
- Pass/fail: PASS if both invocations exit 0 AND the DeepSeek v4 output shows visible depth gain. FAIL if either invocation errors OR if outputs are indistinguishable.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pick a complex review target (e.g. `.opencode/skills/cli-devin/SKILL.md` §2 Smart Routing with a deliberately broad prompt that leaves edge cases unspecified).
2. Dispatch the same review prompt twice — once with `--model swe-1.6`, once with `--model deepseek-v4`.
3. Capture both outputs.
4. Count depth signals (cited principles, named trade-offs, edge cases enumerated, ambiguities flagged).
5. Return a PASS/FAIL verdict naming both depth-signal counts.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-009 | DeepSeek v4 (primary for complex tasks) | Verify deepseek v4duces deeper analysis than SWE-1.6 on a complex / reasoning-bound prompt | `Dispatch a complex architectural review with --model deepseek-v4 --permission-mode auto and compare output depth to the same prompt under --model swe-1.6.` | 1. `devin "Review the cli-devin SKILL.md Smart Routing section. Identify missing edge cases, ambiguous intent signals, layered detection gaps, and any concerns that the current text underspecifies. Cite specific lines. Do not modify the file." --model swe-1.6 --permission-mode auto > /tmp/dv-009-swe.txt 2>&1 </dev/null; echo "Exit-swe: $?"` -> 2. `devin "Review the cli-devin SKILL.md Smart Routing section. Identify missing edge cases, ambiguous intent signals, layered detection gaps, and any concerns that the current text underspecifies. Cite specific lines. Do not modify the file." --model deepseek-v4 --permission-mode auto > /tmp/dv-009-deepseek.txt 2>&1 </dev/null; echo "Exit-deepseek: $?"` -> 3. `bash: wc -l /tmp/dv-009-swe.txt /tmp/dv-009-deepseek.txt` -> 4. `bash: grep -c -E 'principle\|trade-off\|tradeoff\|edge case\|caveat\|ambigu' /tmp/dv-009-swe.txt /tmp/dv-009-deepseek.txt` | Steps 1, 2: both exit 0; Step 3: DeepSeek output is at least as long as SWE output; Step 4: DeepSeek depth-signal count >= SWE count | Both captured stdouts, line counts, depth-signal counts, terminal transcript | PASS if both exit 0 AND DeepSeek depth-signal count >= SWE count; FAIL if either invocation errors OR if outputs are indistinguishable | (1) Verify `--model deepseek-v4` is in `devin --help`; (2) re-run with a more reasoning-bound prompt if SWE happens to match on this one; (3) confirm DeepSeek model name hasn't rotated |

### Optional Supplemental Checks

- Try a complex security-audit prompt — DeepSeek v4 typically shows the largest gain on reasoning-bound security work.
- Time both invocations; DeepSeek often takes longer but produces richer output.
- Cross-reference against GLM 5.1 (DV-010) and Kimi k2.6 (DV-026) on the same complex prompt to see which fallback wins on which axis.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§5 Model Selection) | Documents DeepSeek v4 row |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Model Selection (DeepSeek v4 row) |
| `../../references/agent_delegation.md` (§3 Routing Matrix) | Routes complex tasks to DeepSeek v4 |
| `../../references/devin_tools.md` (§3 When to pick cli-devin) | Cross-CLI complex-task routing |

---

## 5. SOURCE METADATA

- Group: Model Presets
- Playbook ID: DV-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--model-presets/002-deepseek-v4-complex.md`
