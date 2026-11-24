---
title: "Definition checker"
description: "Audits a repository's bots/ folder read-only with the runtime's own predicates and names each failed invariant."
trigger_phrases:
  - "definition checker"
  - "bot-check.cjs"
  - "check bot definitions"
  - "/doctor:bots"
version: 1.0.1.0
---

# Definition checker (bot-check.cjs)

## 1. OVERVIEW

Audits a repository's bots/ folder read-only with the runtime's own predicates and names each failed invariant.

A bad definition would otherwise fail only at its first unattended fire, when nobody is watching. The checker runs before anything installs a bot, and it restates no field rule, so it cannot pass a file the runtime would refuse. `/doctor:bots` is the command that runs it.

---

## 2. HOW IT WORKS

Run `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs <checkout-root> [--strict]`. It prints one `PASS|FAIL|INFO: <id>: <message>` line per finding. It exits 0 when every hard invariant passes, 1 on any failure and 2 when the target is missing or the audit cannot finish. `--strict` is accepted and changes nothing, because no advisory invariant is defined, so no `WARN` line prints.

The checker loads the runtime's definition parser, config reader, identity resolver, executor bounds, posture check, cron translator, label grammar, worktree shared-path resolver and delivery channel list. Hard invariants include a missing id or trigger, a duplicate or reserved id, an empty body, an unknown executor kind, the `native` kind, a sandbox the executor kind cannot honor, a timeout out of bounds, an unknown identity, undeclared or invalid isolation, unresolved worktree shared paths and an unknown delivery channel. A parse or config refusal reports as `definition.<reason>` or `config.<reason>`, and a cron refusal reports under the translator's own id, so every refusal the runtime can return gets a name. A folder name that differs from the bot id fails as `folder-id-mismatch`, because the runner and the installer refuse that definition.

The checker only reads. `/doctor:bots` runs it and reports each failed invariant, and the author mode, which grants no Bash, hands the check to that command instead of running it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Script | The read-only checker, its invariant lists and exit codes |
| `.skilled/commands/doctor/bots.md` | Handler | The `/doctor:bots` command that runs the checker |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Shared | The definition predicates the checker imports |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts` | Vitest | One defect fixture per hard invariant, the clean fixture and a folder that differs from its id |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/clean` | Fixture | A repository whose bots pass every invariant |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/isolation-undeclared` | Fixture | A defect fixture for the undeclared isolation invariant |

---

## 4. SOURCE METADATA

- Group: Definition
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `definition/definition-checker.md`

Related references:
- [bot-definition-contract.md](bot-definition-contract.md) - the field rules the checker applies
- [../scheduling/cron-translation.md](../scheduling/cron-translation.md) - the translator whose refusal ids the checker reports
