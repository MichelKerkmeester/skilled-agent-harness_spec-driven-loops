---
title: "Feature Specification: preventing sk-design sub-skill context under-loading"
description: "Level-1 deep-research phase: a single GPT-5.5 (reasoning xhigh, cli-codex) deep-research lineage investigates how to reliably prevent an AI agent — including dispatched sub-agents and small models — from missing or under-loading the relevant sk-design sub-skill context (register/dials, foundations contrast, audit contract, interface pre-flight) when doing design/UI build work. Research deliverable only; no live skill changes."
trigger_phrases:
  - "sk-design context under-loading research"
  - "design context loading guardrails"
  - "prevent AI missing design sub-skill context"
  - "design context manifest research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/029-design-context-loading"
    last_updated_at: "2026-06-27T14:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran 6-iter GPT-5.5-xhigh deep-research; converged 10/10"
    next_safe_action: "Open build phase to implement research §15-16 contract"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-029-design-context-loading"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The reliable fix is an enforceable context-loading contract (register-first, bundle-load for build work, a context manifest, a filled pre-flight/evidence card, model-specific scaffolds, gated adoption) — not 'remind agents to read more'"
      - "The four observed misses map cleanly to missing proof fields: no register proof, no foreground/background contrast-pair inventory, no pre-flight card, and no small-model prompt profile"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: preventing sk-design sub-skill context under-loading

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase ran a single GPT-5.5 (reasoning xhigh, cli-codex) deep-research lineage to answer one question: how do we reliably stop an AI agent — the main session, a dispatched sub-agent, or a small model like MiniMax-M3 — from missing or under-loading the relevant `sk-design` sub-skill context when it does design/UI build work? It is grounded in four real misses observed this session: a skipped register, a late foundations contrast check that surfaced a WCAG-AA P1 only at audit, an ad-hoc audit instead of the interface pre-flight card, and the thinnest context handed to a small model. The canonical deliverable is `research/research.md`. This phase changes no live skill content.

**Key Decisions**: Treat the investigation as mechanism design only (no canonical `sk-design`/`cli-opencode`/`sk-prompt-models` edits); route every named fix to a future build phase.

**Critical Dependencies**: the live `sk-design` hub + five mode packets + shared register, the `cli-opencode` and `sk-prompt-models` dispatch contracts, and the deep-loop-runtime fan-out + promotion-gate precedent.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (research phase) |
| **Created** | 2026-06-27 |
| **Parent Spec** | ../spec.md |
| **Type** | Deep research (no live code change) |
| **Handoff Criteria** | The lineage ran to convergence or the 10-iteration cap; `research/research.md` records the diagnosis, mode-routing recommendation, the required proof fields, the hard-gate table, the sub-agent + MiniMax-M3 dispatch contracts, and an adopt-if-better path; no live skill content changed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-design` is a routed hub of five modes over a shared reference base; the strongest design context (the Brand-vs-Product register and its six dials, the foundations token + contrast discipline, the audit contract, and the interface pre-flight card) lives in always-load and conditional resources the modes own. In this session that context was repeatedly under-loaded by the orchestrator and by dispatched agents/small models: the register was skipped, contrast was checked late (a WCAG-AA P1), audit was done ad-hoc instead of via the pre-flight card, and a small model got the thinnest context. The output only held the bar because of manual backstops, which is not a repeatable guarantee.

### Purpose
Run a GPT-5.5-xhigh deep-research lineage that diagnoses why the misses happen and designs the smallest enforceable mechanism that prevents them across the orchestrator, dispatched sub-agents, and small models. This is a research phase: it changes no live skill content; every named fix routes to a future build phase.

> **Phase note:** `research/research.md` is the canonical deliverable, workflow-owned and preserved.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A diagnosis tying each observed miss to a missing proof field.
- A mode-routing recommendation (when build work auto-pairs interface + foundations + audit + register + pre-flight vs single-mode).
- Required proof fields (register/dials, contrast pairs, interface pre-flight, audit evidence).
- A sub-agent prompt contract and a MiniMax-M3-specific dispatch contract that carry the context manifest.
- A hard-gate table and a layered verification + adopt-if-better path.
- The synthesis recorded in `research/research.md` plus this lean spec-folder wrapper.

### Out of Scope
- Any edit to live `sk-design`, `cli-opencode`, `sk-prompt-models`, or deep-loop-runtime files. Research only.
- Building any recommended contract, card, gate, or template (each routes to a future build phase).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | Lean spec-folder wrapper |
| `research/research.md` | Created | Canonical synthesis |
| `research/deep-research-*.{json,jsonl,md}`, `research/lineages/**`, `research/iterations/**` | Created | Deep-research state + lineage artifacts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The lineage runs and produces canonical findings | `research/research.md` exists; the state log shows the iterations and a stop reason |
| REQ-002 | Each observed miss maps to a concrete mechanism | The synthesis ties skipped-register, late-contrast, ad-hoc-audit, and thin-small-model to specific proof fields and gates |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Recommendations are evidence-grounded | Findings cite `file:line` sources in the live skills |
| REQ-004 | A small-model dispatch contract is specified | The synthesis gives a MiniMax-M3 TIDD-EC scaffold carrying the context manifest |
| REQ-005 | No live skill content changed | Only this phase folder is written |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A GPT-5.5-xhigh cli-codex deep-research lineage ran up to 10 iterations (or converged earlier) with `research/research.md` preserved as the canonical deliverable and a recorded stop reason.
- **SC-002**: `research/research.md` delivers an enforceable context-loading contract — proof fields, hard gates, dispatch contracts, and an adopt-if-better path — grounded in cited sources, changing no live skill content in this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Single executor (one gpt-5.5 lineage), no cross-model triangulation | Findings reflect one strong synthesis only | Strong `file:line` grounding; a future panel can re-run if needed |
| Risk | Recommendations bloat the hub if over-built | Scope creep on a focused skill | Implement as a compact manifest + router note, not prose expansion (research §15) |
| Dependency | Live `sk-design` hub + five modes + shared register | No baseline to map against | Read live during the loop |
| Dependency | GPT-5.5-xhigh cli-codex executor | Lineage cannot run | Validated via smoke test; `gpt-5.5` substituted for unavailable `-fast`/`-codex` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

**Converged (6 iterations, 10/10 answered — see `research/research.md`).** The reliable fix is an enforceable context-loading contract, not "read more." Two implementation details remain for the build phase:

- Whether the bundle rule lives only in `sk-design` docs or also in an executable advisor/router check.
- Whether contrast-pair checking is an authored worksheet only or backed by a small deterministic script.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Canonical deliverable**: `research/research.md`
- **Sibling research precedent**: `../024-designer-skills-research/`, `../022-mifb-design-research/`
- **Target skills**: `.opencode/skills/sk-design/`, `.opencode/skills/cli-opencode/`, `.opencode/skills/sk-prompt-models/`
