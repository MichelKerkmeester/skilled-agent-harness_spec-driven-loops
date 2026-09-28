---
title: "Implementation Plan: cli-classifier Hub with the cli-deem Client"
description: "A new cli-classifier hub root (proposed) with one transport mode, cli-deem (proposed): a dependency-free Node client that translates jev-style flags into Deem's request shape, returns jev-cli's answer shape and implements the stub-refusing Deem check as cli-deem health. Fake-server tests first, then the orchestrator's one live health call."
trigger_phrases:
  - "cli-classifier hub plan"
  - "cli-deem client plan"
  - "cli-deem fake server tests"
  - "deem check health plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cli-classifier Hub with the cli-deem Client

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES module (`cli-deem.mjs`, proposed) using only `node:` built-ins (`http`, `fs`, `child_process` for the source commit, `process`). JSON and Markdown for the hub files |
| **Framework** | The parent-hub canon checked by `.skilled/commands/doctor/scripts/parent-skill-check.cjs`. The local Deem server's HTTP API at `127.0.0.1:8300` |
| **Storage** | None. The client writes nothing. The commit pair is read from `~/.local/share/deem/` |
| **Testing** | `node --test` on `cli-deem/scripts/tests/cli-deem.test.mjs` (proposed) against an in-test fake server on an ephemeral port, `parent-skill-check.cjs` on the hub, a two-stage route replay, `sync-skills-hermes.cjs --check` and `git status --porcelain` |

### Overview

The phase mints `.skilled/skills/cli-classifier/` (proposed) as a parent hub with one transport mode, `cli-deem` (proposed). The mode's script takes `jev`-like flags, posts Deem's own request shape to the local server and prints `jev-cli`'s answer shape, so an arm written for `jev` output reads Deem output with no second parser. `cli-deem health` is the Deem half of the parent goal's D1. The source is `../007-classifier-deep-research/research/research.md` section 14 (`### 008-cli-classifier-hub (new)`), section 12 (`### R23.` and the shared two-backend gate contract) and section 3 (the wire, the Deem check and the lifecycle).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A parent hub with one nested transport packet, the pattern `parent-skill-check.cjs` audits: one advisor identity at the hub, one `modes[]` entry per packet with `packetKind` `transport`, and no second skill-shaped `graph-metadata.json` below the root (`parent-skill-check.cjs:268-275`). The packet's script is a thin client, one file with no dependency. `cli-jev`'s hub is the shape to copy for the root files, and it stays untouched.

### Key Components

- **Hub root**: `SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json` (one mode `cli-deem`, `packetKind` `transport`, a read-only `toolSurface`), `hub-router.json`, `graph-metadata.json`, `description.json`, a generated `leaf-manifest.json`, `changelog/`, `manual-testing-playbook/` and `benchmark/`. The last two are not in the synthesis's file list, and `parent-skill-check.cjs:1119-1129` fails without them. Every doc goes through sk-doc (D6 of the parent goal).
- **`cli-deem/SKILL.md`**: the transport contract. Subcommands, flags, exit codes and the rule that callers spawn the binary and keep their own switches.
- **`cli-deem/feature-catalog/`**: the packet's feature catalog through `sk-create-feature-catalog`, one entry per subcommand, where `cli-jev` keeps its transport's catalog.
- **Generated copies**: `sync-skills-hermes.cjs` writes `.hermes/skills/cli-classifier/SKILL.md` and `.hermes/skills/cli-deem/SKILL.md` from the two new `SKILL.md` files. The route-remint gate writes an activation manifest only for a hub in `compiled-route-guard.cjs`'s `HUBS` list, which `cli-classifier` is not (`spec.md` Files to Change).
- **`cli-deem/references/`**: three files. The wire: section 3's request and answer fields, the caps (26 options, 64 questions, 8 MiB body), the one-request lock and the no-key rule. The lifecycle: `deem-ctl` install, `start`, `stop`, `status`, `update`, `update --check` and `rollback` with its hold, quoted from `deem-local.md` and never reimplemented. The model pin: `deem-0.8-v1` as a launch label, the commit pair as the only name for the weights (C2) and requalification on a new pair (C3).
- **`parseArgs()`**: subcommands `health`, `noul`, `choice`, `score` and `run`. Flags `-q`, `-s` (stdin when absent), `-o KEY=DESCRIPTION`, `-l DESCRIPTION` and `--value`. An inherited terminal on stdin exits 2. A usage error exits 2.
- **`health()`**: `GET /health` with a 2,000 ms budget, or 500 ms for a hook caller. It requires HTTP 200, a JSON object, `status` `ok`, a `backend` of `torch` or `ensemble:` without `stub`, and `model` `deem-0.8-v1`. It reads the model commit as the basename of `readlink ~/.local/share/deem/models/current` and the source commit with `git -C ~/.local/share/deem/src rev-parse HEAD`, then prints backend, model id and pair. It never starts the server.
- **`buildRequest()`**: `noul` sends `instructions`. `choice` sends the descriptions as the `options` list and keeps a description-to-key map, refusing duplicates with exit 2. `score` sends `levels`. `run` passes a Deem-shaped request file through. The caps are checked here, before any socket opens: more than 26 options or more than 64 questions exits 2 with a message naming the cap.
- **`translateAnswer()`**: `value` to `noul`, `level` to `score` and the chosen description back to its key, with the probabilities rekeyed. An answer whose `model` is not `deem-0.8-v1` exits 3 (`deem_server.py:894`). `--value` prints the bare answer.
- **Exit mapping**: 0 success. 1 an unexpected response or HTTP 400. 2 usage or config. 3 a refused backend. 4 unreachable, a timeout or a 5xx. 130 on SIGINT.

### Data Flow

A caller spawns `cli-deem <subcommand>` with flags and the state on stdin. The client validates the flags and caps, builds Deem's request and posts it to `127.0.0.1:8300/v1/systemone` with no bearer. The server answers in its shape, and the client rekeys it into `jev-cli`'s shape on stdout with an exit code the caller already handles for `jev`. `health` makes one `GET /health`, reads two paths on disk and prints one line. Nothing is written anywhere.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Build Roles

D5 of the parent goal sets who builds. A fresh Opus 5.5 xhigh build orchestrator writes single-change briefs and runs CLI executors by Bash only: Devin `deepseek-v4-1-flash-max`, Cursor `grok-4.7-xhigh-fast` and Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh` once a probe passes. The orchestrator session verifies each result, gets a cross-family review of the code and commits. Docs go through sk-doc and code follows `sk-code-opencode` (D6 of the parent goal).

### First Slice, in Order

1. Reopen the cited Deem seams (`deem_server.py:519-550`, `:594-621`, `:772-777`, `:222-230`, `:656-659`) and `jev-cli`'s answer shape (`__init__.py:389-393`), because the vendored copy may have moved.
2. Write `cli-deem.mjs` and its tests against an in-test fake server: a stub backend refused, a wrong model id, a refused connection, an HTTP 400, 27 options, 65 questions, the answer round trip and duplicate descriptions. No test reaches port 8300.
3. Write the packet's `SKILL.md`, three references and feature catalog, then the hub root files, all through sk-doc, and run `parent-skill-check.cjs` on the hub.
4. Regenerate the advisor graph, the trigger index and the Hermes copies, then run the two-stage route replay of a Deem prompt.
5. Hand the orchestrator the one live `cli-deem health`, which should print `torch`, `deem-0.8-v1` and the pair `8cbabbb` and `6755b30`.
6. Run `git status --porcelain` and confirm only the hub, this phase folder and the generated files `spec.md` REQ-008 names changed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root, with `H=.skilled/skills/cli-classifier` and `C=$H/cli-deem/scripts/cli-deem.mjs`. The fake server is an `http.createServer` inside the test file, bound to port 0, that answers per case and logs each request body.

| Check | Command | Expected output |
|-------|---------|-----------------|
| Fake-server tests | `node --test $H/cli-deem/scripts/tests/` | All cases pass, exit 0: stub backend exit 3, wrong model id exit 3, refused connection exit 4, HTTP 400 exit 1, 27 options exit 2, 65 questions exit 2, round trip exit 0, duplicate descriptions exit 2. The fake server logs no request for the three exit-2 cases |
| Cap boundaries | test cases | 26 options and 64 questions are sent. 27 and 65 are refused before any request |
| No key, no dependency | `grep -nE 'Authorization\|Bearer\|API_KEY' $C` and a read of its imports | No match, exit 1. Every import is a `node:` built-in |
| No lifecycle code | `grep -n 'deem-ctl' $C` | No match, exit 1 |
| Per-hub check | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $H` | Exit 0 with one mode, `cli-deem` |
| Route replay | stage 1 through `node .skilled/bin/skill-advisor.cjs advisor_recommend`, stage 2 through the hub's router | Stage 1 names `cli-classifier`, stage 2 names `cli-deem` |
| Live smoke (orchestrator only) | `node $C health` | Exit 0 with `torch`, `deem-0.8-v1` and the pair `8cbabbb` and `6755b30`, or the pair `deem-ctl status` prints after a later release |
| Hermes copies | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` | `PASS`, exit 0, with `.hermes/skills/cli-classifier/SKILL.md` and `.hermes/skills/cli-deem/SKILL.md` present |
| Scope | `git status --porcelain` and `git diff --stat -- .skilled/skills/cli-jev` | Only the hub, this phase folder and the generated files `spec.md` REQ-008 names. The `cli-jev` diff is empty |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None for the build or the tests. The orchestrator's smoke needs the Deem server already served and healthy per `../007-classifier-deep-research/context/deem-local.md`, started with `deem-ctl start` by the orchestrator. No package is installed by this phase. Every Deem arm in 002, 003, 005 and 006 depends on this phase's client.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Kill criterion: the per-hub check fails, or a replayed Deem request routes elsewhere. Revert the hub commit, which removes `.skilled/skills/cli-classifier/`, then regenerate the advisor graph, the trigger index and the Hermes copies so none names the hub. `sync-skills-hermes.cjs` prunes a copy whose source is gone (`sync-skills-hermes.cjs:234`, `:260`). `cli-jev` and the served Deem instance are untouched either way, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---
