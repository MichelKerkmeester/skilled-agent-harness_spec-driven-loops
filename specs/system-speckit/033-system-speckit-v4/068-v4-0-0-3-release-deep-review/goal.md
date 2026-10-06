---
title: "Goal: v4.0.0.3 release deep review"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review"
    last_updated_at: "2026-10-05T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: v4.0.0.3 release deep review

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Review everything shipped in `v4.0.0.2..v4.0.0.3` with a five-lineage `/deep:review:auto` fan-out, converged early by the operator at 30 iterations, then have a fresh Opus 5.5 at high effort synthesize one ranked finding report and a fresh Opus 5.5 at medium effort explain the Luna stops, then commit and push the packet to `main`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Review target is the commit range `v4.0.0.2..v4.0.0.3`. Findings only: no file outside this packet and the parent phase map is edited |
| D2 | Luna runs on three routes at once, all on the OpenAI (ChatGPT sign-in) provider, effort `max`, 10 iterations each: `luna-max` on `cli-pi` (`gpt-6-luna`, no service tier on Pi), and in a second fan-out under `review/luna-wave/`, `luna-codex` on `cli-codex` (`gpt-6-luna`, tier `fast`) and `luna-opencode` on `cli-opencode` (`openai/gpt-6-luna-fast`) |
| D3 | Lineage `deepseek-flash-max`: `cli-pi`, model `opencode-go/deepseek-v4.1-flash`, effort `max`, 15 iterations. If that route fails, switch to `cline-pass/deepseek-v4.1-flash` at `xhigh` and log the switch |
| D4 | Lineage `swe2-max`: `cli-devin`, model `swe-2-max`, 10 iterations |
| D5 | Run through the official `/deep:review:auto` fan-out with `--stop-policy=max-iterations`. Iterations may widen scope into files their findings point to. The operator ended the run early on 2026-10-06 at 30 of 55 iterations; no lineage is resumed after that |
| D6 | A fresh Opus 5.5 high-effort agent writes `review/review-report.md` from the merged registries and iteration files of both fan-outs. Work runs in worktree 090 on its current branch |
| D7 | A fresh Opus 5.5 medium-effort agent writes `review/luna-halt-analysis.md`: why Luna lineages stop under interactive repo rules while DeepSeek and SWE 2 did not, with ranked fixes. It edits no other file |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/` holds 30 `iteration-*.md` files across its lineage folders: 15 under `lineages/deepseek-flash-max/iterations/`, 10 under `lineages/swe2-max/iterations/`, 3 under `lineages/luna-max/iterations/` and 2 under `luna-wave/lineages/luna-codex/iterations/`
- [ ] `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/luna-halt-analysis.md` exists
- [ ] `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/review-report.md` exists and states a verdict of PASS, CONDITIONAL or FAIL
- [ ] `git status --short` lists no changed path outside `specs/system-speckit/033-system-speckit-v4/`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review --strict` prints `RESULT: PASSED`
- [ ] `git log origin/main -- specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/review-report.md` lists at least one commit
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
| Packet docs and goal | Done | spec.md, acceptance-criteria.md, goal.md authored 2026-10-05 |
| Route smokes | Done | 2026-10-06: `openai/gpt-6-luna`, `opencode-go/deepseek-v4.1-flash` and devin `swe-2-max` each replied PONG |
| Fan-out run | Done (early) | `fanout-run.cjs` started all three lineages 2026-10-06T04:14:18Z (`review/orchestration-status.log`); config validated by `parseFanoutConfig` + `preflightFanoutCapabilities` |
| Opus 5.5 high synthesis | Done | `review/review-report.md`: CONDITIONAL, 0 P0, 3 P1, 18 P2 (21 after dedup of 25) |
| Opus 5.5 medium Luna analysis | Done | `review/luna-halt-analysis.md`: 8 ranked fixes |
| Validate, commit, push | Pending | - |

### Deviations and findings

| Item | Note |
|------|------|
| Luna "fast" tier | Pi has no service-tier control (cli-pi providers-and-models.md line 162), so Luna runs at `max` with no tier |
| Iteration total | The request said 30; the split it named sums to 35, and the operator chose 35 on 2026-10-05 |
| Range as target | `/deep:review` takes spec-folder, skill, agent, track or files targets, not a git range, and fan-out lineages always target the spec folder. The range is carried by `goal-file-manifest.txt` (1,997 files added, modified or renamed in the range that still exist, minus specs, archives, dist, lockfiles, changelogs and fixtures), which the spec-folder scope step reads |
| Active expansion | Each lineage's `steer.md`, the lead-review file the runner tells CLI lineages to read before every iteration, gives a starting focus area and tells it to follow findings outside that area |
| Luna stops (attempts 1 and 2) | Luna on Pi stopped itself twice under the interactive `AGENTS.md` rules: first a Logic-Sync on `SKILL.md:392` versus `deep-review-auto.yaml:2322-2325`, then a halt when the claim-adjudication gateway could not read a file that exists. Lead rulings in each `steer.md` cover both; attempt 3 resumes from iteration 2 |
| Amendment 2026-10-06 (D2, criteria) | Operator asked for Luna on cli-pi, cli-opencode and cli-codex at once, all on the GPT provider, properly prompted. Added `luna-codex` and `luna-opencode` (10 iterations each) as a second fan-out under `review/luna-wave/`, because a second runner on the shared `review/` ledger would mark the live lineages as orphaned. Each has an RCAF `steer.md`. Both routes replied PONG before launch |
| Early convergence 2026-10-06 (objective, D5, D6, D7, criteria) | Operator stopped the run at 30 of 55 iterations and asked for an Opus 5.5 medium analysis of the Luna stops and an Opus 5.5 high synthesis from what exists. Runners stopped by captured PID at 07:36Z; both fan-outs merged with `fanout-merge.cjs` (first: CONDITIONAL, 0 P0, 8 P1; Luna wave: PASS on 2 partial iterations). Later Luna stops: Pi connection errors after the pause, a session restart that SIGTERMed both runners, then stale-lock and session-ID questions. `.opencode/package.json` and its lockfile, rewritten by OpenCode at startup, were restored from HEAD |
| Per-iteration timeout | A CLI lineage runs its whole loop in one process, so `timeoutSeconds` 1800 sizes the lineage budget, which the runner caps at the 4-hour lineage ceiling |
<!-- /ANCHOR:log -->
