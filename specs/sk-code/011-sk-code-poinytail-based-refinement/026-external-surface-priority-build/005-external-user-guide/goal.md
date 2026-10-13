---
title: "Goal: External user guide"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "external user guide goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide"
    last_updated_at: "2026-10-13T06:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-026-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: External user guide

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the README adaptation block the single guide that takes an external user from the shipped tree to removed examples, their own surface ahead of OpenCode and a green check battery, mark OpenCode native in every canonical inventory, and state the rule in the next release note (research R4 and R9).

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The block keeps its heading "What Adapting `sk-code` Looks Like", which phase 002's 3c line names, and carries the six parts of research section 14.1: native and examples with nested paths; hooks first; keep `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` and `.opencode/skills`; the removal recipe with the hand-maintained ROUTER.md section 11 and the emptied `RESOURCE_MAP` and `INTENT_SIGNALS` keys dropped; the add recipe through `/create:skill-parent update --surfaces`; the verification battery. |
| D2 | `SKILL.md:40`, `README.md:800` and `:1384`, and the sk-code README rows mark OpenCode `native` and Webflow and Obsidian `optional example` surfaces; no line tells the user to replace OpenCode. |
| D3 | The release note is `.skilled/changelog/skilled/v4.0.0.5.md`, or the newer note already on origin/main; it states the rule and the user-visible changes 001 to 004 shipped, including that `ROUTER.md` keeps its own version. v4.0.0.4 is not edited. |
| D4 | Proof is a fresh DeepSeek agent in a fresh full-tree copy whose prompt holds only the block; a failing run changes the block, never the prompt. Ledger rows P11-1 to P11-6 are `\| P11-<n> \| Pass \|` with a backticked command and what it printed. |
| D5 | No skill release: prose only. |
| C1 | Worktree: `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create surface-guide origin/main`, started only once phases 001 to 004 are all on origin/main (each has a commit with its `Spec:` trailer there). Prefix git with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`. Work only there. |
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

- [ ] `m=$(for f in .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/README.md README.md; do grep -qi 'optional example' "$f" || echo "$f"; done); [ -z "$m" ] && grep -q 'native' .skilled/skills/sk-code/SKILL.md && [ "$(grep -cE 'Replace the shipped Webflow|Replace the surface packets' README.md)" = 0 ] && echo ok`, run from the repository root, prints ok.
- [ ] `B=$(awk '/^#### What Adapting .sk-code. Looks Like/{f=1;print;next} f&&/^##/{exit} f' README.md); n=0; for p in .skilled/skills/sk-code/sk-code-webflow/ install-git-hooks.sh 015-router-unification-program .opencode/skills 'update --surfaces' run-all-drift-guards.sh RESOURCE_MAP INTENT_SIGNALS; do case "$B" in *"$p"*) n=$((n+1));; esac; done; echo $n`, run from the repository root, prints 8.
- [ ] `f=$(ls .skilled/changelog/skilled/v*.md | sort -V | tail -1); [ "$f" != .skilled/changelog/skilled/v4.0.0.4.md ] && grep -qi 'optional example' "$f" && grep -q 'sk-code-opencode' "$f" && grep -q 'ROUTER.md' "$f" && python3 .skilled/skills/sk-doc/scripts/validate_document.py "$f" >/dev/null 2>&1 && git diff --quiet origin/main -- .skilled/changelog/skilled/v4.0.0.4.md && echo ok`, run from the repository root, prints ok.
- [ ] `F=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/implementation-summary.md; [ "$(grep -cE '^\| P11-[1-6] \| Pass \|' $F)" = 6 ] && [ "$(grep -E '^\| P11-[1-6] \| Pass \|' $F | grep -vcF "$(printf '\140')")" = 0 ] && echo ok`, run from the repository root, prints ok.
- [ ] `n=0; for c in 001-scaffold-surface-placement 002-doctor-guard-sync-messages 003-example-tolerant-drift-guards 004-router-version-parity; do git log --format=%B | grep -q "^Spec: sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/$c\$" && n=$((n+1)); done; [ $n = 4 ] && bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh >/dev/null 2>&1 && node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code >/dev/null 2>&1 && node .skilled/bin/compiled-route-guard.cjs >/dev/null 2>&1 && node .skilled/bin/compiled-route-sync.cjs --check >/dev/null 2>&1 && node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [ ] `C=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide; G='^Spec: sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide$'; [ "$(find $C/review/iterations -name 'iteration-*.md' 2>/dev/null | wc -l | tr -d ' ')" = 5 ] && [ "$(grep -E '^\| RV-' $C/implementation-summary.md | grep -vcE '^\| RV-[0-9]+ \| P[0-2] \| (Fixed|Rejected) \|')" = 0 ] && [ -n "$(git log --no-merges --grep="$G" --format=%h)" ] && [ "$(git log --no-merges --grep="$G" --format=%B | grep -cE '^(Co-Authored-By|Claude-Session):')" = 0 ] && [ "$(git log --no-merges --format= --name-only --diff-filter=A --grep="$G" -- .skilled/skills | grep -c /changelog/)" = 0 ] && node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base origin/main --check >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--level 2` and `--with-goal`; spec.md lists ledger rows P11-1 to P11-6 |
| Build | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| Release-note version | No Skilled note newer than v4.0.0.4 exists at planning (commit a71f719ae4), so D3 names v4.0.0.5; the operator may renumber it at release |
| Baselines at planning | Commit a71f719ae4: `validate_document.py` reports 0 issues on `README.md`, the sk-code `SKILL.md` and README and v4.0.0.4; `ci-skill-root-metadata.cjs` 14 of 14 |
<!-- /ANCHOR:log -->
