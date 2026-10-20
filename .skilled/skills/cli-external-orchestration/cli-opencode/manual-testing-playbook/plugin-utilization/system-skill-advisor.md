---
title: "CO-054 -- system-skill-advisor live utilization on OpenCode 1 and 2"
description: "This scenario validates the system-skill-advisor plugin for CO-054. It focuses on the advisor brief that scores the user prompt against the skill graph and its kill switch."
version: 1.0.5.0
---

# CO-054 -- system-skill-advisor live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CO-054`.

---

## 1. OVERVIEW

This scenario validates the `system-skill-advisor` plugin for `CO-054`. The plugin scores the user prompt against the skill graph and adds an `Advisor:` brief to the system prompt through `experimental.chat.system.transform`. It also exposes `spec_kit_skill_advisor_status` and reacts to runtime events. The recorded run sends a request whose obvious owner is `sk-git` and reads the brief from the captured request. A supplemental run sets `SYSTEM_SKILL_ADVISOR_DISABLED=1` and counts the brief back to zero.

### Why This Matters

The advisor is the routing hint an operator sees before any skill loads. If it stops firing, routing falls back to the model's guess with no visible signal, and a request that should reach `sk-git` can be answered from general knowledge instead. If the kill switch stops working, a disabled advisor still spends prompt space and still steers the model. Both directions matter, so the scenario checks the live brief and the zero-brief state on each version.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-054` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the advisor brief names `sk-git` for a conventional-commit request, and that the kill switch removes the brief, on both OpenCode versions.
- Real user request: `Before anything runs, does the advisor point a conventional-commit request at the right skill, and can I turn that hint off cleanly?`
- Prompt: `Without running any tools, answer in one line: which skill in this repository should handle the request 'commit my staged changes with a conventional commit message'?`
- Expected execution process: run the scenario on v1, read the captured system prompt for the advisor line, rerun with `SYSTEM_SKILL_ADVISOR_DISABLED=1` and count the lines, then repeat both runs on v2.
- Expected signals: the system prompt holds `Advisor: live;` naming `sk-git`. The recorded line is `Advisor: live; ambiguous: sk-git 0.84/0.16 vs system-skill-advisor 0.82/0.16 pass.` With the kill switch the `Advisor:` line count drops to 0.
- Evidence requirements: the captured system prompt for each named run and the line count with and without the switch.
- Desired user-visible outcome: one advisor line that names `sk-git`, and no advisor line when the switch is set, on both versions.
- Pass/fail: PASS if the live run carries the `Advisor: live;` line naming `sk-git` and the switch run carries 0 lines. FAIL if the line is absent, names no skill, or survives the switch.
- Failure triage: A first run in a fresh worktree can show `Advisor: outage (fail_open)`. Rerun once before calling a FAIL. Read the line count from the capture file, never from the model's reply.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: confirm the plugin at `.opencode/plugins/system-skill-advisor.js` exists. Export `AI_SESSION_CHILD=1`.
2. v1 run: run the runner with `v1`, the name `skill-advisor`, and the prompt.
3. v1 check: read the captured system prompt and confirm the `Advisor: live;` line names `sk-git`. Then rerun with `SYSTEM_SKILL_ADVISOR_DISABLED=1` as `killswitch-skill-advisor` and confirm 0 `Advisor:` lines.
4. v2 run: run the runner with `v2`, the same two names and prompts, keeping the switch off the live run and on the kill-switch run.
5. v2 check: read the captured system prompt for the live line and the zero count.
6. Cleanup: none.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
export AI_SESSION_CHILD=1

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 skill-advisor "Without running any tools, answer in one line: which skill in this repository should handle the request 'commit my staged changes with a conventional commit message'?"
jq -r '.system[]' "$EVIDENCE_DIR/skill-advisor.v1.capture.jsonl" | grep -E 'Advisor:'

SYSTEM_SKILL_ADVISOR_DISABLED=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 killswitch-skill-advisor "Without running any tools, answer in one line: which skill in this repository should handle the request 'commit my staged changes with a conventional commit message'?"
F="$EVIDENCE_DIR/killswitch-skill-advisor.v1.capture.jsonl"; [ -s "$F" ] || { echo "FAIL: no capture at $F"; exit 1; }
SYS="$(jq -r '.system[]' "$F")" || { echo "FAIL: capture did not parse"; exit 1; }
n=$(printf '%s\n' "$SYS" | grep -c 'Advisor:' || true); echo "Advisor lines with the switch: $n"; [ "$n" -eq 0 ]

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 skill-advisor "Without running any tools, answer in one line: which skill in this repository should handle the request 'commit my staged changes with a conventional commit message'?"
jq -r '.system[]' "$EVIDENCE_DIR/skill-advisor.v2.capture.jsonl" | grep -E 'Advisor:'

SYSTEM_SKILL_ADVISOR_DISABLED=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 killswitch-skill-advisor "Without running any tools, answer in one line: which skill in this repository should handle the request 'commit my staged changes with a conventional commit message'?"
F="$EVIDENCE_DIR/killswitch-skill-advisor.v2.capture.jsonl"; [ -s "$F" ] || { echo "FAIL: no capture at $F"; exit 1; }
SYS="$(jq -r '.system[]' "$F")" || { echo "FAIL: capture did not parse"; exit 1; }
n=$(printf '%s\n' "$SYS" | grep -c 'Advisor:' || true); echo "Advisor lines with the switch: $n"; [ "$n" -eq 0 ]
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-054 | system-skill-advisor | Confirm the advisor names `sk-git` and that the kill switch removes the brief on both versions | `Without running any tools, answer in one line: which skill in this repository should handle the request 'commit my staged changes with a conventional commit message'?` | Runner as `skill-advisor` on v1 and v2, then the same on each version as `killswitch-skill-advisor` with `SYSTEM_SKILL_ADVISOR_DISABLED=1`, then for each kill-switch capture set `F`, require a non-empty capture with `[ -s "$F" ]`, parse `SYS` with `jq -r '.system[]'`, and count `Advisor:` lines with `printf`/`grep` | `Advisor: live;` naming `sk-git`; recorded line `Advisor: live; ambiguous: sk-git 0.84/0.16 vs system-skill-advisor 0.82/0.16 pass.`; 0 lines with the switch | `skill-advisor.v1.capture.jsonl`, `killswitch-skill-advisor.v1.capture.jsonl`, `skill-advisor.v2.capture.jsonl`, `killswitch-skill-advisor.v2.capture.jsonl` | PASS only when the live line names `sk-git` and the switch run counts 0 on both versions | Rerun once if the first run shows `Advisor: outage (fail_open)`; count lines from the capture file, not the reply |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `plugin-utilization/run-plugin-scenario.sh` | Runs the scenario on v1 or v2 and writes the evidence files |
| `plugin-utilization/capture-proxy.mjs` | Capture proxy that records each model request's system prompt and tools |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/system-skill-advisor.js` | The plugin under test: system transform, event handling, and the `spec_kit_skill_advisor_status` tool |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-054
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/system-skill-advisor.md`
