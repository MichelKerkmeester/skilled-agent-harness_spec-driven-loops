---
title: "Feature Specification: interface + audit contrasting pilots (styles-library consumers)"
description: "Level-3 scaffold for wiring the first two sk-design modes — design-interface (relational-exemplar pilot) and design-audit (non-authoritative comparison lane) — to the styles library through the phase-007 shared context seam, as two contrasting pilots that stabilize the shared proof and handoff fields before the relationship-heavy modes."
trigger_phrases:
  - "interface audit pilots"
  - "design-interface styles pilot"
  - "design-audit comparison lane"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the interface/audit pilots scaffold (six L3 planning docs)"
    next_safe_action: "Wire the phase-007 seam into design-interface, then design-audit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-iface-audit-011-008"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "How much of the interface handoff schema can be reused verbatim by the audit lane?"
    answered_questions:
      - "Two contrasting pilots stabilize the shared proof/handoff fields before the relationship-heavy modes."
---

# Feature Specification: interface + audit contrasting pilots (styles-library consumers)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase implements Phase B of the global-modes utilization research (`../003-global-modes-utilization/research/lineages/sol/research.md` §15): the first two corpus consumers, deliberately chosen to contrast. `design-interface` is a relational-exemplar pilot that grounds creative direction; `design-audit` is a non-authoritative comparison lane that surfaces intended-anchor drift. Running them together stabilizes the shared proof and handoff fields introduced by the phase-007 shared context seam before the higher-complexity foundations and motion modes consume it.

**Key Decisions**: corpus is falsification infrastructure, never an authority (ADR-001); the interface handoff is decision-only and source-aware (ADR-002); the audit corpus never assigns severity, score, or WCAG/perf verdicts (ADR-003).

**Critical Dependencies**: phase 004 (retrieval substrate), phase 007 (shared context seam).

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete — implemented, reviewed, verified (36/36 tests) |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `../007-shared-context-seam/` |
| **Successor** | `../009-foundations-motion/` |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The phase-007 shared context seam defines a neutral `CORPUS_CONTEXT_PLAN` envelope with common generation, provenance, role, transformation, fallback, and proof fields, but no mode consumes it yet. Without real consumers, the shared proof and handoff fields are untested abstractions: their field shapes, fallback behaviours, and evidence labels have not met the friction of two genuinely different jobs. Wiring one mode alone would over-fit the seam to that mode's shape.

### Purpose
Wire the first two sk-design modes to the styles library via the phase-007 shared seam as contrasting pilots. `design-interface` exercises the seam for creative grounding (a relational exemplar plus a decision-only handoff); `design-audit` exercises it for critique (non-authoritative comparison references plus drift fixtures). The contrast forces the shared fields to be general, and the two pilots together improve anti-default creative direction while keeping the corpus strictly non-authoritative.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `design-interface` as a relational-exemplar pilot: retrieve 1 coherent anchor plus an optional bounded contrast / rejected-default, and produce a relational exemplar with a source-aware, decision-only handoff.
- `design-audit` as a comparison lane: 0–2 comparison references consumed as NON-AUTHORITATIVE context, intended-anchor drift fixtures, and evidence labels.
- Encoding three out-of-the-box uses of the corpus: falsification infrastructure, counterfactual critique, and a maintainer fixture atlas.
- Stabilizing the shared proof/handoff fields defined by phase 007 against both consumers.

### Out of Scope
- The shared context seam itself (owned by phase 007) and the retrieval substrate (owned by phase 004).
- `design-foundations` and `design-motion` integration (phase 009) and the Open Design transport (later phase).
- Any change to the brief/owned system, the target render, or the preflight — the interface pilot must not override these.
- Any severity/score assignment, WCAG/perf proof, copying determination, or fix ownership — the audit corpus must never do these.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-interface/**` | Modify (proposed) | Wire the phase-007 seam: anchor + bounded contrast retrieval, relational exemplar, decision-only handoff. |
| `.opencode/skills/sk-design/design-audit/**` | Modify (proposed) | Wire the comparison lane: non-authoritative refs, drift fixtures, evidence labels. |
| `design-interface/` fixtures (proposed) | Create (proposed) | Positive / no-fit / rejected-default fixtures for the interface pilot. |
| `design-audit/` fixtures (proposed) | Create (proposed) | Intended-anchor drift and comparison-unavailable fixtures for the audit lane. |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Interface consumes the seam without overriding authority | `design-interface` retrieves 1 anchor + optional bounded contrast via the phase-007 envelope and never overrides the brief/owned system, the target render, or the preflight. |
| REQ-002 | Interface emits a decision-only, source-aware handoff | The handoff carries decisions and their corpus sources only — not raw style bodies — and is traceable to the anchor/contrast used. |
| REQ-003 | Audit corpus is strictly non-authoritative | `design-audit` uses 0–2 comparison refs as context only; the corpus never assigns severity/score, proves WCAG/perf, establishes copying, or owns fixes. |
| REQ-004 | Shared proof/handoff fields are exercised by both | The phase-007 proof and handoff fields are populated by both pilots, with contrasting shapes proving the fields are general, not mode-specific. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Falsification infrastructure encoded | Counterexample fixtures demonstrate that an unsafe integration fails closed (e.g. no-fit / rejected-default surfaces rather than a forced anchor). |
| REQ-006 | Counterfactual critique recorded | The interface pilot records the no-corpus default that changed after grounding. |
| REQ-007 | Maintainer fixture atlas, not a user gallery | Fixtures are a maintainer-facing atlas; no user-facing style gallery is produced. |
| REQ-008 | Audit drift fixtures present | Intended-anchor drift fixtures and evidence labels exist and require target evidence for any verdict. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `design-interface` produces a relational exemplar plus a decision-only handoff, grounded in a retrieved anchor, without touching brief/target/preflight.
- **SC-002**: `design-audit` produces labelled, non-authoritative comparison context and drift fixtures, with no severity/score/WCAG/perf/copying claim from the corpus.
- **SC-003**: The shared phase-007 proof/handoff fields are populated by both modes with contrasting content and remain unchanged in shape.
- **SC-004**: Counterexample and counterfactual fixtures demonstrate fail-closed behaviour and recorded no-corpus defaults.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004 retrieval substrate | Cannot retrieve anchors/comparison refs | Land phase 004 first; pilots consume it read-only. |
| Dependency | Phase 007 shared context seam | No envelope/proof/handoff fields to consume | Land phase 007 first; pilots are its first two consumers. |
| Risk | Seam over-fits the interface shape | High | The audit lane runs in parallel as a contrasting consumer to force general fields. |
| Risk | Corpus creep into authority | High | ADR-001/003 fix the corpus as non-authoritative; fixtures assert fail-closed behaviour. |
| Risk | Interface handoff leaks raw style bodies | Medium | Handoff is decision-only and source-aware by contract (REQ-002). |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: Every corpus-derived claim in either pilot carries a provenance source and a role label from the phase-007 envelope.
- **NFR-C02**: Negative results (`no-fit`, `anchor:null`, `comparison-unavailable`) are first-class outputs, not errors.

### Safety
- **NFR-S01**: The audit corpus path cannot emit a severity, score, WCAG, performance, copying, or fix-ownership verdict.
- **NFR-S02**: The interface path cannot mutate the brief/owned system, target render, or preflight.

### Maintainability
- **NFR-M01**: Fixtures form a maintainer-facing atlas with stable, named cases; no user-facing style gallery is generated.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Interface
- **No coherent anchor**: emit `anchor:null` and fall back to un-grounded direction; do not force a low-fit anchor.
- **Contrast unavailable**: proceed with the single anchor; the bounded contrast / rejected-default is optional.
- **Rejected-default surfaced**: record the rejected default as counterfactual evidence, not as the chosen direction.

### Audit
- **0 comparison refs**: emit `comparison-unavailable`; the audit proceeds on target evidence alone.
- **Intended-anchor drift**: fixture flags drift as context; the verdict still requires target evidence.
- **Corpus contradicts target evidence**: target evidence wins; the corpus note is downgraded to context.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 2 mode dirs + fixtures, Systems: styles corpus + phase-007 seam |
| Risk | 20/25 | Auth: N, API: N, Breaking: N, but corpus-authority safety is high-stakes |
| Research | 10/20 | Design settled by 003 research; execution details remain |
| Multi-Agent | 6/15 | Two contrasting pilots, coordinated via a shared contract-binding phase |
| Coordination | 10/15 | Hard dependencies on phases 004 + 007; feeds phase 009 |
| **Total** | **64/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Corpus assigns authority it should not | H | M | ADR-001/003; fail-closed fixtures assert non-authority |
| R-002 | Seam over-fit to interface | H | M | Contrasting audit consumer lands in parallel |
| R-003 | Handoff leaks raw style content | M | L | Decision-only, source-aware handoff contract |
| R-004 | Fixtures drift into a user style gallery | M | L | Maintainer-atlas constraint (NFR-M01) |
| R-005 | Pilots start before 004/007 land | H | L | Dependency gate; pilots are downstream consumers |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Anti-default creative direction (Priority: P0)

**As a** design-interface maintainer, **I want** a coherent anchor plus an optional bounded contrast from the corpus, **so that** the mode produces anti-default creative direction with a traceable relational exemplar.

**Acceptance Criteria**:
1. Given a brief, when the interface pilot runs, then it retrieves 1 anchor (and optionally 1 contrast / rejected-default) and never overrides the brief/target/preflight.
2. Given a grounded run, when it completes, then it emits a decision-only, source-aware handoff plus the recorded no-corpus default that changed.

### US-002: Non-authoritative comparison context (Priority: P0)

**As a** design-audit maintainer, **I want** 0–2 comparison references labelled as non-authoritative, **so that** the audit surfaces intended-anchor drift without the corpus ever claiming a verdict.

**Acceptance Criteria**:
1. Given an audit target, when the lane runs, then any comparison ref is labelled context and the corpus assigns no severity/score/WCAG/perf/copying claim.
2. Given drift between intended and observed anchor, when detected, then a drift fixture flags it as context requiring target evidence for any verdict.

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- How much of the interface decision-only handoff schema can the audit lane reuse verbatim before the phase-007 fields need per-mode extension?
- Should the counterfactual "no-corpus default" record live in the shared proof envelope or in a mode-local fixture?
- What is the minimum fixture atlas that proves fail-closed behaviour without becoming a style gallery?

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent**: ../spec.md
- **Predecessor**: `../007-shared-context-seam/`
- **Successor**: `../009-foundations-motion/`
- **Source research**: `../003-global-modes-utilization/research/lineages/sol/research.md` (§11 ranked strategies, §15 Phase A-D sequence)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

<!-- /ANCHOR:related-docs -->
