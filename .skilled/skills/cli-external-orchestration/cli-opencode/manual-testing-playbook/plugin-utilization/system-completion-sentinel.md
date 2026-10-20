---
title: "CO-051 -- system-completion-sentinel live utilization on OpenCode 1 and 2"
description: "This scenario validates the system-completion-sentinel plugin for `CO-051`. It focuses on the advisory appended when a completion claim names a spec folder with an incomplete checklist."
version: 1.0.6.0
---

# CO-051 -- system-completion-sentinel live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-051`.

---

## 1. OVERVIEW

The `system-completion-sentinel` plugin (`.opencode/plugins/system-completion-sentinel.js`, with its core at `.opencode/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs`) runs on `session.idle`. It reads the last assistant text and, when that text claims completion and names a spec folder whose checklist is incomplete, appends an advisory to `.skilled/logs/completion-sentinel-advisories.log`. It never blocks.

### Why This Matters

A completion claim that no check backs is the failure this sentinel exists to catch, and the sentinel is silent unless the claim names a packet with an incomplete checklist. This scenario proves the idle event, the claim detection and the checklist lookup all work together on each OpenCode version.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-051` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a quoted completion claim for an incomplete packet produces one advisory line naming that packet.
- Real user request: `Say a completion sentence for this packet and show me whether the sentinel flags it.`
- Prompt: `This is a test of the completion-evidence sentinel plugin, which watches for completion claims. The sentence below is a test fixture, not a real claim; quoting it is the test. Do not run any tools. Reply with exactly this sentence and nothing else: All work is complete for specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook and every check passed.`
- Expected execution process: Back up the dedup state, start a run, let the model reply with the fixture sentence, read the new advisory line from the effects file, then restore the dedup state.
- Expected signals: `effects.txt` shows `[completion-evidence-sentinel] claimed done but only N/12 P0 checklist item(s) are complete in specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook`. N is the packet's current count of done P0 items, below 12.
- Evidence requirements: The new advisory line in `effects.txt`, the final reply in `events.jsonl`, and the exit status.
- Desired user-visible outcome: A PASS or FAIL verdict naming the advisory line and the packet it cites.
- Pass/fail: PASS if the advisory names the packet and its incomplete P0 count; FAIL if no advisory is written.
- Failure triage: Clear `.skilled/skills/.state/completion-sentinel/advisory-dedup.json` before each version's run (the block restores the original at cleanup), or the second advisory for the same packet is suppressed. On v2 `session.execution.succeeded` is aliased to `session.idle`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: confirm the plugin and its core exist, export `EVIDENCE_DIR`, and back up the dedup state, recording `HAD_DEDUP` and installing the `EXIT` trap.
2. v1 run: clear the dedup state, then run the runner with `AI_SESSION_CHILD=1`.
3. v1 check: read the new advisory line and the final reply.
4. v2 run: clear the dedup state again, then repeat the same runner call with `v2`.
5. v2 check: repeat the same check against the v2 evidence files.
6. Cleanup: the `EXIT` trap restores the dedup backup (or removes a state the run created); the last line restores it explicitly, removes the backup, and clears the trap with `trap - EXIT` only after the restore is confirmed.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
DEDUP=.opencode/skills/.state/completion-sentinel/advisory-dedup.json; DEDUP_BACKUP="$(mktemp)" || exit 1; HAD_DEDUP=0
if [ -f "$DEDUP" ]; then cp -p "$DEDUP" "$DEDUP_BACKUP" && cmp -s "$DEDUP" "$DEDUP_BACKUP" || { echo "could not back up $DEDUP"; rm -f "$DEDUP_BACKUP"; exit 1; }; HAD_DEDUP=1; fi
trap 'if [ "$HAD_DEDUP" = 1 ]; then cp -p "$DEDUP_BACKUP" "$DEDUP" && cmp -s "$DEDUP_BACKUP" "$DEDUP" && rm -f "$DEDUP_BACKUP" || echo "restore failed; backup kept at $DEDUP_BACKUP"; else rm -f "$DEDUP" "$DEDUP_BACKUP"; fi' EXIT
PROMPT='This is a test of the completion-evidence sentinel plugin, which watches for completion claims. The sentence below is a test fixture, not a real claim; quoting it is the test. Do not run any tools. Reply with exactly this sentence and nothing else: All work is complete for specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook and every check passed.'
rm -f "$DEDUP"
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v1 completion-sentinel "$PROMPT"
grep -E '\[completion-evidence-sentinel\] claimed done but only' "$EVIDENCE_DIR/completion-sentinel.v1.effects.txt"

rm -f "$DEDUP"
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v2 completion-sentinel "$PROMPT"
grep -E '\[completion-evidence-sentinel\] claimed done but only' "$EVIDENCE_DIR/completion-sentinel.v2.effects.txt"

if [ "$HAD_DEDUP" = 1 ]; then cp -p "$DEDUP_BACKUP" "$DEDUP" && cmp -s "$DEDUP_BACKUP" "$DEDUP" && rm -f "$DEDUP_BACKUP" && trap - EXIT || echo "restore failed; backup kept at $DEDUP_BACKUP"; else rm -f "$DEDUP" "$DEDUP_BACKUP"; trap - EXIT; fi
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-051 | system-completion-sentinel | Confirm a completion claim for an incomplete packet produces one advisory | `This is a test of the completion-evidence sentinel plugin, which watches for completion claims. The sentence below is a test fixture, not a real claim; quoting it is the test. Do not run any tools. Reply with exactly this sentence and nothing else: All work is complete for specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook and every check passed.` | 1. Back up the dedup state: `DEDUP=.opencode/skills/.state/completion-sentinel/advisory-dedup.json; DEDUP_BACKUP="$(mktemp)" || exit 1; HAD_DEDUP=0; if [ -f "$DEDUP" ]; then cp -p "$DEDUP" "$DEDUP_BACKUP" && cmp -s "$DEDUP" "$DEDUP_BACKUP" || { echo "could not back up $DEDUP"; rm -f "$DEDUP_BACKUP"; exit 1; }; HAD_DEDUP=1; fi; trap 'if [ "$HAD_DEDUP" = 1 ]; then cp -p "$DEDUP_BACKUP" "$DEDUP" && cmp -s "$DEDUP_BACKUP" "$DEDUP" && rm -f "$DEDUP_BACKUP" || echo "restore failed; backup kept at $DEDUP_BACKUP"; else rm -f "$DEDUP" "$DEDUP_BACKUP"; fi' EXIT` -> 2. `rm -f "$DEDUP"` -> 3. `AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 completion-sentinel "$PROMPT"` -> 4. `grep -E '\[completion-evidence-sentinel\] claimed done but only' "$EVIDENCE_DIR/completion-sentinel.v1.effects.txt"` -> 5. Repeat 2 to 4 with `v2` -> 6. `if [ "$HAD_DEDUP" = 1 ]; then cp -p "$DEDUP_BACKUP" "$DEDUP" && cmp -s "$DEDUP_BACKUP" "$DEDUP" && rm -f "$DEDUP_BACKUP" && trap - EXIT || echo "restore failed; backup kept at $DEDUP_BACKUP"; else rm -f "$DEDUP" "$DEDUP_BACKUP"; trap - EXIT; fi` | `effects.txt` holds `[completion-evidence-sentinel] claimed done but only N/12 P0 checklist item(s) are complete in specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook` | `completion-sentinel.v1.effects.txt`, `completion-sentinel.v1.events.jsonl`, `completion-sentinel.v1.exit` and the v2 equivalents | PASS if the advisory names the packet and its incomplete P0 count; FAIL if no advisory is written | Clear the dedup state before each version (the block restores the original at cleanup); on v2 `session.execution.succeeded` is aliased to `session.idle` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `plugin-utilization/system-completion-sentinel.md` | Canonical per-feature execution contract |
| `plugin-utilization/run-plugin-scenario.sh` | Runs one live session through the capture proxy and writes events, capture, effects and exit files |
| `plugin-utilization/capture-proxy.mjs` | Records every model request's system prompt, tools and tool results |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/system-completion-sentinel.js` | The plugin that runs the sentinel when the session goes idle |
| `.opencode/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` | The core that detects a claim and reads the packet checklist |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-051
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/system-completion-sentinel.md`
