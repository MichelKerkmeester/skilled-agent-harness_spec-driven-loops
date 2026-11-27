---
title: "Implementation Plan: Reference evidence research for the OpenBot parity build"
description: "One /deep:research fan-out in expansive depth mode: four DeepSeek Flash lineages of 10 iterations over ten reference repos and the fourteen 003 build phases, then a line-by-line re-check of every finding."
trigger_phrases:
  - "reference evidence research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Reference evidence research for the OpenBot parity build

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research only. The repos and plans read are TypeScript, JavaScript, Rust and Markdown |
| **Framework** | `/deep:research` workflow, `fanout-run.cjs` lineage pool |
| **Storage** | `research/` folder of this packet |
| **Testing** | Iteration-record counts, citation resolution and `validate.sh --strict` |

### Overview
The run reads the ten reference repos against the fourteen 003 phase folders and writes one evidence section per phase plus a ranked net-new list. It runs as four lineages of 10 iterations each: two on `cli-mistral-vibe` with `deepseek-flash` and two on `cli-pi` with `deepseek-v4.1-flash-1017` at max thinking. The stop policy is max iterations, so the total is 40.

### Invocation

The topic is the text of `scratch/research-topic.txt`. Run from the repository root, on `main`, in the primary checkout.

```text
/deep:research:auto "<text of scratch/research-topic.txt>" \
  --spec-folder=specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research \
  --depth-mode=expansive --stop-policy=max-iterations \
  --executor=cli-mistral-vibe --model=deepseek-flash --iters=10 --count=2 --label=vibe \
  --executor=cli-pi --model=deepseek-v4.1-flash-1017 --reasoning-effort=max --iters=10 --count=2 --label=pi \
  --concurrency=4
```

- Vibe takes no effort flag. Max thinking is a property of its `deepseek-flash` roster row.
- `--frontier-max-depth` and `--frontier-max-nodes` are refused on a fan-out, so the frontier keeps its defaults: depth 3 and six children per node.
- `cli-opencode` is left out. OpenCode Go reached its monthly limit on 2026-11-25.
- Export `PI_BLACKHOLE_PASSIVE=true` in the shell that starts the run. The fan-out passes that one variable to each Pi lineage, and it stops the pi-blackhole package from compacting a lineage in the middle of its reading.
- A Pi lineage runs with no sandbox and a Vibe lineage with auto-approve. The runner's write containment is the only guard: it reverts a change outside the lineage folder and fails that lineage.

### Seeds

At `step_frontier_seed` the workflow writes `research/frontier-seed.json`. Copy `scratch/frontier-seed.json` there unchanged. The pool deals the six nodes round-robin in node-id order, so the first two lineages work two seeds each and the last two work one each. Seeds 3 and 4 are the two largest for that reason.

| Node | Seed | Lineage |
|------|------|---------|
| F-1-001 | Human surface, phases 001 and 002 | first |
| F-1-002 | Trust, phases 006, 007 and 008 | second |
| F-1-003 | `openhuman-full`, its vendored crates and its terminal crate | third |
| F-1-004 | Phase 011 messaging channels | fourth |
| F-1-005 | Prompt and records, phases 004, 005, 009 and 010 | first |
| F-1-006 | Net-new and operations, phases 012 to 014 | second |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `find research/lineages -maxdepth 3 -path '*/iterations/iteration-*.md' | wc -l` prints 40, and `validate.sh --strict` prints `RESULT: PASSED`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out evidence research.

### Key Components
- **`/deep:research` workflow**: seeds the frontier, dispatches each iteration, merges the lineages and writes the synthesis.
- **The ten reference repos**: read-only inputs under `specs/system-skilled-bots/context/`.
- **The fourteen 003 phase folders and `contracts/`**: the plan each reference is read against, read-only.
- **The three earlier syntheses**: the record of what is already known, so a lineage reports only what is new.

### Data Flow
The topic and the six seeds open the frontier. The pool deals the seeds across four lineages, each lineage writes its own iteration records and may propose follow-up nodes down to depth 3, and the merge step folds the lineages into `research/research.md` and `research/resource-map.md`. The synthesis then re-checks every finding against its cited line and files it under its 003 phase or under net-new.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup prepares `scratch/research-topic.txt` and `scratch/frontier-seed.json`, probes both providers and dry-runs the fan-out. Implementation runs the four lineages into `research/` and writes `research/research.md`. Verification counts 40 iteration records under `research/lineages/` and validates the packet.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`find research/lineages -maxdepth 3 -path '*/iterations/iteration-*.md' | wc -l` prints 40, and every citation in `research/research.md` resolves to an existing file and an in-range line. Citations into `specs/system-skilled-bots/context/` are checked by opening the file, because the validator's `SOURCE_TAGS` rule cannot resolve a gitignored path and reports it as a warning.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`vibe` and `pi` on PATH, with usage left on both providers. The ten repos present under `specs/system-skilled-bots/context/`, which holds only in the primary checkout.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a broken or abandoned run. Rerun with `--restart`, which archives the prior `research/` folder. Nothing outside this packet changes.

A lineage that fails on quota is rerun, not restarted: `research/orchestration-summary.json` holds a `rerun_command` for it. Rerun it on the other provider when its own provider is out of usage. Steering through `research/inbox.jsonl` does not reach a running fan-out lineage, so a seed is corrected by a rerun and never by an inbox append.
<!-- /ANCHOR:rollback -->

---
