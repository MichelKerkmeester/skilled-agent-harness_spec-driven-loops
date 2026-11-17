---
title: "NC-002 Native advisor_status Transitions"
description: "Manual validation of advisor_status freshness transitions and status fields."
trigger_phrases:
  - "nc-002"
  - "native advisor_status transitions"
  - "native advisor_status"
  - "native"
version: 0.8.1.0
id: NC-002
category: native_cli_tools
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: feature-catalog/cli-surface/advisor-status.md
---

# NC-002 Native advisor_status Transitions

Prompt: Manual validation of advisor_status freshness transitions and status fields.


---

## 1. OVERVIEW

Validate that `advisor_status` reports live, stale and absent states with the Phase 027 `skillCount` and `lastScanAt` fields.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- Use a disposable copy for stale or absent transition simulation.
- Native package build exists in `runtime/dist`.

---

## 3. TEST EXECUTION

1. Live check:

```text
node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root /absolute/path/to/repo --format json
```

2. Stale check in a disposable copy: touch a copied `.skilled/skills/*/graph-metadata.json` after the copied SQLite artifact timestamp, then call `advisor_status` with that copy as `workspaceRoot`.
3. Absent check in a disposable copy: move the copied `skill-graph.sqlite` out of the way, ensure no usable generation metadata is present, then call `advisor_status`.
4. Hook health check: send one prompt through the advisor hook with `SKILL_ADVISOR_DEBUG` unset, then call `advisor_status` again and read the newest hook record:

```bash
DIAG=$(node --input-type=module -e "const m = await import('./.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/metrics.js'); console.log(m.advisorHookDiagnosticsPath(process.cwd()))")
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' \
  | env -u SKILL_ADVISOR_DEBUG node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js > /dev/null 2>&1
node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
tail -n 1 "$DIAG"
grep -c 'help me commit my changes' "$DIAG"
```

### Expected Signals

- Live response includes `freshness`, `generation`, `trustState`, `lastGenerationBump`, `lastScanAt`, `skillCount` and `laneWeights`.
- `skillCount` is a nonzero integer that matches discovered `graph-metadata.json` files.
- `lastScanAt` is an ISO timestamp or `null` when no scan has occurred.
- Stale response reports `freshness: "stale"` or a stale trust-state reason such as `SOURCE_NEWER_THAN_SKILL_GRAPH`.
- Absent response reports `freshness: "absent"` when graph sources exist but the artifact/generation state is missing.
- Once at least one hook record exists, the live response carries `hookHealth` with `invocations`, `rollingP95Ms`, `rollingFailOpenRate`, `rollingCacheHitRate`, `rollingDegradedRate` and `lastRecordAt`. The newest record holds no `skillLabel`, no `errorDetails` and no prompt text. The prompt count prints `0`.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Missing `skillCount` | Field absent from JSON | Rebuild the advisor runtime and verify `advisor-status.ts` is current. |
| Missing `lastScanAt` | Field absent from JSON | Rebuild and rerun. Block release if still absent. |
| Transition cannot be simulated | Write sandbox prevents temp copy setup | Mark `SKIP` with sandbox evidence, not `PASS`. |

---

## 4. SOURCE FILES

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/freshness/`
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts`

---

## 5. SOURCE METADATA

- Group: Native Command Surface
- Playbook ID: NC-002
- Canonical root source: manual-testing-playbook.md
- Feature file path: native-cli-tools/native-status-transitions.md
