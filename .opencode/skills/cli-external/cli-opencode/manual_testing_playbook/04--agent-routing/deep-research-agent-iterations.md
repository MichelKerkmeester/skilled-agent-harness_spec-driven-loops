---
title: "CO-032 -- Deep-research command-owned iteration loop"
description: "This scenario validates the deep-research loop for `CO-032`. It focuses on confirming `/deep:research:auto` (never a raw `--agent deep-research` dispatch) drives a single iteration against a pre-bound spec packet and persists the real packet-local JSONL/strategy/dashboard state."
version: 1.3.0.13
---

# CO-032 -- Deep-research command-owned iteration loop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-032`.

---

## 1. OVERVIEW

This scenario validates the `deep-research` loop for `CO-032`. It focuses on confirming that a `/deep:research:auto` dispatch against a pre-bound spec packet runs at least one real iteration, writes the packet-local iteration file, and appends an event to the packet-local `research/deep-research-state.jsonl`, so the command's own reducer (not this scenario) can manage convergence detection across multiple iterations.

### Why This Matters

`deep-research` is a LEAF agent that is LOOP-OWNED by its parent `/deep:research` command (`SKILL.md` §3 "OpenCode Agent Delegation" item 3; `references/agent_delegation.md` §3 "@deep-research and @deep-review — Loop Executors"). The current contract forbids two shortcuts this scenario previously took: a raw top-level `opencode run --agent deep-research` dispatch (rejected the same way any other subagent slug is at the top level) and a generic `--agent orchestrate` simulation that invents its own `/tmp` state file. Neither shortcut proves the production contract, because all continuity for a real deep-research run lives on disk under `{spec_folder}/research/` (`deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`, plus one file per iteration) and is machine-owned by the command's reducer, not by ad-hoc prose in a dispatch prompt. If this scenario keeps testing the simulated shape, a real regression in the command-owned state machine can ship undetected.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-032` and confirm the expected signals without contradictory evidence.

- Objective: Verify `/deep:research:auto` against a pre-bound spec packet executes at least one real iteration, writes an iteration file under `{spec_folder}/research/`, and appends at least one record to `{spec_folder}/research/deep-research-state.jsonl` — without this scenario synthesizing its own `/tmp` state or routing through a generic `--agent orchestrate` simulation.
- Real user request: `Run a single deep-research iteration on the cli-opencode self-invocation guard rationale, using the real /deep:research command against a scratch spec packet, and show me the packet-local state file it wrote.`
- RCAF Prompt: `As an external-AI conductor exercising the production deep-research loop (never a raw --agent deep-research dispatch and never an orchestrate simulation), dispatch opencode run --command deep/research against a pre-bound scratch spec packet, with the topic "the cli-opencode self-invocation guard rationale documented in ADR-001 and integration_patterns.md §5" and a tight iteration cap so the loop stops quickly. Verify the dispatch exits 0, a new iteration file appears under <packet>/research/, and <packet>/research/deep-research-state.jsonl gained at least one new record. Return a verdict naming the iteration file and the state-file record count delta.`
- Expected execution process: External-AI orchestrator pre-binds a scratch spec packet (never the operator's live tracked packets), dispatches through the command-owned entry point with a low `--max-iterations` cap, captures the JSON event stream, then validates the packet's `research/` directory gained the expected files rather than inspecting any `/tmp` path.
- Expected signals: Dispatch exits 0. `<packet>/research/` contains at least one new iteration file after the run. `<packet>/research/deep-research-state.jsonl` line count increased by at least 1. No dispatch used a raw top-level `--agent deep-research` or an `--agent orchestrate` "use the deep-research subagent" simulation.
- Desired user-visible outcome: A real, on-disk research-iteration result the command's own reducer can feed into convergence detection on the next invocation.
- Pass/fail: PASS if exit 0 AND a new iteration file exists under `<packet>/research/` AND the state JSONL line count increased AND no raw `--agent deep-research` / orchestrate-simulation dispatch was used. FAIL if any check misses.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-bind a scratch spec packet path (a throwaway packet under the tracked-packet convention, never a live operator packet) and confirm it has no pre-existing `research/` directory, or capture the current `deep-research-state.jsonl` line count if it does.
2. Dispatch `/deep:research:auto` (via `opencode run --command deep/research`, per SKILL.md/`cli_reference.md` §4's `--command <family>/<name>` contract) against that packet with a low iteration cap.
3. Confirm the dispatch exits 0.
4. List `<packet>/research/` and confirm a new iteration file exists.
5. Diff the `deep-research-state.jsonl` line count before/after and confirm it grew.
6. Return a verdict naming the iteration file and the record-count delta.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-032 | Deep-research command-owned iteration loop | Verify `/deep:research:auto` against a pre-bound packet writes a real iteration file and grows the packet-local state JSONL | `As an external-AI conductor exercising the production deep-research loop (never a raw --agent deep-research dispatch and never an orchestrate simulation), dispatch opencode run --command deep/research against a pre-bound scratch spec packet, with the topic "the cli-opencode self-invocation guard rationale documented in ADR-001 and integration_patterns.md §5" and a tight iteration cap so the loop stops quickly. Verify the dispatch exits 0, a new iteration file appears under <packet>/research/, and <packet>/research/deep-research-state.jsonl gained at least one new record. Return a verdict naming the iteration file and the state-file record count delta.` | 1. `bash: PACKET=".opencode/specs/skilled-agent-orchestration/999-co-032-scratch-probe"; mkdir -p "$PACKET"; wc -l "$PACKET/research/deep-research-state.jsonl" 2>/dev/null || echo "PRE_COUNT=0"` -> 2. `bash: opencode run --command deep/research --variant high --format json --dir "$(pwd)" "auto: the cli-opencode self-invocation guard rationale documented in ADR-001 and integration_patterns.md §5 -- spec folder $PACKET, --max-iterations 1" > /tmp/co-032-events.jsonl 2>&1; echo "Exit: $?"` -> 3. `bash: ls -1t "$PACKET/research/"*.md 2>/dev/null \| head -3` -> 4. `bash: wc -l "$PACKET/research/deep-research-state.jsonl" 2>/dev/null` -> 5. `bash: rm -rf "$PACKET"` (scratch-packet teardown, run after every pass or fail) | Step 1: pre-count captured (0 for a fresh scratch packet); Step 2: exit 0; Step 3: at least one iteration file listed; Step 4: line count > pre-count; Step 5: scratch packet removed | `/tmp/co-032-events.jsonl`, `$PACKET/research/` directory listing, before/after JSONL line counts | PASS if exit 0 AND >= 1 new iteration file AND state JSONL line count increased AND the scratch packet was never a live operator packet; FAIL if any check misses or the dispatch fell back to a raw `--agent deep-research` / orchestrate-simulation shape | (1) If `--command deep/research` does not resolve the `:auto` mode as expected, confirm the exact non-interactive invocation shape against `.opencode/commands/deep/research.md` before assuming the command is broken; (2) if no iteration file appears, the loop may have exited on a Gate-3 or setup halt — inspect stderr and `$PACKET/research/deep-research-state.jsonl` for a blocked-stop record; (3) never point `$PACKET` at a tracked operator packet — this scenario's writes must stay inside a disposable scratch packet |

### Optional Supplemental Checks

For full convergence-detection validation, re-invoke `/deep:research:auto` against the same scratch packet and confirm the reducer resumes the existing lineage (per the README's "Because state is on disk, a crashed run resumes from the packet files" behavior) rather than starting a new one. The command's own reducer is the canonical convergence detector; this scenario only proves the on-disk contract is exercised end-to-end.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 "@deep-research and @deep-review — Loop Executors") | Documents the deep-research LEAF, command-owned contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §3 "OpenCode Agent Delegation" item 3 | Command-owned loop executor contract (never raw `--agent deep-research`) |
| `../../references/agent_delegation.md` | §3 deep-research, LEAF iteration loop executor |
| `system-deep-loop/deep-research/README.md` | Packet-local artifact layout (`research/deep-research-state.jsonl` etc.) and `/deep:research:auto` invocation shape |
| `.opencode/agents/deep-research.md` | Agent definition file |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CO-032
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/deep-research-agent-iterations.md`
