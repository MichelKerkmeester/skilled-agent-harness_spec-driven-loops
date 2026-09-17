---
title: "Goal: teach every gate and CI workflow the .skilled root"
description: "The durable directive for the phase that makes hooks and CI check changes under either root and fail loudly when a gate cannot find its script, and the criteria it closes against."
trigger_phrases:
  - "gate readiness phase goal"
  - "skilled gate teaching goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/005-gate-and-ci-readiness"
    last_updated_at: "2026-09-17T06:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Fixed the Luna CI findings and the agent mirror checker, and their review is running"
    next_safe_action: "Close the fix review, validate, then publish per phase 004 step 5"
    blockers:
      - "GPT-5.6 Luna review of the fixes pending"
    key_files:
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-005-goal"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Goal: teach every gate and CI workflow the .skilled root

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Before anything moves, every git hook and CI workflow checks changes under `.skilled/` or `.opencode/` and fails loudly when a gate cannot find its script, proven by a check that lives outside the moved tree.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Gate scripts keep literal `.opencode/` paths that resolve through phase 004's tracked link. Each gate file defines `_in_toolchain_repo` to decide whether a missing script is loud. Amended under L1 on 2026-09-16 after a GPT-5.6 scope review, replacing the copied two-root block |
| D2 | Where the spec-kit sentinel resolves under either root, a missing gate script never passes: blocking gates block and name the path, and gates that cannot block warn. Any other repository sees no change. |
| D3 | DeepSeek V4.1 Flash max on cli-pi through the LLM Gateway makes the literal edits, one workflow or hook section per brief, suite-verified before the next. The block, the missing-script rule, the fail-closed workflows, the check and the drill are drafted by the orchestrator or DeepSeek, reviewed by GPT-5.6 Luna at xhigh on the fast tier through cli-codex and verified by the orchestrator. Amended 2026-09-17 by the operator: GPT-5.6 Luna xhigh fast replaced GPT-5.6 sol after Codex quota returned, and SWE-2, tried in between, is no longer used |
| D4 | The scripts the gates call and the human-facing text naming `.opencode` stay as they are in this phase. Phase 006 teaches those scripts and phase 009 rewrites that text. The one exception is the agent mirror checker's path pattern, which this phase fixes. Amended 2026-09-17 by the operator |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` on the phase tip
- [x] `bash .github/scripts/tests/broken-move-drill.sh` prints `RESULT: PASSED`, which it does only when every deliberate break failed both the check and its hook
- [x] The six hook test scripts pass above their 126-case baseline with no case removed, and every new test script passes
- [x] Every workflow `paths:` entry naming `.opencode/` has a `.skilled/` twin, and no workflow exits 0 on a missing guard
- [ ] Every contract change has a GPT-5.6 Luna xhigh review with no open finding
- [ ] The phase validates PASSED
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal, written on 2026-09-16 against `728c4f3efc` |
| Baseline hook tests | Observed | Six test scripts at `728c4f3efc` pass 126 cases: `pre-commit` 25, `pre-push` 19, `prepare-commit-msg` 51, `commit-msg` 17, `autostash-orphan-guard` 2, `mass-deletion-guard` 12 |
| T003 hook test baseline | Observed 2026-09-16 at `d26f0c60ca` | autostash-orphan-guard 2, commit-msg 17, mass-deletion-guard 12, pre-commit 25, pre-push 19, prepare-commit-msg 51: 126 passing, 0 failing; `bash -n` clean on the seven hooks and both libraries |
| T003 no-op pre-commit timing | Observed | Ten runs: 548 to 659 ms, median 559 ms |
| T003 CI baseline (pre-005) | Observed at remote tip `728c4f3efc` | Red, with failure sets: Playbook Operator Contract on main (16 lines, the same set since 06:40Z: FAIL packages cli-devin, sk-communication, sk-create-manual-testing-playbook, sk-git, system-deep-loop); Spec-Kit Check on both branches (`hook-registration-sync` expected 81 to be 77, `scaffold-golden-snapshots` lazy-goal.md snapshot); Routing Registry Drift Guard on both branches (`scorer-eval-baseline-ratchet`: full_corpus_top1 151 vs 152, ambiguity_top1 17 vs 18). Every other workflow's latest run is green |
| T001 phase 004 inputs | Read | Layout L1 (`.opencode -> .skilled`, tracked relative link); `.opencode/` keeps K1 to K13 of ADR-003; the move is one rename-only commit plus the link; hook logs keep writing through `.opencode/logs`, which resolves into `.skilled/logs` under L1 |
| T004 silent pass reproduced | Observed in `/tmp/skilled-p005/control`, a clone with `.opencode/` moved to `.skilled/` and no link | Today's `pre-commit` with `.skilled/agents/markdown.md` staged: exit 0, 0 bytes of output. Today's `comment-hygiene.yml` guard step: exit 0 with `::warning::Comment hygiene checker not found ... skipping` |
| T005 executors | Observed 2026-09-16 | DeepSeek V4.1 Flash on cli-pi answers through `PI_CODING_AGENT_DIR=/tmp/skilled-pi-agent` (`supportsDeveloperRole: false`); GPT-5.6 sol on cli-codex completed a 428 s read-only review for phase 004 |
| L1 amendment | Applied 2026-09-16 | GPT-5.6 sol at `high` (read-only) found the smaller change sufficient with no missed case (`review/gpt-5-6-sol-scope-under-l1.md`). Withdrawn: T006 to T008, T029, H20 and the check's block-copies and escaped-roots rules |
| T002 cited lines re-opened | Observed at phase start `7085ec3290` | No gate file changed since `728c4f3efc` (`git diff --stat` over the hooks, the legacy helper, the SessionStart check and `.github` is empty), and `grep -c '\.opencode'` still gives 43 in `pre-commit`, 19 in `pre-push` and 148 across the 19 workflows |
| T013 H04 and H05 | Committed `259f4f6cf4` | DeepSeek's second attempt matched the expected files byte for byte and touched only the two authorized files. Against the HEAD hook the harness failed the 2 new assertions; against the changed hook it passed 28 of 28 under `/bin/bash` 3.2.57 |
| T014 to T018, the rest of pre-commit | Committed `a17d8ab9ce`, `50eca95e28`, `f7165195e2`, `b5f179bd0e`, `576ac3c930` | Each DeepSeek return matched its expected files byte for byte and touched only its files. Each unit's new assertions failed against the hook before it (2, 2, 4, 3 and 3), and the harness then passed 30, 32, 38, 42 and 44 |
| T019 and T020, pre-push | Committed `5fa1f39da8`, `5ae40d3c1a` | Byte-matched. The new assertions failed first (4, then 3), and the harness passed 25, then 32. Case controls for release branches, approvals and other repositories pass both before and after |
| T021 to T024, the other hooks | Committed `4866bc8eea`, `6ad37a5a13`, `ae007f51a2`, `8ffe7e8dc3` | Byte-matched, with one byte fixed by the orchestrator in T024 (see below). New assertions failed first: 1, 5, 3 and 2. Controls show the allocator stamping, the autostash guard anchoring and logging, and hooks comparing as installed, all through a linked source root |
| Hook suites from the tip `8ffe7e8dc3` | Observed under `/bin/bash` 3.2.57 | autostash-orphan-guard 9, commit-msg 17, mass-deletion-guard 12, pre-commit 49, pre-push 32, prepare-commit-msg 51 plus 5 new (56): 175 passing, 0 failing, against the 126 baseline with no case removed. The new `check-git-hooks.test.sh` passes 4 of 4. `bash -n` is clean on every hook, library, helper and check |
| T009 independent check | Committed `5cad25db6b` | 0.6 s on the tip: 31 files, 137 inputs resolved, 8 dynamic, 52 twin pairs, and 58 failures, all still to be fixed in CI: the 56 workflow path filters, the `agent-mirror-sync.yml:29` name regex and `dependabot.yml:13`. On the phase-start tree it also reports 20 hook filters in `pre-commit`, 7 in `pre-push` and 1 in the legacy helper, every one since fixed |
| T025 GPT-5.6 review of the hook rules | Blocked | The run on 2026-09-16 21:27Z stopped at Codex's usage limit ("try again at Sep 19th, 2026 10:29 AM") before any verdict. The hook commits stay local until a review completes |
| T010 and T011, check test and workflow | Committed `fc6305eb69`, `ecf3812ea1` | The fixture test passes 8 of 8 against the check. Against an always-pass stub six cases fail and against an always-fail stub all eight do. `gate-inputs.yml` parses, has no `paths:` key and declares `contents: read` |
| T027 and T028, CI twins | Committed `60605917a9`, `f4f6ea659e` | Ten DeepSeek briefs, each byte-matched and confined to its file. 56 workflow twins, one dependabot twin and the agent regex admitting `skilled`. The check then passes on the tip: 167 twin pairs, 0 failures |
| T030, fail-closed guard steps | Committed `9f009e8dd3` | Each of the six steps, run in a directory without its guard, exited 0 before and exits 1 with `::error::` after |
| T033, broken-move drill | Committed `be0c3974ab` | 48 expectations held, `RESULT: PASSED` in 49 s. A first run failed three controls, because a push range spanning the move shows every `.opencode` file deleted even to the earlier hooks, so the controls now push a range after the move |
| T045, T046 and T048, naming guard | Committed `33f2d87531`, `60635ffca5` | The first and third new cases failed against the earlier guard, and the suite passes 7 of 7. A rehearsal clone with the move staged prints `PASS:`, where the earlier guard reports the four grandfathered names |
| T026 and T032, READMEs | Committed `0e60909b2e`, `452cc9b6dc` | Byte-matched, and `validate_document.py` reports 0 issues on each of the three |
| Mass-deletion harness scrub | Committed `27dd545510` | Found by CHK-FIX-006: under a caller with `GIT_DIR` set the harness failed 4 of 12, and after the scrub it passes 12 of 12 with and without that caller |
| T035 to T041 verification | Observed 2026-09-17 | Every harness passes plain, under a hostile caller and with spaced temporary paths. Other repositories: every hook exits 0 in a clean repository and one with a dangling `.opencode` link. Comment hygiene 0 violations, naming guard `PASS:` since `7085ec3290`, 20 workflows parse, no-op pre-commit median 546 ms against 559 ms |
| T025, T031, T034 and T047 reviews | Done 2026-09-17 | GPT-5.6 Luna at xhigh on the fast tier, read-only, each followed by a matching worktree fingerprint. Hook rules: sound, F1 fixed by T050 and T051, F2 answered. CI changes: four findings, each reproduced by a fixture and fixed by T049, which leaves T012 open until its fixes are reviewed. Naming guard: no finding. Verdicts in `scratch/delegation/luna-*-verdict.md` |
| T049, the CI review's fixes | Committed `51f90025c4`, `c58a37b8d8` | DeepSeek byte-matched both units, each confined to its file, the check's 13 edits arriving in 7 tool calls. The six new cases failed against the committed check, and an always-pass stub fails 14 of the 18. Afterwards the suite passes 18 of 18 and the tree reports 136 inputs, 8 dynamic and 167 twin pairs. On a copy of the real hooks, removing a twin from the continuation block at `pre-commit:308` or the array at `:360` fails under both checks, and moving the `pre-push:149` twin into a comment now fails where it passed |
| T050 and T051, the agent mirror checker | Committed `ad6d47b2aa`, `4ff3b14bac` | Both new cases failed against the committed checker, one on "no agent files to check" and one on exit 0, and pass after the fix. DeepSeek byte-matched all three units. The write tool dropped the new suite's final newline, which the orchestrator appended. The deep-improvement suite passes 393 of 394, with the one failure it had before, and the tests index validates with 0 issues |
| Suites and drill from `4ff3b14bac` | Observed under `/bin/bash` 3.2.57 | autostash-orphan-guard 9, commit-msg 17, mass-deletion-guard 12, pre-commit 49, pre-push 32, prepare-commit-msg 56, `check-git-hooks.test.sh` 4 and `check-gate-inputs.test.sh` 18, all passing. The drill passes 48 of 48 in 44 s |
| T052, review of the fixes | Done 2026-09-17 06:06Z to 06:18Z | GPT-5.6 Luna raised five P1 and three P2 findings. Seven check findings were each turned into a fixture case that failed against `c58a37b8d8`, and the checker's README count was answered as older than this phase (`luna-fix-review-verdict.md`) |
| T053, the second round of check fixes | Committed `057c3664c0`, `a220c9b904` | DeepSeek byte-matched both units. The write tool dropped the rewritten check's final newline, which the orchestrator appended, and the executable bit held. Nine new cases and a reworked parser-miss case failed against the committed check. The suite passes 27 of 27, the tree keeps 136 inputs, 8 dynamic and 167 twin pairs with every root-naming line read, and nine of ten probe shapes behave as intended. The tenth, a `case` pattern listing both roots split by `\|`, fails loudly as a false positive, and no gate file uses that shape |
| Suites and drill from `a220c9b904` | Observed under `/bin/bash` 3.2.57 | The six hook harnesses pass 175, `check-git-hooks.test.sh` 4 and `check-gate-inputs.test.sh` 27. The drill passes 48 of 48 in 62 s |
| T012 and T054, review of the reworked check | Running | GPT-5.6 Luna reviews T053 in `luna-fix2-review` |
| T042 publish | Waits for T054 | Both remote branches still point at `728c4f3efc`, so the push is a fast-forward |
### Deviations and findings

| Item | Note |
|------|------|
| Gate lines moved since phase 001 cited them | Comment hygiene is now `pre-commit:50`, the agent filter `:95` and the parity skip `:180`, with the six parity scripts at `:168-175` |
| "12 of 19 workflows skip on a missing guard" | The workflow count holds and the mechanism does not. Only 6 of the 12 missing-guard conditionals skip, in five workflows, and the other six fail closed. The twelve silent workflows combine those skips with eight path-filtered workflows and one name filter |
| Two pre-push gates disengage silently | `pre-push:52-54` skips the remote-push permission gate, and `:252` skips the compiled-routing guard with no output |
| The agent checker drops names it does not match | `check-agent-mirror-sync.cjs:32` and `:60-68` exit 0 with "nothing verified", so a hook filter that admits `.skilled/agents/` checks nothing there until phase 006 changes the checker |
| The skill-root metadata gate's comment and code disagree | `pre-push:201-203` says the gate blocks, but `:216-229` never exits non-zero, even where it prints "AUTOSYNC BLOCKED". Noted, not changed: this phase follows the code |
| Hook edits run as DeepSeek units | After a context compaction the orchestrator applied its own pre-commit draft directly, which D3 assigns to DeepSeek. It restored the file, kept the draft as the expected result, and runs T013 to T018 as literal briefs that must match that result byte for byte |
| Git cannot stage through the link | Observed in a scratch repository with `.opencode -> .skilled`: `git add .opencode/<path>` fails with "pathspec ... is beyond a symbolic link", and `git diff --quiet` through the link exits 0 on a changed file. Under L1 the route re-mint gate would stop at its `git add`. T017 twins the per-hub pathspecs and addresses the manifests through the directory `.opencode` resolves to. `--skill-root` keeps `.opencode`, because reading works through the link |
| Two re-mint gates blocked other repositories | "Skip silently, as today" did not hold for route and spec re-mint: a repository with its own `.opencode/skills/*/SKILL.md` or spec folder staged was blocked on the missing module or tool. Under the missing-script rule such a repository passes, and case 35 stages every trigger at once to prove it |
| The comment checker block names its bypass | The missing-checker block at `pre-commit:50` ignored `SPECKIT_SKIP_COMMENT_HYGIENE`. The rule's message names the gate's escape, so the flag now bypasses that block as well |
| Pi print mode wrote nothing | T013's first dispatch in text mode ran 150 s, exit 0, with empty output and no edit. The same brief with `--mode json` applied all 8 edits in 23 s. Units now dispatch in JSON mode and keep the last assistant text as the return |
| Adjacent, not fixed: a trigger can miss on a large commit | The card-sync and mutation-class triggers pipe `git diff` into `grep -q` under `pipefail`. With 6,001 staged names and the trigger listed first, the trigger missed in 3 of 3 runs, because `grep -q` exits at the match and git dies of SIGPIPE. The move commit is not exposed, since pure renames are filtered out. A one-line fix is `grep -E ... >/dev/null` in place of `grep -Eq` |
| Control case | Case 33, a missing route module blocking where the toolchain ships, passes against the unchanged hook by design: it guards the new condition against skipping inside this repository. Every other new case fails against the hook it precedes |
| Comment hygiene evidence was wrong | `bash check-comment-hygiene.sh <file>` exits 2 on every file, because the checker is a Python script and bash stops at a syntax error; exit 2 is also the checker's own "skipped" code, so the two read the same. Run directly, the checker passes every changed `.sh` file (exit 0) and skips the extensionless hooks (exit 2) without reading them. The 45 comment lines this phase added to those hooks carry no packet, phase, task or finding id. AC-010 now runs the checker directly |
| Adjacent, not fixed: hooks without an extension are never hygiene-checked | The pre-commit gate hands every staged file to the checker, and the checker skips unknown extensions, so no git hook file has ever been scanned for ephemeral ids |
| The check came after the hooks | The plan orders the check before the hook units so each unit can be filtered through it. The hook units ran first and were verified byte for byte against expected files instead, and the check, run afterwards over the whole tree, reports no hook failure |
| Split briefs and one orchestrator byte | T019's first dispatch spent its 32,768-token output cap on reasoning and edited nothing (`stopReason: "length"`); Pi asks for 393,216, so the cap sits upstream. Units with a large harness block now go out as a hook brief and a harness brief. Pi's write tool also dropped the final newline of the new `check-git-hooks.test.sh`, and it cannot set a mode, so the orchestrator added the newline and the executable bit |
| Missing gate scripts now fail loudly in pre-push | A missing mass-deletion library blocks update pushes until `SPECKIT_ALLOW_MASS_DELETION=1`, and a missing `worktree-naming.sh` blocks pushes the permission gate would check until `SPECKIT_ALLOW_REMOTE_PUSH` approves them. Both reverse a fail-open, as the spec's open question proposed. They await the GPT-5.6 review |
| Other repositories keep two old warnings | In a repository without the toolchain, `pre-push` still prints "worktree-naming.sh not found" and the legacy helper "comment hygiene checker not found". Both predate this phase, and the drill shows the current hooks print nothing the earlier ones did not. CHK-024 now asks for no new output, matching REQ-003 and decision D2 |
| Test matrix for the missing-script rule | Axes: layout (`.opencode` real, `.opencode` linked to `.skilled`, dangling link, no root) by script state (present, missing) by identity (toolchain, other repository). The harnesses cover real-present-toolchain, real-missing-toolchain, real-missing-other and linked-present-toolchain for every gate. The drill adds linked-missing-toolchain for 14 inputs and linked-missing against the earlier hooks, and the foreign proof adds dangling-link and no-root for all eight gate files. Linked-missing-other has no repository to stand for, because a consumer project that links `.opencode` resolves the sentinel through the link |
| `ci-skill-root-metadata.cjs` needs installed packages | It exits with "Cannot find module '@spec-kit/shared/frontmatter/parse-frontmatter.js'" in the worktree and in a fresh clone, where no workspace package is installed. It runs in the main checkout, which has them, and CI installs them first. Pre-push reports the crash as stale metadata without blocking. Not caused by this phase |
| Supplementary hook review | GLM-5.3-Flash `xhigh`, read-only, 2026-09-16 22:04Z to 22:31Z, alongside rather than in place of the blocked GPT-5.6 review. It judged rules A to D met and the five decisions sound. F1, the agent checker dropping `.skilled` names, was confirmed and left to phase 006's handoff. F2, the SessionStart harness depending on a system hooks path, was confirmed with a harness copy and fixed in `610374769a` |
| Supplementary CI review | GLM-5.3-Flash `xhigh`, read-only, 2026-09-16 22:34Z to 23:15Z. It judged the check, the fail-closed steps and the drill sound. F1 was confirmed: a one-root filter written as an inline array or at the key's indent passed the check, now fixed in `fcc0b50028` and `07039dea39`. F3 and F4 were refuted by runs, and F2 and F5 follow the plan |
| Supplementary naming guard review | GLM-5.3-Flash `xhigh`, read-only, 2026-09-16 23:19Z to 23:39Z. Confirmed in a scratch repository: a copy whose source also changed pairs as `C100`, and the guard then passes a new snake_case file. Restricting the skip to renames would close it but narrows REQ-012, so it waits for the operator. The guard's `.opencode/specs` literals joined the phase 006 handoff, and phase 007's stale expectation is logged in the parent goal |
| Operator decisions 2026-09-17 | Reviewer: "Swe 2 max". SWE-2 at max effort on cli-devin replaces the GPT-5.6 contract reviews, recorded in D3, REQ-009, AC-009 and the task executors. Naming guard: renames only, recorded in REQ-012, T045, T046 and AC-012 |
| Rename-only naming guard | Committed `9e1bc29d87`, `904bcd479c`. The copy case failed against the guard that skipped copies, the suite passes 8 of 8, and the rehearsal clone still prints `PASS:` for the move |
| Reviewer changed again 2026-09-17 | Once Codex usage returned, the operator chose GPT-5.6 Luna at xhigh on the fast tier and DeepSeek V4.1 Flash max as the only models from here. The SWE-2 hook review had failed once under `auto`, where Devin refused a shell command, and its second run was stopped before a verdict. A worktree fingerprint showed it wrote nothing |
| Luna hook review | GPT-5.6 Luna xhigh fast, read-only, 2026-09-17 05:16Z to 05:25Z. Rules A to D covered and all five decisions sound. F1 confirmed: the agent mirror checker drops `.skilled` names, and the plans contradict each other on its owner, since this phase hands it to 006 and 006's spec excludes it as hook work. That waits for the operator. F2 answered: the linked-layout case is a deliberate control |
| Operator decision on the checker, 2026-09-17 | "Fix it in phase 005 (Recommended)": the checker's pattern admits `.skilled`, with a case that shows a real drift caught, as DeepSeek units reviewed by Luna. D4, REQ-013, AC-013 and T050 to T052 record it. Phase 006's exclusion of the checker now agrees |
| One workspace link was missing in the worktree | The checker requires `@spec-kit/shared`, which resolves through `.opencode/skills/system-deep-loop/node_modules/@spec-kit/shared` in the main checkout. The worktree had no such link, so the checker failed with "Cannot find module". The orchestrator created the same relative link `npm install` makes, under the ignored `node_modules`, and nothing tracked changed. Rollback: remove that `node_modules` directory |
| The CI review found more than it reported | A twin in another event's filter or another dependabot update also satisfied the old rule, and so did a twin moved into a comment on the real `pre-push:149`. The fix matches twins within their group, which covers all of these |
| The runner's awk is untested locally | Only BWK awk 20200816 is installed here. The check uses POSIX constructs only, and the first gawk run is CI on the pushed tip, read under T042 |
| Adjacent, not fixed: the agent workflow installs nothing | `agent-mirror-sync.yml` runs the checker straight after checkout, and without workspace packages the checker exits 1 on its missing parser, which the step reports as drift. Its five latest runs were dependabot pull requests that changed no agent, so no run has reached that path |
| Handoff addition | `lib/mirror-sync-verify.cjs:109-110` normalizes `.opencode`, `.claude` and `.pi` agent paths in agent bodies but not `.skilled`, so a body that phase 009 rewrites to name `.skilled/agents/` would read as drift. It joins the phase 006 handoff list |
<!-- /ANCHOR:log -->
