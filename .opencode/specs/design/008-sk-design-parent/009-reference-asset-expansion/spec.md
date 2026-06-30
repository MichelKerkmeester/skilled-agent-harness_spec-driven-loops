---
title: "Feature Specification: sk-design sub-skill reference and asset expansion"
description: "Deep-research phase: find the highest-leverage expansions to each sk-design sub-skill's references and assets, grounded in the prior corpus research and the external corpus. Findings only; implementation is a gated follow-up."
trigger_phrases:
  - "design subskill reference expansion"
  - "design sub-skill asset expansion"
  - "sk-design references assets research"
  - "design mode reference gap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/009-reference-asset-expansion"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed the fan-out (16 iters), merged and synthesized research/research.md"
    next_safe_action: "Operator review of the matrix; then a gated implementation phase"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-009-reference-asset-expansion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design sub-skill reference and asset expansion

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../001-corpus-research/spec.md |
| **Successor** | Gated implementation follow-up (planned) |
| **Handoff Criteria** | `research/research.md` produced; both lineages hit their cap or converged; a per-mode reference/asset expansion matrix exists for operator review |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The corpus research already settled the taxonomy: the five `sk-design` modes (`design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`) exist. What is undecided is which `references/` and `assets/` each mode should gain. Four of the five modes ship zero assets, and several reference gaps are documented but unranked. Expanding by volume rather than by evidence would dilute the family.

### Purpose
Find the highest-leverage expansions to each sk-design sub-skill's `references/` and `assets/`, grounded in evidence rather than volume. For each mode this phase asks a narrower question: which references are thin or missing, which assets would add the most leverage, and what corpus source backs each addition. This is a research phase, so it produces findings only; writing the references and assets is a separate, gated follow-up.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A per-mode expansion matrix for the five sk-design modes, naming concrete reference and asset additions.
- Each addition tied to a source in the prior research or the external corpus, with type, leverage, and effort.
- An explicit "do not add" list per mode where expansion is not effective.

### Out of Scope
- Taxonomy and architecture (already decided by `001-corpus-research`).
- Net-new sub-skills.
- Any implementation of the references or assets themselves (the gated follow-up).

### Inputs (read-only)
- Prior corpus research: `../001-corpus-research/research/research.md` and `gap-analysis.md`.
- External corpus: `../external/` (43 entries).
- The live mode packets under `.opencode/skills/sk-design/` (current references and assets are the expansion target).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/deep-research-fanout-config.json` | Create | 2-lineage fan-out config (10 Opus + 10 GPT-5.5) |
| `research/research.md` | Create | Consolidated per-mode expansion matrix (loop-generated) |
| `research/` (state, lineages, findings) | Create | Deep-research loop artifacts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Two lineages (10 Opus, 10 GPT-5.5) each reach their iteration cap or converge | Each `research/lineages/<label>/deep-research-state.jsonl` records its iterations with a convergence or `maxIterationsReached` stop |
| REQ-002 | Consolidated synthesis produced | `research/research.md` exists with a per-mode matrix and cited sources |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each proposed addition is decision-ready | Each entry records its type (reference or asset), what it adds, the corpus source, and an effort estimate |
| REQ-004 | Leverage bar enforced | Each mode carries a "do not add" list so the follow-up respects the leverage bar |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` consolidates a per-mode expansion matrix with cited sources.
- **SC-002**: Each addition records type, what it adds, source, and effort; each mode has a "do not add" list; both lineages (10 Opus, 10 GPT-5.5) reached their cap or converged, confirmed in each `deep-research-state.jsonl`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Expansion drifts into bulk corpus import | Family dilutes; leverage bar lost | Require a corpus source + leverage rationale per entry; keep a per-mode "do not add" list |
| Risk | Fan-out ignores global `--max-iterations` | Split silently breaks | Set per-lineage `iterations`; verify caps/convergence post-run |
| Dependency | Prior corpus research + gap-analysis | Findings cannot be grounded | Read `../001-corpus-research/research/{research.md,gap-analysis.md}` as the spine |
| Dependency | Second Claude account `~/.claude-account2` | Opus lineage cannot run | Confirm authenticated before launch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Three-dials ownership (foundations vs interface/shared) — affects whether the intake reference lands in foundations or interface; decide at build time.
- md-generator authoring-boundary documentation is in-scope; the forward-authoring capability stays out of scope (routes to a net-new `design-spec` child).
- N1/N2 owning home (`shared/` vs interface-owned-with-audit-reference) — pick at build time.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
