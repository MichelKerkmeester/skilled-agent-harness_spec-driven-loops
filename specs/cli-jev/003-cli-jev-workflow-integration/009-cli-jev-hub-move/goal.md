---
title: "Goal: Phase 9: cli-jev-hub-move"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cli-jev hub move goal"
  - "cli-jev into cli-classifier criteria"
  - "cli-jev replay baseline goal"
  - "cli-jev move kill criterion"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move"
    last_updated_at: "2026-09-29T10:05:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed from build and session evidence: 27 of 27 tasks and 6 of 6 criteria"
    next_safe_action: "Orchestrator commits these docs and the scratch build record"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/implementation-summary.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/scratch/w3-session/session-evidence.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/scratch/w3-build/build-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Research question 49, answered again on 2026-09-29 by parent D4 as amended: the move waits only on 008 being Complete, and no Deem keep is needed"
      - "Where the hub's two changelogs land: cli-classifier/changelog/v0.1.0.0.md and v0.2.0.0.md at R100, beside 008's v1.0.0.0, 2026-09-29"
      - "The dispatch audit label for a jev dispatch: the hub id cli-classifier with packet path cli-classifier/cli-usage, 2026-09-29"
---
# Goal: Phase 9: cli-jev-hub-move

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
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

**Objective:** Move the `cli-jev` hub into the `cli-classifier` hub (phase 008) as mode `cli-jev` over its unchanged packet `cli-usage`, beside `cli-deem`, so every canary case and hub-routing scenario routes as it did before the move.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The build starts once 008 is Complete (operator, 2026-09-29, parent D4 amended). No Deem `keep` is needed |
| D2 | Record the replay of the 7 canary cases and the 3 hub-routing scenarios through `--hub cli-jev` before any file moves |
| D3 | Move all 81 hub files with `git mv`. Hub-level files merge into their `cli-classifier` counterparts. Never move part of the hub and then delete the rest |
| D4 | One commit holds the move, the merges, every literal list and the regenerated artifacts. Changelogs and dated benchmark reports stay as written |
| D5 | Kill: any canary case or hub-routing scenario that routes differently after the move means `git revert` of that commit |

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

- [x] A baseline file holds the route JSON and exit status of all 17 prompts through `compiled-route.cjs --hub cli-jev`, taken while `git ls-files .skilled/skills/cli-jev` printed 81 lines
- [x] After the move commit, `git ls-files .skilled/skills/cli-jev` prints 0 lines, and that commit's `git show -M --name-status` has a rename for every moved file and a `D` row only for a hub-level file merged into a `cli-classifier` counterpart
- [x] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0, and its `mode-registry.json` lists two modes, one of them `cli-jev` with packet `cli-usage`
- [x] The 17 prompts replayed through `--hub cli-classifier` match the baseline on `action`, `selectionKind` and `packetId` for every prompt, or the move commit is reverted
- [x] `git grep -l '\.skilled/skills/cli-jev/' -- . ':!specs' ':!**/changelog/**' ':!**/benchmark/reports/**'` prints nothing
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and `implementation-summary.md` authored on 2026-09-27 from `007-classifier-deep-research/research/research.md` section 14 (`### 009-cli-jev-hub-move (new)`), R23 in section 12, What Not To Build row 104 and ledger rows 79 to 94 |
| Literal lists reopened | Done | 2026-09-27 at the worktree HEAD: `compiled-route.cjs:35`, `compiled-route-sync.cjs:59`, `compiled-route-guard.cjs:47`, `compiled-routing-flag.ts:19` and `:37`, `resolve.cjs:36-44` (`cli-jev` at `:41`), `serving-closure.manifest.json:5-13` (`:10`) and `dispatch-audit.mjs:46`, `:234`, `:237` all hold `cli-jev` as section 14 says |
| Footprint recount | Done | `git ls-files .skilled/skills/cli-jev` 81, 59 in `cli-usage`, 22 at hub level. `git grep -l cli-jev` outside `specs/` and the hub: 48. Canary fixture: 7 cases |
| Recount (2026-09-29) | Done | At HEAD `3dde18cb54`: `git ls-files .skilled/skills/cli-jev` 81, 59 in `cli-usage`. `git grep -l 'cli-jev' -- . ':!specs' ':!.skilled/skills/cli-jev'` 62, up from 48, and `git grep -l cli-jev -- . ':!specs'` 109, which also counts 47 hub files. The stale-path `git grep` of REQ-008 lists 18 files, 16 outside the hub. Every literal-list line named in `spec.md` section 2 holds `cli-jev` at the same line as on 2026-09-27, and none moved |
| Release | Done | Released on 2026-09-28 by parent D3 and unlocked on 2026-09-29 by parent D4 as amended. `../008-cli-classifier-hub/spec.md` says Status Complete, and parent D4 no longer asks for a Deem `keep`. Source: the closure brief, parent `goal.md` D3 and D4 |
| Baselines | Done | 2026-09-29, the session at clean HEAD `3dde18cb54` before any move: guard, sync `--check`, status and admission exit 0 on 7 hubs, `parent-skill-check.cjs` exit 0 on `cli-classifier`, `cli-jev` and `cli-external-orchestration`, foundation vitest 37 passed, manifest test 28 of 42 with 14 recorded failures, dispatch audit 75 passed, rule-checks 20 of 20. The route baseline holds 17 prompts, each with its JSON and exit status. Source: `scratch/baselines.md`, `scratch/route-baseline.txt`, session evidence section 1 |
| Moves staged | Done | The session ran `git mv` for 70 hub files and for the rollout child and activation folders in both trees, staged, before the build started. Source: session evidence section 2 |
| Build | Done | A fresh Opus 5.5 xhigh build orchestrator sent 62 single-change briefs one at a time, Devin `deepseek-v4-1-flash-max` 16 and Pi `llmgateway/mimo-v2.6-pro` 46, all exit 0, none BLOCKED. Its verdict was PASS, with the stale-path grep, criterion 2 and one pre-existing playbook failure left for the session. Source: `scratch/w3-build/build-evidence.md` sections 6 and 7 |
| Session verification | Done | From the final state: replay `rows 17 after 17 mismatch 0`, status, guard, admission (`cli-classifier` 5 pass, 0 drift), sync `--check` and `--verify` all exit 0, `parent-skill-check.cjs` exit 0 with 2 modes, manifest freshness `fresh: true`. Suites equal their baselines, and the advisor suite passed 1030 with 6 skipped. Source: session evidence section 3 |
| Review, round 1 | FAIL | Cross-family and read-only: Pi MiMo reviewed Devin's files and Devin DeepSeek reviewed Pi's, and the tree hashes were equal before and after. Both printed `VERDICT: FAIL`. The P1s: the REQ-008 grep printed 4 generator outputs (both reviewers), and the `008-cli-classifier` harness recorded outcomes without asserting the fixture's expectations (Pi). Five P2s recorded. Source: session evidence section 4, `scratch/w3-session/review-pi-r1.txt`, `review-devin-r1.txt` |
| Fix round 1 | Done | Devin added `assertGoldExpectations` to the harness, byte-identical in the twin, and its negative proof threw `GOLD_MISMATCH` for `deem-choice-single`. Pi restructured the moved `cli-usage` playbook root so it validates with 0 issues. Gates after the fix: sync, guard, admission and freshness exit 0, foundation 37 passed. The session reran the Pi check with the diff pasted into the brief, `VERDICT: PASS`, no findings. The grep P1 closed with the commits below. Source: session evidence section 4, `scratch/w3-build/fix-1/fix-evidence.md`, `scratch/w3-session/review-pi-fix-r2.txt` |
| Commits | Done | `ea883967d4` the move, 177 paths, with 70 renames and 11 `D` rows under the old hub. `347f9db711` the 2026-09-29 spec amendments and the live 017 Jev run record. `c0178c093d` the trigger index and fixtures rebuilt from an archive of HEAD, 23,318 documents, 0 stale. Worktree branch, not pushed. Source: session evidence section 5, closure rerun of `git show -M --name-status ea883967d4` |
| Phase docs | Done | 2026-09-29, closure leaf: `tasks.md` 27 of 27, the six criteria above ticked, `spec.md` and `implementation-summary.md` Status Complete. The gate results are in `implementation-summary.md` Verification. Source: the closure brief |

### Deviations and findings

| Item | Note |
|------|------|
| Operator approval of a new phase | Section 14 says each amendment waits for operator approval. The parent goal's D5 and fourth criterion direct that each proposed phase become a Planned child, so the phase was authored without asking |
| Replay comparison rule | Section 14 says "routes differently" without a comparison rule. The phase compares `action`, `selectionKind` and `packetId`, reading hub `cli-jev` as `cli-classifier` and mode `cli-usage` as `cli-jev`. It ignores `effectivePolicyHash` and `generation`, which the merged registry changes by construction. This is the leaf's judgment |
| Dated benchmark reports | Section 14's stale-path check excludes only changelogs. `cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/skill-benchmark-report.md:15` names the old path as the place a past run happened, and the packet is to stay unchanged, so the check also excludes `benchmark/reports/`. This is the leaf's judgment |
| Hub-level merges | `git mv` cannot land on a file 008 already created, so the 8 hub-root files merge into their counterparts and leave `D` rows. The guard against row 104's `rm -rf` is that `D` rows are limited to files the disposition table names as merged |
| "About 48 edited" | 48 files name `cli-jev` outside `specs/` and the hub, and 4 of them are changelogs that stay as written, so at most 44 take an edit. Some lines record history and stay too |
| Level and priority | Level 1 per the orchestrator's assignment. P2, because the phase runs last and only on a kept Deem result |
| Amendment: the keep rule (2026-09-28) | Source: D4 of the parent `goal.md` ("A pre-fixed Deem `keep` in 002 or 017 unlocks 009") and its log row "New directive, wave 3". Research open question 49 (`../007-classifier-deep-research/research/research.md:1172`) is answered: the move waits on a Deem keep, and a Deem arm in 002 or 017 that prints `keep` under that phase's keep rule, fixed before the run, counts as the operator's keep. With no such keep the phase stays Planned and the deciding verdicts go in the parent goal's log, as the parent's second criterion says. Changed: D1 here. In `spec.md`, REQ-001, the Phase Context dependency, the proof plan's entry gate row, the risks table's dependency row and section 7. In `plan.md`, the Definition of Ready, the first slice and the dependencies. In `tasks.md`, T001 and the notation line. No criterion names the gate, so all six stay as written, and the gate binds through D1 and REQ-001 |
| Conflict: retiring `cli-deem` | R23's keep rule (`../007-classifier-deep-research/research/research.md:800`) also says to retire `cli-deem` when no Deem arm prints a kept result. Parent D2 keeps `cli-deem` in the hub, and parent D4 and its second criterion only leave 009 Planned. The rewritten gate text here states the parent rule alone. The retire clause still stands in `../008-cli-classifier-hub/spec.md` (kill criterion and risks). Named for the orchestrator, not resolved |
| Amendment: entry gate and compiled-fleet onboarding (2026-09-29) | Source: the operator's "Amend D4 (Recommended)" of 2026-09-29 and the parent goal's rows "D1, D4 and criterion 2 amendment (2026-09-29)" and "009 scope gap found (2026-09-29)". D1 "Build only after 008 is Complete and a Deem arm in 002 or 017 prints `keep` under that phase's keep rule, fixed before the run, which counts as the operator's keep. With no such keep the phase stays Planned, and the deciding verdicts go in the parent goal's log" became "The build starts once 008 is Complete (operator, 2026-09-29, parent D4 amended). No Deem `keep` is needed". The same gate text changed in `spec.md` (REQ-001, Dependencies, the proof plan's entry gate, Risks and section 7), `plan.md` (Definition of Ready, first slice and Dependencies) and `tasks.md` (the notation line and T001). New: REQ-012 onboards `cli-classifier` to the compiled fleet in `cli-jev`'s place, because `compiled-route.cjs --hub cli-classifier` prints the legacy sentinel and the replay could never match. REQ-003 now names the eleven merges that may leave `D` rows, and REQ-013 moves and rewrites the two old CJ scenarios. Tasks T024 to T027 carry the new work. No criterion named the gate, so all six stay as written. Executors: no 009 doc names one, so parent D5 binds unchanged |
| Amendment: criteria 1 and 4 at close (2026-09-29) | Both said "10 prompts". The baseline and the replay hold 17, the 7 canary prompts and the hub-routing scenario prompts plus phrasing variants, so the 10 are a subset and every one of them matched. Ticking "10" would have described a file that does not exist, so the wording names the 17 instead. Old text: "all 10 prompts through" and "The 10 prompts replayed through". Source: the closure brief's addendum and session evidence section 6. REQ-002, REQ-006 and D2 still name 10 and are met by the superset. Rollback: restore the two quoted strings |
| Stale premise: "(proposed)" in the objective | The objective called `cli-classifier` "(proposed, phase 008)" and `cli-deem` "(proposed)". 008 built both in `ee3a1b057c` and its `spec.md` says Complete, so the markers are gone here, in `spec.md` Phase Context and in `plan.md`. The objective's meaning is unchanged. Source: `../008-cli-classifier-hub/spec.md:27` |
| Ruling: trigger index outside the move commit | REQ-007 wants the trigger index in the move commit. It is built from an archive of HEAD, so it follows in its own commit `c0178c093d`, as every earlier phase of this packet did. The advisor graph and its parity fixture are in `ea883967d4`. Source: session evidence section 6 |
| Ruling: five hub-routing scenarios | `hub-routing/` holds 5 scenarios covering the 3 cases REQ-012 names: `cli-deem` (CC-001), `cli-jev` (CC-002, CJ-001, CJ-002) and out-of-domain (CC-003, which absorbed CJ-003). A ruling that `hub-routing/` holds exactly three scenarios conflicted with REQ-003 and REQ-013, which keep and rewrite CJ-001 and CJ-002. CC-002 was rewritten in place, not retired. Source: session evidence section 6, build evidence section 7 |
| Ruling: authored twin of the runtime engine | `014-runtime-engine/lib/{compiled-route,resolve}.cjs` were edited in the authored twin as well as the runtime, because `compiled-route-sync.cjs --check` needs them equal. The spec names only the runtime paths. Source: session evidence section 6, build evidence section 7 |
| Ruling: generator output absorbed older drift | `durable-directory-manifest.json` gained `.skilled/hooks/goal/lib` and the 008 `cli-classifier` folders. `baseline-readme-verdicts.json` gained 43 tracked READMEs committed since its last write, 30 of them in this packet, and only the 3 merged hub READMEs changed verdict, fail to pass. Both are whole-file generators. Source: session evidence section 6, build evidence section 7 |
| Ruling: `NODE_PATH` for the agent-mirror-sync gate | The pre-commit gate could not load `@spec-kit/shared` because `.skilled/skills/system-deep-loop/node_modules` is not provisioned in this worktree. Provisioning is an install that needs the operator's yes, so the session committed with `NODE_PATH` pointing at a scratch folder holding one link to this worktree's own `system-spec-kit/shared`. Every gate ran and none was bypassed. Run by hand the same way, the checker reported 2 agents checked, all mirrors in sync and OK. Source: session evidence section 6 |
| Ruling: five byte-identical moved docs fail validation | `cli-usage/assets/question-shaping-card.md` and four `cli-usage/references/` files fail `validate_document.py` on a missing `overview`. They moved at 100 percent similarity with no byte changed, and their HEAD copies fail the same way, so the gap predates this phase. Source: session evidence sections 3 and 6 |
| Dispatch audit label | A `jev` dispatch reports the hub id `cli-classifier` with packet path `cli-classifier/cli-usage`, as `spec.md` asks, while other shapes report packet ids. This answers `spec.md` section 7's third question. Source: build evidence section 7 |
| Twin activation records | `activation-record.json`, `manifest.candidate.json`, `manifest.prior.json`, `manifest.serving-prior.json` and `serving-flip-record.json` moved byte-identical and still record the `cli-jev` first activation (hash `3240...`). Regenerating them would claim a rollback rehearsal that never ran. Source: build evidence section 7 |
| Activation manifest as `D` plus `A` | `activation/cli-classifier/manifest.json` shows as `D` plus `A` against HEAD in both trees, because its canonical bytes carry a new policy hash. The twin's regenerated `compiled/*` does the same. None is among the 81 hub files. The `refresh` also left the runtime manifest at file mode 0600. Source: build evidence section 7 |
| Other hub reminted | Brief 06's registry edit staled the `cli-external-orchestration` manifest. `refresh` reminted it to generation 5, and brief 39 copied the twin. The commit's pre-commit route-remint gate then re-minted `cli-classifier` and `cli-external-orchestration` again, and the guard and freshness stayed fresh. Source: build evidence section 7, session evidence section 5 |
| Left as recorded | The `004-cli-external-orchestration` canary `jev-transport-single` still expects `cli-jev`, as `spec.md` line 169 directs, and the "Real user request" line at `declared-hard-rules-refuse-violations.md:28` keeps "the cli-jev packet". Source: build evidence section 7 |
| Re-dispatches | 36 to 36b to 36c: a failed OVERVIEW check, then a rewrite at 26 percent similarity that would have broken criterion 2, settled at R088. 52 to 52b and 53 to 53b: rewrites at R050 and R044 raised to R052. 29 to 29b: the brief's expect-0 check contradicted its one-line scope and Pi stopped correctly. 19b, 19c and 20b were follow-ups, because `.claude/agents/` is hand-kept, not generated. Source: build evidence section 7 |
| Build scope slips | The build orchestrator wrote temp files outside `scratch/w3-build/` (`/tmp/x`, `/tmp/.vd*`, `/tmp/.h*` and similarity scratch in the session scratchpad) and removed all of them. Source: build evidence section 7 |
| Fix round 1 beyond hub-name prose | T006 allowed only prose that names the packet's hub. Fix round 1 also renamed and moved the moved playbook root's sections so it passes `validate_document.py`, since the build had changed a row in it. The 22 scenario rows are byte-identical, and the rename scores 94 percent. The fix leaf ran the harness proof on the twin path, because the runtime copy would have written 11 untracked files, and the two copies are byte-identical. Source: session evidence section 4, `scratch/w3-build/fix-1/fix-evidence.md` |
| Fix-round review rerun | The fix leaf's own Pi check made no tool calls, so the session reran it with the diff pasted into the brief. Source: session evidence section 4 |
| Parent changelog not refreshed | `spec.md` Phase Context asks for a refresh under `../changelog/`. The parent packet has no `changelog/` folder, and creating one is outside this closure's write scope, as 008's closure also recorded. Source: the closure pass |
<!-- /ANCHOR:log -->
