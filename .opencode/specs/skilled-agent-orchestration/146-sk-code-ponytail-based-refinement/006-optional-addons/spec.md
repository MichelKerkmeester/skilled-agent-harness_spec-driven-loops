---
title: "Phase 6 (optional): Smaller + Heavier Add-ons"
description: "Lower-urgency ponytail-derived add-ons: a code_loc/over-engineering metric folded into the existing correctness-gated benchmark, a SK_CODE_REVIEW_DEPTH env alias for the existing ON_DEMAND tier, an implementer anti-stall rule, and optional startup/typing hooks. Each needs a decision or carries upkeep cost; ship after the core phases."
trigger_phrases:
  - "phase 6 optional addons"
  - "sk-code-review depth alias"
  - "loc benchmark metric"
  - "anti-stall rule"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/146-sk-code-ponytail-based-refinement/006-optional-addons
    last_updated_at: 2026-06-13T11:40:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 6 stub created from 146 research recs #9/#11 (ADOPT-LATER)"
    next_safe_action: "/speckit:plan per add-on as prioritized; each is independent"
---
# Phase 6 (optional): Smaller + Heavier Add-ons

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete — 2 add-ons shipped; 2 deferred (operator-optional) |
| **Parent** | `146-sk-code-ponytail-based-refinement` (phase 6 of 6) |
| **Source recs** | research.md #9 (benchmark metric), #11 (depth alias / anti-stall rule / hooks) |
| **Risk** | Mixed — hooks carry the most upkeep; benchmark is eval-only |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Four lower-urgency improvements remain after the core phases. They are real but each needs a decision or carries maintenance cost, so they are bundled as an optional, independently-shippable phase rather than blocking the high-value work.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (each independently optional)
- **Benchmark metric (#9):** fold a `code_loc` + over-engineering-markers metric into the existing deep-improvement Lane B sweep, reported only after the correctness gate (which ponytail's harness omits).
- **Review-depth alias (#11):** a `SK_CODE_REVIEW_DEPTH` env var (env>config>default) that NAMES + persists the existing ON_DEMAND tier — alias only, floors immutable.
- **Anti-stall rule (#11):** an implementer `sk-code` §4 RULES bullet: build the simplest correct implementation of the requirement as specified, raise a scope-amendment in the same response, never silent scope-cutting (SCOPE-LOCK), never block when a safe minimal version exists.
- **Hooks (#11):** optional SessionStart surface-priming + UserPromptSubmit standards-injection (compact, generated) — highest upkeep due to 3-runtime wiring.

### Out of Scope
- A standalone PromptFoo clone (DO-NOT-ADOPT — duplicates the existing sweep).
- Any LOC/`net -N` value used as a severity gate (DO-NOT-ADOPT).
- A repo-visible `.sk-code-active` flag file by default (use a runtime cache only if accepted).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs` (+ sweep-reporter) | Update | code_loc / over-engineering markers behind the correctness gate. |
| `.opencode/skills/sk-code-review/SKILL.md` | Update | `SK_CODE_REVIEW_DEPTH` env alias over ON_DEMAND. |
| `.opencode/skills/sk-code/SKILL.md` | Update | Implementer anti-stall RULES bullet. |
| `.opencode/skills/sk-code/scripts/hooks/` + runtime settings | Create | Optional surface-priming / standards-injection hooks. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete per chosen add-on)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Benchmark metric is correctness-gated | `code_loc` reported only among correctness-eligible outputs; never a verdict by itself. |
| REQ-002 | Depth alias does not lower floors | `SK_CODE_REVIEW_DEPTH` only names the existing ON_DEMAND tier; ALWAYS/security minimums immutable. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Anti-stall respects SCOPE-LOCK | The rule never licenses silent scope-cutting; the "question" half routes through escalation. |
| REQ-004 | Hooks fail open + are 3-runtime consistent | Any new hook is non-blocking and wired across `.opencode`/`.claude`/`.codex` or explicitly scoped. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each shipped add-on is independent, reversible, and carries no severity-model change.
- **SC-002**: No DO-NOT-ADOPT item leaks in (no clone, no numeric gate, no default flag file).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hooks add 3-runtime maintenance for marginal gain | Upkeep | Keep injected content compact + generated from one source; treat as lowest priority. |
| Risk | Benchmark runs are heavy/noisy | Cost | Add one metric to the existing sweep, do not build new infra. |
| Dependency | None hard; benefits from the depth alias landing after the review phases | Sequencing | Ship à la carte. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: Every add-on is independently revertible.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **LOC rewards under-solving**: only valid behind the correctness gate; never standalone.
- **Depth alias misread as a floor relaxer**: docs must state it cannot lower ALWAYS/security tiers.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Which of the four add-ons (if any) are worth doing — operator prioritization decision.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research**: `../research/research.md` (recs #9, #11; ADOPT-LATER bucket)
- **Existing infra**: `.opencode/skills/deep-improvement/scripts/model-benchmark/`

<!-- /ANCHOR:related-docs -->
