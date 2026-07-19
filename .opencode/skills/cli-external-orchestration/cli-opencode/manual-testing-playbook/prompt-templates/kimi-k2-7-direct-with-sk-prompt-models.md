---
title: "CO-036 -- Kimi K2.7 via the direct Kimi For Coding plan through sk-prompt/prompt-models + sk-prompt"
description: "Verifies the direct Kimi For Coding dispatch path for Kimi K2.7 Code (kimi-for-coding/k2p7) and the sk-prompt composition for a large-context multi-file analysis dispatched via the direct Kimi provider."
version: 1.3.0.9
---

# CO-036 -- Kimi K2.7 via the direct Kimi For Coding plan through sk-prompt/prompt-models + sk-prompt

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-036`.

---

## 1. OVERVIEW

Kimi K2.7 Code is dispatched via the direct Kimi For Coding plan (`kimi-for-coding/k2p7`) declared in `sk-prompt/prompt-models/assets/model-profiles.json`. This scenario validates that path through the three-skill flow: `sk-prompt/prompt-models` surfaces the dispatch matrix, the operator picks `kimi-for-coding/k2p7` for long-context work, `sk-prompt` composes with an extended-context framework, and `cli-opencode` dispatches `--model kimi-for-coding/k2p7 --variant high`.

### Why This Matters

Kimi K2.7 Code's value is its 200k context window — long-file inspection, sprawling diff review, multi-repo evidence gathering. The direct Kimi For Coding plan is the documented path for this work. Path selection requires consulting the dispatch matrix; this scenario proves the matrix is discoverable and consulted in practice.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-036` and confirm the expected signals without contradictory evidence.

- Objective: Confirm three-skill flow on a Kimi K2.7 dispatch via the direct Kimi For Coding plan.
- Real user request: `Use Kimi K2.7 to summarize the diff across these 5 files — via the direct Kimi provider.`
- Prompt: `Consult sk-prompt/prompt-models for the Kimi K2.7 dispatch matrix and pick the cli-opencode direct Kimi For Coding path (kimi-for-coding/k2p7). Compose through sk-prompt with the current Kimi K2.7 profile's primary framework (COSTAR with a lean pre-planning step — the profile avoids RCAF after benchmark 007) and dispatch with --model kimi-for-coding/k2p7 --variant high.`
- Expected execution process: Advisor surfaces sk-prompt/prompt-models + cli-opencode -> read model-profiles.json `kimi-k2.7-code` entry to confirm the direct Kimi For Coding path and current framework guidance -> compose through sk-prompt -> opencode dispatches.
- Expected signals: Advisor confidence ≥ 0.85 for sk-prompt/prompt-models AND ≥ 0.80 for cli-opencode. model-profiles.json `kimi-k2.7-code` shows the direct Kimi For Coding path. `opencode run --model kimi-for-coding/k2p7 --variant high` exits 0. Output references ≥ 5 distinct input files.
- Desired user-visible outcome: A consolidated multi-file analysis demonstrating the large-context advantage, dispatched via the direct Kimi For Coding plan.
- Pass/fail: PASS if advisor surfaces both skills AND model-profiles entry shows the direct Kimi For Coding path AND `opencode` exits 0 AND output references ≥ 5 files. FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the advisor smoke test: `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "Kimi K2.7 long-context analysis direct Kimi provider"` and confirm `sk-prompt/prompt-models` + `cli-opencode` both above 0.8.
2. Read `.opencode/skills/sk-prompt/prompt-models/assets/model-profiles.json` `kimi-k2.7-code` entry (registry id, NOT the retired `kimi-k2p7` id). Confirm the direct Kimi For Coding executor path, the current COSTAR-primary/TIDD-EC-fallback framework guidance, and document why it is chosen.
3. Pick a long-context task: "summarize the architecture across `.opencode/skills/sk-prompt/prompt-models/`, `.opencode/skills/cli-external-orchestration/cli-opencode/references/`, `.opencode/skills/cli-external-orchestration/cli-opencode/references/`, `.opencode/skills/sk-prompt/assets/`, and `.opencode/skills/system-spec-kit/mcp-server/lib/deep-loop/`. Identify cross-cutting patterns and unresolved gaps."
4. Compose `/tmp/co-036-prompt.md` via sk-prompt with COSTAR (Context/Objective/Style/Tone/Audience/Response) plus a lean pre-planning step — list the 5 directories explicitly in the Context field — plus standard bundle-gate. Retain the read-cap/timeout guidance from the current profile.
5. Dispatch `opencode run --model kimi-for-coding/k2p7 --variant high --format json --dir "$(git rev-parse --show-toplevel)" --pure --dangerously-skip-permissions "$(cat /tmp/co-036-prompt.md)" </dev/null`.
6. Verify the output references ≥ 5 distinct input files.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-036 | Kimi K2.7 via the direct Kimi For Coding plan through sk-prompt/prompt-models + sk-prompt | Verify three-skill flow on Kimi K2.7 long-context dispatch via the direct Kimi For Coding plan | `Consult sk-prompt/prompt-models for the Kimi K2.7 dispatch matrix and pick the cli-opencode direct Kimi For Coding path (kimi-for-coding/k2p7). Compose through sk-prompt with the current Kimi K2.7 profile's primary framework (COSTAR with a lean pre-planning step) and dispatch with --model kimi-for-coding/k2p7 --variant high.` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "Kimi K2.7 long-context analysis direct Kimi provider" \| jq -r '.[:3][] \| "\(.skill) \(.confidence)"'` -> 2. `bash: jq '.models[] \| select(.id == "kimi-k2.7-code") \| {executors}' .opencode/skills/sk-prompt/prompt-models/assets/model-profiles.json` -> 3. compose `/tmp/co-036-prompt.md` with COSTAR + lean pre-planning listing 5 directories in the Context field + standard bundle-gate -> 4. `bash: opencode run --model kimi-for-coding/k2p7 --variant high --format json --dir "$(git rev-parse --show-toplevel)" --pure --dangerously-skip-permissions "$(cat /tmp/co-036-prompt.md)" > /tmp/co-036-output.json 2>&1 </dev/null; echo "Exit: $?"` -> 5. `bash: grep -oE '[a-zA-Z0-9_/.-]+\.(md\|ts\|json)' /tmp/co-036-output.json \| sort -u \| wc -l` | Step 1: both skills ≥ 0.85 / 0.80; Step 2: direct Kimi For Coding path visible under the `kimi-k2.7-code` registry id (a `kimi-k2p7` select returns nothing — that id is retired); Step 3: prompt cites all 5 dirs; Step 4: exit 0; Step 5: ≥ 5 distinct files cited | Advisor output, model-profiles entry, prompt file, dispatch JSON, file-count output | PASS if all 5 conditions met; FAIL otherwise | (1) If advisor confidence low: rebuild graph; (2) Kimi K2.7 occasionally hangs ~25min (~5-10% failure rate at default timeouts) — bump timeout to 30min or accept and aggregate over ≥ 5 fixtures; (3) if `kimi-for-coding` provider not configured: run `opencode providers login kimi-for-coding` and set required credentials; (4) if the `jq select` returns empty, confirm the registry id is `kimi-k2.7-code`, not the retired `kimi-k2p7` |

### Optional Supplemental Checks

- Repeat with `--model deepseek/deepseek-v4-pro` (same prompt) and compare consolidation quality — Kimi should produce more file-spanning references.
- Run the same prompt with `--variant low` to compare reasoning depth.
- Time the dispatch and record wall-clock (`avg_iter_wall_clock_min` for Kimi K2.7 is ~22 minutes per model-profiles.json).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../../../sk-prompt/prompt-models/SKILL.md` | Dispatch matrix table |
| `../../../../sk-prompt/prompt-models/assets/model-profiles.json` | kimi-k2p7 entry: direct Kimi For Coding executor path |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Provider Auth Pre-Flight; Kimi K2.7 known-issue: ~5-10% hang rate at default timeouts |
| `../../../../system-skill-advisor/mcp-server/scripts/skill_advisor.py` | Advisor scorer entry point |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CO-036
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `prompt-templates/kimi-k2-7-direct-with-sk-prompt-models.md`
