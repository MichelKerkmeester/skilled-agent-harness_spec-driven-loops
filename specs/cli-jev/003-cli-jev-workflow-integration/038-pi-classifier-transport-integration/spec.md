---
title: "Feature Specification: Phase 38: pi-classifier-transport-integration"
description: "Phase 037 printed `verdict pi-transport: adopt` for Pi's native classifier runtime on `choice` questions, but nothing can use it. Every caller shells out to the `jev` CLI, and `cli-pi/SKILL.md` never mentions classifiers. This phase builds an opt-in Pi transport for `choice`, with today's CLI behavior unchanged when the switch is off, and documents it for Pi workers."
trigger_phrases:
  - "pi classifier transport integration"
  - "jev transport pi switch"
  - "cli-classifier pi transport"
  - "choice question pi backend"
  - "pi worker classifier docs"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 38: pi-classifier-transport-integration

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-30 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 38 of 38 |
| **Predecessor** | 037-pi-native-classifier-transport |
| **Successor** | None |
| **Handoff Criteria** | The five completion criteria in `goal.md` each run from the final state: with the switch off every changed caller prints what it printed before on a stub-backed run, the switch-on path answers a `choice` question through Pi and returns the CLI's result shape with both backends stubbed in tests, each gate failure prints one skip line and follows the gate rule fixed in `spec.md` section 4, `cli-jev` and `cli-pi/SKILL.md` document the Pi route with `validate_document.py` VALID on every changed doc, the runtime-tree callers are listed as a follow-up with file paths, and `validate.sh --strict` prints `RESULT: PASSED` for this phase. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 38** of the cli-jev workflow integration specification. The operator chose "Plan the integration" on 2026-09-30 after phase 037 printed `verdict pi-transport: adopt`: "Open a new phase that adds Pi as a cli-classifier transport and documents it in cli-pi. Take the adopt verdict as it stands." The operator also approved landing 036 and 037 on main, at `2748c84f14`.

Phase 037 measured Pi 0.99.1 on `openrouter` `typesafe/jev-1.13` against the jev CLI's `official` `jev-1.13.0` over the 019 rows: 111 rows measured, coverage 100.0 percent, top-choice agreement 95.5 percent, median absolute probability difference 0.0100, p95 latency 340 ms against the CLI's 387 ms and cost per 100 calls 0.0022 (`037-pi-native-classifier-transport/scratch/live-run.stdout.txt`). The verdict holds on a one-row margin and only for `choice`, only for Pi 0.99.1, and the CLI latency side is the recorded 019 run rather than a same-day pair (037 `implementation-summary.md` Known Limitations).

**Scope Boundary**: one shared transport module under `.skilled/skills/cli-classifier/shared/scripts/` (proposed) with its stub-backed tests, the doc updates parent D6 requires for it, and opt-in wiring only for the `choice` callers the design approves inside cli-classifier, sk-doc and sk-communication. Nothing under the system-deep-loop, system-skill-advisor or system-spec-kit runtime trees is edited, and no install runs.

**Dependencies**:
- Phase 037 (`037-pi-native-classifier-transport`), Complete. Its `adopt` verdict is this phase's basis.
- Installed Pi 0.99.1 at `~/.local/lib/node_modules/@earendil-works/pi-coding-agent`, with 7 classifier models available through `openrouter` per the 037 probe. Credentials stay in Pi's own store.
- `jev 0.6.2` on `PATH`, pinned in `.skilled/skills/cli-classifier/cli-jev/SKILL.md:97`, for the default route and the fallback.
- No install is needed (parent D7). The operator's yes gates only an optional live smoke call.
- Build roles: parent D5 through this phase's D6. Skill docs: parent D6.

**Deliverables**:
- A transport module under `.skilled/skills/cli-classifier/shared/scripts/` (proposed, for example `jev-transport.mjs`) that answers `choice` through Pi's SDK and returns the shape callers read from the jev CLI today, dormant unless asked for by name.
- Its `node --test` suite with both backends stubbed (proposed path `shared/scripts/tests/jev-transport.test.mjs`).
- The doc updates of section 3: `cli-jev`, a `cli-pi/SKILL.md` classifier section, a cli-classifier feature catalog entry and a playbook scenario with their index rows, written through sk-doc.
- Opt-in wiring for the `choice` callers the design approves inside cli-classifier, sk-doc and sk-communication only, and only when the change is one call site.
- The runtime-tree follow-up list of section 3, with file paths and question types.
- Every gate result and the follow-up list recorded in `implementation-summary.md` and `goal.md`'s log.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 037 measured Pi's native classifier runtime as good enough for the packet's Jev `choice` questions. Its one approved live run printed `verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022` under the keep rule fixed before the run (`037-pi-native-classifier-transport/scratch/live-run.stdout.txt`). The route works, and Pi 0.99.1 exposes it three ways: a codemode script with `models.classify()`, an extension with `ctx.modelRegistry.classify()`, and the SDK's `ModelRuntime` (`docs/models.md:103-136` in the installed package).

Nothing can use it. Every caller shells out to the `jev` CLI: 21 script files do, by the context's grep, spread over cli-classifier, sk-communication, sk-doc, system-deep-loop, system-skill-advisor and system-spec-kit. The CLI remains the only transport any of them knows, and `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` never mentions classifiers, so no Pi worker knows the route exists. The measured verdict sits unused in the 037 record.

### Purpose

Make Pi a working, opt-in Jev transport for `choice` questions, and document it for Pi workers, with today's behavior unchanged when the switch is off.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The transport module under `.skilled/skills/cli-classifier/shared/scripts/` (proposed) that answers `choice` through Pi's SDK and returns the result shape the jev CLI's JSON gives callers today.
- The opt-in switch: an environment value plus a per-call function option (names proposed in section 10). Unset means today's behavior.
- Its `node --test` suite with both backends stubbed, one happy path and one edge case per public surface.
- Opt-in wiring for `choice` callers inside cli-classifier, sk-doc and sk-communication, only for callers the design approves under section 10's third question.
- Docs through sk-doc: the Pi route in `cli-jev`, a short classifier section in `cli-pi/SKILL.md`, a cli-classifier feature catalog entry and a playbook scenario with their index rows.
- The gate-failure rule fixed in section 4, with a test per gate.
- The runtime-tree follow-up list below, with file paths and question types.

### Out of Scope

- Any edit under the `.skilled/skills/system-deep-loop`, `.skilled/skills/system-skill-advisor` and `.skilled/skills/system-spec-kit` runtime trees. The context records that those trees belong to another session's align packets, so this phase reads their call sites and writes the follow-up list only.
- Adopting `bool` or `score`, which include `noul`. 037 measured `choice` only, so each other type stays on the CLI until it passes its own run under 037's keep rule.
- Changing the default transport. The `jev` CLI stays the default and Pi answers only when a caller or the environment asks for it by name (D1).
- Installing anything, adding a provider or moving a credential. Pi's own store holds its credentials, and Pi 0.99.1 is already installed.
- Writing a key anywhere, opening a `.env` file or printing an environment variable.
- A live model call as part of the build. Tests stub both backends, and one small live smoke call is optional and gated on the operator's yes.

### Follow-Up List (runtime-tree callers, read-only here)

The context's grep found 21 script files that spawn `jev` directly, and its owner breakdown names 20. The 13 below sit in runtime trees another packet owns. Each is recorded here so a later phase can wire the ones it owns, and none is edited now.

| Skill tree | Caller file | Question type |
|------------|-------------|---------------|
| system-deep-loop | `deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` | `choice` |
| system-deep-loop | `deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | `noul` |
| system-deep-loop | `deep-review/scripts/score-residue-flagger.cjs` | `noul` |
| system-deep-loop | `runtime/scripts/score-fanout-pairs.cjs` | `noul` |
| system-deep-loop | `runtime/scripts/score-severity-replay.cjs` | `choice`, `noul` |
| system-deep-loop | `runtime/scripts/score-stop-hint.cjs` | not named in the context |
| system-deep-loop | `runtime/scripts/score-stop-rater.cjs` | `score` |
| system-skill-advisor | `runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | `choice`, `noul` |
| system-skill-advisor | `runtime/scripts/routing-accuracy/score-suggested-order.mjs` | `choice` |
| system-spec-kit | `runtime/cli/evals/score-alignment-suggestion.ts` | `choice` |
| system-spec-kit | `runtime/cli/retrieval/score-track-narrowing.mjs` | `choice` |
| system-spec-kit | `runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | `noul` |
| system-spec-kit | `runtime/scripts/debug-next-check/score-debug-next-check.mjs` | `choice` |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Create | The transport module. Proposed name |
| `.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` | Create | Every public surface, both backends stubbed, `node --test`. Proposed name |
| `.skilled/skills/cli-classifier/cli-jev/SKILL.md` | Modify | The Pi route, the switch and the gate rule next to the CLI route |
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modify | A short classifier section for Pi workers |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md` | Create | One catalog entry through sk-doc. Proposed name |
| `.skilled/skills/cli-classifier/feature-catalog/feature-catalog.md` | Modify | The index row for the entry above |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-integration.md` | Create | One playbook scenario through sk-doc. Proposed name |
| `.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md` | Modify | The index row for the scenario above |
| Design-approved `choice` callers inside cli-classifier, sk-doc and sk-communication | Modify | One call site each, only after the design approves it. Proposed until then |
| This phase folder's six docs, plus `description.json` and `graph-metadata.json` through `repair-derived.cjs` | Modify | The phase record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **The default is untouched.** With the switch unset, every changed caller prints what it printed before, byte for byte, on a stub-backed run. The transport spawns `jev` exactly as the caller did and adds no line, no delay and no file. Boundary: an empty switch value means unset |
| REQ-002 | **Pi answers only when asked for by name.** A caller opts in through the function option or the environment switch (name proposed in section 10), resolved in one place. A set but unknown value prints one line and stays on the CLI. The transport never switches silently |
| REQ-003 | **Only `choice` moves.** A `choice` request may reach Pi. `bool`, `score`, `noul` and every other type stays on the CLI and reaches no Pi call. Adopting another type needs its own measured run under 037's keep rule (D2) |
| REQ-004 | **The caller's parse does not change.** The transport returns the shape callers read from the jev CLI's JSON today, so an opting-in caller changes one call, not its parsing (D3). The design records the exact shape from `cli-jev/SKILL.md`'s Output Contract and from each caller it wires |
| REQ-005 | **The gate-failure rule is fixed here and never silent.** When Pi is asked for but a gate fails, the transport prints exactly one skip line naming the failed gate, then falls back to the `jev` CLI (D4). When the CLI is also unavailable, it stops with the CLI's own error and exit status, exactly as today. The rule block below is fixed at spec approval |
| REQ-006 | **The transport never handles a credential.** It calls `ModelRuntime.create()` and lets Pi resolve credentials from its own store. It never reads, prints, stores or passes a key, and never opens a `.env` file. `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the module exits 1 |
| REQ-007 | **Tests stub both backends.** Each public surface gets a happy path and one edge case. No test opens a network socket, calls a model or needs a credential |
| REQ-008 | **Runtime trees stay untouched.** No file under the system-deep-loop, system-skill-advisor or system-spec-kit runtime trees changes, and the phase records the 13 callers of the follow-up list with their paths and question types |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | **Docs through sk-doc.** `cli-jev`, the `cli-pi/SKILL.md` classifier section, the catalog entry with its index row and the playbook scenario with its index row each pass `validate_document.py` VALID, and no doc claims a measurement no run printed |
| REQ-010 | **Executors and scope (parent D5 through D6).** DeepSeek V4.1 Flash writes, SWE 2 max on cli-devin reviews (Luna 6 max fast on cli-codex as the second reviewer), no MiMo or Claude worker writes or reviews. P0 and P1 findings are fixed and rechecked, P2 findings are recorded. Only section 3's files change, and code comments carry no spec path, phase number or requirement id |
| REQ-011 | **The invariance proof is byte-level.** The switch-off check runs each changed caller against a stub `jev` before and after the change and compares bytes with `diff`, not exit codes alone. The outputs sit under `scratch/verify/` |
| REQ-012 | **The live smoke call is optional.** A small live `choice` call runs only on the operator's yes, and no build step depends on it |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:gate-rule -->
### Gate-Failure Rule (fixed at spec approval)

The rule below is the context's proposed frame, fixed here at spec approval. Changing it after the build starts is an amendment.

**Gates, checked in this order. The first failure stops the Pi path.**
1. The Pi package resolves, at the installed 0.99.1 root.
2. A classifier model is available on the chosen provider, `openrouter` `typesafe/jev-1.13` for the 037 identity.
3. A Pi credential is present for that model in Pi's own store.

**On a gate failure.** The transport prints exactly one skip line naming the failed gate, then does what the caller would have done today: it calls the `jev` CLI. The skip line's exact wording is the design's to fix (proposed: `skip: pi transport unavailable (<gate>), using jev CLI`). If the CLI is also unavailable, meaning `command -v jev` fails or `jev auth status` exits 3, the caller stops with the CLI's own error and exit status, exactly as today.

**What never happens.** A gate failure never calls Pi. A gate failure never changes the answer's type or shape. A switch that names Pi never falls back without printing its one skip line. The Pi path is entered only after all three gates pass.
<!-- /ANCHOR:gate-rule -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the switch unset, every changed caller prints byte-identically to its pre-change run on a stub `jev`, proved by an empty `diff`.
- **SC-002**: With the switch on, a `choice` question answers through Pi and returns the CLI's result shape, proved by tests with both backends stubbed.
- **SC-003**: Each gate failure prints exactly one skip line and follows the section 4 rule, proved by a test per gate.
- **SC-004**: `cli-jev` and `cli-pi/SKILL.md` document the Pi route, every changed doc is VALID under `validate_document.py`, and `validate.sh --strict` prints `RESULT: PASSED` for this phase.
- **SC-005**: The 13 runtime-tree callers stay unedited and are listed in section 3 with their paths and question types.

### Proof Plan

Written before the build. `M` is the proposed `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`, `T` its test file (proposed) and `STUB` a directory of logging `jev` and Pi backend fixtures.

1. With `STUB` first on `PATH` and the switch unset, each changed caller runs and its stdout matches a pre-change recording byte for byte (`diff` empty), and the stub log matches the caller's old calls. Boundary: an empty switch value behaves as unset.
2. `node --test $T` exits 0 with one happy path and one edge case per public surface, both backends stubbed. Boundary: a Pi answer with no probability for a submitted key prints one skip line and falls back to the CLI.
3. With the switch on and the Pi backend stubbed, `M` returns the CLI-shaped result for a `choice` question. Boundary: a `bool` or `score` request never reaches the Pi stub, and each of the three gate failures prints one skip line then the CLI's result.
4. With the switch on and no CLI available, the caller stops with the CLI's own error and exit status, and no Pi call happens.
5. `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every changed doc, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration --strict` prints `RESULT: PASSED`.
6. `git diff --stat` on the three runtime trees is empty and the follow-up list names all 13 callers.

**Kill criterion.** A transport that changes default-path output, switches transports without its one skip line, or adopts `bool` or `score` without their own measured run closes nothing. A stub or vitest result never substitutes for the operator's yes on a live call.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 037 Complete | The phase has no measured basis | Complete, recorded in the parent goal |
| Dependency | Pi 0.99.1 with a credential in its own store | The Pi side cannot answer | 7 of 12 classifier models available through `openrouter` per the 037 probe |
| Dependency | `jev 0.6.2` on `PATH` | The default route and the fallback disappear | Pinned in `cli-jev/SKILL.md:97`, and the gate rule stops cleanly when it is absent |
| Dependency | The design's caller approval | Wiring could stall | Docs and the module proceed without any caller change |
| Risk | A caller's parse shape may differ from the transport's return shape | High | The design reads each candidate call site and the Output Contract before any wiring, and a mismatch keeps that caller on the CLI |
| Risk | A changed caller's switch-off output could pick up a line or a delay | High | REQ-001's byte-for-byte `diff` gates every caller change before it lands |
| Risk | The Pi SDK import may be slow or log on import | Med | The design measures the import cost on the stub path, and the switch-off path imports nothing from Pi |
| Risk | Moving the 037 scorer's Pi helpers could change the scorer | Med | Section 10's second question fixes move-versus-copy, and the scorer's 41-case suite must stay green either way |
| Risk | A child process of a changed caller could inherit the environment switch | Med | The design checks each approved caller's process tree and the switch is read once at the call |
| Risk | Scope pressure to adopt `bool` or `score` from the same measurement | Med | REQ-003 keeps every non-`choice` type on the CLI, and each type needs its own run under 037's keep rule |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The switch-off path adds no measurable wall time beyond one environment read on a stub-backed run.
- **NFR-P02**: The switch-on path uses Pi's own measured numbers, p95 340 ms on the 037 identity, as its reference. No new latency budget is claimed.

### Security
- **NFR-S01**: No key, token or `.env` file is read, written or printed. Credentials stay in Pi's own store.
- **NFR-S02**: The key grep in REQ-006 exits 1 on the module, and no file outside section 3's scope changes.

### Reliability
- **NFR-R01**: A switch-off run is byte-identical across repeats.
- **NFR-R02**: A gate failure is deterministic and prints exactly one skip line per attempt.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Switch unset, empty, `jev`, `pi` and an unknown value each have one defined route.
- A `choice` question with a partial Pi probability map prints one skip line and falls back to the CLI.
- A request whose type is not `choice` never reaches Pi.

### Error Scenarios
- No Pi package, no classifier model or no credential: one skip line, then the CLI.
- The CLI also unavailable: stop with the CLI's own error and exit status.
- A backend refusal, timeout or malformed Pi answer: one skip line, then the CLI, with the row never counted as a judgment.
- A credential reference appearing anywhere in the module: stop and remove it before any run.

### State Transitions
- A switch-off run leaves no state behind.
- A switch-on run leaves no state behind beyond what the caller already wrote.
- An interrupted run leaves neither a half-written file nor a changed default.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | One module, one test file, up to three one-call-site caller changes, four doc surfaces |
| Risk | 8/25 | Opt-in only, the default path is proven byte-identical, and no runtime tree is edited |
| Research | 6/20 | The design reads the 037 scorer, the CLI Output Contract and each candidate caller |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **What is the switch called?** Proposed: the environment value `JEV_TRANSPORT=pi` plus a per-call function option (for example `{ transport: 'pi' }`), resolved in one place, with unset or `jev` meaning today's CLI. The design fixes the exact names and the unknown-value line.
- **Do the 037 scorer's Pi helpers move into the module or get copied?** The helpers are `resolvePiPackage`, `toClassifierContext`, `probabilitiesFrom` and the `ModelRuntime.create()` plus `getModelOfType('classifier', 'openrouter', 'typesafe/jev-1.13')` pairing in `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs`. UNKNOWN until the design reads the scorer's imports and test seams. Proposed: the module owns the helpers and the scorer imports the module when that is one line and its 41-case suite stays green. Otherwise the module copies them and the scorer stays byte-identical.
- **Which `choice` callers opt in during this phase?** Proposed: none until the design reads them. The candidate `choice` callers in skills this phase may edit are `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` and `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`. The design approves a caller only when the change is one call site and its switch-off output stays byte-identical. sk-communication's `benchmark/reply-harness/judge-agreement.mjs` is `score`, so it is out.
- **Is a small live smoke call wanted?** Proposed: no by default. On the operator's yes, one `choice` call through the transport, recorded under `scratch/`, with no build step depending on it.
- **Do recorded baselines exist to measure `bool` and `score` later?** UNKNOWN until the design reads the recorded runs. The 019 baseline holds `choice` calls only, and the 037 run measured `choice` only. `bool` (for `noul`) and `score` stay on the CLI until each passes its own run under 037's keep rule.
<!-- /ANCHOR:questions -->

---
