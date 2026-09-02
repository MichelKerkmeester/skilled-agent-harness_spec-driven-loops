---
title: "Implementation Plan: Phase 5: ripgrep-retrieval-research"
description: "How the five-iteration research ran: a detached fan-out lineage on one pinned executor, forced to five iterations, with the leaf executing in process."
trigger_phrases:
  - "research run plan"
  - "fanout lineage"
  - "forced iterations"
  - "in-process leaf"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: ripgrep-retrieval-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts plus JSON and JSONL run state |
| **Framework** | `/deep:research` fan-out driver, one lineage labelled `luna-max` |
| **Storage** | `research/lineages/luna-max/` inside this phase folder |
| **Testing** | None. The gate is artifact inspection plus `validate.sh --strict` |

### Overview
One executor, `cli-codex` running `gpt-5.6-luna` at max reasoning on the fast service tier, ran five
forced iterations against the operator topic. The stop policy was `max-iterations`, so convergence
ratios were recorded as telemetry and never allowed to end the run early. Every artifact was written
into the detached lineage directory, which keeps a research run from touching the packet it studies.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Detached fan-out lineage. One executor, flat pool assignment, concurrency 1.

### Key Components
- **`research/deep-research-config.json`**: the run contract. Topic, `maxIterations: 5`, `stopPolicy: max-iterations`, the executor block and the note that pins in-process execution.
- **`research/lineages/luna-max/iterations/`**: one record per iteration, `iteration-001.md` through `iteration-005.md`.
- **`research/lineages/luna-max/deltas/` and `events/`**: structured evidence per iteration plus gateway receipts.
- **`research/lineages/luna-max/research.md`**: the synthesis, 305 lines, ending in the ranked amendment brief for phases 001 and 004.

### Data Flow
The driver seeded the topic, then each iteration read repository sources and ripgrep documentation,
then wrote its record and delta before emitting a receipt. After iteration five the reducer wrote the synthesis
from the five deltas. Phases 001 and 004 read that synthesis and nothing else from this folder.

### Run history
Run 1 failed. The leaf followed the YAML codex path literally and nested `codex exec` inside its own
codex sandbox, which exits with `failed to initialize in-process app-server client: Operation not
permitted`. That attempt is preserved under `scratch/failed-run-1-nested-codex-dispatch`. Run 2 pinned
in-process execution through an execution note in the topic itself and completed all five iterations.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A. This is a research run, so the proof is the artifact set named in `tasks.md` verification.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The parity baseline is the live trigger lane at
`.opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts`. Ripgrep flag semantics came
from the official guide and the flag definitions source, both cited in the synthesis references.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing outside this folder was changed, so rollback is deleting the lineage directory. The amendments
folded into phases 001 and 004 roll back with those phases, not with this one.
<!-- /ANCHOR:rollback -->

---
