---
title: "system-skilled-bots checker fixtures"
description: "One clean bots folder and one single-defect copy per hard invariant, used to prove bot-check.cjs fails each invariant by name."
trigger_phrases:
  - "bot-check fixtures"
  - "bots checker defect fixtures"
---

# system-skilled-bots / scripts / fixtures

---

## 1. OVERVIEW

Each folder here is a miniature repository holding a bots folder with a config file and one or two BOT.md definitions. The `clean` folder passes `../bot-check.cjs` with exit 0. Every other folder injects exactly one defect into a copy of `clean` and must fail with exit 1 and a `FAIL:` line naming its hard invariant.

`../../runtime/tests/bot-check.vitest.ts` enforces two rules over this folder. The set of folders must equal `clean` plus `routine-clean` plus one folder per hard invariant, so a new invariant cannot land without its fixture. Each defect folder must differ from `clean` by one added or changed file, with at most two changed lines.

`routine-clean` is a second clean checkout with two routine bots and one plain bot, and each `routine-*` defect differs from `routine-clean`, not from `clean`, by one changed file.

---

## 2. DIRECTORY TREE

Every folder has the shape of `clean` or `routine-clean`. Only `duplicate-id` adds a file.

```text
fixtures/
├── clean/
│   └── bots/
│       ├── config.json
│       └── nightly-digest/
│           └── BOT.md
├── duplicate-id/
│   └── bots/
│       ├── config.json
│       ├── nightly-digest/
│       └── nightly-digest-copy/
├── routine-clean/
│   └── bots/
│       ├── config.json
│       ├── digest/
│       ├── nightly-report/
│       └── plain/
├── bad-budget/
├── cron-untranslatable/
├── delivery-channel-unknown/
├── empty-body/
├── executor-kind-native/
├── identity-invalid/
├── isolation-invalid/
├── isolation-undeclared/
├── missing-id/
├── missing-trigger/
├── no-identity/
├── posture-unhonorable/
├── reserved-id/
├── routine-floor/
├── routine-starts-cron-not-first/
├── routine-starts-empty/
├── routine-starts-multiple/
├── routine-starts-multiple-cron/
├── routine-tell-with-targets/
├── routine-trigger-conflict/
├── routine-until-check-without-outcome/
├── routine-until-shell-metacharacters/
├── timeout-over-bound/
├── unknown-executor-kind/
├── unknown-trigger-kind/
└── worktree-shared-paths-unresolved/
```

---

## 3. FIXTURE MAP

The clean bot is `nightly-digest`: a `cron` trigger at `0 9 * * *`, the `cli-codex` runtime, a budget of 4 iterations and 600 seconds, `shared` isolation and `local-only` delivery. Its config declares the identity `local/tool`.

| Folder | Hard invariant it fails |
|---|---|
| `missing-id/` | `definition.missing-id` |
| `duplicate-id/` | `duplicate-id` |
| `missing-trigger/` | `definition.missing-trigger` |
| `unknown-trigger-kind/` | `definition.trigger-kind-invalid` |
| `empty-body/` | `definition.empty-body` |
| `unknown-executor-kind/` | `runtime-kind-unknown` |
| `bad-budget/` | `definition.budget.maxIterations-invalid` |
| `timeout-over-bound/` | `budget.timeoutSeconds-out-of-bounds` |
| `cron-untranslatable/` | `cron-reboot` |
| `no-identity/` | `identity-missing` |
| `identity-invalid/` | `config.identity-invalid` |
| `isolation-undeclared/` | `isolation-undeclared` |
| `isolation-invalid/` | `definition.isolation-invalid` |
| `worktree-shared-paths-unresolved/` | `worktree-shared-paths-unresolved` |
| `delivery-channel-unknown/` | `delivery-channel-unknown` |
| `reserved-id/` | `reserved-id` |
| `executor-kind-native/` | `executor-kind-native` |
| `posture-unhonorable/` | `posture-unhonorable` |
| `routine-clean/` | none, it passes |
| `routine-trigger-conflict/` | `definition.routine-trigger-conflict` |
| `routine-tell-with-targets/` | `definition.routine-tell-with-targets` |
| `routine-starts-empty/` | `definition.routine-starts-empty` |
| `routine-starts-multiple-cron/` | `definition.routine-starts-multiple-cron` |
| `routine-starts-cron-not-first/` | `definition.routine-starts-cron-not-first` |
| `routine-starts-multiple/` | `definition.routine-starts-multiple` |
| `routine-until-check-without-outcome/` | `definition.routine-until-check-without-outcome` |
| `routine-until-shell-metacharacters/` | `definition.routine-until-shell-metacharacters` |
| `routine-floor/` | `routine-floor-15-minutes` |

`no-identity` passes once an identity is set. The suite checks that too, in a temp repository with no remote.

---

## 4. VALIDATION

Run from the repository root. This example checks one defect fixture on a copy outside this checkout, so identity never comes from this repository's remote.

```bash
tmp="$(mktemp -d)" && cp -R .skilled/skills/system-skilled-bots/scripts/fixtures/reserved-id/bots "$tmp/" && git -C "$tmp" init -q && node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs "$tmp"
```

Expected result: exit 1, with this line among the output.

```text
FAIL: reserved-id: bots/nightly-digest/BOT.md: id drain is reserved for the repository's own agent
```

The full fixture matrix runs as `bot-check.vitest.ts` inside the runtime suite.

---

## 5. RELATED

- [Definition checker](../README.md)
- [Runtime tests](../../runtime/tests/README.md)
- [Runtime library](../../runtime/lib/README.md)
