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
    last_updated_at: "2026-09-17T00:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Implemented and verified every unit locally; the five contract reviews wait for Codex quota"
    next_safe_action: "Run the contract reviews, then publish"
    blockers:
      - "Codex usage limit until 2026-09-19 10:29 blocks the GPT-5.6 contract reviews"
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
| D3 | DeepSeek V4.1 Flash max on cli-pi through the LLM Gateway makes the literal edits, one workflow or hook section per brief, suite-verified before the next. The block, the missing-script rule, the fail-closed workflows, the check and the drill are drafted by the orchestrator or DeepSeek, reviewed by GPT-5.6 on cli-codex and verified by the orchestrator. |
| D4 | The scripts the gates call and the human-facing text naming `.opencode` stay as they are in this phase. Phase 006 teaches those scripts and phase 009 rewrites that text. |

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
- [ ] Every contract change has a GPT-5.6 review with no open finding
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
| T012, T031, T034, T047 reviews and T042 publish | Blocked | All wait for Codex quota, back on 2026-09-19 at 10:29, or an approved substitute reviewer |
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
<!-- /ANCHOR:log -->
