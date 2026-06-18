---
title: "Decision Record: deep-loop-runtime ownership extension for the deep-loop-workflows merge"
description: "ADR authorizing the deep-loop-runtime backend promotions and naming deep-loop-workflows the single consumer skill, plus the resolved nested-graph-metadata.json discovery rule (B5)."
trigger_phrases:
  - "deep-loop-runtime ownership adr"
  - "deep-loop-workflows backend promotions"
  - "nested graph-metadata discovery rule"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr"
    last_updated_at: "2026-06-15T05:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored runtime-ownership ADR and B5 discovery rule"
    next_safe_action: "Execute phase 002 runtime promotions under this ADR"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-001-decision-record"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: deep-loop-runtime ownership extension

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Extend deep-loop-runtime ownership and name deep-loop-workflows the single consumer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-15 |
| **Deciders** | Operator + orchestrator |
| **Phase** | 001 (foundation) |

### Context

`deep-loop-runtime` (created by the FULL_ISOLATE_NO_MCP consolidation) is the MCP-free shared backend for the five deep-loop workflow skills. Its own SKILL.md ESCALATE rule requires a new ownership ADR before a consumer skill beyond `deep-review`/`deep-research` may depend on it, and before the runtime is extended. The merge collapses the five persona skills into one consumer, `deep-loop-workflows`, and promotes a small set of generic plumbing into the runtime so the two-skill architecture is self-contained. Separately, a keystone risk (research blocker B5) had to be resolved before any packet move: the advisor scanner's discovery behavior.

### Constraints

- The runtime stays MCP-free; no MCP tool may be reintroduced.
- Promotions must be generic plumbing only — never a mode's convergence body, and never an `improvement` `loopType`.
- The merge must preserve byte-identical per-mode artifacts; the phase-001 baseline (924-file hash manifest, manifest sha `6bbdfa27…`, plus the advisor routing baseline) is the reference.

### Decision

1. Extend `deep-loop-runtime` ownership to a single new consumer, `deep-loop-workflows`, and authorize promoting into the runtime: the parameterized capability resolver, the loop-lock CLI adapter, `resolveArtifactRoot`, and the terminal journal taxonomy (6 `stopReason` + 4 `sessionOutcome`). `emitResourceMap` stays a workflows-shared synthesis primitive, not a backend module.
2. **B5 discovery rule (RESOLVED):** the advisor scanner `discoverGraphMetadataFiles` (skill-graph-db.ts:601-626) recursively discovers every `graph-metadata.json` and `parseSkillMetadata` throws when `skill_id ≠ folder name`. Therefore the merged mode packets MUST drop their per-mode `graph-metadata.json`; only the hub `deep-loop-workflows/graph-metadata.json` survives. Nested `SKILL.md` files are harmless (discovery keys on `graph-metadata.json`).

### Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Keep five sibling skills (no merge) | Preserves the five-ID routing/doc/governance brittleness the merge exists to remove; advisor identity is folder-bound so siblings cannot collapse routing. |
| Fold per-mode reducers into a parameterized runtime reducer | The four reduce-state bodies are genuinely mode-specific convergence logic; only ~178 helper lines are shared. Promote plumbing, keep reducers per-mode. |
| Add an `improvement` `loopType` to runtime convergence | Improvement is config-driven plateau/trajectory, not graph-substrate saturation; it would force a second, conflicting convergence contract. |

### Consequences

- Positive: a self-contained two-skill architecture; one advisor identity; deduplicated plumbing; the packet layout is proven safe (drop nested `graph-metadata.json`).
- Negative / risk: the runtime gains surface (mitigated by contract tests in phase 002); the advisor migration (phase 006) must family-fix before old-ID removal or routing fails closed.

### Implementation

Promotions land in phase 002 (with runtime tests, no behavior delta). The B5 rule is applied in phase 003 (packets drop `graph-metadata.json`). Parity is verified against the phase-001 baseline at each subsequent phase; the five old directories survive until phase 009.

<!-- /ANCHOR:adr-001 -->
