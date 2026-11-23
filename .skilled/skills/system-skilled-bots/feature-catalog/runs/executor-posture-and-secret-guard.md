---
title: "Executor posture and secret guard"
description: "Refuses before dispatch any isolation or sandbox posture the chosen executor kind cannot honor, and any prompt that carries a known secret literal."
trigger_phrases:
  - "executor posture and secret guard"
  - "bot posture matrix"
  - "posture-unhonorable"
  - "bot secret literal check"
version: 1.0.0.0
---

# Executor posture and secret guard

## 1. OVERVIEW

Refuses before dispatch any isolation or sandbox posture the chosen executor kind cannot honor, and any prompt that carries a known secret literal.

A bot declares how it is isolated and which sandbox class it needs. The posture matrix reads the deep-loop executor tables at run time instead of copying them, so a kind's capability changes in one place. The secret guard runs before any prompt can reach a process table.

---

## 2. HOW IT WORKS

The `native` executor kind is never admitted, because its child inherits the full parent environment and the environment allowlist would not hold. A kind outside the repository's `allowedExecutorKinds` is refused. A kind whose sandbox is only an approval or tool gate is admitted for a read-only posture alone, and only a kind with an OS-level boundary may write. A kind whose output the runner cannot read for the decision marker never dispatches, because a child that asks a question and exits 0 must park. Each refusal names its reason, such as `executor-kind-native`, `posture-unhonorable` or `decision-marker-unreadable`.

The prompt carries the child-dispatch exemption, the bound spec folder and the decision-marker rule. The child's environment passes only through the deep-loop allowlist, and the command line and audited spawn are the deep-loop runtime's own, so a bot run is confined and receipted like a loop iteration.

Known secret values are collected from the environment and the checkout, and the prompt is searched for any of them before dispatch. A body that holds one is refused as `body-secret`, naming the key and never the value. A resumed run's answer gets the same check.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts` | Shared | Posture matrix over the deep-loop executor tables |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Shared | Prompt build, allowlisted environment, secret-literal detector and decision-marker parser |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/posture.vitest.ts` | Vitest | The posture matrix for every executor kind |
| `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts` | Vitest | Secret-literal detector, bot prompt and decision-marker parser |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Vitest | Unhonorable posture and secret-bearing body refused before dispatch |

---

## 4. SOURCE METADATA

- Group: Runs
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `runs/executor-posture-and-secret-guard.md`

Related references:
- [bot-runner.md](bot-runner.md) - the check order these guards sit in
- [worktree-isolation.md](worktree-isolation.md) - the tree a `worktree` posture receives
