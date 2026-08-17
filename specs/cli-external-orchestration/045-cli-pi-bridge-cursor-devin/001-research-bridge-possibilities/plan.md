---
title: "Research Plan: Native Bridge Paths for Cursor & Devin Models in cli pi"
description: "Two-model forced-depth deep-research design for the cli-pi bridge feasibility question."
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/045-cli-pi-bridge-cursor-devin/001-research-bridge-possibilities"
    last_updated_at: "2026-08-17T11:46:00Z"
    last_updated_by: "claude"
    recent_action: "Research plan recorded post-run"
    next_safe_action: "Close packet"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "research-045-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Research Plan: Native Bridge Paths for Cursor & Devin Models in cli pi

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
The question spans three live CLI surfaces (`pi`, `cursor-agent`, `devin`), their auth/config stores, their model APIs, and the vendors' Terms of Service.

### Overview
Run two independent 5-iteration deep-research lineages (forced depth, no early convergence) on different executors, gather first-hand evidence per iteration, and consolidate into a ranked verdict.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Both executor CLIs available and authenticated.
- Bound spec folder as write authority.

### Definition of Done
- Consolidated `research/research.md` with a ranked verdict.
- Both lineages ran to their iteration cap.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out of two CLI research lineages into isolated lineage dirs, consolidated by a synthesis pass.

### Key Components
- `grok-cursor` lineage (cli-cursor / cursor-grok-4.6-xhigh).
- `glm-devin` lineage (cli-devin / glm-5-2).
- Consolidated synthesis at `research/research.md`.

### Data Flow
Live CLI/ToS evidence → per-iteration findings → per-lineage synthesis → consolidated cross-model synthesis.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Bind spec folder, configure the two-lineage forced-depth fan-out.

### Phase 2: Core Implementation
Run both lineages to 5 iterations each; each gathers first-hand evidence and externalizes findings.

### Phase 3: Verification
Consolidate both syntheses, confirm cross-model agreement, record the ranked verdict.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Evidence provenance: every finding cites a live CLI surface, config path, or official ToS.
- Cross-model check: compare the two lineages' verdicts for agreement or divergence.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `cli-cursor` and `cli-devin` executors (fixed by packet 046 for the current devin CLI).
- Live network access to the vendors' ToS and API docs.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research-only; no runtime change to roll back. Artifacts are confined to this packet's `research/` tree.

<!-- /ANCHOR:rollback -->
