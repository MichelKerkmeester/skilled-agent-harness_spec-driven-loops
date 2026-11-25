---
title: "Implementation Plan: Planning-depth review of the 003 build plan"
description: "One /deep:research fan-out of four lineages over thirteen 003 phase packets, then a line-by-line re-check of every finding, ending in fifteen expansion work orders."
trigger_phrases:
  - "plan depth research plan"
  - "planning depth review plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Planning-depth review of the 003 build plan

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research only. The plans and runtime read are TypeScript, JavaScript, Rust and Markdown |
| **Framework** | `/deep:research` workflow, `fanout-run.cjs` lineage pool |
| **Storage** | `research/` folder of this packet |
| **Testing** | Iteration-record counts, citation resolution and `validate.sh --strict` |

### Overview
The run reads the thirteen 003 phase packets other than the terminal screen, the built runtime, the 001 parity synthesis and the reference repos. It ran as four lineages across two configs: one Vibe `deepseek-flash` at 10 iterations and one opencode `opencode-go/deepseek-v4.1-flash` at 10 [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/fanout-config.json:1], then a Codex top-up of two `gpt-6-luna` lineages at 5 iterations each [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/fanout-config-codex-topup.json:1]. The proof is 20 iteration records [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/fanout-attribution.md:7-10], a synthesis that merges 102 findings from three lineages [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:3], and fifteen work orders [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:263].
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
- [x] `find research/lineages -maxdepth 3 -path '*/iterations/iteration-*.md' | wc -l` prints 20, and `validate.sh --strict` prints `RESULT: PASSED`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out depth review.

### Key Components
- **`/deep:research` workflow**: seeds the frontier, dispatches each iteration, merges the lineages and writes the synthesis.
- **The thirteen 003 phase packets**: read-only inputs, each with `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`.
- **The built runtime**: the evidence each plan is checked against, read-only.
- **The terminal screen's design contract**: the depth benchmark, read as the bar the other phases are measured against.

### Data Flow
The topic seeds six depth-1 questions. The pool deals them across the lineages, each lineage writes its own iteration records and synthesis, and the merge step folds them into `research/research.md` and `research/resource-map.md`. The synthesis then re-checks every finding against its cited line, regrades it, and groups the survivors into the fifteen work orders.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`find research/lineages -maxdepth 3 -path '*/iterations/iteration-*.md' | wc -l` prints 20, and every citation in `research/research.md` resolves to an existing file and an in-range line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`vibe` and `codex` on PATH, with daily usage left. The opencode executor's monthly quota ran out before its first iteration, and the Codex top-up absorbed the loss.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a broken or abandoned run. Move `research/` aside, or rerun with `--restart`, which archives the prior `research/` folder. Nothing outside this packet changes.
<!-- /ANCHOR:rollback -->

---

