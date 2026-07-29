---
title: "Feature Specification: Skill & Advisor JSON Optimization Research"
description: "Three-model, 15-iteration deep-research investigation (SOL-high / GLM-5.2-high / Grok-4.5-high, 5 iters each, all lineages concurrent, no early convergence) into whether every skill- and skill-advisor-related JSON across .opencode/skills is optimized, automated, effective, tested, and integrated — and where the highest-leverage gaps are."
trigger_phrases:
  - "skill json optimization research"
  - "advisor json automation research"
  - "are the skill metadata jsons optimized"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research"
    last_updated_at: "2026-07-29T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Ran the 3-lineage fan-out 5/5 each and synthesized the ranked opportunity map"
    next_safe_action: "Operator decides whether to schedule the Tier-1 follow-up (O1 derived owner first)"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "029-skill-json-optimization-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The highest-leverage gap cluster is the derived block (no regenerator, no freshness gate, TS-vs-Python schema conflict) — 3/3 lineage agreement"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Skill & Advisor JSON Optimization Research

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The skill-metadata program (packets 021–028) unified the root-level JSON contract behind an H/S class model, built fleet gates, and hardened the enforcement surface. What it never did was step back and ask, across the whole fleet at once: are these JSONs — per-skill root metadata AND the skill-advisor's own routing data — as optimized, automated, effective, tested, and integrated as they can be? Fields may exist that no consumer reads; files may still need hand-authoring that a scaffolder could emit; the advisor may under-use the data it ingests; test and CI coverage may be uneven across JSON types. This packet runs an independent, multi-model deep-research investigation to map the real state and surface the highest-leverage gaps — findings only, no implementation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — every skill- and advisor-related JSON across `.opencode/skills/` and its lifecycle: per-skill root metadata (`graph-metadata.json`, `description.json`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `leaf-manifest.config.json`, `leaf-aliases.json`, `command-metadata.json`); advisor-side data (skill-graph DB/index inputs, intent signals, `compiled-route-manifest`, watcher-ingested identity); and the generation/validation pipeline (`init_skill.py`, `generate-leaf-manifest.cjs`, `generate-description.js`, `backfill-graph-metadata.js`, `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `compiled-route-manifest.cjs`). Investigated along five dimensions: inventory/current-state, optimization, automation gaps, effectiveness (does the data drive routing well), and testing/integration.

Out of scope — implementing any fix (research produces findings and a ranked opportunity map only, per the deep-research no-implementation rule); redesigning the advisor scoring algorithm; changing the H/S class contract fundamentally.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Three independent model lineages run to depth | SOL-high, GLM-5.2-high, Grok-4.5-high each complete 5 iterations, all three concurrent |
| REQ-002 | No early convergence | `stop-policy=max-iterations` forces all 5 iterations per lineage regardless of convergence signal |
| REQ-003 | Every in-scope JSON surface is covered | Findings reference each JSON type and the pipeline scripts, not a subset |
| REQ-004 | Findings are evidence-cited | Every finding cites `file:line` or a command/output, never an unsourced claim |
| REQ-005 | Cross-lineage synthesis with a ranked opportunity map | A consolidated report ranks gaps by leverage (optimization / automation / effectiveness / testing / integration) |
| REQ-006 | No implementation during research | Research reports only; any fix is a separate operator-gated follow-up packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

All three lineages complete 5/5 iterations concurrently with per-lineage `research.md` produced; a cross-lineage synthesis ranks the highest-leverage optimization/automation/effectiveness/testing/integration gaps with `file:line` evidence; the five research dimensions are each addressed; per-lineage evidence is preserved under `research/lineages/`; no code or contract is modified by this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Three paid external CLIs running concurrently for hours | Fixed 5-iteration cap per lineage; 1h per-iteration ceiling; operator approved the spend |
| Risk | A lineage's CLI fails to start (missing runtime deps in the checkout) | The fan-out driver needs `runtime/node_modules`; verified/symlinked before launch (the 027 lesson) |
| Risk | Model-id drift (GLM free tier, Grok tier) | IDs verified against `executor-config.ts` allowlists: `glm-5-2` = GLM-5.2 High (free), `cursor-grok-4.5-high`, `openai/gpt-5.6-sol` |
| Risk | Running on the diverged local branch | Research writes only under this packet's `research/` tree; pre-existing dirty files from other sessions are never touched |
| Dependency | The deep-research fan-out runtime (`fanout-run.cjs`) | Same driver that ran the 027 two-lineage review |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered by the run: the highest-leverage gap cluster is the `derived` block (no regenerator, no freshness gate, TS-vs-Python schema conflict), agreed by all three lineages. Remaining open decisions are for the operator: which `derived` producer is authoritative, and whether to schedule the Tier-1 follow-up program. See `research/research.md` §6.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Program predecessors**: packets 021–028 under `../`
- **Contract under study**: `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `028-p2-hardening` |
| **Successor** | none |
