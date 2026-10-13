---
title: "Goal: Surface tie order warning"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "surface tie order warning goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning"
    last_updated_at: "2026-10-13T15:21:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-027"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Surface tie order warning

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the parent-skill doctor report a sk-code surface that sits after `sk-code-opencode` in `routerPolicy.tieBreak`, unless it is `sk-code-obsidian` or `sk-code-webflow`, and name the fix, while the shipped order stays green.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The native and example names are two constants in `parent-skill-check.cjs`, read only on the hub folder `sk-code`; no registry or router field (ADR-001). |
| D2 | Check 5l reports with `softFail`, like 5e and 5i: FAIL and exit 1 by default, WARN under `PARENT_HUB_CHECK_STRICT=0` (ADR-002). It looks at `packetKind: "surface"` modes only, so 5i keeps workflow order. |
| D3 | Three tests in `parent-skill-check-invariants.test.cjs`, each recorded as `\| T<n> \| <name> \| before: <verdict> \| after: pass \|`: a hand-added surface after opencode fails 5l; the shipped order passes; a tree without the examples passes. |
| D4 | No skill release: the doctor belongs to no skill changelog. |
| C1 | Worktree `worktrees/131-tieorder-warning` from origin/main; prefix git with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`. |
| C2 | DeepSeek makes every edit outside this folder: cli-devin `deepseek-v4-1-flash-max`, or cli-pi `llmgateway/deepseek-v4.1-flash` at `--thinking max`; each dispatch diffed and its checks rerun. |
| C3 | After the build, `/deep:review :auto` runs 5 iterations on the same executor; each finding is recorded as `\| RV-<n> \| P<0-2> \| Fixed or Rejected \|` with proof or reason. |
| C4 | Commits are `type(scope): imperative` with Context, Changes and Verification and a `Spec:` trailer naming this folder, with no Co-Authored-By or Claude-Session line. Never `--no-verify`, never push, never merge into main. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code 2>&1 | grep '5l:'`, run from the repository root, prints `PASS: 5l: tieBreak places no added surface after the native surface "sk-code-opencode"`.
- [x] `node .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs 2>&1 | grep -cE '^(✔ 5l (fails|passes) |ℹ fail 0$)'`, run from the repository root, prints 4.
- [x] `bash .skilled/commands/doctor/scripts/tests/run-all.sh >/dev/null 2>&1 && for h in cli-classifier cli-external-orchestration mcp-tooling sk-code sk-design sk-doc system-deep-loop; do node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/$h >/dev/null 2>&1 || echo "$h"; done | grep -c .`, run from the repository root, prints 0.
- [x] `grep -c 'by hand instead, keep your surface ahead of .sk-code-opencode., because the doctor.s check 5l fails' README.md`, run from the repository root, prints 1.
- [x] `C=specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning; [ "$(grep -cE '^\| T[1-3] \| .+ \| before: fail \| after: pass \|$' $C/implementation-summary.md)" = 3 ] && [ "$(find $C/review/iterations -name 'iteration-*.md' | wc -l | tr -d ' ')" = 5 ] && [ "$(grep -E '^\| RV-' $C/implementation-summary.md | grep -vcE '^\| RV-[0-9]+ \| P[0-2] \| (Fixed|Rejected) \|')" = 0 ] && echo ok`, run from the repository root, prints ok.
- [x] `G='^Spec: sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning$'; [ -n "$(git log --no-merges --grep="$G" --format=%h)" ] && [ "$(git log --no-merges --grep="$G" --format=%B | grep -cE '^(Co-Authored-By|Claude-Session):')" = 0 ] && echo ok`, run from the repository root, prints ok.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh `--level 2 --with-goal --with-lazy-addons --path`; the before-after, timeline and roadmap add-ons removed, decision-record kept for ADR-001 and ADR-002 |
| Baseline | Done | origin/main c62d7d1399: invariants suite 99 of 99; the seven hub doctors exit 0 |
| Build | Done | `a682c06d3d`: check 5l, three tests (each failing against the c62d7d1399 checker), heading range and README sentence, each by cli-devin DeepSeek V4.1 Flash max |
| Review | Done | Five iterations on cli-devin `deepseek-v4-1-flash-max`, PASS with 0 P0, 0 P1, 6 P2; RV-1 and RV-3 fixed in `c69ada168f`, RV-2, RV-4, RV-5 and RV-6 rejected with reasons |
| Closeout | Done | Criteria 1 to 7 rerun from the final state: they print the PASS line, 4, 0, 1, ok, ok and `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| A fourth 5l test | D3 names three tests; the review added `5l prints nothing on an sk-code tree whose tieBreak has no sk-code-opencode` under RV-3, recorded as an RV row, not a T row |
| Review driven by a scratch driver | The single-executor workflow steps were run from two scratch scripts: prompt render through `renderPromptPack`, dispatch through the workflow's cli-devin snippet (`buildLineageCommand`, `runAuditedExecutorCommand`, write containment), `verify-iteration.cjs`, claim adjudication and closeout through the append gateway, `reduce-state.cjs` and `upsert.cjs`. The pre-dispatch `writeFirstRecordExecutor` was skipped because it writes the state log directly |
| Graph convergence rows missing | `convergence.cjs` ran before every iteration, but the gateway refused the hand-built `graph_convergence_evaluated` payload for its shape, so the state log carries no graph rows; under stop policy `max-iterations` they decide nothing |
| Duplicate claim-adjudication row | Rerunning the post-iteration script for iteration 1 after a driver bug appended a second, identical `claim_adjudication` row (passed, 0 active); the ledger is append-only, so it stays |
| Executor | Devin accepted the worktree and had quota throughout; the cli-pi fallback was not used |
<!-- /ANCHOR:log -->
