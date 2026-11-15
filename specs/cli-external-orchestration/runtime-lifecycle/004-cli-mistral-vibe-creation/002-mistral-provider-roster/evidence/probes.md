---
title: "Evidence: Mistral route probes"
description: "Live replies for the two Mistral ids on OpenCode 2.3.0 and Pi 1.5.2, with same-run controls, captured 2026-11-14."
trigger_phrases:
  - "mistral route probe evidence"
importance_tier: "normal"
contextType: "implementation"
---
# Evidence: Mistral route probes

Every probe sent `Reply with exactly the word OK and nothing else.` through the child envelope (`SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`, stdin from `/dev/null`).

## OpenCode 2.3.0, `opencode run --standalone --format json`

| Model | Reply | Cost and tokens |
|---|---|---|
| `mistral/deepseek-v4-1-flash-1017` | `OK` | $0.004883, 16,261 in, 2 out |
| `mistral/zai-glm-5-3-flash` | `OK` | $0.002423, 16,084 in, 20 out |
| `llmgateway/deepseek-v4.1-flash-1017` (control) | `OK` | $0.002512, 16,737 in, 3 out |
| `mistral/deepseek-v4-1-flash-1017#max` | `OK` | $0.004995, 16,286 in, 89 out |
| `mistral/zai-glm-5-3-flash#max` | `OK` | $0.002422, 16,084 in, 18 out |
| `mistral/deepseek-v4-1-flash-1017#ultra` | exit 1 | `provider.no-route`: `Variant unavailable for mistral/deepseek-v4-1-flash-1017: ultra` |

The DeepSeek cost per input token is twice the control's, matching Mistral's $0.30 list rate against DevPass's $0.15.

## Pi 1.5.2, `pi -p --no-session --mode text --offline`

With the stored credential:

| Model | Result |
|---|---|
| `mistral/deepseek-v4-1-flash-1017 --thinking high` | exit 1, `Mistral API error (401): {"detail":"Invalid API Key"}` |
| `mistral/zai-glm-5-3-flash --thinking high` | exit 1, same 401 |
| `llmgateway/deepseek-v4.1-flash-1017 --thinking low` (control) | exit 0, `OK` |

The control passing in the same run places the failure on the Mistral credential. The stored `mistral` key in `~/.pi/agent/auth.json` begins with `/va` and is 114 characters, the shape of a pasted file path. OpenCode's Mistral key begins with `mst`.

With OpenCode's Mistral key passed per run as `--api-key`, the stored file untouched:

| Model | Reply |
|---|---|
| `mistral/deepseek-v4-1-flash-1017 --thinking max` | exit 0, `OK` |
| `mistral/deepseek-v4-1-flash-1017 --thinking off` | exit 0, `OK` |
| `mistral/zai-glm-5-3-flash --thinking max` | exit 0, `OK` |
| `mistral/zai-glm-5-3-flash --thinking xhigh` | exit 0, `OK` |
