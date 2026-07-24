---
title: "CU-013 -- Confirmed-fires smoke test"
description: "This scenario validates that sessionStart, preToolUse, and sessionEnd fire under a real cursor-agent -p dispatch for `CU-013`, reproducing phase 004's live event-delivery evidence in an isolated temp workspace."
version: 1.0.0.0
---

# CU-013 -- Confirmed-fires smoke test

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-013`.

---

## 1. OVERVIEW

This scenario validates that `sessionStart`, `preToolUse`, and `sessionEnd` fire under a real `cursor-agent -p` dispatch for `CU-013`. It reproduces, first-hand, the live event-delivery evidence phase 004 of this creation packet captured, using an isolated temporary workspace so this repo's real (deliberately uncommitted) `.cursor/hooks.json` is never touched.

### Why This Matters

This repo's own hook adapters (`mcp-server/hooks/cursor/session-start.ts`, `session-end.ts`, and `runtime/hooks/cursor/spec-gate-enforce.mjs`, wired to `preToolUse`) are built specifically around these three confirmed-firing events, replacing the originally-planned `sessionStart`/`beforeSubmitPrompt`/`stop` trio the `cli-codex` precedent used. If these three events stopped firing, the enforcement guard (`preToolUse` → `spec-gate-enforce.mjs`) would silently go dark.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-013` and confirm the expected signals without contradictory evidence.

- Objective: Verify `sessionStart`, `preToolUse`, and `sessionEnd` all fire at least once during a real `cursor-agent -p` dispatch, using an isolated temp workspace.
- Real user request: `I want to be sure the hooks this repo's adapters depend on actually fire before we trust them.`
- Prompt: `In an isolated temp workspace with its own hooks.json wiring sessionStart/preToolUse/sessionEnd to a logging probe, dispatch a trivial task and confirm all three events fire.`
- Expected execution process: Operator creates an isolated temp workspace (`/tmp/cli-cursor-cu013-workspace/`) with its own `.cursor/hooks.json` wiring the three events to a logging probe script -> dispatches `cursor-agent -p` with `--workspace` pointed at that isolated directory, asking for a trivial shell command so `preToolUse` has something to fire on -> inspects the probe log for entries from all three events.
- Expected signals: The probe log shows at least one `sessionStart` entry, at least one `preToolUse` entry (fired before the requested shell command executes), and at least one `sessionEnd` entry - matching phase 004's confirmed-fires delivery table.
- Desired user-visible outcome: A reproduced, first-hand confirmation of the three events this repo's own hook adapters are wired to, independent of trusting the phase 004 summary alone.
- Pass/fail: PASS if the probe log shows all three events firing at least once. FAIL if any of the three events is absent from the probe log despite a completed session.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Create an isolated temp workspace with its own `hooks.json` wiring `sessionStart`/`preToolUse`/`sessionEnd` to a logging probe script that appends `{event, timestamp}` to a log file.
2. Dispatch `cursor-agent -p` with `--workspace` pointed at the isolated temp workspace, requesting a trivial shell command.
3. Inspect the probe log for entries from all three wired events.
4. Confirm this repo's own real `.cursor/hooks.json` (if any) was never touched by this scenario.
5. Return a PASS/FAIL verdict naming the exact events observed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-013 | Confirmed-fires smoke test | Verify sessionStart/preToolUse/sessionEnd fire under a real dispatch in an isolated workspace | `In an isolated temp workspace with its own hooks.json wiring sessionStart/preToolUse/sessionEnd to a logging probe, dispatch a trivial task and confirm all three events fire.` | 1. `bash: rm -rf /tmp/cli-cursor-cu013-workspace && mkdir -p /tmp/cli-cursor-cu013-workspace/.cursor && printf '#!/bin/sh\necho "{\"event\":\"$1\",\"ts\":\"$(date -u +%%Y-%%m-%%dT%%H:%%M:%%SZ)\"}" >> /tmp/cli-cursor-cu013-probe.log\necho "{\"permission\":\"allow\"}"\n' > /tmp/cli-cursor-cu013-probe.sh && chmod +x /tmp/cli-cursor-cu013-probe.sh` -> 2. `bash: printf '{"version":1,"hooks":{"sessionStart":[{"command":"/tmp/cli-cursor-cu013-probe.sh sessionStart","type":"command"}],"preToolUse":[{"command":"/tmp/cli-cursor-cu013-probe.sh preToolUse","type":"command"}],"sessionEnd":[{"command":"/tmp/cli-cursor-cu013-probe.sh sessionEnd","type":"command"}]}}' > /tmp/cli-cursor-cu013-workspace/.cursor/hooks.json` -> 3. `bash: rm -f /tmp/cli-cursor-cu013-probe.log` -> 4. `cursor-agent -p "Run: echo isolated-probe-test" --workspace /tmp/cli-cursor-cu013-workspace --model auto --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu013-stdout.txt 2>&1` -> 5. `bash: cat /tmp/cli-cursor-cu013-probe.log` -> 6. `bash: git -C . status --porcelain .cursor/hooks.json 2>/dev/null` (confirm this repo's own `.cursor/hooks.json`, if any, was untouched) | Step 1-2: probe script and isolated `hooks.json` created; Step 3: log cleared; Step 4: exit 0; Step 5: log contains `sessionStart`, `preToolUse`, and `sessionEnd` entries; Step 6: no change to this repo's own hook config | Isolated `hooks.json` contents, probe log contents, dispatched stdout, confirmation this repo's real config was untouched | PASS if the probe log contains all three event names AND this repo's own `.cursor/hooks.json` was untouched; FAIL if any event is missing from the log, or if this repo's own hook config was inadvertently modified | (1) Re-check `--workspace` actually pointed at the isolated dir, not this repo; (2) confirm the probe script has execute permission; (3) re-read `mcp-server/hooks/cursor/README.md` for the exact confirmed-fires table if results diverge |

### Optional Supplemental Checks

- Extend the same harness to wire `postToolUse`/`afterFileEdit` and confirm they also fire, cross-checking against phase 004's full confirmed-fires list.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/hook-contract.md` (§4 Documented Agent Events) | Documents the full agent-event roster |
| `../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer/implementation-summary.md` | Phase 004's live-verified confirmed-fires delivery table |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../system-spec-kit/mcp-server/hooks/cursor/README.md` | Full event-delivery evidence table this repo's own adapters were built against |
| `../../../../system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | The real `preToolUse`-wired enforcement adapter this scenario's confirmed-fires evidence supports |

---

## 5. SOURCE METADATA

- Group: Hooks
- Playbook ID: CU-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hooks/confirmed-fires-smoke-test.md`
