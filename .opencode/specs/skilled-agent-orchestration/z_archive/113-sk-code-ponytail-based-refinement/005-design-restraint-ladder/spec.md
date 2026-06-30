---
title: "Phase 5: Design Restraint Ladder in sk-code Phase 1 (HIGHEST RISK)"
description: "Encode ponytail's 6-rung 'do you really need this?' ladder as a ~15-line subsection in sk-code's always-loaded universal quality doc, attached at the Phase 0->1 transition and gated to implementation intent — run AFTER surface+intent routing. The only recommendation touching the actual workflow; its clean integration must be proven before merge."
trigger_phrases:
  - "phase 5 design restraint ladder"
  - "decision ladder sk-code"
  - "do you really need this gate"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/z_archive/113-sk-code-ponytail-based-refinement/005-design-restraint-ladder
    last_updated_at: 2026-06-13T11:40:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 5 stub created from 146 research rec #1 (highest-value, highest-risk)"
    next_safe_action: "/speckit:plan; PROVE no break to surface-router precedence / Iron Law before implementing"
---
# Phase 5: Design Restraint Ladder in sk-code Phase 1

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
| **Parent** | `142-sk-code-ponytail-based-refinement` (phase 5 of 6) |
| **Source rec** | research.md #1 — highest VALUE but the highest-RISK ADOPT-NOW item (per round-2 verify) |
| **Risk** | HIGH — touches the Phase-1 workflow + surface-router precedence + Iron Law |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

sk-code has the anti-over-engineering *principle* (CLAUDE.md anti-pattern table, sk-code-review KISS) but in reactive/post-write form — there is no ordered, stop-at-first-rung, **pre-write** search procedure. Ponytail's ladder (YAGNI → stdlib → native → installed-dep → one-line → minimal custom) is exactly that. Purpose: add it as a cheap pre-implementation gate without breaking the surface router or the Iron Law.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A ~15-line "Design Restraint Ladder" subsection in the **already always-loaded** `references/universal/code_quality_standards.md` (NOT a new routable file — that trips the router-sync drift guard).
- A one-line precondition at the Phase 0→1 transition in `references/phase_detection.md`, gated to intent=IMPLEMENTATION, running AFTER surface+intent routing.
- One Phase Overview row in `SKILL.md`.
- Reference (not restate) the CLAUDE.md anti-pattern table.

### Out of Scope
- A new `references/` file or `RESOURCE_MAP` key (drift-guard violation + itself a ladder violation).
- Ponytail's intensity state-machine or the `ponytail:` brand.
- Importing "a reflex, not a research project" literally (collides with READ-FIRST); reframe as a post-read reflex.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/references/universal/code_quality_standards.md` | Update | Add the ~15-line ladder subsection. |
| `.opencode/skills/sk-code/references/phase_detection.md` | Update | 0→1 precondition: "…and the laziest viable rung has been selected." |
| `.opencode/skills/sk-code/SKILL.md` | Update | One Phase Overview row. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ladder added in the always-loaded doc | Subsection present in `code_quality_standards.md`; no new routable file/RESOURCE_MAP key. |
| REQ-002 | Runs after surface+intent routing, gated to IMPLEMENTATION | The gate consumes the surface result (OPENCODE>WEBFLOW>UNKNOWN), never competes with it. |
| REQ-003 | Integration proven, not asserted | A representative routing scenario shows no break to surface precedence or the Iron Law; router-sync drift guard still green. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | YAGNI-skip routes through SCOPE-LOCK | "Challenge the requirement" surfaces a scope-amendment recommendation; never silent scope-cutting. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On an implementation task, the ladder prompts the stdlib→native→one-line search before new code.
- **SC-002**: Surface routing + the Iron Law + the router-sync guard are unaffected (proven, not assumed).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Ladder breaks surface-router precedence or the phase model | Mis-routing | Run AFTER surface detection; prove with a routing scenario before merge (REQ-003). |
| Risk | "Reflex not research" collides with READ-FIRST | Contradiction | Reframe as a post-read reflex (rungs 2/4 require reading existing code/deps). |
| Dependency | Cheaper phases (1–4) land first | Sequencing | Bank the low-risk wins before this workflow change. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-Q01**: Subsection ≤ ~15 lines (itself a ladder discipline); cross-reference, don't duplicate.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Mixed-surface task** (.opencode + webflow markers): OPENCODE wins precedence; the ladder uses that surface's rung vocabulary.
- **Non-implementation intent** (review/debug): the gate does not fire (gated to IMPLEMENTATION).

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Exact attach mechanism: transition-guard prose vs a checklist item — decide during plan, prove integration either way.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research**: `../research/research.md` (rec #1; round-2 risk note)
- **Targets**: `.opencode/skills/sk-code/references/universal/code_quality_standards.md`, `phase_detection.md`, `SKILL.md`

<!-- /ANCHOR:related-docs -->
