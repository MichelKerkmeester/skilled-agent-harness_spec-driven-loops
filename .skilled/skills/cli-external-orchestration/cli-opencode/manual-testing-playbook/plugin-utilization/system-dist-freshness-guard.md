---
title: "CO-053 -- system-dist-freshness-guard live utilization on OpenCode 1 and 2"
description: "This scenario validates the system-dist-freshness-guard plugin for CO-053. It focuses on the stale compiled dist warning that reaches the system prompt and the plugin log."
version: 1.0.5.0
---

# CO-053 -- system-dist-freshness-guard live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CO-053`.

---

## 1. OVERVIEW

This scenario validates the `system-dist-freshness-guard` plugin for `CO-053`. The plugin reports stale compiled outputs into the system prompt and into `.skilled/logs/dist-freshness-guard.log`. It runs the check on `session.created`, on a risky `bash` command, and on the system transform, so the warning can reach a request through more than one path. The recorded run makes a provisioned package stale and reads the warning from the next model request.

### Why This Matters

A stale compiled dist silently runs old code while the source tree and every test claim something newer. The plugin makes that drift visible in the request itself, before an operator trusts an answer that came from a stale binary. The warning is only useful if it still reaches the prompt after the hook wiring changes between OpenCode versions, so the scenario reads the captured request rather than the model's reply.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-053` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a stale compiled dist puts the guard warning into the system prompt and the plugin log on both OpenCode versions.
- Real user request: `If a compiled package in my workspace is stale, will the next request tell me before I trust the answer, on both OpenCode versions?`
- Prompt: `Reply with the single word OK.`
- Expected execution process: make one provisioned package stale while keeping a backup, confirm the checker reports it, run the scenario on v1, read the captured system prompt and log effect, restore the file, then repeat the whole cycle on v2.
- Expected signals: the system prompt holds `[dist-freshness-guard] Local compiled dist is stale` and `STALE DIST WARNING: design-system-extractor`, and the log gains a line (prefix `session.created:` on v1, `inject:` on v2).
- Evidence requirements: the captured request's system prompt per version, the new log line in the effects file, and the correctness of the confirm command before and after the run.
- Desired user-visible outcome: a named stale package in the request and a matching log line, on both versions.
- Pass/fail: PASS if both markers appear in the system prompt and the log gains its line. FAIL if the warning is absent from the prompt, absent from the log, or names no package.
- Failure triage: Run the confirm command first. A package without its own `node_modules` reports `unprovisioned` instead of `stale`, so use the provisioned sample named in the command sequence.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: make `sk-design-md-generator/backend/dist/cli.js` stale and keep a backup. Confirm the checker prints `sk-design-md-generator/backend`. Export `AI_SESSION_CHILD=1`.
2. v1 run: run the runner with `v1`, the name `dist-freshness`, and the prompt `Reply with the single word OK.`
3. v1 check: read the captured system prompt for both markers and read the effects file for the log line.
4. v2 run: restore the backup, make the file stale again, then run the runner with `v2`, the same name and prompt.
5. v2 check: read the captured system prompt for both markers and read the effects file for the log line.
6. Cleanup: the `EXIT` trap restores `$E` from `BACKUP` even if the run is interrupted; the final line restores it explicitly, and the backup is removed and the trap cleared only after the restored file matches the backup, then rerun the confirm command until it prints `[]`.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
export AI_SESSION_CHILD=1
E=.opencode/skills/sk-design/sk-design-md-generator/backend/dist/cli.js
BACKUP="$(mktemp)" || exit 1
cp -p "$E" "$BACKUP" && cmp -s "$E" "$BACKUP" || { echo "could not back up $E"; rm -f "$BACKUP"; exit 1; }
trap 'cp -p "$BACKUP" "$E" && cmp -s "$BACKUP" "$E" && rm -f "$BACKUP" || echo "restore failed; backup kept at $BACKUP"' EXIT
printf '\n' >> $E
touch -t 200001010000 $E
node -e "const d=require('./.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs'); console.log(d.checkAllFreshness({workspaceRoot:process.cwd()}).filter(r=>r.stale).map(r=>r.packageId))"

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 dist-freshness "Reply with the single word OK."
jq -r '.system[]' "$EVIDENCE_DIR/dist-freshness.v1.capture.jsonl" | grep -E 'dist-freshness-guard|STALE DIST WARNING'
grep -E 'session.created:|inject:' "$EVIDENCE_DIR/dist-freshness.v1.effects.txt"

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 dist-freshness "Reply with the single word OK."
jq -r '.system[]' "$EVIDENCE_DIR/dist-freshness.v2.capture.jsonl" | grep -E 'dist-freshness-guard|STALE DIST WARNING'
grep -E 'session.created:|inject:' "$EVIDENCE_DIR/dist-freshness.v2.effects.txt"

cp -p "$BACKUP" "$E" && cmp -s "$BACKUP" "$E" && rm -f "$BACKUP" && trap - EXIT || echo "restore failed; backup kept at $BACKUP"
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-053 | system-dist-freshness-guard | Make a provisioned package stale and confirm the warning reaches the prompt and the log on both versions | `Reply with the single word OK.` | Stale setup and confirm command, then the runner on v1 and v2, then `jq` on each `.capture.jsonl` and `grep` on each `.effects.txt`, then restore from the `mktemp` backup and clear the `EXIT` trap | Prompt holds `[dist-freshness-guard] Local compiled dist is stale` and `STALE DIST WARNING: design-system-extractor`; log gains a line prefixed `session.created:` on v1 and `inject:` on v2 | `dist-freshness.v1.capture.jsonl`, `dist-freshness.v1.effects.txt`, `dist-freshness.v2.capture.jsonl`, `dist-freshness.v2.effects.txt` | PASS only when both markers and the log line appear on both versions | Run the confirm command first; an unprovisioned package reports `unprovisioned`, not `stale`, so use the provisioned backend sample |

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
| `.opencode/plugins/system-dist-freshness-guard.js` | The plugin under test: event, bash-command, and transform freshness checks |
| `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | Checker that classifies each package's compiled output as fresh, stale, or unprovisioned |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-053
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/system-dist-freshness-guard.md`
