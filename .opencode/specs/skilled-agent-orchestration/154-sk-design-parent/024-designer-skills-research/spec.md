---
title: "Feature Specification: designer-skills-main corpus → sk-design improvement research"
description: "Level-3 deep-research phase: a single GPT-5.5-xhigh (cli-codex) deep-research lineage runs up to 20 iterations studying the external designer-skills-main corpus (9 plugins, ~96 design skills) and deriving a corpus-traced, target-traced adoption backlog for sk-design and its five modes plus the shared register, with a clear in-scope/out-of-scope split. Research deliverables only; no live sk-design changes."
trigger_phrases:
  - "designer-skills-main sk-design research"
  - "designer skills corpus sk-design"
  - "sk-design adoption research designer-skills"
  - "external design suite sk-design scope"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/024-designer-skills-research"
    last_updated_at: "2026-06-27T10:19:33Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran 17 iterations incl a 4-model completeness sweep; backlog confirmed + rank 11 added"
    next_safe_action: "A future build phase adopts backlog ranks 1-5 into existing sk-design modes"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-024-designer-skills-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Most of the 9-plugin suite is out of scope (research/strategy/ops/governance); the adoptable core is small and build-facing, landing in audit/interface/motion/foundations"
      - "No new sk-design mode is justified; visual-critique is a set of audit lenses, not a distinct intent/output/owner"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: designer-skills-main corpus → sk-design improvement research

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase runs a single GPT-5.5-xhigh deep-research lineage (cli-codex executor, up to 20 iterations) over the external `designer-skills-main` corpus — a 9-plugin marketplace of ~96 design skills spanning the whole design lifecycle — to extract genuinely adoptable craft for `sk-design` and its five modes plus the shared register. Because the corpus is far broader than sk-design's taste-led build/visual scope, the central deliverable is a clear in-scope versus out-of-scope split alongside a prioritized, corpus-traced and target-traced adoption backlog.

**Key Decisions**: Treat the corpus as read-only input (ADR-pending); hold sk-design's deliberate build/visual scope as the adoption filter so design-ops, research-ops, and ux-strategy lifecycle capabilities are recorded as out-of-scope rather than absorbed (ADR-pending).

**Critical Dependencies**: The 9 plugin corpora, the live `sk-design` hub and five mode packets, and the sibling `022`/`023` precedent for the research-then-adopt pattern.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-27 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../022-mifb-design-research/spec.md |
| **Successor** | None yet (a future build phase may act on the backlog) |
| **Handoff Criteria** | The deep-research lineage ran to convergence or the 20-iteration cap, `research/research.md` records the per-plugin capability map, the in-scope/out-of-scope split, and a prioritized adoption backlog with each item traced to a corpus skill and an sk-design target; no live sk-design content was changed by this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-design` is a taste-led build/visual skill with five modes. `designer-skills-main` is a 9-plugin suite (~96 skills) covering the entire design lifecycle — ops, research, systems, prototyping, interaction, UI, strategy, and critique. Some of it overlaps sk-design's build/visual craft and may contain genuinely net-new technique; much of it is lifecycle work sk-design deliberately does not own. Without a structured study, the family cannot tell which capabilities are worth adopting, where each belongs, and where adoption would be scope creep that bloats a focused skill.

### Purpose
Run a GPT-5.5-xhigh deep-research lineage (cli-codex, up to 20 iterations) that maps the 9 plugins against the live sk-design surface, draws the in-scope/out-of-scope line, and produces a prioritized, corpus-traced and target-traced adoption backlog. This is a research phase: it changes no live sk-design content; every named improvement routes to a future build phase.

> **Phase note:** `research/research.md` is the canonical deliverable. The external corpus is read-only input, preserved as written and referenced by path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reading the marketplace and per-plugin READMEs and a representative, prioritized sample of the ~96 skills across the 9 plugins.
- A per-plugin capability map and an in-scope/out-of-scope classification against sk-design's five modes plus the shared register.
- A prioritized adoption backlog, each item traced to a corpus skill and an sk-design target (path + anchor where possible), with leverage and effort noted, plus any justified new-mode proposal.
- The synthesis recorded in `research/research.md` and a continuity update.

### Out of Scope
- Any edit to the live sk-design hub, the five mode packets, their references, assets, routers, registry, or the md-generator backend. This phase produces research only.
- Building any named improvement. Each routes to a future build phase.
- Recommending sk-design absorb the full design lifecycle; out-of-scope capabilities are recorded as such.
- Rewriting or relocating the external corpus.

### Inputs (read-only)
- The `designer-skills-main` corpus under `../external/designer-skills-main/`.
- The live `sk-design` skill and its five mode packets plus shared register.
- The sibling `022`/`023` research-and-adoption precedent.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Created | This Level-3 research specification |
| `research/research.md` | Created | The canonical synthesis: capability map, scope split, prioritized backlog |
| `research/deep-research-*.{json,jsonl,md}` | Created | Deep-research state, strategy, registry, dashboard, and iteration artifacts |
| `implementation-summary.md` | Created at synthesis | Wrapper summarizing the synthesis and the next build phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The lineage runs and produces canonical findings | `research/research.md` exists and records the per-plugin capability map and the in-scope/out-of-scope split; the state log shows the iterations and a stop reason |
| REQ-002 | Every adoption candidate is corpus-traced and target-traced | Each backlog item names the source corpus skill and the sk-design target file (and anchor where possible) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The scope line is explicit | `research/research.md` separates genuinely adoptable build/visual craft from out-of-scope lifecycle capabilities, with rationale |
| REQ-004 | A prioritized backlog with leverage and effort is produced | The backlog ranks items and notes leverage and rough effort, plus any justified new-mode proposal |
| REQ-005 | The external corpus is preserved unchanged | The corpus files are referenced by path only and not edited or relocated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A GPT-5.5-xhigh cli-codex deep-research lineage ran up to 20 iterations (or converged earlier) over the corpus and the live sk-design surface, with `research/research.md` preserved as the canonical deliverable and a recorded stop reason.
- **SC-002**: `research/research.md` records a prioritized adoption backlog with an explicit in-scope/out-of-scope split, each adoptable item traced to a corpus skill and an sk-design target, changing no live sk-design content in this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The breadth pushes sk-design toward absorbing the whole lifecycle | Scope creep bloats a focused skill | Hold the build/visual scope filter; record lifecycle capabilities as out-of-scope |
| Risk | Shallow coverage of ~96 skills | The backlog misses real craft or over-generalizes | Prioritize the most-aligned plugins for deep reads; sample the rest by README + representative skills |
| Risk | Recommendations are vague | The backlog cannot be built later | Require corpus-skill and target-file traces per item |
| Dependency | The 9 plugin corpora | The research has no input | Confirm the corpus is present and read the READMEs in iteration 1 |
| Dependency | The live sk-design surface | The map has no baseline | Read the hub, registry, five mode SKILL.md files, and shared register |
| Dependency | GPT-5.5-xhigh cli-codex executor | The lineage cannot run | Validated executor from the 022 run; same invocation, read-mostly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: This is a research phase; it adds zero runtime cost to any sk-design mode router until a build phase acts on it.
- **NFR-P02**: Any recommended addition, when built, must respect each target mode's existing per-task resource budget.

### Security
- **NFR-S01**: Any recommended file or asset addition must preserve the packet-local path-guard posture of its target mode.

### Reliability
- **NFR-R01**: `research/research.md` is the source of truth for the synthesis; the external corpus stays byte-unchanged so findings remain traceable.

---

## 8. EDGE CASES

### Data Boundaries
- **A plugin entirely outside scope** (e.g. design-ops, design-research): recorded as out-of-scope with a one-line rationale, not mined for backlog items.
- **A capability sk-design already covers better**: recorded as already-covered with the existing sk-design location cited.

### Error Scenarios
- **An executor timeout or dispatch failure**: the workflow records a typed failure event and the loop continues; three consecutive failures halt the loop into synthesis with partial findings.
- **Early convergence**: a stop before the 20-iteration cap is a valid stop reason, and the deliverable is still authoritative.

### State Transitions
- **Research to build**: every adoptable item routes forward to a build phase; the live family state is unchanged until then.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | One lineage across 9 plugins / ~96 skills mapped onto five modes plus shared, no code change |
| Risk | 12/25 | Research only, reversible; the risk is scope creep or shallow coverage, not breaking the family |
| Research | 19/20 | Very heavy external-corpus study with an in-scope/out-of-scope adjudication and prioritization |
| Multi-Agent | 7/15 | Single deep-research lineage, up to 20 iterations, with an orchestrator |
| Coordination | 10/15 | Cross-plugin reconciliation and scope adjudication against five modes |
| **Total** | **68/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | sk-design pushed to absorb the whole lifecycle | H | M | Hold the build/visual scope filter; record out-of-scope explicitly |
| R-002 | Shallow coverage of ~96 skills | M | M | Prioritize aligned plugins for deep reads; sample the rest |
| R-003 | Vague recommendations | M | M | Require corpus-skill and target-file traces per item |
| R-004 | The backlog never reaches a build phase | M | M | Route each item forward explicitly to a future build phase |

---

## 11. USER STORIES

### US-001: Know what is worth adopting from a broad suite (Priority: P0)

**As a** sk-design family maintainer, **I want** a per-plugin capability map with an in-scope/out-of-scope split, **so that** I adopt genuinely net-new build/visual craft and skip lifecycle work the skill should not own.

**Acceptance Criteria**:
1. Given the corpus and the live surface, When the synthesis is read, Then each plugin is classified in-scope or out-of-scope with rationale.

### US-002: Land each adoptable item in the right place (Priority: P0)

**As a** maintainer planning the build phase, **I want** each adoptable item mapped to the correct sk-design mode (or a justified new mode) with a minimal edit, **so that** the work is surgical rather than a broad rewrite.

**Acceptance Criteria**:
1. Given the backlog, When I plan a change, Then each item names a target file and a minimal edit.

### US-003: Protect scope while adopting (Priority: P1)

**As a** maintainer, **I want** out-of-scope and conflicting capabilities ruled out explicitly, **so that** adoption does not bloat sk-design or drift its taste.

**Acceptance Criteria**:
1. Given the corpus, When a capability is lifecycle work or conflicts with sk-design taste, Then it is recorded under out-of-scope or ruled-out directions with a rationale.

---

## 12. OPEN QUESTIONS

**Synthesis (converged, 13 iterations — 9 sequential + 4 parallel; see `research/research.md`).** The corpus is a full design-practice suite; most of it (research, strategy, validation programs, design-ops, governance, adoption, comms) is **out of scope** for sk-design's taste-led build/visual modes. The adoptable core is small and lands entirely in the existing five modes — no new mode is justified.

- **Highest-leverage adoption:** `visual-critique` → `audit` as a 7-dimension *crosswalk* onto audit's existing P0–P3 severity (not a second score).
- **Top build slice (ranks 1–5):** visual-critique crosswalk; compact interface UX flow floor (forms/search/nav/feedback/error/empty); audit release-hardening bundle (component completeness, localization stress, a11y modality coverage); state-machine fragment for branching UI → motion; foundations layout (grid contract, density-mode spacing, containment restraint). Full 10-item backlog in `research/research.md` §6.
- **No new mode:** the strongest candidate (visual-critique) is a set of audit lenses; interaction-design and design-systems split cleanly into motion/interface/audit/foundations. `md-generator` receives nothing.
- **Ruled out:** command-suite import, parallel scoring, duplicate color/responsive/cognitive-law/token imports, evidence-free impact claims, and all governance/documentation/lifecycle systems.

- A README-level exclusion is sufficient for `design-research` and `ux-strategy`; their declared skills are upstream artifacts, not build-facing guidance.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Canonical deliverable**: `research/research.md`
- **External corpus**: `../external/designer-skills-main/` (9 plugins, ~96 skills)
- **Sibling research/adoption**: `../022-mifb-design-research/` and `../023-mifb-design-adoption/`
- **Target skill**: `.opencode/skills/sk-design/` (hub + five mode packets + shared register)

<!--
LEVEL 3 ADDENDUM
- research/research.md is the primary evidence, workflow-owned and canonical
- The external corpus is read-only input, preserved and referenced by path
-->
