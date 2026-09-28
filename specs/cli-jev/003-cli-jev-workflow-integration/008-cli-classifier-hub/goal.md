---
title: "Goal: Phase 8: cli-classifier-hub"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cli-classifier hub goal"
  - "cli-deem completion criteria"
  - "deem client goal binding"
  - "cli-deem health smoke"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub"
    last_updated_at: "2026-09-28T11:40:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed from build and session evidence, 7 of 7 criteria ticked, criterion 6 amended"
    next_safe_action: "Orchestrator commits these docs, then the operator decides on admission"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub/scratch/build/build-evidence.md"
      - ".skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How does a hook caller select the 500 ms health budget: the --hook flag, 2026-09-28"
      - "Does the new hub need compiled-route admission for stage 2: no, an in-memory replay suffices and admission is a follow-up, 2026-09-28"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: cli-classifier-hub

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every Deem arm one local transport by minting the `cli-classifier` hub with `cli-deem` as its first mode, a Node standard-library client that posts Deem's request shape, prints `jev-cli`'s answer shape and implements the Deem check as `cli-deem health`, while `cli-jev` stays where it is.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Parent D1 binds: every feature runs on Jev or Deem and stays dormant unless one is available. Jev is available when `jev auth status --provider <p>` exits 0. Deem is available when the local server passes a health check that refuses the stub backend. With neither, behavior is exactly today's. Jev gets no secret. `cli-deem health` is that Deem check: HTTP 200 within 2,000 ms (500 ms in a hook), `status` `ok`, backend `torch` or `ensemble:` without `stub`, model `deem-0.8-v1`, then the commit pair. The hub has no switch, and each caller keeps its own |
| D2 | The client never starts, stops, updates or rolls back the server. The packet documents `deem-ctl` (install, `start`, `status`, `update`, `rollback` with its hold) and never reimplements it. A keep survives an update only by requalification on its commit pair |
| D3 | One file, `node:` built-ins only, no bearer, no `--provider`. Exits mirror `jev-cli`: 0, 1 (HTTP 400), 2 (usage, or over 26 options or 64 questions), 3 (stub or foreign model), 4 (unreachable) and 130. With no server every subcommand exits 4 |
| D4 | Only the hub, this phase folder and generated files change: the advisor graph, the trigger index and its three fixtures, the Hermes copies `.hermes/skills/cli-classifier/SKILL.md` and `.hermes/skills/cli-deem/SKILL.md` and, only if the hub is admitted to compiled routing, its activation manifest under `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-classifier/` and that manifest's `specs/sk-doc/019` mirror. `cli-jev` moves in phase 009, not here. Nothing calls the real server except the orchestrator's one smoke |
| D5 | Kill: the per-hub check fails or a replayed Deem request routes elsewhere. Revert the hub commit |
| D6 | Parent D5 and D6 bind. A fresh Opus 5.5 xhigh build orchestrator writes single-change briefs and runs CLI executors by Bash only: Devin `deepseek-v4-1-flash-max`, Cursor `grok-4.7-xhigh-fast` and Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh` once a probe passes. The orchestrator session verifies, gets a cross-family review of the code and commits. `SKILL.md`, README, changelog, feature catalog and playbook go through sk-doc, and code follows sk-code's OpenCode route |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0, and its `mode-registry.json` lists one mode, `cli-deem`, with `packetKind` `transport`
- [x] `node --test` on `.skilled/skills/cli-classifier/cli-deem/scripts/tests/` exits 0 against an in-test fake server, with cases where a stub backend and a wrong model id exit 3, a refused connection exits 4, an HTTP 400 exits 1, 27 options, 65 questions and duplicate descriptions exit 2 and an answer round trip returns `noul`, `score` and the submitted choice key
- [x] `grep -nE 'Authorization|Bearer|API_KEY|deem-ctl'` on `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` returns no match, and every import in it is a `node:` built-in
- [x] A two-stage route replay of a Deem prompt names hub `cli-classifier` at stage 1 and mode `cli-deem` at stage 2
- [x] One live `cli-deem health` run by the orchestrator exits 0 and prints `torch`, `deem-0.8-v1` and the commit pair `8cbabbb` and `6755b30`, or the pair `deem-ctl status` prints if a release landed after 2026-09-27
- [x] The build commit `ee3a1b057c` and the trigger index commit `cdc790c48b` touch only paths under `.skilled/skills/cli-classifier/`, this phase folder, `skill-graph.json`, the trigger index and its three fixtures, `.hermes/skills/cli-classifier/SKILL.md` and `.hermes/skills/cli-deem/SKILL.md` and, only if the hub was admitted to compiled routing, the two `activation/cli-classifier/manifest.json` files. `git diff --stat 735d1b0956..cdc790c48b -- .skilled/skills/cli-jev` is empty
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | 2026-09-27: `spec.md`, `plan.md`, `tasks.md`, this goal and `implementation-summary.md` authored from `007-classifier-deep-research/research/research.md` section 14 (`### 008-cli-classifier-hub (new)`), section 12 (`### R23.` and the shared two-backend gate contract) and section 3 |
| Approval | Recorded | Section 14 says each phase waits for operator approval. The parent goal's D2 requires the hub and `cli-deem`, and its fourth criterion requires each proposed phase as a Planned child, so the operator has approved authoring it. Status stays Planned |
| Release | Done | 2026-09-28: the operator released this phase for the build (parent `goal.md` D3). Source: the orchestrator's closure brief |
| Executor pre-flight | Done | 2026-09-28, session: `cursor-agent about` authenticated, exit 0. Pi on Cline answered `PONG` on `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh`, exit 0. `devin auth status` printed "Logged in", exit 0. Source: session evidence, "Executor pre-flight" |
| Build | Done | 2026-09-28, from HEAD `735d1b0956` on a clean tree: 14 briefs, cursor 4 for the code and pi 10 for the docs, each DONE on its first dispatch. Briefs 13 and 14 were corrections, not retries. Proof rows 1 to 4, 6 and 7 passed, with 28 of 28 tests. Source: `scratch/build/build-evidence.md` sections 2 and 3 |
| Host verification | Done | 2026-09-28, the session on the uncommitted build: 32 paths in scope, `parent-skill-check.cjs` exit 0, 28 of 28 tests, the key grep exit 1, both replay stages and the live `health` exit 0. Its gate rerun matched the build's final. Source: session evidence, "008 host verification" |
| Review, round 1 | FAIL | A Claude `review` agent, read-only, found 2 P1 and 5 P2. The P1s: two `-o` options sharing a key overwrote each other at exit 0, and `--hook` and the timeout had no test. The host confirmed each against the code. Source: session evidence, "008 cross-family review, round 1" |
| Review fixes | Done | Briefs 15, 16, 17 and 19 (cursor) and 18 (pi). Host recheck: 34 of 34 tests, the smoke exit 0, a non-loopback `CLI_DEEM_URL` exits 2, a repeated key exits 2, the key grep exit 1, `parent-skill-check.cjs` exit 0, Hermes 73 in sync and 24 docs valid. Source: session evidence and `build-evidence.md` section 8 |
| Review, round 2 | PASS | The same reviewer found both P1s and the URL P2 fixed, with no new P0 or P1. It probed 17 URL forms, and every accepted form reached loopback. It named three new P2 follow-ups. Source: session evidence, "008 review fixes and round 2" |
| Commit | Done | `ee3a1b057c`, 94 files: 29 hub files, 2 Hermes copies, `skill-graph.json` and 62 force-added build-record files. The session then rebuilt the trigger index from an archive of HEAD in `cdc790c48b`, and `--check` reports 23,311 documents, 0 stale, 0 obsolete and 0 untrusted. Source: session evidence, rechecked with `git show --name-only` |
| Live smoke | Done | `cli-deem health` exit 0 with `torch`, `deem-0.8-v1`, `8cbabbb...` and `7cf293f...`, before and after the review fixes. Source: session evidence |
| Phase docs | Done | 2026-09-28, closure leaf: `tasks.md`, this goal, `spec.md`, `plan.md` and `implementation-summary.md` record the evidence. The gate results are in `implementation-summary.md` Verification. Status Complete |

### Deviations and findings

| Item | Note |
|------|------|
| D1 wording | The parent's D1 joins its two checks with a semicolon, which the voice rules ban. The same content is split into sentences, with "refuses the stub backend" taken from section 3's Deem check |
| Playbook and benchmark | Section 14's likely files (swe-07's list) omit `manual-testing-playbook/` and `benchmark/`. `parent-skill-check.cjs:1119-1129` fails without them under the default strict mode, and passing that check is section 14's observable check, so both are added to the file list |
| Test path | Section 14 names "`scripts/cli-deem.mjs` and its test". This phase places the test at `scripts/tests/cli-deem.test.mjs` under `node --test`, which keeps the client dependency-free |
| Duplicate descriptions | The synthesis says the client refuses them and names no exit code. This phase reads it as a usage error, exit 2 |
| Missing commit-pair path | Not in the synthesis. This phase reads it as a config error, exit 2, so `health` never prints a partial pair |
| Hook budget flag | The synthesis sets 2,000 ms offline and 500 ms in a hook and names no flag. Left open in `spec.md` section 7 for the build to fix |
| Stage-2 replay | The synthesis lists compiled-route literals only for 009. Whether the new hub needs compiled-route admission for stage 2 is left open in `spec.md` section 7 |
| Level 1 has no `acceptance-criteria.md` | The criteria above come from `spec.md` REQ-001 to REQ-013 and its proof plan |
| Amendment: build roles (2026-09-28) | Source: D5 of the parent `goal.md` and its log row "New directive, wave 3". New D6 names the build orchestrator, the three executors with their models and the orchestrator session's verify, cross-family review and commit. The same text went into `plan.md` (Build Roles) and the `tasks.md` notation. No builder wording contradicted it: a search of this folder for codex, gpt-5, `llmgateway`, Opus 5.5 high, Devin, Cursor and Cline found only the word "builder" in T006 (the request builder) |
| Amendment: sk-doc, sk-code and generated paths (2026-09-28) | Source: D6 of the parent `goal.md`. D6 here routes the hub's docs through sk-doc and its code through `sk-code-opencode`, and `cli-deem/feature-catalog/` joins the file list (the one D6 doc missing). D4, criterion 6, REQ-008, the scope and Files to Change now name the generated paths, each found in the repository: the Hermes copies (`sync-skills-hermes.cjs:20-21`, `:51-68`, `:139-143`, `:266-267`, CI at `command-tree-parity.yml:65`), the trigger index fixtures (`generate-trigger-index.mjs:76-79`) and the activation manifest pair (`.skilled/scripts/git-hooks/pre-commit:318-321`, `:345-346`, `:404-405`, `:421-439`). The pair appears only for a hub in `compiled-route-guard.cjs:45-53`, so D4 and the criterion name it conditionally. Criterion 6 also gained "this phase folder", because T020 edits `implementation-summary.md` and the derived-metadata hook stages this folder's `graph-metadata.json` and `description.json`. No criterion was dropped |
| Conflict: compiled-route admission | Admitting the hub to compiled routing edits hand-kept lists outside the hub (`compiled-route-guard.cjs:45-53` and the others phase 009 names), which D4 forbids. `spec.md` section 7 keeps the admission question open and routes a yes back to the orchestrator as an amendment. Named, not resolved |
| Conflict: retiring `cli-deem` | `spec.md`'s kill criterion and its last risk row still say R23 retires `cli-deem` when no Deem arm yields a kept result (`../007-classifier-deep-research/research/research.md:800`). Parent D2 keeps `cli-deem` in the hub, and parent D4 only leaves 009 Planned. Left as written and named for the orchestrator |
| Hook budget flag answered (build) | The build named the flag `--hook`. It sets 500 ms on any subcommand, while `health` otherwise waits 2,000 ms and a judgment 60,000 ms. The 60,000 ms judgment budget is not in the spec. `spec.md` section 7 now records the answer. Source: `build-evidence.md` section 6, item 4 |
| Stage-2 replay answered (host ruling) | This phase needs no compiled-route admission. Stage 2 ran in memory through `scratch/build/replay/stage2-replay.cjs`, which feeds this hub's files to the rollout compiler and router. The front door prints the legacy sentinel for this hub, and admission is a follow-up for the operator. `spec.md` section 7 now records the answer. Source: session evidence, "Spec pass for 008, 016, 009 and the parent" |
| Conflict resolved: retiring `cli-deem` (host ruling) | Parent D2 wins over R23's retire rule, so `cli-deem` stays whatever the arms return. R23's rule that 009 is never built without a keep stands, as parent D4 says. `spec.md`'s kill criterion and last risk row now say so. Source: session evidence, "Spec pass for 008, 016, 009 and the parent" |
| Doc delivery by payload (build) | The orchestrator wrote each doc as a payload to the sk-doc template, and pi copied it with `cp`. Executors ran only `grep -c`, and the orchestrator ran `cmp` on every target. Source: `build-evidence.md` section 6, item 1 |
| Scaffold outside the tree (build) | `init_skill.py` ran into the session scratchpad, not the tree. The build read the canonical parent shape from it rather than from `cli-jev`, as T002 had said. Source: `build-evidence.md` section 6, item 2 |
| `score` shape (build) | `score` is the zero-based index of Deem's `level`, the probabilities are rekeyed `0` to `n` and `expected` passes through. That matches `jev`'s numeric shape, and it is a judgment call. The review keeps the fractional `expected` as a follow-up. Source: `build-evidence.md` section 6, item 3 |
| Packet extras (build) | The packet carries `README.md` and `changelog/`, which Files to Change does not list, because `parent-skill-check.cjs` check 3d-files requires both. Source: `build-evidence.md` section 6, item 5 |
| Compiled-routing directive (build) | In the hub `SKILL.md` the build replaced the directive's two em dashes with a colon and a period. All four validator markers are intact, and the hub is not in the lockstep inventory. Source: `build-evidence.md` section 6, item 6 |
| One graph edge (build) | `graph-metadata.json` carries `enhances system-spec-kit` at weight 0.3, because the graph compiler blocks a skill with zero edges. `enhances` has no symmetry rule, so no other skill changed. The target is a judgment call, and the review asks to reword the edge while no runtime caller exists. Source: `build-evidence.md` section 6, item 7, brief 13 |
| Vocabulary narrowing (build) | Generic keywords such as `choice`, `score`, `noul` and `transport` ranked this hub 0.82 on "use jev choice to pick a queue". Every keyword, key topic and domain now names Deem, and the trigger examples were rewritten. Source: `build-evidence.md` section 6, item 8, brief 14 |
| Deem facts corrected before dispatch (build) | An oversized body gets HTTP 413, the server also rejects duplicate options, `deem-ctl update --check` can exit 2 and `deem-ctl status` prints `stopped`. No phase doc stated otherwise. Source: `build-evidence.md` section 6, item 9 |
| Pre-existing graph drift (build) | `skill-graph.json` at HEAD was already stale in its sk-doc signals, and the regenerated file carries that drift. This build adds only the `cli-classifier` entries, `families/cli` and `skill_count`. Source: `build-evidence.md` section 6, item 10 |
| Trigger index rebuilt by the session (build) | The build did not regenerate it, by the orchestrator's ruling, and its `--check` exited 1 with the 16 new documents missing. The session rebuilt it from an archive of HEAD after the commit, in `cdc790c48b`. Source: `build-evidence.md` section 6, item 11, and session evidence |
| Premise drift: source commit (build) | The served Deem source commit is `7cf293f`, not the `6755b30` the spec cites, because the six-hourly updater took a release at 2026-09-28T00:15:57Z. The model commit is still `8cbabbb`. Criterion 5 and REQ-013 allow the pair `deem-ctl status` prints, and `plan.md` step 5 now names the served pair. Source: `build-evidence.md` section 7 and session evidence, "Deem service" |
| Deem server found stopped (session) | At 11:35 `deem-ctl status` printed `stopped` and `server.pid` held a dead pid, with no reboot. The session ran `deem-ctl start` before the smoke, with `deem-ctl stop` as the rollback. The cause of the stop is UNKNOWN. Source: session evidence, "Deem service" |
| Behavior past the spec (build) | Three client rules came from review round 1 and are not in `spec.md`. A repeated option key exits 2. `CLI_DEEM_URL` must be `http://` on `127.0.0.1`, `localhost` or `[::1]`, or the client exits 2. An IPv6 loopback is dialed without its brackets. The client also reads `CLI_DEEM_URL` and `CLI_DEEM_HOME` overrides the spec does not name. Source: `build-evidence.md` section 8 and briefs 01, 15, 17 and 19 |
| Build record committed (session) | `scratch/build/` is gitignored (`.gitignore:57`). The session force-added `build-evidence.md`, `briefs/`, `replay/` and `proof/`, 62 files, in `ee3a1b057c`. `baseline/`, `final/`, `logs/` and `session-final/` stay out of git. Source: session evidence, rechecked with `git ls-files` |
| Compiled-routing scenario validator (build) | `validate-compiled-routing-scenarios.cjs` fails all 3 hub scenarios, and it fails the `cli-jev` hub playbook 3 of 3 the same way. It targets compiled-routing scenario folders, so it does not apply to this hub. Source: `build-evidence.md` section 5 |
| Document type warnings (build) | `ROUTER.md`, the packet feature catalog root and the playbook root each carry one `document_type_fallback` warning. Each gives 0 issues with an explicit `--type`, and the `cli-jev` equivalents show the same warning. Source: `build-evidence.md` section 5 |
| Node test runner (build) | The repository's node-tests runner exits 1 at baseline and final, because `.opencode/node_modules` is absent, so it skips 94 node:test files including the new one. Proof row 2 runs the new file directly. Source: `build-evidence.md` section 4 |
| Advisor vitest rerun (session) | The build's baseline and final were 129 files, 971 passed and 6 skipped. The session's rerun during the build failed 3 tests in `skill-advisor-launcher-orphan-reaping.vitest.ts`. The confirmed cause is a test helper that reads `ps` with the default 1 MiB buffer while the process table held 1,399,510 bytes, which returns `ENOBUFS`. No advisor code changed. With the process table at 1,026,949 bytes, under the 1 MiB default, `npx vitest run tests/skill-advisor-launcher-orphan-reaping.vitest.ts` from `.skilled/skills/system-skill-advisor/runtime` passed 8 of 8, exit 0, which confirms the cause. The full suite at HEAD `cdc790c48b` then gave Test Files 129 passed, Tests 971 passed and 6 skipped, exit 0, equal to the baseline. The helper's missing `maxBuffer` stays a follow-up outside this phase. Source: session evidence and the orchestrator's update of 2026-09-28 |
| Executor permission (session) | cli-devin requires explicit approval for `--permission-mode dangerous`, and the session read it as given by parent D5 with D7. Devin ran no brief in this phase. Source: session evidence, "Executor pre-flight" |
| Client and test size (closure) | `spec.md` estimated about 170 lines for the client and about 150 for the tests. `wc -l` prints 784 and 969. Source: `wc -l` while closing these docs |
| Parent changelog not refreshed (closure) | `spec.md` Phase Context asks for a refresh under `../changelog/`. The parent packet has no `changelog/` folder, and no earlier phase of this packet wrote one. Creating it is outside this closure's write scope. Source: the orchestrator's closure brief, rechecked with `ls` on the parent folder |
| Proposed markers removed (closure) | The planning docs marked the hub, the client and its test file "(proposed)", which the research defines as not existing yet. All now exist in `ee3a1b057c`, so the marker is gone from them in `spec.md`, `plan.md`, `tasks.md`, this goal and `implementation-summary.md`. Names that still do not exist, such as a caller's `--deem` switch, keep it. Source: `test -e` on each path while closing these docs |
| Follow-ups (review and build) | Not fixed here. `score` keeps the level index beside Deem's fractional `expected`. `run`'s per-question option cap, a missing source tree and exit 130 have no test. The graph edge's wording claims a caller that does not exist yet. A path, query or fragment in `CLI_DEEM_URL` rewrites the request path, so it exits 1 against the real server instead of 2. The refusal message echoes userinfo, and `--hook` is tested only on `health`. At stage 1 `cli-jev`'s own generic keywords rank it 0.82 second on Deem prompts, which is phase 009's to fix, and "run a batch of typed questions through deem" ties at 0.82 across `cli-classifier`, `cli-jev` and `mcp-code-mode`. Source: session evidence and `build-evidence.md` sections 8 and 9 |
| Amendment at close: criterion 6 | 2026-09-28, closure leaf. The old wording read "`git status --porcelain` lists only paths under" the allowed set. After the commit `git status` cannot show the build's paths, so the check would pass on an empty status and prove nothing, and in this shared worktree it also lists other leaves' edits. The requirement is that the phase changes only the allowed paths, so the criterion now reads the build commit, the trigger index commit and the `cli-jev` diff over both. Evidence: the session saw 32 in-scope paths before the commit. `git show --name-only` shows `ee3a1b057c` holding those paths plus 62 build-record files in this folder and `cdc790c48b` holding the trigger index with its three fixtures. The `cli-jev` diff is empty, and no activation manifest exists. The operator can revert this amendment |
<!-- /ANCHOR:log -->
