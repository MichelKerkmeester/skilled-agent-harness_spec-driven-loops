---
title: "Feature Specification: Deep research — improve the sk-code code-quality sub-skill and shared assets/references"
description: "Ten-iteration deep-research investigation into how to make the sk-code code-quality sub-skill materially more useful and better integrated into the repo's own systems (spec-kit, skill-advisor, deep-loops, benchmarks, hooks) and into general software-quality practice, and how to strengthen the sk-code shared assets/references it depends on — producing a ranked, evidence-grounded set of upgrade proposals for a later implementation packet."
trigger_phrases:
  - "sk-code code-quality research"
  - "improve code-quality subskill"
  - "sk-code shared assets references research"
importance_tier: "high"
contextType: "research"
parent: "skilled-agent-orchestration"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/025-code-quality-and-shared-research"
    last_updated_at: "2026-07-07T00:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Research packet scaffolded; deep-research loop launched (ten iterations, GPT-5.5 xhigh)"
    next_safe_action: "Run 10 productive iterations, converge, synthesize ranked recommendations, memory save"
---
# Feature Specification: Deep research — improve the sk-code code-quality sub-skill and shared assets/references

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code `code-quality` sub-skill carries one of the highest-leverage jobs in the coding lifecycle — judging whether code is correct, clean, and safe — yet it has grown independently and its real usefulness is unproven. It is unclear where its `SKILL.md` guidance, `references/`, and `assets/` genuinely help versus add friction, and how well it plugs into the repo's own systems (system-spec-kit validation and completion gates, system-skill-advisor routing, deep-loop review/research loops, skill/router benchmarks, hooks/plugins). The `shared/` assets and references that `code-quality` (and its sibling sub-skills) depend on are likewise under-examined. There is no evidence-grounded map of how to make either materially more useful, better integrated, or better aligned with general software-quality standards.

### Purpose
Run a bounded deep-research investigation (ten productive iterations, GPT-5.5 xhigh fast via cli-opencode) that studies the `code-quality` sub-skill and the `sk-code/shared` assets/references in depth, grounded in the current `.opencode` codebase and general coding practices/standards. Assess real usefulness, coverage gaps, integration seams, and friction, and produce a ranked, evidence-grounded set of concrete upgrade proposals — both for `code-quality` itself and for the shared assets/references it leans on. This packet delivers the RESEARCH and synthesis only; implementing the accepted proposals is a separate follow-up packet.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Study `.opencode/skills/sk-code/code-quality/` in depth — its `SKILL.md`, `references/`, `assets/`, and any scripts/tests.
- Study `.opencode/skills/sk-code/shared/` — the shared `references/` (e.g. `smart_routing.md`) and `assets/` that `code-quality` and sibling sub-skills consume.
- Assess two axes: (a) **usefulness** — coverage gaps, redundancy, friction in guidance/verification ladders/output contracts, and alignment with general software-quality standards; and (b) **integration** — how well `code-quality` and the shared assets plug into system-spec-kit (validation, completion, spec-folder discipline), system-skill-advisor (routing/vocab/metadata), deep-loop-workflows (review/research), the skill/router benchmarks, and hooks/plugins.
- Ground every claim in the current codebase: the sk-code hub router contract (`mode-registry.json`, `hub-router.json`, `shared/references/smart_routing.md`), the manual-testing playbook, sibling-hub patterns, and how the skill actually routes/loads/verifies.
- Explore multiple angles across iterations (code-quality deep-dive, shared-asset deep-dive, the integration seams one system at a time, comparison to general code-review/quality standards and to sibling hubs).
- Produce a ranked, evidence-grounded synthesis of upgrade proposals with rationale and expected leverage, sequenced for a later implementation packet.

### Out of Scope
- Implementing any of the proposals (a separate follow-up packet owns implementation).
- The other sk-code sub-skills except as integration context — the `code-implement`, `code-debug`, `code-verify` workflow skills and the `code-webflow`/`code-opencode`/`code-review` surfaces are not the target (23-... already surveyed the four workflow sub-skills broadly; this packet is the deeper code-quality + shared dive).
- Re-baselining the sk-code Lane-C benchmark or rewriting the manual-testing-playbook gold.
- Editing `code-quality`, `shared/`, or any other skill asset during this research phase.

### Files to Change During Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../025-code-quality-and-shared-research/research/**` | Create | Deep-research state packet, iteration markdown, and synthesized `research.md` |
| `.../025-code-quality-and-shared-research/{plan,tasks,checklist,implementation-summary}.md` | Create | Level-2 packet docs + close-out |
| `.../025-code-quality-and-shared-research/{description,graph-metadata}.json` | Create | Memory-visibility metadata |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements
- **REQ-01** — Run ten productive deep-research iterations via the `/deep:research` loop (externalized JSONL state, fresh context per iteration), executor cli-opencode GPT-5.5 xhigh fast, until convergence or the iteration cap.
- **REQ-02** — Cover both targets: the `code-quality` sub-skill AND the `sk-code/shared` assets/references, plus the integration seams into spec-kit, skill-advisor, deep-loops, benchmarks, and hooks/plugins.
- **REQ-03** — Ground every finding in a cited source (`file:line` or URL) from the current codebase or an authoritative standard; no unsourced assertions.
- **REQ-04** — Produce a ranked synthesis of upgrade proposals (per-target and cross-cutting) with rationale, expected leverage, and a suggested implementation sequence.
- **REQ-05** — Distinguish "more useful in general" proposals from "better integrated into the repo's systems" proposals, so the follow-up implementation packet can prioritize.

### Non-Functional
- Findings-only: no edits to the skills under study during research.
- Reproducible: state externalized to the packet's `research/` folder; resumable via `/deep:research`.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Research loop ran to convergence or the ten-iteration cap; all state files present and consistent.
- `research/research.md` produced with evidence-grounded findings from all iterations and a ranked proposal synthesis.
- Both targets (`code-quality` + `shared`) and the integration seams are each covered by at least one iteration's focus.
- Every load-bearing claim carries a source citation.
- A clear, sequenced hand-off list of upgrade proposals exists for the follow-up implementation packet.
- Continuity saved via `generate-context.js`; packet validates `--strict` at close-out.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Breadth vs depth** — two targets plus several integration seams risk shallow coverage; mitigate by assigning one focus per iteration and letting convergence, not breadth, decide the stop.
- **Stale grounding** — the codebase is actively changing on the shared branch; cite `file:line` at read time and treat findings as of the read.
- **Executor availability** — depends on the `openai` provider and `openai/gpt-5.5-fast` (verified configured at launch).
- **Scope drift into implementation** — research only; any concrete edit is deferred to the follow-up packet.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Traceability** — each proposal traces to specific evidence (files, router contracts, benchmark rows, or standards).
- **Autonomy** — the loop runs unattended; decisions are best-judgment per the deep-research contract, no interactive prompts.
- **Determinism of state** — JSONL append-only, reducer-owned strategy/registry/dashboard; no ad-hoc state.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Early convergence** — if newInfoRatio collapses before ten iterations, stop and synthesize; do not pad.
- **Integration seam already strong** — record "no change warranted, here is why" rather than inventing work.
- **Overlap with 023** — where 023 already surfaced a code-quality finding, deepen or supersede it with new evidence rather than restating.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Research-only packet: no production code changes, no runtime risk. Complexity is in synthesis breadth (two targets + integration seams) and in grounding proposals rigorously. Level 2 is appropriate — a checklist governs the loop and close-out; a decision-record is not warranted unless the synthesis forks into a contested architectural choice.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Which integration seam offers the highest leverage — spec-kit completion gates, skill-advisor routing/vocab, or deep-loop review reuse? (To be answered by the research.)
- Is `code-quality` best strengthened as a standalone judgment skill or as a thinner front-end over shared/reused review machinery? (To be answered by the research.)

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- Sibling research packet: `../023-sk-code-workflow-subskill-research/` (broad survey of the four workflow sub-skills, including code-quality).
- Parent hub: `../` (`124-sk-code-parent`).
- Deep-research contract: `.opencode/commands/deep/research.md` + `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md`.

<!-- /ANCHOR:related-docs -->
