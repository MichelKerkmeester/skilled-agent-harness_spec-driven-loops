---
title: "Build Phase: cli-classifier Hub with the cli-deem Client"
description: "Mint the proposed cli-classifier hub with the proposed cli-deem as its first mode: a Node standard-library client that posts Deem's own request shape to the local Deem server and prints jev-cli's answer shape. Its tests use an in-test fake server, and the only live call is the orchestrator's one cli-deem health."
trigger_phrases:
  - "cli-classifier hub"
  - "cli-deem client"
  - "cli-deem health"
  - "deem node client"
  - "deem check stub backend"
  - "classifier hub first mode"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Build Phase: cli-classifier Hub with the cli-deem Client

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-27, from the round-3 synthesis `../007-classifier-deep-research/research/research.md` section 14 (`### 008-cli-classifier-hub (new)`) and section 12 (`### R23.`) |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | 007-classifier-deep-research |
| **Successor** | 009-cli-jev-hub-move |
| **Handoff Criteria** | `parent-skill-check.cjs` passes on the new `cli-classifier` hub (proposed) with one mode, the client's fake-server tests pass, a two-stage route replay sends a Deem prompt to `cli-deem` (proposed) and the orchestrator's one live `cli-deem health` prints the backend, the model id and the commit pair. 009 also waits on a Deem arm result the operator keeps (question 49) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the cli-jev workflow integration specification. It builds the first half of recommendation R23, rank 4 and verdict next: a `cli-deem` Node client (proposed) in a new `cli-classifier` hub (proposed). The source is the round-3 synthesis, `../007-classifier-deep-research/research/research.md`: section 14's record for this phase, section 12's R23 record and shared two-backend gate contract, section 3's wire table, Deem check and lifecycle plus conditions C1 to C3. The parent goal's D2 requires the hub and `cli-deem`. `cli-jev` stays where it is until phase 009.

**Scope Boundary**: One new hub root under `.skilled/skills/cli-classifier/` holding one transport packet, `cli-deem/`, plus the regenerated advisor graph and trigger index. No existing skill, script or hook changes, and nothing calls the real Deem server except the orchestrator's one smoke.

**Dependencies**:
- None for the build. The tests run against an in-test fake server.
- For the orchestrator's smoke only: the local Deem server already served per `../007-classifier-deep-research/context/deem-local.md`, running and healthy.

**Deliverables**:
- The hub root files, with `mode-registry.json` naming one transport mode, `cli-deem`
- The `cli-deem/` packet: `SKILL.md`, three references (the wire, the lifecycle over `deem-ctl` and the model pin), `scripts/cli-deem.mjs` and its test file
- The regenerated advisor graph and trigger index
- One live `cli-deem health` line, recorded by the orchestrator

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Four Planned phases want a Deem arm (002, 003, 005 and 006), and the repository has 0 runtime Deem callers. The installed Python `jev-cli` cannot stand in. Deem's server answers the System One shape, yet `jev choice` sends its options as `criteria` where Deem expects an `options` list, and `jev score` sends `criteria` where Deem expects `levels`. Both come back as HTTP 400, which `jev` maps to exit 1 (`deem_server.py:534-545`, `__init__.py:295-296`, `:378`). On the answer side Deem returns `value` and `level` where `jev` readers expect `noul` and `score` (`deem_server.py:606`, `:618`, `__init__.py:389-393`). Pointing `jev --provider custom` at the server also needs a placeholder key, which the dispatch guard refuses on an agent's command line (`dispatch-rule-checks.mjs:114`, `:287-290`).

There is also no shared Deem check. The server's stub backend answers `status` `ok` with uniform logits and a `noul` of 0.5 for everything (`deem_server.py:137-154`), so a feature that trusts `status` alone would read the stub's 0.5 as a judgment. D1 needs a health check that refuses the stub and pins the served model.

### Purpose

Give every Deem arm one transport: a dependency-free client that posts Deem's own request shape, returns `jev-cli`'s answer shape so a reader written for `jev` output works unchanged and implements the Deem half of D1 as `cli-deem health`, all housed in the `cli-classifier` hub that D2 requires.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A new hub root, `.skilled/skills/cli-classifier/` (proposed), whose `mode-registry.json` names one mode, `cli-deem`, of `packetKind` `transport`.
- `cli-deem.mjs` (proposed): one file, Node standard library only, with subcommands `health`, `noul`, `choice`, `score` and `run` and `jev`-like flags `-q`, `-s` (stdin when absent), `-o KEY=DESCRIPTION`, `-l DESCRIPTION` and `--value`.
- Requests in Deem's shape: `choice` sends the descriptions as the `options` list and maps the chosen string back to its key, refusing duplicate descriptions. `score` sends `levels`.
- Answers in `jev-cli`'s shape: `value` becomes `noul`, `level` becomes `score` and `choice` becomes the key, with the probabilities rekeyed the same way.
- Caps checked before sending: more than 26 options, or more than 64 questions in a `run` request, exits 2 with a named message.
- `cli-deem health`, the Deem check of section 3, printing the backend, the model id and the commit pair.
- Exit codes that mirror `jev-cli`: 0, 1, 2, 3, 4 and 130.
- Three references in the packet: the wire, the lifecycle over `deem-ctl` and the model pin.
- A test file against an in-test fake server, then the orchestrator's one live `cli-deem health`.
- Regenerating the advisor graph and the trigger index so a Deem prompt routes to the hub and then to `cli-deem`.

### Out of Scope

- Moving `cli-jev` into the hub. That is phase 009, which waits on this phase and on a Deem arm result the operator keeps (question 49).
- Any caller's `--deem` switch. Each arm in 002, 003, 005 and 006 owns its own switch, as the shared gate contract says. The hub has no switch.
- Starting, stopping, updating or rolling back the server from the client. `deem-ctl` owns the lifecycle, and the packet only documents it. No feature starts the server.
- The `jev --provider custom` wrapper as `cli-deem` (What Not To Build row 75) and a translator: a patched wheel, a JSON proxy or a `deem` branch in `provider_request` (row 76).
- The npm `jevctl` as a third transport (row 77), and Deem's MCP server as a route (row 78).
- A global Deem switch or one `--backend` flag shared by several arms (row 80), and silent failover between backends (row 81).
- Raising `DEEM_N_ORDERS` on the served instance (row 102). A caller that wants order averaging sends its own permuted requests.
- A shared client library that callers import (row 110). Callers spawn `cli-deem` as a binary, so the binary is the shared piece.
- A nested hub or a second skill-shaped `graph-metadata.json` inside the packet, which `parent-skill-check.cjs:268-275` rejects (K11).
- Closing the server's open CORS and missing authentication (question 44), and whether the 3,368 MB footprint stays resident (question 45). Both are operator decisions.
- Any bearer, key or `--provider` flag. Deem takes no key.

### Files to Change

All names are proposed and come from the synthesis (swe-07's list, lineage-reported), except where the Description says otherwise.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/SKILL.md`, `README.md`, `ROUTER.md` | Create | Hub identity, overview and router over one mode |
| `.skilled/skills/cli-classifier/mode-registry.json`, `hub-router.json` | Create | One mode `cli-deem`, `packetKind` `transport`, with its `toolSurface` and advisor routing |
| `.skilled/skills/cli-classifier/graph-metadata.json`, `description.json` | Create | Hub metadata. The packet carries no `graph-metadata.json` of its own |
| `.skilled/skills/cli-classifier/leaf-manifest.json` | Create, generated | The hub's leaf manifest |
| `.skilled/skills/cli-classifier/changelog/` | Create | The hub's first changelog entry |
| `.skilled/skills/cli-classifier/manual-testing-playbook/`, `benchmark/` | Create | Not in swe-07's list. `parent-skill-check.cjs:1119-1129` requires both by default, so the observable check needs them |
| `.skilled/skills/cli-classifier/cli-deem/SKILL.md` | Create | The transport packet's contract |
| `.skilled/skills/cli-classifier/cli-deem/references/` | Create | Three references: the wire, the lifecycle over `deem-ctl` and the model pin |
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Create | The client, about 170 LOC (swe-01, lineage estimate) |
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | Create | The fake-server tests, about 150 LOC (estimate), run with `node --test`. The test path is this phase's choice |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerate | The advisor graph gains the hub |
| The trigger index under `system-spec-kit` | Regenerate | Rebuilt from committed content |
| `.skilled/skills/cli-jev/**` | Unchanged | Stays in place until 009 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The hub passes the per-hub check with one transport mode | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0 with the default strict checks. `mode-registry.json` lists one mode, `cli-deem`, with `packetKind` `transport` |
| REQ-002 | `cli-deem health` implements the Deem check and never starts the server | It passes only when `GET http://127.0.0.1:8300/health` answers HTTP 200 within 2,000 ms (500 ms for a hook caller), the body is a JSON object with `status` `ok`, `backend` is `torch` or starts with `ensemble:` and contains no `stub` and `model` is `deem-0.8-v1`. It then prints the backend, the model id and the commit pair: the basename of `readlink ~/.local/share/deem/models/current` and `git -C ~/.local/share/deem/src rev-parse HEAD`. A stub backend or another model id exits 3. A refused connection, a timeout or a 5xx exits 4. No code path starts the server |
| REQ-003 | Requests go out in Deem's shape | `choice` posts the descriptions as the `options` list and maps the chosen string back to its key. Two options with the same description exit 2 before any request. `score` posts `levels`. `noul` posts `instructions`. The fake server records each body, and the tests assert the field names |
| REQ-004 | Answers come back in `jev-cli`'s shape | `value` becomes `noul`, `level` becomes `score` and `choice` becomes the submitted key, with the probabilities rekeyed the same way. `--value` prints the bare answer. A round-trip test through the fake server returns the shape a `jev` reader expects |
| REQ-005 | Caps are checked before sending | More than 26 options, or more than 64 questions in a `run` request, exits 2 with a message naming the cap, and the fake server logs no request (`deem_server.py:166`, `:222-230`, `:656-659`) |
| REQ-006 | Exit codes mirror `jev-cli` | 0 success. 1 an unexpected response or HTTP 400. 2 a usage or config error. 3 a refused backend: the stub, or a model id other than `deem-0.8-v1` in the health body or in an answer's `model` field (`deem_server.py:894`). 4 unreachable, a timeout or a 5xx. 130 interrupted. With no server, every subcommand exits 4 and changes nothing |
| REQ-007 | The client holds no key and no dependency | It sends no bearer and takes no `--provider`. `grep -nE 'Authorization\|Bearer\|API_KEY' cli-deem.mjs` returns no match, and every import is a `node:` built-in |
| REQ-008 | The phase changes only the hub and the regenerated indexes | `git status --porcelain` lists only paths under `.skilled/skills/cli-classifier/`, the advisor graph and the trigger index. `git diff --stat -- .skilled/skills/cli-jev` is empty |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | The packet documents `deem-ctl` and never reimplements it | The lifecycle reference covers install per `deem-local.md`, then `start`, `stop`, `status`, `update`, `update --check` and `rollback`. It says an update lands on a new Hugging Face or GitHub commit and is proven by one real decision, and that `rollback` holds a rejected release until a newer one lands. It states that a measured keep survives an update only by requalification on its commit pair (C2, C3). `grep -n 'deem-ctl' cli-deem.mjs` returns no match |
| REQ-010 | The wire and model-pin references match the code | The wire reference carries section 3's field table: request fields, answer fields, caps, the one-request lock and the no-key rule. The model-pin reference names `deem-0.8-v1` as a launch label that survives an update, so only the commit pair names the weights (C2) |
| REQ-011 | A Deem prompt routes to `cli-deem` | After the advisor graph and trigger index are regenerated, a two-stage route replay of a Deem prompt names hub `cli-classifier` at stage 1 and mode `cli-deem` at stage 2 |
| REQ-012 | The fake-server tests cover every refusal and the round trip | The test file exits 0 with at least these cases: a stub backend refused (exit 3), a wrong model id (exit 3), a refused connection (exit 4), an HTTP 400 (exit 1), 27 options (exit 2), 65 questions (exit 2), the answer round trip (exit 0) and duplicate descriptions (exit 2). No case reaches port 8300 |
| REQ-013 | The orchestrator runs one live smoke | One `cli-deem health` against the served instance exits 0 and prints `torch`, `deem-0.8-v1` and the pair `8cbabbb` and `6755b30`, or the pair `deem-ctl status` prints if a release landed after 2026-09-27. No other live call runs in this phase |

### Edge Cases

- **A loading server.** The server binds its port only after the weights load, about 10 s after a start (`deem_server.py:1000`, `deem-local.md:44`). The client sees a refused connection and exits 4, so a loading server looks absent. That is intended: no caller waits.
- **A busy server.** The server holds one lock around inference (`deem_server.py:201`, `:236`), so a call queues behind an offline batch. The caller's timeout decides, and a timeout exits 4.
- **A foreign server on the port.** A server launched without `DEEM_MODEL_ID` reports `deem-1.5` (`deem_server.py:107`), and another program reports something else. The model pin exits 3.
- **An update mid-run.** The six-hourly schedule can restart the server with new weights. The client reports what `health` sees at that moment. Detecting a changed pair mid-run belongs to each caller's arm (`deem arm stopped: model commit changed mid-run`, proposed).
- **A missing checkpoint link or source tree.** `health` cannot read the commit pair. It exits 2, a config error, and prints which path was missing (this phase's reading of the exit table).
- **Stdin.** With no `-s`, the state is read from stdin. An inherited terminal is refused with exit 2 rather than a hang, as `jev` does.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Any script or agent can ask the local Deem for `noul`, `choice`, `score` or `run` through one binary and read the answer exactly as it reads `jev` output.
- **SC-002**: A caller learns in one call whether Deem is available under D1, with the stub and any foreign model refused, and gets the commit pair its records must carry.
- **SC-003**: With no server running, every subcommand exits 4 and nothing else changes, so a machine without Deem behaves as today.

### Proof Plan

Written before the build, from section 14's first slice and observable check.

1. The test file runs against an in-test fake server and exits 0 with the eight cases of REQ-012. Boundary: 26 options and 64 questions are sent, 27 and 65 exit 2 with no request logged.
2. The round-trip case posts `choice`, `score` and `noul` and reads back the chosen key, `score` and `noul` with rekeyed probabilities. Boundary: two options with one description exit 2.
3. `parent-skill-check.cjs` on the hub exits 0. Boundary: a mode without `packetKind` or a second `graph-metadata.json` inside the packet fails it.
4. A two-stage route replay of a Deem prompt names `cli-classifier`, then `cli-deem`.
5. The orchestrator's one `cli-deem health` prints `torch`, `deem-0.8-v1` and the commit pair.
6. `git status --porcelain` lists only the hub and the regenerated indexes, and `cli-jev` is untouched.

**Kill criterion.** The per-hub check fails, or a replayed Deem request routes elsewhere. Revert the hub commit and regenerate the advisor graph and trigger index. Separately, R23 retires `cli-deem` and never builds 009 if no Deem arm prints a result the operator keeps.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The served Deem instance, for the smoke only | The smoke cannot run | The build and tests need no server. The orchestrator starts it with `deem-ctl start` before the smoke, never the client |
| Risk | The hub files miss a field the per-hub check demands | Med | Run `parent-skill-check.cjs` on the hub before regenerating any index. Its failure is the kill criterion |
| Risk | A Deem prompt routes to `cli-jev` or elsewhere | Med | The two-stage replay runs before the phase closes. A miss is the kill criterion |
| Risk | The client becomes "a wrapper that only forwards arguments" | Low | It translates field names, maps keys back and enforces caps, so the red flag does not fire (R23's fitness note, the synthesis's judgment) |
| Risk | A release changes the weights after a keep is measured | Med | `health` prints the commit pair every caller records (C2). A keep holds only for its pair and requalifies on a change (C3). `deem-ctl rollback` holds a release that answers worse |
| Risk | Open CORS on the server | Low. It exposes compute, not data | Out of scope here. Question 44 is the operator's |
| Risk | The `cli-deem` scaffold outlives its use | Low | R23's rule: retire `cli-deem` and skip 009 if no Deem arm prints a result the operator keeps |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How does a hook caller select the 500 ms budget in place of 2,000 ms? The synthesis sets both budgets and names no flag. The build fixes the flag name (proposed) and records it in the wire reference.
- Does a new hub need admission to compiled routing for stage 2, or does its own `hub-router.json` suffice until 009? The synthesis lists the compiled-route literals only for 009. The build reads `compiled-route.cjs:35` and the admission tool before choosing the replay command.
- Should 009's move wait on a Deem result the operator keeps? The synthesis recommends yes (question 49). The operator decides when 008 lands.
<!-- /ANCHOR:questions -->

---
