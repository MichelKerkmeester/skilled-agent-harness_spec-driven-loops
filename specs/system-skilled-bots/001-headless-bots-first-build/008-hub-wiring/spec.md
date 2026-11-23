---
title: "Feature Specification: Phase 8: hub-wiring"
description: "The bots runtime from phases 1 to 7 has no hub, no commands and no route, so no request can reach it. This phase wires four metadata modes onto every surface that applies and proves both routing stages for this hub."
trigger_phrases:
  - "hub wiring"
  - "phase 8 hub wiring"
  - "system-skilled-bots hub wiring"
  - "bots four mode wiring"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: hub-wiring

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress. Every acceptance row is Met; T001 waits on phase 002's weekday probe |
| **Created** | 2026-11-22 |
| **Branch** | `scaffold/008-hub-wiring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-status-index |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met. The per-hub gate ran with this hub's path and both routing stages were replayed with a real prompt per mode. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Build system-skilled-bots: file-defined headless agent bots run on a schedule or event specification.

**Scope Boundary**: Hub files, router commands, runtime mirrors, the generated leaf manifest, one doctor asset and the routing and re-pin proofs. No new runtime behavior. A defect found here goes back to the phase that owns it.

**Dependencies**:
- Phases 001 to 007 complete. This phase routes requests to behavior those phases ship: contracts and state root (001), the checker (002), the runner (003), worktree delivery (004), the queue (005), the installer (006) and status (007).
- `/create:skill-parent` and `/create:command`, the purpose-built workflows for hubs and commands.

**Deliverables**:
- A `system-skilled-bots` hub with four `metadata` modes: author, run, schedule, status.
- Thin router commands under `.skilled/commands/bots/` and their generated runtime mirrors.
- A doctor YAML asset that runs the phase 2 definition checker.
- Recorded evidence for the per-hub gate, the two-stage replay, alias replays, mirror parity, leaf-manifest drift and the staged re-pin.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
After phase 7 the runner, queue, installer and status work from their CLI, but no hub, mode or command points at them. An agent asking to author, run, schedule or check a bot gets no route, and the advisor has no vocabulary to surface the skill (research.md §14). A mode that looks registered can still be unreachable, because each routing stage can pass while the other fails (`skill-hub-routing.md` §1, §2).

### Purpose
A natural request for each of the four modes reaches that mode through both routing stages on this hub, from every runtime, and a re-pin of a vendored consumer leaves its `bots/` folder untouched.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ ls -A .skilled/skills/system-skilled-bots | wc -l
       0

$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots
INFO: Parent skill: .skilled/skills/system-skilled-bots
INFO: Resolved:     /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/skills/system-skilled-bots
INFO: Policy: advisory findings count as FAIL; hard failures always FAIL.

ERROR: target is not a parent hub: it carries neither mode-registry.json nor hub-router.json, so the skill-root contract classes it as a standalone skill (class S); check its root with node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
(exit 2)

$ node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "run the nightly bot now"
{"servingAuthority":"legacy","hubId":"system-skilled-bots"}
(exit 0)
```
Captured 2026-11-22, before phases 1 to 7 are built. The folder exists and is empty. Phase 1 may add a minimal skill root, so the build re-captures this block at its first task. The compiled-route call exits 0 with no mode in its output, which is the green-run-lies shape `skill-hub-routing.md` §3 warns about.

Re-captured 2026-11-23 at the start of the build, on the skill root as committed at HEAD (`git archive HEAD .skilled/skills/system-skilled-bots`, exported to a temp folder):

```text
$ ls -A <HEAD export>/.skilled/skills/system-skilled-bots
assets
runtime
scripts

$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs <HEAD export>/.skilled/skills/system-skilled-bots
INFO: Parent skill: <HEAD export>/.skilled/skills/system-skilled-bots
INFO: Resolved:     <HEAD export>/.skilled/skills/system-skilled-bots
INFO: Policy: advisory findings count as FAIL; hard failures always FAIL.

ERROR: target is not a parent hub: it carries neither mode-registry.json nor hub-router.json, so the skill-root contract classes it as a standalone skill (class S); check its root with node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
exit=2
```
Phases 1 to 7 left the runtime, the checker and the template but no `SKILL.md`. The workflow redo resolved the operation as `update`, because the folder already exists. After the build the same gate on the hub path exits 0 (`scratch/parent-skill-check-final.txt:66`), and after the activation the compiled-route call routes each mode (`scratch/stage-two-compiled.jsonl:1`).
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Scaffold the hub with `/create:skill-parent`: `SKILL.md` with its mode table, `mode-registry.json`, `hub-router.json`, root `ROUTER.md`, `graph-metadata.json`, `description.json`, `command-metadata.json`, the generated `leaf-manifest.json`, `changelog/`, `manual-testing-playbook/`, `benchmark/` and four `metadata` mode packets (research.md §14).
- Create the thin router commands with `/create:command`, then generate their runtime mirrors with the sync scripts.
- Add a doctor YAML asset beside the existing ones that runs the phase 2 definition checker, registered through `/create:command` (research.md §14).
- Run the per-hub gate with this hub's path, replay both routing stages with one real prompt per mode and replay each alias against an out-of-domain phrase.
- Run a staged re-pin on a copy of a vendored consumer and prove `bots/` is byte-identical afterward.
- Map the `bots inbox` and `bots answer` verbs onto existing modes: inbox onto status, answer onto run. Phase 3 owns `bots inbox` and phase 5 owns `bots answer`, a queue producer like `bots enqueue` (operator decision D12). They get no mode and no command of their own. This follows the operator's decision-queue choice (operator decision, 2026-11-22).
- Prove in the same staged re-pin that a changed runner path is reported as needing reinstall, and record what the re-pin does to run folders under `.skilled/skills/.state/` (operator decisions, 2026-11-22).

### Out of Scope
- New runtime behavior or fixes to runner, queue, installer or status code: those belong to phases 001 to 007, and a fix found here goes back to the owning phase. The compiled-routing engine for this hub under `.skilled/bin/lib/compiled-routing/` is in scope by operator decision Q002; it is routing infrastructure, not bots runtime.
- A `lexical` or `alias-fold` mode, projection maps or scorer entries: all four modes are `metadata` (research.md §14).
- The worktree reclaimer, a Hermes cron backend and the webhook adapter: research.md §15 step 10 marks them as later.
- Hand-rolled hub or command files: `/create:skill-parent` and `/create:command` are the required path (PLAN-WORKFLOW LOCK).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/SKILL.md` | Create | Hub contract with the four-mode table and packet count |
| `.skilled/skills/system-skilled-bots/mode-registry.json` | Create | Registers author, run, schedule and status as `metadata` modes |
| `.skilled/skills/system-skilled-bots/hub-router.json` | Create | `routerSignals` per mode and a `routerPolicy.tieBreak` that is an exact permutation of the registry |
| `.skilled/skills/system-skilled-bots/ROUTER.md` | Create | Stage-two `INTENT_SIGNALS` and `RESOURCE_MAP` with equal keys |
| `.skilled/skills/system-skilled-bots/graph-metadata.json` | Create | The one advisor identity, carrying every mode's vocabulary |
| `.skilled/skills/system-skilled-bots/description.json` | Create | Doctor metadata: keywords and description naming all four modes |
| `.skilled/skills/system-skilled-bots/command-metadata.json` | Create | One entry per command the hub owns, authored from the sk-doc command-metadata template; no workflow writes it |
| `.skilled/skills/system-skilled-bots/leaf-manifest.json` | Create | Generated leaf inventory, never hand-edited |
| `.skilled/skills/system-skilled-bots/<mode>/` (four packets) | Create | `README.md`, `SKILL.md`, `ROUTER.md` and `changelog/` per mode |
| `.skilled/commands/bots/` | Create | Thin router commands, one per mode |
| `.claude/commands/`, `.cursor/commands/`, `.codex/prompts/`, `.pi/prompts/` | Create (generated) | Runtime mirrors written by the sync scripts |
| `.skilled/commands/doctor/bots.md`, `.skilled/commands/doctor/assets/doctor-bots-auto.yaml`, `doctor-bots-confirm.yaml`, `doctor-bots-presentation.txt` | Create | Doctor command set that runs the definition checker, as `/create:command` produced it (the split set replaces the single `doctor-bots-check.yaml` first planned) |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Route entry for the doctor bots command |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/011-system-skilled-bots/` and its authored source under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/011-system-skilled-bots/` | Create | Compiled engine for this hub: `lib/registry-compiler.cjs`, `lib/router.cjs`, `lib/policy-card.cjs`, `harness/build-artifacts.cjs`, `fixtures/canary-cases.v1.json`, `compiled/` and `activation/`, following commit `6a5e1048ea5` (operator decision Q002) |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/system-skilled-bots/` and its authored copy under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-skilled-bots/` | Create | Activation fence, records and manifests for this hub (Q002) |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/resolve.cjs` and `.../014-runtime-engine/lib/compiled-route.cjs` | Modify | Authored copies of the resolver and front door that `compiled-route-sync.cjs` promotes (Q002) |
| `.skilled/skills/system-skill-advisor/runtime/dist/` compiled flag module, `.skilled/bin/tests/compiled-route-admission.test.cjs`, `.skilled/skills/README.txt`, `README.md`, the hub's `manual-testing-playbook/` gold scenarios | Modify | Rebuilt advisor dist for the flag cohort, the admission corpus count pin, the skills index and root README hub count, and the gold the admission floor needs (Q002) |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`, `.../014-runtime-engine/lib/compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` | Modify | Register the hub with the compiled front door and its serving closure (Q002) |
| `.skilled/bin/compiled-route-guard.cjs`, `.skilled/bin/compiled-route-sync.cjs`, `.skilled/bin/compiled-routing-foundation.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts` | Modify | Add the hub to the guard, the sync check, the foundation test and the advisor's compiled-routing flag list (Q002) |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/shared/frozen-scorer-pins.json` | Modify | Scorer re-freeze before the hub's activation (operator decision Q006) |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs` | Modify | Authored copy brought in line with its runtime copy, an out-of-scope repair (operator decision Q007) |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` | Modify | Held-out rows for the four `/bots:*` commands and `/doctor:bots`, written blind from the command descriptions (operator decision Q003) |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | Modify | One recapture after the blind rows land (Q003) |
| Shared advisor and doctor files the first build changed: `command-attach.ts`, `scorer/projection.ts`, `skill_advisor.py`, the generated command bridges and `scoring-compatibility.json`, `command-metadata-e2e.vitest.ts`, `skill-root-metadata-contract.test.cjs`, two `graph-metadata.json` reverse edges, the commands `README.txt` and `doctor-setup-presentation.txt` | Modify | Carried from the first build; each is re-checked against the workflow output and kept only where a gate needs it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The hub is scaffolded by `/create:skill-parent` with four modes, author, run, schedule and status, each with `advisorRouting.routingClass` set to `metadata`. No mode packet and no `shared/` folder carries a `graph-metadata.json`. |
| REQ-002 | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots` exits 0, and its `INFO: Parent skill:` subject line names `system-skilled-bots`. A run without the hub path does not count. |
| REQ-003 | For one natural prompt per mode, `compiled-route.cjs --hub system-skilled-bots --prompt "<prompt>"` returns that mode with non-empty intents, and `skill_advisor.py "<prompt>" --threshold 0.5` returns `system-skilled-bots`. Both outputs are recorded verbatim. |
| REQ-004 | Every surface that applies to a `metadata` mode on this hub carries all four modes: registry, `routerSignals`, `tieBreak`, `INTENT_SIGNALS` and `RESOURCE_MAP`, `graph-metadata.json`, the `SKILL.md` mode table, `description.json`, `leaf-manifest.json` and the command mirrors (`parent-skills-nested-packets.md` §7). |
| REQ-005 | The commands are created by `/create:command`, and every runtime mirror tree carries every bots command. `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check` and `pi/sync-prompts-pi.cjs --check` all pass. |
| REQ-006 | `leaf-manifest.json` is regenerated, not hand-edited, and the `10b-byte-drift` check passes in the per-hub gate. |
| REQ-007 | A staged re-pin (`overlay-engine.cjs repin --upstream <dir> --to <commit> --root <copy> --stage <empty dir>`) on a copy of a vendored consumer carries the copy's `bots/` folder into the staged tree byte-identical and leaves the copy's own `bots/` unchanged, proven by comparing a hash of every file before and after. |
| REQ-013 | In the staged re-pin, once the staged tree replaces the copy at its path, a fixture install record whose recorded pin no longer matches is reported by `bots status` as needing reinstall (operator decision Q004). The run records what the re-pin did to a fixture run folder under `.skilled/skills/.state/system-skilled-bots/`. A lost run folder is recorded as a fact, never a failure, because run folders inside the tree may not survive a re-pin. |
| REQ-008 | No document in phases 001 to 008 calls a mode routed or reachable before REQ-002 and REQ-003 pass, or integrated before REQ-002 to REQ-006 pass (`skill-hub-routing.md` §2: registered is not routed, and a green gate is not integration). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | Each new alias is replayed against one plausible out-of-domain phrase, and that phrase does not select `system-skilled-bots` in either stage (`skill-hub-routing.md` §4). |
| REQ-010 | A doctor YAML asset under `.skilled/commands/doctor/assets/` runs the phase 2 definition checker, read-only, and is reachable through a doctor command created by `/create:command`. |
| REQ-011 | The surfaces with no gate (stage-two intent, advisor vocabulary and `description.json`) are checked by hand, and each check is recorded with the command and its output. |
| REQ-012 | This phase changes no file under `.skilled/skills/system-skilled-bots/runtime/`. `git diff --stat` for the phase shows no runtime path. |
| REQ-014 | A natural prompt for `bots inbox` reaches the status mode and one for `bots answer` reaches the run mode through both stages. Their aliases are in ADR-002, and each alias is replayed against an out-of-domain phrase like any other. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `parent-skill-check.cjs .skilled/skills/system-skilled-bots` exits 0 with a subject line naming `system-skilled-bots`.
- **SC-002**: Four prompts, one per mode, each return their mode from `compiled-route.cjs` and the hub from `skill_advisor.py`.
- **SC-003**: The three mirror checkers pass and each mirror tree lists every bots command.
- **SC-004**: After a staged re-pin, the hash lists of `bots/` in the consumer copy and in the staged tree both match the list taken before the re-pin.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001 to 007 complete | Modes would route to behavior that does not exist | Start only when every predecessor's acceptance criteria are Met |
| Dependency | `/create:skill-parent` and `/create:command` | No sanctioned way to write the hub or commands | If either blocks, state the deviation to the operator and wait. Never hand-roll a substitute |
| Risk | A green gate is read as integration | High | The gate covers rows 1 to 3 and 9, and row 7 by name only (check 6b). Replay both stages and check the ungated rows by hand (`skill-hub-routing.md` §2) |
| Risk | A bare gate run reports on another hub | High | Always pass the hub path and quote the subject line (`skill-hub-routing.md` §3) |
| Risk | A broad alias such as `schedule` or `status` captures unrelated traffic | Med | Replay each alias against an out-of-domain phrase and narrow it until that phrase misses |
| Risk | The re-pin proof runs on the live tree | Med | Use `--stage <dir>` on a copy only. The engine leaves the tree alone in stage mode (research.md §14) |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. This phase adds routing metadata and commands, not a service with a latency budget.
- **NFR-P02**: N/A. No throughput path changes.

### Security
- **NFR-S01**: Each command's tool grants match its mode's tool surface (research.md §14). The status command grants no write tool (`decision-record.md` ADR-003).
- **NFR-S02**: The doctor asset runs the checker read-only and writes nothing outside its own state log.

### Reliability
- **NFR-R01**: Mirrors and the leaf manifest are generated, so a rerun of each sync script and the manifest generator produces no diff.
- **NFR-R02**: Nothing in this phase writes into a vendored tree (research.md §15 invariants).

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a prompt that names no mode, such as "help with bots", selects the hub and falls back to the `SKILL.md` mode table rather than a wrong mode.
- Maximum input: a prompt matching two modes, such as "schedule this bot and show its status", resolves by `routerPolicy.tieBreak` and the replay records which mode won.
- Failure path: a stage-one hit with `surfaceIntents: []` or a stage-two hit with `intents: [NONE]` fails the replay, and the vocabulary is fixed on both sides.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 30 generated or authored files across the hub, commands, mirrors and doctor |
| Risk | 12/25 | Routing is shared policy, but no runtime code changes |
| Research | 6/20 | research.md §14 and `parent-skills-nested-packets.md` §7 already list the surfaces |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Which aliases does each mode carry? Settled in `decision-record.md` ADR-002 by replay: 24 aliases, with three dropped after the doctor routing slice moved.
- One command per mode, or one `/bots` router with four routes? Built as one command per mode per ADR-003, which still waits on operator confirmation.
- Does a sync script cover `.opencode/commands/`? Yes. `sync-runtime-mirrors.cjs` writes the `.opencode/commands/bots` link, and `validate-command-tree-parity.sh` reports 271 mirrors across 10 trees in sync.
- Which vendored consumer copy serves as the re-pin fixture? A minimal git-built upstream with two commits and a consumer extracted at the first, per the overlay engine's own repin test, built in the session scratchpad (ADR-006).
- Resolved by operator decision Q002: AC-002 and AC-012 need `compiled-route.cjs --hub system-skilled-bots` to return a mode, so this phase builds the hub's compiled engine, canaries and activation following commit `6a5e1048ea5`.
- Resolved by operator decision Q004: AC-011 now reads the promoted case, where the staged tree replaces the copy at its path and `bots status` reports needs-reinstall.
- Resolved by operator decision Q003: a separate agent writes blind held-out rows from the five command descriptions only, then the `command-routing-slice` baseline is recaptured once.
- The post-repin hook point in `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml` is an operator-gated follow-up. It is recorded here and the file is unchanged.
<!-- /ANCHOR:questions -->

---
