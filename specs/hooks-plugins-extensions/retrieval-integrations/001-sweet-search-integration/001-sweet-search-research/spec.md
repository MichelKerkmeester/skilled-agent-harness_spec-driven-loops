---
title: "Feature Specification: Phase 1: sweet-search research"
description: "Ten-iteration deep research on sweet-search: how useful it is for agents, and the smallest integration into Skilled or its skills that improves UX in this repo and in external repos."
trigger_phrases:
  - "sweet search research"
  - "phase 1 sweet search research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: sweet-search research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | ../002-retrieval-lessons-research/spec.md |
| **Handoff Criteria** | `research/research.md` states a verdict (adopt, adopt narrowly, or skip) and one recommended integration surface with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sweet-search integration packet.

**Scope Boundary**: Research only. Reads the vendored source under `../context/sweet-search-main/` and the Skilled repo; writes only under `research/` in this folder.

**Dependencies**:
- The cli-codex executor with model `gpt-6-luna`, `xhigh` reasoning, `fast` service tier.

**Deliverables**:
- `research/research.md` synthesis and the per-iteration files under `research/iterations/`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sweet-search claims cheaper and faster agent runs through a local code index, but its value for Skilled's own workflows is unmeasured. Adopting it would add an install and indexing step for every repo Skilled is installed into, so a wrong call costs external users directly.

### Purpose
Produce an evidence-backed verdict on sweet-search's usefulness and name the smallest integration that helps users, putting UX and external-repo UX first and rejecting over-engineered options.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
N/A: research phase. No Skilled behavior changes here; findings cite sweet-search source lines and Skilled files.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Assess what sweet-search does, its install footprint, platform limits and the evidence behind its benchmark claims.
- Map candidate integration surfaces in Skilled: a skill, MCP or Code Mode registration, doctor install step, existing retrieval, or none.
- Judge each candidate on UX in this repo, UX in external repos, and over-engineering risk.

### Out of Scope
- Building any integration - later phases do that once the verdict is in.
- Editing the vendored sweet-search source - it is reference material.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Deep-research state, iterations and `research.md` synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Research states a usefulness verdict backed by cited evidence | `research/research.md` contains a verdict section whose claims carry `[SOURCE: path:line]` tags |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Research recommends one integration surface and names the rejected ones with reasons | `research/research.md` names one recommended surface and lists rejected options, each with an over-engineering or UX reason |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deep-research loop completes up to 10 iterations and writes `research/research.md`.
- **SC-002**: The recommendation covers external-repo setup cost: install steps, platform support and indexing time.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex with GPT Luna | Loop cannot dispatch if quota or auth fails | Stop and report; never re-route GPT models to another provider |
| Risk | Benchmark claims in the README taken at face value | Med | Require findings to trace claims to eval code or data, and mark unverified ones as inferred |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How much better is sweet-search than grep plus the existing trigger index for Skilled's own tasks?
- What does it cost an external repo to install and keep the index fresh?
- research sweet-search: how useful is it, and how could it integrate into the skilled repo, a relevant skilled skill, or elsewhere, prioritizing ux, external-repo ux and avoiding over-engineering

### Research Context

Deep research ran 10 iterations on this topic: iterations 1–6 on cli-codex (gpt-6-luna, xhigh, fast) and 7–10 on cli-devin (deepseek-v4-1-flash-max, in parallel). `research/research.md` is the canonical output.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- **Verdict:** no integration now. Phase 2 records the decision with a falsifiable growth gate and changes no `.skilled/` file.
- **Usefulness:** the 5–33% cost saving holds on sweet-search's own benchmark, with an unchanged solve count. Independent evidence supports a cost or latency gain, not an accuracy gain, and only in large, lexically noisy code trees. Its value for Skilled's markdown, skill and spec trees is unmeasured and likely small.
- **The one surface the gate unlocks:** a conditional clause in step 5 of `sk-code/shared/references/workflow-implement.md`. A Code Mode manual, an mcp-tooling mode, a doctor step and a spec-kit hook are all rejected.
- **Hazard:** in link-instruction mode, `sweet-search init --agents` can write into the shared checkout's `AGENTS.md` (inferred, not reproduced).
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
