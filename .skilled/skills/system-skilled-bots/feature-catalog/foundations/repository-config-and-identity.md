---
title: "Repository config and identity"
description: "Reads the per-repository bots/config.json policy and resolves the repository identity that keys every label, queue and state folder."
trigger_phrases:
  - "repository config and identity"
  - "bots config.json"
  - "bot repository identity"
  - "identity-unknown refusal"
version: 1.0.0.0
---

# Repository config and identity (bots/config.json)

## 1. OVERVIEW

Reads the per-repository bots/config.json policy and resolves the repository identity that keys every label, queue and state folder.

Every other module takes its policy and its identity from these two readers, so the checker, the runner, the queue, the installer and the status index never parse the file themselves or disagree on a default. A repository with no remote and no declared identity is refused, never given a fallback key, because two such repositories would otherwise share one state folder.

---

## 2. HOW IT WORKS

### Config Reading

A consumer repository keeps its bot policy in `bots/config.json`. A missing file is a valid state and yields the defaults. An unreadable or malformed file is a refusal with a named reason, never a silent fall back to defaults, because a typo in a policy file must not quietly widen what an unattended run may do. The file can restrict which executor kinds a bot may use, move the user-level state root, set a default isolation, declare an `owner/name` identity, opt in to git-hook triggers, set the needs-you expiry and bound retention. It can also replace the list of paths a bot worktree links from the main checkout.

### Defaults

Git-hook triggers stay off unless the file opts in. A needs-you item expires after seven days by default. Retention bounds the status index rows per identity, the run folders kept per bot, the skipped slots listed per summary and the closed needs-you items kept per identity, each with a fixed default.

### Identity Resolution

An installed job pins the identity it was installed under in `SKILLED_BOTS_IDENTITY`, and that value wins over the config, because a run with write access could edit `bots/config.json` to move every lookup under another identity's empty folders. A pinned value that is not `owner/name` is refused as `identity-unknown` rather than skipped. Outside a job, the declared `identity` field in the config wins. Without it the resolver asks the shared repository-identity module, which reads the environment and then the origin remote. When neither answers, resolution returns the refusal `identity-unknown`. Install and enqueue both call one guard that reads the config itself and refuses while the identity is unknown, so no caller can skip the declared identity.

### Identity Key

Every state folder name comes from the identity through one key function, so two checkouts of the same origin resolve to the same queue, leases and records.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts` | Shared | The one reader of `bots/config.json`: field parsing, defaults and named refusals |
| `.skilled/skills/system-skilled-bots/runtime/lib/identity.ts` | Shared | Resolves identity from a job's pinned value, then the config and then the shared resolver, refusing an unknown identity |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/repo-config.vitest.ts` | Vitest | Missing, malformed and valid config files with their defaults |
| `.skilled/skills/system-skilled-bots/runtime/tests/identity.vitest.ts` | Vitest | Shared resolver shape, the identity guard and two checkouts of one origin |
| `.skilled/skills/system-skilled-bots/runtime/tests/identity-refusal.vitest.ts` | Vitest | Enqueue refuses while the repository identity is unknown |

---

## 4. SOURCE METADATA

- Group: Foundations
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `foundations/repository-config-and-identity.md`

Related references:
- [state-layout.md](state-layout.md) - where the identity keys the user-level state folders
- [../definition/bot-definition-contract.md](../definition/bot-definition-contract.md) - the per-bot file the config sets defaults for
