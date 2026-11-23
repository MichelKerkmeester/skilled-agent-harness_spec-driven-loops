---
title: "system-skilled-bots scripts"
description: "Read-only BOT.md definition checker that audits a repository's bots folder with the runtime's own predicates, plus its defect fixtures."
trigger_phrases:
  - "bot-check.cjs"
  - "bots definition checker"
version: 1.0.0.0
---

# system-skilled-bots / scripts

---

## 1. OVERVIEW

This folder holds `bot-check.cjs`, the audit a repository's bots folder passes before anything installs it. A bad BOT.md would otherwise fail only at its first unattended fire. The checker loads the runtime's TypeScript modules through the runtime's own `tsx` and calls the same parser, config reader, identity resolver, executor bounds, cron translator, label grammar, worktree path resolver and delivery channel list the runner and installer use. It restates no field rule, so it cannot pass a file the runtime would refuse.

The checker only reads. It writes no state, installs nothing and never dispatches a bot.

---

## 2. DIRECTORY TREE

```text
scripts/
├── bot-check.cjs   # The definition checker CLI
└── fixtures/       # One clean bots folder plus one folder per hard invariant
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `bot-check.cjs` | Audits every BOT.md under the target checkout's bots folder and the repository config beside them. Exports `HARD_INVARIANTS` and `ADVISORY_INVARIANTS` for the test suite. The advisory list is empty. |
| `fixtures/` | Defect fixtures, one per hard invariant, described in [`fixtures/README.md`](fixtures/README.md). |

---

## 4. ENTRYPOINT

```bash
node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs <checkout-root> [--strict]
```

| Part | Contract |
|---|---|
| Output | One `PASS`, `FAIL` or `INFO` line per finding, in the form `<status>: <id>: <message>`. `WARN` is kept for an advisory finding, and none is defined, so no `WARN` line prints. |
| Exit 0 | Every hard invariant passes. |
| Exit 1 | At least one hard invariant fails. |
| Exit 2 | The target is missing or the audit cannot finish. |
| `--strict` | Accepted and changes nothing, because no advisory invariant is defined. It would turn an advisory `WARN` into `FAIL` and never changes a hard failure. |

The hard invariants are `definition.missing-id`, `duplicate-id`, `definition.missing-trigger`, `definition.trigger-kind-invalid`, `definition.empty-body`, `runtime-kind-unknown`, `definition.budget.maxIterations-invalid`, `budget.timeoutSeconds-out-of-bounds`, `cron-reboot`, `identity-missing`, `config.identity-invalid`, `isolation-undeclared`, `definition.isolation-invalid`, `worktree-shared-paths-unresolved`, `delivery-channel-unknown` and `reserved-id`. Any other parse, config or cron refusal reports under its own named reason. A folder whose name differs from its bot id fails as `folder-id-mismatch`, because the runner and the installer refuse that definition.

---

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | Loads `../runtime/lib/` modules through the `tsx` in `../runtime/`. Holds no field rule of its own. |
| Writes | None. The checker writes nothing to the state root or the checkout. |
| Identity | Resolves from the target checkout's remote or its declared config identity. Run it on a copy outside this repository to keep this checkout's remote out of the answer. |

---

## 6. VALIDATION

Run from the repository root. This example copies the clean fixture into a temp repository with no remote, then checks it.

```bash
tmp="$(mktemp -d)" && cp -R .skilled/skills/system-skilled-bots/scripts/fixtures/clean/bots "$tmp/" && git -C "$tmp" init -q && node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs "$tmp"
```

Expected result, exit 0:

```text
PASS: config: bots/config.json reads cleanly
PASS: identity: local/tool (from config)
PASS: definition: bots/nightly-digest/BOT.md parses as nightly-digest
PASS: executor-bounds: bots/nightly-digest/BOT.md: runtime native within the executor's bounds
PASS: isolation: bots/nightly-digest/BOT.md: shared
PASS: schedule: bots/nightly-digest/BOT.md: "0 9 * * *" translates to 1 calendar dictionaries
PASS: label: bots/nightly-digest/BOT.md: com.skilled.bots.local_2ftool.nightly-digest.0
```

`../runtime/tests/bot-check.vitest.ts` runs the checker on every fixture and is part of the runtime suite.

---

## 7. RELATED

- [Skill README](../README.md)
- [Checker fixtures](fixtures/README.md)
- [Runtime library](../runtime/lib/README.md)
- [Runtime tests](../runtime/tests/README.md)
- [Bot definition reference](../bots-author/references/bot-definition.md)
