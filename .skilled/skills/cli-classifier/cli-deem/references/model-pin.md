---
title: "Deem Model Pin and Commit Pair"
description: "Why deem-0.8-v1 is only a launch label, how the commit pair names the weights and when a result measured on Deem must be requalified."
trigger_phrases:
  - "deem model pin"
  - "deem commit pair"
  - "deem requalification"
  - "deem-0.8-v1 label"
importance_tier: "important"
contextType: "general"
version: 0.1.0.0
---

# Deem Model Pin and Commit Pair

Why `deem-0.8-v1` is only a launch label, how the commit pair names the weights and when a result measured on Deem must be requalified.

---

## 1. OVERVIEW

### Purpose

A caller that keeps a Deem result needs to know which weights produced it. The model id cannot answer that, because it stays the same across every update. This reference defines the two names the client reports and the rule for reusing a result after the weights change.

### Core Principle

The model id says which server is on the port. The commit pair says which weights answered.

---

## 2. THE MODEL ID

`deem-0.8-v1` is the label `deem-ctl` passes to the server at launch. It survives every update, so it never counts as provenance on its own.

The client still checks it. `health` and every answer envelope must carry `deem-0.8-v1`. Any other id exits 3. That check catches two cases:

| Case | What the server reports |
|---|---|
| A Deem server started without the pinned id | `deem-1.5`, the server's own default |
| A different server holding port 8300 | whatever id it chose |

---

## 3. THE COMMIT PAIR

`health` prints the pair beside the model id.

| Name | Read from | Changes when |
|---|---|---|
| Model commit | the basename of the `~/.local/share/deem/models/current` link, a Hugging Face commit | a new checkpoint is published and installed |
| Source commit | `git -C ~/.local/share/deem/src rev-parse HEAD` | the server source moves on GitHub `main` |

The install was measured on model commit `8cbabbb` with source commit `6755b30`. A later release changes one or both. `deem-ctl status` prints the pair the server runs now.

`health` exits 2 and names the missing path when either the link or the source checkout is gone. That means the install is broken, not that the server is down.

---

## 4. REQUALIFICATION

A result measured on Deem survives an update only by requalification on its commit pair.

1. **Record the pair.** Every kept result carries the model id and the commit pair `health` printed when it was measured.
2. **A keep holds for its pair.** Reusing it on the same pair needs nothing more.
3. **A new pair requalifies.** When the pair changes, the feature reruns its keep rule in full on the same inputs before any further use. A changed pair is not a failure.
4. **A mid-run change stops the run.** A run that sees the pair change partway stops. Its finished rows count as partial.
5. **A worse release is rolled back.** A release that fails requalification is the operator's to roll back with `deem-ctl rollback`, which holds it until a newer one lands.

---

## 5. RELATED RESOURCES

- [`deem-ctl-lifecycle.md`](./deem-ctl-lifecycle.md): updates, the schedule and rollback.
- [`wire-contract.md`](./wire-contract.md): the answer envelope that carries the model id.
- [`../SKILL.md`](../SKILL.md): the `health` checks and exit codes.
