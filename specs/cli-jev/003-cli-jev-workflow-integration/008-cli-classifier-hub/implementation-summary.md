---
title: "Implementation Summary: cli-classifier Hub with the cli-deem Client"
description: "The cli-classifier hub exists with one transport mode, cli-deem: a Node standard-library client for the local Deem server. 34 fake-server tests pass, the per-hub check passes, a Deem prompt routes to cli-deem at both stages and the live health smoke printed the served commit pair. Built in ee3a1b057c after two review rounds."
trigger_phrases:
  - "cli-classifier hub summary"
  - "cli-deem status"
  - "cli-deem build result"
  - "deem client results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub"
    last_updated_at: "2026-09-28T11:40:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed from build and session evidence, 20 of 20 tasks and 7 of 7 criteria done"
    next_safe_action: "Orchestrator commits these docs, then the operator decides on admission"
    blockers: []
    key_files:
      - ".skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs"
      - ".skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs"
      - ".skilled/skills/cli-classifier/mode-registry.json"
      - "specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub/scratch/build/build-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should cli-classifier be admitted to compiled routing, and when"
      - "Why was the Deem server stopped before 11:35 on 2026-09-28"
    answered_questions:
      - "How does a hook caller select the 500 ms health budget: the --hook flag, 2026-09-28"
      - "Does the new hub need compiled-route admission for stage 2: no, an in-memory replay suffices and admission is a follow-up, 2026-09-28"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: cli-classifier Hub with the cli-deem Client

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-cli-classifier-hub |
| **Status** | Complete |
| **Completed** | 2026-09-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every Deem arm now has one local transport. The new `cli-classifier` hub holds one transport mode, `cli-deem`, and `cli-jev` stays where it is until phase 009.

### Phase 8: cli-classifier-hub

**The client.** `cli-deem.mjs` is one file that imports only `node:` built-ins. It takes `jev`-like flags and posts Deem's own request shape to `127.0.0.1:8300/v1/systemone`. `noul` sends `instructions`, `choice` sends the descriptions as an `options` list and `score` sends `levels`. `run` sends a Deem-shaped batch file unchanged. On the way back the client renames `value` to `noul`, turns the chosen description back into its submitted key and turns `level` into its zero-based index as `score`, rekeying the probabilities the same way. So a reader written for `jev` output reads Deem output with no second parser.

**The Deem check.** `cli-deem health` asks `GET /health` within 2,000 ms, or 500 ms with `--hook`. It refuses the stub backend and any model other than `deem-0.8-v1` with exit 3. Then it reads the commit pair from the checkpoint link and the source tree and prints the backend, the model id and both commits on one line. It never starts, stops or updates the server. `deem-ctl` owns that, and the packet only documents it.

**Refusals before any request.** More than 26 options or 64 questions, a repeated description, a repeated key, a missing `-o` or `-l` and a flag given to the wrong subcommand all exit 2 while the fake server logs no request. `CLI_DEEM_URL` must be `http://` on `127.0.0.1`, `localhost` or `[::1]`, and the reviewer probed 17 URL forms without finding an accepted one that left the machine. Exits mirror `jev-cli`. Exit 1 means an HTTP 400 or an unexpected body, 3 a refused backend and 4 nothing listening, a timeout or a 5xx. SIGINT exits 130.

**The hub.** The hub root carries the files a parent hub needs: `SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json` with its one `transport` mode, `hub-router.json`, `graph-metadata.json`, `description.json`, a generated `leaf-manifest.json`, a changelog, a playbook with three routing scenarios and a benchmark folder. The packet holds its contract, a README, a changelog, three references (the wire, the `deem-ctl` lifecycle and the model pin) and a feature catalog with one leaf per subcommand. Every hub keyword names Deem, because generic words such as `choice` and `score` had pulled Jev prompts to this hub.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Created | The client, 784 lines. Briefs 01 to 04, then 15, 17 and 19 after the review (cursor) |
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | Created | 34 fake-server tests, 969 lines. Briefs 01 to 04, then 15, 16, 17 and 19 (cursor) |
| `cli-classifier/cli-deem/SKILL.md`, `README.md`, `changelog/v1.0.0.0.md` | Created | The packet contract, overview and first changelog entry. Briefs 05 and 18 (pi) |
| `cli-classifier/cli-deem/references/wire-contract.md`, `deem-ctl-lifecycle.md`, `model-pin.md` | Created | The three references. Brief 06, and brief 18 for the wire (pi) |
| `cli-classifier/cli-deem/feature-catalog/` (root and 5 leaves) | Created | One entry per subcommand. Brief 07, and brief 18 for three files (pi) |
| `cli-classifier/SKILL.md`, `README.md`, `ROUTER.md`, `changelog/v1.0.0.0.md` | Created | Hub identity, overview, router and first changelog entry. Brief 08, `SKILL.md` again in 14 and `README.md` again in 18 (pi) |
| `cli-classifier/mode-registry.json`, `hub-router.json` | Created | One mode, `cli-deem`, `packetKind` `transport`, and its routing phrases. Brief 09 (pi) |
| `cli-classifier/manual-testing-playbook/` (root and 3 scenarios) | Created | Deem routes to the transport, Jev stays with `cli-jev` and an out-of-domain prompt resolves nothing. Brief 10 (pi) |
| `cli-classifier/benchmark/README.md`, `benchmark/reports/README.md` | Created | The benchmark folder the per-hub check requires. Brief 11 (pi) |
| `cli-classifier/description.json`, `graph-metadata.json` | Created | Hub metadata with one `enhances system-spec-kit` edge. Brief 12, then 13 and 14 (pi) |
| `cli-classifier/leaf-manifest.json` | Generated | `generate-leaf-manifest.cjs --write`, then `--check` exit 0 |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerated | `skill_graph_compiler.py --export-json`, exit 0 |
| `.hermes/skills/cli-classifier/SKILL.md`, `.hermes/skills/cli-deem/SKILL.md` | Generated | `sync-skills-hermes.cjs`, `--check` prints `PASS: 73 Hermes skill copies in sync` |
| The trigger index and its three fixtures under `.skilled/skills/system-spec-kit/runtime/` | Regenerated | Rebuilt by the session from an archive of HEAD, commit `cdc790c48b` |
| `scratch/build/` in this phase: `build-evidence.md`, `briefs/` (19 briefs, 26 payloads), `replay/`, `proof/` | Created | The build record, 62 files, force-added because `scratch/build/` is gitignored |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` in this phase | Modified | Closed from the evidence. Not yet committed |

The build commit is `ee3a1b057c`, 94 files: the 29 hub files, the two Hermes copies, `skill-graph.json` and the 62 build-record files. `cdc790c48b` rebuilt the trigger index. No activation manifest was written, because the hub was not admitted to compiled routing.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator session first merged `main` into this worktree (`bbf2a8e4cd`) and probed the executors. Cursor, Pi on Cline and Devin each answered, exit 0. A fresh build orchestrator then started from `735d1b0956` on a clean tree and sent 14 single-change briefs through `dispatch.sh`. Cursor took the 4 code briefs, and pi copied 10 doc payloads that the orchestrator had written to the sk-doc templates. Devin took none. Every brief returned DONE on its first dispatch, and briefs 13 and 14 were corrections the proof plan found, not retries. The build ran the leaf-manifest, graph and Hermes generators itself and left the trigger index to the session.

The session verified the uncommitted build against the first six goal criteria and ran the one live `health`. A Claude `review` agent then read the code and returned FAIL with two P1s: two `-o` options sharing a key overwrote each other at exit 0, and `--hook` and the timeout had no test. The host confirmed both. Fix briefs 15, 16, 17 and 19 went to cursor and brief 18 synced 8 docs through pi. The build orchestrator took a content-hash snapshot around each fix, because `git status` cannot see edits inside untracked files. The host rechecked the result, and the same reviewer returned PASS. The session committed `ee3a1b057c`, rebuilt the trigger index in `cdc790c48b` and handed this closure pass the evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A Node client, not the `jev --provider custom` wrapper or a translator | The wrapper cannot serve `choice` or `score` and needs a key the dispatch guard refuses. A translator forks a pinned package or adds a second daemon for four field renames (What Not To Build rows 75 and 76) |
| Answers in `jev-cli`'s shape | Every Planned arm already parses `jev` output, so one reader serves both backends |
| `health` pins the model and refuses the stub | The stub answers `status` `ok` with a `noul` of 0.5 for everything, and a server launched without `DEEM_MODEL_ID` reports `deem-1.5` |
| The client never touches the lifecycle | `deem-ctl` already proves an update with one real decision and holds a rejected release on rollback. A second copy would drift |
| The hub has no switch | It is a transport. Each caller keeps its own `--deem` switch (proposed), as the shared gate contract says |
| `--hook` names the hook budget | The synthesis set 500 ms for a hook and named no flag. One boolean flag on every subcommand keeps the call site short |
| `score` is the level's zero-based index | That is `jev`'s numeric shape. Deem's fractional `expected` passes through beside it, which the review keeps as a follow-up |
| Loopback-only `CLI_DEEM_URL` | Callers promise that nothing leaves the machine. Before the fix any `http://` host was accepted, which would have made that promise false |
| No compiled-route admission | Admission edits hand-kept lists outside the hub, and neither the per-hub check nor the hub-routing rule requires it. Stage 2 was replayed in memory instead. The orchestrator's ruling |
| `cli-deem` stays whatever the arms return | Parent D2 outranks R23's retire rule. 009 still waits on a Deem keep (parent D4). The orchestrator's ruling |
| One `enhances system-spec-kit` graph edge | The graph compiler blocks a skill with zero edges, and `enhances` needs no matching edge in another skill |
| `cli-jev` moves in 009, not here | The move touches 81 files under the hub and 48 that name it, and it waits on a pre-fixed Deem `keep` in 002 or 017 (D4 of the parent goal) |
| CLI executors build from single-change briefs | D5 of the parent goal: a fresh Opus 5.5 xhigh build orchestrator briefs the executors by Bash, and the orchestrator session verifies, gets a cross-family review and commits |
| Docs through sk-doc, code through `sk-code-opencode` | D6 of the parent goal. The hub gains a feature catalog in `cli-deem/`, where `cli-jev` keeps its transport's catalog |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every check ran from the worktree root. The first column names who ran it. The session's results win where the two records differ, because the session reran the gates from the final state.

| Check | Result |
|-------|--------|
| Session: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | Exit 0, "all hard invariants passed, 0 warnings", before and after the review fixes. `mode-registry.json` lists `{"workflowMode":"cli-deem","packetKind":"transport","packet":"cli-deem"}` |
| Session, after the fixes: `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/` | Exit 0, tests 34, pass 34, fail 0. The build's run before the fixes was 28 of 28 |
| Session: `grep -nE 'Authorization\|Bearer\|API_KEY\|deem-ctl'` on `cli-deem.mjs` and an import scan | No match, exit 1. No import outside `node:` |
| Closure, read-only on the committed file: the same grep, `grep -c -- '--provider'` and a positive control | Both exit 1 with no match. The same pattern finds 17 lines in `references/deem-ctl-lifecycle.md`. The six imports are `node:` built-ins |
| Session, stage 1: `advisor_recommend` | "is the local deem server healthy" to `cli-classifier` at 0.95. "use jev choice to pick a queue" to `cli-jev` alone at 0.9151. Before the hub, the Deem prompt returned no recommendation |
| Build and session, stage 2: `scratch/build/replay/stage2-replay.cjs "$PWD" cli-classifier ...` | Exit 0. All 6 Deem prompts route `single` to `["cli-deem"]`, and the Jev, out-of-domain and "deemed" prompts defer |
| Build: `compiled-route.cjs --hub cli-classifier` | `{"servingAuthority":"legacy","hubId":"cli-classifier"}`, exit 0, as expected without admission |
| Session, live: `node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs health` | Exit 0, `{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"8cbabbb2c4a7...","source_commit":"7cf293f9da45..."}`, the pair `deem-ctl status` prints. Same fields after the fixes |
| Session, after the fixes: refusal probes | `CLI_DEEM_URL=http://example.com:8300 ... health` exits 2, "CLI_DEEM_URL must be http:// on 127.0.0.1, localhost or [::1]". `choice -q Pick -s x -o a=Alpha -o a=Beta` exits 2, "duplicate option key: a" |
| Session, before the commit: `git status --porcelain --untracked-files=all` | 32 paths: 29 under `.skilled/skills/cli-classifier/`, the two Hermes copies and `skill-graph.json`. No `cli-jev` path |
| Closure: `git show --name-only` on `ee3a1b057c` and `cdc790c48b`, and `git diff --stat 735d1b0956..cdc790c48b -- .skilled/skills/cli-jev` | The 32 paths plus 62 build-record files in this folder, then the trigger index and its three fixtures. The `cli-jev` diff is empty |
| Build and session: `validate_skill_package.py .skilled/skills/cli-classifier` | Exit 0 |
| Session: `validate_document.py` on all 24 changed markdown files | 24 exit 0. Three carry one `document_type_fallback` warning each: `ROUTER.md`, the packet feature catalog root and the playbook root |
| Build: `validate_catalog_package.py --package cli-classifier/cli-deem --strict`, `validate-playbook-package.cjs --strict`, `validate-playbook-topology.cjs` | PASS. PASS with 0 violations. PASS, 3 of 3 valid |
| Session: `sync-skills-hermes.cjs --check` | `PASS: 73 Hermes skill copies in sync`, exit 0 |
| Session: `scratch/build/run-gates.sh scratch/build/session-final` | Matches the build's final. 8 hubs, 0 nonzero on `parent-skill-check.cjs`. Root metadata, leaf manifest, derived freshness, graph validate, route guard, admission, Hermes, frontmatter, markdown links, playbook strict and snake-case all exit 0. The node-tests runner exits 1 as at baseline, with 94 node:test files skipped because `.opencode/node_modules` is absent. The trigger index `--check` exits 1 with exactly the 16 new documents missing |
| Session, after `cdc790c48b`: trigger index `--check` | 23,311 documents, 0 stale, 0 obsolete, 0 untrusted |
| Build: advisor vitest, baseline and final | 129 files, 971 passed, 6 skipped, unchanged |
| Session: advisor vitest rerun during the build | 3 failed in `skill-advisor-launcher-orphan-reaping.vitest.ts`, reproduced twice. Cause confirmed: the helper reads `ps` with the default 1 MiB buffer while the process table held 1,399,510 bytes, which returns `ENOBUFS`. No advisor code changed |
| Session, clean rerun from `.skilled/skills/system-skill-advisor/runtime`: `npx vitest run tests/skill-advisor-launcher-orphan-reaping.vitest.ts`, then `npx vitest run` at `cdc790c48b` | With the process table at 1,026,949 bytes, under the 1 MiB default, the file passed 8 of 8, exit 0, which confirms the cause. The full suite gave Test Files 129 passed, Tests 971 passed and 6 skipped, exit 0, equal to the baseline |
| Build: sk-doc script suite, rename harness skipped | 26 PASS, 0 FAIL, against 25 PASS at the session's baseline. This phase changed no sk-doc script, so the build infers that the gap is not its own |
| Review round 1, a Claude `review` agent, read-only | FAIL: 2 P1 and 5 P2, each confirmed by the host against the code |
| Review round 2, the same reviewer | PASS: both P1s and the URL P2 fixed, no new P0 or P1, 17 URL forms probed. Three new P2 follow-ups |
| Closure: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0, on the final state of these docs |
| Closure: `validate.sh <this phase> --strict` | `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, exit 0. `RESULT: FAILED` appears 0 times in the output |
| Closure: `check-goal.cjs <this phase>` | 5 of 5 checks PASS, `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure: `goal.cjs packet <this phase> --workspace "$PWD"` | `STATUS=OK`, `packet_budget=unknown` as expected for a phase child, `packet_durable_chars=6250`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Setup took the shape from a scaffold.** The build read the canonical parent shape from an `init_skill.py` scaffold in the session scratchpad, not from `cli-jev` as T002 said.
2. **Docs by payload.** The orchestrator wrote each doc to the sk-doc template as a payload, pi copied it with `cp` and the orchestrator ran `cmp` on every target.
3. **Packet extras.** The packet carries `README.md` and `changelog/`, which Files to Change does not list, because `parent-skill-check.cjs` requires both.
4. **Em dashes in the directive.** The build replaced the compiled-routing directive's two em dashes in the hub `SKILL.md` with a colon and a period. All four validator markers are intact.
5. **A graph edge and narrower vocabulary.** Briefs 13 and 14 added `enhances system-spec-kit` and rewrote every hub keyword to name Deem.
6. **Behavior past the spec.** A repeated option key exits 2, `CLI_DEEM_URL` must be loopback and an IPv6 loopback is dialed without brackets. These came from review round 1. The spec names neither `CLI_DEEM_URL` nor `CLI_DEEM_HOME`, and the judgments' 60,000 ms budget is also the build's.
7. **Source commit drift.** The served source commit is `7cf293f`, not the `6755b30` the spec cites, after a release at 2026-09-28T00:15:57Z. Criterion 5 and REQ-013 allow the pair `deem-ctl status` prints.
8. **Server found stopped.** The session found `deem-ctl status` printing `stopped` at 11:35 and ran `deem-ctl start` before the smoke. The cause is UNKNOWN.
9. **Trigger index by the session.** The build left it stale by the orchestrator's ruling, and the session rebuilt it after the commit.
10. **Pre-existing graph drift.** `skill-graph.json` was already stale in its sk-doc signals at HEAD, and the regenerated file carries that drift.
11. **Build record committed.** `scratch/build/` is gitignored, so the session force-added its 62 tracked files.
12. **Sizes.** The client is 784 lines against an estimate of about 170, and the tests 969 against about 150.
13. **Criterion 6 amended at close.** It read `git status`, which cannot see a committed build. It now reads the two commits and the `cli-jev` diff over them. The operator can revert it.
14. **Stale premises corrected at close.** The "(proposed)" marker is gone from names that now exist. `plan.md` step 5 names the served commit pair. `spec.md` section 7 records both answers, and its kill criterion and last risk row carry the ruling that keeps `cli-deem`.
15. **Parent changelog not refreshed.** `spec.md` asks for a refresh under `../changelog/`. The parent packet has no `changelog/` folder, no earlier phase of this packet wrote one and creating it is outside this closure's write scope.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Compiled-route admission is open.** `cli-classifier` is not in `compiled-route-guard.cjs`'s `HUBS` list and has no activation manifest, so the front door serves it as legacy. That is the operator's follow-up by the orchestrator's ruling.
2. **Review follow-ups.** `score` keeps the level index beside Deem's fractional `expected`. `run`'s per-question option cap, a missing source tree and exit 130 have no test. A path, query or fragment in `CLI_DEEM_URL` rewrites the request path, so it exits 1 against the real server instead of 2. The refusal message echoes userinfo, `--hook` is tested only on `health` and the graph edge's wording claims a caller that does not exist yet.
3. **Stage-1 overlap.** `cli-jev`'s own generic keywords rank it 0.82 second on Deem prompts, which is phase 009's to fix. "run a batch of typed questions through deem" ties at 0.82 across `cli-classifier`, `cli-jev` and `mcp-code-mode`.
4. **Advisor test helper buffer.** The session's 3 failures came from the test helper, not this build. A clean rerun under 1 MiB passed 8 of 8, and the full suite matched the baseline with 971 passed and 6 skipped. The helper's missing `maxBuffer` is an adjacent defect outside this phase, so the failure returns whenever the process table passes 1 MiB.
5. **No Deem accuracy exists.** The client carries judgments and measures none. Deem's accuracy on this repository's labels stays UNKNOWN until R21's Deem half and R1's Deem column run.
6. **The server is open to local pages.** It sends `Access-Control-Allow-Origin: *` with no authentication, which exposes compute, not data. Closing it is the operator's call (question 44).
7. **One request at a time.** The server holds one lock around inference, so an offline batch delays any other call. Each caller sets its own timeout and skips when it expires.
8. **Out of scope and recorded.** A `.skilled/changelog/cli-classifier/` link folder and a playbook allowlist entry were not made.
<!-- /ANCHOR:limitations -->

---
