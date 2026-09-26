---
title: "Implementation Plan: Research Phase for Jev Typed Judgments Across .skilled"
description: "Opus medium leaves gather context and write 30 label-keyed angles, the Grok 4.7 id joins the cli-cursor allowlist, then one deep-research command fans out three 10-iteration lineages and a fresh Opus max leaf writes the ranked synthesis."
trigger_phrases:
  - "jev research plan"
  - "three lineage fan-out plan"
  - "jev research angles"
  - "grok 4.7 allowlist plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Research Phase for Jev Typed Judgments Across .skilled

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts; TypeScript and CommonJS for the cli-cursor allowlist |
| **Framework** | `/deep:research` auto workflow with the shared fan-out runner |
| **Storage** | JSONL state logs and markdown iteration files under `research/` |
| **Testing** | Lineage state counts, vitest for the allowlist, citation reopening, `validate.sh --strict` and `check-goal.cjs` |

### Overview

Four Opus 5.5 medium leaves write context digests, and a fifth writes the research angles, a draft topic and the synthesis brief. The prompt-improver tightens the topic. The Grok 4.7 id joins the cli-cursor allowlist in parallel. One deep-research command then runs three lineages at once, each for exactly 10 iterations. A fresh Opus 5.5 max leaf writes the ranked synthesis, and Opus 5.5 high leaves author the build phases it proposes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fan-out deep research: three lineages on three model families, each with its own lens, reading each other's finished iterations from wave 2 on, merged after all three finish.

### Key Components

- **Context leaves**: four Opus 5.5 medium workers, one digest each: `repo-rules-digest.md`, `seam-map.md`, `jev-material-digest.md`, `measurement-digest.md`. They write to `context/`, not `research/`, because a restart archives `research/`.
- **Angles leaf**: one Opus 5.5 medium worker writes `context/research-angles.md`, a draft topic and `scratch/synthesis-brief.md`.
- **`fanout-run.cjs`**: spawns the lineages in a pool of three, enforces the model allowlists and checks write containment when each lineage ends.
- **`deepseek` lineage**: cli-pi, `llmgateway/deepseek-v4.1-flash` at `--thinking max`. Lens: the integration engineer (seams, hook contracts, opt-in gating, degrade paths, size).
- **`mimo` lineage**: cli-pi, `llmgateway/mimo-v2.6-pro` at `--thinking high`, its top tier. Lens: UX and measurement (operator friction, defaults, metrics, baselines, shadow and A/B designs).
- **`grok` lineage**: cli-cursor, `grok-4.7-xhigh-fast`. Lens: contrarian and outside patterns (the vendored integrations, bold ideas, the case against each, kill criteria).
- **Synthesis leaf**: a fresh Opus 5.5 max worker runs the compile step from `scratch/synthesis-brief.md` and writes `research/research.md`.

### Data Flow

Each lineage prompt carries its artifact directory, `research/lineages/<label>/`. The shared topic tells a lineage that its label is the last segment of that directory and that iteration N takes angle `<label>-N` from `context/research-angles.md`. Iteration k builds on the open threads of iteration k-1. After all three lineages end, the merge step folds their state together and the synthesis leaf writes the ranked list.

### Invocation

```text
/deep:research:auto "<topic from scratch/research-topic.txt>"
  --spec-folder=specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research
  --max-iterations=10 --stop-policy=max-iterations --convergence-mode=off --concurrency=3
  --executor=cli-pi --model=deepseek-v4.1-flash --reasoning-effort=max --iters=10 --label=deepseek
  --executor=cli-pi --model=mimo-v2.6-pro --reasoning-effort=high --iters=10 --label=mimo
  --executor=cli-cursor --model=grok-4.7-xhigh-fast --iters=10 --label=grok
```

Convergence is off and the stop policy is `max-iterations` because the operator asked for 30 iterations with no early stop. The runner rejects a lineage that lacks iterations 1 to 10 or a `maxIterationsReached` stop.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Before the run:** a `Reply OK` ping per executor, and a preview of each lineage's prompt through the runner's exported `buildLoopPrompt`, to confirm each label resolves its angle.
- **The allowlist change:** `executor-config.vitest.ts` and `fanout-run.vitest.ts` pass, the typecheck is clean and `compiled-route-guard.cjs` reports every hub fresh.
- **After the run:** each lineage state log holds 10 iteration records ending `maxIterationsReached`. The synthesis reopens every citation in its ranked list, and the orchestrator reopens five citations and three recommendations against the code.
- **Close:** `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED`, and `check-goal.cjs` passes on the parent and every child.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`pi` 0.87.1 and `cursor-agent` 2026.09.26 are on PATH. `.pi/models.json` declares both gateway models. `cursor-agent --list-models` lists `grok-4.7-xhigh-fast` and no Grok 4.7 MAX tier.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The research writes only untracked files under `context/`, `scratch/` and `research/` in this phase folder, so deleting them undoes it. The allowlist change is one commit on the worktree branch, undone with `git revert`. The scaffolded build phases are new folders under the parent, removed with their binding and phase-map rows.
<!-- /ANCHOR:rollback -->

---
