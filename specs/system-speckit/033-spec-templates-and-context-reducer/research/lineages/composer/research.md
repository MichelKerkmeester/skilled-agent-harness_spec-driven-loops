---
title: "Research Synthesis: Spec Templates & Context Reducer (composer lineage)"
description: "Two-iteration deep-research synthesis testing Reducer Engineering and Agent Engineering harness concepts against system-speckit templates, doc-logic, and memory — ranked shortlist plus refutations."
trigger_phrases:
  - "spec templates context reducer synthesis"
  - "composer lineage research"
importance_tier: important
contextType: research
version: 1.0.0
---

# Research Synthesis: Spec Templates & Context Reducer

**Lineage:** `fanout-composer-1786515199922-z0hium`  
**Executor:** `cli-cursor` / `composer-2.5`  
**Iterations:** 2 / 2 (`stopPolicy: max-iterations`)  
**Report-only:** no implementation performed in this lineage.

---

## Executive Summary

The two external concepts largely **describe machinery already shipped** in this repository, often at greater maturity than the blog posts imply.

- **Reducer Engineering** (deterministic validate → dedup → contradiction surface before synthesis) maps to `renderInlineGates` on the **templates** surface and to `reduce-state.cjs` + `contradiction-supersession` on the **deep-loop** surface. Reinventing a speckit-side synthesis reducer would duplicate findings-registry ownership.
- **Agent Engineering harness** (Default-FAIL, fresh evaluator, handoff, complexity-matches-task) maps to **Iron Law + `validate.sh`**, **deep-review LEAF**, and **handover / `_memory.continuity`**. A separate `progress.md` harness is not warranted as a first move.
- **Remaining genuine gaps** are narrow: ungated optional templates (`research.md.tmpl` chiefly), prompt-only discipline against raw `.tmpl` reads, and (low priority) claim-normalization across memory hits.

The naïve framing that agents must read all **5,541 LOC** of `templates/manifest/*.tmpl` is **refuted**: fleet Level-1 render is ~**2,162 lines / ~14.6k est. tokens**, with core docs collapsing 80–85% via IF gates.

---

## Convergence Report

| Field | Value |
|-------|-------|
| Stop reason | `max_iterations` |
| Iterations completed | 2 |
| Average newInfoRatio | 0.825 (0.90, 0.75) |
| Convergence threshold | 0.05 (telemetry only — did not trigger early stop) |
| Questions answered | 5 / 5 |

---

## Ranked Implementable Shortlist

Priority reflects impact × feasibility within existing architecture. All items are **report-only recommendations** for a future `/speckit:plan` packet.

### P1 — Add level-specific IF gates to `research.md.tmpl` (and optionally `handover.md.tmpl`, `resource-map.md.tmpl`)

| Field | Value |
|-------|-------|
| **Classification** | `genuine-gap` |
| **Axis** | (a) context/token reduction |
| **Surface** | templates |
| **Evidence** | Opening gate `<!-- IF level:1,2,3,3+,phase -->` at `research.md.tmpl:1` renders ~945 lines at every numeric level; fleet L1 still ~14.6k tokens partly because this file is ungated |
| **Why** | Level 1 packets rarely need a 21k-char research scaffold; this is the largest single-template token leak after core doc gating |
| **How (sketch)** | Split `research.md.tmpl` into level-specific sections (mirror `spec.md.tmpl` pattern); validate via existing `inline-gate-renderer` tests |
| **Blast radius** | Low — template-only; `create.sh` / renderer path unchanged |

### P2 — Authoring guard: rendered-template-only consumption for agents

| Field | Value |
|-------|-------|
| **Classification** | `genuine-gap` |
| **Axis** | (a) context reduction + (b) plan adherence |
| **Surface** | templates + doc-logic |
| **Evidence** | `SKILL.md:452` mandates scaffold via `create.sh` / `inline-gate-renderer`; `SKILL.md:475` forbids scratch docs — but no tool blocks `Read` on raw `.tmpl` |
| **Why** | Accidental raw read of e.g. `spec.md.tmpl` (~875 lines all levels) reintroduces the pre-reducer token wall |
| **How (sketch)** | Add sk-doc authoring checklist item + optional CLI `inline-gate-renderer.sh --level N --stdout` as the documented agent read path |
| **Blast radius** | Very low — documentation + optional helper |

### P3 — Advisory complexity-matches-task routing hint (optional)

| Field | Value |
|-------|-------|
| **Classification** | `genuine-gap` (low priority) |
| **Axis** | (c) general optimization |
| **Surface** | doc-logic |
| **Evidence** | Charter documents Agentless vs agent tradeoff at `spec.md:62-66`; no automated selector |
| **Why** | Prevents over-dispatching deep-loop / multi-agent harness for Level-1 typo fixes |
| **How (sketch)** | Skill-advisor or Gate 2 note when LOC/risk below Level-1 threshold |
| **Blast radius** | Low — advisory only |

### P4 — Claim-fingerprint dedup on `memory_context` fused results (only if traces justify)

| Field | Value |
|-------|-------|
| **Classification** | `genuine-gap` (conditional) |
| **Axis** | (a) context/token reduction |
| **Surface** | context-memory |
| **Evidence** | `memory-context.ts:551+` enforces token budget; `memory-search.ts:2115+` session dedup only — no `normalize(claim)` grouping across heterogeneous hits |
| **Why** | Reducer Engineering's win came from deduping parallel worker claims; memory fusion could exhibit similar near-duplicate chunks |
| **How (sketch)** | Deterministic fingerprint pass on result text before `enforceTokenBudget`; must **not** duplicate deep-loop findings-registry |
| **Blast radius** | Medium — requires production duplicate-rate measurement first |
| **Precondition** | Instrumentation showing >10% redundant claim text in fused `memory_context` responses |

---

## Already Exists (Do Not Reimplement)

| Pattern | Shipped equivalent | Evidence |
|---------|-------------------|----------|
| Model-free synthesis reducer | `reduce-state.cjs` + findings-registry + contradiction-supersession | `reduce-state.cjs:2902-2910`; `contradiction-supersession/index.ts:1-40` |
| Template level reducer | `renderInlineGates` / `inline-gate-renderer` | `orchestrator.js:309-339`; `inline-gate-renderer.ts:182-239` |
| Default-FAIL completion | Iron Law + `validate.sh --strict` + checklist | `AGENTS.md:11,23`; `SKILL.md:462` |
| Fresh-context evaluator | deep-review LEAF iterations | `deep-review/SKILL.md:3,288,298` |
| Session handoff / external memory | handover.md + `_memory.continuity` ladder | `feature-catalog.md:325` |
| Gate on file writes | Gate 3 `classifyPrompt()` | `gate-3-classifier.ts:1-11,106-120` |
| Level-aware doc validation | `validate.sh detect_level` | `validate.sh:403-457` |
| Memory token budget | `enforceTokenBudget` + mode budgets + pressure policy | `memory-context.ts:551+,1107-1144`; `feature-catalog.md:77,201` |
| Session result dedup | `applySessionDedup` in memory_search | `memory-search.ts:2115-2139` |
| Goal-scoped Default-FAIL prompts | mk-goal plugin injection | `goal-opencode-plugin.md:76` |

---

## Refutation List

| Claim / impulse | Verdict | Evidence |
|-----------------|---------|----------|
| "Agents read all 5,541 template LOC" | **Refuted** | Fleet L1 render ~2,162 lines; core `spec`/`plan` collapse 80–85% via IF gates |
| "Add a speckit synthesis reducer like the Twitter post" | **Refuted** | deep-loop already owns reducer + contradiction machinery; would cargo-cult duplicate |
| "memory_context has no token budget" | **Refuted** | `enforceTokenBudget` at `memory-context.ts:551+` with per-mode caps |
| "Need progress.md like Anthropic harness" | **Refuted** | handover + continuity ladder is canonical recovery surface |
| "Need a new fresh-context evaluator service" | **Refuted** | deep-review provides LEAF dimensional audit with externalized state |
| "Split every template into 4 physical files" | **Not applicable as first move** | IF gating already provides level slices; physical split only helps raw-read accidents (P2) |
| "Delete multi-level template bodies to save tokens" | **Refuted** | Would break single-source maintainer templates; gates already strip inactive levels |
| "Implement Reducer Engineering normalize() for deep-research iterations" | **Refuted** | Iteration markdown + JSONL + reducer refresh is the owned contract (`deep-research/SKILL.md:327-346`) |

---

## Axis Coverage Matrix

| Axis | Primary findings | Genuine gaps | Already exists |
|------|------------------|--------------|----------------|
| **(a) context/token reduction** | IF gating works; `research.md.tmpl` ungated | P1, P2, P4 (conditional) | renderInlineGates, enforceTokenBudget, session dedup, pressure policy |
| **(b) plan adherence** | Iron Law, Gate 3, validate.sh, goal plugin | P2 (raw read guard) | completion verification, deep-review LEAF, handover ladder |
| **(c) general optimization** | Don't duplicate deep-loop | P3 (advisory routing) | contradiction-supersession, skill-advisor, doc levels |

---

## Iteration Audit Trail

| Iteration | Focus | newInfoRatio | Key output |
|-----------|-------|--------------|------------|
| 1 | Template fleet weight + Reducer prior art | 0.90 | `iterations/iteration-001.md` |
| 2 | Harness vs doc-logic + memory | 0.75 | `iterations/iteration-002.md` |

---

## References

- Context inputs: `context/Reducer Engineering.md`, `context/The $1.2M Agent Engineering skill.md`
- Charter: `specs/system-speckit/033-spec-templates-and-context-reducer/spec.md`
- Templates: `.opencode/skills/system-spec-kit/templates/manifest/*.tmpl`
- Render: `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts`
- Validation: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- Gate 3: `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts`
- Memory: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts`, `memory-search.ts`
- Deep loop: `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`, `runtime/lib/contradiction-supersession/`

---

## Recommended Next Step

Run `/speckit:plan` scoped to **P1 only** (ungated optional templates) unless operator prioritizes P2 doc guard. Defer P4 until memory fusion duplicate metrics exist. Do **not** open an implementation packet for a new synthesis reducer.
