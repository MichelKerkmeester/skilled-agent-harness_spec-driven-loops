---
title: "Implementation Plan: Tri-System Deep Research Program [template:examples/level_1/plan.md]"
description: "Plan for executing fifty read-only research iterations over the three system skills with orchestrator-written state."
trigger_phrases:
  - "tri-system deep research plan"
  - "research iteration plan"
  - "50 angle execution"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/028-tri-system-deep-research"
    last_updated_at: "2026-06-12T00:50:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored program plan and seat protocol"
    next_safe_action: "Dispatch research iterations in pooled read-only seats"
---
# Implementation Plan: Tri-System Deep Research Program

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | cli-opencode gpt-5.5-fast (high) read-only seats |
| **Framework** | deep-research layout with orchestrator-written state |
| **Storage** | Packet-local `research/` artifacts |
| **Testing** | Findings require file:line evidence; synthesis re-verifies high-severity claims |

### Overview
Fifty angles execute as fifty pooled read-only research seats. The orchestrating session extracts each seat's findings JSON, writes the iteration report and delta rows, and synthesizes progressively into the findings registry. No seat writes to the tree; no live daemon or database is mutated.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Fifty angles authored in the strategy document.
- [x] Recovery chain complete and daemons quiet enough for honest reads.
- [x] Seat brief template with findings JSON contract prepared.

### Definition of Done
- [ ] 50/50 iterations recorded with parseable findings.
- [ ] Findings registry synthesized and classified.
- [ ] Packet validates strict.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Angle-per-iteration fan-out: pooled read-only analysis seats, orchestrator-owned state, progressive synthesis.

### Key Components
- **research/deep-research-strategy.md**: The fifty angles and the iteration protocol.
- **research/prompts/**: Per-iteration seat briefs.
- **research/iterations/ + research/deltas/**: Orchestrator-written per-iteration reports and finding rows.
- **research/research.md**: Progressive synthesis and final registry.

### Data Flow
Brief in, JSONL stream out: the seat investigates its angle against the real tree, emits a fenced findings JSON, and the orchestrator parses, persists, and aggregates it.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Author angles and program configuration.
- [x] Scaffold packet documents and research directories.

### Phase 2: Core Implementation
- [ ] Dispatch iterations 1-50 in a pool of three seats with stagger.
- [ ] Persist iteration reports, deltas, and state events per completion.

### Phase 3: Verification
- [ ] Re-verify high-severity findings directly before they enter the registry.
- [ ] Synthesize `research/research.md` and validate the packet strict.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence gate | Every finding names file:line or a reproducing command | Orchestrator parse-time rejection of evidence-free findings |
| Verification | High-severity findings re-checked in-session | Direct reads and reproducing commands |
| Structural | Packet document compliance | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/028-tri-system-deep-research --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-opencode gpt-5.5-fast availability | External | Green | Iterations cannot dispatch |
| Warm spec-memory daemon | Internal | Recovering | Seats probing live surfaces read degraded state |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Seat pool produces systematically unparseable output or quota exhaustion.
- **Procedure**: Halt dispatch, keep completed iterations (state is append-only), resume from the first missing iteration after adjusting brief or executor.

<!-- /ANCHOR:rollback -->
