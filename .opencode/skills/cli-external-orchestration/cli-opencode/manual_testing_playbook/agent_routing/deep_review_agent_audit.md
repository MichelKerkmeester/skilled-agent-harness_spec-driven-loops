---
title: "CO-033 -- Deep-review command-owned audit loop"
description: "This scenario validates the deep-review loop for `CO-033`. It focuses on confirming `/deep:review:auto` (never a raw `--agent deep-review` dispatch) drives a single audit iteration against a pre-bound spec packet and persists the real packet-local JSONL/findings-registry state."
version: 1.3.0.13
---

# CO-033 -- Deep-review command-owned audit loop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-033`.

---

## 1. OVERVIEW

This scenario validates the `deep-review` loop for `CO-033`. It focuses on confirming that a `/deep:review:auto` dispatch against a pre-bound spec packet runs at least one real iteration, writes the packet-local iteration file under `{spec_folder}/review/iterations/`, and appends an event to the packet-local `review/deep-review-state.jsonl`, so the command's own reducer (not this scenario) can manage severity-weighted convergence across multiple iterations.

### Why This Matters

`deep-review` is a LEAF agent that is LOOP-OWNED by its parent `/deep:review` command (`SKILL.md` §3 "OpenCode Agent Delegation" item 3; `references/agent_delegation.md` §3 "@deep-research and @deep-review — Loop Executors"). The current contract forbids two shortcuts this scenario previously took: a raw top-level `opencode run --agent deep-review` dispatch (rejected the same way any other subagent slug is at the top level) and a generic `--agent orchestrate` simulation that invents its own `/tmp` state file. Neither shortcut proves the production contract, because all continuity for a real deep-review run lives on disk under `{spec_folder}/review/` (`deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `review-report.md`, plus one file per iteration under `review/iterations/`) and is machine-owned by the command's reducer, not by ad-hoc prose in a dispatch prompt. If this scenario keeps testing the simulated shape, a real regression in the command-owned severity-weighted convergence machinery can ship undetected.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-033` and confirm the expected signals without contradictory evidence.

- Objective: Verify `/deep:review:auto` against a pre-bound spec packet executes at least one real iteration, writes an iteration file under `{spec_folder}/review/iterations/` with at least one severity-tagged (P0/P1/P2) finding, and appends at least one record to `{spec_folder}/review/deep-review-state.jsonl` — without this scenario synthesizing its own `/tmp` state or routing through a generic `--agent orchestrate` simulation.
- Real user request: `Run a single deep-review iteration on the cli-opencode SKILL.md file, using the real /deep:review command against a scratch spec packet, and show me the packet-local findings it wrote.`
- RCAF Prompt: `As an external-AI conductor exercising the production deep-review loop (never a raw --agent deep-review dispatch and never an orchestrate simulation), dispatch opencode run --command deep/review against a pre-bound scratch spec packet targeting the cli-opencode SKILL.md file at @./.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md, with a tight iteration cap so the loop stops quickly. Verify the dispatch exits 0, a new iteration file with a P0/P1/P2-tagged finding appears under <packet>/review/iterations/, and <packet>/review/deep-review-state.jsonl gained at least one new record. Return a verdict naming the highest-severity finding and the state-file record count delta.`
- Expected execution process: External-AI orchestrator pre-binds a scratch spec packet (never the operator's live tracked packets), dispatches through the command-owned entry point with a low `--max-iterations` cap against a real target file, captures the JSON event stream, then validates the packet's `review/` directory gained the expected files rather than inspecting any `/tmp` path.
- Expected signals: Dispatch exits 0. `<packet>/review/iterations/` contains at least one new iteration file with an explicit severity tag (P0, P1 or P2) and a file or line citation. `<packet>/review/deep-review-state.jsonl` line count increased by at least 1. No dispatch used a raw top-level `--agent deep-review` or an `--agent orchestrate` "use the deep-review subagent" simulation.
- Desired user-visible outcome: A real, on-disk audit-iteration result the command's own reducer can feed into severity-weighted convergence detection.
- Pass/fail: PASS if exit 0 AND a new iteration file with a severity-tagged finding exists under `<packet>/review/iterations/` AND the state JSONL line count increased AND no raw `--agent deep-review` / orchestrate-simulation dispatch was used. FAIL if any check misses.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-bind a scratch spec packet path (a throwaway packet under the tracked-packet convention, never a live operator packet) and confirm it has no pre-existing `review/` directory, or capture the current `deep-review-state.jsonl` line count if it does.
2. Dispatch `/deep:review:auto` (via `opencode run --command deep/review`, per SKILL.md/`cli_reference.md` §4's `--command <family>/<name>` contract) against that packet, targeting a real file, with a low iteration cap.
3. Confirm the dispatch exits 0.
4. List `<packet>/review/iterations/` and confirm a new iteration file exists with a severity tag and citation.
5. Diff the `deep-review-state.jsonl` line count before/after and confirm it grew.
6. Return a verdict naming the highest-severity finding and the record-count delta.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-033 | Deep-review command-owned audit loop | Verify `/deep:review:auto` against a pre-bound packet writes a real severity-tagged iteration file and grows the packet-local state JSONL | `As an external-AI conductor exercising the production deep-review loop (never a raw --agent deep-review dispatch and never an orchestrate simulation), dispatch opencode run --command deep/review against a pre-bound scratch spec packet targeting the cli-opencode SKILL.md file at @./.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md, with a tight iteration cap so the loop stops quickly. Verify the dispatch exits 0, a new iteration file with a P0/P1/P2-tagged finding appears under <packet>/review/iterations/, and <packet>/review/deep-review-state.jsonl gained at least one new record. Return a verdict naming the highest-severity finding and the state-file record count delta.` | 1. `bash: PACKET=".opencode/specs/skilled-agent-orchestration/999-co-033-scratch-probe"; mkdir -p "$PACKET"; wc -l "$PACKET/review/deep-review-state.jsonl" 2>/dev/null || echo "PRE_COUNT=0"` -> 2. `bash: opencode run --command deep/review --variant high --format json --dir "$(pwd)" "auto: audit the cli-opencode SKILL.md file at @./.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md -- spec folder $PACKET, --max-iterations 1" > /tmp/co-033-events.jsonl 2>&1; echo "Exit: $?"` -> 3. `bash: ls -1t "$PACKET/review/iterations/"*.md 2>/dev/null \| head -3` -> 4. `bash: grep -cE '\b(P0\|P1\|P2)\b' "$PACKET/review/iterations/"*.md 2>/dev/null` -> 5. `bash: wc -l "$PACKET/review/deep-review-state.jsonl" 2>/dev/null` -> 6. `bash: rm -rf "$PACKET"` (scratch-packet teardown, run after every pass or fail) | Step 1: pre-count captured (0 for a fresh scratch packet); Step 2: exit 0; Step 3: at least one iteration file listed; Step 4: severity-tag count >= 1 in the iteration file; Step 5: line count > pre-count; Step 6: scratch packet removed | `/tmp/co-033-events.jsonl`, `$PACKET/review/iterations/` directory listing, before/after JSONL line counts | PASS if exit 0 AND >= 1 new iteration file with a severity tag AND state JSONL line count increased AND the scratch packet was never a live operator packet; FAIL if any check misses or the dispatch fell back to a raw `--agent deep-review` / orchestrate-simulation shape | (1) If `--command deep/review` does not resolve the `:auto` mode as expected, confirm the exact non-interactive invocation shape against `.opencode/commands/deep/review.md` before assuming the command is broken; (2) if no iteration file appears, the loop may have exited on a Gate-3 or setup halt — inspect stderr and `$PACKET/review/deep-review-state.jsonl` for a blocked-stop record; (3) never point `$PACKET` at a tracked operator packet — this scenario's writes must stay inside a disposable scratch packet |

### Optional Supplemental Checks

For severity-distribution validation, re-invoke `/deep:review:auto` against the same scratch packet with a second real target file and confirm the reducer's findings registry accumulates both iterations' findings rather than overwriting the first. The command's own reducer handles severity-weighted convergence detection; this scenario only proves the on-disk contract is exercised end-to-end.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 "@deep-research and @deep-review — Loop Executors") | Documents the deep-review LEAF, command-owned contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §3 "OpenCode Agent Delegation" item 3 | Command-owned loop executor contract (never raw `--agent deep-review`) |
| `../../references/agent_delegation.md` | §3 deep-review, LEAF iteration loop executor |
| `system-deep-loop/deep-review/README.md` | Packet-local artifact layout (`review/deep-review-state.jsonl`, `review/iterations/` etc.) and `/deep:review:auto` invocation shape |
| `.opencode/agents/deep-review.md` | Agent definition file |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CO-033
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `agent_routing/deep_review_agent_audit.md`
