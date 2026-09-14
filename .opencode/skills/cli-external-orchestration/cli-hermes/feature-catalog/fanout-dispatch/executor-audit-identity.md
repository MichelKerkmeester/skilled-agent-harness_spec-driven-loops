---
title: "Executor Audit Identity And Environment Scoping"
description: "The audit layer gives `cli-hermes` its binary name, its self-presence session variable, its state-directory and home overrides, and the environment prefixes a dispatched child may inherit."
trigger_phrases:
  - "executor audit identity and environment scoping"
  - "HERMES_SESSION_ID self presence"
  - "SPECKIT_HERMES_STATE_DIR"
  - "hermes dispatch environment prefixes"
version: 1.0.0.0
---

# Executor Audit Identity And Environment Scoping

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The audit layer gives `cli-hermes` its binary name, its self-presence session variable, its state-directory and home overrides, and the environment prefixes a dispatched child may inherit.

Every executor kind has to answer the same four questions about itself before the fan-out can audit it. This is where Hermes answers them.

---

## 2. HOW IT WORKS

### Identity And Self-Presence

The audit tables name `hermes` as the kind's binary and `HERMES_SESSION_ID` as its self-presence variable. Hermes exports that variable into its own process environment at agent initialization and its terminal tool passes it into every child, so a shell hosted by Hermes carries the signal, which is what lets the guard refuse a Hermes dispatch launched from inside Hermes. The kind is not self-presence exempt: because Hermes has in-process delegation of its own, the ancestry and lockfile guards apply to it as they do to the other kinds.

### State And Home

`SPECKIT_HERMES_STATE_DIR` and `HERMES_HOME` are the kind's state-scoping variables, and `.hermes` is its runtime dotfolder. The fan-out reads the same state-directory variable name when it scopes a lineage's state, so the two layers agree without either hard-coding the other's string.

### Environment Pass-Through

A dispatched child inherits only the `HERMES_` and `LLMGATEWAY_` prefixes. The gateway prefix is shared with the sibling kind that already reaches the same provider, and the Hermes prefix covers the runtime's own settings. Hermes loads its own credential file from the user home, so a key kept there needs no pass-through at all.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Shared | Binary name, self-presence variable, state and home variables, dotfolder, and env prefixes for `cli-hermes`. |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Script | Reads the kind's state-directory variable when scoping a lineage. |
| `.opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md` | Handler | The self-invocation guard that consumes the session-variable signal. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Vitest | Asserts per-kind identity and configuration entries stay complete. |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Vitest | Covers lineage state scoping and dispatch environment composition. |

---

## 4. SOURCE METADATA

- Group: Fan-out dispatch
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `fanout-dispatch/executor-audit-identity.md`

Related references:
- [hermes-executor-kind.md](hermes-executor-kind.md) - the builder whose output this identity describes.
- [run-budget-and-reasoning-pin.md](run-budget-and-reasoning-pin.md) - the bounds applied to the same lineage.
