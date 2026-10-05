---
title: "Implementation Plan: Repo rule concision and loading"
description: "Measure the rule load and compliance baseline, then run four steered research lineages on concision, compliance, loading design and full-load affordability, and synthesize one verdict."
trigger_phrases:
  - "repo rule concision research plan"
  - "steered four lineage research"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Repo rule concision and loading

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts; Python measurement script; Node loop scripts |
| **Framework** | `/deep:research:auto` fan-out through `fanout-run.cjs` |
| **Storage** | `prep/` evidence; `research/` lineage state, iterations and `steer.md` files |
| **Testing** | Targeted strict `validate.sh`; orchestrator citation check |

### Overview
The orchestrator first measures what the rules cost and whether reading them changes behaviour, and writes that to `prep/evidence-pack.md`. Four lineages then each take one angle: loading design, concision, compliance, and a devil's-advocate pass on full-load affordability. Between iterations the orchestrator rewrites each lineage's `steer.md` to deepen strong leads, drop dead ends and pass findings across lineages.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement backed by measurement (`prep/evidence-pack.md`)
- [x] Executors probed with a trivial dispatch before launch
- [x] Lineage angles and briefs written

### Definition of Done
- [x] Every lineage completes its assigned iterations
- [x] Load-bearing citations checked against the working tree
- [x] Synthesis names disagreements instead of averaging them
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Steered fan-out research: one supervisor, four isolated lineages, a per-lineage `steer.md` the orchestrator updates between iterations, one merge.

### Key Components
- **`prep/measure-rule-compliance.py`**: aggregates rule-prohibition violations from local transcripts, split by whether the rule was read.
- **`fanout-run.cjs`**: runs each lineage with its own artifact directory and write containment; concurrency 3 with the devil's-advocate lineage queued last, so it starts once another lineage has findings.
- **`steer.md`**: read by each lineage before every iteration; carries its angle and the orchestrator's mid-run steering.

### Data Flow
Transcripts stay local and yield aggregates in `prep/`. Lineages read `prep/`, the repository and their `steer.md`, and write only under `research/lineages/<label>/`. The merge and the synthesis read those in place.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Targeted strict validation of the phase docs, plus a manual check that each load-bearing citation and measurement in the synthesis resolves.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Devin CLI with account OAuth for the Devin lineages, and Codex CLI for the two Luna lineages. The planned GLM-5.3-Flash route through llmgateway rejected every request, so a second Luna lineage replaced it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The phase folder is new and untracked: deleting it, and its row in the parent map, undoes it.
<!-- /ANCHOR:rollback -->

---
