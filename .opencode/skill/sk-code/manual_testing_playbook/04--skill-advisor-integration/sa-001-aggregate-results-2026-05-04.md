# Phase E — Skill Advisor Probe Battery (SA-001) Aggregate Report

**Date**: 2026-05-04
**Probe set**: 15 positive controls + 5 negative controls = 20 total
**Threshold**: 0.80 confidence
**Advisor binary**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`

## Per-Prompt Results

| ID | Top-1 Skill | Top conf | sk-code rank | sk-code conf | Expected | Verdict |
|---|---|---|---|---|---|---|
| N01 | `sk-code` | 0.921 | 1 | 0.921 | `sk-doc` | FAIL (sk-code falsely top-1, conf=0.921) |
| N02 | `(empty)` | 0.000 | - | 0.000 | `(none/sk-doc)` | PASS (top-1=(empty), sk-code rank=N/A) |
| N03 | `sk-deep-review` | 0.914 | - | 0.000 | `spec_kit:resume` | PASS (top-1=sk-deep-review, sk-code rank=N/A) |
| N04 | `cli-codex` | 0.901 | - | 0.000 | `sk-doc` | PASS (top-1=cli-codex, sk-code rank=N/A) |
| N05 | `sk-code-review` | 0.920 | - | 0.000 | `sk-deep-research` | PASS (top-1=sk-code-review, sk-code rank=N/A) |
| P01 | `cli-codex` | 0.888 | 3 | 0.859 | `sk-code` | FAIL (sk-code rank=3 conf=0.859; top-1=cli-codex conf=0.888) |
| P02 | `(empty)` | 0.000 | - | 0.000 | `sk-code` | FAIL (sk-code not in candidates; top-1=(empty)) |
| P03 | `skill_advisor` | 0.820 | 2 | 0.820 | `sk-code` | FAIL (sk-code rank=2 conf=0.820; top-1=skill_advisor conf=0.820) |
| P04 | `sk-deep-review` | 0.945 | - | 0.000 | `sk-code` | FAIL (sk-code not in candidates; top-1=sk-deep-review) |
| P05 | `sk-code` | 0.869 | 1 | 0.869 | `sk-code` | PASS (sk-code top-1 ≥ 0.80) |
| P06 | `sk-code` | 0.865 | 1 | 0.865 | `sk-code` | PASS (sk-code top-1 ≥ 0.80) |
| P07 | `system-spec-kit` | 0.820 | - | 0.000 | `sk-code` | FAIL (sk-code not in candidates; top-1=system-spec-kit) |
| P08 | `sk-improve-prompt` | 0.820 | 2 | 0.820 | `sk-code` | FAIL (sk-code rank=2 conf=0.820; top-1=sk-improve-prompt conf=0.820) |
| P09 | `system-spec-kit` | 0.820 | - | 0.000 | `sk-code` | FAIL (sk-code not in candidates; top-1=system-spec-kit) |
| P10 | `system-spec-kit` | 0.820 | - | 0.000 | `sk-code` | FAIL (sk-code not in candidates; top-1=system-spec-kit) |
| P11 | `system-spec-kit` | 0.868 | 2 | 0.856 | `sk-code` | FAIL (sk-code rank=2 conf=0.856; top-1=system-spec-kit conf=0.868) |
| P12 | `sk-code` | 0.820 | 1 | 0.820 | `sk-code` | PASS (sk-code top-1 ≥ 0.80) |
| P13 | `sk-code` | 0.882 | 1 | 0.882 | `sk-code` | PASS (sk-code top-1 ≥ 0.80) |
| P14 | `sk-code` | 0.820 | 1 | 0.820 | `sk-code` | PASS (sk-code top-1 ≥ 0.80) |
| P15 | `(empty)` | 0.000 | - | 0.000 | `sk-code` | FAIL (sk-code not in candidates; top-1=(empty)) |

## Aggregate

- **Positive strict accuracy** (sk-code top-1 AND conf ≥ 0.80): **5/15 = 33.3%**
- **Positive soft accuracy** (sk-code top-1, any conf): 5/15 = 33.3%
- **sk-code in top-3 (positives)**: 9/15 = 60.0%
- **Negative correct rejection**: 4/5 = 80.0%
- **Negative false-positive (sk-code falsely top-1)**: 1/5

## Baseline Comparison

`smart-router-measurement-results.jsonl` (2026-05-03) reported sk-code accuracy at **50% (4/8 correct)**. This battery's strict positive accuracy: **33.3%** (delta: -16.7 percentage points).

## Lost Positives (sk-code not top-1)

- **P01**: top-1=`cli-codex` (conf=0.888); sk-code rank=3 conf=0.859
- **P02**: top-1=`(empty)` (conf=0.000); sk-code rank=None conf=0.000
- **P03**: top-1=`skill_advisor` (conf=0.820); sk-code rank=2 conf=0.820
- **P04**: top-1=`sk-deep-review` (conf=0.945); sk-code rank=None conf=0.000
- **P07**: top-1=`system-spec-kit` (conf=0.820); sk-code rank=None conf=0.000
- **P08**: top-1=`sk-improve-prompt` (conf=0.820); sk-code rank=2 conf=0.820
- **P09**: top-1=`system-spec-kit` (conf=0.820); sk-code rank=None conf=0.000
- **P10**: top-1=`system-spec-kit` (conf=0.820); sk-code rank=None conf=0.000
- **P11**: top-1=`system-spec-kit` (conf=0.868); sk-code rank=2 conf=0.856
- **P15**: top-1=`(empty)` (conf=0.000); sk-code rank=None conf=0.000

## Findings

### F-NEW-004 (P1, advisor accuracy)

**Title**: Skill advisor systematically routes OPENCODE code-work prompts to `cli-codex` instead of `sk-code`.

**Evidence**: Of 15 positive controls (all OPENCODE/WEBFLOW code-work prompts that should route to sk-code), only **5/15 = 33.3%** won sk-code at top-1 ≥ 0.80. `cli-codex` and `system-spec-kit` are systematically capturing top-1 over sk-code despite the prompts targeting code work, not CLI orchestration.

**Root cause hypothesis**: sk-code's `signals` array in `skill-graph.json` lacks dominant code-work signals (e.g. `refactor`, `add a flag`, `function`, `class`). Meanwhile `cli-codex` has higher signal density on technical vocabulary.

**Recommended Phase E5 remediation** (REQUIRES USER APPROVAL — affects global advisor scoring across all skills):

1. Add dominant code-work signals to sk-code's `signals` array: `refactor`, `add ... function`, `add ... flag`, `implement`, `update`, `class`, `module`, `import`.
2. Add adjacency exclusion: when prompt contains `.opencode/` path, sk-code should rank above cli-codex (they are complementary, not competitive — sk-code provides standards, cli-codex executes).
3. Consider adding `prerequisite_for` weight from sk-code → cli-codex (sk-code provides standards FOR cli-codex execution).

**Do NOT commit skill-graph.json mutations without user approval.**
