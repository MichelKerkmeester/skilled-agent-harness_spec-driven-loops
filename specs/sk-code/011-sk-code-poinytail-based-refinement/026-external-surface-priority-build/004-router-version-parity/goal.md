---
title: "Goal: Router version parity"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "router version parity goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity"
    last_updated_at: "2026-10-13T06:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-026-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Router version parity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let a hub `ROUTER.md` keep its own version, by dropping it from doctor check 13a and from the changelog workflow's version copies, while the JSON routing files keep matching `SKILL.md`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `ROUTER.md` keeps its own version (operator ruling, as `frontmatter-versioning.md:28-30` says). 13a compares only `description.json`, `hub-router.json` and `mode-registry.json` with `SKILL.md`; 13b and 13d do not change. |
| D2 | The global branch of both create-changelog YAML twins stops setting `ROUTER.md`'s version; the twins stay aligned. |
| D3 | The enforcement paragraph of `frontmatter-versioning.md` names only the three JSON files as what the doctor's version check compares. |
| D4 | One test pins the change, recorded as `\| T1 \| <name> \| before: exit <n> \| after: exit 0 \|`. Ledger rows VP-1 to VP-4 are `\| VP-<n> \| Fixed \|` with a backticked proof or `\| VP-<n> \| Closed \|` with a reason. |
| D5 | No skill release: the doctor and the commands belong to no skill changelog, and the standard's paragraph is a correction of what a tool does. |
| C1 | Worktree: `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create router-version-parity <002 branch>`, where `<002 branch>` is the `worktrees/NNN-surface-messages` branch phase 002 finished on. Prefix git with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`. Work only there. |
| C2 | DeepSeek makes every edit outside this folder: cli-devin `deepseek-v4-1-flash-max`, or cli-pi `llmgateway/deepseek-v4.1-flash` at `--thinking max` once Devin's daily quota is out. Read that cli's `SKILL.md` first; dispatch with `AI_SESSION_CHILD=1`, `</dev/null` and a timeout; diff each dispatch against HEAD and rerun its checks. |
| C3 | After the build, `/deep:review :auto` runs 5 iterations over this phase's commits on the same executor. Fix every confirmed P0 to P2 and record each finding as `\| RV-<n> \| P<0-2> \| Fixed or Rejected \|` with proof or reason. |
| C4 | prevent-overengineering: the smallest change that passes the checks; no file, option or abstraction the spec does not name. |
| C5 | Doc `version:` lines rise only through the pre-commit gate's `frontmatter-version.mjs bump`, never typed. Long steps run in the foreground. |
| C6 | Commits are `type(scope): imperative` with Context, Changes and Verification and a `Spec:` trailer naming this folder, with no Co-Authored-By or Claude-Session line. Never `--no-verify`, never push, never merge into main. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `[ "$(grep -c "file: 'ROUTER.md'" .skilled/commands/doctor/scripts/parent-skill-check.cjs)" = 0 ] && [ "$(cat .skilled/commands/create/assets/create-changelog-confirm.yaml .skilled/commands/create/assets/create-changelog-auto.yaml | grep -c 'ROUTER.md frontmatter version')" = 0 ] && echo ok`, run from the repository root, prints ok.
- [ ] `F=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md; grep -q 'parent-skill doctor' $F && [ "$(grep 'parent-skill doctor' $F | grep -c 'ROUTER.md')" = 0 ] && python3 .skilled/skills/sk-doc/scripts/validate_document.py $F >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [ ] `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs >/dev/null 2>&1 && bash .skilled/commands/doctor/scripts/tests/run-all.sh >/dev/null 2>&1 && for h in sk-code sk-doc sk-design mcp-tooling system-deep-loop cli-external-orchestration; do node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/$h >/dev/null 2>&1 || echo "$h"; done | grep -c .`, run from the repository root, prints 0.
- [ ] `F=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/implementation-summary.md; [ "$(grep -cE '^\| VP-[1-4] \| (Fixed|Closed) \|' $F)" = 4 ] && [ "$(grep -cE '^\| T1 \| .+ \| before: exit [1-9][0-9]* \| after: exit 0 \|$' $F)" = 1 ] && echo ok`, run from the repository root, prints ok.
- [ ] `C=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity; [ "$(find $C/review/iterations -name 'iteration-*.md' 2>/dev/null | wc -l | tr -d ' ')" = 5 ] && [ "$(grep -E '^\| RV-' $C/implementation-summary.md | grep -vcE '^\| RV-[0-9]+ \| P[0-2] \| (Fixed|Rejected) \|')" = 0 ] && echo ok`, run from the repository root, prints ok.
- [ ] `G='^Spec: sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity$'; [ -n "$(git log --no-merges --grep="$G" --format=%h)" ] && [ "$(git log --no-merges --grep="$G" --format=%B | grep -cE '^(Co-Authored-By|Claude-Session):')" = 0 ] && [ "$(git log --no-merges --format= --name-only --diff-filter=A --grep="$G" -- .skilled/skills | grep -c /changelog/)" = 0 ] && node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base origin/main --check >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--level 2` and `--with-goal`; spec.md lists ledger rows VP-1 to VP-4 and test T1 |
| Build | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| Scope beyond 13a | The operator asked to drop `ROUTER.md` from 13a. The planner added the changelog twins' version-copy line and the standard's paragraph, because both still tie `ROUTER.md` to the release version and would contradict the ruling the moment 13a stops checking it |
| Baselines at planning | Commit a71f719ae4: all six hubs carry a `ROUTER.md` version equal to `SKILL.md` and pass the doctor; the invariants test 97 of 97 |
<!-- /ANCHOR:log -->
