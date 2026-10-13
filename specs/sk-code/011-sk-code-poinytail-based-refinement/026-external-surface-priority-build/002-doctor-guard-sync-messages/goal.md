---
title: "Goal: Doctor guard and sync messages"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "doctor guard sync messages goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/002-doctor-guard-sync-messages"
    last_updated_at: "2026-10-13T06:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, reviewed and closed the phase"
    next_safe_action: "Operator merges the branch to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-026-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Doctor guard and sync messages

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the doctor's 3c line and compiled-route repair string and the guard's authored-drift line name the fix, and make a missing authored compiled-routing closure a named failure in sync and the guard (research R3 and R7).

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The 3c "not an existing sub-directory" line adds a pointer to the README block headed "What Adapting `sk-code` Looks Like" and carries the literal text `What Adapting`. |
| D2 | The `compiled_routes` repair string adds the copy-back to `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/<hub>/manifest.json`, or a commit with hooks installed, before the guard rerun. |
| D3 | The guard's authored-drift line names each drifted hub's runtime manifest, its authored twin and the copy. A missing authored manifest is a named guard failure that names the path, never a pass. |
| D4 | Sync checks that `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` exists before any `lstat`, and otherwise prints one line naming that folder and exits 1, with no stack. |
| D5 | Each behavior change gets one test in an existing test file that fails before and passes after, recorded as `\| T<n> \| <name> \| before: exit <n> \| after: exit 0 \|`. Copy runs are ledger rows P9-1 to P9-7, each `\| P9-<n> \| Pass \|` with a backticked command and what it printed. |
| D6 | No skill release: the doctor command and `.skilled/bin` belong to no skill changelog. Phase 004 branches from this phase's finished branch. |
| C1 | Worktree: `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create surface-messages origin/main`. Prefix git with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`. Work only there. |
| C2 | DeepSeek makes every edit outside this folder: cli-devin `deepseek-v4-1-flash-max`, or cli-pi `llmgateway/deepseek-v4.1-flash` at `--thinking max` once Devin's daily quota is out. Read that cli's `SKILL.md` first; dispatch with `AI_SESSION_CHILD=1`, `</dev/null` and a timeout; diff each dispatch against HEAD and rerun its checks. |
| C3 | After the build, `/deep:review :auto` runs 5 iterations over this phase's commits on the same executor. Fix every confirmed P0 to P2 and record each finding as `\| RV-<n> \| P<0-2> \| Fixed or Rejected \|` with proof or reason. |
| C4 | prevent-overengineering: the smallest change that passes the checks; no file, option or abstraction the spec does not name. |
| C5 | Doc `version:` lines rise only through the pre-commit gate's `frontmatter-version.mjs bump`, never typed. Long steps run in the foreground. |
| C6 | Commits are `type(scope): imperative` with Context, Changes and Verification and a `Spec:` trailer naming this folder, with no Co-Authored-By or Claude-Session line. Never `--no-verify`, never push, never merge into main. |
| C7 | Copy experiments run under the session scratchpad, never in a worktree, with `pwd` checked after each `cd`, and are deleted after. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs >/dev/null 2>&1 && bash .skilled/commands/doctor/scripts/tests/run-all.sh >/dev/null 2>&1 && node --test .skilled/bin/tests/compiled-route-manifest.test.cjs >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [x] `grep -q 'What Adapting' .skilled/commands/doctor/scripts/parent-skill-check.cjs && awk '/name: compiled_routes/,/name: skill_derived_metadata/' .skilled/commands/doctor/assets/doctor-update-apply.yaml | grep -q '015-router-unification-program/013-live-activation' && echo ok`, run from the repository root, prints ok.
- [x] `node .skilled/bin/compiled-route-guard.cjs >/dev/null 2>&1 && node .skilled/bin/compiled-route-sync.cjs --check >/dev/null 2>&1 && node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [x] `F=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/002-doctor-guard-sync-messages/implementation-summary.md; [ "$(grep -cE '^\| P9-[1-7] \| Pass \|' $F)" = 7 ] && [ "$(grep -E '^\| P9-[1-7] \| Pass \|' $F | grep -vcF "$(printf '\140')")" = 0 ] && [ "$(grep -cE '^\| T[1-4] \| .+ \| before: exit [1-9][0-9]* \| after: exit 0 \|$' $F)" = 4 ] && echo ok`, run from the repository root, prints ok.
- [x] `C=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/002-doctor-guard-sync-messages; [ "$(find $C/review/iterations -name 'iteration-*.md' 2>/dev/null | wc -l | tr -d ' ')" = 5 ] && [ "$(grep -E '^\| RV-' $C/implementation-summary.md | grep -vcE '^\| RV-[0-9]+ \| P[0-2] \| (Fixed|Rejected) \|')" = 0 ] && echo ok`, run from the repository root, prints ok.
- [x] `G='^Spec: sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/002-doctor-guard-sync-messages$'; [ -n "$(git log --no-merges --grep="$G" --format=%h)" ] && [ "$(git log --no-merges --grep="$G" --format=%B | grep -cE '^(Co-Authored-By|Claude-Session):')" = 0 ] && [ "$(git log --no-merges --format= --name-only --diff-filter=A --grep="$G" -- .skilled/skills | grep -c /changelog/)" = 0 ] && node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base origin/main --check >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/002-doctor-guard-sync-messages --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--level 2` and `--with-goal`; spec.md lists ledger rows P9-1 to P9-7 and tests T1 to T4 |
| Build | Done | Branch `worktrees/127-surface-messages`: `36cef9db0a`, `ed10d1f294`, `f9eb84c4fe`, review fixes `015d7ea3d0`, closeout `6124743239`; builder cli-pi DeepSeek V4.1 Flash at `--thinking max` (Devin quota exhausted) |
| Review | Done | Five iterations on cli-pi; 0 P0, 0 P1, 8 P2: five fixed, three rejected (RV-1 to RV-8) |
| Criteria | Done | All seven rerun from the final state: criteria 1 to 6 print ok, criterion 7 prints RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Baselines at planning | Commit a71f719ae4: the invariants test 97 of 97, `run-all.sh` 7 suites passed, `compiled-route-manifest.test.cjs` 43 of 43; guard `All hubs fresh or excused`, sync `--check` `all 55 served copies match`, sk-code doctor exit 0 |
| Review executor name | 022's review recorded that the cli-pi allowlist accepts `deepseek-v4.1-flash` and resolves it to `llmgateway/deepseek-v4.1-flash` |
| pi needs `--no-extensions` | The tracked `.pi/extensions/pi-fast-mode-w-subagent-support` and its global copy register the same `--fast` flag, so `pi` refuses to start; every build dispatch and review iteration added `--no-extensions` |
| No changelog file | 026 has no `changelog/` folder and D6 rules out a release; phase 005 writes the release note |
| Review phase save skipped | The workflow continuity save was not run; `implementation-summary.md` was written directly |
<!-- /ANCHOR:log -->
