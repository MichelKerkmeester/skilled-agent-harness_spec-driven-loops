---
title: "Design: the apps refusals, their detail text and their precedence"
description: "The six names this phase adds with the layer, class, exit and registry entry the packet contract fixes, the exact detail string each carries, which refusal wins when two apply and what the operator sees on stderr, in the record and in the checker."
trigger_phrases:
  - "apps refusal catalogue"
  - "apps-refused detail"
  - "apps-unenforceable"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The apps refusals, their detail text and their precedence

The packet's refusal contract owns the layer, the failure class, the exit code and the registry entry for every name the packet adds, and its section 3.6 is this phase's row set. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.6 Phase 007, per-bot apps"] This file owns what that contract does not: the exact detail string, the order the checks run in and which name wins when two could apply.

Six names are in play. Two are run refusals that enter the registry, one is a checker invariant, one is a parse name and two are details of a run refusal.

| Name | Layer | Class | Exit | In `REFUSAL_CAUSES` | Section |
|------|-------|-------|------|---------------------|---------|
| `apps-invalid` | definition parse | none | 4 at run time, 1 in the checker | no | 1 |
| `apps-unknown-server` | checker invariant, and a detail of `apps-refused` at run time | none | 1 in the checker | no | 2 |
| `apps-refused` | run refusal | `author` | 4 | yes | 3 |
| `apps-unenforceable` | run refusal | `author` | 4 | yes | 4 |
| `utcp-config-missing` | detail of `apps-refused` | `author` | 4 | no | 5 |
| `utcp-config-invalid` | detail of `apps-refused` | `author` | 4 | no | 5 |

The registry ends at 37 causes and this phase adds two of them. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "4. THE REGISTRY AFTER THE PACKET"]

---

## 1. `apps-invalid`

A parse name, so it never reaches the registry. The runner folds it into `definition-malformed` and the checker prints it as `definition.apps-invalid`.

| Property | Value |
|----------|-------|
| Raised by | the `apps` predicate in `definition.ts` |
| Raised when | the value is not a list, or an entry is not a non-empty string |
| Detail, not a list | `apps: expected a list of server names` |
| Detail, a bad entry | `apps: entry <index> is not a non-empty string` |
| Run record | cause `definition-malformed`, detail `apps-invalid: <detail>` |
| Checker line | `FAIL: definition.apps-invalid: bots/<id>/BOT.md: <detail>` |
| Exit | 4 at run time, 1 in the checker |

The detail names the index and never the value, because a value that is not a string has no printable form the operator can act on. An entry that is a string of spaces is not trimmed and is not empty, so it passes the parse and fails the name check as `apps-unknown-server`. That is deliberate: the parser checks the shape and the resolver checks the name.

---

## 2. `apps-unknown-server`

One name, two layers. The checker prints it as a hard invariant. The runner records it as the detail of `apps-refused`, because a run refusal has one cause and the cause is `apps-refused`.

| Property | Value |
|----------|-------|
| Raised by | `resolveApps` in `apps.ts` |
| Raised when | at least one declared name is not a `manual_call_templates[].name` in the checkout's `.utcp_config.json` |
| Detail | the unknown names, comma separated, in declaration order, each in backticks |
| Checker line | `FAIL: apps-unknown-server: bots/<id>/BOT.md: <names>` |
| Checker exit | 1 |
| Run record | cause `apps-refused`, detail `apps-unknown-server: <names>` |
| Run exit | 4 |

The match is exact and case-sensitive. `GitHub` is not `github`, so it is refused rather than folded to the config's spelling. A name that is a prefix of another is a different name, so `chrome_devtools` is refused when the config holds `chrome_devtools_1` and `chrome_devtools_2`. A duplicate declaration is not an error: the name resolves once and the honored list holds it once, because the honored list is the config's order and not the declaration's.

The refusal names every unknown name and never only the first, so one check tells the author everything to fix. A name the config does hold is never named in the detail, so the message cannot be read as a complaint about a correct entry.

---

## 3. `apps-refused`

The one run refusal for a declaration the run cannot honor. It enters the registry with class `author`, because the bot author wrote the declaration.

| Property | Value |
|----------|-------|
| Raised by | `runBot`, after the posture check and before the worktree |
| Raised when | `resolveApps` refused, which is a missing config, a malformed config or an unknown name |
| Detail | the module's reason and its detail, joined as `<reason>: <detail>` |
| Run record | cause `apps-refused`, class `author`, `refusal.detail` the joined string |
| Exit | 4 |
| Writes | no `<runFolder>/utcp.json` and no worktree copy |

The refusal is a refusal and never a run failure, so a scheduler can tell "did not start" from "broke". That is the runner's existing rule for every stop before dispatch. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:10]

The run folder exists by the time this refusal is raised, because the runner resolves it before the posture check. The folder holds the ledger and the observability stream and no `utcp.json`, so a reader that finds no `utcp.json` in a refused run's folder reads the refusal and not a missing write.

---

## 4. `apps-unenforceable`

The refusal for a declaration the run has nowhere to place. It enters the registry with class `author`.

| Property | Value |
|----------|-------|
| Raised by | `runBot`, after the posture check and before the config read |
| Raised when | `Posture.apps` is not `null` and the resolved isolation is not `worktree` |
| Detail | `apps is declared and isolation is <isolation>, so a filtered config needs a worktree` |
| Run record | cause `apps-unenforceable`, class `author`, `refusal.detail` the string above |
| Exit | 4 |
| Writes | no `<runFolder>/utcp.json` and no worktree copy |

The check reads the resolved isolation and not the declared one, so a bot that omits `isolation` and inherits `shared` from `bots/config.json` is refused the same way. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts:28]

The refusal exists because a shared run's working directory is the checkout, and a filtered file written into the checkout would dirty the operator's tree with no restore to undo it. Refusing is the loud failure the alternative lacks.

---

## 5. `utcp-config-missing` AND `utcp-config-invalid`

Two details of `apps-refused`, never registry entries. They are the reason the config could not be read, and the operator acts on them differently from an unknown name.

| Name | Raised when | Detail |
|------|-------------|--------|
| `utcp-config-missing` | `<checkout>/.utcp_config.json` does not exist | `utcp-config-missing: <absolute path>` |
| `utcp-config-invalid` | the file does not parse as JSON, or `manual_call_templates` is not a list | `utcp-config-invalid: <the parse message>` |

Both are raised only when `apps` is declared. A bot that declares nothing never reads the config, so a checkout with no `.utcp_config.json` runs a bot that declares no server. That is the fail-closed default doing its job: no declaration means no server, and no server means nothing to check.

A config whose `manual_call_templates` is absent is not invalid. It holds no name, so every declared name is unknown and the refusal is `apps-unknown-server`. That keeps one rule for "the config does not hold this name" rather than two.

---

## 6. PRECEDENCE

When two refusals could apply, the earlier check wins. The order is the gate order in `state-machines.md` section 2.

| Order | Check | Wins over |
|-------|-------|-----------|
| 1 | the definition parse | every later check, because no posture exists yet |
| 2 | the posture check | the apps checks, because the isolation is not resolved yet |
| 3 | `apps-unenforceable` | the config read, because the isolation is the reason the operator can act on |
| 4 | `utcp-config-missing` | `utcp-config-invalid` and `apps-unknown-server`, because there is no file to parse |
| 5 | `utcp-config-invalid` | `apps-unknown-server`, because there is no list to compare |
| 6 | `apps-unknown-server` | nothing later, it is the last apps check |

Two consequences a builder must not undo:

- A shared bot that declares `apps` and whose checkout has no config is refused `apps-unenforceable` and not `apps-refused`. The isolation is the first thing wrong.
- A bot that declares `apps: []` is never refused `apps-refused`. An empty list resolves to no name, so no name can be unknown, and the run writes a config with no server. On a shared run it is still refused `apps-unenforceable`, because the declaration is not `null` and the run has nowhere to place the file.

---

## 7. WHAT THE OPERATOR SEES

| Surface | Text | Exit |
|---------|------|------|
| `bots run <id>` on stderr | `bots: apps-refused: apps-unknown-server: nosuchserver` | 4 |
| `bots run <id>` on stderr | `bots: apps-unenforceable: apps is declared and isolation is shared, so a filtered config needs a worktree` | 4 |
| the run record | `exit.reason` `apps-refused`, `exit.class` `author`, `exit.refusal.cause` `apps-refused`, `exit.refusal.detail` the joined string | recorded |
| `bot-check.cjs` on stdout | `FAIL: apps-unknown-server: bots/nightly-digest/BOT.md: nosuchserver` | 1 |
| `bot-check.cjs` on stdout, a malformed declaration | `FAIL: definition.apps-invalid: bots/nightly-digest/BOT.md: apps: expected a list of server names` | 1 |

The stderr form is the CLI's existing `bots: <reason>: <detail>` shape, so no verb changes and no new line format is introduced. [SOURCE: .skilled/bin/bots.cjs:213]

---

## 8. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| `apps-unknown-server` is one name at two layers | The checker's invariant id and the module's reason are the same fact, and a second spelling would make a search for one miss the other |
| The run cause is `apps-refused` and never `apps-unknown-server` | A run refusal has one cause and the registry is a closed set, so the module's reason is the detail |
| The detail names every unknown name | One check tells the author everything to fix, and a message that names one name per run costs a run per typo |
| The detail names the index and not the value for a bad entry | A value that is not a string has no printable form the operator can act on |
| `apps-unenforceable` is checked before the config is read | The isolation is the reason the operator can act on, and a config problem would send them to the wrong file |
| A config with no `manual_call_templates` is `apps-unknown-server` and not `utcp-config-invalid` | One rule for "the config does not hold this name" beats two, and the author's fix is the same either way |
