---
title: "Goal: Example-tolerant drift guards"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "example tolerant drift guards goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards"
    last_updated_at: "2026-10-13T06:00:00Z"
    last_updated_by: "builder"
    recent_action: "Built, reviewed and verified every criterion"
    next_safe_action: "Operator merge of the phase branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-026-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Example-tolerant drift guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the sk-code drift guards pass after an example surface is removed by the documented recipe while the operator's tree passes exactly as before (research R2).

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `SURFACES` and `SURFACE_PACKETS` in `verify-router-sync.cjs` are filtered to packet directories on disk. No minted discriminator, schema field or fixture hub (X20, X24). |
| D2 | Leg 3 skips an archived route-gold destination only when the leaf manifest no longer declares its mode; a declared mode that resolves to no leaf still fails. |
| D3 | Leg 1a's prose scan starts at the first `## N. <NAME> MAP` heading; the literal `'## 4. WEBFLOW MAP'` anchor is removed. |
| D4 | Doc-claims `surfaces` takes its count from the `packetKind` `surface` modes in `mode-registry.json`; no text says the hub has three surfaces. |
| D5 | Each change gets one test in the existing test files, recorded as `\| T<n> \| <name> \| before: exit <n> \| after: exit 0 \|`. Copy runs are ledger rows P10-1 to P10-5, each `\| P10-<n> \| Pass \|` with a backticked command and what it printed. |
| D6 | Release: exactly one, of the sk-code-skilled mode packet (its `SKILL.md` version and one changelog entry), because its guard tooling changed. |
| C1 | Worktree: `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create drift-guard-tolerance origin/main`. Prefix git with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`. Work only there. |
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

- [x] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh >/dev/null 2>&1 && node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/ >/dev/null 2>&1 && node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [x] `S=.skilled/skills/sk-code/sk-code-skilled/assets/scripts; [ "$(grep -c "'## 4. WEBFLOW MAP'" $S/verify-router-sync.cjs)" = 0 ] && [ "$(grep -ci 'has three surfaces' $S/verify-doc-claims.cjs)" = 0 ] && echo ok`, run from the repository root, prints ok.
- [x] `F=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/implementation-summary.md; [ "$(grep -cE '^\| P10-[1-5] \| Pass \|' $F)" = 5 ] && [ "$(grep -E '^\| P10-[1-5] \| Pass \|' $F | grep -vcF "$(printf '\140')")" = 0 ] && [ "$(grep -cE '^\| T[1-4] \| .+ \| before: exit [1-9][0-9]* \| after: exit 0 \|$' $F)" = 4 ] && echo ok`, run from the repository root, prints ok.
- [x] `C=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards; [ "$(find $C/review/iterations -name 'iteration-*.md' 2>/dev/null | wc -l | tr -d ' ')" = 5 ] && [ "$(grep -E '^\| RV-' $C/implementation-summary.md | grep -vcE '^\| RV-[0-9]+ \| P[0-2] \| (Fixed|Rejected) \|')" = 0 ] && echo ok`, run from the repository root, prints ok.
- [x] `G='^Spec: sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards$'; [ -n "$(git log --no-merges --grep="$G" --format=%h)" ] && [ "$(git log --no-merges --grep="$G" --format=%B | grep -cE '^(Co-Authored-By|Claude-Session):')" = 0 ] && [ "$(git log --no-merges --format= --name-only --diff-filter=A --grep="$G" -- .skilled/skills | grep -c /changelog/)" = 1 ] && [ "$(git log --no-merges --format= --name-only --diff-filter=A --grep="$G" -- .skilled/skills/sk-code/sk-code-skilled/changelog | grep -c .)" = 1 ] && node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base origin/main --check >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--level 2` and `--with-goal`; spec.md lists ledger rows P10-1 to P10-5 and tests T1 to T4 |
| Build | Done | `b6eef4ebbb` guard changes, tests T1 to T4 and sk-code-skilled 1.2.4.0; every edit by DeepSeek V4.1 Flash on cli-pi (Devin quota exhausted) |
| Review | Done | `/deep:review :auto`, 5 iterations on cli-pi: PASS with 9 P2; 4 fixed in `1f0ca7deea`, 5 rejected with reasons (RV-1 to RV-9) |
| Criteria | Done | All six rerun from the final state on 2026-10-13: five print ok, strict validate prints RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Baselines at planning | Commit a71f719ae4: `run-all-drift-guards.sh` exit 0, all 4 guards passed with 278 non-blocking warnings; the sk-code-skilled tests 18 of 18 |
| Pi extension collision in worktrees | The global pi extension links into the main checkout and collides with the worktree copy (`--fast conflicts`); builder dispatches passed `--no-extensions`, and review dispatches ran through a scratchpad `pi` shim that adds it |
| Allowlist row | The registry count rule flagged a checklist line that counts runtime agent directories, so it got one `ALLOWED` row in `verify-doc-claims.cjs` |
| Scripts READMEs | Both READMEs described the surfaces rule as a three-surface check, so they changed with D4 (the assets README in the build, the scripts README after review) |
| Review executor name | 022's review recorded that the cli-pi allowlist accepts `deepseek-v4.1-flash` and resolves it to `llmgateway/deepseek-v4.1-flash` |
<!-- /ANCHOR:log -->
