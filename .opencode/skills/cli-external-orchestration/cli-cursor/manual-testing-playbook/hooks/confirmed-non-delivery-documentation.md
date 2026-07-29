---
title: "CU-014 -- Confirmed-non-delivery documentation"
description: "This scenario validates that beforeSubmitPrompt and stop do NOT fire under cursor-agent -p for `CU-014`, and that the dormant spec-gate-classify.mjs adapter and the gap are documented, not silently assumed working."
version: 1.0.0.0
---

# CU-014 -- Confirmed-non-delivery documentation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-014`.

---

## 1. OVERVIEW

This scenario validates that `beforeSubmitPrompt` and `stop` do NOT fire under `cursor-agent -p` for `CU-014`, reproducing phase 004's inverted finding: the phase's original plan assumed these would be the safe starting set (mirroring `cli-codex`'s `SessionStart`/`UserPromptSubmit`/`Stop` trio), but live probing showed the opposite. This scenario also confirms the dormant `spec-gate-classify.mjs` adapter and the non-delivery gap are documented, not silently assumed working.

### Why This Matters

A guard adapter that assumes `beforeSubmitPrompt` fires (the only plausible attachment point for a pre-emptive Gate-3 advisory classification) would silently never run under `cli-cursor` dispatch. This is a genuine, load-bearing capability gap - the enforce path (`preToolUse`) still blocks unauthorized mutations regardless, but the advisory classify step cannot be surfaced pre-emptively for Cursor the way it can for Codex/Claude. Documenting this honestly (rather than assuming parity with siblings) is the entire point of this scenario.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-014` and confirm the expected signals without contradictory evidence.

- Objective: Verify `beforeSubmitPrompt` and `stop` never fire across a full session round trip, and that this repo documents the gap rather than silently assuming an adapter for either event is active.
- Real user request: `Is the Gate-3 advisory hook for Cursor actually wired up and working, or is that just aspirational?`
- Prompt: `In the same isolated temp workspace, wire beforeSubmitPrompt and stop to the logging probe alongside a full dispatch round trip, and confirm neither event fires.`
- Expected execution process: Operator extends `CU-013`'s isolated workspace harness to also wire `beforeSubmitPrompt` and `stop` to the logging probe -> dispatches a full session round trip (including issuing a prompt, the exact trigger `beforeSubmitPrompt` should fire on if it worked) -> inspects the probe log for zero entries from either event -> confirms `mcp-server/hooks/cursor/spec-gate-classify.mjs` exists and its README documents it as dormant, never wired to a firing event.
- Expected signals: The probe log shows zero entries for `beforeSubmitPrompt` and zero for `stop` across the full session. `mcp-server/hooks/cursor/spec-gate-classify.mjs` exists on disk. `runtime/hooks/cursor/README.md` and `mcp-server/hooks/cursor/README.md` both explicitly document the non-delivery finding for these two events.
- Desired user-visible outcome: A reproduced confirmation of the documented gap, so no future adapter silently assumes advisory Gate-3 classification is reachable via `beforeSubmitPrompt` when it is not - and an honest SKIP-editor-only note (per the packet's own Edge Cases) rather than a silent omission of this category.
- Pass/fail: PASS if the probe log shows zero entries for both events across a full round trip AND both README files document the gap AND `spec-gate-classify.mjs` exists as dormant, un-wired code. FAIL if either event unexpectedly fires (a genuine CLI behavior change that must be escalated, not silently absorbed), or if the dormant-adapter documentation is missing/contradicted.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Reuse (or recreate) `CU-013`'s isolated temp workspace, adding `beforeSubmitPrompt` and `stop` entries to its `hooks.json`, both wired to the same logging probe.
2. Dispatch a full session round trip in that workspace, including a prompt whose submission is the intended `beforeSubmitPrompt` trigger.
3. Inspect the probe log for zero entries from either event.
4. Confirm `mcp-server/hooks/cursor/spec-gate-classify.mjs` exists and check both READMEs for the documented non-delivery finding.
5. Return a PASS/FAIL verdict naming the exact absence and the documentation citations found.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-014 | Confirmed-non-delivery documentation | Verify beforeSubmitPrompt/stop never fire and the gap is documented, not assumed | `In the same isolated temp workspace, wire beforeSubmitPrompt and stop to the logging probe alongside a full dispatch round trip, and confirm neither event fires.` | 1. `bash: printf '{"version":1,"hooks":{"beforeSubmitPrompt":[{"command":"/tmp/cli-cursor-cu013-probe.sh beforeSubmitPrompt","type":"command"}],"stop":[{"command":"/tmp/cli-cursor-cu013-probe.sh stop","type":"command"}],"sessionStart":[{"command":"/tmp/cli-cursor-cu013-probe.sh sessionStart","type":"command"}],"sessionEnd":[{"command":"/tmp/cli-cursor-cu013-probe.sh sessionEnd","type":"command"}]}}' > /tmp/cli-cursor-cu013-workspace/.cursor/hooks.json` -> 2. `bash: rm -f /tmp/cli-cursor-cu013-probe.log` -> 3. `cursor-agent -p "Say a short goodbye and finish." --workspace /tmp/cli-cursor-cu013-workspace --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu014-stdout.txt 2>&1` -> 4. `bash: grep -c "beforeSubmitPrompt" /tmp/cli-cursor-cu013-probe.log; grep -c "stop" /tmp/cli-cursor-cu013-probe.log` (expect `0` for both) -> 5. `bash: test -f ../../../../system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs && echo "exists"` -> 6. `bash: grep -il "beforeSubmitPrompt\|non-delivery\|never fire" ../../../../system-spec-kit/mcp-server/hooks/cursor/README.md ../../../../system-spec-kit/mcp-server/hooks/cursor/README.md` | Step 1-3: session round trip completes, exit 0; Step 4: both grep counts are `0`; Step 5: dormant adapter file exists; Step 6: both READMEs document the non-delivery finding | Probe log with zero entries for both events, dormant adapter file listing, README grep matches | PASS if both event counts are `0` in the probe log AND the dormant adapter file exists AND both READMEs document the gap; FAIL if either event count is non-zero (escalate as a CLI behavior change, do not silently update this scenario), or if the documentation is missing | (1) Confirm the probe script and `hooks.json` were correctly extended with both new event keys; (2) re-verify `CU-013`'s three confirmed-firing events still fire in the same log (rules out a broken harness masquerading as non-delivery); (3) re-read `mcp-server/hooks/cursor/README.md` for the exact confirmed-non-delivery wording if the grep misses |

### Optional Supplemental Checks

- Repeat the round trip with `--continue` for a second turn (mirroring phase 004's own methodology, which specifically tested whether `beforeSubmitPrompt` needed a second turn to trigger) and confirm the event still never fires.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/hook-contract.md` (§7 Open Question - Partial Event Delivery) | Documents the editor-vs-CLI parity gap this scenario resolves empirically for two specific events |
| `../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer/implementation-summary.md` | Phase 004's live-verified confirmed-non-delivery finding and dormant-adapter decision |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs` | The dormant Gate-3 advisory adapter, built but never wired |
| `../../../../system-spec-kit/mcp-server/hooks/cursor/README.md` | Documents why `preToolUse` replaced `beforeShellExecution` and the dormant status of the classify hook |

---

## 5. SOURCE METADATA

- Group: Hooks
- Playbook ID: CU-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hooks/confirmed-non-delivery-documentation.md`
