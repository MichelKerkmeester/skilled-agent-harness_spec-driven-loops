---
title: "Goal: Clone path and messages"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "clone path and messages goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages"
    last_updated_at: "2026-10-13T19:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-029-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Clone path and messages

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let an external user who clones the repository and follows only the README adapting block reach a green check battery, with every failure on the way naming its fix (research R1, R2, R4 and R5).

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | "Before you start" names `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .` for a fresh clone and `git config --local skilled.trustRepoHooks true` for a clone that runs the hooks. The `worktree-naming.sh` usage line stays as it is. |
| D2 | The guard keeps `Re-mint: <hubs>` and adds, per stale hub, the `compiled-route-manifest.cjs refresh --hub <hub> --skill-root .skilled/skills/<hub>` command, the runtime manifest, its authored twin and the copy, or a commit with the hooks installed. |
| D3 | An unresolvable `@spec-kit/shared` throws one line naming the provision command; `ci-skill-root-metadata.cjs` prints it with no stack and exits 1; any other load error is rethrown unchanged. |
| D4 | Each behavior change gets a test that fails against the origin/main source and one edge case, recorded as `\| T<n> \| <name> \| before: exit <n> \| after: exit 0 \|`. Copy and clone runs are ledger rows L-1 to L-6, each `\| L-<n> \| Pass \|` with a backticked command and what it printed. |
| D5 | No skill release: no skill doc changes, and the root README and `.skilled/bin` belong to no skill changelog. |
| C1 | Worktree `worktrees/133-surface-setup-build` from origin/main. Prefix git with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`. |
| C2 | External DeepSeek makes every edit outside this folder: cli-devin `deepseek-v4-1-flash-max`, or cli-pi `llmgateway/deepseek-v4.1-flash` at `--thinking max` with `--no-extensions`. Dispatch with `AI_SESSION_CHILD=1`, `</dev/null` and a timeout; diff each dispatch and rerun its checks. |
| C3 | After the build, `/deep:review :auto` runs 5 iterations over this phase's changes on the same executor. Fix every confirmed P0 to P2 and record each as `\| RV-<n> \| P<0-2> \| Fixed or Rejected \|` with proof or reason. |
| C4 | Commits are `type(scope): imperative` with Context, Changes and Verification and a `Spec:` trailer naming this folder, with no Co-Authored-By or Claude-Session line. Never `--no-verify`, never push, never merge into main. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `T=$(mktemp -d); git clone -q . "$T/c"; (cd "$T/c" && O=$(node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs 2>&1); R=$?; [ $R = 1 ] && echo "$O" | grep -q 'worktree-naming.sh provision' && ! echo "$O" | grep -qE '^ +at ' && bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision . >/dev/null 2>&1 && node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs >/dev/null 2>&1 && node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code >/dev/null 2>&1 && echo ok); rm -rf "$T"`, run from the repository root, prints ok.
- [ ] `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs >/dev/null 2>&1 && node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs >/dev/null 2>&1 && node .skilled/bin/compiled-route-guard.cjs >/dev/null 2>&1 && node .skilled/bin/compiled-route-sync.cjs --check >/dev/null 2>&1 && bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh >/dev/null 2>&1 && grep -q 'compiled-route-manifest.cjs refresh --hub' .skilled/bin/compiled-route-guard.cjs && echo ok`, run from the repository root, prints ok.
- [ ] `A=$(awk '/^#### What Adapting/,/^### Core Configuration/' README.md); n=0; for p in 'worktree-naming.sh provision \.' 'skilled.trustRepoHooks' 'regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write' 'leaf-scopes.json' 'feature-catalog/feature-catalog.md' 'phase-detection.md'; do echo "$A" | grep -q -- "$p" && n=$((n+1)); done; echo $n`, run from the repository root, prints 6.
- [ ] `F=specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages/implementation-summary.md; [ "$(grep -cE '^\| L-[1-6] \| Pass \|' $F)" = 6 ] && [ "$(grep -E '^\| L-[1-6] \| Pass \|' $F | grep -vcF "$(printf '\140')")" = 0 ] && [ "$(grep -cE '^\| T[13] \| .+ \| before: exit [1-9][0-9]* \| after: exit 0 \|$' $F)" = 2 ] && [ "$(grep -cE '^\| T[24] \| .+ \| before: exit [0-9]+ \| after: exit 0 \|$' $F)" = 2 ] && echo ok`, run from the repository root, prints ok.
- [ ] `C=specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages; [ "$(find $C/review/iterations -name 'iteration-*.md' 2>/dev/null | wc -l | tr -d ' ')" = 5 ] && [ "$(grep -E '^\| RV-' $C/implementation-summary.md | grep -vcE '^\| RV-[0-9]+ \| P[0-2] \| (Fixed|Rejected) \|')" = 0 ] && echo ok`, run from the repository root, prints ok.
- [ ] `G='^Spec: sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages$'; [ -n "$(git log --no-merges --grep="$G" --format=%h)" ] && [ "$(git log --no-merges --grep="$G" --format=%B | grep -cE '^(Co-Authored-By|Claude-Session):')" = 0 ] && [ "$(git log --no-merges --format= --name-only --diff-filter=A --grep="$G" -- .skilled/skills | grep -c /changelog/)" = 0 ] && node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base origin/main --check >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--level 2` and `--with-goal`; spec.md lists ledger rows L-1 to L-6 and tests T1 to T4 |
| Build | In Progress | Three concurrent cli-devin DeepSeek V4.1 Flash max dispatches: README (R1, R4), guard (R2), contract library (R5) |

### Deviations and findings

| Item | Note |
|------|------|
| Baselines at planning | Commit 732f9e9d30: doctor on sk-code exit 0, `ci-skill-root-metadata.cjs` `checked=14 passed=14`, guard `All hubs fresh or excused`, sync `--check` `all 55 served copies match`, drift guards 4 passed with 278 warnings, `compiled-route-manifest.test.cjs` 46 of 46, `root-router-contract.test.cjs` exit 0 |
<!-- /ANCHOR:log -->
