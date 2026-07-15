---
title: "Feature Specification: command contract adapter — a deterministic sk-doc peer adapter over the whole command corpus"
description: "Implements the sk-doc-command peer adapter on the deep-alignment three-method contract, extends the reusable reference checks to every command topology, and proves exact fixture outcomes without duplicating generic document validation."
status: planned
trigger_phrases:
  - "sk-doc-command adapter"
  - "command contract adapter"
  - "peer adapter deep-alignment"
  - "command reference checks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/003-command-contract-adapter"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the adapter child that implements the deterministic command axis"
    next_safe_action: "Implement the peer adapter discover and check methods against the fixtures"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: command contract adapter — a deterministic sk-doc peer adapter over the whole command corpus

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deterministic axis needs an adapter that audits structural command integrity across the whole corpus deeper than the generic document validators. This phase implements sk-doc-command as a peer adapter on the existing three-method contract, reusing the reference-checks tool and the sync inventory, and proves it against the frozen fixtures.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Implement sk-doc-command with discover, standardSource, and check over the canonical command set.
- Run dimensions S1 to S5 mirror identity, target reachability, route-graph integrity, capability and safety consistency, and presentation ownership.
- Extend the reusable reference checks to all four command topologies.
- Prove exact fixture outcomes against the independent oracle expectations.
- Author the adapter references `sk_doc_command_adapter.md` and `sk_doc_command_known_deviations.md`, and point `standardSource` at command canon, the reference checks, the sync inventory, and the peer-specific deviations.

**Out of scope:**
- Registering the lane or running the full corpus in a live alignment run (next phase).
- Behavioral scenarios or the model matrix.
- Re-running or reclassifying generic document validation.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Implement the three-method contract so discover equals the canonical source inventory and check emits P0 to P2 findings for S1 to S5.
- **REQ-002 (P0):** Match every public and held-out fixture expected defect set exactly, importing no oracle logic.
- **REQ-003 (P1):** Reuse the reference-checks tool and the sync inventory rather than reimplementing mirror and reachability logic.
- **REQ-004 (P1):** Emit no generic document-validation finding types and never mark generic validation as a known deviation.
- **REQ-005 (P2):** Conservatively flag only explicit duplicated presentation blocks or exact asset leakage, never natural-router prose.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A node syntax check on the adapter passes and the adapter test suite exits 0.
- The discovery set equals the canonical source inventory.
- Every fixture outcome matches the frozen oracle expectation.
- No generic document-validation finding types appear.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Presentation false positives on legitimate inline instructions, mitigated by conservative explicit-block matching.
- Duplicate signal with generic validation, mitigated by an ownership boundary that excludes generic finding types.
- Dependencies: the fixtures and oracle, the reference-checks tool, and the sync inventory.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether route-graph integrity for subaction routers needs hermetic route fixtures beyond the defect corpus.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 002-deterministic-fixtures-oracle. Successor: 004-command-lane-integration.
