---
title: "Plan: Research Phase 2 for the Council-Revised Jev Recommendations"
description: "Re-synthesize round 1 from the council review, prepare 20 angles, run a four-lineage fan-out forced to 5 iterations each, synthesize with a fresh Opus 5.5 max leaf and reconcile the Planned build phases."
trigger_phrases:
  - "jev research round 2 plan"
  - "four lineage fan-out plan"
  - "jev re-synthesis plan"
  - "swe-2 max cursor pi fan-out"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Research Phase 2 for the Council-Revised Jev Recommendations

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Runner** | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, one process per lineage running all its iterations |
| **Executors** | cli-cursor (`grok-4.7-xhigh-fast`), cli-pi on llmgateway (`mimo-v2.6-pro` high, `deepseek-v4.1-flash` max), cli-devin (`swe-2-max`) |
| **Leaves** | Opus 5.5 xhigh (re-synthesis), Opus 5.5 high (angles, brief, phase authoring), Sonnet prompt-improver (topic), Opus 5.5 max (final synthesis) |
| **Workspace** | Worktree `.worktrees/069-cli-jev-workflow-integration`, branch `worktrees/069-cli-jev-workflow-integration` |

### Overview
The council review becomes the new baseline first, so round 2 deepens the revised recommendations rather than the superseded ones. Each lineage keeps one lens: `grok` for outside patterns and the referenced material, `mimo` for UX and measurement, `swe` for code-level slice design, and `deepseek` for seams, gating and failure paths. Grok 4.7 lists no MAX tier, so `grok-4.7-xhigh-fast` stands in, as in round 1.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- The re-synthesized round-1 `research.md` exists and marks its changes
- `context/research-angles.md` holds 20 angles, `grok-01` to `deepseek-05`
- Each executor answered a `Reply OK` ping, and each lineage prompt previewed through `buildLoopPrompt`

### Definition of Done
- Four lineages of 5 iterations, each state log ending `maxIterationsReached`
- The final `research/research.md` ranks every recommendation, and its citations are verified
- Planned phases reconciled; `validate.sh --strict --recursive` prints `RESULT: PASSED` and `check-goal.cjs` passes everywhere
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Re-synthesis, then a forced-depth fan-out, then a fresh synthesis. The same shape as round 1, with the council review folded in before the fan-out.

### Key Components
- **Re-synthesis leaf** (Opus 5.5 xhigh): rewrites `../001-deep-research/research/research.md` from `council-report.md` and `proposed-resynthesis.md`, reopens each council claim it keeps and adds a changes section.
- **Preparation leaf** (Opus 5.5 high): writes `context/research-angles.md` (20 angles in three waves), a draft topic and `scratch/synthesis-brief.md`. The prompt-improver tightens the topic on Sonnet, and the host saves it as one line with no double quote, backtick, dollar sign or backslash in `scratch/research-topic.txt`.
- **Waves**: W1 is iterations 1 and 2, independent, grounding the re-synthesis's recommendations in code and the referenced material. W2 is iterations 3 and 4, each reading the newest iteration of the other lineages and pushing past it. W3 is iteration 5: build order, cost, failure modes and kill criteria.
- **Synthesis leaf** (Opus 5.5 max): writes `research/research.md` from all 20 iterations, the round-1 re-synthesis and the council report.

### Data Flow
Council review → round-1 re-synthesis → angles and topic → fan-out → merge and resource map → final synthesis → close report → reconciled Planned phases.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

The run, from the worktree root, backgrounded, after `export PI_BLACKHOLE_PASSIVE=true`:

```
/deep:research:auto "<topic from scratch/research-topic.txt>"
  --spec-folder=specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion
  --max-iterations=5 --stop-policy=max-iterations --convergence-mode=off --concurrency=4
  --executor=cli-cursor --model=grok-4.7-xhigh-fast --iters=5 --label=grok
  --executor=cli-pi --model=mimo-v2.6-pro --reasoning-effort=high --iters=5 --label=mimo
  --executor=cli-devin --model=swe-2-max --iters=5 --label=swe
  --executor=cli-pi --model=deepseek-v4.1-flash --reasoning-effort=max --iters=5 --label=deepseek
```

The runner retries a lineage up to 5 times. A lineage still short of 5 iterations is rerun alone under its label and never counts as done. Afterwards the host runs `fanout-merge.cjs`, the resource-map step, the synthesis leaf and `step_convergence_report`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Command or method | Expected |
|-------|-------------------|----------|
| Executor pings | `pi -p --offline --model llmgateway/<id> --thinking <level> "Reply OK" </dev/null`, `cursor-agent -p "Reply OK" --model grok-4.7-xhigh-fast`, `devin -p --model swe-2-max "Reply OK"` | Each prints `OK`; read the text, since the exit code can be 0 on an auth failure |
| Lineage depth | Count iteration files and state records per lineage | 5 and 5, last record `maxIterationsReached` |
| Citations | Reopen five synthesis citations and three recommendations | Resolved, or drift recorded |
| Packet | `validate.sh --strict --recursive` and `check-goal.cjs` | `RESULT: PASSED` and 4/4 on every folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`pi`, `cursor-agent` and `devin` logged in; the fan-out runner's allowlists already carry all four model ids (`fanout-run.cjs`, `executor-config.ts`).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Everything is committed on the worktree branch in path-scoped commits. To undo, revert those commits. The first round-1 synthesis stays recoverable from commit `021437ceda`.
<!-- /ANCHOR:rollback -->

---
