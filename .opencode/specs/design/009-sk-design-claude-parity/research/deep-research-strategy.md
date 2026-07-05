---
title: Deep Research Strategy - sk-design Claude Parity
description: Runtime strategy for researching how to refactor sk-design toward a Claude Design clone/backend feel while preserving unique OpenCode features.
trigger_phrases:
  - "sk-design Claude parity"
  - "Claude Design clone feel"
  - "deep research strategy"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - sk-design Claude Parity

Runtime strategy for the manual bootstrap of a deep research session. It tracks the initial question set, boundaries, context pointers, and first iteration focus for researching a Claude Design-inspired sk-design refactor without changing skill files during research.

## 1. OVERVIEW

### Purpose

Define the persistent research frame for evaluating how sk-design can feel like Claude Design at the behavioral, structural, and authoring-contract layers while remaining an OpenCode-native parent skill with its current unique capabilities intact.

### Usage

- **Init:** This file seeds the research loop from the approved manual bootstrap state.
- **Per iteration:** Iteration agents read the key questions, known context, non-goals, and next focus before writing their own iteration artifacts.
- **Mutability:** Analyst-owned framing stays stable; reducer-owned sections may be refreshed from the registry after iterations run.
- **Protection:** Research-only artifact. Do not edit `.opencode/skills/sk-design/**` from this research session.

### Question Injection Surface

Use this strategy plus `research/deep-research-findings-registry.json` as the initial question source. Future external questions should enter through the workflow-owned inbox mechanism if the deep research runner enables it.

---

## 2. TOPIC

Refactor sk-design toward a Claude Design clone/backend feel while preserving unique OpenCode features.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] **Q1 - Claude Design essence:** What behavioral and structural essence from the external Claude Design materials should be cloned, including prompt voice, tool choreography, skill activation, design taste rubric, and backend/session-state feel?
- [ ] **Q2 - External skill taxonomy mapping:** How should the 14 external procedural skills map into sk-design's current five modes, and where would a refactored mode model be clearer than a one-to-one clone?
- [ ] **Q3 - OpenCode feature preservation:** Which existing sk-design assets and features must be preserved unchanged in concept, including `design-md-generator`, the mode registry, shared reference base, benchmark/playbook surfaces, and one graph-metadata identity?
- [ ] **Q4 - Parent hub contract:** What should the new parent hub contract look like so operators experience a Claude Design-like backend while the implementation remains OpenCode-native, advisor-routable, and compatible with current mode packets?
- [ ] **Q5 - Verification and benchmark proof:** What benchmark scenarios, manual playbook checks, and qualitative criteria prove that the refactor feels like Claude Design without deleting unique OpenCode affordances?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not implement the sk-design refactor during this research packet bootstrap.
- Do not delete or flatten unique OpenCode features to force a superficial clone.
- Do not mirror all external files blindly; research must identify the essence, not copy every artifact.
- Do not change `.opencode/skills/sk-design/**` or other skill files during research.
- Do not write into `.opencode/specs/design/009-sk-design-claude-parity/external/**`; treat external source material as read-only evidence.

---

## 5. STOP CONDITIONS

- Stop after 10 iterations unless every key question is answered earlier with sufficient evidence.
- Stop early if the research produces a coherent parent-hub contract, mapping model, preservation list, and verification plan with no material open questions.
- Pause rather than guess if external Claude/Codex evidence conflicts with current sk-design architecture or if a proposed mapping would erase an OpenCode-native capability.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

None yet. This bootstrap records initial state only; iteration agents will answer questions in `research/iterations/` artifacts and the reducer registry.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

No iterations have run yet.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

No iterations have run yet.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

No approaches are exhausted at bootstrap.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

No directions are ruled out at bootstrap beyond the explicit non-goals.
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Q1 through Q5 remain open for the first iteration.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Inventory the external Claude and Codex prompts plus procedural skill taxonomy, then compare that evidence against current sk-design architecture: the parent `SKILL.md`, `mode-registry.json`, `hub-router.json`, current mode folders, shared references, design-md-generator, benchmark/playbook surfaces, and graph-metadata identity.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: `external/README.md`, `external/claude/system-prompt.md`, `external/codex/system-prompt.md`, and `external/*/skills/*.md`.
- Current sk-design parent pointers: `.opencode/skills/sk-design/SKILL.md`, `.opencode/skills/sk-design/mode-registry.json`, `.opencode/skills/sk-design/hub-router.json`, and `.opencode/skills/sk-design/graph-metadata.json`.
- Current mode folders: `.opencode/skills/sk-design/design-interface/`, `.opencode/skills/sk-design/design-foundations/`, `.opencode/skills/sk-design/design-motion/`, `.opencode/skills/sk-design/design-audit/`, and `.opencode/skills/sk-design/design-md-generator/`.
- Preservation candidates: design-md-generator extraction pipeline, mode registry routing, shared reference base, benchmark/playbook evidence, and one graph-metadata identity for the parent skill.
- Benchmark baseline: existing sk-design benchmark/playbook baseline evidence should be inventoried before proposing new verification scenarios.
- Constraints and risks: code graph freshness is stale in session context; external material is read-only; skill files are out of write scope; research should separate clone feel from literal file mirroring.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- `research/research.md` ownership: workflow-owned canonical synthesis output, not created by this bootstrap
- Lifecycle branches: `resume`, `restart` available; `fork`, `completed-continue` deferred
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A after iterations begin
- Question conflict owner: reducer registry; conflicts should surface for operator decision rather than being silently merged
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/deep-loop-workflows/deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skills/deep-loop-workflows/deep-research/references/guides/capability_matrix.md`
- Capability resolver: `.opencode/skills/deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-07-05T10:29:24Z
