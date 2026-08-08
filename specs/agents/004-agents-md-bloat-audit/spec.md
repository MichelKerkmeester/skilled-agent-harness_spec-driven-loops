---
title: "Feature Specification: AGENTS.md Bloat Audit [specs/agents/004-agents-md-bloat-audit]"
description: "Read-only deep-research audit of the root AGENTS.md for removable or reducible bloat: redundancy across sections, over-long prose, content already authoritative in referenced files, verbose tables/examples, and low-value boilerplate. Produces a ranked findings report with rationale and rough line savings."
trigger_phrases:
  - "agents.md bloat"
  - "redundancy"
  - "compress"
  - "authoritative"
  - "line savings"
  - "boilerplate"
  - "audit"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "agents/004-agents-md-bloat-audit"
    last_updated_at: "2026-08-07T14:58:00Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Completed 5-iteration read-only bloat audit of root AGENTS.md via fan-out lineage"
    next_safe_action: "Run /speckit:plan to turn ranked findings into concrete AGENTS.md edits"
    blockers: []
    key_files:
      - "AGENTS.md"
      - "research/research.md"
    completion_pct: 100
    open_questions:
      - "F2-6 staleness: does the MCP memory_save path emit POST-SAVE QUALITY REVIEW? If yes keep and re-anchor L188-191, else remove."
    answered_questions:
      - "~75 removable physical lines (~13.5% of 555) plus ~35-40 line-equivalents of byte-only compression"
---
# Feature Specification: AGENTS.md Bloat Audit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root `AGENTS.md` (555 lines, 47,110 bytes) carries internal redundancy (the same rule stated in 2–3 places), distilled duplication of authoritative files whose pointers are broken or verbose, over-long prose blocks, and low-value boilerplate (emoji decoration, inline mechanics). Auditing it is hard because bloat is distributed and savings are not counted consistently.

### Purpose
Produce a ranked findings report of concrete removable/reducible candidates in `AGENTS.md` with rationale and rough line savings, so a follow-up `/speckit:plan` can make surgical, low-risk edits that preserve every unique normative constraint.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only audit of the root `AGENTS.md` (no edits during the research loop).
- Ranked candidate list with per-candidate line spans, savings estimates, and rationale.
- Baseline section map, eliminated-alternatives (negative knowledge), and preserve set.

### Out of Scope
- Any edit or rewrite of `AGENTS.md` itself — implementation is a separate follow-up packet.
- .codex/AGENTS.md, CLAUDE.md, or other runtime doc files unless the audit surfaces cross-file duplication evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/**` | Create | Workflow-owned deep-research outputs (lineage, iterations, registries, research.md) |
| `spec.md` | Create | Seeded by deep-research with generated findings fence at synthesis |

<!-- DR-SEED:SCOPE -->
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Research loop completes all iterations (maxIterations=5) and synthesizes `research/research.md` | `research/research.md` exists with ranked findings, baseline map, eliminated alternatives, preserve set, and convergence report |
| REQ-002 | Findings are evidence-backed | Each candidate cites file:line spans and rough line-savings; arithmetic recounted via `nl -ba` |

<!-- DR-SEED:REQUIREMENTS -->
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A ranked, deduped candidate list (Tier 1/2/3) with total physical-line savings (~75 lines ≈ 13.5%).
- **SC-002**: A preserve set that explicitly protects all unique normative constraints (Four Laws, gates, verification standards).
- **SC-003**: Broken-pointer findings (F1-1: 7 `constitutional/*.md` paths) flagged for fixing in the same pass as their dependent candidates.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Pointer-following reliability | Compressed guardrail detail not read by consumers | Keep rule headlines salient (Tier 2 keeps the two most load-bearing git rows) |
| Risk | F2-6 staleness misclassified | Remove a block that is actually MCP-required, or keep stale prose | Flag for human verification of the `memory_save` path (4 lines at risk) |
| Risk | F1-1 broken paths orphan rules if removed | Removing rule text leaves rules unanchored | Fix pointers to `.opencode/skills/system-spec-kit/constitutional/`, never delete the rule text |
| Dependency | Line anchors may shift after edits | Savings ledger drifts | Recount spans (`nl -ba`) at implementation time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- F2-6 staleness: does the MCP `memory_save` path emit a POST-SAVE QUALITY REVIEW? If yes, keep and re-anchor §2 L188–191; else remove. — **UNKNOWN; needs human verification. 4 lines at risk.**

<!-- BEGIN GENERATED: deep-research/spec-findings -->
_Source: `research/research.md` (single-lane `pi` fan-out synthesis, maxIterations=5). Do not edit inside this fence._

- **Total savings: ~75 removable physical lines (≈13.5% of 555) plus ~35–40 line-equivalents of byte-only compression and ~20 tokens of emoji decoration.**
- **Tier 1 (low risk, ~54 lines):** F2-4 §3 Spec Folder Documentation → pointer (~14); F1-2/F2-2 daemon CLI guidance consolidated (~11); F2-3 §5 MCP Tool Routing → compact table (~10); F1-3 Final-State + Completion Verification gates merged (~7); F4-7/F3-6 §9 advisor-metadata paragraph (~5); F4-3 §1 Dispatch Rules rows (~4); F4-4 §10 rows inline mechanics dropped (~4).
- **Tier 2 (moderate risk, ~17 lines):** F1-5 ask-first merge (~3); F2-1 git-safety 6 rows → 3 (~3); F2-5 Gate-3 edge paragraphs (~3); F4-1 header routing prose (~2); F1-6 code-search bullet (~2); F1-8 validate.sh pointer (~2); F4-6 Directive Capsule (~2).
- **Tier 3 (small fixes, ~4 lines):** F1-7 memory_search note (~1); F1-4 resume ladder row (~1); F4-5 comment-hygiene pointer (~1).
- **Preserve set:** Four Laws, PLAN-WORKFLOW LOCK, Halt Conditions, Gate 1–4 prose, §1 Verification Standards + Task-specific proof tables, §4 Anti-Patterns + Analysis Lenses, §7 Confidence, §8 Communication Quality, §10 rows as pointers. No candidate removes a unique normative rule.
- **F1-1 blocker:** all 7 `constitutional/*.md` paths are broken; authoritative copies live at `.opencode/skills/system-spec-kit/constitutional/`. Fix pointers in the same pass as F4-3/F4-5.
- **F2-6 staleness flag (not bloat):** §2 Post-Save Review (L188–191) describes a POST-SAVE QUALITY REVIEW output generate-context.js does not emit — either the MCP `memory_save` path emits it (UNKNOWN) or the block is stale. Needs human verification.
- **Convergence:** stop reason maxIterationsReached (policy max-iterations); newInfoRatio trend 1.00 → 0.80 → 0.55 → 0.45 → 0.15 (monotonic decline; territory exhausted).
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
