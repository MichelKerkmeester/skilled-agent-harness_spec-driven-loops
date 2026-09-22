---
title: "Closed Seven-Model Gateway Roster"
description: "Dispatch is fenced to the seven model ids reachable through the operator's `llmgateway` provider block, and the lineage builder rejects any other id before a process is spawned."
trigger_phrases:
  - "closed seven-model gateway roster"
  - "HERMES_SUPPORTED_MODELS"
  - "isHermesModelAllowed"
  - "hermes llmgateway provider"
version: 1.0.0.0
---

# Closed Seven-Model Gateway Roster (HERMES_SUPPORTED_MODELS)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Dispatch is fenced to the seven model ids reachable through the operator's `llmgateway` provider block, and the lineage builder rejects any other id before a process is spawned.

Hermes is a provider pass-through with a wide upstream catalog, so the fence is not a convenience: it is what keeps dispatch inside the one credential kind this machine can share across runtimes.

---

## 2. HOW IT WORKS

The runtime config declares `HERMES_SUPPORTED_MODELS` as `deepseek-v4.1-flash`, `glm-5.3-flash`, `gpt-5.6-luna`, `gpt-5.6-sol`, `minimax-m3`, `mimo-v2.6-pro` and `qwen3.8-max`, exports a matching type, names the DeepSeek literal as the rotation default, and exposes `isHermesModelAllowed` as the type-narrowing predicate over the set. Every id is the bare literals the gateway expects beneath its provider name, not provider-prefixed forms.

The fan-out script carries its own synchronous mirror of the same seven ids, with a comment naming the config as the source it mirrors. The duplication is deliberate: command construction stays fail-closed without importing a TypeScript module. A lineage that names no model takes the default; one that names an id outside the set raises an input error that prints the whole allowlist, and no process is spawned.

The provider name is pinned in the same place, because Hermes resolves `--provider` by a user-defined block name and nothing in the repository can carry that block. The provider, its key variable and the credential file are operator steps; the packet documents them and no dispatch performs them.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Shared | `HERMES_SUPPORTED_MODELS`, `HERMES_DEFAULT_MODEL` and `isHermesModelAllowed`. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Script | `HERMES_ALLOWED_MODELS`, `HERMES_DEFAULT_MODEL`, `HERMES_PROVIDER` and the off-roster rejection. |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md` | Handler | The provider contract, the credential boundary and the roster rationale. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Vitest | Asserts the roster contents, the default and the allowlist predicate. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Vitest | Covers the mirrored allowlist and the off-roster rejection path. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` | Vitest | Checks the executor and model combinations the fan-out treats as valid. |

---

## 4. SOURCE METADATA

- Group: Fan-out dispatch
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `fanout-dispatch/closed-model-roster.md`

Related references:
- [hermes-executor-kind.md](hermes-executor-kind.md) - the builder that enforces this roster.
- [run-budget-and-reasoning-pin.md](run-budget-and-reasoning-pin.md) - the per-model reasoning pin applied after the roster check.
