---
title: "Goal: Scaffold surface placement"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "scaffold surface placement goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement"
    last_updated_at: "2026-10-13T06:00:00Z"
    last_updated_by: "builder"
    recent_action: "Built, proved, reviewed and closed the phase"
    next_safe_action: "Operator merges worktrees/125-surface-placement to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-026-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Scaffold surface placement

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the parent-skill scaffold place a new surface mode after the workflow modes and ahead of the existing surface modes in `tieBreak`, and make its completion report name the canary and commit follow-ups it cannot run (research R1 and R8).

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The rule is one phrase, `ahead of the existing surface modes`, written into the step_4 `hub-router.json` activity of both create-skill-parent YAML twins on identical lines, the tie-break paragraph of `parent-hub-router-schema.md` and the tie-break row of `parent-skills-nested-packets.md`. Nothing else states it. |
| D2 | The shipped order in `.skilled/skills/sk-code/hub-router.json` and the operator's routes do not change. |
| D3 | The step_6 report of both twins gains two lines: author a canary case in `canary-cases.v1.json` and copy the fixture to its authored twin; commit with the hooks from `install-git-hooks.sh` installed, or refresh and copy the manifest by hand. The scaffold runs neither (X10, X14). |
| D4 | Proof is a stand-in surface `sk-code-acme` added by the twin's update workflow in a throwaway full-tree copy, recorded as ledger rows P8-1 to P8-6 in `implementation-summary.md`, each `\| P8-<n> \| Pass \|` with a backticked command and what it printed. |
| D5 | Release: exactly one, of the sk-create-skill mode packet (its `SKILL.md` version and one changelog entry), because its parent-hub contract changed. |
| C1 | Worktree: `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create surface-placement origin/main`. Prefix git with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`. Work only there. |
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

- [x] `A=.skilled/commands/create/assets; R=.skilled/skills/sk-doc/sk-create-skill/references/parent-skill; P='ahead of the existing surface modes'; grep -qF "$P" $A/create-skill-parent-confirm.yaml && [ "$(grep -F "$P" $A/create-skill-parent-confirm.yaml | sed 's/^ *//')" = "$(grep -F "$P" $A/create-skill-parent-auto.yaml | sed 's/^ *//')" ] && grep -qF "$P" $R/parent-hub-router-schema.md && grep -qF "$P" $R/parent-skills-nested-packets.md && echo ok`, run from the repository root, prints ok.
- [x] `n=0; for f in .skilled/commands/create/assets/create-skill-parent-confirm.yaml .skilled/commands/create/assets/create-skill-parent-auto.yaml; do s=$(awk '/step_6_completion:/,/outputs:/' "$f"); case "$s" in *canary-cases.v1.json*) case "$s" in *install-git-hooks.sh*) n=$((n+1));; esac;; esac; done; echo $n`, run from the repository root, prints 2.
- [x] `F=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement/implementation-summary.md; [ "$(grep -cE '^\| P8-[1-6] \| Pass \|' $F)" = 6 ] && [ "$(grep -E '^\| P8-[1-6] \| Pass \|' $F | grep -vcF "$(printf '\140')")" = 0 ] && echo ok`, run from the repository root, prints ok.
- [x] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code >/dev/null 2>&1 && node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc >/dev/null 2>&1 && bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh >/dev/null 2>&1 && python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md >/dev/null 2>&1 && python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [x] `C=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement; [ "$(find $C/review/iterations -name 'iteration-*.md' 2>/dev/null | wc -l | tr -d ' ')" = 5 ] && [ "$(grep -E '^\| RV-' $C/implementation-summary.md | grep -vcE '^\| RV-[0-9]+ \| P[0-2] \| (Fixed|Rejected) \|')" = 0 ] && echo ok`, run from the repository root, prints ok.
- [x] `G='^Spec: sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement$'; [ -n "$(git log --no-merges --grep="$G" --format=%h)" ] && [ "$(git log --no-merges --grep="$G" --format=%B | grep -cE '^(Co-Authored-By|Claude-Session):')" = 0 ] && [ "$(git log --no-merges --format= --name-only --diff-filter=A --grep="$G" -- .skilled/skills | grep -c /changelog/)" = 1 ] && [ "$(git log --no-merges --format= --name-only --diff-filter=A --grep="$G" -- .skilled/skills/sk-doc/sk-create-skill/changelog | grep -c .)" = 1 ] && node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base origin/main --check >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--level 2` and `--with-goal`; spec.md lists ledger rows P8-1 to P8-6 |
| Build | Done | `17bb342b1c` build and sk-create-skill 1.5.4.0; `d500377abc` review fix and review packet; closeout commit carries the docs |
| Copy proof | Done | P8-1 to P8-6 in `implementation-summary.md`; copy deleted after |
| Deep review | Done | 5 iterations, cli-pi DeepSeek V4.1 Flash max, verdict PASS, P2 2: RV-1 Fixed, RV-2 Rejected |
| Criteria rerun | Done | 2026-10-13 from the final state: 1 ok, 2 printed 2, 3 ok, 4 ok, 5 ok, 6 ok, 7 `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Line anchors | Planned against commit a71f719ae4: the confirm twin's `hub-router.json` activity is line 462 and its step_6_completion starts at line 542; the auto twin's are lines 423 and 495. Re-anchor if they moved |
| Review executor name | 022's review recorded that the cli-pi allowlist accepts `deepseek-v4.1-flash` and resolves it to `llmgateway/deepseek-v4.1-flash` |
| Line anchors, rechecked | Unchanged at 4b9bf840b0: 462 and 542 (confirm), 423 and 495 (auto) |
| Executor | Devin answered `resource_exhausted` (daily quota), so every build and review dispatch ran on cli-pi `llmgateway/deepseek-v4.1-flash --thinking max`, as C2 allows |
| pi in a linked worktree | The global extension symlink points at the main checkout's `.pi/extensions` and the worktree carries its own copy; both register `--fast`, so pi refuses to start. Build dispatches used `-ne`; the review's cli-pi branch was run with `--no-extensions` added after `-p`, the only change to the workflow's dispatch script. The shared builder adds the flag only for read-only leaves, which is worth a fix there |
| Canary path in step_6 | Written as `009-parent-hub-rollout/<NNN>-<hub>/` instead of the literal `001-sk-code` path, because the scaffold serves every hub; the checked file name is unchanged |
| Review graph event | The first `graph_convergence_evaluated` row was refused for its shape; it was rebuilt to the schema's six signal fields and accepted from iteration 1 on |
| Save side effect | The continuity save stamped the parent and epic `graph-metadata.json`; those two hunks were reversed so this branch touches no file outside the phase but its scope |
| Phase changelog | `spec.md` asks to refresh the matching file in `../changelog/`; the parent has no `changelog/` folder, so there was nothing to refresh |
<!-- /ANCHOR:log -->
