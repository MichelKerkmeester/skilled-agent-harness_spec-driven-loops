---
title: "Implementation Plan: Research Phase for Pi Skill Orchestrator Against System Skill Advisor"
description: "Runs /deep:research in auto mode as a two-executor fan-out. One lineage runs MiMo v2.6 Pro high through cli-pi on LLM Gateway for 10 iterations, the other runs SWE-2 MAX through cli-devin for 5, both forced to their cap, and the workflow merges them into one synthesis."
trigger_phrases:
  - "pi skill orchestrator research plan"
  - "two executor fan-out research"
  - "mimo swe-2 max fan-out"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Research Phase for Pi Skill Orchestrator Against System Skill Advisor

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on both sides: the orchestrator is a Pi extension and the advisor runtime is a Node daemon |
| **Framework** | `/deep:research` auto workflow with the shared fan-out runner |
| **Storage** | JSONL state logs and markdown iteration files under `research/` |
| **Testing** | Lineage state counts, a citation check by the orchestrator and `validate.sh --strict` |

### Overview
The phase runs the deep-research command in auto mode with two `--executor` groups, which switches the workflow onto its fan-out path. Each executor runs a full research loop as its own lineage and writes only inside `research/lineages/<label>/`. The workflow then merges both lineages into `research/research.md`.
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
Fan-out deep research: independent lineages on two model families, merged after both finish.

### Key Components
- **`fanout-run.cjs`**: Spawns both lineages in a capped pool, enforces the model allowlists and checks write containment after each lineage ends.
- **`mimo` lineage**: `pi -p --offline --model llmgateway/mimo-v2.6-pro --thinking high`, 10 iterations.
- **`swe2max` lineage**: `devin -p --model swe-2-max`, 5 iterations.
- **`fanout-merge.cjs` and `reduce-state.cjs`**: Merge lineage state and findings, then feed the synthesis step that writes `research.md`.

### Data Flow
The command writes `research/deep-research-config.json` with a `fanout` block. The runner reads it and starts both lineages at once, because the pool allows two. Each lineage reads the brief in `spec.md` and the two codebases, then writes its iterations, deltas and lineage synthesis. After both end, the merge step folds their state together and the synthesis step writes the ranked list.

### Invocation

```text
/deep:research:auto "<topic>" --spec-folder=specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/001-deep-research
  --executor=cli-pi --model=mimo-v2.6-pro --reasoning-effort=high --iters=10 --label=mimo
  --executor=cli-devin --model=swe-2-max --iters=5 --label=swe2max
  --stop-policy=max-iterations --concurrency=2
```

The stop policy is `max-iterations` because the operator fixed the iteration counts. Convergence is still recorded, as telemetry.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three checks decide whether the run counts. The lineage state logs must hold 10 and 5 iteration records. Every citation in the ranked list must open to the claimed code. `validate.sh --strict` on this phase must print `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Both executors were checked before launch on 2026-09-26. `devin auth status` reported `Logged in (via Devin)`. A `pi -p --offline --model llmgateway/mimo-v2.6-pro --thinking high` ping replied `OK`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The run creates only untracked files under `research/`. To undo it, delete `research/` in this phase folder.
<!-- /ANCHOR:rollback -->

---
