---
title: "CO-036 -- Kimi-k2.6 via opencode-go through sk-prompt-small-model + sk-prompt"
description: "Verifies the two-path dispatch matrix for Kimi-k2.6 (cli-devin Cognition Pro + cli-opencode opencode-go) and the sk-prompt composition for a large-context multi-file analysis dispatched via opencode-go."
---

# CO-036 -- Kimi-k2.6 via opencode-go through sk-prompt-small-model + sk-prompt

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-036`.

---

## 1. OVERVIEW

Kimi-k2.6 has two dispatch paths declared in `sk-prompt-small-model/assets/model-profiles.json`: cli-devin via Cognition Pro (primary) and cli-opencode via opencode-go. This scenario validates the opencode-go path through the three-skill flow: `sk-prompt-small-model` surfaces the dispatch matrix, the operator overrides the primary path to opencode-go for long-context work, `sk-prompt` composes with an extended-context framework, and `cli-opencode` dispatches `--model opencode-go/kimi-k2.6 --variant high`.

### Why This Matters

Kimi-k2.6's value is its 200k context window — long-file inspection, sprawling diff review, multi-repo evidence gathering. The opencode-go path uses workspace credits (different pool than Cognition Pro) and is the natural choice when Devin's Pro quota is tight. Path selection requires consulting the dispatch matrix; this scenario proves the matrix is discoverable and consulted in practice.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-036` and confirm the expected signals without contradictory evidence.

- Objective: Confirm three-skill flow on a Kimi-k2.6 dispatch via the opencode-go provider path.
- Real user request: `Use Kimi k2.6 to summarize the diff across these 5 files — via opencode-go, not Devin.`
- Prompt: `Consult sk-prompt-small-model for the Kimi-k2.6 dispatch matrix and pick the cli-opencode opencode-go path. Compose through sk-prompt with a large-context framework (RCAF with extended Context section) and dispatch with --model opencode-go/kimi-k2.6 --variant high.`
- Expected execution process: Advisor surfaces sk-prompt-small-model + cli-opencode -> read model-profiles.json kimi-k2.6 entry to confirm opencode-go path -> compose through sk-prompt -> opencode dispatches.
- Expected signals: Advisor confidence ≥ 0.85 for sk-prompt-small-model AND ≥ 0.80 for cli-opencode. model-profiles.json kimi-k2.6 shows 2 executors. `opencode run --model opencode-go/kimi-k2.6 --variant high` exits 0. Output references ≥ 5 distinct input files.
- Desired user-visible outcome: A consolidated multi-file analysis demonstrating the large-context advantage, dispatched consciously via the opencode-go pool.
- Pass/fail: PASS if advisor surfaces both skills AND model-profiles entry shows 2 paths AND `opencode` exits 0 AND output references ≥ 5 files. FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the advisor smoke test: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Kimi-k2.6 long-context analysis via opencode-go"` and confirm `sk-prompt-small-model` + `cli-opencode` both above 0.8.
2. Read `.opencode/skills/sk-prompt-small-model/assets/model-profiles.json` kimi-k2.6 entry. Confirm 2 executor paths (cli-devin cognition-pro + cli-opencode opencode-go) and document why opencode-go is chosen.
3. Pick a long-context task: "summarize the architecture across `.opencode/skills/sk-prompt-small-model/`, `.opencode/skills/cli-devin/references/`, `.opencode/skills/cli-opencode/references/`, `.opencode/skills/sk-prompt/assets/`, and `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/`. Identify cross-cutting patterns and unresolved gaps."
4. Compose `/tmp/co-036-prompt.md` via sk-prompt with RCAF + extended Context section (list the 5 directories explicitly) + standard bundle-gate.
5. Dispatch `opencode run --model opencode-go/kimi-k2.6 --variant high --agent general --format json --dir "$(git rev-parse --show-toplevel)" --pure --dangerously-skip-permissions "$(cat /tmp/co-036-prompt.md)" </dev/null`.
6. Verify the output references ≥ 5 distinct input files.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-036 | Kimi-k2.6 via opencode-go through sk-prompt-small-model + sk-prompt | Verify three-skill flow on Kimi-k2.6 long-context dispatch via opencode-go | `Consult sk-prompt-small-model for the Kimi-k2.6 dispatch matrix and pick the cli-opencode opencode-go path. Compose through sk-prompt with a large-context framework (RCAF with extended Context section) and dispatch with --model opencode-go/kimi-k2.6 --variant high.` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Kimi-k2.6 long-context analysis via opencode-go" \| jq -r '.[:3][] \| "\(.skill) \(.confidence)"'` -> 2. `bash: jq '.models[] \| select(.id == "kimi-k2.6") \| {executors, primary_quota_pool}' .opencode/skills/sk-prompt-small-model/assets/model-profiles.json` -> 3. compose `/tmp/co-036-prompt.md` with RCAF + extended Context section listing 5 directories + standard bundle-gate -> 4. `bash: opencode run --model opencode-go/kimi-k2.6 --variant high --agent general --format json --dir "$(git rev-parse --show-toplevel)" --pure --dangerously-skip-permissions "$(cat /tmp/co-036-prompt.md)" > /tmp/co-036-output.json 2>&1 </dev/null; echo "Exit: $?"` -> 5. `bash: grep -oE '[a-zA-Z0-9_/.-]+\.(md\|ts\|json)' /tmp/co-036-output.json \| sort -u \| wc -l` | Step 1: both skills ≥ 0.85 / 0.80; Step 2: 2 executors visible, primary_quota_pool=cognition-pro; Step 3: prompt cites all 5 dirs; Step 4: exit 0; Step 5: ≥ 5 distinct files cited | Advisor output, model-profiles entry, prompt file, dispatch JSON, file-count output | PASS if all 5 conditions met; FAIL otherwise | (1) If advisor confidence low: rebuild graph; (2) Kimi-k2.6 occasionally hangs ~25min (~5-10% failure rate per cli-devin SKILL.md §3) — bump timeout to 30min or accept and aggregate over ≥ 5 fixtures; (3) if opencode-go exhausted: switch to cli-devin per the matrix |

### Optional Supplemental Checks

- Repeat with `--model deepseek-v4` on cli-devin (same prompt) and compare consolidation quality — Kimi should produce more file-spanning references.
- Run the same prompt with `--variant low` to compare reasoning depth.
- Time the dispatch and record wall-clock (`avg_iter_wall_clock_min` for Kimi-k2.6 is 22 minutes per model-profiles.json).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../sk-prompt-small-model/SKILL.md` | Dispatch matrix table |
| `../../../sk-prompt-small-model/assets/model-profiles.json` | kimi-k2.6 entry: 2 executor paths |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Provider Auth Pre-Flight + opencode-go provider notes |
| `../../../system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Advisor scorer entry point |
| `../../../cli-devin/SKILL.md` | §3 Kimi-k2.6 known-issue: ~5-10% hang rate at default timeouts (applies symmetrically here) |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CO-036
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--prompt-templates/027-kimi-k2-6-via-opencode-go-with-sk-prompt-small-model.md`
