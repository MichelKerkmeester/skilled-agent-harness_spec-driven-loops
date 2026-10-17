---
title: "NC-010 Shadow-Delta Sink Opt-In"
description: "Manual validation that advisor_recommend writes a durable shadow-delta record only when the opt-in flag or path is set, and never echoes raw prompt text into the sink."
trigger_phrases:
  - "nc-010"
  - "shadow delta sink"
  - "shadow delta opt-in"
  - "advisor shadow recording"
version: 0.8.1.0
id: NC-010
category: native_cli_tools
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# NC-010 Shadow-Delta Sink Opt-In

Prompt: Manual validation that advisor_recommend writes a durable shadow-delta record only when the opt-in flag or path is set, and never echoes raw prompt text into the sink.


---

## 1. OVERVIEW

Validate that `advisor_recommend` keeps shadow-delta comparison response-visible while durable recording stays default-off. The handler calls the sink only when `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` is set or `SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED=1` / `true`, and the recorded prompt field is an HMAC digest rather than raw prompt text.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- Advisor runtime built. Daemon reachable.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` unset.
- Use a disposable workspace copy or a scratch sink path so the live `runtime/data/shadow-deltas.jsonl` file is not mutated.

---

## 3. TEST EXECUTION

### Commands

1. Confirm default-off behavior. With both `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` and `SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED` unset, call:

```text
node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "build a typescript handler with vitest coverage" --options '{"topK":3}' --format json
```

2. Inspect the response envelope and confirm no new shadow-delta file was written for this call.

3. Enable the sink at a scratch path under the workspace root and re-run:

```bash
SPECKIT_ADVISOR_SHADOW_DELTA_PATH=/tmp/skill-advisor-playbook/shadow-deltas.jsonl node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "build a typescript handler with vitest coverage" --options '{"topK":3}' --format json
```

4. Read the scratch JSONL file and inspect each record's `prompt` field.

5. Run the shadow-sink contract test:

```bash
cd .skilled/skills/system-skill-advisor/runtime && npm exec -- vitest run tests/shadow-sink.vitest.ts --reporter=default
```

### Expected

- With the flag and path unset, `shadowDeltaSinkEnabled()` is false and no durable JSONL record is written.
- With `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` set under the workspace root, one JSONL record per shadow recommendation is appended to the scratch path.
- Each written record's `prompt` field is an `hmac:` digest, not raw prompt text.
- A `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` that resolves outside the workspace root is rejected with an error and no write.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Durable write with the flag off | A new JSONL record appears when no path or enable flag is set | Inspect `shadowDeltaSinkEnabled()` in `lib/shadow/shadow-sink.ts`. |
| Raw prompt text in the sink | Record `prompt` field is not an `hmac:` digest | Block release. Audit the `recordShadowDelta` call site in `handlers/advisor-recommend.ts`. |
| Out-of-workspace path accepted | A path outside the workspace root writes a file | Inspect `resolveShadowDeltaPath` boundary check. |

### Evidence

- Capture each command's output and exit status.
- Record each flag and path value, the `shadowDeltaSinkEnabled()` result, sink file state, shadow recommendation count and appended record count.
- Record each written record's `prompt` digest and the rejected-path error and no-write result.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- `.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`
- Feature [`cli-surface/advisor-recommend.md`](../../feature-catalog/cli-surface/advisor-recommend.md).

---

## 5. SOURCE METADATA

- Group: Native Command Surface
- Playbook ID: NC-010
- Canonical root source: manual-testing-playbook.md
- Feature file path: native-cli-tools/shadow-delta-sink.md

