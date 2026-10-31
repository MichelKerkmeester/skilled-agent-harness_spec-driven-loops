---
title: "Plan: Research Phase 3 for Classifier Models, Jev and a Local Deem"
description: "Prepare 45 angles, run a five-lineage fan-out forced to its cap with one Opus 5.5 high lead steering each lineage, synthesize with a fresh Opus 5.5 max leaf and reconcile the Planned build phases for both backends."
trigger_phrases:
  - "jev research round 3 plan"
  - "five lineage fan-out plan"
  - "lineage lead steering protocol"
  - "deem classifier research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Research Phase 3 for Classifier Models, Jev and a Local Deem

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Runner** | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, one process per lineage running all its iterations |
| **Executors** | cli-cursor (`grok-4.7-xhigh-fast`), cli-pi on `llmgateway` (`deepseek-v4.1-flash` max, `mimo-v2.6-pro` high, `glm-5.3-flash` max), cli-devin (`swe-2-max`) |
| **Leaves** | Opus 5.5 high (preparation, the five lineage leads, phase amendments and authoring), Sonnet prompt-improver (topic), Opus 5.5 max (final synthesis) |
| **Workspace** | Worktree `.worktrees/069-cli-jev-workflow-integration`, branch `worktrees/069-cli-jev-workflow-integration` |

### Overview
Round 3 keeps the round-2 shape and adds three things: a fifth lineage, a lead per lineage and a second backend. Each lineage keeps one lens. `grok` reads outside patterns and the vendored Deem and Jev material, `deepseek` owns seams, gating and failure paths, `mimo` owns UX and measurement, `swe` designs code-level slices and `glm` argues what not to build. Deem 0.8B is served and measured before launch, so every iteration reads `context/deem-local.md` from the first wave on, and the 9B stays a documented option compared from its published numbers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- `context/research-angles.md` holds 45 angles, `grok-01` to `glm-05`, with a coverage table showing every question A to H covered by at least two lineages
- The topic is one line under 1,000 characters with no double quote, backtick, dollar sign or backslash, saved in `scratch/research-topic.txt`
- Each executor answered a `Reply OK` ping, and each lead previewed its lineage's prompt through `buildLoopPrompt`
- `context/deem-local.md` records the served 0.8B: its commit, health check, latency and memory

### Definition of Done
- Five lineages at their cap, each state log ending `maxIterationsReached`, and one lead review per iteration in each `steer.md`
- The final `research/research.md` answers A to H and ranks every recommendation, with its citations verified
- 002, 003, 005 and 006 amended for both backends, new phases authored as Planned, `validate.sh --strict --recursive` prints `RESULT: PASSED` and `check-goal.cjs` passes everywhere
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A forced-depth fan-out with per-lineage steering, then a fresh synthesis. Rounds 1 and 2 used the same fan-out without leads.

### Key Components
- **Preparation leaf** (Opus 5.5 high): writes this phase's spec, plan and tasks, `context/research-angles.md`, a topic draft and `scratch/synthesis-brief.md`. The prompt-improver tightens the topic on Sonnet, and the host saves it in `scratch/research-topic.txt`.
- **Waves**:
  - W1 is iterations 1 to 3, independent.
  - W2 is iterations 4 to 6, each reading the newest iteration of the other lineages and pushing past it.
  - W3 is iterations 7 and 8, new skills and workflows with measured value.
  - W4 is iterations 9 and 10: cost, order and kill criteria.
  - `glm` runs 5 iterations: 1 in W1, 2 and 3 in W2, 4 in W3 and 5 in W4.
- **Leads** (one Opus 5.5 high leaf per lineage): the protocol in section 4.
- **Synthesis leaf** (Opus 5.5 max): writes `research/research.md` from all 45 iterations, the five `steer.md` files, `context/deem-local.md` and both baselines.
- **Reconciliation leaves** (Opus 5.5 high, one per phase): amend 002, 003, 005 and 006 for both backends and author each new Planned phase.

### Data Flow
Angles and topic → lead previews → fan-out with lead reviews per iteration → merge and resource map → final synthesis → close report → reconciled Planned phases.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### The run

From the worktree root, backgrounded, after `export PI_BLACKHOLE_PASSIVE=true`:

```
/deep:research:auto "<topic from scratch/research-topic.txt>"
  --spec-folder=specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research
  --max-iterations=10 --stop-policy=max-iterations --convergence-mode=off --concurrency=5
  --executor=cli-cursor --model=grok-4.7-xhigh-fast --iters=10 --label=grok
  --executor=cli-pi --model=deepseek-v4.1-flash --reasoning-effort=max --iters=10 --label=deepseek
  --executor=cli-pi --model=mimo-v2.6-pro --reasoning-effort=high --iters=10 --label=mimo
  --executor=cli-devin --model=swe-2-max --iters=10 --label=swe
  --executor=cli-pi --model=glm-5.3-flash --reasoning-effort=max --iters=5 --label=glm
```

The runner retries a lineage up to 5 times. Containment stays in the default `preserve` mode (`fanout-run.cjs:3061`). Afterwards the host runs `fanout-merge.cjs`, the resource-map step, the synthesis leaf and `step_convergence_report`.

### The lead protocol (goal D6)

1. **Before launch.** Each lead previews its lineage's prompt through `buildLoopPrompt` and checks three things: the topic resolves its label, iteration N maps to `<label>-NN` in `context/research-angles.md`, and the contract forbids `jev` and Deem calls. It reports the preview to the orchestrator. The goal log records all five before launch.
2. **During the run.** The orchestrator watches each lineage's `iterations/` directory and reports every new iteration file to that lineage's lead by path and number.
3. **Each review.** The lead reads the iteration and checks three things:
   - It covered new ground against both baselines and its own lineage's earlier iterations.
   - Its cited `file:line` resolve. The lead reopens at least two per iteration.
   - It stayed on its angle.
4. **Each steer.** The lead appends one entry to `research/lineages/<label>/steer.md`, headed `Review of iteration NNN`, with its verdict on each check and at most five lines of steering. Every iteration reads `steer.md` first.
   - Steering names gaps, drifted citations and restated findings.
   - Steering never supplies conclusions.
   - A steer written during W1 never cites another lineage's findings, so wave-1 independence holds.
   - Each run executes its iterations back to back, so a steer usually reaches iteration N+2. The lead writes steering that still holds two iterations ahead.
5. **Report back.** The lead reports each review's verdict to the orchestrator in one line.
6. **Limits.** A lead never edits an iteration file, a state log or another lineage's `steer.md`, and never calls `jev` or the Deem server.
7. **Short lineages.** After the main run ends, the lead reruns a lineage that is short of its cap alone, under its label and with the same executor flags. A short lineage never counts as done.

### Deem during the run

Only the orchestrator calls the local Deem server (goal D7). The operator wants Deem kept current with its releases, so the launchd schedule `com.skilled.deem-update` (every 6 hours and at login, loaded 2026-09-27) stays on during the run. An update lands under `~/.local/share/deem/`, outside the repository, and no lineage calls the server, so it cannot disturb an iteration. `context/deem-local.md` stays unedited until the run settles, because an edit to a tracked file outside the lineage directories counts as a containment violation. If the served commit changed by then, the orchestrator re-measures and appends the numbers with that commit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Command or method | Expected |
|-------|-------------------|----------|
| Executor pings | `pi -p --offline --model llmgateway/<id> --thinking <level> "Reply OK" </dev/null` for each of the three cli-pi models, `cursor-agent -p "Reply OK" --model grok-4.7-xhigh-fast`, `devin -p --model swe-2-max "Reply OK"` | Each prints `OK`. Read the text, since the exit code can be 0 on an auth failure |
| Lead previews | `buildLoopPrompt` for each label | The label, the angle mapping and the no-call rules appear in each prompt |
| Lineage depth | Count iteration files and state records per lineage | 10 and 10 for four lineages, 5 and 5 for `glm`, last record `maxIterationsReached` |
| Lead reviews | Count `Review of iteration` headings per `steer.md` | One per iteration |
| Containment | Advisories in the run's events, then `git status` | No lineage write outside its directory. An advisory naming a `steer.md` is a lead's write |
| Citations | Reopen five synthesis citations and three recommendations | Resolved, or drift recorded |
| Packet | `validate.sh --strict --recursive` and `check-goal.cjs` | `RESULT: PASSED` and every check passing on every folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`pi`, `cursor-agent` and `devin` logged in. The runner's allowlists already carry all five model ids (`fanout-run.cjs:2284`, `:2304`, `:2309`, `:2321` and the devin roster). Deem 0.8B is installed under `~/.local/share/deem/` and blocks nothing: no lineage calls it, so a stopped server changes no lineage's work.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Everything lands in path-scoped commits on the worktree branch. To undo, revert those commits. Nothing is pushed or merged. The Deem install lives outside every repository. Stopping it is `kill $(cat ~/.local/share/deem/server.pid)` and removing it is `rm -rf ~/.local/share/deem` (`context/deem-local.md:55-61`), both the orchestrator's, and none of this phase's files depend on it.
<!-- /ANCHOR:rollback -->

---
