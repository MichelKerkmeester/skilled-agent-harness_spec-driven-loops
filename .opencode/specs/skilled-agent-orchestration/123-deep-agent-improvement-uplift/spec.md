---
title: "Feature Specification: 123 — Deep-Agent-Improvement Uplift from Recent Deep-Review + Deep-Research Updates"
description: "Phased 10-iter deep-research investigation: which findings, teachings, and patterns from arcs 117-122 (deep-review FULL_ISOLATE_NO_MCP + deep-research uplift) should propagate to the deep-agent-improvement skill?"
trigger_phrases:
  - "deep-agent-improvement uplift"
  - "123 deep-research"
  - "agent improvement from review research learnings"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/123-deep-agent-improvement-uplift"
    last_updated_at: "2026-05-23T10:00:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Wrote iter-10 verdict and packet roadmap."
    next_safe_action: "Start packet 124 correctness fixes."
    blockers: []
    completion_pct: 100
    key_files:
      - "001-research-recent-updates/research/iterations/iteration-010.md"
      - "001-research-recent-updates/research/deltas/iter-010.jsonl"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: 123 — Deep-Agent-Improvement Uplift

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Recent arcs 117 → 122 shipped substantial upgrades to deep-review + deep-research: FULL_ISOLATE_NO_MCP runtime relocation, sk-doc canonical companions, mixed-executor (cli-devin + cli-codex) 10-iter pattern, adjudication-iter false-positive filtering, uncovered-questions convergence transparency, content-hash dedup. The `deep-agent-improvement` skill (evaluator-first 5-dim agent scoring with guarded promotion) shares structural patterns with these two siblings but hasn't received a corresponding uplift. **This packet runs a 10-iter deep-research investigation identifying which learnings should propagate.** Mixed-executor pattern proven in 119: cli-devin SWE-1.6 (iters 1-8) + cli-codex gpt-5.5 high fast (iters 9-10 synthesis).
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 (phased program) |
| **Priority** | P2 |
| **Status** | Active; iter-1 next |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Predecessors** | 117 (council), 118 (FULL_ISOLATE_NO_MCP), 119 (deep-research uplift), 120/121/122 (deep-research follow-on packets) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-agent-improvement skill ("Evaluator-first bounded agent improvement: 5-dim scoring, dynamic profiling, packet-local candidates, guarded promotion") was last touched before arc 117. Since then, deep-review + deep-research have received:
- Runtime relocation (118): MCP→script shim pattern; shared `deep-loop-runtime` consumption
- sk-doc canonical companions (118): feature_catalog + manual_testing_playbook + references + graph-metadata; sk-doc DQI ≥80 standard
- Mixed-executor 10-iter pattern (119): devin breadth + codex synthesis
- Adjudication iter (119/iter-7): false-positive filter pattern (filtered 9 of 11 P1 candidates)
- Convergence transparency (121/DR-003): uncovered-questions surfaced for operator debug
- Lexical sort fix pattern (120/DR-006): numeric extractor for unpadded iter filenames
- Content-hash dedup (122/DR-005): ruledOut row dedup
- YAML script-path verification (122/C-008): light-touch CI grep
- Folder naming compliance (5fe6cc4c1e): 25-40 char NNN-short-name

**Question**: which of these apply to deep-agent-improvement? Where are deep-agent-improvement-specific gaps the sibling audits wouldn't surface?

### Purpose

Run a phased 10-iter deep-research investigation that (1) catalogs the recent arcs' patterns + findings, (2) maps each to deep-agent-improvement applicability, (3) outputs a prioritized improvement packet roadmap.

> **Phase-parent note:** This parent tracks the child phase map only. The 10-iter dispatch lives in child 001.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 10-iter deep-research dispatch (mixed-executor)
- Iters 1-8: cli-devin SWE-1.6
- Iters 9-10: cli-codex gpt-5.5 high fast (synthesis + final convergence claim)
- Applicability mapping: each recent-arc pattern → APPLY / SKIP / ADAPT / ALREADY-DONE for deep-agent-improvement
- Adversarial sweep on deep-agent-improvement code + docs
- Adjudication iter (filter false-positives)
- 3-packet (or similar) follow-on improvement roadmap

### Out of Scope

- Implementing improvements (separate downstream packets)
- Modifying deep-review / deep-research / deep-loop-runtime
- Changing deep-agent-improvement runtime behavior (this packet RESEARCHES only)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | 10-iter mixed-executor dispatch | Iters 1-8 cli-devin swe-1.6; iters 9-10 cli-codex gpt-5.5 high fast |
| REQ-002 | Per-iter SIGKILL between dispatches | Memory rule on Mac memory pressure |
| REQ-003 | research-report.md + prioritized packet roadmap | Verdict PASS hasAdvisories OR PASS |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: 10 iters complete with per-iter narrative + delta JSONL
- SC-002: research-report.md authored per output schema
- SC-003: Strict-validate PASS on parent + 3 children
- SC-004: Prioritized improvement roadmap concrete enough to execute downstream
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | False-positive rate on adversarial passes (precedent: 9/11 in 119) | Iter-7 cross-finding adjudication; iter-9 cli-codex synthesis filter |
| Risk | Memory pressure across 10 iters | Per-iter SIGKILL between (proven pattern from 119) |
| Risk | deep-agent-improvement scope misalignment with deep-review/research pattern | Iter-4 deep-agent-improvement-specific gap pass |
| Dep | 117/118/119/120/121/122 packets shipped | All present on origin/main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01** (Performance): each iter ≤15 min wall-clock; total ≤2h
- **NFR-R01** (Reliability): per-iter dispatch isolated; failure of one iter doesn't cascade
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Devin output skips delta JSONL: capture manually from log (precedent: 119/iter-7)
- Codex iter-10 echoes prompt template: capture findings from iter-9 synthesis (precedent: 119/iter-10)
- Convergence reached early: continue per user 10-iter directive; ratify in synthesis
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Phased + mixed executors + multi-arc inventory (117-122) |
| Risk | 12/25 | False-positive precedent; mitigated by adjudication iter |
| Research | 18/20 | Pure research; ~2h compute |
| Multi-Agent | 12/15 | Per-iter dispatch with executor handoff at iter-9 |
| Coordination | 10/15 | Mixed-executor handoff |
| **Total** | **70/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | High false-positive rate inflates uplift queue | M | M | Iter-7 adjudication + iter-9 synthesis |
| R-002 | Mac memory pressure during cli-devin iters | M | L | Per-iter SIGKILL; orphan sweep |
| R-003 | deep-agent-improvement structural difference makes review/research patterns inapplicable | M | M | Iter-4 explicit DR-specific gap pass |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Apply Recent Skill Learnings Across Sibling Skills (Priority: P2)

**As a** maintainer of the skilled-agent-orchestration track, **I want** a documented + adjudicated uplift plan for deep-agent-improvement, **so that** the skill incorporates the patterns proven in arcs 117-122 rather than diverging.

**Acceptance**: prioritized packet roadmap with each packet citing the iter that surfaced the finding + the iter that confirmed it (mirror 119 evidence model).
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status | Level |
|-------|--------|-------|--------|-------|
| 001 | `001-research-recent-updates/` | 10-iter deep-research dispatch | Active | 3 |
| 002 | `002-applicability-analysis/` | Map each 117-122 pattern → deep-agent-improvement applicability | Planned | 2 |
| 003 | `003-improvement-recommendations/` | Prioritized improvement packet roadmap | Planned | 2 |

### Phase Transition Rules

- 001 → 002: 10-iter dispatch must produce `research-report.md` synthesis
- 002 → 003: applicability mapping must classify all surveyed patterns as Apply / Skip / Adapt
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Does deep-agent-improvement need a sibling `deep-loop-runtime` consumption? Or does it run pure in-skill?
- Should the adjudication iter pattern (119/iter-7) be a permanent part of deep-agent-improvement's loop?
- Are there agent-improvement-specific patterns NOT in deep-review/research (e.g. promotion gates, scoring rubrics) that warrant their own arc?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessors**: `../117-deep-loop-core-isolation-deliberation/`, `../118-deep-loop-full-isolation-no-mcp/`, `../119-deep-research-uplift/`, `../120-deep-research-iteration-ordering-fix/`, `../121-deep-research-uncovered-questions/`, `../122-deep-research-hygiene-fix-pack/`
- **Target skill**: `../../skills/deep-agent-improvement/SKILL.md`
- **Next active phase**: `001-research-recent-updates/`
