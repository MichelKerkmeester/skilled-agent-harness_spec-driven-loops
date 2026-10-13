---
title: "Goal: Doctor sk-code setup"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "doctor sk-code setup goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup"
    last_updated_at: "2026-10-13T19:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Build from origin/main once 001 is on it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-029-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Doctor sk-code setup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the external sk-code user one read-only doctor command that runs the verify battery and names the repair for each failing leg (research R3).

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The command is `/doctor:sk-code` with one target `setup`, `mutating: read-only`, added by the recipe in `_routes.yaml`. No hub mode, no `/doctor:skill-advisor` target, no write. |
| D2 | One script, `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs`, runs the legs, because a verdict an agent reads from JSON is the failure R3 removes. Legs: provisioning precheck, doctor on sk-code, `ci-skill-root-metadata.cjs`, guard, sync `--check`, drift guards, `ci-skill-derived-freshness.cjs`, and a probe that must print `"action":"route"`. |
| D3 | Each failing leg prints one repair command, matching the README block and the guard's fix line; a failed precheck reports the legs that need the build as skipped. |
| D4 | Copy runs are ledger rows S-1 to S-3, each `\| S-<n> \| Pass \|` with a backticked command and what it printed. |
| C1 | Worktree from origin/main once 001 is on it: `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create doctor-sk-code-setup origin/main`. Prefix git with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`. |
| C2 | External DeepSeek makes every edit outside this folder: cli-devin `deepseek-v4-1-flash-max`, or cli-pi `llmgateway/deepseek-v4.1-flash` at `--thinking max` with `--no-extensions`. Dispatch with `AI_SESSION_CHILD=1`, `</dev/null` and a timeout; diff each dispatch and rerun its checks. |
| C3 | After the build, `/deep:review :auto` runs 5 iterations on the same executor. Fix every confirmed P0 to P2 and record each as `\| RV-<n> \| P<0-2> \| Fixed or Rejected \|` with proof or reason. |
| C4 | Commits are `type(scope): imperative` with Context, Changes and Verification and a `Spec:` trailer naming this folder, with no Co-Authored-By or Claude-Session line. Never `--no-verify`, never push, never merge into main. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh >/dev/null 2>&1 && grep -A8 'command: /doctor:sk-code' .skilled/commands/doctor/_routes.yaml | grep -q 'target: setup' && grep -A8 'command: /doctor:sk-code' .skilled/commands/doctor/_routes.yaml | grep -q 'mutating: read-only' && echo ok`, run from the repository root, prints ok.
- [ ] `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs >/dev/null 2>&1 && bash .skilled/commands/doctor/scripts/tests/run-all.sh >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [ ] `F=specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/implementation-summary.md; [ "$(grep -cE '^\| S-[1-3] \| Pass \|' $F)" = 3 ] && [ "$(grep -E '^\| S-[1-3] \| Pass \|' $F | grep -vcF "$(printf '\140')")" = 0 ] && echo ok`, run from the repository root, prints ok.
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check >/dev/null 2>&1 && node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs >/dev/null 2>&1 && grep -c '/doctor:sk-code' README.md .skilled/skills/sk-code/README.md .skilled/skills/sk-code/SKILL.md | grep -vc ':0$'`, run from the repository root, prints 3.
- [ ] `C=specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup; [ "$(find $C/review/iterations -name 'iteration-*.md' 2>/dev/null | wc -l | tr -d ' ')" = 5 ] && [ "$(grep -E '^\| RV-' $C/implementation-summary.md | grep -vcE '^\| RV-[0-9]+ \| P[0-2] \| (Fixed|Rejected) \|')" = 0 ] && echo ok`, run from the repository root, prints ok.
- [ ] `G='^Spec: sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup$'; [ -n "$(git log --no-merges --grep="$G" --format=%h)" ] && [ "$(git log --no-merges --grep="$G" --format=%B | grep -cE '^(Co-Authored-By|Claude-Session):')" = 0 ] && node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base origin/main --check >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--level 2` and `--with-goal`; build waits on 001 reaching origin/main |

### Deviations and findings

| Item | Note |
|------|------|
| D2 adds a script the research file list does not name | Research section 8 lists the command doc, route, YAML and presentation. A YAML-only route leaves the probe verdict to an agent reading JSON, which is F7 itself and which no criterion can check, so one read-only script in `doctor/scripts/` carries the legs, as `parent-skill-check.cjs` and `git-standards.cjs` do for their routes |
<!-- /ANCHOR:log -->
